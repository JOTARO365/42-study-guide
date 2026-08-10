/* ML Math — คณิตศาสตร์ที่ machine learning วิ่งอยู่บนนั้น */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

window.TEACHING_DATA.push({
  id: "ml_math",
  name: "คณิตศาสตร์ของ ML — พีชคณิตเชิงเส้น แคลคูลัส ความน่าจะเป็น",
  nameEn: "The Mathematics of ML — Linear Algebra, Calculus, Probability",
  titleShort: { th: "คณิตศาสตร์ของ ML", en: "ML Mathematics" },
  tag: {
    th: "สี่วิชาที่แบก machine learning ไว้ทั้งหมด — พีชคณิตเชิงเส้นให้รูปร่าง แคลคูลัสให้การเรียนรู้ ความน่าจะเป็นให้ loss และทฤษฎีสารสนเทศบอกว่าทำไมต้อง loss ตัวนั้น ทุกสมการมีที่มา ไม่ใช่ท่องจำ",
    en: "The four subjects that carry all of machine learning — linear algebra gives the shapes, calculus gives the learning, probability gives the loss, and information theory says why that loss. Every equation is derived, not memorised"
  },
  accent: "#a78bfa",
  sections: {
    principle: [
      { h: "ทำไมต้องรู้คณิตศาสตร์ ในเมื่อเรียก `model.fit()` ก็ได้" },
      { p: "เรียกได้จริง และใช้งานได้จริงในหลายกรณี แต่ **วันที่มันพัง คณิตศาสตร์คือสิ่งเดียวที่บอกได้ว่าพังตรงไหน** — loss กลายเป็น `NaN`, gradient หายไปจนชั้นต้น ๆ ไม่ขยับ, โมเดลมั่นใจ 95% แต่ถูกแค่ 60% ทั้งสามอย่างนี้อ่านจากเอกสาร API ไม่เจอ" },
      { p: "หน้านี้ไม่ได้สอนคณิตศาสตร์ทั้งหมด — สอนเฉพาะส่วนที่ **โผล่ขึ้นมาจริงตอนดีบัก** และทุกสมการจะถูกอนุมานให้เห็นที่มา เพราะ **สูตรที่อนุมานเองไม่ได้ คือสูตรที่ดีบักไม่ได้**" },
      { h: "สี่วิชา สี่หน้าที่" },
      { table: { head: ["วิชา", "ให้อะไรกับ ML", "ตัวอย่างที่เจอทุกวัน"], rows: [
        ["**พีชคณิตเชิงเส้น**", "รูปร่างของข้อมูลและการแปลง", "`(m,k) @ (k,n)` · shape error · attention score"],
        ["**แคลคูลัส**", "กลไกการเรียนรู้", "gradient descent · backpropagation · gradient หาย/ระเบิด"],
        ["**ความน่าจะเป็น**", "ที่มาของ loss function", "ทำไม regression ใช้ MSE แต่ classification ใช้ cross-entropy"],
        ["**ทฤษฎีสารสนเทศ**", "เหตุผลว่าทำไมต้อง loss ตัวนั้น", "entropy · cross-entropy · KL divergence"]
      ]}},
      { h: "หนึ่งบรรทัดที่เป็นหัวใจของทั้งหมด" },
      { code: String.raw`y = Wx + b`, cap: "หนึ่งชั้นของ neural network ทั้งชั้น — ที่เหลือคือการจัดการรูปร่างและการหาอนุพันธ์ของบรรทัดนี้", lang: "txt" },
      { p: "จากบรรทัดเดียวนี้: `W` กับ `x` ต้องมีรูปร่างที่คูณกันได้ (พีชคณิตเชิงเส้น), การหาว่า `W` ควรขยับไปทางไหนคือการหาอนุพันธ์ (แคลคูลัส), การวัดว่า `y` ผิดแค่ไหนคือ loss ที่มาจากสมมติฐานเชิงความน่าจะเป็น และการเลือก loss ตัวนั้นอธิบายด้วยทฤษฎีสารสนเทศ" },
      { h: "สิ่งที่หน้านี้จะทำให้ทำได้" },
      { ul: [
        "อ่าน shape error ออกว่าผิดตรงไหนโดยไม่ต้องเดา",
        "อนุมาน backpropagation ด้วยมือบนเครือข่ายเล็ก ๆ",
        "อธิบายได้ว่าทำไม MSE เหมาะกับ regression และ cross-entropy เหมาะกับ classification — โดยไม่ตอบว่า 'เพราะเขาใช้กัน'",
        "ตรวจว่า gradient ที่เขียนเองถูกไหมด้วย finite difference",
        "รู้ว่า `NaN` ในระหว่างเทรนมาจากไหนได้บ้าง และไล่ตามลำดับไหน"
      ]},
      { note: "**สัญกรณ์ที่ใช้ทั้งหน้า:** ตัวพิมพ์เล็กหนา = เวกเตอร์ (`x`), ตัวพิมพ์ใหญ่ = เมทริกซ์ (`W`), `ŷ` = ค่าที่โมเดลทำนาย, `y` = ค่าจริง, `θ` = พารามิเตอร์ทั้งหมด, `η` = learning rate, `L` = loss" },
      { h: "อ่านหน้านี้ยังไง" },
      { p: "เรียงจากรูปร่าง → การเรียนรู้ → ที่มาของ loss → ลงมือทำ ถ้าเพิ่งเริ่มให้อ่านตามลำดับ ถ้ามาแก้ปัญหาเฉพาะหน้าให้ข้ามไปที่ **ทริค & Best Practice** ซึ่งเรียงตามอาการ" }
    ],

    theory: [
      { p: "หมวดนี้ปูสี่วิชาให้พอใช้จริง ไม่ใช่พอสอบผ่าน — แต่ละหัวข้อจบด้วยว่ามันโผล่ที่ไหนใน ML" },
      { h: "1) เวกเตอร์คืออะไรจริง ๆ" },
      { p: "ในทางคณิตศาสตร์คือสมาชิกของปริภูมิเวกเตอร์ แต่ใน ML ให้คิดง่าย ๆ ว่า **เวกเตอร์คือรายการตัวเลขที่มีความหมายตามตำแหน่ง** — `[อายุ, รายได้, จำนวนครั้งที่ซื้อ]` เป็นเวกเตอร์ของลูกค้าหนึ่งคน ตำแหน่งที่ 0 จะเป็นอายุเสมอ" },
      { code: String.raw`x = [25, 48000, 7]        ลูกค้าหนึ่งคน  shape (3,)
X = [[25, 48000, 7],      ลูกค้า 3 คน     shape (3, 3)
     [41, 92000, 2],
     [33, 61000, 5]]`, cap: "หนึ่งแถว = หนึ่งตัวอย่าง · หนึ่งคอลัมน์ = หนึ่ง feature (แบบแผนที่ทุกไลบรารีใช้)", lang: "txt" },
      { h: "2) dot product — ปฏิบัติการเดียวที่สำคัญที่สุด" },
      { code: String.raw`a · b = Σ aᵢbᵢ = |a| |b| cos θ

[1, 2, 3] · [4, 5, 6] = 1×4 + 2×5 + 3×6 = 32`,
        cap: "วัด 'ความไปทางเดียวกัน' — ตั้งฉากกันได้ 0, ทางเดียวกันได้ค่าสูงสุด", lang: "txt" },
      { p: "**สามอย่างนี้คือ dot product ตัวเดียวกันหมด**: ค่าก่อน activation ของนิวรอนหนึ่งตัว (`w · x + b`), คะแนนความคล้ายใน vector search (cosine similarity), และคะแนน attention ใน transformer (`q · k`) — เข้าใจตัวเดียวได้ทั้งสามเรื่อง" },
      { h: "3) การคูณเมทริกซ์ และกฎรูปร่าง" },
      { code: String.raw`(m, k) @ (k, n) → (m, n)
       ‾‾‾‾‾‾‾‾
       ต้องเท่ากัน แล้วหายไป

ตัวอย่าง: X(32, 784) @ W(784, 128) → (32, 128)
          batch 32 ตัวอย่าง · 784 feature → 128 นิวรอน`,
        cap: "มิติในหายไป มิตินอกอยู่ต่อ — ท่องกฎนี้ข้อเดียวแก้ shape error ได้เกือบทั้งหมด", lang: "txt" },
      { p: "**การคูณเมทริกซ์ไม่สลับที่**: `AB ≠ BA` โดยทั่วไป — ลำดับจึงมีความหมาย และเป็นเหตุผลที่ `W @ x` กับ `x @ W` ให้คนละอย่าง (หรือคูณไม่ได้เลย)" },
      { h: "4) Broadcasting — ที่มาของบั๊กเงียบที่สุด" },
      { p: "การบวกรูปร่างไม่เท่ากันโดยไม่คัดลอกข้อมูลจริง เทียบจาก **ขวาไปซ้าย** และแต่ละมิติต้องเท่ากันหรือเป็น 1" },
      { code: String.raw`(32, 128) + (128,)   →  (32, 128)   ✓ บวก bias ทุกแถว
(32, 128) + (32,)    →  error            ✗ เทียบจากขวา: 128 กับ 32 ไม่ตรง
(32, 1)   + (1, 32)  →  (32, 32)         ⚠ ได้ผลแต่ผิดความตั้งใจ`,
        cap: "บรรทัดสุดท้ายคือกับดัก: มันไม่ error แต่กลายเป็น outer product แล้วโมเดลเทรนต่อไปเงียบ ๆ", lang: "txt" },
      { note: "**อาการของบั๊ก broadcasting**: loss ลดลงเรื่อย ๆ แต่ผลทำนายไร้สาระ และ memory พุ่งเกินคาด — เช็ค `.shape` ของทุกตัวกลางทางก่อนสงสัยอย่างอื่น" },
      { h: "5) Norm — วิธีวัดขนาดของเวกเตอร์" },
      { table: { head: ["Norm", "สูตร", "ใช้ทำอะไรใน ML"], rows: [
        ["L2 (Euclidean)", "`‖x‖₂ = √Σxᵢ²`", "weight decay · gradient clipping · ระยะทางใน kNN"],
        ["L1 (Manhattan)", "`‖x‖₁ = Σ|xᵢ|`", "**ดันสัมประสิทธิ์ให้เป็นศูนย์พอดี** จึงเป็นตัวที่ทำ feature selection"],
        ["L∞", "`max|xᵢ|`", "ขอบเขตของ adversarial perturbation"]
      ]}},
      { p: "**ทำไม L1 ถึงให้ศูนย์จริง แต่ L2 ไม่ให้**: อนุพันธ์ของ `|w|` เป็นค่าคงที่ ±1 ไม่ว่า `w` จะเล็กแค่ไหน แรงดันเข้าศูนย์จึงไม่ลดลง ส่วนอนุพันธ์ของ `w²` คือ `2w` ซึ่งเล็กลงเรื่อย ๆ เมื่อเข้าใกล้ศูนย์ จึงได้แค่ 'เล็กมาก' ไม่ใช่ 'ศูนย์'" },
      { h: "6) Eigenvector — ทิศทางที่เมทริกซ์ทำได้แค่ยืด" },
      { code: String.raw`A v = λ v        v = eigenvector (ทิศทาง)
                 λ = eigenvalue (ยืดกี่เท่า)`,
        cap: "คูณด้วย A แล้วทิศทางไม่เปลี่ยน เปลี่ยนแค่ความยาว", lang: "txt" },
      { p: "**PCA คือการหา eigenvector ของ covariance matrix** — eigenvector คือแกนที่ข้อมูลกระจายมากที่สุด และ eigenvalue คือปริมาณความแปรปรวนของแกนนั้น เลือก k แกนแรกก็คือลดมิติโดยเสียข้อมูลน้อยที่สุดในเชิงความแปรปรวน" },
      { h: "7) SVD — รูปทั่วไปที่ใช้ได้กับทุกเมทริกซ์" },
      { code: String.raw`A = U Σ Vᵀ

A(m,n)  =  U(m,m) · Σ(m,n) · Vᵀ(n,n)
           Σ เป็นแนวทแยง เรียงจากมากไปน้อย`,
        cap: "ตัด Σ ให้เหลือ r ตัวแรก = ประมาณ A ด้วยเมทริกซ์อันดับ r ที่ดีที่สุด", lang: "txt" },
      { p: "นี่คือคณิตศาสตร์เบื้องหลัง **LoRA**: แทนที่จะขยับ `W` ทั้งก้อน เพิ่มส่วนต่างอันดับต่ำ `ΔW = BA` เข้าไป — ความคิดเดียวกับการเก็บแค่ค่า singular ที่ใหญ่ที่สุด" },
      { h: "8) ความน่าจะเป็น: expectation กับ variance" },
      { code: String.raw`E[X]   = Σ p(x)·x                ค่าคาดหวัง (ค่าเฉลี่ยถ่วงน้ำหนัก)
Var[X] = E[(X − E[X])²]          ความแปรปรวน (กระจายแค่ไหน)
       = E[X²] − (E[X])²         รูปที่คำนวณง่ายกว่า`,
        cap: "'loss เฉลี่ยของ batch' ทุกครั้งคือการประมาณค่าคาดหวังบน distribution ของข้อมูล", lang: "txt" },
      { h: "9) Bayes — เรียงสมการเดิมใหม่" },
      { code: String.raw`P(θ | D) = P(D | θ) · P(θ) / P(D)

posterior = likelihood × prior / evidence
ความเชื่อหลังเห็นข้อมูล = ข้อมูลสนับสนุนแค่ไหน × ความเชื่อเดิม / ตัวปรับให้รวมเป็น 1`,
        cap: "ไม่ใช่ทฤษฎีลึกลับ — เป็นแค่การเขียน P(A∩B) สองทางแล้วจับเท่ากัน", lang: "txt" },
      { h: "10) ทฤษฎีสารสนเทศ: entropy ถึง KL" },
      { code: String.raw`H(p)     = −Σ p(x) log p(x)          ความประหลาดใจเฉลี่ยของ p
H(p, q)  = −Σ p(x) log q(x)          ประหลาดใจเฉลี่ยเมื่อใช้ q ทำนาย p
D(p‖q)   = H(p, q) − H(p)            ส่วนเกินที่จ่ายเพราะใช้ q แทน p`,
        cap: "H(p) คงที่ตามข้อมูล → ลด cross-entropy = ลด KL divergence", lang: "txt" },
      { p: "**entropy สูงสุดเมื่อทุกอย่างเท่ากันหมด** (ไม่รู้อะไรเลย) และ **เป็นศูนย์เมื่อแน่ใจ 100%** — เหรียญยุติธรรมมี entropy 1 บิต เหรียญที่ออกหัวเสมอมี 0 บิต" },
      { note: "**KL ไม่ใช่ระยะทาง** — `D(p‖q) ≠ D(q‖p)` การสลับที่จึงเปลี่ยนความหมาย: `D(data‖model)` ลงโทษการที่โมเดลให้ความน่าจะเป็นต่ำกับสิ่งที่เกิดจริง ส่วน `D(model‖data)` ลงโทษการที่โมเดลกระจายไปในที่ที่ไม่มีข้อมูล" }
    ],

    foundations: [
      { p: "หมวดนี้เจาะพีชคณิตเชิงเส้นให้ลึกพอที่จะอ่าน error และออกแบบชั้นของโมเดลได้เอง" },
      { h: "รูปร่างของทุกอย่างในเครือข่ายจริง" },
      { code: String.raw`ภาพ MNIST หนึ่ง batch
X       (32, 784)      32 ภาพ · 28×28 = 784 พิกเซลที่ยืดเป็นแถว
W1      (784, 128)     784 เข้า → 128 นิวรอน
b1      (128,)         หนึ่ง bias ต่อหนึ่งนิวรอน
Z1 = X @ W1 + b1       (32, 128)    ← broadcasting เติม b1 ให้ทุกแถว
A1 = relu(Z1)          (32, 128)    activation ไม่เปลี่ยนรูปร่าง
W2      (128, 10)      128 → 10 คลาส
Z2 = A1 @ W2 + b2      (32, 10)     logits
ŷ  = softmax(Z2)       (32, 10)     แต่ละแถวรวมได้ 1`,
        cap: "เขียนรูปร่างกำกับทุกบรรทัดก่อนดีบักค่า — 90% ของบั๊กจบตรงนี้", lang: "python" },
      { h: "ทำไม W ถึงเป็น (in, out) ไม่ใช่ (out, in)" },
      { p: "เป็นแบบแผนที่มาจากการวาง **หนึ่งแถวคือหนึ่งตัวอย่าง** ทำให้เขียน `X @ W` ได้ตรง ๆ โดยไม่ต้อง transpose — ถ้าเก็บข้อมูลเป็นหนึ่งคอลัมน์ต่อหนึ่งตัวอย่าง (แบบตำราคณิตศาสตร์) จะกลายเป็น `W @ X` และ `W` จะมีรูปร่างกลับกัน **ทั้งสองแบบถูก แต่ต้องเลือกอันเดียวแล้วอยู่กับมัน**" },
      { h: "การ transpose ที่ต้องเข้าใจ ไม่ใช่ท่อง" },
      { code: String.raw`(A @ B)ᵀ = Bᵀ @ Aᵀ        สลับลำดับด้วย ไม่ใช่แค่ทรานสโพสทีละตัว

ตอน backprop:
  Z = X @ W                    (32,784) @ (784,128) → (32,128)
  dL/dW = Xᵀ @ dL/dZ           (784,32) @ (32,128)  → (784,128) ✓ ตรงกับ W
  dL/dX = dL/dZ @ Wᵀ           (32,128) @ (128,784) → (32,784)  ✓ ตรงกับ X`,
        cap: "รูปร่างของ gradient ต้องเท่ากับรูปร่างของสิ่งที่มันเป็นอนุพันธ์เสมอ — ใช้ข้อนี้ตรวจสูตรได้ทันที", lang: "txt" },
      { note: "**เคล็ดลับที่ใช้ได้ตลอดชีวิต**: ถ้าจำไม่ได้ว่าต้อง transpose ตัวไหน ให้เขียนรูปร่างที่ต้องการออกมาก่อน แล้วจัดลำดับให้มิติในตรงกัน — มีทางเดียวเท่านั้นที่ทำได้" },
      { h: "Hadamard product — คูณทีละตัว ไม่ใช่ matmul" },
      { code: String.raw`A ⊙ B        คูณตำแหน่งต่อตำแหน่ง รูปร่างต้องเท่ากัน
A @ B        คูณเมทริกซ์ ตามกฎ (m,k)@(k,n)

ใน backprop ของ ReLU:
  dL/dZ = dL/dA ⊙ (Z > 0)      ← Hadamard ไม่ใช่ matmul`,
        cap: "สับสนสองอันนี้คือบั๊กที่รูปร่างถูกแต่ค่าผิด ซึ่งหายากกว่า shape error มาก", lang: "txt" },
      { h: "Jacobian — และเหตุผลที่ backprop ไม่เคยสร้างมันขึ้นมาจริง" },
      { code: String.raw`J[i][j] = ∂yᵢ / ∂xⱼ        เมทริกซ์ของอนุพันธ์ย่อยทั้งหมด

ชั้นที่มี 1000 เข้า 1000 ออก → Jacobian ขนาด 1000×1000 = 1 ล้านช่อง
ต่อ 1 ชั้น ต่อ 1 ตัวอย่าง`,
        cap: "จึงไม่มีใครสร้างจริง — backprop คำนวณ 'เวกเตอร์คูณ Jacobian' ตรง ๆ โดยข้ามการสร้างเมทริกซ์", lang: "txt" },
      { h: "ความแตกต่างที่คนสับสนที่สุด 3 คู่" },
      { table: { head: ["", "คืออะไร", "ต่างกันตรงไหน"], rows: [
        ["อนุพันธ์ vs gradient", "อนุพันธ์ = ฟังก์ชันตัวแปรเดียว · gradient = เวกเตอร์ของอนุพันธ์ย่อย", "gradient คืออนุพันธ์ที่ขยายไปหลายมิติ และมันเป็น **เวกเตอร์** จึงมีทิศทาง"],
        ["parameter vs hyperparameter", "parameter = สิ่งที่โมเดลเรียนเอง (`W`, `b`) · hyperparameter = สิ่งที่เราตั้ง (`η`, จำนวนชั้น)", "gradient descent ขยับได้แค่ parameter"],
        ["loss vs metric", "loss = สิ่งที่ optimize ต้องหาอนุพันธ์ได้ · metric = สิ่งที่วัดความสำเร็จจริง", "accuracy หาอนุพันธ์ไม่ได้ จึงเทรนด้วยไม่ได้ — ต้องใช้ cross-entropy แทนแล้ววัด accuracy ทีหลัง"]
      ]}},
      { h: "ตัวเลขทศนิยมที่ต้องระวัง" },
      { ul: [
        "**float32 มีความละเอียดราว 7 หลักทศนิยม** — บวกเลขเล็กเข้ากับเลขใหญ่แล้วเลขเล็กหายไปเฉย ๆ",
        "**`log(0) = −inf`** จึงต้อง clip ความน่าจะเป็นให้อยู่ใน `[ε, 1−ε]` ก่อนใส่ log เสมอ",
        "**`e^x` ล้นที่ประมาณ x = 88 ใน float32** จึงต้องลบค่าสูงสุดออกก่อนใน softmax",
        "**การบวกไม่สลับที่ใน floating point** — `(a+b)+c ≠ a+(b+c)` ซึ่งเป็นเหตุผลหนึ่งที่ผลรันซ้ำบน GPU ไม่เหมือนเดิมเป๊ะ"
      ]},
      { code: String.raw`softmax ที่ปลอดภัย:
  z = z − max(z)                   ← ไม่เปลี่ยนผลลัพธ์ แต่กันล้น
  exp_z = e^z
  return exp_z / sum(exp_z)

พิสูจน์ว่าไม่เปลี่ยนผล:
  e^(zᵢ−c) / Σe^(zⱼ−c) = (e^zᵢ·e^−c) / (e^−c·Σe^zⱼ) = e^zᵢ / Σe^zⱼ`,
        cap: "e^−c ตัดกันบนล่างพอดี จึงลบค่าคงที่ตัวไหนก็ได้ — เลือก max เพราะทำให้เลขชี้กำลังสูงสุดเป็น 0", lang: "txt" }
    ],

    architecture: [
      { p: "หมวดนี้คือแคลคูลัส — กลไกที่ทำให้โมเดล 'เรียนรู้' ได้จริง อนุมานตั้งแต่ต้น" },
      { h: "Gradient descent ในหนึ่งบรรทัด" },
      { code: String.raw`θ ← θ − η ∇L(θ)`,
        cap: "gradient ชี้ไปทางที่ loss เพิ่มเร็วที่สุด จึงต้องเดินสวนทาง — เครื่องหมายลบคือทั้งหมดของเรื่องนี้", lang: "txt" },
      { p: "**`η` (learning rate) คือความยาวก้าว** — ใหญ่ไปจะกระโดดข้ามจุดต่ำสุดแล้วแกว่ง เล็กไปจะช้าจนไม่ทันใช้ นี่คือ hyperparameter ที่มีผลมากที่สุดตัวเดียวในการเทรน" },
      { h: "Chain rule — หัวใจของ backpropagation" },
      { code: String.raw`ถ้า  L = L(g(f(x)))

dL/dx = dL/dg · dg/df · df/dx
        ‾‾‾‾‾   ‾‾‾‾‾   ‾‾‾‾‾
        แต่ละชั้นให้มาหนึ่งตัวคูณ`,
        cap: "backprop ไม่ใช่อัลกอริทึมพิเศษ — เป็นการใช้ chain rule อย่างมีระเบียบเท่านั้น", lang: "txt" },
      { p: "**สองผลลัพธ์ที่ตกออกมาจากรูปผลคูณโดยตรง:**" },
      { table: { head: ["ปรากฏการณ์", "เกิดจาก", "แก้ยังไง"], rows: [
        ["**gradient หาย** (vanishing)", "ตัวคูณหลายตัวมีค่าน้อยกว่า 1 → คูณกันแล้วเข้าใกล้ศูนย์ ชั้นต้น ๆ ไม่ขยับ", "ReLU (อนุพันธ์ = 1) แทน sigmoid (สูงสุด 0.25) · residual connection · batch norm"],
        ["**gradient ระเบิด** (exploding)", "ตัวคูณมากกว่า 1 → คูณกันแล้วโตแบบเลขชี้กำลัง", "gradient clipping ตามค่า norm · ลด learning rate · init ที่ดีขึ้น"]
      ]}},
      { h: "ทำไม sigmoid ถึงถูกแทนที่ด้วย ReLU" },
      { code: String.raw`σ(z)  = 1/(1+e^−z)
σ'(z) = σ(z)·(1−σ(z))            สูงสุดที่ z=0 → 0.25

10 ชั้นด้วย sigmoid:   0.25^10 ≈ 0.00000095
10 ชั้นด้วย ReLU:      1^10    = 1`,
        cap: "ตัวเลขนี้คือเหตุผลทั้งหมดที่ deep learning ไปต่อไม่ได้ก่อนปี 2011", lang: "txt" },
      { h: "Backprop คือ reverse-mode autodiff" },
      { table: { head: ["โหมด", "ต้นทุน", "เหมาะกับ"], rows: [
        ["Forward mode", "หนึ่งรอบต่อหนึ่ง **input**", "input น้อย output เยอะ"],
        ["**Reverse mode**", "หนึ่งรอบต่อหนึ่ง **output**", "**input เยอะ output น้อย** ← กรณีของ neural network"]
      ]}},
      { p: "เครือข่ายมีพารามิเตอร์เป็นล้าน (input ของฟังก์ชัน loss) แต่มี loss ตัวเดียว (output) — **reverse mode จึงถูกกว่าหลายล้านเท่า** ความไม่สมมาตรนี้คือเหตุผลเดียวที่ deep learning คำนวณไหว" },
      { h: "อนุมาน backprop ของ MLP หนึ่งชั้นซ่อน" },
      { code: String.raw`Forward:
  Z1 = X W1 + b1
  A1 = relu(Z1)
  Z2 = A1 W2 + b2
  ŷ  = softmax(Z2)
  L  = cross_entropy(ŷ, y)

Backward (ไล่จากท้ายมาหน้า):
  dZ2 = ŷ − y                       ← ผลรวมของ softmax+CE ยุบเหลือแค่นี้
  dW2 = A1ᵀ @ dZ2
  db2 = sum(dZ2, axis=0)
  dA1 = dZ2 @ W2ᵀ
  dZ1 = dA1 ⊙ (Z1 > 0)              ← อนุพันธ์ของ ReLU คือ 1 หรือ 0
  dW1 = Xᵀ @ dZ1
  db1 = sum(dZ1, axis=0)`,
        cap: "เจ็ดบรรทัดนี้คือ backpropagation ทั้งหมด — ที่เหลือคือการทำซ้ำต่อชั้น", lang: "txt" },
      { note: "**`dZ2 = ŷ − y` คือความมหัศจรรย์เล็ก ๆ ของหน้านี้** — อนุพันธ์ของ softmax เองยุ่งมาก (เป็น Jacobian เต็ม) แต่พอต่อกับ cross-entropy แล้วพจน์ยุ่ง ๆ ตัดกันหมด เหลือแค่ 'ทำนาย ลบ ความจริง' นี่คือเหตุผลที่ framework รวมสองอันเป็น op เดียว" },
      { h: "อนุมานให้เห็นว่าทำไมถึงตัดกันหมด" },
      { code: String.raw`L = −Σ yₖ log ŷₖ        และ  ŷᵢ = e^zᵢ / Σⱼ e^zⱼ

∂L/∂zᵢ = Σₖ (∂L/∂ŷₖ)(∂ŷₖ/∂zᵢ)

∂L/∂ŷₖ  = −yₖ/ŷₖ
∂ŷₖ/∂zᵢ = ŷₖ(δᵢₖ − ŷᵢ)          δ = 1 เมื่อ i=k, 0 เมื่อไม่ใช่

แทนค่า:  Σₖ (−yₖ/ŷₖ)·ŷₖ(δᵢₖ − ŷᵢ)
       = Σₖ −yₖ(δᵢₖ − ŷᵢ)
       = −yᵢ + ŷᵢ Σₖ yₖ
       = ŷᵢ − yᵢ                  เพราะ Σyₖ = 1 (one-hot)`,
        cap: "ทำครั้งเดียวในชีวิตแล้วจะไม่ลืม — และจะเข้าใจว่าทำไมห้ามใส่ softmax ซ้ำสองครั้ง", lang: "txt" },
      { h: "ทำไม MSE ถึงเข้ากับ regression" },
      { code: String.raw`สมมติว่า  y = ŷ + ε   โดย ε ~ Normal(0, σ²)

likelihood ของหนึ่งจุด:  p(y|x) = (1/√(2πσ²)) · e^(−(y−ŷ)²/2σ²)

log-likelihood รวม:      Σ [ −(y−ŷ)²/2σ² − log√(2πσ²) ]
                              ‾‾‾‾‾‾‾‾‾‾
                              พจน์เดียวที่ขึ้นกับพารามิเตอร์

→ maximize log-likelihood  ≡  minimize Σ(y−ŷ)²  ≡  MSE`,
        cap: "MSE ไม่ใช่การเลือกโดยพลการ — มันคือสมมติฐาน 'noise เป็นเกาส์เซียน' ที่เขียนออกมาเป็น loss", lang: "txt" },
      { h: "ทำไม cross-entropy ถึงเข้ากับ classification" },
      { code: String.raw`สมมติผลลัพธ์เป็น Bernoulli:  p(y|x) = ŷ^y · (1−ŷ)^(1−y)

log-likelihood:  y log ŷ + (1−y) log(1−ŷ)

→ maximize  ≡  minimize −[y log ŷ + (1−y) log(1−ŷ)]  ≡  binary cross-entropy`,
        cap: "หลักการเดียวกัน คนละสมมติฐานเรื่องการแจกแจง → คนละ loss", lang: "txt" },
      { p: "**นี่คือแก่นของหมวดนี้: loss ไม่ได้ถูกเลือกเพราะ 'เขาใช้กัน' แต่ถูกอนุมานจากสมมติฐานว่าข้อมูลถูกสร้างขึ้นมาอย่างไร** — เปลี่ยนสมมติฐาน loss ก็เปลี่ยนตาม เช่นสมมติ Laplace แทนเกาส์เซียนจะได้ MAE ไม่ใช่ MSE" },
      { h: "Regularization ก็มาจาก prior" },
      { code: String.raw`MAP = maximize  log p(D|θ) + log p(θ)
                              ‾‾‾‾‾‾‾‾‾   ‾‾‾‾‾‾‾‾
                              likelihood   prior

prior แบบเกาส์เซียนบน θ  →  −λ‖θ‖²   →  L2 / weight decay
prior แบบ Laplace บน θ   →  −λ‖θ‖₁   →  L1 / sparse`,
        cap: "weight decay จึงไม่ใช่ hack แต่คือการบอกว่า 'เชื่อว่าน้ำหนักควรเล็ก' ก่อนเห็นข้อมูล", lang: "txt" }
    ],

    dataflow: [
      { p: "หมวดนี้เดินตัวเลขจริงหนึ่งชุดผ่านเครือข่ายจิ๋วทั้งไปและกลับ — ทำตามด้วยมือได้จริง" },
      { h: "เครือข่ายที่จะเดิน" },
      { code: String.raw`input 2 ตัว → hidden 2 นิวรอน (ReLU) → output 2 คลาส (softmax)

x  = [1.0, 2.0]                 y = [1, 0]   (คลาสที่ถูกคือคลาส 0)

W1 = [[0.1, 0.3],               b1 = [0.0, 0.0]
      [0.2, 0.4]]
W2 = [[0.5, 0.7],               b2 = [0.0, 0.0]
      [0.6, 0.8]]`,
        cap: "เล็กพอที่จะคำนวณด้วยมือ ใหญ่พอที่จะเห็นทุกกลไก", lang: "txt" },
      { h: "ขาไป — ชั้นซ่อน" },
      { code: String.raw`Z1 = x @ W1 + b1
   z1₀ = 1.0(0.1) + 2.0(0.2) = 0.5
   z1₁ = 1.0(0.3) + 2.0(0.4) = 1.1
Z1 = [0.5, 1.1]

A1 = relu(Z1) = [0.5, 1.1]        ← บวกทั้งคู่ ผ่านไปเหมือนเดิม`,
        cap: "ReLU ไม่ทำอะไรเลยเมื่อค่าเป็นบวก — และนั่นคือเหตุผลที่อนุพันธ์เป็น 1", lang: "txt" },
      { h: "ขาไป — ชั้นออกและ loss" },
      { code: String.raw`Z2 = A1 @ W2 + b2
   z2₀ = 0.5(0.5) + 1.1(0.6) = 0.91
   z2₁ = 0.5(0.7) + 1.1(0.8) = 1.23

softmax:  e^0.91 = 2.484 · e^1.23 = 3.421 · รวม = 5.905
   ŷ₀ = 2.484/5.905 = 0.4207
   ŷ₁ = 3.421/5.905 = 0.5793

L = −log(ŷ ของคลาสที่ถูก) = −log(0.4207) = 0.8659`,
        cap: "one-hot ทำให้เหลือพจน์เดียว — loss คือ 'ประหลาดใจแค่ไหนกับคำตอบที่ถูก'", lang: "txt" },
      { note: "**อ่านค่า loss ให้เป็น**: เดาสุ่มบน 2 คลาสได้ `−log(0.5) = 0.693` ค่าที่ได้ 0.866 จึง **แย่กว่าการเดาสุ่ม** เพราะโมเดลเอนไปทางคลาสที่ผิด · สำหรับ 10 คลาส เส้นเดาสุ่มคือ `−log(0.1) = 2.303` — จำสองเลขนี้ไว้ใช้ตรวจว่าโมเดลเริ่มเรียนหรือยัง" },
      { h: "ขากลับ — เริ่มที่ logits" },
      { code: String.raw`dZ2 = ŷ − y = [0.4207 − 1, 0.5793 − 0] = [−0.5793, 0.5793]`,
        cap: "ค่าลบแปลว่า 'ต้องดันคะแนนของคลาสนี้ขึ้น' ค่าบวกแปลว่า 'ต้องกดลง'", lang: "txt" },
      { h: "ขากลับ — น้ำหนักชั้นที่สอง" },
      { code: String.raw`dW2 = A1ᵀ @ dZ2        (2,1)@(1,2) → (2,2)
   dW2[0][0] = 0.5 × (−0.5793) = −0.2897
   dW2[0][1] = 0.5 × ( 0.5793) =  0.2897
   dW2[1][0] = 1.1 × (−0.5793) = −0.6372
   dW2[1][1] = 1.1 × ( 0.5793) =  0.6372

db2 = dZ2 = [−0.5793, 0.5793]`,
        cap: "gradient ของน้ำหนัก = activation ขาเข้า × error ขาออก — ตีความได้ว่า 'นิวรอนที่ดังกว่า รับผิดชอบมากกว่า'", lang: "txt" },
      { h: "ขากลับ — ย้อนผ่านชั้นซ่อน" },
      { code: String.raw`dA1 = dZ2 @ W2ᵀ
   dA1₀ = (−0.5793)(0.5) + (0.5793)(0.7) = 0.1159
   dA1₁ = (−0.5793)(0.6) + (0.5793)(0.8) = 0.1159

dZ1 = dA1 ⊙ (Z1 > 0) = [0.1159, 0.1159]    ← Z1 บวกทั้งคู่ จึงผ่านหมด

dW1 = xᵀ @ dZ1
   dW1[0] = 1.0 × [0.1159, 0.1159] = [0.1159, 0.1159]
   dW1[1] = 2.0 × [0.1159, 0.1159] = [0.2318, 0.2318]`,
        cap: "ถ้า z1 ตัวไหนเป็นลบ gradient ของมันจะกลายเป็น 0 ทันที — นั่นคือ 'dying ReLU'", lang: "txt" },
      { h: "อัปเดตน้ำหนัก" },
      { code: String.raw`η = 0.1

W2[0][0] ← 0.5 − 0.1(−0.2897) = 0.5290
W2[0][1] ← 0.7 − 0.1( 0.2897) = 0.6710
W1[0][0] ← 0.1 − 0.1( 0.1159) = 0.0884
...

รันขาไปใหม่ (อัปเดตทั้ง W และ b):  L = 0.8659 → 0.7032`,
        cap: "loss ลดลงจริงในก้าวเดียว — นี่คือทั้งหมดของการเทรน ทำซ้ำหลายล้านรอบ", lang: "txt" },
      { h: "หนึ่ง epoch ประกอบด้วยอะไร" },
      { code: String.raw`for epoch in range(E):              ← เห็นข้อมูลครบทั้งชุด 1 รอบ
    shuffle(data)                   ← สำคัญ: กันโมเดลจำลำดับ
    for batch in batches(data, 32): ← 1 ก้าวของ gradient ต่อ 1 batch
        forward  → loss
        backward → gradients
        update   → θ ← θ − η∇L`,
        cap: "batch = 32 หมายถึงคำนวณ gradient เฉลี่ยจาก 32 ตัวอย่างแล้วค่อยก้าวหนึ่งครั้ง", lang: "python" },
      { table: { head: ["ขนาด batch", "ข้อดี", "ข้อเสีย"], rows: [
        ["1 (SGD แท้)", "อัปเดตถี่ · หลุดจุดต่ำสุดเฉพาะที่ได้ง่าย", "สัญญาณรบกวนสูง · ใช้ GPU ไม่คุ้ม"],
        ["32-256 (mini-batch)", "**สมดุลที่ใช้กันจริง** · ขนานได้ดี", "ต้องจูน learning rate ตาม"],
        ["ทั้งชุด (full batch)", "gradient แม่นที่สุด", "ช้ามาก · ติดจุดต่ำสุดเฉพาะที่ง่าย"]
      ]}}
    ],

    implementation: [
      { p: "หมวดนี้เขียนทุกอย่างข้างบนด้วย NumPy ล้วน ไม่มีเฟรมเวิร์ก — รันได้จริงและตรวจได้ว่าถูก" },
      { h: "1) ปฏิบัติการพื้นฐานและรูปร่าง" },
      { code: String.raw`import numpy as np

x = np.array([1.0, 2.0, 3.0])          # (3,)
W = np.random.randn(3, 4) * 0.01       # (3, 4)
b = np.zeros(4)                        # (4,)

print(x @ W + b)                       # (4,)  broadcasting เติม b ให้
print((x @ W).shape)                   # (4,)

X = np.random.randn(32, 3)             # batch 32
print((X @ W + b).shape)               # (32, 4)`,
        cap: "พิมพ์ .shape ทุกบรรทัดตอนเขียนใหม่ — ถูกกว่าการดีบักทีหลังมาก", lang: "python" },
      { h: "2) activation และอนุพันธ์ของมัน" },
      { code: String.raw`def relu(z):        return np.maximum(0, z)
def relu_grad(z):   return (z > 0).astype(z.dtype)

def sigmoid(z):     return 1 / (1 + np.exp(-z))
def sigmoid_grad(z):
    s = sigmoid(z)
    return s * (1 - s)               # ใช้ค่า s ที่คำนวณแล้ว ไม่คำนวณซ้ำ

def softmax(z):
    z = z - z.max(axis=-1, keepdims=True)   # กันล้น ไม่เปลี่ยนผลลัพธ์
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)`,
        cap: "keepdims=True สำคัญมาก — ไม่ใส่แล้วรูปร่างยุบ แล้ว broadcasting จะผิดแบบเงียบ ๆ", lang: "python" },
      { h: "3) loss ที่ปลอดภัยเชิงตัวเลข" },
      { code: String.raw`def cross_entropy(y_true, y_pred, eps=1e-12):
    """y_true: one-hot (n, k) · y_pred: ความน่าจะเป็น (n, k)"""
    y_pred = np.clip(y_pred, eps, 1.0 - eps)      # กัน log(0) = -inf
    return -np.sum(y_true * np.log(y_pred)) / y_true.shape[0]

def mse(y_true, y_pred):
    return np.mean((y_true - y_pred) ** 2)`,
        cap: "clip คือบรรทัดที่กัน NaN ตอนโมเดลมั่นใจ 100% ซึ่งเกิดได้บ่อยกว่าที่คิด", lang: "python" },
      { h: "4) MLP ครบวงจรใน 40 บรรทัด" },
      { code: String.raw`class MLP:
    def __init__(self, n_in, n_hid, n_out, seed=0):
        rng = np.random.default_rng(seed)
        # He init: var = 2/fan_in — เหมาะกับ ReLU
        self.W1 = rng.normal(0, np.sqrt(2 / n_in),  (n_in, n_hid))
        self.b1 = np.zeros(n_hid)
        self.W2 = rng.normal(0, np.sqrt(2 / n_hid), (n_hid, n_out))
        self.b2 = np.zeros(n_out)

    def forward(self, X):
        self.X  = X
        self.Z1 = X @ self.W1 + self.b1
        self.A1 = relu(self.Z1)
        self.Z2 = self.A1 @ self.W2 + self.b2
        self.Y  = softmax(self.Z2)
        return self.Y

    def backward(self, y_true, lr=0.1):
        n = y_true.shape[0]
        dZ2 = (self.Y - y_true) / n          # softmax + CE ยุบเหลือแค่นี้
        dW2 = self.A1.T @ dZ2
        db2 = dZ2.sum(axis=0)

        dA1 = dZ2 @ self.W2.T
        dZ1 = dA1 * relu_grad(self.Z1)       # Hadamard ไม่ใช่ matmul
        dW1 = self.X.T @ dZ1
        db1 = dZ1.sum(axis=0)

        self.W2 -= lr * dW2;  self.b2 -= lr * db2
        self.W1 -= lr * dW1;  self.b1 -= lr * db1`,
        cap: "หารด้วย n ที่ dZ2 ทำให้ gradient เป็นค่าเฉลี่ยของ batch — ลืมแล้ว learning rate จะขึ้นกับขนาด batch", lang: "python" },
      { h: "5) เทรนจริงบนข้อมูลของเล่น" },
      { code: String.raw`# XOR — ตัวอย่างคลาสสิกที่โมเดลเชิงเส้นแก้ไม่ได้
X = np.array([[0,0], [0,1], [1,0], [1,1]], dtype=float)
y = np.array([[1,0], [0,1], [0,1], [1,0]], dtype=float)   # one-hot

net = MLP(2, 8, 2)
for epoch in range(2000):
    out  = net.forward(X)
    loss = cross_entropy(y, out)
    net.backward(y, lr=0.5)
    if epoch % 500 == 0:
        acc = (out.argmax(1) == y.argmax(1)).mean()
        print(f"epoch {epoch:5d}  loss {loss:.4f}  acc {acc:.2f}")

# epoch     0  loss 0.5992  acc 0.75
# epoch  1500  loss 0.0005  acc 1.00   ← เรียนรู้ XOR ได้ครบ`,
        cap: "XOR แยกด้วยเส้นตรงไม่ได้ ต้องมีชั้นซ่อน — เป็นการพิสูจน์ว่าชั้นซ่อนมีประโยชน์จริง", lang: "python" },
      { h: "6) Gradient check — พิสูจน์ว่า backward ที่เขียนถูก" },
      { code: String.raw`def grad_check(net, X, y, eps=1e-5):
    """เทียบ gradient เชิงวิเคราะห์กับผลต่างเชิงตัวเลข"""
    net.forward(X)
    net.backward(y, lr=0.0)          # lr=0 → คำนวณ gradient แต่ไม่อัปเดต
    # (เก็บ dW1 ไว้ก่อนในเวอร์ชันจริง — ตัวอย่างนี้ย่อให้สั้น)

    i, j = 0, 0
    orig = net.W1[i, j]

    net.W1[i, j] = orig + eps
    lp = cross_entropy(y, net.forward(X))
    net.W1[i, j] = orig - eps
    lm = cross_entropy(y, net.forward(X))
    net.W1[i, j] = orig

    numeric = (lp - lm) / (2 * eps)  # สองด้าน: error เป็น O(eps²)
    return numeric`,
        cap: "ใช้สองด้านเสมอ (ไม่ใช่ (L(θ+ε)−L(θ))/ε) เพราะ error น้อยกว่ามาก", lang: "python" },
      { code: String.raw`เกณฑ์ตัดสิน:
  rel = |a − b| / max(|a|, |b|)

  rel < 1e-7   ผ่านสบาย
  rel < 1e-5   ยังพอรับได้ถ้าเครือข่ายลึก
  rel > 1e-3   มีบั๊กแน่นอน

ตรวจบนเครือข่ายเล็ก ๆ ด้วย float64 เท่านั้น
float32 จะมี noise กลบผลการทดสอบ`,
        cap: "นี่คือวิธีเดียวที่พิสูจน์ backprop ที่เขียนเองได้ว่าถูก — ทำครั้งเดียวก่อนเทรนจริง", lang: "txt" },
      { h: "7) ตรวจ eigen และ PCA ด้วยมือ" },
      { code: String.raw`X = np.random.randn(200, 3) @ np.array([[2,0,0],[0,1,0],[0,0,0.1]])
Xc = X - X.mean(axis=0)                # PCA ต้องหักค่าเฉลี่ยก่อนเสมอ

C = (Xc.T @ Xc) / (len(Xc) - 1)        # covariance (3,3)
vals, vecs = np.linalg.eigh(C)         # eigh สำหรับเมทริกซ์สมมาตร
order = vals.argsort()[::-1]
vals, vecs = vals[order], vecs[:, order]

print(vals / vals.sum())               # สัดส่วนความแปรปรวนของแต่ละแกน
# [0.79 0.20 0.002]  ← แกนแรกอธิบายได้ 79%

Z = Xc @ vecs[:, :2]                   # ฉายลงเหลือ 2 มิติ`,
        cap: "ใช้ eigh ไม่ใช่ eig เมื่อรู้ว่าเมทริกซ์สมมาตร — เร็วกว่าและได้ค่าจริงเสมอ", lang: "python" }
    ],

    tricks: [
      { h: "ไล่บั๊กตามอาการ" },
      { table: { head: ["อาการ", "สาเหตุที่พบบ่อยที่สุด", "ตรวจยังไง"], rows: [
        ["`ValueError: shapes not aligned`", "transpose ผิดตำแหน่ง", "เขียนรูปร่างกำกับทุกบรรทัด หา `k` ที่ไม่ตรง"],
        ["loss เป็น `NaN`", "`log(0)` · หารด้วยศูนย์ · gradient ระเบิด", "ไล่ตามลำดับนี้: clip ความน่าจะเป็น → เช็ค std ที่เป็น 0 → ดู norm ของ gradient"],
        ["loss ไม่ลดเลย", "learning rate เล็กไป · สัญญาณตายเพราะ gradient หาย · ป้อน label ผิด", "ลอง overfit ข้อมูล 10 ตัวให้ได้ก่อน — ถ้ายังไม่ได้ แปลว่าโค้ดผิด ไม่ใช่ข้อมูลยาก"],
        ["loss ลดแล้วพุ่งขึ้น", "learning rate ใหญ่ไป", "ลด 10 เท่า หรือใส่ warmup"],
        ["loss ลดแต่ผลทำนายไร้สาระ", "**broadcasting ผิดรูป** · label กับ prediction สลับกัน", "เช็ค `.shape` ของทุกตัวกลางทาง"],
        ["train ดี test แย่", "overfit · data leakage", "ดูช่องว่างของ train/val — ถ้าห่างมากคือ overfit"],
        ["ผลรันซ้ำไม่เหมือนเดิม", "ไม่ได้ตั้ง seed · การบวกใน floating point ไม่สลับที่บน GPU", "ตั้ง seed ทุกตัว แล้วยอมรับว่าบน GPU ยังต่างได้เล็กน้อย"]
      ]}},
      { h: "เทคนิคที่ใช้ได้ตลอด" },
      { ul: [
        "**overfit ข้อมูล 10 ตัวก่อนเสมอ** — ถ้าทำไม่ได้ ปัญหาอยู่ที่โค้ด ไม่ใช่ที่ข้อมูลหรือโมเดล นี่คือเทสต์แรกที่ควรทำเสมอ",
        "**เทียบกับเส้นเดาสุ่ม**: `−log(1/k)` สำหรับ k คลาส — 2 คลาสคือ 0.693, 10 คลาสคือ 2.303 ถ้า loss เริ่มต้นไม่ใกล้ค่านี้ แปลว่า init หรือ label มีปัญหา",
        "**พิมพ์รูปร่าง ไม่ใช่พิมพ์ค่า** ตอนดีบักครั้งแรก — บั๊กส่วนใหญ่เป็นเรื่องรูปร่าง",
        "**เพิ่ม learning rate ทีละ 3 เท่า** ไม่ใช่ทีละนิด เพื่อหาช่วงที่ใช้ได้เร็ว ๆ แล้วค่อยละเอียดทีหลัง",
        "**สเกล feature ก่อนใช้ gradient descent เสมอ** — โมเดลต้นไม้ไม่สนใจ แต่ทุกอย่างที่ใช้ gradient สนใจมาก"
      ]},
      { h: "ทำไมต้องสเกล feature" },
      { code: String.raw`feature 1: อายุ      อยู่ในช่วง 20-70
feature 2: รายได้    อยู่ในช่วง 20000-200000

พื้นผิว loss จะกลายเป็นหุบเขาที่ยาวและแคบมาก
→ gradient ชี้ข้ามหุบเขาแทนที่จะชี้ลงไปตามหุบเขา
→ ต้องใช้ learning rate เล็กจิ๋วเพื่อไม่ให้แกว่ง → ช้ามาก

StandardScaler:  z = (x − μ) / σ        → ค่าเฉลี่ย 0 ส่วนเบี่ยงเบน 1
MinMaxScaler:    z = (x − min)/(max−min) → อยู่ใน [0, 1]`,
        cap: "คำนวณ μ กับ σ จาก train set เท่านั้น แล้วเอาไปใช้กับ test — ไม่งั้นคือ data leakage", lang: "txt" },
      { h: "การตั้งค่าน้ำหนักเริ่มต้น" },
      { table: { head: ["วิธี", "ความแปรปรวน", "ใช้กับ"], rows: [
        ["ศูนย์ทั้งหมด", "0", "**ห้ามใช้** — ทุกนิวรอนในชั้นเดียวกันจะเหมือนกันตลอดกาล"],
        ["สุ่มเล็ก ๆ `× 0.01`", "คงที่", "พอใช้กับเครือข่ายตื้น ลึกแล้วสัญญาณจะตาย"],
        ["**Xavier/Glorot**", "`2/(fan_in+fan_out)`", "activation สมมาตร: tanh, sigmoid"],
        ["**He**", "`2/fan_in`", "**ReLU และญาติ** — ชดเชยที่ ReLU ตัดครึ่งหนึ่งทิ้ง"]
      ]}},
      { p: "**เหตุผลที่ init เป็นเรื่อง**: ถ้าความแปรปรวนของ activation เปลี่ยนทุกชั้น พอผ่านไป 20 ชั้นมันจะกลายเป็นศูนย์หรือระเบิด — Xavier กับ He ออกแบบมาเพื่อให้ความแปรปรวนคงที่ตลอดความลึก" },
      { h: "กับดักตัวเลขที่เจอจริง" },
      { ul: [
        "**ใส่ softmax สองครั้ง** — เอาผลของ `softmax` ไปให้ loss ที่มี `log_softmax` อยู่ข้างในแล้ว ผลคือเทรนได้แต่ได้จุดที่แย่กว่า **ไม่ crash จึงหายาก**",
        "**ลืม `keepdims=True`** — รูปร่างยุบจาก `(32,1)` เป็น `(32,)` แล้ว broadcasting กลายเป็น `(32,32)`",
        "**ลืมหารด้วยขนาด batch** — gradient จะใหญ่ตามขนาด batch ทำให้ learning rate ที่จูนไว้ใช้ไม่ได้เมื่อเปลี่ยน batch size",
        "**ใช้ `==` เทียบ float** — ใช้ `np.isclose` แทนเสมอ",
        "**คำนวณ mean/std จากข้อมูลทั้งหมดก่อนแบ่ง train/test** — เป็น data leakage ที่ทำให้ผลดูดีเกินจริง"
      ]},
      { h: "ลำดับที่ควรเรียนต่อ" },
      { p: "จากหน้านี้ไปต่อได้สองทาง: ถ้าอยากเข้าใจโมเดลคลาสสิกก่อน (linear/logistic regression, decision tree, SVM) ให้ไปทางนั้นเพราะคณิตศาสตร์เบากว่าและตีความผลได้ง่ายกว่า · ถ้าอยากไป deep learning ต่อเลย สิ่งที่ต้องมีเพิ่มคือ optimizer, regularization และสถาปัตยกรรม (CNN, RNN, transformer) — แต่ **backpropagation ที่อนุมานในหน้านี้คือกลไกเดียวกันทั้งหมด** ไม่ว่าจะสถาปัตยกรรมไหน" }
    ],

    eval: [
      { p: "คำถามที่ตอบได้แปลว่าเข้าใจจริง ไม่ใช่จำสูตร" },
      { qa: [
        { q: "gradient ต่างจากอนุพันธ์ยังไง",
          a: "อนุพันธ์ใช้กับฟังก์ชันตัวแปรเดียว ให้ค่าเป็นตัวเลข ส่วน gradient คือ **เวกเตอร์ของอนุพันธ์ย่อย** ของฟังก์ชันหลายตัวแปร จึงมีทั้งขนาดและทิศทาง และทิศทางนั้นคือทางที่ฟังก์ชันเพิ่มเร็วที่สุด" },
        { q: "ทำไมสูตร gradient descent ถึงมีเครื่องหมายลบ",
          a: "เพราะ gradient ชี้ไปทาง **เพิ่ม** ของ loss แต่เราต้องการลด จึงเดินสวนทาง — ถ้าเปลี่ยนเป็นบวกจะกลายเป็น gradient ascent ซึ่งใช้ตอนต้องการ maximize เช่นใน reinforcement learning บางแบบ" },
        { q: "backpropagation คืออะไรกันแน่",
          a: "คือการใช้ chain rule อย่างมีระเบียบเพื่อหาอนุพันธ์ของ loss เทียบกับพารามิเตอร์ทุกตัว โดยไล่จากท้ายมาหน้าและใช้ค่าที่คำนวณไว้แล้วซ้ำ — ในทางเทคนิคคือ reverse-mode automatic differentiation" },
        { q: "ทำไม reverse mode ถึงเหมาะกับ neural network",
          a: "forward mode เสียหนึ่งรอบต่อหนึ่ง input ส่วน reverse mode เสียหนึ่งรอบต่อหนึ่ง output เครือข่ายมีพารามิเตอร์เป็นล้าน (input) แต่มี loss ตัวเดียว (output) reverse mode จึงถูกกว่าหลายล้านเท่า" },
        { q: "gradient หายเกิดจากอะไร แก้ยังไง",
          a: "chain rule คูณอนุพันธ์ของแต่ละชั้นเข้าด้วยกัน ถ้าหลายตัวมีค่าน้อยกว่า 1 ผลคูณจะเข้าใกล้ศูนย์ ชั้นต้น ๆ จึงไม่ได้รับสัญญาณ แก้ด้วย ReLU (อนุพันธ์เป็น 1), residual connection ที่ให้ gradient ลัดข้ามชั้น, และ normalization" },
        { q: "ทำไม ReLU ถึงแทนที่ sigmoid ในชั้นซ่อน",
          a: "อนุพันธ์สูงสุดของ sigmoid คือ 0.25 ผ่าน 10 ชั้นเหลือ `0.25^10 ≈ 1e-6` ส่วน ReLU มีอนุพันธ์เป็น 1 บนฝั่งบวก จึงส่งสัญญาณผ่านความลึกได้ และคำนวณเร็วกว่ามากด้วย" },
        { q: "ทำไม regression ใช้ MSE แต่ classification ใช้ cross-entropy",
          a: "ทั้งคู่มาจาก maximum likelihood แต่คนละสมมติฐาน: สมมติ noise เป็นเกาส์เซียนแล้วอนุมานออกมาได้ MSE ส่วนสมมติผลลัพธ์เป็น Bernoulli หรือ categorical จะได้ cross-entropy — loss จึงไม่ใช่การเลือกโดยพลการ" },
        { q: "ทำไม softmax ถึงคู่กับ cross-entropy",
          a: "เพราะอนุพันธ์ของ cross-entropy เทียบกับ logits ยุบเหลือ `ŷ − y` ซึ่งเรียบง่ายและเสถียรเชิงตัวเลข framework จึงรวมสองอันเป็น op เดียว — และเป็นเหตุผลที่ห้ามใส่ softmax เองแล้วส่งต่อให้ loss ที่ทำ log ซ้ำอีก" },
        { q: "entropy กับ cross-entropy ต่างกันยังไง",
          a: "entropy `H(p)` คือความประหลาดใจเฉลี่ยของการแจกแจงจริง ส่วน cross-entropy `H(p,q)` คือความประหลาดใจเฉลี่ยเมื่อใช้โมเดล `q` ทำนายความจริง `p` ผลต่างของสองอันคือ KL divergence ซึ่งคือสิ่งที่เราลดจริง ๆ" },
        { q: "KL divergence เป็นระยะทางไหม",
          a: "ไม่ใช่ เพราะไม่สมมาตร `D(p‖q) ≠ D(q‖p)` และไม่สอดคล้องกับอสมการสามเหลี่ยม — การสลับที่เปลี่ยนความหมายของการลงโทษ" },
        { q: "กฎรูปร่างของการคูณเมทริกซ์คืออะไร",
          a: "`(m,k) @ (k,n) → (m,n)` มิติในต้องเท่ากันแล้วหายไป มิตินอกอยู่ต่อ และ gradient ของตัวแปรใดต้องมีรูปร่างเท่ากับตัวแปรนั้นเสมอ ซึ่งใช้ตรวจสูตร backprop ได้ทันที" },
        { q: "broadcasting ทำงานยังไง และอันตรายตรงไหน",
          a: "เทียบรูปร่างจากขวาไปซ้าย แต่ละมิติต้องเท่ากันหรือเป็น 1 อันตรายคือกรณีที่ไม่ error แต่ผลผิด เช่น `(32,1)` กับ `(1,32)` กลายเป็น `(32,32)` ซึ่งเป็น outer product โดยไม่ตั้งใจ" },
        { q: "ทำไม L1 ถึงให้สัมประสิทธิ์เป็นศูนย์จริง แต่ L2 ไม่ให้",
          a: "อนุพันธ์ของ `|w|` เป็นค่าคงที่ ±1 แรงดันเข้าศูนย์จึงคงที่ตลอด ส่วนอนุพันธ์ของ `w²` คือ `2w` ซึ่งเล็กลงเมื่อเข้าใกล้ศูนย์ จึงหยุดที่ 'เล็กมาก' ไม่ถึงศูนย์" },
        { q: "weight decay เกี่ยวอะไรกับ Bayes",
          a: "MAP คือ maximize `log p(D|θ) + log p(θ)` การใส่ prior แบบเกาส์เซียนบนน้ำหนักให้พจน์ `−λ‖θ‖²` ซึ่งคือ L2 พอดี — weight decay จึงคือการประกาศความเชื่อว่าน้ำหนักควรเล็ก ไม่ใช่ hack" },
        { q: "eigenvector คืออะไร แล้ว PCA ใช้ยังไง",
          a: "eigenvector คือทิศทางที่เมทริกซ์ทำได้แค่ยืด ไม่หมุน (`Av = λv`) PCA หา eigenvector ของ covariance matrix ซึ่งคือแกนที่ข้อมูลกระจายมากที่สุด และ eigenvalue บอกว่าแต่ละแกนอธิบายความแปรปรวนได้เท่าไร" },
        { q: "ทำไมต้องลบค่าสูงสุดออกก่อนใน softmax",
          a: "`e^x` ล้น float32 ที่ราว x = 88 การลบค่าคงที่ออกจากทุก logit ไม่เปลี่ยนผลลัพธ์เพราะ `e^−c` ตัดกันบนล่าง แต่ทำให้เลขชี้กำลังสูงสุดเป็น 0 จึงไม่มีวันล้น" },
        { q: "loss ที่ควรได้ตอนเริ่มเทรนคือเท่าไร",
          a: "`−log(1/k)` สำหรับ k คลาส — 2 คลาสคือ 0.693 และ 10 คลาสคือ 2.303 ถ้าค่าเริ่มต้นห่างจากนี้มาก แปลว่า initialization หรือ label มีปัญหา ไม่ใช่โมเดลเก่ง" },
        { q: "gradient check ทำยังไงและใช้เกณฑ์อะไร",
          a: "เทียบ gradient เชิงวิเคราะห์กับ `(L(θ+ε) − L(θ−ε)) / 2ε` โดยใช้ผลต่างสัมพัทธ์ `|a−b|/max(|a|,|b|)` ควรต่ำกว่า 1e-7 ทำบนเครือข่ายเล็กด้วย float64 เพราะ float32 มี noise กลบผล" },
        { q: "ทำไมต้องสเกล feature ก่อน gradient descent",
          a: "feature ที่สเกลต่างกันมากทำให้พื้นผิว loss เป็นหุบเขายาวแคบ gradient จึงชี้ข้ามหุบเขาแทนที่จะลงตามหุบเขา ต้องใช้ learning rate เล็กมากจนช้า — และต้องคำนวณ μ, σ จาก train set เท่านั้นเพื่อไม่ให้เกิด leakage" },
        { q: "ทำไมตั้งน้ำหนักเริ่มต้นเป็นศูนย์ทั้งหมดไม่ได้",
          a: "ทุกนิวรอนในชั้นเดียวกันจะได้ gradient เท่ากันเป๊ะทุกก้าว จึงอัปเดตเหมือนกันตลอดกาลและกลายเป็นนิวรอนตัวเดียวที่ทำซ้ำ — ความสมมาตรต้องถูกทำลายด้วยการสุ่ม" },
        { q: "เทสต์แรกที่ควรทำเสมอก่อนเทรนจริงคืออะไร",
          a: "overfit ข้อมูลสัก 10 ตัวอย่างให้ได้ accuracy 100% — ถ้าทำไม่ได้แปลว่าโค้ดมีบั๊ก ไม่ใช่ข้อมูลยากหรือโมเดลเล็กไป ซึ่งประหยัดเวลาได้มหาศาล" }
      ]},
      { h: "อ่านเพิ่ม" },
      { links: [
        { label: "3Blue1Brown — Essence of linear algebra", url: "https://www.3blue1brown.com/topics/linear-algebra", note: "อธิบายเวกเตอร์ เมทริกซ์ และ eigenvector ด้วยภาพ — ดูก่อนอ่านสูตรจะเข้าใจเร็วขึ้นมาก" },
        { label: "3Blue1Brown — Neural networks", url: "https://www.3blue1brown.com/topics/neural-networks", note: "ตอน backpropagation อธิบาย chain rule ได้ตรงและเห็นภาพที่สุด" },
        { label: "The Matrix Cookbook", url: "https://www.math.uwaterloo.ca/~hwolkowi/matrixcookbook.pdf", note: "อนุพันธ์ของนิพจน์เมทริกซ์ทุกแบบที่ต้องใช้ ไว้เปิดตอนอนุมานเอง" },
        { label: "CS231n — Backpropagation", url: "https://cs231n.github.io/optimization-2/", note: "อนุมาน backprop ด้วย computational graph พร้อมโค้ด NumPy" },
        { label: "Deep Learning Book — บทที่ 2-4", url: "https://www.deeplearningbook.org/", note: "พีชคณิตเชิงเส้น ความน่าจะเป็น และการคำนวณเชิงตัวเลข อ่านฟรีออนไลน์" },
        { label: "NumPy — broadcasting", url: "https://numpy.org/doc/stable/user/basics.broadcasting.html", note: "กฎการเทียบรูปร่างอย่างเป็นทางการ พร้อมตัวอย่างที่พลาดกันบ่อย" },
        { label: "Distill — Why Momentum Really Works", url: "https://distill.pub/2017/momentum/", note: "เห็นภาพว่าพื้นผิว loss ที่เป็นหุบเขาแคบทำให้ gradient แกว่งยังไง" }
      ]}
    ]
  }
});

Object.assign(window.TEACHING_EN, {
  ml_math: {
    principle: [
      { h: "Why learn the mathematics when `model.fit()` exists" },
      { p: "It does exist, and it works for plenty of cases. But **the day it breaks, the mathematics is the only thing that tells you where** — a loss that turns to `NaN`, a gradient so small the early layers stop moving, a model that is 95% confident and 60% correct. None of those are in the API documentation." },
      { p: "This page does not teach all of mathematics. It teaches the part that **actually surfaces while debugging**, and every equation is derived, because **a formula you cannot re-derive is one you cannot debug**." },
      { h: "Four subjects, four jobs" },
      { table: { head: ["Subject", "What it gives ML", "Where you meet it daily"], rows: [
        ["**Linear algebra**", "The shapes of data and transforms", "`(m,k) @ (k,n)` · shape errors · attention scores"],
        ["**Calculus**", "The mechanism of learning", "Gradient descent · backpropagation · vanishing and exploding gradients"],
        ["**Probability**", "Where the loss comes from", "Why regression uses MSE and classification uses cross-entropy"],
        ["**Information theory**", "Why that loss and not another", "Entropy · cross-entropy · KL divergence"]
      ]}},
      { h: "The one line everything hangs on" },
      { code: String.raw`y = Wx + b`, cap: "An entire neural network layer — the rest is bookkeeping about this line's shapes and derivatives", lang: "txt" },
      { p: "From that single line: `W` and `x` must have shapes that multiply (linear algebra), working out which way `W` should move is differentiation (calculus), measuring how wrong `y` is comes from a probabilistic assumption, and choosing that particular loss is explained by information theory." },
      { h: "What you will be able to do" },
      { ul: [
        "Read a shape error and know exactly which dimension is wrong, without guessing",
        "Derive backpropagation by hand on a small network",
        "Explain why MSE fits regression and cross-entropy fits classification — without answering \"because everyone does\"",
        "Verify a hand-written gradient with finite differences",
        "Know where a `NaN` during training can come from, and in what order to check"
      ]},
      { note: "**Notation used throughout:** bold lower case is a vector (`x`), upper case is a matrix (`W`), `ŷ` is the prediction, `y` the truth, `θ` all parameters, `η` the learning rate and `L` the loss." },
      { h: "How to read this page" },
      { p: "It runs shapes → learning → where the loss comes from → hands on. Starting out, read it in order. Debugging something right now, jump to **Tips & Best Practices**, which is organised by symptom." }
    ],
    theory: [
      { p: "Enough of each of the four subjects to work with, not to pass an exam — each ends with where it shows up in ML." },
      { h: "1) What a vector really is" },
      { p: "Mathematically it is an element of a vector space, but for ML the useful picture is that **a vector is a list of numbers whose meaning comes from position** — `[age, income, purchases]` is one customer, and slot 0 is always the age." },
      { code: String.raw`x = [25, 48000, 7]        one customer   shape (3,)
X = [[25, 48000, 7],      three customers shape (3, 3)
     [41, 92000, 2],
     [33, 61000, 5]]`, cap: "One row per example, one column per feature — the convention every library follows", lang: "txt" },
      { h: "2) The dot product, the single most important operation" },
      { code: String.raw`a · b = Σ aᵢbᵢ = |a| |b| cos θ

[1, 2, 3] · [4, 5, 6] = 1×4 + 2×5 + 3×6 = 32`,
        cap: "It measures alignment — zero when orthogonal, maximal when pointing the same way", lang: "txt" },
      { p: "**Three things are the same dot product**: a neuron's pre-activation (`w · x + b`), similarity in a vector search (cosine similarity), and an attention score in a transformer (`q · k`). Understand one and you have all three." },
      { h: "3) Matrix multiplication and the shape rule" },
      { code: String.raw`(m, k) @ (k, n) → (m, n)
       ‾‾‾‾‾‾‾‾
       must match, then vanishes

Example: X(32, 784) @ W(784, 128) → (32, 128)
         a batch of 32 · 784 features → 128 neurons`,
        cap: "Inner dimensions vanish, outer ones survive — this one rule fixes almost every shape error", lang: "txt" },
      { p: "**Matrix multiplication does not commute**: `AB ≠ BA` in general, so order carries meaning, which is why `W @ x` and `x @ W` are different things (or do not multiply at all)." },
      { h: "4) Broadcasting, source of the quietest bugs" },
      { p: "Adding shapes that do not match, without copying data. It aligns **right to left**, and each dimension must be equal or 1." },
      { code: String.raw`(32, 128) + (128,)   →  (32, 128)   ✓ the bias is added to every row
(32, 128) + (32,)    →  error            ✗ from the right: 128 against 32
(32, 1)   + (1, 32)  →  (32, 32)         ⚠ works, and is not what you meant`,
        cap: "The last line is the trap: no error, an accidental outer product, and training carries on quietly", lang: "txt" },
      { note: "**The symptom of a broadcasting bug**: the loss keeps falling while the predictions are nonsense, and memory use is higher than expected. Check every intermediate `.shape` before suspecting anything else." },
      { h: "5) Norms, how to measure a vector's size" },
      { table: { head: ["Norm", "Form", "What it does in ML"], rows: [
        ["L2 (Euclidean)", "`‖x‖₂ = √Σxᵢ²`", "Weight decay · gradient clipping · distance in kNN"],
        ["L1 (Manhattan)", "`‖x‖₁ = Σ|xᵢ|`", "**Drives coefficients to exactly zero**, which is why it does feature selection"],
        ["L∞", "`max|xᵢ|`", "The bound on an adversarial perturbation"]
      ]}},
      { p: "**Why L1 reaches zero and L2 does not**: the derivative of `|w|` is a constant ±1 no matter how small `w` gets, so the push toward zero never weakens. The derivative of `w²` is `2w`, which fades as it approaches zero, leaving you with \"very small\" rather than \"zero\"." },
      { h: "6) Eigenvectors, the directions a matrix only stretches" },
      { code: String.raw`A v = λ v        v = eigenvector (the direction)
                 λ = eigenvalue (how much it stretches)`,
        cap: "Multiplying by A leaves the direction alone and changes only the length", lang: "txt" },
      { p: "**PCA is finding the eigenvectors of the covariance matrix** — they are the axes along which the data varies most, and the eigenvalues say how much variance each carries. Keeping the first k is dimensionality reduction that loses the least variance possible." },
      { h: "7) SVD, the general form that works on any matrix" },
      { code: String.raw`A = U Σ Vᵀ

A(m,n)  =  U(m,m) · Σ(m,n) · Vᵀ(n,n)
           Σ is diagonal, sorted largest first`,
        cap: "Truncating Σ to r entries gives the best rank-r approximation of A", lang: "txt" },
      { p: "This is the mathematics under **LoRA**: instead of moving all of `W`, add a low-rank delta `ΔW = BA` — the same idea as keeping only the largest singular values." },
      { h: "8) Probability: expectation and variance" },
      { code: String.raw`E[X]   = Σ p(x)·x                the expectation (a weighted mean)
Var[X] = E[(X − E[X])²]          the variance (how spread out)
       = E[X²] − (E[X])²         the form that is easier to compute`,
        cap: "Every \"average loss over the batch\" estimates an expectation over the data distribution", lang: "txt" },
      { h: "9) Bayes, the same equation rearranged" },
      { code: String.raw`P(θ | D) = P(D | θ) · P(θ) / P(D)

posterior = likelihood × prior / evidence
belief after seeing data = how well data supports it × prior belief / a normaliser`,
        cap: "Nothing mystical — it is P(A∩B) written two ways and set equal", lang: "txt" },
      { h: "10) Information theory: entropy through KL" },
      { code: String.raw`H(p)     = −Σ p(x) log p(x)          average surprise of p
H(p, q)  = −Σ p(x) log q(x)          average surprise of using q for p
D(p‖q)   = H(p, q) − H(p)            the excess paid for using q instead of p`,
        cap: "H(p) is fixed by the data, so minimising cross-entropy is minimising KL divergence", lang: "txt" },
      { p: "**Entropy is maximal when everything is equally likely** (you know nothing) and **zero when you are certain**. A fair coin carries one bit; a coin that always lands heads carries none." },
      { note: "**KL is not a distance** — `D(p‖q) ≠ D(q‖p)`, and swapping changes the meaning: `D(data‖model)` punishes giving low probability to things that happen, while `D(model‖data)` punishes spreading probability where there is no data." }
    ],
    foundations: [
      { p: "Linear algebra in enough depth to read errors and design layers yourself." },
      { h: "Every shape in a real network" },
      { code: String.raw`One batch of MNIST
X       (32, 784)      32 images · 28×28 = 784 pixels flattened
W1      (784, 128)     784 in → 128 neurons
b1      (128,)         one bias per neuron
Z1 = X @ W1 + b1       (32, 128)    ← broadcasting adds b1 to every row
A1 = relu(Z1)          (32, 128)    activations never change the shape
W2      (128, 10)      128 → 10 classes
Z2 = A1 @ W2 + b2      (32, 10)     logits
ŷ  = softmax(Z2)       (32, 10)     each row sums to 1`,
        cap: "Annotate every line with its shape before debugging any value — 90% of bugs end here", lang: "python" },
      { h: "Why W is (in, out) rather than (out, in)" },
      { p: "It follows from putting **one example per row**, which lets you write `X @ W` with no transpose. Store one example per column instead (as the maths textbooks do) and it becomes `W @ X` with the shape reversed. **Both are correct; pick one and stay with it.**" },
      { h: "The transposes worth understanding rather than memorising" },
      { code: String.raw`(A @ B)ᵀ = Bᵀ @ Aᵀ        the order flips too, not just each factor

During backprop:
  Z = X @ W                    (32,784) @ (784,128) → (32,128)
  dL/dW = Xᵀ @ dL/dZ           (784,32) @ (32,128)  → (784,128) ✓ matches W
  dL/dX = dL/dZ @ Wᵀ           (32,128) @ (128,784) → (32,784)  ✓ matches X`,
        cap: "A gradient always has the shape of the thing it differentiates — use that to check a formula instantly", lang: "txt" },
      { note: "**A trick for life**: when you cannot remember which factor to transpose, write down the shape you need and arrange the terms so the inner dimensions agree. Exactly one arrangement works." },
      { h: "The Hadamard product — elementwise, not matmul" },
      { code: String.raw`A ⊙ B        elementwise; the shapes must match
A @ B        matrix product, by the (m,k)@(k,n) rule

In the backward pass of ReLU:
  dL/dZ = dL/dA ⊙ (Z > 0)      ← Hadamard, not matmul`,
        cap: "Confusing the two gives right shapes with wrong values, which is far harder to find than a shape error", lang: "txt" },
      { h: "The Jacobian — and why backprop never builds one" },
      { code: String.raw`J[i][j] = ∂yᵢ / ∂xⱼ        the matrix of every partial derivative

A layer with 1000 in and 1000 out → a 1000×1000 Jacobian = a million entries
per layer, per example`,
        cap: "So nobody builds it — backprop computes vector-Jacobian products and skips the matrix", lang: "txt" },
      { h: "The three pairs people confuse most" },
      { table: { head: ["", "What each is", "The difference"], rows: [
        ["Derivative vs gradient", "Derivative: one variable · gradient: the vector of partials", "The gradient is the derivative extended to many dimensions, and being a **vector** it has direction"],
        ["Parameter vs hyperparameter", "Parameter: learned (`W`, `b`) · hyperparameter: chosen by you (`η`, depth)", "Gradient descent can only move parameters"],
        ["Loss vs metric", "Loss: what you optimise, must be differentiable · metric: what success actually means", "Accuracy has no useful derivative, so you train on cross-entropy and measure accuracy afterwards"]
      ]}},
      { h: "Floating point facts that bite" },
      { ul: [
        "**float32 carries about seven decimal digits** — add a small number to a large one and the small one simply disappears",
        "**`log(0) = −inf`**, so clip probabilities into `[ε, 1−ε]` before every log",
        "**`e^x` overflows float32 around x = 88**, which is why softmax subtracts the maximum first",
        "**Floating-point addition is not associative** — `(a+b)+c ≠ a+(b+c)` — one reason repeated GPU runs are not bit-identical"
      ]},
      { code: String.raw`A numerically safe softmax:
  z = z − max(z)                   ← does not change the result, but prevents overflow
  exp_z = e^z
  return exp_z / sum(exp_z)

Why the result is unchanged:
  e^(zᵢ−c) / Σe^(zⱼ−c) = (e^zᵢ·e^−c) / (e^−c·Σe^zⱼ) = e^zᵢ / Σe^zⱼ`,
        cap: "The e^−c cancels top and bottom, so any constant works — max is chosen because it makes the largest exponent zero", lang: "txt" }
    ],
    architecture: [
      { p: "The calculus — the mechanism that makes a model actually learn, derived from the start." },
      { h: "Gradient descent in one line" },
      { code: String.raw`θ ← θ − η ∇L(θ)`,
        cap: "The gradient points where loss rises fastest, so you walk against it — the minus sign is the whole idea", lang: "txt" },
      { p: "**`η`, the learning rate, is the step length.** Too large and you leap over the minimum and oscillate; too small and it is too slow to be useful. It is the single most consequential hyperparameter in training." },
      { h: "The chain rule, the heart of backpropagation" },
      { code: String.raw`if  L = L(g(f(x)))

dL/dx = dL/dg · dg/df · df/dx
        ‾‾‾‾‾   ‾‾‾‾‾   ‾‾‾‾‾
        one factor per layer`,
        cap: "Backprop is not a special algorithm — it is the chain rule applied in an organised order", lang: "txt" },
      { p: "**Two consequences fall straight out of that product:**" },
      { table: { head: ["Phenomenon", "Cause", "Fix"], rows: [
        ["**Vanishing gradients**", "Many factors below 1 multiply toward zero, so the early layers stop moving", "ReLU (derivative 1) instead of sigmoid (max 0.25) · residual connections · normalisation"],
        ["**Exploding gradients**", "Factors above 1 multiply upward exponentially", "Clip by gradient norm · lower the learning rate · better initialisation"]
      ]}},
      { h: "Why ReLU replaced sigmoid" },
      { code: String.raw`σ(z)  = 1/(1+e^−z)
σ'(z) = σ(z)·(1−σ(z))            maximal at z=0 → 0.25

Ten layers of sigmoid:   0.25^10 ≈ 0.00000095
Ten layers of ReLU:      1^10    = 1`,
        cap: "That number is the entire reason deep learning stalled before about 2011", lang: "txt" },
      { h: "Backprop is reverse-mode autodiff" },
      { table: { head: ["Mode", "Cost", "Suits"], rows: [
        ["Forward mode", "One pass per **input**", "Few inputs, many outputs"],
        ["**Reverse mode**", "One pass per **output**", "**Many inputs, one output** ← exactly a neural network"]
      ]}},
      { p: "A network has millions of parameters (the loss function's inputs) and one loss (its output), so **reverse mode is cheaper by a factor of millions**. That asymmetry is the only reason deep learning is computationally feasible." },
      { h: "Deriving backprop for a one-hidden-layer MLP" },
      { code: String.raw`Forward:
  Z1 = X W1 + b1
  A1 = relu(Z1)
  Z2 = A1 W2 + b2
  ŷ  = softmax(Z2)
  L  = cross_entropy(ŷ, y)

Backward (from the end):
  dZ2 = ŷ − y                       ← softmax + CE collapse to this
  dW2 = A1ᵀ @ dZ2
  db2 = sum(dZ2, axis=0)
  dA1 = dZ2 @ W2ᵀ
  dZ1 = dA1 ⊙ (Z1 > 0)              ← ReLU's derivative is 1 or 0
  dW1 = Xᵀ @ dZ1
  db1 = sum(dZ1, axis=0)`,
        cap: "Those seven lines are all of backpropagation; deeper networks just repeat them", lang: "txt" },
      { note: "**`dZ2 = ŷ − y` is the small miracle of this page.** Softmax's own derivative is messy — a full Jacobian — but composed with cross-entropy the messy terms cancel, leaving \"prediction minus truth\". That is why frameworks fuse the pair into a single op." },
      { h: "Deriving why everything cancels" },
      { code: String.raw`L = −Σ yₖ log ŷₖ        and  ŷᵢ = e^zᵢ / Σⱼ e^zⱼ

∂L/∂zᵢ = Σₖ (∂L/∂ŷₖ)(∂ŷₖ/∂zᵢ)

∂L/∂ŷₖ  = −yₖ/ŷₖ
∂ŷₖ/∂zᵢ = ŷₖ(δᵢₖ − ŷᵢ)          δ = 1 when i=k, else 0

substituting:  Σₖ (−yₖ/ŷₖ)·ŷₖ(δᵢₖ − ŷᵢ)
             = Σₖ −yₖ(δᵢₖ − ŷᵢ)
             = −yᵢ + ŷᵢ Σₖ yₖ
             = ŷᵢ − yᵢ                  since Σyₖ = 1 for one-hot`,
        cap: "Do it once and you never forget it — and you understand why a second softmax breaks it", lang: "txt" },
      { h: "Why MSE fits regression" },
      { code: String.raw`Assume  y = ŷ + ε   with ε ~ Normal(0, σ²)

likelihood of one point:  p(y|x) = (1/√(2πσ²)) · e^(−(y−ŷ)²/2σ²)

total log-likelihood:     Σ [ −(y−ŷ)²/2σ² − log√(2πσ²) ]
                               ‾‾‾‾‾‾‾‾‾‾
                               the only term involving the parameters

→ maximising the log-likelihood ≡ minimising Σ(y−ŷ)² ≡ MSE`,
        cap: "MSE is not an arbitrary choice — it is the Gaussian noise assumption written as a loss", lang: "txt" },
      { h: "Why cross-entropy fits classification" },
      { code: String.raw`Assume a Bernoulli outcome:  p(y|x) = ŷ^y · (1−ŷ)^(1−y)

log-likelihood:  y log ŷ + (1−y) log(1−ŷ)

→ maximising ≡ minimising −[y log ŷ + (1−y) log(1−ŷ)] ≡ binary cross-entropy`,
        cap: "Same principle, a different distributional assumption, therefore a different loss", lang: "txt" },
      { p: "**This is the core of the section: a loss is not chosen because it is customary, it is derived from an assumption about how the data was generated.** Change the assumption and the loss changes — assume Laplace instead of Gaussian and you get MAE rather than MSE." },
      { h: "Regularisation comes from a prior too" },
      { code: String.raw`MAP = maximise  log p(D|θ) + log p(θ)
                                ‾‾‾‾‾‾‾‾‾   ‾‾‾‾‾‾‾‾
                                likelihood   prior

a Gaussian prior on θ  →  −λ‖θ‖²   →  L2 / weight decay
a Laplace prior on θ   →  −λ‖θ‖₁   →  L1 / sparsity`,
        cap: "Weight decay is not a hack; it is stating a belief that the weights should be small before seeing data", lang: "txt" }
    ],
    dataflow: [
      { p: "One concrete set of numbers walked forward and backward through a tiny network — followable by hand." },
      { h: "The network we will walk" },
      { code: String.raw`2 inputs → 2 hidden neurons (ReLU) → 2 classes (softmax)

x  = [1.0, 2.0]                 y = [1, 0]   (class 0 is correct)

W1 = [[0.1, 0.3],               b1 = [0.0, 0.0]
      [0.2, 0.4]]
W2 = [[0.5, 0.7],               b2 = [0.0, 0.0]
      [0.6, 0.8]]`,
        cap: "Small enough to do by hand, large enough to show every mechanism", lang: "txt" },
      { h: "Forward — the hidden layer" },
      { code: String.raw`Z1 = x @ W1 + b1
   z1₀ = 1.0(0.1) + 2.0(0.2) = 0.5
   z1₁ = 1.0(0.3) + 2.0(0.4) = 1.1
Z1 = [0.5, 1.1]

A1 = relu(Z1) = [0.5, 1.1]        ← both positive, so both pass through`,
        cap: "ReLU does nothing at all to positive values, which is why its derivative there is 1", lang: "txt" },
      { h: "Forward — the output layer and the loss" },
      { code: String.raw`Z2 = A1 @ W2 + b2
   z2₀ = 0.5(0.5) + 1.1(0.6) = 0.91
   z2₁ = 0.5(0.7) + 1.1(0.8) = 1.23

softmax:  e^0.91 = 2.484 · e^1.23 = 3.421 · sum = 5.905
   ŷ₀ = 2.484/5.905 = 0.4207
   ŷ₁ = 3.421/5.905 = 0.5793

L = −log(ŷ of the true class) = −log(0.4207) = 0.8659`,
        cap: "One-hot leaves a single term — the loss is simply how surprised the model was by the right answer", lang: "txt" },
      { note: "**Read that loss value.** Guessing at random over two classes gives `−log(0.5) = 0.693`, so 0.8659 is **worse than chance**: the model leans toward the wrong class. For ten classes the chance line is `−log(0.1) = 2.303`. Remember those two numbers to tell whether a model has started learning at all." },
      { h: "Backward — starting at the logits" },
      { code: String.raw`dZ2 = ŷ − y = [0.4207 − 1, 0.5793 − 0] = [−0.5793, 0.5793]`,
        cap: "Negative means push this class's score up; positive means push it down", lang: "txt" },
      { h: "Backward — the second layer's weights" },
      { code: String.raw`dW2 = A1ᵀ @ dZ2        (2,1)@(1,2) → (2,2)
   dW2[0][0] = 0.5 × (−0.5793) = −0.2897
   dW2[0][1] = 0.5 × ( 0.5793) =  0.2897
   dW2[1][0] = 1.1 × (−0.5793) = −0.6372
   dW2[1][1] = 1.1 × ( 0.5793) =  0.6372

db2 = dZ2 = [−0.5793, 0.5793]`,
        cap: "A weight's gradient is incoming activation times outgoing error — the louder neuron carries more of the blame", lang: "txt" },
      { h: "Backward — through the hidden layer" },
      { code: String.raw`dA1 = dZ2 @ W2ᵀ
   dA1₀ = (−0.5793)(0.5) + (0.5793)(0.7) = 0.1159
   dA1₁ = (−0.5793)(0.6) + (0.5793)(0.8) = 0.1159

dZ1 = dA1 ⊙ (Z1 > 0) = [0.1159, 0.1159]    ← both z1 positive, so both pass

dW1 = xᵀ @ dZ1
   dW1[0] = 1.0 × [0.1159, 0.1159] = [0.1159, 0.1159]
   dW1[1] = 2.0 × [0.1159, 0.1159] = [0.2318, 0.2318]`,
        cap: "Had any z1 been negative its gradient would be zeroed here — that is the dying ReLU", lang: "txt" },
      { h: "The weight update" },
      { code: String.raw`η = 0.1

W2[0][0] ← 0.5 − 0.1(−0.2897) = 0.5290
W2[0][1] ← 0.7 − 0.1( 0.2897) = 0.6710
W1[0][0] ← 0.1 − 0.1( 0.1159) = 0.0884
...

running forward again (updating both W and b):  L = 0.8659 → 0.7032`,
        cap: "The loss really does fall in one step — training is this, repeated a few million times", lang: "txt" },
      { h: "What one epoch consists of" },
      { code: String.raw`for epoch in range(E):              ← one pass over the whole dataset
    shuffle(data)                   ← important: stops the model learning the order
    for batch in batches(data, 32): ← one gradient step per batch
        forward  → loss
        backward → gradients
        update   → θ ← θ − η∇L`,
        cap: "A batch of 32 means averaging the gradient over 32 examples before taking one step", lang: "python" },
      { table: { head: ["Batch size", "Upside", "Downside"], rows: [
        ["1 (true SGD)", "Frequent updates · escapes local minima easily", "Very noisy · wastes the GPU"],
        ["32-256 (mini-batch)", "**The practical balance** · parallelises well", "The learning rate must be tuned alongside it"],
        ["Whole dataset", "The most accurate gradient", "Very slow · settles into local minima"]
      ]}}
    ],
    implementation: [
      { p: "Everything above in plain NumPy, no framework — runnable, and checkable for correctness." },
      { h: "1) Basic operations and shapes" },
      { code: String.raw`import numpy as np

x = np.array([1.0, 2.0, 3.0])          # (3,)
W = np.random.randn(3, 4) * 0.01       # (3, 4)
b = np.zeros(4)                        # (4,)

print(x @ W + b)                       # (4,)  broadcasting supplies b
print((x @ W).shape)                   # (4,)

X = np.random.randn(32, 3)             # a batch of 32
print((X @ W + b).shape)               # (32, 4)`,
        cap: "Print .shape on every line while writing — far cheaper than debugging later", lang: "python" },
      { h: "2) Activations and their derivatives" },
      { code: String.raw`def relu(z):        return np.maximum(0, z)
def relu_grad(z):   return (z > 0).astype(z.dtype)

def sigmoid(z):     return 1 / (1 + np.exp(-z))
def sigmoid_grad(z):
    s = sigmoid(z)
    return s * (1 - s)               # reuse s rather than recomputing

def softmax(z):
    z = z - z.max(axis=-1, keepdims=True)   # prevents overflow, changes nothing
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)`,
        cap: "keepdims=True matters: without it the shape collapses and broadcasting goes wrong silently", lang: "python" },
      { h: "3) Numerically safe losses" },
      { code: String.raw`def cross_entropy(y_true, y_pred, eps=1e-12):
    """y_true: one-hot (n, k) · y_pred: probabilities (n, k)"""
    y_pred = np.clip(y_pred, eps, 1.0 - eps)      # stops log(0) = -inf
    return -np.sum(y_true * np.log(y_pred)) / y_true.shape[0]

def mse(y_true, y_pred):
    return np.mean((y_true - y_pred) ** 2)`,
        cap: "That clip is the line that prevents NaN when the model becomes fully confident, which happens more often than you expect", lang: "python" },
      { h: "4) A complete MLP in forty lines" },
      { code: String.raw`class MLP:
    def __init__(self, n_in, n_hid, n_out, seed=0):
        rng = np.random.default_rng(seed)
        # He init: var = 2/fan_in — the right choice for ReLU
        self.W1 = rng.normal(0, np.sqrt(2 / n_in),  (n_in, n_hid))
        self.b1 = np.zeros(n_hid)
        self.W2 = rng.normal(0, np.sqrt(2 / n_hid), (n_hid, n_out))
        self.b2 = np.zeros(n_out)

    def forward(self, X):
        self.X  = X
        self.Z1 = X @ self.W1 + self.b1
        self.A1 = relu(self.Z1)
        self.Z2 = self.A1 @ self.W2 + self.b2
        self.Y  = softmax(self.Z2)
        return self.Y

    def backward(self, y_true, lr=0.1):
        n = y_true.shape[0]
        dZ2 = (self.Y - y_true) / n          # softmax + CE collapse to this
        dW2 = self.A1.T @ dZ2
        db2 = dZ2.sum(axis=0)

        dA1 = dZ2 @ self.W2.T
        dZ1 = dA1 * relu_grad(self.Z1)       # Hadamard, not matmul
        dW1 = self.X.T @ dZ1
        db1 = dZ1.sum(axis=0)

        self.W2 -= lr * dW2;  self.b2 -= lr * db2
        self.W1 -= lr * dW1;  self.b1 -= lr * db1`,
        cap: "Dividing by n in dZ2 averages the gradient over the batch; omit it and the learning rate becomes batch-size dependent", lang: "python" },
      { h: "5) Training it on a toy problem" },
      { code: String.raw`# XOR — the classic problem a linear model cannot solve
X = np.array([[0,0], [0,1], [1,0], [1,1]], dtype=float)
y = np.array([[1,0], [0,1], [0,1], [1,0]], dtype=float)   # one-hot

net = MLP(2, 8, 2)
for epoch in range(2000):
    out  = net.forward(X)
    loss = cross_entropy(y, out)
    net.backward(y, lr=0.5)
    if epoch % 500 == 0:
        acc = (out.argmax(1) == y.argmax(1)).mean()
        print(f"epoch {epoch:5d}  loss {loss:.4f}  acc {acc:.2f}")

# epoch     0  loss 0.5992  acc 0.75
# epoch  1500  loss 0.0005  acc 1.00   ← XOR fully learned`,
        cap: "XOR is not linearly separable, so solving it proves the hidden layer earns its place", lang: "python" },
      { h: "6) Gradient check — proving the backward pass is right" },
      { code: String.raw`def grad_check(net, X, y, eps=1e-5):
    """Compare the analytic gradient with a numerical difference"""
    net.forward(X)
    net.backward(y, lr=0.0)          # lr=0 → compute gradients without updating
    # (a real version stores dW1 here; shortened for the example)

    i, j = 0, 0
    orig = net.W1[i, j]

    net.W1[i, j] = orig + eps
    lp = cross_entropy(y, net.forward(X))
    net.W1[i, j] = orig - eps
    lm = cross_entropy(y, net.forward(X))
    net.W1[i, j] = orig

    numeric = (lp - lm) / (2 * eps)  # two-sided: error is O(eps²)
    return numeric`,
        cap: "Always use the two-sided form rather than (L(θ+ε)−L(θ))/ε — its error is far smaller", lang: "python" },
      { code: String.raw`How to judge it:
  rel = |a − b| / max(|a|, |b|)

  rel < 1e-7   comfortably correct
  rel < 1e-5   acceptable for a deep network
  rel > 1e-3   there is definitely a bug

Run it on a tiny network in float64 only —
float32 noise drowns the test.`,
        cap: "This is the only way to prove a hand-written backward pass; do it once before training for real", lang: "txt" },
      { h: "7) Eigen and PCA by hand" },
      { code: String.raw`X = np.random.randn(200, 3) @ np.array([[2,0,0],[0,1,0],[0,0,0.1]])
Xc = X - X.mean(axis=0)                # PCA must centre first

C = (Xc.T @ Xc) / (len(Xc) - 1)        # covariance (3,3)
vals, vecs = np.linalg.eigh(C)         # eigh for symmetric matrices
order = vals.argsort()[::-1]
vals, vecs = vals[order], vecs[:, order]

print(vals / vals.sum())               # variance explained per axis
# [0.79 0.20 0.002]  ← the first axis carries 79%

Z = Xc @ vecs[:, :2]                   # project down to two dimensions`,
        cap: "Use eigh rather than eig when the matrix is known to be symmetric — faster, and always real", lang: "python" }
    ],
    tricks: [
      { h: "Debugging by symptom" },
      { table: { head: ["Symptom", "Most common cause", "How to check"], rows: [
        ["`ValueError: shapes not aligned`", "A transpose in the wrong place", "Annotate every line with shapes and find the mismatched `k`"],
        ["The loss is `NaN`", "`log(0)` · division by zero · exploding gradients", "In that order: clip probabilities → check for a zero standard deviation → inspect the gradient norm"],
        ["The loss never moves", "Learning rate too small · signal dead from vanishing gradients · labels wired wrong", "Try to overfit ten examples first — if you cannot, the code is wrong, not the problem"],
        ["The loss falls then spikes", "Learning rate too large", "Divide it by ten, or add a warmup"],
        ["Loss falls but predictions are nonsense", "**A broadcasting mismatch** · labels and predictions swapped", "Check `.shape` on every intermediate"],
        ["Good on train, bad on test", "Overfitting · data leakage", "Watch the train/validation gap — a wide one is overfitting"],
        ["Reruns differ", "No seed · floating-point addition is not associative on a GPU", "Seed everything, then accept small GPU differences"]
      ]}},
      { h: "Techniques that always pay" },
      { ul: [
        "**Overfit ten examples first.** If you cannot, the bug is in the code, not the data or the model. This is the first test to run, every time.",
        "**Compare against chance**: `−log(1/k)` for k classes — 0.693 for two, 2.303 for ten. An initial loss far from that means initialisation or labels are wrong.",
        "**Print shapes, not values**, on the first debugging pass — most bugs are shape bugs.",
        "**Change the learning rate by factors of three**, not by small increments, to find the workable range quickly; refine afterwards.",
        "**Always scale features before gradient descent.** Tree models do not care; anything gradient-based cares enormously."
      ]},
      { h: "Why feature scaling matters" },
      { code: String.raw`feature 1: age      in the range 20-70
feature 2: income   in the range 20000-200000

the loss surface becomes a long, narrow valley
→ the gradient points across the valley instead of along it
→ you need a tiny learning rate to avoid oscillating → very slow

StandardScaler:  z = (x − μ) / σ         → mean 0, standard deviation 1
MinMaxScaler:    z = (x − min)/(max−min) → into [0, 1]`,
        cap: "Compute μ and σ on the training set only and apply them to the test set — otherwise it is leakage", lang: "txt" },
      { h: "Weight initialisation" },
      { table: { head: ["Scheme", "Variance", "Use with"], rows: [
        ["All zeros", "0", "**Never** — every neuron in a layer stays identical forever"],
        ["Small random `× 0.01`", "Constant", "Fine for shallow nets; the signal dies once they are deep"],
        ["**Xavier/Glorot**", "`2/(fan_in+fan_out)`", "Symmetric activations: tanh, sigmoid"],
        ["**He**", "`2/fan_in`", "**ReLU and relatives** — compensating for the half ReLU discards"]
      ]}},
      { p: "**Why initialisation is a real subject**: if the variance of the activations changes at each layer, twenty layers later it is either zero or enormous. Xavier and He are designed to hold that variance constant with depth." },
      { h: "Numerical traps you will actually hit" },
      { ul: [
        "**Applying softmax twice** — feeding a softmax output into a loss that already applies `log_softmax`. It trains, badly, and **never crashes, which is why it hides**.",
        "**Forgetting `keepdims=True`** — the shape collapses from `(32,1)` to `(32,)` and broadcasting quietly produces `(32,32)`.",
        "**Forgetting to divide by the batch size** — the gradient scales with the batch, so a tuned learning rate stops working when the batch changes.",
        "**Comparing floats with `==`** — use `np.isclose` instead, always.",
        "**Computing mean and standard deviation before the train/test split** — leakage that makes the results look better than they are."
      ]},
      { h: "Where to go next" },
      { p: "Two routes lead out of this page. Toward the classical models first (linear and logistic regression, decision trees, SVM) — lighter mathematics and far easier to interpret. Or straight on into deep learning, where what you still need is optimisers, regularisation and architectures (CNN, RNN, transformer) — but **the backpropagation derived here is the same mechanism in every one of them**." }
    ],
    eval: [
      { p: "Questions you can answer only if you understood rather than memorised." },
      { qa: [
        { q: "How does a gradient differ from a derivative?",
          a: "A derivative applies to a single-variable function and gives a number; a gradient is the **vector of partial derivatives** of a multi-variable function, so it has magnitude and direction — and that direction is where the function increases fastest." },
        { q: "Why does gradient descent have a minus sign?",
          a: "The gradient points toward **increasing** loss, and we want to decrease it, so we step against it. Flip the sign and you have gradient ascent, which is what you want when maximising something instead." },
        { q: "What exactly is backpropagation?",
          a: "An organised application of the chain rule to obtain the loss's derivative with respect to every parameter, walking from the output backwards and reusing what has already been computed. Technically it is reverse-mode automatic differentiation." },
        { q: "Why is reverse mode right for neural networks?",
          a: "Forward mode costs one pass per input; reverse mode costs one pass per output. A network has millions of parameters (inputs) and a single loss (output), so reverse mode is cheaper by a factor of millions." },
        { q: "What causes vanishing gradients, and how do you fix them?",
          a: "The chain rule multiplies each layer's derivative together; many factors below one drive the product toward zero, so early layers receive no signal. Fixes are ReLU (derivative one), residual connections that let gradients bypass layers, and normalisation." },
        { q: "Why did ReLU replace sigmoid in hidden layers?",
          a: "Sigmoid's derivative peaks at 0.25, so ten layers leave `0.25^10 ≈ 1e-6`. ReLU's derivative is one on the positive side, so signal survives depth — and it is far cheaper to compute." },
        { q: "Why does regression use MSE while classification uses cross-entropy?",
          a: "Both come from maximum likelihood under different assumptions: assume Gaussian noise and you derive MSE; assume a Bernoulli or categorical outcome and you derive cross-entropy. The loss is not an arbitrary pick." },
        { q: "Why does softmax pair with cross-entropy?",
          a: "The derivative of cross-entropy with respect to the logits collapses to `ŷ − y`, which is simple and numerically stable, so frameworks fuse them into one op — and it is why you must not apply softmax yourself and then hand it to a loss that takes another log." },
        { q: "How do entropy and cross-entropy differ?",
          a: "Entropy `H(p)` is the average surprise of the true distribution; cross-entropy `H(p,q)` is the average surprise of using model `q` to predict reality `p`. Their difference is the KL divergence, which is what you are really minimising." },
        { q: "Is KL divergence a distance?",
          a: "No. It is not symmetric — `D(p‖q) ≠ D(q‖p)` — and it does not satisfy the triangle inequality; swapping the arguments changes what is being penalised." },
        { q: "What is the shape rule for matrix multiplication?",
          a: "`(m,k) @ (k,n) → (m,n)`: the inner dimensions must match and disappear while the outer ones survive. And a gradient always has the shape of the thing it differentiates, which checks a backprop formula instantly." },
        { q: "How does broadcasting work, and where is it dangerous?",
          a: "Shapes align right to left and each dimension must be equal or one. The danger is the case that does not error but is wrong, such as `(32,1)` with `(1,32)` becoming `(32,32)` — an unintended outer product." },
        { q: "Why does L1 drive coefficients to exactly zero while L2 does not?",
          a: "The derivative of `|w|` is a constant ±1, so the push toward zero never weakens. The derivative of `w²` is `2w`, which fades near zero, leaving values that are very small but never actually zero." },
        { q: "What has weight decay got to do with Bayes?",
          a: "MAP maximises `log p(D|θ) + log p(θ)`. A Gaussian prior on the weights contributes `−λ‖θ‖²`, which is exactly L2 — so weight decay is a stated belief that weights should be small, not a hack." },
        { q: "What is an eigenvector, and how does PCA use it?",
          a: "A direction a matrix only stretches rather than rotates (`Av = λv`). PCA takes the eigenvectors of the covariance matrix, which are the axes of greatest variance, with the eigenvalues saying how much variance each explains." },
        { q: "Why subtract the maximum before softmax?",
          a: "`e^x` overflows float32 around x = 88. Subtracting any constant from every logit leaves the result unchanged because `e^−c` cancels above and below, and choosing the maximum makes the largest exponent zero, so it can never overflow." },
        { q: "What loss should you see at the start of training?",
          a: "`−log(1/k)` for k classes — 0.693 for two and 2.303 for ten. A starting value far from that means the initialisation or the labels are wrong, not that the model is clever." },
        { q: "How do you gradient check, and what threshold do you use?",
          a: "Compare the analytic gradient with `(L(θ+ε) − L(θ−ε)) / 2ε`, using the relative difference `|a−b|/max(|a|,|b|)`, which should fall below 1e-7. Do it on a small network in float64, because float32 noise swamps the test." },
        { q: "Why scale features before gradient descent?",
          a: "Wildly different scales turn the loss surface into a long narrow valley, so the gradient points across it rather than along it and demands a tiny learning rate. And μ and σ must come from the training set only, or it is leakage." },
        { q: "Why can weights not all be initialised to zero?",
          a: "Every neuron in a layer would receive an identical gradient at every step and update identically forever, collapsing the layer into one repeated neuron. The symmetry has to be broken by randomness." },
        { q: "What is the first test to run before training for real?",
          a: "Overfit about ten examples to 100% accuracy. If you cannot, the code has a bug — the data is not too hard and the model is not too small — and knowing that saves an enormous amount of time." }
      ]},
      { h: "Further reading" },
      { links: [
        { label: "3Blue1Brown — Essence of linear algebra", url: "https://www.3blue1brown.com/topics/linear-algebra", note: "Vectors, matrices and eigenvectors explained visually — watch before reading formulas and everything lands faster" },
        { label: "3Blue1Brown — Neural networks", url: "https://www.3blue1brown.com/topics/neural-networks", note: "The backpropagation episode is the clearest visual account of the chain rule anywhere" },
        { label: "The Matrix Cookbook", url: "https://www.math.uwaterloo.ca/~hwolkowi/matrixcookbook.pdf", note: "Derivatives of every matrix expression you will need; keep it open while deriving" },
        { label: "CS231n — Backpropagation", url: "https://cs231n.github.io/optimization-2/", note: "Backprop derived through computational graphs, with NumPy code" },
        { label: "Deep Learning Book — chapters 2-4", url: "https://www.deeplearningbook.org/", note: "Linear algebra, probability and numerical computation; free to read online" },
        { label: "NumPy — broadcasting", url: "https://numpy.org/doc/stable/user/basics.broadcasting.html", note: "The formal shape-matching rules, with the examples people get wrong" },
        { label: "Distill — Why Momentum Really Works", url: "https://distill.pub/2017/momentum/", note: "Shows visually how a narrow valley makes the gradient oscillate" }
      ]}
    ]
  }
});
