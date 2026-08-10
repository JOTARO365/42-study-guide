/* Linear & Logistic Regression — สองโมเดลที่ยังเป็นค่าเริ่มต้นที่ถูกต้อง */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

window.TEACHING_DATA.push({
  id: "ml_linear",
  name: "Linear & Logistic Regression — จากสมการถึงการตีความ",
  nameEn: "Linear & Logistic Regression — From the Equation to the Interpretation",
  titleShort: { th: "Linear & Logistic Regression", en: "Linear & Logistic Regression" },
  tag: {
    th: "สองโมเดลที่เก่าที่สุดและยังเป็นค่าเริ่มต้นที่ถูกต้องที่สุด — อนุมานจาก maximum likelihood, แก้ด้วย normal equation หรือ gradient descent, และตีความสัมประสิทธิ์ออกมาเป็นภาษาที่คนอื่นเข้าใจได้",
    en: "The two oldest models, and still the right default — derived from maximum likelihood, solved by the normal equation or gradient descent, with coefficients you can explain to somebody else"
  },
  accent: "#60a5fa",
  sections: {
    principle: [
      { h: "ทำไมยังต้องเรียนโมเดลอายุสองร้อยปี" },
      { p: "**เพราะมันชนะบ่อยกว่าที่คิด และอธิบายได้เสมอ** — ในงานจริงจำนวนมาก linear หรือ logistic regression ให้ผลห่างจากโมเดลที่ซับซ้อนที่สุดไม่กี่จุด แต่ใช้เวลาเทรนเป็นวินาที ทำนายได้ทันที และตอบคำถาม 'ทำไมโมเดลถึงตัดสินแบบนี้' ได้ตรง ๆ" },
      { p: "และที่สำคัญกว่านั้น: **มันคือหน่วยย่อยของ neural network** — หนึ่งนิวรอนคือ linear regression หนึ่งตัวที่ต่อด้วย activation เข้าใจสองตัวนี้ให้ลึกแล้ว deep learning จะเป็นแค่การซ้อนสิ่งเดิมหลายชั้น" },
      { h: "สองตัว หนึ่งโครง" },
      { table: { head: ["", "Linear regression", "Logistic regression"], rows: [
        ["ทำนายอะไร", "ตัวเลขต่อเนื่อง (ราคา, อุณหภูมิ)", "ความน่าจะเป็นของคลาส (0 ถึง 1)"],
        ["สมการ", "`ŷ = wᵀx + b`", "`ŷ = σ(wᵀx + b)`"],
        ["Loss", "MSE (จากสมมติฐานเกาส์เซียน)", "Log loss (จากสมมติฐาน Bernoulli)"],
        ["มีสูตรปิด", "**มี** — normal equation", "**ไม่มี** — ต้องใช้ gradient descent"],
        ["เส้นแบ่ง", "—", "**เป็นเส้นตรงเสมอ** แม้ผลลัพธ์จะโค้ง"]
      ]}},
      { p: "**สังเกตว่าแกนกลางเป็นตัวเดียวกัน**: `wᵀx + b` ต่างกันแค่ว่าเอาไปทำอะไรต่อ และวัดความผิดด้วยอะไร" },
      { h: "ชื่อที่ทำให้สับสน" },
      { note: "**logistic regression เป็นโมเดล classification ไม่ใช่ regression** — ชื่อมาจากการที่มัน regress ค่า **log-odds** ซึ่งเป็นตัวเลขต่อเนื่อง แล้วค่อยแปลงกลับเป็นความน่าจะเป็น ไม่ได้แปลว่ามันทำนายตัวเลข" },
      { h: "เมื่อไรควรหยุดที่นี่" },
      { ul: [
        "**ผลห่างจากโมเดลแรงไม่กี่จุด** — ความง่ายในการดูแลคุ้มกว่าคะแนนที่เพิ่มขึ้นเล็กน้อย",
        "**ต้องอธิบายให้คนนอกฟัง** — ผู้ตรวจสอบ ลูกค้า หรือกฎหมายบางประเภทต้องการเหตุผลเป็นข้อ ๆ",
        "**ข้อมูลน้อย** — โมเดลซับซ้อนบนข้อมูลไม่กี่ร้อยแถวคือการ overfit ที่รอเกิด",
        "**ต้องการความน่าจะเป็นที่ calibrate ดี** — logistic regression ให้ค่าที่เชื่อได้มากกว่าโมเดลหลายตัวโดยไม่ต้องปรับ"
      ]},
      { h: "เมื่อไรควรไปต่อ" },
      { p: "เมื่อ **ความสัมพันธ์ไม่เป็นเส้นตรงและการเพิ่ม feature ไม่ช่วย** — เช่นผลกระทบเปลี่ยนทิศตามช่วง หรือมี interaction ระหว่างตัวแปรจำนวนมากที่เขียนมือไม่ไหว นั่นคือจุดที่ tree-based model เริ่มคุ้ม" },
      { h: "หน้านี้จะทำให้ทำได้" },
      { ul: [
        "อนุมาน normal equation แล้วรู้ว่าทำไมมันพังเมื่อ feature มีความสัมพันธ์กันสูง",
        "อธิบายว่าทำไม logistic regression ถึงไม่มีสูตรปิด",
        "ตีความสัมประสิทธิ์เป็น odds ratio แล้วพูดเป็นภาษาคนได้",
        "รู้ว่าเมื่อไรต้องสเกล feature และเมื่อไรไม่ต้อง",
        "จับปัญหา multicollinearity และ perfect separation ได้จากอาการ"
      ]}
    ],

    theory: [
      { p: "หมวดนี้อนุมานทั้งสองโมเดลจากหลักการเดียวกัน — maximum likelihood" },
      { h: "1) Linear regression คืออะไรจริง ๆ" },
      { code: String.raw`ŷ = w₁x₁ + w₂x₂ + ... + wₙxₙ + b
  = wᵀx + b

เขียนแบบเมทริกซ์สำหรับทั้ง batch:
  ŷ = Xw           โดยเติมคอลัมน์ 1 เข้าไปใน X เพื่อดูดค่า b เข้ามาด้วย`,
        cap: "การเติมคอลัมน์ 1 (bias trick) ทำให้ไม่ต้องแยก b ออกมาจัดการต่างหาก", lang: "txt" },
      { h: "2) MSE ไม่ใช่การเลือกโดยพลการ" },
      { code: String.raw`สมมติ  y = wᵀx + ε   โดย ε ~ Normal(0, σ²)

log-likelihood ของข้อมูลทั้งชุด:
   Σ [ −(yᵢ − wᵀxᵢ)² / 2σ²  −  log√(2πσ²) ]
        ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
        พจน์เดียวที่ขึ้นกับ w

→ maximize log-likelihood ≡ minimize Σ(yᵢ − wᵀxᵢ)²  ≡  MSE`,
        cap: "MSE คือสมมติฐาน 'noise เป็นเกาส์เซียนและมีความแปรปรวนคงที่' ที่เขียนออกมาเป็น loss", lang: "txt" },
      { p: "**เปลี่ยนสมมติฐาน loss ก็เปลี่ยน** — ถ้าสมมติว่า noise แจกแจงแบบ Laplace (หางหนากว่า) จะได้ MAE ซึ่งทนต่อ outlier มากกว่า นี่คือเหตุผลเชิงหลักการที่ MAE เหมาะกับข้อมูลที่มีค่าผิดปกติ" },
      { h: "3) Normal equation — สูตรปิดที่มีจริง" },
      { code: String.raw`ต้องการ minimize  L(w) = ‖Xw − y‖²

∂L/∂w = 2Xᵀ(Xw − y) = 0
      → XᵀXw = Xᵀy
      → w = (XᵀX)⁻¹ Xᵀy`,
        cap: "อนุพันธ์เป็นศูนย์แล้วแก้สมการตรง ๆ — ไม่ต้องวนซ้ำเลย", lang: "txt" },
      { table: { head: ["", "Normal equation", "Gradient descent"], rows: [
        ["จำนวนรอบ", "**ครั้งเดียว**", "หลายรอบจนลู่เข้า"],
        ["ต้องจูน learning rate", "ไม่ต้อง", "ต้อง"],
        ["ต้องสเกล feature", "ไม่ต้อง", "**ต้อง**"],
        ["ต้นทุนตามจำนวน feature", "**O(n³)** จากการหา inverse", "O(n) ต่อรอบ"],
        ["เมื่อ feature เยอะมาก", "ช้ามากหรือทำไม่ไหว", "ยังไหว"],
        ["เมื่อ feature สัมพันธ์กันสูง", "**พังหรือไม่เสถียร**", "ยังทำงานได้"]
      ]}},
      { note: "**เส้นแบ่งอยู่ราว ๆ 10,000 feature** — ต่ำกว่านั้น normal equation เร็วและตรงกว่า สูงกว่านั้นการหา inverse ของเมทริกซ์ `n×n` แพงเกินไป และในทางปฏิบัติไลบรารีใช้ QR หรือ SVD แทนการหา inverse ตรง ๆ เพราะเสถียรกว่ามาก" },
      { h: "4) สมมติฐานของ linear regression" },
      { table: { head: ["สมมติฐาน", "ถ้าผิดจะเกิดอะไร", "ตรวจยังไง"], rows: [
        ["ความสัมพันธ์เป็นเส้นตรง", "โมเดล underfit อย่างเป็นระบบ", "พล็อต residual เทียบค่าที่ทำนาย — ต้องไม่มีรูปแบบ"],
        ["residual อิสระต่อกัน", "ค่าความเชื่อมั่นผิด (พบบ่อยใน time series)", "พล็อต residual ตามเวลา"],
        ["ความแปรปรวนคงที่ (homoscedastic)", "ค่าประมาณยังไม่เอนเอียงแต่ช่วงความเชื่อมั่นผิด", "residual ต้องกระจายเท่ากันตลอดช่วง"],
        ["feature ไม่สัมพันธ์กันเอง", "**สัมประสิทธิ์ไม่เสถียรและตีความไม่ได้**", "VIF หรือ correlation matrix"]
      ]}},
      { p: "**สมมติฐานที่ผิดบ่อยที่สุดคือข้อสุดท้าย** และมันไม่ทำให้การทำนายแย่ลงเสมอไป — แต่ทำให้ **ตีความสัมประสิทธิ์ไม่ได้** ซึ่งเป็นเหตุผลหลักที่เลือกโมเดลนี้ตั้งแต่แรก" },
      { h: "5) Logistic regression — จากเส้นตรงสู่ความน่าจะเป็น" },
      { p: "ปัญหาของการใช้ linear regression ทำ classification: **มันให้ค่าเกิน 1 และต่ำกว่า 0 ได้** ซึ่งไม่ใช่ความน่าจะเป็น จึงต้องบีบผลลัพธ์ผ่านฟังก์ชันที่รับค่าทุกจำนวนจริงแล้วคืนค่าในช่วง (0,1)" },
      { code: String.raw`σ(z) = 1 / (1 + e^−z)

z = −∞  →  σ = 0
z =  0  →  σ = 0.5
z = +∞  →  σ = 1

σ'(z) = σ(z)(1 − σ(z))     อนุพันธ์ที่สวยผิดปกติ`,
        cap: "อนุพันธ์เขียนได้ด้วยตัวมันเอง จึงคำนวณซ้ำไม่ต้องเรียก exp ใหม่", lang: "txt" },
      { h: "6) Odds และ log-odds — ที่มาของชื่อ" },
      { code: String.raw`odds     = p / (1 − p)            อัตราต่อรอง: 0 ถึง ∞
log-odds = log(p / (1 − p))       เรียกว่า logit: −∞ ถึง ∞

และ  logit(σ(z)) = z

→ logistic regression คือการทำ linear regression บน log-odds`,
        cap: "นี่คือเหตุผลที่ชื่อมีคำว่า regression ทั้งที่เป็น classification", lang: "txt" },
      { table: { head: ["p", "odds", "log-odds", "ความหมาย"], rows: [
        ["0.5", "1.0", "0", "เท่ากันหมด"],
        ["0.75", "3.0", "1.10", "โอกาสเกิด 3 เท่าของไม่เกิด"],
        ["0.9", "9.0", "2.20", "9 ต่อ 1"],
        ["0.1", "0.11", "−2.20", "1 ต่อ 9"]
      ]}},
      { h: "7) Log loss — อนุมานจาก Bernoulli" },
      { code: String.raw`สมมติผลลัพธ์เป็น Bernoulli:  p(y | x) = ŷ^y · (1 − ŷ)^(1−y)

log-likelihood:  y log ŷ + (1 − y) log(1 − ŷ)

→ minimize  L = −[ y log ŷ + (1 − y) log(1 − ŷ) ]`,
        cap: "y เป็น 0 หรือ 1 เท่านั้น จึงเหลือพจน์เดียวเสมอ — เป็นการเขียนสองกรณีให้อยู่ในบรรทัดเดียว", lang: "txt" },
      { h: "8) ทำไมถึงไม่มีสูตรปิด" },
      { p: "อนุพันธ์ของ log loss เทียบกับ `w` ให้สมการที่ **`w` ติดอยู่ข้างใน `σ` ซึ่งเป็นฟังก์ชันไม่เชิงเส้น** จึงแยก `w` ออกมาอยู่ข้างเดียวไม่ได้ — ต่างจาก MSE ที่แยกได้สวยงาม" },
      { code: String.raw`∂L/∂w = Xᵀ(σ(Xw) − y)

ตั้งเป็นศูนย์:  Xᵀ(σ(Xw) − y) = 0
              ← w ติดอยู่ใน σ แก้พีชคณิตออกมาไม่ได้`,
        cap: "จึงต้องใช้วิธีวนซ้ำ — gradient descent, Newton หรือ IRLS ที่ไลบรารีใช้จริง", lang: "txt" },
      { note: "**แต่รูปของ gradient เหมือนกันกับ linear regression อย่างน่าประหลาด** — `Xᵀ(ทำนาย − จริง)` ทั้งคู่ ต่างกันแค่นิยามของ 'ทำนาย' นี่คือความงามที่มาจากการที่ทั้งคู่อยู่ในตระกูล generalized linear model เดียวกัน" },
      { h: "9) เส้นแบ่งเป็นเส้นตรงเสมอ" },
      { code: String.raw`ทำนายว่าเป็นคลาส 1 เมื่อ  σ(wᵀx + b) ≥ 0.5
                        ⟺  wᵀx + b ≥ 0

  ← สมการของ hyperplane ตรง ๆ`,
        cap: "ผลลัพธ์โค้งเพราะ sigmoid แต่ 'เส้นที่ใช้ตัดสิน' ยังเป็นเส้นตรงในปริภูมิของ feature", lang: "txt" },
      { p: "**ถ้าอยากได้เส้นแบ่งโค้ง ต้องสร้าง feature โค้งเอง** — เติม `x²`, `x₁x₂` เข้าไป แล้วเส้นตรงในปริภูมิใหม่จะกลายเป็นเส้นโค้งในปริภูมิเดิม นี่คือหลักการเดียวกับ kernel trick ของ SVM" },
      { h: "10) หลายคลาสด้วย softmax" },
      { code: String.raw`สองคลาส:   σ(z) = 1/(1+e^−z)              → หนึ่งความน่าจะเป็น
k คลาส:    softmax(z)ᵢ = e^zᵢ / Σⱼ e^zⱼ    → k ความน่าจะเป็นที่รวมได้ 1

น้ำหนักกลายเป็นเมทริกซ์ W ขนาด (n_feature, k)`,
        cap: "softmax ที่ k=2 ยุบกลับเป็น sigmoid พอดี — เป็นตัวเดียวกันในรูปทั่วไป", lang: "txt" },
      { table: { head: ["วิธี", "ทำยังไง", "ข้อสังเกต"], rows: [
        ["**Softmax (multinomial)**", "โมเดลเดียว k ทางออก", "ความน่าจะเป็นรวมได้ 1 · ถูกต้องเชิงทฤษฎีกว่า"],
        ["**One-vs-Rest**", "k โมเดลไบนารี แต่ละตัวแยกคลาสนั้นจากที่เหลือ", "เทรนขนานได้ · ความน่าจะเป็นไม่รวมเป็น 1 ต้อง normalize"],
        ["**One-vs-One**", "`k(k−1)/2` โมเดล แล้วโหวต", "ใช้เมื่อโมเดลฐานไม่ scale กับข้อมูลใหญ่ เช่น SVM"]
      ]}}
    ],

    foundations: [
      { p: "หมวดนี้เจาะพีชคณิตที่อยู่ใต้สองโมเดล — ส่วนที่ตัดสินว่าจะเสถียรหรือพัง" },
      { h: "ทำไม (XᵀX)⁻¹ ถึงพัง" },
      { code: String.raw`ถ้าสอง feature สัมพันธ์กันเกือบสมบูรณ์:
   x₂ ≈ 2·x₁

  → คอลัมน์ของ X แทบจะเป็นทวีคูณของกัน
  → XᵀX เกือบเป็น singular (determinant ใกล้ศูนย์)
  → inverse มีค่ามหาศาลและอ่อนไหวสุดขีด

ผล:  w = [+1,200,000, −599,999]   ← ค่าที่หักล้างกันเอง
     เปลี่ยนข้อมูลนิดเดียว สัมประสิทธิ์พลิกทั้งชุด`,
        cap: "การทำนายอาจยังพอใช้ได้ แต่สัมประสิทธิ์ตีความไม่ได้เลย ซึ่งทำลายเหตุผลที่ใช้โมเดลนี้", lang: "txt" },
      { h: "Condition number — วัดว่าอันตรายแค่ไหน" },
      { code: String.raw`cond(XᵀX) = λ_max / λ_min        อัตราส่วนของ eigenvalue

< 30        ปลอดภัย
30 - 100    เริ่มน่ากังวล
> 1000      สัมประสิทธิ์เชื่อไม่ได้แล้ว`,
        cap: "อ่านได้จาก np.linalg.cond — ตรวจก่อนตีความสัมประสิทธิ์ทุกครั้ง", lang: "txt" },
      { h: "VIF — ตรวจทีละ feature" },
      { code: String.raw`VIF(j) = 1 / (1 − R²ⱼ)

โดย R²ⱼ = ค่า R² ของการใช้ feature อื่นทั้งหมดทำนาย feature j

VIF = 1     ไม่สัมพันธ์กับใครเลย
VIF > 5     เริ่มมีปัญหา
VIF > 10    ควรตัดออกหรือรวมกับตัวอื่น`,
        cap: "แปลตรง ๆ: feature นี้ถูกทำนายจาก feature อื่นได้ดีแค่ไหน", lang: "txt" },
      { h: "Ridge แก้ปัญหานี้ได้ทางคณิตศาสตร์" },
      { code: String.raw`w = (XᵀX + λI)⁻¹ Xᵀy
            ‾‾‾‾
            บวกค่าเข้าไปในแนวทแยง

→ ทำให้ eigenvalue ที่เล็กที่สุดโตขึ้นเป็นอย่างน้อย λ
→ เมทริกซ์กลับด้านได้เสมอ แม้ XᵀX จะ singular`,
        cap: "นี่คือเหตุผลเชิงตัวเลขที่ ridge มีอยู่ ไม่ใช่แค่การลด overfit", lang: "txt" },
      { h: "Gradient ของทั้งสองโมเดล" },
      { code: String.raw`Linear:    ∂L/∂w = (2/n) Xᵀ(Xw − y)
Logistic:  ∂L/∂w = (1/n) Xᵀ(σ(Xw) − y)

รูปเดียวกัน:  Xᵀ (ทำนาย − จริง)`,
        cap: "ต่างกันแค่ฟังก์ชันที่ครอบ Xw — นี่คือสิ่งที่ generalized linear model พูดถึง", lang: "txt" },
      { p: "**ตีความ gradient เป็นภาษาคน**: `(ทำนาย − จริง)` คือความผิดพลาดต่อแถว คูณด้วย `Xᵀ` คือถามว่า **feature ไหนดังตอนที่ผิด** — feature ที่มีค่ามากในแถวที่ทำนายผิดมาก จะได้รับการปรับมากที่สุด" },
      { h: "Regularization เขียนเป็นสมการ" },
      { table: { head: ["ชื่อ", "loss ที่เพิ่ม", "ผล", "มีสูตรปิดไหม"], rows: [
        ["**Ridge (L2)**", "`+ λ‖w‖²`", "บีบทุกตัวเข้าใกล้ศูนย์อย่างนุ่มนวล", "**มี**"],
        ["**Lasso (L1)**", "`+ λ‖w‖₁`", "**ดันบางตัวเป็นศูนย์พอดี**", "ไม่มี (ต้องใช้ coordinate descent)"],
        ["**Elastic net**", "`+ λ₁‖w‖₁ + λ₂‖w‖²`", "ผสม — เลือก feature ได้แต่เสถียรกว่า lasso", "ไม่มี"]
      ]}},
      { note: "**ต้องสเกล feature ก่อนใช้ regularization เสมอ** — เพราะ penalty ลงโทษตามขนาดของสัมประสิทธิ์ และสัมประสิทธิ์ของ feature ที่มีหน่วยใหญ่จะเล็กโดยธรรมชาติ ทำให้มันรอดจากการลงโทษอย่างไม่เป็นธรรม" },
      { h: "การเข้ารหัสตัวแปรหมวดหมู่" },
      { code: String.raw`สี = {แดง, เขียว, น้ำเงิน}

One-hot:      แดง=[1,0,0]  เขียว=[0,1,0]  น้ำเงิน=[0,0,1]
Dummy (k−1):  แดง=[0,0]    เขียว=[1,0]    น้ำเงิน=[0,1]   ← แดงเป็นฐาน`,
        cap: "one-hot เต็มทำให้คอลัมน์รวมกันได้ 1 พอดี ซึ่งซ้ำกับคอลัมน์ bias = dummy variable trap", lang: "txt" },
      { p: "**ถ้าใช้ ridge หรือ lasso ให้ใช้ one-hot เต็ม** เพราะ regularization ทำให้เมทริกซ์กลับด้านได้อยู่แล้ว และการเลือกฐานจะไม่เอนเอียงผลลัพธ์ · **ถ้าจะตีความสัมประสิทธิ์อย่างเป็นทางการ ให้ใช้ dummy** เพราะสัมประสิทธิ์แต่ละตัวจะหมายถึง 'เทียบกับฐาน' อย่างชัดเจน" },
      { h: "การตีความสัมประสิทธิ์" },
      { table: { head: ["โมเดล", "สัมประสิทธิ์ w₁ = 0.5 แปลว่า"], rows: [
        ["**Linear**", "x₁ เพิ่ม 1 หน่วย → ŷ เพิ่ม 0.5 หน่วย **โดยที่ตัวอื่นคงที่**"],
        ["**Logistic**", "x₁ เพิ่ม 1 หน่วย → log-odds เพิ่ม 0.5 → **odds คูณด้วย `e^0.5` = 1.65 เท่า**"],
        ["**Logistic (สเกลแล้ว)**", "x₁ เพิ่ม 1 ส่วนเบี่ยงเบนมาตรฐาน → odds คูณ 1.65 เท่า"]
      ]}},
      { p: "**คำว่า 'โดยที่ตัวอื่นคงที่' คือจุดที่ multicollinearity ทำลายทุกอย่าง** — ถ้า `x₂ ≈ 2x₁` การเพิ่ม `x₁` โดยที่ `x₂` คงที่นั้นเป็นไปไม่ได้ในข้อมูลจริง การตีความจึงไร้ความหมาย" }
    ],

    architecture: [
      { p: "หมวดนี้คือการเตรียมข้อมูลที่ตัดสินว่าโมเดลเชิงเส้นจะทำงานได้หรือไม่" },
      { h: "ลำดับการเตรียมข้อมูล" },
      { code: String.raw`ข้อมูลดิบ
   ↓  แยก train/test ก่อนทุกอย่าง
   ↓  เติมค่าที่หายไป (imputation) — fit บน train
   ↓  เข้ารหัสหมวดหมู่ (one-hot / target encoding)
   ↓  สร้าง feature ใหม่ (log, interaction, polynomial)
   ↓  สเกล (StandardScaler) — จำเป็นถ้าใช้ gradient descent หรือ regularization
   ↓  fit โมเดล`,
        cap: "ทุกขั้นที่ 'เรียนรู้' อะไรจากข้อมูล ต้อง fit บน train เท่านั้น", lang: "txt" },
      { h: "เมื่อไรต้องสเกล เมื่อไรไม่ต้อง" },
      { table: { head: ["สถานการณ์", "ต้องสเกลไหม", "เพราะ"], rows: [
        ["Normal equation ไม่มี regularization", "**ไม่ต้อง**", "สูตรปิดไม่สนใจสเกล ผลออกมาเท่ากันเป๊ะ"],
        ["Gradient descent", "**ต้อง**", "สเกลต่างกันทำให้พื้นผิว loss เป็นหุบเขาแคบ gradient แกว่ง"],
        ["Ridge / Lasso / Elastic net", "**ต้อง**", "penalty ลงโทษตามขนาดสัมประสิทธิ์ ไม่สเกล = ลงโทษไม่เป็นธรรม"],
        ["เปรียบเทียบความสำคัญของ feature", "**ต้อง**", "ไม่งั้นเทียบสัมประสิทธิ์ข้ามหน่วยกันไม่ได้"]
      ]}},
      { h: "สร้าง feature ให้เส้นตรงจับความโค้งได้" },
      { code: String.raw`ความสัมพันธ์จริง:  y = 3x² + 2

linear บน x เฉย ๆ    →  underfit ชัดเจน
เติม x² เข้าไป        →  ŷ = w₁x + w₂x² + b  →  จับได้พอดี

โมเดลยัง "เชิงเส้นในพารามิเตอร์" อยู่ จึงยังใช้สูตรเดิมทั้งหมด`,
        cap: "คำว่า 'linear' หมายถึงเชิงเส้นใน w ไม่ใช่ใน x — เข้าใจข้อนี้แล้วจะเห็นว่าโมเดลนี้ยืดหยุ่นกว่าที่คิดมาก", lang: "txt" },
      { table: { head: ["การแปลง", "ใช้เมื่อ", "ตัวอย่าง"], rows: [
        ["`log(x)`", "ผลลดลงเรื่อย ๆ เมื่อ x โต", "รายได้ · จำนวนประชากร"],
        ["`x²`, `x³`", "ความสัมพันธ์โค้ง", "อายุกับความเสี่ยงบางโรค"],
        ["`x₁ × x₂`", "ผลของตัวหนึ่งขึ้นกับอีกตัว", "โปรโมชัน × กลุ่มลูกค้า"],
        ["binning", "ผลไม่ต่อเนื่อง เปลี่ยนเป็นช่วง ๆ", "อายุ → กลุ่มอายุ"],
        ["`log(y)`", "**target** เบ้ขวาหนัก", "ราคาบ้าน — แต่ต้องแปลงกลับตอนรายงาน"]
      ]}},
      { note: "**การแปลง target ด้วย log ทำให้ค่าที่ทำนายไม่ใช่ค่าเฉลี่ยอีกต่อไป** — `exp(mean(log y))` คือค่าเฉลี่ยเรขาคณิต ไม่ใช่ค่าเฉลี่ยเลขคณิต ถ้ารายงานเป็นเงินต้องปรับค่าคืน (smearing estimate) ไม่งั้นจะต่ำกว่าความจริงอย่างเป็นระบบ" },
      { h: "โครง pipeline ที่ใช้จริง" },
      { code: String.raw`from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression

pre = ColumnTransformer([
    ("num", Pipeline([("imp", SimpleImputer(strategy="median")),
                      ("sc",  StandardScaler())]), num_cols),
    ("cat", Pipeline([("imp", SimpleImputer(strategy="most_frequent")),
                      ("oh",  OneHotEncoder(handle_unknown="ignore"))]), cat_cols),
])

model = Pipeline([
    ("pre", pre),
    ("clf", LogisticRegression(penalty="l2", C=1.0, max_iter=1000,
                               class_weight="balanced")),
])`,
        cap: "`C` คือส่วนกลับของ λ — C น้อย = regularize แรง ซึ่งกลับด้านกับที่หลายคนคาด", lang: "python" },
      { h: "พารามิเตอร์ที่ต้องรู้จัก" },
      { table: { head: ["พารามิเตอร์", "ความหมาย", "ค่าที่ควรลอง"], rows: [
        ["`penalty`", "ชนิดของ regularization", "`l2` เป็นค่าเริ่มต้นที่ดี · `l1` เมื่ออยากเลือก feature"],
        ["`C`", "**ส่วนกลับ** ของความแรง regularization", "`0.001` ถึง `100` ไล่เป็น log scale"],
        ["`class_weight`", "ถ่วงน้ำหนักคลาสน้อย", "`balanced` เมื่อข้อมูลไม่สมดุล"],
        ["`solver`", "อัลกอริทึมที่ใช้แก้", "`lbfgs` ทั่วไป · `saga` เมื่อใช้ l1 หรือข้อมูลใหญ่"],
        ["`max_iter`", "จำนวนรอบสูงสุด", "ขึ้นเป็น 1000 เมื่อเจอคำเตือนว่าไม่ลู่เข้า"]
      ]}}
    ],

    dataflow: [
      { p: "หมวดนี้เดินตัวเลขจริงของ logistic regression ทั้งขาไปและการอัปเดต แล้วตีความผลออกมา" },
      { h: "โจทย์" },
      { code: String.raw`ทำนายว่านักศึกษาจะสอบผ่านไหม จากชั่วโมงที่อ่านหนังสือ

x = ชั่วโมงอ่าน     y = 1 ถ้าผ่าน
ข้อมูล 4 คน:  (1, 0)  (2, 0)  (3, 1)  (4, 1)

เริ่มที่  w = 0.0   b = 0.0   η = 0.5`,
        cap: "เล็กพอจะคำนวณด้วยมือ และมีรูปแบบชัดพอที่โมเดลจะเรียนได้", lang: "txt" },
      { h: "รอบที่ 1 — ขาไป" },
      { code: String.raw`z = wx + b = 0 ทุกคน
σ(0) = 0.5 ทุกคน           ← เดาว่า 50% หมด ตามที่ควรเป็นตอนเริ่ม

log loss = −(1/4)[ log(0.5) + log(0.5) + log(0.5) + log(0.5) ]
         = −log(0.5) = 0.693`,
        cap: "0.693 คือเส้นเดาสุ่มของสองคลาสพอดี — ยืนยันว่าเริ่มต้นถูก", lang: "txt" },
      { h: "รอบที่ 1 — gradient" },
      { code: String.raw`error = ŷ − y = [0.5−0, 0.5−0, 0.5−1, 0.5−1] = [0.5, 0.5, −0.5, −0.5]

∂L/∂w = (1/4) Σ xᵢ·errorᵢ
      = (1/4)[ 1(0.5) + 2(0.5) + 3(−0.5) + 4(−0.5) ]
      = (1/4)(0.5 + 1.0 − 1.5 − 2.0) = −0.5

∂L/∂b = (1/4) Σ errorᵢ = (1/4)(0.5+0.5−0.5−0.5) = 0`,
        cap: "gradient ของ w เป็นลบ → ต้องเพิ่ม w ซึ่งตรงกับสามัญสำนึกว่าอ่านมากขึ้นควรผ่านมากขึ้น", lang: "txt" },
      { h: "รอบที่ 1 — อัปเดต" },
      { code: String.raw`w ← 0.0 − 0.5(−0.5) = 0.25
b ← 0.0 − 0.5(0)    = 0.0`,
        cap: "b ไม่ขยับเพราะข้อมูลสมดุลพอดี 2 ต่อ 2", lang: "txt" },
      { h: "รอบที่ 2" },
      { code: String.raw`z = [0.25, 0.50, 0.75, 1.00]
ŷ = [0.562, 0.622, 0.679, 0.731]

log loss = −(1/4)[ log(0.438) + log(0.378) + log(0.679) + log(0.731) ]
         = 0.649        ← ลดลงจาก 0.693`,
        cap: "สองคนแรกทำนายแย่ลงเล็กน้อย แต่สองคนหลังดีขึ้นมากกว่า รวมแล้วดีขึ้น", lang: "txt" },
      { h: "หลังลู่เข้า" },
      { code: String.raw`w ≈ 1.55   b ≈ −3.87

เส้นแบ่ง: σ(1.55x − 3.87) = 0.5
        ⟺ 1.55x − 3.87 = 0
        ⟺ x = 2.5 ชั่วโมง`,
        cap: "โมเดลสรุปว่าอ่านเกิน 2.5 ชั่วโมงมีโอกาสผ่านมากกว่าไม่ผ่าน", lang: "txt" },
      { h: "ตีความสัมประสิทธิ์" },
      { code: String.raw`w = 1.55

odds ratio = e^1.55 = 4.71

พูดเป็นภาษาคน:
  "อ่านเพิ่มขึ้นหนึ่งชั่วโมง ทำให้อัตราต่อรองของการสอบผ่านเพิ่มขึ้น 4.7 เท่า"`,
        cap: "นี่คือประโยคที่เอาไปพูดในที่ประชุมได้ และเป็นเหตุผลหลักที่โมเดลนี้ยังอยู่", lang: "txt" },
      { note: "**ระวังคำว่า 'เท่า'** — odds ratio 4.71 ไม่ได้แปลว่าความน่าจะเป็นเพิ่ม 4.71 เท่า ที่ p ต่ำ ๆ สองอย่างนี้ใกล้กัน แต่ที่ p สูงจะต่างกันมาก เพราะความน่าจะเป็นเพิ่มเกิน 1 ไม่ได้ แต่ odds เพิ่มได้ไม่จำกัด" },
      { h: "ทำนายค่าใหม่" },
      { code: String.raw`นักศึกษาอ่าน 3.5 ชั่วโมง:
  z = 1.55(3.5) − 3.87 = 1.555
  p = σ(1.555) = 0.826

  → ทำนายว่าผ่าน ด้วยความน่าจะเป็น 82.6%`,
        cap: "และตัวเลข 82.6% นี้ใช้ต่อได้จริง เพราะ logistic regression มัก calibrate ดีอยู่แล้ว", lang: "txt" },
      { h: "เทียบกับ linear regression บนโจทย์เดียวกัน" },
      { code: String.raw`ถ้าใช้ linear regression:
  x = 0    →  ŷ = −0.3     ← ความน่าจะเป็นติดลบ
  x = 6    →  ŷ = 1.4      ← ความน่าจะเป็นเกิน 1

และ outlier หนึ่งตัวที่ x = 20 จะดึงเส้นทั้งเส้นจนเส้นแบ่งขยับ`,
        cap: "สองปัญหานี้คือเหตุผลที่ logistic regression ถูกคิดขึ้นมา", lang: "txt" }
    ],

    implementation: [
      { p: "เขียนทั้งสองโมเดลจากศูนย์ด้วย NumPy แล้วเทียบกับ scikit-learn ให้ตรงกัน" },
      { h: "1) Linear regression ด้วย normal equation" },
      { code: String.raw`import numpy as np

def fit_normal(X, y):
    """คืน w ที่รวม bias ไว้ในตำแหน่งแรก"""
    Xb = np.c_[np.ones(len(X)), X]              # เติมคอลัมน์ 1
    # ใช้ lstsq ไม่ใช่ inv — เสถียรกว่ามากเมื่อ XᵀX ใกล้ singular
    w, *_ = np.linalg.lstsq(Xb, y, rcond=None)
    return w

X = np.array([[1.0], [2.0], [3.0], [4.0]])
y = np.array([2.1, 3.9, 6.2, 7.8])
w = fit_normal(X, y)
print(w)          # [0.15  1.93]  →  ŷ = 1.93x + 0.15`,
        cap: "`np.linalg.lstsq` ใช้ SVD ข้างใน จึงทำงานได้แม้เมทริกซ์ singular — ต่างจาก `inv` ที่จะระเบิด", lang: "python" },
      { h: "2) Linear regression ด้วย gradient descent" },
      { code: String.raw`def fit_gd(X, y, lr=0.01, epochs=1000):
    Xb = np.c_[np.ones(len(X)), X]
    w  = np.zeros(Xb.shape[1])
    n  = len(y)
    for _ in range(epochs):
        pred = Xb @ w
        grad = (2 / n) * Xb.T @ (pred - y)      # Xᵀ(ทำนาย − จริง)
        w   -= lr * grad
    return w

print(fit_gd(X, y))     # ใกล้เคียงกับ normal equation`,
        cap: "ผลต้องลู่เข้าหาคำตอบเดียวกัน — ถ้าไม่ตรงแปลว่า learning rate หรือจำนวนรอบไม่พอ", lang: "python" },
      { h: "3) Logistic regression จากศูนย์" },
      { code: String.raw`def sigmoid(z):
    # clip กัน overflow ของ exp เมื่อ z ติดลบมาก
    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

def fit_logistic(X, y, lr=0.1, epochs=5000, l2=0.0):
    Xb = np.c_[np.ones(len(X)), X]
    w  = np.zeros(Xb.shape[1])
    n  = len(y)
    for _ in range(epochs):
        p    = sigmoid(Xb @ w)
        grad = (Xb.T @ (p - y)) / n
        grad[1:] += l2 * w[1:] / n              # ไม่ลงโทษ bias
        w   -= lr * grad
    return w

X = np.array([[1.0], [2.0], [3.0], [4.0]])
y = np.array([0, 0, 1, 1])
w = fit_logistic(X, y)
print(w)                       # [−3.87  1.55]
print("เส้นแบ่งที่ x =", -w[0] / w[1])   # 2.5`,
        cap: "**ไม่ลงโทษ bias** เป็นรายละเอียดที่ถูกต้อง — bias ควรขยับได้อิสระตามสัดส่วนของคลาส", lang: "python" },
      { h: "4) log loss ที่ปลอดภัย" },
      { code: String.raw`def log_loss(y, p, eps=1e-15):
    p = np.clip(p, eps, 1 - eps)                # กัน log(0) = -inf
    return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))`,
        cap: "clip คือบรรทัดที่กัน NaN เมื่อโมเดลมั่นใจเต็มร้อย ซึ่งเกิดได้เสมอเมื่อข้อมูลแยกกันชัด", lang: "python" },
      { h: "5) เทียบกับ scikit-learn" },
      { code: String.raw`from sklearn.linear_model import LogisticRegression

# ปิด regularization เพื่อให้เทียบกับที่เขียนเองได้ตรง ๆ
skl = LogisticRegression(penalty=None, max_iter=10000).fit(X, y)
print(skl.intercept_, skl.coef_)     # ควรใกล้ [−3.87] [[1.55]]`,
        cap: "**scikit-learn เปิด L2 มาให้เป็นค่าเริ่มต้น** — ถ้าไม่ปิด ผลจะไม่ตรงกับที่เขียนเอง และหลายคนงงตรงนี้", lang: "python" },
      { h: "6) ตีความสัมประสิทธิ์ให้เป็นภาษาคน" },
      { code: String.raw`import pandas as pd

coefs = pd.DataFrame({
    "feature": feature_names,
    "coef":    model.coef_[0],
    "odds_ratio": np.exp(model.coef_[0]),
}).sort_values("odds_ratio", ascending=False)

print(coefs)
# feature        coef   odds_ratio
# tenure         1.24   3.46        ← เพิ่ม 1 SD → odds คูณ 3.46
# monthly_charge 0.31   1.36
# has_contract  -0.88   0.41        ← ลด odds ลง 59%`,
        cap: "ต้องสเกล feature ก่อน ไม่งั้นเทียบขนาดสัมประสิทธิ์ข้ามหน่วยกันไม่ได้เลย", lang: "python" },
      { h: "7) หา C ที่ดีที่สุด" },
      { code: String.raw`from sklearn.linear_model import LogisticRegressionCV

model = LogisticRegressionCV(
    Cs=np.logspace(-4, 4, 20),      # ไล่แบบ log scale ไม่ใช่ linear
    cv=5, scoring="average_precision",
    penalty="l2", solver="lbfgs", max_iter=2000,
).fit(X_tr, y_tr)

print("C ที่เลือก:", model.C_)`,
        cap: "ไล่ C แบบ log scale เสมอ เพราะผลของมันเป็นเชิงคูณ ไม่ใช่เชิงบวก", lang: "python" },
      { h: "8) เมื่อต้องการค่า p-value และช่วงความเชื่อมั่น" },
      { code: String.raw`import statsmodels.api as sm

Xb = sm.add_constant(X)
res = sm.Logit(y, Xb).fit()
print(res.summary())

#                 coef    std err       z      P>|z|    [0.025   0.975]
# const         -3.8700     1.821   -2.125     0.034   -7.439   -0.301
# hours          1.5500     0.702    2.208     0.027    0.174    2.926`,
        cap: "scikit-learn ไม่ให้ p-value เพราะเน้นการทำนาย ส่วน statsmodels เน้นการอนุมานเชิงสถิติ", lang: "python" },
      { note: "**p-value มีความหมายก็ต่อเมื่อสมมติฐานของโมเดลเป็นจริง** — ถ้า residual ไม่อิสระหรือความแปรปรวนไม่คงที่ ค่าที่ได้จะแคบเกินจริง อย่าเอาไปตัดสินใจโดยไม่ตรวจสมมติฐานก่อน" }
    ],

    tricks: [
      { h: "อาการและสาเหตุ" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้ยังไง"], rows: [
        ["สัมประสิทธิ์มหาศาลและสลับเครื่องหมาย", "**multicollinearity**", "ตรวจ VIF · ตัด feature ซ้ำซ้อน · ใช้ ridge"],
        ["`ConvergenceWarning: lbfgs failed to converge`", "ไม่ได้สเกล · `max_iter` น้อยไป · **perfect separation**", "สเกลก่อน · เพิ่ม max_iter · ถ้ายังไม่หายให้สงสัย separation"],
        ["สัมประสิทธิ์บางตัวโตไม่สิ้นสุด", "**perfect separation** — มี feature ที่แยกสองคลาสได้สมบูรณ์", "เติม regularization (`C` เล็กลง) ซึ่งแก้ได้ทันที"],
        ["ทำนายเป็นคลาสเดียวหมด", "ข้อมูลไม่สมดุลรุนแรง", "`class_weight='balanced'` · ขยับ threshold"],
        ["train กับ test ต่างกันมาก", "feature เยอะเกินไปเทียบกับจำนวนแถว", "ลด feature · เพิ่ม regularization"],
        ["ทำนายแย่แต่ residual มีรูปแบบชัด", "ความสัมพันธ์ไม่เป็นเส้นตรง", "เติม polynomial หรือ interaction · หรือเปลี่ยนไปใช้ tree"]
      ]}},
      { h: "Perfect separation — กรณีที่โมเดลเก่งเกินไปจนพัง" },
      { code: String.raw`ถ้ามี feature ที่แยกสองคลาสได้สมบูรณ์:
   x < 5  → y = 0 ทุกแถว
   x ≥ 5  → y = 1 ทุกแถว

MLE จะพยายามผลัก w → ∞ เพื่อให้ σ เข้าใกล้ 0 กับ 1 พอดี
→ ไม่มีคำตอบที่จำกัด → ไม่ลู่เข้า`,
        cap: "regularization แก้ได้ทันทีเพราะมันลงโทษ w ที่ใหญ่ ทำให้มีคำตอบที่จำกัดเสมอ", lang: "txt" },
      { note: "**perfect separation มักเป็นสัญญาณของ leakage** — feature ที่แยกคลาสได้สมบูรณ์ในข้อมูลจริงนั้นหายากมาก ให้ตรวจก่อนว่ามันมีอยู่จริงตอนทำนายหรือเปล่า" },
      { h: "อ่าน residual plot" },
      { table: { head: ["รูปแบบที่เห็น", "แปลว่า", "ทำอะไร"], rows: [
        ["กระจายสุ่มรอบศูนย์", "ดี — สมมติฐานยังใช้ได้", "ไม่ต้องทำอะไร"],
        ["เป็นรูปตัว U", "ความสัมพันธ์โค้ง", "เติม `x²`"],
        ["กรวยกว้างขึ้นทางขวา", "ความแปรปรวนไม่คงที่", "แปลง target ด้วย log · หรือใช้ weighted least squares"],
        ["มีรูปแบบตามเวลา", "residual ไม่อิสระ", "เพิ่ม lag feature · ใช้โมเดล time series"]
      ]}},
      { h: "กฎที่ใช้ได้ตลอด" },
      { ul: [
        "**สเกลเสมอเมื่อใช้ regularization** — ไม่มีข้อยกเว้น",
        "**ตรวจ VIF ก่อนตีความสัมประสิทธิ์** — ไม่ตรวจก็อย่าตีความ",
        "**ไล่ `C` แบบ log scale** เพราะผลเป็นเชิงคูณ",
        "**อย่าลงโทษ bias** ในการทำ regularization",
        "**รายงาน odds ratio ไม่ใช่สัมประสิทธิ์ดิบ** เมื่อคุยกับคนที่ไม่ใช่สายเทคนิค",
        "**เทียบกับ baseline เสมอ** — linear model ที่ชนะ baseline ไม่ได้ก็คือมีบั๊ก"
      ]},
      { h: "จุดที่โมเดลเชิงเส้นแพ้" },
      { table: { head: ["สถานการณ์", "ทำไมแพ้", "ไปทางไหนต่อ"], rows: [
        ["ผลกระทบเปลี่ยนทิศตามช่วง", "เส้นตรงมีความชันเดียว", "tree · หรือ binning แล้วทำ one-hot"],
        ["interaction เยอะจนเขียนมือไม่ไหว", "ต้องระบุทุกคู่เอง", "gradient boosting หาให้เอง"],
        ["ข้อมูลไม่มีโครงสร้าง (ภาพ เสียง ข้อความดิบ)", "feature ที่มีความหมายไม่ได้อยู่ในรูปคอลัมน์", "neural network"],
        ["feature มากกว่าจำนวนแถว", "`XᵀX` singular แน่นอน", "lasso · หรือลดมิติก่อน"]
      ]}},
      { h: "ข้อผิดพลาดที่พบบ่อยที่สุด" },
      { ul: [
        "**ลืมว่า scikit-learn เปิด L2 มาให้** แล้วงงว่าทำไมผลไม่ตรงกับที่คำนวณเอง",
        "**ตีความสัมประสิทธิ์โดยไม่สเกล** แล้วสรุปว่า feature ที่หน่วยเล็กสำคัญกว่า",
        "**ใช้ one-hot เต็มโดยไม่มี regularization** แล้วเจอเมทริกซ์ singular",
        "**แปลง target ด้วย log แล้วรายงานค่าที่แปลงกลับตรง ๆ** ซึ่งต่ำกว่าความจริงอย่างเป็นระบบ",
        "**เชื่อ p-value โดยไม่ตรวจสมมติฐาน**"
      ]}
    ],

    eval: [
      { p: "คำถามที่แยกคนที่เข้าใจโครงออกจากคนที่เรียกไลบรารีเป็น" },
      { qa: [
        { q: "ทำไม linear regression ถึงใช้ MSE",
          a: "เพราะอนุมานได้จาก maximum likelihood ภายใต้สมมติฐานว่า noise แจกแจงแบบเกาส์เซียนที่มีความแปรปรวนคงที่ — ถ้าเปลี่ยนเป็นสมมติฐาน Laplace จะได้ MAE ซึ่งทนต่อ outlier มากกว่า" },
        { q: "normal equation กับ gradient descent เลือกยังไง",
          a: "normal equation ได้คำตอบครั้งเดียวและไม่ต้องจูนอะไร แต่ต้องหา inverse ซึ่งเป็น O(n³) ในจำนวน feature จึงเหมาะเมื่อ feature ไม่เกินราวหมื่นตัว เกินกว่านั้นหรือเมื่อ feature สัมพันธ์กันสูงให้ใช้ gradient descent" },
        { q: "ทำไม `(XᵀX)⁻¹` ถึงพังได้",
          a: "เมื่อ feature สัมพันธ์กันเกือบสมบูรณ์ คอลัมน์ของ X แทบเป็นทวีคูณของกัน ทำให้ `XᵀX` เกือบ singular ค่า inverse จึงมหาศาลและอ่อนไหว สัมประสิทธิ์ที่ได้จะหักล้างกันเองและพลิกไปมาเมื่อข้อมูลเปลี่ยนนิดเดียว" },
        { q: "ridge แก้ปัญหานั้นได้ยังไงในเชิงคณิตศาสตร์",
          a: "มันบวก `λI` เข้าไปในแนวทแยงของ `XᵀX` ซึ่งดัน eigenvalue ที่เล็กที่สุดให้อย่างน้อยเท่ากับ λ เมทริกซ์จึงกลับด้านได้เสมอ แม้ต้นฉบับจะ singular" },
        { q: "logistic regression เป็น regression หรือ classification",
          a: "เป็น classification ชื่อมาจากการที่มันทำ regression บนค่า **log-odds** ซึ่งเป็นตัวเลขต่อเนื่อง แล้วแปลงกลับเป็นความน่าจะเป็นด้วย sigmoid" },
        { q: "ทำไม logistic regression ถึงไม่มีสูตรปิด",
          a: "เพราะเมื่อตั้งอนุพันธ์ของ log loss เป็นศูนย์ ตัวแปร `w` ติดอยู่ข้างใน sigmoid ซึ่งไม่เป็นเชิงเส้น จึงแยกออกมาอยู่ข้างเดียวไม่ได้ ต้องใช้วิธีวนซ้ำอย่าง gradient descent หรือ IRLS" },
        { q: "gradient ของสองโมเดลนี้ต่างกันยังไง",
          a: "รูปเหมือนกันคือ `Xᵀ(ทำนาย − จริง)` ต่างกันแค่นิยามของ 'ทำนาย' — ตัวหนึ่งคือ `Xw` อีกตัวคือ `σ(Xw)` ซึ่งเป็นผลจากการที่ทั้งคู่อยู่ในตระกูล generalized linear model เดียวกัน" },
        { q: "เส้นแบ่งของ logistic regression เป็นเส้นตรงไหม",
          a: "เป็นเสมอ เพราะเงื่อนไข `σ(wᵀx+b) ≥ 0.5` ยุบเหลือ `wᵀx + b ≥ 0` ซึ่งเป็นสมการ hyperplane ผลลัพธ์ที่โค้งมาจาก sigmoid ไม่ใช่จากเส้นแบ่ง" },
        { q: "ถ้าอยากได้เส้นแบ่งโค้งต้องทำยังไง",
          a: "สร้าง feature โค้งขึ้นมาเอง เช่นเติม `x²` หรือ `x₁x₂` แล้วเส้นตรงในปริภูมิใหม่จะกลายเป็นเส้นโค้งในปริภูมิเดิม — หลักการเดียวกับ kernel trick ของ SVM" },
        { q: "ตีความสัมประสิทธิ์ของ logistic regression ยังไง",
          a: "สัมประสิทธิ์คือการเปลี่ยนแปลงของ log-odds ต่อการเพิ่มหนึ่งหน่วย ดังนั้น `e^w` คือ odds ratio เช่น `w = 1.55` แปลว่าเพิ่มหนึ่งหน่วยทำให้อัตราต่อรองคูณ 4.71 เท่า" },
        { q: "odds ratio 4.7 แปลว่าความน่าจะเป็นเพิ่ม 4.7 เท่าไหม",
          a: "ไม่ใช่ ที่ p ต่ำ ๆ สองอย่างนี้ใกล้กัน แต่ที่ p สูงจะต่างกันมาก เพราะความน่าจะเป็นเกิน 1 ไม่ได้ ในขณะที่ odds เพิ่มได้ไม่จำกัด" },
        { q: "เมื่อไรต้องสเกล feature",
          a: "ต้องสเกลเมื่อใช้ gradient descent เมื่อใช้ regularization และเมื่อจะเทียบขนาดสัมประสิทธิ์ข้าม feature — ไม่จำเป็นเมื่อใช้ normal equation ที่ไม่มี regularization เพราะผลออกมาเท่ากันเป๊ะ" },
        { q: "ทำไม regularization ถึงต้องการ feature ที่สเกลแล้ว",
          a: "เพราะ penalty ลงโทษตามขนาดของสัมประสิทธิ์ และ feature ที่มีหน่วยใหญ่จะมีสัมประสิทธิ์เล็กโดยธรรมชาติ จึงรอดจากการลงโทษอย่างไม่เป็นธรรม การสเกลทำให้ทุกตัวถูกลงโทษบนมาตรฐานเดียวกัน" },
        { q: "`C` ใน scikit-learn คืออะไร",
          a: "เป็น **ส่วนกลับ** ของความแรง regularization — `C` น้อยแปลว่าลงโทษแรง ซึ่งกลับด้านกับ `alpha` หรือ `λ` ที่หลายคนคุ้น และควรไล่ค่าแบบ log scale เพราะผลเป็นเชิงคูณ" },
        { q: "perfect separation คืออะไร แก้ยังไง",
          a: "คือกรณีที่มี feature แยกสองคลาสได้สมบูรณ์ ทำให้ MLE ผลัก `w` ไปหาอนันต์เพื่อให้ sigmoid เข้าใกล้ 0 กับ 1 พอดี จึงไม่ลู่เข้า แก้ด้วย regularization ซึ่งทำให้มีคำตอบจำกัดเสมอ — และควรสงสัย leakage ด้วย" },
        { q: "one-hot เต็มกับ dummy ต่างกันยังไง เลือกยังไง",
          a: "one-hot เต็มมี k คอลัมน์ซึ่งรวมกันได้ 1 พอดี ซ้ำกับ bias ทำให้เมทริกซ์ singular ส่วน dummy ตัดออกหนึ่งคอลัมน์เป็นฐาน — ใช้ dummy เมื่อจะตีความอย่างเป็นทางการ ใช้ one-hot เต็มได้เมื่อมี regularization" },
        { q: "หลายคลาสทำยังไง",
          a: "ใช้ softmax ซึ่งเป็นรูปทั่วไปของ sigmoid โดยที่ k=2 จะยุบกลับเป็น sigmoid พอดี หรือใช้ one-vs-rest ที่เทรน k โมเดลไบนารีแล้วเทียบคะแนน ซึ่งขนานได้แต่ความน่าจะเป็นไม่รวมเป็น 1" },
        { q: "สมมติฐานข้อไหนของ linear regression ที่ผิดบ่อยที่สุด",
          a: "ข้อที่ว่า feature ไม่สัมพันธ์กันเอง — และมันไม่ได้ทำให้การทำนายแย่ลงเสมอไป แต่ทำลายการตีความสัมประสิทธิ์ ซึ่งเป็นเหตุผลหลักที่เลือกใช้โมเดลนี้ตั้งแต่แรก" },
        { q: "residual plot ที่เป็นรูปตัว U บอกอะไร",
          a: "บอกว่าความสัมพันธ์จริงโค้งแต่โมเดลจับได้แค่เส้นตรง แก้โดยเติมพจน์กำลังสองเข้าไป — และโมเดลยังคงเป็น linear ในพารามิเตอร์ จึงใช้สูตรเดิมทั้งหมด" },
        { q: "เมื่อไรควรเลิกใช้โมเดลเชิงเส้น",
          a: "เมื่อความสัมพันธ์ไม่เป็นเส้นตรงและการเติม feature ไม่ช่วย หรือมี interaction จำนวนมากจนเขียนมือไม่ไหว หรือข้อมูลไม่มีโครงสร้างอย่างภาพและข้อความ — นั่นคือจุดที่ tree-based model และ neural network เริ่มคุ้ม" }
      ]},
      { h: "อ่านเพิ่ม" },
      { links: [
        { label: "scikit-learn — Linear Models", url: "https://scikit-learn.org/stable/modules/linear_model.html", note: "ทุกตัวแปรของโมเดลเชิงเส้น รวม ridge, lasso, elastic net พร้อมสูตร" },
        { label: "StatQuest — Logistic Regression", url: "https://www.youtube.com/watch?v=yIYKR4sgzI8", note: "อธิบาย odds, log-odds และ maximum likelihood แบบเห็นภาพทีละขั้น" },
        { label: "An Introduction to Statistical Learning — บทที่ 3-4", url: "https://www.statlearning.com/", note: "ตำราอ้างอิงของสองโมเดลนี้ อ่านฟรี พร้อมโค้ด R และ Python" },
        { label: "statsmodels — Logit", url: "https://www.statsmodels.org/stable/generated/statsmodels.discrete.discrete_model.Logit.html", note: "เมื่อต้องการ p-value ช่วงความเชื่อมั่น และการวินิจฉัยสมมติฐาน" },
        { label: "UCLA — FAQ: How do I interpret odds ratios?", url: "https://stats.oarc.ucla.edu/other/mult-pkg/faq/general/faq-how-do-i-interpret-odds-ratios-in-logistic-regression/", note: "คำอธิบายการตีความ odds ratio ที่ละเอียดและถูกต้องที่สุดบนเว็บ" },
        { label: "Wikipedia — Multicollinearity", url: "https://en.wikipedia.org/wiki/Multicollinearity", note: "นิยาม VIF condition number และผลที่มีต่อสัมประสิทธิ์" },
        { label: "Wikipedia — Separation (statistics)", url: "https://en.wikipedia.org/wiki/Separation_(statistics)", note: "ที่มาของ perfect separation และทางแก้ที่เป็นทางการ" }
      ]}
    ]
  }
});

Object.assign(window.TEACHING_EN, {
  ml_linear: {
    principle: [
      { h: "Why study a two-hundred-year-old model" },
      { p: "**Because it wins more often than people expect, and it can always be explained.** On a great deal of real work, linear or logistic regression lands within a few points of the most elaborate model, trains in seconds, predicts instantly, and answers \"why did it decide that?\" directly." },
      { p: "More importantly, **it is the unit a neural network is built from** — one neuron is a linear regression followed by an activation. Understand these two properly and deep learning becomes the same thing stacked." },
      { h: "Two models, one skeleton" },
      { table: { head: ["", "Linear regression", "Logistic regression"], rows: [
        ["Predicts", "A continuous number (price, temperature)", "A class probability (0 to 1)"],
        ["Equation", "`ŷ = wᵀx + b`", "`ŷ = σ(wᵀx + b)`"],
        ["Loss", "MSE (from a Gaussian assumption)", "Log loss (from a Bernoulli assumption)"],
        ["Closed form", "**Yes** — the normal equation", "**No** — gradient descent required"],
        ["Decision boundary", "—", "**Always a straight line**, however curved the output looks"]
      ]}},
      { p: "**Note that the core is identical**: `wᵀx + b`. They differ only in what happens to it afterwards and how error is measured." },
      { h: "The name that confuses everyone" },
      { note: "**Logistic regression is a classification model, not a regression.** The name comes from regressing the **log-odds**, which is a continuous quantity, and only then converting back to a probability. It does not predict numbers." },
      { h: "When to stop here" },
      { ul: [
        "**It is within a few points of a strong model** — the maintenance saving outweighs the marginal score",
        "**It has to be explained to outsiders** — auditors, customers, and some regulations want reasons item by item",
        "**There is little data** — a complex model on a few hundred rows is overfitting waiting to happen",
        "**You need well-calibrated probabilities** — logistic regression tends to give believable ones without adjustment"
      ]},
      { h: "When to move on" },
      { p: "When **the relationship is not linear and adding features does not help** — an effect that reverses across ranges, or interactions between so many variables that writing them by hand is impractical. That is where tree-based models start to earn their cost." },
      { h: "What this page will let you do" },
      { ul: [
        "Derive the normal equation and know why it breaks when features are strongly related",
        "Explain why logistic regression has no closed form",
        "Read coefficients as odds ratios and say them in plain language",
        "Know exactly when feature scaling is required and when it is not",
        "Recognise multicollinearity and perfect separation from their symptoms"
      ]}
    ],
    theory: [
      { p: "Both models derived from the same principle — maximum likelihood." },
      { h: "1) What linear regression really is" },
      { code: String.raw`ŷ = w₁x₁ + w₂x₂ + ... + wₙxₙ + b
  = wᵀx + b

in matrix form for a whole batch:
  ŷ = Xw           with a column of ones prepended to X to absorb b`,
        cap: "The column of ones (the bias trick) means b needs no separate handling", lang: "txt" },
      { h: "2) MSE is not an arbitrary choice" },
      { code: String.raw`assume  y = wᵀx + ε   with ε ~ Normal(0, σ²)

log-likelihood of the whole dataset:
   Σ [ −(yᵢ − wᵀxᵢ)² / 2σ²  −  log√(2πσ²) ]
        ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
        the only term involving w

→ maximising the log-likelihood ≡ minimising Σ(yᵢ − wᵀxᵢ)²  ≡  MSE`,
        cap: "MSE is the assumption of Gaussian, constant-variance noise written out as a loss", lang: "txt" },
      { p: "**Change the assumption and the loss changes.** Assume Laplace noise, which has heavier tails, and you get MAE — the principled reason MAE suits data with outliers." },
      { h: "3) The normal equation, a closed form that really exists" },
      { code: String.raw`minimise  L(w) = ‖Xw − y‖²

∂L/∂w = 2Xᵀ(Xw − y) = 0
      → XᵀXw = Xᵀy
      → w = (XᵀX)⁻¹ Xᵀy`,
        cap: "Set the derivative to zero and solve directly — no iteration at all", lang: "txt" },
      { table: { head: ["", "Normal equation", "Gradient descent"], rows: [
        ["Iterations", "**One**", "Many, until it converges"],
        ["Needs a learning rate", "No", "Yes"],
        ["Needs scaled features", "No", "**Yes**"],
        ["Cost in the feature count", "**O(n³)** for the inverse", "O(n) per iteration"],
        ["With very many features", "Very slow or infeasible", "Still fine"],
        ["With strongly related features", "**Breaks or becomes unstable**", "Still works"]
      ]}},
      { note: "**The crossover sits around ten thousand features.** Below it the normal equation is faster and exact; above it inverting an `n×n` matrix is too expensive. In practice libraries use QR or SVD rather than an explicit inverse, because it is far more stable." },
      { h: "4) The assumptions of linear regression" },
      { table: { head: ["Assumption", "What breaks if it fails", "How to check"], rows: [
        ["The relationship is linear", "The model underfits systematically", "Plot residuals against predictions — there must be no pattern"],
        ["Residuals are independent", "Confidence intervals are wrong (common in time series)", "Plot residuals against time"],
        ["Constant variance (homoscedasticity)", "Estimates stay unbiased but intervals are wrong", "Residual spread must be even across the range"],
        ["Features are not related to each other", "**Coefficients become unstable and uninterpretable**", "VIF or a correlation matrix"]
      ]}},
      { p: "**The last one fails most often**, and it does not always hurt predictions — but it **destroys the interpretation of the coefficients**, which was the main reason for choosing this model." },
      { h: "5) Logistic regression — from a line to a probability" },
      { p: "The problem with using linear regression for classification: **it produces values above 1 and below 0**, which are not probabilities. So the output is squashed through a function that takes any real number and returns something in (0,1)." },
      { code: String.raw`σ(z) = 1 / (1 + e^−z)

z = −∞  →  σ = 0
z =  0  →  σ = 0.5
z = +∞  →  σ = 1

σ'(z) = σ(z)(1 − σ(z))     an unusually convenient derivative`,
        cap: "The derivative is expressible in terms of itself, so nothing needs recomputing with exp", lang: "txt" },
      { h: "6) Odds and log-odds — where the name comes from" },
      { code: String.raw`odds     = p / (1 − p)            0 to ∞
log-odds = log(p / (1 − p))       called the logit: −∞ to ∞

and  logit(σ(z)) = z

→ logistic regression is linear regression on the log-odds`,
        cap: "Which is exactly why a classification model has \"regression\" in its name", lang: "txt" },
      { table: { head: ["p", "odds", "log-odds", "Meaning"], rows: [
        ["0.5", "1.0", "0", "Even"],
        ["0.75", "3.0", "1.10", "Three times as likely to happen as not"],
        ["0.9", "9.0", "2.20", "Nine to one"],
        ["0.1", "0.11", "−2.20", "One to nine"]
      ]}},
      { h: "7) Log loss, derived from Bernoulli" },
      { code: String.raw`assume a Bernoulli outcome:  p(y | x) = ŷ^y · (1 − ŷ)^(1−y)

log-likelihood:  y log ŷ + (1 − y) log(1 − ŷ)

→ minimise  L = −[ y log ŷ + (1 − y) log(1 − ŷ) ]`,
        cap: "y is only ever 0 or 1, so one term always vanishes — it is two cases written on one line", lang: "txt" },
      { h: "8) Why there is no closed form" },
      { p: "Differentiating log loss with respect to `w` leaves **`w` trapped inside `σ`, which is non-linear**, so it cannot be isolated algebraically — unlike MSE, where it separates cleanly." },
      { code: String.raw`∂L/∂w = Xᵀ(σ(Xw) − y)

set it to zero:  Xᵀ(σ(Xw) − y) = 0
                 ← w is inside σ; there is no algebraic solution`,
        cap: "Hence an iterative method — gradient descent, Newton, or the IRLS that libraries actually use", lang: "txt" },
      { note: "**Yet the gradient has the same shape as linear regression's** — `Xᵀ(prediction − truth)` in both cases, differing only in what \"prediction\" means. That elegance comes from both belonging to the same family of generalized linear models." },
      { h: "9) The boundary is always straight" },
      { code: String.raw`predict class 1 when  σ(wᵀx + b) ≥ 0.5
                    ⟺  wᵀx + b ≥ 0

  ← the equation of a hyperplane, plainly`,
        cap: "The output curves because of the sigmoid, but the line used to decide is still straight in feature space", lang: "txt" },
      { p: "**To get a curved boundary you must build curved features** — add `x²` or `x₁x₂`, and a straight line in the new space becomes a curve in the original. This is the same principle as the SVM kernel trick." },
      { h: "10) Many classes, through softmax" },
      { code: String.raw`two classes:  σ(z) = 1/(1+e^−z)              → one probability
k classes:    softmax(z)ᵢ = e^zᵢ / Σⱼ e^zⱼ    → k probabilities summing to 1

the weights become a matrix W of shape (n_features, k)`,
        cap: "Softmax at k=2 collapses exactly back into the sigmoid — they are the same thing generalised", lang: "txt" },
      { table: { head: ["Approach", "How", "Note"], rows: [
        ["**Softmax (multinomial)**", "One model with k outputs", "Probabilities sum to 1 · theoretically the cleaner choice"],
        ["**One-vs-Rest**", "k binary models, each separating one class from the rest", "Parallelisable · probabilities do not sum to 1 and need normalising"],
        ["**One-vs-One**", "`k(k−1)/2` models that vote", "Used when the base model scales badly with data size, as SVM does"]
      ]}}
    ],
    foundations: [
      { p: "The algebra beneath both models — the part that decides whether they are stable or fall apart." },
      { h: "Why (XᵀX)⁻¹ breaks" },
      { code: String.raw`if two features are almost perfectly related:
   x₂ ≈ 2·x₁

  → the columns of X are nearly multiples of one another
  → XᵀX is nearly singular (its determinant approaches zero)
  → the inverse becomes enormous and exquisitely sensitive

result:  w = [+1,200,000, −599,999]   ← values that cancel each other
         change the data slightly and every coefficient flips`,
        cap: "Predictions may still be usable, but the coefficients are meaningless — which removes the reason for choosing this model", lang: "txt" },
      { h: "Condition number — how dangerous is it" },
      { code: String.raw`cond(XᵀX) = λ_max / λ_min        the ratio of eigenvalues

< 30        safe
30 - 100    starting to worry
> 1000      the coefficients cannot be trusted`,
        cap: "Available from np.linalg.cond — check it before interpreting any coefficient", lang: "txt" },
      { h: "VIF — checking one feature at a time" },
      { code: String.raw`VIF(j) = 1 / (1 − R²ⱼ)

where R²ⱼ is the R² of predicting feature j from all the others

VIF = 1     unrelated to anything else
VIF > 5     a problem is forming
VIF > 10    drop it or merge it with another`,
        cap: "Read it literally: how well can this feature be predicted from the rest", lang: "txt" },
      { h: "Ridge fixes this mathematically" },
      { code: String.raw`w = (XᵀX + λI)⁻¹ Xᵀy
            ‾‾‾‾
            added along the diagonal

→ raises the smallest eigenvalue to at least λ
→ the matrix is always invertible, even when XᵀX is singular`,
        cap: "This is the numerical reason ridge exists, not merely a way to reduce overfitting", lang: "txt" },
      { h: "The gradients of both models" },
      { code: String.raw`Linear:    ∂L/∂w = (2/n) Xᵀ(Xw − y)
Logistic:  ∂L/∂w = (1/n) Xᵀ(σ(Xw) − y)

the same shape:  Xᵀ (prediction − truth)`,
        cap: "Only the function wrapping Xw differs — which is what generalized linear models are about", lang: "txt" },
      { p: "**Read the gradient in plain language**: `(prediction − truth)` is the error per row, and multiplying by `Xᵀ` asks **which features were loud when it was wrong** — a feature with a large value on a badly predicted row receives the largest correction." },
      { h: "Regularisation as equations" },
      { table: { head: ["Name", "Added to the loss", "Effect", "Closed form?"], rows: [
        ["**Ridge (L2)**", "`+ λ‖w‖²`", "Shrinks everything smoothly toward zero", "**Yes**"],
        ["**Lasso (L1)**", "`+ λ‖w‖₁`", "**Drives some coefficients to exactly zero**", "No (coordinate descent)"],
        ["**Elastic net**", "`+ λ₁‖w‖₁ + λ₂‖w‖²`", "A blend — selects features but is steadier than lasso", "No"]
      ]}},
      { note: "**Always scale features before regularising**, because the penalty punishes coefficient size, and a feature measured in large units naturally has a small coefficient — so it escapes the penalty unfairly." },
      { h: "Encoding categorical variables" },
      { code: String.raw`colour = {red, green, blue}

One-hot:      red=[1,0,0]  green=[0,1,0]  blue=[0,0,1]
Dummy (k−1):  red=[0,0]    green=[1,0]    blue=[0,1]   ← red is the baseline`,
        cap: "Full one-hot columns sum to exactly 1, duplicating the bias column — the dummy variable trap", lang: "txt" },
      { p: "**With ridge or lasso, use full one-hot**, because the regularisation makes the matrix invertible anyway and no baseline choice skews the result. **To interpret coefficients formally, use dummies**, so each coefficient clearly means \"relative to the baseline\"." },
      { h: "Interpreting coefficients" },
      { table: { head: ["Model", "A coefficient of w₁ = 0.5 means"], rows: [
        ["**Linear**", "One more unit of x₁ raises ŷ by 0.5 **with everything else held constant**"],
        ["**Logistic**", "One more unit of x₁ raises the log-odds by 0.5, so **the odds are multiplied by `e^0.5` = 1.65**"],
        ["**Logistic (scaled)**", "One more standard deviation of x₁ multiplies the odds by 1.65"]
      ]}},
      { p: "**The phrase \"with everything else held constant\" is exactly what multicollinearity destroys.** If `x₂ ≈ 2x₁`, increasing `x₁` while holding `x₂` fixed never happens in the real data, so the interpretation is empty." }
    ],
    architecture: [
      { p: "The data preparation that decides whether a linear model can work at all." },
      { h: "The order of preparation" },
      { code: String.raw`raw data
   ↓  split train/test before anything else
   ↓  impute missing values — fit on train
   ↓  encode categoricals (one-hot / target encoding)
   ↓  build new features (log, interactions, polynomials)
   ↓  scale (StandardScaler) — required for gradient descent or regularisation
   ↓  fit the model`,
        cap: "Every step that learns something from the data must be fitted on train only", lang: "txt" },
      { h: "When scaling is required and when it is not" },
      { table: { head: ["Situation", "Scale?", "Because"], rows: [
        ["Normal equation without regularisation", "**No**", "The closed form is scale-invariant; the result is identical"],
        ["Gradient descent", "**Yes**", "Different scales make the loss surface a narrow valley and the gradient oscillates"],
        ["Ridge / lasso / elastic net", "**Yes**", "The penalty punishes coefficient size, so unscaled features are punished unfairly"],
        ["Comparing feature importance", "**Yes**", "Otherwise coefficients across different units are not comparable"]
      ]}},
      { h: "Building features so a straight line can capture curvature" },
      { code: String.raw`the true relationship:  y = 3x² + 2

linear on x alone      →  obviously underfits
add x² as a feature    →  ŷ = w₁x + w₂x² + b  →  fits exactly

the model is still "linear in the parameters", so every formula still applies`,
        cap: "\"Linear\" refers to being linear in w, not in x — grasp that and the model is far more flexible than it looks", lang: "txt" },
      { table: { head: ["Transform", "Use when", "Example"], rows: [
        ["`log(x)`", "The effect diminishes as x grows", "Income · population"],
        ["`x²`, `x³`", "The relationship curves", "Age against certain risks"],
        ["`x₁ × x₂`", "One variable's effect depends on another", "Promotion × customer segment"],
        ["Binning", "The effect is stepwise rather than smooth", "Age → age bracket"],
        ["`log(y)`", "The **target** is heavily right-skewed", "House prices — but it must be converted back for reporting"]
      ]}},
      { note: "**Log-transforming the target means the prediction is no longer a mean.** `exp(mean(log y))` is a geometric mean, not an arithmetic one, so reporting money requires a correction (the smearing estimate) or the figures come out systematically low." },
      { h: "The pipeline as actually used" },
      { code: String.raw`from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression

pre = ColumnTransformer([
    ("num", Pipeline([("imp", SimpleImputer(strategy="median")),
                      ("sc",  StandardScaler())]), num_cols),
    ("cat", Pipeline([("imp", SimpleImputer(strategy="most_frequent")),
                      ("oh",  OneHotEncoder(handle_unknown="ignore"))]), cat_cols),
])

model = Pipeline([
    ("pre", pre),
    ("clf", LogisticRegression(penalty="l2", C=1.0, max_iter=1000,
                               class_weight="balanced")),
])`,
        cap: "`C` is the inverse of λ — a small C means strong regularisation, which is the opposite of what most people assume", lang: "python" },
      { h: "The parameters worth knowing" },
      { table: { head: ["Parameter", "Meaning", "Values to try"], rows: [
        ["`penalty`", "Which regularisation", "`l2` is a good default · `l1` when you want feature selection"],
        ["`C`", "The **inverse** of the regularisation strength", "`0.001` to `100` on a log scale"],
        ["`class_weight`", "Weighting for the rare class", "`balanced` when the data is imbalanced"],
        ["`solver`", "The algorithm used", "`lbfgs` generally · `saga` for l1 or large data"],
        ["`max_iter`", "Iteration cap", "Raise to 1000 when convergence warnings appear"]
      ]}}
    ],
    dataflow: [
      { p: "Real numbers walked through logistic regression, forward and updating, then interpreted." },
      { h: "The problem" },
      { code: String.raw`Predict whether a student passes, from hours studied

x = hours studied     y = 1 if they pass
four students:  (1, 0)  (2, 0)  (3, 1)  (4, 1)

start with  w = 0.0   b = 0.0   η = 0.5`,
        cap: "Small enough to compute by hand, with a pattern clear enough to learn", lang: "txt" },
      { h: "Round 1 — forward" },
      { code: String.raw`z = wx + b = 0 for everyone
σ(0) = 0.5 for everyone           ← 50% each, exactly as it should start

log loss = −(1/4)[ log(0.5) + log(0.5) + log(0.5) + log(0.5) ]
         = −log(0.5) = 0.693`,
        cap: "0.693 is precisely the two-class chance line, confirming a correct start", lang: "txt" },
      { h: "Round 1 — the gradient" },
      { code: String.raw`error = ŷ − y = [0.5−0, 0.5−0, 0.5−1, 0.5−1] = [0.5, 0.5, −0.5, −0.5]

∂L/∂w = (1/4) Σ xᵢ·errorᵢ
      = (1/4)[ 1(0.5) + 2(0.5) + 3(−0.5) + 4(−0.5) ]
      = (1/4)(0.5 + 1.0 − 1.5 − 2.0) = −0.5

∂L/∂b = (1/4) Σ errorᵢ = (1/4)(0.5+0.5−0.5−0.5) = 0`,
        cap: "A negative gradient on w means w should rise, matching the intuition that more study should mean more passing", lang: "txt" },
      { h: "Round 1 — the update" },
      { code: String.raw`w ← 0.0 − 0.5(−0.5) = 0.25
b ← 0.0 − 0.5(0)    = 0.0`,
        cap: "b does not move because the data is exactly balanced, two against two", lang: "txt" },
      { h: "Round 2" },
      { code: String.raw`z = [0.25, 0.50, 0.75, 1.00]
ŷ = [0.562, 0.622, 0.679, 0.731]

log loss = −(1/4)[ log(0.438) + log(0.378) + log(0.679) + log(0.731) ]
         = 0.649        ← down from 0.693`,
        cap: "The first two get slightly worse while the last two improve more, so the total falls", lang: "txt" },
      { h: "After convergence" },
      { code: String.raw`w ≈ 1.55   b ≈ −3.87

the boundary: σ(1.55x − 3.87) = 0.5
            ⟺ 1.55x − 3.87 = 0
            ⟺ x = 2.5 hours`,
        cap: "The model concludes that beyond 2.5 hours passing is more likely than not", lang: "txt" },
      { h: "Interpreting the coefficient" },
      { code: String.raw`w = 1.55

odds ratio = e^1.55 = 4.71

in plain language:
  "each additional hour of study multiplies the odds of passing by 4.7"`,
        cap: "That is the sentence you can say in a meeting, and the main reason this model survives", lang: "txt" },
      { note: "**Be careful with \"times\".** An odds ratio of 4.71 does not mean the probability multiplies by 4.71. At low p the two are close; at high p they diverge sharply, because a probability cannot exceed 1 while odds grow without limit." },
      { h: "Predicting a new value" },
      { code: String.raw`a student who studies 3.5 hours:
  z = 1.55(3.5) − 3.87 = 1.555
  p = σ(1.555) = 0.826

  → predicted to pass, with probability 82.6%`,
        cap: "And that 82.6% is usable, because logistic regression is generally well calibrated already", lang: "txt" },
      { h: "The same problem with linear regression" },
      { code: String.raw`using linear regression instead:
  x = 0    →  ŷ = −0.3     ← a negative probability
  x = 6    →  ŷ = 1.4      ← a probability above 1

and one outlier at x = 20 would drag the whole line and move the boundary`,
        cap: "Those two problems are exactly why logistic regression was invented", lang: "txt" }
    ],
    implementation: [
      { p: "Both models written from scratch in NumPy, then reconciled with scikit-learn." },
      { h: "1) Linear regression by the normal equation" },
      { code: String.raw`import numpy as np

def fit_normal(X, y):
    """returns w with the bias in the first position"""
    Xb = np.c_[np.ones(len(X)), X]              # prepend a column of ones
    # lstsq rather than inv — far more stable when XᵀX is near-singular
    w, *_ = np.linalg.lstsq(Xb, y, rcond=None)
    return w

X = np.array([[1.0], [2.0], [3.0], [4.0]])
y = np.array([2.1, 3.9, 6.2, 7.8])
w = fit_normal(X, y)
print(w)          # [0.15  1.93]  →  ŷ = 1.93x + 0.15`,
        cap: "`np.linalg.lstsq` uses SVD internally, so it survives a singular matrix where `inv` would explode", lang: "python" },
      { h: "2) Linear regression by gradient descent" },
      { code: String.raw`def fit_gd(X, y, lr=0.01, epochs=1000):
    Xb = np.c_[np.ones(len(X)), X]
    w  = np.zeros(Xb.shape[1])
    n  = len(y)
    for _ in range(epochs):
        pred = Xb @ w
        grad = (2 / n) * Xb.T @ (pred - y)      # Xᵀ(prediction − truth)
        w   -= lr * grad
    return w

print(fit_gd(X, y))     # close to the normal equation`,
        cap: "It must converge to the same answer — if it does not, the learning rate or the iteration count is wrong", lang: "python" },
      { h: "3) Logistic regression from scratch" },
      { code: String.raw`def sigmoid(z):
    # clip to stop exp overflowing on large negative z
    return 1 / (1 + np.exp(-np.clip(z, -500, 500)))

def fit_logistic(X, y, lr=0.1, epochs=5000, l2=0.0):
    Xb = np.c_[np.ones(len(X)), X]
    w  = np.zeros(Xb.shape[1])
    n  = len(y)
    for _ in range(epochs):
        p    = sigmoid(Xb @ w)
        grad = (Xb.T @ (p - y)) / n
        grad[1:] += l2 * w[1:] / n              # never penalise the bias
        w   -= lr * grad
    return w

X = np.array([[1.0], [2.0], [3.0], [4.0]])
y = np.array([0, 0, 1, 1])
w = fit_logistic(X, y)
print(w)                       # [−3.87  1.55]
print("boundary at x =", -w[0] / w[1])   # 2.5`,
        cap: "**Not penalising the bias** is the correct detail — it must be free to move with the class balance", lang: "python" },
      { h: "4) A numerically safe log loss" },
      { code: String.raw`def log_loss(y, p, eps=1e-15):
    p = np.clip(p, eps, 1 - eps)                # stops log(0) = -inf
    return -np.mean(y * np.log(p) + (1 - y) * np.log(1 - p))`,
        cap: "The clip prevents NaN when the model becomes fully confident, which always happens once the classes separate", lang: "python" },
      { h: "5) Reconciling with scikit-learn" },
      { code: String.raw`from sklearn.linear_model import LogisticRegression

# turn regularisation off so it matches the hand-written version
skl = LogisticRegression(penalty=None, max_iter=10000).fit(X, y)
print(skl.intercept_, skl.coef_)     # should be close to [−3.87] [[1.55]]`,
        cap: "**scikit-learn applies L2 by default** — leave it on and your own implementation will not match, which puzzles a lot of people", lang: "python" },
      { h: "6) Turning coefficients into plain language" },
      { code: String.raw`import pandas as pd

coefs = pd.DataFrame({
    "feature": feature_names,
    "coef":    model.coef_[0],
    "odds_ratio": np.exp(model.coef_[0]),
}).sort_values("odds_ratio", ascending=False)

print(coefs)
# feature        coef   odds_ratio
# tenure         1.24   3.46        ← +1 SD multiplies the odds by 3.46
# monthly_charge 0.31   1.36
# has_contract  -0.88   0.41        ← lowers the odds by 59%`,
        cap: "Scale the features first, or coefficient magnitudes across different units cannot be compared at all", lang: "python" },
      { h: "7) Finding the best C" },
      { code: String.raw`from sklearn.linear_model import LogisticRegressionCV

model = LogisticRegressionCV(
    Cs=np.logspace(-4, 4, 20),      # log scale, never linear
    cv=5, scoring="average_precision",
    penalty="l2", solver="lbfgs", max_iter=2000,
).fit(X_tr, y_tr)

print("chosen C:", model.C_)`,
        cap: "Always sweep C logarithmically, because its effect is multiplicative rather than additive", lang: "python" },
      { h: "8) When you need p-values and confidence intervals" },
      { code: String.raw`import statsmodels.api as sm

Xb = sm.add_constant(X)
res = sm.Logit(y, Xb).fit()
print(res.summary())

#                 coef    std err       z      P>|z|    [0.025   0.975]
# const         -3.8700     1.821   -2.125     0.034   -7.439   -0.301
# hours          1.5500     0.702    2.208     0.027    0.174    2.926`,
        cap: "scikit-learn omits p-values because it targets prediction; statsmodels targets statistical inference", lang: "python" },
      { note: "**A p-value means something only if the model's assumptions hold.** With correlated residuals or non-constant variance the intervals come out too narrow — check the assumptions before deciding anything on them." }
    ],
    tricks: [
      { h: "Symptoms and causes" },
      { table: { head: ["Symptom", "Cause", "Fix"], rows: [
        ["Enormous coefficients with flipping signs", "**Multicollinearity**", "Check VIF · drop redundant features · use ridge"],
        ["`ConvergenceWarning: lbfgs failed to converge`", "Unscaled features · `max_iter` too low · **perfect separation**", "Scale first · raise max_iter · if it persists, suspect separation"],
        ["A coefficient growing without bound", "**Perfect separation** — a feature splits the classes exactly", "Add regularisation (lower `C`), which fixes it immediately"],
        ["Everything predicted as one class", "Severe imbalance", "`class_weight='balanced'` · move the threshold"],
        ["A wide train/test gap", "Too many features for the number of rows", "Fewer features · more regularisation"],
        ["Poor predictions with clearly patterned residuals", "The relationship is not linear", "Add polynomial or interaction terms · or switch to trees"]
      ]}},
      { h: "Perfect separation — when the model is too good and breaks" },
      { code: String.raw`if a feature splits the classes exactly:
   x < 5  → y = 0 for every row
   x ≥ 5  → y = 1 for every row

MLE pushes w → ∞ so that σ approaches exactly 0 and 1
→ no finite solution exists → it never converges`,
        cap: "Regularisation fixes it instantly, because penalising large w guarantees a finite optimum", lang: "txt" },
      { note: "**Perfect separation is usually a sign of leakage.** A feature that splits the classes exactly is very rare in genuine data — check that it really exists at prediction time before celebrating." },
      { h: "Reading a residual plot" },
      { table: { head: ["The pattern you see", "What it means", "What to do"], rows: [
        ["Random scatter around zero", "Good — the assumptions hold", "Nothing"],
        ["A U shape", "The relationship curves", "Add `x²`"],
        ["A cone widening to the right", "Non-constant variance", "Log-transform the target · or weighted least squares"],
        ["A pattern over time", "Residuals are not independent", "Add lag features · use a time-series model"]
      ]}},
      { h: "Rules that always apply" },
      { ul: [
        "**Always scale when regularising** — no exceptions",
        "**Check VIF before interpreting coefficients** — no check, no interpretation",
        "**Sweep `C` logarithmically**, because its effect is multiplicative",
        "**Never penalise the bias** when regularising",
        "**Report odds ratios rather than raw coefficients** to a non-technical audience",
        "**Always compare against a baseline** — a linear model that cannot beat one has a bug"
      ]},
      { h: "Where linear models lose" },
      { table: { head: ["Situation", "Why it loses", "Where to go"], rows: [
        ["The effect reverses across ranges", "A straight line has only one slope", "Trees · or bin the feature and one-hot it"],
        ["Too many interactions to write by hand", "Every pair must be specified explicitly", "Gradient boosting finds them itself"],
        ["Unstructured data (images, audio, raw text)", "The meaningful features are not columns", "Neural networks"],
        ["More features than rows", "`XᵀX` is certainly singular", "Lasso · or reduce dimensionality first"]
      ]}},
      { h: "The most common mistakes" },
      { ul: [
        "**Forgetting scikit-learn applies L2 by default** and wondering why the numbers differ from a hand calculation",
        "**Interpreting coefficients without scaling**, then concluding that a small-unit feature matters more",
        "**Full one-hot without regularisation**, then meeting a singular matrix",
        "**Log-transforming the target and reporting the naive back-transform**, which is systematically low",
        "**Believing p-values without checking the assumptions**"
      ]}
    ],
    eval: [
      { p: "The questions that separate understanding the structure from calling a library." },
      { qa: [
        { q: "Why does linear regression use MSE?",
          a: "Because it follows from maximum likelihood under the assumption of Gaussian noise with constant variance — swap in a Laplace assumption and you derive MAE, which is more robust to outliers." },
        { q: "How do you choose between the normal equation and gradient descent?",
          a: "The normal equation gives the answer in one shot with nothing to tune, but inverting costs O(n³) in the feature count, so it suits up to roughly ten thousand features. Beyond that, or when features are strongly related, use gradient descent." },
        { q: "Why can `(XᵀX)⁻¹` break?",
          a: "When features are nearly perfectly related, the columns of X are almost multiples of one another, so `XᵀX` is nearly singular; the inverse becomes huge and hypersensitive, and coefficients cancel each other and flip on tiny changes to the data." },
        { q: "How does ridge fix that mathematically?",
          a: "It adds `λI` to the diagonal of `XᵀX`, raising the smallest eigenvalue to at least λ, so the matrix is always invertible even when the original is singular." },
        { q: "Is logistic regression a regression or a classifier?",
          a: "A classifier. The name comes from regressing the **log-odds**, a continuous quantity, and then converting back to a probability with the sigmoid." },
        { q: "Why does logistic regression have no closed form?",
          a: "Setting the derivative of log loss to zero leaves `w` inside the sigmoid, which is non-linear, so it cannot be isolated algebraically. An iterative method is required — gradient descent, Newton or IRLS." },
        { q: "How do the two gradients differ?",
          a: "They have the same shape, `Xᵀ(prediction − truth)`, differing only in what prediction means: `Xw` in one case, `σ(Xw)` in the other. Both belong to the same family of generalized linear models." },
        { q: "Is a logistic regression's decision boundary straight?",
          a: "Always, because the condition `σ(wᵀx+b) ≥ 0.5` reduces to `wᵀx + b ≥ 0`, the equation of a hyperplane. The curvature you see comes from the sigmoid, not the boundary." },
        { q: "How do you get a curved boundary then?",
          a: "Build curved features yourself, adding `x²` or `x₁x₂`, so a straight line in the enlarged space becomes a curve in the original — the same principle as the SVM kernel trick." },
        { q: "How do you interpret a logistic regression coefficient?",
          a: "It is the change in log-odds per unit increase, so `e^w` is the odds ratio: `w = 1.55` means one more unit multiplies the odds by 4.71." },
        { q: "Does an odds ratio of 4.7 mean the probability multiplies by 4.7?",
          a: "No. At low probabilities the two are close, but at high probabilities they diverge sharply, because a probability cannot exceed 1 while odds grow without bound." },
        { q: "When is scaling required?",
          a: "For gradient descent, for any regularisation, and whenever you want to compare coefficient magnitudes across features. It is unnecessary for the plain normal equation, whose result is scale-invariant." },
        { q: "Why does regularisation need scaled features?",
          a: "The penalty punishes coefficient size, and a feature in large units naturally carries a small coefficient, so it escapes the penalty unfairly. Scaling puts every feature on the same footing." },
        { q: "What is `C` in scikit-learn?",
          a: "The **inverse** of the regularisation strength — a small C means heavy penalisation, the opposite of the `alpha` or `λ` many people expect — and it should be swept on a log scale because its effect is multiplicative." },
        { q: "What is perfect separation, and how do you fix it?",
          a: "A feature that splits the classes exactly, so maximum likelihood pushes `w` toward infinity to make the sigmoid reach 0 and 1, and nothing converges. Regularisation guarantees a finite optimum — and leakage should be suspected." },
        { q: "How do full one-hot and dummy encoding differ?",
          a: "Full one-hot has k columns that sum to exactly 1, duplicating the bias and making the matrix singular; dummy drops one column as a baseline. Use dummies for formal interpretation, and full one-hot is fine when regularisation is present." },
        { q: "How do you handle more than two classes?",
          a: "With softmax, the general form of the sigmoid that collapses back to it at k=2, or with one-vs-rest, which trains k binary models — parallelisable, but its probabilities do not sum to one." },
        { q: "Which linear-regression assumption fails most often?",
          a: "That features are unrelated to one another. It does not always hurt predictions, but it destroys the interpretation of the coefficients, which was the reason for choosing the model." },
        { q: "What does a U-shaped residual plot tell you?",
          a: "That the true relationship curves while the model can only fit a line. Adding a squared term fixes it, and the model remains linear in its parameters, so every formula still applies." },
        { q: "When should you abandon a linear model?",
          a: "When the relationship is non-linear and adding features does not help, when there are too many interactions to specify by hand, or when the data is unstructured — that is where trees and neural networks start to pay." }
      ]},
      { h: "Further reading" },
      { links: [
        { label: "scikit-learn — Linear Models", url: "https://scikit-learn.org/stable/modules/linear_model.html", note: "Every variant with its formula, including ridge, lasso and elastic net" },
        { label: "StatQuest — Logistic Regression", url: "https://www.youtube.com/watch?v=yIYKR4sgzI8", note: "Odds, log-odds and maximum likelihood explained visually, step by step" },
        { label: "An Introduction to Statistical Learning — chapters 3-4", url: "https://www.statlearning.com/", note: "The reference text for both models; free, with R and Python code" },
        { label: "statsmodels — Logit", url: "https://www.statsmodels.org/stable/generated/statsmodels.discrete.discrete_model.Logit.html", note: "For p-values, confidence intervals and assumption diagnostics" },
        { label: "UCLA — FAQ: How do I interpret odds ratios?", url: "https://stats.oarc.ucla.edu/other/mult-pkg/faq/general/faq-how-do-i-interpret-odds-ratios-in-logistic-regression/", note: "The most careful and correct explanation of odds-ratio interpretation online" },
        { label: "Wikipedia — Multicollinearity", url: "https://en.wikipedia.org/wiki/Multicollinearity", note: "VIF, condition number, and the effect on coefficients" },
        { label: "Wikipedia — Separation (statistics)", url: "https://en.wikipedia.org/wiki/Separation_(statistics)", note: "Where perfect separation comes from and the formal remedies" }
      ]}
    ]
  }
});
