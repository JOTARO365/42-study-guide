/* English content for the 42 Python series pages + A-Maze-ing.
   Block count and key shape mirror data.python.js index for index. */
window.TEACHING_EN = window.TEACHING_EN || {};

Object.assign(window.TEACHING_EN, {

  py_series: {
    principle: [
      { h: "What this series is" },
      { p: "Python Module 00 through 10 is **one subject printed eleven times** — the General Instructions are copied almost character for character, and only the theme changes. Learn the rulebook once and the rest is each module's own material." },
      { p: "The consequence matters more than it looks: **what fails you is not the logic**. Code that answers correctly but does not pass flake8, or that lets a traceback reach the evaluator, is non-functional — the same as not having done it." },
      { h: "The whole rulebook" },
      { table: { head: ["Rule", "The part people miss"], rows: [
        ["Python 3.10 or later", "`int | None` works without `Optional` — but a multi-line f-string needs 3.12"],
        ["flake8 clean", "No config file is given, so the defaults apply — **79 columns**, not 88"],
        ["Full type hints, mypy clean", "Required for every function and method from module 01 onward"],
        ["One job per file, under `exN/`", "The file name must match exactly, and it must hold nothing beyond what was asked"],
        ["`PascalCase` / `snake_case`", "Classes the first way, functions and variables the second"],
        ["No tracebacks", "Every error path must be caught and reported, not left to explode"]
      ]}},
      { note: "`--disallow-untyped-defs` is the flag that hurts if you leave it to the end. Annotating while you write is an hour of habit; retrofitting types onto finished code is a day of work." },
      { h: "The arc of the whole series" },
      { table: { head: ["Module", "Theme", "Substance"], rows: [
        ["**00** Growing Code", "fundamentals", "8 exercises: print, input, arithmetic, conditionals, a loop and its recursive twin, one typed function"],
        ["**01** Code Cultivation", "OOP", "7 exercises: `__main__`, a class, methods, a constructor, encapsulation, inheritance, static/class methods and a nested class"],
        ["**02** Garden Guardian", "exceptions", "catching narrowly, custom exceptions, `finally`"],
        ["**03** Data Quest", "collections", "lists, dicts, sets, tuples, comprehensions, generators"],
        ["**04** Data Archivist", "files", "open and close by hand first, then meet `with`"],
        ["**05** Code Nexus", "polymorphism", "abstract classes, overriding, Protocol"],
        ["**06** The Codex", "imports", "packages, `__init__.py`, absolute versus relative, circular imports"],
        ["**07** DataDeck", "design patterns", "abstract factory, capabilities, strategy"],
        ["**08** The Matrix", "environments", "venv, pip versus Poetry, `.env`"],
        ["**09** Cosmic Data", "Pydantic", "models, validators, nested models"],
        ["**10** FuncMage", "functional", "lambdas, higher-order functions, closures, functools, decorators"]
      ]}},
      { p: "This page covers the shared rules and modules **00–04**. Modules 05–07 are on the **Python Patterns** page, and 08–10 on **Python Toolkit**." }
    ],

    theory: [
      { h: "Module 00 — syntax, and the boundaries where the marks live" },
      { p: "Eight exercises, `ex0/` to `ex7/`, one function each. Type hints are optional for 0 to 6 and **required for exercise 7**." },
      { p: "The comparisons in the subject are strict, and **the boundary is where the marks are**:" },
      { table: { head: ["Exercise", "Rule", "The boundary"], rows: [
        ["`ft_plant_age`", "ready after **more than** 60 days", "exactly 60 is ‘not’ ready"],
        ["`ft_water_reminder`", "water after **more than** 2 days", "exactly 2 is fine"]
      ]}},
      { p: "`ft_count_harvest` wants an iterative and a recursive version printing **identical** output. Helper functions are explicitly authorised, so a private `_count_from(day, last)` is cleaner than a default-argument trick, because the public function keeps the same signature as its iterative twin." },
      { p: "`ft_seed_inventory(seed_type, quantity, unit)` handles `\"packets\"`, `\"grams\"` and `\"area\"`; anything else prints **only** `Unknown unit type` and nothing more. The name is capitalised with `str.capitalize()`, which upper-cases the first character and lower-cases the rest: `\"TOMATO\"` becomes `\"Tomato\"`, and `\"sweet corn\"` becomes `\"Sweet corn\"`, not `\"Sweet Corn\"`." },
      { h: "Module 01 — objects, and the name collision that will bite" },
      { p: "Seven exercises, each a standalone file carrying its whole class. They build conceptually, not by importing each other." },
      { note: "**The collision.** The subject names the methods `grow()` and `age()`. If the day counter is a public attribute also called `age`, the method and the attribute overwrite each other and mypy reports `Cannot assign to a method`. Either name the attribute `days_old` while the attributes are public, or move to `_age` once encapsulation arrives in exercise 4. Both work; picking neither does not." },
      { p: "**Exercise 4 asks for the protected convention, not mangling.** One leading underscore (`_height`), never two. A double underscore triggers name mangling, which only makes exercise 5 — which subclasses everything — painful. Python has no private attributes; the underscore is a message to other programmers, which is exactly what the subject wants demonstrated." },
      { p: "Exercise 5: `super()` in `show()` as well as `__init__`. Each subclass prints the shared line by calling the parent's `show()`, then adds only its own. Copying the parent's `print` into the child is the thing being marked against." },
      { h: "Exercise 6 puts three ideas in one file" },
      { ul: [
        "**A nested class** for statistics — nesting says \"this has no meaning outside a Plant\" in the code rather than in a comment",
        "A `@staticmethod` for \"is this many days more than a year\" — it looks at the number it was given and no particular plant, so binding it to one would misdescribe it",
        "A `@classmethod` for building an anonymous plant — it takes `cls`, which is the whole point: `Flower.anonymous()` must return a `Flower`, not a bare `Plant`"
      ]},
      { note: "**The trick worth keeping.** If `Plant.__init__` builds its statistics with `self.Stats()` rather than `Plant.Stats()`, a `Tree` that defines its own nested `Stats` gets the right counter automatically, because attribute lookup goes through the instance's class. No registry, no `isinstance` chain." }
    ],

    architecture: [
      { h: "The layout that works for every module" },
      { code: String.raw`Python Module 0X/
|-- ex0/
|   '-- ft_something.py        # named exactly as the subject says
|-- ex1/
|   '-- ft_other.py
|-- tests/
|   '-- run_tests.py           # yours, not submitted, and what keeps you passing
|-- .venv/                     # never committed
|-- .gitignore
'-- setup.cfg                  # keeps flake8 out of .venv`,
        cap: "The standard directory layout", lang: "text" },
      { p: "These two lines of `setup.cfg` save a lot of time — without them flake8 walks into `.venv` and reports hundreds of errors from other people's libraries." },
      { code: String.raw`[flake8]
exclude = .venv,__pycache__,build,dist`,
        cap: "setup.cfg", lang: "ini" },
      { h: "Install the tools once" },
      { code: String.raw`python3 -m venv .venv
./.venv/bin/pip install flake8 mypy

./.venv/bin/flake8 ex0 ex1 ex2
./.venv/bin/mypy ex0 ex1 ex2 --strict`,
        cap: "Both must pass before you call it done", lang: "bash" },
      { p: "The later modules ask for a **Makefile** with `install`, `run`, `debug` (under `pdb`), `clean`, `lint` and sometimes `lint-strict`, plus a `.gitignore` for Python artefacts." },
      { code: String.raw`.PHONY: install run debug clean lint lint-strict

VENV = .venv
PY   = $(VENV)/bin/python

install:
	python3 -m venv $(VENV)
	$(VENV)/bin/pip install -r requirements.txt

run:
	$(PY) main.py

debug:
	$(PY) -m pdb main.py

lint:
	$(VENV)/bin/flake8 .

lint-strict:
	$(VENV)/bin/mypy . --strict

clean:
	find . -name __pycache__ -type d -exec rm -rf {} +`,
        cap: "The series' standard Makefile", lang: "makefile" },
      { note: "Recipe lines must begin with a **real tab**, never spaces, or make reports `missing separator`." }
    ],

    dataflow: [
      { h: "Module 02 — exceptions" },
      { p: "Five exercises, and the pattern the whole module teaches: **catch the narrowest exception that can actually occur**, and let everything else through. A blanket `except Exception` swallows your own bugs." },
      { ul: [
        "Exercise 2 asks you to ‘cause’ three different errors on purpose — a deliberate `TypeError` will be flagged by mypy, so silence exactly that line with `# type: ignore[operator]`, never a bare `# type: ignore`",
        "A custom exception is a class inheriting `Exception`, with any extra data passed to `super().__init__` so `str(error)` still works",
        "`finally` runs on the way out of the block **whatever happened** — return, raise, or fall through. That is why cleanup belongs there and not after the try"
      ]},
      { note: "`int(\"٢٥\")` is 25. Python's `int()` accepts any Unicode decimal digit, not just ASCII. A test asserting it raises is testing a belief, not the code." },
      { h: "Module 03 — collections" },
      { p: "Seven exercises over lists, dicts, sets, tuples, comprehensions and generators. The points that decide marks:" },
      { table: { head: ["Structure", "The property you have to use"], rows: [
        ["dict", "keeps insertion order since 3.7 — which is what lets \"first one given wins\" work without storing the order separately"],
        ["`max()` / `min()`", "keep the first of a tie — combined with an insertion-ordered dict, the result is predictable"],
        ["set", "unordered — anything printed from one must be `sorted()` first or the output is not reproducible"],
        ["generator", "consumed once — iterating twice silently yields nothing, the module's most common quiet bug"]
      ]}},
      { h: "Module 04 — files and streams" },
      { p: "Four exercises, and one hard sequencing rule: `with` is forbidden until exercise 3. The first three must open, use and close by hand, with the `close()` in a `finally` so an error cannot leak a descriptor. Exercise 3 then introduces `with` as that pattern turned into syntax." },
      { code: String.raw`# exercises 0-2: it has to be written this way
handle = None
try:
    handle = open(path, "r", encoding="utf-8")
    return handle.read()
except OSError as error:
    print(f"Error opening {path}: {error}")
    return ""
finally:
    if handle is not None:
        handle.close()

# exercise 3 onward: the same thing, guaranteed by the language
with open(path, "r", encoding="utf-8") as handle:
    return handle.read()`,
        cap: "What `with` does for you", lang: "python" },
      { ul: [
        "Exercise 2 reads `sys.stdin` rather than `input()`, and errors go to `sys.stderr` with nothing else on it",
        "`open()` on a path containing a NUL byte raises `ValueError`, not `OSError` — catch `(OSError, ValueError)`, and add `UnicodeDecodeError` for text reads",
        "Grepping the raw source for `\"with \"` also finds it in docstrings — strip comments and docstrings with `tokenize` first, or a compliant file gets reported as breaking the rule"
      ]}
    ],

    implementation: [
      { h: "The working order for every module" },
      { ul: [
        "Read the whole subject first, and copy every example transcript out before writing any code",
        "Write the first exercise, then run flake8 and mypy **immediately** — do not accumulate debt",
        "Compare the output against the transcript **character for character**",
        "Write the three-tier `tests/run_tests.py` before moving to the next exercise",
        "Repeat"
      ]},
      { h: "One file that shows the whole rulebook" },
      { code: String.raw`#!/usr/bin/env python3
"""ex7/ft_seed_inventory.py — one file, one job, fully typed."""

UNITS = ("packets", "grams", "area")


def ft_seed_inventory(seed_type: str, quantity: int, unit: str) -> None:
    """Print one inventory line, or refuse an unknown unit.

    Args:
        seed_type: the kind of seed.
        quantity: how many.
        unit: one of "packets", "grams", "area".
    """
    if unit not in UNITS:
        print("Unknown unit type")
        return
    name = seed_type.capitalize()
    if unit == "packets":
        print(f"{name}: {quantity} packets")
    elif unit == "grams":
        print(f"{name}: {quantity} grams")
    else:
        print(f"{name}: covers {quantity} square meters")`,
        cap: "The shape that passes both flake8 and mypy --strict", lang: "python" },
      { p: "Note that there is no `if __name__` where the subject did not ask for one, and nothing beyond what was asked — \"the file holds only what was requested\" is a rule that really is checked." },
      { h: "The three test tiers" },
      { table: { head: ["Tier", "What it checks"], rows: [
        ["**NORMAL**", "every file exists, every function has the exact name, and the output matches the transcript character for character"],
        ["**EXTREME**", "the boundary of every comparison, zero and one, empty strings, non-ASCII input, very long input, and every branch of a dispatch including the unrecognised one"],
        ["**HARDCORE**", "properties rather than examples: the iterative and recursive versions agreeing over a whole range, counters matching the calls exactly, calling twice giving the same answer, and flake8 plus `mypy --strict` at zero findings"]
      ]}},
      { code: String.raw`import io
from contextlib import redirect_stdout

def captured(function, *args):
    """Return whatever a function prints."""
    buffer = io.StringIO()
    with redirect_stdout(buffer):
        function(*args)
    return buffer.getvalue()

out = captured(ft_seed_inventory, "TOMATO", 3, "packets")
assert out == "Tomato: 3 packets\n"`,
        cap: "Capturing stdout to compare against a transcript", lang: "python" },
      { note: "When a check fails, work out which is broken — the code or the check. In practice a good share are the harness. **Tighten the check; do not relax the assertion.**" }
    ],

    tricks: [
      { h: "Symptom → cause" },
      { table: { head: ["Symptom", "Cause"], rows: [
        ["mypy: `Cannot assign to a method`", "an attribute and a method share a name; rename one"],
        ["flake8 reports hundreds of errors in `typing_extensions.py`", "it is linting `.venv` — add a `setup.cfg` with an exclude"],
        ["E501 everywhere", "flake8's default is 79 columns, not 88"],
        ["`str.capitalize()` gives `\"Sweet corn\"` where `\"Sweet Corn\"` was wanted", "that is what it does; `str.title()` is the other one"],
        ["A recursive exercise dies on a large input", "Python's recursion limit — the subject's numbers are small, but a test that pushes it is how you find out"],
        ["A subclass's `classmethod` returns the parent type", "it named the class instead of using `cls`"],
        ["Every instance shares one counter", "the counter was created as a class attribute instead of in `__init__`"],
        ["A generator yields nothing the second time", "generators are consumed once; materialise it into a list to iterate twice"]
      ]}},
      { h: "Habits that actually help" },
      { ul: [
        "**Annotate while writing**, not at the end — `--disallow-untyped-defs` turns retrofitting into a day of work",
        "**Compare transcripts by machine**, not by eye — trailing spaces and `'` versus `’` are invisible",
        "Run `mypy --strict` even where the subject asks only for the shorter flag set; passing strict passes those too",
        "No `except Exception` without a written reason — if it is genuinely needed, say in a comment why it has to be that broad",
        "Keep `.venv` out of git — `.gitignore` from the first commit"
      ]}
    ],

    eval: [
      { qa: [
        { q: "What is `if __name__ == \"__main__\":` for?", a: "When a file is imported, `__name__` is the module's name rather than `\"__main__\"`, so the guard gives the importer the definitions without the side effect of running the program." },
        { q: "Why one underscore and not two?", a: "Two triggers name mangling, which rewrites the attribute's real name and makes subclassing awkward. Python has no true private attributes; a single underscore is a convention between programmers, which is exactly what the subject wants demonstrated." },
        { q: "How do `@staticmethod` and `@classmethod` differ?", a: "A static method takes neither `self` nor `cls` — it is an ordinary function placed in the class because it belongs to the same topic. A class method takes `cls`, so it can build an instance of the class it was actually called on, which is what makes `Flower.anonymous()` return a `Flower`." },
        { q: "Why is `finally` needed when code after the try would run anyway?", a: "Code after the try does not run if the block returns or raises something uncaught. `finally` runs on every exit path." },
        { q: "Why does module 04 forbid `with` in the first three exercises?", a: "So you see what `with` is doing for you — open, use, close in a `finally` is a pattern you must remember at every exit you add. `with` is the language keeping that promise so a refactor cannot forget it." },
        { q: "How do dicts and sets differ on ordering?", a: "A dict has kept insertion order since Python 3.7. A set has no guaranteed order, so anything printed from one must be sorted first or the output changes between runs." },
        { q: "Why is flake8 set to 79 columns?", a: "Because the subject supplies no config file, so the tool's default applies, and that default comes from PEP 8. Changing it without a reason is changing the rules you are being checked against." },
        { q: "What happens if a traceback escapes during the defense?", a: "The project counts as non-functional, the same as not having done it. Every error path has to be caught and reported in readable words instead." }
      ]}
    ]
  },

  py_patterns: {
    principle: [
      { h: "Three modules, one question" },
      { p: "The question is: **how do you add a new data type, a new capability or a new strategy without going back to edit the code that uses it?**" },
      { table: { head: ["Module", "The answer it gives"], rows: [
        ["**05** Code Nexus", "abstract base classes and polymorphism — the caller asks \"can you take this?\" instead of checking types itself"],
        ["**06** The Codex", "packages and `__init__.py` — separating what a package ‘contains’ from what it ‘offers’"],
        ["**07** DataDeck", "abstract factories, capabilities and strategies — everything that varies moves out of the caller"]
      ]}},
      { p: "There is one measure of whether it worked: **how many files must change to add a fourth type?** If the answer is \"one — the new file\", it is right." },
      { h: "What gets submitted" },
      { table: { head: ["Module", "Files"], rows: [
        ["05", "`ex0/data_processor.py`, `ex1/data_stream.py`, `ex2/data_pipeline.py` — each stands alone, so the classes are repeated"],
        ["06", "One file tree: the `alchemy/` package and thirteen test scripts at the root"],
        ["07", "`ex0/`–`ex2/` as packages (an `__init__.py` each) plus root scripts `battle.py`, `capacitor.py`, `tournament.py`"]
      ]}}
    ],

    theory: [
      { h: "Module 05 — an abstract class with deliberately asymmetric signatures" },
      { p: "The base declares two methods abstract and one concrete, and the asymmetry of the signatures is the lesson:" },
      { code: String.raw`class DataProcessor(ABC):
    @abstractmethod
    def validate(self, data: Any) -> bool:
        """Keeps Any in every subclass — the caller asks because it
        does not know the answer."""

    @abstractmethod
    def ingest(self, data: Any) -> None:
        """Subclasses narrow this to the types they actually accept."""

    def output(self) -> tuple[int, str]:
        """Identical everywhere, so it is written once in the base."""`,
        cap: "Why validate keeps Any and ingest does not", lang: "python" },
      { note: "`validate` and `ingest` must agree. If `validate` accepts a list of lists, `ingest` has to reach the same depth, or it stores the repr of an inner list as if it were a value. Put the flattening helper in the base class." },
      { p: "`isinstance(True, int)` is `True` — a numeric processor that does not exclude `bool` silently ingests `True` as the number 1." },
      { h: "Protocol — a contract without inheritance" },
      { p: "Exercise 2 of module 05 uses `Protocol` for the export plugins. The difference from an ABC is **who has to know about whom**: an ABC's subclass must import and subclass our base, while a plugin author only has to match a method signature, and can write the plugin in a package that has never heard of ours." },
      { code: String.raw`class ExportPlugin(Protocol):
    def process_output(self, data: list[tuple[int, str]]) -> None: ...

# Nothing inherits from it, and this class already satisfies it
class CsvExportPlugin:
    def process_output(self, data: list[tuple[int, str]]) -> None:
        print(",".join(value for _, value in data))`,
        cap: "Duck typing that a type checker can still verify", lang: "python" },
      { note: "A plain `Protocol` cannot be used with `isinstance` — it raises `TypeError`, because it is a type-check-time contract rather than a runtime one. Keep a runtime guard as well: `callable(getattr(plugin, \"process_output\", None))`." },
      { h: "Module 06 — two rules explain everything" },
      { ul: [
        "`import x` inside a package is always absolute — it finds the top-level `x`, not the sibling; `from .x import y` finds the sibling. Two files both called `elements.py` can coexist because a module's identity is its **dotted path**, not its file name",
        "`__init__.py` decides what a package ‘offers’ — a function that is not re-exported makes `package.name` raise `AttributeError` while `from package.module import name` still works. Being in a package is not being part of its interface"
      ]},
      { h: "Module 07 — three patterns that stack" },
      { table: { head: ["Pattern", "What it removes from the caller"], rows: [
        ["**abstract factory**", "the concrete class name — the caller asks for \"the base card of the fire family\", never `Flameling()`"],
        ["**capability**", "the assumption that an ability belongs to a species — `HealCapability` does not inherit `Creature` at all, so other things can have it"],
        ["**strategy**", "the `if isinstance` chain in the code that runs the fight — the tournament calls `act()` and prints what comes back"]
      ]}}
    ],

    architecture: [
      { h: "The file tree of module 06 is the subject" },
      { code: String.raw`.
|-- alchemy
|   |-- __init__.py            # decides what the package offers
|   |-- elements.py            # create_earth, create_air
|   |-- potions.py             # imports both root elements and .elements
|   |-- grimoire
|   |   |-- __init__.py        # light only — never touches dark
|   |   |-- light_spellbook.py
|   |   |-- light_validator.py # deferred import = circle broken
|   |   |-- dark_spellbook.py
|   |   '-- dark_validator.py  # top-level import = circle closed = boom
|   '-- transmutation
|       |-- __init__.py
|       '-- recipes.py         # one absolute, one relative
|-- elements.py                # create_fire, create_water
'-- ft_alembic_0.py ... ft_kaboom_1.py`,
        cap: "Thirteen root scripts, each demonstrating one import style", lang: "text" },
      { code: String.raw`"""alchemy/potions.py — where the two elements.py files meet"""

import elements                       # absolute: finds the root elements.py
from .elements import create_air      # relative: finds the sibling

def strength_potion() -> str:
    return (f"Strength potion brewed with '{elements.create_fire()}' "
            f"and '{elements.create_water()}'")`,
        cap: "Without the leading dot the sibling is unreachable from here", lang: "python" },
      { h: "An `__init__.py` that hides something on purpose" },
      { code: String.raw`from .elements import create_air
from .potions import healing_potion as heal
from .potions import strength_potion
from .transmutation import lead_to_gold

__all__ = ["create_air", "heal", "strength_potion", "lead_to_gold"]
# create_earth is absent -> alchemy.create_earth raises AttributeError
# but from alchemy.elements import create_earth still works`,
        cap: "alchemy/__init__.py", lang: "python" },
      { note: "Put re-exported names in `__all__`: it silences flake8's F401 and satisfies mypy's `--no-implicit-reexport` under `--strict`." },
      { h: "Module 07's layout" },
      { code: String.raw`ex0/  __init__.py  creature.py  creatures.py  factory.py
ex1/  __init__.py  capabilities.py  creatures.py  factory.py
ex2/  __init__.py  strategy.py
battle.py  capacitor.py  tournament.py`,
        cap: "Packages expose factories and abstract types, nothing else", lang: "text" }
    ],

    dataflow: [
      { h: "Circular imports — why they break, and three ways out" },
      { p: "Two modules importing each other at the top will always catch one of them half-built. Python says so itself:" },
      { code: String.raw`ImportError: cannot import name 'dark_spell_allowed_ingredients'
from partially initialized module 'alchemy.grimoire.dark_spellbook'
(most likely due to a circular import)`,
        cap: "\"partially initialized\" is the tell", lang: "text" },
      { p: "When `dark_validator` asks `dark_spellbook` for a name, that module is in `sys.modules` but has only executed as far as its own import line — the functions below it do not exist yet." },
      { table: { head: ["Way out", "When to use it"], rows: [
        ["**Deferred import** — move the import inside the function", "when the two modules genuinely have to stay apart; the cost is one dict lookup per call"],
        ["**Merge the two modules**", "when they cannot be used apart anyway — they were one module all along"],
        ["**Invert the dependency** — move the shared data to a third module, or pass it as an argument", "cleanest, and usually ruled out only because the subject fixes the signature"]
      ]}},
      { code: String.raw`def validate_ingredients(ingredients: str) -> str:
    # Imported here, not at the top: by the time this runs, both
    # modules are fully loaded.
    from .light_spellbook import light_spell_allowed_ingredients

    lowered = ingredients.lower()
    allowed = light_spell_allowed_ingredients()
    matched = any(item in lowered for item in allowed)
    return f"{ingredients} - {'VALID' if matched else 'INVALID'}"`,
        cap: "The deferred import that breaks the circle", lang: "python" },
      { h: "Multiple inheritance — module 07's quietest trap" },
      { p: "A card inherits from `Creature` and from a capability at once, but `Creature.__init__` does not call `super().__init__()`, so a cooperative `super()` chain stops there and the capability's constructor never runs." },
      { code: String.raw`# Wrong — silent until the capability's state is read
class Shiftling(Creature, TransformCapability):
    def __init__(self) -> None:
        super().__init__("Shiftling", "Normal")
        # TransformCapability.__init__ never runs
        # AttributeError: '_transformed' on the first attack()

# Right — call each base explicitly
class Shiftling(Creature, TransformCapability):
    def __init__(self) -> None:
        Creature.__init__(self, "Shiftling", "Normal")
        TransformCapability.__init__(self)`,
        cap: "The MRO cannot help if a class in the middle does not cooperate", lang: "python" },
      { h: "The strategy that leaves the tournament knowing nothing" },
      { code: String.raw`class AggressiveStrategy(BattleStrategy):
    label = "aggressive"

    def is_valid(self, creature: Creature) -> bool:
        return isinstance(creature, TransformCapability)

    def act(self, creature: Creature) -> list[str]:
        # Repeated because this is what narrows the type for mypy,
        # and an assert will not do: -O strips asserts.
        if not isinstance(creature, TransformCapability):
            raise self._reject(creature)
        return [creature.transform(), creature.attack(), creature.revert()]`,
        cap: "ex2/strategy.py", lang: "python" },
      { p: "And `run_tournament` then contains no `isinstance`, no capability name, and no mention of healing or transforming at all." }
    ],

    implementation: [
      { h: "The test that proves the pattern works" },
      { p: "The best test for all three modules is the same shape: **invent something new inside the test file** and run it through untouched code. If it works, the pattern delivered what it promised." },
      { code: String.raw`# Testing module 07 with a capability invented just now
class FlyCapability(ABC):
    @abstractmethod
    def fly(self) -> str: ...

class Windling(ex0.Creature, FlyCapability):
    def __init__(self) -> None:
        ex0.Creature.__init__(self, "Windling", "Flying")
    def attack(self) -> str: return f"{self.name} buffets the field!"
    def fly(self) -> str: return f"{self.name} takes to the sky!"

class SoaringStrategy(ex2.BattleStrategy):
    label = "soaring"
    def is_valid(self, creature): return isinstance(creature, FlyCapability)
    def act(self, creature):
        if not isinstance(creature, FlyCapability):
            raise self._reject(creature)
        return [creature.fly(), creature.attack()]

# tournament.py is not edited by a single line
out = captured(tournament.run_tournament,
               [(WindFactory(), SoaringStrategy()),
                (ex0.FlameFactory(), ex2.NormalStrategy())])
assert "Windling takes to the sky!" in out`,
        cap: "If this needs an edit to run_tournament, the pattern is not finished", lang: "python" },
      { h: "Testing module 06's import machinery" },
      { code: String.raw`# Two files with the same name, two different modules
python3 -c "import elements, alchemy.elements as inner; \
print(elements is inner, elements.__name__, inner.__name__)"
# False elements alchemy.elements

# The circle fails from either side, and fails again on a retry
python3 -c "import alchemy.grimoire.dark_validator"   # ImportError
python3 -c "import alchemy.grimoire.dark_spellbook"   # ImportError

# While the light pair loads from either side
python3 -c "import alchemy.grimoire.light_validator"  # ok`,
        cap: "Use a fresh interpreter each time — sys.modules remembers", lang: "bash" },
      { note: "**The negative control worth writing**: copy the tree to a temporary directory, move `light_validator`'s deferred import back to the top of the file, and confirm the light pair explodes exactly like the dark one. Without it, a test saying \"light works\" proves nothing." },
      { h: "Module 06 has one error you must leave in" },
      { p: "`ft_alembic_4.py` calls a function the package does not expose. It has to fail with `AttributeError`, and **mypy has to report it**, as the subject says. The honest check is to assert there is **exactly one** error and that it is that one — not to silence it with `# type: ignore`." },
      { code: String.raw`errors = [line for line in mypy_output.splitlines() if ": error:" in line]
assert len(errors) == 1
assert errors[0].startswith("ft_alembic_4.py")
assert "[attr-defined]" in errors[0]`,
        cap: "Checking for the error that is meant to be there", lang: "python" }
    ],

    tricks: [
      { h: "Symptom → cause" },
      { table: { head: ["Symptom", "Cause"], rows: [
        ["`cannot import name X from partially initialized module Y`", "a circular import — defer one of the two into a function"],
        ["`Module has no attribute X` when the function plainly exists", "the `__init__.py` does not re-export it"],
        ["F401 imported but unused in an `__init__.py`", "add `__all__` — it silences flake8 and satisfies `--no-implicit-reexport`"],
        ["`AttributeError: '_transformed'` in a multiply-inherited class", "the second base's `__init__` never ran; call each base explicitly"],
        ["`isinstance()` against a Protocol raises `TypeError`", "a plain Protocol is a type-check-time contract; use `@runtime_checkable` or check `callable(getattr(...))` yourself"],
        ["A processor ingests `True` as the number 1", "`bool` is a subclass of `int`; exclude it explicitly"],
        ["`validate` passes but `ingest` stores something odd", "the two methods disagree about the shape of the data, e.g. nested lists"],
        ["mypy complains when narrowing after `is_valid`", "`is_valid` does not narrow; write the `isinstance` inside `act`"]
      ]}},
      { h: "Rules that make the decision fast" },
      { ul: [
        "**ABC when something ‘is’ a kind of thing, Protocol when it merely ‘can do’ something** — the pipeline's input side uses inheritance and its output side uses duck typing, and that contrast is what the evaluation asks about",
        "**Absolute imports for anything a reader would look up, relative for the package's own internals** — relative lets the package be renamed without edits",
        "`__init__.py` is an interface, not a table of contents — put only what outsiders are meant to use",
        "Never let a package's `__init__.py` touch a module that is meant to fail — importing the package would then explode wholesale",
        "`assert` is not a check — `python -O` strips it. Use `if ... raise` when the outcome matters"
      ]}
    ],

    eval: [
      { qa: [
        { q: "Why does `validate` keep `Any` in every subclass while `ingest` narrows?", a: "Because the caller asks `validate` precisely because it does not know the type yet; requiring it to know first would destroy the method's reason to exist. By the time `ingest` is called the answer is known, so the signature can narrow." },
        { q: "How does polymorphism let DataStream handle types it knows nothing about?", a: "It holds a list of `DataProcessor` and asks each one `validate(element)`. The knowledge of what counts as numeric data lives in one place — next to the code that handles numeric data — rather than spread through an `isinstance` chain in the router." },
        { q: "How do ABC and Protocol differ, and how do you choose?", a: "An ABC enforces an inheritance relationship and is checked when you instantiate. A Protocol is a structural contract checked only at type-check time. Choose an ABC when you own the hierarchy; choose a Protocol when you want other people to write compatible things without importing anything from you." },
        { q: "When should you use absolute versus relative imports?", a: "An absolute import names the package out loud, so it is easy to look up and works from anywhere on `sys.path`, but breaks the day the package is renamed. A relative import says \"two levels up from me\", so the package can be moved or renamed without edits — but it only works while the file is part of a package." },
        { q: "How many ways are there to fix a circular import?", a: "Three: defer the import into the function that needs it; merge the two modules because they cannot really be used apart; or invert the dependency by moving the shared data into a third module or passing it in as an argument. The third is cleanest when the signature is not fixed for you." },
        { q: "How is an abstract factory different from an ordinary constructor function?", a: "An ordinary function makes one thing. An abstract factory makes a **matched set** — the base card and its evolution from the same family — and guarantees you cannot end up with one from another family." },
        { q: "Why do capabilities not inherit from Creature?", a: "Because a capability says what something ‘can do’, not what it ‘is’. If it inherited from Creature, an item or a piece of terrain could not have the same ability without dragging a creature's name and type along with it." },
        { q: "How does the strategy pattern separate concerns?", a: "The fight code would otherwise need to know every capability through a chain of conditionals. Moving the behaviour into strategy classes leaves the tournament calling `act()`, so a new capability is an ‘added class’ rather than an ‘edited function’." }
      ]}
    ]
  },

  py_toolkit: {
    principle: [
      { h: "These three modules are the tools you keep" },
      { table: { head: ["Module", "Skill", "Why it matters outside school"], rows: [
        ["**08** The Matrix", "venv, pip/Poetry, `.env`", "every working Python repository in the world has all three"],
        ["**09** Cosmic Data", "Pydantic v2", "validating at the boundary instead of failing halfway through"],
        ["**10** FuncMage", "lambdas, closures, decorators", "reading other people's code, and writing things that get reused"]
      ]}},
      { h: "What gets submitted" },
      { table: { head: ["Module", "Files"], rows: [
        ["08", "`ex0/construct.py`, `ex1/loading.py` + `requirements.txt` + `pyproject.toml`, `ex2/oracle.py` + `.env.example` + `.gitignore`"],
        ["09", "`ex0/space_station.py`, `ex1/alien_contact.py`, `ex2/space_crew.py` — Pydantic 2.x, installed with pip"],
        ["10", "`lambda_spells.py`, `higher_magic.py`, `scope_mysteries.py`, `functools_artifacts.py`, `decorator_mastery.py`"]
      ]}},
      { note: "Module 10 forbids **global variables**, **file I/O**, and `eval`/`exec`. Those bans are checked against the real source, not against what the code claims." }
    ],

    theory: [
      { h: "What a venv actually is" },
      { p: "A virtual environment is not a container. There is no process isolation and no new Python. It is a directory that makes `sys.prefix` and `sys.base_prefix` disagree — a `pyvenv.cfg`, a link to the real interpreter, and one empty `site-packages`." },
      { code: String.raw`def in_virtual_environment() -> bool:
    """The only reliable test."""
    return sys.prefix != sys.base_prefix`,
        cap: "PEP 405 in one line", lang: "python" },
      { note: "Do not use `VIRTUAL_ENV` as the answer. The activate script sets it, so it is empty when the venv's python is called by full path without activating, and it can be left stale after deactivating. Report it as information; never let it decide." },
      { h: "What really separates pip from Poetry" },
      { table: { head: ["", "pip", "Poetry"], rows: [
        ["File", "`requirements.txt`, a flat list", "`pyproject.toml`, a declaration"],
        ["How it installs", "one at a time, in file order", "resolves the whole dependency graph first, then installs"],
        ["Version conflicts", "you get whatever was installed last", "refuses a combination that cannot exist"],
        ["Reproducible?", "no — two machines a month apart can differ", "`poetry.lock` pins the resolved versions"]
      ]}},
      { p: "The difference that matters is not the command spelling but **who resolves the versions** — `pip freeze` records what happened to be installed, while a lock file records what was computed to be consistent." },
      { h: "Pydantic v2 — the annotation is the validation" },
      { p: "`crew_size: int = Field(ge=1, le=20)` is not a comment for a reader. It means **a station with 21 crew cannot be constructed**. The error arrives at the boundary where the bad data entered, not a thousand lines later where something divides by it." },
      { table: { head: ["Behaviour", "What to know before trusting a model"], rows: [
        ["Coercion is on", "`\"6\"` becomes `6` and an ISO string becomes a `datetime`, because data usually arrives from JSON"],
        ["But only losslessly", "`6.5` into an `int` is an error, not a silent 6"],
        ["Assignment is not validated", "construction is checked; `station.crew_size = 99` afterwards is not, unless the model asks with `validate_assignment=True`"],
        ["A bare annotation is a field", "constants need `ClassVar[...]`, or they become settable fields"]
      ]}},
      { h: "Module 10 — three words to keep apart" },
      { ul: [
        "**A lambda** is a function without a name. Its advantage is that a `sorted` key is used once, right where it is written; its limits are no docstring, no statements, and a traceback that only says `<lambda>`",
        "**A closure** is a function plus the enclosing variables it still refers to. When `mage_counter` returns, `count` does not disappear — the returned function holds the ‘cell’ that stores it",
        "**A decorator** is a function returning a function. `@spell_timer` above a definition means `fireball = spell_timer(fireball)`; everything else follows from that sentence"
      ]},
      { note: "Reading an enclosing variable needs no declaration; ‘rebinding’ one needs `nonlocal` — otherwise the assignment makes it local and reading it first raises `UnboundLocalError`. Mutating a dict is not rebinding, so a closure over a dict needs no declaration at all." }
    ],

    architecture: [
      { h: "A program that survives its libraries being absent" },
      { p: "Module 08's `loading.py` has to work with and without pandas, so it must not `import pandas` at the top — that turns a missing library into a traceback before `main()` has a chance to start." },
      { code: String.raw`import importlib
from typing import Any


def load(name: str) -> Any:
    """Import by name, or return None when it is not installed."""
    try:
        return importlib.import_module(name)
    except ImportError:
        return None


def check_dependencies() -> dict[str, Any]:
    loaded: dict[str, Any] = {}
    for dependency in DEPENDENCIES:
        module = load(dependency.module)
        if module is None:
            print(f"[MISSING] {dependency.module}")
            continue
        loaded[dependency.module] = module
        version = getattr(module, "__version__", "unknown")
        print(f"[OK] {dependency.module} ({version})")
    return loaded`,
        cap: "The import result becomes data instead of a crash", lang: "python" },
      { note: "The subject allows flake8 and mypy import errors in this exercise — but written this way there are none to allow." },
      { p: "And the `Agg` backend must be selected before `matplotlib.pyplot` is imported, or a machine with no display (a build server, an ssh session) cannot even import it for a program that only writes a file." },
      { h: "Configuration where the shell always wins" },
      { code: String.raw`from dotenv import load_dotenv

from_shell = {key for key in KEYS if key in os.environ}  # read first!
load_dotenv(ENV_FILE, override=False)                    # fill in the gaps
from_file = {key for key in KEYS
             if key in os.environ and key not in from_shell}`,
        cap: "override=False is the whole point", lang: "python" },
      { p: "`load_dotenv` defaults to **not** overwriting existing variables. That is what makes `MATRIX_MODE=production python3 oracle.py` work without editing anything. Passing `override=True` reverses it, and a deployment that sets its secrets in the process environment would find them replaced by a developer's file." },
      { h: "A Pydantic model with cross-field rules" },
      { code: String.raw`class AlienContact(BaseModel):
    contact_id: str = Field(min_length=5, max_length=15)
    contact_type: ContactType
    signal_strength: float = Field(ge=0.0, le=10.0)
    witness_count: int = Field(ge=1, le=100)
    message_received: str | None = Field(default=None, max_length=500)
    is_verified: bool = False

    # ClassVar, not a bare annotation, or this becomes a field
    STRONG_SIGNAL: ClassVar[float] = 7.0

    @model_validator(mode="after")
    def check_report_is_credible(self) -> "AlienContact":
        if not self.contact_id.startswith("AC"):
            raise ValueError("Contact ID must start with 'AC'")
        if self.contact_type is ContactType.PHYSICAL and not self.is_verified:
            raise ValueError("Physical contact reports must be verified")
        return self          # omit this and the constructor returns None`,
        cap: "Field for one field, model_validator for several", lang: "python" }
    ],

    dataflow: [
      { h: "Nested models — the ordering is the useful part" },
      { p: "`crew: list[CrewMember]` is not a hint that hopes for the best. Pydantic validates every element, and a dict in that list is **constructed into** a `CrewMember`. A mission built from parsed JSON comes out with real crew objects, not dictionaries pretending to be them." },
      { code: String.raw`try:
    SpaceMission(mission_id="X_BAD", crew=[{"name": "A", "age": 9, ...}])
except ValidationError as error:
    print(error.errors()[0]["loc"])   # ('crew', 0, 'age')
    print(error.errors()[0]["msg"])   # Input should be greater than or equal to 18`,
        cap: "Inner models validate first, so the mission's own validator never runs", lang: "python" },
      { p: "And every failing field is reported together in one pass rather than one at a time — `error.errors()` is a list." },
      { h: "Two closures are two cells" },
      { code: String.raw`counter = mage_counter()
counter.__closure__[0].cell_contents      # 0 before any call
counter()
counter.__closure__[0].cell_contents      # 1 after

other = mage_counter()
counter.__closure__[0] is other.__closure__[0]   # False`,
        cap: "This is why nonlocal is allowed where global is not", lang: "python" },
      { p: "`nonlocal` reaches one enclosing function, so the state belongs to that closure alone. `global` reaches module state that every function in the program shares — exactly the coupling this module teaches how to avoid." },
      { h: "functools — four tools and what each replaces" },
      { table: { head: ["Tool", "What it replaces"], rows: [
        ["`reduce`", "the loop that folds a sequence into one value — `sum` is `reduce(add, ...)` with a nicer name"],
        ["`partial`", "a lambda that freezes some arguments, except it keeps `__doc__` and can be pickled"],
        ["`lru_cache`", "the hand-written dict of results you forget to invalidate"],
        ["`singledispatch`", "the `if isinstance` chain, turned into a registry — a new type is one registration, not an edit"]
      ]}},
      { code: String.raw`@functools.lru_cache(maxsize=None)
def memoized_fibonacci(n: int) -> int:
    if n < 0:
        raise ValueError("Fibonacci is not defined for negative numbers")
    if n < 2:
        return n
    return memoized_fibonacci(n - 1) + memoized_fibonacci(n - 2)

memoized_fibonacci(25)
memoized_fibonacci.cache_info()     # misses=26 — each n exactly once
# the uncached version: 242785 calls`,
        cap: "The cache changes the complexity, not just the constant", lang: "python" },
      { h: "A decorator that serves both functions and methods" },
      { p: "The subject applies `power_validator` to a standalone function **whose first argument is power**, and also to `cast_spell(self, spell_name, power)`, whose first argument is `self`. The way out without reaching for `inspect`:" },
      { code: String.raw`def _power_from(args: tuple[Any, ...], kwargs: dict[str, Any]) -> Any:
    """A keyword wins because it is unambiguous; otherwise take the
    first int among the positional arguments — self is not an int, so
    it is skipped without the decorator knowing about methods."""
    if "power" in kwargs:
        return kwargs["power"]
    for value in args:
        if isinstance(value, int) and not isinstance(value, bool):
            return value
    return None`,
        cap: "One decorator, both call shapes", lang: "python" }
    ],

    implementation: [
      { h: "Tests that measure instead of assert" },
      { p: "The good tests in these three modules **measure something real** rather than comparing a string." },
      { code: String.raw`# lru_cache: the uncached version is the negative control
uncached_calls = {"n": 0}

def naive(n: int) -> int:
    uncached_calls["n"] += 1
    if n < 2:
        return n
    return naive(n - 1) + naive(n - 2)

assert naive(25) == memoized_fibonacci(25)
assert memoized_fibonacci.cache_info().misses == 26
assert uncached_calls["n"] > 200000     # 242785 in practice`,
        cap: "The numbers do the talking, not the docstring", lang: "python" },
      { code: String.raw`# A secret must not appear, whatever its source
result = run(ORACLE, {"API_KEY": "hunter2-do-not-print"})
assert "hunter2-do-not-print" not in result.stdout
assert "API_KEY: set (20 characters)" in result.stdout

# And .env must really be ignored, not merely reported as [OK]
assert ".env" in open("ex2/.gitignore").read().split()`,
        cap: "Check the setup, not the message it prints", lang: "python" },
      { note: "**Module 08's most valuable negative control**: copy `oracle.py` to a temporary directory, insert `API_KEY = \"sk-live-...\"`, and confirm the security audit catches it. Without that, the `[OK] No hardcoded secrets detected` line proves nothing at all." },
      { h: "Checking a decorator properly" },
      { code: String.raw`# Did functools.wraps really preserve the metadata?
assert fireball.__name__ == "fireball"
assert hasattr(fireball, "__wrapped__")

# The timer must report even when the function explodes,
# because it times in a finally
buffer = io.StringIO()
with redirect_stdout(buffer):
    try: doomed()
    except RuntimeError: pass
assert "Spell completed in" in buffer.getvalue()

# The retry must print exactly max_attempts - 1 lines
for attempts in (1, 2, 5):
    printed = count_retry_lines(attempts)
    assert printed == attempts - 1`,
        cap: "A decorator's edge cases", lang: "python" },
      { h: "Testing the venv from both sides" },
      { code: String.raw`# outside a venv
python3 ex0/construct.py                       # "You're still plugged in"

# inside a venv, without activating
./.venv/bin/python ex0/construct.py            # "Welcome to the construct"

# VIRTUAL_ENV left stale, but not actually in a venv
VIRTUAL_ENV=/tmp/not-real python3 ex0/construct.py
# must still say "still plugged in" — sys.prefix decides`,
        cap: "Three cases that separate a real check from a guess", lang: "bash" }
    ],

    tricks: [
      { h: "Symptom → cause" },
      { table: { head: ["Symptom", "Cause"], rows: [
        ["A Pydantic model gained a field you never declared", "a constant written as a bare annotation; use `ClassVar`"],
        ["A Pydantic constructor returned `None`", "a `@model_validator` that does not `return self`"],
        ["`@validator` warns about deprecation", "that is v1 — use `@model_validator(mode=\"after\")`"],
        ["`6.5` is not converted to `6`", "correct — Pydantic only coerces losslessly"],
        ["Assigning after construction is not validated", "add `model_config = ConfigDict(validate_assignment=True)`"],
        ["`matplotlib` will not import on a headless machine", "select `matplotlib.use(\"Agg\")` before importing pyplot"],
        ["`.env` overrides a value set in the shell", "`override=True` is in there; remove it"],
        ["A decorated function reports its name as `wrapper`", "missing `functools.wraps`"],
        ["`UnboundLocalError` on a variable the outer function set", "the inner function assigns to it, so it is local; add `nonlocal`"],
        ["F811 redefinition of unused '_'", "several `singledispatch` implementations share the name `_`; give each its own"],
        ["A `bool` reaches the `int` implementation", "correct — `bool` is a subclass of `int`"],
        ["`mypy --strict` complains about a bare `Callable`", "declare an alias, e.g. `Spell = Callable[[str, int], str]`"]
      ]}},
      { h: "Rules you can apply immediately" },
      { ul: [
        "Only `sys.prefix != sys.base_prefix` detects a venv — the environment variable lies in both directions",
        "**Never print a secret, not even masked** — its length is enough to debug a typo and useless to anyone reading a log",
        "`.env` goes in `.gitignore` from the first commit — a secret that reaches a git history is compromised even after deletion, because the old commit still holds it and every clone already has it; rotating the key is the only real fix",
        "**Validate at the boundary** — one Pydantic model at the edge means the rest of the code needs no checks at all",
        "Take `Callable` from `collections.abc`, not `typing`; `callable()` is a different thing — the builtin that checks a value at runtime",
        "A lambda for an expression handed straight to `sorted`/`map`/`filter`, a `def` for everything else — anything that deserves a name should have one"
      ]}
    ],

    eval: [
      { qa: [
        { q: "How does a virtual environment work?", a: "It is a directory holding a `pyvenv.cfg`, a link to the real interpreter and its own `site-packages`. The effect is that `sys.prefix` points into that directory while `sys.base_prefix` still points at the real Python, so imports resolve elsewhere. There is no process isolation and no new interpreter." },
        { q: "Why not use `VIRTUAL_ENV` to detect it?", a: "Because the activate script sets it. Calling `.venv/bin/python` by full path without activating leaves it empty while you really are in a venv, and after deactivating it can be left behind. `sys.prefix` is right in both cases." },
        { q: "How do pip and Poetry differ?", a: "pip installs the entries of `requirements.txt` one at a time, so conflicting versions resolve to whatever went last. Poetry resolves the whole dependency graph first, refuses combinations that cannot coexist, and writes the resolved versions to `poetry.lock` so the next machine gets the same set." },
        { q: "Why must `.env` be in `.gitignore`?", a: "Because it holds the real secret values, and a secret that enters a git history is compromised even if it is deleted later — the old commit still contains it and anyone with a clone already has it. Rotating the key is the only real fix. `.env.example` is committed because it only says which variables exist." },
        { q: "How does Pydantic handle nested models?", a: "It validates the inner models first and constructs dicts in a list into real objects. If one member fails, the outer model's validator never runs, because there is no valid model to run it against, and the error carries the path, e.g. `crew.1.age`." },
        { q: "How does `mode=\"after\"` differ from `mode=\"before\"`?", a: "`after` runs once every field has been parsed and validated, so `self` has real types — the right place for rules involving several fields. `before` receives the raw input dict, which is right for reshaping or renaming keys before validation." },
        { q: "How does a closure remember its environment?", a: "The inner function keeps a reference to the cell holding the outer function's variable, so the variable does not disappear when the outer function returns. Because each call creates a fresh cell, two counters have independent state." },
        { q: "Why is `global` forbidden while `nonlocal` is allowed?", a: "`nonlocal` reaches exactly one enclosing function, so the state stays private to that closure. `global` reaches module-level state shared by every function in the program, which is the coupling that makes programs hard to test and hard to change." },
        { q: "Where is `functools.wraps` actually needed?", a: "It copies `__name__`, `__doc__`, `__module__` and `__wrapped__` from the original onto the wrapper. Without it the decorated function reports itself as `wrapper`, `help()` shows nothing, and a decorator that prints the function's name prints the wrong one every time." },
        { q: "What performance benefit does `lru_cache` give?", a: "It stores results by argument. For naive recursive fibonacci the entire exponential cost comes from recomputing the same subtrees; with the cache each n is evaluated exactly once and the whole thing becomes linear — a change of complexity class, not just a constant factor." }
      ]}
    ]
  },


});
