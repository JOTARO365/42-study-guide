/* 42 Python series (r02) — Module 00–10 + A-Maze-ing
   สามหน้าเรียงตามธีม: py_series (00–04), py_patterns (05–07), py_toolkit (08–10)
   และ amaze (A-Maze-ing) */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

window.TEACHING_DATA.push({
  id: "py_series",
  name: "Python Modules 00–04",
  tag: {
    th: "กฎกลางที่ทุกโมดูลในซีรีส์ใช้ร่วมกัน — flake8 79 คอลัมน์, mypy, exN/ ไฟล์ละหนึ่งงาน — แล้วไล่เนื้อโมดูล 00 ถึง 04: syntax, คลาส, exception, collection, ไฟล์และสตรีม",
    en: "The rulebook every module in the series repeats — flake8 at 79 columns, mypy, one job per file under exN/ — then modules 00 to 04: syntax, classes, exceptions, collections, files and streams"
  },
  accent: "#3b82f6",
  sections: {
    principle: [
      { h: "ซีรีส์นี้คืออะไร" },
      { p: "Python Module 00 ถึง 10 คือ **โจทย์เดียวกันสิบเอ็ดหน้า** — General Instructions ถูกคัดลอกซ้ำแทบทุกตัวอักษร เปลี่ยนแค่ธีมกับเนื้อหา อ่านกฎให้ขาดครั้งเดียว แล้วที่เหลือคือเรื่องของแต่ละโมดูล" },
      { p: "ผลที่ตามมาสำคัญกว่าที่คิด: **สิ่งที่ทำให้ตกไม่ใช่ตรรกะ** โค้ดที่ตอบถูกแต่ flake8 ไม่ผ่าน หรือ traceback หลุดต่อหน้าผู้ตรวจ ถือว่า non-functional เท่ากับไม่ได้ทำ" },
      { h: "กฎกลางทั้งหมด" },
      { table: { head: ["กฎ", "รายละเอียดที่คนพลาดบ่อย"], rows: [
        ["Python 3.10 ขึ้นไป", "ใช้ `int | None` ได้เลย ไม่ต้อง `Optional` — แต่ f-string หลายบรรทัดต้อง 3.12"],
        ["flake8 สะอาด", "ไม่มีไฟล์ config มาให้ = ใช้ค่า default = **79 คอลัมน์** ไม่ใช่ 88"],
        ["type hints ครบ + mypy", "ตั้งแต่โมดูล 01 เป็นต้นไป บังคับทุกฟังก์ชันและทุกเมธอด"],
        ["หนึ่งงาน หนึ่งไฟล์ ใน `exN/`", "ชื่อไฟล์ต้องตรงเป๊ะ และห้ามมีอะไรเกินจากที่โจทย์ขอ"],
        ["`PascalCase` / `snake_case`", "คลาสเป็นแบบแรก ฟังก์ชันและตัวแปรเป็นแบบหลัง"],
        ["ห้าม traceback", "ทุก error path ต้องถูกจับและพิมพ์ข้อความ ไม่ใช่ปล่อยให้ระเบิด"]
      ]}},
      { note: "`--disallow-untyped-defs` คือแฟล็กที่เจ็บถ้าปล่อยไว้ท้ายสุด — ใส่ type ตอนเขียนคือนิสัยชั่วโมงเดียว ไล่ใส่ทีหลังคืองานทั้งวัน" },
      { h: "เส้นทางของทั้งซีรีส์" },
      { table: { head: ["โมดูล", "ธีม", "เนื้อจริง"], rows: [
        ["**00** Growing Code", "พื้นฐาน", "8 ข้อ: print, input, เลขคณิต, เงื่อนไข, ลูปกับคู่แฝดแบบ recursive, ฟังก์ชันที่มี type"],
        ["**01** Code Cultivation", "OOP", "7 ข้อ: `__main__`, คลาส, เมธอด, constructor, encapsulation, inheritance, static/class method + nested class"],
        ["**02** Garden Guardian", "exception", "การจับ error ให้แคบที่สุด, custom exception, `finally`"],
        ["**03** Data Quest", "collection", "list, dict, set, tuple, comprehension, generator"],
        ["**04** Data Archivist", "ไฟล์", "เปิด-ปิดเอง ก่อน แล้วค่อยรู้จัก `with`"],
        ["**05** Code Nexus", "polymorphism", "abstract class, override, Protocol"],
        ["**06** The Codex", "import", "package, `__init__.py`, absolute vs relative, circular import"],
        ["**07** DataDeck", "design pattern", "abstract factory, capability, strategy"],
        ["**08** The Matrix", "environment", "venv, pip vs Poetry, `.env`"],
        ["**09** Cosmic Data", "Pydantic", "model, validator, nested model"],
        ["**10** FuncMage", "functional", "lambda, higher-order, closure, functools, decorator"]
      ]}},
      { p: "หน้านี้ครอบคลุมกฎกลางกับโมดูล **00–04** ส่วน 05–07 อยู่ที่หน้า **Python Patterns** และ 08–10 อยู่ที่ **Python Toolkit**" }
    ],

    theory: [
      { h: "โมดูล 00 — syntax และเส้นแบ่งที่คะแนนอยู่ตรงนั้น" },
      { p: "แปดข้อ `ex0/` ถึง `ex7/` ข้อละหนึ่งฟังก์ชัน type hint เป็นตัวเลือกสำหรับข้อ 0–6 และ **บังคับสำหรับข้อ 7**" },
      { p: "การเปรียบเทียบในโจทย์เป็นแบบเข้ม และ**ขอบเขตคือที่ที่คะแนนอยู่**:" },
      { table: { head: ["ข้อ", "กติกา", "ขอบที่พลาดกัน"], rows: [
        ["`ft_plant_age`", "พร้อมเมื่อ**มากกว่า** 60 วัน", "60 พอดี = ยังไม่พร้อม"],
        ["`ft_water_reminder`", "รดน้ำเมื่อ**มากกว่า** 2 วัน", "2 พอดี = ยังไม่ต้องรด"]
      ]}},
      { p: "`ft_count_harvest` ต้องมีทั้งเวอร์ชันวนลูปและ recursive ที่พิมพ์ผลลัพธ์ **เหมือนกันทุกตัวอักษร** โจทย์อนุญาต helper อย่างชัดเจน ดังนั้น `_count_from(day, last)` ส่วนตัวเป็นทางที่สะอาดกว่าการใส่ default argument เพราะฟังก์ชันสาธารณะยังมีลายเซ็นเดียวกับคู่แฝดของมัน" },
      { p: "`ft_seed_inventory(seed_type, quantity, unit)` รองรับ `\"packets\"`, `\"grams\"`, `\"area\"` — อย่างอื่นพิมพ์ **แค่** `Unknown unit type` ไม่มีอย่างอื่นตามมา ชื่อถูกทำเป็นตัวใหญ่ด้วย `str.capitalize()` ซึ่งขึ้นต้นใหญ่และที่เหลือเล็ก: `\"TOMATO\"` เป็น `\"Tomato\"` และ `\"sweet corn\"` เป็น `\"Sweet corn\"` ไม่ใช่ `\"Sweet Corn\"`" },
      { h: "โมดูล 01 — OOP และการชนกันของชื่อที่จะกัดแน่นอน" },
      { p: "เจ็ดข้อ แต่ละข้อเป็นไฟล์เดี่ยวที่แบกทั้งคลาสไว้เอง มันต่อยอดกันเชิงแนวคิด ไม่ใช่ด้วยการ import" },
      { note: "**กับดักชื่อชน** โจทย์ตั้งชื่อเมธอดว่า `grow()` และ `age()` ถ้าตัวนับวันเป็น attribute สาธารณะชื่อ `age` ด้วย เมธอดกับ attribute จะทับกันและ mypy ฟ้อง `Cannot assign to a method` — ตั้งชื่อ attribute เป็น `days_old` ระหว่างที่มันยังสาธารณะ หรือย้ายไป `_age` ตอน encapsulation มาถึงในข้อ 4 อย่างใดอย่างหนึ่ง แต่ต้องเลือก" },
      { p: "**ข้อ 4 ขอ convention แบบ protected ไม่ใช่ mangling** — ขีดล่างหนึ่งตัว (`_height`) ห้ามสองตัว สองตัวจะ mangle ชื่อ ซึ่งทำให้ข้อ 5 ที่สืบทอดทุกอย่างเจ็บปวดเปล่า ๆ Python ไม่มี private จริง ขีดล่างคือข้อความถึงโปรแกรมเมอร์คนอื่น ซึ่งตรงกับที่โจทย์อยากเห็น" },
      { p: "ข้อ 5: เรียก `super()` ใน `show()` ไม่ใช่แค่ `__init__` — ซับคลาสพิมพ์บรรทัดร่วมด้วยการเรียก `show()` ของแม่ แล้วค่อยเติมของตัวเอง การก็อป `print` ของแม่มาไว้ในลูกคือสิ่งที่ถูกหักคะแนน" },
      { h: "ข้อ 6 รวมสามแนวคิดไว้ในไฟล์เดียว" },
      { ul: [
        "**nested class** สำหรับสถิติ — การซ้อนพูดว่า 'สิ่งนี้ไม่มีความหมายนอก Plant' ด้วยโค้ดแทนคอมเมนต์",
        "`@staticmethod` สำหรับ 'จำนวนวันนี้เกินหนึ่งปีไหม' — มันมองแค่ตัวเลขที่ได้รับ ไม่ได้มองต้นไม้ต้นไหน การผูกกับอินสแตนซ์จะบรรยายผิด",
        "`@classmethod` สำหรับสร้างต้นไม้นิรนาม — มันรับ `cls` ซึ่งคือทั้งหมดของเรื่อง: `Flower.anonymous()` ต้องคืน `Flower` ไม่ใช่ `Plant` เปล่า ๆ"
      ]},
      { note: "**ทริคที่ควรเก็บไว้** ถ้า `Plant.__init__` สร้างสถิติด้วย `self.Stats()` แทน `Plant.Stats()` แล้ว `Tree` ที่นิยาม `Stats` ของตัวเองจะได้ตัวนับที่ถูกต้องอัตโนมัติ เพราะการค้นหา attribute วิ่งผ่านคลาสของอินสแตนซ์ ไม่ต้องมี registry ไม่ต้องมีโซ่ `isinstance`" }
    ],

    architecture: [
      { h: "โครงที่ใช้ได้กับทุกโมดูล" },
      { code: String.raw`Python Module 0X/
|-- ex0/
|   '-- ft_something.py        # ชื่อตรงตามโจทย์เป๊ะ
|-- ex1/
|   '-- ft_other.py
|-- tests/
|   '-- run_tests.py           # ของเราเอง ไม่ได้ส่ง แต่เป็นสิ่งที่กันตก
|-- .venv/                     # ห้ามขึ้น git
|-- .gitignore
'-- setup.cfg                  # ให้ flake8 ไม่ไปไล่ .venv`,
        cap: "โครงไดเรกทอรีมาตรฐาน", lang: "text" },
      { p: "`setup.cfg` สองบรรทัดนี้ประหยัดเวลาไปได้มาก — ถ้าไม่มี flake8 จะเข้าไปตรวจ `.venv` แล้วรายงาน error เป็นร้อยจากไลบรารีคนอื่น" },
      { code: String.raw`[flake8]
exclude = .venv,__pycache__,build,dist`,
        cap: "setup.cfg", lang: "ini" },
      { h: "ติดตั้งเครื่องมือครั้งเดียว" },
      { code: String.raw`python3 -m venv .venv
./.venv/bin/pip install flake8 mypy

./.venv/bin/flake8 ex0 ex1 ex2
./.venv/bin/mypy ex0 ex1 ex2 --strict`,
        cap: "สองคำสั่งนี้ต้องผ่านก่อนคิดว่าเสร็จ", lang: "bash" },
      { p: "โมดูลหลัง ๆ ขอ **Makefile** ที่มี `install`, `run`, `debug` (รันใต้ `pdb`), `clean`, `lint` และบางทีมี `lint-strict` ด้วย พร้อม `.gitignore` สำหรับ artefact ของ Python" },
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
        cap: "Makefile โครงมาตรฐานของซีรีส์", lang: "makefile" },
      { note: "บรรทัดคำสั่งใน Makefile ต้องขึ้นต้นด้วย **tab จริง** ไม่ใช่ space — ไม่งั้นได้ `missing separator`" }
    ],

    dataflow: [
      { h: "โมดูล 02 — exception" },
      { p: "ห้าข้อ และรูปแบบที่ทั้งโมดูลสอนคือ: **จับ exception ที่แคบที่สุดเท่าที่เกิดขึ้นได้จริง** แล้วปล่อยที่เหลือผ่านไป การเขียน `except Exception` คลุมทุกอย่างคือการกลืนบั๊กของตัวเองทิ้ง" },
      { ul: [
        "ข้อ 2 ให้ **จงใจสร้าง** error สามแบบ — `TypeError` ที่ตั้งใจจะโดน mypy ฟ้อง ให้ปิดเฉพาะบรรทัดนั้นด้วย `# type: ignore[operator]` ห้ามใช้ `# type: ignore` เปล่า ๆ",
        "custom exception คือคลาสที่สืบทอด `Exception` แล้วส่งข้อมูลเพิ่มเข้า `super().__init__` เพื่อให้ `str(error)` ยังใช้ได้",
        "`finally` ทำงานตอนออกจากบล็อก **ไม่ว่าจะเกิดอะไร** — return, raise, หรือจบปกติ นั่นคือเหตุผลที่ cleanup ต้องอยู่ตรงนั้น ไม่ใช่ต่อท้าย try"
      ]},
      { note: "`int(\"٢٥\")` เท่ากับ 25 — `int()` ของ Python รับตัวเลข Unicode ทุกชุด ไม่ใช่แค่ ASCII เทสต์ที่ยืนยันว่ามันต้อง raise คือเทสต์ที่ทดสอบความเชื่อ ไม่ใช่ทดสอบโค้ด" },
      { h: "โมดูล 03 — collection" },
      { p: "เจ็ดข้อไล่ list, dict, set, tuple, comprehension, generator จุดที่ตัดสินคะแนน:" },
      { table: { head: ["โครงสร้าง", "คุณสมบัติที่ต้องใช้เป็น"], rows: [
        ["dict", "เก็บลำดับที่ใส่มาตั้งแต่ 3.7 — นี่คือสิ่งที่ทำให้ 'ตัวแรกที่ให้มาชนะ' ทำได้โดยไม่ต้องเก็บลำดับแยก"],
        ["`max()` / `min()`", "เก็บตัวแรกของค่าที่เท่ากัน — ใช้คู่กับ dict ที่เรียงตามลำดับใส่ ได้ผลลัพธ์ที่ทำนายได้"],
        ["set", "ไม่มีลำดับ — อะไรที่พิมพ์ออกมาจาก set ต้อง `sorted()` ก่อน ไม่งั้นผลลัพธ์ไม่ซ้ำเดิม"],
        ["generator", "ใช้ได้ครั้งเดียว — วนรอบสองจะได้ความว่างเปล่าอย่างเงียบ ๆ นี่คือบั๊กเงียบที่พบบ่อยที่สุดของโมดูล"]
      ]}},
      { h: "โมดูล 04 — ไฟล์และสตรีม" },
      { p: "สี่ข้อ กับกฎลำดับที่แข็งมาก: ห้ามใช้ `with` จนกว่าจะถึงข้อ 3 สามข้อแรกต้องเปิด ใช้ และปิดเอง โดยให้ `close()` อยู่ใน `finally` เพื่อไม่ให้ error ทำ descriptor รั่ว แล้วข้อ 3 ค่อยแนะนำ `with` ในฐานะรูปแบบเดียวกันที่กลายเป็นไวยากรณ์" },
      { code: String.raw`# ข้อ 0-2: ต้องเขียนแบบนี้
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

# ข้อ 3 เป็นต้นไป: อันเดียวกัน แต่ภาษาการันตีให้
with open(path, "r", encoding="utf-8") as handle:
    return handle.read()`,
        cap: "สิ่งที่ with ทำแทนเรา", lang: "python" },
      { ul: [
        "ข้อ 2 อ่านจาก `sys.stdin` ไม่ใช่ `input()` และ error ไปที่ `sys.stderr` โดยไม่มีอย่างอื่นปนบน stderr",
        "`open()` บนพาธที่มีไบต์ NUL โยน `ValueError` ไม่ใช่ `OSError` — จับ `(OSError, ValueError)` และเติม `UnicodeDecodeError` สำหรับการอ่านแบบข้อความ",
        "การ grep ซอร์สดิบหา `\"with \"` จะไปเจอมันใน docstring ด้วย — ลอกคอมเมนต์กับ docstring ออกด้วย `tokenize` ก่อนตรวจกฎแบบนี้ ไม่งั้นไฟล์ที่ถูกต้องจะถูกรายงานว่าผิด"
      ]}
    ],

    implementation: [
      { h: "ลำดับการทำงานที่ใช้ได้กับทุกโมดูล" },
      { ul: [
        "อ่านโจทย์ทั้งไฟล์ก่อน แล้วคัดลอก transcript ตัวอย่างของทุกข้อออกมาไว้ก่อนเขียนโค้ด",
        "เขียนข้อแรก แล้วรัน flake8 กับ mypy **ทันที** — อย่าสะสมหนี้",
        "เทียบผลลัพธ์กับ transcript **ตัวอักษรต่อตัวอักษร**",
        "เขียน `tests/run_tests.py` สามชั้นก่อนไปข้อถัดไป",
        "ทำซ้ำ"
      ]},
      { h: "ตัวอย่างที่แสดงกฎกลางครบในไฟล์เดียว" },
      { code: String.raw`#!/usr/bin/env python3
"""ex7/ft_seed_inventory.py — หนึ่งไฟล์ หนึ่งงาน มี type ครบ."""

UNITS = ("packets", "grams", "area")


def ft_seed_inventory(seed_type: str, quantity: int, unit: str) -> None:
    """พิมพ์รายการเมล็ดหนึ่งบรรทัด หรือปฏิเสธหน่วยที่ไม่รู้จัก

    Args:
        seed_type: ชื่อชนิดเมล็ด
        quantity: จำนวน
        unit: หนึ่งใน "packets", "grams", "area"
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
        cap: "รูปแบบที่ผ่านทั้ง flake8 และ mypy --strict", lang: "python" },
      { p: "สังเกตว่า ไม่มี `if __name__` ในข้อที่โจทย์ไม่ได้ขอ และไม่มีอะไรเกินจากที่สั่ง — 'ไฟล์มีเฉพาะสิ่งที่ขอ' เป็นกฎที่ถูกตรวจจริง" },
      { h: "ชุดเทสต์สามชั้น" },
      { table: { head: ["ชั้น", "ตรวจอะไร"], rows: [
        ["**NORMAL**", "ไฟล์อยู่ครบ ชื่อฟังก์ชันตรง และผลลัพธ์ตรง transcript ทุกตัวอักษร"],
        ["**EXTREME**", "ขอบของทุกการเปรียบเทียบ ศูนย์และหนึ่ง สตริงว่าง อินพุตไม่ใช่ ASCII อินพุตยาวมาก และทุกกิ่งของ dispatch รวมกิ่งที่ไม่รู้จัก"],
        ["**HARDCORE**", "คุณสมบัติแทนตัวอย่าง: เวอร์ชันวนลูปกับ recursive ตรงกันตลอดช่วง, ตัวนับตรงกับจำนวนครั้งที่เรียกเป๊ะ, เรียกสองครั้งได้คำตอบเดิม, flake8 กับ `mypy --strict` เป็นศูนย์"]
      ]}},
      { code: String.raw`import io
from contextlib import redirect_stdout

def captured(function, *args):
    """คืนสิ่งที่ฟังก์ชันพิมพ์ออกมา"""
    buffer = io.StringIO()
    with redirect_stdout(buffer):
        function(*args)
    return buffer.getvalue()

out = captured(ft_seed_inventory, "TOMATO", 3, "packets")
assert out == "Tomato: 3 packets\n"`,
        cap: "จับ stdout เพื่อเทียบกับ transcript", lang: "python" },
      { note: "เวลาเทสต์ล้ม ให้หาก่อนว่าอะไรพัง — โค้ดหรือเทสต์ ประสบการณ์จริงคือส่วนใหญ่เป็นเทสต์ที่เขียนผิด **ให้ทำเทสต์ให้เข้มขึ้น อย่าลดเงื่อนไขที่ยืนยัน**" }
    ],

    tricks: [
      { h: "อาการ → สาเหตุ" },
      { table: { head: ["อาการ", "สาเหตุ"], rows: [
        ["mypy: `Cannot assign to a method`", "attribute กับ method ชื่อเดียวกัน เปลี่ยนชื่อตัวใดตัวหนึ่ง"],
        ["flake8 ฟ้องเป็นร้อยใน `typing_extensions.py`", "มันกำลังตรวจ `.venv` — ใส่ `setup.cfg` ที่ exclude"],
        ["E501 เต็มไปหมด", "ค่า default ของ flake8 คือ 79 คอลัมน์ ไม่ใช่ 88"],
        ["`str.capitalize()` ให้ `\"Sweet corn\"` ทั้งที่อยากได้ `\"Sweet Corn\"`", "มันทำแบบนั้น — `str.title()` คืออีกตัว"],
        ["ข้อ recursive ตายกับอินพุตใหญ่", "recursion limit ของ Python — เลขในโจทย์เล็ก แต่เทสต์ที่ดันขอบคือวิธีที่ทำให้รู้"],
        ["`classmethod` ของซับคลาสคืนชนิดของแม่", "มันเขียนชื่อคลาสตรง ๆ แทนที่จะใช้ `cls`"],
        ["ทุกอินสแตนซ์ใช้ตัวนับร่วมกัน", "ตัวนับถูกสร้างเป็น class attribute แทนที่จะอยู่ใน `__init__`"],
        ["generator ให้ค่าว่างในรอบที่สอง", "generator ใช้ได้ครั้งเดียว แปลงเป็น list ถ้าต้องวนซ้ำ"]
      ]}},
      { h: "นิสัยที่ช่วยได้จริง" },
      { ul: [
        "**เขียน type ตอนเขียนโค้ด** ไม่ใช่ตอนท้าย — `--disallow-untyped-defs` ทำให้การไล่ใส่ทีหลังเป็นงานทั้งวัน",
        "**เทียบ transcript ด้วยเครื่อง** ไม่ใช่ด้วยตา — ช่องว่างท้ายบรรทัดกับ `'` กับ `’` มองด้วยตาไม่เห็น",
        "รัน `mypy --strict` ถึงแม้โจทย์จะขอแค่แฟล็กชุดสั้น — ผ่าน strict แล้วชุดสั้นผ่านแน่นอน",
        "ห้าม `except Exception` ถ้าไม่มีเหตุผลเขียนกำกับ — ถ้าจำเป็นจริง ให้เขียนคอมเมนต์บอกว่าทำไมถึงต้องกว้างขนาดนั้น",
        "อย่าให้ `.venv` ขึ้น git — `.gitignore` ตั้งแต่ commit แรก"
      ]}
    ],

    eval: [
      { qa: [
        { q: "`if __name__ == \"__main__\":` มีไว้ทำไม", a: "ตอนไฟล์ถูก import ค่า `__name__` จะเป็นชื่อโมดูล ไม่ใช่ `\"__main__\"` การ์ดนี้จึงให้คนที่ import ได้เฉพาะนิยาม โดยไม่ได้ผลข้างเคียงจากการรันโปรแกรม" },
        { q: "ทำไมต้องขีดล่างตัวเดียว ไม่ใช่สองตัว", a: "สองตัวทำให้เกิด name mangling ซึ่งเปลี่ยนชื่อจริงของ attribute และทำให้ซับคลาสเข้าถึงยาก Python ไม่มี private จริง ขีดล่างเดียวคือข้อตกลงระหว่างโปรแกรมเมอร์ ซึ่งคือสิ่งที่โจทย์อยากให้แสดง" },
        { q: "`@staticmethod` กับ `@classmethod` ต่างกันตรงไหน", a: "static ไม่รับทั้ง `self` และ `cls` — มันเป็นฟังก์ชันธรรมดาที่วางไว้ในคลาสเพราะมันอยู่ในหัวข้อเดียวกัน ส่วน class method รับ `cls` จึงสร้างอินสแตนซ์ของคลาสที่ถูกเรียกจริงได้ ทำให้ `Flower.anonymous()` คืน `Flower`" },
        { q: "ทำไม `finally` ถึงจำเป็น ในเมื่อเขียนต่อท้าย try ก็ได้", a: "โค้ดที่ต่อท้าย try จะไม่ถูกรันถ้ามี `return` หรือ exception ที่ไม่ถูกจับ ส่วน `finally` รันเสมอ ไม่ว่าจะออกจากบล็อกด้วยทางไหน" },
        { q: "ทำไมโมดูล 04 ห้ามใช้ `with` ในสามข้อแรก", a: "เพื่อให้เห็นว่า `with` ทำอะไรให้ — เปิด ใช้ ปิดใน `finally` คือรูปแบบที่ต้องจำให้ครบทุกทางออก ส่วน `with` คือการันตีของภาษาที่ลืมไม่ได้ตอน refactor" },
        { q: "dict กับ set ต่างกันยังไงในแง่ลำดับ", a: "dict เก็บลำดับที่ใส่มาตั้งแต่ Python 3.7 ส่วน set ไม่มีลำดับที่รับประกัน อะไรที่พิมพ์จาก set ต้องเรียงก่อน ไม่งั้นผลลัพธ์ไม่ซ้ำเดิมข้ามการรัน" },
        { q: "ทำไม flake8 ถึงตั้ง 79 คอลัมน์", a: "เพราะโจทย์ไม่ให้ไฟล์ config มา จึงเป็นค่า default ของเครื่องมือ ซึ่งมาจาก PEP 8 การเปลี่ยนเองโดยไม่มีเหตุผลคือการเปลี่ยนกติกาที่ถูกตรวจ" },
        { q: "ถ้า traceback หลุดตอน defense จะเกิดอะไร", a: "ถือว่าโปรเจกต์ non-functional เท่ากับไม่ได้ทำ ทุก error path จึงต้องถูกจับและพิมพ์ข้อความที่อ่านรู้เรื่องแทน" }
      ]}
    ]
  }
});

window.TEACHING_DATA.push({
  id: "py_patterns",
  name: "Python Modules 05–07",
  tag: {
    th: "abstract class กับ polymorphism, ระบบ import และ package, แล้วจบด้วย abstract factory / capability / strategy — สามโมดูลที่สอนวิธีเขียนโค้ดที่เพิ่มของใหม่โดยไม่ต้องแก้ของเก่า",
    en: "Abstract classes and polymorphism, the import system and packages, then abstract factories, capabilities and strategies — three modules on writing code that grows by addition instead of edit"
  },
  accent: "#8b5cf6",
  sections: {
    principle: [
      { h: "สามโมดูลนี้ตอบคำถามเดียวกัน" },
      { p: "คำถามคือ: **จะเพิ่มชนิดข้อมูลใหม่ ความสามารถใหม่ หรือกลยุทธ์ใหม่ โดยไม่ต้องกลับไปแก้โค้ดที่ใช้งานมันอยู่ได้อย่างไร**" },
      { table: { head: ["โมดูล", "คำตอบที่มันให้"], rows: [
        ["**05** Code Nexus", "abstract base class + polymorphism — ผู้เรียกถามว่า 'รับได้ไหม' แทนที่จะเช็กชนิดเอง"],
        ["**06** The Codex", "package + `__init__.py` — แยกสิ่งที่ package ‘มี’ ออกจากสิ่งที่ package ‘ให้’"],
        ["**07** DataDeck", "abstract factory, capability, strategy — ย้ายทุกอย่างที่แตกต่างออกจากผู้เรียก"]
      ]}},
      { p: "ตัวชี้วัดว่าเข้าใจจริง มีข้อเดียว: **เพิ่มชนิดที่สี่แล้วมีไฟล์กี่ไฟล์ต้องแก้** ถ้าคำตอบคือ 'หนึ่ง — ไฟล์ใหม่' แปลว่าถูก" },
      { h: "อะไรถูกส่งบ้าง" },
      { table: { head: ["โมดูล", "ไฟล์"], rows: [
        ["05", "`ex0/data_processor.py`, `ex1/data_stream.py`, `ex2/data_pipeline.py` — แต่ละไฟล์ยืนได้ด้วยตัวเอง จึงมีคลาสซ้ำกัน"],
        ["06", "ต้นไม้ไฟล์เดียว: package `alchemy/` กับสคริปต์ทดสอบ 13 ตัวที่ราก"],
        ["07", "`ex0/`–`ex2/` เป็น package (ต้องมี `__init__.py`) กับสคริปต์ที่ราก: `battle.py`, `capacitor.py`, `tournament.py`"]
      ]}}
    ],

    theory: [
      { h: "โมดูล 05 — abstract class ที่มีลายเซ็นไม่สมมาตร" },
      { p: "คลาสฐานประกาศสองเมธอดเป็น abstract และหนึ่งเมธอดเป็น concrete และความไม่สมมาตรของลายเซ็นคือบทเรียน:" },
      { code: String.raw`class DataProcessor(ABC):
    @abstractmethod
    def validate(self, data: Any) -> bool:
        """คงเป็น Any ในทุกซับคลาส — ผู้เรียกถามเพราะยังไม่รู้คำตอบ"""

    @abstractmethod
    def ingest(self, data: Any) -> None:
        """ซับคลาสแคบลายเซ็นลงเหลือเฉพาะชนิดที่ตัวเองรับ"""

    def output(self) -> tuple[int, str]:
        """เหมือนกันทุกที่ จึงเขียนครั้งเดียวในคลาสฐาน"""`,
        cap: "ทำไม validate ถึงคง Any แต่ ingest ไม่คง", lang: "python" },
      { note: "`validate` กับ `ingest` ต้องพูดตรงกัน ถ้า `validate` ยอมรับ list ซ้อน list แล้ว `ingest` ก็ต้องแบนลงไปถึงระดับเดียวกัน ไม่งั้นมันจะเก็บ repr ของ list ชั้นในไว้เป็นค่า ให้ helper ที่แบนอยู่ในคลาสฐาน" },
      { p: "`isinstance(True, int)` เป็นจริง — processor ที่รับตัวเลขและไม่กัน `bool` ออก จะกลืน `True` เข้าไปเป็น 1 อย่างเงียบ ๆ" },
      { h: "Protocol — สัญญาที่ไม่มีการสืบทอด" },
      { p: "ข้อ 2 ของโมดูล 05 ใช้ `Protocol` สำหรับปลั๊กอินส่งออก ความต่างจาก ABC คือ **ใครต้องรู้จักใคร**: ซับคลาสของ ABC ต้อง import แล้วสืบทอดคลาสฐานของเรา ส่วนคนเขียนปลั๊กอินแค่ทำเมธอดให้ลายเซ็นตรง แล้วเขียนมันใน package ที่ไม่เคยได้ยินชื่อเราเลยก็ได้" },
      { code: String.raw`class ExportPlugin(Protocol):
    def process_output(self, data: list[tuple[int, str]]) -> None: ...

# ไม่มีใครสืบทอดจากมัน คลาสนี้ก็ผ่านสัญญาแล้ว
class CsvExportPlugin:
    def process_output(self, data: list[tuple[int, str]]) -> None:
        print(",".join(value for _, value in data))`,
        cap: "duck typing ที่ตรวจได้ตอน type-check", lang: "python" },
      { note: "`Protocol` ธรรมดาใช้กับ `isinstance` ไม่ได้ — มันโยน `TypeError` เพราะเป็นสัญญาระดับ type-check ไม่ใช่ runtime จึงควรมียามที่ runtime ด้วย: `callable(getattr(plugin, \"process_output\", None))`" },
      { h: "โมดูล 06 — สองกฎที่อธิบายทุกอย่าง" },
      { ul: [
        "`import x` ภายใน package เป็น absolute เสมอ — มันหา `x` ระดับบนสุด ไม่ใช่ไฟล์ข้าง ๆ ส่วน `from .x import y` หาไฟล์ข้าง ๆ ดังนั้นไฟล์ชื่อ `elements.py` สองไฟล์อยู่ร่วมกันได้ เพราะตัวตนของโมดูลคือ **พาธแบบจุด** ไม่ใช่ชื่อไฟล์",
        "`__init__.py` ตัดสินว่า package ‘ให้’ อะไร — ฟังก์ชันที่ไม่ถูก re-export จะทำให้ `package.name` โยน `AttributeError` ทั้งที่ `from package.module import name` ยังใช้ได้ อยู่ใน package ไม่เท่ากับเป็นส่วนหนึ่งของหน้าตามัน"
      ]},
      { h: "โมดูล 07 — สามรูปแบบที่ต่อกัน" },
      { table: { head: ["รูปแบบ", "มันเอาอะไรออกจากผู้เรียก"], rows: [
        ["**abstract factory**", "ชื่อคลาสจริง — ผู้เรียกขอ 'การ์ดใบพื้นฐานของตระกูลไฟ' ไม่ใช่ `Flameling()`"],
        ["**capability**", "การผูกความสามารถไว้กับสายพันธุ์ — `HealCapability` ไม่ได้สืบทอด `Creature` เลย ของอย่างอื่นจึงหยิบไปใช้ได้"],
        ["**strategy**", "โซ่ `if isinstance` ในโค้ดที่สู้กัน — tournament เรียก `act()` แล้วพิมพ์สิ่งที่ได้กลับมา"]
      ]}}
    ],

    architecture: [
      { h: "ต้นไม้ไฟล์ของโมดูล 06 คือตัวโจทย์เอง" },
      { code: String.raw`.
|-- alchemy
|   |-- __init__.py            # ตัดสินว่า package ให้อะไร
|   |-- elements.py            # create_earth, create_air
|   |-- potions.py             # import ทั้ง root elements และ .elements
|   |-- grimoire
|   |   |-- __init__.py        # ให้เฉพาะ light — ห้ามแตะ dark
|   |   |-- light_spellbook.py
|   |   |-- light_validator.py # import แบบเลื่อน = ตัดวงจร
|   |   |-- dark_spellbook.py
|   |   '-- dark_validator.py  # import ที่หัวไฟล์ = วงจรปิด = ระเบิด
|   '-- transmutation
|       |-- __init__.py
|       '-- recipes.py         # absolute หนึ่ง relative หนึ่ง
|-- elements.py                # create_fire, create_water
'-- ft_alembic_0.py ... ft_kaboom_1.py`,
        cap: "13 สคริปต์ที่รากแต่ละตัวสาธิต import คนละแบบ", lang: "text" },
      { code: String.raw`"""alchemy/potions.py — ที่ที่ elements.py สองไฟล์มาเจอกัน"""

import elements                       # absolute: หา root elements.py
from .elements import create_air      # relative: หาไฟล์ข้าง ๆ

def strength_potion() -> str:
    return (f"Strength potion brewed with '{elements.create_fire()}' "
            f"and '{elements.create_water()}'")`,
        cap: "ไม่มีจุดนำหน้า = ไฟล์ข้าง ๆ เข้าไม่ถึงเลย", lang: "python" },
      { h: "`__init__.py` ที่ซ่อนของบางอย่างไว้โดยตั้งใจ" },
      { code: String.raw`from .elements import create_air
from .potions import healing_potion as heal
from .potions import strength_potion
from .transmutation import lead_to_gold

__all__ = ["create_air", "heal", "strength_potion", "lead_to_gold"]
# create_earth ไม่อยู่ในนี้ → alchemy.create_earth โยน AttributeError
# แต่ from alchemy.elements import create_earth ยังทำงานปกติ`,
        cap: "alchemy/__init__.py", lang: "python" },
      { note: "ใส่ชื่อที่ re-export ไว้ใน `__all__` — มันปิดปาก F401 ของ flake8 และทำให้ `--no-implicit-reexport` ของ `mypy --strict` ยอมรับ" },
      { h: "โครงของโมดูล 07" },
      { code: String.raw`ex0/  __init__.py  creature.py  creatures.py  factory.py
ex1/  __init__.py  capabilities.py  creatures.py  factory.py
ex2/  __init__.py  strategy.py
battle.py  capacitor.py  tournament.py`,
        cap: "package ให้เฉพาะ factory กับชนิดนามธรรม", lang: "text" }
    ],

    dataflow: [
      { h: "circular import — ทำไมมันพัง และทางออกสามทาง" },
      { p: "สองโมดูลที่ import กันที่หัวไฟล์ จะมีตัวหนึ่งถูกจับได้ตอนสร้างไม่เสร็จเสมอ Python บอกเองว่าเกิดอะไร:" },
      { code: String.raw`ImportError: cannot import name 'dark_spell_allowed_ingredients'
from partially initialized module 'alchemy.grimoire.dark_spellbook'
(most likely due to a circular import)`,
        cap: "คำว่า partially initialized คือสัญญาณ", lang: "text" },
      { p: "ตอน `dark_validator` ขอชื่อจาก `dark_spellbook` โมดูลนั้นอยู่ใน `sys.modules` แล้วก็จริง แต่รันมาถึงแค่บรรทัด import ของตัวเอง — ฟังก์ชันข้างล่างยังไม่มีตัวตน" },
      { table: { head: ["ทางออก", "เมื่อไหร่ควรใช้"], rows: [
        ["**import แบบเลื่อน** — ย้าย import เข้าไปในฟังก์ชัน", "เมื่อทั้งสองโมดูลต้องแยกกันอยู่จริง ๆ ค่าใช้จ่ายคือ dict lookup ครั้งเดียวต่อการเรียก"],
        ["**รวมสองโมดูลเป็นหนึ่ง**", "เมื่อใช้แยกกันไม่ได้อยู่แล้ว — แปลว่ามันเป็นโมดูลเดียวมาตั้งแต่แรก"],
        ["**กลับทิศพึ่งพา** — ย้ายข้อมูลร่วมไปโมดูลที่สาม หรือส่งเข้าเป็นอาร์กิวเมนต์", "สะอาดที่สุด และมักถูกตัดออกเพราะโจทย์ล็อกลายเซ็นไว้"]
      ]}},
      { code: String.raw`def validate_ingredients(ingredients: str) -> str:
    # import ตรงนี้ ไม่ใช่หัวไฟล์ — ตอนถูกเรียก ทั้งสองโมดูลโหลดครบแล้ว
    from .light_spellbook import light_spell_allowed_ingredients

    lowered = ingredients.lower()
    allowed = light_spell_allowed_ingredients()
    matched = any(item in lowered for item in allowed)
    return f"{ingredients} - {'VALID' if matched else 'INVALID'}"`,
        cap: "import แบบเลื่อนที่ตัดวงจร", lang: "python" },
      { h: "การสืบทอดหลายทาง — กับดักที่เงียบที่สุดของโมดูล 07" },
      { p: "การ์ดหนึ่งใบสืบทอดจาก `Creature` และจาก capability พร้อมกัน แต่ `Creature.__init__` ไม่ได้เรียก `super().__init__()` ดังนั้นถ้าใช้ `super()` แบบร่วมมือ โซ่จะหยุดตรงนั้นและ constructor ของ capability จะไม่เคยทำงาน" },
      { code: String.raw`# ผิด — เงียบ ๆ จนกว่าจะอ่าน state ของ capability
class Shiftling(Creature, TransformCapability):
    def __init__(self) -> None:
        super().__init__("Shiftling", "Normal")
        # TransformCapability.__init__ ไม่เคยถูกเรียก
        # AttributeError: '_transformed' ตอน attack() ครั้งแรก

# ถูก — เรียกทีละคลาสฐานอย่างชัดเจน
class Shiftling(Creature, TransformCapability):
    def __init__(self) -> None:
        Creature.__init__(self, "Shiftling", "Normal")
        TransformCapability.__init__(self)`,
        cap: "MRO ไม่ช่วยถ้าคลาสกลางไม่ร่วมมือ", lang: "python" },
      { h: "strategy ที่ทำให้ tournament ไม่ต้องรู้อะไรเลย" },
      { code: String.raw`class AggressiveStrategy(BattleStrategy):
    label = "aggressive"

    def is_valid(self, creature: Creature) -> bool:
        return isinstance(creature, TransformCapability)

    def act(self, creature: Creature) -> list[str]:
        # เช็กซ้ำเพราะนี่คือสิ่งที่ narrow ชนิดให้ mypy
        # และ assert ใช้ไม่ได้ เพราะ -O ตัด assert ทิ้ง
        if not isinstance(creature, TransformCapability):
            raise self._reject(creature)
        return [creature.transform(), creature.attack(), creature.revert()]`,
        cap: "ex2/strategy.py", lang: "python" },
      { p: "แล้ว `run_tournament` ก็ไม่มีคำว่า heal, transform หรือ `isinstance` อยู่เลยแม้แต่คำเดียว" }
    ],

    implementation: [
      { h: "เทสต์ที่พิสูจน์ว่ารูปแบบทำงานจริง" },
      { p: "เทสต์ที่ดีที่สุดของทั้งสามโมดูลคือแบบเดียวกัน: **ประดิษฐ์ของใหม่ขึ้นมาในไฟล์เทสต์เอง** แล้วส่งเข้าโค้ดเดิมที่ไม่ถูกแก้เลย ถ้ามันวิ่งได้ แปลว่ารูปแบบให้ผลตามที่โฆษณา" },
      { code: String.raw`# เทสต์โมดูล 07: capability ที่เพิ่งคิดขึ้นเดี๋ยวนี้
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

# tournament.py ไม่ถูกแตะเลยสักบรรทัด
out = captured(tournament.run_tournament,
               [(WindFactory(), SoaringStrategy()),
                (ex0.FlameFactory(), ex2.NormalStrategy())])
assert "Windling takes to the sky!" in out`,
        cap: "ถ้าอันนี้ต้องแก้ run_tournament แปลว่ารูปแบบยังไม่เสร็จ", lang: "python" },
      { h: "เทสต์กลไก import ของโมดูล 06" },
      { code: String.raw`# สองไฟล์ชื่อเดียวกัน คนละโมดูล
python3 -c "import elements, alchemy.elements as inner; \
print(elements is inner, elements.__name__, inner.__name__)"
# False elements alchemy.elements

# วงจรพังจากทั้งสองทาง และพังซ้ำได้เหมือนเดิม
python3 -c "import alchemy.grimoire.dark_validator"   # ImportError
python3 -c "import alchemy.grimoire.dark_spellbook"   # ImportError

# ส่วนคู่ light โหลดได้จากทั้งสองทาง
python3 -c "import alchemy.grimoire.light_validator"  # ok`,
        cap: "ทดสอบด้วย interpreter ใหม่ทุกครั้ง เพราะ sys.modules จำ", lang: "bash" },
      { note: "**negative control ที่ควรมี**: คัดลอกต้นไม้ไปที่ชั่วคราว ย้าย import แบบเลื่อนของ `light_validator` กลับไปหัวไฟล์ แล้วยืนยันว่าคู่ light ระเบิดเหมือนคู่ dark — ไม่งั้นเทสต์ที่บอกว่า 'light ทำงาน' ไม่ได้พิสูจน์อะไรเลย" },
      { h: "โมดูล 06 มี error ที่ต้องเหลือไว้หนึ่งอัน" },
      { p: "`ft_alembic_4.py` เรียกฟังก์ชันที่ package ไม่ได้เปิดให้ มันต้องพังด้วย `AttributeError` และ **mypy ต้องฟ้อง** ตามที่โจทย์บอก วิธีตรวจที่ซื่อสัตย์คือยืนยันว่ามี error **หนึ่งอันพอดี** และเป็นอันนั้น ไม่ใช่ปิดปากมันด้วย `# type: ignore`" },
      { code: String.raw`errors = [line for line in mypy_output.splitlines() if ": error:" in line]
assert len(errors) == 1
assert errors[0].startswith("ft_alembic_4.py")
assert "[attr-defined]" in errors[0]`,
        cap: "ตรวจ error ที่ตั้งใจให้มี", lang: "python" }
    ],

    tricks: [
      { h: "อาการ → สาเหตุ" },
      { table: { head: ["อาการ", "สาเหตุ"], rows: [
        ["`cannot import name X from partially initialized module Y`", "circular import — เลื่อน import อันใดอันหนึ่งเข้าไปในฟังก์ชัน"],
        ["`Module has no attribute X` ทั้งที่ฟังก์ชันมีอยู่ชัด ๆ", "`__init__.py` ไม่ได้ re-export มัน"],
        ["F401 imported but unused ใน `__init__.py`", "เพิ่ม `__all__` — ปิดปาก flake8 และผ่าน `--no-implicit-reexport`"],
        ["`AttributeError: '_transformed'` ในคลาสที่สืบทอดหลายทาง", "`__init__` ของคลาสฐานที่สองไม่เคยทำงาน เรียกทีละคลาสอย่างชัดเจน"],
        ["`isinstance()` กับ Protocol โยน `TypeError`", "Protocol ธรรมดาเป็นสัญญาตอน type-check ถ้าอยากเช็ก runtime ต้อง `@runtime_checkable` หรือเช็ก `callable(getattr(...))` เอง"],
        ["processor รับ `True` เป็นเลข 1", "`bool` เป็นซับคลาสของ `int` ต้องกันออกเอง"],
        ["`validate` ผ่านแต่ `ingest` เก็บค่าประหลาด", "สองเมธอดเห็นโครงสร้างข้อมูลไม่ตรงกัน เช่น list ซ้อน list"],
        ["mypy บ่นตอน narrow ชนิดหลัง `is_valid`", "`is_valid` ไม่ narrow ให้ ต้องเขียน `isinstance` ใน `act` เอง"]
      ]}},
      { h: "หลักที่ใช้ตัดสินใจได้เร็ว" },
      { ul: [
        "**ABC เมื่อสิ่งนั้น ‘เป็น’ อะไรบางอย่าง, Protocol เมื่อมันแค่ ‘ทำ’ อะไรบางอย่างได้** — input ของ pipeline ใช้การสืบทอด output ใช้ duck typing นั่นคือความต่างที่โจทย์ถามตอน eval",
        "**absolute import สำหรับสิ่งที่คนอ่านอยากตามไปดู, relative สำหรับไส้ในของ package เอง** — relative ทำให้เปลี่ยนชื่อ package ได้โดยไม่ต้องแก้",
        "`__init__.py` คือหน้าตา ไม่ใช่สารบัญ — ใส่เฉพาะสิ่งที่ตั้งใจให้คนนอกใช้",
        "อย่าให้ `__init__.py` ของ package แตะโมดูลที่พังโดยตั้งใจ — ไม่งั้นแค่ import package ก็ระเบิดทั้งกระบิ",
        "`assert` ไม่ใช่การตรวจ — `python -O` ตัดมันทิ้ง ใช้ `if ... raise` เมื่อผลลัพธ์สำคัญ"
      ]}
    ],

    eval: [
      { qa: [
        { q: "ทำไม `validate` ถึงคงชนิด `Any` ในทุกซับคลาส แต่ `ingest` แคบลง", a: "เพราะผู้เรียกถาม `validate` ก็เพราะยังไม่รู้ว่าเป็นชนิดอะไร การบังคับให้รู้ก่อนถามคือการทำลายเหตุผลของเมธอดนั้น ส่วนตอน `ingest` คำตอบมีแล้ว จึงแคบลายเซ็นได้" },
        { q: "polymorphism ช่วยให้ DataStream ทำงานโดยไม่รู้จัก implementation ได้ยังไง", a: "DataStream ถือลิสต์ของ `DataProcessor` แล้วถามทีละตัวว่า `validate(element)` ไหม ความรู้ว่า 'อะไรนับเป็นข้อมูลตัวเลข' อยู่ที่เดียว คือข้าง ๆ โค้ดที่จัดการข้อมูลตัวเลข ไม่ได้กระจายเป็นโซ่ `isinstance` ในตัวจัดเส้นทาง" },
        { q: "ABC กับ Protocol ต่างกันตรงไหน และเลือกยังไง", a: "ABC บังคับความสัมพันธ์ทางการสืบทอดและตรวจตอนสร้างอินสแตนซ์ ส่วน Protocol เป็นสัญญาเชิงโครงสร้างที่ตรวจตอน type-check เท่านั้น เลือก ABC เมื่อเราคุมลำดับชั้นเอง เลือก Protocol เมื่ออยากให้คนอื่นเขียนของที่เข้ากันได้โดยไม่ต้อง import อะไรจากเรา" },
        { q: "absolute กับ relative import ควรใช้เมื่อไหร่", a: "absolute เอ่ยชื่อ package ออกมาตรง ๆ จึงตามอ่านง่ายและใช้ได้จากทุกที่บน `sys.path` แต่พังวันที่เปลี่ยนชื่อ package ส่วน relative บอกว่า 'ขึ้นไปสองชั้นจากฉัน' จึงย้ายหรือเปลี่ยนชื่อ package ได้โดยไม่ต้องแก้ แต่ใช้ได้เฉพาะเมื่อไฟล์เป็นส่วนหนึ่งของ package" },
        { q: "circular import แก้ได้กี่วิธี", a: "สามวิธี: เลื่อน import เข้าไปในฟังก์ชัน, รวมสองโมดูลเข้าด้วยกันเพราะจริง ๆ มันแยกกันไม่ได้, หรือกลับทิศพึ่งพาโดยย้ายข้อมูลร่วมไปโมดูลที่สามหรือส่งเข้าเป็นอาร์กิวเมนต์ วิธีที่สามสะอาดที่สุดถ้าลายเซ็นไม่ถูกล็อก" },
        { q: "abstract factory ต่างจากฟังก์ชันสร้างวัตถุธรรมดายังไง", a: "ฟังก์ชันธรรมดาสร้างของหนึ่งชิ้น ส่วน abstract factory สร้าง **ชุดที่เข้ากัน** — การ์ดพื้นฐานกับร่างวิวัฒน์ของตระกูลเดียวกัน และการันตีว่าจะไม่ได้ของข้ามตระกูลมา" },
        { q: "ทำไม capability ถึงไม่สืบทอดจาก Creature", a: "เพราะ capability บอกว่าสิ่งนั้น ‘ทำ’ อะไรได้ ไม่ได้บอกว่ามัน ‘เป็น’ อะไร ถ้าให้มันสืบทอด Creature แล้ว ไอเทมหรือภูมิประเทศจะรับความสามารถเดียวกันไปใช้ไม่ได้ โดยต้องลากชื่อกับชนิดของสัตว์ติดไปด้วย" },
        { q: "strategy pattern แยกความกังวลออกจากกันยังไง", a: "โค้ดที่จัดการการต่อสู้เดิมต้องรู้ทุก capability ผ่านโซ่เงื่อนไข พอย้ายพฤติกรรมไปอยู่ในคลาส strategy แล้ว tournament เหลือแค่เรียก `act()` การเพิ่ม capability ใหม่จึงเป็นการ ‘เพิ่มคลาส’ ไม่ใช่การ ‘แก้ฟังก์ชัน’" }
      ]}
    ]
  }
});

window.TEACHING_DATA.push({
  id: "py_toolkit",
  name: "Python Modules 08–10",
  tag: {
    th: "virtual environment, pip กับ Poetry, ความลับใน `.env`, การตรวจข้อมูลด้วย Pydantic v2 และการเขียนแบบฟังก์ชัน — สามโมดูลที่เป็นเครื่องมือของงานจริงมากกว่าเป็นแบบฝึกหัด",
    en: "Virtual environments, pip versus Poetry, secrets in .env, data validation with Pydantic v2, and functional programming — the three modules that are working tools rather than exercises"
  },
  accent: "#10b981",
  sections: {
    principle: [
      { h: "สามโมดูลนี้คือของที่ใช้จริงหลังจบ" },
      { table: { head: ["โมดูล", "ทักษะ", "ทำไมสำคัญนอกห้องเรียน"], rows: [
        ["**08** The Matrix", "venv, pip/Poetry, `.env`", "ทุก repo Python ในโลกทำงานมีสามอย่างนี้"],
        ["**09** Cosmic Data", "Pydantic v2", "การตรวจข้อมูลที่ขอบระบบ แทนที่จะปล่อยให้พังกลางทาง"],
        ["**10** FuncMage", "lambda, closure, decorator", "อ่านโค้ดคนอื่นออก และเขียนสิ่งที่นำกลับมาใช้ได้"]
      ]}},
      { h: "ไฟล์ที่ต้องส่ง" },
      { table: { head: ["โมดูล", "ไฟล์"], rows: [
        ["08", "`ex0/construct.py`, `ex1/loading.py` + `requirements.txt` + `pyproject.toml`, `ex2/oracle.py` + `.env.example` + `.gitignore`"],
        ["09", "`ex0/space_station.py`, `ex1/alien_contact.py`, `ex2/space_crew.py` — ใช้ Pydantic 2.x ติดตั้งด้วย pip"],
        ["10", "`lambda_spells.py`, `higher_magic.py`, `scope_mysteries.py`, `functools_artifacts.py`, `decorator_mastery.py`"]
      ]}},
      { note: "โมดูล 10 ห้าม **global variable**, ห้าม **file I/O**, ห้าม `eval`/`exec` — ข้อห้ามพวกนี้ถูกตรวจจากซอร์สจริง ไม่ใช่จากคำพูด" }
    ],

    theory: [
      { h: "venv คืออะไรจริง ๆ" },
      { p: "virtual environment ไม่ใช่คอนเทนเนอร์ ไม่มีการแยกโปรเซส และไม่มี Python ตัวใหม่ มันคือไดเรกทอรีที่ทำให้ `sys.prefix` กับ `sys.base_prefix` ไม่ตรงกัน — มี `pyvenv.cfg`, ลิงก์ไปยัง interpreter ตัวจริง และ `site-packages` ว่าง ๆ หนึ่งอัน" },
      { code: String.raw`def in_virtual_environment() -> bool:
    """วิธีเดียวที่เชื่อถือได้"""
    return sys.prefix != sys.base_prefix`,
        cap: "PEP 405 พูดแค่นี้", lang: "python" },
      { note: "ห้ามใช้ `VIRTUAL_ENV` เป็นคำตอบ — สคริปต์ activate เป็นคนตั้ง มันจึงว่างเปล่าเมื่อเรียก python ของ venv ด้วยพาธเต็มโดยไม่ activate และค้างอยู่ได้หลัง deactivate รายงานมันได้ในฐานะข้อมูล แต่อย่าให้มันเป็นคนตอบ" },
      { h: "pip กับ Poetry ต่างกันตรงไหนจริง ๆ" },
      { table: { head: ["", "pip", "Poetry"], rows: [
        ["ไฟล์", "`requirements.txt` รายการแบน", "`pyproject.toml` การประกาศ"],
        ["วิธีติดตั้ง", "ทีละตัวตามลำดับในไฟล์", "แก้กราฟพึ่งพาทั้งก้อนก่อน แล้วค่อยติดตั้ง"],
        ["เวอร์ชันชนกัน", "ได้อันที่ติดตั้งทีหลัง", "ปฏิเสธชุดที่อยู่ร่วมกันไม่ได้"],
        ["ทำซ้ำได้ไหม", "ไม่ — สองเครื่องคนละเดือนอาจได้คนละเวอร์ชัน", "`poetry.lock` ตรึงเวอร์ชันที่แก้ได้จริง"]
      ]}},
      { p: "ความต่างที่สำคัญไม่ใช่การสะกดคำสั่ง แต่คือ **ใครเป็นคนแก้ปัญหาเวอร์ชัน** — `pip freeze` บันทึกสิ่งที่บังเอิญถูกติดตั้ง ส่วน lock file บันทึกสิ่งที่ถูกคำนวณว่าเข้ากันได้" },
      { h: "Pydantic v2 — annotation คือการตรวจ" },
      { p: "`crew_size: int = Field(ge=1, le=20)` ไม่ใช่คอมเมนต์ให้คนอ่าน มันแปลว่า **สร้างสถานีที่มีลูกเรือ 21 คนไม่ได้** error มาถึงตรงขอบที่ข้อมูลเข้ามา ไม่ใช่อีกพันบรรทัดถัดไปตอนมีอะไรไปหารด้วยมัน" },
      { table: { head: ["พฤติกรรม", "ต้องรู้ก่อนเชื่อโมเดล"], rows: [
        ["coercion เปิดอยู่", "`\"6\"` เป็น `6` และสตริง ISO เป็น `datetime` เพราะข้อมูลมักมาจาก JSON"],
        ["แต่ต้องไม่สูญเสีย", "`6.5` เข้า `int` เป็น error ไม่ใช่ 6 เงียบ ๆ"],
        ["assignment ไม่ถูกตรวจ", "ตอนสร้างตรวจ แต่ `station.crew_size = 99` ทีหลังไม่ตรวจ เว้นแต่ขอ `validate_assignment=True`"],
        ["annotation เปล่า = field", "ค่าคงที่ต้องใช้ `ClassVar[...]` ไม่งั้นมันกลายเป็น field ที่ตั้งค่าได้"]
      ]}},
      { h: "โมดูล 10 — สามคำที่ต้องแยกให้ออก" },
      { ul: [
        "**lambda** คือฟังก์ชันที่ไม่มีชื่อ ข้อดีคือ key ของ `sorted` ถูกใช้ที่เดียวตรงจุดที่เขียน ข้อเสียคือไม่มี docstring ไม่มี statement และ traceback บอกแค่ `<lambda>`",
        "**closure** คือฟังก์ชันบวกกับตัวแปรรอบนอกที่มันยังอ้างถึง ตอน `mage_counter` คืนค่า ตัวแปร `count` ไม่ได้หายไป — ฟังก์ชันที่คืนมาถือ ‘cell’ ที่เก็บมันไว้",
        "**decorator** คือฟังก์ชันที่คืนฟังก์ชัน `@spell_timer` เหนือ def หมายถึง `fireball = spell_timer(fireball)` ทุกอย่างที่เหลือตามมาจากประโยคนี้"
      ]},
      { note: "อ่านตัวแปรรอบนอกไม่ต้องประกาศอะไร แต่ ‘เขียนทับ’ ต้องใช้ `nonlocal` — ไม่งั้นการ assign ทำให้มันเป็นตัวแปรท้องถิ่น แล้วการอ่านก่อน assign จะได้ `UnboundLocalError` ส่วนการ ‘แก้ไข’ dict ไม่ใช่การเขียนทับ จึงไม่ต้องประกาศ" }
    ],

    architecture: [
      { h: "โปรแกรมที่ต้องรอดเมื่อไลบรารีหาย" },
      { p: "`loading.py` ของโมดูล 08 ต้องทำงานได้ทั้งตอนที่มี pandas และตอนที่ไม่มี ดังนั้นมัน ห้าม `import pandas` ที่หัวไฟล์ เพราะนั่นทำให้ไลบรารีที่หายไปกลายเป็น traceback ก่อน `main()` จะได้เริ่ม" },
      { code: String.raw`import importlib
from typing import Any


def load(name: str) -> Any:
    """import ตามชื่อ หรือคืน None ถ้าไม่มี"""
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
        cap: "ผลลัพธ์ของการ import กลายเป็นข้อมูล ไม่ใช่การพัง", lang: "python" },
      { note: "โจทย์อนุญาตให้ flake8 กับ mypy ฟ้อง import ในข้อนี้ได้ — แต่การเขียนแบบนี้ทำให้ไม่มีอะไรให้ฟ้องเลย" },
      { p: "และก่อน import `matplotlib.pyplot` ต้องเลือก backend `Agg` ก่อน ไม่งั้นเครื่องที่ไม่มีจอ (build server, ssh) จะ import ไม่ผ่านทั้งที่โปรแกรมแค่จะเซฟไฟล์" },
      { h: "การตั้งค่าที่ shell ชนะไฟล์เสมอ" },
      { code: String.raw`from dotenv import load_dotenv

from_shell = {key for key in KEYS if key in os.environ}  # อ่านก่อน!
load_dotenv(ENV_FILE, override=False)                    # เติมเฉพาะที่ขาด
from_file = {key for key in KEYS
             if key in os.environ and key not in from_shell}`,
        cap: "override=False คือทั้งหมดของเรื่อง", lang: "python" },
      { p: "ค่า default ของ `load_dotenv` คือ **ไม่ทับ** ตัวแปรที่มีอยู่แล้ว นั่นคือสิ่งที่ทำให้ `MATRIX_MODE=production python3 oracle.py` ใช้ได้โดยไม่ต้องแก้อะไร การใส่ `override=True` กลับทิศทางนี้ และทำให้ deployment ที่ตั้ง secret ไว้ในสภาพแวดล้อมโดนไฟล์ของ developer ทับ" },
      { h: "โมเดล Pydantic ที่มีกฎข้ามฟิลด์" },
      { code: String.raw`class AlienContact(BaseModel):
    contact_id: str = Field(min_length=5, max_length=15)
    contact_type: ContactType
    signal_strength: float = Field(ge=0.0, le=10.0)
    witness_count: int = Field(ge=1, le=100)
    message_received: str | None = Field(default=None, max_length=500)
    is_verified: bool = False

    # ClassVar ไม่ใช่ annotation เปล่า ไม่งั้นมันกลายเป็น field
    STRONG_SIGNAL: ClassVar[float] = 7.0

    @model_validator(mode="after")
    def check_report_is_credible(self) -> "AlienContact":
        if not self.contact_id.startswith("AC"):
            raise ValueError("Contact ID must start with 'AC'")
        if self.contact_type is ContactType.PHYSICAL and not self.is_verified:
            raise ValueError("Physical contact reports must be verified")
        return self          # ลืมบรรทัดนี้ = constructor คืน None`,
        cap: "Field สำหรับฟิลด์เดียว model_validator สำหรับหลายฟิลด์", lang: "python" }
    ],

    dataflow: [
      { h: "nested model — ลำดับการตรวจคือส่วนที่มีประโยชน์" },
      { p: "`crew: list[CrewMember]` ไม่ใช่แค่ hint ที่หวังผลดี Pydantic ตรวจทุกสมาชิก และ dict ในลิสต์นั้นจะ **ถูกสร้างเป็น** `CrewMember` จริง ๆ ดังนั้นภารกิจที่สร้างจาก JSON ที่แกะแล้ว จะได้วัตถุลูกเรือจริง ไม่ใช่ dict ที่แกล้งทำเป็น" },
      { code: String.raw`try:
    SpaceMission(mission_id="X_BAD", crew=[{"name": "A", "age": 9, ...}])
except ValidationError as error:
    print(error.errors()[0]["loc"])   # ('crew', 0, 'age')
    print(error.errors()[0]["msg"])   # Input should be greater than or equal to 18`,
        cap: "โมเดลชั้นในถูกตรวจก่อน validator ของภารกิจจึงไม่เคยทำงาน", lang: "python" },
      { p: "และทุกฟิลด์ที่ผิดถูกรายงานพร้อมกันในรอบเดียว ไม่ใช่ทีละอัน — `error.errors()` คือลิสต์" },
      { h: "closure สองตัวคือสอง cell" },
      { code: String.raw`counter = mage_counter()
counter.__closure__[0].cell_contents      # 0 ก่อนเรียก
counter()
counter.__closure__[0].cell_contents      # 1 หลังเรียก

other = mage_counter()
counter.__closure__[0] is other.__closure__[0]   # False`,
        cap: "นี่คือเหตุผลที่ nonlocal ถูกอนุญาตแต่ global ไม่", lang: "python" },
      { p: "`nonlocal` เอื้อมถึงฟังก์ชันที่ห่อหนึ่งชั้น สถานะจึงเป็นของ closure นั้นตัวเดียว ส่วน `global` เอื้อมถึงสถานะระดับโมดูลที่ทุกฟังก์ชันในโปรแกรมใช้ร่วมกัน — ซึ่งคือการผูกติดที่โมดูลนี้กำลังสอนวิธีเลี่ยง" },
      { h: "functools — สี่เครื่องมือกับสิ่งที่มันแทน" },
      { table: { head: ["เครื่องมือ", "แทนอะไร"], rows: [
        ["`reduce`", "ลูปที่พับลำดับให้เหลือค่าเดียว — `sum` คือ `reduce(add, ...)` ที่มีชื่อสวยกว่า"],
        ["`partial`", "lambda ที่ตรึงอาร์กิวเมนต์ไว้บางตัว แต่ยังเก็บ `__doc__` และ pickle ได้"],
        ["`lru_cache`", "dict ของผลลัพธ์ที่เขียนเองแล้วลืม invalidate"],
        ["`singledispatch`", "โซ่ `if isinstance` ที่กลายเป็น registry — ชนิดใหม่คือการ register หนึ่งฟังก์ชัน ไม่ใช่การแก้โซ่"]
      ]}},
      { code: String.raw`@functools.lru_cache(maxsize=None)
def memoized_fibonacci(n: int) -> int:
    if n < 0:
        raise ValueError("Fibonacci is not defined for negative numbers")
    if n < 2:
        return n
    return memoized_fibonacci(n - 1) + memoized_fibonacci(n - 2)

memoized_fibonacci(25)
memoized_fibonacci.cache_info()     # misses=26 — n ละครั้งพอดี
# เวอร์ชันที่ไม่มี cache: 242785 ครั้ง`,
        cap: "cache เปลี่ยนความซับซ้อน ไม่ใช่แค่ค่าคงที่", lang: "python" },
      { h: "decorator ที่ทำงานได้ทั้งกับฟังก์ชันและเมธอด" },
      { p: "โจทย์ให้ `power_validator` ใช้กับฟังก์ชันที่ **อาร์กิวเมนต์แรกคือ power** และให้ใช้กับ `cast_spell(self, spell_name, power)` ด้วย ซึ่งอาร์กิวเมนต์แรกคือ `self` ทางออกที่ไม่ต้องรู้จัก inspect:" },
      { code: String.raw`def _power_from(args: tuple[Any, ...], kwargs: dict[str, Any]) -> Any:
    """keyword ชนะเพราะไม่กำกวม ไม่งั้นเอา int ตัวแรกในตำแหน่ง
    — self ไม่ใช่ int จึงถูกข้ามโดยที่ decorator ไม่ต้องรู้ว่ามันคือเมธอด"""
    if "power" in kwargs:
        return kwargs["power"]
    for value in args:
        if isinstance(value, int) and not isinstance(value, bool):
            return value
    return None`,
        cap: "หนึ่ง decorator รับใช้ทั้งสองแบบ", lang: "python" }
    ],

    implementation: [
      { h: "เทสต์ที่วัดผล แทนที่จะอ้าง" },
      { p: "เทสต์ที่ดีของสามโมดูลนี้คือเทสต์ที่ **วัดของจริง** ไม่ใช่เทียบข้อความ" },
      { code: String.raw`# lru_cache: negative control คือเวอร์ชันที่ไม่มี cache
uncached_calls = {"n": 0}

def naive(n: int) -> int:
    uncached_calls["n"] += 1
    if n < 2:
        return n
    return naive(n - 1) + naive(n - 2)

assert naive(25) == memoized_fibonacci(25)
assert memoized_fibonacci.cache_info().misses == 26
assert uncached_calls["n"] > 200000     # 242785 ในทางปฏิบัติ`,
        cap: "ตัวเลขเป็นคนพูด ไม่ใช่ docstring", lang: "python" },
      { code: String.raw`# secret ต้องไม่โผล่ไม่ว่าจะมาจากทางไหน
result = run(ORACLE, {"API_KEY": "hunter2-do-not-print"})
assert "hunter2-do-not-print" not in result.stdout
assert "API_KEY: set (20 characters)" in result.stdout

# และ .env ต้องถูก git ignore จริง ไม่ใช่แค่พิมพ์ว่า [OK]
assert ".env" in open("ex2/.gitignore").read().split()`,
        cap: "ตรวจการตั้งค่า ไม่ใช่ตรวจข้อความที่มันพิมพ์", lang: "python" },
      { note: "**negative control ที่คุ้มที่สุดของโมดูล 08**: คัดลอก `oracle.py` ไปที่ชั่วคราว แทรก `API_KEY = \"sk-live-...\"` ลงไป แล้วยืนยันว่าการตรวจความปลอดภัยจับได้ ถ้าไม่ทำแบบนี้ บรรทัด `[OK] No hardcoded secrets detected` ไม่ได้พิสูจน์อะไรเลย" },
      { h: "ตรวจ decorator ให้ครบทุกข้อ" },
      { code: String.raw`# functools.wraps เก็บ metadata ไว้จริงไหม
assert fireball.__name__ == "fireball"
assert hasattr(fireball, "__wrapped__")

# timer ต้องรายงานแม้ฟังก์ชันระเบิด เพราะมันจับเวลาใน finally
buffer = io.StringIO()
with redirect_stdout(buffer):
    try: doomed()
    except RuntimeError: pass
assert "Spell completed in" in buffer.getvalue()

# retry ต้องพิมพ์ max_attempts - 1 บรรทัดพอดี
for attempts in (1, 2, 5):
    printed = count_retry_lines(attempts)
    assert printed == attempts - 1`,
        cap: "เงื่อนไขขอบของ decorator", lang: "python" },
      { h: "ทดสอบ venv จากทั้งสองฝั่ง" },
      { code: String.raw`# ข้างนอก venv
python3 ex0/construct.py                       # "You're still plugged in"

# ข้างใน venv โดยไม่ activate
./.venv/bin/python ex0/construct.py            # "Welcome to the construct"

# VIRTUAL_ENV ค้างอยู่แต่ไม่ได้อยู่ใน venv จริง
VIRTUAL_ENV=/tmp/not-real python3 ex0/construct.py
# ต้องยังบอกว่า "still plugged in" — sys.prefix เป็นคนตอบ`,
        cap: "สามกรณีที่แยกการตรวจจริงออกจากการเดา", lang: "bash" }
    ],

    tricks: [
      { h: "อาการ → สาเหตุ" },
      { table: { head: ["อาการ", "สาเหตุ"], rows: [
        ["โมเดล Pydantic มี field ที่ไม่เคยประกาศ", "ค่าคงที่ถูกเขียนเป็น annotation เปล่า ใช้ `ClassVar`"],
        ["constructor ของ Pydantic คืน `None`", "`@model_validator` ที่ไม่ได้ `return self`"],
        ["`@validator` ขึ้น deprecation", "นั่นคือ v1 — ใช้ `@model_validator(mode=\"after\")`"],
        ["`6.5` ไม่ถูกแปลงเป็น `6`", "ถูกแล้ว — Pydantic แปลงเฉพาะที่ไม่สูญเสียข้อมูล"],
        ["แก้ค่าหลังสร้างแล้วไม่ถูกตรวจ", "ต้อง `model_config = ConfigDict(validate_assignment=True)`"],
        ["`matplotlib` import ไม่ผ่านบนเครื่องไม่มีจอ", "ต้อง `matplotlib.use(\"Agg\")` ก่อน import pyplot"],
        ["`.env` ทับค่าที่ตั้งจาก shell", "มี `override=True` อยู่ — เอาออก"],
        ["decorated function บอกชื่อตัวเองว่า `wrapper`", "ลืม `functools.wraps`"],
        ["`UnboundLocalError` ทั้งที่ฟังก์ชันรอบนอกตั้งค่าไว้แล้ว", "ฟังก์ชันข้างในเขียนทับมัน จึงกลายเป็นตัวแปรท้องถิ่น เติม `nonlocal`"],
        ["F811 redefinition of unused '_'", "implementation ของ `singledispatch` หลายตัวใช้ชื่อ `_` เหมือนกัน ตั้งชื่อแยก"],
        ["`bool` เข้าไปที่ implementation ของ `int`", "ถูกแล้ว — `bool` เป็นซับคลาสของ `int`"],
        ["`mypy --strict` บ่นเรื่อง `Callable` เปล่า", "ประกาศ alias เช่น `Spell = Callable[[str, int], str]`"]
      ]}},
      { h: "หลักที่ใช้ได้ทันที" },
      { ul: [
        "`sys.prefix != sys.base_prefix` เท่านั้น สำหรับตรวจ venv — ตัวแปรสภาพแวดล้อมโกหกได้ทั้งสองทาง",
        "**อย่าพิมพ์ secret แม้แต่แบบปิดบัง** — รายงานความยาวก็พอสำหรับ debug และไร้ประโยชน์สำหรับคนอ่าน log",
        "`.env` เข้า `.gitignore` ตั้งแต่ commit แรก — secret ที่เข้าไปใน git history แล้วถือว่าหลุด ต่อให้ลบทีหลัง เพราะ commit เก่ายังมีมันอยู่ ทางแก้จริงคือเปลี่ยนกุญแจ",
        "**ตรวจข้อมูลที่ขอบ** — โมเดล Pydantic ที่ขอบเดียวช่วยให้โค้ดที่เหลือไม่ต้องเช็กอะไรอีก",
        "`Callable` เอาจาก `collections.abc` ไม่ใช่ `typing` และ `callable()` คือคนละเรื่อง — มันคือ builtin ที่เช็กค่าจริงตอน runtime",
        "`lambda` สำหรับ expression ที่ส่งเข้า `sorted`/`map`/`filter` ตรง ๆ, `def` สำหรับอย่างอื่น — สิ่งที่ควรมีชื่อ ควรมีชื่อ"
      ]}
    ],

    eval: [
      { qa: [
        { q: "virtual environment ทำงานยังไง", a: "มันคือไดเรกทอรีที่มี `pyvenv.cfg`, ลิงก์ไปยัง interpreter ตัวจริง และ `site-packages` ของตัวเอง ผลคือ `sys.prefix` ชี้ไปที่ไดเรกทอรีนั้นในขณะที่ `sys.base_prefix` ยังชี้ไปที่ Python ตัวจริง การ import จึงไปหาไลบรารีคนละที่ ไม่มีการแยกโปรเซสและไม่มี interpreter ตัวใหม่" },
        { q: "ทำไมไม่ควรใช้ `VIRTUAL_ENV` ตรวจ", a: "เพราะสคริปต์ activate เป็นคนตั้งค่ามัน ถ้าเรียก `.venv/bin/python` ด้วยพาธเต็มโดยไม่ activate ตัวแปรจะว่าง ทั้งที่อยู่ใน venv จริง และหลัง deactivate มันอาจค้างอยู่ ทั้งสองกรณี `sys.prefix` ตอบถูก" },
        { q: "pip กับ Poetry ต่างกันอย่างไร", a: "pip ติดตั้งตามรายการใน `requirements.txt` ทีละตัว เวอร์ชันที่ชนกันจะได้ผลตามลำดับการติดตั้ง ส่วน Poetry แก้กราฟพึ่งพาทั้งก้อนก่อน ปฏิเสธชุดที่อยู่ร่วมกันไม่ได้ และเขียนเวอร์ชันที่แก้ได้ลง `poetry.lock` ทำให้เครื่องถัดไปได้ชุดเดียวกัน" },
        { q: "ทำไม `.env` ต้องอยู่ใน `.gitignore`", a: "เพราะมันเก็บค่าจริงของ secret และ secret ที่เข้าไปอยู่ใน git history ถือว่าถูกเปิดเผยแล้วแม้จะลบทีหลัง เพราะ commit เก่ายังมีมันและใครที่ clone ไปแล้วก็มีอยู่ ทางแก้จริงคือหมุนกุญแจใหม่ ส่วน `.env.example` ถูก commit เพราะมันบอกแค่ว่าต้องตั้งตัวแปรอะไรบ้าง" },
        { q: "Pydantic จัดการ nested model อย่างไร", a: "มันตรวจโมเดลชั้นในก่อน และแปลง dict ในลิสต์ให้เป็นวัตถุจริง ถ้าสมาชิกคนหนึ่งไม่ผ่าน validator ของโมเดลชั้นนอกจะไม่ถูกเรียกเลย เพราะไม่มีโมเดลที่ถูกต้องให้ตรวจ error ที่ได้จะบอกพาธเช่น `crew.1.age`" },
        { q: "`@model_validator(mode=\"after\")` ต่างจาก `mode=\"before\"` ยังไง", a: "`after` ทำงานหลังทุกฟิลด์ถูกแปลงและตรวจแล้ว จึงได้ `self` ที่มีชนิดจริง เหมาะกับกฎที่เกี่ยวข้องหลายฟิลด์ ส่วน `before` ได้ dict ดิบ เหมาะกับการเปลี่ยนรูปหรือเปลี่ยนชื่อคีย์ก่อนตรวจ" },
        { q: "closure ทำให้ฟังก์ชัน 'จำ' สภาพแวดล้อมได้อย่างไร", a: "ฟังก์ชันข้างในเก็บการอ้างอิงไปยัง cell ที่ถือตัวแปรของฟังก์ชันข้างนอก ตัวแปรจึงไม่หายไปเมื่อฟังก์ชันข้างนอกคืนค่า และเพราะแต่ละการเรียกสร้าง cell ใหม่ ตัวนับสองตัวจึงมีสถานะแยกกัน" },
        { q: "ทำไม `global` ถูกห้ามแต่ `nonlocal` ไม่", a: "`nonlocal` เอื้อมถึงฟังก์ชันที่ห่ออยู่หนึ่งชั้น สถานะจึงเป็นของ closure นั้นเท่านั้น ส่วน `global` เอื้อมถึงสถานะระดับโมดูลที่ทุกฟังก์ชันในโปรแกรมแชร์กัน ซึ่งคือการผูกติดที่ทำให้โปรแกรมทดสอบยากและแก้ยาก" },
        { q: "`functools.wraps` จำเป็นตรงไหน", a: "มันคัดลอก `__name__`, `__doc__`, `__module__` และ `__wrapped__` จากฟังก์ชันเดิมมาไว้ที่ตัวห่อ ถ้าไม่มี ฟังก์ชันที่ถูก decorate จะรายงานตัวเองว่าชื่อ `wrapper`, `help()` ไม่แสดงอะไร และ decorator ที่พิมพ์ชื่อฟังก์ชันจะพิมพ์ผิดทุกครั้ง" },
        { q: "`lru_cache` ให้ประโยชน์ด้านประสิทธิภาพอย่างไร", a: "มันเก็บผลลัพธ์ตามอาร์กิวเมนต์ สำหรับ fibonacci แบบ recursive ธรรมดา การคำนวณซ้ำของ subtree เดียวกันคือที่มาของความซับซ้อนแบบเลขชี้กำลังทั้งหมด พอไม่คำนวณซ้ำ แต่ละ n ถูกประเมินครั้งเดียว ความซับซ้อนจึงกลายเป็นเชิงเส้น — เปลี่ยนคลาสของปัญหา ไม่ใช่แค่ค่าคงที่" }
      ]}
    ]
  }
});

window.TEACHING_DATA.push({
  id: "amaze",
  name: "A-Maze-ing",
  tag: {
    th: "สร้างเขาวงกตสมบูรณ์แบบด้วย Python — perfect maze คือ spanning tree, เก็บกำแพงเป็นบิต, DFS แบบวนลูปเพื่อไม่ชน recursion limit, แล้วแพ็กเป็น wheel ติดตั้งได้",
    en: "Generate perfect mazes in Python — a perfect maze is a spanning tree, walls stored as bits, an iterative DFS that cannot hit the recursion limit, packaged as an installable wheel"
  },
  accent: "#ec4899",
  sections: {
    principle: [
      { h: "perfect maze คืออะไร" },
      { p: "**เขาวงกตสมบูรณ์แบบ** คือเขาวงกตที่ทุกช่องเดินถึงกันได้ และระหว่างช่องสองช่องใด ๆ มี **ทางเดียวเท่านั้น** — ไม่มีวงรอบ ไม่มีพื้นที่ตัดขาด" },
      { note: "**นิยามนี้เท่ากับ spanning tree ของกราฟตาราง** ทุกตัว ห้องคือ node กำแพงที่ถูกทุบคือ edge ตารางขนาด `w × h` มีห้อง `w·h` ห้อง ดังนั้น spanning tree มี edge เท่ากับ `w·h − 1` เป๊ะ ๆ" },
      { p: "ผลที่ตามมาคือ **เทสต์ที่ตรวจได้จริง**: นับจำนวนกำแพงที่ถูกทุบ ต้องเท่ากับ `w·h − 1` และรัน BFS หนึ่งครั้งจากมุมหนึ่ง ต้องไปถึงทุกห้อง สองข้อนี้รวมกันพิสูจน์ว่าเป็น perfect maze โดยไม่ต้องดูภาพ" },
      { h: "สิ่งที่ต้องส่ง" },
      { table: { head: ["ไฟล์", "หน้าที่"], rows: [
        ["`a_maze_ing.py`", "โปรแกรมหลัก อ่าน argument และไฟล์ config"],
        ["`render.py`", "แปลงตารางเป็นข้อความ"],
        ["`mazegen/`", "package ของอัลกอริทึม พร้อม `__init__.py`"],
        ["`config.txt`", "ค่าตั้งต้นที่โปรแกรมอ่านได้"],
        ["`Makefile`", "`install`, `run`, `debug`, `clean`, `lint`"],
        ["`pyproject.toml`", "ทำให้ `mazegen` แพ็กเป็น wheel ติดตั้งได้"]
      ]}},
      { p: "กฎกลางของซีรีส์ Python ใช้ที่นี่ทั้งหมด — flake8 79 คอลัมน์, type hint ครบ, ห้าม traceback ดูหน้า **Python Modules 00–04** สำหรับรายละเอียด" }
    ],

    theory: [
      { h: "เก็บกำแพงเป็นบิต" },
      { p: "แต่ละห้องมีกำแพงสี่ด้าน เก็บเป็นตัวเลขตัวเดียวได้ด้วยการให้แต่ละด้านเป็นหนึ่งบิต:" },
      { table: { head: ["ทิศ", "บิต", "ค่า"], rows: [
        ["North", "0", "1"], ["East", "1", "2"], ["South", "2", "4"], ["West", "3", "8"]
      ]}},
      { code: String.raw`N, E, S, W = 1, 2, 4, 8
OPPOSITE = {N: S, S: N, E: W, W: E}

# ห้องเริ่มต้นมีกำแพงครบสี่ด้าน
grid = [[N | E | S | W] * width for _ in range(height)]

# ทุบกำแพงระหว่างสองห้อง — ต้องทุบทั้งสองฝั่ง
grid[y][x] &= ~direction
grid[ny][nx] &= ~OPPOSITE[direction]`,
        cap: "หนึ่ง int ต่อหนึ่งห้อง", lang: "python" },
      { note: "**กำแพงต้องถูกทุบทั้งสองฝั่งเสมอ** — ถ้าทุบข้างเดียว ห้อง A จะบอกว่าไปหา B ได้ แต่ B บอกว่ากลับมาไม่ได้ ตัว render จะวาดเขาวงกตที่ขัดแย้งกับตัวเอง เทสต์ที่จับข้อนี้คือการไล่ทุกคู่ห้องที่ติดกันแล้วยืนยันว่าสถานะกำแพงตรงกัน" },
      { h: "ทำไมต้อง DFS แบบวนลูป" },
      { p: "อัลกอริทึมมาตรฐานคือ **recursive backtracker**: สุ่มเดินลึกเข้าไปเรื่อย ๆ ทุบกำแพงที่ผ่าน เมื่อเจอทางตันก็ถอยกลับ ปัญหาคือถ้าเขียนแบบ recursive จริง ๆ ความลึกของ stack จะเท่ากับความยาวเส้นทางที่ยาวที่สุด — ตารางขนาด 100×100 ทำให้ชน `RecursionError` ได้" },
      { code: String.raw`stack = [(0, 0)]
visited = {(0, 0)}
while stack:
    x, y = stack[-1]
    neighbours = [d for d in (N, E, S, W)
                  if in_bounds(step(x, y, d)) and step(x, y, d) not in visited]
    if not neighbours:
        stack.pop()               # ทางตัน — ถอย
        continue
    direction = rng.choice(neighbours)
    nx, ny = step(x, y, direction)
    grid[y][x] &= ~direction
    grid[ny][nx] &= ~OPPOSITE[direction]
    visited.add((nx, ny))
    stack.append((nx, ny))`,
        cap: "stack ที่จับต้องได้ แทน call stack ของ Python", lang: "python" },
      { p: "โครงเดียวกัน ผลลัพธ์เดียวกัน แต่ความลึกไปอยู่ใน list ที่โตได้ตามหน่วยความจำ แทนที่จะจำกัดที่ 1000 เฟรม" },
      { h: "การสุ่มที่ทำซ้ำได้" },
      { p: "ใช้ `random.Random(seed)` เป็นอ็อบเจกต์ของตัวเอง **ไม่ใช่** `random.seed()` ระดับโมดูล — อย่างหลังเปลี่ยนสถานะร่วมของทั้งโปรแกรม ทำให้โค้ดส่วนอื่นที่สุ่มด้วยได้ผลเปลี่ยนไปด้วย" },
      { code: String.raw`rng = random.Random(seed)          # สถานะของเราเอง
# seed เดียวกัน + ขนาดเดียวกัน = เขาวงกตเดิมเป๊ะ ทุกครั้ง`,
        cap: "seed คือสิ่งที่ทำให้เทสต์เชื่อถือได้", lang: "python" }
    ],

    architecture: [
      { h: "แยกอัลกอริทึมออกจากการแสดงผล" },
      { code: String.raw`a_maze_ing.py          # อ่าน argument, อ่าน config, เรียกทั้งสองส่วน
render.py              # grid -> ข้อความ (ไม่รู้จักอัลกอริทึม)
mazegen/
|-- __init__.py        # เปิดเฉพาะ generate() กับค่าคงที่ทิศ
'-- generator.py       # DFS แบบวนลูป (ไม่รู้จักการวาด)
config.txt
pyproject.toml
Makefile`,
        cap: "generator ไม่เคยเห็นตัวอักษร render ไม่เคยเห็นบิต", lang: "text" },
      { p: "การแยกนี้ไม่ใช่แค่ความสวยงาม — มันคือสิ่งที่ทำให้ **เทสต์อัลกอริทึมได้โดยไม่ต้อง parse ข้อความ** เทสต์เรียก `generate()` แล้วตรวจกราฟตรง ๆ" },
      { h: "แพ็กเป็น wheel" },
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
python3 -c "import mazegen; print(mazegen.generate(3, 3, seed=1))"`,
        cap: "พิสูจน์ว่ามันติดตั้งได้จริง ไม่ใช่แค่ import จากโฟลเดอร์เดียวกัน", lang: "bash" },
      { note: "การทดสอบที่สำคัญคือ **ติดตั้งแล้วรันจากไดเรกทอรีอื่น** — ถ้ามันยัง import ได้ แปลว่า package ถูกต้อง ไม่ได้อาศัยการบังเอิญอยู่ใน cwd" }
    ],

    dataflow: [
      { h: "จากบิตเป็นภาพ" },
      { p: "การวาดใช้กฎง่าย ๆ ข้อเดียว: ห้องหนึ่งวาดขอบ **บน** กับ **ซ้าย** ของตัวเอง แล้วปิดท้ายทั้งแถวและทั้งตารางด้วยขอบขวาและขอบล่าง ทำให้ไม่มีเส้นไหนถูกวาดซ้ำ" },
      { code: String.raw`+---+---+---+
|           |     ห้อง (0,0) ไม่มีกำแพง E จึงไม่มี | คั่น
+---+   +---+
|   |       |
+   +---+   +
|           |
+---+---+---+`,
        cap: "ผลลัพธ์ของ render", lang: "text" },
      { h: "เส้นทางของข้อมูลทั้งโปรแกรม" },
      { table: { head: ["ขั้น", "อินพุต", "เอาต์พุต"], rows: [
        ["อ่าน config", "`config.txt` + argument", "`width`, `height`, `seed`"],
        ["ตรวจค่า", "ตัวเลขที่อาจเป็นอะไรก็ได้", "ค่าที่ใช้ได้ หรือข้อความ error ที่อ่านรู้เรื่อง"],
        ["generate", "`w`, `h`, `seed`", "`list[list[int]]` — บิตกำแพง"],
        ["render", "ตาราง", "สตริงหลายบรรทัด"]
      ]}},
      { p: "**argument ชนะ config เสมอ** — เป็นแบบแผนเดียวกับ environment variable ที่ชนะ `.env` ในโมดูล 08 คือสิ่งที่เจาะจงกว่าและอยู่ใกล้ผู้ใช้กว่าเป็นฝ่ายชนะ" },
      { h: "ค่าที่ต้องปฏิเสธให้ได้" },
      { table: { head: ["อินพุต", "ต้องเกิดอะไร"], rows: [
        ["`0` หรือค่าติดลบ", "ข้อความ error ไม่ใช่ตารางว่างหรือ traceback"],
        ["`1 × 1`", "ถูกต้อง — ห้องเดียว กำแพงถูกทุบ 0 อัน (`1·1 − 1`)"],
        ["`1 × 50`", "ถูกต้อง — เขาวงกตแถวเดียวยังเป็น spanning tree"],
        ["ไม่ใช่ตัวเลข", "error ที่บอกว่าค่าไหนผิด"],
        ["ใหญ่มาก เช่น `200 × 200`", "ต้องไม่ `RecursionError` — นี่คือเหตุผลของ DFS วนลูป"],
        ["`config.txt` หาย หรือรูปแบบเพี้ยน", "ใช้ค่า default แล้วบอก ไม่ใช่พัง"]
      ]}}
    ],

    implementation: [
      { h: "เทสต์ที่พิสูจน์ perfect maze ด้วยคณิตศาสตร์" },
      { code: String.raw`def edges_removed(grid: list[list[int]]) -> int:
    """นับกำแพงที่ถูกทุบ นับคู่ละครั้ง"""
    total = 0
    for y, row in enumerate(grid):
        for x, cell in enumerate(row):
            if not cell & E and x + 1 < len(row):
                total += 1
            if not cell & S and y + 1 < len(grid):
                total += 1
    return total


def reachable(grid: list[list[int]]) -> int:
    """BFS จาก (0,0) นับห้องที่ไปถึง"""
    seen = {(0, 0)}
    queue = [(0, 0)]
    while queue:
        x, y = queue.pop()
        for direction, (dx, dy) in ((N, (0, -1)), (E, (1, 0)),
                                    (S, (0, 1)), (W, (-1, 0))):
            if grid[y][x] & direction:
                continue                       # ยังมีกำแพงกั้น
            spot = (x + dx, y + dy)
            if spot not in seen:
                seen.add(spot)
                queue.append(spot)
    return len(seen)


for width, height in ((1, 1), (1, 9), (9, 1), (13, 7), (40, 40)):
    grid = generate(width, height, seed=7)
    assert edges_removed(grid) == width * height - 1   # เป็นต้นไม้
    assert reachable(grid) == width * height           # และเชื่อมกันหมด`,
        cap: "สองบรรทัดสุดท้ายคือคำนิยามของ perfect maze", lang: "python" },
      { p: "ต้นไม้ทอดข้ามต้องเป็นทั้ง 'ไม่มีวงรอบ' และ 'เชื่อมถึงกันหมด' — จำนวน edge ที่เท่ากับ `n − 1` ให้ข้อแรก และ BFS ที่ไปถึงครบให้ข้อที่สอง มีทั้งคู่แล้วไม่ต้องตรวจอะไรอีก" },
      { h: "เทสต์สามชั้นของโปรเจกต์นี้" },
      { table: { head: ["ชั้น", "ตรวจอะไร"], rows: [
        ["**NORMAL**", "ขนาดปกติสร้างได้ ภาพที่วาดมีจำนวนบรรทัดถูกต้อง `Makefile` ทุก target ทำงาน"],
        ["**EXTREME**", "`1×1`, `1×n`, `n×1`, ค่าศูนย์และติดลบ, `config.txt` หาย, ค่าที่ไม่ใช่ตัวเลข, argument ทับ config"],
        ["**HARDCORE**", "คุณสมบัติ spanning tree ทุกขนาด, กำแพงตรงกันทั้งสองฝั่ง, seed เดิมได้ผลเดิม, seed ต่างได้ผลต่าง, `200×200` ไม่ชน recursion limit, wheel ติดตั้งแล้ว import ได้จากไดเรกทอรีอื่น, flake8 กับ `mypy --strict`"]
      ]}},
      { code: String.raw`# seed เดิมต้องได้เขาวงกตเดิม และ seed ต่างต้องไม่ได้อันเดิม
assert generate(20, 20, seed=42) == generate(20, 20, seed=42)
assert generate(20, 20, seed=42) != generate(20, 20, seed=43)

# กำแพงต้องตรงกันทั้งสองฝั่ง ทุกคู่ที่ติดกัน
for y in range(height):
    for x in range(width - 1):
        assert bool(grid[y][x] & E) == bool(grid[y][x + 1] & W)`,
        cap: "สองเทสต์ที่จับบั๊กได้จริงมากที่สุด", lang: "python" }
    ],

    tricks: [
      { h: "อาการ → สาเหตุ" },
      { table: { head: ["อาการ", "สาเหตุ"], rows: [
        ["`RecursionError` ตอนตารางใหญ่", "เขียน DFS แบบ recursive จริง ใช้ stack ที่จับต้องได้แทน"],
        ["เขาวงกตมีวงรอบ", "ทุบกำแพงไปหาห้องที่ `visited` แล้ว — เช็ก visited ก่อนเลือกเพื่อนบ้าน"],
        ["มีห้องที่เข้าไม่ถึง", "จำนวน edge ไม่ถึง `n−1` มักเกิดจากการ `pop` ออกจาก stack เร็วเกินไป"],
        ["ภาพที่วาดขัดแย้งกันเอง", "ทุบกำแพงข้างเดียว ลืมฝั่งตรงข้าม"],
        ["ทุกแถวเหมือนกันหมด", "`grid = [[15] ‘ w] ’ h` — แถวทั้งหมดเป็นลิสต์เดียวกัน ต้องใช้ list comprehension"],
        ["seed เดิมได้ผลไม่เหมือนเดิม", "ใช้ `random.seed()` ระดับโมดูล ซึ่งโดนโค้ดอื่นแทรกได้ ใช้ `random.Random(seed)` ของตัวเอง"],
        ["`import mazegen` ไม่ได้หลังติดตั้ง", "`pyproject.toml` ไม่ได้ระบุ package หรือลืม `__init__.py`"],
        ["`make` ฟ้อง `missing separator`", "บรรทัดคำสั่งใช้ space ไม่ใช่ tab"]
      ]}},
      { h: "ทริคที่ควรจำ" },
      { ul: [
        "`[[0] * w for _ in range(h)]` เท่านั้น — `[[0] ‘ w] ’ h` สร้างแถวเดียวที่ถูกอ้างถึง h ครั้ง เป็นบั๊กที่ตรวจยากเพราะมันดูถูกตอนพิมพ์",
        "เก็บ `visited` เป็น set ของ tuple ไม่ใช่การสแกนตาราง — การเช็กสมาชิกของ set เป็น O(1)",
        "เขียน `OPPOSITE` เป็น dict แทนการคำนวณด้วยเลขคณิตบิต — อ่านง่ายกว่าและผิดยากกว่า",
        "ให้ `generate()` คืนตารางเปล่า ๆ ไม่ใช่คลาส — เทสต์เปรียบเทียบสองตารางด้วย `==` ได้เลย",
        "**ตรวจอินพุตที่ขอบเดียว** คือตอนอ่าน argument กับ config แล้วส่วนที่เหลือของโปรแกรมไม่ต้องเช็กอะไรอีก"
      ]}
    ],

    eval: [
      { qa: [
        { q: "perfect maze คืออะไร และเกี่ยวอะไรกับ spanning tree", a: "perfect maze คือเขาวงกตที่ทุกช่องถึงกันได้และมีทางเดียวระหว่างช่องสองช่องใด ๆ ซึ่งคือคำนิยามของต้นไม้บนกราฟ ห้องคือ node กำแพงที่ถูกทุบคือ edge ตารางที่มี n ห้องจึงต้องมี edge เท่ากับ n−1 พอดี และ BFS ครั้งเดียวต้องไปถึงทุกห้อง" },
        { q: "ทำไมถึงเลือก DFS แบบวนลูปแทน recursive", a: "เพราะความลึกของการเรียกเท่ากับความยาวเส้นทางที่ยาวที่สุด ตารางขนาดร้อยคูณร้อยจึงชน recursion limit ที่ 1000 ได้ การย้าย stack มาไว้ใน list ทำให้ความลึกถูกจำกัดด้วยหน่วยความจำแทน โดยที่อัลกอริทึมเหมือนเดิมทุกอย่าง" },
        { q: "ทำไมเก็บกำแพงเป็นบิตแทนที่จะเก็บเป็น boolean สี่ตัว", a: "หนึ่ง int ต่อหนึ่งห้องทำให้ตารางเปรียบเทียบกันด้วย `==` ได้ทันที คัดลอกง่าย และการทุบกำแพงเป็นการดำเนินการบิตครั้งเดียว ที่สำคัญกว่าคือมันทำให้เทสต์เขียนสั้น เพราะสถานะทั้งห้องเป็นค่าเดียว" },
        { q: "ทำไมต้องทุบกำแพงทั้งสองฝั่ง", a: "เพราะห้องสองห้องเก็บกำแพงระหว่างกันคนละชุด ถ้าทุบข้างเดียว ห้อง A จะบอกว่าเดินไป B ได้ แต่ B จะบอกว่ากลับมาไม่ได้ ตัววาดและตัวเดินทางจะเห็นเขาวงกตคนละอัน" },
        { q: "seed มีไว้ทำไม และทำไมไม่ใช้ `random.seed()`", a: "seed ทำให้ผลลัพธ์ทำซ้ำได้ ซึ่งจำเป็นทั้งกับเทสต์และกับการอธิบายบั๊ก ส่วน `random.seed()` เปลี่ยนสถานะร่วมของทั้งโปรแกรม โค้ดส่วนอื่นที่สุ่มด้วยจะได้ผลเปลี่ยนไปด้วย การใช้ `random.Random(seed)` เป็นอ็อบเจกต์ของตัวเองทำให้สถานะเป็นของเราคนเดียว" },
        { q: "ทำไมต้องแยก `mazegen` ออกเป็น package", a: "เพื่อให้อัลกอริทึมถูกทดสอบและนำไปใช้ได้โดยไม่ต้องพึ่งการวาดหรือการอ่าน argument และเพื่อให้แพ็กเป็น wheel ติดตั้งลงสภาพแวดล้อมอื่นได้จริง การ import ได้จากไดเรกทอรีอื่นคือหลักฐานว่ามันเป็น package จริง ไม่ใช่ไฟล์ที่บังเอิญอยู่ข้าง ๆ" }
      ]}
    ]
  }
});
