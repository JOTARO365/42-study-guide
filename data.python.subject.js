/* แท็บ "โจทย์" ของหน้าสาย Python — เรียบเรียงใหม่จากข้อกำหนดของแต่ละโมดูล
   ระดับรายแบบฝึกหัด: ไดเรกทอรี ชื่อไฟล์ สิ่งที่อนุญาตให้ใช้ และสิ่งที่ต้องทำ
   ไม่ใช่การคัดลอกเอกสารต้นฉบับ */
(function () {
  var TH = {

    py_series: [
      { h: "โจทย์ชุดนี้ครอบคลุมอะไร" },
      { p: "สิบเอ็ดโมดูลใช้ General Instructions ชุดเดียวกันแทบทุกตัวอักษร หน้านี้เก็บกฎร่วม แล้วไล่รายละเอียดของโมดูล 00 ถึง 04 ทีละแบบฝึกหัด" },
      { table: { head: ["กฎร่วม", "รายละเอียด"], rows: [
        ["ภาษา", "Python 3.10 ขึ้นไป"],
        ["สไตล์", "ผ่าน flake8 — ไม่มีไฟล์ตั้งค่ามาให้ จึงใช้ค่าเริ่มต้น รวมความยาวบรรทัด 79 คอลัมน์"],
        ["ชนิดข้อมูล", "ตั้งแต่โมดูล 01 ทุกฟังก์ชันและเมธอดต้องมี type hint ตรวจด้วย mypy"],
        ["ที่วางไฟล์", "หนึ่งแบบฝึกหัดต่อหนึ่งไดเรกทอรี `exN/` ชื่อไฟล์ต้องตรงเป๊ะ"],
        ["สิ่งที่อนุญาต", "แต่ละข้อระบุรายการฟังก์ชันที่ใช้ได้ไว้ชัดเจน นอกรายการถือว่าใช้ไม่ได้"],
        ["ความเสถียร", "โปรแกรมต้องรันได้โดยไม่มี error หลุด"],
        ["การส่ง", "ส่งเฉพาะไฟล์ที่โจทย์ขอ ตรวจชื่อไฟล์ให้ตรงก่อนส่ง"]
      ]}},

      { h: "Module 00 — Growing Code" },
      { note: "**ข้อสำคัญที่สุดของโมดูลนี้: เขียนเฉพาะฟังก์ชัน ไม่ใช่โปรแกรม** ห้ามมี `if __name__ == \"__main__\":` ห้ามเรียกฟังก์ชันเองในไฟล์ และห้ามมีโค้ดนอกฟังก์ชัน แต่ละไฟล์มีเฉพาะฟังก์ชันที่ขอ ซึ่งรับอินพุตและพิมพ์เอาต์พุตด้วยตัวเอง" },
      { table: { head: ["ข้อ", "ไฟล์", "ใช้ได้"], rows: [
        ["ex0", "`ft_hello_garden.py`", "`print()`"],
        ["ex1", "`ft_garden_name.py`", "`input()`, `print()`"],
        ["ex2", "`ft_plot_area.py`", "`input()`, `int()`, `print()`"],
        ["ex3", "`ft_harvest_total.py`", "`input()`, `int()`, `print()`"],
        ["ex4", "`ft_plant_age.py`", "`input()`, `int()`, `print()`"],
        ["ex5", "`ft_water_reminder.py`", "`input()`, `int()`, `print()`"],
        ["ex6", "`ft_count_harvest_iterative.py`, `ft_count_harvest_recursive.py`", "เพิ่ม `range()` และฟังก์ชันช่วยสำหรับการเรียกซ้ำ"],
        ["ex7", "`ft_seed_inventory.py`", "`print()` และเมธอดของสตริง"]
      ]}},
      { ul: [
        "ex0 แสดงข้อความต้อนรับหนึ่งบรรทัด",
        "ex1 ถามชื่อสวน แล้วแสดงชื่อพร้อมข้อความสถานะที่ตายตัวเสมอ",
        "ex2 ถามความยาวและความกว้าง แล้วแสดงพื้นที่",
        "ex3 ถามน้ำหนักผลผลิตสามวัน แล้วแสดงผลรวม",
        "ex4 ถามอายุต้นไม้เป็นวัน — พร้อมเก็บเกี่ยวเมื่อ **มากกว่า 60 วันเท่านั้น**",
        "ex5 ถามจำนวนวันตั้งแต่รดน้ำครั้งล่าสุด — ถ้า **มากกว่า 2 วัน** ให้บอกให้รดน้ำ",
        "ex6 นับ 1 ถึงเลขที่ผู้ใช้ให้ ทั้งแบบวนลูปและแบบเรียกซ้ำ **ผลลัพธ์ต้องเหมือนกันทุกตัวอักษร** โจทย์ยอมรับทั้ง nested helper, ค่าเริ่มต้นของพารามิเตอร์ และฟังก์ชันช่วยแยกต่างหาก",
        "ex7 ลายเซ็นบังคับคือ `ft_seed_inventory(seed_type: str, quantity: int, unit: str) -> None` รองรับหน่วย `packets`, `grams`, `area` หน่วยอื่นพิมพ์เพียง `Unknown unit type` โดยไม่มีอย่างอื่นในบรรทัด"
      ]},
      { note: "type hint เป็นตัวเลือกในข้อ 0–6 และ **บังคับในข้อ 7** ไม่ต้องจัดการอินพุตที่ไม่ถูกต้องเว้นแต่โจทย์ระบุ และโจทย์แถม `main.py` มาให้ทดสอบ — คัดลอกไปไว้ในโฟลเดอร์เดียวกับไฟล์ที่จะทดสอบ" },

      { h: "Module 01 — Code Cultivation" },
      { p: "ตั้งแต่ข้อ 1 เป็นต้นไป **ทุกข้อบังคับใช้คลาส** และตั้งแต่ข้อ 0 เป็นต้นไปทุกไฟล์เป็นโปรแกรมที่รันเองได้ ตอนสอบอาจถูกขอให้เพิ่ม shebang สดหน้างาน" },
      { table: { head: ["ข้อ", "ไฟล์", "ใช้ได้"], rows: [
        ["ex0", "`ft_garden_intro.py`", "`print()`"],
        ["ex1", "`ft_garden_data.py`", "`print()`"],
        ["ex2", "`ft_plant_growth.py`", "`print()`, `range()`, `round()`"],
        ["ex3", "`ft_plant_factory.py`", "`print()`, `range()`, `round()`"],
        ["ex4", "`ft_garden_security.py`", "`print()`, `range()`, `round()`"],
        ["ex5", "`ft_plant_types.py`", "`super()`, `print()`, `range()`, `round()`"],
        ["ex6", "`ft_garden_analytics.py`", "เพิ่ม `staticmethod()`, `classmethod()`"]
      ]}},
      { ul: [
        "ex0 โปรแกรมที่รันตรงได้ ใช้รูปแบบ `if __name__ == \"__main__\":` เก็บชื่อ ความสูง อายุ ไว้ในตัวแปรแล้วแสดงผล",
        "ex1 สร้างคลาส `Plant` เป็นแบบจำลองของต้นไม้ทุกต้น จัดการอย่างน้อย 3 ต้นด้วยแอตทริบิวต์ชุดเดียวกัน",
        "ex2 ให้ต้นไม้ `grow()` และ `age()` ได้เอง จำลองการเติบโตหนึ่งสัปดาห์ แล้วสรุปความสูงที่เพิ่มขึ้น ต้นไม้ต่างชนิดควรโตต่างกัน",
        "ex3 สร้างต้นไม้พร้อมข้อมูลตั้งต้นได้ทันทีตอนสร้าง และสร้างอย่างน้อย 5 ต้นที่ต่างกัน",
        "ex4 ป้องกันข้อมูลด้วย `set_height()`, `set_age()`, `get_height()`, `get_age()` ปฏิเสธค่าติดลบพร้อมพิมพ์ข้อความ โดยข้อมูลเดิมต้องไม่ถูกแก้ และต้องใช้ **ข้อตกลง protected ไม่ใช่ mangling**",
        "ex5 สร้าง `Flower`, `Tree`, `Vegetable` ที่สืบทอดจาก `Plant` — flower มีสีและ `bloom()`, tree มีเส้นผ่านศูนย์กลางลำต้นและ `produce_shade()`, vegetable มีฤดูเก็บเกี่ยวและคุณค่าทางอาหารที่เริ่มจาก 0 แล้วเพิ่มเมื่อ `grow()` และ `age()` — และ `show()` ของลูกต้องเรียกของแม่ผ่าน `super()` ไม่ใช่ก็อปมา",
        "ex6 เพิ่ม static method ตรวจว่าอายุที่ให้มาเกินหนึ่งปีไหม, class method สร้างต้นไม้นิรนาม, คลาส `Seed` ที่สืบทอดจาก `Flower`, คลาสซ้อนที่เก็บสถิติจำนวนครั้งของ `grow()` `age()` `show()` (ต้นไม้ใหญ่นับ `produce_shade()` ด้วย) และฟังก์ชันเดี่ยวนอกคลาสที่แสดงสถิติของต้นไม้ชนิดใดก็ได้"
      ]},
      { note: "โจทย์ระบุว่าใช้ syntax แบบ decorator สำหรับ static method และ class method ได้ และ `capitalize()` ใช้ได้แม้ไม่อยู่ในรายการที่อนุญาต" },

      { h: "Module 02 — Garden Guardian" },
      { table: { head: ["ข้อ", "ไฟล์", "ใช้ได้"], rows: [
        ["ex0", "`ft_first_exception.py`", "`int()`, `print()`"],
        ["ex1", "`ft_raise_exception.py`", "`int()`, `print()`"],
        ["ex2", "`ft_different_errors.py`", "`print()`, `open()`, `int()`"],
        ["ex3", "`ft_custom_errors.py`", "`print()`"],
        ["ex4", "`ft_finally_block.py`", "`print()`, `str.capitalize()`"]
      ]}},
      { ul: [
        "ex0 เขียน `input_temperature(temp_str)` ที่แปลงสตริงเป็นจำนวนเต็ม และ `test_temperature()` ที่ทดสอบทั้งค่าที่ใช้ได้ (`\"25\"`) และใช้ไม่ได้ (`\"abc\"`) จับความล้มเหลว พิมพ์ข้อความ แล้ว **โปรแกรมต้องทำงานต่อ**",
        "ex1 เพิ่มการตรวจช่วง 0 ถึง 40 องศา (รวมขอบ) เกินช่วงให้ `raise` และเพิ่มเทสต์ค่าสุดขั้ว `\"100\"` กับ `\"-50\"` โดยส่วน main เรียก `test_temperature()`",
        "ex2 เขียน `garden_operations(operation_number)` ที่ค่าระหว่าง 0 ถึง 3 ทำให้เกิด `ValueError`, `ZeroDivisionError`, `FileNotFoundError`, `TypeError` อย่างละหนึ่ง ค่าอื่นไม่มี error",
        "ex3 สร้าง `GardenError` เป็นฐาน แล้ว `PlantError` กับ `WaterError` สืบทอดจากมัน แต่ละตัวมีข้อความเริ่มต้นของตัวเองเมื่อไม่ได้ส่งข้อความมา และต้องแสดงให้เห็นว่า การจับ `GardenError` จับลูกทั้งหมดได้",
        "ex4 เขียน `water_plant(plant_name)` ที่สำเร็จเมื่อชื่อขึ้นต้นด้วยตัวใหญ่ และ `raise PlantError` เมื่อไม่ใช่ พร้อม `test_watering_system()` ที่แสดงว่า `finally` ทำงานทุกกรณี"
      ]},
      { note: "โจทย์บอกว่าจะใช้คลาส `Exception` ฐาน หรือจะไปหาว่า `input_temperature()` โยน exception อะไรได้บ้างก็ได้ — และย้ำว่าเรื่อง type hint ที่ปรับให้เหมาะกับสองฟังก์ชันนี้ใช้กับทุกข้อและทุกโปรเจกต์ถัดไป" },

      { h: "Module 03 — Data Quest" },
      { table: { head: ["ข้อ", "ไฟล์", "ใช้ได้ (ย่อ)"], rows: [
        ["ex0", "`ft_command_quest.py`", "`sys.argv`, `len()`, `print()`"],
        ["ex1", "`ft_score_analytics.py`", "เพิ่ม `sum()`, `max()`, `min()`"],
        ["ex2", "`ft_coordinate_system.py`", "`math.sqrt()`, `input()`, `round()`, `print()`"],
        ["ex3", "`ft_achievement_tracker.py`", "`random.*`, `set()` และเมธอดของ set"],
        ["ex4", "`ft_inventory_system.py`", "`sys.argv`, `sum()`, `list()`, `round()`"],
        ["ex5", "`ft_data_stream.py`", "`next()`, `range()`, `typing`"],
        ["ex6", "`ft_data_alchemist.py`", "`random.*`, `len()`, `sum()`, `round()`"]
      ]}},
      { ul: [
        "ex0 อ่านพารามิเตอร์จากบรรทัดคำสั่ง",
        "ex1 แปลงพารามิเตอร์เป็นคะแนนใน list จัดการกรณีไม่มีอาร์กิวเมนต์และค่าที่ไม่ใช่ตัวเลข แล้วสรุปจำนวน ผลรวม สูงสุด ต่ำสุด — **ถ้ามีทั้งค่าที่ใช้ได้และใช้ไม่ได้ปนกัน ให้ทิ้งเฉพาะตัวที่ใช้ไม่ได้**",
        "ex2 ถามพิกัดรูปแบบ `x,y,z` วนถามใหม่จนกว่าจะถูกต้อง คืนค่าเป็น tuple แล้วคำนวณระยะถึงจุดกำเนิดและระยะระหว่างสองชุดพิกัด",
        "ex3 สร้างชุดความสำเร็จของผู้เล่นอย่างน้อยสี่คนด้วย set แล้วหาความสำเร็จทั้งหมดที่ไม่ซ้ำ, ที่ทุกคนมีร่วมกัน, ที่มีคนเดียว, และที่แต่ละคนยังขาด",
        "ex4 รับรายการของจากบรรทัดคำสั่งเป็น dict แล้วแสดงรายการ ผลรวม สัดส่วนเป็นเปอร์เซ็นต์ของแต่ละชิ้น ของที่มากที่สุดและน้อยที่สุด (**เสมอกันให้เอาตัวที่มาก่อนในบรรทัดคำสั่ง**) แล้วเพิ่มของใหม่แล้วแสดงอีกครั้ง",
        "ex5 สร้าง generator ที่ไม่มีวันจบ ชื่อ `gen_event()` ซึ่งสุ่มชื่อจากรายการ",
        "ex6 สร้างรายชื่อผู้เล่นที่บางชื่อขึ้นต้นตัวใหญ่บ้างไม่ใหญ่บ้าง แล้วสร้างข้อมูลด้วย comprehension"
      ]},
      { note: "โมดูลนี้คือที่แรกที่ `sys.argv` ปรากฏ — ค่าที่ได้เป็นสตริงเสมอ และ `sys.argv[0]` คือชื่อสคริปต์ ไม่ใช่อาร์กิวเมนต์ตัวแรก" },

      { h: "Module 04 — Data Archivist" },
      { note: "กฎลำดับที่แข็งที่สุดของทั้งซีรีส์: ห้ามใช้ `with` จนกว่าจะถึงข้อ 3 สามข้อแรกต้องเปิดและปิดไฟล์เอง โดยให้การปิดอยู่ใน `finally` เพื่อไม่ให้ error ทำ descriptor รั่ว" },
      { table: { head: ["ข้อ", "ไฟล์", "ใช้ได้ (ย่อ)"], rows: [
        ["ex0", "`ft_ancient_text.py`", "`sys.argv`, `open()`, `typing.IO`"],
        ["ex1", "`ft_archive_creation.py`", "เหมือน ex0"],
        ["ex2", "`ft_stream_management.py`", "`sys.stdin`, `sys.stdout`, `sys.stderr`"],
        ["ex3", "`ft_vault_security.py`", "`open()`, `read()`, `write()`, `print()`"]
      ]}},
      { ul: [
        "ex0 รับชื่อไฟล์จากบรรทัดคำสั่ง เปิด อ่าน แสดง แล้วปิด พร้อมรายงานทุกขั้น",
        "ex1 เติมอักขระ `#` ท้ายทุกบรรทัด แสดงเนื้อหาใหม่ ถามชื่อไฟล์ปลายทาง — เว้นว่างคือไม่บันทึก ถ้าให้ชื่อมาให้สร้างไฟล์หรือเขียนทับของเดิม",
        "ex2 ส่งข้อความ error ไปที่ **error stream** พร้อมคำนำหน้าที่ชัดเจน และ รับอินพุตจากผู้ใช้โดยห้ามใช้ `input()`",
        "ex3 เขียน `secure_archive()` ที่เข้าถึงไฟล์ได้ทั้งอ่านและเขียนอย่างปลอดภัย — ข้อนี้คือข้อที่ `with` ถูกอนุญาต"
      ]},
      { p: "ทุกโมดูลมีตัวอย่างผลลัพธ์ในเอกสารโจทย์ และผลลัพธ์ที่โปรแกรมพิมพ์ต้องตรงกับตัวอย่างนั้น ยกเว้นที่โจทย์ระบุว่าไม่ตรวจเข้ม" }
    ],

    py_patterns: [
      { h: "โจทย์ชุดนี้ครอบคลุมอะไร" },
      { p: "สามโมดูลเรื่องการออกแบบ: คลาสนามธรรมกับ polymorphism, ระบบ import และ package, แล้วจบด้วยรูปแบบการออกแบบขั้นสูง กฎร่วมของซีรีส์ใช้ทั้งหมด ดูที่หน้า **Python Modules 00–04**" },

      { h: "Module 05 — Code Nexus" },
      { table: { head: ["ข้อ", "ไฟล์", "ใช้ได้"], rows: [
        ["ex0", "`ex0/data_processor.py`", "builtins, ชนิดมาตรฐาน, `import typing`, `import abc`"],
        ["ex1", "`ex1/data_stream.py`", "เหมือน ex0"],
        ["ex2", "`ex2/data_pipeline.py`", "เหมือน ex0"]
      ]}},
      { ul: [
        "ex0 สร้างคลาสนามธรรม `DataProcessor` ที่มี `validate(self, data)` และ `ingest(self, data)` เป็น abstract และ `output(self)` เป็น concrete",
        "สร้างคลาสลูกสามตัว: `NumericProcessor` รับ int/float และลิสต์ของมัน (รวมลิสต์ปนชนิด), `TextProcessor` รับ str และลิสต์ของ str, `LogProcessor` รับ dict ที่เป็น str ต่อ str และลิสต์ของ dict",
        "เมธอด `ingest` ที่ override ต้อง **แคบชนิดลง** ให้เหลือเฉพาะที่รับได้ และการเรียกด้วยข้อมูลที่ไม่รองรับต้องโยนข้อผิดพลาด (ยอมให้เกิด mypy warning ตรงนี้โดยตั้งใจ)",
        "`output` ดึงข้อมูลที่ **เก่าที่สุด** ออกมาพร้อมลำดับของมัน แล้วเอาออกจากตัวเก็บ",
        "package `ex0` ห้ามเปิดเผยคลาสข้อมูลจริง เปิดเผยได้เฉพาะสิ่งที่จำเป็น",
        "ex1 สร้าง `DataStream` ที่มี `register_processor(proc)`, `process_stream(stream)` ซึ่งส่งแต่ละชิ้นไปยังตัวที่รับได้และรายงานเมื่อไม่มีตัวไหนรับ, และ `print_processors_stats()`",
        "ex2 สร้าง `ExportPlugin` ที่สืบทอดจากคลาสพิเศษ `Protocol` โดยมีเมธอด `process_output(self, data)` เป็นสัญญา แล้วให้ `DataStream` มี `output_pipeline(nb, plugin)` ที่ดึง nb ชิ้นจากทุกตัวประมวลผลออกไปทางปลั๊กอิน พร้อมทำปลั๊กอิน CSV และ JSON โดย **เขียนสตริงเอง ไม่ต้อง import อะไร**"
      ]},

      { h: "Module 06 — The Codex" },
      { note: "ห้ามแก้ไข `sys.path` และห้าม import อะไรนอกจากไฟล์ที่สร้างเองในโปรเจกต์นี้ ไม่มี `exN/` ในโมดูลนี้ — มีต้นไม้ไฟล์เดียวที่โจทย์กำหนดไว้ทั้งหมด" },
      { table: { head: ["กลุ่ม", "ไฟล์", "สาธิตอะไร"], rows: [
        ["Alembic", "`ft_alembic_0.py` ถึง `ft_alembic_5.py`", "การเข้าถึงไฟล์ระดับบนและไฟล์ใน package ด้วยทั้งสองรูปแบบ"],
        ["Distillation", "`ft_distillation_0.py`, `ft_distillation_1.py`", "การ import ซ้อนชั้น และชื่อแทนที่ package ตั้งให้"],
        ["Transmutation", "`ft_transmutation_0.py` ถึง `_2.py`", "absolute กับ relative import"],
        ["Kaboom", "`ft_kaboom_0.py`, `ft_kaboom_1.py`", "การเลี่ยงและการชน circular import"]
      ]}},
      { ul: [
        "`elements.py` ที่รากมี `create_fire()` และ `create_water()` ส่วน `alchemy/elements.py` มี `create_earth()` และ `create_air()`",
        "`ft_alembic_4.py` ต้องใช้ `import alchemy` แล้วสร้างลม และ `create_earth()` ต้องเข้าถึงผ่าน package ไม่ได้ — ต้องเกิด exception และ **mypy ต้องฟ้อง** ทั้งคู่โดยตั้งใจ",
        "`alchemy/potions.py` มี `healing_potion()` และ `strength_potion()` พร้อมวิธีเข้าถึงธาตุทั้งสี่ — ซึ่งอยู่คนละไฟล์กัน",
        "`ft_distillation_1.py` ต้องเรียก `heal()` ซึ่งเป็น **ชื่อแทนระดับ package** ของ healing potion จึงต้องปรับ `__init__.py`",
        "`alchemy/transmutation/recipes.py` มี `lead_to_gold()` และต้องมี **absolute import อย่างน้อยหนึ่ง และ relative import อย่างน้อยหนึ่ง**",
        "`light_spellbook.py` กับ `light_validator.py` ต้องทำงานได้โดยไม่ชน circular import (เลือกวิธีเองได้ แต่ต้องอธิบายวิธีอื่นได้ตอนสอบ)",
        "`dark_spellbook.py` กับ `dark_validator.py` เป็นสำเนาที่เปลี่ยนชื่อฟังก์ชันและวัตถุดิบ และ **ต้องระเบิดด้วย circular import จริง**",
        "ส่วนตรวจวัตถุดิบใช้การเทียบแบบไม่สนตัวพิมพ์เล็กใหญ่ และคืนสตริงที่มีคำว่า VALID หรือ INVALID"
      ]},

      { h: "Module 07 — DataDeck" },
      { note: "ทุกไดเรกทอรีแบบฝึกหัดต้องมี `__init__.py` และโค้ดทดสอบทั้งหมดอยู่ที่รากของ repository" },
      { table: { head: ["ข้อ", "ไฟล์ที่ส่ง", "ใช้ได้"], rows: [
        ["ex0", "`battle.py` + `ex0/` เป็น package", "builtins, ชนิดมาตรฐาน, `typing`, `abc`"],
        ["ex1", "`capacitor.py` + `ex1/`", "เหมือน ex0"],
        ["ex2", "`tournament.py` + `ex2/`", "เหมือน ex0"]
      ]}},
      { ul: [
        "ex0 คลาสนามธรรม `Creature` เก็บชื่อกับชนิด มีเมธอด `attack` เป็น abstract และ `describe` เป็น concrete พร้อมคลาสจริงสี่ตัว: `Flameling`, `Pyrodon`, `Aquabub`, `Torragon`",
        "คลาสนามธรรม `CreatureFactory` มี `create_base` และ `create_evolved` แล้ว `FlameFactory` กับ `AquaFactory` สร้างคู่ของตระกูลตัวเอง",
        "`battle.py` ต้องมี **ฟังก์ชันเดียว** ที่รับ factory แล้วตรวจว่าสร้างได้ทั้งสองตัวและทั้งคู่ describe กับ attack ได้ และอีกฟังก์ชันที่รับสอง factory มาสู้กัน",
        "ex1 คลาสความสามารถ ห้ามสืบทอดจาก `Creature` — `HealCapability` มี `heal` (จะรับ target ก็ได้), `TransformCapability` มี `transform` และ `revert` พร้อมแอตทริบิวต์สถานะที่ทำให้ `attack` เปลี่ยนพฤติกรรม",
        "`Sproutling` กับ `Bloomelle` สืบทอดจากทั้ง `Creature` และ `HealCapability` ผ่าน `HealingCreatureFactory` ส่วน `Shiftling` กับ `Morphagon` คู่กับ `TransformCapability` ผ่าน `TransformCreatureFactory`",
        "**package ของทั้งสองข้อห้ามเปิดเผยคลาสการ์ดจริง เปิดเผยได้เฉพาะ factory**",
        "ex2 `BattleStrategy` มี `act` และ `is_valid` โดย `is_valid` คืน `bool` ว่าการ์ดเหมาะกับกลยุทธ์นั้นไหม แล้วมีสามกลยุทธ์: `NormalStrategy` ใช้ได้กับทุกการ์ด, `AggressiveStrategy` สำหรับการ์ดที่แปลงร่างได้, `DefensiveStrategy` สำหรับการ์ดที่รักษาได้",
        "การจับคู่ที่ไม่เข้ากันต้องทำให้ `is_valid` คืน `False` และถ้าเรียก `act` ต้องเกิด **exception เฉพาะทางพร้อมข้อความที่ชัดเจน**",
        "`tournament.py` ต้องมี **ฟังก์ชันสู้ฟังก์ชันเดียว** ที่รับลิสต์ของคู่ (factory, strategy) แล้วให้ทุกคนสู้กับทุกคนหนึ่งครั้ง โดยใช้กลยุทธ์ของแต่ละฝ่าย และจัดการคู่ที่ไม่เข้ากันอย่างถูกต้อง"
      ]},
      { p: "ตอนสอบอาจถูกขอให้อธิบายรูปแบบการออกแบบที่ใช้ — เอกสารโจทย์ย้ำว่าให้เน้นความเข้าใจแนวคิด ไม่ใช่แค่ทำให้โค้ดรันได้" }
    ],

    py_toolkit: [
      { h: "โจทย์ชุดนี้ครอบคลุมอะไร" },
      { p: "สามโมดูลเรื่องเครื่องมือรอบตัวโปรแกรม: สภาพแวดล้อมและการจัดการแพ็กเกจ การตรวจสอบข้อมูล และการเขียนแบบฟังก์ชัน กฎร่วมของซีรีส์ใช้ทั้งหมด" },

      { h: "Module 08 — The Matrix" },
      { table: { head: ["ข้อ", "ไฟล์ที่ส่ง", "ใช้ได้"], rows: [
        ["ex0", "`ex0/construct.py`", "โมดูล `sys`, `os`, `site` และ `print()`"],
        ["ex1", "`ex1/loading.py`, `requirements.txt`, `pyproject.toml`", "pandas, requests, matplotlib, numpy, `sys`, `importlib`"],
        ["ex2", "`ex2/oracle.py`, `.env.example`, `.gitignore`", "`os`, `sys`, python-dotenv และการทำงานกับไฟล์"]
      ]}},
      { ul: [
        "ex0 ตรวจว่ากำลังทำงานอยู่ในสภาพแวดล้อมเสมือนหรือไม่ แสดงข้อมูลของสภาพแวดล้อมปัจจุบัน บอกวิธีสร้างและเปิดใช้เมื่อยังไม่มี และ **แสดงความต่างของตำแหน่งติดตั้งแพ็กเกจระหว่างระบบกับสภาพแวดล้อมเสมือน**",
        "โปรแกรมต้องทำงานได้ทั้งในและนอกสภาพแวดล้อมเสมือน โดยให้ผลลัพธ์ต่างกันตามสถานการณ์",
        "ex1 วิเคราะห์ข้อมูลด้วย pandas ใช้ numpy เป็นแหล่งข้อมูลจำลอง — ห้ามใช้ลิสต์ที่พิมพ์ไว้ตายตัวหรือ `range()` และวาดภาพด้วย matplotlib",
        "ต้องมีทั้ง `requirements.txt` สำหรับ pip และ `pyproject.toml` สำหรับ Poetry และต้องมีฟังก์ชันเปรียบเทียบที่แสดงเวอร์ชันของแพ็กเกจที่ติดตั้งอยู่",
        "ต้องตรวจว่าแพ็กเกจไหนมีอยู่บ้าง และ **แสดงข้อความช่วยเหลือพร้อมวิธีติดตั้งทั้งสองแบบเมื่อขาด** โดยไม่ล้ม — โจทย์ยกเว้นให้ flake8 และ mypy ฟ้องเฉพาะเรื่อง import ในข้อนี้",
        "ex2 โหลดการตั้งค่าจากตัวแปรสภาพแวดล้อมและไฟล์ `.env` โดยใช้ไลบรารี python-dotenv ไม่ใช่เขียน parser เอง",
        "คีย์ที่ต้องรองรับ: `MATRIX_MODE` (development หรือ production), `DATABASE_URL`, `API_KEY`, `LOG_LEVEL`, `ZION_ENDPOINT`",
        "**ตัวแปรจากสภาพแวดล้อมต้องมีลำดับความสำคัญเหนือไฟล์** และความต่างระหว่างโหมด development กับ production ต้องเห็นได้จากผลลัพธ์",
        "ต้องจัดการกรณีการตั้งค่าขาดหายอย่างเหมาะสม และ `.env` ต้องอยู่ใน `.gitignore` พร้อมอธิบายเหตุผลได้"
      ]},
      { note: "**ห้ามส่งไดเรกทอรีสภาพแวดล้อมเสมือนเข้า repository** และต้องสร้างใหม่ได้ระหว่างการตรวจ โจทย์ยังบอกให้ทดสอบโปรแกรมทั้งแบบมีและไม่มีสภาพแวดล้อมเสมือน และทั้งแบบมีและไม่มี dependency" },

      { h: "Module 09 — Cosmic Data" },
      { note: "**ใช้ Pydantic รุ่น 2 ติดตั้งด้วย pip ในสภาพแวดล้อมเสมือน** และโจทย์บอกให้เลี่ยง `@validator` ซึ่งเป็นของรุ่นเก่า ให้ใช้ `@model_validator(mode=\"after\")` แทน" },
      { table: { head: ["ข้อ", "ไฟล์", "โมเดล"], rows: [
        ["ex0", "`ex0/space_station.py`", "`SpaceStation`"],
        ["ex1", "`ex1/alien_contact.py`", "`ContactType` (enum) + `AlienContact`"],
        ["ex2", "`ex2/space_crew.py`", "`Rank` (enum) + `CrewMember` + `SpaceMission`"]
      ]}},
      { ul: [
        "ex0 ฟิลด์ที่ต้องมี: `station_id` ยาว 3–10, `name` ยาว 1–50, `crew_size` 1–20, `power_level` และ `oxygen_level` 0.0–100.0, `last_maintenance` เป็น datetime, `is_operational` ค่าเริ่มต้นจริง, `notes` ไม่บังคับ ยาวไม่เกิน 200",
        "ต้องมี `main()` ที่สร้างสถานีที่ถูกต้องหนึ่งชุด แสดงข้อมูลให้อ่านง่าย แล้วลองสร้างชุดที่ผิด เช่นลูกเรือเกิน 20 และแสดงข้อความผิดพลาด",
        "ex1 `ContactType` มีค่า radio, visual, physical, telepathic และ `AlienContact` มี `contact_id` 5–15, `timestamp`, `location` 3–100, `signal_strength` 0.0–10.0, `duration_minutes` 1–1440, `witness_count` 1–100, `message_received` ไม่บังคับ ยาวไม่เกิน 500, `is_verified` ค่าเริ่มต้นเท็จ",
        "กฎที่ต้องเขียนใน `@model_validator(mode=\"after\")`: รหัสต้องขึ้นต้นด้วย `AC`, การสัมผัสทางกายภาพต้องผ่านการยืนยันแล้ว, การสัมผัสทางจิตต้องมีพยานอย่างน้อย 3 คน, สัญญาณแรงกว่า 7.0 ต้องมีข้อความที่ได้รับมาด้วย",
        "ex2 `Rank` มี cadet, officer, lieutenant, captain, commander และ `CrewMember` มี `member_id` 3–10, `name` 2–50, `rank`, `age` 18–80, `specialization` 3–30, `years_experience` 0–50, `is_active` ค่าเริ่มต้นจริง",
        "`SpaceMission` มี `mission_id` 5–15, `mission_name` 3–100, `destination` 3–50, `launch_date`, `duration_days` 1–3650, `crew` เป็นลิสต์ของ `CrewMember` จำนวน 1–12 คน, `mission_status` ค่าเริ่มต้น `\"planned\"`, `budget_millions` 1.0–10000.0",
        "กฎความปลอดภัยของภารกิจ: รหัสต้องขึ้นต้นด้วย `M`, ต้องมีอย่างน้อยหนึ่งคนที่เป็น commander หรือ captain, ภารกิจยาวเกิน 365 วันต้องมีคนที่มีประสบการณ์ 5 ปีขึ้นไปอย่างน้อยครึ่งหนึ่ง, และลูกเรือทุกคนต้องยังประจำการอยู่"
      ]},
      { p: "โจทย์แถม `data_generator.py` และ `data_exporter.py` มาให้สร้างข้อมูลทดสอบ และอนุญาตให้ import ข้อมูล JSON กับ CSV จากไดเรกทอรีเครื่องมือนั้นได้" },

      { h: "Module 10 — FuncMage" },
      { note: "ห้ามไลบรารีภายนอก ห้ามอ่านเขียนไฟล์ ห้ามตัวแปรระดับ global และห้าม `eval()` กับ `exec()` — `Callable` ให้เอาจาก `collections.abc`" },
      { table: { head: ["ข้อ", "ไฟล์", "ใช้ได้"], rows: [
        ["ex0", "`ex0/lambda_spells.py`", "`map`, `filter`, `sorted`, `min`, `max`, `round`, `sum`, `len`"],
        ["ex1", "`ex1/higher_magic.py`", "`callable()`, `Callable`"],
        ["ex2", "`ex2/scope_mysteries.py`", "`nonlocal`"],
        ["ex3", "`ex3/functools_artifacts.py`", "`functools`, `operator`"],
        ["ex4", "`ex4/decorator_mastery.py`", "`functools.wraps`, `staticmethod`"]
      ]}},
      { ul: [
        "ex0 **ต้องใช้ lambda สำหรับการแปลงข้อมูลทั้งหมด** ห้ามใช้ `def` ตั้งชื่อฟังก์ชันสำหรับงานง่าย ๆ — `artifact_sorter` เรียงตามพลังจากมากไปน้อยด้วย `sorted`, `power_filter` กรองด้วย `filter`, `spell_transformer` เติมเครื่องหมายด้วย `map`, `mage_stats` คืน dict ที่มีพลังสูงสุด ต่ำสุด และค่าเฉลี่ยปัดสองตำแหน่ง",
        "ex1 คาถาทุกตัวมีลายเซ็นเดียวกันคือรับเป้าหมายกับพลังแล้วคืนสตริง — `spell_combiner` คืนฟังก์ชันที่เรียกทั้งสองคาถาแล้วคืน tuple, `power_amplifier` คูณพลังก่อนร่าย, `conditional_caster` ร่ายเมื่อเงื่อนไขเป็นจริง ไม่งั้นคืน `\"Spell fizzled\"` โดยเงื่อนไขและคาถารับอาร์กิวเมนต์ชุดเดียวกัน, `spell_sequence` ร่ายทุกตัวตามลำดับแล้วคืนลิสต์ของผล",
        "ex2 `mage_counter()` คืนฟังก์ชันที่นับจำนวนครั้งที่ถูกเรียก เริ่มจาก 1 และ **ตัวนับสองตัวต้องมีสถานะอิสระต่อกัน**, `spell_accumulator(initial_power)` สะสมพลังแล้วคืนยอดใหม่ทุกครั้ง, `enchantment_factory(enchantment_type)` คืนฟังก์ชันที่ต่อชื่อเสกกับชื่อของ, `memory_vault()` คืน dict ที่มี `store` และ `recall` โดย `recall` คืน `\"Memory not found\"` เมื่อไม่พบ และพื้นที่เก็บต้องเป็นของ closure",
        "ex3 `spell_reducer` ใช้ `functools.reduce` กับฟังก์ชันจากโมดูล `operator` รองรับ add, multiply, max, min — ลิสต์ว่างคืน 0 และการดำเนินการที่ไม่รู้จักต้องจัดการอย่างเหมาะสม, `partial_enchanter` ใช้ `functools.partial` สร้างสามเวอร์ชันที่ตรึงพลังไว้ที่ 50 พร้อมธาตุประจำตัว, `memoized_fibonacci` ใช้ `functools.lru_cache`, `spell_dispatcher` ใช้ `functools.singledispatch` แยกพฤติกรรมของ int, str, list และชนิดที่ไม่รู้จัก",
        "ex4 `spell_timer` วัดเวลาแล้วพิมพ์ข้อความก่อนและหลังพร้อมทศนิยมสามตำแหน่ง คืนผลลัพธ์เดิม และใช้ `functools.wraps`, `power_validator(min_power)` เป็น decorator factory ที่ปล่อยผ่านเมื่อพลังพอ ไม่งั้นคืน `\"Insufficient power for this spell\"`, `retry_spell(max_attempts)` ลองซ้ำเมื่อเกิด exception พร้อมพิมพ์ครั้งที่ลอง และคืนข้อความล้มเหลวเมื่อหมดจำนวนครั้ง",
        "คลาส `MageGuild` ต้องมี `validate_mage_name(name)` เป็น **static method** ที่ยอมรับชื่อยาวอย่างน้อย 3 ตัวและมีแต่ตัวอักษรกับช่องว่าง และ `cast_spell(self, spell_name, power)` ที่ ใช้ `power_validator` ด้วยค่าต่ำสุด 10"
      ]},
      { p: "โจทย์อนุญาตให้ปรับถ้อยคำของผลลัพธ์ได้ ตราบใดที่โครงสร้างและสาระสำคัญยังอยู่ครบ" }
    ],

    amaze: [
      { h: "โจทย์นี้ต้องการอะไร" },
      { p: "เขียนโปรแกรม Python ที่อ่านไฟล์ตั้งค่าหนึ่งไฟล์ สร้างเขาวงกต เขียนลงไฟล์ในรูปแบบเลขฐานสิบหก แสดงผลให้ดูด้วยตาได้ และแยกส่วนอัลกอริทึมเป็นโมดูลที่โปรเจกต์อื่นนำไปใช้ต่อได้" },
      { table: { head: ["หัวข้อ", "ข้อกำหนด"], rows: [
        ["วิธีรัน", "`python3 a_maze_ing.py config.txt` — ชื่อไฟล์หลักบังคับ และรับอาร์กิวเมนต์เดียวคือไฟล์ตั้งค่า"],
        ["ภาษา", "Python 3.10 ขึ้นไป ผ่าน flake8 และมี type annotation ครบ"],
        ["ไฟล์ตั้งค่า", "หนึ่งบรรทัดหนึ่งคู่ `KEY=VALUE` บรรทัดที่ขึ้นต้นด้วย `#` ต้องถูกข้าม และต้องมีไฟล์ตัวอย่างใน repo"],
        ["การจัดการ error", "ไฟล์ตั้งค่าผิด หาไฟล์ไม่เจอ ไวยากรณ์พัง ค่าที่สร้างไม่ได้ — ทุกกรณีต้องจบด้วยข้อความชัดเจน ห้ามล้มแบบไม่คาดคิด"],
        ["การแพ็ก", "ส่วนสร้างเขาวงกตต้องเป็นคลาสเดียวในโมดูลเดี่ยวที่ import ได้ พร้อมเอกสารการใช้งาน"]
      ]}},
      { h: "คีย์บังคับในไฟล์ตั้งค่า" },
      { table: { head: ["คีย์", "ความหมาย", "ตัวอย่าง"], rows: [
        ["`WIDTH`", "จำนวนช่องตามแนวกว้าง", "`WIDTH=20`"],
        ["`HEIGHT`", "จำนวนช่องตามแนวสูง", "`HEIGHT=15`"],
        ["`ENTRY`", "พิกัดทางเข้า", "`ENTRY=0,0`"],
        ["`EXIT`", "พิกัดทางออก", "`EXIT=19,14`"],
        ["`OUTPUT_FILE`", "ชื่อไฟล์ผลลัพธ์", "`OUTPUT_FILE=maze.txt`"],
        ["`PERFECT`", "ให้เขาวงกตสมบูรณ์แบบหรือไม่", "`PERFECT=True`"]
      ]}},
      { h: "ข้อกำหนดของตัวเขาวงกต" },
      { ul: [
        "สุ่มสร้าง แต่ต้องทำซ้ำได้ด้วย seed",
        "แต่ละช่องมีผนัง 0 ถึง 4 ด้าน ตามทิศเหนือ ตะวันออก ใต้ ตะวันตก",
        "ทางเข้ากับทางออกต้องมีอยู่จริง ต่างกัน และอยู่ในขอบเขต",
        "ทุกช่องต้องเชื่อมถึงกัน ไม่มีช่องโดดเดี่ยว ยกเว้นช่องของลาย 42",
        "ขอบนอกต้องมีผนัง เพราะทางเข้ากับทางออกเป็นช่องเฉพาะ",
        "ช่องที่ติดกันต้องเห็นผนังร่วมตรงกันทั้งสองฝั่ง",
        "ห้ามมีพื้นที่โล่ง 3x3 — ทางเดินกว้างได้ไม่เกิน 2 ช่อง",
        "ต้องมองเห็นเลข 42 ที่วาดด้วยช่องซึ่งปิดผนังครบทุกด้าน",
        "ถ้า `PERFECT` เปิดอยู่ ต้องมีทางเดียวเท่านั้นระหว่างทางเข้ากับทางออก"
      ]},
      { h: "รูปแบบไฟล์ผลลัพธ์" },
      { ul: [
        "หนึ่งหลักฐานสิบหกต่อหนึ่งช่อง โดยบิตที่ติดแปลว่าผนังปิด — บิต 0 เหนือ, 1 ตะวันออก, 2 ใต้, 3 ตะวันตก",
        "เรียงทีละแถว หนึ่งแถวต่อหนึ่งบรรทัด",
        "ตามด้วยบรรทัดว่าง แล้วสามบรรทัด: พิกัดทางเข้า พิกัดทางออก และเส้นทางที่สั้นที่สุดด้วยตัวอักษร N E S W",
        "ทุกบรรทัดลงท้ายด้วยการขึ้นบรรทัดใหม่",
        "โจทย์ให้สคริปต์ตรวจไฟล์ผลลัพธ์มาด้วย และบอกว่า Moulinette อาจใช้ตรวจอัตโนมัติ"
      ]},
      { h: "การแสดงผลและการโต้ตอบ" },
      { ul: [
        "แสดงเป็น ASCII ในเทอร์มินัล หรือใช้ MiniLibX ก็ได้",
        "ต้องเห็นผนัง ทางเข้า ทางออก และเส้นทางคำตอบได้ชัด",
        "ต้องสร้างเขาวงกตใหม่แล้วแสดงได้",
        "ต้องซ่อนและแสดงเส้นทางที่สั้นที่สุดได้",
        "ต้องเปลี่ยนสีผนังได้ และเลือกได้ว่าจะให้ลาย 42 มีสีของตัวเอง"
      ]},
      { note: "ถ้าตารางเล็กเกินกว่าจะใส่ลาย 42 ได้ ให้พิมพ์ข้อความแจ้งทางคอนโซลแล้วสร้างต่อ ไม่ใช่ล้มเลิก" }
    ]
  };

  var EN = {

    py_series: [
      { h: "What this set of subjects covers" },
      { p: "Eleven modules repeat the same General Instructions almost word for word. This page keeps the shared rules, then walks modules 00 to 04 exercise by exercise." },
      { table: { head: ["Shared rule", "Detail"], rows: [
        ["Language", "Python 3.10 or later"],
        ["Style", "flake8 clean — no config file is supplied, so its defaults apply, including the 79-column line length"],
        ["Types", "from module 01 on, every function and method needs type hints, checked with mypy"],
        ["Layout", "one exercise per `exN/` directory, with the file named exactly as asked"],
        ["Authorised", "each exercise lists the functions it may use; anything outside that list is not allowed"],
        ["Robustness", "the program must run without letting an error escape"],
        ["Submission", "submit only the files the subject asks for, and check the names before you do"]
      ]}},

      { h: "Module 00 — Growing Code" },
      { note: "**The most important rule of this module: write only a function, not a program.** No `if __name__ == \"__main__\":`, no calling the function yourself in the file, and no code outside a function. Each file holds only the requested function, which handles its own input and output." },
      { table: { head: ["Exercise", "File", "Authorised"], rows: [
        ["ex0", "`ft_hello_garden.py`", "`print()`"],
        ["ex1", "`ft_garden_name.py`", "`input()`, `print()`"],
        ["ex2", "`ft_plot_area.py`", "`input()`, `int()`, `print()`"],
        ["ex3", "`ft_harvest_total.py`", "`input()`, `int()`, `print()`"],
        ["ex4", "`ft_plant_age.py`", "`input()`, `int()`, `print()`"],
        ["ex5", "`ft_water_reminder.py`", "`input()`, `int()`, `print()`"],
        ["ex6", "`ft_count_harvest_iterative.py`, `ft_count_harvest_recursive.py`", "plus `range()` and helper functions for the recursion"],
        ["ex7", "`ft_seed_inventory.py`", "`print()` and string methods"]
      ]}},
      { ul: [
        "ex0 prints one welcome line",
        "ex1 asks for a garden name, then shows it with a status line that is always exactly the same",
        "ex2 asks for a length and a width, then shows the area",
        "ex3 asks for three days of harvest weights and shows the total",
        "ex4 asks for a plant's age in days — ready to harvest only at **strictly more than 60 days**",
        "ex5 asks how many days since the last watering — water it when that is **more than 2**",
        "ex6 counts 1 to a given number both iteratively and recursively, and **the output must be identical**. The subject accepts a nested helper, default parameter values, or a separate helper function",
        "ex7 has a fixed signature: `ft_seed_inventory(seed_type: str, quantity: int, unit: str) -> None`, handling the units `packets`, `grams` and `area`; any other unit prints only `Unknown unit type` with nothing else on the line"
      ]},
      { note: "Type hints are optional in exercises 0–6 and **required in exercise 7**. Input validation is not needed unless the exercise says so, and the subject ships a `main.py` for testing — copy it beside the files you want to test." },

      { h: "Module 01 — Code Cultivation" },
      { p: "From exercise 1 onward **every exercise requires classes**, and from exercise 0 onward every file is a program that runs on its own. The evaluation may ask you to add a shebang live." },
      { table: { head: ["Exercise", "File", "Authorised"], rows: [
        ["ex0", "`ft_garden_intro.py`", "`print()`"],
        ["ex1", "`ft_garden_data.py`", "`print()`"],
        ["ex2", "`ft_plant_growth.py`", "`print()`, `range()`, `round()`"],
        ["ex3", "`ft_plant_factory.py`", "`print()`, `range()`, `round()`"],
        ["ex4", "`ft_garden_security.py`", "`print()`, `range()`, `round()`"],
        ["ex5", "`ft_plant_types.py`", "`super()`, `print()`, `range()`, `round()`"],
        ["ex6", "`ft_garden_analytics.py`", "plus `staticmethod()`, `classmethod()`"]
      ]}},
      { ul: [
        "ex0 a program that runs directly, using the `if __name__ == \"__main__\":` pattern, holding a name, a height and an age in variables and displaying them",
        "ex1 create a `Plant` class as the model for any plant, and manage at least 3 of them through the same attributes",
        "ex2 give plants `grow()` and `age()` of their own, simulate a week of growth, and report the total increase; different plants should evolve differently",
        "ex3 plants must be usable immediately after construction, with at least 5 different ones created",
        "ex4 protect the data with `set_height()`, `set_age()`, `get_height()`, `get_age()`, refusing negative values with a printed message and leaving the data unchanged, using the **protected convention rather than mangling**",
        "ex5 add `Flower`, `Tree` and `Vegetable` inheriting from `Plant` — a flower has a colour and `bloom()`, a tree a trunk diameter and `produce_shade()`, a vegetable a harvest season and a nutritional value that starts at 0 and rises with `grow()` and `age()` — and a subclass's `show()` must call the parent's through `super()` rather than copying it",
        "ex6 add a static method testing whether a given age is over a year, a class method building an anonymous plant, a `Seed` class inheriting from `Flower`, a nested class holding per-plant counts of `grow()`, `age()` and `show()` calls (trees also count `produce_shade()`), and one free function outside any class that displays statistics for any kind of plant"
      ]},
      { note: "The subject accepts decorator syntax for the static and class methods, and allows `capitalize()` even though it is not in the authorised list." },

      { h: "Module 02 — Garden Guardian" },
      { table: { head: ["Exercise", "File", "Authorised"], rows: [
        ["ex0", "`ft_first_exception.py`", "`int()`, `print()`"],
        ["ex1", "`ft_raise_exception.py`", "`int()`, `print()`"],
        ["ex2", "`ft_different_errors.py`", "`print()`, `open()`, `int()`"],
        ["ex3", "`ft_custom_errors.py`", "`print()`"],
        ["ex4", "`ft_finally_block.py`", "`print()`, `str.capitalize()`"]
      ]}},
      { ul: [
        "ex0 write `input_temperature(temp_str)` converting a string to a whole number, and `test_temperature()` exercising both a valid input (`\"25\"`) and an invalid one (`\"abc\"`), catching the failure, printing a message, and showing that **the program keeps running**",
        "ex1 add a range check of 0 to 40 degrees inclusive, raising outside it, and add the extreme tests `\"100\"` and `\"-50\"`; the file's main part calls `test_temperature()`",
        "ex2 write `garden_operations(operation_number)` where values 0 to 3 each raise one of `ValueError`, `ZeroDivisionError`, `FileNotFoundError` and `TypeError`, and other values raise nothing",
        "ex3 create `GardenError` as the base with `PlantError` and `WaterError` inheriting from it, each with its own default message when none is given, and demonstrate that catching `GardenError` catches them all",
        "ex4 write `water_plant(plant_name)` that succeeds when the name is capitalised and raises `PlantError` when it is not, plus a `test_watering_system()` showing that `finally` runs either way"
      ]},
      { note: "The subject says you may use the base `Exception` class or work out which exceptions `input_temperature()` can raise, and it notes that the type hints you settle on here apply to every exercise and every later project." },

      { h: "Module 03 — Data Quest" },
      { table: { head: ["Exercise", "File", "Authorised (abridged)"], rows: [
        ["ex0", "`ft_command_quest.py`", "`sys.argv`, `len()`, `print()`"],
        ["ex1", "`ft_score_analytics.py`", "plus `sum()`, `max()`, `min()`"],
        ["ex2", "`ft_coordinate_system.py`", "`math.sqrt()`, `input()`, `round()`, `print()`"],
        ["ex3", "`ft_achievement_tracker.py`", "`random.*`, `set()` and set methods"],
        ["ex4", "`ft_inventory_system.py`", "`sys.argv`, `sum()`, `list()`, `round()`"],
        ["ex5", "`ft_data_stream.py`", "`next()`, `range()`, `typing`"],
        ["ex6", "`ft_data_alchemist.py`", "`random.*`, `len()`, `sum()`, `round()`"]
      ]}},
      { ul: [
        "ex0 read the parameters from the command line",
        "ex1 turn them into scores in a list, handle no arguments and non-numeric values, then report the count, total, highest and lowest — **when valid and invalid values are mixed, discard only the invalid ones**",
        "ex2 ask for coordinates in the form `x,y,z`, retry until they are valid, return them as a tuple, then compute the distance to the origin and between two sets of coordinates",
        "ex3 build achievement sets for at least four players, then find every unique achievement, the ones everyone shares, the ones only one player has, and the ones each player is still missing",
        "ex4 take an inventory from the command line into a dict, then display it, the total quantity, each item's share as a percentage, the most and least abundant (**ties go to whichever came first on the command line**), and finally add a new item and display it again",
        "ex5 create an endless generator `gen_event()` that picks a random name from a list",
        "ex6 build a list of player names, some capitalised and some not, and derive data from it with comprehensions"
      ]},
      { note: "This is the module where `sys.argv` first appears — its values are always strings, and `sys.argv[0]` is the script's name rather than the first argument." },

      { h: "Module 04 — Data Archivist" },
      { note: "The hardest sequencing rule in the series: `with` is forbidden until exercise 3. The first three must open and close their files by hand, with the close in a `finally` so an error cannot leak a descriptor." },
      { table: { head: ["Exercise", "File", "Authorised (abridged)"], rows: [
        ["ex0", "`ft_ancient_text.py`", "`sys.argv`, `open()`, `typing.IO`"],
        ["ex1", "`ft_archive_creation.py`", "as ex0"],
        ["ex2", "`ft_stream_management.py`", "`sys.stdin`, `sys.stdout`, `sys.stderr`"],
        ["ex3", "`ft_vault_security.py`", "`open()`, `read()`, `write()`, `print()`"]
      ]}},
      { ul: [
        "ex0 take a filename from the command line, open it, read it, show it and close it, reporting each step",
        "ex1 append a `#` to the end of every line, show the new content, ask for a destination filename — empty means do not save — and create or replace the file when one is given",
        "ex2 send error messages to the **error stream** with a clear prefix, and read user input without using `input()`",
        "ex3 write `secure_archive()` giving safe access to any file for both reading and writing — this is the exercise where `with` becomes allowed"
      ]},
      { p: "Every module ships example output in its subject, and what the program prints must match it, except where the subject says the check is not strict." }
    ],

    py_patterns: [
      { h: "What this set of subjects covers" },
      { p: "Three modules on design: abstract classes and polymorphism, the import system and packages, and advanced design patterns. The series' shared rules all apply — see the **Python Modules 00–04** page." },

      { h: "Module 05 — Code Nexus" },
      { table: { head: ["Exercise", "File", "Authorised"], rows: [
        ["ex0", "`ex0/data_processor.py`", "builtins, standard types, `import typing`, `import abc`"],
        ["ex1", "`ex1/data_stream.py`", "as ex0"],
        ["ex2", "`ex2/data_pipeline.py`", "as ex0"]
      ]}},
      { ul: [
        "ex0 create an abstract `DataProcessor` with `validate(self, data)` and `ingest(self, data)` abstract and `output(self)` concrete",
        "create three subclasses: `NumericProcessor` for ints and floats and lists of them including mixed ones, `TextProcessor` for strings and lists of strings, `LogProcessor` for string-to-string dicts and lists of them",
        "an overriding `ingest` must **narrow its type** to what that subclass accepts, and calling it with unsupported data must raise (a mypy warning here is deliberate)",
        "`output` extracts the **oldest** stored item together with its processing rank, and removes it",
        "**the ex0 package must not expose the concrete processors directly**",
        "ex1 create a `DataStream` with `register_processor(proc)`, `process_stream(stream)` that routes each element to a processor that can take it and reports the ones nobody can, and `print_processors_stats()`",
        "ex2 create an `ExportPlugin` inheriting the special `Protocol` class with `process_output(self, data)` as its contract, give `DataStream` an `output_pipeline(nb, plugin)` that drains nb items from every registered processor through the plugin, and write CSV and JSON plugins **building the strings by hand, with no imports**"
      ]},

      { h: "Module 06 — The Codex" },
      { note: "Modifying `sys.path` is forbidden, and only files created in this project may be imported. There are no `exN/` directories here — the subject specifies one whole file tree." },
      { table: { head: ["Group", "Files", "What it demonstrates"], rows: [
        ["Alembic", "`ft_alembic_0.py` to `ft_alembic_5.py`", "reaching a top-level file and a package file with both import forms"],
        ["Distillation", "`ft_distillation_0.py`, `ft_distillation_1.py`", "nested imports and a package-level alias"],
        ["Transmutation", "`ft_transmutation_0.py` to `_2.py`", "absolute versus relative imports"],
        ["Kaboom", "`ft_kaboom_0.py`, `ft_kaboom_1.py`", "avoiding and then hitting a circular import"]
      ]}},
      { ul: [
        "the root `elements.py` holds `create_fire()` and `create_water()`, while `alchemy/elements.py` holds `create_earth()` and `create_air()`",
        "`ft_alembic_4.py` must use `import alchemy` and create air, and `create_earth()` must not be reachable through the package — both an exception and a mypy error are expected, on purpose",
        "`alchemy/potions.py` holds `healing_potion()` and `strength_potion()` plus whatever it takes to reach all four elements, which live in two different files",
        "`ft_distillation_1.py` must call `heal()`, a **package-level alias** of the healing potion, which means improving the `__init__.py`",
        "`alchemy/transmutation/recipes.py` holds `lead_to_gold()` and must contain **at least one absolute and one relative import**",
        "`light_spellbook.py` and `light_validator.py` must work without a circular import; you pick the technique, but must be able to explain the alternatives at the evaluation",
        "`dark_spellbook.py` and `dark_validator.py` are the duplicated pair with renamed functions and ingredients, and **must genuinely explode with a circular import**",
        "the validators compare ingredients case-insensitively and return a string carrying the keyword VALID or INVALID"
      ]},

      { h: "Module 07 — DataDeck" },
      { note: "Every exercise directory must contain an `__init__.py`, and all the testing code lives at the root of the repository." },
      { table: { head: ["Exercise", "Files to submit", "Authorised"], rows: [
        ["ex0", "`battle.py` plus `ex0/` as a package", "builtins, standard types, `typing`, `abc`"],
        ["ex1", "`capacitor.py` plus `ex1/`", "as ex0"],
        ["ex2", "`tournament.py` plus `ex2/`", "as ex0"]
      ]}},
      { ul: [
        "ex0 an abstract `Creature` holding a name and a type, with `attack` abstract and `describe` concrete, plus four concrete cards: `Flameling`, `Pyrodon`, `Aquabub` and `Torragon`",
        "an abstract `CreatureFactory` with `create_base` and `create_evolved`, and `FlameFactory` and `AquaFactory` producing their own family's pair",
        "`battle.py` must use **a single function** that takes a factory and checks that it can build both cards and that both can describe themselves and attack, plus another function that takes both factories and makes their base cards fight",
        "ex1 the capability classes must not inherit from `Creature` — `HealCapability` declares `heal` (which may take a target), `TransformCapability` declares `transform` and `revert` with a state attribute that changes how `attack` behaves",
        "`Sproutling` and `Bloomelle` inherit from both `Creature` and `HealCapability` and come from `HealingCreatureFactory`; `Shiftling` and `Morphagon` pair with `TransformCapability` through `TransformCreatureFactory`",
        "**neither package may expose the concrete cards; only the factories**",
        "ex2 `BattleStrategy` declares `act` and `is_valid`, where `is_valid` returns a `bool` saying whether a creature suits the strategy, plus three concrete strategies: `NormalStrategy` for any creature, `AggressiveStrategy` for creatures that transform, `DefensiveStrategy` for creatures that heal",
        "an invalid pairing must make `is_valid` return `False`, and calling `act` on one must raise **a dedicated exception with a clear message**",
        "`tournament.py` must define **a single battle function** taking a list of (factory, strategy) pairs, making each opponent fight every other one once, using each creature's own strategy, and handling invalid pairs correctly"
      ]},
      { p: "The evaluation may ask you to explain the design patterns used; the subject stresses understanding the concepts rather than merely making the code run." }
    ],

    py_toolkit: [
      { h: "What this set of subjects covers" },
      { p: "Three modules on the tooling around a program: environments and package management, data validation, and functional programming. The series' shared rules all apply." },

      { h: "Module 08 — The Matrix" },
      { table: { head: ["Exercise", "Files to submit", "Authorised"], rows: [
        ["ex0", "`ex0/construct.py`", "the `sys`, `os` and `site` modules, and `print()`"],
        ["ex1", "`ex1/loading.py`, `requirements.txt`, `pyproject.toml`", "pandas, requests, matplotlib, numpy, `sys`, `importlib`"],
        ["ex2", "`ex2/oracle.py`, `.env.example`, `.gitignore`", "`os`, `sys`, python-dotenv, file operations"]
      ]}},
      { ul: [
        "ex0 detect whether it is running inside a virtual environment, display information about the current one, give the instructions for creating and activating one when there is none, and **show the difference between the global and virtual-environment package locations**",
        "the program must work both inside and outside a virtual environment, giving different output for each",
        "ex1 analyse data with pandas, using numpy as the source of the simulated data — hardcoded lists and `range()` are not allowed — and visualise it with matplotlib",
        "both a `requirements.txt` for pip and a `pyproject.toml` for Poetry are required, along with a comparison function showing the installed package versions",
        "it must detect which packages are available and **give helpful installation instructions for both routes when they are missing**, without crashing — the subject exceptionally allows flake8 and mypy import errors in this exercise",
        "ex2 load configuration from environment variables and a `.env` file using the python-dotenv library rather than a hand-written parser",
        "the keys to handle are `MATRIX_MODE` (development or production), `DATABASE_URL`, `API_KEY`, `LOG_LEVEL` and `ZION_ENDPOINT`",
        "**environment variables must take precedence over the file**, and the difference between development and production must be visible in the output",
        "missing configuration must be handled properly, and `.env` must be in `.gitignore` with an explanation you can give"
      ]},
      { note: "**The virtual environment directory must not be submitted**, and you must be able to create a new one during the review. The subject also says to test the program with and without a virtual environment, and with and without the dependencies." },

      { h: "Module 09 — Cosmic Data" },
      { note: "**Use Pydantic 2.x, installed with pip inside a virtual environment.** The subject says to avoid `@validator`, which belongs to the previous version, and to use `@model_validator(mode=\"after\")` instead." },
      { table: { head: ["Exercise", "File", "Models"], rows: [
        ["ex0", "`ex0/space_station.py`", "`SpaceStation`"],
        ["ex1", "`ex1/alien_contact.py`", "`ContactType` enum plus `AlienContact`"],
        ["ex2", "`ex2/space_crew.py`", "`Rank` enum plus `CrewMember` and `SpaceMission`"]
      ]}},
      { ul: [
        "ex0 the fields are `station_id` 3–10 characters, `name` 1–50, `crew_size` 1–20, `power_level` and `oxygen_level` 0.0–100.0, `last_maintenance` as a datetime, `is_operational` defaulting to true, and an optional `notes` of at most 200 characters",
        "a `main()` must build one valid station, display it clearly, then attempt an invalid one — a crew over 20, for instance — and show the validation message",
        "ex1 `ContactType` holds radio, visual, physical and telepathic, and `AlienContact` has `contact_id` 5–15, `timestamp`, `location` 3–100, `signal_strength` 0.0–10.0, `duration_minutes` 1–1440, `witness_count` 1–100, an optional `message_received` of at most 500, and `is_verified` defaulting to false",
        "the rules for `@model_validator(mode=\"after\")`: the id must start with `AC`, physical contact must be verified, telepathic contact needs at least 3 witnesses, and a signal above 7.0 must come with a received message",
        "ex2 `Rank` holds cadet, officer, lieutenant, captain and commander, and `CrewMember` has `member_id` 3–10, `name` 2–50, `rank`, `age` 18–80, `specialization` 3–30, `years_experience` 0–50, and `is_active` defaulting to true",
        "`SpaceMission` has `mission_id` 5–15, `mission_name` 3–100, `destination` 3–50, `launch_date`, `duration_days` 1–3650, `crew` as a list of 1 to 12 `CrewMember`, `mission_status` defaulting to `\"planned\"`, and `budget_millions` 1.0–10000.0",
        "the mission's safety rules: the id must start with `M`, at least one commander or captain must be aboard, a mission over 365 days needs at least half the crew with 5 or more years of experience, and every crew member must be active"
      ]},
      { p: "The subject ships `data_generator.py` and `data_exporter.py` for producing test data, and allows importing JSON and CSV data from that tools directory." },

      { h: "Module 10 — FuncMage" },
      { note: "No external libraries, no file I/O, no global variables, and no `eval()` or `exec()`. `Callable` must come from `collections.abc`." },
      { table: { head: ["Exercise", "File", "Authorised"], rows: [
        ["ex0", "`ex0/lambda_spells.py`", "`map`, `filter`, `sorted`, `min`, `max`, `round`, `sum`, `len`"],
        ["ex1", "`ex1/higher_magic.py`", "`callable()`, `Callable`"],
        ["ex2", "`ex2/scope_mysteries.py`", "`nonlocal`"],
        ["ex3", "`ex3/functools_artifacts.py`", "`functools`, `operator`"],
        ["ex4", "`ex4/decorator_mastery.py`", "`functools.wraps`, `staticmethod`"]
      ]}},
      { ul: [
        "ex0 **all transformations must use lambdas**, with no `def` naming a function for a simple one-off job — `artifact_sorter` sorts by power descending with `sorted`, `power_filter` filters with `filter`, `spell_transformer` adds markers with `map`, and `mage_stats` returns a dict of the highest and lowest power and the average rounded to two places",
        "ex1 every spell shares one signature, taking a target and a power and returning a string — `spell_combiner` returns a function calling both spells and returning a tuple, `power_amplifier` multiplies the power before casting, `conditional_caster` casts when the condition holds and otherwise returns `\"Spell fizzled\"` with the condition and the spell receiving the same arguments, and `spell_sequence` casts them all in order and returns the list of results",
        "ex2 `mage_counter()` returns a function counting its own calls from 1, and **two counters must have independent state**; `spell_accumulator(initial_power)` accumulates and returns the new total each time; `enchantment_factory(enchantment_type)` returns a function joining the enchantment to an item name; `memory_vault()` returns a dict with `store` and `recall`, where `recall` returns `\"Memory not found\"` for an unknown key and the storage belongs to the closure",
        "ex3 `spell_reducer` uses `functools.reduce` with functions from `operator`, supporting add, multiply, max and min, returning 0 for an empty list and handling an unknown operation properly; `partial_enchanter` uses `functools.partial` to build three versions with the power fixed at 50 and one element each; `memoized_fibonacci` uses `functools.lru_cache`; `spell_dispatcher` uses `functools.singledispatch` to separate int, str, list and unknown types",
        "ex4 `spell_timer` measures the time, prints a line before and after with three decimal places, returns the original result and uses `functools.wraps`; `power_validator(min_power)` is a decorator factory that lets a call through when the power is enough and otherwise returns `\"Insufficient power for this spell\"`; `retry_spell(max_attempts)` retries on an exception, printing which attempt it is on, and returns a failure message once the attempts run out",
        "the `MageGuild` class needs `validate_mage_name(name)` as a **static method** accepting names of at least 3 characters made only of letters and spaces, and `cast_spell(self, spell_name, power)` that uses `power_validator` with a minimum of 10"
      ]},
      { p: "The subject allows the wording of the output to be adjusted, as long as the structure and the essential information remain." }
    ],

    amaze: [
      { h: "What the subject asks for" },
      { p: "Write a Python program that reads one configuration file, generates a maze, writes it to a file in a hexadecimal format, displays it visually, and keeps the generation logic in a module another project can reuse." },
      { table: { head: ["Topic", "Requirement"], rows: [
        ["How it runs", "`python3 a_maze_ing.py config.txt` — the entry point's name is fixed, and it takes one argument: the config file"],
        ["Language", "Python 3.10 or later, flake8 clean, fully annotated"],
        ["Config file", "one `KEY=VALUE` per line; lines starting with `#` must be skipped; a default file must be in the repository"],
        ["Error handling", "an invalid config, a missing file, bad syntax, impossible parameters — all must end in a clear message, never an unexpected crash"],
        ["Packaging", "the generation logic must be one class in a standalone importable module, with documentation"]
      ]}},
      { h: "The mandatory config keys" },
      { table: { head: ["Key", "Meaning", "Example"], rows: [
        ["`WIDTH`", "maze width in cells", "`WIDTH=20`"],
        ["`HEIGHT`", "maze height in cells", "`HEIGHT=15`"],
        ["`ENTRY`", "entry coordinates", "`ENTRY=0,0`"],
        ["`EXIT`", "exit coordinates", "`EXIT=19,14`"],
        ["`OUTPUT_FILE`", "the output filename", "`OUTPUT_FILE=maze.txt`"],
        ["`PERFECT`", "whether the maze must be perfect", "`PERFECT=True`"]
      ]}},
      { h: "What the maze itself must satisfy" },
      { ul: [
        "Randomly generated, but reproducible from a seed",
        "Each cell has between 0 and 4 walls, at the four cardinal points",
        "The entry and exit must exist, differ, and lie inside the bounds",
        "Full connectivity with no isolated cells, except the 42 pattern's cells",
        "The outer border must be walled, since the entry and exit are specific cells",
        "Neighbouring cells must agree about the wall between them",
        "No 3x3 open area — corridors may be at most 2 cells wide",
        "A visible 42 drawn by several fully closed cells",
        "With `PERFECT` on, exactly one path between the entry and the exit"
      ]},
      { h: "The output file format" },
      { ul: [
        "One hexadecimal digit per cell, where a set bit means the wall is closed — bit 0 north, 1 east, 2 south, 3 west",
        "Stored row by row, one row per line",
        "Then a blank line, then three lines: the entry coordinates, the exit coordinates, and the shortest valid path written with N, E, S and W",
        "Every line ends with a newline",
        "A validation script ships with the subject, and a Moulinette may use it to check the file automatically"
      ]},
      { h: "Display and interaction" },
      { ul: [
        "Terminal ASCII rendering or a MiniLibX window, either is accepted",
        "Walls, entry, exit and the solution path must all be clearly visible",
        "Regenerating a new maze and displaying it must be possible",
        "Showing and hiding the shortest path must be possible",
        "Changing the wall colours must be possible, and optionally colouring the 42"
      ]},
      { note: "When the grid is too small to fit the 42, print a message on the console and carry on generating rather than giving up." }
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
