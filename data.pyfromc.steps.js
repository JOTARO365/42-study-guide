/* ขั้นตอนเชื่อม C กับ Python ด้วย libft — ทุกคำสั่งและทุกข้อความ error
   รันจริงในไดเรกทอรีเปล่าตามลำดับนี้ */
(function () {

  var TH = [
    { h: "ทำตามทีละขั้น — จากศูนย์ถึงเรียก libft ได้จริง" },
    { p: "แปดขั้น แต่ละขั้นมีคำสั่ง สิ่งที่ต้องเห็น และสิ่งที่มักพลาด ทำตามในไดเรกทอรีเปล่าได้เลย ไม่ต้องแก้ libft แม้แต่บรรทัดเดียว" },
    { table: { head: ["ขั้น", "ทำอะไร", "รู้ได้ยังไงว่าผ่าน"], rows: [
      ["1", "เตรียมโฟลเดอร์", "มี `lib/` ว่างอยู่"],
      ["2", "build `libft.so`", "ไฟล์ `.so` มีขนาดไม่เป็นศูนย์"],
      ["3", "ตรวจสัญลักษณ์", "`nm -D` เห็น `ft_strlen`"],
      ["4", "เรียกครั้งแรกสามบรรทัด", "พิมพ์ `10` ออกมา"],
      ["5", "ประกาศชนิด", "ผลเท่าเดิม แต่ตอนนี้ถูกต้องแน่นอน"],
      ["6", "ห่อฟังก์ชันที่ malloc", "`itoa` คืนข้อความ ไม่ใช่ตัวเลขประหลาด"],
      ["7", "ทำเป็นโมดูล", "`import libft_py` จากไฟล์อื่นได้"],
      ["8", "Makefile และเทสต์", "`make test` ผ่าน และหน่วยความจำไม่เพิ่ม"]
    ]}},

    { h: "ขั้น 1 — เตรียมโฟลเดอร์" },
    { code: String.raw`mkdir -p ~/libft_demo/lib
cd ~/libft_demo`,
      cap: "แยก .so ไว้ใน lib/ เพื่อไม่ให้ปนกับไฟล์ Python", lang: "bash" },
    { p: "**ไม่ต้องคัดลอกซอร์สของ libft มา** ชี้ไปที่โฟลเดอร์เดิมได้เลย ถ้าแก้ libft ทีหลังก็แค่ build ใหม่" },

    { h: "ขั้น 2 — build libft ให้เป็น shared library" },
    { code: String.raw`gcc -shared -fPIC -Wall -Wextra \
    -o lib/libft.so ~/42/push_swap/libft/*.c

ls -la lib/libft.so
# -rwxr-xr-x 1 user user 32432 ... lib/libft.so`,
      cap: "ผลจริง: ไฟล์ขนาดราว 32 KB", lang: "bash" },
    { table: { head: ["ธง", "ทำไมต้องมี"], rows: [
      ["`-shared`", "สร้าง shared object แทน executable"],
      ["`-fPIC`", "โค้ดต้องย้ายตำแหน่งได้ตอนถูกโหลด — บางระบบ build ไม่ผ่านเลยถ้าไม่มี"],
      ["`-Wall -Wextra`", "ไม่จำเป็นต่อการทำงาน แต่ libft ควรผ่านอยู่แล้ว"]
    ]}},
    { note: "`libft.a` ใช้กับ ctypes ไม่ได้ มันเป็น static archive คนละรูปแบบกัน ลองโหลดดูจะได้ `OSError: /path/libft.a: invalid ELF header` — ต้อง build `.so` ใหม่เท่านั้น" },

    { h: "ขั้น 3 — ตรวจว่าสัญลักษณ์ออกมาจริง" },
    { code: String.raw`nm -D --defined-only lib/libft.so | grep " T ft_" | wc -l
# 52

nm -D --defined-only lib/libft.so | grep ft_strlen
# 0000000000003ba9 T ft_strlen`,
      cap: "T แปลว่าอยู่ใน text section และถูกเปิดเผยออกมา", lang: "bash" },
    { p: "ถ้าฟังก์ชันที่ต้องการไม่โผล่ ให้ตรวจว่าไฟล์ `.c` ตัวนั้นถูกใส่ในคำสั่ง build หรือเปล่า และฟังก์ชันไม่ได้ประกาศเป็น `static`" },

    { h: "ขั้น 4 — เรียกครั้งแรก สามบรรทัด" },
    { code: String.raw`# first.py
import ctypes

lib = ctypes.CDLL("./lib/libft.so")
print(lib.ft_strlen(b"Hello, 42!"))`,
      cap: "first.py", lang: "python" },
    { code: String.raw`$ python3 first.py
10`,
      cap: "ได้ 10 แปลว่าเชื่อมต่อสำเร็จแล้ว", lang: "bash" },
    { table: { head: ["เจอ error นี้", "แปลว่า"], rows: [
      ["`OSError: ./lib/libft.so: cannot open shared object file`", "พาธผิด หรือยังไม่ได้ build — ctypes ไม่ค้นหาในไดเรกทอรีปัจจุบันให้เอง ต้องใส่ `./`"],
      ["`OSError: ... invalid ELF header`", "กำลังโหลด `.a` อยู่ ให้กลับไปขั้น 2"],
      ["`AttributeError: ... undefined symbol: ft_nosuch`", "พิมพ์ชื่อฟังก์ชันผิด หรือไฟล์นั้นไม่ได้ถูก build เข้ามา"],
      ["`ctypes.ArgumentError: argument 1: TypeError: wrong type`", "ส่ง `str` ไปให้ C — ต้องเป็น `bytes` จึงต้องมี `b` นำหน้า"]
    ]}},

    { h: "ขั้น 5 — ประกาศชนิด ก่อนที่ตัวเลขจะหลอก" },
    { code: String.raw`import ctypes

lib = ctypes.CDLL("./lib/libft.so")

lib.ft_strlen.argtypes = [ctypes.c_char_p]
lib.ft_strlen.restype = ctypes.c_size_t

print(lib.ft_strlen(b"Hello, 42!"))     # 10`,
      cap: "ผลเท่าเดิม แต่คราวนี้ถูกต้องตามนิยามจริงของฟังก์ชัน", lang: "python" },
    { code: String.raw`# ไม่ตั้ง restype กับฟังก์ชันที่คืนตัวชี้ = ตัวชี้ถูกตัดเหลือ int
lib.ft_itoa.argtypes = [ctypes.c_int]
print(lib.ft_itoa(12345))          # 761088512   <- ขยะ

lib.ft_itoa.restype = ctypes.POINTER(ctypes.c_char)
raw = lib.ft_itoa(12345)
print(ctypes.cast(raw, ctypes.c_char_p).value)    # b'12345'`,
      cap: "ตัวเลขบรรทัดที่สองคือตัวชี้ 64 บิตที่เหลือแค่ 32 บิตล่าง", lang: "python" },
    { note: "**อันตรายกว่านั้นคือกรณีที่มันดูเหมือนทำงานได้** `ft_strlen` คืน `size_t` แต่ถ้าไม่ตั้ง `restype` ctypes อ่านเป็น `int` แล้วยังได้ `300` ถูกต้องอยู่ เพราะค่าเล็กพอดี — มันจะผิดวันที่ค่าโตเกิน `int` เท่านั้น ซึ่งคือวันที่หาสาเหตุยากที่สุด **ตั้งให้ครบทุกฟังก์ชันตั้งแต่แรก**" },

    { h: "ขั้น 6 — ห่อฟังก์ชันที่ malloc" },
    { p: "ฟังก์ชัน libft ที่คืนตัวชี้ล้วนจองหน่วยความจำมาให้ และ **ตัวเก็บขยะของ Python ไม่รู้จักมันเลย** ต้องคัดลอกค่าออกมาแล้วคืนเองทุกครั้ง" },
    { code: String.raw`import ctypes
import ctypes.util

_libc = ctypes.CDLL(ctypes.util.find_library("c"))
_libc.free.argtypes = [ctypes.c_void_p]
_libc.free.restype = None


def _take(pointer) -> str:
    """คัดลอกสตริงที่ C จองไว้ แล้วคืนหน่วยความจำทันที"""
    if not pointer:
        raise MemoryError("libft returned NULL")
    text = ctypes.cast(pointer, ctypes.c_char_p).value or b""
    _libc.free(ctypes.cast(pointer, ctypes.c_void_p))
    return text.decode("utf-8", errors="replace")`,
      cap: "ฟังก์ชันเดียวนี้ใช้ได้กับทุกฟังก์ชันที่คืน char *", lang: "python" },
    { table: { head: ["ฟังก์ชัน libft", "จองหน่วยความจำไหม", "ต้องห่อไหม"], rows: [
      ["`ft_strlen`, `ft_atoi`, `ft_toupper`, `ft_isalpha`", "ไม่", "ไม่ต้อง เรียกตรงได้"],
      ["`ft_strdup`, `ft_substr`, `ft_strjoin`, `ft_strtrim`", "ใช่ คืน `char *`", "ห่อด้วย `_take`"],
      ["`ft_itoa`, `ft_strmapi`", "ใช่ คืน `char *`", "ห่อด้วย `_take`"],
      ["`ft_split`", "ใช่ คืน array ของ char pointer", "ห่อสองชั้น"],
      ["`ft_calloc`", "ใช่ คืน `void *`", "ห่อ และ free เองตามชนิดที่ใช้"]
    ]}},
    { code: String.raw`def split(text: str, separator: str) -> list[str]:
    """ft_split คืน array ที่ปิดท้ายด้วย NULL — ต้อง free สองชั้น"""
    array = _lib.ft_split(text.encode(), separator.encode())
    if not array:
        raise MemoryError("ft_split returned NULL")
    parts: list[str] = []
    index = 0
    while array[index]:
        parts.append(_take(array[index]))                 # ชั้นใน
        index += 1
    _libc.free(ctypes.cast(array, ctypes.c_void_p))       # แล้วชั้นนอก
    return parts`,
      cap: "คืนจากในออกนอกเสมอ — สลับลำดับแล้วจะอ่านหน่วยความจำที่คืนไปแล้ว", lang: "python" },

    { h: "ขั้น 7 — ทำให้เป็นโมดูลที่ import ได้" },
    { code: String.raw`libft_demo/
|-- lib/
|   '-- libft.so
|-- libft_py.py        # ตัวห่อทั้งหมดอยู่ในนี้
|-- demo.py            # โปรแกรมที่ใช้งานจริง
|-- test_libft.py      # เทสต์
'-- Makefile`,
      cap: "โครงที่แยกตัวห่อออกจากผู้ใช้ ทำให้เปลี่ยนวิธีเชื่อมทีหลังได้", lang: "text" },
    { code: String.raw`# libft_py.py — หาไฟล์ .so จากตำแหน่งของตัวเอง ไม่ใช่จาก cwd
import os

_HERE = os.path.dirname(os.path.abspath(__file__))
_lib = ctypes.CDLL(os.path.join(_HERE, "lib", "libft.so"))`,
      cap: "ใช้ __file__ ไม่งั้นรันจากโฟลเดอร์อื่นแล้วหา .so ไม่เจอ", lang: "python" },
    { code: String.raw`# demo.py — ผู้ใช้ไม่ต้องรู้จัก ctypes เลย
import libft_py as ft

line = "  42,Bangkok,Thailand  "
for field in ft.split(ft.strtrim(line, " "), ","):
    print(ft.toupper(field[0]) + field[1:])`,
      cap: "$ python3 demo.py → 42 / Bangkok / Thailand", lang: "python" },
    { note: "**ประโยชน์ของการห่อคือตรงนี้** — วันที่ตัดสินใจเปลี่ยนจาก ctypes ไปเป็น C extension เพื่อความเร็ว `demo.py` ไม่ต้องแก้แม้แต่บรรทัดเดียว" },

    { h: "ขั้น 8 — Makefile กับเทสต์" },
    { code: String.raw`LIBFT_SRC = $(HOME)/42/push_swap/libft
CC        = gcc
CFLAGS    = -Wall -Wextra -fPIC

all: lib/libft.so

lib/libft.so: $(LIBFT_SRC)/*.c
	mkdir -p lib
	$(CC) -shared $(CFLAGS) -o $@ $(LIBFT_SRC)/*.c

run: all
	python3 demo.py

test: all
	python3 test_libft.py

clean:
	rm -rf lib __pycache__

.PHONY: all run test clean`,
      cap: "Makefile — .so ถูก build ใหม่อัตโนมัติเมื่อซอร์ส libft เปลี่ยน", lang: "makefile" },
    { code: String.raw`# test_libft.py — เทียบกับของ Python เอง แล้วตรวจว่าไม่รั่ว
import resource

import libft_py as ft

assert ft.strlen("Hello, 42!") == len("Hello, 42!")
assert ft.atoi("  -42abc") == -42
assert ft.itoa(-2147483648) == "-2147483648"
assert ft.strjoin("a", "b") == "ab"
assert ft.substr("Hello", 1, 3) == "ell"
assert ft.split("one,two,,three", ",") == ["one", "two", "three"]

before = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
for _ in range(200_000):
    ft.split("one,two,three,four", ",")
    ft.itoa(12345)
after = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
assert after - before < 1024, f"leaked {after - before} KiB"

print("all libft bindings behave and leak nothing")`,
      cap: "ผลจริง: 21088 KiB ก่อน และ 21088 KiB หลัง — เพิ่ม 0", lang: "python" },
    { p: "เทสต์เรื่องหน่วยความจำสำคัญกว่าเทสต์เรื่องค่าที่คืน เพราะค่าที่ผิดจะเห็นทันทีตอนรัน แต่หน่วยความจำที่รั่วจะเห็นตอนโปรแกรมทำงานยาว ๆ เท่านั้น — ซึ่งคือตอนที่แก้ยากที่สุด" },
    { note: "**เช็กลิสต์ก่อนบอกว่าเสร็จ**: ตั้ง `argtypes` และ `restype` ครบทุกฟังก์ชัน · ทุกฟังก์ชันที่คืนตัวชี้ถูกห่อ · `ft_split` คืนหน่วยความจำสองชั้น · หาไฟล์ `.so` จาก `__file__` · เทสต์วนสองแสนรอบแล้วหน่วยความจำไม่เพิ่ม" }
  ];

  var EN = [
    { h: "Step by step — from nothing to calling libft" },
    { p: "Eight steps, each with the command, what you must see, and what usually goes wrong. Follow it in an empty directory; libft itself is never edited." },
    { table: { head: ["Step", "What it does", "How you know it worked"], rows: [
      ["1", "prepare the folder", "an empty `lib/` exists"],
      ["2", "build `libft.so`", "a non-zero-sized `.so`"],
      ["3", "check the symbols", "`nm -D` shows `ft_strlen`"],
      ["4", "the first three-line call", "it prints `10`"],
      ["5", "declare the types", "the same result, now correct by construction"],
      ["6", "wrap the mallocing functions", "`itoa` returns text rather than a strange number"],
      ["7", "make it a module", "`import libft_py` works from another file"],
      ["8", "a Makefile and tests", "`make test` passes and memory does not grow"]
    ]}},

    { h: "Step 1 — prepare the folder" },
    { code: String.raw`mkdir -p ~/libft_demo/lib
cd ~/libft_demo`,
      cap: "Keeping the .so in lib/ stops it mixing with the Python files", lang: "bash" },
    { p: "**Do not copy libft's sources across.** Point at the existing folder; when libft changes later, you only rebuild." },

    { h: "Step 2 — build libft as a shared library" },
    { code: String.raw`gcc -shared -fPIC -Wall -Wextra \
    -o lib/libft.so ~/42/push_swap/libft/*.c

ls -la lib/libft.so
# -rwxr-xr-x 1 user user 32432 ... lib/libft.so`,
      cap: "Real output: a file of about 32 KB", lang: "bash" },
    { table: { head: ["Flag", "Why it is there"], rows: [
      ["`-shared`", "produce a shared object rather than an executable"],
      ["`-fPIC`", "the code must be relocatable when loaded; on many toolchains the build fails without it"],
      ["`-Wall -Wextra`", "not required to work, but libft should pass them anyway"]
    ]}},
    { note: "`libft.a` cannot be used with ctypes. It is a static archive, a different format entirely; loading it gives `OSError: /path/libft.a: invalid ELF header`. A `.so` has to be built." },

    { h: "Step 3 — check the symbols really came out" },
    { code: String.raw`nm -D --defined-only lib/libft.so | grep " T ft_" | wc -l
# 52

nm -D --defined-only lib/libft.so | grep ft_strlen
# 0000000000003ba9 T ft_strlen`,
      cap: "T means it is in the text section and exported", lang: "bash" },
    { p: "If a function you want is missing, check that its `.c` file was included in the build command and that the function is not declared `static`." },

    { h: "Step 4 — the first call, in three lines" },
    { code: String.raw`# first.py
import ctypes

lib = ctypes.CDLL("./lib/libft.so")
print(lib.ft_strlen(b"Hello, 42!"))`,
      cap: "first.py", lang: "python" },
    { code: String.raw`$ python3 first.py
10`,
      cap: "A 10 means the two sides are talking", lang: "bash" },
    { table: { head: ["This error", "Means"], rows: [
      ["`OSError: ./lib/libft.so: cannot open shared object file`", "wrong path, or not built yet — ctypes does not search the current directory for you, hence the `./`"],
      ["`OSError: ... invalid ELF header`", "you are loading the `.a`; go back to step 2"],
      ["`AttributeError: ... undefined symbol: ft_nosuch`", "the name is misspelled, or that file was not built in"],
      ["`ctypes.ArgumentError: argument 1: TypeError: wrong type`", "a `str` was passed to C — it must be `bytes`, hence the `b` prefix"]
    ]}},

    { h: "Step 5 — declare the types before a number lies to you" },
    { code: String.raw`import ctypes

lib = ctypes.CDLL("./lib/libft.so")

lib.ft_strlen.argtypes = [ctypes.c_char_p]
lib.ft_strlen.restype = ctypes.c_size_t

print(lib.ft_strlen(b"Hello, 42!"))     # 10`,
      cap: "The same result, now correct according to the real signature", lang: "python" },
    { code: String.raw`# no restype on a function returning a pointer = the pointer is truncated to int
lib.ft_itoa.argtypes = [ctypes.c_int]
print(lib.ft_itoa(12345))          # 761088512   <- garbage

lib.ft_itoa.restype = ctypes.POINTER(ctypes.c_char)
raw = lib.ft_itoa(12345)
print(ctypes.cast(raw, ctypes.c_char_p).value)    # b'12345'`,
      cap: "That number is a 64-bit pointer with only its low 32 bits left", lang: "python" },
    { note: "**The more dangerous case is the one that appears to work.** `ft_strlen` returns `size_t`, but with no `restype` ctypes reads an `int` and still gives `300`, because the value is small enough. It only breaks once a value exceeds `int` — which is the hardest day to debug. **Declare every function up front.**" },

    { h: "Step 6 — wrap the functions that malloc" },
    { p: "Every libft function returning a pointer allocated it, and **Python's garbage collector knows nothing about that memory**. Copy the value out and free it yourself, every time." },
    { code: String.raw`import ctypes
import ctypes.util

_libc = ctypes.CDLL(ctypes.util.find_library("c"))
_libc.free.argtypes = [ctypes.c_void_p]
_libc.free.restype = None


def _take(pointer) -> str:
    """Copy out a string C allocated, then free it immediately."""
    if not pointer:
        raise MemoryError("libft returned NULL")
    text = ctypes.cast(pointer, ctypes.c_char_p).value or b""
    _libc.free(ctypes.cast(pointer, ctypes.c_void_p))
    return text.decode("utf-8", errors="replace")`,
      cap: "This one function serves every libft call returning a char *", lang: "python" },
    { table: { head: ["libft function", "Allocates?", "Needs wrapping?"], rows: [
      ["`ft_strlen`, `ft_atoi`, `ft_toupper`, `ft_isalpha`", "no", "no — call it directly"],
      ["`ft_strdup`, `ft_substr`, `ft_strjoin`, `ft_strtrim`", "yes, returns `char *`", "wrap with `_take`"],
      ["`ft_itoa`, `ft_strmapi`", "yes, returns `char *`", "wrap with `_take`"],
      ["`ft_split`", "yes, returns an array of char pointers", "wrap at two levels"],
      ["`ft_calloc`", "yes, returns `void *`", "wrap, and free according to how you used it"]
    ]}},
    { code: String.raw`def split(text: str, separator: str) -> list[str]:
    """ft_split returns a NULL-terminated array — two levels to free."""
    array = _lib.ft_split(text.encode(), separator.encode())
    if not array:
        raise MemoryError("ft_split returned NULL")
    parts: list[str] = []
    index = 0
    while array[index]:
        parts.append(_take(array[index]))                 # inner first
        index += 1
    _libc.free(ctypes.cast(array, ctypes.c_void_p))       # then the outer
    return parts`,
      cap: "Always innermost first — the other order reads memory you already freed", lang: "python" },

    { h: "Step 7 — turn it into an importable module" },
    { code: String.raw`libft_demo/
|-- lib/
|   '-- libft.so
|-- libft_py.py        # all the wrapping lives here
|-- demo.py            # the program that uses it
|-- test_libft.py      # the tests
'-- Makefile`,
      cap: "Separating the wrapper from its users is what lets the binding change later", lang: "text" },
    { code: String.raw`# libft_py.py — find the .so relative to this file, not to the cwd
import os

_HERE = os.path.dirname(os.path.abspath(__file__))
_lib = ctypes.CDLL(os.path.join(_HERE, "lib", "libft.so"))`,
      cap: "Use __file__, or running from another directory cannot find the .so", lang: "python" },
    { code: String.raw`# demo.py — the caller never sees ctypes
import libft_py as ft

line = "  42,Bangkok,Thailand  "
for field in ft.split(ft.strtrim(line, " "), ","):
    print(ft.toupper(field[0]) + field[1:])`,
      cap: "$ python3 demo.py → 42 / Bangkok / Thailand", lang: "python" },
    { note: "**This is what the wrapper buys you.** The day you swap ctypes for a C extension to gain speed, `demo.py` does not change by a single line." },

    { h: "Step 8 — a Makefile and tests" },
    { code: String.raw`LIBFT_SRC = $(HOME)/42/push_swap/libft
CC        = gcc
CFLAGS    = -Wall -Wextra -fPIC

all: lib/libft.so

lib/libft.so: $(LIBFT_SRC)/*.c
	mkdir -p lib
	$(CC) -shared $(CFLAGS) -o $@ $(LIBFT_SRC)/*.c

run: all
	python3 demo.py

test: all
	python3 test_libft.py

clean:
	rm -rf lib __pycache__

.PHONY: all run test clean`,
      cap: "The .so rebuilds automatically whenever libft's sources change", lang: "makefile" },
    { code: String.raw`# test_libft.py — compare against Python's own, then check for leaks
import resource

import libft_py as ft

assert ft.strlen("Hello, 42!") == len("Hello, 42!")
assert ft.atoi("  -42abc") == -42
assert ft.itoa(-2147483648) == "-2147483648"
assert ft.strjoin("a", "b") == "ab"
assert ft.substr("Hello", 1, 3) == "ell"
assert ft.split("one,two,,three", ",") == ["one", "two", "three"]

before = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
for _ in range(200_000):
    ft.split("one,two,three,four", ",")
    ft.itoa(12345)
after = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
assert after - before < 1024, f"leaked {after - before} KiB"

print("all libft bindings behave and leak nothing")`,
      cap: "Real result: 21088 KiB before and 21088 KiB after — zero growth", lang: "python" },
    { p: "The memory test matters more than the value tests: a wrong value shows up on the first run, while leaked memory only shows up on a long one — which is the hardest time to diagnose it." },
    { note: "**The checklist before calling it done**: `argtypes` and `restype` on every function · every pointer-returning function wrapped · `ft_split` freed at both levels · the `.so` located through `__file__` · two hundred thousand iterations with no memory growth." }
  ];

  window.TEACHING_DATA = window.TEACHING_DATA || [];
  window.TEACHING_DATA.forEach(function (page) {
    if (page.id !== "py_from_c") return;
    page.sections.implementation =
      (page.sections.implementation || []).concat(TH);
  });

  window.TEACHING_EN = window.TEACHING_EN || {};
  if (window.TEACHING_EN.py_from_c) {
    var en = window.TEACHING_EN.py_from_c;
    en.implementation = (en.implementation || []).concat(EN);
  }
})();
