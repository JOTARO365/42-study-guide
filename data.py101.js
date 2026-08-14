/* Python 101 — จากศูนย์ถึงจุดที่อ่านโจทย์ Python Module 00 รู้เรื่อง
   เนื้อหาสร้างจาก skill python-101-foundations */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

/* วางไว้หน้าสุดของกลุ่ม Python เพราะเป็นหน้าที่ควรอ่านก่อนหน้าอื่น */
window.TEACHING_DATA.splice(function () {
  var i = window.TEACHING_DATA.map(function (p) { return p.id; }).indexOf("py_series");
  return i < 0 ? window.TEACHING_DATA.length : i;
}(), 0, {
  id: "py_101",
  name: "Python 101",
  tag: {
    th: "เริ่มจากศูนย์จริง ๆ — ยังไม่เคยพิมพ์ Python สักบรรทัดก็อ่านได้ ไล่ตั้งแต่รันโปรแกรมแรก ค่าและชนิด เงื่อนไข ลูป ฟังก์ชัน โครงสร้างข้อมูล error ไฟล์ import คลาส จนถึง type hint ที่ 42 บังคับ",
    en: "From actual zero — readable by someone who has never typed a line of Python. From running your first program through values and types, conditions, loops, functions, data structures, errors, files, imports and classes, to the type hints 42 requires"
  },
  accent: "#0ea5e9",
  sections: {
    principle: [
      { h: "หน้านี้สำหรับใคร" },
      { p: "สำหรับคนที่ยังไม่เคยเขียน Python มาก่อนเลย — หรือไม่เคยเขียนโปรแกรมอะไรเลยก็ได้ ทุกหัวข้อมีโค้ดที่พิมพ์ตามแล้วรันได้ทันที และสั้นพอที่จะพิมพ์เองโดยไม่ต้องก็อป" },
      { note: "กฎข้อเดียวของหน้านี้: **ทุกหัวข้อจบด้วยสิ่งที่รันได้** อ่านทฤษฎีอย่างเดียวไม่พอ ต้องเห็นผลลัพธ์ของตัวเองก่อนถึงจะเชื่อ ลองเปลี่ยนตัวเลขในตัวอย่างแล้วรันใหม่ทุกครั้ง" },
      { h: "Python คืออะไร" },
      { p: "ภาษาที่เขียนแล้ว **รันได้เลย** ไม่ต้องคอมไพล์ก่อน เขียนไฟล์ข้อความธรรมดาที่ลงท้ายด้วย `.py` แล้วสั่งให้ Python อ่านทีละบรรทัดจากบนลงล่าง" },
      { p: "ผลที่ตามมาคือสิ่งที่ทำให้มันเหมาะกับการเริ่มต้น: แก้แล้วรันได้ทันที ไม่มีขั้นตอนกลาง และข้อความ error ก็บอกบรรทัดที่พังตรง ๆ" },
      { h: "เตรียมเครื่อง — สองอย่างเท่านั้น" },
      { table: { head: ["ต้องมี", "ตรวจยังไง"], rows: [
        ["ตัว Python เอง เวอร์ชัน 3.10 ขึ้นไป", "`python3 --version`"],
        ["โปรแกรมแก้ข้อความอะไรก็ได้", "VS Code, nano, Notepad ก็ได้ทั้งนั้น"]
      ]}},
      { p: "ไม่ต้องมี IDE ไม่ต้องมี notebook ไม่ต้องติดตั้งไลบรารีอะไรเพิ่มทั้งสิ้น หน้านี้ทั้งหน้าใช้แค่ `python3` กับไฟล์ข้อความ" },
      { h: "สามวิธีรัน Python" },
      { code: String.raw`# 1) REPL — พิมพ์ทีละบรรทัด เห็นผลทันที เหมาะกับการลองของ
$ python3
>>> 2 + 3
5
>>> exit()

# 2) ไฟล์ — วิธีที่ใช้จริงตลอดหน้านี้
$ python3 hello.py

# 3) บรรทัดเดียวจบ — เอาไว้ตรวจอะไรเร็ว ๆ
$ python3 -c "print(2 + 3)"`,
        cap: "REPL เอาไว้ทดลอง ไฟล์เอาไว้ทำงานจริง", lang: "bash" },
      { h: "โปรแกรมแรก" },
      { code: String.raw`# hello.py
print("Hello, world!")
print("2 + 3 =", 2 + 3)`,
        cap: "hello.py", lang: "python" },
      { code: String.raw`$ python3 hello.py
Hello, world!
2 + 3 = 5`,
        cap: "ผลลัพธ์ที่ต้องได้", lang: "bash" },
      { p: "`print()` คือสิ่งเดียวที่ทำให้เห็นว่าโปรแกรมทำอะไรอยู่ และจะเป็นเครื่องมือ debug หลักไปอีกนาน — ตอนงงว่าตัวแปรมีค่าอะไร ให้ `print` มันออกมาดู ไม่ต้องเดา" },
      { h: "สิ่งที่ Python อ่านข้าม" },
      { code: String.raw`# บรรทัดที่ขึ้นต้นด้วย # คือคอมเมนต์ Python ข้ามไปเลย
price = 100  # เขียนต่อท้ายโค้ดก็ได้

"""
สามอัญประกาศคือสตริงหลายบรรทัด
วางไว้บนสุดของไฟล์หรือของฟังก์ชันเมื่อไหร่ มันคือเอกสารกำกับ
"""`,
        cap: "คอมเมนต์เขียนไว้บอกว่า 'ทำไม' ไม่ใช่ 'ทำอะไร'", lang: "python" },
      { h: "หน้านี้พาไปถึงไหน" },
      { table: { head: ["แท็บ", "ได้อะไร"], rows: [
        ["ค่า ชนิด และชื่อ", "ตัวเลข ข้อความ ตัวแปร และเรื่องที่คนพลาดมากที่สุดคือ 'ตัวแปรคือชื่อ ไม่ใช่กล่อง'"],
        ["เงื่อนไข ลูป ฟังก์ชัน", "ทำให้โปรแกรมตัดสินใจได้ ทำซ้ำได้ และแยกเป็นชิ้นที่ตั้งชื่อได้"],
        ["โครงสร้างข้อมูล", "list, dict, tuple, set — เก็บของหลายชิ้น และเลือกให้ถูกชนิด"],
        ["error ไฟล์ และ import", "อ่าน traceback ให้เป็น จับ error และแตกโปรแกรมเป็นหลายไฟล์"],
        ["คลาส & เขียนโปรแกรมจริง", "คลาส type hint และโปรแกรมสมบูรณ์หนึ่งตัวที่ผ่านมาตรฐาน 42"],
        ["กับดักมือใหม่", "16 ข้อที่ทุกคนพลาดเหมือนกันหมด เรียงตามลำดับที่มักเจอ"]
      ]}},
      { p: "จบหน้านี้แล้วไปต่อที่ **Python Modules 00–04** ได้ทันที — โจทย์ข้อแรกของ 42 ใช้แค่เนื้อหาสี่แท็บแรกของหน้านี้" }
    ],

    theory: [
      { h: "ค่ามีชนิด และชนิดเป็นตัวกำหนดว่าทำอะไรได้" },
      { table: { head: ["ชนิด", "ตัวอย่าง", "ใช้เก็บอะไร"], rows: [
        ["`int`", "`42`, `-7`, `0`", "จำนวนเต็ม ไม่จำกัดขนาด"],
        ["`float`", "`3.14`, `-0.5`, `2.0`", "จำนวนที่มีทศนิยม"],
        ["`str`", "`\"สวัสดี\"`, `'a'`", "ข้อความ"],
        ["`bool`", "`True`, `False`", "จริงหรือเท็จ (ตัว T และ F ใหญ่)"],
        ["`None`", "`None`", "ไม่มีค่า — ต่างจาก 0 และต่างจากข้อความว่าง"]
      ]}},
      { code: String.raw`print(type(42))        # <class 'int'>
print(type(3.14))      # <class 'float'>
print(type("42"))      # <class 'str'>
print(type(True))      # <class 'bool'>
print(type(None))      # <class 'NoneType'>`,
        cap: "ถาม Python ตรง ๆ ได้ว่าอะไรคือชนิดอะไร ไม่ต้องเดา", lang: "python" },
      { note: "`type(x)` กับ `dir(x)` ไม่ใช่เรื่องขั้นสูง มันคือเครื่องมือสอนตัวเอง — `dir(\"abc\")` บอกว่าสตริงทำอะไรได้บ้างทั้งหมด" },
      { h: "ตัวแปรคือชื่อ ไม่ใช่กล่อง" },
      { p: "นี่คือแนวคิดที่ถ้าเข้าใจผิดตั้งแต่แรก จะงงไปอีกหลายเดือน ในภาษาอื่นตัวแปรอาจเป็นกล่องที่เก็บค่าไว้ข้างใน แต่ใน Python **ตัวแปรคือป้ายชื่อที่แปะไว้บนวัตถุ**" },
      { code: String.raw`a = [1, 2]
b = a           # ไม่ได้ copy — แค่แปะป้ายชื่อที่สองบนลิสต์เดิม
b.append(3)

print(a)        # [1, 2, 3]   <- a เปลี่ยนด้วย เพราะเป็นตัวเดียวกัน
print(a is b)   # True        <- วัตถุเดียวกันจริง ๆ
print(id(a) == id(b))   # True`,
        cap: "ป้ายสองป้าย วัตถุเดียว", lang: "python" },
      { code: String.raw`a = [1, 2]
b = a.copy()    # หรือ list(a) หรือ a[:]
b.append(3)

print(a)        # [1, 2]      <- คราวนี้ไม่กระทบกัน
print(a is b)   # False`,
        cap: "อยากได้อีกตัว ต้องบอกให้ copy", lang: "python" },
      { p: "วาดภาพนี้ให้ติดตาครั้งเดียว แล้วบั๊กเรื่องข้อมูลเปลี่ยนเองโดยไม่รู้ตัวจะหายไปเกือบทั้งหมด รวมถึงกับดัก 'ค่าเริ่มต้นที่แก้ไขได้' ที่จะเจอในแท็บสุดท้าย" },
      { h: "แก้ได้ กับ แก้ไม่ได้" },
      { table: { head: ["แก้ในที่ได้ (mutable)", "แก้ไม่ได้ (immutable)"], rows: [
        ["`list`, `dict`, `set`", "`int`, `float`, `str`, `bool`, `tuple`"],
        ["`items.append(4)` เปลี่ยนตัวเดิม", "`name.upper()` สร้างตัวใหม่ ตัวเดิมไม่ขยับ"]
      ]}},
      { code: String.raw`name = "somchai"
name.upper()            # <- คำนวณแล้วทิ้ง ไม่มีอะไรเกิดขึ้น
print(name)             # somchai

name = name.upper()     # <- ต้องรับค่ากลับมา
print(name)             # SOMCHAI`,
        cap: "บั๊กเงียบที่สุดของมือใหม่: เรียกเมธอดแล้วไม่รับค่า", lang: "python" },
      { h: "ตัวเลขและเลขคณิต" },
      { code: String.raw`print(7 + 2)    # 9
print(7 - 2)    # 5
print(7 * 2)    # 14
print(7 / 2)    # 3.5    <- / ให้ float เสมอ แม้หารลงตัว
print(7 // 2)   # 3      <- // ปัดลง
print(7 % 2)    # 1      <- เศษ
print(7 ** 2)   # 49     <- ยกกำลัง

print(8 / 2)    # 4.0    <- ไม่ใช่ 4
print(-7 // 2)  # -4     <- ปัดลง ไม่ใช่ปัดเข้าหาศูนย์`,
        cap: "สองบรรทัดสุดท้ายคือที่ที่คนสะดุด", lang: "python" },
      { note: "`0.1 + 0.2` ไม่เท่ากับ `0.3` — ไม่ใช่บั๊กของ Python แต่เป็นเพราะเศษส่วนฐานสองเก็บทศนิยมพวกนี้ตรง ๆ ไม่ได้ ถ้าต้องเทียบให้ใช้ค่าความคลาดเคลื่อน และถ้าเป็นเรื่องเงินให้ใช้โมดูล `decimal`" },
      { h: "ข้อความ" },
      { code: String.raw`name = "Somchai"
age = 20

# f-string — วิธีที่ควรใช้ ใส่ f ไว้หน้าอัญประกาศ
print(f"{name} อายุ {age} ปี")
print(f"ปีหน้าอายุ {age + 1}")      # ใส่นิพจน์ได้เลย
print(f"{3.14159:.2f}")            # 3.14 — ทศนิยม 2 ตำแหน่ง

# ต่อสตริงด้วย + ได้ แต่ต้องเป็นสตริงทั้งคู่
print("อายุ " + str(age))          # ต้องแปลงก่อน`,
        cap: "f-string อ่านง่ายกว่าและพลาดยากกว่า", lang: "python" },
      { code: String.raw`text = "  Hello World  "
print(text.strip())            # "Hello World"  ตัดช่องว่างหัวท้าย
print(text.strip().lower())    # "hello world"
print("a,b,c".split(","))      # ['a', 'b', 'c']
print("-".join(["a", "b"]))    # "a-b"
print("hello".replace("l", "L"))   # "heLLo"
print(len("hello"))            # 5
print("hello"[0])              # h    ตัวแรกคือ index 0
print("hello"[-1])             # o    ติดลบคือนับจากท้าย
print("hello"[1:4])            # ell  ตั้งแต่ 1 ถึงก่อน 4`,
        cap: "เมธอดของสตริงที่ใช้บ่อยที่สุด", lang: "python" },
      { h: "รับค่าจากผู้ใช้ — และกับดักแรกของทุกคน" },
      { code: String.raw`age = input("อายุเท่าไหร่: ")
print(age + 1)      # TypeError: can only concatenate str (not "int") to str`,
        cap: "input() คืนค่าเป็นสตริงเสมอ แม้ผู้ใช้พิมพ์ตัวเลข", lang: "python" },
      { code: String.raw`age = int(input("อายุเท่าไหร่: "))
print(age + 1)      # ทำงานได้

# แต่ถ้าผู้ใช้พิมพ์ "abc" บรรทัด int() จะพัง
# วิธีจัดการอยู่ในแท็บ error ไฟล์ และ import`,
        cap: "แปลงชนิดก่อนใช้", lang: "python" },
      { h: "จริงและเท็จ" },
      { code: String.raw`print(5 > 3)        # True
print(5 == 5)       # True   <- == คือเปรียบเทียบ
print(5 != 3)       # True
print(5 >= 5)       # True

# and / or / not ใช้คำ ไม่ใช่สัญลักษณ์
print(True and False)   # False
print(True or False)    # True
print(not True)         # False`,
        cap: "= คือกำหนดค่า, == คือเปรียบเทียบ", lang: "python" },
      { p: "Python ยอมให้เอาค่าที่ไม่ใช่ `bool` มาใช้ในเงื่อนไขได้ เรียกว่า **truthiness** — ของที่ 'ว่าง' นับเป็นเท็จทั้งหมด" },
      { table: { head: ["นับเป็นเท็จ", "นับเป็นจริง"], rows: [
        ["`0`, `0.0`", "ตัวเลขอื่นทุกตัว รวม `-1`"],
        ["`\"\"` ข้อความว่าง", "ข้อความที่มีอะไรอยู่ รวม `\"0\"` และ `\" \"`"],
        ["`[]`, `{}`, `set()` ตัวเปล่า", "คอลเลกชันที่มีสมาชิกอย่างน้อยหนึ่ง"],
        ["`None`, `False`", "`True`"]
      ]}},
      { code: String.raw`items = []
if items:
    print("มีของ")
else:
    print("ว่าง")          # <- อันนี้ทำงาน

# เขียนแบบนี้ดีกว่า len(items) > 0 เพราะสั้นและเป็นสำนวนมาตรฐาน`,
        cap: "ใช้ตัวคอลเลกชันเองในเงื่อนไขได้เลย", lang: "python" },
      { note: "`\"0\"` เป็นจริง เพราะเป็นข้อความที่มีตัวอักษรหนึ่งตัว ไม่ใช่เลขศูนย์ — นี่คือเหตุผลที่ต้องแปลงชนิดก่อนเทียบเสมอ" }
    ],

    foundations: [
      { h: "การเยื้องคือไวยากรณ์ ไม่ใช่ความสวยงาม" },
      { p: "ภาษาอื่นใช้ปีกกาบอกว่าโค้ดก้อนไหนอยู่ในเงื่อนไข Python ใช้ **การเยื้องเข้าไป** แทน ถ้าเยื้องผิด โปรแกรมทำงานผิดหรือไม่ยอมรันเลย" },
      { code: String.raw`score = 75

if score >= 50:
    print("ผ่าน")          # เยื้อง 4 ช่อง = อยู่ในเงื่อนไข
    print("ยินดีด้วย")     # ยังอยู่ในเงื่อนไข
print("จบการตรวจ")         # ไม่เยื้อง = อยู่นอก ทำงานเสมอ`,
        cap: "4 ช่องว่าง คือมาตรฐาน", lang: "python" },
      { note: "ตั้งค่าโปรแกรมแก้ข้อความให้ปุ่ม Tab แทรก **4 ช่องว่าง** ตั้งแต่วันแรก การผสมแท็บกับช่องว่างทำให้เกิด `TabError` ที่มองด้วยตาไม่เห็น และเป็น error ที่มือใหม่แก้เองไม่ได้" },
      { h: "if / elif / else" },
      { code: String.raw`score = 75

if score >= 80:
    grade = "A"
elif score >= 70:
    grade = "B"
elif score >= 60:
    grade = "C"
else:
    grade = "F"

print(f"ได้เกรด {grade}")   # ได้เกรด B`,
        cap: "ตรวจจากบนลงล่าง เจออันแรกที่จริงแล้วหยุด", lang: "python" },
      { p: "ลำดับสำคัญ — ถ้าสลับให้ `score >= 60` มาก่อน คนได้ 75 จะได้เกรด C เพราะเงื่อนไขนั้นเป็นจริงก่อน" },
      { h: "while — ทำซ้ำจนกว่าเงื่อนไขจะเป็นเท็จ" },
      { code: String.raw`count = 1
while count <= 5:
    print(count)
    count = count + 1      # ลืมบรรทัดนี้ = วนไม่รู้จบ
print("จบ")`,
        cap: "ต้องมีอะไรบางอย่างที่ทำให้เงื่อนไขเป็นเท็จได้", lang: "python" },
      { code: String.raw`while True:
    answer = input("พิมพ์ quit เพื่อออก: ")
    if answer == "quit":
        break              # ออกจากลูปทันที
    if answer == "":
        continue           # ข้ามไปรอบถัดไป ไม่ทำบรรทัดล่าง
    print(f"ได้รับ: {answer}")`,
        cap: "break ออกจากลูป, continue ข้ามรอบ", lang: "python" },
      { note: "ถ้าโปรแกรมค้าง กด **Ctrl+C** เพื่อหยุด — แล้วไปดูว่าตัวแปรในเงื่อนไขถูกเปลี่ยนค่าจริงหรือเปล่า" },
      { h: "for — ทำกับของทีละชิ้น" },
      { code: String.raw`for fruit in ["แอปเปิล", "กล้วย", "ส้ม"]:
    print(fruit)

for letter in "abc":
    print(letter)

for number in range(5):        # 0 1 2 3 4 — เริ่มที่ 0 ไม่ถึง 5
    print(number)

for number in range(1, 5):     # 1 2 3 4 — ไม่ถึง 5
    print(number)

for number in range(0, 10, 2): # 0 2 4 6 8 — ทีละ 2
    print(number)`,
        cap: "range หยุดก่อนตัวสุดท้ายเสมอ", lang: "python" },
      { code: String.raw`print(list(range(1, 5)))   # [1, 2, 3, 4]`,
        cap: "งงเมื่อไหร่ให้ห่อด้วย list() แล้วดูของจริง", lang: "python" },
      { code: String.raw`items = ["a", "b", "c"]

for index, item in enumerate(items):
    print(index, item)         # 0 a / 1 b / 2 c

names = ["สมชาย", "สมหญิง"]
ages = [20, 22]
for name, age in zip(names, ages):
    print(f"{name} อายุ {age}")`,
        cap: "enumerate เมื่อต้องการลำดับ, zip เมื่อวนสองลิสต์พร้อมกัน", lang: "python" },
      { h: "ฟังก์ชัน — ตั้งชื่อให้โค้ดก้อนหนึ่ง" },
      { code: String.raw`def greet(name):
    """ทักทายหนึ่งคน"""
    return f"สวัสดี {name}"


message = greet("สมชาย")
print(message)                 # สวัสดี สมชาย`,
        cap: "def นิยาม, return ส่งค่ากลับ", lang: "python" },
      { table: { head: ["คำ", "หมายถึง"], rows: [
        ["`def`", "เริ่มนิยามฟังก์ชัน"],
        ["พารามิเตอร์", "ชื่อในวงเล็บตอนนิยาม — `name`"],
        ["อาร์กิวเมนต์", "ค่าจริงตอนเรียก — `\"สมชาย\"`"],
        ["`return`", "ส่งค่ากลับและจบฟังก์ชันทันที"],
        ["ไม่มี `return`", "ฟังก์ชันคืน `None` โดยอัตโนมัติ"]
      ]}},
      { code: String.raw`def add(a, b=10):          # b มีค่าเริ่มต้น
    return a + b

print(add(5))              # 15
print(add(5, 20))          # 25
print(add(b=1, a=2))       # 3   เรียกด้วยชื่อได้ ลำดับไม่สำคัญ`,
        cap: "ค่าเริ่มต้นและการเรียกด้วยชื่อ", lang: "python" },
      { note: "ฟังก์ชันที่ไม่มี `return` คืน `None` — `result = print(\"hi\")` ทำให้ `result` เป็น `None` ไม่ใช่ข้อความ นี่คือที่มาของ `NoneType` ที่โผล่มาใน error บ่อย ๆ" },
      { h: "ขอบเขตของชื่อ" },
      { code: String.raw`total = 0                  # ชื่อระดับไฟล์

def broken():
    total = total + 1      # UnboundLocalError
    return total

def works(current):
    return current + 1     # รับเข้ามา คืนออกไป ไม่ยุ่งกับข้างนอก

total = works(total)
print(total)               # 1`,
        cap: "แตะชื่อข้างนอกด้วยการ assign เมื่อไหร่ Python ถือว่ามันเป็นตัวแปรท้องถิ่นทั้งฟังก์ชัน", lang: "python" },
      { p: "ฟังก์ชันที่ **รับค่าเข้าและคืนค่าออก** ทดสอบง่ายกว่าและพังยากกว่าฟังก์ชันที่ไปแก้ตัวแปรข้างนอก — เป็นนิสัยที่ควรสร้างตั้งแต่ต้น" },
      { h: "ลองรวมทุกอย่าง" },
      { code: String.raw`def grade_of(score):
    """แปลงคะแนนเป็นเกรด"""
    if score >= 80:
        return "A"
    if score >= 70:
        return "B"
    if score >= 60:
        return "C"
    return "F"


scores = [95, 72, 65, 40]
for score in scores:
    print(f"{score} -> {grade_of(score)}")`,
        cap: "ฟังก์ชัน + เงื่อนไข + ลูป ในสิบบรรทัด", lang: "python" },
      { p: "สังเกตว่าใช้ `return` หลายครั้งแทน `elif` ได้ เพราะ `return` จบฟังก์ชันทันที — รูปแบบนี้อ่านง่ายเมื่อแต่ละกิ่งสั้น" },
      { note: "เนื้อหาแท็บนี้กับแท็บก่อนหน้า **ครอบคลุม Python Module 00 ทั้งโมดูล** — แปดข้อของมันคือ print, input, เลขคณิต, เงื่อนไข, ลูป และฟังก์ชัน ไม่มีอะไรเกินนี้" }
    ],

    architecture: [
      { h: "เก็บของหลายชิ้น — เลือกให้ถูกชนิด" },
      { table: { head: ["ชนิด", "เขียนยังไง", "ใช้เมื่อ", "แก้ได้ไหม"], rows: [
        ["`list`", "`[1, 2, 3]`", "ของเรียงลำดับ มีซ้ำได้ เพิ่มลบได้", "ได้"],
        ["`tuple`", "`(1, 2, 3)`", "ของที่จับกลุ่มแล้วไม่เปลี่ยน เช่นพิกัด", "ไม่ได้"],
        ["`dict`", "`{\"a\": 1}`", "จับคู่คีย์กับค่า ค้นด้วยคีย์", "ได้"],
        ["`set`", "`{1, 2, 3}`", "เก็บของไม่ซ้ำ ตรวจว่ามีอยู่ไหม", "ได้"]
      ]}},
      { h: "list — ของเรียงลำดับ" },
      { code: String.raw`items = ["a", "b", "c"]

print(items[0])          # a      ตัวแรก
print(items[-1])         # c      ตัวสุดท้าย
print(items[0:2])        # ['a', 'b']
print(len(items))        # 3

items.append("d")        # ต่อท้าย
items.insert(0, "z")     # แทรกตำแหน่ง 0
items.remove("b")        # ลบตัวที่มีค่านี้ตัวแรก
last = items.pop()       # ดึงตัวท้ายออกมาใช้
print(items)             # ['z', 'a', 'c']

print("a" in items)      # True   ตรวจว่ามีไหม
print(sorted([3, 1, 2])) # [1, 2, 3]  คืนตัวใหม่
numbers = [3, 1, 2]
numbers.sort()           # เรียงตัวเดิมในที่ คืน None
print(numbers)           # [1, 2, 3]`,
        cap: "sorted() คืนลิสต์ใหม่ · .sort() แก้ตัวเดิมแล้วคืน None", lang: "python" },
      { note: "`numbers = numbers.sort()` ทำให้ `numbers` กลายเป็น `None` — เมธอดที่แก้ในที่มักคืน `None` โดยตั้งใจ เพื่อไม่ให้เข้าใจผิดว่าได้ของใหม่มา" },
      { h: "dict — จับคู่คีย์กับค่า" },
      { code: String.raw`student = {"name": "สมชาย", "age": 20}

print(student["name"])            # สมชาย
print(student["email"])           # KeyError: 'email'
print(student.get("email"))       # None       ไม่พังแต่ได้ None
print(student.get("email", "-"))  # -          ใส่ค่าสำรองได้

student["age"] = 21               # แก้ค่าเดิม
student["email"] = "a@b.c"        # เพิ่มคีย์ใหม่
del student["email"]              # ลบ

print("name" in student)          # True   ตรวจที่คีย์ ไม่ใช่ค่า
print(list(student.keys()))       # ['name', 'age']
print(list(student.values()))     # ['สมชาย', 21]

for key, value in student.items():
    print(f"{key}: {value}")`,
        cap: "วนด้วย .items() เมื่อต้องการทั้งคีย์และค่า", lang: "python" },
      { p: "dict **จำลำดับที่ใส่เข้ามา** ตั้งแต่ Python 3.7 — คุณสมบัตินี้คือสิ่งที่ทำให้ 'ตัวแรกที่ให้มาชนะ' ทำได้โดยไม่ต้องเก็บลำดับแยกต่างหาก และเป็นสิ่งที่ Module 03 วัด" },
      { h: "tuple — จับกลุ่มแล้วล็อก" },
      { code: String.raw`point = (3, 4)
x, y = point                 # แกะออกเป็นสองตัวแปร
print(x, y)                  # 3 4

point[0] = 99                # TypeError — tuple แก้ไม่ได้

def min_max(numbers):
    return min(numbers), max(numbers)    # คืนหลายค่า = คืน tuple

low, high = min_max([3, 1, 4])
print(low, high)             # 1 4`,
        cap: "การคืนหลายค่าจากฟังก์ชันคือ tuple โดยปริยาย", lang: "python" },
      { h: "set — ไม่ซ้ำ และไม่มีลำดับ" },
      { code: String.raw`numbers = [1, 2, 2, 3, 3, 3]
unique = set(numbers)
print(unique)                # {1, 2, 3}
print(len(unique))           # 3

a = {1, 2, 3}
b = {2, 3, 4}
print(a & b)                 # {2, 3}     มีทั้งคู่
print(a | b)                 # {1,2,3,4}  รวมกัน
print(a - b)                 # {1}        มีใน a แต่ไม่มีใน b

print(2 in a)                # True — เร็วมากแม้ set ใหญ่`,
        cap: "ใช้ set เมื่อสนใจแค่ว่า 'มีไหม' และ 'ไม่ซ้ำ'", lang: "python" },
      { note: "set **ไม่มีลำดับที่รับประกัน** — อะไรที่จะพิมพ์ออกมาจาก set ต้อง `sorted()` ก่อน ไม่งั้นผลลัพธ์อาจไม่เหมือนเดิมข้ามการรัน และเทสต์จะไม่น่าเชื่อถือ" },
      { h: "comprehension — สร้างลิสต์จากลิสต์" },
      { code: String.raw`numbers = [1, 2, 3, 4, 5]

# เขียนแบบยาว
squares = []
for n in numbers:
    squares.append(n * n)

# เขียนแบบ comprehension — อันเดียวกัน
squares = [n * n for n in numbers]
print(squares)                     # [1, 4, 9, 16, 25]

# ใส่เงื่อนไขได้
evens = [n for n in numbers if n % 2 == 0]
print(evens)                       # [2, 4]

# ใช้กับ dict และ set ได้เหมือนกัน
lengths = {word: len(word) for word in ["ab", "abc"]}
print(lengths)                     # {'ab': 2, 'abc': 3}`,
        cap: "อ่านจากซ้ายไปขวา: เอาอะไร จากไหน กรองอะไร", lang: "python" },
      { p: "comprehension ควรอ่านจบในบรรทัดเดียว ถ้าซ้อนสองชั้นหรือมีเงื่อนไขหลายอัน ให้กลับไปใช้ลูปธรรมดา — สั้นกับอ่านง่ายไม่ใช่สิ่งเดียวกัน" },
      { h: "generator — คำนวณตอนที่ต้องใช้" },
      { code: String.raw`squares = (n * n for n in range(5))    # วงเล็บกลม ไม่ใช่เหลี่ยม

print(sum(squares))       # 30    <- เดินจนหมด
print(sum(squares))       # 0     <- ว่างแล้ว ใช้ได้ครั้งเดียว`,
        cap: "บั๊กเงียบที่สุดของ Module 03", lang: "python" },
      { p: "generator ไม่เก็บผลทั้งหมดไว้ในหน่วยความจำ เหมาะกับข้อมูลใหญ่ แต่ **เดินได้รอบเดียว** ถ้าต้องวนซ้ำให้แปลงเป็น list ก่อน" },
      { h: "เลือกชนิดยังไง" },
      { table: { head: ["คำถาม", "ใช้"], rows: [
        ["ลำดับสำคัญ และมีซ้ำได้", "`list`"],
        ["ค้นด้วยชื่อ ไม่ใช่ตำแหน่ง", "`dict`"],
        ["สนใจแค่ว่ามีหรือไม่มี และห้ามซ้ำ", "`set`"],
        ["จับกลุ่มค่าที่ไม่ควรเปลี่ยน", "`tuple`"]
      ]}},
      { note: "แท็บนี้คือเนื้อหาทั้งหมดของ **Module 03 (Data Quest)** — เจ็ดข้อของมันคือ list, dict, set, tuple, comprehension และ generator" }
    ],

    dataflow: [
      { h: "อ่าน traceback ให้เป็น" },
      { p: "traceback ไม่ใช่ข้อความด่า มันคือรายงานว่าเกิดอะไรที่ไหน **อ่านจากล่างขึ้นบน**" },
      { code: String.raw`Traceback (most recent call last):
  File "app.py", line 12, in <module>
    main()
  File "app.py", line 8, in main
    print(total(numbers))
  File "app.py", line 4, in total
    return sum(values) / len(values)
ZeroDivisionError: division by zero`,
        cap: "ตัวอย่าง traceback", lang: "text" },
      { table: { head: ["บรรทัด", "บอกอะไร"], rows: [
        ["บรรทัดสุดท้าย", "**อะไรพัง** — `ZeroDivisionError: division by zero`"],
        ["บรรทัดเหนือขึ้นไป", "**พังที่ไหน** — `app.py` บรรทัด 4 ในฟังก์ชัน `total`"],
        ["ที่เหลือ", "**มาถึงตรงนั้นได้ยังไง** — `main()` เรียก `total()`"]
      ]}},
      { p: "เมื่อ error เกิดในไลบรารีของคนอื่น ให้มองหา **เฟรมสุดท้ายที่เป็นไฟล์ของเราเอง** นั่นคือจุดที่เราส่งของผิดเข้าไป" },
      { h: "error ที่เจอบ่อย และแปลว่าอะไร" },
      { table: { head: ["ชื่อ", "แปลว่า"], rows: [
        ["`SyntaxError`", "พิมพ์ผิดจนอ่านไม่ออก — ปีกกา วงเล็บ หรือทวิภาคหาย มักอยู่ **ก่อน** บรรทัดที่ฟ้อง"],
        ["`IndentationError` / `TabError`", "เยื้องไม่สม่ำเสมอ หรือปนแท็บกับช่องว่าง"],
        ["`NameError`", "ใช้ชื่อที่ยังไม่มี — พิมพ์ผิด หรือใช้ก่อนกำหนดค่า"],
        ["`TypeError`", "ชนิดกับการกระทำไม่เข้ากัน เช่น `\"5\" + 1`"],
        ["`ValueError`", "ชนิดถูก แต่ค่าใช้ไม่ได้ เช่น `int(\"abc\")`"],
        ["`IndexError`", "ตำแหน่งเกินขอบลิสต์"],
        ["`KeyError`", "คีย์นั้นไม่มีใน dict"],
        ["`AttributeError`", "วัตถุไม่มีสิ่งนั้น — มักแปลว่ามันไม่ใช่ชนิดที่คิด"],
        ["`ZeroDivisionError`", "หารด้วยศูนย์"]
      ]}},
      { h: "จับ error ด้วย try / except" },
      { code: String.raw`try:
    age = int(input("อายุ: "))
except ValueError:
    print("กรุณาพิมพ์เป็นตัวเลข")
else:
    print(f"ปีหน้าอายุ {age + 1}")      # ทำเมื่อไม่มี error
finally:
    print("จบการรับค่า")                # ทำเสมอ ไม่ว่าจะเกิดอะไร`,
        cap: "try / except / else / finally ครบชุด", lang: "python" },
      { note: "**จับให้แคบที่สุดเท่าที่เกิดขึ้นได้จริง** — `except ValueError` บอกว่ารู้ว่าอะไรพลาดได้ ส่วน `except Exception` เปล่า ๆ จะกลืนบั๊กของตัวเองไปด้วย และทำให้หาไม่เจอ นี่คือสิ่งที่ Module 02 วัดทั้งโมดูล" },
      { code: String.raw`def read_age(text):
    """แปลงข้อความเป็นอายุ คืน None ถ้าใช้ไม่ได้"""
    try:
        value = int(text)
    except ValueError:
        return None
    if value < 0:
        return None
    return value


print(read_age("20"))     # 20
print(read_age("abc"))    # None
print(read_age("-5"))     # None`,
        cap: "รูปแบบที่ใช้ได้จริง: จับแล้วคืนค่าที่ผู้เรียกจัดการต่อได้", lang: "python" },
      { h: "สร้าง error ของตัวเอง" },
      { code: String.raw`class TooYoungError(Exception):
    """อายุน้อยเกินกว่าที่ระบบรับได้"""


def register(age):
    if age < 18:
        raise TooYoungError(f"อายุ {age} ยังไม่ถึงเกณฑ์")
    return "ลงทะเบียนสำเร็จ"


try:
    print(register(15))
except TooYoungError as error:
    print(f"ไม่สำเร็จ: {error}")`,
        cap: "raise เพื่อบอกว่าเกิดอะไร, except as เพื่ออ่านข้อความ", lang: "python" },
      { h: "ไฟล์" },
      { code: String.raw`# เขียน — "w" ทับของเดิมทั้งหมด
with open("notes.txt", "w", encoding="utf-8") as handle:
    handle.write("บรรทัดแรก\n")
    handle.write("บรรทัดที่สอง\n")

# อ่านทั้งไฟล์
with open("notes.txt", "r", encoding="utf-8") as handle:
    content = handle.read()
print(content)

# อ่านทีละบรรทัด — ประหยัดหน่วยความจำกับไฟล์ใหญ่
with open("notes.txt", "r", encoding="utf-8") as handle:
    for line in handle:
        print(line.rstrip())      # rstrip ตัด \n ท้ายบรรทัด

# ต่อท้ายโดยไม่ลบของเดิม
with open("notes.txt", "a", encoding="utf-8") as handle:
    handle.write("ต่อท้าย\n")`,
        cap: "ใส่ encoding=\"utf-8\" เสมอ ไม่งั้นภาษาไทยพังบนบางเครื่อง", lang: "python" },
      { p: "`with` ปิดไฟล์ให้อัตโนมัติเมื่อออกจากบล็อก — ไม่ว่าจะออกด้วย `return` ด้วย error หรือจบปกติ นี่คือเหตุผลที่ควรใช้มันเสมอ และเป็นสิ่งที่ **Module 04 บังคับให้เขียนเองก่อน** สามข้อ เพื่อให้เห็นว่ามันทำอะไรให้" },
      { code: String.raw`try:
    with open("missing.txt", "r", encoding="utf-8") as handle:
        print(handle.read())
except FileNotFoundError:
    print("ไม่พบไฟล์")
except PermissionError:
    print("ไม่มีสิทธิ์อ่าน")`,
        cap: "ไฟล์คือโลกภายนอก — พังได้เสมอ ต้องเผื่อไว้", lang: "python" },
      { h: "แตกโปรแกรมเป็นหลายไฟล์" },
      { code: String.raw`# mathtools.py
def add(a, b):
    return a + b

PI = 3.14159`,
        cap: "mathtools.py", lang: "python" },
      { code: String.raw`# app.py — สามวิธี import
import mathtools
print(mathtools.add(1, 2))

from mathtools import add
print(add(1, 2))

from mathtools import add as plus
print(plus(1, 2))`,
        cap: "app.py", lang: "python" },
      { table: { head: ["รูปแบบ", "ได้อะไรมา"], rows: [
        ["`import x`", "ตัวโมดูล — ต้องเรียกผ่าน `x.name`"],
        ["`from x import name`", "ตัวฟังก์ชันเลย — เรียก `name` ตรง ๆ"],
        ["`from x import name as other`", "อันเดิม แต่เปลี่ยนชื่อที่ใช้ในไฟล์นี้"]
      ]}},
      { note: "อย่าตั้งชื่อไฟล์ทับโมดูลมาตรฐาน — ไฟล์ชื่อ `random.py` หรือ `json.py` ของเราจะถูก import แทนตัวจริง แล้ว error ที่ได้จะอ่านไม่รู้เรื่องเลย" },
      { h: "รับค่าจากบรรทัดคำสั่ง" },
      { code: String.raw`# args.py
import sys

print(sys.argv)          # ['args.py', 'a', 'b']  <- ตัวแรกคือชื่อสคริปต์
print(sys.argv[1:])      # ['a', 'b']             <- ที่ผู้ใช้พิมพ์จริง

if len(sys.argv) < 2:
    print(f"วิธีใช้: python3 {sys.argv[0]} <ตัวเลข>...")
    sys.exit(1)          # ออกด้วยรหัสไม่เท่าศูนย์ = บอกว่าไม่สำเร็จ

numbers = []
for text in sys.argv[1:]:
    try:
        numbers.append(int(text))
    except ValueError:
        print(f"ข้าม '{text}' เพราะไม่ใช่ตัวเลข")
print(f"รวมได้ {sum(numbers)}")`,
        cap: "$ python3 args.py 3 4 x  ->  ข้าม 'x' / รวมได้ 7", lang: "python" },
      { p: "`sys.argv` เป็นลิสต์ของสตริงเสมอ เหมือน `input()` — ต้องแปลงชนิดเองทุกครั้ง และ `sys.argv[0]` คือชื่อสคริปต์ ไม่ใช่อาร์กิวเมนต์ตัวแรก ค่าที่ผู้ใช้พิมพ์เริ่มที่ index 1 นี่คือสิ่งที่ **Module 03 ใช้รับพารามิเตอร์** และรายงานค่าที่ผิดรูปแบบโดยไม่หยุดทำงาน" },
      { h: "ของที่ติดมากับ Python อยู่แล้ว" },
      { code: String.raw`import math
print(math.sqrt(16))          # 4.0
print(math.floor(3.7))        # 3

import random
print(random.randint(1, 6))   # เลข 1-6
print(random.choice(["a", "b"]))

import datetime
print(datetime.date.today())

import json
print(json.dumps({"a": 1}))   # '{"a": 1}'`,
        cap: "ไม่ต้องติดตั้งอะไรเพิ่ม มีมาให้แล้ว", lang: "python" },
      { h: "การ์ด __main__" },
      { code: String.raw`def main():
    print("ทำงาน")


if __name__ == "__main__":
    main()`,
        cap: "รันไฟล์ตรง ๆ = ทำงาน · ถูก import = ให้แค่นิยาม", lang: "python" },
      { p: "ตอนไฟล์ถูก import ค่า `__name__` จะเป็นชื่อโมดูล ไม่ใช่ `\"__main__\"` การ์ดนี้จึงทำให้ไฟล์เดียวเป็นได้ทั้งโปรแกรมและไลบรารี — และเป็นคำถามที่ถูกถามตอน evaluation ของ Module 01" }
    ],

    implementation: [
      { h: "คลาส — จับข้อมูลกับพฤติกรรมไว้ด้วยกัน" },
      { p: "ถ้ามี dict หลายอันที่มีคีย์ชุดเดียวกัน และมีฟังก์ชันหลายตัวที่รับ dict พวกนั้นเป็นอาร์กิวเมนต์แรกเสมอ — นั่นคือสัญญาณว่าควรเป็นคลาส" },
      { code: String.raw`class Student:
    """นักเรียนหนึ่งคน"""

    def __init__(self, name, age):
        """สร้างนักเรียนใหม่ — ทำงานตอน Student(...) ถูกเรียก"""
        self.name = name
        self.age = age
        self.scores = []

    def add_score(self, score):
        """บันทึกคะแนนหนึ่งครั้ง"""
        self.scores.append(score)

    def average(self):
        """คะแนนเฉลี่ย คืน 0.0 ถ้ายังไม่มีคะแนน"""
        if not self.scores:
            return 0.0
        return sum(self.scores) / len(self.scores)


student = Student("สมชาย", 20)
student.add_score(80)
student.add_score(90)
print(f"{student.name} เฉลี่ย {student.average()}")   # สมชาย เฉลี่ย 85.0`,
        cap: "self คือตัวอินสแตนซ์เอง ต้องเป็นพารามิเตอร์แรกของทุกเมธอด", lang: "python" },
      { table: { head: ["ส่วน", "คืออะไร"], rows: [
        ["`class Student:`", "พิมพ์เขียว ยังไม่ใช่ตัวจริง"],
        ["`Student(\"สมชาย\", 20)`", "สร้างอินสแตนซ์ — ตัวจริงหนึ่งตัว"],
        ["`__init__`", "ทำงานอัตโนมัติตอนสร้าง ใช้ตั้งค่าเริ่มต้น"],
        ["`self`", "ตัวอินสแตนซ์ที่กำลังถูกเรียก Python ส่งให้เอง"],
        ["`self.name`", "แอตทริบิวต์ — ข้อมูลที่ติดอยู่กับอินสแตนซ์นั้น"]
      ]}},
      { note: "สร้างสถานะใน `__init__` เสมอ ถ้าเขียน `scores = []` ไว้ระดับคลาสแทน นักเรียนทุกคนจะใช้ลิสต์เดียวกัน — บั๊กที่หายากที่สุดอันหนึ่งของมือใหม่" },
      { h: "สืบทอด" },
      { code: String.raw`class Person:
    def __init__(self, name):
        self.name = name

    def show(self):
        print(f"ชื่อ: {self.name}")


class Student(Person):
    def __init__(self, name, school):
        super().__init__(name)      # ให้แม่ตั้งค่าส่วนของแม่
        self.school = school

    def show(self):
        super().show()              # พิมพ์บรรทัดของแม่ก่อน
        print(f"โรงเรียน: {self.school}")


Student("สมชาย", "42").show()`,
        cap: "super() เรียกของแม่ — ทั้งใน __init__ และในเมธอดอื่น", lang: "python" },
      { p: "การก็อป `print` ของแม่มาไว้ในลูกแทนที่จะเรียก `super().show()` คือสิ่งที่ **Module 01 ข้อ 5 หักคะแนน** โดยตรง" },
      { h: "ขีดล่างหนึ่งตัว" },
      { code: String.raw`class Account:
    def __init__(self, balance):
        self._balance = balance     # ขีดล่างเดียว = "อย่าแตะจากข้างนอก"

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("จำนวนเงินต้องมากกว่า 0")
        self._balance += amount

    def balance(self):
        return self._balance`,
        cap: "Python ไม่มี private จริง ขีดล่างคือข้อตกลงระหว่างคน", lang: "python" },
      { p: "ใช้ **ขีดล่างตัวเดียว** ไม่ใช่สองตัว สองตัวจะทำให้ชื่อถูกแปลง ซึ่งทำให้ซับคลาสเข้าถึงยากโดยไม่ได้ประโยชน์อะไรเพิ่ม" },
      { h: "type hint — บอกชนิดให้คนและเครื่องอ่าน" },
      { code: String.raw`def add(a: int, b: int) -> int:
    """บวกจำนวนเต็มสองตัว"""
    return a + b


def greet(name: str) -> str:
    return f"สวัสดี {name}"


def find(items: list[str], target: str) -> str | None:
    """คืนของที่เจอ หรือ None ถ้าไม่เจอ"""
    for item in items:
        if item == target:
            return item
    return None`,
        cap: "หลังชื่อคือชนิดของพารามิเตอร์ หลังลูกศรคือชนิดที่คืน", lang: "python" },
      { p: "Python **ไม่บังคับ** ตอนรัน — ใส่ผิดก็ยังรันได้ ประโยชน์อยู่ที่คนอ่านเข้าใจทันที และเครื่องมือตรวจจับให้ก่อนรัน ซึ่งคือสิ่งที่ 42 บังคับตั้งแต่ Module 01 เป็นต้นไป" },
      { h: "มาตรฐานที่ 42 ตรวจ — เริ่มติดนิสัยตั้งแต่ตอนโปรแกรมยังสิบบรรทัด" },
      { code: String.raw`python3 -m venv .venv
./.venv/bin/pip install flake8 mypy

./.venv/bin/flake8 myfile.py      # สไตล์
./.venv/bin/mypy myfile.py        # ชนิด`,
        cap: "สองคำสั่งนี้คือสิ่งที่ตัดสินคะแนนก่อนตรรกะจะถูกอ่านด้วยซ้ำ", lang: "bash" },
      { table: { head: ["กฎ", "รายละเอียด"], rows: [
        ["ความยาวบรรทัด", "ไม่เกิน 79 ตัวอักษร (ค่าเริ่มต้นของ flake8)"],
        ["การเยื้อง", "4 ช่องว่าง ห้ามแท็บ"],
        ["ชื่อ", "คลาสเป็น `PascalCase` ฟังก์ชันและตัวแปรเป็น `snake_case`"],
        ["บรรทัดว่าง", "2 บรรทัดระหว่างฟังก์ชันระดับบนสุด"],
        ["type hint", "ครบทุกฟังก์ชันและทุกเมธอด"],
        ["error", "ห้ามให้ traceback หลุดต่อหน้าผู้ตรวจ"]
      ]}},
      { h: "โปรแกรมสมบูรณ์หนึ่งตัว" },
      { code: String.raw`#!/usr/bin/env python3
"""สมุดคะแนน — รับคะแนนจากผู้ใช้แล้วสรุปผล"""


def read_score(text: str) -> int | None:
    """แปลงข้อความเป็นคะแนน 0-100 คืน None ถ้าใช้ไม่ได้"""
    try:
        value = int(text)
    except ValueError:
        return None
    if value < 0 or value > 100:
        return None
    return value


def grade_of(score: int) -> str:
    """แปลงคะแนนเป็นเกรด"""
    if score >= 80:
        return "A"
    if score >= 70:
        return "B"
    if score >= 60:
        return "C"
    return "F"


def summarise(scores: list[int]) -> dict[str, float]:
    """สรุปคะแนนทั้งชุด"""
    if not scores:
        return {"count": 0, "average": 0.0, "highest": 0, "lowest": 0}
    return {
        "count": len(scores),
        "average": round(sum(scores) / len(scores), 2),
        "highest": max(scores),
        "lowest": min(scores),
    }


def main() -> None:
    """รับคะแนนจนกว่าผู้ใช้จะพิมพ์ done แล้วสรุป"""
    scores: list[int] = []
    while True:
        text = input("คะแนน (หรือ done): ").strip()
        if text == "done":
            break
        score = read_score(text)
        if score is None:
            print("ต้องเป็นตัวเลข 0-100")
            continue
        scores.append(score)
        print(f"  บันทึกแล้ว: {score} -> {grade_of(score)}")

    summary = summarise(scores)
    print(f"จำนวน: {summary['count']}")
    print(f"เฉลี่ย: {summary['average']}")
    print(f"สูงสุด: {summary['highest']}")
    print(f"ต่ำสุด: {summary['lowest']}")


if __name__ == "__main__":
    main()`,
        cap: "ผ่าน flake8 และ mypy — ใช้ทุกอย่างในหน้านี้", lang: "python" },
      { p: "โปรแกรมนี้มีครบ: ฟังก์ชันที่ตั้งชื่อได้ความหมาย type hint การจับ error ที่แคบ ลูปที่ออกได้ เงื่อนไขที่อ่านง่าย โครงสร้างข้อมูลที่เลือกถูก และการ์ด `__main__` — ถ้าเขียนแบบนี้ได้เอง แปลว่าพร้อมสำหรับ Module 00 แล้ว" },
      { h: "ฝึกเอง — เรียงจากง่ายไปยาก" },
      { p: "อ่านอย่างเดียวไม่พอ ทำสิบข้อนี้ให้ครบก่อนไปหน้า Python Modules ทุกข้อใช้แค่สิ่งที่อยู่ในหน้านี้ และทุกข้อต้องผ่าน flake8 กับ mypy" },
      { ul: [
        "1. รับชื่อจากผู้ใช้แล้วพิมพ์ทักทาย พร้อมจำนวนตัวอักษรของชื่อนั้น",
        "2. รับตัวเลขสองตัว พิมพ์ผลบวก ลบ คูณ หาร และเศษ โดยจัดการกรณีหารด้วยศูนย์",
        "3. รับอายุ แล้วบอกว่าเป็นเด็ก วัยรุ่น หรือผู้ใหญ่ ด้วย `if` และ `elif`",
        "4. พิมพ์สูตรคูณแม่ที่ผู้ใช้เลือก ตั้งแต่ 1 ถึง 12 ด้วยลูป",
        "5. เขียนฟังก์ชัน `is_prime(n: int) -> bool` แล้วพิมพ์จำนวนเฉพาะทั้งหมดที่น้อยกว่า 100",
        "6. รับคำจากผู้ใช้จนกว่าจะพิมพ์ done แล้วรายงานคำที่ยาวที่สุด สั้นที่สุด และจำนวนคำที่ไม่ซ้ำ",
        "7. นับความถี่ของตัวอักษรในข้อความหนึ่ง แล้วพิมพ์เรียงจากมากไปน้อย — ใช้ `dict` กับ `sorted`",
        "8. อ่านไฟล์ข้อความ แล้วเขียนไฟล์ใหม่ที่ใส่เลขบรรทัดไว้หน้าทุกบรรทัด จัดการกรณีไฟล์ไม่มีอยู่",
        "9. รับตัวเลขจาก `sys.argv` แล้วพิมพ์ค่าเฉลี่ย ค่าสูงสุด ต่ำสุด โดยข้ามค่าที่ไม่ใช่ตัวเลขพร้อมแจ้ง",
        "10. เขียนคลาส `Wallet` ที่มี `deposit`, `withdraw` และ `balance` โดยปฏิเสธการถอนเกินยอดด้วย exception ของตัวเอง"
      ]},
      { note: "**ทำข้อ 10 ได้โดยไม่ต้องเปิดหน้านี้ดู แปลว่าจบ 101 แล้วจริง** — ข้อนั้นใช้คลาส สถานะ การตรวจค่า และ exception ที่สร้างเอง ซึ่งคือแกนของ Module 01 กับ 02" }
    ],

    tricks: [
      { h: "16 กับดัก เรียงตามลำดับที่มักเจอ" },
      { p: "ทุกข้อข้างล่างนี้เกิดกับทุกคน ไม่ใช่เพราะไม่เก่ง แต่เพราะภาษาออกแบบมาแบบนั้น — อ่านไว้ก่อนจะได้รู้ตัวตอนเจอ" },
      { h: "1) input() คืนสตริงเสมอ" },
      { code: String.raw`age = input("อายุ: ")
print(age + 1)          # TypeError
print(int(age) + 1)     # ถูก — แต่พังถ้าผู้ใช้พิมพ์ "abc"`,
        cap: "แปลงชนิด แล้วเผื่อกรณีแปลงไม่ได้", lang: "python" },
      { h: "2) เรียกเมธอดแล้วทิ้งผลลัพธ์" },
      { code: String.raw`name = "somchai"
name.upper()                 # ไม่มีอะไรเกิดขึ้น
name = name.upper()          # ถูก

items = [3, 1, 2]
sorted(items)                # ไม่มีอะไรเกิดขึ้นกับ items
items = sorted(items)        # ถูก`,
        cap: "ของที่แก้ไม่ได้ต้องรับค่ากลับมาเสมอ", lang: "python" },
      { h: "3) is กับ ==" },
      { code: String.raw`a = [1, 2]
b = [1, 2]
print(a == b)      # True   ค่าเท่ากัน
print(a is b)      # False  คนละวัตถุ

x = 5
y = 5
print(x is y)      # True — แต่บังเอิญ! CPython แคชเลขเล็กไว้
z = 1000
w = 1000
print(z is w)      # อาจเป็น False`,
        cap: "กฎ: ใช้ is กับ None, True, False เท่านั้น", lang: "python" },
      { h: "4) หารจำนวนเต็ม" },
      { code: String.raw`print(8 / 2)     # 4.0   <- float เสมอ
print(8 // 2)    # 4
print(-7 // 2)   # -4    <- ปัดลง ไม่ใช่ตัดทิ้ง
print(int(-3.5)) # -3    <- อันนี้ตัดเข้าหาศูนย์`,
        cap: "// กับ int() ปัดคนละแบบเมื่อเจอค่าติดลบ", lang: "python" },
      { h: "5) ทศนิยมไม่แม่น" },
      { code: String.raw`print(0.1 + 0.2)              # 0.30000000000000004
print(0.1 + 0.2 == 0.3)       # False

print(abs(0.1 + 0.2 - 0.3) < 1e-9)   # True — เทียบด้วยค่าคลาดเคลื่อน`,
        cap: "เรื่องเงินให้ใช้โมดูล decimal", lang: "python" },
      { h: "6) แก้ลิสต์ระหว่างวนมัน" },
      { code: String.raw`items = [1, 2, 2, 3]
for item in items:
    if item % 2 == 0:
        items.remove(item)
print(items)          # [1, 2, 3]  <- เลข 2 ตัวที่สองรอด!

items = [1, 2, 2, 3]
items = [item for item in items if item % 2 != 0]
print(items)          # [1, 3]     <- ถูก`,
        cap: "ลบตัวหนึ่งแล้วตำแหน่งเลื่อน ตัวถัดไปจึงถูกข้าม", lang: "python" },
      { h: "7) ค่าเริ่มต้นที่แก้ไขได้" },
      { code: String.raw`def add_item(item, basket=[]):     # ผิด
    basket.append(item)
    return basket

print(add_item("a"))    # ['a']
print(add_item("b"))    # ['a', 'b']  <- ตะกร้าเดิม!

def add_item(item, basket=None):   # ถูก
    if basket is None:
        basket = []
    basket.append(item)
    return basket`,
        cap: "ค่าเริ่มต้นถูกสร้างครั้งเดียว ตอนนิยามฟังก์ชัน", lang: "python" },
      { h: "8) ตั้งชื่อทับของที่มีอยู่" },
      { code: String.raw`list = [1, 2, 3]        # ตอนนี้ list() ใช้ไม่ได้แล้ว
str = "abc"             # str() ก็เหมือนกัน
sum = 0                 # sum() ก็ด้วย

# error จะโผล่อีกร้อยบรรทัดถัดไป และอ่านไม่ออกว่าเกี่ยวอะไรกัน
# ใช้ items, text, total แทน`,
        cap: "ชื่อที่ควรเลี่ยง: list, dict, str, int, sum, id, type, input, max, min", lang: "python" },
      { h: "9) KeyError กับ .get()" },
      { code: String.raw`student = {"name": "สมชาย"}

print(student["age"])              # KeyError
print(student.get("age"))          # None — ไม่พัง แต่บางทีนี่คือบั๊ก
print(student.get("age", 0))       # 0 — ค่าสำรองที่ตั้งใจ

if "age" in student:               # ชัดเจนที่สุดเมื่อต้องแยกสองกรณี
    print(student["age"])`,
        cap: "เลือกให้ตรงกับสิ่งที่ตั้งใจ", lang: "python" },
      { h: "10) range หยุดก่อนตัวสุดท้าย" },
      { code: String.raw`print(list(range(5)))       # [0, 1, 2, 3, 4]  — ไม่มี 5
print(list(range(1, 5)))    # [1, 2, 3, 4]     — ไม่มี 5

items = ["a", "b", "c"]
print(items[3])             # IndexError — ตำแหน่งสุดท้ายคือ 2`,
        cap: "งงเมื่อไหร่ ห่อ list() แล้วพิมพ์ดู", lang: "python" },
      { h: "11) UnboundLocalError" },
      { code: String.raw`count = 0

def broken():
    count = count + 1       # UnboundLocalError
    return count

def works():
    global_count = 0        # ตัวแปรของตัวเอง
    global_count += 1
    return global_count`,
        cap: "assign ที่ไหนก็ตามในฟังก์ชัน ทำให้ชื่อนั้นเป็นท้องถิ่นทั้งฟังก์ชัน", lang: "python" },
      { h: "12) เทียบสตริงกับตัวเลข" },
      { code: String.raw`print("10" < "9")       # True  — เทียบตัวอักษร '1' < '9'
print(10 < 9)           # False — เทียบตัวเลข
print("10" == 10)       # False — คนละชนิด ไม่มีวันเท่ากัน`,
        cap: "แปลงชนิดให้ตรงกันก่อนเทียบเสมอ", lang: "python" },
      { h: "13) copy ไม่ลึก" },
      { code: String.raw`import copy

rows = [[1, 2], [3, 4]]
shallow = rows.copy()
shallow[0].append(99)
print(rows)              # [[1, 2, 99], [3, 4]]  <- ลิสต์ชั้นในยังใช้ร่วมกัน

deep = copy.deepcopy(rows)
deep[0].append(100)
print(rows)              # ไม่กระทบ`,
        cap: ".copy() คัดลอกชั้นนอกชั้นเดียว", lang: "python" },
      { h: "14) generator เดินได้รอบเดียว" },
      { code: String.raw`squares = (n * n for n in range(3))
print(list(squares))     # [0, 1, 4]
print(list(squares))     # []   <- ว่างแล้ว`,
        cap: "ต้องวนซ้ำ ให้เก็บเป็น list ก่อน", lang: "python" },
      { h: "15) closure ผูกค่าตอนเรียก ไม่ใช่ตอนสร้าง" },
      { code: String.raw`funcs = [lambda: i for i in range(3)]
print([f() for f in funcs])          # [2, 2, 2]  <- ทุกตัวเห็น i ตัวเดียวกัน

funcs = [lambda i=i: i for i in range(3)]
print([f() for f in funcs])          # [0, 1, 2]  <- ผูกค่าไว้ตอนสร้าง`,
        cap: "เจอตอนสร้างฟังก์ชันในลูป", lang: "python" },
      { h: "16) เยื้องปนแท็บกับช่องว่าง" },
      { p: "มองด้วยตาไม่เห็นความต่าง แต่ Python เห็น ผลคือ `TabError` หรือแย่กว่านั้นคือโค้ดทำงานผิดกลุ่มโดยไม่ฟ้อง **ตั้งค่าโปรแกรมแก้ข้อความให้ปุ่ม Tab แทรก 4 ช่องว่าง ตั้งแต่วันแรก** แล้วปัญหานี้จะไม่มีวันเกิด" },
      { h: "เครื่องมือ debug ที่ใช้ได้จริง" },
      { code: String.raw`# 1) print แบบบอกชื่อตัวแปรไปด้วย
print(f"{items=}")            # items=[1, 2, 3]

# 2) ถามชนิดเมื่อสงสัย
print(type(value), value)

# 3) หยุดโปรแกรมแล้วสำรวจ
breakpoint()                  # พิมพ์ n = บรรทัดถัดไป, c = ทำต่อ, q = ออก`,
        cap: "f\"{ชื่อ=}\" พิมพ์ทั้งชื่อและค่า ประหยัดเวลามาก", lang: "python" }
    ],

    eval: [
      { qa: [
        { q: "ตัวแปรใน Python คืออะไร", a: "เป็นชื่อที่ผูกอยู่กับวัตถุ ไม่ใช่กล่องที่เก็บค่าไว้ข้างใน `b = a` จึงไม่ได้คัดลอกอะไร แต่แปะชื่อที่สองบนวัตถุเดิม ถ้าวัตถุนั้นแก้ไขได้ การเปลี่ยนผ่านชื่อหนึ่งจะเห็นได้จากอีกชื่อหนึ่ง" },
        { q: "ทำไม `name.upper()` แล้วชื่อไม่เปลี่ยน", a: "เพราะสตริงแก้ไม่ได้ เมธอดของมันจึงคืนสตริงตัวใหม่เสมอแทนที่จะแก้ตัวเดิม ต้องรับค่ากลับมาด้วย `name = name.upper()`" },
        { q: "`/` กับ `//` ต่างกันยังไง", a: "`/` คืนทศนิยมเสมอ แม้หารลงตัว ส่วน `//` ปัดลงเป็นจำนวนเต็ม และปัดลงจริง ๆ ไม่ใช่ตัดเข้าหาศูนย์ — `-7 // 2` จึงเป็น -4" },
        { q: "`is` กับ `==` ใช้ต่างกันเมื่อไหร่", a: "`==` ถามว่าค่าเท่ากันไหม `is` ถามว่าเป็นวัตถุตัวเดียวกันไหม ใช้ `is` เฉพาะกับ `None`, `True`, `False` เท่านั้น เพราะกับตัวเลขและสตริงมันอาจให้ผลถูกโดยบังเอิญจากการแคชของ CPython" },
        { q: "truthiness คืออะไร", a: "ความสามารถของ Python ที่ใช้ค่าที่ไม่ใช่ bool ในเงื่อนไขได้ ของที่ว่าง — `0`, `\"\"`, `[]`, `{}`, `None` — นับเป็นเท็จ นอกนั้นเป็นจริง ทำให้เขียน `if items:` แทน `if len(items) > 0:` ได้" },
        { q: "list กับ tuple ต่างกันตรงไหน", a: "list แก้ไขได้ เพิ่มลบเรียงได้ ส่วน tuple สร้างแล้วเปลี่ยนไม่ได้ ใช้ tuple เมื่อค่าชุดนั้นเป็นก้อนเดียวที่ไม่ควรถูกแก้ เช่นพิกัด หรือค่าหลายตัวที่ฟังก์ชันคืนกลับมา" },
        { q: "เมื่อไหร่ควรใช้ dict แทน list", a: "เมื่อต้องการค้นด้วยชื่อหรือรหัส ไม่ใช่ด้วยตำแหน่ง การค้นใน dict เร็วเท่าเดิมไม่ว่าจะมีกี่รายการ ส่วนการค้นใน list ต้องไล่ทีละตัว" },
        { q: "อ่าน traceback ยังไง", a: "อ่านจากล่างขึ้นบน บรรทัดสุดท้ายบอกว่าอะไรพัง บรรทัดเหนือขึ้นไปบอกว่าพังที่ไฟล์ไหนบรรทัดไหน และเฟรมที่เหลือบอกว่ามาถึงจุดนั้นได้อย่างไร ถ้า error เกิดในไลบรารีให้มองหาเฟรมสุดท้ายที่เป็นไฟล์ของเราเอง" },
        { q: "ทำไมไม่ควรเขียน `except Exception` เปล่า ๆ", a: "เพราะมันกลืนทุก error รวมถึงบั๊กของเราเองที่ไม่ได้ตั้งใจดัก ทำให้โปรแกรมทำงานต่อทั้งที่อยู่ในสถานะผิด และหาสาเหตุไม่เจอ ให้จับชนิดที่แคบที่สุดเท่าที่เกิดขึ้นได้จริง" },
        { q: "`finally` จำเป็นตรงไหน ในเมื่อเขียนต่อท้าย try ก็ได้", a: "โค้ดที่ต่อท้าย try จะไม่ถูกรันถ้ามี `return` หรือมี error ที่ไม่ถูกจับ ส่วน `finally` รันเสมอไม่ว่าจะออกจากบล็อกด้วยทางไหน จึงเป็นที่ที่ถูกต้องสำหรับการเก็บกวาด" },
        { q: "`with open(...)` ดีกว่า `open()` ธรรมดายังไง", a: "มันปิดไฟล์ให้เองเมื่อออกจากบล็อก ไม่ว่าจะออกด้วย return ด้วย error หรือจบปกติ การปิดเองต้องจำให้ครบทุกทางออก และมักลืมตอนแก้โค้ดภายหลัง" },
        { q: "`if __name__ == \"__main__\":` มีไว้ทำไม", a: "ตอนไฟล์ถูก import ค่า `__name__` จะเป็นชื่อโมดูล ไม่ใช่ `\"__main__\"` การ์ดนี้จึงทำให้คนที่ import ได้แค่นิยามฟังก์ชันไปใช้ โดยโปรแกรมไม่ทำงานเอง ไฟล์เดียวจึงเป็นได้ทั้งโปรแกรมและไลบรารี" },
        { q: "`self` คืออะไร", a: "คืออินสแตนซ์ที่เมธอดกำลังถูกเรียกบนมัน Python ส่งให้เป็นอาร์กิวเมนต์แรกโดยอัตโนมัติ เขียน `student.add_score(80)` แล้วภายในเมธอด `self` จะเป็น `student` ตัวนั้น" },
        { q: "ทำไมต้องสร้างลิสต์ใน `__init__` ไม่ใช่ระดับคลาส", a: "เพราะสิ่งที่เขียนระดับคลาสถูกสร้างครั้งเดียวและใช้ร่วมกันทุกอินสแตนซ์ ถ้าเป็นลิสต์ว่าง นักเรียนทุกคนจะเก็บคะแนนลงลิสต์เดียวกัน สิ่งที่อยู่ใน `__init__` ถูกสร้างใหม่ทุกครั้งที่สร้างอินสแตนซ์" },
        { q: "ค่าเริ่มต้นที่แก้ไขได้คืออะไร และแก้ยังไง", a: "`def f(items=[])` สร้างลิสต์นั้นครั้งเดียวตอนนิยามฟังก์ชัน ไม่ใช่ทุกครั้งที่เรียก ทุกการเรียกที่ไม่ส่งอาร์กิวเมนต์จึงใช้ลิสต์เดิมที่สะสมของไว้ แก้ด้วยการใช้ `None` เป็นค่าเริ่มต้นแล้วสร้างลิสต์ข้างในฟังก์ชัน" },
        { q: "type hint บังคับตอนรันไหม", a: "ไม่บังคับ ใส่ผิดโปรแกรมก็ยังรัน ประโยชน์คือคนอ่านรู้ทันทีว่าฟังก์ชันรับและคืนอะไร และเครื่องมืออย่าง mypy ตรวจให้ก่อนรันจริง ซึ่งเป็นสิ่งที่ 42 บังคับตั้งแต่ Module 01" },
        { q: "ทำไม flake8 ถึงตั้งความยาวบรรทัดที่ 79", a: "เป็นค่าเริ่มต้นของเครื่องมือ ซึ่งมาจาก PEP 8 คู่มือสไตล์ของ Python เอง โจทย์ 42 ไม่ให้ไฟล์ตั้งค่ามา จึงหมายถึงใช้ค่าเริ่มต้นนี้" },
        { q: "เรียนจบหน้านี้แล้วทำอะไรต่อ", a: "ไปที่หน้า Python Modules 00–04 ได้ทันที เนื้อหาสี่แท็บแรกของหน้านี้ครอบคลุม Module 00 ทั้งหมด และแท็บคลาสกับโครงสร้างข้อมูลครอบคลุม Module 01 กับ 03 เกือบทั้งหมด" }
      ]}
    ]
  }
});
