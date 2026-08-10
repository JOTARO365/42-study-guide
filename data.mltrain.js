/* Training deep networks — optimizers, schedules, regularisation, normalisation */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

window.TEACHING_DATA.push({
  id: "ml_train",
  name: "การเทรน — optimizer, learning rate, regularization, normalization",
  nameEn: "Training — Optimizers, Learning Rate, Regularisation, Normalisation",
  titleShort: { th: "การเทรน Deep Network", en: "Training Deep Networks" },
  tag: {
    th: "สถาปัตยกรรมบอกว่าเครือข่ายแทนอะไรได้ การเทรนบอกว่ามันแทนอะไรจริง — optimizer แต่ละตัวเป็นการแก้ความล้มเหลวของตัวก่อนหน้า, learning rate สำคัญกว่าทุกอย่างรวมกัน, และ AdamW ไม่ใช่ Adam ที่ใส่ L2",
    en: "The architecture decides what a network can represent; training decides what it does represent — each optimizer fixes the previous one's failure, the learning rate outweighs everything else combined, and AdamW is not Adam with L2"
  },
  accent: "#f472b6",
  sections: {
    principle: [
      { h: "ความล้มเหลวส่วนใหญ่อยู่ที่นี่ ไม่ใช่ที่สถาปัตยกรรม" },
      { p: "**สถาปัตยกรรมบอกว่าเครือข่าย 'แทนอะไรได้' ส่วนการเทรนบอกว่ามัน 'แทนอะไรจริง'** — เครือข่ายที่ออกแบบถูกทั้งหมดยังพังได้ทั้งหมดถ้า learning rate ผิด และนั่นคือกรณีที่พบบ่อยที่สุด" },
      { h: "ลำดับความสำคัญ พูดครั้งเดียวแล้วใช้ทั้งหน้า" },
      { code: String.raw`1. learning rate        ← สำคัญกว่าทุกตัวที่เหลือรวมกัน
2. batch size           ← เพราะมันเปลี่ยน learning rate ที่ได้ผลจริง
3. ความแรงของ regularization  ← เมื่อเห็นช่องว่าง train/val แล้วเท่านั้น
4. optimizer            ← AdamW เป็นค่าเริ่มต้นที่ดี ส่วนที่ได้เพิ่มมีน้อย
5. ที่เหลือทั้งหมด`,
        cap: "จูนตามลำดับนี้ · คำอธิบายที่เปิดด้วยการเลือก optimizer ได้ชี้ผิดจุดตั้งแต่ประโยคแรก", lang: "txt" },
      { h: "หน้านี้ต่อจากหน้าที่แล้วอย่างไร" },
      { table: { head: ["หน้าที่แล้ว", "หน้านี้"], rows: [
        ["ได้ gradient ของทุกน้ำหนักแล้ว", "**เอา gradient นั้นไปอัปเดตอย่างไรให้ดี**"],
        ["`w −= η · g` ตรง ๆ", "momentum · การปรับสเกลรายพารามิเตอร์ · การลด η ตามเวลา"],
        ["รู้ว่า overfit คืออะไร", "**ลงมือกันมันด้วยกลไกที่รู้ว่าทำงานยังไง**"],
        ["`model.eval()` ต้องเรียก", "**เพราะ dropout กับ batch norm ทำงานคนละแบบตอนเทรนกับตอนวัด**"]
      ]}},
      { h: "สามอย่างที่ทำให้เทรนพัง เรียงตามความถี่" },
      { table: { head: ["เกิดอะไร", "สาเหตุที่พบบ่อยที่สุด"], rows: [
        ["**loss กลายเป็น NaN**", "learning rate สูงเกินไป"],
        ["**train ลง val ไม่ลง**", "overfit — ต้อง regularize ไม่ใช่เพิ่มชั้น"],
        ["**ตอนวัดผลแย่กว่าตอนเทรนมาก**", "ลืม `model.eval()` — dropout ยังทำงานอยู่"]
      ]}},
      { h: "หน้านี้จะทำให้ทำได้" },
      { ul: [
        "อธิบายว่า momentum, RMSProp และ Adam แต่ละตัวแก้ความล้มเหลวอะไรของตัวก่อนหน้า",
        "รู้ว่าทำไม AdamW ไม่ใช่ Adam ที่ใส่ L2 และความต่างนั้นเปลี่ยนพฤติกรรมจริงยังไง",
        "เลือก learning rate ด้วยการวัด ไม่ใช่การเดา และรู้ว่าทำไมต้องมี warmup",
        "รู้ว่า batch norm ทำอะไรตอน inference และทำไม transformer ใช้ layer norm แทน",
        "เทรนด้วย batch ที่ใหญ่กว่าหน่วยความจำ GPU ได้ด้วย gradient accumulation"
      ]}
    ],

    theory: [
      { p: "หมวดนี้ไล่ optimizer เป็นลำดับ โดยแต่ละตัวคือคำตอบของปัญหาที่ตัวก่อนหน้าแก้ไม่ได้" },
      { h: "1) SGD — เส้นฐาน" },
      { code: String.raw`w ← w − η g

ทุกพารามิเตอร์ใช้ η เดียวกัน และไม่จำอะไรจากก้าวก่อนหน้าเลย`,
        cap: "เรียบง่ายที่สุด และยังชนะ Adam ในงานภาพบางประเภทเมื่อจูนดี", lang: "txt" },
      { table: { head: ["ปัญหาของ SGD", "เกิดขึ้นเมื่อ"], rows: [
        ["**แกว่งข้ามหุบเขาแคบ**", "ทิศหนึ่งชันมาก อีกทิศแบนมาก"],
        ["**คลานช้ามากในทิศที่แบน**", "gradient เล็กจนก้าวแทบไม่ขยับ"],
        ["**η เดียวไม่พอ**", "แต่ละพารามิเตอร์มีขนาด gradient ต่างกันหลายอันดับ"]
      ]}},
      { h: "2) Momentum — แก้การแกว่งและความช้า" },
      { code: String.raw`v ← β v + g          β = 0.9
w ← w − η v

สะสมทิศทางที่ไปทางเดิมซ้ำ ๆ และหักล้างทิศที่สลับไปมา`,
        cap: "ผลคือเร่งในทิศที่แบนราว 1/(1−β) = 10 เท่า และหน่วงการแกว่งในทิศที่ชัน", lang: "txt" },
      { p: "**Nesterov** ต่างตรงที่คำนวณ gradient หลังก้าว momentum ไปแล้ว จึงเห็นล่วงหน้าว่ากำลังจะเลยจุดต่ำสุด และเบรกได้ทัน — ดีขึ้นเล็กน้อยแต่ได้ฟรี" },
      { h: "3) RMSProp — แก้เรื่อง η เดียวไม่พอ" },
      { code: String.raw`s ← β s + (1−β) g²
w ← w − η g / (√s + ε)

พารามิเตอร์ที่ gradient ใหญ่มาตลอด → หารด้วยเลขใหญ่ → ก้าวเล็กลง
พารามิเตอร์ที่ gradient เล็กมาตลอด → หารด้วยเลขเล็ก → ก้าวใหญ่ขึ้น`,
        cap: "ผลคือทุกพารามิเตอร์ก้าวยาวใกล้เคียงกัน ไม่ว่า gradient จะต่างกันกี่อันดับ", lang: "txt" },
      { h: "4) Adam — รวมสองอย่างเข้าด้วยกัน" },
      { code: String.raw`m ← β₁ m + (1−β₁) g          β₁ = 0.9      ทิศทาง (momentum)
v ← β₂ v + (1−β₂) g²         β₂ = 0.999    ขนาด (RMSProp)

m̂ = m / (1 − β₁ᵗ)                          bias correction
v̂ = v / (1 − β₂ᵗ)

w ← w − η · m̂ / (√v̂ + ε)`,
        cap: "สองบรรทัดแรกคือ momentum กับ RMSProp ที่รันคู่กัน ส่วนที่เหลือคือการแก้ความเอนเอียงตอนเริ่ม", lang: "txt" },
      { h: "5) ทำไมต้องมี bias correction" },
      { code: String.raw`m กับ v เริ่มที่ศูนย์ จึงเอนเข้าหาศูนย์ในก้าวแรก ๆ

t = 1     1 − β₂ᵗ = 0.001      → ต้องหารด้วย 0.001 คือขยายพันเท่า
t = 10    1 − β₂ᵗ = 0.00996
t = 100   1 − β₂ᵗ = 0.0952
t = 1000  1 − β₂ᵗ = 0.632      → เริ่มไม่สำคัญแล้ว`,
        cap: "เป็นการแก้เฉพาะช่วงต้น ไม่ใช่กลไกถาวร — ถ้าไม่มี โมเดลจะแทบไม่ขยับในร้อยก้าวแรก", lang: "txt" },
      { h: "6) AdamW — และทำไมมันไม่ใช่ Adam ที่ใส่ L2" },
      { code: String.raw`Adam + L2 ใน loss:
   g ← g + λw          แล้วค่อยหารด้วย √v̂
   → พารามิเตอร์ที่ gradient ใหญ่ ได้ decay น้อยลง โดยไม่ได้ตั้งใจ

AdamW:
   w ← w − η λ w       ทำแยกต่างหาก ไม่ผ่านตัวหารปรับสเกล
   → ทุกพารามิเตอร์ decay เท่ากันตามที่ตั้งใจ`,
        cap: "นี่คือความต่างเชิงพฤติกรรมจริง ไม่ใช่การจัดโค้ดใหม่", lang: "txt" },
      { note: "**ใช้ AdamW พร้อม `weight_decay` แทนการใส่พจน์ L2 ลงใน loss ของ Adam** และ **ห้าม decay bias กับพารามิเตอร์ของ normalization** เพราะการบีบมันเข้าหาศูนย์ไม่มีเหตุผลรองรับและมักทำให้แย่ลง" },
      { h: "7) ตารางสรุป optimizer" },
      { table: { head: ["ตัว", "เพิ่มอะไร", "แก้อะไร"], rows: [
        ["**SGD**", "`w −= η g`", "เส้นฐาน ไม่แก้อะไร"],
        ["**Momentum**", "ความเร็วสะสม `v`", "แกว่งข้ามหุบเขา · ช้าในทิศที่แบน"],
        ["**Nesterov**", "มอง gradient หลังก้าว momentum", "เลยจุดต่ำสุดตอนเลี้ยว"],
        ["**RMSProp**", "หารด้วย `√(ค่าเฉลี่ยของ g²)`", "η เดียวไม่พอสำหรับทุกพารามิเตอร์"],
        ["**Adam**", "รวมสองอย่าง + bias correction", "ทั้งคู่พร้อมกัน · ใช้ได้ทันทีโดยไม่ต้องจูนมาก"],
        ["**AdamW**", "แยก weight decay ออกจากตัวปรับสเกล", "L2 ใน Adam ไม่ใช่ weight decay จริง"]
      ]}},
      { h: "8) ตารางลด learning rate" },
      { table: { head: ["แบบ", "ทำอะไร", "เมื่อไร"], rows: [
        ["**step**", "หารด้วย 10 ทุก k epoch", "เข้าใจง่าย ยังใช้ได้ดี"],
        ["**cosine**", "ลดตามโค้ง cosine จนเกือบศูนย์", "**มาตรฐานปัจจุบัน**"],
        ["**one-cycle**", "ขึ้นแล้วลง จบต่ำมาก", "เทรนเร็วในจำนวน epoch น้อย"],
        ["**ReduceLROnPlateau**", "ลดเมื่อ validation ไม่ดีขึ้น", "เมื่อไม่รู้ว่าจะเทรนกี่ epoch"]
      ]}},
      { h: "9) warmup มีไว้ทำไม" },
      { p: "**เพราะที่ก้าวแรก ๆ ตัวประมาณความแปรปรวน `v` ของ Adam สร้างจากข้อมูลแทบไม่มีเลย จึงเชื่อไม่ได้** — ก้าวใหญ่ที่ตัดสินจากค่านั้นทำลายค่าเริ่มต้นที่ตั้งมาดีได้ · การไต่ learning rate จาก 0 ขึ้นไปช่วงไม่กี่ร้อยถึงไม่กี่พันก้าวแรกแทบไม่มีต้นทุน และป้องกันเรื่องนี้ได้" },
      { note: "**warmup แทบเป็นข้อบังคับสำหรับ transformer และสำหรับ batch ใหญ่** ส่วนเครือข่ายเล็ก ๆ ที่ batch ปกติมักไม่ต้องใช้" },
      { h: "10) กฎสเกลเชิงเส้นของ batch size" },
      { code: String.raw`คูณ batch size ด้วย k → คูณ learning rate ด้วย k

batch 32  lr 1e-3
batch 256 lr 8e-3        (ถึงจุดหนึ่งกฎนี้จะพัง ต้องเพิ่ม warmup ช่วย)

เหตุผล: batch ใหญ่ให้ gradient ที่ noise น้อยกว่า จึงก้าวยาวขึ้นได้อย่างปลอดภัย`,
        cap: "เปลี่ยน batch size โดยไม่แตะ learning rate = เปลี่ยนสองอย่างพร้อมกันโดยไม่ได้วัดอะไรเลย", lang: "txt" },
      { h: "11) regularization แต่ละตัวกับกลไก" },
      { table: { head: ["วิธี", "กลไก", "ต้องระวัง"], rows: [
        ["**weight decay**", "บีบน้ำหนักเข้าหาศูนย์ทุกก้าว", "ห้ามใช้กับ bias และพารามิเตอร์ของ norm"],
        ["**dropout**", "สุ่มปิด activation บางส่วนตอนเทรน", "**พฤติกรรมต่างกันตอนเทรนกับตอนวัด**"],
        ["**early stopping**", "หยุดที่จุดต่ำสุดของ validation", "ต้องเก็บ checkpoint ที่ดีที่สุด ไม่ใช่ตัวสุดท้าย"],
        ["**label smoothing**", "เป้าหมาย 1 กลายเป็น 1−ε", "calibrate ดีขึ้น แต่ accuracy ดิบลดลงเล็กน้อย"],
        ["**augmentation**", "เพิ่มข้อมูลที่ต่างกันจริง", "**มักแรงที่สุดในตาราง และถูกใช้น้อยที่สุด**"]
      ]}},
      { h: "12) inverted dropout — ทำไมตอน eval ไม่ต้องทำอะไร" },
      { code: String.raw`ตอนเทรน:  ปิดสุ่ม p ส่วน แล้วหารตัวที่เหลือด้วย (1−p)
           → ค่าคาดหวังของ activation คงเดิม

ตอน eval:  ไม่ทำอะไรเลย ใช้ทุกนิวรอนตามปกติ

ถ้าไม่หารตอนเทรน จะต้องคูณ (1−p) ตอน eval แทน ซึ่งพลาดง่ายกว่ามาก`,
        cap: "ทุก framework ใช้แบบ inverted จึง `model.eval()` แค่ปิด dropout ก็พอ ไม่ต้องปรับสเกลเอง", lang: "txt" },
      { h: "13) batch norm เทียบ layer norm" },
      { code: String.raw`BatchNorm:  normalize ข้าม batch แยกตาม feature
            เก็บ running mean/var ไว้ใช้ตอน inference
            → ตอนเทรนกับตอน eval คำนวณคนละแบบ
            → พังเมื่อ batch เล็กมาก (batch ขนาด 1 มีความแปรปรวนเป็นศูนย์)

LayerNorm:  normalize ข้าม feature แยกตามตัวอย่าง
            → เหมือนกันทั้งตอนเทรนและ eval ไม่ขึ้นกับขนาด batch
            → ซึ่งเป็นเหตุผลที่ transformer ใช้ตัวนี้`,
        cap: "ความต่างตอนเทรนกับ eval ของ batch norm ไม่ใช่เกร็ดให้ท่องจำ แต่คือสาเหตุที่โมเดลดีตอนเทรนแล้วแย่ตอนเสิร์ฟจริง", lang: "txt" },
      { h: "14) gradient clipping" },
      { code: String.raw`ถ้า ‖g‖ > c :   g ← g · c / ‖g‖

ตัดความยาวของ gradient ไม่ใช่ตัดทีละตัว → ทิศทางไม่เปลี่ยน`,
        cap: "จำเป็นกับ RNN และช่วยได้กับ transformer · ค่า c = 1.0 เป็นค่าที่ใช้กันมากที่สุด", lang: "txt" }
    ],

    foundations: [
      { p: "หมวดนี้เจาะกลไกที่ตัดสินว่าการเทรนจะเสถียรหรือไม่" },
      { h: "learning rate มีเพดานที่คำนวณได้" },
      { code: String.raw`บนฟังก์ชันกำลังสอง f = ½ L w²  (L = ความชันของความชัน)

η < 2/L   → ลู่เข้า
η = 2/L   → แกว่งอยู่กับที่ ไม่ลู่เข้าไม่ระเบิด
η > 2/L   → ระเบิด`,
        cap: "ในเครือข่ายจริง L ไม่รู้ค่าและเปลี่ยนตลอด จึงต้องหา learning rate ด้วยการวัด ไม่ใช่การอนุมาน", lang: "txt" },
      { h: "ดูมันระเบิดด้วยตัวเลขจริง" },
      { code: String.raw`f = w²  ·  g = 2w  ·  เริ่มที่ w = 1   (เพดานคือ η < 1)

η = 0.1   1 → 0.8 → 0.64 → 0.512 → 0.4096 → 0.3277      ลู่เข้าเรียบ
η = 0.9   1 → −0.8 → 0.64 → −0.512 → 0.4096 → −0.3277   แกว่งแต่ยังลู่เข้า
η = 1.1   1 → −1.2 → 1.44 → −1.728 → 2.0736 → −2.4883   ระเบิด`,
        cap: "แถวที่สองคืออาการ 'loss กระตุกแล้วกลับมา' ที่เห็นบ่อย แปลว่า learning rate อยู่ใกล้เพดานแล้ว", lang: "txt" },
      { h: "momentum เร็วขึ้นเท่าไรจริง ๆ" },
      { code: String.raw`ทิศที่แบน: f = ½(0.1)w²  ·  g = 0.1w  ·  w₀ = 1  ·  η = 0.1

ก้าวที่     SGD       Momentum(β=0.9)
   1       0.9900        0.9900
   2       0.9801        0.9711
   3       0.9703        0.9444
   5       0.9510        0.8716
  10       0.9044        0.6211
  20       0.8179        0.1178`,
        cap: "SGD ลดได้ 18% ใน 20 ก้าว ส่วน momentum ลดได้ 88% — นี่คือ 1/(1−β) ที่มองเห็นได้", lang: "txt" },
      { h: "Adam ปรับสเกลรายพารามิเตอร์ยังไง" },
      { code: String.raw`พารามิเตอร์สองตัวที่ gradient คงที่ต่างกันหมื่นเท่า: g = 0.01 และ g = 100
η = 0.01

SGD:   ตัวแรก ขยับ 0.0001 ต่อก้าว     ตัวที่สอง ขยับ 1.0 ต่อก้าว
       1.000000 → 0.999900             1.0 → 0.0 → −1.0 → −2.0   พุ่งข้ามไปเลย

Adam:  ทั้งสองตัวขยับ 0.01 ต่อก้าว เท่ากันพอดี
       1.00 → 0.99 → 0.98 → 0.97       ทั้งคู่`,
        cap: "เพราะ `g/√(g²)` = 1 เสมอไม่ว่า g จะเท่าไร ขนาดก้าวจึงเป็น η โดยประมาณตลอด", lang: "txt" },
      { note: "**นี่คือทั้งจุดแข็งและจุดอ่อนของ Adam** — ทนต่อการตั้ง learning rate ผิดได้ดีมาก แต่ก็ทำให้ information เรื่องขนาด gradient หายไป ซึ่งเป็นเหตุผลที่ SGD ที่จูนดียังชนะ Adam ในงานภาพบางประเภท" },
      { h: "weight decay ทำอะไรกับน้ำหนักจริง ๆ" },
      { code: String.raw`w ← w − η λ w = w(1 − ηλ)

η = 1e-3 · λ = 0.01 → คูณด้วย 0.99999 ทุกก้าว
เทรน 100,000 ก้าว → 0.99999¹⁰⁰⁰⁰⁰ ≈ 0.37

น้ำหนักที่ไม่มี gradient มาต้านจะหดเหลือราว 37% ของค่าเดิม`,
        cap: "จึงเป็นแรงกดคงที่ที่ต้องมี gradient มาสู้ ไม่ใช่การตัดทิ้ง", lang: "txt" },
      { h: "batch norm ตอน inference ใช้ค่าอะไร" },
      { code: String.raw`ตอนเทรน:   ใช้ค่าเฉลี่ยและความแปรปรวนของ batch ปัจจุบัน
            พร้อมกับอัปเดต running statistics ด้วย momentum (ค่าปกติ 0.1)

            running_mean ← 0.9 · running_mean + 0.1 · batch_mean

ตอน eval:   ใช้ running statistics ที่สะสมไว้ ไม่ใช่ค่าของ batch`,
        cap: "ถ้าลืม `model.eval()` มันจะใช้สถิติของ batch ที่กำลังวัดอยู่ ทำให้ผลเปลี่ยนตามว่า batch นั้นมีอะไรบ้าง", lang: "txt" },
      { p: "**และถ้า batch เล็กมากตอนเทรน สถิติที่สะสมได้จะ noise มาก** ซึ่งเป็นเหตุผลที่ batch norm ไม่เหมาะกับงานที่ batch เล็กโดยบังคับ เช่นการตรวจจับวัตถุความละเอียดสูง — กรณีนั้นใช้ group norm หรือ layer norm แทน" },
      { h: "gradient accumulation — batch ใหญ่บน GPU เล็ก" },
      { code: String.raw`ต้องการ batch 256 แต่หน่วยความจำรับได้ 64

ทำ backward 4 ครั้งโดยไม่ step แล้วค่อย step ครั้งเดียว
และ **ต้องหาร loss ด้วย 4** ไม่งั้น gradient รวมใหญ่ขึ้น 4 เท่า
= learning rate ที่ได้ผลจริงคูณ 4 โดยไม่รู้ตัว`,
        cap: "บรรทัดสุดท้ายคือบั๊กที่พบบ่อยที่สุดของเทคนิคนี้ และมันไม่มี error แจ้ง", lang: "txt" },
      { h: "mixed precision ต้องมี loss scaling" },
      { code: String.raw`fp16 มีช่วงค่าที่แคบกว่า fp32 มาก
gradient เล็ก ๆ จึงกลายเป็นศูนย์ (underflow) ทั้งที่ควรมีค่า

วิธีแก้: คูณ loss ด้วยตัวเลขใหญ่ก่อน backward
        แล้วหารกลับก่อน step
        → GradScaler ทำให้อัตโนมัติ และปรับตัวเลขนั้นเองเมื่อเจอ inf`,
        cap: "ประหยัดหน่วยความจำครึ่งหนึ่งและเร็วขึ้นมากบน GPU รุ่นใหม่ แต่ขาด scaler แล้วโมเดลจะไม่เรียนรู้เลย", lang: "txt" }
    ],

    architecture: [
      { p: "หมวดนี้คือลำดับการตัดสินใจและโครงของการทดลองที่เชื่อผลได้" },
      { h: "หา learning rate ด้วยการวัด" },
      { code: String.raw`LR range test:
   เริ่มที่ 1e-7 แล้วคูณขึ้นเรื่อย ๆ ทุก batch จนถึง 1
   พล็อต loss เทียบ learning rate

   loss เริ่มลงเร็วที่ไหน    → ขอบล่างของช่วงที่ใช้ได้
   loss ต่ำสุดที่ไหน         → อย่าใช้ตรงนี้ มันใกล้เพดานเกินไป
   เลือกราวหนึ่งในสิบของจุดที่ loss เริ่มพุ่งขึ้น`,
        cap: "ใช้เวลาไม่กี่นาที และแทนที่การเดาด้วยการวัดได้ทั้งหมด", lang: "txt" },
      { h: "ชุดค่าเริ่มต้นที่ใช้ได้ทันที" },
      { table: { head: ["ตัว", "ค่า", "หมายเหตุ"], rows: [
        ["optimizer", "**AdamW**", "`weight_decay = 0.01`"],
        ["learning rate", "**3e-4** สำหรับ transformer · **1e-3** สำหรับเครือข่ายเล็ก", "แล้วปรับด้วย LR range test"],
        ["schedule", "**cosine ลดจนเกือบศูนย์**", "พร้อม warmup 5% ของก้าวทั้งหมด"],
        ["batch size", "**32-128**", "ใหญ่ที่สุดที่ยังพอดีหน่วยความจำ แล้วปรับ lr ตาม"],
        ["gradient clipping", "**1.0**", "จำเป็นกับ RNN · ช่วยกับ transformer"],
        ["dropout", "**0.1**", "transformer · เครือข่ายเล็กอาจถึง 0.3"]
      ]}},
      { h: "ลำดับการทดลองที่เชื่อผลได้" },
      { code: String.raw`1. overfit 10 แถวให้ได้                    ← พิสูจน์ว่าโค้ดถูก (หน้าที่แล้ว)
2. เทรนชุดเต็มด้วยค่าเริ่มต้น พล็อต train กับ val
3. LR range test แล้วตั้ง learning rate
4. ใส่ schedule (cosine + warmup)
5. เห็นช่องว่าง train/val แล้วค่อยเพิ่ม regularization
6. ขยายโครงสร้างเป็นอย่างสุดท้าย`,
        cap: "ห้ามเปลี่ยนสองอย่างพร้อมกัน — ไม่งั้นไม่รู้ว่าอะไรทำให้ดีขึ้นหรือแย่ลง", lang: "txt" },
      { h: "เส้น loss บอกอะไร" },
      { table: { head: ["รูปเส้น", "แปลว่า", "ทำอะไรต่อ"], rows: [
        ["ทั้งคู่ลงแล้วนิ่งพร้อมกัน สูง", "**underfit**", "เทรนนานขึ้น · เพิ่มความจุ · ลองเพิ่ม lr"],
        ["train ลงเรื่อย ๆ val เริ่มขึ้น", "**overfit**", "หยุดที่จุดต่ำสุดของ val · เพิ่ม regularization"],
        ["loss กระตุกขึ้นแรงเป็นช่วง ๆ", "**lr ใกล้เพดาน**", "ลด lr · เพิ่ม warmup · ใส่ gradient clipping"],
        ["loss แบนราบตั้งแต่ก้าวแรก", "**ไม่ได้เรียนรู้เลย**", "ตรวจ `zero_grad` · lr เล็กเกิน · input ไม่ได้สเกล"],
        ["val ต่ำกว่า train", "**ปกติเมื่อใช้ dropout**", "เพราะ train วัดตอนที่ dropout ยังทำงาน"]
      ]}},
      { note: "**แถวสุดท้ายทำให้คนตกใจบ่อย** — validation loss ต่ำกว่า train loss เล็กน้อยเป็นเรื่องปกติเมื่อใช้ dropout หรือ augmentation แรง ๆ เพราะ train loss วัดตอนที่โมเดลถูกรบกวนอยู่ ส่วน validation วัดตอนที่เต็มกำลัง" },
      { h: "ทำให้ผลทำซ้ำได้" },
      { code: String.raw`ต้องตั้งทั้งหมดนี้ ไม่ใช่แค่ตัวเดียว:
   random.seed · numpy seed · torch.manual_seed · cuda seed
   DataLoader worker seed
   torch.use_deterministic_algorithms(True)

และยอมรับว่า: บาง kernel ของ GPU ไม่ deterministic โดยธรรมชาติ
                การบังคับให้ deterministic อาจช้าลงชัดเจน`,
        cap: "รายงานผลจาก seed เดียวโดยไม่บอกส่วนเบี่ยงเบนคือการรายงานที่เชื่อไม่ได้", lang: "txt" },
      { h: "checkpoint ที่ควรเก็บ" },
      { code: String.raw`เก็บทุกอย่างที่ต้องใช้เทรนต่อ ไม่ใช่แค่น้ำหนัก:
   model.state_dict()
   optimizer.state_dict()        ← Adam มี m กับ v ที่ต้องเก็บด้วย
   scheduler.state_dict()
   epoch · best_val · seed`,
        cap: "โหลด checkpoint ที่มีแต่ weight แล้วเทรนต่อ = เริ่ม momentum ใหม่หมด ซึ่งทำให้ loss กระตุกทันที", lang: "txt" }
    ],

    dataflow: [
      { p: "เดินตัวเลขจริงของสามอย่างที่คนเข้าใจผิดบ่อยที่สุด: ขนาดก้าว, momentum, และ Adam" },
      { h: "โจทย์ที่ใช้เดิน" },
      { code: String.raw`f(w) = w²      g = 2w      เริ่มที่ w = 1

จุดต่ำสุดอยู่ที่ w = 0 และเพดานของ learning rate คือ η < 1`,
        cap: "ง่ายพอจะคำนวณด้วยมือทุกก้าว และมีพฤติกรรมเหมือนทิศทางหนึ่งของเครือข่ายจริง", lang: "txt" },
      { h: "learning rate ที่พอดี" },
      { code: String.raw`η = 0.1   →  w ← w − 0.1(2w) = 0.8w

k=1  0.8000     f = 0.6400
k=2  0.6400     f = 0.4096
k=3  0.5120     f = 0.2621
k=4  0.4096     f = 0.1678
k=5  0.3277     f = 0.1074`,
        cap: "ลดลงเรียบเป็นเรขาคณิต ไม่มีการแกว่ง — เส้น loss ที่ดูแบบนี้คือกำลังไปถูกทาง", lang: "txt" },
      { h: "learning rate สูงเกินไปนิดเดียว" },
      { code: String.raw`η = 0.9   →  w ← w − 0.9(2w) = −0.8w

k=1  −0.8000    f = 0.6400
k=2   0.6400    f = 0.4096
k=3  −0.5120    f = 0.2621
k=4   0.4096    f = 0.1678

ยังลู่เข้า แต่กระโดดข้ามจุดต่ำสุดทุกก้าว`,
        cap: "loss ลงเหมือนกัน แต่เครื่องหมายสลับทุกก้าว — บนเครือข่ายจริงนี่คืออาการ loss กระตุกขึ้นลง", lang: "txt" },
      { h: "learning rate เกินเพดาน" },
      { code: String.raw`η = 1.1   →  w ← w − 1.1(2w) = −1.2w

k=1  −1.2000    f = 1.4400
k=2   1.4400    f = 2.0736
k=3  −1.7280    f = 2.9860
k=4   2.0736    f = 4.2998
k=5  −2.4883    f = 6.1917`,
        cap: "เกินเพดานแค่ 10% ก็ระเบิดแล้ว และในเครือข่ายจริงจะกลายเป็น NaN ภายในไม่กี่สิบก้าว", lang: "txt" },
      { note: "**สามบล็อกนี้คือคำอธิบายทั้งหมดของ 'ทำไม learning rate สำคัญที่สุด'** — ต่างกันแค่ 0.1 กับ 1.1 ซึ่งห่างกันสิบเท่า แยกระหว่างการลู่เข้าที่เรียบกับการระเบิด" },
      { h: "momentum บนทิศที่แบน" },
      { code: String.raw`ทิศที่ gradient เล็ก: f = ½(0.1)w²  ·  g = 0.1w  ·  η = 0.1

SGD:        w ← w(1 − 0.01) = 0.99w        ลดครั้งละ 1%
Momentum:   v ← 0.9v + g   แล้ว  w ← w − 0.1v

ก้าวที่     SGD        Momentum
   1       0.9900       0.9900        เท่ากัน เพราะ v ยังไม่สะสม
   2       0.9801       0.9711
   3       0.9703       0.9444
   5       0.9510       0.8716
  10       0.9044       0.6211
  20       0.8179       0.1178`,
        cap: "20 ก้าว SGD ลดได้ 18% ส่วน momentum ลดได้ 88% ทั้งที่ learning rate เท่ากันเป๊ะ", lang: "txt" },
      { h: "ทำไม momentum เร่งได้เท่านั้น" },
      { code: String.raw`ถ้า g คงที่ทุกก้าว  v จะลู่เข้าหา g/(1−β)

β = 0.9   →  v → 10g       ก้าวยาวขึ้น 10 เท่า
β = 0.99  →  v → 100g      แต่ตอบสนองช้าเมื่อ gradient เปลี่ยนทิศ`,
        cap: "จึงเป็นการแลกระหว่างความเร็วในทิศที่คงที่ กับความไวเมื่อภูมิประเทศเปลี่ยน", lang: "txt" },
      { h: "Adam ทำให้ก้าวเท่ากันได้ยังไง" },
      { code: String.raw`สองพารามิเตอร์ที่ gradient คงที่ต่างกันหมื่นเท่า: g = 0.01 กับ g = 100
η = 0.01

SGD:
   ตัวแรก   1.000000 → 0.999900 → 0.999800     ขยับ 1e-4 ต่อก้าว
   ตัวที่สอง 1.0 → 0.0 → −1.0 → −2.0            ขยับ 1.0 ต่อก้าว พุ่งข้ามไป

Adam:
   ตัวแรก   1.00 → 0.99 → 0.98 → 0.97
   ตัวที่สอง 1.00 → 0.99 → 0.98 → 0.97          เท่ากันพอดี`,
        cap: "เพราะ m̂/√v̂ มีขนาดราว 1 เสมอ ขนาดก้าวจึงเป็น η โดยประมาณ ไม่ว่า gradient จะใหญ่แค่ไหน", lang: "txt" },
      { h: "bias correction ในก้าวแรก" },
      { code: String.raw`ก้าวที่ 1 ด้วย g = 100:
   m = 0.1 × 100 = 10          v = 0.001 × 10000 = 10
   ถ้าไม่แก้ bias:  10/√10 = 3.16      ← ก้าวใหญ่เกินจริงสามเท่า

   แก้ bias:  m̂ = 10/0.1 = 100     v̂ = 10/0.001 = 10000
              100/√10000 = 1.0      ← ได้ขนาด 1 ตามที่ควรเป็น`,
        cap: "ในก้าวแรก ๆ ถ้าไม่แก้ ขนาดก้าวจะผิดไปหลายเท่า และผิดคนละทิศกับที่หลายคนเดา", lang: "txt" },
      { h: "dropout ตอนเทรนกับตอน eval ด้วยตัวเลข" },
      { code: String.raw`activation = [2.0, 4.0, 6.0, 8.0]   ·   p = 0.5

ตอนเทรน สมมติปิดตัวที่ 1 กับ 3:
   [0, 4.0, 0, 8.0] แล้วหารด้วย (1−0.5) = [0, 8.0, 0, 16.0]
   ผลรวม = 24.0

ตอน eval:
   [2.0, 4.0, 6.0, 8.0]   ผลรวม = 20.0

ค่าคาดหวังตอนเทรน = 0.5 × (2+4+6+8) × 2 = 20.0   ← ตรงกับ eval`,
        cap: "การหารด้วย (1−p) คือสิ่งที่ทำให้ค่าคาดหวังเท่ากัน จึงไม่ต้องปรับอะไรตอน eval", lang: "txt" }
    ],

    implementation: [
      { p: "โค้ดของทุกอย่างในหน้านี้ พร้อมจุดที่พลาดบ่อย" },
      { h: "1) AdamW ที่ไม่ decay bias และ norm" },
      { code: String.raw`import torch

decay, no_decay = [], []
for name, p in model.named_parameters():
    if not p.requires_grad:
        continue
    if p.ndim == 1 or name.endswith(".bias"):   # bias + LayerNorm/BatchNorm
        no_decay.append(p)
    else:
        decay.append(p)

opt = torch.optim.AdamW([
    {"params": decay,    "weight_decay": 0.01},
    {"params": no_decay, "weight_decay": 0.0},
], lr=3e-4)`,
        cap: "`p.ndim == 1` จับ bias และพารามิเตอร์ของ norm ได้ในบรรทัดเดียว เพราะทั้งคู่เป็นเวกเตอร์", lang: "python" },
      { h: "2) cosine schedule พร้อม warmup" },
      { code: String.raw`from torch.optim.lr_scheduler import LambdaLR
import math

def cosine_with_warmup(opt, warmup_steps, total_steps):
    def fn(step):
        if step < warmup_steps:
            return step / max(1, warmup_steps)
        progress = (step - warmup_steps) / max(1, total_steps - warmup_steps)
        return 0.5 * (1.0 + math.cos(math.pi * progress))
    return LambdaLR(opt, fn)

total = len(train_loader) * epochs
sched = cosine_with_warmup(opt, warmup_steps=int(0.05 * total), total_steps=total)`,
        cap: "**ต้องเรียก `sched.step()` ทุก batch ไม่ใช่ทุก epoch** เมื่อ schedule นับเป็นก้าวแบบนี้", lang: "python" },
      { h: "3) ลูปเทรนที่ครบทุกชิ้น" },
      { code: String.raw`for epoch in range(epochs):
    model.train()
    for xb, yb in train_loader:
        opt.zero_grad(set_to_none=True)
        loss = loss_fn(model(xb), yb)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        opt.step()
        sched.step()

    model.eval()
    with torch.no_grad():
        val = sum(loss_fn(model(xb), yb).item() for xb, yb in val_loader) / len(val_loader)
    print(f"epoch {epoch}  lr {sched.get_last_lr()[0]:.2e}  val {val:.4f}")`,
        cap: "`set_to_none=True` เร็วกว่าและช่วยจับบั๊กที่ลืม backward ได้ เพราะ gradient จะเป็น None ไม่ใช่ศูนย์", lang: "python" },
      { h: "4) LR range test" },
      { code: String.raw`import copy, math

def lr_finder(model, opt, loader, loss_fn, lo=1e-7, hi=1.0, steps=100):
    state = copy.deepcopy(model.state_dict())
    mult = (hi / lo) ** (1 / steps)
    lr, out = lo, []
    it = iter(loader)
    for _ in range(steps):
        try:    xb, yb = next(it)
        except StopIteration:
            it = iter(loader); xb, yb = next(it)
        for g in opt.param_groups:
            g["lr"] = lr
        opt.zero_grad(set_to_none=True)
        loss = loss_fn(model(xb), yb)
        loss.backward(); opt.step()
        out.append((lr, loss.item()))
        if not math.isfinite(loss.item()) or loss.item() > 4 * out[0][1]:
            break
        lr *= mult
    model.load_state_dict(state)          # คืนน้ำหนักเดิมเสมอ
    return out`,
        cap: "เลือก learning rate ราวหนึ่งในสิบของจุดที่ loss เริ่มพุ่ง ไม่ใช่จุดที่ loss ต่ำที่สุด", lang: "python" },
      { h: "5) early stopping ที่เก็บตัวที่ดีที่สุด" },
      { code: String.raw`best, patience, wait = float("inf"), 10, 0
for epoch in range(epochs):
    train_one_epoch()
    val = evaluate()
    if val < best - 1e-4:
        best, wait = val, 0
        torch.save({
            "model": model.state_dict(),
            "opt": opt.state_dict(),
            "sched": sched.state_dict(),
            "epoch": epoch, "best_val": best,
        }, "best.pt")
    else:
        wait += 1
        if wait >= patience:
            print(f"หยุดที่ epoch {epoch} · ดีที่สุด {best:.4f}")
            break`,
        cap: "เก็บ optimizer และ scheduler ไปด้วย ไม่งั้นเทรนต่อจาก checkpoint แล้ว momentum เริ่มใหม่หมด", lang: "python" },
      { h: "6) mixed precision" },
      { code: String.raw`scaler = torch.cuda.amp.GradScaler()

for xb, yb in train_loader:
    opt.zero_grad(set_to_none=True)
    with torch.cuda.amp.autocast():
        loss = loss_fn(model(xb), yb)
    scaler.scale(loss).backward()
    scaler.unscale_(opt)                       # ต้อง unscale ก่อน clip
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    scaler.step(opt)
    scaler.update()`,
        cap: "**ลืม `unscale_` ก่อน clip แล้วจะ clip ค่าที่ถูกคูณไว้ ทำให้ threshold ผิดไปหลายพันเท่า**", lang: "python" },
      { h: "7) gradient accumulation" },
      { code: String.raw`accum = 4                       # batch จริง 64 → เท่ากับ 256

opt.zero_grad(set_to_none=True)
for i, (xb, yb) in enumerate(train_loader):
    loss = loss_fn(model(xb), yb) / accum      # ← หารตรงนี้ ห้ามลืม
    loss.backward()
    if (i + 1) % accum == 0:
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        opt.step()
        sched.step()
        opt.zero_grad(set_to_none=True)`,
        cap: "ลืม `/ accum` แล้ว gradient รวมใหญ่ขึ้น 4 เท่า = learning rate ที่ได้ผลจริงคูณ 4 โดยไม่มี error แจ้ง", lang: "python" },
      { h: "8) ตั้ง seed ให้ครบ" },
      { code: String.raw`import random, numpy as np, torch

def set_seed(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False     # benchmark ทำให้ผลไม่คงที่

def worker_init(worker_id):
    np.random.seed(torch.initial_seed() % 2**32 + worker_id)

loader = DataLoader(ds, batch_size=64, shuffle=True,
                    num_workers=4, worker_init_fn=worker_init)`,
        cap: "ขาด `worker_init_fn` แล้ว augmentation ในแต่ละ worker จะสุ่มเหมือนกันหรือสุ่มไม่ซ้ำเดิมทุกครั้งที่รัน", lang: "python" },
      { h: "9) ดู learning rate ที่ใช้จริงตลอดการเทรน" },
      { code: String.raw`lrs = []
for step in range(total):
    lrs.append(sched.get_last_lr()[0])
    opt.step(); sched.step()

# พล็อตแล้วต้องเห็นสามช่วงชัดเจน:
#   ไต่ขึ้นเป็นเส้นตรง        (warmup)
#   ค่าสูงสุดสั้น ๆ
#   ลดตามโค้ง cosine จนเกือบศูนย์`,
        cap: "พล็อตก่อนเทรนจริงหนึ่งครั้งเสมอ — schedule ที่ตั้งผิดหน่วย (epoch เทียบ step) เห็นได้ทันทีจากรูป", lang: "python" },
      { h: "10) เทียบ optimizer อย่างยุติธรรม" },
      { code: String.raw`results = {}
for name, make in {
    "sgd":       lambda p: torch.optim.SGD(p, lr=1e-2, momentum=0.9),
    "adam":      lambda p: torch.optim.Adam(p, lr=1e-3),
    "adamw":     lambda p: torch.optim.AdamW(p, lr=1e-3, weight_decay=0.01),
}.items():
    set_seed(42)
    model = build_model()               # โมเดลใหม่ทุกครั้ง จาก seed เดียวกัน
    results[name] = train(model, make(model.parameters()), epochs=20)

for k, v in results.items():
    print(f"{k:6s} best val {min(v):.4f}")`,
        cap: "**ต้องจูน learning rate แยกให้แต่ละ optimizer** — เทียบด้วย lr เดียวกันคือการเทียบที่ไม่ยุติธรรมและให้ข้อสรุปผิด", lang: "python" }
    ],

    tricks: [
      { h: "ไล่ปัญหาตามอาการ" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้ยังไง"], rows: [
        ["loss กลายเป็น **NaN**", "lr สูงเกิน · `log(0)` · fp16 ไม่มี scaler", "ลด lr สิบเท่า · ใช้ loss ที่รับ logit · ใส่ GradScaler"],
        ["loss กระตุกขึ้นแรงเป็นช่วง ๆ แล้วกลับมา", "lr ใกล้เพดาน", "ลด lr · เพิ่ม warmup · gradient clipping 1.0"],
        ["loss แบนตั้งแต่ก้าวแรก", "ลืม `zero_grad` · lr เล็กเกิน · input ไม่ได้สเกล", "overfit 10 แถวเพื่อแยกสาเหตุ"],
        ["train ลง val ขึ้น", "overfit", "เพิ่ม regularization หรือข้อมูล **ไม่ใช่เพิ่มชั้น**"],
        ["eval แย่กว่า train มากที่ step เดียวกัน", "ลืม `model.eval()`", "dropout กับ batch norm ยังอยู่ในโหมดเทรน"],
        ["ผลเปลี่ยนทุกครั้งที่รัน", "seed ไม่ครบ · `cudnn.benchmark` เปิดอยู่", "ตั้ง seed ทุกตัวรวม worker ของ DataLoader"],
        ["เทรนต่อจาก checkpoint แล้ว loss กระตุก", "โหลดแต่ weight ไม่ได้โหลด optimizer", "เก็บและโหลด `optimizer.state_dict()` ด้วย"],
        ["เปลี่ยน batch size แล้วผลแย่ลง", "ไม่ได้ปรับ learning rate ตาม", "ใช้กฎสเกลเชิงเส้น แล้วเพิ่ม warmup"],
        ["fp16 แล้วโมเดลไม่เรียนรู้เลย", "gradient underflow", "ต้องใช้ GradScaler เสมอ"],
        ["gradient accumulation แล้วผลแปลก", "ลืมหาร loss ด้วยจำนวนรอบสะสม", "`loss = loss / accum`"]
      ]}},
      { h: "เลือก optimizer สั้น ๆ" },
      { table: { head: ["งาน", "ใช้"], rows: [
        ["ทั่วไป ไม่รู้จะเริ่มตรงไหน", "**AdamW** lr 1e-3 หรือ 3e-4"],
        ["transformer หรือ NLP", "**AdamW + warmup + cosine** แทบไม่มีข้อยกเว้น"],
        ["งานภาพที่จูนได้เต็มที่", "**SGD + momentum 0.9** มักชนะ AdamW เล็กน้อย แต่ต้องจูนมากกว่า"],
        ["ข้อมูลกระจัดกระจาย (sparse embedding)", "**Adam หรือ Adagrad** เพราะปรับสเกลรายพารามิเตอร์"]
      ]}},
      { h: "บั๊กเงียบที่พบบ่อยที่สุดในหน้านี้" },
      { ul: [
        "**ใส่ L2 ลงใน loss แล้วใช้ Adam** โดยคิดว่าเท่ากับ weight decay — ไม่เท่า ให้ใช้ AdamW",
        "**decay bias และพารามิเตอร์ของ norm ไปด้วย** เพราะใส่ `weight_decay` ให้ทุกพารามิเตอร์รวดเดียว",
        "**เรียก `sched.step()` ทุก epoch** ทั้งที่ schedule นับเป็นก้าว — learning rate จะลดช้ากว่าที่ตั้งใจหลายสิบเท่า",
        "**ลืมหาร loss ตอนทำ gradient accumulation** ทำให้ learning rate จริงคูณตามจำนวนรอบ",
        "**clip ก่อน `unscale_`** ตอนใช้ mixed precision ทำให้ threshold ผิดไปหลายพันเท่า",
        "**เทียบ optimizer ด้วย learning rate เดียวกัน** แล้วสรุปว่าตัวไหนดีกว่า"
      ]},
      { h: "ตัวเลขที่ควรจำได้" },
      { table: { head: ["ค่า", "ตัวเลข", "ที่มา"], rows: [
        ["β₁ · β₂ ของ Adam", "0.9 · 0.999", "ค่าจากเปเปอร์ต้นฉบับ แทบไม่มีใครเปลี่ยน"],
        ["momentum ของ SGD", "0.9", "เร่งราว 10 เท่าในทิศที่คงที่"],
        ["weight decay ของ AdamW", "0.01 - 0.1", "งานภาพมักใช้สูงกว่า NLP"],
        ["gradient clipping", "1.0", "ค่าที่ใช้กันมากที่สุด"],
        ["warmup", "5% ของก้าวทั้งหมด", "หรือ 500-2000 ก้าวสำหรับงานใหญ่"],
        ["learning rate ของ transformer", "1e-4 ถึง 5e-4", "3e-4 เป็นจุดเริ่มที่นิยมที่สุด"]
      ]}},
      { note: "**ถ้าจำได้แค่ประโยคเดียวจากหน้านี้**: learning rate สำคัญกว่าทุกอย่างรวมกัน และหามันด้วยการวัดได้ในไม่กี่นาทีด้วย LR range test — ไม่มีเหตุผลที่จะเดามันอีกต่อไป" }
    ],

    eval: [
      { p: "คำถามที่แยกคนที่รู้ว่าแต่ละปุ่มทำอะไร ออกจากคนที่คัดลอกค่ามาจากตัวอย่าง" },
      { qa: [
        { q: "อะไรสำคัญที่สุดในการเทรน และทำไม",
          a: "learning rate เพราะมันมีเพดานที่เกินแล้วระเบิดทันที — บนฟังก์ชันกำลังสอง `f=w²` การเปลี่ยนจาก 0.9 เป็น 1.1 เปลี่ยนจากลู่เข้าเป็นระเบิด และในเครือข่ายจริงหมายถึง loss กลายเป็น NaN ภายในไม่กี่สิบก้าว" },
        { q: "momentum แก้อะไร และเร่งได้เท่าไร",
          a: "แก้การแกว่งข้ามหุบเขาแคบและความช้าในทิศที่แบน โดยสะสมทิศทางที่ซ้ำเดิม ถ้า gradient คงที่ `v` จะลู่เข้าหา `g/(1−β)` ซึ่งที่ β=0.9 คือเร่งราว 10 เท่า" },
        { q: "RMSProp แก้ปัญหาอะไรที่ momentum แก้ไม่ได้",
          a: "แก้ปัญหาที่ learning rate เดียวไม่พอสำหรับพารามิเตอร์ที่มีขนาด gradient ต่างกันหลายอันดับ โดยหารด้วย `√(ค่าเฉลี่ยของ g²)` ทำให้ทุกพารามิเตอร์ก้าวยาวใกล้เคียงกัน" },
        { q: "Adam คืออะไรในหนึ่งประโยค",
          a: "momentum กับ RMSProp ที่รันคู่กัน บวก bias correction สำหรับก้าวแรก ๆ" },
        { q: "bias correction ของ Adam มีไว้ทำไม และสำคัญตอนไหน",
          a: "เพราะ `m` และ `v` เริ่มที่ศูนย์จึงเอนเข้าหาศูนย์ตอนต้น — ที่ t=1 ตัวหาร `1−β₂ᵗ` เท่ากับ 0.001 คือขยายพันเท่า แต่พอถึง t=1000 มันเป็น 0.632 และเริ่มไม่สำคัญ จึงเป็นการแก้เฉพาะช่วงต้นไม่ใช่กลไกถาวร" },
        { q: "AdamW ต่างจาก Adam ที่ใส่ L2 ยังไง",
          a: "L2 บวกเข้าไปใน gradient แล้วถูกหารด้วย `√v̂` ด้วย ทำให้พารามิเตอร์ที่ gradient ใหญ่ได้ decay น้อยลงโดยไม่ตั้งใจ ส่วน AdamW ทำ `w ← w − ηλw` แยกต่างหากนอกตัวปรับสเกล ทุกพารามิเตอร์จึง decay เท่ากันตามที่ตั้งใจ" },
        { q: "พารามิเตอร์ไหนที่ห้ามใส่ weight decay",
          a: "bias และพารามิเตอร์ของ normalization เพราะการบีบมันเข้าหาศูนย์ไม่มีเหตุผลรองรับและมักทำให้ผลแย่ลง — แยกได้ง่ายด้วย `p.ndim == 1`" },
        { q: "warmup มีไว้ทำไม",
          a: "เพราะที่ก้าวแรก ๆ ตัวประมาณความแปรปรวนของ Adam สร้างจากข้อมูลแทบไม่มีเลยจึงเชื่อไม่ได้ และก้าวใหญ่ที่ตัดสินจากค่านั้นทำลายค่าเริ่มต้นได้ — การไต่ lr ขึ้นช่วงต้นแทบไม่มีต้นทุนและป้องกันเรื่องนี้" },
        { q: "เปลี่ยน batch size แล้วต้องทำอะไรกับ learning rate",
          a: "ใช้กฎสเกลเชิงเส้น คูณ batch ด้วย k ก็คูณ lr ด้วย k เพราะ gradient ของ batch ใหญ่ noise น้อยกว่าจึงก้าวยาวได้ปลอดภัยกว่า — เปลี่ยน batch โดยไม่แตะ lr คือเปลี่ยนสองอย่างพร้อมกัน" },
        { q: "หา learning rate ที่เหมาะยังไงโดยไม่เดา",
          a: "LR range test — ไต่ lr จาก 1e-7 ขึ้นไปทุก batch แล้วพล็อต loss เทียบ lr จากนั้นเลือกราวหนึ่งในสิบของจุดที่ loss เริ่มพุ่งขึ้น ไม่ใช่จุดที่ loss ต่ำที่สุดเพราะจุดนั้นใกล้เพดานเกินไป" },
        { q: "inverted dropout คืออะไร ทำไมตอน eval ไม่ต้องปรับอะไร",
          a: "ตอนเทรนจะหาร activation ที่รอดด้วย `(1−p)` ทำให้ค่าคาดหวังเท่ากับตอนไม่ dropout ตอน eval จึงใช้ทุกนิวรอนได้ตรง ๆ โดยไม่ต้องคูณอะไร — ทุก framework ใช้แบบนี้" },
        { q: "batch norm ใช้ค่าอะไรตอน inference",
          a: "ใช้ running mean และ running variance ที่สะสมระหว่างเทรน ไม่ใช่สถิติของ batch ปัจจุบัน — ถ้าลืม `model.eval()` มันจะกลับไปใช้สถิติของ batch ที่กำลังวัด ทำให้ผลเปลี่ยนตามว่า batch นั้นมีอะไรอยู่" },
        { q: "ทำไม transformer ใช้ layer norm ไม่ใช่ batch norm",
          a: "layer norm normalize ข้าม feature ของแต่ละตัวอย่าง จึงเหมือนกันทั้งตอนเทรนและ eval และไม่ขึ้นกับขนาด batch ส่วน batch norm พังเมื่อ batch เล็กและมีความต่างระหว่างสองโหมด" },
        { q: "gradient clipping ทำอะไร และควรตัดแบบไหน",
          a: "ตัดตามความยาวของเวกเตอร์ทั้งก้อน `g ← g·c/‖g‖` เมื่อ `‖g‖ > c` ซึ่งไม่เปลี่ยนทิศทาง ต่างจากการตัดทีละตัวที่บิดทิศทาง — ค่า c=1.0 ใช้กันมากที่สุด" },
        { q: "gradient accumulation ทำยังไง และบั๊กที่พบบ่อยคืออะไร",
          a: "backward หลายครั้งโดยไม่ step แล้วค่อย step ครั้งเดียว บั๊กที่พบบ่อยคือลืมหาร loss ด้วยจำนวนรอบสะสม ทำให้ gradient รวมใหญ่ขึ้นตามจำนวนรอบ ซึ่งเท่ากับคูณ learning rate โดยไม่มี error แจ้ง" },
        { q: "mixed precision ต้องมี loss scaling ทำไม",
          a: "เพราะ fp16 มีช่วงค่าที่แคบกว่า gradient เล็ก ๆ จึง underflow กลายเป็นศูนย์ — คูณ loss ก่อน backward แล้วหารกลับก่อน step ซึ่ง GradScaler จัดการให้และปรับตัวคูณเองเมื่อเจอ inf" },
        { q: "ตอนใช้ทั้ง AMP และ gradient clipping ต้องระวังอะไร",
          a: "ต้องเรียก `scaler.unscale_(opt)` ก่อน clip ไม่งั้นจะไป clip ค่าที่ถูกคูณด้วยตัว scale ทำให้ threshold ผิดไปหลายพันเท่าและ clipping แทบไม่ทำงาน" },
        { q: "validation loss ต่ำกว่า train loss แปลว่าผิดไหม",
          a: "ไม่ผิด และเป็นเรื่องปกติเมื่อใช้ dropout หรือ augmentation แรง ๆ เพราะ train loss วัดตอนที่โมเดลถูกรบกวนอยู่ ส่วน validation วัดตอนที่โมเดลทำงานเต็มกำลัง" },
        { q: "checkpoint ควรเก็บอะไรบ้าง",
          a: "น้ำหนัก, `optimizer.state_dict()` ซึ่งมี m และ v ของ Adam, `scheduler.state_dict()`, epoch และคะแนนที่ดีที่สุด — โหลดแต่น้ำหนักแล้วเทรนต่อจะทำให้ momentum เริ่มใหม่และ loss กระตุกทันที" },
        { q: "เทียบ optimizer สองตัวอย่างยุติธรรมต้องทำยังไง",
          a: "จูน learning rate แยกให้แต่ละตัวก่อน แล้วค่อยเทียบ เพราะช่วง lr ที่เหมาะของ SGD กับ AdamW ต่างกันหลายเท่า การเทียบด้วย lr เดียวกันให้ข้อสรุปที่ผิด" },
        { q: "ลำดับการจูนที่ถูกต้องคืออะไร",
          a: "learning rate ก่อน แล้ว batch size เพราะมันเปลี่ยน lr ที่ได้ผลจริง แล้วความแรงของ regularization เมื่อเห็นช่องว่าง train/val แล้วเท่านั้น ส่วนการเลือก optimizer อยู่ท้าย ๆ เพราะได้เพิ่มน้อยที่สุด" }
      ]},
      { h: "อ่านเพิ่ม" },
      { links: [
        { label: "Adam: A Method for Stochastic Optimization", url: "https://arxiv.org/abs/1412.6980", note: "เปเปอร์ต้นฉบับ พร้อมที่มาของ bias correction และค่า β ที่ทุกคนใช้ตาม" },
        { label: "Decoupled Weight Decay Regularization (AdamW)", url: "https://arxiv.org/abs/1711.05101", note: "แสดงตรง ๆ ว่า L2 ใน Adam ไม่เท่ากับ weight decay และผลที่ต่างกันเป็นยังไง" },
        { label: "Cyclical Learning Rates for Training Neural Networks", url: "https://arxiv.org/abs/1506.01186", note: "ต้นทางของ LR range test และ one-cycle" },
        { label: "Batch Normalization", url: "https://arxiv.org/abs/1502.03167", note: "เปเปอร์ต้นฉบับ รวมถึงกลไก running statistics ที่ใช้ตอน inference" },
        { label: "Layer Normalization", url: "https://arxiv.org/abs/1607.06450", note: "เหตุผลที่ normalize ข้าม feature แทนข้าม batch และทำไมเหมาะกับลำดับ" },
        { label: "Dropout: A Simple Way to Prevent Neural Networks from Overfitting", url: "https://jmlr.org/papers/v15/srivastava14a.html", note: "เปเปอร์ต้นฉบับ รวมถึงการปรับสเกลตอนเทรนกับตอนทดสอบ" },
        { label: "An overview of gradient descent optimization algorithms", url: "https://www.ruder.io/optimizing-gradient-descent/", note: "ไล่ optimizer ทุกตัวต่อกันเป็นลำดับ พร้อมสมการครบ" },
        { label: "PyTorch — Optimization recipes", url: "https://pytorch.org/tutorials/recipes/recipes/tuning_guide.html", note: "คู่มือทางการ ครอบคลุม AMP, accumulation และการตั้งค่าที่ควรใช้" },
        { label: "Accurate, Large Minibatch SGD (linear scaling rule)", url: "https://arxiv.org/abs/1706.02677", note: "ที่มาของกฎสเกลเชิงเส้นและ warmup สำหรับ batch ขนาดใหญ่" }
      ]}
    ]
  }
});

window.TEACHING_EN = window.TEACHING_EN || {};
window.TEACHING_EN["ml_train"] = {
  principle: [
    { h: "Most failures live here, not in the architecture" },
    { p: "**The architecture decides what a network can represent; training decides what it does represent.** A perfectly designed network still fails completely if the learning rate is wrong, and that is the most common failure of all." },
    { h: "The order of importance, stated once and used for the whole page" },
    { code: String.raw`1. learning rate        <- worth more than everything else combined
2. batch size           <- because it changes the effective learning rate
3. regularisation strength  <- only once a train/val gap is visible
4. optimizer            <- AdamW is a good default; the gains beyond it are small
5. everything else`,
      cap: "Tune in this order · an explanation that opens with the choice of optimizer has pointed at the wrong thing in its first sentence", lang: "txt" },
    { h: "How this follows from the previous page" },
    { table: { head: ["Previous page", "This page"], rows: [
      ["You have the gradient of every weight", "**What to do with that gradient to make it count**"],
      ["`w −= η · g`, plainly", "Momentum · per-parameter scaling · decaying η over time"],
      ["You know what overfitting is", "**Fighting it with mechanisms you understand**"],
      ["`model.eval()` must be called", "**Because dropout and batch norm behave differently in training and evaluation**"]
    ]}},
    { h: "The three things that break training, by frequency" },
    { table: { head: ["What happens", "The most common cause"], rows: [
      ["**The loss becomes NaN**", "The learning rate is too high"],
      ["**Train falls, validation does not**", "Overfitting — regularise, do not add layers"],
      ["**Evaluation is far worse than training**", "Forgot `model.eval()` — dropout is still active"]
    ]}},
    { h: "What this page will let you do" },
    { ul: [
      "Explain what failure each of momentum, RMSProp and Adam fixes in the one before it",
      "Know why AdamW is not Adam with L2, and how that difference changes real behaviour",
      "Choose a learning rate by measuring rather than guessing, and know why warmup exists",
      "Know what batch norm does at inference time and why transformers use layer norm instead",
      "Train with a batch larger than GPU memory using gradient accumulation"
    ]}
  ],

  theory: [
    { p: "This section walks the optimizers in order, each one being the answer to what the previous one could not fix." },
    { h: "1) SGD — the baseline" },
    { code: String.raw`w <- w − η g

every parameter shares one η, and nothing is remembered from the previous step`,
      cap: "The simplest of all, and still beats Adam on some vision tasks when properly tuned", lang: "txt" },
    { table: { head: ["SGD's problem", "Shows up when"], rows: [
      ["**Oscillates across a narrow valley**", "One direction is very steep and another very flat"],
      ["**Crawls along the flat direction**", "The gradient is so small the step barely moves"],
      ["**One η is not enough**", "Parameters have gradients differing by orders of magnitude"]
    ]}},
    { h: "2) Momentum — fixing the oscillation and the crawl" },
    { code: String.raw`v <- β v + g          β = 0.9
w <- w − η v

accumulates directions that repeat and cancels directions that keep flipping`,
      cap: "The effect is roughly a 1/(1−β) = 10× speed-up along the flat direction, and damping across the steep one", lang: "txt" },
    { p: "**Nesterov** differs by evaluating the gradient after the momentum step has been taken, so it sees the overshoot coming and brakes in time — a small improvement, and free." },
    { h: "3) RMSProp — fixing the fact that one η is not enough" },
    { code: String.raw`s <- β s + (1−β) g²
w <- w − η g / (√s + ε)

a parameter with consistently large gradients -> divided by a large number -> smaller steps
a parameter with consistently small gradients -> divided by a small number -> larger steps`,
      cap: "The result is that every parameter takes steps of comparable length no matter how their gradients differ", lang: "txt" },
    { h: "4) Adam — putting the two together" },
    { code: String.raw`m <- β₁ m + (1−β₁) g          β₁ = 0.9      direction (momentum)
v <- β₂ v + (1−β₂) g²         β₂ = 0.999    magnitude (RMSProp)

m̂ = m / (1 − β₁ᵗ)                            bias correction
v̂ = v / (1 − β₂ᵗ)

w <- w − η · m̂ / (√v̂ + ε)`,
      cap: "The first two lines are momentum and RMSProp running side by side; the rest corrects the start-up bias", lang: "txt" },
    { h: "5) Why bias correction is needed" },
    { code: String.raw`m and v start at zero, so the first steps are biased toward zero

t = 1     1 − β₂ᵗ = 0.001      -> dividing by 0.001 is a thousandfold correction
t = 10    1 − β₂ᵗ = 0.00996
t = 100   1 − β₂ᵗ = 0.0952
t = 1000  1 − β₂ᵗ = 0.632      -> already almost irrelevant`,
      cap: "It is a first-steps fix rather than a permanent mechanism — without it the model barely moves for the first hundred steps", lang: "txt" },
    { h: "6) AdamW — and why it is not Adam with L2" },
    { code: String.raw`Adam with L2 in the loss:
   g <- g + λw          and then it is divided by √v̂ as well
   -> parameters with large gradients receive LESS decay, unintentionally

AdamW:
   w <- w − η λ w       applied separately, outside the adaptive scaling
   -> every parameter decays equally, as intended`,
      cap: "This is a genuine behavioural difference, not a code reorganisation", lang: "txt" },
    { note: "**Use AdamW with `weight_decay` rather than adding an L2 term to Adam's loss.** And **never decay biases or normalisation parameters** — shrinking them toward zero has no justification and usually makes things worse." },
    { h: "7) The optimizer summary" },
    { table: { head: ["Optimizer", "What it adds", "What it fixes"], rows: [
      ["**SGD**", "`w −= η g`", "The baseline; it fixes nothing"],
      ["**Momentum**", "An accumulated velocity `v`", "Oscillation across valleys · crawling along flat directions"],
      ["**Nesterov**", "Looks at the gradient after the momentum step", "Overshooting at the turn"],
      ["**RMSProp**", "Divides by `√(mean of g²)`", "One η not suiting every parameter"],
      ["**Adam**", "Both, plus bias correction", "Both at once · usable immediately without much tuning"],
      ["**AdamW**", "Decouples weight decay from the scaling", "L2 inside Adam is not real weight decay"]
    ]}},
    { h: "8) Learning rate schedules" },
    { table: { head: ["Type", "What it does", "When"], rows: [
      ["**step**", "Divides by 10 every k epochs", "Easy to reason about, still works well"],
      ["**cosine**", "Decays along a cosine curve to near zero", "**The current standard**"],
      ["**one-cycle**", "Rises then falls, ending very low", "Fast training in few epochs"],
      ["**ReduceLROnPlateau**", "Cuts it when validation stops improving", "When you cannot predict the length of the run"]
    ]}},
    { h: "9) What warmup is for" },
    { p: "**Because in the earliest steps Adam's variance estimate `v` is built from almost no data and cannot be trusted** — a large step decided on that estimate can destroy a good initialisation. Ramping the learning rate up from zero over the first few hundred to few thousand steps costs essentially nothing and prevents it." },
    { note: "**Warmup is effectively mandatory for transformers and for large batches**, while small networks at ordinary batch sizes usually do not need it." },
    { h: "10) The linear scaling rule for batch size" },
    { code: String.raw`multiply the batch size by k -> multiply the learning rate by k

batch 32  lr 1e-3
batch 256 lr 8e-3        (the rule eventually breaks; warmup helps push it further)

why: a larger batch gives a less noisy gradient, so a longer step is safe`,
      cap: "Changing batch size without touching the learning rate means changing two things and measuring neither", lang: "txt" },
    { h: "11) Each regularisation technique and its mechanism" },
    { table: { head: ["Technique", "Mechanism", "Watch out"], rows: [
      ["**weight decay**", "Shrinks the weights toward zero every step", "Never apply it to biases or norm parameters"],
      ["**dropout**", "Randomly zeroes activations while training", "**Behaves differently in training and evaluation**"],
      ["**early stopping**", "Stops at the validation minimum", "Keep the best checkpoint, not the last one"],
      ["**label smoothing**", "A target of 1 becomes 1−ε", "Improves calibration, slightly lowers raw accuracy"],
      ["**augmentation**", "Genuinely more varied data", "**Usually the strongest in this table, and the most under-used**"]
    ]}},
    { h: "12) Inverted dropout — why evaluation needs no adjustment" },
    { code: String.raw`training:    zero a random fraction p, then divide the survivors by (1−p)
             -> the expected activation is unchanged

evaluation:  do nothing at all, use every neuron normally

without the division during training you would have to multiply by (1−p)
at evaluation instead, which is far easier to get wrong`,
      cap: "Every framework uses the inverted form, so `model.eval()` simply switching dropout off is enough", lang: "txt" },
    { h: "13) Batch norm against layer norm" },
    { code: String.raw`BatchNorm:  normalises across the BATCH, per feature
            keeps running mean/var for inference
            -> training and evaluation compute different things
            -> breaks with tiny batches (a batch of 1 has zero variance)

LayerNorm:  normalises across the FEATURES, per example
            -> identical in training and evaluation, independent of batch size
            -> which is exactly why transformers use it`,
      cap: "BatchNorm's train/eval difference is not trivia to memorise — it is why a model can look good in training and fail when served", lang: "txt" },
    { h: "14) Gradient clipping" },
    { code: String.raw`if ‖g‖ > c :   g <- g · c / ‖g‖

it clips the length of the whole gradient, not each entry -> the direction is preserved`,
      cap: "Required for RNNs and helpful for transformers · c = 1.0 is by far the most used value", lang: "txt" }
  ],

  foundations: [
    { p: "This section digs into the mechanics that decide whether training is stable." },
    { h: "The learning rate has a computable ceiling" },
    { code: String.raw`on a quadratic f = ½ L w²  (L = the curvature)

η < 2/L   -> converges
η = 2/L   -> oscillates in place, neither converging nor exploding
η > 2/L   -> explodes`,
      cap: "In a real network L is unknown and changes constantly, which is why the learning rate must be measured rather than derived", lang: "txt" },
    { h: "Watching it explode, with real numbers" },
    { code: String.raw`f = w²  ·  g = 2w  ·  starting at w = 1   (the ceiling is η < 1)

η = 0.1   1 -> 0.8 -> 0.64 -> 0.512 -> 0.4096 -> 0.3277      smooth convergence
η = 0.9   1 -> −0.8 -> 0.64 -> −0.512 -> 0.4096 -> −0.3277   oscillates but converges
η = 1.1   1 -> −1.2 -> 1.44 -> −1.728 -> 2.0736 -> −2.4883   explodes`,
      cap: "The middle row is the familiar \"loss spikes and recovers\" symptom, meaning the learning rate is near its ceiling", lang: "txt" },
    { h: "How much momentum actually helps" },
    { code: String.raw`the flat direction: f = ½(0.1)w²  ·  g = 0.1w  ·  w₀ = 1  ·  η = 0.1

step        SGD       Momentum(β=0.9)
   1       0.9900        0.9900
   2       0.9801        0.9711
   3       0.9703        0.9444
   5       0.9510        0.8716
  10       0.9044        0.6211
  20       0.8179        0.1178`,
      cap: "SGD covers 18% in 20 steps and momentum covers 88% — that is 1/(1−β) made visible", lang: "txt" },
    { h: "How Adam scales per parameter" },
    { code: String.raw`two parameters with constant gradients differing by 10,000×: g = 0.01 and g = 100
η = 0.01

SGD:   the first moves 0.0001 per step      the second moves 1.0 per step
       1.000000 -> 0.999900                  1.0 -> 0.0 -> −1.0 -> −2.0   it flies past

Adam:  both move exactly 0.01 per step
       1.00 -> 0.99 -> 0.98 -> 0.97          both of them`,
      cap: "Because `g/√(g²)` is always 1 whatever g is, the step size stays approximately η throughout", lang: "txt" },
    { note: "**This is both Adam's strength and its weakness** — it is remarkably tolerant of a badly chosen learning rate, but it discards the information carried by gradient magnitude, which is why a well-tuned SGD still beats Adam on some vision tasks." },
    { h: "What weight decay actually does to the weights" },
    { code: String.raw`w <- w − η λ w = w(1 − ηλ)

η = 1e-3 · λ = 0.01 -> multiply by 0.99999 every step
100,000 steps of training -> 0.99999¹⁰⁰⁰⁰⁰ ≈ 0.37

a weight with no gradient pushing back shrinks to about 37% of its value`,
      cap: "So it is a constant pressure that the gradient must fight, not an act of deletion", lang: "txt" },
    { h: "What batch norm uses at inference" },
    { code: String.raw`training:    uses the current batch's mean and variance
             while updating the running statistics with momentum (typically 0.1)

             running_mean <- 0.9 · running_mean + 0.1 · batch_mean

evaluation:  uses the accumulated running statistics, not the batch's`,
      cap: "Forget `model.eval()` and it reverts to the statistics of whatever batch you are measuring, so the result depends on what happens to be in it", lang: "txt" },
    { p: "**And if the batch is very small during training, the accumulated statistics are noisy**, which is why batch norm is a poor fit for tasks forced into small batches such as high-resolution detection — those use group norm or layer norm instead." },
    { h: "Gradient accumulation — a large batch on a small GPU" },
    { code: String.raw`you want batch 256 but memory only holds 64

run backward 4 times without stepping, then step once
and **the loss must be divided by 4**, or the summed gradient is 4× larger
= the effective learning rate is silently multiplied by 4`,
      cap: "That last line is this technique's most common bug, and it raises no error", lang: "txt" },
    { h: "Mixed precision needs loss scaling" },
    { code: String.raw`fp16 covers a far narrower range than fp32
so small gradients underflow to zero when they should not

the fix: multiply the loss by a large number before backward
         and divide it back out before the step
         -> GradScaler does this automatically and adapts the factor when it sees inf`,
      cap: "It halves memory and is much faster on modern GPUs, but without the scaler the model learns nothing at all", lang: "txt" }
  ],

  architecture: [
    { p: "This section is the decision order and the experimental structure that makes results believable." },
    { h: "Find the learning rate by measuring it" },
    { code: String.raw`LR range test:
   start at 1e-7 and multiply it up every batch until you reach 1
   plot loss against learning rate

   where the loss starts falling fast   -> the bottom of the usable range
   where the loss is lowest             -> do NOT use this, it is too near the ceiling
   pick about a tenth of where the loss starts shooting up`,
      cap: "It takes a few minutes and replaces guessing entirely", lang: "txt" },
    { h: "Defaults you can use immediately" },
    { table: { head: ["Setting", "Value", "Note"], rows: [
      ["optimizer", "**AdamW**", "`weight_decay = 0.01`"],
      ["learning rate", "**3e-4** for transformers · **1e-3** for small networks", "Then refine with an LR range test"],
      ["schedule", "**cosine down to near zero**", "With warmup over 5% of total steps"],
      ["batch size", "**32-128**", "The largest that fits memory, then adjust the lr to match"],
      ["gradient clipping", "**1.0**", "Required for RNNs · helpful for transformers"],
      ["dropout", "**0.1**", "Transformers · small networks may want up to 0.3"]
    ]}},
    { h: "An experiment order you can trust" },
    { code: String.raw`1. make it overfit 10 rows                  <- proves the code is right (previous page)
2. train the full set with defaults, plot train and val
3. run an LR range test and set the learning rate
4. add the schedule (cosine + warmup)
5. only once a train/val gap appears, add regularisation
6. enlarge the architecture last of all`,
      cap: "Never change two things at once, or you will not know which one helped or hurt", lang: "txt" },
    { h: "What the loss curves are telling you" },
    { table: { head: ["Curve shape", "Means", "Do next"], rows: [
      ["Both flatten together, high", "**Underfitting**", "Train longer · add capacity · try a higher lr"],
      ["Train keeps falling, val starts rising", "**Overfitting**", "Stop at the val minimum · add regularisation"],
      ["Loss spikes hard at intervals", "**The lr is near its ceiling**", "Lower it · add warmup · clip gradients"],
      ["Loss is flat from step one", "**Nothing is being learned**", "Check `zero_grad` · lr far too small · unscaled inputs"],
      ["Validation below training", "**Normal when using dropout**", "Training is measured while the model is being disturbed"]
    ]}},
    { note: "**That last row alarms people regularly** — a validation loss slightly below the training loss is normal with dropout or strong augmentation, because the training loss is measured while the model is being perturbed while validation is measured at full strength." },
    { h: "Making results reproducible" },
    { code: String.raw`all of these, not just one:
   random.seed · numpy seed · torch.manual_seed · cuda seed
   the DataLoader worker seed
   torch.use_deterministic_algorithms(True)

and accept that: some GPU kernels are non-deterministic by nature
                 forcing determinism can be noticeably slower`,
      cap: "Reporting a result from one seed without a deviation is reporting something that cannot be trusted", lang: "txt" },
    { h: "What a checkpoint should contain" },
    { code: String.raw`everything needed to resume, not just the weights:
   model.state_dict()
   optimizer.state_dict()        <- Adam's m and v live here
   scheduler.state_dict()
   epoch · best_val · seed`,
      cap: "Resuming from a weights-only checkpoint restarts momentum from scratch, which makes the loss jump immediately", lang: "txt" }
  ],

  dataflow: [
    { p: "Real numbers for the three things people misunderstand most: step size, momentum, and Adam." },
    { h: "The problem being walked" },
    { code: String.raw`f(w) = w²      g = 2w      starting at w = 1

the minimum is at w = 0 and the learning rate ceiling is η < 1`,
      cap: "Simple enough to compute every step by hand, and it behaves like one direction of a real network", lang: "txt" },
    { h: "A learning rate that fits" },
    { code: String.raw`η = 0.1   ->  w <- w − 0.1(2w) = 0.8w

k=1  0.8000     f = 0.6400
k=2  0.6400     f = 0.4096
k=3  0.5120     f = 0.2621
k=4  0.4096     f = 0.1678
k=5  0.3277     f = 0.1074`,
      cap: "A smooth geometric decay with no oscillation — a loss curve that looks like this is on the right track", lang: "txt" },
    { h: "A learning rate slightly too high" },
    { code: String.raw`η = 0.9   ->  w <- w − 0.9(2w) = −0.8w

k=1  −0.8000    f = 0.6400
k=2   0.6400    f = 0.4096
k=3  −0.5120    f = 0.2621
k=4   0.4096    f = 0.1678

still converging, but jumping over the minimum every single step`,
      cap: "The loss falls just the same, but the sign flips every step — in a real network this is the spiky loss curve", lang: "txt" },
    { h: "A learning rate past the ceiling" },
    { code: String.raw`η = 1.1   ->  w <- w − 1.1(2w) = −1.2w

k=1  −1.2000    f = 1.4400
k=2   1.4400    f = 2.0736
k=3  −1.7280    f = 2.9860
k=4   2.0736    f = 4.2998
k=5  −2.4883    f = 6.1917`,
      cap: "Ten percent over the ceiling is enough to explode, and in a real network it becomes NaN within a few dozen steps", lang: "txt" },
    { note: "**These three blocks are the whole argument for \"the learning rate matters most\"** — 0.1 against 1.1, a factor of ten, is the entire difference between smooth convergence and detonation." },
    { h: "Momentum along the flat direction" },
    { code: String.raw`the small-gradient direction: f = ½(0.1)w²  ·  g = 0.1w  ·  η = 0.1

SGD:        w <- w(1 − 0.01) = 0.99w        1% per step
Momentum:   v <- 0.9v + g   then  w <- w − 0.1v

step        SGD        Momentum
   1       0.9900       0.9900        identical, v has not built up yet
   2       0.9801       0.9711
   3       0.9703       0.9444
   5       0.9510       0.8716
  10       0.9044       0.6211
  20       0.8179       0.1178`,
      cap: "In 20 steps SGD covers 18% and momentum covers 88%, at exactly the same learning rate", lang: "txt" },
    { h: "Why momentum accelerates by that much" },
    { code: String.raw`if g is constant, v converges to g/(1−β)

β = 0.9   ->  v -> 10g       steps ten times longer
β = 0.99  ->  v -> 100g      but slow to respond when the gradient turns`,
      cap: "So it trades speed along a consistent direction against responsiveness when the landscape changes", lang: "txt" },
    { h: "How Adam equalises the steps" },
    { code: String.raw`two parameters with constant gradients differing by 10,000×: g = 0.01 and g = 100
η = 0.01

SGD:
   the first    1.000000 -> 0.999900 -> 0.999800     1e-4 per step
   the second   1.0 -> 0.0 -> −1.0 -> −2.0            1.0 per step, straight past

Adam:
   the first    1.00 -> 0.99 -> 0.98 -> 0.97
   the second   1.00 -> 0.99 -> 0.98 -> 0.97          exactly the same`,
      cap: "Because m̂/√v̂ always has magnitude around 1, the step size stays roughly η however large the gradient is", lang: "txt" },
    { h: "Bias correction on the first step" },
    { code: String.raw`step 1 with g = 100:
   m = 0.1 × 100 = 10          v = 0.001 × 10000 = 10
   without correction:  10/√10 = 3.16      <- a step three times larger than it should be

   with correction:  m̂ = 10/0.1 = 100     v̂ = 10/0.001 = 10000
                     100/√10000 = 1.0      <- magnitude 1, as intended`,
      cap: "In the first steps, skipping it makes the step size wrong by a factor of several, and in the opposite direction to what many people assume", lang: "txt" },
    { h: "Dropout in training and evaluation, numerically" },
    { code: String.raw`activations = [2.0, 4.0, 6.0, 8.0]   ·   p = 0.5

training, suppose entries 1 and 3 are dropped:
   [0, 4.0, 0, 8.0] then divided by (1−0.5) = [0, 8.0, 0, 16.0]
   sum = 24.0

evaluation:
   [2.0, 4.0, 6.0, 8.0]   sum = 20.0

expected sum during training = 0.5 × (2+4+6+8) × 2 = 20.0   <- matches evaluation`,
      cap: "Dividing by (1−p) is what makes the expectations match, so nothing needs adjusting at evaluation time", lang: "txt" }
  ],

  implementation: [
    { p: "Code for everything on this page, with the places people get it wrong." },
    { h: "1) AdamW that does not decay biases and norms" },
    { code: String.raw`import torch

decay, no_decay = [], []
for name, p in model.named_parameters():
    if not p.requires_grad:
        continue
    if p.ndim == 1 or name.endswith(".bias"):   # biases + LayerNorm/BatchNorm
        no_decay.append(p)
    else:
        decay.append(p)

opt = torch.optim.AdamW([
    {"params": decay,    "weight_decay": 0.01},
    {"params": no_decay, "weight_decay": 0.0},
], lr=3e-4)`,
      cap: "`p.ndim == 1` catches biases and norm parameters in one line, because both are vectors", lang: "python" },
    { h: "2) A cosine schedule with warmup" },
    { code: String.raw`from torch.optim.lr_scheduler import LambdaLR
import math

def cosine_with_warmup(opt, warmup_steps, total_steps):
    def fn(step):
        if step < warmup_steps:
            return step / max(1, warmup_steps)
        progress = (step - warmup_steps) / max(1, total_steps - warmup_steps)
        return 0.5 * (1.0 + math.cos(math.pi * progress))
    return LambdaLR(opt, fn)

total = len(train_loader) * epochs
sched = cosine_with_warmup(opt, warmup_steps=int(0.05 * total), total_steps=total)`,
      cap: "**Call `sched.step()` every batch, not every epoch**, when the schedule counts in steps like this one", lang: "python" },
    { h: "3) A training loop with every piece present" },
    { code: String.raw`for epoch in range(epochs):
    model.train()
    for xb, yb in train_loader:
        opt.zero_grad(set_to_none=True)
        loss = loss_fn(model(xb), yb)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        opt.step()
        sched.step()

    model.eval()
    with torch.no_grad():
        val = sum(loss_fn(model(xb), yb).item() for xb, yb in val_loader) / len(val_loader)
    print(f"epoch {epoch}  lr {sched.get_last_lr()[0]:.2e}  val {val:.4f}")`,
      cap: "`set_to_none=True` is faster and helps catch a missing backward, since the gradient stays None rather than zero", lang: "python" },
    { h: "4) The LR range test" },
    { code: String.raw`import copy, math

def lr_finder(model, opt, loader, loss_fn, lo=1e-7, hi=1.0, steps=100):
    state = copy.deepcopy(model.state_dict())
    mult = (hi / lo) ** (1 / steps)
    lr, out = lo, []
    it = iter(loader)
    for _ in range(steps):
        try:    xb, yb = next(it)
        except StopIteration:
            it = iter(loader); xb, yb = next(it)
        for g in opt.param_groups:
            g["lr"] = lr
        opt.zero_grad(set_to_none=True)
        loss = loss_fn(model(xb), yb)
        loss.backward(); opt.step()
        out.append((lr, loss.item()))
        if not math.isfinite(loss.item()) or loss.item() > 4 * out[0][1]:
            break
        lr *= mult
    model.load_state_dict(state)          # always restore the original weights
    return out`,
      cap: "Pick roughly a tenth of where the loss starts shooting up, not the point where the loss is lowest", lang: "python" },
    { h: "5) Early stopping that keeps the best model" },
    { code: String.raw`best, patience, wait = float("inf"), 10, 0
for epoch in range(epochs):
    train_one_epoch()
    val = evaluate()
    if val < best - 1e-4:
        best, wait = val, 0
        torch.save({
            "model": model.state_dict(),
            "opt": opt.state_dict(),
            "sched": sched.state_dict(),
            "epoch": epoch, "best_val": best,
        }, "best.pt")
    else:
        wait += 1
        if wait >= patience:
            print(f"stopped at epoch {epoch} · best {best:.4f}")
            break`,
      cap: "Save the optimizer and scheduler too, or resuming from the checkpoint restarts momentum from nothing", lang: "python" },
    { h: "6) Mixed precision" },
    { code: String.raw`scaler = torch.cuda.amp.GradScaler()

for xb, yb in train_loader:
    opt.zero_grad(set_to_none=True)
    with torch.cuda.amp.autocast():
        loss = loss_fn(model(xb), yb)
    scaler.scale(loss).backward()
    scaler.unscale_(opt)                       # must unscale before clipping
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    scaler.step(opt)
    scaler.update()`,
      cap: "**Forget `unscale_` before clipping and you clip the scaled values, putting the threshold off by thousands**", lang: "python" },
    { h: "7) Gradient accumulation" },
    { code: String.raw`accum = 4                       # real batch 64 -> equivalent to 256

opt.zero_grad(set_to_none=True)
for i, (xb, yb) in enumerate(train_loader):
    loss = loss_fn(model(xb), yb) / accum      # <- divide here, never forget it
    loss.backward()
    if (i + 1) % accum == 0:
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        opt.step()
        sched.step()
        opt.zero_grad(set_to_none=True)`,
      cap: "Forget the `/ accum` and the summed gradient is 4× larger, which multiplies the effective learning rate by 4 with no error raised", lang: "python" },
    { h: "8) Seeding everything" },
    { code: String.raw`import random, numpy as np, torch

def set_seed(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False     # benchmark makes results vary

def worker_init(worker_id):
    np.random.seed(torch.initial_seed() % 2**32 + worker_id)

loader = DataLoader(ds, batch_size=64, shuffle=True,
                    num_workers=4, worker_init_fn=worker_init)`,
      cap: "Without `worker_init_fn`, augmentation in each worker either repeats identically or differs between runs", lang: "python" },
    { h: "9) Look at the learning rate the run will actually use" },
    { code: String.raw`lrs = []
for step in range(total):
    lrs.append(sched.get_last_lr()[0])
    opt.step(); sched.step()

# plotting it must show three clear phases:
#   a straight ramp up          (warmup)
#   a brief peak
#   a cosine decay to near zero`,
      cap: "Plot it once before the real run — a schedule set in the wrong unit (epochs against steps) is obvious from the shape", lang: "python" },
    { h: "10) Comparing optimizers fairly" },
    { code: String.raw`results = {}
for name, make in {
    "sgd":       lambda p: torch.optim.SGD(p, lr=1e-2, momentum=0.9),
    "adam":      lambda p: torch.optim.Adam(p, lr=1e-3),
    "adamw":     lambda p: torch.optim.AdamW(p, lr=1e-3, weight_decay=0.01),
}.items():
    set_seed(42)
    model = build_model()               # a fresh model each time, from the same seed
    results[name] = train(model, make(model.parameters()), epochs=20)

for k, v in results.items():
    print(f"{k:6s} best val {min(v):.4f}")`,
      cap: "**Each optimizer needs its own tuned learning rate** — comparing them at one shared lr is unfair and gives the wrong conclusion", lang: "python" }
  ],

  tricks: [
    { h: "Diagnosing by symptom" },
    { table: { head: ["Symptom", "Cause", "Fix"], rows: [
      ["The loss becomes **NaN**", "lr too high · `log(0)` · fp16 without a scaler", "Cut the lr tenfold · use a logit-based loss · add GradScaler"],
      ["The loss spikes hard at intervals then recovers", "The lr is near its ceiling", "Lower it · add warmup · clip gradients at 1.0"],
      ["The loss is flat from the first step", "Missing `zero_grad` · lr too small · unscaled inputs", "Overfit 10 rows to isolate it"],
      ["Train falls, validation rises", "Overfitting", "Add regularisation or data, **not layers**"],
      ["Eval far worse than train at the same step", "Forgot `model.eval()`", "Dropout and batch norm are still in training mode"],
      ["Results change between runs", "Incomplete seeding · `cudnn.benchmark` on", "Seed everything, including the DataLoader workers"],
      ["The loss jumps after resuming a checkpoint", "Loaded weights but not the optimizer", "Save and load `optimizer.state_dict()` too"],
      ["Changing batch size made things worse", "The learning rate was not adjusted", "Apply the linear scaling rule and add warmup"],
      ["fp16 and the model learns nothing", "Gradient underflow", "GradScaler is always required"],
      ["Gradient accumulation gives odd results", "Forgot to divide the loss by the accumulation count", "`loss = loss / accum`"]
    ]}},
    { h: "Choosing an optimizer, briefly" },
    { table: { head: ["Task", "Use"], rows: [
      ["General, no idea where to start", "**AdamW** at 1e-3 or 3e-4"],
      ["Transformers or NLP", "**AdamW + warmup + cosine**, almost without exception"],
      ["Vision, with the budget to tune properly", "**SGD + momentum 0.9** often edges out AdamW, but needs more tuning"],
      ["Sparse data (embeddings)", "**Adam or Adagrad**, for the per-parameter scaling"]
    ]}},
    { h: "The quietest bugs on this page" },
    { ul: [
      "**Adding L2 to the loss while using Adam** and believing it equals weight decay — it does not; use AdamW",
      "**Decaying biases and norm parameters** by handing `weight_decay` to every parameter at once",
      "**Calling `sched.step()` per epoch** when the schedule counts steps — the learning rate then decays dozens of times slower than intended",
      "**Forgetting to divide the loss during gradient accumulation**, multiplying the real learning rate by the accumulation count",
      "**Clipping before `unscale_`** under mixed precision, putting the threshold off by thousands",
      "**Comparing optimizers at one shared learning rate** and drawing a conclusion from it"
    ]},
    { h: "Numbers worth remembering" },
    { table: { head: ["Setting", "Value", "Where it comes from"], rows: [
      ["Adam's β₁ · β₂", "0.9 · 0.999", "From the original paper; almost nobody changes them"],
      ["SGD momentum", "0.9", "About a 10× acceleration along a consistent direction"],
      ["AdamW weight decay", "0.01 - 0.1", "Vision typically uses more than NLP"],
      ["Gradient clipping", "1.0", "By far the most common value"],
      ["Warmup", "5% of total steps", "Or 500-2000 steps on large runs"],
      ["Transformer learning rate", "1e-4 to 5e-4", "3e-4 is the most popular starting point"]
    ]}},
    { note: "**If only one sentence survives from this page**: the learning rate matters more than everything else combined, and an LR range test finds it by measurement in a few minutes — there is no longer any reason to guess it." }
  ],

  eval: [
    { p: "The questions that separate knowing what each knob does from copying values out of an example." },
    { qa: [
      { q: "What matters most in training, and why?",
        a: "The learning rate, because it has a ceiling that detonates the moment you cross it — on `f=w²` the move from 0.9 to 1.1 turns convergence into explosion, and in a real network that means NaN within a few dozen steps." },
      { q: "What does momentum fix, and how much does it accelerate?",
        a: "It fixes oscillation across narrow valleys and the crawl along flat directions by accumulating repeated directions. With a constant gradient, `v` converges to `g/(1−β)`, which at β=0.9 is roughly a tenfold acceleration." },
      { q: "What does RMSProp fix that momentum cannot?",
        a: "The fact that one learning rate cannot suit parameters whose gradients differ by orders of magnitude. Dividing by `√(mean of g²)` makes every parameter take steps of comparable length." },
      { q: "What is Adam, in one sentence?",
        a: "Momentum and RMSProp running together, plus bias correction for the earliest steps." },
      { q: "What is Adam's bias correction for, and when does it matter?",
        a: "`m` and `v` start at zero and are therefore biased toward zero early on — at t=1 the divisor `1−β₂ᵗ` is 0.001, a thousandfold correction, while by t=1000 it is 0.632 and nearly irrelevant. It is a start-up fix, not a permanent mechanism." },
      { q: "How does AdamW differ from Adam with L2?",
        a: "L2 is added into the gradient and then also divided by `√v̂`, so parameters with large gradients unintentionally receive less decay. AdamW applies `w ← w − ηλw` separately, outside the adaptive scaling, so every parameter decays equally as intended." },
      { q: "Which parameters must never receive weight decay?",
        a: "Biases and normalisation parameters, because shrinking them toward zero has no justification and usually hurts — they are easy to separate with `p.ndim == 1`." },
      { q: "What is warmup for?",
        a: "In the earliest steps Adam's variance estimate is built from almost no data and cannot be trusted, and a large step decided on it can destroy the initialisation. Ramping the learning rate up early costs almost nothing and prevents that." },
      { q: "When you change the batch size, what must happen to the learning rate?",
        a: "Apply the linear scaling rule: multiply the batch by k and the learning rate by k, because a larger batch's gradient is less noisy and a longer step is safe — changing the batch without touching the lr changes two things at once." },
      { q: "How do you find a good learning rate without guessing?",
        a: "An LR range test — ramp the lr from 1e-7 upward every batch and plot loss against lr, then take about a tenth of where the loss starts shooting up, not the point of lowest loss, which sits too close to the ceiling." },
      { q: "What is inverted dropout, and why does evaluation need no adjustment?",
        a: "During training the surviving activations are divided by `(1−p)` so the expected value matches the undropped case, which means evaluation can use every neuron directly with no rescaling — every framework works this way." },
      { q: "What does batch norm use at inference time?",
        a: "The running mean and variance accumulated during training, not the current batch's statistics. Forget `model.eval()` and it reverts to the batch being measured, so the result depends on what happens to be in that batch." },
      { q: "Why do transformers use layer norm rather than batch norm?",
        a: "Layer norm normalises across each example's features, so it is identical in training and evaluation and independent of batch size, whereas batch norm breaks at small batch sizes and behaves differently in the two modes." },
      { q: "What does gradient clipping do, and which form should be used?",
        a: "It clips by the norm of the whole gradient, `g ← g·c/‖g‖` when `‖g‖ > c`, which preserves the direction — unlike clipping each entry, which distorts it. c=1.0 is the most used value." },
      { q: "How does gradient accumulation work, and what is the common bug?",
        a: "Run backward several times without stepping, then step once. The common bug is forgetting to divide the loss by the accumulation count, which makes the summed gradient proportionally larger — equivalent to multiplying the learning rate, with no error raised." },
      { q: "Why does mixed precision need loss scaling?",
        a: "fp16 covers a narrower range, so small gradients underflow to zero. Multiplying the loss before backward and dividing it back before the step prevents that, and GradScaler handles it while adapting the factor when it encounters inf." },
      { q: "What must you be careful about when combining AMP with gradient clipping?",
        a: "Call `scaler.unscale_(opt)` before clipping, otherwise you clip values that are still multiplied by the scale factor, putting the threshold off by thousands and effectively disabling the clipping." },
      { q: "Is it wrong if validation loss is below training loss?",
        a: "No, and it is normal with dropout or strong augmentation, because the training loss is measured while the model is being perturbed while validation is measured with the model at full strength." },
      { q: "What should a checkpoint contain?",
        a: "The weights, `optimizer.state_dict()` which holds Adam's m and v, `scheduler.state_dict()`, the epoch and the best score — resuming from weights alone restarts momentum and makes the loss jump immediately." },
      { q: "How do you compare two optimizers fairly?",
        a: "Tune a learning rate for each one separately before comparing, because the workable range for SGD and for AdamW differ by a large factor and a shared lr produces a wrong conclusion." },
      { q: "What is the correct tuning order?",
        a: "Learning rate first, then batch size because it changes the effective learning rate, then regularisation strength once a train/val gap is visible. The choice of optimizer comes near the end, because it gains the least." }
    ]},
    { h: "Further reading" },
    { links: [
      { label: "Adam: A Method for Stochastic Optimization", url: "https://arxiv.org/abs/1412.6980", note: "The original paper, with the derivation of bias correction and the β values everyone still uses" },
      { label: "Decoupled Weight Decay Regularization (AdamW)", url: "https://arxiv.org/abs/1711.05101", note: "Shows directly that L2 inside Adam is not weight decay, and how the results differ" },
      { label: "Cyclical Learning Rates for Training Neural Networks", url: "https://arxiv.org/abs/1506.01186", note: "The origin of the LR range test and one-cycle" },
      { label: "Batch Normalization", url: "https://arxiv.org/abs/1502.03167", note: "The original paper, including the running-statistics mechanism used at inference" },
      { label: "Layer Normalization", url: "https://arxiv.org/abs/1607.06450", note: "Why normalising across features rather than the batch suits sequences" },
      { label: "Dropout: A Simple Way to Prevent Neural Networks from Overfitting", url: "https://jmlr.org/papers/v15/srivastava14a.html", note: "The original paper, including the train-time and test-time rescaling" },
      { label: "An overview of gradient descent optimization algorithms", url: "https://www.ruder.io/optimizing-gradient-descent/", note: "Every optimizer in sequence with the full equations" },
      { label: "PyTorch — Optimization recipes", url: "https://pytorch.org/tutorials/recipes/recipes/tuning_guide.html", note: "The official guide, covering AMP, accumulation and the settings worth using" },
      { label: "Accurate, Large Minibatch SGD (the linear scaling rule)", url: "https://arxiv.org/abs/1706.02677", note: "Where the linear scaling rule and large-batch warmup come from" }
    ]}
  ]
};
