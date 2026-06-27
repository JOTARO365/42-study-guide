/* ============================================================
   data.exam.js — สื่อติวสอบ 42 Exam Rank (02–06)
   ต่อท้าย window.TEACHING_DATA (id ขึ้นต้นด้วย exam_)
   อ้างอิงจาก github.com/terminal-42s/42_examshell
   แนวทาง: กติกาสอบ → pool โจทย์ → pattern ที่ใช้ซ้ำ → เจาะลึกข้อสำคัญ → กลยุทธ์
   ============================================================ */
window.TEACHING_DATA = window.TEACHING_DATA || [];

/* ===================== EXAM RANK 02 ===================== */
window.TEACHING_DATA.push({
  id: "exam_rank02",
  name: "Exam Rank 02",
  tag: { th: "ข้อสอบจริงด่านแรกของ Common Core — ฟังก์ชัน C ล้วน 4 ระดับ: string, linked list, recursion, bitwise. ติวจาก pool โจทย์จริง + เจาะลึกข้อที่ออกบ่อย",
         en: "The first real Common Core exam — pure C functions across 4 levels: strings, linked lists, recursion, bitwise. Drilled from the real exercise pool + deep dives on the frequent ones" },
  accent: "#fbbf24",
  sections: {
    principle: [
      { h: "Exam Rank 02 คืออะไร" },
      { p: "ข้อสอบ on-site ตัวแรกที่ต้องผ่านใน Common Core (หลัง libft). นั่งสอบในเครื่องที่ถูก **isolate** (ไม่มีเน็ต, ไม่มี Discord/Google) ~**3 ชั่วโมง**. ระบบสอบคือ **examshell**: สุ่มโจทย์ให้ทีละข้อ เราเขียนเฉลยลงโฟลเดอร์ `rendu/` แล้วกด **grademe** ให้ Moulinette ตรวจ" },
      { note: "หัวใจที่ทำให้หลายคนตกใจ: ข้อสอบ **ไม่ตรวจ norm!** — ตรวจแค่ 'คอมไพล์ผ่าน + output ตรง' เท่านั้น. เขียน `for`, ตัวแปรกลางบล็อก, ฟังก์ชันยาวเกิน 25 บรรทัดได้หมด → เขียนให้ทำงานถูกเร็วที่สุดพอ" },
      { h: "โครงสร้าง 4 ระดับ (level 0 → 3)" },
      { table: { head: ["Level", "ความยาก", "แนวโจทย์", "คะแนน"], rows: [
        ["**0**", "อุ่นเครื่อง", "string/IO พื้นฐาน (strlen, putstr, rot13)", "น้อย"],
        ["**1**", "ง่าย-กลาง", "atoi, strcmp, bitwise, แปลงคำ", "กลาง"],
        ["**2**", "กลาง", "base conversion, linked list size, str ops", "มาก"],
        ["**3**", "ยาก", "ft_split, ft_itoa, flood_fill, sort_list", "มากสุด"],
      ]}},
      { p: "ทำผ่านระดับหนึ่ง → ปลดล็อกระดับถัดไป (ยากขึ้น คะแนนสูงขึ้น). **ตกระดับไหน = จบที่คะแนนระดับนั้น** ฉะนั้นเป้าหมายคือไต่ให้สูงที่สุดในเวลาที่มี" },
      { h: "การให้คะแนน & เกณฑ์ผ่าน" },
      { ul: [
        "คอมไพล์ด้วย `cc -Wall -Wextra -Werror` — มี warning = **ตก** (เช่น ตัวแปรไม่ใช้, signed/unsigned)",
        "**output ต้องตรงเป๊ะ** (ตรวจด้วย diff) — เกิน/ขาด `\\n` ตัวเดียวก็ตก",
        "**segfault / memory error = 0** ของข้อนั้นทันที",
        "บางข้อเช็ค leak (ขึ้นกับ Moulinette รุ่น) — ปิด fd / free ให้ครบ",
        "เกณฑ์ผ่าน Rank 02 มัก ~ ผ่าน **level 2** ขึ้นไป (แล้วแต่ปี/แคมปัส)",
      ]},
      { h: "หน้าตา subject แต่ละข้อ" },
      { code: String.raw`Assignment name  : ft_strlen
Expected files   : ft_strlen.c
Allowed functions:                  ← ว่าง = ห้ามใช้ฟังก์ชันภายนอกเลย!
--------------------------------------------------------------------------------
Write a function that returns the length of a string.
Your function must be declared as follows:
int    ft_strlen(char *str);`, cap: "อ่าน 3 บรรทัดบนสุดให้ครบ: ชื่อไฟล์ที่ต้องส่ง, ฟังก์ชันที่ใช้ได้, prototype เป๊ะ", lang: "txt" },
      { note: "'Allowed functions' ว่าง = ใช้ได้แค่ที่เขียนเอง (ห้าม printf/malloc). ถ้าเขียนว่า `malloc` = ใช้ได้แค่ malloc. ใช้ฟังก์ชันนอกรายการ = ตก" },
    ],

    theory: [
      { p: "Pool โจทย์จริงของ Rank 02 (จาก examshell) — แต่ละช่องสอบสุ่มมา 1 ข้อจากระดับนั้น. รู้จักให้ครบ = เห็นปุ๊บรู้ทางทันที" },
      { h: "Level 0 — อุ่นเครื่อง (string/IO)" },
      { table: { head: ["โจทย์", "ทำอะไร"], rows: [
        ["`ft_strlen`", "คืนความยาว string"],
        ["`ft_strcpy`", "คัดลอก string"],
        ["`ft_putstr`", "พิมพ์ string ด้วย write"],
        ["`ft_swap`", "สลับค่า 2 ตัวผ่าน pointer"],
        ["`rot_13` / `rotone`", "เลื่อนตัวอักษร +13 / +1 (วน a-z)"],
        ["`rev_print`", "พิมพ์ string กลับหลัง"],
        ["`ulstr`", "สลับพิมพ์เล็ก↔ใหญ่ทุกตัว"],
        ["`first_word` / `last_word`", "พิมพ์คำแรก/คำสุดท้าย"],
        ["`fizzbuzz`", "1..100 fizz/buzz"],
        ["`repeat_alpha`", "ซ้ำตัวอักษรตามลำดับ (a, bb, ccc)"],
        ["`search_and_replace`", "แทนตัวอักษร"],
      ]}},
      { h: "Level 1 — ง่าย-กลาง" },
      { table: { head: ["โจทย์", "ทำอะไร"], rows: [
        ["`ft_atoi`", "string → int (จัดการ +/- และช่องว่างนำ)"],
        ["`ft_strcmp`", "เทียบ string"],
        ["`ft_strdup`", "ทำสำเนา string (malloc)"],
        ["`ft_strrev`", "กลับ string ในที่"],
        ["`do_op`", "เครื่องคิดเลข argv: `a op b`"],
        ["`max`", "หาค่ามากสุดใน int array"],
        ["`inter` / `union`", "เซตอักขระร่วม/รวม จาก 2 string"],
        ["`wdmatch`", "เช็คว่า s1 เป็น subsequence ของ s2"],
        ["`print_bits`", "พิมพ์ byte เป็น 8 bit"],
        ["`swap_bits`", "สลับครึ่งบน-ล่างของ byte"],
        ["`reverse_bits`", "กลับลำดับบิตใน byte"],
        ["`is_power_of_2`", "เช็คว่าเป็นกำลัง 2"],
        ["`camel_to_snake` / `snake_to_camel`", "แปลงรูปแบบชื่อตัวแปร"],
        ["`alpha_mirror`", "สะท้อนตัวอักษร (a↔z, b↔y)"],
      ]}},
      { h: "Level 2 — กลาง" },
      { table: { head: ["โจทย์", "ทำอะไร"], rows: [
        ["`ft_atoi_base`", "แปลง string ฐานใดก็ได้ → int"],
        ["`print_hex`", "พิมพ์เลขฐาน 16"],
        ["`ft_list_size`", "นับ node ใน linked list"],
        ["`ft_range`", "สร้าง int array จาก start..end"],
        ["`ft_rrange`", "เหมือน range แต่กลับลำดับ"],
        ["`str_capitalizer` / `rstr_capitalizer`", "ขึ้นต้นคำด้วยตัวใหญ่"],
        ["`epur_str`", "ตัดช่องว่างซ้ำให้เหลืออันเดียว"],
        ["`expand_str`", "เว้นวรรค 3 ช่องระหว่างคำ"],
        ["`tab_mult`", "ตารางสูตรคูณ"],
        ["`pgcd` / `lcm`", "ห.ร.ม. / ค.ร.น."],
        ["`add_prime_sum`", "ผลรวมจำนวนเฉพาะ ≤ n"],
        ["`paramsum`", "นับจำนวน argument"],
        ["`hidenp`", "เช็ค s1 เป็น subsequence ของ s2 (1/0)"],
      ]}},
      { h: "Level 3 — ยาก (ออกบ่อย เจาะลึกในแท็บถัดไป)" },
      { table: { head: ["โจทย์", "ทำอะไร", "สกิล"], rows: [
        ["`ft_split`", "ตัด string เป็น array ของคำ", "string + malloc"],
        ["`ft_itoa`", "int → string (จัดการ INT_MIN)", "string + malloc"],
        ["`flood_fill`", "ระบายพื้นที่เชื่อมต่อ", "recursion"],
        ["`sort_int_tab`", "เรียง int array", "sorting"],
        ["`sort_list`", "เรียง linked list ด้วย cmp", "linked list"],
        ["`ft_list_foreach`", "วน apply ฟังก์ชันทุก node", "function pointer"],
        ["`ft_list_remove_if`", "ลบ node ที่ match (free)", "linked list"],
        ["`rev_wstr`", "กลับลำดับ 'คำ' ในประโยค", "string"],
        ["`rostring`", "หมุนคำแรกไปท้าย", "string"],
        ["`fprime`", "แยกตัวประกอบเฉพาะ", "math"],
      ]}},
      { note: "เห็นชื่อข้อแล้วนึกไม่ออกว่าทำอะไร = อันตราย. อ่าน pool นี้ให้คุ้นทุกชื่อ — เวลาสอบจะได้ไม่เสียเวลาทำความเข้าใจโจทย์" },
    ],

    foundations: [
      { p: "สกิล/snippet ที่ต้อง 'พิมพ์ได้จากความจำ' — โจทย์ Rank 02 ส่วนใหญ่ประกอบจาก building block พวกนี้" },
      { h: "1) พิมพ์ออกจอด้วย write (ไม่มี printf)" },
      { code: String.raw`#include <unistd.h>
void ft_putchar(char c) { write(1, &c, 1); }
void ft_putstr(char *s)  { while (*s) write(1, s++, 1); }

// พิมพ์เลข int (จัดการลบ + INT_MIN)
void ft_putnbr(int n) {
    if (n == -2147483648) { ft_putstr("-2147483648"); return; }
    if (n < 0) { ft_putchar('-'); n = -n; }
    if (n >= 10) ft_putnbr(n / 10);
    ft_putchar(n % 10 + '0');
}`, cap: "หลายข้อห้ามใช้ printf → ต้องมี putchar/putstr/putnbr ติดมือ", lang: "c" },
      { h: "2) จอง string ขนาด len+1 + ปิดท้าย '\\0'" },
      { code: String.raw`char *dst = malloc(sizeof(char) * (len + 1));
if (!dst) return (NULL);     // เช็ค malloc เสมอ
dst[len] = '\0';             // ปิดท้ายก่อนเติม
// ... เติม dst[0..len-1] ...`, cap: "ลืม +1 หรือลืม '\\0' = bug คลาสสิกที่ทำให้ output เพี้ยน/segfault", lang: "c" },
      { h: "3) วนข้ามตัวคั่น / หาขอบคำ (ใช้ใน split, word ops)" },
      { code: String.raw`int is_sep(char c) { return (c == ' ' || c == '\t' || c == '\n'); }

while (*s && is_sep(*s)) s++;        // ข้ามตัวคั่นนำหน้า
while (*s && !is_sep(*s)) s++;       // เดินจนจบคำ`, cap: "pattern 'ข้ามคั่น → เดินจบคำ → ข้ามคั่น' = หัวใจของ split/last_word/epur_str", lang: "c" },
      { h: "4) เดิน linked list + prototype มาตรฐาน" },
      { code: String.raw`typedef struct s_list {
    void           *data;     // หรือ int data (แล้วแต่ ft_list.h ที่ให้มา)
    struct s_list  *next;
} t_list;

t_list *cur = lst;
while (cur) { /* ใช้ cur->data */ cur = cur->next; }`, cap: "โจทย์ list จะให้ `ft_list.h` มา — เปิดอ่านว่า data เป็น void* หรือ int", lang: "c" },
      { h: "5) เทมเพลต recursion (flood_fill, fractal-ish)" },
      { code: String.raw`void rec(grid, x, y) {
    if (out_of_bounds || ไม่ตรงเงื่อนไข) return;   // base case ก่อน!
    mark(x, y);                                     // กันวนซ้ำ
    rec(x+1,y); rec(x-1,y); rec(x,y+1); rec(x,y-1); // แตก 4 ทิศ
}`, cap: "base case (ขอบ + เคยทำแล้ว) ต้องมาก่อนเสมอ ไม่งั้น stack overflow", lang: "c" },
      { h: "6) อ่าน main.c ที่ระบบให้มา" },
      { p: "หลายข้อมาพร้อม `main.c` ที่เรียกฟังก์ชันเรา — **เปิดอ่านก่อนเขียน** เพื่อรู้: prototype เป๊ะ, ฟังก์ชันถูกเรียกยังไง, output ที่คาดหวัง. โจทย์ list/flood_fill มักมี struct + main ให้แล้ว" },
    ],

    architecture: [
      { h: "examshell ทำงานยังไง (วงจรการสอบ)" },
      { code: String.raw`1. เลือก Rank 02 → ระบบสุ่มโจทย์ level 0 ให้
2. ระบบสร้างโฟลเดอร์ rendu/ + ก๊อป subject (และ main.c ถ้ามี) ลงไป
3. เราเขียนไฟล์ที่ "Expected files" บอก ลงใน rendu/
4. กด grademe → Moulinette คอมไพล์ + เทียบ output
5. ผ่าน → ปลดล็อก level ถัดไป (สุ่มโจทย์ใหม่)
   ตก  → ลองใหม่ได้ (อาจได้โจทย์เดิมหรือใหม่)`, cap: "ทุกอย่างเกิดใน rendu/ — เขียนไฟล์ผิดชื่อ/ผิดที่ = ตรวจไม่เจอ = ตก", lang: "txt" },
      { h: "loop คอมไพล์-เทสต์ในเครื่อง (ทำเองก่อนกด grademe)" },
      { code: String.raw`# โจทย์ที่มี main.c ให้:
cc -Wall -Wextra -Werror *.c && ./a.out | cat -e

# โจทย์ที่ให้แค่ฟังก์ชัน (ไม่มี main) → เขียน main เทสต์เองชั่วคราว
# (อย่าลืมลบ/อย่าส่ง main ถ้า Expected files ไม่รวม main.c)

# เทียบ output เป๊ะ ๆ ด้วย cat -e (เห็น $ ท้ายบรรทัด + ^I = tab)
./a.out | cat -e`, cap: "`cat -e` คือเพื่อนสนิท — เห็น \\n ($) และ tab (^I) ที่ตาเปล่ามองไม่เห็น", lang: "bash" },
      { h: "กฎไฟล์ที่ส่ง" },
      { ul: [
        "ส่ง **เฉพาะ** ไฟล์ใน 'Expected files' — ถ้าบอก `ft_split.c` อย่างเดียว ห้ามมี main()",
        "ถ้า Expected files เป็น `*.c *.h` → แยกไฟล์ได้ตามใจ (มี main ได้)",
        "ฟังก์ชันต้องตรง prototype เป๊ะ (ชื่อ, return type, พารามิเตอร์)",
        "ห้าม `#include` ที่ไม่จำเป็น (บางครั้ง -Werror ไม่ฟ้องแต่ดูไม่สะอาด)",
      ]},
      { note: "เคล็ด: เขียน main เทสต์ในไฟล์แยก (เช่น test.c) แล้วคอมไพล์รวม `cc ft_split.c test.c` — พอจะส่งก็ส่งแค่ ft_split.c ลด risk ลืมลบ main" },
    ],

    dataflow: [
      { p: "เจาะลึกข้อที่ออกบ่อย/ยากของ Rank 02 — เข้าใจ pattern พวกนี้ = ครอบคลุม level 2-3 ส่วนใหญ่" },

      { h: "🔬 ft_split — ตัด string เป็น array ของคำ (allowed: malloc)" },
      { p: "**กลยุทธ์ 3 ฟังก์ชัน:** นับคำ → ดูดทีละคำ → ประกอบ array. กุญแจคือ pattern 'ข้ามคั่น → เดินจบคำ' ที่ใช้ซ้ำทั้งตอนนับและตอนดูด" },
      { code: String.raw`int is_sep(char c) { return (c==' '||c=='\t'||c=='\n'); }

int count_words(char *s) {
    int n = 0;
    while (*s) {
        while (*s && is_sep(*s)) s++;          // ข้ามคั่น
        if (*s) n++;                            // เจอต้นคำ → นับ
        while (*s && !is_sep(*s)) s++;          // เดินจบคำ
    }
    return (n);
}
char *word_dup(char *s) {
    int len = 0;
    while (s[len] && !is_sep(s[len])) len++;
    char *w = malloc(len + 1);
    w[len] = '\0';
    for (int i = 0; i < len; i++) w[i] = s[i];
    return (w);
}
char **ft_split(char *str) {
    char **arr = malloc(sizeof(char*) * (count_words(str) + 1));
    int i = 0;
    while (*str) {
        while (*str && is_sep(*str)) str++;
        if (*str) arr[i++] = word_dup(str);
        while (*str && !is_sep(*str)) str++;
    }
    arr[i] = NULL;                              // ปิดท้ายด้วย NULL
    return (arr);
}`, cap: "+1 ใน malloc array = ที่ว่างสำหรับ NULL ปิดท้าย (สำคัญมาก ลืม = ผู้เรียกวนเกิน)", lang: "c" },
      { note: "กับดัก ft_split: (1) ลืม NULL ปิดท้าย array, (2) คำว่างตอนมีคั่นซ้อน, (3) string ที่มีแต่ช่องว่าง → ต้องได้ array ที่มี NULL ตัวเดียว" },

      { h: "🔬 ft_itoa — int → string + กับดัก INT_MIN (allowed: malloc)" },
      { p: "**ปัญหา INT_MIN (-2147483648):** จะ `n = -n` ตรง ๆ ไม่ได้ เพราะ +2147483648 ล้น int. ทริค: ทำ `% 10` ก่อนแล้วค่อย abs **ทีละหลัก** (หลักเดียวไม่ล้น)" },
      { code: String.raw`int get_len(int n) {
    int len = (n <= 0) ? 1 : 0;     // เผื่อ '-' หรือเลข 0
    while (n) { len++; n /= 10; }
    return (len);
}
char *ft_itoa(int n) {
    int len = get_len(n);
    char *r = malloc(len + 1);
    r[len] = '\0';
    if (n == 0) r[0] = '0';
    if (n < 0) r[0] = '-';
    while (n) {
        int digit = n % 10;          // INT_MIN: digit = -8 (ไม่ล้น)
        if (digit < 0) digit = -digit;
        r[--len] = digit + '0';      // เติมจากหลังมาหน้า
        n /= 10;
    }
    return (r);
}`, cap: "ห้าม `n = -n` กับ INT_MIN — abs ทีละหลัก (n%10) แทน เพื่อเลี่ยง overflow", lang: "c" },

      { h: "🔬 flood_fill — recursion ระบายพื้นที่ (allowed: none, มี main+struct ให้)" },
      { p: "ระบายช่องที่ค่าเท่ากับจุดเริ่ม ให้กลายเป็น 'F' แผ่ 4 ทิศ. **base case ต้องมาก่อน**: ออกขอบ หรือช่องไม่ตรงสีเป้า → return ทันที" },
      { code: String.raw`typedef struct s_point { int x; int y; } t_point;

void fill(char **tab, t_point size, t_point c, char target) {
    if (c.y < 0 || c.y >= size.y || c.x < 0 || c.x >= size.x
        || tab[c.y][c.x] != target)
        return;                                  // base case รวมทุกเงื่อนหยุด
    tab[c.y][c.x] = 'F';                          // mark กันวนซ้ำ
    fill(tab, size, (t_point){c.x - 1, c.y}, target);
    fill(tab, size, (t_point){c.x + 1, c.y}, target);
    fill(tab, size, (t_point){c.x, c.y - 1}, target);
    fill(tab, size, (t_point){c.x, c.y + 1}, target);
}
void flood_fill(char **tab, t_point size, t_point begin) {
    fill(tab, size, begin, tab[begin.y][begin.x]); // จำสีเป้าก่อนเปลี่ยน
}`, cap: "ต้องจำ 'สีเป้า' (tab[begin]) ส่งเข้า recursion — ถ้าอ่านสดทุกครั้งจะเพี้ยนหลัง mark", lang: "c" },

      { h: "🔬 ft_atoi_base — แปลง string ฐานใดก็ได้ → int (allowed: none)" },
      { code: String.raw`int get_digit(char c, int base) {
    if (c >= '0' && c <= '9') c -= '0';
    else if (c >= 'a' && c <= 'f') c = c - 'a' + 10;
    else if (c >= 'A' && c <= 'F') c = c - 'A' + 10;
    else return (-1);
    return (c < base ? c : -1);        // -1 = หยุด (เกินฐาน)
}
int ft_atoi_base(char *str, int base) {
    int res = 0, sign = 1, d;
    while (*str == ' ' || *str == '\t') str++;
    if (*str == '-') { sign = -1; str++; }
    while ((d = get_digit(*str, base)) >= 0) {
        res = res * base + d;
        str++;
    }
    return (res * sign);
}`, cap: "หัวใจ: map char→ค่า (0-9, a-f), แล้ว res = res*base + digit สะสมไปเรื่อย ๆ", lang: "c" },

      { h: "🔬 sort_list — เรียง linked list ด้วย cmp (bubble in-place)" },
      { code: String.raw`t_list *sort_list(t_list *lst, int (*cmp)(int, int)) {
    int swapped = 1;
    while (swapped) {
        swapped = 0;
        t_list *cur = lst;
        while (cur->next) {
            if (!cmp(cur->data, cur->next->data)) {   // ผิดลำดับ → สลับ data
                int tmp = cur->data;
                cur->data = cur->next->data;
                cur->next->data = tmp;
                swapped = 1;
            }
            cur = cur->next;
        }
    }
    return (lst);
}`, cap: "สลับ 'data' ง่ายกว่าสลับ node; วนจนรอบไหนไม่มีสลับ (swapped=0) = เรียงเสร็จ", lang: "c" },

      { h: "🔬 ft_list_remove_if — ลบ node ที่ match + free (allowed: free)" },
      { code: String.raw`void ft_list_remove_if(t_list **begin, void *ref,
                       int (*cmp)(void *, void *)) {
    if (!begin || !*begin) return;
    if (cmp((*begin)->data, ref) == 0) {       // ตรง → ลบหัวปัจจุบัน
        t_list *del = *begin;
        *begin = (*begin)->next;               // ขยับ head ข้าม
        free(del);
        ft_list_remove_if(begin, ref, cmp);    // เช็คตัวใหม่ที่เลื่อนมา
    } else
        ft_list_remove_if(&(*begin)->next, ref, cmp); // ไปตัวถัดไป
}`, cap: "ใช้ t_list** (pointer-to-pointer) เพื่อแก้ตัว head ได้; recursive ทำให้สั้นและถูก", lang: "c" },

      { h: "🔬 rev_wstr / rostring — กลับ/หมุน 'คำ' ในประโยค" },
      { p: "**rev_wstr** = กลับลำดับคำ (`\"hi there\"` → `\"there hi\"`). **rostring** = หมุนคำแรกไปท้าย. ทั้งคู่ใช้ pattern แยกคำ + ประกอบใหม่ (ระวังช่องว่างเกิน → ผลลัพธ์เว้นวรรคเดียว)" },
      { code: String.raw`// rev_wstr: วนจาก 'ท้าย' string หาคำทีละคำแล้วพิมพ์
int i = len - 1;
while (i >= 0) {
    while (i >= 0 && is_sep(s[i])) i--;          // ข้ามคั่นท้าย
    int end = i;
    while (i >= 0 && !is_sep(s[i])) i--;          // หาเริ่มคำ
    for (int j = i + 1; j <= end; j++) write(1, &s[j], 1);
    if (i >= 0) write(1, " ", 1);                 // เว้นวรรค 1 ระหว่างคำ
}`, cap: "เดินถอยหลัง หาคำทีละคำ พิมพ์เลย — ไม่ต้อง malloc (ถ้าโจทย์ให้พิมพ์)", lang: "c" },
    ],

    implementation: [
      { h: "กลยุทธ์เวลา (3 ชั่วโมง)" },
      { table: { head: ["ช่วง", "ทำอะไร"], rows: [
        ["0:00–0:10", "อ่านโจทย์ level 0 ให้ครบ + เปิด main.c ที่ให้มา"],
        ["level 0", "เคลียร์ให้ไว (15-20 นาที) — เป็นแต้มฟรี อย่าพลาด"],
        ["level 1", "ตั้งใจขึ้น (20-30 นาที) — bitwise/atoi ต้องเป๊ะ"],
        ["level 2", "นี่คือเกณฑ์ผ่านส่วนใหญ่ — ทุ่มเวลาให้ถูก"],
        ["level 3", "โบนัส — ถ้ามีเวลาเหลือค่อยลุย ft_split/itoa"],
      ]}},
      { h: "ลำดับลงมือต่อ 1 ข้อ" },
      { ul: [
        "1. อ่าน subject 3 บรรทัดบน (ชื่อไฟล์, allowed funcs, prototype) ให้ครบ",
        "2. เปิด main.c (ถ้ามี) ดูว่าฟังก์ชันถูกเรียกยังไง + output คาดหวัง",
        "3. เขียนเคสปกติให้ผ่านก่อน แล้วค่อยเก็บ edge case",
        "4. คอมไพล์ `cc -Wall -Wextra -Werror` — เคลียร์ warning ให้หมด",
        "5. เทียบ output ด้วย `| cat -e` กับตัวอย่างใน subject",
        "6. นึกถึง edge: empty, NULL, ตัวเดียว, INT_MIN, ช่องว่างซ้อน",
        "7. กด grademe",
      ]},
      { note: "ติดข้อไหนนานเกิน ~25 นาที = พิจารณายอม submit เท่าที่ได้ หรือ retry (อาจได้โจทย์ใหม่). อย่าจมข้อเดียวจนหมดเวลา" },
      { h: "ซ้อมก่อนสอบยังไง" },
      { ul: [
        "clone `github.com/terminal-42s/42_examshell` แล้ว `bash exam.sh` ซ้อมจริง",
        "จับเวลา — ทำ level 0-2 ให้เสร็จใน ~1 ชม.",
        "ฝึกเขียน putstr/putnbr/split/itoa จากความจำ (ไม่เปิดเฉลย)",
        "ฝึกหา edge case เอง: รัน `./a.out` กับ input แปลก ๆ",
      ]},
    ],

    tricks: [
      { h: "กับดัก 1: norm ไม่ตรวจ — เขียนอิสระได้" },
      { p: "ข้อสอบตรวจแค่ 'คอมไพล์ผ่าน + output ตรง' **ไม่รัน norminette**. ใช้ `for`, ตัวแปรกลางบล็อก, ternary, ฟังก์ชันยาว ได้หมด → เขียนให้ถูกเร็วที่สุด อย่าเสียเวลาจัด norm" },
      { h: "กับดัก 2: -Werror จับ warning เล็ก ๆ" },
      { p: "ตัวแปรประกาศแล้วไม่ใช้, เทียบ signed กับ unsigned, ลืม return — กลายเป็น **error** ทันที. คอมไพล์บ่อย ๆ ระหว่างเขียน อย่ารอจนจบ" },
      { h: "กับดัก 3: output เกิน/ขาด \\n" },
      { p: "Moulinette เทียบด้วย diff — `\\n` เกินหรือขาดตัวเดียว = ตก. ใช้ `| cat -e` ดู `$` ท้ายบรรทัดให้ตรงตัวอย่าง subject เป๊ะ ๆ" },
      { h: "กับดัก 4: ลืมเคส empty / NULL / ตัวเดียว" },
      { p: "`ft_split(\"\")`, `ft_strlen` ของ string ว่าง, list ว่าง (NULL), array ตัวเดียว — เคสสุดขอบพวกนี้คือที่ tester ชอบยิง. เช็คก่อน return เสมอ" },
      { h: "กับดัก 5: INT_MIN ใน itoa/atoi/putnbr" },
      { p: "`-2147483648` ทำ `-n` แล้วล้น. putnbr ให้ดักเคสนี้ตรง ๆ; itoa ให้ abs ทีละหลัก (`n%10`). ลืม = segfault/ผลผิดเฉพาะเคสนี้" },
      { h: "กับดัก 6: malloc array ลืม +1 / ลืม NULL ปิดท้าย" },
      { p: "`ft_split` ต้อง `malloc(... * (n+1))` เผื่อ NULL; string ต้อง `len+1` เผื่อ `\\0`. ลืม = ผู้เรียกวนเลยขอบ → segfault" },
      { h: "กับดัก 7: ส่งไฟล์เกิน (มี main ทั้งที่ห้าม)" },
      { p: "ถ้า Expected files = `ft_split.c` อย่างเดียว แต่เราใส่ `int main()` ไว้เทสต์ → ชนกับ main ของ Moulinette = คอมไพล์ error. เทสต์ใน main แยกไฟล์ แล้วส่งแค่ไฟล์ที่บอก" },
    ],

    eval: [
      { qa: [
        { q: "ข้อสอบ Rank 02 ตรวจ norm ไหม?", a: "ไม่ตรวจ — ตรวจแค่คอมไพล์ผ่าน (-Wall -Wextra -Werror) และ output ตรงเป๊ะ. เขียน for/ternary/ฟังก์ชันยาวได้หมด" },
        { q: "ทำไม INT_MIN ทำให้ itoa/putnbr พัง แก้ยังไง?", a: "-2147483648 ทำ -n แล้วล้น (เพราะ +2147483648 เกิน INT_MAX). putnbr ดักพิมพ์ string ตรง ๆ; itoa ใช้ n%10 ทีละหลักแล้ว abs (หลักเดียวไม่ล้น)" },
        { q: "ft_split ต้อง malloc กี่ช่อง ทำไม?", a: "count_words + 1 — บวก 1 เผื่อ NULL ปิดท้าย array; แต่ละคำ malloc len+1 เผื่อ '\\0'. ลืม +1 = ผู้เรียกวนเกินขอบ → segfault" },
        { q: "pattern แยกคำใน split/last_word เป็นยังไง?", a: "วน: ข้ามตัวคั่น (space/tab/\\n) → เดินจนจบคำ → ข้ามตัวคั่น; ทำซ้ำจนจบ string. ใช้ทั้งตอนนับและตอนดูดคำ" },
        { q: "flood_fill ต้องระวังอะไรเป็นพิเศษ?", a: "(1) base case (ออกขอบ/ไม่ตรงสีเป้า) ต้องเช็คก่อน mark, (2) ต้องจำสีเป้า (tab[begin]) ส่งเข้า recursion — ถ้าอ่านสดหลัง mark จะเพี้ยน" },
        { q: "sort_list สลับ data หรือสลับ node ดีกว่า?", a: "สลับ data ง่ายและพอสำหรับ Rank 02 (bubble: วนจนรอบไหนไม่มีสลับ); สลับ node ต้องจัด pointer ซับซ้อนกว่า เสี่ยงพลาดในเวลาจำกัด" },
        { q: "ft_list_remove_if ทำไมใช้ t_list**?", a: "เพื่อแก้ตัว head ของ list ได้ (เวลา node แรกถูกลบ); recursive + pointer-to-pointer ทำให้โค้ดสั้นและจัดการทุกตำแหน่งได้ถูก" },
        { q: "ถ้า Allowed functions ว่างเปล่าหมายความว่า?", a: "ใช้ได้แค่ฟังก์ชันที่เขียนเอง — ห้าม printf/malloc/ทุกอย่างจาก libc. ถ้าเขียน 'malloc' = ใช้ได้แค่ malloc ตัวเดียว" },
        { q: "เทียบ output ให้ตรงเป๊ะใช้อะไร?", a: "`./a.out | cat -e` — เห็น $ (\\n) และ ^I (tab) ทำให้จับ \\n เกิน/ขาดที่ตาเปล่ามองไม่เห็น เทียบกับตัวอย่างใน subject" },
        { q: "ติดข้อเดียวนานควรทำไง?", a: "อย่าจมเกิน ~25 นาที — submit เท่าที่ได้ หรือ retry (อาจได้โจทย์ใหม่ในระดับเดิม). เป้าคือไต่ระดับให้สูงสุด ไม่ใช่เพอร์เฟกต์ข้อเดียว" },
      ]},
      { h: "ซ้อมจริงก่อนสอบ" },
      { code: String.raw`git clone https://github.com/terminal-42s/42_examshell
cd 42_examshell && bash exam.sh
# เลือก Rank 02 → จับเวลา → ทำ level 0-2 ให้ได้ใน 1 ชม.
# ฝึกพิมพ์ putnbr / ft_split / ft_itoa จากความจำ`, lang: "bash" },
    ],
  },
});

/* ===================== EXAM RANK 03 ===================== */
window.TEACHING_DATA.push({
  id: "exam_rank03",
  name: "Exam Rank 03",
  tag: { th: "ขยับขึ้นอีกขั้น — ซ่อม get_next_line, ฟังก์ชัน I/O ขั้นสูง (filter, ft_scanf) และอัลกอริทึม backtracking (n_queens, permutations, powerset, rip, tsp)",
         en: "A step up — repair get_next_line, advanced I/O (filter, ft_scanf), and backtracking algorithms (n_queens, permutations, powerset, rip, tsp)" },
  accent: "#34d399",
  sections: {
    principle: [
      { h: "Exam Rank 03 ต่างจาก Rank 02 ยังไง" },
      { p: "กติกา/examshell เหมือนเดิม (isolate, rendu/, grademe, ไม่ตรวจ norm) แต่โจทย์ **ใหญ่ขึ้นและคิดมากขึ้น** — มีแค่ 2 level แต่แต่ละข้อกินเวลานานกว่า Rank 02 มาก. หลายข้อ **ให้โค้ดเริ่มต้นมาแล้ว** ให้เราเติม/ซ่อม" },
      { h: "2 level ของ Rank 03" },
      { table: { head: ["Level", "แนว", "โจทย์"], rows: [
        ["**1**", "ซ่อม/เลียนแบบฟังก์ชัน I/O", "broken_gnl, filter, ft_scanf"],
        ["**2**", "อัลกอริทึม backtracking", "n_queens, permutations, powerset, rip, tsp"],
      ]}},
      { note: "หัวใจ Rank 03 คือ **backtracking** (level 2 เกือบทุกข้อ) + **get_next_line ที่ต้องแม่นจริง** (level 1). เตรียม 2 อย่างนี้ให้แน่น = ครอบคลุมเกือบหมด" },
      { h: "ทำไมยากกว่า" },
      { ul: [
        "level 1 ทดสอบด้วย **buffer size สุ่ม** / read แบบ custom → โค้ดต้องทนทุกขนาด buffer",
        "level 2 เป็น recursion + backtracking ที่ debug ยากในเวลาจำกัด",
        "output ต้อง **เรียง/ไม่ซ้ำ** ตามกติกาเป๊ะ (permutations เรียง alphabet, powerset ห้ามซ้ำ)",
      ]},
    ],
    theory: [
      { p: "Pool โจทย์จริง Rank 03 — 2 level" },
      { h: "Level 1 — ฟังก์ชัน I/O ขั้นสูง" },
      { table: { head: ["โจทย์", "ทำอะไร", "allowed"], rows: [
        ["`broken_gnl`", "ซ่อม get_next_line ที่พังให้คืนทีละบรรทัด (มี BUFFER_SIZE)", "read, malloc, free"],
        ["`filter`", "อ่าน stdin แทนทุก occurrence ของ arg ด้วย '*' (เท่าความยาว)", "read, write, memmem, memmove, malloc..."],
        ["`ft_scanf`", "เลียน scanf เฉพาะ %s %d %c (มีโค้ดเริ่มให้)", "fgetc, ungetc, va_arg..."],
      ]}},
      { h: "Level 2 — Backtracking & อัลกอริทึม" },
      { table: { head: ["โจทย์", "ทำอะไร", "เทคนิค"], rows: [
        ["`n_queens`", "วางควีน n ตัวไม่ตีกัน พิมพ์ทุกคำตอบ (row index ต่อ column)", "backtrack + safe check"],
        ["`permutations`", "พิมพ์ทุก permutation ของ string เรียง alphabet", "backtrack + used set"],
        ["`powerset`", "พิมพ์ subset ที่ผลรวม = n", "backtrack include/exclude + sum"],
        ["`rip`", "ลบวงเล็บให้สมดุลโดยลบน้อยสุด พิมพ์ทุกคำตอบ", "นับเกิน → enumerate"],
        ["`tsp`", "เส้นทางปิดสั้นสุดผ่านทุกเมือง (อ่านพิกัดจาก stdin)", "permute + min distance"],
      ]}},
      { note: "permutations / powerset / n_queens = backtracking pattern เดียวกันแทบเป๊ะ (เลือก → recurse → undo). ฝึกอันเดียวให้เข้าใจ = ทำได้ทั้งกลุ่ม" },
    ],
    foundations: [
      { p: "2 เสาหลักของ Rank 03: โครง get_next_line และ template backtracking" },
      { h: "1) โครง get_next_line (ต้องเข้าใจทุกบรรทัด)" },
      { code: String.raw`char *get_next_line(int fd) {
    static char *stash = NULL;            // เก็บส่วนที่อ่านเกินข้ามรอบ
    char buf[BUFFER_SIZE + 1];
    int  n;

    while (!has_newline(stash)) {          // ยังไม่เจอ \n → อ่านเพิ่ม
        n = read(fd, buf, BUFFER_SIZE);
        if (n <= 0) break;                 // EOF หรือ error
        buf[n] = '\0';
        stash = join_free(stash, buf);     // ต่อ buf เข้า stash (free เก่า)
    }
    if (!stash || !*stash) return (NULL);
    return (extract_line(&stash));         // ตัด 1 บรรทัด (รวม \n) ออกจาก stash
}`, cap: "stash (static) = หัวใจ: เก็บไบต์ที่อ่านเกินบรรทัดไว้รอบหน้า; วน read จนเจอ \\n หรือ EOF", lang: "c" },
      { note: "broken_gnl: เขามักทำพังที่ — ลืม static, ลืม free stash เก่า (leak), จัด \\n ผิด, หรือ off-by-one ของ buffer. อ่านโค้ดที่ให้มาแล้วไล่จุดเหล่านี้" },
      { h: "2) Template backtracking (ใช้ได้ทั้ง level 2)" },
      { code: String.raw`void solve(state, int depth) {
    if (depth == n) {                      // ครบ → เป็น 1 คำตอบ
        print_solution(state);
        return;
    }
    for (each choice c at this depth) {
        if (!valid(c)) continue;           // ตัดกิ่งที่เป็นไปไม่ได้ (pruning)
        apply(c, state);                   // เลือก
        solve(state, depth + 1);           // ลงลึก
        undo(c, state);                    // ★ ถอย (backtrack)
    }
}`, cap: "3 จังหวะ: เลือก → recurse → ถอย. 'undo' คือสิ่งที่หลายคนลืม ทำให้ state เพี้ยน", lang: "c" },
      { h: "3) อ่าน argument/หลายค่า + พิมพ์ไม่มี printf" },
      { p: "หลายข้อ allowed แค่ `write`/`puts` — เตรียม putstr/putnbr; powerset/tsp มี printf/malloc ให้. เช็ค 'Allowed functions' ทุกครั้งก่อนเลือกวิธีพิมพ์" },
    ],
    architecture: [
      { h: "examshell เหมือน Rank 02 แต่..." },
      { ul: [
        "หลายข้อ **ให้โค้ดเริ่มต้น** (broken_gnl ให้ GNL ที่พัง, ft_scanf ให้โครง, vbc-style ให้ parser เริ่ม) → เปิดอ่านให้ครบก่อนแตะ",
        "filter เทียบกับ `filter.sh` ที่ให้มาได้ (เป็น reference behavior)",
        "Expected files มัก `*.c *.h` → แยกไฟล์ + มี main ได้ตามใจ",
      ]},
      { h: "loop คอมไพล์-เทสต์" },
      { code: String.raw`# broken_gnl (มี -D BUFFER_SIZE):
cc -Wall -Wextra -Werror -D BUFFER_SIZE=42 *.c && ./a.out
# ลองหลาย BUFFER_SIZE: 1, 9999, 42 — ต้องผ่านหมด

# filter เทียบกับ sed/filter.sh:
echo "hello bonjour" | ./filter bonjour    # → hello *******
diff <(./filter abc < in) <(sed 's/abc/***/g' in)

# permutations/powerset เทียบ output เรียง:
./permutations abc | cat -e`, cap: "broken_gnl ต้องเทสต์หลาย BUFFER_SIZE; filter เทียบ sed; backtracking เทียบลำดับ output", lang: "bash" },
    ],
    dataflow: [
      { p: "เจาะลึกข้อหลัก Rank 03 — เน้น GNL + backtracking family" },

      { h: "🔬 broken_gnl — จุดพังที่ต้องไล่ซ่อม" },
      { p: "เขาให้ get_next_line ที่ 'เกือบถูก' มาให้ แล้วเราหาบั๊ก. จุดที่พังบ่อย:" },
      { ul: [
        "**ลืม `static`** ที่ stash → ข้อมูลข้ามรอบหาย, อ่านได้บรรทัดเดียว",
        "**memory leak** → ไม่ free stash เก่าตอน join, หรือไม่ free ตอน EOF",
        "**จัด `\\n` ผิด** → คืนบรรทัดไม่รวม \\n หรือรวมเกิน",
        "**off-by-one** → `buf[BUFFER_SIZE]` ต้องมีที่ใส่ '\\0' (จอง +1)",
        "**ไม่เช็ค read <= 0** → วนไม่จบตอน EOF/error",
      ]},
      { code: String.raw`// เช็คลิสต์ตอนซ่อม:
static char *stash;                 // ✓ static อยู่ไหม?
char buf[BUFFER_SIZE + 1];          // ✓ +1 สำหรับ '\0'
n = read(fd, buf, BUFFER_SIZE);
if (n <= 0) { /* จัดการ EOF: คืน stash ที่เหลือ แล้ว free */ }
buf[n] = '\0';
// join: tmp = strjoin(stash, buf); free(stash); stash = tmp;  ← free เก่า!`, cap: "ไล่ทีละจุด: static? +1? free เก่า? เช็ค read<=0? จัด \\n ถูก?", lang: "c" },

      { h: "🔬 permutations — backtracking + เรียง alphabet" },
      { p: "**กุญแจ:** เรียง string ก่อน (bubble sort) แล้ว generate ตามลำดับ → output ออกมาเรียง alphabet เอง. ใช้ used[] กันเลือกตัวซ้ำตำแหน่ง" },
      { code: String.raw`void permute(char *s, char *out, int *used, int len, int depth) {
    if (depth == len) { write(1, out, len); write(1, "\n", 1); return; }
    for (int i = 0; i < len; i++) {
        if (used[i]) continue;             // ตัวนี้ถูกใช้ในตำแหน่งก่อนแล้ว
        used[i] = 1;
        out[depth] = s[i];
        permute(s, out, used, len, depth + 1);
        used[i] = 0;                        // ถอย
    }
}
// เรียก: sort(s); permute(s, out, used, len, 0);`, cap: "เรียง input ก่อน → วน i ตามลำดับ → output เรียง alphabet อัตโนมัติ", lang: "c" },

      { h: "🔬 powerset — include/exclude + ติดตามผลรวม" },
      { p: "ทุกสมาชิก 'เลือก' หรือ 'ไม่เลือก'. ถึงปลาย (index==n) ถ้า sum == target พิมพ์ subset. รักษาลำดับเดิม → ไม่มีซ้ำ" },
      { code: String.raw`void bt(int *set, int n, int idx, int *pick, int cnt,
        int sum, int target) {
    if (idx == n) {
        if (sum == target) print_subset(pick, cnt);
        return;
    }
    pick[cnt] = set[idx];                              // เลือก set[idx]
    bt(set, n, idx + 1, pick, cnt + 1, sum + set[idx], target);
    bt(set, n, idx + 1, pick, cnt, sum, target);       // ไม่เลือก
}`, cap: "2 กิ่งต่อสมาชิก: เลือก (sum+, cnt+) หรือข้าม — เก็บลำดับเดิมจึงไม่ซ้ำ", lang: "c" },

      { h: "🔬 n_queens — วางควีนทีละคอลัมน์" },
      { p: "วางควีน 1 ตัวต่อ 1 คอลัมน์ ลองทุกแถวที่ 'ปลอดภัย' (ไม่ชนแถว/ทแยงกับที่วางไว้). ครบ n คอลัมน์ = 1 คำตอบ" },
      { code: String.raw`int safe(int *pos, int col, int row) {
    for (int c = 0; c < col; c++)
        if (pos[c] == row                      // แถวเดียวกัน
            || pos[c] - c == row - col          // ทแยง /
            || pos[c] + c == row + col)         // ทแยง \
            return (0);
    return (1);
}
void solve(int *pos, int col, int n) {
    if (col == n) { print_solution(pos, n); return; }
    for (int row = 0; row < n; row++)
        if (safe(pos, col, row)) {
            pos[col] = row;
            solve(pos, col + 1, n);             // ไม่ต้อง undo (เขียนทับรอบหน้า)
        }
}`, cap: "pos[col] = แถวของควีนในคอลัมน์นั้น; safe เช็คชนแถว + ทแยง 2 ทิศด้วยผลต่าง/ผลบวก index", lang: "c" },

      { h: "🔬 rip — ลบวงเล็บให้สมดุลโดยลบน้อยสุด" },
      { p: "2 ขั้น: (1) นับว่าต้องลบกี่ตัว (เกินซ้าย + เกินขวา) (2) enumerate ทุกวิธีลบจำนวนนั้นแล้วเช็คว่าสมดุล → พิมพ์ (แทนด้วยช่องว่าง)" },
      { code: String.raw`// ขั้น 1: หาจำนวนที่ต้องลบ
int open = 0, rm = 0;
for each c in s:
    if (c=='(') open++;
    else if (c==')') { if (open) open--; else rm++; } // ')' เกิน
rm += open;                                            // '(' ที่เหลือเกิน

// ขั้น 2: ลองลบ rm ตัว (backtrack เลือกตำแหน่ง) → ถ้าผลสมดุล พิมพ์
// (แทนตัวที่ลบด้วย ' ')`, cap: "ลบน้อยสุด = จำนวน ')' เกิน + '(' เกิน; แล้ว brute-force ตำแหน่งที่ลบให้ครบจำนวนนั้น", lang: "txt" },
    ],
    implementation: [
      { h: "กลยุทธ์ Rank 03" },
      { ul: [
        "**level 1 ก่อน** — broken_gnl/filter เป็นแต้มที่จับต้องได้ ถ้าแม่น GNL จะเร็ว",
        "ได้ broken_gnl = เปิดอ่านโค้ดที่ให้ ไล่ checklist (static/+1/free/\\n/read<=0)",
        "**level 2** เลือกข้อที่ถนัด backtracking — permutations มักง่ายสุดในกลุ่ม",
        "เขียน template backtracking ให้ขึ้นใจ แล้วปรับ valid()/print() ตามโจทย์",
      ]},
      { h: "ฝึกก่อนสอบ" },
      { ul: [
        "เขียน get_next_line จากศูนย์จนได้ภายใน 20 นาที (เทสต์ BUFFER_SIZE=1 และ 9999)",
        "เขียน permutations + powerset + n_queens จาก template เดียวกัน",
        "ฝึกหาบั๊กใน GNL ที่จงใจทำพัง (ลบ static, ลบ free) แล้วไล่ซ่อม",
      ]},
    ],
    tricks: [
      { h: "กับดัก 1: broken_gnl ลืม static / leak" },
      { p: "stash ต้อง `static` (ไม่งั้นอ่านได้บรรทัดเดียว); join ต้อง free ตัวเก่า (ไม่งั้น leak ทุกบรรทัด — บาง Moulinette เช็ค leak)" },
      { h: "กับดัก 2: buffer size สุ่ม (filter/gnl)" },
      { p: "เทสเตอร์ใช้ read ที่คืนจำนวน byte ไม่แน่นอน — โค้ดต้องสะสมใน buffer ที่โตได้ ห้ามสมมติว่า 1 read = 1 บรรทัด/1 คำ" },
      { h: "กับดัก 3: filter — pattern คาบ buffer" },
      { p: "ถ้า arg = 'abc' แต่ read มาได้ 'ab' รอบหนึ่ง 'c' อีกรอบ → ต้อง buffer ไว้ก่อน match ห้ามพิมพ์ทันที. ใช้ buffer สะสม + memmem หา + memmove" },
      { h: "กับดัก 4: ลำดับ output (permutations/powerset)" },
      { p: "permutations ต้องเรียง alphabet (เรียง input ก่อน); powerset ห้ามซ้ำ (รักษาลำดับเดิม ไม่สลับ). ลำดับผิด = ตกแม้ logic ถูก" },
      { h: "กับดัก 5: ลืม undo ใน backtracking" },
      { p: "used[i]=0 / ถอน state หลัง recurse — ลืมแล้ว state รั่วไปกิ่งถัดไป ได้คำตอบผิด/ซ้ำ (n_queens เขียนทับ pos ได้เลยจึงไม่ต้อง undo แต่ permutations ต้อง)" },
      { h: "กับดัก 6: ไม่อ่านโค้ดที่ให้มาก่อน" },
      { p: "ft_scanf/broken_gnl ให้โค้ดเริ่มมา — ถ้าเขียนทับทั้งหมดเองจะเสียเวลา/ผิด prototype. เติมในช่องที่เขาเว้นไว้" },
    ],
    eval: [
      { qa: [
        { q: "stash ใน get_next_line ทำไมต้อง static?", a: "เพราะไบต์ที่ read มาเกินบรรทัดปัจจุบันต้องเก็บไว้ใช้รอบหน้า; static ทำให้ค่าคงอยู่ข้ามการเรียก — ถ้าเป็น local จะหายทุกรอบ อ่านได้บรรทัดเดียว" },
        { q: "broken_gnl จุดพังที่พบบ่อยคืออะไร?", a: "ลืม static, ไม่ free stash เก่า (leak), buf ไม่จอง +1 สำหรับ '\\0', จัด \\n ผิด, ไม่เช็ค read<=0 (วนไม่จบ)" },
        { q: "backtracking template 3 จังหวะคืออะไร?", a: "เลือก (apply) → ลงลึก (recurse depth+1) → ถอย (undo). ที่ปลาย (depth==n) บันทึก/พิมพ์คำตอบ; valid() ตัดกิ่งที่เป็นไปไม่ได้ก่อน" },
        { q: "permutations ทำให้ output เรียง alphabet ยังไง?", a: "เรียง string input ก่อน (bubble sort) แล้ววนเลือกตามลำดับ index ด้วย used[] → permutation ที่ออกมาเรียง alphabet เอง" },
        { q: "powerset ป้องกันซ้ำยังไง?", a: "ใช้ include/exclude ตามลำดับ index เดิม (ไม่สลับตำแหน่ง) → subset '1 2' กับ '2 1' ไม่เกิดเพราะรักษาลำดับเดิมเสมอ" },
        { q: "n_queens เช็ค 'ปลอดภัย' ยังไง?", a: "ควีนใหม่ที่ (col,row) ปลอดภัยถ้าไม่มีตัวก่อนหน้า: แถวเดียวกัน (pos[c]==row), ทแยง / (pos[c]-c==row-col), ทแยง \\ (pos[c]+c==row+col)" },
        { q: "rip ลบวงเล็บน้อยสุดได้เท่าไร?", a: "= จำนวน ')' ที่เกิน (ไม่มี '(' คู่) + จำนวน '(' ที่เหลือไม่ถูกปิด; แล้ว enumerate ตำแหน่งที่ลบให้ครบจำนวนนั้นที่ทำให้สมดุล" },
        { q: "filter ทำไม pattern อาจคาบ buffer?", a: "read คืน byte ไม่แน่นอน — pattern อาจถูกหั่นข้าม 2 read; ต้องสะสมใน buffer ก่อนค่อย match (memmem) ห้าม match/พิมพ์ทีละ read" },
        { q: "Rank 03 เน้นเตรียมอะไร 2 อย่าง?", a: "(1) get_next_line ที่เขียน/ซ่อมได้คล่อง (level 1), (2) backtracking template (n_queens/permutations/powerset — level 2). 2 อย่างนี้ครอบคลุมเกือบหมด" },
      ]},
      { h: "ซ้อมจริง", },
      { code: String.raw`bash exam.sh   # เลือก Rank 03
# level 1: เขียน gnl ใหม่ใน 20 นาที, เทสต์ BUFFER_SIZE=1 และ 9999
# level 2: permutations → powerset → n_queens จาก template เดียวกัน`, lang: "bash" },
    ],
  },
});
