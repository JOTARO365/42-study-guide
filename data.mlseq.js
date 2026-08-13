/* Sequence models — RNN, LSTM, GRU, seq2seq, attention */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

window.TEACHING_DATA.push({
  id: "ml_seq",
  name: "Sequence — RNN, LSTM, seq2seq และ attention",
  nameEn: "Sequences — RNN, LSTM, seq2seq and Attention",
  titleShort: { th: "Sequence & Attention", en: "Sequences & Attention" },
  tag: {
    th: "ลำดับมีสองอย่างที่เวกเตอร์ขนาดคงที่ไม่มี: ลำดับมีความหมาย และความยาวไม่เท่ากัน — RNN แก้ทั้งคู่ด้วยการใช้น้ำหนักชุดเดิมซ้ำทุกก้าวเวลา แล้วจ่ายราคาเป็น λᵀ และ attention คือสิ่งที่มาลบคอขวดนั้นทิ้ง",
    en: "A sequence has two properties a fixed vector does not: order matters and length varies — an RNN solves both by reusing one weight matrix at every timestep and pays for it with λᵀ, and attention is what removes the bottleneck entirely"
  },
  accent: "#c084fc",
  sections: {
    principle: [
      { h: "ลำดับต่างจาก input แบบอื่นตรงไหน" },
      { table: { head: ["คุณสมบัติ", "ทำไมโครงสร้างเดิมใช้ไม่ได้"], rows: [
        ["**ลำดับมีความหมาย**", "\"หมากัดคน\" กับ \"คนกัดหมา\" มี token เดียวกันทุกตัว"],
        ["**ความยาวไม่เท่ากัน**", "dense layer ต้องรู้จำนวน input ล่วงหน้า แต่ประโยคยาวไม่เท่ากัน"],
        ["**พึ่งพากันข้ามระยะไกล**", "ประธานกับกริยาอาจห่างกันยี่สิบคำ"]
      ]}},
      { h: "RNN แก้สองข้อแรกด้วยกลไกเดียว" },
      { code: String.raw`h_t = tanh(W_hh · h_{t−1} + W_xh · x_t + b)

**W ชุดเดียวกันถูกใช้ทุกก้าวเวลา** — เทียบเท่ากับที่ CNN ใช้ kernel เดียวทุกตำแหน่ง
→ รับความยาวเท่าไรก็ได้ และจำนวนพารามิเตอร์ไม่โตตามความยาว`,
        cap: "นี่คือ weight sharing ในมิติเวลา และเป็นแนวคิดเดียวกับหน้าที่แล้วทุกประการ", lang: "txt" },
      { h: "แล้วจ่ายราคาเป็นอะไร" },
      { code: String.raw`gradient ย้อนกลับ T ก้าว มีพจน์  Π (W_hhᵀ · tanh'(z_t))

**เมทริกซ์ตัวเดียวกันคูณตัวเองซ้ำ T ครั้ง** ไม่ใช่ T เมทริกซ์ที่ต่างกัน
→ พฤติกรรมเหมือน λᵀ เมื่อ λ คือ eigenvalue ที่ใหญ่ที่สุด

λ = 0.90  →  T=10: 0.349   T=50: 0.00515   T=100: 0.0000266
λ = 1.10  →  T=10: 2.59    T=50: 117       T=100: 13,800`,
        cap: "ประโยค 50 คำจึงเทียบเท่าเครือข่าย 50 ชั้นที่ใช้น้ำหนักชุดเดียวกันทุกชั้น", lang: "txt" },
      { note: "**\"RNN ลืมบริบทยาว\" เป็นการบรรยายอาการ ส่วน λᵀ คือเหตุผล** — และนี่คือความต่างจาก vanishing gradient ในหน้าที่ 5 ที่แต่ละชั้นมีเมทริกซ์ของตัวเอง การคูณเมทริกซ์เดียวกันซ้ำทำให้มันรุนแรงกว่ามาก" },
      { h: "แผนของหน้านี้" },
      { code: String.raw`RNN            ใช้ได้ แต่พังเมื่อลำดับยาว
  ↓
LSTM / GRU     ใส่เส้นทางแบบบวกเข้าไป แก้ λᵀ ได้
  ↓
seq2seq        ต่อสองตัวเข้าด้วยกัน แต่เกิดคอขวดใหม่
  ↓
attention      ลบคอขวดนั้นทิ้ง
  ↓
transformer    ทิ้ง recurrence ไปเลย เหลือแต่ attention  (หน้าถัดไป)`,
        cap: "แต่ละขั้นคือคำตอบของปัญหาที่ขั้นก่อนหน้าสร้างขึ้นมา ไม่ใช่รายชื่อสถาปัตยกรรม", lang: "txt" },
      { h: "หน้านี้จะทำให้ทำได้" },
      { ul: [
        "อธิบายว่าทำไม gradient ของ RNN พังแรงกว่าเครือข่ายลึกธรรมดา ด้วย λᵀ",
        "อธิบาย LSTM ผ่านเส้นทางบวกของ cell state ไม่ใช่แค่ชื่อของสามประตู",
        "คำนวณ attention ด้วยมือได้ครบ ตั้งแต่ dot product ถึง weighted average",
        "รู้ว่าทำไมต้องหารด้วย √d_k และแสดงผลด้วยตัวเลขได้",
        "รู้ว่า exposure bias เกิดจากอะไร และทำไมโมเดลดูดีตอนเทรนแต่เพี้ยนตอนสร้างข้อความ"
      ]}
    ],

    theory: [
      { p: "หมวดนี้ไล่จาก RNN ถึง attention โดยแต่ละขั้นแก้ปัญหาของขั้นก่อนหน้า" },
      { h: "1) RNN แบบคลี่ออก" },
      { code: String.raw`x₁ → [W] → h₁ → [W] → h₂ → [W] → h₃ → ...
              ↑            ↑            ↑
              x₂           x₃           x₄

W ตัวเดียวกันทุกกล่อง — คลี่ออกแล้วก็คือเครือข่ายลึกที่ผูกน้ำหนักไว้ด้วยกัน`,
        cap: "การคลี่ออกทำให้เห็นว่า backpropagation through time ไม่ใช่อัลกอริทึมใหม่ แต่คือ backprop บนกราฟที่ยาวขึ้น", lang: "txt" },
      { h: "2) พารามิเตอร์ของ RNN" },
      { code: String.raw`พารามิเตอร์ = h·(h + x) + h        h = ขนาด hidden · x = ขนาด input

h = 256 · x = 128  →  256 × 384 + 256 = 98,560

**ไม่ขึ้นกับความยาวของลำดับเลย** — ประมวลผลได้ทั้งประโยค 5 คำและ 500 คำ`,
        cap: "จุดนี้เหมือน CNN ที่พารามิเตอร์ไม่ขึ้นกับขนาดภาพ ด้วยเหตุผลเดียวกันคือ weight sharing", lang: "txt" },
      { h: "3) ข้อจำกัดที่แก้ไม่ได้ของ RNN" },
      { table: { head: ["ข้อจำกัด", "ผลที่ตามมา"], rows: [
        ["**λᵀ**", "ลืมบริบทที่ห่างเกิน 20-50 ก้าว"],
        ["**คำนวณขนานตามเวลาไม่ได้**", "ต้องได้ `h_{t−1}` ก่อนถึงจะคำนวณ `h_t` ได้ — ใช้ GPU ได้ไม่เต็ม"],
        ["**gradient ระเบิดได้ง่าย**", "ต้อง gradient clipping เสมอ ไม่ใช่ตัวเลือก"]
      ]}},
      { p: "**ข้อที่สองคือเหตุผลจริงที่ transformer ชนะ** ไม่ใช่แค่เรื่องคุณภาพ — RNN บังคับให้ประมวลผลทีละก้าว ขณะที่ attention คำนวณทุกตำแหน่งพร้อมกันได้ในการคูณเมทริกซ์ครั้งเดียว" },
      { h: "4) LSTM — เส้นทางแบบบวก" },
      { code: String.raw`f_t = σ(W_f [h_{t−1}, x_t])     forget: เก็บ cell state เดิมไว้เท่าไร
i_t = σ(W_i [h_{t−1}, x_t])     input:  รับข้อมูลใหม่เข้ามาเท่าไร
g_t = tanh(W_g [h_{t−1}, x_t])  เนื้อหาที่จะรับเข้ามา
o_t = σ(W_o [h_{t−1}, x_t])     output: เปิดเผย cell ออกไปเท่าไร

C_t = f_t ⊙ C_{t−1} + i_t ⊙ g_t     ← **บวก ไม่ใช่คูณด้วยเมทริกซ์**
h_t = o_t ⊙ tanh(C_t)`,
        cap: "บรรทัด C_t คือหัวใจทั้งหมด — cell state ถูกบวกเพิ่ม ไม่ได้ถูกคูณด้วย W ซ้ำ ๆ", lang: "txt" },
      { note: "**เมื่อ** `f_t ≈ 1` **เส้นทาง gradient ตาม C ประมาณเป็น identity** ซึ่งคือกลไกเดียวกับ `+1` ของ ResNet ในหน้าที่แล้ว แต่ถูกคิดค้นก่อนสองทศวรรษ · **ใครที่สอน LSTM ว่า 'สามประตูควบคุมการไหลของข้อมูล' โดยไม่พูดถึงเส้นทางบวก คือสอนคำศัพท์ ไม่ได้สอนกลไก**" },
      { h: "5) ทำไม forget gate ควรเริ่มด้วย bias เป็นบวก" },
      { code: String.raw`f_t เริ่มใกล้ 0  →  ลืมทุกอย่างทันที  →  cell state ไม่เคยสะสมอะไรเลย

ตั้ง bias ของ forget gate เป็น 1.0 ตั้งแต่ต้น
→ σ(1.0) = 0.73  →  เริ่มจากการ 'จำไว้ก่อน' แล้วค่อยเรียนรู้ว่าจะลืมอะไร`,
        cap: "เป็นเทคนิคเล็ก ๆ ที่ทำให้ LSTM เทรนติดเร็วขึ้นชัดเจน และหลายไลบรารีทำให้เป็นค่าเริ่มต้น", lang: "txt" },
      { h: "6) GRU — ตัวที่ถูกกว่า" },
      { code: String.raw`รวม forget กับ input เข้าเป็น update gate ตัวเดียว
และตัด cell state แยกทิ้ง เหลือแต่ h

พารามิเตอร์ที่ h=256 x=128:
   RNN    98,560
   GRU   295,680      = 3 ชุด
   LSTM  394,240      = 4 ชุด

GRU ใช้ 75% ของ LSTM`,
        cap: "คุณภาพมักใกล้เคียงกันมาก — ลองทั้งคู่ ไม่มีตัวไหนชนะเสมอ", lang: "txt" },
      { h: "7) bidirectional กับ stacked" },
      { table: { head: ["แบบ", "ทำอะไร", "ใช้เมื่อ"], rows: [
        ["**bidirectional**", "อ่านจากซ้ายและจากขวา แล้วต่อกัน", "**เห็นทั้งประโยคแล้ว** เช่นจำแนกข้อความ · **ห้ามใช้กับการพยากรณ์**"],
        ["**stacked**", "ซ้อน RNN หลายชั้น", "2-3 ชั้นมักพอ เกินนั้นได้ผลน้อย"]
      ]}},
      { note: "**bidirectional บนข้อมูลอนุกรมเวลาคือการรั่วของอนาคต** — มันอ่านค่าที่ยังไม่เกิดขึ้นจริงตอนใช้งานจริง ซึ่งทำให้คะแนน validation ดีเกินจริงและใช้งานจริงไม่ได้เลย" },
      { h: "8) seq2seq และคอขวดของมัน" },
      { code: String.raw`encoder อ่านทั้งประโยค → บีบเหลือเวกเตอร์ตัวเดียว → decoder สร้างออกมา

ประโยค 5 คำ   → เวกเตอร์ 512 มิติ
ประโยค 50 คำ  → เวกเตอร์ 512 มิติ เท่ากัน

→ ยิ่งประโยคยาว คุณภาพยิ่งตก และตกอย่างที่วัดได้ชัดเจน`,
        cap: "การตกลงตามความยาวคือคอขวดที่มองเห็นได้ในตัวเลข ไม่ใช่ข้อสงสัยเชิงทฤษฎี", lang: "txt" },
      { h: "9) attention — คำตอบของคอขวดนั้นโดยตรง" },
      { code: String.raw`แทนที่จะใช้เวกเตอร์ตัวสุดท้ายตัวเดียว
decoder มองเห็น **ทุก** hidden state ของ encoder แล้วเฉลี่ยแบบถ่วงน้ำหนักที่เรียนรู้เอง

score_i = q · k_i / √d_k
α       = softmax(score)
context = Σ αᵢ vᵢ`,
        cap: "น้ำหนัก α เปลี่ยนทุกก้าวที่ decoder สร้าง — จึง 'มอง' คำต้นทางคนละคำในแต่ละก้าว", lang: "txt" },
      { h: "10) query, key, value คืออะไร" },
      { table: { head: ["ตัว", "ความหมาย", "มาจาก"], rows: [
        ["**query**", "ตำแหน่งปัจจุบันกำลังมองหาอะไร", "สถานะของ decoder ณ ก้าวนั้น"],
        ["**key**", "แต่ละตำแหน่งเสนอตัวว่าเป็นอะไร", "hidden state ของ encoder"],
        ["**value**", "แต่ละตำแหน่งให้เนื้อหาอะไรจริง ๆ", "hidden state ของ encoder (คนละการฉายกับ key)"]
      ]}},
      { p: "**เปรียบเทียบที่ตรงที่สุดคือการค้นหาในพจนานุกรม** — query คือคำที่ค้น key คือคำที่เป็นดัชนี value คือความหมายที่ได้กลับมา ต่างกันตรงที่ที่นี่ไม่ได้เลือกอันเดียว แต่เฉลี่ยทุกอันตามความเข้ากัน" },
      { h: "11) ทำไมต้องหารด้วย √d_k" },
      { code: String.raw`ถ้าองค์ประกอบของ q กับ k มีความแปรปรวน 1 และมี d_k มิติ
dot product จะมีความแปรปรวน d_k → ค่ามันโตตาม √d_k

score เดียวกันในทิศทางเดียวกัน:
   d_k = 4   raw [3.0, 1.0, 0.0]    → softmax [0.844, 0.114, 0.042]
   d_k = 64  raw [12.0, 4.0, 0.0]   → softmax [0.9997, 0.0003, 0.000]

หารด้วย √d_k แล้วทั้งสองกรณีได้ [0.629, 0.231, 0.140] เท่ากัน`,
        cap: "ถ้าไม่หาร softmax จะเกือบ one-hot และ gradient ของมันเกือบเป็นศูนย์ — เทรนไม่ขึ้น", lang: "txt" },
      { h: "12) teacher forcing และ exposure bias" },
      { code: String.raw`ตอนเทรน:   ป้อน token จริงของก้าวก่อนหน้าเข้าไป → เร็วและเสถียร
ตอนใช้จริง: ป้อน token ที่โมเดลสร้างเองเข้าไป → ซึ่งมันไม่เคยเห็นตอนเทรน

ผิดหนึ่งคำ → input ของก้าวถัดไปผิด → ยิ่งไกลยิ่งเพี้ยน`,
        cap: "เรียกว่า exposure bias และเป็นเหตุผลที่โมเดลดูดีมากตอนเทรนแต่ข้อความที่สร้างค่อย ๆ หลุด", lang: "txt" },
      { h: "13) greedy เทียบ beam search" },
      { table: { head: ["", "greedy", "beam search"], rows: [
        ["ทำอะไร", "เลือก argmax ทุกก้าว", "เก็บสมมติฐานไว้ k เส้นพร้อมกัน"],
        ["ปัญหา", "**เลือกผิดก้าวแรกแล้วแก้ไม่ได้**", "ช้ากว่า k เท่า"],
        ["ค่าที่ใช้", "—", "k = 4-10"],
        ["k ใหญ่มาก", "—", "**มักแย่ลง** เพราะ likelihood เข้าข้างประโยคสั้นและจืด"]
      ]}}
    ],

    foundations: [
      { p: "หมวดนี้เจาะกลไกที่ตัดสินว่าโมเดลลำดับจะทำงานได้แค่ไหน" },
      { h: "λᵀ ด้วยตัวเลขเต็ม ๆ" },
      { code: String.raw`             T = 10      T = 50        T = 100
λ = 0.90     0.349      0.00515       0.0000266
λ = 0.99     0.904      0.605         0.366
λ = 1.10     2.59       117           13,800`,
        cap: "แถวกลางคือเหตุผลที่การตั้งค่าเริ่มต้นและ normalization ของ RNN ต้องประณีตกว่าปกติมาก", lang: "txt" },
      { p: "**และนี่ต่างจากเครือข่ายลึกธรรมดาอย่างมีนัยสำคัญ** — ที่นั่นแต่ละชั้นมีเมทริกซ์ของตัวเอง ค่ามันจึงเฉลี่ยกันได้บ้าง แต่ใน RNN เป็นเมทริกซ์เดียวยกกำลัง T ซึ่งไม่มีอะไรมาเฉลี่ยเลย" },
      { h: "gradient clipping ใน RNN ไม่ใช่ตัวเลือก" },
      { code: String.raw`λ > 1 ทำให้ gradient ระเบิดเป็น exponential
คลิปที่ norm = 1.0 หรือ 5.0 เป็นสิ่งที่ต้องมีเสมอ

ถ้า ‖g‖ > c :  g ← g · c / ‖g‖`,
        cap: "ต่างจากเครือข่ายลึกทั่วไปที่ clipping เป็นแค่ตัวช่วย — ใน RNN มันคือสิ่งจำเป็น", lang: "txt" },
      { h: "เดิน LSTM หนึ่งก้าวด้วยตัวเลข" },
      { code: String.raw`C_prev = 0.8   h_prev = 0.1   x = 1.0

f = σ(0.5·1.0 + 0.4·0.1 + 0.5) = σ(1.04)  = 0.7389
i = σ(0.6·1.0 + 0.3·0.1 − 0.2) = σ(0.43)  = 0.6059
g = tanh(0.7·1.0 + 0.2·0.1)    = tanh(0.72) = 0.6169
o = σ(0.3·1.0 + 0.5·0.1 + 0.1) = σ(0.45)  = 0.6106

C = f·C_prev + i·g = 0.7389(0.8) + 0.6059(0.6169) = 0.5911 + 0.3738 = 0.9648
h = o·tanh(C) = 0.6106 × tanh(0.9648) = 0.6106 × 0.7464 = 0.4558`,
        cap: "จับตาบรรทัด C: มันคือ 'เก็บของเก่าไว้ 74%' บวก 'รับของใหม่เข้ามา 0.374' — ไม่มีการคูณเมทริกซ์เลย", lang: "txt" },
      { h: "เส้นทาง gradient ของ cell state" },
      { code: String.raw`∂C_t / ∂C_{t−1} = f_t

ถ้า f_t ≈ 1 ทุกก้าว  →  ผลคูณข้ามเวลา ≈ 1  →  gradient ผ่านได้ครบ
ถ้า f_t ≈ 0.5        →  0.5ᵀ  →  ลืมเร็วโดยตั้งใจ

**โมเดลจึงเลือกได้เองว่าจะจำนานแค่ไหน** ต่างจาก RNN ที่ถูก λ บังคับ`,
        cap: "นี่คือคำตอบที่สมบูรณ์ของว่า LSTM แก้ปัญหาอะไร และแก้อย่างไร", lang: "txt" },
      { h: "padding กับ masking — ที่ที่บั๊กอยู่" },
      { code: String.raw`ลำดับใน batch ยาวไม่เท่ากัน จึงต้องเติม pad

[5, 3, 8, 2, 0, 0, 0]      0 = pad
[7, 1, 0, 0, 0, 0, 0]

**ถ้าไม่ mask**:
   pad มีส่วนใน loss    → โมเดลเรียนรู้ที่จะทำนาย pad
   pad ได้น้ำหนัก attention → context ถูกเจือจางด้วยของว่างเปล่า`,
        cap: "ทั้งสองอย่างไม่มี error แจ้ง มีแต่คะแนนที่แย่ลงอย่างอธิบายไม่ถูก", lang: "txt" },
      { h: "attention ราคาเท่าไร" },
      { code: String.raw`ลำดับยาว n · มิติ d

RNN:        O(n · d²)   ตามลำดับ ขนานตามเวลาไม่ได้
attention:  O(n² · d)   **ขนานได้ทั้งหมด**

n = 100  →  attention ถูกกว่าเมื่อ d > 100
n = 10,000 → n² = 100 ล้าน  ← นี่คือเหตุผลที่บริบทยาวมีราคาแพง`,
        cap: "จุดที่แลกกันคือ RNN โตเชิงเส้นตามความยาวแต่ขนานไม่ได้ ส่วน attention โตกำลังสองแต่ขนานได้เต็มที่", lang: "txt" },
      { h: "attention เรียนรู้อะไรได้จริง" },
      { p: "**เมื่อพล็อตน้ำหนัก attention ของโมเดลแปลภาษาออกมาเป็นตาราง จะเห็นเส้นทแยงมุมที่บิดไปตามลำดับคำของภาษาปลายทาง** — และในคู่ภาษาที่ลำดับคำต่างกัน เช่นภาษาที่กริยาอยู่ท้ายประโยค เส้นนั้นจะข้ามไขว้กันตรงตำแหน่งที่คาดไว้พอดี ซึ่งเป็นหลักฐานว่ามันเรียนรู้การจับคู่คำจริง ไม่ใช่แค่ค่าเฉลี่ยที่ดูดี" },
      { h: "อนุกรมเวลาต่างจากข้อความตรงไหน" },
      { table: { head: ["เรื่อง", "ข้อความ", "อนุกรมเวลา"], rows: [
        ["การแบ่งข้อมูล", "สุ่มได้", "**ต้องแบ่งตามเวลาเท่านั้น**"],
        ["bidirectional", "ใช้ได้", "**ห้ามใช้ — เป็นการรั่วของอนาคต**"],
        ["feature จากหน้าต่าง", "ไม่เกี่ยว", "**หน้าต่างที่คร่อมอนาคตคือ leakage**"],
        ["ความเป็นฤดูกาล", "ไม่มี", "ต้องใส่เข้าไปเป็น feature โดยตรง"]
      ]}},
      { note: "**การรั่วของอนาคตคือวิธีที่พบบ่อยที่สุดที่โมเดลพยากรณ์รายงานความแม่นยำที่เป็นไปไม่ได้** — ถ้าคะแนนดีเกินคาด ให้สงสัยข้อนี้ก่อนเสมอ" }
    ],

    architecture: [
      { p: "หมวดนี้คือการเลือกโครงและลำดับการตัดสินใจสำหรับงานลำดับ" },
      { h: "เลือกอะไรในปี 2026" },
      { table: { head: ["งาน", "ใช้", "เหตุผล"], rows: [
        ["ข้อความทุกชนิด", "**transformer**", "ชนะเกือบทุกด้าน และ pretrained มีให้เลือกมาก"],
        ["อนุกรมเวลาสั้น ข้อมูลน้อย", "**GRU หรือ LSTM**", "พารามิเตอร์น้อยกว่า overfit ยากกว่า"],
        ["อนุกรมเวลายาว หลายตัวแปร", "**transformer หรือ TCN**", "จับความสัมพันธ์ระยะไกลได้ดีกว่า"],
        ["ต้องทำงานแบบ streaming ทีละก้าว", "**RNN ตระกูลเดิม**", "มีสถานะที่พกไปได้ ไม่ต้องเก็บบริบททั้งหมด"],
        ["งานเล็กมาก ต้องรันบนอุปกรณ์เล็ก", "**GRU**", "เบาที่สุดในบรรดาที่ยังใช้ได้ดี"]
      ]}},
      { note: "**หน้านี้ยังจำเป็นแม้ transformer จะชนะ** — เพราะ attention ที่หน้าถัดไปใช้ทั้งหมดถูกคิดขึ้นที่นี่ และเพราะ RNN ยังชนะจริงในงาน streaming กับข้อมูลน้อย" },
      { h: "โครงของ seq2seq พร้อม attention" },
      { code: String.raw`  x₁ x₂ x₃ x₄            ← ลำดับต้นทาง
   ↓  ↓  ↓  ↓
  [encoder RNN]  →  h₁ h₂ h₃ h₄     ← เก็บไว้ทุกตัว ไม่ใช่แค่ตัวสุดท้าย
                       ↓
                  [attention]  ←──  สถานะปัจจุบันของ decoder (query)
                       ↓
                    context
                       ↓
  [decoder RNN] → y₁ y₂ y₃`,
        cap: "ความต่างเดียวจาก seq2seq เดิมคือการเก็บ h ทุกตัวไว้ แทนที่จะทิ้งทุกตัวยกเว้นตัวสุดท้าย", lang: "txt" },
      { h: "ค่าเริ่มต้นที่ใช้ได้ทันที" },
      { table: { head: ["ตัว", "ค่า", "หมายเหตุ"], rows: [
        ["ชนิด cell", "**LSTM** หรือ **GRU**", "ลองทั้งคู่ ไม่มีตัวไหนชนะเสมอ"],
        ["hidden size", "**256-512**", "ใหญ่กว่านี้ต้องมีข้อมูลมากตาม"],
        ["จำนวนชั้น", "**2**", "3 ชั้นขึ้นไปได้ผลเพิ่มน้อย"],
        ["dropout", "**0.2-0.3 ระหว่างชั้น**", "**อย่าใส่ในทิศทางเวลา** ถ้าไม่ใช้ variational dropout"],
        ["gradient clipping", "**1.0 หรือ 5.0**", "**จำเป็น ไม่ใช่ตัวเลือก**"],
        ["optimizer", "**Adam lr 1e-3**", "SGD ใช้ยากกว่ามากกับ RNN"],
        ["bidirectional", "**เปิดถ้าเห็นทั้งลำดับแล้ว**", "ห้ามเปิดในงานพยากรณ์"]
      ]}},
      { h: "ลำดับการทดลอง" },
      { code: String.raw`1. baseline ที่ไม่ใช้บริบทเลย        ← ทำนายค่าเมื่อวาน / คลาสที่พบบ่อยสุด
2. GRU ชั้นเดียว hidden 256
3. เพิ่มชั้น หรือเพิ่ม hidden ถ้ายัง underfit
4. ใส่ attention ถ้าเป็นงาน seq2seq
5. เปลี่ยนเป็น transformer ถ้าลำดับยาวและมีข้อมูลพอ`,
        cap: "ขั้นที่ 1 สำคัญมากในงานอนุกรมเวลา — โมเดลจำนวนมากแพ้ 'ทำนายว่าพรุ่งนี้เท่ากับวันนี้'", lang: "txt" },
      { h: "จัดการลำดับที่ยาวไม่เท่ากัน" },
      { code: String.raw`1. เรียงตามความยาวใน batch เดียวกัน   → pad น้อยลงมาก
2. pad ให้เท่ากับตัวที่ยาวที่สุดใน batch (ไม่ใช่ยาวที่สุดทั้งชุด)
3. ส่ง mask ไปให้ทั้ง loss และ attention
4. ตัดความยาวสูงสุดทิ้งถ้ามีหางยาวผิดปกติ`,
        cap: "ข้อ 1 กับ 2 ลดเวลาเทรนได้หลายเท่าในชุดข้อมูลที่ความยาวกระจายกว้าง", lang: "txt" }
    ],

    dataflow: [
      { p: "คำนวณ attention ด้วยมือจนครบ แล้วดูผลของ √d_k ด้วยตัวเลข" },
      { h: "ตั้งโจทย์" },
      { code: String.raw`d_k = 4 · มีสามตำแหน่งต้นทาง

query   q  = [1, 0, 1, 0]        decoder กำลังมองหาอะไรบางอย่าง

keys       k₁ = [1, 0, 1, 0]     ตำแหน่งที่ 1
           k₂ = [0, 1, 0, 1]     ตำแหน่งที่ 2
           k₃ = [1, 1, 0, 0]     ตำแหน่งที่ 3

values     v₁ = [10, 0]
           v₂ = [0, 10]
           v₃ = [5, 5]`,
        cap: "k₁ เหมือน q ทุกประการ · k₂ ตั้งฉากกับ q · k₃ เหมือนครึ่งเดียว — ครบทั้งสามกรณี", lang: "txt" },
      { h: "ขั้นที่ 1 — dot product" },
      { code: String.raw`q · k₁ = 1·1 + 0·0 + 1·1 + 0·0 = 2.0     ← ตรงกันเต็ม ๆ
q · k₂ = 1·0 + 0·1 + 1·0 + 0·1 = 0.0     ← ตั้งฉาก ไม่เกี่ยวกันเลย
q · k₃ = 1·1 + 0·1 + 1·0 + 0·0 = 1.0     ← ตรงกันครึ่งเดียว`,
        cap: "dot product คือการวัดความเข้ากันตรง ๆ — ยิ่งชี้ไปทางเดียวกันยิ่งมาก", lang: "txt" },
      { h: "ขั้นที่ 2 — หารด้วย √d_k" },
      { code: String.raw`√d_k = √4 = 2

scaled = [2.0/2, 0.0/2, 1.0/2] = [1.0, 0.0, 0.5]`,
        cap: "ที่ d_k เล็กแบบนี้ผลยังไม่ชัด แต่จะเห็นชัดมากในบล็อกถัดไปเมื่อ d_k ใหญ่ขึ้น", lang: "txt" },
      { h: "ขั้นที่ 3 — softmax" },
      { code: String.raw`exp([1.0, 0.0, 0.5]) = [2.7183, 1.0000, 1.6487]
ผลรวม = 5.3670

α = [2.7183/5.3670, 1.0000/5.3670, 1.6487/5.3670]
  = [0.5065, 0.1863, 0.3072]        ผลรวม = 1.0000  ✓`,
        cap: "ตำแหน่งที่ตรงกับ query มากที่สุดได้น้ำหนักครึ่งหนึ่ง แต่ตำแหน่งอื่นยังมีส่วนอยู่ ไม่ได้ถูกตัดทิ้ง", lang: "txt" },
      { h: "ขั้นที่ 4 — weighted average ของ value" },
      { code: String.raw`context = 0.5065·[10, 0] + 0.1863·[0, 10] + 0.3072·[5, 5]

มิติที่ 1:  0.5065(10) + 0.1863(0) + 0.3072(5) = 5.065 + 0 + 1.536 = 6.601
มิติที่ 2:  0.5065(0) + 0.1863(10) + 0.3072(5) = 0 + 1.863 + 1.536 = 3.399

context = [6.601, 3.399]`,
        cap: "**นี่คือ attention ทั้งหมด** — dot product, หาร, softmax, เฉลี่ยถ่วงน้ำหนัก ไม่มีอะไรมากกว่านี้", lang: "txt" },
      { h: "ถ้าไม่หารด้วย √d_k จะได้อะไร" },
      { code: String.raw`softmax([2.0, 0.0, 1.0]) = [0.6652, 0.0900, 0.2447]
softmax([1.0, 0.0, 0.5]) = [0.5065, 0.1863, 0.3072]      ← เวอร์ชันที่หารแล้ว

ที่ d_k = 4 ต่างกันไม่มาก แต่ทิศทางชัด: ไม่หาร = แหลมกว่า`,
        cap: "ผลจะรุนแรงขึ้นตาม d_k เพราะ dot product โตตาม √d_k", lang: "txt" },
      { h: "ผลของ d_k ที่ใหญ่ขึ้น" },
      { code: String.raw`score ทิศทางเดียวกัน แต่ขนาดโตตาม √d_k

d_k = 4     raw [3.0,  1.0, 0.0]  → softmax [0.8438, 0.1142, 0.0420]
d_k = 64    raw [12.0, 4.0, 0.0]  → softmax [0.9997, 0.0003, 0.0000]   ← เกือบ one-hot

หารด้วย √d_k แล้ว ทั้งสองกรณีได้ [1.5, 0.5, 0.0]
                          → softmax [0.6285, 0.2312, 0.1402]  เหมือนกัน`,
        cap: "แถวที่สองคือปัญหา — softmax ที่เกือบ one-hot มี gradient เกือบเป็นศูนย์ จึงเทรนไม่ขึ้น", lang: "txt" },
      { note: "**และนี่คือคำตอบทั้งหมดของ 'ทำไมต้องมี √d_k'** — ไม่ใช่การปรับสเกลตามอำเภอใจ แต่คือการรักษาความแปรปรวนของ score ให้เป็น 1 เพื่อให้ softmax อยู่ในช่วงที่ยังมี gradient" },
      { h: "attention เปลี่ยนไปทุกก้าวของ decoder" },
      { code: String.raw`แปล "the cat sat" เป็นภาษาไทย

ก้าวที่ 1 (สร้าง "แมว"):  α = [0.15, 0.70, 0.15]   ← มองที่ "cat"
ก้าวที่ 2 (สร้าง "นั่ง"):  α = [0.10, 0.20, 0.70]   ← ย้ายไปมองที่ "sat"

query เปลี่ยนทุกก้าว → α เปลี่ยนตาม → context เปลี่ยนตาม`,
        cap: "จึงไม่ใช่การบีบทั้งประโยคเป็นเวกเตอร์เดียวอีกต่อไป — แต่ละก้าวเลือกดูเฉพาะสิ่งที่ต้องการ", lang: "txt" },
      { h: "เทียบราคากับ RNN" },
      { code: String.raw`ลำดับยาว n = 100 · มิติ d = 512

RNN:        O(n · d²) = 100 × 262,144 = 26.2 ล้าน   แต่ทำได้ทีละก้าวเท่านั้น
attention:  O(n² · d) = 10,000 × 512  = 5.1 ล้าน    และทำพร้อมกันทั้งหมดได้`,
        cap: "attention ถูกกว่าและขนานได้ — สองข้อนี้รวมกันคือเหตุผลที่หน้าถัดไปทิ้ง recurrence ไปเลย", lang: "txt" }
    ],

    implementation: [
      { p: "โค้ดของทุกอย่างในหน้านี้ พร้อมจุดที่พลาดบ่อย" },
      { h: "1) RNN จากศูนย์ด้วย NumPy" },
      { code: String.raw`import numpy as np

def rnn_forward(X, Wxh, Whh, b, h0):
    """X: (T, d_in) -> H: (T, d_hidden)"""
    h, out = h0, []
    for t in range(X.shape[0]):
        h = np.tanh(X[t] @ Wxh + h @ Whh + b)
        out.append(h)
    return np.stack(out), h

# ลูปนี้เองคือเหตุผลที่ขนานตามเวลาไม่ได้:
# h ของก้าว t ต้องรอ h ของก้าว t−1`,
        cap: "หกบรรทัดนี้คือ RNN ทั้งหมด และคอมเมนต์ท้ายคือข้อจำกัดที่แก้ไม่ได้ของมัน", lang: "python" },
      { h: "2) LSTM cell จากศูนย์" },
      { code: String.raw`def sigmoid(z): return 1 / (1 + np.exp(-z))

def lstm_step(x, h, c, W, b):
    z = np.concatenate([x, h]) @ W + b       # คำนวณสี่ประตูพร้อมกันครั้งเดียว
    n = h.shape[0]
    f = sigmoid(z[0:n])
    i = sigmoid(z[n:2*n])
    g = np.tanh(z[2*n:3*n])
    o = sigmoid(z[3*n:4*n])

    c = f * c + i * g                        # ← เส้นทางแบบบวก คือหัวใจทั้งหมด
    h = o * np.tanh(c)
    return h, c`,
        cap: "คูณเมทริกซ์ครั้งเดียวแล้วแบ่งเป็นสี่ส่วน เร็วกว่าคูณสี่ครั้งอย่างมาก และเป็นวิธีที่ทุกไลบรารีใช้", lang: "python" },
      { h: "3) ตั้ง bias ของ forget gate เป็น 1" },
      { code: String.raw`for name, p in model.named_parameters():
    if "bias" in name:
        n = p.shape[0] // 4
        p.data[n:2*n].fill_(1.0)      # PyTorch เรียง i, f, g, o
                                       # ช่อง f จึงอยู่ที่ [n:2n]`,
        cap: "**ต้องเช็คลำดับประตูของไลบรารีที่ใช้เสมอ** — PyTorch เรียง i,f,g,o ส่วนไลบรารีอื่นอาจต่างออกไป", lang: "python" },
      { h: "4) scaled dot-product attention" },
      { code: String.raw`import torch, math

def attention(q, k, v, mask=None):
    """q (B, Tq, d) · k, v (B, Tk, d)"""
    d_k = q.size(-1)
    scores = q @ k.transpose(-2, -1) / math.sqrt(d_k)      # (B, Tq, Tk)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float("-inf"))
    attn = scores.softmax(dim=-1)
    return attn @ v, attn`,
        cap: "`-inf` **ก่อน softmax ไม่ใช่ 0** — ใส่ 0 แล้ว `exp(0)=1` ตำแหน่ง pad จะยังได้น้ำหนักอยู่", lang: "python" },
      { h: "5) ตรวจว่า attention ทำงานถูก" },
      { code: String.raw`q = torch.tensor([[[1., 0., 1., 0.]]])
k = torch.tensor([[[1., 0., 1., 0.], [0., 1., 0., 1.], [1., 1., 0., 0.]]])
v = torch.tensor([[[10., 0.], [0., 10.], [5., 5.]]])

ctx, attn = attention(q, k, v)
print(attn)   # tensor([[[0.5065, 0.1863, 0.3072]]])
print(ctx)    # tensor([[[6.6008, 3.3992]]])
assert torch.allclose(attn.sum(-1), torch.ones(1))`,
        cap: "ตรงกับที่คำนวณมือในหมวดก่อนหน้า (6.601 กับ 3.399 คือค่าเดียวกันปัดสามตำแหน่ง) — ตรวจแบบนี้ก่อนเชื่อโค้ดของตัวเองเสมอ", lang: "python" },
      { h: "6) LSTM ด้วย PyTorch พร้อม packing" },
      { code: String.raw`import torch.nn as nn
from torch.nn.utils.rnn import pack_padded_sequence, pad_packed_sequence

lstm = nn.LSTM(128, 256, num_layers=2, batch_first=True,
               dropout=0.3, bidirectional=False)

packed = pack_padded_sequence(x, lengths.cpu(),
                              batch_first=True, enforce_sorted=False)
out, (h, c) = lstm(packed)
out, _ = pad_packed_sequence(out, batch_first=True)`,
        cap: "packing ทำให้ RNN ข้ามตำแหน่ง pad ไปเลย ทั้งเร็วขึ้นและได้ hidden state สุดท้ายที่ถูกต้อง", lang: "python" },
      { h: "7) mask ใน loss" },
      { code: String.raw`loss_fn = nn.CrossEntropyLoss(ignore_index=PAD_ID)

loss = loss_fn(logits.reshape(-1, vocab), targets.reshape(-1))

# หรือทำเองถ้าต้องการควบคุม:
mask = (targets != PAD_ID).float()
loss = (per_token_loss * mask).sum() / mask.sum()   # หารด้วยจำนวน token จริง`,
        cap: "**หารด้วย** `mask.sum()` **ไม่ใช่จำนวนทั้งหมด** ไม่งั้น loss ของ batch ที่ pad เยอะจะดูต่ำผิดจริง", lang: "python" },
      { h: "8) gradient clipping ที่ขาดไม่ได้" },
      { code: String.raw`loss.backward()
norm = torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
if norm > 10:
    print(f"gradient norm สูงผิดปกติ: {norm:.1f}")
opt.step()`,
        cap: "พิมพ์ norm ออกมาช่วงแรกด้วย ถ้าเห็นค่าหลักร้อยขึ้นไปบ่อย แปลว่าโมเดลหรือ learning rate มีปัญหา", lang: "python" },
      { h: "9) เทรนด้วย teacher forcing" },
      { code: String.raw`# ตอนเทรน: ป้อน token จริงของก้าวก่อนหน้า
decoder_input = target[:, :-1]        # ทุกตัวยกเว้นตัวสุดท้าย
decoder_target = target[:, 1:]        # เลื่อนไปหนึ่งตำแหน่ง

logits = model(source, decoder_input)
loss = loss_fn(logits.reshape(-1, vocab), decoder_target.reshape(-1))`,
        cap: "การเลื่อนไปหนึ่งตำแหน่งคือทั้งหมดของ teacher forcing — และเป็นที่มาของ exposure bias", lang: "python" },
      { h: "10) beam search" },
      { code: String.raw`def beam_search(model, src, k=5, max_len=50):
    beams = [([BOS], 0.0)]                      # (ลำดับ, log probability สะสม)
    for _ in range(max_len):
        cand = []
        for seq, score in beams:
            if seq[-1] == EOS:
                cand.append((seq, score))       # จบแล้ว เก็บไว้เฉย ๆ
                continue
            logp = model(src, seq).log_softmax(-1)[-1]
            top = logp.topk(k)
            for lp, tok in zip(top.values, top.indices):
                cand.append((seq + [tok.item()], score + lp.item()))
        beams = sorted(cand, key=lambda b: b[1] / len(b[0]), reverse=True)[:k]
        if all(s[-1] == EOS for s, _ in beams):
            break
    return beams[0][0]`,
        cap: "**หารด้วยความยาว** ตอนจัดอันดับ ไม่งั้น log probability ที่ติดลบสะสมจะเข้าข้างประโยคสั้นเสมอ", lang: "python" }
    ],

    tricks: [
      { h: "ไล่ปัญหาตามอาการ" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้ยังไง"], rows: [
        ["loss กลายเป็น NaN ตั้งแต่ epoch แรก", "gradient ระเบิดจาก λᵀ", "**gradient clipping** · ลด lr · ตรวจ initialisation"],
        ["โมเดลจำได้แค่ไม่กี่ก้าวหลังสุด", "λ < 1 ทำให้บริบทไกลหายไป", "ใช้ LSTM หรือ GRU · ใส่ attention"],
        ["คะแนนดีมากในงานพยากรณ์", "**การรั่วของอนาคต**", "เช็ค bidirectional · เช็คหน้าต่างของ feature · แบ่งตามเวลา"],
        ["สร้างข้อความได้ดีตอนเทรน แต่เพี้ยนตอนใช้จริง", "**exposure bias**", "scheduled sampling · beam search · เทรนบนลำดับที่ยาวขึ้น"],
        ["ผลแย่ลงเมื่อ batch มีความยาวต่างกันมาก", "ไม่ได้ mask หรือไม่ได้ pack", "`pack_padded_sequence` · `ignore_index`"],
        ["loss ดูต่ำผิดปกติ", "หาร loss ด้วยจำนวน token ทั้งหมดรวม pad", "หารด้วย `mask.sum()`"],
        ["beam search แล้วผลแย่ลงกว่า greedy", "k ใหญ่เกิน หรือไม่ได้ปรับตามความยาว", "ลด k เหลือ 4-10 · หาร score ด้วยความยาว"],
        ["attention ให้น้ำหนักตำแหน่ง pad", "mask ใส่ 0 แทน `-inf`", "`masked_fill(mask == 0, -inf)` ก่อน softmax"],
        ["เทรนช้ามาก", "ลำดับยาวและขนานตามเวลาไม่ได้", "เรียงตามความยาว · ตัดความยาวสูงสุด · เปลี่ยนไป transformer"]
      ]}},
      { h: "LSTM หรือ GRU" },
      { table: { head: ["", "LSTM", "GRU"], rows: [
        ["พารามิเตอร์", "4 ชุด", "**3 ชุด (75% ของ LSTM)**"],
        ["cell state แยก", "**มี**", "ไม่มี"],
        ["ข้อมูลน้อย", "overfit ง่ายกว่า", "**มักดีกว่า**"],
        ["ลำดับยาวมาก", "**มักดีกว่าเล็กน้อย**", "สูสี"],
        ["สรุป", "ลองทั้งคู่", "ลองทั้งคู่"]
      ]}},
      { h: "ข้อผิดพลาดที่พบบ่อยที่สุด" },
      { ul: [
        "**ไม่ทำ gradient clipping** ทั้งที่ใน RNN มันจำเป็น ไม่ใช่ตัวเลือก",
        "**ใช้ bidirectional ในงานพยากรณ์** ซึ่งเป็นการอ่านอนาคตโดยตรง",
        "**แบ่ง train/test แบบสุ่มในอนุกรมเวลา** ทำให้คะแนนดีเกินจริงทั้งหมด",
        "**ลืม mask ตำแหน่ง pad** ทั้งใน loss และใน attention",
        "**ใส่ 0 แทน** `-inf` ตอน mask attention ทำให้ pad ยังได้น้ำหนัก",
        "**ไม่ปรับ score ตามความยาวใน beam search** ทำให้ได้แต่ประโยคสั้น",
        "**ไม่ทำ baseline ที่ไม่ใช้บริบท** ในงานอนุกรมเวลา แล้วไม่รู้ว่าโมเดลชนะอะไรหรือเปล่า"
      ]},
      { h: "ตัวเลขที่ควรจำได้" },
      { table: { head: ["เรื่อง", "ค่า"], rows: [
        ["พารามิเตอร์ RNN", "`h·(h + x) + h`"],
        ["LSTM เทียบ RNN", "4 เท่า · GRU 3 เท่า"],
        ["ราคาของ attention", "`O(n²·d)` เทียบกับ RNN `O(n·d²)`"],
        ["ตัวปรับสเกลของ attention", "`1/√d_k`"],
        ["k ของ beam search", "4-10 · เกินนั้นมักแย่ลง"],
        ["bias เริ่มต้นของ forget gate", "1.0"]
      ]}},
      { note: "**ถ้าจำได้แค่ประโยคเดียวจากหน้านี้**: LSTM ชนะ RNN เพราะ cell state ถูก **บวก** ไม่ใช่คูณด้วยเมทริกซ์ซ้ำ ๆ และ attention ชนะ seq2seq เพราะมัน **ไม่บีบ** ทั้งลำดับเป็นเวกเตอร์เดียว — ทั้งสองครั้งคือการลบตัวคูณที่เป็นปัญหาออกไป" }
    ],

    eval: [
      { p: "คำถามที่แยกคนที่เข้าใจกลไก ออกจากคนที่เรียก `nn.LSTM` เป็น" },
      { qa: [
        { q: "ทำไมลำดับต้องใช้โครงสร้างต่างจาก input แบบอื่น",
          a: "เพราะลำดับมีความหมาย — \"หมากัดคน\" กับ \"คนกัดหมา\" มี token เดียวกันทุกตัว — และความยาวไม่เท่ากัน ซึ่ง dense layer รับไม่ได้เพราะต้องรู้จำนวน input ล่วงหน้า" },
        { q: "RNN ใช้ weight sharing แบบไหน",
          a: "ใช้ W ชุดเดียวกันทุกก้าวเวลา ซึ่งเป็นอนาล็อกทางเวลาของการที่ CNN ใช้ kernel เดียวทุกตำแหน่ง — ทำให้รับความยาวเท่าไรก็ได้ และพารามิเตอร์ไม่โตตามความยาว" },
        { q: "ทำไม gradient ของ RNN ถึงพังแรงกว่าเครือข่ายลึกธรรมดา",
          a: "เพราะเป็น **เมทริกซ์ตัวเดียวกัน** ยกกำลัง T ไม่ใช่ T เมทริกซ์ที่ต่างกัน จึงประพฤติเหมือน `λᵀ` — ที่ λ=0.9 และ T=100 เหลือ 2.7e−5 ส่วนที่ λ=1.1 กลายเป็น 13,800" },
        { q: "ประโยค 50 คำเทียบเท่าเครือข่ายกี่ชั้น",
          a: "50 ชั้น แต่เป็น 50 ชั้นที่ผูกน้ำหนักไว้ด้วยกันทั้งหมด ซึ่งเป็นสาเหตุที่ปัญหารุนแรงกว่าเครือข่าย 50 ชั้นปกติ" },
        { q: "LSTM แก้ปัญหานั้นด้วยกลไกอะไร",
          a: "ด้วยบรรทัด `C_t = f_t ⊙ C_{t−1} + i_t ⊙ g_t` ซึ่งเป็นการ **บวก** ไม่ใช่การคูณด้วยเมทริกซ์ เมื่อ `f_t ≈ 1` เส้นทาง gradient ตาม C จึงประมาณเป็น identity — กลไกเดียวกับ `+1` ของ ResNet แต่คิดขึ้นก่อนสองทศวรรษ" },
        { q: "`∂C_t/∂C_{t−1}` เท่ากับอะไร และมันบอกอะไร",
          a: "เท่ากับ `f_t` พอดี — ถ้าใกล้ 1 ทุกก้าว gradient ผ่านได้ครบ ถ้าเป็น 0.5 ก็เป็น `0.5ᵀ` คือลืมเร็วโดยตั้งใจ ความสำคัญคือ **โมเดลเลือกเองได้ว่าจะจำนานแค่ไหน** ต่างจาก RNN ที่ถูก λ บังคับ" },
        { q: "ประตูทั้งสี่ของ LSTM ทำอะไร",
          a: "forget คุมว่าเก็บ cell state เดิมไว้เท่าไร, input คุมว่ารับของใหม่เข้ามาเท่าไร, candidate คือเนื้อหาที่จะรับ, output คุมว่าเปิดเผย cell ออกไปเท่าไร — แต่หัวใจไม่ได้อยู่ที่ประตู อยู่ที่การบวกใน cell state" },
        { q: "ทำไมควรตั้ง bias ของ forget gate เป็น 1",
          a: "เพราะถ้า f เริ่มใกล้ 0 มันจะลืมทุกอย่างทันทีและ cell state ไม่เคยสะสมอะไรเลย ตั้งเป็น 1.0 ให้ `σ(1)=0.73` คือเริ่มจากการจำไว้ก่อน แล้วค่อยเรียนรู้ว่าจะลืมอะไร" },
        { q: "GRU ต่างจาก LSTM ยังไง",
          a: "รวม forget กับ input เป็น update gate ตัวเดียวและตัด cell state แยกทิ้ง เหลือ 3 ชุดน้ำหนักแทน 4 คือ 75% ของ LSTM โดยคุณภาพมักใกล้เคียง — ควรลองทั้งคู่" },
        { q: "ข้อจำกัดของ RNN ที่แก้ไม่ได้แม้จะใช้ LSTM คืออะไร",
          a: "การคำนวณขนานตามเวลาไม่ได้ เพราะต้องได้ `h_{t−1}` ก่อนถึงจะคำนวณ `h_t` — และนี่คือเหตุผลจริงที่ transformer ชนะ ไม่ใช่แค่เรื่องคุณภาพ" },
        { q: "bidirectional ใช้ได้เมื่อไร และห้ามใช้เมื่อไร",
          a: "ใช้ได้เมื่อเห็นทั้งลำดับแล้ว เช่นการจำแนกข้อความ แต่**ห้ามใช้ในงานพยากรณ์** เพราะเป็นการอ่านค่าที่ยังไม่เกิด ซึ่งทำให้คะแนน validation ดีเกินจริงและใช้งานจริงไม่ได้" },
        { q: "คอขวดของ seq2seq คืออะไร",
          a: "การบีบทั้งประโยคต้นทางเหลือเวกเตอร์เดียว ประโยค 5 คำกับ 50 คำได้มิติเท่ากัน ทำให้คุณภาพตกลงตามความยาวอย่างที่วัดได้ชัดเจน" },
        { q: "attention แก้คอขวดนั้นยังไง",
          a: "decoder มองเห็นทุก hidden state ของ encoder แล้วเฉลี่ยแบบถ่วงน้ำหนักที่เรียนรู้เอง โดยน้ำหนักเปลี่ยนทุกก้าวที่สร้าง จึงเลือกดูเฉพาะคำที่ต้องการในแต่ละก้าวแทนการบีบทั้งประโยคไว้ล่วงหน้า" },
        { q: "query, key, value คืออะไร มาจากไหน",
          a: "query คือสิ่งที่ตำแหน่งปัจจุบันกำลังมองหา มาจากสถานะของ decoder, key คือสิ่งที่แต่ละตำแหน่งเสนอตัวว่าเป็น และ value คือเนื้อหาที่แต่ละตำแหน่งให้จริง ทั้งสองมาจาก hidden state ของ encoder คนละการฉาย" },
        { q: "เขียนสมการ attention ได้ไหม",
          a: "`score_i = q·k_i/√d_k` แล้ว `α = softmax(score)` แล้ว `context = Σ αᵢvᵢ` — สามบรรทัดนี้คือทั้งหมด" },
        { q: "ทำไมต้องหารด้วย √d_k",
          a: "เพราะ dot product ของเวกเตอร์ที่มีความแปรปรวน 1 และ d_k มิติ จะมีความแปรปรวน d_k คือโตตาม √d_k — ที่ d_k=64 score `[12,4,0]` ให้ softmax `[0.9997, 0.0003, 0]` ซึ่งเกือบ one-hot และมี gradient เกือบเป็นศูนย์ การหารรักษาความแปรปรวนไว้ที่ 1" },
        { q: "ทำไม mask ของ attention ต้องใส่ `-inf` ไม่ใช่ 0",
          a: "เพราะ mask ถูกใส่ก่อน softmax และ `exp(0) = 1` ตำแหน่ง pad จึงยังได้น้ำหนักอยู่ ต้องใช้ `-inf` เพื่อให้ `exp(-inf) = 0` จริง ๆ" },
        { q: "teacher forcing คืออะไร และสร้างปัญหาอะไร",
          a: "ตอนเทรนป้อน token จริงของก้าวก่อนหน้าเข้าไป ซึ่งเร็วและเสถียร แต่ตอนใช้จริงโมเดลต้องกิน output ของตัวเองที่ไม่เคยเห็นตอนเทรน ความไม่ตรงกันนี้คือ exposure bias และทำให้ข้อความที่สร้างค่อย ๆ หลุด" },
        { q: "beam search ต่างจาก greedy ยังไง และ k เท่าไรถึงพอ",
          a: "greedy เลือก argmax ทุกก้าวและแก้ก้าวแรกที่ผิดไม่ได้ ส่วน beam search เก็บ k สมมติฐานไว้พร้อมกัน โดย k = 4-10 เพียงพอ และเกินนั้นมักแย่ลงเพราะ likelihood เข้าข้างประโยคสั้นและจืด" },
        { q: "ทำไม beam search ต้องหาร score ด้วยความยาว",
          a: "เพราะ log probability ติดลบและสะสมทุกก้าว ลำดับที่ยาวกว่าจึงได้คะแนนต่ำกว่าเสมอโดยอัตโนมัติ ถ้าไม่ปรับตามความยาวจะได้แต่ประโยคสั้นผิดปกติ" },
        { q: "ราคาของ attention เทียบ RNN เป็นยังไง",
          a: "attention เป็น `O(n²·d)` ส่วน RNN เป็น `O(n·d²)` — ที่ n=100 d=512 attention ถูกกว่าและยังขนานได้ทั้งหมด ขณะที่ RNN ทำได้ทีละก้าว แต่ที่ n ใหญ่มาก n² จะกลายเป็นปัญหา" },
        { q: "อนุกรมเวลาต้องระวังอะไรเป็นพิเศษ",
          a: "ห้ามแบ่งข้อมูลแบบสุ่ม ต้องแบ่งตามเวลา ห้ามใช้ bidirectional และ feature ใด ๆ ที่คำนวณจากหน้าต่างที่คร่อมอนาคตคือ leakage — ถ้าคะแนนดีเกินคาด ให้สงสัยข้อนี้ก่อนเสมอ" }
      ]},
      { h: "อ่านเพิ่ม" },
      { links: [
        { label: "Understanding LSTM Networks (Colah)", url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/", note: "คำอธิบาย LSTM ที่ชัดที่สุดเท่าที่มี พร้อมภาพของทุกประตูและ cell state" },
        { label: "The Unreasonable Effectiveness of Recurrent Neural Networks", url: "https://karpathy.github.io/2015/05/21/rnn-effectiveness/", note: "ทำไม RNN ถึงทรงพลัง พร้อมตัวอย่างที่สร้างออกมาจริง" },
        { label: "Neural Machine Translation by Jointly Learning to Align and Translate", url: "https://arxiv.org/abs/1409.0473", note: "เปเปอร์ต้นฉบับของ attention รวมภาพที่แสดงการจับคู่คำระหว่างสองภาษา" },
        { label: "Long Short-Term Memory (Hochreiter & Schmidhuber, 1997)", url: "https://deeplearning.cs.cmu.edu/F23/document/readings/LSTM.pdf", note: "เปเปอร์ต้นฉบับ พร้อมการวิเคราะห์ปัญหา gradient ที่มันแก้" },
        { label: "On the difficulty of training Recurrent Neural Networks", url: "https://arxiv.org/abs/1211.5063", note: "ที่มาเชิงคณิตศาสตร์ของ λᵀ และเหตุผลที่ gradient clipping จำเป็น" },
        { label: "Attention? Attention! (Lilian Weng)", url: "https://lilianweng.github.io/posts/2018-06-24-attention/", note: "ไล่ attention ทุกรูปแบบต่อกันเป็นลำดับ จนถึง transformer" },
        { label: "PyTorch — NLP From Scratch: seq2seq with attention", url: "https://pytorch.org/tutorials/intermediate/seq2seq_translation_tutorial.html", note: "ประกอบ encoder-decoder พร้อม attention จากศูนย์ทีละบรรทัด" },
        { label: "Empirical Evaluation of Gated Recurrent Neural Networks", url: "https://arxiv.org/abs/1412.3555", note: "เปรียบเทียบ LSTM กับ GRU อย่างเป็นระบบ — สรุปว่าไม่มีตัวไหนชนะเสมอ" }
      ]}
    ]
  }
});

window.TEACHING_EN = window.TEACHING_EN || {};
window.TEACHING_EN["ml_seq"] = {
  principle: [
    { h: "What makes a sequence different from other inputs" },
    { table: { head: ["Property", "Why the earlier structures fail"], rows: [
      ["**Order carries meaning**", "\"dog bites man\" and \"man bites dog\" contain exactly the same tokens"],
      ["**Length varies**", "A dense layer must know its input count in advance, but sentences differ in length"],
      ["**Long-range dependence**", "A subject and its verb can sit twenty words apart"]
    ]}},
    { h: "An RNN solves the first two with one mechanism" },
    { code: String.raw`h_t = tanh(W_hh · h_{t−1} + W_xh · x_t + b)

**the same W is applied at every timestep** — the analogue of a CNN's shared kernel
-> any length is accepted, and the parameter count does not grow with length`,
      cap: "This is weight sharing in the time dimension, exactly the same idea as the previous page", lang: "txt" },
    { h: "And what it pays for that" },
    { code: String.raw`the gradient back through T steps contains  Π (W_hhᵀ · tanh'(z_t))

**the same matrix multiplied by itself T times**, not T different matrices
-> it behaves like λᵀ, where λ is the dominant eigenvalue

λ = 0.90  ->  T=10: 0.349   T=50: 0.00515   T=100: 0.0000266
λ = 1.10  ->  T=10: 2.59    T=50: 117       T=100: 13,800`,
      cap: "A 50-word sentence is therefore a 50-layer network in which every layer shares one weight matrix", lang: "txt" },
    { note: "**\"RNNs forget long context\" describes the symptom; λᵀ is the reason** — and this is what differs from the vanishing gradients of page 5, where each layer had its own matrix. Repeating one matrix makes it far more violent." },
    { h: "The plan of this page" },
    { code: String.raw`RNN            workable, but breaks on long sequences
  |
LSTM / GRU     add an additive path, which fixes λᵀ
  |
seq2seq        chain two of them, which creates a new bottleneck
  |
attention      removes that bottleneck
  |
transformer    drops recurrence entirely, keeping only attention  (next page)`,
      cap: "Each step answers the problem the previous one created — this is not a list of architectures", lang: "txt" },
    { h: "What this page will let you do" },
    { ul: [
      "Explain with λᵀ why RNN gradients fail harder than an ordinary deep network's",
      "Explain LSTM through the additive cell-state path rather than the names of three gates",
      "Compute attention entirely by hand, from the dot products to the weighted average",
      "Know why the scores are divided by √d_k, and demonstrate it with numbers",
      "Know where exposure bias comes from, and why a model looks excellent in training but drifts when generating"
    ]}
  ],

  theory: [
    { p: "This section walks from the RNN to attention, each step fixing the previous one's problem." },
    { h: "1) The RNN unrolled" },
    { code: String.raw`x₁ -> [W] -> h₁ -> [W] -> h₂ -> [W] -> h₃ -> ...
               ^            ^            ^
               x₂           x₃           x₄

the same W in every box — unrolled, it is a deep network with tied weights`,
      cap: "Unrolling makes it obvious that backpropagation through time is not a new algorithm, just backprop on a longer graph", lang: "txt" },
    { h: "2) An RNN's parameter count" },
    { code: String.raw`parameters = h·(h + x) + h        h = hidden size · x = input size

h = 256 · x = 128  ->  256 × 384 + 256 = 98,560

**completely independent of sequence length** — the same weights handle 5 words or 500`,
      cap: "The same property a CNN has with respect to image size, and for the same reason: weight sharing", lang: "txt" },
    { h: "3) The RNN's unfixable limitations" },
    { table: { head: ["Limitation", "Consequence"], rows: [
      ["**λᵀ**", "Context beyond roughly 20-50 steps is forgotten"],
      ["**Cannot be parallelised over time**", "`h_t` needs `h_{t−1}` first — the GPU is never fully used"],
      ["**Gradients explode easily**", "Gradient clipping is required, not optional"]
    ]}},
    { p: "**The second one is the real reason transformers won**, not merely quality — an RNN forces step-by-step processing, while attention computes every position at once in a single matrix multiply." },
    { h: "4) LSTM — the additive path" },
    { code: String.raw`f_t = σ(W_f [h_{t−1}, x_t])     forget: how much of the old cell state to keep
i_t = σ(W_i [h_{t−1}, x_t])     input:  how much new information to admit
g_t = tanh(W_g [h_{t−1}, x_t])  the candidate content
o_t = σ(W_o [h_{t−1}, x_t])     output: how much of the cell to expose

C_t = f_t ⊙ C_{t−1} + i_t ⊙ g_t     <- **added to, not multiplied by a matrix**
h_t = o_t ⊙ tanh(C_t)`,
      cap: "The C_t line is the whole mechanism — the cell state is added to, never repeatedly multiplied by W", lang: "txt" },
    { note: "**When** `f_t ≈ 1` **the gradient path along C is approximately the identity**, which is the same mechanism as ResNet's `+1` from the previous page, arrived at two decades earlier. **Anyone teaching LSTM as \"three gates controlling information flow\" without the additive path has taught the vocabulary and not the mechanism.**" },
    { h: "5) Why the forget gate should start with a positive bias" },
    { code: String.raw`f_t starting near 0  ->  it forgets everything immediately  ->  the cell state never accumulates

initialise the forget gate's bias to 1.0
-> σ(1.0) = 0.73  ->  it starts by remembering, and learns what to forget`,
      cap: "A small trick that measurably speeds up early LSTM training, and one many libraries now do by default", lang: "txt" },
    { h: "6) GRU — the cheaper variant" },
    { code: String.raw`merges forget and input into a single update gate
and drops the separate cell state, keeping only h

parameters at h=256, x=128:
   RNN    98,560
   GRU   295,680      = 3 sets
   LSTM  394,240      = 4 sets

GRU costs 75% of LSTM`,
      cap: "Quality is usually very close — try both, neither one always wins", lang: "txt" },
    { h: "7) Bidirectional and stacked" },
    { table: { head: ["Variant", "What it does", "Use when"], rows: [
      ["**Bidirectional**", "Reads left-to-right and right-to-left, then concatenates", "**The whole sequence is already available**, as in text classification · **never for forecasting**"],
      ["**Stacked**", "Several RNN layers on top of each other", "2-3 layers is usually enough; beyond that gains are small"]
    ]}},
    { note: "**A bidirectional model on time series is future leakage** — it reads values that have not happened yet at serving time, which inflates the validation score and makes the model unusable in production." },
    { h: "8) seq2seq and its bottleneck" },
    { code: String.raw`the encoder reads the sentence -> squeezes it into one vector -> the decoder generates

a 5-word sentence   -> a 512-dimensional vector
a 50-word sentence  -> the same 512 dimensions

-> the longer the sentence, the worse the quality, measurably so`,
      cap: "That degradation with length is the bottleneck made visible in numbers, not a theoretical worry", lang: "txt" },
    { h: "9) Attention — the direct answer to that bottleneck" },
    { code: String.raw`instead of one final vector,
the decoder sees **every** encoder hidden state and takes a learned weighted average

score_i = q · k_i / √d_k
α       = softmax(score)
context = Σ αᵢ vᵢ`,
      cap: "The weights α change at every decoding step, so it looks at different source words as it goes", lang: "txt" },
    { h: "10) What query, key and value are" },
    { table: { head: ["Term", "Meaning", "Comes from"], rows: [
      ["**Query**", "What the current position is looking for", "The decoder's state at that step"],
      ["**Key**", "What each position advertises itself as", "The encoder's hidden states"],
      ["**Value**", "What each position actually contributes", "The encoder's hidden states, under a different projection"]
    ]}},
    { p: "**The closest analogy is a dictionary lookup** — the query is the word being looked up, the keys are the index entries, and the values are the definitions returned. The difference is that nothing is selected outright; everything is averaged in proportion to how well it matches." },
    { h: "11) Why divide by √d_k" },
    { code: String.raw`if the entries of q and k have variance 1 and there are d_k dimensions,
the dot product has variance d_k -> it grows like √d_k

the same scores, in the same direction:
   d_k = 4   raw [3.0, 1.0, 0.0]    -> softmax [0.844, 0.114, 0.042]
   d_k = 64  raw [12.0, 4.0, 0.0]   -> softmax [0.9997, 0.0003, 0.000]

after dividing by √d_k, both cases give [0.629, 0.231, 0.140]`,
      cap: "Without the division the softmax is nearly one-hot, and its gradient is nearly zero, so nothing trains", lang: "txt" },
    { h: "12) Teacher forcing and exposure bias" },
    { code: String.raw`in training:   feed the true previous token -> fast and stable
at inference:  feed the token the model itself produced -> which it never saw in training

one wrong word -> the next step's input is wrong -> the further it goes, the worse it drifts`,
      cap: "This is exposure bias, and it is why a model looks excellent in training while its generated text slowly comes apart", lang: "txt" },
    { h: "13) Greedy against beam search" },
    { table: { head: ["", "Greedy", "Beam search"], rows: [
      ["What it does", "Takes the argmax at every step", "Keeps k hypotheses alive at once"],
      ["Problem", "**A wrong first choice can never be undone**", "k times slower"],
      ["Typical value", "—", "k = 4-10"],
      ["Very large k", "—", "**Usually worse**, because likelihood favours short and bland output"]
    ]}}
  ],

  foundations: [
    { p: "This section digs into the mechanics that decide how well a sequence model works." },
    { h: "λᵀ in full" },
    { code: String.raw`             T = 10      T = 50        T = 100
λ = 0.90     0.349      0.00515       0.0000266
λ = 0.99     0.904      0.605         0.366
λ = 1.10     2.59       117           13,800`,
      cap: "The middle row is why RNN initialisation and normalisation must be far more careful than usual", lang: "txt" },
    { p: "**And this differs meaningfully from an ordinary deep network** — there each layer has its own matrix, so the factors partly average out, whereas an RNN raises one matrix to the power T with nothing to average against." },
    { h: "Gradient clipping in an RNN is not optional" },
    { code: String.raw`λ > 1 makes the gradient explode exponentially
clipping at a norm of 1.0 or 5.0 is always required

if ‖g‖ > c :  g <- g · c / ‖g‖`,
      cap: "Unlike an ordinary deep network, where clipping is a helper, here it is a necessity", lang: "txt" },
    { h: "One LSTM step with real numbers" },
    { code: String.raw`C_prev = 0.8   h_prev = 0.1   x = 1.0

f = σ(0.5·1.0 + 0.4·0.1 + 0.5) = σ(1.04)  = 0.7389
i = σ(0.6·1.0 + 0.3·0.1 − 0.2) = σ(0.43)  = 0.6059
g = tanh(0.7·1.0 + 0.2·0.1)    = tanh(0.72) = 0.6169
o = σ(0.3·1.0 + 0.5·0.1 + 0.1) = σ(0.45)  = 0.6106

C = f·C_prev + i·g = 0.7389(0.8) + 0.6059(0.6169) = 0.5911 + 0.3738 = 0.9648
h = o·tanh(C) = 0.6106 × tanh(0.9648) = 0.6106 × 0.7464 = 0.4558`,
      cap: "Watch the C line: it is \"keep 74% of the old\" plus \"admit 0.374 of the new\" — with no matrix multiplication at all", lang: "txt" },
    { h: "The cell state's gradient path" },
    { code: String.raw`∂C_t / ∂C_{t−1} = f_t

if f_t ≈ 1 at every step  ->  the product across time ≈ 1  ->  the gradient passes intact
if f_t ≈ 0.5              ->  0.5ᵀ  ->  deliberately fast forgetting

**the model chooses its own memory length**, unlike an RNN where λ imposes it`,
      cap: "This is the complete answer to what LSTM fixes and how", lang: "txt" },
    { h: "Padding and masking — where the bugs live" },
    { code: String.raw`sequences in a batch differ in length, so they must be padded

[5, 3, 8, 2, 0, 0, 0]      0 = pad
[7, 1, 0, 0, 0, 0, 0]

**without masking**:
   pad contributes to the loss     -> the model learns to predict padding
   pad receives attention weight   -> the context is diluted with nothing`,
      cap: "Neither raises an error — only an inexplicably worse score", lang: "txt" },
    { h: "What attention costs" },
    { code: String.raw`sequence length n · dimension d

RNN:        O(n · d²)   sequential, cannot be parallelised over time
attention:  O(n² · d)   **fully parallel**

n = 100  ->  attention is cheaper once d > 100
n = 10,000 -> n² = 100 million  <- this is why long context is expensive`,
      cap: "The trade is that an RNN grows linearly with length but cannot parallelise, while attention grows quadratically but parallelises completely", lang: "txt" },
    { h: "What attention actually learns" },
    { p: "**Plot a translation model's attention weights as a grid and a diagonal appears, bending to follow the target language's word order** — and in language pairs whose word order differs, such as one that puts the verb last, that line crosses over at exactly the position you would predict. That is evidence it has learned genuine word alignment rather than a plausible-looking average." },
    { h: "How time series differ from text" },
    { table: { head: ["Aspect", "Text", "Time series"], rows: [
      ["Splitting", "Random is fine", "**Must be split by time**"],
      ["Bidirectional", "Fine", "**Forbidden — it is future leakage**"],
      ["Window features", "Not applicable", "**Any window straddling the future is leakage**"],
      ["Seasonality", "None", "Must be supplied explicitly as a feature"]
    ]}},
    { note: "**Future leakage is the single most common way a forecasting model reports impossible accuracy** — if a score is better than expected, suspect this first, every time." }
  ],

  architecture: [
    { p: "This section is about choosing a structure and a decision order for sequence tasks." },
    { h: "What to choose in 2026" },
    { table: { head: ["Task", "Use", "Why"], rows: [
      ["Text of any kind", "**Transformer**", "It wins on nearly every axis, and pretrained ones are abundant"],
      ["Short time series, little data", "**GRU or LSTM**", "Fewer parameters, harder to overfit"],
      ["Long multivariate time series", "**Transformer or TCN**", "Better at long-range dependence"],
      ["Streaming, one step at a time", "**The RNN family**", "It carries a state instead of the whole context"],
      ["Very small, on constrained hardware", "**GRU**", "The lightest option that still works well"]
    ]}},
    { note: "**This page still matters even though transformers won** — because the attention the next page relies on was invented here, and because RNNs genuinely still win at streaming and on small data." },
    { h: "The shape of seq2seq with attention" },
    { code: String.raw`  x₁ x₂ x₃ x₄            <- the source sequence
   |  |  |  |
  [encoder RNN]  ->  h₁ h₂ h₃ h₄     <- keep them all, not only the last
                       |
                  [attention]  <---  the decoder's current state (the query)
                       |
                    context
                       |
  [decoder RNN] -> y₁ y₂ y₃`,
      cap: "The only difference from plain seq2seq is keeping every h instead of discarding all but the last", lang: "txt" },
    { h: "Defaults you can use immediately" },
    { table: { head: ["Setting", "Value", "Note"], rows: [
      ["Cell type", "**LSTM** or **GRU**", "Try both; neither always wins"],
      ["Hidden size", "**256-512**", "Anything larger needs proportionally more data"],
      ["Layers", "**2**", "Three or more adds little"],
      ["Dropout", "**0.2-0.3 between layers**", "**Not along the time direction** unless using variational dropout"],
      ["Gradient clipping", "**1.0 or 5.0**", "**Required, not optional**"],
      ["Optimizer", "**Adam at 1e-3**", "SGD is much harder to use with RNNs"],
      ["Bidirectional", "**On when the whole sequence is available**", "Never in forecasting"]
    ]}},
    { h: "The experiment order" },
    { code: String.raw`1. a baseline that uses no context at all   <- predict yesterday's value / the majority class
2. a single-layer GRU with hidden 256
3. add layers or width if still underfitting
4. add attention if it is a seq2seq task
5. switch to a transformer if sequences are long and there is enough data`,
      cap: "Step 1 matters enormously in time series — a great many models lose to \"tomorrow equals today\"", lang: "txt" },
    { h: "Handling sequences of different lengths" },
    { code: String.raw`1. sort by length within a batch          -> far less padding
2. pad to the longest in the batch (not the longest in the dataset)
3. pass the mask to both the loss and the attention
4. cap the maximum length if there is an unusually long tail`,
      cap: "Points 1 and 2 cut training time several-fold on datasets with a wide length distribution", lang: "txt" }
  ],

  dataflow: [
    { p: "Attention computed by hand from start to finish, then the effect of √d_k shown numerically." },
    { h: "Setting it up" },
    { code: String.raw`d_k = 4 · three source positions

query   q  = [1, 0, 1, 0]        the decoder is looking for something

keys       k₁ = [1, 0, 1, 0]     position 1
           k₂ = [0, 1, 0, 1]     position 2
           k₃ = [1, 1, 0, 0]     position 3

values     v₁ = [10, 0]
           v₂ = [0, 10]
           v₃ = [5, 5]`,
      cap: "k₁ matches q exactly, k₂ is orthogonal to it, k₃ matches halfway — all three cases covered", lang: "txt" },
    { h: "Step 1 — the dot products" },
    { code: String.raw`q · k₁ = 1·1 + 0·0 + 1·1 + 0·0 = 2.0     <- a full match
q · k₂ = 1·0 + 0·1 + 1·0 + 0·1 = 0.0     <- orthogonal, entirely unrelated
q · k₃ = 1·1 + 0·1 + 1·0 + 0·0 = 1.0     <- a half match`,
      cap: "The dot product is a direct measure of agreement — the more they point the same way, the larger it is", lang: "txt" },
    { h: "Step 2 — divide by √d_k" },
    { code: String.raw`√d_k = √4 = 2

scaled = [2.0/2, 0.0/2, 1.0/2] = [1.0, 0.0, 0.5]`,
      cap: "At this small d_k the effect is mild, but it becomes stark in the block below when d_k grows", lang: "txt" },
    { h: "Step 3 — softmax" },
    { code: String.raw`exp([1.0, 0.0, 0.5]) = [2.7183, 1.0000, 1.6487]
sum = 5.3670

α = [2.7183/5.3670, 1.0000/5.3670, 1.6487/5.3670]
  = [0.5065, 0.1863, 0.3072]        sum = 1.0000  ✓`,
      cap: "The best-matching position takes about half the weight, while the others still contribute rather than being discarded", lang: "txt" },
    { h: "Step 4 — the weighted average of the values" },
    { code: String.raw`context = 0.5065·[10, 0] + 0.1863·[0, 10] + 0.3072·[5, 5]

dimension 1:  0.5065(10) + 0.1863(0) + 0.3072(5) = 5.065 + 0 + 1.536 = 6.601
dimension 2:  0.5065(0) + 0.1863(10) + 0.3072(5) = 0 + 1.863 + 1.536 = 3.399

context = [6.601, 3.399]`,
      cap: "**That is the whole of attention** — dot product, divide, softmax, weighted average, and nothing more", lang: "txt" },
    { h: "What happens without the √d_k" },
    { code: String.raw`softmax([2.0, 0.0, 1.0]) = [0.6652, 0.0900, 0.2447]
softmax([1.0, 0.0, 0.5]) = [0.5065, 0.1863, 0.3072]      <- the divided version

at d_k = 4 the difference is modest, but the direction is clear: undivided is sharper`,
      cap: "The effect intensifies with d_k, because the dot product grows like √d_k", lang: "txt" },
    { h: "The effect of a larger d_k" },
    { code: String.raw`the same score direction, with magnitude growing like √d_k

d_k = 4     raw [3.0,  1.0, 0.0]  -> softmax [0.8438, 0.1142, 0.0420]
d_k = 64    raw [12.0, 4.0, 0.0]  -> softmax [0.9997, 0.0003, 0.0000]   <- nearly one-hot

after dividing by √d_k, both give [1.5, 0.5, 0.0]
                          -> softmax [0.6285, 0.2312, 0.1402]  identically`,
      cap: "The second row is the problem — a nearly one-hot softmax has a nearly zero gradient, so it cannot train", lang: "txt" },
    { note: "**And that is the complete answer to \"why √d_k\"** — it is not an arbitrary rescaling but a way of holding the score variance at 1 so the softmax stays in a region that still has a gradient." },
    { h: "Attention changes at every decoding step" },
    { code: String.raw`translating "the cat sat"

step 1 (producing "cat"):  α = [0.15, 0.70, 0.15]   <- looking at "cat"
step 2 (producing "sat"):  α = [0.10, 0.20, 0.70]   <- moved to "sat"

the query changes each step -> α changes -> the context changes`,
      cap: "So the sentence is no longer squeezed into one vector — each step looks only at what it needs", lang: "txt" },
    { h: "The cost compared with an RNN" },
    { code: String.raw`sequence length n = 100 · dimension d = 512

RNN:        O(n · d²) = 100 × 262,144 = 26.2 million   but strictly one step at a time
attention:  O(n² · d) = 10,000 × 512  = 5.1 million    and entirely in parallel`,
      cap: "Cheaper and parallel — those two together are why the next page drops recurrence altogether", lang: "txt" }
  ],

  implementation: [
    { p: "Code for everything on this page, with the places people get it wrong." },
    { h: "1) An RNN from scratch in NumPy" },
    { code: String.raw`import numpy as np

def rnn_forward(X, Wxh, Whh, b, h0):
    """X: (T, d_in) -> H: (T, d_hidden)"""
    h, out = h0, []
    for t in range(X.shape[0]):
        h = np.tanh(X[t] @ Wxh + h @ Whh + b)
        out.append(h)
    return np.stack(out), h

# this loop is itself the reason it cannot be parallelised over time:
# step t's h has to wait for step t−1's h`,
      cap: "Six lines are the whole RNN, and the closing comment is its unfixable limitation", lang: "python" },
    { h: "2) An LSTM cell from scratch" },
    { code: String.raw`def sigmoid(z): return 1 / (1 + np.exp(-z))

def lstm_step(x, h, c, W, b):
    z = np.concatenate([x, h]) @ W + b       # all four gates in one multiply
    n = h.shape[0]
    f = sigmoid(z[0:n])
    i = sigmoid(z[n:2*n])
    g = np.tanh(z[2*n:3*n])
    o = sigmoid(z[3*n:4*n])

    c = f * c + i * g                        # <- the additive path, the whole mechanism
    h = o * np.tanh(c)
    return h, c`,
      cap: "One matrix multiply split four ways is far faster than four multiplies, and it is what every library does", lang: "python" },
    { h: "3) Initialising the forget gate bias to 1" },
    { code: String.raw`for name, p in model.named_parameters():
    if "bias" in name:
        n = p.shape[0] // 4
        p.data[n:2*n].fill_(1.0)      # PyTorch orders them i, f, g, o
                                       # so the f slice is [n:2n]`,
      cap: "**Always check your library's gate ordering** — PyTorch uses i,f,g,o and others may differ", lang: "python" },
    { h: "4) Scaled dot-product attention" },
    { code: String.raw`import torch, math

def attention(q, k, v, mask=None):
    """q (B, Tq, d) · k, v (B, Tk, d)"""
    d_k = q.size(-1)
    scores = q @ k.transpose(-2, -1) / math.sqrt(d_k)      # (B, Tq, Tk)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float("-inf"))
    attn = scores.softmax(dim=-1)
    return attn @ v, attn`,
      cap: "`-inf` **before the softmax, not 0** — with 0, `exp(0)=1` and padded positions still receive weight", lang: "python" },
    { h: "5) Checking that attention is correct" },
    { code: String.raw`q = torch.tensor([[[1., 0., 1., 0.]]])
k = torch.tensor([[[1., 0., 1., 0.], [0., 1., 0., 1.], [1., 1., 0., 0.]]])
v = torch.tensor([[[10., 0.], [0., 10.], [5., 5.]]])

ctx, attn = attention(q, k, v)
print(attn)   # tensor([[[0.5065, 0.1863, 0.3072]]])
print(ctx)    # tensor([[[6.6008, 3.3992]]])
assert torch.allclose(attn.sum(-1), torch.ones(1))`,
      cap: "It matches the hand calculation above (6.601 and 3.399 are the same values to three decimals) — always verify your own code this way before trusting it", lang: "python" },
    { h: "6) An LSTM in PyTorch with packing" },
    { code: String.raw`import torch.nn as nn
from torch.nn.utils.rnn import pack_padded_sequence, pad_packed_sequence

lstm = nn.LSTM(128, 256, num_layers=2, batch_first=True,
               dropout=0.3, bidirectional=False)

packed = pack_padded_sequence(x, lengths.cpu(),
                              batch_first=True, enforce_sorted=False)
out, (h, c) = lstm(packed)
out, _ = pad_packed_sequence(out, batch_first=True)`,
      cap: "Packing makes the RNN skip padded positions entirely — both faster and giving a correct final hidden state", lang: "python" },
    { h: "7) Masking in the loss" },
    { code: String.raw`loss_fn = nn.CrossEntropyLoss(ignore_index=PAD_ID)

loss = loss_fn(logits.reshape(-1, vocab), targets.reshape(-1))

# or by hand, for more control:
mask = (targets != PAD_ID).float()
loss = (per_token_loss * mask).sum() / mask.sum()   # divide by real tokens only`,
      cap: "**Divide by** `mask.sum()`**, not the total count**, or a heavily padded batch reports a falsely low loss", lang: "python" },
    { h: "8) The gradient clipping you cannot skip" },
    { code: String.raw`loss.backward()
norm = torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
if norm > 10:
    print(f"unusually high gradient norm: {norm:.1f}")
opt.step()`,
      cap: "Print the norm early on too — frequent values in the hundreds mean the model or the learning rate is wrong", lang: "python" },
    { h: "9) Training with teacher forcing" },
    { code: String.raw`# during training: feed the true previous token
decoder_input = target[:, :-1]        # everything but the last
decoder_target = target[:, 1:]        # shifted by one

logits = model(source, decoder_input)
loss = loss_fn(logits.reshape(-1, vocab), decoder_target.reshape(-1))`,
      cap: "That one-position shift is the whole of teacher forcing — and the origin of exposure bias", lang: "python" },
    { h: "10) Beam search" },
    { code: String.raw`def beam_search(model, src, k=5, max_len=50):
    beams = [([BOS], 0.0)]                      # (sequence, cumulative log probability)
    for _ in range(max_len):
        cand = []
        for seq, score in beams:
            if seq[-1] == EOS:
                cand.append((seq, score))       # finished, carry it forward
                continue
            logp = model(src, seq).log_softmax(-1)[-1]
            top = logp.topk(k)
            for lp, tok in zip(top.values, top.indices):
                cand.append((seq + [tok.item()], score + lp.item()))
        beams = sorted(cand, key=lambda b: b[1] / len(b[0]), reverse=True)[:k]
        if all(s[-1] == EOS for s, _ in beams):
            break
    return beams[0][0]`,
      cap: "**Divide by the length** when ranking, or the accumulating negative log probability always favours short sequences", lang: "python" }
  ],

  tricks: [
    { h: "Diagnosing by symptom" },
    { table: { head: ["Symptom", "Cause", "Fix"], rows: [
      ["The loss becomes NaN in the first epoch", "Gradients exploding through λᵀ", "**Gradient clipping** · lower the lr · check the initialisation"],
      ["The model only remembers the last few steps", "λ < 1 erases distant context", "Use LSTM or GRU · add attention"],
      ["Suspiciously good scores in a forecasting task", "**Future leakage**", "Check bidirectional · check feature windows · split by time"],
      ["Generates well in training, drifts at inference", "**Exposure bias**", "Scheduled sampling · beam search · train on longer sequences"],
      ["Worse results when batch lengths vary a lot", "Not masked or not packed", "`pack_padded_sequence` · `ignore_index`"],
      ["The loss looks impossibly low", "Divided by all tokens including padding", "Divide by `mask.sum()`"],
      ["Beam search does worse than greedy", "k too large, or no length normalisation", "Reduce k to 4-10 · divide the score by the length"],
      ["Attention gives weight to padded positions", "Masked with 0 instead of `-inf`", "`masked_fill(mask == 0, -inf)` before the softmax"],
      ["Training is extremely slow", "Long sequences with no parallelism over time", "Sort by length · cap the maximum · move to a transformer"]
    ]}},
    { h: "LSTM or GRU" },
    { table: { head: ["", "LSTM", "GRU"], rows: [
      ["Parameters", "4 sets", "**3 sets (75% of LSTM)**"],
      ["Separate cell state", "**Yes**", "No"],
      ["Little data", "Overfits more easily", "**Usually better**"],
      ["Very long sequences", "**Usually slightly better**", "Close"],
      ["Conclusion", "Try both", "Try both"]
    ]}},
    { h: "The most common mistakes" },
    { ul: [
      "**Skipping gradient clipping**, when in an RNN it is required rather than optional",
      "**Using bidirectional for forecasting**, which reads the future directly",
      "**Splitting a time series randomly**, which inflates every score",
      "**Forgetting to mask padding** in both the loss and the attention",
      "**Masking with 0 instead of** `-inf`, so padding still receives weight",
      "**Not length-normalising in beam search**, which produces only short outputs",
      "**Skipping the no-context baseline** in time series, so nobody knows what the model actually beat"
    ]},
    { h: "Numbers worth remembering" },
    { table: { head: ["Thing", "Value"], rows: [
      ["RNN parameters", "`h·(h + x) + h`"],
      ["LSTM against RNN", "4× · GRU 3×"],
      ["Attention's cost", "`O(n²·d)` against an RNN's `O(n·d²)`"],
      ["Attention's scaling factor", "`1/√d_k`"],
      ["Beam search k", "4-10 · beyond that it usually degrades"],
      ["Forget gate bias initialisation", "1.0"]
    ]}},
    { note: "**If only one sentence survives from this page**: LSTM beats RNN because the cell state is **added to** rather than repeatedly multiplied by a matrix, and attention beats seq2seq because it **does not compress** the sequence into one vector — both times the fix is removing a problematic multiplication." }
  ],

  eval: [
    { p: "The questions that separate understanding the mechanism from knowing how to call `nn.LSTM`." },
    { qa: [
      { q: "Why does a sequence need a different structure from other inputs?",
        a: "Because order carries meaning — \"dog bites man\" and \"man bites dog\" contain identical tokens — and because lengths vary, which a dense layer cannot accept since it must know its input count in advance." },
      { q: "What form does weight sharing take in an RNN?",
        a: "The same W is applied at every timestep, the temporal analogue of a CNN reusing one kernel across space — which is why any length is accepted and the parameter count does not grow with length." },
      { q: "Why do RNN gradients fail harder than an ordinary deep network's?",
        a: "Because it is **the same matrix** raised to the power T, not T different matrices, so it behaves like `λᵀ` — at λ=0.9 and T=100 only 2.7e−5 survives, while at λ=1.1 it reaches 13,800." },
      { q: "A 50-word sentence is equivalent to how many layers?",
        a: "Fifty, but fifty layers all sharing one weight matrix, which is why the problem is more severe than in an ordinary 50-layer network." },
      { q: "What mechanism does LSTM use to fix that?",
        a: "The line `C_t = f_t ⊙ C_{t−1} + i_t ⊙ g_t`, which is an **addition** rather than a matrix multiplication. With `f_t ≈ 1` the gradient path along C is approximately the identity — the same mechanism as ResNet's `+1`, invented two decades earlier." },
      { q: "What does `∂C_t/∂C_{t−1}` equal, and what does that tell you?",
        a: "Exactly `f_t`. If it is near 1 at every step the gradient passes intact; at 0.5 it is `0.5ᵀ`, deliberately fast forgetting. The point is that **the model chooses its own memory length**, unlike an RNN where λ imposes it." },
      { q: "What do LSTM's four gates do?",
        a: "Forget controls how much of the old cell state to keep, input how much new information to admit, the candidate supplies that new content, and output controls how much of the cell is exposed — but the heart of it is not the gates, it is the addition in the cell state." },
      { q: "Why initialise the forget gate's bias to 1?",
        a: "Because an f starting near 0 forgets everything immediately and the cell state never accumulates anything. Setting it to 1.0 gives `σ(1)=0.73`, so it begins by remembering and learns what to forget." },
      { q: "How does GRU differ from LSTM?",
        a: "It merges forget and input into one update gate and drops the separate cell state, using 3 weight sets instead of 4 — 75% of LSTM — with usually comparable quality, so both are worth trying." },
      { q: "What limitation of RNNs does LSTM not fix?",
        a: "That it cannot be parallelised over time, because `h_t` requires `h_{t−1}` first — and this, rather than quality alone, is the real reason transformers won." },
      { q: "When is bidirectional appropriate, and when is it forbidden?",
        a: "It is appropriate when the whole sequence is already available, as in text classification, but **forbidden in forecasting**, where it reads values that have not happened yet, inflating validation scores and making the model unusable." },
      { q: "What is seq2seq's bottleneck?",
        a: "Compressing the entire source into one vector: a 5-word and a 50-word sentence receive the same dimensions, so quality degrades measurably as length grows." },
      { q: "How does attention fix that?",
        a: "The decoder sees every encoder hidden state and takes a learned weighted average, with the weights changing at each generation step — so each step looks at the words it needs rather than relying on a single pre-compressed vector." },
      { q: "What are query, key and value, and where do they come from?",
        a: "The query is what the current position is looking for, coming from the decoder's state; the key is what each position advertises itself as; and the value is what each position actually contributes — the latter two both from the encoder's hidden states under different projections." },
      { q: "Can you write the attention equations?",
        a: "`score_i = q·k_i/√d_k`, then `α = softmax(score)`, then `context = Σ αᵢvᵢ`. Those three lines are all of it." },
      { q: "Why divide by √d_k?",
        a: "Because the dot product of unit-variance vectors in d_k dimensions has variance d_k, growing like √d_k — at d_k=64 the scores `[12,4,0]` give a softmax of `[0.9997, 0.0003, 0]`, nearly one-hot with a nearly zero gradient. The division holds the variance at 1." },
      { q: "Why must an attention mask use `-inf` rather than 0?",
        a: "Because the mask is applied before the softmax and `exp(0) = 1`, so padded positions would still receive weight. `-inf` is needed so that `exp(-inf) = 0`." },
      { q: "What is teacher forcing, and what problem does it create?",
        a: "Feeding the true previous token during training, which is fast and stable, while at inference the model must consume its own outputs, which it never saw in training. That mismatch is exposure bias, and it is why generated text slowly comes apart." },
      { q: "How does beam search differ from greedy, and what k is enough?",
        a: "Greedy takes the argmax at every step and can never undo a bad first choice, while beam search keeps k hypotheses alive. k = 4-10 is sufficient, and beyond that it usually degrades because likelihood favours short and bland output." },
      { q: "Why must beam search normalise the score by length?",
        a: "Because log probabilities are negative and accumulate at every step, so longer sequences automatically score lower — without normalisation only unnaturally short outputs survive." },
      { q: "How does attention's cost compare with an RNN's?",
        a: "Attention is `O(n²·d)` while an RNN is `O(n·d²)` — at n=100 and d=512 attention is cheaper and fully parallel, whereas the RNN runs one step at a time; but at very large n the n² term becomes the problem." },
      { q: "What needs special care in time series?",
        a: "Never split randomly — split by time; never use bidirectional; and treat any feature computed over a window that straddles the future as leakage. If the score is better than expected, suspect that first." }
    ]},
    { h: "Further reading" },
    { links: [
      { label: "Understanding LSTM Networks (Colah)", url: "https://colah.github.io/posts/2015-08-Understanding-LSTMs/", note: "The clearest explanation of LSTM there is, with diagrams of every gate and the cell state" },
      { label: "The Unreasonable Effectiveness of Recurrent Neural Networks", url: "https://karpathy.github.io/2015/05/21/rnn-effectiveness/", note: "Why RNNs are powerful, with real generated samples" },
      { label: "Neural Machine Translation by Jointly Learning to Align and Translate", url: "https://arxiv.org/abs/1409.0473", note: "The original attention paper, including the plots showing word alignment between two languages" },
      { label: "Long Short-Term Memory (Hochreiter & Schmidhuber, 1997)", url: "https://deeplearning.cs.cmu.edu/F23/document/readings/LSTM.pdf", note: "The original paper, with the analysis of the gradient problem it solves" },
      { label: "On the difficulty of training Recurrent Neural Networks", url: "https://arxiv.org/abs/1211.5063", note: "The mathematics behind λᵀ and why gradient clipping is necessary" },
      { label: "Attention? Attention! (Lilian Weng)", url: "https://lilianweng.github.io/posts/2018-06-24-attention/", note: "Every form of attention in sequence, up to the transformer" },
      { label: "PyTorch — NLP From Scratch: seq2seq with attention", url: "https://pytorch.org/tutorials/intermediate/seq2seq_translation_tutorial.html", note: "Builds an encoder-decoder with attention from scratch, line by line" },
      { label: "Empirical Evaluation of Gated Recurrent Neural Networks", url: "https://arxiv.org/abs/1412.3555", note: "A systematic LSTM against GRU comparison — the conclusion is that neither always wins" }
    ]}
  ]
};
