/* กรณีศึกษา: เรียก libft ของตัวเองจาก Python
   โค้ดและตัวเลขทุกตัวมาจากการ build libft จริงจาก push_swap/libft แล้วรันวัด */
(function () {

  var TH = [
    { h: "กรณีศึกษา: เอา libft ของตัวเองมาใช้ในโปรแกรม Python" },
    { p: "libft เป็นตัวอย่างที่ดีเพราะมันคือโค้ด C ที่เขียนเอง ผ่าน norminette และผ่าน valgrind มาแล้ว — สถานการณ์เดียวกับ 'มีไลบรารี C ที่เชื่อถือได้อยู่แล้ว อยากเรียกจาก Python' ซึ่งเป็นเหตุผลอันดับหนึ่งของการเชื่อมสองภาษา" },
    { code: String.raw`# libft ปกติถูก build เป็น libft.a ซึ่งเป็น static library
# ctypes ต้องการ shared library จึง build ใหม่ด้วย -shared -fPIC
cd push_swap/libft
gcc -shared -fPIC -Wall -Wextra -o libft.so *.c

# ตรวจว่าสัญลักษณ์ออกมาจริง
nm -D --defined-only libft.so | grep ft_split
# 0000000000003809 T ft_split`,
      cap: "-fPIC จำเป็นเพราะโค้ดต้องย้ายตำแหน่งได้ตอนถูกโหลด", lang: "bash" },
    { code: String.raw`import ctypes
import ctypes.util
import os

_HERE = os.path.dirname(os.path.abspath(__file__))
_lib = ctypes.CDLL(os.path.join(_HERE, "libft.so"))

# libc ของระบบ — ใช้ free() หน่วยความจำที่ libft จองไว้
_libc = ctypes.CDLL(ctypes.util.find_library("c"))
_libc.free.argtypes = [ctypes.c_void_p]
_libc.free.restype = None

_CHAR_P = ctypes.POINTER(ctypes.c_char)

# ประกาศชนิดให้ครบทุกฟังก์ชัน — ห้ามข้ามแม้แต่ตัวเดียว
_lib.ft_strlen.argtypes = [ctypes.c_char_p]
_lib.ft_strlen.restype = ctypes.c_size_t

_lib.ft_atoi.argtypes = [ctypes.c_char_p]
_lib.ft_atoi.restype = ctypes.c_int

_lib.ft_itoa.argtypes = [ctypes.c_int]
_lib.ft_itoa.restype = _CHAR_P          # คืนตัวชี้ที่ malloc มา

_lib.ft_split.argtypes = [ctypes.c_char_p, ctypes.c_char]
_lib.ft_split.restype = ctypes.POINTER(_CHAR_P)`,
      cap: "libft_py.py — ส่วนประกาศ", lang: "python" },
    { code: String.raw`def _take(pointer) -> str:
    """คัดลอกสตริงที่ C จองไว้ แล้วคืนหน่วยความจำนั้นทันที

    Raises:
        MemoryError: libft คืน NULL ซึ่งแปลว่า malloc ล้มเหลว
    """
    if not pointer:
        raise MemoryError("libft returned NULL")
    text = ctypes.cast(pointer, ctypes.c_char_p).value or b""
    _libc.free(ctypes.cast(pointer, ctypes.c_void_p))
    return text.decode("utf-8", errors="replace")


def itoa(number: int) -> str:
    """แปลงจำนวนเต็มเป็นข้อความด้วย ft_itoa"""
    return _take(_lib.ft_itoa(number))`,
      cap: "หัวใจของทั้งโมดูล: คัดลอกออกมา แล้ว free ทันทีในบรรทัดเดียวกัน", lang: "python" },
    { note: "**ทุกฟังก์ชันของ libft ที่คืนตัวชี้ต้องถูกห่อ** — `ft_itoa`, `ft_strdup`, `ft_strjoin`, `ft_strtrim`, `ft_substr`, `ft_split`, `ft_strmapi` ล้วน `malloc` ให้ทั้งนั้น ส่วนที่คืนค่าธรรมดาอย่าง `ft_strlen`, `ft_atoi`, `ft_toupper` เรียกตรงได้เลย" },
    { code: String.raw`def split(text: str, separator: str) -> list[str]:
    """ตัดข้อความด้วย ft_split

    ft_split คืน array ของตัวชี้ที่ปิดท้ายด้วย NULL และจองมาทั้งหมด
    จึงต้อง free ทีละช่อง แล้วค่อย free ตัว array เอง
    """
    array = _lib.ft_split(text.encode(), separator.encode())
    if not array:
        raise MemoryError("ft_split returned NULL")
    parts: list[str] = []
    index = 0
    while array[index]:                # เดินจนเจอ NULL
        parts.append(_take(array[index]))     # คัดลอก + free ช่องนั้น
        index += 1
    _libc.free(ctypes.cast(array, ctypes.c_void_p))   # แล้วค่อย free ตัว array
    return parts`,
      cap: "สองระดับของการจอง ต้องคืนสองระดับ ตามลำดับจากในออกนอก", lang: "python" },
    { code: String.raw`import libft_py as ft

print(ft.strlen("Hello, 42!"))            # 10
print(ft.atoi("  -42abc"))                # -42
print(ft.toupper("q"))                    # Q
print(ft.itoa(-2147483648))               # -2147483648
print(ft.strjoin("42", " Bangkok"))       # 42 Bangkok
print(ft.strtrim("xxhelloxx", "x"))       # hello
print(ft.substr("Hello, 42!", 7, 2))      # 42
print(ft.split("one,two,,three", ","))    # ['one', 'two', 'three']`,
      cap: "ผลลัพธ์จริงจากการรัน — ตรงกับที่ Python ทำเองทุกตัว", lang: "python" },
    { h: "แล้วมันคุ้มไหม — วัดจริง" },
    { table: { head: ["งาน", "ผ่าน libft", "ของ Python เอง", "ช้ากว่า"], rows: [
      ["`strlen` สตริง 180 ตัวอักษร", "0.87 ไมโครวินาที", "0.040", "**22 เท่า**"],
      ["`atoi`", "0.32", "0.075", "**4 เท่า**"],
      ["`split` สตริง 50 ช่อง", "124.76", "0.735", "**170 เท่า**"]
    ]}},
    { p: "libft ไม่ได้ช้า — โค้ด C นั้นเร็วกว่าอยู่แล้ว สิ่งที่ช้าคือ **การข้ามฝั่ง**: แปลง `str` เป็น `bytes`, เรียกผ่าน ctypes, คัดลอกผลกลับ, แล้ว `free` ทีละชิ้น สำหรับ `ft_split` ที่ต้องคัดลอกและคืนหน่วยความจำห้าสิบครั้งต่อการเรียกหนึ่งครั้ง ต้นทุนนี้กลบข้อดีของ C จนหมด" },
    { code: String.raw`# แบบถูก — ห่อด้วย _take() ที่ free ทุกครั้ง
for _ in range(200_000):
    ft.split("one,two,three,four", ",")
    ft.itoa(12345)
# peak RSS: 21088 KiB -> 21088 KiB   (เพิ่ม 0 KiB)


# แบบผิด — ตั้ง restype เป็น c_char_p ให้ ctypes คัดลอกให้เอง
lib.ft_strjoin.restype = ctypes.c_char_p     # <- ตัวชี้หายไปตรงนี้
for _ in range(300_000):
    lib.ft_strjoin(b"x" * 200, b"y" * 200)
# peak RSS: 10864 KiB -> 132564 KiB  (เพิ่ม 121 MB)`,
      cap: "ตัวเลขทั้งสองชุดวัดด้วย resource.getrusage บนเครื่องเดียวกัน", lang: "python" },
    { note: "**121 เมกะไบต์ที่หายไปนั้นไม่มีอะไรตามเก็บได้เลย** — `c_char_p` ทำให้ Python คัดลอกไบต์ออกมาแล้วทิ้งตัวชี้ จึงไม่เหลืออะไรจะส่งให้ `free` และตัวเก็บขยะของ Python ก็ไม่รู้จักหน่วยความจำก้อนนั้นตั้งแต่แรก นี่คือ memory leak ที่ valgrind ฝั่ง C มองไม่เห็นด้วย เพราะโปรแกรมที่รันคือ Python" },
    { h: "เมื่อไหร่ถึงควรเชื่อม C เข้ากับ Python จริง ๆ" },
    { table: { head: ["ควรทำ เมื่อ", "ไม่ควรทำ เมื่อ"], rows: [
      ["มีไลบรารี C ที่ใช้งานได้อยู่แล้วและไม่อยากเขียนใหม่", "แค่คิดว่า C เร็วกว่า โดยยังไม่ได้วัด"],
      ["ต้องคุยกับฮาร์ดแวร์หรือ system call ที่ Python ไม่มีให้", "งานนั้นมีของใน standard library อยู่แล้ว"],
      ["งานหนักอยู่ **ข้างใน** C ทั้งก้อน เรียกครั้งเดียวจบ", "ต้องเรียกข้ามฝั่งในลูปที่วนเป็นล้านครั้ง"],
      ["ต้องใช้อัลกอริทึมเฉพาะทางที่มีแต่ในโค้ด C ของทีม", "แค่อยากใช้ฟังก์ชันที่ Python มีเทียบเท่าอยู่แล้ว"],
      ["ต้องการผลลัพธ์ที่ตรงกับฝั่ง C เป๊ะ ๆ เพื่อเทียบพฤติกรรม", "โปรเจกต์นั้นห้ามใช้ไลบรารีภายนอก"]
    ]}},
    { p: "แถวที่สามคือหลักที่ใช้ตัดสินได้เร็วที่สุด: **ให้ข้ามฝั่งน้อยครั้งแต่ทำงานเยอะต่อครั้ง** ถ้าอยากใช้ libft ประมวลผลไฟล์หนึ่งล้านบรรทัดจริง ๆ ให้เขียนฟังก์ชัน C ตัวเดียวที่รับทั้งไฟล์แล้วคืนผลสรุป ไม่ใช่เรียก `ft_split` ทีละบรรทัดจาก Python" },
    { note: "ในบริบทของ 42: `ctypes` เป็น **standard library** จึงไม่โดนข้อห้ามเรื่องไลบรารีภายนอก แต่โจทย์ใช้ **allowlist ต่อข้อ** และ `ctypes` ไม่อยู่ในรายการของข้อไหนเลย ที่สำคัญกว่านั้นคือ **การให้ C ทำงานแทนคือการเลี่ยงสิ่งที่ข้อนั้นวัด** — เขียน `ft_split` ใน C แล้วเรียกจาก Python เพื่อทำ Module 03 ย่อมไม่ผ่าน เพราะข้อนั้นวัดโครงสร้างข้อมูลของ Python ตัวอย่างนี้จึงเป็นการต่อยอดหลังจบ และตอบสัมภาษณ์ได้ดีเพราะแสดงว่าเข้าใจการจัดการหน่วยความจำทั้งสองฝั่ง" }
  ];

  var EN = [
    { h: "A case study: using your own libft from a Python program" },
    { p: "libft makes a good example because it is C you wrote yourself, that already passed norminette and valgrind — the same situation as \"there is a trusted C library and I want to call it from Python\", which is the single most common reason to join the two languages." },
    { code: String.raw`# libft normally builds to libft.a, a static library
# ctypes needs a shared one, so rebuild with -shared -fPIC
cd push_swap/libft
gcc -shared -fPIC -Wall -Wextra -o libft.so *.c

# check the symbols really came out
nm -D --defined-only libft.so | grep ft_split
# 0000000000003809 T ft_split`,
      cap: "-fPIC is needed because the code must be relocatable when loaded", lang: "bash" },
    { code: String.raw`import ctypes
import ctypes.util
import os

_HERE = os.path.dirname(os.path.abspath(__file__))
_lib = ctypes.CDLL(os.path.join(_HERE, "libft.so"))

# the system libc — used to free() what libft allocated
_libc = ctypes.CDLL(ctypes.util.find_library("c"))
_libc.free.argtypes = [ctypes.c_void_p]
_libc.free.restype = None

_CHAR_P = ctypes.POINTER(ctypes.c_char)

# declare the types for every function — never skip one
_lib.ft_strlen.argtypes = [ctypes.c_char_p]
_lib.ft_strlen.restype = ctypes.c_size_t

_lib.ft_atoi.argtypes = [ctypes.c_char_p]
_lib.ft_atoi.restype = ctypes.c_int

_lib.ft_itoa.argtypes = [ctypes.c_int]
_lib.ft_itoa.restype = _CHAR_P          # returns a malloc'd pointer

_lib.ft_split.argtypes = [ctypes.c_char_p, ctypes.c_char]
_lib.ft_split.restype = ctypes.POINTER(_CHAR_P)`,
      cap: "libft_py.py — the declarations", lang: "python" },
    { code: String.raw`def _take(pointer) -> str:
    """Copy out a string C allocated, then free it immediately.

    Raises:
        MemoryError: libft returned NULL, meaning malloc failed.
    """
    if not pointer:
        raise MemoryError("libft returned NULL")
    text = ctypes.cast(pointer, ctypes.c_char_p).value or b""
    _libc.free(ctypes.cast(pointer, ctypes.c_void_p))
    return text.decode("utf-8", errors="replace")


def itoa(number: int) -> str:
    """Turn an integer into text with ft_itoa."""
    return _take(_lib.ft_itoa(number))`,
      cap: "The heart of the module: copy out, then free, in the same breath", lang: "python" },
    { note: "**Every libft function that returns a pointer has to be wrapped** — `ft_itoa`, `ft_strdup`, `ft_strjoin`, `ft_strtrim`, `ft_substr`, `ft_split` and `ft_strmapi` all malloc. The ones returning a plain value, like `ft_strlen`, `ft_atoi` and `ft_toupper`, can be called directly." },
    { code: String.raw`def split(text: str, separator: str) -> list[str]:
    """Split a string with ft_split.

    ft_split returns a NULL-terminated array of pointers, all of them
    allocated, so each slot must be freed and then the array itself.
    """
    array = _lib.ft_split(text.encode(), separator.encode())
    if not array:
        raise MemoryError("ft_split returned NULL")
    parts: list[str] = []
    index = 0
    while array[index]:                # walk until the NULL
        parts.append(_take(array[index]))     # copy out and free that slot
        index += 1
    _libc.free(ctypes.cast(array, ctypes.c_void_p))   # then free the array
    return parts`,
      cap: "Two levels of allocation means two levels of freeing, innermost first", lang: "python" },
    { code: String.raw`import libft_py as ft

print(ft.strlen("Hello, 42!"))            # 10
print(ft.atoi("  -42abc"))                # -42
print(ft.toupper("q"))                    # Q
print(ft.itoa(-2147483648))               # -2147483648
print(ft.strjoin("42", " Bangkok"))       # 42 Bangkok
print(ft.strtrim("xxhelloxx", "x"))       # hello
print(ft.substr("Hello, 42!", 7, 2))      # 42
print(ft.split("one,two,,three", ","))    # ['one', 'two', 'three']`,
      cap: "Real output from running it — every result matches Python's own", lang: "python" },
    { h: "Is it worth it? Measured" },
    { table: { head: ["Task", "Through libft", "Python's own", "Slower by"], rows: [
      ["`strlen` on a 180-character string", "0.87 microseconds", "0.040", "**22x**"],
      ["`atoi`", "0.32", "0.075", "**4x**"],
      ["`split` on a 50-field string", "124.76", "0.735", "**170x**"]
    ]}},
    { p: "libft is not slow — the C is faster than Python. What is slow is **the crossing**: encoding `str` to `bytes`, dispatching through ctypes, copying the result back, and freeing each piece. For `ft_split`, which copies and frees fifty times per call, that overhead swamps everything C gained." },
    { code: String.raw`# the right way — wrapped in _take(), which frees every time
for _ in range(200_000):
    ft.split("one,two,three,four", ",")
    ft.itoa(12345)
# peak RSS: 21088 KiB -> 21088 KiB   (0 KiB added)


# the wrong way — restype of c_char_p, letting ctypes copy for you
lib.ft_strjoin.restype = ctypes.c_char_p     # <- the pointer is lost here
for _ in range(300_000):
    lib.ft_strjoin(b"x" * 200, b"y" * 200)
# peak RSS: 10864 KiB -> 132564 KiB  (121 MB added)`,
      cap: "Both figures measured with resource.getrusage on the same machine", lang: "python" },
    { note: "**Nothing can ever reclaim those 121 megabytes.** `c_char_p` makes Python copy the bytes out and drop the pointer, so there is nothing left to hand to `free`, and the garbage collector never knew about that memory in the first place. It is also a leak valgrind on the C side will not show you, because the program being run is Python." },
    { h: "When joining C to Python is actually the right call" },
    { table: { head: ["Do it when", "Do not when"], rows: [
      ["a working C library already exists and rewriting it is wasteful", "you only assume C is faster and have not measured"],
      ["you need hardware or a system call Python does not expose", "the standard library already does that job"],
      ["the heavy work stays **inside** C and one call does all of it", "you would be crossing the boundary inside a million-iteration loop"],
      ["the algorithm exists only in your team's C code", "you just want a function Python already has an equivalent for"],
      ["you need results identical to the C side, to compare behaviour", "the project forbids external libraries"]
    ]}},
    { p: "The third row is the fastest rule to decide by: **cross rarely, do a lot per crossing**. If you genuinely want libft to process a million-line file, write one C function that takes the whole file and returns the summary — rather than calling `ft_split` once per line from Python." },
    { note: "In the 42 context: `ctypes` is in the standard library, so the external-library ban does not reach it — but the subjects use a per-exercise allowlist, and `ctypes` is on none of them. More to the point, **letting C do the work sidesteps what the exercise measures**: writing `ft_split` in C and calling it for Module 03 cannot pass, because that exercise is about Python's own data structures. This is for after the curriculum, and it answers an interview question well, because it shows you understand both sides' memory management." }
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
