/* CNN — convolutional networks for images */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

window.TEACHING_DATA.push({
  id: "ml_cnn",
  name: "CNN — เครือข่ายคอนโวลูชันสำหรับภาพ",
  nameEn: "CNN — Convolutional Networks for Images",
  titleShort: { th: "CNN", en: "CNN" },
  tag: {
    th: "dense layer บนภาพ 224×224×3 ใช้ 150,528 น้ำหนักต่อหนึ่งนิวรอน · conv ใช้ 1,792 ตัวทั้งชั้น — ช่องว่างนี้คือเหตุผลทั้งหมด และมันมาจากสมมติฐานสองข้อเรื่องภาพที่บังเอิญเป็นจริง",
    en: "A dense layer on a 224×224×3 image needs 150,528 weights per neuron; a conv layer needs 1,792 for the whole layer — that gap is the entire motivation, and it comes from two assumptions about images that happen to be true"
  },
  accent: "#34d399",
  sections: {
    principle: [
      { h: "ตัวเลขที่อธิบายทุกอย่าง" },
      { code: String.raw`ภาพ 224 × 224 × 3 = 150,528 ค่า

dense layer ไป 1000 คลาส:  150,528 × 1000 + 1000 = 150,529,000 พารามิเตอร์
conv 3×3 จาก 3 ไป 64 ช่อง:  3 × 3 × 3 × 64 + 64 =        1,792 พารามิเตอร์`,
        cap: "ต่างกันแปดหมื่นเท่า และ conv ยัง 'เห็น' ภาพได้ทั้งภาพเพราะเลื่อนไปทุกตำแหน่ง", lang: "txt" },
      { h: "สมมติฐานสองข้อที่ทำให้ทำแบบนี้ได้" },
      { table: { head: ["สมมติฐาน", "ความหมาย", "ได้อะไรมา"], rows: [
        ["**locality**", "พิกเซลเกี่ยวกับเพื่อนบ้าน ไม่เกี่ยวกับพิกเซลอีกฟากของภาพ", "นิวรอนมองแค่หน้าต่างเล็ก ๆ ก็พอ"],
        ["**translation equivariance**", "ขอบก็คือขอบ ไม่ว่าจะอยู่ตรงไหนของภาพ", "**ใช้ filter ตัวเดียวกันซ้ำทุกตำแหน่ง** = weight sharing"]
      ]}},
      { p: "**คุณสมบัติทุกอย่างของ CNN ตกทอดมาจากสองข้อนี้** — และถ้างานไหนไม่เข้าสมมติฐาน เช่นตารางที่คอลัมน์ไม่เกี่ยวกัน convolution ก็เป็นเครื่องมือผิด ซึ่งไม่ได้บอกอะไรเลยว่า CNN ดีหรือไม่ดี" },
      { h: "ต่อจากหน้าที่แล้วอย่างไร" },
      { table: { head: ["หน้าที่แล้ว", "หน้านี้"], rows: [
        ["ชั้น dense เชื่อมทุก input เข้าทุกนิวรอน", "**เชื่อมเฉพาะเพื่อนบ้าน และใช้น้ำหนักชุดเดียวกันทุกตำแหน่ง**"],
        ["backpropagation ผ่านการคูณเมทริกซ์", "รูปเดิมทั้งหมด — convolution ก็คือการคูณเมทริกซ์แบบมีโครงสร้าง"],
        ["vanishing gradient เป็นผลคูณ", "**residual connection ใส่ `+1` เข้าไปในผลคูณนั้น**"],
        ["augmentation อยู่ในตาราง regularization", "ในงานภาพ มันมักแรงกว่า dropout กับ weight decay รวมกัน"]
      ]}},
      { h: "หน้านี้จะทำให้ทำได้" },
      { ul: [
        "คำนวณ output shape ของทุกชั้นได้ และอ่าน error เรื่อง shape ที่ classifier head ออก",
        "อธิบายว่าทำไม 3×3 สองชั้นดีกว่า 5×5 ชั้นเดียว ด้วยตัวเลข ไม่ใช่ธรรมเนียม",
        "รู้ว่าทำไม ResNet ลึก 152 ชั้นได้ ทั้งที่เครือข่ายธรรมดาผ่าน 20 ชั้นไม่ได้",
        "เลือกระหว่างเทรนใหม่กับ fine-tune และรู้ว่าต้องแช่แข็งชั้นไหน ใช้ learning rate เท่าไร",
        "เลือก augmentation ที่ไม่ทำลาย label"
      ]}
    ],

    theory: [
      { p: "หมวดนี้ประกอบ CNN ทีละชิ้น โดยแต่ละชิ้นมีหน้าที่ชัดเจน" },
      { h: "1) convolution คืออะไร" },
      { code: String.raw`เลื่อนหน้าต่างเล็ก ๆ (kernel) ไปทั่วภาพ
ที่แต่ละตำแหน่ง: คูณทีละช่องแล้วบวกรวม

kernel ตัวเดียวกันใช้ซ้ำทุกตำแหน่ง
→ ถ้าเรียนรู้ที่จะจับขอบแนวตั้งได้ ก็จับได้ทั้งภาพทันที`,
        cap: "นี่คือ weight sharing และเป็นสิ่งที่ทำให้จำนวนพารามิเตอร์ไม่ขึ้นกับขนาดภาพเลย", lang: "txt" },
      { h: "2) สูตรขนาด output ที่ต้องจำ" },
      { code: String.raw`out = floor((in + 2·padding − kernel) / stride) + 1

padding แบบ 'same' ที่ stride 1:  padding = (kernel − 1)/2  →  out = in

3×3 pad 1 stride 1  →  ขนาดเท่าเดิม      ← ตัวหลักที่ใช้ทั่วไป
3×3 pad 1 stride 2  →  ขนาดครึ่งหนึ่ง
7×7 pad 3 stride 2  →  ขนาดครึ่งหนึ่ง     ← ชั้นแรกของ ResNet`,
        cap: "จำสูตรนี้แล้วจะไม่เดา shape อีกเลย และ error ที่ classifier head จะอ่านออกทันที", lang: "txt" },
      { h: "3) จำนวนพารามิเตอร์ของ conv" },
      { code: String.raw`พารามิเตอร์ = k · k · C_in · C_out + C_out
                                        ‾‾‾‾‾
                                        bias หนึ่งตัวต่อช่อง output

**ไม่ขึ้นกับขนาดภาพเลย** — 3×3 จาก 64 ไป 64 ช่อง ใช้ 36,928 ตัว
ไม่ว่าภาพจะเป็น 32×32 หรือ 1024×1024`,
        cap: "จุดนี้คือความต่างเชิงโครงสร้างจาก dense layer ที่พารามิเตอร์โตตามขนาด input โดยตรง", lang: "txt" },
      { h: "4) ช่อง (channel) คืออะไร" },
      { table: { head: ["ตำแหน่ง", "ช่องหมายถึง"], rows: [
        ["input", "R, G, B — สามช่อง"],
        ["ชั้นต้น ๆ", "**ขอบแนวตั้ง แนวนอน แนวเฉียง จุดสี** — filter แต่ละตัวจับคนละอย่าง"],
        ["ชั้นกลาง", "มุม เส้นโค้ง ลายซ้ำ"],
        ["ชั้นลึก", "ส่วนของวัตถุ เช่นล้อ ตา หน้า"]
      ]}},
      { p: "**และนี่ไม่ใช่การตีความภายหลัง** — เอา filter ของชั้นแรกมาแสดงเป็นภาพจะเห็นตัวจับขอบชัดเจน ซึ่งเป็นสิ่งที่ตรงกับตัวจับขอบที่คนออกแบบด้วยมือมาก่อนหน้านั้นหลายสิบปี" },
      { h: "5) receptive field — และเหตุผลที่ 3×3 ชนะ" },
      { code: String.raw`ซ้อน 3×3 stride 1 จำนวน L ชั้น → receptive field = 2L + 1

3×3 สองชั้น:   receptive field 5×5   พารามิเตอร์ 2 × (9·C²) = 18C²
5×5 ชั้นเดียว:  receptive field 5×5   พารามิเตอร์          25C²

ที่ C = 64:  73,856 เทียบกับ 102,464`,
        cap: "เห็นภาพเท่ากัน แต่พารามิเตอร์น้อยกว่า และได้ non-linearity เพิ่มมาอีกหนึ่งชั้นฟรี", lang: "txt" },
      { note: "**นี่คือเหตุผลที่ VGG เป็นต้นมาใช้ 3×3 แทบล้วน ๆ** — ไม่ใช่ธรรมเนียม แต่เป็นการเปรียบเทียบที่ตัวเลขชี้ทางเดียว" },
      { h: "6) pooling เทียบ strided convolution" },
      { table: { head: ["", "max pooling", "conv stride 2"], rows: [
        ["ทำอะไร", "เอาค่าสูงสุดในหน้าต่าง", "เรียนรู้เองว่าจะลดขนาดยังไง"],
        ["พารามิเตอร์", "**ศูนย์**", "มี"],
        ["ทนต่อการเลื่อนเล็กน้อย", "**ดี**", "ปานกลาง"],
        ["สถาปัตยกรรมยุคใหม่", "ใช้น้อยลง", "**นิยมกว่า**"]
      ]}},
      { h: "7) 1×1 convolution ทำอะไร" },
      { code: String.raw`kernel ขนาด 1×1 ไม่มองเพื่อนบ้านเลย แล้วมันมีประโยชน์อะไร

→ มันผสม **ช่อง** เข้าด้วยกัน ที่แต่ละตำแหน่งพิกเซล
→ ใช้ลดจำนวนช่องได้ถูกมาก: 1×1 จาก 256 ไป 64 = 16,448 พารามิเตอร์
   ขณะที่ 3×3 จาก 256 ไป 64 = 147,520
→ และเพิ่ม non-linearity ได้ในราคาถูก`,
        cap: "Inception กับ ResNet ใช้ 1×1 บีบช่องลงก่อนทำ 3×3 แล้วขยายกลับ เรียกว่า bottleneck", lang: "txt" },
      { h: "8) ก้อน conv มาตรฐาน" },
      { code: String.raw`Conv2d(3×3, pad 1, bias=False)
      ↓
BatchNorm2d                     ← มี bias ในตัวอยู่แล้ว conv จึงไม่ต้องมี
      ↓
ReLU
      ↓
(ทำซ้ำ) แล้วค่อยลดขนาดด้วย stride 2 หรือ pooling`,
        cap: "`bias=False` เมื่อมี batch norm ตามหลัง ไม่ใช่การประหยัด แต่เพราะ bias ถูกหักทิ้งโดย normalization อยู่แล้ว", lang: "txt" },
      { h: "9) global average pooling — ทำไมมันแทน dense head" },
      { code: String.raw`แบบเก่า:  feature map (4, 4, 128) → flatten 2048 → dense 256
          พารามิเตอร์ของหัวอย่างเดียว = 2048 × 256 + 256 = 524,544

แบบใหม่:  feature map (4, 4, 128) → เฉลี่ยทั้งภาพต่อช่อง → 128 → dense 256
          พารามิเตอร์ = 128 × 256 + 256 = 33,024`,
        cap: "ลดลง 16 เท่า และรับภาพขนาดไหนก็ได้ เพราะเฉลี่ยทั้งแผ่นไม่ว่าแผ่นจะใหญ่แค่ไหน", lang: "txt" },
      { h: "10) residual connection — และเหตุผลที่ ResNet เปลี่ยนทุกอย่าง" },
      { code: String.raw`ปัญหาที่พบก่อนหน้า: เครือข่ายธรรมดาลึกเกิน 20 ชั้นแล้ว **แย่ลง**
                    และแย่ลงที่ training loss ด้วย → ไม่ใช่ overfit
                    แต่เป็นความล้มเหลวของการ optimize

residual:  y = F(x) + x

∂y/∂x = ∂F/∂x + 1
                ‾‾‾
                พจน์นี้ทำให้ผลคูณข้ามชั้นยุบเป็นศูนย์ไม่ได้`,
        cap: "เลข 1 ตัวเดียวนั้นคือเหตุผลที่ 152 ชั้นกลายเป็นสิ่งที่เทรนได้", lang: "txt" },
      { note: "**อธิบาย ResNet โดยไม่พูดถึง `+1` ในอนุพันธ์คือการพลาดจุดสำคัญ** — มันไม่ใช่ 'ทางลัดให้ข้อมูลไหลผ่าน' แบบคลุมเครือ แต่คือการรับประกันว่ามีเส้นทาง gradient ที่คูณด้วย 1 เสมอ" },
      { h: "11) สายสถาปัตยกรรม แบบย่อ" },
      { table: { head: ["โมเดล", "ปี", "สิ่งที่มันเพิ่มเข้ามา"], rows: [
        ["**LeNet-5**", "1998", "conv + pool + dense บนตัวเลขลายมือ"],
        ["**AlexNet**", "2012", "ReLU, dropout, GPU, augmentation — รันที่จุดประกายทุกอย่าง"],
        ["**VGG**", "2014", "ใช้ 3×3 อย่างเดียว ซ้อนลึก สม่ำเสมอมากและหนักมาก"],
        ["**Inception**", "2014", "หลาย kernel ขนานกัน · 1×1 ลดต้นทุน"],
        ["**ResNet**", "2015", "**residual connection — ความลึกกลายเป็นของฟรี**"],
        ["**MobileNet**", "2017", "depthwise separable conv ถูกลงราว 8-9 เท่า"],
        ["**EfficientNet**", "2019", "ขยายความลึก ความกว้าง และความละเอียดพร้อมกัน"],
        ["**ConvNeXt**", "2022", "CNN ที่จูนด้วยสูตรเทรนยุค transformer แล้วกลับมาสูสีอีกครั้ง"]
      ]}},
      { h: "12) depthwise separable convolution" },
      { code: String.raw`ปกติ:  3×3 จาก 64 ไป 128 ช่อง = 73,856 พารามิเตอร์
        ทำสองอย่างพร้อมกัน: กรองเชิงพื้นที่ + ผสมช่อง

แยกเป็นสองขั้น:
   depthwise  3×3 แยกทีละช่อง       = 3·3·64 + 64  =    640
   pointwise  1×1 จาก 64 ไป 128     = 64·128 + 128 =  8,320
                                       รวม             8,960

ถูกลง 8.2 เท่า`,
        cap: "นี่คือหัวใจของ MobileNet และเหตุผลที่โมเดลบนมือถือทำงานได้จริง", lang: "txt" }
    ],

    foundations: [
      { p: "หมวดนี้เจาะกลไกที่ตัดสินว่า CNN จะทำงานได้แค่ไหน" },
      { h: "พารามิเตอร์ไปกองอยู่ตรงไหนจริง ๆ" },
      { code: String.raw`CNN เล็ก ๆ บนภาพ 32×32×3

conv 3×3   3 →  32        896
conv 3×3  32 →  64     18,496
conv 3×3  64 → 128     73,856
                       ‾‾‾‾‾‾
   รวมส่วน conv        93,248

flatten (4,4,128) = 2048 → dense 256   524,544    ← หัวใหญ่กว่าตัวเครือข่ายทั้งก้อน
dense 256 → 10                           2,570

รวมทั้งหมด 620,362  โดย 85% อยู่ที่หัวชั้นเดียว`,
        cap: "นี่คือเหตุผลที่ global average pooling เข้ามาแทน — เปลี่ยนหัวแล้วเหลือ 128,842 ตัว", lang: "txt" },
      { h: "receptive field โตยังไงเมื่อมี stride" },
      { code: String.raw`ไม่มี stride:  3×3 L ชั้น → receptive field 2L + 1  (โตเชิงเส้น ช้ามาก)
มี stride 2:   ทุกครั้งที่ลดขนาดครึ่งหนึ่ง receptive field โตเป็นสองเท่า

ResNet-50 ชั้นสุดท้ายมี receptive field ใหญ่กว่าภาพ input ทั้งภาพ
→ นิวรอนตัวหนึ่งจึง 'เห็น' ทุกพิกเซล ทั้งที่ทุกชั้นมองแค่ 3×3`,
        cap: "การลดขนาดจึงไม่ใช่แค่การประหยัดหน่วยความจำ แต่เป็นวิธีเดียวที่จะมองเห็นภาพรวมได้ในเครือข่ายที่ลึกไม่มาก", lang: "txt" },
      { h: "ทำไม conv ถึงเป็นการคูณเมทริกซ์" },
      { code: String.raw`im2col: กางทุกหน้าต่างออกเป็นแถวของเมทริกซ์

ภาพ (H, W, C_in) + kernel k×k
   → เมทริกซ์ (H·W, k·k·C_in)
   → คูณกับ (k·k·C_in, C_out)
   → ได้ (H·W, C_out) แล้วพับกลับเป็น feature map`,
        cap: "จึงใช้ GPU ได้เต็มที่ และ backpropagation ก็เป็นรูปเดิมกับหน้าที่แล้วทุกประการ", lang: "txt" },
      { h: "batch norm ในก้อน conv" },
      { code: String.raw`normalize แยกตาม **ช่อง** โดยเฉลี่ยข้ามทั้ง batch และทั้งพื้นที่ภาพ

feature map (N, C, H, W)
   → คำนวณค่าเฉลี่ยและความแปรปรวนของแต่ละช่อง จากตัวเลข N·H·W ตัว
   → จึงมีพารามิเตอร์ γ กับ β อย่างละ C ตัวเท่านั้น`,
        cap: "การเฉลี่ยข้ามพื้นที่ภาพด้วยคือเหตุผลที่ batch norm ของ conv ทนต่อ batch เล็กได้ดีกว่าใน dense layer เล็กน้อย", lang: "txt" },
      { h: "การเตรียมภาพที่ต้องตรงกับ checkpoint" },
      { code: String.raw`โมเดล ImageNet ที่โหลดมา ถูกเทรนด้วยค่าคงที่ชุดนี้:

   mean = [0.485, 0.456, 0.406]
   std  = [0.229, 0.224, 0.225]

ใช้ค่าอื่น (เช่นหาร 255 เฉย ๆ) → ความแม่นยำตกโดยไม่มี error ใด ๆ แจ้ง`,
        cap: "เป็นหนึ่งในสาเหตุที่พบบ่อยที่สุดของ 'fine-tune แล้วผลแย่กว่าที่ควร' และหายากที่สุดด้วย", lang: "txt" },
      { h: "augmentation ที่ทำลาย label" },
      { table: { head: ["การแปลง", "ปลอดภัยกับ", "ทำลาย label เมื่อ"], rows: [
        ["**พลิกแนวนอน**", "แมว หมา วิว", "**ตัวเลข ตัวอักษร ป้ายจราจร** (2 กับ 5 ไม่รอดกระจก)"],
        ["**พลิกแนวตั้ง**", "ภาพถ่ายดาวเทียม กล้องจุลทรรศน์", "ภาพทั่วไปแทบทั้งหมด"],
        ["**หมุนแรง ๆ**", "ภาพทางการแพทย์บางชนิด", "งานที่ทิศทางมีความหมาย"],
        ["**เปลี่ยนสี**", "งานจำแนกวัตถุทั่วไป", "**งานที่สีคือคำตอบ** เช่นแยกสุกของผลไม้"],
        ["**ครอบตัดแรง ๆ**", "วัตถุใหญ่กลางภาพ", "วัตถุเล็ก อาจครอบจนวัตถุหายไปทั้งตัว"]
      ]}},
      { note: "**augmentation ที่ทำลาย label มองไม่เห็นจากเส้น loss เลย** — โมเดลจะเรียนรู้ได้ช้าลงหรือเพดานต่ำลงเฉย ๆ วิธีเดียวที่จับได้คือเปิดภาพที่ผ่าน augmentation แล้วดูด้วยตาตัวเอง" },
      { h: "ทำไม fine-tune ต้องใช้ learning rate เล็กกว่ามาก" },
      { code: String.raw`น้ำหนักที่ pretrain มาแล้วอยู่ในบริเวณที่ดีของ loss landscape

lr ปกติ (1e-3) ที่ก้าวแรก → เหวี่ยงออกจากบริเวณนั้นทันที
                            เท่ากับทิ้งทุกอย่างที่ pretrain มา

lr เล็ก (1e-5 ถึง 1e-4)    → ขยับอยู่ในบริเวณเดิม ปรับให้เข้ากับงานใหม่`,
        cap: "และนี่คือเหตุผลที่ลำดับ 'แช่แข็งก่อน แล้วค่อยปลด' ได้ผล — หัวที่สุ่มมาใหม่ต้องนิ่งก่อนถึงจะปล่อย gradient เข้าไปแตะ backbone ได้", lang: "txt" }
    ],

    architecture: [
      { p: "หมวดนี้คือการเลือกโครงและลำดับการตัดสินใจสำหรับงานภาพ" },
      { h: "เริ่มยังไงเมื่อมีงานภาพใหม่" },
      { code: String.raw`มีภาพกี่ภาพ?

< 1,000        → fine-tune แบบแช่แข็ง backbone ทั้งหมด เทรนแค่หัว
1,000-10,000   → fine-tune ปลดชั้นบน ๆ ออก
10,000-100,000 → fine-tune ทั้งโมเดลด้วย lr เล็ก
> 100,000      → เทรนใหม่ทั้งหมดเริ่มมีเหตุผล แต่ pretrain ยังมักชนะอยู่ดี`,
        cap: "**transfer learning คือค่าเริ่มต้น ไม่ใช่ทางเลือกสำรอง** — การเทรนใหม่แทบไม่เคยถูกต้องเมื่อภาพมีไม่ถึงหลักหมื่น", lang: "txt" },
      { h: "ลำดับการ fine-tune" },
      { code: String.raw`1. แช่แข็ง backbone ทั้งหมด เทรนเฉพาะหัวใหม่   lr ≈ 1e-3
   → ให้หัวที่สุ่มมาเข้าที่ก่อน ไม่ให้ gradient มั่ว ๆ ไปทำลาย backbone

2. ปลดชั้นบน ๆ ออก fine-tune ต่อ                lr ≈ 1e-4 หรือต่ำกว่า

3. ปลดทั้งหมด เมื่อมีข้อมูลมากพอเท่านั้น        lr ≈ 1e-5`,
        cap: "ข้ามขั้นที่ 1 ไปปลดทั้งหมดเลยคือความผิดพลาดที่พบบ่อยที่สุดของ transfer learning", lang: "txt" },
      { h: "เลือก backbone ยังไง" },
      { table: { head: ["ข้อจำกัด", "เลือก", "เหตุผล"], rows: [
        ["ทั่วไป ไม่มีข้อจำกัดพิเศษ", "**ResNet-50**", "เข้าใจง่าย ผลดี มีตัวอย่างเยอะที่สุด"],
        ["ต้องรันบนมือถือหรือ edge", "**MobileNetV3 · EfficientNet-B0**", "depthwise separable ทำให้ถูกลงหลายเท่า"],
        ["ต้องการความแม่นยำสูงสุด มี GPU", "**ConvNeXt · EfficientNetV2**", "สูตรเทรนยุคใหม่ ดันเพดานขึ้นไปอีก"],
        ["ข้อมูลน้อยมาก", "**ResNet-18 หรือเล็กกว่า**", "โมเดลใหญ่จะ overfit ทันที"]
      ]}},
      { h: "โครงของงานภาพแต่ละแบบ" },
      { code: String.raw`classification:   backbone → global average pool → dense → คลาส
segmentation:     backbone (ลดขนาด) → decoder (ขยายกลับ) → หนึ่งคลาสต่อพิกเซล
                  พร้อม skip connection จากชั้นเดียวกันฝั่งลด (U-Net)
detection:        backbone → feature pyramid → หัวทำนายกล่อง + คลาส`,
        cap: "ทั้งสามใช้ backbone เดียวกันได้ ต่างกันที่สิ่งที่ต่อท้าย — จึง pretrain ครั้งเดียวใช้ได้หลายงาน", lang: "txt" },
      { h: "ชุด augmentation ที่ใช้ได้เลย" },
      { code: String.raw`งานจำแนกวัตถุทั่วไป:
   RandomResizedCrop(224, scale=(0.7, 1.0))
   RandomHorizontalFlip()
   ColorJitter(0.2, 0.2, 0.2)
   Normalize(mean, std)  ← ต้องตรงกับ checkpoint

ตอน validation ห้ามใส่อะไรที่สุ่ม:
   Resize(256) → CenterCrop(224) → Normalize`,
        cap: "augmentation ที่ validation ทำให้คะแนนแกว่งและเทียบกันไม่ได้ระหว่าง epoch", lang: "txt" },
      { h: "ตัวเลขที่ควรตั้งไว้ก่อน" },
      { table: { head: ["ตัว", "ค่า", "หมายเหตุ"], rows: [
        ["optimizer", "**AdamW** หรือ **SGD momentum 0.9**", "งานภาพ SGD ที่จูนดีมักชนะเล็กน้อย"],
        ["learning rate (เทรนใหม่)", "**0.1 × batch/256** สำหรับ SGD", "กฎสเกลเชิงเส้นจากหน้าที่แล้ว"],
        ["learning rate (fine-tune)", "**1e-4 ถึง 1e-5**", "เล็กกว่าเทรนใหม่ราวร้อยเท่า"],
        ["weight decay", "**1e-4** (SGD) · **0.05** (AdamW งานภาพ)", "งานภาพใช้สูงกว่างานข้อความ"],
        ["schedule", "**cosine + warmup**", "มาตรฐานปัจจุบัน"],
        ["label smoothing", "**0.1**", "มาตรฐานของงานจำแนกภาพยุคใหม่"]
      ]}},
      { note: "**ตรวจ shape หลังทุกก้อนก่อนเทรนจริงหนึ่งครั้งเสมอ** — ความล้มเหลวส่วนใหญ่ของ CNN คือ shape ผิดที่ classifier head และเห็นได้ทันทีจากการพิมพ์ขนาดออกมาไล่ตั้งแต่ชั้นแรก" }
    ],

    dataflow: [
      { p: "ทำ convolution ด้วยมือจนครบ แล้วไล่ shape ของเครือข่ายจริงทั้งตัว" },
      { h: "ภาพ input" },
      { code: String.raw`ภาพ 5×5 ที่มีแถบสว่างแนวตั้งอยู่ตรงกลาง (คอลัมน์ที่ 2)

   10  10  80  10  10
   10  10  80  10  10
   10  10  80  10  10
   10  10  80  10  10
   10  10  80  10  10`,
        cap: "แถบเดียวกลางภาพ — เล็กพอทำมือ แต่มีขอบสองด้านให้ตรวจว่า filter จับได้จริง", lang: "txt" },
      { h: "kernel จับขอบแนวตั้ง" },
      { code: String.raw`Kᵥ =   1   0  −1
        2   0  −2
        1   0  −1

ฝั่งซ้ายบวก ฝั่งขวาลบ คอลัมน์กลางไม่มีน้ำหนัก
→ ให้ค่ามากเมื่อซ้ายสว่างกว่าขวา และค่าติดลบเมื่อขวาสว่างกว่า`,
        cap: "นี่คือ Sobel ที่คนออกแบบด้วยมือมาตั้งแต่ก่อนมี CNN — และเป็นสิ่งที่ชั้นแรกเรียนรู้ได้เอง", lang: "txt" },
      { h: "คำนวณช่องแรก" },
      { code: String.raw`หน้าต่างที่มุมซ้ายบน ครอบคอลัมน์ 0-2:

   10·1 + 10·0 + 80·(−1)
 + 10·2 + 10·0 + 80·(−2)
 + 10·1 + 10·0 + 80·(−1)

 = (10 − 80) + (20 − 160) + (10 − 80)
 = −70 − 140 − 70 = −280`,
        cap: "ติดลบเพราะฝั่งขวาของหน้าต่างสว่างกว่าฝั่งซ้าย — คือขอบด้านซ้ายของแถบพอดี", lang: "txt" },
      { h: "คำนวณช่องขวาสุด" },
      { code: String.raw`หน้าต่างที่ครอบคอลัมน์ 2-4:

   80·1 + 10·0 + 10·(−1)
 + 80·2 + 10·0 + 10·(−2)
 + 80·1 + 10·0 + 10·(−1)

 = 70 + 140 + 70 = +280`,
        cap: "เป็นบวกเพราะฝั่งซ้ายสว่างกว่า — คือขอบด้านขวาของแถบ เครื่องหมายบอกทิศของขอบ", lang: "txt" },
      { h: "output ทั้งแผ่น" },
      { code: String.raw`5×5 กับ kernel 3×3 ไม่ใส่ padding → (5 − 3)/1 + 1 = 3

   −280    0   +280
   −280    0   +280
   −280    0   +280`,
        cap: "จับขอบทั้งสองด้านของแถบได้พร้อมกัน และตรงกลางแถบเป็นศูนย์เพราะสองข้างสว่างเท่ากัน", lang: "txt" },
      { h: "kernel คนละทิศให้ผลอะไร" },
      { code: String.raw`Kₕ =   1   2   1        kernel จับขอบแนวนอน
        0   0   0
       −1  −2  −1

ผลบนภาพเดิม:
    0   0   0
    0   0   0
    0   0   0`,
        cap: "ศูนย์ทั้งแผ่น เพราะภาพนี้ไม่มีขอบแนวนอนเลย — filter แต่ละตัวจึงจับคนละอย่างจริง ๆ", lang: "txt" },
      { h: "ใส่ padding แล้วขนาดคงเดิม" },
      { code: String.raw`เติมศูนย์รอบภาพหนึ่งชั้น → (5 + 2 − 3)/1 + 1 = 5

แถวกลางของ output:
   −40   −280    0   +280   +40

ขอบซ้ายและขวาของ output มีค่าเล็ก ๆ ที่ไม่มีในเวอร์ชันไม่มี padding
เพราะหน้าต่างครอบพื้นที่ที่เติมศูนย์เข้าไป`,
        cap: "นี่คือ artifact ของขอบภาพจาก zero padding — เป็นราคาที่จ่ายเพื่อรักษาขนาดไว้", lang: "txt" },
      { h: "pooling ด้วยตัวเลข" },
      { code: String.raw`input 4×4:            max pool 2×2 stride 2:      average pool:
   1  3  2  4              6   8                    3.75  5.25
   5  6  7  8              9   6                    3.75  3.75
   9  2  3  1
   4  0  6  5

max เก็บ 'มีอะไรอยู่ไหม' · average เก็บ 'โดยรวมสว่างแค่ไหน'`,
        cap: "max pooling นิยมกว่าในชั้นกลาง เพราะการมีอยู่ของ feature สำคัญกว่าค่าเฉลี่ยของมัน", lang: "txt" },
      { h: "ไล่ shape ของเครือข่ายจริงทั้งตัว" },
      { code: String.raw`input                                  (N,   3, 224, 224)
conv 7×7  s2 p3  → 64 ช่อง             (N,  64, 112, 112)
maxpool 3×3 s2                          (N,  64,  56,  56)
stage1  conv 3×3 ×2                     (N,  64,  56,  56)
stage2  conv 3×3 s2 ×2 → 128            (N, 128,  28,  28)
stage3  conv 3×3 s2 ×2 → 256            (N, 256,  14,  14)
stage4  conv 3×3 s2 ×2 → 512            (N, 512,   7,   7)
global average pool                     (N, 512)
dense → 1000                            (N, 1000)`,
        cap: "นี่คือ ResNet-18 ทั้งตัว — ทุกบรรทัดตรวจได้ด้วยสูตรขนาด output ที่จำไว้", lang: "txt" },
      { h: "ตรวจบรรทัดหนึ่งด้วยสูตร" },
      { code: String.raw`ชั้นแรก: in = 224 · kernel = 7 · padding = 3 · stride = 2

out = floor((224 + 2·3 − 7) / 2) + 1
    = floor(223 / 2) + 1
    = 111 + 1 = 112   ✓`,
        cap: "ทำแบบนี้กับทุกบรรทัดได้ และควรทำก่อนเทรนจริงเสมอ", lang: "txt" }
    ],

    implementation: [
      { p: "โค้ดของทุกอย่างในหน้านี้ พร้อมจุดที่พลาดบ่อย" },
      { h: "1) ก้อน conv มาตรฐาน" },
      { code: String.raw`import torch.nn as nn

def conv_block(c_in, c_out, stride=1):
    return nn.Sequential(
        nn.Conv2d(c_in, c_out, 3, stride=stride, padding=1, bias=False),
        nn.BatchNorm2d(c_out),      # มี bias ในตัว conv จึงไม่ต้องมี
        nn.ReLU(inplace=True),
    )`,
        cap: "`bias=False` เพราะ batch norm หัก mean ออกอยู่แล้ว bias ของ conv จึงไม่มีผลใด ๆ", lang: "python" },
      { h: "2) residual block" },
      { code: String.raw`class ResidualBlock(nn.Module):
    def __init__(self, c_in, c_out, stride=1):
        super().__init__()
        self.conv1 = conv_block(c_in, c_out, stride)
        self.conv2 = nn.Sequential(
            nn.Conv2d(c_out, c_out, 3, padding=1, bias=False),
            nn.BatchNorm2d(c_out),
        )
        self.skip = nn.Identity()
        if stride != 1 or c_in != c_out:        # shape ไม่ตรง ต้องปรับด้วย 1×1
            self.skip = nn.Sequential(
                nn.Conv2d(c_in, c_out, 1, stride=stride, bias=False),
                nn.BatchNorm2d(c_out),
            )
        self.relu = nn.ReLU(inplace=True)

    def forward(self, x):
        return self.relu(self.conv2(self.conv1(x)) + self.skip(x))`,
        cap: "**ReLU อยู่หลังการบวก ไม่ใช่ก่อน** — ใส่ก่อนบวกแล้วเส้นทาง identity จะถูกตัดที่ค่าติดลบ", lang: "python" },
      { h: "3) เครือข่ายเต็มพร้อม global average pooling" },
      { code: String.raw`class SmallResNet(nn.Module):
    def __init__(self, n_classes=10):
        super().__init__()
        self.stem = conv_block(3, 64)
        self.stages = nn.Sequential(
            ResidualBlock(64, 64),
            ResidualBlock(64, 128, stride=2),
            ResidualBlock(128, 256, stride=2),
        )
        self.pool = nn.AdaptiveAvgPool2d(1)     # รับภาพขนาดไหนก็ได้
        self.fc = nn.Linear(256, n_classes)

    def forward(self, x):
        x = self.stages(self.stem(x))
        return self.fc(self.pool(x).flatten(1))`,
        cap: "`AdaptiveAvgPool2d(1)` คือสิ่งที่ทำให้โมเดลรับ input ขนาดไหนก็ได้ และตัดหัวหนัก ๆ ทิ้ง", lang: "python" },
      { h: "4) ตรวจ shape ทุกชั้นก่อนเทรน" },
      { code: String.raw`x = torch.randn(2, 3, 224, 224)
for name, module in model.named_children():
    x = module(x)
    print(f"{name:12s} {tuple(x.shape)}")

# stem         (2, 64, 224, 224)
# stages       (2, 256, 56, 56)
# pool         (2, 256, 1, 1)`,
        cap: "**ทำครั้งเดียวก่อนเทรนจริงเสมอ** — ความล้มเหลวส่วนใหญ่ของ CNN เห็นได้จากสามบรรทัดนี้", lang: "python" },
      { h: "5) นับพารามิเตอร์ต่อชั้น" },
      { code: String.raw`for name, p in model.named_parameters():
    if p.ndim == 4:                       # conv weight
        k, ci = p.shape[2], p.shape[1]
        print(f"{name:28s} {tuple(p.shape)}  {p.numel():>9,}")

print(f"total {sum(p.numel() for p in model.parameters()):,}")

# stem.0.weight        (64, 3, 3, 3)        1,728
# stages.0.conv1.0.weight (64, 64, 3, 3)   36,864
# total 2,796,362`,
        cap: "ตรงกับสูตร `k·k·C_in·C_out` เสมอ ถ้าไม่ตรงแปลว่าเข้าใจโครงสร้างผิด", lang: "python" },
      { h: "6) augmentation ที่ถูกต้อง" },
      { code: String.raw`from torchvision import transforms as T

MEAN, STD = [0.485, 0.456, 0.406], [0.229, 0.224, 0.225]

train_tf = T.Compose([
    T.RandomResizedCrop(224, scale=(0.7, 1.0)),
    T.RandomHorizontalFlip(),
    T.ColorJitter(0.2, 0.2, 0.2),
    T.ToTensor(),
    T.Normalize(MEAN, STD),
])

val_tf = T.Compose([                       # ห้ามมีอะไรสุ่มในนี้
    T.Resize(256),
    T.CenterCrop(224),
    T.ToTensor(),
    T.Normalize(MEAN, STD),
])`,
        cap: "**MEAN กับ STD ต้องตรงกับ checkpoint ที่โหลดมา** — ใช้ค่าอื่นแล้วความแม่นยำตกโดยไม่มี error", lang: "python" },
      { h: "7) ดูภาพที่ผ่าน augmentation ด้วยตาตัวเอง" },
      { code: String.raw`import matplotlib.pyplot as plt
import torch

mean = torch.tensor(MEAN).view(3, 1, 1)
std = torch.tensor(STD).view(3, 1, 1)

xb, yb = next(iter(train_loader))
fig, axes = plt.subplots(2, 8, figsize=(16, 4))
for ax, img, lab in zip(axes.flat, xb, yb):
    ax.imshow((img * std + mean).clamp(0, 1).permute(1, 2, 0))
    ax.set_title(classes[lab]); ax.axis("off")
plt.show()`,
        cap: "augmentation ที่ทำลาย label มองไม่เห็นจากเส้น loss เลย — วิธีเดียวที่จับได้คือเปิดดู", lang: "python" },
      { h: "8) transfer learning ขั้นที่ 1 — แช่แข็ง backbone" },
      { code: String.raw`import torchvision

model = torchvision.models.resnet50(weights="IMAGENET1K_V2")

for p in model.parameters():
    p.requires_grad = False                    # แช่แข็งทั้งหมด

model.fc = nn.Linear(model.fc.in_features, n_classes)   # หัวใหม่ ไม่แช่แข็ง

opt = torch.optim.AdamW(
    [p for p in model.parameters() if p.requires_grad], lr=1e-3
)`,
        cap: "ส่งเฉพาะพารามิเตอร์ที่ `requires_grad` เข้า optimizer ไม่งั้น weight decay จะไปแตะตัวที่แช่แข็งไว้", lang: "python" },
      { h: "9) transfer learning ขั้นที่ 2 — ปลดชั้นบนแล้ว fine-tune" },
      { code: String.raw`for name, p in model.named_parameters():
    if name.startswith(("layer4", "layer3", "fc")):
        p.requires_grad = True

opt = torch.optim.AdamW([
    {"params": model.fc.parameters(),      "lr": 1e-3},
    {"params": model.layer4.parameters(),  "lr": 1e-4},
    {"params": model.layer3.parameters(),  "lr": 1e-5},
], weight_decay=0.05)`,
        cap: "**learning rate ต่างกันตามความลึก** — ชั้นลึกที่จับ feature ทั่วไปควรขยับน้อยที่สุด", lang: "python" },
      { h: "10) ตรวจว่า batch norm อยู่โหมดไหนตอน fine-tune" },
      { code: String.raw`# แช่แข็งน้ำหนักแล้ว แต่ batch norm ยังอัปเดต running statistics อยู่
# ถ้าไม่ต้องการ ต้องบังคับให้อยู่โหมด eval ด้วย

def freeze_bn(module):
    for m in module.modules():
        if isinstance(m, nn.BatchNorm2d):
            m.eval()
            for p in m.parameters():
                p.requires_grad = False

model.train()
freeze_bn(model.layer1)        # ต้องเรียกหลัง model.train() ทุกครั้ง`,
        cap: "`requires_grad = False` ไม่หยุด running statistics — เป็นบั๊กที่เงียบและทำให้ผลค่อย ๆ เพี้ยนไปเรื่อย ๆ", lang: "python" }
    ],

    tricks: [
      { h: "ไล่ปัญหาตามอาการ" },
      { table: { head: ["อาการ", "สาเหตุ", "แก้ยังไง"], rows: [
        ["shape mismatch ที่ dense layer", "คำนวณขนาดหลัง conv ผิด", "พิมพ์ shape ทุกชั้น · ใช้ `AdaptiveAvgPool2d`"],
        ["fine-tune แล้วแย่กว่าที่ควรมาก", "**normalization ไม่ตรงกับ checkpoint**", "ใช้ mean/std ของชุดที่ pretrain มา"],
        ["fine-tune แล้วผลตกทันทีใน epoch แรก", "learning rate ใหญ่เกินสำหรับ pretrained", "ลดเหลือ 1e-4 หรือ 1e-5 · แช่แข็งก่อน"],
        ["ผลดีตอนเทรน แย่กับภาพจริง", "augmentation ไม่ครอบคลุมสิ่งที่เจอจริง", "เพิ่มการหมุน แสง ครอบตัด ให้ตรงกับสภาพจริง"],
        ["โมเดลแย่ลงเมื่อพลิกภาพ", "**พลิกทำลาย label ในงานนี้**", "ถอด flip ออกจาก augmentation"],
        ["ลึกขึ้นแล้ว training loss แย่ลง", "ไม่มี residual connection", "ใช้สถาปัตยกรรมแบบ residual"],
        ["หน่วยความจำ GPU ไม่พอ", "ภาพใหญ่หรือ batch ใหญ่เกิน", "ลดขนาดภาพ · AMP · gradient accumulation"],
        ["เทรนช้ามาก", "batch เล็ก · DataLoader คอขวด", "เพิ่ม `num_workers` · `pin_memory=True` · AMP"],
        ["ผลกระโดดตอนสลับไป eval", "batch norm ยังอัปเดต running stats ตอนแช่แข็ง", "บังคับ `m.eval()` ให้ BatchNorm ที่แช่แข็ง"]
      ]}},
      { h: "ทำ CNN ให้เร็วขึ้น" },
      { table: { head: ["วิธี", "ได้เท่าไร", "แลกอะไร"], rows: [
        ["**AMP (fp16)**", "เร็วขึ้น 1.5-3 เท่า หน่วยความจำครึ่งเดียว", "ต้องมี GradScaler"],
        ["**`channels_last`**", "เร็วขึ้น 10-30% บน GPU ที่มี tensor core", "ต้องเปลี่ยนทั้งโมเดลและข้อมูล"],
        ["**depthwise separable**", "พารามิเตอร์ลด 8-9 เท่า", "ความแม่นยำลดเล็กน้อย"],
        ["**ลดความละเอียดภาพ**", "ต้นทุนลดตามกำลังสอง", "**เสียรายละเอียดเล็ก ๆ ไป**"],
        ["**เพิ่ม `num_workers`**", "มักคือคอขวดจริง", "ใช้ RAM มากขึ้น"]
      ]}},
      { h: "ข้อผิดพลาดที่พบบ่อยที่สุด" },
      { ul: [
        "**เทรนใหม่ทั้งที่มีภาพไม่ถึงหลักหมื่น** ทั้งที่ fine-tune ชนะขาด",
        "**ใช้ normalization ผิดชุดตอน fine-tune** ซึ่งไม่มี error แจ้งเลย",
        "**ใส่ augmentation ที่ validation** ทำให้คะแนนแกว่งและเทียบระหว่าง epoch ไม่ได้",
        "**พลิกภาพในงานที่พลิกแล้ว label เปลี่ยน** เช่นตัวเลขหรือตัวอักษร",
        "**ปลดทุกชั้นตั้งแต่แรกด้วย lr ปกติ** ทำให้ pretrained weight พังในก้าวแรก ๆ",
        "**ใส่ ReLU ก่อนบวก residual** ทำให้เส้นทาง identity ถูกตัดที่ค่าติดลบ",
        "**ลืมว่า batch norm ที่แช่แข็งยังอัปเดต running statistics อยู่**"
      ]},
      { h: "ตัวเลขที่ควรจำได้" },
      { table: { head: ["เรื่อง", "ค่า"], rows: [
        ["สูตรขนาด output", "`floor((in + 2p − k)/s) + 1`"],
        ["พารามิเตอร์ของ conv", "`k·k·C_in·C_out + C_out` — ไม่ขึ้นกับขนาดภาพ"],
        ["receptive field ของ 3×3 L ชั้น", "`2L + 1` (ไม่มี stride)"],
        ["normalization ของ ImageNet", "mean `[0.485, 0.456, 0.406]` · std `[0.229, 0.224, 0.225]`"],
        ["lr ของ fine-tune", "เล็กกว่าเทรนใหม่ราว 100 เท่า"],
        ["depthwise separable", "ถูกลงราว 8-9 เท่า"]
      ]}},
      { note: "**ถ้าจำได้แค่ประโยคเดียวจากหน้านี้**: convolution ไม่ได้เก่งเพราะมันซับซ้อนกว่า แต่เพราะมันใส่สมมติฐานที่ถูกต้องเรื่องภาพลงไปในโครงสร้างของโมเดลเลย — locality กับ weight sharing — จึงเรียนรู้ได้จากข้อมูลน้อยกว่ามาก" }
    ],

    eval: [
      { p: "คำถามที่แยกคนที่เข้าใจว่าทำไม CNN ถึงเวิร์ค ออกจากคนที่เรียก `nn.Conv2d` เป็น" },
      { qa: [
        { q: "ทำไมไม่ใช้ dense layer กับภาพ",
          a: "ภาพ 224×224×3 มี 150,528 ค่า ชั้น dense ไป 1000 คลาสจึงใช้กว่า 150 ล้านพารามิเตอร์ ขณะที่ conv 3×3 จาก 3 ไป 64 ช่องใช้ 1,792 ตัวทั้งชั้น และยังครอบคลุมทั้งภาพเพราะเลื่อนไปทุกตำแหน่ง" },
        { q: "สมมติฐานสองข้อที่ทำให้ convolution ใช้ได้คืออะไร",
          a: "locality คือพิกเซลเกี่ยวกับเพื่อนบ้านไม่ใช่กับพิกเซลอีกฟากของภาพ จึงมองแค่หน้าต่างเล็ก ๆ พอ และ translation equivariance คือขอบก็คือขอบไม่ว่าอยู่ตรงไหน จึงใช้ filter ตัวเดียวซ้ำทุกตำแหน่งได้ ซึ่งคือ weight sharing" },
        { q: "เขียนสูตรขนาด output ได้ไหม",
          a: "`out = floor((in + 2·padding − kernel)/stride) + 1` และ 'same' padding ที่ stride 1 คือ `padding = (kernel−1)/2` ซึ่งทำให้ขนาดเท่าเดิม" },
        { q: "conv layer มีพารามิเตอร์เท่าไร และขึ้นกับขนาดภาพไหม",
          a: "`k·k·C_in·C_out + C_out` และ **ไม่ขึ้นกับขนาดภาพเลย** — 3×3 จาก 64 ไป 64 ช่องใช้ 36,928 ตัว ไม่ว่าภาพจะ 32×32 หรือ 1024×1024" },
        { q: "ทำไม 3×3 สองชั้นดีกว่า 5×5 ชั้นเดียว",
          a: "receptive field เท่ากันคือ 5×5 แต่พารามิเตอร์เป็น 18C² เทียบกับ 25C² และได้ non-linearity เพิ่มมาอีกชั้นฟรี — ที่ C=64 คือ 73,856 เทียบกับ 102,464" },
        { q: "receptive field โตยังไงเมื่อเพิ่มชั้น",
          a: "3×3 stride 1 จำนวน L ชั้นให้ `2L+1` ซึ่งโตเชิงเส้นและช้ามาก ส่วนทุกครั้งที่ลดขนาดครึ่งหนึ่งด้วย stride 2 receptive field จะโตเป็นสองเท่า จึงต้องมีการลดขนาดถ้าอยากให้เห็นภาพรวม" },
        { q: "1×1 convolution มีประโยชน์อะไรทั้งที่ไม่มองเพื่อนบ้าน",
          a: "มันผสมช่องเข้าด้วยกันที่แต่ละพิกเซล ใช้ลดจำนวนช่องได้ถูกมาก เช่น 1×1 จาก 256 ไป 64 ใช้ 16,448 ตัว ขณะที่ 3×3 ใช้ 147,520 และเพิ่ม non-linearity ได้ในราคาถูก" },
        { q: "pooling กับ conv stride 2 ต่างกันยังไง",
          a: "pooling ไม่มีพารามิเตอร์และทนต่อการเลื่อนเล็กน้อยได้ดี ส่วน conv stride 2 เรียนรู้เองว่าจะลดขนาดอย่างไร — สถาปัตยกรรมยุคใหม่นิยม stride มากกว่า" },
        { q: "ทำไม ResNet ถึงลึก 152 ชั้นได้ ทั้งที่เครือข่ายธรรมดาผ่าน 20 ชั้นไม่ได้",
          a: "เพราะ `y = F(x) + x` ทำให้ `∂y/∂x = ∂F/∂x + 1` และเลข 1 นั้นทำให้ผลคูณของ Jacobian ข้ามชั้นยุบเป็นศูนย์ไม่ได้ — ปัญหาเดิมไม่ใช่ overfit เพราะ training loss ก็แย่ลงด้วย แต่เป็นความล้มเหลวของการ optimize" },
        { q: "ReLU ควรอยู่ก่อนหรือหลังการบวก residual",
          a: "หลัง — ถ้าใส่ก่อนบวก เส้นทาง identity จะถูกตัดที่ค่าติดลบ ซึ่งทำลายเหตุผลทั้งหมดของการมี skip connection" },
        { q: "ทำไม conv ที่มี batch norm ตามหลังถึงตั้ง `bias=False`",
          a: "เพราะ batch norm หักค่าเฉลี่ยออกอยู่แล้ว bias ของ conv จึงไม่มีผลใด ๆ ต่อผลลัพธ์ และ batch norm มีพารามิเตอร์ β ทำหน้าที่ bias ให้อยู่แล้ว" },
        { q: "global average pooling ดีกว่า flatten ยังไง",
          a: "จาก (4,4,128) การ flatten ไป dense 256 ใช้ 524,544 พารามิเตอร์ ส่วนการเฉลี่ยเหลือ 128 แล้วไป dense 256 ใช้ 33,024 คือน้อยกว่า 16 เท่า และรับภาพขนาดไหนก็ได้" },
        { q: "พารามิเตอร์ของ CNN ส่วนใหญ่ไปกองอยู่ตรงไหน",
          a: "ที่หัว dense หลัง flatten — ใน CNN ตัวอย่างที่มี 620,362 พารามิเตอร์ มี 524,544 หรือราว 85% อยู่ที่ชั้นเดียวนั้น ซึ่งคือเหตุผลที่ global average pooling เข้ามาแทน" },
        { q: "depthwise separable convolution คืออะไร ประหยัดเท่าไร",
          a: "แยก conv ปกติออกเป็นการกรองเชิงพื้นที่ทีละช่อง แล้วตามด้วย 1×1 ผสมช่อง — 3×3 จาก 64 ไป 128 ลดจาก 73,856 เหลือ 8,960 คือถูกลง 8.2 เท่า และเป็นหัวใจของ MobileNet" },
        { q: "ควรเทรนใหม่หรือ fine-tune",
          a: "fine-tune คือค่าเริ่มต้น การเทรนใหม่แทบไม่เคยถูกต้องเมื่อมีภาพไม่ถึงหลักหมื่น และแม้เกินหลักแสน pretrained ก็ยังมักชนะอยู่ดี" },
        { q: "ลำดับการ fine-tune ที่ถูกต้องคืออะไร",
          a: "แช่แข็ง backbone เทรนเฉพาะหัวใหม่ด้วย lr ราว 1e-3 ก่อน แล้วค่อยปลดชั้นบนด้วย lr ราว 1e-4 และปลดทั้งหมดเมื่อมีข้อมูลมากพอเท่านั้น — ข้ามขั้นแรกไปคือความผิดพลาดที่พบบ่อยที่สุด" },
        { q: "ทำไม fine-tune ต้องใช้ learning rate เล็กกว่ามาก",
          a: "เพราะน้ำหนักที่ pretrain มาอยู่ในบริเวณที่ดีของ loss landscape อยู่แล้ว learning rate ปกติจะเหวี่ยงออกจากบริเวณนั้นตั้งแต่ก้าวแรก ซึ่งเท่ากับทิ้งทุกอย่างที่ pretrain มา" },
        { q: "อะไรคือสาเหตุเงียบ ๆ ที่ทำให้ fine-tune ได้ผลแย่กว่าที่ควร",
          a: "normalization ที่ไม่ตรงกับ checkpoint — โมเดล ImageNet ถูกเทรนด้วย mean `[0.485,0.456,0.406]` และ std `[0.229,0.224,0.225]` ใช้ค่าอื่นแล้วความแม่นยำตกโดยไม่มี error แจ้ง" },
        { q: "augmentation แบบไหนที่ทำลาย label",
          a: "การพลิกแนวนอนกับตัวเลขและตัวอักษร เพราะ 2 กับ 5 ไม่รอดกระจก การพลิกแนวตั้งกับภาพทั่วไป และการเปลี่ยนสีในงานที่สีคือคำตอบ — มองไม่เห็นจากเส้น loss จึงต้องเปิดภาพดูด้วยตา" },
        { q: "ทำไม batch norm ที่แช่แข็งแล้วยังทำให้ผลเพี้ยนได้",
          a: "เพราะ `requires_grad = False` หยุดแค่การอัปเดตน้ำหนัก แต่ไม่หยุดการอัปเดต running mean และ variance ต้องเรียก `m.eval()` ให้ BatchNorm นั้นด้วย และต้องเรียกหลัง `model.train()` ทุกครั้ง" },
        { q: "ทำไม convolution ถึงยังเป็นการคูณเมทริกซ์",
          a: "เพราะ im2col กางทุกหน้าต่างออกเป็นแถว ทำให้ conv กลายเป็นการคูณ `(H·W, k·k·C_in)` กับ `(k·k·C_in, C_out)` — จึงใช้ GPU ได้เต็มที่และ backpropagation เป็นรูปเดิมกับเครือข่าย dense ทุกประการ" }
      ]},
      { h: "อ่านเพิ่ม" },
      { links: [
        { label: "CS231n — Convolutional Neural Networks", url: "https://cs231n.github.io/convolutional-networks/", note: "สูตรขนาด output, การนับพารามิเตอร์, และภาพประกอบทุกแนวคิดของหน้านี้" },
        { label: "Deep Residual Learning for Image Recognition (ResNet)", url: "https://arxiv.org/abs/1512.03385", note: "เปเปอร์ต้นฉบับ รวมกราฟที่แสดงว่าเครือข่ายลึกมี training error สูงกว่า" },
        { label: "Very Deep Convolutional Networks (VGG)", url: "https://arxiv.org/abs/1409.1556", note: "ที่มาของการใช้ 3×3 อย่างเดียว พร้อมการเปรียบเทียบกับ kernel ใหญ่" },
        { label: "MobileNets: Efficient CNNs for Mobile Vision", url: "https://arxiv.org/abs/1704.04861", note: "depthwise separable convolution พร้อมการนับต้นทุนอย่างละเอียด" },
        { label: "A ConvNet for the 2020s (ConvNeXt)", url: "https://arxiv.org/abs/2201.03545", note: "ไล่ทีละขั้นว่าสูตรเทรนยุคใหม่ให้ผลเท่าไร แยกจากตัวสถาปัตยกรรมเอง" },
        { label: "PyTorch — Transfer Learning tutorial", url: "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html", note: "ลำดับแช่แข็งแล้ว fine-tune ตามเอกสารทางการ" },
        { label: "torchvision — Models and pretrained weights", url: "https://pytorch.org/vision/stable/models.html", note: "รายการ backbone ทั้งหมด พร้อมค่า normalization ที่แต่ละตัวต้องใช้" },
        { label: "Distill — Feature Visualization", url: "https://distill.pub/2017/feature-visualization/", note: "แสดงให้เห็นว่าแต่ละชั้นเรียนรู้อะไรจริง ๆ ด้วยภาพ" },
        { label: "A guide to convolution arithmetic for deep learning", url: "https://arxiv.org/abs/1603.07285", note: "ทุกกรณีของ padding, stride และ transposed convolution พร้อมภาพเคลื่อนไหว" }
      ]}
    ]
  }
});

window.TEACHING_EN = window.TEACHING_EN || {};
window.TEACHING_EN["ml_cnn"] = {
  principle: [
    { h: "The number that explains everything" },
    { code: String.raw`a 224 × 224 × 3 image = 150,528 values

a dense layer to 1000 classes:  150,528 × 1000 + 1000 = 150,529,000 parameters
a 3×3 conv from 3 to 64 channels: 3 × 3 × 3 × 64 + 64 =        1,792 parameters`,
      cap: "Eighty thousand times fewer, and the conv still \"sees\" the whole image because it slides across every position", lang: "txt" },
    { h: "The two assumptions that make this possible" },
    { table: { head: ["Assumption", "What it means", "What it buys"], rows: [
      ["**Locality**", "A pixel relates to its neighbours, not to a pixel across the picture", "A neuron only needs a small window"],
      ["**Translation equivariance**", "An edge is an edge wherever it appears", "**The same filter is reused at every position** — weight sharing"]
    ]}},
    { p: "**Every property of a CNN descends from those two.** And if a task violates them — a table of unrelated columns, say — convolution is simply the wrong tool, which says nothing about whether CNNs are good." },
    { h: "How this follows from the previous page" },
    { table: { head: ["Previous page", "This page"], rows: [
      ["A dense layer connects every input to every neuron", "**Connect only neighbours, and reuse one set of weights everywhere**"],
      ["Backpropagation through matrix multiplies", "Entirely unchanged — a convolution is a structured matrix multiply"],
      ["Vanishing gradients are a product", "**The residual connection inserts a `+1` into that product**"],
      ["Augmentation was one row in the regularisation table", "In vision it usually beats dropout and weight decay combined"]
    ]}},
    { h: "What this page will let you do" },
    { ul: [
      "Compute the output shape of every layer, and read the shape error at the classifier head",
      "Explain why two 3×3 layers beat one 5×5 with numbers rather than convention",
      "Know why ResNet can be 152 layers deep when plain networks could not pass 20",
      "Choose between training from scratch and fine-tuning, and know which layers to freeze at what learning rate",
      "Choose augmentation that does not destroy the label"
    ]}
  ],

  theory: [
    { p: "This section assembles a CNN one piece at a time, each with a definite job." },
    { h: "1) What a convolution is" },
    { code: String.raw`slide a small window (the kernel) across the image
at every position: multiply elementwise and sum

the same kernel is reused at every position
-> learn to detect a vertical edge once and you detect it everywhere at once`,
      cap: "This is weight sharing, and it is why the parameter count does not depend on the image size at all", lang: "txt" },
    { h: "2) The output-size formula worth memorising" },
    { code: String.raw`out = floor((in + 2·padding − kernel) / stride) + 1

'same' padding at stride 1:  padding = (kernel − 1)/2  ->  out = in

3×3 pad 1 stride 1  ->  size preserved       <- the everyday workhorse
3×3 pad 1 stride 2  ->  size halved
7×7 pad 3 stride 2  ->  size halved          <- ResNet's first layer`,
      cap: "Memorise this and you never guess a shape again, and the error at the classifier head becomes readable instantly", lang: "txt" },
    { h: "3) A conv layer's parameter count" },
    { code: String.raw`parameters = k · k · C_in · C_out + C_out
                                        ‾‾‾‾‾
                                        one bias per output channel

**it does not depend on the image size** — 3×3 from 64 to 64 channels costs 36,928
whether the image is 32×32 or 1024×1024`,
      cap: "This is the structural difference from a dense layer, whose parameters grow directly with the input size", lang: "txt" },
    { h: "4) What a channel is" },
    { table: { head: ["Where", "A channel means"], rows: [
      ["Input", "R, G, B — three channels"],
      ["Early layers", "**Vertical, horizontal and diagonal edges, colour blobs** — each filter catches something different"],
      ["Middle layers", "Corners, curves, repeated textures"],
      ["Deep layers", "Object parts, such as a wheel, an eye, a face"]
    ]}},
    { p: "**And this is not a retrospective interpretation** — render the first layer's filters as images and the edge detectors are plainly visible, matching the hand-designed edge detectors that predated CNNs by decades." },
    { h: "5) Receptive field, and why 3×3 won" },
    { code: String.raw`stacking L layers of 3×3 at stride 1 -> receptive field = 2L + 1

two 3×3 layers:  receptive field 5×5   parameters 2 × (9·C²) = 18C²
one 5×5 layer:   receptive field 5×5   parameters           25C²

at C = 64:  73,856 against 102,464`,
      cap: "The same view of the image, fewer parameters, and one extra non-linearity for free", lang: "txt" },
    { note: "**This is why everything from VGG onward uses 3×3 almost exclusively** — not convention, but a comparison where the numbers point one way." },
    { h: "6) Pooling against strided convolution" },
    { table: { head: ["", "Max pooling", "Conv stride 2"], rows: [
      ["What it does", "Takes the maximum in a window", "Learns how to downsample"],
      ["Parameters", "**None**", "Some"],
      ["Tolerance to small shifts", "**Good**", "Moderate"],
      ["Modern architectures", "Used less", "**Preferred**"]
    ]}},
    { h: "7) What a 1×1 convolution does" },
    { code: String.raw`a 1×1 kernel sees no neighbours at all, so what is it for?

-> it mixes **channels** at each pixel position
-> it reduces channel count very cheaply: 1×1 from 256 to 64 = 16,448 parameters
   while 3×3 from 256 to 64 = 147,520
-> and it adds a non-linearity cheaply`,
      cap: "Inception and ResNet use 1×1 to squeeze channels before a 3×3 and expand afterwards — the bottleneck design", lang: "txt" },
    { h: "8) The standard conv block" },
    { code: String.raw`Conv2d(3×3, pad 1, bias=False)
      |
BatchNorm2d                     <- it has its own bias, so the conv needs none
      |
ReLU
      |
(repeat) then downsample with stride 2 or pooling`,
      cap: "`bias=False` under a batch norm is not a saving — the bias is cancelled by the normalisation anyway", lang: "txt" },
    { h: "9) Global average pooling — why it replaced the dense head" },
    { code: String.raw`the old way:  feature map (4, 4, 128) -> flatten 2048 -> dense 256
              the head alone = 2048 × 256 + 256 = 524,544 parameters

the new way:  feature map (4, 4, 128) -> average each channel -> 128 -> dense 256
              parameters = 128 × 256 + 256 = 33,024`,
      cap: "Sixteen times fewer, and it accepts any input size because it averages the whole map however large it is", lang: "txt" },
    { h: "10) Residual connections — why ResNet changed everything" },
    { code: String.raw`the problem before it: plain networks past about 20 layers got **worse**
                       and worse on training loss too -> not overfitting
                       but a failure of optimisation

residual:  y = F(x) + x

∂y/∂x = ∂F/∂x + 1
                ‾‾‾
                this term stops the across-layer product collapsing to zero`,
      cap: "That single 1 is why 152 layers became something you could actually train", lang: "txt" },
    { note: "**Explaining ResNet without the `+1` in the derivative misses the point** — it is not a vague \"shortcut for information to flow\", it is a guarantee that a gradient path multiplied by exactly 1 always exists." },
    { h: "11) The architecture line, compressed" },
    { table: { head: ["Model", "Year", "What it introduced"], rows: [
      ["**LeNet-5**", "1998", "conv + pool + dense, on handwritten digits"],
      ["**AlexNet**", "2012", "ReLU, dropout, GPUs, augmentation — the run that set everything off"],
      ["**VGG**", "2014", "Only 3×3, stacked deep, extremely uniform and extremely heavy"],
      ["**Inception**", "2014", "Several kernel sizes in parallel · 1×1 to cut the cost"],
      ["**ResNet**", "2015", "**Residual connections — depth became free**"],
      ["**MobileNet**", "2017", "Depthwise separable convolution, roughly 8-9× cheaper"],
      ["**EfficientNet**", "2019", "Scale depth, width and resolution together"],
      ["**ConvNeXt**", "2022", "A CNN retuned with transformer-era recipes, competitive again"]
    ]}},
    { h: "12) Depthwise separable convolution" },
    { code: String.raw`standard:  3×3 from 64 to 128 channels = 73,856 parameters
           doing two jobs at once: spatial filtering and channel mixing

split into two steps:
   depthwise  3×3 per channel        = 3·3·64 + 64  =    640
   pointwise  1×1 from 64 to 128     = 64·128 + 128 =  8,320
                                        total          8,960

8.2× cheaper`,
      cap: "This is the heart of MobileNet and the reason on-device models are practical at all", lang: "txt" }
  ],

  foundations: [
    { p: "This section digs into the mechanics that decide how well a CNN works." },
    { h: "Where the parameters actually accumulate" },
    { code: String.raw`a small CNN on 32×32×3 images

conv 3×3   3 ->  32        896
conv 3×3  32 ->  64     18,496
conv 3×3  64 -> 128     73,856
                        ‾‾‾‾‾‾
   conv total           93,248

flatten (4,4,128) = 2048 -> dense 256   524,544    <- the head outweighs the whole network
dense 256 -> 10                           2,570

total 620,362, with 85% of it in a single head layer`,
      cap: "Which is exactly why global average pooling replaced it — swap the head and it drops to 128,842", lang: "txt" },
    { h: "How the receptive field grows once stride is involved" },
    { code: String.raw`without stride:  L layers of 3×3 -> receptive field 2L + 1  (linear, very slow)
with stride 2:   every halving of the resolution doubles the receptive field

ResNet-50's last layer has a receptive field larger than the input image
-> one neuron therefore "sees" every pixel, while every layer looks at only 3×3`,
      cap: "So downsampling is not merely a memory saving — it is the only way to see the whole picture without enormous depth", lang: "txt" },
    { h: "Why a convolution is still a matrix multiply" },
    { code: String.raw`im2col: unfold every window into a row of a matrix

an (H, W, C_in) image with a k×k kernel
   -> a matrix (H·W, k·k·C_in)
   -> multiplied by (k·k·C_in, C_out)
   -> giving (H·W, C_out), folded back into a feature map`,
      cap: "So GPUs are used fully, and backpropagation has exactly the same form as on the previous page", lang: "txt" },
    { h: "Batch norm inside a conv block" },
    { code: String.raw`it normalises per **channel**, averaging over the batch and the spatial extent

a feature map (N, C, H, W)
   -> each channel's mean and variance come from N·H·W numbers
   -> so it holds only C values of γ and C of β`,
      cap: "Averaging over space as well is why conv batch norm copes with small batches slightly better than in a dense layer", lang: "txt" },
    { h: "Preprocessing must match the checkpoint" },
    { code: String.raw`a downloaded ImageNet model was trained with these constants:

   mean = [0.485, 0.456, 0.406]
   std  = [0.229, 0.224, 0.225]

use anything else (dividing by 255 alone, for instance) -> accuracy drops with no error raised`,
      cap: "One of the most common causes of \"fine-tuning did worse than it should\", and one of the hardest to find", lang: "txt" },
    { h: "Augmentation that destroys the label" },
    { table: { head: ["Transform", "Safe for", "Destroys the label when"], rows: [
      ["**Horizontal flip**", "Cats, dogs, scenery", "**Digits, letters, road signs** (2 and 5 do not survive a mirror)"],
      ["**Vertical flip**", "Satellite imagery, microscopy", "Almost all ordinary photographs"],
      ["**Heavy rotation**", "Some medical imaging", "Any task where orientation carries meaning"],
      ["**Colour jitter**", "General object classification", "**Tasks where colour is the answer**, such as fruit ripeness"],
      ["**Aggressive cropping**", "Large centred objects", "Small objects, which can be cropped out entirely"]
    ]}},
    { note: "**Label-destroying augmentation is completely invisible in the loss curve** — the model simply learns more slowly or plateaus lower. The only way to catch it is to open the augmented images and look at them yourself." },
    { h: "Why fine-tuning needs a far smaller learning rate" },
    { code: String.raw`pretrained weights already sit in a good region of the loss landscape

a normal lr (1e-3) on the first step -> flings them out of that region immediately
                                        which discards everything pretraining bought

a small lr (1e-5 to 1e-4)             -> moves within the region, adapting to the new task`,
      cap: "And this is why freeze-then-unfreeze works — the randomly initialised head must settle before its gradients are allowed near the backbone", lang: "txt" }
  ],

  architecture: [
    { p: "This section is about picking a structure and a decision order for a vision task." },
    { h: "How to start on a new vision task" },
    { code: String.raw`how many images do you have?

< 1,000        -> fine-tune with the whole backbone frozen, train the head only
1,000-10,000   -> fine-tune, unfreezing the upper blocks
10,000-100,000 -> fine-tune the whole model at a small lr
> 100,000      -> training from scratch starts to make sense, though pretraining usually still wins`,
      cap: "**Transfer learning is the default, not the fallback** — training from scratch is almost never right below tens of thousands of images", lang: "txt" },
    { h: "The fine-tuning order" },
    { code: String.raw`1. freeze the whole backbone, train only the new head    lr ≈ 1e-3
   -> let the random head settle before its noisy gradients reach the backbone

2. unfreeze the upper blocks and continue                lr ≈ 1e-4 or lower

3. unfreeze everything, only with enough data            lr ≈ 1e-5`,
      cap: "Skipping step 1 and unfreezing everything immediately is transfer learning's most common mistake", lang: "txt" },
    { h: "Choosing a backbone" },
    { table: { head: ["Constraint", "Choose", "Why"], rows: [
      ["General, nothing special", "**ResNet-50**", "Easy to reason about, strong results, the most worked examples"],
      ["Must run on phone or edge", "**MobileNetV3 · EfficientNet-B0**", "Depthwise separable makes it several times cheaper"],
      ["Maximum accuracy with a GPU", "**ConvNeXt · EfficientNetV2**", "Modern training recipes push the ceiling further"],
      ["Very little data", "**ResNet-18 or smaller**", "A large model will overfit immediately"]
    ]}},
    { h: "The shape of each kind of vision task" },
    { code: String.raw`classification:   backbone -> global average pool -> dense -> classes
segmentation:     backbone (downsampling) -> decoder (upsampling) -> one class per pixel
                  with skip connections from the matching downsampling level (U-Net)
detection:        backbone -> feature pyramid -> heads predicting boxes and classes`,
      cap: "All three can share a backbone and differ only in what is attached — which is why one pretraining serves many tasks", lang: "txt" },
    { h: "An augmentation set you can use as it is" },
    { code: String.raw`general object classification:
   RandomResizedCrop(224, scale=(0.7, 1.0))
   RandomHorizontalFlip()
   ColorJitter(0.2, 0.2, 0.2)
   Normalize(mean, std)  <- must match the checkpoint

validation must contain nothing random:
   Resize(256) -> CenterCrop(224) -> Normalize`,
      cap: "Augmenting validation makes the score wobble and makes epochs incomparable", lang: "txt" },
    { h: "Numbers to set before starting" },
    { table: { head: ["Setting", "Value", "Note"], rows: [
      ["optimizer", "**AdamW** or **SGD momentum 0.9**", "In vision, a well-tuned SGD often edges ahead"],
      ["learning rate (from scratch)", "**0.1 × batch/256** for SGD", "The linear scaling rule from the previous page"],
      ["learning rate (fine-tuning)", "**1e-4 to 1e-5**", "Roughly a hundred times smaller than from scratch"],
      ["weight decay", "**1e-4** (SGD) · **0.05** (AdamW in vision)", "Vision uses more than text does"],
      ["schedule", "**cosine + warmup**", "The current standard"],
      ["label smoothing", "**0.1**", "Standard in modern image classification"]
    ]}},
    { note: "**Always print the shape after every block once before the real run** — most CNN failures are a wrong shape at the classifier head, and they are visible immediately by listing the sizes from the first layer down." }
  ],

  dataflow: [
    { p: "A convolution computed by hand from start to finish, then the shapes of a real network traced end to end." },
    { h: "The input image" },
    { code: String.raw`a 5×5 image with a bright vertical stripe down the middle (column 2)

   10  10  80  10  10
   10  10  80  10  10
   10  10  80  10  10
   10  10  80  10  10
   10  10  80  10  10`,
      cap: "One stripe in the centre — small enough to do by hand, with two edges to check the filter really finds them", lang: "txt" },
    { h: "A vertical edge kernel" },
    { code: String.raw`Kᵥ =   1   0  −1
        2   0  −2
        1   0  −1

positive on the left, negative on the right, no weight in the middle column
-> large when the left is brighter than the right, negative when the right is brighter`,
      cap: "This is the hand-designed Sobel operator that predates CNNs — and exactly what the first layer learns on its own", lang: "txt" },
    { h: "Computing the first output cell" },
    { code: String.raw`the top-left window, covering columns 0-2:

   10·1 + 10·0 + 80·(−1)
 + 10·2 + 10·0 + 80·(−2)
 + 10·1 + 10·0 + 80·(−1)

 = (10 − 80) + (20 − 160) + (10 − 80)
 = −70 − 140 − 70 = −280`,
      cap: "Negative because the right side of the window is brighter — that is the stripe's left edge", lang: "txt" },
    { h: "Computing the rightmost cell" },
    { code: String.raw`the window covering columns 2-4:

   80·1 + 10·0 + 10·(−1)
 + 80·2 + 10·0 + 10·(−2)
 + 80·1 + 10·0 + 10·(−1)

 = 70 + 140 + 70 = +280`,
      cap: "Positive because the left side is brighter — the stripe's right edge, so the sign encodes the edge's direction", lang: "txt" },
    { h: "The whole output map" },
    { code: String.raw`5×5 with a 3×3 kernel and no padding -> (5 − 3)/1 + 1 = 3

   −280    0   +280
   −280    0   +280
   −280    0   +280`,
      cap: "Both edges of the stripe are found at once, and the middle is zero because both sides there are equally bright", lang: "txt" },
    { h: "What a kernel in the other orientation gives" },
    { code: String.raw`Kₕ =   1   2   1        a horizontal edge kernel
        0   0   0
       −1  −2  −1

on the same image:
    0   0   0
    0   0   0
    0   0   0`,
      cap: "All zeros, because this image has no horizontal edges — each filter really does catch something different", lang: "txt" },
    { h: "Adding padding preserves the size" },
    { code: String.raw`pad one ring of zeros around the image -> (5 + 2 − 3)/1 + 1 = 5

the middle row of the output:
   −40   −280    0   +280   +40

the leftmost and rightmost outputs carry small values absent from the unpadded version,
because those windows overlap the zeros that were added`,
      cap: "That is the border artefact from zero padding — the price paid for preserving the size", lang: "txt" },
    { h: "Pooling with numbers" },
    { code: String.raw`4×4 input:            max pool 2×2 stride 2:      average pool:
   1  3  2  4              6   8                    3.75  5.25
   5  6  7  8              9   6                    3.75  3.75
   9  2  3  1
   4  0  6  5

max keeps "is it there at all" · average keeps "how bright overall"`,
      cap: "Max pooling dominates in the middle layers, because a feature's presence matters more than its average value", lang: "txt" },
    { h: "Tracing a real network's shapes end to end" },
    { code: String.raw`input                                  (N,   3, 224, 224)
conv 7×7  s2 p3  -> 64 channels         (N,  64, 112, 112)
maxpool 3×3 s2                          (N,  64,  56,  56)
stage1  conv 3×3 ×2                     (N,  64,  56,  56)
stage2  conv 3×3 s2 ×2 -> 128           (N, 128,  28,  28)
stage3  conv 3×3 s2 ×2 -> 256           (N, 256,  14,  14)
stage4  conv 3×3 s2 ×2 -> 512           (N, 512,   7,   7)
global average pool                     (N, 512)
dense -> 1000                           (N, 1000)`,
      cap: "That is the whole of ResNet-18, and every line can be checked with the output-size formula", lang: "txt" },
    { h: "Checking one line with the formula" },
    { code: String.raw`the first layer: in = 224 · kernel = 7 · padding = 3 · stride = 2

out = floor((224 + 2·3 − 7) / 2) + 1
    = floor(223 / 2) + 1
    = 111 + 1 = 112   ✓`,
      cap: "This works for every line, and it should always be done before a real training run", lang: "txt" }
  ],

  implementation: [
    { p: "Code for everything on this page, with the places people get it wrong." },
    { h: "1) The standard conv block" },
    { code: String.raw`import torch.nn as nn

def conv_block(c_in, c_out, stride=1):
    return nn.Sequential(
        nn.Conv2d(c_in, c_out, 3, stride=stride, padding=1, bias=False),
        nn.BatchNorm2d(c_out),      # it has its own bias, so the conv needs none
        nn.ReLU(inplace=True),
    )`,
      cap: "`bias=False` because batch norm subtracts the mean anyway, leaving the conv's bias with no effect at all", lang: "python" },
    { h: "2) A residual block" },
    { code: String.raw`class ResidualBlock(nn.Module):
    def __init__(self, c_in, c_out, stride=1):
        super().__init__()
        self.conv1 = conv_block(c_in, c_out, stride)
        self.conv2 = nn.Sequential(
            nn.Conv2d(c_out, c_out, 3, padding=1, bias=False),
            nn.BatchNorm2d(c_out),
        )
        self.skip = nn.Identity()
        if stride != 1 or c_in != c_out:        # shapes differ, adjust with a 1×1
            self.skip = nn.Sequential(
                nn.Conv2d(c_in, c_out, 1, stride=stride, bias=False),
                nn.BatchNorm2d(c_out),
            )
        self.relu = nn.ReLU(inplace=True)

    def forward(self, x):
        return self.relu(self.conv2(self.conv1(x)) + self.skip(x))`,
      cap: "**The ReLU goes after the addition, not before** — put it before and the identity path is clipped at every negative value", lang: "python" },
    { h: "3) A full network with global average pooling" },
    { code: String.raw`class SmallResNet(nn.Module):
    def __init__(self, n_classes=10):
        super().__init__()
        self.stem = conv_block(3, 64)
        self.stages = nn.Sequential(
            ResidualBlock(64, 64),
            ResidualBlock(64, 128, stride=2),
            ResidualBlock(128, 256, stride=2),
        )
        self.pool = nn.AdaptiveAvgPool2d(1)     # accepts any input size
        self.fc = nn.Linear(256, n_classes)

    def forward(self, x):
        x = self.stages(self.stem(x))
        return self.fc(self.pool(x).flatten(1))`,
      cap: "`AdaptiveAvgPool2d(1)` is what lets the model take any input size, and it removes the heavy head entirely", lang: "python" },
    { h: "4) Print every layer's shape before training" },
    { code: String.raw`x = torch.randn(2, 3, 224, 224)
for name, module in model.named_children():
    x = module(x)
    print(f"{name:12s} {tuple(x.shape)}")

# stem         (2, 64, 224, 224)
# stages       (2, 256, 56, 56)
# pool         (2, 256, 1, 1)`,
      cap: "**Do this once before every real run** — most CNN failures are visible in these three lines", lang: "python" },
    { h: "5) Count parameters per layer" },
    { code: String.raw`for name, p in model.named_parameters():
    if p.ndim == 4:                       # conv weights
        k, ci = p.shape[2], p.shape[1]
        print(f"{name:28s} {tuple(p.shape)}  {p.numel():>9,}")

print(f"total {sum(p.numel() for p in model.parameters()):,}")

# stem.0.weight        (64, 3, 3, 3)        1,728
# stages.0.conv1.0.weight (64, 64, 3, 3)   36,864
# total 2,796,362`,
      cap: "It always matches `k·k·C_in·C_out`; if it does not, you have misread the architecture", lang: "python" },
    { h: "6) Augmentation done correctly" },
    { code: String.raw`from torchvision import transforms as T

MEAN, STD = [0.485, 0.456, 0.406], [0.229, 0.224, 0.225]

train_tf = T.Compose([
    T.RandomResizedCrop(224, scale=(0.7, 1.0)),
    T.RandomHorizontalFlip(),
    T.ColorJitter(0.2, 0.2, 0.2),
    T.ToTensor(),
    T.Normalize(MEAN, STD),
])

val_tf = T.Compose([                       # nothing random in here
    T.Resize(256),
    T.CenterCrop(224),
    T.ToTensor(),
    T.Normalize(MEAN, STD),
])`,
      cap: "**MEAN and STD must match the checkpoint being loaded** — anything else costs accuracy with no error raised", lang: "python" },
    { h: "7) Look at the augmented images yourself" },
    { code: String.raw`import matplotlib.pyplot as plt
import torch

mean = torch.tensor(MEAN).view(3, 1, 1)
std = torch.tensor(STD).view(3, 1, 1)

xb, yb = next(iter(train_loader))
fig, axes = plt.subplots(2, 8, figsize=(16, 4))
for ax, img, lab in zip(axes.flat, xb, yb):
    ax.imshow((img * std + mean).clamp(0, 1).permute(1, 2, 0))
    ax.set_title(classes[lab]); ax.axis("off")
plt.show()`,
      cap: "Label-destroying augmentation never shows up in the loss curve — looking is the only way to catch it", lang: "python" },
    { h: "8) Transfer learning, step 1 — freeze the backbone" },
    { code: String.raw`import torchvision

model = torchvision.models.resnet50(weights="IMAGENET1K_V2")

for p in model.parameters():
    p.requires_grad = False                    # freeze everything

model.fc = nn.Linear(model.fc.in_features, n_classes)   # a new, unfrozen head

opt = torch.optim.AdamW(
    [p for p in model.parameters() if p.requires_grad], lr=1e-3
)`,
      cap: "Pass only the parameters with `requires_grad` to the optimizer, or weight decay will still act on the frozen ones", lang: "python" },
    { h: "9) Transfer learning, step 2 — unfreeze and fine-tune" },
    { code: String.raw`for name, p in model.named_parameters():
    if name.startswith(("layer4", "layer3", "fc")):
        p.requires_grad = True

opt = torch.optim.AdamW([
    {"params": model.fc.parameters(),      "lr": 1e-3},
    {"params": model.layer4.parameters(),  "lr": 1e-4},
    {"params": model.layer3.parameters(),  "lr": 1e-5},
], weight_decay=0.05)`,
      cap: "**A different learning rate per depth** — the deeper layers hold general features and should move least", lang: "python" },
    { h: "10) Check which mode batch norm is in while fine-tuning" },
    { code: String.raw`# the weights are frozen, but batch norm still updates its running statistics
# to stop that as well, it must be forced into eval mode

def freeze_bn(module):
    for m in module.modules():
        if isinstance(m, nn.BatchNorm2d):
            m.eval()
            for p in m.parameters():
                p.requires_grad = False

model.train()
freeze_bn(model.layer1)        # must be called after every model.train()`,
      cap: "`requires_grad = False` does not stop the running statistics — a quiet bug that makes results drift steadily", lang: "python" }
  ],

  tricks: [
    { h: "Diagnosing by symptom" },
    { table: { head: ["Symptom", "Cause", "Fix"], rows: [
      ["Shape mismatch at the dense layer", "The size after the convs was computed wrongly", "Print every shape · use `AdaptiveAvgPool2d`"],
      ["Fine-tuning does far worse than expected", "**Normalisation does not match the checkpoint**", "Use the mean/std the model was pretrained with"],
      ["Fine-tuning collapses in the first epoch", "Learning rate too large for pretrained weights", "Drop to 1e-4 or 1e-5 · freeze first"],
      ["Good in training, poor on real photographs", "Augmentation does not cover what is actually seen", "Add rotation, lighting and cropping matching real conditions"],
      ["The model gets worse when images are flipped", "**Flipping destroys the label for this task**", "Remove the flip from the augmentation"],
      ["Deeper made the training loss worse", "No residual connections", "Use a residual architecture"],
      ["Out of GPU memory", "Images or batches too large", "Smaller images · AMP · gradient accumulation"],
      ["Training is very slow", "Small batches · the DataLoader is the bottleneck", "More `num_workers` · `pin_memory=True` · AMP"],
      ["The score jumps when switching to eval", "Frozen batch norm still updating running stats", "Force `m.eval()` on the frozen BatchNorm layers"]
    ]}},
    { h: "Making a CNN faster" },
    { table: { head: ["Method", "Gain", "Cost"], rows: [
      ["**AMP (fp16)**", "1.5-3× faster, half the memory", "Requires a GradScaler"],
      ["**`channels_last`**", "10-30% on tensor-core GPUs", "The model and the data must both be converted"],
      ["**Depthwise separable**", "8-9× fewer parameters", "A small accuracy loss"],
      ["**Lower the image resolution**", "Cost falls quadratically", "**Small details are lost**"],
      ["**More `num_workers`**", "Often the real bottleneck", "More RAM"]
    ]}},
    { h: "The most common mistakes" },
    { ul: [
      "**Training from scratch on fewer than tens of thousands of images**, when fine-tuning wins outright",
      "**Using the wrong normalisation when fine-tuning**, which raises no error at all",
      "**Augmenting the validation set**, making the score wobble and epochs incomparable",
      "**Flipping images in a task where flipping changes the label**, such as digits or text",
      "**Unfreezing everything at once at a normal learning rate**, destroying the pretrained weights in the first steps",
      "**Putting the ReLU before the residual addition**, clipping the identity path at every negative value",
      "**Forgetting that frozen batch norm still updates its running statistics**"
    ]},
    { h: "Numbers worth remembering" },
    { table: { head: ["Thing", "Value"], rows: [
      ["The output-size formula", "`floor((in + 2p − k)/s) + 1`"],
      ["A conv layer's parameters", "`k·k·C_in·C_out + C_out` — independent of image size"],
      ["Receptive field of L layers of 3×3", "`2L + 1` (without stride)"],
      ["ImageNet normalisation", "mean `[0.485, 0.456, 0.406]` · std `[0.229, 0.224, 0.225]`"],
      ["Fine-tuning learning rate", "About 100× smaller than training from scratch"],
      ["Depthwise separable", "Roughly 8-9× cheaper"]
    ]}},
    { note: "**If only one sentence survives from this page**: convolution wins not by being more complicated, but by building a correct assumption about images — locality and weight sharing — directly into the model's structure, which is why it learns from far less data." }
  ],

  eval: [
    { p: "The questions that separate understanding why CNNs work from knowing how to call `nn.Conv2d`." },
    { qa: [
      { q: "Why not use a dense layer on images?",
        a: "A 224×224×3 image holds 150,528 values, so a dense layer to 1000 classes needs over 150 million parameters, while a 3×3 conv from 3 to 64 channels needs 1,792 for the whole layer and still covers the image because it slides across every position." },
      { q: "What are the two assumptions that make convolution valid?",
        a: "Locality, meaning a pixel relates to its neighbours rather than across the picture, so a small window suffices; and translation equivariance, meaning an edge is an edge wherever it appears, so one filter can be reused everywhere — which is weight sharing." },
      { q: "Can you write the output-size formula?",
        a: "`out = floor((in + 2·padding − kernel)/stride) + 1`, and 'same' padding at stride 1 is `padding = (kernel−1)/2`, which preserves the size." },
      { q: "How many parameters does a conv layer have, and does image size matter?",
        a: "`k·k·C_in·C_out + C_out`, and it **does not depend on the image size at all** — 3×3 from 64 to 64 channels costs 36,928 whether the image is 32×32 or 1024×1024." },
      { q: "Why are two 3×3 layers better than one 5×5?",
        a: "The receptive field is the same 5×5 but the parameters are 18C² against 25C², plus one extra non-linearity for free — at C=64 that is 73,856 against 102,464." },
      { q: "How does the receptive field grow with depth?",
        a: "L layers of 3×3 at stride 1 give `2L+1`, which grows linearly and very slowly, while every halving of the resolution with stride 2 doubles it — so downsampling is what makes a global view possible." },
      { q: "What is a 1×1 convolution good for, given that it sees no neighbours?",
        a: "It mixes channels at each pixel, reduces channel count very cheaply — 1×1 from 256 to 64 costs 16,448 against 147,520 for a 3×3 — and adds a non-linearity inexpensively." },
      { q: "How do pooling and a stride-2 convolution differ?",
        a: "Pooling has no parameters and tolerates small shifts well, while a stride-2 convolution learns how to downsample — modern architectures prefer the stride." },
      { q: "Why can ResNet be 152 layers deep when plain networks could not pass 20?",
        a: "Because `y = F(x) + x` makes `∂y/∂x = ∂F/∂x + 1`, and that 1 stops the across-layer Jacobian product collapsing to zero. The original problem was not overfitting — the training loss also got worse — it was a failure of optimisation." },
      { q: "Should the ReLU go before or after the residual addition?",
        a: "After. Placing it before clips the identity path at every negative value, which destroys the entire reason for having the skip connection." },
      { q: "Why is `bias=False` used on a conv followed by batch norm?",
        a: "Because batch norm subtracts the mean anyway, leaving the conv's bias with no effect on the output, and batch norm's own β already plays the role of a bias." },
      { q: "What makes global average pooling better than flatten?",
        a: "From (4,4,128), flattening into a dense 256 costs 524,544 parameters while averaging to 128 and then a dense 256 costs 33,024 — sixteen times fewer — and it accepts any input size." },
      { q: "Where do most of a CNN's parameters end up?",
        a: "In the dense head after the flatten — in the worked example, 524,544 of 620,362 parameters, about 85%, sit in that single layer, which is precisely why global average pooling replaced it." },
      { q: "What is a depthwise separable convolution and how much does it save?",
        a: "It splits a convolution into per-channel spatial filtering followed by a 1×1 that mixes channels — 3×3 from 64 to 128 drops from 73,856 to 8,960, which is 8.2× cheaper, and it is the heart of MobileNet." },
      { q: "Should you train from scratch or fine-tune?",
        a: "Fine-tuning is the default. Training from scratch is almost never right below tens of thousands of images, and even past a hundred thousand a pretrained start usually still wins." },
      { q: "What is the correct fine-tuning order?",
        a: "Freeze the backbone and train the new head at about 1e-3, then unfreeze the upper blocks at about 1e-4, and only unfreeze everything when there is enough data. Skipping the first step is the most common mistake." },
      { q: "Why does fine-tuning need a much smaller learning rate?",
        a: "Because the pretrained weights already sit in a good region of the loss landscape, and a normal learning rate flings them out of it on the very first step, discarding everything pretraining bought." },
      { q: "What quietly makes fine-tuning underperform?",
        a: "Normalisation that does not match the checkpoint — ImageNet models were trained with mean `[0.485,0.456,0.406]` and std `[0.229,0.224,0.225]`, and using anything else costs accuracy with no error raised." },
      { q: "Which augmentations destroy the label?",
        a: "Horizontal flips on digits and letters, since 2 and 5 do not survive a mirror; vertical flips on ordinary photographs; and colour jitter where colour is the answer — none of which show up in the loss curve, so the images must be inspected by eye." },
      { q: "Why can frozen batch norm still corrupt results?",
        a: "Because `requires_grad = False` only stops the weight updates, not the running mean and variance. Those layers must also be put in eval mode with `m.eval()`, and it must be reapplied after every `model.train()`." },
      { q: "Why is a convolution still a matrix multiply?",
        a: "Because im2col unfolds every window into a row, turning the convolution into `(H·W, k·k·C_in)` times `(k·k·C_in, C_out)` — so GPUs are used fully and backpropagation has exactly the same form as in a dense network." }
    ]},
    { h: "Further reading" },
    { links: [
      { label: "CS231n — Convolutional Neural Networks", url: "https://cs231n.github.io/convolutional-networks/", note: "The output-size formula, the parameter counting, and diagrams for every idea on this page" },
      { label: "Deep Residual Learning for Image Recognition (ResNet)", url: "https://arxiv.org/abs/1512.03385", note: "The original paper, including the plot showing deeper plain networks had higher training error" },
      { label: "Very Deep Convolutional Networks (VGG)", url: "https://arxiv.org/abs/1409.1556", note: "Where the 3×3-only design comes from, with the comparison against larger kernels" },
      { label: "MobileNets: Efficient CNNs for Mobile Vision", url: "https://arxiv.org/abs/1704.04861", note: "Depthwise separable convolution with the full cost accounting" },
      { label: "A ConvNet for the 2020s (ConvNeXt)", url: "https://arxiv.org/abs/2201.03545", note: "Step by step, how much of the gain comes from the training recipe rather than the architecture" },
      { label: "PyTorch — Transfer Learning tutorial", url: "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html", note: "The freeze-then-fine-tune order in the official documentation" },
      { label: "torchvision — Models and pretrained weights", url: "https://pytorch.org/vision/stable/models.html", note: "Every backbone available, with the normalisation constants each one requires" },
      { label: "Distill — Feature Visualization", url: "https://distill.pub/2017/feature-visualization/", note: "Shows visually what each layer has actually learned" },
      { label: "A guide to convolution arithmetic for deep learning", url: "https://arxiv.org/abs/1603.07285", note: "Every case of padding, stride and transposed convolution, with animations" }
    ]}
  ]
};
