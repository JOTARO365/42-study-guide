/* ===================== get_next_line ===================== */
/* window.TEACHING_DATA — อิงจากโค้ดจริงใน push_swap/libft/get_next_line*.c */
window.TEACHING_DATA.unshift({
  id: "get_next_line",
  name: "get_next_line",
  tag: { th: "อ่านไฟล์ทีละบรรทัดด้วย read ที่อ่านทีละก้อน — static storage, การเก็บส่วนที่อ่านเกิน (stash), BUFFER_SIZE ตอนคอมไพล์ และการรองรับหลาย fd พร้อมกัน",
         en: "Read a file one line at a time on top of a block-oriented read — static storage, the leftover stash, a compile-time BUFFER_SIZE, and concurrent file descriptors" },
  accent: "#a29bfe",
  sections: {
    principle: [
      { h: "get_next_line สอนอะไร" },
      { p: "โจทย์คือ `get_next_line(fd)` ที่คืน**บรรทัดถัดไป รวม** `\\n` และคืน NULL เมื่อจบไฟล์. ความยากไม่ได้อยู่ที่การหาบรรทัด — อยู่ที่ `read` **อ่านทีละก้อน แต่บรรทัดยาวไม่เท่าก้อน**" },
      { code: String.raw`ไฟล์:            "Hello\nWorld\n"
BUFFER_SIZE = 5

read ครั้งที่ 1  ได้ "Hello"        ← ยังไม่มี \n เลย
read ครั้งที่ 2  ได้ "\nWorl"       ← เจอ \n แล้ว แต่ติด "Worl" มาด้วย

  ต้องคืน "Hello\n"
  แล้ว "Worl" ล่ะ?
      ★ อ่านมาแล้ว ย้อนกลับไปอ่านใหม่ไม่ได้ (ไม่มี lseek ให้ใช้)
      ★ ทิ้งไม่ได้ เพราะเป็นข้อมูลของบรรทัดถัดไป
      → ต้องเก็บไว้ข้ามการเรียกฟังก์ชัน  =  stash`, cap: "ทั้งโปรเจกต์คือการจัดการ stash ตัวนี้ให้ถูกต้องในทุกกรณี", lang: "txt" },
      { h: "ทำไมถึงย้อนกลับไปอ่านใหม่ไม่ได้" },
      { p: "`read` เลื่อนตำแหน่งการอ่านของ fd ไปข้างหน้าเสมอ — ข้อมูลที่อ่านมาแล้วหายไปจากมุมมองของ fd. `lseek` ย้อนได้แต่ **ไม่อยู่ในฟังก์ชันที่อนุญาต** และใช้กับ pipe หรือ terminal ไม่ได้อยู่ดี. เก็บเองจึงเป็นทางเดียว" },
      { h: "3 อย่างที่ต้องตัดสินใจให้ครบ" },
      { table: { head: ["คำถาม", "คำตอบในเวอร์ชันนี้"], rows: [
        ["เก็บ stash ไว้ที่ไหน", "ตัวแปร `static` ในฟังก์ชัน — อยู่รอดข้ามการเรียก"],
        ["หลาย fd พร้อมกันทำยังไง", "static linked list ที่มี node ต่อ fd"],
        ["เก็บกวาดตอนไหน", "ปลด node ทันทีที่ stash ของ fd นั้นหมด"],
      ]}},
      { h: "กฎเหล็ก" },
      { ul: [
        "ฟังก์ชันภายนอกที่ใช้ได้: `read`, `malloc`, `free` — **ห้าม** `lseek` และห้ามอ่านทั้งไฟล์เข้ามาทีเดียว",
        "**ห้ามใช้ตัวแปร global** — ต้องเป็น `static` ในฟังก์ชันหรือในไฟล์",
        "**norminette ต้องผ่าน** · ส่วนบังคับ 5 ฟังก์ชัน/ไฟล์ และห้ามเกิน 5 ฟังก์ชันในไฟล์เดียว",
        "`BUFFER_SIZE` มาจากบรรทัดคอมไพล์ (`-D BUFFER_SIZE=42`) — ต้องทำงานถูกทุกค่าตั้งแต่ 1 จนถึงหลักหมื่น",
        "**bonus:** ใช้ตัวแปร static ได้ตัวเดียว และต้องรองรับหลาย fd พร้อมกัน",
      ]},
      { note: "ในเวิร์กสเปซนี้โค้ด get_next_line ถูกวางไว้ในโฟลเดอร์ `libft/` เดียวกันและใช้ `ft_strlen` / `ft_strchr` / `ft_strjoin` / `ft_strlcpy` ของ libft ตรง ๆ — **แต่ตอนส่งเป็นคนละโปรเจกต์** และต้องเขียนฟังก์ชันช่วยเหล่านั้นไว้ใน `get_next_line_utils.c` ของตัวเอง" },
      { h: "libft ไม่อยู่ในรายการฟังก์ชันที่อนุญาต" },
      { p: "ต่างจาก ft_printf — get_next_line ส่งแบบ **self-contained**: `ft_strlen` `ft_strchr` `ft_strjoin` ต้องเขียนใหม่ (ตั้งชื่อ `gnl_*`) ไว้ใน `get_next_line_utils.c`. การหยิบของจาก libft มาใช้คือวิธีที่โปรเจกต์นี้ตกเช็กบ่อยที่สุดทั้งที่โค้ดเองถูกต้อง" },
    ],

    theory: [
      { h: "🔬 เจาะลึก A: static ทำอะไรกับตัวแปรในฟังก์ชัน" },
      { p: "ตัวแปรปกติในฟังก์ชันอยู่บน stack และหายไปทันทีที่ฟังก์ชันจบ. `static` ย้ายมันไปอยู่ในพื้นที่ของโปรแกรมที่มีอายุเท่ากับโปรแกรมเอง — **แต่ยังมองเห็นได้เฉพาะในฟังก์ชันนั้น**" },
      { code: String.raw`void f(void)
{
    int         a = 0;      /* บน stack — เกิดใหม่ทุกครั้งที่เรียก */
    static int  b = 0;      /* ★ ตั้งค่าครั้งเดียวตอนโปรแกรมเริ่ม */

    a++;  b++;
    printf("%d %d\n", a, b);
}

f();  →  1 1
f();  →  1 2        ← a รีเซ็ต, b จำได้
f();  →  1 3

  static  =  อายุเท่าโปรแกรม (storage duration)
             แต่ขอบเขตการมองเห็นเท่าเดิม (scope)

  ★ ต่างจาก global ตรงที่ไฟล์อื่นหรือฟังก์ชันอื่นแตะไม่ได้เลย
    subject ห้าม global แต่อนุญาต static ด้วยเหตุผลนี้`, cap: "static คือ 'จำได้' โดยไม่ต้องเปิดให้ทั้งโปรแกรมเข้าถึง", lang: "c" },
      { p: "**ค่าเริ่มต้นของ** `static` **คือ 0 หรือ NULL เสมอ** แม้ไม่ได้เขียนไว้ — ต่างจากตัวแปรบน stack ที่เป็นขยะ. โค้ดจึงเขียน `static t_gnl_node *files;` ได้เลยโดยไม่ต้อง `= NULL`" },
      { note: "`static` ที่วางไว้นอกฟังก์ชัน (ระดับไฟล์) มีความหมายต่างออกไป — คือ 'สัญลักษณ์นี้ไม่ให้ไฟล์อื่นเห็น'. คำเดียวกันทำ 2 หน้าที่ตามตำแหน่งที่วาง" },
      { qa: [
        { q: "`static` ในฟังก์ชันทำอะไร?", a: "ทำให้ตัวแปรมีอายุเท่ากับโปรแกรม (ค่าคงอยู่ข้ามการเรียก) แต่ยังมองเห็นได้เฉพาะในฟังก์ชันนั้น" },
        { q: "ทำไม subject ห้าม global แต่อนุญาต `static`?", a: "เพราะ `static` ให้ 'ความจำ' โดยไม่เปิดให้ส่วนอื่นของโปรแกรมเข้าถึงหรือแก้ได้ — เป็นสถานะที่ควบคุมได้ ไม่ใช่สถานะที่ใครก็แตะได้" },
        { q: "`static` ที่ไม่ได้ตั้งค่าเริ่มต้นมีค่าอะไร?", a: "0 (หรือ NULL สำหรับ pointer) เสมอ — ต่างจากตัวแปรบน stack ที่เป็นค่าขยะ" },
      ]},

      { h: "🔬 เจาะลึก B: read คืนอะไรได้บ้าง — 3 กรณีที่ต้องแยก" },
      { code: String.raw`ssize_t br = read(fd, buf, BUFFER_SIZE);

  br > 0    อ่านได้ br ไบต์
            ★ อาจน้อยกว่า BUFFER_SIZE แม้ไฟล์ยังไม่จบ (pipe, terminal, socket)
            → ห้ามสรุปว่า "ได้น้อยกว่าที่ขอ = จบไฟล์"

  br == 0   จบไฟล์ (EOF) — ปกติ ไม่ใช่ error

  br == -1  ผิดพลาด (fd ไม่ถูกต้อง, ถูกปิด, ไม่มีสิทธิ์)
            ★ ต้องเก็บกวาดแล้วคืน NULL ทันที ไม่ใช่ปฏิบัติเหมือน EOF`, cap: "การรวม 0 กับ -1 เป็นกรณีเดียวคือบั๊กที่โผล่ตอนกรรมการลองส่ง fd ที่ปิดไปแล้ว", lang: "c" },
      { p: "`buf[br] = '\\0'` **คือเหตุผลที่ต้อง** `malloc(BUFFER_SIZE + 1)` — `read` ไม่ปิดท้ายด้วย `\\0` ให้ (มันไม่รู้ว่าเรากำลังอ่านข้อความ) เราต้องปิดเอง จึงต้องมีที่ว่างเกินมา 1 ไบต์" },
      { code: String.raw`char	*read_and_store(int fd, char *stash)
{
	char		*buf;
	ssize_t		br;
	char		*tmp;

	buf = (char *)malloc(BUFFER_SIZE + 1);      /* ★ +1 สำหรับ '\0' */
	if (!buf)
		return (NULL);
	br = 1;
	while ((stash == NULL || !ft_strchr(stash, '\n')) && br > 0)
	{
		br = read(fd, buf, BUFFER_SIZE);
		if (br == -1)
			return (free(buf), free(stash), NULL);   /* ★ error ≠ EOF */
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
}`, cap: "โค้ดจริง — เงื่อนไขลูปคือ 'ยังไม่เจอ newline **และ** ยังอ่านได้อยู่'", lang: "c" },
      { p: "**สำนวน** `free(buf), free(stash), NULL` **ในวงเล็บเดียว** — ใช้ comma operator เพื่อทำหลายอย่างแล้วคืนค่าสุดท้ายในบรรทัดเดียว. เป็นวิธีที่ผ่าน norm 25 บรรทัดโดยไม่ต้องเพิ่มบล็อก" },
      { note: "`ft_strjoin(stash, buf)` ตอน `stash` เป็น NULL ในรอบแรก — เวอร์ชันของ libft ที่ใช้จะคืน `ft_strdup(buf)` ให้ **จึงทำงานได้โดยไม่ต้องมีเงื่อนไขพิเศษ**. ถ้าเขียน `ft_strjoin` เองต้องนิยามพฤติกรรมนี้ให้ตรงกัน" },
      { qa: [
        { q: "`read` คืน 0 กับ -1 ต่างกันยังไง?", a: "`0` คือจบไฟล์ (ปกติ) · `-1` คือผิดพลาด — ต้องเก็บกวาดของที่จองไว้แล้วคืน NULL ทันที ไม่ใช่ปฏิบัติเหมือน EOF" },
        { q: "`read` คืนค่าน้อยกว่า `BUFFER_SIZE` แปลว่าจบไฟล์ไหม?", a: "ไม่ — pipe, terminal และ socket คืนเท่าที่มีอยู่ตอนนั้นได้เสมอ. ต้องรอ `0` เท่านั้นถึงจะเป็น EOF" },
        { q: "ทำไม `malloc(BUFFER_SIZE + 1)`?", a: "เพราะ `read` ไม่ปิดท้ายด้วย `\\0` ให้ — ต้องมีที่ว่างอีก 1 ไบต์เพื่อเขียน `buf[br] = '\\0'` เองก่อนเอาไปใช้เป็นสตริง" },
      ]},

      { h: "🔬 เจาะลึก C: วงจรของ stash — 3 ฟังก์ชัน 3 หน้าที่" },
      { code: String.raw`stash ก่อนเรียก:   "Worl"                (เหลือจากรอบก่อน)

  read_and_store    อ่านต่อจนเจอ \n     →  "World\n"
  extract_line      ก๊อปบรรทัดแรกออกมา   →  "World\n"   (ก้อนใหม่ คืนให้ผู้เรียก)
  update_stash      เก็บส่วนหลัง \n      →  NULL        (ไม่เหลืออะไร)

อีกกรณีหนึ่ง:
stash ก่อนเรียก:   NULL

  read_and_store    "Hello" → "Hello\nWorl"
  extract_line                →  "Hello\n"
  update_stash                →  "Worl"     ← เก็บไว้รอบหน้า`, cap: "3 ขั้นนี้เรียงกันเสมอและไม่สลับที่ได้ — extract ต้องมาก่อน update เพราะ update ทำลาย stash เก่า", lang: "txt" },
      { code: String.raw`char	*extract_line(const char *stash)
{
	size_t	i;
	size_t	len;
	char	*line;

	if (!stash || !stash[0])
		return (NULL);                      /* ★ ไม่มีอะไรเหลือ = จบไฟล์ */
	i = 0;
	while (stash[i] && stash[i] != '\n')
		i++;
	len = i + (stash[i] == '\n');           /* ★ รวม \n ถ้ามี */
	line = (char *)malloc(len + 1);
	if (!line)
		return (NULL);
	ft_strlcpy(line, stash, len + 1);
	if (stash[i] == '\n')
		line[i] = '\n';
	line[len] = '\0';
	return (line);
}`, cap: "โค้ดจริง — `len = i + (stash[i] == '\\n')` บวก 1 เมื่อมี newline และบวก 0 เมื่อจบไฟล์กลางบรรทัด", lang: "c" },
      { p: "**บรรทัดสุดท้ายที่ไม่มี** `\\n` **ถูกจัดการตรงนี้** — เงื่อนไข `stash[i] == '\\n'` เป็นเท็จเมื่อวนจนสุดสตริง จึงได้ `len = i` พอดี แล้วคืนส่วนที่เหลือออกไปเป็นบรรทัดสุดท้าย. **ถ้าเขียนแบบบังคับว่าต้องมี** `\\n` **บรรทัดนี้จะหายไปเงียบ ๆ**" },
      { code: String.raw`char	*update_stash(char *stash)
{
	char	*new_s;
	size_t	i;
	size_t	j;

	if (!stash)
		return (NULL);
	i = 0;
	while (stash[i] && stash[i] != '\n')
		i++;
	if (!stash[i])
		return (free(stash), NULL);         /* ★ ไม่มี \n = หมดแล้ว */
	i++;                                     /* ★ ข้าม \n เอง */
	new_s = (char *)malloc(ft_strlen(stash + i) + 1);
	if (!new_s)
		return (free(stash), NULL);
	j = 0;
	while (stash[i])
		new_s[j++] = stash[i++];
	new_s[j] = '\0';
	free(stash);                             /* ★ ทิ้งของเก่าเสมอ */
	return (new_s);
}`, cap: "โค้ดจริง — ทุกทางออกจัดการ `stash` เก่าเรียบร้อย ไม่มีทางที่มันจะค้าง", lang: "c" },
      { note: "`i++` หลังเช็ค `if (!stash[i])` คือจุดที่คนพลาดบ่อยที่สุด — ลืมข้าม `\\n` แล้ว stash ใหม่จะขึ้นต้นด้วย `\\n` ทำให้รอบถัดไปคืนบรรทัดว่างไปเรื่อย ๆ ไม่รู้จบ" },
      { qa: [
        { q: "`extract_line` กับ `update_stash` ต่างกันยังไง?", a: "`extract_line` ก๊อป *บรรทัดแรก* ออกมาเป็นก้อนใหม่ให้ผู้เรียก; `update_stash` สร้าง stash ใหม่ที่เก็บ *ส่วนหลัง `\\n`* แล้วทิ้งของเก่า" },
        { q: "ทำไม `extract_line` ต้องมาก่อน `update_stash`?", a: "เพราะ `update_stash` ปล่อย stash เก่าทิ้ง — ถ้าทำก่อน ข้อมูลของบรรทัดที่จะคืนก็หายไปแล้ว" },
        { q: "บรรทัดสุดท้ายที่ไม่มี `\\n` ถูกคืนยังไง?", a: "`extract_line` คำนวณความยาวเป็น `i + (stash[i] == '\\n')` — เมื่อไม่มี newline เงื่อนไขเป็น 0 จึงคืนส่วนที่เหลือทั้งหมดออกไปตามปกติ" },
        { q: "ลืม `i++` หลังเจอ `\\n` ใน `update_stash` แล้วเกิดอะไร?", a: "stash ใหม่ขึ้นต้นด้วย `\\n` — รอบถัดไป `extract_line` จะคืนบรรทัดที่มีแต่ `\\n` แล้ววนแบบนี้ไม่รู้จบ" },
      ]},

      { h: "🔬 เจาะลึก D: หลาย fd พร้อมกัน — ทำไม static ตัวเดียวไม่พอ" },
      { p: "bonus ให้อ่าน `fd1` สลับกับ `fd2` แล้วต้องได้บรรทัดของแต่ละไฟล์ถูกต้อง. ถ้าใช้ `static char *stash;` ตัวเดียว ข้อมูลของ 2 ไฟล์จะปนกันทันที" },
      { code: String.raw`static char *stash;   ตัวเดียว:

    gnl(fd1)  อ่าน "AAA\nBB"   stash = "BB"      คืน "AAA\n"
    gnl(fd2)  stash ยังเป็น "BB" ของ fd1!
              อ่านต่อจาก fd2 แล้วต่อท้าย → "BBXXX\n"
              ★ คืน "BBXXX\n" — ข้อมูลปนกัน

ทางแก้มี 2 แบบ:

  (ก) อาเรย์:   static char *stash[FD_MAX];    stash[fd]
      + เข้าถึง O(1) · โค้ดสั้น
      − จองพอยน์เตอร์ 1024 ช่องเสมอแม้เปิดไฟล์เดียว
      − ต้องเดา FD_MAX เอง

  (ข) ลิสต์:    static t_gnl_node *files;      find_fd_node(&files, fd)
      + จองเฉพาะ fd ที่ใช้จริง
      + ปลด node เมื่อ stash หมด → valgrind สะอาดเองโดยไม่ต้องมีฟังก์ชันปิดท้าย
      − เข้าถึง O(จำนวน fd ที่เปิดอยู่) — ซึ่งปกติน้อยมาก`, cap: "เวอร์ชันนี้เลือกแบบ (ข) — จุดชี้ขาดคือเรื่องการเก็บกวาด ไม่ใช่ความเร็ว", lang: "c" },
      { code: String.raw`typedef struct s_gnl_node
{
	int					fd;
	char				*buf;      /* stash ของ fd นี้ */
	struct s_gnl_node	*next;
}	t_gnl_node;

t_gnl_node	*find_fd_node(t_gnl_node **lst, int fd)
{
	t_gnl_node	*cur;

	cur = *lst;
	while (cur)
	{
		if (cur->fd == fd)
			return (cur);              /* ★ เจอของเดิม */
		cur = cur->next;
	}
	cur = (t_gnl_node *)malloc(sizeof(t_gnl_node));
	if (!cur)
		return (NULL);
	cur->fd = fd;
	cur->buf = NULL;
	cur->next = *lst;                  /* ★ ต่อหัว — O(1) */
	*lst = cur;
	return (cur);
}`, cap: "โค้ดจริง — หาไม่เจอก็สร้างให้เลย ผู้เรียกจึงไม่ต้องแยกเคส 'fd ใหม่'", lang: "c" },
      { p: "**ต่อหัวไม่ต่อท้าย** เพราะ fd ที่เพิ่งถูกใช้มักถูกใช้ซ้ำทันที — การวางไว้หน้าสุดทำให้รอบถัดไปเจอในก้าวเดียว" },
      { qa: [
        { q: "ทำไม static ตัวเดียวไม่พอสำหรับหลาย fd?", a: "เพราะ stash ที่เหลือจาก fd หนึ่งจะถูกเอาไปต่อกับข้อมูลของอีก fd — ข้อความ 2 ไฟล์ปนกันทันที" },
        { q: "อาเรย์กับลิสต์ต่างกันยังไง?", a: "อาเรย์เข้าถึง O(1) แต่จองพอยน์เตอร์ตาม FD_MAX เสมอและต้องเดาค่านั้นเอง; ลิสต์จองเฉพาะ fd ที่ใช้จริงและปลด node ได้เมื่อเลิกใช้ ทำให้เก็บกวาดง่ายกว่า" },
        { q: "`find_fd_node` หาไม่เจอทำอะไร?", a: "สร้าง node ใหม่ให้เลยแล้วต่อไว้หน้าลิสต์ — ผู้เรียกจึงไม่ต้องแยกเคส fd ที่เพิ่งเปิด" },
      ]},

      { h: "🔬 เจาะลึก E: เก็บกวาดโดยไม่มีฟังก์ชันปิดท้าย" },
      { p: "subject ไม่ได้ให้ `gnl_close()` หรืออะไรทำนองนั้นมา — แต่ valgrind ต้องสะอาด. คำถามคือ **หน่วยความจำที่ค้างอยู่จะถูกปล่อยตอนไหน**" },
      { code: String.raw`char	*get_next_line(int fd)
{
	static t_gnl_node	*files;
	t_gnl_node			*node;
	char				*line;

	if (fd < 0 || fd >= FD_MAX || BUFFER_SIZE <= 0)
		return (NULL);
	node = find_fd_node(&files, fd);
	if (!node)
		return (NULL);
	node->buf = read_and_store(fd, node->buf);
	if (!node->buf)
		return (remove_fd_node(&files, fd), NULL);   /* ★ error/EOF ทันที */
	line = extract_line(node->buf);
	node->buf = update_stash(node->buf);
	if (!node->buf)
		remove_fd_node(&files, fd);                  /* ★ stash หมด = ปลด */
	return (line);
}`, cap: "โค้ดจริง — node ถูกปลดทันทีที่ stash ของมันว่าง จึงไม่มีอะไรค้างหลังอ่านจนจบไฟล์", lang: "c" },
      { code: String.raw`ลำดับการปลดในการอ่านไฟล์ 2 บรรทัดจนจบ:

  เรียกที่ 1   stash = "Worl"     node ยังอยู่
  เรียกที่ 2   stash = NULL       ★ ปลด node ทิ้ง
  เรียกที่ 3   node ใหม่ (buf=NULL) → read คืน 0 → stash ยัง NULL
                                    ★ ปลด node อีกครั้ง → คืน NULL

  จบโปรแกรม:  ลิสต์ว่าง · ไม่มีอะไรค้าง · valgrind สะอาด

★ ถ้าผู้เรียกหยุดอ่านกลางคัน (เช่นอ่าน 1 บรรทัดแล้วเลิก) node จะค้าง
  → นี่คือ leak ที่เทสของกรรมการบางชุดจับ และเป็นข้อจำกัดที่รู้ตัว
  → ทางแก้: เรียก get_next_line ต่อจนได้ NULL หรือเพิ่มฟังก์ชันปิดท้ายเอง`, cap: "การปลด node เมื่อ stash ว่างครอบคลุมกรณีที่อ่านจนจบ ซึ่งเป็นกรณีที่ subject เทส", lang: "txt" },
      { note: "**ข้อจำกัดที่ต้องบอกกรรมการได้:** ถ้าโปรแกรมเลิกอ่าน fd กลางคัน node ของ fd นั้นจะค้างจนจบโปรแกรม. รู้ตัวและอธิบายได้ดีกว่าเถียงว่าไม่มีปัญหา — และถ้าต้องการปิดช่องนี้จริงต้องเพิ่มฟังก์ชันเก็บกวาดที่ subject ไม่ได้กำหนดไว้" },
      { qa: [
        { q: "หน่วยความจำถูกปล่อยตอนไหน?", a: "ทันทีที่ stash ของ fd นั้นหมด — `update_stash` คืน NULL แล้ว `get_next_line` ปลด node ทิ้ง. อ่านไฟล์จนจบจึงไม่เหลืออะไรค้าง" },
        { q: "ถ้าอ่านไม่จบไฟล์แล้วเลิก จะรั่วไหม?", a: "node ของ fd นั้นค้างจนจบโปรแกรม — เป็นข้อจำกัดที่รู้ตัว. แก้ได้ด้วยการอ่านต่อจนได้ NULL หรือเพิ่มฟังก์ชันเก็บกวาดที่ subject ไม่ได้กำหนด" },
      ]},

      { h: "🔬 เจาะลึก F: BUFFER_SIZE — ค่าที่มาจากภายนอกตอนคอมไพล์" },
      { code: String.raw`cc -D BUFFER_SIZE=42 get_next_line.c ...
      ^^^^^^^^^^^^^^^^^^
   เหมือนเขียน  #define BUFFER_SIZE 42  ไว้ต้นไฟล์ทุกไฟล์

ใน header ต้องมีค่าสำรอง:
    # ifndef BUFFER_SIZE
    #  define BUFFER_SIZE 1024
    # endif
        ★ ถ้าไม่มี → คอมไพล์โดยไม่ใส่ -D แล้ว error ทันที

ค่าที่ต้องทำงานได้:
    1       ทุกบรรทัดต้องผ่านลูปอ่านหลายรอบ → จับบั๊กของการต่อ stash
    42      ค่ามาตรฐานที่กรรมการใช้
    9999    อ่านทั้งไฟล์มาในรอบเดียว → stash ยาว หลายบรรทัดค้างพร้อมกัน
    0       ★ ต้องคืน NULL ไม่ใช่วนไม่จบ`, cap: "`BUFFER_SIZE = 0` ทำให้ `read` คืน 0 ทุกครั้งจนวนไม่จบ ถ้าไม่มีเงื่อนไขกันไว้", lang: "c" },
      { p: "**ทำไมต้องเทส 1 กับ 9999:** ที่ค่า 1 ทุกอย่างผ่านเส้นทาง 'อ่านแล้วยังไม่เจอ newline' ซ้ำ ๆ — จับบั๊กของ `ft_strjoin` และการปล่อย stash เก่า. ที่ค่า 9999 stash จะมีหลายบรรทัดอยู่พร้อมกัน — จับบั๊กของ `update_stash` ที่ตัดผิดตำแหน่ง. ค่ากลาง ๆ อย่าง 42 ผ่านทั้ง 2 เส้นทางน้อยเกินกว่าจะจับได้" },
      { note: "การต่อ stash ด้วย `ft_strjoin` ทุกรอบเป็น O(n²) เมื่อบรรทัดยาวมากและ `BUFFER_SIZE` เล็ก — เพราะแต่ละรอบก๊อปสิ่งที่มีอยู่ทั้งหมดใหม่. ยอมรับได้ในโปรเจกต์นี้ แต่ควรรู้ตัวและตอบได้ถ้าถูกถาม" },
      { qa: [
        { q: "`BUFFER_SIZE` มาจากไหน?", a: "จากบรรทัดคอมไพล์ `-D BUFFER_SIZE=n` ซึ่งมีผลเหมือน `#define` ที่ต้นไฟล์ — header จึงต้องมีค่าสำรองใต้ `#ifndef` เผื่อคอมไพล์โดยไม่ใส่" },
        { q: "`BUFFER_SIZE = 0` ต้องได้ผลอะไร?", a: "คืน NULL — ไม่งั้น `read` คืน 0 ทุกครั้งและลูปไม่มีวันจบ" },
        { q: "ทำไมต้องเทสทั้งค่า 1 และค่าใหญ่มาก?", a: "ค่า 1 บังคับให้ทุกบรรทัดผ่านลูปอ่านซ้ำหลายรอบ (จับบั๊กการต่อ stash); ค่าใหญ่ทำให้ stash มีหลายบรรทัดพร้อมกัน (จับบั๊กการตัด). ค่ากลางผ่านทั้ง 2 เส้นทางน้อยเกินไป" },
        { q: "การต่อ stash ทุกรอบมีปัญหาเรื่องประสิทธิภาพไหม?", a: "มี — เป็น O(n²) เมื่อบรรทัดยาวและ `BUFFER_SIZE` เล็ก เพราะแต่ละรอบก๊อปทั้งก้อนใหม่. ยอมรับได้ในขอบเขตของโปรเจกต์แต่ควรรู้ตัว" },
      ]},

      { h: "📖 อ่านเพิ่มเติม" },
      { links: [
        { label: "man 2 read", url: "https://man7.org/linux/man-pages/man2/read.2.html", note: "ความหมายของค่าคืน 0 / -1 และกรณีที่อ่านได้น้อยกว่าที่ขอ" },
        { label: "man 2 open", url: "https://man7.org/linux/man-pages/man2/open.2.html", note: "fd มาจากไหนและมีได้กี่ตัว" },
        { label: "cppreference — Storage duration", url: "https://en.cppreference.com/w/c/language/storage_duration", note: "ความหมายของ `static` ทั้ง 2 แบบ" },
        { label: "man 3 fgets", url: "https://man7.org/linux/man-pages/man3/fgets.3.html", note: "ฟังก์ชันจริงที่แก้ปัญหาเดียวกันด้วยบัฟเฟอร์ของ FILE*" },
      ]},
    ],

    foundations: [
      { h: "4 ฟังก์ชันกับหน้าที่ของแต่ละตัว" },
      { table: { head: ["ฟังก์ชัน", "หน้าที่เดียวของมัน", "จองอะไร"], rows: [
        ["`read_and_store(fd, stash)`", "อ่านทีละ `BUFFER_SIZE` ต่อเข้า stash จนเจอ `\\n` หรือ `read` คืน 0", "`buf` (ปล่อยเอง) + stash ก้อนใหม่ทุกครั้งที่ต่อ"],
        ["`extract_line(stash)`", "ก๊อปบรรทัดแรก (รวม `\\n`) ออกมาเป็นก้อนใหม่", "`line` — **ผู้เรียกต้อง free**"],
        ["`update_stash(stash)`", "สร้าง stash ใหม่ที่เก็บส่วนหลัง `\\n` แล้วทิ้งของเก่า", "stash ก้อนใหม่ (หรือ NULL)"],
        ["`get_next_line(fd)`", "หา node ของ fd เรียก 3 ตัวบน ปลด node เมื่อ stash หมด", "node (ผ่าน `find_fd_node`)"],
      ]}},
      { p: "**ทุกก้อนที่จองมีเจ้าภาพชัดเจน** — `buf` ปล่อยใน `read_and_store` เอง, stash ปล่อยโดยตัวที่สร้างตัวถัดไป, `line` เป็นของผู้เรียก, node ปล่อยโดย `remove_fd_node`. เขียนตารางนี้ก่อนลงมือแล้วเรื่อง leak จบตั้งแต่ยังไม่เขียนโค้ด" },

      { h: "header" },
      { code: String.raw`#ifndef GET_NEXT_LINE_H
# define GET_NEXT_LINE_H

# include "libft.h"          /* ★ ใช้ ft_strlen/ft_strchr/ft_strjoin/ft_strlcpy */
# include <fcntl.h>

# ifndef BUFFER_SIZE
#  define BUFFER_SIZE 1024   /* ★ ค่าสำรองเมื่อไม่ได้ส่ง -D มา */
# endif

# ifndef FD_MAX
#  define FD_MAX 1024
# endif

typedef struct s_gnl_node
{
	int					fd;
	char				*buf;
	struct s_gnl_node	*next;
}	t_gnl_node;

char		*get_next_line(int fd);
t_gnl_node	*find_fd_node(t_gnl_node **lst, int fd);
void		remove_fd_node(t_gnl_node **lst, int fd);

#endif`, cap: "โค้ดจริง — ทั้ง `BUFFER_SIZE` และ `FD_MAX` มีค่าสำรองเพื่อให้คอมไพล์ได้แม้ไม่มี `-D`", lang: "c" },
      { note: "ในโปรเจกต์ที่ส่งจริงต้องเขียน `ft_strlen`/`ft_strchr`/`ft_strjoin` ไว้ใน `get_next_line_utils.c` ของตัวเอง — ที่นี่ include `libft.h` ได้เพราะเวิร์กสเปซรวมโค้ดไว้ที่เดียว" },

      { h: "remove_fd_node — ตัด node ออกจากลิสต์" },
      { code: String.raw`void	remove_fd_node(t_gnl_node **lst, int fd)
{
	t_gnl_node	*prev;
	t_gnl_node	*cur;

	prev = NULL;
	cur = *lst;
	while (cur)
	{
		if (cur->fd == fd)
		{
			if (prev)
				prev->next = cur->next;    /* ★ อยู่กลางลิสต์ */
			else
				*lst = cur->next;          /* ★ เป็นหัวลิสต์ */
			free(cur->buf);
			free(cur);
			return ;
		}
		prev = cur;
		cur = cur->next;
	}
}`, cap: "โค้ดจริง — จำ `prev` ไว้เพราะลิสต์ทางเดียวย้อนกลับไม่ได้", lang: "c" },
      { p: "**รับ `t_gnl_node** `** เพราะเมื่อ node ที่ต้องลบคือหัวลิสต์ ต้องเปลี่ยนค่าตัวหัวของผู้เรียกให้ชี้ตัวถัดไป — เหตุผลเดียวกับ `ft_lstclear` ใน libft" },
      { note: "`free(cur->buf)` ก่อน `free(cur)` — ปล่อย stash ที่อาจยังเหลืออยู่ ไม่งั้นปล่อย node แล้ว pointer ที่ชี้ stash ก็หายไปด้วยและกู้ไม่ได้อีก" },
    ],

    architecture: [
      { h: "โครงไฟล์" },
      { code: String.raw`get_next_line.h            ประกาศ + BUFFER_SIZE สำรอง + t_gnl_node
get_next_line.c            read_and_store · update_stash · extract_line
                           get_next_line                              (4 ตัว)
get_next_line_utils.c      find_fd_node · remove_fd_node
                           (+ ft_strlen ฯลฯ ถ้าไม่ได้ลิงก์ libft)

norm บังคับ 5 ฟังก์ชัน/ไฟล์ → แบ่งแบบนี้พอดี`, cap: "ส่วน bonus ใช้ชื่อไฟล์ลงท้าย `_bonus` ตาม subject", lang: "txt" },

      { h: "ลำดับของ 3 ขั้นใน get_next_line" },
      { code: String.raw`get_next_line(fd)
   │
   ├─ 1. ตรวจอินพุต       fd < 0 · fd >= FD_MAX · BUFFER_SIZE <= 0  →  NULL
   │
   ├─ 2. หา node          find_fd_node(&files, fd)     สร้างให้ถ้ายังไม่มี
   │                        malloc พัง → NULL
   │
   ├─ 3. read_and_store   อ่านจนเจอ \n หรือ EOF
   │                        คืน NULL (error หรือไม่ได้อะไรเลย) → ปลด node, คืน NULL
   │
   ├─ 4. extract_line     ก๊อปบรรทัดแรกออกมา  ← ตัวที่จะคืนให้ผู้เรียก
   │
   ├─ 5. update_stash     เก็บส่วนที่เหลือ
   │                        คืน NULL → ปลด node
   │
   └─ 6. return line

★ ขั้น 4 ต้องมาก่อนขั้น 5 เสมอ — ขั้น 5 ทำลาย stash ที่ขั้น 4 อ่านอยู่`, cap: "ลำดับนี้คือทั้งหมดของฟังก์ชันหลัก — ที่เหลือเป็นรายละเอียดของ 3 ตัวช่วย", lang: "txt" },

      { h: "ทำไมไม่อ่านทั้งไฟล์มาทีเดียว" },
      { table: { head: ["", "อ่านทั้งไฟล์แล้วค่อยตัด", "อ่านทีละก้อน (แบบนี้)"], rows: [
        ["หน่วยความจำ", "เท่าขนาดไฟล์ทั้งก้อน", "เท่า `BUFFER_SIZE` + บรรทัดปัจจุบัน"],
        ["ไฟล์ 10 GB", "จองไม่ไหว", "ทำงานได้ปกติ"],
        ["stdin / pipe", "**ใช้ไม่ได้** — ไม่รู้ว่าจบเมื่อไหร่", "ทำงานได้"],
        ["บรรทัดแรกออกมาเมื่อไหร่", "หลังอ่านครบทั้งไฟล์", "ทันทีที่เจอ `\\n` ตัวแรก"],
        ["subject อนุญาตไหม", "**ไม่** — ระบุห้ามชัดเจน", "ใช่"],
      ]}},
      { p: "**ข้อที่สำคัญที่สุดคือ stdin** — โปรแกรมที่อ่านจาก pipe ต้องประมวลผลได้ทันทีที่มีบรรทัดแรก ไม่ใช่รอจนอีกฝั่งปิดท่อ. นี่คือเหตุผลที่ `get_next_line` ถูกออกแบบให้ทำงานแบบนี้และเป็นสิ่งที่ minishell จะได้ใช้ต่อ" },
    ],

    dataflow: [
      { h: "ไล่ทีละรอบด้วย BUFFER_SIZE = 5" },
      { code: String.raw`ไฟล์:  "Hello\nWorld\n"

รอบที่ 1  get_next_line(fd)
    node ใหม่ stash = NULL
    read → "Hello"      stash = "Hello"        ยังไม่มี \n → อ่านต่อ
    read → "\nWorl"     stash = "Hello\nWorl"  เจอ \n → หยุด
    extract_line   →  "Hello\n"     ← คืนออกไป
    update_stash   →  "Worl"        ← เก็บไว้ใน node

รอบที่ 2  get_next_line(fd)
    stash = "Worl"                            ยังไม่มี \n → อ่านต่อ
    read → "d\n"        stash = "World\n"     เจอ \n → หยุด
    extract_line   →  "World\n"    ← คืนออกไป
    update_stash   →  NULL (ไม่เหลืออะไรหลัง \n) → ★ ปลด node

รอบที่ 3  get_next_line(fd)
    node ใหม่ stash = NULL
    read → 0 (EOF)      stash ยังเป็น NULL
    read_and_store คืน NULL → ★ ปลด node → คืน NULL = จบไฟล์`, cap: "หัวใจคือ 'อ่านเกินมาเท่าไหร่ก็เก็บไว้' — ไม่มีการย้อน ไม่มีการอ่านซ้ำ", lang: "txt" },

      { h: "ไฟล์ที่ไม่ลงท้ายด้วย newline" },
      { code: String.raw`ไฟล์:  "abc"      (ไม่มี \n)

รอบที่ 1
    read → "abc"        stash = "abc"
    read → 0 (EOF)      ออกจากลูปเพราะ br == 0
    read_and_store คืน "abc"           ← ★ ไม่ใช่ NULL เพราะมีข้อมูล
    extract_line("abc")
        วนจนสุด: stash[3] == '\0' ไม่ใช่ '\n'
        len = 3 + 0 = 3                 ← ★ ไม่บวก 1
        คืน "abc"                        ← บรรทัดสุดท้ายไม่มี \n ถูกต้อง
    update_stash("abc")
        ไม่เจอ \n → free แล้วคืน NULL   → ปลด node

รอบที่ 2  → read คืน 0 ทันที → คืน NULL`, cap: "เคสนี้คือที่ implementation ส่วนใหญ่ทำบรรทัดสุดท้ายหาย", lang: "txt" },

      { h: "อ่าน 2 fd สลับกัน" },
      { code: String.raw`fd1 = open("a.txt")     "A1\nA2\n"
fd2 = open("b.txt")     "B1\nB2\n"

get_next_line(fd1)   ลิสต์: [fd1 "A2\n"]                    คืน "A1\n"
get_next_line(fd2)   ลิสต์: [fd2 "B2\n"] → [fd1 "A2\n"]     คืน "B1\n"
get_next_line(fd1)   หา fd1 เจอที่ตัวที่ 2 · stash = "A2\n"  คืน "A2\n"
                     stash หมด → ปลด fd1 → ลิสต์: [fd2 "B2\n"]
get_next_line(fd2)   คืน "B2\n" → ปลด fd2 → ลิสต์ว่าง
get_next_line(fd1)   node ใหม่ → read คืน 0 → คืน NULL

★ แต่ละ fd มี stash ของตัวเอง ไม่มีทางปนกัน`, cap: "node ใหม่ต่อไว้หน้าลิสต์เสมอ — fd ที่ใช้ล่าสุดจึงหาเจอเร็วที่สุด", lang: "txt" },

      { h: "เคสขอบทั้งหมดที่ต้องเทส" },
      { table: { head: ["อินพุต", "ผลที่ถูก"], rows: [
        ["ไฟล์ว่าง (0 ไบต์)", "คืน NULL ทันที"],
        ["ไฟล์ที่มีแต่ `\\n`", "คืน `\"\\n\"` แล้วรอบถัดไปคืน NULL"],
        ["ไฟล์ที่ไม่ลงท้ายด้วย `\\n`", "บรรทัดสุดท้ายต้องออกมาครบ"],
        ["`\\n` ติดกันหลายตัว", "แต่ละตัวเป็น 1 บรรทัด — ไม่ยุบรวม"],
        ["`BUFFER_SIZE=1`", "ผลเหมือนค่าอื่นทุกประการ"],
        ["`BUFFER_SIZE=9999`", "เหมือนกัน — stash ยาวแต่ตัดถูก"],
        ["`BUFFER_SIZE=0`", "คืน NULL ไม่วนไม่จบ"],
        ["`fd = -1`", "คืน NULL"],
        ["fd ที่ปิดไปแล้ว", "`read` คืน -1 → เก็บกวาด → คืน NULL"],
        ["2 fd สลับกัน", "ข้อความของแต่ละไฟล์ถูกต้อง ไม่ปนกัน"],
        ["อ่านจาก stdin ผ่าน pipe", "ทำงานได้ — `echo hi | ./gnl`"],
        ["อ่านจาก terminal โดยตรง", "**รออินพุต — ถูกต้องแล้ว** ไม่ใช่ค้าง"],
      ]}},
      { note: "**เทสด้วย pipe ไม่ใช่ terminal** — `read` บน terminal บล็อกรออินพุตตามธรรมชาติของมัน ซึ่งดูเหมือนโปรแกรมค้างทั้งที่ทำงานถูก" },
    ],

    implementation: [
      { h: "ลำดับการลงมือเขียน" },
      { ul: [
        "1. **ฟังก์ชันช่วยจาก libft** — `ft_strlen` `ft_strchr` `ft_strjoin` `ft_strlcpy` ต้องมีครบก่อน",
        "2. **เวอร์ชัน fd เดียว** — `static char *stash;` ตัวเดียว ทำให้อ่านไฟล์ 1 ไฟล์จนจบให้ถูกก่อน",
        "3. **เคสขอบของ fd เดียว** — ไฟล์ว่าง, ไม่มี `\\n` ท้าย, มีแต่ `\\n`, `BUFFER_SIZE` 1 กับ 9999",
        "4. **ค่อยเปลี่ยนเป็นหลาย fd** — เปลี่ยน `static char *stash` เป็นลิสต์ของ node แล้วเทสสลับ 2 ไฟล์",
        "5. **valgrind ทุกขั้น** ไม่ใช่ตอนท้าย — leak ที่นี่หาง่ายกว่ามากตอนโค้ดยังเล็ก",
      ]},
      { h: "อาการพัง → สาเหตุ" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้"], rows: [
        ["บรรทัดสุดท้ายหายเมื่อไม่มี `\\n` ท้าย", "`extract_line` บังคับว่าต้องเจอ `\\n`", "`len = i + (stash[i] == '\\n')`"],
        ["คืนบรรทัดเดิมซ้ำไม่รู้จบ", "`update_stash` ไม่ได้ข้าม `\\n` (ลืม `i++`)", "`i++` หลังเช็คว่าเจอ `\\n` แล้ว"],
        ["คืนบรรทัดว่างสลับกับบรรทัดจริง", "เหมือนกัน — stash ขึ้นต้นด้วย `\\n`", "เหมือนกัน"],
        ["ผลของ `update_stash` ไม่ถูกเก็บ", "เรียกแล้วไม่ assign กลับ", "`node->buf = update_stash(node->buf);`"],
        ["valgrind ฟ้อง leak ตอนจบ", "ไม่ปลด node เมื่อ stash หมด", "เช็คหลัง `update_stash` แล้วเรียก `remove_fd_node`"],
        ["valgrind ฟ้อง leak ของ `buf`", "`return` กลางลูปโดยไม่ `free(buf)`", "ทุกทางออกต้องปล่อย `buf`"],
        ["2 fd อ่านสลับแล้วข้อความปนกัน", "ใช้ static ตัวเดียวร่วมกัน", "แยก stash ต่อ fd (อาเรย์หรือลิสต์)"],
        ["วนไม่จบเมื่อ `BUFFER_SIZE=0`", "ไม่มีเงื่อนไขกัน", "`if (BUFFER_SIZE <= 0) return (NULL);`"],
        ["crash เมื่อ `BUFFER_SIZE` ใหญ่มาก", "`malloc` ไม่เช็ค NULL", "เช็คทุก `malloc`"],
        ["fd ที่ปิดแล้วทำให้พัง", "รวม `read == -1` เข้ากับ EOF", "แยกกรณี -1 แล้วเก็บกวาด + คืน NULL"],
        ["ค้างเมื่ออ่าน stdin จาก terminal", "**ถูกต้องแล้ว**", "เทสด้วย pipe: `echo hi | ./gnl`"],
        ["norminette ฟ้องจำนวนฟังก์ชัน", "เกิน 5 ตัวใน 1 ไฟล์", "แยกไปที่ `get_next_line_utils.c`"],
      ]}},
      { h: "build / test" },
      { code: String.raw`# เทสหลายค่า BUFFER_SIZE ด้วยลูปเดียว
for b in 1 2 5 42 1024 9999; do
    cc -Wall -Wextra -Werror -D BUFFER_SIZE=$b \
       get_next_line.c get_next_line_utils.c main.c -o gnl || exit 1
    echo "--- BUFFER_SIZE=$b"
    ./gnl test.txt
done

# ไฟล์ทดสอบที่ต้องมี
printf ''                    > empty.txt
printf 'abc'                 > no_newline.txt
printf '\n\n\n'              > only_newlines.txt
printf 'Hello\nWorld\n'      > normal.txt

# เทียบกับ cat ว่าได้เนื้อหาเดิมครบ
./gnl normal.txt | diff - normal.txt && echo "เนื้อหาตรง"

# stdin ผ่าน pipe (ไม่ใช่ terminal)
printf 'a\nb\n' | ./gnl

# valgrind ทุกค่า BUFFER_SIZE
valgrind --leak-check=full --error-exitcode=42 -q ./gnl normal.txt && echo "ผ่าน"

# norminette
norminette get_next_line*.c get_next_line*.h

# บน Windows ผ่าน WSL
wsl --exec bash -lc 'cd /mnt/d/Projects/42/push_swap/libft && norminette get_next_line*.c get_next_line*.h'`, lang: "bash" },
      { note: "`./gnl file | diff - file` เป็นเทสที่ครอบคลุมที่สุดในบรรทัดเดียว — ถ้าต่อทุกบรรทัดที่คืนมาแล้วได้ไฟล์เดิมเป๊ะ แปลว่าไม่มีตัวอักษรหาย ไม่มีตัวซ้ำ และ `\\n` อยู่ครบตำแหน่ง" },
      { h: "ทำให้ join *กลืน* argument ตัวแรก" },
      { p: "การตัดสินใจข้อเดียวนี้ลบพื้นที่ leak ออกไปเกือบหมด: เขียน `gnl_strjoin` ให้ free `s1` **ทั้งสองทาง** — ทั้งตอนสำเร็จและตอนจองไม่ได้ — แล้วคืนสตริงที่ต่อแล้วหรือ NULL" },
      { code: String.raw`char *gnl_strjoin(char *s1, const char *s2)   /* s1 ถูกกลืนเสมอ */
{
    size_t len1 = gnl_strlen(s1);             /* gnl_strlen(NULL) == 0 */
    char *out = malloc(len1 + gnl_strlen(s2) + 1);
    if (!out)
        return (free(s1), NULL);
    ...
    free(s1);
    return (out);
}`, cap: "ไม่มี caller ไหนต้องจำว่า stash เก่ายังใช้ได้อยู่ไหม — ทางพังในลูป read จึงเหลือบรรทัดเดียวและอยู่ใน 25 บรรทัดได้โดยไม่ต้องเพิ่มบล็อก", lang: "c" },
      { p: "สองอย่างที่ต้องทำคู่กัน: ให้ `gnl_strlen(NULL)` คืน 0 และ `gnl_strchr(NULL, c)` คืน NULL — การเรียกครั้งแรกสุด (stash ยังเป็น NULL) จะได้ไม่ต้องมีเคสพิเศษที่ไหนเลย" },
      { h: "bonus: โค้ดเดิม static ตัวเดียว แต่คนละชื่อไฟล์" },
      { code: String.raw`static char *stash;                     /* mandatory */
static char *stash[FD_MAX];             /* bonus — ยังนับเป็น static ตัวเดียว */`, cap: "เปลี่ยนแค่บรรทัดเดียว: ทุก stash กลายเป็น stash[fd] และ guard เพิ่ม fd >= FD_MAX", lang: "c" },
      { note: "subject บังคับให้ bonus อยู่ในไฟล์ของตัวเอง (`get_next_line_bonus.c` / `_utils_bonus.c` / `_bonus.h`) และไฟล์ mandatory ต้องไม่ include header ของ bonus. ถ้าเขียนสคริปต์ generate ไฟล์ bonus จาก mandatory — อย่าลืมจัด banner 42 บรรทัดที่ 4 ให้ยาว 80 คอลัมน์พอดี ไม่งั้น norminette จะตีกลับทุกไฟล์ด้วย LINE_TOO_LONG" },
    ],

    tricks: [
      { h: "ทริค 1: ทำ fd เดียวให้ถูกก่อน แล้วค่อยขยายเป็นหลาย fd" },
      { p: "ตรรกะของ stash กับตรรกะของหลาย fd เป็นคนละเรื่อง — ทำพร้อมกันแล้วจะแยกไม่ออกว่าบั๊กมาจากฝั่งไหน" },
      { h: "ทริค 2: เขียนตารางว่าใครปล่อยอะไรก่อนลงมือ" },
      { p: "`buf` → `read_and_store` · stash → ตัวที่สร้างตัวถัดไป · `line` → ผู้เรียก · node → `remove_fd_node`. 4 บรรทัดนี้ตัดปัญหา leak ไปเกือบทั้งหมด" },
      { h: "ทริค 3: ./gnl file | diff - file" },
      { p: "เทสเดียวที่จับได้ทั้งตัวอักษรหาย ตัวซ้ำ และ `\\n` ผิดตำแหน่ง — ใช้เวลาเขียน 1 บรรทัดและใช้ได้ทุกครั้งที่แก้โค้ด" },
      { h: "ทริค 4: เทส BUFFER_SIZE ด้วยลูป ไม่ใช่ทีละค่า" },
      { p: "`for b in 1 2 5 42 1024 9999` แล้วคอมไพล์ใหม่ทุกรอบ — ค่า 1 กับค่าใหญ่มากคือ 2 ค่าที่จับบั๊กได้จริง ค่ากลางแทบไม่เจออะไร" },
      { h: "ทริค 5: if (!stash[i]) return (free(stash), NULL);" },
      { p: "comma operator ทำให้เก็บกวาดแล้วคืนค่าได้ในบรรทัดเดียว — ผ่าน norm 25 บรรทัดโดยไม่ต้องเพิ่มบล็อกและอ่านง่ายกว่าตัวแปรชั่วคราว" },
      { h: "ทริค 6: อย่าลืม assign ผลของ update_stash กลับ" },
      { p: "`update_stash(node->buf);` เฉย ๆ ทำให้ `node->buf` ยังชี้ของที่ถูก free ไปแล้ว — เป็นบั๊กที่คอมไพเลอร์ไม่เตือนและ valgrind จับได้ทันที" },
      { h: "ทริค 7: เทสด้วย pipe เสมอ" },
      { p: "`printf 'a\\nb\\n' | ./gnl` — เทสจาก terminal โดยตรงจะดูเหมือนโปรแกรมค้าง ทั้งที่ `read` แค่รออินพุตตามปกติ" },
      { h: "ทริค 8: get_next_line จะถูกใช้ต่อในหลายโปรเจกต์" },
      { p: "fdf อ่าน `.fdf` · so_long อ่าน `.ber` · cub3D อ่าน `.cub` · minishell อ่าน heredoc — ทำให้ถูกและสะอาดตั้งแต่ตอนนี้แล้วใช้ยาว" },
      { h: "ทริค 9: ใช้ getline(3) เป็นตัวเทียบ ไม่ใช่แค่ diff" },
      { p: "`./gnl file | diff - file` พิสูจน์ว่า byte ครบ แต่ไม่ได้พิสูจน์ว่า **เส้นแบ่งบรรทัดตกตรงไหน**. การเทียบกับ `getline(3)` ทีละบรรทัดจับกรณีที่บรรทัดถูกตัดเร็วไป 1 ตัวอักษรได้ ซึ่งคืออาการของ off-by-one ใน `update_stash`" },
      { h: "ทริค 10: อย่าใส่ fixture ที่มี \\0 อยู่กลางไฟล์" },
      { p: "subject ปล่อยให้เป็น undefined และ `char *` ที่คืนแทนมันไม่ได้ — เทสจะ 'พัง' บนโค้ดที่ถูกต้อง. อีกเรื่อง: ถ้า fixture อยู่ใน `/tmp` ให้สร้างใหม่ในคำสั่งเดียวกับที่รันเทส เพราะถ้า WSL รีสตาร์ทระหว่างนั้น `/tmp` จะว่างและทุก `open` คืน -1 ซึ่งอ่านเหมือนบั๊กของ gnl — และลูปสลับ fd ที่ลดตัวนับเฉพาะตอน EOF จริงจะวนไม่รู้จบแทนที่จะรายงาน" },
    ],

    eval: [
      { qa: [
        { q: "get_next_line ทำอะไร?", a: "คืนบรรทัดถัดไปจาก fd รวมทั้ง `\\n` (ถ้ามี) และคืน NULL เมื่อจบไฟล์หรือเกิดข้อผิดพลาด — โดยเรียกซ้ำได้เรื่อย ๆ จนหมดไฟล์" },
        { q: "ทำไมต้องมี stash?", a: "เพราะ `read` อ่านทีละ `BUFFER_SIZE` ไบต์ซึ่งไม่ตรงกับความยาวบรรทัด — ส่วนที่อ่านเกินมาย้อนกลับไปอ่านใหม่ไม่ได้ จึงต้องเก็บไว้ข้ามการเรียกฟังก์ชัน" },
        { q: "ทำไมย้อนกลับไปอ่านใหม่ไม่ได้?", a: "`read` เลื่อนตำแหน่งของ fd ไปข้างหน้าเสมอ และ `lseek` ไม่อยู่ในฟังก์ชันที่อนุญาต — อีกทั้งใช้กับ pipe หรือ terminal ไม่ได้อยู่แล้ว" },
        { q: "`static` ทำอะไรและต่างจาก global ยังไง?", a: "ทำให้ตัวแปรมีอายุเท่าโปรแกรมแต่ยังมองเห็นได้เฉพาะในฟังก์ชันนั้น — ต่างจาก global ที่ทั้งโปรแกรมเข้าถึงและแก้ได้ ซึ่ง subject ห้าม" },
        { q: "`read` คืนค่าอะไรได้บ้าง แต่ละค่าหมายถึงอะไร?", a: "มากกว่า 0 = จำนวนไบต์ที่อ่านได้ (อาจน้อยกว่าที่ขอแม้ยังไม่จบไฟล์) · 0 = จบไฟล์ · -1 = ผิดพลาด ต้องเก็บกวาดแล้วคืน NULL" },
        { q: "ทำไมต้อง `malloc(BUFFER_SIZE + 1)`?", a: "เพราะ `read` ไม่ปิดท้ายด้วย `\\0` ให้ — ต้องมีที่ว่างอีก 1 ไบต์เพื่อปิดเองก่อนเอาไปใช้เป็นสตริง" },
        { q: "3 ขั้นในฟังก์ชันหลักคืออะไร เรียงยังไง?", a: "`read_and_store` อ่านจนเจอ `\\n` → `extract_line` ก๊อปบรรทัดแรกออกมา → `update_stash` เก็บส่วนที่เหลือ. ขั้นที่ 2 ต้องมาก่อนขั้นที่ 3 เพราะขั้นที่ 3 ทำลาย stash เก่า" },
        { q: "ไฟล์ที่ไม่ลงท้ายด้วย `\\n` จัดการยังไง?", a: "`extract_line` คำนวณความยาวเป็น `i + (stash[i] == '\\n')` — เมื่อไม่มี newline เงื่อนไขเป็น 0 จึงคืนส่วนที่เหลือทั้งหมดเป็นบรรทัดสุดท้ายตามปกติ" },
        { q: "ทำไมคืนบรรทัดเดิมซ้ำไม่รู้จบ?", a: "`update_stash` ไม่ได้ข้าม `\\n` (ลืม `i++`) ทำให้ stash ใหม่ขึ้นต้นด้วย `\\n` — หรือลืม assign ผลกลับเข้า `node->buf`" },
        { q: "รองรับหลาย fd พร้อมกันยังไง?", a: "แยก stash ต่อ fd — เวอร์ชันนี้ใช้ static linked list ที่มี node ต่อ fd และปลด node ทิ้งเมื่อ stash ของมันหมด" },
        { q: "อาเรย์กับลิสต์แบบไหนดีกว่า?", a: "อาเรย์ (`stash[fd]`) เข้าถึง O(1) แต่จองตาม FD_MAX เสมอและต้องเดาค่านั้น; ลิสต์จองเฉพาะ fd ที่ใช้จริงและปลดคืนได้ — ทำให้ valgrind สะอาดโดยไม่ต้องมีฟังก์ชันปิดท้าย" },
        { q: "หน่วยความจำถูกปล่อยตอนไหน?", a: "ทันทีที่ stash ของ fd นั้นหมด — `update_stash` คืน NULL แล้วฟังก์ชันหลักปลด node ทิ้ง" },
        { q: "ถ้าเลิกอ่านกลางไฟล์จะรั่วไหม?", a: "node ของ fd นั้นค้างจนจบโปรแกรม — เป็นข้อจำกัดที่รู้ตัว แก้ได้ด้วยการอ่านต่อจนได้ NULL หรือเพิ่มฟังก์ชันเก็บกวาดซึ่ง subject ไม่ได้กำหนด" },
        { q: "`BUFFER_SIZE` มาจากไหนและต้องรองรับค่าอะไรบ้าง?", a: "จาก `-D BUFFER_SIZE=n` ตอนคอมไพล์ — header ต้องมีค่าสำรองใต้ `#ifndef`. ต้องทำงานถูกตั้งแต่ 1 ถึงหลักหมื่น และ `0` ต้องคืน NULL ไม่ใช่วนไม่จบ" },
        { q: "ทำไมไม่อ่านทั้งไฟล์เข้ามาทีเดียวแล้วค่อยตัด?", a: "subject ห้าม และใช้ไม่ได้จริง — ไฟล์ใหญ่จองไม่ไหว, stdin/pipe ไม่รู้ว่าจบเมื่อไหร่, และบรรทัดแรกจะออกมาช้าเกินไป" },
        { q: "เทสยังไงว่าถูกต้องจริง?", a: "`./gnl file | diff - file` — ถ้าต่อทุกบรรทัดที่คืนมาแล้วได้ไฟล์เดิมเป๊ะ แปลว่าไม่มีตัวอักษรหาย ไม่มีตัวซ้ำ และ `\\n` อยู่ครบตำแหน่ง" },
        { q: "การต่อ stash ทุกรอบมีปัญหาประสิทธิภาพไหม?", a: "มี — เป็น O(n²) เมื่อบรรทัดยาวและ `BUFFER_SIZE` เล็ก เพราะแต่ละรอบก๊อปทั้งก้อนใหม่. ยอมรับได้ในขอบเขตของโปรเจกต์" },
      ]},
      { h: "เช็กลิสต์ก่อนส่ง" },
      { code: String.raw`# 1. คอมไพล์ผ่านทุกค่า BUFFER_SIZE
for b in 1 2 5 42 1024 9999; do
    cc -Wall -Wextra -Werror -D BUFFER_SIZE=$b \
       get_next_line.c get_next_line_utils.c main.c -o gnl || echo "FAIL $b"
done

# 2. norminette 0 error
norminette get_next_line*.c get_next_line*.h

# 3. ไม่มี global (ต้องเป็น static เท่านั้น) และไม่มี lseek
grep -nE 'lseek' *.c
grep -n 'static' get_next_line*.c        # ต้องอยู่ในฟังก์ชัน

# 4. เนื้อหาครบทุกไฟล์ทดสอบ
for f in empty.txt no_newline.txt only_newlines.txt normal.txt; do
    ./gnl $f | diff - $f > /dev/null && echo "OK $f" || echo "FAIL $f"
done

# 5. หลาย fd สลับกัน · fd = -1 · fd ที่ปิดแล้ว · BUFFER_SIZE=0

# 6. stdin ผ่าน pipe
printf 'a\nb\n' | ./gnl

# 7. valgrind สะอาดทุกค่า BUFFER_SIZE
valgrind --leak-check=full --error-exitcode=42 -q ./gnl normal.txt && echo "ผ่าน"`, lang: "bash" },
    ],
  },
});
