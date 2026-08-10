/* Classical ML — kNN, tree, forest, boosting, SVM, naive Bayes, PCA, k-means */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

window.TEACHING_DATA.push({
  id: "ml_classic",
  name: "โมเดลคลาสสิก — ต้นไม้ ป่า boosting SVM และการจัดกลุ่ม",
  nameEn: "Classical Models — Trees, Forests, Boosting, SVM and Clustering",
  titleShort: { th: "โมเดลคลาสสิก", en: "Classical Models" },
  tag: {
    th: "ตระกูลโมเดลที่ยังชนะข้อมูลตารางอยู่ทุกวันนี้ — ต้นไม้ตัดสินใจกับคณิตของ impurity, bagging เทียบ boosting, margin กับ kernel trick ของ SVM, และฝั่งไม่มี label คือ PCA กับ k-means",
    en: "The model families that still win on tabular data — decision trees and the impurity mathematics, bagging against boosting, the SVM margin and the kernel trick, and on the unlabelled side, PCA and k-means"
  },
  accent: "#fb923c",
  sections: {
    principle: [
      { h: "ทำไมต้องรู้จักหลายตระกูล" },
      { p: "**เพราะแต่ละตระกูลมีสมมติฐานเรื่องรูปร่างของข้อมูลไม่เหมือนกัน** — โมเดลเชิงเส้นสมมติว่าความสัมพันธ์เป็นเส้นตรง, kNN สมมติว่าของที่ใกล้กันเหมือนกัน, ต้นไม้สมมติว่าตัดเป็นกล่องสี่เหลี่ยมได้ · เลือกผิดตระกูลแล้วจูนเท่าไรก็ไม่ช่วย" },
      { p: "และ **บนข้อมูลตาราง gradient boosting ยังชนะ neural network อยู่จนถึงทุกวันนี้** — ไม่ใช่เรื่องล้าสมัย แต่เป็นเรื่องที่โครงสร้างของข้อมูลตารางเข้ากับต้นไม้มากกว่า" },
      { h: "แผนที่ของทั้งหมด" },
      { table: { head: ["ตระกูล", "สมมติฐานหลัก", "เก่งเมื่อ", "แพ้เมื่อ"], rows: [
        ["**เชิงเส้น**", "ความสัมพันธ์เป็นเส้นตรง", "ข้อมูลน้อย · ต้องอธิบายได้", "ความสัมพันธ์โค้งหรือมี interaction เยอะ"],
        ["**kNN**", "ของที่อยู่ใกล้กันคล้ายกัน", "ขอบเขตซับซ้อน ข้อมูลไม่ใหญ่", "มิติสูง · ข้อมูลใหญ่ · ไม่ได้สเกล"],
        ["**ต้นไม้**", "ตัดแบ่งเป็นกล่องได้", "ข้อมูลผสมชนิด · ไม่ต้องสเกล", "ขอบเขตเฉียง · ต้นไม้เดี่ยวไม่เสถียร"],
        ["**Random forest**", "ต้นไม้หลายต้นที่ต่างกันพอ", "ค่าเริ่มต้นที่ปลอดภัย ไม่ต้องจูนมาก", "ช้าตอนทำนาย · ไฟล์ใหญ่"],
        ["**Gradient boosting**", "แก้ความผิดพลาดทีละนิด", "**ข้อมูลตารางส่วนใหญ่**", "ต้องจูน · overfit ได้ถ้าปล่อย"],
        ["**SVM**", "มี margin ที่กว้างที่สุดคั่นอยู่", "มิติสูงแต่แถวน้อย · ข้อความ", "แถวเกินหลักหมื่น"],
        ["**Naive Bayes**", "feature อิสระต่อกันเมื่อรู้คลาส", "ข้อความ · ข้อมูลน้อยมาก · ต้องเร็วสุดขีด", "feature สัมพันธ์กันแรง"]
      ]}},
      { h: "ประโยคเดียวที่แยก bagging กับ boosting" },
      { note: "**bagging ลด variance ด้วยการเฉลี่ยโมเดลที่เป็นอิสระต่อกัน · boosting ลด bias ด้วยการแก้ความผิดพลาดต่อกันเป็นทอด ๆ** — จำประโยคนี้ได้แล้วจะเข้าใจว่าทำไม random forest ใช้ต้นไม้ลึก แต่ boosting ใช้ต้นไม้ตื้น" },
      { h: "supervised เทียบ unsupervised ในหน้านี้" },
      { table: { head: ["", "ต้องมี label", "ตอบคำถามว่า"], rows: [
        ["kNN · ต้นไม้ · forest · boosting · SVM · naive Bayes", "**ต้องมี**", "ตัวอย่างใหม่นี้อยู่คลาสไหน / ค่าเท่าไร"],
        ["**PCA**", "ไม่ต้อง", "ลดมิติลงเหลือกี่แกนแล้วยังเก็บข้อมูลไว้ได้เท่าไร"],
        ["**k-means**", "ไม่ต้อง", "ข้อมูลนี้แบ่งเป็นกลุ่มธรรมชาติได้กี่กลุ่ม"]
      ]}},
      { h: "หน้านี้จะทำให้ทำได้" },
      { ul: [
        "สร้างต้นไม้ตัดสินใจด้วยมือจากตาราง 10 แถว แล้วรู้ว่ามันเลือกจุดตัดยังไง",
        "อธิบายว่าทำไม random forest ใช้ต้นไม้ลึก แต่ boosting ใช้ต้นไม้ตื้น",
        "รู้ว่า `C` กับ `gamma` ของ SVM ทำอะไร และปรับผิดทางแล้วเกิดอะไร",
        "เลือก k ของ k-means ด้วยหลักฐาน ไม่ใช่ความรู้สึก",
        "รู้ว่า feature importance ของต้นไม้หลอกตรงไหน และใช้อะไรแทน"
      ]}
    ],

    theory: [
      { p: "หมวดนี้อนุมานแต่ละตระกูล — เน้นสมมติฐานและกลไก ไม่ใช่รายชื่อพารามิเตอร์" },
      { h: "1) kNN — โมเดลที่ไม่เทรนเลย" },
      { code: String.raw`ทำนาย x ใหม่:
  1. หาเพื่อนบ้าน k ตัวที่ใกล้ที่สุด
  2. classification → โหวต · regression → เฉลี่ย

ไม่มีขั้นตอน "เทรน" เลย — งานทั้งหมดอยู่ที่ตอนทำนาย`,
        cap: "เรียกว่า lazy learner: เก็บข้อมูลไว้ทั้งชุดแล้วค่อยคิดตอนถูกถาม", lang: "txt" },
      { table: { head: ["k", "ผลที่ได้"], rows: [
        ["k = 1", "**variance สูงมาก** — จำ noise ทุกจุด ขอบเขตหยักละเอียด"],
        ["k ใหญ่ขึ้น", "เรียบขึ้น bias สูงขึ้น variance ต่ำลง"],
        ["k = n", "ทำนายค่าเดียวกันหมด = majority class"]
      ]}},
      { p: "**ต้องสเกล feature เสมอ** เพราะมันคือระยะทางล้วน ๆ — รายได้หน่วยบาทจะกลบอายุจนหมดถ้าไม่สเกล และ **มิติสูงทำลาย kNN โดยตรง** เพราะทุกจุดเริ่มห่างเท่ากันหมด" },
      { h: "2) ต้นไม้ตัดสินใจ — ถามคำถามทีละข้อ" },
      { code: String.raw`         อายุ < 30 ?
        /            \
      ใช่            ไม่
       |              |
  รายได้ < 40k ?    ทำนาย: ซื้อ
    /       \
  ซื้อ    ไม่ซื้อ`,
        cap: "แต่ละ node ถามคำถามเดียวบน feature เดียว — จึงอ่านออกและอธิบายได้", lang: "txt" },
      { p: "**เลือกคำถามยังไง**: ลองทุก feature ทุกจุดตัด แล้วเลือกอันที่ทำให้ **ความไม่บริสุทธิ์ลดลงมากที่สุด** — นี่คือ greedy algorithm ที่ตัดสินใจดีที่สุด ณ จุดนั้น โดยไม่มองไปข้างหน้า" },
      { h: "3) Gini กับ entropy — วัดความไม่บริสุทธิ์" },
      { code: String.raw`Gini    = 1 − Σ pᵢ²
Entropy = −Σ pᵢ log₂ pᵢ

node ที่มี 50/50:   Gini = 1 − (0.25+0.25) = 0.5    Entropy = 1.0
node ที่มี 100/0:   Gini = 1 − 1 = 0                Entropy = 0
node ที่มี 90/10:   Gini = 1 − (0.81+0.01) = 0.18   Entropy = 0.47`,
        cap: "ทั้งคู่เป็นศูนย์เมื่อบริสุทธิ์ และสูงสุดเมื่อผสมกันเท่า ๆ", lang: "txt" },
      { note: "**สองตัวนี้เลือกจุดตัดเหมือนกันเกือบทุกครั้ง** — ต่างกันแค่ entropy ลงโทษ node ที่ผสมมากหนักกว่านิดหน่อย และช้ากว่าเพราะต้องคำนวณ log · ในทางปฏิบัติใช้ gini เป็นค่าเริ่มต้นได้เลย" },
      { h: "4) Information gain — เกณฑ์การตัด" },
      { code: String.raw`gain = impurity(พ่อ) − Σ (nᵢ/n) · impurity(ลูก i)
                              ‾‾‾‾‾‾
                              ถ่วงน้ำหนักตามจำนวนตัวอย่าง

เลือกจุดตัดที่ gain สูงสุด`,
        cap: "การถ่วงน้ำหนักสำคัญ — ตัดให้ได้ node บริสุทธิ์ที่มีแค่ 1 ตัวอย่างไม่ได้ช่วยอะไร", lang: "txt" },
      { h: "5) ทำไมต้นไม้ไม่ต้องสเกล" },
      { p: "เพราะมันใช้แค่ **ลำดับ** ไม่ใช่ระยะทาง — คำถาม `รายได้ < 40000` ให้ผลเหมือนกันไม่ว่าจะวัดเป็นบาทหรือพันบาท การแปลงแบบ monotonic ใด ๆ ก็ไม่เปลี่ยนต้นไม้ที่ได้เลย" },
      { p: "**และนี่คือความแตกต่างเชิงโครงสร้างจากโมเดลเชิงเส้นกับ kNN** ที่อ่อนไหวต่อสเกลมาก" },
      { h: "6) ต้นไม้เดี่ยวมีปัญหาอะไร" },
      { table: { head: ["ปัญหา", "อาการ"], rows: [
        ["**variance สูงมาก**", "เปลี่ยนข้อมูลไม่กี่แถว โครงสร้างต้นไม้เปลี่ยนทั้งต้น"],
        ["**overfit ง่ายมาก**", "ปล่อยให้ลึกไม่จำกัด จะจำข้อมูลได้ 100% ทุกครั้ง"],
        ["**ขอบเขตเป็นขั้นบันได**", "ตัดได้แค่แนวขนานแกน เส้นเฉียงต้องประมาณด้วยบันไดหลายขั้น"]
      ]}},
      { p: "**สองวิธีแก้ที่เดินคนละทาง** และนั่นคือที่มาของ random forest กับ gradient boosting" },
      { h: "7) Random forest — bagging" },
      { code: String.raw`สร้าง B ต้น แต่ละต้น:
   1. bootstrap: สุ่มแถวมา n ตัวแบบใส่คืน (ราว 63% ของแถวไม่ซ้ำ)
   2. ที่แต่ละ node: สุ่ม feature มาแค่ m ตัวจาก p ตัว แล้วเลือกจุดตัดจากในนั้น
   3. ปล่อยให้ลึกเต็มที่ ไม่ตัดแต่ง

ทำนาย: โหวต (classification) หรือเฉลี่ย (regression)`,
        cap: "การสุ่ม feature ที่แต่ละ node คือสิ่งที่ทำให้ต้นไม้ 'ต่างกัน' จริง ไม่ใช่แค่ bootstrap", lang: "txt" },
      { p: "**ทำไมต้องสุ่ม feature ด้วย**: ถ้ามี feature ที่แรงมากตัวหนึ่ง ทุกต้นจะเลือกมันเป็นรากเหมือนกันหมด ต้นไม้ก็จะคล้ายกันเกินไป และ **การเฉลี่ยของสิ่งที่สัมพันธ์กันไม่ลด variance** — การบังคับให้บางต้นมองไม่เห็นมันจึงเป็นหัวใจ" },
      { code: String.raw`Var(เฉลี่ยของ B ตัว) = ρσ² + (1−ρ)σ²/B
                        ‾‾‾‾
                        พจน์นี้ไม่หายไปแม้ B → ∞

ρ = ความสัมพันธ์ระหว่างต้น → ต้องกดให้ต่ำ`,
        cap: "นี่คือสมการที่บอกว่าทำไมความหลากหลายสำคัญกว่าจำนวนต้น", lang: "txt" },
      { h: "8) Gradient boosting — เดินอีกทาง" },
      { code: String.raw`F₀(x) = ค่าเริ่มต้น (เช่นค่าเฉลี่ยของ y)

ทำซ้ำ M รอบ:
   1. คำนวณ residual: rᵢ = yᵢ − F(xᵢ)      ← ที่ยังทำนายพลาดอยู่
   2. เทรนต้นไม้ตื้นให้ทำนาย residual นั้น
   3. F(x) ← F(x) + η · tree(x)             ← η = learning rate

ทำนาย: บวกผลของทุกต้นเข้าด้วยกัน`,
        cap: "แต่ละต้นไม่ได้ทำนาย y แต่ทำนาย 'ส่วนที่ยังผิดอยู่' ของทั้งวง", lang: "txt" },
      { table: { head: ["", "Random forest", "Gradient boosting"], rows: [
        ["ต้นไม้แต่ละต้น", "**ลึก** (bias ต่ำ variance สูง)", "**ตื้น** (bias สูง variance ต่ำ)"],
        ["สร้างยังไง", "อิสระต่อกัน ขนานได้", "**เรียงต่อกัน** ขนานภายในต้นได้เท่านั้น"],
        ["ลดอะไร", "**variance** ด้วยการเฉลี่ย", "**bias** ด้วยการแก้ทีละนิด"],
        ["เพิ่มจำนวนต้นแล้ว", "แทบไม่ overfit", "**overfit ได้** ต้อง early stopping"],
        ["ต้องจูนไหม", "น้อย", "มาก — โดยเฉพาะ learning rate กับความลึก"],
        ["ผลบนข้อมูลตาราง", "ดี", "**มักดีกว่า**"]
      ]}},
      { note: "**ทำไม boosting ใช้ต้นไม้ตื้น**: ต้นไม้ตื้นมี bias สูงซึ่งเป็นสิ่งที่ boosting ตั้งใจแก้อยู่แล้ว ถ้าใช้ต้นไม้ลึกตั้งแต่ต้น รอบแรกก็จำข้อมูลได้หมดแล้ว ไม่เหลือ residual ให้รอบถัดไปเรียนรู้ และ overfit ทันที" },
      { h: "9) SVM — margin ที่กว้างที่สุด" },
      { code: String.raw`หา hyperplane ที่ห่างจากจุดที่ใกล้ที่สุดของทั้งสองฝั่งมากที่สุด

    o   o        |‾‾‾|        x   x
      o     o    |   |    x     x
         o   ●===|===|===●   x        ● = support vector
                 |___|
                 margin

จุดที่ไม่ใช่ support vector ไม่มีผลต่อคำตอบเลย`,
        cap: "ลบจุดที่อยู่ไกล ๆ ออกไปกี่จุดก็ได้ เส้นแบ่งจะไม่ขยับ ตราบใดที่ support vector ยังอยู่", lang: "txt" },
      { table: { head: ["พารามิเตอร์", "ค่าน้อย", "ค่ามาก"], rows: [
        ["**C**", "margin กว้าง ยอมให้ผิดได้บ้าง — regularize แรง", "margin แคบ พยายามถูกทุกจุด — **overfit ได้**"],
        ["**gamma** (RBF)", "อิทธิพลของหนึ่งจุดแผ่ไกล — ขอบเขตเรียบ", "อิทธิพลแคบ — ขอบเขตหยัก **overfit**"]
      ]}},
      { h: "10) Kernel trick — คำนวณในมิติสูงโดยไม่ต้องไปที่นั่น" },
      { code: String.raw`ปัญหา: ข้อมูลแยกด้วยเส้นตรงไม่ได้ในมิติเดิม
วิธีปกติ: แปลงไปมิติสูงกว่า φ(x) แล้วแยก — แต่แพงหรือเป็นอนันต์

kernel trick: อัลกอริทึมใช้แค่ inner product φ(a)·φ(b)
              และมี K(a,b) ที่คำนวณค่านั้นได้โดยไม่ต้องสร้าง φ

RBF:  K(a,b) = exp(−γ‖a−b‖²)     ← เทียบเท่ามิติอนันต์`,
        cap: "ไม่เคยสร้างเวกเตอร์ในมิติสูงเลยสักครั้ง — คำนวณผลลัพธ์ตรง ๆ", lang: "txt" },
      { h: "11) Naive Bayes — สมมติฐานที่ผิดแต่ใช้ได้" },
      { code: String.raw`P(คลาส | feature) ∝ P(คลาส) · Π P(featureᵢ | คลาส)
                                    ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
                                    สมมติว่าอิสระต่อกัน — มักไม่จริง

แต่การจัดอันดับคลาสยังถูก แม้ค่าความน่าจะเป็นจะเพี้ยน`,
        cap: "จึงจำแนกได้ดีแต่ให้ความน่าจะเป็นที่ calibrate แย่มาก — ห้ามเอาไปคูณกับเงิน", lang: "txt" },
      { h: "12) PCA — ลดมิติโดยเสียความแปรปรวนน้อยที่สุด" },
      { code: String.raw`1. หักค่าเฉลี่ยออก (บังคับ) และมักต้องสเกลด้วย
2. คำนวณ covariance matrix
3. หา eigenvector/eigenvalue
4. เรียงตาม eigenvalue จากมากไปน้อย เลือก k ตัวแรก
5. ฉายข้อมูลลงบนแกนใหม่`,
        cap: "แกนใหม่คือทิศทางที่ข้อมูลกระจายมากที่สุด และตั้งฉากกันทุกคู่", lang: "txt" },
      { p: "**ต้องสเกลก่อนเสมอถ้าหน่วยต่างกัน** ไม่งั้น feature ที่มีตัวเลขใหญ่จะครองแกนแรกไปโดยอัตโนมัติ · และ **แกนใหม่ตีความไม่ได้แล้ว** เพราะเป็นผลรวมถ่วงน้ำหนักของ feature เดิมทั้งหมด" },
      { h: "13) k-means — จัดกลุ่มด้วยระยะทาง" },
      { code: String.raw`1. สุ่มจุดศูนย์กลาง k จุด (k-means++ เลือกให้ฉลาดขึ้น)
2. ทำซ้ำจนนิ่ง:
     a. จับแต่ละจุดเข้ากลุ่มที่ศูนย์กลางใกล้ที่สุด
     b. ย้ายศูนย์กลางไปที่ค่าเฉลี่ยของกลุ่มตัวเอง`,
        cap: "ลดผลรวมของระยะทางกำลังสองภายในกลุ่ม — จึงสมมติว่ากลุ่มเป็นทรงกลมขนาดใกล้เคียงกัน", lang: "txt" },
      { table: { head: ["ข้อจำกัด", "ผลที่ตามมา"], rows: [
        ["ต้องบอก k ล่วงหน้า", "ใช้ elbow plot หรือ silhouette score ช่วยเลือก"],
        ["สมมติกลุ่มเป็นทรงกลม", "หากลุ่มรูปพระจันทร์เสี้ยวไม่เจอ — ใช้ DBSCAN แทน"],
        ["ขึ้นกับจุดเริ่มต้น", "รันหลายครั้งแล้วเอาที่ดีที่สุด (`n_init`)"],
        ["อ่อนไหวต่อสเกล", "ต้องสเกลก่อนเสมอ"]
      ]}}
    ],

    foundations: [
      { p: "หมวดนี้เจาะกลไกที่ตัดสินพฤติกรรมของแต่ละตระกูล" },
      { h: "สร้างต้นไม้ทีละ node — คณิตศาสตร์จริง" },
      { code: String.raw`ข้อมูล 10 แถว: ซื้อ 6 · ไม่ซื้อ 4

Gini ของ node ราก = 1 − (0.6² + 0.4²) = 1 − 0.52 = 0.48

ลองตัดที่ "อายุ < 30":
  ซ้าย  (4 แถว): ซื้อ 1 ไม่ซื้อ 3 → Gini = 1 − (0.25² + 0.75²) = 0.375
  ขวา   (6 แถว): ซื้อ 5 ไม่ซื้อ 1 → Gini = 1 − (0.833² + 0.167²) = 0.278

Gini ถ่วงน้ำหนัก = (4/10)(0.375) + (6/10)(0.278) = 0.317
gain = 0.48 − 0.317 = 0.163`,
        cap: "ทำแบบนี้กับทุก feature ทุกจุดตัด แล้วเลือก gain สูงสุด — นี่คือทั้งหมดของการสร้างต้นไม้", lang: "txt" },
      { h: "จำนวนจุดตัดที่ต้องลองจริง" },
      { code: String.raw`feature ต่อเนื่องที่มี v ค่าไม่ซ้ำ → มีจุดตัดที่ต้องพิจารณา v−1 จุด
   (จุดกึ่งกลางระหว่างค่าที่เรียงติดกัน)

p feature × n แถว → O(p · n log n) ต่อหนึ่ง node (รวมการเรียง)`,
        cap: "นี่คือเหตุผลที่ LightGBM ใช้ histogram มัดค่าเป็นถัง — ลดจาก n จุดเหลือ 255 ถัง", lang: "txt" },
      { h: "การควบคุมความลึกของต้นไม้" },
      { table: { head: ["พารามิเตอร์", "ทำอะไร", "ค่าที่ควรลอง"], rows: [
        ["`max_depth`", "ลึกได้กี่ชั้น", "ต้นไม้เดี่ยว 3-10 · boosting 3-8"],
        ["`min_samples_split`", "ต้องมีกี่ตัวอย่างถึงจะตัดต่อ", "2-20"],
        ["`min_samples_leaf`", "ใบต้องมีอย่างน้อยกี่ตัวอย่าง", "**คุมได้ตรงกว่า max_depth**"],
        ["`max_leaf_nodes`", "จำกัดจำนวนใบทั้งหมด", "ทางเลือกที่ยืดหยุ่นกว่าจำกัดความลึก"],
        ["`ccp_alpha`", "ตัดแต่งหลังสร้างเสร็จ (cost-complexity)", "หาด้วย cross-validation"]
      ]}},
      { h: "Out-of-bag — validation ฟรีของ random forest" },
      { code: String.raw`bootstrap สุ่ม n ตัวแบบใส่คืน จาก n ตัว
   → โอกาสที่แถวหนึ่งไม่ถูกเลือกเลย = (1 − 1/n)ⁿ → 1/e ≈ 0.368

→ ราว 37% ของแถวไม่ได้อยู่ในต้นนั้น = out-of-bag
→ ใช้แถวเหล่านั้นวัดผลได้โดยไม่ต้องแบ่ง validation แยก`,
        cap: "oob_score_ ของ sklearn มาจากตรงนี้ — ประหยัดข้อมูลเมื่อมีน้อย", lang: "txt" },
      { h: "Feature importance ของต้นไม้หลอกตรงไหน" },
      { table: { head: ["วิธี", "คำนวณจาก", "ปัญหา"], rows: [
        ["**Gini / impurity importance**", "gain รวมของ feature นั้นทุก node", "**เอนเอียงเข้าหา feature ที่มีค่าไม่ซ้ำเยอะ** เช่น id หรือค่าต่อเนื่อง"],
        ["**Permutation importance**", "สลับค่าของ feature แล้วดูว่าคะแนนตกเท่าไร", "ช้ากว่า แต่**เชื่อถือได้กว่ามาก** · ยังหลอกเมื่อ feature สัมพันธ์กัน"],
        ["**SHAP**", "ทฤษฎีเกม — ส่วนแบ่งของแต่ละ feature ต่อการทำนายหนึ่งครั้ง", "ช้าที่สุด แต่ได้ทั้งภาพรวมและรายตัวอย่าง"]
      ]}},
      { note: "**อย่าใช้ impurity importance ตัดสินใจอะไรสำคัญ** — ใส่คอลัมน์ random เข้าไปแล้วมันมักติดอันดับกลาง ๆ ซึ่งพิสูจน์ว่ามันเอนเอียง ให้ใช้ permutation importance บนชุด validation แทน" },
      { h: "SVM — จากสัญชาตญาณสู่สมการ" },
      { code: String.raw`hard margin (แยกได้สมบูรณ์):
   minimize ½‖w‖²   ภายใต้  yᵢ(wᵀxᵢ + b) ≥ 1 ทุก i

soft margin (โลกจริง):
   minimize ½‖w‖² + C Σ ξᵢ    โดย ξᵢ = ระยะที่ล้ำเข้ามาใน margin

margin = 2/‖w‖   → ลด ‖w‖ = ขยาย margin`,
        cap: "C คือราคาของการยอมให้ผิด — สูงแปลว่าแพง จึงพยายามถูกทุกจุดจน overfit", lang: "txt" },
      { h: "เลือก k ของ k-means ด้วยหลักฐาน" },
      { table: { head: ["วิธี", "ดูอะไร", "ข้อสังเกต"], rows: [
        ["**Elbow**", "inertia (ผลรวมระยะกำลังสอง) เทียบ k", "หาจุดที่ความชันเปลี่ยน — **มักกำกวม**"],
        ["**Silhouette**", "แต่ละจุดอยู่ในกลุ่มตัวเองพอดีแค่ไหน (−1 ถึง 1)", "**ชัดกว่า elbow** · ใกล้ 1 คือดี"],
        ["**ความรู้ในโดเมน**", "ธุรกิจต้องการกี่กลุ่มจริง ๆ", "**มักเป็นคำตอบที่ดีที่สุด**"]
      ]}},
      { code: String.raw`silhouette ของจุด i:
   a = ระยะเฉลี่ยไปยังจุดอื่นในกลุ่มเดียวกัน
   b = ระยะเฉลี่ยไปยังจุดในกลุ่มที่ใกล้ที่สุดกลุ่มถัดไป
   s = (b − a) / max(a, b)

s ใกล้ 1   อยู่ถูกกลุ่มชัดเจน
s ใกล้ 0   อยู่ตรงพรมแดน
s ติดลบ    น่าจะอยู่ผิดกลุ่ม`,
        cap: "คำนวณต่อจุดแล้วเฉลี่ย — ได้ทั้งภาพรวมและรู้ว่าจุดไหนน่าสงสัย", lang: "txt" },
      { h: "PCA เลือก k อย่างไร" },
      { code: String.raw`explained_variance_ratio_ = [0.62, 0.21, 0.09, 0.05, 0.03]
cumulative                = [0.62, 0.83, 0.92, 0.97, 1.00]

เลือก k ที่สะสมถึง 90-95% → k = 3 หรือ 4`,
        cap: "ไม่มีเลขวิเศษ — ขึ้นกับว่ายอมเสียข้อมูลได้แค่ไหนเทียบกับที่ประหยัดมิติได้", lang: "txt" }
    ],

    architecture: [
      { p: "หมวดนี้คือการเลือกและจูนแต่ละตระกูลอย่างมีลำดับ" },
      { h: "ลำดับที่ทำงานได้จริง" },
      { code: String.raw`1. baseline (majority / mean)
2. logistic / linear regression          ← ถ้าใกล้พอ หยุด
3. random forest ค่าเริ่มต้น              ← ดูว่าโครงสร้างที่ไม่เป็นเส้นตรงช่วยไหม
4. gradient boosting + จูน               ← ตัวที่มักชนะบนข้อมูลตาราง
5. ensemble หรือ neural network          ← เมื่อคุ้มจริง ๆ เท่านั้น`,
        cap: "ขั้นที่ 3 ใช้เวลาห้านาทีและตอบคำถามสำคัญว่า 'ความไม่เป็นเส้นตรงมีผลไหม'", lang: "txt" },
      { h: "พารามิเตอร์ที่สำคัญจริงของแต่ละตัว" },
      { table: { head: ["โมเดล", "จูนตัวไหนก่อน", "รองลงมา"], rows: [
        ["**kNN**", "`n_neighbors`", "`weights='distance'` · `metric`"],
        ["**Decision tree**", "`max_depth`", "`min_samples_leaf` · `ccp_alpha`"],
        ["**Random forest**", "`max_features`", "`min_samples_leaf` · `n_estimators` (ยิ่งมากยิ่งดี จนอิ่มตัว)"],
        ["**Gradient boosting**", "`learning_rate` + `n_estimators` (**คู่กัน**)", "`max_depth` · `subsample` · `min_child_weight`"],
        ["**SVM (RBF)**", "`C` และ `gamma` (**ต้องจูนคู่กัน**)", "`class_weight`"],
        ["**k-means**", "`n_clusters`", "`n_init` · `init='k-means++'`"]
      ]}},
      { note: "**learning_rate กับ n_estimators ของ boosting แลกกันตรง ๆ** — ลด learning rate ครึ่งหนึ่งต้องเพิ่มจำนวนต้นราวสองเท่า วิธีที่ใช้จริงคือตั้ง learning rate ต่ำ (0.05) แล้วใช้ early stopping หาจำนวนต้นให้เอง" },
      { h: "โครง pipeline ต่อตระกูล" },
      { code: String.raw`ต้องสเกล:      kNN · SVM · PCA · k-means · โมเดลเชิงเส้นที่ regularize
ไม่ต้องสเกล:   decision tree · random forest · gradient boosting

ต้อง one-hot:  โมเดลเชิงเส้น · kNN · SVM · neural network
จัดการเองได้:  LightGBM และ CatBoost รับ categorical ตรง ๆ ได้`,
        cap: "จำสองบรรทัดนี้แล้วจะไม่เสียเวลาสเกลข้อมูลให้ต้นไม้โดยไม่จำเป็น", lang: "txt" },
      { h: "การจัดการค่าที่หายไป" },
      { table: { head: ["โมเดล", "รับ NaN ตรง ๆ ได้ไหม", "ถ้าไม่ได้ทำยังไง"], rows: [
        ["**XGBoost / LightGBM**", "**ได้** — เรียนรู้ทิศทางที่ควรส่ง NaN ไป", "—"],
        ["**HistGradientBoosting** (sklearn)", "**ได้**", "—"],
        ["Random forest (sklearn)", "ไม่ได้", "impute ด้วย median หรือเพิ่มคอลัมน์ `is_missing`"],
        ["โมเดลเชิงเส้น · kNN · SVM", "ไม่ได้", "impute เสมอ และ fit บน train เท่านั้น"]
      ]}},
      { p: "**การเพิ่มคอลัมน์ `is_missing` มักได้ผลดีอย่างน่าประหลาด** — เพราะบ่อยครั้ง 'การที่ข้อมูลหาย' เป็นสัญญาณในตัวมันเอง เช่นลูกค้าที่ไม่กรอกรายได้อาจมีพฤติกรรมต่างจากคนที่กรอก" },
      { h: "Ensemble ของ ensemble" },
      { table: { head: ["วิธี", "ทำยังไง", "เมื่อไรคุ้ม"], rows: [
        ["**Voting**", "โหวตจากหลายโมเดลที่ต่างตระกูล", "เมื่อโมเดลผิดคนละแบบ"],
        ["**Stacking**", "ใช้ผลของโมเดลชั้นแรกเป็น feature ของโมเดลชั้นสอง", "แข่งขัน · ต้องระวัง leakage ต้องใช้ out-of-fold prediction"],
        ["**Blending น้ำหนักคงที่**", "เฉลี่ยแบบถ่วงน้ำหนักที่หาจาก validation", "ง่ายและปลอดภัยกว่า stacking"]
      ]}},
      { note: "**stacking รั่วง่ายมาก** — ต้องสร้าง feature ชั้นแรกด้วย out-of-fold prediction เท่านั้น ถ้าใช้ผลที่โมเดลทำนายบนข้อมูลที่มันเห็นตอนเทรน ชั้นสองจะเรียนรู้จากข้อมูลที่ดีเกินจริงและพังใน production" }
    ],

    dataflow: [
      { p: "หมวดนี้สร้างต้นไม้ด้วยมือจนจบ แล้วเดิน boosting หนึ่งรอบให้เห็นความต่าง" },
      { h: "ข้อมูลตัวอย่าง" },
      { code: String.raw`ทำนายว่าลูกค้าจะซื้อไหม

  #   อายุ   รายได้(k)   ซื้อ
  1    22       25         0
  2    25       32         0
  3    28       38         0
  4    31       45         1
  5    35       52         1
  6    38       41         1
  7    42       78         1
  8    45       35         0
  9    48       85         1
 10    52       92         1

รวม: ซื้อ 6 · ไม่ซื้อ 4`,
        cap: "สิบแถว สอง feature — เล็กพอจะทำมือ แต่มีรูปแบบที่ไม่ตรงไปตรงมา (แถวที่ 8 ขัดแนวโน้ม)", lang: "txt" },
      { h: "หา Gini ของราก" },
      { code: String.raw`p(ซื้อ) = 6/10 = 0.6    p(ไม่ซื้อ) = 4/10 = 0.4

Gini = 1 − (0.6² + 0.4²) = 1 − (0.36 + 0.16) = 0.48`,
        cap: "0.48 ใกล้ค่าสูงสุดของสองคลาส (0.5) แปลว่าตอนนี้ยังปนกันมาก", lang: "txt" },
      { h: "ลองจุดตัดบนอายุ" },
      { code: String.raw`ตัดที่ อายุ < 29.5  (กึ่งกลางระหว่าง 28 กับ 31)
  ซ้าย  3 แถว: ซื้อ 0 ไม่ซื้อ 3  → Gini = 1 − (0² + 1²) = 0     ← บริสุทธิ์
  ขวา   7 แถว: ซื้อ 6 ไม่ซื้อ 1  → Gini = 1 − (0.857² + 0.143²) = 0.245

ถ่วงน้ำหนัก = (3/10)(0) + (7/10)(0.245) = 0.171
gain = 0.48 − 0.171 = 0.309`,
        cap: "gain สูงมากเพราะฝั่งซ้ายบริสุทธิ์สนิท", lang: "txt" },
      { h: "ลองจุดตัดบนรายได้เทียบกัน" },
      { code: String.raw`ตัดที่ รายได้ < 39.5
  ซ้าย  4 แถว (25,32,38,35): ซื้อ 0 ไม่ซื้อ 4 → Gini = 0
  ขวา   6 แถว:               ซื้อ 6 ไม่ซื้อ 0 → Gini = 0

ถ่วงน้ำหนัก = 0
gain = 0.48 − 0 = 0.48        ← สูงกว่า!`,
        cap: "รายได้แยกได้สมบูรณ์ในข้อมูลชุดนี้ ต้นไม้จึงเลือกตัวนี้เป็นราก", lang: "txt" },
      { note: "**และนี่คือจุดที่ควรระวัง** — การแยกได้สมบูรณ์ด้วย feature เดียวบนข้อมูล 10 แถว มักเป็นเรื่องบังเอิญ ไม่ใช่รูปแบบจริง ต้นไม้ที่ลึกไม่จำกัดจะเชื่อรูปแบบแบบนี้ทุกครั้ง ซึ่งคือ overfit ในรูปแบบที่บริสุทธิ์ที่สุด" },
      { h: "ต้นไม้ที่ได้" },
      { code: String.raw`         รายได้ < 39.5 ?
        /              \
      ใช่              ไม่
       |                |
   ไม่ซื้อ (4/4)     ซื้อ (6/6)

ความลึก 1 · ใบสองใบ · ความแม่นยำบน train = 100%`,
        cap: "ต้นไม้ที่ถูกต้องบนข้อมูลเทรน 100% แต่จะทำนายลูกค้าคนใหม่ที่รายได้ 40k ผิดทันที", lang: "txt" },
      { h: "Random forest ทำอะไรต่างออกไป" },
      { code: String.raw`ต้นที่ 1: bootstrap ได้แถว {1,1,3,4,5,7,7,8,9,10}
          ที่รากสุ่มได้แค่ feature "อายุ" → ตัดที่อายุ
ต้นที่ 2: bootstrap ได้แถว {2,3,3,5,6,6,8,9,10,10}
          ที่รากสุ่มได้แค่ "รายได้" → ตัดที่รายได้
ต้นที่ 3: ...

ทำนาย: โหวตจากทุกต้น`,
        cap: "การบังคับให้บางต้นมองไม่เห็น feature ที่แรงที่สุด คือสิ่งที่สร้างความหลากหลาย", lang: "txt" },
      { h: "Gradient boosting รอบที่ 1" },
      { code: String.raw`F₀ = log-odds ของค่าเฉลี่ย = log(6/4) = 0.405
     → ทำนายทุกคนเป็น p = 0.6

residual (สำหรับ log loss) = y − p
  แถว 1-3, 8:  0 − 0.6 = −0.6     ← ทำนายสูงไป
  แถว 4-7,9,10: 1 − 0.6 = +0.4    ← ทำนายต่ำไป

เทรนต้นไม้ตื้น (ลึก 1) ให้ทำนายค่าเหล่านี้`,
        cap: "ต้นแรกไม่ได้ทำนาย 'ซื้อ/ไม่ซื้อ' แต่ทำนาย 'ต้องปรับขึ้นหรือลงเท่าไร'", lang: "txt" },
      { h: "Gradient boosting รอบที่ 2" },
      { code: String.raw`สมมติต้นที่ 1 ตัดที่รายได้ < 39.5 แล้วให้ค่า:
   ซ้าย  −0.6      ขวา  +0.4

F₁ = F₀ + η · tree₁      η = 0.1
   ซ้าย:  0.405 + 0.1(−0.6) = 0.345  → p = 0.585
   ขวา:   0.405 + 0.1(+0.4) = 0.445  → p = 0.609

residual ใหม่เล็กลงเล็กน้อย → ต้นที่ 2 เรียนจากส่วนที่เหลือ`,
        cap: "η เล็กทำให้ขยับทีละนิด ต้องใช้ต้นเยอะ แต่ผลลัพธ์เสถียรกว่าและ overfit ยากกว่า", lang: "txt" },
      { h: "k-means บนข้อมูลชุดเดียวกัน (ทิ้ง label)" },
      { code: String.raw`สเกลก่อน แล้ว k = 2:

รอบที่ 1: สุ่มศูนย์กลางได้ใกล้แถว 2 กับแถว 9
รอบที่ 2: จับกลุ่ม → กลุ่ม A = {1,2,3,8}  กลุ่ม B = {4,5,6,7,9,10}
          ย้ายศูนย์กลางไปค่าเฉลี่ยของแต่ละกลุ่ม
รอบที่ 3: จับกลุ่มใหม่ → ไม่มีใครย้าย → หยุด

silhouette เฉลี่ย = 0.62   ← แยกได้ค่อนข้างชัด`,
        cap: "กลุ่มที่ได้บังเอิญตรงกับ label พอดี แต่ k-means ไม่เคยเห็น label เลย", lang: "txt" }
    ],

    implementation: [
      { p: "โค้ดของทุกตระกูล พร้อมจุดที่มักตั้งค่าผิด" },
      { h: "1) ต้นไม้ตัดสินใจ และการอ่านมันออก" },
      { code: String.raw`from sklearn.tree import DecisionTreeClassifier, export_text, plot_tree

tree = DecisionTreeClassifier(
    max_depth=4,              # ไม่จำกัด = overfit แน่นอน
    min_samples_leaf=20,      # คุมได้ตรงกว่า max_depth ในหลายกรณี
    random_state=42,
).fit(X_tr, y_tr)

print(export_text(tree, feature_names=list(X.columns)))
# |--- income <= 39.50
# |   |--- class: 0
# |--- income >  39.50
# |   |--- class: 1`,
        cap: "`export_text` พิมพ์ต้นไม้เป็นข้อความ — เอาไปแปะในเอกสารหรือให้คนนอกอ่านได้เลย", lang: "python" },
      { h: "2) Random forest ที่ตั้งค่าถูก" },
      { code: String.raw`from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(
    n_estimators=500,         # ยิ่งมากยิ่งดีจนอิ่มตัว ไม่ overfit
    max_features="sqrt",      # √p สำหรับ classification · p/3 สำหรับ regression
    min_samples_leaf=1,
    oob_score=True,           # validation ฟรีจากแถวที่ไม่ได้ใช้
    n_jobs=-1,
    random_state=42,
).fit(X_tr, y_tr)

print("OOB score:", rf.oob_score_)`,
        cap: "`max_features` คือพารามิเตอร์ที่สำคัญที่สุด — มันคุมความหลากหลายซึ่งคือหัวใจของ bagging", lang: "python" },
      { h: "3) Gradient boosting พร้อม early stopping" },
      { code: String.raw`from sklearn.ensemble import HistGradientBoostingClassifier

gb = HistGradientBoostingClassifier(
    learning_rate=0.05,       # ต่ำแล้วให้ early stopping หาจำนวนรอบเอง
    max_iter=2000,            # เพดาน ไม่ใช่จำนวนที่จะใช้จริง
    max_depth=None,
    max_leaf_nodes=31,        # คุมความซับซ้อนได้ตรงกว่า max_depth
    early_stopping=True,
    validation_fraction=0.15,
    n_iter_no_change=50,
    random_state=42,
).fit(X_tr, y_tr)

print("รอบที่ใช้จริง:", gb.n_iter_)`,
        cap: "**ตั้ง max_iter สูงแล้วให้ early stopping ตัดสิน** — นี่คือวิธีที่ถูกต้อง ไม่ใช่การเดาจำนวนรอบ", lang: "python" },
      { h: "4) XGBoost / LightGBM ที่รับ NaN ได้เอง" },
      { code: String.raw`import lightgbm as lgb

model = lgb.LGBMClassifier(
    learning_rate=0.05, n_estimators=2000,
    num_leaves=31, min_child_samples=20,
    subsample=0.8, colsample_bytree=0.8,   # สุ่มแถวและคอลัมน์ = regularize
    random_state=42,
)
model.fit(X_tr, y_tr,
          eval_set=[(X_va, y_va)],
          eval_metric="average_precision",
          callbacks=[lgb.early_stopping(100, verbose=False)])`,
        cap: "`subsample` กับ `colsample_bytree` คือ regularization ที่ได้ผลดีและมักถูกลืม", lang: "python" },
      { h: "5) SVM — ต้องสเกลเสมอ" },
      { code: String.raw`from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

svm = Pipeline([
    ("sc", StandardScaler()),          # ขาดบรรทัดนี้ = ผลแย่ลงอย่างมาก
    ("clf", SVC(kernel="rbf", C=1.0, gamma="scale", probability=True)),
])

# จูน C กับ gamma คู่กันเสมอ
from sklearn.model_selection import GridSearchCV
grid = GridSearchCV(svm, {
    "clf__C":     [0.1, 1, 10, 100],
    "clf__gamma": [1e-3, 1e-2, 1e-1, "scale"],
}, cv=5, scoring="f1", n_jobs=-1).fit(X_tr, y_tr)`,
        cap: "`probability=True` ทำให้ช้าลงมากเพราะต้องทำ Platt scaling ภายใน — เปิดเมื่อจำเป็นเท่านั้น", lang: "python" },
      { h: "6) kNN และผลของ k" },
      { code: String.raw`from sklearn.neighbors import KNeighborsClassifier

for k in [1, 5, 15, 51]:
    knn = Pipeline([("sc", StandardScaler()),
                    ("clf", KNeighborsClassifier(n_neighbors=k, weights="distance"))])
    s = cross_val_score(knn, X, y, cv=5, scoring="f1")
    print(f"k={k:3d}  f1 {s.mean():.3f} ± {s.std():.3f}")

# k=  1  f1 0.712 ± 0.041   ← variance สูง
# k= 15  f1 0.784 ± 0.018   ← สมดุล
# k= 51  f1 0.751 ± 0.015   ← เริ่ม underfit`,
        cap: "`weights='distance'` ให้เพื่อนบ้านที่ใกล้กว่ามีน้ำหนักมากกว่า มักดีกว่าค่าเริ่มต้น", lang: "python" },
      { h: "7) Feature importance ที่เชื่อได้" },
      { code: String.raw`from sklearn.inspection import permutation_importance

r = permutation_importance(model, X_va, y_va,
                           n_repeats=20, scoring="average_precision",
                           random_state=42, n_jobs=-1)

for i in r.importances_mean.argsort()[::-1][:10]:
    print(f"{X.columns[i]:24s} {r.importances_mean[i]:.4f} ± {r.importances_std[i]:.4f}")`,
        cap: "**ทำบน validation ไม่ใช่ train** — บน train จะวัดแค่ว่าโมเดลจำอะไรไว้ ไม่ใช่ว่าอะไรมีประโยชน์จริง", lang: "python" },
      { h: "8) PCA พร้อมการเลือก k" },
      { code: String.raw`from sklearn.decomposition import PCA

pca = Pipeline([("sc", StandardScaler()), ("pca", PCA())]).fit(X)
ratio = pca.named_steps["pca"].explained_variance_ratio_
print(np.cumsum(ratio)[:10])
# [0.42 0.61 0.73 0.81 0.87 0.91 0.94 ...]  → k=6 ได้ 91%

# หรือให้ระบุเป้าหมายตรง ๆ
pca95 = PCA(n_components=0.95).fit(X_scaled)
print("จำนวนแกนที่ต้องใช้:", pca95.n_components_)`,
        cap: "ใส่ทศนิยมใน `n_components` ได้ตรง ๆ แปลว่า 'เอาแกนเท่าที่จำเป็นเพื่อเก็บความแปรปรวนเท่านี้'", lang: "python" },
      { h: "9) k-means และการเลือก k ด้วย silhouette" },
      { code: String.raw`from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

Xs = StandardScaler().fit_transform(X)
for k in range(2, 9):
    km = KMeans(n_clusters=k, n_init=10, random_state=42).fit(Xs)
    print(f"k={k}  inertia {km.inertia_:8.1f}  silhouette {silhouette_score(Xs, km.labels_):.3f}")

# k=2  inertia  4821.3  silhouette 0.412
# k=3  inertia  3915.7  silhouette 0.451   ← สูงสุด
# k=4  inertia  3402.1  silhouette 0.398`,
        cap: "inertia ลดลงเสมอเมื่อ k เพิ่ม จึงใช้ตัดสินเดี่ยว ๆ ไม่ได้ — silhouette มีจุดสูงสุดที่ชัดกว่า", lang: "python" },
      { h: "10) เทียบทุกตระกูลบน fold ชุดเดียวกัน" },
      { code: String.raw`models = {
    "logreg":   Pipeline([("sc", StandardScaler()), ("m", LogisticRegression(max_iter=1000))]),
    "knn":      Pipeline([("sc", StandardScaler()), ("m", KNeighborsClassifier(15))]),
    "tree":     DecisionTreeClassifier(max_depth=5, random_state=42),
    "forest":   RandomForestClassifier(n_estimators=500, n_jobs=-1, random_state=42),
    "boosting": HistGradientBoostingClassifier(random_state=42),
    "svm":      Pipeline([("sc", StandardScaler()), ("m", SVC(probability=True))]),
}
cv = StratifiedKFold(5, shuffle=True, random_state=42)
for name, m in models.items():
    s = cross_val_score(m, X, y, cv=cv, scoring="average_precision", n_jobs=-1)
    print(f"{name:9s} {s.mean():.3f} ± {s.std():.3f}")`,
        cap: "fold ชุดเดียวกันทุกตัว และรายงานส่วนเบี่ยงเบนเสมอ ไม่งั้นความต่างที่เห็นอาจเป็นแค่การแบ่ง", lang: "python" }
    ],

    tricks: [
      { h: "ไล่ปัญหาตามอาการ" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้ยังไง"], rows: [
        ["ต้นไม้ได้ 100% บน train แต่แย่บน test", "ไม่ได้จำกัดความลึก", "`max_depth` · `min_samples_leaf` · `ccp_alpha`"],
        ["random forest ช้าตอนทำนาย", "ต้นเยอะและลึก", "ลด `n_estimators` · จำกัด `max_depth` · หรือเปลี่ยนไป boosting"],
        ["boosting คะแนน validation ตกหลังจากขึ้นสูงสุด", "รอบเยอะเกิน", "**early stopping** ซึ่งจำเป็นเสมอ ไม่ใช่ตัวเลือก"],
        ["SVM ช้ามากหรือค้าง", "แถวเกินหลักหมื่น", "ใช้ `LinearSVC` · `SGDClassifier` · หรือเปลี่ยนตระกูล"],
        ["SVM ผลแย่อย่างน่าประหลาด", "**ลืมสเกล**", "ใส่ StandardScaler เข้า pipeline"],
        ["kNN แย่ทั้งที่ข้อมูลดูง่าย", "ไม่ได้สเกล หรือมิติสูงเกินไป", "สเกล · ลดมิติด้วย PCA ก่อน"],
        ["k-means ได้กลุ่มไม่สมเหตุสมผล", "กลุ่มจริงไม่เป็นทรงกลม", "ลอง DBSCAN หรือ Gaussian mixture"],
        ["feature importance ชี้ไปที่คอลัมน์ id", "impurity importance เอนเอียง", "ใช้ permutation importance บน validation"]
      ]}},
      { h: "จูน gradient boosting ตามลำดับที่ได้ผล" },
      { code: String.raw`1. ตั้ง learning_rate = 0.05 · n_estimators สูงมาก · early stopping เปิด
2. จูนความซับซ้อนของต้น: max_leaf_nodes หรือ max_depth · min_child_samples
3. จูนการสุ่ม: subsample (0.7-1.0) · colsample_bytree (0.6-1.0)
4. จูน regularization: reg_lambda · reg_alpha
5. ท้ายสุดค่อยลด learning_rate เป็น 0.01 แล้วรันยาวขึ้น ถ้าคุ้มเวลา`,
        cap: "จูนตามลำดับนี้ประหยัดเวลากว่า grid search ทุกอย่างพร้อมกันมาก", lang: "txt" },
      { h: "ค่าเริ่มต้นที่ใช้ได้เลยโดยไม่ต้องจูน" },
      { table: { head: ["โมเดล", "ค่าตั้งต้นที่สมเหตุสมผล"], rows: [
        ["**Random forest**", "`n_estimators=500, max_features='sqrt', n_jobs=-1`"],
        ["**LightGBM**", "`learning_rate=0.05, num_leaves=31, n_estimators=2000` + early stopping"],
        ["**kNN**", "`n_neighbors=√n` เป็นจุดเริ่ม แล้วค่อยจูน"],
        ["**SVM RBF**", "`C=1, gamma='scale'` หลังสเกลแล้ว"],
        ["**k-means**", "`n_init=10, init='k-means++'`"]
      ]}},
      { h: "เมื่อไรควรเลือกตระกูลไหน" },
      { table: { head: ["สถานการณ์", "เลือก", "เพราะ"], rows: [
        ["ข้อมูลตารางทั่วไป", "**gradient boosting**", "ชนะบ่อยที่สุด และรับ feature ผสมชนิดได้"],
        ["ต้องอธิบายทุกการตัดสินใจ", "**โมเดลเชิงเส้น หรือต้นไม้ตื้น**", "อ่านออกโดยตรง"],
        ["ข้อมูลน้อยมาก (< 500 แถว)", "**โมเดลเชิงเส้น หรือ naive Bayes**", "โมเดลซับซ้อนจะ overfit แน่นอน"],
        ["feature มากกว่าแถว (เช่นข้อความ)", "**SVM เชิงเส้น หรือ naive Bayes**", "ออกแบบมาให้ทนมิติสูง"],
        ["ต้องทำนายเร็วมากใน production", "**โมเดลเชิงเส้น**", "คูณเมทริกซ์ครั้งเดียวจบ"],
        ["ต้องการกลุ่มโดยไม่มี label", "**k-means หรือ DBSCAN**", "แล้วแต่ว่ากลุ่มเป็นทรงกลมหรือไม่"]
      ]}},
      { h: "ข้อผิดพลาดที่พบบ่อยที่สุด" },
      { ul: [
        "**สเกลข้อมูลให้ต้นไม้** — ไม่ผิดแต่เสียเวลาเปล่า เพราะต้นไม้ใช้แค่ลำดับ",
        "**ลืมสเกลให้ SVM หรือ kNN** — ผิดจริงและทำให้ผลแย่ลงมาก",
        "**ใช้ boosting โดยไม่มี early stopping** แล้วสงสัยว่าทำไม overfit",
        "**เชื่อ feature importance ของต้นไม้** โดยไม่รู้ว่ามันเอนเอียงเข้าหา feature ที่มีค่าไม่ซ้ำเยอะ",
        "**เลือก k ของ k-means จาก elbow เพียงอย่างเดียว** ทั้งที่มักกำกวม",
        "**ทำ PCA โดยไม่สเกล** แล้วแกนแรกกลายเป็น feature ที่หน่วยใหญ่ที่สุดเฉย ๆ",
        "**stacking ด้วย in-fold prediction** ซึ่งรั่วแน่นอน"
      ]},
      { note: "**ข้อสุดท้ายที่มักถูกมองข้าม**: `n_estimators` ของ random forest ยิ่งมากยิ่งดีจนอิ่มตัว ไม่ทำให้ overfit — ต่างจาก boosting ที่ยิ่งมากยิ่ง overfit ได้ สองอย่างนี้ตรงข้ามกันและคนสับสนกันบ่อย" }
    ],

    eval: [
      { p: "คำถามที่ใช้แยกคนที่เข้าใจกลไกออกจากคนที่จำชื่อโมเดล" },
      { qa: [
        { q: "bagging กับ boosting ต่างกันยังไงในหนึ่งประโยค",
          a: "bagging ลด variance ด้วยการเฉลี่ยโมเดลที่เป็นอิสระต่อกัน ส่วน boosting ลด bias ด้วยการแก้ความผิดพลาดต่อกันเป็นทอด ๆ — จึงเป็นเหตุผลที่ forest ใช้ต้นไม้ลึกแต่ boosting ใช้ต้นไม้ตื้น" },
        { q: "ทำไม random forest ถึงต้องสุ่ม feature ที่แต่ละ node ไม่ใช่แค่ bootstrap",
          a: "เพราะถ้ามี feature ที่แรงมากตัวหนึ่ง ทุกต้นจะเลือกมันเป็นรากเหมือนกันหมด ต้นไม้จะสัมพันธ์กันสูง และการเฉลี่ยของสิ่งที่สัมพันธ์กันไม่ลด variance — การบังคับให้บางต้นมองไม่เห็นจึงเป็นหัวใจ" },
        { q: "ทำไม boosting ถึงใช้ต้นไม้ตื้น",
          a: "ต้นไม้ตื้นมี bias สูงและ variance ต่ำ ซึ่งเป็นสิ่งที่ boosting ตั้งใจแก้ ถ้าใช้ต้นไม้ลึก รอบแรกจะจำข้อมูลได้หมดจนไม่เหลือ residual ให้รอบถัดไป และ overfit ทันที" },
        { q: "ทำไมต้นไม้ไม่ต้องสเกล feature",
          a: "เพราะมันใช้แค่ลำดับ ไม่ใช่ระยะทาง — เงื่อนไข `รายได้ < 40000` ให้ผลเหมือนกันไม่ว่าจะวัดหน่วยไหน การแปลงแบบ monotonic ใด ๆ ไม่เปลี่ยนต้นไม้ที่ได้เลย" },
        { q: "gini กับ entropy ต่างกันยังไง เลือกตัวไหน",
          a: "ทั้งคู่เป็นศูนย์เมื่อ node บริสุทธิ์และสูงสุดเมื่อผสมเท่ากัน entropy ลงโทษ node ที่ผสมมากหนักกว่านิดหน่อยและช้ากว่าเพราะต้องคำนวณ log แต่เลือกจุดตัดเหมือนกันเกือบทุกครั้ง — ใช้ gini เป็นค่าเริ่มต้นได้" },
        { q: "information gain คำนวณยังไง ทำไมต้องถ่วงน้ำหนัก",
          a: "`impurity(พ่อ) − Σ (nᵢ/n)·impurity(ลูก)` การถ่วงน้ำหนักตามจำนวนตัวอย่างจำเป็น เพราะการตัดให้ได้ node บริสุทธิ์ที่มีแค่ตัวอย่างเดียวไม่ได้ช่วยอะไร" },
        { q: "out-of-bag score คืออะไร มาจากไหน",
          a: "bootstrap สุ่ม n ตัวแบบใส่คืน ทำให้ราว 37% ของแถวไม่ถูกเลือกในต้นนั้น (`(1−1/n)ⁿ → 1/e`) จึงใช้แถวเหล่านั้นวัดผลได้ฟรีโดยไม่ต้องแบ่ง validation แยก" },
        { q: "C ของ SVM ทำอะไร",
          a: "เป็นราคาของการยอมให้ผิด — C น้อยแปลว่ายอมให้ผิดได้ margin จึงกว้างและ regularize แรง ส่วน C มากพยายามถูกทุกจุดจน margin แคบและ overfit ได้" },
        { q: "gamma ของ RBF kernel ทำอะไร",
          a: "คุมว่าอิทธิพลของหนึ่งจุดแผ่ไปไกลแค่ไหน gamma น้อยแผ่ไกลทำให้ขอบเขตเรียบ gamma มากแผ่แคบทำให้ขอบเขตหยักตามจุดแต่ละจุดจน overfit — ต้องจูนคู่กับ C เสมอ" },
        { q: "kernel trick คืออะไรจริง ๆ",
          a: "อัลกอริทึมของ SVM ใช้แค่ inner product ระหว่างจุด จึงแทนที่ `φ(a)·φ(b)` ด้วยฟังก์ชัน `K(a,b)` ที่ให้ค่าเดียวกันได้โดยไม่ต้องสร้าง `φ` ขึ้นมาจริง — RBF เทียบเท่ามิติอนันต์แต่ไม่เคยสร้างเวกเตอร์นั้นเลย" },
        { q: "naive Bayes สมมติอะไร และทำไมยังใช้ได้ทั้งที่สมมติฐานผิด",
          a: "สมมติว่า feature อิสระต่อกันเมื่อรู้คลาสแล้ว ซึ่งมักไม่จริง แต่การจัดอันดับคลาสยังถูกแม้ค่าความน่าจะเป็นจะเพี้ยน จึงจำแนกได้ดีแต่ calibrate แย่มาก และไม่ควรเอาความน่าจะเป็นไปคูณกับเงิน" },
        { q: "kNN มีขั้นตอนเทรนไหม",
          a: "ไม่มี มันเก็บข้อมูลทั้งชุดไว้แล้วคำนวณตอนถูกถาม เรียกว่า lazy learner ต้นทุนจึงอยู่ที่การทำนายและโตตามขนาดข้อมูล" },
        { q: "k ของ kNN มีผลยังไง",
          a: "k=1 มี variance สูงมากเพราะจำ noise ทุกจุด k ที่ใหญ่ขึ้นทำให้เรียบขึ้นและ bias สูงขึ้น จนถึง k=n ที่ทำนายเป็น majority class เหมือนกันหมด" },
        { q: "PCA ต้องทำอะไรก่อนเสมอ",
          a: "หักค่าเฉลี่ยออกเป็นข้อบังคับ และต้องสเกลด้วยเมื่อหน่วยของ feature ต่างกัน ไม่งั้น feature ที่มีตัวเลขใหญ่จะครองแกนแรกไปโดยอัตโนมัติ" },
        { q: "เลือกจำนวนแกนของ PCA ยังไง",
          a: "ดูความแปรปรวนสะสมจาก `explained_variance_ratio_` แล้วเลือก k ที่สะสมถึงราว 90-95% หรือใส่ทศนิยมลงใน `n_components` ให้ sklearn เลือกให้ตรง ๆ" },
        { q: "k-means สมมติอะไร และแพ้เมื่อไร",
          a: "สมมติว่ากลุ่มเป็นทรงกลมขนาดใกล้เคียงกัน เพราะมันลดผลรวมระยะกำลังสองภายในกลุ่ม จึงหากลุ่มรูปพระจันทร์เสี้ยวหรือกลุ่มที่ขนาดต่างกันมากไม่เจอ — กรณีนั้นใช้ DBSCAN หรือ Gaussian mixture" },
        { q: "เลือก k ของ k-means ยังไงให้มีหลักฐาน",
          a: "elbow plot มักกำกวมเพราะ inertia ลดลงเสมอ ให้ใช้ silhouette score ซึ่งมีจุดสูงสุดชัดกว่า และให้น้ำหนักกับความรู้ในโดเมนว่าธุรกิจต้องการกี่กลุ่มจริง ๆ" },
        { q: "feature importance ของต้นไม้เชื่อได้ไหม",
          a: "impurity importance เอนเอียงเข้าหา feature ที่มีค่าไม่ซ้ำเยอะ เช่นคอลัมน์ id — ทดสอบได้โดยใส่คอลัมน์สุ่มเข้าไปแล้วดูว่ามันติดอันดับกลาง ๆ ให้ใช้ permutation importance บน validation แทน" },
        { q: "ทำไม permutation importance ต้องทำบน validation ไม่ใช่ train",
          a: "เพราะบน train มันวัดว่าโมเดลจำอะไรไว้ ไม่ใช่ว่า feature นั้นมีประโยชน์ในการทำนายข้อมูลใหม่จริงหรือไม่" },
        { q: "เพิ่มจำนวนต้นแล้ว forest กับ boosting ต่างกันยังไง",
          a: "forest ยิ่งมากยิ่งดีจนอิ่มตัวและแทบไม่ overfit เพราะเป็นการเฉลี่ย ส่วน boosting ยิ่งมากยิ่ง overfit ได้เพราะแต่ละต้นแก้ residual ต่อกันเรื่อย ๆ จึงต้องมี early stopping เสมอ" }
      ]},
      { h: "อ่านเพิ่ม" },
      { links: [
        { label: "scikit-learn — Decision Trees", url: "https://scikit-learn.org/stable/modules/tree.html", note: "สูตร impurity การตัดแต่ง และข้อจำกัดของต้นไม้ตามเอกสารทางการ" },
        { label: "scikit-learn — Ensemble methods", url: "https://scikit-learn.org/stable/modules/ensemble.html", note: "bagging, forest, boosting และ stacking พร้อมพารามิเตอร์ทุกตัว" },
        { label: "scikit-learn — Permutation importance", url: "https://scikit-learn.org/stable/modules/permutation_importance.html", note: "อธิบายตรง ๆ ว่าทำไม impurity importance ถึงเอนเอียง พร้อมตัวอย่าง" },
        { label: "XGBoost — Introduction to Boosted Trees", url: "https://xgboost.readthedocs.io/en/stable/tutorials/model.html", note: "อนุมาน gradient boosting จากฟังก์ชันเป้าหมายอย่างเป็นทางการ" },
        { label: "LightGBM — Parameters Tuning", url: "https://lightgbm.readthedocs.io/en/stable/Parameters-Tuning.html", note: "ลำดับการจูนที่ผู้พัฒนาแนะนำเอง" },
        { label: "An Introduction to Statistical Learning — บทที่ 8-9, 12", url: "https://www.statlearning.com/", note: "ต้นไม้ ensemble SVM และ unsupervised learning อ่านฟรี" },
        { label: "scikit-learn — Clustering", url: "https://scikit-learn.org/stable/modules/clustering.html", note: "เปรียบเทียบอัลกอริทึมจัดกลุ่มทุกตัวด้วยภาพว่าตัวไหนหากลุ่มรูปแบบไหนได้" },
        { label: "Wikipedia — Kernel method", url: "https://en.wikipedia.org/wiki/Kernel_method", note: "ที่มาเชิงคณิตศาสตร์ของ kernel trick และเงื่อนไขของ Mercer" }
      ]}
    ]
  }
});

window.TEACHING_EN = window.TEACHING_EN || {};
window.TEACHING_EN["ml_classic"] = {
  principle: [
    { h: "Why you need to know several families" },
    { p: "**Because each family assumes a different shape for the data** — linear models assume the relationship is a straight line, kNN assumes nearby things are alike, trees assume you can carve the space into rectangular boxes. Pick the wrong family and no amount of tuning rescues you." },
    { p: "And **on tabular data, gradient boosting still beats neural networks today** — not because it is old-fashioned but because the structure of tabular data fits trees better." },
    { h: "The map of all of it" },
    { table: { head: ["Family", "Core assumption", "Strong when", "Loses when"], rows: [
      ["**Linear**", "The relationship is a straight line", "Little data · you must explain it", "Curved relationships or many interactions"],
      ["**kNN**", "Nearby points are similar", "Complex boundary, modest data", "High dimensions · big data · unscaled"],
      ["**Trees**", "The space can be cut into boxes", "Mixed feature types · no scaling needed", "Diagonal boundaries · a single tree is unstable"],
      ["**Random forest**", "Many trees that differ enough", "A safe default that needs little tuning", "Slow to predict · large model files"],
      ["**Gradient boosting**", "Fix the errors a little at a time", "**Most tabular data**", "Needs tuning · overfits if left alone"],
      ["**SVM**", "A widest possible margin separates them", "High dimensions with few rows · text", "Beyond tens of thousands of rows"],
      ["**Naive Bayes**", "Features are independent given the class", "Text · very little data · extreme speed", "Strongly correlated features"]
    ]}},
    { h: "The one sentence that separates bagging from boosting" },
    { note: "**Bagging cuts variance by averaging models that are independent of each other; boosting cuts bias by correcting the errors of the previous model in sequence.** Hold on to that sentence and you will understand why a random forest uses deep trees while boosting uses shallow ones." },
    { h: "Supervised against unsupervised on this page" },
    { table: { head: ["", "Needs labels", "Answers the question"], rows: [
      ["kNN · trees · forest · boosting · SVM · naive Bayes", "**Yes**", "Which class does this new example belong to, or what value does it take"],
      ["**PCA**", "No", "How few axes can I keep and how much information survives"],
      ["**k-means**", "No", "Does this data fall into natural groups, and how many"]
    ]}},
    { h: "What this page will let you do" },
    { ul: [
      "Grow a decision tree by hand from a ten-row table and know exactly how it picked each split",
      "Explain why a random forest uses deep trees while boosting uses shallow ones",
      "Know what `C` and `gamma` do in an SVM, and what goes wrong when you push them the wrong way",
      "Choose k for k-means from evidence rather than from feeling",
      "Know where tree feature importance lies to you and what to use instead"
    ]}
  ],

  theory: [
    { p: "This section derives each family, focusing on the assumption and the mechanism rather than a list of parameters." },
    { h: "1) kNN — the model that never trains" },
    { code: String.raw`To predict a new x:
  1. find the k nearest neighbours
  2. classification -> vote · regression -> average

There is no "training" step at all — all the work happens at prediction time`,
      cap: "This is called a lazy learner: it keeps the whole dataset and only thinks when asked", lang: "txt" },
    { table: { head: ["k", "What you get"], rows: [
      ["k = 1", "**Very high variance** — it memorises every piece of noise and the boundary is jagged"],
      ["larger k", "Smoother, higher bias, lower variance"],
      ["k = n", "Every prediction is identical: the majority class"]
    ]}},
    { p: "**You must always scale the features** because this is pure distance — income measured in whole currency units will drown out age entirely if you do not. And **high dimensions destroy kNN directly**, because every point starts to sit at roughly the same distance from every other." },
    { h: "2) Decision trees — asking one question at a time" },
    { code: String.raw`         age < 30 ?
        /          \
      yes           no
       |             |
  income < 40k ?   predict: buys
    /       \
  buys    does not`,
      cap: "Each node asks a single question about a single feature, which is exactly why a tree is readable", lang: "txt" },
    { p: "**How it picks a question**: it tries every feature at every split point and keeps the one that **reduces impurity the most**. That is a greedy algorithm — it makes the locally best decision without ever looking ahead." },
    { h: "3) Gini and entropy — measuring impurity" },
    { code: String.raw`Gini    = 1 − Σ pᵢ²
Entropy = −Σ pᵢ log₂ pᵢ

a 50/50 node:   Gini = 1 − (0.25+0.25) = 0.5    Entropy = 1.0
a 100/0 node:   Gini = 1 − 1 = 0                Entropy = 0
a 90/10 node:   Gini = 1 − (0.81+0.01) = 0.18   Entropy = 0.47`,
      cap: "Both hit zero when the node is pure and peak when the classes are evenly mixed", lang: "txt" },
    { note: "**The two pick the same split almost every time.** Entropy punishes heavily mixed nodes slightly harder and is slower because of the logarithm. In practice gini is a fine default." },
    { h: "4) Information gain — the splitting criterion" },
    { code: String.raw`gain = impurity(parent) − Σ (nᵢ/n) · impurity(child i)
                              ‾‾‾‾‾‾
                              weighted by how many samples land there

pick the split with the highest gain`,
      cap: "The weighting matters — carving off a pure node holding a single sample buys you nothing", lang: "txt" },
    { h: "5) Why trees do not need scaling" },
    { p: "Because they use **order**, not distance. The question `income < 40000` gives exactly the same partition whether you measure in units or thousands, and **any monotonic transform leaves the resulting tree unchanged**." },
    { p: "**This is a structural difference from linear models and kNN**, both of which are very sensitive to scale." },
    { h: "6) What is wrong with a single tree" },
    { table: { head: ["Problem", "How it shows up"], rows: [
      ["**Very high variance**", "Change a handful of rows and the whole tree structure changes"],
      ["**Overfits trivially**", "Left unbounded in depth it will reach 100% training accuracy every single time"],
      ["**Staircase boundaries**", "It can only cut parallel to the axes, so a diagonal has to be approximated by many steps"]
    ]}},
    { p: "**There are two fixes and they go in opposite directions** — which is exactly where random forests and gradient boosting come from." },
    { h: "7) Random forest — bagging" },
    { code: String.raw`build B trees, for each one:
   1. bootstrap: draw n rows with replacement (about 63% of rows appear)
   2. at each node: sample only m of the p features, and split within those
   3. let it grow to full depth, no pruning

predict: vote (classification) or average (regression)`,
      cap: "Sampling features at each node is what actually makes the trees differ, not the bootstrap alone", lang: "txt" },
    { p: "**Why sample features too**: if one feature is very strong, every tree will pick it as the root and all the trees end up alike. **Averaging correlated things does not reduce variance**, so forcing some trees to be blind to it is the whole point." },
    { code: String.raw`Var(average of B) = ρσ² + (1−ρ)σ²/B
                    ‾‾‾‾
                    this term never vanishes, even as B -> ∞

ρ = correlation between trees -> must be pushed down`,
      cap: "This is the equation that says diversity matters more than the number of trees", lang: "txt" },
    { h: "8) Gradient boosting — the other direction" },
    { code: String.raw`F₀(x) = a starting value (for instance the mean of y)

repeat M times:
   1. compute the residual: rᵢ = yᵢ − F(xᵢ)      <- what is still wrong
   2. fit a shallow tree to predict that residual
   3. F(x) <- F(x) + η · tree(x)                  η = learning rate

predict: add up the contribution of every tree`,
      cap: "No individual tree predicts y — each predicts what the ensemble so far is still getting wrong", lang: "txt" },
    { table: { head: ["", "Random forest", "Gradient boosting"], rows: [
      ["Each tree", "**Deep** (low bias, high variance)", "**Shallow** (high bias, low variance)"],
      ["How they are built", "Independently, fully parallel", "**Sequentially**, only within-tree parallelism"],
      ["What it reduces", "**Variance**, by averaging", "**Bias**, by correcting a little at a time"],
      ["Adding more trees", "Barely overfits", "**Can overfit** — needs early stopping"],
      ["Tuning required", "Little", "A lot, especially learning rate and depth"],
      ["Result on tabular data", "Good", "**Usually better**"]
    ]}},
    { note: "**Why boosting uses shallow trees**: a shallow tree has high bias, which is precisely what boosting exists to fix. Start with deep trees and the very first round already memorises the data, leaving no residual for the next round to learn from — and it overfits immediately." },
    { h: "9) SVM — the widest margin" },
    { code: String.raw`find the hyperplane as far as possible from the closest point on either side

    o   o        |‾‾‾|        x   x
      o     o    |   |    x     x
         o   ●===|===|===●   x        ● = support vector
                 |___|
                 margin

points that are not support vectors have no influence on the answer at all`,
      cap: "Delete as many far-away points as you like and the boundary does not move, as long as the support vectors survive", lang: "txt" },
    { table: { head: ["Parameter", "Small value", "Large value"], rows: [
      ["**C**", "Wide margin, tolerates mistakes — strong regularisation", "Narrow margin, tries to get every point right — **can overfit**"],
      ["**gamma** (RBF)", "One point's influence reaches far — smooth boundary", "Influence is local — jagged boundary, **overfits**"]
    ]}},
    { h: "10) The kernel trick — computing in high dimensions without going there" },
    { code: String.raw`problem: the data is not linearly separable in the original space
usual answer: map it to a higher space φ(x) and separate there — expensive or infinite

kernel trick: the algorithm only ever uses the inner product φ(a)·φ(b)
              and there is a K(a,b) giving that value without ever building φ

RBF:  K(a,b) = exp(−γ‖a−b‖²)     <- equivalent to infinitely many dimensions`,
      cap: "The high-dimensional vector is never constructed even once — the result is computed directly", lang: "txt" },
    { h: "11) Naive Bayes — an assumption that is wrong but works" },
    { code: String.raw`P(class | features) ∝ P(class) · Π P(featureᵢ | class)
                                     ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
                                     assumed independent — usually false

but the ranking of classes stays right even when the probabilities are distorted`,
      cap: "So it classifies well while being badly calibrated — never multiply its probabilities by money", lang: "txt" },
    { h: "12) PCA — dropping dimensions while losing the least variance" },
    { code: String.raw`1. subtract the mean (mandatory), and usually scale as well
2. compute the covariance matrix
3. find the eigenvectors and eigenvalues
4. sort by eigenvalue descending, keep the first k
5. project the data onto the new axes`,
      cap: "The new axes are the directions of greatest spread, and every pair of them is orthogonal", lang: "txt" },
    { p: "**Always scale first when the units differ**, otherwise whichever feature carries the biggest numbers automatically owns the first component. And **the new axes are no longer interpretable**, because each is a weighted sum of every original feature." },
    { h: "13) k-means — grouping by distance" },
    { code: String.raw`1. place k centroids (k-means++ places them more sensibly)
2. repeat until nothing moves:
     a. assign each point to its nearest centroid
     b. move each centroid to the mean of its own group`,
      cap: "It minimises the sum of squared distances within groups, which is why it assumes roughly spherical, similarly sized clusters", lang: "txt" },
    { table: { head: ["Limitation", "Consequence"], rows: [
      ["You must state k in advance", "Use an elbow plot or the silhouette score to choose"],
      ["Assumes spherical clusters", "It will never find crescent-shaped groups — use DBSCAN instead"],
      ["Depends on the starting points", "Run it several times and keep the best (`n_init`)"],
      ["Sensitive to scale", "Always scale first"]
    ]}}
  ],

  foundations: [
    { p: "This section digs into the mechanics that decide how each family behaves." },
    { h: "Growing a tree one node at a time — the actual arithmetic" },
    { code: String.raw`10 rows: 6 buy · 4 do not

Gini at the root = 1 − (0.6² + 0.4²) = 1 − 0.52 = 0.48

try splitting on "age < 30":
  left  (4 rows): 1 buy, 3 do not -> Gini = 1 − (0.25² + 0.75²) = 0.375
  right (6 rows): 5 buy, 1 does not -> Gini = 1 − (0.833² + 0.167²) = 0.278

weighted Gini = (4/10)(0.375) + (6/10)(0.278) = 0.317
gain = 0.48 − 0.317 = 0.163`,
      cap: "Do this for every feature at every split point and keep the largest gain — that is the whole of tree building", lang: "txt" },
    { h: "How many split points really have to be tried" },
    { code: String.raw`a continuous feature with v distinct values -> v−1 candidate splits
   (the midpoints between consecutive sorted values)

p features × n rows -> O(p · n log n) per node, including the sort`,
      cap: "This is why LightGBM bins values into a histogram — it drops n candidates down to 255 buckets", lang: "txt" },
    { h: "Controlling how far a tree grows" },
    { table: { head: ["Parameter", "What it does", "Values worth trying"], rows: [
      ["`max_depth`", "How many levels deep", "single tree 3-10 · boosting 3-8"],
      ["`min_samples_split`", "How many samples a node needs before it may split", "2-20"],
      ["`min_samples_leaf`", "The minimum samples in a leaf", "**Often a more direct control than max_depth**"],
      ["`max_leaf_nodes`", "Caps the total number of leaves", "A more flexible alternative to capping depth"],
      ["`ccp_alpha`", "Prunes after the tree is grown (cost-complexity)", "Find it by cross-validation"]
    ]}},
    { h: "Out-of-bag — the random forest's free validation set" },
    { code: String.raw`a bootstrap draws n rows with replacement from n rows
   -> the chance a given row is never drawn = (1 − 1/n)ⁿ -> 1/e ≈ 0.368

-> about 37% of rows are absent from any given tree: they are out-of-bag
-> score on those rows without ever holding out a separate validation set`,
      cap: "That is where sklearn's oob_score_ comes from — it saves data when you have little of it", lang: "txt" },
    { h: "Where tree feature importance lies to you" },
    { table: { head: ["Method", "Computed from", "The problem"], rows: [
      ["**Gini / impurity importance**", "Total gain attributed to that feature across all nodes", "**Biased towards features with many distinct values**, such as an id or any continuous column"],
      ["**Permutation importance**", "Shuffle the feature's values and see how far the score drops", "Slower, but **far more trustworthy** · still misleading when features are correlated"],
      ["**SHAP**", "Game theory — each feature's share of a single prediction", "The slowest, but gives both the global picture and per-example attributions"]
    ]}},
    { note: "**Never make an important decision on impurity importance.** Add a purely random column to your data and it will usually land mid-table, which is proof enough that the measure is biased. Use permutation importance on the validation set instead." },
    { h: "SVM — from intuition to the optimisation problem" },
    { code: String.raw`hard margin (perfectly separable):
   minimize ½‖w‖²   subject to  yᵢ(wᵀxᵢ + b) ≥ 1 for all i

soft margin (the real world):
   minimize ½‖w‖² + C Σ ξᵢ    where ξᵢ = how far a point intrudes into the margin

margin = 2/‖w‖   -> shrinking ‖w‖ widens the margin`,
      cap: "C is the price of a mistake — set it high and mistakes are expensive, so it contorts itself to avoid them and overfits", lang: "txt" },
    { h: "Choosing k for k-means from evidence" },
    { table: { head: ["Method", "What you look at", "Note"], rows: [
      ["**Elbow**", "Inertia (sum of squared distances) against k", "Look for the bend — **often ambiguous**"],
      ["**Silhouette**", "How well each point fits its own group (−1 to 1)", "**Clearer than the elbow** · close to 1 is good"],
      ["**Domain knowledge**", "How many groups the business actually wants", "**Frequently the best answer of the three**"]
    ]}},
    { code: String.raw`silhouette for point i:
   a = mean distance to the other points in its own cluster
   b = mean distance to the points of the nearest other cluster
   s = (b − a) / max(a, b)

s near 1    clearly in the right cluster
s near 0    sitting on a border
s negative  probably in the wrong cluster`,
      cap: "Computed per point and then averaged, so you get both the summary and a list of suspicious points", lang: "txt" },
    { h: "How PCA picks k" },
    { code: String.raw`explained_variance_ratio_ = [0.62, 0.21, 0.09, 0.05, 0.03]
cumulative                = [0.62, 0.83, 0.92, 0.97, 1.00]

take the k that reaches 90-95% -> k = 3 or 4`,
      cap: "There is no magic number — it depends on how much information you can afford to lose for the dimensions you gain", lang: "txt" }
  ],

  architecture: [
    { p: "This section is about choosing and tuning each family in a sensible order." },
    { h: "An order that works in practice" },
    { code: String.raw`1. baseline (majority / mean)
2. logistic or linear regression         <- if it is close enough, stop
3. random forest with defaults           <- does non-linear structure help at all?
4. gradient boosting, tuned              <- the usual winner on tabular data
5. an ensemble or a neural network       <- only when it genuinely pays`,
      cap: "Step 3 costs five minutes and answers the important question: does non-linearity matter here", lang: "txt" },
    { h: "The parameters that actually matter for each model" },
    { table: { head: ["Model", "Tune this first", "Then these"], rows: [
      ["**kNN**", "`n_neighbors`", "`weights='distance'` · `metric`"],
      ["**Decision tree**", "`max_depth`", "`min_samples_leaf` · `ccp_alpha`"],
      ["**Random forest**", "`max_features`", "`min_samples_leaf` · `n_estimators` (more is better until it saturates)"],
      ["**Gradient boosting**", "`learning_rate` with `n_estimators` (**as a pair**)", "`max_depth` · `subsample` · `min_child_weight`"],
      ["**SVM (RBF)**", "`C` and `gamma` (**must be tuned together**)", "`class_weight`"],
      ["**k-means**", "`n_clusters`", "`n_init` · `init='k-means++'`"]
    ]}},
    { note: "**Boosting's learning rate and tree count trade against each other directly** — halve the learning rate and you need roughly twice as many trees. What people actually do is fix a low learning rate (0.05) and let early stopping discover the tree count." },
    { h: "Pipeline shape per family" },
    { code: String.raw`must be scaled:      kNN · SVM · PCA · k-means · regularised linear models
does not need it:    decision tree · random forest · gradient boosting

needs one-hot:       linear models · kNN · SVM · neural networks
handles it natively: LightGBM and CatBoost take categoricals directly`,
      cap: "Remember these two lines and you will stop wasting time scaling data for trees", lang: "txt" },
    { h: "Handling missing values" },
    { table: { head: ["Model", "Takes NaN directly?", "If not, what to do"], rows: [
      ["**XGBoost / LightGBM**", "**Yes** — it learns which way to send a NaN", "—"],
      ["**HistGradientBoosting** (sklearn)", "**Yes**", "—"],
      ["Random forest (sklearn)", "No", "Impute with the median, or add an `is_missing` column"],
      ["Linear models · kNN · SVM", "No", "Always impute, and fit the imputer on training data only"]
    ]}},
    { p: "**Adding an `is_missing` column works surprisingly often**, because the fact that a value is absent is frequently a signal in itself — a customer who declines to state their income may well behave differently from one who states it." },
    { h: "Ensembles of ensembles" },
    { table: { head: ["Method", "How", "When it pays"], rows: [
      ["**Voting**", "Vote across models from different families", "When the models make different kinds of mistake"],
      ["**Stacking**", "Feed the first layer's predictions as features to a second model", "Competitions · leaks easily, needs out-of-fold predictions"],
      ["**Fixed-weight blending**", "A weighted average with weights found on validation", "Simpler and safer than stacking"]
    ]}},
    { note: "**Stacking leaks very easily.** The first-layer features must be built from out-of-fold predictions only. If you feed it predictions a model made on data it trained on, the second layer learns from unrealistically good inputs and collapses in production." }
  ],

  dataflow: [
    { p: "This section grows a tree by hand from start to finish, then walks one boosting round so the difference is visible." },
    { h: "The example data" },
    { code: String.raw`predicting whether a customer buys

  #   age   income(k)   buys
  1    22      25         0
  2    25      32         0
  3    28      38         0
  4    31      45         1
  5    35      52         1
  6    38      41         1
  7    42      78         1
  8    45      35         0
  9    48      85         1
 10    52      92         1

totals: 6 buy · 4 do not`,
      cap: "Ten rows, two features — small enough to do by hand, with a pattern that is not entirely clean (row 8 goes against the trend)", lang: "txt" },
    { h: "The Gini of the root" },
    { code: String.raw`p(buys) = 6/10 = 0.6    p(does not) = 4/10 = 0.4

Gini = 1 − (0.6² + 0.4²) = 1 − (0.36 + 0.16) = 0.48`,
      cap: "0.48 is close to the two-class maximum of 0.5, meaning it is still heavily mixed", lang: "txt" },
    { h: "Trying a split on age" },
    { code: String.raw`split at age < 29.5  (the midpoint between 28 and 31)
  left  3 rows: 0 buy, 3 do not -> Gini = 1 − (0² + 1²) = 0     <- pure
  right 7 rows: 6 buy, 1 does not -> Gini = 1 − (0.857² + 0.143²) = 0.245

weighted = (3/10)(0) + (7/10)(0.245) = 0.171
gain = 0.48 − 0.171 = 0.309`,
      cap: "A large gain, because the left side came out perfectly pure", lang: "txt" },
    { h: "Trying a split on income for comparison" },
    { code: String.raw`split at income < 39.5
  left  4 rows (25,32,38,35): 0 buy, 4 do not -> Gini = 0
  right 6 rows:               6 buy, 0 do not -> Gini = 0

weighted = 0
gain = 0.48 − 0 = 0.48        <- higher!`,
      cap: "Income separates this dataset perfectly, so the tree takes it as the root", lang: "txt" },
    { note: "**And this is exactly where to be careful.** A single feature separating ten rows perfectly is usually a coincidence rather than a real pattern. A tree with no depth limit will believe a pattern like that every single time — which is overfitting in its purest form." },
    { h: "The resulting tree" },
    { code: String.raw`         income < 39.5 ?
        /               \
      yes                no
       |                  |
   does not buy (4/4)   buys (6/6)

depth 1 · two leaves · training accuracy 100%`,
      cap: "A tree that is 100% right on the training data and will misclassify the very next customer earning 40k", lang: "txt" },
    { h: "What a random forest does differently" },
    { code: String.raw`tree 1: bootstrap draws rows {1,1,3,4,5,7,7,8,9,10}
        at the root only the feature "age" is available -> splits on age
tree 2: bootstrap draws rows {2,3,3,5,6,6,8,9,10,10}
        at the root only "income" is available -> splits on income
tree 3: ...

predict: vote across all the trees`,
      cap: "Forcing some trees to be blind to the strongest feature is what creates the diversity", lang: "txt" },
    { h: "Gradient boosting, round 1" },
    { code: String.raw`F₀ = the log-odds of the base rate = log(6/4) = 0.405
     -> everyone is predicted at p = 0.6

residual (for log loss) = y − p
  rows 1-3, 8:   0 − 0.6 = −0.6     <- predicted too high
  rows 4-7,9,10: 1 − 0.6 = +0.4     <- predicted too low

fit a shallow tree (depth 1) to predict those values`,
      cap: "The first tree does not predict buy or not-buy — it predicts how far up or down the score should move", lang: "txt" },
    { h: "Gradient boosting, round 2" },
    { code: String.raw`suppose tree 1 split at income < 39.5 and outputs:
   left  −0.6      right  +0.4

F₁ = F₀ + η · tree₁      η = 0.1
   left:   0.405 + 0.1(−0.6) = 0.345  -> p = 0.585
   right:  0.405 + 0.1(+0.4) = 0.445  -> p = 0.609

the new residuals are slightly smaller -> tree 2 learns from what is left`,
      cap: "A small η moves in tiny steps and so needs many trees, but the result is steadier and much harder to overfit", lang: "txt" },
    { h: "k-means on the same data with the labels thrown away" },
    { code: String.raw`scale first, then k = 2:

pass 1: the initial centroids land near row 2 and row 9
pass 2: assign -> group A = {1,2,3,8}  group B = {4,5,6,7,9,10}
        move each centroid to its group's mean
pass 3: reassign -> nobody moves -> stop

mean silhouette = 0.62   <- reasonably well separated`,
      cap: "The groups happen to match the labels exactly, and k-means never saw a single label", lang: "txt" }
  ],

  implementation: [
    { p: "Code for every family, together with the settings people most often get wrong." },
    { h: "1) A decision tree, and reading it" },
    { code: String.raw`from sklearn.tree import DecisionTreeClassifier, export_text, plot_tree

tree = DecisionTreeClassifier(
    max_depth=4,              # unbounded means guaranteed overfitting
    min_samples_leaf=20,      # often a more direct control than max_depth
    random_state=42,
).fit(X_tr, y_tr)

print(export_text(tree, feature_names=list(X.columns)))
# |--- income <= 39.50
# |   |--- class: 0
# |--- income >  39.50
# |   |--- class: 1`,
      cap: "`export_text` prints the tree as plain text — drop it straight into a document or hand it to a non-technical reader", lang: "python" },
    { h: "2) A correctly configured random forest" },
    { code: String.raw`from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(
    n_estimators=500,         # more is better until it saturates; it does not overfit
    max_features="sqrt",      # √p for classification · p/3 for regression
    min_samples_leaf=1,
    oob_score=True,           # free validation from the rows each tree never saw
    n_jobs=-1,
    random_state=42,
).fit(X_tr, y_tr)

print("OOB score:", rf.oob_score_)`,
      cap: "`max_features` is the single most important parameter — it controls diversity, which is the whole point of bagging", lang: "python" },
    { h: "3) Gradient boosting with early stopping" },
    { code: String.raw`from sklearn.ensemble import HistGradientBoostingClassifier

gb = HistGradientBoostingClassifier(
    learning_rate=0.05,       # keep it low and let early stopping find the round count
    max_iter=2000,            # a ceiling, not the number actually used
    max_depth=None,
    max_leaf_nodes=31,        # a more direct complexity control than max_depth
    early_stopping=True,
    validation_fraction=0.15,
    n_iter_no_change=50,
    random_state=42,
).fit(X_tr, y_tr)

print("rounds actually used:", gb.n_iter_)`,
      cap: "**Set max_iter high and let early stopping decide** — that is the correct approach, not guessing the round count", lang: "python" },
    { h: "4) XGBoost / LightGBM, which handle NaN themselves" },
    { code: String.raw`import lightgbm as lgb

model = lgb.LGBMClassifier(
    learning_rate=0.05, n_estimators=2000,
    num_leaves=31, min_child_samples=20,
    subsample=0.8, colsample_bytree=0.8,   # row and column sampling = regularisation
    random_state=42,
)
model.fit(X_tr, y_tr,
          eval_set=[(X_va, y_va)],
          eval_metric="average_precision",
          callbacks=[lgb.early_stopping(100, verbose=False)])`,
      cap: "`subsample` and `colsample_bytree` are effective regularisers that people routinely forget", lang: "python" },
    { h: "5) SVM — always scaled" },
    { code: String.raw`from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

svm = Pipeline([
    ("sc", StandardScaler()),          # leave this line out and the result degrades badly
    ("clf", SVC(kernel="rbf", C=1.0, gamma="scale", probability=True)),
])

# always tune C and gamma together
from sklearn.model_selection import GridSearchCV
grid = GridSearchCV(svm, {
    "clf__C":     [0.1, 1, 10, 100],
    "clf__gamma": [1e-3, 1e-2, 1e-1, "scale"],
}, cv=5, scoring="f1", n_jobs=-1).fit(X_tr, y_tr)`,
      cap: "`probability=True` is much slower because it runs Platt scaling internally — enable it only when you need it", lang: "python" },
    { h: "6) kNN and the effect of k" },
    { code: String.raw`from sklearn.neighbors import KNeighborsClassifier

for k in [1, 5, 15, 51]:
    knn = Pipeline([("sc", StandardScaler()),
                    ("clf", KNeighborsClassifier(n_neighbors=k, weights="distance"))])
    s = cross_val_score(knn, X, y, cv=5, scoring="f1")
    print(f"k={k:3d}  f1 {s.mean():.3f} ± {s.std():.3f}")

# k=  1  f1 0.712 ± 0.041   <- high variance
# k= 15  f1 0.784 ± 0.018   <- balanced
# k= 51  f1 0.751 ± 0.015   <- starting to underfit`,
      cap: "`weights='distance'` gives closer neighbours more say, which usually beats the default", lang: "python" },
    { h: "7) Feature importance you can trust" },
    { code: String.raw`from sklearn.inspection import permutation_importance

r = permutation_importance(model, X_va, y_va,
                           n_repeats=20, scoring="average_precision",
                           random_state=42, n_jobs=-1)

for i in r.importances_mean.argsort()[::-1][:10]:
    print(f"{X.columns[i]:24s} {r.importances_mean[i]:.4f} ± {r.importances_std[i]:.4f}")`,
      cap: "**Run it on validation, not on training** — on training it only measures what the model memorised, not what genuinely helps", lang: "python" },
    { h: "8) PCA and choosing k" },
    { code: String.raw`from sklearn.decomposition import PCA

pca = Pipeline([("sc", StandardScaler()), ("pca", PCA())]).fit(X)
ratio = pca.named_steps["pca"].explained_variance_ratio_
print(np.cumsum(ratio)[:10])
# [0.42 0.61 0.73 0.81 0.87 0.91 0.94 ...]  -> k=6 reaches 91%

# or simply state the target directly
pca95 = PCA(n_components=0.95).fit(X_scaled)
print("components needed:", pca95.n_components_)`,
      cap: "A float in `n_components` means \"take as many axes as it takes to keep this much variance\"", lang: "python" },
    { h: "9) k-means and choosing k by silhouette" },
    { code: String.raw`from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

Xs = StandardScaler().fit_transform(X)
for k in range(2, 9):
    km = KMeans(n_clusters=k, n_init=10, random_state=42).fit(Xs)
    print(f"k={k}  inertia {km.inertia_:8.1f}  silhouette {silhouette_score(Xs, km.labels_):.3f}")

# k=2  inertia  4821.3  silhouette 0.412
# k=3  inertia  3915.7  silhouette 0.451   <- the peak
# k=4  inertia  3402.1  silhouette 0.398`,
      cap: "Inertia always falls as k rises, so it cannot decide anything alone — the silhouette has a much clearer peak", lang: "python" },
    { h: "10) Comparing every family on identical folds" },
    { code: String.raw`models = {
    "logreg":   Pipeline([("sc", StandardScaler()), ("m", LogisticRegression(max_iter=1000))]),
    "knn":      Pipeline([("sc", StandardScaler()), ("m", KNeighborsClassifier(15))]),
    "tree":     DecisionTreeClassifier(max_depth=5, random_state=42),
    "forest":   RandomForestClassifier(n_estimators=500, n_jobs=-1, random_state=42),
    "boosting": HistGradientBoostingClassifier(random_state=42),
    "svm":      Pipeline([("sc", StandardScaler()), ("m", SVC(probability=True))]),
}
cv = StratifiedKFold(5, shuffle=True, random_state=42)
for name, m in models.items():
    s = cross_val_score(m, X, y, cv=cv, scoring="average_precision", n_jobs=-1)
    print(f"{name:9s} {s.mean():.3f} ± {s.std():.3f}")`,
      cap: "Identical folds for every model, and always report the deviation, or the gap you see may just be the split", lang: "python" }
  ],

  tricks: [
    { h: "Diagnosing by symptom" },
    { table: { head: ["Symptom", "Cause", "Fix"], rows: [
      ["A tree scores 100% on train and badly on test", "No depth limit", "`max_depth` · `min_samples_leaf` · `ccp_alpha`"],
      ["The random forest is slow to predict", "Many deep trees", "Fewer `n_estimators` · cap `max_depth` · or switch to boosting"],
      ["Boosting validation score peaks then declines", "Too many rounds", "**Early stopping**, which is always required rather than optional"],
      ["The SVM is extremely slow or hangs", "More than tens of thousands of rows", "Use `LinearSVC` · `SGDClassifier` · or change family"],
      ["The SVM does surprisingly badly", "**Forgot to scale**", "Put a StandardScaler in the pipeline"],
      ["kNN is poor on data that looks easy", "Unscaled, or too many dimensions", "Scale it · reduce dimensions with PCA first"],
      ["k-means groups make no sense", "The real clusters are not spherical", "Try DBSCAN or a Gaussian mixture"],
      ["Feature importance points at the id column", "Impurity importance is biased", "Use permutation importance on validation"]
    ]}},
    { h: "Tuning gradient boosting in an order that works" },
    { code: String.raw`1. set learning_rate = 0.05 · n_estimators very high · early stopping on
2. tune tree complexity: max_leaf_nodes or max_depth · min_child_samples
3. tune the sampling: subsample (0.7-1.0) · colsample_bytree (0.6-1.0)
4. tune regularisation: reg_lambda · reg_alpha
5. only at the end drop learning_rate to 0.01 and run longer, if the time is worth it`,
      cap: "Following this order is far cheaper than grid-searching everything at once", lang: "txt" },
    { h: "Defaults you can ship without tuning" },
    { table: { head: ["Model", "A sensible starting point"], rows: [
      ["**Random forest**", "`n_estimators=500, max_features='sqrt', n_jobs=-1`"],
      ["**LightGBM**", "`learning_rate=0.05, num_leaves=31, n_estimators=2000` plus early stopping"],
      ["**kNN**", "`n_neighbors=√n` as a starting point, then tune"],
      ["**SVM RBF**", "`C=1, gamma='scale'` once scaled"],
      ["**k-means**", "`n_init=10, init='k-means++'`"]
    ]}},
    { h: "Which family to reach for" },
    { table: { head: ["Situation", "Choose", "Because"], rows: [
      ["Ordinary tabular data", "**Gradient boosting**", "It wins most often and copes with mixed feature types"],
      ["Every decision must be explainable", "**A linear model or a shallow tree**", "It reads directly"],
      ["Very little data (under 500 rows)", "**A linear model or naive Bayes**", "Anything complex will certainly overfit"],
      ["More features than rows, such as text", "**Linear SVM or naive Bayes**", "Both are built to survive high dimensions"],
      ["Prediction must be extremely fast in production", "**A linear model**", "One matrix multiply and it is done"],
      ["You need groups and have no labels", "**k-means or DBSCAN**", "Depending on whether the clusters are spherical"]
    ]}},
    { h: "The most common mistakes" },
    { ul: [
      "**Scaling data for a tree** — not wrong, just wasted effort, since a tree only uses order",
      "**Forgetting to scale for SVM or kNN** — genuinely wrong, and it degrades the result badly",
      "**Running boosting without early stopping** and then wondering why it overfits",
      "**Trusting tree feature importance** without knowing it is biased towards features with many distinct values",
      "**Choosing k for k-means from the elbow alone**, when the elbow is usually ambiguous",
      "**Running PCA without scaling**, so the first component becomes whichever feature has the largest units",
      "**Stacking on in-fold predictions**, which leaks by construction"
    ]},
    { note: "**One last thing that gets overlooked**: more trees in a random forest is better until it saturates and does not cause overfitting, whereas more rounds of boosting genuinely can overfit. These two behave in opposite ways and people mix them up constantly." }
  ],

  eval: [
    { p: "The questions that separate someone who understands the mechanism from someone who has memorised model names." },
    { qa: [
      { q: "In one sentence, how do bagging and boosting differ?",
        a: "Bagging cuts variance by averaging models that are independent of each other, while boosting cuts bias by correcting the previous model's errors in sequence — which is exactly why forests use deep trees and boosting uses shallow ones." },
      { q: "Why does a random forest sample features at each node rather than only bootstrapping rows?",
        a: "Because if one feature is very strong, every tree picks it as the root and the trees end up highly correlated. Averaging correlated things does not reduce variance, so forcing some trees to be blind to it is the essential ingredient." },
      { q: "Why does boosting use shallow trees?",
        a: "A shallow tree has high bias and low variance, and high bias is exactly what boosting exists to correct. With deep trees the first round already memorises the data, leaving no residual for the next round, and it overfits immediately." },
      { q: "Why do trees not need scaled features?",
        a: "They use order, not distance — the condition `income < 40000` gives the same partition in any unit, and no monotonic transform changes the resulting tree at all." },
      { q: "How do gini and entropy differ, and which should you pick?",
        a: "Both are zero for a pure node and maximal when the classes are evenly mixed. Entropy punishes heavily mixed nodes slightly harder and is slower because of the logarithm, but they choose the same split almost every time — gini is a fine default." },
      { q: "How is information gain computed, and why is it weighted?",
        a: "`impurity(parent) − Σ (nᵢ/n)·impurity(child)`. Weighting by sample count is necessary because carving off a pure node containing a single sample achieves nothing." },
      { q: "What is an out-of-bag score and where does it come from?",
        a: "A bootstrap draws n rows with replacement, so about 37% of rows are missing from each tree (`(1−1/n)ⁿ → 1/e`). Scoring on those rows gives free validation without holding out a separate set." },
      { q: "What does C do in an SVM?",
        a: "It is the price of a mistake — a small C tolerates errors, giving a wide margin and strong regularisation, while a large C tries to get every point right, narrowing the margin and risking overfitting." },
      { q: "What does gamma do in an RBF kernel?",
        a: "It controls how far one point's influence reaches. Small gamma reaches far and gives a smooth boundary; large gamma is local and makes the boundary follow individual points until it overfits — it must always be tuned together with C." },
      { q: "What is the kernel trick, really?",
        a: "The SVM algorithm only ever uses inner products between points, so `φ(a)·φ(b)` can be replaced by a function `K(a,b)` returning the same value without ever constructing `φ` — the RBF kernel corresponds to infinitely many dimensions, none of which are ever built." },
      { q: "What does naive Bayes assume, and why does it work despite the assumption being false?",
        a: "It assumes features are independent given the class, which is usually untrue. But the ranking of classes stays correct even when the probabilities are distorted, so it classifies well while being badly calibrated — never multiply its probabilities by money." },
      { q: "Does kNN have a training step?",
        a: "No. It stores the entire dataset and computes only when asked, which is why it is called a lazy learner and why its cost sits at prediction time and grows with the data." },
      { q: "What effect does k have in kNN?",
        a: "k=1 has very high variance because it memorises every piece of noise; larger k smooths the boundary and raises bias, up to k=n where every prediction is the majority class." },
      { q: "What must always happen before PCA?",
        a: "Subtracting the mean is mandatory, and scaling is required whenever the features have different units — otherwise whichever feature carries the biggest numbers automatically owns the first component." },
      { q: "How do you choose the number of PCA components?",
        a: "Look at the cumulative `explained_variance_ratio_` and take the k that reaches roughly 90-95%, or pass a float to `n_components` and let sklearn pick it directly." },
      { q: "What does k-means assume, and when does it lose?",
        a: "It assumes clusters are spherical and of similar size, because it minimises within-cluster squared distance. It will never find crescent shapes or clusters of wildly different sizes — for those, use DBSCAN or a Gaussian mixture." },
      { q: "How do you choose k for k-means with evidence behind it?",
        a: "The elbow plot is often ambiguous because inertia always falls, so use the silhouette score, which has a clearer peak, and give real weight to domain knowledge about how many groups the business actually wants." },
      { q: "Can you trust a tree's feature importance?",
        a: "Impurity importance is biased towards features with many distinct values, such as an id column — you can demonstrate this by adding a random column and watching it land mid-table. Use permutation importance on validation instead." },
      { q: "Why must permutation importance be run on validation rather than training data?",
        a: "Because on training data it measures what the model memorised, not whether the feature genuinely helps predict data the model has not seen." },
      { q: "How do a forest and boosting differ as you add more trees?",
        a: "A forest keeps improving until it saturates and barely overfits, because it is an average. Boosting can overfit as trees accumulate, because each one keeps fitting the remaining residual — which is why early stopping is always required." }
    ]},
    { h: "Further reading" },
    { links: [
      { label: "scikit-learn — Decision Trees", url: "https://scikit-learn.org/stable/modules/tree.html", note: "The impurity formulas, pruning, and the documented limitations of trees" },
      { label: "scikit-learn — Ensemble methods", url: "https://scikit-learn.org/stable/modules/ensemble.html", note: "Bagging, forests, boosting and stacking with every parameter explained" },
      { label: "scikit-learn — Permutation importance", url: "https://scikit-learn.org/stable/modules/permutation_importance.html", note: "States outright why impurity importance is biased, with a worked example" },
      { label: "XGBoost — Introduction to Boosted Trees", url: "https://xgboost.readthedocs.io/en/stable/tutorials/model.html", note: "Derives gradient boosting formally from the objective function" },
      { label: "LightGBM — Parameters Tuning", url: "https://lightgbm.readthedocs.io/en/stable/Parameters-Tuning.html", note: "The tuning order recommended by the authors themselves" },
      { label: "An Introduction to Statistical Learning — chapters 8-9 and 12", url: "https://www.statlearning.com/", note: "Trees, ensembles, SVMs and unsupervised learning, free to read" },
      { label: "scikit-learn — Clustering", url: "https://scikit-learn.org/stable/modules/clustering.html", note: "Compares every clustering algorithm visually, showing which shapes each can find" },
      { label: "Wikipedia — Kernel method", url: "https://en.wikipedia.org/wiki/Kernel_method", note: "The mathematical origin of the kernel trick and Mercer's condition" }
    ]}
  ]
};
