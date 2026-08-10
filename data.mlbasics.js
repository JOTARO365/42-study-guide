/* ML Basics — เวิร์กโฟลว์ การแบ่งข้อมูล bias-variance และ metric ทุกตัว */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

window.TEACHING_DATA.push({
  id: "ml_basics",
  name: "พื้นฐาน ML — การแบ่งข้อมูล bias-variance และการวัดผล",
  nameEn: "ML Foundations — Splits, Bias-Variance and Metrics",
  titleShort: { th: "พื้นฐาน ML", en: "ML Foundations" },
  tag: {
    th: "ส่วนที่ตัดสินความสำเร็จของงาน ML จริง ๆ ไม่ใช่ตัวโมเดล — แบ่งข้อมูลยังไงไม่ให้โกงตัวเอง, อ่านช่องว่าง train/validation ให้ออก, และรู้ว่า metric แต่ละตัวโกหกตรงไหน",
    en: "What actually decides whether an ML project works, and it is not the model — splitting data without fooling yourself, reading the train/validation gap, and knowing exactly where each metric lies"
  },
  accent: "#34d399",
  sections: {
    principle: [
      { h: "ความจริงที่ไม่ค่อยมีใครบอก" },
      { p: "**คุณค่าส่วนใหญ่ของงาน supervised learning มาจากการแบ่งข้อมูล การเลือก metric และการทำ feature** — การเลือกตระกูลโมเดลเป็นการตัดสินใจสุดท้ายและมักมีผลน้อยที่สุด" },
      { p: "หน้านี้จึงไม่ได้เริ่มที่โมเดล แต่เริ่มที่ **โครงที่ทำให้ตัวเลขที่วัดได้เชื่อถือได้** เพราะโมเดลที่ดีบนตัวเลขที่โกหก ก็คือโมเดลที่พังตอนขึ้นงานจริง" },
      { h: "สามคำถามที่ต้องตอบก่อนเขียนโค้ดบรรทัดแรก" },
      { table: { head: ["คำถาม", "ถ้าตอบผิดจะเกิดอะไร"], rows: [
        ["**แบ่งข้อมูลยังไง**", "ตัวเลขดูดีเกินจริง แล้วตกม้าตายตอน production"],
        ["**วัดด้วยอะไร**", "โมเดลเก่งในสิ่งที่ไม่มีใครต้องการ — accuracy 99% บนข้อมูลที่มี positive 1%"],
        ["**feature ที่ใช้ มีอยู่จริงตอนทำนายไหม**", "data leakage — คะแนนสวยงามที่ทำซ้ำไม่ได้เลย"]
      ]}},
      { h: "ประเภทของการเรียนรู้" },
      { table: { head: ["ประเภท", "ข้อมูลที่ต้องมี", "ตัวอย่าง"], rows: [
        ["**Supervised**", "มี label ที่ถูกต้อง", "ทำนายราคาบ้าน · จำแนกอีเมลสแปม"],
        ["**Unsupervised**", "ไม่มี label", "จัดกลุ่มลูกค้า · ลดมิติด้วย PCA · หา anomaly"],
        ["**Semi-supervised**", "มี label น้อย ไม่มี label เยอะ", "ติด label 1000 รูป แล้วใช้อีก 100000 รูปที่ไม่มี label ช่วย"],
        ["**Reinforcement**", "รางวัลจากสิ่งแวดล้อม ไม่ใช่ label", "เกม · หุ่นยนต์ · การจัดสรรทรัพยากร"]
      ]}},
      { p: "**และแยกอีกแกนหนึ่ง**: `regression` ทำนายตัวเลขต่อเนื่อง (ราคา, อุณหภูมิ) ส่วน `classification` ทำนายหมวด (สแปม/ไม่สแปม) — สองอันนี้ใช้ loss คนละตัวและ metric คนละชุด" },
      { h: "เส้นทางของงาน ML หนึ่งงาน" },
      { code: String.raw`ตั้งคำถามให้ชัด  →  หาข้อมูล  →  แบ่ง train/val/test
                                          ↓
                                    สร้าง feature
                                          ↓
                          baseline (majority / mean)  ← ต้องผ่านก่อน
                                          ↓
                            โมเดลง่าย (linear/logistic)
                                          ↓
                          โมเดลแรง (gradient boosting)
                                          ↓
                     วัดบน test ครั้งเดียว  →  deploy  →  เฝ้าดู drift`,
        cap: "ลูกศรย้อนกลับได้ทุกจุด ยกเว้นขั้น test ที่แตะได้ครั้งเดียว", lang: "txt" },
      { note: "**Baseline ไม่ใช่พิธีกรรม** — ถ้าโมเดลชนะ baseline ไม่ได้ แปลว่ามีบั๊ก ไม่ใช่ปัญหายาก และการรู้ตั้งแต่วันแรกประหยัดเวลาได้เป็นสัปดาห์" },
      { h: "หน้านี้จะทำให้ทำได้" },
      { ul: [
        "แบ่งข้อมูลได้ถูกต้องสำหรับข้อมูลแต่ละชนิด รวม time series และข้อมูลที่จัดกลุ่ม",
        "อ่านช่องว่าง train/validation แล้วบอกได้ทันทีว่าเป็น bias หรือ variance และต้องทำอะไรต่อ",
        "เลือก metric ให้ตรงกับต้นทุนของความผิดพลาดจริง ไม่ใช่ตามที่คนอื่นใช้",
        "จับ data leakage ได้ก่อนที่มันจะทำให้เสียเวลาไปทั้งสัปดาห์",
        "รู้ว่าเมื่อไรควรหยุด — โมเดลที่ดีพอแล้วไม่ต้องดีขึ้นอีก"
      ]}
    ],

    theory: [
      { p: "หมวดนี้คือแนวคิดที่ต้องแม่นก่อนแตะโมเดล — ทุกข้อมีผลกับตัวเลขที่จะได้" },
      { h: "1) ทำไมต้องแบ่งสามส่วน ไม่ใช่สอง" },
      { code: String.raw`train      60-80%    ใช้ปรับพารามิเตอร์ของโมเดล
validation           ใช้เลือก hyperparameter · เทียบโมเดล · ตัดสินใจว่าจะหยุดเมื่อไร
test       10-20%    แตะได้ครั้งเดียว ตอนจบเท่านั้น`,
        cap: "สามกอง สามหน้าที่ ห้ามสลับ", lang: "txt" },
      { p: "**ทุกครั้งที่ดู test set แล้วเปลี่ยนอะไรสักอย่าง คือการ fit เข้ากับ test นิดหนึ่ง** ทำแบบนี้ยี่สิบครั้ง คะแนน test ก็มองในแง่ดีเกินจริงไปแล้ว และเราจะไม่เหลือตัวประเมินที่ซื่อสัตย์อีกเลย — **test set เป็นเครื่องมือแบบใช้ครั้งเดียว**" },
      { h: "2) Cross-validation — เมื่อข้อมูลน้อยเกินกว่าจะแบ่งสามกอง" },
      { code: String.raw`5-fold CV:
  fold 1: [test][ train  ][ train ][ train ][ train ]
  fold 2: [train][ test  ][ train ][ train ][ train ]
  ...
  → ได้คะแนน 5 ตัว → รายงานค่าเฉลี่ย ± ส่วนเบี่ยงเบน`,
        cap: "ทุกตัวอย่างได้เป็น validation หนึ่งครั้ง จึงใช้ข้อมูลคุ้มกว่าการแบ่งครั้งเดียว", lang: "txt" },
      { p: "**ส่วนเบี่ยงเบนสำคัญพอ ๆ กับค่าเฉลี่ย** — โมเดลที่ได้ `0.85 ± 0.01` กับโมเดลที่ได้ `0.85 ± 0.12` เป็นคนละเรื่องกันโดยสิ้นเชิง ตัวหลังแปลว่าผลขึ้นกับว่าบังเอิญแบ่งยังไง" },
      { h: "3) การแบ่งที่ห้ามสุ่ม" },
      { table: { head: ["ข้อมูลแบบ", "ต้องแบ่งยังไง", "ถ้าสุ่มจะเกิดอะไร"], rows: [
        ["**Time series**", "แบ่งตามเวลา เทรนบนอดีตเท่านั้น", "โมเดลเห็นอนาคต — คะแนนสวยแต่ใช้จริงไม่ได้"],
        ["**จัดกลุ่ม** (หลายแถวต่อผู้ใช้)", "แบ่งตามกลุ่ม", "ผู้ใช้คนเดียวกันอยู่ทั้ง train และ test = จำได้ ไม่ใช่ทำนายได้"],
        ["**ไม่สมดุลรุนแรง**", "stratified", "บาง fold อาจไม่มี positive เลย"]
      ]}},
      { note: "**Time series คือกรณีที่คนพลาดมากที่สุด** — `train_test_split(shuffle=True)` บนข้อมูลราคาหุ้นทำให้โมเดลเรียนจากวันพรุ่งนี้เพื่อทำนายวันนี้ ผลที่ได้จะดูมหัศจรรย์และไร้ค่าโดยสมบูรณ์" },
      { h: "4) Bias และ variance" },
      { code: String.raw`ความคลาดเคลื่อนที่คาดหวัง = bias² + variance + noise ที่ลดไม่ได้

bias สูง (underfit)    โมเดลง่ายเกินกว่าจะจับรูปแบบได้
variance สูง (overfit)  โมเดลจำข้อมูลเทรนไปแล้ว`,
        cap: "noise ที่ลดไม่ได้คือเพดาน — ไม่มีโมเดลไหนข้ามได้ ต่อให้ข้อมูลมากแค่ไหน", lang: "txt" },
      { table: { head: ["", "train error", "validation error", "ต้องทำอะไร"], rows: [
        ["**underfit**", "สูง", "สูงพอ ๆ กัน", "โมเดลใหญ่ขึ้น · feature มากขึ้น · ลด regularization · เทรนนานขึ้น"],
        ["**overfit**", "ต่ำมาก", "**สูงกว่ามาก**", "ข้อมูลมากขึ้น · regularization · โมเดลเล็กลง · early stopping"],
        ["**พอดี**", "ต่ำ", "ต่ำใกล้เคียงกัน", "หยุด"]
      ]}},
      { p: "**อ่านช่องว่าง ไม่ใช่อ่านตัวเลข**: train 0.99 / val 0.72 คือ variance · train 0.68 / val 0.67 คือ bias — การเทียบสองตัวนี้ครั้งเดียวตัดสินว่าจะทำอะไรต่อ และเป็นสิ่งแรกที่ควรดูเสมอ" },
      { h: "5) เมื่อ validation ดีกว่า train" },
      { p: "ไม่ใช่โชคดี แต่เป็นสัญญาณ — สาเหตุที่พบบ่อยเรียงตามความน่าจะเป็น: **dropout กับ regularizer ทำงานตอนเทรนแต่ปิดตอนวัด** (ปกติ ไม่ใช่บั๊ก) · validation set บังเอิญง่ายกว่า (แบ่งใหม่ให้ stratified) · **มีอะไรรั่ว** (ตรวจทันที)" },
      { h: "6) Regularization — แลก bias เล็กน้อยเพื่อลด variance มาก" },
      { table: { head: ["วิธี", "ทำอะไร", "ผลข้างเคียง"], rows: [
        ["**L2 (ridge)**", "บีบสัมประสิทธิ์ให้เล็กลงอย่างนุ่มนวล", "ไม่มีตัวไหนเป็นศูนย์"],
        ["**L1 (lasso)**", "ดันสัมประสิทธิ์ให้เป็นศูนย์พอดี", "**เลือก feature ให้ในตัว**"],
        ["**Elastic net**", "ผสมทั้งสอง", "ต้องจูนสองพารามิเตอร์"],
        ["**Early stopping**", "หยุดเมื่อ validation เริ่มแย่ลง", "ฟรี ไม่ต้องจูนอะไร"],
        ["**Data augmentation**", "เพิ่มข้อมูลเทียมที่ยังถูกต้อง", "ต้องรู้ว่าการแปลงแบบไหนไม่เปลี่ยน label"]
      ]}},
      { h: "7) Curse of dimensionality" },
      { p: "ยิ่งมิติเยอะ ข้อมูลยิ่งกระจายห่างกันจนทุกจุด **เท่ากันหมด** — ระยะทางเลิกมีความหมาย ซึ่งทำลาย kNN และ k-means โดยตรง และทำให้ต้องใช้ข้อมูลมากขึ้นแบบเลขชี้กำลังเพื่อครอบคลุมพื้นที่เท่าเดิม" },
      { code: String.raw`ครอบคลุม 10% ของช่วงในแต่ละมิติ:
  1 มิติ  → ต้องใช้ 10% ของข้อมูล
  10 มิติ → ต้องใช้ 0.1^10 = 1 ใน 10,000,000,000 ของช่วง ... เป็นไปไม่ได้`,
        cap: "นี่คือเหตุผลที่ต้องลดมิติ เลือก feature หรือใช้โมเดลที่ทนมิติสูง", lang: "txt" },
      { h: "8) ข้อมูลไม่สมดุล" },
      { table: { head: ["วิธี", "ทำอะไร", "ข้อควรระวัง"], rows: [
        ["**เปลี่ยน metric**", "เลิกใช้ accuracy ใช้ PR-AUC หรือ recall", "**ทำก่อนเสมอ** และบ่อยครั้งพอแล้ว"],
        ["**class weight**", "ให้ค่าความผิดของคลาสน้อยแพงขึ้น", "รองรับในเกือบทุกไลบรารี ทำง่ายที่สุด"],
        ["**oversample / SMOTE**", "สร้างตัวอย่างคลาสน้อยเพิ่ม", "**ต้องทำหลังแบ่ง train/test เท่านั้น** ไม่งั้นรั่ว"],
        ["**undersample**", "ตัดคลาสมากออก", "ทิ้งข้อมูลจริงไป ใช้เมื่อข้อมูลเยอะมากเท่านั้น"],
        ["**ขยับ threshold**", "เปลี่ยนจุดตัด 0.5 เป็นค่าอื่น", "ฟรี และมักได้ผลดีกว่าการ resample"]
      ]}},
      { note: "**SMOTE ก่อนแบ่งข้อมูล = รั่วทันที** เพราะตัวอย่างสังเคราะห์ถูกสร้างจากจุดที่จะไปอยู่ใน test — เป็นบั๊กที่ทำให้คะแนนพุ่งอย่างน่าตื่นเต้นแล้วพังใน production" }
    ],

    foundations: [
      { p: "หมวดนี้เจาะ metric — เพราะเลือกผิดตัวเดียวทำให้ทั้งโปรเจกต์เดินผิดทาง" },
      { h: "Confusion matrix — จุดเริ่มต้นที่ซื่อสัตย์" },
      { code: String.raw`                 ทำนาย +      ทำนาย −
   จริง +          TP           FN      ← พลาด (miss)
   จริง −          FP           TN      ← เตือนผิด (false alarm)`,
        cap: "ทุก metric ของ classification คำนวณจากสี่ช่องนี้ทั้งหมด", lang: "txt" },
      { h: "metric แต่ละตัว และคำถามที่มันตอบ" },
      { table: { head: ["Metric", "สูตร", "ตอบคำถามว่า", "ใช้เมื่อ"], rows: [
        ["Accuracy", "`(TP+TN)/ทั้งหมด`", "ทายถูกกี่เปอร์เซ็นต์", "**คลาสสมดุลเท่านั้น**"],
        ["Precision", "`TP/(TP+FP)`", "ที่เตือนไป ถูกกี่อัน", "เตือนผิดแล้วแพง"],
        ["Recall", "`TP/(TP+FN)`", "ของจริงที่มี จับได้กี่อัน", "พลาดแล้วแพง"],
        ["F1", "`2PR/(P+R)`", "สมดุลของสองตัวบน", "ต้องการเลขเดียว"],
        ["ROC-AUC", "พื้นที่ใต้ TPR/FPR", "จัดอันดับได้ดีแค่ไหน", "คลาสสมดุลพอควร"],
        ["**PR-AUC**", "พื้นที่ใต้ precision/recall", "จัดอันดับคลาสบวกได้ดีแค่ไหน", "**ไม่สมดุลรุนแรง**"],
        ["Log loss", "`−Σ y log ŷ`", "**ความน่าจะเป็น** ดีแค่ไหน", "จะเอาความน่าจะเป็นไปใช้ต่อ"]
      ]}},
      { h: "ทำไม accuracy ถึงโกหกบนข้อมูลไม่สมดุล" },
      { code: String.raw`ข้อมูล 10000 แถว · มีโรคจริง 100 คน (1%)

โมเดลที่ทายว่า "ไม่เป็น" ทุกคน:
   accuracy  = 9900/10000 = 99%      ← ดูดีมาก
   recall    = 0/100      = 0%       ← จับคนป่วยไม่ได้เลยสักคน
   precision = ไม่นิยาม (ไม่เคยเตือน)`,
        cap: "99% ที่ไร้ประโยชน์โดยสมบูรณ์ — นี่คือเหตุผลที่ต้องดู confusion matrix ก่อนเสมอ", lang: "txt" },
      { h: "ROC-AUC เทียบ PR-AUC" },
      { p: "**ROC-AUC มองโลกในแง่ดีเกินไปเมื่อข้อมูลไม่สมดุลหนัก** เพราะ `FPR = FP/(FP+TN)` และเมื่อ `TN` มหาศาล ตัวส่วนก็ใหญ่จน FPR ต่ำเสมอไม่ว่าจะทำนายแย่แค่ไหน ส่วน PR-AUC ไม่ใช้ `TN` เลย จึงไม่โดนหลอก" },
      { code: String.raw`positive 1%  ·  โมเดลเตือน 200 ครั้ง ถูก 50 ครั้ง

FPR = 150/9900 = 1.5%       → ROC ดูดีมาก
precision = 50/200 = 25%    → ความจริงคือเตือนผิด 3 ใน 4`,
        cap: "ตัวเลขชุดเดียวกัน สองมุมมอง — เลือกมุมที่ตรงกับต้นทุนจริง", lang: "txt" },
      { h: "Threshold — สิ่งที่คนลืมว่าปรับได้" },
      { p: "**precision กับ recall แลกกันผ่าน threshold ไม่ใช่ผ่านโมเดล** โมเดลตัวเดียวให้ได้ทั้งคู่ แค่เปลี่ยนจุดตัด — จึงต้องรายงานเป็นเส้นโค้ง และเลือกจุดจากต้นทุนของความผิดพลาดแต่ละแบบ" },
      { code: String.raw`threshold 0.9  →  เตือนน้อย · precision สูง · recall ต่ำ
threshold 0.5  →  ค่าเริ่มต้นที่ไม่มีใครพิสูจน์ว่าเหมาะ
threshold 0.2  →  เตือนเยอะ · recall สูง · precision ต่ำ`,
        cap: "0.5 เป็นแค่ค่าเริ่มต้นของไลบรารี ไม่ใช่ค่าที่ถูกต้องสำหรับปัญหาของเรา", lang: "txt" },
      { h: "Calibration — ความน่าจะเป็นที่เชื่อได้จริงหรือเปล่า" },
      { p: "ถ้าโมเดลบอก 0.8 แล้วในความเป็นจริงถูกแค่ 60% แปลว่ามัน **มั่นใจเกินจริง** — ตัวเลขนั้นเอาไปคูณกับเงินหรือความเสี่ยงไม่ได้ ต้องตรวจด้วย reliability curve และแก้ด้วย Platt scaling หรือ isotonic regression ที่ fit บนข้อมูลที่กันไว้ต่างหาก" },
      { code: String.raw`reliability curve:
  แบ่งการทำนายเป็นถัง 0.0-0.1, 0.1-0.2, ...
  แต่ละถัง: ความน่าจะเป็นเฉลี่ยที่ทำนาย  vs  สัดส่วนที่ถูกจริง
  เส้นทแยงมุม = calibrate สมบูรณ์`,
        cap: "โค้งอยู่ใต้เส้นทแยง = มั่นใจเกินจริง · อยู่เหนือ = ถ่อมตัวเกินจริง", lang: "txt" },
      { note: "**โมเดลที่จัดอันดับเก่งอาจ calibrate แย่ และกลับกันก็ได้** — ROC-AUC วัดการจัดอันดับ ส่วน log loss กับ Brier score วัด calibration ถ้าจะเอาความน่าจะเป็นไปตัดสินใจ ต้องดูตัวหลัง" },
      { h: "metric ของ regression" },
      { table: { head: ["Metric", "สูตร", "ลักษณะ"], rows: [
        ["**MSE**", "`mean((y−ŷ)²)`", "ลงโทษความผิดพลาดใหญ่หนักมาก · หน่วยเป็นกำลังสอง"],
        ["**RMSE**", "`√MSE`", "หน่วยเดียวกับ y จึงอ่านง่ายกว่า"],
        ["**MAE**", "`mean(|y−ŷ|)`", "**ทนต่อ outlier** · มาจากสมมติฐาน Laplace"],
        ["**R²**", "`1 − SSres/SStot`", "อธิบายความแปรปรวนได้กี่ส่วน · **ติดลบได้** ถ้าแย่กว่าทายค่าเฉลี่ย"],
        ["**MAPE**", "`mean(|y−ŷ|/|y|)`", "เป็นเปอร์เซ็นต์ · **ระเบิดเมื่อ y ใกล้ศูนย์**"]
      ]}},
      { p: "**เลือก MSE เมื่อความผิดพลาดใหญ่แพงกว่าตามสัดส่วนกำลังสอง เลือก MAE เมื่อทุกความผิดพลาดแพงเท่ากันต่อหน่วย** — และนี่คือการตัดสินใจเชิงธุรกิจ ไม่ใช่เชิงเทคนิค" }
    ],

    architecture: [
      { p: "หมวดนี้คือโครงของ pipeline ที่ทำให้ตัวเลขเชื่อถือได้และทำซ้ำได้" },
      { h: "ลำดับที่ป้องกัน leakage โดยโครงสร้าง" },
      { code: String.raw`ผิด:
  scaler.fit(X_ทั้งหมด)          ← test set บอกค่าเฉลี่ยและ std ให้ train แล้ว
  X = scaler.transform(X_ทั้งหมด)
  split(X, y)

ถูก:
  X_tr, X_te = split(X, y)
  scaler.fit(X_tr)                ← เรียนจาก train เท่านั้น
  X_tr = scaler.transform(X_tr)
  X_te = scaler.transform(X_te)   ← ใช้ค่าเดิม ไม่ fit ใหม่`,
        cap: "กฎเดียว: fit บน train เท่านั้น transform ได้ทุกที่", lang: "python" },
      { h: "Pipeline ทำให้ผิดไม่ได้" },
      { code: String.raw`from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([
    ("scale", StandardScaler()),
    ("model", LogisticRegression(max_iter=1000)),
])

# cross_val_score จะ fit scaler ใหม่ในแต่ละ fold ให้เอง
scores = cross_val_score(pipe, X, y, cv=5, scoring="f1")`,
        cap: "นี่คือเหตุผลจริงที่ต้องใช้ Pipeline — ไม่ใช่ความสวยงาม แต่เพราะมันทำให้ leakage เกิดไม่ได้", lang: "python" },
      { note: "**ถ้า cross-validate เองด้วยลูป แล้ว fit scaler นอกลูป** — ทุก fold จะเห็นสถิติของ fold ที่เป็น validation คะแนนที่ได้จะสูงเกินจริงเล็กน้อยทุกครั้ง ซึ่งพอเทียบโมเดลกันแล้วอาจตัดสินใจผิด" },
      { h: "โครงไฟล์ของโปรเจกต์ที่ทำซ้ำได้" },
      { code: String.raw`project/
  data/
    raw/            ← ห้ามแก้ ห้ามเขียนทับ เก็บไว้อย่างเดียว
    processed/      ← ผลของสคริปต์ สร้างใหม่ได้เสมอ
  notebooks/        ← สำรวจข้อมูล ไม่ใช่ที่เก็บ logic จริง
  src/
    features.py     ← การแปลงทุกอย่าง อยู่ที่เดียว
    train.py
    evaluate.py
  models/           ← artifact + hash ของ config ที่สร้างมัน
  reports/`,
        cap: "raw ต้องอ่านอย่างเดียว — วันที่แก้ raw คือวันที่ทำซ้ำผลไม่ได้อีกเลย", lang: "txt" },
      { h: "สิ่งที่ต้องบันทึกทุกครั้งที่เทรน" },
      { ul: [
        "**seed ทุกตัว** (numpy, python, framework) และ hash ของข้อมูลที่ใช้",
        "**เวอร์ชันของ config ทั้งชุด** ไม่ใช่แค่ hyperparameter ที่จูน",
        "**คะแนนบนทุก fold** ไม่ใช่แค่ค่าเฉลี่ย — ส่วนเบี่ยงเบนคือข้อมูล",
        "**เวอร์ชันของโค้ด** (git commit) ที่ผลิตผลนั้น",
        "**เวลาที่ใช้เทรนและทำนาย** เพราะเป็นข้อจำกัดจริงตอนขึ้นงาน"
      ]},
      { h: "ลำดับการเลือกโมเดล" },
      { table: { head: ["ขั้น", "ทำอะไร", "ผ่านแล้วไปต่อ"], rows: [
        ["**1. Baseline**", "majority class หรือค่าเฉลี่ย", "โมเดลใดที่ชนะไม่ได้ = มีบั๊ก"],
        ["**2. Linear / Logistic**", "เร็ว อธิบายได้ ตีความสัมประสิทธิ์ได้", "ถ้าใกล้พอ **หยุดตรงนี้ได้เลย**"],
        ["**3. Gradient boosting**", "ค่าเริ่มต้นที่ซื่อสัตย์สำหรับข้อมูลตาราง", "ชนะบ่อยที่สุดในงานจริง"],
        ["**4. Neural network**", "เฉพาะข้อมูลไม่มีโครงสร้าง — ภาพ เสียง ข้อความ", "บนข้อมูลตารางมักแพ้ boosting และแพงกว่ามาก"]
      ]}},
      { p: "**ใช้เวลาหนึ่งวันกับ feature มักได้ผลมากกว่าใช้เวลาหนึ่งสัปดาห์กับโมเดล** — และ feature ที่ดีคือ feature ที่มีอยู่จริงตอนทำนาย ไม่ใช่แค่ correlate สูง" },
      { h: "การจูน hyperparameter" },
      { table: { head: ["วิธี", "เหมาะกับ", "ข้อสังเกต"], rows: [
        ["Grid search", "พารามิเตอร์น้อย ช่วงชัดเจน", "เสียเวลากับมิติที่ไม่สำคัญ"],
        ["**Random search**", "พารามิเตอร์เยอะ", "**มักดีกว่า grid ที่งบเท่ากัน** เพราะพารามิเตอร์ส่วนใหญ่ไม่สำคัญ"],
        ["Bayesian (optuna)", "การเทรนแต่ละครั้งแพง", "ใช้ผลก่อนหน้าเลือกจุดถัดไป"],
        ["**ไม่จูนเลย**", "ยังไม่ผ่านขั้น baseline", "จูนก่อนมี pipeline ที่เชื่อถือได้ = จูนเข้าหา noise"]
      ]}}
    ],

    dataflow: [
      { p: "หมวดนี้เดินงานหนึ่งงานตั้งแต่ข้อมูลดิบจนถึงตัวเลขที่รายงานได้" },
      { h: "โจทย์ตัวอย่าง" },
      { code: String.raw`ทำนายว่าลูกค้าจะเลิกใช้บริการเดือนหน้าไหม (churn)

ข้อมูล: 50,000 แถว · 30 คอลัมน์ · churn จริง 8%
เป้าหมายธุรกิจ: ส่งโปรโมชันไปหาคนที่กำลังจะเลิก
ต้นทุน: ส่งผิดคน = เสียส่วนลดฟรี · พลาดคนที่จะเลิก = เสียลูกค้าถาวร`,
        cap: "ต้นทุนที่ไม่เท่ากันคือสิ่งที่กำหนด metric ตั้งแต่ก่อนเริ่ม", lang: "txt" },
      { h: "ขั้นที่ 1 — เลือก metric จากต้นทุน" },
      { p: "เสียลูกค้าถาวรแพงกว่าส่วนลดมาก → **recall สำคัญกว่า precision** แต่ก็ส่งโปรโมชันให้ทุกคนไม่ได้ → ใช้ **PR-AUC** เป็นตัวเทียบโมเดล แล้วเลือก threshold จากงบโปรโมชันจริง" },
      { h: "ขั้นที่ 2 — แบ่งข้อมูล" },
      { code: String.raw`ข้อมูลมีคอลัมน์ signup_date และหนึ่งลูกค้ามีได้หลายแถว
  → ห้ามสุ่ม ต้องแบ่งตามเวลา และตามลูกค้า

train:      ลูกค้าที่สมัครก่อน 2025-01
validation: 2025-01 ถึง 2025-03
test:       หลัง 2025-03  ← แตะครั้งเดียว`,
        cap: "สองข้อจำกัดพร้อมกัน (เวลา + กลุ่ม) — ต้องเคารพทั้งคู่", lang: "txt" },
      { h: "ขั้นที่ 3 — baseline" },
      { code: String.raw`ทายว่า "ไม่เลิก" ทุกคน:
   accuracy  = 92%      ← ตัวเลขที่ไม่มีความหมาย
   recall    = 0%
   PR-AUC    = 0.08     ← เท่ากับสัดส่วนคลาสบวก คือเส้นฐานจริง

โมเดลใดที่ PR-AUC ไม่เกิน 0.08 = ไม่ได้เรียนรู้อะไรเลย`,
        cap: "PR-AUC ของการเดาสุ่ม = สัดส่วนของคลาสบวก จำเลขนี้ไว้เทียบ", lang: "txt" },
      { h: "ขั้นที่ 4 — logistic regression" },
      { code: String.raw`train PR-AUC = 0.34   validation PR-AUC = 0.31

ช่องว่างแคบ → ไม่ overfit
แต่ทั้งคู่ยังต่ำ    → bias สูง โมเดลง่ายเกินไปสำหรับปัญหานี้`,
        cap: "อ่านช่องว่างก่อน แล้วค่อยอ่านระดับ — ที่นี่บอกว่าให้เพิ่มความสามารถของโมเดล", lang: "txt" },
      { h: "ขั้นที่ 5 — gradient boosting" },
      { code: String.raw`train PR-AUC = 0.89   validation PR-AUC = 0.42

ช่องว่างกว้างมาก → overfit ชัดเจน
แก้: ลด max_depth · เพิ่ม min_child_weight · early stopping บน validation

หลังปรับ:  train 0.55   validation 0.48   ← ช่องว่างแคบลง ระดับสูงขึ้น`,
        cap: "overfit ไม่ใช่ความล้มเหลว เป็นข้อมูลว่าโมเดลมีกำลังเหลือให้ควบคุม", lang: "txt" },
      { h: "ขั้นที่ 6 — เลือก threshold จากงบจริง" },
      { code: String.raw`งบส่งโปรโมชันได้ 2,000 คนต่อเดือน จาก 50,000 คน = 4%

เรียงคะแนนจากมากไปน้อย เอา 4% แรก:
   ในนั้นเป็น churn จริง 620 คน
   precision = 620/2000 = 31%
   recall    = 620/4000 = 15.5%

เทียบกับสุ่ม 2,000 คน: จะเจอ churn จริงราว 160 คน
   → โมเดลดีกว่าสุ่มเกือบ 4 เท่า`,
        cap: "นี่คือตัวเลขที่รายงานให้ธุรกิจฟัง ไม่ใช่ AUC", lang: "txt" },
      { note: "**ตัวเลขที่ผู้บริหารเข้าใจคือ 'ดีกว่าเดิมกี่เท่า ภายใต้งบเท่าเดิม' ไม่ใช่ PR-AUC** — แปลงผลทางเทคนิคเป็นภาษาของต้นทุนเสมอ" },
      { h: "ขั้นที่ 7 — แตะ test ครั้งเดียว" },
      { code: String.raw`test PR-AUC = 0.45     (validation ได้ 0.48)

ต่ำกว่า validation เล็กน้อย = ปกติ เพราะ validation ถูกใช้เลือกของมาแล้ว
ถ้าต่ำกว่ามาก → overfit ไปที่ validation จากการจูนหลายรอบเกินไป`,
        cap: "ช่องว่าง validation-test คือค่าใช้จ่ายของการจูน — แคบแปลว่าจูนอย่างมีวินัย", lang: "txt" },
      { h: "ขั้นที่ 8 — หลัง deploy" },
      { ul: [
        "**เฝ้าดู input drift** — การกระจายของ feature เปลี่ยนไปจากตอนเทรนไหม",
        "**เฝ้าดู prediction drift** — สัดส่วนที่ทำนายว่าเป็นบวกขยับผิดปกติไหม",
        "**เฝ้าดูผลจริงเมื่อมันมาถึง** — churn รู้ผลอีกหนึ่งเดือน จึงวัดย้อนหลังได้",
        "**ตั้งกำหนดเทรนใหม่** ล่วงหน้า ไม่ใช่รอจนพัง"
      ]}
    ],

    implementation: [
      { p: "โค้ดที่ใช้ได้จริง ทุกชิ้นเขียนให้ leakage เกิดไม่ได้" },
      { h: "1) แบ่งข้อมูลให้ถูกชนิด" },
      { code: String.raw`from sklearn.model_selection import (
    train_test_split, StratifiedKFold, GroupKFold, TimeSeriesSplit)

# ทั่วไป + ไม่สมดุล → stratify
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)

# หลายแถวต่อหนึ่งผู้ใช้ → แบ่งตามกลุ่ม
gkf = GroupKFold(n_splits=5)
for tr, va in gkf.split(X, y, groups=user_id):
    ...

# time series → ห้ามสุ่ม
tscv = TimeSeriesSplit(n_splits=5)
for tr, va in tscv.split(X):          # tr มาก่อน va เสมอ
    ...`,
        cap: "เลือกตัวแบ่งให้ตรงกับโครงสร้างของข้อมูล — นี่คือการตัดสินใจที่สำคัญที่สุดในไฟล์นี้", lang: "python" },
      { h: "2) Pipeline ที่กัน leakage" },
      { code: String.raw`from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer

num = ["age", "tenure", "monthly_charge"]
cat = ["plan", "region"]

pre = ColumnTransformer([
    ("num", Pipeline([("imp", SimpleImputer(strategy="median")),
                      ("sc",  StandardScaler())]), num),
    ("cat", Pipeline([("imp", SimpleImputer(strategy="most_frequent")),
                      ("oh",  OneHotEncoder(handle_unknown="ignore"))]), cat),
])

pipe = Pipeline([("pre", pre), ("model", LogisticRegression(max_iter=1000))])`,
        cap: "`handle_unknown='ignore'` สำคัญ — ค่าใหม่ที่ไม่เคยเห็นตอนเทรนจะไม่ทำให้ pipeline พังตอน production", lang: "python" },
      { h: "3) วัดผลให้ครบ ไม่ใช่แค่ accuracy" },
      { code: String.raw`from sklearn.metrics import (classification_report, confusion_matrix,
                             roc_auc_score, average_precision_score, log_loss)

proba = pipe.predict_proba(X_te)[:, 1]
pred  = (proba >= 0.5).astype(int)

print(confusion_matrix(y_te, pred))
print(classification_report(y_te, pred, digits=3))
print("ROC-AUC :", roc_auc_score(y_te, proba))
print("PR-AUC  :", average_precision_score(y_te, proba))   # ← ตัวที่ควรดูเมื่อไม่สมดุล
print("log loss:", log_loss(y_te, proba))
print("baseline PR-AUC =", y_te.mean())                    # เส้นฐานของการเดาสุ่ม`,
        cap: "พิมพ์ baseline คู่กันเสมอ — ตัวเลขลอย ๆ ไม่มีความหมายถ้าไม่รู้ว่าเทียบกับอะไร", lang: "python" },
      { h: "4) เลือก threshold จากต้นทุนจริง" },
      { code: String.raw`import numpy as np
from sklearn.metrics import precision_recall_curve

prec, rec, thr = precision_recall_curve(y_te, proba)

# กรณี 1: มีงบจำกัด — เอา k% แรกที่คะแนนสูงสุด
k = int(0.04 * len(proba))
cut = np.sort(proba)[-k]
print("threshold ที่ตรงกับงบ:", cut)

# กรณี 2: มีต้นทุนเป็นตัวเงิน — หา threshold ที่กำไรสูงสุด
cost_fp, gain_tp = 50, 800
best = max(
    ((t, ((proba >= t) & (y_te == 1)).sum() * gain_tp
        - ((proba >= t) & (y_te == 0)).sum() * cost_fp)
     for t in np.linspace(0.05, 0.95, 91)),
    key=lambda x: x[1])
print("threshold ที่กำไรสูงสุด:", best)`,
        cap: "0.5 แทบไม่เคยเป็นคำตอบที่ถูก — คำตอบมาจากต้นทุน ไม่ใช่จากค่าเริ่มต้นของไลบรารี", lang: "python" },
      { h: "5) ตรวจ calibration" },
      { code: String.raw`from sklearn.calibration import calibration_curve, CalibratedClassifierCV

frac_pos, mean_pred = calibration_curve(y_te, proba, n_bins=10)
for m, f in zip(mean_pred, frac_pos):
    print(f"ทำนาย {m:.2f}  →  จริง {f:.2f}")
# ทำนาย 0.82  →  จริง 0.61     ← มั่นใจเกินจริง

# แก้: fit ตัวปรับบนข้อมูลที่กันไว้ต่างหาก
cal = CalibratedClassifierCV(pipe, method="isotonic", cv=5)
cal.fit(X_tr, y_tr)`,
        cap: "isotonic ยืดหยุ่นกว่าแต่ต้องการข้อมูลมากกว่า · sigmoid (Platt) ใช้ได้กับข้อมูลน้อย", lang: "python" },
      { h: "6) เส้นโค้งการเรียนรู้ — บอกว่าควรหาข้อมูลเพิ่มไหม" },
      { code: String.raw`from sklearn.model_selection import learning_curve

sizes, tr_sc, va_sc = learning_curve(
    pipe, X, y, cv=5, scoring="average_precision",
    train_sizes=np.linspace(0.1, 1.0, 10))

# อ่านผล:
#   สองเส้นบรรจบกันที่ระดับต่ำ      → bias สูง ข้อมูลเพิ่มไม่ช่วย
#   ยังห่างกันและ validation ยังขึ้น → variance สูง ข้อมูลเพิ่มช่วยได้`,
        cap: "นี่คือวิธีตอบคำถาม 'ควรลงทุนเก็บข้อมูลเพิ่มไหม' ด้วยหลักฐาน ไม่ใช่ความรู้สึก", lang: "python" },
      { h: "7) เทียบหลายโมเดลอย่างยุติธรรม" },
      { code: String.raw`from sklearn.model_selection import cross_validate

models = {
    "logreg":   LogisticRegression(max_iter=1000),
    "forest":   RandomForestClassifier(n_estimators=300, random_state=42),
    "boosting": HistGradientBoostingClassifier(random_state=42),
}

cv = StratifiedKFold(5, shuffle=True, random_state=42)   # fold เดียวกันทุกโมเดล
for name, m in models.items():
    p = Pipeline([("pre", pre), ("model", m)])
    r = cross_validate(p, X, y, cv=cv, scoring="average_precision")
    s = r["test_score"]
    print(f"{name:9s} PR-AUC {s.mean():.3f} ± {s.std():.3f}")`,
        cap: "ใช้ fold ชุดเดียวกันทุกโมเดล ไม่งั้นเทียบกันไม่ได้ — และรายงานส่วนเบี่ยงเบนเสมอ", lang: "python" }
    ],

    tricks: [
      { h: "จับ data leakage — เรียงตามที่เจอบ่อย" },
      { table: { head: ["รูปแบบ", "ตัวอย่าง", "วิธีจับ"], rows: [
        ["**feature จากอนาคต**", "`วันที่ยกเลิกบริการ` ใช้ทำนาย churn", "ถามทุก feature: **ตอนทำนายจริง รู้ค่านี้แล้วหรือยัง**"],
        ["**fit ตัวแปลงก่อนแบ่ง**", "`scaler.fit(X_ทั้งหมด)`", "ใช้ Pipeline แล้วเกิดไม่ได้"],
        ["**แถวซ้ำข้ามกอง**", "ลูกค้าคนเดียวกันอยู่ทั้ง train และ test", "แบ่งตามกลุ่ม · ตรวจ id ซ้ำ"],
        ["**resample ก่อนแบ่ง**", "SMOTE บนข้อมูลทั้งหมด", "resample ใน train fold เท่านั้น"],
        ["**target encoding ไม่ระวัง**", "เข้ารหัสหมวดด้วยค่าเฉลี่ยของ target", "ต้องคำนวณแยกในแต่ละ fold"],
        ["**เลือก feature ก่อนแบ่ง**", "หา correlation กับ target บนข้อมูลทั้งหมด", "เลือกภายใน fold เท่านั้น"]
      ]}},
      { note: "**สัญญาณของ leakage คือคะแนนที่ดีเกินไป** — AUC 0.99 ในงานที่คนทำได้ 0.75 ไม่ใช่ความสำเร็จ แต่คือข้อบ่งชี้ ให้ตรวจก่อนดีใจเสมอ" },
      { h: "ไล่ปัญหาตามอาการ" },
      { table: { head: ["อาการ", "สาเหตุที่พบบ่อย", "ทำอะไรต่อ"], rows: [
        ["accuracy สูงแต่ใช้งานไม่ได้", "ข้อมูลไม่สมดุล", "ดู confusion matrix · เปลี่ยนไป PR-AUC"],
        ["train สูง validation ต่ำ", "overfit", "regularize · ข้อมูลเพิ่ม · โมเดลเล็กลง"],
        ["ทั้งคู่ต่ำพอ ๆ กัน", "underfit", "โมเดลใหญ่ขึ้น · feature ดีขึ้น"],
        ["validation ดีกว่า train", "regularizer ปิดตอนวัด · fold ง่าย · leakage", "เช็คสามข้อนี้ตามลำดับ"],
        ["คะแนนแกว่งมากระหว่าง fold", "ข้อมูลน้อย · fold ไม่ stratified", "เพิ่ม fold · stratify · รายงาน ± เสมอ"],
        ["ดีในการทดลอง แย่ใน production", "leakage · distribution shift · แบ่งข้อมูลผิดชนิด", "ตรวจ leakage ก่อน แล้วค่อยดู drift"],
        ["ทำซ้ำไม่ได้", "ไม่ได้ตั้ง seed · ไม่ได้บันทึกเวอร์ชันข้อมูล", "บันทึก seed + hash ข้อมูล + git commit"]
      ]}},
      { h: "กฎที่ใช้ได้ตลอด" },
      { ul: [
        "**baseline ก่อนเสมอ** — ตัวเลขที่ไม่มีสิ่งเปรียบเทียบคือตัวเลขที่ไม่มีความหมาย",
        "**ดู confusion matrix ก่อนดู metric รวม** — เลขเดียวซ่อนได้ทุกอย่าง",
        "**รายงานค่าเฉลี่ย ± ส่วนเบี่ยงเบนเสมอ** ไม่ใช่ค่าเฉลี่ยลอย ๆ",
        "**แตะ test ครั้งเดียวจริง ๆ** และเขียนไว้ในโน้ตว่าแตะเมื่อไร",
        "**ทุก feature ต้องตอบได้ว่ามีอยู่จริงตอนทำนาย** — คำถามเดียวนี้กัน leakage ได้เกินครึ่ง",
        "**เก็บ raw ไว้อ่านอย่างเดียว** ทุกการแปลงต้องสร้างใหม่ได้จากสคริปต์"
      ]},
      { h: "เมื่อไรควรหยุด" },
      { p: "**หยุดเมื่อคะแนนที่เพิ่มขึ้นไม่เปลี่ยนการตัดสินใจอีกแล้ว** — ถ้า PR-AUC จาก 0.48 เป็น 0.50 แล้วยังส่งโปรโมชัน 2,000 คนเท่าเดิม และคนที่ได้รับเปลี่ยนไปไม่กี่คน แปลว่ากำลังปรับตัวเลขให้ตัวเองสบายใจ ไม่ได้สร้างมูลค่าเพิ่ม" },
      { p: "เวลาที่เหลือเอาไปใช้กับ **การเฝ้าระวังหลัง deploy** จะให้ผลตอบแทนสูงกว่า เพราะโมเดลที่เสื่อมโดยไม่มีใครรู้ทำความเสียหายได้มากกว่าโมเดลที่คะแนนต่ำกว่าเล็กน้อย" },
      { h: "ข้อผิดพลาดที่ทำให้เสียเวลามากที่สุด" },
      { ul: [
        "**จูน hyperparameter ก่อนที่ pipeline จะเชื่อถือได้** — เท่ากับจูนเข้าหา noise",
        "**เทียบโมเดลบน fold คนละชุด** — ความต่างที่เห็นอาจเป็นแค่การแบ่ง",
        "**ใช้ accuracy กับข้อมูลไม่สมดุล** แล้วสงสัยว่าทำไม production ไม่เวิร์ก",
        "**ลืมว่า threshold ปรับได้** แล้วไปโทษว่าโมเดล recall ต่ำ",
        "**เอาความน่าจะเป็นที่ยังไม่ calibrate ไปคูณกับเงิน**"
      ]}
    ],

    eval: [
      { p: "คำถามที่ใช้วัดว่าเข้าใจโครง ไม่ใช่จำชื่อ metric" },
      { qa: [
        { q: "ทำไมต้องแบ่งข้อมูลสามส่วน ไม่ใช่สอง",
          a: "validation ใช้เลือก hyperparameter และเทียบโมเดล ซึ่งเป็นการ fit เข้ากับมันไปเรื่อย ๆ ถ้าใช้ test ทำหน้าที่นี้ คะแนนสุดท้ายจะมองโลกในแง่ดีเกินจริงและเราจะไม่เหลือตัวประเมินที่ซื่อสัตย์ — test เป็นเครื่องมือใช้ครั้งเดียว" },
        { q: "cross-validation ดีกว่าการแบ่งครั้งเดียวยังไง",
          a: "ทุกตัวอย่างได้ทำหน้าที่ validation หนึ่งครั้ง จึงใช้ข้อมูลคุ้มกว่าและได้ทั้งค่าเฉลี่ยและส่วนเบี่ยงเบน — ส่วนเบี่ยงเบนบอกว่าคะแนนนั้นเสถียรหรือขึ้นกับว่าบังเอิญแบ่งยังไง" },
        { q: "ข้อมูล time series แบ่งยังไง ทำไมสุ่มไม่ได้",
          a: "แบ่งตามเวลา เทรนบนอดีตแล้ววัดบนอนาคตเท่านั้น การสุ่มทำให้โมเดลเห็นข้อมูลจากวันหลังเพื่อทำนายวันก่อน ซึ่งเป็น leakage ที่ให้คะแนนสวยงามแต่ไร้ค่าโดยสมบูรณ์" },
        { q: "แยก bias กับ variance จากตัวเลขยังไง",
          a: "ดูช่องว่างระหว่าง train กับ validation: ทั้งคู่สูงพอ ๆ กันคือ bias (underfit) · train ต่ำแต่ validation สูงกว่ามากคือ variance (overfit) — และการอ่านช่องว่างสำคัญกว่าการอ่านตัวเลขเดี่ยว ๆ" },
        { q: "overfit กับ underfit แก้ต่างกันยังไง",
          a: "overfit แก้ด้วยข้อมูลเพิ่ม regularization โมเดลเล็กลง หรือ early stopping · underfit แก้ด้วยโมเดลใหญ่ขึ้น feature ดีขึ้น หรือลด regularization — ข้อมูลเพิ่มช่วย overfit แต่ไม่ช่วย underfit" },
        { q: "ทำไม accuracy ถึงใช้ไม่ได้กับข้อมูลไม่สมดุล",
          a: "ถ้ามี positive 1% การทายว่า negative ทุกครั้งได้ accuracy 99% โดยไม่จับ positive ได้เลยสักตัว ตัวเลขจึงสูงและไร้ประโยชน์ — ต้องดู confusion matrix แล้วใช้ precision/recall หรือ PR-AUC แทน" },
        { q: "precision กับ recall ต่างกันยังไง เลือกยังไง",
          a: "precision คือในสิ่งที่เตือนไปถูกกี่ส่วน recall คือของจริงที่มีจับได้กี่ส่วน เลือกจากต้นทุน: เตือนผิดแพงให้เน้น precision พลาดแพงให้เน้น recall — และทั้งคู่แลกกันผ่าน threshold ไม่ใช่ผ่านโมเดล" },
        { q: "เมื่อไรใช้ PR-AUC แทน ROC-AUC",
          a: "เมื่อข้อมูลไม่สมดุลหนัก เพราะ ROC ใช้ FPR ที่มี TN มหาศาลอยู่ในตัวส่วน ทำให้ค่าดูดีเสมอ ส่วน PR-AUC ไม่ใช้ TN เลยจึงสะท้อนคุณภาพบนคลาสบวกจริง" },
        { q: "calibration คืออะไร ตรวจยังไง",
          a: "คือความน่าจะเป็นที่โมเดลบอกตรงกับความถี่จริงหรือไม่ — ถ้าบอก 0.8 แล้วถูกจริง 60% คือมั่นใจเกินจริง ตรวจด้วย reliability curve และแก้ด้วย Platt scaling หรือ isotonic ที่ fit บนข้อมูลกันไว้ต่างหาก" },
        { q: "โมเดลที่ AUC สูงแปลว่า calibrate ดีไหม",
          a: "ไม่จำเป็น AUC วัดความสามารถในการ **จัดอันดับ** ส่วน calibration วัดว่าตัวเลขความน่าจะเป็นเชื่อได้ไหม โมเดลอาจเรียงลำดับถูกทั้งหมดแต่ให้ค่าสูงเกินจริงทุกตัวก็ได้ ถ้าจะเอาความน่าจะเป็นไปตัดสินใจต้องดู log loss หรือ Brier" },
        { q: "data leakage คืออะไร ยกตัวอย่างที่พบบ่อยที่สุด",
          a: "คือการที่ข้อมูลซึ่งไม่ควรมีตอนทำนายเล็ดลอดเข้าไปในการเทรน ตัวอย่างที่พบบ่อยสุดคือ fit scaler บนข้อมูลทั้งหมดก่อนแบ่ง และการใช้ feature ที่เกิดขึ้นหลังเหตุการณ์ที่จะทำนาย" },
        { q: "จะรู้ได้ยังไงว่ามี leakage",
          a: "คะแนนดีเกินกว่าที่ปัญหาควรจะเป็น เป็นสัญญาณแรกเสมอ จากนั้นถามทุก feature ว่า 'ตอนทำนายจริงรู้ค่านี้หรือยัง' — คำถามเดียวนี้จับ leakage ได้เกินครึ่ง" },
        { q: "ทำไมต้องใช้ Pipeline ไม่ใช่แค่ความเรียบร้อย",
          a: "เพราะมันทำให้ leakage เกิดไม่ได้เชิงโครงสร้าง — ตอน cross-validate ทุกตัวแปลงจะถูก fit ใหม่ในแต่ละ fold โดยอัตโนมัติ ซึ่งถ้าเขียนลูปเองมักจะพลาด" },
        { q: "threshold 0.5 มาจากไหน ควรใช้ไหม",
          a: "เป็นค่าเริ่มต้นของไลบรารีเท่านั้น ไม่ได้พิสูจน์ว่าเหมาะกับปัญหาใด ควรเลือกจากต้นทุนของ FP กับ FN หรือจากงบที่มีจริง เช่นเอา k% แรกที่คะแนนสูงสุด" },
        { q: "ข้อมูลไม่สมดุลควรทำอะไรก่อน",
          a: "เปลี่ยน metric ก่อนเสมอ แล้วลอง class weight ซึ่งง่ายและไม่เสี่ยง หลังจากนั้นค่อยพิจารณา resample โดยต้องทำ **ในชุดเทรนหลังแบ่งแล้วเท่านั้น** ไม่งั้นเป็น leakage" },
        { q: "curse of dimensionality กระทบอะไรบ้าง",
          a: "เมื่อมิติสูง ระยะทางระหว่างจุดเริ่มเท่ากันหมด ทำให้โมเดลที่อิงระยะทางอย่าง kNN และ k-means เสื่อมโดยตรง และต้องใช้ข้อมูลมากขึ้นแบบเลขชี้กำลังเพื่อครอบคลุมพื้นที่เท่าเดิม" },
        { q: "เลือกโมเดลตามลำดับไหน",
          a: "baseline → linear/logistic → gradient boosting → neural network โดยหยุดทันทีที่ดีพอ บนข้อมูลตาราง boosting มักชนะ ส่วน neural network คุ้มเฉพาะข้อมูลไม่มีโครงสร้างอย่างภาพ เสียง ข้อความ" },
        { q: "learning curve บอกอะไร",
          a: "บอกว่าควรลงทุนเก็บข้อมูลเพิ่มไหม — ถ้าเส้น train กับ validation บรรจบกันที่ระดับต่ำแล้วคือ bias ข้อมูลเพิ่มไม่ช่วย แต่ถ้ายังห่างกันและ validation ยังไต่ขึ้น ข้อมูลเพิ่มยังช่วยได้" },
        { q: "ทำไม validation อาจดีกว่า train ได้",
          a: "สาเหตุที่พบบ่อยเรียงตามลำดับ: dropout และ regularizer ทำงานตอนเทรนแต่ปิดตอนวัด (ปกติ) · validation set บังเอิญง่ายกว่า · หรือมี leakage ซึ่งต้องตรวจทันที" },
        { q: "ควรหยุดปรับโมเดลเมื่อไร",
          a: "เมื่อคะแนนที่เพิ่มขึ้นไม่เปลี่ยนการตัดสินใจอีกแล้ว — ถ้าปรับแล้วยังส่งโปรโมชันจำนวนเท่าเดิมให้คนกลุ่มเดิมเกือบหมด แปลว่ากำลังปรับตัวเลขให้สบายใจ เวลาที่เหลือควรไปลงกับการเฝ้าระวังหลัง deploy" }
      ]},
      { h: "อ่านเพิ่ม" },
      { links: [
        { label: "scikit-learn — Cross-validation", url: "https://scikit-learn.org/stable/modules/cross_validation.html", note: "ตัวแบ่งทุกชนิดพร้อมภาพ รวม GroupKFold และ TimeSeriesSplit" },
        { label: "scikit-learn — Metrics and scoring", url: "https://scikit-learn.org/stable/modules/model_evaluation.html", note: "นิยามของทุก metric พร้อมข้อควรระวังของแต่ละตัว" },
        { label: "scikit-learn — Probability calibration", url: "https://scikit-learn.org/stable/modules/calibration.html", note: "reliability curve, Platt scaling และ isotonic พร้อมตัวอย่าง" },
        { label: "Google — Rules of Machine Learning", url: "https://developers.google.com/machine-learning/guides/rules-of-ml", note: "43 กฎจากประสบการณ์จริง — อ่านข้อ 1-15 ก่อนเริ่มโปรเจกต์ใด ๆ" },
        { label: "Kaggle — Data Leakage", url: "https://www.kaggle.com/code/alexisbcook/data-leakage", note: "ตัวอย่าง leakage ที่จับต้องได้ พร้อมโค้ด" },
        { label: "The Precision-Recall Plot Is More Informative than the ROC Plot", url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0118432", note: "งานวิจัยที่แสดงว่าทำไม ROC หลอกเมื่อข้อมูลไม่สมดุล" }
      ]}
    ]
  }
});

Object.assign(window.TEACHING_EN, {
  ml_basics: {
    principle: [
      { h: "The part nobody tells you first" },
      { p: "**Most of the value in a supervised problem comes from the split, the metric and the features** — choosing the model family is the last decision and usually the one that matters least." },
      { p: "So this page does not start with models. It starts with **the structure that makes your measurements trustworthy**, because a model that looks good against numbers that lie is a model that fails in production." },
      { h: "Three questions to answer before the first line of code" },
      { table: { head: ["Question", "What happens if you get it wrong"], rows: [
        ["**How do you split the data?**", "The numbers flatter you, and production undoes them"],
        ["**What do you measure?**", "The model gets good at something nobody wanted — 99% accuracy on data that is 1% positive"],
        ["**Does each feature exist at prediction time?**", "Data leakage — a beautiful score that never reproduces"]
      ]}},
      { h: "Kinds of learning" },
      { table: { head: ["Kind", "What the data needs", "Examples"], rows: [
        ["**Supervised**", "Correct labels", "House prices · spam classification"],
        ["**Unsupervised**", "No labels", "Customer segments · PCA · anomaly detection"],
        ["**Semi-supervised**", "A few labels, plenty without", "Label 1,000 images and let 100,000 unlabelled ones help"],
        ["**Reinforcement**", "Rewards from an environment, not labels", "Games · robotics · resource allocation"]
      ]}},
      { p: "**A second, separate axis**: `regression` predicts a continuous number (a price, a temperature) while `classification` predicts a category (spam or not). They use different losses and entirely different metrics." },
      { h: "The path of one ML project" },
      { code: String.raw`sharpen the question  →  get data  →  split train/val/test
                                          ↓
                                    build features
                                          ↓
                          baseline (majority / mean)  ← must be beaten first
                                          ↓
                            a simple model (linear/logistic)
                                          ↓
                          a strong model (gradient boosting)
                                          ↓
                   measure on test once  →  deploy  →  watch for drift`,
        cap: "Every arrow can loop back except the test step, which you get one shot at", lang: "txt" },
      { note: "**A baseline is not a ritual.** If a model cannot beat one, there is a bug, not a hard problem — and knowing that on day one saves weeks." },
      { h: "What this page will let you do" },
      { ul: [
        "Split correctly for each kind of data, time series and grouped data included",
        "Read the train/validation gap and say immediately whether it is bias or variance, and what to do next",
        "Pick a metric from the real cost of each error rather than from what everyone else uses",
        "Catch data leakage before it costs you a week",
        "Know when to stop — a model that is good enough does not need to get better"
      ]}
    ],
    theory: [
      { p: "The concepts to be solid on before touching a model — each one changes the numbers you get." },
      { h: "1) Why three splits rather than two" },
      { code: String.raw`train      60-80%    fits the model's parameters
validation           chooses hyperparameters · compares models · decides when to stop
test       10-20%    touched once, at the very end`,
        cap: "Three piles, three jobs, never swapped", lang: "txt" },
      { p: "**Every time you look at the test set and change something, you fit to it a little.** Do that twenty times and the test score is already optimistic, and you no longer hold an honest estimate — **the test set is a one-shot instrument**." },
      { h: "2) Cross-validation, when there is not enough data for three piles" },
      { code: String.raw`5-fold CV:
  fold 1: [test][ train  ][ train ][ train ][ train ]
  fold 2: [train][ test  ][ train ][ train ][ train ]
  ...
  → five scores → report the mean ± the standard deviation`,
        cap: "Every example serves as validation once, so it uses the data far better than a single split", lang: "txt" },
      { p: "**The spread matters as much as the mean** — a model at `0.85 ± 0.01` and one at `0.85 ± 0.12` are entirely different propositions; the second says the result depends on how you happened to split." },
      { h: "3) The splits that must not be random" },
      { table: { head: ["Data of this kind", "Split it", "What a random split does"], rows: [
        ["**Time series**", "Chronologically, training only on the past", "The model sees the future — a lovely score that cannot be used"],
        ["**Grouped** (many rows per user)", "By group", "The same user lands in train and test: memorisation, not prediction"],
        ["**Severely imbalanced**", "Stratified", "A fold can end up with no positives at all"]
      ]}},
      { note: "**Time series is where people slip most.** `train_test_split(shuffle=True)` on price data lets the model learn from tomorrow to predict today. The result looks miraculous and is completely worthless." },
      { h: "4) Bias and variance" },
      { code: String.raw`expected error = bias² + variance + irreducible noise

high bias (underfit)      the model is too simple to capture the pattern
high variance (overfit)   the model memorised the training data`,
        cap: "The irreducible noise is the ceiling — no model crosses it, however much data you have", lang: "txt" },
      { table: { head: ["", "train error", "validation error", "What to do"], rows: [
        ["**Underfit**", "High", "About the same", "A bigger model · better features · less regularisation · train longer"],
        ["**Overfit**", "Very low", "**Much higher**", "More data · regularisation · a smaller model · early stopping"],
        ["**Just right**", "Low", "Low and close to it", "Stop"]
      ]}},
      { p: "**Read the gap, not the number**: train 0.99 / val 0.72 is variance; train 0.68 / val 0.67 is bias. That single comparison decides what to do next, and it is the first thing to look at." },
      { h: "5) When validation beats training" },
      { p: "That is not luck, it is a signal. In order of likelihood: **dropout and other regularisers are on during training and off during evaluation** (normal, not a bug); the validation split happens to be easier (re-split, stratified); or **something is leaking** (check immediately)." },
      { h: "6) Regularisation — trading a little bias for far less variance" },
      { table: { head: ["Method", "What it does", "Side effect"], rows: [
        ["**L2 (ridge)**", "Shrinks coefficients smoothly", "None reach exactly zero"],
        ["**L1 (lasso)**", "Drives coefficients to exactly zero", "**Selects features for you**"],
        ["**Elastic net**", "Mixes the two", "Two parameters to tune"],
        ["**Early stopping**", "Stops when validation starts worsening", "Free, nothing to tune"],
        ["**Data augmentation**", "Adds synthetic but still-valid data", "You must know which transforms preserve the label"]
      ]}},
      { h: "7) The curse of dimensionality" },
      { p: "The more dimensions, the further apart everything sits, until every point is **equidistant** — distance stops meaning anything, which breaks kNN and k-means directly, and covering the same fraction of the space needs exponentially more data." },
      { code: String.raw`covering 10% of the range in each dimension:
  1 dimension  → 10% of the data
  10 dimensions → 0.1^10 = 1 part in 10,000,000,000 of the range ... impossible`,
        cap: "Hence dimensionality reduction, feature selection, or models that tolerate high dimensions", lang: "txt" },
      { h: "8) Imbalanced data" },
      { table: { head: ["Approach", "What it does", "Watch out for"], rows: [
        ["**Change the metric**", "Drop accuracy for PR-AUC or recall", "**Do this first**, and it is often enough on its own"],
        ["**Class weights**", "Makes errors on the rare class cost more", "Supported almost everywhere; the easiest thing to try"],
        ["**Oversampling / SMOTE**", "Synthesises more of the rare class", "**Only after the split**, or it leaks"],
        ["**Undersampling**", "Throws away majority rows", "You discard real data; only when you have plenty"],
        ["**Move the threshold**", "Cut somewhere other than 0.5", "Free, and often better than resampling"]
      ]}},
      { note: "**SMOTE before splitting leaks immediately**, because synthetic points are built from rows that end up in the test set. It is the bug that makes scores jump excitingly and then collapse in production." }
    ],
    foundations: [
      { p: "This section is about metrics, because one wrong choice sends the whole project the wrong way." },
      { h: "The confusion matrix, the honest starting point" },
      { code: String.raw`                predicted +   predicted −
   actual +          TP            FN      ← misses
   actual −          FP            TN      ← false alarms`,
        cap: "Every classification metric is computed from these four cells", lang: "txt" },
      { h: "Each metric and the question it answers" },
      { table: { head: ["Metric", "Form", "Answers", "Use when"], rows: [
        ["Accuracy", "`(TP+TN)/total`", "What fraction was right", "**Balanced classes only**"],
        ["Precision", "`TP/(TP+FP)`", "Of those flagged, how many were right", "False alarms are expensive"],
        ["Recall", "`TP/(TP+FN)`", "Of the real ones, how many were caught", "Misses are expensive"],
        ["F1", "`2PR/(P+R)`", "A balance of the two above", "You need one number"],
        ["ROC-AUC", "Area under TPR/FPR", "How well it ranks overall", "Roughly balanced classes"],
        ["**PR-AUC**", "Area under precision/recall", "How well it ranks the positive class", "**Strongly imbalanced**"],
        ["Log loss", "`−Σ y log ŷ`", "How good the **probabilities** are", "You will act on the probability"]
      ]}},
      { h: "Why accuracy lies on imbalanced data" },
      { code: String.raw`10,000 rows · 100 genuinely ill (1%)

A model that answers "not ill" for everyone:
   accuracy  = 9900/10000 = 99%      ← looks excellent
   recall    = 0/100      = 0%       ← catches nobody at all
   precision = undefined (it never flags)`,
        cap: "A completely useless 99% — which is why the confusion matrix comes first", lang: "txt" },
      { h: "ROC-AUC versus PR-AUC" },
      { p: "**ROC-AUC is over-optimistic under heavy imbalance**, because `FPR = FP/(FP+TN)` and an enormous `TN` keeps that denominator huge, so the rate stays low no matter how poor the predictions are. PR-AUC never touches `TN`, so it cannot be fooled the same way." },
      { code: String.raw`1% positives  ·  the model flags 200, of which 50 are right

FPR = 150/9900 = 1.5%       → ROC looks great
precision = 50/200 = 25%    → three out of four flags are wrong`,
        cap: "The same numbers from two angles — choose the angle that matches the real cost", lang: "txt" },
      { h: "The threshold, which people forget is adjustable" },
      { p: "**Precision and recall trade off through the threshold, not the model.** One model gives you both, at different cut points — so report the curve and choose the point from the cost of each kind of error." },
      { code: String.raw`threshold 0.9  →  few flags · high precision · low recall
threshold 0.5  →  a default nobody proved was right
threshold 0.2  →  many flags · high recall · low precision`,
        cap: "0.5 is a library default, not the correct answer to your problem", lang: "txt" },
      { h: "Calibration — can the probability be believed" },
      { p: "If the model says 0.8 and is right only 60% of the time it is **overconfident**, and that number cannot be multiplied by money or risk. Check it with a reliability curve and fix it with Platt scaling or isotonic regression, fitted on separately held-out data." },
      { code: String.raw`reliability curve:
  bucket the predictions 0.0-0.1, 0.1-0.2, ...
  per bucket: mean predicted probability  vs  actual fraction correct
  the diagonal = perfectly calibrated`,
        cap: "Below the diagonal means overconfident; above it means unduly modest", lang: "txt" },
      { note: "**A model can rank well and calibrate badly, or the reverse.** ROC-AUC measures ranking; log loss and the Brier score measure calibration. If a probability will drive a decision, look at the latter." },
      { h: "Regression metrics" },
      { table: { head: ["Metric", "Form", "Character"], rows: [
        ["**MSE**", "`mean((y−ŷ)²)`", "Punishes large errors heavily · units are squared"],
        ["**RMSE**", "`√MSE`", "Same units as y, so it reads naturally"],
        ["**MAE**", "`mean(|y−ŷ|)`", "**Robust to outliers** · follows from a Laplace assumption"],
        ["**R²**", "`1 − SSres/SStot`", "Fraction of variance explained · **can be negative** if worse than the mean"],
        ["**MAPE**", "`mean(|y−ŷ|/|y|)`", "A percentage · **blows up as y approaches zero**"]
      ]}},
      { p: "**Choose MSE when large errors hurt quadratically and MAE when every unit of error costs the same** — and that is a business decision, not a technical one." }
    ],
    architecture: [
      { p: "The pipeline structure that makes numbers trustworthy and results reproducible." },
      { h: "The order that prevents leakage by construction" },
      { code: String.raw`wrong:
  scaler.fit(all of X)            ← the test set just told train its mean and std
  X = scaler.transform(all of X)
  split(X, y)

right:
  X_tr, X_te = split(X, y)
  scaler.fit(X_tr)                ← learns from train only
  X_tr = scaler.transform(X_tr)
  X_te = scaler.transform(X_te)   ← reuses those values, never refits`,
        cap: "One rule: fit on train only, transform anywhere", lang: "python" },
      { h: "A pipeline makes it impossible to get wrong" },
      { code: String.raw`from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([
    ("scale", StandardScaler()),
    ("model", LogisticRegression(max_iter=1000)),
])

# cross_val_score refits the scaler inside every fold for you
scores = cross_val_score(pipe, X, y, cv=5, scoring="f1")`,
        cap: "This is the real reason for Pipeline — not tidiness, but making leakage structurally impossible", lang: "python" },
      { note: "**Hand-rolling cross-validation with the scaler fitted outside the loop** lets every fold see the statistics of its own validation split. Scores come out slightly high every time, which is enough to pick the wrong model when comparing." },
      { h: "A project layout that reproduces" },
      { code: String.raw`project/
  data/
    raw/            ← never edited, never overwritten; stored and left alone
    processed/      ← output of scripts, always regenerable
  notebooks/        ← exploration, not a home for real logic
  src/
    features.py     ← every transformation, in one place
    train.py
    evaluate.py
  models/           ← artefacts plus a hash of the config that made them
  reports/`,
        cap: "raw is read-only — the day you edit it is the day results stop reproducing", lang: "txt" },
      { h: "What to record on every training run" },
      { ul: [
        "**Every seed** (numpy, python, framework) and a hash of the data used",
        "**The whole config version**, not only the hyperparameters you tuned",
        "**The score on every fold**, not just the mean — the spread is information",
        "**The code version** (git commit) that produced the result",
        "**Training and inference time**, because they are real constraints at deployment"
      ]},
      { h: "The order in which to try models" },
      { table: { head: ["Step", "What", "Move on when"], rows: [
        ["**1. Baseline**", "Majority class or the mean", "Any model that cannot beat it has a bug"],
        ["**2. Linear / logistic**", "Fast, explainable, interpretable coefficients", "If it is close enough, **stop right here**"],
        ["**3. Gradient boosting**", "The honest default for tabular data", "It wins most often in real work"],
        ["**4. Neural network**", "Only for unstructured data — images, audio, text", "On tabular data it usually loses to boosting and costs far more"]
      ]}},
      { p: "**A day spent on features usually beats a week spent on models** — and a good feature is one that exists at prediction time, not merely one that correlates." },
      { h: "Hyperparameter tuning" },
      { table: { head: ["Method", "Suits", "Note"], rows: [
        ["Grid search", "Few parameters, clear ranges", "Wastes effort on dimensions that do not matter"],
        ["**Random search**", "Many parameters", "**Usually beats grid at the same budget**, because most parameters do not matter"],
        ["Bayesian (optuna)", "Expensive training runs", "Uses earlier results to choose the next point"],
        ["**Not tuning at all**", "Before the baseline is beaten", "Tuning before the pipeline is trustworthy is tuning into noise"]
      ]}}
    ],
    dataflow: [
      { p: "One project walked from raw data to a number you can report." },
      { h: "The problem" },
      { code: String.raw`Predict whether a customer will churn next month

Data: 50,000 rows · 30 columns · 8% actually churn
Business goal: send a promotion to those about to leave
Costs: a wasted promotion = one discount given away
       a missed churner  = a customer lost for good`,
        cap: "The asymmetric cost is what fixes the metric before anything begins", lang: "txt" },
      { h: "Step 1 — pick the metric from the cost" },
      { p: "Losing a customer costs far more than a discount, so **recall matters more than precision** — but you cannot promote to everyone, so use **PR-AUC** to compare models and then choose the threshold from the real promotion budget." },
      { h: "Step 2 — split" },
      { code: String.raw`the data has a signup_date, and one customer can have several rows
  → no random split: split by time and by customer

train:      customers who signed up before 2025-01
validation: 2025-01 to 2025-03
test:       after 2025-03  ← touched once`,
        cap: "Two constraints at once (time and grouping) — both have to be honoured", lang: "txt" },
      { h: "Step 3 — the baseline" },
      { code: String.raw`predicting "will not churn" for everyone:
   accuracy  = 92%      ← a meaningless number
   recall    = 0%
   PR-AUC    = 0.08     ← equals the positive rate: the real floor

any model whose PR-AUC does not exceed 0.08 has learned nothing`,
        cap: "Random guessing gives a PR-AUC equal to the positive class rate — remember it for comparison", lang: "txt" },
      { h: "Step 4 — logistic regression" },
      { code: String.raw`train PR-AUC = 0.34   validation PR-AUC = 0.31

a narrow gap  → not overfitting
both still low → high bias; the model is too simple for this problem`,
        cap: "Read the gap first, then the level — here it says to add capacity", lang: "txt" },
      { h: "Step 5 — gradient boosting" },
      { code: String.raw`train PR-AUC = 0.89   validation PR-AUC = 0.42

a very wide gap → clearly overfitting
fix: lower max_depth · raise min_child_weight · early stop on validation

after adjusting:  train 0.55   validation 0.48   ← narrower gap, higher level`,
        cap: "Overfitting is not a failure; it is evidence the model has capacity you can control", lang: "txt" },
      { h: "Step 6 — choose the threshold from the real budget" },
      { code: String.raw`the budget covers 2,000 promotions a month out of 50,000 = 4%

sort by score and take the top 4%:
   620 of them really churn
   precision = 620/2000 = 31%
   recall    = 620/4000 = 15.5%

against 2,000 chosen at random: about 160 real churners
   → nearly four times better than chance`,
        cap: "That is the number you report to the business, not the AUC", lang: "txt" },
      { note: "**Executives understand \"how many times better, at the same budget\", not PR-AUC.** Always translate the technical result into the language of cost." },
      { h: "Step 7 — touch the test set once" },
      { code: String.raw`test PR-AUC = 0.45     (validation gave 0.48)

slightly below validation is normal, since validation was used to choose things
much below it means you overfitted to validation through too many tuning rounds`,
        cap: "The validation-test gap is the price of tuning — a narrow one means you tuned with discipline", lang: "txt" },
      { h: "Step 8 — after deployment" },
      { ul: [
        "**Watch input drift** — have the feature distributions moved away from training?",
        "**Watch prediction drift** — has the positive rate shifted unusually?",
        "**Watch the outcomes as they arrive** — churn resolves a month later, so it can be scored retrospectively",
        "**Schedule retraining in advance**, rather than waiting for a failure"
      ]}
    ],
    implementation: [
      { p: "Code you can use, every piece written so leakage cannot occur." },
      { h: "1) Split according to the kind of data" },
      { code: String.raw`from sklearn.model_selection import (
    train_test_split, StratifiedKFold, GroupKFold, TimeSeriesSplit)

# ordinary and imbalanced → stratify
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)

# several rows per user → split by group
gkf = GroupKFold(n_splits=5)
for tr, va in gkf.split(X, y, groups=user_id):
    ...

# time series → never shuffle
tscv = TimeSeriesSplit(n_splits=5)
for tr, va in tscv.split(X):          # tr always precedes va
    ...`,
        cap: "Match the splitter to the structure of the data — the most important decision in this file", lang: "python" },
      { h: "2) A pipeline that prevents leakage" },
      { code: String.raw`from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer

num = ["age", "tenure", "monthly_charge"]
cat = ["plan", "region"]

pre = ColumnTransformer([
    ("num", Pipeline([("imp", SimpleImputer(strategy="median")),
                      ("sc",  StandardScaler())]), num),
    ("cat", Pipeline([("imp", SimpleImputer(strategy="most_frequent")),
                      ("oh",  OneHotEncoder(handle_unknown="ignore"))]), cat),
])

pipe = Pipeline([("pre", pre), ("model", LogisticRegression(max_iter=1000))])`,
        cap: "`handle_unknown='ignore'` matters: an unseen category must not break the pipeline in production", lang: "python" },
      { h: "3) Evaluate properly, not just accuracy" },
      { code: String.raw`from sklearn.metrics import (classification_report, confusion_matrix,
                             roc_auc_score, average_precision_score, log_loss)

proba = pipe.predict_proba(X_te)[:, 1]
pred  = (proba >= 0.5).astype(int)

print(confusion_matrix(y_te, pred))
print(classification_report(y_te, pred, digits=3))
print("ROC-AUC :", roc_auc_score(y_te, proba))
print("PR-AUC  :", average_precision_score(y_te, proba))   # ← the one to watch when imbalanced
print("log loss:", log_loss(y_te, proba))
print("baseline PR-AUC =", y_te.mean())                    # the chance floor`,
        cap: "Always print the baseline beside it — a bare number means nothing without something to compare against", lang: "python" },
      { h: "4) Choose the threshold from the real cost" },
      { code: String.raw`import numpy as np
from sklearn.metrics import precision_recall_curve

prec, rec, thr = precision_recall_curve(y_te, proba)

# case 1: a fixed budget — take the top k% by score
k = int(0.04 * len(proba))
cut = np.sort(proba)[-k]
print("threshold matching the budget:", cut)

# case 2: costs in money — find the most profitable threshold
cost_fp, gain_tp = 50, 800
best = max(
    ((t, ((proba >= t) & (y_te == 1)).sum() * gain_tp
        - ((proba >= t) & (y_te == 0)).sum() * cost_fp)
     for t in np.linspace(0.05, 0.95, 91)),
    key=lambda x: x[1])
print("most profitable threshold:", best)`,
        cap: "0.5 is almost never the right answer — the answer comes from cost, not from a library default", lang: "python" },
      { h: "5) Check calibration" },
      { code: String.raw`from sklearn.calibration import calibration_curve, CalibratedClassifierCV

frac_pos, mean_pred = calibration_curve(y_te, proba, n_bins=10)
for m, f in zip(mean_pred, frac_pos):
    print(f"predicted {m:.2f}  →  actual {f:.2f}")
# predicted 0.82  →  actual 0.61     ← overconfident

# fix: fit a calibrator on separately held-out data
cal = CalibratedClassifierCV(pipe, method="isotonic", cv=5)
cal.fit(X_tr, y_tr)`,
        cap: "isotonic is more flexible but needs more data; sigmoid (Platt) works with less", lang: "python" },
      { h: "6) Learning curves — should you collect more data?" },
      { code: String.raw`from sklearn.model_selection import learning_curve

sizes, tr_sc, va_sc = learning_curve(
    pipe, X, y, cv=5, scoring="average_precision",
    train_sizes=np.linspace(0.1, 1.0, 10))

# reading it:
#   the two curves meet at a low level      → high bias; more data will not help
#   still apart and validation still rising → high variance; more data will help`,
        cap: "This answers \"is it worth collecting more data\" with evidence rather than instinct", lang: "python" },
      { h: "7) Compare models fairly" },
      { code: String.raw`from sklearn.model_selection import cross_validate

models = {
    "logreg":   LogisticRegression(max_iter=1000),
    "forest":   RandomForestClassifier(n_estimators=300, random_state=42),
    "boosting": HistGradientBoostingClassifier(random_state=42),
}

cv = StratifiedKFold(5, shuffle=True, random_state=42)   # the same folds for everyone
for name, m in models.items():
    p = Pipeline([("pre", pre), ("model", m)])
    r = cross_validate(p, X, y, cv=cv, scoring="average_precision")
    s = r["test_score"]
    print(f"{name:9s} PR-AUC {s.mean():.3f} ± {s.std():.3f}")`,
        cap: "The same folds for every model, or the comparison is meaningless — and always report the spread", lang: "python" }
    ],
    tricks: [
      { h: "Catching data leakage, most common first" },
      { table: { head: ["Pattern", "Example", "How to catch it"], rows: [
        ["**A feature from the future**", "`cancellation_date` used to predict churn", "Ask of every feature: **would I know this at prediction time?**"],
        ["**Fitting a transform before the split**", "`scaler.fit(all of X)`", "Use a Pipeline and it cannot happen"],
        ["**Duplicate rows across splits**", "The same customer in train and test", "Split by group · check for repeated ids"],
        ["**Resampling before splitting**", "SMOTE over the whole dataset", "Resample inside the training fold only"],
        ["**Careless target encoding**", "Encoding a category by the target mean", "Compute it separately within each fold"],
        ["**Feature selection before splitting**", "Correlating with the target over all the data", "Select inside the fold only"]
      ]}},
      { note: "**The signal of leakage is a score that is too good.** An AUC of 0.99 on a task where people manage 0.75 is not a triumph, it is a warning — check before celebrating." },
      { h: "Debugging by symptom" },
      { table: { head: ["Symptom", "Common cause", "What to do"], rows: [
        ["High accuracy, useless in practice", "Imbalanced data", "Look at the confusion matrix · switch to PR-AUC"],
        ["Train high, validation low", "Overfitting", "Regularise · more data · smaller model"],
        ["Both low together", "Underfitting", "Bigger model · better features"],
        ["Validation better than train", "Regularisers off at evaluation · an easy fold · leakage", "Check those three, in that order"],
        ["Scores swing across folds", "Little data · unstratified folds", "More folds · stratify · always report ±"],
        ["Good in the lab, bad in production", "Leakage · distribution shift · the wrong kind of split", "Check leakage first, then drift"],
        ["Cannot reproduce a run", "No seed · no record of the data version", "Record seed + data hash + git commit"]
      ]}},
      { h: "Rules that always apply" },
      { ul: [
        "**Baseline first, always** — a number with nothing to compare it to means nothing",
        "**Read the confusion matrix before any summary metric** — one number can hide anything",
        "**Report mean ± standard deviation**, never a bare mean",
        "**Touch the test set exactly once**, and write down when you did",
        "**Every feature must survive the question of whether it exists at prediction time** — that single question catches over half of all leakage",
        "**Keep raw data read-only**; every transformation must be regenerable from a script"
      ]},
      { h: "When to stop" },
      { p: "**Stop when the extra score no longer changes a decision.** If PR-AUC moving from 0.48 to 0.50 still means promoting the same 2,000 people, and almost the same 2,000 people, you are polishing a number rather than creating value." },
      { p: "That time pays back better spent on **post-deployment monitoring**, because a model quietly degrading does more damage than a model scoring slightly lower." },
      { h: "The mistakes that waste the most time" },
      { ul: [
        "**Tuning hyperparameters before the pipeline is trustworthy** — that is tuning into noise",
        "**Comparing models on different folds** — the difference you see may be the split",
        "**Using accuracy on imbalanced data** and then wondering why production disappoints",
        "**Forgetting the threshold is adjustable** and blaming the model for low recall",
        "**Multiplying an uncalibrated probability by money**"
      ]}
    ],
    eval: [
      { p: "Questions that test whether you understood the structure rather than memorised metric names." },
      { qa: [
        { q: "Why three splits rather than two?",
          a: "Validation is used to choose hyperparameters and compare models, which fits to it progressively. Letting the test set do that job makes the final score optimistic and leaves you without an honest estimate — the test set is a one-shot instrument." },
        { q: "What does cross-validation give you over a single split?",
          a: "Every example serves as validation once, so the data is used far better, and you get both a mean and a spread — the spread tells you whether the score is stable or an accident of how you happened to split." },
        { q: "How do you split time-series data, and why not randomly?",
          a: "Chronologically: train on the past and evaluate on the future. A random split lets the model learn from later data to predict earlier data, which is leakage that produces a beautiful and entirely worthless score." },
        { q: "How do you tell bias from variance in the numbers?",
          a: "By the gap between train and validation: both high and close together is bias (underfitting); train low with validation much higher is variance (overfitting). Reading the gap matters more than reading either number alone." },
        { q: "How do the fixes for overfitting and underfitting differ?",
          a: "Overfitting is fixed with more data, regularisation, a smaller model or early stopping. Underfitting is fixed with a bigger model, better features or less regularisation. More data helps the first and does nothing for the second." },
        { q: "Why is accuracy useless on imbalanced data?",
          a: "At 1% positives, answering negative every time scores 99% while catching nothing. The number is high and worthless — look at the confusion matrix and use precision, recall or PR-AUC instead." },
        { q: "How do precision and recall differ, and how do you choose?",
          a: "Precision is how many of your flags were right; recall is how many of the real cases you caught. Choose by cost: expensive false alarms favour precision, expensive misses favour recall — and the two trade off through the threshold, not the model." },
        { q: "When should PR-AUC replace ROC-AUC?",
          a: "Under heavy imbalance, because ROC uses a false-positive rate whose denominator is dominated by an enormous TN count, so it always looks good. PR-AUC never touches TN and reflects real quality on the positive class." },
        { q: "What is calibration and how do you check it?",
          a: "Whether the stated probability matches the observed frequency — 0.8 that is right 60% of the time is overconfident. Check with a reliability curve and fix with Platt scaling or isotonic regression fitted on separately held-out data." },
        { q: "Does a high AUC mean the model is well calibrated?",
          a: "No. AUC measures **ranking**; calibration measures whether the probability numbers can be believed. A model can order everything correctly while overstating every probability. If a probability drives a decision, look at log loss or Brier instead." },
        { q: "What is data leakage, with the most common example?",
          a: "Information that would not be available at prediction time reaching the training process. The most common instance is fitting a scaler on all the data before splitting; the second is a feature recorded after the event being predicted." },
        { q: "How do you know leakage is present?",
          a: "A score better than the problem allows is the first signal. Then ask of every feature whether its value is known at prediction time — that single question catches more than half of all cases." },
        { q: "Why use a Pipeline beyond tidiness?",
          a: "Because it makes leakage structurally impossible: during cross-validation every transformer is refitted inside each fold automatically, which a hand-written loop usually gets wrong." },
        { q: "Where does the 0.5 threshold come from, and should you use it?",
          a: "It is only a library default and was never shown to suit any particular problem. Choose it from the costs of false positives and negatives, or from a real budget — for example the top k% by score." },
        { q: "What do you try first on imbalanced data?",
          a: "Change the metric, always. Then class weights, which are easy and safe. Only after that consider resampling, and it must happen **inside the training set after splitting**, or it leaks." },
        { q: "What does the curse of dimensionality break?",
          a: "As dimensions grow, distances between points converge, which directly degrades distance-based models like kNN and k-means, and covering the same fraction of the space needs exponentially more data." },
        { q: "In what order should models be tried?",
          a: "Baseline → linear or logistic → gradient boosting → neural network, stopping as soon as something is good enough. Boosting usually wins on tabular data; neural networks earn their cost only on unstructured data." },
        { q: "What does a learning curve tell you?",
          a: "Whether collecting more data is worth it — if train and validation converge at a low level, the problem is bias and more data will not help; if they are still apart and validation is still rising, more data will." },
        { q: "How can validation legitimately beat training?",
          a: "In order of likelihood: dropout and other regularisers run during training but not evaluation (normal); the validation split happens to be easier; or there is leakage, which must be checked immediately." },
        { q: "When should you stop improving a model?",
          a: "When the extra score no longer changes a decision. If the same budget still reaches nearly the same people, you are polishing a number — the remaining time pays back better on post-deployment monitoring." }
      ]},
      { h: "Further reading" },
      { links: [
        { label: "scikit-learn — Cross-validation", url: "https://scikit-learn.org/stable/modules/cross_validation.html", note: "Every splitter with diagrams, including GroupKFold and TimeSeriesSplit" },
        { label: "scikit-learn — Metrics and scoring", url: "https://scikit-learn.org/stable/modules/model_evaluation.html", note: "Definitions of every metric, each with its caveats" },
        { label: "scikit-learn — Probability calibration", url: "https://scikit-learn.org/stable/modules/calibration.html", note: "Reliability curves, Platt scaling and isotonic regression with examples" },
        { label: "Google — Rules of Machine Learning", url: "https://developers.google.com/machine-learning/guides/rules-of-ml", note: "Forty-three rules from production experience — read rules 1-15 before starting anything" },
        { label: "Kaggle — Data Leakage", url: "https://www.kaggle.com/code/alexisbcook/data-leakage", note: "Concrete leakage examples with code" },
        { label: "The Precision-Recall Plot Is More Informative than the ROC Plot", url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0118432", note: "The paper showing why ROC misleads on imbalanced data" }
      ]}
    ]
  }
});
