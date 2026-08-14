/* English content for Python for C Programmers. Block count and key shape
   mirror data.pyfromc.js index for index. */
window.TEACHING_EN = window.TEACHING_EN || {};

Object.assign(window.TEACHING_EN, {

  py_from_c: {
    principle: [
      { h: "Who this page is for" },
      { p: "Someone who already writes C — through libft, get_next_line and minishell, comfortable with headers, structs, `malloc` and prototypes. Python's syntax is the easy part. What trips people is the four places where **Python has no direct equivalent**, so they invent one and head the wrong way." },
      { table: { head: ["In C", "In Python", "The mistake it causes"], rows: [
        ["header file + linker", "the module, imported at runtime", "writing \"declarations\" in one file and \"definitions\" in another"],
        ["`struct`", "dataclass, NamedTuple, TypedDict or a plain dict", "reaching for a class with getters and setters for three fields"],
        ["`malloc` / `free`", "reference counting plus a cycle collector", "believing `del` frees memory, or that a copy was made"],
        ["function prototype", "`def` plus type hints", "expecting overloading, and expecting pass-by-value"]
      ]}},
      { note: "If you have never written Python at all, read **Python 101** first. This page skips the basics because it assumes you already program." },
      { h: "The one difference that explains almost everything else" },
      { p: "In C a variable is **storage** of a fixed size. `int a = 5;` reserves four bytes and puts 5 in them, and `b = a` copies the bytes." },
      { p: "In Python a variable is **a name bound to an object on the heap**. `a = 5` creates (or fetches) an integer object and sticks a label on it, and `b = a` sticks a second label on the same object. **Nothing is copied.**" },
      { code: String.raw`/* C — two variables, two pieces of storage */
int a[3] = {1, 2, 3};
int b[3];
memcpy(b, a, sizeof b);     /* copies 12 bytes */
b[0] = 99;                  /* a[0] is still 1 */`,
        cap: "C copies when you tell it to", lang: "c" },
      { code: String.raw`# Python — one object, two names
a = [1, 2, 3]
b = a                       # copies nothing at all
b[0] = 99
print(a)                    # [99, 2, 3]  <- changed too

b = a.copy()                # if you want a second one, ask
b[0] = 1
print(a)                    # [99, 2, 3]  <- untouched now`,
        cap: "Python copies only when asked", lang: "python" },
      { p: "Hold on to that one fact and structs, argument passing, memory, and `is` versus `==` all follow from it." }
    ],

    theory: [
      { h: "A module is the header and the object file at once" },
      { p: "In C a header **declares**, a `.c` file **defines**, and the linker joins them. Python has **no declaration step at all**. A module is **executed once**, top to bottom, on the first import, and the resulting namespace is cached in `sys.modules`. Every later import returns that same object." },
      { table: { head: ["What C has to do", "What Python does"], rows: [
        ["write a prototype before use", "nothing — `def` is an executable statement that builds a function object and binds a name"],
        ["`#ifndef` to guard against double inclusion", "nothing — `sys.modules` is already the guard; importing twice does not execute twice"],
        ["declare shared variables with `extern`", "nothing — import the name directly"],
        ["tell the linker what to link against", "nothing — `import` finds the file at runtime"],
        ["`static` to hide a symbol inside a file", "the leading-underscore convention, and `__all__` in `__init__.py`"]
      ]}},
      { code: String.raw`/* geometry.h */
#ifndef GEOMETRY_H
#define GEOMETRY_H
double area(double width, double height);
#endif

/* geometry.c */
#include "geometry.h"
double area(double width, double height) { return width * height; }

/* main.c */
#include "geometry.h"
/* and still: cc main.c geometry.c */`,
        cap: "C needs three files and a link step", lang: "c" },
      { code: String.raw`# geometry.py — one file, and no declaration section
def area(width: float, height: float) -> float:
    """Return the area of a rectangle."""
    return width * height


AREA_UNIT = "m2"`,
        cap: "geometry.py", lang: "python" },
      { code: String.raw`# main.py — three forms, and nothing to compile first
import geometry
print(geometry.area(3, 4))

from geometry import area
print(area(3, 4))

from geometry import area as surface
print(surface(3, 4))`,
        cap: "$ python3 main.py — there is no link step", lang: "python" },
      { note: "**Top-level module code runs at import time**, so a module that prints or opens a file outside a function does it as a side effect the moment anyone imports it. That is what `if __name__ == \"__main__\":` is for — something C never needs, because it has exactly one `main()`." },
      { h: "Defining functions — what a prototype cannot say" },
      { code: String.raw`def spawn(name: str, /, count: int = 1, *tags: str,
          verbose: bool = False, **options: str) -> tuple[int, str]:
    """One signature using every feature Python has."""
    ...`,
        cap: "Read it part by part in the table below", lang: "python" },
      { table: { head: ["Part", "Meaning"], rows: [
        ["`name: str`", "annotated — not enforced at runtime, checked by mypy"],
        ["`/`", "everything before it is positional-only, as C parameters always are"],
        ["`count: int = 1`", "a default, evaluated **once, at definition time**"],
        ["`*tags: str`", "the remaining positional arguments, as a tuple"],
        ["`verbose: bool = False`", "after the `*`, so it can only be passed by name"],
        ["`options` prefixed with two stars", "the remaining keyword arguments, as a dict"],
        ["`-> tuple[int, str]`", "returns two values, which C would need an out-parameter for"]
      ]}},
      { code: String.raw`def min_max(values: list[int]) -> tuple[int, int]:
    """Return both at once — no out-parameters needed."""
    return min(values), max(values)


low, high = min_max([3, 1, 4])`,
        cap: "Instead of int min_max(int *v, int n, int *out_max)", lang: "python" },
      { ul: [
        "**There is no overloading** — a second `def` of the same name replaces the first. Use default arguments instead, or dispatch on type with `functools.singledispatch`",
        "**Functions are values** — stored, passed, returned and closed over: a function pointer that carries its surrounding state with it",
        "**Docstrings replace the header comment** — the first string in a function is `__doc__`, which `help()` reads"
      ]},
      { note: "There are no pointers, so `swap(&a, &b)` cannot be written. A function can mutate the *inside* of an object it was given, but it **cannot rebind the caller's name**. When you need two new values, return a tuple and let the caller unpack it." }
    ],

    foundations: [
      { h: "What replaces a struct" },
      { p: "C has one answer. Python has four, and choosing by habit is the mistake." },
      { table: { head: ["Use", "When", "The cost"], rows: [
        ["`dict`", "the keys are data, not code — parsed JSON, a config file", "no type checking; a typo becomes a new key"],
        ["`TypedDict`", "it must stay a dict (it came from JSON) but you want the keys checked", "checked only at type-check time; at runtime it is a dict"],
        ["`NamedTuple`", "a small immutable record, compared and unpacked like a tuple", "cannot be modified after creation"],
        ["`@dataclass`", "a record with behaviour, or one that changes", "a real class; use `frozen=True` when it should not change"]
      ]}},
      { code: String.raw`/* C */
typedef struct s_particle {
    double  x;
    double  y;
    double  *trail;
    size_t  trail_len;
}   t_particle;

t_particle *p = malloc(sizeof(t_particle));
p->x = 0;
free(p->trail);
free(p);`,
        cap: "C: one shape, and you manage its lifetime", lang: "c" },
      { code: String.raw`from dataclasses import dataclass, field
from typing import NamedTuple, TypedDict


class PointT(TypedDict):        # at runtime this is just a dict
    x: int
    y: int


class Point(NamedTuple):        # immutable, unpacks like a tuple
    x: int
    y: int


@dataclass
class Particle:                 # a mutable record that can have methods
    x: float
    y: float
    trail: list[float] = field(default_factory=list)   # never = []

    def step(self, dx: float, dy: float) -> None:
        self.x += dx
        self.y += dy
        self.trail.append(self.x)`,
        cap: "No free, and no length to track by hand", lang: "python" },
      { code: String.raw`point = Point(3, 4)
x, y = point                 # unpacks like a tuple
print(point.x)               # and reads by name

particle = Particle(0.0, 0.0)
particle.step(1.0, 2.0)
print(particle)              # a dataclass prints itself readably
print(Point(3, 4) == Point(3, 4))       # True — comparison for free`,
        cap: "What you get for nothing that C makes you write", lang: "python" },
      { note: "`field(default_factory=list)` only, never `= []`. A default is created once, when the class is defined, so every instance would share one list — the same trap as a mutable default argument." },
      { h: "Three C habits worth dropping" },
      { ul: [
        "**Do not write getters and setters by reflex** — a public attribute can become a computed `@property` later without changing a single caller, so there is nothing to guard against in advance. Write them when there is validation to do, which is exactly what Module 01's encapsulation exercise asks for",
        "**A dataclass is not a struct in memory** — its fields live in the instance's `__dict__` unless you add `__slots__`; there is no guaranteed layout, no padding to reason about, and no `sizeof`",
        "**Stop carrying a length beside an array** — `len(x)` works on everything, and a list knows its own size"
      ]},
      { h: "`__slots__`, when the count really is large" },
      { code: String.raw`@dataclass
class Compact:
    __slots__ = ("x", "y")
    x: float
    y: float

# no per-instance __dict__, far less memory once there are millions
# in exchange, no new attributes can be added at runtime`,
        cap: "As close to a struct as Python gets", lang: "python" },
      { p: "Do not add `__slots__` by default. Add it once you have **measured** that the instance count is a real problem — the same rule as optimising in C." }
    ],

    architecture: [
      { h: "How several files are joined" },
      { code: String.raw`myproject/
|-- main.py                # the entry point
|-- geometry.py            # a standalone module
'-- shapes/                # a package
    |-- __init__.py        # the package's public face
    |-- circle.py
    '-- polygon.py`,
        cap: "A directory with an __init__.py is a package", lang: "text" },
      { code: String.raw`# shapes/__init__.py — the closest thing to a public header for the group
from .circle import Circle, area_of_circle
from .polygon import Polygon

__all__ = ["Circle", "area_of_circle", "Polygon"]
# anything not listed is internal, even though the file is right there`,
        cap: "__all__ is what makes flake8 and mypy --strict treat these as public", lang: "python" },
      { table: { head: ["Form", "What it looks for", "Compared to C"], rows: [
        ["`import x`", "the top-level module `x`", "`#include <x.h>`, then reaching through the module name"],
        ["`from .x import y`", "the sibling file `x` in the same package", "`#include \"x.h\"` with a relative path"],
        ["`from x import y`", "the name `y` from module `x`, bound in this file", "no equivalent — C does not import one symbol at a time"],
        ["`import x.y.z`", "one package level at a time", "the directory structure of your headers"]
      ]}},
      { note: "`import x` inside a package is always absolute. It finds the top-level `x`, not the sibling; the leading dot is what means \"beside me\". That is why two files with the same name at different levels can coexist — a module's identity is its **dotted path**, not its filename." },
      { h: "Running a module that lives in a package" },
      { code: String.raw`# wrong — relative imports break, because the file runs as a lone script
python3 shapes/circle.py

# right — run it as a module, with the package still importable
python3 -m shapes.circle`,
        cap: "-m is the reliable way", lang: "bash" },
      { h: "Circular imports fail differently from C" },
      { p: "C either fails at link time or works. Python fails **halfway through** executing one of the two modules, and says that module is **partially initialized**." },
      { code: String.raw`ImportError: cannot import name 'helper' from partially initialized
module 'tools' (most likely due to a circular import)`,
        cap: "\"partially initialized\" is the tell", lang: "text" },
      { table: { head: ["Way out", "When to use it"], rows: [
        ["move the import inside the function", "when the two modules genuinely must stay apart; the cost is one dict lookup per call"],
        ["merge the two modules", "when they cannot be used apart anyway — they were one module all along"],
        ["invert the dependency", "move the shared thing into a third module, or pass it in as an argument — the cleanest"]
      ]}},
      { p: "This is the whole of **Python Module 06**, which makes you build both a pair that avoids it and a pair that genuinely explodes." }
    ],

    dataflow: [
      { h: "Memory: no malloc, no free" },
      { p: "Every value is an object on the heap, and a name is a reference to one. Assignment never copies the object — it copies the reference." },
      { code: String.raw`import sys

a = [1, 2, 3]
print(sys.getrefcount(a))   # 2 — the name a, plus getrefcount's own argument

b = a
print(sys.getrefcount(a))   # 3 — one more name

del b                        # deletes the NAME, not the object
print(sys.getrefcount(a))   # 2 — the list is alive; a still points at it

del a                        # now nothing points at it, and it is freed at once`,
        cap: "Watch the count change rather than take the explanation on trust", lang: "python" },
      { p: "**Reference counting** frees an object **the moment** the last reference goes away, which is predictable in a way a tracing collector is not. What it cannot free is a **cycle** — two objects pointing at each other never reach zero — so CPython also runs a cycle collector." },
      { code: String.raw`import gc

class Node:
    def __init__(self) -> None:
        self.peer: "Node | None" = None

first, second = Node(), Node()
first.peer = second
second.peer = first          # a cycle; refcounting cannot free it
del first, second            # both names gone, the objects are not

print(gc.collect())          # the cycle collector picks them up`,
        cap: "This is why Python needs a gc despite counting references", lang: "python" },
      { note: "`del x` is not `free(x)`. It removes a name from a namespace. The object goes only if that was the last reference; if a list somewhere still holds it, it is entirely alive." },
      { h: "Passing arguments" },
      { code: String.raw`def mutate(items: list[int]) -> None:
    items.append(99)         # changes the INSIDE of the caller's object


def rebind(items: list[int]) -> None:
    items = [0]              # rebinds a local name — the caller notices nothing


numbers = [1, 2]
mutate(numbers)
print(numbers)               # [1, 2, 99]
rebind(numbers)
print(numbers)               # [1, 2, 99]  <- unchanged`,
        cap: "The reference is passed, but the caller's binding cannot be changed", lang: "python" },
      { p: "This is neither pass-by-value nor C++ pass-by-reference: it is **passing a copy of the reference**. In practice a function can mutate the caller's list, and cannot write `swap(a, b)`." },
      { h: "Three levels of copying" },
      { code: String.raw`import copy

rows = [[1, 2], [3, 4]]

same = rows                  # second name, one object
shallow = rows.copy()        # new outer list, same inner lists
deep = copy.deepcopy(rows)   # new all the way down

shallow[0].append(99)
print(rows)                  # [[1, 2, 99], [3, 4]]  <- affected
deep[0].append(100)
print(rows)                  # [[1, 2, 99], [3, 4]]  <- not affected`,
        cap: "A copy is one level, like memcpy on a struct full of pointers", lang: "python" },
      { h: "What a C programmer will get wrong" },
      { table: { head: ["The expectation", "The reality"], rows: [
        ["`sys.getsizeof` is `sizeof`", "it reports the object's own size, not what it refers to; a list of a million ints reports the size of its pointer array"],
        ["append grows one slot at a time", "a list over-allocates in blocks, so append is amortised O(1) like a dynamic array — but `insert(0, x)` is O(n)"],
        ["`a is b` compares values", "small ints and short strings are cached, so `5 is 5` is True while `1000 is 1000` may not be"],
        ["building a string is like filling a buffer", "strings are immutable, so `+=` in a loop is O(n²) — collect into a list and `\"\".join()`"],
        ["`a[:]` is free", "slicing copies; for large `bytes` where the copy matters, use `memoryview`"],
        ["`int` has a fixed width", "Python integers do not overflow; they grow until memory does"]
      ]}},
      { p: "Everything that disappears: no stack-versus-heap decision, no ownership to document, no double free and no dangling pointer. What replaces all of it is one question — **who else holds a reference to this object, and is it mutable?**" }
    ],

    tricks: [
      { h: "Symptom → cause" },
      { table: { head: ["Symptom", "Cause"], rows: [
        ["The caller's list changed after a call", "it was passed by reference and mutated; copy at the boundary or return a new list"],
        ["Every instance shares one list", "a mutable default, either `def f(x=[])` or a dataclass field written `= []`"],
        ["`cannot import name X from partially initialized module`", "a circular import; defer one of them into the function that needs it"],
        ["A sibling file will not import", "`import x` is absolute; use `from .x import y`"],
        ["Relative imports break when running a file in a package", "use `python3 -m package.module` instead of running the file directly"],
        ["Memory does not drop after `del`", "something else still references it, or it is in a cycle waiting for the collector"],
        ["Building a string in a loop is very slow", "`+=` on an immutable object is quadratic; use a list and `join`"],
        ["`AttributeError` on something plainly assigned", "assigned on a different instance, or the class has `__slots__`"],
        ["Writing `def` twice loses the first one", "there is no overloading; the second replaces the first"],
        ["A file called `random.py` breaks the program oddly", "it shadows the standard module; rename the file"]
      ]}},
      { h: "A translation table from C" },
      { table: { head: ["C", "Python"], rows: [
        ["`#include \"x.h\"`", "`import x` or `from x import name`"],
        ["`#ifndef` guard", "not needed — `sys.modules` caches"],
        ["`static` function", "a leading underscore, and leaving it out of `__all__`"],
        ["`struct`", "`@dataclass`, `NamedTuple`, `TypedDict` or a `dict`"],
        ["`typedef`", "a type alias, e.g. `Grid = list[list[int]]`"],
        ["`malloc` / `free`", "neither — create the object and let reference counting handle it"],
        ["`sizeof`", "`sys.getsizeof` (a different meaning), or `len` for a count of members"],
        ["`memcpy`", "`.copy()` for one level, `copy.deepcopy` for all of them"],
        ["`NULL`", "`None`"],
        ["`enum`", "`from enum import Enum`"],
        ["`const`", "nothing real — a tuple, `frozen=True`, or an upper-case name as a convention"],
        ["function pointer", "the function itself, because functions are values"],
        ["argv as a char pointer-to-pointer", "`sys.argv`, a list of strings"],
        ["printf with %d", "`print(f\"{n}\")`"],
        ["`exit(1)`", "`sys.exit(1)`"]
      ]}},
      { h: "Habits worth bringing from C" },
      { ul: [
        "Validate input at one boundary and stop re-checking inside — that transfers unchanged",
        "One function, one job, named after what it does",
        "Read the error to the end before changing anything — a Python traceback names the file and line far more directly than a segfault",
        "Measure before optimising — `__slots__`, `memoryview` and avoiding copies belong after the numbers, not before"
      ]}
    ],

    eval: [
      { qa: [
        { q: "Python has no header file, so what does the job?", a: "The module does both jobs. There is no separate declaration step: a module is executed once on the first import and its namespace is cached in `sys.modules`, so later imports get the same object without running it again — which is also why no include guard is needed." },
        { q: "What is `__init__.py` for?", a: "It makes a directory a package, and it is where you decide what the package exposes. The names it re-exports are the public face; anything left out is internal even though the file is right there. Put those names in `__all__` so flake8 and mypy treat them as public." },
        { q: "What replaces a struct?", a: "Four options: a `dict` when the keys really are data, a `TypedDict` when it must stay a dict but you want the keys checked at type-check time, a `NamedTuple` for a small immutable record, and a `@dataclass` when it has behaviour or changes." },
        { q: "Why can a dataclass field not default to `= []`?", a: "Because the default is created once, when the class is defined, rather than per instance — so every instance would share one list. `field(default_factory=list)` calls the factory each time instead." },
        { q: "When does Python free memory?", a: "When the last reference disappears. Reference counting releases it immediately and predictably. Objects that point at each other in a cycle never reach zero, which is why there is also a cycle collector running behind it." },
        { q: "Is `del x` the same as `free(x)`?", a: "No. `del` removes a name from a namespace. The object is released only if that was the last reference to it; if anything else still holds it, it is completely alive." },
        { q: "Does Python pass arguments by value or by reference?", a: "Neither, in C's sense. It passes a copy of the *reference*. A function can therefore mutate the inside of the object it was given and the caller sees it, but rebinding the parameter name changes nothing for the caller — which is why a swap function cannot be written." },
        { q: "Why does the original still change after `.copy()`?", a: "Because it copies one level. The new list holds the same references to the inner objects, so mutating an inner object is visible through both. `copy.deepcopy` is what separates every level." },
        { q: "Can `sys.getsizeof` be used as `sizeof`?", a: "No. It reports the size of that object alone, excluding what it refers to, so a list with a million members reports only its pointer array rather than the data." },
        { q: "Does Python have function overloading?", a: "No. Defining `def` with the same name again replaces the previous one. The replacements are default parameters, star and double-star arguments, or dispatching on type with `functools.singledispatch`." },
        { q: "How do circular imports differ from C?", a: "C has include guards and resolves at link time, so it usually either works or fails up front. Python fails midway through executing one module and reports it as partially initialized. The fixes are to defer one import into a function, merge the two modules, or invert the dependency." }
      ]}
    ]
  }

});
