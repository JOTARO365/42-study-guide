/* Round two, English. Mirrors data.python.deep2.js block for block. */
(function () {

  var EN = {
    py_toolkit: {
      theory: [
        { h: "Module 08 — where pip and Poetry actually differ" },
        { p: "The difference is not how the commands are spelled but **who resolves a version conflict**. Picture a project needing two libraries that each need a third, in incompatible ranges." },
        { code: String.raw`# requirements.txt
alpha>=2.0        # needs shared>=1.0,<2.0
beta>=3.0         # needs shared>=2.0`,
          cap: "These two cannot coexist, and pip does not know until it installs", lang: "text" },
        { table: { head: ["Stage", "pip", "Poetry"], rows: [
          ["reading the file", "line by line", "the whole graph first"],
          ["on a conflict", "installs whichever `shared` the later one asked for, over the first", "refuses before installing anything"],
          ["the result", "installation succeeds and `alpha` breaks at runtime", "a failure that names the incompatible pair"],
          ["what gets recorded", "`pip freeze` records what happened to land", "`poetry.lock` records what was computed to be consistent"],
          ["the next machine", "may get a different set", "gets exactly the same set"]
        ]}},
        { code: String.raw`# requirements.txt — states an accepted range, not the version in use
numpy>=2.0,<3.0
pandas>=2.2,<4.0
matplotlib>=3.8,<4.0`,
          cap: "The `<` at the next major keeps out an update that is allowed to break the API", lang: "text" },
        { code: String.raw`[project]
name = "matrix-loading"
version = "1.0.0"
requires-python = ">=3.10"
dependencies = [
    "numpy>=2.0,<3.0",
    "pandas>=2.2,<4.0",
    "matplotlib>=3.8,<4.0",
]

[tool.poetry]
package-mode = false`,
          cap: "pyproject.toml — declare the intent and let the resolver find the versions", lang: "toml" },
        { note: "`poetry.lock` is committed and `.venv` is not. The lock file describes the environment; `.venv` is the environment, and it can always be rebuilt from the lock file." },
        { h: "Checking dependencies without falling over" },
        { code: String.raw`DEPENDENCIES = [
    Dependency("pandas", "Data manipulation"),
    Dependency("numpy", "Numerical computation"),
    Dependency("matplotlib", "Visualization"),
]


def check_dependencies() -> dict[str, Any]:
    """Report on all of them, and return the ones that loaded."""
    print("Checking dependencies:")
    loaded: dict[str, Any] = {}
    for dependency in DEPENDENCIES:
        module = load(dependency.module)
        if module is None:
            print(f"[MISSING] {dependency.module} - {dependency.purpose} "
                  "unavailable")
            continue
        loaded[dependency.module] = module
        version = getattr(module, "__version__", "unknown")
        print(f"[OK] {dependency.module} ({version}) - "
              f"{dependency.purpose} ready")
    return loaded`,
          cap: "Report everything first, then decide — do not stop at the first missing one", lang: "python" },
        { code: String.raw`$ python3 ex1/loading.py            # with nothing installed
LOADING STATUS: Loading programs...
Checking dependencies:
[MISSING] pandas - Data manipulation unavailable
[MISSING] numpy - Numerical computation unavailable
[MISSING] matplotlib - Visualization unavailable
Cannot analyse anything without those packages.
With pip:
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
With Poetry:
  poetry install
  poetry run python3 loading.py
$ echo $?
1`,
          cap: "A non-zero exit, because the job it set out to do was not done", lang: "bash" },
        { note: "Select the `Agg` backend before importing `matplotlib.pyplot`, or a machine with no display — a build server, an evaluation over ssh — cannot import it at all, for a program that only saves a file. Seed numpy's generator too, or the figure changes on every run." },
        { h: "Configuration precedence" },
        { code: String.raw`from dotenv import load_dotenv

from_shell = {key for key in KEYS if key in os.environ}   # read first!
load_dotenv(ENV_FILE, override=False)                     # fill the gaps
from_file = {key for key in KEYS
             if key in os.environ and key not in from_shell}`,
          cap: "os.environ has to be read first, or the two sources become indistinguishable", lang: "python" },
        { table: { head: ["Run as", "`MATRIX_MODE`", "Came from"], rows: [
          ["`python3 oracle.py` (no .env)", "development", "the built-in default"],
          ["`python3 oracle.py` (with .env)", "whatever the file says", "the .env file"],
          ["`MATRIX_MODE=production python3 oracle.py`", "production", "the environment — it beats the file"],
          ["set in .env and in the shell", "the shell's value", "`override=False` is the default and is correct"]
        ]}},
        { p: "That last row is what makes deployment work — the server sets its secrets in the environment, and a developer's file that slipped into the image cannot overwrite them. Passing `override=True` reverses the direction immediately." },

        { h: "Module 09 — the order nested models are validated in" },
        { code: String.raw`try:
    SpaceMission(
        mission_id="X_BAD",                       # breaks the mission's rule
        crew=[{"member_id": "CM1", "name": "A", "rank": "cadet",
               "age": 9,                          # breaks the crew rule
               "specialization": "None", "years_experience": 0}],
        ...
    )
except ValidationError as error:
    for detail in error.errors():
        print(detail["loc"], detail["msg"])`,
          cap: "Two things are wrong, and only one is reported — why", lang: "python" },
        { code: String.raw`('crew', 0, 'age') Input should be greater than or equal to 18`,
          cap: "The output — not a word about mission_id", lang: "text" },
        { p: "Because **the inner models are validated first**. Once a crew member fails, there is no valid mission for the mission's own `@model_validator` to inspect, so it never runs. The ordering is useful: the error points at the cause rather than at a consequence." },
        { code: String.raw`# by contrast, several bad fields in the same model all report at once
try:
    CrewMember(member_id="X", name="Y", rank="cadet",
               age=9, specialization="Z", years_experience=99)
except ValidationError as error:
    print(len(error.errors()))     # 3 or more — id too short, name too short, age too low`,
          cap: "Pydantic does not stop at the first error within one level", lang: "python" },
        { code: String.raw`payload = mission.model_dump_json()
restored = SpaceMission.model_validate_json(payload)
assert restored == mission          # a round trip changes nothing

import json
decoded = json.loads(payload)
print(decoded["crew"][0]["rank"])   # 'commander' — the enum is its own text
print(type(decoded["launch_date"])) # <class 'str'> — the datetime is a string`,
          cap: "A str-Enum makes the data round-trip with no hand conversion", lang: "python" },
        { note: "`class ContactType(str, Enum)` — inheriting from `str` as well is what makes a member compare equal to its own text and serialise as it. Inheriting only from `Enum` means converting by hand everywhere it is written to JSON." },

        { h: "Module 10 — when to use a lambda and when to stop" },
        { code: String.raw`# use one — an expression handed straight to a higher-order function
ordered = sorted(artifacts, key=lambda a: a["power"], reverse=True)
strong = list(filter(lambda m: m["power"] >= 70, mages))
marked = list(map(lambda s: f"* {s} *", spells))

# stop — once there is a condition, a name worth having, or reuse
is_veteran = lambda m: m["power"] >= 70 and m["years"] > 5   # hard to read

def is_veteran(mage: Mage) -> bool:      # easier, and it can have a docstring
    """A mage who is both strong and experienced."""
    return mage["power"] >= 70 and mage["years"] > 5`,
          cap: "flake8 objects to naming a lambda too (E731)", lang: "python" },
        { p: "`sorted` is stable — two equal items keep their original order — so `reverse=True` is not the same as negating the key: negating reverses the equal items as well." },
        { code: String.raw`def power_amplifier(base_spell: Spell, multiplier: int) -> Spell:
    """Return a spell with the same signature, but stronger."""
    def amplified(target: str, power: int) -> str:
        return base_spell(target, power * multiplier)
    return amplified


def conditional_caster(condition: Condition, spell: Spell) -> Spell:
    """Return a spell that only casts when the condition holds."""
    def guarded(target: str, power: int) -> str:
        if condition(target, power):
            return spell(target, power)
        return "Spell fizzled"
    return guarded


# each modifier returns what it consumes, so they compose
guarded_mega = conditional_caster(lambda t, p: t != "Ally",
                                  power_amplifier(fireball, 3))`,
          cap: "This is why the signature must stay the same — so they stack", lang: "python" },
        { code: String.raw`import functools
import operator

OPERATIONS = {"add": operator.add, "multiply": operator.mul,
              "max": max, "min": min}


def spell_reducer(spells: list[int], operation: str) -> int:
    """Fold a sequence into a single value."""
    if operation not in OPERATIONS:
        raise ValueError(f"Unknown operation '{operation}'")
    if not spells:
        return 0
    return functools.reduce(OPERATIONS[operation], spells)`,
          cap: "operator exists because the + symbol cannot be passed as an argument", lang: "python" },
        { code: String.raw`@functools.singledispatch
def cast(spell: Any) -> str:
    """Any type nobody registered."""
    return "Unknown spell type"


@cast.register
def cast_damage(spell: int) -> str:
    return f"{spell} damage"


@cast.register
def cast_multi(spell: list) -> str:
    return f"{len(spell)} spells"`,
          cap: "The isinstance chain turned into a registry — a new type is one registration", lang: "python" },
        { note: "Give each implementation its own name rather than calling all three `_`, or flake8 reports F811 for redefinition — and `bool` lands in the `int` implementation, because it is a subclass." },
        { h: "A decorator is a function returning a function" },
        { code: String.raw`# @spell_timer above a def means exactly this line
fireball = spell_timer(fireball)

# and a decorator that takes arguments needs one more layer
# @power_validator(10) means
cast_spell = power_validator(10)(cast_spell)`,
          cap: "Everything else follows from these two lines", lang: "python" },
        { code: String.raw`def spell_timer(func: Callable[..., Any]) -> Callable[..., Any]:
    @functools.wraps(func)          # without this the name becomes wrapper
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        print(f"Casting {func.__name__}...")
        started = time.perf_counter()
        try:
            return func(*args, **kwargs)
        finally:
            elapsed = time.perf_counter() - started
            print(f"Spell completed in {elapsed:.3f} seconds")
    return wrapper`,
          cap: "Timing in a finally, so a spell that explodes still reports its time", lang: "python" },
        { p: "Use `perf_counter` rather than `time.time`: the first is monotonic and precise enough, while the wall clock can jump backwards when the machine adjusts its time." }
      ],

      dataflow: [
        { h: "oracle.py from end to end" },
        { table: { head: ["Stage", "Takes", "Passes on"], rows: [
          ["note what is already there", "`os.environ`", "the set of keys that came from the shell"],
          ["load the file", "`.env`, if present", "fills in only the keys still missing"],
          ["separate the sources", "`os.environ` afterwards", "the set of keys that came from the file"],
          ["decide the mode", "`MATRIX_MODE`", "development, production, or an error"],
          ["fill in or refuse", "the mode plus the missing keys", "a complete set, or a stop naming what is absent"],
          ["report", "the complete set", "text with the secrets withheld"],
          ["audit", "its own source plus `.gitignore`", "a pass/fail list"]
        ]}},
        { code: String.raw`def load_configuration(from_shell: set[str]) -> dict[str, str]:
    """Assemble the configuration, and refuse a broken production one."""
    mode = os.environ.get("MATRIX_MODE", DEVELOPMENT).strip().lower()
    if mode not in (DEVELOPMENT, PRODUCTION):
        raise ConfigurationError(
            f"MATRIX_MODE must be '{DEVELOPMENT}' or '{PRODUCTION}', "
            f"not '{mode}'",
            "Set MATRIX_MODE to one of the two known modes.")

    resolved: dict[str, str] = {"MATRIX_MODE": mode}
    missing: list[str] = []
    for key in KEYS[1:]:
        value = os.environ.get(key, "").strip()
        if value:
            resolved[key] = value
        elif mode == DEVELOPMENT:
            resolved[key] = DEV_DEFAULTS[key]      # filled in, and reported
        else:
            missing.append(key)                    # production fills nothing
    if missing:
        raise ConfigurationError(
            "production mode has no defaults; missing: " + ", ".join(missing),
            "In production every value must be supplied explicitly.")
    return resolved`,
          cap: "Only development invents a value, and it always says which", lang: "python" },
        { note: "**An empty string and whitespace are not values.** Calling `.strip()` and testing for emptiness is why `API_KEY=` in production must be refused rather than accepted as an empty key." },
        { code: String.raw`def describe_secret(value: str) -> str:
    """Enough to debug with, useless to whoever reads the log."""
    return f"set ({len(value)} characters)"`,
          cap: "A length catches a typo and does not unlock anything", lang: "python" }
      ]
    },

    amaze: {
      theory: [
        { h: "Carving with cells that must not be touched" },
        { p: "The whole algorithm is one loop. What makes it satisfy the other requirements as well is **the set of reserved cells**, handed in at the start rather than cut out afterwards." },
        { code: String.raw`def _carve_spanning_tree(self) -> None:
    """Carve a spanning tree, never entering a reserved cell."""
    start = self._first_open_cell()
    stack: list[Cell] = [start]
    visited: set[Cell] = {start}
    while stack:
        x, y = stack[-1]
        options = [(d, n) for d, n in self._neighbours((x, y))
                   if n not in visited and n not in self._reserved]
        if not options:
            stack.pop()                     # a dead end; back up one
            continue
        direction, neighbour = self._rng.choice(options)
        self._knock_down((x, y), direction)
        visited.add(neighbour)
        stack.append(neighbour)
    self._rescue_unreachable(visited)`,
          cap: "An explicit stack is what keeps 400x300 away from the recursion limit", lang: "python" },
        { p: "That last line is the insurance for the no-isolated-cells rule: after carving, walk the non-reserved cells and, for any the search never reached, open one wall towards the maze. It happens when the 42 fences off a small pocket." },
        { h: "Opening extra walls when PERFECT=False" },
        { p: "An imperfect maze is a perfect one with extra holes, and this is **the only place** the no-3x3 rule can be broken." },
        { code: String.raw`def _open_extra_walls(self) -> None:
    """Add cycles without ever creating a 3x3 open area."""
    candidates = [(cell, d) for cell in self._open_cells()
                  for d, n in self._neighbours(cell)
                  if self._grid[cell[1]][cell[0]] & d and n not in
                  self._reserved]
    self._rng.shuffle(candidates)
    quota = len(candidates) // 10          # open about one in ten
    for cell, direction in candidates[:quota]:
        if self._would_open_3x3(cell, direction):
            continue                        # tried it, no good, move on
        self._knock_down(cell, direction)`,
          cap: "Check before committing, rather than repairing afterwards", lang: "python" },
        { code: String.raw`def _would_open_3x3(self, cell: Cell, direction: int) -> bool:
    """Try it, look, and put it back either way."""
    self._knock_down(cell, direction)
    bad = self._has_open_block(3)
    self._put_back(cell, direction)
    return bad`,
          cap: "Try and back out — short to write and easy to prove right", lang: "python" },
        { note: "**A 2x2 open block is a cycle**, so with `PERFECT=True` the 3x3 rule holds automatically. The check is only needed in this mode — put it inside the opening loop, with no cleanup pass at the end." },
        { h: "The shortest path comes from BFS" },
        { code: String.raw`from collections import deque


def solve_cells(self) -> list[Cell]:
    """Return the shortest path from entry to exit, as cells."""
    start, goal = self._entry, self._exit
    queue: deque[Cell] = deque([start])
    came_from: dict[Cell, Cell] = {start: start}
    while queue:
        cell = queue.popleft()              # popleft is what makes it BFS
        if cell == goal:
            break
        x, y = cell
        for direction, neighbour in self._neighbours(cell):
            if self._grid[y][x] & direction:
                continue                     # still walled off
            if neighbour in came_from:
                continue                     # already reached by a shorter route
            came_from[neighbour] = cell
            queue.append(neighbour)
    ...`,
          cap: "popleft expands one depth layer at a time, so the first arrival is the shortest", lang: "python" },
        { p: "Change `popleft()` to `pop()` and it becomes a DFS at once — it still finds a path, but nothing guarantees it is the shortest. That is the entire difference between the two algorithms." },
        { code: String.raw`def solve(self) -> list[str]:
    """Turn a sequence of cells into N/E/S/W letters."""
    cells = self.solve_cells()
    letters: list[str] = []
    for before, after in zip(cells, cells[1:]):
        dx, dy = after[0] - before[0], after[1] - before[1]
        for direction, step in STEP.items():
            if step == (dx, dy):
                letters.append(LETTER[direction])
                break
    return letters`,
          cap: "Zipping a list with itself offset by one walks adjacent pairs", lang: "python" },
        { h: "How the 42 is laid out" },
        { code: String.raw`GLYPHS = {
    "4": ["#.#", "#.#", "###", "..#", "..#"],
    "2": ["###", "..#", "###", "#..", "###"],
}`,
          cap: "Glyphs of 5 rows by 3 columns — # is a fully sealed cell", lang: "python" },
        { table: { head: ["What has to fit", "How much"], rows: [
          ["one glyph", "3 columns, 5 rows"],
          ["two glyphs plus a gap column", "7 columns"],
          ["at least one cell of margin all round", "+2 in each direction"],
          ["**the smallest grid that fits**", "**11 x 9**"]
        ]}},
        { p: "Below that the subject says to print a message and carry on rather than give up — and that message belongs on stderr, because it is a warning and not a result." },
        { code: String.raw`def _pattern_cells(self) -> set[Cell]:
    """Work out the pattern's cells, minus the entry and exit."""
    if self._width < 11 or self._height < 9:
        print("Maze too small for the 42 pattern", file=sys.stderr)
        return set()
    cells = self._glyph_cells()
    cells.discard(self._entry)     # the endpoints outrank the decoration
    cells.discard(self._exit)
    return cells`,
          cap: "Those two discards are what stop the user being walled in at birth", lang: "python" }
      ],

      architecture: [
        { h: "Reading the config so the errors are useful" },
        { code: String.raw`REQUIRED = ("WIDTH", "HEIGHT", "ENTRY", "EXIT", "OUTPUT_FILE",
            "PERFECT")


def read_config(path: str) -> dict[str, str]:
    """Read KEY=VALUE pairs, naming the line when something is wrong."""
    values: dict[str, str] = {}
    with open(path, "r", encoding="utf-8") as handle:
        for number, line in enumerate(handle, start=1):
            text = line.strip()
            if not text or text.startswith("#"):
                continue
            if "=" not in text:
                raise MazeError(f"{path}:{number}: expected KEY=VALUE")
            key, _, value = text.partition("=")
            values[key.strip().upper()] = value.strip()
    missing = [key for key in REQUIRED if key not in values]
    if missing:
        raise MazeError(f"{path}: missing key(s): " + ", ".join(missing))
    return values`,
          cap: "Name the file, the line and the missing key — nobody should have to guess", lang: "python" },
        { code: String.raw`def parse_cell(text: str, label: str, width: int,
               height: int) -> Cell:
    """Turn 'x,y' into a coordinate, checking the bounds."""
    parts = text.split(",")
    if len(parts) != 2:
        raise MazeError(f"{label} must look like x,y, got '{text}'")
    try:
        x, y = int(parts[0]), int(parts[1])
    except ValueError:
        raise MazeError(f"{label} must be two integers, got '{text}'")
    if not (0 <= x < width and 0 <= y < height):
        raise MazeError(f"{label} ({x},{y}) is outside "
                        f"0..{width - 1},0..{height - 1}")
    return (x, y)`,
          cap: "Validate once at the boundary and the rest of the program needs no checks", lang: "python" },
        { table: { head: ["Input", "The message it should produce"], rows: [
          ["no file given", "`usage: python3 a_maze_ing.py config.txt`"],
          ["the file is missing", "`config.txt: No such file or directory`"],
          ["`EXIT` absent", "`config.txt: missing key(s): EXIT`"],
          ["`WIDTH=abc`", "`WIDTH must be an integer, got 'abc'`"],
          ["`ENTRY=0,0` and `EXIT=0,0`", "`ENTRY and EXIT must differ`"],
          ["`EXIT=99,99` on a 20x15 grid", "`EXIT (99,99) is outside 0..19,0..14`"]
        ]}},
        { note: "Every one of them ends with a non-zero exit and **no traceback**. An evaluator will try every broken input there is, and this is the easiest part of the project to score on." },
        { h: "Writing the output file" },
        { code: String.raw`def to_hex_rows(self) -> list[str]:
    """One hexadecimal digit per cell."""
    return ["".join(f"{cell:x}" for cell in row) for row in self._grid]


def to_output(self) -> str:
    """Build the whole file body as one string."""
    entry_x, entry_y = self._entry
    exit_x, exit_y = self._exit
    return "\n".join(self.to_hex_rows() + [
        "",
        f"{entry_x},{entry_y}",
        f"{exit_x},{exit_y}",
        "".join(self.solve()),
    ]) + "\n"`,
          cap: "Separating building from writing lets the tests check the format directly", lang: "python" },
        { code: String.raw`9c5c5c5c6
3a3a3a38a
9c5c5c5c6

0,0
8,2
EESSEE`,
          cap: "A real 9x3 example — the blank line is the separator", lang: "text" }
      ],

      implementation: [
        { h: "Drawing the maze" },
        { code: String.raw`def render(grid: list[list[int]], entry: Cell, exit_cell: Cell,
           path: set[Cell]) -> str:
    """Each cell draws its own top and left edge; the row and grid close off."""
    lines: list[str] = []
    for y, row in enumerate(grid):
        top, middle = [], []
        for x, cell in enumerate(row):
            top.append("+" + ("---" if cell & NORTH else "   "))
            middle.append("|" if cell & WEST else " ")
            middle.append(cell_glyph((x, y), entry, exit_cell, path))
        lines.append("".join(top) + "+")
        lines.append("".join(middle) + "|")
    lines.append("+" + "---+" * len(grid[0]))
    return "\n".join(lines)


def cell_glyph(cell: Cell, entry: Cell, exit_cell: Cell,
               path: set[Cell]) -> str:
    """The character in the middle: entry, exit, path, empty — in that order."""
    if cell == entry:
        return " E "
    if cell == exit_cell:
        return " X "
    if cell in path:
        return " . "
    return "   "`,
          cap: "No edge is drawn twice, because each cell owns two of its sides", lang: "python" },
        { code: String.raw`+---+---+---+---+
| E     |       |
+   +   +   +---+
|   |   | . . X |
+---+---+---+---+`,
          cap: "E is the entry, X the exit, and the dots are the shortest path", lang: "text" },
        { h: "The minimum interactions the subject asks for" },
        { code: String.raw`def interactive(gen: MazeGenerator) -> None:
    """Loop on commands until quit — a terminal counts as interactive."""
    show_path = False
    colour = "\033[37m"
    while True:
        print(colour + render(gen.grid, gen.entry, gen.exit,
                              set(gen.solve_cells()) if show_path
                              else set()) + "\033[0m")
        command = input("[r]egenerate [p]ath [c]olour [q]uit: ").strip()
        if command == "q":
            return
        if command == "r":
            gen.reseed(None)          # a new seed is a new maze
            gen.generate()
        elif command == "p":
            show_path = not show_path # keep the path; do not recompute it
        elif command == "c":
            colour = next_colour(colour)`,
          cap: "These three are the required minimum: regenerate, toggle the path, change the colour", lang: "python" },
        { h: "The tests that match what an evaluator will try" },
        { code: String.raw`# 1) the only thing the subject's validator checks
for y in range(height):
    for x in range(width - 1):
        assert bool(grid[y][x] & EAST) == bool(grid[y][x + 1] & WEST)
for y in range(height - 1):
    for x in range(width):
        assert bool(grid[y][x] & SOUTH) == bool(grid[y + 1][x] & NORTH)

# 2) walk the path rather than trusting the solver
x, y = entry
for step in solution:
    direction = {"N": NORTH, "E": EAST, "S": SOUTH, "W": WEST}[step]
    assert not grid[y][x] & direction
    dx, dy = STEP[direction]
    x, y = x + dx, y + dy
assert (x, y) == exit_cell

# 3) the border is sealed except at the entry and exit
for x in range(width):
    assert grid[0][x] & NORTH or (x, 0) in (entry, exit_cell)
    assert grid[height - 1][x] & SOUTH or (x, height - 1) in (entry,
                                                              exit_cell)

# 4) no 3x3 open block in either mode
for perfect in (True, False):
    gen = MazeGenerator(30, 20, seed=3, perfect=perfect)
    gen.generate()
    assert not has_open_block(gen.grid, 3)`,
          cap: "These four cover every requirement a machine can check", lang: "python" },
        { note: "**Run the subject's own validation script before every submission.** It is the same one a Moulinette may use, and it checks exactly one thing — that the walls agree — which the structure of the code should make impossible to get wrong in the first place." }
      ]
    }
  };

  window.TEACHING_EN = window.TEACHING_EN || {};
  Object.keys(EN).forEach(function (id) {
    var page = window.TEACHING_EN[id];
    if (!page) return;
    Object.keys(EN[id]).forEach(function (key) {
      page[key] = (page[key] || []).concat(EN[id][key]);
    });
  });
})();
