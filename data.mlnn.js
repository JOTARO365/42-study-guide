/* Neural networks — from one neuron to a trained multilayer network */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

window.TEACHING_DATA.push({
  id: "ml_nn",
  name: "Neural Network — จากนิวรอนเดียวถึงเครือข่ายหลายชั้น",
  nameEn: "Neural Networks — From One Neuron to a Trained Multilayer Network",
  titleShort: { th: "Neural Network", en: "Neural Networks" },
  tag: {
    th: "นิวรอนคือโมเดลเชิงเส้นที่ต่อ activation, ชั้นคือการคูณเมทริกซ์, และ backpropagation คือ chain rule ที่เดินย้อนกลับ — พร้อมเหตุผลว่าทำไมขาด activation แล้วความลึกหายไปทั้งหมด",
    en: "A neuron is a linear model with an activation on the end, a layer is a matrix multiply, and backpropagation is the chain rule walked backwards — with the reason that removing the activation destroys depth entirely"
  },
  accent: "#a78bfa",
  sections: {
    principle: [
      { h: "ประโยคเดียวที่อธิบายทั้งหมด" },
      { p: "**neural network คือโมเดลเชิงเส้นหลายตัวซ้อนกัน โดยมีฟังก์ชันไม่เชิงเส้นคั่นระหว่างทุกคู่** — ทุกอย่างที่เหลือ ทั้ง activation, การตั้งค่าน้ำหนักเริ่มต้น, และความลึก มีอยู่เพื่อทำให้กองนี้เทรนได้" },
      { h: "ทำไม activation ถึงไม่ใช่ของตกแต่ง" },
      { code: String.raw`ถ้าไม่มี activation คั่น:

W₂(W₁x + b₁) + b₂ = (W₂W₁)x + (W₂b₁ + b₂)
                  = W'x + b'

ชั้นเชิงเส้นร้อยชั้น = ชั้นเชิงเส้นชั้นเดียว`,
        cap: "ไม่ใช่ว่าประสิทธิภาพลดลง แต่ความลึกไม่มีอยู่จริงเลย", lang: "txt" },
      { note: "**ถ้าใครอธิบายว่า activation มีไว้ 'เพิ่มความยืดหยุ่น' แปลว่ายังไม่เข้าใจจุดสำคัญ** — มันคือสิ่งเดียวที่ทำให้การซ้อนชั้นมีความหมาย ถ้าถอดออก โมเดลทั้งก้อนยุบเหลือ logistic regression ตัวเดียว" },
      { h: "ต่อจากหน้าก่อนอย่างไร" },
      { table: { head: ["หน้าก่อน", "หน้านี้"], rows: [
        ["logistic regression = `σ(wᵀx + b)`", "**นั่นคือนิวรอนหนึ่งตัวพอดี**"],
        ["ขอบเขตตัดสินใจเป็นเส้นตรงเสมอ", "ซ้อนชั้นแล้วขอบเขตโค้งได้ตามต้องการ"],
        ["gradient คือ `Xᵀ(ŷ − y)`", "**รูปเดิมเป๊ะ** แต่ต้องส่งย้อนผ่านหลายชั้น"],
        ["จูนสัมประสิทธิ์ไม่กี่ตัว", "จูนน้ำหนักหลักหมื่นถึงหลักพันล้าน"]
      ]}},
      { h: "คำศัพท์ที่ห้ามใช้ปนกัน" },
      { table: { head: ["คำ", "หมายถึง"], rows: [
        ["**นิวรอน**", "`a = φ(wᵀx + b)` โมเดลเชิงเส้นหนึ่งตัวที่ต่อ activation"],
        ["**ชั้น (layer)**", "นิวรอนหลายตัวที่รับ input ชุดเดียวกัน: `a = φ(Wx + b)`"],
        ["**forward pass**", "จาก input ถึงคำทำนาย คูณเมทริกซ์หนึ่งครั้งต่อชั้น"],
        ["**backward pass**", "คำนวณ `∂L/∂W` ของทุกชั้นด้วย chain rule ย้อนกลับ"],
        ["**epoch**", "เดินครบชุดข้อมูลเทรนหนึ่งรอบ"],
        ["**batch**", "จำนวนตัวอย่างที่เฉลี่ย gradient ก่อนอัปเดตหนึ่งครั้ง"]
      ]}},
      { note: "**epoch ไม่ใช่การอัปเดตหนึ่งครั้ง และ batch ไม่ใช่ชั้น** — ถ้าปนกันตั้งแต่ต้น เรื่อง learning rate กับ batch size ในหน้าถัดไปจะอ่านไม่รู้เรื่องทั้งหมด" },
      { h: "หน้านี้จะทำให้ทำได้" },
      { ul: [
        "เดิน forward กับ backward ด้วยมือบนเครือข่ายเล็ก แล้วตรวจกับ finite difference ได้",
        "รู้ว่าทำไม sigmoid ทำให้เครือข่ายลึกเทรนไม่ได้ และ ReLU แก้ยังไง",
        "รู้ว่าทำไมตั้งน้ำหนักเริ่มต้นเป็นศูนย์แล้วเครือข่ายพังถาวร ไม่ใช่แค่ช้า",
        "เลือก activation ของชั้น output กับ loss ให้เข้าคู่กันตามงาน",
        "นับจำนวนพารามิเตอร์ของทุกชั้นได้ และอ่าน error เรื่อง shape ออก"
      ]}
    ],

    theory: [
      { p: "หมวดนี้ประกอบเครือข่ายทีละชิ้น โดยแต่ละชิ้นมาพร้อมปัญหาที่มันแก้" },
      { h: "1) นิวรอนหนึ่งตัว" },
      { code: String.raw`z = w₁x₁ + w₂x₂ + ... + w_d x_d + b     ผลรวมเชิงเส้น
a = φ(z)                                 ผ่าน activation

ถ้า φ = sigmoid  → นี่คือ logistic regression ตัวเดียวเป๊ะ`,
        cap: "ไม่มีอะไรใหม่เลยในนิวรอนหนึ่งตัว — ความสามารถทั้งหมดมาจากการซ้อนกัน", lang: "txt" },
      { h: "2) ชั้นหนึ่งชั้น" },
      { code: String.raw`นิวรอน h ตัวที่รับ input เดียวกัน เขียนรวบเป็นเมทริกซ์ครั้งเดียว:

X   (N, d_in)      N ตัวอย่าง
W   (d_in, h)
b   (h,)

Z = X W + b        (N, h)
A = φ(Z)           (N, h)`,
        cap: "หนึ่งชั้น = คูณเมทริกซ์หนึ่งครั้ง บวก bias หนึ่งครั้ง ผ่าน activation หนึ่งครั้ง", lang: "txt" },
      { code: String.raw`จำนวนพารามิเตอร์ของชั้น dense = d_in · d_out + d_out
                                    ‾‾‾‾‾‾‾‾‾   ‾‾‾‾‾
                                    น้ำหนัก      bias

784 → 128 : 784·128 + 128 = 100,480
128 → 10  : 128·10 + 10   = 1,290
รวม                          101,770`,
        cap: "นับได้เองเสมอ และควรตรงกับที่ framework รายงาน ถ้าไม่ตรงแปลว่าเข้าใจโครงสร้างผิด", lang: "txt" },
      { h: "3) activation แต่ละตัวกับปัญหาที่มันแก้" },
      { table: { head: ["ตัว", "ช่วงค่า", "อนุพันธ์", "แก้อะไร / พังตรงไหน"], rows: [
        ["**sigmoid**", "(0,1)", "สูงสุด 0.25", "อิ่มตัวทั้งสองด้าน · **ลึกแล้ว gradient หายเพราะคูณกัน**"],
        ["**tanh**", "(−1,1)", "สูงสุด 1.0", "ศูนย์กลางที่ 0 จึงดีกว่า sigmoid แต่ยังอิ่มตัว"],
        ["**ReLU**", "[0,∞)", "1 หรือ 0", "ไม่หด gradient ฝั่งบวก · แต่ **นิวรอนตายถาวรได้**"],
        ["**leaky ReLU**", "ℝ", "1 หรือ 0.01", "แก้นิวรอนตายโดยตรง"],
        ["**GELU**", "ℝ", "เรียบทุกจุด", "ที่ transformer ใช้ · เรียบกว่า ReLU"],
        ["**softmax**", "รวมได้ 1", "—", "**ชั้น output เท่านั้น** สำหรับคลาสที่เลือกได้ตัวเดียว"]
      ]}},
      { code: String.raw`sigmoid:  σ(z) = 1/(1+e⁻ᶻ)       σ'(z) = σ(z)(1−σ(z))
tanh:     tanh(z)                 1 − tanh²(z)
ReLU:     max(0, z)               1 ถ้า z>0 · 0 ถ้า z<0
leaky:    max(0.01z, z)           1 ถ้า z>0 · 0.01 ถ้า z<0`,
        cap: "อนุพันธ์คือสิ่งเดียวที่ backpropagation ต้องใช้ จึงเป็นตัวตัดสินว่า activation ตัวไหนใช้ได้จริง", lang: "txt" },
      { note: "**อนุพันธ์ของ sigmoid สูงสุดแค่ 0.25 ไม่ใช่เกร็ดความรู้** — ผ่าน 10 ชั้นแล้ว gradient ถูกคูณด้วยเลขที่ ≤ 0.25 สิบครั้ง เหลือไม่เกิน 0.25¹⁰ ≈ 1e−6 นี่คือเหตุผลเชิงเลขคณิตที่เครือข่าย sigmoid ลึกเทรนไม่ได้ และเหตุผลที่ ReLU เปลี่ยนวงการ" },
      { h: "4) นิวรอนตาย — ราคาของ ReLU" },
      { code: String.raw`ถ้าน้ำหนักถูกผลักจน z < 0 สำหรับ input ทุกตัว:
   a  = 0        ไม่ส่งอะไรออกไปข้างหน้า
   a' = 0        gradient ที่ไหลกลับมาเป็นศูนย์
   → น้ำหนักไม่ถูกอัปเดตอีกเลย ตลอดกาล

มักเกิดเมื่อ learning rate สูงเกินไปในช่วงต้น`,
        cap: "leaky ReLU ให้ความชัน 0.01 ฝั่งลบ ซึ่งเพียงพอให้นิวรอนฟื้นได้", lang: "txt" },
      { h: "5) ชั้น output ตามด้วยงาน ไม่ใช่ตามความชอบ" },
      { table: { head: ["งาน", "activation ที่ output", "loss"], rows: [
        ["**regression**", "ไม่ใส่", "MSE"],
        ["**binary classification**", "sigmoid", "binary cross-entropy"],
        ["**multiclass เลือกได้ตัวเดียว**", "softmax", "categorical cross-entropy"],
        ["**multi-label เลือกได้หลายตัว**", "sigmoid แยกทุกคลาส", "binary cross-entropy ต่อคลาส"]
      ]}},
      { p: "**softmax คู่กับ cross-entropy ให้** `∂L/∂z = ŷ − y` — รูปเดียวกับ logistic regression ในหน้าที่แล้วเป๊ะ พจน์ยุ่ง ๆ ตัดกันหมดพอดี ซึ่งเป็นเหตุผลที่ทั้งคู่ถูกออกแบบมาให้อยู่ด้วยกัน" },
      { note: "**framework รวมสองขั้นนี้เข้าด้วยกันเพื่อความเสถียรเชิงตัวเลข** — `CrossEntropyLoss` ของ PyTorch และ `from_logits=True` ของ Keras รับ logit ไม่ใช่ความน่าจะเป็น ถ้าใส่ softmax เองแล้วส่งเข้า loss พวกนี้ คือบั๊กที่พบบ่อยที่สุดและเงียบที่สุด" },
      { h: "6) forward pass เต็ม ๆ พร้อม shape" },
      { code: String.raw`X   (N, 784)
W₁  (784, 128)  b₁ (128,)   →  Z₁ = X W₁ + b₁     (N, 128)
                                A₁ = ReLU(Z₁)      (N, 128)
W₂  (128, 10)   b₂ (10,)    →  Z₂ = A₁ W₂ + b₂    (N, 10)
                                Ŷ  = softmax(Z₂)   (N, 10)`,
        cap: "เขียน shape กำกับทุกบรรทัดเสมอ — ปัญหา 'รันไม่ได้' ส่วนใหญ่คือปัญหา shape", lang: "txt" },
      { h: "7) backpropagation คืออะไรจริง ๆ" },
      { p: "**คือ chain rule ที่เดินย้อนจาก loss กลับไปหาทุกน้ำหนัก โดยเก็บผลลัพธ์ระหว่างทางไว้ใช้ซ้ำ** — ไม่ใช่อัลกอริทึมพิเศษของ neural network แต่คือ reverse-mode automatic differentiation ที่ใช้ได้กับกราฟการคำนวณใด ๆ" },
      { code: String.raw`δ₂ = Ŷ − Y                        (N, 10)   ← จาก softmax + cross-entropy
∂L/∂W₂ = A₁ᵀ δ₂ / N               (128, 10)
∂L/∂b₂ = mean(δ₂, แกน 0)          (10,)

δ₁ = (δ₂ W₂ᵀ) ⊙ ReLU'(Z₁)         (N, 128)  ← ส่งย้อนแล้วคูณอนุพันธ์
∂L/∂W₁ = Xᵀ δ₁ / N                (784, 128)
∂L/∂b₁ = mean(δ₁, แกน 0)          (128,)`,
        cap: "รูปแบบซ้ำเดิมทุกชั้น: ส่ง δ ย้อนผ่าน Wᵀ แล้วคูณอนุพันธ์ของ activation ชั้นนั้น", lang: "txt" },
      { p: "**ทำไมต้องเดินย้อน ไม่เดินหน้า**: เดินหน้าต้องคำนวณครั้งหนึ่งต่อพารามิเตอร์หนึ่งตัว ส่วนเดินย้อนได้ gradient ของทุกตัวจากการเดินครั้งเดียว — เมื่อมีพารามิเตอร์ล้านตัวและ output ตัวเดียว ความต่างคือหนึ่งล้านเท่า" },
      { h: "8) vanishing และ exploding gradient" },
      { code: String.raw`∂L/∂W₁ มีพจน์  Π (Wₗᵀ · φ'(zₗ))   คูณกันทุกชั้นที่อยู่ข้างบน

ทุกตัวคูณ < 1  →  ผลคูณ → 0    vanishing: ชั้นล่างแทบไม่ถูกเทรน
ทุกตัวคูณ > 1  →  ผลคูณ → ∞    exploding: น้ำหนักพุ่ง loss กลายเป็น NaN`,
        cap: "สมการเดียวนี้อธิบายที่มาของ ReLU, การตั้งค่าเริ่มต้นแบบ He, normalization, residual connection และ gradient clipping ทั้งหมด", lang: "txt" },
      { h: "9) universal approximation — และสิ่งที่มันไม่ได้สัญญา" },
      { p: "ทฤษฎีบทบอกว่า **ชั้นซ่อนชั้นเดียวที่กว้างพอ ประมาณฟังก์ชันต่อเนื่องใด ๆ บนโดเมนปิดได้ละเอียดเท่าที่ต้องการ**" },
      { table: { head: ["มันไม่ได้บอกว่า", "ความจริง"], rows: [
        ["ต้องกว้างเท่าไร", "อาจกว้างระดับ exponential จนใช้จริงไม่ได้"],
        ["gradient descent จะหาน้ำหนักนั้นเจอไหม", "**ไม่รับประกันเลย** — ทฤษฎีบทพูดถึงการมีอยู่เท่านั้น"],
        ["จะ generalize ไหม", "ไม่เกี่ยวข้องเลย ทฤษฎีบทไม่แตะเรื่องข้อมูลที่ไม่เคยเห็น"]
      ]}},
      { note: "**ในทางปฏิบัติ ลึกและแคบชนะตื้นและกว้าง** ด้วยเหตุผลที่ทฤษฎีบทนี้ไม่ได้พูดถึง — ใครอ้างทฤษฎีบทนี้เป็นเหตุผลว่าเครือข่าย 'จะทำงานได้' แปลว่าอ่านผิด" },
      { h: "10) เมื่อไรที่ neural network แพ้" },
      { p: "**บนข้อมูลตารางธรรมดา gradient boosting มักชนะ neural network** ทั้งเรื่องคะแนน เวลาเทรน และจำนวนที่ต้องจูน · เครือข่ายชนะเมื่อข้อมูลมีโครงสร้างให้ใช้ประโยชน์ เช่นภาพ ลำดับ ข้อความ เสียง ซึ่งเป็นเรื่องของหน้า 7 ถึง 9" }
    ],

    foundations: [
      { p: "หมวดนี้เจาะกลไกที่ตัดสินว่าเครือข่ายจะเทรนได้หรือไม่" },
      { h: "ทำไมตั้งน้ำหนักเป็นศูนย์แล้วพังถาวร" },
      { code: String.raw`ถ้า W = 0 ทั้งชั้น:
   นิวรอนทุกตัวในชั้นคำนวณค่าเดียวกัน
   → gradient ที่ได้รับก็เท่ากันทุกตัว
   → อัปเดตเท่ากัน → ยังเหมือนกันอีก

ชั้นที่มี 128 นิวรอนจึงมีค่าเท่ากับชั้นที่มี 1 นิวรอน ตลอดกาล`,
        cap: "เรียกว่า symmetry ไม่ถูกทำลาย — ไม่ใช่แค่เทรนช้า แต่ความกว้างของชั้นไม่มีความหมายเลย", lang: "txt" },
      { p: "**ส่วน bias ตั้งเป็นศูนย์ได้ปกติ** เพราะน้ำหนักที่สุ่มมาแล้วทำลาย symmetry ไปเรียบร้อย" },
      { h: "Xavier กับ He ต่างกันตรงไหน" },
      { code: String.raw`Xavier / Glorot:  Var(W) = 2 / (fan_in + fan_out)
   อนุมานเพื่อรักษาความแปรปรวนของสัญญาณผ่าน activation ที่สมมาตร (tanh, sigmoid)

He:               Var(W) = 2 / fan_in
   เลข 2 ชดเชยที่ ReLU ตัดครึ่งหนึ่งทิ้งเป็นศูนย์`,
        cap: "ใช้ He กับ ReLU · ใช้ Xavier กับ tanh — สลับกันแล้วสัญญาณจะหดหรือขยายทีละชั้น", lang: "txt" },
      { code: String.raw`สาธิตด้วยเลข: 50 ชั้น ReLU กว้าง 512 ตัว

init N(0, 0.01)  → ตัวคูณต่อชั้น 0.16  → std ชั้นที่ 50 ≈ 1e−40   สัญญาณหายหมด
init Xavier      → ตัวคูณต่อชั้น 0.71  → std ชั้นที่ 50 ≈ 1e−8    ก็หายเหมือนกัน
init He          → ตัวคูณต่อชั้น 1.00  → std คงที่ราว 1        เทรนได้`,
        cap: "**Xavier กับ ReLU หดสัญญาณด้วยตัวคูณ 1/√2 ทุกชั้น** ซึ่งคือเลข 2 ที่ He ใส่กลับเข้าไปพอดี — ค่าเริ่มต้นจึงไม่ใช่รายละเอียดปลีกย่อย เครือข่ายลึกเทรนไม่ขึ้นเลยถ้าตั้งผิด", lang: "txt" },
      { h: "สเกล input ก็สำคัญไม่แพ้กัน" },
      { p: "**เครือข่ายต้องได้รับ input ที่สเกลแล้วเสมอ** — ภาพหาร 255 ให้อยู่ช่วง [0,1] หรือ standardize ให้ค่าเฉลี่ยเป็น 0 · ถ้าส่งค่าดิบที่มีหน่วยต่างกันมาก ชั้นแรกจะได้ `z` ที่ใหญ่จนอิ่มตัวทันทีตั้งแต่รอบแรก" },
      { h: "อ่านสมการของ softmax ให้ถูก" },
      { code: String.raw`softmax(z)ᵢ = e^zᵢ / Σⱼ e^zⱼ

ปัญหา: z ใหญ่ ๆ ทำให้ e^z ล้น (overflow)
วิธีแก้ที่ทุก framework ใช้: ลบค่าสูงสุดออกก่อน

softmax(z)ᵢ = e^(zᵢ − max z) / Σⱼ e^(zⱼ − max z)      ← ค่าเท่ากันทุกประการ`,
        cap: "นี่คือหนึ่งในเหตุผลที่ควรให้ framework คำนวณ softmax กับ loss พร้อมกัน", lang: "txt" },
      { h: "ทำไม cross-entropy ถึงคู่กับ softmax พอดี" },
      { code: String.raw`L = −Σ yᵢ log ŷᵢ        และ  ŷ = softmax(z)

∂L/∂zᵢ = ŷᵢ − yᵢ

พจน์ที่ควรจะยุ่งจากอนุพันธ์ของ softmax
ตัดกับพจน์ 1/ŷ จากอนุพันธ์ของ log พอดีทุกตัว`,
        cap: "ผลคือ gradient ที่สะอาดที่สุดเท่าที่เป็นไปได้ และไม่อิ่มตัวเมื่อทำนายผิดมาก", lang: "txt" },
      { h: "จำนวนพารามิเตอร์กับ overfitting" },
      { table: { head: ["โครงสร้าง", "พารามิเตอร์", "ข้อสังเกต"], rows: [
        ["784 → 10", "7,850", "logistic regression หลายคลาส ไม่มีชั้นซ่อน"],
        ["784 → 128 → 10", "101,770", "พอสำหรับ MNIST 60,000 ภาพ"],
        ["784 → 512 → 512 → 10", "669,706", "**พารามิเตอร์มากกว่าจำนวนตัวอย่าง** ต้อง regularize"],
        ["784 → 2048 → 2048 → 10", "5.8M", "ท่องจำชุดเทรนได้หมดถ้าไม่คุม"]
      ]}},
      { note: "**เครือข่ายที่มีพารามิเตอร์มากกว่าตัวอย่างยังทำงานได้ดี** ซึ่งขัดกับสัญชาตญาณจากโมเดลคลาสสิก — เหตุผลเกี่ยวกับพฤติกรรมของ gradient descent เองที่มีแนวโน้มเลือกคำตอบที่เรียบ ไม่ใช่ว่าไม่ต้อง regularize" },
      { h: "ตรวจ gradient ด้วย finite difference" },
      { code: String.raw`สองด้าน (ต้องใช้แบบนี้):
   (L(w+ε) − L(w−ε)) / 2ε     ความคลาดเคลื่อน O(ε²)

ด้านเดียว (อย่าใช้):
   (L(w+ε) − L(w)) / ε        ความคลาดเคลื่อน O(ε) — gradient ที่ถูกจะดูเหมือนผิด

ε = 1e−5
relative error < 1e−7   ถูกต้อง
relative error > 1e−4   มีบั๊ก`,
        cap: "ตรวจแค่ไม่กี่น้ำหนักที่สุ่มมาก็พอ และปิดทุกอย่างที่มีความสุ่มก่อน เช่น dropout", lang: "txt" },
      { h: "ทำไม batch ถึงช่วย" },
      { table: { head: ["ขนาด batch", "ผล"], rows: [
        ["**1 (SGD แท้)**", "อัปเดตบ่อย · gradient มี noise สูง · ใช้ GPU ไม่คุ้ม"],
        ["**32-256**", "**ช่วงที่ใช้จริง** — สมดุลระหว่าง noise กับความเร็ว"],
        ["**ใหญ่มาก (4096+)**", "gradient เรียบ · แต่ต้องเพิ่ม learning rate และมักได้ผลทดสอบแย่ลงเล็กน้อย"]
      ]}},
      { p: "**noise จาก batch เล็กไม่ใช่ข้อเสียล้วน ๆ** — มันช่วยให้หลุดออกจากจุดที่ไม่ดีได้ ซึ่งเป็นการ regularize อย่างหนึ่งโดยไม่ตั้งใจ" }
    ],

    architecture: [
      { p: "หมวดนี้ว่าด้วยการเลือกโครงสร้างและลำดับการตัดสินใจที่ไม่เสียเวลา" },
      { h: "เลือกจำนวนชั้นและความกว้างยังไง" },
      { code: String.raw`เริ่มจาก: 1-2 ชั้นซ่อน กว้าง 64-256
   → ถ้า underfit (train loss สูง) : เพิ่มความกว้างก่อน แล้วค่อยเพิ่มชั้น
   → ถ้า overfit (train ต่ำ val สูง): เพิ่มข้อมูล · dropout · weight decay
   → เพิ่มความลึกเมื่อรู้ว่ามีโครงสร้างเป็นชั้น ๆ ให้เรียนจริง`,
        cap: "แก้ปัญหาที่วัดได้ก่อนเสมอ ไม่ใช่ขยายโครงสร้างเพราะรู้สึกว่าน่าจะดีขึ้น", lang: "txt" },
      { h: "รูปทรงที่ใช้กันจริง" },
      { table: { head: ["รูป", "ตัวอย่าง", "เมื่อไร"], rows: [
        ["**กรวย**", "512 → 256 → 128 → 10", "ค่าเริ่มต้นที่ปลอดภัยที่สุด"],
        ["**คงที่**", "256 → 256 → 256 → 10", "ง่ายต่อการปรับและมักไม่ต่างจากกรวย"],
        ["**คอขวด**", "512 → 32 → 512", "autoencoder · บังคับให้บีบข้อมูล"]
      ]}},
      { h: "ตัวประกอบทั้งหมดของเครือข่ายหนึ่งตัว" },
      { code: String.raw`สถาปัตยกรรม   จำนวนชั้น · ความกว้าง · activation
เริ่มต้น       He (ReLU) หรือ Xavier (tanh)
loss           ตามงาน — ห้ามเลือกตามความชอบ
optimizer      Adam เป็นค่าเริ่มต้น (รายละเอียดอยู่หน้าถัดไป)
learning rate  ตัวที่สำคัญที่สุดเสมอ
batch size     32-256
regularization dropout · weight decay · early stopping`,
        cap: "หกบรรทัดนี้คือทุกอย่างที่ต้องตัดสินใจก่อนกดเทรนครั้งแรก", lang: "txt" },
      { h: "ลำดับการทดลองที่ประหยัดเวลาที่สุด" },
      { code: String.raw`1. ทำให้ overfit ข้อมูล 10 แถวให้ได้ก่อน       ← พิสูจน์ว่าโค้ดถูก
2. เทรนชุดเต็มด้วยค่าเริ่มต้น ดูเส้น loss
3. จูน learning rate (สำคัญกว่าทุกตัวรวมกัน)
4. เพิ่ม regularization เมื่อเห็นช่องว่าง train/val ชัด
5. ค่อยขยายโครงสร้าง ถ้ายัง underfit อยู่`,
        cap: "ขั้นที่ 1 ใช้เวลาไม่ถึงนาทีและตัดสาเหตุออกไปได้ครึ่งหนึ่ง", lang: "txt" },
      { note: "**ขั้นที่ 1 คือขั้นที่คนข้ามบ่อยที่สุดและเสียเวลามากที่สุดจากการข้าม** — ถ้าเครือข่ายทำให้ 10 แถว loss ลงไปใกล้ศูนย์ไม่ได้ ปัญหาอยู่ที่โมเดลหรือ loss ไม่ใช่ที่ข้อมูลหรือ regularization และการไปจูน learning rate ตอนนั้นคือการเดาสุ่ม" },
      { h: "แผนภาพของเครือข่ายที่ครบทุกส่วน" },
      { code: String.raw`  input (N, d)
      |
  [Linear d→h]   W₁ b₁
      |
  [ReLU]                      ← ขาดตัวนี้ ความลึกหายหมด
      |
  [Dropout p=0.2]             ← ตอนเทรนเท่านั้น
      |
  [Linear h→C]   W₂ b₂
      |
  logits (N, C)               ← ส่งเข้า loss ตรงนี้ ไม่ใส่ softmax เอง
      |
  [CrossEntropyLoss]`,
        cap: "จุดที่ผิดบ่อยที่สุดคือบรรทัดรองสุดท้าย — ใส่ softmax เองแล้วส่งเข้า loss ที่รับ logit", lang: "txt" },
      { h: "เครือข่ายกับข้อมูลตาราง — พูดตรง ๆ" },
      { table: { head: ["สถานการณ์", "ควรใช้"], rows: [
        ["ตารางไม่กี่หมื่นแถว", "**gradient boosting** — เร็วกว่า จูนน้อยกว่า มักแม่นกว่า"],
        ["ภาพ", "CNN (หน้า 7)"],
        ["ลำดับหรือข้อความ", "transformer (หน้า 8-9)"],
        ["ตารางที่ต้องรวมกับข้อความหรือภาพในโมเดลเดียว", "เครือข่าย เพราะรวมหลายชนิดได้"]
      ]}}
    ],

    dataflow: [
      { p: "เดินตัวเลขจริงทั้ง forward และ backward บนเครือข่าย 2-2-1 จนได้น้ำหนักใหม่" },
      { h: "ตั้งโจทย์" },
      { code: String.raw`เครือข่าย 2 → 2 → 1 · activation ชั้นซ่อนเป็น ReLU · output เป็น sigmoid
loss = binary cross-entropy

input   x = [1.0, 0.5]        เป้าหมาย y = 1

W₁ = [[0.3, −0.2],            b₁ = [0.1, 0.0]
      [0.4,  0.6]]
W₂ = [[0.7], [−0.5]]          b₂ = [0.2]`,
        cap: "ตัวเลขเล็กพอจะคำนวณตามด้วยเครื่องคิดเลขได้ทุกบรรทัด", lang: "txt" },
      { h: "forward — ชั้นซ่อน" },
      { code: String.raw`z₁ = x·W₁ + b₁
z₁[0] = 1.0(0.3) + 0.5(0.4) + 0.1 = 0.3 + 0.2 + 0.1 = 0.60
z₁[1] = 1.0(−0.2) + 0.5(0.6) + 0.0 = −0.2 + 0.3     = 0.10

a₁ = ReLU(z₁) = [0.60, 0.10]     ทั้งคู่เป็นบวก จึงผ่านไปทั้งหมด`,
        cap: "ถ้าตัวใดตัวหนึ่งติดลบ มันจะกลายเป็น 0 และ gradient ที่ผ่านมันจะเป็น 0 ด้วย", lang: "txt" },
      { h: "forward — ชั้น output" },
      { code: String.raw`z₂ = a₁·W₂ + b₂
   = 0.60(0.7) + 0.10(−0.5) + 0.2
   = 0.42 − 0.05 + 0.2 = 0.57

ŷ = σ(0.57) = 1/(1+e^−0.57) = 0.6388`,
        cap: "ทำนาย 0.6388 ขณะที่เป้าหมายคือ 1 — ยังต่ำไป", lang: "txt" },
      { h: "loss" },
      { code: String.raw`L = −[y log ŷ + (1−y) log(1−ŷ)]
  = −[1 · log(0.6388) + 0]
  = −log(0.6388) = 0.4482`,
        cap: "ทายถูกสนิทจะได้ 0 · ทาย 0.5 จะได้ 0.693 · ตอนนี้อยู่ระหว่างกลางค่อนไปทางดี", lang: "txt" },
      { h: "backward — เริ่มที่ output" },
      { code: String.raw`sigmoid คู่กับ binary cross-entropy ให้:
δ₂ = ŷ − y = 0.6388 − 1 = −0.3612

∂L/∂W₂ = a₁ᵀ δ₂ = [0.60, 0.10]ᵀ × (−0.3612)
                 = [−0.2167, −0.0361]
∂L/∂b₂ = δ₂ = −0.3612`,
        cap: "เครื่องหมายลบแปลว่าน้ำหนักต้อง 'เพิ่มขึ้น' เพราะการอัปเดตคือลบด้วย gradient", lang: "txt" },
      { h: "backward — ส่งย้อนเข้าชั้นซ่อน" },
      { code: String.raw`ส่งผ่าน W₂ᵀ ก่อน:
   δ₂ W₂ᵀ = −0.3612 × [0.7, −0.5] = [−0.2529, 0.1806]

แล้วคูณอนุพันธ์ของ ReLU (z₁ เป็นบวกทั้งคู่ จึงเป็น 1 ทั้งคู่):
   δ₁ = [−0.2529, 0.1806] ⊙ [1, 1] = [−0.2529, 0.1806]`,
        cap: "ถ้า z₁[1] ติดลบ ตัวที่สองจะกลายเป็น 0 ทันที และน้ำหนักแถวนั้นจะไม่ถูกอัปเดตเลย", lang: "txt" },
      { h: "backward — gradient ของชั้นแรก" },
      { code: String.raw`∂L/∂W₁ = xᵀ δ₁     x = [1.0, 0.5]

        = [[1.0(−0.2529), 1.0(0.1806)],
           [0.5(−0.2529), 0.5(0.1806)]]

        = [[−0.2529,  0.1806],
           [−0.1264,  0.0903]]

∂L/∂b₁ = δ₁ = [−0.2529, 0.1806]`,
        cap: "แถวที่สองมีค่าครึ่งหนึ่งของแถวแรกพอดี เพราะ x[1] = 0.5 — input ที่เล็กกว่าได้รับการแก้ไขน้อยกว่า", lang: "txt" },
      { h: "อัปเดตน้ำหนัก" },
      { code: String.raw`η = 0.1

W₂ ใหม่ = [[0.7], [−0.5]] − 0.1 × [[−0.2167], [−0.0361]]
        = [[0.7217], [−0.4964]]
b₂ ใหม่ = 0.2 − 0.1(−0.3612) = 0.2361

W₁ ใหม่ = [[0.3, −0.2], [0.4, 0.6]] − 0.1 × [[−0.2529, 0.1806],
                                              [−0.1264, 0.0903]]
        = [[0.3253, −0.2181],
           [0.4126,  0.5910]]
b₁ ใหม่ = [0.1, 0.0] − 0.1 × [−0.2529, 0.1806] = [0.1253, −0.0181]`,
        cap: "ทุกน้ำหนักขยับไปในทิศที่ลด loss ของตัวอย่างนี้", lang: "txt" },
      { h: "ตรวจว่าดีขึ้นจริง" },
      { code: String.raw`forward ใหม่ด้วยน้ำหนักที่อัปเดตแล้ว:
z₁ = [0.6569, 0.0594]  →  a₁ = [0.6569, 0.0594]
z₂ = 0.6569(0.7217) + 0.0594(−0.4964) + 0.2361 = 0.6807
ŷ  = σ(0.6807) = 0.6639

L ใหม่ = −log(0.6639) = 0.4096      (เดิม 0.4482)`,
        cap: "loss ลดจาก 0.4482 เป็น 0.4096 ในหนึ่งก้าว — นั่นคือทั้งหมดที่การเทรนทำ ทำซ้ำหลายล้านครั้ง", lang: "txt" },
      { note: "**ถ้าคำนวณตามได้ทุกบรรทัดข้างบน แปลว่าเข้าใจ backpropagation แล้วจริง ๆ** ส่วนที่เหลือในหน้าถัดไปคือการทำสิ่งเดิมนี้ให้เร็วขึ้นและเสถียรขึ้นเท่านั้น" },
      { h: "ทำไมต้องใช้ batch ไม่ใช่ทีละตัว" },
      { code: String.raw`ทีละตัว:  gradient จากตัวอย่างเดียว = ทิศทางที่มี noise สูงมาก
batch 32:  เฉลี่ย gradient ของ 32 ตัว = ทิศทางที่นิ่งกว่ามาก

และคูณเมทริกซ์ (32, 784) × (784, 128) ครั้งเดียว
เร็วกว่าคูณ (1, 784) × (784, 128) สามสิบสองครั้งบน GPU อย่างมาก`,
        cap: "เหตุผลมีทั้งเชิงสถิติและเชิงฮาร์ดแวร์ และทั้งสองชี้ไปทางเดียวกัน", lang: "txt" }
    ],

    implementation: [
      { p: "เขียนเครือข่ายจากศูนย์ด้วย NumPy ก่อน แล้วค่อยเทียบกับ PyTorch" },
      { h: "1) เครือข่ายเต็มด้วย NumPy" },
      { code: String.raw`import numpy as np

def init(sizes, seed=0):
    rng = np.random.default_rng(seed)
    params = []
    for a, b in zip(sizes[:-1], sizes[1:]):
        W = rng.normal(0, np.sqrt(2.0 / a), (a, b))   # He initialisation
        params.append([W, np.zeros(b)])
    return params

def relu(z):        return np.maximum(0, z)
def relu_grad(z):   return (z > 0).astype(float)

def softmax(z):
    z = z - z.max(axis=1, keepdims=True)              # กัน overflow
    e = np.exp(z)
    return e / e.sum(axis=1, keepdims=True)`,
        cap: "`np.sqrt(2.0 / a)` คือ He initialisation ตรงตามสูตร — เลข 2 ชดเชยที่ ReLU ตัดครึ่งทิ้ง", lang: "python" },
      { h: "2) forward ที่เก็บค่าไว้ใช้ตอน backward" },
      { code: String.raw`def forward(params, X):
    cache = [X]
    A = X
    for i, (W, b) in enumerate(params):
        Z = A @ W + b
        A = softmax(Z) if i == len(params) - 1 else relu(Z)
        cache += [Z, A]
    return A, cache`,
        cap: "ต้องเก็บ Z ทุกชั้นไว้ เพราะ backward ต้องใช้ `relu_grad(Z)` — นี่คือที่มาของหน่วยความจำที่เครือข่ายกินตอนเทรน", lang: "python" },
      { h: "3) backward" },
      { code: String.raw`def backward(params, cache, Y):
    N = Y.shape[0]
    grads = [None] * len(params)
    A_last = cache[-1]
    delta = (A_last - Y) / N                 # softmax + cross-entropy

    for i in range(len(params) - 1, -1, -1):
        A_prev = cache[2 * i]
        grads[i] = [A_prev.T @ delta, delta.sum(axis=0)]
        if i > 0:
            Z_prev = cache[2 * i - 1]
            delta = (delta @ params[i][0].T) * relu_grad(Z_prev)
    return grads`,
        cap: "สองบรรทัดในลูปคือ backpropagation ทั้งหมด — ส่งย้อนผ่าน `W.T` แล้วคูณอนุพันธ์ของ activation", lang: "python" },
      { h: "4) ลูปเทรน" },
      { code: String.raw`def train(params, X, Y, epochs=30, lr=0.1, bs=64, seed=0):
    rng = np.random.default_rng(seed)
    n = X.shape[0]
    for ep in range(epochs):
        idx = rng.permutation(n)             # สับใหม่ทุก epoch
        for s in range(0, n, bs):
            b = idx[s:s + bs]
            out, cache = forward(params, X[b])
            grads = backward(params, cache, Y[b])
            for p, g in zip(params, grads):
                p[0] -= lr * g[0]
                p[1] -= lr * g[1]
        loss = -np.mean(np.sum(Y * np.log(forward(params, X)[0] + 1e-12), axis=1))
        print(f"epoch {ep:3d}  loss {loss:.4f}")`,
        cap: "`+ 1e-12` กัน `log(0)` ซึ่งให้ `-inf` และทำให้ loss กลายเป็น NaN ทั้งก้อน", lang: "python" },
      { h: "5) ตรวจ gradient ก่อนเชื่อผลใด ๆ" },
      { code: String.raw`def grad_check(params, X, Y, eps=1e-5):
    def loss_of(p):
        out, _ = forward(p, X)
        return -np.mean(np.sum(Y * np.log(out + 1e-12), axis=1))

    out, cache = forward(params, X)
    grads = backward(params, cache, Y)

    W = params[0][0]; g = grads[0][0]
    i, j = 0, 0
    orig = W[i, j]
    W[i, j] = orig + eps; lp = loss_of(params)
    W[i, j] = orig - eps; lm = loss_of(params)
    W[i, j] = orig

    num = (lp - lm) / (2 * eps)
    print(f"analytic {g[i, j]:.10f}  numeric {num:.10f}  "
          f"rel {abs(num - g[i,j]) / max(abs(num), abs(g[i,j])):.2e}")
# analytic 0.0142387100  numeric 0.0142387099  rel 7.0e-09`,
        cap: "`rel` ต่ำกว่า 1e−7 คือถูกต้อง · สูงกว่า 1e−4 คือมีบั๊กใน backward แน่นอน", lang: "python" },
      { h: "6) เครือข่ายเดียวกันด้วย PyTorch" },
      { code: String.raw`import torch, torch.nn as nn

model = nn.Sequential(
    nn.Linear(784, 128),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(128, 10),          # ไม่ใส่ softmax ตรงนี้
)

loss_fn = nn.CrossEntropyLoss()  # รับ logit และทำ softmax ให้ข้างใน
opt = torch.optim.Adam(model.parameters(), lr=1e-3)`,
        cap: "**ห้ามใส่** `nn.Softmax` **ก่อน** `CrossEntropyLoss` — จะได้ softmax สองชั้น ซึ่งทำให้เทรนช้าลงมากโดยไม่มี error ใด ๆ แจ้ง", lang: "python" },
      { h: "7) ลูปเทรนของ PyTorch" },
      { code: String.raw`for epoch in range(epochs):
    model.train()
    for xb, yb in train_loader:
        opt.zero_grad()              # ลืมบรรทัดนี้ = gradient สะสมทับกัน
        loss = loss_fn(model(xb), yb)
        loss.backward()
        opt.step()

    model.eval()                     # ปิด dropout เปลี่ยนพฤติกรรม batchnorm
    with torch.no_grad():
        val = sum(loss_fn(model(xb), yb).item() for xb, yb in val_loader)
    print(f"epoch {epoch}  val {val / len(val_loader):.4f}")`,
        cap: "สามบรรทัดที่ลืมบ่อยที่สุด: `zero_grad`, `model.eval()`, และ `torch.no_grad()`", lang: "python" },
      { h: "8) ทำให้ overfit 10 แถวก่อนเสมอ" },
      { code: String.raw`xb, yb = next(iter(train_loader))
xb, yb = xb[:10], yb[:10]

for step in range(500):
    opt.zero_grad()
    loss = loss_fn(model(xb), yb)
    loss.backward()
    opt.step()
    if step % 100 == 0:
        print(step, round(loss.item(), 5))

# 0    2.31421
# 100  0.04127
# 400  0.00019      ← ถูกต้อง โค้ดใช้ได้`,
        cap: "ถ้า loss ไม่ลงใกล้ศูนย์ ปัญหาอยู่ที่โมเดลหรือ loss ไม่ใช่ที่ข้อมูล — หยุดจูนอย่างอื่นแล้วหาตรงนั้น", lang: "python" },
      { h: "9) ดูสถิติของ activation และ gradient ต่อชั้น" },
      { code: String.raw`for name, p in model.named_parameters():
    if p.grad is not None:
        print(f"{name:20s} grad norm {p.grad.norm().item():.3e}")

# 0.weight   grad norm 3.201e-03
# 2.weight   grad norm 1.884e-02      ← ต่างกันไม่เกินหลักเดียว = ปกติ

# ถ้าเห็นแบบนี้แทน:
# 0.weight   grad norm 4.1e-09        ← vanishing ชัดเจน
# 6.weight   grad norm 2.7e-02`,
        cap: "gradient norm ที่ต่างกันหลายอันดับระหว่างชั้นบนกับชั้นล่างคือ vanishing gradient ที่มองเห็นได้ด้วยตา", lang: "python" },
      { h: "10) นับพารามิเตอร์ให้ตรงกับที่คำนวณเอง" },
      { code: String.raw`total = sum(p.numel() for p in model.parameters())
trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
print(total, trainable)
# 101770 101770

# ตรวจกับที่คำนวณมือ: 784·128 + 128 + 128·10 + 10 = 101,770`,
        cap: "ถ้าตัวเลขไม่ตรงกับที่นับเอง แปลว่าเข้าใจโครงสร้างของโมเดลตัวเองผิด", lang: "python" }
    ],

    tricks: [
      { h: "ไล่ปัญหาตามอาการ" },
      { table: { head: ["อาการ", "สาเหตุที่พบบ่อยที่สุด", "แก้ยังไง"], rows: [
        ["loss กลายเป็น **NaN**", "learning rate สูงเกิน · `log(0)` · หารด้วยศูนย์", "ลด lr สิบเท่า · ใส่ `+1e-12` ใน log · ใช้ loss ที่รับ logit"],
        ["loss ค้างที่ **2.303** (10 คลาส)", "ไม่มีอะไรเรียนรู้เลย — เท่ากับ `−log(1/10)`", "ตรวจว่า label ถูก · ตรวจว่า optimizer ต่อกับพารามิเตอร์จริง"],
        ["loss ไม่ลงเลยตั้งแต่ต้น", "ลืม `zero_grad` · lr เล็กเกิน · input ไม่ได้สเกล", "ทำ overfit 10 แถวเพื่อแยกสาเหตุ"],
        ["train ดีมาก val แย่", "overfit", "dropout · weight decay · early stopping · ข้อมูลเพิ่ม"],
        ["ทั้ง train และ val แย่", "underfit หรือมีบั๊ก", "ทำ overfit 10 แถวก่อน ถ้าไม่ได้แปลว่าเป็นบั๊ก"],
        ["ผลตอน eval ต่างจากตอน train มาก", "ลืม `model.eval()`", "dropout ยังทำงานอยู่ตอนวัดผล"],
        ["ชั้นหนึ่งให้ค่าศูนย์ทั้งชั้น", "**ReLU ตายทั้งชั้น**", "ลด lr · ใช้ leaky ReLU · ตรวจ initialisation"],
        ["gradient ของชั้นล่างเล็กกว่าชั้นบนหลายอันดับ", "vanishing gradient", "ReLU · He init · normalization · residual connection"],
        ["เทรนช้ากว่าที่ควรมาก", "ใส่ softmax เองแล้วยังใช้ loss ที่รับ logit", "ถอด softmax ออกจากโมเดล"]
      ]}},
      { h: "ค่าเริ่มต้นที่ใช้ได้เลย" },
      { code: String.raw`activation ชั้นซ่อน   ReLU
initialisation      He
optimizer           Adam, lr = 1e-3
batch size          32-128
dropout             0.1-0.3 (ใส่หลัง activation ไม่ใช่ก่อน)
loss                CrossEntropyLoss โดยโมเดลส่ง logit ออกมา
สเกล input          บังคับเสมอ`,
        cap: "ชุดนี้ทำงานได้กับปัญหาส่วนใหญ่โดยไม่ต้องคิด แล้วค่อยจูนจากตรงนี้", lang: "txt" },
      { h: "บั๊กที่เงียบที่สุดห้าอย่าง" },
      { ul: [
        "**ใส่ softmax เองแล้วส่งเข้า** `CrossEntropyLoss` — ไม่มี error แต่เทรนช้าลงอย่างมาก",
        "**ลืม** `opt.zero_grad()` — gradient สะสมทับกันข้าม batch",
        "**ลืม** `model.eval()` ตอนวัดผล — dropout ยังทำงานทำให้ผลแกว่ง",
        "**ไม่ได้สเกล input** — ชั้นแรกอิ่มตัวตั้งแต่ก้าวแรก",
        "**สับข้อมูลผิดที่** เช่นสับ X แต่ไม่สับ y ด้วย index ชุดเดียวกัน"
      ]},
      { h: "เมื่อไรควรเพิ่มความลึก" },
      { table: { head: ["สัญญาณ", "ควรทำ"], rows: [
        ["train loss ยังสูง (underfit)", "**เพิ่มความกว้างก่อน** แล้วค่อยเพิ่มชั้น"],
        ["train ต่ำ val สูง (overfit)", "**อย่าเพิ่มโครงสร้าง** — เพิ่ม regularization หรือข้อมูล"],
        ["ทั้งคู่ลงแล้วนิ่งพร้อมกัน", "จูน learning rate หรือเทรนนานขึ้น"],
        ["ข้อมูลมีโครงสร้างเป็นชั้น เช่นภาพหรือข้อความ", "เปลี่ยนสถาปัตยกรรม ไม่ใช่แค่เพิ่มชั้น dense"]
      ]}},
      { note: "**learning rate สำคัญกว่าทุกอย่างรวมกัน** — สูงเกินไป loss พุ่งหรือกลายเป็น NaN · ต่ำเกินไปดูเหมือนโมเดลไม่เรียนรู้ทั้งที่โค้ดถูก ถ้าจะจูนได้แค่ตัวเดียว จูนตัวนี้ · รายละเอียดของ optimizer และตารางลด learning rate อยู่ในหน้าถัดไป" }
    ],

    eval: [
      { p: "คำถามที่แยกคนเข้าใจกลไกออกจากคนที่เรียกใช้ framework เป็น" },
      { qa: [
        { q: "ถ้าเอา activation ออกจากเครือข่ายลึกจะเกิดอะไรขึ้น",
          a: "ทุกชั้นยุบรวมเป็นชั้นเชิงเส้นชั้นเดียว เพราะ `W₂(W₁x+b₁)+b₂ = (W₂W₁)x + (W₂b₁+b₂)` ความลึกจึงไม่มีอยู่จริง เครือข่ายร้อยชั้นเท่ากับ logistic regression ตัวเดียว" },
        { q: "นิวรอนหนึ่งตัวคืออะไรในภาษาของหน้าที่แล้ว",
          a: "`a = φ(wᵀx + b)` ซึ่งถ้า φ เป็น sigmoid ก็คือ logistic regression ตัวเดียวเป๊ะ ความสามารถทั้งหมดของเครือข่ายมาจากการซ้อนกันไม่ใช่จากนิวรอนเดี่ยว" },
        { q: "ทำไมอนุพันธ์สูงสุด 0.25 ของ sigmoid ถึงเป็นปัญหา",
          a: "backpropagation คูณอนุพันธ์ต่อกันทุกชั้น ผ่าน 10 ชั้นจึงเหลืออย่างมาก 0.25¹⁰ ≈ 1e−6 ชั้นล่างแทบไม่ได้รับ gradient เลย นี่คือ vanishing gradient ในรูปเลขคณิต" },
        { q: "ReLU แก้เรื่องนั้นยังไง และสร้างปัญหาอะไรใหม่",
          a: "อนุพันธ์เป็น 1 พอดีเมื่อ z เป็นบวก จึงไม่หด gradient แต่ถ้านิวรอนถูกผลักจน z ติดลบสำหรับทุก input ทั้งค่าและ gradient จะเป็นศูนย์ตลอดกาล เรียกว่านิวรอนตาย และ leaky ReLU แก้ด้วยความชัน 0.01 ฝั่งลบ" },
        { q: "ทำไมตั้งน้ำหนักเริ่มต้นเป็นศูนย์ทั้งหมดถึงพัง",
          a: "นิวรอนทุกตัวในชั้นจะคำนวณค่าเดียวกันและรับ gradient เท่ากัน จึงอัปเดตเหมือนกันตลอด symmetry ไม่ถูกทำลาย ชั้นที่มี 128 นิวรอนจึงมีค่าเท่ากับชั้นที่มีนิวรอนเดียวถาวร" },
        { q: "bias ตั้งเป็นศูนย์ได้ไหม",
          a: "ได้และเป็นมาตรฐาน เพราะน้ำหนักที่สุ่มมาทำลาย symmetry ไปแล้ว" },
        { q: "Xavier กับ He ต่างกันยังไง ใช้ตัวไหนเมื่อไร",
          a: "Xavier ใช้ `2/(fan_in+fan_out)` อนุมานเพื่อรักษาความแปรปรวนผ่าน activation ที่สมมาตรอย่าง tanh ส่วน He ใช้ `2/fan_in` โดยเลข 2 ชดเชยที่ ReLU ตัดครึ่งทิ้ง — ใช้ He กับ ReLU ใช้ Xavier กับ tanh" },
        { q: "backpropagation คำนวณอะไรจริง ๆ",
          a: "chain rule ที่เดินย้อนจาก loss กลับไปหาทุกน้ำหนัก โดยเก็บผลระหว่างทางไว้ใช้ซ้ำ ซึ่งก็คือ reverse-mode automatic differentiation ไม่ใช่อัลกอริทึมเฉพาะของ neural network" },
        { q: "ทำไมต้องเดินย้อน ไม่เดินหน้า",
          a: "เดินหน้าต้องคำนวณหนึ่งครั้งต่อพารามิเตอร์หนึ่งตัว ส่วนเดินย้อนได้ gradient ของทุกตัวจากการเดินครั้งเดียว เมื่อมีพารามิเตอร์ล้านตัวและ output ตัวเดียว ต่างกันหนึ่งล้านเท่า" },
        { q: "เขียนรูปทั่วไปของ backpropagation หนึ่งชั้นได้ไหม",
          a: "`δ_prev = (δ W ᵀ) ⊙ φ'(z_prev)` และ `∂L/∂W = A_prevᵀ δ` — รูปนี้ซ้ำเดิมทุกชั้นไม่ว่าเครือข่ายจะลึกแค่ไหน" },
        { q: "vanishing กับ exploding gradient มาจากไหน",
          a: "จาก `∂L/∂W₁` ที่มีพจน์ `Π (Wₗᵀ · φ'(zₗ))` คูณกันทุกชั้นด้านบน ถ้าตัวคูณเล็กกว่า 1 ทั้งหมดผลคูณจะลู่เข้าศูนย์ ถ้าใหญ่กว่า 1 ทั้งหมดจะระเบิด" },
        { q: "softmax กับ cross-entropy ให้ gradient เท่าไร ทำไมสวยขนาดนั้น",
          a: "`∂L/∂z = ŷ − y` เพราะพจน์ยุ่ง ๆ จากอนุพันธ์ของ softmax ตัดกับพจน์ `1/ŷ` จากอนุพันธ์ของ log พอดี ซึ่งเป็นรูปเดียวกับ logistic regression" },
        { q: "ทำไมห้ามใส่ softmax เองก่อนส่งเข้า `CrossEntropyLoss`",
          a: "เพราะ loss ตัวนั้นทำ softmax ให้ข้างในอยู่แล้ว ใส่เองจะได้ softmax สองชั้นซึ่งทำให้ gradient เล็กลงมากและเทรนช้าลงอย่างมาก โดยไม่มี error แจ้งเลย" },
        { q: "เลือก activation ของชั้น output ยังไง",
          a: "ตามงาน ไม่ใช่ตามความชอบ — regression ไม่ใส่คู่กับ MSE, binary ใช้ sigmoid คู่กับ binary cross-entropy, multiclass เลือกตัวเดียวใช้ softmax คู่กับ categorical cross-entropy, multi-label ใช้ sigmoid แยกทุกคลาส" },
        { q: "นับพารามิเตอร์ของชั้น dense ยังไง",
          a: "`d_in · d_out + d_out` โดยพจน์หลังคือ bias — เช่น 784 ไป 128 ได้ 100,480 ตัว และควรตรงกับที่ framework รายงานเสมอ" },
        { q: "universal approximation theorem รับประกันอะไร และไม่รับประกันอะไร",
          a: "รับประกันว่ามีน้ำหนักชุดหนึ่งที่ประมาณฟังก์ชันต่อเนื่องใด ๆ ได้ด้วยชั้นซ่อนชั้นเดียวที่กว้างพอ แต่ไม่บอกว่าต้องกว้างเท่าไร ไม่รับประกันว่า gradient descent จะหาเจอ และไม่พูดถึงการ generalize เลย" },
        { q: "ทำไมต้องสเกล input ก่อนเข้าเครือข่าย",
          a: "เพราะถ้าค่าดิบใหญ่มาก `z` ของชั้นแรกจะใหญ่จนอิ่มตัวตั้งแต่รอบแรก และการที่ feature ต่าง ๆ มีสเกลไม่เท่ากันทำให้ landscape ของ loss ยืดจน gradient descent เดินคดเคี้ยว" },
        { q: "ตรวจว่า backward ที่เขียนเองถูกยังไง",
          a: "เทียบกับ finite difference สองด้าน `(L(w+ε) − L(w−ε))/2ε` ที่ ε = 1e−5 · relative error ต่ำกว่า 1e−7 คือถูก สูงกว่า 1e−4 คือมีบั๊ก · ต้องใช้สองด้านเพราะด้านเดียวมีความคลาดเคลื่อนอันดับหนึ่งซึ่งทำให้ gradient ที่ถูกดูเหมือนผิด" },
        { q: "loss ค้างที่ 2.303 พอดีบนปัญหา 10 คลาสแปลว่าอะไร",
          a: "แปลว่าโมเดลทำนายเท่ากันทุกคลาสคือไม่ได้เรียนรู้อะไรเลย เพราะ `−log(1/10) = 2.303` ให้ไปตรวจว่า label ถูกต้องและ optimizer ผูกกับพารามิเตอร์ของโมเดลจริง" },
        { q: "ขั้นแรกที่ควรทำเสมอเมื่อเครือข่ายไม่เรียนรู้คืออะไร",
          a: "ทำให้มัน overfit ข้อมูล 10 แถวให้ได้ก่อน ถ้า loss ไม่ลงใกล้ศูนย์แปลว่าปัญหาอยู่ที่โมเดลหรือ loss ไม่ใช่ที่ข้อมูลหรือ regularization และการไปจูน learning rate ตอนนั้นคือการเดาสุ่ม" },
        { q: "เครือข่ายแพ้ gradient boosting เมื่อไร",
          a: "บนข้อมูลตารางธรรมดา boosting มักชนะทั้งคะแนน เวลาเทรน และจำนวนที่ต้องจูน เครือข่ายชนะเมื่อข้อมูลมีโครงสร้างให้ใช้ประโยชน์ เช่นภาพ ลำดับ ข้อความ หรือเสียง" }
      ]},
      { h: "อ่านเพิ่ม" },
      { links: [
        { label: "3Blue1Brown — Neural Networks (ซีรีส์ 4 ตอน)", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", note: "ภาพเคลื่อนไหวของ forward กับ backpropagation ที่ชัดที่สุดเท่าที่มี" },
        { label: "CS231n — Neural Networks", url: "https://cs231n.github.io/neural-networks-1/", note: "สามตอนต่อกัน ครอบคลุม activation, initialisation และการเทรน อ่านฟรี" },
        { label: "CS231n — Backpropagation", url: "https://cs231n.github.io/optimization-2/", note: "อธิบาย backpropagation ผ่านกราฟการคำนวณ พร้อมกฎการส่ง gradient ผ่านทุก operation" },
        { label: "Deep Learning Book — บทที่ 6 Deep Feedforward Networks", url: "https://www.deeplearningbook.org/contents/mlp.html", note: "ตำราอ้างอิงมาตรฐาน อ่านฟรีบนเว็บ" },
        { label: "Understanding the difficulty of training deep feedforward neural networks", url: "https://proceedings.mlr.press/v9/glorot10a.html", note: "เปเปอร์ต้นฉบับของ Xavier initialisation พร้อมการอนุมาน" },
        { label: "Delving Deep into Rectifiers (He et al.)", url: "https://arxiv.org/abs/1502.01852", note: "เปเปอร์ต้นฉบับของ He initialisation และ PReLU" },
        { label: "PyTorch — Neural Networks tutorial", url: "https://pytorch.org/tutorials/beginner/blitz/neural_networks_tutorial.html", note: "เอกสารทางการ ตั้งแต่ nn.Module จนถึงลูปเทรน" },
        { label: "A Recipe for Training Neural Networks (Karpathy)", url: "https://karpathy.github.io/2019/04/25/recipe/", note: "ลำดับการดีบักที่หน้านี้ใช้เป็นโครง อ่านครั้งเดียวได้ประโยชน์ทั้งอาชีพ" }
      ]}
    ]
  }
});

window.TEACHING_EN = window.TEACHING_EN || {};
window.TEACHING_EN["ml_nn"] = {
  principle: [
    { h: "The one sentence that explains all of it" },
    { p: "**A neural network is a stack of linear models with a non-linear function between every pair of them.** Everything else — the activations, the weight initialisation, the depth — exists to make that stack trainable." },
    { h: "Why the activation is not decoration" },
    { code: String.raw`with no activation in between:

W₂(W₁x + b₁) + b₂ = (W₂W₁)x + (W₂b₁ + b₂)
                  = W'x + b'

a hundred linear layers = one linear layer`,
      cap: "It is not that performance degrades — depth simply does not exist", lang: "txt" },
    { note: "**If someone explains activations as a way to \"add flexibility\", they have missed the point.** They are the only reason stacking layers means anything. Remove them and the whole model collapses into a single logistic regression." },
    { h: "How this follows from the previous page" },
    { table: { head: ["Previous page", "This page"], rows: [
      ["Logistic regression is `σ(wᵀx + b)`", "**That is exactly one neuron**"],
      ["The decision boundary is always straight", "Stack layers and the boundary bends however it needs to"],
      ["The gradient is `Xᵀ(ŷ − y)`", "**Exactly the same form**, but it must be passed back through many layers"],
      ["A handful of coefficients to fit", "Tens of thousands to billions of weights to fit"]
    ]}},
    { h: "Vocabulary that must not blur together" },
    { table: { head: ["Term", "What it means"], rows: [
      ["**Neuron**", "`a = φ(wᵀx + b)` — one linear model with an activation on the end"],
      ["**Layer**", "Many neurons sharing an input: `a = φ(Wx + b)`"],
      ["**Forward pass**", "Input to prediction, one matrix multiply per layer"],
      ["**Backward pass**", "Computing `∂L/∂W` for every layer with the chain rule, backwards"],
      ["**Epoch**", "One complete sweep over the training set"],
      ["**Batch**", "The examples whose gradients are averaged before a single update"]
    ]}},
    { note: "**An epoch is not one update, and a batch is not a layer.** Blur these at the start and the whole discussion of learning rate and batch size on the next page becomes unreadable." },
    { h: "What this page will let you do" },
    { ul: [
      "Walk a forward and a backward pass by hand on a small network and check it against finite differences",
      "Know why sigmoid makes deep networks untrainable and how ReLU fixes it",
      "Know why initialising the weights to zero breaks a network permanently rather than merely slowing it down",
      "Pair the output activation with the loss according to the task",
      "Count the parameters of every layer, and read a shape error"
    ]}
  ],

  theory: [
    { p: "This section assembles the network one piece at a time, each piece arriving with the problem it solves." },
    { h: "1) A single neuron" },
    { code: String.raw`z = w₁x₁ + w₂x₂ + ... + w_d x_d + b     a linear combination
a = φ(z)                                 through an activation

if φ = sigmoid  -> this is precisely one logistic regression`,
      cap: "There is nothing new in a single neuron — all of the capability comes from stacking", lang: "txt" },
    { h: "2) One layer" },
    { code: String.raw`h neurons sharing one input, written as a single matrix operation:

X   (N, d_in)      N examples
W   (d_in, h)
b   (h,)

Z = X W + b        (N, h)
A = φ(Z)           (N, h)`,
      cap: "One layer = one matrix multiply, one bias add, one activation", lang: "txt" },
    { code: String.raw`parameters in a dense layer = d_in · d_out + d_out
                              ‾‾‾‾‾‾‾‾‾‾‾   ‾‾‾‾‾
                              weights        biases

784 -> 128 : 784·128 + 128 = 100,480
128 -> 10  : 128·10 + 10   = 1,290
total                         101,770`,
      cap: "You can always count this yourself, and it must match what the framework reports — if it does not, you have misread your own architecture", lang: "txt" },
    { h: "3) Each activation and the problem it addresses" },
    { table: { head: ["Function", "Range", "Derivative", "Fixes / where it fails"], rows: [
      ["**sigmoid**", "(0,1)", "peaks at 0.25", "Saturates at both ends · **depth multiplies gradients to nothing**"],
      ["**tanh**", "(−1,1)", "peaks at 1.0", "Zero-centred so better than sigmoid, but still saturates"],
      ["**ReLU**", "[0,∞)", "1 or 0", "Does not shrink the gradient on the positive side · but **a neuron can die permanently**"],
      ["**leaky ReLU**", "ℝ", "1 or 0.01", "Directly fixes the dead neuron"],
      ["**GELU**", "ℝ", "smooth everywhere", "What transformers use · smoother than ReLU"],
      ["**softmax**", "sums to 1", "—", "**Output layer only**, for mutually exclusive classes"]
    ]}},
    { code: String.raw`sigmoid:  σ(z) = 1/(1+e⁻ᶻ)       σ'(z) = σ(z)(1−σ(z))
tanh:     tanh(z)                 1 − tanh²(z)
ReLU:     max(0, z)               1 if z>0 · 0 if z<0
leaky:    max(0.01z, z)           1 if z>0 · 0.01 if z<0`,
      cap: "The derivative is the only thing backpropagation ever needs, which is what decides whether an activation is usable at all", lang: "txt" },
    { note: "**Sigmoid's derivative peaking at 0.25 is not trivia.** Across 10 layers the gradient is multiplied by something no larger than 0.25 ten times, leaving at most 0.25¹⁰ ≈ 1e−6. That is the arithmetic reason deep sigmoid networks could not be trained, and the reason ReLU changed the field." },
    { h: "4) Dead neurons — the price of ReLU" },
    { code: String.raw`if the weights are pushed until z < 0 for every input:
   a  = 0        nothing goes forward
   a' = 0        the gradient flowing back is zero
   -> the weights are never updated again, ever

usually caused by too high a learning rate early in training`,
      cap: "Leaky ReLU keeps a slope of 0.01 on the negative side, which is enough for the neuron to recover", lang: "txt" },
    { h: "5) The output layer follows the task, not preference" },
    { table: { head: ["Task", "Output activation", "Loss"], rows: [
      ["**Regression**", "none", "MSE"],
      ["**Binary classification**", "sigmoid", "binary cross-entropy"],
      ["**Multiclass, one label**", "softmax", "categorical cross-entropy"],
      ["**Multi-label**", "sigmoid per class", "binary cross-entropy per class"]
    ]}},
    { p: "**Softmax with cross-entropy gives** `∂L/∂z = ŷ − y` — exactly the form logistic regression had on the previous page. The messy terms cancel perfectly, which is why the two were designed to be used together." },
    { note: "**Frameworks fuse the two steps for numerical stability.** PyTorch's `CrossEntropyLoss` and Keras's `from_logits=True` take logits, not probabilities. Applying softmax yourself and then feeding it into one of those losses is the most common and the quietest bug there is." },
    { h: "6) A complete forward pass with shapes" },
    { code: String.raw`X   (N, 784)
W₁  (784, 128)  b₁ (128,)   ->  Z₁ = X W₁ + b₁     (N, 128)
                                 A₁ = ReLU(Z₁)      (N, 128)
W₂  (128, 10)   b₂ (10,)    ->  Z₂ = A₁ W₂ + b₂    (N, 10)
                                 Ŷ  = softmax(Z₂)   (N, 10)`,
      cap: "Always annotate every line with its shape — most \"it will not run\" problems are shape problems", lang: "txt" },
    { h: "7) What backpropagation really is" },
    { p: "**It is the chain rule walked backwards from the loss to every weight, keeping the intermediate results to reuse them.** It is not a special neural network algorithm — it is reverse-mode automatic differentiation, which applies to any computation graph." },
    { code: String.raw`δ₂ = Ŷ − Y                        (N, 10)   <- from softmax + cross-entropy
∂L/∂W₂ = A₁ᵀ δ₂ / N               (128, 10)
∂L/∂b₂ = mean(δ₂, axis 0)         (10,)

δ₁ = (δ₂ W₂ᵀ) ⊙ ReLU'(Z₁)         (N, 128)  <- pass back, then multiply by the derivative
∂L/∂W₁ = Xᵀ δ₁ / N                (784, 128)
∂L/∂b₁ = mean(δ₁, axis 0)         (128,)`,
      cap: "The same pattern repeats at every layer: send δ back through Wᵀ, then multiply by that layer's activation derivative", lang: "txt" },
    { p: "**Why backwards rather than forwards**: forward mode costs one pass per parameter, while reverse mode gets the gradient of every parameter from a single pass. With a million parameters and one output, that is a factor of a million." },
    { h: "8) Vanishing and exploding gradients" },
    { code: String.raw`∂L/∂W₁ contains  Π (Wₗᵀ · φ'(zₗ))   multiplied over every layer above it

every factor < 1  ->  product -> 0    vanishing: the lower layers barely train
every factor > 1  ->  product -> ∞    exploding: weights blow up, loss becomes NaN`,
      cap: "This single equation explains ReLU, He initialisation, normalisation, residual connections and gradient clipping all at once", lang: "txt" },
    { h: "9) Universal approximation — and what it does not promise" },
    { p: "The theorem says that **a single hidden layer of sufficient width can approximate any continuous function on a compact domain to arbitrary accuracy**." },
    { table: { head: ["It does not say", "The reality"], rows: [
      ["How wide it has to be", "Possibly exponentially wide, and therefore useless in practice"],
      ["Whether gradient descent will find those weights", "**No guarantee at all** — the theorem is about existence only"],
      ["Whether it will generalise", "Entirely out of scope; the theorem never mentions unseen data"]
    ]}},
    { note: "**In practice deep and narrow beats shallow and wide**, for reasons this theorem says nothing about. Anyone citing it as evidence that a network \"will work\" has misread it." },
    { h: "10) Where neural networks lose" },
    { p: "**On ordinary tabular data, gradient boosting usually beats a neural network** on score, on training time, and on how much has to be tuned. Networks win where there is structure to exploit — images, sequences, text, audio — which is what pages 7 through 9 are about." }
  ],

  foundations: [
    { p: "This section digs into the mechanics that decide whether a network trains at all." },
    { h: "Why all-zero weights break it permanently" },
    { code: String.raw`if W = 0 across a layer:
   every neuron in the layer computes the same value
   -> every neuron receives the same gradient
   -> they update identically -> they are still identical

a 128-neuron layer therefore equals a 1-neuron layer, forever`,
      cap: "This is called failing to break symmetry — not slow training, but a layer whose width means nothing", lang: "txt" },
    { p: "**Biases at zero is perfectly fine**, because the randomly drawn weights have already broken the symmetry." },
    { h: "How Xavier and He differ" },
    { code: String.raw`Xavier / Glorot:  Var(W) = 2 / (fan_in + fan_out)
   derived to preserve signal variance through symmetric activations (tanh, sigmoid)

He:               Var(W) = 2 / fan_in
   the factor 2 compensates for ReLU zeroing half of its inputs`,
      cap: "Use He with ReLU and Xavier with tanh — swap them and the signal shrinks or grows layer by layer", lang: "txt" },
    { code: String.raw`demonstrated numerically: 50 ReLU layers, 512 units wide

init N(0, 0.01)  -> per-layer factor 0.16  -> std at layer 50 ≈ 1e−40   the signal is gone
init Xavier      -> per-layer factor 0.71  -> std at layer 50 ≈ 1e−8    it vanishes too
init He          -> per-layer factor 1.00  -> std stays near 1        it trains`,
      cap: "**Xavier with ReLU shrinks the signal by 1/√2 per layer**, which is exactly the factor of 2 that He puts back — so initialisation is not a detail; a deep network simply will not train if it is wrong", lang: "txt" },
    { h: "Input scaling matters just as much" },
    { p: "**A network must always be fed scaled inputs** — divide images by 255 to reach [0,1], or standardise to zero mean. Feed it raw values with wildly different units and the first layer produces a `z` so large that it saturates on the very first pass." },
    { h: "Reading the softmax equation correctly" },
    { code: String.raw`softmax(z)ᵢ = e^zᵢ / Σⱼ e^zⱼ

problem: large z makes e^z overflow
the fix every framework uses: subtract the maximum first

softmax(z)ᵢ = e^(zᵢ − max z) / Σⱼ e^(zⱼ − max z)      <- mathematically identical`,
      cap: "This is one of the reasons to let the framework compute softmax and the loss together", lang: "txt" },
    { h: "Why cross-entropy pairs exactly with softmax" },
    { code: String.raw`L = −Σ yᵢ log ŷᵢ        with  ŷ = softmax(z)

∂L/∂zᵢ = ŷᵢ − yᵢ

the terms that ought to be messy, from the softmax derivative,
cancel exactly against the 1/ŷ from the derivative of the log`,
      cap: "The result is the cleanest gradient available, and it does not saturate when the prediction is badly wrong", lang: "txt" },
    { h: "Parameter count against overfitting" },
    { table: { head: ["Architecture", "Parameters", "Note"], rows: [
      ["784 -> 10", "7,850", "Multiclass logistic regression, no hidden layer"],
      ["784 -> 128 -> 10", "101,770", "Enough for MNIST's 60,000 images"],
      ["784 -> 512 -> 512 -> 10", "669,706", "**More parameters than examples** — must be regularised"],
      ["784 -> 2048 -> 2048 -> 10", "5.8M", "Will memorise the training set outright if unconstrained"]
    ]}},
    { note: "**Networks with more parameters than examples still work well**, which contradicts the instinct classical models teach. The reason has to do with gradient descent itself preferring smooth solutions — not with regularisation being unnecessary." },
    { h: "Checking the gradient with finite differences" },
    { code: String.raw`two-sided (use this one):
   (L(w+ε) − L(w−ε)) / 2ε     error O(ε²)

one-sided (do not):
   (L(w+ε) − L(w)) / ε        error O(ε) — a correct gradient will look wrong

ε = 1e−5
relative error < 1e−7   correct
relative error > 1e−4   there is a bug`,
      cap: "Checking a few randomly chosen weights is enough, and turn off everything random first, such as dropout", lang: "txt" },
    { h: "Why batching helps" },
    { table: { head: ["Batch size", "Effect"], rows: [
      ["**1 (true SGD)**", "Frequent updates · very noisy gradients · poor use of a GPU"],
      ["**32-256**", "**The range people actually use** — balances noise against speed"],
      ["**Very large (4096+)**", "Smooth gradients · but needs a higher learning rate and often tests slightly worse"]
    ]}},
    { p: "**The noise from small batches is not purely a cost** — it helps escape poor regions, which amounts to accidental regularisation." }
  ],

  architecture: [
    { p: "This section is about choosing the architecture and the order of decisions that does not waste time." },
    { h: "Choosing depth and width" },
    { code: String.raw`start with: 1-2 hidden layers, 64-256 wide
   -> if underfitting (high train loss): widen first, then deepen
   -> if overfitting (low train, high val): more data · dropout · weight decay
   -> add depth when you know there is layered structure to learn`,
      cap: "Always fix the problem you measured, rather than enlarging the architecture because it feels like it should help", lang: "txt" },
    { h: "Shapes people actually use" },
    { table: { head: ["Shape", "Example", "When"], rows: [
      ["**Funnel**", "512 -> 256 -> 128 -> 10", "The safest default"],
      ["**Constant**", "256 -> 256 -> 256 -> 10", "Easier to adjust, and usually no worse than a funnel"],
      ["**Bottleneck**", "512 -> 32 -> 512", "Autoencoders · forces compression"]
    ]}},
    { h: "Everything a single network is made of" },
    { code: String.raw`architecture     number of layers · width · activation
initialisation   He (ReLU) or Xavier (tanh)
loss             follows the task — never a matter of preference
optimizer        Adam as the default (details on the next page)
learning rate    always the single most important knob
batch size       32-256
regularisation   dropout · weight decay · early stopping`,
      cap: "These six lines are everything that has to be decided before the first training run", lang: "txt" },
    { h: "The experiment order that saves the most time" },
    { code: String.raw`1. make it overfit 10 rows first             <- proves the code is right
2. train on the full set with defaults, look at the loss curves
3. tune the learning rate (worth more than everything else combined)
4. add regularisation once the train/val gap is clear
5. only then enlarge the architecture, if it is still underfitting`,
      cap: "Step 1 takes under a minute and eliminates half of the possible causes", lang: "txt" },
    { note: "**Step 1 is the step people skip most often and lose the most time by skipping.** If the network cannot drive the loss on 10 rows to near zero, the problem is in the model or the loss, not in the data or the regularisation — and tuning the learning rate at that point is pure guesswork." },
    { h: "A diagram with every part present" },
    { code: String.raw`  input (N, d)
      |
  [Linear d->h]   W₁ b₁
      |
  [ReLU]                      <- without this, depth is gone
      |
  [Dropout p=0.2]             <- training only
      |
  [Linear h->C]   W₂ b₂
      |
  logits (N, C)               <- this goes into the loss; no softmax here
      |
  [CrossEntropyLoss]`,
      cap: "The most frequently botched line is the second to last — applying softmax yourself and feeding a loss that expects logits", lang: "txt" },
    { h: "Networks on tabular data — stated plainly" },
    { table: { head: ["Situation", "Use"], rows: [
      ["A table of tens of thousands of rows", "**Gradient boosting** — faster, less tuning, usually more accurate"],
      ["Images", "CNN (page 7)"],
      ["Sequences or text", "Transformers (pages 8-9)"],
      ["A table that must be combined with text or images in one model", "A network, because it can fuse several modalities"]
    ]}}
  ],

  dataflow: [
    { p: "A full forward and backward pass with real numbers on a 2-2-1 network, ending in updated weights." },
    { h: "Setting it up" },
    { code: String.raw`a 2 -> 2 -> 1 network · hidden activation ReLU · output sigmoid
loss = binary cross-entropy

input   x = [1.0, 0.5]        target y = 1

W₁ = [[0.3, −0.2],            b₁ = [0.1, 0.0]
      [0.4,  0.6]]
W₂ = [[0.7], [−0.5]]          b₂ = [0.2]`,
      cap: "Numbers small enough to follow every line with a calculator", lang: "txt" },
    { h: "Forward — the hidden layer" },
    { code: String.raw`z₁ = x·W₁ + b₁
z₁[0] = 1.0(0.3) + 0.5(0.4) + 0.1 = 0.3 + 0.2 + 0.1 = 0.60
z₁[1] = 1.0(−0.2) + 0.5(0.6) + 0.0 = −0.2 + 0.3     = 0.10

a₁ = ReLU(z₁) = [0.60, 0.10]     both positive, so both pass through`,
      cap: "Had either been negative it would become 0, and the gradient through it would be 0 as well", lang: "txt" },
    { h: "Forward — the output layer" },
    { code: String.raw`z₂ = a₁·W₂ + b₂
   = 0.60(0.7) + 0.10(−0.5) + 0.2
   = 0.42 − 0.05 + 0.2 = 0.57

ŷ = σ(0.57) = 1/(1+e^−0.57) = 0.6388`,
      cap: "It predicts 0.6388 where the target is 1 — still too low", lang: "txt" },
    { h: "The loss" },
    { code: String.raw`L = −[y log ŷ + (1−y) log(1−ŷ)]
  = −[1 · log(0.6388) + 0]
  = −log(0.6388) = 0.4482`,
      cap: "A perfect prediction gives 0, a coin flip gives 0.693, so this sits in between and on the good side", lang: "txt" },
    { h: "Backward — starting at the output" },
    { code: String.raw`sigmoid paired with binary cross-entropy gives:
δ₂ = ŷ − y = 0.6388 − 1 = −0.3612

∂L/∂W₂ = a₁ᵀ δ₂ = [0.60, 0.10]ᵀ × (−0.3612)
                 = [−0.2167, −0.0361]
∂L/∂b₂ = δ₂ = −0.3612`,
      cap: "The negative sign means the weights must increase, because the update subtracts the gradient", lang: "txt" },
    { h: "Backward — sending it into the hidden layer" },
    { code: String.raw`first pass it through W₂ᵀ:
   δ₂ W₂ᵀ = −0.3612 × [0.7, −0.5] = [−0.2529, 0.1806]

then multiply by the ReLU derivative (both z₁ are positive, so both are 1):
   δ₁ = [−0.2529, 0.1806] ⊙ [1, 1] = [−0.2529, 0.1806]`,
      cap: "Had z₁[1] been negative, the second entry would become 0 and that row of weights would never update", lang: "txt" },
    { h: "Backward — the first layer's gradient" },
    { code: String.raw`∂L/∂W₁ = xᵀ δ₁     x = [1.0, 0.5]

        = [[1.0(−0.2529), 1.0(0.1806)],
           [0.5(−0.2529), 0.5(0.1806)]]

        = [[−0.2529,  0.1806],
           [−0.1264,  0.0903]]

∂L/∂b₁ = δ₁ = [−0.2529, 0.1806]`,
      cap: "The second row is exactly half the first, because x[1] = 0.5 — a smaller input receives a smaller correction", lang: "txt" },
    { h: "Updating the weights" },
    { code: String.raw`η = 0.1

new W₂ = [[0.7], [−0.5]] − 0.1 × [[−0.2167], [−0.0361]]
       = [[0.7217], [−0.4964]]
new b₂ = 0.2 − 0.1(−0.3612) = 0.2361

new W₁ = [[0.3, −0.2], [0.4, 0.6]] − 0.1 × [[−0.2529, 0.1806],
                                             [−0.1264, 0.0903]]
       = [[0.3253, −0.2181],
          [0.4126,  0.5910]]
new b₁ = [0.1, 0.0] − 0.1 × [−0.2529, 0.1806] = [0.1253, −0.0181]`,
      cap: "Every weight moves in the direction that lowers the loss for this example", lang: "txt" },
    { h: "Confirming it actually improved" },
    { code: String.raw`forward again with the updated weights:
z₁ = [0.6569, 0.0594]  ->  a₁ = [0.6569, 0.0594]
z₂ = 0.6569(0.7217) + 0.0594(−0.4964) + 0.2361 = 0.6807
ŷ  = σ(0.6807) = 0.6639

new L = −log(0.6639) = 0.4096      (was 0.4482)`,
      cap: "The loss fell from 0.4482 to 0.4096 in one step — that is all training is, repeated a few million times", lang: "txt" },
    { note: "**If you can follow every line above, you understand backpropagation properly.** Everything on the next page is about doing this same thing faster and more stably." },
    { h: "Why batches rather than one example at a time" },
    { code: String.raw`one at a time:  the gradient from a single example is a very noisy direction
batch of 32:    the average over 32 is a far steadier direction

and one (32, 784) × (784, 128) multiply
is dramatically faster on a GPU than thirty-two (1, 784) × (784, 128) multiplies`,
      cap: "The reasons are both statistical and hardware-related, and both point the same way", lang: "txt" }
  ],

  implementation: [
    { p: "Write the network from scratch in NumPy first, then check it against PyTorch." },
    { h: "1) A complete network in NumPy" },
    { code: String.raw`import numpy as np

def init(sizes, seed=0):
    rng = np.random.default_rng(seed)
    params = []
    for a, b in zip(sizes[:-1], sizes[1:]):
        W = rng.normal(0, np.sqrt(2.0 / a), (a, b))   # He initialisation
        params.append([W, np.zeros(b)])
    return params

def relu(z):        return np.maximum(0, z)
def relu_grad(z):   return (z > 0).astype(float)

def softmax(z):
    z = z - z.max(axis=1, keepdims=True)              # guard against overflow
    e = np.exp(z)
    return e / e.sum(axis=1, keepdims=True)`,
      cap: "`np.sqrt(2.0 / a)` is He initialisation exactly as derived — the 2 compensates for ReLU discarding half the signal", lang: "python" },
    { h: "2) A forward pass that caches what backward needs" },
    { code: String.raw`def forward(params, X):
    cache = [X]
    A = X
    for i, (W, b) in enumerate(params):
        Z = A @ W + b
        A = softmax(Z) if i == len(params) - 1 else relu(Z)
        cache += [Z, A]
    return A, cache`,
      cap: "Every layer's Z must be kept because backward needs `relu_grad(Z)` — this is where a network's training-time memory goes", lang: "python" },
    { h: "3) Backward" },
    { code: String.raw`def backward(params, cache, Y):
    N = Y.shape[0]
    grads = [None] * len(params)
    A_last = cache[-1]
    delta = (A_last - Y) / N                 # softmax + cross-entropy

    for i in range(len(params) - 1, -1, -1):
        A_prev = cache[2 * i]
        grads[i] = [A_prev.T @ delta, delta.sum(axis=0)]
        if i > 0:
            Z_prev = cache[2 * i - 1]
            delta = (delta @ params[i][0].T) * relu_grad(Z_prev)
    return grads`,
      cap: "Two lines inside the loop are the whole of backpropagation — send it back through `W.T`, multiply by the activation derivative", lang: "python" },
    { h: "4) The training loop" },
    { code: String.raw`def train(params, X, Y, epochs=30, lr=0.1, bs=64, seed=0):
    rng = np.random.default_rng(seed)
    n = X.shape[0]
    for ep in range(epochs):
        idx = rng.permutation(n)             # reshuffle every epoch
        for s in range(0, n, bs):
            b = idx[s:s + bs]
            out, cache = forward(params, X[b])
            grads = backward(params, cache, Y[b])
            for p, g in zip(params, grads):
                p[0] -= lr * g[0]
                p[1] -= lr * g[1]
        loss = -np.mean(np.sum(Y * np.log(forward(params, X)[0] + 1e-12), axis=1))
        print(f"epoch {ep:3d}  loss {loss:.4f}")`,
      cap: "`+ 1e-12` guards against `log(0)`, which returns `-inf` and turns the whole loss into NaN", lang: "python" },
    { h: "5) Check the gradient before believing any result" },
    { code: String.raw`def grad_check(params, X, Y, eps=1e-5):
    def loss_of(p):
        out, _ = forward(p, X)
        return -np.mean(np.sum(Y * np.log(out + 1e-12), axis=1))

    out, cache = forward(params, X)
    grads = backward(params, cache, Y)

    W = params[0][0]; g = grads[0][0]
    i, j = 0, 0
    orig = W[i, j]
    W[i, j] = orig + eps; lp = loss_of(params)
    W[i, j] = orig - eps; lm = loss_of(params)
    W[i, j] = orig

    num = (lp - lm) / (2 * eps)
    print(f"analytic {g[i, j]:.10f}  numeric {num:.10f}  "
          f"rel {abs(num - g[i,j]) / max(abs(num), abs(g[i,j])):.2e}")
# analytic 0.0142387100  numeric 0.0142387099  rel 7.0e-09`,
      cap: "A `rel` below 1e−7 is correct; above 1e−4 there is definitely a bug in backward", lang: "python" },
    { h: "6) The same network in PyTorch" },
    { code: String.raw`import torch, torch.nn as nn

model = nn.Sequential(
    nn.Linear(784, 128),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(128, 10),          # no softmax here
)

loss_fn = nn.CrossEntropyLoss()  # takes logits and applies softmax internally
opt = torch.optim.Adam(model.parameters(), lr=1e-3)`,
      cap: "**Never put** `nn.Softmax` **before** `CrossEntropyLoss` — you get softmax twice, which slows training badly and raises no error at all", lang: "python" },
    { h: "7) The PyTorch training loop" },
    { code: String.raw`for epoch in range(epochs):
    model.train()
    for xb, yb in train_loader:
        opt.zero_grad()              # forget this and gradients accumulate
        loss = loss_fn(model(xb), yb)
        loss.backward()
        opt.step()

    model.eval()                     # disables dropout, changes batchnorm behaviour
    with torch.no_grad():
        val = sum(loss_fn(model(xb), yb).item() for xb, yb in val_loader)
    print(f"epoch {epoch}  val {val / len(val_loader):.4f}")`,
      cap: "The three most commonly forgotten lines: `zero_grad`, `model.eval()`, and `torch.no_grad()`", lang: "python" },
    { h: "8) Always overfit 10 rows first" },
    { code: String.raw`xb, yb = next(iter(train_loader))
xb, yb = xb[:10], yb[:10]

for step in range(500):
    opt.zero_grad()
    loss = loss_fn(model(xb), yb)
    loss.backward()
    opt.step()
    if step % 100 == 0:
        print(step, round(loss.item(), 5))

# 0    2.31421
# 100  0.04127
# 400  0.00019      <- correct, the code works`,
      cap: "If the loss will not approach zero, the problem is the model or the loss and not the data — stop tuning anything else and go find it", lang: "python" },
    { h: "9) Inspect activation and gradient statistics per layer" },
    { code: String.raw`for name, p in model.named_parameters():
    if p.grad is not None:
        print(f"{name:20s} grad norm {p.grad.norm().item():.3e}")

# 0.weight   grad norm 3.201e-03
# 2.weight   grad norm 1.884e-02      <- within one order of magnitude = healthy

# if you see this instead:
# 0.weight   grad norm 4.1e-09        <- clearly vanishing
# 6.weight   grad norm 2.7e-02`,
      cap: "Gradient norms differing by several orders of magnitude between the top and bottom layers is vanishing gradient made visible", lang: "python" },
    { h: "10) Count parameters and reconcile with your own arithmetic" },
    { code: String.raw`total = sum(p.numel() for p in model.parameters())
trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
print(total, trainable)
# 101770 101770

# check against the hand count: 784·128 + 128 + 128·10 + 10 = 101,770`,
      cap: "If the number does not match what you counted, you have misunderstood your own architecture", lang: "python" }
  ],

  tricks: [
    { h: "Diagnosing by symptom" },
    { table: { head: ["Symptom", "The most common cause", "Fix"], rows: [
      ["The loss becomes **NaN**", "Learning rate too high · `log(0)` · division by zero", "Cut the lr tenfold · add `+1e-12` inside the log · use a loss that takes logits"],
      ["The loss sticks at **2.303** (10 classes)", "Nothing is being learned — that is `−log(1/10)`", "Check the labels are right · check the optimizer really holds the model's parameters"],
      ["The loss never moves from the start", "Missing `zero_grad` · lr too small · unscaled inputs", "Overfit 10 rows to isolate the cause"],
      ["Train is great, validation is poor", "Overfitting", "Dropout · weight decay · early stopping · more data"],
      ["Both train and validation are poor", "Underfitting, or a bug", "Overfit 10 rows first; if that fails it is a bug"],
      ["Evaluation differs wildly from training", "Forgot `model.eval()`", "Dropout is still active while you measure"],
      ["A whole layer outputs zeros", "**The entire ReLU layer is dead**", "Lower the lr · use leaky ReLU · check the initialisation"],
      ["Lower-layer gradients are orders of magnitude smaller", "Vanishing gradients", "ReLU · He init · normalisation · residual connections"],
      ["Training is far slower than it should be", "Softmax applied manually into a logit loss", "Remove the softmax from the model"]
    ]}},
    { h: "Defaults you can use as they are" },
    { code: String.raw`hidden activation   ReLU
initialisation      He
optimizer           Adam, lr = 1e-3
batch size          32-128
dropout             0.1-0.3 (after the activation, not before)
loss                CrossEntropyLoss, with the model emitting logits
input scaling       always mandatory`,
      cap: "This set works on most problems without thought, and gives you somewhere to tune from", lang: "txt" },
    { h: "The five quietest bugs" },
    { ul: [
      "**Applying softmax yourself and feeding** `CrossEntropyLoss` — no error, but training slows badly",
      "**Forgetting** `opt.zero_grad()` — gradients accumulate across batches",
      "**Forgetting** `model.eval()` when measuring — dropout stays on and the numbers wobble",
      "**Not scaling the inputs** — the first layer saturates on the very first step",
      "**Shuffling wrongly**, for instance shuffling X without applying the same index to y"
    ]},
    { h: "When to add depth" },
    { table: { head: ["Signal", "What to do"], rows: [
      ["Train loss still high (underfitting)", "**Widen first**, then deepen"],
      ["Train low, validation high (overfitting)", "**Do not enlarge** — add regularisation or data"],
      ["Both flatten out together", "Tune the learning rate, or train longer"],
      ["The data has layered structure, such as images or text", "Change the architecture rather than stacking more dense layers"]
    ]}},
    { note: "**The learning rate matters more than everything else combined** — too high and the loss spikes or goes NaN, too low and the model looks like it is not learning even though the code is correct. If you can only tune one thing, tune that. Optimizers and learning rate schedules are the next page." }
  ],

  eval: [
    { p: "The questions that separate understanding the mechanism from knowing how to call a framework." },
    { qa: [
      { q: "What happens if you remove the activations from a deep network?",
        a: "Every layer collapses into a single linear layer, because `W₂(W₁x+b₁)+b₂ = (W₂W₁)x + (W₂b₁+b₂)`. Depth ceases to exist and a hundred-layer network equals one logistic regression." },
      { q: "What is a single neuron, in the language of the previous page?",
        a: "`a = φ(wᵀx + b)`, which with a sigmoid is exactly one logistic regression. All of a network's capability comes from stacking, not from the individual neuron." },
      { q: "Why is sigmoid's maximum derivative of 0.25 a problem?",
        a: "Backpropagation multiplies the derivatives together layer by layer, so across 10 layers at most 0.25¹⁰ ≈ 1e−6 survives and the lower layers receive almost no gradient. That is the vanishing gradient problem in arithmetic form." },
      { q: "How does ReLU fix that, and what new problem does it create?",
        a: "Its derivative is exactly 1 when z is positive, so it does not shrink the gradient. But if a neuron is pushed until z is negative for every input, both its output and its gradient are zero forever — a dead neuron, which leaky ReLU fixes with a 0.01 slope on the negative side." },
      { q: "Why does initialising every weight to zero break the network?",
        a: "Every neuron in a layer computes the same value and receives the same gradient, so they update identically and stay identical. Symmetry is never broken, and a 128-neuron layer is permanently equivalent to a single neuron." },
      { q: "Can biases be initialised to zero?",
        a: "Yes, and that is standard — the randomly drawn weights have already broken the symmetry." },
      { q: "How do Xavier and He differ, and when do you use each?",
        a: "Xavier uses `2/(fan_in+fan_out)`, derived to preserve variance through symmetric activations like tanh. He uses `2/fan_in`, where the 2 compensates for ReLU discarding half the signal — use He with ReLU and Xavier with tanh." },
      { q: "What does backpropagation actually compute?",
        a: "The chain rule walked backwards from the loss to every weight, caching intermediate results for reuse. It is reverse-mode automatic differentiation, not an algorithm specific to neural networks." },
      { q: "Why backwards rather than forwards?",
        a: "Forward mode costs one pass per parameter, while reverse mode delivers every parameter's gradient from a single pass. With a million parameters and one output, that is a factor of a million." },
      { q: "Can you write the general form of backpropagation through one layer?",
        a: "`δ_prev = (δ Wᵀ) ⊙ φ'(z_prev)` and `∂L/∂W = A_prevᵀ δ`. That form repeats identically at every layer no matter how deep the network is." },
      { q: "Where do vanishing and exploding gradients come from?",
        a: "From `∂L/∂W₁` containing `Π (Wₗᵀ · φ'(zₗ))` multiplied across every layer above. If all the factors are below 1 the product goes to zero; if all are above 1 it explodes." },
      { q: "What gradient does softmax with cross-entropy give, and why is it so clean?",
        a: "`∂L/∂z = ŷ − y`, because the messy terms from the softmax derivative cancel exactly against the `1/ŷ` from the derivative of the log — the same form logistic regression has." },
      { q: "Why must you not apply softmax yourself before `CrossEntropyLoss`?",
        a: "Because that loss already applies softmax internally, so doing it yourself gives softmax twice, which shrinks the gradient badly and slows training dramatically — with no error raised at all." },
      { q: "How do you choose the output layer's activation?",
        a: "By the task, not by preference — regression uses none with MSE, binary uses sigmoid with binary cross-entropy, single-label multiclass uses softmax with categorical cross-entropy, and multi-label uses a separate sigmoid per class." },
      { q: "How do you count a dense layer's parameters?",
        a: "`d_in · d_out + d_out`, the second term being the biases — 784 to 128 gives 100,480, and it should always match what the framework reports." },
      { q: "What does the universal approximation theorem guarantee, and what does it not?",
        a: "It guarantees that some set of weights approximates any continuous function with one sufficiently wide hidden layer. It says nothing about how wide, gives no guarantee that gradient descent will find those weights, and never addresses generalisation." },
      { q: "Why must inputs be scaled before entering a network?",
        a: "Because large raw values make the first layer's `z` big enough to saturate on the first pass, and features on different scales stretch the loss landscape so that gradient descent zigzags." },
      { q: "How do you verify a hand-written backward pass?",
        a: "Compare against the two-sided finite difference `(L(w+ε) − L(w−ε))/2ε` at ε = 1e−5. A relative error below 1e−7 is correct and above 1e−4 is a bug. The two-sided form is required because the one-sided version has first-order error and makes a correct gradient look wrong." },
      { q: "What does a loss stuck at exactly 2.303 on a 10-class problem mean?",
        a: "That the model predicts every class equally and is learning nothing, since `−log(1/10) = 2.303`. Check that the labels are correct and that the optimizer is actually holding the model's parameters." },
      { q: "What is the first thing to do when a network will not learn?",
        a: "Make it overfit 10 rows. If the loss will not fall to near zero, the problem is in the model or the loss rather than the data or the regularisation, and tuning the learning rate at that point is guesswork." },
      { q: "When do networks lose to gradient boosting?",
        a: "On ordinary tabular data, where boosting usually wins on score, on training time, and on how much has to be tuned. Networks win when the data has structure to exploit — images, sequences, text or audio." }
    ]},
    { h: "Further reading" },
    { links: [
      { label: "3Blue1Brown — Neural Networks (four-part series)", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", note: "The clearest animated treatment of the forward pass and backpropagation there is" },
      { label: "CS231n — Neural Networks", url: "https://cs231n.github.io/neural-networks-1/", note: "Three consecutive notes covering activations, initialisation and training, free to read" },
      { label: "CS231n — Backpropagation", url: "https://cs231n.github.io/optimization-2/", note: "Explains backpropagation through computation graphs, with the gradient rule for every operation" },
      { label: "Deep Learning Book — chapter 6, Deep Feedforward Networks", url: "https://www.deeplearningbook.org/contents/mlp.html", note: "The standard reference text, readable free online" },
      { label: "Understanding the difficulty of training deep feedforward neural networks", url: "https://proceedings.mlr.press/v9/glorot10a.html", note: "The original Xavier initialisation paper, with the derivation" },
      { label: "Delving Deep into Rectifiers (He et al.)", url: "https://arxiv.org/abs/1502.01852", note: "The original He initialisation and PReLU paper" },
      { label: "PyTorch — Neural Networks tutorial", url: "https://pytorch.org/tutorials/beginner/blitz/neural_networks_tutorial.html", note: "The official walkthrough, from nn.Module to the training loop" },
      { label: "A Recipe for Training Neural Networks (Karpathy)", url: "https://karpathy.github.io/2019/04/25/recipe/", note: "The debugging order this page is built on; worth reading once for a whole career" }
    ]}
  ]
};
