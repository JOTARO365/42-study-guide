/* แท็บ "โจทย์" ของหน้าสาย Python — เรียบเรียงใหม่จากข้อกำหนดของแต่ละโมดูล
   ไม่ใช่การคัดลอกเอกสารต้นฉบับ */
(function () {
  var TH = {

    py_series: [
      { h: "โจทย์ชุดนี้ต้องการอะไร" },
      { p: "สิบเอ็ดโมดูลที่ใช้ General Instructions ชุดเดียวกัน หน้านี้ครอบคลุมข้อกำหนดร่วม และรายละเอียดของโมดูล 00 ถึง 04" },
      { table: { head: ["หัวข้อ", "ข้อกำหนด"], rows: [
        ["ภาษา", "Python 3.10 ขึ้นไป"],
        ["สไตล์", "ผ่าน flake8 โดยไม่มีไฟล์ config — ใช้ค่าเริ่มต้น รวมถึงความยาวบรรทัด 79 คอลัมน์"],
        ["ชนิดข้อมูล", "type annotation ครบทุกฟังก์ชันและเมธอด ตรวจด้วย mypy"],
        ["ที่วางไฟล์", "หนึ่งแบบฝึกหัดต่อหนึ่งไดเรกทอรี `exN/` ชื่อไฟล์ตามที่ระบุ"],
        ["การตั้งชื่อ", "คลาสเป็น PascalCase ฟังก์ชันและตัวแปรเป็น snake_case"],
        ["ความเสถียร", "โปรแกรมต้องรันได้โดยไม่มี error หลุดออกมา"]
      ]}},
      { h: "Module 00 — Growing Code" },
      { ul: [
        "แปดแบบฝึกหัด `ex0/` ถึง `ex7/` แต่ละข้อมีหนึ่งฟังก์ชัน",
        "ครอบคลุม print, การรับค่าจากผู้ใช้, เลขคณิต, เงื่อนไข, ลูป และเวอร์ชัน recursive ที่ให้ผลเหมือนกัน",
        "type annotation เป็นตัวเลือกในข้อ 0–6 และบังคับในข้อ 7",
        "ฟังก์ชันช่วยเหลือได้รับอนุญาตอย่างชัดเจนสำหรับเวอร์ชัน recursive"
      ]},
      { h: "Module 01 — Code Cultivation" },
      { ul: [
        "เจ็ดแบบฝึกหัด แต่ละข้อเป็นไฟล์เดี่ยวที่บรรจุคลาสของตัวเองครบ",
        "ไล่จาก `if __name__ == \"__main__\"` ไปคลาส เมธอด constructor",
        "ข้อ 4 ต้องใช้ข้อตกลง protected ด้วยขีดล่างหนึ่งตัว",
        "ข้อ 5 ต้องใช้การสืบทอดและเรียกเมธอดของคลาสแม่ผ่าน `super()`",
        "ข้อ 6 ต้องมี static method, class method และคลาสซ้อนภายในไฟล์เดียว"
      ]},
      { h: "Module 02 — Garden Guardian" },
      { ul: [
        "ห้าแบบฝึกหัดเรื่องการจัดการข้อผิดพลาด",
        "ต้องแสดงการเกิด error หลายชนิดโดยตั้งใจ พร้อมจับและรายงานอย่างเหมาะสม",
        "ต้องสร้าง exception ของตัวเองที่สืบทอดจาก `Exception`",
        "ต้องใช้ `finally` ให้ทำงานทุกเส้นทางออกจากบล็อก"
      ]},
      { h: "Module 03 — Data Quest" },
      { ul: [
        "เจ็ดแบบฝึกหัดเรื่องโครงสร้างข้อมูลมาตรฐาน",
        "ครอบคลุม list, tuple, dict, set, comprehension และ generator",
        "ต้องรับพารามิเตอร์จากบรรทัดคำสั่งและรายงานค่าที่ผิดรูปแบบโดยไม่หยุดทำงาน"
      ]},
      { h: "Module 04 — Data Archivist" },
      { ul: [
        "สี่แบบฝึกหัดเรื่องไฟล์และสตรีม",
        "สามข้อแรกห้ามใช้ `with` ต้องเปิดและปิดไฟล์เองทุกเส้นทาง",
        "ข้อหนึ่งต้องอ่านจาก standard input และส่ง error ไปที่ standard error",
        "ข้อสุดท้ายจึงใช้ `with` และคืนผลลัพธ์เป็นคู่ของสถานะกับข้อความ"
      ]},
      { note: "ทุกโมดูลมีตัวอย่างผลลัพธ์ในเอกสารโจทย์ — ผลลัพธ์ที่โปรแกรมพิมพ์ต้องตรงกับตัวอย่างนั้น" }
    ],

    py_patterns: [
      { h: "โจทย์ชุดนี้ต้องการอะไร" },
      { p: "สามโมดูลเรื่องการออกแบบ: การใช้คลาสนามธรรม การจัดระเบียบ package และรูปแบบการออกแบบขั้นสูง ข้อกำหนดร่วมของซีรีส์ใช้ทั้งหมด" },
      { table: { head: ["โมดูล", "ไฟล์ที่ต้องส่ง", "สิ่งที่อนุญาตให้ import"], rows: [
        ["05", "`ex0/data_processor.py`, `ex1/data_stream.py`, `ex2/data_pipeline.py`", "builtins, ชนิดมาตรฐาน, `typing`, `abc`"],
        ["06", "ต้นไม้ไฟล์ที่ระบุไว้ในโจทย์ทั้งหมด", "เฉพาะโมดูลและไฟล์ที่สร้างขึ้นเองในโปรเจกต์นี้"],
        ["07", "`battle.py`, `capacitor.py`, `tournament.py` และ `ex0/`–`ex2/` เป็น package", "builtins, ชนิดมาตรฐาน, `typing`, `abc`"]
      ]}},
      { h: "Module 05 — Code Nexus" },
      { ul: [
        "สร้างคลาสนามธรรมที่มีเมธอดตรวจสอบข้อมูลและเมธอดรับข้อมูลเป็น abstract และเมธอดส่งออกเป็น concrete",
        "สร้างคลาสลูกสามชนิดสำหรับข้อมูลตัวเลข ข้อความ และรายการบันทึก",
        "เมธอดรับข้อมูลของคลาสลูกต้องแคบชนิดลง และต้องโยนข้อผิดพลาดเมื่อได้รับข้อมูลที่ไม่รองรับ",
        "ข้อ 1 สร้างคลาสสตรีมที่ลงทะเบียนตัวประมวลผลได้ และส่งข้อมูลแต่ละชิ้นไปยังตัวที่รับได้",
        "ข้อ 2 เพิ่มระบบปลั๊กอินส่งออกที่ใช้คลาส `Protocol` เป็นสัญญา พร้อมปลั๊กอิน CSV และ JSON ที่เขียนสตริงเอง"
      ]},
      { h: "Module 06 — The Codex" },
      { ul: [
        "ห้ามแก้ไข `sys.path` และห้าม import อะไรนอกจากไฟล์ที่สร้างเอง",
        "สร้าง package ที่มีโมดูลย่อยและ package ซ้อน พร้อมสคริปต์ทดสอบที่ราก",
        "ต้องสาธิตทั้งรูปแบบ `import ...` และ `from ... import ...` กับทั้งไฟล์ระดับบนและไฟล์ใน package",
        "ต้องมีฟังก์ชันหนึ่งที่ package ไม่เปิดเผยผ่านหน้าตาของมัน และการเรียกผ่าน package ต้องเกิดข้อผิดพลาด",
        "ต้องมีไฟล์ที่ใช้ทั้ง absolute import และ relative import",
        "ต้องสาธิตคู่โมดูลที่หลีกเลี่ยง circular import ได้ และคู่ที่เกิด circular import จนล้มเหลว"
      ]},
      { h: "Module 07 — DataDeck" },
      { ul: [
        "แต่ละไดเรกทอรีแบบฝึกหัดต้องมี `__init__.py`",
        "ข้อ 0 สร้างคลาสนามธรรมของการ์ด และคลาสโรงงานนามธรรมที่สร้างการ์ดพื้นฐานกับการ์ดวิวัฒน์ของตระกูลเดียวกัน",
        "package ของแต่ละข้อต้องไม่เปิดเผยคลาสการ์ดจริง เปิดเผยเฉพาะโรงงาน",
        "ข้อ 1 เพิ่มคลาสความสามารถที่ไม่สืบทอดจากคลาสการ์ด แล้วให้การ์ดสืบทอดจากทั้งสองทาง",
        "ข้อ 2 สร้างคลาสกลยุทธ์นามธรรมที่มีเมธอดตรวจความเหมาะสมและเมธอดลงมือ พร้อมกลยุทธ์สามแบบ",
        "การจับคู่การ์ดกับกลยุทธ์ที่ไม่เข้ากันต้องทำให้เกิดข้อผิดพลาดเฉพาะทางพร้อมข้อความที่ชัดเจน"
      ]},
      { note: "ตอนสอบอาจถูกขอให้อธิบายรูปแบบการออกแบบที่ใช้ — เอกสารโจทย์ย้ำว่าให้เน้นความเข้าใจแนวคิด ไม่ใช่แค่ทำให้โค้ดรันได้" }
    ],

    py_toolkit: [
      { h: "โจทย์ชุดนี้ต้องการอะไร" },
      { p: "สามโมดูลเรื่องเครื่องมือรอบตัวโปรแกรม: สภาพแวดล้อมและการจัดการแพ็กเกจ การตรวจสอบข้อมูล และการเขียนโปรแกรมเชิงฟังก์ชัน" },
      { table: { head: ["โมดูล", "ไฟล์ที่ต้องส่ง"], rows: [
        ["08", "`ex0/construct.py` · `ex1/loading.py`, `requirements.txt`, `pyproject.toml` · `ex2/oracle.py`, `.env.example`, `.gitignore`"],
        ["09", "`ex0/space_station.py` · `ex1/alien_contact.py` · `ex2/space_crew.py`"],
        ["10", "`ex0/lambda_spells.py` · `ex1/higher_magic.py` · `ex2/scope_mysteries.py` · `ex3/functools_artifacts.py` · `ex4/decorator_mastery.py`"]
      ]}},
      { h: "Module 08 — The Matrix" },
      { ul: [
        "ข้อ 0 เขียนโปรแกรมที่ตรวจว่ากำลังทำงานอยู่ในสภาพแวดล้อมเสมือนหรือไม่ แสดงข้อมูลของสภาพแวดล้อมนั้น และแนะนำวิธีสร้างเมื่อยังไม่มี พร้อมแสดงความต่างของตำแหน่งที่ติดตั้งแพ็กเกจ",
        "ข้อ 1 เขียนโปรแกรมวิเคราะห์ข้อมูลที่ใช้ไลบรารีภายนอก โดยต้องจัดการกรณีที่ไลบรารีหายไปอย่างนุ่มนวล และต้องมีทั้งไฟล์รายการแพ็กเกจสำหรับ pip และไฟล์ประกาศสำหรับ Poetry",
        "ข้อมูลตัวอย่างต้องสร้างด้วยไลบรารีคำนวณเชิงตัวเลข ไม่ใช่ค่าที่พิมพ์ไว้ตายตัว และต้องผลิตภาพประกอบหนึ่งภาพ",
        "ข้อ 2 อ่านการตั้งค่าจากตัวแปรสภาพแวดล้อมและไฟล์ `.env` โดยตัวแปรจากสภาพแวดล้อมต้องมีลำดับความสำคัญเหนือกว่า",
        "ต้องแยกโหมดพัฒนากับโหมดใช้งานจริงให้เห็นได้จากผลลัพธ์ และไฟล์ที่เก็บค่าจริงต้องไม่ถูกนำขึ้น repository",
        "ห้ามส่งไดเรกทอรีของสภาพแวดล้อมเสมือนเข้า repository และต้องสร้างใหม่ได้ตอนตรวจ"
      ]},
      { h: "Module 09 — Cosmic Data" },
      { ul: [
        "ใช้ Pydantic รุ่น 2 ติดตั้งผ่าน pip ในสภาพแวดล้อมเสมือน",
        "ข้อ 0 สร้างโมเดลที่มีข้อจำกัดของแต่ละฟิลด์ ทั้งความยาวข้อความ ช่วงตัวเลข ค่าเวลา ค่าบูลีนที่มีค่าเริ่มต้น และฟิลด์ที่ไม่บังคับ",
        "ต้องมีฟังก์ชันสาธิตที่สร้างข้อมูลถูกต้องหนึ่งชุดและข้อมูลผิดหนึ่งชุด พร้อมแสดงข้อความผิดพลาด",
        "ข้อ 1 เพิ่ม enum และกฎที่เกี่ยวข้องหลายฟิลด์พร้อมกัน เขียนด้วย `@model_validator(mode=\"after\")`",
        "ข้อ 2 สร้างโมเดลซ้อนโมเดล — ภารกิจที่มีรายชื่อลูกเรือ พร้อมกฎความปลอดภัยที่ตรวจทั้งทีม",
        "เอกสารโจทย์ระบุให้เลี่ยง `@validator` ซึ่งเป็นของรุ่นเก่า"
      ]},
      { h: "Module 10 — FuncMage" },
      { ul: [
        "ห้ามใช้ไลบรารีภายนอก ห้ามอ่านเขียนไฟล์ ห้ามใช้ตัวแปรระดับโมดูลเป็นสถานะ และห้าม `eval`/`exec`",
        "ข้อ 0 ต้องใช้ lambda สำหรับการแปลงข้อมูลทั้งหมด ร่วมกับ `sorted`, `filter`, `map`, `max`, `min`",
        "ข้อ 1 สร้างฟังก์ชันที่รับฟังก์ชันและคืนฟังก์ชัน — รวมสองคาถา ขยายพลัง ใส่เงื่อนไข และเรียงลำดับหลายคาถา",
        "ข้อ 2 สร้าง closure สี่แบบ รวมถึงตัวนับที่แยกสถานะกันได้ และคลังความจำที่คืนฟังก์ชันสองตัวใช้พื้นที่เก็บร่วมกัน",
        "ข้อ 3 ใช้ `functools` และ `operator` — การพับลำดับ การตรึงอาร์กิวเมนต์ การจำผลลัพธ์ และการเลือกฟังก์ชันตามชนิด",
        "ข้อ 4 สร้าง decorator สามแบบ ได้แก่ จับเวลา ตรวจค่าก่อนทำงาน และลองซ้ำเมื่อล้มเหลว พร้อมคลาสที่มี static method"
      ]},
      { note: "โจทย์อนุญาตให้ปรับถ้อยคำของผลลัพธ์ได้ ตราบใดที่โครงสร้างและสาระสำคัญยังอยู่ครบ" }
    ],

    amaze: [
      { h: "โจทย์นี้ต้องการอะไร" },
      { p: "เขียนโปรแกรม Python ที่สร้างเขาวงกตสมบูรณ์แบบตามขนาดที่กำหนด แล้วแสดงผลเป็นข้อความ พร้อมจัดโครงสร้างโค้ดให้เป็น package ที่ติดตั้งได้" },
      { table: { head: ["หัวข้อ", "ข้อกำหนด"], rows: [
        ["ภาษา", "Python 3.10 ขึ้นไป ผ่าน flake8 และมี type annotation ครบ"],
        ["ผลลัพธ์", "เขาวงกตที่ทุกช่องเดินถึงกันได้ และมีทางเดียวระหว่างสองช่องใด ๆ"],
        ["การตั้งค่า", "รับค่าจากบรรทัดคำสั่งและจากไฟล์ตั้งค่า โดยบรรทัดคำสั่งมีลำดับความสำคัญเหนือกว่า"],
        ["การแพ็ก", "โมดูลสร้างเขาวงกตต้องเป็น package ที่สร้างเป็นไฟล์ติดตั้งได้"],
        ["build system", "ต้องมี Makefile ที่มีเป้าหมายติดตั้ง รัน ดีบัก ทำความสะอาด และตรวจสไตล์"]
      ]}},
      { h: "สิ่งที่ต้องทำ" },
      { ul: [
        "สร้างเขาวงกตจากขนาดกว้างและสูงที่ผู้ใช้กำหนด",
        "รองรับค่า seed เพื่อให้สร้างเขาวงกตเดิมซ้ำได้",
        "แสดงเขาวงกตออกทางหน้าจอในรูปแบบข้อความที่อ่านได้",
        "แยกส่วนอัลกอริทึมออกจากส่วนแสดงผลอย่างชัดเจน",
        "รายงานค่าที่ใช้ไม่ได้ด้วยข้อความที่เข้าใจได้ ไม่ใช่ปล่อยให้โปรแกรมล้ม",
        "อ่านค่าตั้งต้นจากไฟล์ตั้งค่า และทำงานต่อได้แม้ไฟล์นั้นหายไป"
      ]},
      { h: "สิ่งที่ต้องส่ง" },
      { ul: [
        "โปรแกรมหลักที่รับพารามิเตอร์และเรียกใช้ส่วนอื่น",
        "โมดูลแสดงผลที่แปลงโครงสร้างข้อมูลเป็นข้อความ",
        "package ของอัลกอริทึมพร้อมไฟล์เริ่มต้นของ package",
        "ไฟล์ตั้งค่า, Makefile และไฟล์ประกาศสำหรับการสร้างแพ็กเกจ"
      ]},
      { note: "เขาวงกตขนาดใหญ่คือเงื่อนไขที่ทำให้การเขียนแบบเรียกซ้ำล้มเหลว — โจทย์คาดหวังว่าโปรแกรมทำงานได้กับขนาดที่ใหญ่พอสมควร" }
    ]
  };

  var EN = {

    py_series: [
      { h: "What this set of subjects asks for" },
      { p: "Eleven modules sharing one set of General Instructions. This page covers the shared requirements and the detail of modules 00 to 04." },
      { table: { head: ["Topic", "Requirement"], rows: [
        ["Language", "Python 3.10 or later"],
        ["Style", "flake8 clean with no config file supplied — its defaults apply, including the 79-column line length"],
        ["Types", "Full type annotations on every function and method, checked with mypy"],
        ["Layout", "One exercise per `exN/` directory, files named exactly as specified"],
        ["Naming", "PascalCase for classes, snake_case for functions and variables"],
        ["Robustness", "The program must run without letting an error escape"]
      ]}},
      { h: "Module 00 — Growing Code" },
      { ul: [
        "Eight exercises, `ex0/` to `ex7/`, one function each",
        "Covers printing, user input, arithmetic, conditionals, loops, and a recursive version producing identical output",
        "Type annotations are optional in exercises 0–6 and required in exercise 7",
        "Helper functions are explicitly authorised for the recursive version"
      ]},
      { h: "Module 01 — Code Cultivation" },
      { ul: [
        "Seven exercises, each a standalone file carrying its own class",
        "Progresses from `if __name__ == \"__main__\"` to classes, methods and constructors",
        "Exercise 4 must use the protected convention with a single leading underscore",
        "Exercise 5 must use inheritance and call the parent's method through `super()`",
        "Exercise 6 must combine a static method, a class method and a nested class in one file"
      ]},
      { h: "Module 02 — Garden Guardian" },
      { ul: [
        "Five exercises on error handling",
        "Must demonstrate several kinds of error on purpose, each caught and reported appropriately",
        "Must define a custom exception inheriting from `Exception`",
        "Must use `finally` so cleanup runs on every exit path"
      ]},
      { h: "Module 03 — Data Quest" },
      { ul: [
        "Seven exercises on the standard data structures",
        "Covers lists, tuples, dicts, sets, comprehensions and generators",
        "Must take parameters from the command line and report malformed values without stopping"
      ]},
      { h: "Module 04 — Data Archivist" },
      { ul: [
        "Four exercises on files and streams",
        "The first three forbid `with`: files must be opened and closed by hand on every path",
        "One exercise must read from standard input and send errors to standard error",
        "The last introduces `with` and returns a status paired with a message"
      ]},
      { note: "Every module ships example output in its subject — what the program prints must match it." }
    ],

    py_patterns: [
      { h: "What this set of subjects asks for" },
      { p: "Three modules on design: abstract classes, package organisation, and advanced design patterns. The series' shared requirements all apply." },
      { table: { head: ["Module", "Files to submit", "Imports allowed"], rows: [
        ["05", "`ex0/data_processor.py`, `ex1/data_stream.py`, `ex2/data_pipeline.py`", "builtins, standard types, `typing`, `abc`"],
        ["06", "The whole file tree specified in the subject", "only the modules and files created in this project"],
        ["07", "`battle.py`, `capacitor.py`, `tournament.py` and `ex0/`–`ex2/` as packages", "builtins, standard types, `typing`, `abc`"]
      ]}},
      { h: "Module 05 — Code Nexus" },
      { ul: [
        "Create an abstract class with a validation method and an ingestion method as abstract, and an output method as concrete",
        "Create three subclasses for numeric data, textual data and log entries",
        "The subclasses' ingestion methods must narrow their types and must raise when handed data they do not accept",
        "Exercise 1 adds a stream class that registers processors and routes each element to one that accepts it",
        "Exercise 2 adds an export plugin system using a `Protocol` class as the contract, with CSV and JSON plugins whose strings are written by hand"
      ]},
      { h: "Module 06 — The Codex" },
      { ul: [
        "Modifying `sys.path` is forbidden, and only files created in this project may be imported",
        "Build a package with submodules and a nested package, plus test scripts at the root",
        "Demonstrate both the `import ...` and `from ... import ...` forms against both a top-level file and a file inside the package",
        "One function must not be exposed through the package's interface, and reaching it through the package must fail",
        "One file must use both an absolute and a relative import",
        "Demonstrate one pair of modules that avoids a circular import and one pair that fails because of it"
      ]},
      { h: "Module 07 — DataDeck" },
      { ul: [
        "Every exercise directory must contain an `__init__.py`",
        "Exercise 0 creates an abstract card class and an abstract factory that produces the base and evolved card of one family",
        "Each exercise's package must not expose the concrete card classes, only the factories",
        "Exercise 1 adds capability classes that do not inherit from the card class, with cards inheriting from both",
        "Exercise 2 adds an abstract strategy class with a suitability method and an action method, plus three concrete strategies",
        "Pairing a card with an unsuitable strategy must raise a dedicated error with a clear message"
      ]},
      { note: "The evaluation may ask you to explain the patterns used — the subject stresses understanding the concepts rather than merely making the code run." }
    ],

    py_toolkit: [
      { h: "What this set of subjects asks for" },
      { p: "Three modules on the tooling around a program: environments and package management, data validation, and functional programming." },
      { table: { head: ["Module", "Files to submit"], rows: [
        ["08", "`ex0/construct.py` · `ex1/loading.py`, `requirements.txt`, `pyproject.toml` · `ex2/oracle.py`, `.env.example`, `.gitignore`"],
        ["09", "`ex0/space_station.py` · `ex1/alien_contact.py` · `ex2/space_crew.py`"],
        ["10", "`ex0/lambda_spells.py` · `ex1/higher_magic.py` · `ex2/scope_mysteries.py` · `ex3/functools_artifacts.py` · `ex4/decorator_mastery.py`"]
      ]}},
      { h: "Module 08 — The Matrix" },
      { ul: [
        "Exercise 0 writes a program that detects whether it is running inside a virtual environment, displays that environment's details, explains how to create one when there is none, and shows the difference between the global and virtual package locations",
        "Exercise 1 writes a data analysis program using external libraries, handling their absence gracefully, and supplying both a package list for pip and a declaration file for Poetry",
        "The sample data must be generated with a numerical library rather than hardcoded, and the program must produce one visualisation",
        "Exercise 2 loads configuration from environment variables and a `.env` file, with the environment taking precedence",
        "Development and production modes must be visibly different in the output, and the file holding real values must stay out of the repository",
        "The virtual environment directory must not be submitted, and must be recreatable during the review"
      ]},
      { h: "Module 09 — Cosmic Data" },
      { ul: [
        "Use Pydantic version 2, installed with pip inside a virtual environment",
        "Exercise 0 builds a model with per-field constraints: string lengths, numeric ranges, a datetime, a boolean with a default, and an optional field",
        "A demonstration function must create one valid instance and one invalid one, showing the validation message",
        "Exercise 1 adds an enum and rules involving several fields at once, written with `@model_validator(mode=\"after\")`",
        "Exercise 2 nests models — a mission holding a crew list — with safety rules checked across the whole crew",
        "The subject says to avoid `@validator`, which belongs to the previous version"
      ]},
      { h: "Module 10 — FuncMage" },
      { ul: [
        "No external libraries, no file I/O, no module-level state, and no `eval`/`exec`",
        "Exercise 0 must use lambdas for all transformations, together with `sorted`, `filter`, `map`, `max` and `min`",
        "Exercise 1 builds functions that take and return functions — combining two spells, amplifying power, adding a condition, and sequencing several",
        "Exercise 2 builds four closures, including counters with independent state and a memory vault returning two functions sharing one private store",
        "Exercise 3 uses `functools` and `operator` — folding a sequence, freezing arguments, caching results, and dispatching on type",
        "Exercise 4 builds three decorators — timing, validation before execution, and retry on failure — plus a class with a static method"
      ]},
      { note: "The subject allows the wording of the output to be adjusted, as long as the structure and the essential information remain." }
    ],

    amaze: [
      { h: "What the subject asks for" },
      { p: "Write a Python program that generates a perfect maze of a given size, prints it as text, and organises its code as an installable package." },
      { table: { head: ["Topic", "Requirement"], rows: [
        ["Language", "Python 3.10 or later, flake8 clean, fully annotated"],
        ["Output", "A maze where every cell is reachable and exactly one path connects any two cells"],
        ["Configuration", "Values from the command line and from a config file, with the command line taking precedence"],
        ["Packaging", "The generator module must be a package that can be built into an installable artefact"],
        ["Build system", "A Makefile with targets to install, run, debug, clean and lint"]
      ]}},
      { h: "What it must do" },
      { ul: [
        "Generate a maze from a width and a height given by the user",
        "Accept a seed so the same maze can be reproduced",
        "Print the maze to the screen in readable text",
        "Keep the algorithm clearly separated from the rendering",
        "Report unusable values with an understandable message rather than crashing",
        "Read defaults from a config file, and keep working when that file is missing"
      ]},
      { h: "What gets submitted" },
      { ul: [
        "The main program that takes the parameters and calls the rest",
        "A rendering module that turns the data structure into text",
        "The algorithm package, with its package init file",
        "The config file, the Makefile, and the packaging declaration file"
      ]},
      { note: "Large mazes are the condition that breaks a recursive implementation — the subject expects the program to handle a reasonably large size." }
    ]
  };

  window.TEACHING_DATA = window.TEACHING_DATA || [];
  window.TEACHING_EN = window.TEACHING_EN || {};
  window.TEACHING_DATA.forEach(function (page) {
    if (!TH[page.id]) return;
    page.sections.subject = TH[page.id];
    var en = window.TEACHING_EN[page.id];
    if (en) en.subject = EN[page.id];
  });
})();
