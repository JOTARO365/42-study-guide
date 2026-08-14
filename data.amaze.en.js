/* English content for A-Maze-ing. Block count and key shape mirror
   data.amaze.js index for index. */
window.TEACHING_EN = window.TEACHING_EN || {};

Object.assign(window.TEACHING_EN, {

  amaze: {
    principle: [
      { h: "What the subject asks for" },
      { p: "Write a Python program that reads **one configuration file**, generates a maze, writes it to a file in a hexadecimal format, displays it visually, and keeps the generation logic in a module another project can import." },
      { code: String.raw`python3 a_maze_ing.py config.txt`,
        cap: "The entry point must be named a_maze_ing.py and takes one argument: the config file", lang: "bash" },
      { note: "**There is exactly one argument.** Everything adjustable lives in the config file, not on the command line. Do not design a `--width` flag that then has to argue with the file." },
      { h: "The requirements, which have to be read together" },
      { p: "The subject looks like a list of independent requirements. It is not — **three of them are the same requirement wearing different clothes**, and seeing that removes most of the work." },
      { table: { head: ["Requirement", "What it means"], rows: [
        ["Config file", "one `KEY=VALUE` per line; lines starting with `#` are comments and must be skipped"],
        ["Reproducible", "random, but a seed must reproduce the same maze"],
        ["Coherent walls", "two neighbouring cells must agree about the wall between them"],
        ["No isolated cells", "every cell except the 42 pattern must be reachable"],
        ["Sealed borders", "the entry and exit are specific cells; the rest of the outer border is walled"],
        ["No 3x3 open area", "corridors at most 2 cells wide — 2x3 is fine, 3x3 is not"],
        ["The 42 pattern", "a visible 42 drawn with fully sealed cells"],
        ["`PERFECT=True`", "exactly one path between entry and exit"],
        ["Output file", "one hexadecimal digit per cell, then the entry, the exit and the shortest path"],
        ["Visual display", "terminal ASCII or MiniLibX, with user interactions"],
        ["Reusable", "the generation logic as one class in a standalone importable module"]
      ]}},
      { h: "The config file" },
      { code: String.raw`# config.txt — lines starting with # are skipped
WIDTH=20
HEIGHT=15
ENTRY=0,0
EXIT=19,14
OUTPUT_FILE=maze.txt
PERFECT=True

# extra keys are allowed when they are useful
SEED=42`,
        cap: "The first six keys are mandatory, and a default config file must be in the repository", lang: "ini" },
      { note: "The subject ships a **validation script** for the output file, and says a Moulinette may use it automatically — run it against your own output before every submission." },
      { h: "Every error must be handled" },
      { p: "An invalid configuration, a missing file, bad syntax, impossible maze parameters — all of them must end in a readable message. **A traceback must never escape.** That is the shared rule for every Python project in this part of the curriculum; see the **Python Modules 00–04** page for the detail." }
    ],

    theory: [
      { h: "The one decision that settles everything" },
      { p: "`PERFECT=True` means **exactly one path between entry and exit**. A maze has that property precisely when its passages form a **spanning tree** of the grid graph: every cell reached, no cycles." },
      { p: "So if you pick an algorithm that builds a spanning tree directly, perfection stops being something you have to verify afterwards." },
      { table: { head: ["Algorithm", "Character", "Notes"], rows: [
        ["**recursive backtracker** (randomised DFS)", "long winding corridors, few dead ends", "one explicit stack; the easiest to read"],
        ["randomised Prim", "many short dead ends, spiky", "needs a frontier set"],
        ["randomised Kruskal", "uniform, maze-like", "needs union-find"]
      ]}},
      { p: "All three are spanning trees, so all three are perfect. DFS reads best on screen and is the shortest to write." },
      { h: "Write it iteratively, not recursively" },
      { p: "The subject's own sizes are modest but a stress test is not: 400x300 is 120,000 cells, and a recursive DFS blows Python's stack long before that. An explicit stack is the same algorithm with none of the risk." },
      { code: String.raw`stack = [start]
visited = {start}
while stack:
    current = stack[-1]
    options = [(d, n) for d, n in neighbours(current)
               if n not in visited and n not in reserved]
    if not options:
        stack.pop()
        continue
    direction, neighbour = rng.choice(options)
    knock_down(current, direction)
    visited.add(neighbour)
    stack.append(neighbour)`,
        cap: "reserved holds the 42 pattern's cells, which the search must never enter", lang: "python" },
      { h: "Why the no-3x3 rule is nearly free" },
      { p: "A spanning tree has no cycles, and a **2x2** block with all four internal walls open **is** a cycle. So a perfect maze cannot contain even a 2x2 open block, let alone a 3x3 one." },
      { p: "The rule can therefore only be broken in one place: **opening extra walls** when `PERFECT=False`. Put the check there, and check **before** committing rather than sweeping up afterwards." },
      { code: String.raw`def would_open_3x3(cell, direction) -> bool:
    knock_down(cell, direction)       # try it
    bad = has_open_block(3)
    put_back(cell, direction)         # undo it
    return bad`,
        cap: "Try and back out; cheaper than repairing later", lang: "python" },
      { note: "A post-generation \"find wide corridors and break them up\" pass is the wrong shape — it edits walls after connectivity was guaranteed, and so destroys the thing just guaranteed." },
      { h: "The wall encoding, and the one thing the validator checks" },
      { table: { head: ["Bit", "Value", "Direction"], rows: [
        ["0", "1", "North"], ["1", "2", "East"], ["2", "4", "South"], ["3", "8", "West"]
      ]}},
      { p: "**A set bit means the wall is closed.** `0xF` is sealed on all four sides, `0x0` is open on all of them, and `0x5` (N+S) is an east-west corridor." },
      { p: "The validation script shipped with the subject checks exactly one thing: **two neighbours must agree about the wall between them.** Cell (x,y)'s east bit must equal cell (x+1,y)'s west bit, and so on for every direction." },
      { code: String.raw`def knock_down(self, cell, direction):
    x, y = cell
    dx, dy = STEP[direction]
    self.grid[y][x] &= ~direction
    self.grid[y + dy][x + dx] &= ~OPPOSITE[direction]`,
        cap: "Route every wall change in the program through this one function", lang: "python" },
      { p: "Do that and \"Wrong encoding for (x,y)\" becomes **impossible** rather than merely unlikely." }
    ],

    architecture: [
      { h: "The 42 — reserve before carving, never seal afterwards" },
      { p: "The pattern is cells that stay fully closed (`0xF`) and spell out 42." },
      { note: "**Reserve those cells before the search runs.** The obvious approach — generate the maze, then seal the pattern cells — disconnects whatever was reachable only through them, and the subject forbids isolated cells. Reserving first means the search never enters them, so connectivity is preserved by construction." },
      { ul: [
        "**The endpoints outrank the decoration** — discard the entry and exit from the reserved set, or a centred pattern walls the user in on the day the entry happens to sit in the middle",
        "**A glyph can fence a cell off** — design the glyphs so their internal gaps open outward, then verify anyway: after carving, walk the non-reserved cells and, for any the search never reached, open one wall towards the maze. Cheap insurance for a rule that would otherwise fail on one size in fifty"
      ]},
      { p: "5x3 glyphs with a gap column need 7 columns and 5 rows plus a two-cell margin, so **11x9 is the smallest grid that fits the 42**. Below that the subject says to print an error and carry on — a warning on stderr, not a failure." },
      { h: "The output format is exact" },
      { code: String.raw`<hex rows, one line per row of cells>
<blank line>
<entry x,y>
<exit x,y>
<shortest path in N/E/S/W>`,
        cap: "Every line ends with \\n, including the last", lang: "text" },
      { code: String.raw`9c5c5c5c6
3a3a3a38a
...

0,0
19,14
EESSESSEE`,
        cap: "A trimmed example — one digit per cell", lang: "text" },
      { p: "The shortest path comes from **breadth-first search** — that is what makes it shortest: the first time BFS reaches the exit, it did so in the fewest moves." },
      { note: "Test the path by **walking it**, not by trusting the solver: start at the entry, check the wall bit before each step, and confirm you land on the exit. That catches a whole class of direction-sign and off-by-one bugs that a length check never will." },
      { h: "The layout" },
      { code: String.raw`a_maze_ing.py          # argv, the config file, wiring it together
render.py              # grid -> text, plus the user interactions
mazegen/
|-- __init__.py        # exposes MazeGenerator and the direction constants
'-- generator.py       # the whole algorithm; knows nothing of drawing or config
config.txt             # the default config file the repository must carry
pyproject.toml         # packages mazegen as a wheel
Makefile               # install / run / debug / clean / lint`,
        cap: "The generator never sees a character; the renderer never sees a bit", lang: "text" },
      { p: "This split is not decoration — it is what makes it possible to **test the algorithm without parsing text**, and the subject requires the generation part to be reusable anyway." }
    ],

    dataflow: [
      { h: "The data's path through the program" },
      { table: { head: ["Stage", "Input", "Output"], rows: [
        ["read the config", "the path from `sys.argv[1]`", "parsed `KEY=VALUE` pairs"],
        ["validate", "values that could be anything", "usable values, or one line of error"],
        ["reserve the 42", "the grid size", "the set of cells that must not be touched"],
        ["carve", "size, seed, reserved set", "a grid of ints holding wall bits"],
        ["open extra walls", "the grid, when `PERFECT=False`", "a grid with cycles but still no 3x3 open block"],
        ["solve", "grid, entry, exit", "the shortest path as N/E/S/W"],
        ["write", "all of the above", "a file in exactly the required format"],
        ["display", "grid plus path", "ASCII, or an MLX window"]
      ]}},
      { h: "Parsing the config file" },
      { code: String.raw`def read_config(path: str) -> dict[str, str]:
    """Read KEY=VALUE pairs, skipping comments and blank lines."""
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
    return values`,
        cap: "Always name the line number, so whoever edits the config does not have to guess", lang: "python" },
      { table: { head: ["Input", "What must happen"], rows: [
        ["no config file given", "print the usage and exit non-zero"],
        ["the file does not exist", "one line of message, not a traceback"],
        ["a mandatory key is missing", "name the missing key"],
        ["`WIDTH=abc`", "name the key and the value that is wrong"],
        ["`WIDTH=0` or negative", "refuse, rather than building an empty grid"],
        ["`ENTRY` equals `EXIT`", "refuse — the subject requires them to differ"],
        ["`EXIT` outside the grid", "refuse and state the accepted bounds"],
        ["grid too small for the 42", "warn on stderr and carry on without the pattern"],
        ["a very large grid", "must not hit the recursion limit"]
      ]}},
      { h: "Writing the output file" },
      { code: String.raw`def to_output(self) -> str:
    """Build the whole file body as one string."""
    rows = ["".join(f"{cell:x}" for cell in row) for row in self.grid]
    entry_x, entry_y = self.entry
    exit_x, exit_y = self.exit
    return "\n".join(rows + [
        "",
        f"{entry_x},{entry_y}",
        f"{exit_x},{exit_y}",
        "".join(self.solve()),
    ]) + "\n"


def write(self, filename: str) -> None:
    """Write it out through a context manager."""
    with open(filename, "w", encoding="utf-8") as handle:
        handle.write(self.to_output())`,
        cap: "Build the string first and write once — the tests can then check the format without touching a disk", lang: "python" },
      { h: "Display and user interactions" },
      { p: "The subject accepts either terminal ASCII or a MiniLibX window, but **the interactions are required**, at least these:" },
      { table: { head: ["Must be possible", "Notes"], rows: [
        ["regenerate a new maze and show it", "change the seed and run the generator again"],
        ["show and hide the shortest path", "keep the path and toggle the drawing; do not recompute"],
        ["change the wall colours", "ANSI colour codes are enough in a terminal"],
        ["(optional) colour the 42 pattern", "requires knowing which cells were reserved"]
      ]}},
      { p: "The display must clearly show **walls, entry, exit and the path**. Keep the reserved cells as public data on the generator, or the renderer cannot colour the 42 at all." },
      { code: String.raw`+---+---+---+
| E         |     E = entry   X = exit
+---+   +---+     . = shortest path
|   | . . X |
+   +---+---+`,
        cap: "Each cell draws its own top and left edge; the row and grid are closed off at the end", lang: "text" }
    ],

    implementation: [
      { h: "The subject requires the generator to be a class" },
      { p: "The requirement is explicit: **one class**, for example `MazeGenerator`, inside a standalone module that a future project can import, with short documentation on instantiating it, passing parameters, and reading both the structure and a solution." },
      { code: String.raw`from mazegen import MazeGenerator

gen = MazeGenerator(width=20, height=15, seed=7, perfect=True)
gen.generate()

print(gen.grid[0][0])          # an int holding four wall bits
print("".join(gen.solve()))    # the shortest path as N/E/S/W
print(gen.is_perfect())        # it can check itself
gen.write("maze.txt")          # writes the subject's format`,
        cap: "The surface the module's documentation has to describe", lang: "python" },
      { p: "The state lives in the instance rather than in module-level variables, so two mazes can exist in one program at once — which is what the regenerate interaction needs." },
      { h: "Packaging it as a wheel" },
      { code: String.raw`[project]
name = "mazegen"
version = "1.0.0"
requires-python = ">=3.10"

[build-system]
requires = ["setuptools>=61"]
build-backend = "setuptools.build_meta"

[tool.setuptools]
packages = ["mazegen"]`,
        cap: "pyproject.toml", lang: "toml" },
      { code: String.raw`python3 -m pip install build
python3 -m build --wheel
python3 -m pip install dist/mazegen-1.0.0-py3-none-any.whl

cd /tmp && python3 -c "from mazegen import MazeGenerator; print(MazeGenerator(5, 5, seed=1))"`,
        cap: "The last line is the real proof: it imports from another directory", lang: "bash" },
      { note: "The subject says the wheel or sdist must sit at the **root of the repository**, with documentation for using it — not merely a folder that happens to import because it is sitting next door." },
      { h: "The test that proves a perfect maze mathematically" },
      { p: "A grid of n cells is a tree exactly when it has `n − 1` edges and is connected. Those two together are the definition, so nothing else needs checking." },
      { code: String.raw`def edges_removed(grid: list[list[int]]) -> int:
    """Count removed walls, once per pair."""
    total = 0
    for y, row in enumerate(grid):
        for x, cell in enumerate(row):
            if not cell & EAST and x + 1 < len(row):
                total += 1
            if not cell & SOUTH and y + 1 < len(grid):
                total += 1
    return total


for width, height in ((1, 1), (1, 9), (9, 1), (13, 7), (40, 40)):
    gen = MazeGenerator(width, height, seed=7, perfect=True)
    gen.generate()
    open_cells = width * height - len(gen.pattern_cells())
    assert gen.count_reachable() == open_cells      # connected
    assert gen.is_perfect()                          # and acyclic`,
        cap: "Reserved cells are excluded, because the subject exempts the 42 pattern", lang: "python" },
      { h: "The tests that catch the most real bugs" },
      { code: String.raw`# 1) walls must agree on both sides — the only thing the subject's validator checks
for y in range(height):
    for x in range(width - 1):
        assert bool(grid[y][x] & EAST) == bool(grid[y][x + 1] & WEST)

# 2) walk the path rather than trusting the solver
x, y = entry
for step in solution:
    direction = {"N": NORTH, "E": EAST, "S": SOUTH, "W": WEST}[step]
    assert not grid[y][x] & direction          # the wall must be open first
    dx, dy = STEP[direction]
    x, y = x + dx, y + dy
assert (x, y) == exit_cell

# 3) the same seed reproduces; a different one does not
assert build(20, 20, seed=42) == build(20, 20, seed=42)
assert build(20, 20, seed=42) != build(20, 20, seed=43)

# 4) no 3x3 open block, even with PERFECT=False
assert not has_open_block(grid, 3)`,
        cap: "These four cover the requirements an evaluator will actually try", lang: "python" },
      { table: { head: ["Tier", "What it checks"], rows: [
        ["**NORMAL**", "ordinary sizes generate, the output file has the right shape, the subject's validator passes, every Makefile target works"],
        ["**EXTREME**", "`1x1`, a single row, a single column, zero and negative values, entry equal to exit, coordinates outside the grid, a missing config file, non-numeric values, a grid smaller than 11x9"],
        ["**HARDCORE**", "the spanning-tree property at every size, walls agreeing on both sides, no 3x3 open block in either mode, the path walking to the exit, the 42 sealed without cutting anyone off, `200x200` not hitting the recursion limit, the installed wheel importing from elsewhere, flake8 and `mypy --strict`"]
      ]}}
    ],

    tricks: [
      { h: "Symptom → cause" },
      { table: { head: ["Symptom", "Cause"], rows: [
        ["The validator says \"Wrong encoding for (x,y)\"", "something changes a wall bit on one side only; route every change through one function"],
        ["`RecursionError` on a large grid", "the DFS is genuinely recursive; use an explicit stack"],
        ["The maze has cycles even with `PERFECT=True`", "a wall was removed towards an already-visited cell; check visited before choosing"],
        ["Some cells are unreachable", "the 42 was sealed after carving instead of reserved before it"],
        ["The 42 walls the user in", "the entry or exit is inside the reserved set; discard them first"],
        ["A 3x3 open block exists", "extra walls were opened without checking first — check on the attempt, not at the end"],
        ["The path is not the shortest", "it was solved with DFS instead of BFS"],
        ["The path walks through a wall", "the solver does not check the wall bit before stepping"],
        ["The same seed gives different mazes", "module-level `random.seed()`; use your own `random.Random(seed)`"],
        ["Every row is identical", "`[[15] * w] * h` — every row is the same list; use a comprehension"],
        ["`import mazegen` fails after installing", "`pyproject.toml` does not declare the package, or `__init__.py` is missing"],
        ["`make` reports `missing separator`", "the recipe line uses spaces instead of a tab"]
      ]}},
      { h: "Tricks worth keeping" },
      { ul: [
        "Only `[[0] * w for _ in range(h)]` — `[[0] * w] * h` creates one row referenced h times, a bug that is hard to spot because it prints correctly",
        "Keep `visited` and the reserved set as sets of tuples — membership is O(1)",
        "Write `OPPOSITE` and `STEP` as dicts rather than computing them with bit arithmetic; easier to read and harder to get wrong",
        "Have `to_output()` return a string and `write()` do the writing — the tests can then check the format without touching a disk",
        "Validate input at one boundary, when the config is read, and the rest of the program needs no checks",
        "Run the subject's validation script against your own output before every submission — it is the same one a Moulinette may use"
      ]}
    ],

    eval: [
      { qa: [
        { q: "What is a perfect maze, and what has it to do with a spanning tree?", a: "A perfect maze has exactly one path between entry and exit, which is the definition of a tree over the grid graph. Cells are nodes and removed walls are edges, so a grid of n cells must have exactly n−1 edges and one search must reach every cell." },
        { q: "Why is the no-3x3-open-area rule nearly free when PERFECT=True?", a: "Because a 2x2 block with all four internal walls open is a cycle, and a spanning tree has no cycles. A perfect maze therefore cannot contain even a 2x2 open block. The rule can only be broken while opening extra walls in the imperfect mode." },
        { q: "Why reserve the 42's cells before carving instead of sealing them afterwards?", a: "Sealing afterwards disconnects anything that was only reachable through those cells, and the subject forbids isolated cells. Reserving first means the search never enters them, so connectivity is preserved by construction rather than by inspection." },
        { q: "Why an iterative DFS rather than a recursive one?", a: "Because the call depth equals the longest path, so a large grid can hit the 1000-frame recursion limit. Moving the stack into a list bounds the depth by memory instead, with the algorithm otherwise unchanged." },
        { q: "Why must a wall be removed from both sides?", a: "Because the two cells store the wall between them separately. Remove it on one side and the subject's validator reports incoherent encoding immediately, and the renderer and the solver see two different mazes." },
        { q: "Why must the path be found with BFS?", a: "Because BFS expands one depth layer at a time, so the first time it reaches the exit it has used the fewest possible moves. DFS also finds a path, but gives no guarantee that it is the shortest." },
        { q: "What is the seed for, and why not `random.seed()`?", a: "The seed makes results reproducible, which the subject requires and which both the tests and any bug report need. Module-level `random.seed()` changes shared state for the whole program, so other code that draws random numbers changes too; `random.Random(seed)` keeps the state to ourselves." },
        { q: "Why must the generator be a class in its own module?", a: "Because the subject requires it to be reusable in another project. A class keeps its state in the instance, so two mazes can exist in one program — which the regenerate interaction needs — and installing the wheel and importing it from another directory is the proof that it really is a module." },
        { q: "What happens when the grid is too small for the 42?", a: "The subject says to print a message on the console and carry on generating, not to give up. The smallest grid that fits is 11x9, using 5x3 glyphs with a gap column and a two-cell margin." },
        { q: "What is in the output file?", a: "Rows of hexadecimal digits, one digit per cell and one line per row, then a blank line, then three lines: the entry coordinates, the exit coordinates, and the shortest path written with the letters N, E, S and W. Every line ends with a newline." }
      ]}
    ]
  }

});
