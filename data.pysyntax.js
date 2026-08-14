/* ไวยากรณ์ Python ฉบับเปิดดู — สั้น ตัวอย่าง ผลลัพธ์ แบบ w3schools
   สร้างจาก skill python-101-foundations */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

window.TEACHING_DATA.splice(function () {
  var i = window.TEACHING_DATA.map(function (p) { return p.id; }).indexOf("py_from_c");
  return i < 0 ? window.TEACHING_DATA.length : i;
}(), 0, {
  id: "py_syntax",
  name: "ไวยากรณ์ Python",
  nameEn: "Python Syntax Reference",
  tag: {
    th: "เปิดดูตอนลืม — ประกาศตัวแปร ชนิดข้อมูล แปลงชนิด ตัวดำเนินการ if elif else ลูป ฟังก์ชัน list dict และการจัดรูปแบบข้อความ ทุกหัวข้อมีรูปแบบ ตัวอย่าง และผลลัพธ์",
    en: "The one to open when you forget — declaring variables, data types, casting, operators, if/elif/else, loops, functions, lists and dicts, and string formatting. Every entry has the form, an example, and its output"
  },
  accent: "#f59e0b",
  sections: {
    principle: [
      { h: "หน้านี้ใช้ยังไง" },
      { p: "หน้านี้ไม่ได้สอนแนวคิด แต่เป็น **ที่เปิดดูตอนลืมว่าเขียนยังไง** ทุกหัวข้อมีสามอย่าง: รูปแบบ ตัวอย่างที่รันได้ และผลลัพธ์ที่ต้องได้ อ่านข้ามได้ตามต้องการ" },
      { note: "อยากเข้าใจ **ว่าทำไม** ไม่ใช่แค่ **ว่าอย่างไร** ให้ไปที่หน้า **Python 101** ซึ่งเล่าเรียงลำดับตั้งแต่ศูนย์ หน้านี้เป็นคู่มืออ้างอิงของหน้านั้น" },
      { h: "กฎที่ใช้ได้กับทุกบรรทัดในหน้านี้" },
      { table: { head: ["กฎ", "ตัวอย่างที่ถูก", "ตัวอย่างที่ผิด"], rows: [
        ["จบบรรทัดไม่ต้องมีอัฒภาค", "`x = 5`", "`x = 5;`"],
        ["บล็อกใช้การเยื้อง 4 ช่อง", "`if x:` ขึ้นบรรทัดใหม่แล้วเยื้อง", "ใช้ปีกกา"],
        ["หัวบล็อกจบด้วยทวิภาค", "`if x > 0:`", "`if x > 0`"],
        ["ไม่ต้องประกาศชนิด", "`x = 5`", "`int x = 5`"],
        ["คอมเมนต์ขึ้นต้นด้วย `#`", "`# หมายเหตุ`", "`// หมายเหตุ`"],
        ["ตัวพิมพ์เล็กใหญ่ต่างกัน", "`name` กับ `Name` คนละตัว", "—"]
      ]}},
      { code: String.raw`# บันทึกเป็นไฟล์ ชื่ออะไรก็ได้ที่ลงท้ายด้วย .py แล้วสั่ง:
#   python3 ชื่อไฟล์.py

print("Hello")        # พิมพ์ออกจอ
x = 5                 # กำหนดค่า
if x > 0:             # หัวบล็อก จบด้วย :
    print("บวก")      # ข้างในบล็อก เยื้อง 4 ช่อง
print("จบ")           # นอกบล็อก`,
        cap: "โครงพื้นฐานที่ครบทุกกฎข้างบน", lang: "python" }
    ],

    theory: [
      { h: "ประกาศตัวแปร" },
      { code: String.raw`ชื่อตัวแปร = ค่า`,
        cap: "รูปแบบ", lang: "text" },
      { code: String.raw`name = "Somchai"     # ข้อความ
age = 20             # จำนวนเต็ม
height = 172.5       # ทศนิยม
is_student = True    # จริง/เท็จ
nothing = None       # ไม่มีค่า

print(name, age, height, is_student, nothing)`,
        cap: "ตัวอย่าง", lang: "python" },
      { code: String.raw`Somchai 20 172.5 True None`,
        cap: "ผลลัพธ์", lang: "text" },
      { table: { head: ["เรื่อง", "กติกา"], rows: [
        ["ไม่ต้องบอกชนิด", "Python ดูจากค่าที่ใส่ให้เอง"],
        ["ชื่อขึ้นต้นด้วย", "ตัวอักษรหรือขีดล่าง ห้ามขึ้นต้นด้วยตัวเลข"],
        ["ชื่อประกอบด้วย", "ตัวอักษร ตัวเลข ขีดล่าง ห้ามมีช่องว่างและเครื่องหมาย"],
        ["สไตล์", "`snake_case` สำหรับตัวแปรและฟังก์ชัน, `PascalCase` สำหรับคลาส"],
        ["ค่าคงที่", "ไม่มีจริง ใช้ชื่อตัวใหญ่ทั้งหมดเป็นข้อตกลง เช่น `MAX_SIZE`"]
      ]}},
      { code: String.raw`a = b = c = 0            # กำหนดพร้อมกันสามตัว
x, y = 3, 4              # กำหนดทีละคู่
x, y = y, x              # สลับค่ากันได้ในบรรทัดเดียว
print(x, y)              # 4 3

count = 0
count += 1               # เท่ากับ count = count + 1
count -= 1               # ลบ
count *= 2               # คูณ
print(count)             # 0`,
        cap: "รูปแบบย่อที่ใช้บ่อย", lang: "python" },
      { h: "ชนิดข้อมูลพื้นฐาน" },
      { table: { head: ["ชนิด", "เขียนยังไง", "ตัวอย่าง"], rows: [
        ["`str`", "ครอบด้วยอัญประกาศเดี่ยวหรือคู่", "`\"abc\"`, `'abc'`"],
        ["`int`", "ตัวเลขไม่มีจุด", "`42`, `-7`"],
        ["`float`", "ตัวเลขมีจุด", "`3.14`, `2.0`"],
        ["`bool`", "`True` หรือ `False` ตัวแรกใหญ่", "`True`"],
        ["`list`", "วงเล็บเหลี่ยม", "`[1, 2, 3]`"],
        ["`tuple`", "วงเล็บกลม", "`(1, 2)`"],
        ["`dict`", "วงเล็บปีกกา คู่คีย์กับค่า", "`{\"a\": 1}`"],
        ["`set`", "วงเล็บปีกกา ไม่มีคู่", "`{1, 2}`"],
        ["`NoneType`", "`None`", "`None`"]
      ]}},
      { code: String.raw`print(type(42))          # <class 'int'>
print(type("42"))        # <class 'str'>
print(type(3.14))        # <class 'float'>
print(type(True))        # <class 'bool'>
print(type([1, 2]))      # <class 'list'>
print(type({"a": 1}))    # <class 'dict'>`,
        cap: "อยากรู้ว่าเป็นชนิดอะไร ถาม type()", lang: "python" },
      { h: "แปลงชนิด" },
      { code: String.raw`int(ค่า)      float(ค่า)      str(ค่า)      bool(ค่า)`,
        cap: "รูปแบบ", lang: "text" },
      { code: String.raw`print(int("42"))         # 42      ข้อความ -> จำนวนเต็ม
print(int(3.9))          # 3       ทศนิยม -> จำนวนเต็ม (ตัดทิ้ง)
print(float("3.14"))     # 3.14    ข้อความ -> ทศนิยม
print(str(42))           # '42'    ตัวเลข -> ข้อความ
print(bool(0))           # False   0 นับเป็นเท็จ
print(bool(""))          # False   ข้อความว่างนับเป็นเท็จ
print(bool("0"))         # True    ข้อความที่มีตัวอักษรนับเป็นจริง

print(int("abc"))        # ValueError: invalid literal for int()`,
        cap: "บรรทัดสุดท้ายพัง — แปลงไม่ได้ต้องดักด้วย try", lang: "python" },
      { h: "ตัวดำเนินการ" },
      { table: { head: ["กลุ่ม", "ตัวดำเนินการ", "ตัวอย่าง", "ได้"], rows: [
        ["เลขคณิต", "`+ - * /`", "`7 / 2`", "`3.5` (ได้ทศนิยมเสมอ)"],
        ["", "`//`", "`7 // 2`", "`3` (ปัดลง)"],
        ["", "`%`", "`7 % 2`", "`1` (เศษ)"],
        ["", "ยกกำลัง", "ดูโค้ดข้างล่าง", "`8`"],
        ["เปรียบเทียบ", "`== !=`", "`5 == 5`", "`True`"],
        ["", "`> < >= <=`", "`5 >= 5`", "`True`"],
        ["ตรรกะ", "`and or not`", "`True and False`", "`False`"],
        ["สมาชิก", "`in`, `not in`", "`\"a\" in \"cat\"`", "`True`"],
        ["ตัวตน", "`is`, `is not`", "`x is None`", "ใช้กับ None เท่านั้น"]
      ]}},
      { code: String.raw`print(7 + 2)    # 9
print(7 - 2)    # 5
print(7 * 2)    # 14
print(7 / 2)    # 3.5   หารได้ทศนิยมเสมอ
print(7 // 2)   # 3     ปัดลง
print(7 % 2)    # 1     เศษ
print(2 ** 3)   # 8     ยกกำลัง (ดาวสองตัว)`,
        cap: "ตัวดำเนินการเลขคณิตครบชุดพร้อมผลลัพธ์", lang: "python" },
      { note: "`=` คือกำหนดค่า ส่วน `==` คือเปรียบเทียบ — สับสนตรงนี้แล้ว Python จะฟ้อง `SyntaxError` ทันทีในเงื่อนไข ซึ่งถือว่าโชคดี เพราะบางภาษาปล่อยผ่าน" },
      { h: "ข้อความและการจัดรูปแบบ" },
      { code: String.raw`f"ข้อความ {ตัวแปร} ข้อความต่อ"`,
        cap: "รูปแบบ f-string — มี f นำหน้าอัญประกาศ", lang: "text" },
      { code: String.raw`name = "Somchai"
score = 87.6543

print(f"{name} ได้ {score} คะแนน")     # Somchai ได้ 87.6543 คะแนน
print(f"{score:.2f}")                  # 87.65      ทศนิยม 2 ตำแหน่ง
print(f"{score:>10.2f}")               #      87.65 ชิดขวากว้าง 10
print(f"{name:*^11}")                  # **Somchai** จัดกลางเติม *
print(f"{42:04d}")                     # 0042       เติมศูนย์หน้า
print(f"{score = }")                   # score = 87.6543  ใส่ชื่อให้ด้วย`,
        cap: "ตัวเลือกการจัดรูปแบบที่ใช้บ่อย", lang: "python" },
      { code: String.raw`text = "Hello World"

print(len(text))              # 11
print(text.upper())           # HELLO WORLD
print(text.lower())           # hello world
print(text.replace("l", "L")) # HeLLo WorLd
print(text.split(" "))        # ['Hello', 'World']
print("-".join(["a", "b"]))   # a-b
print("  ab  ".strip())       # 'ab'
print(text.startswith("He"))  # True
print(text[0])                # H       ตัวแรก
print(text[-1])               # d       ตัวสุดท้าย
print(text[0:5])              # Hello   ตั้งแต่ 0 ถึงก่อน 5`,
        cap: "เมธอดของข้อความที่ใช้บ่อยที่สุด", lang: "python" }
    ],

    foundations: [
      { h: "if — ทำเมื่อเงื่อนไขเป็นจริง" },
      { code: String.raw`if เงื่อนไข:
    คำสั่ง`,
        cap: "รูปแบบ — จบหัวด้วยทวิภาค แล้วเยื้อง 4 ช่อง", lang: "text" },
      { code: String.raw`age = 20

if age >= 18:
    print("ผู้ใหญ่")`,
        cap: "ตัวอย่าง", lang: "python" },
      { code: String.raw`ผู้ใหญ่`,
        cap: "ผลลัพธ์", lang: "text" },
      { h: "if / else — มีทางเลือกสำรอง" },
      { code: String.raw`if เงื่อนไข:
    คำสั่งเมื่อจริง
else:
    คำสั่งเมื่อเท็จ`,
        cap: "รูปแบบ", lang: "text" },
      { code: String.raw`age = 15

if age >= 18:
    print("ผู้ใหญ่")
else:
    print("ยังไม่ถึงเกณฑ์")`,
        cap: "ตัวอย่าง", lang: "python" },
      { code: String.raw`ยังไม่ถึงเกณฑ์`,
        cap: "ผลลัพธ์", lang: "text" },
      { h: "if / elif / else — หลายทางเลือก" },
      { code: String.raw`if เงื่อนไขที่หนึ่ง:
    คำสั่ง
elif เงื่อนไขที่สอง:
    คำสั่ง
elif เงื่อนไขที่สาม:
    คำสั่ง
else:
    คำสั่งเมื่อไม่ตรงข้อไหนเลย`,
        cap: "รูปแบบ — `elif` มีกี่ตัวก็ได้ ส่วน `else` มีได้ไม่เกินหนึ่ง", lang: "text" },
      { code: String.raw`score = 75

if score >= 80:
    grade = "A"
elif score >= 70:
    grade = "B"
elif score >= 60:
    grade = "C"
else:
    grade = "F"

print(f"ได้เกรด {grade}")`,
        cap: "ตัวอย่าง", lang: "python" },
      { code: String.raw`ได้เกรด B`,
        cap: "ผลลัพธ์", lang: "text" },
      { note: "**ตรวจจากบนลงล่าง เจออันแรกที่จริงแล้วหยุดทันที** ที่เหลือไม่ถูกตรวจเลย ดังนั้นถ้าสลับให้ `score >= 60` ขึ้นก่อน คนได้ 75 จะได้เกรด C — **ลำดับของเงื่อนไขคือส่วนหนึ่งของตรรกะ**" },
      { h: "เงื่อนไขซ้อนกัน และการรวมเงื่อนไข" },
      { code: String.raw`age = 20
has_ticket = True

# ซ้อนกัน
if age >= 18:
    if has_ticket:
        print("เข้าได้")
    else:
        print("ต้องซื้อตั๋วก่อน")
else:
    print("อายุไม่ถึง")

# รวมด้วย and — อ่านง่ายกว่าเมื่อทำได้
if age >= 18 and has_ticket:
    print("เข้าได้")

# or คือขอแค่ข้อใดข้อหนึ่ง
if age < 3 or age > 60:
    print("ได้ส่วนลด")

# not คือกลับค่า
if not has_ticket:
    print("ยังไม่มีตั๋ว")`,
        cap: "ถ้ารวมด้วย and ได้ ให้รวม — ซ้อนสามชั้นเมื่อไหร่ควรแยกเป็นฟังก์ชัน", lang: "python" },
      { h: "if บรรทัดเดียว และค่าที่เลือกด้วยเงื่อนไข" },
      { code: String.raw`age = 20

# เขียนบรรทัดเดียวได้ แต่ใช้เมื่อสั้นจริงเท่านั้น
if age >= 18: print("ผู้ใหญ่")

# เลือกค่าด้วยเงื่อนไข — รูปแบบ ค่าเมื่อจริง if เงื่อนไข else ค่าเมื่อเท็จ
status = "ผู้ใหญ่" if age >= 18 else "เยาวชน"
print(status)                      # ผู้ใหญ่

# ใช้ซ้อนได้ แต่พออ่านยากให้กลับไปใช้ if ธรรมดา
size = "ใหญ่" if age > 60 else "กลาง" if age > 18 else "เล็ก"`,
        cap: "สองบรรทัดสุดท้ายคือสิ่งที่ภาษาอื่นเรียกว่า ternary", lang: "python" },
      { h: "match — เทียบหลายค่าแบบเป็นระเบียบ (3.10 ขึ้นไป)" },
      { code: String.raw`command = "start"

match command:
    case "start":
        print("เริ่มทำงาน")
    case "stop":
        print("หยุด")
    case "pause" | "hold":          # ตรงกับค่าใดค่าหนึ่ง
        print("พัก")
    case _:                          # กรณีที่เหลือทั้งหมด
        print(f"ไม่รู้จักคำสั่ง {command}")`,
        cap: "คล้าย switch ของภาษาอื่น แต่ `case _` คือ default", lang: "python" },
      { h: "while — ทำซ้ำจนกว่าเงื่อนไขจะเป็นเท็จ" },
      { code: String.raw`while เงื่อนไข:
    คำสั่ง`,
        cap: "รูปแบบ", lang: "text" },
      { code: String.raw`count = 1
while count <= 3:
    print(f"รอบที่ {count}")
    count += 1          # ลืมบรรทัดนี้ = วนไม่รู้จบ กด Ctrl+C เพื่อหยุด
print("จบ")`,
        cap: "ตัวอย่าง", lang: "python" },
      { code: String.raw`รอบที่ 1
รอบที่ 2
รอบที่ 3
จบ`,
        cap: "ผลลัพธ์", lang: "text" },
      { h: "for — ทำกับสมาชิกทีละตัว" },
      { code: String.raw`for ตัวแปร in สิ่งที่วนได้:
    คำสั่ง`,
        cap: "รูปแบบ", lang: "text" },
      { code: String.raw`for fruit in ["แอปเปิล", "กล้วย"]:
    print(fruit)

for letter in "abc":
    print(letter)

for i in range(3):          # 0 1 2
    print(i)

for i in range(1, 4):       # 1 2 3
    print(i)

for i in range(0, 10, 3):   # 0 3 6 9
    print(i)

for index, value in enumerate(["a", "b"]):
    print(index, value)     # 0 a / 1 b`,
        cap: "`range` หยุดก่อนตัวสุดท้ายเสมอ", lang: "python" },
      { h: "break / continue / else ของลูป" },
      { code: String.raw`for i in range(5):
    if i == 3:
        break               # ออกจากลูปทันที
    print(i)                # 0 1 2

for i in range(5):
    if i % 2 == 0:
        continue            # ข้ามไปรอบถัดไป
    print(i)                # 1 3

for i in range(3):
    print(i)
else:
    print("ลูปจบโดยไม่เจอ break")   # ทำงานเมื่อไม่มีการ break`,
        cap: "`else` ของลูปเป็นของเฉพาะ Python และมีประโยชน์ตอนค้นหา", lang: "python" },
      { h: "ฟังก์ชัน" },
      { code: String.raw`def ชื่อฟังก์ชัน(พารามิเตอร์):
    """คำอธิบาย"""
    return ค่าที่ส่งกลับ`,
        cap: "รูปแบบ", lang: "text" },
      { code: String.raw`def greet(name):
    """ทักทายหนึ่งคน"""
    return f"สวัสดี {name}"


print(greet("สมชาย"))       # สวัสดี สมชาย


def add(a, b=10):            # b มีค่าเริ่มต้น
    return a + b


print(add(5))                # 15
print(add(5, 20))            # 25
print(add(b=1, a=2))         # 3   ระบุชื่อได้ ลำดับไม่สำคัญ


def stats(numbers):
    return min(numbers), max(numbers)     # คืนสองค่า


low, high = stats([3, 1, 4])
print(low, high)             # 1 4`,
        cap: "ค่าเริ่มต้น การเรียกด้วยชื่อ และการคืนหลายค่า", lang: "python" },
      { note: "ฟังก์ชันที่ไม่มี `return` คืน `None` — `result = print(\"hi\")` ทำให้ `result` เป็น `None` ไม่ใช่ข้อความ นี่คือที่มาของ `NoneType` ที่โผล่ใน error บ่อย ๆ" },
      { h: "type hint — บอกชนิดให้คนและเครื่องอ่าน" },
      { code: String.raw`def ชื่อ(พารามิเตอร์: ชนิด) -> ชนิดที่คืน:`,
        cap: "รูปแบบ — 42 บังคับตั้งแต่ Module 01", lang: "text" },
      { code: String.raw`def add(a: int, b: int) -> int:
    return a + b


def greet(name: str) -> str:
    return f"สวัสดี {name}"


def find(items: list[str], target: str) -> str | None:
    """คืนของที่เจอ หรือ None ถ้าไม่เจอ"""
    for item in items:
        if item == target:
            return item
    return None


def show(text: str) -> None:      # ไม่คืนอะไร ใช้ None
    print(text)`,
        cap: "`|` คือ 'อย่างใดอย่างหนึ่ง' และ `None` คือ 'ไม่คืนค่า'", lang: "python" }
    ],

    architecture: [
      { h: "list — ของเรียงลำดับ แก้ได้" },
      { code: String.raw`ชื่อ = [ค่า, ค่า, ค่า]`,
        cap: "รูปแบบ", lang: "text" },
      { code: String.raw`items = ["a", "b", "c"]

print(items[0])          # a       ตัวแรก
print(items[-1])         # c       ตัวสุดท้าย
print(items[0:2])        # ['a', 'b']
print(len(items))        # 3
print("a" in items)      # True

items.append("d")        # ต่อท้าย
items.insert(0, "z")     # แทรกตำแหน่ง 0
items.remove("b")        # ลบตัวที่มีค่านี้ตัวแรก
last = items.pop()       # ดึงตัวท้ายออกมา
items.sort()             # เรียงตัวเดิม คืน None
print(items)             # ['a', 'c', 'z']

print(sorted([3, 1, 2])) # [1, 2, 3]   คืนลิสต์ใหม่`,
        cap: "`.sort()` แก้ตัวเดิม · `sorted()` คืนตัวใหม่", lang: "python" },
      { h: "dict — คู่คีย์กับค่า" },
      { code: String.raw`ชื่อ = {คีย์: ค่า, คีย์: ค่า}`,
        cap: "รูปแบบ", lang: "text" },
      { code: String.raw`student = {"name": "สมชาย", "age": 20}

print(student["name"])            # สมชาย
print(student.get("email"))       # None      ไม่พังเมื่อไม่มีคีย์
print(student.get("email", "-"))  # -         ค่าสำรอง
print("name" in student)          # True      ตรวจที่คีย์

student["age"] = 21               # แก้ค่าเดิม
student["email"] = "a@b.c"        # เพิ่มคีย์ใหม่
del student["email"]              # ลบ

for key, value in student.items():
    print(key, value)

print(list(student.keys()))       # ['name', 'age']
print(list(student.values()))     # ['สมชาย', 21]`,
        cap: "`student[\"ไม่มี\"]` จะพังด้วย KeyError ส่วน `.get()` ไม่พัง", lang: "python" },
      { h: "tuple และ set" },
      { code: String.raw`point = (3, 4)           # tuple — สร้างแล้วแก้ไม่ได้
x, y = point             # แกะออกเป็นสองตัวแปร
print(x, y)              # 3 4
point[0] = 9             # TypeError

unique = {1, 2, 2, 3}    # set — ไม่ซ้ำ ไม่มีลำดับ
print(unique)            # {1, 2, 3}
print(2 in unique)       # True
print({1, 2} & {2, 3})   # {2}    มีทั้งคู่
print({1, 2} | {2, 3})   # {1, 2, 3}  รวม
print({1, 2} - {2, 3})   # {1}    มีเฉพาะฝั่งซ้าย`,
        cap: "tuple ใช้กับค่าที่ไม่ควรเปลี่ยน · set ใช้เมื่อสนใจแค่มี/ไม่มี", lang: "python" },
      { h: "comprehension — สร้างชุดใหม่ในบรรทัดเดียว" },
      { code: String.raw`[นิพจน์ for ตัวแปร in ชุดข้อมูล if เงื่อนไข]`,
        cap: "รูปแบบ — ส่วน `if` จะมีหรือไม่มีก็ได้", lang: "text" },
      { code: String.raw`numbers = [1, 2, 3, 4, 5]

print([n * n for n in numbers])                  # [1, 4, 9, 16, 25]
print([n for n in numbers if n % 2 == 0])        # [2, 4]
print({w: len(w) for w in ["ab", "abc"]})        # {'ab': 2, 'abc': 3}
print({n % 3 for n in numbers})                  # {0, 1, 2}`,
        cap: "ใช้ได้กับ list, dict และ set", lang: "python" },
      { h: "จัดการข้อผิดพลาด" },
      { code: String.raw`try:
    คำสั่งที่อาจพัง
except ชนิดของข้อผิดพลาด:
    คำสั่งเมื่อพัง
else:
    คำสั่งเมื่อไม่พัง
finally:
    คำสั่งที่ทำเสมอ`,
        cap: "รูปแบบ — `else` และ `finally` จะมีหรือไม่มีก็ได้", lang: "text" },
      { code: String.raw`try:
    age = int(input("อายุ: "))
except ValueError:
    print("ต้องเป็นตัวเลข")
else:
    print(f"ปีหน้าอายุ {age + 1}")
finally:
    print("จบการรับค่า")

# โยนข้อผิดพลาดเอง
def withdraw(balance, amount):
    if amount > balance:
        raise ValueError("ยอดเงินไม่พอ")
    return balance - amount`,
        cap: "จับให้แคบที่สุดเท่าที่เกิดขึ้นได้จริง", lang: "python" },
      { h: "ไฟล์" },
      { code: String.raw`with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("บรรทัดแรก\n")

with open("notes.txt", "r", encoding="utf-8") as f:
    print(f.read())

with open("notes.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.rstrip())

with open("notes.txt", "a", encoding="utf-8") as f:
    f.write("ต่อท้าย\n")`,
        cap: "`w` ทับของเดิม · `r` อ่าน · `a` ต่อท้าย — และใส่ encoding เสมอ", lang: "python" },
      { h: "คลาส" },
      { code: String.raw`class ชื่อคลาส:
    def __init__(self, พารามิเตอร์):
        self.แอตทริบิวต์ = ค่า

    def ชื่อเมธอด(self):
        return ค่า`,
        cap: "รูปแบบ — `self` เป็นพารามิเตอร์แรกของทุกเมธอด", lang: "text" },
      { code: String.raw`class Student:
    """นักเรียนหนึ่งคน"""

    def __init__(self, name: str, age: int) -> None:
        self.name = name
        self.age = age
        self.scores: list[int] = []

    def add_score(self, score: int) -> None:
        self.scores.append(score)

    def average(self) -> float:
        if not self.scores:
            return 0.0
        return sum(self.scores) / len(self.scores)


student = Student("สมชาย", 20)
student.add_score(80)
student.add_score(90)
print(student.name, student.average())      # สมชาย 85.0`,
        cap: "`__init__` ทำงานอัตโนมัติตอนสร้าง", lang: "python" },
      { code: String.raw`class Person:
    def __init__(self, name: str) -> None:
        self.name = name

    def show(self) -> None:
        print(f"ชื่อ: {self.name}")


class Student(Person):                   # สืบทอดจาก Person
    def __init__(self, name: str, school: str) -> None:
        super().__init__(name)           # เรียก __init__ ของแม่
        self.school = school

    def show(self) -> None:
        super().show()                   # เรียกเมธอดของแม่
        print(f"โรงเรียน: {self.school}")


Student("สมชาย", "42").show()`,
        cap: "วงเล็บหลังชื่อคลาสคือคลาสแม่", lang: "python" }
    ],

    dataflow: [
      { h: "รับค่าจากผู้ใช้" },
      { code: String.raw`answer = input("ข้อความชวนพิมพ์: ")`,
        cap: "รูปแบบ — คืนค่าเป็นข้อความเสมอ", lang: "text" },
      { code: String.raw`name = input("ชื่อ: ")
age = int(input("อายุ: "))        # ต้องแปลงเอง
print(f"{name} อายุ {age}")`,
        cap: "ลืม `int()` แล้ว `age + 1` จะพังด้วย TypeError", lang: "python" },
      { h: "รับค่าจากบรรทัดคำสั่ง" },
      { code: String.raw`import sys

print(sys.argv)          # ['prog.py', 'a', 'b']
print(sys.argv[0])       # prog.py   <- ชื่อสคริปต์ ไม่ใช่อาร์กิวเมนต์
print(sys.argv[1:])      # ['a', 'b'] <- ที่ผู้ใช้พิมพ์จริง

if len(sys.argv) < 2:
    print(f"วิธีใช้: python3 {sys.argv[0]} <ค่า>")
    sys.exit(1)`,
        cap: "$ python3 prog.py a b", lang: "python" },
      { h: "import — ใช้ของจากไฟล์อื่น" },
      { code: String.raw`import math                      # ทั้งโมดูล
print(math.sqrt(16))             # 4.0

from math import sqrt            # เฉพาะชื่อที่ต้องการ
print(sqrt(16))                  # 4.0

from math import sqrt as root    # เปลี่ยนชื่อที่ใช้
print(root(16))                  # 4.0

import mytools                   # ไฟล์ mytools.py ของเราเอง
print(mytools.helper())`,
        cap: "ไฟล์ `.py` ที่อยู่ข้าง ๆ กันคือโมดูลที่ import ได้ทันที", lang: "python" },
      { table: { head: ["โมดูลที่ติดมาให้", "ใช้ทำอะไร", "ตัวอย่าง"], rows: [
        ["`math`", "คณิตศาสตร์", "`math.sqrt(16)`, `math.floor(3.7)`"],
        ["`random`", "สุ่ม", "`random.randint(1, 6)`, `random.choice(items)`"],
        ["`datetime`", "วันเวลา", "`datetime.date.today()`"],
        ["`json`", "อ่านเขียน JSON", "`json.dumps(data)`, `json.loads(text)`"],
        ["`os`", "ระบบไฟล์และสภาพแวดล้อม", "`os.path.exists(path)`"],
        ["`sys`", "อาร์กิวเมนต์และสตรีม", "`sys.argv`, `sys.exit(1)`"]
      ]}},
      { h: "การ์ด __main__" },
      { code: String.raw`def main() -> None:
    print("ทำงาน")


if __name__ == "__main__":
    main()`,
        cap: "รันไฟล์ตรง ๆ = ทำงาน · ถูก import = ให้แค่นิยาม", lang: "python" }
    ],

    tricks: [
      { h: "ตารางเทียบกับภาษาที่มีปีกกา" },
      { table: { head: ["ภาษาแบบ C", "Python"], rows: [
        ["`if (x > 0) { ... }`", "`if x > 0:` แล้วเยื้อง"],
        ["`else if`", "`elif`"],
        ["`&&`, `||`, `!`", "`and`, `or`, `not`"],
        ["`true`, `false`", "`True`, `False` — ตัวแรกใหญ่"],
        ["`null`", "`None`"],
        ["`for (i = 0; i < n; i++)`", "`for i in range(n):`"],
        ["`switch`", "`match` (3.10 ขึ้นไป) หรือ `if/elif`"],
        ["`x++`", "`x += 1` — ไม่มี `++` ใน Python"],
        ["`/* คอมเมนต์ */`", "`#` ทีละบรรทัด"],
        ["`;` ท้ายบรรทัด", "ไม่ต้องมี"]
      ]}},
      { h: "ข้อผิดพลาดของไวยากรณ์ที่เจอบ่อยที่สุด" },
      { table: { head: ["เขียนผิดแบบนี้", "ได้ error", "แก้ยังไง"], rows: [
        ["`if x > 0` (ลืมทวิภาค)", "`SyntaxError: expected ':'`", "เติม `:` ท้ายบรรทัด"],
        ["บรรทัดในบล็อกไม่เยื้อง", "`IndentationError: expected an indented block`", "เยื้อง 4 ช่อง"],
        ["เยื้องไม่เท่ากันในบล็อกเดียว", "`IndentationError: unexpected indent`", "ให้ทุกบรรทัดในบล็อกเยื้องเท่ากัน"],
        ["ปนแท็บกับช่องว่าง", "`TabError`", "ตั้งโปรแกรมแก้ข้อความให้ Tab แทรก 4 ช่องว่าง"],
        ["`if x = 5:`", "`SyntaxError`", "ใช้ `==` เมื่อเปรียบเทียบ"],
        ["`print(\"a\" + 1)`", "`TypeError`", "แปลงชนิดก่อน `\"a\" + str(1)`"],
        ["`True` เขียนเป็น `true`", "`NameError: name 'true' is not defined`", "ตัวแรกต้องใหญ่"],
        ["วงเล็บหรืออัญประกาศไม่ครบคู่", "`SyntaxError` ที่ชี้ **บรรทัดถัดไป**", "ดูบรรทัดก่อนหน้าที่ error ชี้"]
      ]}},
      { note: "`SyntaxError` มักชี้บรรทัดถัดจากบรรทัดที่ผิดจริง เพราะ Python อ่านต่อไปเรื่อย ๆ จนพบว่าประโยคไม่สมบูรณ์ เจอ `SyntaxError` เมื่อไหร่ให้ดูบรรทัดเหนือขึ้นไปหนึ่งบรรทัดก่อนเสมอ" },
      { h: "ทางลัดที่ควรรู้" },
      { code: String.raw`# ตรวจว่าว่างหรือไม่ ใช้ตัวมันเองได้เลย
if items:              # ดีกว่า if len(items) > 0
    ...

# เทียบช่วงเขียนติดกันได้
if 0 <= score <= 100:  # ดีกว่า if score >= 0 and score <= 100
    ...

# วนพร้อมลำดับ
for index, item in enumerate(items):
    ...

# วนสองชุดพร้อมกัน
for name, age in zip(names, ages):
    ...

# ค่าเริ่มต้นเมื่อไม่มีคีย์
value = data.get("key", "ค่าสำรอง")

# สลับค่า
a, b = b, a`,
        cap: "หกบรรทัดนี้ทำให้โค้ดสั้นลงและอ่านง่ายขึ้นทันที", lang: "python" }
    ],

    eval: [
      { qa: [
        { q: "ทำไม Python ไม่ต้องประกาศชนิดของตัวแปร", a: "เพราะชนิดผูกกับ **ค่า** ไม่ได้ผูกกับชื่อ ตอนเขียน `x = 5` ตัว 5 เป็น int อยู่แล้ว ส่วน `x` เป็นแค่ชื่อที่ชี้ไปหามัน เขียน `x = \"abc\"` ต่อได้เลยและไม่ผิด" },
        { q: "`elif` ต่างจากการเขียน `if` ซ้อนกันอย่างไร", a: "`elif` จะถูกตรวจก็ต่อเมื่อเงื่อนไขก่อนหน้าเป็นเท็จ และเมื่อมีอันไหนเป็นจริงแล้ว ที่เหลือจะไม่ถูกตรวจเลย ส่วนการเขียน `if` แยกกันหลายตัว ทุกตัวจะถูกตรวจหมดและอาจทำงานพร้อมกันหลายอัน" },
        { q: "ทำไมการเยื้องถึงสำคัญ", a: "เพราะมันคือไวยากรณ์ Python ใช้ระดับการเยื้องบอกว่าบรรทัดไหนอยู่ในบล็อกไหน แทนปีกกาของภาษาอื่น เยื้องผิดจึงเปลี่ยนความหมายของโปรแกรม หรือทำให้รันไม่ได้เลย" },
        { q: "`=` กับ `==` ต่างกันอย่างไร", a: "`=` คือกำหนดค่าให้ตัวแปร ส่วน `==` คือถามว่าสองค่าเท่ากันไหม การเขียน `if x = 5:` เป็น `SyntaxError` ใน Python ซึ่งช่วยจับความสับสนนี้ให้ตั้งแต่ก่อนรัน" },
        { q: "`input()` คืนค่าเป็นอะไร", a: "เป็นข้อความเสมอ แม้ผู้ใช้จะพิมพ์ตัวเลข ถ้าต้องการเลขต้องแปลงเองด้วย `int()` หรือ `float()` และการแปลงนั้นพังได้ถ้าผู้ใช้พิมพ์อย่างอื่น จึงควรอยู่ใน `try`" },
        { q: "`range(1, 5)` ให้เลขอะไรบ้าง", a: "1, 2, 3, 4 — หยุดก่อนตัวสุดท้ายเสมอ ถ้าอยากได้ถึง 5 ต้องเขียน `range(1, 6)` เมื่อไม่แน่ใจให้ห่อด้วย `list()` แล้วพิมพ์ออกมาดู" },
        { q: "ฟังก์ชันที่ไม่มี `return` คืนอะไร", a: "คืน `None` โดยอัตโนมัติ ดังนั้น `result = print(\"hi\")` จะทำให้ `result` เป็น `None` ไม่ใช่ข้อความ ซึ่งเป็นที่มาของ `NoneType` ที่โผล่ในข้อความ error บ่อย ๆ" },
        { q: "`list` กับ `tuple` ต่างกันตรงไหน", a: "`list` เพิ่มลบแก้ได้ ส่วน `tuple` สร้างแล้วเปลี่ยนไม่ได้ ใช้ `tuple` เมื่อค่าชุดนั้นเป็นก้อนเดียวที่ไม่ควรถูกแก้ เช่นพิกัด หรือค่าหลายตัวที่ฟังก์ชันคืนกลับมา" },
        { q: "`dict[\"key\"]` กับ `dict.get(\"key\")` ต่างกันอย่างไร", a: "แบบแรกจะโยน `KeyError` เมื่อไม่มีคีย์นั้น ส่วนแบบหลังคืน `None` และใส่ค่าสำรองได้ด้วย `get(\"key\", ค่าสำรอง)` เลือกตามว่าการไม่มีคีย์นั้นเป็นข้อผิดพลาดหรือเป็นเรื่องปกติ" },
        { q: "`self` คืออะไร", a: "คืออินสแตนซ์ที่เมธอดกำลังถูกเรียกบนมัน Python ส่งให้เป็นอาร์กิวเมนต์แรกโดยอัตโนมัติ เขียน `student.add_score(80)` แล้วภายในเมธอด `self` จะเป็น `student` ตัวนั้น" },
        { q: "เจอ `SyntaxError` แล้วดูตรงไหน", a: "ดูบรรทัดที่มันชี้ **และบรรทัดเหนือขึ้นไปหนึ่งบรรทัด** เพราะวงเล็บหรืออัญประกาศที่ไม่ครบคู่ทำให้ Python อ่านต่อไปจนถึงบรรทัดถัดไปก่อนจะรู้ว่าผิด" }
      ]}
    ]
  }
});
