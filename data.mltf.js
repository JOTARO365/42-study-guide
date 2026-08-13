/* Transformer — self-attention, multi-head, positional encoding, KV cache */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

window.TEACHING_DATA.push({
  id: "ml_tf",
  name: "Transformer — สถาปัตยกรรมที่อยู่เบื้องหลัง LLM ทั้งหมด",
  nameEn: "Transformer — The Architecture Behind Every LLM",
  titleShort: { th: "Transformer", en: "Transformer" },
  tag: {
    th: "เปเปอร์ปี 2017 ชื่อ Attention Is All You Need และคำสำคัญคือ 'all' — attention มีอยู่แล้วในหน้าที่แล้ว สิ่งที่ใหม่คือการ **ลบ recurrence ทิ้ง** ซึ่งทำให้เทรนขนานทุกตำแหน่งได้ และนั่นคือสิ่งที่ทำให้ scale เป็นไปได้",
    en: "The 2017 paper is called Attention Is All You Need, and the operative word is all — attention already existed on the previous page. What was new was deleting the recurrence, which made training parallel across positions and therefore made scale possible"
  },
  accent: "#38bdf8",
  sections: {
    principle: [
      { h: "สิ่งที่ transformer เพิ่ม คือการเอาของออก" },
      { p: "**attention มีอยู่แล้วตั้งแต่ปี 2014** ในหน้าที่แล้ว · สิ่งที่เปเปอร์ปี 2017 ทำคือ **ถอด RNN ทิ้งทั้งหมด แล้วเหลือแต่ attention** — ซึ่งฟังดูเหมือนการลดทอน แต่ผลคือทุกตำแหน่งคำนวณพร้อมกันได้ในการคูณเมทริกซ์ครั้งเดียว" },
      { code: String.raw`RNN:          h₁ → h₂ → h₃ → h₄        ต้องรอทีละก้าว
transformer:  ทุกตำแหน่งพร้อมกันในการคูณเมทริกซ์ครั้งเดียว

→ เทรนบน GPU ได้เต็มประสิทธิภาพ → เทรนโมเดลใหญ่ขึ้นได้ → scale`,
        cap: "ความสามารถในการขนานคือเหตุผลที่ชนะ ไม่ใช่ว่า attention ดีกว่า LSTM ในเชิงคุณภาพล้วน ๆ", lang: "txt" },
      { note: "**สอน transformer เป็น 'การเอาของออก' ไม่ใช่ 'การเพิ่มของ'** — ถ้าเข้าใจว่า attention คืออะไรจากหน้าที่แล้ว หน้านี้เหลือแค่สามเรื่องใหม่: self-attention, multi-head, และ positional encoding" },
      { h: "สามเรื่องใหม่ที่ต้องเข้าใจ" },
      { table: { head: ["เรื่อง", "แก้อะไร"], rows: [
        ["**self-attention**", "ไม่มี encoder แยกแล้ว — q, k, v มาจากลำดับเดียวกันทั้งหมด"],
        ["**multi-head**", "หนึ่งหัวให้มุมมองเฉลี่ยมุมเดียว หลายหัวให้หลายความสัมพันธ์พร้อมกัน"],
        ["**positional encoding**", "**self-attention ไม่รู้จักลำดับเลย** ต้องฉีดตำแหน่งเข้าไปเอง"]
      ]}},
      { h: "ราคาที่ต้องจ่าย" },
      { code: String.raw`RNN:          O(n · d²)   โตเชิงเส้นตามความยาว แต่ขนานไม่ได้
transformer:  O(n² · d)   ขนานได้เต็มที่ แต่โตกำลังสองตามความยาว

n = 512     attention ยังถูกกว่า FFN มาก
n = 32,768  attention แพงกว่า FFN ราว 11 เท่า`,
        cap: "นี่คือเหตุผลทั้งหมดว่าทำไมบริบทยาวถึงแพง และทำไมงานวิจัยจำนวนมากพยายามลด n² ตัวนี้", lang: "txt" },
      { h: "หน้านี้จะทำให้ทำได้" },
      { ul: [
        "อธิบายว่า self-attention ต่างจาก attention ในหน้าที่แล้วตรงไหน",
        "รู้ว่า multi-head **แบ่ง** d_model ไม่ใช่ **เพิ่ม** พารามิเตอร์",
        "อธิบายว่าทำไมสถาปัตยกรรมนี้ไม่รู้จักลำดับ และ positional encoding แก้ยังไง",
        "เขียน causal mask ออกมาเป็นเมทริกซ์ แล้วอ่าน softmax ของแต่ละแถวได้",
        "นับพารามิเตอร์ของโมเดลจริงได้ครบ และคำนวณขนาด KV cache เป็นเมกะไบต์"
      ]}
    ],

    theory: [
      { p: "หมวดนี้ประกอบ transformer ทีละชิ้น โดยต่อยอดจาก attention ในหน้าที่แล้วโดยตรง" },
      { h: "1) self-attention — กลไกเดิม แต่ชี้กลับมาที่ตัวเอง" },
      { code: String.raw`หน้าที่แล้ว (cross-attention):  q มาจาก decoder · k, v มาจาก encoder
หน้านี้ (self-attention):       q, k, v มาจากลำดับเดียวกันทั้งหมด

Q = X W_Q      K = X W_K      V = X W_V         X มีขนาด (n, d_model)

Attention(Q,K,V) = softmax(Q Kᵀ / √d_k) V`,
        cap: "สมการเดียวกับหน้าที่แล้วทุกตัวอักษร ต่างแค่ที่มาของ q, k, v", lang: "txt" },
      { code: String.raw`Q Kᵀ มีขนาด (n, n)

→ ทุกตำแหน่งได้คะแนนเทียบกับทุกตำแหน่ง **ในการคูณเมทริกซ์ครั้งเดียว**
→ นี่คือความขนานที่ RNN ไม่มีทางทำได้`,
        cap: "เมทริกซ์ (n, n) นี้คือทั้งข้อดีและข้อเสียของ transformer พร้อมกัน", lang: "txt" },
      { h: "2) multi-head — แบ่ง ไม่ใช่เพิ่ม" },
      { code: String.raw`d_model = 512 · h = 8  →  d_k = d_model / h = 64 ต่อหัว

แต่ละหัวคำนวณ attention แยกกันบน 64 มิติของตัวเอง
แล้วต่อผลลัพธ์กลับเป็น 512 แล้วผ่าน W_O

พารามิเตอร์: 4 · d_model² เท่าเดิมทุกประการ ไม่ว่า h จะเป็นเท่าไร`,
        cap: "**เป็นการแบ่ง ไม่ใช่การเพิ่ม** — คนจำนวนมากเข้าใจว่า 8 หัวใช้พารามิเตอร์ 8 เท่า ซึ่งผิด", lang: "txt" },
      { p: "**ทำไมการแบ่งถึงดีกว่า**: หัวเดียวขนาด 512 ให้ค่าเฉลี่ยถ่วงน้ำหนักหนึ่งชุด คือมองความสัมพันธ์ได้แบบเดียว ส่วน 8 หัวให้ 8 ความสัมพันธ์พร้อมกัน · เมื่อตรวจดูจริงพบว่าหัวต่าง ๆ ทำงานคนละอย่าง บางหัวตามความสัมพันธ์ทางไวยากรณ์ บางหัวมองแค่ token ก่อนหน้า บางหัวจับคำที่พบยาก" },
      { h: "3) positional encoding — สถาปัตยกรรมนี้ไม่รู้จักลำดับ" },
      { code: String.raw`สลับแถวของ X → self-attention ให้ผลลัพธ์เดิมทุกตัว แค่สลับตำแหน่งตาม

**มันไม่มีแนวคิดเรื่องลำดับอยู่เลย** ต่างจาก RNN ที่ลำดับฝังอยู่ในโครงสร้าง

→ ต้องฉีดข้อมูลตำแหน่งเข้าไปเอง`,
        cap: "เรียกว่า permutation **equivariant** (output สลับตาม ไม่ใช่คงเดิม) และเป็นเหตุผลที่ positional encoding ไม่ใช่ของเสริม แต่จำเป็น · ข้อพิสูจน์นี้ใช้กับ self-attention ที่ยังไม่ใส่ mask เท่านั้น — causal mask ในหมวดถัดไปทำลายสมบัตินี้ทิ้ง", lang: "txt" },
      { table: { head: ["แบบ", "คุณสมบัติ"], rows: [
        ["**sinusoidal**", "คงที่ ไม่มีพารามิเตอร์ · ขยายเกินความยาวที่เทรนได้"],
        ["**learned**", "embedding หนึ่งตัวต่อหนึ่งตำแหน่ง · ง่าย แต่**เกินความยาวที่เทรนไม่ได้**"],
        ["**RoPE**", "หมุน Q กับ K ด้วยมุมที่แปรตามตำแหน่ง · **เข้ารหัสระยะสัมพัทธ์** · LLM ยุคใหม่ใช้ตัวนี้แทบทั้งหมด"]
      ]}},
      { h: "4) สูตรของ sinusoidal" },
      { code: String.raw`PE(pos, 2i)   = sin(pos / 10000^(2i/d))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d))

มิติต้น ๆ ความถี่สูง (เปลี่ยนเร็ว) → บอกตำแหน่งละเอียด
มิติท้าย ๆ ความถี่ต่ำ (เปลี่ยนช้า) → บอกตำแหน่งหยาบ ๆ ในระยะไกล`,
        cap: "เหมือนเลขฐานสองที่แต่ละบิตเปลี่ยนความถี่ต่างกัน — รวมกันแล้วระบุตำแหน่งได้ไม่ซ้ำ", lang: "txt" },
      { h: "5) โครงของหนึ่ง block" },
      { code: String.raw`pre-norm (ยุคใหม่ เทรนง่ายกว่า):
   x = x + Attention(LayerNorm(x))
   x = x + FFN(LayerNorm(x))

post-norm (แบบเปเปอร์ปี 2017):
   x = LayerNorm(x + Attention(x))
   x = LayerNorm(x + FFN(x))`,
        cap: "pre-norm เก็บเส้นทาง residual ที่สะอาดจาก output ถึง input ไว้ จึงซ้อนลึกได้โดยไม่ต้องพึ่ง warmup ที่ประณีตมาก", lang: "txt" },
      { p: "**โมเดลแทบทุกตัวตั้งแต่ราวปี 2020 เป็น pre-norm** — เพราะ post-norm ทำให้ layer norm คั่นอยู่บนเส้นทาง residual ซึ่งทำลายคุณสมบัติ `+1` ที่ทำให้ความลึกเทรนได้ ตามที่หน้าที่ 7 อธิบายไว้" },
      { h: "6) FFN — และความจริงที่คนเข้าใจผิด" },
      { code: String.raw`FFN(x) = W₂ · GELU(W₁ x + b₁) + b₂

d_model → 4·d_model → d_model        ขยายสี่เท่าแล้วบีบกลับ

พารามิเตอร์ต่อ block:
   attention   4 · d_model²        (W_Q, W_K, W_V, W_O)
   FFN         8 · d_model²        (ขยายกับบีบกลับ)
   รวม        12 · d_model²

**FFN กินสองในสาม**`,
        cap: "ใครที่คิดว่า transformer 'ส่วนใหญ่คือ attention' เข้าใจงบพารามิเตอร์กลับด้าน", lang: "txt" },
      { p: "**และ FFN ทำอะไร**: มันทำงานแยกกันในแต่ละตำแหน่ง ไม่มีการผสมข้ามตำแหน่งเลย · attention คือการผสมข้ามตำแหน่ง ส่วน FFN คือการประมวลผลภายในตำแหน่ง — สองอย่างนี้สลับกันไปมาชั้นแล้วชั้นเล่า" },
      { h: "7) causal mask" },
      { code: String.raw`เติม −inf ที่ครึ่งบนของเมทริกซ์คะแนน ก่อน softmax

   [  s₀₀  −inf  −inf  −inf ]
   [  s₁₀   s₁₁  −inf  −inf ]
   [  s₂₀   s₂₁   s₂₂  −inf ]
   [  s₃₀   s₃₁   s₃₂   s₃₃ ]

→ ตำแหน่ง t มองเห็นได้ถึง t เท่านั้น`,
        cap: "**ขาดตัวนี้ language model จะโกงทันที** — มันอ่าน token ที่ถูกถามให้ทำนายได้ตรง ๆ loss จะลงใกล้ศูนย์แต่สร้างข้อความไม่ได้เลย", lang: "txt" },
      { h: "8) สามตระกูล" },
      { table: { head: ["ตระกูล", "mask", "เก่งอะไร", "ตัวอย่าง"], rows: [
        ["**encoder-only**", "ไม่มี มองสองทาง", "จำแนก · ค้นคืน · NER", "BERT"],
        ["**decoder-only**", "causal", "**สร้างข้อความ และปัจจุบันคือแทบทุกอย่าง**", "GPT"],
        ["**encoder-decoder**", "มีทั้งคู่", "แปลภาษา · สรุปความ", "T5"]
      ]}},
      { p: "**ทำไม decoder-only ถึงกลืนทุกอย่างไป**: เพราะงานเกือบทุกงานเขียนเป็นการสร้างข้อความต่อได้ ทั้งการจำแนก การตอบคำถาม และการสรุป จึงใช้โมเดลชนิดเดียวเทรนครั้งเดียวแล้วใช้ได้หมด" },
      { h: "9) KV cache" },
      { code: String.raw`ตอนสร้างข้อความทีละ token: K กับ V ของ token เก่าไม่เปลี่ยนเลย
→ เก็บไว้แทนที่จะคำนวณใหม่ทุกครั้ง

ขนาด = 2 · n_layers · n · d_model · จำนวนไบต์ต่อค่า
       ‾
       K กับ V`,
        cap: "โตเชิงเส้นตามความยาวบริบท และที่บริบทยาวมันมักใหญ่กว่าตัวน้ำหนักของโมเดลเสียอีก", lang: "txt" },
      { h: "10) ทำไม token แรกช้า แล้วที่เหลือเร็ว" },
      { table: { head: ["ช่วง", "ทำอะไร", "คอขวด"], rows: [
        ["**prefill**", "ประมวลผล prompt ทั้งก้อนพร้อมกัน", "**compute** — คูณเมทริกซ์ใหญ่"],
        ["**decode**", "สร้างทีละ token โดยอ่าน KV cache ทั้งหมด", "**memory bandwidth** — FLOPs น้อยแต่ต้องอ่านข้อมูลเยอะ"]
      ]}},
      { note: "**นี่คือเหตุผลที่ token แรกใช้เวลานานแล้วที่เหลือไหลออกมาเร็ว** และเป็นเหตุผลที่การเพิ่มขนาด batch ตอน inference ช่วยได้มาก เพราะน้ำหนักที่อ่านมาแล้วถูกใช้กับหลาย request พร้อมกัน" }
    ],

    foundations: [
      { p: "หมวดนี้เจาะตัวเลขที่ตัดสินเรื่องสถาปัตยกรรมและการนำไปใช้จริง" },
      { h: "นับพารามิเตอร์ของ GPT-2 small ให้ครบทุกตัว" },
      { code: String.raw`L = 12 ชั้น · d_model = 768 · vocab = 50,257 · context = 1,024

ต่อหนึ่ง block:
   attention (W_Q,W_K,W_V,W_O + bias)   2,362,368
   FFN (768→3072→768 + bias)            4,722,432
   layer norm สองตัว                        3,072
                                        ‾‾‾‾‾‾‾‾‾
   รวมต่อ block                         7,087,872

12 blocks                              85,054,464
token embedding  50,257 × 768          38,597,376
positional embedding  1,024 × 768         786,432
layer norm สุดท้าย                          1,536
                                      ‾‾‾‾‾‾‾‾‾‾‾
รวมทั้งหมด                            124,439,808`,
        cap: "ตรงกับ '124M' ที่รายงานกันทุกที่ · lm_head ใช้น้ำหนักร่วมกับ token embedding จึงไม่นับซ้ำ", lang: "txt" },
      { h: "กฎ 12·d² ใช้ได้แค่ไหน" },
      { code: String.raw`12 · d_model² = 12 × 768² = 7,077,888
ค่าจริงต่อ block                        7,087,872

ต่างกัน 9,984 ตัว ซึ่งคือ bias กับ layer norm ทั้งหมด (0.14%)`,
        cap: "จึงประมาณขนาดโมเดลได้เร็ว ๆ ด้วย `12 · L · d²` แล้วบวก embedding เข้าไป", lang: "txt" },
      { h: "สัดส่วนที่ต้องจำ" },
      { table: { head: ["ส่วน", "พารามิเตอร์", "สัดส่วนของ block"], rows: [
        ["attention", "`4 · d²`", "**33%**"],
        ["FFN", "`8 · d²`", "**67%**"],
        ["layer norm + bias", "ราว `10·d`", "น้อยกว่า 1%"]
      ]}},
      { h: "causal mask ด้วยตัวเลขจริง" },
      { code: String.raw`คะแนนดิบ 4×4 หลังหารด้วย √d_k แล้ว:

   [ 2.0  1.0  0.5  1.5 ]
   [ 0.5  2.0  1.0  0.0 ]
   [ 1.0  0.5  2.0  1.0 ]
   [ 0.0  1.0  1.5  2.0 ]

ใส่ mask แล้ว softmax ทีละแถว:
   แถว 0:  [2.0, −inf, −inf, −inf]  →  [1.0000, 0, 0, 0]
   แถว 1:  [0.5, 2.0, −inf, −inf]   →  [0.1824, 0.8176, 0, 0]
   แถว 2:  [1.0, 0.5, 2.0, −inf]    →  [0.2312, 0.1402, 0.6285, 0]
   แถว 3:  [0.0, 1.0, 1.5, 2.0]     →  [0.0641, 0.1744, 0.2875, 0.4740]`,
        cap: "แถว 0 มองเห็นแค่ตัวเองจึงได้ 1.0 แน่นอน และทุกแถวยังรวมได้ 1 พอดี", lang: "txt" },
      { h: "sinusoidal PE ด้วยตัวเลข" },
      { code: String.raw`d_model = 4

pos 0:  [0.0000,  1.0000, 0.0000, 1.0000]
pos 1:  [0.8415,  0.5403, 0.0100, 1.0000]
pos 2:  [0.9093, −0.4161, 0.0200, 0.9998]
pos 3:  [0.1411, −0.9900, 0.0300, 0.9996]

สองมิติแรกเปลี่ยนเร็ว (ความถี่สูง)
สองมิติหลังเปลี่ยนช้ามาก (ความถี่ต่ำ) — ใช้แยกตำแหน่งที่ห่างกันมาก`,
        cap: "สองมิติหลังแทบไม่ขยับใน 4 ตำแหน่งแรก แต่จะต่างชัดเจนที่ตำแหน่งหลักร้อยหรือหลักพัน", lang: "txt" },
      { h: "attention แพงกว่า FFN เมื่อไร" },
      { code: String.raw`d_model = 768 · นับ FLOPs จริงพร้อมค่าคงที่
   attention ≈ 4n²d   (QKᵀ กับ AV อย่างละ 2n²d)
   FFN       ≈ 16nd²  (ขยายกับบีบกลับ อย่างละ 8nd²)

n =    512   attention 8.05e8   FFN 4.83e9   attention/FFN = 0.17
n =  2,048   attention 1.29e10  FFN 1.93e10  attention/FFN = 0.67
n = 32,768   attention 3.30e12  FFN 3.09e11  attention/FFN = 10.7`,
        cap: "จุดพลิกอยู่ที่ราว n = 4·d_model — ต่ำกว่านั้น FFN คือค่าใช้จ่ายหลัก สูงกว่านั้น attention กลืนทุกอย่าง · ถ้าทิ้งค่าคงที่จะได้จุดพลิกที่ n = d_model ซึ่งเร็วเกินจริงสี่เท่า", lang: "txt" },
      { h: "KV cache ใหญ่แค่ไหนจริง ๆ" },
      { code: String.raw`ขนาด = 2 · L · n · d_model · 2 ไบต์ (fp16)

GPT-2 small  L=12  d=768   n=1,024   →      36 MB
โมเดล 7B     L=32  d=4096  n=4,096   →   2,048 MB  (2 GB)
โมเดล 7B     L=32  d=4096  n=32,768  →  16,384 MB  (16 GB)`,
        cap: "**ที่บริบท 32k ตัว cache ใหญ่กว่าน้ำหนักโมเดล 7B ที่ fp16 ซึ่งราว 14 GB** — นี่คือตัวเลขที่ตัดสินว่า deploy ได้หรือไม่", lang: "txt" },
      { note: "**และนี่คือที่มาของเทคนิคลด KV cache ทั้งหมด** — multi-query attention กับ grouped-query attention ให้หลายหัวใช้ K กับ V ร่วมกัน ซึ่งลดขนาด cache ลงหลายเท่าโดยกระทบคุณภาพน้อย" },
      { h: "ทำไม attention ถึงไม่รู้จักลำดับจริง ๆ" },
      { code: String.raw`softmax(QKᵀ)V  —  ทุกพจน์เป็นผลรวมข้ามตำแหน่ง

สลับแถวของ X ด้วย permutation P:
   Q' = PQ · K' = PK · V' = PV
   softmax(Q'K'ᵀ)V' = P · softmax(QKᵀ)V

→ ผลลัพธ์เดิมทุกตัว แค่ถูกสลับตามไปด้วย`,
        cap: "พิสูจน์ตรง ๆ ว่ามันไม่มีข้อมูลตำแหน่งเลย — ต้องฉีดเข้าไปเท่านั้น", lang: "txt" }
    ],

    architecture: [
      { p: "หมวดนี้คือการเลือกและตั้งค่าของจริง" },
      { h: "เลือกตระกูลไหน" },
      { table: { head: ["งาน", "ใช้", "เหตุผล"], rows: [
        ["จำแนกข้อความ · ค้นคืน · embedding", "**encoder-only** (BERT, E5)", "มองสองทางได้ และเบากว่ามาก"],
        ["สร้างข้อความ · chat · เขียนโค้ด", "**decoder-only** (GPT, Llama)", "เขียนงานอื่นเป็นการสร้างต่อได้หมด"],
        ["แปลภาษา · สรุปความแบบมีต้นฉบับชัดเจน", "**encoder-decoder** (T5)", "แยกการเข้าใจต้นทางกับการสร้างปลายทาง"],
        ["งานเล็กมาก ข้อมูลน้อย", "**fine-tune BERT เล็ก ๆ**", "ถูกและเร็วกว่าการใช้ LLM มาก"]
      ]}},
      { note: "**อย่าใช้ LLM ขนาดใหญ่กับงานจำแนกข้อความธรรมดา** — DistilBERT ที่ fine-tune แล้วมักแม่นกว่า เร็วกว่าหลายสิบเท่า และถูกกว่าหลายร้อยเท่า" },
      { h: "ค่ามาตรฐานของแต่ละขนาด" },
      { table: { head: ["โมเดล", "L", "d_model", "heads", "พารามิเตอร์"], rows: [
        ["GPT-2 small", "12", "768", "12", "124M"],
        ["GPT-2 medium", "24", "1024", "16", "355M"],
        ["BERT base", "12", "768", "12", "110M"],
        ["Llama-2 7B", "32", "4096", "32", "6.7B"],
        ["Llama-2 70B", "80", "8192", "64", "69B"]
      ]}},
      { p: "**สังเกตว่าขนาดต่อหัวถูกตรึงไว้แคบมาก** — 64 มิติในรุ่น GPT-2 กับ BERT และ 128 มิติในรุ่น Llama · เมื่อ d_model โตขึ้น สิ่งที่เพิ่มคือจำนวนหัว ไม่ใช่ขนาดของแต่ละหัว" },
      { h: "โครงของหนึ่ง block เขียนเป็นแผนภาพ" },
      { code: String.raw`      x
      ├──────────────┐
   LayerNorm         │
      ↓              │
  Multi-Head Attn    │  ← เส้นทาง residual สะอาด ไม่มีอะไรคั่น
      ↓              │
      +──────────────┘
      ├──────────────┐
   LayerNorm         │
      ↓              │
     FFN             │
      ↓              │
      +──────────────┘
      ↓`,
        cap: "เส้นทางด้านขวาคือ `+1` ในอนุพันธ์ที่หน้าที่ 7 อธิบายไว้ — pre-norm รักษาเส้นนี้ไว้ไม่ให้มีอะไรมาคั่น", lang: "txt" },
      { h: "fine-tune LLM ยังไง" },
      { table: { head: ["วิธี", "อัปเดตอะไร", "เมื่อไร"], rows: [
        ["**prompt engineering**", "ไม่อัปเดตอะไรเลย", "**ลองก่อนเสมอ** — ถูกและเร็วที่สุด"],
        ["**RAG**", "ไม่อัปเดตโมเดล แต่เพิ่มบริบท", "เมื่อต้องการความรู้เฉพาะที่เปลี่ยนบ่อย"],
        ["**LoRA / QLoRA**", "เมทริกซ์ rank ต่ำที่แทรกเข้าไป ราว 0.1-1%", "**ค่าเริ่มต้นของการ fine-tune**"],
        ["**full fine-tune**", "ทุกน้ำหนัก", "เมื่อมีข้อมูลมากและ GPU พอจริง ๆ"]
      ]}},
      { code: String.raw`LoRA:  W + ΔW  โดย  ΔW = B A     A มีขนาด (r, d) · B มีขนาด (d, r)

r = 8 · d = 4096  →  2 × 8 × 4096 = 65,536 พารามิเตอร์
เทียบกับ W เต็ม   →  4096² = 16,777,216

คือ 0.39% ของเดิม`,
        cap: "จึงเทรนได้บน GPU ตัวเดียว และเก็บ adapter หลายตัวสำหรับหลายงานบนโมเดลฐานเดียวกันได้", lang: "txt" },
      { h: "ลดราคาของบริบทยาว" },
      { table: { head: ["วิธี", "ลดอะไร", "แลกอะไร"], rows: [
        ["**FlashAttention**", "หน่วยความจำจาก O(n²) เหลือ O(n)", "**ไม่แลกคุณภาพเลย — ผลลัพธ์เท่ากันในเชิงคณิตศาสตร์**"],
        ["**grouped-query attention**", "ขนาด KV cache หลายเท่า", "คุณภาพลดเล็กน้อย"],
        ["**sliding window**", "มองแค่ k ตำแหน่งล่าสุด", "เสียบริบทไกล"],
        ["**quantization (int8/int4)**", "หน่วยความจำของน้ำหนัก 2-4 เท่า", "คุณภาพลดเล็กน้อยถึงปานกลาง"]
      ]}},
      { note: "**FlashAttention ควรเปิดเสมอถ้าใช้ได้** — มันคำนวณ attention เป็นบล็อกโดยไม่สร้างเมทริกซ์ (n, n) ขึ้นมาทั้งก้อนในหน่วยความจำ · ผลลัพธ์เท่ากันในเชิงคณิตศาสตร์ (ต่างได้เฉพาะการปัดเศษ floating point เพราะลำดับการบวกเปลี่ยนไป) แต่ใช้หน่วยความจำน้อยลงมากและเร็วขึ้นด้วย" }
    ],

    dataflow: [
      { p: "เดิน self-attention หนึ่ง block ตั้งแต่ token ถึง output พร้อม shape ทุกบรรทัด" },
      { h: "จาก token ถึง embedding" },
      { code: String.raw`ข้อความ "the cat sat"
   ↓ tokenizer
token ids  [464, 3797, 3332]           (n = 3)
   ↓ token embedding (50257, 768)
X          (3, 768)
   ↓ บวก positional encoding (3, 768)
X          (3, 768)      ← ตอนนี้มีข้อมูลตำแหน่งแล้ว`,
        cap: "การบวกไม่ใช่การต่อกัน — positional encoding ถูกบวกทับลงบน embedding โดยตรง", lang: "txt" },
      { h: "สร้าง Q, K, V" },
      { code: String.raw`W_Q, W_K, W_V ต่างมีขนาด (768, 768)

Q = X W_Q     (3, 768)
K = X W_K     (3, 768)
V = X W_V     (3, 768)`,
        cap: "ยังไม่แบ่งหัวในขั้นนี้ — คูณครั้งเดียวเต็มขนาดแล้วค่อยแบ่ง ซึ่งเร็วกว่ามาก", lang: "txt" },
      { h: "แบ่งเป็น 12 หัว" },
      { code: String.raw`d_k = 768 / 12 = 64

Q  (3, 768)  →  reshape  (3, 12, 64)  →  transpose  (12, 3, 64)
K, V เช่นเดียวกัน

ตอนนี้แต่ละหัวมีเมทริกซ์ (3, 64) ของตัวเอง`,
        cap: "การ reshape กับ transpose นี้ไม่ได้เพิ่มพารามิเตอร์เลย — เป็นการจัดเรียงตัวเลขชุดเดิมใหม่เท่านั้น", lang: "txt" },
      { h: "คะแนน attention ต่อหัว" },
      { code: String.raw`scores = Q Kᵀ / √64        (12, 3, 3)

หัวหนึ่ง ๆ ได้เมทริกซ์ 3×3:
   [ 2.0  1.0  0.5 ]
   [ 0.5  2.0  1.0 ]
   [ 1.0  0.5  2.0 ]`,
        cap: "แถว i คือ 'token ที่ i ให้ความสำคัญกับ token ไหนบ้าง' ก่อนใส่ mask", lang: "txt" },
      { h: "ใส่ causal mask" },
      { code: String.raw`   [ 2.0  −inf  −inf ]
   [ 0.5   2.0  −inf ]
   [ 1.0   0.5   2.0 ]

softmax ทีละแถว:
   แถว 0:  [1.0000, 0,      0     ]     ← มองเห็นแค่ตัวเอง
   แถว 1:  [0.1824, 0.8176, 0     ]
   แถว 2:  [0.2312, 0.1402, 0.6285]`,
        cap: "ทุกแถวรวมได้ 1 พอดี และไม่มีแถวไหนมองข้ามไปข้างหน้าได้เลย", lang: "txt" },
      { h: "คูณกับ V แล้วรวมหัวกลับ" },
      { code: String.raw`ต่อหัว:  attn @ V     (3, 3) @ (3, 64) = (3, 64)
12 หัว:  (12, 3, 64)
   ↓ transpose + reshape
         (3, 768)              ← ต่อกลับเป็นขนาดเดิม
   ↓ W_O (768, 768)
         (3, 768)`,
        cap: "W_O คือสิ่งที่ผสมผลของทุกหัวเข้าด้วยกัน — ถ้าไม่มีมัน แต่ละหัวจะอยู่แยกกันในช่องของตัวเองตลอดไป", lang: "txt" },
      { h: "residual แล้วเข้า FFN" },
      { code: String.raw`x = x + attn_out                    (3, 768)
   ↓ LayerNorm
   ↓ W₁ (768, 3072) + GELU           (3, 3072)    ← ขยายสี่เท่า
   ↓ W₂ (3072, 768)                  (3, 768)     ← บีบกลับ
x = x + ffn_out                      (3, 768)`,
        cap: "FFN ทำงานแยกกันในแต่ละตำแหน่ง ไม่มีการมองข้ามตำแหน่งเลย — งานนั้นเป็นของ attention อย่างเดียว", lang: "txt" },
      { h: "ทำซ้ำ 12 ชั้น แล้วออก" },
      { code: String.raw`ทำซ้ำ block ข้างบน 12 รอบ    (3, 768) ตลอด
   ↓ LayerNorm สุดท้าย
   ↓ lm_head (768, 50257)          (3, 50257)
   ↓ เอาแถวสุดท้าย                  (50257,)
   ↓ softmax                        ความน่าจะเป็นของ token ถัดไป`,
        cap: "shape ไม่เปลี่ยนเลยตลอด 12 ชั้น ซึ่งเป็นสิ่งที่ทำให้ซ้อนกี่ชั้นก็ได้", lang: "txt" },
      { h: "การสร้าง token ที่ 4 ใช้ KV cache" },
      { code: String.raw`ไม่มี cache:  คำนวณ K, V ของทั้ง 4 ตำแหน่งใหม่หมด
มี cache:     ดึง K, V ของตำแหน่ง 0-2 จาก cache
              คำนวณเฉพาะตำแหน่งที่ 3
              แล้วต่อเข้าไป → (4, 64) ต่อหัว

Q มีแค่ตำแหน่งเดียว: (1, 64)
scores = (1, 64) @ (64, 4) = (1, 4)      ← มองย้อนได้ครบทุกตำแหน่ง`,
        cap: "**Q มีแถวเดียวแต่ K กับ V มีครบทุกแถว** — นี่คือสาเหตุที่การ decode แต่ละก้าวมี FLOPs น้อยแต่ต้องอ่านหน่วยความจำเยอะ", lang: "txt" },
      { h: "ราคาของ prefill เทียบ decode" },
      { code: String.raw`prompt 1,000 token:
   prefill  ประมวลผล 1,000 ตำแหน่งพร้อมกัน   → คูณเมทริกซ์ใหญ่ ใช้ compute เต็ม
   decode   ทีละ 1 ตำแหน่ง × 200 ครั้ง        → แต่ละครั้งต้องอ่านน้ำหนักทั้งโมเดล
                                                 บวกกับ KV cache ทั้งก้อน`,
        cap: "จึงเป็น memory-bandwidth bound และเป็นเหตุผลที่การรวมหลาย request เป็น batch เดียวช่วยได้มหาศาล", lang: "txt" }
    ],

    implementation: [
      { p: "เขียน transformer จากศูนย์ แล้วเทียบกับของจริง" },
      { h: "1) multi-head self-attention" },
      { code: String.raw`import torch, torch.nn as nn, math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        assert d_model % n_heads == 0
        self.h = n_heads
        self.d_k = d_model // n_heads
        self.qkv = nn.Linear(d_model, 3 * d_model)   # คูณครั้งเดียวได้ทั้งสามตัว
        self.proj = nn.Linear(d_model, d_model)

    def forward(self, x, mask=None):
        B, T, C = x.shape
        q, k, v = self.qkv(x).chunk(3, dim=-1)
        q = q.view(B, T, self.h, self.d_k).transpose(1, 2)   # (B, h, T, d_k)
        k = k.view(B, T, self.h, self.d_k).transpose(1, 2)
        v = v.view(B, T, self.h, self.d_k).transpose(1, 2)

        att = (q @ k.transpose(-2, -1)) / math.sqrt(self.d_k)
        if mask is not None:
            att = att.masked_fill(mask == 0, float("-inf"))
        att = att.softmax(-1)

        out = (att @ v).transpose(1, 2).reshape(B, T, C)
        return self.proj(out)`,
        cap: "`nn.Linear(d_model, 3*d_model)` แล้ว chunk เร็วกว่าสาม Linear แยกกันอย่างมาก และเป็นวิธีที่ทุก implementation ใช้", lang: "python" },
      { h: "2) สร้าง causal mask" },
      { code: String.raw`def causal_mask(T, device):
    return torch.tril(torch.ones(T, T, device=device)).view(1, 1, T, T)

print(torch.tril(torch.ones(4, 4)))
# tensor([[1., 0., 0., 0.],
#         [1., 1., 0., 0.],
#         [1., 1., 1., 0.],
#         [1., 1., 1., 1.]])`,
        cap: "`register_buffer` ไว้ในโมเดลจะดีกว่าสร้างใหม่ทุกครั้ง เพราะมันย้ายอุปกรณ์ตามโมเดลเองและไม่ถูกนับเป็นพารามิเตอร์", lang: "python" },
      { h: "3) transformer block แบบ pre-norm" },
      { code: String.raw`class Block(nn.Module):
    def __init__(self, d_model, n_heads, dropout=0.1):
        super().__init__()
        self.ln1 = nn.LayerNorm(d_model)
        self.attn = MultiHeadAttention(d_model, n_heads)
        self.ln2 = nn.LayerNorm(d_model)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, 4 * d_model),
            nn.GELU(),
            nn.Linear(4 * d_model, d_model),
            nn.Dropout(dropout),
        )

    def forward(self, x, mask=None):
        x = x + self.attn(self.ln1(x), mask)     # pre-norm: LN อยู่ในสาขา
        x = x + self.ffn(self.ln2(x))            # ไม่ใช่บนเส้นทาง residual
        return x`,
        cap: "**สังเกตว่า** `x +` **อยู่นอก LayerNorm** — นี่คือความต่างทั้งหมดระหว่าง pre-norm กับ post-norm", lang: "python" },
      { h: "4) positional encoding แบบ sinusoidal" },
      { code: String.raw`def sinusoidal_pe(max_len, d_model):
    pe = torch.zeros(max_len, d_model)
    pos = torch.arange(max_len).unsqueeze(1).float()
    div = torch.exp(torch.arange(0, d_model, 2).float()
                    * (-math.log(10000.0) / d_model))
    pe[:, 0::2] = torch.sin(pos * div)
    pe[:, 1::2] = torch.cos(pos * div)
    return pe

print(sinusoidal_pe(4, 4))
# tensor([[ 0.0000,  1.0000,  0.0000,  1.0000],
#         [ 0.8415,  0.5403,  0.0100,  1.0000],
#         [ 0.9093, -0.4161,  0.0200,  0.9998],
#         [ 0.1411, -0.9900,  0.0300,  0.9996]])`,
        cap: "ตรงกับตัวเลขที่คำนวณมือในหมวดก่อนหน้าทุกหลัก · เขียนเป็น `exp(log)` เพื่อความเสถียรเชิงตัวเลข", lang: "python" },
      { h: "5) โมเดลเต็ม" },
      { code: String.raw`class GPT(nn.Module):
    def __init__(self, vocab, d_model=768, n_heads=12, n_layers=12, max_len=1024):
        super().__init__()
        self.tok = nn.Embedding(vocab, d_model)
        self.pos = nn.Embedding(max_len, d_model)
        self.blocks = nn.ModuleList([Block(d_model, n_heads) for _ in range(n_layers)])
        self.ln_f = nn.LayerNorm(d_model)
        self.head = nn.Linear(d_model, vocab, bias=False)
        self.head.weight = self.tok.weight       # weight tying
        self.register_buffer("mask",
            torch.tril(torch.ones(max_len, max_len)).view(1, 1, max_len, max_len))

    def forward(self, idx):
        B, T = idx.shape
        x = self.tok(idx) + self.pos(torch.arange(T, device=idx.device))
        for b in self.blocks:
            x = b(x, self.mask[:, :, :T, :T])
        return self.head(self.ln_f(x))`,
        cap: "**weight tying** ให้ lm_head ใช้น้ำหนักเดียวกับ token embedding — ประหยัด 38 ล้านพารามิเตอร์และมักได้ผลดีขึ้นด้วย", lang: "python" },
      { h: "6) ตรวจจำนวนพารามิเตอร์" },
      { code: String.raw`model = GPT(vocab=50257)
total = sum(p.numel() for p in model.parameters())
print(f"{total:,}")
# 124,439,808

# ตรวจกับที่นับมือ:
# 12 blocks × 7,087,872 = 85,054,464
# + token emb 38,597,376 + pos emb 786,432 + final ln 1,536
# = 124,439,808  ✓`,
        cap: "ถ้าตัวเลขไม่ตรงกับที่นับเอง แปลว่ามีชั้นที่เข้าใจผิดหรือลืม weight tying", lang: "python" },
      { h: "7) FlashAttention ใน PyTorch" },
      { code: String.raw`out = torch.nn.functional.scaled_dot_product_attention(
    q, k, v, attn_mask=None, dropout_p=0.0, is_causal=True
)

# เลือก kernel ที่เร็วที่สุดที่ใช้ได้เอง รวมถึง FlashAttention
# ไม่สร้างเมทริกซ์ (T, T) ขึ้นมาทั้งก้อน → หน่วยความจำ O(n) แทน O(n²)
# ผลลัพธ์เท่ากับที่เขียนเองทุกประการ`,
        cap: "**ใช้ตัวนี้แทนการเขียน attention เองเสมอในงานจริง** — เร็วกว่าและกินหน่วยความจำน้อยกว่ามาก", lang: "python" },
      { h: "8) KV cache ตอน generate" },
      { code: String.raw`@torch.no_grad()
def generate(model, idx, max_new=50, temperature=1.0, top_k=50):
    past = None
    for _ in range(max_new):
        inp = idx if past is None else idx[:, -1:]     # หลังก้าวแรก ส่งแค่ token ล่าสุด
        logits, past = model(inp, past_kv=past)
        logits = logits[:, -1, :] / temperature
        if top_k:
            v, _ = logits.topk(top_k)
            logits[logits < v[:, [-1]]] = float("-inf")
        nxt = torch.multinomial(logits.softmax(-1), 1)
        idx = torch.cat([idx, nxt], dim=1)
    return idx`,
        cap: "บรรทัด `idx[:, -1:]` คือทั้งหมดของ KV cache ในระดับการใช้งาน — ส่งเข้าไปตำแหน่งเดียว ไม่ใช่ทั้งลำดับ", lang: "python" },
      { h: "9) คำนวณขนาด KV cache ล่วงหน้า" },
      { code: String.raw`def kv_cache_mb(n_layers, d_model, seq_len, batch=1, bytes_per=2):
    return 2 * n_layers * seq_len * d_model * batch * bytes_per / 1024**2

print(kv_cache_mb(12, 768, 1024))        # 36.0     GPT-2 small
print(kv_cache_mb(32, 4096, 4096))       # 2048.0   7B ที่บริบท 4k
print(kv_cache_mb(32, 4096, 32768))      # 16384.0  7B ที่บริบท 32k`,
        cap: "**คำนวณก่อนเลือกฮาร์ดแวร์เสมอ** — ที่บริบท 32k ตัว cache ใหญ่กว่าน้ำหนักโมเดลเอง", lang: "python" },
      { h: "10) LoRA" },
      { code: String.raw`class LoRALinear(nn.Module):
    def __init__(self, base: nn.Linear, r=8, alpha=16):
        super().__init__()
        self.base = base
        for p in self.base.parameters():
            p.requires_grad = False               # แช่แข็งน้ำหนักเดิม
        self.A = nn.Parameter(torch.randn(r, base.in_features) * 0.01)
        self.B = nn.Parameter(torch.zeros(base.out_features, r))   # เริ่มที่ศูนย์
        self.scale = alpha / r

    def forward(self, x):
        return self.base(x) + (x @ self.A.T @ self.B.T) * self.scale`,
        cap: "**B เริ่มที่ศูนย์** จึงทำให้ `ΔW = 0` ตอนเริ่ม — โมเดลเริ่มจากพฤติกรรมเดิมเป๊ะแล้วค่อยเบนออก ซึ่งเป็นเหตุผลที่ LoRA เสถียรมาก", lang: "python" }
    ],

    tricks: [
      { h: "ไล่ปัญหาตามอาการ" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้ยังไง"], rows: [
        ["training loss ลงเร็วผิดปกติจนใกล้ศูนย์", "**ลืม causal mask**", "โมเดลอ่าน token ที่ต้องทำนายได้ตรง ๆ"],
        ["สร้างข้อความออกมาเป็นขยะทั้งที่ loss ต่ำ", "mask ผิด หรือ shift target ผิด", "ตรวจว่า `target = input[1:]` จริง"],
        ["โมเดลไม่สนใจลำดับคำเลย", "**ลืมบวก positional encoding**", "ตรวจว่ามีการบวกจริงหลัง embedding"],
        ["out of memory ตอนบริบทยาว", "เมทริกซ์ (n, n) ระเบิด", "**FlashAttention** · gradient checkpointing · ลด batch"],
        ["out of memory ตอน generate ไม่ใช่ตอนเทรน", "KV cache ใหญ่กว่าที่คิด", "คำนวณขนาด cache ล่วงหน้า · grouped-query attention"],
        ["เทรนแล้ว loss พุ่งเป็น NaN ช่วงต้น", "post-norm โดยไม่มี warmup", "เปลี่ยนเป็น **pre-norm** · เพิ่ม warmup"],
        ["ผลแย่เมื่อ input ยาวกว่าตอนเทรน", "positional embedding แบบ learned", "ใช้ RoPE หรือ sinusoidal"],
        ["decode ช้ามากทั้งที่ GPU ว่าง", "memory-bandwidth bound", "รวมหลาย request เป็น batch · quantize น้ำหนัก"],
        ["fine-tune แล้วโมเดลลืมความสามารถเดิม", "learning rate สูงเกิน หรือ full fine-tune บนข้อมูลน้อย", "ใช้ LoRA · ลด lr เหลือ 1e-5 หรือต่ำกว่า"]
      ]}},
      { h: "ค่าเริ่มต้นที่ใช้ได้ทันที" },
      { code: String.raw`d_model / n_heads = 64-128      ตรึงขนาดต่อหัวไว้ แล้วเพิ่มจำนวนหัว
FFN                = 4 × d_model
norm               pre-norm เสมอ
activation         GELU หรือ SwiGLU
positional         RoPE
dropout            0.0 - 0.1  (โมเดลใหญ่มักใช้ 0.0)
optimizer          AdamW β₂ = 0.95 · weight decay 0.1
schedule           cosine + warmup 2,000 ก้าว
clipping           1.0`,
        cap: "`β₂ = 0.95` แทน 0.999 เป็นค่าที่โมเดลภาษาขนาดใหญ่ใช้กัน เพราะตอบสนองต่อการเปลี่ยนแปลงได้เร็วกว่า", lang: "txt" },
      { h: "ข้อผิดพลาดที่พบบ่อยที่สุด" },
      { ul: [
        "**คิดว่า multi-head เพิ่มพารามิเตอร์** ทั้งที่มันคือการแบ่ง d_model เท่าเดิม",
        "**คิดว่าพารามิเตอร์ส่วนใหญ่อยู่ที่ attention** ทั้งที่ FFN กินสองในสาม",
        "**ลืม causal mask** ซึ่งทำให้ loss ต่ำสวยแต่โมเดลใช้ไม่ได้เลย",
        "**ลืม positional encoding** แล้วสงสัยว่าทำไมโมเดลไม่สนใจลำดับคำ",
        "**ใช้ post-norm ในโมเดลลึก** โดยไม่มี warmup ที่ประณีตพอ",
        "**ไม่คำนวณ KV cache ก่อน deploy** แล้ว out of memory ตอนใช้งานจริง",
        "**เอา LLM ใหญ่ ๆ ไปทำงานจำแนกข้อความ** ที่ DistilBERT ทำได้ดีกว่าและถูกกว่าหลายร้อยเท่า"
      ]},
      { h: "ตัวเลขที่ควรจำได้" },
      { table: { head: ["เรื่อง", "ค่า"], rows: [
        ["พารามิเตอร์ต่อ block", "`12 · d_model²` (attention 4 · FFN 8)"],
        ["สัดส่วน FFN", "**สองในสาม**"],
        ["ขนาดต่อหัว", "64 มิติรุ่น GPT-2/BERT · 128 มิติรุ่น Llama"],
        ["ราคาของ attention", "`4n²d` เทียบ FFN `16nd²` — พลิกที่ราว n = 4·d_model"],
        ["ขนาด KV cache", "`2 · L · n · d · ไบต์`"],
        ["GPT-2 small", "12 ชั้น · d 768 · 124,439,808 พารามิเตอร์"],
        ["สัดส่วนของ LoRA", "ราว 0.1-1% ของน้ำหนักทั้งหมด"]
      ]}},
      { note: "**ถ้าจำได้แค่ประโยคเดียวจากหน้านี้**: transformer ไม่ได้ชนะเพราะ attention ดีกว่า LSTM ในเชิงคุณภาพ แต่เพราะการทิ้ง recurrence ทำให้เทรนขนานได้ — และสิ่งที่แลกมาคือ `O(n²)` ซึ่งเป็นราคาที่ยังจ่ายกันอยู่ทุกวันนี้ในรูปของบริบทที่แพง" }
    ],

    eval: [
      { p: "คำถามที่แยกคนที่เข้าใจ transformer ออกจากคนที่ใช้ library เป็น" },
      { qa: [
        { q: "เปเปอร์ transformer เพิ่มอะไรเข้ามาจริง ๆ",
          a: "ไม่ได้เพิ่ม แต่**เอา recurrence ออก** — attention มีอยู่แล้วตั้งแต่ปี 2014 สิ่งที่ใหม่คือการทิ้ง RNN ทั้งหมด ซึ่งทำให้ทุกตำแหน่งคำนวณพร้อมกันได้ในการคูณเมทริกซ์ครั้งเดียว และนั่นคือสิ่งที่ทำให้ scale เป็นไปได้" },
        { q: "self-attention ต่างจาก attention ในหน้าที่แล้วตรงไหน",
          a: "สมการเหมือนกันทุกตัวอักษร ต่างแค่ที่มา — cross-attention เอา q จาก decoder และ k, v จาก encoder ส่วน self-attention เอาทั้งสามมาจากลำดับเดียวกัน" },
        { q: "`Q Kᵀ` มีขนาดเท่าไร และมันสำคัญยังไง",
          a: "`(n, n)` คือทุกตำแหน่งได้คะแนนเทียบกับทุกตำแหน่งในการคูณเมทริกซ์ครั้งเดียว ซึ่งเป็นความขนานที่ RNN ทำไม่ได้ — แต่ก็เป็นที่มาของราคา `O(n²)` ด้วย" },
        { q: "multi-head เพิ่มพารามิเตอร์กี่เท่า",
          a: "ไม่เพิ่มเลย มันคือการ**แบ่ง** `d_model` ออกเป็น h ส่วน เช่น 512 กับ 8 หัวได้ 64 มิติต่อหัว พารามิเตอร์ยังเป็น `4·d_model²` เท่าเดิมไม่ว่า h จะเป็นเท่าไร" },
        { q: "แล้วการแบ่งหัวได้อะไรมา",
          a: "หัวเดียวให้ค่าเฉลี่ยถ่วงน้ำหนักหนึ่งชุด คือมองความสัมพันธ์ได้แบบเดียว ส่วนหลายหัวให้หลายความสัมพันธ์พร้อมกัน และเมื่อตรวจดูจริงพบว่าหัวต่าง ๆ ทำงานคนละอย่าง เช่นบางหัวตามไวยากรณ์ บางหัวมองแค่ token ก่อนหน้า" },
        { q: "ทำไม transformer ต้องมี positional encoding",
          a: "เพราะ self-attention เป็น permutation equivariant — สลับแถวของ input แล้วผลลัพธ์เดิมทุกตัวแค่ถูกสลับตาม มันจึงไม่มีแนวคิดเรื่องลำดับอยู่เลย ต่างจาก RNN ที่ลำดับฝังอยู่ในโครงสร้าง (สมบัตินี้ใช้กับกรณีที่ยังไม่ใส่ mask)" },
        { q: "positional encoding มีกี่แบบ ต่างกันยังไง",
          a: "sinusoidal คงที่ ไม่มีพารามิเตอร์ และขยายเกินความยาวที่เทรนได้, learned เป็น embedding ต่อตำแหน่งซึ่งง่ายแต่เกินความยาวที่เทรนไม่ได้, และ RoPE หมุน Q กับ K ตามตำแหน่งจึงเข้ารหัสระยะสัมพัทธ์ — LLM ยุคใหม่ใช้ RoPE แทบทั้งหมด" },
        { q: "pre-norm ต่างจาก post-norm ยังไง และทำไมยุคใหม่ใช้ pre-norm",
          a: "pre-norm คือ `x = x + Attn(LN(x))` ส่วน post-norm คือ `x = LN(x + Attn(x))` ความต่างคือ pre-norm เก็บเส้นทาง residual ที่ไม่มีอะไรคั่นจาก output ถึง input จึงรักษาคุณสมบัติ `+1` ในอนุพันธ์ไว้ และซ้อนลึกได้โดยไม่ต้องพึ่ง warmup ที่ประณีตมาก" },
        { q: "พารามิเตอร์ส่วนใหญ่ของ transformer อยู่ตรงไหน",
          a: "ที่ **FFN ซึ่งกินสองในสาม** — ต่อ block attention ใช้ `4·d²` ส่วน FFN ใช้ `8·d²` รวมเป็น `12·d²` ใครที่คิดว่า transformer ส่วนใหญ่คือ attention เข้าใจงบพารามิเตอร์กลับด้าน" },
        { q: "FFN ทำอะไรที่ attention ไม่ทำ",
          a: "FFN ประมวลผลภายในแต่ละตำแหน่งโดยไม่มองข้ามตำแหน่งเลย ส่วน attention คือการผสมข้ามตำแหน่ง — สองอย่างนี้สลับกันไปมาชั้นแล้วชั้นเล่า" },
        { q: "causal mask ทำอะไร และขาดแล้วเกิดอะไร",
          a: "เติม `-inf` ที่ครึ่งบนของเมทริกซ์คะแนนก่อน softmax ทำให้ตำแหน่ง t มองเห็นได้ถึง t เท่านั้น — ขาดแล้ว language model จะอ่าน token ที่ถูกถามให้ทำนายได้ตรง ๆ loss จึงลงใกล้ศูนย์แต่สร้างข้อความไม่ได้เลย" },
        { q: "แถวแรกของ causal attention หลัง softmax เป็นเท่าไร",
          a: "`[1.0, 0, 0, ...]` เสมอ เพราะตำแหน่งแรกมองเห็นได้แค่ตัวเอง softmax ของค่าเดียวจึงเป็น 1 พอดี ไม่ว่าคะแนนดิบจะเป็นเท่าไร" },
        { q: "encoder-only, decoder-only และ encoder-decoder ต่างกันยังไง",
          a: "encoder-only ไม่มี mask มองสองทางได้ เหมาะกับการจำแนกและค้นคืน เช่น BERT · decoder-only ใช้ causal mask เหมาะกับการสร้าง เช่น GPT · encoder-decoder มีทั้งคู่ เหมาะกับการแปลและสรุป เช่น T5" },
        { q: "ทำไม decoder-only ถึงกลืนงานอื่นไปหมด",
          a: "เพราะงานเกือบทุกอย่างเขียนเป็นการสร้างข้อความต่อได้ ทั้งการจำแนก การตอบคำถาม และการสรุป จึงเทรนโมเดลชนิดเดียวครั้งเดียวแล้วใช้ได้ทุกงาน" },
        { q: "attention แพงกว่า FFN เมื่อไร",
          a: "จุดพลิกอยู่ที่ราว `n = 4·d_model` เมื่อนับค่าคงที่จริง (attention ≈ `4n²d` · FFN ≈ `16nd²`) — ที่ d=768 และ n=512 attention ถูกกว่า FFN หกเท่า แต่ที่ n=32,768 มันแพงกว่าราว 11 เท่า" },
        { q: "KV cache เก็บอะไร และใหญ่แค่ไหน",
          a: "เก็บ K กับ V ของทุก token ก่อนหน้าเพื่อไม่ต้องคำนวณใหม่ ขนาดคือ `2·L·n·d·ไบต์` — โมเดล 7B ที่บริบท 32k ใช้ 16 GB ซึ่ง**ใหญ่กว่าน้ำหนักโมเดลเองที่ราว 14 GB**" },
        { q: "ทำไม token แรกช้าแล้วที่เหลือเร็ว",
          a: "prefill ประมวลผล prompt ทั้งก้อนพร้อมกันจึง compute-bound ส่วน decode สร้างทีละ token ซึ่งมี FLOPs น้อยมากแต่ต้องอ่านน้ำหนักทั้งโมเดลบวก KV cache ทั้งก้อน จึงเป็น memory-bandwidth bound" },
        { q: "ทำไมการรวม request เป็น batch ตอน inference ถึงช่วยมาก",
          a: "เพราะเมื่อ memory bandwidth คือคอขวด น้ำหนักที่อ่านขึ้นมาแล้วครั้งหนึ่งสามารถใช้กับหลาย request พร้อมกันได้ ต้นทุนต่อ request จึงลดลงมาก" },
        { q: "FlashAttention แลกอะไรเพื่อความเร็ว",
          a: "**ไม่แลกคุณภาพเลย** — ผลลัพธ์เท่ากันในเชิงคณิตศาสตร์ ต่างได้เฉพาะการปัดเศษ floating point เพราะลำดับการบวกเปลี่ยน มันคำนวณเป็นบล็อกโดยไม่สร้างเมทริกซ์ `(n,n)` ทั้งก้อน จึงใช้ `O(n)` แทน `O(n²)` และเร็วขึ้นด้วย" },
        { q: "LoRA ทำงานยังไง และทำไมถึงเสถียร",
          a: "แทรก `ΔW = BA` ที่ rank ต่ำเข้าไปโดยแช่แข็งน้ำหนักเดิม ที่ r=8 และ d=4096 ใช้ 65,536 พารามิเตอร์เทียบกับ 16.8 ล้าน คือ 0.39% · มันเสถียรเพราะ **B เริ่มที่ศูนย์** ทำให้ `ΔW = 0` ตอนเริ่ม โมเดลจึงเริ่มจากพฤติกรรมเดิมเป๊ะแล้วค่อยเบนออก" },
        { q: "นับพารามิเตอร์ GPT-2 small ได้ไหม",
          a: "12 block × 7,087,872 = 85,054,464 บวก token embedding 38,597,376 บวก positional 786,432 บวก layer norm สุดท้าย 1,536 รวม 124,439,808 · lm_head ใช้น้ำหนักร่วมกับ token embedding จึงไม่นับซ้ำ" },
        { q: "ประมาณขนาดโมเดลเร็ว ๆ ยังไง",
          a: "`12 · L · d_model²` แล้วบวก embedding — ที่ d=768 กฎนี้ให้ 7,077,888 ต่อ block เทียบกับค่าจริง 7,087,872 คือคลาดเคลื่อน 0.14% ซึ่งคือ bias กับ layer norm ทั้งหมด" }
      ]},
      { h: "อ่านเพิ่ม" },
      { links: [
        { label: "Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762", note: "เปเปอร์ต้นฉบับปี 2017 — สั้นกว่าที่คิดและอ่านได้จริง" },
        { label: "The Illustrated Transformer (Jay Alammar)", url: "https://jalammar.github.io/illustrated-transformer/", note: "คำอธิบายด้วยภาพที่ถูกอ้างถึงมากที่สุด ไล่ทีละเมทริกซ์" },
        { label: "The Annotated Transformer (Harvard NLP)", url: "https://nlp.seas.harvard.edu/annotated-transformer/", note: "เปเปอร์ทั้งฉบับพร้อมโค้ด PyTorch แทรกทุกย่อหน้า" },
        { label: "Let's build GPT from scratch (Karpathy)", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY", note: "สร้าง GPT ทั้งตัวสด ๆ ในสองชั่วโมง อธิบายทุกบรรทัด" },
        { label: "nanoGPT", url: "https://github.com/karpathy/nanoGPT", note: "โค้ด GPT ที่อ่านจบได้จริง ราว 300 บรรทัด และเทรนได้จริง" },
        { label: "RoFormer: Rotary Position Embedding (RoPE)", url: "https://arxiv.org/abs/2104.09864", note: "positional encoding ที่ LLM ยุคใหม่ใช้แทบทั้งหมด" },
        { label: "FlashAttention", url: "https://arxiv.org/abs/2205.14135", note: "ทำไมการจัดลำดับการอ่านหน่วยความจำใหม่ถึงลดจาก O(n²) เหลือ O(n) โดยผลลัพธ์เท่าเดิม" },
        { label: "LoRA: Low-Rank Adaptation of Large Language Models", url: "https://arxiv.org/abs/2106.09685", note: "เปเปอร์ต้นฉบับ พร้อมเหตุผลที่ rank ต่ำก็เพียงพอ" },
        { label: "The Transformer Family (Lilian Weng)", url: "https://lilianweng.github.io/posts/2023-01-27-the-transformer-family-v2/", note: "รวมทุกสายพันธุ์ของ transformer และความพยายามลด O(n²) ทั้งหมด" }
      ]}
    ]
  }
});

window.TEACHING_EN = window.TEACHING_EN || {};
window.TEACHING_EN["ml_tf"] = {
  principle: [
    { h: "What the transformer added was a removal" },
    { p: "**Attention already existed, from 2014**, on the previous page. What the 2017 paper did was **strip out the RNN entirely and keep only attention** — which sounds like a reduction, but the result is that every position is computed at once in a single matrix multiply." },
    { code: String.raw`RNN:          h₁ -> h₂ -> h₃ -> h₄        one step at a time
transformer:  every position at once, in one matrix multiply

-> GPUs are used fully -> larger models become trainable -> scale`,
      cap: "Parallelism is why it won, not that attention beats LSTM on quality alone", lang: "txt" },
    { note: "**Teach the transformer as a removal, not an addition** — if attention is already understood from the previous page, only three things here are new: self-attention, multi-head, and positional encoding." },
    { h: "The three new things" },
    { table: { head: ["Idea", "What it addresses"], rows: [
      ["**Self-attention**", "There is no separate encoder — q, k and v all come from one sequence"],
      ["**Multi-head**", "One head gives a single averaged view; several give several relations at once"],
      ["**Positional encoding**", "**Self-attention has no notion of order at all**, so position must be injected"]
    ]}},
    { h: "The price paid" },
    { code: String.raw`RNN:          O(n · d²)   linear in length, but not parallelisable
transformer:  O(n² · d)   fully parallel, but quadratic in length

n = 512     attention is far cheaper than the FFN
n = 32,768  attention costs about 11× the FFN`,
      cap: "This is the entire reason long context is expensive, and why so much research aims at that n² term", lang: "txt" },
    { h: "What this page will let you do" },
    { ul: [
      "Explain how self-attention differs from the attention of the previous page",
      "Know that multi-head **splits** d_model rather than **adding** parameters",
      "Explain why this architecture has no sense of order, and how positional encoding fixes it",
      "Write out a causal mask as a matrix and read off each row's softmax",
      "Count a real model's parameters exactly, and compute a KV cache size in megabytes"
    ]}
  ],

  theory: [
    { p: "This section assembles the transformer piece by piece, building directly on the previous page's attention." },
    { h: "1) Self-attention — the same mechanism, pointed at itself" },
    { code: String.raw`previous page (cross-attention):  q from the decoder · k, v from the encoder
this page (self-attention):       q, k and v all from the same sequence

Q = X W_Q      K = X W_K      V = X W_V         X is (n, d_model)

Attention(Q,K,V) = softmax(Q Kᵀ / √d_k) V`,
      cap: "Character for character the same equation as the previous page — only the origin of q, k and v differs", lang: "txt" },
    { code: String.raw`Q Kᵀ has shape (n, n)

-> every position is scored against every other **in one matrix multiply**
-> this is the parallelism an RNN could never have`,
      cap: "That (n, n) matrix is simultaneously the transformer's great advantage and its great cost", lang: "txt" },
    { h: "2) Multi-head — a split, not an addition" },
    { code: String.raw`d_model = 512 · h = 8  ->  d_k = d_model / h = 64 per head

each head runs attention independently on its own 64 dimensions
the outputs are concatenated back to 512 and passed through W_O

parameters: 4 · d_model², identical whatever h is`,
      cap: "**It is a split, not an addition** — many people believe 8 heads cost 8× the parameters, which is wrong", lang: "txt" },
    { p: "**Why splitting is better**: one 512-wide head produces a single weighted average, meaning one view of the relationships, while 8 heads produce 8 at once. Inspecting them shows they genuinely specialise — some track syntactic dependencies, some only look at the previous token, some match rare words." },
    { h: "3) Positional encoding — this architecture has no sense of order" },
    { code: String.raw`shuffle the rows of X -> self-attention returns the identical outputs, merely shuffled

**it contains no notion of order whatsoever**, unlike an RNN where order is structural

-> positional information must be injected explicitly`,
      cap: "This is permutation **equivariance** (the output permutes with the input rather than staying fixed), and it is why positional encoding is a requirement rather than an extra · the proof holds only for unmasked self-attention — the causal mask two sections later destroys the property", lang: "txt" },
    { table: { head: ["Kind", "Property"], rows: [
      ["**Sinusoidal**", "Fixed, parameter-free · extrapolates beyond the trained length"],
      ["**Learned**", "One embedding per position · simple, but **cannot exceed the trained length**"],
      ["**RoPE**", "Rotates Q and K by an angle proportional to position · **encodes relative distance** · used by nearly every modern LLM"]
    ]}},
    { h: "4) The sinusoidal formula" },
    { code: String.raw`PE(pos, 2i)   = sin(pos / 10000^(2i/d))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d))

early dimensions have a high frequency (changing fast) -> fine positional detail
later dimensions have a low frequency (changing slowly) -> coarse position over long ranges`,
      cap: "Like binary digits with different flip rates — together they identify a position uniquely", lang: "txt" },
    { h: "5) The layout of one block" },
    { code: String.raw`pre-norm (modern, easier to train):
   x = x + Attention(LayerNorm(x))
   x = x + FFN(LayerNorm(x))

post-norm (the original 2017 layout):
   x = LayerNorm(x + Attention(x))
   x = LayerNorm(x + FFN(x))`,
      cap: "Pre-norm keeps a clean residual path from output to input, so deep stacks train without delicate warmup", lang: "txt" },
    { p: "**Nearly every model since around 2020 is pre-norm** — because post-norm places a layer norm on the residual path itself, destroying the `+1` property that makes depth trainable, as page 7 explained." },
    { h: "6) The FFN — and the thing people get backwards" },
    { code: String.raw`FFN(x) = W₂ · GELU(W₁ x + b₁) + b₂

d_model -> 4·d_model -> d_model        expand fourfold, then contract

parameters per block:
   attention   4 · d_model²        (W_Q, W_K, W_V, W_O)
   FFN         8 · d_model²        (expand and contract)
   total      12 · d_model²

**the FFN takes two thirds**`,
      cap: "Anyone who believes a transformer is \"mostly attention\" has the parameter budget backwards", lang: "txt" },
    { p: "**And what the FFN does**: it works within each position independently, mixing nothing across positions. Attention mixes across positions; the FFN processes within one — and the two alternate, layer after layer." },
    { h: "7) The causal mask" },
    { code: String.raw`add −inf to the upper triangle of the score matrix, before the softmax

   [  s₀₀  −inf  −inf  −inf ]
   [  s₁₀   s₁₁  −inf  −inf ]
   [  s₂₀   s₂₁   s₂₂  −inf ]
   [  s₃₀   s₃₁   s₃₂   s₃₃ ]

-> position t can see up to t and no further`,
      cap: "**Without it a language model cheats immediately** — it reads the token it is asked to predict, the loss falls to near zero, and generation is worthless", lang: "txt" },
    { h: "8) The three families" },
    { table: { head: ["Family", "Masking", "Good at", "Example"], rows: [
      ["**Encoder-only**", "None, bidirectional", "Classification · retrieval · NER", "BERT"],
      ["**Decoder-only**", "Causal", "**Generation, and by now nearly everything**", "GPT"],
      ["**Encoder-decoder**", "Both", "Translation · summarisation", "T5"]
    ]}},
    { p: "**Why decoder-only swallowed everything**: almost any task can be written as continuing text — classification, question answering, summarisation — so one model type, trained once, serves them all." },
    { h: "9) The KV cache" },
    { code: String.raw`while generating token by token, the K and V of earlier tokens never change
-> cache them instead of recomputing them every step

size = 2 · n_layers · n · d_model · bytes per value
       ‾
       K and V`,
      cap: "It grows linearly with context, and at long context it is often larger than the model weights themselves", lang: "txt" },
    { h: "10) Why the first token is slow and the rest are fast" },
    { table: { head: ["Phase", "What it does", "Bottleneck"], rows: [
      ["**Prefill**", "Processes the whole prompt at once", "**Compute** — large matrix multiplies"],
      ["**Decode**", "Generates one token at a time, reading the whole KV cache", "**Memory bandwidth** — few FLOPs, but a great deal to read"]
    ]}},
    { note: "**This is why the first token takes a while and the rest stream out quickly**, and why increasing the batch size at inference helps so much — weights already read from memory are used for many requests at once." }
  ],

  foundations: [
    { p: "This section digs into the numbers that decide architecture and deployment." },
    { h: "Counting every parameter of GPT-2 small" },
    { code: String.raw`L = 12 layers · d_model = 768 · vocab = 50,257 · context = 1,024

per block:
   attention (W_Q,W_K,W_V,W_O + biases)   2,362,368
   FFN (768->3072->768 + biases)          4,722,432
   two layer norms                            3,072
                                          ‾‾‾‾‾‾‾‾‾
   per block                              7,087,872

12 blocks                                85,054,464
token embedding  50,257 × 768            38,597,376
positional embedding  1,024 × 768           786,432
final layer norm                              1,536
                                        ‾‾‾‾‾‾‾‾‾‾‾
total                                   124,439,808`,
      cap: "Matching the \"124M\" reported everywhere · the lm_head shares weights with the token embedding, so it is not counted twice", lang: "txt" },
    { h: "How good the 12·d² rule is" },
    { code: String.raw`12 · d_model² = 12 × 768² = 7,077,888
the actual per-block count            7,087,872

a difference of 9,984, which is every bias and layer norm (0.14%)`,
      cap: "So a model's size can be estimated quickly with `12 · L · d²` plus the embeddings", lang: "txt" },
    { h: "The proportions worth memorising" },
    { table: { head: ["Part", "Parameters", "Share of a block"], rows: [
      ["Attention", "`4 · d²`", "**33%**"],
      ["FFN", "`8 · d²`", "**67%**"],
      ["Layer norm + biases", "About `10·d`", "Under 1%"]
    ]}},
    { h: "The causal mask with real numbers" },
    { code: String.raw`raw 4×4 scores, already divided by √d_k:

   [ 2.0  1.0  0.5  1.5 ]
   [ 0.5  2.0  1.0  0.0 ]
   [ 1.0  0.5  2.0  1.0 ]
   [ 0.0  1.0  1.5  2.0 ]

masked, then softmaxed row by row:
   row 0:  [2.0, −inf, −inf, −inf]  ->  [1.0000, 0, 0, 0]
   row 1:  [0.5, 2.0, −inf, −inf]   ->  [0.1824, 0.8176, 0, 0]
   row 2:  [1.0, 0.5, 2.0, −inf]    ->  [0.2312, 0.1402, 0.6285, 0]
   row 3:  [0.0, 1.0, 1.5, 2.0]     ->  [0.0641, 0.1744, 0.2875, 0.4740]`,
      cap: "Row 0 sees only itself and therefore gives exactly 1.0, and every row still sums to 1", lang: "txt" },
    { h: "Sinusoidal PE in numbers" },
    { code: String.raw`d_model = 4

pos 0:  [0.0000,  1.0000, 0.0000, 1.0000]
pos 1:  [0.8415,  0.5403, 0.0100, 1.0000]
pos 2:  [0.9093, −0.4161, 0.0200, 0.9998]
pos 3:  [0.1411, −0.9900, 0.0300, 0.9996]

the first two dimensions change fast (high frequency)
the last two change very slowly (low frequency) — they separate distant positions`,
      cap: "The last two barely move across the first four positions, but differ clearly at position hundreds or thousands", lang: "txt" },
    { h: "When attention costs more than the FFN" },
    { code: String.raw`d_model = 768 · real FLOPs, with the constants kept
   attention ≈ 4n²d   (QKᵀ and AV, 2n²d each)
   FFN       ≈ 16nd²  (expand and contract, 8nd² each)

n =    512   attention 8.05e8   FFN 4.83e9   attention/FFN = 0.17
n =  2,048   attention 1.29e10  FFN 1.93e10  attention/FFN = 0.67
n = 32,768   attention 3.30e12  FFN 3.09e11  attention/FFN = 10.7`,
      cap: "The crossover sits at roughly n = 4·d_model — below it the FFN dominates, above it attention swallows everything · dropping the constants would put it at n = d_model, four times too early", lang: "txt" },
    { h: "How large a KV cache really gets" },
    { code: String.raw`size = 2 · L · n · d_model · 2 bytes (fp16)

GPT-2 small  L=12  d=768   n=1,024   ->      36 MB
a 7B model   L=32  d=4096  n=4,096   ->   2,048 MB  (2 GB)
a 7B model   L=32  d=4096  n=32,768  ->  16,384 MB  (16 GB)`,
      cap: "**At 32k context the cache exceeds the 7B model's own fp16 weights, which are about 14 GB** — this is the number that decides whether it can be deployed", lang: "txt" },
    { note: "**And this is where every KV cache reduction technique comes from** — multi-query and grouped-query attention let several heads share one K and V, cutting the cache severalfold at little cost in quality." },
    { h: "Why attention truly has no sense of order" },
    { code: String.raw`softmax(QKᵀ)V  —  every term is a sum across positions

permute the rows of X by P:
   Q' = PQ · K' = PK · V' = PV
   softmax(Q'K'ᵀ)V' = P · softmax(QKᵀ)V

-> identical outputs, merely permuted the same way`,
      cap: "A direct proof that it carries no positional information at all — it has to be injected", lang: "txt" }
  ],

  architecture: [
    { p: "This section is about real choices and real settings." },
    { h: "Which family to use" },
    { table: { head: ["Task", "Use", "Why"], rows: [
      ["Text classification · retrieval · embeddings", "**Encoder-only** (BERT, E5)", "Bidirectional, and far lighter"],
      ["Generation · chat · code", "**Decoder-only** (GPT, Llama)", "Every other task can be written as continuation"],
      ["Translation · summarisation with a clear source", "**Encoder-decoder** (T5)", "Separates understanding the source from generating the target"],
      ["Small task, little data", "**Fine-tune a small BERT**", "Far cheaper and faster than reaching for an LLM"]
    ]}},
    { note: "**Do not use a large LLM for ordinary text classification** — a fine-tuned DistilBERT is usually more accurate, tens of times faster, and hundreds of times cheaper." },
    { h: "Standard configurations by size" },
    { table: { head: ["Model", "L", "d_model", "Heads", "Parameters"], rows: [
      ["GPT-2 small", "12", "768", "12", "124M"],
      ["GPT-2 medium", "24", "1024", "16", "355M"],
      ["BERT base", "12", "768", "12", "110M"],
      ["Llama-2 7B", "32", "4096", "32", "6.7B"],
      ["Llama-2 70B", "80", "8192", "64", "69B"]
    ]}},
    { p: "**Note how narrow the per-head size stays** — 64 dimensions in the GPT-2 and BERT generation, 128 in the Llama generation. As d_model grows it is the head count that rises, not the width of each head." },
    { h: "One block as a diagram" },
    { code: String.raw`      x
      |--------------.
   LayerNorm         |
      |              |
  Multi-Head Attn    |  <- a clean residual path, nothing in the way
      |              |
      +--------------'
      |--------------.
   LayerNorm         |
      |              |
     FFN             |
      |              |
      +--------------'
      |`,
      cap: "The right-hand path is the `+1` in the derivative from page 7 — pre-norm keeps it free of obstructions", lang: "txt" },
    { h: "How to fine-tune an LLM" },
    { table: { head: ["Method", "What it updates", "When"], rows: [
      ["**Prompt engineering**", "Nothing at all", "**Always try this first** — cheapest and fastest"],
      ["**RAG**", "Nothing in the model, it adds context", "When the knowledge is specific and changes often"],
      ["**LoRA / QLoRA**", "Small inserted low-rank matrices, about 0.1-1%", "**The default way to fine-tune**"],
      ["**Full fine-tuning**", "Every weight", "With plenty of data and genuinely sufficient GPUs"]
    ]}},
    { code: String.raw`LoRA:  W + ΔW  where  ΔW = B A     A is (r, d) · B is (d, r)

r = 8 · d = 4096  ->  2 × 8 × 4096 = 65,536 parameters
against a full W  ->  4096² = 16,777,216

which is 0.39%`,
      cap: "So it trains on a single GPU, and many adapters for many tasks can share one base model", lang: "txt" },
    { h: "Reducing the cost of long context" },
    { table: { head: ["Method", "What it cuts", "What it costs"], rows: [
      ["**FlashAttention**", "Memory from O(n²) to O(n)", "**No quality cost — mathematically the same result**"],
      ["**Grouped-query attention**", "The KV cache, severalfold", "A small quality loss"],
      ["**Sliding window**", "Only the last k positions are visible", "Distant context is lost"],
      ["**Quantisation (int8/int4)**", "Weight memory by 2-4×", "A small to moderate quality loss"]
    ]}},
    { note: "**Always enable FlashAttention where it is available** — it computes attention in blocks without ever materialising the full (n, n) matrix, giving a mathematically identical result — differing only in floating-point rounding, since the summation order changes — while using far less memory and running faster." }
  ],

  dataflow: [
    { p: "One self-attention block walked from token to output, with a shape on every line." },
    { h: "From token to embedding" },
    { code: String.raw`the text "the cat sat"
   | tokenizer
token ids  [464, 3797, 3332]           (n = 3)
   | token embedding (50257, 768)
X          (3, 768)
   | add positional encoding (3, 768)
X          (3, 768)      <- now it carries positional information`,
      cap: "It is added, not concatenated — the positional encoding is summed directly onto the embedding", lang: "txt" },
    { h: "Producing Q, K and V" },
    { code: String.raw`W_Q, W_K and W_V are each (768, 768)

Q = X W_Q     (3, 768)
K = X W_K     (3, 768)
V = X W_V     (3, 768)`,
      cap: "The heads are not split yet — one full-width multiply first, split afterwards, which is much faster", lang: "txt" },
    { h: "Splitting into 12 heads" },
    { code: String.raw`d_k = 768 / 12 = 64

Q  (3, 768)  ->  reshape  (3, 12, 64)  ->  transpose  (12, 3, 64)
K and V likewise

each head now has its own (3, 64) matrix`,
      cap: "This reshape and transpose adds no parameters at all — it merely rearranges the same numbers", lang: "txt" },
    { h: "The attention scores per head" },
    { code: String.raw`scores = Q Kᵀ / √64        (12, 3, 3)

one head's 3×3 matrix:
   [ 2.0  1.0  0.5 ]
   [ 0.5  2.0  1.0 ]
   [ 1.0  0.5  2.0 ]`,
      cap: "Row i is \"which tokens does token i care about\", before masking", lang: "txt" },
    { h: "Applying the causal mask" },
    { code: String.raw`   [ 2.0  −inf  −inf ]
   [ 0.5   2.0  −inf ]
   [ 1.0   0.5   2.0 ]

softmax per row:
   row 0:  [1.0000, 0,      0     ]     <- it can only see itself
   row 1:  [0.1824, 0.8176, 0     ]
   row 2:  [0.2312, 0.1402, 0.6285]`,
      cap: "Every row sums to exactly 1, and no row can see anything ahead of it", lang: "txt" },
    { h: "Multiplying by V and merging the heads" },
    { code: String.raw`per head:  attn @ V     (3, 3) @ (3, 64) = (3, 64)
12 heads:  (12, 3, 64)
   | transpose + reshape
           (3, 768)              <- concatenated back to full width
   | W_O (768, 768)
           (3, 768)`,
      cap: "W_O is what mixes the heads together — without it each head would stay isolated in its own slice forever", lang: "txt" },
    { h: "Residual, then the FFN" },
    { code: String.raw`x = x + attn_out                    (3, 768)
   | LayerNorm
   | W₁ (768, 3072) + GELU          (3, 3072)    <- expand fourfold
   | W₂ (3072, 768)                 (3, 768)     <- contract back
x = x + ffn_out                     (3, 768)`,
      cap: "The FFN works within each position and never looks across them — that job belongs to attention alone", lang: "txt" },
    { h: "Repeat 12 layers, then exit" },
    { code: String.raw`repeat the block above 12 times   (3, 768) throughout
   | final LayerNorm
   | lm_head (768, 50257)          (3, 50257)
   | take the last row              (50257,)
   | softmax                        the next token's probabilities`,
      cap: "The shape never changes across the 12 layers, which is exactly what allows any number of them to be stacked", lang: "txt" },
    { h: "Generating token 4 with the KV cache" },
    { code: String.raw`without a cache:  recompute K and V for all 4 positions
with a cache:     read K and V for positions 0-2 from the cache
                  compute only position 3
                  and append -> (4, 64) per head

Q holds only one position: (1, 64)
scores = (1, 64) @ (64, 4) = (1, 4)      <- it still sees every earlier position`,
      cap: "**Q has one row while K and V have all of them** — which is why each decode step has few FLOPs but a great deal of memory to read", lang: "txt" },
    { h: "The cost of prefill against decode" },
    { code: String.raw`a 1,000-token prompt:
   prefill  processes 1,000 positions at once  -> big matrix multiplies, compute-bound
   decode   1 position × 200 times             -> each one must read the whole model's
                                                  weights plus the entire KV cache`,
      cap: "So it is memory-bandwidth bound, which is why batching many requests together helps enormously", lang: "txt" }
  ],

  implementation: [
    { p: "Write a transformer from scratch, then reconcile it with the real thing." },
    { h: "1) Multi-head self-attention" },
    { code: String.raw`import torch, torch.nn as nn, math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        assert d_model % n_heads == 0
        self.h = n_heads
        self.d_k = d_model // n_heads
        self.qkv = nn.Linear(d_model, 3 * d_model)   # all three in one multiply
        self.proj = nn.Linear(d_model, d_model)

    def forward(self, x, mask=None):
        B, T, C = x.shape
        q, k, v = self.qkv(x).chunk(3, dim=-1)
        q = q.view(B, T, self.h, self.d_k).transpose(1, 2)   # (B, h, T, d_k)
        k = k.view(B, T, self.h, self.d_k).transpose(1, 2)
        v = v.view(B, T, self.h, self.d_k).transpose(1, 2)

        att = (q @ k.transpose(-2, -1)) / math.sqrt(self.d_k)
        if mask is not None:
            att = att.masked_fill(mask == 0, float("-inf"))
        att = att.softmax(-1)

        out = (att @ v).transpose(1, 2).reshape(B, T, C)
        return self.proj(out)`,
      cap: "One `nn.Linear(d_model, 3*d_model)` then chunk is much faster than three separate Linears, and it is what every implementation does", lang: "python" },
    { h: "2) Building the causal mask" },
    { code: String.raw`def causal_mask(T, device):
    return torch.tril(torch.ones(T, T, device=device)).view(1, 1, T, T)

print(torch.tril(torch.ones(4, 4)))
# tensor([[1., 0., 0., 0.],
#         [1., 1., 0., 0.],
#         [1., 1., 1., 0.],
#         [1., 1., 1., 1.]])`,
      cap: "Better as a `register_buffer` on the model than rebuilt each call — it follows the model across devices and is not counted as a parameter", lang: "python" },
    { h: "3) A pre-norm transformer block" },
    { code: String.raw`class Block(nn.Module):
    def __init__(self, d_model, n_heads, dropout=0.1):
        super().__init__()
        self.ln1 = nn.LayerNorm(d_model)
        self.attn = MultiHeadAttention(d_model, n_heads)
        self.ln2 = nn.LayerNorm(d_model)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, 4 * d_model),
            nn.GELU(),
            nn.Linear(4 * d_model, d_model),
            nn.Dropout(dropout),
        )

    def forward(self, x, mask=None):
        x = x + self.attn(self.ln1(x), mask)     # pre-norm: the LN sits in the branch
        x = x + self.ffn(self.ln2(x))            # not on the residual path
        return x`,
      cap: "**Note that** `x +` **is outside the LayerNorm** — that is the entire difference between pre-norm and post-norm", lang: "python" },
    { h: "4) Sinusoidal positional encoding" },
    { code: String.raw`def sinusoidal_pe(max_len, d_model):
    pe = torch.zeros(max_len, d_model)
    pos = torch.arange(max_len).unsqueeze(1).float()
    div = torch.exp(torch.arange(0, d_model, 2).float()
                    * (-math.log(10000.0) / d_model))
    pe[:, 0::2] = torch.sin(pos * div)
    pe[:, 1::2] = torch.cos(pos * div)
    return pe

print(sinusoidal_pe(4, 4))
# tensor([[ 0.0000,  1.0000,  0.0000,  1.0000],
#         [ 0.8415,  0.5403,  0.0100,  1.0000],
#         [ 0.9093, -0.4161,  0.0200,  0.9998],
#         [ 0.1411, -0.9900,  0.0300,  0.9996]])`,
      cap: "Matching the hand calculation above to every digit · written as `exp(log)` for numerical stability", lang: "python" },
    { h: "5) The full model" },
    { code: String.raw`class GPT(nn.Module):
    def __init__(self, vocab, d_model=768, n_heads=12, n_layers=12, max_len=1024):
        super().__init__()
        self.tok = nn.Embedding(vocab, d_model)
        self.pos = nn.Embedding(max_len, d_model)
        self.blocks = nn.ModuleList([Block(d_model, n_heads) for _ in range(n_layers)])
        self.ln_f = nn.LayerNorm(d_model)
        self.head = nn.Linear(d_model, vocab, bias=False)
        self.head.weight = self.tok.weight       # weight tying
        self.register_buffer("mask",
            torch.tril(torch.ones(max_len, max_len)).view(1, 1, max_len, max_len))

    def forward(self, idx):
        B, T = idx.shape
        x = self.tok(idx) + self.pos(torch.arange(T, device=idx.device))
        for b in self.blocks:
            x = b(x, self.mask[:, :, :T, :T])
        return self.head(self.ln_f(x))`,
      cap: "**Weight tying** makes the lm_head share the token embedding's weights — saving 38 million parameters and usually improving results", lang: "python" },
    { h: "6) Verifying the parameter count" },
    { code: String.raw`model = GPT(vocab=50257)
total = sum(p.numel() for p in model.parameters())
print(f"{total:,}")
# 124,439,808

# reconcile with the hand count:
# 12 blocks × 7,087,872 = 85,054,464
# + token emb 38,597,376 + pos emb 786,432 + final ln 1,536
# = 124,439,808  ✓`,
      cap: "If the number does not match your own count, a layer has been misunderstood or the weight tying forgotten", lang: "python" },
    { h: "7) FlashAttention in PyTorch" },
    { code: String.raw`out = torch.nn.functional.scaled_dot_product_attention(
    q, k, v, attn_mask=None, dropout_p=0.0, is_causal=True
)

# it selects the fastest available kernel, including FlashAttention
# it never materialises the (T, T) matrix -> O(n) memory instead of O(n²)
# the output is identical to the hand-written version`,
      cap: "**Use this instead of hand-writing attention in real work** — faster and dramatically lighter on memory", lang: "python" },
    { h: "8) The KV cache during generation" },
    { code: String.raw`@torch.no_grad()
def generate(model, idx, max_new=50, temperature=1.0, top_k=50):
    past = None
    for _ in range(max_new):
        inp = idx if past is None else idx[:, -1:]     # after the first step, send only the last token
        logits, past = model(inp, past_kv=past)
        logits = logits[:, -1, :] / temperature
        if top_k:
            v, _ = logits.topk(top_k)
            logits[logits < v[:, [-1]]] = float("-inf")
        nxt = torch.multinomial(logits.softmax(-1), 1)
        idx = torch.cat([idx, nxt], dim=1)
    return idx`,
      cap: "The `idx[:, -1:]` line is the whole of the KV cache at the usage level — one position goes in, not the whole sequence", lang: "python" },
    { h: "9) Computing the KV cache size in advance" },
    { code: String.raw`def kv_cache_mb(n_layers, d_model, seq_len, batch=1, bytes_per=2):
    return 2 * n_layers * seq_len * d_model * batch * bytes_per / 1024**2

print(kv_cache_mb(12, 768, 1024))        # 36.0     GPT-2 small
print(kv_cache_mb(32, 4096, 4096))       # 2048.0   7B at 4k context
print(kv_cache_mb(32, 4096, 32768))      # 16384.0  7B at 32k context`,
      cap: "**Always compute this before choosing hardware** — at 32k context the cache is larger than the model's own weights", lang: "python" },
    { h: "10) LoRA" },
    { code: String.raw`class LoRALinear(nn.Module):
    def __init__(self, base: nn.Linear, r=8, alpha=16):
        super().__init__()
        self.base = base
        for p in self.base.parameters():
            p.requires_grad = False               # freeze the original weights
        self.A = nn.Parameter(torch.randn(r, base.in_features) * 0.01)
        self.B = nn.Parameter(torch.zeros(base.out_features, r))   # initialised to zero
        self.scale = alpha / r

    def forward(self, x):
        return self.base(x) + (x @ self.A.T @ self.B.T) * self.scale`,
      cap: "**B starts at zero**, so `ΔW = 0` initially — the model begins with exactly its original behaviour and diverges from there, which is why LoRA is so stable", lang: "python" }
  ],

  tricks: [
    { h: "Diagnosing by symptom" },
    { table: { head: ["Symptom", "Cause", "Fix"], rows: [
      ["Training loss falls implausibly fast toward zero", "**The causal mask is missing**", "The model is reading the token it must predict"],
      ["Generation is gibberish despite a low loss", "A wrong mask, or a wrong target shift", "Check that `target = input[1:]` really holds"],
      ["The model ignores word order entirely", "**Positional encoding was never added**", "Check that it really is summed after the embedding"],
      ["Out of memory at long context", "The (n, n) matrix explodes", "**FlashAttention** · gradient checkpointing · smaller batch"],
      ["Out of memory during generation, not training", "The KV cache is larger than expected", "Compute the cache size first · grouped-query attention"],
      ["The loss goes NaN early in training", "Post-norm without warmup", "Switch to **pre-norm** · add warmup"],
      ["Poor results on inputs longer than training", "Learned positional embeddings", "Use RoPE or sinusoidal"],
      ["Decoding is slow while the GPU sits idle", "Memory-bandwidth bound", "Batch several requests · quantise the weights"],
      ["Fine-tuning makes the model forget its abilities", "Learning rate too high, or full fine-tuning on little data", "Use LoRA · drop the lr to 1e-5 or lower"]
    ]}},
    { h: "Defaults you can use immediately" },
    { code: String.raw`d_model / n_heads = 64-128      pin the per-head size, grow the head count
FFN                = 4 × d_model
norm               always pre-norm
activation         GELU or SwiGLU
positional         RoPE
dropout            0.0 - 0.1  (large models often use 0.0)
optimizer          AdamW, β₂ = 0.95 · weight decay 0.1
schedule           cosine + 2,000 warmup steps
clipping           1.0`,
      cap: "`β₂ = 0.95` rather than 0.999 is what large language models use, because it responds to change faster", lang: "txt" },
    { h: "The most common mistakes" },
    { ul: [
      "**Believing multi-head adds parameters**, when it splits the same d_model",
      "**Believing most parameters sit in attention**, when the FFN takes two thirds",
      "**Forgetting the causal mask**, which gives a beautiful loss and a useless model",
      "**Forgetting positional encoding**, then wondering why word order is ignored",
      "**Using post-norm in a deep model** without sufficiently careful warmup",
      "**Not computing the KV cache before deployment**, then running out of memory in production",
      "**Reaching for a large LLM for text classification**, where DistilBERT is better and hundreds of times cheaper"
    ]},
    { h: "Numbers worth remembering" },
    { table: { head: ["Thing", "Value"], rows: [
      ["Parameters per block", "`12 · d_model²` (attention 4 · FFN 8)"],
      ["The FFN's share", "**Two thirds**"],
      ["Per-head size", "64 dimensions in GPT-2/BERT, 128 in Llama"],
      ["Attention's cost", "`4n²d` against the FFN's `16nd²` — it overtakes at around n = 4·d_model"],
      ["KV cache size", "`2 · L · n · d · bytes`"],
      ["GPT-2 small", "12 layers · d 768 · 124,439,808 parameters"],
      ["LoRA's share", "About 0.1-1% of the weights"]
    ]}},
    { note: "**If only one sentence survives from this page**: the transformer did not win because attention beats LSTM on quality, but because dropping recurrence made training parallel — and what was traded away is `O(n²)`, a price still being paid today in the form of expensive context." }
  ],

  eval: [
    { p: "The questions that separate understanding the transformer from using the library." },
    { qa: [
      { q: "What did the transformer paper actually add?",
        a: "Nothing — it **removed the recurrence**. Attention already existed from 2014; what was new was discarding the RNN entirely so every position could be computed at once in a single matrix multiply, and that is what made scale possible." },
      { q: "How does self-attention differ from the previous page's attention?",
        a: "The equation is character for character identical; only the origin differs. Cross-attention takes q from the decoder and k, v from the encoder, while self-attention takes all three from the same sequence." },
      { q: "What shape is `Q Kᵀ`, and why does it matter?",
        a: "`(n, n)` — every position scored against every other in one matrix multiply, which is the parallelism an RNN cannot have, and also the origin of the `O(n²)` cost." },
      { q: "How many more parameters does multi-head use?",
        a: "None. It **splits** `d_model` into h parts — 512 with 8 heads gives 64 dimensions each — and the parameter count stays `4·d_model²` whatever h is." },
      { q: "So what does splitting buy?",
        a: "One head produces a single weighted average, meaning one view of the relationships, while several heads produce several at once — and inspection shows they specialise, some tracking syntax, some only the previous token." },
      { q: "Why does a transformer need positional encoding?",
        a: "Because self-attention is permutation equivariant — permute the input rows and the outputs are identical, merely permuted. It carries no notion of order at all, unlike an RNN where order is structural. (The property holds for the unmasked case.)" },
      { q: "What kinds of positional encoding are there?",
        a: "Sinusoidal, which is fixed, parameter-free and extrapolates beyond the trained length; learned, one embedding per position, simple but unable to exceed the trained length; and RoPE, which rotates Q and K by position and therefore encodes relative distance — used by nearly every modern LLM." },
      { q: "How does pre-norm differ from post-norm, and why did the field move to pre-norm?",
        a: "Pre-norm is `x = x + Attn(LN(x))` and post-norm is `x = LN(x + Attn(x))`. Pre-norm leaves the residual path from output to input unobstructed, preserving the `+1` in the derivative, so deep stacks train without delicate warmup." },
      { q: "Where do most of a transformer's parameters sit?",
        a: "In the **FFN, which takes two thirds** — per block, attention uses `4·d²` and the FFN `8·d²`, totalling `12·d²`. Anyone who thinks a transformer is mostly attention has the budget backwards." },
      { q: "What does the FFN do that attention does not?",
        a: "The FFN processes within each position and never looks across positions, while attention mixes across them — and the two alternate, layer after layer." },
      { q: "What does the causal mask do, and what happens without it?",
        a: "It adds `-inf` to the upper triangle before the softmax so position t sees no further than t. Without it, a language model reads the very token it is asked to predict, so the loss falls to near zero while generation is worthless." },
      { q: "What is the first row of causal attention after the softmax?",
        a: "Always `[1.0, 0, 0, ...]`, because the first position can only see itself and a softmax over a single value is exactly 1, whatever the raw score was." },
      { q: "How do encoder-only, decoder-only and encoder-decoder differ?",
        a: "Encoder-only is unmasked and bidirectional, suiting classification and retrieval, like BERT; decoder-only uses a causal mask and suits generation, like GPT; encoder-decoder has both and suits translation and summarisation, like T5." },
      { q: "Why did decoder-only swallow the other tasks?",
        a: "Because almost anything can be written as continuing text — classification, question answering, summarisation — so one model type, trained once, serves every task." },
      { q: "When does attention cost more than the FFN?",
        a: "With the real constants (attention ≈ `4n²d`, FFN ≈ `16nd²`) the crossover is around `n = 4·d_model` — at d=768 and n=512 attention is six times cheaper, while at n=32,768 it costs about 11× more." },
      { q: "What does the KV cache store, and how large does it get?",
        a: "The K and V of every previous token, so they are not recomputed. Its size is `2·L·n·d·bytes` — a 7B model at 32k context needs 16 GB, **more than the model's own weights at about 14 GB**." },
      { q: "Why is the first token slow and the rest fast?",
        a: "Prefill processes the whole prompt at once and is compute-bound, while decode produces one token at a time with very few FLOPs but must read the entire model's weights plus the whole KV cache, making it memory-bandwidth bound." },
      { q: "Why does batching requests at inference help so much?",
        a: "Because when memory bandwidth is the bottleneck, weights read once can serve many requests simultaneously, so the cost per request falls sharply." },
      { q: "What does FlashAttention trade for its speed?",
        a: "**No quality at all** — the result is mathematically identical, differing only in floating-point rounding because the summation order changes. It computes in blocks without materialising the `(n,n)` matrix, using `O(n)` memory instead of `O(n²)` and running faster." },
      { q: "How does LoRA work, and why is it stable?",
        a: "It inserts a low-rank `ΔW = BA` while freezing the original weights — at r=8 and d=4096 that is 65,536 parameters against 16.8 million, or 0.39%. It is stable because **B starts at zero**, so `ΔW = 0` initially and the model begins with exactly its original behaviour." },
      { q: "Can you count GPT-2 small's parameters?",
        a: "12 blocks × 7,087,872 = 85,054,464, plus a token embedding of 38,597,376, a positional embedding of 786,432 and a final layer norm of 1,536, totalling 124,439,808 — with the lm_head sharing the token embedding and therefore not counted twice." },
      { q: "How do you estimate a model's size quickly?",
        a: "`12 · L · d_model²` plus the embeddings — at d=768 that gives 7,077,888 per block against an actual 7,087,872, an error of 0.14%, which is every bias and layer norm." }
    ]},
    { h: "Further reading" },
    { links: [
      { label: "Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762", note: "The 2017 original — shorter than expected and genuinely readable" },
      { label: "The Illustrated Transformer (Jay Alammar)", url: "https://jalammar.github.io/illustrated-transformer/", note: "The most-cited visual explanation, working through it matrix by matrix" },
      { label: "The Annotated Transformer (Harvard NLP)", url: "https://nlp.seas.harvard.edu/annotated-transformer/", note: "The whole paper with PyTorch code interleaved paragraph by paragraph" },
      { label: "Let's build GPT from scratch (Karpathy)", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY", note: "A complete GPT built live in two hours, every line explained" },
      { label: "nanoGPT", url: "https://github.com/karpathy/nanoGPT", note: "A GPT you can actually read end to end, around 300 lines, and actually train" },
      { label: "RoFormer: Rotary Position Embedding (RoPE)", url: "https://arxiv.org/abs/2104.09864", note: "The positional encoding nearly every modern LLM uses" },
      { label: "FlashAttention", url: "https://arxiv.org/abs/2205.14135", note: "Why reordering memory access drops O(n²) to O(n) with identical output" },
      { label: "LoRA: Low-Rank Adaptation of Large Language Models", url: "https://arxiv.org/abs/2106.09685", note: "The original paper, with the argument for why low rank suffices" },
      { label: "The Transformer Family (Lilian Weng)", url: "https://lilianweng.github.io/posts/2023-01-27-the-transformer-family-v2/", note: "Every transformer variant, and every attempt at reducing the O(n²)" }
    ]}
  ]
};
