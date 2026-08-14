/* English deep content for the Python track. Appended to the same sections,
   block for block, as data.python.deep.js */
(function () {

  var EN = {
    py_series: {
      theory: [
        { h: "Module 00 — the iterative and recursive twins" },
        { p: "Exercise 6 asks for two functions whose output is **identical, character for character**. It is the exercise that teaches that one algorithm has two shapes, and which shape suits what." },
        { code: String.raw`def ft_count_harvest_iterative() -> None:
    """Count from 1 to harvest day, with a loop."""
    days = int(input("Days until harvest: "))
    day = 1
    while day <= days:
        print(f"Day {day}")
        day += 1
    print("Harvest time!")`,
          cap: "ex6 iteratively — the state lives in the variable day", lang: "python" },
        { code: String.raw`def _count_from(day: int, last: int) -> None:
    """Helper: print from day to last — explicitly authorised."""
    if day > last:
        return
    print(f"Day {day}")
    _count_from(day + 1, last)


def ft_count_harvest_recursive() -> None:
    """Identical from the outside; only the counting differs."""
    days = int(input("Days until harvest: "))
    _count_from(1, days)
    print("Harvest time!")`,
          cap: "ex6 recursively — the state lives in the call stack", lang: "python" },
        { table: { head: ["Way to recurse", "Upside", "Downside"], rows: [
          ["a separate helper function", "the public function keeps exactly its twin's signature", "one more name in the file"],
          ["a nested function", "no name escapes", "slightly harder to read"],
          ["a default parameter", "shortest", "the public signature drifts from its twin, and a caller can pass something odd"]
        ]}},
        { note: "The subject accepts all three, but the first keeps **the two signatures genuinely identical**, which is what an evaluator compares and what a test can check most easily." },
        { p: "The boundaries to try: `0` must print no days at all and go straight to Harvest time, and `1` must print exactly one day. Writing `while day < days` instead of `<=` fails both." },

        { h: "Module 01 — one class that grows over seven exercises" },
        { p: "The seven exercises are not seven separate problems; they are **one class improved seven times**. Read them in order and each round visibly fixes a problem the previous one had." },
        { code: String.raw`# ex1 — hold the data in attributes instead of three loose variables
class Plant:
    """One plant."""

    def __init__(self, name: str, height: float, days_old: int) -> None:
        self.name = name
        self.height = height
        self.days_old = days_old

    def show(self) -> None:
        print(f"{self.name}: {self.height}cm, {self.days_old} days")`,
          cap: "The problem it fixes: three plants' data was scattered", lang: "python" },
        { code: String.raw`# ex2 — let the plant act for itself; behaviour joins the data
    def grow(self) -> None:
        """Grow by this plant's own rate."""
        self.height = round(self.height + self.growth_rate, 1)

    def age(self) -> None:
        """One day older."""
        self.days_old += 1`,
          cap: "The problem it fixes: an outside function had to reach in and edit", lang: "python" },
        { note: "**The name clash is here.** The subject calls the method `age()`. If the day counter is also a public attribute called `age`, the two overwrite each other and mypy reports `Cannot assign to a method` — use `days_old` for now and switch to `_age` at exercise 4." },
        { code: String.raw`# ex4 — close the data off, and validate before storing
class Plant:
    def __init__(self, name: str, height: float, age: int) -> None:
        self._name = name
        self._height = 0.0
        self._age = 0
        self.set_height(height)      # validated even at construction
        self.set_age(age)

    def set_height(self, height: float) -> None:
        """Set the height, refusing a negative without touching the old one."""
        if height < 0:
            print(f"Error: height {height} is negative, keeping "
                  f"{self._height}")
            return
        self._height = height

    def get_height(self) -> float:
        return self._height`,
          cap: "The problem it fixes: anyone could write plant.height = -5", lang: "python" },
        { p: "What people miss is **constructing with a bad value and getting away with it** — if `__init__` writes `self._height = height` directly, the check only applies to later setter calls. Routing the constructor through the setter keeps the rule in one place." },
        { code: String.raw`# ex5 — inheritance, and a show() that extends the parent's
class Flower(Plant):
    def __init__(self, name: str, height: float, age: int,
                 colour: str) -> None:
        super().__init__(name, height, age)   # let the parent do its part
        self._colour = colour

    def bloom(self) -> str:
        return f"{self._name} blooms in {self._colour}"

    def show(self) -> None:
        super().show()                        # the parent's line first
        print(f"Colour: {self._colour}")      # then only what is new`,
          cap: "Copying the parent's print into the child is what loses the mark", lang: "python" },
        { code: String.raw`# ex6 — a nested class, a static method and a class method
class Plant:
    class Stats:
        """Statistics for one plant — meaningless outside a Plant."""

        def __init__(self) -> None:
            self._grow_calls = 0
            self._age_calls = 0
            self._show_calls = 0

        def display(self) -> None:
            print(f"grow={self._grow_calls} age={self._age_calls} "
                  f"show={self._show_calls}")

    def __init__(self, name: str, height: float, age: int) -> None:
        ...
        self._stats = self.Stats()     # <- self.Stats, not Plant.Stats

    @staticmethod
    def is_older_than_a_year(days: int) -> bool:
        """Looks at the number it was given, at no particular plant."""
        return days > 365

    @classmethod
    def anonymous(cls) -> "Plant":
        """cls is the point — Flower.anonymous() must return a Flower."""
        return cls("Unknown plant", 0.0, 0)`,
          cap: "Three ideas in one file", lang: "python" },
        { note: "**The trick worth keeping.** If `__init__` builds its statistics with `self.Stats()` rather than `Plant.Stats()`, a `Tree` that defines its own `Stats` gets the right counter automatically, because attribute lookup goes through the instance's class. No registry, no `isinstance` chain." },
        { code: String.raw`def display_stats(plant: Plant) -> None:
    """One function that works for every kind of plant."""
    plant.get_stats().display()`,
          cap: "Polymorphism doing the work instead of type checks — the last exercise asks for exactly this", lang: "python" },

        { h: "Module 02 — the exception hierarchy" },
        { p: "What this module really teaches is not `try` syntax but **who should catch what**. An inner function raises what it knows; an outer one catches what it can handle; and nobody catches what they cannot fix." },
        { code: String.raw`class GardenError(Exception):
    """A garden problem — the base of them all."""

    def __init__(self, message: str = "Unknown garden error") -> None:
        super().__init__(message)


class PlantError(GardenError):
    """A problem with a plant."""

    def __init__(self, message: str = "Unknown plant error") -> None:
        super().__init__(message)


class WaterError(GardenError):
    """A problem with watering."""

    def __init__(self, message: str = "Unknown water error") -> None:
        super().__init__(message)`,
          cap: "The default goes through super() so str(error) still works", lang: "python" },
        { code: String.raw`try:
    register_plant(name)
except PlantError as error:
    print(f"Caught PlantError: {error}")      # the specific one

try:
    run_garden()
except GardenError as error:
    print(f"Caught GardenError: {error}")     # the whole family, via the base`,
          cap: "Inheritance is what makes catching a family possible", lang: "python" },
        { table: { head: ["Written like this", "What happens"], rows: [
          ["`except ValueError:`", "catches what you know can happen — correct"],
          ["`except (ValueError, TypeError):`", "two things handled the same way — correct"],
          ["`except GardenError:`", "a family you defined yourself — correct"],
          ["`except Exception:`", "swallows your own bugs too — needs a written reason"],
          ["`except:`", "catches Ctrl+C and SystemExit as well — almost never right"]
        ]}},
        { code: String.raw`def water_plant(plant_name: str) -> None:
    """Water it, and clean up either way."""
    print(f"Opening water valve for {plant_name}")
    try:
        if plant_name != plant_name.capitalize():
            raise PlantError(f"{plant_name} is not a proper plant name")
        print(f"{plant_name} watered successfully")
    finally:
        print("Closing water valve")     # runs on success and on raise`,
          cap: "finally is for releasing resources, not for reporting results", lang: "python" },

        { h: "Module 03 — pick the structure that matches the question" },
        { p: "Each of the seven exercises is built so that **one structure answers it cleanly**. Pick wrong and it still works, but longer and slower than it should be." },
        { table: { head: ["Exercise", "The real question", "The structure that answers it"], rows: [
          ["ex1 scores", "total, highest, lowest of a sequence that may repeat", "a `list`, then `sum`, `max`, `min`"],
          ["ex2 coordinates", "three values that travel together and should not change", "a `tuple`, unpacked into three names"],
          ["ex3 achievements", "who has what, who shares, who alone", "`set`, then `&`, `|`, `-`"],
          ["ex4 inventory", "looked up by an item's name, not its position", "a `dict`, which keeps insertion order"],
          ["ex5 events", "an endless stream", "a generator"],
          ["ex6 alchemy", "build a new collection from an old one in one line", "a comprehension"]
        ]}},
        { code: String.raw`# ex3 — three questions, three operators
players = {
    "ann": {"first_blood", "sharpshooter", "survivor"},
    "bob": {"first_blood", "collector"},
    "cid": {"first_blood", "survivor", "explorer"},
}

everything = set().union(*players.values())          # every unique one
shared = set.intersection(*players.values())         # what everyone has
for name, owned in players.items():
    others = set().union(*(v for k, v in players.items() if k != name))
    unique = owned - others                          # only this player
    missing = everything - owned                     # still to collect
    print(f"{name}: unique={sorted(unique)} missing={sorted(missing)}")`,
          cap: "With lists this becomes nested loops immediately", lang: "python" },
        { note: "Anything printed from a set must be `sorted()` first, or the order is not stable between runs and any test comparing the output stops meaning anything." },
        { code: String.raw`# ex4 — ties go to whichever came first on the command line
inventory = {"potion": 5, "elixir": 5, "rope": 2}

most = max(inventory.items(), key=lambda item: item[1])
least = min(inventory.items(), key=lambda item: item[1])
print(most)      # ('potion', 5) — max keeps the first of a tie`,
          cap: "Insertion-ordered dict plus max keeping the first tie gives the subject's rule for free", lang: "python" },
        { code: String.raw`# ex5 — an endless generator, and taking from it one at a time
import random
from typing import Generator


def gen_event() -> Generator[str, None, None]:
    """A stream of events that never ends."""
    names = ["login", "attack", "heal", "logout"]
    while True:
        yield random.choice(names)


stream = gen_event()
for _ in range(5):
    print(next(stream))       # one at a time; no list is ever built`,
          cap: "yield freezes the function and resumes it where it stopped", lang: "python" },

        { h: "Module 04 — what `with` saves you from remembering" },
        { p: "The first three exercises forbid `with` so that you see exactly what closing a file on every exit path requires." },
        { code: String.raw`def read_fragment(path: str) -> str:
    """Open, read, close — and the close must happen on every path."""
    handle = None
    try:
        handle = open(path, "r", encoding="utf-8")
        return handle.read()          # <- even this return must still close
    except (OSError, ValueError, UnicodeDecodeError) as error:
        print(f"Error opening {path}: {error}")
        return ""
    finally:
        if handle is not None:        # open may never have succeeded
            handle.close()`,
          cap: "Exercises 0-2 must look like this, and the None check is the part people forget", lang: "python" },
        { code: String.raw`def read_fragment(path: str) -> str:
    """The same thing, with the language keeping the promise."""
    try:
        with open(path, "r", encoding="utf-8") as handle:
            return handle.read()
    except (OSError, ValueError, UnicodeDecodeError) as error:
        print(f"Error opening {path}: {error}")
        return ""`,
          cap: "Exercise 3 onward — shorter, and impossible to forget", lang: "python" },
        { table: { head: ["Situation", "The exception you actually get"], rows: [
          ["the file does not exist", "`FileNotFoundError` (a subclass of `OSError`)"],
          ["no permission to read", "`PermissionError` (a subclass of `OSError`)"],
          ["the path is a directory", "`IsADirectoryError` (a subclass of `OSError`)"],
          ["a binary file opened as text", "`UnicodeDecodeError`"],
          ["a path containing a NUL byte", "`ValueError` — **not** `OSError`"]
        ]}},
        { note: "The bottom two rows are why the catch must be `(OSError, ValueError, UnicodeDecodeError)` rather than `OSError` alone — and they are cases you meet while writing tests, not while reading the subject." },
        { code: String.raw`import sys

# exercise 2 — read input without input(), and send errors elsewhere
for line in sys.stdin:
    text = line.rstrip("\n")
    if not text:
        print("[STDERR] empty line", file=sys.stderr)
        continue
    print(text.upper())`,
          cap: "stdout and stderr are separate pipes and can be redirected apart", lang: "python" },
        { code: String.raw`$ printf "a\n\nb\n" | python3 ft_stream_management.py 2>/dev/null
A
B
$ printf "a\n\nb\n" | python3 ft_stream_management.py 1>/dev/null
[STDERR] empty line`,
          cap: "Prove they really are separate by throwing one away at a time", lang: "bash" }
      ],

      dataflow: [
        { h: "The shape almost every program in this series has" },
        { p: "Nearly every exercise in modules 03 and 04 has the same shape — **take in, validate, transform, report** — and the marks are lost at the validate step." },
        { table: { head: ["Stage", "Takes", "Passes on", "How it goes wrong"], rows: [
          ["take in", "`sys.argv`, `input()` or `sys.stdin`", "a list of strings", "forgetting that `argv[0]` is the script's name"],
          ["validate", "strings that could be anything", "the usable values, plus a report of the discarded ones", "catching too broadly and swallowing your own bug"],
          ["transform", "the usable values", "the structure you chose", "having chosen the wrong structure to begin with"],
          ["report", "the structure", "text matching the transcript", "rounding or spacing that does not match"]
        ]}},
        { code: String.raw`def parse_scores(arguments: list[str]) -> list[int]:
    """Turn arguments into scores, discarding and naming the bad ones."""
    scores: list[int] = []
    for argument in arguments:
        try:
            scores.append(int(argument))
        except ValueError:
            print(f"Ignoring '{argument}': not a number")
    return scores


def main() -> None:
    scores = parse_scores(sys.argv[1:])     # skip the script's name
    if not scores:
        print("No valid scores given")
        return
    print(f"count: {len(scores)}")
    print(f"total: {sum(scores)}")
    print(f"highest: {max(scores)}")
    print(f"lowest: {min(scores)}")`,
          cap: "This shape fits exercise 1 of module 03 and several others", lang: "python" },
        { p: "Note that **the validation lives in one place** and `main` never needs a `try` at all. It is the same shape module 08 uses for configuration and A-Maze-ing uses for its config file." },
        { h: "Rounding — the most common reason output does not match" },
        { code: String.raw`print(round(2 / 3, 2))        # 0.67
print(round(1 / 3 * 3, 2))    # 1.0   not 1
print(f"{2/3:.2f}")           # '0.67' — a string, not the same as round
print(round(2.675, 2))        # 2.67  not 2.68: binary cannot hold it exactly`,
          cap: "round returns a number, an f-string returns text — the transcript says which is wanted", lang: "python" },
        { note: "A transcript showing `85.0` means a float that went through `round`, not formatted text. Showing `85.00` means the opposite. **Read the transcript for what type it is telling you.**" }
      ],

      implementation: [
        { h: "What each module needs testing for" },
        { p: "The same three-tier structure everywhere, but what has to be trapped differs with the nature of the exercises." },
        { table: { head: ["Module", "What the tests have to trap"], rows: [
          ["00", "capture stdout and feed a fake `input`, because the functions read their own input"],
          ["01", "that no public attribute survives exercise 4, and that `Flower.anonymous()` really returns a `Flower`"],
          ["02", "that the catches are narrow, and that `finally` runs on both paths"],
          ["03", "that calling twice gives the same answer, and that a generator is empty once consumed"],
          ["04", "that no `with` appears in the first three, and that descriptors do not leak over 200 runs"]
        ]}},
        { code: String.raw`import builtins
import io
from contextlib import redirect_stdout


def run_with_input(function, answers: list[str]) -> str:
    """Call a function that uses input(), with the answers queued up."""
    queue = list(answers)
    real_input = builtins.input

    def fake_input(prompt: str = "") -> str:
        print(prompt, end="")
        return queue.pop(0)

    builtins.input = fake_input
    try:
        buffer = io.StringIO()
        with redirect_stdout(buffer):
            function()
        return buffer.getvalue()
    finally:
        builtins.input = real_input      # always put it back`,
          cap: "This makes an interactive exercise testable with nobody at the keyboard", lang: "python" },
        { code: String.raw`# module 01 — check that encapsulation really happened
plant = Plant("Rose", 25.0, 30)
assert not hasattr(plant, "height")        # no public name left
assert plant.get_height() == 25.0

plant.set_height(-5)                        # must be refused
assert plant.get_height() == 25.0           # and the old value must hold

# and the classmethod must return the class it was called on
assert type(Flower.anonymous()) is Flower`,
          cap: "The last two lines catch the most common exercise-6 bug", lang: "python" },
        { code: String.raw`# module 04 — check the "no with" rule against source with prose stripped
import tokenize


def code_tokens(path: str) -> list[str]:
    """Return the file's tokens, minus comments and docstrings."""
    with open(path, "rb") as raw:
        tokens = list(tokenize.tokenize(raw.readline))
    kept, previous = [], tokenize.INDENT
    for token in tokens:
        if token.type == tokenize.COMMENT:
            continue
        if token.type == tokenize.STRING and previous in (
                tokenize.INDENT, tokenize.NEWLINE, tokenize.NL,
                tokenize.ENCODING):
            continue
        kept.append(token.string)
        previous = token.type
    return kept


assert "with" not in code_tokens("ex0/ft_ancient_text.py")
assert "with" in code_tokens("ex3/ft_vault_security.py")`,
          cap: "A plain grep finds the word with inside a docstring and reports a compliant file", lang: "python" },
        { note: "**Every time a test fails, ask first which is broken — the code or the test.** Across all eleven modules, most of the failures turned out to be the harness. Tighten the check; do not relax the assertion." }
      ]
    },

    py_patterns: {
      theory: [
        { h: "Module 05 — the real code of all three exercises" },
        { p: "The three exercises are one system grown three times: the processors, then the router, then the way out." },
        { code: String.raw`class DataProcessor(ABC):
    """The interface every processor shares."""

    def __init__(self, name: str) -> None:
        self._name = name
        self._items: list[tuple[int, str]] = []
        self._rank = 0

    @abstractmethod
    def validate(self, data: Any) -> bool:
        """Can you take this? Keeps Any: the caller does not know yet."""

    @abstractmethod
    def ingest(self, data: Any) -> None:
        """Take it in; subclasses narrow the type and raise on the wrong one."""

    def _store(self, value: str) -> None:
        self._items.append((self._rank, value))
        self._rank += 1

    def output(self) -> tuple[int, str]:
        """Remove and return the oldest item with its rank."""
        if not self._items:
            raise IndexError(f"{self._name} has no data to output")
        return self._items.pop(0)`,
          cap: "ex0 — two abstract, one concrete", lang: "python" },
        { code: String.raw`class NumericProcessor(DataProcessor):
    def validate(self, data: Any) -> bool:
        if isinstance(data, list):
            return bool(data) and all(self.validate(x) for x in data)
        # bool subclasses int, so it has to be excluded explicitly
        return isinstance(data, (int, float)) and not isinstance(data, bool)

    def ingest(self, data: int | float | list[int | float]) -> None:
        if not self.validate(data):
            raise TypeError("Improper numeric data")
        for value in self._flatten(data):
            self._store(str(value))`,
          cap: "The signature narrows, and it still defends itself", lang: "python" },
        { note: "`validate` and `ingest` must agree. If `validate` accepts a nested list and `ingest` flattens only one level, it stores the repr of an inner list as a value — a bug that really happened while building this, and the test that caught it fed in a nested list." },
        { code: String.raw`class DataStream:
    def process_stream(self, stream: list[Any]) -> None:
        """Give each element to the first processor that accepts it."""
        for element in stream:
            for processor in self._processors:
                if processor.validate(element):
                    processor.ingest(element)
                    break
            else:                       # for-else: nobody broke out
                print("DataStream error - Can't process element in "
                      f"stream: {element}")`,
          cap: "ex1 — the whole function names no data type at all", lang: "python" },
        { p: "Python's `for ... else` runs when the loop finished without hitting `break`, which is precisely the meaning wanted here: no processor took it." },
        { code: String.raw`class ExportPlugin(Protocol):
    """A structural contract — nothing inherits from it."""

    def process_output(self, data: list[tuple[int, str]]) -> None: ...


class CsvExportPlugin:
    """Inherits from nothing, and already satisfies the contract."""

    def process_output(self, data: list[tuple[int, str]]) -> None:
        print("CSV Output:")
        print(",".join(self._escape(value) for _, value in data))

    @staticmethod
    def _escape(value: str) -> str:
        """A field holding a comma, quote or newline has to be wrapped."""
        if not any(c in value for c in ',"\n\r'):
            return value
        return '"' + value.replace('"', '""') + '"'`,
          cap: "ex2 — inheritance on the way in, duck typing on the way out", lang: "python" },
        { note: "A plain `Protocol` cannot be used with `isinstance` — it raises `TypeError` — so keep a runtime guard too: `callable(getattr(plugin, \"process_output\", None))`." },

        { h: "Module 06 — why imports fail the way they do" },
        { p: "The whole module follows from one fact: a module is executed once, and the result is cached in `sys.modules`." },
        { code: String.raw`import sys

import alchemy.elements           # runs the file, this first time
print("alchemy" in sys.modules)   # True
print("alchemy.elements" in sys.modules)   # True

import alchemy.elements           # second time: not executed again
# the cached object comes straight back`,
          cap: "This is the include guard Python already has", lang: "python" },
        { code: String.raw`# the timeline that makes a circular import fail
# 1. somebody imports dark_spellbook
# 2. Python puts dark_spellbook in sys.modules (still empty)
# 3. it starts executing line 1 -> from .dark_validator import ...
# 4. it starts executing dark_validator -> from .dark_spellbook import ...
# 5. dark_spellbook is already in sys.modules, so it is NOT re-executed
# 6. but it only ran as far as line 1: the functions do not exist -> ImportError`,
          cap: "Step 5 is the heart of it — the cache helps speed, and here it hands back something unfinished", lang: "text" },
        { code: String.raw`def validate_ingredients(ingredients: str) -> str:
    """Import when called, not when the module loads."""
    from .light_spellbook import light_spell_allowed_ingredients

    lowered = ingredients.lower()
    allowed = light_spell_allowed_ingredients()
    matched = any(item in lowered for item in allowed)
    return f"{ingredients} - {'VALID' if matched else 'INVALID'}"`,
          cap: "By call time both modules are fully loaded", lang: "python" },
        { table: { head: ["Written as", "Finds which file", "When to use it"], rows: [
          ["`import elements`", "the top-level file", "something outside the package that a reader will look up"],
          ["`from .elements import x`", "the sibling inside the same package", "the package's own internals"],
          ["`from ..potions import x`", "one level up, then into that file", "crossing levels inside a package"],
          ["`from alchemy.elements import x`", "the full path, spelled out", "when the package name should be visible to a reader"]
        ]}},

        { h: "Module 07 — three patterns stacked on each other" },
        { p: "Exercise 0 takes the class names out of the caller, exercise 1 takes abilities out of species, exercise 2 takes behaviour out of the code that fights. Each round the caller knows less." },
        { code: String.raw`# before the patterns — the caller knows everything, and changes every time
def battle(name_a: str, name_b: str) -> None:
    if name_a == "flameling":
        a = Flameling()
    elif name_a == "aquabub":
        a = Aquabub()
    ...
    if isinstance(a, TransformCapability):
        a.transform(); a.attack(); a.revert()
    elif isinstance(a, HealCapability):
        a.attack(); a.heal()
    else:
        a.attack()`,
          cap: "Two chains, both edited whenever a card or a capability is added", lang: "python" },
        { code: String.raw`# after — not one class name and not one isinstance remains
def run_tournament(opponents: list[tuple[CreatureFactory,
                                         BattleStrategy]]) -> None:
    cards = [(factory.create_base(), strategy)
             for factory, strategy in opponents]
    for index, (challenger, first) in enumerate(cards):
        for opponent, second in cards[index + 1:]:
            print("* Battle *")
            print(challenger.describe())
            print("vs.")
            print(opponent.describe())
            print("now fight!")
            try:
                for creature, strategy in ((challenger, first),
                                           (opponent, second)):
                    for line in strategy.act(creature):
                        print(line)
            except InvalidStrategyError as error:
                print(f"Battle error, aborting tournament: {error}")
                return`,
          cap: "A new capability means a new class, and no edit here", lang: "python" },
        { note: "**The multiple-inheritance trap, met for real.** `Creature.__init__` does not call `super().__init__()`, so a cooperative `super()` chain stops there and the capability's constructor never runs. The result is `AttributeError: '_transformed'` on the first attack — call each base explicitly." }
      ],

      implementation: [
        { h: "The test that proves the pattern works" },
        { p: "The best test for all three modules is the same: **invent something new inside the test file** and push it through code that is not edited by a single line." },
        { code: String.raw`# module 05 — a fourth processor the base class never heard of
class BoolProcessor(module.DataProcessor):
    def __init__(self) -> None:
        super().__init__("Bool Processor")

    def validate(self, data: Any) -> bool:
        return isinstance(data, bool)

    def ingest(self, data: Any) -> None:
        if not self.validate(data):
            raise TypeError("Improper bool data")
        self._store(str(data))


stream = DataStream()
stream.register_processor(BoolProcessor())
stream.register_processor(NumericProcessor())
stream.process_stream([True, 1, False])
assert stream.processors[0].total == 2      # the bools went to the new one
assert stream.processors[1].total == 1      # the number to the old one`,
          cap: "process_stream is untouched and still routes the new type", lang: "python" },
        { code: String.raw`# module 06 — testing imports needs a fresh interpreter each time
$ python3 -c "import elements, alchemy.elements as inner; \
print(elements is inner, elements.__name__, inner.__name__)"
False elements alchemy.elements

$ python3 -c "import alchemy.grimoire.dark_validator"    # ImportError
$ python3 -c "import alchemy.grimoire.dark_spellbook"    # the same ImportError
$ python3 -c "import alchemy.grimoire.light_validator"   # fine`,
          cap: "sys.modules remembers a successful import, so each probe needs its own process", lang: "bash" },
        { note: "**The negative control you cannot skip.** Copy the tree to a temporary directory, move `light_validator`'s deferred import back to the top of the file, and confirm the light pair explodes like the dark one. Without it, a test saying \"light works\" proves nothing." },
        { code: String.raw`# module 07 — check that the package hides the concrete cards
for name in ("Flameling", "Pyrodon", "Aquabub", "Torragon"):
    assert not hasattr(ex0, name)

assert sorted(ex0.__all__) == ["AquaFactory", "Creature",
                               "CreatureFactory", "FlameFactory"]

# and that a factory hands out a new card each time, not a shared one
flame = ex0.FlameFactory()
assert flame.create_base() is not flame.create_base()`,
          cap: "Both are stated plainly in the subject and both are commonly left untested", lang: "python" }
      ]
    },

    py_toolkit: {
      theory: [
        { h: "Module 08 — a venv is a directory, not magic" },
        { code: String.raw`$ python3 -m venv .venv
$ ls .venv
bin  include  lib  lib64  pyvenv.cfg

$ cat .venv/pyvenv.cfg
home = /usr/bin
include-system-site-packages = false
version = 3.12.3`,
          cap: "All a venv is: one config file, a link, and an empty site-packages", lang: "bash" },
        { code: String.raw`import sys

print(sys.executable)     # which python is running
print(sys.prefix)         # where it looks for libraries
print(sys.base_prefix)    # where the real python lives

# inside a venv the last two differ; outside one they are the same
print(sys.prefix != sys.base_prefix)`,
          cap: "The entire detection is comparing those two values", lang: "python" },
        { table: { head: ["Situation", "`VIRTUAL_ENV`", "`sys.prefix != sys.base_prefix`"], rows: [
          ["outside a venv", "empty", "False — right"],
          ["activated", "set", "True — right"],
          ["calling `.venv/bin/python` directly, not activated", "**empty — wrong**", "True — right"],
          ["deactivated but the variable lingers", "**set — wrong**", "False — right"]
        ]}},
        { p: "The bottom two rows are why `sys.prefix` has to be the answer, and the environment variable can only be reported as background information." },
        { h: "Why importlib instead of a plain import" },
        { code: String.raw`# the plain way — a missing library is a traceback before main() starts
import pandas          # ModuleNotFoundError the moment the file loads

# the way that survives — the import result becomes data
import importlib
from typing import Any


def load(name: str) -> Any:
    try:
        return importlib.import_module(name)
    except ImportError:
        return None`,
          cap: "The subject waives linter import errors here — written this way there are none", lang: "python" },
        { h: "Module 09 — when Pydantic checks" },
        { code: String.raw`from pydantic import BaseModel, ConfigDict, Field


class SpaceStation(BaseModel):
    model_config = ConfigDict(validate_assignment=True)

    station_id: str = Field(min_length=3, max_length=10)
    crew_size: int = Field(ge=1, le=20)`,
          cap: "Without validate_assignment, changing a value later is not checked", lang: "python" },
        { table: { head: ["Written", "Result", "Because"], rows: [
          ["`SpaceStation(crew_size=\"6\", ...)`", "you get `6` as an int", "coercion is on, and nothing is lost"],
          ["`SpaceStation(crew_size=6.0, ...)`", "you get `6`", "6.0 converts without losing anything"],
          ["`SpaceStation(crew_size=6.5, ...)`", "**an error**", "the conversion would lose information"],
          ["`station.crew_size = 99`", "an error with `validate_assignment` on", "silent without it"],
          ["`last_maintenance=\"2024-01-15T10:30:00\"`", "a real `datetime`", "an ISO string is parsed for you"]
        ]}},
        { code: String.raw`@model_validator(mode="after")
def check_report_is_credible(self) -> "AlienContact":
    """Rules that involve more than one field at a time."""
    if not self.contact_id.startswith("AC"):
        raise ValueError("Contact ID must start with 'AC'")
    if self.contact_type is ContactType.PHYSICAL and not self.is_verified:
        raise ValueError("Physical contact reports must be verified")
    return self        # <- omit this and the constructor returns None`,
          cap: "Raise ValueError and Pydantic wraps it into a ValidationError for you", lang: "python" },
        { note: "Constants inside a model must be `ClassVar`, or `STRONG_SIGNAL: float = 7.0` becomes a settable field and shows up in `model_fields` — a bug found by a test that counted the fields." },
        { h: "Module 10 — what a closure is, structurally" },
        { code: String.raw`def mage_counter() -> Callable[[], int]:
    count = 0

    def increment() -> int:
        nonlocal count      # without this line: UnboundLocalError
        count += 1
        return count

    return increment


counter = mage_counter()
print(counter.__closure__)                       # it carries a cell
print(counter.__closure__[0].cell_contents)      # 0 before any call
counter()
print(counter.__closure__[0].cell_contents)      # 1 after

other = mage_counter()
print(counter.__closure__[0] is other.__closure__[0])   # False`,
          cap: "Two counters, two cells — which is why nonlocal is safe where global is not", lang: "python" },
        { code: String.raw`import functools

@functools.lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

fib(25)
print(fib.cache_info())     # misses=26 — each n exactly once
# the uncached version calls itself 242,785 times for the same n`,
          cap: "The cache changes the class of the problem, not just a constant", lang: "python" }
      ],

      implementation: [
        { h: "Tests that measure instead of asserting" },
        { code: String.raw`# lru_cache — the uncached version is the negative control
calls = {"n": 0}


def naive(n: int) -> int:
    calls["n"] += 1
    if n < 2:
        return n
    return naive(n - 1) + naive(n - 2)


assert naive(25) == memoized_fibonacci(25)
assert memoized_fibonacci.cache_info().misses == 26
assert calls["n"] > 200000`,
          cap: "The numbers do the talking, not the docstring", lang: "python" },
        { code: String.raw`# venv — test all three situations from outside the program
$ python3 ex0/construct.py                       # outside a venv
$ ./.venv/bin/python ex0/construct.py            # inside, without activating
$ VIRTUAL_ENV=/tmp/not-real python3 ex0/construct.py   # a stale variable
# the last one must still report being outside a venv`,
          cap: "These three separate a real check from a guess", lang: "bash" },
        { code: String.raw`# Pydantic — test both sides of every constraint
assert build(crew_size=1).crew_size == 1        # lower bound accepted
assert build(crew_size=20).crew_size == 20      # upper bound accepted
assert rejects(lambda: build(crew_size=0)) == \
    "Input should be greater than or equal to 1"
assert rejects(lambda: build(crew_size=21)) == \
    "Input should be less than or equal to 20"`,
          cap: "ge and gt differ by one character; only a test at the edge tells them apart", lang: "python" },
        { code: String.raw`# a secret must not appear, whatever its source
result = run(ORACLE, {"API_KEY": "hunter2-do-not-print"})
assert "hunter2-do-not-print" not in result.stdout
assert "API_KEY: set (20 characters)" in result.stdout

# and .env must really be ignored, not merely reported as [OK]
assert ".env" in open("ex2/.gitignore").read().split()`,
          cap: "Check the setup, not the message the program prints", lang: "python" },
        { note: "**Module 08's most valuable negative control**: copy `oracle.py` to a temporary directory, insert a hardcoded secret, and confirm the security audit catches it. Without that, the `[OK] No hardcoded secrets detected` line proves nothing." }
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
