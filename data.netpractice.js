/* NetPractice — subnetting + routing (เกมบนเบราว์เซอร์ ตัดสินด้วย sim.js) */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

window.TEACHING_DATA.push({
  id: "netpractice",
  name: "NetPractice",
  tag: {
    th: "โจทย์เครือข่ายบนเบราว์เซอร์ 10 ด่าน — เติม IP / netmask / routing table ให้ทุก goal เขียว แล้ว export levelN.json; หัวใจคือ subnetting + เส้นทางไป-กลับ",
    en: "A 10-level browser network puzzle — fill in IPs, netmasks and routing tables until every goal is OK, then export levelN.json; it is subnetting plus a working round trip"
  },
  accent: "#22d3ee",
  sections: {
    principle: [
      { h: "โจทย์คืออะไร" },
      { p: "NetPractice **ไม่ใช่โปรเจกต์เขียนโค้ด** — เป็นเกมบนเบราว์เซอร์ 10 ด่าน. แต่ละด่านมีผังเครือข่าย (host, router, switch, internet) ต่อสายกันไว้แล้ว มีช่องว่างให้เติม **IP address**, **netmask** และ **routing table**. เติมถูกครบ → ทุก goal ขึ้น `OK - Congratulations!!` → กดปุ่ม **Get my config** ได้ไฟล์ `levelN.json` เอาไปส่ง" },
      { p: "สิ่งที่ต้องส่งคือไฟล์ JSON 10 ไฟล์ (`level1.json` … `level10.json`) เท่านั้น ไม่มี Makefile ไม่มี norminette ไม่มี valgrind" },
      { h: "ทำไมโปรเจกต์นี้สำคัญกว่าที่คิด" },
      { ul: [
        "เป็น **ครั้งแรกใน common core** ที่ต้องเข้าใจว่า packet เดินทางยังไง — ความรู้นี้ใช้ต่อใน ft_irc, webserv, Inception, ft_transcendence",
        "เป็นโปรเจกต์ที่ **ทำเสร็จได้ใน 1-2 วัน** ถ้าเข้าใจ subnetting; และค้างเป็นสัปดาห์ถ้าเดาเอา",
        "ตอน **defense กระดานสุ่มใหม่** — จำคำตอบเก่าไปไม่ได้เลย ต้องได้ 'วิธี' จริง ๆ"
      ]},
      { h: "องค์ประกอบบนกระดาน" },
      { table: { head: ["สัญลักษณ์", "คืออะไร", "มี IP ไหม"], rows: [
        ["**Host** (คอมพิวเตอร์)", "ปลายทาง/ต้นทางของ packet มี interface 1 ขา", "มี 1 ขา"],
        ["**Router**", "ต่อหลาย segment เข้าด้วยกัน มี interface หลายขา + routing table", "มีทุกขา"],
        ["**Switch**", "แค่สายไฟฟ้าที่แตกออกหลายเส้น ไม่ฉลาด", "**ไม่มี** — ไม่นับเป็น hop"],
        ["**Internet**", "host พิเศษ ห้ามมี default route + ทิ้ง private IP", "มี"]
      ]}},
      { note: "**switch ไม่มี IP และไม่ใช่ hop** — ทุกอย่างที่ห้อยอยู่กับ switch เดียวกันคือ **subnet เดียวกัน** ต้องอยู่ในช่วง network เดียวกันหมด นี่คือกฎที่ใช้บ่อยที่สุดในทั้งเกม" },
      { h: "หน้าตาสิ่งที่ต้องเติม" },
      { code: String.raw`Interface A1              Routing table ของ Router R1
  IP:   104.198.7.9        Destination        Next hop (gateway)
  Mask: 255.255.255.0       0.0.0.0/0    ->   104.198.7.1
                            192.168.2.0/24 -> 10.0.0.2

goals:
  A1 -> B1   Status: OK
  B1 -> A1   Status: KO   <- ไป-กลับต้องผ่านทั้งคู่`, cap: "ช่องขาว = แก้ได้, ช่องเทา = ล็อก (คือ 'ข้อกำหนด' ไม่ใช่คำใบ้)", lang: "txt" },
      { h: "sim.js คือผู้ตัดสิน ไม่ใช่ทฤษฎีในตำรา" },
      { p: "ทุกคำตัดสินมาจากไฟล์เดียว: `net_practice/js/sim.js`. อะไรที่ตำราบอกว่า 'ควรได้' แต่ `sim.js` ไม่ยอม ก็คือไม่ผ่าน. เปิดอ่านไฟล์นี้แล้วจะเลิกเดา — มันสั้นและอ่านออก" },
      { p: "ปุ่ม **Show logs** ใต้กระดานพิมพ์เส้นทางที่ packet เดินจริงทีละ hop พร้อมเหตุผลที่มันตาย. เกือบทุกด่านที่ติด แก้ได้ด้วยการอ่าน log ไม่ใช่การเดา mask ใหม่" },
      { h: "3 อย่างที่ทำให้ตกบ่อยที่สุด" },
      { table: { head: ["ปัญหา", "สาเหตุจริง"], rows: [
        ["goal เขียวฝั่งเดียว", "ลืมเส้นทาง **ขากลับ** — sim จำลองทั้งไปและกลับ"],
        ["`multiple interface match`", "2 ขาของ router เดียวกันครอบ IP ปลายทางทั้งคู่ = subnet ซ้อนกัน"],
        ["IP ที่ดูปกติแต่ตาย", "ดันไปตรงกับ **network address หรือ broadcast** ของ mask ตัวเอง"]
      ]}}
    ],

    theory: [
      { p: "หมวดนี้คือคณิตศาสตร์ทั้งหมดที่ NetPractice ใช้ — ไม่มีมากกว่านี้ แต่ต้องแม่นระดับคิดในหัวได้" },
      { h: "1) IPv4 คือเลข 32 บิต ที่เขียนเป็น 4 ท่อน" },
      { code: String.raw`192  .  168  .   1   .  42
11000000.10101000.00000001.00101010     = 3232235818

แต่ละท่อน (octet) = 8 บิต = 0-255`, cap: "จุดคั่นเป็นแค่การอ่านให้คนเข้าใจ เครื่องมองเป็นเลขตัวเดียว 32 บิต", lang: "txt" },
      { h: "2) Netmask = เส้นแบ่งว่าบิตไหนคือ 'บ้าน' บิตไหนคือ 'คน'" },
      { p: "mask คือเลข 32 บิตที่ **บิต 1 ต้องติดกันหมดจากซ้าย** แล้วตามด้วย 0 ทั้งหมด. ส่วนที่ตรงกับบิต 1 = **network** (บ้านเลขที่), ส่วนที่ตรงกับบิต 0 = **host** (คนในบ้าน)" },
      { code: String.raw`IP    192.168.1.42     11000000.10101000.00000001.00101010
Mask  255.255.255.0    11111111.11111111.11111111.00000000
                       \______ network ________/\__ host __/

network   = IP AND mask       = 192.168.1.0
broadcast = network OR ~mask  = 192.168.1.255`, cap: "AND กับ mask ได้ network, OR กับ mask กลับด้านได้ broadcast", lang: "txt" },
      { note: "**mask ที่บิต 1 ไม่ติดกัน = ผิดทันที** เช่น `255.255.255.32` (11111111.11111111.11111111.00100000) — เกมวางกับดักนี้ไว้ตั้งแต่ด่านต้น ๆ และ `mask_to_int()` ปฏิเสธตรง ๆ" },
      { h: "3) CIDR — วิธีเขียน mask แบบสั้น" },
      { p: "`/24` แปลว่า 'บิต 1 จำนวน 24 ตัว' = `255.255.255.0`. ตัวเลขหลัง / คือจำนวนบิต network" },
      { table: { head: ["CIDR", "netmask", "ขนาดบล็อก", "ใช้ได้จริง", "จำจาก"], rows: [
        ["/24", "255.255.255.0", "256", "254", "ทั้ง octet สุดท้าย"],
        ["/25", "255.255.255.128", "128", "126", "ครึ่งหนึ่ง"],
        ["/26", "255.255.255.192", "64", "62", "หนึ่งในสี่"],
        ["/27", "255.255.255.224", "32", "30", "หนึ่งในแปด"],
        ["/28", "255.255.255.240", "16", "14", ""],
        ["/29", "255.255.255.248", "8", "6", ""],
        ["/30", "255.255.255.252", "4", "2", "ลิงก์ router-router"],
        ["/31, /32", "…254 / …255", "2 / 1", "**0**", "ตายเสมอในเกมนี้"]
      ]}},
      { p: "**สูตรจำ:** ค่าใน octet สุดท้ายของ mask = `256 - block`. เช่น block 64 → `256-64 = 192` → `/26`. ย้อนกลับก็ได้: เห็น `240` → block = `256-240 = 16` → `/28`" },
      { h: "4) หา network / broadcast ในหัวใน 3 วินาที" },
      { code: String.raw`network   = ip - (ip mod block)
broadcast = network + block - 1

ตัวอย่าง: 192.168.1.222 / 27   (block = 32)
  222 mod 32 = 222 - 6*32 = 222 - 192 = 30
  network   = 222 - 30 = 192        -> 192.168.1.192
  broadcast = 192 + 32 - 1 = 223    -> 192.168.1.223
  ใช้ได้จริง = .193 ถึง .222        (30 เบอร์)`, cap: "หารเอาเศษกับขนาดบล็อก — ไม่ต้องแปลงเป็นเลขฐานสองเลย", lang: "txt" },
      { p: "**ขอบเขตของบล็อกเริ่มที่เลขที่หารด้วย block ลงตัวเสมอ** — /26 เริ่มที่ .0 .64 .128 .192 เท่านั้น ไม่มีทางเริ่มที่ .50" },
      { h: "5) ทำไม /31 กับ /32 ถึงตายเสมอ" },
      { p: "`/31` มี 2 เบอร์ = network + broadcast พอดี ไม่เหลือเบอร์ให้ host. `/32` มี 1 เบอร์ = network อย่างเดียว. ฟังก์ชัน `get_if_ip()` ใน sim.js คืน `null` เมื่อ IP เท่ากับ network หรือ broadcast ของตัวเอง ดังนั้น interface ที่ mask เป็น /31 หรือ /32 คือ **interface ที่ไม่มี IP** และทุก goal ที่ผ่านมันจะพัง" },
      { note: "ในโลกจริง RFC 3021 อนุญาต /31 สำหรับลิงก์ point-to-point แต่ **sim.js ไม่รู้จัก RFC นั้น** — อีกครั้ง: ผู้ตัดสินคือโค้ด ไม่ใช่มาตรฐาน" },
      { h: "6) Private IP กับ Internet" },
      { table: { head: ["ช่วง", "CIDR", "ชื่อในโค้ด"], rows: [
        ["10.0.0.0 – 10.255.255.255", "10.0.0.0/8", "`private_class_A`"],
        ["172.16.0.0 – 172.31.255.255", "172.16.0.0/12", "`private_class_B`"],
        ["192.168.0.0 – 192.168.255.255", "192.168.0.0/16", "`private_class_C`"]
      ]}},
      { p: "host ชนิด `internet` จะ **ทิ้ง packet ที่มาจากหรือไปหา 3 ช่วงนี้** ด้วยข้อความ `private subnets not routed over internet`. แปลว่าอะไรก็ตามที่ต้องคุยผ่าน Internet ต้องใช้ IP สาธารณะ" },
      { h: "7) Routing table — 2 ช่องต่อบรรทัด" },
      { p: "แต่ละบรรทัดคือ `destination/mask  →  gateway`. อ่านว่า 'ถ้าปลายทางอยู่ในช่วงนี้ ให้ส่งต่อไปหาเพื่อนบ้านชื่อนี้'" },
      { ul: [
        "`0.0.0.0/0` (หรือคำว่า `default`) = **ตรงกับทุกปลายทาง** — ใช้เมื่อ 'อย่างอื่นทั้งหมด ส่งไปทางนี้'",
        "**gateway ต้องเป็น IP ที่อยู่ใน subnet ของขาใดขาหนึ่งของ router ตัวนั้น** — จะชี้ไปหาเครื่องที่คุยตรงไม่ได้ไม่ได้",
        "gateway **ไม่ใช่** ปลายทาง มันคือ 'ทางออกถัดไป' เท่านั้น"
      ]},
      { h: "8) กฎ 'บรรทัดแรกที่ตรงชนะ'" },
      { code: String.raw`Routing table ของ R1 (อ่านบนลงล่าง)
  1) 0.0.0.0/0        -> 10.0.0.1     <- ตรงกับทุกอย่าง
  2) 192.168.2.0/24   -> 10.0.0.2     <- ไม่มีวันถูกใช้เลย

ถ้าปลายทาง = 192.168.2.5  -> ชนบรรทัด 1 ก่อน -> ส่งไป 10.0.0.1 -> หลง`,
        cap: "sim.js: if (nb_routes > 0) return ret; — เจอแล้วหยุด ไม่ไล่ต่อ", lang: "txt" },
      { p: "**และถ้าบรรทัดที่ชนะมี gateway ที่ router ไปไม่ถึง packet ถูกทิ้งเลย ไม่ไหลลงบรรทัดถัดไป** (`route match but no interface for gateway`). ลำดับบรรทัดจึงเป็นข้อมูล ไม่ใช่แค่ความสวยงาม — เอา route เฉพาะเจาะจงไว้บน เอา default ไว้ล่างสุด" }
    ],

    foundations: [
      { p: "หมวดนี้คือ **กฎที่ sim.js บังคับจริง** อ่านตรงจากโค้ด — เกมทั้งเกมตัดสินด้วย 7 ข้อนี้เท่านั้น" },
      { h: "กฎที่ 1 — IP ต้องไม่ใช่ network / broadcast ของตัวเอง" },
      { p: "`get_if_ip()` คืน `null` ถ้า IP ของ interface เท่ากับ network address หรือ broadcast address ที่คำนวณจาก mask ของมันเอง. interface ที่ไม่มี IP = ไม่มีใครคุยด้วยได้" },
      { code: String.raw`IP 192.168.1.64  mask /26   -> network ของ /26 คือ .64  -> ตาย
IP 192.168.1.127 mask /26   -> broadcast คือ .127      -> ตาย
IP 192.168.1.65  mask /26   -> อยู่กลางบล็อก           -> ใช้ได้`, cap: "เปลี่ยน mask แล้วต้องเช็ก IP เดิมใหม่ทุกครั้ง — ขอบบล็อกขยับ", lang: "txt" },
      { h: "กฎที่ 2 — netmask ต้องเป็นบิต 1 ที่ติดกัน" },
      { p: "`mask_to_int()` ปฏิเสธ mask ที่บิตไม่ต่อเนื่อง. `255.255.255.32` คือกับดักคลาสสิกที่ generator ใส่ไว้ให้เห็นแล้วเผลอคิดว่า 'ก็เป็นเลขใน mask ปกตินี่'" },
      { h: "กฎที่ 3 — IP ต้องอยู่ในพิสัยที่ยอมรับ" },
      { ul: [
        "octet แรก **มากกว่า 223 ไม่ได้** (ตัด class D multicast และ class E ทิ้ง)",
        "อะไรก็ตามใน `127.0.0.0/8` ไม่ได้ — จะเจอข้อความ `loopback address detected on outside interface`",
        "โค้ดใช้ `parseInt()` จึง **ยอมรับขยะท้ายเงียบ ๆ** เช่น `1.2.3.4 ` ที่มีเว้นวรรค — ในเกมผ่าน แต่ในไฟล์ JSON ที่ส่งอาจไม่ตรงที่ grader คาด ตัดช่องว่างให้สะอาดเสมอ"
      ]},
      { h: "กฎที่ 4 — ขาของ router ห้ามครอบกันเอง" },
      { p: "`rec_route()` เดินดูทุก interface ของ host หนึ่งตัวแล้วนับว่ามีกี่ขาที่ 'ครอบ' IP ปลายทาง. ถ้าได้มากกว่า 1 → `error on destination ip - multiple interface match` และตายทันที **แม้เส้นทางที่ถูกจะมีอยู่จริง**" },
      { code: String.raw`R1 ขา A: 192.168.1.1 /24    ครอบ 192.168.1.0 - .255
R1 ขา B: 192.168.1.129 /25  ครอบ 192.168.1.128 - .255   <- ซ้อน!

ปลายทาง 192.168.1.200 -> ตรงทั้ง A และ B -> multiple interface match`,
        cap: "นี่คือกฎที่ห้าม subnet ซ้อนกันบน router ตัวเดียว", lang: "txt" },
      { p: "วิธีแก้คือ **ซอยให้เล็กลงจนไม่ทับกัน** เช่น A = `/25` ที่ .0 (ครอบ .0-.127) และ B = `/25` ที่ .128 (ครอบ .128-.255) — ติดกันแต่ไม่ทับ" },
      { h: "กฎที่ 5 — routing table อ่านบนลงล่าง เจอแรกชนะ ไม่มี fallback" },
      { p: "ดูตัวอย่างในหมวดทฤษฎีข้อ 8. สองผลลัพธ์ที่ต้องท่อง: (1) `0.0.0.0/0` ที่วางไว้ **บน** route เฉพาะทำให้ route นั้นตายสนิท (2) ถ้า gateway ของบรรทัดที่ชนะไม่ตรงกับขาไหนเลย → packet ถูกทิ้ง ไม่ลองบรรทัดอื่น" },
      { h: "กฎที่ 6 — Internet มีข้อห้ามของมันเอง" },
      { ul: [
        "**ห้ามมี default route** — `invalid default route on internet` (ทั้ง `0.0.0.0/0` และคำว่า `default` โดนเหมือนกัน)",
        "**ทิ้ง private IP ทั้ง 3 ช่วง** — `private subnets not routed over internet`",
        "จึงต้องเขียน route **แบบเจาะจงหนึ่งบรรทัดต่อหนึ่ง subnet** ที่ต้องเข้าถึงได้จาก Internet"
      ]},
      { note: "ข้อนี้บีบการเลือกเลขทั้งกระดาน: ถ้า Internet มีช่อง route ให้แก้แค่ช่องเดียว **ทุก subnet ที่ต้องคุยกับมันต้องยัดอยู่ใต้ prefix เดียวกันได้** ซึ่งอาจบังคับให้ต้องย้ายเลขของ subnet ที่ดูไม่เกี่ยวข้องเลย" },
      { h: "กฎที่ 7 — สอบทั้งขาไปและขากลับ" },
      { p: "`sim_reach_gen()` รันเส้นทาง 2 รอบ: `Forward way` (src→dst) และ `Reverse way` (dst→src). ถ้าขากลับไม่ผ่านจะได้ `KO - No reverse way, try again...` **นี่คือสาเหตุอันดับหนึ่งที่ด่านดูถูกหมดแล้วแต่ยังแดง**" },
      { p: "และขากลับพังเพราะ **route ที่หายไปบน router ปลายทางหรือบน Internet** บ่อยกว่าเพราะ mask ผิดมาก" },
      { h: "ตารางข้อความ error → แปลไทย → แก้ยังไง" },
      { table: { head: ["ข้อความจาก sim.js", "แปลว่า", "แก้ที่ไหน"], rows: [
        ["`invalid IP address`", "IP ผิดรูป / เกิน 223 / เป็น 127.x", "ช่อง IP นั้น"],
        ["`invalid netmask`", "บิต 1 ไม่ติดกัน", "ช่อง mask นั้น"],
        ["`invalid IP on input interface`", "IP ตรงกับ network/broadcast ของตัวเอง", "ขยับ IP เข้ากลางบล็อก"],
        ["`packet not for me`", "มาถึงเครื่องแล้ว แต่ไม่มีขาไหน IP ตรงปลายทาง", "IP ปลายทางหรือ mask ของ segment"],
        ["`destination does not match any route`", "ไม่มีบรรทัดไหนในตารางครอบปลายทาง", "เพิ่ม route (หรือ default)"],
        ["`route match but no interface for gateway`", "บรรทัดที่ชนะชี้ไป gateway ที่คุยตรงไม่ได้", "gateway ต้องอยู่ใน subnet ของขาใดขาหนึ่ง"],
        ["`error on destination ip - multiple interface match`", "2 ขาครอบปลายทางพร้อมกัน", "ซอย subnet ให้ไม่ทับ"],
        ["`error on gate ip - multiple interface match`", "2 ขาครอบ gateway พร้อมกัน", "เหมือนข้างบน"],
        ["`loop detected`", "packet วนกลับที่เดิม", "route ชี้ไปกลับหากันเอง"],
        ["`invalid default route on internet`", "Internet มี default route", "ลบ แล้วเขียน route เจาะจงแทน"],
        ["`private subnets not routed over internet`", "ใช้ IP ส่วนตัวคุยผ่าน Internet", "เปลี่ยนเป็น IP สาธารณะ"],
        ["`duplicate IP`", "2 interface บน segment เดียวกันเลขซ้ำ", "เปลี่ยนตัวใดตัวหนึ่ง"],
        ["`KO - No reverse way`", "ไปได้แต่กลับไม่ได้", "route ขากลับบน router ปลายทาง/Internet"]
      ]}}
    ],

    architecture: [
      { p: "หมวดนี้คือ **วิธี 6 ขั้น** ที่ใช้ได้กับทุกกระดาน รวมถึงกระดานสุ่มตอน defense — จำวิธี ไม่ใช่จำเลข" },
      { h: "ขั้น 1 — วาด segment ก่อนแตะเลขสักตัว" },
      { p: "ไล่สายไฟ. อะไรก็ตามที่ห้อยอยู่กับ **switch เดียวกัน** หรือต่อสายตรงถึงกัน = **หนึ่ง segment = หนึ่ง subnet**. เขียนลงกระดาษ/comment ว่ามีกี่ segment แต่ละ segment มีใครบ้าง" },
      { code: String.raw`   A1 ---+
         |
   A2 ---+--[SW]--- R1(ขา1)      segment S1 = {A1, A2, R1.1}
                                  segment S2 = {R1.2, R2.1}
   R1(ขา2) ------- R2(ขา1)        segment S3 = {R2.2, B1}
   R2(ขา2) ------- B1`, cap: "switch ไม่ใช่ hop — มันแค่ทำให้ทุกคนอยู่สายเดียวกัน", lang: "txt" },
      { h: "ขั้น 2 — หา 'หมุด' (pin) คือค่าที่แก้ไม่ได้" },
      { p: "ช่องเทาคือข้อกำหนดที่กระดานยัดมาให้ ไม่ใช่คำใบ้. เรียงตามความแรง:" },
      { table: { head: ["ชนิดหมุด", "บอกอะไร", "แรงแค่ไหน"], rows: [
        ["**gateway ที่ล็อกใน routing table**", "IP ของ interface ฝั่งตรงข้ามต้องเป็นเลขนี้เป๊ะ", "แรงที่สุด"],
        ["**IP ของ interface ที่ล็อก**", "subnet ต้องครอบเลขนี้", "แรง"],
        ["**mask ที่ล็อก**", "ขนาดบล็อกของ segment นั้นถูกกำหนดแล้ว", "ปานกลาง"],
        ["**route ที่ล็อก (destination)**", "subnet ปลายทางต้องตรงกับ prefix นี้", "แรง"]
      ]}},
      { note: "**เริ่มจากหมุดที่แรงที่สุดเสมอ** — เห็น gateway ล็อกว่า `10.12.0.1` ก็ตั้ง interface ฝั่งนั้นเป็น `10.12.0.1` ทันที แล้วค่อยสร้าง subnet รอบ ๆ ตัวเลขนั้น อย่าเลือกเลขสวย ๆ เองก่อนแล้วมาฝืนทีหลัง" },
      { h: "ขั้น 3 — mask ของ segment = mask ที่ 'แคบที่สุด' ที่ถูกล็อกไว้" },
      { p: "ทุก interface บน segment เดียวกันต้องใช้ mask เดียวกัน (ถ้าไม่เท่ากัน มุมมองว่า 'ใครอยู่บ้านเดียวกัน' จะไม่ตรงกัน แล้วขากลับจะพัง). ถ้ามี mask ล็อกอยู่หลายอัน ใช้อันที่ **แคบที่สุด** (ตัวเลข CIDR สูงสุด) เป็นตัวตั้งของทั้ง segment" },
      { h: "ขั้น 4 — ตรวจ router ทุกตัว: ขาห้ามครอบกัน" },
      { p: "ต่อ router 1 ตัว เอาช่วง network ของทุกขามาวางเรียงกัน ถ้ามีจุดที่ทับกันแม้แค่ IP เดียว → `multiple interface match`. แก้โดยซอยเป็นบล็อกเล็กลงที่ **ติดกันแต่ไม่ทับ**" },
      { code: String.raw`ผิด:  ขา1 = 192.168.1.0/24     (.0   - .255)
      ขา2 = 192.168.1.128/25   (.128 - .255)   <- อยู่ในขา1

ถูก:  ขา1 = 192.168.1.0/25     (.0   - .127)
      ขา2 = 192.168.1.128/25   (.128 - .255)`, cap: "ซอย /24 เป็น /25 สองก้อน — จำนวนที่นั่งพอ และไม่ทับกัน", lang: "txt" },
      { h: "ขั้น 5 — ถ้ามี Internet ให้จัดการมันก่อนใคร" },
      { ul: [
        "ทุก subnet ที่ต้องคุยกับ Internet ต้องเป็น **IP สาธารณะ** (ไม่ใช่ 10./172.16./192.168.)",
        "Internet **ห้ามมี default route** — ต้องเป็น route เจาะจง 1 บรรทัดต่อ 1 subnet",
        "นับช่องว่างใน routing table ของ Internet ก่อน: **มีกี่ช่อง = ทำได้กี่ prefix** ถ้ามีช่องเดียวแต่ต้องเข้าถึง 2 subnet ต้องออกแบบให้ 2 subnet นั้นอยู่ใต้ prefix ใหญ่อันเดียวกัน"
      ]},
      { h: "ขั้น 6 — เดินทุก goal ด้วยมือ ทั้งไปและกลับ" },
      { p: "อย่าเชื่อสายตา. ต่อ 1 goal ให้ไล่ทีละ hop ตอบ 3 คำถามนี้ทุกครั้ง: (ก) hop นี้มีขาที่ครอบปลายทางไหม (ข) ถ้าไม่มี routing table มีบรรทัดที่ครอบไหม (ค) gateway ของบรรทัดนั้นอยู่ใน subnet ของขาใดขาหนึ่งไหม. **แล้วทำซ้ำโดยสลับ src กับ dst**" },
      { h: "ลำดับการกรอกที่ทำให้ไม่ต้องรื้อ" },
      { table: { head: ["ลำดับ", "ทำอะไร"], rows: [
        ["1", "วาด segment ทั้งหมดจากสายไฟ"],
        ["2", "จด pin ทุกตัว (gateway ล็อก > IP ล็อก > mask ล็อก)"],
        ["3", "เลือก network + mask ต่อ segment ให้คลุม pin ทุกตัวของ segment นั้น"],
        ["4", "ตรวจว่าขาของ router แต่ละตัวไม่ทับกัน — ถ้าทับ ย้อนไปข้อ 3"],
        ["5", "เติม IP host ให้อยู่กลางบล็อก (ไม่ชน network/broadcast)"],
        ["6", "เขียน routing table: เจาะจงไว้บน default ไว้ล่าง"],
        ["7", "เดินทุก goal ไป-กลับ แล้วค่อยกด Get my config"]
      ]}}
    ],

    dataflow: [
      { p: "หมวดนี้ตาม packet หนึ่งใบตั้งแต่ต้นทางถึงปลายทาง แบบเดียวกับที่ `rec_route()` ทำ — พออ่านจบจะอ่าน Show logs ออกทั้งหมด" },
      { h: "สิ่งที่ host ทำเมื่อจะส่ง packet" },
      { code: String.raw`ถ้า (ปลายทาง อยู่ใน subnet ของขาฉัน)
        ส่งตรงบนสายเลย                       -> log: "match itf ..."
มิฉะนั้น
        ค้น routing table หา 'บรรทัดแรกที่ครอบปลายทาง'
        ถ้าไม่เจอ  -> destination does not match any route  (ตาย)
        ถ้าเจอ     -> ดู gateway ของบรรทัดนั้น
                      gateway อยู่ใน subnet ของขาฉันไหม?
                        ไม่ -> route match but no interface for gateway (ตาย)
                        ใช่ -> ส่งต่อไปหา gateway            -> ทำซ้ำที่เครื่องนั้น`,
        cap: "ตรรกะเดียวใช้กับทั้ง host และ router — router ต่างแค่มีหลายขา", lang: "txt" },
      { h: "สิ่งที่เครื่องปลายทางทำเมื่อ packet มาถึง" },
      { ul: [
        "ถ้าขาใดขาหนึ่งมี **IP ตรงกับปลายทางเป๊ะ** → `destination IP reached` → สำเร็จ",
        "ถ้าไม่มีขาไหนตรงเลย → `packet not for me` → ตาย (มาถูกบ้านแต่ผิดเลขที่)",
        "ถ้ามี **มากกว่าหนึ่ง** ขาที่ครอบ → `multiple interface match` → ตาย"
      ]},
      { note: "ระวังคำสองคำนี้ให้ดี: **'ครอบ' (match subnet)** ใช้ตัดสินว่าจะส่งทางไหน แต่ **'ตรงเป๊ะ' (equal)** ใช้ตัดสินว่ามาถึงหรือยัง — คนละเรื่องกัน" },
      { h: "ตัวอย่างเดินเต็มเส้น" },
      { code: String.raw`ผัง:  A1 --- [SW] --- R1.1        R1.2 --- R2.1        R2.2 --- B1

S1 = 192.168.1.0/24    A1 = .10        R1.1 = .1
S2 = 10.0.0.0/30       R1.2 = 10.0.0.1  R2.1 = 10.0.0.2
S3 = 192.168.2.0/24    R2.2 = .1        B1  = .20

R1 routes:  192.168.2.0/24 -> 10.0.0.2
R2 routes:  192.168.1.0/24 -> 10.0.0.1
A1 routes:  default        -> 192.168.1.1
B1 routes:  default        -> 192.168.2.1`, cap: "ผังตัวอย่างสำหรับเดินตามข้างล่าง", lang: "txt" },
      { code: String.raw`Forward way: A1 (192.168.1.10) -> B1 (192.168.2.20)

A1:  .2.20 อยู่ใน 192.168.1.0/24 ไหม? ไม่
     ค้น table -> default (0.0.0.0/0) ครอบ -> gateway 192.168.1.1
     192.168.1.1 อยู่ใน subnet ของขาฉัน (.1.0/24) ไหม? ใช่ -> ส่ง
R1:  รับที่ขา1. .2.20 ตรงกับ IP ขาไหนเป๊ะไหม? ไม่ -> ไม่ใช่ของฉัน ต้อง forward
     ขาไหนครอบ .2.20 บ้าง? ขา1 = .1.0/24 ไม่ครอบ, ขา2 = 10.0.0.0/30 ไม่ครอบ
     ค้น table -> 192.168.2.0/24 ครอบ -> gateway 10.0.0.2
     10.0.0.2 อยู่ใน 10.0.0.0/30 ของขา2 -> ส่ง
R2:  รับที่ขา1. ขา2 = 192.168.2.0/24 ครอบ .2.20 -> ส่งตรงบนสาย
B1:  IP ฉัน = 192.168.2.20 ตรงเป๊ะ -> destination IP reached  OK`,
        cap: "อ่านทีละบรรทัดแล้วเทียบกับ Show logs จริง จะตรงกันคำต่อคำ", lang: "txt" },
      { code: String.raw`Reverse way: B1 -> A1   (สลับ src/dst แล้วเดินใหม่ทั้งเส้น)

B1:  default -> 192.168.2.1 (R2.2)             ok
R2:  table มี 192.168.1.0/24 -> 10.0.0.1       ok
R1:  ขา1 = 192.168.1.0/24 ครอบ .1.10          ok
A1:  ตรงเป๊ะ -> OK

ถ้า R2 ไม่มีบรรทัด 192.168.1.0/24 :
     Forward way: OK      (เพราะขาไปไม่ต้องใช้ตารางของ R2 ในทิศนี้)
     Reverse way: KO      destination does not match any route`,
        cap: "นี่คือหน้าตาของ 'ครึ่งเดียว' ที่ทำให้คนเสียเวลาไปทั้งวัน", lang: "txt" },
      { h: "ทำไม goal ที่ดูไกลกลับผ่าน แต่ goal ที่อยู่ติดกันกลับไม่ผ่าน" },
      { p: "เพราะ goal ที่อยู่ **บน segment เดียวกัน** ไม่ต้องใช้ routing table เลย — มันเช็กแค่ว่า network+mask ตรงกันไหม. ถ้า goal ใกล้ ๆ พังแต่ goal ไกลผ่าน แปลว่าปัญหาอยู่ที่ **mask หรือ IP ของ segment นั้น** ไม่ใช่ที่ตาราง" },
      { h: "อ่าน Show logs ให้เป็น" },
      { code: String.raw`R1 -> B1 input itf if_R1a
   chk with itf if_R1a
   chk with itf if_R1b
   match itf if_R1b               <- เจอขาที่จะออก
: route match 192.168.2.0/24
: send to gateway 10.0.0.2 through interface if_R1b`,
        cap: "แต่ละบรรทัดคือหนึ่งการตัดสินใจ — บรรทัดที่หายไปคือบรรทัดที่ตาราง/mask ยังไม่ถูก", lang: "txt" },
      { p: "**เทคนิค:** ดูว่า log หยุดที่เครื่องไหน แล้วไปแก้ที่เครื่องนั้นเป็นอันดับแรก อย่ารื้อทั้งกระดาน" }
    ],

    implementation: [
      { p: "หมวดนี้คือแบบฝึกคิดจริง — ซอย subnet, วาง route, และรูปแบบด่านที่เจอซ้ำ ๆ" },
      { h: "แบบฝึก 1: ซอย /24 เป็น 4 ก้อนเท่า ๆ กัน" },
      { code: String.raw`ต้องการ 4 subnet จาก 192.168.10.0/24
  4 ก้อน -> ต้องยืมบิต 2 ตัว (2^2 = 4) -> /24 + 2 = /26
  block = 256 / 4 = 64  -> mask = 256 - 64 = 192 -> 255.255.255.192

  #1  192.168.10.0/26     ใช้ได้ .1   - .62     bcast .63
  #2  192.168.10.64/26    ใช้ได้ .65  - .126    bcast .127
  #3  192.168.10.128/26   ใช้ได้ .129 - .190    bcast .191
  #4  192.168.10.192/26   ใช้ได้ .193 - .254    bcast .255`,
        cap: "จำนวนก้อน = 2^บิตที่ยืม; ขนาดก้อน = 256 / จำนวนก้อน", lang: "txt" },
      { h: "แบบฝึก 2: ต้องการ host กี่เครื่อง → mask อะไร" },
      { code: String.raw`ต้องการ 30 เครื่อง  -> ต้องมีที่ 30 + 2 (network + broadcast) = 32
                    -> block 32 -> /27 -> 255.255.255.224   (ใช้ได้ 30 พอดี)

ต้องการ 2 เครื่อง (ลิงก์ router-router)
                    -> 2 + 2 = 4 -> block 4 -> /30 -> 255.255.255.252

ต้องการ 100 เครื่อง -> 100 + 2 = 102 -> ต้อง 128 -> /25 -> 255.255.255.128`,
        cap: "บวก 2 เสมอ แล้วปัดขึ้นเป็นกำลังของ 2 ตัวถัดไป", lang: "txt" },
      { note: "ในเกม **การใช้ mask กว้างเกินไปไม่ผิด** ตราบใดที่ไม่ทำให้ขาของ router ทับกัน — ถ้าไม่มีข้อบังคับ ใช้ `/24` ให้หมดจะง่ายและพลาดยากที่สุด. ซอยเล็กเมื่อจำเป็นเท่านั้น" },
      { h: "แบบฝึก 3: หมุด gateway บังคับทุกอย่าง" },
      { code: String.raw`โจทย์: routing table ของ A1 ล็อกไว้ว่า  default -> 172.20.5.129
       และ mask ของ A1 ล็อกไว้ที่ /26

หมุดบอกว่า: interface ของ router ที่อยู่ข้าง A1 = 172.20.5.129 (ห้ามเป็นอย่างอื่น)
/26 -> block 64 -> ขอบบล็อกคือ .128
   -> subnet ของ segment นี้คือ 172.20.5.128/26  (.128 - .191)
   -> .129 อยู่ในช่วง และไม่ใช่ network(.128) ไม่ใช่ bcast(.191)  ok
   -> A1 เลือกอะไรก็ได้ใน .130 - .190           เช่น 172.20.5.130`,
        cap: "หมุดตัวเดียว + mask ตัวเดียว ล็อกทั้ง segment ทันที", lang: "txt" },
      { h: "แบบฝึก 4: routing table ที่ต้องเรียงให้ถูก" },
      { code: String.raw`R1 มี 3 ขา ต้องไปได้ทั้ง 192.168.2.0/24, 192.168.3.0/24 และ Internet

ผิด:                              ถูก:
  0.0.0.0/0      -> 41.66.1.1       192.168.2.0/24 -> 10.0.0.2
  192.168.2.0/24 -> 10.0.0.2        192.168.3.0/24 -> 10.0.1.2
  192.168.3.0/24 -> 10.0.1.2        0.0.0.0/0      -> 41.66.1.1

  (2 บรรทัดล่างไม่มีวันถูกใช้)      (เจาะจงก่อน แล้วค่อย catch-all)`,
        cap: "กฎ 'บรรทัดแรกที่ตรงชนะ' ทำให้ลำดับเป็นตรรกะ ไม่ใช่ความสวยงาม", lang: "txt" },
      { h: "แบบฝึก 5: กระดานที่มี Internet" },
      { code: String.raw`Internet (host พิเศษ) มีช่อง route 2 ช่อง
ต้องเข้าถึง: LAN-A และ LAN-B

ทางเลือก 1 (มี 2 ช่อง): เขียนแยก
     104.198.7.0/24  -> <ขาของ router ฝั่ง A>
     104.198.8.0/24  -> <ขาของ router ฝั่ง B>

ทางเลือก 2 (ถ้ามีช่องเดียว): ออกแบบให้อยู่ใต้ prefix เดียว
     A = 104.198.6.0/25   (.0 - .127)
     B = 104.198.6.128/25 (.128 - .255)
     Internet route: 104.198.6.0/24 -> <ขาของ router ที่คุมทั้งคู่>

ห้ามเด็ดขาด: 0.0.0.0/0 บน Internet  -> invalid default route on internet
ห้ามเด็ดขาด: ใช้ 192.168.x บน segment ที่ต้องคุยกับ Internet`,
        cap: "จำนวนช่องใน routing table ของ Internet คือข้อจำกัดที่ออกแบบเลขทั้งกระดาน", lang: "txt" },
      { h: "รูปแบบด่านที่เจอซ้ำ" },
      { table: { head: ["ด่านราว ๆ", "แก่นของด่าน", "จุดที่พลาด"], rows: [
        ["1-2", "IP บน segment เดียวกันต้องอยู่ subnet เดียวกัน", "เผลอใส่เลขนอกช่วง"],
        ["3-4", "mask ที่ล็อกกำหนดขอบบล็อก", "IP ไปตรง network/broadcast"],
        ["5-6", "router 2 ขา ต้องมี route ทั้งสองทิศ", "ใส่ route ทางเดียว → No reverse way"],
        ["7-8", "หลาย subnet + default route", "วาง default ไว้บนสุด"],
        ["9-10", "Internet + public IP + ขาที่ห้ามซ้อน", "ใช้ private IP / มี default route บน Internet"]
      ]}},
      { h: "การส่งงาน" },
      { code: String.raw`{"routes":{"<rid>":{"route":"...","gate":"..."}},
 "ifs":{"<if>":{"ip":"...","mask":"..."}}}`,
        cap: "รูปแบบที่ปุ่ม Get my config (dl_config) เขียนออกมาเป๊ะ ๆ", lang: "json" },
      { ul: [
        "**เฉพาะช่องที่แก้ได้** เท่านั้นที่โผล่ในไฟล์ — ไฟล์ที่มี key เกินหรือขาดจะไม่ตรงกับที่ grader คาด",
        "ตั้งชื่อไฟล์ `level1.json` … `level10.json` วางที่ราก repo",
        "อย่าแก้ JSON ด้วยมือแล้วเดาว่าเกมจะยอม — กลับไปกรอกในเกมแล้ว export ใหม่เสมอ"
      ]}
    ],

    tricks: [
      { h: "ทริค 1 — กระดานเป็น deterministic ต่อ login" },
      { p: "`load_board()` สุ่มด้วย xorshift PRNG ที่ seed จาก `level + hash_login(login)` โดย `hash_login` ผสม `973*(code+i)` ที่ index คู่ และ `5*code*i` ที่ index คี่. **login เดิม + level เดิม = กระดานเดิมตลอดกาล** — นี่คือเหตุผลที่ moulinette ตรวจไฟล์ JSON ที่ export มาได้" },
      { p: "แต่ถ้าไม่มี login เก็บไว้ (**โหมด evaluation / defense**) มันจะ fallback ไป `Math.random()` → กระดานสุ่มใหม่ทุกครั้ง. **คำตอบที่ท่องมาไร้ค่าที่นั่น** — เตรียม 'วิธี' ไม่ใช่ 'ตัวเลข'" },
      { h: "ทริค 2 — ตรวจ config โดยไม่ต้องเปิดเบราว์เซอร์" },
      { p: "`show.js` และ `sim.js` ใช้แค่ `document.getElementById(id).value` เท่านั้น จึงรันใน Node ได้ด้วย DOM ปลอมจิ๋ว ๆ — ไม่ต้อง jsdom ไม่ต้องเบราว์เซอร์" },
      { code: String.raw`const sandbox = {
  document: { getElementById: getEl, createElement: stub, createElementNS: stub,
              body: { appendChild(){}, removeChild(){} } },
  window: { innerHeight: 800 },
  localStorage: { getItem: k => (k === 'g_my_login' ? login : null), setItem(){} },
  console, JSON, Math, parseInt, isNaN, RegExp
};
vm.createContext(sandbox);
['level8.js', 'show.js', 'sim.js'].forEach(f => new vm.Script(read(f)).runInContext(sandbox));
vm.runInContext('load_board();', sandbox);     // สุ่มกระดาน
// เติมค่า: getEl('ip_R13').value = '...'
vm.runInContext('all_goals();', sandbox);
// อ่านผลจาก getEl('goals_id').innerHTML`,
        cap: "รันไฟล์ต้นฉบับโดยไม่แก้ = ผลลัพธ์เชื่อถือได้จริง", lang: "js" },
      { p: "**compile ทั้ง 3 สคริปต์ครั้งเดียวแล้วใช้ซ้ำ** — การ compile ใหม่ทุกครั้งคือสาเหตุที่ fuzz หลักพันเคสใช้เวลาเป็นนาทีแทนที่จะเป็นวินาที" },
      { note: "ถ้าเขียน solver แยก (port ตรรกะเองเพื่อความเร็ว) ให้เก็บตัวจริงไว้ข้าง ๆ แล้ว **differential-fuzz เทียบกัน** — port ที่เพี้ยนเรื่อง `>>> 0` หรือเครื่องหมายของ `~mask` จะยินดีรับ config ที่เกมจริงปฏิเสธ" },
      { h: "ทริค 3 — ลำดับการสุ่มสำคัญถ้าจะเล่นซ้ำแบบ offline" },
      { p: "`load_board()` เรียก `show_host()` ให้ทุก host ก่อน (สุ่ม route แล้วตามด้วย gate) จากนั้นค่อย `show_ifs()` ให้ทุก interface (สุ่ม ip แล้วตามด้วย mask). placeholder หน้าตาแบบ `[60-125]a` = สุ่มแล้วผูกกับตัวอักษร `a`, ส่วน `[a]` = ใช้ค่าเดิมของ `a` ซ้ำ" },
      { h: "ทริค 4 — กับดักที่กินเวลามากที่สุด" },
      { ul: [
        "**gateway ที่ล็อกคือข้อกำหนด ไม่ใช่คำใบ้** — ตั้ง interface ฝั่งตรงข้ามให้เป็นเลขนั้นก่อน แล้วค่อยสร้าง subnet ล้อมรอบ",
        "**IP ที่ต่างกันแค่ octet ที่สาม** เช่น `211.190.x` กับ `211.191.x` เป็นคนละ /16 — generator ตั้งใจวางไว้ให้ตาลาย",
        "**`default` กับ `0.0.0.0/0` เท่ากันทุกประการ** ในสายตา sim.js รวมถึงตอนที่มันห้ามบน Internet",
        "**ขากลับพังเพราะ route หาย ไม่ใช่เพราะ mask ผิด** — ไปแก้ที่ router ปลายทางหรือที่ Internet ก่อน",
        "**เปลี่ยน mask แล้วต้องตรวจ IP เดิมใหม่ทุกครั้ง** — ขอบบล็อกขยับ IP ที่เคยดีอาจกลายเป็น network/broadcast",
        "**ช่องว่างท้าย IP** ผ่านในเกมเพราะ `parseInt()` แต่ทำให้ JSON ที่ส่งไม่สะอาด"
      ]},
      { h: "ทริค 5 — เมื่อติดจริง ๆ ให้ทำ 3 อย่างนี้ตามลำดับ" },
      { table: { head: ["ลำดับ", "ทำอะไร", "เพราะอะไร"], rows: [
        ["1", "กด **Show logs** อ่านว่าตายที่ hop ไหน", "ประหยัดเวลามากกว่าเดาสิบเท่า"],
        ["2", "ที่ hop นั้น ถามว่า 'ขาไหนครอบปลายทาง' และ 'gateway ถึงได้ไหม'", "ทุก error ในเกมมาจาก 2 คำถามนี้"],
        ["3", "เดินขากลับด้วยมือ", "ครึ่งของด่านที่ค้างเป็นปัญหาขากลับล้วน ๆ"]
      ]}},
      { h: "ทริค 6 — คำที่ทำให้สับสนที่สุดสองคำ" },
      { p: "**Gateway ≠ ปลายทาง.** gateway คือ 'บ้านถัดไปที่ฉันเดินไปหาได้เอง' ส่วน destination คือ 'บ้านที่ packet อยากไป'. ตารางบอกว่า 'อยากไปที่นี่ ให้เดินไปหาคนนี้ก่อน' เท่านั้น" },
      { p: "**Mask ไม่ได้ทำให้เข้าถึงได้.** mask แค่บอกว่า 'ใครถือว่าอยู่บ้านเดียวกับฉัน' — การขยาย mask ให้กว้างขึ้นเพื่อ 'ให้ถึงกัน' คือความเข้าใจผิดคลาสสิก และมักไปสร้าง `multiple interface match` แทน" },
      { h: "ทริค 7 — เตรียมตัวก่อน defense" },
      { ul: [
        "ฝึกบนกระดานสุ่ม (ลบ login ใน localStorage แล้ว reload) ให้ได้อย่างน้อย 3 รอบ",
        "ท่องตาราง CIDR /24 ถึง /30 ให้ขึ้นใจ — คำนวณช้าคือจุดที่ผู้ตรวจสังเกต",
        "อธิบายให้ได้ว่าทำไม `/30` ถึงเหมาะกับลิงก์ระหว่าง router สองตัว",
        "อธิบายให้ได้ว่า switch ต่างจาก router ยังไง (ไม่มี IP ไม่ใช่ hop ไม่ตัดสินใจ)"
      ]}
    ],

    eval: [
      { p: "คำถามที่ผู้ตรวจถามจริงตอน defense พร้อมคำตอบที่ตอบได้ใน 1-2 ประโยค" },
      { qa: [
        { q: "netmask คืออะไร ทำหน้าที่อะไร",
          a: "เลข 32 บิตที่มีบิต 1 ติดกันจากซ้าย ใช้แบ่ง IP ออกเป็นส่วน **network** กับส่วน **host** — เอา IP มา AND กับ mask ได้ network address ซึ่งคือ 'บ้าน' ที่เครื่องนั้นอยู่" },
        { q: "ทำไม mask 255.255.255.32 ถึงใช้ไม่ได้",
          a: "เพราะบิต 1 ไม่ติดกัน (…00100000) mask ต้องเป็นบิต 1 ต่อเนื่องจากซ้ายแล้วตามด้วย 0 ล้วน — `mask_to_int()` ปฏิเสธตรง ๆ" },
        { q: "network address กับ broadcast address คำนวณยังไง",
          a: "`network = ip - (ip mod block)` และ `broadcast = network + block - 1` โดย block = 256 - ค่าใน octet สุดท้ายของ mask เช่น .222 ภายใต้ /27 → network .192, broadcast .223" },
        { q: "ทำไม interface ที่ mask เป็น /31 หรือ /32 ถึงใช้ไม่ได้ในเกมนี้",
          a: "/31 มี 2 เบอร์คือ network กับ broadcast พอดี /32 มีเบอร์เดียว ไม่เหลือให้ host — `get_if_ip()` เลยคืน null และ interface นั้นเหมือนไม่มี IP" },
        { q: "switch ต่างจาก router ยังไง",
          a: "switch ไม่มี IP ไม่ตัดสินใจอะไร เป็นแค่สายที่แตกออกหลายเส้น ทุกคนที่ห้อยอยู่จึงอยู่ subnet เดียวกัน; router มี IP ทุกขา มี routing table และเป็น hop จริงที่ตัดสินใจส่งต่อ" },
        { q: "routing table อ่านยังไง ลำดับสำคัญไหม",
          a: "อ่านบนลงล่าง **บรรทัดแรกที่ครอบปลายทางชนะแล้วหยุด** ถ้า gateway ของบรรทัดนั้นไปไม่ถึง packet ถูกทิ้งเลยไม่ไหลลงบรรทัดถัดไป ดังนั้น route เฉพาะเจาะจงต้องอยู่เหนือ default เสมอ" },
        { q: "default route คืออะไร ใช้เมื่อไร",
          a: "`0.0.0.0/0` ที่ครอบทุกปลายทาง ใช้ตอน 'อย่างอื่นทั้งหมดส่งไปทางนี้' — ต้องอยู่ล่างสุดของตาราง และห้ามใช้บน host ชนิด internet" },
        { q: "gateway ต้องมีคุณสมบัติอะไร",
          a: "ต้องเป็น IP ที่อยู่ใน subnet ของ interface ใดขาหนึ่งของเครื่องนั้น — คือเครื่องต้องคุยกับ gateway ได้ตรง ๆ บนสายโดยไม่ต้องผ่านใคร ไม่งั้นได้ `route match but no interface for gateway`" },
        { q: "`multiple interface match` เกิดจากอะไร",
          a: "interface สองขาของเครื่องเดียวกันครอบ IP ปลายทางพร้อมกัน คือ subnet ซ้อนทับกัน แก้โดยซอยเป็นบล็อกเล็กที่ติดกันแต่ไม่ทับ" },
        { q: "ทำไม goal ผ่านทางเดียว",
          a: "`sim_reach_gen()` จำลองทั้ง forward และ reverse ขากลับมักขาด route บน router ปลายทางหรือบน Internet — เส้นทางในเน็ตเวิร์กไม่ได้สมมาตรอัตโนมัติ" },
        { q: "private IP มีช่วงไหนบ้าง ทำไมถึงสำคัญที่นี่",
          a: "10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 — host ชนิด internet ทิ้ง packet ที่แตะช่วงเหล่านี้ ดังนั้น subnet ที่ต้องคุยกับ Internet ต้องเป็น IP สาธารณะ" },
        { q: "ถ้าต้องการ 30 เครื่องในหนึ่ง subnet ใช้ mask อะไร",
          a: "30 + 2 (network + broadcast) = 32 → block 32 → `/27` = 255.255.255.224 ซึ่งใช้ได้จริง 30 เบอร์พอดี" },
        { q: "ทำไมลิงก์ระหว่าง router สองตัวถึงนิยม /30",
          a: "ต้องการแค่ 2 IP บวก network กับ broadcast = 4 เบอร์พอดี ไม่เปลือง address และไม่เปิดช่องให้ subnet ทับกับขาอื่น" },
        { q: "แบ่ง 192.168.10.0/24 เป็น 4 subnet เท่ากันได้ยังไง",
          a: "ยืม 2 บิต → /26 block 64 → .0/26, .64/26, .128/26, .192/26 แต่ละก้อนใช้ได้ 62 เบอร์" },
        { q: "ทำไมกระดานตอน defense ไม่เหมือนที่ทำมา",
          a: "`load_board()` seed จาก login; ถ้าไม่มี login เก็บไว้จะ fallback ไป `Math.random()` กระดานจึงสุ่มใหม่ — จึงต้องได้วิธี ไม่ใช่ตัวเลข" },
        { q: "ไฟล์ที่ส่งมีอะไรบ้าง",
          a: "`level1.json` ถึง `level10.json` จากปุ่ม Get my config ซึ่งเขียนเฉพาะช่องที่แก้ได้ ในรูป `{\"routes\":{...},\"ifs\":{...}}`" },
        { q: "ถ้า log บอก `packet not for me` แปลว่าอะไร",
          a: "packet เดินมาถึงเครื่องถูกต้องแล้ว แต่ไม่มีขาไหนที่ IP ตรงกับปลายทางเป๊ะ — คือมาถูกบ้านแต่ผิดเลขที่ ปัญหาอยู่ที่ IP ปลายทางหรือ mask ของ segment นั้น" },
        { q: "ทำไมการขยาย mask ให้กว้างขึ้นถึงไม่ใช่วิธีแก้ 'ไปไม่ถึง'",
          a: "mask บอกแค่ว่าใครอยู่บ้านเดียวกัน ไม่ได้สร้างเส้นทาง การขยายมักทำให้ขาของ router ทับกันจนได้ `multiple interface match` แทน — สิ่งที่สร้างเส้นทางคือ routing table" }
      ]},
      { h: "เช็กลิสต์ก่อนกด Get my config" },
      { ul: [
        "ทุก goal เขียวทั้ง **Forward** และ **Reverse**",
        "ไม่มี interface ไหน IP ตรงกับ network หรือ broadcast ของตัวเอง",
        "ทุก mask บิต 1 ติดกัน และทุก interface บน segment เดียวกันใช้ mask เท่ากัน",
        "ไม่มี router ตัวไหนที่ 2 ขาครอบ IP เดียวกัน",
        "ทุก route: gateway อยู่ใน subnet ของขาใดขาหนึ่งของเครื่องนั้น",
        "route เฉพาะเจาะจงอยู่เหนือ default; Internet ไม่มี default route",
        "ไม่มี private IP บน segment ที่ต้องคุยกับ Internet",
        "ไม่มีช่องว่างหลงเหลือใน IP ที่กรอก"
      ]},
      { links: [
        { label: "RFC 1918 — Address Allocation for Private Internets", url: "https://datatracker.ietf.org/doc/html/rfc1918", note: "ต้นทางของ 10/8, 172.16/12, 192.168/16" },
        { label: "RFC 4632 — CIDR", url: "https://datatracker.ietf.org/doc/html/rfc4632", note: "ที่มาของสัญกรณ์ /24 และการรวม/ซอย prefix" },
        { label: "RFC 3021 — Using 31-Bit Prefixes on IPv4 Point-to-Point Links", url: "https://datatracker.ietf.org/doc/html/rfc3021", note: "โลกจริงยอม /31 แต่ sim.js ไม่ยอม" },
        { label: "Subnetting practice (subnettingpractice.com)", url: "https://subnettingpractice.com/", note: "ฝึกคิด network/broadcast ให้เร็วก่อน defense" }
      ]}
    ]
  }
});

Object.assign(window.TEACHING_EN, {
  netpractice: {
    principle: [
      { h: "What the project asks for" },
      { p: "NetPractice is **not a coding project** — it is a ten-level browser game. Each level shows a network diagram (hosts, routers, switches, an internet node) already cabled together, with blanks for **IP addresses**, **netmasks** and **routing tables**. Fill them in correctly and every goal turns `OK - Congratulations!!`; then the **Get my config** button hands you `levelN.json` to submit." },
      { p: "The deliverable is ten JSON files (`level1.json` … `level10.json`) and nothing else — no Makefile, no norminette, no valgrind." },
      { h: "Why it matters more than it looks" },
      { ul: [
        "It is the **first time in common core** you have to understand how a packet actually travels — knowledge you reuse in ft_irc, webserv, Inception and ft_transcendence",
        "It is a project you can **finish in a day or two** if you understand subnetting, and one that drags on for a week if you guess",
        "At **defense the board is randomised** — memorised answers are worthless, you need the method"
      ]},
      { h: "What is on the board" },
      { table: { head: ["Symbol", "What it is", "Has an IP?"], rows: [
        ["**Host** (a computer)", "The source or destination of a packet, one interface", "Yes, one"],
        ["**Router**", "Joins several segments, has several legs plus a routing table", "Yes, every leg"],
        ["**Switch**", "Just wire that fans out; it makes no decisions", "**No** — not a hop"],
        ["**Internet**", "A special host: no default route allowed, drops private IPs", "Yes"]
      ]}},
      { note: "**A switch has no IP and is not a hop** — everything hanging off one switch is a **single subnet** and must share one network range. This is the rule you use most often in the whole game." },
      { h: "What the blanks look like" },
      { code: String.raw`Interface A1              Routing table of router R1
  IP:   104.198.7.9        Destination        Next hop (gateway)
  Mask: 255.255.255.0       0.0.0.0/0    ->   104.198.7.1
                            192.168.2.0/24 -> 10.0.0.2

goals:
  A1 -> B1   Status: OK
  B1 -> A1   Status: KO   <- both directions must pass`, cap: "White fields are editable; grey ones are locked — a locked field is a specification, not a hint", lang: "txt" },
      { h: "sim.js is the judge, not the textbook" },
      { p: "Every verdict comes from one file: `net_practice/js/sim.js`. Anything a textbook says *should* work but that `sim.js` refuses simply does not pass. Read it once and you stop guessing — it is short and readable." },
      { p: "The **Show logs** button under the board prints the exact hop-by-hop path the packet took and why it died. Almost every stuck level is fixed by reading that log rather than by trying another mask." },
      { h: "The three things that fail people most" },
      { table: { head: ["Symptom", "Actual cause"], rows: [
        ["Goal green one way only", "The **return path** is missing — the sim runs both directions"],
        ["`multiple interface match`", "Two legs of the same router both cover the destination — overlapping subnets"],
        ["An IP that looks fine but is dead", "It is the **network or broadcast** address of its own mask"]
      ]}}
    ],
    theory: [
      { p: "This is all the arithmetic NetPractice uses — there is no more than this, but you need it fast enough to do in your head." },
      { h: "1) An IPv4 address is a 32-bit number written in four pieces" },
      { code: String.raw`192  .  168  .   1   .  42
11000000.10101000.00000001.00101010     = 3232235818

each octet = 8 bits = 0-255`, cap: "The dots are for humans; the machine sees one 32-bit integer", lang: "txt" },
      { h: "2) A netmask is the line between 'house' and 'occupant'" },
      { p: "A mask is a 32-bit number whose **1-bits must be contiguous from the left**, followed by zeros. Bits aligned with the ones are the **network** part; bits aligned with the zeros are the **host** part." },
      { code: String.raw`IP    192.168.1.42     11000000.10101000.00000001.00101010
Mask  255.255.255.0    11111111.11111111.11111111.00000000
                       \______ network ________/\__ host __/

network   = IP AND mask       = 192.168.1.0
broadcast = network OR ~mask  = 192.168.1.255`, cap: "AND with the mask gives the network, OR with its complement gives the broadcast", lang: "txt" },
      { note: "**A mask whose 1-bits are not contiguous is invalid**, e.g. `255.255.255.32` (11111111.11111111.11111111.00100000) — the generator plants this early, and `mask_to_int()` rejects it outright." },
      { h: "3) CIDR — the short way to write a mask" },
      { p: "`/24` means 'twenty-four 1-bits' = `255.255.255.0`. The number after the slash is the count of network bits." },
      { table: { head: ["CIDR", "netmask", "block", "usable", "mnemonic"], rows: [
        ["/24", "255.255.255.0", "256", "254", "the whole last octet"],
        ["/25", "255.255.255.128", "128", "126", "half"],
        ["/26", "255.255.255.192", "64", "62", "a quarter"],
        ["/27", "255.255.255.224", "32", "30", "an eighth"],
        ["/28", "255.255.255.240", "16", "14", ""],
        ["/29", "255.255.255.248", "8", "6", ""],
        ["/30", "255.255.255.252", "4", "2", "router-to-router link"],
        ["/31, /32", "…254 / …255", "2 / 1", "**0**", "always dead in this game"]
      ]}},
      { p: "**The shortcut:** the last octet of the mask = `256 - block`. Block 64 → `256-64 = 192` → `/26`. It works backwards too: seeing `240` → block `256-240 = 16` → `/28`." },
      { h: "4) Network and broadcast in three seconds" },
      { code: String.raw`network   = ip - (ip mod block)
broadcast = network + block - 1

Example: 192.168.1.222 / 27   (block = 32)
  222 mod 32 = 222 - 6*32 = 222 - 192 = 30
  network   = 222 - 30 = 192        -> 192.168.1.192
  broadcast = 192 + 32 - 1 = 223    -> 192.168.1.223
  usable    = .193 through .222     (30 addresses)`, cap: "Remainder against the block size — no binary conversion needed", lang: "txt" },
      { p: "**Block boundaries always land on multiples of the block size** — a /26 starts at .0, .64, .128 or .192, never at .50." },
      { h: "5) Why /31 and /32 are always dead" },
      { p: "A `/31` holds two addresses: network and broadcast, with nothing left for a host. A `/32` holds one, the network itself. `get_if_ip()` returns `null` when an address equals its own network or broadcast, so a /31 or /32 interface is **an interface with no IP**, and every goal through it fails." },
      { note: "In the real world RFC 3021 allows /31 on point-to-point links, but **sim.js does not know that RFC**. Again: the code is the judge, not the standard." },
      { h: "6) Private addresses and the Internet node" },
      { table: { head: ["Range", "CIDR", "Name in the code"], rows: [
        ["10.0.0.0 – 10.255.255.255", "10.0.0.0/8", "`private_class_A`"],
        ["172.16.0.0 – 172.31.255.255", "172.16.0.0/12", "`private_class_B`"],
        ["192.168.0.0 – 192.168.255.255", "192.168.0.0/16", "`private_class_C`"]
      ]}},
      { p: "A host of type `internet` **drops any packet from or to those three ranges** with `private subnets not routed over internet`. So anything that must talk through the Internet needs a public address." },
      { h: "7) A routing table is two columns" },
      { p: "Each line reads `destination/mask → gateway`: 'if the destination falls in this range, hand the packet to this neighbour'." },
      { ul: [
        "`0.0.0.0/0` (or the word `default`) **matches every destination** — it means 'everything else goes this way'",
        "**The gateway must be an address inside one of that machine's own interface subnets** — you cannot point at a machine you cannot reach directly",
        "A gateway is **not** the destination; it is only the next hop"
      ]},
      { h: "8) First match wins" },
      { code: String.raw`R1's routing table (read top to bottom)
  1) 0.0.0.0/0        -> 10.0.0.1     <- matches everything
  2) 192.168.2.0/24   -> 10.0.0.2     <- can never be reached

destination 192.168.2.5 -> hits line 1 first -> sent to 10.0.0.1 -> lost`,
        cap: "sim.js: if (nb_routes > 0) return ret; — it stops at the first match", lang: "txt" },
      { p: "**And if the winning line's gateway is unreachable, the packet is dropped — it does not fall through to the next line** (`route match but no interface for gateway`). Line order is therefore logic, not tidiness: specific routes on top, the default at the bottom." }
    ],
    foundations: [
      { p: "These are **the rules sim.js actually enforces**, read straight from the code — the whole game is decided by these seven." },
      { h: "Rule 1 — an IP may not be its own network or broadcast" },
      { p: "`get_if_ip()` returns `null` when the interface address equals the network or broadcast address derived from its own mask. An interface with no IP is an interface nobody can talk to." },
      { code: String.raw`IP 192.168.1.64  mask /26   -> .64 is the network of that /26  -> dead
IP 192.168.1.127 mask /26   -> .127 is the broadcast          -> dead
IP 192.168.1.65  mask /26   -> inside the block               -> fine`, cap: "Change a mask and you must re-check every address under it — the boundaries move", lang: "txt" },
      { h: "Rule 2 — the mask's 1-bits must be contiguous" },
      { p: "`mask_to_int()` rejects any non-contiguous mask. `255.255.255.32` is the classic trap: it looks like a number that belongs in a mask, and it is not." },
      { h: "Rule 3 — addresses must be in the accepted range" },
      { ul: [
        "The first octet may **not exceed 223** (class D multicast and class E are out)",
        "Nothing in `127.0.0.0/8` — you get `loopback address detected on outside interface`",
        "The code uses `parseInt()`, so it **silently accepts trailing junk** such as `1.2.3.4 ` with a space — the game passes, but the exported JSON is not clean. Trim it."
      ]},
      { h: "Rule 4 — a router's legs must not overlap" },
      { p: "`rec_route()` walks every interface of a host and counts how many cover the destination. More than one → `error on destination ip - multiple interface match`, and the packet dies **even though a correct path exists**." },
      { code: String.raw`R1 leg A: 192.168.1.1 /24    covers 192.168.1.0 - .255
R1 leg B: 192.168.1.129 /25  covers 192.168.1.128 - .255   <- overlap!

destination 192.168.1.200 -> matches both A and B -> multiple interface match`,
        cap: "This is the rule that forbids overlapping subnets on one router", lang: "txt" },
      { p: "The fix is to **split into smaller blocks that touch but never overlap**: A = `/25` at .0 (covering .0-.127) and B = `/25` at .128 (covering .128-.255)." },
      { h: "Rule 5 — top to bottom, first match wins, no fallback" },
      { p: "See theory item 8. Two consequences to memorise: (1) a `0.0.0.0/0` placed **above** a specific route makes that route unreachable; (2) if the winning line's gateway matches no interface, the packet is dropped rather than retried on the next line." },
      { h: "Rule 6 — the Internet node has its own prohibitions" },
      { ul: [
        "**No default route** — `invalid default route on internet` (both `0.0.0.0/0` and the word `default` are refused)",
        "**Drops all three private ranges** — `private subnets not routed over internet`",
        "So it needs **one explicit route per reachable subnet**"
      ]},
      { note: "This constrains the whole board: if the Internet has only one editable route slot, **every subnet that must reach it has to fit under a single prefix** — which can force an apparently unrelated subnet to move." },
      { h: "Rule 7 — both directions are tested" },
      { p: "`sim_reach_gen()` runs the path twice: `Forward way` (src→dst) and `Reverse way` (dst→src). A failing return path gives `KO - No reverse way, try again...`. **This is the number-one reason a level looks right and stays red.**" },
      { p: "And the return path usually fails because of **a missing route on the far router or on the Internet**, far more often than because of a wrong mask." },
      { h: "Error message → meaning → where to fix it" },
      { table: { head: ["Message from sim.js", "Means", "Fix where"], rows: [
        ["`invalid IP address`", "Malformed / first octet > 223 / in 127.x", "That IP field"],
        ["`invalid netmask`", "1-bits are not contiguous", "That mask field"],
        ["`invalid IP on input interface`", "It equals its own network or broadcast", "Move the IP into the block"],
        ["`packet not for me`", "Arrived, but no leg matches the destination exactly", "The destination IP or the segment mask"],
        ["`destination does not match any route`", "No line covers the destination", "Add a route (or a default)"],
        ["`route match but no interface for gateway`", "The winning line points at an unreachable gateway", "Gateway must sit in one of the legs' subnets"],
        ["`error on destination ip - multiple interface match`", "Two legs cover the destination", "Split the subnets so they do not overlap"],
        ["`error on gate ip - multiple interface match`", "Two legs cover the gateway", "Same as above"],
        ["`loop detected`", "The packet came back where it started", "Routes pointing at each other"],
        ["`invalid default route on internet`", "The Internet node has a default route", "Delete it, write explicit routes"],
        ["`private subnets not routed over internet`", "A private address is crossing the Internet", "Use a public address"],
        ["`duplicate IP`", "Two interfaces on one segment share an address", "Change one of them"],
        ["`KO - No reverse way`", "It gets there but cannot come back", "The return route on the far router or Internet"]
      ]}}
    ],
    architecture: [
      { p: "This is the **six-step method** that works on any board, including a random defense board — learn the method, not the numbers." },
      { h: "Step 1 — draw the segments before touching a single number" },
      { p: "Follow the cables. Everything hanging off **the same switch**, or directly cabled together, is **one segment = one subnet**. Write down how many segments exist and who is on each." },
      { code: String.raw`   A1 ---+
         |
   A2 ---+--[SW]--- R1(leg1)     segment S1 = {A1, A2, R1.1}
                                 segment S2 = {R1.2, R2.1}
   R1(leg2) ------ R2(leg1)      segment S3 = {R2.2, B1}
   R2(leg2) ------ B1`, cap: "A switch is not a hop — it just puts everyone on the same wire", lang: "txt" },
      { h: "Step 2 — find the pins: the values you cannot edit" },
      { p: "A grey field is a requirement the board imposed, not a hint. In order of strength:" },
      { table: { head: ["Kind of pin", "What it dictates", "Strength"], rows: [
        ["**A locked gateway in a routing table**", "The exact IP of the interface at the other end", "Strongest"],
        ["**A locked interface IP**", "The subnet must contain that address", "Strong"],
        ["**A locked mask**", "The block size of that segment is decided", "Medium"],
        ["**A locked route destination**", "The far subnet must match that prefix", "Strong"]
      ]}},
      { note: "**Always start from the strongest pin.** A locked gateway of `10.12.0.1` means you set the neighbouring interface to exactly `10.12.0.1` first and build the subnet around that number — never pick a tidy address first and then try to force it to fit." },
      { h: "Step 3 — a segment's mask is the narrowest locked mask on it" },
      { p: "Every interface on one segment must share one mask; if they disagree, the two ends disagree about who is 'local' and the return path breaks. When several masks are locked, take the **narrowest** (highest CIDR number) as the segment's mask." },
      { h: "Step 4 — check every router: legs must not overlap" },
      { p: "For each router, lay the network ranges of all its legs side by side. If they overlap by even one address you get `multiple interface match`. Fix it by splitting into smaller blocks that **touch but do not overlap**." },
      { code: String.raw`wrong: leg1 = 192.168.1.0/24     (.0   - .255)
       leg2 = 192.168.1.128/25   (.128 - .255)   <- inside leg1

right: leg1 = 192.168.1.0/25     (.0   - .127)
       leg2 = 192.168.1.128/25   (.128 - .255)`, cap: "Split the /24 into two /25s — enough room on each, no overlap", lang: "txt" },
      { h: "Step 5 — if there is an Internet node, plan it first" },
      { ul: [
        "Every subnet that must reach it needs a **public address** (not 10., 172.16., 192.168.)",
        "The Internet node **may not carry a default route** — one explicit route per subnet",
        "Count its editable route slots first: **slots = prefixes you can express**. One slot and two reachable subnets means the two must live under one larger prefix"
      ]},
      { h: "Step 6 — walk every goal by hand, both directions" },
      { p: "Do not trust the picture. For each goal, walk hop by hop and answer three questions every time: (a) does this hop have a leg covering the destination? (b) if not, does a routing line cover it? (c) is that line's gateway inside one of this hop's subnets? **Then swap src and dst and do it again.**" },
      { h: "A filling order that avoids rework" },
      { table: { head: ["Order", "Do this"], rows: [
        ["1", "Draw all segments from the cabling"],
        ["2", "List every pin (locked gateway > locked IP > locked mask)"],
        ["3", "Choose a network + mask per segment that covers all of its pins"],
        ["4", "Verify no router has overlapping legs — if it does, go back to 3"],
        ["5", "Give hosts addresses inside the block (never network or broadcast)"],
        ["6", "Write the routing tables: specific on top, default at the bottom"],
        ["7", "Walk every goal both ways, then press Get my config"]
      ]}}
    ],
    dataflow: [
      { p: "This section follows one packet from source to destination exactly as `rec_route()` does — after it, Show logs reads like plain text." },
      { h: "What a host does when it wants to send" },
      { code: String.raw`if (destination is inside one of my own interface subnets)
        put it straight on the wire            -> log: "match itf ..."
else
        scan the routing table for the FIRST line covering the destination
        none found -> destination does not match any route   (dead)
        found      -> look at that line's gateway
                      is the gateway inside one of my subnets?
                        no  -> route match but no interface for gateway (dead)
                        yes -> hand it to the gateway  -> repeat there`,
        cap: "One piece of logic for hosts and routers alike — routers just have more legs", lang: "txt" },
      { h: "What the destination machine does on arrival" },
      { ul: [
        "If a leg's IP **equals the destination exactly** → `destination IP reached` → success",
        "If no leg matches → `packet not for me` → dead (right house, wrong number)",
        "If **more than one** leg covers it → `multiple interface match` → dead"
      ]},
      { note: "Keep two words apart: **covering** (subnet match) decides which way to send, **equalling** decides whether you have arrived. They are different tests." },
      { h: "A full walk-through" },
      { code: String.raw`Topology:  A1 --- [SW] --- R1.1        R1.2 --- R2.1        R2.2 --- B1

S1 = 192.168.1.0/24    A1 = .10        R1.1 = .1
S2 = 10.0.0.0/30       R1.2 = 10.0.0.1  R2.1 = 10.0.0.2
S3 = 192.168.2.0/24    R2.2 = .1        B1  = .20

R1 routes:  192.168.2.0/24 -> 10.0.0.2
R2 routes:  192.168.1.0/24 -> 10.0.0.1
A1 routes:  default        -> 192.168.1.1
B1 routes:  default        -> 192.168.2.1`, cap: "The example topology used below", lang: "txt" },
      { code: String.raw`Forward way: A1 (192.168.1.10) -> B1 (192.168.2.20)

A1:  is .2.20 inside 192.168.1.0/24? no
     table -> default (0.0.0.0/0) covers it -> gateway 192.168.1.1
     is 192.168.1.1 inside my leg (.1.0/24)? yes -> send
R1:  arrives on leg1. does .2.20 equal any of my leg IPs? no -> must forward
     which legs cover .2.20? leg1 = .1.0/24 no, leg2 = 10.0.0.0/30 no
     table -> 192.168.2.0/24 covers it -> gateway 10.0.0.2
     10.0.0.2 is inside leg2's 10.0.0.0/30 -> send
R2:  arrives on leg1. leg2 = 192.168.2.0/24 covers .2.20 -> put on the wire
B1:  my IP is 192.168.2.20, exact match -> destination IP reached  OK`,
        cap: "Read it against a real Show logs run and it matches line for line", lang: "txt" },
      { code: String.raw`Reverse way: B1 -> A1   (swap src/dst and walk the whole path again)

B1:  default -> 192.168.2.1 (R2.2)             ok
R2:  table has 192.168.1.0/24 -> 10.0.0.1      ok
R1:  leg1 = 192.168.1.0/24 covers .1.10        ok
A1:  exact match -> OK

If R2 had no 192.168.1.0/24 line:
     Forward way: OK      (that direction never consults R2's table)
     Reverse way: KO      destination does not match any route`,
        cap: "This is what 'half a goal' looks like, and it costs people a whole day", lang: "txt" },
      { h: "Why a distant goal passes while a neighbouring one fails" },
      { p: "Because goals **on the same segment** never consult a routing table at all — they only check whether the network and mask agree. A near goal failing while a far one passes means the problem is **the segment's mask or addresses**, not the tables." },
      { h: "Reading Show logs" },
      { code: String.raw`R1 -> B1 input itf if_R1a
   chk with itf if_R1a
   chk with itf if_R1b
   match itf if_R1b               <- the outgoing leg was found
: route match 192.168.2.0/24
: send to gateway 10.0.0.2 through interface if_R1b`,
        cap: "Every line is one decision — the missing line is the thing still wrong", lang: "txt" },
      { p: "**Technique:** find which machine the log stops at and fix that machine first. Do not rebuild the whole board." }
    ],
    implementation: [
      { p: "Drills you can actually do: splitting subnets, laying out routes, and the level shapes that recur." },
      { h: "Drill 1: split a /24 into four equal blocks" },
      { code: String.raw`Four subnets out of 192.168.10.0/24
  4 blocks -> borrow 2 bits (2^2 = 4) -> /24 + 2 = /26
  block = 256 / 4 = 64  -> mask = 256 - 64 = 192 -> 255.255.255.192

  #1  192.168.10.0/26     usable .1   - .62     bcast .63
  #2  192.168.10.64/26    usable .65  - .126    bcast .127
  #3  192.168.10.128/26   usable .129 - .190    bcast .191
  #4  192.168.10.192/26   usable .193 - .254    bcast .255`,
        cap: "Blocks = 2^borrowed bits; block size = 256 / number of blocks", lang: "txt" },
      { h: "Drill 2: from a host count to a mask" },
      { code: String.raw`need 30 hosts   -> 30 + 2 (network + broadcast) = 32
                -> block 32 -> /27 -> 255.255.255.224   (exactly 30 usable)

need 2 hosts (router-to-router link)
                -> 2 + 2 = 4 -> block 4 -> /30 -> 255.255.255.252

need 100 hosts  -> 100 + 2 = 102 -> round up to 128 -> /25 -> 255.255.255.128`,
        cap: "Always add 2, then round up to the next power of two", lang: "txt" },
      { note: "In this game **an oversized mask is not an error** as long as no router ends up with overlapping legs — with no constraint forcing you, `/24` everywhere is the easiest and least error-prone choice. Split only when something makes you." },
      { h: "Drill 3: one pinned gateway decides everything" },
      { code: String.raw`Given: A1's routing table is locked at  default -> 172.20.5.129
       and A1's mask is locked at /26

The pin says: the router interface next to A1 must be 172.20.5.129, exactly
/26 -> block 64 -> boundaries land on .128
   -> this segment is 172.20.5.128/26  (.128 - .191)
   -> .129 is inside it, is not the network (.128) or broadcast (.191)  ok
   -> A1 can be anything in .130 - .190          e.g. 172.20.5.130`,
        cap: "One pin plus one mask locks an entire segment immediately", lang: "txt" },
      { h: "Drill 4: getting the route order right" },
      { code: String.raw`R1 has three legs and must reach 192.168.2.0/24, 192.168.3.0/24 and the Internet

wrong:                            right:
  0.0.0.0/0      -> 41.66.1.1       192.168.2.0/24 -> 10.0.0.2
  192.168.2.0/24 -> 10.0.0.2        192.168.3.0/24 -> 10.0.1.2
  192.168.3.0/24 -> 10.0.1.2        0.0.0.0/0      -> 41.66.1.1

  (the last two are never used)     (specific first, catch-all last)`,
        cap: "First-match-wins makes ordering logic, not cosmetics", lang: "txt" },
      { h: "Drill 5: a board with an Internet node" },
      { code: String.raw`The Internet node has two editable route slots
Must reach: LAN-A and LAN-B

Option 1 (two slots): write them separately
     104.198.7.0/24  -> <the router leg on A's side>
     104.198.8.0/24  -> <the router leg on B's side>

Option 2 (only one slot): design them under one prefix
     A = 104.198.6.0/25   (.0 - .127)
     B = 104.198.6.128/25 (.128 - .255)
     Internet route: 104.198.6.0/24 -> <the router leg covering both>

Never: 0.0.0.0/0 on the Internet -> invalid default route on internet
Never: 192.168.x on a segment that must talk to the Internet`,
        cap: "The number of slots on the Internet node designs the addressing of the whole board", lang: "txt" },
      { h: "The level shapes that recur" },
      { table: { head: ["Roughly", "The point of the level", "Where people slip"], rows: [
        ["1-2", "Addresses on one segment must share a subnet", "Typing a number outside the range"],
        ["3-4", "A locked mask fixes the block boundaries", "Landing on network or broadcast"],
        ["5-6", "A two-legged router needs routes in both directions", "One-way routes → No reverse way"],
        ["7-8", "Several subnets plus a default route", "Putting the default on top"],
        ["9-10", "Internet, public addresses, non-overlapping legs", "Private IPs / a default route on the Internet"]
      ]}},
      { h: "Submitting" },
      { code: String.raw`{"routes":{"<rid>":{"route":"...","gate":"..."}},
 "ifs":{"<if>":{"ip":"...","mask":"..."}}}`,
        cap: "Exactly what the Get my config button (dl_config) writes", lang: "json" },
      { ul: [
        "**Only editable fields** appear — a file with extra or missing keys does not match what the grader expects",
        "Name them `level1.json` … `level10.json` at the repository root",
        "Never hand-edit the JSON and hope: go back into the game, fix it there, export again"
      ]}
    ],
    tricks: [
      { h: "Trick 1 — boards are deterministic per login" },
      { p: "`load_board()` seeds an xorshift PRNG with `level + hash_login(login)`, where `hash_login` mixes `973*(code+i)` on even indices and `5*code*i` on odd ones. **Same login + same level = the same board forever** — which is how moulinette can grade an exported JSON at all." },
      { p: "With no stored login (**evaluation / defense mode**) it falls back to `Math.random()`, so boards are freshly random. **A memorised answer is worthless there** — prepare the method, not the numbers." },
      { h: "Trick 2 — check a config without a browser" },
      { p: "`show.js` and `sim.js` only ever touch `document.getElementById(id).value`, so they run headlessly in Node under a tiny DOM stub — no jsdom, no browser." },
      { code: String.raw`const sandbox = {
  document: { getElementById: getEl, createElement: stub, createElementNS: stub,
              body: { appendChild(){}, removeChild(){} } },
  window: { innerHeight: 800 },
  localStorage: { getItem: k => (k === 'g_my_login' ? login : null), setItem(){} },
  console, JSON, Math, parseInt, isNaN, RegExp
};
vm.createContext(sandbox);
['level8.js', 'show.js', 'sim.js'].forEach(f => new vm.Script(read(f)).runInContext(sandbox));
vm.runInContext('load_board();', sandbox);     // randomises the board
// fill values: getEl('ip_R13').value = '...'
vm.runInContext('all_goals();', sandbox);
// read the verdict out of getEl('goals_id').innerHTML`,
        cap: "Running the original files unmodified is what makes the result trustworthy", lang: "js" },
      { p: "**Compile the three scripts once and reuse them** — recompiling per call is what turns a few-thousand-case fuzz run from seconds into minutes." },
      { note: "If you also port the logic for speed or for a solver, keep the port and the original side by side and **differential-fuzz them against each other**. A port that drifts on `>>> 0` semantics or on the sign of `~mask` will happily bless a config the game rejects." },
      { h: "Trick 3 — randomisation order, if you replay offline" },
      { p: "`load_board()` runs `show_host()` for every host first (randomising `route` then `gate`), then `show_ifs()` for every interface (`ip` then `mask`). Placeholders look like `[60-125]a` (draw a value and bind it to letter `a`) and `[a]` (reuse `a`)." },
      { h: "Trick 4 — the gotchas that cost the most time" },
      { ul: [
        "**A locked gateway is a specification, not a hint** — set the neighbouring interface to that exact address first, then build the subnet around it",
        "**Addresses differing only in the third octet**, like `211.190.x` versus `211.191.x`, are different /16s — the generator plants these deliberately",
        "**`default` and `0.0.0.0/0` are identical** to the engine, including when it refuses them on an Internet node",
        "**A broken return path is a missing route, not a wrong mask** — look at the far router or the Internet first",
        "**Re-check every address after changing a mask** — the block boundaries move and a good address can become a network or broadcast",
        "**Trailing whitespace in an address** passes in-game because of `parseInt()`, but leaves the exported JSON dirty"
      ]},
      { h: "Trick 5 — when you are genuinely stuck, in this order" },
      { table: { head: ["Order", "Do this", "Why"], rows: [
        ["1", "Press **Show logs** and find which hop it dies at", "Ten times faster than guessing"],
        ["2", "At that hop ask: which leg covers the destination, and is the gateway reachable?", "Every error in the game comes from those two questions"],
        ["3", "Walk the reverse path by hand", "Half of all stuck levels are purely a return-path problem"]
      ]}},
      { h: "Trick 6 — the two words that confuse everyone" },
      { p: "**A gateway is not a destination.** It is 'the next house I can walk to myself'; the destination is 'the house the packet wants'. A route line only says 'to get there, go via this neighbour first'." },
      { p: "**A mask does not create reachability.** It only says who counts as local. Widening a mask to 'make things reach each other' is the classic misunderstanding, and it usually produces `multiple interface match` instead." },
      { h: "Trick 7 — preparing for defense" },
      { ul: [
        "Practise on random boards (clear the login in localStorage and reload) at least three times",
        "Know the /24 to /30 table cold — slow arithmetic is what an evaluator notices",
        "Be able to explain why `/30` suits a link between two routers",
        "Be able to explain how a switch differs from a router (no IP, not a hop, makes no decisions)"
      ]}
    ],
    eval: [
      { p: "The questions evaluators actually ask, with answers you can give in a sentence or two." },
      { qa: [
        { q: "What is a netmask and what does it do?",
          a: "A 32-bit value whose 1-bits are contiguous from the left; it splits an address into a **network** part and a **host** part. AND an address with the mask and you get the network address — the 'house' that machine lives in." },
        { q: "Why is 255.255.255.32 invalid?",
          a: "Its 1-bits are not contiguous (…00100000). A mask must be ones from the left followed only by zeros — `mask_to_int()` rejects it outright." },
        { q: "How do you compute the network and broadcast addresses?",
          a: "`network = ip - (ip mod block)` and `broadcast = network + block - 1`, where block = 256 minus the last octet of the mask. So .222 under /27 gives network .192 and broadcast .223." },
        { q: "Why is a /31 or /32 interface useless in this game?",
          a: "A /31 holds exactly the network and broadcast addresses and a /32 holds only the network, so nothing is left for a host — `get_if_ip()` returns null and the interface behaves as if it had no address." },
        { q: "How does a switch differ from a router?",
          a: "A switch has no IP, makes no decisions and is just a wire that fans out, so everything on it shares one subnet. A router has an IP on every leg, holds a routing table and is a real hop that decides where a packet goes next." },
        { q: "How is a routing table read, and does order matter?",
          a: "Top to bottom, and **the first line covering the destination wins and stops the search**. If that line's gateway is unreachable the packet is dropped rather than falling through, so specific routes must sit above the default." },
        { q: "What is a default route and when do you use it?",
          a: "`0.0.0.0/0`, which matches every destination. It means 'everything else goes this way', belongs at the bottom of a table, and is forbidden on a host of type internet." },
        { q: "What must be true of a gateway?",
          a: "It must be an address inside one of that machine's own interface subnets — the machine has to be able to reach it directly on the wire, otherwise you get `route match but no interface for gateway`." },
        { q: "What causes `multiple interface match`?",
          a: "Two interfaces of the same machine both cover the destination address, i.e. overlapping subnets. Fix it by splitting into smaller blocks that touch but do not overlap." },
        { q: "Why would a goal pass in only one direction?",
          a: "`sim_reach_gen()` simulates forward and reverse. The return path usually lacks a route on the far router or on the Internet — routing is not automatically symmetric." },
        { q: "Which ranges are private, and why does it matter here?",
          a: "10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16. A host of type internet drops packets touching them, so any subnet that must reach the Internet needs public addresses." },
        { q: "You need 30 hosts on a subnet — which mask?",
          a: "30 + 2 for network and broadcast = 32, so block 32 → `/27` = 255.255.255.224, which gives exactly 30 usable addresses." },
        { q: "Why is /30 the usual choice for a router-to-router link?",
          a: "It needs only two addresses plus network and broadcast — four in total, so nothing is wasted and there is no spare room to accidentally overlap another leg." },
        { q: "How do you split 192.168.10.0/24 into four equal subnets?",
          a: "Borrow two bits → /26, block 64: .0/26, .64/26, .128/26 and .192/26, each with 62 usable addresses." },
        { q: "Why is the defense board different from the one you solved?",
          a: "`load_board()` seeds from the stored login; with no login it falls back to `Math.random()`, so the board is freshly random. That is why the method matters and the numbers do not." },
        { q: "What exactly do you submit?",
          a: "`level1.json` through `level10.json` from the Get my config button, which writes only the editable fields as `{\"routes\":{...},\"ifs\":{...}}`." },
        { q: "What does `packet not for me` mean?",
          a: "The packet reached the right machine but no leg's address equals the destination exactly — right house, wrong number. Look at the destination address or that segment's mask." },
        { q: "Why is widening a mask not a fix for 'cannot reach'?",
          a: "A mask only declares who is local; it creates no path. Widening usually makes a router's legs overlap and produces `multiple interface match`. Reachability comes from the routing table." }
      ]},
      { h: "Checklist before pressing Get my config" },
      { ul: [
        "Every goal green in **both** Forward and Reverse",
        "No interface address equals its own network or broadcast",
        "Every mask is contiguous, and every interface on a segment shares one mask",
        "No router has two legs covering the same address",
        "Every route's gateway sits inside one of that machine's own subnets",
        "Specific routes above the default; the Internet node has no default route",
        "No private addresses on a segment that must reach the Internet",
        "No stray whitespace in any address you typed"
      ]},
      { links: [
        { label: "RFC 1918 — Address Allocation for Private Internets", url: "https://datatracker.ietf.org/doc/html/rfc1918", note: "The source of 10/8, 172.16/12 and 192.168/16" },
        { label: "RFC 4632 — CIDR", url: "https://datatracker.ietf.org/doc/html/rfc4632", note: "Where the /24 notation and prefix splitting come from" },
        { label: "RFC 3021 — Using 31-Bit Prefixes on IPv4 Point-to-Point Links", url: "https://datatracker.ietf.org/doc/html/rfc3021", note: "The real world allows /31; sim.js does not" },
        { label: "Subnetting practice (subnettingpractice.com)", url: "https://subnettingpractice.com/", note: "Drill network/broadcast speed before defense" }
      ]}
    ]
  }
});
