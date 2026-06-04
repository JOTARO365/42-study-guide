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
      { p: "greedy มี 'ค่าโสหุ้ย' (ต้องดันลง B, คำนวณ cost). สำหรับ 2–5 ตัว การคำนวณพวกนี้ไม่คุ้ม — เคสเล็กมีจำนวนรูปแบบจำกัด (3 ตัวมีแค่ 6 แบบ) เราจึง **เขียนตายตัวให้ใช้ ops น้อยที่สุดเท่าที่เป็นไปได้** (3 ตัว ≤ 2 ops) ซึ่งดีกว่าปล่อยให้ greedy จัดการ" },
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
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Big-O notation — Wikipedia", url: "https://en.wikipedia.org/wiki/Big_O_notation", note: "นิยามเป็นทางการ + ตารางเทียบอัตราการเติบโต" },
        { label: "Comparison sort (lower bound) — Wikipedia", url: "https://en.wikipedia.org/wiki/Comparison_sort", note: "พิสูจน์ขอบล่าง Ω(n log n) ด้วย decision tree เต็ม ๆ" },
        { label: "VisuAlgo — Sorting (ภาพเคลื่อนไหว)", url: "https://visualgo.net/en/sorting", note: "ดู selection/insertion/merge ทำงานจริงแบบ visual" },
        { label: "VisuAlgo — Linked List & Stack", url: "https://visualgo.net/en/list", note: "เห็น pointer ของ linked list ขยับทีละขั้น" },
        { label: "Two's complement — Wikipedia", url: "https://en.wikipedia.org/wiki/Two%27s_complement", note: "ทำไม INT_MIN/INT_MAX ไม่สมมาตร + overflow" },
        { label: "Stirling's approximation — Wikipedia", url: "https://en.wikipedia.org/wiki/Stirling%27s_approximation", note: "ที่มาของ log₂(n!) ≈ n·log₂n" },
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
];
