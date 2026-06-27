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

/* ===================== EXAM RANK 04 ===================== */
window.TEACHING_DATA.push({
  id: "exam_rank04",
  name: "Exam Rank 04",
  tag: { th: "ด่านหิน — process & file descriptor (ft_popen, picoshell, sandbox) และ recursive-descent parser (vbc, argo). ใช้สกิล pipex/minishell + การเขียน parser ตามไวยากรณ์",
         en: "The tough one — processes & file descriptors (ft_popen, picoshell, sandbox) and recursive-descent parsers (vbc, argo). Pipex/minishell skills + grammar-driven parsing" },
  accent: "#f472b6",
  sections: {
    principle: [
      { h: "Exam Rank 04 — โหดสุดในสาย C" },
      { p: "2 level, แต่ละข้อ 'เล็กแต่ลึก'. ต้องผสมหลายสกิลพร้อมกัน: **process control** (fork/pipe/dup2/exec/wait/signal) สำหรับ level 1 และ **การเขียน parser ตามไวยากรณ์** (recursive descent) สำหรับ level 2" },
      { h: "2 level" },
      { table: { head: ["Level", "แนว", "โจทย์"], rows: [
        ["**1**", "Process & fd", "ft_popen, picoshell, sandbox"],
        ["**2**", "Recursive-descent parser", "vbc (นิพจน์เลข), argo (JSON)"],
      ]}},
      { note: "level 1 = ต่อยอดจาก pipex/minishell โดยตรง (ถ้าทำ 2 โปรเจกต์นั้นมาแล้วจะคุ้น). level 2 = grammar เดียวกันทั้ง vbc/argo — เข้าใจ recursive descent ครั้งเดียวทำได้ทั้งคู่" },
      { h: "ทำไมยาก" },
      { ul: [
        "level 1 ต้อง **ปิด fd ครบ** และ **ไม่ leak process** (zombie) — พลาดจุดเดียว = ค้าง/ตก",
        "level 2 ต้องจัดการ **precedence + วงเล็บ + error token** ให้ตรงเป๊ะ",
        "หลายข้อให้ **โครงโค้ด + main** มาแล้ว ต้องอ่านให้เข้าใจก่อนเติม",
      ]},
    ],
    theory: [
      { p: "Pool โจทย์จริง Rank 04" },
      { h: "Level 1 — Process & File Descriptor" },
      { table: { head: ["โจทย์", "ทำอะไร", "allowed"], rows: [
        ["`ft_popen`", "รัน cmd แล้วคืน fd ต่อกับ output ('r') หรือ input ('w')", "pipe, fork, dup2, execvp, close, exit"],
        ["`picoshell`", "รัน pipeline หลายคำสั่งต่อกันด้วย pipe", "close, fork, wait, exit, execvp, dup2, pipe"],
        ["`sandbox`", "รัน f() ในลูก เช็คว่า 'ดี/แย่' (signal/exit≠0/timeout)", "fork, waitpid, alarm, sigaction, kill, printf..."],
      ]}},
      { h: "Level 2 — Recursive-Descent Parser" },
      { table: { head: ["โจทย์", "ทำอะไร", "ไวยากรณ์"], rows: [
        ["`vbc`", "ประเมินนิพจน์ + * และวงเล็บ (เลข 0-9)", "expr/term/factor"],
        ["`argo`", "parse JSON (number/string/map) เป็น AST แล้วพิมพ์กลับ", "value/number/string/map"],
      ]}},
      { note: "vbc กับ argo คือ recursive-descent เหมือนกัน ต่างแค่ 'ไวยากรณ์' — โครง parse_X() เรียกซ้อนกันตาม grammar เดียวกัน" },
    ],
    foundations: [
      { p: "2 เสาหลัก Rank 04: pattern process/fd และโครง recursive-descent parser" },
      { h: "1) fork + pipe + dup2 (คืน fd ของ cmd)" },
      { code: String.raw`int p[2];
pipe(p);                         // p[0]=read, p[1]=write
if (fork() == 0) {               // child = ตัวรันคำสั่ง
    dup2(p[1], 1);               // 'r': cmd เขียน stdout → เข้าท่อ
    close(p[0]); close(p[1]);
    execvp(file, argv);
    exit(1);                     // exec fail
}
close(p[1]);                     // พ่อปิดปลายเขียน
return (p[0]);                   // คืนปลายอ่าน = ดึง output ของ cmd ได้`, cap: "'r' = อ่าน output ของ cmd (dup stdout→pipe, คืน read end). 'w' = ป้อน input (dup stdin←pipe, คืน write end)", lang: "c" },
      { h: "2) waitpid + ถอดรหัสสถานะลูก (sandbox)" },
      { code: String.raw`int status;
waitpid(pid, &status, 0);
if (WIFEXITED(status)) {
    int code = WEXITSTATUS(status);      // จบปกติ → exit code
}
if (WIFSIGNALED(status)) {
    int sig = WTERMSIG(status);          // ถูก signal ฆ่า (segfault=11..)
}
// timeout: ตั้ง alarm(timeout) ก่อน + จับ SIGALRM → kill(pid) ลูก`, cap: "WIFEXITED/WEXITSTATUS = จบเอง; WIFSIGNALED/WTERMSIG = ถูกฆ่า; alarm = ตัวจับ timeout", lang: "c" },
      { h: "3) โครง Recursive-Descent Parser (หัวใจ level 2)" },
      { code: String.raw`// grammar (vbc): จาก precedence ต่ำ → สูง
//   expr   = term   ('+' term)*
//   term   = factor ('*' factor)*
//   factor = digit | '(' expr ')'

int parse_expr(void) {
    int v = parse_term();
    while (peek() == '+') { next(); v = v + parse_term(); }
    return (v);
}
int parse_term(void) {
    int v = parse_factor();
    while (peek() == '*') { next(); v = v * parse_factor(); }
    return (v);
}
int parse_factor(void) {
    if (isdigit(peek())) return (next() - '0');
    if (peek() == '(') {
        next();
        int v = parse_expr();
        if (peek() != ')') error_token(peek());
        next();                                  // กิน ')'
        return (v);
    }
    error_token(peek());                          // token ไม่คาดคิด
    return (0);
}`, cap: "ฟังก์ชัน 1 ตัวต่อ 1 กฎไวยากรณ์; precedence ออกมาเองจาก 'ใครเรียกใคร' (expr เรียก term เรียก factor)", lang: "c" },
      { note: "ทำไม * ผูกแน่นกว่า +: เพราะ parse_term (ชั้น *) ถูกเรียก 'ข้างใน' parse_expr (ชั้น +) → * ถูกจับกลุ่มก่อนเสมอ. วงเล็บรีเซ็ตกลับไป parse_expr" },
    ],
    architecture: [
      { h: "examshell — Rank 04" },
      { ul: [
        "หลายข้อให้ **main + โครง** มา (picoshell มี main, vbc/argo ให้ node struct + helper) → อ่านก่อนเขียน",
        "level 1 เทสต์ leak fd/process จริง — ปิดให้ครบ, waitpid ทุกลูก",
        "level 2 เทสต์ว่า output = input เป๊ะ (argo) หรือผลเลขถูก (vbc) + error message ตรง",
      ]},
      { code: String.raw`# ft_popen / picoshell — เทสต์ pipeline:
./picoshell echo squalala "|" cat "|" sed 's/a/b/g'   # → squblblb
# sandbox — เทสต์กับ f() ที่ segfault/loop/exit(0):
# vbc — เทสต์ precedence + paren + error:
./vbc '3+4*5' | cat -e        # 23
./vbc '(3+4)*5' | cat -e       # 35
./vbc '1+' | cat -e            # Unexpected end of input
./vbc '1+2)' | cat -e          # Unexpected token ')'`, cap: "vbc: ไล่เทสต์ precedence, วงเล็บ, และ error 2 แบบ (token / end of input)", lang: "bash" },
    ],
    dataflow: [
      { p: "เจาะลึกข้อหลัก Rank 04" },

      { h: "🔬 ft_popen — รัน cmd แล้วคืน fd ต่อ output/input" },
      { code: String.raw`int ft_popen(const char *file, char *const argv[], char type) {
    int p[2];
    if (!file || !argv || (type != 'r' && type != 'w')) return (-1);
    if (pipe(p) == -1) return (-1);
    pid_t pid = fork();
    if (pid == -1) { close(p[0]); close(p[1]); return (-1); }
    if (pid == 0) {
        if (type == 'r') dup2(p[1], 1);    // อ่าน output → ลูกเขียน stdout เข้าท่อ
        else             dup2(p[0], 0);    // ป้อน input  → ลูกอ่าน stdin จากท่อ
        close(p[0]); close(p[1]);
        execvp(file, argv);
        exit(1);
    }
    if (type == 'r') { close(p[1]); return (p[0]); }   // พ่อคืน read end
    close(p[0]); return (p[1]);                         // พ่อคืน write end
}`, cap: "'r' พ่อคืน read end (อ่าน output cmd); 'w' คืน write end (ป้อน input cmd). ปิดปลายตรงข้ามเสมอ", lang: "c" },

      { h: "🔬 picoshell — ต่อ pipeline หลายคำสั่ง (rolling pipe)" },
      { p: "วน fork ทีละคำสั่ง เก็บ 'read end ของท่อก่อนหน้า' เป็น stdin คำสั่งถัดไป — pattern เดียวกับ exec_pipeline ใน minishell" },
      { code: String.raw`int picoshell(char **cmds[]) {
    int in = 0, p[2], i = 0;
    pid_t pid;
    while (cmds[i]) {
        if (cmds[i + 1]) pipe(p);                // มีคำสั่งถัดไป → สร้างท่อ
        pid = fork();
        if (pid == 0) {
            if (in) { dup2(in, 0); close(in); }   // อ่านจากท่อก่อนหน้า
            if (cmds[i + 1]) { dup2(p[1], 1); close(p[0]); close(p[1]); }
            execvp(cmds[i][0], cmds[i]);
            exit(1);
        }
        if (in) close(in);
        if (cmds[i + 1]) { close(p[1]); in = p[0]; } // ★ ปิด write ทันที
        i++;
    }
    while (wait(NULL) > 0);                        // เก็บลูกทุกตัว
    return (0);
}`, cap: "พ่อปิด write end ทันทีทุกรอบ → EOF ส่งต่อถูก ไม่ค้าง (เหมือน minishell deep dive)", lang: "c" },

      { h: "🔬 sandbox — ตัดสินว่า f() 'ดี' หรือ 'แย่'" },
      { p: "fork → ลูกรัน f() แล้ว exit(0); พ่อ alarm(timeout) + waitpid. ถอดสถานะ: signal=แย่, exit≠0=แย่, timeout=แย่, exit(0)=ดี" },
      { code: String.raw`int sandbox(void (*f)(void), unsigned int timeout, bool verbose) {
    pid_t pid = fork();
    if (pid == -1) return (-1);
    if (pid == 0) { f(); exit(0); }               // ลูก: รัน f → ถ้ารอด exit 0
    // พ่อ: ตั้ง SIGALRM handler + alarm(timeout) เพื่อจับ timeout
    int status;
    alarm(timeout);                                // (ผ่าน sigaction กัน timeout)
    if (waitpid(pid, &status, 0) == -1) { kill(pid, SIGKILL); return (-1); }
    alarm(0);
    if (WIFSIGNALED(status)) { /* "Bad: <signal>" */ return (0); }
    if (WIFEXITED(status) && WEXITSTATUS(status) == 0) { /* Nice! */ return (1); }
    return (0);                                     // exit code อื่น = แย่
}`, cap: "ดี = WIFEXITED && code==0 เท่านั้น; ที่เหลือ (signal/exit≠0/timeout) = แย่; ห้ามทิ้ง zombie", lang: "c" },

      { h: "🔬 vbc — recursive descent ประเมินนิพจน์ + * ()" },
      { p: "3 ชั้นตาม precedence: expr (+) → term (*) → factor (digit/วงเล็บ). ดู foundations สำหรับโครงเต็ม. error: token ผิด → \"Unexpected token '%c'\", หมด input กลางคัน → \"Unexpected end of input\"" },
      { code: String.raw`// ตัวอย่างการไหล: '3+4*5'
parse_expr:  v = parse_term()        → 3
             peek '+' → v = 3 + parse_term()
                                       parse_term: parse_factor()=4
                                       peek '*' → 4 * parse_factor()=5 → 20
             v = 3 + 20 = 23  ✓ (* ผูกก่อน + เพราะ term อยู่ชั้นใน)

// '(3+4)*5':
parse_factor เจอ '(' → parse_expr=7 → กิน ')' → term: 7 * 5 = 35 ✓`, cap: "precedence โผล่จากโครงสร้างการเรียก ไม่ต้องเขียนกฎ precedence แยก", lang: "txt" },

      { h: "🔬 argo — recursive descent parse JSON" },
      { p: "ไวยากรณ์ง่ายกว่า JSON จริง: เฉพาะ number / string / map. โครง parse_value แตกตามตัวอักษรแรก แล้วพิมพ์กลับให้ตรง input เป๊ะ" },
      { code: String.raw`int parse_value(json *dst, FILE *f) {
    int c = peek(f);
    if (isdigit(c) || c == '-')  return parse_number(dst, f);  // 42
    if (c == '"')                return parse_string(dst, f);  // "abc"
    if (c == '{')                return parse_map(dst, f);     // {"k":v,...}
    return unexpected(c);                                       // error
}
// parse_map: กิน '{' → วน (string ':' value) คั่นด้วย ',' → กิน '}'
// string: กิน '"' → อ่านจนเจอ '"' (จัดการ \\ และ \" เท่านั้น)`, cap: "parse_value = dispatcher ตามตัวแรก; map เรียก value ซ้ำ (recursion) → รองรับ nested {} ลึกเท่าไรก็ได้", lang: "c" },
    ],
    implementation: [
      { h: "กลยุทธ์ Rank 04" },
      { ul: [
        "ถ้าถนัด pipex/minishell → ลุย **level 1** (ft_popen ง่ายสุดในกลุ่ม) ก่อน",
        "ถ้าถนัด parser → **level 2** vbc ตรงไปตรงมากว่า argo (argo จัดการ string escaping + map)",
        "เขียนโครง recursive descent ให้ขึ้นใจ — vbc/argo ใช้โครงเดียวกัน",
        "ปิด fd/wait ทุกลูกให้ครบ (level 1 ตก leak ง่ายมาก)",
      ]},
      { h: "ฝึกก่อนสอบ" },
      { ul: [
        "เขียน ft_popen + picoshell จากศูนย์ (ทบ fork/pipe/dup2/wait)",
        "เขียน vbc evaluator จาก grammar expr/term/factor ให้คล่อง",
        "ทบ WIFEXITED/WIFSIGNALED/WTERMSIG + alarm สำหรับ sandbox",
      ]},
    ],
    tricks: [
      { h: "กับดัก 1: ลืมปิด fd → pipeline ค้าง" },
      { p: "ft_popen/picoshell: พ่อต้องปิดปลายที่ไม่ใช้ทันที, ลูกต้องปิดทั้งสองปลายหลัง dup2 — ลืม = read รอ EOF ไม่มา = ค้าง (เหมือน pipex/minishell)" },
      { h: "กับดัก 2: zombie process (sandbox/picoshell)" },
      { p: "ต้อง waitpid/wait ลูก 'ทุกตัว' — sandbox เช็ค leak process ด้วย wait; picoshell ต้อง `while(wait(NULL)>0)` เก็บให้หมด" },
      { h: "กับดัก 3: precedence ผิด (vbc)" },
      { p: "`3+4*5` ต้อง = 23 ไม่ใช่ 35 — ต้องให้ parse_term (ชั้น *) อยู่ 'ข้างใน' parse_expr (ชั้น +). สลับชั้น = precedence พัง" },
      { h: "กับดัก 4: error message ไม่ตรง (vbc/argo)" },
      { p: "token ผิด → \"Unexpected token '%c'\\n\" exit 1; หมด input กลางคัน → \"Unexpected end of input\\n\". ต้องแยก 2 เคสและข้อความเป๊ะ" },
      { h: "กับดัก 5: argo — string escaping + พิมพ์กลับเป๊ะ" },
      { p: "จัดการแค่ \\\\ และ \\\" (ไม่ต้องทำ \\n \\u); output ต้อง = input เป๊ะรวม escape — พิมพ์ string ต้องใส่ \\ คืนให้ถูก" },
      { h: "กับดัก 6: ไม่อ่าน main/struct ที่ให้มา" },
      { p: "vbc/argo ให้ node struct + helper (เช่น accept/expect/unexpected) มาแล้ว — ใช้ของที่ให้ อย่าเขียนใหม่หมด เสียเวลาและผิด interface" },
    ],
    eval: [
      { qa: [
        { q: "ft_popen 'r' กับ 'w' ต่างกันยังไง?", a: "'r' = อ่าน output ของ cmd: ลูก dup2(pipe_w, stdout), พ่อคืน read end. 'w' = ป้อน input: ลูก dup2(pipe_r, stdin), พ่อคืน write end. ปิดปลายตรงข้ามเสมอ" },
        { q: "picoshell ต่อ pipeline ยังไงไม่ให้ค้าง?", a: "rolling pipe: เก็บ read end ท่อก่อนหน้าเป็น stdin คำสั่งถัดไป; พ่อปิด write end ทันทีหลัง fork ทุกรอบ → EOF ส่งต่อถูก; ปิด in เก่าด้วย; wait ทุกลูกท้ายสุด" },
        { q: "sandbox ตัดสิน 'ดี' ยังไง?", a: "ดี = WIFEXITED(status) && WEXITSTATUS==0 เท่านั้น. แย่ = ถูก signal (WIFSIGNALED), exit code ≠ 0, หรือ timeout (alarm). ต้องไม่ทิ้ง zombie (wait ให้ครบ)" },
        { q: "recursive descent ทำให้ * ผูกแน่นกว่า + ยังไง?", a: "จัดชั้น: expr (จัดการ +) เรียก term (จัดการ *) เรียก factor. เพราะ term อยู่ 'ข้างใน' expr มันถูกประเมินจับกลุ่มก่อน → * ผูกแน่นกว่า + เอง" },
        { q: "วงเล็บใน vbc จัดการยังไง?", a: "ใน parse_factor เจอ '(' → กิน แล้วเรียก parse_expr (กลับไปชั้นบนสุด) → ได้ค่าในวงเล็บ → ต้องเจอ ')' ปิด ไม่งั้น error" },
        { q: "vbc มี error กี่แบบ?", a: "2 แบบ: token ที่ไม่คาดคิด → \"Unexpected token '%c'\" ; input หมดกลางคัน (เช่น '1+') → \"Unexpected end of input\". ทั้งคู่ exit 1" },
        { q: "argo parse map (nested) ยังไง?", a: "parse_value dispatch ตามตัวแรก; '{' → parse_map วน (string ':' value); value อาจเป็น map อีก → recursion รองรับ {} ซ้อนลึกเท่าไรก็ได้" },
        { q: "argo จัดการ escape อะไรบ้าง?", a: "เฉพาะ \\\\ (backslash) และ \\\" (quote) — ไม่ต้องทำ \\n \\u; ตอนพิมพ์กลับต้องใส่ \\ คืนให้ output ตรง input เป๊ะ" },
        { q: "Rank 04 level 1 ตกเพราะอะไรบ่อยสุด?", a: "leak fd (ลืมปิดปลายท่อ → ค้าง) และ leak/zombie process (ไม่ wait ลูกครบ). ปิด fd + wait ให้ครบคือหัวใจ" },
      ]},
      { h: "ซ้อมจริง", },
      { code: String.raw`bash exam.sh   # เลือก Rank 04
# level 1: ft_popen → picoshell → sandbox (ทบ fork/pipe/dup2/wait/signal)
# level 2: vbc (expr/term/factor) → argo (value/string/map) จากโครงเดียวกัน`, lang: "bash" },
    ],
  },
});

/* ===================== EXAM RANK 05 ===================== */
window.TEACHING_DATA.push({
  id: "exam_rank05",
  name: "Exam Rank 05",
  tag: { th: "สาย C++ — operator overloading, Orthodox Canonical Form, inheritance/abstract (vect2, bigint, polyset) และอัลกอริทึม C (bsq แบบ DP, game of life)",
         en: "The C++ rank — operator overloading, Orthodox Canonical Form, inheritance/abstract classes (vect2, bigint, polyset), plus C algorithms (bsq via DP, game of life)" },
  accent: "#818cf8",
  sections: {
    principle: [
      { h: "Exam Rank 05 — C++ เป็นหลัก" },
      { p: "ต่อยอดจาก CPP Modules. level 1 เป็น **C++ class** ที่เน้น operator overloading + OCF + inheritance; level 2 กลับมาเป็น **อัลกอริทึม C** (bsq, life). คอมไพล์ด้วย `c++ -Wall -Wextra -Werror -std=c++98`" },
      { h: "2 level" },
      { table: { head: ["Level", "แนว", "โจทย์"], rows: [
        ["**1**", "C++ class & operators", "vect2, bigint, polyset"],
        ["**2**", "อัลกอริทึม C", "bsq (biggest square / DP), life (game of life)"],
      ]}},
      { note: "level 1 ต้องแม่น **Orthodox Canonical Form** (ctor, copy ctor, copy assign, dtor) + operator overloading + const correctness. vect2 ง่ายสุด, polyset ยากสุด (inheritance + abstract)" },
    ],
    theory: [
      { p: "Pool โจทย์จริง Rank 05" },
      { h: "Level 1 — C++ class" },
      { table: { head: ["โจทย์", "ทำอะไร", "เน้น"], rows: [
        ["`vect2`", "เวกเตอร์ 2 มิติ + - * [] << ++ --", "operator overloading พื้นฐาน"],
        ["`bigint`", "จำนวนเต็มความแม่นยำไม่จำกัด (+, เทียบ, digit shift <<>>)", "operators + เก็บเป็น string/array"],
        ["`polyset`", "inheritance: searchable bag + set wrapper", "abstract class, virtual, OCF, const"],
      ]}},
      { h: "Level 2 — อัลกอริทึม C" },
      { table: { head: ["โจทย์", "ทำอะไร", "เทคนิค"], rows: [
        ["`bsq`", "หาสี่เหลี่ยมจัตุรัสใหญ่สุดบนแผนที่เลี่ยงสิ่งกีดขวาง", "dynamic programming"],
        ["`life`", "Conway's Game of Life (input เป็นคำสั่งวาดด้วยปากกา)", "grid + parsing + simulation"],
      ]}},
    ],
    foundations: [
      { p: "เสาหลัก Rank 05: Orthodox Canonical Form, operator overloading, และ DP grid" },
      { h: "1) Orthodox Canonical Form (OCF) — 4 ฟังก์ชันบังคับ" },
      { code: String.raw`class Foo {
public:
    Foo();                              // default constructor
    Foo(const Foo &other);              // copy constructor
    Foo &operator=(const Foo &other);   // copy assignment
    ~Foo();                             // destructor
};`, cap: "ทุก class ใน Rank 05 (โดยเฉพาะ polyset) ต้องครบ OCF — ลืมตัวใดตัวหนึ่ง = ตก", lang: "cpp" },
      { h: "2) Operator overloading — member vs free function" },
      { code: String.raw`// arithmetic/compound: เป็น member (มี this เป็นตัวซ้าย)
vect2  operator+(const vect2 &r) const { return vect2(x+r.x, y+r.y); }
vect2 &operator+=(const vect2 &r) { x+=r.x; y+=r.y; return *this; }

// pre/post increment
vect2 &operator++()    { ++x; ++y; return *this; }      // ++v (pre)
vect2  operator++(int) { vect2 t=*this; ++*this; return t; } // v++ (post, มี int หลอก)

// << ต้องเป็น "free function" เพราะตัวซ้ายคือ ostream ไม่ใช่ vect2
std::ostream &operator<<(std::ostream &o, const vect2 &v) {
    return o << "{" << v[0] << ", " << v[1] << "}";
}
// scalar*vect (เช่น 3 * v) ต้องเป็น free function ด้วย (ตัวซ้ายเป็น int)`, cap: "ตัวซ้ายเป็น object เรา → member; ตัวซ้ายเป็น ostream/int → free function", lang: "cpp" },
      { note: "เคล็ด: pre-increment คืน reference (*this), post-increment คืน copy ค่าเก่า (รับ int หลอกเพื่อแยกจาก pre). const ต่อท้าย method ที่แค่อ่าน" },
      { h: "3) Dynamic Programming บน grid (bsq)" },
      { code: String.raw`// dp[i][j] = ขนาดสี่เหลี่ยมจัตุรัสใหญ่สุดที่ "มุมขวาล่าง" อยู่ที่ (i,j)
if (map[i][j] == obstacle) dp[i][j] = 0;
else if (i==0 || j==0)     dp[i][j] = 1;          // ขอบ
else dp[i][j] = min3(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1;
// ติดตาม max + ตำแหน่ง (บนสุด ก่อน ซ้ายสุด)`, cap: "สี่เหลี่ยมที่มุมล่างขวา (i,j) ขยายได้เท่ากับ 'เพื่อนบ้าน 3 ทิศที่เล็กสุด + 1'", lang: "c" },
    ],
    architecture: [
      { h: "examshell — Rank 05" },
      { ul: [
        "level 1 ให้ `main` มาเสมอ (vect2/bigint) — class เราต้องทำให้ main นั้นคอมไพล์+รันถูก",
        "polyset ให้ abstract classes (bag, searchable_bag, array_bag, tree_bag) มา → เราเขียน searchable_* + set",
        "คอมไพล์ `-std=c++98` เสมอ",
        "level 2 (bsq/life) เป็น C ปกติ — เทสต์ output เป๊ะด้วย cat -e",
      ]},
      { code: String.raw`# C++ (level 1):
c++ -Wall -Wextra -Werror -std=c++98 *.cpp && ./a.out
# bsq (level 2):
./bsq map.txt | cat -e        # เทียบสี่เหลี่ยมที่ถูก (บนสุด-ซ้ายสุด)
# life:
echo 'sdxddssaaww' | ./life 5 5 0 | cat -e`, cap: "level 1 ต้องผ่าน main ที่ให้; level 2 เทียบ output เป๊ะ", lang: "bash" },
    ],
    dataflow: [
      { p: "เจาะลึกข้อหลัก Rank 05" },

      { h: "🔬 vect2 — operator overloading ครบชุด" },
      { p: "โจทย์ฝึก operator ครบ: + - * (scalar) [] << ++ -- += -= *=. กุญแจคือรู้ว่าตัวไหนเป็น member ตัวไหนเป็น free function (ดู foundations)" },
      { code: String.raw`class vect2 {
    int e[2];
public:
    vect2(int a=0, int b=0) { e[0]=a; e[1]=b; }
    int &operator[](int i) { return e[i]; }
    int  operator[](int i) const { return e[i]; }   // const overload
    vect2 operator+(const vect2 &r) const { return vect2(e[0]+r[0], e[1]+r[1]); }
    vect2 operator*(int s) const { return vect2(e[0]*s, e[1]*s); }
    vect2 &operator+=(const vect2 &r) { e[0]+=r[0]; e[1]+=r[1]; return *this; }
};
vect2 operator*(int s, const vect2 &v) { return v * s; }    // 3 * v
std::ostream &operator<<(std::ostream &o, const vect2 &v) {
    return o << "{" << v[0] << ", " << v[1] << "}";
}`, cap: "operator[] ต้องมี 2 เวอร์ชัน (const + non-const); scalar*vect และ << เป็น free function", lang: "cpp" },

      { h: "🔬 bigint — จำนวนเต็มความแม่นยำไม่จำกัด" },
      { p: "เก็บเลขเป็น **string ของหลัก** (จัดการเกิน SIZE_MAX ได้). บวกแบบมีตัวทด, เทียบด้วยความยาวก่อนแล้วค่อยเทียบหลัก, digit shift = เติม/ตัด '0'" },
      { code: String.raw`// บวก: ไล่จากหลักหน่วย เก็บตัวทด (carry)
// เทียบ a < b: ถ้าความยาวต่างกัน → ตัวสั้นกว่าน้อยกว่า
//             ความยาวเท่ากัน → เทียบ string จากซ้าย (lexicographic)
// digit shift:  42 << 3  →  "42" + "000" = "42000"
//               1337 >> 2 →  ตัด 2 หลักท้าย = "13"
bigint operator<<(unsigned n) const {           // เลื่อนหลักซ้าย = คูณ 10^n
    return bigint(digits + std::string(n, '0'));
}
// << สำหรับพิมพ์: ตัด leading zero ก่อนพิมพ์`, cap: "เก็บเป็น string → ทำเลขใหญ่ไม่จำกัด; ระวังแยก operator<< (digit shift) กับ operator<< (พิมพ์ ostream)", lang: "cpp" },

      { h: "🔬 polyset — inheritance + abstract + OCF (ยากสุดของ rank)" },
      { p: "ให้ abstract: `bag`, `searchable_bag`, และ implement `array_bag`/`tree_bag` มาแล้ว. เราเขียน `searchable_array_bag`/`searchable_tree_bag` (สืบทอด + implement search) และ `set` (ห่อ searchable_bag กันสมาชิกซ้ำ)" },
      { code: String.raw`// สืบทอด 2 ทาง: เอา implementation จาก array_bag + interface search
class searchable_array_bag : public array_bag, public searchable_bag {
public:
    searchable_array_bag();
    searchable_array_bag(const searchable_array_bag &o);     // OCF ครบ!
    searchable_array_bag &operator=(const searchable_array_bag &o);
    ~searchable_array_bag();
    bool has(int e) const {                                  // virtual จาก searchable_bag
        for (size_t i = 0; i < size(); ++i)
            if ((*this)[i] == e) return true;
        return false;
    }
};
// set: ก่อน insert เช็ค has() ก่อน → ไม่ใส่ซ้ำ`, cap: "OCF ครบทุก class + const ทุก method ที่อ่านอย่างเดียว; set ใช้ has() กันซ้ำ", lang: "cpp" },

      { h: "🔬 bsq — สี่เหลี่ยมจัตุรัสใหญ่สุด (DP)" },
      { p: "อ่าน map (บรรทัดแรกบอก: จำนวนแถว, อักษร empty/obstacle/full). DP: ขนาดสี่เหลี่ยมที่มุมล่างขวา (i,j) = min(บน, ซ้าย, บนซ้าย) + 1 ถ้าช่องว่าง; ติดตาม max + ตำแหน่งบนสุด-ซ้ายสุด" },
      { code: String.raw`for i in rows:
  for j in cols:
    if (map[i][j] == obstacle) dp[i][j] = 0;
    else if (i==0 || j==0)     dp[i][j] = 1;
    else dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1;
    if (dp[i][j] > best) { best = dp[i][j]; bi = i; bj = j; }  // มุมล่างขวา
// วาด 'full' ในกรอบ best×best ที่มุมล่างขวา = (bi,bj)`, cap: "เลือก max ตัวแรกที่เจอ (สแกน บน→ล่าง, ซ้าย→ขวา) → ได้สี่เหลี่ยมบนสุด-ซ้ายสุดอัตโนมัติ", lang: "txt" },

      { h: "🔬 life — Game of Life + parsing ปากกา" },
      { p: "2 เฟส: (1) แปลงคำสั่ง wasd (เลื่อน) + x (ยก/วางปากกา) เป็น grid เริ่มต้น (2) รัน Conway n รอบ แล้วพิมพ์ 'O'/space" },
      { code: String.raw`// เฟส 1: ปากกาเดินตามคำสั่ง, ถ้า "วาง" → mark cell เป็น alive
//   w/a/s/d = เลื่อน x,y ; x = toggle pen (วาง/ยก)
// เฟส 2: Conway rule ต่อ cell:
//   นับเพื่อนบ้านที่ alive (8 ทิศ; นอก grid = dead)
//   alive: รอด ถ้าเพื่อน 2 หรือ 3 ; dead: เกิด ถ้าเพื่อน 3 พอดี
//   (ต้องคำนวณ grid ใหม่จากของเก่าทั้งใบ ห้ามแก้ในที่)`, cap: "สำคัญ: คำนวณรอบใหม่จาก snapshot เก่าทั้งใบ (double buffer) ไม่งั้น cell ที่เพิ่งเปลี่ยนจะรบกวนเพื่อนบ้าน", lang: "txt" },
    ],
    implementation: [
      { h: "กลยุทธ์ Rank 05" },
      { ul: [
        "ถนัด C++ → level 1: **vect2** ก่อน (operator ตรงไปตรงมา), เลี่ยง polyset ถ้าเวลาน้อย",
        "ถนัด algorithm → level 2: **bsq** (DP คลาสสิก) หรือ life",
        "ทบ OCF ให้ขึ้นใจ (4 ฟังก์ชัน) + รู้ member vs free function ของ operator",
        "อ่าน main ที่ให้มาก่อน — class ต้อง 'ทำให้ main นั้นทำงาน' พอดี",
      ]},
      { h: "ฝึกก่อนสอบ" },
      { ul: [
        "เขียน vect2 ครบ operator จากศูนย์ (+, -, *, [], <<, ++, --)",
        "ทบ OCF + เมื่อไรใช้ member vs free function (<<, scalar*obj)",
        "เขียน bsq (DP) + life (Conway double-buffer) ให้คล่อง",
      ]},
    ],
    tricks: [
      { h: "กับดัก 1: ลืม OCF / ลืม const" },
      { p: "polyset เน้น OCF ครบ + const ทุก method ที่อ่านอย่างเดียว (เช่น has() const). ลืม = ตก. subject บอกชัด 'Don't forget the const'" },
      { h: "กับดัก 2: << เขียนเป็น member" },
      { p: "`operator<<` สำหรับพิมพ์ต้องเป็น free function (ตัวซ้ายคือ ostream ไม่ใช่ object เรา); เขียนเป็น member จะใช้ `cout << v` ไม่ได้" },
      { h: "กับดัก 3: post-increment คืนผิด" },
      { p: "`v++` (post) ต้องคืน 'ค่าเก่า' (copy) และรับ `int` หลอกเพื่อแยกจาก pre `++v` ที่คืน reference. สลับ = ผลของ `v++` ผิด" },
      { h: "กับดัก 4: operator[] ไม่มี const overload" },
      { p: "ต้องมี 2 เวอร์ชัน: non-const (คืน reference แก้ได้) + const (คืน value). ขาด const version → ใช้กับ const object/ใน << ไม่ได้" },
      { h: "กับดัก 5: bsq เลือกสี่เหลี่ยมผิดตำแหน่ง" },
      { p: "มีหลายคำตอบ → ต้องเลือก 'บนสุด ก่อน ซ้ายสุด'. สแกน บน→ล่าง ซ้าย→ขวา แล้วเก็บ max 'ตัวแรก' (ใช้ > ไม่ใช่ >=) → ได้ตำแหน่งถูก" },
      { h: "กับดัก 6: life แก้ grid ในที่" },
      { p: "Conway ต้องคำนวณรอบใหม่จาก snapshot เก่าทั้งใบ (double buffer) — ถ้าแก้ทับ grid เดิมระหว่างคำนวณ cell ที่เปลี่ยนแล้วจะทำให้เพื่อนบ้านคิดผิด" },
    ],
    eval: [
      { qa: [
        { q: "Orthodox Canonical Form มีอะไรบ้าง?", a: "4 ฟังก์ชัน: default constructor, copy constructor, copy assignment operator (operator=), destructor. ทุก class ใน Rank 05 ต้องครบ (โดยเฉพาะ polyset)" },
        { q: "operator<< (พิมพ์) ทำไมต้องเป็น free function?", a: "เพราะตัวดำเนินการซ้ายคือ std::ostream (cout) ไม่ใช่ object เรา — member function จะมี object เราเป็นตัวซ้าย ใช้ `cout << v` ไม่ได้" },
        { q: "pre vs post increment เขียนต่างกันยังไง?", a: "pre `++v`: `T &operator++()` คืน reference หลังเพิ่ม. post `v++`: `T operator++(int)` รับ int หลอก, เก็บค่าเก่าไว้, เพิ่ม, คืนค่าเก่า (copy)" },
        { q: "ทำไม operator[] ต้องมี const overload?", a: "version non-const คืน reference (แก้ได้); version const คืน value (อ่านอย่างเดียว) เพื่อให้เรียกกับ const object ได้ เช่นใน operator<< ที่รับ const vect2&" },
        { q: "bigint เก็บเลขยังไงให้ใหญ่เกิน SIZE_MAX?", a: "เก็บเป็น string/array ของหลัก (base 10); บวกแบบไล่หลักมีตัวทด; เทียบด้วยความยาวก่อนแล้วเทียบ string; digit shift = เติม/ตัด '0' ท้าย" },
        { q: "polyset ใช้ inheritance ยังไง?", a: "searchable_array_bag สืบทอดจาก array_bag (เอา implementation) + searchable_bag (เอา interface search) แล้ว implement has(); set ห่อ searchable_bag เช็ค has() ก่อน insert กันซ้ำ" },
        { q: "bsq ใช้ DP ยังไง?", a: "dp[i][j] (ขนาดสี่เหลี่ยมที่มุมล่างขวา i,j) = ถ้าว่าง: min(บน, ซ้าย, บนซ้าย)+1, ถ้าสิ่งกีดขวาง: 0; ติดตาม max ตัวแรกที่เจอ (สแกนบน-ซ้าย) → บนสุด-ซ้ายสุด" },
        { q: "Game of Life ทำไมต้อง double buffer?", a: "ทุก cell ต้องคำนวณจากสถานะ 'รอบก่อน' พร้อมกัน — ถ้าแก้ grid ในที่ระหว่างคำนวณ cell ที่เปลี่ยนแล้วจะทำให้เพื่อนบ้านนับผิด ต้องเขียนลง buffer ใหม่" },
        { q: "Conway rule คืออะไร?", a: "alive รอดถ้ามีเพื่อนบ้าน alive 2 หรือ 3 ตัว; dead เกิดถ้ามีเพื่อนบ้าน alive 3 ตัวพอดี; นอกกระดานนับเป็น dead" },
      ]},
      { h: "ซ้อมจริง", },
      { code: String.raw`bash exam.sh   # เลือก Rank 05
# level 1: vect2 (operators) → bigint → polyset (OCF+inheritance)
# level 2: bsq (DP) → life (Conway + double buffer)`, lang: "bash" },
    ],
  },
});

/* ===================== EXAM RANK 06 ===================== */
window.TEACHING_DATA.push({
  id: "exam_rank06",
  name: "Exam Rank 06",
  tag: { th: "ด่านสุดท้าย — network programming ด้วย select(): เซิร์ฟเวอร์ non-blocking หลาย client. mini_serv (แชทรวม, C) และ mini_db (key-value store, C++)",
         en: "The final boss — network programming with select(): non-blocking multi-client servers. mini_serv (group chat, C) and mini_db (key-value store, C++)" },
  accent: "#fb7185",
  sections: {
    principle: [
      { h: "Exam Rank 06 — เซิร์ฟเวอร์ select()" },
      { p: "rank สุดท้ายของ Common Core (สาย C/C++). มี 2 โปรแกรมใหญ่ ทั้งคู่เป็น **TCP server non-blocking** ที่จัดการหลาย client พร้อมกันด้วย `select()` บน 127.0.0.1. เวลาสอบนานกว่าปกติ" },
      { table: { head: ["โปรแกรม", "ภาษา", "ทำอะไร"], rows: [
        ["`mini_serv`", "C", "แชทรวม: client ส่งข้อความ → broadcast ให้ทุกคน"],
        ["`mini_db`", "C++", "key-value store: POST/GET/DELETE ผ่าน TCP"],
      ]}},
      { note: "หัวใจเดียวที่ครอบทั้ง 2 ข้อ: **select() event loop** — เฝ้า fd หลายตัวพร้อมกัน, ไม่บล็อก, จัดการ accept/recv/ส่ง โดยไม่มี thread. เข้าใจ pattern นี้ = ทำได้ทั้งคู่" },
      { h: "กฎเหล็กที่ทำให้ตก" },
      { ul: [
        "**ห้ามบล็อก** — ใช้ select ก่อนทุก recv/send; **ห้ามเช็ค EAGAIN** (subject สั่งห้าม)",
        "**ห้าม leak** fd / memory (ตรวจจริง)",
        "error → `\"Fatal error\\n\"` ที่ stderr exit 1; argument ผิด → `\"Wrong number of arguments\\n\"`",
        "ส่งข้อความ 'ให้เร็วที่สุด' อย่า buffer เกินจำเป็น (tester จับเวลา)",
      ]},
    ],
    theory: [
      { p: "2 โปรแกรมของ Rank 06 — สเปคย่อ" },
      { h: "mini_serv (C) — แชทรวม" },
      { ul: [
        "รับ argument = port; bind 127.0.0.1 เท่านั้น",
        "client ใหม่ → id = id ล่าสุด + 1 (เริ่ม 0); broadcast `\"server: client %d just arrived\\n\"`",
        "รับข้อความ → ส่งต่อทุก client อื่น นำหน้า **ทุกบรรทัด** ด้วย `\"client %d: \"`",
        "client ออก → broadcast `\"server: client %d just left\\n\"`",
        "ข้อความอาจมีหลาย `\\n`; client อาจ 'ขี้เกียจอ่าน' → ห้ามตัดการเชื่อมต่อ",
        "ห้ามใช้ `#define`",
      ]},
      { h: "mini_db (C++) — key-value store" },
      { ul: [
        "argument = port + path; พร้อมรับ connection → พิมพ์ `\"ready\\n\"` ที่ stdout",
        "connection แบบ persistent (1 session ส่งได้หลายคำสั่ง)",
        "`POST <key> <value>` → เพิ่ม entry, ตอบ `\"0\"`",
        "`GET <key>` → `\"0 <value>\"` หรือ `\"1\"` ถ้าไม่มี key",
        "`DELETE <key>` → ลบ entry",
      ]},
    ],
    foundations: [
      { p: "เสาหลักเดียว: select() event loop — ใช้ทั้ง mini_serv และ mini_db" },
      { h: "1) โครง select() loop" },
      { code: String.raw`fd_set readfds;
int maxfd = listen_fd;
// (เก็บ client fd ทั้งหมดไว้ใน array/set ของเรา)
while (1) {
    FD_ZERO(&readfds);
    FD_SET(listen_fd, &readfds);
    for each client c: FD_SET(c.fd, &readfds);     // เฝ้าทุก client
    select(maxfd + 1, &readfds, NULL, NULL, NULL); // บล็อกจนมี fd พร้อม
    if (FD_ISSET(listen_fd, &readfds))
        accept_new_client();                        // มีคนต่อใหม่
    for each client c:
        if (FD_ISSET(c.fd, &readfds))
            handle_recv(c);                          // มีข้อมูลเข้า/หรือ disconnect
}`, cap: "select บอกว่า fd ไหน 'พร้อมอ่าน' → จัดการเฉพาะตัวนั้น, ตัวอื่นไม่บล็อก = 1 thread เสิร์ฟทุกคน", lang: "c" },
      { h: "2) accept + แจกเลข id" },
      { code: String.raw`int cfd = accept(listen_fd, ...);
clients[cfd].id = next_id++;          // id ล่าสุด+1 (เริ่ม 0)
if (cfd > maxfd) maxfd = cfd;
// broadcast "server: client %d just arrived\n" ให้คนอื่น`, cap: "ต้องอัปเดต maxfd ทุกครั้งที่ได้ fd ใหม่ (select ต้องรู้ขอบบน)", lang: "c" },
      { h: "3) recv + buffer จนครบบรรทัด" },
      { code: String.raw`int n = recv(cfd, buf, sizeof(buf), 0);
if (n <= 0) { /* disconnect: broadcast "just left", close, ลบ client */ }
else {
    // ต่อ buf เข้า client[cfd].msg (buffer สะสม)
    // ตัดทีละบรรทัดที่เจอ '\n' → broadcast (ใส่ prefix "client %d: ")
    // ส่วนที่ยังไม่ครบบรรทัด เก็บไว้รอ recv รอบหน้า
}`, cap: "recv คืน 0 = client ปิด; 1 ข้อความอาจมีหลายบรรทัด/ไม่ครบบรรทัด → ต้อง buffer ต่อ fd", lang: "c" },
    ],
    architecture: [
      { h: "examshell — Rank 06" },
      { ul: [
        "ให้ `main.c` (mini_serv) / โครง (mini_db) มาช่วย — แต่ subject เตือนว่า main นั้น **มีฟังก์ชันต้องห้าม/โค้ดที่ต้องเอาออก** ในเวอร์ชันส่งจริง",
        "ทดสอบด้วย `nc` (netcat): เปิดหลาย terminal ต่อเข้า server แล้วพิมพ์",
        "เวลาสอบนานกว่าปกติ — โจทย์ใหญ่ ใจเย็น ๆ",
      ]},
      { code: String.raw`# รัน + ทดสอบด้วย nc:
./mini_serv 8080
# อีก terminal:
nc 127.0.0.1 8080        # ต่อเป็น client, พิมพ์ข้อความ → คนอื่นเห็น

# mini_db:
./mini_db 8080 ./data
nc 127.0.0.1 8080
POST foo bar             # → 0
GET foo                  # → 0 bar
GET nope                 # → 1`, cap: "nc คือเครื่องมือเทสต์หลัก — เปิดหลายตัวจำลองหลาย client", lang: "bash" },
    ],
    dataflow: [
      { p: "เจาะลึก 2 โปรแกรม Rank 06 — ทั้งคู่หมุนรอบ select() loop" },

      { h: "🔬 mini_serv — แชทรวมหลาย client" },
      { p: "select loop เฝ้า listen_fd + ทุก client. 3 เหตุการณ์: ต่อใหม่ (accept+arrived), ข้อความเข้า (buffer+broadcast), ตัดการเชื่อมต่อ (left+close)" },
      { code: String.raw`while (1) {
    readfds = active;                          // copy set (select แก้ set)
    select(maxfd + 1, &readfds, NULL, NULL, NULL);
    for (fd = 0; fd <= maxfd; fd++) {
        if (!FD_ISSET(fd, &readfds)) continue;
        if (fd == listen_fd) {                 // (1) client ใหม่
            cfd = accept(...);
            ids[cfd] = next_id++;
            FD_SET(cfd, &active); maxfd = max(maxfd, cfd);
            broadcast(cfd, "server: client %d just arrived\n", ids[cfd]);
        } else {                               // (2)/(3) ข้อมูล/ตัดสาย
            n = recv(fd, buf, BUF, 0);
            if (n <= 0) {                      // ตัดสาย
                broadcast(fd, "server: client %d just left\n", ids[fd]);
                FD_CLR(fd, &active); close(fd); free(stash[fd]);
            } else
                buffer_and_broadcast(fd, buf, n); // เก็บจนครบบรรทัด → ส่ง
        }
    }
}`, cap: "broadcast = วนส่งทุก fd ที่เป็น client ยกเว้นตัวส่งเอง; ใส่ \"client %d: \" นำหน้าทุกบรรทัด", lang: "c" },
      { note: "จุดตาย mini_serv: (1) ไม่ใส่ prefix ทุกบรรทัด (ข้อความหลาย \\n), (2) ไม่ buffer ต่อ client (ข้อความไม่ครบบรรทัด), (3) ลืม free stash ตอน disconnect = leak, (4) ไม่อัปเดต maxfd" },

      { h: "🔬 buffer ต่อ client + ตัดบรรทัด" },
      { code: String.raw`// แต่ละ client มี stash (string สะสม)
stash[fd] = strjoin(stash[fd], buf);           // ต่อข้อมูลใหม่
while ((nl = strchr(stash[fd], '\n'))) {        // มีบรรทัดครบ
    *nl = '\0';
    send_to_others(fd, "client %d: %s\n", ids[fd], stash[fd]);
    memmove(stash[fd], nl + 1, len(nl + 1) + 1); // เลื่อนที่เหลือมาต้น
}`, cap: "สะสมจน '\\n' → ส่ง 1 บรรทัด (มี prefix) → เก็บส่วนเกินไว้; รองรับข้อความที่มาไม่ครบ/หลายบรรทัด", lang: "c" },

      { h: "🔬 mini_db — key-value store ผ่าน TCP" },
      { p: "select loop เหมือน mini_serv แต่แทน broadcast เป็น 'parse command → ตอบกลับเฉพาะผู้ส่ง'. เก็บ db เป็น map (C++)" },
      { code: String.raw`std::map<std::string, std::string> db;
// พร้อมรับ → printf("ready\n"); fflush
// ต่อ recv ของแต่ละ client จนครบบรรทัด แล้ว parse:
//   POST <key> <value>  → db[key] = value;       reply "0"
//   GET  <key>          → db.count(key) ? "0 "+db[key] : "1"
//   DELETE <key>        → db.erase(key);
// persistent: 1 client ส่งได้หลายคำสั่งใน session เดียว`, cap: "db = std::map; parse คำสั่งจากบรรทัด → ตอบเฉพาะ client ที่ส่ง (ไม่ broadcast)", lang: "cpp" },
    ],
    implementation: [
      { h: "กลยุทธ์ Rank 06" },
      { ul: [
        "เริ่มจาก **select loop ให้รันได้** ก่อน (accept + echo) แล้วค่อยเติม logic",
        "mini_serv: ทำ accept/arrived/left ให้ครบก่อน แล้วค่อยทำ buffer+broadcast บรรทัด",
        "mini_db: select loop เดียวกัน + std::map + parse 3 คำสั่ง",
        "เทสต์ด้วย nc หลายตัวบ่อย ๆ ระหว่างเขียน",
      ]},
      { h: "ฝึกก่อนสอบ" },
      { ul: [
        "เขียน TCP echo server ด้วย select จากศูนย์ (socket/bind/listen/accept/select/recv)",
        "เพิ่ม multi-client + broadcast (= mini_serv ย่อ)",
        "ทบ buffer ต่อ fd + ตัดบรรทัดด้วย strchr/memmove",
        "ทบ fd_set: FD_ZERO/SET/CLR/ISSET + maxfd",
      ]},
    ],
    tricks: [
      { h: "กับดัก 1: บล็อกเพราะไม่ใช้ select / เช็ค EAGAIN" },
      { p: "ต้อง select ก่อนทุก recv/send และ **ห้ามเช็ค EAGAIN** (subject สั่งห้าม). recv/send จะไม่บล็อกถ้า select บอกว่าพร้อมแล้ว" },
      { h: "กับดัก 2: ลืม copy fd_set ก่อน select" },
      { p: "select **แก้ fd_set ในที่** (เหลือเฉพาะตัวที่พร้อม) — ต้อง copy set หลัก (`readfds = active`) ก่อนทุกรอบ ไม่งั้น set จะค่อย ๆ หาย" },
      { h: "กับดัก 3: ข้อความหลายบรรทัด — ลืม prefix ทุกบรรทัด" },
      { p: "mini_serv: 1 ข้อความอาจมีหลาย `\\n` → ต้องใส่ `\"client %d: \"` นำหน้า **ทุก** บรรทัด ไม่ใช่แค่บรรทัดแรก" },
      { h: "กับดัก 4: ข้อความมาไม่ครบบรรทัด" },
      { p: "recv อาจได้แค่ครึ่งบรรทัด → ต้อง buffer ต่อ client จนเจอ `\\n` ค่อยส่ง; ส่วนเกินเก็บไว้รอบหน้า. ส่งทันทีทุก recv = บรรทัดแตก" },
      { h: "กับดัก 5: leak fd / memory ตอน disconnect" },
      { p: "client ออก → ต้อง close(fd) + FD_CLR + free buffer ของมัน; ลืม = leak (ตรวจจริง). อัปเดต maxfd ด้วยถ้าจำเป็น" },
      { h: "กับดัก 6: error/argument message ไม่ตรง" },
      { p: "argument ผิด → `\"Wrong number of arguments\\n\"`; syscall fail ก่อนเริ่ม → `\"Fatal error\\n\"` ที่ **stderr** exit 1. ข้อความ/ปลายทางผิด = ตก" },
    ],
    eval: [
      { qa: [
        { q: "select() ทำงานยังไง ทำไมไม่บล็อก?", a: "select เฝ้า fd หลายตัวพร้อมกัน คืนมาเมื่อมีอย่างน้อยตัวหนึ่ง 'พร้อม' (อ่าน/เขียนได้) → เราจัดการเฉพาะตัวที่พร้อม ตัวอื่นไม่ค้าง = 1 thread เสิร์ฟทุก client" },
        { q: "ทำไมต้อง copy fd_set ก่อน select ทุกรอบ?", a: "select แก้ set ในที่ (เหลือเฉพาะ fd ที่พร้อม) — ถ้าไม่ copy set หลักไว้ รอบถัดไป fd ที่ไม่พร้อมจะหายจาก set ทำให้หยุดเฝ้า" },
        { q: "mini_serv broadcast ข้อความหลายบรรทัดยังไง?", a: "ใส่ \"client %d: \" นำหน้า 'ทุก' บรรทัด (แยกที่ \\n) ไม่ใช่แค่บรรทัดแรก; ส่งให้ทุก client ยกเว้นผู้ส่ง" },
        { q: "ทำไมต้อง buffer ต่อ client?", a: "recv อาจได้ข้อความไม่ครบบรรทัด หรือหลายบรรทัดรวด — ต้องสะสมใน buffer ต่อ fd จนเจอ \\n ค่อยส่ง 1 บรรทัด; ส่วนเกินเก็บรอ recv รอบหน้า" },
        { q: "client id แจกยังไง?", a: "id ล่าสุด + 1 เริ่มจาก 0 (client แรก = 0); เก็บ id ต่อ fd ไว้ใช้ตอน broadcast arrived/left/ข้อความ" },
        { q: "ทำไมห้ามเช็ค EAGAIN?", a: "subject สั่งห้าม — เพราะถ้าใช้ select ถูกต้อง (เฝ้าก่อน recv/send) fd จะพร้อมเสมอตอนเรียก จึงไม่ควรเจอ EAGAIN; การเช็คมันบ่งว่าออกแบบ flow ผิด" },
        { q: "recv คืน 0 หมายความว่าอะไร?", a: "client ปิดการเชื่อมต่อ (EOF) → ต้อง broadcast \"just left\", close(fd), FD_CLR, free buffer ของ client นั้น" },
        { q: "mini_db ต่างจาก mini_serv ตรงไหน?", a: "โครง select เหมือนกัน แต่แทน broadcast เป็น parse คำสั่ง (POST/GET/DELETE) → ตอบเฉพาะผู้ส่ง; เก็บ db เป็น std::map; พิมพ์ \"ready\\n\" ตอนพร้อม" },
        { q: "error message ของ mini_serv 2 แบบคืออะไร?", a: "argument ผิด → \"Wrong number of arguments\\n\"; syscall fail ก่อนรับ connection → \"Fatal error\\n\" ทั้งคู่ที่ stderr exit 1" },
      ]},
      { h: "ซ้อมจริง", },
      { code: String.raw`bash exam.sh   # เลือก Rank 06
# 1) เขียน echo server ด้วย select ให้รันได้ก่อน
# 2) เติม multi-client + broadcast = mini_serv
# เทสต์: ./mini_serv 8080  แล้วเปิด nc 127.0.0.1 8080 หลายตัว`, lang: "bash" },
    ],
  },
});
