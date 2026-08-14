/* py_from_c รอบสอง — หน่วยความจำเชิงปฏิบัติ การเชื่อมไฟล์ และการเรียก C จาก Python
   ทุกตัวเลขและทุกโค้ดในไฟล์นี้รันจริงแล้วบน CPython 3.12 */
(function () {

  var TH = {
    dataflow: [
      { h: "หน่วยความจำแบบวัดจริง ไม่ใช่แบบเล่า" },
      { p: "ตัวเลขข้างล่างวัดบน CPython 3.12 และ **อัตราส่วนคือประเด็น** ไม่ใช่ตัวเลขเป๊ะ ๆ" },
      { table: { head: ["สิ่งที่วัด", "ขนาด"], rows: [
        ["อินสแตนซ์ที่มีสองแอตทริบิวต์ แบบปกติ", "**344 ไบต์** (ตัววัตถุ 48 บวก `__dict__` อีกราว 296)"],
        ["อันเดียวกันแต่ใส่ `__slots__`", "**48 ไบต์**"],
        ["`[n*n for n in range(1_000_000)]`", "**ราว 39 MiB**"],
        ["อันเดียวกันแต่เป็น generator", "**400 ไบต์**"],
        ["`sys.getsizeof([0] * 1_000_000)`", "8,000,056 — นับแค่อาเรย์ของตัวชี้"]
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
        cap: "ตัวเลขนี้รันได้เอง ลองเปลี่ยนจำนวนแอตทริบิวต์ดู", lang: "python" },
      { p: "สรุปคือมีคันโยกที่ได้ผลจริงสองอัน: `__slots__` เมื่ออินสแตนซ์นับเป็นล้าน และ **generator เมื่อลำดับข้อมูลถูกเดินรอบเดียว** ทั้งคู่ไม่ควรหยิบมาใช้ก่อนที่จะวัด" },
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
        cap: "tracemalloc คือเครื่องมือที่ตอบคำถามว่า 'ใช้ไปเท่าไหร่'", lang: "python" },
      { note: "`sys.getsizeof` ไม่ใช่ `sizeof` — มันบอกขนาดของวัตถุนั้นเองโดยไม่รวมสิ่งที่มันชี้ไป ลิสต์ของ int ล้านตัวจึงรายงาน 8 ล้านไบต์ ซึ่งคืออาเรย์ของตัวชี้ ไม่ใช่ตัวเลขทั้งหมด ถ้าอยากรู้ว่าโปรแกรมกินไปเท่าไหร่ให้ใช้ `tracemalloc`" },
      { h: "วงรอบ — วัดให้เห็นว่าการนับอ้างอิงคืนไม่ได้" },
      { code: String.raw`import gc
import weakref


class Node:
    def __init__(self) -> None:
        self.peer: "Node | None" = None


first, second = Node(), Node()
first.peer, second.peer = second, first    # ชี้หากัน = วงรอบ
watcher = weakref.ref(first)               # ดูอยู่ห่าง ๆ ไม่ยืดอายุ

del first, second                          # ลบชื่อทั้งคู่แล้ว
print(watcher() is not None)               # True   <- ยังอยู่!
print(gc.collect())                        # 2      <- ตัวเก็บวงรอบเก็บได้ 2
print(watcher() is not None)               # False  <- ตอนนี้หายแล้ว`,
        cap: "รันแล้วได้ True / 2 / False ตามลำดับ", lang: "python" },
      { p: "`weakref` คือการถือการอ้างอิงที่ **ไม่ยืดอายุ** ของวัตถุ เป็นเครื่องมือสำหรับแคชและตัวชี้ย้อนกลับ และเป็นวิธีตัดวงรอบตั้งแต่ออกแบบ แทนที่จะปล่อยให้ตัวเก็บขยะมาตามเก็บทีหลัง" },
      { table: { head: ["สถานการณ์ใน C", "สิ่งที่มาแทนใน Python"], rows: [
        ["ลืม `free` = memory leak", "ลืมปล่อยการอ้างอิง เช่นค้างไว้ในลิสต์ระดับโมดูลหรือแคช"],
        ["`free` สองครั้ง = double free", "ไม่มี — การนับอ้างอิงจัดการให้"],
        ["ใช้ต่อหลัง `free` = dangling pointer", "ไม่มี — ตราบใดที่ยังมีชื่อชี้อยู่ วัตถุยังอยู่"],
        ["โครงสร้างชี้วนกัน", "ยังรั่วได้ในแง่เวลา — รอตัวเก็บวงรอบ หรือใช้ `weakref` ตัดเอง"],
        ["ตรวจด้วย valgrind", "ตรวจด้วย `tracemalloc` และ `gc.get_objects()`"]
      ]}},
      { note: "**หน่วยความจำที่ C จองไว้ Python ไม่รู้จัก** ถ้าเรียกไลบรารี C ที่ `malloc` ให้ ต้องเรียกฟังก์ชันคืนของไลบรารีนั้นเอง ตัวเก็บขยะของ Python จะไม่แตะมันเลย — รายละเอียดอยู่ในแท็บถัดไป" }
    ],

    architecture: [
      { h: "เชื่อมไฟล์กันจริง ๆ ต้องรู้ว่า sys.path มาจากไหน" },
      { code: String.raw`project/
|-- main.py
|-- geometry.py
'-- shapes/
    |-- __init__.py
    |-- circle.py
    '-- polygon.py`,
        cap: "โครงตัวอย่างที่ใช้อธิบายทั้งหัวข้อนี้", lang: "text" },
      { table: { head: ["สั่งแบบนี้", "อะไรถูกใส่ใน `sys.path`", "ผลที่ตามมา"], rows: [
        ["`python3 main.py`", "ไดเรกทอรีของ `main.py`", "`import geometry` ทำงาน · ไฟล์ชื่อ `random.py` ของเราจะบังโมดูลมาตรฐาน"],
        ["`python3 shapes/circle.py`", "ไดเรกทอรี `shapes/`", "**package ไม่ถูก import** relative import ทุกตัวในนั้นพัง"],
        ["`python3 -m shapes.circle`", "ไดเรกทอรีปัจจุบัน", "ถูกต้อง — รันไฟล์ในฐานะโมดูล โดย package ยัง import ได้"],
        ["`pip install -e .`", "โปรเจกต์ถูกลงทะเบียนในสภาพแวดล้อม", "import ได้จากทุกที่ ไม่ต้องแตะ `sys.path`"]
      ]}},
      { code: String.raw`import sys

print(sys.path[0])       # ไดเรกทอรีของสคริปต์ที่กำลังรัน
print(sys.path[1:3])     # ต่อไปคือ PYTHONPATH แล้วค่อยเป็นของระบบ`,
        cap: "อยากรู้ว่าทำไม import ไม่เจอ ให้พิมพ์ดูก่อนเดา", lang: "python" },
      { note: "อย่าแก้ `sys.path` ในโค้ด มันทำงานบนเครื่องเราแล้วพังบนเครื่องคนอื่น และโจทย์ Module 06 ห้ามไว้ตรง ๆ ถ้าต้อง import จากที่อื่นจริง ให้ทำเป็น package แล้วติดตั้งด้วย `pip install -e .`" },
      { h: "เรียกฟังก์ชันข้ามไฟล์ — ทั้งสี่แบบ" },
      { code: String.raw`# geometry.py
def area(width: float, height: float) -> float:
    """คืนพื้นที่สี่เหลี่ยม"""
    return width * height


PI = 3.14159`,
        cap: "ไฟล์ที่ถูกเรียก", lang: "python" },
      { code: String.raw`# main.py
import geometry                        # 1) ทั้งโมดูล
print(geometry.area(3, 4), geometry.PI)

from geometry import area              # 2) เฉพาะชื่อที่ใช้
print(area(3, 4))

from geometry import area as surface   # 3) เปลี่ยนชื่อในไฟล์นี้
print(surface(3, 4))

from shapes import Circle              # 4) จาก package ผ่าน __init__.py
print(Circle(2).area())`,
        cap: "แบบที่ 1 อ่านง่ายที่สุดเมื่อมีหลายโมดูลชื่อคล้ายกัน", lang: "python" },
      { code: String.raw`# shapes/__init__.py — หน้าตาสาธารณะของ package
from .circle import Circle
from .polygon import Polygon

__all__ = ["Circle", "Polygon"]`,
        cap: "อะไรที่ไม่อยู่ในนี้ถือเป็นภายใน แม้ไฟล์จะวางอยู่ตรงนั้น", lang: "python" },
      { code: String.raw`# shapes/circle.py — เรียกไฟล์ข้าง ๆ ต้องมีจุดนำหน้า
from .polygon import Polygon        # ถูก — ไฟล์ข้าง ๆ ใน package เดียวกัน
import polygon                      # ผิด — หา polygon ระดับบนสุด`,
        cap: "ไม่มีจุด = absolute เสมอ ตั้งแต่ Python 3", lang: "python" },
      { h: "ทำให้ import ได้จากทุกที่ — ติดตั้งแทนการแก้พาธ" },
      { code: String.raw`[project]
name = "myproject"
version = "0.1.0"
requires-python = ">=3.10"

[build-system]
requires = ["setuptools>=61"]
build-backend = "setuptools.build_meta"

[tool.setuptools]
packages = ["shapes"]`,
        cap: "pyproject.toml ที่รากโปรเจกต์", lang: "toml" },
      { code: String.raw`python3 -m venv .venv
./.venv/bin/pip install -e .        # -e คือแก้ไฟล์แล้วมีผลทันที ไม่ต้องติดตั้งซ้ำ

cd /tmp && python3 -c "from shapes import Circle; print(Circle(2).area())"`,
        cap: "บรรทัดสุดท้ายคือหลักฐานว่ามันเป็น package จริง", lang: "bash" }
    ],

    implementation: [
      { h: "เรียก C จาก Python — สี่ทาง เรียงตามต้นทุนการติดตั้ง" },
      { table: { head: ["ทาง", "ต้องคอมไพล์ไหม", "ใช้เมื่อ"], rows: [
        ["**ctypes**", "ไม่ต้อง โหลด `.so` ที่มีอยู่แล้ว", "ไลบรารีมีอยู่แล้วและลายเซ็นไม่ซับซ้อน"],
        ["**CFFI**", "จะคอมไพล์หรือไม่ก็ได้", "อยากให้เครื่องอ่านคำประกาศ C แทนที่จะถอดความเอง"],
        ["**C extension**", "คอมไพล์กับ `Python.h`", "ต้องการความเร็ว หรือคืนวัตถุ Python จริง ๆ"],
        ["**Cython**", "คอมไพล์ C ที่มันสร้างให้", "อยากได้ความเร็วระดับ extension แต่เขียนคล้าย Python"]
      ]}},
      { h: "ctypes — ไม่ต้อง build แต่ต้องประกาศชนิดเอง" },
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
        cap: "ฝั่ง C ธรรมดา ไม่มีอะไรเกี่ยวกับ Python เลย", lang: "c" },
      { code: String.raw`gcc -shared -fPIC -Wall -Wextra -o libmath.so mathlib.c`,
        cap: "สร้าง shared library หนึ่งบรรทัด", lang: "bash" },
      { code: String.raw`import ctypes

lib = ctypes.CDLL("./libmath.so")

# 1) จำนวนเต็ม — ประกาศชนิดก่อนใช้เสมอ
lib.add.argtypes = [ctypes.c_int, ctypes.c_int]
lib.add.restype = ctypes.c_int
print(lib.add(3, 4))                       # 7

# 2) อาเรย์ของ double
lib.average.argtypes = [ctypes.POINTER(ctypes.c_double), ctypes.c_int]
lib.average.restype = ctypes.c_double
values = (ctypes.c_double * 4)(1.0, 2.0, 3.0, 4.0)
print(lib.average(values, 4))              # 2.5`,
        cap: "`(ctypes.c_double * 4)(...)` คืออาเรย์ของ C ที่สร้างจากฝั่ง Python", lang: "python" },
      { note: "กับดักที่ทุกคนโดน: ถ้าไม่ตั้ง `restype` ctypes จะเดาว่าฟังก์ชันคืน `int` เรียก `average` ตัวเดิมโดยไม่ตั้ง จะได้ `4` แทน `2.5` — ไม่ error ไม่เตือน แค่ตัวเลขผิด" },
      { code: String.raw`class Point(ctypes.Structure):
    _fields_ = [("x", ctypes.c_double), ("y", ctypes.c_double)]


lib.distance.argtypes = [Point, Point]
lib.distance.restype = ctypes.c_double
print(lib.distance(Point(0.0, 0.0), Point(3.0, 4.0)))   # 25.0`,
        cap: "struct ฝั่ง Python ต้องเรียงฟิลด์ให้ตรงกับฝั่ง C เป๊ะ", lang: "python" },
      { code: String.raw`# สตริงที่ C จองด้วย malloc — ใครจอง คนนั้นคืน
lib.greet.argtypes = [ctypes.c_char_p]
lib.greet.restype = ctypes.POINTER(ctypes.c_char)    # ไม่ใช่ c_char_p!
lib.free_string.argtypes = [ctypes.POINTER(ctypes.c_char)]

raw = lib.greet(b"Somchai")
text = ctypes.cast(raw, ctypes.c_char_p).value.decode()
print(text)                                # Hello Somchai
lib.free_string(raw)                       # คืนให้ไลบรารีที่จองมา`,
        cap: "ผ่านสตริงเข้าไปต้องเป็น bytes จึงมี b นำหน้า", lang: "python" },
      { p: "ถ้าตั้ง `restype` เป็น `c_char_p` Python จะคัดลอกไบต์ออกมาเป็นวัตถุของตัวเอง **แล้วทิ้งตัวชี้** ทำให้ไม่มีอะไรจะส่งกลับไปให้ `free` อีกเลย — นั่นคือ memory leak ที่ตัวเก็บขยะของ Python มองไม่เห็น เพราะมันไม่รู้จักหน่วยความจำที่ C จองไว้" },
      { h: "C extension — คืนวัตถุ Python จริง และนับการอ้างอิงเอง" },
      { code: String.raw`#define PY_SSIZE_T_CLEAN
#include <Python.h>

static PyObject *fastmath_add(PyObject *self, PyObject *args)
{
    long a;
    long b;

    (void)self;
    if (!PyArg_ParseTuple(args, "ll", &a, &b))
        return NULL;                 /* NULL = มี exception ตั้งไว้แล้ว */
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
        cap: "fastmath.c — โมดูล Python ที่เขียนด้วย C ทั้งตัว", lang: "c" },
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
        cap: "PyArg_ParseTuple ตรวจชนิดและโยน TypeError ให้เอง", lang: "bash" },
      { table: { head: ["กฎ", "ทำผิดแล้วเกิดอะไร"], rows: [
        ["คืน `NULL` แปลว่า **มี exception ตั้งไว้แล้ว**", "คืน NULL โดยไม่ตั้ง exception = `SystemError` ที่หาต้นตอยาก"],
        ["ไม่มีอะไรจะคืน ให้ใช้ `Py_RETURN_NONE`", "คืน NULL แทน = Python คิดว่าเกิด error"],
        ["ฟังก์ชันที่ให้ **การอ้างอิงใหม่** ต้อง `Py_DECREF` เอง", "ลืม = รั่วทีละวัตถุจนหมดเครื่อง"],
        ["ฟังก์ชันที่ให้ **การอ้างอิงยืม** ห้าม `Py_DECREF`", "เผลอลด = ตัวแปลภาษาพังทีหลังที่อื่นโดยสิ้นเชิง"],
        ["GIL ถูกถือไว้ตลอดที่ฟังก์ชันทำงาน", "ปล่อยด้วย `Py_BEGIN_ALLOW_THREADS` แล้วห้ามแตะวัตถุ Python จนกว่าจะเอาคืน"]
      ]}},
      { note: "**การอ้างอิงใหม่กับการอ้างอิงยืมคือเรื่องเดียวที่ต้องจำให้แม่น** — `PySequence_GetItem` และ `PyLong_FromLong` ให้ของใหม่ (ต้องคืน) ส่วน `PyList_GetItem` และ `PyDict_GetItem` ให้ยืม (ห้ามคืน) เอกสารของแต่ละฟังก์ชันระบุไว้ตรง ๆ" },
      { h: "เลือกทางไหน" },
      { ul: [
        "ไลบรารีมีอยู่แล้วและแค่ต้องเรียกใช้ → **ctypes** และตั้ง `argtypes` กับ `restype` ให้ครบทุกฟังก์ชัน",
        "ลูปร้อนอยู่ในฝั่ง Python และ **โปรไฟล์บอกแล้วว่าใช่** → ลอง **Cython** ก่อน แล้วค่อยเขียน C extension ถ้ายังไม่พอ",
        "ต้องคืน list หรือ dict หรือต้องโยน exception ของ Python → **C extension**",
        "อย่าทำเพราะคิดว่าเร็วกว่าโดยไม่ได้วัด — **การข้ามฝั่งมีต้นทุน** และการเรียกผ่าน ctypes ช้ากว่าการเรียกฟังก์ชัน Python ธรรมดาเสียอีก"
      ]},
      { note: "ในบริบทของ 42: โปรเจกต์ Python ในหลักสูตร **ห้ามใช้ไลบรารีภายนอก** และไม่มีข้อไหนขอให้เชื่อมกับ C หัวข้อนี้จึงเป็นความรู้สำหรับงานจริงหลังจบ ไม่ใช่สิ่งที่จะเอาไปใส่ในโจทย์" }
    ]
  };

  window.TEACHING_DATA = window.TEACHING_DATA || [];
  window.TEACHING_DATA.forEach(function (page) {
    if (page.id !== "py_from_c") return;
    Object.keys(TH).forEach(function (key) {
      page.sections[key] = (page.sections[key] || []).concat(TH[key]);
    });
  });
})();
