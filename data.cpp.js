/* ============================================================
   data.cpp.js — CPP Module 01–09 (สาย C++ ต่อจาก Module 00)
   ต่อท้าย window.TEACHING_DATA (id ขึ้นต้นด้วย cpp_module_)
   อิงจากโค้ดจริงของ wiaon-in ในโฟลเดอร์ "CPP Module NN/"
   โครง block เหมือน data.js ทุกอย่าง
   ============================================================ */
window.TEACHING_DATA = window.TEACHING_DATA || [];

/* ===================== CPP MODULE 01 ===================== */
window.TEACHING_DATA.push({
  id: "cpp_module_01",
  name: "CPP Module 01",
  tag: { th: "หน่วยความจำ · reference · pointer-to-member — ex00 stack vs heap, ex01 delete[], ex02 reference คืออะไร, ex03 HumanA/HumanB, ex04 replace ไฟล์, ex05-06 Harl",
         en: "Memory · references · pointers-to-member — ex00 stack vs heap, ex01 delete[], ex02 what a reference is, ex03 HumanA/HumanB, ex04 file replace, ex05-06 Harl" },
  accent: "#f0932b",
  sections: {
    principle: [
      { h: "Module 01 สอนอะไร" },
      { p: "Module 00 สอนว่า class คืออะไร. Module 01 ถามคำถามถัดไป: **object ตัวนี้ควรอยู่ตรงไหนในหน่วยความจำ และใครเป็นคนเก็บกวาด**. 7 ข้อของโมดูลนี้เวียนอยู่รอบคำถามเดียวคือ 'ของชิ้นนี้ต้องอยู่นานแค่ไหน' — ตอบได้แล้วจะรู้เองว่าเลือก stack หรือ heap, เลือก reference หรือ pointer" },
      { h: "7 ข้อ กับประเด็นเดียวของแต่ละข้อ" },
      { table: { head: ["ข้อ", "ชื่อ", "ประเด็นที่สอน", "กับดัก"], rows: [
        ["ex00", "BraiiiiiiinnnzzzZ", "อายุของ object บน stack vs heap", "heap zombie ต้องให้คนเรียก `delete` เอง"],
        ["ex01", "Moar brainz!", "จองครั้งเดียวได้ N ตัว", "`new[]` ต้องคู่กับ `delete[]` — ใช้ `delete` เฉย ๆ = UB"],
        ["ex02", "HI THIS IS BRAIN", "reference คือชื่อเรียกอีกชื่อของตัวเดิม", "`&ref` ได้ address เดียวกับตัวแปรเป๊ะ"],
        ["ex03", "Unnecessary violence", "เมื่อไหร่ใช้ reference เมื่อไหร่ใช้ pointer", "reference member ต้อง bind ใน initialiser list"],
        ["ex04", "Sed is for losers", "อ่าน/เขียนไฟล์ด้วย C++ stream", "ห้าม `std::string::replace`; `s1` ว่าง = วนไม่จบ"],
        ["ex05", "Harl 2.0", "pointer to **member** function", "`&Harl::debug` และ `(this->*f)()` — ไวยากรณ์บังคับ"],
        ["ex06", "Harl filter", "`switch` แบบตั้งใจไม่ `break`", "fall-through คือกลไก ไม่ใช่บั๊ก"],
      ]}},
      { h: "กฎเหล็กของทั้งโมดูล (ผิดข้อเดียว = 0 หรือ -42)" },
      { ul: [
        "**ห้าม `printf` / `malloc` / `free`** — ใช้ `new` / `delete` และ `std::cout` แทน",
        "**ห้าม `using namespace`** และ **ห้าม `friend`** (โทษ -42 ทั้งคู่)",
        "**ห้าม STL container/algorithm** (`<vector>`, `<map>`, `<algorithm>`) — โมดูลนี้ไม่ต้องใช้อยู่แล้ว. `std::string`, `<iostream>`, `<fstream>`, `<sstream>` ใช้ได้",
        "**ห้ามเขียนตัวฟังก์ชันใน header** (ยกเว้น template ซึ่งยังไม่ถึง) — ประกาศใน `.hpp` เขียนจริงใน `.cpp` + include guard ทุกไฟล์",
        "คอมไพล์ด้วย `c++ -Wall -Wextra -Werror -std=c++98` เท่านั้น",
      ]},
      { note: "ยังไม่ต้องทำ **Orthodox Canonical Form** (เริ่มบังคับตอน Module 02) — โมดูลนี้มี constructor ที่รับชื่อ + destructor ก็พอ" },
      { note: "**norminette ไม่ใช้กับ C++** — กฎ 25 บรรทัด / ห้าม `for` / ห้าม `?:` ของฝั่ง C ไม่มีผลที่นี่ เขียนให้อ่านง่ายด้วยสไตล์ไหนก็ได้" },
    ],

    theory: [
      { p: "หมวดนี้รวมแนวคิดที่ต้องเข้าใจก่อน ไม่งั้นจะเขียนถูกโดยไม่รู้ว่าทำไม" },

      { h: "1) Stack vs Heap — ใครเก็บกวาด" },
      { table: { head: ["", "Stack", "Heap"], rows: [
        ["สร้างยังไง", "`Zombie z(\"foo\");`", "`new Zombie(\"foo\")`"],
        ["ตายเมื่อไหร่", "จบ scope (`}`) อัตโนมัติ", "ตอนเราสั่ง `delete` เท่านั้น"],
        ["ลืมคืน = ?", "เป็นไปไม่ได้", "**memory leak**"],
        ["ใช้เมื่อ", "ของชั่วคราวในฟังก์ชันนี้", "ของที่ต้องอยู่ต่อหลังฟังก์ชัน return"],
      ]}},
      { p: "คำถามเดียวที่ต้องถามคือ **'ของชิ้นนี้ต้องอยู่นานกว่า scope นี้ไหม'** ถ้าไม่ ใช้ stack เสมอ (ง่ายกว่า ไม่มีทาง leak). ถ้าใช่ ค่อยใช้ heap แล้วต้องตอบให้ได้ด้วยว่า **ใครคือคนที่จะ delete**" },

      { h: "2) `new` กับ `new[]` เป็นคนละคู่กัน" },
      { code: String.raw`Zombie *one  = new Zombie("a");   →  delete one;
Zombie *many = new Zombie[5];     →  delete[] many;

จับคู่ผิด = undefined behavior:
  delete many;     ← เรียก destructor แค่ตัวแรก + คืน memory ผิดขนาด
  delete[] one;    ← พังเช่นกัน

new Zombie[5] เรียก **default constructor** 5 ครั้ง
  → ต้องมี Zombie() ที่ไม่รับ argument
  → ส่งชื่อผ่าน new[] ไม่ได้ ต้องมี setName() ตั้งทีหลัง`, cap: "นี่คือบั๊กอันดับ 1 ที่โดนจับใน ex01 — valgrind ฟ้องทันที", lang: "cpp" },

      { h: "3) Reference vs Pointer — ต่างกันตรงไหนจริง ๆ" },
      { table: { head: ["", "Pointer `T *p`", "Reference `T &r`"], rows: [
        ["เป็น NULL ได้ไหม", "ได้", "ไม่ได้"],
        ["ชี้ที่อื่นทีหลังได้ไหม", "ได้ (`p = &other`)", "ไม่ได้ ผูกครั้งเดียวตลอดชีพ"],
        ["ต้องผูกตอนสร้างไหม", "ไม่ต้อง", "**ต้อง** (ใน initialiser list)"],
        ["เขียนตอนใช้", "`p->getType()`", "`r.getType()`"],
        ["สื่อความหมายว่า", "'มีก็ได้ ไม่มีก็ได้ เปลี่ยนได้'", "'ต้องมี และไม่เปลี่ยน'"],
      ]}},
      { note: "คำตอบสั้น ๆ ตอน eval: **เลือก pointer เมื่อของชิ้นนั้นอาจไม่มี หรือเปลี่ยนได้; เลือก reference เมื่อมันต้องมีเสมอและผูกตายตัวตลอดอายุ object**" },

      { h: "4) Initialiser list — ไม่ใช่แค่สไตล์" },
      { code: String.raw`HumanA::HumanA(std::string name, Weapon &weapon)
    : _name(name), _weapon(weapon)     // ← ตรงนี้คือ "สร้าง" member
{
    // ตรงนี้คือ "assign" ทับของที่สร้างไปแล้ว
}`, cap: "member ถูกสร้างก่อนเข้า { } เสมอ — ในวงเล็บปีกกาจึงเป็นการ 'แก้ค่า' ไม่ใช่ 'ตั้งค่าแรก'", lang: "cpp" },
      { p: "reference ไม่มีสถานะ 'ยังไม่ผูก' → ถ้าไม่ผูกใน list ก็ไม่มีอะไรให้ assign ในบอดี้ **คอมไพล์ไม่ผ่าน**. เหตุผลเดียวกับที่ member ที่เป็น `const` ก็ต้องอยู่ใน list" },

      { h: "5) Pointer to member function" },
      { p: "pointer ไปฟังก์ชันธรรมดาเก็บแค่ 'ที่อยู่ของโค้ด' แต่ member function ต้องรู้ด้วยว่า **ทำงานกับ object ตัวไหน** — ไวยากรณ์จึงต่างออกไปทั้งตอนประกาศ ตอนเอา address และตอนเรียก" },
      { code: String.raw`ประกาศ:   void (Harl::*p)(void);       // ต้องมี Harl:: คั่น
เอา address: p = &Harl::debug;           // ต้องมี & และ Harl:: (เขียน &debug ไม่ผ่าน)
เรียก:      (this->*p)();                // ต้องมีวงเล็บครอบ (this->p() ไม่ผ่าน)

เก็บเป็น array ได้:
void (Harl::*funcs[4])(void) = {&Harl::debug, &Harl::info,
                                &Harl::warning, &Harl::error};`, cap: "3 จุดที่คอมไพเลอร์บ่นบ่อยสุด: ลืม `Harl::` ตอนประกาศ, ลืม `&`, ลืมวงเล็บตอนเรียก", lang: "cpp" },

      { h: "6) `switch` fall-through" },
      { p: "ปกติเราใส่ `break` ทุก case เพราะไม่อยากให้ไหลลงไปอันถัดไป. ex06 ใช้พฤติกรรม 'ไหลลง' นั้นเป็น **กลไกหลัก**: เข้า switch ที่ระดับไหน ก็พิมพ์ระดับนั้นและทุกระดับที่สูงกว่าโดยอัตโนมัติ" },

      { h: "7) C++ file stream" },
      { code: String.raw`std::ifstream in(name.c_str());   // C++98 รับ const char* → ต้อง .c_str()
if (!in.is_open()) { ... }        // เช็คทุกครั้ง

std::stringstream buf;
buf << in.rdbuf();                // ดูดทั้งไฟล์เข้า buffer ทีเดียว
std::string content = buf.str();

std::ofstream out((name + ".replace").c_str());
out << result;                    // ปิดเองตอนหมด scope (RAII)`, cap: "rdbuf() = ทางลัดอ่านทั้งไฟล์; ตัว stream ปิดตัวเองตอนหมด scope ไม่ต้อง fclose", lang: "cpp" },

      { h: "🔬 เจาะลึก A: อายุของ object — ทำไม ex00 ถึงมี 2 ฟังก์ชัน" },
      { p: "ex00 ให้เขียน 2 ฟังก์ชันที่ทำเหมือนกันเกือบเป๊ะ ต่างกันแค่ที่เก็บ object — นั่นแหละคือข้อสอบ" },
      { code: String.raw`Zombie *newZombie(std::string name)     // heap
{
    return (new Zombie(name));           // อยู่รอดหลัง return
}                                        // ← ใครเรียกต้อง delete เอง

void randomChump(std::string name)      // stack
{
    Zombie z(name);
    z.announce();
}                                        // ← z ถูกทำลายตรงนี้อัตโนมัติ`, cap: "ต่างกันบรรทัดเดียว แต่คนละความรับผิดชอบ", lang: "cpp" },
      { code: String.raw`ทำไม stack ทำแบบ newZombie ไม่ได้:

Zombie *bad(std::string name)
{
    Zombie z(name);
    return (&z);      // ✗ คืน address ของของที่กำลังจะตาย
}                     //   pointer ที่ได้ชี้ไปที่ว่าง = dangling pointer

  → อ่านต่อได้บ้างไม่ได้บ้าง (เป็น UB) เป็นบั๊กที่หายากที่สุดชนิดหนึ่ง
  → นี่คือเหตุผลเดียวที่ heap มีอยู่: ของที่ต้องอยู่นานกว่า scope`, cap: "heap ไม่ได้ 'ดีกว่า' stack — มันแค่แก้ปัญหาที่ stack แก้ไม่ได้ แลกกับความรับผิดชอบเรื่อง delete", lang: "cpp" },
      { note: "ใส่ `std::cout` ใน destructor ของ Zombie ไว้ตั้งแต่แรก แล้วรัน — จะเห็นด้วยตาว่าตัวไหนตายตอนไหน เป็นวิธีเรียนเรื่องอายุ object ที่เร็วที่สุด" },
      { qa: [
        { q: "เมื่อไหร่ควรใช้ heap?", a: "เมื่อ object ต้องอยู่ต่อหลังฟังก์ชันปัจจุบัน return หรือขนาดไม่รู้ตอนคอมไพล์. นอกนั้นใช้ stack เพราะไม่มีทาง leak และไม่ต้องมีใครรับผิดชอบ delete" },
        { q: "คืน pointer ของตัวแปร local ได้ไหม?", a: "ไม่ได้ — ตัวแปรตายตอนจบฟังก์ชัน pointer ที่คืนไปจะชี้ไปที่ว่าง (dangling) การอ่านต่อคือ undefined behavior" },
        { q: "ใครควรเป็นคน delete?", a: "คนที่ 'เป็นเจ้าของ' ของชิ้นนั้น — ใน ex00 คือ main ที่เรียก newZombie. กฎคือทุก new ต้องตอบได้ว่าใคร delete ตั้งแต่ตอนเขียน" },
      ]},

      { h: "🔬 เจาะลึก B: reference คืออะไรกันแน่ — ex02 พิสูจน์ให้ดู" },
      { p: "ex02 ไม่มี class ไม่มีอะไรเลย มีแค่ให้พิมพ์ address 3 ตัวกับค่า 3 ตัว. จุดประสงค์คือทำลายความเข้าใจผิดว่า 'reference เป็นของชนิดใหม่'" },
      { code: String.raw`std::string  str = "HI THIS IS BRAIN";
std::string *stringPTR = &str;
std::string &stringREF = str;

พิมพ์ address:  &str  ·  stringPTR  ·  &stringREF
  → 0x7ffd...  ·  0x7ffd...  ·  0x7ffd...     ← เลขเดียวกันทั้ง 3

พิมพ์ค่า:      str  ·  *stringPTR  ·  stringREF
  → HI THIS IS BRAIN ทั้ง 3`, cap: "reference ไม่ใช่สำเนา ไม่ใช่ของใหม่ — มันคือ 'ชื่อที่สอง' ของตัวแปรเดิม", lang: "cpp" },
      { p: "ภายในคอมไพเลอร์ reference ก็คือ address เหมือน pointer นั่นแหละ ต่างกันแค่ **ไวยากรณ์และสัญญา**: เขียนเหมือนตัวแปรธรรมดา (ไม่ต้อง `*`), เป็น NULL ไม่ได้, และย้ายไปผูกตัวอื่นไม่ได้" },
      { note: "ที่ ex03 จะเห็นผลของเรื่องนี้ทันที: `HumanA` เก็บ reference ไปยัง `Weapon` ตัวเดียวกับที่ `main` ถืออยู่ พอ `main` เรียก `club.setType(...)` การโจมตีครั้งถัดไปจึงเปลี่ยนตาม — เพราะมันคือ Weapon ตัวเดียวกัน ไม่ใช่สำเนา" },
      { qa: [
        { q: "reference ต่างจาก pointer ยังไงในระดับเครื่อง?", a: "แทบไม่ต่าง — คอมไพเลอร์ก็เก็บเป็น address เหมือนกัน. ความต่างอยู่ที่กฎของภาษา: reference เป็น NULL ไม่ได้, reseat ไม่ได้, และต้องผูกตอนสร้าง" },
        { q: "ทำไม `&stringREF` ถึงได้ address ของ str ไม่ใช่ของ reference เอง?", a: "เพราะ reference ไม่ใช่ object แยกต่างหากที่จะมี address ของตัวเอง — มันคือชื่ออีกชื่อของ str ทุก operation จึงวิ่งไปที่ str" },
      ]},

      { h: "🔬 เจาะลึก C: pointer-to-member — ทำไมต้องเขียนแปลก ๆ แบบนั้น" },
      { p: "`&Harl::debug` ไม่ใช่ address ปกติ. member function ต้องการ `this` ตอนเรียก แต่ `&Harl::debug` ยังไม่รู้ว่าจะทำงานกับ object ตัวไหน — มันคือ **'ตำแหน่งของเมธอดในคลาส'** ไม่ใช่ 'ที่อยู่ของโค้ดที่รันได้'. ตัว object ถูกจับคู่ตอนเรียกด้วย `this->*`" },
      { code: String.raw`ฟังก์ชันธรรมดา                    member function
--------------------------------  --------------------------------
void f(void);                     void Harl::debug(void);
void (*p)(void) = f;              void (Harl::*p)(void) = &Harl::debug;
       ^ ไม่ต้องมี &                     ^^^^^^^ ต้องมีทั้ง Harl:: และ &
p();                              (obj.*p)();      // ผ่าน object
                                  (this->*p)();    // ผ่าน pointer`, cap: "ต่างกันเพราะ member function ต้องรู้ว่า 'ของใคร' — ข้อมูลนั้นมาตอนเรียก ไม่ใช่ตอนเก็บ address", lang: "cpp" },
      { p: "**ทำไมต้องมีวงเล็บครอบตอนเรียก:** operator `()` มีลำดับความสำคัญสูงกว่า `->*` ถ้าเขียน `this->*p()` คอมไพเลอร์จะพยายามเรียก `p()` ก่อนแล้วค่อยเอาผลมาทำ `->*` ซึ่งไม่มีความหมาย จึงต้องบังคับลำดับด้วยวงเล็บ `(this->*p)()`" },
      { code: String.raw`โค้ดจริงของเรา (ex05/Harl.cpp) — dispatch ด้วย array:

void Harl::complain(std::string level)
{
    std::string levels[4] = {"DEBUG", "INFO", "WARNING", "ERROR"};
    void (Harl::*funcs[4])(void) = {&Harl::debug, &Harl::info,
                                    &Harl::warning, &Harl::error};
    int i = 0;
    while (i < 4)
    {
        if (levels[i] == level)
        {
            (this->*funcs[i])();
            return ;
        }
        i++;
    }
    std::cout << "[ Probably complaining about insignificant problems ]"
              << std::endl;
}`, cap: "แทน if/else 4 ชั้น ด้วยตาราง 2 แถวที่ index ตรงกัน — เพิ่มระดับใหม่แก้ที่เดียว 2 บรรทัด", lang: "cpp" },
      { note: "ข้อสอบข้อนี้ห้ามใช้ if/else if ต่อกันยาว ๆ โดยเจตนา — เพราะจุดประสงค์คือให้เจอไวยากรณ์ pointer-to-member ไม่ใช่ให้ได้ output ถูก" },
      { qa: [
        { q: "ทำไมเขียน `&debug` เฉย ๆ ไม่ได้?", a: "เพราะ `debug` ไม่ใช่ชื่อที่ลอยอยู่เดี่ยว ๆ ในโปรแกรม — มันอยู่ในขอบเขตของคลาส ต้องระบุว่าเป็นของคลาสไหนด้วย `&Harl::debug` และ `&` เป็นข้อบังคับของภาษาสำหรับ member function (ต่างจากฟังก์ชันธรรมดาที่ละได้)" },
        { q: "ทำไม `this->p()` ไม่ผ่าน?", a: "`this->p` แปลว่า 'หา member ชื่อ p ในคลาส' ซึ่งไม่มี. ที่เราต้องการคือ 'เรียกฟังก์ชันที่ p ชี้อยู่ กับ object นี้' ต้องเขียน `(this->*p)()`" },
        { q: "ได้อะไรจากการใช้ array แทน if/else?", a: "เพิ่มระดับใหม่แก้แค่ 2 array ที่ index ตรงกัน ไม่ต้องแตะ logic; และเป็นการฝึกไวยากรณ์ pointer-to-member ซึ่งคือจุดประสงค์ของข้อ" },
      ]},

      { h: "🔬 เจาะลึก D: switch fall-through — เมื่อ 'ลืม break' คือคำตอบ" },
      { p: "ex06 ต้องพิมพ์ระดับที่ขอ **และทุกระดับที่สูงกว่า**. วิธีตรงไปตรงมาคือ if 4 ชั้น หรือ loop ตั้งแต่ index ที่ได้ไปจนจบ. แต่โจทย์อยากให้เห็นว่า `switch` ทำได้ในตัวเองถ้าไม่ใส่ `break`" },
      { code: String.raw`switch (this->levelToIndex(level))   // -1 ถ้าไม่รู้จัก
{
    case 0:
        this->debug();
        // fall through   ← จงใจไม่ break
    case 1:
        this->info();
        // fall through
    case 2:
        this->warning();
        // fall through
    case 3:
        this->error();
        break ;                      // มี break แค่ตัวสุดท้าย
    default:
        std::cout << "[ Probably complaining about insignificant problems ]"
                  << std::endl;
        break ;
}`, cap: "โค้ดจริงของเรา (ex06/Harl.cpp) — เข้าที่ case ไหน ก็ไหลลงยาวจนจบ", lang: "cpp" },
      { code: String.raw`ไล่ผลลัพธ์:

  ./harlFilter DEBUG    → เข้า case 0 → DEBUG INFO WARNING ERROR  (4 บรรทัดชุด)
  ./harlFilter WARNING  → เข้า case 2 → WARNING ERROR
  ./harlFilter ERROR    → เข้า case 3 → ERROR
  ./harlFilter ขยะ      → levelToIndex คืน -1 → default`, cap: "ไม่มี logic 'พิมพ์ระดับที่สูงกว่า' อยู่ในโค้ดเลย — มันเกิดจากลำดับของ case ล้วน ๆ", lang: "txt" },
      { note: "เขียนคอมเมนต์ `// fall through` ทุกจุดที่จงใจไม่ break — ทั้งเพื่อคนอ่านและเพื่อกัน compiler warning ในโปรเจกต์ที่เปิด `-Wimplicit-fallthrough`" },
      { qa: [
        { q: "fall-through คืออะไร?", a: "พฤติกรรมปกติของ switch ที่ถ้าไม่ใส่ break มันจะไหลลงไปทำ case ถัดไปต่อ. ปกติเราไม่อยากได้จึงใส่ break ทุกอัน แต่ ex06 ใช้มันเป็นกลไกหลัก" },
        { q: "ทำไมไม่เขียน if 4 ชั้นแทน?", a: "ได้ผลเหมือนกัน แต่โจทย์ต้องการให้เจอ switch fall-through. และเวอร์ชัน switch สั้นกว่า อ่านลำดับความรุนแรงได้จากลำดับ case ตรง ๆ" },
        { q: "ระดับที่ไม่รู้จักจัดการยังไง?", a: "`levelToIndex` คืน -1 ซึ่งไม่ตรง case ไหน → ตกไป `default` แล้วพิมพ์ข้อความสำรอง" },
      ]},

      { h: "📖 อ่านเพิ่มเติม" },
      { links: [
        { label: "cppreference — new expression", url: "https://en.cppreference.com/w/cpp/language/new", note: "new / new[] และการจับคู่กับ delete" },
        { label: "cppreference — References", url: "https://en.cppreference.com/w/cpp/language/reference", note: "กฎของ reference แบบทางการ" },
        { label: "cppreference — Pointer to member", url: "https://en.cppreference.com/w/cpp/language/pointer#Pointers_to_members", note: "ไวยากรณ์ ->* และ .*" },
        { label: "cppreference — switch", url: "https://en.cppreference.com/w/cpp/language/switch", note: "fall-through อย่างเป็นทางการ" },
        { label: "learncpp — Stack and heap", url: "https://www.learncpp.com/cpp-tutorial/the-stack-and-the-heap/", note: "อธิบาย stack vs heap แบบจับมือทำ" },
      ]},
    ],

    foundations: [
      { p: "หมวดนี้ไล่ 'ของที่แต่ละข้อต้องมี' — class อะไร member แบบไหน และทำไมต้องเป็นแบบนั้น" },

      { h: "ex00-01 — Zombie" },
      { code: String.raw`class Zombie
{
    private:
        std::string _name;

    public:
        Zombie(void);                    // ★ ต้องมี! new Zombie[N] เรียกตัวนี้
        Zombie(std::string name);
        ~Zombie(void);                   // พิมพ์ชื่อตอนตาย → เห็นอายุ object

        void setName(std::string name);  // ★ ต้องมี! new[] ส่งชื่อเข้าไปไม่ได้
        void announce(void) const;
};`, cap: "2 ตัวที่ติดดาวมีอยู่เพราะ ex01 โดยเฉพาะ — ex00 ตัวเดียวไม่ต้องใช้", lang: "cpp" },
      { p: "นี่คือตัวอย่างที่ดีของ 'ข้อจำกัดของเครื่องมือกำหนดรูปร่างของ class': `new Zombie[N]` **ส่ง argument ให้ constructor ไม่ได้** จึงบังคับให้ต้องมี default constructor และวิธีตั้งชื่อทีหลัง" },

      { h: "ex03 — Weapon / HumanA / HumanB" },
      { code: String.raw`class Weapon
{
    private:
        std::string _type;
    public:
        const std::string &getType(void) const;   // คืน reference ไม่ก๊อป
        void setType(std::string type);
};`, cap: "คืน `const std::string&` = ให้อ่านได้ ไม่ให้แก้ และไม่เสียเวลาสำเนา string", lang: "cpp" },
      { code: String.raw`class HumanA                      class HumanB
{                                 {
  private:                          private:
    std::string _name;                std::string _name;
    Weapon      &_weapon;  ← ref      Weapon      *_weapon;  ← ptr
  public:                           public:
    HumanA(std::string, Weapon &);    HumanB(std::string);
    void attack(void) const;          void setWeapon(Weapon &);
};                                    void attack(void) const;
                                    };

HumanA: มีอาวุธเสมอ    → รับตอนสร้าง → reference
HumanB: อาจยังไม่มี    → set ทีหลัง  → pointer (เริ่มที่ NULL)`, cap: "ตัวโจทย์ออกแบบมาให้เห็นว่า 'ความต้องการ' เป็นตัวเลือกชนิด ไม่ใช่ความชอบส่วนตัว", lang: "cpp" },
      { code: String.raw`// โค้ดจริงของเรา — HumanA ผูก reference ใน initialiser list
HumanA::HumanA(std::string name, Weapon &weapon)
    : _name(name), _weapon(weapon)
{
}

// HumanB เริ่มที่ NULL แล้ว attack ต้องกันเคสไม่มีอาวุธ
HumanB::HumanB(std::string name) : _name(name), _weapon(NULL)
{
}

void HumanB::attack(void) const
{
    if (this->_weapon == NULL)
    {
        std::cout << this->_name << " has no weapon to attack with"
                  << std::endl;
        return ;
    }
    std::cout << this->_name << " attacks with their "
              << this->_weapon->getType() << std::endl;
}`, cap: "ความต่างที่จับต้องได้: HumanB ต้องมี if กัน NULL — HumanA ไม่มีทางเจอเคสนั้นเลย", lang: "cpp" },
      { note: "ผลข้างเคียงที่ต้องอธิบายให้ได้: ทั้งคู่เก็บ **Weapon ตัวเดียวกับที่ main ถือ** ไม่ใช่สำเนา. `main` เรียก `club.setType(\"some other type of club\")` แล้ว `attack()` ครั้งถัดไปเปลี่ยนตามทันที" },

      { h: "ex05-06 — Harl" },
      { code: String.raw`class Harl                       // ex05
{
    private:
        void debug(void);            // 4 ตัวนี้ private
        void info(void);             // โลกภายนอกเรียกได้แค่ complain()
        void warning(void);
        void error(void);
    public:
        void complain(std::string level);
};

// ex06 เพิ่ม helper แปลงชื่อระดับเป็น index
int levelToIndex(std::string level) const;   // -1 = ไม่รู้จัก`, cap: "encapsulation: ผู้ใช้ไม่ควรเรียก debug() ตรง ๆ ได้ — ต้องผ่านประตูเดียวคือ complain()", lang: "cpp" },
    ],

    architecture: [
      { h: "ไฟล์ในแต่ละข้อ" },
      { table: { head: ["ข้อ", "ไฟล์", "หมายเหตุ"], rows: [
        ["ex00", "`Zombie.hpp/.cpp`, `newZombie.cpp`, `randomChump.cpp`, `main.cpp`", "แยก 2 ฟังก์ชันคนละไฟล์ตามโจทย์"],
        ["ex01", "`Zombie.hpp/.cpp`, `zombieHorde.cpp`, `main.cpp`", "Zombie เพิ่ม default ctor + setName"],
        ["ex02", "`main.cpp`", "ไฟล์เดียวจบ ไม่มี class"],
        ["ex03", "`Weapon.hpp/.cpp`, `HumanA.hpp/.cpp`, `HumanB.hpp/.cpp`, `main.cpp`", "3 class 3 คู่ไฟล์"],
        ["ex04", "`main.cpp`", "ไฟล์เดียว แต่มี helper `replaceAll` เป็น static"],
        ["ex05", "`Harl.hpp/.cpp`, `main.cpp`", "binary ชื่ออะไรก็ได้"],
        ["ex06", "`Harl.hpp/.cpp`, `main.cpp`", "**binary ต้องชื่อ `harlFilter`**"],
      ]}},
      { note: "ทุกข้อมี Makefile ของตัวเอง ไม่รวมกัน — แต่ละโฟลเดอร์คอมไพล์แยกอิสระ" },
      { h: "โครง Makefile ที่ใช้ซ้ำได้ทุกข้อ" },
      { code: String.raw`NAME     = zombie
CXX      = c++
CXXFLAGS = -Wall -Wextra -Werror -std=c++98
SRCS     = main.cpp Zombie.cpp newZombie.cpp randomChump.cpp
OBJS     = $(SRCS:.cpp=.o)

all: $(NAME)

$(NAME): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $(NAME) $(OBJS)

%.o: %.cpp Zombie.hpp          # ← ผูก header ด้วย แก้ .hpp แล้วต้อง rebuild
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS)

fclean: clean
	rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re`, cap: "จุดที่กรรมการเช็ค: รัน make 2 ครั้งต้องขึ้น 'Nothing to be done' (ไม่ relink)", lang: "makefile" },
    ],

    dataflow: [
      { p: "ไล่ทีละข้อ ว่าอะไรเกิดขึ้นตามลำดับ" },

      { h: "ex00 — ไล่อายุ object" },
      { code: String.raw`main()
 ├─ randomChump("Foo")
 │    └─ Zombie z("Foo") บน stack → z.announce()
 │       "Foo: BraiiiiiiinnnzzzZ..."
 │    ← จบฟังก์ชัน → ~Zombie() ทำงานเอง  "Foo destroyed"
 │
 ├─ Zombie *heap = newZombie("Bar")
 │    └─ new Zombie("Bar")  → คืน pointer ออกมา (ยังไม่ตาย)
 ├─ heap->announce()          "Bar: BraiiiiiiinnnzzzZ..."
 └─ delete heap;            → ~Zombie() ทำงาน  "Bar destroyed"
                              ★ ถ้าลืมบรรทัดนี้ = leak`, cap: "สังเกตว่า Foo destroyed มาก่อน Bar เกิดด้วยซ้ำ — เพราะอายุคนละแบบ", lang: "txt" },

      { h: "ex01 — horde: 1 allocation, 1 delete[]" },
      { code: String.raw`Zombie *zombieHorde(int N, std::string name)
{
    Zombie *horde;
    int     i;

    if (N <= 0)
        return (NULL);          // กัน new Zombie[0] และ N ติดลบ (UB)
    horde = new Zombie[N];      // ★ จองครั้งเดียว เรียก default ctor N ครั้ง
    i = 0;
    while (i < N)
    {
        horde[i].setName(name); // ตั้งชื่อทีหลัง เพราะ new[] ส่ง arg ไม่ได้
        i++;
    }
    return (horde);
}

// ฝั่ง main:
Zombie *h = zombieHorde(5, "grunt");
for (...) h[i].announce();
delete[] h;                     // ★ delete[] ไม่ใช่ delete`, cap: "โค้ดจริงของเรา — 3 จุดที่โดนจับ: guard N<=0, จองครั้งเดียว, delete[]", lang: "cpp" },

      { h: "ex03 — Weapon ตัวเดียว 2 คนถือ" },
      { code: String.raw`main:
  Weapon club("crude spiked club");

  HumanA bob("Bob", club);        → _weapon ผูกกับ club (reference)
  bob.attack();                   → "Bob attacks with their crude spiked club"
  club.setType("some other type of club");
  bob.attack();                   → "...some other type of club"  ← เปลี่ยนตาม!

  HumanB jim("Jim");              → _weapon = NULL
  jim.attack();                   → "Jim has no weapon to attack with"
  jim.setWeapon(club);            → _weapon = &club
  jim.attack();                   → "...some other type of club"`, cap: "ที่มันเปลี่ยนตามเพราะทั้งคู่ชี้ไป club ตัวเดิม — ไม่ได้ก๊อปตอนส่งเข้าไป", lang: "txt" },

      { h: "ex04 — replaceAll ทำงานยังไง" },
      { code: String.raw`// ห้ามใช้ std::string::replace → สร้าง string ใหม่ด้วย find + substr
static std::string replaceAll(const std::string &src,
        const std::string &s1, const std::string &s2)
{
    std::string result;
    size_t      pos;
    size_t      start;

    start = 0;
    pos = src.find(s1, start);
    while (pos != std::string::npos)
    {
        result += src.substr(start, pos - start);  // ส่วนก่อนเจอ
        result += s2;                              // ตัวแทน
        start = pos + s1.length();                 // ข้ามคำเดิมไป
        pos = src.find(s1, start);
    }
    result += src.substr(start);                   // หางที่เหลือ
    return (result);
}`, cap: "แนวคิด: ไม่แก้ของเดิม แต่ 'ประกอบใหม่' ทีละท่อน — ปลอดภัยกว่าและไม่ต้องใช้ replace()", lang: "cpp" },
      { code: String.raw`ไล่ทีละรอบ: src="aXbXc", s1="X", s2="--"

  start=0  pos=1  → result += "a"     + "--"   → "a--"      start=2
  start=2  pos=3  → result += "b"     + "--"   → "a--b--"   start=4
  start=4  pos=npos → ออกจาก loop
  result += "c"                                → "a--b--c"`, cap: "ตัวชี้ 2 ตัว: start = อ่านถึงไหนแล้ว, pos = เจอคำถัดไปที่ไหน", lang: "txt" },
      { note: "เหตุผลที่ต้องปฏิเสธ `s1` ว่าง: `find(\"\")` คืน `start` เสมอ ไม่เคยเป็น `npos` → loop ไม่มีวันจบ และ `start` ไม่ขยับ. เช็คตั้งแต่ต้นแล้ว exit 1" },

      { h: "ex04 — main: ลำดับการตรวจ error" },
      { code: String.raw`if (argc != 4)          → usage error, exit 1
if (s1.empty())         → "s1 must not be empty", exit 1   ★ กัน loop ไม่จบ
ifstream in(...)
if (!in.is_open())      → "cannot open input file", exit 1
buffer << in.rdbuf()    → ดูดทั้งไฟล์
ofstream out(name + ".replace")
if (!out.is_open())     → "cannot open output file", exit 1
out << replaceAll(...)  → เขียนผล`, cap: "ตรวจจากถูกที่สุดไปแพงที่สุด: argc → argument → เปิดไฟล์ → ค่อยทำงานจริง", lang: "txt" },
    ],

    implementation: [
      { h: "ลำดับการลงมือเขียน (แนะนำ)" },
      { ul: [
        "1. **ex02 ก่อน** — 15 บรรทัด ไม่มี class แต่ทำให้เข้าใจ reference ซึ่งใช้ต่อทั้งโมดูล",
        "2. **ex00** — Zombie + 2 ฟังก์ชัน; ใส่ `cout` ใน destructor แล้วดูลำดับตาย",
        "3. **ex01** — เพิ่ม default ctor + setName ลงใน Zombie เดิม แล้วเขียน zombieHorde",
        "4. **ex03** — Weapon ก่อน แล้ว HumanA (reference) แล้ว HumanB (pointer)",
        "5. **ex05** — Harl แบบ array ของ pointer-to-member",
        "6. **ex06** — ก๊อป Harl มาเปลี่ยน complain เป็น switch + เปลี่ยน NAME เป็น `harlFilter`",
        "7. **ex04 ท้ายสุด** — เป็นข้อที่ยาวที่สุดและไม่เกี่ยวกับข้ออื่น",
      ]},
      { h: "บั๊กยอดฮิตและวิธีกัน" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้"], rows: [
        ["valgrind ฟ้อง `mismatched free`", "`new[]` แต่ `delete` เฉย ๆ", "ใช้ `delete[]` กับทุกอย่างที่มาจาก `new[]`"],
        ["ex01 คอมไพล์ไม่ผ่าน", "`new Zombie[N]` แต่ไม่มี default ctor", "เพิ่ม `Zombie(void);`"],
        ["HumanA คอมไพล์ไม่ผ่าน", "assign reference ในบอดี้", "ย้ายไป initialiser list `: _weapon(w)`"],
        ["HumanB segfault", "`attack()` ตอน `_weapon` ยังเป็น NULL", "เช็ค NULL ก่อนใช้"],
        ["ex04 ค้างไม่จบ", "`s1` เป็น string ว่าง", "ปฏิเสธตั้งแต่ต้น exit 1"],
        ["ex05 `&debug` ไม่ผ่าน", "ลืม `Harl::`", "`&Harl::debug`"],
        ["ex05 `this->p()` ไม่ผ่าน", "ลืมวงเล็บ", "`(this->*p)()`"],
        ["ex06 กรรมการหาไฟล์ไม่เจอ", "binary ไม่ได้ชื่อ `harlFilter`", "`NAME = harlFilter`"],
      ]}},
      { h: "การ build / รัน" },
      { code: String.raw`# ทีละข้อ (แต่ละโฟลเดอร์มี Makefile ของตัวเอง)
cd ex01 && make re && ./zombie

# บน Windows: ไม่มี c++ ใน Git Bash ต้องผ่าน WSL
wsl --exec bash -lc 'cd "/mnt/d/Projects/42/CPP Module 01/ex01" && make re && ./zombie'

# เช็ค leak (ข้อที่มี new)
valgrind --leak-check=full --error-exitcode=42 -q ./zombie

# เช็คว่าไม่มีของต้องห้าม — ต้องไม่มี output
grep -rnE 'printf|[mc]alloc|free\(|using namespace|friend' ex0*/*.cpp ex0*/*.hpp`, cap: "3 ด่าน: คอมไพล์ไม่มี warning · valgrind สะอาด · ไม่มีฟังก์ชันต้องห้าม", lang: "bash" },
      { note: "path ของ WSL ต้องอยู่ **ข้างใน** เครื่องหมายคำพูดของ `-lc '...'` — ถ้าส่ง `/mnt/d/...` เป็น argument ตรง ๆ Git Bash จะแปลงเป็น `C:/Program Files/Git/mnt/...` แล้วหาไม่เจอ" },
    ],

    tricks: [
      { h: "ทริค 1: ใส่ cout ใน destructor ตั้งแต่แรก" },
      { p: "โมดูลนี้ทั้งโมดูลว่าด้วยอายุ object — การพิมพ์ตอนเกิดและตอนตายทำให้ 'เห็น' สิ่งที่กำลังเรียนแทนที่จะจินตนาการเอา. ex00 โจทย์ขอไว้ด้วยซ้ำ" },
      { h: "ทริค 2: ทุก `new` ตอบให้ได้ทันทีว่าใคร `delete`" },
      { p: "เขียน `new` เมื่อไหร่ ให้ตอบในหัวทันทีว่าบรรทัดไหนจะ delete. ถ้าตอบไม่ได้แปลว่าออกแบบความเป็นเจ้าของยังไม่ชัด — leak เกือบทั้งหมดมาจากตรงนี้" },
      { h: "ทริค 3: ให้ 'ความต้องการ' เลือกชนิดให้" },
      { p: "อย่าเลือก reference/pointer ตามความเคยชิน. ถามว่า 'มันเป็นไม่มีได้ไหม' และ 'มันเปลี่ยนได้ไหม' — ตอบว่าไม่ทั้งคู่ = reference; ตอบว่าใช่สักข้อ = pointer. ex03 คือแบบฝึกหัดของคำถามนี้ตรง ๆ" },
      { h: "ทริค 4: array 2 ตัวที่ index ตรงกัน = dispatch table" },
      { p: "`levels[]` กับ `funcs[]` เรียงตรงกัน ทำให้หาชื่อแล้วได้ฟังก์ชันทันที. แพตเทิร์นนี้ใช้ได้ทั่วไป ไม่ใช่แค่ Harl — เพิ่มรายการใหม่แก้ 2 บรรทัดที่อยู่ติดกัน" },
      { h: "ทริค 5: คอมเมนต์ `// fall through` เสมอ" },
      { p: "case ที่จงใจไม่ break ต้องมีคอมเมนต์กำกับ ไม่งั้นคนอ่าน (และ compiler บางตัว) จะคิดว่าลืม" },
      { h: "ทริค 6: ประกอบ string ใหม่ ดีกว่าแก้ของเดิม" },
      { p: "ex04 ห้าม `replace()` ซึ่งบังคับให้เขียนแบบ 'อ่านทีละท่อนแล้วต่อใหม่' — วิธีนี้ปลอดภัยกว่าจริง เพราะไม่ต้องคิดเรื่อง index ขยับหลังแก้กลางสตริง" },
      { h: "ทริค 7: ex06 คือ ex05 ที่เปลี่ยนแค่ complain" },
      { p: "ก๊อปทั้งโฟลเดอร์มา แล้วแก้ `complain` เป็น switch + เพิ่ม `levelToIndex` + เปลี่ยน `NAME` — ไม่ต้องเขียน 4 ระดับใหม่" },
    ],

    eval: [
      { qa: [
        { q: "stack กับ heap ต่างกันยังไง ใช้อันไหนเมื่อไหร่?", a: "stack ตายเองตอนจบ scope ใช้กับของชั่วคราว; heap อยู่จนกว่าจะ delete ใช้เมื่อ object ต้องอยู่ต่อหลังฟังก์ชัน return. เลือก stack ก่อนเสมอเพราะไม่มีทาง leak" },
        { q: "ทำไม ex01 ต้องมี default constructor?", a: "เพราะ `new Zombie[N]` เรียก default constructor N ครั้ง และส่ง argument เข้าไปไม่ได้ — จึงต้องมี ctor ที่ไม่รับ argument แล้วตั้งชื่อทีหลังด้วย setName" },
        { q: "`delete` กับ `delete[]` ต่างกันยังไง ใช้ผิดจะเป็นอะไร?", a: "`delete[]` เรียก destructor ครบทุกตัวและคืน memory ตามขนาด array; ใช้ `delete` กับ array คือ undefined behavior — destructor ไม่ครบและคืน memory ผิดขนาด valgrind ฟ้องทันที" },
        { q: "reference ต่างจาก pointer ยังไง?", a: "reference เป็น NULL ไม่ได้ ย้ายไปผูกตัวอื่นไม่ได้ และต้องผูกตอนสร้าง (ใน initialiser list); pointer เป็น NULL ได้ เปลี่ยนได้ และ set ทีหลังได้" },
        { q: "ทำไม HumanA ใช้ reference แต่ HumanB ใช้ pointer?", a: "HumanA มีอาวุธเสมอและไม่เปลี่ยนตัวถือ → reference สื่อความหมายนี้และคอมไพเลอร์บังคับให้ผูกตอนสร้าง; HumanB อาจยังไม่มีอาวุธแล้ว set ทีหลัง → ต้องเป็น pointer ที่เริ่มจาก NULL ได้" },
        { q: "ทำไม reference member ต้องอยู่ใน initialiser list?", a: "reference ไม่มีสถานะ 'ยังไม่ผูก' — ต้องผูกตอนถูกสร้างซึ่งเกิดก่อนเข้าบอดี้ ในบอดี้จึงไม่มีอะไรให้ assign คอมไพล์ไม่ผ่าน" },
        { q: "ทำไม `getType` คืน `const std::string&`?", a: "คืน reference = ไม่ต้องสำเนา string; ใส่ const = ผู้เรียกอ่านได้แต่แก้ค่าใน Weapon ผ่านทางนี้ไม่ได้" },
        { q: "แก้ `club.setType()` แล้วทำไม Bob กับ Jim เปลี่ยนตาม?", a: "เพราะทั้งคู่เก็บ reference/pointer ไปยัง Weapon **ตัวเดียวกับที่ main ถือ** ไม่ใช่สำเนา — แก้ที่ต้นทางจึงเห็นผลทั้งหมด" },
        { q: "ex04 ทำไมห้าม `std::string::replace`?", a: "โจทย์บังคับ เพื่อให้ฝึกประกอบ string เองด้วย `find` + `substr` และฝึก C++ stream แทนการเรียกฟังก์ชันสำเร็จรูป" },
        { q: "ex04 ถ้า s1 เป็นสตริงว่างจะเกิดอะไร?", a: "`find(\"\")` คืนตำแหน่งปัจจุบันเสมอ ไม่เคยเป็น npos → วนไม่จบและ start ไม่ขยับ. ต้องเช็คแล้ว exit 1 ตั้งแต่ต้น" },
        { q: "pointer to member function ประกาศและเรียกยังไง?", a: "ประกาศ `void (Harl::*p)(void);` เอา address ด้วย `&Harl::debug` (ต้องมีทั้ง `&` และ `Harl::`) เรียกด้วย `(this->*p)()` — วงเล็บจำเป็นเพราะ `()` มี precedence สูงกว่า `->*`" },
        { q: "ทำไม ex05 ไม่ให้ใช้ if/else?", a: "จุดประสงค์ของข้อคือให้เจอไวยากรณ์ pointer-to-member ไม่ใช่ให้ได้ output ถูก; และ dispatch table ทำให้เพิ่มระดับใหม่แก้แค่ 2 บรรทัดที่ index ตรงกัน" },
        { q: "ex06 fall-through ทำงานยังไง?", a: "แปลงชื่อระดับเป็น index แล้วเข้า switch ที่ case นั้น จากนั้น **ไม่ใส่ break** จนถึงตัวสุดท้าย — จึงพิมพ์ระดับที่ขอและทุกระดับที่สูงกว่าโดยไม่ต้องมี logic เพิ่ม" },
        { q: "ระดับที่ไม่รู้จักใน ex06 ทำยังไง?", a: "`levelToIndex` คืน -1 ซึ่งไม่ตรง case ไหน ตกไป `default` แล้วพิมพ์ข้อความสำรอง" },
        { q: "ทำไมทั้งโมดูลห้าม `using namespace std`?", a: "เป็นกฎของ 42 (โทษ -42) เพื่อให้เห็นชัดว่าอะไรมาจาก standard library และกันชื่อชนกันเมื่อโปรเจกต์ใหญ่ขึ้น" },
      ]},
      { h: "ทดสอบก่อนส่ง" },
      { code: String.raw`# 1) ทุกข้อคอมไพล์ไม่มี warning
for d in ex0*; do (cd $d && make re) || echo "FAIL $d"; done

# 2) ex01 ขอบเขต
./zombie 0      # N=0 → NULL ไม่ crash
./zombie -3     # ติดลบ → NULL ไม่ crash

# 3) ex03 ต้องได้ 2 ชื่ออาวุธคนละแบบ ทั้ง Bob และ Jim
./violence

# 4) ex04 ทุกเคส error
./replace                       # argc ผิด
./replace nofile.txt a b        # เปิดไฟล์ไม่ได้
./replace f.txt "" b            # s1 ว่าง → error ไม่ค้าง
./replace f.txt a ""            # s2 ว่าง = ลบ (ถูกต้อง)

# 5) ex06 ทุกระดับ + ไม่รู้จัก
for l in DEBUG INFO WARNING ERROR NOPE; do ./harlFilter $l; done

# 6) leak
valgrind --leak-check=full --error-exitcode=42 -q ./zombie`, lang: "bash" },
    ],
  },
});

/* ===================== CPP MODULE 02 ===================== */
window.TEACHING_DATA.push({
  id: "cpp_module_02",
  name: "CPP Module 02",
  tag: { th: "Fixed-point + operator overloading + Orthodox Canonical Form — ex00-01 คลาส Fixed ที่เก็บทศนิยมด้วย int, ex02 โอเวอร์โหลด 14 operator, ex03 BSP หาจุดในสามเหลี่ยม",
         en: "Fixed-point + operator overloading + Orthodox Canonical Form — ex00-01 a Fixed class storing decimals in an int, ex02 fourteen overloaded operators, ex03 BSP point-in-triangle" },
  accent: "#eb4d4b",
  sections: {
    principle: [
      { h: "Module 02 สอนอะไร" },
      { p: "โมดูลนี้มี class เดียวคือ **`Fixed`** แต่เขียนซ้ำ 4 รอบ รอบละเพิ่มความสามารถ. เป้าหมายจริงคือ 2 อย่าง: (1) **Orthodox Canonical Form** ซึ่งจากนี้บังคับทุกคลาสไปตลอด และ (2) **operator overloading** — ทำให้ object ของเราใช้ `+`, `<`, `<<`, `++` ได้เหมือนชนิดข้อมูลในตัวภาษา" },
      { h: "4 ข้อ ไล่จากพื้นฐานไปใช้งานจริง" },
      { table: { head: ["ข้อ", "เพิ่มอะไร", "ประเด็นที่สอน"], rows: [
        ["ex00", "OCF + `getRawBits`/`setRawBits`", "รูปแบบ 4 เมธอดบังคับ + ไล่ดูลำดับ ctor/dtor"],
        ["ex01", "แปลง int/float + `operator<<`", "การแปลงเลขทศนิยมเป็น int ที่ scale ไว้"],
        ["ex02", "14 operator + `min`/`max` แบบ static", "เปรียบเทียบ/คำนวณ/เพิ่มลด และ overload ตาม const"],
        ["ex03", "`Point` + `bsp()`", "`const` member + ใช้ operator ที่เขียนเองแก้โจทย์เรขาคณิต"],
      ]}},
      { h: "แนวคิดแกนกลาง: fixed-point คือ int ที่คูณ 256 ไว้" },
      { code: String.raw`เก็บ 42.42 ยังไงในตัวแปร int?
  → คูณด้วย 256 แล้วปัดเป็นจำนวนเต็ม

  _value = roundf(42.42 * 256) = 10860
  อ่านกลับ = 10860 / 256.0     = 42.421875   → พิมพ์ออกมาเป็น 42.4219

  static const int _bits = 8;   →  256 = (1 << _bits)

4 สูตรที่ต้องจำ:
  int   → raw   : _value = i << _bits;                 (i * 256)
  float → raw   : _value = roundf(f * (1 << _bits));   ← ปัด ไม่ใช่ตัดทิ้ง
  raw   → float : (float)_value / (1 << _bits);
  raw   → int   : _value >> _bits;`, cap: "ทุกอย่างในโมดูลนี้คือ int ตัวเดียวที่ตีความว่าหารด้วย 256 แล้ว", lang: "cpp" },
      { note: "**ทำไมต้อง `roundf` ไม่ใช่ตัดทิ้ง:** 42.42×256 = 10859.52 — ตัดทิ้งได้ 10859 (อ่านกลับ 42.4180) แต่ปัดได้ 10860 (อ่านกลับ 42.4219) ซึ่งคือค่าที่ subject คาดหวัง. ผิดจุดนี้ diff ไม่ผ่าน" },
      { h: "กฎเหล็กของโมดูล" },
      { ul: [
        "**Orthodox Canonical Form บังคับแล้ว** ทุกคลาสต้องมีครบ 4: default ctor, copy ctor, copy assignment, destructor",
        "**ห้าม `friend`** (-42) — จุดที่คนพลาดคือ `operator<<` มักถูกสอนให้เป็น friend. ที่นี่ต้องเป็น **free function** ที่เรียก `toFloat()` ซึ่งเป็น public",
        "ห้าม `printf` / `malloc` / `free` / `using namespace`",
        "อนุญาต `roundf` จาก `<cmath>` ตั้งแต่ ex01 (เป็นข้อยกเว้นเดียว)",
        "ex03 เป็น optional ตาม subject — แต่ทำเถอะ มันสั้นและเป็นบทสรุปของทั้งโมดูล",
      ]},
    ],

    theory: [
      { h: "1) Orthodox Canonical Form (OCF) คืออะไร" },
      { table: { head: ["สมาชิก", "หน้าตา", "ถูกเรียกเมื่อ"], rows: [
        ["Default constructor", "`Fixed(void);`", "`Fixed a;`"],
        ["Copy constructor", "`Fixed(const Fixed &o);`", "`Fixed b(a);` หรือ `Fixed b = a;`"],
        ["Copy assignment", "`Fixed &operator=(const Fixed &o);`", "`b = a;` (b มีอยู่แล้ว)"],
        ["Destructor", "`~Fixed(void);`", "หมด scope / `delete`"],
      ]}},
      { p: "ถ้าเราไม่เขียน คอมไพเลอร์สร้างให้เองทั้ง 4 ตัว (ก๊อปทีละ member). 42 บังคับให้เขียนเองเพราะ (ก) พอ class มี pointer ตัวที่คอมไพเลอร์สร้างจะก๊อปแค่ address ทำให้ 2 object ชี้ที่เดียวกัน แล้ว double free และ (ข) เพื่อให้เห็นชัดว่าอะไรถูกเรียกตอนไหน" },
      { note: "**`Fixed b = a;` เรียก copy constructor ไม่ใช่ operator=** — แม้จะมีเครื่องหมาย `=`. กฎคือ ถ้าตัวซ้ายเพิ่งเกิด = copy ctor; ถ้ามีอยู่ก่อนแล้ว = assignment. เป็นคำถาม eval ประจำ" },

      { h: "2) ทำไม copy ctor ถึงเรียก operator= ต่อ" },
      { code: String.raw`Fixed::Fixed(const Fixed &other)
{
    std::cout << "Copy constructor called" << std::endl;
    *this = other;                    // ← ส่งต่อให้ operator=
}

Fixed &Fixed::operator=(const Fixed &other)
{
    std::cout << "Copy assignment operator called" << std::endl;
    if (this != &other)               // กัน a = a
        this->_value = other.getRawBits();
    return (*this);
}`, cap: "เขียนตรรกะการก๊อปที่เดียว — และได้ output 2 บรรทัดตามที่ subject แสดงพอดี", lang: "cpp" },
      { p: "**`if (this != &other)` มีไว้ทำไม:** กันเคส `a = a` (self-assignment). ใน `Fixed` ที่มีแค่ int จะไม่พังจริง แต่พอคลาสมี pointer การไม่เช็คแปลว่า 'ลบของเก่าทิ้งก่อน แล้วค่อยก๊อปจากของที่เพิ่งลบ' — เป็นบั๊กคลาสสิก จึงติดนิสัยเช็คไว้ตั้งแต่ต้น" },

      { h: "3) `operator<<` ต้องเป็น free function" },
      { code: String.raw`// ผิด: friend = -42
class Fixed { friend std::ostream &operator<<(...); };

// ถูก: ประกาศนอก class ท้ายไฟล์ header
std::ostream &operator<<(std::ostream &out, const Fixed &fixed);

// นิยามใน .cpp — ใช้ของ public ก็พอ ไม่ต้องเข้าถึง _value
std::ostream &operator<<(std::ostream &out, const Fixed &fixed)
{
    out << fixed.toFloat();
    return (out);
}`, cap: "คืน `std::ostream&` เพื่อให้ต่อกันได้: `cout << a << b << endl;`", lang: "cpp" },
      { p: "**ทำไมเป็น member ไม่ได้:** ตัวซ้ายของ `<<` คือ `std::cout` ไม่ใช่ `Fixed` — จะเป็น member ต้องไปเพิ่มเมธอดใน `std::ostream` ซึ่งทำไม่ได้. จึงต้องเป็นฟังก์ชันอิสระที่รับ 2 argument" },

      { h: "4) operator ที่ต้องเขียน 14 ตัว (ex02)" },
      { table: { head: ["กลุ่ม", "ตัว", "ทำงานบน"], rows: [
        ["เปรียบเทียบ", "`>` `<` `>=` `<=` `==` `!=`", "เทียบ `_value` ตรง ๆ (int เทียบแม่นเป๊ะ)"],
        ["คำนวณ", "`+` `-` `*` `/`", "แปลงเป็น float คำนวณ แล้วสร้าง Fixed ใหม่"],
        ["เพิ่ม/ลด", "`++a` `a++` `--a` `a--`", "ขยับ `_value` ทีละ 1 บิต = 1/256"],
      ]}},
      { note: "**ห้ามเทียบผ่าน `toFloat()`** — การเทียบ float ด้วย `==` ไม่แม่น. เทียบ `_value` ที่เป็น int ได้คำตอบเป๊ะเสมอ" },

      { h: "🔬 เจาะลึก A: ทำไม increment ถึงเพิ่มแค่ 1/256" },
      { p: "`++a` ของ `Fixed` **ไม่ได้เพิ่ม 1** แต่เพิ่ม 'ค่าที่เล็กที่สุดที่ชนิดนี้แทนได้' ซึ่งคือ 1 บิตดิบ = 1/256 = 0.00390625. subject เขียนไว้ตรง ๆ ว่าให้เพิ่มค่า ε ที่เล็กที่สุดที่ทำให้ 1 + ε มากกว่า 1" },
      { code: String.raw`Fixed &Fixed::operator++(void)      // pre-increment: ++a
{
    this->_value++;                 // ขยับ raw 1 หน่วย = 1/256
    return (*this);                 // คืน reference ของตัวเอง
}

Fixed Fixed::operator++(int)        // post-increment: a++
{
    Fixed tmp(*this);               // เก็บค่าเก่าไว้ก่อน

    this->_value++;
    return (tmp);                   // คืน 'ค่าก่อนเพิ่ม' เป็นสำเนา
}`, cap: "โค้ดจริงของเรา (ex02/Fixed.cpp) — `int` ตัวหลอกใน operator++(int) คือวิธีที่ภาษาใช้แยก pre กับ post", lang: "cpp" },
      { code: String.raw`ทำไม pre กับ post ต้องคืนคนละแบบ:

  ++a   ต้องได้ "a หลังเพิ่ม"    → คืน *this เป็น reference (ไม่ต้องก๊อป)
  a++   ต้องได้ "a ก่อนเพิ่ม"    → ต้องเก็บสำเนาไว้แล้วคืนสำเนานั้น (by value)

  → post จึงแพงกว่า pre เสมอ (มีการก๊อป 1 ครั้ง)
  → เวลาไม่ได้ใช้ค่าที่คืนมา ให้เขียน ++i แทน i++ ติดเป็นนิสัย

ทดสอบ epsilon:
  Fixed a;              // 0
  std::cout << a;       // 0
  std::cout << ++a;     // 0.00390625   ← 1/256 ยืนยันว่าขยับ 1 บิต`, cap: "ตัวเลข 0.00390625 คือหลักฐานว่าเราขยับบิตดิบ ไม่ใช่บวก 1.0", lang: "txt" },
      { qa: [
        { q: "ทำไม `++a` ไม่เพิ่ม 1?", a: "เพราะ subject นิยามว่าให้เพิ่ม 'ค่าที่เล็กที่สุดที่แทนได้' ของชนิดนี้ ซึ่งคือ 1 บิตดิบ = 1/256. ถ้าอยากเพิ่ม 1 ต้องเขียน `a = a + Fixed(1)`" },
        { q: "`int` ใน `operator++(int)` เอาไว้ทำอะไร?", a: "ไม่ได้ใช้ค่าเลย — เป็นแค่ตัวหลอกให้ภาษาแยกได้ว่านี่คือ post-increment ต่างจาก pre ที่ไม่มี parameter" },
        { q: "ทำไม pre คืน reference แต่ post คืน value?", a: "pre ต้องคืนตัวเดิมหลังเพิ่ม จึงคืน `*this` ได้เลยไม่ต้องก๊อป; post ต้องคืนค่าก่อนเพิ่ม ซึ่งตอนคืนมันถูกเปลี่ยนไปแล้ว จึงต้องเก็บสำเนาไว้ก่อนแล้วคืนสำเนา" },
      ]},

      { h: "🔬 เจาะลึก B: overload ตาม const — ทำไม min/max ต้องมี 4 ตัว" },
      { p: "subject ขอ `min` และ `max` อย่างละ 2 เวอร์ชัน: แบบ non-const และแบบ const. หลายคนงงว่าทำไมไม่เขียนตัวเดียว — คำตอบอยู่ที่ **สิ่งที่คืนกลับไป**" },
      { code: String.raw`static Fixed       &min(Fixed &a, Fixed &b);
static const Fixed &min(const Fixed &a, const Fixed &b);
static Fixed       &max(Fixed &a, Fixed &b);
static const Fixed &max(const Fixed &a, const Fixed &b);

ทั้งคู่คืน reference ของ argument ตัวที่ชนะ (ไม่ก๊อป)

เวอร์ชัน non-const:  Fixed::max(a, b) = Fixed(3);   ← แก้ตัวที่ชนะได้
เวอร์ชัน const:      แก้ไม่ได้ แต่รับ const object ได้

ถ้ามีแค่เวอร์ชัน non-const:
  const Fixed a(1), b(2);
  Fixed::max(a, b);        // ✗ ส่ง const เข้า parameter ที่ไม่ const ไม่ได้

ถ้ามีแค่เวอร์ชัน const:
  ใช้ได้ทุกกรณี แต่ผลที่คืนมาแก้ไม่ได้เลย แม้ argument จะไม่ใช่ const`, cap: "นี่คือ ad-hoc polymorphism: ชื่อเดียวกัน เลือกตัวที่ตรงชนิดที่สุดตอนคอมไพล์", lang: "cpp" },
      { p: "**คอมไพเลอร์เลือกยังไง:** ถ้า argument ไม่ใช่ const มันเลือกเวอร์ชัน non-const (ตรงกว่า ไม่ต้องแปลง); ถ้าเป็น const ก็มีทางเดียวคือเวอร์ชัน const. การตัดสินใจเกิดตอนคอมไพล์ทั้งหมด ไม่มีอะไรเกิดตอนรัน" },
      { qa: [
        { q: "ทำไมต้องมี min/max ทั้งเวอร์ชัน const และไม่ const?", a: "เวอร์ชัน non-const คืน reference ที่แก้ได้ แต่รับ const object ไม่ได้; เวอร์ชัน const รับได้ทุกอย่างแต่คืนของที่แก้ไม่ได้ — ต้องมีทั้งคู่ถึงจะครอบคลุมทั้งสองการใช้งาน" },
        { q: "ทำไมเป็น static?", a: "เพราะเปรียบเทียบระหว่าง 2 object ที่ส่งเข้ามา ไม่ได้ทำงานกับ object ตัวใดตัวหนึ่งเป็นเจ้าของ — เรียกผ่านชื่อคลาส `Fixed::min(a, b)` เป็นธรรมชาติกว่า `a.min(b)`" },
        { q: "คืน reference แทน value ได้ประโยชน์อะไร?", a: "ไม่ต้องก๊อป object และผู้เรียกยังแก้ตัวที่ชนะได้ผ่านค่าที่คืนมา (ในเวอร์ชัน non-const)" },
      ]},

      { h: "🔬 เจาะลึก C: `const` member — ex03 บังคับให้เข้าใจ initialiser list จริง ๆ" },
      { p: "`Point` เก็บ `Fixed const _x;` และ `Fixed const _y;`. การใส่ `const` ตรงนี้ทำให้เกิดผลตามมา 2 อย่างที่เลี่ยงไม่ได้" },
      { code: String.raw`class Point
{
    private:
        Fixed const _x;      // const → ตั้งค่าได้ครั้งเดียวตอนสร้าง
        Fixed const _y;
    public:
        Point(void);
        Point(const float x, const float y);
        Point(const Point &other);
        Point &operator=(const Point &other);   // OCF บังคับให้มี
        ~Point(void);
};

ผล 1 — ทุก constructor ต้องผูกค่าใน initialiser list:
  Point::Point(void) : _x(0), _y(0) {}
  Point::Point(const float x, const float y) : _x(x), _y(y) {}
  Point::Point(const Point &o) : _x(o._x), _y(o._y) {}     ← copy ctor ก็ด้วย

ผล 2 — operator= ทำอะไรไม่ได้ แต่ OCF บังคับให้มี:
  Point &Point::operator=(const Point &other)
  {
      (void)other;      // แก้ _x/_y ไม่ได้ เพราะเป็น const
      return (*this);
  }`, cap: "เขียน _x = o._x ในบอดี้จะคอมไพล์ไม่ผ่าน — นี่คือบทเรียนของข้อนี้", lang: "cpp" },
      { note: "ดูขัดกันแต่ไม่ผิด: OCF บอกว่า 'คลาสต้องมี operator=' ส่วน `const` member บอกว่า 'assign ไม่ได้'. ทางออกที่ยอมรับกันคือให้มีอยู่แต่ไม่ทำอะไร แล้ว cast parameter เป็น `(void)` กัน warning ตัวแปรไม่ถูกใช้" },
      { qa: [
        { q: "ทำไม const member ต้องอยู่ใน initialiser list?", a: "เพราะ member ถูกสร้างก่อนเข้าบอดี้ของ constructor — ในบอดี้จึงเป็นการ assign ทับ ซึ่ง const ห้าม. initialiser list คือจุดเดียวที่ยังเป็นการ 'สร้าง' ไม่ใช่ 'แก้'" },
        { q: "แล้ว operator= ของ Point ทำอะไร?", a: "ไม่ทำอะไรเลย คืน `*this` เฉย ๆ เพราะ member เป็น const แก้ไม่ได้ — แต่ OCF บังคับให้มี จึงต้องเขียนไว้พร้อม cast parameter เป็น (void)" },
      ]},

      { h: "🔬 เจาะลึก D: BSP — ตัดสินจุดในสามเหลี่ยมด้วยเครื่องหมาย cross product" },
      { p: "`bsp()` ตอบว่าจุดอยู่ในสามเหลี่ยมไหม. วิธีที่ใช้คือดู **เครื่องหมาย** ของ cross product 3 ตัว ไม่ต้องคำนวณพื้นที่หรือมุมเลย" },
      { code: String.raw`หลักการ: cross(o, a, b) บอกว่า b อยู่ "ข้างไหน" ของเส้น o→a

  cross(o,a,b) = (a.x-o.x)*(b.y-o.y) - (a.y-o.y)*(b.x-o.x)

  > 0  →  b อยู่ซ้ายของเส้น
  < 0  →  b อยู่ขวาของเส้น
  = 0  →  b อยู่บนเส้นพอดี

จุดอยู่ "ข้างใน" สามเหลี่ยม ⟺ อยู่ข้างเดียวกันของทั้ง 3 ด้าน
  → เครื่องหมายของ cross ทั้ง 3 ตัวต้องเหมือนกันหมด`, cap: "ไม่ต้องรู้ว่าสามเหลี่ยมวนตามเข็มหรือทวนเข็ม — แค่ 'เหมือนกันทั้ง 3' ก็พอ", lang: "txt" },
      { code: String.raw`bool bsp(Point const a, Point const b, Point const c, Point const point)
{
    Fixed d1 = cross(a, b, point);
    Fixed d2 = cross(b, c, point);
    Fixed d3 = cross(c, a, point);

    if (d1 == Fixed(0) || d2 == Fixed(0) || d3 == Fixed(0))
        return (false);          // อยู่บนขอบหรือบนมุม → subject บอกว่า "ไม่นับ"

    bool has_neg = (d1 < Fixed(0)) || (d2 < Fixed(0)) || (d3 < Fixed(0));
    bool has_pos = (d1 > Fixed(0)) || (d2 > Fixed(0)) || (d3 > Fixed(0));
    return (!(has_neg && has_pos));   // มีทั้งบวกและลบ = คนละข้าง = อยู่นอก
}`, cap: "โค้ดจริงของเรา (ex03/bsp.cpp) — ทุกการคำนวณผ่าน operator ที่เขียนเองใน ex02", lang: "cpp" },
      { note: "สังเกตว่า `Point` ถูกส่ง **by value** ตาม signature ที่ subject กำหนด — แปลว่ามีการก๊อป 4 ครั้งทุกการเรียก ซึ่งจะเห็นเป็นข้อความ ctor/dtor เต็มไปหมดตอนรัน ไม่ใช่บั๊ก" },
      { qa: [
        { q: "bsp ตัดสินยังไงว่าอยู่ในสามเหลี่ยม?", a: "คำนวณ cross product ของแต่ละด้านกับจุดที่ถาม 3 ค่า — ถ้าเครื่องหมายเหมือนกันหมดแปลว่าอยู่ข้างเดียวกันของทุกด้าน = อยู่ข้างใน" },
        { q: "จุดที่อยู่บนขอบพอดีตอบว่าอะไร?", a: "`false` ตาม subject — เช็คด้วย `== Fixed(0)` ก่อนเป็นอย่างแรก เพราะ cross เป็น 0 แปลว่าอยู่บนเส้นพอดี" },
        { q: "ทำไมโค้ด bsp ถึงไม่มีการคำนวณพื้นที่หรือมุมเลย?", a: "เพราะแค่ 'เครื่องหมาย' ของ cross ก็ตอบได้แล้วว่าอยู่ข้างไหนของแต่ละด้าน — ถูกกว่าและไม่มีปัญหาความแม่นยำของทศนิยม" },
      ]},

      { h: "📖 อ่านเพิ่มเติม" },
      { links: [
        { label: "cppreference — Operator overloading", url: "https://en.cppreference.com/w/cpp/language/operators", note: "รวม operator ที่ overload ได้ทั้งหมด + รูปแบบมาตรฐาน" },
        { label: "cppreference — Rule of three", url: "https://en.cppreference.com/w/cpp/language/rule_of_three", note: "ที่มาของ OCF: มีอันหนึ่งต้องมีครบสาม" },
        { label: "cppreference — Copy assignment operator", url: "https://en.cppreference.com/w/cpp/language/copy_assignment", note: "รวมเรื่อง self-assignment" },
        { label: "Fixed-point arithmetic — Wikipedia", url: "https://en.wikipedia.org/wiki/Fixed-point_arithmetic", note: "ทำไมถึงใช้ int แทน float" },
        { label: "Cross product — Wikipedia", url: "https://en.wikipedia.org/wiki/Cross_product", note: "ที่มาของการใช้เครื่องหมายบอกข้าง" },
      ]},
    ],

    foundations: [
      { h: "โครง Fixed ตัวเต็ม (ex02)" },
      { code: String.raw`class Fixed
{
    private:
        int                 _value;        // ค่าดิบ = ค่าจริง × 256
        static const int    _bits = 8;     // ★ integral static const ใส่ค่าใน class ได้

    public:
        Fixed(void);                       //  OCF
        Fixed(const int value);            //  แปลงจาก int
        Fixed(const float value);          //  แปลงจาก float
        Fixed(const Fixed &other);         //  OCF
        Fixed &operator=(const Fixed &o);  //  OCF
        ~Fixed(void);                      //  OCF

        int   getRawBits(void) const;
        void  setRawBits(int const raw);
        float toFloat(void) const;
        int   toInt(void) const;

        // 6 เปรียบเทียบ · 4 คำนวณ · 4 เพิ่มลด · 4 min/max (ดูหัวข้อ operator)
};

std::ostream &operator<<(std::ostream &out, const Fixed &fixed);`, cap: "โค้ดจริงของเรา — `_bits` เป็น `static const int` จึงใส่ค่าในคลาสได้เลยแม้เป็น C++98", lang: "cpp" },
      { p: "**ทำไม `_bits` เป็น static:** มันเป็นคุณสมบัติของ 'ชนิด Fixed' ไม่ใช่ของ object ตัวใดตัวหนึ่ง — ทุกตัวใช้ scale เดียวกัน จึงมีชุดเดียวพอ ไม่ต้องเปลืองที่ในทุก object" },
      { h: "4 ฟังก์ชันแปลงค่า" },
      { code: String.raw`Fixed::Fixed(const int value)
{
    this->_value = value << this->_bits;              // × 256
}

Fixed::Fixed(const float value)
{
    this->_value = roundf(value * (1 << this->_bits)); // × 256 แล้วปัด
}

float Fixed::toFloat(void) const
{
    return ((float)this->_value / (1 << this->_bits));
}

int Fixed::toInt(void) const
{
    return (this->_value >> this->_bits);              // ÷ 256 ตัดเศษ
}`, cap: "shift ใช้ได้เพราะ scale เป็นกำลังของ 2 พอดี — เร็วกว่าคูณ/หารและอ่านออกว่าเป็นการเลื่อนบิต", lang: "cpp" },
      { h: "Point (ex03)" },
      { code: String.raw`class Point
{
    private:
        Fixed const _x;    // const ทั้งคู่ → ผูกใน initialiser list เท่านั้น
        Fixed const _y;
    public:
        Point(void);
        Point(const float x, const float y);
        Point(const Point &other);
        Point &operator=(const Point &other);   // มีแต่ไม่ทำอะไร
        ~Point(void);

        Fixed getX(void) const;
        Fixed getY(void) const;
};

bool bsp(Point const a, Point const b, Point const c, Point const point);`, cap: "getX/getY จำเป็นเพราะ cross() เป็นฟังก์ชันอิสระ เข้าถึง private ไม่ได้ (และห้าม friend)", lang: "cpp" },
    ],

    architecture: [
      { h: "ไฟล์ในแต่ละข้อ" },
      { table: { head: ["ข้อ", "ไฟล์", "เพิ่มจากข้อก่อน"], rows: [
        ["ex00", "`Fixed.hpp/.cpp`, `main.cpp`", "OCF + getRawBits/setRawBits"],
        ["ex01", "เหมือน ex00", "+ ctor int/float, toFloat/toInt, `operator<<`; **ลบ** ข้อความ getRawBits ออก"],
        ["ex02", "เหมือน ex01", "+ operator 14 ตัว + min/max 4 ตัว"],
        ["ex03", "+ `Point.hpp/.cpp`, `bsp.cpp`", "ก๊อป `Fixed.hpp/.cpp` จาก ex02 มาใช้ต่อ"],
      ]}},
      { note: "ex03 ก๊อป Fixed จาก ex02 มาทั้งดุ้น ไม่ต้องเขียนใหม่ — แต่ละโฟลเดอร์ต้องคอมไพล์ได้ด้วยตัวเอง" },
      { h: "ลำดับที่ข้อความ OCF ถูกพิมพ์ (ex00)" },
      { code: String.raw`int main(void)
{
    Fixed a;                        → "Default constructor called"
    Fixed b(a);                     → "Copy constructor called"
                                      "Copy assignment operator called"   ★ 2 บรรทัด
    Fixed c;                        → "Default constructor called"
    c = b;                          → "Copy assignment operator called"
    ...
}                                   → "Destructor called" × 3 (กลับด้าน c, b, a)`, cap: "b(a) ได้ 2 บรรทัดเพราะ copy ctor เราส่งต่อให้ operator= — ตรงกับตัวอย่างใน subject", lang: "txt" },
    ],

    dataflow: [
      { p: "ไล่การคำนวณจริงทีละข้อ" },
      { h: "ex01 — ตัวเลขที่ subject คาดหวัง มาจากไหน" },
      { code: String.raw`Fixed a;                    // _value = 0
Fixed const b(10);          // int ctor:   10 << 8 = 2560
Fixed const c(42.42f);      // float ctor: roundf(42.42 * 256) = roundf(10859.52) = 10860
Fixed const d(b);           // copy

std::cout << a << std::endl;    // toFloat: 0 / 256      = 0
std::cout << b << std::endl;    // toFloat: 2560 / 256   = 10
std::cout << c << std::endl;    // toFloat: 10860 / 256  = 42.421875 → พิมพ์ 42.4219
std::cout << b.toInt();         // 2560 >> 8 = 10`, cap: "42.4219 ไม่ใช่ความคลาดเคลื่อน — มันคือค่าที่ใกล้ 42.42 ที่สุดที่ scale 1/256 แทนได้", lang: "cpp" },
      { p: "**ทำไมพิมพ์ออกมาเป็น 42.4219 ไม่ใช่ 42.421875:** `std::cout` แสดง float ด้วยความละเอียดมาตรฐาน 6 หลักนัยสำคัญ จึงได้ `42.4219`. ไม่ต้องไปตั้ง precision อะไรเพิ่ม" },

      { h: "ex02 — operator คำนวณ ทำงานยังไง" },
      { code: String.raw`Fixed Fixed::operator+(const Fixed &rhs) const
{
    return (Fixed(this->toFloat() + rhs.toFloat()));
}`, cap: "แปลงเป็น float → บวก → สร้าง Fixed ใหม่ (ซึ่งเรียก roundf ให้เอง)", lang: "cpp" },
      { code: String.raw`ทำไมไม่บวก _value ตรง ๆ?

  บวก/ลบ:  บวก _value ตรง ๆ ได้ ถูกต้องเป๊ะ
  คูณ:     _value * _value จะได้ scale เป็น 256² ต้องหาร 256 คืน
           และเสี่ยง overflow ระหว่างทาง
  หาร:     ต้องคูณ 256 ก่อนหาร ไม่งั้นเศษหายหมด

  → ใช้ float กลางทางแล้วสร้างใหม่ = สูตรเดียวใช้ได้ทั้ง 4 ตัว
    และได้การปัดที่ตรงกับที่ subject คาดหวัง (5.05 * 2 → 10.1016)

  ส่วนการเปรียบเทียบ ห้ามผ่าน float — เทียบ _value ที่เป็น int ได้เป๊ะกว่า`, cap: "คำนวณผ่าน float แต่เปรียบเทียบผ่าน int — เลือกคนละทางด้วยเหตุผลคนละอย่าง", lang: "txt" },

      { h: "ex03 — cross() ใช้ operator ของเราเอง" },
      { code: String.raw`static Fixed cross(Point const &o, Point const &a, Point const &b)
{
    Fixed ax = a.getX() - o.getX();     // ← operator- ของ Fixed
    Fixed ay = a.getY() - o.getY();
    Fixed bx = b.getX() - o.getX();
    Fixed by = b.getY() - o.getY();

    return (ax * by - ay * bx);         // ← operator* และ operator-
}`, cap: "ทั้งบรรทัดสุดท้ายอ่านเหมือนคณิตศาสตร์ปกติ — นั่นคือผลตอบแทนของการ overload operator ใน ex02", lang: "cpp" },
      { note: "จุดนี้คือคำตอบว่า 'overload operator ไปทำไม': ถ้าไม่ทำ บรรทัดนี้ต้องเขียนเป็น `ax.mul(by).sub(ay.mul(bx))` ซึ่งอ่านไม่ออกว่าเป็นสูตรอะไร" },
    ],

    implementation: [
      { h: "ลำดับการลงมือเขียน" },
      { ul: [
        "1. **ex00** — OCF 4 ตัว + ข้อความให้ตรงเป๊ะ; รันแล้วเทียบ output กับ subject ทีละบรรทัด",
        "2. **ex01** — เพิ่ม ctor int/float + toFloat/toInt + `operator<<`; **ลบข้อความ getRawBits ออก** (ex01 ไม่มีแล้ว)",
        "3. **ex02** — เขียนเปรียบเทียบ 6 ตัวก่อน (ง่ายสุด) แล้วคำนวณ 4 แล้วเพิ่ม/ลด 4 แล้ว min/max 4",
        "4. **ex03** — ก๊อป Fixed มา แล้วทำ Point (เจอเรื่อง const member) แล้วค่อย bsp",
      ]},
      { h: "บั๊กยอดฮิตและวิธีกัน" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้"], rows: [
        ["diff ไม่ตรงหลักท้าย", "ใช้ `(int)` ตัดทิ้งแทน `roundf`", "`roundf(f * (1 << _bits))`"],
        ["`friend` ทำให้ได้ -42", "เขียน `operator<<` เป็น friend", "ทำเป็น free function เรียก `toFloat()`"],
        ["output OCF ไม่ตรง subject", "copy ctor ไม่ได้เรียก operator= ต่อ", "`*this = other;` ในบอดี้ของ copy ctor"],
        ["เปรียบเทียบผลเพี้ยนบางเคส", "เทียบผ่าน `toFloat()`", "เทียบ `_value` โดยตรง"],
        ["`++a` ได้ 1 ไม่ใช่ 0.00390625", "บวกที่ float", "บวกที่ `_value` (บิตดิบ)"],
        ["Point คอมไพล์ไม่ผ่าน", "assign const member ในบอดี้", "ผูกใน initialiser list ทุก ctor"],
        ["`Fixed::max(a,b)` ไม่ผ่านตอน a,b เป็น const", "มีแค่เวอร์ชัน non-const", "เพิ่มเวอร์ชัน const"],
        ["warning ตัวแปรไม่ถูกใช้ใน `Point::operator=`", "รับ parameter แต่ใช้ไม่ได้", "`(void)other;`"],
      ]}},
      { h: "build / test" },
      { code: String.raw`cd ex02 && make re && ./a.out

# บน Windows ผ่าน WSL
wsl --exec bash -lc 'cd "/mnt/d/Projects/42/CPP Module 02/ex02" && make re && ./a.out'

# เช็คของต้องห้าม (ต้องไม่มี output) — สังเกตว่ารวม friend ด้วย
grep -rnE 'printf|[mc]alloc|free\(|using namespace|friend' ex0*/*.cpp ex0*/*.hpp

# leak (โมดูลนี้ไม่มี new เลย ควรสะอาด 100%)
valgrind --leak-check=full --error-exitcode=42 -q ./a.out`, lang: "bash" },
      { note: "เวลาเทียบ output กับ subject ให้กรองบรรทัด OCF ออกก่อน (`Constructor called` / `Destructor called` / `getRawBits member function called`) ไม่งั้น diff รกจนดูไม่ออกว่าค่าจริงตรงไหม" },
      { note: "อย่า grep หา `error` หรือ `warning` เฉย ๆ ในผลลัพธ์ของ make — มันไปเจอคำว่า `-Werror` ในบรรทัดคำสั่งคอมไพล์. ต้อง grep `error:` และ `warning:` แบบมีโคลอน" },
    ],

    tricks: [
      { h: "ทริค 1: ให้ copy ctor เรียก operator= ต่อ" },
      { p: "เขียนตรรกะการก๊อปที่เดียวใน `operator=` แล้ว copy ctor แค่ `*this = other;` — ได้ทั้งโค้ดที่ไม่ซ้ำ และ output 2 บรรทัดที่ตรงกับ subject พอดี" },
      { h: "ทริค 2: shift แทนคูณ/หาร เพราะ scale เป็นกำลัง 2" },
      { p: "`<< 8` กับ `>> 8` แทน `* 256` และ `/ 256` — เร็วกว่าและสื่อชัดว่าเรากำลังเลื่อนจุดทศนิยม ไม่ใช่คูณเลขทั่วไป" },
      { h: "ทริค 3: เปรียบเทียบที่ int คำนวณที่ float" },
      { p: "เทียบ `_value` เพราะ int เทียบเป๊ะ; คำนวณผ่าน `toFloat()` เพราะสูตรเดียวใช้ได้ทั้ง 4 ตัว และได้การปัดที่ตรงกับที่ subject คาดหวัง" },
      { h: "ทริค 4: ติดนิสัยเช็ค self-assignment" },
      { p: "`if (this != &other)` ยังไม่จำเป็นใน Fixed ที่มีแค่ int แต่พอถึง Module 04 ที่คลาสมี pointer มันคือเส้นแบ่งระหว่างโค้ดที่ทำงานกับ double free — ใส่ไว้ตั้งแต่ตอนนี้" },
      { h: "ทริค 5: เขียน `++i` แทน `i++` เป็นนิสัย" },
      { p: "ตอนไม่ได้ใช้ค่าที่คืนมา (เช่นใน loop) `++i` ไม่ต้องสร้างสำเนา. โมดูลนี้ทำให้เห็นเหตุผลด้วยตาว่าทำไม post ถึงแพงกว่า" },
      { h: "ทริค 6: ex03 ก๊อป Fixed มาทั้งดุ้น" },
      { p: "อย่าเขียน Fixed ใหม่ — ก๊อป `Fixed.hpp/.cpp` จาก ex02 มาวาง แล้วโฟกัสที่ Point กับ bsp ซึ่งเป็นของใหม่จริง ๆ" },
      { h: "ทริค 7: เช็คขอบก่อนเช็คข้างใน" },
      { p: "ใน `bsp` เช็ค `== Fixed(0)` เป็นอย่างแรก — จบเคสขอบ/มุมไปเลย แล้วตรรกะที่เหลือเหลือแค่ 'เครื่องหมายเหมือนกันไหม' ซึ่งอ่านง่ายกว่ามาก" },
    ],

    eval: [
      { qa: [
        { q: "Orthodox Canonical Form คืออะไร มีอะไรบ้าง?", a: "รูปแบบที่ 42 บังคับให้ทุกคลาสมีครบ 4 อย่าง: default constructor, copy constructor, copy assignment operator, destructor — เพื่อควบคุมการสร้าง/ก๊อป/ทำลาย object เอง ไม่ปล่อยให้คอมไพเลอร์สร้างให้" },
        { q: "ทำไมต้องเขียน OCF เองทั้งที่คอมไพเลอร์สร้างให้อยู่แล้ว?", a: "ตัวที่คอมไพเลอร์สร้างก๊อปทีละ member — พอคลาสมี pointer มันก๊อปแค่ address ทำให้ 2 object ชี้ที่เดียวกัน แล้ว double free ตอนทำลาย. เขียนเองจึงเป็นการเตรียมนิสัยไว้ก่อนถึงคลาสที่มี pointer" },
        { q: "`Fixed b = a;` เรียกอะไร?", a: "copy constructor ไม่ใช่ operator= — เพราะ b เพิ่งเกิด. `b = a;` ตอนที่ b มีอยู่แล้วถึงจะเป็น operator=" },
        { q: "fixed-point เก็บค่ายังไง?", a: "เก็บเป็น `int _value` ที่แทนค่าจริงคูณ 256 ไว้ (`_bits = 8`). อ่านกลับด้วยการหาร 256 — จึงแทนทศนิยมได้ละเอียดถึง 1/256 โดยไม่ใช้ float" },
        { q: "ทำไมต้อง `roundf` ตอนแปลงจาก float?", a: "42.42×256 = 10859.52 — ตัดทิ้งได้ 10859 ซึ่งอ่านกลับเป็น 42.4180 ไม่ตรงกับที่ subject คาด. `roundf` ได้ 10860 จึงได้ 42.4219 ตรงเป๊ะ" },
        { q: "ทำไม `operator<<` ต้องเป็น free function ไม่ใช่ member?", a: "ตัวซ้ายของ `<<` คือ `std::cout` ไม่ใช่ Fixed — จะเป็น member ต้องไปแก้ `std::ostream` ซึ่งทำไม่ได้. และห้ามใช้ friend (โทษ -42) จึงต้องเรียกผ่าน `toFloat()` ที่เป็น public" },
        { q: "ทำไม `operator<<` คืน `std::ostream&`?", a: "เพื่อให้ต่อกันได้ `cout << a << b << endl;` — ถ้าคืน void ก็ต่อไม่ได้" },
        { q: "`++a` กับ `a++` ต่างกันยังไงในโค้ด?", a: "pre (`++a`) ไม่มี parameter คืน `*this` เป็น reference; post (`a++`) มี parameter `int` หลอก ต้องเก็บสำเนาไว้ก่อนแล้วคืนสำเนานั้นเป็น value — post จึงแพงกว่า" },
        { q: "ทำไม increment เพิ่มแค่ 0.00390625?", a: "เพราะ subject กำหนดให้เพิ่ม 'ค่าที่เล็กที่สุดที่แทนได้' ซึ่งคือ 1 บิตดิบ = 1/256 ไม่ใช่ 1.0" },
        { q: "ทำไม min/max ต้องมี 4 ตัว?", a: "min กับ max อย่างละ 2 เวอร์ชัน (const / non-const) — เวอร์ชัน non-const คืน reference ที่แก้ได้แต่รับ const object ไม่ได้; เวอร์ชัน const รับได้ทุกกรณีแต่คืนของที่แก้ไม่ได้" },
        { q: "ทำไม min/max เป็น static?", a: "เพราะเปรียบเทียบระหว่าง 2 object ที่ส่งเข้ามา ไม่ได้เป็นพฤติกรรมของ object ตัวใดตัวหนึ่ง — เรียกผ่านชื่อคลาสเป็นธรรมชาติกว่า" },
        { q: "ทำไมเปรียบเทียบต้องใช้ `_value` ไม่ใช่ `toFloat()`?", a: "int เทียบได้เป๊ะ ส่วน float มีความคลาดเคลื่อนทำให้ `==` ไม่น่าเชื่อถือ — และ `_value` คือค่าจริงของ object อยู่แล้ว" },
        { q: "ทำไม const member ต้องอยู่ใน initialiser list?", a: "member ถูกสร้างก่อนเข้าบอดี้ — ในบอดี้จึงเป็นการ assign ทับซึ่ง const ห้าม. initialiser list คือจุดเดียวที่ยังนับเป็นการสร้าง" },
        { q: "Point มี const member แล้ว operator= ทำยังไง?", a: "ต้องมีตาม OCF แต่ทำอะไรไม่ได้ — เขียนให้คืน `*this` เฉย ๆ แล้ว cast parameter เป็น `(void)` กัน warning" },
        { q: "bsp ตัดสินยังไง?", a: "คำนวณ cross product 3 ตัว (จุดเทียบกับแต่ละด้าน) ถ้าเครื่องหมายเหมือนกันหมด = อยู่ข้างเดียวกันของทุกด้าน = อยู่ข้างใน; ถ้ามีตัวใดเป็น 0 = อยู่บนขอบ ตอบ false ตาม subject" },
      ]},
      { h: "ทดสอบก่อนส่ง" },
      { code: String.raw`# ex01 ต้องได้เป๊ะ
./a.out | grep -v 'called'
# a is 1234.43
# c is 42.4219
# c is 42 as integer

# ex02 ต้องได้เป๊ะ (ค่าที่ subject แสดง)
# 0 / 0.00390625 / 0.00390625 / 0.00390625 / 0.0078125 / 10.1016 / 10.1016

# ทดสอบ epsilon ด้วยตัวเอง
# Fixed a; ++a;  → ต้องได้ 0.00390625 (= 1/256)

# ex03 เคสขอบ
# จุดที่เป็นมุมสามเหลี่ยม → false
# จุดบนด้าน               → false
# จุดกลางสามเหลี่ยม        → true
# จุดไกลออกไป             → false

# ห้ามมี friend
grep -rn 'friend' ex0*/ && echo "พบ friend = -42"`, lang: "bash" },
    ],
  },
});

/* ===================== CPP MODULE 03 ===================== */
window.TEACHING_DATA.push({
  id: "cpp_module_03",
  name: "CPP Module 03",
  tag: { th: "การสืบทอด — ตระกูล ClapTrap: ex00 คลาสฐาน, ex01 ScavTrap, ex02 FragTrap, ex03 DiamondTrap กับปัญหาเพชร (diamond problem) และ virtual inheritance",
         en: "Inheritance — the ClapTrap family: ex00 the base class, ex01 ScavTrap, ex02 FragTrap, ex03 DiamondTrap, the deadly diamond, and virtual inheritance" },
  accent: "#22a6b3",
  sections: {
    principle: [
      { h: "Module 03 สอนอะไร" },
      { p: "โมดูลนี้มีเรื่องเดียวคือ **inheritance** — คลาสหนึ่งรับของจากอีกคลาสมาต่อยอด. แต่สิ่งที่ถูกวัดจริง ๆ ไม่ใช่ 'เขียน `: public ClapTrap` เป็นไหม' แต่คือ **เข้าใจลำดับการสร้างและทำลายไหม** และ **รู้ไหมว่าทำไมการสืบทอดสองสายพร้อมกันถึงพัง**" },
      { h: "รูปร่างของทั้งโมดูล" },
      { code: String.raw`              ClapTrap                 ex00   HP 10 / EP 10 / AD 0
             /        \
        ScavTrap     FragTrap          ex01   Scav 100 / 50  / 20  + guardGate()
             \        /                ex02   Frag 100 / 100 / 30  + highFivesGuys()
            DiamondTrap                ex03   สืบทอดทั้งสองสาย → เพชร`, cap: "หุ่น 1 ตัวแตกเป็น 3 แล้วมารวมกันอีกทีที่ ex03 — ปัญหาเกิดตรงที่มารวมนั่นแหละ", lang: "txt" },
      { h: "4 ข้อ" },
      { table: { head: ["ข้อ", "คลาส", "ประเด็นที่สอน"], rows: [
        ["ex00", "ClapTrap", "OCF + การกันไม่ให้ทำงานตอน HP/EP หมด + `unsigned` underflow"],
        ["ex01", "ScavTrap", "การสืบทอด + ลำดับ ctor/dtor + เปลี่ยน `private` เป็น `protected`"],
        ["ex02", "FragTrap", "สืบทอดอีกสายจากฐานเดียวกัน (เตรียมทางให้ ex03)"],
        ["ex03", "DiamondTrap", "**diamond problem** + `virtual` inheritance + การบัง (shadow) ชื่อ member"],
      ]}},
      { h: "กฎเหล็ก" },
      { ul: [
        "**OCF บังคับทุกคลาส** — และคลาสลูกต้องส่งต่อไปยังคลาสแม่ด้วย ไม่ใช่แค่มีให้ครบ",
        "ห้าม `printf` / `malloc` / `free` / `using namespace` / `friend`",
        "ห้าม STL container/algorithm",
        "ทุก header ต้องใช้งานเดี่ยว ๆ ได้ (include สิ่งที่ตัวเองต้องใช้ + include guard)",
        "แต่ละ `exNN/` เป็นสำเนาที่สมบูรณ์ในตัว — ex03 มีครบทั้ง 4 คลาส. **ก๊อปจากข้อก่อนมา** ไม่ต้องเขียนใหม่",
      ]},
      { note: "ex03 เป็น optional ตาม subject แต่ diamond problem คือหัวใจของทั้งโมดูล — ข้ามไปแล้วเท่ากับเรียนไม่ครบ" },
    ],

    theory: [
      { h: "1) สืบทอดแล้วได้อะไรมา" },
      { code: String.raw`class ScavTrap : public ClapTrap { ... };
                ^^^^^^
    public = ของ public ของแม่ยังเป็น public ต่อ
             ของ protected ยังเป็น protected ต่อ
             ของ private ของแม่ → ลูกแตะไม่ได้ (ไม่ว่าจะสืบทอดแบบไหน)

ScavTrap มีอะไรบ้าง:
  - member ทุกตัวของ ClapTrap (แต่จะแตะได้ไหมขึ้นกับ access)
  - method ทุกตัวของ ClapTrap
  - ของใหม่ที่ตัวเองประกาศเพิ่ม (guardGate)`, cap: "สืบทอดคือ 'มี ClapTrap อยู่ข้างในตัว' ไม่ใช่ 'ก๊อปโค้ดมา'", lang: "cpp" },

      { h: "2) `private` → `protected` (จุดที่หลายคนติดตอน ex01)" },
      { p: "ex00 บอกให้ attribute เป็น `private`. ex01 บอกว่า *ScavTrap จะใช้ attribute ของ ClapTrap (ให้ปรับ ClapTrap ตามนั้น)* — ประโยคนี้แปลว่า **เปลี่ยนเป็น `protected`**" },
      { table: { head: ["access", "คลาสตัวเอง", "คลาสลูก", "โลกภายนอก"], rows: [
        ["`private`", "✓", "✗", "✗"],
        ["`protected`", "✓", "✓", "✗"],
        ["`public`", "✓", "✓", "✓"],
      ]}},
      { note: "ถ้าคอมไพเลอร์ฟ้อง **`_hitPoints is private`** ตอนเขียน ScavTrap — นี่คือสาเหตุ. แก้ที่สำเนา ClapTrap ของ ex01/02/03 (ex00 คงเป็น private ตาม subject)" },

      { h: "3) ลำดับ construct / destruct — สิ่งที่ถูกวัดจริง" },
      { code: String.raw`ScavTrap s("Bob");

  สร้าง:   ClapTrap ctor  →  ScavTrap ctor        (แม่ก่อน ลูกทีหลัง)
  ทำลาย:   ScavTrap dtor  →  ClapTrap dtor        (กลับด้าน)

ทำไมต้องเป็นลำดับนี้:
  - ตอนสร้าง ลูกอาจใช้ของที่แม่เตรียมไว้ → แม่ต้องพร้อมก่อน
  - ตอนทำลาย ลูกอาจยังต้องใช้ของแม่ตอนเก็บกวาด → ลูกต้องเสร็จก่อน`, cap: "หลักเดียวกับ 'ปูรากฐานก่อนสร้างบ้าน แต่รื้อหลังคาก่อนรื้อฐาน'", lang: "txt" },

      { h: "4) constructor ของลูกต้องเรียกของแม่" },
      { code: String.raw`ScavTrap::ScavTrap(const std::string &name) : ClapTrap(name)
{                                                 ^^^^^^^^^^^^^^
    this->_hitPoints    = 100;    //  ถ้าไม่เขียนตรงนี้ คอมไพเลอร์
    this->_energyPoints = 50;     //  จะเรียก ClapTrap() แบบ default ให้เอง
    this->_attackDamage = 20;     //  → ชื่อหุ่นหาย
    std::cout << "ScavTrap " << this->_name << " constructed" << std::endl;
}`, cap: "แม่รันก่อนด้วยค่า 10/10/0 แล้วลูกค่อยเขียนทับเป็น 100/50/20 ในบอดี้", lang: "cpp" },

      { h: "5) copy / assign ก็ต้องส่งต่อ" },
      { code: String.raw`ScavTrap::ScavTrap(const ScavTrap &o) : ClapTrap(o)   // ← ก๊อปส่วนของแม่ด้วย
{
    *this = o;
}

ScavTrap &ScavTrap::operator=(const ScavTrap &o)
{
    ClapTrap::operator=(o);        // ← assign ส่วนของแม่ด้วย
    return (*this);
}`, cap: "ลืมบรรทัดที่ชี้ลูกศร = ส่วนของแม่ถูกสร้างแบบ default แทนที่จะถูกก๊อป — บั๊กที่เงียบมาก", lang: "cpp" },

      { h: "6) สถิติของหุ่นแต่ละตัว" },
      { table: { head: ["หุ่น", "HP", "EP", "AD", "ของพิเศษ", "override attack?"], rows: [
        ["ClapTrap", "10", "10", "0", "—", "—"],
        ["ScavTrap", "100", "50", "20", "`guardGate()`", "**ใช่** (ข้อความของตัวเอง)"],
        ["FragTrap", "100", "100", "30", "`highFivesGuys()`", "ไม่ (ใช้ของ ClapTrap)"],
        ["DiamondTrap", "100", "50", "30", "`whoAmI()`", "ใช่ (ยืมของ ScavTrap)"],
      ]}},

      { h: "🔬 เจาะลึก A: `unsigned` underflow — บั๊กที่ซ่อนอยู่ใน takeDamage" },
      { p: "stat ทั้งสามเป็น `unsigned int` เพราะเลือดติดลบไม่มีความหมาย. แต่ `unsigned` ไม่ได้แปลว่า 'ลบแล้วหยุดที่ 0' — มันแปลว่า **'ลบแล้ววนกลับไปเป็นเลขมหาศาล'**" },
      { code: String.raw`unsigned int hp = 10;
hp -= 30;              // ไม่ได้ -20

  10 - 30 ในโลก unsigned 32 บิต:
  = 2^32 - 20
  = 4294967276          ← หุ่นที่ควรตาย กลับมีเลือด 4 พันล้าน

โค้ดที่ผิด:
  void ClapTrap::takeDamage(unsigned int amount)
  {
      this->_hitPoints -= amount;      // ✗ underflow
  }

โค้ดที่ถูก:
  void ClapTrap::takeDamage(unsigned int amount)
  {
      if (amount >= this->_hitPoints)
          this->_hitPoints = 0;        // ตรึงที่ 0
      else
          this->_hitPoints -= amount;
  }`, cap: "เช็คก่อนลบ ไม่ใช่ลบแล้วค่อยเช็ค — พอมันวนไปแล้วไม่มีทางรู้ว่าเคยติดลบ", lang: "cpp" },
      { note: "นี่เป็นคนละเรื่องกับ `int` overflow ใน push_swap: `int` ล้นแล้วเป็น undefined behavior ส่วน `unsigned` ล้นแล้ว **วนแน่นอนตามมาตรฐาน** — ไม่ใช่ UB แต่ก็ยังผิดตรรกะอยู่ดี" },
      { qa: [
        { q: "ทำไมใช้ `unsigned int` เก็บ HP?", a: "เพราะเลือดติดลบไม่มีความหมาย และ `unsigned` สื่อเจตนานั้นตั้งแต่ชนิดข้อมูล. แลกกับที่ต้องระวังการลบเกินเอง" },
        { q: "`unsigned` ลบเกินแล้วเกิดอะไร?", a: "วนกลับไปเป็นเลขบวกมหาศาล (10 - 30 = 4294967276 บน 32 บิต) — ตามมาตรฐานไม่ใช่ UB แต่ผิดตรรกะเกม จึงต้องเช็ค `amount >= _hitPoints` ก่อนลบ" },
      ]},

      { h: "🔬 เจาะลึก B: diamond problem — ทำไมสืบทอด 2 สายถึงพัง" },
      { p: "`DiamondTrap` สืบทอดทั้ง `ScavTrap` และ `FragTrap` ซึ่งทั้งคู่สืบทอด `ClapTrap`. ถ้าไม่ทำอะไรเป็นพิเศษ DiamondTrap จะมี **ClapTrap อยู่ข้างใน 2 ชุด**" },
      { code: String.raw`ไม่ใส่ virtual — หน่วยความจำของ DiamondTrap หน้าตาแบบนี้:

  ┌─ DiamondTrap ────────────────────┐
  │ ┌─ ScavTrap ──┐  ┌─ FragTrap ──┐ │
  │ │ ┌ClapTrap┐  │  │ ┌ClapTrap┐  │ │   ← 2 ชุด!
  │ │ │_name   │  │  │ │_name   │  │ │
  │ │ │_hitPts │  │  │ │_hitPts │  │ │
  │ │ └────────┘  │  │ └────────┘  │ │
  │ └─────────────┘  └─────────────┘ │
  │ _name (ของ DiamondTrap เอง)      │
  └──────────────────────────────────┘

ผลที่ตามมา:
  1. เขียน _hitPoints เฉย ๆ → error: request for member is ambiguous
     (คอมไพเลอร์ไม่รู้ว่าหมายถึงชุดของ Scav หรือของ Frag)
  2. ClapTrap ctor รัน 2 ครั้ง / dtor รัน 2 ครั้ง
  3. เปลืองหน่วยความจำ และสถานะของหุ่นแยกเป็น 2 ชุดที่ไม่ตรงกัน`, cap: "subject บอกว่า 'ClapTrap จะถูกสร้างครั้งเดียว เท่านั้น. ใช่ มันมีทริค' — ทริคนั้นคือ virtual inheritance", lang: "txt" },
      { code: String.raw`ใส่ virtual ที่ "ทั้งสองสายกลาง" (เฉพาะสำเนาของ ex03):

  class ScavTrap : virtual public ClapTrap { ... };
  class FragTrap : virtual public ClapTrap { ... };
  class DiamondTrap : public ScavTrap, public FragTrap { ... };

  ┌─ DiamondTrap ────────────────────┐
  │ ┌─ ScavTrap ──┐  ┌─ FragTrap ──┐ │
  │ └─────────────┘  └─────────────┘ │
  │ ┌─ ClapTrap (ชุดเดียว ใช้ร่วมกัน)┐│   ← แก้แล้ว
  │ └──────────────────────────────┘ │
  │ _name (ของ DiamondTrap เอง)      │
  └──────────────────────────────────┘`, cap: "`virtual` แปลว่า 'ถ้ามีใครสืบทอดฉันหลายทาง ให้ใช้ ClapTrap ชุดเดียวร่วมกัน'", lang: "cpp" },
      { p: "**ผลข้างเคียงที่ต้องรู้ 2 ข้อ:**" },
      { ul: [
        "**คลาสล่างสุดเป็นคนสร้าง virtual base เอง** — `: ClapTrap(name)` ที่อยู่ใน ScavTrap และ FragTrap จะ**ถูกเมิน**เมื่อมันเป็นส่วนหนึ่งของ DiamondTrap. DiamondTrap จึงต้องเรียก `ClapTrap(...)` ใน initialiser list ของตัวเอง",
        "**ลำดับสร้างเปลี่ยน** — virtual base มาก่อนเสมอ: ClapTrap → ScavTrap → FragTrap → DiamondTrap และ ClapTrap รันแค่ครั้งเดียว. ทำลายกลับด้าน ครั้งเดียวเช่นกัน",
      ]},
      { qa: [
        { q: "diamond problem คืออะไร?", a: "เมื่อคลาสหนึ่งสืบทอด 2 คลาสที่มีแม่ร่วมกัน มันจะได้แม่มา 2 ชุด — ทำให้อ้างถึง member ของแม่แล้ว ambiguous และ ctor/dtor ของแม่รัน 2 ครั้ง" },
        { q: "virtual inheritance แก้ยังไง?", a: "ใส่ `virtual` ที่การสืบทอดของสายกลาง (`class ScavTrap : virtual public ClapTrap`) แล้วคลาสล่างสุดจะได้ ClapTrap ชุดเดียวที่ทั้ง 2 สายใช้ร่วมกัน" },
        { q: "ใครเป็นคนสร้าง virtual base?", a: "คลาสล่างสุด (DiamondTrap) — เพราะมี ClapTrap ชุดเดียว จึงต้องมีเจ้าภาพเดียว. `: ClapTrap(...)` ที่เขียนไว้ใน ScavTrap/FragTrap ถูกเมินในบริบทนี้" },
        { q: "ทำไม virtual base ถูกสร้างก่อนตัวอื่นเสมอ?", a: "เพราะสายกลางทั้งสองต่างก็ต้องใช้มัน — ต้องพร้อมก่อนใครทั้งหมด" },
      ]},

      { h: "🔬 เจาะลึก C: การบังชื่อ (shadowing) — `_name` 2 ตัวใน DiamondTrap" },
      { p: "subject ให้ DiamondTrap มี `_name` เป็น private **ชื่อเดียวกับของ ClapTrap** โดยตั้งใจ. ชื่อที่ใกล้กว่าจะบังชื่อที่ไกลกว่า — ต้องเรียกชื่อเต็มถึงจะถึงตัวที่ถูกบัง" },
      { code: String.raw`ภายใน method ของ DiamondTrap:

  _name              → ของ DiamondTrap (ตัวใกล้กว่าบังไว้)
  ClapTrap::_name    → ของ ClapTrap (ต้องระบุให้ชัด)
  this->ClapTrap::_name   ← เขียนแบบนี้ก็ได้ ชัดกว่า

void DiamondTrap::whoAmI(void)
{
    std::cout << "I am DiamondTrap " << this->_name
              << ", and my ClapTrap name is " << this->ClapTrap::_name
              << "!" << std::endl;
}`, cap: "โจทย์ตั้งใจให้ชื่อชนกัน เพื่อบังคับให้เจอเรื่อง scope resolution", lang: "cpp" },
      { code: String.raw`โค้ดจริงของเรา — constructor ของ DiamondTrap:

DiamondTrap::DiamondTrap(const std::string &name) :
    ClapTrap(name + "_clap_name"),   // ★ virtual base สร้างตรงนี้ + เติม suffix
    ScavTrap(name),
    FragTrap(name),
    _name(name)                       // ของ DiamondTrap เอง (ไม่มี suffix)
{
    this->_hitPoints    = FragTrap::_hitPoints;      // 100
    this->_energyPoints = ScavTrap::_energyPoints;   //  50
    this->_attackDamage = FragTrap::_attackDamage;   //  30
    std::cout << "DiamondTrap " << this->_name << " constructed" << std::endl;
}`, cap: "ตั้งค่า 3 stat ในบอดี้ ไม่พึ่งลำดับของ base — เพราะ FragTrap รันทีหลัง ถ้าไม่เขียนทับ EP จะกลายเป็น 100 ไม่ใช่ 50", lang: "cpp" },
      { note: "**อย่าเติม `-Wshadow` ใน Makefile** — flag ที่บังคับมีแค่ `-Wall -Wextra -Werror` ซึ่งไม่รวม `-Wshadow`. subject พูดถึงมันเพื่อให้เรารู้ว่า shadow นี้เป็นของจริงและต้องแก้ด้วย `ClapTrap::` ไม่ใช่เพื่อให้เปิด warning (เปิดแล้วจะกลายเป็น error เพราะมี `-Werror`)" },
      { qa: [
        { q: "DiamondTrap มี `_name` 2 ตัว แยกยังไง?", a: "`_name` เฉย ๆ คือของ DiamondTrap (ตัวใกล้บังตัวไกล); ของ ClapTrap ต้องเรียก `ClapTrap::_name` หรือ `this->ClapTrap::_name`" },
        { q: "ทำไมต้องเซ็ต stat ในบอดี้ ไม่ปล่อยให้ base ตั้งให้?", a: "เพราะ FragTrap รันหลัง ScavTrap ค่า 100/100/30 ของมันจะเขียนทับ EP=50 ของ ScavTrap. เซ็ตเองในบอดี้จึงได้ 100/50/30 ตามที่ subject กำหนดแน่นอน" },
        { q: "`-Wshadow` ต้องใส่ไหม?", a: "ไม่ — flag บังคับมีแค่ `-Wall -Wextra -Werror`. ใส่ `-Wshadow` เข้าไปจะทำให้ shadow ที่ตั้งใจกลายเป็น error เพราะมี `-Werror`" },
      ]},

      { h: "📖 อ่านเพิ่มเติม" },
      { links: [
        { label: "cppreference — Derived classes", url: "https://en.cppreference.com/w/cpp/language/derived_class", note: "รวม virtual base และลำดับการสร้าง" },
        { label: "cppreference — Access specifiers", url: "https://en.cppreference.com/w/cpp/language/access", note: "private / protected / public ต่างกันยังไง" },
        { label: "Multiple inheritance — Wikipedia", url: "https://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem", note: "diamond problem ในภาษาต่าง ๆ" },
        { label: "learncpp — Virtual base classes", url: "https://www.learncpp.com/cpp-tutorial/virtual-base-classes/", note: "อธิบาย virtual inheritance ทีละขั้น" },
      ]},
    ],

    foundations: [
      { h: "ClapTrap — คลาสฐาน" },
      { code: String.raw`class ClapTrap
{
    protected:                      // ex00 เป็น private → ex01+ เปลี่ยนเป็น protected
        std::string  _name;
        unsigned int _hitPoints;    // 10
        unsigned int _energyPoints; // 10
        unsigned int _attackDamage; //  0

    public:
        ClapTrap(void);
        ClapTrap(const std::string &name);
        ClapTrap(const ClapTrap &other);
        ClapTrap &operator=(const ClapTrap &other);
        virtual ~ClapTrap(void);           // virtual dtor (เตรียมไว้ให้ลูก)

        void attack(const std::string &target);
        void takeDamage(unsigned int amount);
        void beRepaired(unsigned int amount);
};`, cap: "3 action + 4 stat + OCF — ทั้งโมดูลต่อยอดจากคลาสนี้", lang: "cpp" },
      { p: "**การกันไม่ให้ทำงาน (gating) คือพฤติกรรมที่ถูกวัด:** หุ่นที่ HP เป็น 0 หรือ EP เป็น 0 ต้องทำอะไรไม่ได้เลย. `attack` และ `beRepaired` ต้องเช็คทั้งสองอย่างก่อน แล้วพิมพ์ข้อความปฏิเสธและ `return` — และทั้งคู่กิน EP 1 หน่วยต่อครั้ง" },
      { code: String.raw`void ClapTrap::attack(const std::string &target)
{
    if (this->_hitPoints == 0 || this->_energyPoints == 0)
    {
        std::cout << "ClapTrap " << this->_name
                  << " cannot attack (no HP or EP left)" << std::endl;
        return ;
    }
    this->_energyPoints--;
    std::cout << "ClapTrap " << this->_name << " attacks " << target
              << ", causing " << this->_attackDamage
              << " points of damage!" << std::endl;
}`, cap: "เช็คก่อน หักพลังงาน แล้วค่อยทำ — สลับลำดับแล้วจะกิน EP ทั้งที่ทำอะไรไม่ได้", lang: "cpp" },
      { note: "หุ่นแต่ละตัว **ไม่ยุ่งกัน** — `attack` รับแค่ `std::string` ไม่เคยรับ object อีกตัว. ไม่ต้องพยายามทำให้ takeDamage ถูกเรียกอัตโนมัติ" },

      { h: "ScavTrap / FragTrap — ลูก 2 สาย" },
      { code: String.raw`class ScavTrap : public ClapTrap        // ex01 (ex03 เติม virtual)
{
    public:
        ScavTrap(void);
        ScavTrap(const std::string &name);
        ScavTrap(const ScavTrap &other);
        ScavTrap &operator=(const ScavTrap &other);
        ~ScavTrap(void);

        void attack(const std::string &target);   // override ข้อความ
        void guardGate(void);                     // ของใหม่
};

class FragTrap : public ClapTrap        // ex02
{
    public:
        /* OCF เหมือนกัน */
        void highFivesGuys(void);       // ของใหม่ (ไม่ override attack)
};`, cap: "subject ขอให้ ScavTrap เปลี่ยนข้อความ attack เท่านั้น — FragTrap แค่ข้อความ ctor/dtor ต่าง ไม่ต้องทำเกิน", lang: "cpp" },

      { h: "DiamondTrap — ตัวจบ" },
      { code: String.raw`// ★ ในสำเนาของ ex03 เท่านั้น: เติม virtual ที่ทั้ง 2 สาย
class ScavTrap : virtual public ClapTrap { ... };
class FragTrap : virtual public ClapTrap { ... };

class DiamondTrap : public ScavTrap, public FragTrap
{
    private:
        std::string _name;          // ★ ชื่อชนกับ ClapTrap::_name โดยตั้งใจ

    public:
        DiamondTrap(void);
        DiamondTrap(const std::string &name);
        DiamondTrap(const DiamondTrap &other);
        DiamondTrap &operator=(const DiamondTrap &other);
        ~DiamondTrap(void);

        void attack(const std::string &target);   // ยืมของ ScavTrap
        void whoAmI(void);
};`, cap: "โค้ดจริงของเรา — `attack` เรียก `ScavTrap::attack(target)` ต่อ ไม่เขียนใหม่", lang: "cpp" },
    ],

    architecture: [
      { h: "ไฟล์ในแต่ละข้อ (แต่ละโฟลเดอร์สมบูรณ์ในตัว)" },
      { table: { head: ["ข้อ", "คลาสที่มี", "วิธีทำ"], rows: [
        ["ex00", "ClapTrap", "เขียนใหม่"],
        ["ex01", "ClapTrap + ScavTrap", "ก๊อป ex00 มา → เปลี่ยน private เป็น protected → เพิ่ม ScavTrap"],
        ["ex02", "+ FragTrap", "ก๊อป ex01 มา → เพิ่ม FragTrap"],
        ["ex03", "+ DiamondTrap", "ก๊อป ex02 มา → เติม `virtual` ที่ 2 สาย → เพิ่ม DiamondTrap"],
      ]}},
      { h: "ลำดับที่จะเห็นตอนรัน ex01" },
      { code: String.raw`{
    ScavTrap s("Bob");
}

  ClapTrap Bob constructed          ← แม่ก่อน
  ScavTrap Bob constructed          ← ลูกทีหลัง
  ScavTrap Bob destructed           ← ลูกก่อน
  ClapTrap Bob destructed           ← แม่ทีหลัง`, cap: "นี่คือสิ่งที่กรรมการดู — main ของเราต้องทำให้ลำดับนี้เห็นชัด", lang: "txt" },
      { h: "ลำดับที่จะเห็นตอนรัน ex03 (virtual base)" },
      { code: String.raw`{
    DiamondTrap d("Rex");
}

  ClapTrap Rex_clap_name constructed   ← virtual base มาก่อน และมาครั้งเดียว
  ScavTrap Rex constructed
  FragTrap Rex constructed
  DiamondTrap Rex constructed
  DiamondTrap Rex destructed           ← กลับด้านทั้งหมด
  FragTrap Rex destructed
  ScavTrap Rex destructed
  ClapTrap Rex_clap_name destructed    ← ครั้งเดียวเช่นกัน

ถ้าลืม virtual จะเห็น ClapTrap ctor/dtor อย่างละ 2 ครั้ง ← สัญญาณว่าพัง`, cap: "นับจำนวนบรรทัด ClapTrap คือวิธีเช็ค virtual inheritance ที่เร็วที่สุด", lang: "txt" },
    ],

    dataflow: [
      { h: "ไล่การต่อสู้ใน ex00" },
      { code: String.raw`ClapTrap a("A");         // HP 10, EP 10, AD 0

a.attack("B");           // EP 10→9, ทำ damage 0 (AD เริ่มที่ 0 ตาม subject)
a.takeDamage(4);         // HP 10→6
a.beRepaired(3);         // EP 9→8, HP 6→9
a.takeDamage(100);       // amount >= HP → HP = 0 (ไม่ underflow)
a.attack("B");           // HP == 0 → ปฏิเสธ ไม่กิน EP
a.beRepaired(5);         // HP == 0 → ปฏิเสธเช่นกัน`, cap: "ตรวจ 2 อย่าง: HP ตรึงที่ 0 ได้ และหุ่นที่ตายแล้วทำอะไรไม่ได้", lang: "cpp" },

      { h: "ไล่ copy ของคลาสลูก" },
      { code: String.raw`ScavTrap a("A");
ScavTrap b(a);           // copy ctor

  เกิดอะไรขึ้นตามลำดับ:
    1. ScavTrap::ScavTrap(const ScavTrap &o) : ClapTrap(o)
                                               ^^^^^^^^^^^  ← ก๊อปส่วนแม่ก่อน
    2. เข้าบอดี้ → *this = o  → เรียก ScavTrap::operator=
    3. ScavTrap::operator= → ClapTrap::operator=(o) → ก๊อป stat ทั้ง 4

  ถ้าลืม ": ClapTrap(o)" ในบรรทัดที่ 1:
    → คอมไพเลอร์เรียก ClapTrap() แบบ default แทน
    → b ได้ชื่อว่างและ stat 10/10/0 แล้วค่อยถูก operator= แก้ทีหลัง
    → ถ้าลืมทั้ง 2 จุด b จะเป็นหุ่นเปล่า ๆ ที่ไม่เหมือน a เลย`, cap: "การก๊อปของคลาสลูกมี 2 ชั้นเสมอ — ชั้นแม่กับชั้นตัวเอง ต้องจัดการทั้งคู่", lang: "txt" },

      { h: "DiamondTrap::whoAmI — จุดที่ shadow มีผล" },
      { code: String.raw`DiamondTrap d("Rex");
d.whoAmI();

  → "I am DiamondTrap Rex, and my ClapTrap name is Rex_clap_name!"
                        ^^^                          ^^^^^^^^^^^^^
                    _name ของตัวเอง             ClapTrap::_name

  ที่ต่างกันเพราะ constructor ส่งคนละค่า:
    ClapTrap(name + "_clap_name")   → ฐานได้ "Rex_clap_name"
    _name(name)                     → ตัวเองได้ "Rex"`, cap: "ตัวอย่างที่จับต้องได้ว่า 'ชื่อเดียวกัน คนละตัวแปร' หมายความว่าอะไร", lang: "txt" },
    ],

    implementation: [
      { h: "ลำดับการลงมือเขียน" },
      { ul: [
        "1. **ex00** — ClapTrap ครบ OCF + 3 action + gating + กัน underflow; ใส่ข้อความทุก ctor/dtor",
        "2. **ex01** — ก๊อปทั้งโฟลเดอร์มา → `private` เป็น `protected` → ScavTrap (อย่าลืม `: ClapTrap(name)`)",
        "3. **ex02** — ก๊อป ex01 มา → FragTrap แบบเดียวกัน (ไม่ต้อง override attack)",
        "4. **ex03** — ก๊อป ex02 มา → เติม `virtual` ที่ ScavTrap/FragTrap → DiamondTrap → รันแล้วนับบรรทัด ClapTrap ว่ามีอย่างละ 1",
      ]},
      { h: "บั๊กยอดฮิตและวิธีกัน" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้"], rows: [
        ["หุ่นตายแล้วเลือดเป็นเลขมหาศาล", "`_hitPoints -= amount` ตอน `unsigned`", "เช็ค `amount >= _hitPoints` ก่อนแล้วตรึงที่ 0"],
        ["`_hitPoints is private`", "ยังเป็น `private` อยู่ใน ex01+", "เปลี่ยนเป็น `protected`"],
        ["ชื่อหุ่นหายตอนสร้างลูก", "ลืม `: ClapTrap(name)`", "เรียก ctor แม่ใน initialiser list"],
        ["ก๊อปแล้วได้หุ่นเปล่า", "copy ctor/operator= ไม่ส่งต่อไปแม่", "`: ClapTrap(o)` และ `ClapTrap::operator=(o)`"],
        ["`request for member is ambiguous`", "diamond ที่ไม่มี virtual", "`virtual public ClapTrap` ที่ทั้ง 2 สาย"],
        ["ClapTrap ctor/dtor รัน 2 ครั้งใน ex03", "เหมือนข้างบน", "เหมือนข้างบน"],
        ["ชื่อฐานของ DiamondTrap ไม่มี suffix", "ไม่ได้เรียก `ClapTrap()` เอง", "DiamondTrap ต้องมี `ClapTrap(name + \"_clap_name\")` ใน list"],
        ["EP ของ DiamondTrap เป็น 100 ไม่ใช่ 50", "ปล่อยให้ FragTrap (รันทีหลัง) ตั้งค่าทับ", "เซ็ต 3 stat เองในบอดี้"],
      ]}},
      { h: "build / test" },
      { code: String.raw`cd ex03 && make re && ./diamondtrap

# บน Windows ผ่าน WSL
wsl --exec bash -lc 'cd "/mnt/d/Projects/42/CPP Module 03/ex03" && make re && ./diamondtrap'

# เช็คว่า virtual inheritance ทำงาน — ต้องได้อย่างละ 1
./diamondtrap | grep -c 'ClapTrap.*constructed'
./diamondtrap | grep -c 'ClapTrap.*destructed'

# ของต้องห้าม
grep -rnE 'printf|[mc]alloc|free\(|using namespace|friend' ex0*/*.cpp ex0*/*.hpp

# leak (โมดูลนี้ไม่มี new — ควรสะอาด)
valgrind --leak-check=full --error-exitcode=42 -q ./diamondtrap`, lang: "bash" },
    ],

    tricks: [
      { h: "ทริค 1: ก๊อปข้อก่อนมาทั้งโฟลเดอร์" },
      { p: "แต่ละ ex ต้องสมบูรณ์ในตัว — `cp -r ex01/* ex02/` แล้วเพิ่มของใหม่ เร็วกว่าและไม่มีทางพิมพ์ผิด. ex03 มีครบ 4 คลาส" },
      { h: "ทริค 2: นับบรรทัด ClapTrap เพื่อเช็ค virtual" },
      { p: "`./diamondtrap | grep -c 'ClapTrap.*constructed'` ต้องได้ 1. ได้ 2 แปลว่าลืม `virtual` — เป็นการทดสอบที่เร็วและชัดกว่าไล่อ่านโค้ด" },
      { h: "ทริค 3: เซ็ต stat ในบอดี้ ไม่พึ่งลำดับ base" },
      { p: "ใน DiamondTrap ตั้ง HP/EP/AD เองในบอดี้ constructor — ไม่ต้องคิดว่า base ไหนรันก่อนหลัง ได้ค่าที่ต้องการแน่นอน" },
      { h: "ทริค 4: `virtual` ที่ destructor ของ ClapTrap" },
      { p: "ใส่ `virtual ~ClapTrap()` ไว้ตั้งแต่ ex00 — ยังไม่จำเป็นในโมดูลนี้ (เพราะยังไม่ลบผ่าน pointer ของแม่) แต่เป็นนิสัยที่ Module 04 จะบังคับใช้จริง" },
      { h: "ทริค 5: เช็คก่อนหักพลังงาน" },
      { p: "ใน `attack`/`beRepaired` เช็ค HP/EP ให้ผ่านก่อน แล้วค่อย `_energyPoints--`. สลับลำดับแล้วหุ่นที่ทำอะไรไม่ได้จะยังเสีย EP ฟรี" },
      { h: "ทริค 6: อย่าเติม `-Wshadow`" },
      { p: "flag ที่บังคับมีแค่ `-Wall -Wextra -Werror`. `_name` 2 ตัวใน DiamondTrap เป็น shadow ที่ตั้งใจ — เปิด `-Wshadow` เมื่อไหร่มันกลายเป็น error ทันทีเพราะมี `-Werror`" },
    ],

    eval: [
      { qa: [
        { q: "inheritance คืออะไร ได้อะไรมา?", a: "คลาสลูกมี member และ method ของแม่อยู่ในตัว (แตะได้ตาม access) แล้วเพิ่มของตัวเองต่อ — ไม่ใช่การก๊อปโค้ด แต่คือ 'มี object ของแม่อยู่ข้างใน'" },
        { q: "`private` กับ `protected` ต่างกันยังไง?", a: "`private` คลาสลูกแตะไม่ได้; `protected` ลูกแตะได้แต่โลกภายนอกไม่ได้. ex01 บังคับให้เปลี่ยน attribute ของ ClapTrap เป็น protected เพื่อให้ ScavTrap ใช้ได้" },
        { q: "ลำดับการสร้างและทำลายเป็นยังไง?", a: "สร้าง: แม่ก่อน ลูกทีหลัง (ลูกอาจใช้ของที่แม่เตรียมไว้); ทำลาย: ลูกก่อน แม่ทีหลัง (ลูกอาจยังต้องใช้ของแม่ตอนเก็บกวาด)" },
        { q: "ทำไม constructor ของลูกต้องเรียกของแม่?", a: "ถ้าไม่เรียก คอมไพเลอร์เรียก default constructor ของแม่ให้แทน — ค่าที่ควรส่งผ่าน (เช่นชื่อ) จะหายไป" },
        { q: "copy constructor ของคลาสลูกต้องทำอะไรเพิ่ม?", a: "ต้องเรียก copy constructor ของแม่ใน initialiser list (`: ClapTrap(o)`) และ operator= ต้องเรียก `ClapTrap::operator=(o)` ไม่งั้นส่วนของแม่ไม่ถูกก๊อป" },
        { q: "ทำไม HP เป็น `unsigned` แล้วอันตราย?", a: "ลบเกินจะวนกลับเป็นเลขบวกมหาศาลแทนที่จะติดลบ — หุ่นที่ควรตายกลับมีเลือด 4 พันล้าน. ต้องเช็ค `amount >= _hitPoints` แล้วตรึงที่ 0" },
        { q: "diamond problem คืออะไร?", a: "DiamondTrap สืบทอด ScavTrap และ FragTrap ที่ทั้งคู่สืบทอด ClapTrap → ได้ ClapTrap มา 2 ชุด → อ้าง member แล้ว ambiguous และ ctor/dtor ของฐานรัน 2 ครั้ง" },
        { q: "virtual inheritance แก้ได้ยังไง?", a: "เขียน `class ScavTrap : virtual public ClapTrap` ที่ทั้งสองสายกลาง → คลาสล่างสุดได้ ClapTrap ชุดเดียวที่ใช้ร่วมกัน สร้างครั้งเดียว ทำลายครั้งเดียว" },
        { q: "ใครสร้าง virtual base และรันลำดับไหน?", a: "คลาสล่างสุด (DiamondTrap) เป็นคนเรียก `ClapTrap(...)` เอง — ของที่ ScavTrap/FragTrap เขียนไว้ถูกเมิน. ลำดับ: ClapTrap → ScavTrap → FragTrap → DiamondTrap" },
        { q: "DiamondTrap มี `_name` 2 ตัว เข้าถึงยังไง?", a: "`_name` เฉย ๆ คือของ DiamondTrap; ของฐานต้องเขียน `ClapTrap::_name` เพราะตัวใกล้บังตัวไกล" },
        { q: "stat ของ DiamondTrap มาจากไหน?", a: "HP จาก FragTrap (100), EP จาก ScavTrap (50), AD จาก FragTrap (30), `attack()` จาก ScavTrap — และต้องเซ็ตเองในบอดี้ ไม่พึ่งลำดับ base" },
        { q: "ทำไม ClapTrap ควรมี virtual destructor?", a: "เพื่อให้ลบ object ผ่าน pointer ของคลาสแม่แล้ว destructor ของลูกถูกเรียกด้วย. ในโมดูลนี้ยังไม่ทำแบบนั้น แต่ Module 04 จะบังคับใช้จริง" },
      ]},
      { h: "ทดสอบก่อนส่ง" },
      { code: String.raw`# ex00: หุ่นตายแล้วต้องทำอะไรไม่ได้ และเลือดไม่วน
# takeDamage(100) จาก HP 10 → ต้องได้ 0 ไม่ใช่ 4294967206

# ex01/ex02: ลำดับ ctor/dtor ต้องเห็นชัด
./scavtrap    # ClapTrap ctor → ScavTrap ctor → ScavTrap dtor → ClapTrap dtor

# ex03: ClapTrap ต้องรันอย่างละครั้งเดียว
./diamondtrap | grep -c 'ClapTrap.*constructed'   # ต้องได้ 1
./diamondtrap | grep -c 'ClapTrap.*destructed'    # ต้องได้ 1

# ex03: whoAmI ต้องแสดง 2 ชื่อที่ต่างกัน
# "I am DiamondTrap Rex, and my ClapTrap name is Rex_clap_name!"

# ex03: stat ต้องเป็น 100 / 50 / 30`, lang: "bash" },
    ],
  },
});

/* ===================== CPP MODULE 04 ===================== */
window.TEACHING_DATA.push({
  id: "cpp_module_04",
  name: "CPP Module 04",
  tag: { th: "Polymorphism · abstract class · interface — ex00 virtual คืออะไร, ex01 Brain กับ deep copy และ virtual destructor, ex02 คลาสนามธรรม, ex03 interface + คลังไอเทม",
         en: "Polymorphism · abstract classes · interfaces — ex00 what virtual does, ex01 Brain, deep copy and the virtual destructor, ex02 abstract classes, ex03 interfaces + an inventory" },
  accent: "#6ab04c",
  sections: {
    principle: [
      { h: "Module 04 สอนอะไร" },
      { p: "โมดูลนี้คือหัวใจของ OOP ทั้งหมด: **เก็บของหลายชนิดไว้ในตัวแปรชนิดเดียว แล้วเรียกเมธอดเดียวกัน — แต่ละตัวทำงานคนละแบบตามชนิดจริงของมัน**. ทั้งโมดูลหมุนรอบคีย์เวิร์ดเดียวคือ `virtual` และ 2 กับดักที่มากับมันคือ **virtual destructor** และ **deep copy**" },
      { h: "แนวคิดเดียวที่ต้องเข้าใจ" },
      { code: String.raw`const Animal *j = new Dog();
j->makeSound();

  ชนิดที่ประกาศไว้ (static type)  = Animal*
  ชนิดของ object จริง (dynamic)   = Dog

  makeSound เป็น virtual     →  เรียกของ Dog   → "Woof!"
  makeSound ไม่เป็น virtual  →  เรียกของ Animal → เสียงกลาง ๆ`, cap: "virtual = ตัดสินใจตอนรันจากชนิดจริง; ไม่ virtual = ตัดสินใจตอนคอมไพล์จากชนิดที่ประกาศ", lang: "cpp" },
      { p: "ex00 ให้เขียนตระกูล `WrongAnimal` / `WrongCat` ที่เหมือนกันทุกอย่างยกเว้น**ไม่มี `virtual`** — เพื่อให้เห็นความต่างด้วยตาว่าคีย์เวิร์ดเดียวเปลี่ยนพฤติกรรมยังไง" },
      { h: "4 ข้อ" },
      { table: { head: ["ข้อ", "เพิ่มอะไร", "ประเด็นที่สอน"], rows: [
        ["ex00", "Animal/Dog/Cat + WrongAnimal/WrongCat", "`virtual` ทำอะไร และไม่ใส่แล้วเป็นยังไง"],
        ["ex01", "Brain + `Brain *` ใน Dog/Cat", "**virtual destructor** + **deep copy** (2 กับดักที่ถูกวัด)"],
        ["ex02", "ทำ Animal เป็น abstract", "pure virtual (`= 0`) → สร้าง object ของคลาสฐานไม่ได้"],
        ["ex03", "AMateria/Ice/Cure/Character/MateriaSource", "interface ใน C++98 + ความเป็นเจ้าของ pointer"],
      ]}},
      { h: "กฎเหล็ก" },
      { ul: [
        "ห้าม `printf` / `malloc` / `free` (0 คะแนน) · ห้าม `using namespace` / `friend` (-42)",
        "**ห้าม STL จนถึง Module 08** — คลังไอเทมของ ex03 จึงเป็น array ธรรมดา `AMateria *[4]` ไม่ใช่ `std::vector`",
        "OCF บังคับทุกคลาสที่สร้าง object ได้",
        "**ctor/dtor ของทุกคลาสต้องพิมพ์ข้อความ และห้ามซ้ำกันระหว่างคลาส** — เพื่อให้กรรมการเห็นการเรียกต่อกัน",
        "ex03 optional ตาม subject — แต่ interface + deep copy คือบทสรุปของโมดูล",
      ]},
    ],

    theory: [
      { h: "1) static type กับ dynamic type" },
      { table: { head: ["", "static type", "dynamic type"], rows: [
        ["คืออะไร", "ชนิดที่เขียนไว้ในโค้ด", "ชนิดของ object จริงตอนรัน"],
        ["ตัวอย่าง", "`Animal *j`  → Animal", "`new Dog()` → Dog"],
        ["ใครใช้", "คอมไพเลอร์ (ตรวจว่าเรียกอะไรได้)", "ตัวโปรแกรมตอนรัน (ตัดสินว่าเรียกตัวไหน)"],
      ]}},
      { p: "**เมธอดธรรมดา** ถูกเลือกตอนคอมไพล์จาก static type. **เมธอด `virtual`** ถูกเลือกตอนรันจาก dynamic type — นี่คือ subtype polymorphism ทั้งหมดในประโยคเดียว" },

      { h: "2) `virtual` ทำงานยังไงข้างใน" },
      { code: String.raw`คลาสที่มี virtual method จะได้ตารางแอบแฝงมา 1 ตาราง (vtable)
object แต่ละตัวเก็บ pointer ไปยังตารางของ "ชนิดจริง" ของมัน

  Animal vtable:  makeSound → Animal::makeSound
  Dog    vtable:  makeSound → Dog::makeSound
  Cat    vtable:  makeSound → Cat::makeSound

  Animal *j = new Dog();
  j->makeSound();
    → ดู vptr ของ object → เจอ Dog vtable → เรียก Dog::makeSound

ไม่มี virtual = ไม่มีตาราง คอมไพเลอร์ฝัง address ตายตัวตั้งแต่ตอนคอมไพล์
  → เห็นว่า j เป็น Animal* ก็เรียก Animal::makeSound จบ`, cap: "ไม่ต้องจำรายละเอียด vtable — จำแค่ว่า virtual = 'ถามตัว object ว่าเธอเป็นใคร' ก่อนเรียก", lang: "txt" },
      { note: "การเรียกแบบ virtual แพงกว่านิดหน่อย (ต้องอ้อมผ่านตาราง) — เป็นเหตุผลที่ C++ ไม่ทำให้ทุกเมธอด virtual โดยอัตโนมัติเหมือนบางภาษา" },

      { h: "3) pure virtual กับคลาสนามธรรม" },
      { code: String.raw`class AAnimal
{
    public:
        virtual void makeSound(void) const = 0;   // ← = 0 คือ pure virtual
        virtual ~AAnimal(void);                   // ★ ยังต้องมีตัวจริง
};

ผลที่ตามมา:
  AAnimal a;              // ✗ error: cannot declare variable to be of abstract type
  new AAnimal();          // ✗ เช่นกัน
  AAnimal *p = new Dog(); // ✓ ใช้เป็นชนิดของ pointer ได้ตามปกติ

คลาสนามธรรม "ยังมี" constructor/destructor/operator= ตามปกติ
  — pure virtual แค่บอกว่า "เมธอดนี้ไม่มีเนื้อ ลูกต้องเขียนเอง"`, cap: "abstract = แม่แบบที่สร้างของจริงไม่ได้ แต่บังคับให้ลูกทุกตัวมีเมธอดนี้", lang: "cpp" },
      { p: "ex02 ให้ทำ `Animal` เป็น abstract เพราะ *'สัตว์ลอย ๆ ไม่มีเสียง จึงไม่ควรสร้างได้'*. subject ชวนให้เปลี่ยนชื่อเป็น **`AAnimal`** (A = abstract) — ถ้าเปลี่ยนต้องเปลี่ยนชื่อไฟล์ include guard และ `: public Animal` ทุกจุดด้วย" },

      { h: "4) interface ใน C++98" },
      { p: "C++98 ไม่มีคีย์เวิร์ด `interface`. สิ่งที่ใช้แทนคือ **คลาสที่ทุกเมธอดเป็น pure virtual และมีแค่ destructor ที่มีเนื้อ**" },
      { code: String.raw`class ICharacter
{
    public:
        virtual ~ICharacter(void) {}                        // มีเนื้อ (ว่าง)
        virtual std::string const &getName(void) const = 0; // ทุกตัวที่เหลือ = 0
        virtual void equip(AMateria *m) = 0;
        virtual void unequip(int idx) = 0;
        virtual void use(int idx, ICharacter &target) = 0;
};`, cap: "subject ให้ interface มาแบบนี้เป๊ะ — ก๊อปตามนั้นรวมทั้งวงเล็บปีกกาว่างของ destructor", lang: "cpp" },
      { note: "destructor ของ interface ต้องมีเนื้อจริง (แม้จะว่าง) เพราะเวลาลบ object ผ่าน `ICharacter*` มันต้องมีอะไรให้เรียก. นี่เป็นข้อยกเว้นเดียวที่เขียนตัวฟังก์ชันใน header ได้ในโมดูลนี้" },

      { h: "🔬 เจาะลึก A: virtual destructor — บรรทัดเดียวที่สำคัญที่สุดของโมดูล" },
      { p: "ex01 ให้ Dog/Cat ถือ `Brain *` ที่ `new` ใน constructor และ `delete` ใน destructor. พอ subject เขียน `delete j;` โดยที่ `j` เป็น `Animal*` ที่ชี้ไปยัง Dog — คำถามคือ **destructor ตัวไหนถูกเรียก**" },
      { code: String.raw`Animal *j = new Dog();     // Dog ข้างในมี Brain ที่ new ไว้
delete j;

  ~Animal ไม่เป็น virtual:
    → เรียกแค่ ~Animal()
    → ~Dog() ไม่เคยทำงาน → delete brain ไม่เคยเกิด
    → Brain รั่วทุกครั้ง  ★ subject เขียนคอมเมนต์ไว้ว่า "should not create a leak"

  ~Animal เป็น virtual:
    → เรียก ~Dog() ก่อน (ลบ Brain)
    → แล้วไล่ต่อไป ~Animal()
    → สะอาด`, cap: "กฎทั่วไปของ C++: คลาสไหนตั้งใจให้ถูกสืบทอดและลบผ่าน pointer ของแม่ ต้องมี virtual destructor", lang: "cpp" },
      { code: String.raw`virtual ~Animal(void);      // ← ใส่ตั้งแต่ ex00 เลย

ทำไมใส่ตั้งแต่ ex00 ทั้งที่ยังไม่มี Brain:
  - ex00 ยังไม่มีอะไรให้รั่ว ใส่ไปก็ไม่เสียอะไร
  - พอ ex01 ก๊อปไฟล์มาต่อ มันทำงานถูกทันทีโดยไม่ต้องไล่แก้
  - เป็นนิสัยที่ถูกต้องอยู่แล้วสำหรับคลาสฐาน`, cap: "ต้นทุนของการใส่เผื่อ = 0 · ต้นทุนของการลืม = leak ที่หายาก", lang: "cpp" },
      { note: "วิธีเช็คเร็วที่สุด: รัน valgrind กับ main ที่ `delete` ผ่าน `Animal*` — ถ้า `virtual` หายไป valgrind จะรายงาน definitely lost ทันทีตามจำนวน Brain ที่สร้าง" },
      { qa: [
        { q: "ทำไม destructor ของคลาสฐานต้องเป็น virtual?", a: "เพราะเวลาลบ object ผ่าน pointer ของคลาสฐาน ถ้าไม่ virtual จะเรียกแค่ destructor ของฐาน — destructor ของลูกไม่ทำงาน ของที่ลูกจองไว้จึงรั่ว" },
        { q: "ไม่ virtual แล้ว Brain รั่วยังไง?", a: "`delete j;` ที่ j เป็น `Animal*` เรียกแค่ `~Animal()` → `~Dog()` ไม่ทำงาน → `delete brain` ไม่เกิด → Brain 1 ก้อนรั่วต่อ Dog 1 ตัว" },
        { q: "ต้องใส่ virtual ที่ destructor ของลูกด้วยไหม?", a: "ไม่ต้อง — ถ้าฐานเป็น virtual ลูกจะเป็น virtual โดยอัตโนมัติ. ใส่ก็ได้เพื่อความชัดเจน" },
      ]},

      { h: "🔬 เจาะลึก B: deep copy vs shallow copy — ทำไม default ถึงพัง" },
      { p: "`Dog` มี `Brain *brain;`. ถ้าปล่อยให้คอมไพเลอร์สร้าง copy constructor ให้ มันจะก๊อป **ค่าใน pointer** ซึ่งคือ address — ได้ Dog 2 ตัวที่ชี้ Brain ก้อนเดียวกัน" },
      { code: String.raw`shallow copy (คอมไพเลอร์สร้างให้):

   Dog a;              a.brain ──┐
   Dog b(a);                     ├──► [ Brain ]   ← ก้อนเดียว
                       b.brain ──┘

   ปัญหา 1: แก้ ideas ของ a → ของ b เปลี่ยนตาม (ไม่ใช่สำเนาจริง)
   ปัญหา 2: a ตาย → delete brain
            b ตาย → delete brain อีกครั้ง → double free → crash

deep copy (เราต้องเขียนเอง):

   Dog a;              a.brain ──► [ Brain #1 ]
   Dog b(a);           b.brain ──► [ Brain #2 ]   ← ก้อนใหม่ เนื้อหาเหมือนกัน`, cap: "นี่คือเหตุผลจริง ๆ ที่ 42 บังคับ OCF ตั้งแต่ Module 02 — พอคลาสมี pointer ตัวที่คอมไพเลอร์สร้างให้ใช้ไม่ได้", lang: "txt" },
      { code: String.raw`Dog::Dog(const Dog &o) : Animal(o)
{
    this->brain = new Brain(*o.brain);      // ★ ก้อนใหม่
}

Dog &Dog::operator=(const Dog &o)
{
    if (this != &o)
    {
        this->type = o.type;
        delete this->brain;                 // ★ ทิ้งของเก่าก่อน
        this->brain = new Brain(*o.brain);  // ★ แล้วสร้างใหม่
    }
    return (*this);
}`, cap: "operator= ต่างจาก copy ctor ตรงที่ 'มีของเก่าอยู่แล้ว' — ต้องลบก่อนสร้างใหม่ ไม่งั้นของเก่ารั่ว", lang: "cpp" },
      { p: "**ตรงนี้แหละที่ `if (this != &o)` ได้ใช้จริง:** ถ้าเขียน `a = a;` โดยไม่เช็ค → `delete this->brain` ลบ Brain ทิ้ง → แล้ว `new Brain(*o.brain)` อ่านจากของที่เพิ่งลบไป = use-after-free" },
      { note: "วิธีทดสอบว่า deep copy จริง: ก๊อป Dog แล้วแก้ `ideas[0]` ของตัวหนึ่ง — อีกตัวต้องไม่เปลี่ยน **และ** address ที่ `getBrain()` คืนมาต้องคนละค่า" },
      { qa: [
        { q: "shallow copy กับ deep copy ต่างกันยังไง?", a: "shallow ก๊อปค่าใน pointer (ได้ 2 ตัวชี้ก้อนเดียวกัน); deep จองก้อนใหม่แล้วก๊อปเนื้อหาลงไป (แยกกันสมบูรณ์)" },
        { q: "shallow copy ทำให้เกิดอะไร?", a: "แก้ตัวหนึ่งอีกตัวเปลี่ยนตาม และตอนทำลายทั้งคู่จะ `delete` ก้อนเดียวกัน 2 ครั้ง = double free crash" },
        { q: "ทำไม operator= ต้อง `delete` ก่อน `new`?", a: "เพราะ object ตัวซ้ายมี Brain ของตัวเองอยู่แล้ว — ถ้าเขียนทับ pointer เลย ก้อนเก่าจะรั่ว" },
        { q: "ทำไม `if (this != &o)` ถึงสำคัญตรงนี้?", a: "`a = a;` โดยไม่เช็คจะ `delete brain` แล้วอ่านจาก `*o.brain` ซึ่งคือก้อนที่เพิ่งลบ = use-after-free" },
      ]},

      { h: "🔬 เจาะลึก C: ความเป็นเจ้าของ pointer ใน ex03 — ใครลบใคร" },
      { p: "ex03 ไม่ได้ยากที่ตรรกะ แต่ยากที่ **การตกลงว่าใครเป็นเจ้าของ pointer ตัวไหน**. subject กำหนดกฎไว้ชัดเจน 3 ข้อ ซึ่งถ้าอ่านผ่านจะได้ทั้ง leak และ double free" },
      { table: { head: ["การกระทำ", "ใครเป็นเจ้าของหลังจากนั้น", "ต้องลบไหม"], rows: [
        ["`equip(m)` สำเร็จ", "Character", "ลบตอน Character ตาย"],
        ["`equip(m)` ตอนคลังเต็ม", "**ผู้เรียก** (ไม่มีอะไรเกิดขึ้น)", "Character **ไม่แตะ** m เลย"],
        ["`unequip(i)`", "**ผู้เรียก**", "Character **ห้ามลบ** — แค่ปล่อยช่องว่าง"],
        ["`learnMateria(m)`", "MateriaSource", "ลบตอน source ตาย; ถ้าเต็ม `delete m` ทิ้ง"],
        ["`createMateria(t)`", "ผู้เรียก", "คืน `clone()` ก้อนใหม่ทุกครั้ง"],
      ]}},
      { note: "`unequip` ที่ไม่ลบคือจุดที่ subject ย้ำ — ของที่ถอดออกยังอยู่ในโลก ผู้เรียกต้องรับไปดูแลเอง. เขียน `delete` ตรงนี้เมื่อไหร่คือ double free ทันทีถ้าผู้เรียกลบซ้ำ" },
      { code: String.raw`AMateria *Ice::clone(void) const
{
    return (new Ice(*this));       // สร้างตัวใหม่ "ชนิดเดียวกับตัวเอง"
}`, cap: "clone คือวิธี 'ก๊อป object โดยไม่รู้ว่ามันเป็นชนิดอะไร' — ผู้เรียกถือแค่ AMateria* ก็ก๊อปได้ถูกชนิด", lang: "cpp" },
      { p: "**ทำไมต้องมี `clone()` ทั้งที่มี copy constructor แล้ว:** copy constructor ต้องรู้ชนิดตอนคอมไพล์ (`Ice b(a);`). แต่ `MateriaSource` ถือแค่ `AMateria *templates[4]` — มันไม่รู้ว่าแต่ละช่องเป็น Ice หรือ Cure. `clone()` เป็น virtual จึงถามตัว object ให้ก๊อปตัวเองได้" },
      { note: "**`operator=` ของ AMateria ห้ามก๊อป `type`** — subject บอกว่า 'การก๊อป type ตอน assign ไม่มีความหมาย' เพราะชนิดถูกกำหนดตายตัวตอนสร้างโดยคลาสลูก" },
      { qa: [
        { q: "ทำไมต้องมี `clone()` ทั้งที่มี copy constructor?", a: "copy constructor ต้องรู้ชนิดจริงตอนคอมไพล์ แต่โค้ดที่ถือแค่ `AMateria*` ไม่รู้. `clone()` เป็น virtual จึงให้ object ก๊อปตัวเองได้ถูกชนิดโดยผู้เรียกไม่ต้องรู้" },
        { q: "`unequip` ต้องลบ Materia ไหม?", a: "ไม่ — subject ห้ามชัดเจน. แค่ตั้งช่องเป็น NULL แล้วผู้เรียกรับ pointer นั้นไปดูแลต่อ" },
        { q: "`equip` ตอนคลังเต็มต้องทำอะไร?", a: "ไม่ทำอะไรเลย และ **ห้ามลบ** m ด้วย — ผู้เรียกยังเป็นเจ้าของอยู่" },
        { q: "`createMateria` เจอ type ที่ไม่รู้จักคืนอะไร?", a: "คืน 0 (NULL) — ผู้เรียกต้องเช็คก่อนใช้" },
      ]},

      { h: "🔬 เจาะลึก D: circular include — แก้ด้วย forward declaration" },
      { p: "`AMateria::use(ICharacter&)` ต้องรู้จัก `ICharacter` และ `ICharacter::equip(AMateria*)` ต้องรู้จัก `AMateria` — ถ้าต่างฝ่ายต่าง `#include` กันจะวนไม่จบ" },
      { code: String.raw`// AMateria.hpp
#ifndef AMATERIA_HPP
# define AMATERIA_HPP
# include <string>

class ICharacter;        // ★ forward declaration — พอสำหรับ pointer/reference

class AMateria
{
    protected:
        std::string type;
    public:
        virtual void use(ICharacter &target);   // ใช้ได้เพราะเป็น reference
        virtual AMateria *clone(void) const = 0;
};
#endif

// AMateria.cpp
#include "AMateria.hpp"
#include "ICharacter.hpp"      // ★ ตรงนี้ต้องรู้ทั้งตัว เพราะจะเรียก getName()`, cap: "กฎง่าย ๆ: pointer/reference ต้องการแค่ forward declaration; การเรียกเมธอดต้องการ include เต็ม", lang: "cpp" },
      { p: "**ทำไม forward declaration ก็พอ:** คอมไพเลอร์รู้ขนาดของ pointer/reference อยู่แล้ว (เท่ากันหมดทุกชนิด) ไม่ต้องรู้ว่าข้างในมีอะไร. จะรู้ทั้งตัวก็ต่อเมื่อจะเรียกเมธอดหรือประกาศเป็น member แบบ by value" },
      { qa: [
        { q: "circular include เกิดจากอะไร แก้ยังไง?", a: "2 header include กันไปกลับ. แก้ด้วย forward declaration (`class ICharacter;`) ใน header แล้วค่อย `#include` ตัวจริงใน `.cpp`" },
        { q: "forward declaration ใช้ได้กับอะไรบ้าง?", a: "pointer และ reference ของชนิดนั้น — เพราะคอมไพเลอร์ไม่ต้องรู้โครงสร้างข้างใน. ถ้าจะเรียกเมธอดหรือเก็บเป็น member แบบ by value ต้อง include เต็ม" },
      ]},

      { h: "📖 อ่านเพิ่มเติม" },
      { links: [
        { label: "cppreference — virtual function", url: "https://en.cppreference.com/w/cpp/language/virtual", note: "การเรียกแบบ virtual + pure virtual" },
        { label: "cppreference — Abstract class", url: "https://en.cppreference.com/w/cpp/language/abstract_class", note: "`= 0` ทำให้คลาสสร้างไม่ได้" },
        { label: "cppreference — Destructor", url: "https://en.cppreference.com/w/cpp/language/destructor", note: "ทำไมคลาสฐานต้อง virtual destructor" },
        { label: "learncpp — Virtual destructors", url: "https://www.learncpp.com/cpp-tutorial/virtual-destructors-virtual-assignment-and-overriding-virtualization/", note: "อธิบายพร้อมตัวอย่าง leak" },
        { label: "learncpp — Shallow vs deep copying", url: "https://www.learncpp.com/cpp-tutorial/shallow-vs-deep-copying/", note: "ที่มาของ double free" },
      ]},
    ],

    foundations: [
      { h: "ex00 — Animal / Dog / Cat และคู่ที่ 'ผิด'" },
      { code: String.raw`class Animal
{
    protected:
        std::string type;

    public:
        Animal(void);
        Animal(const Animal &other);
        Animal &operator=(const Animal &other);
        virtual ~Animal(void);                      // ★ virtual ตั้งแต่ ex00

        virtual void makeSound(void) const;         // ★ virtual
        const std::string &getType(void) const;
};

class WrongAnimal
{
    /* เหมือนกันทุกอย่าง ยกเว้น: */
    ~WrongAnimal(void);                 // ไม่ virtual
    void makeSound(void) const;         // ไม่ virtual  ← จุดของบทเรียน
};`, cap: "2 ตระกูลนี้ต่างกันแค่คีย์เวิร์ด `virtual` — เพื่อให้เห็นผลด้วยตาว่ามันเปลี่ยนอะไร", lang: "cpp" },
      { p: "`Dog`/`Cat` ตั้งค่า `type` **ในบอดี้ของ constructor** ไม่ใช่ใน initialiser list — เพราะ constructor ของ `Animal` รันก่อนแล้วตั้งค่าเริ่มต้นไว้ ลูกจึงมาเขียนทับทีหลัง" },

      { h: "ex01 — Brain และ Dog ที่มี pointer" },
      { code: String.raw`class Brain
{
    private:
        std::string ideas[100];     // array by value — Brain เองไม่ได้จองอะไร
    public:
        /* OCF ครบ */
        void setIdea(int i, const std::string &idea);
        std::string getIdea(int i) const;
};

class Dog : public Animal
{
    private:
        Brain *brain;               // ★ pointer → ต้อง deep copy
    public:
        Dog(void);                  // brain = new Brain();
        Dog(const Dog &other);      // brain = new Brain(*other.brain);
        Dog &operator=(const Dog &other);
        ~Dog(void);                 // delete brain;

        void makeSound(void) const;
        Brain *getBrain(void) const;   // ไว้พิสูจน์ว่า address คนละก้อน
};`, cap: "Brain เก็บ array แบบ by value จึงก๊อปตัวเองได้ด้วย copy ธรรมดา — ที่ต้องระวังคือ Dog ที่ถือ pointer ไป Brain", lang: "cpp" },

      { h: "ex03 — 5 คลาสกับ 2 interface" },
      { code: String.raw`ICharacter (interface)          IMateriaSource (interface)
      ▲                                ▲
      │                                │
  Character                       MateriaSource
  AMateria *inventory[4]          AMateria *templates[4]

AMateria (abstract: clone() = 0)
      ▲
   ┌──┴──┐
  Ice   Cure     ← clone() คืน new Ice(*this) / new Cure(*this)`, cap: "interface บอก 'ต้องทำอะไรได้'; abstract class ให้ 'ของที่ใช้ร่วมกัน' มาด้วย (type + getType)", lang: "txt" },
      { p: "**ทำไม `AMateria` เป็น abstract class ไม่ใช่ interface:** เพราะมันมีของจริงให้ลูกใช้ร่วมกัน (`std::string type;` และ `getType()`) — interface แท้ ๆ จะมีแต่ pure virtual ล้วน" },
    ],

    architecture: [
      { h: "ไฟล์ในแต่ละข้อ (แต่ละโฟลเดอร์สมบูรณ์ในตัว)" },
      { table: { head: ["ข้อ", "คลาส", "วิธีทำ"], rows: [
        ["ex00", "Animal, Dog, Cat, WrongAnimal, WrongCat", "เขียนใหม่; ใส่ `virtual ~Animal()` ตั้งแต่ตอนนี้"],
        ["ex01", "+ Brain, Dog/Cat ถือ `Brain *`", "ก๊อป ex00 มา → เพิ่ม Brain → ทำ deep copy"],
        ["ex02", "Animal → AAnimal (abstract)", "ก๊อป ex01 มา → `makeSound() const = 0` → เปลี่ยนชื่อ"],
        ["ex03", "AMateria, Ice, Cure, Character, MateriaSource, 2 interface", "เขียนใหม่ (คนละโจทย์)"],
      ]}},
      { h: "ผลลัพธ์ที่ต้องเห็นใน ex00" },
      { code: String.raw`const Animal *meta = new Animal();
const Animal *j    = new Dog();
const Animal *i    = new Cat();

i->makeSound();       // เสียงแมว     ← virtual → ตามชนิดจริง
j->makeSound();       // เสียงหมา
meta->makeSound();    // เสียงกลาง ๆ

const WrongAnimal *w = new WrongCat();
w->makeSound();       // เสียงของ WrongAnimal!  ← ไม่ virtual → ตามชนิดที่ประกาศ
                      //   ทั้งที่ object จริงเป็น WrongCat`, cap: "บรรทัดสุดท้ายคือทั้งหมดที่ ex00 อยากให้เห็น", lang: "cpp" },
      { h: "ผลลัพธ์ที่ต้องเห็นใน ex02" },
      { code: String.raw`AAnimal a;              // ✗ ต้องคอมไพล์ไม่ผ่าน
new AAnimal();          // ✗ เช่นกัน

  error: cannot declare variable 'a' to be of abstract type 'AAnimal'

→ "คอมไพล์ไม่ผ่าน" คือผลลัพธ์ที่ถูกต้องของ ex02
   ไม่ใช่ความล้มเหลว — เอาไว้โชว์กรรมการได้เลย`, cap: "ข้อนี้พิสูจน์ตัวเองด้วย compile error ไม่ใช่ด้วย output", lang: "txt" },
    ],

    dataflow: [
      { h: "ex01 — ไล่ว่าอะไรรั่วถ้าลืม virtual" },
      { code: String.raw`Animal *animals[4];
animals[0] = new Dog();     // Dog ctor → new Brain
animals[1] = new Dog();
animals[2] = new Cat();     // Cat ctor → new Brain
animals[3] = new Cat();

for (int k = 0; k < 4; k++)
    delete animals[k];      // ลบผ่าน Animal*

  มี virtual ~Animal:
    ~Dog → delete brain → ~Animal      (× 4)
    valgrind: 0 leak

  ไม่มี virtual ~Animal:
    ~Animal เท่านั้น                    (× 4)
    valgrind: definitely lost 4 blocks  ← Brain 4 ก้อน`, cap: "การทดสอบนี้คือสิ่งที่ subject ออกแบบมาให้เจอ — ต้องรันใต้ valgrind ถึงจะเห็น", lang: "cpp" },

      { h: "ex01 — พิสูจน์ deep copy" },
      { code: String.raw`Dog a;
a.getBrain()->setIdea(0, "bone");

Dog b(a);                              // copy constructor
b.getBrain()->setIdea(0, "cat");       // แก้ของ b

std::cout << a.getBrain()->getIdea(0); // ต้องได้ "bone"  ← ไม่เปลี่ยนตาม
std::cout << b.getBrain()->getIdea(0); // "cat"
std::cout << (a.getBrain() != b.getBrain());  // ต้องได้ 1 (คนละ address)`, cap: "2 เงื่อนไขที่ต้องผ่านพร้อมกัน: เนื้อหาไม่กระทบกัน และ address ต่างกัน", lang: "cpp" },

      { h: "ex03 — ไล่ตาม main ของ subject" },
      { code: String.raw`IMateriaSource *src = new MateriaSource();
src->learnMateria(new Ice());      // source เป็นเจ้าของ template แล้ว
src->learnMateria(new Cure());

ICharacter *me = new Character("me");
AMateria *tmp;

tmp = src->createMateria("ice");   // clone ก้อนใหม่ → ผู้เรียกถือ
me->equip(tmp);                    // ส่งต่อความเป็นเจ้าของให้ Character
tmp = src->createMateria("cure");
me->equip(tmp);

ICharacter *bob = new Character("bob");
me->use(0, *bob);   // * shoots an ice bolt at bob *
me->use(1, *bob);   // * heals bob's wounds *

delete bob;
delete me;      // Character dtor ลบ materia ในคลังทุกช่อง
delete src;     // MateriaSource dtor ลบ template ทุกช่อง`, cap: "ทุก new มีเจ้าภาพชัดเจน — นี่คือสิ่งที่ ex03 วัดจริง ๆ", lang: "cpp" },
      { code: String.raw`เคสที่ต้องไม่พัง (subject บอกว่า "ไม่ต้องเกิดอะไร แต่ห้ามบั๊ก"):

  me->use(-1, *bob);      // index ติดลบ  → ไม่ทำอะไร
  me->use(9, *bob);       // index เกิน   → ไม่ทำอะไร
  me->use(2, *bob);       // ช่องว่าง     → ไม่ทำอะไร
  me->unequip(3);         // ช่องว่าง     → ไม่ทำอะไร

  Character full;
  for (int k = 0; k < 5; k++) full.equip(new Ice());
                          // ตัวที่ 5 ไม่มีที่ → ห้ามลบ ห้ามเขียนทับ
                          // (ตัวที่ 5 นี้จะรั่วในเทสของ subject เอง — ปกติ)`, cap: "เช็คขอบเขตทุกจุดที่รับ index จากภายนอก", lang: "cpp" },
    ],

    implementation: [
      { h: "ลำดับการลงมือเขียน" },
      { ul: [
        "1. **ex00** — Animal/Dog/Cat ก่อน (ใส่ `virtual ~Animal()` เลย) แล้วค่อยก๊อปเป็น WrongAnimal/WrongCat ที่ถอด `virtual` ออก",
        "2. **ex01** — ก๊อป ex00 มา → Brain → ให้ Dog/Cat ถือ `Brain*` → เขียน deep copy → **รัน valgrind**",
        "3. **ex02** — ก๊อป ex01 มา → `= 0` ที่ makeSound → เปลี่ยนชื่อเป็น AAnimal → ทดสอบว่า `AAnimal a;` คอมไพล์ไม่ผ่าน",
        "4. **ex03** — ก๊อป 2 interface จาก subject ตามตัวอักษร → AMateria/Ice/Cure → Character → MateriaSource",
      ]},
      { h: "บั๊กยอดฮิตและวิธีกัน" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้"], rows: [
        ["valgrind ฟ้อง leak ใน ex01", "`~Animal` ไม่เป็น virtual", "`virtual ~Animal(void);`"],
        ["double free / crash ตอนก๊อป", "shallow copy ของ `Brain*`", "copy ctor + operator= ต้อง `new Brain(*o.brain)`"],
        ["ก๊อปแล้วแก้ตัวหนึ่ง อีกตัวเปลี่ยนตาม", "เหมือนข้างบน", "เหมือนข้างบน"],
        ["Brain เก่ารั่วตอน assign", "เขียนทับ pointer โดยไม่ลบของเก่า", "`delete brain;` ก่อน `new`"],
        ["use-after-free ตอน `a = a`", "ไม่เช็ค self-assignment", "`if (this != &o)`"],
        ["WrongCat ส่งเสียง WrongAnimal", "**ถูกต้องแล้ว**", "นี่คือผลที่ ex00 ต้องการให้เห็น"],
        ["`cannot declare variable to be of abstract type`", "**ถูกต้องแล้ว** (ex02)", "นี่คือผลลัพธ์ที่ผ่าน"],
        ["include วนไม่จบใน ex03", "2 header include กัน", "forward declaration ใน `.hpp`, include จริงใน `.cpp`"],
        ["double free ใน ex03", "`unequip` ไปลบ Materia", "`unequip` ห้ามลบ — แค่ตั้งช่องเป็น NULL"],
      ]}},
      { h: "build / test" },
      { code: String.raw`cd ex01 && make re && valgrind --leak-check=full --error-exitcode=42 -q ./animal

# บน Windows ผ่าน WSL
wsl --exec bash -lc 'cd "/mnt/d/Projects/42/CPP Module 04/ex01" && make re && valgrind -q --leak-check=full ./animal'

# ex02: ยืนยันว่าคลาสนามธรรมสร้างไม่ได้ (คาดหวังให้ FAIL)
echo 'int main(){ AAnimal a; }' > /tmp/t.cpp
c++ -std=c++98 -I. /tmp/t.cpp 2>&1 | grep -q 'abstract' && echo "ผ่าน: สร้างไม่ได้จริง"

# ของต้องห้าม
grep -rnE 'printf|[mc]alloc|free\(|using namespace|friend|vector|<algorithm>' ex0*/*.cpp ex0*/*.hpp`, lang: "bash" },
      { note: "โมดูลนี้ **ต้องรัน valgrind** ทุกข้อที่มี `new` — บั๊กหลักของโมดูล (virtual dtor, deep copy) มองด้วยตาไม่เห็น เห็นได้จาก valgrind อย่างเดียว" },
    ],

    tricks: [
      { h: "ทริค 1: ใส่ `virtual ~Base()` ตั้งแต่ยังไม่จำเป็น" },
      { p: "ex00 ยังไม่มีอะไรให้รั่ว แต่ใส่ไว้เลย — พอ ex01 ก๊อปไฟล์มาเพิ่ม Brain มันทำงานถูกทันที ไม่ต้องไล่ debug leak ทีหลัง" },
      { h: "ทริค 2: มี pointer เป็น member = ต้องเขียน OCF เอง" },
      { p: "กฎง่าย ๆ: คลาสไหนมี raw pointer ที่ตัวเองจอง ตัวที่คอมไพเลอร์สร้างให้ใช้ไม่ได้ทันที — ต้องเขียน copy ctor / operator= / dtor เองทั้ง 3 ตัว (rule of three)" },
      { h: "ทริค 3: พิสูจน์ deep copy ด้วย address" },
      { p: "ทำ `getBrain()` ไว้ตั้งแต่แรกแล้วเทียบ address 2 ตัว — เร็วและชัดกว่าไล่เทียบเนื้อหาทีละ idea" },
      { h: "ทริค 4: compile error คือผลลัพธ์ที่ผ่านใน ex02" },
      { p: "เตรียมไฟล์ทดสอบสั้น ๆ ที่เขียน `AAnimal a;` ไว้โชว์กรรมการ — มันต้องคอมไพล์ไม่ผ่าน นั่นคือหลักฐานว่า abstract ทำงาน" },
      { h: "ทริค 5: forward declare ใน header, include ใน cpp" },
      { p: "เป็นกฎทั่วไปที่ใช้ได้ตลอด ไม่ใช่แค่แก้ circular include — header ที่ include น้อยลง = คอมไพล์เร็วขึ้นและพันกันน้อยลง" },
      { h: "ทริค 6: เขียนตารางความเป็นเจ้าของก่อนเขียน ex03" },
      { p: "จดไว้ก่อนว่า equip/unequip/learnMateria/createMateria ใครเป็นเจ้าของ pointer หลังเรียก — แล้วโค้ดจะเขียนตามตารางนั้นได้เลย ไม่ต้องเดา" },
      { h: "ทริค 7: valgrind ทุกครั้งที่ทำเสร็จ ไม่ใช่ตอนท้าย" },
      { p: "ทุกบั๊กสำคัญของโมดูลนี้ไม่แสดงอาการตอนรันปกติ — โปรแกรมรันผ่านสวย ๆ ทั้งที่รั่ว. รัน valgrind ทีละข้อจะรู้ทันทีว่าพลาดตรงไหน" },
    ],

    eval: [
      { qa: [
        { q: "polymorphism คืออะไร?", a: "การเรียกเมธอดเดียวกันผ่านตัวแปรชนิดฐาน แล้วได้พฤติกรรมตามชนิดจริงของ object — ทำได้เพราะเมธอดนั้นเป็น `virtual`" },
        { q: "`virtual` ทำอะไร?", a: "ทำให้การเลือกเมธอดเกิดตอนรันจาก dynamic type แทนที่จะเกิดตอนคอมไพล์จาก static type. ภายในใช้ตาราง (vtable) ที่ object แต่ละตัวชี้ไป" },
        { q: "WrongAnimal/WrongCat มีไว้ทำไม?", a: "เพื่อโชว์ผลของการ **ไม่** ใส่ virtual — `WrongAnimal*` ที่ชี้ไป WrongCat จะเรียก makeSound ของ WrongAnimal เพราะเลือกจากชนิดที่ประกาศ" },
        { q: "ทำไม destructor ของคลาสฐานต้อง virtual?", a: "เพราะ `delete` ผ่าน pointer ของฐานจะเรียกแค่ destructor ของฐาน — ของลูกไม่ทำงาน ทำให้สิ่งที่ลูกจองไว้ (เช่น Brain) รั่ว" },
        { q: "deep copy กับ shallow copy ต่างกันยังไง?", a: "shallow ก๊อป pointer (2 object ชี้ก้อนเดียวกัน → double free); deep จองก้อนใหม่แล้วก๊อปเนื้อหา (แยกกันจริง)" },
        { q: "operator= ของคลาสที่มี pointer ต้องทำอะไรบ้าง?", a: "เช็ค self-assignment → ลบของเก่า → จองใหม่แล้วก๊อปเนื้อหา → คืน `*this`. ข้ามขั้นไหนก็เป็น leak หรือ use-after-free" },
        { q: "pure virtual (`= 0`) ทำอะไร?", a: "ทำให้เมธอดไม่มีเนื้อและทำให้คลาสเป็น abstract — สร้าง object ของคลาสนั้นตรง ๆ ไม่ได้ ใช้เป็นชนิดของ pointer/reference ได้" },
        { q: "abstract class ยังมี constructor ไหม?", a: "มี — และต้องมีตาม OCF ด้วย. คลาสลูกเรียกมันตอนสร้าง; ที่สร้างไม่ได้คือ object ของคลาส abstract เองเท่านั้น" },
        { q: "interface ใน C++98 ทำยังไง?", a: "ใช้คลาสที่ทุกเมธอดเป็น pure virtual และมีแค่ virtual destructor ที่มีเนื้อ (มักเป็นเนื้อว่าง) — C++98 ไม่มีคีย์เวิร์ด interface" },
        { q: "ทำไม `AMateria` ต้องมี `clone()`?", a: "เพราะโค้ดที่ถือแค่ `AMateria*` ไม่รู้ชนิดจริง จึงเรียก copy constructor ไม่ได้. `clone()` เป็น virtual ให้ object ก๊อปตัวเองได้ถูกชนิด" },
        { q: "`unequip` ต้องลบ Materia ไหม?", a: "ไม่ — subject ห้ามชัดเจน. ตั้งช่องเป็น NULL แล้วผู้เรียกรับ pointer ไปดูแลต่อ" },
        { q: "`learnMateria` เป็นเจ้าของ pointer ไหม?", a: "ใช่ — MateriaSource ลบ template ทั้งหมดตอนตาย. ถ้าช่องเต็มต้อง `delete` ตัวที่รับมาไม่งั้นรั่ว" },
        { q: "circular include แก้ยังไง?", a: "forward declaration (`class ICharacter;`) ใน header เพราะใช้แค่ pointer/reference แล้ว `#include` ตัวเต็มใน `.cpp` ที่ต้องเรียกเมธอดจริง" },
        { q: "ทำไมคลังไอเทมเป็น array ไม่ใช่ `std::vector`?", a: "เพราะ 42 ห้าม STL container จนถึง Module 08 — ต้องใช้ `AMateria *inventory[4]` ธรรมดา" },
      ]},
      { h: "ทดสอบก่อนส่ง" },
      { code: String.raw`# ex00: WrongCat ต้องส่งเสียงของ WrongAnimal (นี่คือผลที่ถูก)
./animal

# ex01: ต้อง 0 leak เมื่อลบผ่าน Animal*
valgrind --leak-check=full --error-exitcode=42 -q ./animal && echo "ผ่าน"

# ex01: deep copy — address ต้องต่างกัน และเนื้อหาต้องไม่กระทบกัน
# a.getBrain() != b.getBrain()

# ex02: ต้องคอมไพล์ไม่ผ่าน
# error: cannot declare variable to be of abstract type 'AAnimal'

# ex03: ตาม main ของ subject + เคสขอบ
# use(-1) / use(9) / ช่องว่าง / คลังเต็ม → ต้องไม่ crash
valgrind --leak-check=full -q ./materia`, lang: "bash" },
    ],
  },
});

/* ===================== CPP MODULE 05 ===================== */
window.TEACHING_DATA.push({
  id: "cpp_module_05",
  name: "CPP Module 05",
  tag: { th: "Exception · ระบบราชการจำลอง — ex00 Bureaucrat กับเกรดกลับหัว, ex01 Form, ex02 AForm นามธรรม + 3 ฟอร์ม, ex03 Intern ที่ห้ามใช้ if/else ต่อกัน",
         en: "Exceptions · a bureaucracy simulator — ex00 Bureaucrat and the inverted grade scale, ex01 Form, ex02 abstract AForm + 3 concrete forms, ex03 the Intern with no if/else chain" },
  accent: "#e056fd",
  sections: {
    principle: [
      { h: "Module 05 สอนอะไร" },
      { p: "โมดูลนี้สอน **exception** — วิธีบอกว่า 'ทำไม่ได้' จากที่ที่คืนค่าไม่ได้ (constructor) ไปยังคนที่รับมือไหว. ธีมเป็นระบบราชการ: ข้าราชการมีเกรด ฟอร์มต้องมีคนเซ็นและคนสั่งทำงาน — ทุกจุดที่เกรดไม่พอจะ **โยน** ไม่ใช่ **คืน error code**" },
      { h: "ทำไมต้อง exception ไม่ใช้ return code" },
      { code: String.raw`Bureaucrat b("bob", 0);      // เกรด 0 ไม่มีอยู่จริง

  constructor คืนค่าไม่ได้ → ส่ง error code ออกมาไม่ได้เลย
  ทางเลือกมีแค่:
    (ก) ปล่อยให้สร้างสำเร็จแล้วตั้ง flag "ฉันพัง" → ทุกเมธอดต้องเช็ค flag
    (ข) throw → object นี้ไม่เคยเกิดขึ้นเลย  ★ นี่คือที่โมดูลนี้สอน

throw ในตัวสร้าง = "สร้างไม่สำเร็จ" อย่างแท้จริง
  - object ไม่ถูกสร้าง → destructor ไม่ทำงาน
  - member ที่สร้างเสร็จแล้ว (เช่น const std::string _name) ถูกเก็บกวาดปกติ`, cap: "การโยนจากตัวสร้างคือหัวใจของข้อ ex00 — ไม่ใช่ลูกเล่น แต่เป็นทางเดียวที่ทำได้", lang: "cpp" },
      { h: "4 ข้อ" },
      { table: { head: ["ข้อ", "เพิ่มอะไร", "ประเด็นที่สอน"], rows: [
        ["ex00", "Bureaucrat + 2 exception ซ้อนในคลาส", "โยนจาก constructor · เกรดกลับหัว · `const` member กับ OCF"],
        ["ex01", "Form + beSigned + signForm", "ใครจับ exception (Bureaucrat จับเอง ไม่ปล่อยถึง main)"],
        ["ex02", "Form → AForm นามธรรม + 3 ฟอร์มจริง", "**เช็คที่ฐาน ลงมือที่ลูก** (template method)"],
        ["ex03", "Intern::makeForm", "หาแบบตารางแทน if/else ที่ subject ห้ามไว้"],
      ]}},
      { h: "กฎเหล็ก" },
      { ul: [
        "ห้าม `printf` / `malloc` / `free` (0 คะแนน) · ห้าม `using namespace` / `friend` (-42)",
        "**OCF บังคับทุกคลาส — ยกเว้นคลาส exception** subject เขียนไว้ตรง ๆ ว่า exception ไม่ต้องทำ OCF",
        "ห้าม STL container (ไม่จำเป็นอยู่แล้วในโมดูลนี้)",
        "**ไม่มี norminette ใน CPP** — `for`, ternary, ฟังก์ชันยาวเกิน 25 บรรทัดใช้ได้หมด",
        "ห้ามเขียนตัวฟังก์ชันใน header (ยกเว้น template)",
      ]},
      { note: "โมดูลนี้ต่อยอดกันเป็นทอด ๆ — ex01 ใช้ Bureaucrat ของ ex00, ex02 ใช้ของ ex01 แล้วเปลี่ยนชื่อ Form เป็น AForm, ex03 ใช้ของ ex02 แล้วเติม Intern. **ก๊อปโฟลเดอร์เดิมมาต่อ อย่าเขียนใหม่**" },
    ],

    theory: [
      { h: "1) เกรดกลับหัว — ตรงนี้พังกันมากที่สุด" },
      { p: "**เกรด 1 คือสูงสุด, 150 คือต่ำสุด.** ทุกเครื่องหมายเปรียบเทียบในโมดูลนี้จึงกลับด้านจากสัญชาตญาณ" },
      { table: { head: ["สถานการณ์", "เงื่อนไข", "โยนอะไร"], rows: [
        ["สร้าง/ตั้งค่าเกรดเกินเพดาน", "`grade < 1`", "`GradeTooHighException`"],
        ["สร้าง/ตั้งค่าเกรดต่ำกว่าพื้น", "`grade > 150`", "`GradeTooLowException`"],
        ["`incrementGrade()` (เกรดดีขึ้น เลขลดลง)", "`grade - 1 < 1`", "`GradeTooHighException`"],
        ["`decrementGrade()` (เกรดแย่ลง เลขเพิ่มขึ้น)", "`grade + 1 > 150`", "`GradeTooLowException`"],
        ["เซ็นฟอร์มได้ไหม", "เซ็นได้ถ้า `g <= form.gradeToSign`", "ไม่พอ → `GradeTooLowException`"],
      ]}},
      { p: "จำประโยคเดียวพอ: *'increment เกรด 3 แล้วต้องได้เกรด 2'* — เกรดดีขึ้น **ตัวเลขลดลง**" },
      { note: "ถ้าเทสโยน exception ผิดตัว 90% คือเทียบกับขอบผิดด้าน — กลับมาอ่านตารางนี้ก่อนไล่โค้ด" },

      { h: "2) exception class ที่ถูกต้องใน C++98" },
      { code: String.raw`class Bureaucrat
{
    public:
        class GradeTooHighException : public std::exception
        {
            public:
                virtual const char *what() const throw();
        };
        class GradeTooLowException : public std::exception
        {
            public:
                virtual const char *what() const throw();
        };
};

เรียกใช้:  throw Bureaucrat::GradeTooHighException();
จับ:      catch (std::exception &e) { std::cout << e.what(); }`, cap: "ประกาศซ้อนในคลาส เพื่อให้ชื่อบอกที่มาว่ามาจาก Bureaucrat", lang: "cpp" },
      { p: "**`const throw()` ห้ามหาย** — signature ต้องตรงกับ `std::exception::what()` เป๊ะ ไม่งั้นได้ error *'looser throw specifier for virtual ... what()'*. `throw()` คือคำสัญญาแบบ C++98 ว่า 'ฟังก์ชันนี้ไม่โยนอะไรออกมา' (C++11 ขึ้นไปเปลี่ยนเป็น `noexcept` แต่โมดูลนี้ใช้ C++98)" },
      { p: "**จับด้วย reference เสมอ** (`catch (std::exception &e)`) — ถ้าจับ by value object ที่โยนมาจะถูกก๊อปแบบตัดส่วน (object slicing) เหลือแต่ส่วนของ `std::exception` และ `what()` จะคืนข้อความของฐานแทนของจริง" },

      { h: "3) throw / try / catch ไหลยังไง" },
      { code: String.raw`try
{
    Bureaucrat b("bob", 0);      // ← throw ตรงนี้
    std::cout << b;              // ← ข้ามไปเลย ไม่รัน
}
catch (std::exception &e)
{
    std::cout << e.what();       // ← กระโดดมาที่นี่
}
// ← แล้วไปต่อบรรทัดนี้

ระหว่างกระโดด (stack unwinding):
  object ที่สร้างเสร็จแล้วใน scope ถูกทำลายตามลำดับย้อนกลับ
  → destructor ทำงานครบ → ของที่จองด้วย new แต่ยังไม่ delete ยังรั่วอยู่ดี`, cap: "exception ทำลาย object บน stack ให้ แต่ไม่ลบของบน heap ให้ — ex03 ต้องระวังตรงนี้", lang: "cpp" },

      { h: "🔬 เจาะลึก A: `const` member ปะทะ OCF" },
      { p: "`Bureaucrat` มี `const std::string _name;` และ `AForm` มี `const` ทั้งชื่อและเกรด 2 ตัว. แต่ OCF บังคับให้มี `operator=` — ซึ่ง**เขียนทับ `const` member ไม่ได้**" },
      { code: String.raw`Bureaucrat &Bureaucrat::operator=(const Bureaucrat &other)
{
    if (this != &other)
        this->_grade = other._grade;   // ★ ก๊อปเฉพาะตัวที่ไม่ const
    return (*this);                    //   _name ปล่อยไว้เฉย ๆ
}`, cap: "ทางออกที่กรรมการยอมรับ: ก๊อปเฉพาะสถานะที่เปลี่ยนได้ ปล่อยตัวตน (ชื่อ) ไว้กับที่", lang: "cpp" },
      { p: "**ทำไมยอมรับได้:** `_name` คือ *ตัวตน* ของ object ไม่ใช่ *สถานะ*. การ assign ในความหมายนี้คือ 'ให้คนนี้มีเกรดเท่าคนนั้น' ไม่ใช่ 'เปลี่ยนคนนี้ให้กลายเป็นคนนั้น'" },
      { note: "**อย่า `const_cast` ชื่อ** เพื่อให้ก๊อปได้ — เป็นธงแดงตอน defense เพราะมันคือการโกหกคอมไพเลอร์ว่า const ที่เขียนไว้ไม่จริง" },
      { qa: [
        { q: "ทำไมคลาสที่มี `const` member ยังต้องมี `operator=`?", a: "เพราะ OCF บังคับ. ทางออกคือเขียนให้ก๊อปเฉพาะ member ที่ไม่ const แล้วปล่อย const ไว้ — คอมไพล์ผ่านและสมเหตุสมผล" },
        { q: "ถ้าไม่เขียน `operator=` เองจะเป็นยังไง?", a: "คอมไพเลอร์พยายามสร้างให้ แต่สร้างไม่ได้เพราะมี const member — พอมีโค้ดเรียก assign จริงจะ error. และ OCF ก็ไม่ครบตามที่ subject บังคับ" },
        { q: "ทำไมห้าม `const_cast`?", a: "มันบอกคอมไพเลอร์ว่า const ที่เราเขียนเองไม่จริง — แก้ของที่ประกาศเป็น const เป็น undefined behaviour และตอน defense จะถูกซัก" },
      ]},

      { h: "🔬 เจาะลึก B: throw จากตัวสร้าง — object ที่ไม่เคยเกิด" },
      { code: String.raw`Bureaucrat::Bureaucrat(const std::string &name, int grade) : _name(name)
{
    if (grade < 1)
        throw GradeTooHighException();     // ← _name สร้างเสร็จแล้ว
    if (grade > 150)
        throw GradeTooLowException();
    this->_grade = grade;
}

เมื่อ throw ตรงนั้น:
  ✓ _name (สร้างเสร็จแล้วใน initialiser list) ถูกทำลายตามปกติ
  ✗ ~Bureaucrat() ไม่ถูกเรียก  — เพราะ object ยังสร้างไม่เสร็จ
  ✗ ตัวแปรที่รับค่านั้นไม่เคยมีอยู่จริง`, cap: "กฎ: destructor รันเฉพาะ object ที่ constructor ทำงานจนจบ", lang: "cpp" },
      { p: "**ผลที่ตามมาที่ต้องระวัง:** ถ้า constructor ทำ `new` ไปแล้วก่อนจะ throw ของก้อนนั้นจะรั่ว เพราะ destructor ที่จะ `delete` มันไม่ได้ทำงาน. ในโมดูลนี้ไม่มีเคสนั้น แต่เป็นเหตุผลว่าทำไมต้อง **ตรวจก่อนจอง** เสมอ" },
      { qa: [
        { q: "throw จาก constructor แล้ว destructor ทำงานไหม?", a: "ไม่ — object สร้างไม่เสร็จจึงไม่มี object ให้ทำลาย. แต่ member ที่สร้างเสร็จไปแล้วจะถูกทำลายตามปกติ" },
        { q: "ทำไมต้องเช็คเกรดก่อนแล้วค่อยตั้งค่า?", a: "เพื่อไม่ให้ object เข้าสู่สถานะครึ่ง ๆ กลาง ๆ. หลักการทั่วไป: ตรวจให้ครบก่อนจะจองทรัพยากรใด ๆ เพราะถ้า throw หลังจอง destructor ไม่ทำงานแล้วของนั้นจะรั่ว" },
      ]},

      { h: "🔬 เจาะลึก C: เช็คที่ฐาน ลงมือที่ลูก (template method)" },
      { p: "ex02 มี 3 ฟอร์มที่ต้องเช็คเหมือนกันทุกตัว (เซ็นหรือยัง / เกรดพอไหม) แต่ทำงานคนละอย่าง. subject บอกใบ้ว่ามีทางที่ **'สง่ากว่า'** การก๊อปเช็คไปใส่ทั้ง 3 คลาส" },
      { code: String.raw`class AForm
{
    protected:
        virtual void executeAction(void) const = 0;   // ★ ลูกเขียนแค่ตัวนี้

    public:
        void execute(Bureaucrat const &executor) const;   // ★ ไม่ virtual
        virtual ~AForm(void);
};

void AForm::execute(Bureaucrat const &executor) const
{
    if (!this->_signed)
        throw FormNotSignedException();               // เช็คที่เดียว
    if (executor.getGrade() > this->_gradeToExecute)
        throw GradeTooLowException();                 // เช็คที่เดียว
    this->executeAction();                            // ★ กระจายไปหาลูก
}`, cap: "รูปแบบนี้มีชื่อว่า template method — ฐานคุมลำดับขั้น ลูกเติมเนื้อในแต่ละขั้น", lang: "cpp" },
      { table: { head: ["", "เช็คซ้ำในทุกลูก", "เช็คที่ฐาน (แบบนี้)"], rows: [
        ["โค้ดเช็ค", "ก๊อป 3 ที่", "ที่เดียว"],
        ["ลืมเช็คในลูกใหม่", "เป็นไปได้", "เป็นไปไม่ได้ — ลูกเรียกเองไม่ได้"],
        ["เพิ่มเงื่อนไขใหม่", "แก้ 3 ที่", "แก้ที่เดียว"],
        ["`executeAction` เห็นจากข้างนอก", "—", "ไม่เห็น (protected) — บังคับให้ผ่าน `execute` เท่านั้น"],
      ]}},
      { p: "**ทำไม `executeAction` ต้องเป็น `protected`:** ถ้าเป็น public จะมีคนเรียกมันตรง ๆ ข้ามด่านตรวจไปได้ — ทำให้ฟอร์มที่ยังไม่ถูกเซ็นถูกสั่งทำงานได้" },
      { qa: [
        { q: "ทำไมไม่ทำให้ `execute` เป็น virtual แล้วให้แต่ละฟอร์มเขียนเอง?", a: "ต้องก๊อปโค้ดเช็คเซ็น+เกรดไปใส่ทั้ง 3 คลาส — ซ้ำซ้อนและลืมง่าย. subject เตือนไว้ว่านั่นคือทางที่ 'สง่าน้อยกว่า'" },
        { q: "`executeAction` เป็น protected ทำไม", a: "เพื่อไม่ให้ใครเรียกข้ามด่านตรวจ — ทางเดียวที่จะสั่งฟอร์มทำงานคือผ่าน `execute()` ที่ตรวจให้แล้ว" },
        { q: "AForm ต้องมี virtual destructor ไหม?", a: "ต้องมี — ฟอร์มถูกลบผ่าน `AForm*` ทั้งใน ex02 และ ex03 (Intern คืน `AForm*`) ถ้าไม่ virtual destructor ของฟอร์มจริงไม่ทำงาน" },
      ]},

      { h: "🔬 เจาะลึก D: makeForm โดยไม่ใช้ if/else — ตารางกับ function pointer" },
      { p: "subject **ห้าม** `if (name == \"a\") ... else if (name == \"b\") ...` ตรง ๆ. วิธีที่ใช้คือเก็บชื่อกับตัวสร้างเป็น 2 อาเรย์คู่กัน แล้ววนหา" },
      { code: String.raw`// Intern.hpp — ตัวสร้างเป็น static เพราะไม่ต้องใช้ this
static AForm *makeShrubbery(const std::string &target);
static AForm *makeRobotomy(const std::string &target);
static AForm *makePresidential(const std::string &target);

// Intern.cpp
AForm *Intern::makeForm(const std::string &name, const std::string &target)
{
    const std::string names[3] = {
        "shrubbery creation", "robotomy request", "presidential pardon" };
    AForm *(*builders[3])(const std::string &) = {
        &Intern::makeShrubbery, &Intern::makeRobotomy, &Intern::makePresidential };
    int i = 0;

    while (i < 3)
    {
        if (names[i] == name)
        {
            std::cout << "Intern creates " << name << std::endl;
            return (builders[i](target));
        }
        i++;
    }
    std::cout << "Error: form \"" << name << "\" does not exist." << std::endl;
    throw FormNotFoundException();
}`, cap: "โค้ดจริงในโปรเจกต์ — เพิ่มฟอร์มใหม่ = เติม 1 แถวในทั้ง 2 อาเรย์ ไม่ต้องแตะตรรกะ", lang: "cpp" },
      { code: String.raw`อ่าน type นี้จากในออกนอก:

    AForm *(*builders[3])(const std::string &)
           ^^          ^^^
           |            └── builders เป็นอาเรย์ 3 ช่อง
           └── แต่ละช่องเป็น pointer ไปยังฟังก์ชัน
               ที่รับ const std::string & แล้วคืน AForm*

วงเล็บครอบ (*builders[3]) จำเป็น
  ไม่มีวงเล็บ → AForm *builders[3](...) = อาเรย์ของฟังก์ชัน (ผิด ภาษาไม่มี)`, cap: "เหตุผลเดียวกับ pointer-to-member ใน Module 01 — วงเล็บบอกว่า 'ตัวนี้เป็น pointer ก่อน แล้วค่อยเป็นฟังก์ชัน'", lang: "txt" },
      { p: "**ทำไมตัวสร้างต้องเป็น `static`:** เมธอดธรรมดามี `this` ซ่อนอยู่ ทำให้ type เป็น pointer-to-member ซึ่งเขียนยากกว่ามาก. `static` ไม่มี `this` จึงเป็นฟังก์ชันธรรมดาที่ใส่ในอาเรย์แบบข้างบนได้เลย" },
      { note: "`makeForm` โยนความเป็นเจ้าของให้ผู้เรียก — ทุก `AForm*` ที่ได้มาต้อง `delete`. ถ้ามันโยน `FormNotFoundException` จะไม่มีของให้ลบ (ยังไม่ได้ `new`) — ตรงนี้ถูกแล้ว" },
      { qa: [
        { q: "ทำไม subject ห้าม if/else ต่อกันใน makeForm?", a: "เพราะมันขยายไม่ได้ — เพิ่มฟอร์มใหม่ต้องแก้ตรรกะทุกครั้ง. ตารางชื่อ+ตัวสร้างเพิ่มแค่ข้อมูล ไม่ต้องแตะโค้ดที่ทำงาน" },
        { q: "ทำไมตัวสร้างต้องเป็น static member?", a: "เพื่อให้เป็นฟังก์ชันธรรมดา (ไม่มี `this`) จะได้เก็บใน array ของ function pointer ธรรมดาได้. ถ้าไม่ static ต้องใช้ pointer-to-member ที่ syntax ยุ่งกว่ามาก" },
        { q: "ชื่อฟอร์มไม่มีในตารางทำยังไง?", a: "เลือกได้ 2 ทาง: โยน exception หรือคืน NULL — ขอให้ทำอย่างเดียวกันทั้งโปรเจกต์และให้ main รับมือถูก. โค้ดนี้เลือกโยน `FormNotFoundException`" },
      ]},

      { h: "📖 อ่านเพิ่มเติม" },
      { links: [
        { label: "cppreference — Exceptions", url: "https://en.cppreference.com/w/cpp/language/exceptions", note: "throw / try / catch และ stack unwinding" },
        { label: "cppreference — std::exception", url: "https://en.cppreference.com/w/cpp/error/exception", note: "signature ของ `what()` ที่ต้องตรง" },
        { label: "isocpp FAQ — Exceptions", url: "https://isocpp.org/wiki/faq/exceptions", note: "ทำไมจับด้วย reference, ทำไม throw จาก ctor ถูกต้อง" },
        { label: "cppreference — Function pointer", url: "https://en.cppreference.com/w/cpp/language/pointer", note: "อ่าน type ของอาเรย์ function pointer" },
      ]},
    ],

    foundations: [
      { h: "ex00 — Bureaucrat" },
      { code: String.raw`class Bureaucrat
{
    private:
        const std::string _name;      // ★ const → operator= แตะไม่ได้
        int               _grade;     //   1 = สูงสุด, 150 = ต่ำสุด

    public:
        Bureaucrat(void);
        Bureaucrat(const std::string &name, int grade);
        Bureaucrat(const Bureaucrat &other);
        Bureaucrat &operator=(const Bureaucrat &other);
        ~Bureaucrat(void);

        const std::string &getName(void) const;
        int getGrade(void) const;

        void incrementGrade(void);    // เกรดดีขึ้น เลขลดลง
        void decrementGrade(void);    // เกรดแย่ลง เลขเพิ่มขึ้น

        class GradeTooHighException : public std::exception
        { public: virtual const char *what(void) const throw(); };
        class GradeTooLowException : public std::exception
        { public: virtual const char *what(void) const throw(); };
};

std::ostream &operator<<(std::ostream &os, const Bureaucrat &b);  // ★ free function`, cap: "`operator<<` เป็นฟังก์ชันอิสระที่เรียก getter — ห้าม `friend` (-42)", lang: "cpp" },

      { h: "ex02 — 3 ฟอร์มจริง" },
      { table: { head: ["ฟอร์ม", "เกรดเซ็น", "เกรดสั่งทำ", "ทำอะไร"], rows: [
        ["ShrubberyCreationForm", "145", "137", "เขียนต้นไม้ ASCII ลงไฟล์ `<target>_shrubbery`"],
        ["RobotomyRequestForm", "72", "45", "เสียงสว่าน แล้วสุ่ม 50% สำเร็จ / ล้มเหลว"],
        ["PresidentialPardonForm", "25", "5", "พิมพ์ว่า `<target>` ได้รับอภัยโทษจาก Zaphod Beeblebrox"],
      ]}},
      { code: String.raw`// Shrubbery — ต้องใช้ C++ stream (printf/FILE* ห้าม)
std::ofstream out((this->_target + "_shrubbery").c_str());
                                              ^^^^^^^^^
     C++98 ofstream รับ const char* เท่านั้น — ต้องแปลงจาก std::string

// Robotomy — สุ่ม
std::srand(std::time(0));      // ★ ใน main ครั้งเดียว
if (std::rand() % 2)           // ★ ในตัว action
    std::cout << this->_target << " has been robotomized successfully"
              << std::endl;`, cap: "เพาะ srand ในตัว action = ได้ผลเดิมทุกครั้งที่รันในวินาทีเดียวกัน", lang: "cpp" },

      { h: "ex03 — Intern" },
      { code: String.raw`Intern someRandomIntern;
AForm *rrf = someRandomIntern.makeForm("robotomy request", "Bender");

  พิมพ์:   Intern creates robotomy request
  คืน:     AForm* ที่ new มา  → ★ ผู้เรียกต้อง delete
  ไม่รู้จัก: พิมพ์ error แล้ว throw FormNotFoundException`, cap: "Intern ไม่มีสถานะอะไรเลย — OCF ของมันจึงว่างเปล่า แต่ยังต้องเขียนให้ครบ", lang: "cpp" },
      { note: "`Intern` ไม่มี member เลย copy constructor กับ `operator=` จึงต้อง `(void)other;` เพื่อกัน `-Wunused-parameter` จาก `-Wextra -Werror`" },
    ],

    architecture: [
      { h: "ไฟล์ในแต่ละข้อ" },
      { table: { head: ["ข้อ", "คลาส", "วิธีทำ"], rows: [
        ["ex00", "Bureaucrat", "เขียนใหม่"],
        ["ex01", "+ Form", "ก๊อป ex00 → เพิ่ม Form → forward declaration แก้ include วน"],
        ["ex02", "Form → AForm + 3 ฟอร์ม", "ก๊อป ex01 → เปลี่ยนชื่อ → `executeAction() = 0`"],
        ["ex03", "+ Intern", "ก๊อป ex02 → เพิ่ม Intern"],
      ]}},
      { h: "ความสัมพันธ์ระหว่างคลาส" },
      { code: String.raw`Bureaucrat  ──signForm(AForm&)──►  AForm::beSigned(Bureaucrat const&)
            ──executeForm(AForm const&)──►  AForm::execute(Bureaucrat const&)
                                                        │
                                                        ▼ (protected, pure virtual)
                                                   executeAction()
                                                   ┌────┼────┐
                                          Shrubbery  Robotomy  Presidential

Intern::makeForm(name, target) ──► new <ฟอร์มที่ตรงชื่อ>(target) ──► AForm*`, cap: "Bureaucrat เป็นคนสั่ง ฟอร์มเป็นคนตรวจสิทธิ์ตัวเอง", lang: "txt" },

      { h: "circular include ระหว่าง Bureaucrat กับ Form" },
      { code: String.raw`// Bureaucrat.hpp
class AForm;                      // ★ forward declaration
class Bureaucrat
{
    public:
        void signForm(AForm &f) const;          // reference → พอ
        void executeForm(AForm const &f) const;
};

// Bureaucrat.cpp
#include "Bureaucrat.hpp"
#include "AForm.hpp"              // ★ ตรงนี้ต้องรู้ทั้งตัว เพราะจะเรียก beSigned()`, cap: "เหมือน AMateria/ICharacter ใน Module 04 — pattern เดียวกันเป๊ะ", lang: "cpp" },

      { h: "ใครจับ exception" },
      { code: String.raw`AForm::beSigned()       →  throw GradeTooLowException      (ไม่จับเอง)
        ▲
Bureaucrat::signForm()  →  try { f.beSigned(*this); }
                           catch (std::exception &e) { พิมพ์ "couldn't sign ... because ..." }
        ▲
main()                  →  ไม่ต้อง try — signForm จัดการให้แล้ว

ที่ main ยังต้อง try คือ:
  - สร้าง Bureaucrat ด้วยเกรดผิด
  - increment/decrement จนตกขอบ
  - Intern::makeForm ด้วยชื่อที่ไม่มี`, cap: "หลักการ: จับที่ชั้นที่รู้ว่าจะทำอะไรต่อ — signForm รู้ว่าต้องพิมพ์อะไร main ไม่รู้", lang: "txt" },
      { h: "ข้อความที่ต้องตรงเป๊ะ (เพื่อนเอาไป diff)" },
      { code: String.raw`operator<< ของ Bureaucrat :  <name>, bureaucrat grade <grade>.
signForm สำเร็จ          :  <bureaucrat> signed <form>
signForm ล้มเหลว          :  <bureaucrat> couldn't sign <form> because <reason>.
executeForm สำเร็จ        :  <bureaucrat> executed <form>
Intern                    :  Intern creates <form>`, cap: "`<reason>` คือ `e.what()` ของ exception ที่จับได้", lang: "txt" },
    ],

    dataflow: [
      { h: "เส้นทางของฟอร์ม 1 ใบ" },
      { code: String.raw`1. สร้าง        ShrubberyCreationForm f("home");
                   _signed = false, _gradeToSign = 145, _gradeToExecute = 137

2. เซ็น          bob.signForm(f);
                   → f.beSigned(bob)
                     bob.getGrade() <= 145 ?
                        ใช่  → _signed = true → พิมพ์ "bob signed ..."
                        ไม่ → throw GradeTooLow → signForm จับ → พิมพ์ "couldn't sign"

3. สั่งทำ        bob.executeForm(f);
                   → f.execute(bob)
                     _signed ?               ไม่ → throw FormNotSigned
                     bob.getGrade() <= 137 ? ไม่ → throw GradeTooLow
                     ผ่านทั้งคู่             → executeAction() → เขียนไฟล์
                   → พิมพ์ "bob executed ..."`, cap: "2 ด่านคนละเกรด: เกรดเซ็นมักง่ายกว่าเกรดสั่งทำเสมอ", lang: "txt" },

      { h: "เคสขอบที่ต้องเทส" },
      { table: { head: ["อินพุต", "ผลที่ถูก"], rows: [
        ["`Bureaucrat b(\"x\", 0)`", "`GradeTooHighException`"],
        ["`Bureaucrat b(\"x\", 151)`", "`GradeTooLowException`"],
        ["`Bureaucrat b(\"x\", 1)` และ `(\"x\", 150)`", "**สร้างได้** — เป็นขอบที่ถูกต้อง"],
        ["เกรด 1 แล้ว `incrementGrade()`", "`GradeTooHighException`"],
        ["เกรด 150 แล้ว `decrementGrade()`", "`GradeTooLowException`"],
        ["`execute` ฟอร์มที่ยังไม่เซ็น", "`FormNotSignedException`"],
        ["เกรด 138 สั่งทำ Shrubbery (ต้อง 137)", "`GradeTooLowException`"],
        ["`makeForm(\"nonexistent\", \"x\")`", "พิมพ์ error + โยน (หรือคืน NULL) — ห้าม crash"],
      ]}},
      { note: "เกรด 1 กับ 150 **ต้องสร้างได้** — คนพลาดเยอะเพราะเขียน `<=1` / `>=150` แทน `<1` / `>150`" },

      { h: "ex02 — ทดสอบ polymorphism + leak" },
      { code: String.raw`AForm *forms[3];
forms[0] = new ShrubberyCreationForm("home");
forms[1] = new RobotomyRequestForm("Bender");
forms[2] = new PresidentialPardonForm("Marvin");

Bureaucrat boss("boss", 1);
for (int i = 0; i < 3; i++)
{
    boss.signForm(*forms[i]);
    boss.executeForm(*forms[i]);
    delete forms[i];          // ★ ลบผ่าน AForm* → ต้องมี virtual ~AForm()
}`, cap: "ลูปนี้คือจุดที่ virtual destructor ที่หายไปจะโผล่ใน valgrind", lang: "cpp" },
    ],

    implementation: [
      { h: "ลำดับการลงมือเขียน" },
      { ul: [
        "1. **ex00** — Bureaucrat + 2 exception. ทดสอบขอบ 0/1/150/151 และ increment/decrement จนตกขอบก่อนไปต่อ",
        "2. **ex01** — ก๊อป ex00 → Form → forward declaration ใน Bureaucrat.hpp → `signForm` จับ exception เอง",
        "3. **ex02** — เปลี่ยนชื่อ Form เป็น AForm ทุกที่ (ไฟล์ + include guard + `: public AForm`) → `executeAction() = 0` → เขียน 3 ฟอร์ม",
        "4. **ex03** — Intern + ตาราง 2 อาเรย์ + `delete` ทุกฟอร์มที่ได้มา",
      ]},
      { h: "อาการพัง → สาเหตุ" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้"], rows: [
        ["โยน exception ผิดตัวตอน increment", "เทียบขอบผิดด้าน (เกรดกลับหัว)", "`grade - 1 < 1` → TooHigh"],
        ["`looser throw specifier for virtual ... what()`", "`what()` ไม่มี `const throw()`", "`virtual const char *what() const throw();`"],
        ["`passing const ... discards qualifiers` ใน operator=", "พยายามก๊อป const member", "ก๊อปเฉพาะตัวที่ไม่ const"],
        ["leak/crash ตอน `delete` ผ่าน `AForm*`", "ไม่มี virtual destructor", "`virtual ~AForm(void);`"],
        ["Robotomy ให้ผลเดิมทุกครั้ง", "ไม่ได้ `srand` หรือ seed ในตัว action", "`std::srand(std::time(0));` ใน `main` ครั้งเดียว"],
        ["`what()` คืนข้อความของ std::exception", "จับ by value → object slicing", "`catch (std::exception &e)`"],
        ["เกรด 150 สร้างไม่ได้", "ใช้ `>=150` แทน `>150`", "`if (grade > 150)`"],
        ["ไฟล์ shrubbery ไม่เกิด", "ลืม `.c_str()` หรือ path เขียนไม่ได้", "`std::ofstream out((t + \"_shrubbery\").c_str());`"],
        ["`*printf` / `FILE*` / `malloc` โผล่", "ใช้ของ C", "เปลี่ยนเป็น stream + `new`/`delete`"],
      ]}},
      { h: "build / test" },
      { code: String.raw`cd ex03 && make re && ./intern
valgrind --leak-check=full --error-exitcode=42 -q ./intern

# บน Windows ผ่าน WSL
wsl --exec bash -lc 'cd "/mnt/d/Projects/42/CPP Module 05/ex03" && make re && valgrind -q --leak-check=full ./intern'

# ผ่านแบบเข้มขึ้น
c++ -Wall -Wextra -Werror -std=c++98 -pedantic *.cpp -o test

# ของต้องห้าม
grep -rnE 'printf|[mc]alloc|free\(|using namespace|friend|FILE \*' ex0*/*.cpp ex0*/*.hpp

# shrubbery เขียนไฟล์จริงไหม
cd ex02 && ./form && cat home_shrubbery`, lang: "bash" },
      { note: "valgrind ต้องสะอาดใน ex02 (ลูป new/delete ผ่าน `AForm*`) และ ex03 (ทุก `makeForm` ต้องถูก `delete`) — 2 จุดนี้คือที่ virtual destructor ที่หายและ `delete` ที่ลืมจะโผล่" },
    ],

    tricks: [
      { h: "ทริค 1: เขียนตารางเกรดแปะไว้ก่อนเริ่ม" },
      { p: "คัดตาราง 5 แถวจากหัวข้อ theory มาแปะข้างจอ. บั๊กอันดับ 1 ของโมดูลนี้คือเทียบขอบผิดด้าน และเทียบตารางเร็วกว่าไล่คิดใหม่ทุกครั้ง" },
      { h: "ทริค 2: เขียน `what()` ให้บอกสาเหตุจริง" },
      { p: "`\"grade is too high\"` มีประโยชน์กว่า `\"error\"` เพราะข้อความนี้ไปโผล่ในบรรทัด `couldn't sign ... because <reason>.` ที่กรรมการอ่าน" },
      { h: "ทริค 3: จับด้วย `std::exception &` ตัวเดียวพอ" },
      { p: "ไม่ต้องเขียน catch แยกทีละชนิด — ทุกตัวสืบทอดจาก `std::exception` และสิ่งที่ต้องแสดงคือ `e.what()` เหมือนกันหมด" },
      { h: "ทริค 4: ทำ ex00 ให้ผ่านเทสทุกขอบก่อนค่อยไป ex01" },
      { p: "ex01–ex03 ก๊อป Bureaucrat ไปใช้ต่อทั้ง 3 ข้อ — บั๊กที่ค้างใน ex00 จะตามไปทั้งโมดูล และไล่ยากขึ้นเรื่อย ๆ" },
      { h: "ทริค 5: เปลี่ยนชื่อ Form → AForm ด้วย sed ทีเดียว" },
      { p: "`sed -i 's/\\bForm\\b/AForm/g' *.cpp *.hpp` แล้วค่อยไล่ดู include guard กับชื่อไฟล์ — เร็วกว่าแก้มือและไม่ตกหล่น. ระวังคำที่มี Form อยู่ข้างใน เช่น `ShrubberyCreationForm` — `\\b` กันไว้ให้แล้ว" },
      { h: "ทริค 6: `srand` ครั้งเดียวใน main เสมอ" },
      { p: "เพาะซ้ำในตัว action ทำให้ได้ค่าเดิมทุกครั้งที่เรียกในวินาทีเดียวกัน เพราะ `time(0)` ยังไม่เปลี่ยน — ดูเหมือนสุ่มไม่ทำงาน" },
      { h: "ทริค 7: ให้ฐานตรวจ ให้ลูกทำ" },
      { p: "ทุกครั้งที่จะก๊อปเงื่อนไขไปใส่คลาสลูกหลายตัว หยุดคิดก่อนว่าย้ายขึ้นไปที่ฐานได้ไหม — เป็น pattern ที่ใช้ได้ยาวไปจนถึง Module 08/09" },
    ],

    eval: [
      { qa: [
        { q: "exception คืออะไร ต่างจาก return error code ยังไง?", a: "เป็นการส่งความล้มเหลวขึ้นไปตาม call stack จนกว่าจะมีคนจับ. ต่างตรงที่ constructor คืนค่าไม่ได้จึงใช้ error code ไม่ได้ และผู้เรียกจะเมินไม่ได้ — ไม่จับก็โปรแกรมตาย" },
        { q: "ทำไมเกรด 1 ถึงสูงกว่าเกรด 150?", a: "subject กำหนดให้สเกลกลับหัว — 1 คือสูงสุด 150 ต่ำสุด. ผลคือ increment ทำให้เลขลดลง และ 'เกรดพอเซ็น' คือ `g <= gradeToSign`" },
        { q: "`what()` ต้องเขียน signature ยังไง ทำไม?", a: "`virtual const char *what() const throw();` — ต้องตรงกับ `std::exception` เป๊ะ ไม่งั้นได้ error *looser throw specifier*. `throw()` คือคำสัญญาแบบ C++98 ว่าไม่โยนอะไรออกมา" },
        { q: "ทำไมต้อง `catch` ด้วย reference?", a: "จับ by value จะเกิด object slicing — เหลือแต่ส่วนของ `std::exception` และ `what()` คืนข้อความของฐานแทนของจริง" },
        { q: "throw จาก constructor ปลอดภัยไหม?", a: "ปลอดภัยและถูกต้อง — object สร้างไม่เสร็จจึงไม่มีอยู่จริง, member ที่สร้างเสร็จแล้วถูกทำลายตามปกติ, destructor ของคลาสไม่ทำงาน" },
        { q: "คลาสที่มี `const` member ทำ OCF ยังไง?", a: "เขียน `operator=` ให้ก๊อปเฉพาะ member ที่ไม่ const แล้วปล่อย const ไว้ — ตัว const คือตัวตนของ object ไม่ใช่สถานะ" },
        { q: "ทำไมคลาส exception ไม่ต้องทำ OCF?", a: "subject ยกเว้นให้ตรง ๆ — exception ต้องการแค่ `what()`" },
        { q: "`execute` ทำอะไรบ้าง ตามลำดับ?", a: "เช็คว่าเซ็นแล้วหรือยัง (ไม่ → `FormNotSignedException`), เช็คเกรดผู้สั่ง (ไม่พอ → `GradeTooLowException`), แล้วเรียก `executeAction()` ของฟอร์มจริง" },
        { q: "ทำไมเช็คที่ฐานดีกว่าเช็คในทุกฟอร์ม?", a: "โค้ดเช็คอยู่ที่เดียว ลืมไม่ได้ เพิ่มฟอร์มใหม่ไม่ต้องก๊อปเช็คตาม และ `executeAction` เป็น protected จึงเรียกข้ามด่านไม่ได้" },
        { q: "AForm ต้องมี virtual destructor ไหม ทำไม?", a: "ต้องมี — ฟอร์มถูกลบผ่าน `AForm*` (ลูป ex02 และของที่ Intern คืนมา) ถ้าไม่ virtual destructor ของฟอร์มจริงไม่ทำงาน" },
        { q: "ทำไม makeForm ห้ามใช้ if/else ต่อกัน?", a: "subject ห้ามเพราะขยายไม่ได้. ใช้อาเรย์ชื่อคู่กับอาเรย์ function pointer แล้ววนหา — เพิ่มฟอร์มใหม่แค่เติมข้อมูล" },
        { q: "ทำไมตัวสร้างฟอร์มใน Intern เป็น `static`?", a: "เพราะ static ไม่มี `this` จึงเป็นฟังก์ชันธรรมดา ใส่ในอาเรย์ function pointer ได้เลย ไม่ต้องใช้ pointer-to-member" },
        { q: "ใครเป็นเจ้าของฟอร์มที่ makeForm คืนมา?", a: "ผู้เรียก — ต้อง `delete` เอง. เป็นแหล่ง leak หลักของ ex03" },
        { q: "ทำไม Shrubbery ต้องใช้ `ofstream` ไม่ใช้ `fprintf`?", a: "`*printf` และ `FILE*` เป็นฟังก์ชันต้องห้ามในโมดูลนี้ (0 คะแนน). และ C++98 `ofstream` รับ `const char*` จึงต้อง `.c_str()`" },
      ]},
      { h: "เช็กลิสต์ก่อนส่ง" },
      { code: String.raw`# 1. ทุกข้อคอมไพล์ผ่านแบบเข้ม
for d in ex00 ex01 ex02 ex03; do (cd $d && make re) || echo "FAIL $d"; done

# 2. เคสขอบเกรด: 0 / 1 / 150 / 151 และ increment/decrement จนตก
# 3. execute ฟอร์มที่ยังไม่เซ็น → FormNotSignedException
# 4. shrubbery เขียนไฟล์จริง
cd ex02 && ./form && ls -l *_shrubbery

# 5. robotomy สุ่มได้จริง (รันหลายรอบต้องไม่เหมือนเดิมทุกครั้ง)
# 6. intern สร้างครบ 3 ฟอร์ม + ชื่อผิดต้องไม่ crash
# 7. valgrind สะอาด ex02 + ex03
valgrind --leak-check=full --error-exitcode=42 -q ./intern && echo "ผ่าน"

# 8. ไม่มีของต้องห้าม
grep -rnE 'printf|[mc]alloc|free\(|using namespace|friend' ex0*/*.cpp ex0*/*.hpp`, lang: "bash" },
    ],
  },
});

/* ===================== CPP MODULE 06 ===================== */
window.TEACHING_DATA.push({
  id: "cpp_module_06",
  name: "CPP Module 06",
  tag: { th: "Cast ทั้ง 4 แบบของ C++ — ex00 ScalarConverter (static_cast + การอ่าน literal), ex01 Serializer (reinterpret_cast), ex02 identify (dynamic_cast ทั้งแบบ pointer และ reference)",
         en: "The four C++ named casts — ex00 ScalarConverter (static_cast + literal detection), ex01 Serializer (reinterpret_cast), ex02 identify (dynamic_cast, pointer and reference form)" },
  accent: "#f9ca24",
  sections: {
    principle: [
      { h: "Module 06 สอนอะไร" },
      { p: "C++ แยก cast ออกเป็น 4 ตัวที่มีชื่อ แทนที่จะใช้ `(type)x` แบบ C ตัวเดียวจบ. โมดูลนี้ให้ 3 ข้อ ข้อละ 1 cast — **และตอน defense กรรมการจะถามว่าทำไมเลือกตัวนั้น**" },
      { table: { head: ["ข้อ", "cast", "ทำไมตัวนี้"], rows: [
        ["ex00 ScalarConverter", "`static_cast`", "แปลงระหว่างชนิดตัวเลขที่เกี่ยวข้องกัน (double → int/float/char) — คอมไพเลอร์รู้วิธีแปลงค่า"],
        ["ex01 Serializer", "`reinterpret_cast`", "ตีความบิตของ pointer เป็นจำนวนเต็มแล้วกลับ — 2 ชนิดไม่เกี่ยวกันเลย"],
        ["ex02 identify", "`dynamic_cast`", "แปลงลงจากคลาสฐานอย่างปลอดภัย เพื่อค้นหาชนิดจริงตอนรัน"],
      ]}},
      { h: "cast ทั้ง 4 ในตารางเดียว" },
      { table: { head: ["cast", "ทำอะไร", "ตรวจตอนไหน", "ล้มเหลวยังไง"], rows: [
        ["`static_cast<T>`", "แปลงระหว่างชนิดที่เกี่ยวข้องกัน", "คอมไพล์", "คอมไพล์ไม่ผ่าน"],
        ["`dynamic_cast<T>`", "แปลงลงในสายสืบทอด (ต้อง polymorphic)", "**รันไทม์**", "pointer คืน NULL · reference **โยน**"],
        ["`const_cast<T>`", "ถอด/ใส่ `const`", "คอมไพล์", "คอมไพล์ไม่ผ่าน (แต่ใช้ผิดคือ UB)"],
        ["`reinterpret_cast<T>`", "ตีความบิตใหม่ ไม่แปลงค่า", "คอมไพล์", "ไม่ล้มเหลว — และนั่นคือส่วนที่อันตราย"],
      ]}},
      { p: "**ทำไมไม่ใช้ `(type)x` แบบ C:** cast แบบ C จะไล่ลองทั้ง 4 แบบให้อัตโนมัติ — อ่านโค้ดแล้วไม่รู้ว่าเกิดอะไรขึ้น และหาด้วย grep ไม่ได้. ชื่อยาว ๆ ของ C++ ตั้งใจให้ *เขียนแล้วสะดุด* เพราะ cast ทุกครั้งคือจุดที่ระบบชนิดถูกข้าม" },
      { h: "กฎเหล็ก" },
      { ul: [
        "ห้าม `printf` / `malloc` / `free` (0 คะแนน) · ห้าม `using namespace` / `friend` (-42) · ห้าม STL",
        "**ex00 กับ ex01 ต้องสร้าง object ไม่ได้** — OCF ครบแต่ประกาศไว้ใน `private`",
        "**ex02 ได้รับยกเว้น OCF** — subject บอกไว้ตรง ๆ",
        "**ex02 ห้าม `#include <typeinfo>`** — จับ `std::exception&` แทน `std::bad_cast`",
        "**ex02 ห้ามใช้ pointer ข้างใน `identify(Base&)`**",
      ]},
    ],

    theory: [
      { h: "1) ทำคลาสให้สร้างไม่ได้ (ex00, ex01)" },
      { code: String.raw`class ScalarConverter
{
    private:                                    // ★ ทั้งชุดอยู่ใน private
        ScalarConverter(void);
        ScalarConverter(const ScalarConverter &other);
        ScalarConverter &operator=(const ScalarConverter &other);
        ~ScalarConverter(void);

    public:
        static void convert(const std::string &literal);   // ทางเข้าเดียว
};

ผลลัพธ์:
    ScalarConverter c;              // ✗ ctor เป็น private
    new ScalarConverter();          // ✗ เช่นกัน
    ScalarConverter::convert("42"); // ✓ static เรียกได้โดยไม่ต้องมี object`, cap: "OCF ยังครบตามที่ subject บังคับ แต่ผู้ใช้แตะไม่ได้ — คลาสกลายเป็นแค่ namespace ที่มีชื่อ", lang: "cpp" },
      { note: "ยังต้อง**เขียนตัวฟังก์ชัน** ทั้ง 4 ใน `.cpp` ด้วย (เนื้อว่างก็ได้) เพราะ OCF บังคับให้มี — แค่ไม่มีใครเรียกได้เท่านั้น" },

      { h: "2) static_cast — แปลงค่าระหว่างชนิดที่เกี่ยวกัน" },
      { code: String.raw`double d = 65.9;

static_cast<int>(d)    →  65      (ตัดทศนิยมทิ้ง ไม่ปัด)
static_cast<char>(d)   →  'A'     (65 คือรหัสของ 'A')
static_cast<float>(d)  →  65.9f   (ความละเอียดลดลง)

สิ่งที่ static_cast ทำไม่ได้:
  static_cast<Data*>(someInteger)   // ✗ ไม่เกี่ยวกันเลย
  static_cast<int*>(charPointer)    // ✗ เช่นกัน`, cap: "static_cast แปลง *ค่า* ตามกฎที่คอมไพเลอร์รู้ — ไม่ใช่การตีความบิตใหม่", lang: "cpp" },

      { h: "3) reinterpret_cast — ตีความบิตใหม่" },
      { code: String.raw`Data *ptr = &data;

reinterpret_cast<uintptr_t>(ptr)   →  ตัวเลขที่มีบิตชุดเดียวกับ address
reinterpret_cast<Data*>(raw)       →  แปลงกลับ ได้ address เดิมเป๊ะ

ไม่มีการแปลงค่าใด ๆ เกิดขึ้น — บิตชุดเดิม แค่บอกคอมไพเลอร์ว่า "มองมันเป็นชนิดนี้"

ทำไมต้อง uintptr_t ไม่ใช่ int:
  int อาจแคบกว่า pointer (บน 64-bit: int = 4 ไบต์, pointer = 8 ไบต์)
  uintptr_t ถูกนิยามว่า "จำนวนเต็มไม่มีเครื่องหมายที่ใหญ่พอเก็บ pointer ได้"`, cap: "อยู่ใน `<stdint.h>` — `<cstdint>` เป็นของ C++11 ใช้ไม่ได้ในโมดูลนี้", lang: "cpp" },

      { h: "🔬 เจาะลึก A: dynamic_cast 2 หน้า — NULL กับ throw" },
      { p: "`dynamic_cast` เป็น cast ตัวเดียวที่**ทำงานตอนรัน** — มันไปดูชนิดจริงของ object แล้วตัดสินว่าแปลงได้ไหม. และมันมี 2 พฤติกรรมที่ต่างกันสิ้นเชิงตามรูปแบบที่ใช้" },
      { table: { head: ["", "`dynamic_cast<A*>(p)`", "`dynamic_cast<A&>(r)`"], rows: [
        ["สำเร็จ", "คืน pointer ที่ใช้ได้", "คืน reference ที่ใช้ได้"],
        ["ล้มเหลว", "คืน `NULL`", "**โยน `std::bad_cast`**"],
        ["ตรวจยังไง", "`if (dynamic_cast<A*>(p))`", "`try { ... } catch (std::exception &) {}`"],
        ["ทำไมต่างกัน", "pointer เป็น NULL ได้", "**reference เป็น null ไม่ได้** จึงไม่มีค่าไหนแปลว่าล้มเหลว"],
      ]}},
      { code: String.raw`void identify(Base *p)
{
    if (dynamic_cast<A *>(p))       std::cout << "A" << std::endl;
    else if (dynamic_cast<B *>(p))  std::cout << "B" << std::endl;
    else if (dynamic_cast<C *>(p))  std::cout << "C" << std::endl;
    else                            std::cout << "Unknown" << std::endl;
}

void identify(Base &p)
{
    try { (void)dynamic_cast<A &>(p); std::cout << "A" << std::endl; return; }
    catch (std::exception &) {}
    try { (void)dynamic_cast<B &>(p); std::cout << "B" << std::endl; return; }
    catch (std::exception &) {}
    try { (void)dynamic_cast<C &>(p); std::cout << "C" << std::endl; return; }
    catch (std::exception &) {}
}`, cap: "โค้ดจริงในโปรเจกต์ — `(void)` เพราะเราสนใจแค่ว่ามัน 'ไม่โยน' ไม่ได้ใช้ผลลัพธ์", lang: "cpp" },
      { p: "**subject ห้ามใช้ pointer ข้างใน `identify(Base&)`** — จะเขียน `identify(&p)` โยนงานให้ตัวบนไม่ได้. บังคับให้เจอกับรูปแบบ reference ที่ต้องใช้ try/catch จริง ๆ" },
      { note: "**ห้าม `#include <typeinfo>`** ซึ่งเป็นที่อยู่ของ `std::bad_cast` — จับ `std::exception &` จาก `<exception>` แทน. `bad_cast` สืบทอดมาจาก `std::exception` จึงจับได้ปกติและไม่ผิดกฎ" },
      { qa: [
        { q: "`dynamic_cast` ล้มเหลวแล้วเกิดอะไร?", a: "ต่างกันตามรูปแบบ: แบบ pointer คืน `NULL`, แบบ reference **โยน `std::bad_cast`** — เพราะ reference เป็น null ไม่ได้จึงไม่มีค่าไหนใช้แทน 'ล้มเหลว' ได้" },
        { q: "ทำไม `identify(Base&)` ต้องใช้ try/catch?", a: "เพราะรูปแบบ reference โยน exception เวลาแปลงไม่ได้ และ subject ห้ามใช้ pointer ข้างในฟังก์ชันนี้" },
        { q: "จับ `std::bad_cast` ไม่ได้เพราะอะไร?", a: "มันประกาศใน `<typeinfo>` ซึ่ง subject ห้าม include. จับ `std::exception &` แทน — `bad_cast` สืบทอดมาจากตัวนั้นอยู่แล้ว" },
      ]},

      { h: "🔬 เจาะลึก B: `dynamic_cast` ต้องการคลาสที่เป็น polymorphic" },
      { code: String.raw`class Base
{
    public:
        virtual ~Base();      // ★ virtual ตัวเดียวนี้คือทั้งหมดที่ต้องมี
};

class A : public Base {};     // ว่างเปล่า
class B : public Base {};
class C : public Base {};`, cap: "โค้ดจริงของ ex02 — Base มีแค่ virtual destructor ตัวเดียว", lang: "cpp" },
      { p: "**ทำไม `virtual` ตัวเดียวถึงจำเป็น:** `dynamic_cast` ต้องรู้ชนิดจริงของ object ตอนรัน — ข้อมูลนั้น (RTTI) ถูกแนบมากับ vtable. คลาสที่ไม่มี virtual method เลยจะไม่มี vtable จึงไม่มีที่เก็บข้อมูลชนิด" },
      { code: String.raw`ถ้าลืม virtual:
    error: cannot dynamic_cast 'p' (of type 'class Base*')
           to type 'class A*' (source type is not polymorphic)

    ← เป็น compile error ไม่ใช่บั๊กตอนรัน ดีตรงที่รู้ทันที`, cap: "ข้อความ 'source type is not polymorphic' แปลว่าคลาสฐานไม่มี virtual สักตัว", lang: "txt" },
      { p: "และ `virtual ~Base()` ยังจำเป็นด้วยเหตุผลที่ 2: `main` ลบ object ผ่าน `Base*` — ถ้าไม่ virtual destructor ของ A/B/C ไม่ทำงาน (เหมือน Module 04). **เหตุผลเดียวได้ประโยชน์ 2 อย่าง**" },
      { qa: [
        { q: "ทำไม `Base` ต้องมี `virtual ~Base()`?", a: "2 เหตุผล: (1) ทำให้คลาสเป็น polymorphic ซึ่ง `dynamic_cast` บังคับ (2) ลบผ่าน `Base*` แล้ว destructor ของลูกต้องทำงาน" },
        { q: "`source type is not polymorphic` แปลว่าอะไร?", a: "คลาสฐานไม่มี virtual method เลยจึงไม่มี RTTI ให้ `dynamic_cast` ใช้. เติม virtual destructor ก็จบ" },
      ]},

      { h: "🔬 เจาะลึก C: จัดรูปเลขทศนิยมให้ตรงกับ subject" },
      { p: "subject ต้องการเห็น `42.0f` ไม่ใช่ `42f`, และ `4.2f` ไม่ใช่ `4.20000f`. `std::fixed` + `setprecision` ทำไม่ได้เพราะมันเติมศูนย์ให้ทุกตัว" },
      { code: String.raw`static std::string formatFloating(double d)
{
    std::stringstream ss;
    std::string str;

    ss << d;                     // รูปแบบปกติ: 4.2 ยังเป็น "4.2", 42 เป็น "42"
    str = ss.str();
    if (str.find('.') == std::string::npos
        && str.find('e') == std::string::npos)   // กันกรณี sci-notation
        str += ".0";                              // ★ เติมเฉพาะตอนไม่มีจุด
    return (str);
}

// float:   formatFloating(static_cast<float>(d)) << "f"
// double:  formatFloating(d)`, cap: "โค้ดจริง — แปลงเป็น float **ก่อน** จัดรูป เพื่อให้บรรทัด float สะท้อนความละเอียดของ float จริง ๆ", lang: "cpp" },
      { table: { head: ["อินพุต", "`ss << d` ได้", "หลังเติม", "พิมพ์"], rows: [
        ["`42.0f`", "`42`", "`42.0`", "`float: 42.0f`"],
        ["`-4.2f`", "`-4.2`", "ไม่เติม (มีจุดแล้ว)", "`float: -4.2f`"],
        ["`0`", "`0`", "`0.0`", "`float: 0.0f`"],
      ]}},
      { note: "ถ้าเห็น `4.20000f` แปลว่าไปใช้ `std::fixed`/`setprecision`; ถ้าเห็น `42f` แปลว่าลืมเงื่อนไขเติม `.0`" },

      { qa: [
        { q: "ทำไมใช้ `std::fixed` ไม่ได้?", a: "มันเติมศูนย์ให้ครบตามความละเอียดที่ตั้งไว้เสมอ — `4.2` จะกลายเป็น `4.20000` ซึ่งไม่ตรงกับผลใน subject" },
        { q: "เติม `.0` ตอนไหน?", a: "เมื่อผลจากการสตรีมแบบปกติไม่มี `.` และไม่มี `e` — คือเป็นจำนวนเต็มพอดีอย่าง `42` ซึ่งต้องแสดงเป็น `42.0`" },
        { q: "ทำไมต้อง `static_cast<float>` ก่อนจัดรูปบรรทัด float?", a: "เพื่อให้ตัวเลขที่พิมพ์สะท้อนความละเอียดของ `float` จริง ๆ ไม่ใช่ของ `double` ที่เก็บค่าไว้" },
      ]},
      { h: "🔬 เจาะลึก D: `impossible` กับ `Non displayable` ต่างกันตรงไหน" },
      { p: "2 คำนี้ไม่เหมือนกันและ subject ตรวจ. หลักคิด: **แปลงไม่ได้เลย** vs **แปลงได้แต่พิมพ์ออกจอไม่ได้**" },
      { code: String.raw`static void printChar(double d)
{
    std::cout << "char: ";
    if (isNan(d) || isInf(d) || d < 0 || d > 127)
        std::cout << "impossible" << std::endl;        // ไม่มี char ตัวไหนตรงกับค่านี้
    else if (!std::isprint(static_cast<int>(d)))
        std::cout << "Non displayable" << std::endl;   // มีอยู่จริง แต่พิมพ์ไม่ออก
    else
        std::cout << "'" << static_cast<char>(d) << "'" << std::endl;
}`, cap: "โค้ดจริง — เรียงลำดับสำคัญ: เช็ค 'ไม่มีอยู่' ก่อน แล้วค่อยเช็ค 'พิมพ์ไม่ได้'", lang: "cpp" },
      { table: { head: ["อินพุต", "char", "เพราะ"], rows: [
        ["`0`", "`Non displayable`", "0 อยู่ในช่วง 0–127 แต่ไม่ใช่อักขระที่พิมพ์ได้"],
        ["`31`", "`Non displayable`", "อักขระควบคุม"],
        ["`32`", "`' '`", "ช่องว่างพิมพ์ได้"],
        ["`126`", "`'~'`", "ตัวสุดท้ายที่พิมพ์ได้"],
        ["`127`", "`Non displayable`", "DEL"],
        ["`nan`", "`impossible`", "ไม่ใช่ตัวเลข แปลงไม่ได้"],
        ["`-1` / `200`", "`impossible`", "อยู่นอกช่วง"],
      ]}},
      { note: "`std::isprint` ต้องส่ง `static_cast<int>` (หรือ `unsigned char`) เข้าไป — ส่ง `char` ที่ติดลบเข้าไปตรง ๆ เป็น undefined behaviour" },
      { qa: [
        { q: "`./convert 0` ทำไม char ได้ `Non displayable` ไม่ใช่ `impossible`?", a: "เพราะ 0 อยู่ในช่วง char ที่ถูกต้อง (0–127) — แปลงได้จริง แค่พิมพ์ออกจอไม่ได้. `impossible` สงวนไว้สำหรับ NaN/Inf และค่าที่อยู่นอกช่วง" },
        { q: "`2147483648` ให้ผลอะไร?", a: "`int: impossible` (เกิน INT_MAX) แต่ `float`/`double` ปกติ — เพราะค่านั้นเก็บใน double ได้สบาย" },
      ]},

      { h: "🔬 เจาะลึก E: `std::isnan` / `std::isinf` ไม่มีใน C++98" },
      { p: "2 ตัวนี้เพิ่มมาใน C++11. ใต้ `-std=c++98` จะได้ error *'isnan' is not a member of 'std'*. เขียนเองได้ใน 2 บรรทัดโดยอาศัยคุณสมบัติของ IEEE 754 ที่รับประกันอยู่แล้ว" },
      { code: String.raw`static bool isNan(double d)
{
    return (d != d);                    // ★ NaN คือค่าเดียวที่ไม่เท่ากับตัวเอง
}

static bool isInf(double d)
{
    return (d == std::numeric_limits<double>::infinity()
        || d == -std::numeric_limits<double>::infinity());
}`, cap: "โค้ดจริง — `d != d` ไม่ใช่ลูกเล่น แต่เป็นคุณสมบัติที่มาตรฐาน IEEE 754 กำหนดไว้", lang: "cpp" },
      { p: "**ทำไม `d != d` ถึงจับ NaN ได้:** IEEE 754 กำหนดว่าการเปรียบเทียบใด ๆ ที่มี NaN อยู่ด้วยจะเป็นเท็จเสมอ — รวมทั้ง `NaN == NaN`. ดังนั้น `!=` จึงเป็นจริง ซึ่งเกิดขึ้นได้กับ NaN เท่านั้น" },
      { qa: [
        { q: "ทำไมใช้ `std::isnan` ไม่ได้?", a: "มันเข้ามาใน C++11 — ใต้ `-std=c++98` จะ compile error. เขียนเองด้วย `d != d`" },
        { q: "`d != d` ทำงานยังไง?", a: "IEEE 754 กำหนดให้ทุกการเปรียบเทียบกับ NaN เป็นเท็จ รวม `NaN == NaN`. ดังนั้น `!=` จริงเฉพาะกับ NaN" },
      ]},

      { h: "📖 อ่านเพิ่มเติม" },
      { links: [
        { label: "cppreference — static_cast", url: "https://en.cppreference.com/w/cpp/language/static_cast", note: "กฎการแปลงระหว่างชนิดที่เกี่ยวข้อง" },
        { label: "cppreference — dynamic_cast", url: "https://en.cppreference.com/w/cpp/language/dynamic_cast", note: "พฤติกรรม NULL vs throw และข้อบังคับ polymorphic" },
        { label: "cppreference — reinterpret_cast", url: "https://en.cppreference.com/w/cpp/language/reinterpret_cast", note: "การรับประกันของ pointer ↔ uintptr_t" },
        { label: "isocpp FAQ — Casting", url: "https://isocpp.org/wiki/faq/misc-technical-issues#static-typing", note: "ทำไม C++ ถึงแยก cast เป็น 4 ตัว" },
        { label: "IEEE 754 — NaN", url: "https://en.wikipedia.org/wiki/NaN", note: "ที่มาของ `d != d`" },
      ]},
    ],

    foundations: [
      { h: "ex00 — ลำดับการตรวจชนิดของ literal" },
      { code: String.raw`1. char literal      ยาว 1 ตัวและไม่ใช่ตัวเลข ('c', '*')
                     หรือรูปมีเครื่องหมายคำพูด ยาว 3 และ s[0]==s[2]=='\''
                     ★ '0' ตัวเดียวเป็น int ไม่ใช่ char — เงื่อนไข "ไม่ใช่ตัวเลข" มีไว้เพื่อสิ่งนี้

2. pseudo-literal    nan nanf +inf -inf inf +inff -inff inff  (ตรงตัวเป๊ะ)

3. int               เครื่องหมาย (มีก็ได้) แล้วเป็นตัวเลขล้วน

4. float             ลงท้ายด้วย f และส่วนหน้าเป็น double ที่ถูกต้อง
                     ★ 42f ไม่ผ่าน (ไม่มีจุด) → ตกไปเป็น impossible

5. double            เครื่องหมาย (มีก็ได้) ตัวเลข จุดเดียว และมีตัวเลขอย่างน้อย 1 ตัว

6. อื่น ๆ ทั้งหมด    → impossible ทั้ง 4 บรรทัด`, cap: "ตรวจตามลำดับนี้ ตัวแรกที่ตรงชนะ — สลับลำดับแล้วผลเปลี่ยน", lang: "txt" },
      { code: String.raw`void ScalarConverter::convert(const std::string &literal)
{
    double d;

    if (isCharLiteral(literal))       d = getCharValue(literal);
    else if (isPseudoLiteral(literal)) d = getPseudoValue(literal);
    else if (isIntLiteral(literal))
        d = static_cast<double>(std::strtol(literal.c_str(), NULL, 10));
    else if (isFloatLiteral(literal) || isDoubleLiteral(literal))
        d = std::strtod(literal.c_str(), NULL);
    else
    {
        std::cout << "char: impossible" << std::endl;
        /* ... อีก 3 บรรทัด ... */
        return;
    }
    printChar(d);  printInt(d);  printFloat(d);  printDouble(d);
}`, cap: "โค้ดจริง — ทุกอย่างลอดผ่าน `double` ตัวเดียว ทำให้ 4 เส้นทางพิมพ์เหมือนกันหมด", lang: "cpp" },
      { p: "**ทำไมแปลงเป็น `double` ตัวเดียวก่อน:** ไม่ต้องเขียนตรรกะแปลง 4×4 = 16 ทาง เหลือแค่ 'string → double' 1 ที และ 'double → X' อีก 4 ที. `double` เก็บทั้ง int, float และ char ได้หมดโดยไม่เสียค่า (ยกเว้น int ที่ใหญ่มาก ซึ่งเราตรวจแยกอยู่แล้ว)" },
      { note: "`static_cast` แปลง string เป็นตัวเลขไม่ได้ — subject จึงอนุญาตให้ใช้ฟังก์ชันแปลงสตริงได้. โค้ดนี้ใช้ `std::strtod` และ `std::strtol` จาก `<cstdlib>`" },

      { h: "ex01 — Serializer" },
      { code: String.raw`// Data.hpp — subject บอกว่าต้อง "ไม่ว่าง"
struct Data
{
    int         id;
    std::string name;
    double      value;
};

// Serializer.cpp
uintptr_t Serializer::serialize(Data *ptr)
{
    return (reinterpret_cast<uintptr_t>(ptr));
}

Data *Serializer::deserialize(uintptr_t raw)
{
    return (reinterpret_cast<Data *>(raw));
}`, cap: "ทั้งข้อมีแค่นี้ — ประเด็นอยู่ที่ 'ทำไมต้อง reinterpret_cast' ไม่ใช่ปริมาณโค้ด", lang: "cpp" },
      { p: "**ทำไม `static_cast` ใช้ไม่ได้ตรงนี้:** `Data*` กับ `uintptr_t` เป็นชนิดที่ไม่มีความสัมพันธ์กันเลย — ไม่มีกฎการแปลงค่าใด ๆ ให้คอมไพเลอร์ทำตาม. `reinterpret_cast` เท่านั้นที่บอกว่า 'เอาบิตชุดเดิมนี่แหละ มองเป็นชนิดใหม่'" },

      { h: "ex02 — Base / A / B / C" },
      { code: String.raw`class Base { public: virtual ~Base(); };
class A : public Base {};
class B : public Base {};
class C : public Base {};

Base *generate(void)
{
    int choice = std::rand() % 3;

    if (choice == 0)      return (new A());
    else if (choice == 1) return (new B());
    return (new C());
}`, cap: "โค้ดจริง — `srand` ต้องเพาะใน `main` ครั้งเดียว ไม่งั้นได้คลาสเดิมทุกรอบ", lang: "cpp" },
      { note: "A/B/C ว่างสนิทโดยเจตนา — ทั้งข้อวัดว่ารู้จัก `dynamic_cast` ไหม ไม่ได้วัดว่าเขียนคลาสเป็นไหม. subject จึงยกเว้น OCF ให้ทั้ง 4 คลาส" },
    ],

    architecture: [
      { h: "ไฟล์ในแต่ละข้อ" },
      { table: { head: ["ข้อ", "ไฟล์", "จุดสำคัญ"], rows: [
        ["ex00", "ScalarConverter.{hpp,cpp}, main.cpp", "ฟังก์ชันช่วยเป็น `static` ระดับไฟล์ใน `.cpp` — ไม่ต้องโผล่ใน header"],
        ["ex01", "Serializer.{hpp,cpp}, Data.hpp, main.cpp", "`Data` เป็น struct ในไฟล์ของตัวเอง"],
        ["ex02", "Base.{hpp,cpp}, A/B/C.hpp, Identify.{hpp,cpp}, main.cpp", "`generate`/`identify` เป็นฟังก์ชันอิสระ ไม่ใช่เมธอด"],
      ]}},
      { h: "โครงของ ex00" },
      { code: String.raw`convert(literal)
   │
   ├── ตรวจชนิด ─── isCharLiteral / isPseudoLiteral / isIntLiteral
   │                 isFloatLiteral / isDoubleLiteral
   │
   ├── ดึงค่า ────── getCharValue / getPseudoValue / strtol / strtod
   │                        │
   │                        ▼
   │                   double d      ★ ทุกอย่างมารวมที่นี่
   │                        │
   └── พิมพ์ ─────── printChar(d) printInt(d) printFloat(d) printDouble(d)
                            └── ใช้ formatFloating() ร่วมกัน 2 ตัว`, cap: "คอขวดเดียวคือ `double d` — ก่อนหน้านั้นคือการอ่าน หลังจากนั้นคือการพิมพ์", lang: "txt" },
      { h: "ผลลัพธ์ที่ต้องได้ (จาก subject)" },
      { code: String.raw`$ ./convert 0
char: Non displayable
int: 0
float: 0.0f
double: 0.0

$ ./convert nan
char: impossible
int: impossible
float: nanf
double: nan

$ ./convert 42.0f
char: '*'
int: 42
float: 42.0f
double: 42.0`, cap: "diff กับผลของเพื่อนได้เลย — ตัวอักษรต้องตรงทุกตัว", lang: "bash" },
    ],

    dataflow: [
      { h: "ex00 — ไล่ตัวอย่างจริง" },
      { code: String.raw`./convert 'A'
  isCharLiteral: ยาว 3 และ s[0]==s[2]=='\''  → ใช่
  getCharValue:  s[1] = 'A' = 65             → d = 65.0
  printChar:     อยู่ในช่วง, isprint         → 'A'
  printInt:      static_cast<int>(65.0)      → 65
  printFloat:    "65" ไม่มีจุด → เติม .0     → 65.0f
  printDouble:                                → 65.0

./convert -inff
  isPseudoLiteral: ตรง                        → ใช่
  getPseudoValue:  s[0]=='-'                  → d = -infinity
  printChar:       isInf                      → impossible
  printInt:        isInf                      → impossible
  printFloat:      isInf และ d<0              → -inff
  printDouble:                                → -inf

./convert hello
  ไม่ตรงเงื่อนไขไหนเลย → พิมพ์ impossible ทั้ง 4 บรรทัดแล้ว return`, cap: "3 เส้นทางที่ต่างกัน: ค่าปกติ, ค่าพิเศษ, และค่าที่อ่านไม่ออก", lang: "txt" },

      { h: "ex01 — พิสูจน์ว่ากลับมาเหมือนเดิม" },
      { code: String.raw`Data data;
data.id = 42;  data.name = "answer";  data.value = 4.2;

uintptr_t raw     = Serializer::serialize(&data);
Data      *back   = Serializer::deserialize(raw);

std::cout << &data << std::endl;        // 0x7ffd1234abcd
std::cout << raw << std::endl;          // 140725417558477   (บิตชุดเดียวกัน)
std::cout << back << std::endl;         // 0x7ffd1234abcd    ★ ต้องเท่าเดิม
std::cout << (back == &data) << std::endl;   // 1
std::cout << back->name << std::endl;   // "answer"  ★ อ่านค่าผ่านตัวที่กู้มาได้`, cap: "แค่ address เท่ากันยังไม่พอ — อ่านฟิลด์ผ่านมันให้เห็นด้วยว่าเป็น object เดิมจริง", lang: "cpp" },
      { note: "ข้อนี้ไม่มี `new` เลยจึงไม่มีอะไรให้รั่ว — แต่รัน valgrind ให้ติดเป็นนิสัย" },

      { h: "ex02 — ทั้ง 2 overload ต้องตอบตรงกัน" },
      { code: String.raw`std::srand(std::time(NULL));       // ★ ครั้งเดียวใน main

for (int i = 0; i < 10; i++)
{
    Base *p = generate();
    std::cout << "ptr: ";  identify(p);
    std::cout << "ref: ";  identify(*p);      // ★ ส่ง reference โดย dereference
    delete p;                                  // ★ ต้องมี virtual ~Base()
}

ผลที่ถูก: ptr: กับ ref: ตรงกันทุกคู่เสมอ
          ถ้าไม่ตรง = ตรรกะใน overload ใดตัวหนึ่งผิด`, cap: "รันหลายรอบต้องได้ลำดับคลาสต่างกัน — ถ้าเหมือนเดิมทุกรอบแปลว่า srand ไม่ทำงาน", lang: "cpp" },
    ],

    implementation: [
      { h: "ลำดับการลงมือเขียน" },
      { ul: [
        "1. **ex01 ก่อน** — สั้นที่สุด (2 ฟังก์ชัน) และทำให้คุ้นกับสำนวนคลาสที่สร้างไม่ได้ก่อนไปเจอ ex00 ที่ยาว",
        "2. **ex02** — Base + A/B/C + 2 overload. ใส่ `virtual ~Base()` ตั้งแต่บรรทัดแรก",
        "3. **ex00** — ยาวที่สุด. ทำเป็น 3 ชั้น: ตรวจชนิด → ดึงค่าเป็น double → พิมพ์ 4 บรรทัด แล้วเทสทีละชั้น",
      ]},
      { h: "อาการพัง → สาเหตุ" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้"], rows: [
        ["`'isnan' is not a member of 'std'`", "เป็นของ C++11", "เขียนเอง: `d != d` และ `numeric_limits::infinity()`"],
        ["`42` พิมพ์เป็น `42f`", "ลืมเติม `.0`", "เติมเมื่อสตริงไม่มี `.` และไม่มี `e`"],
        ["`4.2` พิมพ์เป็น `4.20000f`", "ใช้ `std::fixed` / `setprecision`", "ใช้การสตรีมแบบปกติ"],
        ["`./convert 0` ให้ `char: impossible`", "ปนกันระหว่าง 2 ความหมาย", "นอกช่วง/NaN/Inf = impossible; ในช่วงแต่พิมพ์ไม่ได้ = Non displayable"],
        ["`static_cast` ถูกปฏิเสธใน ex01", "**ถูกต้องแล้ว**", "ใช้ `reinterpret_cast`"],
        ["`source type is not polymorphic`", "`Base` ไม่มี virtual", "`virtual ~Base();`"],
        ["`identify(Base&)` ไม่พิมพ์อะไร", "ลืมว่ารูปแบบ reference โยน exception", "ครอบ try/catch ทีละชนิด"],
        ["`bad_cast` ... `<typeinfo>`", "พยายามจับชนิดที่ห้าม include", "จับ `std::exception &` จาก `<exception>`"],
        ["`generate()` คืนคลาสเดิมทุกรอบ", "ไม่ได้ `srand`", "`std::srand(std::time(NULL));` ใน `main` ครั้งเดียว"],
        ["leak ใน ex02", "ลืม `delete` หรือไม่มี virtual destructor", "ทั้ง 2 อย่าง"],
      ]}},
      { h: "build / test" },
      { code: String.raw`cd ex00 && make re
./convert 0 && ./convert nan && ./convert 42.0f && ./convert 'A'
./convert "" ; ./convert abc ; ./convert 2147483648 ; ./convert +inff

# ขอบของ char
for v in 31 32 126 127; do echo "--- $v"; ./convert $v; done

# ex02 รันหลายรอบต้องได้ผลต่างกัน
cd ../ex02 && make re && ./identify && ./identify

# valgrind ทุกข้อ
valgrind --leak-check=full --error-exitcode=42 -q ./identify

# บน Windows ผ่าน WSL
wsl --exec bash -lc 'cd "/mnt/d/Projects/42/CPP Module 06/ex00" && make re && ./convert 42.0f'

# ของต้องห้าม (รวม typeinfo ใน ex02)
grep -rnE 'printf|[mc]alloc|free\(|using namespace|friend|typeinfo' ex0*/*.cpp ex0*/*.hpp`, lang: "bash" },
      { note: "ex00 ต้อง diff กับตัวอย่างใน subject ทีละบรรทัด — ข้อนี้ตรวจด้วยตัวอักษร ไม่ใช่ด้วย 'ประมาณนั้น'" },
    ],

    tricks: [
      { h: "ทริค 1: จำ cast 4 ตัวด้วยประโยคเดียว" },
      { p: "`static` = แปลงค่าที่คอมไพเลอร์รู้วิธี · `dynamic` = ถาม object ตอนรันว่าเป็นใคร · `const` = ถอดคำสัญญา const · `reinterpret` = มองบิตชุดเดิมเป็นชนิดใหม่" },
      { h: "ทริค 2: เขียน ex01 ก่อน ex00" },
      { p: "ex01 มี 2 ฟังก์ชัน — ทำเสร็จใน 10 นาทีและได้เห็นสำนวนคลาสที่สร้างไม่ได้ก่อนไปเจอ ex00 ที่ยาวกว่ามาก" },
      { h: "ทริค 3: ให้ทุกอย่างลอดผ่าน `double` ตัวเดียว" },
      { p: "แทนที่จะเขียนทาง 4×4 ตัวแปลง เหลือ 'อ่านเป็น double' 1 ที่ กับ 'พิมพ์จาก double' 4 ที่ — โค้ดสั้นลงมากและเทสง่าย" },
      { h: "ทริค 4: ทำฟังก์ชันช่วยเป็น `static` ระดับไฟล์" },
      { p: "`isNan`, `isCharLiteral`, `printChar` ฯลฯ ไม่ต้องอยู่ใน header เลย — ประกาศ `static` ใน `.cpp` ทำให้ header สะอาดและกรรมการเห็นทางเข้าเดียวคือ `convert`" },
      { h: "ทริค 5: เทส ex00 ด้วยลูปแทนการพิมพ์มือ" },
      { p: "`for v in 0 31 32 126 127 nan -inff 42.0f abc \"\"; do ./convert \"$v\"; done` — ครอบเคสขอบทั้งหมดในคำสั่งเดียว รันซ้ำได้ทุกครั้งที่แก้โค้ด" },
      { h: "ทริค 6: `virtual ~Base()` แก้ 2 ปัญหาพร้อมกัน" },
      { p: "ทำให้คลาสเป็น polymorphic (`dynamic_cast` ใช้ได้) และทำให้ `delete` ผ่าน `Base*` ไม่รั่ว — บรรทัดเดียวจบทั้งคู่" },
      { h: "ทริค 7: `(void)` หน้า dynamic_cast แบบ reference" },
      { p: "เราสนใจแค่ว่ามัน 'ไม่โยน' ไม่ได้ใช้ผลลัพธ์ — `(void)` บอกคอมไพเลอร์ให้เงียบเรื่องค่าที่ไม่ได้ใช้ ภายใต้ `-Wextra -Werror`" },
    ],

    eval: [
      { qa: [
        { q: "C++ มี cast กี่แบบ แต่ละแบบใช้ตอนไหน?", a: "4 แบบ — `static_cast` แปลงระหว่างชนิดที่เกี่ยวข้อง, `dynamic_cast` แปลงลงในสายสืบทอดแบบตรวจตอนรัน, `const_cast` ถอด/ใส่ const, `reinterpret_cast` ตีความบิตใหม่" },
        { q: "ทำไมไม่ใช้ cast แบบ C `(type)x`?", a: "มันไล่ลองทั้ง 4 แบบให้เอง อ่านโค้ดแล้วไม่รู้ว่าเกิดอะไรขึ้นและ grep หาไม่ได้. ชื่อยาวของ C++ ตั้งใจให้เห็นชัดว่าตรงนี้กำลังข้ามระบบชนิด" },
        { q: "ทำไม ex01 ต้องใช้ `reinterpret_cast` ไม่ใช่ `static_cast`?", a: "`Data*` กับ `uintptr_t` ไม่มีความสัมพันธ์กัน ไม่มีกฎแปลงค่าให้คอมไพเลอร์ทำตาม. `reinterpret_cast` เท่านั้นที่บอกว่าเอาบิตชุดเดิมมามองเป็นชนิดใหม่" },
        { q: "ทำไมต้อง `uintptr_t` ไม่ใช่ `int`?", a: "`int` อาจแคบกว่า pointer (64-bit: int 4 ไบต์, pointer 8 ไบต์) — บิตจะหาย. `uintptr_t` ถูกนิยามว่าใหญ่พอเก็บ pointer ได้แน่นอน" },
        { q: "`dynamic_cast` ต้องการอะไรจากคลาส?", a: "คลาสฐานต้องเป็น polymorphic — มี virtual method อย่างน้อย 1 ตัว (ปกติคือ virtual destructor) เพราะข้อมูลชนิดตอนรันแนบมากับ vtable" },
        { q: "`dynamic_cast` แบบ pointer กับแบบ reference ต่างกันยังไง?", a: "pointer คืน `NULL` เมื่อล้มเหลว; reference **โยน `std::bad_cast`** เพราะ reference เป็น null ไม่ได้จึงไม่มีค่าไหนแทน 'ล้มเหลว' ได้" },
        { q: "ทำไม ex02 จับ `std::exception&` ไม่จับ `std::bad_cast`?", a: "`bad_cast` ประกาศใน `<typeinfo>` ซึ่ง subject ห้าม include. `bad_cast` สืบทอดจาก `std::exception` จึงจับด้วยตัวฐานได้และไม่ผิดกฎ" },
        { q: "`impossible` กับ `Non displayable` ต่างกันยังไง?", a: "`impossible` = แปลงเป็นชนิดนั้นไม่ได้เลย (NaN/Inf หรืออยู่นอกช่วง). `Non displayable` = แปลงได้จริงแต่ไม่ใช่อักขระที่พิมพ์ออกจอได้ เช่น 0 หรือ 31" },
        { q: "ทำไม `std::isnan` ใช้ไม่ได้?", a: "เข้ามาใน C++11 — ใต้ `-std=c++98` compile ไม่ผ่าน. เขียนเองด้วย `d != d` ซึ่งจริงเฉพาะกับ NaN ตามมาตรฐาน IEEE 754" },
        { q: "จัดรูป float ให้ได้ `42.0f` แต่ไม่ให้ `4.20000f` ยังไง?", a: "สตรีมด้วยรูปแบบปกติ (ไม่ใช้ `std::fixed`) แล้วเติม `.0` เฉพาะตอนผลลัพธ์ไม่มี `.` และไม่มี `e`" },
        { q: "ทำไมแปลง literal เป็น `double` ตัวเดียวก่อน?", a: "ลดจาก 16 เส้นทาง (4 ชนิด × 4 ชนิด) เหลือ 5 — อ่านเป็น double 1 ที แล้วพิมพ์จาก double อีก 4 ที. double เก็บทั้ง char/int/float ได้ครบ" },
        { q: "ทำให้คลาสสร้าง object ไม่ได้ทำยังไง?", a: "ประกาศ OCF ทั้ง 4 ตัวไว้ใน `private` — ยังครบตามที่ subject บังคับ แต่ผู้ใช้เรียกไม่ได้ เหลือแค่ static method เป็นทางเข้า" },
        { q: "`std::isprint` ทำไมต้อง cast ก่อนส่ง?", a: "ฟังก์ชันใน `<cctype>` รับค่าที่ต้องอยู่ในช่วงของ `unsigned char` — ส่ง `char` ที่ติดลบเข้าไปตรง ๆ เป็น undefined behaviour" },
      ]},
      { h: "เช็กลิสต์ก่อนส่ง" },
      { code: String.raw`# 1. คอมไพล์ทั้ง 3 ข้อแบบเข้ม
for d in ex00 ex01 ex02; do (cd $d && make re) || echo "FAIL $d"; done

# 2. ex00 ตรงกับตัวอย่างใน subject ทุกตัวอักษร
./convert 0 ; ./convert nan ; ./convert 42.0f

# 3. ex00 เคสขอบ
for v in "" abc 2147483648 +inff -inff 31 32 126 127 "'A'"; do
    echo "--- $v"; ./convert "$v"; done

# 4. ex01 pointer กลับมาเท่าเดิม + อ่านฟิลด์ได้
# 5. ex02 ptr: กับ ref: ตรงกันทุกคู่ และรันหลายรอบได้ผลต่างกัน
./identify && ./identify

# 6. valgrind สะอาดทั้ง 3
valgrind --leak-check=full --error-exitcode=42 -q ./identify && echo "ผ่าน"

# 7. ไม่มีของต้องห้าม
grep -rnE 'printf|[mc]alloc|free\(|using namespace|friend|typeinfo' ex0*/*.cpp ex0*/*.hpp`, lang: "bash" },
    ],
  },
});
/* ===================== CPP MODULE 07 ===================== */
window.TEACHING_DATA.push({
  id: "cpp_module_07",
  name: "CPP Module 07",
  tag: { th: "Template — เขียนโค้ดครั้งเดียวใช้ได้ทุกชนิด. ex00 function template, ex01 template ที่รับฟังก์ชัน, ex02 class template Array พร้อม OCF + deep copy + exception",
         en: "Templates — write once, works for every type. ex00 function templates, ex01 a template taking a function, ex02 the Array class template with OCF, deep copy and exceptions" },
  accent: "#4834d4",
  sections: {
    principle: [
      { h: "Module 07 สอนอะไร" },
      { p: "**Template คือสูตร ไม่ใช่โค้ด.** เราเขียนไว้ครั้งเดียว คอมไพเลอร์ปั๊มออกมาให้ 1 ชุดต่อชนิดที่ถูกเรียกใช้จริง — `swap<int>` กับ `swap<std::string>` เป็นคนละฟังก์ชันที่คอมไพเลอร์สร้างจากสูตรเดียวกัน" },
      { code: String.raw`เขียน 1 ครั้ง:

    template <typename T>
    void swap(T &a, T &b) { T tmp = a; a = b; b = tmp; }

เรียกใช้:                       คอมไพเลอร์สร้างให้:

    int x, y;  swap(x, y);      void swap(int &, int &)
    std::string s, t;           void swap(std::string &, std::string &)
    swap(s, t);
    Fixed f, g;  swap(f, g);    void swap(Fixed &, Fixed &)

ชนิดไหนไม่ถูกเรียกใช้ = ไม่มีโค้ดถูกสร้าง`, cap: "ต่างจาก `void*` แบบ C ตรงที่ยังตรวจชนิดครบทุกตัวตอนคอมไพล์", lang: "cpp" },
      { h: "3 ข้อ" },
      { table: { head: ["ข้อ", "ไบนารี", "สอนอะไร"], rows: [
        ["ex00", "`whatever`", "function template (`swap`, `min`, `max`) + กฎเสมอให้คืนตัวหลัง"],
        ["ex01", "`iter`", "template ที่รับทั้ง **ชนิด** และ **ฟังก์ชัน**"],
        ["ex02", "`Array`", "class template + OCF + deep copy + exception"],
      ]}},
      { h: "กฎเหล็ก" },
      { ul: [
        "ห้าม `printf` / `malloc` / `free` (0 คะแนน) · ห้าม `using namespace` / `friend` · ห้าม STL container",
        "**Template ต้องอยู่ใน header** — กฎ 'ห้ามเขียนตัวฟังก์ชันใน header' ไม่ใช้กับ template และนี่คือข้อยกเว้นที่ subject ระบุไว้เอง",
        "ทั้งโมดูลจึงแทบไม่มีไฟล์ `.cpp` เลยนอกจาก `main.cpp`",
        "ex02 ห้ามแก้ `main.cpp` ที่ subject ให้มา",
      ]},
      { note: "**Template ไม่ใช่ generics แบบ Java/C#** — Java ลบชนิดทิ้งตอนรัน (type erasure) แล้วใช้โค้ดชุดเดียว. C++ สร้างโค้ดจริงแยกต่อชนิด จึงเร็วเท่าเขียนมือแต่ไบนารีใหญ่ขึ้น" },
    ],

    theory: [
      { h: "🔬 เจาะลึก A: ทำไม template ต้องอยู่ใน header — กับดัก linker อันดับ 1" },
      { p: "ถ้าเอานิสัยจากคลาสธรรมดามาใช้ (ประกาศใน `.hpp` เขียนตัวใน `.cpp`) จะได้ error ตอน **link** ไม่ใช่ตอนคอมไพล์ ซึ่งหาสาเหตุยากกว่ามาก" },
      { code: String.raw`whatever.cpp:                     main.cpp:
    template <typename T>             #include "whatever.hpp"
    void swap(T &a, T &b) { ... }     int main() { swap(x, y); }

คอมไพล์ whatever.cpp:
    คอมไพเลอร์เห็นสูตร แต่ไม่เห็นใครเรียก swap<int>
    → ไม่ปั๊มอะไรออกมาเลย → whatever.o ว่างเปล่า

คอมไพล์ main.cpp:
    เห็นการเรียก swap<int> แต่เห็นแค่คำประกาศ ไม่มีตัวฟังก์ชัน
    → ฝากไว้ให้ linker หา

link:
    undefined reference to 'void swap<int>(int&, int&)'   ★`, cap: "ต้นเหตุ: template ปั๊มโค้ด ณ จุดที่ถูกเรียก ไม่ใช่ ณ จุดที่ถูกเขียน", lang: "txt" },
      { p: "**ทางแก้:** วางตัวฟังก์ชันเต็ม ๆ ไว้ใน `.hpp` (หรือ `.tpp` ที่ `#include` ไว้ท้าย `.hpp`) เพื่อให้ทุกไฟล์ที่ใช้มันเห็นสูตรครบและปั๊มเองได้" },
      { table: { head: ["", "ฟังก์ชัน/คลาสธรรมดา", "template"], rows: [
        ["ประกาศไว้ที่", "`.hpp`", "`.hpp`"],
        ["ตัวฟังก์ชันไว้ที่", "`.cpp`", "**`.hpp`**"],
        ["ถูกคอมไพล์กี่ครั้ง", "1 ครั้ง", "1 ครั้ง **ต่อชนิดที่ใช้จริง**"],
        ["ลืมแล้วเจอ error ตอน", "คอมไพล์", "**link** (`undefined reference`)"],
      ]}},
      { note: "แยกเป็น `.tpp` แล้ว `#include \"Array.tpp\"` ก่อน `#endif` ก็ได้ — เป็นแค่การจัดระเบียบสายตา ตัว `.tpp` ยังนับเป็นเนื้อหาของ header อยู่ดี. ทั้ง 2 แบบผ่าน" },
      { qa: [
        { q: "ทำไม template ต้องอยู่ใน header?", a: "เพราะคอมไพเลอร์ปั๊มโค้ดที่จุดเรียกใช้ ไม่ใช่จุดที่เขียนสูตร. ถ้าสูตรอยู่ใน `.cpp` คนละไฟล์ ไฟล์ที่เรียกจะเห็นแค่คำประกาศ แล้วได้ `undefined reference` ตอน link" },
        { q: "`undefined reference to 'void swap<int>(int&, int&)'` แก้ยังไง?", a: "ย้ายตัวฟังก์ชัน template ไปไว้ใน header — หรือใส่ไว้ใน `.tpp` ที่ `#include` ท้าย header" },
        { q: "กฎ 'ห้ามเขียนตัวฟังก์ชันใน header' ของ 42 ขัดกันไหม?", a: "ไม่ — subject ระบุยกเว้นให้ template ไว้ชัดเจน เพราะภาษาบังคับให้ต้องเป็นแบบนั้น" },
      ]},

      { h: "🔬 เจาะลึก B: กฎเสมอต้องคืนตัวที่ 2" },
      { p: "subject กำหนดว่า `min`/`max` เมื่อ 2 ค่าเท่ากันต้องคืน **argument ตัวที่สอง**. เครื่องหมายที่เลือกใช้ตัดสินเรื่องนี้ทั้งหมด" },
      { code: String.raw`template <typename T>
const T &min(const T &a, const T &b)
{
    if (a < b)
        return (a);
    return (b);       // ★ a == b ตกมาที่นี่ → คืน b
}

ถ้าเขียน  if (a <= b) return (a);  →  a == b คืน a  ✗ ผิดตาม subject

max ก็หลักการเดียวกัน:
    if (a > b) return (a);  →  a == b ตกมาคืน b  ✓`, cap: "โค้ดจริง — เขียนแบบ 'เช็คว่าน้อยกว่าจริงหรือเปล่า ถ้าไม่ก็คืนตัวหลัง' แล้วกฎเสมอถูกอัตโนมัติ", lang: "cpp" },
      { p: "**ทำไมคืน `const T &` ไม่ใช่ `T`:** คืน reference ไม่ต้องก๊อป object — สำคัญเมื่อ `T` เป็นของใหญ่อย่าง `std::string`. `const` เพราะเราไม่ได้ตั้งใจให้ผู้เรียกแก้ค่าผ่านผลลัพธ์" },
      { note: "เรียกด้วย `::min(a, b)` (มี `::` นำ) เพื่อไม่ให้ชนกับ `std::min`/`std::swap` ที่อาจถูกดึงเข้ามาโดยอ้อมผ่าน `<string>` — เป็นเหตุผลที่ subject เขียนตัวอย่างแบบนั้น" },
      { qa: [
        { q: "ทำไม `min` ต้องคืน argument ตัวที่ 2 เมื่อค่าเท่ากัน?", a: "subject กำหนดไว้. เขียน `if (a < b) return a; return b;` แล้วเงื่อนไขนี้ถูกเอง — ใช้ `<=` จะคืนตัวแรกซึ่งผิด" },
        { q: "ทำไมคืน `const T &`?", a: "หลีกเลี่ยงการก๊อป object ที่อาจใหญ่ (เช่น `std::string`) และ `const` บอกว่าผลลัพธ์ไม่ได้มีไว้ให้แก้" },
        { q: "ทำไมเรียกด้วย `::swap` ไม่ใช่ `swap`?", a: "กันชนกับ `std::swap` ที่อาจถูกดึงเข้ามาโดยอ้อม — `::` บังคับให้เลือกตัวใน global scope" },
      ]},

      { h: "🔬 เจาะลึก C: ทำไม `iter` ต้อง template ตัวฟังก์ชันด้วย" },
      { code: String.raw`template <typename T, typename F>       // ★ F คือชนิดของฟังก์ชัน
void iter(T *array, size_t length, F f)
{
    size_t i;

    if (array == NULL)
        return ;
    i = 0;
    while (i < length)
    {
        f(array[i]);
        i++;
    }
}`, cap: "โค้ดจริง — `F` แทนที่จะเป็น `void (*f)(T &)` แบบตายตัว", lang: "cpp" },
      { p: "**เขียนแบบตายตัวแล้วพังตรงไหน:**" },
      { code: String.raw`เขียนเป็น:  void iter(T *array, size_t length, void (*f)(T &))

เรียกด้วย const array:
    const int arr[] = {1, 2, 3};
    iter(arr, 3, printInt);

    T ถูกอนุมานเป็น const int
    → พารามิเตอร์ f ต้องเป็น void (*)(const int &)
    → แต่ printInt เป็น void (*)(int &)
    → ไม่ตรงกัน คอมไพล์ไม่ผ่าน

เขียนเป็น F f:
    คอมไพเลอร์รับอะไรก็ได้ที่ "เรียกด้วย f(array[i]) แล้วผ่าน"
    → ฟังก์ชันที่รับ T&, const T&, T by value, หรือแม้แต่ functor
    → ทำงานได้หมด`, cap: "subject ต้องการให้ iter รองรับทุกชนิดรวมทั้ง const — `F` คือทางที่ทำได้จริง", lang: "txt" },
      { note: "โค้ดจริงเช็ค `array == NULL` ก่อน — subject ไม่ได้บังคับ แต่กันไว้ไม่เสียหายและตอบคำถามกรรมการได้ว่าคิดเรื่องเคสขอบแล้ว" },
      { qa: [
        { q: "ทำไม `iter` ต้อง template พารามิเตอร์ฟังก์ชันด้วย?", a: "เพื่อรับได้ทั้งฟังก์ชันที่รับ `T&`, `const T&`, by value และ functor — และเพื่อให้ใช้กับอาเรย์ `const` ได้ ซึ่ง signature ตายตัวทำไม่ได้" },
        { q: "`iter` กับ `const int[]` ทำงานยังไง?", a: "`T` ถูกอนุมานเป็น `const int` แล้วคอมไพเลอร์เลือกตัว `f` ที่เข้ากันได้เอง — เป็นไปได้เพราะพารามิเตอร์ฟังก์ชันเป็น template ไม่ใช่ชนิดตายตัว" },
      ]},

      { h: "🔬 เจาะลึก D: `Array` — class template ที่ต้องทำ deep copy" },
      { code: String.raw`template <typename T>
class Array
{
    private:
        T            *_data;
        unsigned int _size;

    public:
        Array(void) : _data(new T[0]), _size(0) {}
        Array(unsigned int n) : _data(new T[n]), _size(n) {}

        Array(Array const &other) : _data(new T[other._size]), _size(other._size)
        {
            for (unsigned int i = 0; i < _size; i++)
                _data[i] = other._data[i];
        }

        Array &operator=(Array const &other)
        {
            if (this != &other)
            {
                delete [] _data;
                _size = other._size;
                _data = new T[_size];
                for (unsigned int i = 0; i < _size; i++)
                    _data[i] = other._data[i];
            }
            return (*this);
        }

        ~Array(void) { delete [] _data; }
};`, cap: "โค้ดจริง — deep copy หลักการเดียวกับ Brain ใน Module 04 แต่คราวนี้เป็นบัฟเฟอร์ทั้งก้อน", lang: "cpp" },
      { p: "**`main.cpp` ของ subject จับ shallow copy ได้โดยตรง** — มันสร้างสำเนาใน scope ย่อย แล้วพอออกจาก scope จึงตรวจว่าตัวต้นฉบับยังเหมือนเดิม. ถ้า `_data` ถูกแชร์ destructor ของสำเนาจะ `delete []` บัฟเฟอร์ของต้นฉบับ แล้วบรรทัด *\"didn't save the same value!!\"* จะโผล่" },
      { p: "**`new T[0]` ถูกกฎหมาย** — คืน pointer ที่ไม่ใช่ NULL และ `delete []` ได้ตามปกติ. ประโยชน์คือ destructor เขียนแบบเดียวจบ ไม่ต้องเช็ค `if (_data)` ให้รก" },
      { qa: [
        { q: "`Array` ต้อง deep copy ทำไม?", a: "เพราะมันถือ `T *_data` ที่ `new[]` เอง. ถ้าก๊อป pointer เฉย ๆ สำเนากับต้นฉบับจะชี้บัฟเฟอร์เดียวกัน — แก้ตัวหนึ่งกระทบอีกตัว และ destructor จะ `delete []` ซ้ำ" },
        { q: "`new T[0]` ทำได้ไหม?", a: "ได้ — มาตรฐานรับรอง คืน pointer ไม่ NULL ที่ `delete []` ได้ ทำให้ destructor เขียนแบบเดียวไม่ต้องแยกกรณีอาเรย์ว่าง" },
        { q: "`operator=` ของ Array ต้องระวังอะไร?", a: "เช็ค self-assignment ก่อน แล้ว `delete []` ของเก่า จองใหม่ ก๊อปทีละตัว. ข้าม self-check แล้ว `a = a` จะลบบัฟเฟอร์ตัวเองก่อนจะก๊อปจากมัน" },
      ]},

      { h: "🔬 เจาะลึก E: `numbers[-2]` ถูกจับด้วยการเช็คบรรทัดเดียว" },
      { p: "`operator[]` รับ `unsigned int`. เมื่อ `main` เขียน `numbers[-2]` ค่า `-2` ถูกแปลงเป็น unsigned ตั้งแต่ตอนส่งเข้ามา — กลายเป็นตัวเลขมหาศาล" },
      { code: String.raw`numbers[-2]

   -2 (int, 32 บิต)  =  1111 1111 1111 1111 1111 1111 1111 1110
   ตีความเป็น unsigned =  4294967294

   if (index >= _size)     ←  4294967294 >= size แน่นอน
       throw OutOfBoundsException();

การเช็คบรรทัดเดียวจับได้ทั้ง 2 กรณี:
   index ติดลบ        → กลายเป็นเลขมหาศาล → จับได้
   index >= size      → จับได้ตรง ๆ (ช่องที่ใช้ได้คือ 0 ถึง size-1)`, cap: "เขียน `if (index < 0)` แยกไม่ได้และไม่ต้อง — ค่าไม่มีทางติดลบตอนมาถึงแล้ว", lang: "cpp" },
      { note: "เป็นพฤติกรรมเดียวกับ `unsigned` underflow ใน `takeDamage` ของ Module 03 — ต่างกันที่คราวนี้เราใช้มันให้เป็นประโยชน์แทนที่จะเป็นบั๊ก" },
      { qa: [
        { q: "`numbers[-2]` ถูกจับได้ยังไงทั้งที่ index เป็น unsigned?", a: "`-2` ถูกแปลงเป็น unsigned ตั้งแต่ตอนส่งเข้าฟังก์ชัน กลายเป็น 4294967294 ซึ่ง `>= _size` แน่นอน — การเช็คเดียวจับทั้ง 'ติดลบ' และ 'เกินขอบ'" },
        { q: "ต้องเขียน `if (index < 0)` แยกไหม?", a: "ไม่ได้และไม่ต้อง — พารามิเตอร์เป็น `unsigned int` จึงไม่มีทางติดลบ. คอมไพเลอร์จะเตือนว่าเงื่อนไขเป็นเท็จเสมอด้วยซ้ำ" },
      ]},

      { h: "📖 อ่านเพิ่มเติม" },
      { links: [
        { label: "cppreference — Templates", url: "https://en.cppreference.com/w/cpp/language/templates", note: "ภาพรวม function template + class template" },
        { label: "cppreference — Template argument deduction", url: "https://en.cppreference.com/w/cpp/language/template_argument_deduction", note: "คอมไพเลอร์เดา `T` จาก argument ยังไง" },
        { label: "isocpp FAQ — Templates", url: "https://isocpp.org/wiki/faq/templates", note: "ข้อ 'why can't I separate template definition' คือกับดักที่โมดูลนี้เจอ" },
        { label: "learncpp — Class templates", url: "https://www.learncpp.com/cpp-tutorial/class-templates/", note: "อธิบาย Array<T> แบบทีละขั้น" },
      ]},
    ],

    foundations: [
      { h: "ex00 — whatever.hpp" },
      { code: String.raw`template <typename T>
void swap(T &a, T &b)
{
    T tmp;

    tmp = a;
    a = b;
    b = tmp;
}

ข้อกำหนดที่ T ต้องมี:
    swap → ต้อง copy/assign ได้
    min  → ต้องมี operator<
    max  → ต้องมี operator>

std::string มีครบทั้ง 3 → ใช้ได้ทันทีโดยไม่ต้องแก้อะไร
Fixed ของ Module 02 ก็มีครบ → ใช้ได้เหมือนกัน`, cap: "template ไม่ได้บังคับว่า T ต้องสืบทอดจากอะไร — แค่ต้อง 'ทำสิ่งที่โค้ดข้างในเรียกใช้' ได้", lang: "cpp" },
      { h: "ผลลัพธ์ที่ต้องได้เป๊ะ (ex00)" },
      { code: String.raw`a = 3, b = 2
min( a, b ) = 2
max( a, b ) = 3
c = chaine2, d = chaine1
min( c, d ) = chaine1
max( c, d ) = chaine2`, cap: "ครึ่งล่างเป็น `std::string` เพื่อพิสูจน์ว่า template เดียวกันใช้ได้จริงกับชนิดที่ต่างกันสิ้นเชิง", lang: "txt" },

      { h: "ex02 — สมาชิกที่ต้องมีครบ" },
      { table: { head: ["สมาชิก", "พฤติกรรม"], rows: [
        ["`Array()`", "อาเรย์ว่าง — `_size = 0`, `_data = new T[0]`"],
        ["`Array(unsigned int n)`", "`n` ช่อง แต่ละช่อง**ตั้งค่าเริ่มต้น**ให้ (`new T[n]`)"],
        ["`Array(const Array &)`", "**deep copy**"],
        ["`operator=`", "**deep copy** และปลอดภัยเมื่อ assign ตัวเอง"],
        ["`~Array()`", "`delete [] _data`"],
        ["`T &operator[](unsigned int)`", "โยนถ้าเกินขอบ"],
        ["`const T &operator[](unsigned int) const`", "เวอร์ชัน const สำหรับ object ที่เป็น const"],
        ["`unsigned int size() const`", "จำนวนช่อง ไม่รับ argument"],
      ]}},
      { code: String.raw`class OutOfBoundsException : public std::exception
{
    public:
        virtual const char *what(void) const throw()
        {
            return ("Array: index out of bounds");
        }
};`, cap: "ประกาศซ้อนใน Array — และเขียนตัวฟังก์ชันในคลาสได้เพราะทั้งไฟล์เป็น template อยู่แล้ว", lang: "cpp" },
      { p: "**ทำไมต้องมี `operator[]` 2 เวอร์ชัน:** `const Array<int> a(5);` เรียกได้เฉพาะเมธอดที่เป็น `const`. ถ้ามีแต่เวอร์ชันไม่ const จะอ่านค่าจาก array ที่เป็น const ไม่ได้เลย — เป็นคู่ที่ต้องมาด้วยกันเสมอ (หลักการเดียวกับ `min`/`max` ของ Point ใน Module 02)" },
    ],

    architecture: [
      { h: "ไฟล์ในแต่ละข้อ — เกือบไม่มี .cpp เลย" },
      { table: { head: ["ข้อ", "ไฟล์", "หมายเหตุ"], rows: [
        ["ex00", "`whatever.hpp`, `main.cpp`", "3 function template ล้วน"],
        ["ex01", "`iter.hpp`, `main.cpp`", "1 function template + ฟังก์ชันสาธิตใน main"],
        ["ex02", "`Array.hpp`, `main.cpp`", "class template ทั้งก้อน — **ห้ามแก้ main ที่ให้มา**"],
      ]}},
      { p: "Makefile จึงคอมไพล์แค่ `main.cpp` — ไม่มี object file ของ template เพราะ template ถูกปั๊มเข้าไปใน `main.o` ตอนคอมไพล์อยู่แล้ว" },

      { h: "2 กับดักของ Makefile ใน ex02" },
      { code: String.raw`# 1. main.cpp ที่ให้มาเขียน  #include <Array.hpp>  (วงเล็บมุม ไม่ใช่เครื่องหมายคำพูด)
CXXFLAGS = -Wall -Wextra -Werror -std=c++98 -I.
                                             ^^^
    ไม่มี -I.  →  fatal error: Array.hpp: No such file or directory`, cap: "วงเล็บมุมสั่งให้หาใน include path เท่านั้น ไม่หาในโฟลเดอร์ปัจจุบัน", lang: "make" },
      { code: String.raw`# 2. main.cpp ที่ให้มาเรียก srand/rand/time แต่ include แค่ <iostream> กับ <Array.hpp>
error: 'srand' was not declared in this scope
error: 'rand'  was not declared in this scope

แก้ main ไม่ได้ (subject ห้าม) → ส่ง declaration ผ่าน header ที่มัน include อยู่แล้ว:

// Array.hpp
#include <cstddef>     // size_t
#include <cstdlib>     // rand, srand   ★ ทำให้ main ที่ให้มาคอมไพล์ผ่าน
#include <ctime>       // time          ★
#include <exception>   // std::exception`, cap: "แปลกที่ header ของ container ต้องดึง `<cstdlib>` เข้ามา — แต่เป็นทางที่สะอาดที่สุดเมื่อแก้ main ไม่ได้ และกรรมการยอมรับกันทั่วไป", lang: "cpp" },
      { note: "2 ข้อนี้คือสาเหตุที่ ex02 คอมไพล์ไม่ผ่านของคนส่วนใหญ่ — ไม่ใช่ตรรกะของ Array ผิด" },
    ],

    dataflow: [
      { h: "ex02 — main ของ subject ทดสอบอะไร" },
      { code: String.raw`Array<int> numbers(MAX_VAL);
int *mirror = new int[MAX_VAL];
srand(time(NULL));
for (int i = 0; i < MAX_VAL; i++) { int v = rand(); numbers[i] = v; mirror[i] = v; }

{
    Array<int> tmp = numbers;      // copy constructor
    Array<int> test(tmp);          // copy constructor อีกที
}                                  // ★ ทั้ง tmp และ test ถูกทำลายตรงนี้

for (int i = 0; i < MAX_VAL; i++)
    if (mirror[i] != numbers[i])
        std::cerr << "didn't save the same value!!" << std::endl;   // ★ ต้องไม่โผล่

  shallow copy: tmp/test แชร์บัฟเฟอร์กับ numbers
                → destructor ของ 2 ตัวนั้น delete[] บัฟเฟอร์ของ numbers
                → อ่านต่อ = ค่าเพี้ยนหรือ crash

  deep copy:    ต่างคนต่างบัฟเฟอร์ → numbers ไม่ถูกแตะเลย ✓`, cap: "main ตัวนี้ออกแบบมาจับ shallow copy โดยเฉพาะ — scope ย่อยกับ mirror มีไว้เพื่อสิ่งนี้", lang: "cpp" },
      { code: String.raw`try { numbers[-2] = 0; }
catch (const std::exception &e) { std::cerr << e.what() << std::endl; }
try { numbers[MAX_VAL] = 0; }
catch (const std::exception &e) { std::cerr << e.what() << std::endl; }

ต้องเห็น 2 บรรทัด:
    Array: index out of bounds
    Array: index out of bounds

  [-2]       → กลายเป็น 4294967294 → >= size → โยน
  [MAX_VAL]  → ช่องที่ใช้ได้คือ 0..MAX_VAL-1 → >= size → โยน`, cap: "จับด้วย `const std::exception &` — เป็นเหตุผลที่ต้องสืบทอดจาก `std::exception`", lang: "cpp" },

      { h: "เคสที่ main ของ subject ไม่ครอบ (ต้องเทสเอง)" },
      { table: { head: ["เคส", "ผลที่ต้องได้"], rows: [
        ["`Array<int> e;` แล้ว `e.size()`", "`0`"],
        ["`e[0]`", "โยน `OutOfBoundsException`"],
        ["ก๊อปแล้วแก้สำเนา", "ต้นฉบับต้องไม่เปลี่ยน"],
        ["`a = b` เมื่อ `a` มีข้อมูลอยู่แล้ว", "บัฟเฟอร์เก่าถูกลบ ไม่รั่ว"],
        ["`a = a`", "ไม่ crash ข้อมูลยังครบ"],
        ["`const Array<int> c(5); c[0]`", "ใช้ `operator[]` เวอร์ชัน const ได้"],
        ["`Array<std::string>`", "ทำงานได้เหมือนกัน"],
      ]}},
    ],

    implementation: [
      { h: "ลำดับการลงมือเขียน" },
      { ul: [
        "1. **ex00** — 3 ฟังก์ชันใน header เดียว. เทสกฎเสมอ (`::min(5,5)` ต้องคืนตัวหลัง) ก่อนไปต่อ",
        "2. **ex01** — `iter.hpp` + ฟังก์ชันสาธิตใน `main.cpp`. เทสกับ `int[]`, `std::string[]` และ **`const int[]`**",
        "3. **ex02** — จัดการ `-I.` กับ include ให้ main ที่ให้มาคอมไพล์ผ่านก่อน แล้วค่อยเขียน Array ทีละสมาชิก",
      ]},
      { h: "อาการพัง → สาเหตุ" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้"], rows: [
        ["`undefined reference to 'swap<int>'`", "ตัว template อยู่ใน `.cpp`", "ย้ายไป `.hpp` (หรือ `.tpp` ที่ include ท้าย header)"],
        ["`min(5,5)` คืนตัวแรก", "ใช้ `<=` แทน `<`", "`if (a < b) return (a); return (b);`"],
        ["`iter` กับ `const int[]` คอมไพล์ไม่ผ่าน", "hardcode `void (*f)(T &)`", "ใช้ `typename F` เป็นพารามิเตอร์ที่ 3"],
        ["`fatal error: Array.hpp: No such file`", "main ใช้วงเล็บมุม", "`-I.` ใน CXXFLAGS"],
        ["`'srand' was not declared in this scope`", "main ที่ให้มาไม่ include เอง และแก้ไม่ได้", "`#include <cstdlib>` และ `<ctime>` ใน `Array.hpp`"],
        ["`didn't save the same value!!`", "shallow copy", "copy ctor + `operator=` ต้องจองบัฟเฟอร์ใหม่แล้วก๊อปทีละตัว"],
        ["double free ตอนจบโปรแกรม", "shallow copy เหมือนกัน", "เหมือนกัน"],
        ["`numbers[-2]` ไม่โยน", "เช็คด้วย `>` แทน `>=` หรือรับเป็น `int`", "รับ `unsigned int` และเช็ค `if (index >= _size)`"],
        ["อ่านจาก `const Array` ไม่ได้", "ไม่มี `operator[]` เวอร์ชัน const", "เพิ่ม overload `const T &operator[](unsigned int) const`"],
        ["`make` รอบ 2 ยัง relink", "Makefile ไม่มี dependency ที่ถูก", "ให้ `.o` ขึ้นกับ header ด้วย"],
      ]}},
      { h: "build / test" },
      { code: String.raw`for d in ex00 ex01 ex02; do (cd $d && make re) || echo "FAIL $d"; done
cd ex00 && ./whatever
cd ../ex01 && ./iter
cd ../ex02 && ./Array

# ต้องไม่มีบรรทัดนี้
./Array 2>&1 | grep -q "didn't save" && echo "shallow copy!" || echo "deep copy OK"

# ต้องเห็น 2 บรรทัด out of bounds
./Array 2>&1 | grep -c "index out of bounds"

# make ซ้ำต้องไม่ relink
make && make

# valgrind
valgrind --leak-check=full --error-exitcode=42 -q ./Array && echo "ผ่าน"

# บน Windows ผ่าน WSL
wsl --exec bash -lc 'cd "/mnt/d/Projects/42/CPP Module 07/ex02" && make re && ./Array'

# ของต้องห้าม
grep -rnE 'printf|[mc]alloc|free\(|using namespace|friend|vector|algorithm' ex0*/*.hpp ex0*/*.cpp`, lang: "bash" },
      { note: "valgrind ต้องสะอาดทั้ง 3 ข้อ — ex02 เป็นตัวที่ต้องจับตา เพราะมี `new[]` ต่ออาเรย์ 1 ตัว บวกกับ object ชั่วคราวจากการก๊อป/assign" },
    ],

    tricks: [
      { h: "ทริค 1: จำว่า template อยู่ header เสมอ" },
      { p: "ยกเว้นเดียวของกฎ 'ห้ามเขียนตัวฟังก์ชันใน header' และเป็น error ที่เสียเวลาที่สุดเพราะมันโผล่ตอน link ไม่ใช่ตอนคอมไพล์" },
      { h: "ทริค 2: เขียน `if (a < b) return a; return b;` แทนการใช้ ternary กับ `<=`" },
      { p: "รูปแบบนี้ทำให้กฎเสมอ 'คืนตัวที่สอง' ถูกโดยอัตโนมัติ ไม่ต้องมานั่งคิดว่าควรใช้ `<` หรือ `<=`" },
      { h: "ทริค 3: template พารามิเตอร์ฟังก์ชันเสมอ" },
      { p: "`typename F` แทน function pointer ตายตัว — รับได้ทั้งฟังก์ชัน, ฟังก์ชันที่ overload, functor และทำให้อาเรย์ `const` ใช้ได้ โดยไม่ต้องเดา signature" },
      { h: "ทริค 4: ทำให้ main ของ subject คอมไพล์ผ่านก่อนเขียนตรรกะ" },
      { p: "ใน ex02 ให้จัดการ `-I.` กับ `#include <cstdlib> <ctime>` ให้เสร็จก่อน — ไม่งั้นจะไล่ error ที่ไม่เกี่ยวกับโค้ดตัวเองอยู่นาน" },
      { h: "ทริค 5: `operator[]` มาเป็นคู่ const/non-const เสมอ" },
      { p: "ทุกครั้งที่เขียน accessor ที่คืน reference ให้เขียน 2 เวอร์ชันทันที — ไม่งั้นพอมีใครถือ object เป็น `const` จะใช้ไม่ได้เลย" },
      { h: "ทริค 6: เทส template กับ 2 ชนิดที่ต่างกันสุดขั้ว" },
      { p: "`int` กับ `std::string` — ตัวหนึ่งเป็น POD ตัวหนึ่งจองหน่วยความจำเอง. ถ้าผ่านทั้งคู่แปลว่าไม่ได้แอบสมมติอะไรเกี่ยวกับ `T`" },
      { h: "ทริค 7: ใช้ `unsigned` ให้เป็นประโยชน์" },
      { p: "รับ index เป็น `unsigned int` แล้วเช็ค `>= size` ครั้งเดียวจับได้ทั้งติดลบและเกินขอบ — เขียนน้อยลงและไม่มีช่องโหว่" },
    ],

    eval: [
      { qa: [
        { q: "template คืออะไร?", a: "สูตรที่คอมไพเลอร์ใช้ปั๊มโค้ดจริง 1 ชุดต่อชนิดที่ถูกเรียกใช้ — เขียนครั้งเดียวใช้ได้ทุกชนิดโดยยังตรวจชนิดครบตอนคอมไพล์" },
        { q: "ทำไม template ต้องอยู่ใน header?", a: "คอมไพเลอร์ปั๊มโค้ด ณ จุดที่เรียกใช้ ถ้าสูตรอยู่คนละไฟล์ที่จุดนั้นมองไม่เห็น จะได้ `undefined reference` ตอน link" },
        { q: "template ต่างจาก generics ของ Java ยังไง?", a: "Java ลบชนิดทิ้งตอนรันแล้วใช้โค้ดชุดเดียว; C++ สร้างโค้ดจริงแยกต่อชนิด — เร็วเท่าเขียนมือแต่ไบนารีใหญ่ขึ้นและ error message ยาว" },
        { q: "คอมไพเลอร์รู้ได้ยังไงว่า `T` คืออะไร?", a: "อนุมานจากชนิดของ argument ที่ส่งเข้ามา (template argument deduction). ระบุเองก็ได้ เช่น `::min<int>(a, b)`" },
        { q: "`T` ต้องมีคุณสมบัติอะไรบ้าง?", a: "แค่รองรับสิ่งที่โค้ดข้างใน template เรียกใช้ — `swap` ต้อง assign ได้, `min` ต้องมี `operator<`. ไม่ต้องสืบทอดจากอะไรทั้งสิ้น" },
        { q: "ทำไม `min`/`max` ต้องคืน argument ตัวที่สองเมื่อค่าเท่ากัน?", a: "subject กำหนด. เขียน `if (a < b) return a; return b;` แล้วได้ผลนั้นเอง — ใช้ `<=` จะคืนตัวแรกซึ่งผิด" },
        { q: "ทำไม `iter` ต้อง template ตัวฟังก์ชัน?", a: "เพื่อรับฟังก์ชันที่รับ `T&`, `const T&`, by value หรือ functor ได้หมด และเพื่อให้ใช้กับอาเรย์ `const` ได้ ซึ่ง function pointer ตายตัวทำไม่ได้" },
        { q: "`Array` ต้อง deep copy ทำไม?", a: "เพราะมันถือบัฟเฟอร์ที่ `new[]` เอง — ก๊อป pointer เฉย ๆ จะทำให้ 2 object แชร์บัฟเฟอร์ แก้กระทบกัน และ `delete []` ซ้ำตอนทำลาย" },
        { q: "`new T[0]` ถูกกฎหมายไหม?", a: "ถูก — คืน pointer ไม่ NULL ที่ `delete []` ได้ ทำให้ destructor เขียนแบบเดียวไม่ต้องแยกกรณีอาเรย์ว่าง" },
        { q: "`numbers[-2]` โยน exception ได้ยังไง?", a: "พารามิเตอร์เป็น `unsigned int` — `-2` ถูกแปลงเป็น 4294967294 ตั้งแต่ตอนส่งเข้ามา ซึ่ง `>= _size` การเช็คเดียวจับได้ทั้ง 2 กรณี" },
        { q: "ทำไมต้องมี `operator[]` 2 เวอร์ชัน?", a: "object ที่เป็น `const` เรียกได้เฉพาะเมธอด `const`. ไม่มีเวอร์ชัน const ก็อ่านค่าจาก `const Array` ไม่ได้เลย" },
        { q: "ทำไม `OutOfBoundsException` ต้องสืบทอดจาก `std::exception`?", a: "เพราะ main ของ subject จับด้วย `const std::exception &` แล้วเรียก `e.what()` — ไม่สืบทอดก็ไม่ถูกจับ" },
        { q: "`-I.` ใน Makefile มีไว้ทำไม?", a: "main ที่ให้มาเขียน `#include <Array.hpp>` แบบวงเล็บมุม ซึ่งหาเฉพาะใน include path — `-I.` เพิ่มโฟลเดอร์ปัจจุบันเข้าไป" },
        { q: "ทำไม `Array.hpp` ต้อง include `<cstdlib>`?", a: "main ที่ subject ให้มาเรียก `srand`/`rand`/`time` แต่ include แค่ `<iostream>` กับ `<Array.hpp>` และห้ามแก้ main — จึงต้องส่ง declaration ผ่าน header ที่มันเห็น" },
      ]},
      { h: "เช็กลิสต์ก่อนส่ง" },
      { code: String.raw`# 1. ทั้ง 3 ข้อคอมไพล์ผ่านและ make ซ้ำไม่ relink
for d in ex00 ex01 ex02; do (cd $d && make re && make) ; done

# 2. ex00 ตรงกับผลใน subject ทุกบรรทัด + กฎเสมอคืนตัวที่สอง
cd ex00 && ./whatever

# 3. ex01 ใช้ได้กับ int[] / std::string[] / const int[]
cd ../ex01 && ./iter

# 4. ex02 ห้ามมี "didn't save the same value!!" และต้องมี 2 บรรทัด out of bounds
cd ../ex02 && ./Array 2>&1 | grep -c "index out of bounds"

# 5. เคสที่ main ไม่ครอบ: อาเรย์ว่าง, self-assign, const Array, Array<std::string>

# 6. valgrind สะอาดทั้ง 3
valgrind --leak-check=full --error-exitcode=42 -q ./Array && echo "ผ่าน"

# 7. ไม่มีของต้องห้าม
grep -rnE 'printf|[mc]alloc|free\(|using namespace|friend|vector' ex0*/*.hpp ex0*/*.cpp`, lang: "bash" },
    ],
  },
});
/* ===================== CPP MODULE 08 ===================== */
window.TEACHING_DATA.push({
  id: "cpp_module_08",
  name: "CPP Module 08",
  tag: { th: "STL container · iterator · algorithm — ex00 easyfind กับ std::find, ex01 Span ที่ต้องเร็วพอสำหรับ 10,000 ตัว, ex02 MutantStack ที่ทำให้ std::stack วนซ้ำได้",
         en: "STL containers, iterators, algorithms — ex00 easyfind with std::find, ex01 Span that must scale to 10,000 numbers, ex02 MutantStack making std::stack iterable" },
  accent: "#00b894",
  sections: {
    principle: [
      { h: "Module 08 สอนอะไร" },
      { p: "โมดูลนี้คือจุดที่ **STL ถูกปลดล็อก** หลังจากถูกห้ามมาตั้งแต่ Module 00. และ subject เขียนกฎไว้ชัด: *ใช้มันคือประเด็นทั้งหมดของโมดูล* — **เขียนลูปเองแล้วผลถูกก็ยังได้คะแนนแย่**" },
      { table: { head: ["ข้อ", "ไบนารี", "สอนอะไร"], rows: [
        ["ex00", "`easyfind`", "function template ที่รับ container + `std::find`"],
        ["ex01", "`span`", "คลาสที่ห่อ `std::vector` + `<algorithm>` + เติมจากช่วง iterator"],
        ["ex02", "`mutantstack`", "สืบทอด container adaptor เพื่อเปิด iterator ออกมา"],
      ]}},
      { h: "3 ส่วนของ STL ที่ใช้ในโมดูลนี้" },
      { code: String.raw`container   เก็บของ           vector list deque stack map
     │
iterator    ตัวชี้ตำแหน่ง      begin() ... end()
     │
algorithm   ทำงานกับช่วง       find sort min_element max_element

จุดเชื่อม = iterator
  algorithm ไม่รู้จัก container เลย รู้จักแค่ "ช่วงของ iterator"
  → std::find ตัวเดียวใช้ได้กับทั้ง vector, list, deque
  → เพิ่ม container ใหม่ M ตัว + algorithm ใหม่ N ตัว
     ได้ M×N ชุดค่าผสมโดยไม่ต้องเขียนอะไรเพิ่ม`, cap: "นี่คือเหตุผลที่ STL ออกแบบมาแบบนี้ — iterator เป็นข้อตกลงกลางที่ทั้ง 2 ฝั่งยึด", lang: "txt" },
      { h: "กฎเหล็ก" },
      { ul: [
        "ห้าม `printf` / `malloc` / `free` (0 คะแนน) · ห้าม `using namespace` / `friend`",
        "**เขียนลูปเองแทน algorithm = คะแนนแย่ แม้ผลจะถูก** — นี่คือกฎเฉพาะของโมดูลนี้",
        "OCF บังคับสำหรับ `Span` และ `MutantStack` (`easyfind` เป็นฟังก์ชันอิสระ ไม่ต้อง)",
        "function template อยู่ใน header · **template member ของคลาสธรรมดา (`addRange`) ก็ต้องอยู่ใน header ด้วย**",
      ]},
    ],

    theory: [
      { h: "1) iterator คืออะไร" },
      { code: String.raw`std::vector<int> v;
std::vector<int>::iterator it;

for (it = v.begin(); it != v.end(); ++it)
    std::cout << *it;

  begin()  ชี้ตัวแรก
  end()    ชี้ "ถัดจากตัวสุดท้าย" — ไม่ใช่ตัวสุดท้าย ★
  *it      อ่านค่าที่ชี้อยู่
  ++it     เลื่อนไปตัวถัดไป

ทำไม end() ถึงชี้เลยท้าย:
  ทำให้ container ว่างเขียนได้เหมือนกัน — begin() == end() ทันที
  ไม่ต้องมีเงื่อนไขพิเศษ`, cap: "iterator เลียนแบบ pointer — และสำหรับ vector มันคือ pointer จริง ๆ ในหลาย implementation", lang: "cpp" },
      { table: { head: ["ชนิด iterator", "ใช้กับ", "อ่าน/เขียน"], rows: [
        ["`iterator`", "container ที่ไม่ const", "อ่านและเขียน"],
        ["`const_iterator`", "container ที่เป็น const", "อ่านอย่างเดียว"],
        ["`reverse_iterator`", "วนจากหลังมาหน้า (`rbegin`/`rend`)", "อ่านและเขียน"],
        ["`const_reverse_iterator`", "ทั้ง 2 อย่างรวมกัน", "อ่านอย่างเดียว"],
      ]}},

      { h: "🔬 เจาะลึก A: `typename` หน้าชนิดที่ขึ้นกับ template" },
      { p: "เขียน `T::iterator` ใน template แล้วคอมไพเลอร์ไม่ยอม — เพราะมัน**ยังไม่รู้ว่า `T::iterator` เป็นชนิดหรือเป็นตัวแปร**" },
      { code: String.raw`template <typename T>
T::iterator easyfind(T &container, int value)      // ✗
{ ... }

error: need 'typename' before 'T::iterator' because 'T' is a dependent scope

สาเหตุ: ตอนอ่านสูตร คอมไพเลอร์ยังไม่รู้ว่า T คืออะไร
        T::iterator อาจเป็น...
            ชนิด          (typedef ใน T)
            ตัวแปร static (int T::iterator;)
        2 กรณีนี้ทำให้แปลประโยคต่างกันสิ้นเชิง จึงต้องบอกเอง

template <typename T>
typename T::iterator easyfind(T &container, int value)     // ✓
         ^^^^^^^^ "ตัวนี้เป็นชนิดนะ"`, cap: "กฎ: ชื่อที่ขึ้นกับ template parameter และเป็นชนิด ต้องนำหน้าด้วย `typename` เสมอ", lang: "cpp" },
      { qa: [
        { q: "`typename` ใน `typename T::iterator` มีไว้ทำไม?", a: "บอกคอมไพเลอร์ว่า `T::iterator` เป็นชื่อชนิด — เพราะตอนอ่านสูตรมันยังไม่รู้จัก `T` จึงแยกเองไม่ได้ว่าเป็นชนิดหรือเป็นตัวแปร static" },
        { q: "`need 'typename' before ... dependent scope` แก้ยังไง?", a: "เติม `typename` หน้าชื่อชนิดที่มี template parameter อยู่ในเส้นทาง" },
      ]},

      { h: "🔬 เจาะลึก B: ทำไม shortestSpan ต้อง O(n log n)" },
      { p: "subject บังคับให้เทสด้วย **10,000 ตัวขึ้นไป**. วิธีตรงไปตรงมา (เทียบทุกคู่) เป็น O(n²) ซึ่งช้าจนเห็นได้ด้วยตา" },
      { code: String.raw`วิธีเทียบทุกคู่:                      n²/2 ครั้ง
    10,000 ตัว   →  50,000,000       ยังพอไหว แต่ช้า
    100,000 ตัว  →  5,000,000,000    ค้างเป็นนาที ★

วิธีเรียงก่อน:                       n log n + n ครั้ง
    100,000 ตัว  →  ~1,700,000       เสร็จทันที

หลักการที่ทำให้ตัดได้:
    หลังเรียงแล้ว ช่องว่างที่แคบที่สุด "ต้อง" อยู่ระหว่าง 2 ตัวที่ติดกัน

    3    6    9    11    17
      3    3    2     6        ← ดูแค่ 4 คู่นี้พอ ตอบ 2
    ไม่ต้องเทียบ 3 กับ 17 เลย เพราะมีตัวคั่นอยู่ระหว่างกลางเสมอ`, cap: "การเรียงเปลี่ยนจากการเทียบ n²/2 คู่ เหลือ n-1 คู่", lang: "txt" },
      { code: String.raw`int Span::shortestSpan() const
{
    if (_numbers.size() < 2)
        throw Span::NotEnoughNumbersException();

    std::vector<int> sorted(_numbers);
    std::sort(sorted.begin(), sorted.end());

    int shortest = INT_MAX;
    for (std::vector<int>::size_type i = 1; i < sorted.size(); ++i)
    {
        long gap = static_cast<long>(sorted[i]) - sorted[i - 1];   // ★ long
        if (gap < shortest)
            shortest = static_cast<int>(gap);
    }
    return (shortest);
}`, cap: "โค้ดจริง — เรียงบน**สำเนา** เพราะ `const` method แก้ `_numbers` ไม่ได้ (และไม่ควรแก้อยู่แล้ว)", lang: "cpp" },
      { note: "**ทำไมคำนวณใน `long`:** `INT_MAX - INT_MIN` = 4,294,967,295 ซึ่งใส่ใน `int` ไม่ได้ — จะล้นกลายเป็นค่าติดลบเงียบ ๆ. คำนวณใน `long` ก่อนแล้วค่อยแคบลง" },
      { qa: [
        { q: "ทำไม `shortestSpan` ต้องเรียงก่อน?", a: "หลังเรียง ช่องว่างแคบสุดต้องอยู่ระหว่าง 2 ตัวที่ติดกันเสมอ — ลดจากเทียบ n²/2 คู่เหลือ n-1 คู่. subject เทสด้วย 10,000+ ตัว วิธี n² จะช้าจนเห็นได้" },
        { q: "ทำไมคำนวณระยะห่างใน `long`?", a: "`INT_MAX - INT_MIN` เกินช่วงของ `int` — จะล้นเป็นค่าติดลบโดยไม่มีคำเตือน. คำนวณใน `long` แล้วค่อยแปลงกลับ" },
        { q: "ทำไมเรียงบนสำเนาไม่เรียงตัวจริง?", a: "เมธอดเป็น `const` จึงแก้ `_numbers` ไม่ได้ — และผู้เรียกก็ไม่ควรเจอว่าลำดับที่ตัวเองใส่เข้าไปถูกสลับหลังเรียกฟังก์ชันอ่านค่า" },
      ]},

      { h: "🔬 เจาะลึก C: `this->c` ใน MutantStack — กฎการค้นหาชื่อในคลาสฐานที่ขึ้นกับ template" },
      { p: "`std::stack` เก็บของจริงไว้ใน member ชื่อ `c` ที่เป็น `protected`. คลาสลูกเข้าถึงได้ — **แต่ต้องเขียน `this->c` เท่านั้น**" },
      { code: String.raw`template <typename T, typename Container = std::deque<T> >
class MutantStack : public std::stack<T, Container>
{
    public:
        iterator begin(void) { return (c.begin()); }        // ✗
        iterator begin(void) { return (this->c.begin()); }  // ✓
};

error: 'c' was not declared in this scope

สาเหตุ: std::stack<T, Container> ขึ้นอยู่กับ T กับ Container
        ตอนอ่านสูตร คอมไพเลอร์ยังไม่รู้ว่าฐานหน้าตาเป็นยังไง
        → มาตรฐานสั่งว่า "อย่าไปหาชื่อในคลาสฐานที่ยังไม่รู้จัก"
        → เขียน c เฉย ๆ จึงหาไม่เจอ

this->c  เลื่อนการค้นหาไปตอน "ปั๊มโค้ดจริง" ซึ่งตอนนั้นรู้จักฐานแล้ว`, cap: "เหตุผลตระกูลเดียวกับ `typename` — ทั้งคู่คือกฎเรื่อง 'ชื่อที่ขึ้นกับ template'", lang: "cpp" },
      { p: "**ทำไมมาตรฐานทำแบบนี้:** ถ้าหาชื่อในฐานตั้งแต่ตอนอ่านสูตร แล้วมีคนไป specialize `std::stack<MyType>` ให้ไม่มี `c` ทีหลัง ความหมายของโค้ดจะเปลี่ยนย้อนหลัง. การเลื่อนไปหาตอนปั๊มจึงปลอดภัยกว่า" },
      { qa: [
        { q: "ทำไมต้องเขียน `this->c` ไม่ใช่ `c`?", a: "`c` อยู่ในคลาสฐานที่ขึ้นกับ template parameter — C++ ไม่ค้นหาชื่อในฐานแบบนั้นตอนอ่านสูตร. `this->` เลื่อนการค้นหาไปตอนปั๊มโค้ดจริงซึ่งรู้จักฐานแล้ว" },
        { q: "`c` คืออะไร?", a: "member แบบ `protected` ของ `std::stack` ที่เก็บ container จริง (ค่าเริ่มต้นคือ `std::deque<T>`). เป็นทางเดียวที่จะเข้าถึงข้อมูลข้างในได้" },
        { q: "`'c' was not declared in this scope` แก้ยังไง?", a: "เติม `this->` ข้างหน้า" },
      ]},

      { h: "🔬 เจาะลึก D: ทำไม `std::stack` ถึงไม่มี iterator ตั้งแต่แรก" },
      { p: "`std::stack` ไม่ใช่ container แต่เป็น **container adaptor** — มันห่อ container จริงไว้แล้ว*จำกัด*ทางเข้าออกให้เหลือแค่ push/pop/top โดยตั้งใจ" },
      { table: { head: ["", "container (`vector`, `deque`)", "adaptor (`stack`, `queue`)"], rows: [
        ["เก็บข้อมูลเอง", "ใช่", "ไม่ — ห่อตัวอื่นไว้ใน `c`"],
        ["iterator", "มี", "**ไม่มีโดยเจตนา**"],
        ["จุดประสงค์", "ให้เข้าถึงได้ทุกทาง", "**บังคับให้เข้าถึงแบบ LIFO เท่านั้น**"],
      ]}},
      { p: "**การไม่มี iterator คือฟีเจอร์ ไม่ใช่ข้อบกพร่อง** — stack สัญญาว่าเข้าออกแบบ LIFO เท่านั้น ถ้าวนดูตรงกลางได้ก็ไม่ใช่ stack แล้ว. ข้อนี้จึงชื่อ *'mutated abomination'* เพราะเรากำลังทำสิ่งที่ผู้ออกแบบตั้งใจกันไว้" },
      { code: String.raw`เราได้อะไรฟรีจากการสืบทอดแบบ public:
    push() pop() top() size() empty()   ← ไม่ต้องเขียนใหม่สักตัว

เราเติมเข้าไป:
    typedef iterator ทั้ง 4 ชนิด
    begin() end() rbegin() rend()  ทั้งเวอร์ชัน const และไม่ const

และเพราะสืบทอดแบบ public:
    std::stack<int> s(mstack);      ← ก๊อปกลับเป็น stack ธรรมดาได้`, cap: "การสืบทอดตรงนี้คือทางที่สั้นที่สุด — เขียนใหม่ทั้งคลาสก็ได้แต่ต้องก๊อปทุกเมธอด", lang: "cpp" },
      { qa: [
        { q: "ทำไม `std::stack` ไม่มี iterator?", a: "เพราะเป็น container adaptor ที่ตั้งใจจำกัดการเข้าถึงให้เหลือแค่ LIFO. ถ้าวนดูตรงกลางได้ มันก็ไม่ได้รับประกันความเป็น stack อีกต่อไป" },
        { q: "MutantStack ทำให้วนซ้ำได้ยังไง?", a: "สืบทอด `std::stack` แบบ public แล้วเข้าถึง member `c` ที่เป็น protected ผ่าน `this->c` เพื่อคืน iterator ของ container ข้างใน" },
        { q: "ทำไมต้อง `typedef` iterator ทั้ง 4 ชนิด?", a: "เพื่อให้เขียน `MutantStack<int>::iterator it = ...;` ได้ — ไม่มี typedef ก็ไม่มีชื่อชนิดนั้นอยู่จริง" },
      ]},

      { h: "🔬 เจาะลึก E: `addRange` — เลียนแบบสำนวนของ STL" },
      { code: String.raw`template <typename InputIterator>
void addRange(InputIterator begin, InputIterator end)
{
    if (_numbers.size() + static_cast<unsigned int>(std::distance(begin, end))
        > _maxSize)
        throw Span::FullException();
    _numbers.insert(_numbers.end(), begin, end);
}`, cap: "โค้ดจริง — เป็น template member ของคลาสธรรมดา จึงต้องอยู่ใน header", lang: "cpp" },
      { p: "**ทำไมรับเป็นช่วง iterator ไม่ใช่ `std::vector<int>`:** เพราะรูปแบบ `(first, last)` คือสำนวนที่ STL ใช้ทั้งหมด — ผู้เรียกจะส่งมาจาก `vector`, `list`, `deque` หรือแม้แต่อาเรย์ C ธรรมดา (`arr`, `arr + n`) ก็ได้ โดยเราไม่ต้องรู้ว่ามันมาจากไหน" },
      { p: "**เช็คความจุก่อนแทรก:** `std::distance(begin, end)` บอกจำนวนก่อนล่วงหน้า จึงโยนได้ก่อนที่ `_numbers` จะถูกแตะ — ถ้าแทรกไปแล้วค่อยเช็ค object จะค้างในสถานะครึ่ง ๆ กลาง ๆ" },
      { qa: [
        { q: "ทำไม `addRange` รับ iterator 2 ตัวแทนที่จะรับ container?", a: "เป็นสำนวนของ STL — รับได้จากทุกแหล่งรวมทั้งอาเรย์ C และรับได้แค่บางส่วนของ container ก็ได้ โดยเราไม่ต้องรู้ชนิดต้นทาง" },
        { q: "ทำไม `addRange` ต้องอยู่ใน header?", a: "เพราะเป็น template member — แม้คลาสจะไม่ใช่ template ตัวเมธอดก็ยังถูกปั๊มที่จุดเรียกใช้จึงต้องเห็นสูตรครบ" },
        { q: "`std::distance` มีไว้ทำอะไรตรงนี้?", a: "นับจำนวนสมาชิกในช่วงเพื่อเช็คความจุ**ก่อน**แทรก — จะได้ไม่เหลือ object ในสถานะแทรกไปครึ่งเดียวเวลาโยน" },
      ]},

      { h: "📖 อ่านเพิ่มเติม" },
      { links: [
        { label: "cppreference — Containers library", url: "https://en.cppreference.com/w/cpp/container", note: "ภาพรวม container ทั้งหมดและความต่างของแต่ละตัว" },
        { label: "cppreference — Iterator library", url: "https://en.cppreference.com/w/cpp/iterator", note: "หมวดหมู่ของ iterator และ `std::distance`" },
        { label: "cppreference — std::find", url: "https://en.cppreference.com/w/cpp/algorithm/find", note: "algorithm ตัวหลักของ ex00" },
        { label: "cppreference — std::stack", url: "https://en.cppreference.com/w/cpp/container/stack", note: "ดูที่ member `c` ที่เป็น protected" },
        { label: "isocpp FAQ — dependent names", url: "https://isocpp.org/wiki/faq/templates#nondependent-name-lookup-types", note: "ที่มาของทั้ง `typename` และ `this->`" },
      ]},
    ],

    foundations: [
      { h: "ex00 — easyfind" },
      { code: String.raw`template <typename T>
typename T::iterator easyfind(T &container, int value)
{
    typename T::iterator it;

    it = std::find(container.begin(), container.end(), value);
    if (it == container.end())
        throw std::runtime_error("easyfind: value not found");
    return (it);
}

// overload สำหรับ container ที่เป็น const
template <typename T>
typename T::const_iterator easyfind(const T &container, int value)
{
    typename T::const_iterator it;

    it = std::find(container.begin(), container.end(), value);
    if (it == container.end())
        throw std::runtime_error("easyfind: value not found");
    return (it);
}`, cap: "โค้ดจริง — 2 overload เพราะ `const` container คืนได้แค่ `const_iterator`", lang: "cpp" },
      { p: "**ทำไมคืน iterator ไม่คืน index:** `std::find` ให้ iterator มาอยู่แล้ว และ iterator ใช้ได้กับ `std::list` ที่ไม่มี index ให้พูดถึงเลย. คืน iterator จึงทำให้ฟังก์ชันเดียวใช้ได้กับทุก container จริง ๆ" },
      { note: "subject บอกให้สมมติว่า `T` เป็น container ของ `int` แบบเรียงลำดับ (sequence container) — ไม่ต้องรองรับ `map`/`set`" },

      { h: "ex01 — Span" },
      { table: { head: ["สมาชิก", "พฤติกรรม"], rows: [
        ["`Span(unsigned int n)`", "ความจุ N"],
        ["OCF ครบ 4", "บังคับตั้งแต่ Module 02"],
        ["`addNumber(int)`", "เติม 1 ตัว — **โยนถ้าเต็มแล้ว**"],
        ["`shortestSpan() const`", "ระยะห่างที่น้อยที่สุดระหว่างคู่ใด ๆ — โยนถ้ามีน้อยกว่า 2 ตัว"],
        ["`longestSpan() const`", "ระยะห่างระหว่างตัวมากสุดกับน้อยสุด — โยนถ้ามีน้อยกว่า 2 ตัว"],
        ["`addRange(begin, end)`", "template member — เติมจากช่วง iterator ในครั้งเดียว"],
      ]}},
      { code: String.raw`int Span::longestSpan() const
{
    if (_numbers.size() < 2)
        throw Span::NotEnoughNumbersException();

    int mn = *std::min_element(_numbers.begin(), _numbers.end());
    int mx = *std::max_element(_numbers.begin(), _numbers.end());

    return (static_cast<int>(static_cast<long>(mx) - mn));   // ★ กันล้น
}`, cap: "`min_element`/`max_element` คืน **iterator** ต้อง `*` เพื่อเอาค่า", lang: "cpp" },
      { code: String.raw`ตัวอย่างใน subject: Span(5) ใส่ 6, 3, 17, 9, 11

    เรียงแล้ว:   3   6   9   11   17
    ช่องว่าง:      3   3    2    6    →  shortestSpan = 2
    มากสุด - น้อยสุด = 17 - 3        →  longestSpan  = 14

ผลที่ต้องพิมพ์:
    2
    14`, cap: "ตัวเลข 2 ตัวนี้คือสิ่งที่กรรมการ diff", lang: "txt" },

      { h: "ex02 — MutantStack" },
      { code: String.raw`template <typename T, typename Container = std::deque<T> >
class MutantStack : public std::stack<T, Container>
{
    public:
        MutantStack(void) {}
        MutantStack(const MutantStack &o) : std::stack<T, Container>(o) {}
        MutantStack &operator=(const MutantStack &o)
        { std::stack<T, Container>::operator=(o); return (*this); }
        ~MutantStack(void) {}

        typedef typename Container::iterator               iterator;
        typedef typename Container::const_iterator         const_iterator;
        typedef typename Container::reverse_iterator       reverse_iterator;
        typedef typename Container::const_reverse_iterator const_reverse_iterator;

        iterator begin(void) { return (this->c.begin()); }
        iterator end(void)   { return (this->c.end()); }
        reverse_iterator rbegin(void) { return (this->c.rbegin()); }
        reverse_iterator rend(void)   { return (this->c.rend()); }

        const_iterator begin(void) const { return (this->c.begin()); }
        const_iterator end(void)   const { return (this->c.end()); }
        const_reverse_iterator rbegin(void) const { return (this->c.rbegin()); }
        const_reverse_iterator rend(void)   const { return (this->c.rend()); }
};`, cap: "`typename` ทุกตัวใน typedef และ `this->` ทุกตัวใน begin/end — 2 กฎเดียวกันซ้ำ ๆ", lang: "cpp" },
      { note: "ช่องว่างใน `std::deque<T> >` จำเป็นใน C++98 — เขียนติดกันเป็น `>>` คอมไพเลอร์จะอ่านเป็น operator เลื่อนบิต. C++11 แก้เรื่องนี้แล้วแต่โมดูลนี้ใช้ C++98" },
    ],

    architecture: [
      { h: "ไฟล์ในแต่ละข้อ" },
      { table: { head: ["ข้อ", "ไฟล์", "อยู่ header หรือ cpp"], rows: [
        ["ex00", "`easyfind.hpp`, `main.cpp`", "template ล้วน — header อย่างเดียว"],
        ["ex01", "`Span.{hpp,cpp}`, `main.cpp`", "เมธอดธรรมดาอยู่ `.cpp` · **`addRange` อยู่ `.hpp`** เพราะเป็น template"],
        ["ex02", "`MutantStack.hpp`, `main.cpp`", "class template — header อย่างเดียว"],
      ]}},
      { p: "ex01 เป็นข้อเดียวที่มี `.cpp` จริง — และเป็นตัวอย่างที่ดีของกฎ *'template อยู่ header, ที่เหลืออยู่ cpp'* ในไฟล์เดียวกัน" },

      { h: "การทดสอบที่ subject ออกแบบไว้สำหรับ ex02" },
      { code: String.raw`รันเทสชุดเดิม 2 รอบ:

  รอบ 1:  MutantStack<int> s;
          s.push(5); s.top(); s.pop(); ... วนด้วย iterator

  รอบ 2:  std::list<int> s;              ← เปลี่ยนแค่ชนิด
          s.push_back(5); s.back(); s.pop_back(); ... วนด้วย iterator

  ★ ผลลัพธ์ 2 รอบต้องเหมือนกันทุกตัวอักษร

ความหมาย: iterator ของเราทำตัวเหมือน sequence container จริงทุกประการ`, cap: "เอาไปใส่ใน main แล้ว diff กันเลย — เป็นหลักฐานที่โชว์กรรมการได้ตรง ๆ", lang: "txt" },
    ],

    dataflow: [
      { h: "ex01 — เทสความเร็วที่ subject บังคับ" },
      { code: String.raw`Span sp(100000);
std::vector<int> v;

for (int i = 0; i < 100000; i++)
    v.push_back(std::rand());
sp.addRange(v.begin(), v.end());          // เติมทีเดียว 100,000 ตัว

std::cout << sp.shortestSpan() << std::endl;
std::cout << sp.longestSpan() << std::endl;

  วิธีเรียง (n log n): เสร็จทันที
  วิธีเทียบทุกคู่ (n²): 5,000,000,000 ครั้ง → ค้างเป็นนาที ★

ถ้าโปรแกรมค้างตรงนี้ = shortestSpan ยังเป็น O(n²)`, cap: "การจับเวลาเป็นเทสที่ตรงที่สุด — ไม่ต้องอ่านโค้ดก็รู้ว่าใช้วิธีไหน", lang: "cpp" },

      { h: "ex01 — เคสที่ต้องโยน" },
      { table: { head: ["สถานการณ์", "ผลที่ถูก"], rows: [
        ["`addNumber` เมื่อเต็มแล้ว", "`FullException`"],
        ["`addRange` ที่ทำให้เกินความจุ", "`FullException` และ **ยังไม่แทรกอะไรเลย**"],
        ["`shortestSpan()` เมื่อมี 0 หรือ 1 ตัว", "`NotEnoughNumbersException`"],
        ["`longestSpan()` เมื่อมี 0 หรือ 1 ตัว", "`NotEnoughNumbersException`"],
        ["`Span(5)` ใส่ `INT_MIN` กับ `INT_MAX`", "`longestSpan` ต้องไม่ล้นเป็นค่าติดลบ"],
      ]}},

      { h: "ex02 — สิ่งที่ต้องทดสอบให้ครบ" },
      { code: String.raw`MutantStack<int> ms;
ms.push(5); ms.push(17);
ms.top();       // 17
ms.pop();
ms.size();      // 1

MutantStack<int>::iterator it = ms.begin();
while (it != ms.end()) { std::cout << *it; ++it; }        // วนไปหน้า

MutantStack<int>::reverse_iterator rit = ms.rbegin();     // วนกลับหลัง

const MutantStack<int> cms(ms);                           // copy ctor
MutantStack<int>::const_iterator cit = cms.begin();       // const_iterator

std::stack<int> s(ms);      // ★ ก๊อปกลับเป็น stack ธรรมดาได้ (สืบทอดแบบ public)

MutantStack<int> empty;
empty.begin() == empty.end();     // ★ ต้องจริง`, cap: "5 อย่างที่ต้องผ่าน: เมธอดเดิม, วนหน้า, วนหลัง, const, และ stack ว่าง", lang: "cpp" },
    ],

    implementation: [
      { h: "ลำดับการลงมือเขียน" },
      { ul: [
        "1. **ex00** — สั้นที่สุด และได้เจอกฎ `typename` ก่อนที่จะต้องใช้มันซ้ำใน ex02",
        "2. **ex02** — ตัวคลาสสั้นมาก ประเด็นอยู่ที่ `this->c` กับ typedef. ทำเทส 2 รอบ (MutantStack vs `std::list`) แล้ว diff",
        "3. **ex01** — ยาวสุด. ทำ `addNumber` + exception ให้ผ่านตัวอย่างของ subject ก่อน แล้วค่อยเพิ่ม `addRange` และเทส 100,000 ตัว",
      ]},
      { h: "อาการพัง → สาเหตุ" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้"], rows: [
        ["`need 'typename' before 'T::iterator'`", "ชื่อชนิดที่ขึ้นกับ template", "เติม `typename` ข้างหน้า"],
        ["`'c' was not declared in this scope`", "ชื่อในคลาสฐานที่ขึ้นกับ template", "`this->c`"],
        ["`MutantStack<int>::iterator does not name a type`", "ลืม `typedef`", "typedef ทั้ง 4 ชนิดจาก `Container`"],
        ["`>>` ถูกอ่านเป็น operator", "เขียน `std::deque<T>>` ติดกัน", "เว้นวรรค: `std::deque<T> >`"],
        ["โปรแกรมค้างที่ 100,000 ตัว", "`shortestSpan` เป็น O(n²)", "เรียงสำเนาแล้วไล่คู่ที่ติดกัน"],
        ["`longestSpan` ได้ค่าติดลบ", "`int` ล้น", "คำนวณใน `long` ก่อนแปลงกลับ"],
        ["`min_element` คืนค่าแปลก ๆ", "ลืม `*` — มันคืน iterator", "`*std::min_element(...)`"],
        ["`addRange` แทรกไปแล้วค่อยโยน", "เช็คหลังแทรก", "`std::distance` เช็คก่อน"],
        ["ได้คะแนนแย่ทั้งที่ผลถูก", "เขียนลูปเองแทน algorithm", "ใช้ `std::find` / `std::sort` / `min_element` / `max_element`"],
      ]}},
      { h: "build / test" },
      { code: String.raw`for d in ex00 ex01 ex02; do (cd $d && make re && make) ; done

cd ex01 && ./span            # ต้องพิมพ์ 2 แล้ว 14
time ./span                  # เทส 100,000 ตัวต้องเสร็จทันที

cd ../ex02 && ./mutantstack  # 2 บล็อกผลลัพธ์ต้องเหมือนกัน

# valgrind ทั้ง 3
valgrind --leak-check=full --error-exitcode=42 -q ./span && echo "ผ่าน"

# บน Windows ผ่าน WSL
wsl --exec bash -lc 'cd "/mnt/d/Projects/42/CPP Module 08/ex01" && make re && time ./span'

# เช็คว่าใช้ algorithm จริง ไม่ได้เขียนลูปเอง
grep -nE 'std::(find|sort|min_element|max_element|distance)' ex0*/*.hpp ex0*/*.cpp

# ของต้องห้าม
grep -rnE 'printf|[mc]alloc|free\(|using namespace|friend' ex0*/*.hpp ex0*/*.cpp`, lang: "bash" },
      { note: "`grep` หา `std::find`/`std::sort` เป็นการเช็คตัวเองว่าทำตามกฎเฉพาะของโมดูลนี้จริง — ถ้าไม่เจอเลยแปลว่ากำลังจะเสียคะแนนทั้งที่โปรแกรมทำงานถูก" },
    ],

    tricks: [
      { h: "ทริค 1: จำ 2 กฎของ dependent name คู่กัน" },
      { p: "`typename` หน้าชนิดที่ขึ้นกับ `T` · `this->` หน้าสมาชิกของฐานที่ขึ้นกับ `T`. เป็นเรื่องเดียวกัน — คอมไพเลอร์ยังไม่รู้จัก `T` ตอนอ่านสูตร จึงต้องบอกให้ชัด" },
      { h: "ทริค 2: เรียงก่อนคือทางลัดมาตรฐาน" },
      { p: "ทุกครั้งที่โจทย์ถามหา 'คู่ที่ห่างกันน้อยสุด' ลองเรียงก่อน — คำตอบมักอยู่ระหว่างตัวที่ติดกันเสมอ ตัดจาก O(n²) เหลือ O(n log n) ทันที" },
      { h: "ทริค 3: คำนวณระยะห่างใน `long` เสมอ" },
      { p: "ผลต่างของ `int` 2 ตัวไม่จำเป็นต้องใส่ใน `int` ได้ — เป็นบั๊กที่เงียบและเทสทั่วไปจับไม่ได้ เห็นเฉพาะตอนใส่ `INT_MIN` กับ `INT_MAX`" },
      { h: "ทริค 4: เทส ex02 ด้วยการ diff กับ `std::list`" },
      { p: "เป็นเทสที่ subject ออกแบบไว้ให้แล้ว — เขียนเทสชุดเดียวรัน 2 รอบด้วยชนิดต่างกัน ถ้าผลตรงกันคือถูกแน่นอน" },
      { h: "ทริค 5: `min_element` / `max_element` คืน iterator" },
      { p: "ต้องใส่ `*` ข้างหน้าเพื่อเอาค่า — ลืมแล้วจะได้ error ยาวเหยียดเรื่องแปลง iterator เป็น int ไม่ได้" },
      { h: "ทริค 6: เช็คก่อนแก้เสมอ" },
      { p: "`addRange` ใช้ `std::distance` เช็คความจุก่อนแทรก — ถ้าโยนหลังแทรกไปครึ่งทาง object จะค้างในสถานะที่ผู้เรียกไม่ได้คาดไว้" },
      { h: "ทริค 7: grep หา algorithm ของตัวเองก่อนส่ง" },
      { p: "โมดูลนี้ตัดคะแนนจากการเขียนลูปเองแม้ผลจะถูก — `grep -nE 'std::(find|sort|min_element)'` ใช้เวลา 2 วินาทีและบอกได้ทันทีว่าทำตามกฎหรือยัง" },
    ],

    eval: [
      { qa: [
        { q: "STL มี 3 ส่วนอะไรบ้าง เชื่อมกันยังไง?", a: "container เก็บของ, algorithm ทำงาน, iterator เป็นตัวเชื่อม. algorithm ไม่รู้จัก container เลย รู้จักแค่ช่วงของ iterator — `std::find` ตัวเดียวจึงใช้ได้กับ vector, list, deque" },
        { q: "ทำไมโมดูลนี้ห้ามเขียนลูปเอง?", a: "subject บอกว่าการใช้ STL คือประเด็นของโมดูล — เขียนลูปเองแล้วผลถูกก็ยังได้คะแนนแย่" },
        { q: "`end()` ชี้ที่ไหน?", a: "ถัดจากสมาชิกตัวสุดท้าย ไม่ใช่ตัวสุดท้าย. ทำให้ container ว่างเขียนโค้ดได้เหมือนกัน (`begin() == end()`) โดยไม่ต้องมีเงื่อนไขพิเศษ" },
        { q: "`typename` ใน `typename T::iterator` มีไว้ทำไม?", a: "บอกว่าเป็นชื่อชนิด — ตอนอ่านสูตรคอมไพเลอร์ยังไม่รู้จัก `T` จึงแยกไม่ได้ว่า `T::iterator` เป็นชนิดหรือตัวแปร static" },
        { q: "ทำไม `easyfind` คืน iterator ไม่คืน index?", a: "`std::find` ให้ iterator มาอยู่แล้ว และ `std::list` ไม่มี index ให้พูดถึงเลย — คืน iterator จึงใช้ได้กับทุก container" },
        { q: "`shortestSpan` ทำงานยังไง ทำไมถึงเร็ว?", a: "ก๊อปแล้วเรียง (`std::sort`) จากนั้นไล่ดูช่องว่างระหว่างตัวที่ติดกัน — เพราะหลังเรียงช่องว่างแคบสุดต้องอยู่ระหว่างคู่ที่ติดกัน. O(n log n) แทน O(n²)" },
        { q: "ทำไมต้องคำนวณระยะห่างใน `long`?", a: "`INT_MAX - INT_MIN` เกินช่วง `int` จะล้นเป็นค่าติดลบเงียบ ๆ" },
        { q: "`addRange` ทำไมรับ iterator 2 ตัว?", a: "เป็นสำนวน `(first, last)` ของ STL — รับได้จาก vector, list, อาเรย์ C หรือแค่บางส่วนของ container โดยไม่ต้องรู้ชนิดต้นทาง" },
        { q: "ทำไม `addRange` ต้องอยู่ใน header?", a: "เป็น template member — แม้คลาสไม่ใช่ template แต่ตัวเมธอดยังถูกปั๊มที่จุดเรียก จึงต้องเห็นสูตรครบ" },
        { q: "`std::stack` ต่างจาก `std::vector` ยังไง?", a: "`stack` เป็น container adaptor — ไม่ได้เก็บของเอง แต่ห่อ container จริง (`c`, ค่าเริ่มต้น `std::deque`) แล้วจำกัดทางเข้าออกให้เหลือแค่ LIFO" },
        { q: "ทำไม `std::stack` ไม่มี iterator?", a: "เป็นเจตนาของการออกแบบ — stack รับประกันการเข้าถึงแบบ LIFO ถ้าวนดูตรงกลางได้ก็ไม่ใช่ stack. ข้อนี้จึงชื่อ mutated abomination" },
        { q: "MutantStack ทำให้วนซ้ำได้ยังไง?", a: "สืบทอด `std::stack` แบบ public, typedef iterator จาก `Container`, แล้วคืน `this->c.begin()` / `this->c.end()`" },
        { q: "ทำไมต้องเขียน `this->c`?", a: "`c` อยู่ในคลาสฐานที่ขึ้นกับ template parameter — C++ ไม่ค้นชื่อในฐานแบบนั้นตอนอ่านสูตร. `this->` เลื่อนการค้นหาไปตอนปั๊มโค้ด" },
        { q: "พิสูจน์ว่า MutantStack ถูกต้องยังไง?", a: "รันเทสชุดเดียวกัน 2 รอบ — รอบหนึ่งด้วย MutantStack อีกรอบด้วย `std::list` — ผลลัพธ์ต้องเหมือนกันทุกตัวอักษร" },
      ]},
      { h: "เช็กลิสต์ก่อนส่ง" },
      { code: String.raw`# 1. ทั้ง 3 ข้อคอมไพล์ผ่าน และ make ซ้ำไม่ relink
for d in ex00 ex01 ex02; do (cd $d && make re && make) ; done

# 2. ex00: หาเจอ / หาไม่เจอโยน / ใช้ได้กับ vector, list, deque
# 3. ex01: ตัวอย่าง subject พิมพ์ 2 แล้ว 14
cd ex01 && ./span

# 4. ex01: 100,000 ตัวต้องเสร็จทันที
time ./span

# 5. ex01: เคสโยนครบ — เต็ม, addRange เกิน, น้อยกว่า 2 ตัว
# 6. ex02: 2 บล็อกผลลัพธ์เหมือนกันทุกตัวอักษร + rbegin/rend + const + stack ว่าง
cd ../ex02 && ./mutantstack

# 7. ใช้ algorithm จริง
grep -nE 'std::(find|sort|min_element|max_element|distance)' ex0*/*.hpp ex0*/*.cpp

# 8. valgrind สะอาดทั้ง 3
valgrind --leak-check=full --error-exitcode=42 -q ./span && echo "ผ่าน"`, lang: "bash" },
    ],
  },
});

/* ===================== CPP MODULE 09 ===================== */
window.TEACHING_DATA.push({
  id: "cpp_module_09",
  name: "CPP Module 09",
  tag: { th: "STL ใช้งานจริง — ex00 BitcoinExchange กับ std::map + lower_bound, ex01 RPN กับ std::stack, ex02 PmergeMe กับ Ford-Johnson บน 2 container",
         en: "STL in anger — ex00 BitcoinExchange with std::map + lower_bound, ex01 RPN with std::stack, ex02 PmergeMe with Ford-Johnson on two containers" },
  accent: "#e17055",
  sections: {
    principle: [
      { h: "Module 09 สอนอะไร" },
      { p: "โมดูลสุดท้ายของสาย CPP. Module 08 สอนว่า STL มีอะไร — โมดูลนี้ให้ใช้จริงกับโจทย์ที่มีข้อมูลสกปรก เคสขอบเยอะ และข้อกำหนดเรื่องประสิทธิภาพ. **แต่ละข้อบังคับให้ใช้ container คนละตัว และห้ามใช้ซ้ำข้ามข้อ**" },
      { table: { head: ["ข้อ", "โปรแกรม", "container", "โจทย์"], rows: [
        ["ex00", "`btc`", "`std::map`", "แปลงค่าเงินตามอัตราของวันที่ใกล้เคียงที่สุดที่**ก่อนหน้า**"],
        ["ex01", "`RPN`", "`std::stack`", "คำนวณนิพจน์แบบ Reverse Polish"],
        ["ex02", "`PmergeMe`", "**2 ตัวที่ต่างกัน**", "เรียงด้วย Ford-Johnson แล้วเทียบเวลา"],
      ]}},
      { h: "ทำไมแต่ละข้อบังคับ container คนละตัว" },
      { p: "เพื่อให้เห็นว่า **โครงสร้างข้อมูลที่เลือกคือคำตอบของโจทย์** ไม่ใช่รายละเอียดปลีกย่อย — `map` เรียงคีย์ให้เองจึงหาวันที่ก่อนหน้าได้ในเวลา log; `stack` คือนิยามของ RPN โดยตรง; ex02 ให้เห็นว่า container ต่างกันเวลาต่างกันแม้อัลกอริทึมเดียวกัน" },
      { h: "กฎเหล็ก" },
      { ul: [
        "ห้าม `printf` / `malloc` / `free` · ห้าม `using namespace` / `friend`",
        "**ห้ามใช้ container ซ้ำข้ามข้อ** — ใช้ `map` ที่ ex00 แล้วห้ามใช้ที่ ex01/ex02 อีก",
        "OCF บังคับทุกคลาส",
        "**ตรวจ leak เข้ม** — โมดูลนี้ให้คะแนนที่ valgrind สะอาด",
        "ex02 ต้องรองรับ **3000 ตัวขึ้นไป** และต้องเรียงด้วย **Ford-Johnson** จริง ๆ",
      ]},
    ],

    theory: [
      { h: "1) `std::map` — คีย์เรียงอัตโนมัติ" },
      { code: String.raw`std::map<std::string, double> db;

db["2011-01-03"] = 0.3;
db["2011-01-09"] = 0.32;

  เก็บแบบเรียงตามคีย์เสมอ (ปกติเป็น red-black tree)
  แทรก/ค้นหา/ลบ  =  O(log n)
  วนด้วย iterator = ได้ลำดับเรียงเสมอ

ทำไมคีย์เป็น "2011-01-03" ที่เป็น string ถึงเรียงถูก:
  รูปแบบ YYYY-MM-DD เรียงตามตัวอักษร = เรียงตามเวลา พอดี
  (เพราะเลขเดือน/วันเติม 0 ข้างหน้าให้ยาวเท่ากันหมด)
  → ไม่ต้องแปลงเป็น struct วันที่เลย`, cap: "ISO 8601 ออกแบบมาให้เรียงแบบตัวอักษรแล้วได้ลำดับเวลาพอดี — ใช้ประโยชน์ตรงนี้", lang: "cpp" },

      { h: "🔬 เจาะลึก A: `lower_bound` — หาวันที่ก่อนหน้าที่ใกล้ที่สุด" },
      { p: "โจทย์ ex00: ถ้าไม่มีอัตราของวันนั้นในฐานข้อมูล ให้ใช้ของ**วันที่ก่อนหน้าที่ใกล้ที่สุด** — ห้ามใช้วันถัดไป. `map::lower_bound` ทำงานนี้ได้ในเวลา O(log n)" },
      { code: String.raw`lower_bound(k) = iterator ตัวแรกที่คีย์ >= k

ฐานข้อมูล:   2011-01-03   2011-01-09   2012-01-11
                  │            │            │

หา "2011-01-09"  → lower_bound ชี้ตรงตัว        → ใช้ได้เลย
หา "2011-01-05"  → lower_bound ชี้ 2011-01-09   → เกินไปแล้ว → --it → 2011-01-03 ★
หา "2010-01-01"  → lower_bound ชี้ 2011-01-03 (= begin) → ไม่มีวันก่อนหน้า → error
หา "2020-01-01"  → lower_bound ชี้ end()        → --it → 2012-01-11 (ตัวสุดท้าย)`, cap: "3 กรณีที่ต้องแยก: ตรงตัว, ต้องถอยหลัง, และไม่มีของก่อนหน้าเลย", lang: "txt" },
      { code: String.raw`double BitcoinExchange::getRate(const std::string &date) const
{
    std::map<std::string, double>::const_iterator it;

    it = this->_db.lower_bound(date);
    if (it != this->_db.end() && it->first == date)
        return (it->second);              // ตรงตัว
    if (it == this->_db.begin())
        throw BitcoinExchange::FileError();  // ไม่มีวันก่อนหน้าเลย
    --it;                                  // ★ ถอย 1 ก้าว = วันก่อนหน้าที่ใกล้สุด
    return (it->second);
}`, cap: "เช็ค `it == begin()` **ก่อน** `--it` เสมอ — ถอยจาก begin คือ undefined behaviour", lang: "cpp" },
      { note: "ทำแบบวนหาเองก็ได้ แต่เป็น O(n) ต่อบรรทัดอินพุต — `lower_bound` เป็น O(log n) และเป็นเหตุผลที่ subject บังคับ `map`" },
      { qa: [
        { q: "`lower_bound` คืออะไร?", a: "คืน iterator ตัวแรกที่คีย์ `>=` ค่าที่หา. ถ้าไม่มีเลยจะคืน `end()`" },
        { q: "หาอัตราของวันที่ไม่มีในฐานข้อมูลยังไง?", a: "`lower_bound(date)` แล้วถ้าไม่ตรงตัวให้ `--it` เพื่อได้วันก่อนหน้าที่ใกล้ที่สุด — แต่ต้องเช็คก่อนว่าไม่ได้อยู่ที่ `begin()` ไม่งั้นถอยไม่ได้" },
        { q: "ทำไมใช้ `map` ไม่ใช้ `vector` ของคู่?", a: "`map` เรียงคีย์ให้เองและมี `lower_bound` เป็น O(log n) มาให้แล้ว — `vector` ต้องเรียงเองและวนหาเองเป็น O(n) ต่อครั้ง" },
        { q: "ทำไมเก็บวันที่เป็น string ได้เลย?", a: "รูปแบบ `YYYY-MM-DD` เรียงตามตัวอักษรแล้วได้ลำดับเวลาพอดี เพราะทุกส่วนเติมศูนย์ให้ยาวเท่ากัน" },
      ]},

      { h: "🔬 เจาะลึก B: RPN — ทำไม stack ถึงเป็นคำตอบตรง ๆ" },
      { p: "Reverse Polish Notation เขียนตัวดำเนินการไว้**หลัง**ตัวถูกดำเนินการ: `3 4 +` แทน `3 + 4`. รูปแบบนี้ไม่ต้องใช้วงเล็บและไม่ต้องมีลำดับความสำคัญเลย" },
      { code: String.raw`"8 9 * 9 - 9 - 9 - 4 - 1 +"

token   การกระทำ                      stack (ล่าง → บน)
  8     push                          8
  9     push                          8 9
  *     pop 9, pop 8 → 8*9=72 → push  72
  9     push                          72 9
  -     pop 9, pop 72 → 72-9=63       63
  9     push                          63 9
  -     → 54                          54
  9     -                             45
  4     -                             41
  1     +                             42     ★ เหลือตัวเดียว = คำตอบ`, cap: "ลำดับการ pop สำคัญ: ตัวบนคือ operand ตัวขวา — `a - b` ต้อง pop b ก่อนแล้วค่อย pop a", lang: "txt" },
      { code: String.raw`void RPN::applyOperator(char op)
{
    if (this->_stack.size() < 2)
        throw RPN::RPNError();

    long b = this->_stack.top(); this->_stack.pop();   // ★ ตัวบน = ขวา
    long a = this->_stack.top(); this->_stack.pop();

    if (op == '/' && b == 0)
        throw RPN::RPNError();
    /* a op b แล้ว push กลับ */
}`, cap: "สลับ a กับ b แล้ว `+`/`*` ยังถูก แต่ `-`/`/` ผิดหมด — บั๊กที่เทสง่าย ๆ จับไม่ได้", lang: "cpp" },
      { p: "**ทำไมต้องใช้ `long` ไม่ใช่ `int`:** subject บอกว่า *ตัวเลขที่ป้อนเข้ามา* น้อยกว่า 10 — แต่ไม่ได้บอกว่าผลลัพธ์ระหว่างทางจะเล็กด้วย. `9 9 * 9 * 9 *` โตขึ้นเรื่อย ๆ ได้" },
      { table: { head: ["เคสที่ต้องเป็น Error", "เพราะ"], rows: [
        ["`(1 + 1)`", "วงเล็บไม่ใช่ token ที่ยอมรับ"],
        ["`1 +`", "มี operand ไม่ครบ 2 ตัวตอนเจอตัวดำเนินการ"],
        ["`1 2`", "จบแล้วเหลือใน stack มากกว่า 1 ตัว"],
        ["`1 0 /`", "หารด้วยศูนย์"],
        ["`12 3 +`", "`12` ไม่ใช่เลขหลักเดียว"],
        ["argc ไม่ใช่ 2", "รับนิพจน์เป็น argument เดียวเท่านั้น"],
      ]}},
      { note: "`Error` พิมพ์ลง **stderr** และออกด้วยสถานะที่ไม่ใช่ 0 — ต่างจาก ex00 ที่พิมพ์ error ของแต่ละบรรทัดลง stdout แล้วทำงานต่อ" },
      { qa: [
        { q: "RPN ทำงานยังไง ทำไมใช้ stack?", a: "เจอตัวเลขก็ push, เจอตัวดำเนินการก็ pop 2 ตัวมาคำนวณแล้ว push ผลกลับ. stack คือโครงสร้างที่ตรงกับนิยามของ RPN พอดี — ไม่ต้องมีวงเล็บหรือลำดับความสำคัญเลย" },
        { q: "pop 2 ตัวแล้วเรียงยังไง?", a: "ตัวที่ pop ออกมาก่อน (ตัวบน) คือ operand ฝั่งขวา. `a - b` ต้อง pop `b` ก่อนแล้วค่อย `a` — สลับแล้ว `+`/`*` ยังถูกแต่ `-`/`/` ผิด" },
        { q: "ทำไมเก็บเป็น `long` ไม่ใช่ `int`?", a: "subject จำกัดแค่ตัวเลข**ที่ป้อนเข้ามา** ให้น้อยกว่า 10 — ผลลัพธ์ระหว่างทางไม่มีขอบเขต" },
        { q: "เจอ error แล้วทำอะไร?", a: "พิมพ์ `Error` ลง stderr แล้วออกด้วยสถานะที่ไม่ใช่ 0" },
      ]},

      { h: "🔬 เจาะลึก C: Ford-Johnson — เรียงโดยใช้การเปรียบเทียบน้อยที่สุด" },
      { p: "Ford-Johnson (merge-insert sort) ออกแบบมาเพื่อ **ลดจำนวนการเปรียบเทียบ** ให้เข้าใกล้ขีดจำกัดทางทฤษฎี ไม่ใช่เพื่อความเร็วนาฬิกา — มันซับซ้อนกว่าและเสียเวลาย้ายข้อมูลมากกว่า quicksort" },
      { code: String.raw`ขั้นตอนหลัก:

1. จับคู่  เทียบกันในคู่ แล้ววางตัวใหญ่ไว้ขวา
     (3,9) (1,7) (5,4)  →  (3,9) (1,7) (4,5)

2. เรียกซ้ำ  เรียง "คู่" ตามตัวใหญ่ของแต่ละคู่
     → ได้ลำดับของตัวใหญ่ที่เรียงแล้ว = main chain

3. แทรก  เอาตัวเล็กที่เหลือ (pend) แทรกกลับด้วย binary search
     ตัวเล็กของคู่แรกใส่หน้าสุดได้เลย (ไม่ต้องเทียบ — มันเล็กกว่าตัวใหญ่ของคู่แรกแน่นอน)

4. ลำดับการแทรก  ใช้ลำดับ Jacobsthal: 1, 3, 5, 11, 21, 43, ...
     J(k) = J(k-1) + 2*J(k-2)`, cap: "Jacobsthal มีผลแค่กับจำนวนครั้งที่เปรียบเทียบ — แทรกเรียงลำดับธรรมดาผลก็ยังถูก แค่เทียบมากกว่า", lang: "txt" },
      { p: "**ทำไมต้องเป็นลำดับ Jacobsthal:** เราอยากแทรกแต่ละตัวตอนที่ main chain มีขนาดพอดีเป็น 2ᵏ−1 เพราะ binary search บนขนาดนั้นใช้จำนวนการเปรียบเทียบพอดีเป๊ะไม่เหลือเศษ. ลำดับ Jacobsthal คือลำดับที่ทำให้เงื่อนไขนั้นเป็นจริงได้มากที่สุด" },
      { code: String.raw`template <typename C>
void fordJohnson(C &v, std::size_t unit)
{
    std::size_t n = v.size();
    std::size_t unitCount = n / unit;

    if (unitCount < 2)
        return ;
    /* 1. เรียงในแต่ละคู่ให้ตัวคีย์ใหญ่อยู่ขวา */
    for (std::size_t i = 0; i + 1 < unitCount; i += 2)
    {
        std::size_t l = i * unit;
        std::size_t r = (i + 1) * unit;
        if (fjKey(v, l, unit) > fjKey(v, r, unit))
            fjSwapUnits(v, l, r, unit);
    }
    /* 2. เรียกซ้ำด้วยหน่วยที่ใหญ่ขึ้น 2 เท่า */
    fordJohnson(v, unit * 2);
    /* 3-5. สร้าง main chain + pend แล้วแทรกตามลำดับ Jacobsthal */
}`, cap: "โค้ดจริง — เรียก `fordJohnson(v, 1)` จากข้างนอก ที่ unit = 1 ทุกตัวเป็นหน่วยของตัวเอง ผลจึงเรียงครบ", lang: "cpp" },
      { p: "**เคล็ดของ implementation นี้:** แทนที่จะสร้าง `pair<pair<int,int>, ...>` ซ้อนกันไปเรื่อย ๆ (ซึ่งชนิดจะบานตอนคอมไพล์) มันมองข้อมูลเป็น **บล็อกขนาด `unit` ที่ใช้สมาชิกตัวสุดท้ายเป็นคีย์** แล้วเพิ่ม `unit` เป็น 2 เท่าทุกชั้น — โค้ดชุดเดียวใช้ได้กับทั้ง `vector` และ `deque` ในรูป template" },
      { qa: [
        { q: "Ford-Johnson คืออะไร ต่างจาก merge sort ยังไง?", a: "เป็น merge-insert sort ที่ออกแบบให้ใช้จำนวนการเปรียบเทียบน้อยที่สุดเท่าที่ทำได้ — จับคู่, เรียงตัวใหญ่แบบเรียกซ้ำ, แล้วแทรกตัวเล็กด้วย binary search ตามลำดับ Jacobsthal" },
        { q: "ลำดับ Jacobsthal มีไว้ทำไม?", a: "ทำให้แต่ละตัวถูกแทรกตอนที่ช่วงค้นหามีขนาดพอดีเป็น 2ᵏ−1 ซึ่ง binary search ใช้การเปรียบเทียบพอดีไม่เหลือเศษ. แทรกลำดับอื่นผลยังถูกแค่เทียบมากกว่า" },
        { q: "ทำไม Ford-Johnson ไม่ได้เร็วกว่า quicksort?", a: "มันลดจำนวน**การเปรียบเทียบ** ไม่ได้ลดการย้ายข้อมูล — และเสียเวลาจัดการโครงสร้างเยอะ. คุ้มเมื่อการเปรียบเทียบแพงมากเท่านั้น" },
      ]},

      { h: "🔬 เจาะลึก D: จับเวลาให้เห็นความต่างจริง" },
      { p: "ex02 ต้องแสดงเวลาของ 2 container แยกกัน และเวลาต้องละเอียดพอที่จะเห็นความต่าง" },
      { code: String.raw`clock()  ความละเอียดมักเป็น 10 มิลลิวินาที
         → 3000 ตัวเรียงเสร็จใน ~1 มิลลิวินาที
         → ทั้ง 2 container แสดงเป็น 0 เท่ากัน  ✗

gettimeofday()  ความละเอียดระดับไมโครวินาที
         → เห็นความต่างจริง  ✓

struct timeval start, end;
gettimeofday(&start, NULL);
    /* จัดการข้อมูล + เรียง */
gettimeofday(&end, NULL);
long us = (end.tv_sec - start.tv_sec) * 1000000 + (end.tv_usec - start.tv_usec);`, cap: "subject บอกให้จับเวลารวม **การจัดการข้อมูล** ด้วย ไม่ใช่แค่ตัวเรียง", lang: "cpp" },
      { code: String.raw`Before: 3 5 9 7 4
After: 3 4 5 7 9
Time to process a range of 5 elements with std::vector : 10 us
Time to process a range of 5 elements with std::deque  : 6 us`, cap: "4 บรรทัดตามรูปแบบใน subject", lang: "txt" },
      { note: "`vector` มักเร็วกว่า `deque` ที่ขนาดเล็กเพราะข้อมูลอยู่ติดกันเป็นก้อนเดียว cache จึงทำงานได้ดี — แต่ผลจริงขึ้นกับเครื่อง อย่าไปบอกกรรมการว่าตัวไหน 'ต้อง' ชนะ" },

      { qa: [
        { q: "ทำไมใช้ `clock()` ไม่ได้?", a: "ความละเอียดหยาบระดับ 10 มิลลิวินาที ขณะที่การเรียง 3000 ตัวเสร็จเร็วกว่านั้น — ทั้ง 2 container จึงแสดงเป็น 0 เท่ากันและเทียบอะไรไม่ได้" },
        { q: "จับเวลาครอบอะไรบ้าง?", a: "ทั้งการจัดการข้อมูลและตัวเรียง ตามที่ subject กำหนด — ไม่ใช่แค่ฟังก์ชันเรียงอย่างเดียว" },
        { q: "ทำไม `vector` มักเร็วกว่า `deque` ที่ขนาดเล็ก?", a: "ข้อมูลของ `vector` อยู่ติดกันเป็นก้อนเดียว แคชจึงทำงานได้ดีกว่า. แต่ผลจริงขึ้นกับเครื่อง — อย่าไปยืนยันกับกรรมการว่าตัวไหน 'ต้อง' ชนะ" },
      ]},
      { h: "📖 อ่านเพิ่มเติม" },
      { links: [
        { label: "cppreference — std::map::lower_bound", url: "https://en.cppreference.com/w/cpp/container/map/lower_bound", note: "หัวใจของ ex00" },
        { label: "cppreference — std::stack", url: "https://en.cppreference.com/w/cpp/container/stack", note: "container ของ ex01" },
        { label: "Ford-Johnson algorithm", url: "https://en.wikipedia.org/wiki/Merge-insertion_sort", note: "ที่มาของอัลกอริทึมและจำนวนการเปรียบเทียบ" },
        { label: "Jacobsthal number", url: "https://en.wikipedia.org/wiki/Jacobsthal_number", note: "J(k) = J(k-1) + 2·J(k-2)" },
        { label: "Reverse Polish notation", url: "https://en.wikipedia.org/wiki/Reverse_Polish_notation", note: "ที่มาและเหตุผลที่ไม่ต้องใช้วงเล็บ" },
      ]},
    ],

    foundations: [
      { h: "ex00 — BitcoinExchange" },
      { code: String.raw`class BitcoinExchange
{
    private:
        std::map<std::string, double> _db;

    public:
        /* OCF ครบ 4 */
        void   loadDatabase(const std::string &filename);
        void   processInput(const std::string &filename);
        double getRate(const std::string &date) const;

        class FileError : public std::exception
        { public: virtual const char *what() const throw(); };
};

bool isValidDate(const std::string &date);
bool parseValue(const std::string &str, double &out, std::string &err);`, cap: "โค้ดจริง — ตัวตรวจสอบเป็นฟังก์ชันอิสระเพราะไม่ต้องใช้สถานะของ object", lang: "cpp" },
      { h: "ข้อความที่ต้องตรงเป๊ะ (ex00)" },
      { code: String.raw`Error: could not open file.        → stderr, เปิดไฟล์ไม่ได้
Error: bad input => <token>        → รูปแบบวันที่ผิด หรือไม่มี '|'
Error: not a positive number.      → ค่าติดลบ
Error: too large a number.         → ค่ามากกว่า 1000
<date> => <value> = <result>       → สำเร็จ`, cap: "error ของแต่ละบรรทัดพิมพ์ลง stdout แล้วทำงานบรรทัดถัดไปต่อ — ไม่ใช่หยุดทั้งโปรแกรม", lang: "txt" },
      { code: String.raw`2011-01-03 => 3 = 0.9
2011-01-03 => 2 = 0.6
2011-01-03 => 1 = 0.3
2011-01-03 => 1.2 = 0.36
2011-01-09 => 1 = 0.32
Error: not a positive number.
Error: bad input => 2001-42-42
2012-01-11 => 1 = 7.1
Error: too large a number.`, cap: "ผลจากไฟล์ตัวอย่างของ subject — พิมพ์ `3` ไม่ใช่ `3.0` และเก็บ `1.2` ไว้ ซึ่งเป็นพฤติกรรมของ stream แบบปกติอยู่แล้ว", lang: "txt" },
      { p: "**การตรวจวันที่ต้องเป็นวันจริงในปฏิทิน** ไม่ใช่แค่รูปแบบ — `2001-42-42` ต้องไม่ผ่าน และ `2011-02-30` ก็ต้องไม่ผ่าน. ปีอธิกสุรทิน: หารด้วย 4 ลงตัว **และ** (หารด้วย 100 ไม่ลงตัว **หรือ** หารด้วย 400 ลงตัว)" },

      { h: "ex01 — RPN" },
      { code: String.raw`class RPN
{
    private:
        std::stack<long> _stack;         // ★ long ไม่ใช่ int
        void applyOperator(char op);

    public:
        /* OCF ครบ 4 */
        long evaluate(const std::string &expr);

        class RPNError : public std::exception
        { public: virtual const char *what() const throw(); };
};`, cap: "โค้ดจริง — `applyOperator` เป็น private เพราะเป็นรายละเอียดภายใน", lang: "cpp" },
      { code: String.raw`./RPN "8 9 * 9 - 9 - 9 - 4 - 1 +"   →  42
./RPN "7 7 * 7 -"                    →  42
./RPN "1 2 * 2 / 2 * 2 4 - +"        →  0
./RPN "(1 + 1)"                      →  Error`, cap: "ตัวอย่างจาก subject — เอาไปทำเป็นสคริปต์เทสได้เลย", lang: "bash" },

      { h: "ex02 — PmergeMe" },
      { code: String.raw`class PmergeMe
{
    private:
        std::vector<int> _vec;           // ★ container ที่ 1
        std::deque<int>  _deq;           // ★ container ที่ 2
        bool parseToken(const std::string &tok, long &out) const;

    public:
        /* OCF ครบ 4 */
        bool parse(int argc, char **argv);
        void run();
};

template <typename C> void fordJohnson(C &v, std::size_t unit);   // ใน header`, cap: "โค้ดจริง — ตัวเรียงเป็น template จึงใช้โค้ดชุดเดียวกับทั้ง 2 container", lang: "cpp" },
      { p: "**การตรวจอินพุต:** รับเฉพาะจำนวนเต็มบวก — ปฏิเสธค่าติดลบ, ตัวอักษรที่ไม่ใช่ตัวเลข และค่าที่เกิน `INT_MAX`. ค่าซ้ำอนุญาตให้มีได้ (subject ปล่อยให้ตัดสินใจเอง)" },
    ],

    architecture: [
      { h: "โครงไฟล์" },
      { code: String.raw`ex00/  Makefile  main.cpp  BitcoinExchange.{hpp,cpp}  data.csv
ex01/  Makefile  main.cpp  RPN.{hpp,cpp}
ex02/  Makefile  main.cpp  PmergeMe.{hpp,cpp}
                                      └── fordJohnson เป็น template จึงอยู่ใน .hpp`, cap: "`data.csv` ต้องส่งไปด้วย และ `btc` ต้องรันจากโฟลเดอร์ที่มีไฟล์นี้", lang: "txt" },

      { h: "ex00 — เส้นทางของข้อมูล" },
      { code: String.raw`data.csv  ──loadDatabase──►  std::map<string, double> _db
                              (ข้ามบรรทัดหัวตาราง, แยกด้วย ',')

input.txt ──processInput──►  วนทีละบรรทัด
                              │
                              ├─ แยกด้วย '|'      ไม่มี → "Error: bad input => <บรรทัด>"
                              ├─ isValidDate      ผิด  → "Error: bad input => <วันที่>"
                              ├─ parseValue       ติดลบ → "Error: not a positive number."
                              │                    >1000 → "Error: too large a number."
                              └─ getRate(date)    ──►  lower_bound
                                                       ตรงตัว / ถอย 1 ก้าว
                                 พิมพ์  <date> => <value> = <value * rate>`, cap: "ทุก error ของบรรทัดหนึ่งไม่หยุดบรรทัดถัดไป — เป็นโปรแกรมประมวลผลไฟล์ ไม่ใช่ตัวตรวจสอบ", lang: "txt" },

      { h: "ex02 — โครงของการทำงาน" },
      { code: String.raw`parse(argc, argv)
    ตรวจทุก token → ใส่ทั้ง _vec และ _deq (ข้อมูลชุดเดียวกัน)

run()
    พิมพ์ "Before: " + _vec

    gettimeofday  →  fordJohnson(_vec, 1)  →  gettimeofday   = เวลาของ vector
    gettimeofday  →  fordJohnson(_deq, 1)  →  gettimeofday   = เวลาของ deque

    พิมพ์ "After: " + _vec
    พิมพ์บรรทัดเวลา 2 บรรทัด

★ ทั้ง 2 container เรียงข้อมูลชุดเดียวกันด้วยอัลกอริทึมเดียวกัน
  ตัวแปรเดียวที่ต่างคือโครงสร้างข้อมูล — นั่นคือสิ่งที่กำลังวัด`, cap: "เป็นการทดลองที่ควบคุมตัวแปร: เปลี่ยนแค่ container แล้วดูว่าเวลาต่างกันแค่ไหน", lang: "txt" },
    ],

    dataflow: [
      { h: "ex00 — เคสขอบที่ต้องเทส" },
      { table: { head: ["อินพุต", "ผลที่ถูก"], rows: [
        ["`2011-01-03 | 3`", "`2011-01-03 => 3 = 0.9`"],
        ["`2011-01-05 | 1`", "ใช้อัตราของ `2011-01-03` (วันก่อนหน้าที่ใกล้สุด)"],
        ["วันที่ก่อนวันแรกในฐานข้อมูล", "error — ไม่มีอัตราให้ใช้"],
        ["`2001-42-42 | 1`", "`Error: bad input => 2001-42-42`"],
        ["`2011-02-30 | 1`", "error — กุมภาพันธ์ไม่มีวันที่ 30"],
        ["`2012-02-29 | 1`", "**ผ่าน** — 2012 เป็นปีอธิกสุรทิน"],
        ["`2011-01-03 | -1`", "`Error: not a positive number.`"],
        ["`2011-01-03 | 2000`", "`Error: too large a number.`"],
        ["บรรทัดที่ไม่มี `|`", "`Error: bad input => <บรรทัดนั้น>`"],
        ["ไฟล์อินพุตเปิดไม่ได้", "`Error: could not open file.` ลง stderr"],
      ]}},

      { h: "ex02 — เทสด้วยการ fuzz" },
      { code: String.raw`#!/bin/sh
# เทียบผลกับ sort -n หลายร้อยรอบ ขนาดสุ่ม ทั้งคู่และคี่ มีค่าซ้ำ
i=0
while [ $i -lt 300 ]; do
    n=$(( (RANDOM % 200) + 1 ))
    nums=$(shuf -i 1-100 -n $n -r | tr '\n' ' ')
    got=$(./PmergeMe $nums | grep '^After:' | cut -d' ' -f2-)
    want=$(echo $nums | tr ' ' '\n' | sort -n | tr '\n' ' ')
    [ "$got " = "$want" ] || { echo "FAIL: $nums"; break; }
    i=$((i + 1))
done
echo "fuzz เสร็จ"

# 3000 ตัวต้องเรียงถูกและไม่ช้าจนผิดสังเกต
./PmergeMe $(shuf -i 1-100000 -n 3000 | tr '\n' ' ') | grep '^After:' \
    | cut -d' ' -f2- | tr ' ' '\n' | sort -nc && echo "3000 ตัวผ่าน"`, cap: "อย่าเชื่อสายตากับ Ford-Johnson — เคสคี่กับค่าซ้ำคือจุดที่ implementation ส่วนใหญ่พัง", lang: "bash" },
      { note: "เทสด้วยจำนวนสมาชิกที่เป็นเลขคี่ให้เยอะ — ตัวที่เหลือจากการจับคู่ (stray) เป็นจุดที่ผิดกันบ่อยที่สุด" },
    ],

    implementation: [
      { h: "ลำดับการลงมือเขียน" },
      { ul: [
        "1. **ex01** — สั้นและตรงไปตรงมา ทำให้ครบเคส error ก่อน",
        "2. **ex00** — งานส่วนใหญ่คือการอ่านไฟล์และตรวจข้อมูล ไม่ใช่ตัว `lower_bound`",
        "3. **ex02** — ยากสุด. ทำให้เรียงถูกก่อน (fuzz กับ `sort -n`) แล้วค่อยเพิ่มการจับเวลา",
      ]},
      { h: "อาการพัง → สาเหตุ" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้"], rows: [
        ["ex00 ได้อัตราของวันถัดไป", "ใช้ `lower_bound` แล้วไม่ถอย", "ถ้าคีย์ไม่ตรงตัวให้ `--it`"],
        ["ex00 crash กับวันที่เก่ามาก", "`--it` จาก `begin()`", "เช็ค `it == begin()` ก่อนถอยเสมอ"],
        ["ex00 รับ `2011-02-30`", "ตรวจแค่รูปแบบไม่ตรวจปฏิทิน", "ตรวจจำนวนวันของเดือนและปีอธิกสุรทิน"],
        ["ex01 `1 2 -` ได้ `1`", "สลับ operand", "ตัวที่ pop ก่อนคือฝั่งขวา"],
        ["ex01 ผลลัพธ์ล้น", "ใช้ `int`", "ใช้ `long`"],
        ["ex01 `1 2` ไม่ error", "ไม่เช็คว่าเหลือ 1 ตัวตอนจบ", "จบแล้ว `_stack.size()` ต้องเท่ากับ 1"],
        ["ex02 เรียงผิดเมื่อจำนวนเป็นคี่", "ไม่ได้จัดการ stray", "เอา stray ไปต่อท้าย pend"],
        ["ex02 เรียงผิดเมื่อมีค่าซ้ำ", "เทียบด้วย `>=` ตอนแทรก", "ใช้ `>` อย่างเดียว ให้ตัวเท่ากันอยู่ด้วยกัน"],
        ["ex02 เวลา 2 container เป็น 0 เท่ากัน", "ใช้ `clock()`", "ใช้ `gettimeofday` ระดับไมโครวินาที"],
        ["ex02 3000 ตัวช้ามาก", "แทรกแบบเชิงเส้นแทน binary search", "binary search ตอนแทรกเข้า main chain"],
      ]}},
      { h: "build / test" },
      { code: String.raw`for d in ex00 ex01 ex02; do (cd $d && make re && make) ; done

cd ex00 && ./btc input.txt          # ต้องรันจากโฟลเดอร์ที่มี data.csv
cd ../ex01 && ./RPN "8 9 * 9 - 9 - 9 - 4 - 1 +"     # 42
./RPN "(1 + 1)"                                      # Error (stderr)
cd ../ex02 && ./PmergeMe $(shuf -i 1-100000 -n 3000 | tr '\n' ' ')

# fuzz เทียบกับ sort -n (ดูสคริปต์ในหัวข้อ dataflow)

# valgrind ทั้ง 3 — โมดูลนี้ให้คะแนนที่ leak = 0
valgrind --leak-check=full --error-exitcode=42 -q ./PmergeMe 3 5 9 7 4 && echo "ผ่าน"

# บน Windows ผ่าน WSL
wsl --exec bash -lc 'cd "/mnt/d/Projects/42/CPP Module 09/ex02" && make re && ./PmergeMe 3 5 9 7 4'

# เช็คว่าไม่ได้ใช้ container ซ้ำข้ามข้อ
grep -nE 'std::(map|stack|vector|deque|list|set)' ex0*/*.hpp

# ของต้องห้าม
grep -rnE 'printf|[mc]alloc|free\(|using namespace|friend' ex0*/*.hpp ex0*/*.cpp`, lang: "bash" },
      { note: "`make fclean` และลบสคริปต์เทสออกก่อนส่ง — โฟลเดอร์ที่มีไบนารีหรือ `.o` ค้างอยู่คือจุดที่โดนหักได้ฟรี ๆ" },
    ],

    tricks: [
      { h: "ทริค 1: ให้ `map` ทำงานเรียงให้" },
      { p: "คีย์รูปแบบ `YYYY-MM-DD` เรียงตามตัวอักษรได้ลำดับเวลาพอดี — ไม่ต้องเขียน struct วันที่หรือ comparator เอง" },
      { h: "ทริค 2: เช็ค `begin()` ก่อน `--it` เสมอ" },
      { p: "ถอย iterator จาก `begin()` เป็น undefined behaviour — บางครั้งไม่ crash ทันทีแล้วไปพังที่อื่น หายากมาก" },
      { h: "ทริค 3: RPN — pop ตัวแรกคือฝั่งขวา" },
      { p: "จำประโยคนี้ไว้ประโยคเดียว. บั๊กสลับ operand ผ่านเทส `+`/`*` ได้หมดและโผล่เฉพาะกับ `-`/`/`" },
      { h: "ทริค 4: fuzz ex02 เทียบกับ `sort -n`" },
      { p: "Ford-Johnson ตรวจด้วยตาไม่ได้ — สคริปต์ 10 บรรทัดที่เทียบกับ `sort -n` หลายร้อยรอบเชื่อถือได้กว่าอ่านโค้ดซ้ำ 10 เที่ยว" },
      { h: "ทริค 5: เทสจำนวนสมาชิกเป็นเลขคี่ให้เยอะ" },
      { p: "ตัวที่เหลือจากการจับคู่คือจุดที่ implementation ส่วนใหญ่พลาด และเทสด้วยเลขคู่อย่างเดียวจะไม่มีวันเจอ" },
      { h: "ทริค 6: `gettimeofday` ไม่ใช่ `clock()`" },
      { p: "`clock()` หยาบระดับ 10 มิลลิวินาที — 3000 ตัวเสร็จเร็วกว่านั้น ทั้ง 2 container จะแสดงเป็น 0 เท่ากันและเทียบอะไรไม่ได้เลย" },
      { h: "ทริค 7: แยกให้ชัดว่า error ไหนไป stdout ไหนไป stderr" },
      { p: "ex00 พิมพ์ error ของแต่ละบรรทัดลง stdout แล้วทำงานต่อ; `could not open file` ไป stderr. ex01 พิมพ์ `Error` ลง stderr แล้วออก. คนละพฤติกรรมโดยเจตนา" },
    ],

    eval: [
      { qa: [
        { q: "ทำไมแต่ละข้อบังคับใช้ container คนละตัว?", a: "เพื่อให้เห็นว่าการเลือกโครงสร้างข้อมูลคือคำตอบของโจทย์ — `map` เรียงคีย์ให้จึงหาวันก่อนหน้าได้เร็ว, `stack` ตรงกับนิยามของ RPN, ex02 ใช้ 2 ตัวเพื่อเทียบเวลา" },
        { q: "`std::map` เก็บข้อมูลยังไง?", a: "เรียงตามคีย์เสมอ (ปกติเป็น red-black tree) — แทรก/ค้นหา/ลบ O(log n) และวนด้วย iterator ได้ลำดับเรียง" },
        { q: "`lower_bound` คืออะไร ใช้ยังไงใน ex00?", a: "คืน iterator ตัวแรกที่คีย์ `>=` ค่าที่หา. ถ้าตรงตัวก็ใช้เลย ถ้าไม่ตรงให้ `--it` เพื่อได้วันก่อนหน้าที่ใกล้สุด — แต่ต้องเช็ค `begin()` ก่อนถอย" },
        { q: "ทำไมเก็บวันที่เป็น `std::string` ได้?", a: "รูปแบบ `YYYY-MM-DD` เรียงตามตัวอักษรแล้วตรงกับลำดับเวลา เพราะทุกส่วนเติมศูนย์ให้ยาวเท่ากัน" },
        { q: "ตรวจวันที่ต้องตรวจอะไรบ้าง?", a: "รูปแบบ `YYYY-MM-DD`, เดือนอยู่ในช่วง 1–12, วันไม่เกินจำนวนวันจริงของเดือนนั้น รวมทั้งกุมภาพันธ์ของปีอธิกสุรทิน (หาร 4 ลงตัว และ (หาร 100 ไม่ลงตัว หรือ หาร 400 ลงตัว))" },
        { q: "RPN คืออะไร ทำไม stack ถึงเหมาะ?", a: "เขียนตัวดำเนินการไว้หลัง operand จึงไม่ต้องมีวงเล็บหรือลำดับความสำคัญ. เจอเลข push, เจอตัวดำเนินการ pop 2 ตัวมาคำนวณแล้ว push กลับ — ตรงกับ stack พอดี" },
        { q: "pop 2 ตัวแล้วเรียงยังไง?", a: "ตัวที่ pop ก่อน (ตัวบนสุด) คือ operand ฝั่งขวา — สลับแล้ว `+`/`*` ยังถูกแต่ `-`/`/` ผิด" },
        { q: "ex01 มีเคส error อะไรบ้าง?", a: "token ที่ไม่ใช่เลขหลักเดียวหรือ `+-*/`, operand ไม่ครบ 2 ตัว, หารด้วยศูนย์, จบแล้วเหลือใน stack ไม่ใช่ 1 ตัว, วงเล็บ, argc ผิด — ทั้งหมดพิมพ์ `Error` ลง stderr" },
        { q: "ทำไม RPN ใช้ `long` ไม่ใช้ `int`?", a: "subject จำกัดแค่ตัวเลขที่ป้อนเข้ามาให้น้อยกว่า 10 — ผลลัพธ์ระหว่างทางไม่มีขอบเขต" },
        { q: "Ford-Johnson ทำงานยังไง?", a: "จับคู่แล้ววางตัวใหญ่ไว้ขวา, เรียกซ้ำเพื่อเรียงคู่ตามตัวใหญ่ (ได้ main chain), แล้วแทรกตัวเล็กที่เหลือกลับด้วย binary search ตามลำดับ Jacobsthal" },
        { q: "ลำดับ Jacobsthal คืออะไร มีไว้ทำไม?", a: "`J(k) = J(k-1) + 2·J(k-2)` = 1, 3, 5, 11, 21, 43… ทำให้แต่ละตัวถูกแทรกตอนที่ช่วงค้นหาเป็น 2ᵏ−1 พอดี ซึ่ง binary search ใช้การเปรียบเทียบไม่เหลือเศษ. ลำดับอื่นผลยังถูกแค่เทียบมากกว่า" },
        { q: "Ford-Johnson เร็วกว่า std::sort ไหม?", a: "ไม่ — มันลดจำนวน**การเปรียบเทียบ** ไม่ได้ลดการย้ายข้อมูล และมีค่าใช้จ่ายในการจัดการโครงสร้างสูง. คุ้มเฉพาะตอนที่การเปรียบเทียบแพงมาก" },
        { q: "ทำไม ex02 ต้องใช้ 2 container?", a: "เพื่อวัดว่าอัลกอริทึมเดียวกันบนโครงสร้างข้อมูลต่างกันใช้เวลาต่างกัน — เป็นการทดลองที่คุมตัวแปรอื่นไว้หมด" },
        { q: "ทำไมใช้ `gettimeofday` ไม่ใช้ `clock()`?", a: "`clock()` หยาบระดับ 10 มิลลิวินาที ซึ่ง 3000 ตัวเสร็จเร็วกว่านั้น — ทั้ง 2 container จะได้ 0 เท่ากันจนเทียบไม่ได้" },
      ]},
      { h: "เช็กลิสต์ก่อนส่ง" },
      { code: String.raw`# 1. ทั้ง 3 ข้อคอมไพล์ผ่านและ make ซ้ำไม่ relink
for d in ex00 ex01 ex02; do (cd $d && make re && make) ; done

# 2. ex00 ตรงกับผลตัวอย่างของ subject ทุกบรรทัด + เคสวันที่ผิด/ค่าเกิน
cd ex00 && ./btc input.txt

# 3. ex01 ตัวอย่างทั้ง 4 บรรทัด + เคส error ครบ
cd ../ex01 && ./RPN "8 9 * 9 - 9 - 9 - 4 - 1 +"

# 4. ex02 fuzz เทียบ sort -n หลายร้อยรอบ (คู่/คี่/มีค่าซ้ำ) + 3000 ตัว
cd ../ex02 && ./PmergeMe $(shuf -i 1-100000 -n 3000 | tr '\n' ' ') \
    | grep '^After:' | cut -d' ' -f2- | tr ' ' '\n' | sort -nc && echo "เรียงถูก"

# 5. เวลาของ 2 container ต่างกันจริง ไม่ใช่ 0 ทั้งคู่

# 6. valgrind สะอาดทั้ง 3 (โมดูลนี้ให้คะแนนที่ leak = 0)
valgrind --leak-check=full --error-exitcode=42 -q ./PmergeMe 3 5 9 7 4 && echo "ผ่าน"

# 7. ไม่ได้ใช้ container ซ้ำข้ามข้อ + ไม่มีของต้องห้าม
grep -nE 'std::(map|stack|vector|deque|list|set)' ex0*/*.hpp

# 8. โฟลเดอร์สะอาด
for d in ex00 ex01 ex02; do (cd $d && make fclean) ; done`, lang: "bash" },
    ],
  },
});