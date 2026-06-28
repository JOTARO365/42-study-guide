/* ============================================================
   data.js — เนื้อหาสื่อการสอน 42 (อิงจากโค้ดจริงของ wiaon-in)
   โครงสร้าง: window.TEACHING_DATA = [ project, ... ]
   แต่ละ project มี sections 5 หมวด: principle / architecture /
   implementation / tricks / eval
   แต่ละ section = array ของ block:
     {h}, {p}, {ul:[]}, {code, cap, lang}, {table:{head,rows}},
     {qa:[{q,a}]}, {note}
   หมายเหตุ: code ใช้ String.raw เพื่อกัน \n ถูกแปลงเป็นบรรทัดใหม่
   ============================================================ */

window.TEACHING_DATA = [
/* ===================== PUSH_SWAP ===================== */
{
  id: "push_swap",
  name: "push_swap",
  tag: { th: "เรียงเลขด้วย 2 stack ให้ใช้คำสั่งน้อยที่สุด — เกมพัซเซิลของสาย algorithm", en: "Sort numbers with 2 stacks in the fewest moves — a puzzle for algorithm lovers" },
  accent: "#5eb0ef",
  sections: {
    principle: [
      { h: "โจทย์คืออะไร" },
      { p: "มี stack **A** (มีเลขทั้งหมดตอนเริ่ม) และ **B** (ว่าง) เป้าหมายคือเรียง A จากน้อยไปมาก โดย **พิมพ์ลำดับคำสั่ง** ออก stdout บรรทัดละ 1 คำสั่ง และใช้ operation ให้ **น้อยที่สุด**" },
      { h: "11 operations (ต้องท่องได้ตอน eval)" },
      { table: { head: ["กลุ่ม", "คำสั่ง", "ผล"], rows: [
        ["swap", "sa / sb / ss", "สลับ 2 ตัวบนสุด (ss = ทำทั้ง A,B พร้อมกัน)"],
        ["push", "pa / pb", "ย้ายตัวบนสุดข้าม stack (pb: A→B, pa: B→A)"],
        ["rotate", "ra / rb / rr", "ตัวบนสุด → ลงล่างสุด"],
        ["rev rotate", "rra / rrb / rrr", "ตัวล่างสุด → ขึ้นบนสุด"],
      ]}},
      { note: "หัวใจ: ss/rr/rrr ทำกับ 2 stack พร้อมกันแต่นับเป็น 1 operation → ถ้าจังหวะดีประหยัดได้ครึ่งหนึ่ง" },
      { h: "เกณฑ์คะแนน" },
      { table: { head: ["จำนวน", "เต็ม 100%", "ผ่าน"], rows: [
        ["100 ตัว", "< 700 ops", "< 1100"],
        ["500 ตัว", "≤ 5500 ops", "< 8500"],
      ]}},
      { h: "2 แนวคิดที่ต้องเข้าใจ" },
      { p: "**(ก) Normalization** — แปลงค่าจริงเป็น 'อันดับ' (rank). เช่น [-999, 0, 42, 1000000] → rank [0,1,2,3] เพราะ algorithm สนใจแค่ว่าใครมากกว่าใคร ทำให้คำนวณตำแหน่งแทรกง่ายและไม่ยุ่งกับ overflow" },
      { p: "**(ข) Cost-based greedy (Turkish sort)** สำหรับ n>5: ดันเกือบทั้งหมดลง B → แต่ละรอบเลือกตัวที่ 'cost ถูกที่สุด' ดันกลับเข้า A → ทำซ้ำจน B ว่าง → หมุนตัวเล็กขึ้นบน" },
      { h: "ที่มาที่ไป: ทำไมโจทย์นี้ต่างจาก sorting ทั่วไป" },
      { p: "sorting ที่เรียนกันทั่วไป (bubble, quick, merge) วัดกันที่ **เวลา (time complexity)** แต่ push_swap วัดที่ **จำนวน operation** ที่พิมพ์ออกมา และเรา **ขยับข้อมูลได้แค่ผ่าน 11 คำสั่งบน 2 stack เท่านั้น** (เข้าถึงตรงกลางไม่ได้, index ไม่ได้) — มันจึงเป็นปัญหา 'เรียงด้วยมือที่ถูกมัด' ที่ต้องคิดเชิงกลยุทธ์ ไม่ใช่แค่ทำให้ถูก" },
      { p: "เป้าหมายจริงคือ 'ทำให้ถูก' (ง่าย) **บวกกับ** 'ใช้ ops ให้น้อยพอผ่านเกณฑ์ <700 / ≤5500' (ยาก) — ตรงนี้แหละที่ต้องเลือก algorithm ให้ดี" },
      { h: "เทียบทางเลือก algorithm (ทำไมถึงเลือก Turkish sort)" },
      { table: { head: ["วิธี", "แนวคิด", "ops ~100 ตัว", "สรุป"], rows: [
        ["Selection (ดัน min ทีละตัว)", "หา min → หมุนขึ้น top → pb วนไป แล้ว pa กลับ", "~900–1500", "เขียนง่ายสุด แต่ ops เยอะเกินเกณฑ์เต็ม (ดูได้จากปุ่มเดโม)"],
        ["Radix / binary sort", "ดูทีละ bit ของ idx แล้ว pb/pa ตาม bit", "~700–1100", "เสถียร แต่ก้ำกึ่งเกณฑ์ และโค้ดยาว"],
        ["Cost-based greedy (Turkish)", "คำนวณ 'ราคา' ของทุกตัวใน B แล้วเลือกตัวถูกสุดแทรกกลับ", "~580", "ผ่านเต็มชัดเจน + คงที่ → เลือกอันนี้"],
      ]}},
      { p: "**เหตุผลที่เลือก Turkish sort:** มันมองการ 'แทรกกลับ' เป็นปัญหาหาค่าน้อยสุด (optimization) แทนที่จะแทรกแบบสุ่ม/ตามลำดับ — แต่ละรอบจึงทำงานที่ 'คุ้มที่สุด' เสมอ ผลคือ ops ต่ำและไม่แกว่ง (ทดสอบ 100 ตัวกี่รอบก็ ~580) ต่างจาก radix ที่ก้ำกึ่ง หรือ selection ที่เกินเกณฑ์" },
      { h: "ทำไมต้อง normalize (ไม่ sort ค่าจริงตรง ๆ)" },
      { p: "ถ้าใช้ค่าจริง การหา 'ตำแหน่งที่ควรแทรก' ต้องเทียบค่าที่กระจายแบบไหนก็ได้ (เช่น -2^31..2^31) และเสี่ยง overflow เวลาคำนวณ. พอแปลงเป็น **อันดับ 0..n-1** ทุกการคำนวณกลายเป็นเลขจำนวนเต็มเล็ก ๆ ที่อยู่ในช่วงรู้แน่ → หา target/cost ด้วยเลขดัชนีล้วน ๆ เขียนง่ายและไม่มีทางพัง" },
      { h: "ทำไมแยกเคสเล็ก (n ≤ 5) ออกมา hardcode" },
      { p: "greedy มี **'ต้นทุนแฝง' (overhead)** (ต้องดันลง B, คำนวณ cost). สำหรับ 2–5 ตัว การคำนวณพวกนี้ไม่คุ้ม — เคสเล็กมีจำนวนรูปแบบจำกัด (3 ตัวมีแค่ 6 แบบ) เราจึง **เขียนตายตัวให้ใช้ ops น้อยที่สุดเท่าที่เป็นไปได้** (3 ตัว ≤ 2 ops) ซึ่งดีกว่าปล่อยให้ greedy จัดการ" },
      { note: "ทำไม rr/rrr ถึงสำคัญต่อการเลือกวิธีนี้: หัวใจที่ทำให้ Turkish sort ชนะคือ 'cost มีทิศทาง' เมื่อ A และ B ต้องหมุนทางเดียวกัน เรารวมเป็น rr/rrr (1 op แทน 2) — ถ้าไม่มีทริคนี้ ops จะพุ่งเกินเกณฑ์ทันที จึงเป็นเหตุผลหลักที่ออกแบบ cost ให้เก็บทิศไว้ด้วย" },
    ],
    theory: [
      { p: "หมวดนี้รวม **ทฤษฎีพื้นฐานที่ต้องเข้าใจก่อน** เพื่อให้อ่านโค้ด push_swap รู้เรื่องจริง ไม่ใช่แค่จำ" },
      { h: "1) Stack (กองซ้อน) — โครงสร้างแบบ LIFO" },
      { p: "Stack คือโครงสร้างข้อมูลที่ **เข้าหลังออกก่อน (LIFO = Last In, First Out)** เปรียบเหมือนกองจานซ้อน: วางจานเพิ่มได้แค่ด้านบน และหยิบได้แค่ใบบนสุด เข้าถึงใบกลาง ๆ ตรง ๆ ไม่ได้" },
      { ul: [
        "**push** = วางของบนยอด, **pop** = หยิบของจากยอด, **peek** = ดูยอดโดยไม่หยิบ — ทุกอย่าง O(1)",
        "push_swap บังคับให้เราทำงานผ่านข้อจำกัดนี้: เข้าถึงได้แค่ 'ยอด' ของ 2 stack เท่านั้น (จึงต้องใช้ rotate เพื่อเอาตัวที่อยากได้ขึ้นมายอด)",
      ]},
      { note: "นี่คือเหตุผลที่โจทย์ยาก: ถ้าเข้าถึงทุก index ได้อิสระ (เหมือน array ปกติ) การเรียงจะ trivial — แต่ stack จำกัดให้แตะได้แค่ยอด" },
      { h: "2) Linked list (รายการโยง)" },
      { p: "วิธีเก็บลำดับข้อมูลมี 2 แบบหลัก:" },
      { table: { head: ["", "Array", "Linked list"], rows: [
        ["การวางในหน่วยความจำ", "ติดกันเป็นแถบเดียว", "กระจัดกระจาย เชื่อมด้วย pointer"],
        ["เข้าถึง index ใด ๆ", "O(1) (คำนวณที่อยู่ได้)", "O(n) (ต้องเดินจากหัว)"],
        ["เพิ่ม/ลบที่หัว", "O(n) (ต้องเลื่อนทุกตัว)", "O(1) (แค่ขยับ pointer)"],
      ]}},
      { p: "push_swap เลือก linked list เพราะ operation หลัก (push/pop/rotate) ทำงานที่ 'หัว/ท้าย' ของ list ซึ่งเป็น O(1) — ไม่ต้องเลื่อนข้อมูลทั้งก้อนเหมือน array" },
      { h: "3) Big-O — การวัดความซับซ้อน" },
      { p: "Big-O บอก 'งานโตขึ้นเท่าไรเมื่อข้อมูล (n) โต' โดยมองที่แนวโน้ม ไม่ใช่เวลานาฬิกาจริง" },
      { table: { head: ["สัญกรณ์", "ความหมาย", "ตัวอย่างในโค้ด"], rows: [
        ["O(1)", "คงที่ ไม่ขึ้นกับ n", "push/pop ของ stack"],
        ["O(n)", "เป็นเส้นตรงตาม n", "เดินหา target ใน A"],
        ["O(n²)", "กำลังสอง", "normalize (เทียบทุกคู่)"],
        ["O(n log n)", "ขอบล่างของ comparison sort", "เป้าหมายที่ดีของ sort"],
      ]}},
      { note: "จุดต่างสำคัญของ push_swap: เราไม่ได้วัด 'เวลา' แต่วัด **จำนวน operation ที่พิมพ์** — algorithm ที่เร็ว (time) อาจพิมพ์ ops เยอะก็แพ้" },
      { h: "4) ขอบล่างของการเรียงด้วยการเทียบ: Ω(n log n)" },
      { p: "ทฤษฎีบทสำคัญ: การเรียงที่ตัดสินด้วย 'การเปรียบเทียบ' (a < b ?) ต้องใช้การเทียบอย่างน้อย ~n·log₂(n) ครั้งในกรณีแย่สุด. เหตุผล (decision tree): ลำดับที่เป็นไปได้มี n! แบบ ต้นไม้ตัดสินใจที่แยกได้ทีละ 2 ทางต้องสูงอย่างน้อย log₂(n!) ≈ n·log₂(n) ชั้น. นี่อธิบายว่าทำไมเกณฑ์ ops ถึงตั้งใกล้ ๆ ค่านี้ (100 ตัว: n·log₂n ≈ 664 → เกณฑ์ < 700)" },
      { h: "5) Greedy algorithm (ละโมบ)" },
      { p: "Greedy = 'แต่ละก้าวเลือกสิ่งที่ดีที่สุดเฉพาะหน้า' โดยหวังว่าผลรวมจะดี. ไม่การันตี optimal เสมอไป แต่ในหลายปัญหาให้ผลใกล้เคียงด้วยความเร็วสูง. push_swap ใช้ greedy เลือก 'ตัวใน B ที่ cost ถูกสุด' ทุกรอบ → ได้ ops ต่ำและคงที่ (≈ optimal เชิงปฏิบัติ)" },
      { h: "6) Rank & Order statistics (ที่มาของ normalize)" },
      { p: "**rank ของค่า = จำนวนสมาชิกที่เล็กกว่ามัน**. การแปลงค่าจริงเป็น rank (0..n-1) คือแนวคิด order statistics — ทำให้การเปรียบเทียบกลายเป็นเลขจำนวนเต็มเล็ก ๆ ที่ต่อเนื่อง คำนวณตำแหน่งง่าย" },
      { h: "7) เลขจำนวนเต็ม & Overflow (two's complement)" },
      { p: "`int` 32-bit เก็บค่าด้วยระบบ **two's complement** ทำให้ช่วงไม่สมมาตร:" },
      { table: { head: ["", "ค่า"], rows: [
        ["INT_MAX", "2147483647 (2³¹−1)"],
        ["INT_MIN", "−2147483648 (−2³¹)"],
      ]}},
      { p: "ค่าลบไปได้ไกลกว่าค่าบวก 1 (เพราะ 0 กินช่องฝั่งบวก). ถ้าบวกเลขเกินขอบ ค่าจะ 'วน' (overflow) เป็นพฤติกรรมไม่นิยาม — push_swap จึงต้องตรวจด้วย `long` ก่อนแล้วเทียบขอบ int เอง" },
      { h: "8) Permutation & combinatorics (ทำไม hardcode 3 ตัวได้)" },
      { p: "การจัดเรียงของ n สิ่งมี n! แบบ — 3 ตัวมีแค่ 3! = 6 แบบ ซึ่งน้อยมากจนเขียนกฎตายตัวครอบคลุมทุกแบบได้ (≤ 2 ops). นี่คือเหตุผลเชิงทฤษฎีที่แยกเคสเล็กออกมา hardcode แทนใช้ greedy" },

      { h: "🔬 เจาะลึก A: นิยาม Big-O อย่างเป็นทางการ" },
      { p: "เรามักใช้ Big-O แบบหลวม ๆ แต่จริง ๆ มันมีนิยามคณิตที่ชัด: เราพูดว่า f(n) = O(g(n)) เมื่อ g เป็น 'เพดาน' ของ f สำหรับ n ใหญ่พอ" },
      { code: String.raw`f(n) = O(g(n))   ก็ต่อเมื่อ
  มีค่าคงที่ c > 0 และ n₀ ที่ทำให้
  0 ≤ f(n) ≤ c·g(n)   สำหรับทุก n ≥ n₀

ตัวอย่าง: f(n) = 3n² + 5n + 2  เป็น O(n²)
  เลือก c = 4, n₀ = 6 :
  3n² + 5n + 2 ≤ 4n²   เมื่อ n ≥ 6  ✓
  (พจน์ 5n+2 ถูกกลืนโดย n² ที่โตเร็วกว่า)`, cap: "Big-O มองเฉพาะ 'พจน์ที่โตเร็วที่สุด' และไม่สนค่าคงที่ — เพราะเมื่อ n ใหญ่ พจน์นั้นครอบงำทั้งหมด", lang: "txt" },
      { p: "มีญาติของมัน: **Ω (โอเมกา)** = ขอบล่าง (อย่างน้อยเท่านี้), **Θ (เธตา)** = ทั้งบนและล่าง (แน่น). เวลาเราพูด 'sort เร็วสุดคือ n log n' จริง ๆ คือพูดถึง Ω(n log n) = ขอบล่างที่หนีไม่พ้น" },

      { h: "🔬 เจาะลึก B: พิสูจน์ว่าทำไม comparison sort ต้องใช้อย่างน้อย ~n·log₂n" },
      { p: "ลองคิดเป็น **ต้นไม้การตัดสินใจ (decision tree)**: ทุกครั้งที่เราถาม 'a < b ?' คำตอบมี 2 ทาง (จริง/เท็จ) = แตกกิ่งเป็น 2. ใบของต้นไม้ = ผลลัพธ์การเรียงที่เป็นไปได้ทั้งหมด ซึ่งมี n! แบบ" },
      { code: String.raw`ต้นไม้ binary ที่มีความสูง h มีใบได้มากสุด 2^h ใบ
ต้องครอบคลุมผลลัพธ์ทั้งหมด → 2^h ≥ n!
                              → h ≥ log₂(n!)

ใช้สูตร Stirling:  log₂(n!) ≈ n·log₂(n) − n·log₂(e)
                            ≈ n·log₂(n)   (พจน์นำ)

ดังนั้นกรณีแย่สุดต้องเทียบอย่างน้อย ~n·log₂n ครั้ง`, cap: "ความสูงของต้นไม้ = จำนวนคำถามในเส้นทางที่ยาวสุด = จำนวนการเทียบกรณีแย่สุด", lang: "txt" },
      { code: String.raw`คำนวณจริงที่ n = 100:
  100! ≈ 9.33 × 10¹⁵⁷
  log₂(100!) ≈ 524.8  → ต้องเทียบอย่างน้อย ~525 ครั้ง
  n·log₂n = 100 × 6.64 ≈ 664

→ นี่คือ "พื้นทางทฤษฎี" ที่อธิบายว่าทำไมเกณฑ์ push_swap
  ตั้งไว้ที่ < 700 ops สำหรับ 100 ตัว (ใกล้ขอบล่างมาก!)`, cap: "เกณฑ์ < 700 ไม่ได้สุ่มมา — มันอิงขอบล่างเชิงทฤษฎีของการเรียง", lang: "txt" },
      { note: "นี่อธิบายว่าทำไม selection sort (O(n²) ops ≈ 5000+ สำหรับ 100) ถึงแพ้ขาด ส่วน Turkish sort (~580) อยู่ใกล้ขอบล่าง ~525 มาก" },

      { h: "🔬 เจาะลึก C: two's complement & overflow ทำงานจริงยังไง" },
      { p: "คอมพิวเตอร์เก็บเลขลบด้วยระบบ two's complement: 'กลับบิตทุกตัวแล้วบวก 1'. ดูตัวอย่าง 8-bit (ของจริง int คือ 32-bit แนวคิดเดียวกัน):" },
      { code: String.raw`เขียน -5 แบบ 8-bit:
   5      = 0000 0101
   กลับบิต = 1111 1010
   +1     = 1111 1011  = -5

ทำไมช่วงไม่สมมาตร?
   8-bit เก็บได้ 256 ค่า (2^8)
   แบ่ง: บวก 0..127 (128 ค่า รวม 0) | ลบ -1..-128 (128 ค่า)
   → ฝั่งลบมีค่ามากกว่า 1 เพราะ 0 ไปกินช่องฝั่งบวก

   int 32-bit:  INT_MIN = -2147483648 , INT_MAX = +2147483647
   |INT_MIN| = 2147483648 ใหญ่กว่า INT_MAX อยู่ 1 → +2147483648 เก็บใน int ไม่ได้!`, cap: "นี่คือเหตุผลที่ valid_int ต้องแยกขอบบวก (≤2147483647) กับขอบลบ (≤2147483648)", lang: "txt" },
      { code: String.raw`Overflow คืออะไร:
   INT_MAX + 1 = 0111...1 + 1 = 1000...0 = INT_MIN  (วนกลับ!)
   ใน C การ overflow ของ signed int เป็น undefined behavior

วิธีกัน (ในโค้ด):  สะสมเลขใน long (64-bit, ช่วงใหญ่กว่ามาก)
   แล้วเทียบขอบ int เอง ก่อนค่าจะมีโอกาส overflow`, lang: "txt" },

      { h: "🔬 เจาะลึก D: ไล่การคำนวณ cost ทีละขั้น (worked example)" },
      { p: "สมมติจะแทรกตัวจาก B กลับเข้า A โดยตำแหน่งเป้าใน A = 3 (จาก size 8) และตัวใน B อยู่ pos = 6 (จาก size 7):" },
      { code: String.raw`ca = cost_of(3, 8): 3 <= 8/2 (=4)?  ใช่ → +3   (ra 3 ครั้ง)
cb = cost_of(6, 7): 6 <= 7/2 (=3.5)? ไม่ → -(7-6) = -1  (rrb 1 ครั้ง)

เครื่องหมายต่างกัน (+3 กับ -1) → หมุนคนละทิศ
รวม = |3| + |1| = 4 การหมุน  + pa = 5 ops`, cap: "กรณีคนละทิศ: บวกตรง ๆ", lang: "txt" },
      { code: String.raw`เทียบกับกรณี "ทิศเดียวกัน" — ca = +3, cb = +2 :
  ไม่มี rr → ra×3 + rb×2 + pa = 6 ops
  มี rr   → rr×2 (ลดทั้งคู่พร้อมกัน) เหลือ ca=+1
           → rr×2 + ra×1 + pa = 4 ops   ★ ประหยัด 2 ops!

นี่คือเหตุผลที่ pick_cost ใช้ max(|ca|,|cb|) ตอนทิศเดียวกัน
(เพราะส่วนที่ซ้อนกันได้ถูกยุบด้วย rr/rrr)`, cap: "หัวใจที่ทำให้ op count ต่ำลงจนผ่านเกณฑ์", lang: "txt" },
      { note: "สรุปเชิงทฤษฎี: empirically Turkish sort ให้ ops โต ~n·log n (100→~580, 500→~5233) ซึ่งเข้าใกล้ขอบล่าง n·log₂n — เป็นเหตุผลว่าทำไมมันชนะ radix/selection ในแง่ op count" },

      { h: "🔬 เจาะลึก E: พิสูจน์ว่า normalization รักษาลำดับถูกต้อง" },
      { p: "Normalization แปลงค่าจริงเป็น rank 0..n-1. คำถามสำคัญ: **การเรียง rank 0→n-1 เท่ากับการเรียงค่าจริงจริงไหม?** มาพิสูจน์กัน" },
      { code: String.raw`นิยาม: rank(x) = จำนวนสมาชิกที่น้อยกว่า x ในเซตเดียวกัน

พิสูจน์ว่า:  rank(a) < rank(b)  ⟺  a < b

(→) ถ้า a < b:
  a มีสมาชิกที่น้อยกว่า a บางส่วน (เรียกชุด S_a)
  b มีสมาชิกที่น้อยกว่า b = S_a ∪ {a} ∪ (สมาชิกระหว่าง a,b)
  → rank(b) ≥ rank(a) + 1 > rank(a)  ✓

(←) ถ้า rank(a) < rank(b):
  b มีสมาชิกน้อยกว่า b มากกว่า a → ต้องมี a < b จริง
  (ถ้า a ≥ b จะได้ rank(a) ≥ rank(b) ขัดแย้ง)  ✓

ตัวอย่าง: เซต = [-999, 0, 42, 1000000]
  rank(-999)  = 0  (ไม่มีใครน้อยกว่า)
  rank(0)     = 1  (มี -999 น้อยกว่า 1 ตัว)
  rank(42)    = 2
  rank(1000000) = 3

→ เรียง rank 0,1,2,3 = เรียง -999,0,42,1000000 ถูกต้อง ✓`, cap: "rank เป็น order-preserving mapping: รักษาลำดับเป๊ะ และทุกค่าอยู่ในช่วง 0..n-1 ที่คำนวณง่าย", lang: "txt" },
      { code: String.raw`ทำไม rank ดีกว่าค่าจริงในการคำนวณ:

สมมติอยากหา "ตำแหน่งที่ควรแทรก 42" ใน stack A ที่มี [0, 100, 200, 1000]

แบบค่าจริง: ต้องเทียบ 42 กับ 0, 100, 200, 1000 ทีละตัว
  → ถ้าค่ากระจาย [-2^31 .. 2^31] การเทียบเสี่ยง overflow

แบบ rank (สมมติ n=5, 42 rank=1):
  target = rank ที่น้อยที่สุดใน A ที่มากกว่า rank ปัจจุบัน
  → คำนวณด้วยเลข 0..4 ล้วน ไม่มีทาง overflow`, cap: "rank เปลี่ยนปัญหา 'เทียบค่าที่กระจายทั่ว 32 bit' เป็น 'เทียบเลข 0..n-1'", lang: "txt" },
      { note: " normalization เป็น O(n²) (เทียบทุกคู่) แต่ทำแค่ครั้งเดียวตอนต้น — คุ้มเพราะจากนั้น algorithm ทั้งหมดทำงานบน rank ล้วน ๆ ที่ O(1) ต่อการเทียบ", lang: "txt" },

      { h: "🔬 เจาะลึก F: ทำไม greedy ถึงได้ผลดี — บทพิสูจน์เชิงประสบการณ์" },
      { p: "Greedy algorithm ไม่การันตี optimal เสมอไป (เช่น traveling salesman ที่ greedy ได้ผลแย่มาก). แต่ **push_swap เป็นกรณีพิเศษ** ที่ greedy ให้ผลดีมาก — มาดูกันว่าทำไม" },
      { code: String.raw`สมมติ n ตัว, push_all_to_b ดัน n-3 ตัวลง B
→ เหลือ 3 ตัวใน A → sort_3 ใช้ ≤ 3 ops (hardcode)
→ ต้อง "ดึงกลับ" n-3 ตัว จาก B กลับเข้า A

แต่ละรอบ:
  1. find_target: หาตำแหน่งใน A ที่ควรแทรก (O(n))
  2. best_b_pos: ลองทุกตัวใน B หาตัวที่ cost ต่ำสุด (O(n²))
  3. do_move: ทำ rr/rrr + pa (O(n))

จำนวนรอบ = n-3
ต่อรอบ = O(n²) ภายใน (แต่ ops ที่พิมพ์ = O(n) ต่อรอบ)

จำนวน ops ทั้งหมด ≈ (n-3) × O(n) = O(n²) สำหรับ insert phase
บวก push_all_to_b = O(n)
รวม ≈ O(n²) ops ที่พิมพ์`, lang: "txt" },
      { code: String.raw`แต่ทำไม empirically ได้ ~n·log n ไม่ใช่ n²?

คำตอบ: แม้ worst case ของ greedy จะเป็น O(n²)
แต่ใน practice:
  - แต่ละรอบเลือก "ตัวถูกสุด" → แต่ละ round ทำให้ A "เรียงมากขึ้น"
  - rr/rrr รวมการหมุน → ประหยัด ops ได้ราวครึ่งหนึ่ง
  - 3 ตัวสุดท้าย hardcode → ไม่เสีย ops กับช่วงท้าย

ผลจริง (วัดจากเดโม):
  n=100  → ~580 ops   (n·log₂n = 664)
  n=500  → ~5233 ops  (n·log₂n = 4482)
  → แกว่ง ~10-15% เหนือขอบล่าง ซึ่งดีมากสำหรับ greedy`, cap: "greedy ไม่ optimal เชิงทฤษฎี แต่ในทางปฏิบัติให้ผล 'ดีพอ' สำหรับโจทย์นี้", lang: "txt" },
      { code: String.raw`เปรียบเทียบกับ algorithm อื่น:

Selection sort:
  หา min → หมุนขึ้น top → pb → วนไป
  ops ≈ n²/2 (ทุกรอบต้อง rotate ผ่าน n/2 ตัวเฉลี่ย)
  n=100 → ~5000 ops (เกินเกณฑ์ < 700 หลายเท่า)

Radix sort (base 2):
  ดูทีละ bit → pb/pa ตาม bit
  ops ≈ n × (จำนวน bit) = n × log₂n
  n=100 → ~700-1100 ops (ก้ำกึ่งเกณฑ์)

Turkish (greedy):
  ops ≈ n × log₂n × c  โดย c ≈ 0.87 ที่ n=100
       แต่ไต่ขึ้นเป็น ~1.17 ที่ n=500
       (greedy แย่กว่า n·log n เล็กน้อยเมื่อ n โต — c ไม่คงที่)
  n=100 → ~580 ops (ต่ำกว่าเกณฑ์ชัดเจน)`, cap: "Turkish sort ชนะเพราะ constant factor ต่ำ — rr/rrr + cost-based selection ทำให้แต่ละรอบคุ้มสุด", lang: "txt" },
      { note: "เหตุผลเชิงลึก: greedy ใช้ได้ดีที่นี่เพราะ 'cost function มีโครงสร้างเชิงเส้นพอ' — ค่าใช้จ่ายในการแทรกไม่ได้เพิ่มขึ้นแบบทวีคูณเมื่อ n โต จึงเลือกตัวถูกสุดได้ผลรวมที่ดี", lang: "txt" },

      { h: "🔬 เจาะลึก G: วิเคราะห์เกณฑ์คะแนน — ทำไม <700 และ ≤5500" },
      { p: "หลายคนสงสัยว่าเกณฑ์ `< 700 ops (100 ตัว)` และ `≤ 5500 ops (500 ตัว)` ตั้งมาจากไหน — มันไม่ได้สุ่มมา แต่อิงจาก **ขอบล่างเชิงทฤษฎี** และ **algorithm ที่ดีที่สุดที่ทำได้จริง**" },
      { code: String.raw`ขอบล่างเชิงทฤษฎี (lower bound):
  Ω(n · log₂n) สำหรับ comparison sort

n = 100:
  n · log₂n = 100 × 6.64 = 664
  → เกณฑ์เต็ม = < 700  (สูงกว่าขอบล่าง ~5% เท่านั้น!)
  → เกณฑ์ผ่าน = < 1100 (สูงกว่าขอบล่าง ~66%)

n = 500:
  n · log₂n = 500 × 8.97 = 4482
  → เกณฑ์เต็ม = ≤ 5500 (สูงกว่าขอบล่าง ~23%)
  → เกณฑ์ผ่าน = < 8500 (สูงกว่าขอบล่าง ~90%)`, cap: "เกณฑ์เต็มถูกออกแบบให้ 'ยากแต่ทำได้ถ้าเลือก algorithm ถูก'", lang: "txt" },
      { code: String.raw`วิเคราะห์ว่า algorithm แต่ละตัวผ่านเกณฑ์ไหม:

n=100, เกณฑ์เต็ม < 700:
  Selection:  ~5000  ← ห้ามหวัง
  Radix:      ~700-1100  ← ก้ำกึ่ง (บางรอบผ่าน บางรอบไม่)
  Turkish:    ~580  ← ผ่านชัดเจนทุกรอบ

n=500, เกณฑ์เต็ม ≤ 5500:
  Selection:  ~125000  ← ห้ามหวัง
  Radix:      ~4500-5500  ← ก้ำกึ่งมาก
  Turkish:    ~5233  ← ผ่านชัดเจน`, cap: "Turkish sort เป็น algorithm เดียวที่ผ่านเกณฑ์เต็มได้ทุกรอบอย่างมั่นคง", lang: "txt" },
      { code: String.raw`ทำไมเกณฑ์เต็มถึงตั้ง "สูงกว่าขอบล่างนิดเดียว":

เป้าหมายของ 42 คือบังคับให้ใช้ algorithm ที่ "ดีจริง" ไม่ใช่ "พอผ่าน":
  - ถ้าเกณฑ์ตั้งที่ 2000 → radix ก็ผ่าน → นักเรียนไม่ต้องคิดมาก
  - ถ้าเกณฑ์ตั้งที่ 550 → เกือบทุก algorithm ไม่ผ่าน → ท้อ
  - 700 = "ถ้าเข้าใจ problem จริง จะผ่าน; ถ้าจำมาแค่ก็ไม่ผ่าน"

เกณฑ์ผ่าน (< 1100) ยังอนุญาตให้ radix บางรอบผ่าน
เพื่อไม่ให้คนที่เลือก radix ต้องทำใหม่ทั้งหมด`, cap: "เกณฑ์คือ 'ยาขมที่พอดี' — บังคับให้เรียน algorithm จริง แต่ไม่โหดจนท้อ", lang: "txt" },
      { note: "วิธีเช็คว่า algorithm เราผ่านเกณฑ์: รัน 5-10 รอบด้วย input สุ่ม 100/500 ตัว แล้วดูค่า max ops — ถ้า max < 700 (100) หรือ max ≤ 5500 (500) = ผ่านชัวร์", lang: "txt" },

      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Big-O notation — Wikipedia", url: "https://en.wikipedia.org/wiki/Big_O_notation", note: "นิยามเป็นทางการ + ตารางเทียบอัตราการเติบโต" },
        { label: "Comparison sort (lower bound) — Wikipedia", url: "https://en.wikipedia.org/wiki/Comparison_sort", note: "พิสูจน์ขอบล่าง Ω(n log n) ด้วย decision tree เต็ม ๆ" },
        { label: "VisuAlgo — Sorting (ภาพเคลื่อนไหว)", url: "https://visualgo.net/en/sorting", note: "ดู selection/insertion/merge ทำงานจริงแบบ visual" },
        { label: "VisuAlgo — Linked List & Stack", url: "https://visualgo.net/en/list", note: "เห็น pointer ของ linked list ขยับทีละขั้น" },
        { label: "Two's complement — Wikipedia", url: "https://en.wikipedia.org/wiki/Two%27s_complement", note: "ทำไม INT_MIN/INT_MAX ไม่สมมาตร + overflow" },
        { label: "Stirling's approximation — Wikipedia", url: "https://en.wikipedia.org/wiki/Stirling%27s_approximation", note: "ที่มาของ log₂(n!) ≈ n·log₂n" },
        { label: "Greedy algorithm — Wikipedia", url: "https://en.wikipedia.org/wiki/Greedy_algorithm", note: "เมื่อไหร่ greedy ได้ผลดี vs เมื่อไหร่ไม่ได้ (MATOID theory)" },
        { label: "Rank (statistics) — Wikipedia", url: "https://en.wikipedia.org/wiki/Rank_(statistics)", note: "ที่มาของ rank ที่ใช้ใน normalization" },
      ]},
    ],
    foundations: [
      { h: "0) ปูพื้น: pointer คืออะไร (สำหรับมือใหม่)" },
      { p: "ตัวแปรปกติเก็บ 'ค่า' เช่น `int x = 5;`. **pointer เก็บ 'ที่อยู่ (address)' ของตัวแปรอื่น** ในหน่วยความจำ เปรียบเหมือนบ้านเลขที่ ไม่ใช่ตัวบ้าน" },
      { code: String.raw`int   x = 5;
int  *p = &x;   // p เก็บ "ที่อยู่ของ x"  (& = เอาที่อยู่)
*p = 9;         // * = ไปที่ที่อยู่นั้นแล้วแก้ค่า → ตอนนี้ x = 9`, cap: "& = address-of, * = dereference (ตามที่อยู่ไปดู/แก้ค่า)", lang: "c" },
      { p: "เราใช้ pointer เพราะ (1) ไม่ต้องก๊อปข้อมูลทั้งก้อน แค่ส่งที่อยู่ (2) ทำให้ฟังก์ชันแก้ค่าตัวจริงข้างนอกได้ (3) สร้างโครงสร้างที่โตได้เรื่อย ๆ อย่าง linked list" },
      { h: "1) struct t_node ถูกสร้างยังไง" },
      { p: "stack ของเราคือ **linked list**: หลาย ๆ กล่อง (node) ที่แต่ละกล่องชี้ไปกล่องถัดไปด้วย pointer `next`" },
      { code: String.raw`typedef struct s_node {
    int             val;    // ค่าจริงจาก argv (เช่น 42)
    int             idx;    // อันดับหลัง normalize (0..n-1)
    struct s_node   *next;  // ที่อยู่ของ node ถัดไป (NULL = ตัวสุดท้าย)
}   t_node;`, cap: "next เป็น pointer ไปยัง struct ชนิดเดียวกัน — นี่คือหัวใจของ linked list", lang: "c" },
      { code: String.raw`a → [42|next] → [17|next] → [99|NULL]
      ▲ top                      ▲ bottom`, cap: "ภาพ stack A: ตัวแปร a เก็บที่อยู่ของ node บนสุด, ตัวสุดท้าย next = NULL" },
      { h: "2) สร้าง node ด้วย malloc (stack.c)" },
      { code: String.raw`t_node *new_node(int val) {
    t_node *node = malloc(sizeof(t_node));  // ขอหน่วยความจำ 1 กล่อง
    if (!node)                              // malloc คืน NULL ถ้าไม่พอ → ต้องเช็ค!
        return (NULL);
    node->val = val;                        // node->x  =  (*node).x
    node->idx = 0;
    node->next = NULL;
    return (node);                          // คืน "ที่อยู่" ของกล่องใหม่
}`, cap: "malloc จองหน่วยความจำบน heap → ต้อง free เองทีหลังเสมอ; เช็ค NULL ทุกครั้ง", lang: "c" },
      { note: "`node->val` คือ shorthand ของ `(*node).val` = ตามที่อยู่ node ไปแก้ field val. ใช้ -> เมื่อตัวแปรเป็น pointer ไป struct" },
      { h: "3) ทำไมต้องใช้ double pointer (t_node **top)" },
      { p: "เวลาเราจะ push/pop หรือ rotate เราอาจต้อง **เปลี่ยนตัว 'หัว' (top) เอง** ถ้าส่งแค่ `t_node *` ฟังก์ชันจะแก้ได้แค่สำเนา ตัวจริงข้างนอกไม่เปลี่ยน จึงต้องส่ง **ที่อยู่ของตัวแปร top** = `t_node **`" },
      { code: String.raw`void stack_push(t_node **top, t_node *node) {
    node->next = *top;   // node ใหม่ชี้ไปหัวเดิม
    *top = node;         // *top = แก้ตัวแปร top ตัวจริง ให้ชี้ node ใหม่
}`, cap: "*top = ... แก้ค่าตัวแปร top ของ caller ได้จริง (ถ้าใช้ pointer ชั้นเดียวจะแก้ไม่ติด)", lang: "c" },
      { h: "4) Pointer surgery: rotate ทำงานทีละขั้น (ops_rotate.c)" },
      { code: String.raw`first = *stack;            // 1. จำหัวเดิมไว้
*stack = first->next;      // 2. หัวใหม่ = ตัวที่ 2
first->next = NULL;        // 3. ตัด first ออกจากสาย
last = *stack;
while (last->next)         // 4. เดินไปจนสุดสาย
    last = last->next;
last->next = first;        // 5. เอา first ต่อท้าย`, cap: "ย้ายหัวไปท้าย โดยไม่ malloc ใหม่เลย — แค่ขยับ pointer (นี่คือเหตุผลที่ linked list เร็ว)", lang: "c" },
      { code: String.raw`ก่อน:  [42] → [17] → [99] → NULL
ขั้น2: *stack ชี้ [17]      [42]→NULL (หลุดออกชั่วคราว)
ขั้น5: [17] → [99] → [42] → NULL`, cap: "ไล่ดู pointer ขยับทีละขั้น" },
      { h: "5) Memory management: ใครจอง ใครคืน" },
      { ul: [
        "**จอง:** ทุก node เกิดจาก `malloc` ใน new_node (1 ก้อนต่อ 1 เลข) + struct t_ps อีก 1 ก้อน",
        "**คืน:** `ps_free` เดินทั้ง list เรียก `free` ทุก node แล้วค่อย free struct",
        "**กฎเหล็ก:** ทุกอย่างที่ malloc ต้องมีคนเดียวที่ free และ free ครั้งเดียว (free ซ้ำ = crash)",
      ]},
      { code: String.raw`void stack_free(t_node **top) {
    t_node *tmp;
    while (*top) {
        tmp = (*top)->next;   // จำตัวถัดไปก่อน (ไม่งั้นพอ free แล้วหาไม่เจอ)
        free(*top);           // คืนกล่องปัจจุบัน
        *top = tmp;           // เลื่อนไปตัวถัดไป
    }
}`, cap: "ทริคสำคัญ: เก็บ next ไว้ก่อน free เสมอ — ถ้า free ก่อนแล้วค่อยอ่าน ->next = use-after-free", lang: "c" },
      { note: "ทุก error path (input ผิด/malloc fail) เรียก error_exit → ps_free ก่อน write \"Error\" แล้ว exit เสมอ → ไม่มี leak แม้ตอน error" },
    ],
    architecture: [
      { h: "แผนผังไฟล์" },
      { code: String.raw`main.c        parse → normalize → sort_small/large → free
parse.c       รับ argv, ตรวจซ้ำ, สร้าง linked list (argv[1] = top)
validate.c    valid_int(): ตรวจ integer + overflow ด้วย long
normalize.c   แปลง val → idx (rank 0..n-1)
stack.c       new_node / push / pop / size / free
ops_*.c       sa sb ss / pa pb / ra rb rr / rra rrb rrr
sort_small.c  n = 2..5 (hardcode)
sort_large.c  n > 5 (Turkish sort)
cost.c        find_target / cost_of / best_b_pos (สมองของ algo)
move.c        do_move(): แปลง cost เป็น op จริง + รวม rr/rrr
utils.c       is_sorted / find_min_pos / ft_abs / free
checker_bonus.c   อ่าน ops จาก stdin → OK/KO`, cap: "file map" },
      { h: "โครงสร้างข้อมูล (push_swap.h)" },
      { code: String.raw`typedef struct s_node {
    int             val;   // ค่าจริงจาก argv
    int             idx;   // rank หลัง normalize (0 = เล็กสุด)
    struct s_node   *next;
}   t_node;

typedef struct s_ps {
    t_node  *a;       // top ของ stack A
    t_node  *b;       // top ของ stack B
    int     silent;   // 1 = ไม่ print ชื่อ op (ใช้ตอนเป็น checker)
}   t_ps;`, cap: "ใช้ linked list เพราะ push/pop เป็น O(1)", lang: "c" },
    ],
    dataflow: [
      { p: "หมวดนี้ไล่ **ทุกฟังก์ชัน** ว่าทำไมถึงมี รับอะไรมาจากใคร แล้วส่งต่อให้ใคร — เพื่อให้เห็นภาพการไหลของข้อมูลตลอดโปรแกรม" },
      { h: "ภาพรวมการเรียก (call flow)" },
      { code: String.raw`main(argc, argv)
 │
 ├─ parse_args ───────► build_stack ──► valid_int ─► count_digits
 │   (คืน t_ps*)           (วน argv)   └► has_dup
 │                                     └► new_node ─► append_node
 │
 ├─ normalize(ps) ────► count_smaller   (เติม node->idx ทุกตัว)
 │
 ├─ is_sorted(ps->a)? ── ใช่ ─► ข้ามไป free
 │
 ├─ sort_small(ps)  [n≤5] ► sort_2 / sort_3 / bring_to_top ─► find_idx_pos
 │  sort_large(ps)  [n>5] ► push_all_to_b
 │                         ► insert_from_b ─► best_b_pos ─► pick_cost ─► find_target / cost_of
 │                         │              └► get_at
 │                         │              └► do_move ─► do_same_dir / rotate_a_by / rotate_b_by
 │                         └► rotate_sorted_top ─► find_min_pos
 │
 └─ ps_free(ps) ──────► stack_free

ทุก operation (sa…rrr, pa/pb) เรียก stack ops แล้ว write("xx\n")
ถ้า ps->silent==1 (โหมด checker) จะไม่ write`, cap: "ลูกศร = 'เรียก/ส่งข้อมูลไปยัง'", lang: "txt" },
      { note: "หัวใจการไหล: มี struct `t_ps *ps` ตัวเดียววิ่งทั่วโปรแกรม → ทุกฟังก์ชันรับ pointer ตัวนี้ จึงอ่าน/แก้ stack A,B ก้อนเดียวกัน (ไม่มีการก๊อป stack)" },

      { h: "🔗 ไล่ชีวิตของเลข 1 ตัว (argv → output)" },
      { code: String.raw`"42" (argv[i])
  └► valid_int("42")          ตรวจว่าเป็น int → ผ่าน
  └► ft_atoi("42") = 42       เป็นตัวเลขจริง
  └► new_node(42)             malloc node, node->val = 42
  └► append_node             ต่อท้าย list  →  อยู่ใน ps->a
  └► normalize               count_smaller นับว่ามีกี่ตัวเล็กกว่า 42
                             → เก็บใน node->idx (เช่น idx = 7)
  └► sort_large ใช้ node->idx (ไม่ใช้ val อีกเลย) คำนวณ target/cost
  └► เมื่อ pa/pb/ra ขยับ node นี้ → write ชื่อ op ออก stdout`, cap: "ค่าจริง (val) ใช้แค่ตอน normalize → จากนั้น algorithm ทำงานบน idx ล้วน ๆ", lang: "txt" },

      { h: "parse.c / validate.c — รับ input เข้าระบบ" },
      { table: { head: ["ฟังก์ชัน", "ทำไมถึงมี (หน้าที่)", "รับอะไร · จากใคร", "คืน/ส่งต่อ · ให้ใคร"], rows: [
        ["valid_int(s)", "ด่านแรก: arg เป็น int 32-bit ที่ถูกต้องไหม", "string argv[i] · จาก build_stack", "1/0 → build_stack ตัดสิน error"],
        ["count_digits (static)", "นับเลข + เช็ค overflow ด้วย long", "s,i,neg · จาก valid_int", "1/0 → valid_int"],
        ["has_dup(stack,val)", "กันเลขซ้ำ (stack ต้องไม่มีค่าซ้ำ)", "หัว list + ค่า · จาก build_stack", "1/0 → build_stack"],
        ["build_stack (static)", "หัวใจ parse: วน argv สร้าง list A", "argc,argv,ps · จาก parse_args", "หัว list (t_node*) → parse_args"],
        ["parse_args", "เตรียม t_ps แล้วสั่งสร้าง stack", "argc,argv · จาก main", "t_ps* → main"],
      ]}},
      { h: "stack.c — กลไกพื้นฐานของ stack (ถูกใช้ซ้ำทุกที่)" },
      { table: { head: ["ฟังก์ชัน", "ทำไมถึงมี", "รับ · จากใคร", "คืน/ผล · ให้ใคร"], rows: [
        ["new_node(val)", "ผลิต node ใหม่ (malloc + init)", "int · จาก build_stack", "t_node* → append_node"],
        ["stack_push(**top,n)", "ดัน node ขึ้นยอด (แก้ตัว top ได้ → double ptr)", "**top,node · จาก pa/pb", "แก้ *top ในที่"],
        ["stack_pop(**top)", "หยิบ node ยอดออก", "**top · จาก pa/pb", "t_node* + แก้ *top"],
        ["stack_size(top)", "นับจำนวน (ใช้ตัดสินใจทั่วโปรแกรม)", "top · จาก sort/cost/move", "int"],
        ["stack_free(**top)", "คืน memory ทั้ง list", "**top · จาก ps_free", "*top = NULL"],
      ]}},
      { h: "ops_*.c — 11 คำสั่ง (ตัวเดียวที่ write output)" },
      { table: { head: ["ฟังก์ชัน", "ทำไมถึงมี", "รับ · จากใคร", "ผล"], rows: [
        ["sa / sb / ss", "สลับ 2 ยอด", "t_ps* · จาก sort_*", "แก้ stack + write ชื่อ op"],
        ["pa / pb", "ย้ายข้าม stack (= pop+push)", "t_ps* · จาก sort_*/do_move", "ย้าย node + write"],
        ["rotate_one (static)", "กลไกหมุน top→bottom (pointer surgery)", "**stack · จาก ra/rb/rr", "แก้ list ในที่"],
        ["ra / rb / rr", "หมุนหน้า (rr = ทั้งคู่, 1 op)", "t_ps* · จาก rotate_*_by/sort", "เรียก rotate_one + write"],
        ["rev_rotate_one (static)", "กลไกหมุน bottom→top", "**stack · จาก rra/rrb/rrr", "แก้ list ในที่"],
        ["rra / rrb / rrr", "หมุนหลัง (rrr = ทั้งคู่, 1 op)", "t_ps* · จาก rotate_*_by/sort", "เรียก rev_rotate_one + write"],
      ]}},
      { h: "sort_small.c / sort_large.c — กลยุทธ์การเรียง" },
      { table: { head: ["ฟังก์ชัน", "ทำไมถึงมี", "รับ · จากใคร", "ส่งต่อ · ให้ใคร"], rows: [
        ["sort_2 / sort_3", "เรียงเคสจิ๋วแบบ optimal (≤2 ops)", "t_ps* · จาก sort_small/large", "เรียก sa/ra/rra"],
        ["find_idx_pos (static)", "หา position ของ idx เป้า", "stack,target · จาก bring_to_top", "int pos"],
        ["bring_to_top (static)", "หมุน idx เป้าขึ้นยอด (เลือกทางสั้น)", "ps,target · จาก sort_small", "เรียก ra/rra"],
        ["sort_small", "คุมเคส n=2..5", "t_ps* · จาก main", "เรียก sort_2/3, pb, pa"],
        ["get_at (static)", "ดึง node ที่ตำแหน่ง pos ใน B", "stack,pos · จาก insert_from_b", "t_node*"],
        ["push_all_to_b (static)", "ดัน A→B จนเหลือ 3", "ps · จาก sort_large", "เรียก pb"],
        ["insert_from_b (static)", "loop แทรกกลับตัวที่ถูกสุด", "ps · จาก sort_large", "best_b_pos→get_at→find_target→do_move"],
        ["rotate_sorted_top (static)", "หมุน idx=0 ขึ้นยอด (ปิดงาน)", "ps · จาก sort_large", "find_min_pos + ra/rra"],
        ["sort_large", "คุม flow Turkish sort", "t_ps* · จาก main", "เรียก 4 ตัวบน"],
      ]}},
      { h: "cost.c / move.c — สมอง + มือของ Turkish sort" },
      { table: { head: ["ฟังก์ชัน", "ทำไมถึงมี", "รับ · จากใคร", "คืน/ส่งต่อ"], rows: [
        ["find_min_in_a (static)", "หา pos ของ idx เล็กสุดใน A", "ps · จาก find_target", "int → find_target"],
        ["find_target(ps,b_idx)", "ตำแหน่งใน A ที่ควรแทรกตัวจาก B", "ps + idx · จาก insert_from_b/pick_cost", "int pos"],
        ["cost_of(pos,size)", "แปลง pos → จำนวนหมุน + ทิศ (เครื่องหมาย)", "pos,size · จาก pick_cost/do_move", "int (มีเครื่องหมาย)"],
        ["pick_cost (static)", "cost รวม A+B (รวม rr/rrr)", "ps,node,pos · จาก best_b_pos", "int → best_b_pos"],
        ["best_b_pos(ps)", "เลือกตัวใน B ที่ถูกสุด", "ps · จาก insert_from_b", "int pos"],
        ["rotate_a_by / rotate_b_by (static)", "หมุนตามจำนวน ca/cb ที่เหลือ", "ps,c · จาก do_move", "เรียก ra/rra หรือ rb/rrb"],
        ["do_same_dir (static)", "ยุบหมุนทิศเดียวกันเป็น rr/rrr", "ps,*ca,*cb · จาก do_move", "ลด ca,cb ผ่าน pointer"],
        ["do_move(ps,pa,pb)", "execute การแทรก 1 ตัว", "ps + 2 pos · จาก insert_from_b", "do_same_dir/rotate/pa"],
      ]}},
      { h: "utils.c / checker_bonus.c" },
      { table: { head: ["ฟังก์ชัน", "ทำไมถึงมี", "รับ · จากใคร", "คืน/ผล"], rows: [
        ["is_sorted(stack)", "เช็คเรียงแล้วยัง (กันทำงานเกิน + checker)", "stack · จาก main/checker", "1/0"],
        ["find_min_pos(stack)", "หา pos ของ idx=0", "stack · จาก rotate_sorted_top", "int"],
        ["ft_abs(n)", "ค่าสัมบูรณ์ (cost เป็นลบได้)", "int · จาก pick_cost", "int"],
        ["ps_free / error_exit", "คืน memory / จบงานเมื่อ error", "ps · จากทุก error path", "free แล้ว exit"],
        ["apply_op (static)", "[bonus] แปลงบรรทัด → เรียก op", "line · จาก read_ops", "เรียก op (silent)"],
        ["read_ops (static)", "[bonus] อ่าน stdin ทุกบรรทัด", "ps · จาก main", "วน apply_op"],
      ]}},
    ],
    implementation: [
      { h: "1) ตรวจ overflow ด้วย long (validate.c)" },
      { code: String.raw`n = n * 10 + (s[i] - '0');
if (n > 2147483648L)        // ใช้ long กัน overflow ระหว่างบวก
    return (0);
...
if (neg) return (n <= 2147483648L);  // ค่าลบไปได้ถึง -2147483648
return (n <= 2147483647L);           // ค่าบวกถึง  2147483647`, cap: "สะสมเลขใน long แล้วเทียบขอบ int ทีหลัง — แยกขอบบวก/ลบ", lang: "c" },
      { h: "2) Normalize เป็น rank (normalize.c)" },
      { code: String.raw`ptr->idx = count_smaller(ps->a, ptr->val); // มีกี่ตัวเล็กกว่า = rank`, cap: "O(n²) แต่พอเพียงสำหรับ n ≤ 500", lang: "c" },
      { h: "3) Sort เล็ก (sort_small.c)" },
      { code: String.raw`bring_to_top(ps, 0); pb(ps);             // ดัน idx=0 ลง B
if (size == 5) { bring_to_top(ps, 1); pb(ps); }
sort_3(ps);
pa(ps); if (size == 5) pa(ps);`, cap: "n=4,5: ดันตัวเล็กสุดลง B → เรียง 3 ตัว → ดันกลับ", lang: "c" },
      { h: "4) Sort ใหญ่ = Turkish sort (sort_large.c)" },
      { code: String.raw`void sort_large(t_ps *ps) {
    push_all_to_b(ps);     // ดันจนเหลือ 3 ตัวใน A
    sort_3(ps);            // เรียง 3 ตัวที่เหลือ
    insert_from_b(ps);     // ดึงตัว "ถูกสุด" กลับเข้า A ทีละตัว
    rotate_sorted_top(ps); // หมุนให้ตัวเล็กสุดขึ้นบน
}`, lang: "c" },
      { h: "5) Cost = สมองของ algorithm (cost.c)" },
      { code: String.raw`int cost_of(int pos, int size) {
    if (pos <= size / 2) return (pos);   // หมุนหน้า (ra) → ค่าบวก
    return (-(size - pos));              // หมุนหลัง (rra) → ค่าลบ
}`, cap: "เครื่องหมาย = ทิศการหมุน, ขนาด = จำนวนครั้ง — เก็บ 2 อย่างใน int เดียว", lang: "c" },
      { code: String.raw`if (ทิศเดียวกัน) return max(|ca|, |cb|);  // หมุนพร้อมกันด้วย rr/rrr
else             return |ca| + |cb|;      // คนละทิศ ต้องหมุนแยก`, cap: "pick_cost(): รวม cost ของ A และ B", lang: "c" },
      { h: "6) Execute move — จุดที่ rr/rrr ถูกใช้จริง (move.c)" },
      { code: String.raw`do_same_dir(ps, &ca, &cb);   // ทั้งคู่บวก → rr / ทั้งคู่ลบ → rrr
rotate_a_by(ps, ca);         // ที่เหลือของ A → ra/rra
rotate_b_by(ps, cb);         // ที่เหลือของ B → rb/rrb
pa(ps);                      // ดันเข้า A`, lang: "c" },
    ],
    tricks: [
      { ul: [
        "**rr/rrr รวมการหมุน** เมื่อ A และ B ต้องหมุนทิศเดียวกัน → ลด ops ครึ่งหนึ่งในช่วงนั้น (ตัวช่วยผ่าน <700/5500)",
        "**cost มีเครื่องหมาย** = เก็บทั้งทิศและจำนวนใน int เดียว (+ = ra, − = rra)",
        "**normalize เป็น rank** → ไม่ต้องเทียบค่าจริง ไม่กลัว overflow ระหว่าง sort",
        "**A เป็นวงกลมเรียง (circular sorted)** หลัง insert → จบด้วยหมุนตัวเล็กขึ้นบนครั้งเดียว",
        "**silent flag** ใช้โค้ดชุดเดียวกันทั้ง push_swap (พิมพ์) และ checker (ไม่พิมพ์)",
        "**bring_to_top เลือกทิศสั้นกว่า** โดยเทียบ pos กับ size/2",
        "**overflow ด้วย long** + แยกขอบเขตบวก/ลบ",
      ]},
    ],
    eval: [
      { qa: [
        { q: "ทำไมเลือก linked list ไม่ใช้ array?", a: "push/pop เป็น O(1) (แค่ขยับ pointer) ไม่ต้องเลื่อนสมาชิกเหมือน array และ rotate ก็แค่ต่อ pointer" },
        { q: "normalize คืออะไร ทำไมต้องทำ?", a: "แปลงค่าจริงเป็นอันดับ 0..n-1 เพราะ algorithm สนใจแค่ลำดับ ทำให้คำนวณตำแหน่งแทรกง่ายและไม่ยุ่งกับ overflow" },
        { q: "อธิบาย algorithm สำหรับ n ใหญ่", a: "Turkish/greedy — ดันลง B จนเหลือ 3, เรียง 3 ตัว, ดึงตัวที่ cost ถูกสุดจาก B กลับเข้า A ทีละตัว, สุดท้ายหมุนตัวเล็กขึ้นบน" },
        { q: "cost คำนวณยังไง ทำไมเป็นลบได้?", a: "cost_of คืน +pos ถ้าหมุนหน้าถูกกว่า, คืน -(size-pos) ถ้าหมุนหลังถูกกว่า เครื่องหมายบอกทิศ ขนาดบอกจำนวนครั้ง" },
        { q: "rr ช่วยยังไง?", a: "ถ้า A และ B ต้องหมุนทิศเดียวกัน ใช้ rr แทน ra+rb → 1 op แทน 2" },
        { q: "จัดการ error อะไรบ้าง?", a: "ไม่ใช่ตัวเลข, มีอักขระเกิน, overflow, เลขซ้ำ, string ว่าง \"\" → write(2,\"Error\\n\",6) แล้ว exit(1) โดย free memory ก่อนทุกครั้ง" },
        { q: "./push_swap (ไม่มี arg) หรือ ./push_swap 1 ทำอะไร?", a: "ไม่พิมพ์อะไรเลย (argc<2 → return 0; ตัวเดียวหรือเรียงแล้ว → is_sorted เป็นจริง)" },
        { q: "เช็ค memory leak ยังไง?", a: "valgrind --leak-check=full ./push_swap 3 2 1 — ทุก error path เรียก ps_free ก่อน exit" },
        { q: "checker (bonus) ตัดสิน OK ยังไง?", a: "อ่าน ops จาก stdin มา apply (silent), จบแล้วถ้า is_sorted(a) && b ว่าง → OK ไม่งั้น KO; op ที่ไม่รู้จัก → Error" },
      ]},
      { h: "คำสั่งทดสอบให้กรรมการดู" },
      { code: String.raw`ARG=$(shuf -i 1-100 -n 100 | tr '\n' ' '); ./push_swap $ARG | wc -l        # < 700
ARG=$(shuf -i 1-500 -n 500 | tr '\n' ' '); ./push_swap $ARG | ./checker_linux $ARG # OK
./push_swap 2147483648   # Error (overflow)
./push_swap 1 2 2        # Error (ซ้ำ)`, lang: "bash" },
    ],
  },
},

/* ===================== PIPEX ===================== */
{
  id: "pipex",
  name: "pipex",
  tag: { th: "สร้าง cmd1 | cmd2 ของ shell ขึ้นเองด้วยมือ ผ่าน fork/pipe/dup2", en: "Rebuild the shell's cmd1 | cmd2 by hand with fork/pipe/dup2" },
  accent: "#7bd88f",
  sections: {
    principle: [
      { h: "โจทย์คืออะไร" },
      { p: "ทำให้ `./pipex infile cmd1 cmd2 outfile` เทียบเท่ากับ shell: `< infile cmd1 | cmd2 > outfile`" },
      { h: "system call ที่เป็นหัวใจ" },
      { table: { head: ["call", "หน้าที่"], rows: [
        ["fork()", "สร้าง process ลูก (คืน 0 ในลูก, คืน pid ใน parent)"],
        ["pipe(fd)", "สร้างท่อ: fd[0]=อ่าน, fd[1]=เขียน"],
        ["dup2(a,b)", "ทำให้ fd b ชี้ไปที่เดียวกับ a (เปลี่ยน stdin/stdout)"],
        ["execve(p,av,env)", "แทนที่ process ปัจจุบันด้วยโปรแกรมใหม่ (ไม่ return ถ้าสำเร็จ)"],
        ["waitpid", "parent รอ child จบ + เก็บ exit status"],
      ]}},
      { note: "ภาพรวม: cmd1 อ่านจาก infile เขียนเข้า pipe → cmd2 อ่านจาก pipe เขียนลง outfile แต่ละ cmd อยู่คนละ process" },
      { h: "ที่มาที่ไป: pipex จำลองอะไรของ shell" },
      { p: "เวลาเราพิมพ์ `< infile cmd1 | cmd2 > outfile` ใน shell มันทำเบื้องหลังหลายอย่างที่เรามองไม่เห็น: เปิดไฟล์, สร้าง process แยกของแต่ละคำสั่ง, ต่อ output ของตัวหนึ่งเข้า input ของอีกตัว, แล้วรอให้จบ. **pipex คือการลงมือทำสิ่งเหล่านี้เองด้วย system call** เพื่อให้เข้าใจว่า '|' จริง ๆ คืออะไร" },
      { h: "ทำไมต้องใช้ 4 system call นี้ (เหตุผลของแต่ละตัว)" },
      { ul: [
        "**fork** — แต่ละคำสั่งต้องเป็นโปรแกรมคนละตัว รันพร้อมกัน เราจึงต้องมีหลาย process; fork คือวิธีเดียวที่สร้าง process ใหม่ใน Unix",
        "**execve** — process ที่ fork มายังเป็น 'pipex' อยู่ เราต้องเปลี่ยนให้มันกลายเป็น `ls`/`wc` จริง ๆ; execve คือการ 'สวมร่าง' โปรแกรมอื่นทับ process ปัจจุบัน",
        "**pipe** — สองคำสั่งอยู่คนละ process จึงแชร์ตัวแปรกันไม่ได้ ต้องส่งข้อมูลผ่าน 'ท่อ' ของ kernel; pipe ให้ buffer ที่ปลายหนึ่งเขียน อีกปลายอ่าน",
        "**dup2** — cmd ไม่รู้จัก pipe ของเรา มันรู้จักแค่ stdin(0)/stdout(1); dup2 จึง 'ชี้' stdin/stdout ของ cmd ไปที่ไฟล์/ท่อที่เราต้องการ โดย cmd ไม่ต้องแก้อะไรเลย",
      ]},
      { h: "ทำไมให้ลูก 2 ตัวรัน cmd (ไม่ให้ parent รันเอง)" },
      { p: "เราอยากให้ **parent เป็นผู้ควบคุม**: ปิด fd ที่ไม่ใช้ และ `waitpid` รอลูกทั้งคู่จบเพื่อเก็บ exit status. ถ้า parent ไป execve เองมันจะ 'สวมร่าง' หายไป ไม่เหลือใครรอ/เก็บกวาด → เกิด zombie หรือทำงานพังลำดับ" },
      { h: "ทำไม 'ปิด fd ให้ครบ' ถึงเป็นหัวใจ (ไม่ใช่แค่กันรั่ว)" },
      { p: "คำสั่งที่อ่าน stdin (เช่น `wc`, `cat`) จะ **รอจนกว่าจะเจอ EOF**. EOF ของ pipe จะเกิดก็ต่อเมื่อ **ทุก process ปิดปลายเขียน (write end) หมด**. ถ้ามีใครสักตัว (parent หรือ child อื่น) ยังถือปลายเขียนเปิดอยู่ → ไม่มีวันเกิด EOF → cmd2 ค้างตลอดกาล. การปิด fd จึงไม่ใช่แค่เรื่องความสะอาด แต่เป็นเงื่อนไขที่ทำให้ pipeline 'จบ' ได้" },
      { h: "ทำไมต้องหา PATH เอง" },
      { p: "execve ต้องการ **path เต็ม** (เช่น `/bin/ls`) ไม่รับแค่ `ls`. ปกติ shell หาให้โดยไล่ดูทุกโฟลเดอร์ใน `$PATH`; เมื่อเราเลียนแบบ shell เราจึงต้องทำขั้นตอนนี้เอง — split PATH ด้วย ':' แล้วลองต่อ `dir/cmd` จนกว่าจะเจอไฟล์ที่ execute ได้" },
    ],
    theory: [
      { p: "pipex คือบทเรียน **ระบบปฏิบัติการ (OS) ภาคปฏิบัติ** — ทฤษฎีเบื้องหลังคือเรื่อง process, memory และ I/O ของ Unix" },
      { h: "1) Process กับ Program ต่างกัน" },
      { p: "**Program** = ไฟล์โปรแกรมนิ่ง ๆ บนดิสก์. **Process** = program ที่ 'กำลังรัน' มี memory, fd, สถานะ และ **PID (Process ID)** เป็นของตัวเอง. โปรแกรมเดียวรันพร้อมกันหลาย process ได้" },
      { h: "2) fork() & Copy-on-Write" },
      { p: "`fork()` สร้าง process ลูกที่เป็น **สำเนาเกือบทั้งหมดของแม่** (memory, fd). มันคืนค่า 2 ครั้ง: ในแม่คืน PID ลูก, ในลูกคืน 0 — เราใช้ค่านี้แยกว่ากำลังอยู่ใน process ไหน" },
      { note: "Copy-on-Write: จริง ๆ kernel ไม่ได้ก๊อป memory ทันที แต่ให้แม่/ลูกใช้หน้าหน่วยความจำร่วมกันก่อน จะ 'ก๊อปจริง' ต่อเมื่อมีฝ่ายเขียน — ทำให้ fork เร็วและประหยัด" },
      { h: "3) Virtual memory & Address space" },
      { p: "แต่ละ process มองเห็น 'หน่วยความจำส่วนตัว' (virtual address space) ของตัวเองเหมือนมีเครื่องทั้งเครื่อง kernel + MMU แปลงเป็นที่อยู่จริงให้. นี่คือเหตุผลที่ 2 process แชร์ตัวแปรกันตรง ๆ ไม่ได้ → ต้องใช้ pipe เพื่อสื่อสาร" },
      { h: "4) Everything is a file & File Descriptor table" },
      { p: "ปรัชญา Unix: ไฟล์จริง, pipe, socket, terminal — ทุกอย่างถูกมองเป็น 'ไฟล์' อ่าน/เขียนด้วย read()/write() เหมือนกันหมด. แต่ละ process มี **ตาราง fd** เป็น array ที่ index (เลข fd) ชี้ไปยัง 'สิ่งที่เปิดอยู่'" },
      { table: { head: ["fd", "ชื่อ", "ปกติชี้ไป"], rows: [
        ["0", "stdin", "แป้นพิมพ์"], ["1", "stdout", "จอ"], ["2", "stderr", "จอ (error)"],
      ]}},
      { h: "5) Pipe & IPC (สื่อสารระหว่าง process)" },
      { p: "**IPC = Inter-Process Communication.** pipe คือ buffer ในหน่วยความจำ kernel มี 2 ปลาย: เขียนปลายหนึ่ง อ่านอีกปลายหนึ่ง (ทางเดียว). ข้อมูลไหลแบบ FIFO" },
      { ul: [
        "**Buffering:** ถ้า buffer เต็ม คนเขียนจะรอ; ถ้าว่าง คนอ่านจะรอ → เกิดการ sync ตามธรรมชาติ",
        "**EOF:** คนอ่านจะได้สัญญาณ 'จบ' (read คืน 0) ก็ต่อเมื่อ **ทุกสำเนาของปลายเขียนถูกปิดหมด** — นี่คือทฤษฎีเบื้องหลังบั๊ก 'pipeline ค้าง'",
      ]},
      { h: "6) exec family — แทนที่ program image" },
      { p: "`execve()` ไม่สร้าง process ใหม่ แต่ **ล้าง memory ของ process ปัจจุบันทิ้งแล้วโหลดโปรแกรมใหม่ทับ** (code/data/stack ใหม่หมด) PID เดิม. ถ้าสำเร็จจะ 'ไม่ return' — โค้ดบรรทัดถัดไปจึงเป็น error path เสมอ. รูปแบบมาตรฐานคือ fork ก่อนแล้วให้ลูก exec" },
      { h: "7) Process synchronization: wait / exit status / zombie" },
      { ul: [
        "**exit status:** process จบแล้วส่งเลขสถานะ (0 = สำเร็จ) ให้แม่",
        "**wait/waitpid:** แม่ 'เก็บศพ' ลูกและอ่าน status — ถ้าไม่ wait ลูกที่ตายแล้วจะค้างเป็น **zombie** (กินช่องในตาราง process)",
        "**orphan:** ถ้าแม่ตายก่อน ลูกจะถูก init (PID 1) รับไปดูแล",
      ]},
      { h: "8) Environment variables & PATH" },
      { p: "`envp` คือชุดตัวแปรสภาพแวดล้อม (KEY=VALUE) ที่ process สืบทอดจากแม่. `PATH` เก็บรายการโฟลเดอร์คั่นด้วย ':' ที่ระบบใช้ค้นหาคำสั่ง — เป็นทฤษฎีเบื้องหลังว่าทำไมพิมพ์ `ls` แล้วระบบหา `/bin/ls` เจอ" },

      { h: "🔬 เจาะลึก A: fork คืน 2 ค่า + ต้นไม้ process" },
      { p: "`fork()` ถูกเรียก **ครั้งเดียว** แต่ 'return สองครั้ง' — ครั้งหนึ่งในแม่ ครั้งหนึ่งในลูก (เพราะตอน return มี process 2 ตัวแล้ว) ค่าที่คืนต่างกันเพื่อให้แยกออก" },
      { code: String.raw`pid_t pid = fork();
// ── จากบรรทัดนี้ลงไป มี 2 process รันโค้ดชุดเดียวกัน ──
if (pid == 0) {
    // โค้ดนี้รันใน "ลูก"  (fork คืน 0 ให้ลูก)
} else if (pid > 0) {
    // โค้ดนี้รันใน "แม่"  (fork คืน PID ของลูก = เลขบวก)
} else {
    // pid < 0 → fork ล้มเหลว (เช่น process เต็มระบบ)
}`, cap: "ลูกได้ 0 (มันไม่มีลูกของตัวเอง), แม่ได้ PID ลูกไว้ wait ทีหลัง", lang: "c" },
      { code: String.raw`pipex สร้างต้นไม้แบบนี้:

         pipex (parent)
          /          \
   child1(cmd1)   child2(cmd2)
   exec ls         exec wc

parent ไม่ exec → คงตัวเป็น "ผู้ควบคุม" รอ wait ลูกทั้งคู่`, cap: "ถ้า parent ไป exec เองจะหายไป ไม่เหลือใคร wait → เก็บกวาดไม่ได้", lang: "txt" },

      { h: "🔬 เจาะลึก B: ตาราง fd เปลี่ยนยังไงตอน dup2 (trace จริง)" },
      { p: "dup2(old, new) = 'ทำให้ช่อง new ในตาราง fd ชี้ไปที่เดียวกับ old' (ถ้า new เปิดอยู่ จะปิดให้ก่อน). ไล่ดูใน child1 ที่ infile=fd3, pipe write=fd5:" },
      { code: String.raw`เริ่มต้น child1:
  fd0 → terminal(stdin)
  fd1 → terminal(stdout)
  fd2 → terminal(stderr)
  fd3 → infile
  fd4 → pipe[read]
  fd5 → pipe[write]

dup2(3, 0):  fd0 → infile        (stdin มาจากไฟล์แล้ว)
dup2(5, 1):  fd1 → pipe[write]   (stdout ไปเข้า pipe แล้ว)
close(3); close(4); close(5):    ปิดสำเนาที่ไม่ใช้

หลังจากนี้ exec(ls): ls เขียน stdout(fd1) = เข้า pipe โดยไม่รู้ตัว`, cap: "exec รักษาตาราง fd ไว้ (ไม่รีเซ็ต) → cmd จึงสืบทอดการ redirect นี้ไป", lang: "txt" },

      { h: "🔬 เจาะลึก C: ทำไม pipeline ค้าง — pipe reference counting" },
      { p: "kernel นับว่ามีกี่ fd ที่ยัง 'เปิดปลายเขียน' ของ pipe อยู่ (write-end reference count). คนอ่านจะได้ EOF **ก็ต่อเมื่อ count = 0 เท่านั้น**" },
      { code: String.raw`สถานการณ์ค้าง (ลืมปิด write-end ใน parent):

  หลัง fork: write-end ถูกเปิดใน  parent, child1, child2 = 3 สำเนา
  child1 close + exec ls (ls จบ → ปิด)        → เหลือ 2
  child2 ปิด write-end ของตัวเอง               → เหลือ 1
  ★ parent "ลืม" close(pfd[1])                 → ยังเหลือ 1 !

  → write-end count ≠ 0 → pipe ไม่เกิด EOF
  → wc (ใน child2) อ่าน stdin รอ EOF ตลอดกาล → ค้าง 🔒`, cap: "วิธีแก้: parent ต้อง close ปลาย pipe ทั้งสองข้างทันทีหลัง fork ครบ", lang: "txt" },
      { note: "นี่คือทฤษฎีที่อยู่เบื้องหลังกฎ 'ปิด fd ให้ครบ' — ไม่ใช่แค่กันรั่ว แต่เป็นเงื่อนไขให้ pipeline จบได้จริง" },

      { h: "🔬 เจาะลึก D: exec แทนที่ memory ของ process" },
      { p: "process มี memory แบ่งเป็นส่วน ๆ. `execve` ทิ้งของเดิมทั้งหมดแล้วโหลดโปรแกรมใหม่:" },
      { code: String.raw`memory ของ process (จากที่อยู่สูง→ต่ำ):
  ┌───────────────┐ high
  │   stack       │ ← ตัวแปร local, call frames (โตลงล่าง)
  │      ↓        │
  │      ↑        │
  │   heap        │ ← malloc (โตขึ้นบน)
  ├───────────────┤
  │   bss/data    │ ← global/static
  │   text (code) │ ← โค้ดโปรแกรม
  └───────────────┘ low

execve(ls): ทุกส่วนข้างบนถูก "ล้างทิ้ง" แล้วแทนด้วยของ ls
  → ของที่ malloc ก่อน exec หายไปกับ image เดิม (ไม่นับเป็น leak)
  → PID เดิม แต่ "ตัวตน" เป็นโปรแกรมใหม่หมด`, cap: "ถ้า execve สำเร็จจะไม่ return; โค้ดบรรทัดถัดไปคือ error path เสมอ", lang: "txt" },
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Beej's Guide to Unix IPC", url: "https://beej.us/guide/bgipc/", note: "ไกด์ในตำนานเรื่อง pipe/fork/IPC อ่านสนุก เข้าใจง่าย" },
        { label: "man7 — fork(2)", url: "https://man7.org/linux/man-pages/man2/fork.2.html", note: "เอกสารทางการของ fork (return value, COW)" },
        { label: "man7 — pipe(2)", url: "https://man7.org/linux/man-pages/man2/pipe.2.html", note: "pipe + เงื่อนไข EOF/บล็อก" },
        { label: "man7 — dup2(2)", url: "https://man7.org/linux/man-pages/man2/dup.2.html", note: "การ redirect fd อย่างละเอียด" },
        { label: "man7 — execve(2)", url: "https://man7.org/linux/man-pages/man2/execve.2.html", note: "การแทนที่ program image" },
        { label: "Everything is a file — Wikipedia", url: "https://en.wikipedia.org/wiki/Everything_is_a_file", note: "ปรัชญา fd ของ Unix" },
      ]},
    ],
    foundations: [
      { h: "0) ปูพื้น: char ** คืออะไร (argv, envp, ผลของ ft_split)" },
      { p: "`char *` = pointer ไป string (จริง ๆ คือที่อยู่ของตัวอักษรตัวแรก). **`char **` = pointer ไป array ของ string** = 'รายการของหลาย ๆ string' เช่น argv, envp และผลลัพธ์ของ ft_split ล้วนเป็น `char **`" },
      { code: String.raw`argv → [ "./pipex" ][ "infile" ][ "ls -l" ][ "wc -l" ][ "outfile" ][ NULL ]
          argv[0]     argv[1]    argv[2]   argv[3]    argv[4]
each box = char*  (ที่อยู่ของ string) ; ปิดท้ายด้วย NULL`, cap: "argv เป็น array ของ char* ; ตัวสุดท้ายเป็น NULL เพื่อบอกจบ" },
      { p: "`envp` ก็เหมือนกัน แต่แต่ละ string หน้าตา `\"PATH=/usr/bin:/bin\"`, `\"HOME=/root\"` เราจึงวนหาอันที่ขึ้นต้น `\"PATH=\"`" },
      { h: "1) pipex ไม่มี struct ใหญ่ — ใช้ array of int แทน" },
      { p: "pipex จัดการทรัพยากรด้วย array เล็ก ๆ 2 ตัว ไม่ต้องมี struct ก็ได้:" },
      { code: String.raw`int pfd[2];   // pipe: pfd[0] = ปลายอ่าน, pfd[1] = ปลายเขียน
int fio[2];   // ไฟล์: fio[0] = infile fd, fio[1] = outfile fd`, cap: "pipe(pfd) จะเติมค่าให้ 2 ช่องนี้เอง — ส่ง pfd (ที่อยู่ของช่องแรก) เข้าไป", lang: "c" },
      { h: "2) ปูพื้น: file descriptor (fd) คือ 'ตัวเลขตั๋ว'" },
      { p: "ทุกไฟล์/pipe ที่เปิด OS จะคืน **เลขจำนวนเต็ม (fd)** มาเป็น 'ตั๋ว' ไว้อ้างถึง. มี 3 ตัวพิเศษเปิดให้ตั้งแต่ต้น:" },
      { table: { head: ["fd", "ชื่อ", "ปกติชี้ไป"], rows: [
        ["0", "STDIN", "คีย์บอร์ด"],
        ["1", "STDOUT", "หน้าจอ"],
        ["2", "STDERR", "หน้าจอ (error)"],
      ]}},
      { p: "`open()` คืน fd ใหม่ (เช่น 3,4,...). **fd ก็เป็นทรัพยากรเหมือน memory** — เปิดแล้วต้อง `close()` ไม่งั้น 'รั่ว' (fd leak) เปิดมากเกินจะเปิดไม่ได้อีก" },
      { h: "3) dup2 = 'เปลี่ยนปลายทางของตั๋ว'" },
      { code: String.raw`dup2(infile, STDIN_FILENO);   // ทำให้ fd 0 (stdin) ชี้ไปที่เดียวกับ infile
dup2(pfd[1], STDOUT_FILENO);  // ทำให้ fd 1 (stdout) ชี้ไปปลายเขียนของ pipe`, cap: "หลังบรรทัดนี้ เมื่อ cmd อ่าน stdin = อ่านจาก infile, เขียน stdout = เขียนเข้า pipe โดย cmd ไม่รู้ตัว", lang: "c" },
      { note: "หลัง dup2 ต้อง close fd ต้นฉบับ (infile, pfd[...]) เพราะตอนนี้ fd 0/1 ชี้ไปที่เดียวกันแล้ว เหลือ fd เกินไว้ = รั่ว และทำให้ pipe ไม่ปิด → cmd ค้างรอ EOF" },
      { h: "4) Memory: ft_split จอง char ** → ต้อง free_tab" },
      { p: "`ft_split` malloc ทั้ง array และทุก string ข้างใน → ต้องคืนให้ครบทั้งหมด" },
      { code: String.raw`void free_tab(char **tab) {
    int i = 0;
    if (!tab) return ;
    while (tab[i])          // free ทุก string ก่อน
        free(tab[i++]);
    free(tab);              // แล้วค่อย free ตัว array
}`, cap: "ลำดับสำคัญ: free string ข้างในก่อน แล้วค่อย free ตัว array (สลับกัน = leak/หา pointer ไม่เจอ)", lang: "c" },
      { code: String.raw`tmp  = ft_strjoin(dir, "/");   // จองชั่วคราว
full = ft_strjoin(tmp, cmd);
free(tmp);                     // คืน tmp ทันทีที่ไม่ใช้`, cap: "try_path: string ชั่วคราวต้อง free ทันทีหลังใช้ ไม่งั้นรั่วทีละนิดในลูป", lang: "c" },
      { h: "5) Memory ของ process ลูก" },
      { p: "หลัง `fork` ลูกได้สำเนา memory ของแม่. พอ `execve` สำเร็จ memory เดิม **ถูกแทนที่ทั้งหมด** (ของที่ malloc ไว้ก่อน execve หายไปกับ process image เดิม จึงไม่นับเป็น leak). แต่ถ้า execve ล้มเหลว เรา free + exit เองในลูก" },
    ],
    architecture: [
      { code: String.raw`main.c        ตรวจ argc==5 → pipex(argv, envp)
pipex.c       open_files → pipe → fork_children (child1, child2)
path.c        get_path(): หา cmd จาก PATH ; exec_cmd(): split+execve
utils.c       free_tab / error_exit
main_bonus.c  รองรับ here_doc + หลาย pipe (argc ยืดหยุ่น)
pipex_bonus.c here_doc() + run_cmds() rolling-pipe`, cap: "file map" },
      { h: "flow ของ data" },
      { code: String.raw`infile --(dup2 stdin)--> [child1: cmd1] --(stdout→pipe[1])
                                                    |
                              pipe[0]→stdin         v
outfile <--(dup2 stdout)-- [child2: cmd2] <--------- pipe`, cap: "ท่อเชื่อม 2 process" },
    ],
    dataflow: [
      { p: "ไล่ **ทุกฟังก์ชัน** ของ pipex ว่ารับ fd/string อะไรมาจากใคร แล้วส่งต่อให้ใคร — เน้นการไหลของ file descriptor" },
      { h: "ภาพรวมการเรียก (call flow)" },
      { code: String.raw`main(argc, argv, envp)
 ├─ argc != 5 ? ─► usage ─► exit(1)
 └─ pipex(argv, envp)
      ├─ open_files(argv[1], argv[4], fio) ─► open() ×2 ─► fio[0]=infile, fio[1]=outfile
      ├─ pipe(pfd) ─► pfd[0]=read, pfd[1]=write
      └─ fork_children(pfd, fio, argv, envp)
            ├─ fork ─► child1(pfd, fio[0], argv[2], envp)
            │            └► dup2(stdin←infile, stdout←pfd[1]) ► close ► exec_cmd(argv[2])
            ├─ fork ─► child2(pfd, fio[1], argv[3], envp)
            │            └► dup2(stdin←pfd[0], stdout←outfile) ► close ► exec_cmd(argv[3])
            └─ parent: close(pfd,fio) ─► waitpid ×2

exec_cmd(cmd, envp) ─► ft_split(cmd,' ') ─► get_path(args[0],envp)
                                              └► get_env_path / ft_split(':') / search_dirs ─► try_path
                                         ─► execve(path, args, envp)`, cap: "ลูกศร = เรียก/ส่งต่อ; fd ไหลจาก open/pipe → fork_children → child → dup2", lang: "txt" },
      { note: "การไหลหลักคือ **fd (เลขจำนวนเต็ม)**: open/pipe สร้าง fd → ส่งผ่าน array fio[]/pfd[] เข้า fork_children → แจกให้ child → child เอาไป dup2 เป็น stdin/stdout ก่อน exec" },

      { h: "🔗 ไล่ชีวิตของ 'cmd1' (argv[2] → โปรแกรมที่รัน)" },
      { code: String.raw`argv[2] = "ls -l"
  └► child1 รับมาเป็น cmd
  └► exec_cmd("ls -l")
       └► ft_split → args = ["ls", "-l", NULL]
       └► get_path("ls", envp)
            └► get_env_path → "/usr/bin:/bin"
            └► ft_split(':') → ["/usr/bin","/bin"]
            └► search_dirs → try_path("/bin","ls") → access("/bin/ls",X_OK)=OK
            └► คืน "/bin/ls"
       └► execve("/bin/ls", ["ls","-l",NULL], envp)
            → process กลายเป็น ls อ่าน stdin(=infile) เขียน stdout(=pipe)`, cap: "string เดินทางจาก argv → split → path resolution → execve", lang: "txt" },

      { h: "main.c / pipex.c — โครงหลัก" },
      { table: { head: ["ฟังก์ชัน", "ทำไมถึงมี", "รับ · จากใคร", "คืน/ส่งต่อ · ให้ใคร"], rows: [
        ["usage (static)", "พิมพ์วิธีใช้เมื่อ argc ผิด", "— · จาก main", "เขียน stderr"],
        ["main", "ตรวจ argc=5 แล้วเริ่ม", "argc,argv,envp · จาก OS", "เรียก pipex"],
        ["open_files (static)", "เปิด infile/outfile ลงใน array", "ชื่อไฟล์,fio[] · จาก pipex", "เติม fio[0],fio[1]"],
        ["child1 (static)", "process รัน cmd1 (stdin=infile)", "pfd,infile,cmd,envp · จาก fork_children", "dup2+close → exec_cmd"],
        ["child2 (static)", "process รัน cmd2 (stdout=outfile)", "pfd,outfile,cmd,envp · จาก fork_children", "dup2+close → exec_cmd"],
        ["fork_children (static)", "fork 2 ลูก + parent ปิด fd + wait", "pfd,fio,argv,envp · จาก pipex", "fork→child1/child2; waitpid"],
        ["pipex", "ลำดับงานหลัก: เปิดไฟล์→pipe→fork", "argv,envp · จาก main", "เรียก 3 ตัวบน"],
      ]}},
      { h: "path.c — หา/รัน command" },
      { table: { head: ["ฟังก์ชัน", "ทำไมถึงมี", "รับ · จากใคร", "คืน · ให้ใคร"], rows: [
        ["get_env_path (static)", "ดึงค่า PATH จาก envp", "envp · จาก get_path", "ชี้ไปหลัง \"PATH=\" → get_path"],
        ["try_path (static)", "ต่อ dir+'/'+cmd แล้วเช็ค execute ได้", "dir,cmd · จาก search_dirs", "full path หรือ NULL"],
        ["search_dirs (static)", "วนทุก dir เรียก try_path", "dirs[],cmd · จาก get_path", "full path หรือ NULL"],
        ["get_path(cmd,envp)", "หา path เต็มของ cmd (หรือใช้ตรงถ้ามี '/')", "cmd,envp · จาก exec_cmd", "full path → exec_cmd"],
        ["exec_cmd(cmd,envp)", "split cmd → หา path → execve", "cmd,envp · จาก child1/2/run_child", "execve (ไม่ return) / exit"],
      ]}},
      { h: "utils.c / bonus" },
      { table: { head: ["ฟังก์ชัน", "ทำไมถึงมี", "รับ · จากใคร", "ผล"], rows: [
        ["free_tab(tab)", "คืน char** จาก ft_split ให้ครบ", "char** · จาก exec_cmd/path", "free string ทุกตัว + array"],
        ["error_exit(msg)", "พิมพ์ error + exit เมื่อ fatal", "ข้อความ · จากทุก error path", "perror/exit(1)"],
        ["here_doc (static)", "[bonus] อ่าน stdin จนเจอ LIMITER ลง pipe", "limiter · จาก pipex_bonus", "fd อ่านของ pipe → ใช้เป็น infile"],
        ["open_out_bonus (static)", "[bonus] เปิด outfile (append/trunc)", "file,append · จาก pipex_bonus", "fd → fds[1]"],
        ["run_child (static)", "[bonus] fork+dup2+exec 1 cmd", "in,out,cmd,envp · จาก run_cmds", "คืน pid"],
        ["run_cmds (static)", "[bonus] rolling pipe ต่อ N คำสั่ง", "cmds,n,envp,fds · จาก pipex_bonus", "run_child วนลูป + waitpid"],
        ["pipex_bonus", "[bonus] คุม here_doc + หลาย pipe", "argc,argv,envp · จาก main_bonus", "เรียก run_cmds"],
      ]}},
    ],
    implementation: [
      { h: "1) เปิดไฟล์ (pipex.c)" },
      { code: String.raw`fd_io[0] = open(file_in, O_RDONLY);
if (fd_io[0] < 0)
    perror(file_in);          // infile หาย → ไม่ exit (cmd2 ยังรัน, สร้าง outfile)
fd_io[1] = open(file_out, O_WRONLY | O_CREAT | O_TRUNC, 0644);
if (fd_io[1] < 0)
    error_exit(file_out);     // outfile เปิดไม่ได้ = fatal`, cap: "เลียนแบบ shell: infile หายไม่ถึงตาย แต่ outfile สำคัญ", lang: "c" },
      { h: "2) Child เปลี่ยนทิศ stdin/stdout (pipex.c)" },
      { code: String.raw`// child1 (cmd1): อ่าน infile → เขียนเข้า pipe
dup2(infile, STDIN_FILENO);
dup2(pfd[1], STDOUT_FILENO);
close(pfd[0]); close(pfd[1]); close(infile);
exec_cmd(cmd, envp);
// child2 (cmd2): อ่านจาก pipe → เขียน outfile
dup2(pfd[0], STDIN_FILENO);
dup2(outfile, STDOUT_FILENO);`, cap: "หลัง dup2 ต้อง close fd เดิมทั้งหมด มิฉะนั้น pipe ไม่ปิด → cmd2 รอ EOF ค้าง", lang: "c" },
      { h: "3) Parent ปิด fd แล้ว wait (pipex.c)" },
      { code: String.raw`close(pfd[0]); close(pfd[1]);   // parent ไม่ใช้ pipe เลย ต้องปิด!
if (fio[0] >= 0) close(fio[0]);
close(fio[1]);
waitpid(pid1, NULL, 0);
waitpid(pid2, NULL, 0);`, cap: "ถ้า parent ไม่ปิด write-end ของ pipe → cmd2 จะไม่ได้ EOF และค้าง", lang: "c" },
      { h: "4) หา path ของ command (path.c)" },
      { code: String.raw`if (ft_strchr(cmd, '/'))                 // มี / → เป็น absolute/relative
    return (access(cmd, X_OK) == 0 ? ft_strdup(cmd) : NULL);
path_env = get_env_path(envp);           // หา "PATH=" ใน envp
dirs = ft_split(path_env, ':');          // แยกแต่ละ dir
return (search_dirs(dirs, cmd));          // ลอง dir/cmd + access(X_OK)`, cap: "ถ้าไม่เจอ → \"command not found\" → exit(127)", lang: "c" },
      { h: "5) Bonus: here_doc + หลาย pipe (pipex_bonus.c)" },
      { code: String.raw`// rolling pipe: prev_fd ส่งต่อเป็น stdin ของ cmd ถัดไป
prev = fds[0];                       // เริ่มจาก infile (หรือ here_doc)
while (i < n - 1) {
    pipe(pfd);
    run_child(prev, pfd[1], cmds[i], envp);
    close(pfd[1]);
    if (prev != fds[0]) close(prev);
    prev = pfd[0];                   // pipe นี้กลายเป็น input ของ cmd ถัดไป
    i++;
}
run_child(prev, fds[1], cmds[n-1], envp);  // cmd สุดท้าย → outfile`, cap: "ขยายจาก 2 เป็น N commands ด้วยการเลื่อน pipe", lang: "c" },
    ],
    tricks: [
      { ul: [
        "**ปิด fd ให้ครบ** หลัง dup2 — fd ที่ลืมปิดคือสาเหตุอันดับ 1 ที่ pipeline ค้าง (cmd รอ EOF ที่ไม่มีวันมา)",
        "**infile หาย ≠ fatal** ใช้ perror ไม่ exit ให้เหมือน shell (outfile ยังถูกสร้าง)",
        "**execve ไม่ return ถ้าสำเร็จ** — โค้ดหลัง execve = error path เสมอ (exit 1)",
        "**command not found → exit(127)** ตามมาตรฐาน shell",
        "**rolling pipe** สำหรับ bonus: เก็บ prev_fd ส่งต่อ → รองรับ N commands ด้วย loop เดียว",
        "**here_doc** เขียน stdin ลง pipe จนเจอ LIMITER → ใช้ read-end เป็น stdin ของ cmd แรก, outfile เปิดแบบ O_APPEND",
        "**free_tab ทุก ft_split** — split คืน array of strings ต้อง free ทุกตัว + ตัว array",
      ]},
    ],
    eval: [
      { qa: [
        { q: "fork ทำงานยังไง?", a: "สร้างสำเนา process; ในลูก fork คืน 0, ใน parent คืน pid ของลูก เราใช้ค่านี้แยกว่าโค้ดส่วนไหนรันในลูก/แม่" },
        { q: "dup2 ทำอะไร ทำไมต้องใช้?", a: "ทำให้ fd ปลายทาง (เช่น STDIN/STDOUT) ชี้ไปไฟล์/pipe ที่เราต้องการ เพื่อให้ cmd ที่ execve อ่าน/เขียนจากที่ถูกต้องโดยไม่รู้ตัว" },
        { q: "ทำไม pipeline ถึงค้าง (hang)?", a: "เพราะมี process ยังถือ write-end ของ pipe เปิดอยู่ (เช่น parent หรือ child อื่นไม่ปิด) cmd ฝั่งอ่านเลยไม่ได้ EOF ต้องปิด fd ทุกตัวที่ไม่ใช้" },
        { q: "หา path ของ cmd ยังไง ถ้าไม่มี PATH?", a: "split PATH ด้วย ':' แล้วลอง dir/cmd + access(X_OK); ถ้า cmd มี '/' ใช้ตรง ๆ; ถ้าไม่เจอ PATH หรือ cmd → command not found, exit 127" },
        { q: "ทำไม execve ต้องส่ง envp?", a: "เพื่อให้โปรแกรมลูกมี environment เดิม (รวม PATH) บางคำสั่งต้องใช้ env" },
        { q: "ถ้า infile ไม่มีอยู่ ควรเกิดอะไร?", a: "เหมือน shell: cmd1 ไม่รัน/พิมพ์ error แต่ cmd2 ยังทำงานและ outfile ถูกสร้าง (โค้ด perror ไม่ exit, child1 exit(1) ถ้า fd<0)" },
        { q: "here_doc ทำงานยังไง? (bonus)", a: "อ่าน stdin ทีละบรรทัด เขียนเข้า pipe จนกว่าบรรทัดจะตรง LIMITER แล้วใช้ read-end ของ pipe เป็น stdin ของ cmd แรก; outfile เปิดแบบ append" },
        { q: "zombie process คืออะไร ป้องกันยังไง?", a: "child ที่จบแล้วแต่ parent ยังไม่ wait; เราเรียก waitpid ทุก child (bonus ใช้ while waitpid(-1)) จึงไม่มี zombie" },
      ]},
      { h: "ทดสอบเทียบกับ shell" },
      { code: String.raw`./pipex infile "grep a" "wc -l" outfile
< infile grep a | wc -l > expected      # ผลต้องเท่ากัน
diff outfile expected
valgrind --leak-check=full ./pipex infile "ls" "cat" outfile`, lang: "bash" },
    ],
  },
},

/* ===================== SO_LONG ===================== */
{
  id: "so_long",
  name: "so_long",
  tag: { th: "เกม 2D เก็บของแล้วหาทางออก — บทเรียน MiniLibX + ทฤษฎีกราฟ", en: "A 2D collect-and-escape game — MiniLibX + graph theory" },
  accent: "#fcab5e",
  sections: {
    principle: [
      { h: "โจทย์คืออะไร" },
      { p: "เกม 2D: ผู้เล่นเดินเก็บ collectibles ให้ครบแล้วไปที่ exit. อ่านแผนที่จากไฟล์ `.ber` (`0`=พื้น, `1`=กำแพง, `C`=เหรียญ, `E`=ทางออก, `P`=ผู้เล่น)" },
      { h: "สิ่งที่ต้อง validate ก่อนเล่น" },
      { ul: [
        "ไฟล์ต้องลงท้าย .ber และเปิดอ่านได้",
        "แผนที่เป็นสี่เหลี่ยม (ทุกแถวกว้างเท่ากัน)",
        "ล้อมรอบด้วยกำแพง 1 ทุกด้าน",
        "มี P เพียง 1, E เพียง 1, C อย่างน้อย 1",
        "มีทางเดินจาก P ไปถึง C ทุกตัวและ E (เช็คด้วย flood fill)",
      ]},
      { note: "MiniLibX = library วาดหน้าต่าง/รูป/รับ event แบบง่าย (mlx_init, mlx_new_window, mlx_put_image_to_window, mlx_hook, mlx_loop)" },
      { h: "ที่มาที่ไป: ทำไม so_long เน้น 'ตรวจแผนที่' มากกว่าตัวเกม" },
      { p: "ตัวเกมจริง ๆ (เดิน/เก็บ/ออก) เขียนไม่ยาก. สิ่งที่ subject เน้นและกรรมการชอบลองคือ **ความทนทานต่อ input ที่พัง** — ไฟล์ผิดนามสกุล, แผนที่ไม่เป็นสี่เหลี่ยม, กำแพงไม่ปิด, ไม่มีทางออก, ทางตัน. โปรแกรมต้องไม่ crash และต้องขึ้น Error สวย ๆ. ดังนั้นหัวใจคือ **parse + validate ที่รัดกุม**" },
      { h: "ทำไมเลือก flood fill ตรวจทางเดิน (เทียบทางเลือก)" },
      { table: { head: ["วิธีเช็คว่าเดินถึงไหม", "ข้อดี/ข้อเสีย"], rows: [
        ["Flood fill (recursion 4 ทิศ)", "เขียนสั้นมาก ~5 บรรทัด, เข้าใจง่าย; เหมาะแผนที่ขนาดเรียน (ลึก recursion ไม่เกิน)"],
        ["BFS/DFS ด้วย queue/stack เอง", "ควบคุมหน่วยความจำได้ แต่โค้ดยาวกว่า, ต้องจัดการ queue เอง"],
        ["ตรวจเชิงสูตร", "ทำไม่ได้ — ความ 'เดินถึง' ต้องสำรวจกราฟจริงเท่านั้น"],
      ]}},
      { p: "**เหตุผลที่เลือก flood fill:** มันคือ DFS ที่เขียนด้วย recursion สั้นที่สุด ตรงกับสเกลของแผนที่ในโปรเจกต์ (ไม่ใหญ่จน stack overflow). ไอเดียคือ 'ระบาย' พื้นที่ที่เดินถึงจากตำแหน่งผู้เล่น แล้วถ้ายังเหลือ C/E ที่ไม่ถูกระบาย = เดินไปไม่ถึง = แผนที่ใช้ไม่ได้" },
      { note: "ทำไมต้องทำบน 'สำเนา': flood fill เขียนทับช่องเป็น 'V' เพื่อกันเดินซ้ำ — ถ้าทำบนแผนที่จริง แผนที่จะพังตอนเอาไปเล่น จึงสำเนาไว้เช็ค แล้วทิ้ง" },
      { h: "ทำไมเก็บแผนที่เป็น char ** (array ของ string)" },
      { p: "ไฟล์ `.ber` เป็นข้อความหลายบรรทัดอยู่แล้ว — แตกด้วย `ft_split('\\n')` ได้ `char**` ที่ `grid[y][x]` = ช่อง (x,y) พอดี เป็นการแมพ 1:1 จากไฟล์สู่โครงสร้าง ทำให้ตรวจ/วาด/เดินใช้พิกัดเดียวกันหมด" },
      { h: "ทำไมต้องมี camera (ไม่วาดทั้งแผนที่)" },
      { p: "ถ้าแผนที่ใหญ่กว่าหน้าต่าง การวาดทุกช่องจะล้นจอและเปลือง. แนวคิด camera คือ 'วาดเฉพาะส่วนที่มองเห็น' โดยเลื่อนกรอบตามผู้เล่น — เป็นหลักการเดียวกับเกม 2D ทั่วไป (viewport/scrolling)" },
    ],
    theory: [
      { p: "so_long รวมทฤษฎี **กราฟ + กราฟิก + เกม** เข้าด้วยกัน" },
      { h: "1) ทฤษฎีกราฟ (Graph) & การเชื่อมต่อ" },
      { p: "กราฟ = เซตของ **โหนด (node)** เชื่อมกันด้วย **เส้น (edge)**. แผนที่เกมคือกราฟชนิดหนึ่ง: แต่ละช่องเดินได้ = โหนด, ช่องที่ติดกัน (บน/ล่าง/ซ้าย/ขวา) = edge. คำถาม 'เดินจาก P ถึง C/E ได้ไหม' = ปัญหา **connectivity (ความเชื่อมต่อ)** ในกราฟ" },
      { h: "2) การท่องกราฟ: DFS / BFS / Flood fill" },
      { ul: [
        "**DFS (Depth-First):** ไปให้สุดทางก่อนแล้วค่อยถอย — เขียนด้วย recursion ง่ายที่สุด",
        "**BFS (Breadth-First):** แผ่ออกทีละชั้น — ใช้ queue, เหมาะหาเส้นทางสั้นสุด",
        "**Flood fill** = DFS/BFS ที่ 'ระบายสี' ทุกช่องที่เชื่อมถึงกัน (เหมือนถังสีใน Paint) — so_long ใช้ตรวจว่าระบายจาก P แล้วถึง C/E ครบไหม",
      ]},
      { h: "3) Recursion & call stack" },
      { p: "Recursion = ฟังก์ชันเรียกตัวเอง โดยมี **base case** หยุด. ทุกครั้งที่เรียก ระบบ push 'เฟรม' (ตัวแปร local + จุดกลับ) ลง **call stack**. flood_fill เรียกตัวเอง 4 ทิศ — ต้องมี base case (เจอกำแพง/เคยมาแล้ว) ไม่งั้น recursion ไม่จบ → **stack overflow**" },
      { note: "นี่คือเหตุผลว่าทำไม flood fill เหมาะกับแผนที่ขนาดเรียน แต่ถ้าแผนที่ใหญ่มากต้องเปลี่ยนเป็น BFS แบบ queue เพื่อไม่ให้ call stack ล้น" },
      { h: "4) 2D array / matrix" },
      { p: "แผนที่เก็บเป็นตาราง 2 มิติ เข้าถึงด้วย `grid[y][x]` (y = แถว, x = คอลัมน์). ในหน่วยความจำมันคือ array ของ pointer ที่แต่ละตัวชี้ไป array ของ char (1 แถว)" },
      { h: "5) ระบบพิกัด (coordinate systems)" },
      { p: "ต้องแยก 2 ระบบ: **พิกัดกริด** (x,y เป็นช่อง) กับ **พิกัดจอ** (พิกเซล). สูตรแปลง: `พิกเซล = (ช่อง − กล้อง) × ขนาด tile`. สังเกตว่าแกน y ของจอชี้ **ลง** (ไม่ใช่ขึ้นแบบคณิต) — ทฤษฎีพื้นฐานของกราฟิกคอมพิวเตอร์" },
      { h: "6) Game loop & Event-driven programming" },
      { p: "โปรแกรมทั่วไปทำงานบนลงล่างแล้วจบ แต่เกม/GUI ทำงานแบบ **event-driven**: เข้าสู่ลูปไม่รู้จบ (`mlx_loop`) แล้ว 'รอเหตุการณ์' (กดปุ่ม/ปิดหน้าต่าง) เกิดขึ้นค่อยเรียก callback ที่เราผูกไว้ (hook). นี่คือสถาปัตยกรรมพื้นฐานของซอฟต์แวร์โต้ตอบทุกชนิด" },
      { h: "7) Finite State Machine (FSM)" },
      { p: "เกมมี 'สถานะ' ชัดเจน (กำลังเล่น / ชนะ / ปิด) และเปลี่ยนสถานะตาม event. แนวคิด FSM = ระบบที่อยู่ได้ทีละสถานะ และมีกฎการเปลี่ยนสถานะ — ใช้คิดเรื่อง logic ของเกมให้ชัดเจน (และเป็นแนวคิดเดียวกับ LangGraph/pipeline ในระบบใหญ่)" },
      { h: "8) Raster graphics: framebuffer, tile, sprite, double buffering" },
      { ul: [
        "**Raster/bitmap:** ภาพคือตารางพิกเซล แต่ละพิกเซลมีสี",
        "**Tile:** ภาพเล็กซ้ำ ๆ (กำแพง/พื้น) ต่อกันเป็นฉาก — ประหยัดและเป็นมาตรฐานเกม 2D",
        "**Sprite:** ภาพวัตถุที่ขยับได้ (ผู้เล่น/เหรียญ) วาดทับฉาก",
        "**Double buffering:** วาดลงภาพในหน่วยความจำให้เสร็จก่อน แล้วค่อยโยนขึ้นจอทีเดียว → ลดอาการกระพริบ (เป็นเหตุผลที่วาดลง image แล้ว put ทีเดียว)",
      ]},

      { h: "🔬 เจาะลึก A: ความซับซ้อนของ DFS/BFS + ไล่ flood fill ทีละขั้น" },
      { p: "การท่องกราฟเยี่ยมทุกโหนด 1 ครั้งและทุก edge จำกัดครั้ง → ความซับซ้อน **O(V + E)**. สำหรับแผนที่กริด w×h: V = w·h ช่อง, แต่ละช่องมีเพื่อนบ้าน ≤ 4 → E ≈ 4V → รวมยังเป็น O(V) = O(w·h) (เป็นเชิงเส้นกับจำนวนช่อง)" },
      { code: String.raw`ไล่ flood_fill จาก P บนกริดเล็ก (1=กำแพง):
  1 1 1 1            1 1 1 1
  1 P 0 1     →      1 V V 1     (V = ระบายแล้ว)
  1 0 C 1            1 V V 1
  1 1 1 1            1 1 1 1

ลำดับเรียก (DFS): fill(1,1)=P
  → mark V → ลองขวา(2,1)=0 → mark V
      → ลองขวา(3,1)=1 หยุด ; ลง(2,2)=C? ...เดินต่อ
  → ... จนทุกช่องที่ติดต่อกันถูก mark เป็น V

เช็คผล: ยังเหลือ C/E ที่ไม่ใช่ V ไหม? ไม่เหลือ → เดินถึงครบ ✓`, cap: "flood fill = DFS ที่ทิ้งรอย 'V' กันเดินซ้ำ (นี่คือ base case ที่ทำให้ recursion จบ)", lang: "txt" },

      { h: "🔬 เจาะลึก B: recursion, call stack และ stack overflow" },
      { p: "ทุกการเรียก flood_fill ซ้อนกัน จะ push เฟรมลง call stack. ความลึกสูงสุด = ความยาวเส้นทางที่ยาวที่สุดในพื้นที่ว่าง" },
      { code: String.raw`call stack ตอน fill ลึก ๆ:
  fill(1,1)
   └ fill(2,1)
      └ fill(3,1)
         └ fill(4,1) ...     ← แต่ละชั้นกินหน่วยความจำ stack

ถ้าพื้นที่ว่างใหญ่มาก (เช่น 5000×5000 ทางตรงยาว)
ความลึก recursion อาจเกินขนาด stack (ปกติ ~8 MB)
→ stack overflow → segfault

→ สำหรับแผนที่ใหญ่มากต้องเปลี่ยนเป็น BFS แบบ queue (วนลูป ไม่ recursion)
  แต่ขนาดแผนที่ในโปรเจกต์เล็กพอ → recursion ปลอดภัยและสั้นกว่า`, cap: "trade-off: recursion สั้น/อ่านง่าย แต่จำกัดด้วยขนาด stack", lang: "txt" },

      { h: "🔬 เจาะลึก C: อนุพันธ์สูตร camera (พิกัดจอ ↔ แผนที่)" },
      { p: "อยากให้ผู้เล่นอยู่กลางจอเสมอ จึงเลื่อนกล้องตามผู้เล่น แล้ว clamp ไม่ให้เห็นนอกแผนที่:" },
      { code: String.raw`อยากให้ผู้เล่นอยู่กลางจอ:
  cam = player − (จำนวน tile ครึ่งจอ)
  cam_x = px − (WIN_W / TILE) / 2

clamp ไม่ให้กล้องเลยขอบ:
  ถ้า cam < 0            → cam = 0           (ชิดซ้าย/บน)
  ถ้า cam > map − จอ     → cam = map − จอ      (ชิดขวา/ล่าง)

แปลงช่อง (x,y) เป็นพิกเซลบนจอ:
  screen_x = (x − cam_x) × TILE
  screen_y = (y − cam_y) × TILE   (y ของจอชี้ลง!)`, cap: "เป็นการ 'เลื่อน frame of reference' — หลักการเดียวกับกล้องในเกมทุกชนิด", lang: "txt" },

      { h: "🔬 เจาะลึก D: Finite State Machine แบบเป็นทางการ" },
      { p: "FSM นิยามเป็น 5 ส่วน (Q, Σ, δ, q₀, F). ของ so_long:" },
      { code: String.raw`Q  (สถานะ)     = { กำลังเล่น, ชนะ, ปิดเกม }
Σ  (input)     = { กดทิศ, ถึง E ครบเหรียญ, ESC/ปิดหน้าต่าง }
q₀ (เริ่ม)     = กำลังเล่น
F  (สถานะจบ)   = { ชนะ, ปิดเกม }
δ  (transition):
   กำลังเล่น --ถึง E ครบเหรียญ--> ชนะ --> exit
   กำลังเล่น --ESC/ปิด--------> ปิดเกม --> exit
   กำลังเล่น --กดทิศ (ไม่ชน)---> กำลังเล่น (อัปเดตตำแหน่ง)`, cap: "การคิดเป็น FSM ทำให้ logic ชัด ครบทุกกรณี — แนวคิดเดียวกับ state machine ในระบบใหญ่ (เช่น LangGraph)", lang: "txt" },
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Graph theory — Wikipedia", url: "https://en.wikipedia.org/wiki/Graph_theory", note: "พื้นฐานกราฟ + ความเชื่อมต่อ (connectivity)" },
        { label: "Flood fill — Wikipedia", url: "https://en.wikipedia.org/wiki/Flood_fill", note: "อัลกอริทึมระบายพื้นที่ + เวอร์ชัน recursive/queue" },
        { label: "VisuAlgo — DFS/BFS (ภาพเคลื่อนไหว)", url: "https://visualgo.net/en/dfsbfs", note: "ดูการท่องกราฟทำงานทีละขั้น" },
        { label: "MiniLibX docs (Harm Smits 42docs)", url: "https://harm-smits.github.io/42docs/libs/minilibx", note: "คู่มือ mlx ที่ละเอียดสุดสำหรับชาว 42" },
        { label: "Game Programming Patterns — Game Loop", url: "https://gameprogrammingpatterns.com/game-loop.html", note: "ทฤษฎี event loop ของเกม/GUI" },
        { label: "Game Programming Patterns — State (FSM)", url: "https://gameprogrammingpatterns.com/state.html", note: "Finite State Machine แบบเล่าให้คนเขียนเกมเข้าใจ" },
      ]},
    ],
    foundations: [
      { h: "0) ปูพื้น: ทำไมเก็บทุกอย่างไว้ใน struct เดียว" },
      { p: "เกมมี 'สถานะ' เยอะมาก (หน้าต่าง, รูป, แผนที่, ตำแหน่งผู้เล่น, จำนวนก้าว...) ถ้าแยกเป็นตัวแปรเดี่ยว ๆ จะส่งเข้าฟังก์ชันลำบาก เราจึงรวมไว้ใน **struct เดียว `t_game`** แล้วส่ง 'ที่อยู่ของมัน' (`&game`) ไปทุกฟังก์ชัน" },
      { h: "1) struct ถูกสร้างเป็นชั้น ๆ (nested struct)" },
      { code: String.raw`typedef struct s_map {
    char  **grid;        // แผนที่ = array ของ string (แต่ละ string = 1 แถว)
    int   width, height; // ขนาด (หน่วย tile)
    int   collectibles, exits, players;  // นับไว้ตอน parse
}   t_map;

typedef struct s_game {
    void  *mlx;          // ตัวจัดการ mlx (opaque pointer)
    void  *win;          // หน้าต่าง
    void  *img[5];       // รูป 5 แบบ (กำแพง/พื้น/ผู้เล่น/เหรียญ/ทางออก)
    t_map map;           // struct ซ้อนใน struct
    int   px, py;        // ตำแหน่งผู้เล่น
    int   collected, moves;
    int   cam_x, cam_y;  // มุมกล้อง
}   t_game;`, cap: "t_map อยู่ 'ข้างใน' t_game เลย (ไม่ใช่ pointer) → เข้าถึงด้วย game.map.width", lang: "c" },
      { note: "`void *` = pointer ที่ไม่ระบุชนิด. mlx คืน void* มาให้เราเก็บไว้ส่งกลับเข้า mlx โดยเราไม่ต้องรู้โครงสร้างข้างใน (เรียกว่า opaque pointer)" },
      { h: "2) char **grid = แผนที่ 2 มิติ" },
      { code: String.raw`grid → [ "111111" ]   ← grid[0]  (แถวบนสุด)
        [ "10C0E1" ]   ← grid[1]
        [ "111111" ]   ← grid[2]
        [  NULL    ]
grid[y][x] = ตัวอักษรช่อง (x,y)   เช่น grid[1][2] = 'C'`, cap: "array ของ string; grid[y] = แถว, grid[y][x] = 1 ตัวอักษร" },
      { h: "3) สร้าง struct ให้สะอาดด้วย ft_bzero" },
      { code: String.raw`t_game game;
ft_bzero(&game, sizeof(t_game));   // เซ็ตทุก byte เป็น 0 ก่อนใช้`, cap: "ทริค: zero ทั้ง struct ก่อน → pointer ทุกตัวเป็น NULL, ตัวนับเป็น 0 → free ปลอดภัยแม้ error ตั้งแต่ต้น", lang: "c" },
      { p: "ถ้าไม่ทำ ค่าใน struct จะเป็นขยะ (garbage) — เผลอ free pointer ขยะ = crash" },
      { h: "4) ทำไมส่ง &game (pointer) ไม่ส่ง game" },
      { p: "ถ้าส่ง `game` เฉย ๆ C จะ **ก๊อปทั้ง struct** (ช้า + แก้ไม่ติด ตัวจริงไม่เปลี่ยน). ส่ง `&game` (ที่อยู่) → ทุกฟังก์ชันแก้ตัวจริงตัวเดียวกัน เช่น `try_move` เพิ่ม `game->moves` แล้วทั้งเกมเห็นค่าใหม่" },
      { code: String.raw`void try_move(t_game *game, int dx, int dy) {
    game->px = nx;        // game-> เพราะ game เป็น pointer
    game->moves++;        // แก้ตัวจริง ทุกที่เห็นเหมือนกัน
}`, lang: "c" },
      { h: "5) Memory: จองอะไรบ้าง คืนยังไง" },
      { ul: [
        "**grid** มาจาก ft_split → ต้อง free ทุกแถว + ตัว array (ใน free_game)",
        "**copy ของ grid** ใน validate (สำหรับ flood fill) → free ทันทีหลังเช็คเสร็จในฟังก์ชันเดียวกัน",
        "**textures (img[])** มาจาก mlx → คืนด้วย `mlx_destroy_image` ไม่ใช่ free ธรรมดา",
        "**window/display** → `mlx_destroy_window` / `mlx_destroy_display`",
      ]},
      { code: String.raw`copy = copy_grid(game);          // จองสำเนา
flood_fill(copy, game->px, game->py);
ok = check_reachable(game, copy);
i = 0;                            // แล้ว free สำเนาทันที
while (i < game->map.height)
    free(copy[i++]);
free(copy);`, cap: "validate.c: สำเนาถูกจองและคืนภายในฟังก์ชันเดียว — ไม่หลุดออกไปรั่วที่อื่น", lang: "c" },
      { note: "ทุก error_exit เรียก free_game ก่อน exit เสมอ → แม้ map ผิดกลางคันก็ไม่ leak (ตรวจด้วย valgrind)" },
    ],
    architecture: [
      { code: String.raw`src/main.c      argc check → parse → validate → mlx → hooks → loop
src/parse.c     อ่านไฟล์ .ber → ft_split เป็น grid → นับ C/E/P
src/validate.c  เช็คกำแพง + flood fill หาทางเดิน (บน copy ของ grid)
src/render.c    load textures (.xpm) + วาดทีละ tile + camera
src/player.c    handle_key (WASD/ลูกศร) + try_move + win condition
src/error.c     error_exit
src/free.c      คืน memory ทั้งหมด
*_bonus.c       เพิ่ม: gravity/jump, ศัตรู, หลาย level, animation`, cap: "file map" },
      { h: "struct หลัก (so_long.h)" },
      { code: String.raw`typedef struct s_game {
    void  *mlx; void *win; void *img[5];
    t_map map;
    int   px, py;          // ตำแหน่งผู้เล่น (หน่วย tile)
    int   collected, moves;
    int   cam_x, cam_y;    // มุมกล้อง (สำหรับแผนที่ใหญ่)
}   t_game;`, lang: "c" },
    ],
    dataflow: [
      { p: "ไล่ **ทุกฟังก์ชัน** ของ so_long ว่ารับอะไรมาจากใคร ส่งต่อให้ใคร — เน้นการไหลของ `&game` และ `grid`" },
      { h: "ภาพรวมการเรียก (call flow)" },
      { code: String.raw`main(ac, av)
 ├─ ac != 2 ? ─► Error
 ├─ ft_bzero(&game)                       ← เคลียร์ struct ให้ pointer = NULL
 ├─ parse_map(&game, av[1])
 │     ├─ read_file ─► เช็ค .ber + read ► ft_strdup(buf)
 │     ├─ build_grid ─► ft_split('\n') ► game.map.grid (char**)
 │     └─ count_chars ─► scan_tile (ทุกช่อง) ► นับ C/E/P, เก็บ px,py
 ├─ validate_map(&game)
 │     ├─ check_walls
 │     └─ copy_grid ─► flood_fill(copy, px, py) ─► check_reachable
 ├─ init_mlx(&game) ─► mlx_init / mlx_new_window
 ├─ load_textures(&game) ─► mlx_xpm_file_to_image ×5
 ├─ render_map(&game) ─► update_camera ─► render_tile (ทุกช่องในจอ)
 ├─ mlx_key_hook(handle_key) ; mlx_hook(17, handle_close)
 └─ mlx_loop ──────────► รอ event...

[event] handle_key(key) ─► try_move(dx,dy) ─► handle_tile (เก็บ/ชนะ) ─► render_map`, cap: "ทุกฟังก์ชันรับ &game (pointer) ตัวเดียว → แชร์สถานะเกมก้อนเดียวกัน", lang: "txt" },
      { note: "การไหลหลัก: **grid (char**)** เกิดที่ build_grid → ถูก scan โดย count_chars → ถูก copy เพื่อ flood_fill ใน validate → ถูกอ่านโดย render → ถูกแก้ (เก็บเหรียญ) โดย try_move" },

      { h: "🔗 ไล่ชีวิตของแผนที่ (av[1] → ภาพบนจอ)" },
      { code: String.raw`av[1] = "map.ber"
  └► read_file: เช็คลงท้าย .ber → open → read → ft_strdup → content
  └► build_grid: ft_split(content,'\n') → grid = ["111","1P0",...] (char**)
  └► count_chars → scan_tile: เจอ 'P' → game.px,py = พิกัด, แล้วเปลี่ยนช่องเป็น '0'
  └► validate_map: copy_grid → flood_fill จาก (px,py) → เช็คว่าถึง C/E ครบ
  └► render_map: อ่าน grid[y][x] → วาด tile ที่ (x-cam)*TILE
  └► handle_key: ขยับ px,py + ถ้าเหยียบ 'C' → grid[y][x]='0', collected++`, cap: "พิกัด P ถูกย้ายจาก grid ไปเก็บใน px,py ตั้งแต่ parse → ทุกส่วนใช้ px,py ต่อ", lang: "txt" },

      { h: "main.c / parse.c — รับแผนที่เข้าระบบ" },
      { table: { head: ["ฟังก์ชัน", "ทำไมถึงมี", "รับ · จากใคร", "คืน/ส่งต่อ · ให้ใคร"], rows: [
        ["main", "เริ่มงาน: parse→validate→วาด→loop", "ac,av · จาก OS", "เรียกทุกฟังก์ชันหลัก"],
        ["init_mlx (static)", "เปิด mlx + หน้าต่าง (clamp ขนาด)", "&game · จาก main", "ตั้ง game.mlx, game.win"],
        ["read_file (static)", "เช็ค .ber + อ่านไฟล์เป็น string", "&game,path · จาก parse_map", "char* (เนื้อไฟล์) → build_grid"],
        ["build_grid (static)", "แตกเป็น grid + เช็คสี่เหลี่ยม", "&game,content · จาก parse_map", "ตั้ง game.map.grid/width/height"],
        ["scan_tile (static)", "ดู 1 ช่อง: นับ C/E/P, จับพิกัด P", "&game,x,y · จาก count_chars", "อัปเดตตัวนับ + px,py"],
        ["count_chars (static)", "วนทุกช่อง + ตรวจกฎ P=1,E=1,C≥1", "&game · จาก parse_map", "เรียก scan_tile; error ถ้าผิด"],
        ["parse_map", "คุมขั้น parse ทั้งหมด", "&game,file · จาก main", "read_file→build_grid→count_chars"],
      ]}},
      { h: "validate.c — ตรวจว่าเล่นได้จริง" },
      { table: { head: ["ฟังก์ชัน", "ทำไมถึงมี", "รับ · จากใคร", "คืน · ให้ใคร"], rows: [
        ["check_walls (static)", "เช็คขอบเป็นกำแพง '1' ครบ", "&game · จาก validate_map", "error ถ้าไม่ปิด"],
        ["copy_grid (static)", "สำเนา grid (เพื่อไม่ทำลายของจริง)", "&game · จาก validate_map", "char** copy → flood_fill"],
        ["flood_fill (static)", "ระบายพื้นที่เดินถึงจาก (px,py)", "copy,x,y · จาก validate_map", "mark 'V' (recursive 4 ทิศ)"],
        ["check_reachable (static)", "ยังเหลือ C/E ที่ไม่ถูกระบายไหม", "&game,copy · จาก validate_map", "1/0"],
        ["validate_map", "คุมการตรวจ + free สำเนา", "&game · จาก main", "เรียก 4 ตัวบน"],
      ]}},
      { h: "render.c / player.c — วาด + เล่น" },
      { table: { head: ["ฟังก์ชัน", "ทำไมถึงมี", "รับ · จากใคร", "ผล/ส่งต่อ"], rows: [
        ["load_textures", "โหลดรูป .xpm ลง img[]", "&game · จาก main", "ตั้ง game.img[0..4]"],
        ["update_camera (static)", "คำนวณมุมกล้องตามผู้เล่น + clamp", "&game · จาก render_map", "ตั้ง cam_x,cam_y"],
        ["render_tile (static)", "วาด 1 ช่อง (พื้น+ของทับ)", "&game,x,y · จาก render_map", "mlx_put_image"],
        ["render_map", "วาดทั้งฉากที่มองเห็น + ผู้เล่น", "&game · จาก main/try_move", "update_camera + วน render_tile"],
        ["handle_key", "รับปุ่ม → เลือกทิศ/ออก", "key,&game · จาก mlx", "เรียก try_move / exit"],
        ["try_move (static)", "เช็คชน/เงื่อนไข แล้วขยับ", "&game,dx,dy · จาก handle_key", "แก้ px,py + handle_tile + render"],
        ["handle_tile (static)", "เหยียบ C=เก็บ, E=ชนะ", "&game,nx,ny · จาก try_move", "collected++ / ชนะ→exit"],
        ["handle_close", "ปิดหน้าต่าง (ปุ่ม X)", "&game · จาก mlx event 17", "free_game + exit"],
      ]}},
      { h: "error.c / free.c" },
      { table: { head: ["ฟังก์ชัน", "ทำไมถึงมี", "รับ · จากใคร", "ผล"], rows: [
        ["error_exit", "พิมพ์ Error + คืน memory + exit", "&game,msg · จากทุก error path", "free_game → exit(1)"],
        ["free_game", "คืน grid + textures + window", "&game · จาก error/close", "free ทุกอย่าง"],
      ]}},
    ],
    implementation: [
      { h: "1) อ่านและตรวจไฟล์ (parse.c)" },
      { code: String.raw`if (len < 5 || ft_strncmp(file + len - 4, ".ber", 4))
    error_exit(game, "Invalid file extension (expected .ber).");
...
game->map.grid = ft_split(content, '\n');     // แตกเป็นแถว
game->map.width = ft_strlen(grid[0]);
// ทุกแถวต้องกว้างเท่ากัน → ไม่งั้น "not rectangular"`, lang: "c" },
      { h: "2) สแกนแต่ละช่อง + จับตำแหน่ง P (parse.c)" },
      { code: String.raw`if (c == 'P') {
    game->px = x; game->py = y;
    game->map.players++;
    game->map.grid[y][x] = '0';   // เปลี่ยน P เป็นพื้น (เก็บตำแหน่งใน px/py แทน)
}
else if (c != '0' && c != '1' && c != 'C' && c != 'E')
    error_exit(game, "Invalid characters in map.");`, cap: "ทริค: เปลี่ยน P เป็น 0 ทันที แล้วเก็บพิกัดไว้ใน struct", lang: "c" },
      { h: "3) Flood fill เช็คทางเดิน (validate.c)" },
      { code: String.raw`static void flood_fill(char **grid, int x, int y) {
    if (grid[y][x] == '1' || grid[y][x] == 'V')
        return ;
    grid[y][x] = 'V';                  // mark ว่ามาแล้ว
    flood_fill(grid, x + 1, y);
    flood_fill(grid, x - 1, y);
    flood_fill(grid, x, y + 1);
    flood_fill(grid, x, y - 1);
}`, cap: "เติมจาก P; ถ้าหลังเติมยังเหลือ C/E ที่ยังไม่ถูก mark → ไปไม่ถึง = แผนที่ผิด", lang: "c" },
      { note: "สำคัญ: flood fill ทำบน 'สำเนา' ของ grid (copy_grid) เพื่อไม่ทำลายแผนที่จริงที่ใช้เล่น" },
      { h: "4) วาดด้วย camera (render.c)" },
      { code: String.raw`game->cam_x = game->px - WIN_W / (2 * TILE);  // กล้องตามผู้เล่น
// clamp ไม่ให้กล้องเลยขอบแผนที่ ...
sx = (x - game->cam_x) * TILE;                // พิกัดจอ = พิกัดแผนที่ - กล้อง
mlx_put_image_to_window(mlx, win, img[IMG_FLOOR], sx, sy);
if (c == '1') ... img[IMG_WALL] ...`, cap: "วาดพื้นก่อนทุกช่อง แล้ววาดของทับ — รองรับแผนที่ใหญ่กว่าจอ", lang: "c" },
      { h: "5) ขยับผู้เล่น + เงื่อนไขชนะ (player.c)" },
      { code: String.raw`if (tile == '1') return ;                                   // ชนกำแพง
if (tile == 'E' && game->collected < game->map.collectibles)
    return ;                                                // ยังเก็บไม่ครบ เข้า exit ไม่ได้
game->px = nx; game->py = ny; game->moves++;
ft_printf("Moves: %d\n", game->moves);                      // นับก้าวออก stdout`, cap: "เก็บ C → collected++, ถึง E ครบเหรียญ → \"You win!\" + exit", lang: "c" },
      { code: String.raw`mlx_key_hook(game.win, handle_key, &game);
mlx_hook(game.win, 17, 0, handle_close, &game);  // event 17 = ปิดหน้าต่าง (ปุ่ม X)
mlx_loop(game.mlx);`, cap: "main.c: ผูก event แล้วเข้า loop", lang: "c" },
    ],
    tricks: [
      { ul: [
        "**flood fill บนสำเนา** ไม่แตะ grid จริง — เช็คทางเดินโดยไม่ทำลายแผนที่",
        "**แทน P ด้วย 0 ทันที** แล้วเก็บพิกัดใน px/py → ลดเคสพิเศษตอน render/move",
        "**camera = พิกัดผู้เล่น − ครึ่งจอ** แล้ว clamp กับขอบ → รองรับแผนที่ใหญ่กว่าหน้าต่าง",
        "**วาดพื้น (floor) ก่อนเสมอ** แล้ววาด wall/coin/exit ทับ → โปร่งใส .xpm ทำงานถูก",
        "**event 17** (DestroyNotify) สำหรับปุ่ม X ของหน้าต่าง — ต้อง hook แยกจากปุ่ม ESC",
        "**free ทุกอย่างก่อน exit** ทั้ง textures (mlx_destroy_image), window, grid",
        "**ตรวจ .ber + สี่เหลี่ยม + กำแพงรอบ + นับ P/E/C** ครบก่อนเปิดหน้าต่าง",
      ]},
    ],
    eval: [
      { qa: [
        { q: "ตรวจความถูกต้องของแผนที่ยังไงบ้าง?", a: ".ber extension, เปิดได้/ไม่ว่าง, เป็นสี่เหลี่ยม, ล้อมกำแพง, P=1 E=1 C>=1, และ flood fill ยืนยันว่าเดินจาก P ถึง C ทุกตัวและ E ได้" },
        { q: "flood fill คืออะไร ทำไมต้องทำบนสำเนา?", a: "อัลกอริทึมเติมสีจากจุดเริ่ม (recursion 4 ทิศ) เพื่อหาพื้นที่ที่เดินถึง; ทำบนสำเนาเพราะมัน mark ช่องเป็น 'V' จะทำลายแผนที่จริงที่ใช้เล่น" },
        { q: "ทำไมเปลี่ยน P เป็น 0?", a: "เก็บตำแหน่งผู้เล่นไว้ใน px/py แล้ว ช่องที่ผู้เล่นยืนเป็นพื้นปกติ ทำให้ logic เดิน/วาดง่ายขึ้น" },
        { q: "ถ้าแผนที่ใหญ่กว่าหน้าต่างทำยังไง?", a: "ใช้ camera: คำนวณ cam_x/cam_y ตามผู้เล่นแล้ว clamp กับขอบ วาดเฉพาะ tile ที่อยู่ในกรอบจอ" },
        { q: "นับจำนวนก้าวยังไง แสดงที่ไหน?", a: "moves++ ทุกการเดินที่สำเร็จ แล้ว ft_printf ออก stdout (subject กำหนดให้แสดงจำนวนก้าว)" },
        { q: "ป้องกัน memory leak ยังไง?", a: "free_game() คืน grid, textures (mlx_destroy_image), window/display ทุก error path และตอนปิดเกม; ตรวจด้วย valgrind" },
        { q: "ปุ่มปิดหน้าต่าง (X) จัดการยังไง?", a: "mlx_hook กับ event 17 (DestroyNotify) เรียก handle_close → free + exit(0)" },
        { q: "เข้า exit ก่อนเก็บครบจะเป็นยังไง?", a: "try_move เช็ค collected < collectibles แล้ว return — เดินเข้า E ไม่ได้จนกว่าจะเก็บครบ" },
      ]},
      { h: "ทดสอบ" },
      { code: String.raw`./so_long maps/valid.ber          # เล่นได้
./so_long maps/not_closed.ber     # Error (กำแพงไม่ปิด)
./so_long maps/no_path.ber        # Error (เดินไม่ถึง)
valgrind --leak-check=full ./so_long maps/valid.ber`, lang: "bash" },
    ],
  },
},

/* ===================== FRACT-OL ===================== */
{
  id: "fractol",
  name: "fract-ol",
  tag: { th: "วาดแฟร็กทัล Mandelbrot/Julia ซูมได้ลื่น ๆ ด้วยเลขเชิงซ้อน + MiniLibX", en: "Render the Mandelbrot/Julia fractals with smooth zoom — complex numbers + MiniLibX" },
  accent: "#c792ea",
  sections: {
    principle: [
      { h: "โจทย์คืออะไร" },
      { p: "วาด fractal (Mandelbrot, Julia, +1 ชนิด) ด้วย MiniLibX. zoom เข้าหา cursor ด้วย mouse wheel, เลื่อนด้วยลูกศร, ปรับความลึก iteration ด้วย +/-" },
      { h: "หลักคณิต: escape-time algorithm" },
      { p: "ทุก pixel แทนจุด c ในระนาบเชิงซ้อน. วน `z = z² + c` ซ้ำ ๆ ถ้า |z| โตเกิน 2 (|z|² > 4) ก่อนครบ max_iter → จุด 'หนี' (อยู่นอกเซต) → ใช้จำนวนรอบมาแมพเป็นสี. ถ้าวนครบโดยไม่หนี → อยู่ในเซต → สีดำ" },
      { table: { head: ["fractal", "z เริ่ม", "c"], rows: [
        ["Mandelbrot", "z = 0", "c = พิกัด pixel"],
        ["Julia", "z = พิกัด pixel", "c = ค่าคงที่ (จาก argv)"],
      ]}},
      { note: "Mandelbrot กับ Julia ใช้สูตรเดียวกัน ต่างแค่ 'อะไรคือ z เริ่ม อะไรคือ c'" },
      { h: "ที่มาที่ไป: ทำไมสูตร z = z² + c ถึงวาดเป็นภาพได้" },
      { p: "เซต Mandelbrot นิยามว่า 'จุด c ใดบ้างที่วน `z = z² + c` (เริ่มจาก z=0) แล้ว z **ไม่หนีไปอนันต์**'. ทุก pixel บนจอ = จุด c หนึ่งจุด เราเลยถามทีละ pixel ว่า 'หนีไหม หนีเร็วแค่ไหน' แล้วเอาคำตอบมาทำเป็นสี → ได้ภาพ fractal" },
      { h: "ทำไมเช็คแค่ |z| > 2 ก็พอ (ที่มาของเลข 2)" },
      { p: "มีทฤษฎีบทว่า ถ้าระยะ |z| โตเกิน 2 เมื่อไร มันจะโตต่อไปเรื่อย ๆ จนอนันต์แน่นอน (หนีแล้วหนีเลย ไม่กลับมา). เลข 2 จึงเป็น 'เส้นตาย' ที่ใช้ตัดสินได้ทันทีโดยไม่ต้องวนจนจบ — นี่คือที่มาของชื่อ **escape-time** (นับว่ากี่รอบถึงข้ามเส้นนี้)" },
      { h: "ทำไมใช้ |z|² > 4 แทน |z| > 2 (เหตุผลด้านความเร็ว)" },
      { p: "`|z| = sqrt(re² + im²)` การถอดรากเป็นการคำนวณที่ **ช้า**. แต่ `|z| > 2` เทียบเท่ากับ `|z|² > 4` แบบเป๊ะ ๆ (ยกกำลังสองทั้งสองข้าง) เราเลยเทียบ `re² + im² > 4` แทน — ตัด sqrt ออกได้. โค้ดส่วนนี้รัน **หลายล้านครั้งต่อเฟรม** (800×800 px × หลายสิบ iteration) การประหยัด sqrt จึงสำคัญมากต่อความลื่น" },
      { h: "ทำไมเขียน pixel ลง buffer เอง (ไม่ใช้ mlx_pixel_put)" },
      { p: "`mlx_pixel_put` ส่งคำสั่งวาดไปที่ X server **ทีละจุด** ซึ่งมี overhead มหาศาลเมื่อมีเป็นล้านจุด. การเขียนสีลง **image buffer ในหน่วยความจำเอง** แล้วส่งทั้งภาพครั้งเดียว (`mlx_put_image_to_window`) เร็วกว่าหลักร้อยเท่า — เป็นเหตุผลที่ fractal renderer ทุกตัวทำแบบนี้" },
      { h: "ทำไม Mandelbrot กับ Julia ใช้โค้ดเดียวกันได้" },
      { p: "ทั้งคู่วนสูตร `z = z² + c` เหมือนกันเป๊ะ ต่างกันแค่ 'ใครคงที่': Mandelbrot ตรึง z เริ่ม=0 แล้วเปลี่ยน c ตาม pixel; Julia ตรึง c (ค่าเดียวทั้งภาพ) แล้วเปลี่ยน z เริ่ม ตาม pixel. เข้าใจจุดนี้จุดเดียวก็เขียนได้ทั้งสอง fractal โดยแทบไม่เพิ่มโค้ด — จึงเลือกออกแบบให้ใช้ลูปร่วมกัน" },
    ],
    theory: [
      { p: "fract-ol คือบทเรียน **คณิตศาสตร์ + การคำนวณเชิงตัวเลข + กราฟิก** — เข้าใจทฤษฎีแล้วโค้ดจะอ่านง่ายมาก" },
      { h: "1) จำนวนเชิงซ้อน (Complex numbers)" },
      { p: "จำนวนเชิงซ้อนเขียนเป็น `z = a + bi` โดย `i² = −1`. `a` = ส่วนจริง (real), `b` = ส่วนจินตภาพ (imaginary). การคูณ:" },
      { code: String.raw`z² = (a + bi)² = a² + 2abi + b²i²
   = (a² − b²) + (2ab)i
→ ส่วนจริง = a² − b² ,  ส่วนจินตภาพ = 2ab`, cap: "นี่คือที่มาของ z_re = z_re² − z_im² และ z_im = 2·z_re·z_im ในโค้ด", lang: "txt" },
      { h: "2) ระนาบเชิงซ้อน (Complex plane / Argand diagram)" },
      { p: "วาดจำนวนเชิงซ้อนเป็นจุดบนระนาบ 2 มิติ: แกนนอน = ส่วนจริง, แกนตั้ง = ส่วนจินตภาพ. ดังนั้น **ทุกพิกเซลบนจอ = จำนวนเชิงซ้อน 1 ค่า** — fractal จึงเป็น 'แผนที่' ของพฤติกรรมจำนวนเชิงซ้อนแต่ละจุด" },
      { p: "**ขนาด (modulus):** `|z| = √(a² + b²)` = ระยะจากจุดกำเนิด (ทฤษฎีบทพีทาโกรัส)" },
      { h: "3) ระบบพลวัต & การวนซ้ำ (iterated maps)" },
      { p: "ระบบพลวัตคือ 'นำผลลัพธ์ป้อนกลับเข้าสูตรซ้ำ ๆ': z₀ → z₁ → z₂ → ... โดย zₙ₊₁ = zₙ² + c. เราสนใจว่าลำดับนี้ **ลู่ออกสู่อนันต์ (diverge)** หรือ **อยู่ในขอบเขต (bounded)**" },
      { h: "4) เซต Mandelbrot/Julia & ทฤษฎีบทรัศมีหนี (escape radius)" },
      { p: "**เซต Mandelbrot** = เซตของ c ที่ทำให้ลำดับ (เริ่ม z=0) ไม่ลู่ออก. **ทฤษฎีบท:** ถ้า `|z| > 2` เมื่อใด ลำดับจะลู่ออกสู่อนันต์แน่นอน (พิสูจน์ได้จาก |z²+c| ≥ |z|²−|c| ที่โตเกินตัวเมื่อ |z|>2). เลข 2 จึงเป็น 'รัศมีหนี' ที่ใช้ตัดสินได้ทันที" },
      { note: "escape-time = นับจำนวนรอบกว่าจะ |z|>2; ถ้าวนครบ max_iter โดยไม่หนี ถือว่า 'อยู่ในเซต' (สีดำ). จำนวนรอบที่หนี = ข้อมูลที่เอามาทำสี" },
      { h: "5) Fractal & ความคล้ายตัวเอง (self-similarity)" },
      { p: "Fractal = รูปทรงที่ 'ซูมเข้าไปเท่าไรก็เห็นโครงสร้างคล้ายเดิม' มีรายละเอียดไม่รู้จบ. ขอบเขตของเซต Mandelbrot มีมิติเศษส่วน (fractal dimension) — เป็นเหตุผลที่ซูมลึกแล้วยังเห็นลายใหม่เรื่อย ๆ (และทำไมเราต้องเพิ่ม max_iter ตอนซูมลึก)" },
      { h: "6) เลขทศนิยม (Floating point / IEEE 754)" },
      { p: "`double` เก็บเลขจริงแบบ 64-bit ตามมาตรฐาน IEEE 754 (เครื่องหมาย + เลขชี้กำลัง + แมนทิสซา) มีความแม่นยำ ~15–16 หลัก. เมื่อซูมลึกมาก ๆ ค่าพิกัดต่างกันน้อยกว่าความละเอียดนี้ → ภาพเริ่ม 'แตกเป็นบล็อก' (precision limit). นี่คือเหตุผลที่ใช้ double ไม่ใช่ float และทำไมการซูมมีขีดจำกัด" },
      { h: "7) Linear interpolation (แมพช่วงค่า)" },
      { p: "การแปลงพิกเซล (0..WIDTH) ↔ ช่วงเชิงซ้อน (min_re..max_re) คือ **การ interpolate เชิงเส้น**:" },
      { code: String.raw`re = min_re + (x / WIDTH) * (max_re − min_re)`, cap: "สูตรแมพค่าจากช่วงหนึ่งไปอีกช่วง — ใช้ทั้งตอน render และตอน zoom", lang: "txt" },
      { h: "8) ทฤษฎีสี: RGB & การแพ็กบิต" },
      { p: "สีบนจอผสมจาก 3 ช่อง R, G, B (อย่างละ 0–255 = 8 bit). รวมเป็นเลข 24-bit ด้วยการ **เลื่อนบิต (bit shift)**:" },
      { code: String.raw`color = (R << 16) | (G << 8) | B`, cap: "R เลื่อนไป 16 บิต, G ไป 8 บิต, B อยู่ท้าย — รวมเป็น 0xRRGGBB", lang: "txt" },
      { p: "การไล่สีนุ่ม (smooth gradient) มาจากการแมพ 'จำนวนรอบที่หนี' → ค่าสีด้วยฟังก์ชันต่อเนื่อง (พหุนามใน color.c) แทนการกระโดดเป็นขั้น" },

      { h: "🔬 เจาะลึก A: คูณจำนวนเชิงซ้อน — ไล่ทีละขั้น + ตัวอย่างตัวเลข" },
      { code: String.raw`z² + c  โดย z = a + bi , c = e + fi :

z² = (a + bi)(a + bi)
   = a² + abi + abi + b²i²
   = a² + 2abi + b²(−1)        [เพราะ i² = −1]
   = (a² − b²) + (2ab)i

z² + c = (a² − b² + e) + (2ab + f)i
         └── ส่วนจริง ──┘   └── จินตภาพ ──┘`, cap: "ตรงกับโค้ด: tmp = zr*zr − zi*zi + c_re ; zi = 2*zr*zi + c_im", lang: "txt" },
      { code: String.raw`ตัวอย่างจริง: z = 0.3 + 0.5i , c = −0.7 + 0.27i
  ส่วนจริงใหม่ = 0.3² − 0.5² + (−0.7) = 0.09 − 0.25 − 0.7 = −0.86
  ส่วนจินตใหม่ = 2(0.3)(0.5) + 0.27   = 0.30 + 0.27      =  0.57
  → z₁ = −0.86 + 0.57i
  |z₁|² = 0.86² + 0.57² = 0.74 + 0.32 = 1.06  (< 4 → ยังไม่หนี วนต่อ)`, cap: "วน z₁→z₂→... จนกว่า |z|²>4 หรือครบ max_iter", lang: "txt" },

      { h: "🔬 เจาะลึก B: พิสูจน์ทฤษฎีบทรัศมีหนี (ทำไมเลข 2)" },
      { p: "อ้างว่า: ถ้า |z| > 2 (และ |z| ≥ |c| ซึ่งจริงสำหรับจุดที่เราสน) แล้วลำดับจะลู่ออกสู่อนันต์แน่นอน พิสูจน์ด้วยอสมการสามเหลี่ยม:" },
      { code: String.raw`อสมการสามเหลี่ยม:  |z² + c| ≥ |z²| − |c| = |z|² − |c|

สมมติ |z| > 2  และ  |z| ≥ |c| :
  |z² + c| ≥ |z|² − |c| ≥ |z|² − |z|
          = |z|(|z| − 1)

เพราะ |z| > 2  →  (|z| − 1) > 1  →  มีค่า k = |z|−1 > 1
  |z_next| ≥ k·|z|   โดย k > 1 คงที่

→ ทุกรอบ |z| ถูกคูณด้วยตัวที่ > 1 → โตแบบ exponential → ∞
  ดังนั้น "ข้าม 2 เมื่อไร = หนีแน่นอน" ▮`, cap: "เลข 2 ไม่ได้สุ่มมา — มันคือเกณฑ์ที่พิสูจน์ได้ว่าเลยแล้วไม่มีวันกลับ", lang: "txt" },
      { code: String.raw`ทำไมเทียบ |z|² > 4 แทน |z| > 2 :
  |z| > 2   ⟺   |z|² > 2²   ⟺   re² + im² > 4
  (ยกกำลังสองทั้งสองข้างได้เพราะทั้งคู่ ≥ 0)
→ ตัด sqrt ทิ้ง = เร็วขึ้นมาก (รันหลายล้านครั้ง/เฟรม)`, lang: "txt" },

      { h: "🔬 เจาะลึก C: IEEE 754 double & ทำไมซูมลึกแล้วภาพแตก" },
      { code: String.raw`double = 64 bit:
  [ 1 sign | 11 exponent | 52 mantissa ]
  ให้ความแม่นยำสัมพัทธ์ ~2⁻⁵² ≈ 2.2 × 10⁻¹⁶  (~15–16 หลักทศนิยม)

เมื่อซูม: ความกว้างกรอบ (max_re − min_re) เล็กลงเรื่อย ๆ
  ระยะห่างเชิงซ้อนต่อ 1 พิกเซล = ความกว้าง / WIDTH
  ถ้าระยะนี้เล็กกว่า ~2⁻⁵² × |ค่าพิกัด|
  → 2 พิกเซลข้างกันคำนวณได้ "ค่าเท่ากัน" (ปัดเป็นค่าเดียว)
  → ภาพแตกเป็นบล็อกสี่เหลี่ยม (precision limit)

→ เหตุผลที่ใช้ double ไม่ใช่ float (float แตกเร็วกว่ามาก ~2⁻²³)
  และเหตุผลที่การซูมมี "เพดาน" ตามธรรมชาติ`, cap: "ข้อจำกัดเชิงตัวเลขนี้เป็นของจริงในทุก fractal renderer", lang: "txt" },

      { h: "🔬 เจาะลึก D: อนุพันธ์สูตรแมพพิกเซล ↔ ระนาบเชิงซ้อน" },
      { code: String.raw`ต้องการฟังก์ชันเชิงเส้นที่:
   x = 0      → re = min_re
   x = WIDTH  → re = max_re

รูปทั่วไป re = m·x + b :
   จาก x=0 : b = min_re
   จาก x=WIDTH : max_re = m·WIDTH + min_re
             → m = (max_re − min_re) / WIDTH

→ re = min_re + (x / WIDTH) · (max_re − min_re)   ★ (linear interpolation)

ตัวอย่าง: กรอบ [−2, 1], WIDTH=800, พิกเซล x=400 (กลางจอ)
   re = −2 + (400/800)(1 −(−2)) = −2 + 0.5·3 = −0.5  ✓ (กลางพอดี)

แกน im กลับด้าน:  im = max_im − (y/HEIGHT)(max_im − min_im)
   เพราะ y ของจอเพิ่มลงล่าง แต่แกนจินตภาพเพิ่มขึ้นบน`, cap: "interpolation เชิงเส้น = แมพค่าจากช่วงหนึ่งไปอีกช่วงแบบสัดส่วน ใช้ทั้ง render และ zoom", lang: "txt" },
      { note: "เชื่อมโยง: สูตร zoom ก็คือ interpolation นี้กลับด้าน — หาจุดเชิงซ้อนใต้เมาส์ แล้วหดช่วง [min,max] เข้าหาจุดนั้นด้วย factor" },
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Mandelbrot set — Wikipedia", url: "https://en.wikipedia.org/wiki/Mandelbrot_set", note: "นิยาม + คุณสมบัติของเซต" },
        { label: "Julia set — Wikipedia", url: "https://en.wikipedia.org/wiki/Julia_set", note: "ความสัมพันธ์กับ Mandelbrot" },
        { label: "Plotting algorithms (escape time)", url: "https://en.wikipedia.org/wiki/Plotting_algorithms_for_the_Mandelbrot_set", note: "escape-time + smooth coloring เต็มสูตร" },
        { label: "Complex number — Wikipedia", url: "https://en.wikipedia.org/wiki/Complex_number", note: "เลขเชิงซ้อน + การคูณ/ขนาด" },
        { label: "Floating-Point (Goldberg, Oracle)", url: "https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html", note: "\"What Every CS Should Know About Floating-Point\" — IEEE 754 ฉบับคลาสสิก" },
        { label: "3Blue1Brown — Fractals (วิดีโอ)", url: "https://www.youtube.com/watch?v=-RdOwhmqP5s", note: "อธิบายมิติเศษส่วน/ความคล้ายตัวเองแบบเห็นภาพ" },
      ]},
    ],
    foundations: [
      { h: "0) ปูพื้น: struct รวมทุกอย่างของโปรแกรมไว้ที่เดียว" },
      { p: "fract-ol เก็บสถานะทั้งหมด (mlx, รูป, กรอบมุมมอง, ชนิด fractal, ความลึก) ไว้ใน struct `t_fractol` ตัวเดียว แล้วส่ง `&f` ไปทุกฟังก์ชัน — ฟังก์ชันจึงอ่าน/แก้สถานะเดียวกันได้หมด" },
      { code: String.raw`typedef struct s_fractol {
    void   *mlx;       // ตัวจัดการ mlx
    void   *win;       // หน้าต่าง
    void   *img;       // รูป (เราเขียน pixel ลงในนี้)
    char   *addr;      // ★ ที่อยู่ buffer ของรูป (เขียน pixel ตรงนี้)
    int    bpp;        // bits per pixel (เช่น 32)
    int    line_len;   // จำนวน byte ต่อ 1 แถวของรูป
    int    endian;
    int    type;       // MANDELBROT หรือ JULIA
    double min_re, max_re, min_im, max_im;  // กรอบมุมมองบนระนาบเชิงซ้อน
    double c_re, c_im; // ค่าคงที่ของ Julia
    int    max_iter;   // ความลึกการวน
    int    shift;      // เลื่อนเฉดสี
}   t_fractol;`, cap: "double ใช้กับพิกัดเชิงซ้อนเพราะต้องการความละเอียดสูงตอน zoom ลึก", lang: "c" },
      { h: "1) ปูพื้น: รูปคือ 'ผืน byte ยาว ๆ' ในหน่วยความจำ" },
      { p: "เมื่อสร้าง image, mlx คืน **pointer `addr`** มาให้ = ที่อยู่เริ่มต้นของผืนหน่วยความจำที่เก็บสีทุก pixel เรียงต่อกัน แถวต่อแถว เราวาดภาพด้วยการ 'เขียนตัวเลขสีลงตำแหน่งที่ถูกต้อง' ในผืนนี้" },
      { code: String.raw`void put_pixel(t_fractol *f, int x, int y, int color) {
    char *dst = f->addr + (y * f->line_len + x * (f->bpp / 8));
    *(unsigned int *)dst = color;
}`, cap: "หา byte ที่ถูกต้องของ (x,y) แล้วเขียนสี 4 byte ลงไป", lang: "c" },
      { h: "2) แกะสูตร pointer arithmetic ทีละส่วน" },
      { ul: [
        "`y * line_len` = ข้ามไป 'แถวที่ y' (แต่ละแถวยาว line_len byte)",
        "`x * (bpp/8)` = ข้ามไป 'คอลัมน์ x' ในแถวนั้น (1 pixel = bpp/8 byte เช่น 32/8 = 4 byte)",
        "`f->addr + (...)` = ที่อยู่ของ pixel (x,y) พอดี",
        "`*(unsigned int *)dst = color` = มองที่อยู่นั้นเป็น 'ช่อง int 4 byte' แล้วยัดค่าสีลงไปทีเดียว",
      ]},
      { note: "ทริค: `(unsigned int *)dst` คือการ 'cast' บอก C ว่า ที่ตรงนี้ขอมองเป็น int 4 byte นะ — ทำให้เขียนสี (RGB 0xRRGGBB) ได้ครบในคำสั่งเดียว เร็วกว่า mlx_pixel_put หลายร้อยเท่า" },
      { h: "3) ทำไมไม่ต้อง malloc array เอง" },
      { p: "ต่างจาก push_swap/so_long ที่เราจองโครงสร้างเอง — fract-ol ให้ **mlx จองหน่วยความจำของรูปให้** (ตอน mlx_new_image) เราแค่ได้ `addr` มาเขียน. struct `t_fractol f` ก็เป็นตัวแปร local บน stack (ไม่ได้ malloc) จึงไม่ต้อง free struct เอง" },
      { h: "4) Memory management: คืนทรัพยากร mlx ตอนปิด" },
      { code: String.raw`int close_hook(t_fractol *f) {
    mlx_destroy_image(f->mlx, f->img);     // คืนผืน byte ของรูป
    mlx_destroy_window(f->mlx, f->win);    // คืนหน้าต่าง
    mlx_destroy_display(f->mlx);           // คืน connection กับ X server
    free(f->mlx);                          // คืน struct ของ mlx เอง
    exit(0);
}`, cap: "ทรัพยากรของ mlx ต้องคืนด้วยฟังก์ชันของ mlx (ไม่ใช่ free) ยกเว้นตัว mlx handle ที่ปิดท้ายด้วย free", lang: "c" },
      { note: "ถ้าลืม destroy → valgrind จะรายงาน 'still reachable / leak' จาก mlx เสมอ" },
      { h: "5) pointer ที่ส่งไปมา = สถานะเดียวกัน" },
      { p: "ทุก hook (key/mouse/close) รับ `t_fractol *f` ตัวเดียวกัน เช่น zoom แก้ `f->min_re/max_re...` แล้วเรียก `render(f)` วาดใหม่ — เพราะเป็น pointer ไป struct เดียว การเปลี่ยนกรอบมุมมองจึงมีผลกับการวาดทันที" },
    ],
    architecture: [
      { code: String.raw`main.c          parse_args → init_view → init_mlx → render → hooks → loop
parse.c         เลือก mandelbrot/julia + รับ c จาก argv (julia)
fractal_math.c  mandelbrot_iter / julia_iter (วน z=z²+c)
render.c        วนทุก pixel → map เป็นพิกัดเชิงซ้อน → put_pixel
color.c         get_color(): map จำนวน iter → สี (smooth palette)
events.c        key_hook (เลื่อน/iter/ESC) + mouse_hook (zoom)
init.c, utils.c setup + helper`, cap: "file map" },
    ],
    dataflow: [
      { p: "ไล่ **ทุกฟังก์ชัน** ของ fract-ol ว่ารับอะไรมาจากใคร ส่งต่อให้ใคร — เน้นการไหลของ `&f` และ image buffer (`f->addr`)" },
      { h: "ภาพรวมการเรียก (call flow)" },
      { code: String.raw`main(argc, argv)
 ├─ parse_args(argc, argv, &f)
 │     ├─ "mandelbrot" → f.type = MANDELBROT
 │     └─ "julia" → parse_julia → f.type=JULIA, f.c_re/c_im (จาก argv หรือ default)
 │     └─ ผิด → usage ─► return 1
 ├─ init_view(&f)  ─► ตั้ง min/max re,im + max_iter + shift (กรอบเริ่มต้น)
 ├─ init_mlx(&f)   ─► mlx_init/new_window/new_image ─► f.addr, f.bpp, f.line_len
 ├─ render(&f)
 │     └─ ทุก pixel (x,y): map → (re,im) ─► compute_iter ─► mandelbrot_iter / julia_iter
 │                                       ─► get_color(iter) ─► make_rgb
 │                                       ─► put_pixel(f,x,y,color) เขียนลง f.addr
 │     └─ mlx_put_image_to_window (โยนทั้งภาพขึ้นจอ)
 ├─ mlx_hook(2, key_hook) ; mlx_hook(17, close_hook) ; mlx_mouse_hook(mouse_hook)
 └─ mlx_loop ──────► รอ event...

[key]   key_hook ─► move_view / ปรับ max_iter ─► render(&f)
[mouse] mouse_hook ─► zoom(x,y,factor) ─► render(&f)`, cap: "ทุก hook รับ &f → แก้กรอบมุมมอง/ความลึก แล้วเรียก render ใหม่", lang: "txt" },
      { note: "การไหลหลัก: `&f` คือสถานะทั้งหมด; ทุกครั้งที่ event แก้ค่าใน f (กรอบ/iter) แล้วเรียก render → render อ่าน f.min/max มาคำนวณ → เขียนสีลง f.addr → โยนขึ้นจอ" },

      { h: "🔗 ไล่ชีวิตของ 1 pixel (x,y → สีบนจอ)" },
      { code: String.raw`pixel (x, y)
  └► render: re = f.min_re + x/WIDTH*(f.max_re-f.min_re)
             im = f.max_im - y/HEIGHT*(f.max_im-f.min_im)
  └► compute_iter(f, re, im)
       └► f.type==MANDELBROT ? mandelbrot_iter(f,re,im) : julia_iter(f,re,im)
       └► วน z=z²+c จน |z|²>4 → คืนจำนวนรอบ i (เช่น 37)
  └► get_color(f, 37) → (t=37/max_iter → พหุนาม RGB) → make_rgb → 0xRRGGBB
  └► put_pixel(f, x, y, color)
       └► dst = f.addr + (y*f.line_len + x*(f.bpp/8))
       └► *(unsigned int*)dst = color   ← เขียนลง buffer ตรง ๆ`, cap: "ค่า re/im ขึ้นกับกรอบ f.min/max ปัจจุบัน → zoom เปลี่ยนกรอบ → ภาพเปลี่ยน", lang: "txt" },

      { h: "main.c / parse.c / init.c — เริ่มระบบ" },
      { table: { head: ["ฟังก์ชัน", "ทำไมถึงมี", "รับ · จากใคร", "คืน/ส่งต่อ · ให้ใคร"], rows: [
        ["main", "ลำดับงาน: parse→init→render→hook→loop", "argc,argv · จาก OS", "เรียกทุกตัว + ผูก hook"],
        ["parse_args", "เลือกชนิด fractal จาก argv", "argc,argv,&f · จาก main", "ตั้ง f.type; 1/0"],
        ["parse_julia (static)", "อ่าน c ของ Julia (หรือใช้ default)", "argc,argv,&f · จาก parse_args", "ตั้ง f.c_re,f.c_im"],
        ["usage", "พิมพ์วิธีใช้ + ปุ่มควบคุม", "— · จาก main/parse", "ft_putstr stdout"],
        ["init_view", "ตั้งกรอบเชิงซ้อนเริ่มต้น + max_iter", "&f · จาก main", "ตั้ง f.min/max_re/im, max_iter, shift"],
        ["init_mlx", "เปิด mlx/หน้าต่าง/รูป + ดึง addr", "&f · จาก main", "ตั้ง f.mlx,win,img,addr,bpp,line_len"],
      ]}},
      { h: "fractal_math.c / render.c — คำนวณ + วาด" },
      { table: { head: ["ฟังก์ชัน", "ทำไมถึงมี", "รับ · จากใคร", "คืน/ส่งต่อ"], rows: [
        ["mandelbrot_iter", "วน z=z²+c (z เริ่ม 0, c=pixel)", "f,c_re,c_im · จาก compute_iter", "จำนวนรอบที่หนี (int)"],
        ["julia_iter", "วน z=z²+c (z=pixel, c คงที่)", "f,z_re,z_im · จาก compute_iter", "จำนวนรอบที่หนี (int)"],
        ["compute_iter (static)", "เลือกสูตรตาม f.type", "f,re,im · จาก render", "int → get_color"],
        ["put_pixel", "เขียนสี 1 จุดลง image buffer", "f,x,y,color · จาก render", "เขียน f.addr (pointer arithmetic)"],
        ["render", "วนทุก pixel → map → คำนวณ → ลงสี", "&f · จาก main/hooks", "compute_iter+get_color+put_pixel; put image"],
      ]}},
      { h: "color.c / events.c — สี + การโต้ตอบ" },
      { table: { head: ["ฟังก์ชัน", "ทำไมถึงมี", "รับ · จากใคร", "คืน/ผล"], rows: [
        ["make_rgb (static)", "รวม R,G,B เป็นเลขสีเดียว (bit shift)", "r,g,b · จาก get_color", "int 0xRRGGBB"],
        ["get_color", "แมพจำนวน iter → สี (palette นุ่ม)", "f,iter · จาก render", "int color → put_pixel"],
        ["move_view (static)", "เลื่อนกรอบมุมมอง (ลูกศร)", "f,dx,dy · จาก key_hook", "แก้ f.min/max"],
        ["key_hook", "รับปุ่ม: เลื่อน/ปรับ iter/ESC", "keycode,f · จาก mlx", "move_view/แก้ max_iter → render"],
        ["zoom (static)", "ย่อ/ขยายกรอบรอบเมาส์", "f,x,y,factor · จาก mouse_hook", "แก้ f.min/max"],
        ["mouse_hook", "รับ scroll: zoom in/out", "button,x,y,f · จาก mlx", "zoom → render"],
        ["close_hook", "ปิด: คืนทรัพยากร mlx + exit", "f · จาก mlx/ESC", "destroy image/win/display+free"],
      ]}},
    ],
    implementation: [
      { h: "1) สูตร z = z² + c (fractal_math.c)" },
      { code: String.raw`while (i < f->max_iter) {
    tmp  = z_re * z_re - z_im * z_im + c_re;  // ส่วนจริงของ z²+c
    z_im = 2.0 * z_re * z_im + c_im;          // ส่วนจินตภาพ
    z_re = tmp;
    if (z_re * z_re + z_im * z_im > 4.0)      // |z|² > 4 → หนีแล้ว
        return (i);
    i++;
}
return (f->max_iter);                          // ไม่หนี = อยู่ในเซต`, cap: "Mandelbrot เริ่ม z=0; Julia เริ่ม z=pixel, c คงที่", lang: "c" },
      { note: "ทริค: ใช้ |z|² > 4 แทน sqrt(|z|) > 2 → ไม่ต้องเรียก sqrt (เร็วขึ้นมาก เพราะรันต่อ pixel ต่อ iteration)" },
      { h: "2) map pixel → ระนาบเชิงซ้อน (render.c)" },
      { code: String.raw`im = f->max_im - (double)y / HEIGHT * (f->max_im - f->min_im);
re = f->min_re + (double)x / WIDTH  * (f->max_re - f->min_re);
put_pixel(f, x, y, get_color(f, compute_iter(f, re, im)));`, cap: "หน้าจอ (x,y) → จุด (re,im); แกน im กลับด้านเพราะ y จอเพิ่มลงล่าง", lang: "c" },
      { h: "3) เขียน pixel ตรงเข้า image buffer (render.c)" },
      { code: String.raw`dst = f->addr + (y * f->line_len + x * (f->bpp / 8));
*(unsigned int *)dst = color;`, cap: "เขียนลง image ในหน่วยความจำแล้ว put ทั้งภาพครั้งเดียว — เร็วกว่า mlx_pixel_put มาก", lang: "c" },
      { h: "4) Zoom เข้าหา cursor (events.c)" },
      { code: String.raw`mouse_re = f->min_re + (double)x / WIDTH  * (f->max_re - f->min_re);
mouse_im = f->max_im - (double)y / HEIGHT * (f->max_im - f->min_im);
f->min_re = mouse_re + (f->min_re - mouse_re) * factor;   // ย่อ/ขยายรอบ cursor
f->max_re = mouse_re + (f->max_re - mouse_re) * factor;
// ... im เช่นกัน ; wheel up factor=0.8 (zoom in), down 1.25 (out)`, cap: "เลื่อนกรอบให้ขยายรอบจุดเมาส์ ทำให้ zoom ไม่หนีจาก cursor", lang: "c" },
      { h: "5) สี smooth palette (color.c)" },
      { code: String.raw`if (iter >= f->max_iter) return (0x000000);     // อยู่ในเซต = ดำ
t = (double)((iter + f->shift) % f->max_iter) / f->max_iter;
r = 9.0  * (1-t) * t*t*t        * 255;
g = 15.0 * (1-t)*(1-t) * t*t    * 255;
b = 8.5  * (1-t)*(1-t)*(1-t)*t  * 255;
return ((r << 16) | (g << 8) | b);`, cap: "polynomial palette ให้ไล่สีนุ่ม; shift = เลื่อนเฉดได้ (bonus)", lang: "c" },
    ],
    tricks: [
      { ul: [
        "**|z|² > 4 แทน sqrt** — เลี่ยง sqrt() ที่ช้า (รันหลายล้านครั้งต่อเฟรม)",
        "**เขียนลง image buffer ตรง ๆ** (addr + offset) แล้ว put ทั้งภาพ — เร็วกว่า mlx_pixel_put หลักร้อยเท่า",
        "**Mandelbrot/Julia ใช้โค้ดเดียวกัน** ต่างแค่ค่าเริ่ม z และ c",
        "**zoom รอบ cursor**: แปลงเมาส์เป็นพิกัดเชิงซ้อนก่อน แล้วสเกลกรอบรอบจุดนั้น",
        "**แกน imaginary กลับด้าน** (max_im - ...) เพราะแกน y ของจอเพิ่มลงล่าง",
        "**clamp max_iter** (20..1000) กันค้าง/กันละเอียดเกินจำเป็น",
        "**ปิดทรัพยากร mlx ครบ** ใน close_hook: destroy_image/window/display + free",
      ]},
    ],
    eval: [
      { qa: [
        { q: "Mandelbrot กับ Julia ต่างกันยังไง?", a: "สูตรเดียวกัน z=z²+c; Mandelbrot: z เริ่ม 0, c = พิกัด pixel. Julia: z เริ่ม = พิกัด pixel, c = ค่าคงที่ (รับจาก argv)" },
        { q: "escape-time algorithm ทำงานยังไง?", a: "วน z=z²+c ถ้า |z| โตเกิน 2 ก่อนครบ max_iter ถือว่า 'หนี' (นอกเซต) ใช้จำนวนรอบมาทำสี; ถ้าครบโดยไม่หนี = ในเซต = ดำ" },
        { q: "ทำไมใช้ |z|² > 4 ไม่ใช้ sqrt?", a: "เทียบ |z|²>4 เท่ากับ |z|>2 แต่ไม่ต้องเรียก sqrt ซึ่งช้า — โค้ดนี้รันหลายล้านครั้งต่อเฟรม จึงสำคัญต่อความเร็ว" },
        { q: "map pixel เป็นจุดเชิงซ้อนยังไง?", a: "re = min_re + x/WIDTH*(max_re-min_re); im = max_im - y/HEIGHT*(max_im-min_im) (im กลับด้านเพราะ y จอชี้ลง)" },
        { q: "zoom เข้าหาเมาส์ทำยังไง?", a: "แปลงตำแหน่งเมาส์เป็นพิกัดเชิงซ้อน แล้วย่อ/ขยายกรอบ (min/max re,im) รอบจุดนั้นด้วย factor — จุดใต้เมาส์จึงอยู่กับที่" },
        { q: "ทำไม render เร็ว ทั้งที่วนทุก pixel?", a: "เขียนสีลง image buffer ในหน่วยความจำโดยตรง (pointer + offset) แล้ว mlx_put_image_to_window ครั้งเดียว ไม่เรียก mlx_pixel_put ทีละจุด" },
        { q: "+ / - ทำอะไร?", a: "ปรับ max_iter (clamp 20..1000) เพิ่มรายละเอียด/ความลึกของขอบเขตเซต แล้ว render ใหม่" },
        { q: "จัดการ memory/หน้าต่างตอนปิดยังไง?", a: "close_hook เรียก mlx_destroy_image/window/display + free(mlx) แล้ว exit(0); valgrind ตรวจ leak" },
      ]},
      { h: "ทดสอบ" },
      { code: String.raw`./fractol mandelbrot
./fractol julia -0.7 0.27015
./fractol            # usage (no args)
./fractol invalid    # usage (ชื่อ fractal ผิด)`, lang: "bash" },
    ],
  },
},
/* ===================== MINITALK ===================== */
{
  id: "minitalk",
  name: "minitalk",
  tag: { th: "ส่งข้อความระหว่าง 2 โปรเซสด้วยสัญญาณ UNIX แค่ 2 ตัว — สื่อสารทีละบิตเหมือนรหัสมอร์ส", en: "Send a message between two processes using only 2 UNIX signals — one bit at a time, like Morse code" },
  accent: "#f78fb3",
  sections: {
    principle: [
      { h: "โจทย์คืออะไร" },
      { p: "เขียน 2 โปรแกรม: **server** กับ **client** ที่คุยกันได้ โดยใช้ได้แค่ signal **2 ตัวเท่านั้น** คือ `SIGUSR1` และ `SIGUSR2` ห้ามใช้ pipe, socket, ไฟล์ หรือ shared memory" },
      { ul: [
        "**server** เปิดมาแล้วพิมพ์ PID ของตัวเองออกมา แล้วนั่งรอ",
        "**client** รับ PID ของ server + ข้อความ (`./client <PID> \"ข้อความ\"`) แล้วส่งข้อความนั้นไปให้ server พิมพ์ออกจอ",
      ]},
      { note: "ข้อจำกัดสุดโหด: signal **ไม่มีข้อมูลแนบมา** — มันบอกได้แค่ 'มีสัญญาณมาแล้ว' กับ 'เป็นชนิดไหน (USR1/USR2)' เท่านั้น เราจึงต้องประดิษฐ์ 'ภาษา' ขึ้นมาเองจาก 2 สัญญาณนี้" },
      { h: "ไอเดียหลัก: ส่งทีละ bit" },
      { p: "ทุกตัวอักษร (char) = **1 byte = 8 bit** และแต่ละ bit มีค่าได้แค่ 0 หรือ 1. เรามี signal 2 ชนิดพอดี → จับคู่ตรง ๆ:" },
      { table: { head: ["bit", "signal ที่ส่ง"], rows: [
        ["0", "SIGUSR1"],
        ["1", "SIGUSR2"],
      ]}},
      { p: "client หั่นตัวอักษรเป็น 8 bit แล้วยิง signal ทีละตัว → server รับทีละ signal เอามาประกอบกลับเป็น byte → ครบ 8 bit ก็ได้ 1 ตัวอักษร พิมพ์ออกจอ. พอส่งครบทั้งข้อความ client ปิดท้ายด้วยตัวอักษร `'\\0'` (null) เพื่อบอกว่า 'จบแล้ว'" },
      { h: "ทำไมโจทย์นี้ถึงสำคัญ" },
      { p: "minitalk สอนเรื่อง **inter-process communication (IPC)** กับ **asynchronous signal handling** ซึ่งเป็นพื้นฐานของระบบ UNIX จริง ๆ (เช่น Ctrl+C คือการส่ง SIGINT). มันบังคับให้เข้าใจว่า signal handler ทำงาน 'แทรก' การทำงานปกติเมื่อไหร่ก็ได้ และต้องออกแบบ protocol การสื่อสารเองตั้งแต่ศูนย์" },
      { h: "MSB-first คืออะไร ทำไมต้องเลือก" },
      { p: "byte หนึ่งมี 8 bit เรียงจากตำแหน่งค่ามากสุด (**MSB** = Most Significant Bit, ค่า 128) ไปน้อยสุด (**LSB** = ค่า 1). โค้ดนี้เลือกส่ง **MSB ก่อน** (bit ที่ 7 → 0). ข้อดีคือฝั่ง server ประกอบกลับด้วยการ `c = c << 1` (เลื่อนซ้าย) แล้วเติม bit ใหม่ที่ตำแหน่งขวาสุด — ตรงไปตรงมาและ bit เรียงถูกทางเองอัตโนมัติ" },
      { code: String.raw`ตัวอักษร 'A' = 65 = 0100 0001 (binary)

client ส่ง (MSB→LSB):  0  1  0  0  0  0  0  1
signal:               U1 U2 U1 U1 U1 U1 U1 U2

server ประกอบ (c<<1 ทุกครั้ง, เติม 1 ถ้า USR2):
  0 → 1 → 10 → 100 → 1000 → 10000 → 100000 → 1000001 = 65 = 'A' ✓`, cap: "เลื่อนซ้ายทีละ bit แล้วเติม bit ใหม่ที่ขวา — ครบ 8 ครั้งได้ค่าเดิมกลับมาเป๊ะ", lang: "txt" },
      { h: "mandatory กับ bonus ต่างกันตรงไหน" },
      { table: { head: ["", "mandatory", "bonus"], rows: [
        ["ทิศทาง", "client → server ทางเดียว", "server ส่ง ack กลับ (สองทาง)"],
        ["จังหวะส่ง", "client หน่วง usleep คงที่ แล้วยิงต่อเลย", "client รอ ack ของแต่ละ bit ก่อนยิงตัวถัดไป (lock-step)"],
        ["ความเชื่อถือได้", "เสี่ยงหลุดถ้า server ช้า", "ไม่หลุด เพราะ sync กันทุก bit"],
        ["client รู้ว่าส่งจบไหม", "ไม่รู้", "รู้ — server ack ตัว '\\0' ด้วย SIGUSR2 → พิมพ์ 'Message delivered!'"],
      ]}},
    ],
    theory: [
      { p: "หมวดนี้รวม **ทฤษฎีพื้นฐานที่ต้องเข้าใจก่อน** จะอ่านโค้ด minitalk รู้เรื่อง — เรื่อง signal, binary, และ process" },
      { h: "1) Process & PID" },
      { p: "**Process** = โปรแกรมที่กำลังรันอยู่ 1 ตัว. ระบบปฏิบัติการให้เลขประจำตัวที่ไม่ซ้ำกันชื่อ **PID** (Process ID). การจะส่ง signal ไปหาใคร เราต้องรู้ PID ของเขาก่อน — นี่คือเหตุผลที่ server ต้องพิมพ์ PID ออกมาให้เราเอาไปบอก client" },
      { ul: [
        "`getpid()` — ถามว่า 'PID ของฉันคือเลขอะไร' (server ใช้)",
        "`kill(pid, sig)` — ส่ง signal `sig` ไปหา process หมายเลข `pid` (ชื่อ kill ชวนเข้าใจผิด จริง ๆ แค่ 'ส่งสัญญาณ')",
      ]},
      { h: "2) Signal คืออะไร" },
      { p: "**Signal** = การแจ้งเตือนแบบ asynchronous ที่ OS ส่งเข้ามาขัดจังหวะ process. เมื่อ signal มาถึง โปรแกรมจะ 'หยุด' สิ่งที่ทำอยู่ชั่วคราว กระโดดไปรันฟังก์ชันที่เรากำหนดไว้ (เรียกว่า **handler**) แล้วค่อยกลับมาทำต่อ" },
      { table: { head: ["signal", "ความหมายปกติ", "ในโจทย์นี้"], rows: [
        ["SIGUSR1", "user-defined #1", "ใช้แทน bit 0"],
        ["SIGUSR2", "user-defined #2", "ใช้แทน bit 1"],
      ]}},
      { note: "SIGUSR1/SIGUSR2 ถูกออกแบบให้ 'นักพัฒนาเอาไปใช้เองได้ตามใจ' — จึงเหมาะกับ minitalk เพราะไม่ไปชนความหมายมาตรฐานของระบบ" },
      { h: "3) signal() vs sigaction()" },
      { p: "การตั้ง handler ทำได้ 2 แบบ. โจทย์แนะนำ `sigaction` เพราะ **กำหนดพฤติกรรมได้ละเอียดและ portable กว่า** `signal()` ที่พฤติกรรมต่างกันในแต่ละ OS" },
      { table: { head: ["", "signal()", "sigaction()"], rows: [
        ["ความเสถียร", "พฤติกรรมต่าง OS", "นิยามชัด เหมือนกันทุกที่"],
        ["รู้ PID ผู้ส่ง", "ไม่ได้", "ได้ (ผ่าน SA_SIGINFO)"],
        ["เหมาะกับ", "งานง่าย ๆ", "minitalk (โดยเฉพาะ bonus ที่ต้อง ack กลับ)"],
      ]}},
      { h: "4) Binary & bitwise operators" },
      { p: "หัวใจของ minitalk คือการเล่นกับ bit. ต้องคล่อง operator พวกนี้:" },
      { table: { head: ["operator", "ทำอะไร", "ตัวอย่าง"], rows: [
        ["`c >> n`", "เลื่อน bit ไปทางขวา n ตำแหน่ง", "ดึง bit ตัวที่ n ลงมาที่ขวาสุด"],
        ["`c << 1`", "เลื่อน bit ไปทางซ้าย 1 (ค่า ×2)", "เปิดที่ว่างขวาสุดให้ bit ใหม่"],
        ["`x & 1`", "AND กับ 1 — เอาเฉพาะ bit ขวาสุด", "เช็คว่า bit นั้นเป็น 0 หรือ 1"],
        ["`c | 1`", "OR กับ 1 — เซ็ต bit ขวาสุดเป็น 1", "เติม bit 1 ลงไป"],
      ]}},
      { code: String.raw`ดึง bit ตัวที่ 6 ของ 'A' (0100 0001):
  (c >> 6) & 1
  = (0100 0001 >> 6) & 1
  = 0000 0001 & 1
  = 1   → ส่ง SIGUSR2`, cap: "เลื่อน bit ที่ต้องการมาขวาสุด แล้ว & 1 เพื่ออ่านค่ามัน — เทคนิคพื้นฐานของการอ่านบิตทีละตัว", lang: "txt" },
      { h: "5) pause() — รออย่างประหยัด CPU" },
      { p: "`pause()` ทำให้ process 'หลับ' จนกว่าจะมี signal เข้ามา. server ใช้ `while(1) pause();` เพื่อรอแบบไม่กิน CPU (ต่างจาก busy-loop `while(1);` ที่หมุนเปล่า ๆ กิน CPU 100%)" },
      { h: "6) usleep() — หน่วงเวลาเป็นไมโครวินาที" },
      { p: "`usleep(n)` หยุดรอ n ไมโครวินาที (1 วินาที = 1,000,000 µs). mandatory ใช้หน่วงระหว่างยิง signal เพื่อให้ server ตามทัน" },
      { h: "🔬 เจาะลึก: ทำไม Linux ทำ signal หล่นหายได้" },
      { p: "ความจริงที่เจ็บปวด: signal มาตรฐาน (อย่าง SIGUSR1/2) **ไม่เข้าคิว (not queued)**. ถ้า server กำลังประมวลผล signal ตัวหนึ่งอยู่ แล้ว client ยิงตัวเดิมซ้ำมาอีก 2 ครั้งก่อน server ว่าง — จะถูกรวบเหลือ 'ค้างอยู่ 1 ครั้ง' เท่านั้น = **หล่นหาย 1 bit** = ข้อความเพี้ยนทั้งสาย" },
      { code: String.raw`client ยิงเร็วเกินไป (ไม่มี ack):
  USR1 → [server กำลังยุ่ง] USR1(ค้าง) USR1(หล่น!) USR2(ค้าง)
  ผล: server ได้แค่ USR1, USR2 → bit หาย → ตัวอักษรเพี้ยน

วิธีแก้ใน mandatory:  usleep(400) ให้ server ตามทัน
วิธีแก้ใน bonus:      รอ ack ทุก bit (lock-step) — แก้ที่ราก`, cap: "นี่คือเหตุผลที่ต้องมี usleep (mandatory) หรือ ack handshake (bonus) — ไม่ใช่ของแถม แต่จำเป็น", lang: "txt" },
      { note: "POSIX มี real-time signal (SIGRTMIN..SIGRTMAX) ที่ 'เข้าคิวได้' แต่โจทย์ minitalk บังคับให้ใช้แค่ SIGUSR1/2 ที่ไม่เข้าคิว — เราจึงต้องจัดการเรื่องนี้เอง" },

      { h: "🔬 เจาะลึก A: bitwise operations — พิสูจน์ว่าทำไม `(c >> bit) & 1` ดึง bit ได้ถูก" },
      { p: "หัวใจของ minitalk คือการ 'อ่านทีละ bit' จาก byte หนึ่ง. หลายคนเขียนโค้ดได้แต่ไม่เข้าใจว่า `>>` และ `& 1` ทำอะไรจริง ๆ — มาพิสูจน์ด้วยเลข Binary กัน" },
      { code: String.raw`สมมติ c = 'A' = 65 = 0100 0001 (binary)

การอ่าน bit ที่ตำแหน่ง bit = 6 (นับจาก 0):
  (c >> 6) & 1

ขั้นที่ 1 — เลื่อนขวา 6 ตำแหน่ง:
  0100 0001 >> 6 = 0000 0001
  (เลขทั้งหมดถูกเลื่อนลงมาขวาสุด — ตำแหน่ง 6 ของเดิมมาอยู่ที่ตำแหน่ง 0)

ขั้นที่ 2 — AND กับ 1 (mask):
  0000 0001 & 0000 0001 = 0000 0001 = 1
  (mask ตัดทุก bit ที่ไม่ใช่ตำแหน่ง 0 เหลือแค่ตัวที่เราเลื่อนลงมา)

ผลลัพธ์ = 1 → ส่ง SIGUSR2

ลองกับ bit = 0 (LSB):
  (0100 0001 >> 0) & 1 = 0100 0001 & 1 = 1 → SIGUSR2 ✓
  ('A' ลงท้ายด้วย 1 จริง ๆ)

ลองกับ bit = 1:
  (0100 0001 >> 1) & 1 = 0010 0000 & 1 = 0 → SIGUSR1 ✓`, cap: ">>(เลื่อนขวา) ย้ายบิตเป้ามาตำแหน่ง 0, &1 mask เอาเฉพาะตัวนั้น — ได้ 0 หรือ 1 พอดี", lang: "txt" },
      { code: String.raw`ฝั่ง server — ประกอบกลับด้วย c = c << 1 | bit:

เริ่ม c = 0000 0000

USR2 (bit=1):  c = (0 << 1) | 1 = 0000 0001
USR1 (bit=0):  c = (1 << 1) | 0 = 0000 0010
USR1 (bit=0):  c = (2 << 1) | 0 = 0000 0100
USR1 (bit=0):  c = (4 << 1) | 0 = 0000 1000
USR1 (bit=0):  c = (8 << 1) | 0 = 0001 0000
USR1 (bit=0):  c = (16<< 1) | 0 = 0010 0000
USR1 (bit=0):  c = (32<< 1) | 0 = 0100 0000
USR2 (bit=1):  c = (64<< 1) | 1 = 1000 0001

ผล = 1000 0001 = 129 (0x81) — ครบ 1 byte`, cap: "เลื่อนซ้าย = เปิดที่ว่างขวาสุด, |1 เติมบิตใหม่ลงไป — MSB-first ทำให้ลำดับถูกต้องโดยอัตโนมัติ", lang: "txt" },
      { note: "ทำไมต้อง MSB-first: ถ้าส่ง LSB-first server จะต้อง 'รู้' ว่าตอนนี้อยู่ bit ที่เท่าไรแล้วจึงจะ know ว่าจะ `|` ค่าที่ตำแหน่งไหน — โค้ดซับซ้อนขึ้น. MSB-first + `<<1` ทำให้ 'ไม่ต้องนับตำแหน่ง' เลย — bit ไปนั่งถูกเอง" },

      { h: "🔬 เจาะลึก B: async-signal-safety — ทำไมฟังก์ชันส่วนใหญ่ห้ามเรียกใน handler" },
      { p: "signal handler มีข้อจำกัดร้ายแรงที่หลายคนมองข้าม: มัน 'แทรก' เข้ามาตอนไหนก็ได้ระหว่างที่โปรแกรมกำลังทำอะไรอยู่ก็ตาม. ถ้า handler เรียกฟังก์ชันที่ 'ไม่ปลอดภัย' ผลลัพธ์อาจพังแบบหาบั๊กยากมาก" },
      { code: String.raw`สถานการณ์ที่เกิดปัญหา:

 main() กำลังทำ printf("Hello")    ← เรียก printf, กำลังเขียน "Hello" ลง buffer
         ↓ signal มาถึง!
 handler() เรียก printf("World")   ← printf ตัวที่ 2 เขียนลง buffer เดียวกัน
         ↓ handler จบ กลับมา main()
 main() printf ต่อ...               ← buffer มี "HelloWorld" ปนกัน → เพี้ยน!
                                         หรือแย่กว่า: malloc/free ถูกแทรก → heap พัง`, cap: "ปัญหาไม่ใช่ 'handler ทำงานพร้อมกัน' (มัน serial) แต่คือ 'handler แทรกกลาง operation ที่ไม่ atomic'", lang: "txt" },
      { p: "POSIX นิยามคำว่า **async-signal-safe** = ฟังก์ชันที่รับประกันว่าเรียกใน handler ได้ปลอดภัย มี **มากกว่า 100 ฟังก์ชัน** ในรายการ (รวม `write`, `_exit`, `kill`, `sigaction`) — ที่เหลือ (เช่น `printf`, `malloc`) ห้ามเรียก" },
      { table: { head: ["ฟังก์ชัน", "ปลอดภัยใน handler?", "ทำไม"], rows: [
        ["`write()`", "✓ ปลอดภัย", "POSIX นิยามชัดว่าเป็น async-signal-safe"],
        ["`write`-based ft_printf", "✓ (ของเรา)", "เพราะเราสร้างบน write() ล้วน — ไม่มี internal buffer"],
        ["`printf()` (libc)", "✗ ไม่ปลอดภัย", "มี internal buffer + เรียก malloc ภายใน"],
        ["`malloc()` / `free()`", "✗ ไม่ปลอดภัย", "จัดการ heap ที่ main อาจกำลังแก้อยู่"],
        ["`exit()`", "✗ ไม่ปลอดภัย", "เรียก cleanup หลายขั้น — ไม่เหมาะใน handler"],
        ["`_exit()`", "✓ ปลอดภัย", "ออกทันทีไม่ cleanup (ใช้เมื่อเกิด error ร้ายแรง)"],
      ]}},
      { code: String.raw`// ✓ โค้ดของเรา — ปลอดภัย
static void handle_signal(int sig)
{
    static unsigned char c = 0;
    static int           bits = 0;

    c = c << 1;
    if (sig == SIGUSR2)
        c = c | 1;
    bits++;
    if (bits == 8)
    {
        if (c == '\0')
            ft_printf("\\n");       // ft_printf สร้างบน write() → ปลอดภัย
        else
            ft_printf("%c", c);     // ← ถ้าตรงนี้เป็น printf ของ libc = บั๊ก!
        c = 0;
        bits = 0;
    }
}`, lang: "c" },
      { note: "ใน minitalk เราโชคดีที่ ft_printf สร้างบน write() — ถ้าโปรเจกต์อื่นต้อง print ใน handler ให้ตรวจสอบเสมอว่าฟังก์ชัน print นั้นสร้างบน write() จริง ๆ ไม่ใช่ libc printf", lang: "c" },

      { h: "🔬 เจาะลึก C: UTF-8 encoding — ทำไมส่ง byte ดิบ ๆ รองรับภาษาไทย/emoji ได้ฟรี" },
      { p: "หลายคนแปลกใจที่ minitalk ไม่ต้องเขียนโค้ดพิเศษใด ๆ ก็ส่งภาษาไทย/emoji ได้. คำตอบอยู่ที่ **UTF-8 encoding** — วิธีเก็บตัวอักษรทุกภาษาในโลกด้วย byte ดิบ" },
      { code: String.raw`UTF-8: ตัวอักษร 1 ตัว = 1 ถึง 4 byte (ไม่เท่ากัน)

ช่วงค่า Unicode      จำนวน byte   รูปแบบบิต
U+0000..U+007F      1 byte       0xxxxxxx          (a-z, A-Z, 0-9)
U+0080..U+07FF      2 bytes      110xxxxx 10xxxxxx  (á, ñ, Greek, Cyrillic)
U+0800..U+FFFF      3 bytes      1110xxxx 10xxxxxx 10xxxxxx  (Thai ก-ฮ, CJK)
U+10000..U+10FFFF   4 bytes      11110xxx 10xxxxxx 10xxxxxx 10xxxxxx  (🎉, 😀)

→ ภาษาอังกฤษ 1 ตัว = 1 signal × 8 = 8 signals
→ ภาษาไทย 1 ตัว = 3 byte × 8 = 24 signals
→ emoji 1 ตัว   = 4 byte × 8 = 32 signals`, lang: "txt" },
      { code: String.raw`ตัวอย่าง: ตัวอักษรไทย 'ก' = U+0E01

ขั้นที่ 1 — หาค่า Unicode:
  'ก' = U+0E01 = 3585 (decimal) = 0000 1110 0000 0001

ขั้นที่ 2 — ใส่ในรูปแบบ UTF-8 (3 bytes เพราะ U+0800..U+FFFF):
  1110xxxx 10xxxxxx 10xxxxxx
  เติม 16 บิตจาก U+0E01 = 0000 1110 0000 0001

  byte 1: 1110 0000 = 0xE0
  byte 2: 10 111000 = 0xB8
  byte 3: 10 000001 = 0x81

client ส่ง 'ก' = ยิง 3 รอบ send_byte():
  round 1: send_byte(pid, 0xE0) → 8 signals (11100000)
  round 2: send_byte(pid, 0xB8) → 8 signals (10111000)
  round 3: send_byte(pid, 0x81) → 8 signals (10000001)

server รับ 3 bytes ต่อกัน → write(0xE0, 0xB8, 0x81) → terminal แสดง 'ก' ✓`, cap: "minitalk ไม่ต้อง 'รู้' เรื่อง UTF-8 เลย — มันแค่ส่ง byte ดิบ แล้ว terminal ฝั่งรับประกอบกลับเอง", lang: "txt" },
      { code: String.raw`emoji: '🎉' = U+1F389 = 4 bytes

UTF-8: 11110000 10011111 10001110 10001001
       = 0xF0    0x9F    0x8E    0x89

client ส่ง 4 × 8 = 32 signals
server รับ 4 bytes → write → terminal แสดง '🎉' ✓`, lang: "txt" },
      { note: "ข้อจำกัด: ถ้า server ใช้ ft_printf('%c', c) ทีละ byte จะไม่เห็นภาษาไทย/emoji เพราะ terminal ต้องได้ byte ครบทั้งตัวอักษรถึงจะแสดงได้. ทางออก: เก็บ byte ไว้ใน buffer แล้ว write ทีเดียวเมื่อครบ 1 ตัวอักษร (หรือเขียน byte ตรง ๆ ด้วย write)", lang: "txt" },

      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Beej's Guide to Unix IPC — Signals", url: "https://beej.us/guide/bgipc/html/#signals", note: "อธิบาย signal / handler / kill อ่านสนุก เข้าใจง่าย" },
        { label: "man7 — signal(7)", url: "https://man7.org/linux/man-pages/man7/signal.7.html", note: "ภาพรวม signal ทั้งหมด + เรื่อง standard signal ไม่เข้าคิว" },
        { label: "man7 — sigaction(2)", url: "https://man7.org/linux/man-pages/man2/sigaction.2.html", note: "เอกสารทางการของ sigaction + SA_SIGINFO / si_pid" },
        { label: "Bitwise operation — Wikipedia", url: "https://en.wikipedia.org/wiki/Bitwise_operation", note: "ทบทวน shift / AND / OR ที่ใช้ประกอบ byte" },
        { label: "Async-signal-safe functions — man7", url: "https://man7.org/linux/man-pages/man7/signal-safety.7.html", note: "รายชื่อฟังก์ชันที่ปลอดภัยใน signal handler (100+ ตัว) + ทำไมตัวอื่นไม่ปลอดภัย" },
        { label: "UTF-8 — Wikipedia", url: "https://en.wikipedia.org/wiki/UTF-8", note: "ที่มาของ encoding ที่ทำให้ byte ดิบส่งภาษาไทย/emoji ได้ฟรี" },
      ]},
    ],
    foundations: [
      { p: "หมวดนี้เจาะ **ตัวแปร, การเก็บ state, และ memory** ที่ minitalk ใช้ — ซึ่งบางอย่างพิเศษเพราะมันอยู่ใน signal handler" },
      { h: "ปัญหา: handler จำอะไรไม่ได้ระหว่างการเรียก" },
      { p: "signal handler ถูกเรียกใหม่ทุกครั้งที่มี signal มา — ตัวแปรธรรมดาในฟังก์ชันจะถูกล้างทุกครั้ง. แต่เราต้อง 'จำ' ว่าตอนนี้ประกอบ byte ไปกี่ bit แล้ว และค่าปัจจุบันคืออะไร. ทางออก 2 แบบ:" },
      { table: { head: ["วิธี", "ขอบเขต", "ใช้ที่ไหน"], rows: [
        ["`static` local", "อยู่ในฟังก์ชัน แต่คงค่าข้ามการเรียก", "server (mandatory + bonus)"],
        ["global variable", "ทั้งโปรแกรมเห็น", "client bonus (g_ack)"],
      ]}},
      { h: "ทำไม server เลือก static local (ไม่ใช่ global)" },
      { code: String.raw`static void handle_signal(int sig)
{
    static unsigned char c = 0;    // ค่า byte ที่กำลังประกอบ
    static int           bits = 0; // ประกอบไปกี่ bit แล้ว
    ...
}`, cap: "static = ตัวแปรนี้ถูกสร้างครั้งเดียว คงค่าไว้ตลอดอายุโปรแกรม แต่ 'ชื่อ' มองเห็นได้แค่ในฟังก์ชันนี้", lang: "c" },
      { p: "**ข้อดีของ static local:** ซ่อน state ไว้ในฟังก์ชันที่ใช้จริง ไม่รั่วออกไปให้โค้ดส่วนอื่นแก้ได้ — สะอาดกว่า global. server ทำได้เพราะไม่ต้องให้ใครข้างนอกอ่าน state นี้" },
      { h: "ทำไม client bonus ต้องใช้ global" },
      { p: "client bonus มี handler (`ack_handler`) คนละตัวกับ loop หลัก (`send_byte`). handler ต้อง 'บอก' loop หลักว่า ack มาแล้ว — ข้อมูลต้องข้ามฟังก์ชัน → ต้องใช้ **global**. subject อนุญาตให้ใช้ global ได้ 1 ตัว ซึ่งก็คือ `g_ack` นี่เอง" },
      { h: "volatile sig_atomic_t — type พิเศษของ global ใน handler" },
      { code: String.raw`volatile sig_atomic_t g_ack = 0;`, lang: "c" },
      { table: { head: ["คำ", "ทำไมต้องมี"], rows: [
        ["`volatile`", "บอก compiler ว่า 'ค่านี้เปลี่ยนได้เองนอกเหนือ flow ปกติ' (จาก handler) → ห้าม optimize เก็บไว้ใน register, ต้องอ่านจาก memory จริงทุกครั้ง"],
        ["`sig_atomic_t`", "type ที่การันตีว่าอ่าน/เขียนได้ใน 'จังหวะเดียว' (atomic) — ไม่ถูก signal แทรกกลางคัน ทำให้ค่าไม่เพี้ยน"],
      ]}},
      { note: "ถ้าลืม volatile: compiler อาจมองว่า `while (g_ack == 0)` เป็น loop ที่ค่าไม่เปลี่ยน แล้ว optimize เป็น infinite loop ทันที — โปรแกรมค้าง! นี่คือบั๊กคลาสสิกที่หายาก" },
      { h: "ทำไม c เป็น unsigned char" },
      { p: "ใช้ `unsigned char` (0..255) ไม่ใช่ `char` (อาจ −128..127) เพราะการเลื่อน bit (`<<`) บน type ที่มีเครื่องหมายอาจให้ผลไม่นิยามเมื่อ bit สูงสุดถูกตั้ง — `unsigned` ปลอดภัยและตรงกับความหมาย 'นี่คือ 8 bit ดิบ ๆ'" },
    ],
    architecture: [
      { h: "ไฟล์ในโปรเจกต์" },
      { table: { head: ["ไฟล์", "หน้าที่"], rows: [
        ["`server.c`", "รับ signal, ประกอบ byte, พิมพ์ (mandatory)"],
        ["`client.c`", "หั่นข้อความเป็น bit, ยิง signal (mandatory)"],
        ["`server_bonus.c`", "เหมือน server + ส่ง ack กลับหา client"],
        ["`client_bonus.c`", "เหมือน client + รอ ack ก่อนยิง bit ถัดไป"],
        ["`minitalk.h` / `minitalk_bonus.h`", "include + prototype"],
        ["`libft/`", "ft_printf (ใช้ใน handler ได้เพราะ write-based)"],
        ["`Makefile`", "all / clean / fclean / re / bonus"],
      ]}},
      { h: "ภาพรวมการคุยกัน (mandatory)" },
      { code: String.raw`  CLIENT                          SERVER
    │                               │
    │   อ่าน argv: PID + ข้อความ      │  พิมพ์ getpid()
    │                               │  while(1) pause()  ← รอ
    │  ── SIGUSR1/2 (bit 0) ──────► │  handler: c<<1, bits++
    │       usleep(400)             │
    │  ── SIGUSR1/2 (bit 1) ──────► │  handler: ...
    │       ...×8                   │  ครบ 8 bit → พิมพ์ char
    │  ── ... ทุกตัวอักษร ──────────► │
    │  ── 8 bit ของ '\0' ─────────► │  เจอ '\0' → ขึ้นบรรทัดใหม่
    │   จบ (return 0)               │  รอ client ตัวถัดไป`, cap: "client เป็นฝ่ายยิงอย่างเดียว, server เป็นฝ่ายรับ+ประกอบ+พิมพ์", lang: "txt" },
      { h: "ภาพรวมการคุยกัน (bonus — มี ack)" },
      { code: String.raw`  CLIENT                          SERVER
    │  g_ack=0; kill(bit) ───────►  │  handler: ประกอบ bit
    │  while(g_ack==0) usleep(1)    │  ◄─────── kill(client, ack)
    │  ◄── ได้ ack → ยิง bit ถัดไป   │  (ทุก bit ack ด้วย USR1)
    │       ...                     │  ครบ byte: พิมพ์ char
    │  ส่ง '\0' ครบ 8 bit ──────►    │  เจอ '\0':
    │  ◄── ack ด้วย SIGUSR2         │  ◄─────── kill(client, USR2)
    │  g_ack==2 → "Message          │
    │             delivered!"       │`, cap: "ทุก bit มีการตอบรับ → ไม่มีทางหล่น และ client รู้ตอนจบ", lang: "txt" },
      { note: "สังเกต: server (ทั้งสองเวอร์ชัน) วน `while(1)` ตลอด — ไม่มีวันจบเอง ต้องกด Ctrl+C ปิด เพราะมันต้องพร้อมรับ client ได้เรื่อย ๆ" },
    ],
    dataflow: [
      { p: "ไล่ **ทุกฟังก์ชัน** ทีละตัว ตามลำดับการทำงานจริง" },
      { h: "server.c — main()" },
      { code: String.raw`int main(void)
{
    struct sigaction sa;

    ft_printf("Server PID: %d\n", getpid());  // ← บอก PID
    sa.sa_handler = &handle_signal;           // ตั้ง handler
    sigemptyset(&sa.sa_mask);                 // ไม่บล็อก signal อื่น
    sa.sa_flags = 0;
    if (sigaction(SIGUSR1, &sa, NULL) == -1) return (1);
    if (sigaction(SIGUSR2, &sa, NULL) == -1) return (1);
    while (1)
        pause();                              // หลับรอ signal
    return (0);
}`, lang: "c" },
      { ul: [
        "`getpid()` → พิมพ์ PID ให้เราเอาไปให้ client",
        "`sigemptyset(&sa.sa_mask)` → เคลียร์ชุด signal ที่จะถูกบล็อกระหว่าง handler ทำงาน (ให้ว่าง)",
        "`sa.sa_flags = 0` → ใช้ handler แบบธรรมดา (รับแค่หมายเลข signal)",
        "ผูกทั้ง SIGUSR1 และ SIGUSR2 เข้า handler เดียวกัน → handler แยกเองว่าเป็น bit 0 หรือ 1",
      ]},
      { h: "server.c — handle_signal(int sig)" },
      { code: String.raw`static void handle_signal(int sig)
{
    static unsigned char c = 0;
    static int           bits = 0;

    c = c << 1;                  // เปิดที่ว่างขวาสุด
    if (sig == SIGUSR2)
        c = c | 1;               // bit นี้เป็น 1
    bits++;
    if (bits == 8)               // ครบ 1 byte
    {
        if (c == '\0')
            ft_printf("\n");     // จบ message
        else
            ft_printf("%c", c);  // พิมพ์ตัวอักษร
        c = 0;                   // รีเซ็ตเริ่ม byte ใหม่
        bits = 0;
    }
}`, lang: "c" },
      { p: "ทุกครั้งที่ signal มา: เลื่อน `c` ซ้าย 1, ถ้าเป็น USR2 ก็เติม 1 ที่ขวาสุด, นับ bit. พอครบ 8 → เป็น 1 ตัวอักษรเต็ม → พิมพ์ แล้วรีเซ็ต. ถ้าตัวอักษรนั้นคือ `'\\0'` แสดงว่าจบข้อความ ขึ้นบรรทัดใหม่" },
      { h: "client.c — send_byte(int pid, unsigned char c)" },
      { code: String.raw`static void send_byte(int pid, unsigned char c)
{
    int bit;

    bit = 8;
    while (bit > 0)
    {
        bit--;                       // 7,6,5,...,0  (MSB-first)
        if ((c >> bit) & 1)
            kill(pid, SIGUSR2);      // bit เป็น 1
        else
            kill(pid, SIGUSR1);      // bit เป็น 0
        usleep(400);                 // ให้ server ตามทัน
    }
}`, lang: "c" },
      { p: "วนจาก bit 7 ลงไป 0 (MSB-first): ดึงค่าแต่ละ bit ด้วย `(c >> bit) & 1` แล้วยิง signal ตามค่า. `usleep(400)` คือกันชนกัน signal หล่น" },
      { h: "client.c — main()" },
      { code: String.raw`int main(int argc, char **argv)
{
    int pid;
    int i;

    if (argc != 3) { ... return (1); }      // ต้องมี PID + ข้อความ
    pid = ft_atoi(argv[1]);
    if (pid <= 0) { ... return (1); }        // PID ต้องเป็นบวก
    i = 0;
    while (argv[2][i])
        send_byte(pid, argv[2][i++]);        // ส่งทุกตัวอักษร
    send_byte(pid, '\0');                     // ปิดท้ายด้วย null
    return (0);
}`, lang: "c" },
      { h: "ส่วนต่างของ bonus" },
      { ul: [
        "**server_bonus** ใช้ `sa.sa_sigaction` + `SA_SIGINFO` → handler รับ `siginfo_t *info` ทำให้รู้ `info->si_pid` (PID ของ client) แล้ว `kill(client, ...)` ส่ง ack กลับได้",
        "**client_bonus** มี `ack_handler` ตั้ง `g_ack` และ `send_byte` มี `while (g_ack == 0) usleep(1);` รอ ack ก่อนยิง bit ถัดไป — ไม่ใช้ usleep คงที่แล้ว",
      ]},
      { code: String.raw`/* server_bonus: รู้ว่าใครส่งมา แล้ว ack กลับ */
static void handle_signal(int sig, siginfo_t *info, void *ucontext)
{
    static unsigned char c = 0;
    static int           bits = 0;

    (void)ucontext;
    c = c << 1;
    if (sig == SIGUSR2)
        c = c | 1;
    bits++;
    if (bits == 8) { print_byte(c, info->si_pid); c = 0; bits = 0; }
    else
        kill(info->si_pid, SIGUSR1);   // ack ทุก bit ที่ยังไม่ครบ byte
}`, cap: "info->si_pid คือกุญแจของ bonus — ทำให้ server ตอบกลับถูกคน", lang: "c" },
    ],
    implementation: [
      { h: "ลำดับการลงมือเขียน (แนะนำ)" },
      { ul: [
        "1. เขียน server ให้พิมพ์ PID + ตั้ง handler ว่าง ๆ ก่อน → รันแล้วลองส่ง `kill -USR1 <pid>` จาก terminal ดูว่า handler ทำงานไหม",
        "2. ใส่ logic ประกอบ bit ใน handler → ลองส่งทีละ bit ด้วยมือ",
        "3. เขียน client: ft_atoi(PID) + ลูปส่ง bit + usleep",
        "4. ทดสอบข้อความสั้น → ยาว → อักขระพิเศษ/ภาษาไทย (unicode)",
        "5. ทำ bonus: เพิ่ม ack ทั้งสองฝั่ง",
      ]},
      { h: "เลือกค่า usleep เท่าไรดี (mandatory)" },
      { table: { head: ["usleep", "ผล"], rows: [
        ["น้อยเกิน (เช่น 50)", "เร็วดี แต่เสี่ยง signal หล่นถ้าเครื่องช้า/โหลดสูง"],
        ["400 (โค้ดนี้เลือก)", "สมดุล — เร็วพอ และเชื่อถือได้บนเครื่องทั่วไป"],
        ["มากเกิน (เช่น 5000)", "ปลอดภัยสุด แต่ส่งข้อความยาวช้ามาก"],
      ]}},
      { note: "bonus ไม่ต้องเดาค่า usleep เลย เพราะ ack handshake sync ให้เองอัตโนมัติ — เร็วเท่าที่เครื่องไหว และไม่หล่น" },
      { h: "ทำไม ft_printf ใช้ใน handler ได้" },
      { p: "ตามกฎ async-signal-safety ฟังก์ชันส่วนใหญ่ห้ามเรียกใน handler — แต่ `write()` เป็นหนึ่งในฟังก์ชันที่ปลอดภัย. ft_printf ของเราสร้างบน `write()` จึงใช้ได้ (ถ้าใช้ `printf` ของ libc จริงซึ่ง buffer ภายในจะไม่ปลอดภัย)" },
      { h: "การ build" },
      { code: String.raw`make            # สร้าง server + client (mandatory)
make bonus      # สร้าง server_bonus + client_bonus
make re         # fclean + all`, lang: "bash" },
    ],
    tricks: [
      { h: "ทริค 1: handler เดียวรับสอง signal" },
      { p: "ไม่ต้องเขียน handler 2 ตัว — ผูกทั้ง USR1/USR2 เข้า handler เดียว แล้วใช้พารามิเตอร์ `sig` แยกเอาเองว่าเป็น bit ไหน. ประหยัดโค้ดและ logic รวมศูนย์" },
      { h: "ทริค 2: c << 1 | bit — ประกอบ byte แบบไม่ต้องนับตำแหน่ง" },
      { p: "เพราะส่ง MSB-first การประกอบจึงเป็นแค่ 'เลื่อนซ้าย + เติม bit ขวา' ซ้ำ 8 ครั้ง โดยไม่ต้องรู้ว่ากำลังอยู่ bit ตำแหน่งไหน — bit จะไปนั่งตำแหน่งถูกเองอัตโนมัติ" },
      { h: "ทริค 3: static local แทน global ใน server" },
      { p: "เก็บ state การประกอบ byte ไว้ใน static local ของ handler → ไม่ต้องมี global เลยในฝั่ง server. สะอาดและตรงเจตนาของ subject ที่อยากให้ใช้ global น้อยที่สุด" },
      { h: "ทริค 4: '\\0' เป็นสัญญาณจบ ไม่ต้องส่งความยาวก่อน" },
      { p: "แทนที่จะส่งความยาวข้อความนำหน้า (ยุ่งยาก) เราอาศัยว่า C string จบด้วย `'\\0'` อยู่แล้ว — ส่ง `'\\0'` ตามท้ายแล้วให้ server เห็นเป็นสัญญาณ 'จบ' พอดี" },
      { h: "ทริค 5 (bonus): lock-step ผ่าน g_ack 3 สถานะ" },
      { p: "client ตั้ง `g_ack=0` ก่อนยิง แล้วรอจนมันเปลี่ยน. server ack ด้วย USR1 (=`g_ack` กลายเป็น 1) สำหรับ bit ทั่วไป และ USR2 (=`g_ack` กลายเป็น 2) เมื่อจบ message — ทำให้ client รู้ทั้ง 'ส่งสำเร็จ' และ 'จบแล้ว' จากตัวแปรเดียว" },
      { h: "ทริค 6: รองรับ unicode/ภาษาไทยฟรี" },
      { p: "เพราะเราส่งทีละ byte ดิบ ๆ ตัวอักษร UTF-8 ที่กินหลาย byte (เช่นภาษาไทย) ก็แค่ถูกหั่นเป็นหลาย byte ส่งต่อกันไป — server พิมพ์ byte ออกตามลำดับ terminal ประกอบกลับเป็นอักขระให้เอง โดยเราไม่ต้องทำอะไรพิเศษ" },
    ],
    eval: [
      { qa: [
        { q: "ทำไมใช้ได้แค่ SIGUSR1/SIGUSR2?", a: "เป็น signal ที่ระบบสงวนไว้ให้ผู้ใช้นิยามความหมายเอง ไม่ชนกับ signal มาตรฐานของ OS — เหมาะกับการประดิษฐ์ protocol เอง และโจทย์บังคับให้ใช้แค่ 2 ตัวนี้" },
        { q: "1 ตัวอักษรใช้กี่ signal?", a: "8 (1 byte = 8 bit, ยิง 1 signal ต่อ bit). ข้อความ n ตัวอักษร = (n+1)×8 signal รวม '\\0' ปิดท้าย" },
        { q: "MSB-first คืออะไร ทำไมเลือก?", a: "ส่ง bit ค่ามากสุด (ตำแหน่ง 7) ก่อน. เลือกเพราะ server ประกอบกลับด้วย c<<1 ทุกครั้งแล้วเติม bit ขวาสุดได้พอดี ไม่ต้องนับตำแหน่ง" },
        { q: "server เก็บ state การประกอบ byte ยังไงโดยไม่ใช้ global?", a: "ใช้ static local ใน handler (static unsigned char c, static int bits) — คงค่าข้ามการเรียก handler แต่ไม่รั่วออกนอกฟังก์ชัน" },
        { q: "ทำไม signal หล่นหายได้ และแก้ยังไง?", a: "signal มาตรฐานไม่เข้าคิว — ถ้ามาซ้ำตอน server ยุ่งจะถูกรวบเหลือครั้งเดียว. mandatory แก้ด้วย usleep หน่วงให้ server ตามทัน, bonus แก้ด้วย ack handshake รอตอบรับทุก bit" },
        { q: "sigaction ต่างจาก signal ยังไง ทำไมใช้ sigaction?", a: "sigaction พฤติกรรมนิยามชัดและเหมือนกันทุก OS (portable) และรองรับ SA_SIGINFO เพื่อรู้ PID ผู้ส่ง (จำเป็นกับ bonus); signal() พฤติกรรมต่างกันในแต่ละระบบ" },
        { q: "bonus รู้ได้ยังไงว่าจะ ack กลับไปหา client ตัวไหน?", a: "ตั้ง SA_SIGINFO แล้ว handler รับ siginfo_t *info → อ่าน info->si_pid ซึ่งคือ PID ของ process ที่ส่ง signal มา แล้ว kill กลับไปที่ PID นั้น" },
        { q: "volatile sig_atomic_t คืออะไร ทำไมต้องใช้กับ g_ack?", a: "volatile กัน compiler optimize ค่าที่ถูกเปลี่ยนใน handler ทิ้ง (ไม่งั้น while รอ ack จะค้าง); sig_atomic_t การันตีอ่าน/เขียนเป็น atomic ไม่ถูก signal แทรกกลางคัน" },
        { q: "ทำไม while(1) pause() ดีกว่า while(1);?", a: "pause() ทำให้ process หลับรอ signal ไม่กิน CPU; while(1); หมุนเปล่ากิน CPU 100% โดยไม่จำเป็น" },
        { q: "ใช้ ft_printf ใน handler ปลอดภัยไหม?", a: "ปลอดภัยเพราะ ft_printf สร้างบน write() ซึ่งเป็น async-signal-safe; ถ้าใช้ printf ของ libc ที่มี buffer ภายในจะไม่ปลอดภัย" },
        { q: "รองรับภาษาไทย/emoji ได้ไหม?", a: "ได้ เพราะส่งทีละ byte ดิบ — อักขระ UTF-8 หลาย byte ถูกส่งต่อกันแล้ว terminal ฝั่ง server ประกอบกลับเอง" },
        { q: "ถ้าให้ PID ผิด/ไม่มี process นั้นจะเกิดอะไร?", a: "kill() จะ error (ส่งไม่ถึง) — client เช็ค pid<=0 เบื้องต้น และจริง ๆ ควรเช็ค return ของ kill เพื่อแจ้ง error ถ้า process ปลายทางไม่มี" },
      ]},
      { h: "ทดสอบ" },
      { code: String.raw`# เทอร์มินัล 1
./server
# → Server PID: 12345

# เทอร์มินัล 2
./client 12345 "Hello, 42!"
./client 12345 "ภาษาไทยก็ได้ 🎉"

# bonus: client จะพิมพ์ "Message delivered!" เมื่อ server ack ครบ
./client_bonus 12345 "with acknowledgement"`, lang: "bash" },
    ],
  },
},
/* ===================== FDF ===================== */
{
  id: "fdf",
  name: "FdF",
  tag: { th: "อ่านไฟล์ความสูงเป็นตาราง แล้ววาดเป็นภูเขา 3D โครงลวดบนจอ — เรขาคณิต + กราฟิกพื้นฐาน", en: "Read a grid of altitudes and draw it as a 3D wireframe — geometry meets graphics" },
  accent: "#48dbfb",
  sections: {
    principle: [
      { h: "โจทย์คืออะไร" },
      { p: "**FdF = Fil de Fer** (ภาษาฝรั่งเศส แปลว่า 'เส้นลวด'). อ่านไฟล์ `.fdf` ที่เป็น **ตารางตัวเลขความสูง (z)** แล้ววาดออกมาเป็น **ภาพ 3D แบบโครงลวด (wireframe)** บนหน้าต่างด้วย MiniLibX" },
      { code: String.raw`ไฟล์ .fdf:           วาดออกมาเป็น:
0  0  0  0              ◇──◇──◇──◇
0  5  5  0      →      ╱ ╲╱ ╲╱ ╲ ╲
0  5  5  0            ◇  ◇──◇  ◇    (ยอดสูงตรงกลางนูนขึ้น)
0  0  0  0`, cap: "ตัวเลขแต่ละช่อง = ความสูง z ของจุดนั้น — เลขมาก = นูนขึ้น", lang: "txt" },
      { h: "หัวใจ 3 ขั้น" },
      { table: { head: ["ขั้น", "ทำอะไร"], rows: [
        ["1. Parse", "อ่านไฟล์ → เก็บเป็นตาราง 2 มิติของค่า z (และสีถ้ามี)"],
        ["2. Project", "แปลงพิกัด 3D (x, y, z) ของแต่ละจุด → พิกัด 2D (จอ) ด้วยการฉายแบบ isometric"],
        ["3. Draw", "ลากเส้นเชื่อมจุดข้างเคียง (ขวา + ล่าง) ด้วย Bresenham's line algorithm"],
      ]}},
      { note: "กุญแจสำคัญ: เรามีข้อมูล 3 มิติ แต่จอมี 2 มิติ — ต้อง 'ฉาย' (project) 3D ลงบนระนาบ 2D ให้ตาคนเห็นเป็นภาพมีมิติ" },
      { h: "isometric projection คืออะไร" },
      { p: "**Isometric** = การฉายภาพ 3D ที่มองจากมุมเฉียง ทำให้แกนทั้งสามดูเท่า ๆ กัน (เหมือนเกมแนว SimCity เก่า ๆ). ข้อดีคือไม่มี perspective (ของไกลไม่เล็กลง) คำนวณง่ายด้วยสูตรตายตัว:" },
      { code: String.raw`x_iso = (x - y) · cos(30°)
y_iso = (x + y) · sin(30°) - z · scale`, cap: "หมุนตาราง 45° แล้วบีบแนวตั้ง → ได้มุมมองเฉียงคลาสสิก; z ยกจุดขึ้นตามความสูง", lang: "txt" },
      { h: "ทำไมต้องใช้ Bresenham วาดเส้น" },
      { p: "จอเป็น pixel เป็นช่อง ๆ (จำนวนเต็ม) แต่เส้นตรงในคณิตศาสตร์เป็นทศนิยม. **Bresenham's algorithm** หาว่า pixel ไหน 'ใกล้เส้นจริงที่สุด' โดยใช้แค่การบวก/ลบจำนวนเต็ม (ไม่มีการหาร/ทศนิยม) → เร็วมากและไม่มี gap" },
      { h: "บทบาทของ MiniLibX" },
      { p: "**MiniLibX (mlx)** คือ graphics library ขั้นต่ำที่ 42 ให้มา ทำหน้าที่: เปิดหน้าต่าง, วาด pixel, รับ event (กดปุ่ม/ปิดหน้าต่าง). เราไม่แตะ X11/OpenGL ตรง ๆ — mlx ห่อให้หมด" },
    ],
    theory: [
      { p: "หมวดนี้รวมทฤษฎี **เรขาคณิต + กราฟิก** ที่ต้องเข้าใจก่อนอ่านโค้ด FdF" },
      { h: "1) ระบบพิกัดจอ (screen coordinates)" },
      { p: "จอคอมพิวเตอร์ใช้พิกัดที่ **มุมซ้ายบนคือ (0,0)** แกน x ชี้ขวา, แกน **y ชี้ลง** (ตรงข้ามคณิตศาสตร์ที่ y ชี้ขึ้น). นี่เป็นสาเหตุที่หลายสูตรกราฟิกต้องกลับด้าน y" },
      { h: "2) มุมมองสามมิติ → สองมิติ (projection)" },
      { table: { head: ["แบบ", "ลักษณะ", "ใช้ใน FdF"], rows: [
        ["Isometric", "มุมเฉียงคงที่ ของไกลไม่เล็กลง", "✓ หลัก"],
        ["Perspective", "ของไกลเล็กลง (เหมือนตาคนจริง)", "ไม่ใช้ (ซับซ้อนกว่า)"],
        ["Top-down / Side", "มองตรงจากบน/ข้าง", "bonus (สลับมุมมอง)"],
      ]}},
      { h: "3) ตรีโกณมิติพื้นฐาน: sin/cos" },
      { p: "การหมุนจุดในระนาบใช้ sin/cos. ใน isometric เราใช้มุม 30° ตายตัว จึง precompute เป็นค่าคงที่ไว้เลย (ไม่ต้องเรียก `cos()` ทุกจุด):" },
      { code: String.raw`# define COS30 0.866025403784   /* cos(30°) */
# define SIN30 0.5              /* sin(30°) */`, cap: "ฝังค่าคงที่ไว้ → เร็วกว่าเรียกฟังก์ชัน math ทุกครั้ง", lang: "c" },
      { h: "4) Linear interpolation (lerp)" },
      { p: "**lerp** = การหาค่าระหว่างสองค่าแบบเชิงเส้น ด้วยพารามิเตอร์ t (0..1): `result = a + (b - a)·t`. FdF ใช้ lerp ไล่ **สี** ตามแนวเส้น (ปลายข้างหนึ่งสีหนึ่ง ค่อย ๆ เปลี่ยนเป็นอีกสี)" },
      { code: String.raw`t = 0.0  →  สีของจุด a (ต้นเส้น)
t = 0.5  →  สีผสมครึ่งทาง
t = 1.0  →  สีของจุด b (ปลายเส้น)`, lang: "txt" },
      { h: "5) สี RGB ในเลขฐาน 16" },
      { p: "สี 1 pixel = 24 bit แบ่งเป็น 3 ช่อง (แดง/เขียว/น้ำเงิน) ช่องละ 8 bit (0..255). เก็บรวมในเลขเดียว `0xRRGGBB`:" },
      { table: { head: ["ส่วน", "bit", "ดึงด้วย"], rows: [
        ["R (แดง)", "16–23", "`(c >> 16) & 0xFF`"],
        ["G (เขียว)", "8–15", "`(c >> 8) & 0xFF`"],
        ["B (น้ำเงิน)", "0–7", "`c & 0xFF`"],
      ]}},
      { h: "6) Bresenham's line algorithm (ทฤษฎี)" },
      { p: "ปัญหา: ลากเส้นจาก (x0,y0) ถึง (x1,y1) บนตาราง pixel ให้เนียน. Bresenham เก็บ 'ค่าความผิดพลาดสะสม (error)' แล้วตัดสินทีละก้าวว่าควรขยับ x, y หรือทั้งคู่ — ใช้แค่จำนวนเต็มและการบวก ไม่มีการหารหรือ float เลย" },
      { code: String.raw`dx =  |x1 - x0|        sx = ทิศ x (+1/-1)
dy = -|y1 - y0|        sy = ทิศ y (+1/-1)
err = dx + dy

วนแต่ละก้าว:
  e2 = 2·err
  ถ้า e2 >= dy:  err += dy;  x += sx   (ขยับแนวนอน)
  ถ้า e2 <= dx:  err += dx;  y += sy   (ขยับแนวตั้ง)
  จนถึงปลายทาง`, cap: "error บอกว่าตอนนี้เส้นจริง 'เอียง' ไปทางไหน → เลือกขยับแกนที่ทำให้ใกล้เส้นจริงสุด", lang: "txt" },
      { h: "🔬 เจาะลึก A: ที่มาของสูตร isometric — มาจากการหมุนแกนทีละขั้น" },
      { p: "**ภาพในหัว:** isometric คือการวาดแกน 3 แกนของโลกให้เอียง 30° เท่า ๆ กันบนจอ. แทนที่จะท่องสูตร `(x−y)cos30` มาดูว่ามัน 'โผล่ออกมา' จากการวางทิศของแต่ละแกนยังไง" },
      { code: String.raw`วางทิศของแต่ละแกนโลกลงบนจอ (จอ y ชี้ลง):
  เดิน +1 ตามแกน x โลก → บนจอเลื่อน (+cos30, +sin30)   (ลงขวา 30°)
  เดิน +1 ตามแกน y โลก → บนจอเลื่อน (−cos30, +sin30)   (ลงซ้าย 30°)
  เดิน +1 ตามแกน z (สูง) → บนจอเลื่อน (0, −1)·scale     (ตรงขึ้น)

รวมผลของจุด (x, y, z) = บวก contribution ทั้ง 3 แกน:
  screen_x = x·cos30 − y·cos30        = (x − y)·cos30
  screen_y = x·sin30 + y·sin30 − z·s  = (x + y)·sin30 − z·scale`, cap: "สูตรไม่ได้เสกมา — มันคือผลรวมของ 'แต่ละแกนเลื่อนจุดบนจอไปทางไหน'", lang: "txt" },
      { p: "**ลองแทนเลขจริง** (cos30 ≈ 0.866, sin30 = 0.5):" },
      { code: String.raw`จุด (x=2, y=0, z=0):
  screen_x = (2−0)·0.866 = 1.732
  screen_y = (2+0)·0.5 − 0 = 1.0      → ขยับลงขวา ✓ (แกน x ทอดลงขวา)

จุดสูง (x=0, y=0, z=3):
  screen_x = 0
  screen_y = 0 − 3·scale              → ขยับ "ขึ้น" (ค่า y ติดลบ = สูงขึ้นบนจอ) ✓`, cap: "z ลบออกจาก screen_y เพราะจอ y ชี้ลง — จุดยิ่งสูงยิ่งต้องไปทางบน (y น้อย)", lang: "txt" },
      { note: "ลองพิสูจน์เอง: แทน (x=0,y=2,z=0) ควรได้ screen_x = −1.732 (ลงซ้าย) — ยืนยันว่าแกน x กับ y ทอดไปคนละข้าง เกิดเป็นมุมมองเฉียง" },
      { qa: [
        { q: "ทำไม screen_x ใช้ (x−y) แต่ screen_y ใช้ (x+y)?", a: "เพราะแกน x ทอดลง'ขวา' (screen_x บวก) แต่แกน y ทอดลง'ซ้าย' (screen_x ลบ) → screen_x = x·cos30 − y·cos30. ส่วนแนวตั้งทั้งสองแกนทอด'ลง'เหมือนกัน → screen_y = (x+y)·sin30" },
        { q: "ทำไมต้องลบ z·scale ไม่ใช่บวก?", a: "จอมี y ชี้ลง (มุมบนซ้าย = 0,0). จุดที่สูงในโลกต้องวาด 'สูงขึ้นบนจอ' = ค่า y น้อยลง → จึงลบ z ออกจาก screen_y" },
        { q: "ถ้าใช้ cos45/sin45 แทน 30 จะได้อะไร?", a: "ได้มุมมองแบบ 'หมุน 45° แบน ๆ' (dimetric/military projection) — ของจริง isometric แท้ใช้มุม ~35.26° แต่เกม/FdF นิยม 30° เพราะคำนวณลงตัวและสวย" },
      ]},

      { h: "🔬 เจาะลึก B: Bresenham — พิสูจน์ว่าทำไมใช้จำนวนเต็มล้วนวาดเส้นได้เนียน" },
      { p: "**ภาพในหัว:** เส้นตรงคณิตศาสตร์เป็นทศนิยม (y = mx + c) แต่จอมี pixel เป็นช่องจำนวนเต็ม. Bresenham เลือก pixel ที่ 'ใกล้เส้นจริงสุด' ทีละก้าวโดยใช้แค่บวก/ลบจำนวนเต็ม — เร็วและไม่มีรู" },
      { p: "**กลไก error term:** เก็บ 'ความผิดพลาดสะสม' ว่าตอนนี้ pixel ห่างจากเส้นจริงเท่าไร พอสะสมเกินครึ่งช่องค่อยขยับอีกแกน. เวอร์ชัน all-octant (ใช้ได้ทุกทิศ) เก็บ err = dx + dy:" },
      { code: String.raw`dx =  abs(x1-x0)      sx = (x0<x1) ? +1 : -1
dy = -abs(y1-y0)      sy = (y0<y1) ? +1 : -1
err = dx + dy
loop:
  plot(x0, y0)
  if (x0==x1 && y0==y1) break
  e2 = 2*err
  if (e2 >= dy) { err += dy; x0 += sx }    // ขยับแนวนอน
  if (e2 <= dx) { err += dx; y0 += sy }    // ขยับแนวตั้ง`, cap: "ทุกค่าเป็น int, ไม่มีหาร/ทศนิยม — err ตัดสินว่าก้าวนี้ควรขยับแกนไหน (หรือทั้งคู่)", lang: "c" },
      { p: "**ไล่ทีละก้าว** — วาดจาก (0,0) ถึง (5,2): dx=5, dy=−2, err=3" },
      { code: String.raw`ก้าว │ plot   │ e2=2err │ e2>=dy(-2)? → x  │ e2<=dx(5)? → y │ err
  ───┼────────┼─────────┼──────────────────┼───────────────┼────
   1 │ (0,0)  │   6     │ ใช่ x→1          │ ไม่             │  1
   2 │ (1,0)  │   2     │ ใช่ x→2          │ ใช่ y→1         │  4
   3 │ (2,1)  │   8     │ ใช่ x→3          │ ไม่             │  2
   4 │ (3,1)  │   4     │ ใช่ x→4          │ ใช่ y→2         │  5
   5 │ (4,2)  │  10     │ ใช่ x→5          │ ไม่             │  3
   6 │ (5,2)  │ — ถึงปลายทาง break —                       │
  → pixels: (0,0)(1,0)(2,1)(3,1)(4,2)(5,2) = บันไดเอียงเนียนพอดี`, cap: "เส้น slope 2/5: ขยับ x ทุกก้าว, ขยับ y เฉพาะก้าวที่ error สะสมพอ → ได้ขั้นบันไดที่ใกล้เส้นจริงสุด", lang: "txt" },
      { note: "ลองพิสูจน์เอง: วาด (0,0)→(2,5) (ชันกว่า) ด้วยตาราง — จะเห็นว่าคราวนี้ 'ขยับ y ทุกก้าว ขยับ x บางก้าว' กลับกัน เพราะ |dy|>|dx| — Bresenham ปรับเองอัตโนมัติด้วยเงื่อนไข e2" },
      { qa: [
        { q: "ทำไม Bresenham ไม่ใช้ float (y = mx+c) ไปเลย?", a: "float ช้ากว่าและสะสม error ปัดเศษ; การวาดเส้นทำหลายล้านครั้ง/เฟรม. Bresenham ใช้ int บวก/ลบล้วน → เร็วกว่ามากและไม่มี rounding drift" },
        { q: "err เริ่มที่ dx+dy ทำไม?", a: "เป็นการตั้งจุดสมดุลให้การตัดสินขยับแกนสมมาตรกับ 'กลางช่อง pixel' — ทำให้เส้นเริ่มเอียงถูกตั้งแต่ก้าวแรกโดยไม่ลำเอียงไปแกนใดแกนหนึ่ง" },
        { q: "ทำไมต้องมี sx/sy (+1 หรือ −1)?", a: "เพื่อให้วาดได้ทุกทิศ (8 octant) — ไม่ว่าปลายทางจะอยู่ซ้าย/ขวา/บน/ล่าง. abs() + ทิศ sx/sy ทำให้ลูปเดียวครอบทุกกรณี ไม่ต้องเขียนแยก 8 แบบ" },
      ]},

      { h: "🔬 เจาะลึก C: ไล่สีตามเส้น (color lerp) — ทำไมต้องแยก R/G/B ก่อนผสม" },
      { p: "**ภาพในหัว:** ปลายเส้นข้างหนึ่งสีแดง อีกข้างสีน้ำเงิน อยากให้ค่อย ๆ ไล่เฉดกลางเส้น. ทำด้วย **linear interpolation**: ที่สัดส่วน t (0→1) ตามแนวเส้น สี = ผสมแดงกับน้ำเงินตาม t" },
      { p: "**กับดักสำคัญ:** ห้าม lerp เลข `0xRRGGBB` ทั้งก้อนตรง ๆ — เพราะ R/G/B แพ็คอยู่คนละช่องบิต ผสมรวมจะล้นข้ามช่อง. ต้อง **แกะ 3 ช่องออกมา interpolate ทีละช่อง แล้วประกอบกลับ:**" },
      { code: String.raw`int lerp_color(int a, int b, double t)
{
    int ar=(a>>16)&0xFF, ag=(a>>8)&0xFF, ab=a&0xFF;   // แกะปลาย a
    int br=(b>>16)&0xFF, bg=(b>>8)&0xFF, bb=b&0xFF;   // แกะปลาย b
    int r = ar + (br - ar) * t;     // interpolate ทีละช่อง
    int g = ag + (bg - ag) * t;     // สูตร lerp: a + (b-a)·t
    int bl= ab + (bb - ab) * t;
    return ((r<<16) | (g<<8) | bl); // ประกอบกลับ 0xRRGGBB
}`, cap: "t คือสัดส่วนตามแนวเส้น (i/steps จาก Bresenham). สูตร lerp = a + (b−a)·t ต่อช่อง", lang: "c" },
      { p: "**ลองแทนเลข** — จากแดง `0xFF0000` ไปน้ำเงิน `0x0000FF` ที่ t=0.5:" },
      { code: String.raw`R: 255 + (0−255)·0.5 = 127
G: 0   + (0−0)·0.5   = 0
B: 0   + (255−0)·0.5 = 127
→ (127<<16)|(0<<8)|127 = 0x7F007F  (ม่วงกลางทาง ✓)`, cap: "ถ้า lerp ทั้งก้อน 0xFF0000↔0x0000FF จะได้ค่าผิดเพราะ carry ข้ามช่อง — ต้องแยกช่องเท่านั้น", lang: "txt" },
      { note: "ลองพิสูจน์เอง: t=0 ต้องได้สี a เป๊ะ, t=1 ต้องได้สี b เป๊ะ. แทน t=0 ในสูตร a+(b−a)·0 = a ✓ ; t=1 ได้ a+(b−a) = b ✓ — เป็นการเช็คว่าสูตร lerp ถูก" },
      { qa: [
        { q: "ทำไม lerp เลขสีทั้งก้อนตรง ๆ ไม่ได้?", a: "เพราะ R อยู่บิต 16-23, G บิต 8-15, B บิต 0-7. ถ้าบวก/คูณทั้งก้อน การทดเลข (carry) ของช่องล่างจะล้นไปปนช่องบน → สีเพี้ยน. ต้องแยกช่อง mask & 0xFF ก่อน" },
        { q: "t มาจากไหนตอนวาดเส้น?", a: "จากความคืบหน้าตามแนวเส้น = i/steps (i = ก้าวที่เท่าไร, steps = จำนวนก้าวรวม). ต้นเส้น t≈0, ปลายเส้น t≈1" },
        { q: "ทำไม `int r = ar + (br-ar)*t` ปลอดภัยแม้ t เป็น double?", a: "ผลคูณเป็น double แต่กำหนดให้ int → ตัดเศษทิ้ง (truncate) ค่าอยู่ในช่วง 0-255 เสมอเพราะ interpolate ระหว่างสองค่าที่อยู่ในช่วงนั้น ไม่มีทางล้น" },
      ]},

      { h: "🔬 เจาะลึก D: auto-fit (centering + zoom + z_scale) — ทำไมแผนที่ขนาดไหนก็พอดีจอ" },
      { p: "**ภาพในหัว:** แผนที่ 3×3 กับ 100×100 ต้องเต็มจอพอ ๆ กัน. เคล็ดคือ 3 ขั้น: **(1) เลื่อนจุดกึ่งกลางไป origin** (centering) **(2) เลือก zoom ที่พอดี** **(3) บวก offset ไปกลางจอ**" },
      { code: String.raw`ขั้น 1 centering — ลบจุดกึ่งกลางตารางก่อนฉาย:
  xx = x − width/2 ;  yy = y − height/2 ;  zz = z − (z_min+z_max)/2
  → จุดศูนย์กลางแผนที่ไปอยู่ที่ (0,0,0) ของระบบฉาย

ขั้น 2 zoom — เลือกตัวที่ "เล็กกว่า" ของแนวกว้าง/สูง:
  zoom_w = WIN_W·0.8 / projected_width
  zoom_h = WIN_H·0.8 / projected_height
  zoom   = min(zoom_w, zoom_h)        ← การันตีไม่ล้นทั้งสองแกน

ขั้น 3 offset — ดันภาพไปกลางจอ:
  off_x = WIN_W/2 ;  off_y = WIN_H/2`, cap: "centering ก่อน ทำให้ zoom/rotate หมุนรอบจุดกึ่งกลาง ไม่เลื่อนหนีมุมจอ", lang: "txt" },
      { p: "**ทำไม centering ต้องมาก่อน zoom:** การคูณ zoom ขยายจาก origin (0,0). ถ้าไม่เลื่อนกึ่งกลางมา origin ก่อน ภาพจะขยายออกจากมุมซ้ายบน → ยิ่ง zoom ยิ่งหลุดจอ. เลื่อนกึ่งกลางมา origin ก่อน → zoom ขยายรอบกึ่งกลางภาพพอดี" },
      { note: "ลองพิสูจน์เอง: ลองคอมเมนต์บรรทัด `− width/2` ออก แล้วรัน — ภาพจะกองมุมซ้ายบนและพอ zoom จะหลุดจอทันที. นี่คือ 'หลักฐานเชิงประจักษ์' ว่าทำไม centering จำเป็น" },
      { qa: [
        { q: "ทำไม auto-fit เลือก min(zoom_w, zoom_h) ไม่ใช่ max?", a: "เลือกตัวเล็กกว่า = ตัวที่ 'จำกัด' กว่า → การันตีว่าทั้งแนวกว้างและสูงไม่ล้นจอ. ถ้าเลือก max ด้านที่ยาวกว่าจะทะลุจอ" },
        { q: "z_scale ต่างจาก zoom ยังไง?", a: "zoom ขยายทั้งภาพ (x,y), ส่วน z_scale ปรับเฉพาะความสูง z ไม่ให้ภูเขาสูงทะลุจอแม้ zoom พอดีแล้ว — แยกคุมมิติความสูงต่างหาก" },
        { q: "ทำไมต้อง centering z ด้วย (ลบ (z_min+z_max)/2)?", a: "เพื่อให้แกนหมุน/ความสูงสมดุลรอบกลาง — จุดต่ำสุดและสูงสุดกระจายรอบ 0 เท่า ๆ กัน ภาพจึงไม่เอียงไปกองบน/ล่าง" },
      ]},
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Isometric projection — Wikipedia", url: "https://en.wikipedia.org/wiki/Isometric_projection", note: "ที่มาของมุม 30° + การฉายแบบ isometric" },
        { label: "Bresenham's line algorithm — Wikipedia", url: "https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm", note: "อัลกอริทึมวาดเส้นด้วยจำนวนเต็มล้วน เต็ม ๆ" },
        { label: "3D projection — Wikipedia", url: "https://en.wikipedia.org/wiki/3D_projection", note: "ภาพรวมการฉาย 3D → 2D ทุกแบบ" },
        { label: "Linear interpolation — Wikipedia", url: "https://en.wikipedia.org/wiki/Linear_interpolation", note: "พื้นฐาน lerp ที่ใช้ไล่สีตามเส้น" },
      ]},
    ],
    foundations: [
      { p: "หมวดนี้เจาะ **struct, pointer, และ memory** ที่ FdF ใช้เก็บแผนที่และสถานะ" },
      { h: "struct หลัก 4 ตัว" },
      { code: String.raw`typedef struct s_map {        /* ข้อมูลแผนที่ */
    int  width;
    int  height;
    int  **z;                 /* ตาราง 2D ของความสูง */
    int  **color;             /* ตาราง 2D ของสี */
    int  z_min;
    int  z_max;
} t_map;

typedef struct s_cam {        /* กล้อง/มุมมอง */
    double zoom;
    double z_scale;
    int    off_x;             /* เลื่อนภาพไปกลางจอ */
    int    off_y;
} t_cam;

typedef struct s_fdf {        /* รวมทุกอย่าง */
    void  *mlx; void *win; void *img;
    char  *addr;              /* pointer ไปยัง buffer ภาพ */
    int   bpp; int line_len; int endian;
    t_map map;
    t_cam cam;
} t_fdf;`, cap: "t_fdf เป็น 'ก้อนสถานะกลาง' ส่ง pointer ตัวเดียวไปทุกฟังก์ชัน — ไม่ต้องใช้ global", lang: "c" },
      { h: "ทำไม z เป็น int ** (pointer to pointer)" },
      { p: "เพราะแผนที่มีขนาดไม่รู้ล่วงหน้า (ขึ้นกับไฟล์) เราจึงจองแบบ dynamic: `int **z` คือ 'อาเรย์ของ pointer' แต่ละตัวชี้ไปอาเรย์ 1 แถว. เข้าถึงด้วย `z[y][x]` — แถว y, คอลัมน์ x" },
      { code: String.raw`z ──► [ row0 ] ──► [z, z, z, z]   (แถว 0)
      [ row1 ] ──► [z, z, z, z]   (แถว 1)
      [ row2 ] ──► [z, z, z, z]   (แถว 2)`, cap: "จองทีละแถว ทำให้รองรับแผนที่ขนาดใด ๆ ได้", lang: "txt" },
      { h: "ทำไมต้องเก็บ z_min / z_max" },
      { p: "เพื่อ 'auto-fit' — รู้ช่วงความสูงทั้งหมดแล้วปรับ `z_scale` ให้ภูเขาไม่สูงล้นจอ. คำนวณตอน parse (อัปเดต min/max ทุกครั้งที่อ่านค่า)" },
      { h: "image buffer: addr / bpp / line_len" },
      { p: "แทนที่จะวาดทีละ pixel ผ่าน mlx (ช้า) เราขอ 'pointer ตรงไปยังหน่วยความจำของภาพ' (`addr`) แล้วเขียนสีลงไปเอง:" },
      { table: { head: ["ตัวแปร", "ความหมาย"], rows: [
        ["`addr`", "ที่อยู่เริ่มต้นของ buffer ภาพ"],
        ["`bpp`", "bits per pixel (ปกติ 32 = 4 byte ต่อ pixel)"],
        ["`line_len`", "จำนวน byte ต่อ 1 แถวของภาพ"],
      ]}},
      { code: String.raw`dst = addr + (y * line_len + x * (bpp / 8));
*(unsigned int *)dst = color;   /* เขียนสี 1 pixel */`, cap: "คำนวณ offset ของ pixel (x,y) ใน buffer แล้วเขียนตรง — เร็วกว่า mlx_pixel_put หลายเท่า", lang: "c" },
      { note: "ทำไมเร็วกว่า: เขียนลง buffer ในหน่วยความจำทั้งภาพก่อน แล้วค่อย mlx_put_image_to_window ครั้งเดียว — ไม่ต้องคุยกับ X server ทุก pixel" },
    ],
    architecture: [
      { h: "ไฟล์ในโปรเจกต์ (mandatory)" },
      { table: { head: ["ไฟล์", "หน้าที่"], rows: [
        ["`main.c`", "init mlx, ผูก hook, เริ่ม loop"],
        ["`parse.c`", "นับบรรทัด, อ่านไฟล์เป็นอาเรย์ string"],
        ["`token.c`", "แยกค่า z และสี (รวม parse เลขฐาน 16)"],
        ["`grid.c`", "เติมค่าลงตาราง z/color + อัปเดต bounds"],
        ["`project.c`", "ตั้งกล้อง + ฉาย 3D → 2D"],
        ["`draw.c`", "Bresenham line algorithm"],
        ["`pixel.c`", "เขียน pixel, lerp สี, render ทั้งภาพ"],
        ["`hooks.c`", "จัดการปุ่ม ESC + ปิดหน้าต่าง"],
        ["`free.c`", "คืน memory + แจ้ง error"],
      ]}},
      { h: "ลำดับการทำงานใน main()" },
      { code: String.raw`main(argc, argv)
  ├─ เช็ค argc == 2                    (ต้องมีไฟล์แผนที่)
  ├─ ft_bzero(&fdf)                    เคลียร์ struct เป็น 0
  ├─ parse_map(&fdf, argv[1])          อ่านไฟล์ → ตาราง z/color
  ├─ init_mlx(&fdf)                    เปิดหน้าต่าง + สร้าง image
  ├─ setup_camera(&fdf)                คำนวณ zoom/offset อัตโนมัติ
  ├─ render(&fdf)                      วาดภาพครั้งแรก
  ├─ mlx_hook(... key_hook ...)        ผูกปุ่มกด
  ├─ mlx_hook(... close_hook ...)      ผูกปุ่มปิดหน้าต่าง [X]
  └─ mlx_loop(fdf.mlx)                 วนรับ event ไม่จบ`, lang: "txt" },
      { h: "การไหลของข้อมูล (แผนที่ → ภาพ)" },
      { code: String.raw`ไฟล์ .fdf
   │  parse_map / read_lines
   ▼
char **rows  (แต่ละบรรทัดเป็น string)
   │  fill_grid → fill_row → parse_token
   ▼
map.z[y][x], map.color[y][x]  (ตาราง 2D)
   │  render: วนทุกจุด → project()
   ▼
t_pt (พิกัดจอ 2D + สี)
   │  draw_line (Bresenham) → put_pixel
   ▼
image buffer → mlx_put_image_to_window → จอ`, cap: "ไฟล์ข้อความ → ตารางตัวเลข → จุดบนจอ → เส้น → ภาพ", lang: "txt" },
      { note: "render() วาดแค่ 2 เส้นต่อจุด: ไปขวา (x+1) และลง (y+1) — พอครบทุกจุดก็ได้ตาข่ายเต็ม โดยไม่วาดเส้นซ้ำ" },
    ],
    dataflow: [
      { p: "ไล่ฟังก์ชันสำคัญทีละตัว ตามลำดับการทำงาน" },
      { h: "parse_map() — อ่านไฟล์เข้าตาราง" },
      { code: String.raw`int parse_map(t_fdf *f, char *path)
{
    f->map.z_min = INT_MAX;
    f->map.z_max = INT_MIN;
    f->map.height = count_lines(path);     // นับจำนวนแถว
    rows = read_lines(path, f->map.height); // อ่านทุกบรรทัด
    w = get_width(rows[0]);                  // นับคอลัมน์จากแถวแรก
    f->map.width = w;
    fill_grid(f, rows);                      // เติมลงตาราง
    free_rows(rows);
    return (1);
}`, cap: "อ่านไฟล์ 2 รอบ: รอบแรกนับจำนวนแถว (เพื่อจองพอดี), รอบสองอ่านจริง", lang: "c" },
      { h: "parse_token() — แยกค่า z และสี" },
      { code: String.raw`void parse_token(char *tok, int *z, int *color)
{
    *z = ft_atoi(tok);              // เลขความสูง
    *color = DEF_COLOR;            // สีเริ่มต้น = ขาว
    i = 0;
    while (tok[i] && tok[i] != ',') i++;
    if (tok[i] == ',')
        *color = parse_hex(tok + i + 1);  // มีสีระบุ เช่น "5,0xFF0000"
}`, cap: "รูปแบบ token: \"z\" หรือ \"z,0xRRGGBB\" — มี comma แปลว่ามีสีกำกับ", lang: "c" },
      { h: "project() — หัวใจ 3D → 2D" },
      { code: String.raw`t_pt project(t_fdf *f, int x, int y)
{
    xx = x - f->map.width / 2.0;            // ย้ายจุดกลางไป origin
    yy = y - f->map.height / 2.0;
    zz = f->map.z[y][x] - (z_min + z_max)/2.0;
    zz = zz * f->cam.z_scale;               // ปรับความสูงให้พอดีจอ
    p.x = (int)((xx - yy) * COS30 * zoom) + off_x;
    p.y = (int)((xx + yy) * SIN30 * zoom - zz) + off_y;
    p.color = f->map.color[y][x];
    return (p);
}`, cap: "สูตร isometric: (x-y) สำหรับแนวนอน, (x+y) สำหรับแนวตั้ง, ลบ zz เพื่อยกจุดสูงขึ้น (y จอชี้ลง)", lang: "c" },
      { h: "setup_camera() — auto-fit อัตโนมัติ" },
      { p: "คำนวณ zoom จากขนาดแผนที่ให้ภาพเต็มจอ ~80% โดยเทียบทั้งแนวกว้างและสูง เลือกค่าที่เล็กกว่า (กันล้นจอ) แล้วตั้ง offset ไว้กลางจอ. `set_zscale()` ปรับความสูงไม่ให้ภูเขาทะลุจอ" },
      { h: "draw_line() — วาดเส้นพร้อมไล่สี" },
      { code: String.raw`void draw_line(t_fdf *f, t_pt a, t_pt b)
{
    init_bres(&d, a, b);
    while (1)
    {
        t = (steps != 0) ? i/steps : 0;     // (concept) สัดส่วนตามแนวเส้น
        put_pixel(f, a.x, a.y, lerp_color(a.color, b.color, t));
        if (a.x == b.x && a.y == b.y) break;
        bres_step(&d, &a);                   // ขยับ pixel ถัดไป
    }
}`, cap: "ทุก pixel ระหว่างทาง ลงสีที่ผสมระหว่างปลายทั้งสอง (gradient)", lang: "c" },
      { h: "render() — ประกอบทั้งภาพ" },
      { code: String.raw`void render(t_fdf *f)
{
    ft_bzero(f->addr, f->line_len * WIN_H);  // ล้างจอเป็นดำ
    while (y < height) {
        while (x < width) {
            if (x+1 < width)  draw_line(project(x,y), project(x+1,y));
            if (y+1 < height) draw_line(project(x,y), project(x,y+1));
            x++;
        }
        y++;
    }
    mlx_put_image_to_window(f->mlx, f->win, f->img, 0, 0);
}`, cap: "วาดลง buffer ทั้งหมดก่อน แล้วโยนขึ้นจอครั้งเดียว", lang: "c" },
      { h: "key_hook / close_hook" },
      { code: String.raw`int key_hook(int key, t_fdf *f) {
    if (key == ESC_KEY) close_hook(f);   // ESC = ออก
    return (0);
}
int close_hook(t_fdf *f) {
    free_all(f);                          // คืน memory ทั้งหมด
    exit(0);
}`, cap: "ปิดหน้าต่าง [X] (event 17) และ ESC ทั้งคู่เรียก close_hook → ไม่มี leak", lang: "c" },
    ],
    implementation: [
      { h: "ลำดับการลงมือเขียน (แนะนำ)" },
      { ul: [
        "1. parser ก่อน — อ่านไฟล์เป็นตาราง z แล้ว print ออกตรวจว่าถูก (ยังไม่ต้องมี mlx)",
        "2. เปิดหน้าต่าง mlx เปล่า ๆ ให้ขึ้นได้ก่อน + ปิดด้วย ESC/[X]",
        "3. put_pixel + วาดจุดทดสอบ 1 จุดกลางจอ",
        "4. Bresenham — วาดเส้นเดียวให้ได้ก่อน",
        "5. project() แบบ isometric + render ทั้งตาราง",
        "6. auto-fit camera (zoom/offset/z_scale)",
        "7. ไล่สี (lerp) + รองรับสีในไฟล์",
        "8. bonus: ซูม/เลื่อน/หมุน/สลับ projection",
      ]},
      { h: "บั๊กยอดฮิตและวิธีกัน" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้"], rows: [
        ["ภาพไปกองมุมจอ", "ไม่ centering ก่อนฉาย / ไม่บวก offset", "ลบ width/2, height/2 แล้วบวก off_x/off_y"],
        ["ภาพเป็นจุดเดียว / เล็กมาก", "zoom ไม่ได้คำนวณจากขนาดแผนที่", "auto-fit ใน setup_camera"],
        ["ภูเขาทะลุจอ", "z_scale มากเกิน", "clamp z_scale ตามช่วง z_max-z_min"],
        ["เส้นขาดเป็นจุด ๆ", "Bresenham ผิด / ใช้ลูปธรรมดา", "ใช้ error term ของ Bresenham ให้ถูก"],
        ["segfault ตอน parse", "แถวยาวไม่เท่ากัน / ไฟล์ว่าง", "เช็ค width ทุกแถว, เช็ค height>0"],
      ]}},
      { h: "การ build / รัน" },
      { code: String.raw`make                       # mandatory
make bonus                 # ซูม/หมุน/เลื่อน/สลับมุมมอง
./fdf maps/42.fdf
./fdf maps/mars.fdf`, lang: "bash" },
      { note: "บน Windows ต้องรันผ่าน WSL + WSLg (มี DISPLAY) ไม่งั้นหน้าต่าง mlx เปิดไม่ขึ้น — ดู skill build-42-projects-on-windows" },
    ],
    tricks: [
      { h: "ทริค 1: precompute cos30/sin30 เป็น macro" },
      { p: "isometric ใช้มุม 30° ตายตัว จึงฝังค่า cos/sin เป็น `#define` ไว้เลย — ไม่ต้องเรียกฟังก์ชัน math หลายล้านครั้งต่อเฟรม เร็วขึ้นชัดเจน" },
      { h: "ทริค 2: เขียนลง image buffer ตรง ๆ" },
      { p: "แทน `mlx_pixel_put` (คุยกับ X server ทุก pixel = ช้ามาก) เราขอ addr ของ buffer แล้วคำนวณ offset เขียนสีเอง จากนั้น put image ครั้งเดียว — เร็วกว่าหลายสิบเท่า" },
      { h: "ทริค 3: centering ก่อนฉาย" },
      { p: "ลบจุดกึ่งกลางตาราง (`x - width/2`) ก่อนฉาย ทำให้ภาพอยู่กลางจอเสมอ และเวลา zoom/rotate มันหมุนรอบจุดกึ่งกลางสวยงาม ไม่เลื่อนหนี" },
      { h: "ทริค 4: auto-fit เลือก zoom ที่เล็กกว่า" },
      { p: "คำนวณ zoom ที่พอดีแนวกว้าง และ zoom ที่พอดีแนวสูง แล้ว **เลือกตัวที่เล็กกว่า** — การันตีว่าภาพไม่ล้นจอไม่ว่าจะรูปร่างแผนที่แบบไหน" },
      { h: "ทริค 5: lerp สีตามแนวเส้น" },
      { p: "แยก R/G/B ออกเป็น 3 ช่อง interpolate ทีละช่องด้วย t (0..1) แล้วประกอบกลับ — ได้เส้นไล่เฉดสีนุ่ม ๆ ระหว่างจุดสองสี" },
      { h: "ทริค 6: วาดแค่ 2 เส้นต่อจุด" },
      { p: "ไม่ต้องวาด 4 ทิศ — แค่ 'ขวา' กับ 'ลง' ของทุกจุด ก็ได้ตาข่ายเต็มโดยไม่ซ้ำเส้น (เส้นซ้าย/บน คือเส้นขวา/ลงของจุดข้างเคียงอยู่แล้ว) → ประหยัดงานครึ่งหนึ่ง" },
      { h: "ทริค 7 (bonus): สลับ projection ด้วย rotation matrix" },
      { p: "bonus เพิ่มมุมหมุน 3 แกน (ax, ay, az) ทำให้หมุนภาพได้อิสระ และกด `p` วนสลับ isometric / top-down / side ด้วยการตั้งค่ามุมล่วงหน้า" },
    ],
    eval: [
      { qa: [
        { q: "isometric projection คำนวณยังไง?", a: "x_screen = (x-y)·cos30·zoom, y_screen = (x+y)·sin30·zoom - z·scale แล้วบวก offset ไปกลางจอ; เท่ากับหมุนตาราง 45° แล้วบีบแนวตั้ง" },
        { q: "ทำไม y ต้องลบ z (ไม่ใช่บวก)?", a: "เพราะพิกัดจอแกน y ชี้ลง — จุดที่สูง (z มาก) ต้องอยู่สูงขึ้นบนจอ = ค่า y น้อยลง จึงลบ z ออก" },
        { q: "Bresenham ทำงานยังไง ทำไมเลือกใช้?", a: "เก็บค่า error สะสมแล้วตัดสินทีละก้าวว่าขยับ x, y หรือทั้งคู่ ใช้แค่จำนวนเต็ม+บวกลบ ไม่มี float/หาร จึงเร็วและไม่มี gap บนตาราง pixel" },
        { q: "ทำไม map ใช้ int ** ไม่ใช่อาเรย์คงที่?", a: "ขนาดแผนที่ไม่รู้ล่วงหน้า ต้องจอง dynamic ตามไฟล์ — int ** = อาเรย์ของ pointer แต่ละตัวชี้ 1 แถว เข้าถึงด้วย z[y][x]" },
        { q: "auto-fit camera ทำยังไง?", a: "คำนวณ zoom จากขนาดแผนที่เทียบทั้งกว้างและสูง เลือกตัวเล็กกว่าเพื่อไม่ล้นจอ, ตั้ง offset ไว้กลางจอ, clamp z_scale ตามช่วงความสูง" },
        { q: "ทำไมเขียน pixel ลง buffer แทน mlx_pixel_put?", a: "mlx_pixel_put คุยกับ X server ทุก pixel ช้ามาก; เขียนลง image buffer ในหน่วยความจำตรง ๆ แล้ว mlx_put_image_to_window ครั้งเดียว เร็วกว่าหลายสิบเท่า" },
        { q: "lerp_color ทำอะไร?", a: "ไล่สีระหว่างจุดสองปลายของเส้น โดยแยก R/G/B interpolate ทีละช่องด้วย t (0..1) แล้วประกอบกลับ ได้ gradient" },
        { q: "อ่านไฟล์กี่รอบ ทำไม?", a: "2 รอบ — รอบแรกนับจำนวนบรรทัด (เพื่อจองตารางพอดี ไม่ต้อง realloc), รอบสองอ่านค่าจริงลงตาราง" },
        { q: "จัดการ memory/ปิดหน้าต่างยังไง?", a: "close_hook (ผูกกับ event 17 และ ESC) เรียก free_all() คืนทุกอย่าง (z, color, image, window) แล้ว exit(0); ตรวจ leak ด้วย valgrind" },
        { q: "รูปแบบ token ของไฟล์เป็นยังไง?", a: "แต่ละช่องคือ \"z\" หรือ \"z,0xRRGGBB\" คั่นด้วยช่องว่าง; ถ้ามี comma คือมีสีกำกับ ไม่งั้นใช้สีขาว default" },
        { q: "ESC กับปุ่มปิด [X] ต่างกันไหม?", a: "ผูกคนละ event (ESC ผ่าน key_hook event 2, [X] ผ่าน close_hook event 17) แต่สุดท้ายเรียก close_hook เหมือนกัน → คืน memory แล้วออก" },
      ]},
      { h: "ทดสอบ" },
      { code: String.raw`./fdf maps/42.fdf
./fdf maps/mars.fdf
./fdf                       # usage (ไม่มี argument)
./fdf doesnotexist.fdf      # Error (เปิดไฟล์ไม่ได้)
make bonus && ./fdf_bonus maps/mars.fdf   # หมุน/ซูม/เลื่อน`, lang: "bash" },
    ],
  },
},
/* ===================== PHILOSOPHERS ===================== */
{
  id: "philosophers",
  name: "Philosophers",
  tag: { th: "นักปรัชญานั่งกินข้าวรอบโต๊ะ แชร์ส้อมกัน — เรียน thread, mutex, และการกัน deadlock", en: "Philosophers share forks around a table — learn threads, mutexes, and avoiding deadlock" },
  accent: "#ff6b6b",
  sections: {
    principle: [
      { h: "โจทย์คืออะไร (Dining Philosophers)" },
      { p: "นักปรัชญา N คน นั่งรอบโต๊ะกลม ทำวน 3 อย่าง: **กิน → นอน → คิด**. ระหว่างคนแต่ละคนมี **ส้อม 1 อัน** (ส้อมทั้งหมด = N อัน) การจะกินต้องถือส้อม **2 อัน** (ซ้าย+ขวา) พร้อมกัน — แต่ส้อมแชร์กับเพื่อนข้าง ๆ" },
      { code: String.raw`        P1
      🍴  🍴
   P5          P2
    🍴          🍴
      P4 🍴 P3
แต่ละคนต้องหยิบส้อมซ้าย+ขวา ถึงจะกินได้
→ เพื่อนสองข้างก็อยากได้ส้อมเดียวกัน = แย่งกัน`, cap: "ส้อมมีจำกัด คนเยอะกว่า → ต้องจัดคิวให้ทุกคนได้กินโดยไม่มีใครอดตาย", lang: "txt" },
      { h: "เงื่อนไขชนะ/แพ้" },
      { ul: [
        "ถ้านักปรัชญาคนใด **ไม่ได้กินภายใน `time_to_die` ms** นับจากมื้อล่าสุด → **ตาย** → โปรแกรมต้องพิมพ์ `died` แล้วหยุดทันที",
        "ห้ามนักปรัชญาตาย — ต้องจัดจังหวะให้ทุกคนได้กินทันเวลา",
        "ถ้ามี argument ที่ 5 (`must_eat`): พอทุกคนกินครบจำนวนมื้อนั้น → จบเกมอย่างสงบ",
      ]},
      { h: "argument ที่รับ" },
      { code: String.raw`./philo  n_philo  t_die  t_eat  t_sleep  [n_meals]
             │      │      │      │        └ (optional) กินกี่มื้อแล้วจบ
             │      │      │      └ เวลานอน (ms)
             │      │      └ เวลากิน (ms)
             │      └ ตายถ้าไม่กินภายในกี่ ms
             └ จำนวนนักปรัชญา`, lang: "txt" },
      { h: "ทำไมโจทย์นี้โหด" },
      { p: "นี่คือปัญหา **concurrency** คลาสสิก — หลาย thread ทำงานพร้อมกันและแย่ง resource ร่วมกัน. ความท้าทายคือ 3 อย่างพร้อมกัน: (1) **ห้าม deadlock** (ทุกคนถือส้อมเดียวแล้วรอกันวน), (2) **ห้าม data race** (เขียน/อ่านตัวแปรร่วมพร้อมกัน), (3) **ตรงเวลาเป๊ะ** (ตรวจตายแม่นระดับ ms)" },
      { h: "Deadlock คืออะไร — หัวใจของโจทย์" },
      { p: "ถ้าทุกคนหยิบส้อม **ซ้ายพร้อมกัน** ทุกคนจะถือส้อม 1 อันแล้วรอส้อมขวา (ที่เพื่อนถืออยู่) ตลอดกาล → ค้างทั้งวง = **deadlock**. การออกแบบลำดับหยิบส้อมให้ดีคือกุญแจที่ทำให้โจทย์นี้ผ่าน" },
      { note: "วิธีกัน deadlock ในโค้ดนี้: คนเลข **คู่หยิบซ้ายก่อน, คนเลขคี่หยิบขวาก่อน** — ทำลายความสมมาตร ทำให้ไม่มีทางที่ทุกคนถือส้อมเดียวแล้วรอวน" },
    ],
    theory: [
      { p: "หมวดนี้รวมทฤษฎี **multithreading + การซิงค์** ที่ต้องเข้าใจก่อนอ่านโค้ด philosophers" },
      { h: "1) Process vs Thread" },
      { table: { head: ["", "Process", "Thread"], rows: [
        ["หน่วยความจำ", "แยกกันคนละก้อน", "แชร์ก้อนเดียวกัน"],
        ["สื่อสารกัน", "ยาก (ต้อง IPC)", "ง่าย (อ่านตัวแปรเดียวกัน)"],
        ["mandatory ใช้", "—", "✓ pthread (1 thread/คน)"],
        ["bonus ใช้", "✓ fork (1 process/คน)", "—"],
      ]}},
      { p: "mandatory ใช้ **thread**: นักปรัชญาแต่ละคน = 1 thread ทุก thread แชร์ memory เดียวกัน (struct data) ทำให้แชร์สถานะง่าย — แต่ก็ต้องระวัง race condition" },
      { h: "2) Race condition คืออะไร" },
      { p: "**Race condition** = เมื่อ 2 thread อ่าน/เขียนตัวแปรร่วมพร้อมกัน ผลลัพธ์ขึ้นกับ 'ใครชนะการแข่ง' ที่คาดเดาไม่ได้ → bug ที่เกิดบ้างไม่เกิดบ้าง (heisenbug)" },
      { code: String.raw`thread A: meals_eaten++   (อ่าน 5 → +1 → เขียน 6)
thread B: meals_eaten++   (อ่าน 5 → +1 → เขียน 6)
ถ้าทำซ้อนกัน: ควรได้ 7 แต่ได้ 6 → ข้อมูลหาย!`, cap: "การ ++ ไม่ใช่ atomic — มันคือ อ่าน-บวก-เขียน 3 ขั้น ที่ถูกแทรกได้", lang: "txt" },
      { h: "3) Mutex (Mutual Exclusion)" },
      { p: "**Mutex** = กุญแจล็อก ที่การันตีว่า 'ครั้งละ 1 thread เท่านั้น' ที่เข้าถึง resource ได้. thread ต้อง `lock` ก่อนเข้า และ `unlock` เมื่อออก — ถ้ามีคนถือกุญแจอยู่ คนอื่นต้องรอ" },
      { table: { head: ["ฟังก์ชัน", "ทำอะไร"], rows: [
        ["`pthread_mutex_init`", "สร้างกุญแจ"],
        ["`pthread_mutex_lock`", "ขอถือกุญแจ (รอถ้ามีคนถือ)"],
        ["`pthread_mutex_unlock`", "คืนกุญแจ"],
        ["`pthread_mutex_destroy`", "ทำลายกุญแจ (ตอนจบ)"],
      ]}},
      { p: "ใน philosophers: **ส้อมแต่ละอัน = 1 mutex**. การหยิบส้อม = lock mutex, การวางส้อม = unlock. นอกจากนี้ยังมี mutex สำหรับ print, stop flag, และ meal data" },
      { h: "4) Deadlock — เงื่อนไข 4 ข้อ (Coffman)" },
      { p: "deadlock เกิดเมื่อครบทั้ง 4 เงื่อนไขนี้พร้อมกัน — ทำลายข้อใดข้อหนึ่งก็กันได้:" },
      { table: { head: ["เงื่อนไข", "ความหมาย", "เรากันด้วย"], rows: [
        ["Mutual exclusion", "resource ใช้ได้ทีละคน", "(จำเป็น คงไว้)"],
        ["Hold and wait", "ถือของอยู่แล้วรอของเพิ่ม", "—"],
        ["No preemption", "แย่งของจากคนอื่นไม่ได้", "—"],
        ["Circular wait", "รอกันเป็นวงกลม", "✓ คู่/คี่หยิบสลับลำดับ → ตัดวงจร"],
      ]}},
      { h: "5) วัดเวลาแบบ ms: gettimeofday" },
      { p: "ต้องตรวจการตายแม่นระดับ millisecond. ใช้ `gettimeofday` แปลงเป็น ms:" },
      { code: String.raw`long get_time(void) {
    struct timeval tv;
    gettimeofday(&tv, NULL);
    return (tv.tv_sec * 1000L + tv.tv_usec / 1000);
}`, cap: "วินาที×1000 + ไมโครวินาที/1000 = เวลาเป็น ms", lang: "c" },
      { h: "🔬 เจาะลึก A: Deadlock & เงื่อนไข Coffman — พิสูจน์ว่าทำไม 'หยิบสลับลำดับ' กัน deadlock ได้" },
      { p: "**ภาพในหัวก่อนเข้าสูตร:** 5 คนนั่งโต๊ะกลม มีส้อมคั่นระหว่างทุกคน (5 อัน). ถ้า **ทุกคนหยิบส้อมซ้ายพร้อมกัน** → ทุกคนถือส้อมซ้ายไว้ แล้วเอื้อมขวาไปหยิบส้อมที่ 'คนข้าง ๆ ถืออยู่' → ทุกคนค้างรอกันเป็นวงกลม ไม่มีใครยอมวาง = ค้างทั้งโต๊ะตลอดกาล. นั่นคือ deadlock" },
      { p: "**กลไก:** deadlock เกิดได้ก็ต่อเมื่อครบ **4 เงื่อนไข Coffman พร้อมกัน** — ทฤษฎีบทคือ ตัดข้อใดข้อหนึ่งทิ้งก็กัน deadlock ได้ทั้งหมด:" },
      { code: String.raw`เงื่อนไข Coffman (ต้องครบทั้ง 4 ถึงจะ deadlock):
  1. Mutual exclusion : ส้อม 1 อัน ถือได้ทีละคน        (จำเป็น — คงไว้)
  2. Hold and wait    : ถือส้อมซ้ายอยู่ แล้วรอส้อมขวา
  3. No preemption    : แย่งส้อมจากมือคนอื่นไม่ได้
  4. Circular wait    : P0→P1→P2→P3→P4→P0 รอกันเป็นวง  ← เราตัดข้อนี้

วงจรรอ (เมื่อทุกคนหยิบซ้ายก่อนพร้อมกัน):
  P0 ถือ fork0 รอ fork1 (P1 ถือ)
  P1 ถือ fork1 รอ fork2 (P2 ถือ)
  P2 ถือ fork2 รอ fork3 (P3 ถือ)
  P3 ถือ fork3 รอ fork4 (P4 ถือ)
  P4 ถือ fork4 รอ fork0 (P0 ถือ)  → ครบวง = ค้าง`, cap: "ทุกคน 'หยิบทิศเดียวกัน' จึงเกิดวงปิด — หัวใจของ deadlock อยู่ที่ความสมมาตรนี้", lang: "txt" },
      { p: "**ขั้นที่ 1 — formalize ด้วย Resource Allocation Graph (RAG):** วาดกราฟทิศทาง — ลูกศร 'คน → ส้อม' = กำลัง 'รอ' ส้อมนั้น, ลูกศร 'ส้อม → คน' = ส้อมนั้น 'ถูกถือ' โดยคนนั้น. **ทฤษฎีบท (กรณีทรัพยากรชิ้นเดียว):** เมื่อทรัพยากรแต่ละชนิดมีชิ้นเดียว (ส้อม 1 อัน = 1 mutex) ระบบจะ deadlock **ก็ต่อเมื่อ** RAG มี cycle. ดังนั้น 'การกัน deadlock' = 'การทำให้ RAG ไม่มีวันเกิด cycle'" },
      { code: String.raw`RAG ตอนทุกคนหยิบซ้ายเสร็จพร้อมกัน (n=5):

  P0 ──รอ──▶ fork1 ──ถือโดย──▶ P1 ──รอ──▶ fork2 ──ถือ──▶ P2
  ▲                                                          │
  ถือ                                                       รอ
  │                                                          ▼
  fork0 ◀─ถือ─ P4 ◀─รอ─ fork4 ◀─ถือ─ P3 ◀─รอ─ fork3 ◀─ถือ──┘

  ไล่ตามลูกศรกลับมาที่ P0 ได้ = "วงปิด" (cycle) → deadlock`, cap: "ส้อมชิ้นเดียว → cycle ใน RAG คือเงื่อนไข 'จำเป็นและเพียงพอ' ของ deadlock — ปัญหาจึงลดเหลือ 'ห้ามให้เกิด cycle'", lang: "txt" },
      { p: "**ขั้นที่ 2 — บทพิสูจน์: 'จัดอันดับทรัพยากร' (Dijkstra resource ordering) ตัด cycle ได้แน่นอน:** ให้เลขกำกับส้อมทุกอัน 0..n−1 แล้วบังคับกฎเดียว — **ทุกคนต้อง lock ส้อมเลขน้อยกว่าก่อนเสมอ**. พิสูจน์โดยข้อขัดแย้ง: สมมติเกิด cycle ขึ้นจริง. ในวงปิดต้องมีคนอย่างน้อย 1 คนที่ 'ถือส้อมเลข**มาก**อยู่ แล้วกำลังรอส้อมเลข**น้อย**กว่า' (เพราะถ้าทุกคนถือน้อย-รอมากเรียงขึ้นไปเรื่อย ๆ จะวนกลับมาปิดวงไม่ได้ ต้องมีจุดที่เลข 'ลดลง' อย่างน้อยหนึ่งจุด). แต่กฎบอกว่าต้อง lock เลขน้อยก่อนเลขมาก → คนคนนั้นต้องได้ส้อมเลขน้อยไป**ก่อนแล้ว** ถึงจะถือเลขมากได้ จึงเป็นไปไม่ได้ที่จะ 'ถือมากแล้วรอน้อย' → ขัดแย้ง → **ไม่มีทางเกิด cycle** ▮" },
      { p: "**even/odd คือวิธีตัด circular wait ด้วยหลักเดียวกัน (เบากว่า):** มันไม่ใช่ resource-ordering แบบเป๊ะ (ไม่ได้เทียบ min/max ของเลขส้อมทุกครั้ง) แต่ได้ผลปลายทางเดียวกันคือ **ไม่ปล่อยให้ทุกคน lock 'ในทิศหมุนเดียวกัน'**. พอคนคู่หยิบซ้าย (fork i) ก่อน คนคี่หยิบขวา (fork (i+1)%n) ก่อน → ความสมมาตรเชิงหมุนถูกทำลาย → จะมีอย่างน้อย 1 คู่ที่ติดกันชนกันที่ส้อมร่วม คนหนึ่งคว้าได้ทั้งสองก่อน → วงไม่ปิด (และ norm-friendly เพราะไม่ต้องเก็บ/เทียบเลขส้อม)" },
      { code: String.raw`worked example แบบไล่ทีละ tick: n=3 (เลขส้อม = index)
  P0(คู่): lock fork0(ซ้าย) → fork1(ขวา)
  P1(คี่): lock fork2(ขวา) → fork1(ซ้าย)    ← ขอ fork2 ก่อน
  P2(คู่): lock fork2(ซ้าย) → fork0(ขวา)    ← ขอ fork2 ก่อน

  t0: P0 คว้า fork0,fork1 → กิน
      P1 คว้า fork2, รอ fork1 (P0 ถือ)
      P2 รอ fork2 (P1 ถือ)               ← P1,P2 ชนกันที่ fork2: P1 ชนะ
  t1: P0 วาง fork0,fork1
      P1 คว้า fork1 ต่อ → กิน
      P2 ยังรอ fork2
  t2: P1 วาง fork2,fork1
      P2 คว้า fork2 → fork0(ว่าง) → กิน
  → ทุกคนได้กิน ไม่มีจังหวะไหนที่ RAG ปิดเป็นวงเลย ✓`, cap: "ทุก tick มี 'ผู้ชนะ' ที่ได้ส้อมครบเสมอ → ไม่มีสภาพ 'ทุกคนถือ 1 อันแล้วค้าง' → cycle ไม่เคยปิด", lang: "txt" },
      { note: "ลองพิสูจน์เอง: วาด RAG ของ 3 คนตอนทุกคนหยิบซ้ายก่อน — จะเห็น cycle P0→P1→P2→P0 ชัด ๆ. จากนั้นใช้กฎ even/odd แล้ววาด RAG ใหม่ทุก ๆ tick จะหา cycle ไม่เจอเลยไม่ว่าจังหวะไหน — นั่นคือ 'หลักฐานเชิงภาพ' ของบทพิสูจน์ข้างบน" },
      { qa: [
        { q: "ถ้าตัด 'Hold and wait' แทน Circular wait จะกัน deadlock ได้ไหม?", a: "ได้ — เช่นบังคับ 'หยิบส้อมทั้งสองอันแบบ all-or-nothing' (ถ้าได้ไม่ครบให้วางคืนทันที). ตัด Coffman ข้อใดข้อหนึ่งก็พอ; even/odd แค่บังเอิญตัดข้อ Circular wait เพราะ implement ง่ายสุด" },
        { q: "n=1 (คนเดียว) เกิด deadlock ไหม?", a: "ไม่ใช่ deadlock แต่เป็น **starvation by design**: มีส้อมอันเดียว หยิบได้ข้างเดียว → กินไม่ได้ → ต้องตายเมื่อครบ time_to_die. ต้องเขียนเคสนี้แยก (lone_philo) ไม่งั้นจะ lock ส้อมเดิมซ้ำ = ค้างเอง" },
        { q: "ทำไมหยิบส้อมซ้ายพร้อมกันทุกคนถึงอันตรายกว่าหยิบมั่ว ๆ?", a: "เพราะมัน 'สมมาตร' — ทุกคนทำเหมือนกันเป๊ะจึงเกิดวงปิดพร้อมกันได้ง่ายสุด. การทำลายความสมมาตร (คู่/คี่ หยิบคนละทิศ) คือกุญแจกัน deadlock" },
      ]},

      { h: "🔬 เจาะลึก B: Data race & atomicity — ทำไม last_meal ต้องอยู่ใต้ mutex" },
      { p: "**ภาพในหัว:** 2 thread แตะตัวแปรเดียวกัน 'พร้อมกัน' โดยไม่มีใครกั้น = เหมือน 2 คนเขียนกระดานแผ่นเดียวทับกัน — ผลที่ออกมาขึ้นกับจังหวะ CPU ที่คาดเดาไม่ได้" },
      { p: "**กลไก:** ปัญหาอยู่ที่ operation ที่ดู 'บรรทัดเดียว' จริง ๆ แล้วไม่ atomic. `meals_eaten++` คือ 3 ขั้น:" },
      { code: String.raw`philo->meals_eaten++  แตกเป็น 3 ขั้น (read-modify-write):
  1. โหลดค่าเก่าจาก memory → register   (เช่น 4)
  2. +1 ใน register                      (= 5)
  3. เขียนกลับลง memory                   (= 5)

ถ้า monitor แทรกอ่าน last_meal กลางคัน:
  thread เจ้าตัว: กำลังเขียน last_meal = now (ยังเขียนไม่เสร็จ)
  monitor:        อ่าน last_meal ตอนนี้พอดี → ได้ค่าครึ่ง ๆ กลาง ๆ
  → คำนวณ 'ตายหรือยัง' จากค่าขยะ → ตัดสินผิด`, cap: "บั๊กชนิดนี้เกิดบ้างไม่เกิดบ้าง (heisenbug) — รันร้อยรอบผ่าน รอบที่ 101 พัง", lang: "txt" },
      { p: "**ไล่ทีละ tick ให้เห็นข้อมูล 'หายไป' (lost update):** สมมติ 2 thread เพิ่ม meals_eaten ที่ตอนนี้ = 4 พร้อมกันโดยไม่มี lock — CPU สลับ thread ได้ทุกขั้น:" },
      { code: String.raw`เริ่ม meals_eaten = 4 (ใน memory)

  เวลา │ thread A           │ thread B           │ memory
  ─────┼────────────────────┼────────────────────┼────────
   t0  │ R_A = load (4)     │                    │  4
   t1  │                    │ R_B = load (4)     │  4   ← B อ่านก่อน A เขียน
   t2  │ R_A = R_A + 1 (5)  │                    │  4
   t3  │                    │ R_B = R_B + 1 (5)  │  4
   t4  │ store R_A → 5      │                    │  5
   t5  │                    │ store R_B → 5      │  5   ← ทับค่าเดิม!

  → กิน 2 มื้อ แต่ meals_eaten = 5 (ควรเป็น 6) → must_eat เพี้ยน`, cap: "load/compute/store ของ 2 thread 'สอดไส้' กัน — mutex บังคับให้ 3 ขั้นนี้ทำจบก่อนอีก thread จะเริ่ม", lang: "txt" },
      { p: "**ทำไม monitor ตัดสินตายผิดได้ (torn read):** ค่า `long last_meal` 64-bit บนบางสถาปัตย์ถูกเขียนเป็น 2 ครึ่ง (hi/lo word). ถ้า monitor อ่านคาบเกี่ยวจังหวะเขียนพอดี:" },
      { code: String.raw`เจ้าตัว: last_meal เก่า = 1000, กำลังเขียนค่าใหม่ = 5000
  store lo-word ก่อน ... (ค่ากลายเป็นเลขผสมชั่วขณะ เช่น 4096)
       ▲ monitor อ่านตรงนี้พอดี → ได้ 4096 (ครึ่งเก่าครึ่งใหม่)

  now = 5200, time_to_die = 1000
  since = now - last_meal = 5200 - 4096 = 1104  > 1000
  → monitor ประกาศ "died" ทั้งที่เพิ่งกินเสร็จ! (false positive)`, cap: "อ่านค่า 64-bit คาบจังหวะเขียน = ได้เลขขยะ → ตัดสินตายผิด นี่คือเหตุผลที่ 'ทั้งฝั่งอ่านและเขียน' ต้องอยู่ใต้ meal_lock ดอกเดียวกัน", lang: "txt" },
      { p: "**ทางแก้:** ครอบทุกการอ่าน/เขียน shared data ด้วย mutex 'ตัวเดียวกัน' เพื่อบังคับให้ 3 ขั้นนั้นแบ่งแยกไม่ได้ (atomic) ในสายตา thread อื่น:" },
      { code: String.raw`// เขียน (เจ้าตัว ตอนเริ่มกิน)
pthread_mutex_lock(&philo->meal_lock);
philo->last_meal = get_time();
philo->meals_eaten++;
pthread_mutex_unlock(&philo->meal_lock);

// อ่าน (monitor)
pthread_mutex_lock(&philo->meal_lock);
long since = get_time() - philo->last_meal;
pthread_mutex_unlock(&philo->meal_lock);
// แล้วค่อยตัดสินใจ 'นอก' ล็อก จากค่าที่ copy ออกมาแล้ว`, cap: "กฎเหล็ก: อ่านและเขียน shared ตัวเดียวกัน ต้องใช้ mutex ดอกเดียวกันเสมอ ไม่งั้นยังชนได้", lang: "c" },
      { note: "ลองรันเอง: คอมไพล์ด้วย `-fsanitize=thread` หรือรัน `valgrind --tool=helgrind ./philo 4 410 200 200` — ถ้ามี data race มันจะชี้บรรทัดที่อ่าน/เขียนชนกันให้เลย" },
      { qa: [
        { q: "ทำไมแค่ 'อ่าน' อย่างเดียว (monitor ไม่ได้เขียน) ก็ยังต้องล็อก?", a: "เพราะ 'อ่านขณะอีก thread กำลังเขียน' ก็เป็น data race — อาจได้ค่าที่เขียนเสร็จครึ่งเดียว (โดยเฉพาะตัวแปร 64-bit บนเครื่องบางแบบ). ต้องล็อกทั้งฝั่งอ่านและเขียน" },
        { q: "ใช้ mutex คนละดอกฝั่งอ่าน/เขียน ป้องกัน race ได้ไหม?", a: "ไม่ได้ — mutex กันได้เฉพาะคนที่แย่งกุญแจ 'ดอกเดียวกัน'. ถ้าอ่านใช้ดอก A เขียนใช้ดอก B ทั้งคู่เข้าได้พร้อมกัน = ยัง race อยู่ ต้องดอกเดียวกัน" },
        { q: "print ('philo x is eating') ทำไมต้องมี print_lock?", a: "ถ้าหลาย thread เรียก write พร้อมกัน ตัวอักษรอาจสลับกันกลางบรรทัด. print_lock บังคับให้พิมพ์ทีละบรรทัดจบ ๆ ไป (และต้องเช็ค stop ใต้ล็อกเดียวกันเพื่อไม่ให้พิมพ์หลังประกาศ died)" },
      ]},

      { h: "🔬 เจาะลึก C: Mutex vs Semaphore — ทำไม mandatory ใช้ thread+mutex แต่ bonus ใช้ process+semaphore" },
      { p: "**ภาพในหัว:** mutex = กุญแจห้องน้ำ 1 ดอก (เข้าได้ทีละคน คนที่ล็อกต้องเป็นคนปลดเอง). semaphore = ตัวนับที่นั่งในร้าน (มี k ที่นั่ง ใครเข้าก็ลดเคาน์เตอร์ 1 เต็มแล้วรอ — ใครปล่อยก็ได้)" },
      { table: { head: ["", "Mutex", "Semaphore"], rows: [
        ["ค่าที่ถือ", "binary (ล็อก/ปลด)", "ตัวนับ (0..k)"],
        ["เจ้าของ (ownership)", "มี — ใครล็อกต้องปลดเอง", "ไม่มี — ใครก็ post/wait ได้"],
        ["ใช้ข้ามได้แค่", "ภายใน process เดียว (memory แชร์)", "ข้าม process ได้ (named: sem_open)"],
        ["philosophers ใช้ตอน", "mandatory (1 thread/คน, 1 mutex/ส้อม)", "bonus (1 process/คน, semaphore นับส้อม)"],
      ]}},
      { p: "**ทำไม bonus ต้องเปลี่ยนเป็น semaphore:** bonus ใช้ `fork()` แยกเป็นคนละ process → **memory ไม่แชร์กัน** → mutex (ที่อยู่ใน memory ร่วม) ใช้ข้าม process ไม่ได้. semaphore แบบ named (`sem_open`) อยู่ในระบบ OS ทุก process เปิดด้วยชื่อเดียวกันแล้วใช้ร่วมได้" },
      { code: String.raw`bonus: ส้อม = semaphore ตัวเดียว ตัวนับ = จำนวนส้อมว่าง
  sem_t *forks = sem_open("/forks", O_CREAT, 0644, num_philo);

  หยิบส้อม:  sem_wait(forks)   // ลดตัวนับ 1 (ถ้าเป็น 0 → รอ)
             sem_wait(forks)   // หยิบ 2 อัน = wait 2 ครั้ง
  วางส้อม:   sem_post(forks)   // เพิ่มตัวนับ 1
             sem_post(forks)`, cap: "semaphore นับ 'จำนวนส้อมว่างรวม' — ไม่สนว่าใครถืออันไหน ต่างจาก mutex ที่ผูกส้อมเป็นรายอัน", lang: "c" },
      { p: "**พิสูจน์ว่าทำไม 'จำกัดให้ลงมือได้ทีละ n−1 คน' กัน deadlock ได้:** deadlock (circular wait เต็มวง) เกิดได้ก็ต่อเมื่อ **ครบทั้ง n คนถือส้อมคนละอันพร้อมกัน** (วงปิดเต็มวง ตามเจาะลึก A). ถ้าใช้ semaphore ตัวที่สองเป็น 'จำนวนที่นั่ง' = n−1 เพื่อจำกัดให้มีคนลงมือหยิบส้อมได้สูงสุด n−1 คนในเวลาเดียวกัน → เป็นไปไม่ได้ที่ทั้ง n คนจะถือส้อมพร้อมกัน → วงปิดไม่มีวันครบ → ไม่ deadlock ▮" },
      { code: String.raw`bonus กัน deadlock ด้วย 'ที่นั่ง' n-1 ตัว:
  sem_t *seats = sem_open("/seats", O_CREAT, 0644, num_philo - 1);

  ก่อนหยิบส้อม:  sem_wait(seats)     // ขอที่นั่ง (ถ้าเต็มต้องรอ)
    sem_wait(forks); sem_wait(forks)   // หยิบ 2 ส้อม
    ...กิน...
    sem_post(forks); sem_post(forks)   // วางส้อม
  sem_post(seats)                     // ลุกจากที่นั่ง

  → มากสุด n-1 คนลงมือพร้อมกัน → เป็นไปไม่ได้ที่ครบ n คนถือส้อมพร้อมกัน`, cap: "จำกัด 'ผู้เข้าแข่ง' ให้น้อยกว่าจำนวนคนทั้งหมด = ตัดเงื่อนไขวงปิดเต็มวงทิ้งไปเลย", lang: "c" },
      { p: "**กับดักจากการ 'ไม่มี ownership' ของ semaphore:** mutex ผูกกับเจ้าของ (ใคร lock ต้อง unlock) แต่ semaphore ใครก็ post ได้ — ถ้าเผลอ `sem_post` เกินจำนวน `sem_wait` ตัวนับจะ 'พอง' เกินจริง → 2 process หยิบส้อมอันเดียวกันพร้อมกันได้ = ข้อมูลพังโดยไม่มี error ฟ้อง. ต้องจับคู่ wait/post ให้เป๊ะเสมอ" },
      { note: "กับดัก bonus: semaphore นับรวมไม่รู้ 'ตำแหน่ง' ส้อม → กัน deadlock ด้วยการจำกัดให้หยิบได้ทีละ num_philo−1 คน. และต้อง sem_close + sem_unlink ตอนจบ ไม่งั้น semaphore ค้างใน /dev/shm" },
      { qa: [
        { q: "ทำไม mutex ใช้ข้าม process (bonus) ไม่ได้?", a: "mutex ปกติเก็บสถานะไว้ใน memory ของ process. พอ fork แยก process แต่ละตัวมี memory คนละก้อน → ต่างคนต่างเห็น mutex ของตัวเอง ไม่ใช่ตัวเดียวกัน. ต้องใช้ named semaphore ที่ OS เป็นเจ้าของกลาง" },
        { q: "semaphore เริ่มต้นที่ num_philo หมายความว่าอะไร?", a: "แปลว่ามีส้อมว่าง num_philo อันให้หยิบ. ทุกครั้งที่ sem_wait ตัวนับลด 1; เป็น 0 เมื่อไรคนถัดไปต้องรอจนมีคน sem_post (วางส้อม) คืน" },
        { q: "mutex กับ binary semaphore (k=1) ต่างกันยังไง?", a: "หน้าตาคล้ายแต่ต่างที่ 'เจ้าของ': mutex ต้องให้ thread ที่ล็อกเป็นคนปลด (มี ownership) ส่วน binary semaphore ใครก็ post ได้ → ใช้ส่งสัญญาณข้าม thread/process ได้ แต่พลาดง่ายถ้า post เกิน" },
      ]},

      { h: "🔬 เจาะลึก D: ทำไม usleep ธรรมดาไม่แม่นพอ" },
      { p: "`usleep(n)` การันตีแค่ 'อย่างน้อย n' แต่ OS อาจปลุกช้ากว่านั้น — ถ้านอนยาวทีเดียวอาจเลยเวลาตายไปแล้วค่อยตื่น. โค้ดนี้จึงทำ **precise_sleep**: นอนทีละ 200µs สั้น ๆ แล้ววน เช็คเวลาจริงและ stop flag ทุกครั้ง → ตื่นตรงเวลาและหยุดได้ทันทีเมื่อมีคนตาย" },
      { code: String.raw`void precise_sleep(long ms, t_data *data) {
    long start = get_time();
    while (get_time() - start < ms) {
        if (is_stopped(data)) break;   // มีคนตายแล้ว หยุดเลย
        usleep(200);                    // นอนสั้น ๆ แล้วเช็คใหม่
    }
}`, cap: "busy-wait แบบฉลาด: แม่นกว่า usleep ก้อนเดียว และตอบสนอง stop ได้ไว", lang: "c" },
      { p: "**ทำไม usleep ก้อนใหญ่ overshoot:** OS scheduler ปลุก thread ตาม 'tick' ของระบบ (ปกติ ~1–10 ms) บวกกับ load ตอนนั้น — `usleep(200000)` (200 ms) อาจตื่นจริงที่ ~207 ms. ถ้า time_to_die เหลือ 203 ms = ตายทั้งที่ไม่ควร. การหั่นนอนทีละ 200µs ทำให้ error สะสมไม่เกิน ~1 slice (≈0.2 ms) แทนที่จะหลุดเป็นหลาย ms" },
      { p: "**ความหน่วงของการตรวจตาย (detection latency):** monitor วนเช็คทุก ~500µs ดังนั้น worst case มันรู้ว่ามีคนตายช้าได้ถึง ~500µs หลังเส้นตายจริง. ต้องตั้ง slice ให้ **เล็กพอเทียบกับ time_to_die** เพื่อให้พิมพ์ `died` ภายในความคลาดเคลื่อนที่ยอมรับ (42 มักยอม ~10 ms)" },
      { code: String.raw`สมดุลของ slice size (ทั้ง precise_sleep และ monitor):
  slice ใหญ่ (เช่น 5 ms)  → CPU เบา แต่ตรวจตายช้า (อาจหลุด > เกณฑ์)
  slice เล็ก (เช่น 50 µs) → ตรวจไว แต่กิน CPU สูง (เกือบ busy-loop)
  ~200µs–500µs           → จุดสมดุล: ตรวจตายทันเกณฑ์ 42 โดยไม่ burn CPU

กฎคร่าว ๆ: slice ควร << เวลาที่สั้นที่สุดในโจทย์ (มัก = time_to_die)`, cap: "slice size = trade-off ระหว่างความแม่นของเวลา (ยิ่งเล็กยิ่งแม่น) กับการใช้ CPU (ยิ่งเล็กยิ่งเปลือง)", lang: "txt" },
      { note: "ลองวัดเอง: ใส่ `gettimeofday` คร่อม precise_sleep(200) แล้วพิมพ์เวลาจริงที่ใช้ — เทียบ usleep(200000) ก้อนเดียว vs หั่นทีละ 200µs จะเห็นว่าก้อนเดียวแกว่งกว่าและ overshoot ง่ายกว่าเมื่อระบบมี load" },
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Dining philosophers problem — Wikipedia", url: "https://en.wikipedia.org/wiki/Dining_philosophers_problem", note: "โจทย์ต้นฉบับ + วิธีแก้หลายแบบ" },
        { label: "Deadlock — Wikipedia", url: "https://en.wikipedia.org/wiki/Deadlock", note: "เงื่อนไข Coffman 4 ข้อ + การกัน deadlock" },
        { label: "man7 — pthreads(7)", url: "https://man7.org/linux/man-pages/man7/pthreads.7.html", note: "ภาพรวม POSIX threads" },
        { label: "man7 — pthread_mutex_lock(3p)", url: "https://man7.org/linux/man-pages/man3/pthread_mutex_lock.3p.html", note: "เอกสารทางการของ mutex lock / unlock" },
      ]},
    ],
    foundations: [
      { p: "หมวดนี้เจาะ **struct, การแชร์ memory, และ mutex** ที่ philosophers ใช้" },
      { h: "struct 2 ตัวหลัก" },
      { code: String.raw`typedef struct s_philo {
    int             id;
    pthread_t       thread;        /* thread ของคนนี้ */
    long            meals_eaten;
    long            last_meal;     /* เวลากินมื้อล่าสุด (ms) */
    pthread_mutex_t *left_fork;    /* ชี้ไปส้อมซ้าย */
    pthread_mutex_t *right_fork;   /* ชี้ไปส้อมขวา */
    pthread_mutex_t meal_lock;     /* กันแก้ last_meal/meals_eaten พร้อมกัน */
    t_data          *data;         /* ชี้กลับไปข้อมูลกลาง */
} t_philo;

typedef struct s_data {
    int             num_philo;
    long            time_to_die, time_to_eat, time_to_sleep, must_eat;
    int             stop;          /* ธงบอกว่าจบเกมหรือยัง */
    long            start_time;
    pthread_mutex_t *forks;        /* อาเรย์ของ mutex (ส้อม) */
    pthread_mutex_t print_lock;    /* กัน print ทับกัน */
    pthread_mutex_t stop_lock;     /* กันอ่าน/เขียน stop พร้อมกัน */
    t_philo         *philos;
} t_data;`, cap: "data = สถานะกลางที่ทุก thread แชร์; philo = สถานะเฉพาะตัวของแต่ละคน", lang: "c" },
      { h: "ส้อม = อาเรย์ของ mutex ที่แชร์ระหว่างเพื่อนบ้าน" },
      { code: String.raw`philos[i].left_fork  = &forks[i];
philos[i].right_fork = &forks[(i + 1) % num_philo];`, cap: "ส้อมซ้ายของคน i = forks[i]; ส้อมขวา = forks[i+1] วนกลับด้วย %num → โต๊ะกลม", lang: "c" },
      { p: "สังเกต: ส้อมขวาของคนที่ i **คือส้อมเดียวกับ** ส้อมซ้ายของคนที่ i+1 — นี่คือการ 'แชร์' ที่ทำให้ต้องใช้ mutex กันแย่ง" },
      { h: "mutex 4 ประเภทในโค้ดนี้" },
      { table: { head: ["mutex", "ป้องกันอะไร"], rows: [
        ["`forks[i]`", "ส้อมแต่ละอัน — ครั้งละ 1 คนถือ"],
        ["`meal_lock` (ต่อคน)", "last_meal & meals_eaten ของคนนั้น"],
        ["`print_lock`", "บรรทัด log ไม่พิมพ์ทับกัน"],
        ["`stop_lock`", "ธง stop ที่หลาย thread อ่าน/เขียน"],
      ]}},
      { note: "ทำไมต้อง meal_lock แยกต่อคน: monitor (อีก thread) อ่าน last_meal ขณะที่เจ้าตัวกำลังเขียน → ต้องล็อกกันชนกัน ไม่งั้น race" },
      { h: "ทำไม stop เป็น int + mutex ไม่ใช่ตัวแปรธรรมดา" },
      { p: "ธง `stop` ถูกอ่านโดยทุก thread (ในลูป) และเขียนโดย monitor — เป็น shared data ที่ race ได้ จึงต้องอ่าน/เขียนผ่าน `stop_lock` เสมอ (ฟังก์ชัน `is_stopped` และ `set_stop`)" },
    ],
    architecture: [
      { h: "ไฟล์ในโปรเจกต์ (mandatory)" },
      { table: { head: ["ไฟล์", "หน้าที่"], rows: [
        ["`main.c`", "parse → init → สร้าง thread → monitor → join → cleanup"],
        ["`parse.c`", "อ่าน argument + ตรวจความถูกต้อง"],
        ["`init.c`", "จอง+init mutex ทั้งหมด, ตั้งค่า philo"],
        ["`routine.c`", "สิ่งที่แต่ละ thread ทำ (กิน/นอน/คิด)"],
        ["`monitor.c`", "thread หลักคอยตรวจว่าใครตาย/กินครบ"],
        ["`utils.c`", "get_time, precise_sleep, print แบบ thread-safe"],
      ]}},
      { h: "โครงการทำงาน 2 ฝั่ง" },
      { code: String.raw`main thread
  ├─ สร้าง N thread (แต่ละคนรัน routine)
  ├─ monitor(data)  ← วนตรวจไม่หยุด:
  │     • ใครไม่กินเกิน time_to_die? → พิมพ์ died, set_stop
  │     • ทุกคนกินครบ must_eat? → set_stop
  └─ join ทุก thread → cleanup mutex

แต่ละ philosopher thread (routine):
  while (!stopped) {
     หยิบส้อม → กิน → อัปเดต last_meal
     นอน → คิด
  }`, cap: "monitor เป็นกรรมการ, philosopher เป็นผู้เล่น — สื่อสารผ่านธง stop", lang: "txt" },
      { h: "ลำดับใน main()" },
      { code: String.raw`if (argc != 5 && argc != 6) → usage
parse_args()                  // ตรวจ input
if (must_eat == 0) return 0   // กิน 0 มื้อ = ไม่ต้องทำอะไร
init_data()                   // จอง+init mutex
start_threads()               // สร้าง thread + ตั้ง last_meal=start
monitor()                     // main thread ทำหน้าที่ตรวจ
join_threads()                // รอทุกคนจบ
cleanup()                     // destroy mutex + free`, lang: "txt" },
      { note: "เคสพิเศษ: คนเดียว (num_philo==1) มีส้อมแค่อันเดียว หยิบได้ข้างเดียว → กินไม่ได้ → ต้องตาย. โค้ดแยก lone_philo() จัดการเคสนี้ (หยิบส้อมเดียวแล้วรอจนตาย)" },
    ],
    dataflow: [
      { p: "ไล่ฟังก์ชันสำคัญทีละตัว" },
      { h: "routine() — ชีวิตของนักปรัชญา 1 คน" },
      { code: String.raw`void *routine(void *arg)
{
    t_philo *philo = (t_philo *)arg;
    if (philo->data->num_philo == 1)
        return (lone_philo(philo));          // เคสคนเดียว
    if (philo->id % 2 == 0)
        precise_sleep(time_to_eat / 2, ...);  // คนคู่หน่วงเริ่ม
    while (!is_stopped(philo->data))
    {
        do_eat(philo);                        // หยิบส้อม + กิน
        if (is_stopped(philo->data)) break;
        print_status(philo, "is sleeping");
        precise_sleep(time_to_sleep, ...);
        print_status(philo, "is thinking");
    }
    return (NULL);
}`, cap: "วนกิน-นอน-คิด จนกว่าจะมีคนตาย/กินครบ (stop)", lang: "c" },
      { p: "**ทำไมคนคู่หน่วงตอนเริ่ม:** ถ้าทุกคนพุ่งหยิบส้อมพร้อมกันจะแย่งกันชุลมุน. ให้คนเลขคู่รอครึ่งหนึ่งของ time_to_eat ก่อน → คนคี่ได้กินก่อน แล้วคนคู่ค่อยกิน → จังหวะ 'สลับฟันปลา' ลื่นไหล ลดการแย่ง" },
      { h: "take_forks() — หยิบส้อมแบบกัน deadlock" },
      { code: String.raw`static void take_forks(t_philo *philo)
{
    if (philo->id % 2 == 0) {              // คนเลขคู่: ซ้ายก่อน
        lock(left_fork);  print "has taken a fork";
        lock(right_fork); print "has taken a fork";
    } else {                                // คนเลขคี่: ขวาก่อน
        lock(right_fork); print "has taken a fork";
        lock(left_fork);  print "has taken a fork";
    }
}`, cap: "ลำดับหยิบต่างกันตามคู่/คี่ → ทำลาย circular wait → ไม่มี deadlock", lang: "c" },
      { h: "do_eat() — กินพร้อมอัปเดตเวลาอย่างปลอดภัย" },
      { code: String.raw`static void do_eat(t_philo *philo)
{
    take_forks(philo);
    lock(meal_lock);
      philo->last_meal = get_time();   // รีเซ็ตนาฬิกาตาย
    unlock(meal_lock);
    print_status(philo, "is eating");
    precise_sleep(time_to_eat, data);
    lock(meal_lock);
      philo->meals_eaten++;
    unlock(meal_lock);
    unlock(left_fork);
    unlock(right_fork);                  // วางส้อมทั้งคู่
}`, cap: "อัปเดต last_meal/meals_eaten ใต้ meal_lock เสมอ เพราะ monitor อ่านพร้อมกัน", lang: "c" },
      { h: "monitor() — กรรมการตรวจการตาย" },
      { code: String.raw`void monitor(t_data *data)
{
    while (!is_stopped(data)) {
        for แต่ละคน:
            if (someone_died(&philos[i])) return;  // เกิน t_die → died
        if (all_ate(data)) return;                 // ทุกคนกินครบ
        usleep(500);                                // เช็คถี่ ๆ
    }
}`, lang: "c" },
      { code: String.raw`static int someone_died(t_philo *philo)
{
    lock(meal_lock);
      since = get_time() - philo->last_meal;
    unlock(meal_lock);
    if (since > time_to_die) {
        lock(print_lock);
          set_stop(data);                  // หยุดก่อน
          put_msg(data, id, "died");        // แล้วค่อยพิมพ์
        unlock(print_lock);
        return (1);
    }
    return (0);
}`, cap: "set_stop ก่อนพิมพ์ died ใต้ print_lock → ไม่มี thread อื่นแทรกพิมพ์หลังคนตาย", lang: "c" },
      { h: "print_status() — log แบบ thread-safe" },
      { code: String.raw`void print_status(t_philo *philo, char *msg)
{
    lock(print_lock);
      if (!is_stopped(philo->data))     // ห้ามพิมพ์อะไรหลังเกมจบ
          put_msg(data, id, msg);
    unlock(print_lock);
}`, cap: "เช็ค stop ใต้ print_lock กันพิมพ์สถานะหลังมีคนตายไปแล้ว", lang: "c" },
      { h: "is_stopped / set_stop — เข้าถึงธงอย่างปลอดภัย" },
      { code: String.raw`int is_stopped(t_data *data) {
    lock(stop_lock); int s = data->stop; unlock(stop_lock);
    return (s);
}
void set_stop(t_data *data) {
    lock(stop_lock); data->stop = 1; unlock(stop_lock);
}`, cap: "ทุกการแตะ stop ผ่าน mutex → ไม่มี data race บนธงนี้", lang: "c" },
    ],
    implementation: [
      { h: "ลำดับการลงมือเขียน (แนะนำ)" },
      { ul: [
        "1. parse + ตรวจ argument (ตัวเลขบวก, จำนวน arg ถูก)",
        "2. get_time + precise_sleep ให้แม่นก่อน — เป็นรากฐานทั้งหมด",
        "3. init mutex ทั้งหมด + ตั้งค่า philo (ส้อมซ้าย/ขวา)",
        "4. routine แบบยังไม่กัน deadlock + print_status thread-safe",
        "5. monitor ตรวจการตาย",
        "6. กัน deadlock (คู่/คี่ + หน่วงเริ่ม) + เคสคนเดียว",
        "7. must_eat (จบเมื่อทุกคนกินครบ) + cleanup ไม่ให้ leak",
        "8. ตรวจด้วย valgrind --tool=helgrind (หา data race)",
      ]},
      { h: "บั๊กยอดฮิตและวิธีกัน" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้"], rows: [
        ["ค้าง/ไม่ขยับเลย", "deadlock — ทุกคนถือส้อมเดียวรอวน", "คู่/คี่หยิบสลับลำดับ"],
        ["ตายทั้งที่ไม่ควร", "นาฬิกาเริ่มผิด / last_meal ไม่ตั้งตอนเริ่ม", "ตั้ง last_meal = start_time ก่อนสร้าง thread"],
        ["died พิมพ์ช้า/ซ้อนบรรทัดอื่น", "ไม่ set_stop ก่อนพิมพ์ / ไม่มี print_lock", "set_stop ก่อน แล้วพิมพ์ใต้ print_lock"],
        ["helgrind ฟ้อง race", "อ่าน/เขียน shared โดยไม่ล็อก", "ทุก last_meal/meals_eaten/stop ต้องใต้ mutex"],
        ["คนเดียวไม่ตาย/ค้าง", "ไม่แยกเคส num==1", "lone_philo หยิบส้อมเดียวแล้วรอจนตาย"],
      ]}},
      { h: "build / รัน" },
      { code: String.raw`make
./philo 5 800 200 200       # 5 คน ไม่มีใครควรตาย
./philo 4 410 200 200       # ก้ำกึ่ง — เทสจังหวะ
./philo 1 800 200 200       # คนเดียว → ตาย (ส้อมไม่พอ)
./philo 5 800 200 200 7     # ทุกคนกิน 7 มื้อแล้วจบ`, lang: "bash" },
    ],
    tricks: [
      { h: "ทริค 1: คู่/คี่หยิบส้อมสลับลำดับ — กัน deadlock" },
      { p: "หัวใจของโปรเจกต์. ถ้าทุกคนหยิบซ้ายก่อนเหมือนกัน = deadlock แน่. ให้คนเลขคู่หยิบซ้ายก่อน คนคี่หยิบขวาก่อน → ทำลายความสมมาตร = ตัด circular wait หนึ่งในเงื่อนไข deadlock" },
      { h: "ทริค 2: หน่วงคนเลขคู่ตอนเริ่ม" },
      { p: "ให้คนคู่ `precise_sleep(time_to_eat/2)` ก่อนเริ่ม → กระจายการแย่งส้อมเป็นจังหวะสลับฟันปลา ทำให้ throughput ดีและไม่มีใครอดนาน" },
      { h: "ทริค 3: precise_sleep แทน usleep ก้อนเดียว" },
      { p: "นอนทีละ 200µs แล้ววนเช็คเวลาจริง — แม่นกว่า usleep ยาว ๆ (ที่ OS อาจปลุกช้า) และยังเช็ค stop flag ได้ทุกรอบ → หยุดทันทีเมื่อมีคนตาย ไม่ค้างนอนต่อ" },
      { h: "ทริค 4: mutex ต่อคนสำหรับ meal data" },
      { p: "แยก `meal_lock` ของแต่ละคน (ไม่ใช้ตัวเดียวรวม) → monitor ตรวจคนหนึ่งไม่บล็อกการกินของอีกคน = ลดการแย่ง lock และ log ตรงเวลากว่า" },
      { h: "ทริค 5: set_stop ก่อนพิมพ์ died ใต้ print_lock" },
      { p: "ตั้งธง stop ก่อน แล้วค่อยพิมพ์ `died` โดยถือ print_lock ตลอด → การันตีว่า `died` เป็นบรรทัดสุดท้าย ไม่มี thread อื่นแทรกพิมพ์ 'is eating' หลังจากมีคนตายแล้ว" },
      { h: "ทริค 6: เขียน log ด้วย write ครั้งเดียว" },
      { p: "ประกอบข้อความทั้งบรรทัด (เวลา + id + msg + \\n) ลง buffer แล้ว `write` ครั้งเดียว — ลดโอกาสที่ output แตกกลางบรรทัด (เร็วและ atomic กว่าหลาย printf)" },
    ],
    eval: [
      { qa: [
        { q: "ทำไมใช้ thread ไม่ใช่ process (mandatory)?", a: "นักปรัชญาแชร์ส้อม (resource ร่วม) — thread แชร์ memory เดียวกันทำให้แชร์สถานะง่าย; mandatory บังคับ pthread, bonus ใช้ process+semaphore" },
        { q: "mutex คืออะไร ใช้ทำอะไรในโจทย์นี้?", a: "กุญแจที่ให้เข้าถึง resource ได้ครั้งละ 1 thread; ส้อมแต่ละอัน = 1 mutex, หยิบ=lock วาง=unlock, ยังใช้กัน race บน print/stop/meal data" },
        { q: "deadlock เกิดยังไง กันยังไง?", a: "ถ้าทุกคนหยิบส้อมซ้ายพร้อมกันจะถือ 1 อันแล้วรอขวาที่เพื่อนถือ ค้างวน; กันด้วยให้คนคู่หยิบซ้ายก่อน คนคี่หยิบขวาก่อน = ตัด circular wait" },
        { q: "race condition คืออะไร เจอที่ไหนในโค้ด?", a: "หลาย thread อ่าน/เขียนตัวแปรร่วมพร้อมกันได้ผลคาดเดาไม่ได้; เจอที่ last_meal, meals_eaten, stop — แก้ด้วยล็อก mutex ทุกครั้งที่แตะ" },
        { q: "ตรวจการตายยังไงให้แม่น?", a: "monitor (thread แยก) วนเช็ค get_time()-last_meal > time_to_die ทุก ~500µs; อ่าน last_meal ใต้ meal_lock กัน race" },
        { q: "ทำไมต้อง precise_sleep ไม่ใช้ usleep ตรง ๆ?", a: "usleep ก้อนใหญ่ OS อาจปลุกช้าทำให้เลยเวลาตาย; precise_sleep นอนทีละ 200µs วนเช็คเวลาจริง+stop flag → แม่นและหยุดได้ทันที" },
        { q: "เคสคนเดียวจัดการยังไง?", a: "มีส้อมแค่อันเดียว หยิบได้ข้างเดียว กินไม่ได้ → lone_philo หยิบส้อมแล้วรอจน time_to_die → ตาย (ถูกต้องตามโจทย์)" },
        { q: "ทำไมพิมพ์ด้วย write ก้อนเดียว + print_lock?", a: "print_lock กัน 2 thread พิมพ์ทับกัน; ประกอบทั้งบรรทัดแล้ว write ครั้งเดียวกัน output แตกกลางบรรทัด" },
        { q: "must_eat ทำงานยังไง?", a: "ถ้าระบุ arg ที่ 5 monitor นับว่าทุกคน meals_eaten >= must_eat ไหม ครบทุกคนก็ set_stop จบเกมอย่างสงบ (ไม่มีใครตาย)" },
        { q: "ทำไมหน่วงคนเลขคู่ตอนเริ่ม?", a: "กระจายการแย่งส้อมเป็นจังหวะสลับ (คี่กินก่อน คู่ตามมา) ลดการชนกันแย่งส้อม ทำให้ทุกคนได้กินทันเวลา throughput ดีขึ้น" },
        { q: "จัดการ memory/mutex ตอนจบยังไง?", a: "cleanup() เรียก pthread_mutex_destroy ทุก mutex (forks, meal_lock, print_lock, stop_lock) แล้ว free(forks/philos); ตรวจ leak ด้วย valgrind" },
        { q: "stop ทำไมต้องมี mutex ของตัวเอง?", a: "stop ถูกอ่านโดยทุก thread และเขียนโดย monitor = shared data; เข้าถึงผ่าน stop_lock เสมอ (is_stopped/set_stop) กัน data race" },
      ]},
      { h: "ทดสอบ" },
      { code: String.raw`./philo 5 800 200 200       # ไม่ควรมีใครตาย (รันยาว ๆ ดู)
./philo 4 410 200 200       # จังหวะก้ำกึ่ง
./philo 1 800 200 200       # ต้องตายที่ ~800ms
./philo 5 800 200 200 7     # จบเมื่อทุกคนกิน 7 มื้อ
valgrind --tool=helgrind ./philo 4 410 200 200   # หา data race`, lang: "bash" },
    ],
  },
},
/* ===================== CPP MODULE 00 ===================== */
{
  id: "cpp_module_00",
  name: "CPP Module 00",
  tag: { th: "ก้าวแรกสู่ C++ และ OOP — แยกทีละข้อ: ex00 Megaphone (I/O), ex01 PhoneBook (class+array), ex02 Account (static member, reverse จาก log)", en: "First steps into C++ & OOP — per-exercise: ex00 Megaphone (I/O), ex01 PhoneBook (classes+array), ex02 Account (static members, reverse-from-log)" },
  accent: "#feca57",
  sections: {
    principle: [
      { h: "Module 00 สอนอะไร" },
      { p: "CPP Module 00 คือ **ก้าวแรกจาก C ไป C++** — เปลี่ยนจากคิดแบบ 'ฟังก์ชัน + struct' ไปเป็น **OOP (Object-Oriented Programming)**: ห่อข้อมูล + พฤติกรรมไว้ใน **class** เดียวกัน. หัวข้อหลัก: namespace, std::cout/std::cin, class, member function, encapsulation, และ **static member**" },
      { h: "3 ข้อในโมดูลนี้ (ไล่จากง่ายไปยาก)" },
      { table: { head: ["ข้อ", "ชื่อ", "สอนอะไรเป็นหลัก"], rows: [
        ["ex00", "Megaphone", "I/O เบื้องต้น, argv, std::cout, แปลงตัวพิมพ์ใหญ่"],
        ["ex01", "PhoneBook", "class 2 ตัว, array ของ object, จัดตาราง, std::cin/getline"],
        ["ex02", "Account", "static member, constructor/destructor, encapsulation (reverse จาก log)"],
      ]}},
      { note: "หมายเหตุการอ้างอิงโค้ด: ex02 (Account) อธิบายจาก **โค้ดจริงของเรา** (`Account.cpp`) ในโฟลเดอร์โปรเจกต์. ส่วน ex00/ex01 โค้ดต้นฉบับไม่ได้ถูกเก็บไว้ในเครื่องนี้ จึงเป็น **โค้ดอ้างอิงที่เขียนตาม subject อย่างเป๊ะ** เพื่อให้เห็นแนวทาง" },
      { h: "ex00 — Megaphone (ตะโกนผ่านโทรโข่ง)" },
      { p: "โปรแกรมเล็กสุดของโมดูล: รับข้อความจาก argv แล้ว **พิมพ์ออกเป็นตัวพิมพ์ใหญ่ทั้งหมด**. ถ้าไม่ส่ง argument มาเลย ให้พิมพ์ข้อความ default. เป้าหมายคือทำความคุ้นเคยกับ `std::cout`, การวน argv และฟังก์ชันแปลงตัวอักษร" },
      { code: String.raw`$ ./megaphone "shhhhh... I think the students are asleep..."
SHHHHH... I THINK THE STUDENTS ARE ASLEEP...
$ ./megaphone Damn   "good"      idea
DAMN GOOD IDEA
$ ./megaphone
* LOUD AND UNBEARABLE FEEDBACK NOISE *`, cap: "พฤติกรรมตาม subject: รวม argv ทุกตัว → uppercase; ไม่มี arg → ข้อความ default", lang: "txt" },
      { h: "ex01 — PhoneBook (สมุดโทรศัพท์)" },
      { p: "โปรแกรม interactive: รับคำสั่ง `ADD` / `SEARCH` / `EXIT`. เก็บ contact ได้สูงสุด **8 รายชื่อ** (เกินแล้วทับตัวที่เก่าที่สุด). `SEARCH` พิมพ์ตารางย่อ แล้วให้เลือก index เพื่อดูรายละเอียดเต็ม. ฝึก **class 2 ตัว** (PhoneBook ถือ array ของ Contact) + การจัดคอลัมน์ตาราง" },
      { code: String.raw`Enter command (ADD / SEARCH / EXIT): ADD
First name: John
...
Enter command (ADD / SEARCH / EXIT): SEARCH
|     index|first name| last name|  nickname|
|         0|      John|       Doe|    johnny|
Enter index: 0
First name : John
...`, cap: "ตาราง 4 คอลัมน์ กว้างคอลัมน์ละ 10, ตัดด้วย '.' ถ้ายาวเกิน", lang: "txt" },
      { h: "ex02 — Account (GlobalBanksters United)" },
      { p: "โจทย์สุดคลาสสิก: ให้ `Account.hpp` (header ตายตัว ห้ามแก้), `tests.cpp` (โปรแกรมทดสอบตายตัว), และ **ไฟล์ log ผลลัพธ์ที่คาดหวัง** มาให้ — แต่ **ไม่ให้ตัวโค้ด `Account.cpp`**. งานคือ **เขียน Account.cpp ขึ้นมาเองให้ output ตรงกับ log เป๊ะ** (ต่างกันได้แค่ timestamp)" },
      { code: String.raw`[19920104_091532] index:0;amount:42;created
[19920104_091532] index:1;amount:54;created
...
[19920104_091532] accounts:8;total:20049;deposits:0;withdrawals:0
[19920104_091532] index:0;p_amount:42;deposit:5;amount:47;nb_deposits:1`, cap: "ส่วนหนึ่งของ log ที่ต้องทำให้ตรง — เราต้อง 'ถอดรหัส' ว่าแต่ละ method ต้องพิมพ์อะไร", lang: "txt" },
      { note: "นี่คือ reverse engineering: อ่าน log + header + tests แล้วเดา behavior ของแต่ละ method ให้ผลลัพธ์ออกมาเหมือนกัน — ฝึกอ่านโค้ดและอนุมานพฤติกรรม" },
      { h: "ทำไมโจทย์นี้สอน OOP ได้ดี" },
      { ul: [
        "**Account แต่ละตัว = 1 object** มีเงินของตัวเอง (`_amount`) แยกกัน",
        "**ตัวนับรวมทั้งธนาคาร** (จำนวนบัญชี, เงินรวม) = **static member** ที่ทุก object แชร์ร่วมกัน",
        "ข้อมูลทั้งหมดเป็น `private` — แตะได้ผ่าน method เท่านั้น = **encapsulation**",
      ]},
      { h: "เป้าหมายการเรียนรู้" },
      { table: { head: ["แนวคิด", "เห็นได้จาก"], rows: [
        ["Class & object", "Account หนึ่งตัว = หนึ่งบัญชี"],
        ["Constructor / Destructor", "พิมพ์ ;created ตอนเกิด, ;closed ตอนตาย"],
        ["Static member", "ตัวนับรวม _nbAccounts, _totalAmount"],
        ["Encapsulation", "ข้อมูล private + method public"],
        ["const member function", "checkAmount() const, displayStatus() const"],
      ]}},
    ],
    theory: [
      { p: "หมวดนี้รวมทฤษฎี **C++ และ OOP** ที่ต้องเข้าใจก่อนอ่าน Account" },
      { h: "1) C++ ต่างจาก C ยังไง" },
      { table: { head: ["", "C", "C++"], rows: [
        ["รวมข้อมูล+ฟังก์ชัน", "struct + ฟังก์ชันแยก", "class (รวมในตัว)"],
        ["พิมพ์ออกจอ", "printf", "std::cout <<"],
        ["จัด memory", "malloc/free", "new/delete"],
        ["namespace", "ไม่มี", "std::, ::"],
        ["compiler", "cc / gcc", "c++ / g++"],
      ]}},
      { note: "Module นี้บังคับ -std=c++98 — มาตรฐาน C++ เก่า (ไม่มี auto, nullptr, range-for) เพื่อฝึกพื้นฐานแน่น ๆ" },
      { h: "2) Class & Object" },
      { p: "**Class** = พิมพ์เขียว (blueprint) บอกว่า object ชนิดนี้มีข้อมูลอะไร (member variable) และทำอะไรได้ (member function). **Object** = ตัวจริงที่สร้างจาก class. หนึ่ง class สร้างได้หลาย object แต่ละตัวมีข้อมูลของตัวเอง" },
      { code: String.raw`class Account { ... };          // พิมพ์เขียว
Account a(42);                   // object ตัวที่ 1 (เงิน 42)
Account b(54);                   // object ตัวที่ 2 (เงิน 54)
// a กับ b มี _amount แยกกัน`, lang: "cpp" },
      { h: "3) Encapsulation (การห่อหุ้ม)" },
      { p: "ซ่อนข้อมูลภายในไว้ ไม่ให้แก้ตรง ๆ จากข้างนอก — เข้าถึงได้ผ่าน method ที่เราควบคุมเท่านั้น. ป้องกันการแก้ค่ามั่ว ๆ และทำให้แก้โค้ดภายในได้โดยไม่กระทบผู้ใช้" },
      { table: { head: ["access", "ใครเข้าถึงได้"], rows: [
        ["`public`", "ใครก็ได้ (interface ภายนอก)"],
        ["`private`", "เฉพาะ method ของ class นี้"],
        ["`protected`", "class นี้ + class ลูก (สืบทอด)"],
      ]}},
      { p: "ใน Account: `_amount`, `_nbAccounts` เป็น `private` ทั้งหมด — โลกภายนอกดูได้แค่ผ่าน `checkAmount()`, `getNbAccounts()` ที่เป็น `public`" },
      { h: "4) Constructor & Destructor" },
      { p: "**Constructor** = ฟังก์ชันพิเศษที่รันอัตโนมัติตอน object **เกิด** (ตั้งค่าเริ่มต้น). **Destructor** (`~`) = รันอัตโนมัติตอน object **ตาย** (เก็บกวาด). ชื่อต้องตรงกับชื่อ class" },
      { code: String.raw`Account( int initial_deposit );  // constructor (รับเงินตั้งต้น)
~Account( void );                 // destructor (ไม่มีพารามิเตอร์)`, cap: "ใน Account ทั้งคู่พิมพ์ timestamp + สถานะ (;created / ;closed)", lang: "cpp" },
      { h: "5) Static member — ของที่ 'ทั้ง class แชร์ร่วมกัน'" },
      { p: "member ปกติ → แต่ละ object มีสำเนาของตัวเอง. **static member** → มีชุดเดียว **ทุก object แชร์ร่วมกัน** เหมือนตัวแปรกลางของทั้ง class. เหมาะกับ 'ตัวนับรวม' เช่น มีกี่บัญชีทั้งหมด, เงินรวมทั้งธนาคาร" },
      { code: String.raw`static int _nbAccounts;    // นับจำนวนบัญชีทั้งหมด (ชุดเดียว)
// ในไฟล์ .cpp ต้องนิยามค่าเริ่มต้นนอก class:
int Account::_nbAccounts = 0;`, cap: "static member ต้อง 'นิยาม' แยกในไฟล์ .cpp ครั้งเดียว ไม่งั้น linker error", lang: "cpp" },
      { h: "6) static member function" },
      { p: "method ที่ทำงานกับ static member ได้โดย **ไม่ต้องมี object** — เรียกผ่านชื่อ class ตรง ๆ เช่น `Account::getNbAccounts()`. มันไม่มี `this` เพราะไม่ผูกกับ object ตัวใดตัวหนึ่ง" },
      { h: "7) const member function" },
      { p: "method ที่ต่อท้ายด้วย `const` สัญญาว่า **จะไม่แก้ไขข้อมูลของ object**. เรียกได้กับ object ที่เป็น const และช่วยให้ compiler จับ bug ถ้าเผลอแก้ค่า" },
      { code: String.raw`int  checkAmount( void ) const;      // แค่อ่าน _amount → const
void displayStatus( void ) const;    // แค่แสดงผล → const`, lang: "cpp" },
      { h: "🔬 เจาะลึก A: Static member — ของชุดเดียวที่ทั้ง class แชร์ + วงจรชีวิต" },
      { p: "**ภาพในหัว:** `_amount` คือเงินของ 'แต่ละบัญชี' (ต่างคนต่างมี) แต่ `_nbAccounts` คือ 'จำนวนบัญชีทั้งธนาคาร' — มีชุดเดียวที่ทุก object แชร์. static = ตัวแปรกลางของทั้ง class ไม่ใช่ของ object ตัวใดตัวหนึ่ง" },
      { code: String.raw`เก็บที่ไหน:
  member ปกติ  → อยู่ "ใน" object แต่ละตัว (a._amount, b._amount แยกกัน)
  static member → อยู่ใน static storage ชุดเดียว (เกิดก่อน main, ตายหลัง main)
                  ทุก object อ้างถึงตัวเดียวกัน

ใน Account ทุก constructor ทำ:
  _accountIndex = _nbAccounts;   // จดเลขบัญชีตัวเอง "ก่อน" เพิ่ม
  _nbAccounts++;                 // เพิ่มตัวนับรวม
  _totalAmount += deposit;       // บวกเข้าเงินรวมธนาคาร`, cap: "static = ชุดเดียวทั้ง class; instance member = ชุดต่อ object", lang: "cpp" },
      { p: "**ไล่ทีละตัว** — สร้าง 3 บัญชี เงิน {42, 54, 957}:" },
      { code: String.raw`เริ่ม: _nbAccounts=0, _totalAmount=0

Account a(42):  _accountIndex=0 (=ค่า _nbAccounts ก่อน++), _nbAccounts→1, _totalAmount→42
Account b(54):  _accountIndex=1,                          _nbAccounts→2, _totalAmount→96
Account c(957): _accountIndex=2,                          _nbAccounts→3, _totalAmount→1053

→ index ไล่ 0,1,2 อัตโนมัติเพราะอ่าน _nbAccounts "ก่อน" ++
→ getNbAccounts() คืน 3, getTotalAmount() คืน 1053 (ไม่ต้องมี object)`, cap: "หัวใจ ex02: _accountIndex มาจาก static counter ที่อ่านก่อนเพิ่ม — เลขจึงไม่ซ้ำและเรียงเอง", lang: "txt" },
      { note: "ลองพิสูจน์เอง: static member ต้อง 'นิยาม' นอก class ในไฟล์ .cpp ครั้งเดียว (`int Account::_nbAccounts = 0;`). ลองลบบรรทัดนี้ออก → linker error 'undefined reference to Account::_nbAccounts' เพราะ declaration ใน class แค่ 'ประกาศ' ไม่ได้ 'จองที่'" },
      { qa: [
        { q: "ทำไม static member function ไม่มี `this`?", a: "เพราะมันไม่ผูกกับ object ตัวใดตัวหนึ่ง — เรียกผ่านชื่อ class (`Account::getNbAccounts()`) ได้แม้ไม่มี object เลย. ไม่มี object → ไม่มี this → แตะได้แค่ static member" },
        { q: "ทำไม static ต้องนิยามนอก class?", a: "declaration ใน class แค่บอก compiler ว่า 'มีตัวนี้อยู่' (ไม่จองหน่วยความจำ). ต้องมีการนิยามจริง 1 ที่ (one-definition rule) ใน .cpp เพื่อจองที่ ไม่งั้น linker หาไม่เจอ" },
        { q: "_accountIndex ของบัญชีแรกเป็น 0 ได้ยังไง?", a: "เพราะ ctor อ่าน `_nbAccounts` (เริ่มที่ 0) มาใส่ _accountIndex ก่อน แล้วค่อย ++ → บัญชีแรกได้ 0, ตัวถัดไป 1, 2,..." },
      ]},

      { h: "🔬 เจาะลึก B: ลำดับ Constructor/Destructor — ทำไม log ของ Account เรียงแบบนั้น" },
      { p: "**ภาพในหัว:** object **เกิด** → ctor ทำงาน (พิมพ์ `;created`), object **ตาย** → dtor ทำงาน (พิมพ์ `;closed`). ความท้าทายของ ex02 คือทำให้ลำดับ log ตรงกับไฟล์เป๊ะ — ซึ่งขึ้นกับ 'ลำดับเกิด/ตาย'" },
      { code: String.raw`กฎลำดับ:
  • ctor ทำงานตอน object ถูกสร้าง (ตามลำดับการประกาศ)
  • dtor ทำงานตอน object หมดอายุ:
      - ตัวแปร local (stack)  → ตายตอนจบ scope, ลำดับ "กลับด้าน" (LIFO)
      - สมาชิกใน vector/array → ตายตอน container ถูกทำลาย
  • สมาชิกของ object เกิดตามลำดับ "การประกาศใน class" ไม่ใช่ลำดับใน init list`, cap: "สร้างเรียงหน้า–หลัง, ทำลายเรียงหลัง–หน้า (เหมือน stack ของจาน)", lang: "cpp" },
      { p: "**ไล่ลำดับจริง** — บล็อกที่สร้าง 3 บัญชีบน stack:" },
      { code: String.raw`{
    Account a(42);    // [ts] index:0;amount:42;created
    Account b(54);    // [ts] index:1;amount:54;created
    Account c(957);   // [ts] index:2;amount:957;created
}   // จบ scope → ทำลายกลับด้าน:
    // [ts] index:2;amount:957;closed   ← c ตายก่อน (เกิดทีหลัง)
    // [ts] index:1;amount:54;closed
    // [ts] index:0;amount:42;closed    ← a ตายหลังสุด`, cap: "LIFO: ตัวที่เกิดทีหลังตายก่อน — เป็นเหตุผลที่ลำดับ closed กลับด้านกับ created", lang: "txt" },
      { note: "ลองพิสูจน์เอง: ทำไมต้องเก็บ p_amount (เงินก่อนฝาก) ไว้ 'ก่อน' แก้ _amount ใน makeDeposit? เพราะ log ต้องพิมพ์ทั้งค่าเก่า (p_amount) และค่าใหม่ (_amount) — ถ้าแก้ก่อนเก็บ จะพิมพ์ค่าเก่าไม่ได้แล้ว ลำดับ 'อ่านเก่า → แก้ → พิมพ์ทั้งคู่' จึงสำคัญ" },
      { qa: [
        { q: "ทำไม log `;closed` เรียงกลับด้านกับ `;created`?", a: "object บน stack ถูกทำลายแบบ LIFO (last-in-first-out) — ตัวที่เกิดทีหลังหมดอายุก่อนตอนจบ scope จึง closed กลับลำดับ" },
        { q: "สมาชิกของ object เกิดตามลำดับไหน — init list หรือ declaration?", a: "ตาม 'ลำดับการประกาศใน class' เสมอ ไม่ใช่ลำดับใน initializer list — เป็นกับดักคลาสสิกถ้าสมาชิกหนึ่งพึ่งอีกตัวที่ประกาศทีหลัง" },
        { q: "destructor ของ Account ทำอะไร?", a: "พิมพ์ `[ts] index:..;amount:..;closed` — เป็น static helper _displayTimestamp() + พิมพ์สถานะสุดท้ายของบัญชีตอนถูกทำลาย" },
      ]},

      { h: "🔬 เจาะลึก C: const-correctness — `const` ท้าย method แปลว่าอะไรกันแน่" },
      { p: "**ภาพในหัว:** ใส่ `const` ท้าย method = ทำสัญญากับ compiler ว่า 'method นี้แค่อ่าน ไม่แก้ข้อมูล object'. มันไม่ใช่แค่ความสวยงาม — มันทำให้เรียก method นั้นกับ **const object** ได้ และให้ compiler จับ bug ถ้าเผลอแก้" },
      { code: String.raw`กลไก: const ท้าย method เปลี่ยนชนิดของ this
  method ปกติ:  this เป็น  Account*        → แก้สมาชิกได้
  method const: this เป็น  const Account*  → แก้สมาชิกไม่ได้ (compile error)

void displayStatus( void ) const {
    // this->_amount += 1;   // ✗ ERROR: assignment of member in const method
    std::cout << _amount;    // ✓ อ่านได้
}`, cap: "const ทำให้ this กลายเป็น pointer-to-const → compiler ห้ามทุกการเขียนสมาชิก", lang: "cpp" },
      { p: "**ทำไมสำคัญ — const object เรียกได้แค่ const method:**" },
      { code: String.raw`const Account ref(42);   // object ที่เป็น const
  ref.displayStatus();   // ✓ ได้ (เป็น const method)
  ref.makeDeposit(5);    // ✗ ERROR: makeDeposit ไม่ใช่ const แต่ ref เป็น const

→ ถ้าลืมใส่ const ที่ displayStatus → เรียกกับ const object ไม่ได้เลย
→ const "แพร่" ผ่านระบบ: อยากให้ของ const ใช้งานได้ ต้องมาร์ค method อ่านอย่างเดียวเป็น const ให้ครบ`, cap: "const-correctness = ออกแบบให้ 'อะไรที่อ่านอย่างเดียว' มาร์ค const ครบ เพื่อให้ const object ใช้งานได้", lang: "txt" },
      { note: "ลองพิสูจน์เอง: เพิ่ม `const Account a(42); a.makeWithdrawal(5);` แล้วคอมไพล์ — จะ error เพราะ makeWithdrawal แก้ _amount (ไม่ใช่ const). เปลี่ยนเป็น `a.checkAmount()` (const) แล้วคอมไพล์ผ่าน — ยืนยันว่า const object เรียกได้แค่ const method" },
      { qa: [
        { q: "`int checkAmount() const` ตัว const ทำอะไร?", a: "บอกว่า method นี้ไม่แก้สมาชิกของ object (this เป็น const Account*). ผล: เรียกกับ const object ได้ และถ้าเผลอเขียนสมาชิก compiler จะ error" },
        { q: "ทำไม const object เรียก non-const method ไม่ได้?", a: "non-const method อาจแก้ object ได้ — แต่ object เป็น const (ห้ามแก้) → compiler ปฏิเสธเพื่อรักษาสัญญา const. จึงต้องมาร์ค method อ่านอย่างเดียวเป็น const" },
        { q: "ถ้าจำเป็นต้องแก้สมาชิกบางตัวใน const method ทำยังไง?", a: "มาร์คสมาชิกตัวนั้นเป็น `mutable` (เช่น cache/counter ภายใน) — แต่ใช้เท่าที่จำเป็น เพราะมันคือการ 'ยกเว้น' สัญญา const" },
      ]},

      { h: "🔬 เจาะลึก D: this pointer — pointer ซ่อนที่ทำให้ method รู้ว่า 'ตัวไหนเรียก'" },
      { p: "**ภาพในหัว:** method เดียว (`makeDeposit`) ใช้ได้กับทุกบัญชี — มันรู้ได้ยังไงว่าตอนนี้ทำงานกับ a หรือ b? คำตอบคือ **`this`** pointer ซ่อนที่ชี้ไปยัง object ที่เรียก method นั้นอยู่" },
      { code: String.raw`สิ่งที่จริง ๆ เกิดขึ้น (desugar): compiler แอบเพิ่ม this เป็น param แรก
  a.makeDeposit(5);
  → Account::makeDeposit(&a, 5);     // &a ถูกส่งเป็น this

ภายใน method:
  _amount += deposit;          // จริง ๆ คือ this->_amount += deposit
  → this ชี้ไป a → แก้ a._amount ; ถ้าเรียก b.makeDeposit → this ชี้ b`, cap: "this = ที่อยู่ของ object ที่เรียก — ทำให้โค้ดชุดเดียวทำงานกับ object ใดก็ได้", lang: "cpp" },
      { p: "**ใช้ this ตรง ๆ เมื่อไร:** (1) เวลาชื่อ parameter ชนกับสมาชิก (`this->x = x`), (2) คืน `*this` เพื่อต่อ method แบบลูกโซ่ (chaining), (3) ใน const method `this` เป็น `const Account*` (อ่านได้อย่างเดียว)" },
      { note: "ลองพิสูจน์เอง: ใน makeWithdrawal โค้ดเขียน `this->_amount` กับ `_amount` สลับกันได้ผลเหมือนกัน — เพราะ `_amount` เปล่า ๆ ก็คือ `this->_amount` โดยปริยาย. เขียน this-> ชัด ๆ ช่วยให้อ่านง่ายว่าแตะสมาชิกของ object" },
      { qa: [
        { q: "this คืออะไรกันแน่?", a: "pointer ที่ compiler แอบส่งเป็น argument แรกของทุก non-static method ชี้ไปยัง object ที่เรียก method นั้น — `_amount` เปล่า ๆ คือ `this->_amount`" },
        { q: "ทำไม static method ไม่มี this?", a: "static method ไม่ผูกกับ object ใด (เรียกผ่านชื่อ class ได้) → ไม่มี object ให้ this ชี้ → แตะ instance member ไม่ได้ แตะได้แค่ static" },
        { q: "คืน `*this` (ไม่ใช่ this) ทำไม?", a: "this เป็น pointer, `*this` คือตัว object เอง — คืน reference ของ object เพื่อต่อเรียกแบบลูกโซ่ เช่น `obj.set(1).set(2)` (พบมากในโมดูลถัด ๆ ไป)" },
      ]},
      { h: "8) I/O ของ C++ (ใช้ทั้ง 3 ข้อ)" },
      { p: "C++ รับ-ส่งข้อมูลผ่าน **stream**: `std::cout` พิมพ์ออกจอ, `std::cin` อ่านจาก keyboard. ต่อกันด้วย `<<` (ออก) และ `>>` (เข้า). `std::endl` ขึ้นบรรทัดใหม่ + flush" },
      { table: { head: ["ใช้ทำ", "เครื่องมือ", "เห็นที่ข้อ"], rows: [
        ["พิมพ์ออกจอ", "`std::cout <<`", "ทุกข้อ"],
        ["อ่านทั้งบรรทัด (มีช่องว่าง)", "`std::getline(std::cin, s)`", "ex01 (ฟิลด์ contact)"],
        ["อ่านทีละคำ", "`std::cin >> x`", "ex01 (เลือก index)"],
        ["เช็ค EOF / อ่านพลาด", "`std::cin.eof()`, `if (!std::cin)`", "ex01"],
      ]}},
      { h: "9) std::string & แปลงตัวพิมพ์ (ex00/ex01)" },
      { p: "`std::string` คือสตริงของ C++ ที่จัดการความยาว/หน่วยความจำให้เอง (ไม่ต้อง malloc เหมือน C). วนทีละตัวอักษรแล้วเรียก `std::toupper()` (จาก `<cctype>`) เพื่อทำตัวพิมพ์ใหญ่ — หัวใจของ ex00" },
      { code: String.raw`#include <cctype>
std::string s = argv[i];
for (size_t j = 0; j < s.length(); ++j)
    std::cout << (char)std::toupper(s[j]);`, cap: "ex00: วน argv ทุกตัว แปลงทุกอักขระเป็นพิมพ์ใหญ่", lang: "cpp" },
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "cppreference — Classes", url: "https://en.cppreference.com/w/cpp/language/classes", note: "อ้างอิงทางการเรื่อง class / member" },
        { label: "cppreference — Static members", url: "https://en.cppreference.com/w/cpp/language/static", note: "static data member + การนิยามนอก class" },
        { label: "learncpp — Intro to classes", url: "https://www.learncpp.com/cpp-tutorial/introduction-to-classes/", note: "สอน OOP C++ ทีละขั้นแบบจับมือทำ" },
        { label: "cppreference — The this pointer", url: "https://en.cppreference.com/w/cpp/language/this", note: "นิยามและการใช้ this" },
        { label: "cppreference — std::getline", url: "https://en.cppreference.com/w/cpp/string/basic_string/getline", note: "อ่านทั้งบรรทัด (ใช้ใน ex01)" },
        { label: "cppreference — std::toupper", url: "https://en.cppreference.com/w/cpp/string/byte/toupper", note: "แปลงอักขระเป็นพิมพ์ใหญ่ (ใช้ใน ex00)" },
      ]},
    ],
    foundations: [
      { p: "หมวดนี้เจาะ **โครงสร้างข้อมูลของแต่ละข้อ** — เริ่มจาก ex00/ex01 สั้น ๆ แล้วลงลึกที่ Account (ex02)" },
      { h: "ex00 — Megaphone: ไม่มี class เลย" },
      { p: "ex00 เป็นแค่ `main()` ตัวเดียว ไม่มี class — ข้อมูลคือ `argc`/`argv` ที่ระบบส่งเข้ามา. โครงคือ: ถ้า `argc == 1` พิมพ์ default; ไม่งั้นวน argv[1..argc-1] แปลงทุกตัวเป็นพิมพ์ใหญ่แล้วพิมพ์ติดกัน ปิดท้ายด้วย newline" },
      { code: String.raw`int main(int argc, char **argv) {
    if (argc == 1) {
        std::cout << "* LOUD AND UNBEARABLE FEEDBACK NOISE *" << std::endl;
        return 0;
    }
    for (int i = 1; i < argc; ++i)
        for (int j = 0; argv[i][j]; ++j)
            std::cout << (char)std::toupper(argv[i][j]);
    std::cout << std::endl;
    return 0;
}`, cap: "ex00 ครบทั้งโปรแกรมในไม่กี่บรรทัด (โค้ดอ้างอิงตาม subject)", lang: "cpp" },
      { h: "ex01 — PhoneBook: 2 class ซ้อนกัน" },
      { p: "ออกแบบเป็น 2 class: **Contact** เก็บข้อมูล 1 รายชื่อ, **PhoneBook** ถือ `Contact[8]` + ตัวนับ. ใช้ array คงที่ 8 ช่อง (ไม่ใช้ new/delete) แล้ววนทับแบบ ring เมื่อเต็ม" },
      { code: String.raw`class Contact {
    std::string _first, _last, _nick, _phone, _secret;
    /* getter/setter ต่อฟิลด์ */
};
class PhoneBook {
    Contact _contacts[8];   // เก็บได้ 8 ราย
    int     _count;         // มีจริงกี่ราย (0..8)
    int     _next;          // ช่องถัดไปที่จะเขียน (ring index)
};`, cap: "PhoneBook ใช้ array ขนาดคงที่ 8 — เต็มแล้วทับช่องเก่าสุด (_next วนกลับ 0)", lang: "cpp" },
      { p: "เมื่อเพิ่มเกิน 8: `_next = (_next + 1) % 8` ทำให้ index วนกลับมาทับตัวแรก — เก็บได้ 'ล่าสุด 8 ราย' เสมอ" },
      { h: "ex02 — Account: member 2 ระดับ (static vs ปกติ)" },
      { code: String.raw`class Account {
private:
    /* static = ของรวมทั้งธนาคาร (ทุก object แชร์) */
    static int _nbAccounts;          // มีกี่บัญชี
    static int _totalAmount;         // เงินรวมทั้งหมด
    static int _totalNbDeposits;     // ฝากรวมกี่ครั้ง
    static int _totalNbWithdrawals;  // ถอนรวมกี่ครั้ง

    /* ปกติ = ของเฉพาะบัญชีนี้ (แต่ละ object มีของตัวเอง) */
    int _accountIndex;               // เลขบัญชี
    int _amount;                     // เงินในบัญชีนี้
    int _nbDeposits;                 // บัญชีนี้ฝากกี่ครั้ง
    int _nbWithdrawals;              // บัญชีนี้ถอนกี่ครั้ง
};`, cap: "เส้นแบ่งสำคัญ: static = ระดับ class (รวม), ปกติ = ระดับ object (เฉพาะตัว)", lang: "cpp" },
      { h: "ทำไม static ต้องนิยามแยกในไฟล์ .cpp" },
      { p: "ใน header แค่ **ประกาศ** ว่า 'มี static member นี้อยู่' แต่ยังไม่จองที่จริง. ต้อง **นิยาม** (จองที่ + ตั้งค่า) ในไฟล์ .cpp ครั้งเดียว ไม่งั้น linker หาตัวจริงไม่เจอ:" },
      { code: String.raw`/* บนสุดของ Account.cpp */
int Account::_nbAccounts        = 0;
int Account::_totalAmount       = 0;
int Account::_totalNbDeposits   = 0;
int Account::_totalNbWithdrawals = 0;`, cap: "ถ้าลืมบรรทัดนี้ → undefined reference ตอน link", lang: "cpp" },
      { h: "lifecycle ของ static counter" },
      { code: String.raw`สร้าง Account(42):
  _accountIndex = _nbAccounts;   // จอง index จากตัวนับปัจจุบัน (0)
  _amount = 42;
  _nbAccounts++;                 // เพิ่มตัวนับรวม → 1
  _totalAmount += 42;            // บวกเข้าเงินรวม

สร้าง Account(54):
  _accountIndex = _nbAccounts;   // ได้ index 1
  _nbAccounts++;                 // → 2
  ...`, cap: "index ของบัญชีใหม่ = จำนวนบัญชีที่มีอยู่ก่อนหน้า — นับ 0,1,2,... อัตโนมัติ", lang: "txt" },
      { h: "typedef Account t — ลูกเล่นใน header" },
      { p: "`typedef Account t;` สร้างชื่อเล่น `Account::t` ให้ใช้แทน `Account` — `tests.cpp` ใช้มันสร้าง `std::vector<Account::t>`. เป็นแค่ alias ไม่มีผลต่อ logic แต่ต้องมีใน header (ซึ่งให้มาแล้ว)" },
      { h: "ทำไมทุกอย่างเป็น int (ไม่ใช่ float)" },
      { p: "ระบบบัญชีในโจทย์ใช้จำนวนเต็มล้วน — ไม่มีเศษสตางค์. ทำให้ output เป็นเลขกลม ๆ ตรงกับ log ได้ง่าย ไม่ต้องกังวลเรื่องความแม่นยำทศนิยม" },
    ],
    architecture: [
      { h: "ex00 — Megaphone: ไฟล์เดียว" },
      { table: { head: ["ไฟล์", "หน้าที่"], rows: [
        ["`megaphone.cpp`", "มีแค่ `main()` — รับ argv แปลง uppercase พิมพ์ออก"],
        ["`Makefile`", "build เป็น binary ชื่อ `megaphone` (-std=c++98)"],
      ]}},
      { h: "ex01 — PhoneBook: แยก class เป็นไฟล์" },
      { table: { head: ["ไฟล์", "หน้าที่"], rows: [
        ["`Contact.hpp/.cpp`", "class เก็บ 1 รายชื่อ + getter/setter"],
        ["`PhoneBook.hpp/.cpp`", "class ถือ Contact[8] + add/search"],
        ["`main.cpp`", "ลูปรับคำสั่ง ADD/SEARCH/EXIT"],
        ["`Makefile`", "build เป็น `phonebook`"],
      ]}},
      { note: "หลักการแบ่งไฟล์ C++: แต่ละ class มี `.hpp` (ประกาศ interface) คู่กับ `.cpp` (เนื้อ implementation) — เหมือน Account ใน ex02" },
      { h: "ไฟล์ในโปรเจกต์ (ex02)" },
      { table: { head: ["ไฟล์", "แก้ได้ไหม", "หน้าที่"], rows: [
        ["`Account.hpp`", "❌ ห้ามแก้", "ประกาศ class (interface ตายตัว)"],
        ["`tests.cpp`", "❌ ห้ามแก้", "โปรแกรมทดสอบ (สร้างบัญชี ฝาก ถอน)"],
        ["`*.log`", "อ้างอิง", "ผลลัพธ์ที่ถูกต้อง ใช้เทียบ"],
        ["`Account.cpp`", "✅ ที่เราเขียน", "implement ทุก method ให้ตรง log"],
        ["`Makefile`", "✅", "build ด้วย -std=c++98"],
      ]}},
      { h: "interface ที่ต้อง implement (จาก header)" },
      { code: String.raw`/* static — เรียกผ่านชื่อ class ไม่ต้องมี object */
static int  getNbAccounts();
static int  getTotalAmount();
static int  getNbDeposits();
static int  getNbWithdrawals();
static void displayAccountsInfos();

/* ปกติ — ทำงานกับ object */
Account( int initial_deposit );      // constructor
~Account();                           // destructor
void makeDeposit( int deposit );
bool makeWithdrawal( int withdrawal );
int  checkAmount() const;
void displayStatus() const;

/* private helper */
static void _displayTimestamp();`, cap: "header กำหนด signature ทั้งหมด — งานคือเติม 'เนื้อใน' ให้ output ตรง log", lang: "cpp" },
      { h: "tests.cpp ทำอะไร (ลำดับการเรียก)" },
      { code: String.raw`1. สร้าง 8 บัญชี เงินตั้งต้น {42,54,957,...}  → 8 บรรทัด ;created
2. displayAccountsInfos()                       → 1 บรรทัดสรุป
3. displayStatus() ทุกบัญชี                      → 8 บรรทัด
4. makeDeposit() ทุกบัญชี                         → 8 บรรทัด deposit
5. displayAccountsInfos() + displayStatus()×8
6. makeWithdrawal() ทุกบัญชี (บางอันถูกปฏิเสธ)
7. displayAccountsInfos() + displayStatus()×8
8. จบ main → destructor พิมพ์ ;closed ×8`, cap: "ลำดับนี้กำหนดลำดับบรรทัดใน log ที่เราต้องทำให้ตรง", lang: "txt" },
      { note: "ตอนจบ main object ใน vector ถูกทำลายเรียง index → destructor พิมพ์ ;closed 8 บรรทัดเป็นท้ายสุดของ log" },
    ],
    dataflow: [
      { h: "ex00 — Megaphone: เส้นทางข้อมูล" },
      { code: String.raw`argv ──► argc==1 ? ──yes─► พิมพ์ "* LOUD AND ... *" ──► จบ
              │ no
              ▼
       วน i = 1..argc-1
              │
              ▼  วน j ในแต่ละ argv[i]
       std::toupper(argv[i][j]) ──► std::cout
              ▼
       std::cout << std::endl ──► จบ`, cap: "input คือ argv → output คือสตริง uppercase ต่อกัน", lang: "txt" },
      { h: "ex01 — PhoneBook: ลูปคำสั่ง" },
      { code: String.raw`main loop ──► อ่านคำสั่ง (getline)
   ├─ "ADD"    ► ถาม 5 ฟิลด์ ► PhoneBook.add(Contact)
   │                              └► _contacts[_next] = c; ring index
   ├─ "SEARCH" ► พิมพ์ตารางย่อ ► อ่าน index ► พิมพ์ contact เต็ม
   └─ "EXIT"   ► break ออกลูป`, cap: "input คือคำสั่ง+ฟิลด์จาก stdin → เก็บลง array / แสดงผล", lang: "txt" },
      { h: "ex02 — Account: ไล่ทุก method ทีละตัว" },
      { p: "ไล่ทุก method ทีละตัว — เทียบกับบรรทัด log ที่มันสร้าง" },
      { h: "Constructor — Account(int initial_deposit)" },
      { code: String.raw`Account::Account( int initial_deposit )
{
    this->_accountIndex = _nbAccounts;   // เลขบัญชี = ตัวนับปัจจุบัน
    this->_amount = initial_deposit;
    this->_nbDeposits = 0;
    this->_nbWithdrawals = 0;
    _nbAccounts++;                        // เพิ่มตัวนับรวม
    _totalAmount += initial_deposit;      // เพิ่มเงินรวม
    _displayTimestamp();
    std::cout << "index:" << _accountIndex
              << ";amount:" << _amount << ";created" << std::endl;
}`, cap: "ออก: [ts] index:0;amount:42;created", lang: "cpp" },
      { h: "Destructor — ~Account()" },
      { code: String.raw`Account::~Account( void )
{
    _displayTimestamp();
    std::cout << "index:" << _accountIndex
              << ";amount:" << _amount << ";closed" << std::endl;
}`, cap: "ออก: [ts] index:0;amount:42;closed", lang: "cpp" },
      { h: "makeDeposit(int deposit)" },
      { code: String.raw`void Account::makeDeposit( int deposit )
{
    int p_amount = this->_amount;        // จำเงินก่อนฝาก (previous)
    this->_amount += deposit;
    this->_nbDeposits++;
    _totalAmount += deposit;             // อัปเดต static รวม
    _totalNbDeposits++;
    _displayTimestamp();
    std::cout << "index:" << _accountIndex << ";p_amount:" << p_amount
              << ";deposit:" << deposit << ";amount:" << _amount
              << ";nb_deposits:" << _nbDeposits << std::endl;
}`, cap: "ออก: [ts] index:0;p_amount:42;deposit:5;amount:47;nb_deposits:1", lang: "cpp" },
      { h: "makeWithdrawal(int withdrawal) — มีเงื่อนไขปฏิเสธ" },
      { code: String.raw`bool Account::makeWithdrawal( int withdrawal )
{
    int p_amount = this->_amount;
    _displayTimestamp();
    if ( withdrawal > this->_amount )            // เงินไม่พอ
    {
        std::cout << "index:" << _accountIndex << ";p_amount:" << p_amount
                  << ";withdrawal:refused" << std::endl;
        return (false);
    }
    this->_amount -= withdrawal;
    this->_nbWithdrawals++;
    _totalAmount -= withdrawal;
    _totalNbWithdrawals++;
    std::cout << "index:" << _accountIndex << ";p_amount:" << p_amount
              << ";withdrawal:" << withdrawal << ";amount:" << _amount
              << ";nb_withdrawals:" << _nbWithdrawals << std::endl;
    return (true);
}`, cap: "ถ้าถอนเกินเงิน → ;withdrawal:refused และ return false (เบาะแสจาก log)", lang: "cpp" },
      { h: "static getters + displayAccountsInfos" },
      { code: String.raw`int  Account::getNbAccounts()  { return (_nbAccounts); }
int  Account::getTotalAmount() { return (_totalAmount); }
/* ... */
void Account::displayAccountsInfos()
{
    _displayTimestamp();
    std::cout << "accounts:" << _nbAccounts << ";total:" << _totalAmount
              << ";deposits:" << _totalNbDeposits
              << ";withdrawals:" << _totalNbWithdrawals << std::endl;
}`, cap: "ออก: [ts] accounts:8;total:20049;deposits:0;withdrawals:0", lang: "cpp" },
      { h: "_displayTimestamp() — หัวใจของทุกบรรทัด" },
      { code: String.raw`void Account::_displayTimestamp( void )
{
    std::time_t now = std::time(NULL);
    std::tm    *lt  = std::localtime(&now);
    char        buf[32];
    std::strftime(buf, sizeof(buf), "[%Y%m%d_%H%M%S] ", lt);
    std::cout << buf;
}`, cap: "ใช้ <ctime> ฟอร์แมต [YYYYMMDD_HHMMSS] นำหน้าทุกบรรทัด — timestamp ต่างจาก log ได้ (อันเดียวที่ต่างได้)", lang: "cpp" },
    ],
    implementation: [
      { h: "ex00 — Megaphone: จุดที่พลาดบ่อย" },
      { ul: [
        "อย่าลืมเคส `argc == 1` (ไม่มี arg) → ต้องพิมพ์ข้อความ default เป๊ะ ๆ รวมเครื่องหมาย `*`",
        "ห้ามใส่ช่องว่างคั่นระหว่าง argv (ดู `DAMN GOOD IDEA` — มาจาก argv 3 ตัวที่พิมพ์ติดกัน เพราะ shell ตัดช่องว่างให้แล้ว)",
        "`std::toupper` คืน `int` → cast เป็น `(char)` ก่อนพิมพ์ ไม่งั้นอาจได้เลข ASCII",
        "ปิดท้ายด้วย `std::endl` หนึ่งครั้งตอนจบ",
      ]},
      { h: "ex01 — PhoneBook: จุดที่พลาดบ่อย" },
      { ul: [
        "คอลัมน์ตารางกว้าง **10** ตัวอักษร ชิดขวา — ใช้ `std::setw(10)` (จาก `<iomanip>`) คั่นด้วย `|`",
        "ฟิลด์ยาวเกิน 10 → ตัดเหลือ 9 ตัว + ใส่ `.` ปิดท้าย (เช่น `Christophe` → `Christoph.`)",
        "อ่านชื่อที่มีช่องว่างต้องใช้ `std::getline` ไม่ใช่ `std::cin >>`",
        "กัน input ว่าง: ห้าม ADD ถ้าฟิลด์ว่าง / กัน index ที่ไม่มีจริงตอน SEARCH",
        "เช็ค `std::cin.eof()` เพื่อออกอย่างสะอาดเมื่อเจอ Ctrl-D",
      ]},
      { code: String.raw`#include <iomanip>
std::string trunc(std::string s) {
    if (s.length() > 10)
        return s.substr(0, 9) + ".";
    return s;
}
std::cout << "|" << std::setw(10) << trunc(c.getFirst());`, cap: "ex01: ตัดให้พอดี 10 ช่อง + จัดชิดขวาด้วย setw (โค้ดอ้างอิงตาม subject)", lang: "cpp" },
      { h: "ex02 — Account: วิธีไล่ reverse engineering จาก log" },
      { ul: [
        "1. อ่าน `tests.cpp` → รู้ลำดับว่า method ไหนถูกเรียกเมื่อไหร่",
        "2. จับคู่แต่ละ 'การเรียก' กับ 'บรรทัด log' → รู้ว่า method นั้นต้องพิมพ์อะไร",
        "3. ดูฟิลด์ในบรรทัด (`index`, `p_amount`, `amount`, `nb_deposits`) → อนุมานว่าต้องเก็บ/คำนวณค่าอะไร",
        "4. สังเกตเคสพิเศษ: `withdrawal:refused` → มีเงื่อนไข if เงินไม่พอ",
        "5. เขียน Account.cpp → build → diff กับ log (ละ timestamp)",
      ]},
      { h: "เบาะแสสำคัญที่อ่านได้จาก log" },
      { table: { head: ["บรรทัด log บอกว่า", "อนุมานได้ว่า"], rows: [
        ["index เริ่ม 0,1,2...", "index = _nbAccounts ตอนสร้าง"],
        ["total:20049 = ผลรวม initial", "constructor บวก _totalAmount"],
        ["p_amount แสดงก่อน amount", "ต้องจำค่าเก่าไว้ก่อนเปลี่ยน"],
        ["withdrawal:refused", "if (withdrawal > _amount) → ปฏิเสธ"],
        [";closed อยู่ท้ายสุด", "destructor ทำงานตอน object ตาย"],
      ]}},
      { h: "การ build (สำคัญ: ต้อง c++98)" },
      { code: String.raw`# Makefile
CC     = c++
CFLAGS = -Wall -Wextra -Werror -std=c++98
# SRCS = Account.cpp tests.cpp
make && ./account > my.log
diff <(sed 's/\[[0-9_]*\]//' my.log) \
     <(sed 's/\[[0-9_]*\]//' 19920104_091532.log)
# ถ้า diff ว่าง = ตรงเป๊ะ (เทียบโดยตัด timestamp ออก)`, lang: "bash" },
      { note: "ถ้าเจอ error 'mem_fun_ref is not a member of std' → เพราะลืม -std=c++98 (mem_fun_ref ถูกถอดใน C++ ใหม่) ใส่ flag นี้แก้ได้" },
    ],
    tricks: [
      { h: "ex00 — ทริค: รวม argv โดยไม่ต้องสร้าง string" },
      { p: "ไม่ต้องเอา argv มาต่อกันเป็น string ใหญ่ก่อน — วนพิมพ์ทีละตัวอักษรผ่าน `std::cout` ได้เลย ประหยัดหน่วยความจำและสั้นกว่า" },
      { h: "ex01 — ทริค: ring buffer ด้วย modulo" },
      { p: "เก็บได้ 8 ราย แล้วทับตัวเก่าสุด → ใช้ `_next = (_next + 1) % 8`. ตัวนับ `_count` หยุดที่ 8 (ไว้รู้ว่าตอน SEARCH มีจริงกี่แถว) แต่ `_next` วนต่อเรื่อย ๆ" },
      { h: "ex01 — ทริค: setw + ตัด 9+'.'" },
      { p: "จัดตารางด้วย `std::setw(10)` (ชิดขวาอัตโนมัติ) และถ้า field ยาวเกิน 10 ให้ `substr(0,9) + \".\"` — ครบ 10 พอดีและรู้ว่าโดนตัด" },
      { h: "ex02 — Account: ทริคหลัก" },
      { h: "ทริค 1: index = _nbAccounts ก่อน ++ " },
      { p: "ตั้ง `_accountIndex = _nbAccounts` **ก่อน** `_nbAccounts++` → บัญชีแรกได้ index 0, ตัวถัดไป 1, 2... อัตโนมัติ โดยไม่ต้องมีตัวแปรนับ index แยก" },
      { h: "ทริค 2: เก็บ p_amount ก่อนเปลี่ยนค่า" },
      { p: "log แสดงทั้งเงินเก่า (p_amount) และเงินใหม่ (amount) — ต้อง `int p_amount = this->_amount;` **ก่อน** แก้ `_amount` ไม่งั้นค่าเก่าหายไปแล้ว" },
      { h: "ทริค 3: static counter อัปเดต 2 ที่พร้อมกัน" },
      { p: "ทุก deposit/withdrawal อัปเดตทั้ง member ของบัญชีตัวเอง (`_nbDeposits`) และ static รวมของธนาคาร (`_totalNbDeposits`) → ตัวเลขสรุปใน displayAccountsInfos ถึงจะตรง" },
      { h: "ทริค 4: diff โดยตัด timestamp ออก" },
      { p: "timestamp ใน output ของเราต่างจาก log แน่นอน (รันคนละเวลา) — ใช้ `sed` ลบส่วน `[...]` ออกก่อน diff → เทียบเฉพาะเนื้อหาที่ต้องตรงจริง ๆ" },
      { h: "ทริค 5: -std=c++98 บังคับเสมอ" },
      { p: "tests.cpp ใช้ `std::mem_fun_ref` ที่ถูกถอดออกใน C++ มาตรฐานใหม่ — ต้อง compile ด้วย `-std=c++98` ทุกครั้ง (และทั้ง Module นี้ก็บังคับ c++98 อยู่แล้ว)" },
      { h: "ทริค 6: _displayTimestamp เป็น static private" },
      { p: "มันไม่ผูกกับบัญชีตัวใดตัวหนึ่ง (แค่พิมพ์เวลา) จึงเป็น `static` และเป็น `private` เพราะเป็น helper ภายใน — ทุก method เรียกใช้ร่วมกันก่อนพิมพ์บรรทัดของตัวเอง" },
    ],
    eval: [
      { qa: [
        { q: "ex00: ถ้าไม่ส่ง argument ต้องทำอะไร?", a: "เช็ค argc == 1 แล้วพิมพ์ข้อความ default '* LOUD AND UNBEARABLE FEEDBACK NOISE *' (เป๊ะรวม *) — ไม่งั้นวน argv แปลงเป็นพิมพ์ใหญ่ทั้งหมด" },
        { q: "ex00: ทำไม cast std::toupper เป็น (char)?", a: "std::toupper คืนค่าเป็น int (รหัส ASCII) ถ้าไม่ cast เป็น char ก่อนพิมพ์ std::cout อาจพิมพ์เป็นตัวเลข ไม่ใช่ตัวอักษร" },
        { q: "ex01: ทำไมต้องใช้ getline แทน cin >> สำหรับชื่อ?", a: "cin >> หยุดที่ช่องว่าง อ่านได้แค่คำแรก; getline อ่านทั้งบรรทัดรวมช่องว่าง เหมาะกับชื่อ-นามสกุลที่อาจมีเว้นวรรค" },
        { q: "ex01: เก็บได้แค่ 8 ราย เกินแล้วทำไง?", a: "ทับรายที่เก่าที่สุดด้วย ring index (_next = (_next+1) % 8) — เก็บล่าสุด 8 รายเสมอ ไม่ใช้ new/delete" },
        { q: "ex01: คอลัมน์ตารางจัดยังไง?", a: "กว้างคอลัมน์ละ 10 ชิดขวาด้วย std::setw(10) คั่นด้วย |; ถ้า field ยาวเกิน 10 ตัด substr(0,9) แล้วต่อ '.'" },
        { q: "class กับ object ต่างกันยังไง?", a: "class = พิมพ์เขียว (บอกว่ามีข้อมูล/พฤติกรรมอะไร), object = ตัวจริงที่สร้างจาก class; หนึ่ง class สร้างได้หลาย object แต่ละตัวมีข้อมูลของตัวเอง" },
        { q: "static member คืออะไร ทำไมใช้ในโจทย์นี้?", a: "member ที่มีชุดเดียวทุก object แชร์ร่วมกัน (ระดับ class) — ใช้เก็บตัวนับรวมทั้งธนาคาร เช่น _nbAccounts, _totalAmount ที่ทุกบัญชีต้องเห็นค่าเดียวกัน" },
        { q: "ทำไม static member ต้องนิยามในไฟล์ .cpp?", a: "ใน header แค่ประกาศ ยังไม่จองที่จริง; ต้องนิยาม (int Account::_nbAccounts = 0;) ใน.cpp ครั้งเดียวให้ linker มีตัวจริง ไม่งั้น undefined reference" },
        { q: "encapsulation คืออะไร เห็นยังไงใน Account?", a: "การซ่อนข้อมูลภายใน — _amount/_nbAccounts เป็น private แตะตรง ๆ ไม่ได้ ต้องผ่าน method public (checkAmount/getNbAccounts); ป้องกันแก้ค่ามั่วและซ่อน implementation" },
        { q: "constructor/destructor ทำงานเมื่อไหร่?", a: "constructor รันอัตโนมัติตอนสร้าง object (พิมพ์ ;created), destructor รันตอน object ถูกทำลาย/หมด scope (พิมพ์ ;closed); ชื่อตรงกับ class, destructor มี ~ นำหน้า" },
        { q: "const member function คืออะไร?", a: "method ที่ต่อท้าย const สัญญาว่าจะไม่แก้ไขข้อมูล object เช่น checkAmount() const, displayStatus() const; เรียกกับ const object ได้ และ compiler จับ bug ถ้าเผลอแก้" },
        { q: "this pointer คืออะไร?", a: "pointer ซ่อนใน non-static method ชี้ไปยัง object ที่กำลังเรียก method; this->_amount = เงินของ object ตัวที่ทำงานอยู่ ทำให้ method เดียวใช้กับทุก object ได้" },
        { q: "p_amount ใน log มาจากไหน?", a: "เงินก่อนทำรายการ (previous amount) — ต้องเก็บค่า _amount ไว้ก่อนแก้ แล้วพิมพ์ทั้งค่าเก่า (p_amount) และค่าใหม่ (amount)" },
        { q: "ทำไม makeWithdrawal คืน bool?", a: "บอกว่าถอนสำเร็จไหม — ถ้าเงินไม่พอ (withdrawal > _amount) พิมพ์ withdrawal:refused แล้ว return false ไม่หักเงิน; สำเร็จ return true" },
        { q: "ทำไมต้อง -std=c++98?", a: "tests.cpp ใช้ std::mem_fun_ref ที่ถูกถอดใน C++ ใหม่ และ Module นี้บังคับมาตรฐาน c++98; ไม่ใส่จะ compile error" },
        { q: "static member function ต่างจาก method ปกติยังไง?", a: "static method ไม่มี this เรียกได้โดยไม่ต้องมี object (Account::getNbAccounts()) ทำงานกับ static member เท่านั้น; method ปกติผูกกับ object และมี this" },
        { q: "ลำดับ ;closed ใน log อธิบายยังไง?", a: "ตอนจบ main object ใน vector ถูกทำลาย → destructor แต่ละตัวพิมพ์ ;closed เรียงตาม index เป็นบล็อกท้ายสุดของ output" },
      ]},
      { h: "ทดสอบ" },
      { code: String.raw`make
./account > my.log
# เทียบโดยตัด timestamp ([...]) ออก — ควรไม่มีความต่าง
diff <(sed 's/\[[0-9_]*\]//' my.log) \
     <(sed 's/\[[0-9_]*\]//' 19920104_091532.log)`, lang: "bash" },
    ],
  },
},
/* ===================== MINISHELL ===================== */
{
  id: "minishell",
  name: "minishell",
  tag: { th: "เขียน shell แบบ bash ของตัวเอง — lexer, parser, pipe, redirect, builtin, signal ครบวงจร", en: "Write your own bash-like shell — lexer, parser, pipes, redirects, builtins, and signals" },
  accent: "#a29bfe",
  sections: {
    principle: [
      { h: "โจทย์คืออะไร" },
      { p: "เขียน **shell ของตัวเอง** ที่ทำงานเหมือน bash แบบย่อ: รับคำสั่งจากผู้ใช้ → แยกวิเคราะห์ → รันโปรแกรม จัดการ pipe, redirect, ตัวแปร environment, quote, และ signal ให้เหมือน bash จริง" },
      { code: String.raw`minishell$ cat file.txt | grep hello | wc -l > out.txt
minishell$ echo "Home is $HOME"
minishell$ export NAME=42 && env | grep NAME`, cap: "ต้องรองรับ pipe (|), redirect (< > >>), ตัวแปร ($), quote, builtin", lang: "bash" },
      { h: "5 ขั้นตอนหลัก (pipeline ของ shell)" },
      { table: { head: ["ขั้น", "ทำอะไร", "ไฟล์"], rows: [
        ["1. Lexer", "หั่นบรรทัดเป็น token (คำ/ตัวดำเนินการ)", "lexer.c"],
        ["2. Syntax", "ตรวจไวยากรณ์ (| ติดกัน, redirect ลอย)", "syntax.c"],
        ["3. Parser", "จัด token เป็นคำสั่ง + redirect", "parser.c"],
        ["4. Expand", "แทนค่า $VAR, $?, จัดการ quote", "expand.c"],
        ["5. Execute", "fork/pipe/dup2/execve รันจริง", "executor.c"],
      ]}},
      { note: "นี่คือ pipeline แบบ compiler ย่อ ๆ: ข้อความดิบ → token → โครงสร้าง → ลงมือทำ — แนวคิดเดียวกับที่ภาษาโปรแกรมประมวลผลโค้ด" },
      { h: "ความสามารถที่ต้องมี (mandatory)" },
      { ul: [
        "รันคำสั่งจาก PATH (เช่น `ls`, `cat`) ผ่าน execve",
        "**Pipe** `|` ต่อ output ของคำสั่งหนึ่งเป็น input ของอีกคำสั่ง",
        "**Redirect** `<` (input), `>` (output), `>>` (append), `<<` (heredoc)",
        "**Quote**: `'...'` (ดิบทั้งหมด), `\"...\"` (ขยาย $ ได้)",
        "**Expand**: `$VAR` (ค่า env), `$?` (exit status คำสั่งก่อน)",
        "**Builtin 7 ตัว**: echo, cd, pwd, export, unset, env, exit",
        "**Signal**: Ctrl+C, Ctrl+D, Ctrl+\\ ทำตัวเหมือน bash",
      ]},
      { h: "ทำไมโจทย์นี้ใหญ่และยาก" },
      { p: "minishell รวมทุกอย่างที่เรียนมาทั้งปี: parsing, linked list, memory management, process (fork/exec), file descriptor (pipe/dup2), signal — และต้องทำงานร่วมกันโดยไม่ leak, ไม่ค้าง, และ behavior ตรงกับ bash เป๊ะ ๆ. เป็นโปรเจกต์กลุ่มที่ใหญ่ที่สุดของ Common Core" },
    ],
    theory: [
      { p: "หมวดนี้รวมทฤษฎี **การแยกวิเคราะห์ + process + file descriptor** ที่ minishell ต้องใช้" },
      { h: "1) shell ทำงานยังไง (REPL loop)" },
      { p: "shell คือ **Read-Eval-Print Loop**: อ่านบรรทัด → ประมวลผล → แสดงผล → วนใหม่ ไม่จบจนกว่าจะ exit/Ctrl+D" },
      { code: String.raw`while (1) {
    line = readline("minishell$ ");   // อ่าน
    if (!line) break;                  // Ctrl+D = EOF → ออก
    run_line(line);                    // ประมวลผล + รัน
    free(line);
}`, lang: "c" },
      { h: "2) Lexing & Parsing (จากภาษา compiler)" },
      { table: { head: ["ขั้น", "input → output", "ตัวอย่าง"], rows: [
        ["Lexer", "string → token list", "`ls -l | wc` → [WORD ls][WORD -l][PIPE][WORD wc]"],
        ["Parser", "token list → โครงสร้างคำสั่ง", "→ cmd(ls -l) → cmd(wc)"],
      ]}},
      { p: "**Token** = หน่วยความหมายเล็กสุด (คำ หรือ ตัวดำเนินการ). Parser เอา token มาจัดเป็น 'คำสั่ง' แต่ละตัว พร้อม argument และ redirect" },
      { h: "3) Process: fork / execve / wait" },
      { table: { head: ["syscall", "ทำอะไร"], rows: [
        ["`fork()`", "โคลน process เป็น 2 (parent + child)"],
        ["`execve()`", "แทนที่ตัวเองด้วยโปรแกรมใหม่ (child)"],
        ["`waitpid()`", "parent รอ child จบ + เก็บ exit status"],
      ]}},
      { code: String.raw`pid = fork();
if (pid == 0) {            // child
    execve(path, argv, envp);   // กลายเป็น ls/cat/...
} else {                   // parent
    waitpid(pid, &status, 0);   // รอลูกจบ
}`, cap: "fork สร้างลูก → ลูก execve เป็นโปรแกรมจริง → พ่อรอ", lang: "c" },
      { h: "4) File descriptor & dup2 (หัวใจ pipe/redirect)" },
      { p: "ทุก process มี fd มาตรฐาน: **0=stdin, 1=stdout, 2=stderr**. `dup2(a, b)` ทำให้ fd `b` ชี้ไปที่เดียวกับ `a` — เป็นกลไกเปลี่ยนทาง input/output" },
      { code: String.raw`int fd = open("out.txt", O_WRONLY|O_CREAT|O_TRUNC, 0644);
dup2(fd, STDOUT_FILENO);   // ทุกอย่างที่เขียนออก stdout (fd 1)
close(fd);                  // จะไปลงไฟล์แทน
/* ... execve ... */`, cap: "redirect > = dup2(file_fd, STDOUT) → สิ่งที่เขียนออก stdout ไปลงไฟล์แทน", lang: "c" },
      { h: "5) Pipe — ท่อเชื่อม 2 process" },
      { p: "`pipe(fds)` สร้างท่อ: `fds[0]` = ปลายอ่าน, `fds[1]` = ปลายเขียน. สิ่งที่เขียนเข้า fds[1] อ่านออกได้ที่ fds[0] → ใช้ต่อ stdout ของคำสั่งซ้ายเข้า stdin ของคำสั่งขวา" },
      { code: String.raw`cmd1 | cmd2:
  pipe(fds)
  cmd1: dup2(fds[1], STDOUT)  → เขียนออกเข้า ท่อ
  cmd2: dup2(fds[0], STDIN)   → อ่าน input จาก ท่อ`, cap: "ปิด fd ที่ไม่ใช้ให้หมด ไม่งั้น cmd2 จะรอ EOF ไม่มา= ค้าง", lang: "txt" },
      { h: "6) Environment variables" },
      { p: "ตัวแปรสภาพแวดล้อม (เช่น `PATH`, `HOME`) ส่งต่อจาก parent ถึง child ผ่าน `envp`. minishell เก็บเป็น linked list (key=value) เพื่อ export/unset ได้ แล้วแปลงกลับเป็น array ตอน execve" },
      { h: "🔬 เจาะลึก A: Lexer เป็น State Machine — quote เปลี่ยนกฎการหั่นยังไง" },
      { p: "**ภาพในหัว:** หั่นบรรทัดเป็นคำดูเหมือน 'แค่ตัดที่ช่องว่าง' แต่พอมี quote กฎเปลี่ยนทันที — `'a b'` คือ **คำเดียว** (ช่องว่างข้างในไม่ตัด). วิธีคิดที่ถูกคือมองเป็น **finite state machine**: เครื่องอยู่ในสถานะหนึ่ง อักขระที่เจอเปลี่ยนสถานะ/ตัดสินว่าจะตัดคำไหม" },
      { code: String.raw`3 สถานะของ lexer:
  NORMAL  : ช่องว่าง = ตัดคำ ; | < > = operator ; ' " = เข้าโหมด quote
  S_QUOTE : (หลังเจอ ') ทุกอย่าง literal จนเจอ ' อีกตัว — $ ไม่ขยาย
  D_QUOTE : (หลังเจอ ") literal ยกเว้น $ (ยังขยาย) จนเจอ " อีกตัว

transition:
  NORMAL --'--> S_QUOTE --'--> NORMAL
  NORMAL --"--> D_QUOTE --"--> NORMAL
  ภายใน quote: ช่องว่าง "ไม่ตัดคำ"`, cap: "quote = เปลี่ยน state ชั่วคราว ทำให้ช่องว่างข้างในไม่ถูกใช้ตัดคำ", lang: "txt" },
      { p: "**ไล่ทีละอักขระ** — tokenize `echo \"a b\"'cd'`:" },
      { code: String.raw`input:  e c h o ␣ " a ␣ b " ' c d '
state:  N N N N N D D D D N S S S N
                  │         │ │     │
                เข้า D     ออก D  เข้า/ออก S

  'echo'                  → WORD "echo"   (ตัดที่ ␣)
  "a b" ติดกับ 'cd'       → WORD "a bcd"  (ไม่มี ␣ คั่น = คำเดียว!)
→ argv = ["echo", "a bcd"]  (ไม่ใช่ 3 คำ)`, cap: "หัวใจที่หลายคนพลาด: token ที่ติดกัน (ไม่มีช่องว่างคั่น) = คำเดียว แม้ quote คนละชนิด", lang: "txt" },
      { p: "**ลำดับสำคัญ: ขยาย $ ก่อน แล้วค่อยลบ quote (quote removal):** `$?` ใน double-quote ต้องขยาย แต่ใน single-quote ห้ามขยาย — จึงต้องจำว่าอักขระเคยอยู่ใน quote ชนิดไหน 'ระหว่าง' ขั้น lex/expand แล้วค่อยลบ quote ทิ้งเป็นขั้นสุดท้าย. ถ้าลบ quote ก่อน จะแยกไม่ออกว่า `$` ตัวไหนต้องขยาย" },
      { note: "ลองพิสูจน์เอง: `echo '$HOME'` ต้องได้ `$HOME` ตรง ๆ แต่ `echo \"$HOME\"` ต้องได้ path จริง — เพราะตัวแรกอยู่สถานะ S_QUOTE ที่ `$` ไม่ขยาย ส่วนตัวหลังอยู่ D_QUOTE ที่ `$` ขยาย" },
      { qa: [
        { q: "ทำไมต้องลบ quote 'หลัง' ขยาย $ ไม่ใช่ก่อน?", a: "เพราะกฎการขยาย `$` ขึ้นกับว่าตอนนั้นอยู่ใน quote ชนิดไหน. ถ้าลบ quote ทิ้งก่อน จะไม่เหลือข้อมูลว่า `$x` อยู่ใน single (ห้ามขยาย) หรือ double (ขยาย) → ขยายผิด" },
        { q: "`a'b'c` ได้กี่ token?", a: "1 token = `abc` เพราะไม่มีช่องว่างคั่นเลย, quote แค่เปลี่ยน state ชั่วคราว ไม่ได้ตัดคำ" },
        { q: "quote ไม่ปิด (`echo \"hi`) ควรทำยังไง?", a: "bash จะขึ้น prompt รอ quote ปิด (ต่อบรรทัด); minishell ส่วนใหญ่จัดเป็น syntax error คืน exit 2 ก็ผ่านได้ (ตามที่ subject/peer ตกลง)" },
      ]},

      { h: "🔬 เจาะลึก B: fd table หลัง fork + ลำดับ dup2/close ใน pipeline หลายขั้น" },
      { p: "**ภาพในหัว:** ตอน fork ลูกได้ 'สำเนาตาราง fd' ของพ่อมาทั้งใบ — fd เลขเดียวกันชี้ของเดียวกัน. การต่อ `a | b | c` คือการ 'เดินสาย' ว่า stdout ของ a → เข้า b, stdout ของ b → เข้า c ด้วย dup2 แล้วต้อง 'ปิดปลายที่ไม่ใช้' ให้เกลี้ยง" },
      { p: "**กลไก rolling pipe:** วน fork ทีละคำสั่ง เก็บ 'fd อ่านของท่อก่อนหน้า' ไว้เป็น stdin ของคำสั่งถัดไป:" },
      { code: String.raw`exec_pipeline(cmds):
  in = STDIN                 // คำสั่งแรกอ่านจาก stdin จริง
  while (มี cmd):
     ถ้ามีคำสั่งถัดไป: pipe(fds)        // fds[0]=read, fds[1]=write
     fork:
       child: dup2(in, STDIN)            // อ่านจากท่อก่อนหน้า/stdin
              ถ้ามีถัดไป: dup2(fds[1], STDOUT)  // เขียนเข้าท่อใหม่
              close(in, fds[0], fds[1]) ให้หมด → execve
     parent: close(in); close(fds[1])    // ★ ปิดทันที!
             in = fds[0]                 // ท่ออ่านนี้ = stdin ของรอบถัดไป`, cap: "พ่อปิด write-end ทันทีหลัง fork — ปลายเดียวที่เหลือเปิดคือใน child ที่ใช้จริง", lang: "c" },
      { p: "**ไล่ fd table ทีละขั้น** — `a | b | c` (เลข fd สมมติ):" },
      { code: String.raw`pipe1=(3,4)   pipe2=(5,6)

fork a: child  stdout→4 (pipe1 write) ; close 3,5,6 เกิน → exec a
        parent close 4 ; in=3
fork b: child  stdin→3 (pipe1 read), stdout→6 (pipe2 write) ; close → exec b
        parent close 3,6 ; in=5
c:      child  stdin→5 (pipe2 read), stdout→stdout จริง ; close → exec c
        parent close 5

→ ทุก write-end (4,6) ถูกปิดในพ่อทันที → เหลือเปิดแค่ใน child ที่ใช้
→ a จบ → pipe1 write ปิดหมด → b เห็น EOF ; b จบ → c เห็น EOF`, cap: "ปิดในพ่อทันทีทุกรอบ = กัน fork รอบถัดไปไม่ให้สืบทอด write-end เก่าติดไป", lang: "txt" },
      { note: "ลองพิสูจน์เอง: ถ้าพ่อ 'เลื่อน' การ close ไปทำทีเดียวตอนจบ (แทนที่จะปิดทันทีหลัง fork) → ตอน fork b พ่อยังถือ write-end 4 อยู่ → b ได้สำเนา fd 4 ติดไปด้วย → write-end ของ pipe1 ไม่มีวันเหลือ 0 → b รอ EOF ไม่มา = ค้าง. นี่คือเหตุผลที่ต้อง close ในพ่อ 'ทันที' ทุกรอบ" },
      { qa: [
        { q: "ทำไมต้อง dup2 'ก่อน' close เสมอ?", a: "dup2(old,new) ก๊อป old ไป new — ถ้า close(old) ก่อนจะไม่มีอะไรให้ก๊อป. ลำดับถูก: dup2(fds[1],STDOUT) แล้วค่อย close(fds[1])" },
        { q: "พ่อต้อง close write-end ทันทีหลัง fork ทำไม?", a: "เพราะทุก fork ลูกได้สำเนา write-end ติดไป ยิ่ง fork มากยิ่งมีสำเนาค้าง. พ่อปิดของตัวเองทันที + child ปิดของที่ไม่ใช้ → refcount ของ write-end ลดถึง 0 ได้ → EOF เกิด" },
        { q: "`cat | ls` ทำไม ls ออกผลทันทีไม่รอ cat?", a: "ls ไม่อ่าน stdin จึงไม่รอ EOF — รันแล้วจบเลย; ส่วน cat รออ่าน stdin จาก terminal ต่อ (จนกด Ctrl-D) เป็น behavior ที่ถูกของ bash เหมือนกัน" },
      ]},

      { h: "🔬 เจาะลึก C: ทำไม pipe ค้าง — pipe write-end reference counting" },
      { p: "**ภาพในหัว:** ปลายอ่านของ pipe จะได้สัญญาณ 'จบ' (EOF, read คืน 0) **ก็ต่อเมื่อปลายเขียนทุกสำเนาถูกปิดหมด** ไม่ใช่แค่ปลายเขียนหลัก. kernel นับว่ามีกี่ fd ที่ยังเปิด write-end อยู่ (reference count)" },
      { p: "**กลไก:** ทุกครั้งที่ fork ตาราง fd ถูกก๊อป → write-end มีสำเนาเพิ่ม. EOF เกิดเมื่อ refcount = 0 เท่านั้น:" },
      { code: String.raw`refcount ของ write-end (pipe เดียว ใน cmd1 | cmd2):

  pipe(fds)                       write-end refcount = 1 (พ่อ)
  fork cmd1                       → 2 (พ่อ + cmd1)
  fork cmd2                       → 3 (พ่อ + cmd1 + cmd2)
  ────────────────────────────────────────────
  cmd1 dup2(fds[1],STDOUT)+exec   (cmd1 ถือผ่าน STDOUT)
  cmd2 close(fds[1])              → 2
  พ่อ close(fds[1])               → 1   ★ ถ้าลืมตรงนี้ = ค้างตรงนี้
  cmd1 จบ → ปิด stdout            → 0   → EOF ส่งถึง cmd2 ✓

ถ้าพ่อ "ลืม" close(fds[1]): refcount ค้างที่ 1 ตลอด
  → cmd2 อ่าน stdin รอ EOF ที่ไม่มีวันมา → ค้าง`, cap: "EOF = ฟังก์ชันของ refcount: ต้อง 0 เท่านั้น — ลืมปิดที่เดียว refcount ไม่ถึง 0 = ค้าง", lang: "txt" },
      { p: "**heredoc ก็ใช้หลักเดียวกัน:** `<< EOF` คือ pipe ที่พ่อเขียนบรรทัด heredoc ลง write-end แล้ว **ปิด write-end** เพื่อส่ง EOF ให้คำสั่งอ่านจบ — ถ้าไม่ปิด คำสั่งจะรอ input ต่อไม่จบ" },
      { note: "ลองพิสูจน์เอง: เขียน `cat | cat | cat` แล้วจงใจคอมเมนต์ close(fds[1]) ของพ่อออก 1 บรรทัด → รันแล้วค้าง. เปิด `ls -l /proc/<pid>/fd` ดูจะเห็น write-end ค้างเปิดอยู่ตามทฤษฎี refcount" },
      { qa: [
        { q: "ทำไมแค่ปิด write-end หลักไม่พอ ต้องปิดทุกสำเนา?", a: "เพราะ EOF อิงจาก refcount = จำนวนสำเนา write-end ที่ยังเปิด. เหลือเปิดสำเนาเดียว (เช่นพ่อลืมปิด) refcount ≠ 0 → ปลายอ่านไม่ได้ EOF → ค้าง" },
        { q: "อ่าน read-end ตอน write-end ยังเปิดและไม่มีข้อมูลจะได้อะไร?", a: "read 'บล็อก' รอ (ไม่ใช่ EOF). EOF (read คืน 0) เกิดเฉพาะตอน write-end ปิดหมดเท่านั้น" },
        { q: "เขียนเข้า pipe ที่ปลายอ่านปิดหมดแล้วเกิดอะไร?", a: "ได้ SIGPIPE (ปกติฆ่า process) หรือ write คืน -1 errno=EPIPE — เป็นเหตุที่ `yes | head` ทำให้ yes ตายเองหลัง head ปิด" },
      ]},

      { h: "🔬 เจาะลึก D: Signal (interactive + heredoc) & การส่งต่อ $? (exit status)" },
      { p: "**ภาพในหัว:** กด Ctrl-C ตอนอยู่ที่ prompt ว่าง ๆ ต้อง 'ขึ้น prompt ใหม่บรรทัดถัดไป' (ไม่ออกจาก shell) แต่กด Ctrl-C ตอนคำสั่งกำลังรัน (เช่น `cat` รออยู่) ต้อง 'ฆ่าคำสั่งนั้น' แล้วกลับมา prompt. behavior ต่างกันตามบริบท" },
      { code: String.raw`สถานการณ์ของ SIGINT (Ctrl-C):
  ที่ prompt ว่าง  → handler: พิมพ์ \n, rl_replace_line(""),
                     rl_on_new_line(), rl_redisplay() → prompt ใหม่ ; $?=130
  ระหว่างคำสั่งรัน → child ตั้ง signal เป็น DEFAULT → Ctrl-C ฆ่า child
                     (ไม่ใช่ shell) ; shell เก็บ $? = 128 + SIGINT(2) = 130
  ใน heredoc       → Ctrl-C ยกเลิก heredoc, คืน prompt ; $? = 130`, cap: "shell ที่ prompt 'จับ' SIGINT แต่ child 'ปล่อยให้ default' → Ctrl-C โดนคำสั่ง ไม่โดน shell", lang: "txt" },
      { p: "**ทำไมต้องมี global ตัวเดียว (`g_signal`):** signal handler ห้ามทำงานหนัก/ห้ามแตะ struct ใหญ่ (async-signal-safety). pattern ที่ปลอดภัยคือ handler แค่ 'บันทึกหมายเลข signal' ลง `volatile sig_atomic_t g_signal` แล้วให้ main loop อ่านทีหลังเพื่อตั้ง `$?` — นี่คือ global เดียวที่ subject อนุญาต" },
      { p: "**$? propagation — ค่าตามมาตรฐาน:**" },
      { code: String.raw`exit code มาตรฐาน (เก็บใน sh->exit_status = $?):
  0          สำเร็จ
  1          error ทั่วไป (เช่น builtin ล้มเหลว)
  2          misuse / syntax error
  126        เจอไฟล์แต่รันไม่ได้ (no exec permission)
  127        ไม่พบคำสั่ง (command not found)
  128 + n    ถูกฆ่าด้วย signal หมายเลข n

worked example:
  ls /nope         → $? = 2    (ls error)
  ./no_such        → $? = 127  (not found)
  cat แล้ว Ctrl-C  → $? = 130  (128 + SIGINT 2)
  คำสั่ง segfault   → $? = 139  (128 + SIGSEGV 11)`, cap: "อ่าน exit status: WIFEXITED→WEXITSTATUS ; WIFSIGNALED→128+WTERMSIG", lang: "txt" },
      { note: "ลองพิสูจน์เอง: ใน bash จริงพิมพ์ `sleep 5` แล้วกด Ctrl-C ตามด้วย `echo $?` จะได้ 130. แล้วลอง `ls /nope; echo $?` ได้ 2 — minishell ต้องให้ค่าตรงกันเป๊ะ" },
      { qa: [
        { q: "ทำไม child ต้องตั้ง signal กลับเป็น default ก่อน execve?", a: "ตอน prompt shell จับ SIGINT/SIGQUIT ไว้ (ไม่ให้ตัวเองตาย). ถ้า child สืบทอด handler นั้นไป Ctrl-C จะไม่ฆ่าคำสั่ง — ต้อง reset เป็น SIG_DFL ใน child เพื่อให้ Ctrl-C ฆ่าคำสั่งได้ตามปกติ" },
        { q: "ทำไม handler เก็บแค่หมายเลข signal ไม่ทำงานอื่น?", a: "async-signal-safety: handler แทรกได้ทุกจังหวะ ถ้าไปแตะ malloc/struct/print อาจพังแบบสุ่ม. เก็บเลขลง sig_atomic_t แล้วให้ main loop จัดการทีหลังจึงปลอดภัย" },
        { q: "`$?` หลัง `cat | ls` เอาค่าจากคำสั่งไหน?", a: "จากคำสั่ง 'ขวาสุด' (ls) เสมอ — bash เก็บ exit ของคำสั่งสุดท้ายในไปป์ไลน์เป็น $?" },
      ]},
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Beej's Guide to Unix IPC", url: "https://beej.us/guide/bgipc/", note: "pipe / fork / dup2 ครบ อ่านสนุก" },
        { label: "man7 — pipe(2)", url: "https://man7.org/linux/man-pages/man2/pipe.2.html", note: "กลไก pipe + เรื่อง EOF / การปิด fd" },
        { label: "man7 — execve(2)", url: "https://man7.org/linux/man-pages/man2/execve.2.html", note: "การแทนที่ image ของ process" },
        { label: "Bash Reference Manual — GNU", url: "https://www.gnu.org/software/bash/manual/bash.html", note: "อ้างอิง behavior ของ bash ที่ต้องเลียนแบบ" },
      ]},
    ],
    foundations: [
      { p: "หมวดนี้เจาะ **struct และ data structure** ที่ minishell ใช้ — ส่วนใหญ่เป็น linked list" },
      { h: "struct หลัก 5 ตัว" },
      { code: String.raw`typedef struct s_token {        /* ผลจาก lexer */
    char            *value;
    t_toktype       type;       /* WORD / PIPE / REDIR_IN / ... */
    struct s_token  *next;
} t_token;

typedef struct s_redir {        /* redirect 1 อัน */
    t_toktype       type;       /* < > >> << */
    char            *target;    /* ชื่อไฟล์ หรือ delimiter */
    int             quoted;     /* heredoc delimiter ถูก quote ไหม */
    int             hdoc_fd;
    struct s_redir  *next;
} t_redir;

typedef struct s_cmd {          /* 1 คำสั่งในไปป์ไลน์ */
    char            **argv;     /* ["ls","-l",NULL] */
    t_redir         *redirs;    /* redirect ของคำสั่งนี้ */
    struct s_cmd    *next;      /* คำสั่งถัดไปหลัง | */
} t_cmd;

typedef struct s_env {          /* ตัวแปร env 1 ตัว */
    char            *key, *value;
    int             exported;
    struct s_env    *next;
} t_env;

typedef struct s_shell {        /* สถานะกลางทั้ง shell */
    t_env   *env;
    int     exit_status;        /* = $? */
    t_token *tokens;
    t_cmd   *cmds;
    char    *line;
} t_shell;`, cap: "ทุกอย่างเป็น linked list เพราะจำนวนไม่รู้ล่วงหน้า (token/cmd/env กี่ตัวก็ได้)", lang: "c" },
      { h: "ทำไม token type เป็น enum" },
      { code: String.raw`typedef enum e_toktype {
    T_WORD, T_PIPE, T_REDIR_IN, T_REDIR_OUT, T_APPEND, T_HEREDOC
} t_toktype;`, cap: "enum ทำให้โค้ดอ่านง่าย (T_PIPE ชัดกว่าเลข 1) และ compiler ช่วยเช็ค", lang: "c" },
      { h: "การไหลของโครงสร้าง: string → cmd list" },
      { code: String.raw`"ls -l | wc -l > out"
   │ lexer
   ▼
[WORD:ls][WORD:-l][PIPE][WORD:wc][WORD:-l][REDIR_OUT][WORD:out]
   │ parser
   ▼
cmd1: argv=[ls,-l]    redirs=NULL
   └─next─►
cmd2: argv=[wc,-l]    redirs=[> out]`, cap: "PIPE แยกเป็นคนละ cmd; REDIR ผูกเข้า redirs ของ cmd ปัจจุบัน", lang: "txt" },
      { h: "exit_status = $? ผูกกับทั้งระบบ" },
      { p: "`sh->exit_status` คือค่า `$?` — เก็บ exit code ของคำสั่งล่าสุด ใช้ทั้งใน expand (`echo $?`) และ return จาก main. convention: 0=สำเร็จ, 1-2=error, 126=ไม่มีสิทธิ์รัน, 127=ไม่พบคำสั่ง, 128+n=ถูก signal n" },
      { h: "ทำไม env เป็น linked list ไม่ใช่ array" },
      { p: "ต้อง add (export), remove (unset), modify ตัวแปรได้ตลอด → linked list จัดการง่ายกว่า array ที่ต้อง realloc. ตอน execve ค่อยแปลงเป็น `char **` ด้วย `env_to_array`" },
    ],
    architecture: [
      { h: "กลุ่มไฟล์ (33 ไฟล์ แบ่งตามหน้าที่)" },
      { table: { head: ["กลุ่ม", "ไฟล์", "หน้าที่"], rows: [
        ["loop", "main.c, init.c", "REPL loop, ตั้งค่าเริ่มต้น"],
        ["lexer", "lexer.c, lexer_utils.c", "หั่น token + quote"],
        ["syntax", "syntax.c", "ตรวจไวยากรณ์"],
        ["parser", "parser.c, parser_redir.c, parser_utils.c", "token → cmd list"],
        ["expand", "expand*.c", "ขยาย $VAR/$?, quote removal"],
        ["executor", "executor.c, exec_pipe.c, exec_utils.c", "fork/exec/pipe/wait"],
        ["redirect", "redirect.c, heredoc*.c", "< > >> <<"],
        ["builtin", "builtin_*.c", "echo/cd/pwd/export/unset/env/exit"],
        ["env", "env*.c, path.c", "จัดการ env + หา PATH"],
        ["signal", "signals.c", "Ctrl+C / Ctrl+\\"],
        ["free", "free.c, utils.c", "คืน memory"],
      ]}},
      { h: "ลำดับการทำงานต่อ 1 บรรทัด (run_line)" },
      { code: String.raw`run_line(sh, line)
  └─ parse_line(sh):
       ├─ lexer()         string → tokens
       ├─ check_syntax()  ผิดไวยากรณ์? → exit 2
       ├─ parser()        tokens → cmds
       └─ expand_cmds()   ขยาย $ + quote
  └─ execute(sh, cmds):
       ├─ preprocess_heredocs()
       ├─ 1 builtin เดี่ยว → exec_in_parent (ไม่ fork!)
       ├─ 1 คำสั่งทั่วไป   → exec_single (fork)
       └─ หลายคำสั่ง      → exec_pipeline (fork ทุกตัว + pipe)
  └─ reset_shell()  เคลียร์ tokens/cmds ของบรรทัดนี้`, lang: "txt" },
      { note: "จุดสำคัญ: builtin เดี่ยว (เช่น `cd`, `export`) ต้องรันใน **parent** ไม่ใช่ fork — เพราะถ้า fork แล้ว cd ใน child การเปลี่ยน directory จะหายไปเมื่อ child ตาย (parent ไม่ได้ย้ายตาม)" },
      { h: "global ตัวเดียวที่อนุญาต: g_signal" },
      { code: String.raw`extern volatile sig_atomic_t g_signal;`, cap: "subject อนุญาต global ได้แค่ 1 ตัว สำหรับเก็บหมายเลข signal เท่านั้น — ห้ามเก็บข้อมูลอื่น", lang: "c" },
    ],
    dataflow: [
      { p: "ไล่ฟังก์ชันแกนหลักทีละตัว" },
      { h: "shell_loop() — หัวใจ REPL" },
      { code: String.raw`void shell_loop(t_shell *sh)
{
    tty = isatty(STDIN_FILENO);          // interactive ไหม
    while (1) {
        setup_signals();                  // ตั้ง Ctrl+C handler
        line = read_input(tty);           // readline หรือ gnl
        if (g_signal == SIGINT) {
            sh->exit_status = 130;        // Ctrl+C → $?=130
            g_signal = 0;
        }
        if (!line) break;                 // Ctrl+D → ออก
        if (tty && *line) add_history(line);
        run_line(sh, line);
        free(line);
    }
}`, cap: "ใช้ readline (interactive) หรือ get_next_line (รับจาก pipe/ไฟล์)", lang: "c" },
      { h: "lexer() — หั่นบรรทัดเป็น token" },
      { code: String.raw`t_token *lexer(char *line, int *err)
{
    while (line[i]) {
        i = skip_spaces(line, i);
        if (is_metachar(line[i]))         // | < >
            i = read_op(line, i, &lst);
        else
            i = read_word(line, i, &lst); // คำ (รวม quote)
        if (i < 0) { *err = 1; ... }      // quote ไม่ปิด
    }
    return (lst);
}`, cap: "วนทั้งบรรทัด: ถ้าเจอ meta อ่านเป็น operator, ไม่งั้นอ่านเป็นคำ; quote ไม่ปิด = error", lang: "c" },
      { h: "execute() — เลือกวิธีรัน" },
      { code: String.raw`int execute(t_shell *sh, t_cmd *cmds)
{
    if (preprocess_heredocs(sh, cmds))   // อ่าน heredoc ก่อน
        return (130);
    n = cmd_count(cmds);
    if (n == 1 && (!argv[0] || is_builtin(argv[0])))
        return (exec_in_parent(sh, cmds));  // builtin เดี่ยว
    if (n == 1)
        return (exec_single(sh, cmds));     // คำสั่งเดี่ยว
    return (exec_pipeline(sh, cmds, n));    // ไปป์ไลน์
}`, cap: "3 ทาง: builtin ใน parent, คำสั่งเดี่ยว fork, หลายคำสั่ง pipeline", lang: "c" },
      { h: "child_process() — สิ่งที่ลูกทำหลัง fork" },
      { code: String.raw`void child_process(t_shell *sh, t_cmd *cmd, int in, int out)
{
    signals_default();                    // ลูกรับ signal ปกติ
    if (in != STDIN_FILENO)  { dup2(in, STDIN);  close(in); }
    if (out != STDOUT_FILENO){ dup2(out, STDOUT); close(out); }
    if (apply_redirs(sh, cmd->redirs)) clean_exit(sh, 1);
    if (is_builtin(cmd->argv[0]))
        clean_exit(sh, run_builtin(sh, cmd));
    exec_external(sh, cmd);               // execve
}`, cap: "ต่อ in/out จาก pipe → ใช้ redirect (ทับ pipe ได้) → รัน builtin หรือ execve", lang: "c" },
      { h: "exec_pipeline() — ต่อหลายคำสั่งด้วย pipe" },
      { code: String.raw`int exec_pipeline(t_shell *sh, t_cmd *cmds, int n)
{
    in = STDIN_FILENO;
    signals_ignore();                     // parent ไม่สน Ctrl+C
    while (cmds) {
        if (cmds->next) pipe(fds);        // มีคำสั่งถัดไป → สร้างท่อ
        pid = fork();
        if (pid == 0) pipe_child(sh, cmds, in, fds);
        if (in != STDIN_FILENO) close(in);
        if (cmds->next) { close(fds[1]); in = fds[0]; }
        cmds = cmds->next;
    }
    return (wait_all(pid, n));            // รอทุกตัว, เก็บ status ตัวสุดท้าย
}`, cap: "วน fork ทุกคำสั่ง ต่อ output→input ด้วย pipe; ปิด fd ที่ไม่ใช้ทันทีกันค้าง", lang: "c" },
      { h: "exec_external() — หา PATH แล้ว execve" },
      { code: String.raw`static void exec_external(t_shell *sh, t_cmd *cmd)
{
    path = find_path(sh, cmd->argv[0]);   // ค้นใน $PATH
    if (!path) clean_exit(sh, 127);       // ไม่พบคำสั่ง
    envp = env_to_array(sh->env);         // list → array
    execve(path, cmd->argv, envp);
    /* ถ้ามาถึงตรงนี้ = execve fail */
    if (errno == EACCES || errno == EISDIR) clean_exit(sh, 126);
    clean_exit(sh, 127);
}`, cap: "127 = ไม่พบคำสั่ง, 126 = พบแต่รันไม่ได้ (สิทธิ์/เป็น directory)", lang: "c" },
      { h: "handle_sigint() — Ctrl+C เหมือน bash" },
      { code: String.raw`static void handle_sigint(int sig)
{
    g_signal = sig;
    write(STDOUT_FILENO, "\n", 1);
    rl_on_new_line();                     // readline ขึ้นบรรทัดใหม่
    rl_replace_line("", 0);               // ล้างบรรทัดที่พิมพ์ค้าง
    rl_redisplay();                       // แสดง prompt ใหม่
}`, cap: "Ctrl+C: ขึ้นบรรทัดใหม่ + prompt สด ๆ โดยไม่ฆ่า shell (ต่างจากค่า default)", lang: "c" },
      { h: "wait_all() — เก็บ exit status ตัวสุดท้าย" },
      { code: String.raw`/* status_code แปลง raw status เป็น exit code แบบ bash */
if (WIFSIGNALED(status)) return (128 + WTERMSIG(status));
return (WEXITSTATUS(status));`, cap: "$? ของไปป์ไลน์ = exit ของคำสั่งขวาสุด; ถ้าถูก signal → 128+เลข signal", lang: "c" },
    ],
    implementation: [
      { h: "ลำดับการลงมือเขียน (แนะนำ)" },
      { ul: [
        "1. REPL loop + readline + history (ยังไม่ทำอะไรกับ input)",
        "2. lexer — หั่น token รวมจัดการ quote ' และ \"",
        "3. parser — token → cmd list (ยังไม่มี pipe/redirect)",
        "4. executor คำสั่งเดี่ยว: fork + find_path + execve + wait",
        "5. builtin 7 ตัว (cd/export/unset/exit ต้องรันใน parent)",
        "6. expand $VAR / $? + quote removal",
        "7. redirect < > >> + pipe (หลายคำสั่ง)",
        "8. heredoc <<",
        "9. signal: Ctrl+C / Ctrl+\\ / Ctrl+D ให้ตรง bash",
        "10. ไล่ leak ด้วย valgrind + diff behavior กับ bash จริง",
      ]},
      { h: "บั๊กยอดฮิตและวิธีกัน" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้"], rows: [
        ["ไปป์ค้าง (wc ไม่จบ)", "ไม่ปิด fd ปลายเขียน", "close fds ที่ไม่ใช้ทุกอันหลัง fork"],
        ["cd ไม่เปลี่ยน dir จริง", "รัน cd ใน child (fork)", "builtin เดี่ยวรันใน parent"],
        ["$? ผิด", "ไม่อัปเดต exit_status / ใช้ status ดิบ", "แปลงผ่าน WEXITSTATUS/WIFSIGNALED"],
        ["quote หลุด", "ไม่ลบ quote ตอน expand", "quote removal หลังขยายตัวแปร"],
        ["heredoc ขยาย $ ทั้งที่ delimiter ถูก quote", "ไม่เช็ค quoted flag", "ถ้า delimiter quote → ไม่ขยาย"],
        ["Ctrl+C ฆ่า shell", "ใช้ signal default", "ตั้ง handler ที่แค่รีเฟรช prompt"],
      ]}},
      { h: "build / รัน" },
      { code: String.raw`make
./minishell
minishell$ echo "hi $USER" | cat -e
minishell$ ls -l | grep .c | wc -l
minishell$ cat << EOF
make bonus && ./minishell   # && || () wildcard *`, lang: "bash" },
      { note: "ต้อง link readline: -lreadline (บางเครื่องต้อง -L path ของ readline ด้วย)" },
    ],
    tricks: [
      { h: "ทริค 1: builtin เดี่ยวรันใน parent ไม่ fork" },
      { p: "cd/export/unset/exit ต้องเปลี่ยนสถานะของ shell เอง (directory, env, ออกโปรแกรม) — ถ้า fork แล้วรันใน child การเปลี่ยนจะหายเมื่อ child ตาย. โค้ดเช็ค `n==1 && is_builtin` → `exec_in_parent` (save/restore fd ด้วย dup)" },
      { h: "ทริค 2: ปิด fd ทุกอันทันทีหลัง fork" },
      { p: "ใน pipeline หลัง fork แต่ละรอบ: parent ปิด `in` เก่าและ `fds[1]` ทันที — เหลือเฉพาะปลายที่ใช้จริง → EOF ส่งถึงคำสั่งถัดไปถูกเวลา ไม่ค้าง. กฎนี้คือหัวใจที่ทำให้ไปป์ไม่ deadlock" },
      { h: "ทริค 3: 3 โหมด signal ตามบริบท" },
      { table: { head: ["โหมด", "เมื่อไหร่"], rows: [
        ["setup_signals", "ตอนรอ prompt (Ctrl+C รีเฟรช, Ctrl+\\ เมิน)"],
        ["signals_ignore", "parent ระหว่างรอ child (ไม่สน Ctrl+C)"],
        ["signals_default", "ใน child ก่อน exec (รับ signal ปกติ)"],
      ]}},
      { h: "ทริค 4: g_signal เก็บแค่หมายเลข signal" },
      { p: "subject ให้ global ได้ตัวเดียว — เก็บแค่ 'signal อะไรเพิ่งเกิด' (`volatile sig_atomic_t`) ไม่เก็บ struct/ข้อมูลอื่น. handler ทำงานน้อยที่สุด (set ค่า + รีเฟรช readline) เพื่อความปลอดภัยใน async context" },
      { h: "ทริค 5: env เป็น list แปลงเป็น array ตอน execve" },
      { p: "เก็บ env เป็น linked list (export/unset ง่าย) แต่ execve ต้องการ `char **` — แปลงด้วย `env_to_array` เฉพาะตอนจะ exec แล้ว free ทิ้ง. แยกหน้าที่ชัดเจน" },
      { h: "ทริค 6: heredoc preprocess ก่อน fork" },
      { p: "อ่าน heredoc (`<<`) ทั้งหมดให้เสร็จก่อนเริ่มรันคำสั่ง — เก็บเนื้อหาลง fd/ไฟล์ชั่วคราว เพื่อให้ Ctrl+C ระหว่างพิมพ์ heredoc ยกเลิกได้สะอาด (return 130) โดยไม่กระทบ pipeline" },
      { h: "ทริค 7: exit code ตาม convention ของ bash" },
      { p: "127=ไม่พบคำสั่ง, 126=รันไม่ได้, 128+n=ถูก signal n, 130=Ctrl+C, 2=syntax error — ทำให้ `$?` ตรงกับ bash ทุกกรณี (กรรมการชอบเทสตรงนี้)" },
    ],
    eval: [
      { qa: [
        { q: "shell ประมวลผลคำสั่ง 1 บรรทัดยังไง?", a: "lexer (string→token) → check syntax → parser (token→cmd list) → expand ($VAR/$?/quote) → execute (fork/pipe/dup2/execve); เหมือน pipeline ของ compiler ย่อ" },
        { q: "fork กับ execve ต่างกันยังไง?", a: "fork โคลน process เป็น 2 (parent+child เหมือนกัน), execve แทนที่ image ของ process ด้วยโปรแกรมใหม่; ปกติ fork แล้วให้ child execve, parent waitpid รอ" },
        { q: "pipe ทำงานยังไง ทำไมต้องปิด fd?", a: "pipe() สร้างท่อมีปลายอ่าน/เขียน, dup2 ต่อ stdout ของซ้าย→ท่อ→stdin ของขวา; ต้องปิดปลายเขียนทุกอันไม่งั้นคำสั่งฝั่งอ่านไม่เห็น EOF → ค้างตลอดกาล" },
        { q: "ทำไม cd/export ต้องรันใน parent?", a: "ต้องเปลี่ยนสถานะของ shell เอง (directory/env); ถ้า fork รันใน child การเปลี่ยนจะหายเมื่อ child ตาย parent ไม่ได้รับผล" },
        { q: "dup2 ใช้ทำอะไร?", a: "ทำให้ fd หนึ่งชี้ไปที่เดียวกับอีก fd — redirect > ใช้ dup2(file, STDOUT) ให้ output ลงไฟล์; pipe ใช้ dup2 ต่อ stdin/stdout เข้าท่อ" },
        { q: "$? คืออะไร เก็บยังไง?", a: "exit status ของคำสั่งล่าสุด เก็บใน sh->exit_status; แปลงจาก wait ด้วย WEXITSTATUS (จบปกติ) หรือ 128+WTERMSIG (ถูก signal); ใช้ใน expand $?" },
        { q: "single quote ต่างจาก double quote ยังไง?", a: "'...' = literal ทั้งหมด ไม่ขยายอะไร; \"...\" = ขยาย $VAR/$? ได้ แต่ยังกัน word splitting; ทั้งคู่ถูกลบ (quote removal) หลัง expand" },
        { q: "จัดการ Ctrl+C / Ctrl+D / Ctrl+\\ ยังไง?", a: "Ctrl+C (SIGINT) ขึ้นบรรทัด+prompt ใหม่ ($?=130) ไม่ฆ่า shell; Ctrl+D (EOF) ออก shell; Ctrl+\\ (SIGQUIT) เมินตอน prompt; ใช้ g_signal + 3 โหมด signal" },
        { q: "ทำไมใช้ global ได้แค่ตัวเดียว?", a: "subject บังคับ — เก็บแค่หมายเลข signal (volatile sig_atomic_t g_signal) เพราะ handler ห้ามทำงานซับซ้อน/แตะ struct ใน async context; ข้อมูลอื่นส่งผ่าน t_shell" },
        { q: "หา path ของคำสั่งยังไง?", a: "ถ้ามี / ใช้ตรง ๆ; ไม่งั้นวน $PATH แต่ละโฟลเดอร์ ต่อกับชื่อคำสั่ง เช็ค access(X_OK); ไม่พบ → exit 127" },
        { q: "exit code 126/127/130 หมายถึงอะไร?", a: "127=ไม่พบคำสั่ง, 126=พบแต่รันไม่ได้ (สิทธิ์/เป็น dir), 130=ถูก Ctrl+C (128+SIGINT), 128+n=ถูก signal n; ตาม convention ของ bash" },
        { q: "heredoc (<<) ทำงานยังไง?", a: "อ่าน input จนเจอ delimiter, เก็บเนื้อหาแล้วป้อนเป็น stdin; ขยาย $ ถ้า delimiter ไม่ถูก quote, ไม่ขยายถ้า quote; preprocess ก่อนรันเพื่อให้ Ctrl+C ยกเลิกได้สะอาด" },
        { q: "เป็น builtin หรือ external ตัดสินยังไง?", a: "is_builtin เช็คชื่อกับ 7 ตัว (echo/cd/pwd/export/unset/env/exit); ถ้าใช่รัน run_builtin, ไม่ใช่ก็ find_path + execve" },
      ]},
      { h: "ทดสอบ" },
      { code: String.raw`./minishell
minishell$ echo hello | cat -e
minishell$ ls -l | grep .c | wc -l > count.txt
minishell$ export X=42; echo "$X and $?"
minishell$ cat << END
# เทียบ behavior กับ bash จริง + valgrind หา leak
valgrind --leak-check=full ./minishell`, lang: "bash" },
    ],
  },
},
/* ===================== miniRT ===================== */
{
  id: "minirt",
  name: "miniRT",
  tag: { th: "ray tracer ใน C — ยิงแสง 1 เส้นต่อ 1 pixel หาวัตถุที่ชนใกล้สุด แล้วลงสีจากแสง: ray-sphere/plane/cylinder, Phong lighting, เงา, parse .rt",
         en: "A ray tracer in C — cast one ray per pixel, find the nearest hit, color it from lighting: ray-sphere/plane/cylinder, Phong lighting, shadows, .rt parsing" },
  accent: "#a78bfa",
  sections: {
    principle: [
      { h: "โจทย์คืออะไร" },
      { p: "เขียน **ray tracer**: ยิง 'แสง' (ray) จากกล้องผ่านทุก pixel ของจอ → หาว่าชนวัตถุไหนใกล้สุด → คำนวณสีของจุดนั้นจากแสง แล้ววาดลงจอด้วย MiniLibX. อ่านฉากจากไฟล์ `.rt`" },
      { code: String.raw`A   0.2     255,255,255          # ambient: ratio + สี
C   0,0,-30   0,0,1   70          # camera: ตำแหน่ง + ทิศ + FOV
L   -20,30,-20   0.8  255,255,255 # light: ตำแหน่ง + ratio + สี
sp  0,0,12   14   255,40,40       # sphere: center + เส้นผ่าศูนย์กลาง + สี`, cap: "ไฟล์ .rt = รายการ object/light/camera (ลำดับใดก็ได้)", lang: "txt" },
      { h: "หัวใจ 3 ขั้น (ต่อ 1 pixel)" },
      { table: { head: ["ขั้น", "ทำอะไร"], rows: [
        ["1. gen_ray", "สร้าง ray จากกล้องผ่าน pixel (x,y)"],
        ["2. trace", "หา object ที่ ray ชนใกล้สุด (t น้อยสุด > 0)"],
        ["3. shade", "คำนวณสีจุดที่ชน: ambient + diffuse + เงา"],
      ]}},
      { note: "วัตถุ mandatory 3 ชนิด: **sphere (sp), plane (pl), cylinder (cy)**. แต่ละชนิดมีสูตร 'ray ชนไหม ที่ t เท่าไร' ต่างกัน — นี่คือคณิตหลักของโปรเจกต์" },
      { h: "ที่มาที่ไป: ray tracing คืออะไร" },
      { p: "ในโลกจริงแสงออกจากหลอดไฟ สะท้อนวัตถุ เข้าตา. ray tracing ทำ **ย้อนกลับ** เพื่อประหยัด: ยิง ray จาก 'ตา (กล้อง)' ออกไปทีละ pixel ดูว่าชนอะไร แล้วถามว่า 'จุดนั้นโดนแสงไหม สีอะไร'. ยิง 1 ray/pixel → ได้ภาพ 3 มิติที่มีเงา/แสงเงาจริง (ต่างจาก fdf ที่แค่ลากเส้น)" },
      { h: "ทำไมเก็บสีเป็น [0,1] ไม่ใช่ 0-255" },
      { p: "การคำนวณแสงคือการ **คูณ/บวกสี** (obj_color × light_color × ความสว่าง). ถ้าเก็บเป็น 0-255 จะล้นและคูณยาก. เก็บเป็น `t_vec3` ช่วง **[0,1]** (parse 0-255 แล้วหาร 255) → คณิตแสงกลายเป็นบวก/คูณ vector ธรรมดา แล้ว clamp + แปลงเป็น `(r<<16)|(g<<8)|b` ตอนท้าย" },
      { h: "ทำไมโจทย์นี้ยาก" },
      { p: "มันคือ 'แปลงสูตรคณิตเป็นโค้ดโดยไม่แตกตื่น': quadratic ของ ray-sphere/cylinder, การสร้าง basis ของกล้อง, เงาที่ต้องกัน 'shadow acne', และผ่าน **norminette** พร้อม build bonus (ตัว `#ifdef` ในฟังก์ชันโดน norm แบน)" },
    ],
    theory: [
      { p: "หมวดนี้รวมคณิต **เวกเตอร์ + เรขาคณิต + แสง** ที่ miniRT ใช้ — เข้าใจสูตรแล้วโค้ดจะตรงไปตรงมา" },
      { h: "1) Ray = จุดเริ่ม + t·ทิศทาง" },
      { p: "ray หนึ่งเส้นเขียนเป็น `P(t) = O + t·D` โดย O = origin (กล้อง), D = direction (ทิศ, normalize แล้ว), t = ระยะ. หา 'ชนวัตถุ' = หาค่า t > 0 ที่ P(t) อยู่บนผิววัตถุ" },
      { code: String.raw`P(t) = O + t·D     เช่น t=5 → จุดที่อยู่ห่างกล้อง 5 หน่วยตามทิศ D`, cap: "ทุกการ 'ชน' คือการแก้สมการหา t ที่เล็กสุดและ > 0", lang: "txt" },
      { h: "2) เวกเตอร์ 3 มิติ — เครื่องมือพื้นฐาน" },
      { table: { head: ["operation", "สูตร", "ใช้ทำ"], rows: [
        ["dot(a,b)", "ax·bx + ay·by + az·bz", "มุม/projection/ความสว่าง"],
        ["cross(a,b)", "เวกเตอร์ตั้งฉากกับทั้งคู่", "สร้าง basis กล้อง"],
        ["length(a)", "√(dot(a,a))", "ระยะ"],
        ["normalize(a)", "a / length(a)", "ทำให้ยาว = 1"],
        ["reflect(v,n)", "v − 2·dot(v,n)·n", "สะท้อน (specular)"],
      ]}},
      { note: "เขียน vec3 ops ให้ครบก่อน (add/sub/scale/dot/cross/len/norm/reflect) — ที่เหลือของโปรเจกต์คือเอามาประกอบ" },
      { h: "3) Surface normal — เวกเตอร์ตั้งฉากผิว" },
      { p: "**normal (N)** = ทิศตั้งฉากกับผิววัตถุที่จุดชน — หัวใจของการคำนวณแสง. sphere: `N = norm(P − center)`; plane: `N = ทิศของระนาบ`; cylinder body: `N = norm(P − จุดบนแกนที่ใกล้สุด)`" },
      { h: "4) แบบจำลองแสง Phong" },
      { p: "สีของจุด = ผลรวม 3 ส่วน: **ambient** (แสงรอบทิศ คงที่), **diffuse** (แสงกระจายตามมุมตกกระทบ — Lambert), **specular** (จุดไฮไลต์มันวาว — bonus)" },
      { code: String.raw`color = ambient + Σ(diffuse ของแต่ละ light ที่ไม่โดนเงาบัง)
diffuse ∝ max(dot(N, L), 0)        # N=normal, L=ทิศไปหาแสง`, cap: "มุมตกตรง (dot สูง) = สว่าง; มุมเฉียง (dot ต่ำ) = มืด; ด้านหลังแสง (dot<0) = 0", lang: "txt" },
      { h: "5) เงา (shadow ray)" },
      { p: "จุดหนึ่งโดนแสงไหม → ยิง ray จากจุดนั้นไปหาแสง ถ้ามีวัตถุขวางก่อนถึงแสง = อยู่ในเงา (ไม่บวก diffuse ของแสงนั้น). **ต้องเลื่อนจุดเริ่มออกนิดนึง (epsilon)** ไม่งั้นจุดจะบังเงาตัวเอง → จุดดำ ('shadow acne')" },
      { h: "6) Color [0,1] → 0xRRGGBB" },
      { p: "คำนวณแสงด้วยสี [0,1] (parse 0-255 ÷255). ตอนท้าย: clamp ให้อยู่ [0,1] แล้ว `int = (r*255 << 16) | (g*255 << 8) | (b*255)` เขียนลง image buffer" },
      { h: "7) กล้อง & การสร้าง ray" },
      { p: "กล้องมีตำแหน่ง + ทิศมอง + FOV. ต้องสร้าง **orthonormal basis** (forward/right/up) จากทิศมอง แล้วแมพ pixel (x,y) → ทิศของ ray. FOV เป็นแนว **นอน**" },

      { h: "🔬 เจาะลึก A: Ray–Sphere Intersection — แก้ quadratic หาจุดชน" },
      { p: "**ภาพในหัว:** ray คือเส้นตรง, sphere คือ 'จุดทั้งหมดที่ห่าง center = รัศมี r'. หา 'ชน' = หา t ที่ระยะจาก P(t) ถึง center = r พอดี — แทน P(t) ลงสมการ sphere ได้ **สมการกำลังสอง**" },
      { code: String.raw`sphere: |P − center|² = r²
ray:    P = O + t·D

แทน:  |O + t·D − center|² = r²
ให้ oc = O − center :
  |oc + t·D|² = r²
  (D·D)t² + 2(oc·D)t + (oc·oc − r²) = 0     ← a·t² + b·t + c

  a = dot(D, D)          (= 1 ถ้า D normalize แล้ว)
  b = 2·dot(oc, D)
  c = dot(oc, oc) − r²`, cap: "ray-sphere = quadratic — มาจากการแทน 'จุดบน ray' ลงในนิยาม 'ผิว sphere'", lang: "txt" },
      { code: String.raw`discriminant = b² − 4ac  บอกจำนวนจุดชน:
  < 0  → ไม่ชน (ray พลาด sphere)
  = 0  → แตะขอบพอดี (1 จุด)
  > 0  → ทะลุผ่าน (2 จุด: เข้า–ออก)

t = (−b ± √disc) / (2a)
→ เลือกรากที่ 'เล็กสุดที่ยัง > EPSILON' (จุดเข้าที่อยู่หน้ากล้อง)
  normal ที่จุดชน = norm(P − center)`, cap: "disc < 0 = ไม่ชน; เลือก t เล็กสุดที่ >EPSILON = ผิวด้านที่กล้องเห็นก่อน", lang: "txt" },
      { note: "ลองพิสูจน์เอง: ไฟล์ subject ให้ 'เส้นผ่าศูนย์กลาง' (diameter) ไม่ใช่รัศมี — ต้อง **หาร 2** ก่อนใช้เป็น r. นี่คือบั๊กอันดับ 1: ลืม /2 แล้ว sphere ใหญ่เกิน 2 เท่า" },
      { qa: [
        { q: "ทำไม ray-sphere เป็นสมการกำลังสอง?", a: "เพราะแทน P(t)=O+tD (เชิงเส้นใน t) ลงในนิยาม sphere |P−center|²=r² ที่มีการยกกำลังสอง → ได้พจน์ t² ออกมา = quadratic" },
        { q: "discriminant บอกอะไร?", a: "<0 ไม่ชน, =0 แตะขอบ 1 จุด, >0 ชน 2 จุด (เข้า-ออก). ถ้า ≥0 เลือก t เล็กสุดที่ >EPSILON = จุดผิวที่กล้องเห็นก่อน" },
        { q: "บั๊ก /2 ของ diameter คืออะไร?", a: ".rt ให้ diameter ต้องหาร 2 เป็น radius ก่อนใส่สูตร (c = oc·oc − r²); ลืมหารแล้ว sphere ใหญ่เป็น 2 เท่า" },
      ]},

      { h: "🔬 เจาะลึก B: Phong Lighting — ทำไมมุมแสงทำให้สว่าง/มืด + การพลิก normal" },
      { p: "**ภาพในหัว:** ผิวที่หันเข้าหาแสงตรง ๆ สว่างสุด, หันเฉียงมืดลง, หันหนีแสงมืดสนิท. วัดด้วย **dot(N, L)** — มุมระหว่าง normal กับทิศไปหาแสง (Lambert's cosine law)" },
      { code: String.raw`shade(P, N, obj):
  color = obj.color ⊙ (ambient.ratio · ambient.color)   # พื้นฐานคงที่
  for each light:
    if in_shadow(P, light): continue                     # โดนเงาบัง → ข้าม
    L = norm(light.pos − P)                               # ทิศไปหาแสง
    diff = max(dot(N, L), 0) · light.ratio                # มุมตก
    color += obj.color ⊙ light.color · diff
  return clamp(color, 0, 1)`, cap: "⊙ = คูณทีละช่อง (R×R,G×G,B×B); dot(N,L) = cos(มุม) = ความสว่างตามมุมตกกระทบ", lang: "txt" },
      { p: "**ทำไม max(dot,0):** ถ้า dot(N,L) < 0 แปลว่าแสงอยู่ 'ด้านหลัง' ผิว → ไม่ควรสว่าง → clamp เป็น 0. **specular (bonus):** `pow(max(dot(reflect(−L,N), view),0), shininess)` = จุดมันวาวเมื่อมุมสะท้อนตรงกับสายตา" },
      { note: "ลองพิสูจน์เอง — กับดักครึ่งหนึ่งของ 'จุดดำ': หลังคำนวณ N ต้อง **พลิก normal เข้าหากล้อง** ก่อนใช้: `if dot(N, D) > 0: N = −N`. ไม่งั้นผิวด้านในวัตถุ/cylinder จะคำนวณแสงกลับด้าน มืดผิด" },
      { qa: [
        { q: "ทำไม diffuse ใช้ dot(N, L)?", a: "Lambert's law: ความสว่าง ∝ cos(มุมระหว่าง normal กับทิศแสง) = dot(N,L) เมื่อทั้งคู่ normalize. มุมตรง=สว่างสุด, เฉียง=มืดลง" },
        { q: "ทำไมต้อง max(dot(N,L), 0)?", a: "ถ้า dot<0 แสงอยู่ด้านหลังผิว ไม่ควรเพิ่มความสว่าง → clamp เป็น 0 กันสีติดลบ" },
        { q: "ทำไมต้องพลิก normal เข้าหากล้อง?", a: "ถ้า dot(N, ray_dir) > 0 แปลว่า normal ชี้หนีกล้อง → พลิก N=−N ให้ชี้เข้าหา ไม่งั้นด้านในวัตถุ/ผนัง cylinder จะ shade กลับด้าน (มืดผิด/ดำ)" },
      ]},

      { h: "🔬 เจาะลึก C: Shadows & Shadow Acne — ทำไมต้องเลื่อน epsilon" },
      { p: "**ภาพในหัว:** จุดบนผิวโดนแสงไหม → ยิง 'shadow ray' จากจุดนั้นไปหาแสง ถ้าชนวัตถุอื่นก่อนถึงแสง = อยู่ในเงา. แต่มีปัญหาคลาสสิก: จุดนั้น **บังเงาตัวเอง**" },
      { code: String.raw`in_shadow(P, light):
  L = light.pos − P ; dist = length(L)
  shadow_ray = { origin: P + N·EPSILON, dir: norm(L) }   # ★ เลื่อนออก!
  hit = trace(shadow_ray)
  return (hit เกิดขึ้น และ hit.t < dist)                 # มีของขวางก่อนถึงแสง

ปัญหาถ้าไม่เลื่อน (origin = P เป๊ะ):
  shadow ray เริ่มที่ผิว → ชนผิวตัวเอง t≈0 → คิดว่า 'มีเงาบัง'
  → ทุกจุดดำหมด = "shadow acne" (จุดดำกระจายเป็นเม็ด)`, cap: "เลื่อน origin ออกตาม normal นิดนึง (EPSILON ~1e-3) → ไม่ชนตัวเอง", lang: "txt" },
      { note: "ลองพิสูจน์เอง: ตั้ง EPSILON = 0 แล้ว render — จะเห็นจุดดำกระจายทั่วผิว (acne). เพิ่ม EPSILON เป็น 1e-4..1e-3 แล้วจุดดำหายทันที. และต้องเช็ค `hit.t < dist` ไม่งั้นวัตถุ 'หลังแสง' จะถูกนับเป็นตัวบังผิด" },
      { qa: [
        { q: "shadow acne คืออะไร เกิดจากอะไร?", a: "จุดดำกระจายทั่วผิว เกิดเพราะ shadow ray เริ่มที่ผิวพอดี (t=0) แล้ว 'ชนตัวเอง' → ทุกจุดคิดว่าโดนเงาบัง" },
        { q: "แก้ shadow acne ยังไง?", a: "เลื่อนจุดเริ่ม shadow ray ออกตาม normal นิดนึง (P + N·EPSILON, ~1e-3) หรือยอมรับเฉพาะ hit ที่ t > EPSILON" },
        { q: "ทำไมต้องเช็ค hit.t < dist_to_light?", a: "เพื่อให้นับเฉพาะวัตถุที่อยู่ 'ระหว่างจุดกับแสง'; วัตถุที่อยู่ไกลกว่าแสง (t > dist) ไม่ได้บังแสง ต้องไม่นับเป็นเงา" },
      ]},

      { h: "🔬 เจาะลึก D: Camera & Ray Generation — แมพ pixel เป็นทิศของ ray" },
      { p: "**ภาพในหัว:** กล้องมีตำแหน่ง + ทิศมอง + FOV (มุมมองแนวนอน). ต้องสร้าง 'จอเสมือน' หน้ากล้อง แล้วยิง ray จากกล้องผ่านแต่ละ pixel. ขั้นแรก: สร้าง **orthonormal basis** (3 แกนตั้งฉากกัน)" },
      { code: String.raw`สร้าง basis จากทิศมอง:
  forward = norm(C.dir)
  world_up = (0,1,0)   (ถ้าขนานกับ forward ใช้ (0,0,1) แทน)
  right = norm(cross(world_up, forward))
  up    = cross(forward, right)
  scale = tan(fov/2 · π/180)     # FOV แนวนอน

ต่อ pixel (x,y) — มี +0.5 (กลาง pixel), พลิก y (จอ y ลง แต่ภาพ y ขึ้น):
  aspect = W / H
  px = (2·(x+0.5)/W − 1) · scale
  py = (1 − 2·(y+0.5)/H) · scale / aspect
  dir = norm(forward + px·right + py·up)`, cap: "basis = 3 แกนตั้งฉาก; pixel แมพเป็นออฟเซ็ตบน right/up แล้วบวก forward = ทิศ ray", lang: "txt" },
      { p: "**ทำไม FOV หารด้วย aspect ที่แกนตั้ง:** FOV เป็นแนวนอน → แกนนอน (px) ใช้ scale ตรง ๆ, แกนตั้ง (py) ต้องหาร aspect (W/H) เพื่อไม่ให้ภาพยืด. ถ้าภาพ **กลับหัว** = ลืม `(1 − …)` ที่ py; ถ้า **ยืด** = ใส่ aspect ผิดแกน" },
      { note: "ลองพิสูจน์เอง: ตั้งกล้อง C ที่ (0,0,−30) มอง +z, วาง sphere ที่ (0,0,12) — ต้องเห็นวงกลมกลางจอ. ถ้าจอดำสนิท = กล้องมองผิดทาง (วัตถุอยู่นอกเฟรม) — จัดฉากให้วัตถุอยู่หน้ากล้องก่อน" },
      { qa: [
        { q: "ทำไมต้องสร้าง orthonormal basis ของกล้อง?", a: "เพื่อแมพ pixel 2D → ทิศ ray 3D: right/up เป็นแกนของ 'จอเสมือน', forward คือทิศตรงหน้า; ทิศ ray = forward + px·right + py·up" },
        { q: "ทำไม px ใช้ +0.5 และ py พลิก (1−…)?", a: "+0.5 = ยิงผ่าน 'กลาง' pixel ไม่ใช่มุม; พลิก y เพราะพิกัดจอ y เพิ่มลงล่าง แต่ในภาพ +y คือขึ้นบน" },
        { q: "FOV เป็นแนวไหน aspect ใส่ตรงไหน?", a: "FOV แนวนอน → px ใช้ scale ตรง ๆ, py หารด้วย aspect (W/H) กันภาพยืด. ใส่ aspect ผิดแกน = ภาพยืด/fisheye" },
      ]},
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Ray tracing (graphics) — Wikipedia", url: "https://en.wikipedia.org/wiki/Ray_tracing_(graphics)", note: "ภาพรวม ray tracing + ประวัติ" },
        { label: "Scratchapixel — Ray-Sphere Intersection", url: "https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection.html", note: "ที่มาสูตร quadratic เต็ม ๆ" },
        { label: "Ray Tracing in One Weekend", url: "https://raytracing.github.io/books/RayTracingInOneWeekend.html", note: "เขียน ray tracer จากศูนย์ทีละขั้น (อ่านสนุก)" },
        { label: "Phong reflection model — Wikipedia", url: "https://en.wikipedia.org/wiki/Phong_reflection_model", note: "ambient + diffuse + specular เต็มสูตร" },
        { label: "Lambert's cosine law — Wikipedia", url: "https://en.wikipedia.org/wiki/Lambert%27s_cosine_law", note: "ที่มาของ diffuse = dot(N,L)" },
        { label: "MiniLibX docs (Harm Smits 42docs)", url: "https://harm-smits.github.io/42docs/libs/minilibx", note: "คู่มือ mlx สำหรับชาว 42" },
      ]},
    ],
    foundations: [
      { p: "หมวดนี้เจาะ **struct, color เป็นเวกเตอร์, และ object list** ที่ miniRT ใช้" },
      { h: "struct หลัก" },
      { code: String.raw`typedef struct s_vec3 { double x, y, z; } t_vec3;
typedef t_vec3 t_color;            // สีก็คือ vec3 [0,1]

typedef struct s_object {          // sphere/plane/cylinder ใน struct เดียว
    t_type   type;                 // SPHERE / PLANE / CYLINDER
    t_vec3   pos;                  // center / จุดบนระนาบ
    t_vec3   axis;                 // ทิศ (plane normal / cylinder axis)
    double   radius, height;       // sphere/cylinder
    t_color  color;                // [0,1]
    struct s_object *next;         // linked list
} t_object;

typedef struct s_camera {
    t_vec3 pos, dir, right, up;    // basis คำนวณตอน setup
    double fov;
} t_camera;

typedef struct s_scene {
    t_color   ambient; double a_ratio;
    t_camera  cam;
    t_object  *lights;             // 1 ตัว (mandatory) / หลายตัว (bonus)
    t_object  *objects;
} t_scene;`, cap: "object ทุกชนิดใน struct เดียว (แยกด้วย type) → loop เดียววนทุกวัตถุได้", lang: "c" },
      { h: "color เป็น t_vec3 [0,1] (ไม่ใช่ int)" },
      { p: "เก็บสีเป็น vec3 ช่วง [0,1] ทำให้คณิตแสง (คูณ/บวกสี) ง่าย. แปลงเป็น int 0xRRGGBB เฉพาะตอนเขียนลง buffer:" },
      { code: String.raw`int color_to_int(t_color c) {
    int r = (int)(fmin(c.x, 1.0) * 255);   // clamp + ขยายเป็น 0-255
    int g = (int)(fmin(c.y, 1.0) * 255);
    int b = (int)(fmin(c.z, 1.0) * 255);
    return ((r << 16) | (g << 8) | b);
}`, cap: "clamp [0,1] แล้ว pack 3 ช่อง 8 bit เป็นเลขสีเดียว", lang: "c" },
      { h: "diameter → radius (หาร 2)" },
      { p: ".rt ให้ **เส้นผ่าศูนย์กลาง** ของ sphere/cylinder — ต้อง `radius = diameter / 2` ตอน parse. ลืมหารคือบั๊กที่ทำให้วัตถุใหญ่เป็น 2 เท่า" },
      { h: "object list = linked list" },
      { p: "จำนวนวัตถุไม่รู้ล่วงหน้า → เก็บเป็น linked list. `trace()` วนทุก node หา t เล็กสุด; ต้อง free ทั้ง list ตอนจบ (objects + lights)" },
    ],
    architecture: [
      { h: "ไฟล์ในโปรเจกต์ (แบ่งตาม norm: ≤5 ฟังก์ชัน/ไฟล์)" },
      { table: { head: ["ไฟล์", "หน้าที่"], rows: [
        ["`main.c`", "argc check → parse → render → mlx_loop"],
        ["`vec3*.c`", "add/sub/scale/dot/cross/len/norm/reflect"],
        ["`parse*.c`", "อ่าน .rt → dispatch ตาม id (A/C/L/sp/pl/cy)"],
        ["`render.c`", "วน pixel → gen_ray → trace → shade → put_pixel"],
        ["`camera.c`", "setup_camera (basis) + gen_ray"],
        ["`intersect.c` + `inter_*.c`", "ray ชน sphere/plane/cylinder"],
        ["`lighting.c`", "shade (ambient+diffuse) + get_normal"],
        ["`shadow.c`", "in_shadow (shadow ray)"],
        ["`free.c` / `error.c`", "คืน memory / พิมพ์ Error"],
      ]}},
      { h: "การไหลของข้อมูล (.rt → ภาพ)" },
      { code: String.raw`ไฟล์ .rt
   │ parse: gnl + ft_split + dispatch
   ▼
t_scene { ambient, camera, lights, objects }
   │ render: วนทุก pixel
   ▼
gen_ray(x,y) → ray → trace(ray) → hit(object, t, point, normal)
   │ shade(hit): ambient + Σ diffuse (เช็ค in_shadow)
   ▼
color [0,1] → color_to_int → image buffer → mlx_put_image`, cap: "ไฟล์ฉาก → struct → ray ต่อ pixel → สี → ภาพ", lang: "txt" },
      { note: "render ทำงานหนัก: WIDTH×HEIGHT pixel × (ทุก object × intersection) — วาดลง image buffer แล้ว put ทีเดียว (เหมือน fdf/fractol)" },
    ],
    dataflow: [
      { p: "ไล่ฟังก์ชันสำคัญทีละตัว" },
      { h: "main() → render()" },
      { code: String.raw`int main(int ac, char **av) {
    if (ac != 2) return (error("usage: ./miniRT scene.rt"));
    if (parse_scene(&scene, av[1])) return (1);   // อ่าน .rt
    init_mlx(&scene);
    setup_camera(&scene.cam);                     // สร้าง basis
    render(&scene);                               // วาดทุก pixel
    mlx_loop(scene.mlx);                          // รอ event (ESC/ปิด)
    return (0);
}`, cap: "ลำดับ: parse → mlx → camera basis → render → loop", lang: "c" },
      { h: "render() — วน pixel" },
      { code: String.raw`void render(t_scene *s) {
    int x, y;
    for (y = 0; y < HEIGHT; y++)
      for (x = 0; x < WIDTH; x++) {
        t_ray ray = gen_ray(&s->cam, x, y);       // pixel → ray
        t_hit hit;
        if (trace(s, ray, &hit))                  // ชนอะไรไหม
            put_pixel(s, x, y, color_to_int(shade(s, &hit)));
        else
            put_pixel(s, x, y, 0);                // ไม่ชน = ดำ
      }
    mlx_put_image_to_window(s->mlx, s->win, s->img, 0, 0);
}`, cap: "1 pixel = 1 ray; ชน→shade, ไม่ชน→ดำ", lang: "c" },
      { h: "trace() — หา object ใกล้สุด" },
      { code: String.raw`int trace(t_scene *s, t_ray ray, t_hit *hit) {
    double t, closest = INFINITY;
    t_object *o = s->objects;
    int found = 0;
    while (o) {
        if (hit_object(o, ray, &t) && t < closest && t > EPSILON) {
            closest = t; hit->obj = o; hit->t = t;  // จำตัวที่ใกล้สุด
            found = 1;
        }
        o = o->next;
    }
    if (found) {
        hit->point = ray_at(ray, closest);          // P = O + t·D
        hit->normal = get_normal(hit->obj, hit->point, ray.dir);
    }
    return (found);
}`, cap: "วนทุก object เก็บ t เล็กสุดที่ >EPSILON = ผิวที่กล้องเห็นก่อน", lang: "c" },
      { h: "shade() — คำนวณสี" },
      { code: String.raw`t_color shade(t_scene *s, t_hit *hit) {
    t_color col = mul(hit->obj->color, scale(s->ambient, s->a_ratio));
    t_object *lt = s->lights;
    while (lt) {
        if (!in_shadow(s, hit, lt)) {
            t_vec3 L = norm(sub(lt->pos, hit->point));
            double d = fmax(dot(hit->normal, L), 0) * lt->ratio;
            col = add(col, scale(mul(hit->obj->color, lt->color), d));
        }
        lt = lt->next;
    }
    return (col);   // clamp ตอนแปลงเป็น int
}`, cap: "ambient เป็นฐาน + บวก diffuse ของแต่ละ light ที่ไม่โดนเงาบัง", lang: "c" },
      { h: "in_shadow() — ยิง shadow ray" },
      { code: String.raw`int in_shadow(t_scene *s, t_hit *hit, t_object *light) {
    t_vec3 to_l = sub(light->pos, hit->point);
    double dist = length(to_l);
    t_ray sray;
    sray.origin = add(hit->point, scale(hit->normal, EPSILON)); // เลื่อนออก!
    sray.dir = norm(to_l);
    t_hit tmp;
    if (trace(s, sray, &tmp) && tmp.t < dist)   // มีของขวางก่อนถึงแสง
        return (1);
    return (0);
}`, cap: "เลื่อน origin ตาม normal (EPSILON) กัน shadow acne; เช็ค t < dist", lang: "c" },
    ],
    implementation: [
      { h: "ลำดับการลงมือเขียน (แนะนำ)" },
      { ul: [
        "1. **vec3 ops** ให้ครบก่อน (add/sub/scale/dot/cross/len/norm/reflect) — ฐานทั้งหมด",
        "2. เปิดหน้าต่าง mlx + put_pixel ทดสอบ 1 จุด",
        "3. **gen_ray** + camera basis → วาดสีพื้นหลังตามทิศ ray (เช็คว่ากล้องถูก)",
        "4. **ray-sphere** + render sphere ลูกเดียว (ยังไม่มีแสง = สีทึบ)",
        "5. **shade** ambient + diffuse 1 light → เห็นแสงเงาบนลูกกลม",
        "6. **shadow ray** (+ epsilon กัน acne)",
        "7. **plane + cylinder** (cylinder ยากสุด: body + 2 caps)",
        "8. parse .rt ครบทุก id + ตรวจ error ทุก field",
        "9. bonus: specular, checkerboard, หลาย light, cone (แยก build ด้วย Makefile)",
      ]},
      { h: "บั๊กยอดฮิตและวิธีกัน" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้"], rows: [
        ["จอดำสนิท", "กล้องมองผิดทาง (วัตถุนอกเฟรม) / normal ไม่พลิก / ambient 0", "จัดฉากให้วัตถุหน้ากล้อง, พลิก normal เข้าหากล้อง"],
        ["sphere ใหญ่ 2 เท่า", "ใช้ diameter เป็น radius", "radius = diameter / 2"],
        ["จุดดำกระจาย (acne)", "shadow ray ไม่เลื่อน epsilon", "origin = P + N·EPSILON"],
        ["ภาพกลับหัว", "ลืม (1 − …) ที่ py", "พลิกแกน y ตอนแมพ pixel"],
        ["ภาพยืด/fisheye", "ใส่ aspect ผิดแกน", "FOV แนวนอน → หาร aspect ที่แกนตั้ง"],
        ["cylinder ไม่มีฝา/มืดด้านใน", "ไม่ทดสอบ caps / normal ไม่พลิก", "เพิ่ม disk test 2 ฝา + พลิก normal"],
      ]}},
      { h: "การ build / รัน" },
      { code: String.raw`make            # mandatory
make bonus      # specular/checkerboard/หลาย light/cone
./miniRT scenes/sphere.rt
./miniRT scenes/cylinder.rt
norminette src include   # ต้อง 0 error (bonus ก็ตรวจ)`, lang: "bash" },
      { note: "บน Windows ต้องรันผ่าน WSL + WSLg (DISPLAY=:0) ไม่งั้นหน้าต่าง mlx ไม่ขึ้น — ดู skill build-42-projects-on-windows. เคล็ดทดสอบไม่ง้อจอ: เขียน harness เล็ก ๆ วน gen_ray→trace→shade เขียน PPM แทนการเปิด window" },
    ],
    tricks: [
      { h: "ทริค 1: เก็บสีเป็น [0,1] ตลอด" },
      { p: "parse 0-255 แล้วหาร 255 ทันที — คณิตแสงทั้งหมดเป็นบวก/คูณ vector ธรรมดา. clamp + แปลงเป็น int เฉพาะตอนเขียน buffer (ที่เดียว)" },
      { h: "ทริค 2: พลิก normal เข้าหากล้องเสมอ" },
      { p: "หลังหา N: `if (dot(N, ray.dir) > 0) N = neg(N)` → ฆ่าบั๊ก 'จุดดำ' ครึ่งหนึ่ง (ผิวด้านใน/ผนัง cylinder shade ถูกด้าน)" },
      { h: "ทริค 3: EPSILON กัน shadow acne + self-hit" },
      { p: "ใช้ EPSILON (~1e-3) ทั้งตอนรับ t ของ intersection (t > EPSILON) และเลื่อน origin ของ shadow ray — กันชนตัวเอง" },
      { h: "ทริค 4: FOV แนวนอน → aspect ที่แกนตั้ง" },
      { p: "px ใช้ scale=tan(fov/2) ตรง ๆ, py หารด้วย aspect (W/H). ผิดแกน = ยืด/fisheye" },
      { h: "ทริค 5: drain get_next_line จนหมดตอน parse error" },
      { p: "ถ้า break ออกจาก loop อ่านทันทีที่เจอ error → static stash ของ gnl ไม่ถูก free (leak). ต้องวนอ่าน+free จนได้ NULL (parse เฉพาะจนเจอ error แรก)" },
      { h: "ทริค 6: bonus ใช้ Makefile stub ไม่ใช่ #ifdef" },
      { p: "norminette แบน `#ifdef` ในฟังก์ชัน (PREPOC_ONLY_GLOBAL). ดันความต่าง mandatory/bonus ไปไว้หลัง 'compat function' (`specular_term()`, `base_color()`...) แล้วเลือก stub/bonus ด้วย Makefile (`-D BONUS`) — เหมือน cub3d COMMON+.bonus.o" },
      { h: "ทริค 7: แปลง \\r ด้วย (ไฟล์ .rt จาก Windows)" },
      { p: "ไฟล์แก้บน Windows มี `\\r` — แปลง `\\t \\n \\r` เป็น space ใน tokenize ก่อน ft_split ไม่งั้น token สุดท้ายทุกบรรทัด parse พลาด" },
    ],
    eval: [
      { qa: [
        { q: "ray tracing ทำงานยังไงในหนึ่งประโยค?", a: "ยิง ray 1 เส้นจากกล้องผ่านแต่ละ pixel หาวัตถุที่ชนใกล้สุด แล้วคำนวณสีจุดนั้นจากแสง (ambient+diffuse) + เงา" },
        { q: "ray เขียนเป็นสมการยังไง?", a: "P(t) = O + t·D (O=กล้อง, D=ทิศ normalize, t=ระยะ); หา 'ชน' = หา t เล็กสุดที่ >EPSILON ที่ P(t) อยู่บนผิววัตถุ" },
        { q: "ray-sphere ได้สมการอะไร แก้ยังไง?", a: "quadratic a·t²+b·t+c (a=D·D, b=2·oc·D, c=oc·oc−r², oc=O−center); ดู discriminant, เลือก t เล็กสุดที่ >EPSILON" },
        { q: "diffuse lighting คำนวณยังไง?", a: "max(dot(N,L),0)·ratio (N=normal, L=ทิศไปแสง) ตาม Lambert's law — มุมตกตรงสว่างสุด; คูณ obj_color⊙light_color" },
        { q: "ทำไมต้องพลิก normal เข้าหากล้อง?", a: "ถ้า dot(N, ray.dir)>0 normal ชี้หนีกล้อง → พลิก N=−N ไม่งั้นผิวด้านใน/ผนัง cylinder shade กลับด้าน มืดผิด" },
        { q: "shadow acne คืออะไร แก้ยังไง?", a: "จุดดำกระจายจาก shadow ray ชนผิวตัวเอง (t≈0); แก้ด้วยเลื่อน origin ออกตาม normal นิดนึง (P+N·EPSILON)" },
        { q: "สร้าง ray ของกล้องยังไง?", a: "สร้าง orthonormal basis (forward/right/up) จากทิศมอง; ต่อ pixel: px,py = แมพ (x,y) ด้วย tan(fov/2)+aspect; dir = norm(forward+px·right+py·up)" },
        { q: "ทำไม FOV หาร aspect ที่แกนตั้ง?", a: "FOV เป็นแนวนอน → แกนนอนใช้ scale ตรง ๆ, แกนตั้งหารด้วย aspect (W/H) กันภาพยืด" },
        { q: "ทำไมเก็บสีเป็น [0,1] ไม่ใช่ 0-255?", a: "คณิตแสงคือคูณ/บวกสี — [0,1] ทำให้เป็น vector op ธรรมดา ไม่ล้น; clamp+แปลง int ตอนเขียน buffer เท่านั้น" },
        { q: "cylinder ยากตรงไหน?", a: "ต้องเช็ค 2 ส่วน: body (quadratic + เช็คว่าจุดชนอยู่ในช่วง ±height/2 ตามแกน) และ caps (2 disk ที่ปลาย); normal body=norm(P−จุดบนแกน), cap=±axis" },
        { q: "จัดการ error ของไฟล์ .rt ยังไง?", a: "ทุก field ผิด (ratio/สี/FOV นอกช่วง, vector ศูนย์, id ไม่รู้จัก) → พิมพ์ Error\\n+ข้อความ แล้ว exit ไม่ใช่ segfault; drain gnl จนหมดกัน leak" },
      ]},
      { h: "ทดสอบ" },
      { code: String.raw`./miniRT scenes/sphere.rt        # วงกลมแดงกลางจอ + แสงเงา
./miniRT scenes/cylinder.rt      # cylinder + plane + เงา
./miniRT                         # usage (ไม่มี argument)
./miniRT bad.rt                  # Error (ไฟล์ผิดรูปแบบ)
norminette src include           # 0 error (mandatory + bonus)
valgrind --leak-check=full ./miniRT scenes/sphere.rt   # ไม่ leak (path headless)`, lang: "bash" },
    ],
  },
},
/* ===================== cub3D ===================== */
{
  id: "cub3d",
  name: "cub3D",
  tag: { th: "raycasting FPS แบบ Wolfenstein ใน C — ยิง ray 1 เส้นต่อ 1 คอลัมน์จอ, DDA หาผนัง, แก้ fisheye, แปะ texture ตามด้าน, parse .cub + ตรวจ map ปิด",
         en: "A Wolfenstein-style raycasting FPS in C — one ray per screen column, DDA to find the wall, fisheye correction, per-side textures, .cub parsing + closed-map validation" },
  accent: "#fb923c",
  sections: {
    principle: [
      { h: "โจทย์คืออะไร" },
      { p: "เขียนเกม FPS มุมมองบุคคลที่ 1 จาก **แผนที่ 2 มิติ** ด้วยเทคนิค **raycasting** (แบบ Wolfenstein 3D / Doom ยุคแรก): ยิง ray 1 เส้น **ต่อ 1 คอลัมน์ของจอ** ออกจากผู้เล่น → ชนผนังที่ระยะเท่าไร → วาดแถบผนังแนวตั้งสูงตามระยะ (ใกล้=สูง, ไกล=เตี้ย) พร้อม texture. อ่านฉากจากไฟล์ `.cub`" },
      { code: String.raw`NO ./assets/north.xpm     # texture 4 ทิศ
SO ./assets/south.xpm
WE ./assets/west.xpm
EA ./assets/east.xpm
F 220,100,0               # สีพื้น (floor)
C 30,60,120               # สีเพดาน (ceiling)

1111111                   # แผนที่: 1=ผนัง, 0=ทางเดิน
10N0001                   #         N/S/E/W=ผู้เล่น+ทิศหันหน้า
1111111                   # ต้อง 'ปิด' รอบทุกด้าน`, cap: ".cub = 6 element (texture×4 + 2 สี) + แผนที่ตาราง", lang: "txt" },
      { h: "หัวใจ: raycasting คืออะไร (ทำไมไม่ใช่ 3D จริง)" },
      { p: "ไม่ได้สร้างโลก 3D จริง — แต่ใช้ 'เทคนิคลวงตา': โลกเป็น **ตาราง 2 มิติ** (grid ของผนัง/ที่ว่าง). ต่อ 1 คอลัมน์จอ ยิง ray ออกไปบน grid 2D หาว่าชนผนังช่องไหน ระยะเท่าไร → แปลงระยะเป็น 'ความสูงแถบผนัง' บนจอ. ยิงครบทุกคอลัมน์ (กว้าง 1280) = ได้ภาพ 3 มิติเสมือน เร็วมาก (วิ่งบนเครื่องปี 1992 ได้)" },
      { h: "3 ขั้น (ต่อ 1 เฟรม)" },
      { table: { head: ["ขั้น", "ทำอะไร"], rows: [
        ["1. ยิง ray ต่อคอลัมน์", "คำนวณทิศ ray ของคอลัมน์ x (จากกล้อง+plane)"],
        ["2. DDA หาผนัง", "เดินทีละช่อง grid จนชน '1' → ได้ระยะ"],
        ["3. วาดแถบ + texture", "ความสูง = WIN_H/ระยะ; แปะ texture ตามด้านที่ชน"],
      ]}},
      { note: "ต่างจาก fdf (ลากเส้น wireframe) และ fract-ol (ระบายสีต่อ pixel): cub3D = เกมเล่นได้จริง มีผู้เล่นเดิน/หมุน/ชนผนัง + เฟรมเรียลไทม์" },
      { h: "เทียบกับ miniRT" },
      { p: "ทั้งคู่ 'ยิง ray' แต่คนละแบบ: **miniRT** ยิง 1 ray/**pixel** ใน 3D จริง (sphere/plane) เน้นแสงเงาสมจริง ช้า. **cub3D** ยิง 1 ray/**คอลัมน์** บน grid 2D เน้นเร็ว+เล่นได้ ผนังตั้งฉากเสมอ" },
      { h: "ทำไมโจทย์นี้ยาก" },
      { p: "3 ด่าน: (1) **คณิต DDA + แก้ fisheye** (perpendicular distance) (2) **parse .cub** ที่ปนผู้เล่น (N/S/E/W) กับ texture id (NO/SO...) + ตรวจ 'แผนที่ปิดสนิท' บน map ขอบไม่เท่ากัน (3) ผ่าน **norminette** + bonus (ห้าม `#ifdef` ในฟังก์ชัน) + ไม่ leak ทุก error path" },
    ],
    theory: [
      { p: "หมวดนี้รวมคณิต **กล้อง 2D + DDA + projection + texture** ของ raycasting (อิงอัลกอริทึม Lode Vandevenne)" },
      { h: "1) กล้อง = ตำแหน่ง + dir + plane" },
      { p: "ผู้เล่นมี `pos` (x,y บน grid), `dir` (เวกเตอร์ทิศหันหน้า), และ `plane` (เวกเตอร์ตั้งฉากกับ dir = 'ระนาบกล้อง'). **ความยาว plane กำหนด FOV**: plane = 0.66 → FOV ≈ 66°. ray ของแต่ละคอลัมน์ = `dir + plane × camera_x`" },
      { code: String.raw`camera_x = 2·x / WIN_W − 1        # −1 (ซ้ายจอ) .. +1 (ขวาจอ)
ray_dir  = dir + plane · camera_x  # คอลัมน์กลาง = dir ตรง ๆ`, cap: "กวาด camera_x จาก −1→+1 = กวาด ray จากขอบซ้าย→ขวาของมุมมอง", lang: "txt" },
      { h: "2) DDA — เดินทีละช่องหาผนัง" },
      { p: "**DDA (Digital Differential Analyzer)** เดิน ray ทีละ 'เส้น grid' (ไม่ใช่ทีละ step เล็ก ๆ) จนเข้าช่องที่เป็นผนัง — แม่นและเร็วเพราะกระโดดข้ามช่องว่างทีเดียว" },
      { h: "3) Perpendicular distance — แก้ fisheye" },
      { p: "ถ้าใช้ระยะ Euclidean ตรง ๆ ผนังจะ 'โป่ง' กลางจอ (fisheye). ต้องใช้ **ระยะตั้งฉากกับระนาบกล้อง** → ผนังตรงดูตรง" },
      { h: "4) ความสูงแถบผนัง" },
      { p: "`line_height = WIN_H / perpDist` — ใกล้ (dist น้อย) = แถบสูง, ไกล = แถบเตี้ย. วาดจากกลางจอขึ้น/ลงเท่า ๆ กัน" },
      { h: "5) เลือก texture ตามด้านที่ชน" },
      { p: "`side` บอกว่าชนผนังด้านแนวตั้ง (x-side) หรือแนวนอน (y-side) + ทิศ ray → เลือก 1 ใน 4 texture (NO/SO/WE/EA). `wall_x` (จุดที่ชนบนผนัง 0..1) → คอลัมน์ของ texture" },
      { h: "6) parse .cub + แยกผู้เล่นจาก texture id" },
      { p: "ด่านยาก: แถวแผนที่อาจขึ้นต้นด้วย N/S/E/W (ผู้เล่น) = ตัวอักษรเดียวกับ NO/SO. กฎ: **element line** = id ตามด้วย **ช่องว่าง** (`NO `/`SO `/`F `...) และ parse id **ก่อน** บล็อกแผนที่เริ่มเท่านั้น; พอเจอบรรทัดแผนที่บรรทัดแรก = ที่เหลือเป็นแผนที่ทั้งหมด" },
      { h: "7) ตรวจ 'แผนที่ปิด' บน map ขอบไม่เท่ากัน" },
      { p: "แผนที่ **ไม่ใช่สี่เหลี่ยม** และมีช่องว่างได้. ทุกช่องเดินได้ (`0`/ผู้เล่น) ต้องไม่ติดขอบนอก/ช่องว่าง (ไม่งั้น 'รั่ว'). เช็ค 4 เพื่อนบ้าน: ถ้าเพื่อนบ้านหลุดขอบ **หรือ** เป็น space = แผนที่เปิด = error" },

      { h: "🔬 เจาะลึก A: Camera Plane & Ray Direction — โมเดลกล้อง 2D ของ raycasting" },
      { p: "**ภาพในหัว:** ผู้เล่นยืนบน grid 2D มอง 'ไปข้างหน้า' (dir). จะเห็นมุมกว้างได้ต้องมี 'จอเสมือน' วางตั้งฉากหน้าผู้เล่น = เวกเตอร์ **plane**. ทุกคอลัมน์จอ = 1 จุดบน plane → ยิง ray ผ่านจุดนั้น" },
      { code: String.raw`dir ┃ plane (ตั้งฉาก dir)
         │
    ╲    │    ╱   ray ของแต่ละคอลัมน์
     ╲   │   ╱    = dir + plane·camera_x
      ╲  │  ╱
       ╲ │ ╱
        ╲│╱
     [ผู้เล่น pos]

camera_x = 2·x/WIN_W − 1     x=0 → −1 (ซ้ายสุด)
                             x=WIN_W/2 → 0 (กลาง = dir)
                             x=WIN_W → +1 (ขวาสุด)
ray_dir_x = dir_x + plane_x · camera_x
ray_dir_y = dir_y + plane_y · camera_x`, cap: "plane = แกนนอนของจอเสมือน; camera_x เลื่อนตำแหน่งบนจอ → เลื่อนทิศ ray", lang: "txt" },
      { code: String.raw`FOV มาจาก |plane| / |dir| :
  |dir| = 1 (normalize), |plane| = 0.66
  → FOV = 2·atan(0.66/1) ≈ 66°    (มาตรฐาน FPS)

ทิศเริ่มต้นจากตัวอักษรผู้เล่น (boolean arithmetic, เลี่ยง ?: ตาม norm):
  'N': dir=(0,−1) plane=(0.66, 0)
  'S': dir=(0, 1) plane=(−0.66,0)
  'E': dir=(1, 0) plane=(0, 0.66)
  'W': dir=(−1,0) plane=(0,−0.66)
  → plane ตั้งฉาก dir เสมอ (หมุน dir 90°)`, cap: "plane ยาวขึ้น = FOV กว้างขึ้น (มากไปจะ fisheye); plane ⊥ dir เสมอ", lang: "txt" },
      { note: "ลองพิสูจน์เอง: ตั้ง |plane| = 1.0 (FOV 90°) แล้ว 0.3 (FOV ~33°) — ดูภาพกว้าง/แคบเปลี่ยน. ตอนหมุนตัว ต้องหมุน **ทั้ง dir และ plane** ด้วย rotation matrix เดียวกัน ไม่งั้นกล้องเพี้ยน" },
      { qa: [
        { q: "เวกเตอร์ plane คืออะไร ทำไมต้องมี?", a: "plane = แกนนอนของ 'จอเสมือน' ตั้งฉากกับ dir; ใช้กระจาย ray ออกเป็นมุมกว้าง (FOV). ray คอลัมน์ x = dir + plane·camera_x" },
        { q: "FOV กำหนดยังไง?", a: "จากอัตราส่วน |plane|/|dir|: FOV = 2·atan(|plane|). |plane|=0.66 → ~66°. ยาวขึ้น=กว้างขึ้น (มากไปจะ fisheye)" },
        { q: "camera_x ทำงานยังไง?", a: "= 2·x/WIN_W − 1 แปลงเลขคอลัมน์ (0..WIN_W) เป็น −1..+1; กลางจอ=0 (ray=dir ตรง), ขอบ=±1 (เอียงสุด)" },
      ]},

      { h: "🔬 เจาะลึก B: DDA — เดินทีละช่อง grid หาผนัง" },
      { p: "**ภาพในหัว:** แทนที่จะคืบ ray ทีละนิด (ช้า/พลาด) DDA กระโดดไปที่ **เส้น grid ถัดไป** ทันที (แนวตั้งหรือแนวนอนอันไหนใกล้กว่า) แล้วเช็คช่องนั้นเป็นผนังไหม — รับประกันไม่ข้ามผนัง" },
      { code: String.raw`เตรียม: delta_dist = ระยะ ray ที่เดินข้าม 1 ช่องเต็ม
  delta_x = |1 / ray_dir_x|     (กัน /0 ด้วยค่าใหญ่ 1e30)
  delta_y = |1 / ray_dir_y|

step (+1/−1) = ทิศที่ ray ไปบนแกนนั้น
side_x/side_y = ระยะจาก pos ถึงเส้น grid แรกบนแต่ละแกน

วน DDA:
  while (ช่องปัจจุบันไม่ใช่ผนัง):
    if (side_x < side_y):        # เส้นแนวตั้งใกล้กว่า
        side_x += delta_x; map_x += step_x; side = 0   # ชนด้าน x
    else:                        # เส้นแนวนอนใกล้กว่า
        side_y += delta_y; map_y += step_y; side = 1   # ชนด้าน y
    if (map เป็น '1' / space / นอกขอบ): break   # เจอผนัง`, cap: "เลือกเส้น grid ที่ใกล้กว่าเดินไปทีละช่อง → เร็วและไม่มีทางทะลุผนัง", lang: "txt" },
      { p: "**ทำไมเร็ว:** DDA ข้ามทั้งช่องว่างในก้าวเดียว — ห้องโล่งใหญ่แค่ไหนก็เดินไม่กี่ก้าวถึงผนัง (ต่างจาก ray marching ที่ก้าวเล็ก ๆ คงที่). จำนวนก้าว ≈ จำนวนช่อง grid ที่ ray ผ่าน" },
      { note: "ลองพิสูจน์เอง: ต้อง treat **space และนอกขอบ = ผนัง** ด้วย ไม่งั้นผู้เล่นยิง ray ทะลุออกนอกแผนที่แล้ว DDA วนไม่จบ (segfault/ค้าง). guard delta ด้วย 1e30 เมื่อ ray_dir = 0 (ray ขนานแกน)" },
      { qa: [
        { q: "DDA ต่างจากการคืบ ray ทีละนิดยังไง?", a: "DDA กระโดดไปเส้น grid ถัดไปทันที (เลือกแนวตั้ง/นอนอันใกล้กว่า) แล้วเช็คทีละช่อง — เร็วกว่ามากและไม่มีทางข้ามผนัง ต่างจาก ray marching ที่ก้าวเล็กคงที่ (ช้า/อาจพลาด)" },
        { q: "delta_dist คืออะไร?", a: "ระยะที่ ray เดินเมื่อข้าม 1 ช่อง grid เต็มบนแกนนั้น = |1/ray_dir|; ใช้บวกสะสมหาเส้น grid ถัดไป (กัน /0 ด้วยค่าใหญ่ 1e30)" },
        { q: "ทำไม space/นอกขอบต้องเป็นผนัง?", a: "ถ้าไม่ treat เป็นผนัง ray ที่หลุดออกนอกแผนที่จะทำ DDA วนไม่จบ → ค้าง/segfault; การ validate map ปิดก็กันผู้เล่นออกไปตรงนั้น" },
      ]},

      { h: "🔬 เจาะลึก C: Fisheye Correction — ทำไมต้องใช้ระยะตั้งฉาก" },
      { p: "**ภาพในหัว:** ถ้าวัดระยะจากผู้เล่นถึงผนังแบบ Euclidean (ระยะตรงจริง) ผนังเรียบจะดู **โป่งกลางจอ** เพราะ ray ที่ขอบจอวิ่งเฉียงไกลกว่า ray กลางจอ → ผนังเดียวกันดูใกล้ตรงกลาง ไกลที่ขอบ = บิดเบี้ยว" },
      { code: String.raw`ผนังเรียบเส้นเดียว มองจากบน:

   ขอบจอ ╲          ╱ ขอบจอ
          ╲  ผนัง  ╱
   ━━━━━━━━╳━━━━━━╳━━━━━━━━  ผนัง (เรียบ)
            ╲    ╱
             ╲  ╱
              ╲╱
          [ผู้เล่น]

Euclidean: ray ขอบยาวกว่า ray กลาง → ผนังโป่ง (fisheye) ✗
Perpendicular: ฉายระยะลงบน 'dir' → ทุกจุดบนผนังเรียบได้ระยะเท่ากัน ✓

แทนที่จะ √(dx²+dy²) ใช้ค่าที่ DDA มีอยู่แล้ว:
  if side == 0:  perp = (map_x − pos_x + (1−step_x)/2) / ray_dir_x
  else:          perp = (map_y − pos_y + (1−step_y)/2) / ray_dir_y
  line_h = WIN_H / perp`, cap: "perp = ระยะตั้งฉากกับระนาบกล้อง → ผนังเรียบดูเรียบ (ลบ fisheye)", lang: "txt" },
      { p: "**ทำไมสูตรนี้คือระยะตั้งฉาก:** มันคือระยะตามแกน ray หารด้วยองค์ประกอบ ray บนแกนนั้น ซึ่งเท่ากับการ project ระยะลงบนทิศ dir พอดี — ตัดส่วนเฉียงทิ้ง เหลือ 'ความลึกเข้าจอ' จริง" },
      { note: "ลองพิสูจน์เอง: ลองใช้ระยะ Euclidean (√) แทน perp แล้ว render — ผนังจะโค้งโป่งกลางจอเหมือนมองผ่านเลนส์ตาปลา. เปลี่ยนกลับเป็น perp แล้วผนังตรงทันที" },
      { qa: [
        { q: "fisheye เกิดจากอะไร?", a: "ใช้ระยะ Euclidean (ระยะตรงจริงถึงผนัง): ray ที่ขอบจอวิ่งเฉียงไกลกว่า ray กลางจอ → ผนังเรียบเส้นเดียวดูใกล้ตรงกลาง ไกลที่ขอบ = โป่ง" },
        { q: "แก้ fisheye ยังไง?", a: "ใช้ระยะ 'ตั้งฉากกับระนาบกล้อง' (perpendicular distance) แทน Euclidean — project ระยะลงบนทิศ dir → ทุกจุดบนผนังเรียบได้ระยะเท่ากัน" },
        { q: "line_height คำนวณยังไง?", a: "= WIN_H / perpDist; ผนังใกล้ (perp น้อย) = แถบสูง, ไกล = แถบเตี้ย; วาดจากกลางจอขึ้น-ลงเท่ากัน" },
      ]},

      { h: "🔬 เจาะลึก D: Texture Mapping — เลือก texture + แปะให้ตรงด้าน" },
      { p: "**ภาพในหัว:** รู้ว่าชนผนังแล้ว ยังต้องตอบ 2 ข้อ: (1) ผนัง **ด้านไหน** (เหนือ/ใต้/ออก/ตก → texture ไหน) (2) ชน **ตรงไหน** บนผนัง → คอลัมน์ไหนของ texture" },
      { code: String.raw`เลือก texture จาก side + ทิศ ray (เขียนด้วย if ไม่ใช่ ?:):
  side == 0 (ผนังแนวตั้ง):  ray_dir_x > 0 → EA   else → WE
  side == 1 (ผนังแนวนอน):  ray_dir_y > 0 → SO   else → NO

หา wall_x = จุดที่ชนบนผนัง (เศษ 0..1):
  if side == 0:  wall_x = pos_y + perp · ray_dir_y
  else:          wall_x = pos_x + perp · ray_dir_x
  wall_x −= floor(wall_x)            # เก็บแต่เศษ 0..1
  tex_x = wall_x · TEX_W             # → คอลัมน์ texture

พลิก tex_x 2 ใน 4 กรณี (ไม่งั้น texture กลับด้าน):
  if (side == 0 && ray_dir_x > 0): tex_x = TEX_W − tex_x − 1
  if (side == 1 && ray_dir_y < 0): tex_x = TEX_W − tex_x − 1`, cap: "side+ทิศ → texture ไหน; wall_x → คอลัมน์ไหน; พลิกบางกรณีกัน texture กลับ", lang: "txt" },
      { code: String.raw`วาดแถบแนวตั้ง + เดิน texture ตามความสูง:
  step    = TEX_H / line_h          # texture เดินกี่ pixel ต่อ 1 pixel จอ
  tex_pos = (start − WIN_H/2 + line_h/2) · step
  for y in [start..end]:
    tex_y = (int)tex_pos & (TEX_H−1) # clamp กันอ่านนอก texture
    tex_pos += step
    put_pixel(x, y, sample(tex, tex_x, tex_y))
  // เหนือ start = สีเพดาน, ใต้ end = สีพื้น`, cap: "ผนังใกล้ (line_h สูง) → step เล็ก = texture ยืด; ไกล → step ใหญ่ = บีบ", lang: "txt" },
      { note: "ลองพิสูจน์เอง: ข้ามขั้นพลิก tex_x — เดินรอบห้องจะเห็น texture บางด้าน 'กลับซ้ายขวา' (เช่นตัวหนังสือบนผนังกลับด้าน). และต้อง `& (TEX−1)` clamp ไม่งั้นผนังที่ชิดตัวมาก (line_h > จอ) อ่าน texture เกินขอบ → segfault" },
      { qa: [
        { q: "เลือก texture 1 ใน 4 ยังไง?", a: "จาก side (ชนผนังแนวตั้ง=0 / แนวนอน=1) + ทิศ ray: side0 → ray_dir_x>0?EA:WE; side1 → ray_dir_y>0?SO:NO (เขียนด้วย if ตาม norm)" },
        { q: "wall_x และ tex_x คืออะไร?", a: "wall_x = ตำแหน่งที่ ray ชนบนผนัง (เศษ 0..1 ของช่อง); tex_x = wall_x·TEX_W = คอลัมน์ของ texture ที่จะหยิบมาวาดแถบนั้น" },
        { q: "ทำไมต้องพลิก tex_x บางกรณี?", a: "2 ใน 4 ทิศ (side0&ray_x>0, side1&ray_y<0) ทิศการกวาด texture กลับด้าน → ต้อง tex_x = TEX_W−tex_x−1 ไม่งั้น texture กลับซ้ายขวา" },
      ]},
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Lode's Computer Graphics — Raycasting", url: "https://lodev.org/cgtutor/raycasting.html", note: "ต้นตำรับ DDA + texture + sprite (อ่านอันนี้พอ)" },
        { label: "Lode — Raycasting II (texture)", url: "https://lodev.org/cgtutor/raycasting2.html", note: "texture mapping เต็ม + floor/ceiling" },
        { label: "Lode — Raycasting III (sprites)", url: "https://lodev.org/cgtutor/raycasting3.html", note: "sprite casting + z-buffer (bonus)" },
        { label: "Wolfenstein 3D (Wikipedia)", url: "https://en.wikipedia.org/wiki/Wolfenstein_3D", note: "เกมต้นกำเนิด raycasting FPS" },
        { label: "DDA line algorithm (Wikipedia)", url: "https://en.wikipedia.org/wiki/Digital_differential_analyzer_(graphics_algorithm)", note: "ที่มาของ DDA" },
        { label: "MiniLibX docs (Harm Smits 42docs)", url: "https://harm-smits.github.io/42docs/libs/minilibx", note: "คู่มือ mlx (image, hook, event)" },
      ]},
    ],
    foundations: [
      { p: "หมวดนี้เจาะ **struct, image buffer, และ map ที่ไม่ใช่สี่เหลี่ยม** ของ cub3D" },
      { h: "struct หลัก" },
      { code: String.raw`typedef struct s_player {
    double pos_x, pos_y;       // ตำแหน่งบน grid (จุดทศนิยม)
    double dir_x, dir_y;       // ทิศหันหน้า (normalize)
    double plane_x, plane_y;   // ระนาบกล้อง (⊥ dir, ยาว 0.66 = FOV 66°)
} t_player;

typedef struct s_ray {         // state ต่อ 1 คอลัมน์
    double dir_x, dir_y;
    int    map_x, map_y;       // ช่อง grid ปัจจุบัน
    double delta_x, delta_y;   // ระยะข้าม 1 ช่อง
    double side_x, side_y;     // ระยะถึงเส้น grid ถัดไป
    int    step_x, step_y;     // +1/−1
    int    side;               // 0=ชนแนวตั้ง 1=ชนแนวนอน
    double wall_dist, wall_x;  // ระยะ(perp) + จุดชนบนผนัง
    int    tex;                // texture ไหน (NO/SO/WE/EA)
} t_ray;

typedef struct s_img {         // image buffer (วาดทั้งเฟรมก่อน put)
    void *ptr; char *addr;
    int bpp, line_len, endian, w, h;
} t_img;

typedef struct s_map {
    char **grid;               // ตาราง (แต่ละแถวยาวไม่เท่ากันได้!)
    int    height, width;
} t_map;`, cap: "player ถือ dir+plane; ray คือ scratch ต่อคอลัมน์; map เป็น char** แถวยาวไม่เท่ากัน", lang: "c" },
      { h: "image buffer — วาดทั้งเฟรมแล้ว put ครั้งเดียว" },
      { p: "อย่าใช้ `mlx_pixel_put` ต่อ pixel (ช้ามาก — round-trip ไป X server ทุกจุด). เขียนลง buffer ของ image เองด้วย pointer แล้ว `mlx_put_image_to_window` ครั้งเดียวต่อเฟรม:" },
      { code: String.raw`void put_pixel(t_img *img, int x, int y, int color) {
    if (x < 0 || x >= WIN_W || y < 0 || y >= WIN_H) return;  // กันนอกขอบ
    char *dst = img->addr + y * img->line_len + x * (img->bpp / 8);
    *(unsigned int *)dst = color;
}`, cap: "คำนวณ offset ในหน่วยความจำเอง = เร็วกว่า mlx_pixel_put หลายร้อยเท่า", lang: "c" },
      { h: "map ไม่ใช่สี่เหลี่ยม + มี space" },
      { p: "แถวแผนที่ยาวไม่เท่ากัน และมีช่องว่างกลางแถวได้ → **ห้ามสมมติความกว้างคงที่**. เก็บเป็น `char**` (แต่ละแถวคือ string ของมัน). เวลาเช็คเพื่อนบ้านต้องเทียบกับ `strlen(แถวนั้น)` ไม่ใช่ width รวม" },
      { h: "ตั้งท่าผู้เล่นตอน scan map" },
      { code: String.raw`// เจอ N/S/E/W ตอน scan → ตั้ง pos กลางช่อง + dir/plane (boolean arithmetic)
p->pos_x = j + 0.5;  p->pos_y = i + 0.5;        // กลาง tile
p->dir_x   = (c == 'E') - (c == 'W');
p->dir_y   = (c == 'S') - (c == 'N');
p->plane_x = 0.66 * (c == 'N') - 0.66 * (c == 'S');
p->plane_y = 0.66 * (c == 'E') - 0.66 * (c == 'W');`, cap: "boolean arithmetic เลี่ยง ?: และ comma operator ที่ norm ไม่ชอบ", lang: "c" },
    ],
    architecture: [
      { h: "ไฟล์ในโปรเจกต์ (แบ่งตาม norm: ≤5 ฟังก์ชัน/ไฟล์)" },
      { table: { head: ["ไฟล์", "หน้าที่"], rows: [
        ["`main.c`", "check args → load_scene → init → mlx_loop"],
        ["`parse.c` + `parse_*.c`", "อ่าน .cub: element/color/map"],
        ["`validate.c`", "map ปิดสนิท + 1 ผู้เล่น + char ถูกต้อง"],
        ["`raycast.c`", "วน 1280 คอลัมน์: setup ray → DDA → draw"],
        ["`dda.c`", "เดิน grid หาผนัง + perp distance"],
        ["`draw.c`", "วาดแถบ + แปะ texture + พื้น/เพดาน"],
        ["`player.c`", "เดิน (collision per-axis) + หมุน (matrix)"],
        ["`hooks.c`", "keypress/release + loop_hook + close"],
        ["`free.c` / `error.c`", "คืน memory ทุก path / Error\\n"],
      ]}},
      { h: "การไหล (.cub → เฟรม)" },
      { code: String.raw`.cub → parse (element+color+map) → validate (ปิด? ผู้เล่น?)
   │
   ▼
init mlx + โหลด 4 texture (xpm) เป็น image
   │
   ▼  loop_hook (ทุกเฟรม):
   ├─ move/rotate ตาม key ที่กดค้าง
   ├─ for x in [0..WIN_W): setup ray → DDA → draw column
   └─ mlx_put_image_to_window (ทั้งเฟรมทีเดียว)`, cap: "parse→validate (headless) เกิดก่อน mlx → error path ไม่ leak X11", lang: "txt" },
      { note: "สำคัญ: validate **ก่อน** mlx_init เสมอ → ทุก error path เป็น headless (valgrind สะอาด ไม่มี X11 still-reachable)" },
      { h: "error-return contract — กับดักที่กินเวลาที่สุด" },
      { p: "ให้ helper `error_msg()` คืน **0** (= ล้มเหลว) ให้ตรงกับ predicate ทั้งหมดที่เช็คแบบ `if (!parse(...))`. ถ้าทำคืน 1 จะกลายเป็น 'พิมพ์ Error แล้วโปรแกรมคิดว่าสำเร็จ' → parse ต่อ (เห็น Error ซ้อนหลายบรรทัด) แล้วตกไป mlx_loop ค้างตลอด" },
    ],
    dataflow: [
      { p: "ไล่ฟังก์ชันหลักของ raycasting ทีละตัว" },
      { h: "raycast() — วนทุกคอลัมน์" },
      { code: String.raw`void raycast(t_game *g) {
    int x = 0;
    while (x < WIN_W) {
        t_ray r;
        double cam = 2.0 * x / WIN_W - 1.0;          // −1..+1
        r.dir_x = g->p.dir_x + g->p.plane_x * cam;
        r.dir_y = g->p.dir_y + g->p.plane_y * cam;
        setup_dda(&r, &g->p);                        // delta/step/side แรก
        run_dda(g, &r);                              // เดินจนชนผนัง → perp
        draw_column(g, &r, x);                       // แถบ + texture
        x++;
    }
    mlx_put_image_to_window(g->mlx, g->win, g->img.ptr, 0, 0);
}`, cap: "1 คอลัมน์ = 1 ray; วาดลง buffer ครบ 1280 แล้ว put ทีเดียว", lang: "c" },
      { h: "run_dda() — เดิน grid หาผนัง" },
      { code: String.raw`void run_dda(t_game *g, t_ray *r) {
    int hit = 0;
    while (!hit) {
        if (r->side_x < r->side_y) {                 // เส้นตั้งใกล้กว่า
            r->side_x += r->delta_x; r->map_x += r->step_x; r->side = 0;
        } else {                                     // เส้นนอนใกล้กว่า
            r->side_y += r->delta_y; r->map_y += r->step_y; r->side = 1;
        }
        if (is_wall(g, r->map_x, r->map_y))          // '1'/space/นอกขอบ
            hit = 1;
    }
    if (r->side == 0)                                // perp distance (ลบ fisheye)
        r->wall_dist = (r->map_x - g->p.pos_x + (1 - r->step_x) / 2.0) / r->dir_x;
    else
        r->wall_dist = (r->map_y - g->p.pos_y + (1 - r->step_y) / 2.0) / r->dir_y;
}`, cap: "เลือกเส้น grid ใกล้กว่าเดินทีละช่อง จนชนผนัง → คำนวณ perp distance", lang: "c" },
      { h: "draw_column() — แถบ + texture" },
      { code: String.raw`void draw_column(t_game *g, t_ray *r, int x) {
    t_draw d;
    d.line_h = (int)(WIN_H / r->wall_dist);
    d.start  = -d.line_h / 2 + WIN_H / 2;
    d.end    =  d.line_h / 2 + WIN_H / 2;
    if (d.start < 0) d.start = 0;
    if (d.end >= WIN_H) d.end = WIN_H - 1;
    select_tex(r);                                   // NO/SO/WE/EA + wall_x
    int tex_x = tex_column(g, r);                    // wall_x·TEX_W (+พลิก)
    d.step = (double)TEX_H / d.line_h;
    d.tex_pos = (d.start - WIN_H / 2 + d.line_h / 2) * d.step;
    draw_ceiling(g, x, d.start);                     // เหนือ = สีเพดาน
    draw_wall(g, r, x, &d, tex_x);                   // กลาง = texture
    draw_floor(g, x, d.end);                         // ใต้ = สีพื้น
}`, cap: "line_h จากระยะ → แถบสูง/เตี้ย; เพดาน-ผนัง-พื้น ครบ 1 คอลัมน์", lang: "c" },
      { h: "move_player() — เดิน + ชนผนังแยกแกน" },
      { code: String.raw`void move_player(t_game *g) {
    double mx = (g->keys.w - g->keys.s);             // boolean arithmetic
    double nx = g->p.pos_x + g->p.dir_x * mx * MOVE_SPEED;
    double ny = g->p.pos_y + g->p.dir_y * mx * MOVE_SPEED;
    if (!is_wall(g, (int)nx, (int)g->p.pos_y))       // เช็คแกน X แยก
        g->p.pos_x = nx;
    if (!is_wall(g, (int)g->p.pos_x, (int)ny))       // เช็คแกน Y แยก
        g->p.pos_y = ny;
    // ↑ แยกแกน = 'wall slide' ไถลตามผนังได้ ไม่ติดหนึบ
}`, cap: "เช็ค X กับ Y แยกกัน → ไถลตามผนังได้ (ไม่ใช่หยุดสนิทเมื่อชนเฉียง)", lang: "c" },
      { note: "หมุนตัว: ใช้ rotation matrix 2×2 กับ **ทั้ง dir และ plane**; เดินจริงทำใน loop_hook (ลื่น+ทแยงได้) ไม่ใช่ใน keypress" },
    ],
    implementation: [
      { h: "ลำดับการลงมือเขียน (แนะนำ)" },
      { ul: [
        "1. parse .cub: element (NO/SO/WE/EA/F/C) + แผนที่เป็น char** ก่อน",
        "2. validate: 6 element ครบ ไม่ซ้ำ, 1 ผู้เล่น, char ถูก, **แผนที่ปิด** (4-neighbour)",
        "3. เปิด mlx window + put_pixel ทดสอบ + วาดพื้น/เพดานสีล้วน",
        "4. **ยิง ray + DDA** วาดผนังสีล้วน (perp distance — เช็ค fisheye)",
        "5. โหลด texture (xpm) + แปะตามด้าน (side/wall_x/tex_x + พลิก)",
        "6. เดิน (WASD, collision แยกแกน) + หมุน (←→, matrix) ใน loop_hook",
        "7. hook ESC + ปิดหน้าต่าง → free ครบ + exit",
        "8. bonus: minimap, sprite ศัตรู (z-buffer+sort), ประตู, mouse-look (แยก build ด้วย Makefile stub)",
      ]},
      { h: "บั๊กยอดฮิตและวิธีกัน" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้"], rows: [
        ["พิมพ์ Error แล้วค้าง (exit 124)", "error_msg คืน 1 (predicate มอง 0=fail)", "ให้ error_msg คืน 0 — ใช้ convention เดียวทั้งโปรเจกต์"],
        ["ผนังโป่งกลางจอ (fisheye)", "ใช้ระยะ Euclidean", "ใช้ perpendicular distance"],
        ["DDA ค้าง/segfault", "space/นอกขอบไม่ถือเป็นผนัง / map ไม่ปิด", "is_wall treat space+OOB=ผนัง + validate ปิด"],
        ["texture กลับซ้ายขวา", "ไม่พลิก tex_x", "พลิก 2 ใน 4 กรณี"],
        ["ชนผนังเฉียงแล้วติดหนึบ", "เช็ค collision รวมแกน", "เช็ค X/Y แยกแกน (wall slide)"],
        ["norm 0 OK ทั้งที่โค้ดดี", "CRLF (\\r) / header 81 คอลัมน์", "sed ลบ \\r + ก๊อป header จากไฟล์ที่ผ่าน"],
      ]}},
      { h: "การ build / รัน / ตรวจ" },
      { code: String.raw`make            # mandatory
make bonus      # minimap + sprite + door + mouse-look
./cub3D maps/good.cub
norminette src/ include/        # 0 error (bonus ก็ตรวจ)
# mlx_loop บล็อก → ใช้ timeout แล้วถือ 124 = ผ่าน
timeout 3 ./cub3D maps/good.cub; echo "exit=$?"   # 124 = รัน loop = OK
valgrind --leak-check=full ./cub3D maps/err_dup.cub   # error path = 0 leak`, lang: "bash" },
      { note: "บน Windows: รันผ่าน WSL + WSLg (DISPLAY=:0, ต้องมี /tmp/.X11-unix/X0). มักไม่มีเครื่องมือ screenshot → ใช้ timeout (124=ผ่าน) + norm + valgrind เป็น automated pass แล้วยืนยันภาพด้วยตาคนตอนท้าย — ดู skill build-42-projects-on-windows" },
    ],
    tricks: [
      { h: "ทริค 1: error_msg คืน 0 — convention เดียวทั้งโปรเจกต์" },
      { p: "ทุก predicate ใช้ '0=fail, 1=ok'; ให้ error_msg คืน 0 แล้ว `return (error_msg(...))` = ส่งสัญญาณล้มเหลวถูกต้อง หยุด chain ที่ error แรก. main ห่อด้วย helper `if (!check(...)) return (1)` แทน comma operator ที่ norm ไม่ชอบ" },
      { h: "ทริค 2: perpendicular distance เสมอ" },
      { p: "ใช้ค่าที่ DDA มีอยู่แล้ว (ไม่ต้อง √): `(map − pos + (1−step)/2)/ray_dir` = ระยะตั้งฉาก → ลบ fisheye ฟรี" },
      { h: "ทริค 3: space + นอกขอบ = ผนัง" },
      { p: "`is_wall` คืน true เมื่อ '1', space, หรือนอกขอบ/เกิน strlen แถว → DDA ไม่มีทางหลุดแผนที่ (กันค้าง) และช่วย validate ไปในตัว" },
      { h: "ทริค 4: collision แยกแกน = wall slide" },
      { p: "เช็ค target X กับ target Y แยกกัน — ชนผนังเฉียงแล้วยังไถลตามผนังได้ ไม่หยุดหนึบ (ความรู้สึกเกมดีขึ้นมาก)" },
      { h: "ทริค 5: เขียนลง image buffer ไม่ใช่ mlx_pixel_put" },
      { p: "put_pixel เขียน addr+y·line_len+x·bpp/8 เองแล้ว put_image ครั้งเดียว/เฟรม — เร็วกว่า mlx_pixel_put (X round-trip ต่อ pixel) หลายร้อยเท่า" },
      { h: "ทริค 6: bonus ใช้ Makefile stub ไม่ใช่ #ifdef" },
      { p: "norm แบน `#ifdef` ในฟังก์ชัน (PREPOC_ONLY_GLOBAL). ให้ mandatory `.c` เรียก hook (`record_enemy`/`init_bonus`/`render_bonus`) เปล่า ๆ; `bonus.c` = hook จริง (build bonus), `stub.c` = hook ว่าง (build mandatory); `#ifdef` มีได้แค่ใน header เป็น macro ตัวเดียว (ENEMY_CH '2' vs '0')" },
      { h: "ทริค 7: sprite ต้องมี z-buffer + sort (bonus)" },
      { p: "เก็บ wall_dist ทุกคอลัมน์ลง zbuf[WIN_W]; วาด sprite ทีหลังโดยเช็ค `ty < zbuf[x]` (ผนังบังศัตรู) + เรียงศัตรูไกล→ใกล้ก่อนวาด + ข้ามสี key โปร่งใส (0xFF00FF)" },
      { h: "ทริค 8: ลบ CRLF + ก๊อป header ก่อน norm" },
      { p: "ไฟล์จาก Windows มี \\r → `sed -i 's/\\r$//'` ก่อน; header 42 ต้อง 80 คอลัมน์เป๊ะ → ก๊อปจากไฟล์ที่ผ่านแล้ว (เช่น libft) เปลี่ยนแค่ชื่อไฟล์ อย่านับเอง" },
    ],
    eval: [
      { qa: [
        { q: "raycasting ทำงานยังไงในหนึ่งประโยค?", a: "ยิง ray 1 เส้นต่อ 1 คอลัมน์จอจากผู้เล่นบน grid 2D, DDA หาผนังที่ชน+ระยะ, แล้ววาดแถบผนังแนวตั้งสูงตามระยะ (ใกล้สูง ไกลเตี้ย) พร้อม texture" },
        { q: "dir กับ plane ต่างกันยังไง?", a: "dir = ทิศหันหน้า; plane = ระนาบกล้องตั้งฉาก dir (ยาว 0.66 = FOV 66°); ray คอลัมน์ x = dir + plane·camera_x" },
        { q: "DDA คืออะไร ทำไมใช้?", a: "Digital Differential Analyzer — เดิน ray ทีละเส้น grid (เลือกแนวตั้ง/นอนอันใกล้กว่า) จนชนผนัง; เร็วและไม่มีทางทะลุผนัง ต่างจากการคืบทีละนิด" },
        { q: "fisheye เกิดจากอะไร แก้ยังไง?", a: "ใช้ระยะ Euclidean → ray ขอบจอเฉียงไกลกว่ากลาง → ผนังโป่ง; แก้ด้วย perpendicular distance (project ระยะลงบน dir)" },
        { q: "line_height คำนวณยังไง?", a: "= WIN_H / perpDist; ผนังใกล้=แถบสูง ไกล=เตี้ย; วาดจากกลางจอขึ้น-ลงเท่ากัน เหนือ=เพดาน ใต้=พื้น" },
        { q: "เลือก texture 1 ใน 4 ยังไง?", a: "จาก side (ผนังแนวตั้ง0/แนวนอน1)+ทิศ ray: side0→ray_x>0?EA:WE; side1→ray_y>0?SO:NO; wall_x→คอลัมน์ texture (พลิกบางกรณี)" },
        { q: "parse แยกผู้เล่น (N/S/E/W) จาก texture id (NO/SO) ยังไง?", a: "element line = id ตามด้วยช่องว่าง และ parse id ก่อนบล็อกแผนที่เริ่มเท่านั้น; บรรทัดแผนที่บรรทัดแรก = ที่เหลือเป็นแผนที่ทั้งหมด" },
        { q: "ตรวจ 'แผนที่ปิด' ยังไง ในเมื่อ map ไม่ใช่สี่เหลี่ยม?", a: "ทุกช่องเดินได้เช็ค 4 เพื่อนบ้าน: หลุดขอบ/เกิน strlen แถว/เป็น space = เปิด=error; เทียบกับ strlen แต่ละแถว (ไม่ใช่ width รวม) → รองรับแถวยาวไม่เท่ากัน" },
        { q: "ทำไม error_msg ต้องคืน 0?", a: "predicate ทั้งหมดเช็ค if(!parse(...)) = 0 คือ fail; ถ้า error_msg คืน 1 จะถูกมองว่าสำเร็จ → parse ต่อ พิมพ์ Error ซ้อน แล้วตกไป mlx_loop ค้าง" },
        { q: "ทำไมเช็ค collision แยกแกน X/Y?", a: "เพื่อให้ 'ไถลตามผนัง' (wall slide) เมื่อชนเฉียง — ถ้าเช็ครวมจะหยุดหนึบทันทีที่แตะผนัง" },
        { q: "bonus sprite ต้องระวังอะไร?", a: "z-buffer (เก็บ wall_dist ต่อคอลัมน์) ให้ผนังบังศัตรู, sort ไกล→ใกล้, ข้ามสีโปร่งใส (0xFF00FF), แปลงพิกัดเข้า camera space แล้วเช็ค depth>0" },
      ]},
      { h: "ทดสอบ" },
      { code: String.raw`make && norminette src/ include/                  # 0 error
timeout 3 ./cub3D maps/good.cub; echo "exit=$?"   # 124 = render loop = OK
./cub3D                          # Error (ไม่มี argument)
./cub3D maps/err_dup.cub         # Error (element ซ้ำ)
./cub3D maps/err_no_player.cub   # Error (ไม่มีผู้เล่น)
./cub3D notmap.txt               # Error (นามสกุลไม่ใช่ .cub)
valgrind --leak-check=full ./cub3D maps/err_color.cub   # 0 leak (headless)`, lang: "bash" },
    ],
  },
},
];
