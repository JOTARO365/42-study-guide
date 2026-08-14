/* เนื้อหาเชิงลึกของหน้าสาย Python — ต่อท้าย section ที่มีอยู่แล้ว
   เขียนจาก skill python-modules-42 และจากโค้ดที่ทำโปรเจคจริง */
(function () {

  var TH = {
    py_series: {
      theory: [
        { h: "Module 00 — คู่แฝดวนลูปกับเรียกซ้ำ" },
        { p: "ข้อ 6 ขอสองฟังก์ชันที่พิมพ์ผลลัพธ์ **เหมือนกันทุกตัวอักษร** นี่คือแบบฝึกหัดที่สอนว่าอัลกอริทึมเดียวกันเขียนได้สองรูป และรูปไหนเหมาะกับอะไร" },
        { code: String.raw`def ft_count_harvest_iterative() -> None:
    """นับจาก 1 ถึงวันเก็บเกี่ยว ด้วยลูป"""
    days = int(input("Days until harvest: "))
    day = 1
    while day <= days:
        print(f"Day {day}")
        day += 1
    print("Harvest time!")`,
          cap: "ex6 แบบวนลูป — สถานะอยู่ในตัวแปร day", lang: "python" },
        { code: String.raw`def _count_from(day: int, last: int) -> None:
    """ฟังก์ชันช่วย: พิมพ์ตั้งแต่ day ถึง last — โจทย์อนุญาตชัดเจน"""
    if day > last:
        return
    print(f"Day {day}")
    _count_from(day + 1, last)


def ft_count_harvest_recursive() -> None:
    """หน้าตาเหมือนคู่แฝดทุกอย่าง ต่างแค่วิธีนับ"""
    days = int(input("Days until harvest: "))
    _count_from(1, days)
    print("Harvest time!")`,
          cap: "ex6 แบบเรียกซ้ำ — สถานะอยู่ใน call stack", lang: "python" },
        { table: { head: ["ทางเลือกของการเรียกซ้ำ", "ข้อดี", "ข้อเสีย"], rows: [
          ["ฟังก์ชันช่วยแยกต่างหาก", "ฟังก์ชันสาธารณะมีลายเซ็นเหมือนคู่แฝดเป๊ะ", "มีชื่อเพิ่มมาในไฟล์หนึ่งชื่อ"],
          ["ฟังก์ชันซ้อนข้างใน", "ไม่มีชื่อรั่วออกนอก", "อ่านยากขึ้นเล็กน้อย"],
          ["ค่าเริ่มต้นของพารามิเตอร์", "สั้นที่สุด", "ลายเซ็นสาธารณะเพี้ยนไปจากคู่แฝด และเปิดช่องให้ผู้เรียกส่งค่าแปลก ๆ"]
        ]}},
        { note: "ทั้งสามแบบโจทย์ยอมรับหมด แต่แบบแรกทำให้ **ลายเซ็นของสองฟังก์ชันเหมือนกันจริง** ซึ่งเป็นสิ่งที่ผู้ตรวจเทียบ และเป็นสิ่งที่เทสต์เทียบได้ง่ายที่สุด" },
        { p: "ขอบที่ต้องลอง: `0` ต้องไม่พิมพ์วันเลยแล้วขึ้น Harvest time ทันที และ `1` ต้องพิมพ์วันเดียว ถ้าเขียน `while day < days` แทน `<=` จะพลาดทั้งสองกรณี" },

        { h: "Module 01 — คลาสเดียวที่โตขึ้นเจ็ดข้อ" },
        { p: "เจ็ดข้อของโมดูลนี้ไม่ใช่เจ็ดโจทย์แยกกัน แต่คือ **คลาสเดียวที่ถูกปรับปรุงเจ็ดรอบ** ไล่ดูทีละรอบแล้วจะเห็นว่าแต่ละรอบแก้ปัญหาอะไรของรอบก่อน" },
        { code: String.raw`# ex1 — เก็บข้อมูลด้วยแอตทริบิวต์ แทนที่จะมีตัวแปรลอย ๆ สามชุด
class Plant:
    """ต้นไม้หนึ่งต้น"""

    def __init__(self, name: str, height: float, days_old: int) -> None:
        self.name = name
        self.height = height
        self.days_old = days_old

    def show(self) -> None:
        print(f"{self.name}: {self.height}cm, {self.days_old} days")`,
          cap: "ปัญหาที่แก้: ข้อมูลของต้นไม้สามต้นเคยอยู่กระจัดกระจาย", lang: "python" },
        { code: String.raw`# ex2 — ให้ต้นไม้ทำอะไรเองได้ พฤติกรรมย้ายมาอยู่กับข้อมูล
    def grow(self) -> None:
        """โตขึ้นตามอัตราของต้นไม้ต้นนี้"""
        self.height = round(self.height + self.growth_rate, 1)

    def age(self) -> None:
        """แก่ขึ้นหนึ่งวัน"""
        self.days_old += 1`,
          cap: "ปัญหาที่แก้: เดิมต้องมีฟังก์ชันนอกคลาสที่รับต้นไม้เข้าไปแก้", lang: "python" },
        { note: "**ชื่อชนกันตรงนี้** โจทย์ตั้งชื่อเมธอดว่า `age()` ถ้าตัวนับวันเป็นแอตทริบิวต์สาธารณะชื่อ `age` ด้วย ทั้งสองจะทับกันและ mypy ฟ้อง `Cannot assign to a method` — ใช้ `days_old` ไปก่อน แล้วค่อยเป็น `_age` ตอนข้อ 4" },
        { code: String.raw`# ex4 — ปิดข้อมูล และตรวจค่าก่อนเก็บ
class Plant:
    def __init__(self, name: str, height: float, age: int) -> None:
        self._name = name
        self._height = 0.0
        self._age = 0
        self.set_height(height)      # ผ่านการตรวจตั้งแต่ตอนสร้าง
        self.set_age(age)

    def set_height(self, height: float) -> None:
        """ตั้งความสูง ปฏิเสธค่าติดลบโดยไม่แตะของเดิม"""
        if height < 0:
            print(f"Error: height {height} is negative, keeping "
                  f"{self._height}")
            return
        self._height = height

    def get_height(self) -> float:
        return self._height`,
          cap: "ปัญหาที่แก้: ใครก็เขียน plant.height = -5 ได้", lang: "python" },
        { p: "จุดที่คนพลาดคือ **สร้างด้วยค่าที่ผิดแล้วผ่าน** — ถ้า `__init__` เขียน `self._height = height` ตรง ๆ การตรวจจะมีผลเฉพาะตอนเรียก setter ทีหลัง วิธีข้างบนให้ constructor เดินผ่าน setter เอง กฎจึงมีที่เดียว" },
        { code: String.raw`# ex5 — สืบทอด และ show() ที่ต่อยอดของแม่
class Flower(Plant):
    def __init__(self, name: str, height: float, age: int,
                 colour: str) -> None:
        super().__init__(name, height, age)   # ให้แม่ตั้งค่าส่วนของแม่
        self._colour = colour

    def bloom(self) -> str:
        return f"{self._name} blooms in {self._colour}"

    def show(self) -> None:
        super().show()                        # บรรทัดของแม่ก่อน
        print(f"Colour: {self._colour}")      # แล้วค่อยเติมของตัวเอง`,
          cap: "การก็อป print ของแม่มาไว้ในลูกคือสิ่งที่ถูกหักคะแนน", lang: "python" },
        { code: String.raw`# ex6 — คลาสซ้อน, static method, class method
class Plant:
    class Stats:
        """สถิติของต้นไม้หนึ่งต้น — ไม่มีความหมายนอก Plant"""

        def __init__(self) -> None:
            self._grow_calls = 0
            self._age_calls = 0
            self._show_calls = 0

        def display(self) -> None:
            print(f"grow={self._grow_calls} age={self._age_calls} "
                  f"show={self._show_calls}")

    def __init__(self, name: str, height: float, age: int) -> None:
        ...
        self._stats = self.Stats()     # <- self.Stats ไม่ใช่ Plant.Stats

    @staticmethod
    def is_older_than_a_year(days: int) -> bool:
        """มองแค่ตัวเลขที่ได้รับ ไม่ได้มองต้นไม้ต้นไหน"""
        return days > 365

    @classmethod
    def anonymous(cls) -> "Plant":
        """cls คือหัวใจ — Flower.anonymous() ต้องคืน Flower"""
        return cls("Unknown plant", 0.0, 0)`,
          cap: "สามแนวคิดในไฟล์เดียว", lang: "python" },
        { note: "**ทริคที่ควรเก็บไว้** ถ้า `__init__` สร้างสถิติด้วย `self.Stats()` แทน `Plant.Stats()` แล้ว `Tree` ที่นิยาม `Stats` ของตัวเองจะได้ตัวนับที่ถูกต้องอัตโนมัติ เพราะการค้นหาแอตทริบิวต์วิ่งผ่านคลาสของอินสแตนซ์ ไม่ต้องมี registry ไม่ต้องมีโซ่ `isinstance`" },
        { code: String.raw`def display_stats(plant: Plant) -> None:
    """ฟังก์ชันเดียวใช้ได้กับต้นไม้ทุกชนิด"""
    plant.get_stats().display()`,
          cap: "polymorphism ทำงานแทนการเช็กชนิด — ข้อสุดท้ายของโมดูลขอสิ่งนี้", lang: "python" },

        { h: "Module 02 — ลำดับชั้นของ exception" },
        { p: "สิ่งที่โมดูลนี้สอนจริง ๆ ไม่ใช่ไวยากรณ์ `try` แต่คือ **ใครควรจับอะไร** ฟังก์ชันชั้นในโยนสิ่งที่มันรู้ ฟังก์ชันชั้นนอกจับสิ่งที่มันจัดการได้ และไม่มีใครจับสิ่งที่ตัวเองแก้ไม่ได้" },
        { code: String.raw`class GardenError(Exception):
    """ปัญหาของสวน — ฐานของทุกตัว"""

    def __init__(self, message: str = "Unknown garden error") -> None:
        super().__init__(message)


class PlantError(GardenError):
    """ปัญหาของต้นไม้"""

    def __init__(self, message: str = "Unknown plant error") -> None:
        super().__init__(message)


class WaterError(GardenError):
    """ปัญหาของการรดน้ำ"""

    def __init__(self, message: str = "Unknown water error") -> None:
        super().__init__(message)`,
          cap: "ค่าเริ่มต้นส่งผ่าน super() เพื่อให้ str(error) ยังใช้ได้", lang: "python" },
        { code: String.raw`try:
    register_plant(name)
except PlantError as error:
    print(f"Caught PlantError: {error}")      # จับเฉพาะเจาะจง

try:
    run_garden()
except GardenError as error:
    print(f"Caught GardenError: {error}")     # จับทั้งตระกูลด้วยตัวแม่`,
          cap: "การสืบทอดคือสิ่งที่ทำให้จับเป็นกลุ่มได้", lang: "python" },
        { table: { head: ["เขียนแบบนี้", "เกิดอะไร"], rows: [
          ["`except ValueError:`", "จับสิ่งที่รู้ว่าเกิดได้ — ถูกต้อง"],
          ["`except (ValueError, TypeError):`", "จับสองอย่างที่จัดการเหมือนกัน — ถูกต้อง"],
          ["`except GardenError:`", "จับทั้งตระกูลที่เราสร้างเอง — ถูกต้อง"],
          ["`except Exception:`", "กลืนบั๊กของตัวเองไปด้วย — ต้องมีเหตุผลเขียนกำกับ"],
          ["`except:`", "จับแม้กระทั่ง Ctrl+C และ SystemExit — เกือบไม่มีเหตุผลใดที่ถูกต้อง"]
        ]}},
        { code: String.raw`def water_plant(plant_name: str) -> None:
    """รดน้ำ แล้วเก็บกวาดเสมอไม่ว่าจะสำเร็จหรือไม่"""
    print(f"Opening water valve for {plant_name}")
    try:
        if plant_name != plant_name.capitalize():
            raise PlantError(f"{plant_name} is not a proper plant name")
        print(f"{plant_name} watered successfully")
    finally:
        print("Closing water valve")     # ทำงานทั้งตอนสำเร็จและตอนโยน`,
          cap: "finally คือที่ของการคืนทรัพยากร ไม่ใช่ที่ของการรายงานผล", lang: "python" },

        { h: "Module 03 — เลือกโครงสร้างให้ตรงกับคำถาม" },
        { p: "เจ็ดข้อของโมดูลนี้แต่ละข้อถูกออกแบบให้ **มีโครงสร้างเดียวที่ตอบได้สวย** ถ้าเลือกผิดจะเขียนได้แต่ยาวและช้ากว่าที่ควร" },
        { table: { head: ["ข้อ", "คำถามที่แท้จริง", "โครงสร้างที่ตอบ"], rows: [
          ["ex1 คะแนน", "รวม สูงสุด ต่ำสุด ของลำดับที่มีซ้ำได้", "`list` แล้วใช้ `sum` `max` `min`"],
          ["ex2 พิกัด", "ค่าสามตัวที่ไปด้วยกันและไม่ควรเปลี่ยน", "`tuple` แล้วแกะออกเป็นสามชื่อ"],
          ["ex3 ความสำเร็จ", "ใครมีอะไรบ้าง ใครมีร่วมกัน ใครมีคนเดียว", "`set` แล้วใช้ `&` `|` `-`"],
          ["ex4 คลัง", "ค้นด้วยชื่อของ ไม่ใช่ตำแหน่ง", "`dict` ที่จำลำดับที่ใส่"],
          ["ex5 เหตุการณ์", "สายข้อมูลที่ไม่รู้จบ", "generator"],
          ["ex6 แปลงข้อมูล", "สร้างชุดใหม่จากชุดเดิมในบรรทัดเดียว", "comprehension"]
        ]}},
        { code: String.raw`# ex3 — สามคำถามตอบด้วยตัวดำเนินการสามตัว
players = {
    "ann": {"first_blood", "sharpshooter", "survivor"},
    "bob": {"first_blood", "collector"},
    "cid": {"first_blood", "survivor", "explorer"},
}

everything = set().union(*players.values())          # ทั้งหมดที่ไม่ซ้ำ
shared = set.intersection(*players.values())         # ที่ทุกคนมี
for name, owned in players.items():
    others = set().union(*(v for k, v in players.items() if k != name))
    unique = owned - others                          # ที่มีคนเดียว
    missing = everything - owned                     # ที่ยังขาด
    print(f"{name}: unique={sorted(unique)} missing={sorted(missing)}")`,
          cap: "ถ้าใช้ list จะกลายเป็นลูปซ้อนลูปทันที", lang: "python" },
        { note: "พิมพ์อะไรจาก set ต้อง `sorted()` ก่อน ไม่งั้นลำดับไม่คงที่ข้ามการรัน แล้วเทสต์ที่เทียบผลลัพธ์จะไม่น่าเชื่อถือ" },
        { code: String.raw`# ex4 — เสมอกันให้ตัวที่มาก่อนในบรรทัดคำสั่งชนะ
inventory = {"potion": 5, "elixir": 5, "rope": 2}

most = max(inventory.items(), key=lambda item: item[1])
least = min(inventory.items(), key=lambda item: item[1])
print(most)      # ('potion', 5) — max เก็บตัวแรกของค่าที่เท่ากัน`,
          cap: "dict จำลำดับที่ใส่ + max เก็บตัวแรกของค่าเสมอ = กติกาของโจทย์ได้ฟรี", lang: "python" },
        { code: String.raw`# ex5 — generator ที่ไม่มีวันจบ กับวิธีดึงมาใช้ทีละชิ้น
import random
from typing import Generator


def gen_event() -> Generator[str, None, None]:
    """สายเหตุการณ์ที่ไม่รู้จบ"""
    names = ["login", "attack", "heal", "logout"]
    while True:
        yield random.choice(names)


stream = gen_event()
for _ in range(5):
    print(next(stream))       # ดึงทีละชิ้น ไม่เคยสร้างลิสต์ทั้งก้อน`,
          cap: "yield ทำให้ฟังก์ชันหยุดค้างไว้แล้วเดินต่อจากจุดเดิม", lang: "python" },

        { h: "Module 04 — สิ่งที่ with ทำให้เราไม่ต้องจำ" },
        { p: "สามข้อแรกห้ามใช้ `with` เพื่อให้เห็นด้วยตาว่าการปิดไฟล์ให้ครบทุกทางออกนั้นต้องเขียนอะไรบ้าง" },
        { code: String.raw`def read_fragment(path: str) -> str:
    """เปิด อ่าน ปิด — โดยที่ปิดต้องเกิดขึ้นทุกเส้นทาง"""
    handle = None
    try:
        handle = open(path, "r", encoding="utf-8")
        return handle.read()          # <- return ตรงนี้ก็ยังต้องปิด
    except (OSError, ValueError, UnicodeDecodeError) as error:
        print(f"Error opening {path}: {error}")
        return ""
    finally:
        if handle is not None:        # อาจ open ไม่สำเร็จเลย
            handle.close()`,
          cap: "ข้อ 0-2 ต้องเขียนแบบนี้ และ if handle is not None คือส่วนที่คนลืม", lang: "python" },
        { code: String.raw`def read_fragment(path: str) -> str:
    """อันเดียวกัน แต่ให้ภาษาเป็นคนการันตี"""
    try:
        with open(path, "r", encoding="utf-8") as handle:
            return handle.read()
    except (OSError, ValueError, UnicodeDecodeError) as error:
        print(f"Error opening {path}: {error}")
        return ""`,
          cap: "ข้อ 3 เป็นต้นไป — สั้นลงและลืมไม่ได้", lang: "python" },
        { table: { head: ["สถานการณ์", "exception ที่ได้จริง"], rows: [
          ["ไฟล์ไม่มีอยู่", "`FileNotFoundError` (ลูกของ `OSError`)"],
          ["ไม่มีสิทธิ์อ่าน", "`PermissionError` (ลูกของ `OSError`)"],
          ["พาธเป็นไดเรกทอรี", "`IsADirectoryError` (ลูกของ `OSError`)"],
          ["ไฟล์เป็นไบนารีแต่เปิดแบบข้อความ", "`UnicodeDecodeError`"],
          ["พาธมีไบต์ NUL", "`ValueError` — **ไม่ใช่** `OSError`"]
        ]}},
        { note: "สองแถวล่างคือเหตุผลที่ต้องจับ `(OSError, ValueError, UnicodeDecodeError)` ไม่ใช่ `OSError` อย่างเดียว — และเป็นเคสที่เจอตอนเขียนเทสต์ ไม่ใช่ตอนอ่านโจทย์" },
        { code: String.raw`import sys

# ข้อ 2 — อ่านเข้าโดยห้ามใช้ input() และส่ง error ออกอีกทาง
for line in sys.stdin:
    text = line.rstrip("\n")
    if not text:
        print("[STDERR] empty line", file=sys.stderr)
        continue
    print(text.upper())`,
          cap: "stdout กับ stderr เป็นคนละสาย ต่อท่อแยกกันได้", lang: "python" },
        { code: String.raw`$ printf "a\n\nb\n" | python3 ft_stream_management.py 2>/dev/null
A
B
$ printf "a\n\nb\n" | python3 ft_stream_management.py 1>/dev/null
[STDERR] empty line`,
          cap: "พิสูจน์ว่าแยกสายจริง ด้วยการทิ้งทีละสาย", lang: "bash" }
      ],

      dataflow: [
        { h: "ไล่ข้อมูลของโปรแกรมทั่วไปในซีรีส์นี้" },
        { p: "แทบทุกข้อของโมดูล 03 และ 04 มีรูปทรงเดียวกัน — **รับเข้า ตรวจ แปลง รายงาน** และจุดที่คะแนนหายคือขั้นตรวจ" },
        { table: { head: ["ขั้น", "รับอะไร", "ส่งอะไรต่อ", "พังได้อย่างไร"], rows: [
          ["รับเข้า", "`sys.argv` หรือ `input()` หรือ `sys.stdin`", "ลิสต์ของสตริง", "ลืมว่า `argv[0]` คือชื่อสคริปต์"],
          ["ตรวจ", "สตริงที่อาจเป็นอะไรก็ได้", "ค่าที่ใช้ได้ พร้อมรายงานตัวที่ทิ้ง", "จับ error กว้างเกินจนกลืนบั๊ก"],
          ["แปลง", "ค่าที่ใช้ได้", "โครงสร้างข้อมูลที่เลือกไว้", "เลือกโครงสร้างผิดตั้งแต่ต้น"],
          ["รายงาน", "โครงสร้าง", "ข้อความที่ตรงกับ transcript", "ปัดเศษไม่ตรง หรือเว้นวรรคไม่ตรง"]
        ]}},
        { code: String.raw`def parse_scores(arguments: list[str]) -> list[int]:
    """แปลงอาร์กิวเมนต์เป็นคะแนน ทิ้งตัวที่ใช้ไม่ได้พร้อมบอก"""
    scores: list[int] = []
    for argument in arguments:
        try:
            scores.append(int(argument))
        except ValueError:
            print(f"Ignoring '{argument}': not a number")
    return scores


def main() -> None:
    scores = parse_scores(sys.argv[1:])     # ข้ามชื่อสคริปต์
    if not scores:
        print("No valid scores given")
        return
    print(f"count: {len(scores)}")
    print(f"total: {sum(scores)}")
    print(f"highest: {max(scores)}")
    print(f"lowest: {min(scores)}")`,
          cap: "รูปทรงนี้ใช้ได้กับ ex1 ของโมดูล 03 และอีกหลายข้อ", lang: "python" },
        { p: "สังเกตว่า **การตรวจอยู่ที่เดียว** และ `main` ไม่ต้องรู้จัก `try` เลย นี่คือรูปแบบเดียวกับที่โมดูล 08 ใช้กับการตั้งค่า และที่ A-Maze-ing ใช้กับไฟล์ config" },
        { h: "ปัดเศษ — จุดที่ผลลัพธ์ไม่ตรง transcript บ่อยที่สุด" },
        { code: String.raw`print(round(2 / 3, 2))        # 0.67
print(round(1 / 3 * 3, 2))    # 1.0   ไม่ใช่ 1
print(f"{2/3:.2f}")           # '0.67' — เป็นสตริง คนละอย่างกับ round
print(round(2.675, 2))        # 2.67  ไม่ใช่ 2.68 เพราะฐานสองเก็บไม่ตรง`,
          cap: "round คืนตัวเลข, f-string คืนสตริง — transcript บอกว่าต้องการอันไหน", lang: "python" },
        { note: "ถ้า transcript เขียน `85.0` แปลว่าเป็น float ที่ผ่าน `round` มา ไม่ใช่สตริงที่จัดรูปแบบ ถ้าเขียน `85.00` แปลว่าตรงกันข้าม — **อ่าน transcript ให้ออกว่ามันบอกชนิดอะไร**" }
      ],

      implementation: [
        { h: "เทสต์แต่ละโมดูลด้วยอะไร" },
        { p: "โครงเดียวกันทุกโมดูล แต่สิ่งที่ต้องดักต่างกันตามธรรมชาติของแบบฝึกหัด" },
        { table: { head: ["โมดูล", "สิ่งที่ต้องดักในเทสต์"], rows: [
          ["00", "จับ stdout และป้อน `input` ปลอม เพราะฟังก์ชันรับอินพุตเอง"],
          ["01", "ตรวจว่าไม่มีแอตทริบิวต์สาธารณะเหลืออยู่หลังข้อ 4 และ `Flower.anonymous()` คืน `Flower` จริง"],
          ["02", "ตรวจว่าจับชนิดแคบจริง และ `finally` ทำงานทั้งสองเส้นทาง"],
          ["03", "ตรวจว่าเรียกซ้ำสองครั้งได้ผลเดิม และ generator ถูกใช้จนหมดแล้วว่าง"],
          ["04", "ตรวจว่าไม่มี `with` ในสามข้อแรก และ descriptor ไม่รั่วเมื่อรันซ้ำ 200 รอบ"]
        ]}},
        { code: String.raw`import builtins
import io
from contextlib import redirect_stdout


def run_with_input(function, answers: list[str]) -> str:
    """เรียกฟังก์ชันที่ใช้ input() โดยป้อนคำตอบไว้ล่วงหน้า"""
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
        builtins.input = real_input      # คืนของเดิมเสมอ


out = run_with_input(ft_plant_age, ["75"])
assert out == "Enter plant age in days: Plant is ready to harvest!\n"`,
          cap: "เทคนิคนี้ทำให้ข้อที่โต้ตอบกับผู้ใช้เทสต์ได้โดยไม่ต้องมีคนพิมพ์", lang: "python" },
        { code: String.raw`# โมดูล 01 — ตรวจว่า encapsulation เกิดขึ้นจริง ไม่ใช่แค่เปลี่ยนชื่อ
plant = Plant("Rose", 25.0, 30)
assert not hasattr(plant, "height")        # ไม่มีชื่อสาธารณะเหลือ
assert plant.get_height() == 25.0

plant.set_height(-5)                        # ต้องถูกปฏิเสธ
assert plant.get_height() == 25.0           # และของเดิมต้องไม่ขยับ

# และ classmethod ต้องคืนชนิดของคลาสที่ถูกเรียกจริง
assert type(Flower.anonymous()) is Flower`,
          cap: "สองบรรทัดสุดท้ายจับบั๊กที่พบบ่อยที่สุดของข้อ 6", lang: "python" },
        { code: String.raw`# โมดูล 04 — ตรวจกฎ "ห้าม with" จากซอร์สที่ลอกคอมเมนต์ออกแล้ว
import tokenize


def code_tokens(path: str) -> list[str]:
    """คืนโทเคนของไฟล์ โดยตัดคอมเมนต์และ docstring ทิ้ง"""
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
          cap: "grep ธรรมดาจะไปเจอคำว่า with ใน docstring แล้วฟ้องผิด", lang: "python" },
        { note: "**ทุกครั้งที่เทสต์ล้ม ให้ถามก่อนว่าอะไรพัง — โค้ดหรือเทสต์** ประสบการณ์จากการทำทั้งสิบเอ็ดโมดูลคือส่วนใหญ่เป็นเทสต์ที่เขียนผิด ให้ทำเทสต์ให้เข้มขึ้น อย่าลดเงื่อนไขที่ยืนยัน" }
      ]
    },

    py_patterns: {
      theory: [
        { h: "Module 05 — ไล่โค้ดจริงของทั้งสามข้อ" },
        { p: "สามข้อนี้คือระบบเดียวที่โตขึ้นสามรอบ: ตัวประมวลผล แล้วตัวจัดเส้นทาง แล้วทางออก" },
        { code: String.raw`class DataProcessor(ABC):
    """หน้าตาที่ตัวประมวลผลทุกตัวใช้ร่วมกัน"""

    def __init__(self, name: str) -> None:
        self._name = name
        self._items: list[tuple[int, str]] = []
        self._rank = 0

    @abstractmethod
    def validate(self, data: Any) -> bool:
        """รับได้ไหม — คง Any ไว้ เพราะผู้ถามยังไม่รู้คำตอบ"""

    @abstractmethod
    def ingest(self, data: Any) -> None:
        """รับเข้า — ซับคลาสแคบชนิดลง และโยนเมื่อได้ของผิด"""

    def _store(self, value: str) -> None:
        self._items.append((self._rank, value))
        self._rank += 1

    def output(self) -> tuple[int, str]:
        """ดึงตัวเก่าที่สุดออกมาพร้อมลำดับของมัน"""
        if not self._items:
            raise IndexError(f"{self._name} has no data to output")
        return self._items.pop(0)`,
          cap: "ex0 — abstract สองตัว concrete หนึ่งตัว", lang: "python" },
        { code: String.raw`class NumericProcessor(DataProcessor):
    def validate(self, data: Any) -> bool:
        if isinstance(data, list):
            return bool(data) and all(self.validate(x) for x in data)
        # bool เป็นซับคลาสของ int จึงต้องกันออกเอง
        return isinstance(data, (int, float)) and not isinstance(data, bool)

    def ingest(self, data: int | float | list[int | float]) -> None:
        if not self.validate(data):
            raise TypeError("Improper numeric data")
        for value in self._flatten(data):
            self._store(str(value))`,
          cap: "ลายเซ็นแคบลง แต่ยังป้องกันตัวเองอยู่ดี", lang: "python" },
        { note: "`validate` กับ `ingest` ต้องพูดตรงกัน ถ้า `validate` ยอมรับลิสต์ซ้อนลิสต์ แล้ว `ingest` แบนแค่ชั้นเดียว มันจะเก็บ repr ของลิสต์ชั้นในไว้เป็นค่า — บั๊กนี้เกิดขึ้นจริงตอนทำโปรเจค และเทสต์ที่จับได้คือเทสต์ที่ป้อนลิสต์ซ้อน" },
        { code: String.raw`class DataStream:
    def process_stream(self, stream: list[Any]) -> None:
        """ส่งแต่ละชิ้นให้ตัวแรกที่รับได้ ที่เหลือรายงานแล้วทิ้ง"""
        for element in stream:
            for processor in self._processors:
                if processor.validate(element):
                    processor.ingest(element)
                    break
            else:                       # for-else: ไม่มีใคร break เลย
                print("DataStream error - Can't process element in "
                      f"stream: {element}")`,
          cap: "ex1 — ทั้งฟังก์ชันไม่มีชื่อชนิดข้อมูลสักตัว", lang: "python" },
        { p: "`for ... else` ของ Python ทำงานเมื่อลูป จบโดยไม่เจอ `break` ซึ่งตรงกับความหมายที่ต้องการพอดี คือ 'ไม่มีตัวประมวลผลตัวไหนรับเลย'" },
        { code: String.raw`class ExportPlugin(Protocol):
    """สัญญาแบบโครงสร้าง — ไม่มีใครสืบทอดจากมัน"""

    def process_output(self, data: list[tuple[int, str]]) -> None: ...


class CsvExportPlugin:
    """ไม่ได้สืบทอดอะไรเลย แต่ผ่านสัญญาแล้ว"""

    def process_output(self, data: list[tuple[int, str]]) -> None:
        print("CSV Output:")
        print(",".join(self._escape(value) for _, value in data))

    @staticmethod
    def _escape(value: str) -> str:
        """ฟิลด์ที่มีจุลภาค อัญประกาศ หรือขึ้นบรรทัดใหม่ ต้องถูกครอบ"""
        if not any(c in value for c in ',"\n\r'):
            return value
        return '"' + value.replace('"', '""') + '"'`,
          cap: "ex2 — ด้านขาเข้าใช้การสืบทอด ด้านขาออกใช้ duck typing", lang: "python" },
        { note: "`Protocol` ธรรมดาใช้กับ `isinstance` ไม่ได้ — มันโยน `TypeError` จึงควรมียามที่ runtime ด้วย: `callable(getattr(plugin, \"process_output\", None))`" },

        { h: "Module 06 — ทำไม import ถึงพังแบบนั้น" },
        { p: "เรื่องทั้งหมดอธิบายได้ด้วยข้อเท็จจริงข้อเดียว: โมดูลถูกรันครั้งเดียว แล้วผลถูกเก็บใน `sys.modules`" },
        { code: String.raw`import sys

import alchemy.elements           # รันไฟล์นั้นครั้งแรก
print("alchemy" in sys.modules)   # True
print("alchemy.elements" in sys.modules)   # True

import alchemy.elements           # ครั้งที่สอง ไม่รันซ้ำ
# ได้ตัวเดิมจากแคชทันที`,
          cap: "นี่คือ include guard ที่ Python มีมาให้แล้ว", lang: "python" },
        { code: String.raw`# ลำดับเวลาที่ทำให้ circular import พัง
# 1. ใครสักคน import dark_spellbook
# 2. Python ใส่ dark_spellbook ลง sys.modules (ยังว่าง)
# 3. เริ่มรันบรรทัดแรกของ dark_spellbook -> from .dark_validator import ...
# 4. เริ่มรัน dark_validator -> from .dark_spellbook import allowed_...
# 5. dark_spellbook อยู่ใน sys.modules แล้ว จึงไม่รันซ้ำ
# 6. แต่มันรันมาถึงแค่บรรทัด 2 ฟังก์ชันยังไม่ถูกสร้าง -> ImportError`,
          cap: "ขั้นที่ 5 คือหัวใจ — แคชช่วยเรื่องความเร็ว แต่ที่นี่มันคืนของที่ยังไม่เสร็จ", lang: "text" },
        { code: String.raw`def validate_ingredients(ingredients: str) -> str:
    """import ตอนถูกเรียก ไม่ใช่ตอนโหลดโมดูล"""
    from .light_spellbook import light_spell_allowed_ingredients

    lowered = ingredients.lower()
    allowed = light_spell_allowed_ingredients()
    matched = any(item in lowered for item in allowed)
    return f"{ingredients} - {'VALID' if matched else 'INVALID'}"`,
          cap: "พอถึงเวลาถูกเรียก ทั้งสองโมดูลโหลดครบแล้ว", lang: "python" },
        { table: { head: ["เขียนแบบ", "ได้ไฟล์ไหน", "เมื่อไหร่ใช้"], rows: [
          ["`import elements`", "ไฟล์ระดับบนสุด", "ของนอก package ที่คนอ่านอยากตามไปดู"],
          ["`from .elements import x`", "ไฟล์ข้าง ๆ ใน package เดียวกัน", "ไส้ในของ package เอง"],
          ["`from ..potions import x`", "ขึ้นไปหนึ่งชั้นแล้วเข้าไฟล์นั้น", "ข้ามชั้นภายใน package"],
          ["`from alchemy.elements import x`", "ระบุพาธเต็ม", "เมื่ออยากให้คนอ่านเห็นชื่อ package ชัด ๆ"]
        ]}},

        { h: "Module 07 — สามรูปแบบที่วางซ้อนกัน" },
        { p: "ข้อ 0 เอาชื่อคลาสจริงออกจากผู้เรียก ข้อ 1 เอาความสามารถออกจากสายพันธุ์ ข้อ 2 เอาพฤติกรรมออกจากโค้ดที่สู้กัน แต่ละรอบผู้เรียกรู้เรื่องน้อยลง" },
        { code: String.raw`# ก่อนใช้รูปแบบ — ผู้เรียกรู้ทุกอย่าง และต้องแก้ทุกครั้งที่มีของใหม่
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
          cap: "โซ่สองชั้นที่ต้องแก้ทุกครั้งที่เพิ่มการ์ดหรือความสามารถ", lang: "python" },
        { code: String.raw`# หลังใช้รูปแบบ — ไม่มีชื่อคลาส ไม่มี isinstance เหลืออยู่เลย
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
          cap: "เพิ่มความสามารถใหม่ = เขียนคลาสใหม่ ไม่ต้องแตะฟังก์ชันนี้", lang: "python" },
        { note: "**กับดักของ multiple inheritance ที่เจอจริง** `Creature.__init__` ไม่ได้เรียก `super().__init__()` ดังนั้นถ้าใช้ `super()` แบบร่วมมือ โซ่จะหยุดตรงนั้นและ constructor ของความสามารถจะไม่เคยทำงาน ผลคือ `AttributeError: '_transformed'` ตอน attack ครั้งแรก — ต้องเรียกทีละคลาสฐานอย่างชัดเจน" }
      ],

      implementation: [
        { h: "เทสต์ที่พิสูจน์ว่ารูปแบบทำงานจริง" },
        { p: "เทสต์ที่ดีที่สุดของสามโมดูลนี้เหมือนกันหมด: **ประดิษฐ์ของใหม่ขึ้นมาในไฟล์เทสต์** แล้วส่งเข้าโค้ดเดิมที่ไม่ถูกแก้เลยแม้แต่บรรทัดเดียว" },
        { code: String.raw`# โมดูล 05 — ตัวประมวลผลตัวที่สี่ ที่คลาสฐานไม่เคยรู้จัก
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
assert stream.processors[0].total == 2      # bool ไปเข้าตัวใหม่
assert stream.processors[1].total == 1      # เลขไปเข้าตัวเดิม`,
          cap: "process_stream ไม่ถูกแก้เลย แต่รับของใหม่ได้", lang: "python" },
        { code: String.raw`# โมดูล 06 — ทดสอบกลไก import ต้องใช้ interpreter ใหม่ทุกครั้ง
$ python3 -c "import elements, alchemy.elements as inner; \
print(elements is inner, elements.__name__, inner.__name__)"
False elements alchemy.elements

$ python3 -c "import alchemy.grimoire.dark_validator"    # ImportError
$ python3 -c "import alchemy.grimoire.dark_spellbook"    # ImportError เหมือนกัน
$ python3 -c "import alchemy.grimoire.light_validator"   # ผ่าน`,
          cap: "sys.modules จำผลของการ import ที่สำเร็จ จึงต้องแยกโปรเซส", lang: "bash" },
        { note: "**negative control ที่ขาดไม่ได้** คัดลอกต้นไม้ไปที่ชั่วคราว ย้าย import แบบเลื่อนของ `light_validator` กลับไปหัวไฟล์ แล้วยืนยันว่าคู่ light ระเบิดเหมือนคู่ dark — ถ้าไม่ทำ เทสต์ที่บอกว่า 'light ทำงาน' ไม่ได้พิสูจน์อะไรเลย" },
        { code: String.raw`# โมดูล 07 — ตรวจว่า package ไม่เปิดเผยการ์ดจริง
for name in ("Flameling", "Pyrodon", "Aquabub", "Torragon"):
    assert not hasattr(ex0, name)

assert sorted(ex0.__all__) == ["AquaFactory", "Creature",
                               "CreatureFactory", "FlameFactory"]

# และตรวจว่าโรงงานแจกของใหม่ทุกครั้ง ไม่ใช่ของตัวเดิม
flame = ex0.FlameFactory()
assert flame.create_base() is not flame.create_base()`,
          cap: "สองข้อนี้คือสิ่งที่โจทย์เขียนไว้ตรง ๆ แต่ลืมตรวจกันบ่อย", lang: "python" }
      ]
    },

    py_toolkit: {
      theory: [
        { h: "Module 08 — venv คือไดเรกทอรี ไม่ใช่เวทมนตร์" },
        { code: String.raw`$ python3 -m venv .venv
$ ls .venv
bin  include  lib  lib64  pyvenv.cfg

$ cat .venv/pyvenv.cfg
home = /usr/bin
include-system-site-packages = false
version = 3.12.3`,
          cap: "ทั้งหมดที่ venv เป็น: ไฟล์ตั้งค่าหนึ่งไฟล์ ลิงก์ และ site-packages ว่าง ๆ", lang: "bash" },
        { code: String.raw`import sys

print(sys.executable)     # python ตัวไหนกำลังรัน
print(sys.prefix)         # หาไลบรารีที่ไหน
print(sys.base_prefix)    # python ตัวจริงอยู่ที่ไหน

# ในสภาพแวดล้อมเสมือน สองอันล่างต่างกัน นอกนั้นเหมือนกัน
print(sys.prefix != sys.base_prefix)`,
          cap: "การตรวจทั้งหมดคือการเทียบสองค่านี้", lang: "python" },
        { table: { head: ["สถานการณ์", "`VIRTUAL_ENV`", "`sys.prefix != sys.base_prefix`"], rows: [
          ["นอก venv", "ว่าง", "False — ถูก"],
          ["activate แล้ว", "มีค่า", "True — ถูก"],
          ["เรียก `.venv/bin/python` ตรง ๆ ไม่ activate", "**ว่าง — ผิด**", "True — ถูก"],
          ["deactivate แล้วแต่ตัวแปรค้าง", "**มีค่า — ผิด**", "False — ถูก"]
        ]}},
        { p: "สองแถวล่างคือเหตุผลที่ต้องใช้ `sys.prefix` เป็นคนตอบ และรายงานตัวแปรสภาพแวดล้อมได้แค่ในฐานะข้อมูลประกอบ" },
        { h: "ทำไมต้อง importlib แทน import ธรรมดา" },
        { code: String.raw`# แบบธรรมดา — ไลบรารีหาย = traceback ก่อน main() ได้เริ่ม
import pandas          # ModuleNotFoundError ทันทีที่โหลดไฟล์

# แบบที่ทำให้โปรแกรมรอด — ผลของการ import กลายเป็นข้อมูล
import importlib
from typing import Any


def load(name: str) -> Any:
    try:
        return importlib.import_module(name)
    except ImportError:
        return None`,
          cap: "โจทย์ยกเว้นให้ linter ฟ้องเรื่อง import ได้ — เขียนแบบนี้แล้วไม่มีอะไรให้ฟ้อง", lang: "python" },
        { h: "Module 09 — Pydantic ตรวจตอนไหน" },
        { code: String.raw`from pydantic import BaseModel, ConfigDict, Field


class SpaceStation(BaseModel):
    model_config = ConfigDict(validate_assignment=True)

    station_id: str = Field(min_length=3, max_length=10)
    crew_size: int = Field(ge=1, le=20)`,
          cap: "ไม่ใส่ validate_assignment แล้วการแก้ค่าทีหลังจะไม่ถูกตรวจ", lang: "python" },
        { table: { head: ["เขียน", "ผลลัพธ์", "เพราะ"], rows: [
          ["`SpaceStation(crew_size=\"6\", ...)`", "ได้ `6` เป็น int", "coercion เปิดอยู่ และไม่สูญเสียข้อมูล"],
          ["`SpaceStation(crew_size=6.0, ...)`", "ได้ `6`", "6.0 แปลงเป็น 6 ได้โดยไม่เสียอะไร"],
          ["`SpaceStation(crew_size=6.5, ...)`", "**error**", "แปลงแล้วเสียข้อมูล"],
          ["`station.crew_size = 99`", "error เมื่อเปิด `validate_assignment`", "ไม่เปิดก็เงียบ"],
          ["`last_maintenance=\"2024-01-15T10:30:00\"`", "ได้ `datetime` จริง", "สตริง ISO ถูกแปลงให้"]
        ]}},
        { code: String.raw`@model_validator(mode="after")
def check_report_is_credible(self) -> "AlienContact":
    """กฎที่เกี่ยวข้องหลายฟิลด์พร้อมกัน"""
    if not self.contact_id.startswith("AC"):
        raise ValueError("Contact ID must start with 'AC'")
    if self.contact_type is ContactType.PHYSICAL and not self.is_verified:
        raise ValueError("Physical contact reports must be verified")
    return self        # <- ลืมบรรทัดนี้ = constructor คืน None`,
          cap: "raise ValueError แล้ว Pydantic ห่อเป็น ValidationError ให้เอง", lang: "python" },
        { note: "ค่าคงที่ในโมเดลต้องเป็น `ClassVar` ไม่งั้น `STRONG_SIGNAL: float = 7.0` จะกลายเป็นฟิลด์ที่ตั้งค่าได้ และโผล่ใน `model_fields` — เป็นบั๊กที่ตรวจเจอตอนเขียนเทสต์นับจำนวนฟิลด์" },
        { h: "Module 10 — closure คืออะไรเมื่อมองที่ตัวโครงสร้าง" },
        { code: String.raw`def mage_counter() -> Callable[[], int]:
    count = 0

    def increment() -> int:
        nonlocal count      # ไม่มีบรรทัดนี้ = UnboundLocalError
        count += 1
        return count

    return increment


counter = mage_counter()
print(counter.__closure__)                       # มี cell อยู่ข้างใน
print(counter.__closure__[0].cell_contents)      # 0 ก่อนเรียก
counter()
print(counter.__closure__[0].cell_contents)      # 1 หลังเรียก

other = mage_counter()
print(counter.__closure__[0] is other.__closure__[0])   # False`,
          cap: "สองตัวนับ สอง cell — นี่คือเหตุผลที่ nonlocal ปลอดภัยกว่า global", lang: "python" },
        { code: String.raw`import functools

@functools.lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

fib(25)
print(fib.cache_info())     # misses=26 — n ละครั้งพอดี
# เวอร์ชันที่ไม่มี cache เรียกตัวเอง 242,785 ครั้งสำหรับ n เดียวกัน`,
          cap: "cache เปลี่ยนคลาสของปัญหา ไม่ใช่แค่ค่าคงที่", lang: "python" }
      ],

      implementation: [
        { h: "เทสต์ที่วัดแทนที่จะอ้าง" },
        { code: String.raw`# lru_cache — negative control คือเวอร์ชันที่ไม่มี cache
calls = {"n": 0}


def naive(n: int) -> int:
    calls["n"] += 1
    if n < 2:
        return n
    return naive(n - 1) + naive(n - 2)


assert naive(25) == memoized_fibonacci(25)
assert memoized_fibonacci.cache_info().misses == 26
assert calls["n"] > 200000`,
          cap: "ตัวเลขเป็นคนพูด ไม่ใช่ docstring", lang: "python" },
        { code: String.raw`# venv — ทดสอบทั้งสามสถานการณ์จากภายนอกโปรแกรม
$ python3 ex0/construct.py                       # นอก venv
$ ./.venv/bin/python ex0/construct.py            # ใน venv โดยไม่ activate
$ VIRTUAL_ENV=/tmp/not-real python3 ex0/construct.py   # ตัวแปรค้าง
# กรณีสุดท้ายต้องยังบอกว่าอยู่นอก venv`,
          cap: "สามคำสั่งนี้แยกการตรวจจริงออกจากการเดา", lang: "bash" },
        { code: String.raw`# Pydantic — ทดสอบขอบทั้งสองฝั่งของทุกข้อจำกัด
assert build(crew_size=1).crew_size == 1        # ขอบล่างรับได้
assert build(crew_size=20).crew_size == 20      # ขอบบนรับได้
assert rejects(lambda: build(crew_size=0)) == \
    "Input should be greater than or equal to 1"
assert rejects(lambda: build(crew_size=21)) == \
    "Input should be less than or equal to 20"`,
          cap: "ge กับ gt ต่างกันตัวอักษรเดียว มีแต่เทสต์ที่ขอบเท่านั้นที่แยกออก", lang: "python" },
        { code: String.raw`# ความลับต้องไม่โผล่ ไม่ว่ามาจากทางไหน
result = run(ORACLE, {"API_KEY": "hunter2-do-not-print"})
assert "hunter2-do-not-print" not in result.stdout
assert "API_KEY: set (20 characters)" in result.stdout

# และ .env ต้องถูก ignore จริง ไม่ใช่แค่โปรแกรมพิมพ์ว่า [OK]
assert ".env" in open("ex2/.gitignore").read().split()`,
          cap: "ตรวจการตั้งค่า ไม่ใช่ตรวจข้อความที่โปรแกรมพิมพ์", lang: "python" },
        { note: "**negative control ที่คุ้มที่สุดของโมดูล 08** คัดลอก `oracle.py` ไปที่ชั่วคราว แทรกความลับที่เขียนตายตัวลงไป แล้วยืนยันว่าการตรวจความปลอดภัยจับได้ ถ้าไม่ทำ บรรทัด `[OK] No hardcoded secrets detected` ไม่ได้พิสูจน์อะไรเลย" }
      ]
    }
  };

  window.PY_DEEP_TH = TH;

  window.TEACHING_DATA = window.TEACHING_DATA || [];
  window.TEACHING_DATA.forEach(function (page) {
    var extra = TH[page.id];
    if (!extra) return;
    Object.keys(extra).forEach(function (key) {
      page.sections[key] = (page.sections[key] || []).concat(extra[key]);
    });
  });
})();
