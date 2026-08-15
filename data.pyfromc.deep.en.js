/* py_from_c round two, English. Mirrors data.pyfromc.deep.js block for block. */
(function () {

  var EN = {
    dataflow: [
      { h: "Memory, measured rather than described" },
      { p: "The numbers below were measured on CPython 3.12, and **the ratios are the point** rather than the exact figures." },
      { table: { head: ["What was measured", "Size"], rows: [
        ["an instance with two attributes, ordinary", "**344 bytes** (48 for the object, about 296 for its `__dict__`)"],
        ["the same with `__slots__`", "**48 bytes**"],
        ["`[n*n for n in range(1_000_000)]`", "**about 39 MiB**"],
        ["the same as a generator", "**400 bytes**"],
        ["`sys.getsizeof([0] * 1_000_000)`", "8,000,056 — the pointer array alone"]
      ]}},
      { code: String.raw`import sys


class WithDict:
    def __init__(self, x, y):
        self.x, self.y = x, y


class WithSlots:
    __slots__ = ("x", "y")

    def __init__(self, x, y):
        self.x, self.y = x, y


a, b = WithDict(1, 2), WithSlots(1, 2)
print(sys.getsizeof(a) + sys.getsizeof(a.__dict__))   # 344
print(sys.getsizeof(b))                               # 48`,
        cap: "Run it yourself, and try changing the number of attributes", lang: "python" },
      { p: "So there are two levers that actually pay: `__slots__` once instances are counted in millions, and **a generator when the sequence is walked once**. Neither is worth reaching for before a measurement." },
      { code: String.raw`import tracemalloc

tracemalloc.start()
data = [n * n for n in range(1_000_000)]
current, peak = tracemalloc.get_traced_memory()
tracemalloc.stop()
print(current // 1024, "KiB")        # ~39500 KiB

tracemalloc.start()
lazy = (n * n for n in range(1_000_000))
current, _ = tracemalloc.get_traced_memory()
tracemalloc.stop()
print(current, "bytes")              # ~400 bytes`,
        cap: "tracemalloc is the tool that answers how much was actually used", lang: "python" },
      { note: "`sys.getsizeof` is not `sizeof`. It reports the size of that object alone, excluding what it points at, so a list of a million ints reports 8 million bytes — its pointer array, not the numbers. To learn what the program is using, use `tracemalloc`." },
      { h: "Cycles — shown to be beyond reference counting" },
      { code: String.raw`import gc
import weakref


class Node:
    def __init__(self) -> None:
        self.peer: "Node | None" = None


first, second = Node(), Node()
first.peer, second.peer = second, first    # pointing at each other: a cycle
watcher = weakref.ref(first)               # watches without keeping it alive

del first, second                          # both names are gone
print(watcher() is not None)               # True   <- still alive!
print(gc.collect())                        # 2      <- the collector took two
print(watcher() is not None)               # False  <- gone now`,
        cap: "Running it prints True, then 2, then False", lang: "python" },
      { p: "A `weakref` is a reference that **does not extend an object's life**. It is the tool for caches and back-pointers, and the way to break a cycle by design rather than leaving it for the collector to find." },
      { table: { head: ["The C situation", "What replaces it in Python"], rows: [
        ["forgetting `free` — a memory leak", "forgetting to drop a reference, e.g. leaving it in a module-level list or cache"],
        ["calling `free` twice — a double free", "does not exist; reference counting handles it"],
        ["using it after `free` — a dangling pointer", "does not exist; while a name points at it, the object is alive"],
        ["structures pointing at each other", "still a leak in time — either wait for the collector or cut it with a `weakref`"],
        ["checking with valgrind", "checking with `tracemalloc` and `gc.get_objects()`"]
      ]}},
      { note: "**Python knows nothing about memory that C allocated.** If a C library mallocs something for you, you must call that library's own free function; the garbage collector will never touch it — which is the subject of the next tab." }
    ],

    architecture: [
      { h: "Joining files means knowing where sys.path came from" },
      { code: String.raw`project/
|-- main.py
|-- geometry.py
'-- shapes/
    |-- __init__.py
    |-- circle.py
    '-- polygon.py`,
        cap: "The layout used throughout this section", lang: "text" },
      { table: { head: ["Run like this", "What lands on `sys.path`", "The consequence"], rows: [
        ["`python3 main.py`", "main.py's directory", "`import geometry` works, and your own `random.py` would shadow the standard module"],
        ["`python3 shapes/circle.py`", "the `shapes/` directory", "**the package is not importable**, and every relative import inside it fails"],
        ["`python3 -m shapes.circle`", "the current directory", "correct — the file runs as a module with the package still importable"],
        ["`pip install -e .`", "the project is registered in the environment", "importable from anywhere, with no `sys.path` editing"]
      ]}},
      { code: String.raw`import sys

print(sys.path[0])       # the directory of the running script
print(sys.path[1:3])     # then PYTHONPATH, then the system locations`,
        cap: "When an import cannot be found, print this before guessing", lang: "python" },
      { note: "Do not edit `sys.path` in code. It works on your machine and breaks on everyone else's, and Module 06 forbids it outright. If you genuinely need to import from elsewhere, make it a package and install it with `pip install -e .`." },
      { h: "Calling a function in another file — all four forms" },
      { code: String.raw`# geometry.py
def area(width: float, height: float) -> float:
    """Return the area of a rectangle."""
    return width * height


PI = 3.14159`,
        cap: "The file being called", lang: "python" },
      { code: String.raw`# main.py
import geometry                        # 1) the whole module
print(geometry.area(3, 4), geometry.PI)

from geometry import area              # 2) just the name you use
print(area(3, 4))

from geometry import area as surface   # 3) renamed in this file
print(surface(3, 4))

from shapes import Circle              # 4) from a package, via __init__.py
print(Circle(2).area())`,
        cap: "Form 1 reads best when several modules have similar names", lang: "python" },
      { code: String.raw`# shapes/__init__.py — the package's public face
from .circle import Circle
from .polygon import Polygon

__all__ = ["Circle", "Polygon"]`,
        cap: "Anything not listed is internal, even though the file sits right there", lang: "python" },
      { code: String.raw`# shapes/circle.py — reaching a sibling needs the leading dot
from .polygon import Polygon        # right — the sibling in this package
import polygon                      # wrong — looks for a top-level polygon`,
        cap: "No dot means absolute, always, since Python 3", lang: "python" },
      { h: "Importable from anywhere — install it rather than patch the path" },
      { code: String.raw`[project]
name = "myproject"
version = "0.1.0"
requires-python = ">=3.10"

[build-system]
requires = ["setuptools>=61"]
build-backend = "setuptools.build_meta"

[tool.setuptools]
packages = ["shapes"]`,
        cap: "pyproject.toml at the project root", lang: "toml" },
      { code: String.raw`python3 -m venv .venv
./.venv/bin/pip install -e .        # -e means edits take effect with no reinstall

cd /tmp && python3 -c "from shapes import Circle; print(Circle(2).area())"`,
        cap: "That last line is the proof it really is a package", lang: "bash" }
    ],

    implementation: [
      { h: "Calling C from Python — four routes, by setup cost" },
      { table: { head: ["Route", "Compile step?", "Use when"], rows: [
        ["**ctypes**", "none — load an existing `.so`", "the library exists and the signatures are simple"],
        ["**CFFI**", "optional", "you want the C declarations parsed rather than transcribed"],
        ["**C extension**", "compile against `Python.h`", "you need speed, or to hand back real Python objects"],
        ["**Cython**", "compile the C it generates", "you want extension speed while writing Python-like code"]
      ]}},
      { h: "ctypes — no build, but you declare the types yourself" },
      { code: String.raw`/* mathlib.c */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int add(int a, int b) { return a + b; }

double average(const double *values, int count)
{
    double total = 0.0;
    int i = 0;
    if (count <= 0)
        return 0.0;
    while (i < count) {
        total += values[i];
        i++;
    }
    return total / count;
}

typedef struct s_point { double x; double y; } t_point;

double distance(t_point a, t_point b)
{
    double dx = a.x - b.x;
    double dy = a.y - b.y;
    return dx * dx + dy * dy;
}

char *greet(const char *name)
{
    char *out = malloc(strlen(name) + 8);
    if (!out)
        return NULL;
    sprintf(out, "Hello %s", name);
    return out;
}

void free_string(char *p) { free(p); }`,
        cap: "Ordinary C, with nothing about Python in it", lang: "c" },
      { code: String.raw`gcc -shared -fPIC -Wall -Wextra -o libmath.so mathlib.c`,
        cap: "One line builds the shared library", lang: "bash" },
      { code: String.raw`import ctypes

lib = ctypes.CDLL("./libmath.so")

# 1) integers — always declare the types before calling
lib.add.argtypes = [ctypes.c_int, ctypes.c_int]
lib.add.restype = ctypes.c_int
print(lib.add(3, 4))                       # 7

# 2) an array of doubles
lib.average.argtypes = [ctypes.POINTER(ctypes.c_double), ctypes.c_int]
lib.average.restype = ctypes.c_double
values = (ctypes.c_double * 4)(1.0, 2.0, 3.0, 4.0)
print(lib.average(values, 4))              # 2.5`,
        cap: "`(ctypes.c_double * 4)(...)` builds a real C array from Python", lang: "python" },
      { note: "The trap everyone hits: with no `restype`, ctypes assumes the function returns `int`. Calling that same `average` without setting it returns `4` instead of `2.5` — no error, no warning, just a wrong number." },
      { code: String.raw`class Point(ctypes.Structure):
    _fields_ = [("x", ctypes.c_double), ("y", ctypes.c_double)]


lib.distance.argtypes = [Point, Point]
lib.distance.restype = ctypes.c_double
print(lib.distance(Point(0.0, 0.0), Point(3.0, 4.0)))   # 25.0`,
        cap: "The Python struct's fields must match the C one exactly, in order", lang: "python" },
      { code: String.raw`# a string the C side malloc'd — whoever allocates, frees
lib.greet.argtypes = [ctypes.c_char_p]
lib.greet.restype = ctypes.POINTER(ctypes.c_char)    # not c_char_p!
lib.free_string.argtypes = [ctypes.POINTER(ctypes.c_char)]

raw = lib.greet(b"Somchai")
text = ctypes.cast(raw, ctypes.c_char_p).value.decode()
print(text)                                # Hello Somchai
lib.free_string(raw)                       # hand it back to its owner`,
        cap: "Strings go in as bytes, which is what the b prefix is for", lang: "python" },
      { p: "Setting `restype` to `c_char_p` makes Python copy the bytes into an object of its own **and drop the pointer**, so there is nothing left to hand to `free`. That is a leak the garbage collector cannot see, because it knows nothing about memory C allocated." },
      { h: "A C extension — real Python objects, and manual reference counts" },
      { code: String.raw`#define PY_SSIZE_T_CLEAN
#include <Python.h>

static PyObject *fastmath_add(PyObject *self, PyObject *args)
{
    long a;
    long b;

    (void)self;
    if (!PyArg_ParseTuple(args, "ll", &a, &b))
        return NULL;                 /* NULL means an exception is set */
    return PyLong_FromLong(a + b);
}

static PyObject *fastmath_sum_list(PyObject *self, PyObject *args)
{
    PyObject *sequence;
    Py_ssize_t index = 0;
    Py_ssize_t length;
    double total = 0.0;

    (void)self;
    if (!PyArg_ParseTuple(args, "O", &sequence))
        return NULL;
    length = PySequence_Size(sequence);
    if (length < 0)
        return NULL;
    while (index < length) {
        PyObject *item = PySequence_GetItem(sequence, index);  /* +1 ref */
        if (!item)
            return NULL;
        total += PyFloat_AsDouble(item);
        Py_DECREF(item);                                       /* -1 ref */
        index++;
    }
    return PyFloat_FromDouble(total);
}

static PyMethodDef FastMathMethods[] = {
    {"add", fastmath_add, METH_VARARGS, "Add two integers."},
    {"sum_list", fastmath_sum_list, METH_VARARGS, "Sum a sequence."},
    {NULL, NULL, 0, NULL}
};

static struct PyModuleDef fastmathmodule = {
    PyModuleDef_HEAD_INIT, "fastmath", "A tiny C extension.", -1,
    FastMathMethods
};

PyMODINIT_FUNC PyInit_fastmath(void)
{
    return PyModule_Create(&fastmathmodule);
}`,
        cap: "fastmath.c — a Python module written entirely in C", lang: "c" },
      { code: String.raw`gcc -shared -fPIC $(python3-config --includes) -o fastmath.so fastmath.c

python3 -c "
import fastmath
print(fastmath.add(3, 4))            # 7
print(fastmath.sum_list([1.5, 2.5, 3.0]))   # 7.0
print(fastmath.add.__doc__)          # Add two integers.
try:
    fastmath.add('a', 1)
except TypeError as e:
    print('TypeError:', e)
"`,
        cap: "PyArg_ParseTuple does the type checking and raises TypeError for you", lang: "bash" },
      { table: { head: ["Rule", "What breaking it does"], rows: [
        ["returning `NULL` means **an exception is set**", "returning NULL without setting one gives a `SystemError` that is hard to trace"],
        ["when there is nothing to return, use `Py_RETURN_NONE`", "returning NULL instead makes Python think an error occurred"],
        ["a function giving you a **new reference** leaves the `Py_DECREF` to you", "forgetting it leaks one object at a time until the machine is full"],
        ["a function giving you a **borrowed reference** must not be decrefed", "decrefing one crashes the interpreter later, somewhere else entirely"],
        ["the GIL is held for the whole call", "release it with `Py_BEGIN_ALLOW_THREADS`, and touch no Python object until you have it back"]
      ]}},
      { note: "**New versus borrowed references is the one thing to memorise.** `PySequence_GetItem` and `PyLong_FromLong` give you a new one, which you must release; `PyList_GetItem` and `PyDict_GetItem` lend you theirs, which you must not. Each function's documentation says which." },
      { h: "Choosing between them" },
      { ul: [
        "The library exists and you only call it → **ctypes**, with `argtypes` and `restype` set on every function",
        "The hot loop is in Python and **profiling says so** → try **Cython** first, and write a C extension only if that is not enough",
        "You need to return a list or a dict, or raise a Python exception → **a C extension**",
        "Never for a speed you have not measured — **crossing the boundary costs**, and a ctypes call is slower than an ordinary Python function call"
      ]},
      { note: "In the 42 context: `ctypes` is in the standard library, not an external one — but every exercise states its Authorized list as an allowlist, so anything absent from it is not allowed, and `ctypes` appears in none of the subjects. Module 06 is the clearest: it permits only the modules and files you create in that project. This material is for work after the curriculum." }
    ]
  };

  window.TEACHING_EN = window.TEACHING_EN || {};
  var page = window.TEACHING_EN.py_from_c;
  if (page) {
    Object.keys(EN).forEach(function (key) {
      page[key] = (page[key] || []).concat(EN[key]);
    });
  }
})();
