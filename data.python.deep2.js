/* รอบสอง — เติมความลึกให้ py_toolkit และ amaze */
(function () {

  var TH = {
    py_toolkit: {
      theory: [
        { h: "Module 08 — pip กับ Poetry ต่างกันตอนไหนจริง ๆ" },
        { p: "ความต่างไม่ได้อยู่ที่การสะกดคำสั่ง แต่อยู่ที่ **ใครเป็นคนแก้ปัญหาเวอร์ชันชนกัน** ลองนึกภาพว่าโปรเจกต์ต้องการสองไลบรารีที่ต่างก็ต้องการไลบรารีที่สามคนละช่วง" },
        { code: String.raw`# requirements.txt
alpha>=2.0        # ต้องการ shared>=1.0,<2.0
beta>=3.0         # ต้องการ shared>=2.0`,
          cap: "สองบรรทัดนี้อยู่ร่วมกันไม่ได้ แต่ pip ไม่รู้จนกว่าจะติดตั้ง", lang: "text" },
        { table: { head: ["ขั้น", "pip", "Poetry"], rows: [
          ["อ่านไฟล์", "ไล่ทีละบรรทัด", "อ่านทั้งกราฟก่อน"],
          ["เจอความขัดแย้ง", "ติดตั้ง `shared` เวอร์ชันที่ตัวหลังขอ ทับของเดิม", "ปฏิเสธตั้งแต่ยังไม่ติดตั้งอะไรเลย"],
          ["ผลลัพธ์", "ติดตั้งสำเร็จ แต่ `alpha` พังตอนรัน", "ล้มเหลวพร้อมบอกว่าคู่ไหนขัดกัน"],
          ["บันทึกไว้ที่ไหน", "`pip freeze` บันทึกสิ่งที่บังเอิญได้มา", "`poetry.lock` บันทึกสิ่งที่คำนวณแล้วว่าเข้ากันได้"],
          ["เครื่องถัดไป", "อาจได้คนละชุด", "ได้ชุดเดียวกันเป๊ะ"]
        ]}},
        { code: String.raw`# requirements.txt — บอกช่วงที่ยอมรับ ไม่ได้บอกเวอร์ชันที่ใช้จริง
numpy>=2.0,<3.0
pandas>=2.2,<4.0
matplotlib>=3.8,<4.0`,
          cap: "`<` ที่เมเจอร์ถัดไป กันการอัปเดตที่ตั้งใจจะพัง API", lang: "text" },
        { code: String.raw`[project]
name = "matrix-loading"
version = "1.0.0"
requires-python = ">=3.10"
dependencies = [
    "numpy>=2.0,<3.0",
    "pandas>=2.2,<4.0",
    "matplotlib>=3.8,<4.0",
]

[tool.poetry]
package-mode = false`,
          cap: "pyproject.toml — ประกาศเจตนา แล้วให้ตัวแก้ปัญหาไปหาเวอร์ชันจริง", lang: "toml" },
        { note: "`poetry.lock` ต้อง commit ส่วน `.venv` ต้องไม่ — lock file คือคำอธิบายของสภาพแวดล้อม ส่วน `.venv` คือตัวสภาพแวดล้อมเอง ซึ่งสร้างใหม่ได้จาก lock file เสมอ" },
        { h: "การตรวจ dependency ที่ไม่ทำให้โปรแกรมล้ม" },
        { code: String.raw`DEPENDENCIES = [
    Dependency("pandas", "Data manipulation"),
    Dependency("numpy", "Numerical computation"),
    Dependency("matplotlib", "Visualization"),
]


def check_dependencies() -> dict[str, Any]:
    """รายงานทุกตัว แล้วคืนเฉพาะตัวที่โหลดได้"""
    print("Checking dependencies:")
    loaded: dict[str, Any] = {}
    for dependency in DEPENDENCIES:
        module = load(dependency.module)
        if module is None:
            print(f"[MISSING] {dependency.module} - {dependency.purpose} "
                  "unavailable")
            continue
        loaded[dependency.module] = module
        version = getattr(module, "__version__", "unknown")
        print(f"[OK] {dependency.module} ({version}) - "
              f"{dependency.purpose} ready")
    return loaded`,
          cap: "รายงานให้ครบก่อน แล้วค่อยตัดสินใจ — ไม่ใช่หยุดที่ตัวแรกที่หาย", lang: "python" },
        { code: String.raw`$ python3 ex1/loading.py            # ไม่มีไลบรารีเลย
LOADING STATUS: Loading programs...
Checking dependencies:
[MISSING] pandas - Data manipulation unavailable
[MISSING] numpy - Numerical computation unavailable
[MISSING] matplotlib - Visualization unavailable
Cannot analyse anything without those packages.
With pip:
  python3 -m venv .venv
  source .venv/bin/activate
  pip install -r requirements.txt
With Poetry:
  poetry install
  poetry run python3 loading.py
$ echo $?
1`,
          cap: "ออกด้วยรหัสไม่เท่าศูนย์ เพราะงานที่ตั้งใจจะทำนั้นไม่ได้ทำ", lang: "bash" },
        { note: "เลือก backend `Agg` ก่อน import `matplotlib.pyplot` ไม่งั้นเครื่องที่ไม่มีจอ — build server, การตรวจผ่าน ssh — จะ import ไม่ผ่านทั้งที่โปรแกรมแค่จะเซฟไฟล์ภาพ และ seed ตัวสุ่มของ numpy ด้วย ไม่งั้นภาพเปลี่ยนทุกครั้งที่รัน" },
        { h: "ลำดับความสำคัญของการตั้งค่า" },
        { code: String.raw`from dotenv import load_dotenv

from_shell = {key for key in KEYS if key in os.environ}   # อ่านก่อน!
load_dotenv(ENV_FILE, override=False)                     # เติมเฉพาะที่ขาด
from_file = {key for key in KEYS
             if key in os.environ and key not in from_shell}`,
          cap: "ต้องอ่าน os.environ ก่อน ไม่งั้นแยกไม่ออกว่าค่ามาจากไหน", lang: "python" },
        { table: { head: ["รันแบบ", "`MATRIX_MODE`", "มาจาก"], rows: [
          ["`python3 oracle.py` (ไม่มี .env)", "development", "ค่าเริ่มต้นในโค้ด"],
          ["`python3 oracle.py` (มี .env)", "ตามที่ไฟล์บอก", ".env"],
          ["`MATRIX_MODE=production python3 oracle.py`", "production", "สภาพแวดล้อม — ชนะไฟล์"],
          ["ตั้งใน .env แล้วตั้งใน shell ด้วย", "ค่าจาก shell", "`override=False` คือค่าเริ่มต้นและถูกต้อง"]
        ]}},
        { p: "แถวสุดท้ายคือสิ่งที่ทำให้ deployment ทำงานได้ — เซิร์ฟเวอร์ตั้ง secret ไว้ในสภาพแวดล้อม แล้วไฟล์ของนักพัฒนาที่หลุดขึ้นไปจะไม่ทับมัน ถ้าใส่ `override=True` ทิศทางนี้กลับด้านทันที" },

        { h: "Module 09 — ลำดับการตรวจของโมเดลซ้อน" },
        { code: String.raw`try:
    SpaceMission(
        mission_id="X_BAD",                       # ผิดกฎของภารกิจ
        crew=[{"member_id": "CM1", "name": "A", "rank": "cadet",
               "age": 9,                          # ผิดกฎของลูกเรือ
               "specialization": "None", "years_experience": 0}],
        ...
    )
except ValidationError as error:
    for detail in error.errors():
        print(detail["loc"], detail["msg"])`,
          cap: "ผิดสองที่ แต่ได้รายงานที่เดียว — ทำไม", lang: "python" },
        { code: String.raw`('crew', 0, 'age') Input should be greater than or equal to 18`,
          cap: "ผลลัพธ์ — ไม่มีบรรทัดของ mission_id เลย", lang: "text" },
        { p: "เพราะ **โมเดลชั้นในถูกตรวจก่อน** เมื่อลูกเรือคนหนึ่งไม่ผ่าน จะไม่มีภารกิจที่ถูกต้องให้ `@model_validator` ของภารกิจตรวจ มันจึงไม่เคยทำงาน ลำดับนี้มีประโยชน์: error ที่ได้ชี้ไปที่ต้นเหตุจริง ไม่ใช่ผลกระทบ" },
        { code: String.raw`# ในทางกลับกัน ถ้าผิดหลายฟิลด์ในโมเดลเดียวกัน จะได้ครบในรอบเดียว
try:
    CrewMember(member_id="X", name="Y", rank="cadet",
               age=9, specialization="Z", years_experience=99)
except ValidationError as error:
    print(len(error.errors()))     # 3 ขึ้นไป — id สั้นไป, ชื่อสั้นไป, อายุน้อยไป`,
          cap: "Pydantic ไม่หยุดที่ error แรกภายในชั้นเดียวกัน", lang: "python" },
        { code: String.raw`payload = mission.model_dump_json()
restored = SpaceMission.model_validate_json(payload)
assert restored == mission          # ไปกลับแล้วเท่าเดิม

import json
decoded = json.loads(payload)
print(decoded["crew"][0]["rank"])   # 'commander' — enum เป็นข้อความของตัวเอง
print(type(decoded["launch_date"])) # <class 'str'> — datetime เป็นสตริง`,
          cap: "str-Enum ทำให้ข้อมูลไปกลับได้โดยไม่ต้องแปลงมือ", lang: "python" },
        { note: "`class ContactType(str, Enum)` — การสืบทอด `str` ด้วยคือสิ่งที่ทำให้สมาชิกเทียบเท่ากับข้อความของตัวเอง และ serialise เป็นข้อความนั้น ถ้าสืบทอดแค่ `Enum` จะต้องแปลงเองทุกจุดที่เขียนออกเป็น JSON" },

        { h: "Module 10 — lambda ใช้เมื่อไหร่ และเลิกใช้เมื่อไหร่" },
        { code: String.raw`# ใช้ — expression ที่ส่งเข้าฟังก์ชันอันดับสูงตรง ๆ
ordered = sorted(artifacts, key=lambda a: a["power"], reverse=True)
strong = list(filter(lambda m: m["power"] >= 70, mages))
marked = list(map(lambda s: f"* {s} *", spells))

# เลิกใช้ — พอมีเงื่อนไข มีชื่อที่ควรอธิบาย หรือถูกใช้ซ้ำ
is_veteran = lambda m: m["power"] >= 70 and m["years"] > 5   # อ่านยาก

def is_veteran(mage: Mage) -> bool:      # อ่านง่ายกว่า และมี docstring ได้
    """นักเวทที่ทั้งแรงและเก๋า"""
    return mage["power"] >= 70 and mage["years"] > 5`,
          cap: "flake8 ก็ฟ้องการตั้งชื่อให้ lambda ด้วย (E731)", lang: "python" },
        { p: "`sorted` เป็น stable — สองตัวที่ค่าเท่ากันจะคงลำดับเดิมไว้ ดังนั้น `reverse=True` ต่างจากการใส่เครื่องหมายลบที่ key: การใส่ลบจะกลับลำดับของตัวที่เท่ากันด้วย" },
        { code: String.raw`def power_amplifier(base_spell: Spell, multiplier: int) -> Spell:
    """คืนคาถาที่มีลายเซ็นเดิม แต่แรงขึ้น"""
    def amplified(target: str, power: int) -> str:
        return base_spell(target, power * multiplier)
    return amplified


def conditional_caster(condition: Condition, spell: Spell) -> Spell:
    """คืนคาถาที่ร่ายเมื่อเงื่อนไขผ่านเท่านั้น"""
    def guarded(target: str, power: int) -> str:
        if condition(target, power):
            return spell(target, power)
        return "Spell fizzled"
    return guarded


# ตัวปรับแต่งคืนของชนิดเดิมที่มันรับเข้ามา จึงประกอบกันได้
guarded_mega = conditional_caster(lambda t, p: t != "Ally",
                                  power_amplifier(fireball, 3))`,
          cap: "นี่คือเหตุผลที่ลายเซ็นต้องเหมือนเดิม — เพื่อให้ซ้อนกันได้", lang: "python" },
        { code: String.raw`import functools
import operator

OPERATIONS = {"add": operator.add, "multiply": operator.mul,
              "max": max, "min": min}


def spell_reducer(spells: list[int], operation: str) -> int:
    """พับลำดับให้เหลือค่าเดียว"""
    if operation not in OPERATIONS:
        raise ValueError(f"Unknown operation '{operation}'")
    if not spells:
        return 0
    return functools.reduce(OPERATIONS[operation], spells)`,
          cap: "operator มีไว้เพราะเครื่องหมาย + ส่งเป็นอาร์กิวเมนต์ไม่ได้", lang: "python" },
        { code: String.raw`@functools.singledispatch
def cast(spell: Any) -> str:
    """ชนิดที่ไม่มีใครลงทะเบียนไว้"""
    return "Unknown spell type"


@cast.register
def cast_damage(spell: int) -> str:
    return f"{spell} damage"


@cast.register
def cast_multi(spell: list) -> str:
    return f"{len(spell)} spells"`,
          cap: "โซ่ isinstance ที่กลายเป็นทะเบียน — ชนิดใหม่คือการ register หนึ่งครั้ง", lang: "python" },
        { note: "ตั้งชื่อ implementation ให้ต่างกัน อย่าใช้ `_` ทั้งสามตัว เพราะ flake8 ฟ้อง F811 ว่านิยามทับกัน — และ `bool` จะวิ่งเข้า implementation ของ `int` เพราะมันเป็นซับคลาส" },
        { h: "decorator คือฟังก์ชันที่คืนฟังก์ชัน" },
        { code: String.raw`# @spell_timer เหนือ def หมายถึงบรรทัดนี้เป๊ะ ๆ
fireball = spell_timer(fireball)

# ส่วน decorator ที่มีอาร์กิวเมนต์ ต้องมีอีกชั้นหนึ่ง
# @power_validator(10) หมายถึง
cast_spell = power_validator(10)(cast_spell)`,
          cap: "ทุกอย่างที่เหลือตามมาจากสองบรรทัดนี้", lang: "python" },
        { code: String.raw`def spell_timer(func: Callable[..., Any]) -> Callable[..., Any]:
    @functools.wraps(func)          # ไม่มีบรรทัดนี้ = ชื่อกลายเป็น wrapper
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        print(f"Casting {func.__name__}...")
        started = time.perf_counter()
        try:
            return func(*args, **kwargs)
        finally:
            elapsed = time.perf_counter() - started
            print(f"Spell completed in {elapsed:.3f} seconds")
    return wrapper`,
          cap: "จับเวลาใน finally เพื่อให้คาถาที่ระเบิดก็ยังรายงานเวลา", lang: "python" },
        { p: "ใช้ `perf_counter` ไม่ใช่ `time.time` เพราะตัวแรกเดินหน้าเสมอและละเอียดพอ ส่วนนาฬิกาผนังกระโดดถอยหลังได้เมื่อเครื่องปรับเวลา" }
      ],

      dataflow: [
        { h: "ไล่ข้อมูลของ oracle.py ตั้งแต่ต้นจนจบ" },
        { table: { head: ["ขั้น", "รับอะไร", "ส่งอะไรต่อ"], rows: [
          ["บันทึกว่ามีอะไรอยู่ก่อน", "`os.environ`", "เซตของคีย์ที่มาจาก shell"],
          ["โหลดไฟล์", "`.env` ถ้ามี", "เติมเฉพาะคีย์ที่ยังขาด"],
          ["แยกที่มา", "`os.environ` หลังโหลด", "เซตของคีย์ที่มาจากไฟล์"],
          ["ตัดสินโหมด", "`MATRIX_MODE`", "development หรือ production หรือ error"],
          ["เติมหรือปฏิเสธ", "โหมด + คีย์ที่ขาด", "ค่าครบชุด หรือหยุดพร้อมบอกว่าขาดอะไร"],
          ["รายงาน", "ค่าครบชุด", "ข้อความที่ปิดบังความลับ"],
          ["ตรวจความปลอดภัย", "ซอร์สของตัวเอง + `.gitignore`", "รายการผ่าน/ไม่ผ่าน"]
        ]}},
        { code: String.raw`def load_configuration(from_shell: set[str]) -> dict[str, str]:
    """ประกอบการตั้งค่า และปฏิเสธ production ที่ไม่ครบ"""
    mode = os.environ.get("MATRIX_MODE", DEVELOPMENT).strip().lower()
    if mode not in (DEVELOPMENT, PRODUCTION):
        raise ConfigurationError(
            f"MATRIX_MODE must be '{DEVELOPMENT}' or '{PRODUCTION}', "
            f"not '{mode}'",
            "Set MATRIX_MODE to one of the two known modes.")

    resolved: dict[str, str] = {"MATRIX_MODE": mode}
    missing: list[str] = []
    for key in KEYS[1:]:
        value = os.environ.get(key, "").strip()
        if value:
            resolved[key] = value
        elif mode == DEVELOPMENT:
            resolved[key] = DEV_DEFAULTS[key]      # เติมให้ พร้อมบอก
        else:
            missing.append(key)                    # production ไม่เติมให้
    if missing:
        raise ConfigurationError(
            "production mode has no defaults; missing: " + ", ".join(missing),
            "In production every value must be supplied explicitly.")
    return resolved`,
          cap: "โหมดเดียวที่เติมค่าให้คือ development และมันบอกเสมอว่าเติมอะไร", lang: "python" },
        { note: "**สตริงว่างกับช่องว่างไม่ใช่ค่า** — `.strip()` แล้วเช็กว่าว่างไหม เป็นเหตุผลที่ `API_KEY=` ใน production ต้องถูกปฏิเสธ ไม่ใช่ผ่านไปเป็นกุญแจว่าง" },
        { code: String.raw`def describe_secret(value: str) -> str:
    """บอกเท่าที่จำเป็นต่อการ debug และไร้ประโยชน์ต่อคนอ่าน log"""
    return f"set ({len(value)} characters)"`,
          cap: "ความยาวพอให้จับ typo ได้ แต่ไม่พอให้ใช้กุญแจ", lang: "python" }
      ]
    },

    amaze: {
      theory: [
        { h: "ขุดทางด้วย DFS ที่มีช่องต้องห้าม" },
        { p: "อัลกอริทึมทั้งหมดคือลูปเดียว สิ่งที่ทำให้มันตอบโจทย์ข้ออื่นไปด้วยคือ **เซตของช่องที่จองไว้** ซึ่งถูกส่งเข้าไปตั้งแต่ต้น ไม่ได้ไปตัดทีหลัง" },
        { code: String.raw`def _carve_spanning_tree(self) -> None:
    """ขุดทางเดินให้เป็นต้นไม้ทอดข้าม โดยไม่แตะช่องที่จองไว้"""
    start = self._first_open_cell()
    stack: list[Cell] = [start]
    visited: set[Cell] = {start}
    while stack:
        x, y = stack[-1]
        options = [(d, n) for d, n in self._neighbours((x, y))
                   if n not in visited and n not in self._reserved]
        if not options:
            stack.pop()                     # ทางตัน ถอยหนึ่งช่อง
            continue
        direction, neighbour = self._rng.choice(options)
        self._knock_down((x, y), direction)
        visited.add(neighbour)
        stack.append(neighbour)
    self._rescue_unreachable(visited)`,
          cap: "stack ที่จับต้องได้ ทำให้ 400x300 ไม่ชน recursion limit", lang: "python" },
        { p: "บรรทัดสุดท้ายคือประกันของกฎ 'ห้ามมีช่องโดดเดี่ยว' — หลังขุดเสร็จให้ไล่ช่องที่ไม่ได้จอง ถ้าเจอช่องที่การค้นหาไปไม่ถึง ให้เปิดผนังหนึ่งด้านเข้าหาเขาวงกต กรณีนี้เกิดได้เมื่อลาย 42 บังทางเข้าถึงพื้นที่เล็ก ๆ" },
        { h: "เปิดผนังเพิ่มเมื่อ PERFECT=False" },
        { p: "เขาวงกตที่ไม่สมบูรณ์แบบคือเขาวงกตสมบูรณ์แบบที่ถูกเจาะเพิ่ม และนี่คือ **ที่เดียว** ที่กฎห้ามโล่ง 3x3 ถูกละเมิดได้" },
        { code: String.raw`def _open_extra_walls(self) -> None:
    """เจาะผนังเพิ่มเพื่อสร้างวงรอบ โดยไม่ทำให้เกิดพื้นที่โล่ง 3x3"""
    candidates = [(cell, d) for cell in self._open_cells()
                  for d, n in self._neighbours(cell)
                  if self._grid[cell[1]][cell[0]] & d and n not in
                  self._reserved]
    self._rng.shuffle(candidates)
    quota = len(candidates) // 10          # เจาะประมาณหนึ่งในสิบ
    for cell, direction in candidates[:quota]:
        if self._would_open_3x3(cell, direction):
            continue                        # ลองแล้วไม่ดี ข้ามไป
        self._knock_down(cell, direction)`,
          cap: "ตรวจก่อนเจาะจริง ไม่ใช่เจาะแล้วไปตามซ่อม", lang: "python" },
        { code: String.raw`def _would_open_3x3(self, cell: Cell, direction: int) -> bool:
    """ลองเจาะ ดูผล แล้วปิดคืนไม่ว่าผลจะเป็นอย่างไร"""
    self._knock_down(cell, direction)
    bad = self._has_open_block(3)
    self._put_back(cell, direction)
    return bad`,
          cap: "ลองแล้วถอย — เขียนสั้นและพิสูจน์ถูกง่าย", lang: "python" },
        { note: "**บล็อกโล่ง 2x2 คือวงรอบ** ดังนั้นตอน `PERFECT=True` กฎ 3x3 เป็นจริงโดยอัตโนมัติอยู่แล้ว การตรวจจึงจำเป็นเฉพาะในโหมดนี้เท่านั้น — เอาการตรวจไปวางในลูปเจาะ ไม่ต้องมี pass ตอนท้าย" },
        { h: "หาเส้นทางที่สั้นที่สุดด้วย BFS" },
        { code: String.raw`from collections import deque


def solve_cells(self) -> list[Cell]:
    """คืนเส้นทางสั้นที่สุดจากทางเข้าถึงทางออก เป็นลำดับของช่อง"""
    start, goal = self._entry, self._exit
    queue: deque[Cell] = deque([start])
    came_from: dict[Cell, Cell] = {start: start}
    while queue:
        cell = queue.popleft()              # popleft คือหัวใจของ BFS
        if cell == goal:
            break
        x, y = cell
        for direction, neighbour in self._neighbours(cell):
            if self._grid[y][x] & direction:
                continue                     # ยังมีผนังกั้น เดินไม่ได้
            if neighbour in came_from:
                continue                     # เคยไปถึงด้วยเส้นที่สั้นกว่าแล้ว
            came_from[neighbour] = cell
            queue.append(neighbour)
    ...`,
          cap: "popleft ทำให้ขยายทีละชั้นความลึก ครั้งแรกที่ถึงคือสั้นที่สุด", lang: "python" },
        { p: "ถ้าเปลี่ยน `popleft()` เป็น `pop()` มันจะกลายเป็น DFS ทันที — ยังหาเส้นทางเจอ แต่ไม่รับประกันว่าสั้นที่สุด นี่คือความต่างทั้งหมดระหว่างสองอัลกอริทึม" },
        { code: String.raw`def solve(self) -> list[str]:
    """แปลงลำดับช่องเป็นตัวอักษร N/E/S/W"""
    cells = self.solve_cells()
    letters: list[str] = []
    for before, after in zip(cells, cells[1:]):
        dx, dy = after[0] - before[0], after[1] - before[1]
        for direction, step in STEP.items():
            if step == (dx, dy):
                letters.append(LETTER[direction])
                break
    return letters`,
          cap: "zip กับตัวเองที่เลื่อนไปหนึ่ง = เดินทีละคู่ที่ติดกัน", lang: "python" },
        { h: "ลาย 42 วางอย่างไร" },
        { code: String.raw`GLYPHS = {
    "4": ["#.#", "#.#", "###", "..#", "..#"],
    "2": ["###", "..#", "###", "#..", "###"],
}`,
          cap: "ตัวอักษร 5 แถว 3 คอลัมน์ — # คือช่องที่ปิดสนิท", lang: "python" },
        { table: { head: ["สิ่งที่ต้องคิด", "ตัวเลข"], rows: [
          ["ตัวอักษรหนึ่งตัว", "3 คอลัมน์ 5 แถว"],
          ["สองตัวกับคอลัมน์คั่นหนึ่ง", "7 คอลัมน์"],
          ["ขอบรอบลายอย่างน้อยด้านละหนึ่ง", "+2 ทั้งกว้างและสูง"],
          ["**ตารางเล็กที่สุดที่ใส่ได้**", "**11 x 9**"]
        ]}},
        { p: "เล็กกว่านั้นโจทย์บอกให้พิมพ์ข้อความแจ้งแล้วสร้างต่อ ไม่ใช่ล้มเลิก — และข้อความนั้นควรออกทาง stderr เพราะมันคือคำเตือน ไม่ใช่ผลลัพธ์" },
        { code: String.raw`def _pattern_cells(self) -> set[Cell]:
    """คำนวณช่องของลาย แล้วเอาทางเข้าออกออกจากเซต"""
    if self._width < 11 or self._height < 9:
        print("Maze too small for the 42 pattern", file=sys.stderr)
        return set()
    cells = self._glyph_cells()
    cells.discard(self._entry)     # จุดเข้าออกสำคัญกว่าลวดลาย
    cells.discard(self._exit)
    return cells`,
          cap: "สองบรรทัด discard คือสิ่งที่กันไม่ให้ผู้ใช้ถูกขังตั้งแต่เกิด", lang: "python" }
      ],

      architecture: [
        { h: "อ่านไฟล์ตั้งค่าให้ error มีประโยชน์" },
        { code: String.raw`REQUIRED = ("WIDTH", "HEIGHT", "ENTRY", "EXIT", "OUTPUT_FILE",
            "PERFECT")


def read_config(path: str) -> dict[str, str]:
    """อ่านคู่ KEY=VALUE พร้อมบอกเลขบรรทัดเมื่อผิด"""
    values: dict[str, str] = {}
    with open(path, "r", encoding="utf-8") as handle:
        for number, line in enumerate(handle, start=1):
            text = line.strip()
            if not text or text.startswith("#"):
                continue
            if "=" not in text:
                raise MazeError(f"{path}:{number}: expected KEY=VALUE")
            key, _, value = text.partition("=")
            values[key.strip().upper()] = value.strip()
    missing = [key for key in REQUIRED if key not in values]
    if missing:
        raise MazeError(f"{path}: missing key(s): " + ", ".join(missing))
    return values`,
          cap: "บอกไฟล์ บรรทัด และคีย์ที่ขาด — คนแก้ไม่ต้องเดา", lang: "python" },
        { code: String.raw`def parse_cell(text: str, label: str, width: int,
               height: int) -> Cell:
    """แปลง 'x,y' เป็นพิกัด พร้อมตรวจขอบเขต"""
    parts = text.split(",")
    if len(parts) != 2:
        raise MazeError(f"{label} must look like x,y, got '{text}'")
    try:
        x, y = int(parts[0]), int(parts[1])
    except ValueError:
        raise MazeError(f"{label} must be two integers, got '{text}'")
    if not (0 <= x < width and 0 <= y < height):
        raise MazeError(f"{label} ({x},{y}) is outside "
                        f"0..{width - 1},0..{height - 1}")
    return (x, y)`,
          cap: "ตรวจครั้งเดียวที่ขอบ แล้วส่วนที่เหลือของโปรแกรมไม่ต้องเช็กอีก", lang: "python" },
        { table: { head: ["อินพุต", "ข้อความที่ควรได้"], rows: [
          ["ไม่ส่งไฟล์มา", "`usage: python3 a_maze_ing.py config.txt`"],
          ["ไฟล์ไม่มี", "`config.txt: No such file or directory`"],
          ["ขาด `EXIT`", "`config.txt: missing key(s): EXIT`"],
          ["`WIDTH=abc`", "`WIDTH must be an integer, got 'abc'`"],
          ["`ENTRY=0,0` และ `EXIT=0,0`", "`ENTRY and EXIT must differ`"],
          ["`EXIT=99,99` บนตาราง 20x15", "`EXIT (99,99) is outside 0..19,0..14`"]
        ]}},
        { note: "ทุกข้อความจบด้วยการออกด้วยรหัสไม่เท่าศูนย์ และ **ห้ามมี traceback** — ผู้ตรวจจะลองใส่ของพังทุกแบบ และนี่คือส่วนที่ทำคะแนนได้ง่ายที่สุดของโปรเจกต์" },
        { h: "เขียนไฟล์ผลลัพธ์" },
        { code: String.raw`def to_hex_rows(self) -> list[str]:
    """หนึ่งหลักฐานสิบหกต่อหนึ่งช่อง"""
    return ["".join(f"{cell:x}" for cell in row) for row in self._grid]


def to_output(self) -> str:
    """ประกอบไฟล์ทั้งก้อนเป็นสตริงเดียว"""
    entry_x, entry_y = self._entry
    exit_x, exit_y = self._exit
    return "\n".join(self.to_hex_rows() + [
        "",
        f"{entry_x},{entry_y}",
        f"{exit_x},{exit_y}",
        "".join(self.solve()),
    ]) + "\n"`,
          cap: "แยกการประกอบออกจากการเขียนไฟล์ — เทสต์ตรวจสตริงได้เลย", lang: "python" },
        { code: String.raw`9c5c5c5c6
3a3a3a38a
9c5c5c5c6

0,0
8,2
EESSEE`,
          cap: "ตัวอย่างจริงของตาราง 9x3 — บรรทัดว่างคือเส้นแบ่ง", lang: "text" }
      ],

      implementation: [
        { h: "วาดเขาวงกตออกจอ" },
        { code: String.raw`def render(grid: list[list[int]], entry: Cell, exit_cell: Cell,
           path: set[Cell]) -> str:
    """หนึ่งช่องวาดขอบบนกับซ้ายของตัวเอง แล้วปิดท้ายทั้งแถวและตาราง"""
    lines: list[str] = []
    for y, row in enumerate(grid):
        top, middle = [], []
        for x, cell in enumerate(row):
            top.append("+" + ("---" if cell & NORTH else "   "))
            middle.append("|" if cell & WEST else " ")
            middle.append(cell_glyph((x, y), entry, exit_cell, path))
        lines.append("".join(top) + "+")
        lines.append("".join(middle) + "|")
    lines.append("+" + "---+" * len(grid[0]))
    return "\n".join(lines)


def cell_glyph(cell: Cell, entry: Cell, exit_cell: Cell,
               path: set[Cell]) -> str:
    """ตัวอักษรกลางช่อง — ลำดับความสำคัญคือ เข้า ออก เส้นทาง ว่าง"""
    if cell == entry:
        return " E "
    if cell == exit_cell:
        return " X "
    if cell in path:
        return " . "
    return "   "`,
          cap: "ไม่มีเส้นไหนถูกวาดซ้ำ เพราะแต่ละช่องรับผิดชอบสองด้านของตัวเอง", lang: "python" },
        { code: String.raw`+---+---+---+---+
| E     |       |
+   +   +   +---+
|   |   | . . X |
+---+---+---+---+`,
          cap: "E ทางเข้า X ทางออก จุดคือเส้นทางสั้นที่สุด", lang: "text" },
        { h: "ปุ่มโต้ตอบขั้นต่ำที่โจทย์ขอ" },
        { code: String.raw`def interactive(gen: MazeGenerator) -> None:
    """วนรับคำสั่งจนกว่าจะออก — เทอร์มินัลก็นับว่าโต้ตอบได้"""
    show_path = False
    colour = "\033[37m"
    while True:
        print(colour + render(gen.grid, gen.entry, gen.exit,
                              set(gen.solve_cells()) if show_path
                              else set()) + "\033[0m")
        command = input("[r]egenerate [p]ath [c]olour [q]uit: ").strip()
        if command == "q":
            return
        if command == "r":
            gen.reseed(None)          # seed ใหม่ = เขาวงกตใหม่
            gen.generate()
        elif command == "p":
            show_path = not show_path # เก็บเส้นทางไว้ ไม่คำนวณใหม่
        elif command == "c":
            colour = next_colour(colour)`,
          cap: "สามปุ่มนี้คือข้อกำหนดขั้นต่ำ: สร้างใหม่ ซ่อนแสดงเส้นทาง เปลี่ยนสี", lang: "python" },
        { h: "เทสต์ที่ตรงกับสิ่งที่ผู้ตรวจจะลอง" },
        { code: String.raw`# 1) สิ่งเดียวที่สคริปต์ตรวจของโจทย์ดู
for y in range(height):
    for x in range(width - 1):
        assert bool(grid[y][x] & EAST) == bool(grid[y][x + 1] & WEST)
for y in range(height - 1):
    for x in range(width):
        assert bool(grid[y][x] & SOUTH) == bool(grid[y + 1][x] & NORTH)

# 2) เดินตามเส้นทางจริง แทนที่จะเชื่อตัวแก้
x, y = entry
for step in solution:
    direction = {"N": NORTH, "E": EAST, "S": SOUTH, "W": WEST}[step]
    assert not grid[y][x] & direction
    dx, dy = STEP[direction]
    x, y = x + dx, y + dy
assert (x, y) == exit_cell

# 3) ขอบนอกต้องปิด ยกเว้นทางเข้าออก
for x in range(width):
    assert grid[0][x] & NORTH or (x, 0) in (entry, exit_cell)
    assert grid[height - 1][x] & SOUTH or (x, height - 1) in (entry,
                                                              exit_cell)

# 4) ไม่มีบล็อกโล่ง 3x3 ทั้งสองโหมด
for perfect in (True, False):
    gen = MazeGenerator(30, 20, seed=3, perfect=perfect)
    gen.generate()
    assert not has_open_block(gen.grid, 3)`,
          cap: "สี่ข้อนี้ครอบคลุมข้อกำหนดที่ตรวจได้ด้วยเครื่อง", lang: "python" },
        { note: "**รันสคริปต์ตรวจที่โจทย์แถมมาด้วยทุกครั้งก่อนส่ง** มันคือตัวเดียวกับที่ Moulinette อาจใช้ และมันตรวจเรื่องเดียวคือความสอดคล้องของผนัง ซึ่งเป็นเรื่องที่โครงสร้างโค้ดควรทำให้เป็นไปไม่ได้ตั้งแต่แรก" }
      ]
    }
  };

  window.TEACHING_DATA = window.TEACHING_DATA || [];
  window.TEACHING_DATA.forEach(function (page) {
    var extra = TH[page.id];
    if (!extra) return;
    Object.keys(extra).forEach(function (key) {
      page.sections[key] = (page.sections[key] || []).concat(extra[key]);
    });
  });
})();
