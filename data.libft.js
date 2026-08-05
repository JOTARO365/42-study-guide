/* ===================== libft (+ ft_printf, get_next_line) ===================== */
/* ต่อท้าย window.TEACHING_DATA — อิงจากโค้ดจริงใน push_swap/libft/ ของ wiaon-in */
window.TEACHING_DATA.unshift({
  id: "libft",
  name: "libft",
  tag: { th: "กล่องเครื่องมือ C ~46 ฟังก์ชันที่ทุกโปรเจกต์หลังจากนี้ลิงก์ใช้ — รวม ft_printf และ get_next_line ไว้ในไฟล์ libft.a เดียว",
         en: "The ~46-function C toolbox every later project links against — with ft_printf and get_next_line folded into a single libft.a" },
  accent: "#0abde3",
  sections: {
    principle: [
      { h: "libft คืออะไร ทำไมต้องทำให้ดี" },
      { p: "libft คือการเขียนฟังก์ชันมาตรฐานของ C ขึ้นมาใหม่ด้วยมือ แล้วรวมเป็นไฟล์ `libft.a` ไฟล์เดียว. **ทุกโปรเจกต์หลังจากนี้ลิงก์กับมัน** — push_swap, pipex, minitalk, fdf, so_long, cub3d, miniRT, minishell" },
      { p: "ผลที่ตามมาคือสิ่งที่ทำให้โปรเจกต์นี้ต่างจากโปรเจกต์อื่น: **บั๊กเล็ก ๆ ที่ปล่อยไว้จะกลับมาหาเราในโปรเจกต์ที่ debug ยากกว่ามาก**. `ft_strlcat` ที่คืนค่าผิดจะไปโผล่เป็นบัฟเฟอร์ล้นใน minishell ตอนที่เราลืมไปแล้วว่าเคยเขียนมันไว้ยังไง" },
      { h: "5 กลุ่มฟังก์ชัน" },
      { table: { head: ["กลุ่ม", "ฟังก์ชัน", "ลักษณะร่วม"], rows: [
        ["ตรวจตัวอักษร", "`isalpha isdigit isalnum isascii isprint toupper tolower`", "รับ/คืน `int` · ไม่จองหน่วยความจำ · ไม่มีผลข้างเคียง"],
        ["หน่วยความจำ", "`memset bzero memcpy memmove memchr memcmp calloc`", "ทำงานกับ `void *` และจำนวนไบต์ ไม่สนใจ `\\0`"],
        ["สตริง", "`strlen strlcpy strlcat strchr strrchr strncmp strnstr strdup atoi`", "เขียนลงบัฟเฟอร์ของผู้เรียก หรือคืน pointer ที่ชี้เข้าไปในข้อมูลเดิม"],
        ["สตริงที่จอง", "`substr strjoin strtrim split itoa strmapi striteri`", "**ทุกตัว `malloc`** — ผู้เรียกต้อง `free`"],
        ["ลิสต์ (bonus)", "`lstnew lstadd_front lstadd_back lstsize lstlast lstdelone lstclear lstiter lstmap`", "`t_list` แบบเชื่อมทางเดียว เก็บ `void *content`"],
      ]}},
      { h: "เส้นแบ่งที่สำคัญที่สุด: ใครเป็นเจ้าของ pointer ที่คืนมา" },
      { code: String.raw`คืน pointer ที่ต้อง free:
    ft_substr  ft_strjoin  ft_strtrim  ft_split  ft_itoa
    ft_strmapi  ft_strdup  ft_calloc  ft_lstnew  ft_lstmap
    ft_printf ไม่คืน (คืนจำนวนตัวอักษร)  ·  get_next_line คืน → ต้อง free ทุกบรรทัด

คืน pointer ที่ห้าม free (ชี้เข้าไปในข้อมูลของผู้เรียกเอง):
    ft_strchr  ft_strrchr  ft_strnstr  ft_memchr
    ft_memset  ft_memcpy  ft_memmove   (คืน dst ที่ผู้เรียกส่งมา)

เขียนลงบัฟเฟอร์ที่ผู้เรียกเตรียมไว้ (ไม่จองอะไรเลย):
    ft_strlcpy  ft_strlcat  ft_bzero  ft_striteri`, cap: "แยก 3 กลุ่มนี้ให้ออกก่อนเขียนโค้ด แล้วเรื่อง leak กับ double free จะหายไปเกือบหมด", lang: "txt" },
      { h: "กฎเหล็ก" },
      { ul: [
        "**norminette ต้องผ่านทุกไฟล์** — 25 บรรทัด/ฟังก์ชัน, 5 ฟังก์ชัน/ไฟล์, 5 พารามิเตอร์, ไม่มี `for`, ไม่มี ternary, tab, ≤80 คอลัมน์",
        "ฟังก์ชันภายนอกที่ใช้ได้มีแค่ `malloc`, `free`, `write`, `read` — ห้ามเรียก `printf`, `strlen`, `memcpy` ของ libc",
        "สร้างไฟล์ด้วย `ar rcs libft.a *.o` · เป้าหมาย `all clean fclean re bonus` · **ต้องไม่ relink เมื่อไม่มีอะไรเปลี่ยน**",
        "ไฟล์ bonus ชื่อ `ft_lst*_bonus.c` และคอมไพล์เฉพาะตอนสั่ง `make bonus`",
      ]},
      { note: "โปรเจกต์นี้รวม **ft_printf** และ **get_next_line** ไว้ใน `libft.a` เลย — `libft.h` ประกาศทั้งคู่ไว้ท้ายไฟล์ และ `get_next_line.h` include `libft.h` แทนที่จะ include `<stdlib.h>`/`<unistd.h>` ซ้ำ. โปรเจกต์หลังจากนี้จึงลิงก์ไฟล์เดียวได้ทุกอย่าง" },
    ],

    theory: [
      { h: "🔬 เจาะลึก A: `memcpy` กับ `memmove` ต่างกันตรงพื้นที่ทับกัน" },
      { p: "2 ตัวนี้ดูเหมือนกันจนคนมักเขียนตัวเดียวแล้วให้อีกตัวเรียกต่อ — ซึ่งผิดในทิศทางเดียว" },
      { code: String.raw`สมมติ  char b[10] = "abcdefghi";  แล้วเลื่อนไปทางขวา 2 ช่อง
       memcpy(b + 2, b, 5);

  ถ้าก๊อปจากซ้ายไปขวา:
      b[2] = b[0]   →  ab a defghi
      b[3] = b[1]   →  ab ab efghi
      b[4] = b[2]   ★ b[2] ถูกเขียนทับไปแล้ว! อ่านได้ 'a' แทน 'c'
      ผลลัพธ์เพี้ยน

  ถ้าก๊อปจากขวาไปซ้าย:
      b[6] = b[4]  →  b[5] = b[3]  →  b[4] = b[2] ...
      ★ อ่านทุกช่องก่อนที่มันจะถูกเขียนทับ  →  ถูกต้อง

memcpy   มาตรฐานบอกว่า "พื้นที่ห้ามทับกัน" — ทับแล้วเป็น undefined behaviour
memmove  ต้องได้ผลเหมือนก๊อปผ่านบัฟเฟอร์ชั่วคราว → เลือกทิศทางเอง`, cap: "การเลือกทิศทางคือทั้งหมดของ memmove", lang: "txt" },
      { code: String.raw`void	*ft_memmove(void *dst, const void *src, size_t len)
{
	unsigned char	*dest;
	unsigned char	*source;

	dest = (unsigned char *)dst;
	source = (unsigned char *)src;
	if (source > dest)
		ft_memcpy(dst, src, len);      /* ปลายทางอยู่ซ้าย → ไปหน้าปลอดภัย */
	else
	{
		while (len-- != 0)
			dest[len] = source[len];   /* ปลายทางอยู่ขวา → ต้องถอยหลัง */
	}
	return (dest);
}`, cap: "โค้ดจริง — `while (len-- != 0)` ทำให้ index เริ่มจาก len-1 ลงมาถึง 0 พอดี", lang: "c" },
      { note: "**ทำไม cast เป็น** `unsigned char *`: `void *` บวกเลขไม่ได้ตามมาตรฐาน และ `char` อาจมีเครื่องหมายซึ่งไม่เกี่ยวกับงานนี้เลย — เราต้องการมองข้อมูลเป็น 'ไบต์ดิบ' ซึ่งคือ `unsigned char` พอดี" },
      { qa: [
        { q: "`memcpy` กับ `memmove` ต่างกันยังไง?", a: "`memcpy` ไม่รับประกันผลเมื่อพื้นที่ต้นทางกับปลายทางทับกัน (เป็น undefined behaviour); `memmove` ต้องได้ผลถูกต้องเสมอ โดยเลือกทิศทางการก๊อปตามตำแหน่งของ 2 พื้นที่" },
        { q: "เมื่อไหร่ต้องก๊อปจากหลังมาหน้า?", a: "เมื่อปลายทางอยู่หลังต้นทาง (`dst > src`) และทับกัน — ก๊อปจากหน้าไปหลังจะเขียนทับไบต์ที่ยังไม่ได้อ่าน" },
        { q: "ทำไม cast เป็น `unsigned char *`?", a: "`void *` บวก offset ไม่ได้ตามมาตรฐาน และเราต้องการมองข้อมูลเป็นไบต์ดิบไม่มีเครื่องหมาย" },
      ]},

      { h: "🔬 เจาะลึก B: `strlcpy` / `strlcat` คืน 'ความยาวที่พยายามจะสร้าง'" },
      { p: "นี่คือรายละเอียดที่คนพลาดมากที่สุดใน libft. ทั้ง 2 ตัว **ไม่ได้คืนจำนวนไบต์ที่ก๊อปสำเร็จ** แต่คืนความยาวที่ *ควรจะได้* ถ้าบัฟเฟอร์ใหญ่พอ" },
      { table: { head: ["ฟังก์ชัน", "คืนอะไร", "เอาไปทำอะไร"], rows: [
        ["`strlcpy(dst, src, n)`", "`strlen(src)` เสมอ — แม้ `n` เป็น 0", "`ret >= n` แปลว่าถูกตัด"],
        ["`strlcat(dst, src, n)`", "`strlen(dst) + strlen(src)` (หรือ `n + strlen(src)` ถ้า dst ยาวเกิน n อยู่แล้ว)", "เหมือนกัน"],
      ]}},
      { code: String.raw`size_t	ft_strlcat(char *dst, const char *src, size_t dstsize)
{
	size_t		src_len;
	size_t		dst_len;
	size_t		i;

	src_len = ft_strlen(src);
	dst_len = ft_strlen(dst);
	if (dst_len >= dstsize)
		return (src_len + dstsize);      /* ★ dst ยังไม่จบใน dstsize ด้วยซ้ำ */
	i = 0;
	while (src[i] != '\0' && dst_len + 1 < dstsize)
		dst[dst_len++] = src[i++];
	dst[dst_len] = '\0';
	return (dst_len + ft_strlen(src + i));
}`, cap: "โค้ดจริง — บรรทัดสุดท้ายคือ 'ที่ต่อได้จริง + ที่ยังเหลือต่อไม่ได้'", lang: "c" },
      { p: "**ทำไมออกแบบให้คืนแบบนี้:** ผู้เรียกอยากรู้ว่า *ถูกตัดหรือเปล่า* ไม่ใช่ *ก๊อปไปกี่ตัว*. ถ้าคืนจำนวนที่ก๊อปสำเร็จ ผู้เรียกจะแยกไม่ออกระหว่าง 'พอดี' กับ 'เต็มพอดีแล้วถูกตัด'. คืนความยาวที่ตั้งใจแล้วเทียบกับ `dstsize` ได้เลย" },
      { note: "กรณี `dst_len >= dstsize` คืน `src_len + dstsize` ไม่ใช่ `src_len + dst_len` — เพราะตามนิยาม `dst` ยังไม่จบด้วย `\\0` ภายใน `dstsize` เลย จึงถือว่า 'ความยาวของ dst' เท่ากับ `dstsize`" },
      { qa: [
        { q: "`ft_strlcpy` คืนค่าอะไร?", a: "`strlen(src)` เสมอ — คือความยาวที่พยายามจะก๊อป ไม่ใช่จำนวนที่ก๊อปได้จริง. ผู้เรียกใช้ `ret >= dstsize` เพื่อตรวจว่าถูกตัด" },
        { q: "ทำไมไม่คืนจำนวนไบต์ที่ก๊อปสำเร็จ?", a: "เพราะแยกไม่ออกระหว่าง 'พอดี' กับ 'ถูกตัด'. คืนความยาวที่ตั้งใจแล้วเทียบกับ `dstsize` ได้ตรง ๆ" },
        { q: "`ft_strlcat` เมื่อ `dst` ยาวกว่า `dstsize` คืนอะไร?", a: "`strlen(src) + dstsize` — เพราะ `dst` ยังไม่จบด้วย `\\0` ภายในขอบเขตนั้น จึงนับความยาวของมันเป็น `dstsize`" },
      ]},

      { h: "🔬 เจาะลึก C: `ft_calloc` — การคูณที่ล้นได้เงียบ ๆ" },
      { p: "`calloc(count, size)` ต้องจอง `count * size` ไบต์. ผลคูณคำนวณใน `size_t` ซึ่ง**วนกลับ**เมื่อล้น — จองได้น้อยกว่าที่ขอมาก แล้วผู้เรียกเขียนทับออกไปนอกพื้นที่โดยไม่รู้ตัว" },
      { code: String.raw`บน 64 บิต:  SIZE_MAX = 18446744073709551615

  calloc(2, 9223372036854775808)
      2 * 9223372036854775808 = 18446744073709551616
                              = 0 หลังวนกลับ            ★
      → malloc(0) → คืน pointer ที่ใช้จริงไม่ได้
      → ผู้เรียกเขียน 18 ล้านล้านไบต์ลงไป → heap พัง

void	*ft_calloc(size_t count, size_t size)
{
	void	*res;

	if (count == 0 || size == 0)
		return (malloc(1));                /* ★ pointer ที่ free ได้จริง */
	if ((count * size) > __INT_MAX__
		|| size > __INT_MAX__
		|| count > __INT_MAX__)
		return (NULL);                     /* ★ กันไว้ก่อนคูณ */
	res = malloc(count * size);
	if (!res)
		return (NULL);
	ft_bzero(res, count * size);
	return (res);
}`, cap: "โค้ดจริง — เช็คทั้ง 2 ตัวแยกกันด้วย ไม่ใช่เช็คแค่ผลคูณ เพราะผลคูณเองอาจล้นไปแล้ว", lang: "c" },
      { p: "**ทำไมขนาด 0 คืน `malloc(1)` ไม่คืน NULL:** เพื่อให้ผู้เรียกได้ pointer ที่ไม่ซ้ำกับใครและ `free` ได้ตามปกติ — คืน NULL จะทำให้ผู้เรียกเข้าใจว่าจองไม่สำเร็จ ทั้งที่ 'ขอ 0 ไบต์' ไม่ใช่ความผิดพลาด" },
      { qa: [
        { q: "`ft_calloc` ต้องระวังอะไร?", a: "`count * size` ล้นแบบเงียบ ๆ ได้ — ต้องเช็คก่อนคูณ. และต้อง `bzero` พื้นที่ทั้งหมดเพราะ calloc รับประกันว่าข้อมูลเป็นศูนย์" },
        { q: "`calloc(0, 0)` ควรคืนอะไร?", a: "pointer ที่ไม่ซ้ำและ `free` ได้ (เช่น `malloc(1)`) — ไม่ใช่ NULL เพราะการขอ 0 ไบต์ไม่ใช่ความล้มเหลว" },
        { q: "ทำไมต้องเช็ค `count` และ `size` แยกด้วย ไม่เช็คแค่ผลคูณ?", a: "เพราะผลคูณที่เอามาเช็คนั่นแหละอาจล้นไปแล้ว — ค่าที่ได้จึงเชื่อไม่ได้" },
      ]},

      { h: "🔬 เจาะลึก D: `ft_itoa` กับ `INT_MIN` ที่ไม่มีคู่บวก" },
      { code: String.raw`ช่วงของ int (32 บิต):  -2147483648  ถึง  2147483647
                                       ↑ ไม่มีตัวนี้: +2147483648

  ดังนั้น  -INT_MIN  ล้น → undefined behaviour
  โค้ดที่เขียน  if (n < 0) n = -n;  พังทันทีที่เจอ INT_MIN

ทางแก้: ขยายเป็น long ก่อน`, cap: "เป็นผลจากการเก็บเลขติดลบแบบ two's complement — ฝั่งลบมีเลขมากกว่าฝั่งบวก 1 ตัวเสมอ", lang: "txt" },
      { code: String.raw`char	*ft_itoa(int c)
{
	long	size;
	char	*res;
	long	yeah;

	yeah = c;                      /* ★ ขยายเป็น long ก่อนทำอะไรทั้งสิ้น */
	size = get_numb(yeah);
	res = malloc(size + 1);
	if (!res)
		return (NULL);
	res[size] = '\0';
	if (yeah < 0)
	{
		res[0] = '-';
		yeah = -yeah;              /* ปลอดภัย: long เก็บ 2147483648 ได้ */
	}
	else if (yeah == 0)
		res[0] = '0';
	while (yeah)
	{
		res[--size] = (yeah % 10) + 48;
		yeah /= 10;
	}
	return (res);
}`, cap: "โค้ดจริง — เขียนตัวเลขจากหลังมาหน้า (`res[--size]`) เพราะการหารเอาเศษให้หลักท้ายสุดออกมาก่อน", lang: "c" },
      { p: "**`ft_atoi` มีปัญหากลับด้าน:** อ่านสตริงที่แทนเลขเกินช่วง `int` แล้วตัวสะสมจะล้น. เวอร์ชันคลาสสิกของ 42 ปล่อยให้มันวนไป (เหมือน `atoi` จริงที่เป็น undefined behaviour อยู่แล้ว) — ยอมรับได้ แต่ต้องอธิบายให้ได้ตอน defense ว่ารู้ตัว" },
      { qa: [
        { q: "`ft_itoa` พังกับ `INT_MIN` เพราะอะไร?", a: "`-INT_MIN` ล้นช่วงของ `int` เพราะ two's complement มีเลขติดลบมากกว่าเลขบวก 1 ตัว. แก้ด้วยการขยายเป็น `long` ก่อนกลับเครื่องหมาย" },
        { q: "ทำไมเขียนตัวเลขจากหลังมาหน้า?", a: "เพราะ `n % 10` ให้หลักหน่วยออกมาก่อน ซึ่งเป็นตัวขวาสุดของผลลัพธ์ — เขียนลงตำแหน่งท้ายแล้วถอยมาข้างหน้าจึงเรียงถูกโดยไม่ต้องกลับสตริงทีหลัง" },
      ]},

      { h: "🔬 เจาะลึก E: `ft_split` — นับก่อน เติมทีหลัง และคืนของถ้าพังกลางทาง" },
      { p: "`ft_split` เป็นฟังก์ชันที่ยากที่สุดในกลุ่มมาตรฐาน เพราะต้องจอง **อาเรย์ของ pointer** แล้วจอง **สตริงแต่ละตัว** ในนั้นอีกที — 2 ชั้นของการจอง = 2 ชั้นของ leak ที่เป็นไปได้" },
      { code: String.raw`โครง 3 ฟังก์ชัน (นับ + เติม + ตัวหลัก) ทำให้ผ่าน norm 25 บรรทัด:

  count_word(s, c)      เดินผ่าน s นับจำนวนคำ
  str_tokenized(arr, s, c)   เดินอีกรอบ ตัดแต่ละคำด้วย ft_substr ใส่ arr
  ft_split(s, c)        จองอาเรย์ขนาด (คำ + 1) แล้วเรียก 2 ตัวบน

ทำไมนับก่อน:
  รู้ขนาดที่แน่นอน → malloc ครั้งเดียว ไม่ต้อง realloc
  (และ realloc ไม่อยู่ในรายการฟังก์ชันที่ใช้ได้อยู่แล้ว)`, cap: "เดิน 2 รอบแลกกับการจองครั้งเดียว — คุ้มเสมอเมื่อ realloc ใช้ไม่ได้", lang: "txt" },
      { code: String.raw`char	**ft_split(char const *s, char c)
{
	char	**res;
	int		size;

	if (!s)
		return (NULL);
	size = count_word(s, c);
	res = malloc(sizeof(char *) * (size + 1));   /* ★ +1 สำหรับ NULL ปิดท้าย */
	if (!res)
		return (NULL);
	str_tokenized(res, s, c);
	return (res);
}`, cap: "โค้ดจริง — `+1` คือช่อง NULL ที่ทำให้ผู้เรียกวนอ่านจนจบได้โดยไม่ต้องรู้จำนวน", lang: "c" },
      { p: "**กับดักที่ tester ตรวจ:** ถ้า `ft_substr` ในลูปเติมคืน NULL (malloc ล้มเหลว) คำที่จองไปแล้วก่อนหน้าจะรั่วทั้งหมด ถ้าไม่ไล่ `free` แล้วคืน NULL. tester ที่มีตัวจำลอง malloc ล้มเหลวจะจับข้อนี้โดยเฉพาะ" },
      { note: "ช่อง NULL ปิดท้ายไม่ใช่ของประดับ — มันคือทางเดียวที่ผู้เรียก (และโค้ดเก็บกวาดของเราเอง) จะรู้ว่าอาเรย์จบตรงไหน เพราะ `ft_split` ไม่ได้คืนจำนวนคำออกไป" },
      { qa: [
        { q: "`ft_split` ทำไมต้องนับคำก่อน?", a: "เพื่อจองอาเรย์ขนาดที่ถูกต้องในครั้งเดียว — `realloc` ไม่อยู่ในฟังก์ชันที่อนุญาต และการเดา 2 เท่าไปเรื่อย ๆ ก็เปลืองและซับซ้อนกว่า" },
        { q: "ทำไมต้องมี NULL ปิดท้ายอาเรย์?", a: "เพราะฟังก์ชันไม่ได้คืนจำนวนคำ — ผู้เรียกต้องมีสัญญาณว่าอาเรย์จบตรงไหน" },
        { q: "ถ้า malloc ล้มเหลวกลางทางต้องทำอะไร?", a: "`free` ทุกคำที่จองไปแล้วและอาเรย์เอง แล้วคืน NULL — ไม่งั้นรั่วทั้งก้อน. เป็นเคสที่ tester ตรวจโดยเฉพาะ" },
      ]},

      { h: "🔬 เจาะลึก F: `t_list` — `del` เป็นของผู้เรียก `free` เป็นของเรา" },
      { p: "ฟังก์ชันลิสต์ในกลุ่ม bonus มีการแบ่งหน้าที่ที่ต้องเข้าใจให้ชัด: `t_list` เก็บ `void *content` ซึ่งเราไม่รู้ว่าเป็นอะไร — **ผู้เรียกจึงต้องส่งฟังก์ชัน `del` มาบอกว่าจะทำลาย content ยังไง** ส่วนตัว node เราจัดการเอง" },
      { table: { head: ["ฟังก์ชัน", "ทำอะไร", "ไม่ทำอะไร"], rows: [
        ["`ft_lstdelone(lst, del)`", "`del(lst->content)` แล้ว `free(lst)`", "**ไม่แตะ `lst->next`** — ตัดโซ่ไม่ใช่หน้าที่มัน"],
        ["`ft_lstclear(&lst, del)`", "เดินทั้งลิสต์เรียก `lstdelone` แล้วตั้ง `*lst = NULL`", "—"],
        ["`ft_lstiter(lst, f)`", "เรียก `f(node->content)` ทุก node", "ไม่สร้างลิสต์ใหม่ ไม่ลบอะไร"],
        ["`ft_lstmap(lst, f, del)`", "สร้างลิสต์ **ใหม่** จากผลของ `f`", "ไม่แตะลิสต์เดิม"],
      ]}},
      { p: "`ft_lstclear` **ต้องตั้ง** `*lst = NULL` ไม่งั้นผู้เรียกเหลือ pointer ที่ชี้ไปยัง node ที่ถูก free แล้ว — ใช้ต่อเมื่อไหร่ก็ use-after-free ทันที. นี่คือเหตุผลที่พารามิเตอร์เป็น `t_list **` ไม่ใช่ `t_list *`" },
      { p: "**`ft_lstmap` มีกับดักเดียวกับ `ft_split`:** ถ้า `f` หรือ `ft_lstnew` คืน NULL หลังจากสร้าง node ไปแล้วหลายตัว ต้อง `ft_lstclear` ลิสต์ที่สร้างค้างไว้ด้วย `del` ก่อนคืน NULL" },
      { qa: [
        { q: "ทำไม `ft_lstclear` รับ `t_list **` ไม่ใช่ `t_list *`?", a: "เพราะต้องเขียนค่า NULL กลับไปยังตัวแปรของผู้เรียก — ส่ง `t_list *` มาจะแก้ได้แค่สำเนา ผู้เรียกจะเหลือ pointer ที่ชี้ของที่ถูก free แล้ว" },
        { q: "`del` ต่างจาก `free` ยังไง?", a: "`content` เป็น `void *` ที่เราไม่รู้ว่าคืออะไร — อาจต้องปล่อยของข้างในก่อน. ผู้เรียกจึงส่ง `del` มาบอกวิธี ส่วน node เอง libft `free` ให้" },
        { q: "`ft_lstdelone` ทำไมไม่ลบ node ถัดไปด้วย?", a: "เพราะหน้าที่มันคือลบ node เดียว — ผู้เรียกอาจกำลังตัด node ตรงกลางออกแล้วต่อโซ่ใหม่อยู่. การลบทั้งโซ่เป็นงานของ `ft_lstclear`" },
      ]},

      { h: "📖 อ่านเพิ่มเติม" },
      { links: [
        { label: "man 3 memmove", url: "https://man7.org/linux/man-pages/man3/memmove.3.html", note: "คำนิยามเรื่องพื้นที่ทับกัน" },
        { label: "man 3 strlcpy (OpenBSD)", url: "https://man.openbsd.org/strlcpy.3", note: "ต้นตำรับที่อธิบายว่าทำไมคืนความยาวที่ตั้งใจ" },
        { label: "man 3 calloc", url: "https://man7.org/linux/man-pages/man3/malloc.3.html", note: "ข้อกำหนดเรื่องการล้นของ count × size" },
        { label: "man 3 printf", url: "https://man7.org/linux/man-pages/man3/printf.3.html", note: "ค่าที่คืนและความหมายของแต่ละ specifier" },
        { label: "man 2 read", url: "https://man7.org/linux/man-pages/man2/read.2.html", note: "ความหมายของค่าคืน 0 / -1 ที่ get_next_line ต้องแยก" },
      ]},
    ],

    foundations: [
      { h: "ft_printf — เป็นตัวกระจายงาน ไม่ใช่ตัวแปลไวยากรณ์" },
      { p: "ส่วนบังคับของ 42 ไม่มี flag ไม่มีความกว้าง ไม่มีความละเอียด — มีแค่ specifier 9 ตัว: `c s p d i u x X %`. โครงจึงเป็นการกระจายงาน 4 ชั้นเพื่อให้ทุกฟังก์ชันอยู่ใต้ 25 บรรทัดตาม norm" },
      { code: String.raw`ft_printf(s, ...)        เดินไปตาม format เจอ '%' ก็ส่งตัวถัดไปให้ ft_check
   └─ ft_check           %c %s %%  จบที่นี่ · ที่เหลือส่งลงล่าง
       └─ ft_check_num   %d %i %u  จบที่นี่ · เลขฐาน 16 ส่งลงล่าง
           └─ ft_check_hex   %x %X %p

ทุกชั้นคืน "จำนวนตัวอักษรที่เขียนไป"
ft_printf บวกสะสม → ค่าที่คืนออกไปคือยอดรวม (เหมือน printf จริง)`, cap: "แบ่งชั้นตามความจำเป็นของ norm แต่บังเอิญได้โครงที่อ่านง่ายด้วย", lang: "txt" },
      { code: String.raw`int	ft_printf(const char *s, ...)
{
	va_list	args;
	int		length;
	int		i;

	length = 0;
	i = 0;
	va_start(args, s);
	while (s[i])
	{
		if (s[i] == '%')
		{
			i++;
			length += ft_check(&args, s[i]);   /* ★ ส่ง &args ไม่ใช่ args */
		}
		else
			length += ft_putchar(s[i]);
		i++;
	}
	va_end(args);
	return (length);
}`, cap: "โค้ดจริง — `va_start` / `va_end` ต้องจับคู่กันเสมอในฟังก์ชันเดียวกัน", lang: "c" },
      { p: "**ทำไมส่ง** `va_list *` **ไม่ส่ง** `va_list`: ในบางสถาปัตยกรรม `va_list` ถูกนิยามเป็นชนิดอาเรย์ — ส่ง by value แล้วพฤติกรรมไม่แน่นอน (บางที่แชร์สถานะ บางที่ก๊อป). ส่ง address ไปให้แน่ ๆ ว่าทุกชั้นเดินหน้าตัวเดียวกัน" },
      { table: { head: ["specifier", "`va_arg` อ่านชนิด", "พิมพ์ยังไง"], rows: [
        ["`%c`", "`int`", "1 ตัวอักษร (char ถูกขยายเป็น int ตั้งแต่ตอนส่ง)"],
        ["`%s`", "`char *`", "สตริง · **NULL ต้องพิมพ์ `(null)` ไม่ใช่ crash**"],
        ["`%d` `%i`", "`int`", "ฐาน 10 มีเครื่องหมาย"],
        ["`%u`", "`unsigned int`", "ฐาน 10 ไม่มีเครื่องหมาย"],
        ["`%x` / `%X`", "`unsigned int`", "ฐาน 16 พิมพ์เล็ก / พิมพ์ใหญ่"],
        ["`%p`", "address", "`0x` + ฐาน 16 พิมพ์เล็ก"],
        ["`%%`", "—", "`%` 1 ตัว และ **นับรวมในค่าที่คืน**"],
      ]}},
      { note: "`%c` อ่านเป็น `int` เพราะกฎ default argument promotion — `char` ที่ส่งผ่าน `...` ถูกขยายเป็น `int` ไปแล้วตั้งแต่ฝั่งผู้เรียก. เขียน `va_arg(*args, char)` เป็น undefined behaviour" },

      { h: "get_next_line — ทั้งข้ออยู่ที่ 'stash'" },
      { p: "`get_next_line(fd)` คืนบรรทัดถัดไป **รวม `\\n`** หรือ NULL เมื่อจบไฟล์/ผิดพลาด. ปัญหาคือ `read` อ่านมาทีละ `BUFFER_SIZE` ไบต์ซึ่งไม่ตรงกับความยาวบรรทัด — ส่วนที่อ่านเกินมาต้องเก็บไว้รอเรียกครั้งหน้า. ส่วนที่เก็บไว้นั้นเรียกว่า **stash**" },
      { table: { head: ["ฟังก์ชัน", "หน้าที่เดียวของมัน"], rows: [
        ["`read_and_store(fd, stash)`", "อ่านทีละ `BUFFER_SIZE` แล้วต่อเข้า stash จนกว่าจะเจอ `\\n` หรือ `read` คืน 0"],
        ["`extract_line(stash)`", "ก๊อปบรรทัดแรก (รวม `\\n`) ออกมาเป็นก้อนใหม่"],
        ["`update_stash(stash)`", "สร้าง stash ใหม่ที่เก็บเฉพาะส่วนหลัง `\\n` · free ตัวเก่า · คืน NULL ถ้าไม่เหลืออะไร"],
        ["`get_next_line(fd)`", "หา node ของ fd นี้ เรียก 3 ตัวบนตามลำดับ แล้วปลด node ทิ้งเมื่อ stash หมด"],
      ]}},
      { code: String.raw`char	*read_and_store(int fd, char *stash)
{
	char		*buf;
	ssize_t		br;
	char		*tmp;

	buf = (char *)malloc(BUFFER_SIZE + 1);
	if (!buf)
		return (NULL);
	br = 1;
	while ((stash == NULL || !ft_strchr(stash, '\n')) && br > 0)
	{
		br = read(fd, buf, BUFFER_SIZE);
		if (br == -1)
			return (free(buf), free(stash), NULL);
		buf[br] = '\0';
		if (br > 0)
		{
			tmp = ft_strjoin(stash, buf);
			free(stash);
			stash = tmp;
			if (!stash)
				return (free(buf), NULL);
		}
	}
	free(buf);
	return (stash);
}`, cap: "โค้ดจริง — เงื่อนไขวนลูปคือ 'ยังไม่เจอ newline **และ** ยังอ่านได้อยู่'", lang: "c" },
      { p: "**`ft_strjoin(stash, buf)` ตอน stash เป็น NULL:** รอบแรก stash ยังไม่มีค่า — `ft_strjoin` ของเราคืน `ft_strdup(buf)` ให้เมื่ออีกฝั่งเป็น NULL จึงทำงานได้เลยโดยไม่ต้องมีเงื่อนไขพิเศษ. **นี่คือเหตุผลที่ `ft_strjoin` ต้องนิยาม NULL ให้ชัดตั้งแต่แรก**" },
    ],

    architecture: [
      { h: "โครงไฟล์" },
      { code: String.raw`libft/
  libft.h                   ประกาศทุกอย่าง รวม ft_printf กับ get_next_line ท้ายไฟล์
  Makefile                  all clean fclean re bonus

  ft_isalpha.c … ft_putnbr_fd.c        34 ไฟล์มาตรฐาน (1 ฟังก์ชัน 1 ไฟล์)
  ft_lst*_bonus.c                      9 ไฟล์ bonus
  ft_printf.c  ft_printf_utils.c  ft_printf.h
  get_next_line.c  get_next_line_utils.c  get_next_line.h

ผลลัพธ์:  libft.a  ← ไฟล์เดียวที่โปรเจกต์อื่นลิงก์`, cap: "1 ฟังก์ชัน 1 ไฟล์คือรูปแบบที่ subject กำหนด (ยกเว้นฟังก์ชันช่วยภายในไฟล์เดียวกัน)", lang: "txt" },

      { h: "ทำไมรวม ft_printf กับ get_next_line เข้ามาใน libft" },
      { code: String.raw`แบบแยก 3 archive:                     แบบรวม (ที่ใช้ในโปรเจกต์นี้):

  cc main.c libft.a \                   cc main.c libft.a
        ft_printf.a gnl.a
                                        #include "libft.h"   ← ได้ครบทุกอย่าง
  ต้องจำว่าโปรเจกต์ไหนต้องลิงก์อะไรบ้าง

get_next_line.h:
    # include "libft.h"                 ← ไม่ include <stdlib.h> / <unistd.h> ซ้ำ
    ft_strlen / ft_strchr / ft_strjoin  ← ใช้ของ libft ตรง ๆ ไม่เขียนซ้ำ

libft.h (ท้ายไฟล์):
    int    ft_printf(const char *s, ...);
    char   *get_next_line(int fd);`, cap: "get_next_line ต้องการ strjoin/strchr/strlen อยู่แล้ว — รวมเข้ามาจึงประหยัดโค้ดซ้ำไปด้วย", lang: "c" },

      { h: "Makefile — ประกอบชื่อไฟล์จากรายการ" },
      { code: String.raw`SRC     := isalpha isdigit ... putnbr_fd
SRC_B   := lstnew lstadd_front ... lstmap
SRC_PF  := printf printf_utils
GNL     := get_next_line.c get_next_line_utils.c

FILES    := $(addprefix ft_, $(addsuffix .c, $(SRC)))
FILES_B  := $(addsuffix .c, $(addprefix ft_, $(addsuffix _bonus, $(SRC_B))))
FILES_PF := $(addprefix ft_, $(addsuffix .c, $(SRC_PF)))`, cap: "เขียนชื่อฟังก์ชันล้วน ๆ แล้วให้ make เติม `ft_` กับ `.c` ให้ — เพิ่มฟังก์ชันใหม่แก้คำเดียว", lang: "make" },
      { table: { head: ["เป้าหมาย", "ต้องทำอะไร"], rows: [
        ["`all`", "สร้าง `libft.a` (ไม่รวม bonus)"],
        ["`bonus`", "คอมไพล์ไฟล์ `_bonus.c` เพิ่มเข้าไปใน archive เดิม"],
        ["`clean`", "ลบ `.o`"],
        ["`fclean`", "ลบ `.o` และ `libft.a`"],
        ["`re`", "`fclean` แล้ว `all`"],
      ]}},
      { note: "**ต้องไม่ relink** — สั่ง `make` 2 ครั้งติดกันครั้งที่ 2 ต้องขึ้น *Nothing to be done*. และ `.o` ต้องขึ้นกับ `libft.h` ด้วย ไม่งั้นแก้ header แล้วไม่ได้คอมไพล์ใหม่" },

      { h: "libft ในโปรเจกต์อื่น — สำเนาแยกโดยตั้งใจ" },
      { p: "ในเวิร์กสเปซนี้มี `libft/` อยู่ **8 ชุด** (push_swap, pipex, minitalk, fdf, so_long, cub3d, miniRT, minishell) — เป็นเรื่องปกติและจำเป็น เพราะแต่ละโปรเจกต์ต้องคอมไพล์ได้ด้วยตัวเองจากโฟลเดอร์ของมันเอง" },
      { note: "**ผลข้างเคียงที่ต้องระวัง:** แก้บั๊กในสำเนาหนึ่งแล้วอีก 7 ชุดไม่ได้แก้ตาม. เวลาแก้ฟังก์ชันที่ใช้ร่วมกัน ให้ก๊อปไฟล์นั้นไปทับทุกโปรเจกต์ที่ใช้ หรือจดไว้ว่าชุดไหนเป็นตัวหลัก" },
    ],

    dataflow: [
      { h: "get_next_line — ไล่ทีละรอบด้วย BUFFER_SIZE = 5" },
      { code: String.raw`ไฟล์:  "Hello\nWorld\n"

รอบที่ 1  get_next_line(fd)
    stash = NULL
    read → "Hello"      stash = "Hello"        ยังไม่มี \n → อ่านต่อ
    read → "\nWorl"     stash = "Hello\nWorl"  เจอ \n → หยุด
    extract_line   →  "Hello\n"     ← คืนออกไป
    update_stash   →  "Worl"        ← เก็บไว้ใน node

รอบที่ 2  get_next_line(fd)
    stash = "Worl"                            ยังไม่มี \n → อ่านต่อ
    read → "d\n"        stash = "World\n"     เจอ \n → หยุด
    extract_line   →  "World\n"    ← คืนออกไป
    update_stash   →  NULL (ไม่เหลืออะไรหลัง \n) → ปลด node ทิ้ง

รอบที่ 3  get_next_line(fd)
    node ใหม่ stash = NULL
    read → 0 (EOF)      stash ยังเป็น NULL
    extract_line(NULL) →  NULL    ← คืน NULL = จบไฟล์`, cap: "หัวใจคือ 'อ่านเกินมาเท่าไหร่ก็เก็บไว้' — ไม่มีการ seek กลับ ไม่มีการอ่านซ้ำ", lang: "txt" },

      { h: "หลายไฟล์พร้อมกัน — ลิสต์ของ node แทน static ตัวเดียว" },
      { code: String.raw`typedef struct s_gnl_node
{
	int					fd;
	char				*buf;      /* stash ของ fd นี้ */
	struct s_gnl_node	*next;
}	t_gnl_node;

char	*get_next_line(int fd)
{
	static t_gnl_node	*files;    /* ★ static ตัวเดียว เก็บทุก fd */
	t_gnl_node			*node;
	char				*line;

	if (fd < 0 || fd >= FD_MAX || BUFFER_SIZE <= 0)
		return (NULL);
	node = find_fd_node(&files, fd);
	if (!node)
		return (NULL);
	node->buf = read_and_store(fd, node->buf);
	if (!node->buf)
		return (remove_fd_node(&files, fd), NULL);
	line = extract_line(node->buf);
	node->buf = update_stash(node->buf);
	if (!node->buf)
		remove_fd_node(&files, fd);        /* ★ stash หมด → คืนหน่วยความจำทันที */
	return (line);
}`, cap: "โค้ดจริง — ปลด node ทันทีที่ stash ว่าง ทำให้อ่านไฟล์จนจบแล้วไม่เหลืออะไรค้าง", lang: "c" },
      { p: "**ทำไมไม่ใช้** `static char *stash[FD_MAX];`: ใช้ได้และง่ายกว่า แต่จองอาเรย์ 1024 ช่องไว้ตั้งแต่แรกแม้จะเปิดไฟล์เดียว. แบบลิสต์จองเฉพาะ fd ที่ใช้จริง — และเพราะปลด node เมื่อ stash หมด **valgrind จึงสะอาดโดยที่ subject ไม่เคยให้ฟังก์ชัน 'เก็บกวาดตอนจบ' มาเลย**" },
      { table: { head: ["อาการ", "สาเหตุ"], rows: [
        ["บรรทัดสุดท้ายหายเมื่อไฟล์ไม่ลงท้ายด้วย `\\n`", "`extract_line` บังคับว่าต้องมี `\\n` — ต้องคืนส่วนที่เหลือตอน EOF ด้วย"],
        ["คืนบรรทัดเดิมซ้ำไม่รู้จบ", "`update_stash` ไม่ได้ข้าม `\\n` หรือผลลัพธ์ไม่ได้เก็บกลับเข้า node"],
        ["valgrind ฟ้อง leak ตอนจบ", "ไม่ได้ปลด node ตอน stash หมด หรือ `read_and_store` ทำ stash หายตอน `ft_strjoin` ล้มเหลว"],
        ["2 fd อ่านสลับกันแล้วข้อความปนกัน", "ใช้ static ตัวเดียวร่วมกันแทนที่จะแยกตาม fd"],
        ["วนไม่จบเมื่อ `BUFFER_SIZE=0`", "ไม่มีเงื่อนไขกัน `BUFFER_SIZE <= 0`"],
        ["ค้างเมื่ออ่านจาก stdin", "**ถูกต้องแล้ว** — `read` บน terminal รอจนกว่าจะมีอินพุต ทดสอบด้วย pipe แทน"],
      ]}},
      { note: "`BUFFER_SIZE` มาจากบรรทัดคอมไพล์ (`-D BUFFER_SIZE=42`) — header จึงต้องมีค่าเริ่มต้นใต้ `#ifndef` และโค้ดต้องทำงานถูกทั้งที่ 1, 42 และ 9999" },
    ],

    implementation: [
      { h: "ลำดับการลงมือเขียน" },
      { ul: [
        "1. **กลุ่มตรวจตัวอักษร** — 7 ตัว ง่ายที่สุด ได้ตั้งโครงไฟล์กับ Makefile ไปพร้อมกัน",
        "2. **กลุ่มหน่วยความจำ** — `memset` `bzero` `memcpy` ก่อน แล้วค่อย `memmove` (ที่เรียก `memcpy` ต่อ) แล้วปิดท้ายด้วย `calloc` (ที่เรียก `bzero`)",
        "3. **กลุ่มสตริงพื้นฐาน** — `strlen` มาก่อน เพราะเกือบทุกตัวที่เหลือเรียกใช้",
        "4. **กลุ่มที่จอง** — `substr` ก่อน (`split` เรียกมัน), แล้ว `strjoin` (`gnl` เรียกมัน), แล้ว `strtrim` `itoa` `split`",
        "5. **bonus `t_list`** — `lstnew` `lstadd_*` `lstsize` `lstlast` ก่อน แล้วค่อย `lstdelone` `lstclear` `lstiter` `lstmap`",
        "6. **ft_printf** — `ft_putchar`/`ft_putstr` ที่นับจำนวนก่อน แล้วค่อยไล่ชั้น dispatch",
        "7. **get_next_line** — ต้องมี `strlen` `strchr` `strjoin` `strlcpy` ครบก่อน",
      ]},
      { h: "อาการพัง → สาเหตุ" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้"], rows: [
        ["`ft_memmove` ให้ผลเพี้ยนเมื่อพื้นที่ทับกัน", "ก๊อปทิศทางเดียวเสมอ", "`src > dst` ไปหน้า · ไม่งั้นถอยหลัง"],
        ["tester ฟ้องค่าคืนของ `strlcpy`/`strlcat`", "คืนจำนวนที่ก๊อปสำเร็จ", "คืนความยาวที่ *ตั้งใจ* จะสร้าง"],
        ["`ft_calloc` ทำให้ heap พัง", "`count * size` ล้น", "เช็คทั้ง 2 ตัวและผลคูณก่อนจอง"],
        ["`ft_itoa(INT_MIN)` ผิดหรือ crash", "`-n` ล้น `int`", "ก๊อปเป็น `long` ก่อนกลับเครื่องหมาย"],
        ["`ft_split` รั่วเมื่อ malloc ล้มเหลว", "ไม่ได้เก็บกวาดคำที่จองไปแล้ว", "`free` ทุกคำ + อาเรย์ แล้วคืน NULL"],
        ["`ft_split(\"   \", ' ')` ให้อาเรย์แปลก ๆ", "`count_word` นับคำว่างเป็นคำ", "ข้ามตัวคั่นก่อนแล้วเช็คว่ายังมีตัวอักษรเหลือ"],
        ["ผู้เรียกวน `ft_split` ไม่จบ", "ไม่มี NULL ปิดท้าย", "`*arr = NULL;` หลังเติมคำสุดท้าย"],
        ["`ft_lstclear` แล้วยังใช้ลิสต์ได้", "ไม่ได้ตั้ง `*lst = NULL`", "ตั้งก่อน return"],
        ["`ft_printf` คืนจำนวนผิด", "ไม่ได้นับตัวที่ `%%` หรือ `(null)` พิมพ์ออกไป", "ทุกชั้นต้องคืนจำนวนจริงที่เขียน"],
        ["`ft_printf(\"%s\", NULL)` crash", "ไม่ได้เช็ค NULL", "พิมพ์ `(null)` แล้วนับ 6 ตัว"],
        ["`get_next_line` ทำบรรทัดสุดท้ายหาย", "ยึดว่าต้องมี `\\n`", "ตอน EOF ต้องคืนส่วนที่เหลือด้วย"],
        ["norminette ฟ้องทั้งที่โค้ดดูถูก", "ประกาศตัวแปรกลางบล็อก / มี `for` / มี ternary / บรรทัดเกิน 80", "รัน `norminette` ทุกครั้งก่อน commit"],
      ]}},
      { h: "build / test" },
      { code: String.raw`make re && make            # ครั้งที่ 2 ต้องขึ้น "Nothing to be done"
make bonus
norminette *.c *.h          # ต้อง 0 error

# ไดรเวอร์เทียบกับ libc: พิมพ์ทั้งผลลัพธ์และค่าที่คืน ของทั้ง 2 ฝั่ง
cc -Wall -Wextra -Werror main_test.c libft.a -o test && ./test

# ft_printf: diff กับ printf จริงทั้ง output และค่าที่คืน
./printf_test > mine.txt && ./printf_ref > ref.txt && diff mine.txt ref.txt

# get_next_line: BUFFER_SIZE ต่าง ๆ
for b in 1 5 42 9999; do
    cc -Wall -Wextra -Werror -D BUFFER_SIZE=$b gnl_test.c libft.a -o gnl && ./gnl
done

# valgrind ทุกไดรเวอร์
valgrind --leak-check=full --error-exitcode=42 -q ./test && echo "ผ่าน"

# บน Windows ผ่าน WSL
wsl --exec bash -lc 'cd /mnt/d/Projects/42/push_swap/libft && make re && norminette *.c *.h'`, lang: "bash" },
      { note: "**เทียบกับ libc ทั้งผลลัพธ์และค่าที่คืน** — ฟังก์ชันที่พังบ่อยที่สุด (`strlcpy`, `strlcat`) พังที่ค่าคืนไม่ใช่ที่เนื้อหาในบัฟเฟอร์ ดูแค่ output จะไม่เห็นเลย" },
    ],

    tricks: [
      { h: "ทริค 1: แยกให้ออกก่อนว่าใครเป็นเจ้าของ pointer" },
      { p: "จดไว้ 3 กลุ่ม — 'คืนของที่ต้อง free', 'คืน pointer ที่ห้าม free', 'เขียนลงบัฟเฟอร์ผู้เรียก'. รู้ตั้งแต่ก่อนเขียนแล้วเรื่อง leak กับ double free แทบหายไปเอง" },
      { h: "ทริค 2: เขียนตามลำดับที่พึ่งพากัน" },
      { p: "`strlen` ก่อนทุกอย่าง · `substr` ก่อน `split` · `strjoin` ก่อน `get_next_line` · `memcpy` ก่อน `memmove` · `bzero` ก่อน `calloc`. เขียนตามลำดับนี้แล้วจะไม่มีจังหวะที่ต้องเขียนโค้ดชั่วคราวไว้รอ" },
      { h: "ทริค 3: เทียบค่าที่คืนเสมอ ไม่ใช่แค่ผลลัพธ์" },
      { p: "`ft_strlcat` ที่ก๊อปถูกแต่คืนผิดจะผ่านสายตาแต่ไม่ผ่าน tester — และจะไปโผล่เป็นบัฟเฟอร์ล้นในโปรเจกต์อื่นอีกหลายเดือนต่อมา" },
      { h: "ทริค 4: ขยายเป็น `long` ทุกครั้งที่จะกลับเครื่องหมาย" },
      { p: "`-n` บน `int` ล้นได้เสมอเมื่อ `n` เป็น `INT_MIN` — นิสัยนี้ใช้ได้ยาวไปถึง `ft_atoi` ของ push_swap และตัวแปลง argument ของทุกโปรเจกต์" },
      { h: "ทริค 5: นับก่อนจอง" },
      { p: "`ft_split` เดิน 2 รอบเพื่อ `malloc` ครั้งเดียว. เป็นรูปแบบเดียวกับที่ใช้ตอนสร้างอาเรย์ใน pipex กับ minishell — เดินเพิ่มหนึ่งรอบถูกกว่าการจัดการหน่วยความจำที่โตทีละก้อนเสมอ" },
      { h: "ทริค 6: ทำ `ft_putchar` ให้คืนจำนวนตั้งแต่แรก" },
      { p: "ตอนเขียน `ft_printf` ทุกชั้นต้องบวกจำนวนที่เขียนสะสม — ถ้าฟังก์ชันพิมพ์คืน `void` จะต้องกลับมาแก้ทั้งชุด. ให้คืน `int` ตั้งแต่ตัวแรก" },
      { h: "ทริค 7: เทส get_next_line ด้วย `BUFFER_SIZE` สุดขั้ว" },
      { p: "`1` บังคับให้ทุกบรรทัดผ่านลูปอ่านหลายรอบ · `9999` บังคับให้อ่านทั้งไฟล์มาในรอบเดียวแล้วทดสอบ stash หนัก ๆ. 2 ค่านี้จับบั๊กได้เกือบทุกตัวที่ค่ากลาง ๆ ไม่จับ" },
      { h: "ทริค 8: แก้บั๊กแล้วก๊อปไปทุกสำเนา" },
      { p: "เวิร์กสเปซนี้มี `libft/` 8 ชุด — แก้ชุดเดียวแล้วลืมชุดอื่นคือบั๊กที่กลับมาหลอกในโปรเจกต์ถัดไป. `cp` ไฟล์นั้นไปทับทุกโฟลเดอร์ทันทีที่แก้เสร็จ" },
    ],

    eval: [
      { qa: [
        { q: "libft คืออะไร ทำไมต้องทำ?", a: "เป็นการเขียนฟังก์ชันมาตรฐาน C ขึ้นใหม่แล้วรวมเป็น `libft.a` ที่ทุกโปรเจกต์หลังจากนี้ลิงก์ใช้ — ทั้งเพื่อเข้าใจว่าฟังก์ชันพวกนี้ทำงานยังไง และเพื่อมีเครื่องมือใช้ในโปรเจกต์ที่ห้ามใช้ libc หลายตัว" },
        { q: "`static library` ต่างจาก `shared library` ยังไง?", a: "`.a` ถูกฝังเข้าไปในไบนารีตอนลิงก์ — โปรแกรมรันได้โดยไม่ต้องมีไฟล์ห้องสมุดอยู่ในระบบ. `.so` ถูกโหลดตอนรัน" },
        { q: "`ar rcs` ทำอะไร?", a: "`ar` รวมไฟล์ `.o` เป็น archive — `r` แทรก/แทนที่ไฟล์, `c` สร้างใหม่โดยไม่เตือน, `s` สร้างดัชนีสัญลักษณ์เพื่อให้ linker หาฟังก์ชันเจอ" },
        { q: "`ft_memcpy` กับ `ft_memmove` ต่างกันยังไง?", a: "`memcpy` เป็น undefined behaviour เมื่อพื้นที่ทับกัน; `memmove` ต้องถูกเสมอ โดยเลือกก๊อปไปหน้าหรือถอยหลังตามตำแหน่งของ 2 พื้นที่" },
        { q: "`ft_strlcpy` คืนอะไร ทำไม?", a: "`strlen(src)` เสมอ — คือความยาวที่ *พยายาม* จะสร้าง ไม่ใช่จำนวนที่ก๊อปได้จริง เพื่อให้ผู้เรียกเช็ค `ret >= dstsize` แล้วรู้ว่าถูกตัด" },
        { q: "`ft_calloc` ต่างจาก `malloc` ยังไง?", a: "รับ 2 พารามิเตอร์แล้วคูณกัน (ซึ่งล้นได้ ต้องเช็ค) และรับประกันว่าพื้นที่ที่ได้เป็นศูนย์ทั้งหมด" },
        { q: "`ft_itoa` จัดการ `INT_MIN` ยังไง?", a: "ก๊อปเป็น `long` ก่อนแล้วค่อยกลับเครื่องหมาย — เพราะ `-INT_MIN` ล้นช่วงของ `int`" },
        { q: "`ft_split` ทำงานยังไง?", a: "นับจำนวนคำก่อน จองอาเรย์ขนาด `คำ + 1` (เผื่อ NULL ปิดท้าย) แล้วเดินอีกรอบตัดแต่ละคำด้วย `ft_substr` ใส่เข้าไป" },
        { q: "`ft_split` ถ้า malloc ล้มเหลวกลางทางต้องทำอะไร?", a: "`free` ทุกคำที่จองไปแล้วและอาเรย์ แล้วคืน NULL — ไม่งั้นรั่วทั้งก้อนโดยผู้เรียกไม่มีทางเก็บกวาดได้" },
        { q: "`t_list` เก็บ `void *content` ทำไม?", a: "เพื่อให้ลิสต์เก็บอะไรก็ได้ — libft ไม่ต้องรู้ชนิดของข้อมูล. ผลคือเวลาทำลายต้องให้ผู้เรียกส่งฟังก์ชัน `del` มาบอกวิธี" },
        { q: "ทำไม `ft_lstclear` รับ `t_list **`?", a: "เพื่อเขียน NULL กลับไปยังตัวแปรของผู้เรียก — ไม่งั้นผู้เรียกเหลือ pointer ที่ชี้ node ที่ถูก free แล้ว" },
        { q: "`ft_printf` คืนค่าอะไร?", a: "จำนวนตัวอักษรทั้งหมดที่พิมพ์ออกไป รวมทั้งที่มาจาก `%%` และจาก `(null)` — เหมือน `printf` จริง" },
        { q: "ทำไม `ft_printf` ส่ง `va_list *` ไม่ส่ง `va_list`?", a: "`va_list` อาจถูกนิยามเป็นชนิดอาเรย์ในบางสถาปัตยกรรม ทำให้การส่ง by value มีพฤติกรรมไม่แน่นอน — ส่ง address ทำให้ทุกชั้นเดินหน้า argument ตัวเดียวกันแน่นอน" },
        { q: "`%c` ทำไม `va_arg` อ่านเป็น `int`?", a: "กฎ default argument promotion — `char` ที่ส่งผ่าน `...` ถูกขยายเป็น `int` ตั้งแต่ฝั่งผู้เรียกแล้ว. อ่านเป็น `char` เป็น undefined behaviour" },
        { q: "`get_next_line` ทำงานยังไง?", a: "อ่านทีละ `BUFFER_SIZE` ต่อเข้า stash จนเจอ `\\n` แล้วตัดบรรทัดแรกคืนออกไป ส่วนที่เหลือเก็บไว้ใน stash รอเรียกครั้งหน้า" },
        { q: "`static` ใน `get_next_line` ทำอะไร?", a: "ทำให้ตัวแปรอยู่รอดข้ามการเรียกฟังก์ชัน — stash จึงยังอยู่เมื่อเรียกครั้งถัดไป โดยไม่ต้องให้ผู้เรียกส่งอะไรเข้ามา" },
        { q: "รองรับหลาย fd พร้อมกันยังไง?", a: "เก็บ stash แยกต่อ fd — เวอร์ชันนี้ใช้ static linked list ที่มี node ต่อ fd และปลด node ทิ้งเมื่อ stash ของมันหมด" },
        { q: "`read` คืน 0 กับ -1 ต่างกันยังไง?", a: "`0` คือจบไฟล์ (ปกติ) · `-1` คือผิดพลาด — ต้องเก็บกวาดแล้วคืน NULL ทันที ไม่ใช่ปฏิบัติเหมือน EOF" },
        { q: "ไฟล์ที่ไม่ลงท้ายด้วย `\\n` จัดการยังไง?", a: "รอบสุดท้าย `read` คืน 0 แต่ stash ยังมีข้อความอยู่ — ต้องคืนส่วนที่เหลือนั้นเป็นบรรทัดสุดท้าย แล้วรอบถัดไปค่อยคืน NULL" },
        { q: "`BUFFER_SIZE` มาจากไหน?", a: "จากบรรทัดคอมไพล์ `-D BUFFER_SIZE=n` — header ต้องมีค่าเริ่มต้นใต้ `#ifndef` และโค้ดต้องทำงานถูกทั้งที่ 1 และที่หลายพัน" },
      ]},
      { h: "เช็กลิสต์ก่อนส่ง" },
      { code: String.raw`# 1. build + norm
make re && make          # ครั้งที่ 2 ต้อง "Nothing to be done"
make bonus
norminette *.c *.h       # 0 error

# 2. ไม่มีฟังก์ชันต้องห้าม (ใช้ได้แค่ malloc free write read)
grep -nE '\b(printf|strlen|strcpy|memcpy|calloc|strdup|realloc)\s*\(' *.c \
    | grep -v '^ft_'

# 3. เทียบกับ libc ทั้งผลลัพธ์และค่าที่คืน
#    เน้น: strlcpy/strlcat return, memmove overlap, atoi "  -42abc" และ INT_MIN,
#          substr start เกินท้าย, split "" / "   " / ตัวคั่นล้วน,
#          itoa 0 / INT_MIN / INT_MAX

# 4. ft_printf diff กับ printf จริง (output + return) ทุก specifier
#    รวม %s NULL, %p NULL, %x UINT_MAX, %d INT_MIN

# 5. get_next_line: ไฟล์ว่าง / ไม่มี \n ท้าย / มีแต่ \n / 2 fd สลับกัน / fd ผิด
for b in 1 5 42 9999; do
    cc -Wall -Wextra -Werror -D BUFFER_SIZE=$b gnl_test.c libft.a -o gnl && ./gnl
done

# 6. valgrind สะอาดทุกไดรเวอร์
valgrind --leak-check=full --error-exitcode=42 -q ./test && echo "ผ่าน"

# 7. โฟลเดอร์สะอาด
make fclean`, lang: "bash" },
    ],
  },
});
