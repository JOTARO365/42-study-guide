/* ============================================================
   data.flows.libft.js — flow visualizer หนึ่งอันต่อหนึ่งฟังก์ชันของ libft
   รูปแบบ { multi: [ { label, group, input, steps } ] } → app.js แสดงแถบเลือก
   ============================================================ */
window.EXTRA_FLOWS = window.EXTRA_FLOWS || {};

(function () {
  var G1 = { th: "ส่วนที่ 1 · ฟังก์ชันจาก libc", en: "Part 1 · libc functions" };
  var G2 = { th: "ส่วนที่ 2 · ฟังก์ชันเพิ่มเติม", en: "Part 2 · additional functions" };
  var G3 = { th: "โบนัส · linked list", en: "Bonus · linked list" };

  function v(n, val, d, w) { return { n: n, v: val, d: d, w: !!w }; }
  function st(fn, file, depth, note, data, vars) {
    return { fn: fn, file: file, depth: depth, note: note, data: data, vars: vars || [] };
  }
  function f(label, group, input, steps) {
    return { label: label, group: group, input: input, steps: steps };
  }

  window.EXTRA_FLOWS.libft = { multi: [

    /* ── ส่วนที่ 1: ตรวจชนิดตัวอักษร ─────────────────────────── */
    f("ft_isalpha", G1, "ft_isalpha('B')  ·  ft_isalpha('7')", [
      st("ft_isalpha(c)", "ft_isalpha.c", 0,
        { th: "รับ **`int` ไม่ใช่ `char`** เพราะต้องรับค่า `EOF` (-1) ได้ด้วย — นี่คือเหตุผลที่ libc ทั้งตระกูล `is*` ใช้ `int`",
          en: "Takes an **`int`, not a `char`**, because it must also accept `EOF` (-1) — which is why the whole `is*` family in libc takes an int." },
        "c = 'B' = 66", [v("c", "66", { th: "ตัวอักษรมาถึงในรูปเลข ASCII", en: "the character arrives as its ASCII number" })]),
      st("เช็คสองช่วง", "ft_isalpha.c", 1,
        { th: "`(c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z')` — เทียบกับตัวอักษรตรง ๆ อ่านง่ายกว่าเขียนเลข 65/90",
          en: "`(c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z')` — comparing against characters reads better than writing 65 and 90." },
        "66 อยู่ใน 65..90  ->  จริง", []),
      st("คืนค่าไม่ใช่ 1 เสมอ", "ft_isalpha.c", 1,
        { th: "มาตรฐานบอกแค่ว่า **คืนค่าที่ไม่ใช่ศูนย์** เมื่อจริง — ผู้เรียกจึงต้องเทียบเป็น truthy ไม่ใช่ `== 1`",
          en: "The standard only promises **a non-zero value** when true, so callers must treat it as truthy rather than compare with `== 1`." },
        "return 1;   (ft_isalpha('7') -> 0)", [v("return", "1", { th: "ไม่ใช่ศูนย์ = ใช่", en: "non-zero means yes" }, true)])
    ]),

    f("ft_isdigit", G1, "ft_isdigit('7')", [
      st("ft_isdigit(c)", "ft_isdigit.c", 0,
        { th: "ช่วงเดียว `'0'` ถึง `'9'` — และ **`'0'` ไม่ใช่ 0** มันคือ 48 ซึ่งเป็นที่มาของสูตร `c - '0'` ตอนแปลงเป็นตัวเลข",
          en: "One range, `'0'` to `'9'` — and **`'0'` is not 0**, it is 48, which is where the `c - '0'` conversion trick comes from." },
        "'7' = 55  ·  55 - 48 = 7", [v("c - '0'", "7", { th: "สูตรที่ ft_atoi ใช้ต่อ", en: "the formula ft_atoi builds on" })])
    ]),

    f("ft_isalnum", G1, "ft_isalnum('z')", [
      st("ft_isalnum(c)", "ft_isalnum.c", 0,
        { th: "ประกอบจากสองตัวที่เขียนไปแล้ว: `ft_isalpha(c) || ft_isdigit(c)` — **อย่าคัดลอกเงื่อนไขมาเขียนซ้ำ** เพราะแก้ที่เดียวจะไม่ครบ",
          en: "Built from the two you already wrote: `ft_isalpha(c) || ft_isdigit(c)` — **do not duplicate the ranges**, or a later fix reaches only one copy." },
        "'z' -> isalpha จริง -> คืนไม่ใช่ศูนย์", [])
    ]),

    f("ft_isascii", G1, "ft_isascii(200)", [
      st("ft_isascii(c)", "ft_isascii.c", 0,
        { th: "ASCII คือ **7 บิต** จึงมีค่าตั้งแต่ 0 ถึง 127 เท่านั้น — 128 ขึ้นไปเป็นของ encoding อื่น",
          en: "ASCII is **seven bits**, so it spans 0 to 127 only; anything from 128 up belongs to some other encoding." },
        "200 > 127  ->  0", [v("return", "0", { th: "นอกช่วง ASCII", en: "outside ASCII" }, true)])
    ]),

    f("ft_isprint", G1, "ft_isprint(' ')  ·  ft_isprint('\\n')", [
      st("ft_isprint(c)", "ft_isprint.c", 0,
        { th: "พิมพ์ออกหน้าจอแล้วเห็น = ตั้งแต่ **space (32)** ถึง **`~` (126)** — `'\\n'` (10) เป็นอักขระควบคุม จึงไม่นับ",
          en: "Printable means visible on screen: from **space (32)** through **`~` (126)**. `'\\n'` (10) is a control character, so it does not count." },
        "' ' = 32 -> 1   ·   '\\n' = 10 -> 0", [v("ช่วง", "32..126", { th: "space นับด้วย แม้จะมองไม่เห็นก็ตาม", en: "space counts, even though you cannot see it" })])
    ]),

    f("ft_toupper", G1, "ft_toupper('a')", [
      st("ft_toupper(c)", "ft_toupper.c", 0,
        { th: "ตัวพิมพ์เล็กกับใหญ่ห่างกัน **32 พอดี** ใน ASCII (`'a'`=97, `'A'`=65) จึงลบ 32 ได้ตรง ๆ — แต่ต้องเช็คก่อนว่าเป็นตัวพิมพ์เล็กจริง",
          en: "Lower and upper case are exactly **32 apart** in ASCII (`'a'`=97, `'A'`=65), so subtracting works — but only after checking it really is lower case." },
        "97 - 32 = 65 = 'A'", [v("c", "65", { th: "แก้ค่าแล้วคืนออกไป", en: "converted, then returned" }, true)]),
      st("ตัวที่ไม่ใช่ตัวอักษรต้องผ่านไปเฉย ๆ", "ft_toupper.c", 1,
        { th: "`ft_toupper('5')` ต้องคืน `'5'` **ไม่ใช่ค่าที่ลบ 32 แล้ว** — ลืมเช็คแล้วตัวเลขกับสัญลักษณ์จะเพี้ยนหมด",
          en: "`ft_toupper('5')` must return `'5'`, **not the value minus 32** — forget the guard and every digit and symbol is corrupted." },
        "'5' ไม่อยู่ใน a..z  ->  คืนเดิม", [])
    ]),

    f("ft_tolower", G1, "ft_tolower('Q')", [
      st("ft_tolower(c)", "ft_tolower.c", 0,
        { th: "กระจกของ `ft_toupper` — บวก 32 เมื่ออยู่ในช่วง `'A'`..`'Z'` เท่านั้น",
          en: "The mirror of `ft_toupper`: add 32, but only inside `'A'`..`'Z'`." },
        "'Q' = 81  ->  81 + 32 = 113 = 'q'", [])
    ]),

    /* ── ส่วนที่ 1: สตริงและหน่วยความจำ ──────────────────────── */
    f("ft_strlen", G1, "ft_strlen(\"42 Bangkok\")", [
      st("ft_strlen(s)", "ft_strlen.c", 0,
        { th: "เดินไปข้างหน้าจนเจอ `'\\0'` แล้วคืนจำนวนตัวอักษร **ไม่นับตัวปิด** — ความยาว 10 แปลว่ากินหน่วยความจำ 11 ไบต์",
          en: "Walk forward to the `'\\0'` and return the count **excluding the terminator** — length 10 means eleven bytes of storage." },
        "\"42 Bangkok\" -> 10", [v("i", "0", { th: "ตัวนับที่เดินไปพร้อมตัวชี้", en: "the counter that walks with the pointer" }, true)]),
      st("while (s[i]) i++;", "ft_strlen.c", 1,
        { th: "เงื่อนไขคือค่าของตัวอักษรเอง — `'\\0'` มีค่าเป็น 0 จึงหยุดลูปได้โดยไม่ต้องเทียบกับอะไร",
          en: "The condition is the character's own value: `'\\0'` is zero, so the loop stops without an explicit comparison." },
        "'4','2',' ','B',... -> ถึง '\\0' ที่ index 10", [v("i", "10", { th: "= ความยาว", en: "= the length" }, true)]),
      st("คืน size_t ไม่ใช่ int", "ft_strlen.c", 1,
        { th: "ความยาวเป็นลบไม่ได้ `size_t` จึงเป็นชนิดที่ถูกต้อง — และเป็นเหตุผลที่ `len - 1` ตอน len เป็น 0 จะวนกลับเป็นเลขมหาศาลแทนที่จะติดลบ",
          en: "A length is never negative, so `size_t` is the right type — and it is why `len - 1` when len is 0 wraps to a huge number instead of going negative." },
        "return (10);", [])
    ]),

    f("ft_memset", G1, "ft_memset(buf, 'A', 5)", [
      st("ft_memset(b, c, len)", "ft_memset.c", 0,
        { th: "เขียนค่าเดียวกันซ้ำลงหน่วยความจำ **ทีละไบต์** — `c` เป็น `int` แต่ถูกใช้แค่ 8 บิตล่าง จึงต้อง cast เป็น `unsigned char`",
          en: "Writes one value repeatedly, **byte by byte**. `c` is an `int` but only its low eight bits are used, so it must be cast to `unsigned char`." },
        "buf = [?,?,?,?,?]  c = 'A'  len = 5", [v("p", "(unsigned char *)b", { th: "cast เพื่อให้เดินทีละไบต์ได้", en: "cast so the walk is byte-sized" }, true)]),
      st("วนเขียนจนครบ len", "ft_memset.c", 1,
        { th: "`void *` บวกทีละไบต์ไม่ได้ตามมาตรฐาน จึงต้องแปลงเป็น `unsigned char *` ก่อนเสมอ",
          en: "You cannot do byte arithmetic on a `void *`, so it becomes an `unsigned char *` first." },
        "buf = ['A','A','A','A','A']", []),
      st("คืน b ตัวเดิม", "ft_memset.c", 1,
        { th: "คืน **ตัวชี้ต้นทางที่รับเข้ามา** ไม่ใช่ตำแหน่งท้าย — ทำให้เขียนซ้อนในบรรทัดเดียวได้ เช่น `ft_strlen(ft_memset(...))`",
          en: "Returns **the original pointer**, not the end, so calls can nest in one expression." },
        "return (b);", [])
    ]),

    f("ft_bzero", G1, "ft_bzero(buf, 5)", [
      st("ft_bzero(s, n)", "ft_bzero.c", 0,
        { th: "คือ `ft_memset(s, 0, n)` เขียนสั้น ๆ — **ใช้ของที่เขียนไปแล้ว อย่าเขียนลูปใหม่** และมันไม่คืนค่าอะไรเลย",
          en: "It is `ft_memset(s, 0, n)` in short form — **reuse what you already wrote**, and note it returns nothing at all." },
        "buf = [0,0,0,0,0]", [v("return", "void", { th: "ต่างจาก memset ที่คืนตัวชี้", en: "unlike memset, which returns the pointer" })])
    ]),

    f("ft_memcpy", G1, "ft_memcpy(dst, src, 6)", [
      st("ft_memcpy(dst, src, n)", "ft_memcpy.c", 0,
        { th: "คัดลอก `n` ไบต์แบบ **ไม่สนใจ `'\\0'`** จึงใช้กับข้อมูลดิบได้ ไม่ใช่แค่สตริง",
          en: "Copies `n` bytes with **no regard for `'\\0'`**, so it works on raw data, not only strings." },
        "src = \"42 sch\"  n = 6", []),
      st("dst == NULL && src == NULL", "ft_memcpy.c", 1,
        { th: "ถ้าทั้งคู่เป็น NULL ต้อง **คืนออกไปเลย ไม่ dereference** — เป็นเคสที่ tester ของ moulinette ยิงตรง ๆ",
          en: "If both are NULL, **return immediately without dereferencing** — moulinette tests this case directly." },
        "if (!dst && !src) return (dst);", []),
      st("วนคัดลอกจากหน้าไปหลัง", "ft_memcpy.c", 1,
        { th: "**ห้ามใช้เมื่อพื้นที่ทับกัน** เพราะการเดินหน้าไปหลังจะเขียนทับต้นทางที่ยังไม่ได้อ่าน — นั่นคืองานของ `ft_memmove`",
          en: "**Never use it on overlapping regions**: copying front to back overwrites source bytes you have not read yet — that is `ft_memmove`'s job." },
        "dst = \"42 sch\"", [v("return", "dst", { th: "คืนต้นทางของปลายทาง", en: "returns the destination's start" }, true)])
    ]),

    f("ft_memmove", G1, "ft_memmove(s + 2, s, 4)  บนพื้นที่ที่ทับกัน", [
      st("ft_memmove(dst, src, len)", "ft_memmove.c", 0,
        { th: "ทำงานเหมือน `memcpy` แต่ **ถูกต้องแม้พื้นที่ทับกัน** — นี่คือเหตุผลเดียวที่มันมีอยู่",
          en: "Behaves like `memcpy` but **stays correct when the regions overlap** — the sole reason it exists." },
        "s = \"ABCDEF\"  ->  ต้องการ \"ABABCD\"", []),
      st("เลือกทิศทางจากตำแหน่ง", "ft_memmove.c", 1,
        { th: "**`dst > src` ให้คัดลอกจากท้ายมาหน้า** มิฉะนั้นคัดลอกจากหน้าไปท้าย — การเลือกทิศคือทั้งหมดของฟังก์ชันนี้",
          en: "**If `dst > src`, copy back to front**; otherwise front to back. Choosing the direction is the whole function." },
        "dst(s+2) > src(s)  ->  เดินถอยหลัง", [v("i", "len - 1", { th: "เริ่มจากไบต์สุดท้าย", en: "start at the last byte" }, true)]),
      st("ทำไมทิศทางถึงสำคัญ", "ft_memmove.c", 2,
        { th: "ถ้าเดินหน้าไปหลังในเคสนี้ `dst[0]` จะทับ `src[2]` ที่ยังไม่ได้อ่าน ผลลัพธ์จะกลายเป็น `\"ABAAAA\"` แทน",
          en: "Copying front to back here would let `dst[0]` overwrite `src[2]` before it is read, producing `\"ABAAAA\"` instead." },
        "ถอยหลัง -> \"ABABCD\"  ✓", [])
    ]),

    f("ft_strlcpy", G1, "ft_strlcpy(dst, \"Bangkok\", 4)", [
      st("ft_strlcpy(dst, src, size)", "ft_strlcpy.c", 0,
        { th: "`size` คือ **ขนาดของบัฟเฟอร์ปลายทางทั้งก้อน รวมที่ว่างสำหรับ `'\\0'`** ไม่ใช่จำนวนตัวอักษรที่จะคัดลอก",
          en: "`size` is **the whole destination buffer, including room for the `'\\0'`**, not the number of characters to copy." },
        "src = \"Bangkok\" (7 ตัว)  size = 4", []),
      st("คัดลอกได้มากสุด size - 1 ตัว", "ft_strlcpy.c", 1,
        { th: "เหลือที่ให้ `'\\0'` หนึ่งช่องเสมอ — และถ้า `size` เป็น 0 ต้อง **ไม่แตะ dst เลย**",
          en: "Always leave one slot for the `'\\0'` — and when `size` is 0, **do not touch dst at all**." },
        "dst = \"Ban\\0\"", []),
      st("ค่าที่คืนคือความยาวของ src", "ft_strlcpy.c", 1,
        { th: "**คืนความยาวที่ *อยากจะ* เขียน ไม่ใช่ที่เขียนได้จริง** — ผู้เรียกเทียบกับ `size` แล้วรู้ทันทีว่าโดนตัดหรือไม่ นี่คือจุดที่ต่างจาก `strncpy`",
          en: "**It returns the length it wanted to write, not what it managed to** — comparing that with `size` tells the caller it was truncated. This is what sets it apart from `strncpy`." },
        "return (7);   7 >= 4  ->  ถูกตัด", [v("return", "7", { th: "ความยาวของ src เสมอ", en: "always the source length" }, true)])
    ]),

    f("ft_strlcat", G1, "ft_strlcat(dst, \"42\", 10)", [
      st("ft_strlcat(dst, src, size)", "ft_strlcat.c", 0,
        { th: "ต่อ `src` ท้าย `dst` โดย `size` คือ **ขนาดบัฟเฟอร์ทั้งก้อน** ไม่ใช่ที่ว่างที่เหลือ",
          en: "Appends `src` to `dst`, where `size` is **the whole buffer**, not the space remaining." },
        "dst = \"Hello\" (5)  src = \"42\"  size = 10", []),
      st("หาความยาวเดิมของ dst ก่อน", "ft_strlcat.c", 1,
        { th: "**ถ้า `size` เล็กกว่าความยาวของ dst แปลว่าบัฟเฟอร์เต็มอยู่แล้ว** ต้องคืน `size + strlen(src)` โดยไม่เขียนอะไรเลย — เคสนี้คือที่คนพลาดกันมากที่สุด",
          en: "**If `size` is smaller than dst's length the buffer is already full**: return `size + strlen(src)` and write nothing. This is the case people miss most." },
        "dlen = 5  ·  5 < 10  ->  เขียนต่อได้", [v("dlen", "5", { th: "ความยาวเดิม", en: "the existing length" })]),
      st("ต่อจนเต็มแล้วปิดด้วย '\\0'", "ft_strlcat.c", 1,
        { th: "ค่าที่คืนคือ **ความยาวที่ควรจะได้ทั้งหมด** คือ `dlen + strlen(src)` เทียบกับ `size` แล้วรู้ว่าล้นไหม",
          en: "The return value is **the length the result should have had**: `dlen + strlen(src)`, which compared with `size` reveals overflow." },
        "dst = \"Hello42\"  ·  return 7", [v("return", "7", { th: "5 + 2 ไม่ใช่ความยาวจริงเสมอไป", en: "5 + 2, not necessarily what was written" }, true)])
    ]),

    f("ft_strchr", G1, "ft_strchr(\"school 42\", 'o')", [
      st("ft_strchr(s, c)", "ft_strchr.c", 0,
        { th: "หา **ตัวแรก** ที่ตรง แล้วคืนตัวชี้ไปยังตำแหน่งนั้น — ไม่เจอคืน `NULL`",
          en: "Finds the **first** match and returns a pointer to it; `NULL` when there is none." },
        "s = \"school 42\"  c = 'o'", []),
      st("cast c เป็น char ก่อนเทียบ", "ft_strchr.c", 1,
        { th: "`c` เป็น `int` แต่ในสตริงเก็บเป็น `char` — ไม่ cast แล้วค่าที่เกิน 127 จะเทียบไม่ตรง",
          en: "`c` arrives as an `int` while the string holds `char`s; without the cast, values above 127 never match." },
        "เจอที่ index 3", [v("return", "s + 3", { th: "ตัวชี้ ไม่ใช่ index", en: "a pointer, not an index" }, true)]),
      st("ค้นหา '\\0' ก็ต้องเจอ", "ft_strchr.c", 1,
        { th: "`ft_strchr(s, 0)` ต้องคืนตัวชี้ไปที่ตัวปิดท้าย **ไม่ใช่ NULL** — เพราะ `'\\0'` ถือเป็นส่วนหนึ่งของสตริง เป็นเคสที่ moulinette ตรวจ",
          en: "`ft_strchr(s, 0)` must return a pointer to the terminator, **not NULL**, because the `'\\0'` counts as part of the string. moulinette checks it." },
        "เงื่อนไขลูปต้องเช็คหลังจากเทียบแล้ว", [])
    ]),

    f("ft_strrchr", G1, "ft_strrchr(\"school 42\", 'o')", [
      st("ft_strrchr(s, c)", "ft_strrchr.c", 0,
        { th: "เหมือน `ft_strchr` แต่เอา **ตัวสุดท้าย** — เขียนง่ายสุดคือเดินจากท้ายมาหน้า หรือเดินหน้าแล้วจำตำแหน่งล่าสุดที่เจอ",
          en: "Like `ft_strchr` but takes the **last** match — simplest either walking backwards, or forwards while remembering the latest hit." },
        "\"school 42\" -> 'o' ตัวสุดท้ายที่ index 4", [v("last", "s + 4", { th: "ทับค่าเดิมทุกครั้งที่เจอใหม่", en: "overwritten on every new hit" }, true)]),
      st("เริ่มจาก '\\0' ถ้าเดินถอยหลัง", "ft_strrchr.c", 1,
        { th: "เดินถอยหลังต้องเริ่มที่ `s + ft_strlen(s)` ไม่ใช่ `len - 1` เพื่อให้เคส `c == '\\0'` ยังคืนตัวปิดท้ายได้ถูก",
          en: "Walking backwards must start at `s + ft_strlen(s)`, not `len - 1`, so the `c == '\\0'` case still returns the terminator." },
        "return (s + 4);", [])
    ]),

    f("ft_strncmp", G1, "ft_strncmp(\"test\", \"team\", 4)", [
      st("ft_strncmp(s1, s2, n)", "ft_strncmp.c", 0,
        { th: "เทียบทีละไบต์ไม่เกิน `n` ตัว — หยุดทันทีที่ต่างกัน หรือเจอ `'\\0'` ตัวใดตัวหนึ่ง",
          en: "Compares byte by byte up to `n`, stopping at the first difference or at either `'\\0'`." },
        "\"test\" กับ \"team\"  n = 4", []),
      st("ต่างที่ index 2", "ft_strncmp.c", 1,
        { th: "**ต้อง cast เป็น `unsigned char` ก่อนลบ** ไม่งั้นตัวอักษรที่เกิน 127 จะให้เครื่องหมายผิด — เป็นกับดักคลาสสิกของฟังก์ชันนี้",
          en: "**Cast to `unsigned char` before subtracting**, or characters above 127 produce the wrong sign — the classic trap here." },
        "'s'(115) - 'a'(97) = 18", [v("return", "18", { th: "บวก = s1 มากกว่า", en: "positive means s1 is greater" }, true)]),
      st("n เป็น 0 คือเท่ากันเสมอ", "ft_strncmp.c", 1,
        { th: "ไม่ได้เทียบอะไรเลยจึงต้องคืน 0 — และค่าที่คืนคือ **ผลต่าง ไม่ใช่แค่ -1/0/1**",
          en: "Nothing was compared, so it must return 0 — and the value is **the difference itself**, not merely -1/0/1." },
        "ft_strncmp(a, b, 0) -> 0", [])
    ]),

    f("ft_memchr", G1, "ft_memchr(buf, 'B', 8)", [
      st("ft_memchr(s, c, n)", "ft_memchr.c", 0,
        { th: "เหมือน `strchr` แต่ค้นในหน่วยความจำดิบ — **ไม่หยุดที่ `'\\0'`** หยุดเมื่อครบ `n` ไบต์เท่านั้น",
          en: "Like `strchr` but over raw memory: **it does not stop at `'\\0'`**, only when `n` bytes are exhausted." },
        "buf อาจมี 0 อยู่ข้างในได้", [v("p", "(unsigned char *)s", { th: "cast ก่อนเดิน", en: "cast before walking" }, true)]),
      st("เจอแล้วคืนตัวชี้ ไม่เจอคืน NULL", "ft_memchr.c", 1,
        { th: "เทียบแบบ `unsigned char` ทั้งสองฝั่ง เพราะข้อมูลดิบมีค่าเกิน 127 ได้เป็นปกติ",
          en: "Compare as `unsigned char` on both sides, because raw data routinely holds values above 127." },
        "return (p + i);", [])
    ]),

    f("ft_memcmp", G1, "ft_memcmp(a, b, 4)", [
      st("ft_memcmp(s1, s2, n)", "ft_memcmp.c", 0,
        { th: "เทียบหน่วยความจำดิบ `n` ไบต์ — ต่างจาก `strncmp` ตรงที่ **`'\\0'` ไม่หยุดการเทียบ**",
          en: "Compares `n` raw bytes; unlike `strncmp`, **a `'\\0'` does not stop it**." },
        "a = \"ab\\0d\"  b = \"ab\\0e\"  n = 4", []),
      st("ต่างที่ไบต์สุดท้าย", "ft_memcmp.c", 1,
        { th: "`strncmp` จะบอกว่าเท่ากันเพราะหยุดที่ `'\\0'` แต่ `memcmp` เดินต่อจนครบ 4 ไบต์แล้วเจอความต่าง — เข้าใจข้อนี้แล้วจะเลือกใช้ถูกตัว",
          en: "`strncmp` would call these equal because it stops at the `'\\0'`; `memcmp` walks all four bytes and finds the difference. Knowing this is how you pick the right one." },
        "'d'(100) - 'e'(101) = -1", [v("return", "-1", { th: "ลบ = s1 น้อยกว่า", en: "negative means s1 is smaller" }, true)])
    ]),

    f("ft_strnstr", G1, "ft_strnstr(\"42 Bangkok\", \"Bang\", 10)", [
      st("ft_strnstr(big, little, len)", "ft_strnstr.c", 0,
        { th: "หาสตริงย่อยใน `big` โดยดูไม่เกิน `len` ไบต์แรก — คืนตัวชี้ไปตำแหน่งที่เจอ",
          en: "Finds a substring inside `big`, looking at no more than the first `len` bytes, and returns a pointer to it." },
        "big = \"42 Bangkok\"  little = \"Bang\"", []),
      st("little ว่างคืน big ทันที", "ft_strnstr.c", 1,
        { th: "ตามนิยาม สตริงว่างพบได้ที่ตำแหน่งแรกเสมอ — **ต้องเช็คก่อนลูป** ไม่งั้นได้ NULL ผิด",
          en: "By definition an empty needle is found at position zero — **check it before the loop** or you wrongly return NULL." },
        "if (!*little) return ((char *)big);", []),
      st("ลูปซ้อนพร้อมกันขอบเขต", "ft_strnstr.c", 1,
        { th: "ที่ทุกตำแหน่ง `i` ต้องมั่นใจว่า **`i + j` ยังไม่เกิน `len`** — ลืมเช็คแล้วจะอ่านทะลุขอบที่ผู้เรียกอนุญาต",
          en: "At each position `i`, ensure **`i + j` stays within `len`** — forget it and you read past the bound the caller allowed." },
        "เจอที่ index 3", [v("return", "big + 3", { th: "ตัวชี้เข้าไปใน big", en: "a pointer into big" }, true)])
    ]),

    f("ft_atoi", G1, "ft_atoi(\"   -2147483648abc\")", [
      st("ft_atoi(str)", "ft_atoi.c", 0,
        { th: "แปลงสตริงเป็น `int` แบบ **หยุดทันทีที่เจอตัวที่ไม่ใช่ตัวเลข** และไม่แจ้ง error ใด ๆ",
          en: "Turns a string into an `int`, **stopping at the first non-digit**, and reports no error at all." },
        "\"   -2147483648abc\"", []),
      st("ข้ามช่องว่างนำหน้า", "ft_atoi.c", 1,
        { th: "ช่องว่างที่ยอมข้ามมี 6 ตัว: space, `\\t`, `\\n`, `\\v`, `\\f`, `\\r` — และข้ามได้ **ก่อนเครื่องหมายเท่านั้น**",
          en: "Six characters may be skipped: space, `\\t`, `\\n`, `\\v`, `\\f`, `\\r` — and only **before the sign**." },
        "ข้าม 3 ช่อง -> ชี้ที่ '-'", []),
      st("อ่านเครื่องหมายได้ตัวเดียว", "ft_atoi.c", 1,
        { th: "`\"--5\"` ต้องได้ 0 ไม่ใช่ 5 — เจอเครื่องหมายตัวที่สองแล้วต้องเลิกอ่านทันที",
          en: "`\"--5\"` must yield 0, not 5: a second sign ends the parse immediately." },
        "sign = -1", [v("sign", "-1", { th: "เก็บไว้คูณตอนท้าย", en: "applied at the end" }, true)]),
      st("สะสมตัวเลขทีละหลัก", "ft_atoi.c", 2,
        { th: "`res = res * 10 + (c - '0')` — และ **สะสมเป็นค่าลบไว้ก่อน** จะรับ `INT_MIN` ได้พอดี เพราะ `2147483648` เก็บใน `int` ไม่ได้",
          en: "`res = res * 10 + (c - '0')` — and **accumulating as a negative** handles `INT_MIN`, because `2147483648` does not fit in an `int`." },
        "res = -2147483648", [v("res", "-2147483648", { th: "ใช้ long หรือสะสมเป็นลบก็ได้", en: "either use a long or accumulate negatively" }, true)]),
      st("เจอ 'a' -> หยุด", "ft_atoi.c", 1,
        { th: "ไม่ใช่ตัวเลขก็จบทันที **ไม่ใช่ error** — `\"abc\"` จึงได้ 0 ซึ่งแยกไม่ออกจาก `\"0\"` นี่คือข้อจำกัดของ atoi ที่ `strtol` เกิดมาแก้",
          en: "A non-digit simply ends it — **not an error** — so `\"abc\"` gives 0, indistinguishable from `\"0\"`. That limitation is why `strtol` exists." },
        "return (-2147483648);", [])
    ]),

    f("ft_calloc", G1, "ft_calloc(4, sizeof(int))", [
      st("ft_calloc(count, size)", "ft_calloc.c", 0,
        { th: "จองแล้ว **เคลียร์เป็นศูนย์ให้ด้วย** ต่างจาก `malloc` ที่คืนหน่วยความจำที่มีขยะอยู่",
          en: "Allocates **and zeroes the memory**, unlike `malloc`, which hands back whatever was there." },
        "count = 4  size = 4  ->  16 ไบต์", []),
      st("ตรวจการล้นก่อนคูณ", "ft_calloc.c", 1,
        { th: "**`count * size` ล้นได้** และผลที่ล้นจะกลายเป็นเลขเล็ก ทำให้จองน้อยกว่าที่ผู้เรียกคิด แล้วเขียนทะลุ — นี่คือช่องโหว่จริงที่เคยเป็น CVE มาแล้ว",
          en: "**`count * size` can overflow** into a small number, allocating less than the caller expects and inviting a write past the end — a real vulnerability class with CVEs to its name." },
        "ถ้า count && size > SIZE_MAX / count -> NULL", [v("guard", "SIZE_MAX / count", { th: "หารก่อนคูณ กันล้น", en: "divide before multiplying to detect it" }, true)]),
      st("malloc แล้ว bzero", "ft_calloc.c", 1,
        { th: "เช็ค `NULL` จาก `malloc` ก่อนเสมอ แล้วค่อยล้างด้วย `ft_bzero` — ใช้ของที่เขียนไปแล้ว",
          en: "Check `malloc` for `NULL` first, then clear with `ft_bzero` — reuse what you already wrote." },
        "return (p);", [v("p[0..3]", "0", { th: "ศูนย์ทุกไบต์", en: "every byte zeroed" }, true)])
    ]),

    f("ft_strdup", G1, "ft_strdup(\"42\")", [
      st("ft_strdup(s1)", "ft_strdup.c", 0,
        { th: "สร้าง **สำเนาใหม่บน heap** ที่ผู้เรียกเป็นเจ้าของและต้อง `free` เอง — จุดที่ความเป็นเจ้าของเปลี่ยนมือ",
          en: "Makes a **fresh copy on the heap** that the caller owns and must `free` — the moment ownership changes hands." },
        "s1 = \"42\"  ->  ต้องจอง 3 ไบต์", [v("len", "2", { th: "ไม่รวมตัวปิด", en: "excluding the terminator" })]),
      st("malloc(len + 1)", "ft_strdup.c", 1,
        { th: "**+1 คือที่ของ `'\\0'`** ลืมแล้วจะเขียนล้นไปหนึ่งไบต์ ซึ่งเป็นบั๊กที่ valgrind จับได้ทันทีแต่โปรแกรมอาจดูปกติ",
          en: "**The +1 is the `'\\0'`.** Forget it and you write one byte past the end — valgrind catches it instantly even though the program may look fine." },
        "malloc(3)", []),
      st("คัดลอกแล้วปิดท้าย", "ft_strdup.c", 1,
        { th: "`malloc` คืน `NULL` ได้เสมอ ต้องเช็คก่อนเขียน — และผลลัพธ์ **ไม่ผูกกับอายุของ `s1`** อีกต่อไป",
          en: "`malloc` can always return `NULL`, so check before writing — and the result no longer depends on `s1`'s lifetime." },
        "return \"42\" ที่จองใหม่", [v("ownership", "caller", { th: "ผู้เรียกต้อง free", en: "the caller must free it" }, true)])
    ])
  ] };
})();

/* ส่วนที่ 2 + โบนัส — ต่อท้าย multi ของ libft */
(function () {
  var G2 = { th: "ส่วนที่ 2 · ฟังก์ชันเพิ่มเติม", en: "Part 2 · additional functions" };
  var G3 = { th: "โบนัส · linked list", en: "Bonus · linked list" };

  function v(n, val, d, w) { return { n: n, v: val, d: d, w: !!w }; }
  function st(fn, file, depth, note, data, vars) {
    return { fn: fn, file: file, depth: depth, note: note, data: data, vars: vars || [] };
  }
  function f(label, group, input, steps) {
    return { label: label, group: group, input: input, steps: steps };
  }

  var more = [
    f("ft_substr", G2, "ft_substr(\"42 Bangkok\", 3, 7)", [
      st("ft_substr(s, start, len)", "ft_substr.c", 0,
        { th: "ตัดสตริงย่อยออกมาเป็น **ก้อนใหม่บน heap** ผู้เรียกเป็นเจ้าของ — ไม่ใช่การชี้เข้าไปใน `s`",
          en: "Cuts a substring into a **fresh heap allocation** the caller owns — not a pointer into `s`." },
        "s = \"42 Bangkok\"  start = 3  len = 7", []),
      st("start เกินความยาว", "ft_substr.c", 1,
        { th: "**ต้องคืนสตริงว่างที่จองแล้ว ไม่ใช่ NULL** — ผู้เรียกยังต้อง free ได้ตามปกติ เป็นเคสที่ tester ยิงตรง ๆ",
          en: "**Return an allocated empty string, not NULL** — the caller must still be able to free it. Testers check this directly." },
        "ถ้า start >= strlen(s) -> ft_strdup(\"\")", []),
      st("len ที่จองจริงต้องหด", "ft_substr.c", 1,
        { th: "ขอ 7 แต่เหลือจริง 7 พอดี — ถ้าขอเกินที่เหลือ **ต้องจองเท่าที่เหลือ ไม่ใช่เท่าที่ขอ** ไม่งั้นเปลืองและอ่านทะลุ",
          en: "Seven were asked for and seven remain. When the request exceeds what is left, **allocate what remains, not what was asked** — otherwise you waste memory and read past the end." },
        "len = min(len, strlen(s) - start) = 7", [v("malloc", "8", { th: "7 + ที่ว่างของ '\\0'", en: "7 plus room for the '\\0'" }, true)]),
      st("คัดลอกแล้วปิดท้าย", "ft_substr.c", 1,
        { th: "เช็ค `NULL` จาก `malloc` เสมอ แล้วคืนสตริงใหม่ที่ไม่ผูกกับอายุของ `s`",
          en: "Always check `malloc` for `NULL`, then return a string independent of `s`'s lifetime." },
        "\"Bangkok\"", [])
    ]),

    f("ft_strjoin", G2, "ft_strjoin(\"42 \", \"Bangkok\")", [
      st("ft_strjoin(s1, s2)", "ft_strjoin.c", 0,
        { th: "ต่อสองสตริงเป็นก้อนใหม่ — **ไม่แตะของเดิมทั้งคู่** ผู้เรียกยังเป็นเจ้าของ s1 กับ s2 อยู่",
          en: "Concatenates into a new allocation, **touching neither input** — the caller still owns s1 and s2." },
        "s1 = \"42 \"  s2 = \"Bangkok\"", []),
      st("จอง len1 + len2 + 1", "ft_strjoin.c", 1,
        { th: "**+1 เดียวพอ** เพราะปิดท้ายครั้งเดียว — จอง +2 คือเปลืองโดยเปล่าประโยชน์",
          en: "**One +1 is enough**, since there is a single terminator; allocating +2 just wastes a byte." },
        "3 + 7 + 1 = 11", []),
      st("จุดที่ leak บ่อยที่สุด", "ft_strjoin.c", 1,
        { th: "เวลาใช้ในลูป (เช่นใน get_next_line) **ต้อง free ผลลัพธ์เก่าทุกครั้ง** เพราะ strjoin สร้างก้อนใหม่เสมอ ไม่ได้ต่อในที่",
          en: "Used in a loop (as in get_next_line) you **must free the previous result each round**, because strjoin always builds a new block rather than appending in place." },
        "\"42 Bangkok\"", [v("ownership", "caller", { th: "ผู้เรียก free ทั้งของเก่าและของใหม่", en: "the caller frees both the old and the new" }, true)])
    ]),

    f("ft_strtrim", G2, "ft_strtrim(\"  42  \", \" \")", [
      st("ft_strtrim(s1, set)", "ft_strtrim.c", 0,
        { th: "ตัดตัวอักษรที่อยู่ใน `set` ออกจาก **หัวและท้าย** เท่านั้น ตรงกลางไม่แตะ",
          en: "Strips characters in `set` from **the front and the back** only; the middle is untouched." },
        "s1 = \"  42  \"  set = \" \"", []),
      st("เดินหน้าหาจุดเริ่ม", "ft_strtrim.c", 1,
        { th: "ใช้ `ft_strchr(set, s1[i])` ตัดสินว่าตัวนี้อยู่ใน set ไหม — ประกอบจากของที่เขียนแล้ว",
          en: "Use `ft_strchr(set, s1[i])` to decide whether a character belongs to the set — built from what you already wrote." },
        "start = 2", [v("start", "2", { th: "ตำแหน่งแรกที่ไม่อยู่ใน set", en: "the first index not in the set" }, true)]),
      st("เดินถอยหลังหาจุดจบ", "ft_strtrim.c", 1,
        { th: "**ต้องกัน `end` ไม่ให้เดินต่ำกว่า `start`** ไม่งั้นสตริงที่เป็น set ล้วน เช่น `\"   \"` จะคำนวณความยาวติดลบแล้วพัง",
          en: "**Guard `end` from crossing below `start`**, or an all-set string like `\"   \"` computes a negative length and crashes." },
        "end = 4", []),
      st("ตัดออกมาด้วย ft_substr", "ft_strtrim.c", 1,
        { th: "ความยาว = `end - start` แล้วให้ `ft_substr` จองและคัดลอกให้ — ไม่ต้องเขียนลูปคัดลอกใหม่",
          en: "The length is `end - start`; let `ft_substr` allocate and copy, rather than writing another copy loop." },
        "\"42\"", [])
    ]),

    f("ft_split", G2, "ft_split(\"  42  is  fun \", ' ')", [
      st("ft_split(s, c)", "ft_split.c", 0,
        { th: "คืน **array ของ string ที่ปิดท้ายด้วย NULL** ผู้เรียกจึงวนอ่านได้โดยไม่ต้องรู้จำนวน — รูปแบบเดียวกับ `argv`",
          en: "Returns a **NULL-terminated array of strings**, so the caller can walk it without a count — the same shape as `argv`." },
        "s = \"  42  is  fun \"  c = ' '", []),
      st("นับคำก่อนจอง", "ft_split.c", 1,
        { th: "คำเริ่มเมื่อ **ตัวนี้ไม่ใช่ตัวคั่น และตัวก่อนหน้าเป็นตัวคั่นหรือเป็นต้นสตริง** — ตัวคั่นซ้อนกันจึงไม่กลายเป็นคำว่าง",
          en: "A word starts where **this character is not the separator and the previous one was, or this is the start** — so repeated separators never become empty words." },
        "3 คำ", [v("words", "3", { th: "ขนาดที่ต้องจอง", en: "the size to allocate" }, true)]),
      st("malloc((words + 1) * sizeof(char *))", "ft_split.c", 1,
        { th: "**+1 คือช่อง NULL ปิดท้าย** ลืมแล้วผู้เรียกจะวนเลยขอบ array",
          en: "**The +1 is the terminating NULL slot**; forget it and the caller walks past the end." },
        "จอง 4 ช่อง", []),
      st("ตัดแต่ละคำด้วย ft_substr", "ft_split.c", 2,
        { th: "แต่ละคำเป็นก้อนใหม่แยกกัน — ผลลัพธ์จึงไม่ผูกกับอายุของ `s` ผู้เรียก free `s` ได้ทันที",
          en: "Each word is its own allocation, so the result does not depend on `s`'s lifetime — the caller may free `s` right away." },
        "[\"42\", \"is\", \"fun\", NULL]", []),
      st("malloc ล้มกลางทาง", "ft_split.c", 2,
        { th: "**ต้อง free ทุกคำที่จองไปแล้ว บวกตัว array เอง ก่อนคืน NULL** — `return NULL` เฉย ๆ คือ leak ที่ valgrind จับได้ทันที",
          en: "**Free every word already allocated plus the array itself before returning NULL** — a bare `return NULL` is a leak valgrind catches at once." },
        "free(tab[0..i]); free(tab); return NULL;", [v("cleanup", "ครบทุกก้อน", { th: "หน้าที่ของผู้ผลิต ไม่ใช่ผู้เรียก", en: "the producer's duty, not the caller's" }, true)])
    ]),

    f("ft_itoa", G2, "ft_itoa(-2147483648)", [
      st("ft_itoa(n)", "ft_itoa.c", 0,
        { th: "แปลง `int` เป็นสตริงบน heap — ทางกลับของ `ft_atoi`",
          en: "Turns an `int` into a heap string — the inverse of `ft_atoi`." },
        "n = -2147483648", []),
      st("นับจำนวนหลักก่อน", "ft_itoa.c", 1,
        { th: "ต้องรู้ความยาวก่อนจอง — และ **ต้องบวกช่องให้เครื่องหมายลบ** ส่วน `n == 0` เป็นเคสพิเศษที่มี 1 หลัก",
          en: "You need the length before allocating, **plus a slot for the minus sign**; `n == 0` is the special case with one digit." },
        "10 หลัก + '-' + '\\0' = 12", [v("len", "11", { th: "ไม่รวมตัวปิด", en: "excluding the terminator" }, true)]),
      st("INT_MIN คือกับดัก", "ft_itoa.c", 1,
        { th: "**`-INT_MIN` ล้น `int`** จะเขียน `n = -n` ตรง ๆ ไม่ได้ — ทางออกคือทำงานบน `long` หรือสะสมเป็นค่าลบตลอด",
          en: "**`-INT_MIN` overflows an `int`**, so `n = -n` is not allowed — work in a `long`, or keep the value negative throughout." },
        "long nb = n;", [v("nb", "-2147483648", { th: "long รับได้ int ไม่ได้", en: "a long can hold it; an int cannot" }, true)]),
      st("เขียนจากหลังมาหน้า", "ft_itoa.c", 1,
        { th: "หารสิบเอาเศษได้หลักท้ายก่อน จึงเติมจากท้าย array มาหน้า แล้วใส่ `'-'` ที่ index 0 เป็นตัวสุดท้าย",
          en: "Dividing by ten yields the last digit first, so fill from the end backwards and place the `'-'` at index 0 last." },
        "\"-2147483648\"", [])
    ]),

    f("ft_strmapi", G2, "ft_strmapi(\"abc\", f)", [
      st("ft_strmapi(s, f)", "ft_strmapi.c", 0,
        { th: "สร้างสตริงใหม่โดยส่ง **(index, ตัวอักษร)** ให้ฟังก์ชันที่ผู้เรียกให้มา — ของเดิมไม่ถูกแก้",
          en: "Builds a new string by handing **(index, character)** to a caller-supplied function; the original is untouched." },
        "f(i, c) = i คู่ -> toupper", []),
      st("index มาก่อนตัวอักษร", "ft_strmapi.c", 1,
        { th: "ลำดับพารามิเตอร์คือ `f(unsigned int i, char c)` — **สลับลำดับแล้วคอมไพล์ผ่านแต่ผลผิด** เพราะชนิดแปลงกันได้เงียบ ๆ",
          en: "The signature is `f(unsigned int i, char c)` — **swap them and it still compiles but misbehaves**, because the types convert silently." },
        "f(0,'a') f(1,'b') f(2,'c')", []),
      st("จองแล้วเก็บผล", "ft_strmapi.c", 1,
        { th: "ยาวเท่าเดิมเสมอ เพราะ map คือแปลงทีละตัว ไม่ใช่กรอง — คืน `NULL` ถ้าจองไม่ได้",
          en: "The length never changes, because mapping transforms one to one rather than filtering; return `NULL` if the allocation fails." },
        "\"AbC\"", [])
    ]),

    f("ft_striteri", G2, "ft_striteri(str, f)", [
      st("ft_striteri(s, f)", "ft_striteri.c", 0,
        { th: "ต่างจาก `strmapi` ตรงที่ **แก้ของเดิมในที่ ไม่จองใหม่และไม่คืนค่า** — จึงส่ง `char *` (ตัวชี้) ให้ f ไม่ใช่ค่า",
          en: "Unlike `strmapi` it **edits in place, allocating nothing and returning nothing** — so it passes `f` a `char *`, not a value." },
        "f(unsigned int i, char *c)", [v("s", "แก้ในที่", { th: "ผู้เรียกเห็นผลทันที", en: "the caller sees the change immediately" }, true)]),
      st("ใช้เมื่อไม่อยากจ่ายค่าจอง", "ft_striteri.c", 1,
        { th: "เลือกใช้ `striteri` เมื่อไม่ต้องการสำเนา และเลือก `strmapi` เมื่อของเดิมต้องคงอยู่ — คู่นี้สอนเรื่องความเป็นเจ้าของโดยตรง",
          en: "Reach for `striteri` when no copy is wanted and `strmapi` when the original must survive — the pair teaches ownership directly." },
        "ไม่มีค่าคืน", [])
    ]),

    f("ft_putchar_fd", G2, "ft_putchar_fd('4', 1)", [
      st("ft_putchar_fd(c, fd)", "ft_putchar_fd.c", 0,
        { th: "เขียนหนึ่งตัวอักษรลง fd ที่ระบุ — `1` คือ stdout, `2` คือ stderr ซึ่งเป็นที่ที่ข้อความ error ควรไป",
          en: "Writes one character to the given descriptor: `1` is stdout and `2` is stderr, where error messages belong." },
        "write(1, &c, 1);", [v("fd", "1", { th: "ผู้เรียกเลือกปลายทางเอง", en: "the caller chooses the destination" })])
    ]),

    f("ft_putstr_fd", G2, "ft_putstr_fd(\"42\", 1)", [
      st("ft_putstr_fd(s, fd)", "ft_putstr_fd.c", 0,
        { th: "หาความยาวแล้วเขียนทีเดียว — **หรือ** วนเรียก `ft_putchar_fd` ก็ได้ แต่เรียก `write` ครั้งเดียวเร็วกว่ามากเมื่อสตริงยาว",
          en: "Measure then write once — **or** loop over `ft_putchar_fd`, though a single `write` is far faster for long strings." },
        "write(1, s, ft_strlen(s));", []),
      st("s เป็น NULL", "ft_putstr_fd.c", 1,
        { th: "ต้องไม่ crash — เช็คแล้วคืนออกไปเงียบ ๆ (ต่างจาก `printf` ที่พิมพ์ `(null)`)",
          en: "It must not crash: check and return quietly, unlike `printf`, which prints `(null)`." },
        "if (!s) return;", [])
    ]),

    f("ft_putendl_fd", G2, "ft_putendl_fd(\"42\", 1)", [
      st("ft_putendl_fd(s, fd)", "ft_putendl_fd.c", 0,
        { th: "คือ `ft_putstr_fd` แล้วตามด้วย `'\\n'` — ประกอบจากของที่มี ไม่เขียนลูปใหม่",
          en: "It is `ft_putstr_fd` followed by a `'\\n'` — composed from what exists, not a new loop." },
        "\"42\\n\"", [])
    ]),

    f("ft_putnbr_fd", G2, "ft_putnbr_fd(-2147483648, 1)", [
      st("ft_putnbr_fd(n, fd)", "ft_putnbr_fd.c", 0,
        { th: "พิมพ์จำนวนเต็มโดย **ไม่ต้องจองหน่วยความจำ** ต่างจาก `ft_itoa` ที่ต้อง malloc",
          en: "Prints an integer **without allocating**, unlike `ft_itoa`, which must malloc." },
        "n = -2147483648", []),
      st("แยกเครื่องหมายก่อน", "ft_putnbr_fd.c", 1,
        { th: "พิมพ์ `'-'` แล้วทำงานต่อบนค่าบวก — แต่ `-INT_MIN` ล้ม จึงต้องใช้ `long` หรือทำงานบนค่าลบตลอด",
          en: "Print the `'-'` and continue on the positive value — but `-INT_MIN` overflows, so use a `long` or stay negative." },
        "long nb = n;", []),
      st("เรียกตัวเองแล้วค่อยพิมพ์", "ft_putnbr_fd.c", 1,
        { th: "`putnbr(n / 10)` **ก่อน** `putchar(n % 10)` — เพราะพิมพ์ตอนคลายกลับ ตัวเลขจึงออกมาเรียงถูกลำดับ",
          en: "`putnbr(n / 10)` **before** `putchar(n % 10)`: printing on the way back up puts the digits in order." },
        "-2147483648", [v("ความลึก", "10", { th: "หนึ่งชั้นต่อหนึ่งหลัก", en: "one frame per digit" })])
    ]),

    /* ── โบนัส: linked list ─────────────────────────────────── */
    f("ft_lstnew", G3, "ft_lstnew(\"content\")", [
      st("ft_lstnew(content)", "ft_lstnew.c", 0,
        { th: "สร้าง node ใหม่ที่ `next` เป็น `NULL` — **เก็บตัวชี้ ไม่ได้คัดลอกเนื้อหา** ความเป็นเจ้าของของเนื้อหายังอยู่ที่ผู้เรียก",
          en: "Creates a node whose `next` is `NULL`. It **stores the pointer, it does not copy the content**, so the caller still owns what it points to." },
        "malloc(sizeof(t_list))", [v("node->next", "NULL", { th: "ตั้งเสมอ ไม่งั้นเป็นค่าขยะ", en: "always set it, or it holds garbage" }, true)])
    ]),

    f("ft_lstadd_front", G3, "ft_lstadd_front(&head, new)", [
      st("ft_lstadd_front(lst, new)", "ft_lstadd_front.c", 0,
        { th: "รับ **`t_list **`** เพราะต้องแก้ตัว head เอง — ส่งแค่ `t_list *` แล้วผู้เรียกจะไม่เห็นการเปลี่ยนแปลง",
          en: "Takes a **`t_list **`** because it must change the head itself; a plain `t_list *` would leave the caller's head unchanged." },
        "*lst เดิม -> A -> B", [v("lst", "t_list **", { th: "ตัวชี้ของตัวชี้ = แก้ตัวแปรของผู้เรียกได้", en: "a pointer to a pointer, so the caller's variable can change" })]),
      st("ต่อ new->next ก่อนย้าย head", "ft_lstadd_front.c", 1,
        { th: "**ลำดับสำคัญ**: ถ้าย้าย `*lst = new` ก่อน จะหาทางกลับไปหา list เดิมไม่เจออีกเลย = leak ทั้งเส้น",
          en: "**Order matters**: assigning `*lst = new` first loses the only handle on the old list, leaking all of it." },
        "new->next = *lst;  *lst = new;", [v("*lst", "new", { th: "O(1) ไม่ต้องเดิน list", en: "O(1), with no walk" }, true)])
    ]),

    f("ft_lstsize", G3, "ft_lstsize(head)", [
      st("ft_lstsize(lst)", "ft_lstsize.c", 0,
        { th: "เดินทั้งเส้นแล้วนับ — **O(n) ทุกครั้งที่เรียก** ถ้าต้องใช้ในลูป ให้เก็บค่าไว้ก่อน อย่าเรียกซ้ำ",
          en: "Walks the whole list — **O(n) on every call**. If you need it inside a loop, hoist it out." },
        "A -> B -> C  ->  3", [v("i", "3", { th: "list ว่างคืน 0 ไม่ใช่ crash", en: "an empty list returns 0, not a crash" }, true)])
    ]),

    f("ft_lstlast", G3, "ft_lstlast(head)", [
      st("ft_lstlast(lst)", "ft_lstlast.c", 0,
        { th: "เดินจนกว่า `next` จะเป็น `NULL` — เงื่อนไขลูปคือ **`lst->next`** ไม่ใช่ `lst` ไม่งั้นจะเลยไปหนึ่งช่องแล้วคืน `NULL`",
          en: "Walks until `next` is `NULL`. The loop condition is **`lst->next`**, not `lst`, or you overshoot and return `NULL`." },
        "return C", [v("lst", "NULL ก็ต้องรอด", { th: "เช็คก่อน dereference", en: "check before dereferencing" })])
    ]),

    f("ft_lstadd_back", G3, "ft_lstadd_back(&head, new)", [
      st("ft_lstadd_back(lst, new)", "ft_lstadd_back.c", 0,
        { th: "**list ว่างเป็นเคสพิเศษ** — ต้องตั้ง `*lst = new` ตรง ๆ เพราะไม่มีตัวสุดท้ายให้ต่อ",
          en: "**An empty list is the special case**: assign `*lst = new` directly, because there is no last node to attach to." },
        "if (!*lst) { *lst = new; return; }", []),
      st("ใช้ ft_lstlast หาตัวท้าย", "ft_lstadd_back.c", 1,
        { th: "**O(n) ต่างจาก add_front ที่เป็น O(1)** — ต่อท้ายซ้ำ n ครั้งจึงกลายเป็น O(n²) ถ้าลำดับไม่สำคัญ ให้ต่อหน้าแล้วค่อยกลับด้านทีเดียว",
          en: "**O(n), unlike add_front's O(1)** — appending n times becomes O(n²). When order does not matter, push front and reverse once." },
        "ft_lstlast(*lst)->next = new;", [])
    ]),

    f("ft_lstdelone", G3, "ft_lstdelone(node, del)", [
      st("ft_lstdelone(lst, del)", "ft_lstdelone.c", 0,
        { th: "ลบ **node เดียว** โดยเรียก `del` กับเนื้อหาก่อน แล้วค่อย `free` ตัว node — **ไม่แตะ `next`** การเชื่อมต่อเป็นเรื่องของผู้เรียก",
          en: "Deletes **one node**: call `del` on the content, then `free` the node. It **does not touch `next`** — relinking is the caller's job." },
        "del(lst->content);  free(lst);", []),
      st("ทำไม del ถึงถูกส่งเข้ามา", "ft_lstdelone.c", 1,
        { th: "libft ไม่รู้ว่า `content` คืออะไร — อาจเป็น struct ที่มี pointer ข้างในอีกชั้น **ผู้เรียกเท่านั้นที่รู้วิธี free ที่ถูกต้อง**",
          en: "libft cannot know what `content` is — it may be a struct holding further pointers. **Only the caller knows how to free it properly.**" },
        "ถ้าไม่ส่ง del จะ free ไม่ครบชั้น", [v("del", "ฟังก์ชันของผู้เรียก", { th: "หัวใจของ generic container", en: "the heart of a generic container" })])
    ]),

    f("ft_lstclear", G3, "ft_lstclear(&head, del)", [
      st("ft_lstclear(lst, del)", "ft_lstclear.c", 0,
        { th: "ลบทั้งเส้น — **ต้องเก็บ `next` ไว้ก่อน free** ไม่งั้นอ่าน `node->next` จากหน่วยความจำที่คืนไปแล้ว ซึ่งคือ use-after-free",
          en: "Deletes the whole list — **save `next` before freeing**, or you read `node->next` out of memory you just released, a use-after-free." },
        "tmp = lst->next;  ft_lstdelone(lst, del);  lst = tmp;", [v("tmp", "next ที่เก็บไว้ก่อน", { th: "บรรทัดที่ลืมไม่ได้", en: "the line you cannot forget" }, true)]),
      st("ตั้ง *lst = NULL ตอนจบ", "ft_lstclear.c", 1,
        { th: "**ปิดท้ายด้วยการล้าง head ของผู้เรียก** ไม่งั้นเหลือ dangling pointer ที่ดูเหมือนใช้ได้ — นี่คือเหตุผลที่รับเป็น `t_list **`",
          en: "**Clear the caller's head at the end**, or a dangling pointer remains that still looks usable — which is why it takes a `t_list **`." },
        "*lst = NULL;", [])
    ]),

    f("ft_lstiter", G3, "ft_lstiter(head, f)", [
      st("ft_lstiter(lst, f)", "ft_lstiter.c", 0,
        { th: "เดินทั้งเส้นแล้วเรียก `f(content)` ทีละ node — **ไม่จอง ไม่คืนค่า** เป็นเวอร์ชัน in-place ของ `lstmap`",
          en: "Walks the list calling `f(content)` on each node — **no allocation, no return value**: the in-place version of `lstmap`." },
        "f แก้เนื้อหาในที่ได้", [])
    ]),

    f("ft_lstmap", G3, "ft_lstmap(head, f, del)", [
      st("ft_lstmap(lst, f, del)", "ft_lstmap.c", 0,
        { th: "สร้าง **list ใหม่ทั้งเส้น** โดยแต่ละ node เก็บผลของ `f(content)` — ของเดิมไม่ถูกแตะ",
          en: "Builds an **entirely new list** whose nodes hold `f(content)`; the original is untouched." },
        "รับทั้ง f และ del", []),
      st("สร้างทีละ node", "ft_lstmap.c", 1,
        { th: "`ft_lstnew(f(lst->content))` แล้วต่อท้าย — ถ้า `f` จองหน่วยความจำ ผลของมันจะเป็นของ list ใหม่",
          en: "`ft_lstnew(f(lst->content))`, then append — if `f` allocates, its result belongs to the new list." },
        "new -> new -> new", []),
      st("ล้มกลางทางต้องเก็บกวาดให้ครบ", "ft_lstmap.c", 2,
        { th: "**`ft_lstclear(&head, del)` ส่วนที่สร้างไปแล้ว แล้วคืน NULL** — และถ้า `f` จองไว้แต่ `lstnew` ล้ม ต้อง `del` ผลของ `f` ตัวนั้นด้วย ไม่งั้น leak หนึ่งก้อนเงียบ ๆ",
          en: "**`ft_lstclear(&head, del)` what exists and return NULL** — and if `f` allocated but `lstnew` failed, `del` that result too, or one block leaks silently." },
        "ft_lstclear(&head, del); return (NULL);", [v("del", "ใช้ตอนล้มเหลวเท่านั้น", { th: "นี่คือเหตุผลเดียวที่ lstmap ต้องรับ del", en: "the only reason lstmap takes a del at all" }, true)])
    ])
  ];

  more.forEach(function (x) { window.EXTRA_FLOWS.libft.multi.push(x); });
})();
