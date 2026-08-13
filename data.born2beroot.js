/* Born2beRoot — เซิร์ฟเวอร์ Debian ไร้ GUI: LVM บน LUKS, SSH 4242, UFW, sudo, monitoring.sh */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

/* born2beroot เป็น rank 01 จึงแทรกไว้หลัง get_next_line แทนที่จะต่อท้ายรายการ */
window.TEACHING_DATA.splice(function () {
  var i = window.TEACHING_DATA.map(function (p) { return p.id; }).indexOf("get_next_line");
  return i < 0 ? window.TEACHING_DATA.length : i + 1;
}(), 0, {
  id: "born2beroot",
  name: "Born2beRoot",
  tag: {
    th: "สร้างเซิร์ฟเวอร์ Debian ไร้หน้าจอใน VirtualBox — พาร์ทิชันเข้ารหัส LUKS ใต้ LVM, SSH ที่พอร์ต 4242 ห้าม root, UFW เปิดพอร์ตเดียว, AppArmor, นโยบายรหัสผ่านเข้ม, sudo ที่บันทึกทุกคำสั่ง และ monitoring.sh ที่ broadcast ทุก 10 นาที",
    en: "Build a headless Debian server in VirtualBox — LUKS-encrypted partitions under LVM, sshd on port 4242 with root refused, UFW with a single open port, AppArmor, a strict password policy, sudo that records every command, and monitoring.sh broadcast every ten minutes"
  },
  accent: "#f59e0b",
  sections: {
    principle: [
      { h: "โจทย์คืออะไร" },
      { p: "Born2beRoot เป็นโปรเจกต์ **system administration** ล้วน ๆ — ไม่มี norminette ไม่มี valgrind ไม่มีคอมไพเลอร์. สิ่งที่ถูกตรวจคือ **เครื่องที่รันอยู่จริง** บวกกับความสามารถในการอธิบายทุกการตัดสินใจด้วยปากตัวเอง" },
      { p: "ติดตั้ง **Debian ตัวเสถียรล่าสุด** (หรือ Rocky) ใน VirtualBox โดย **ห้ามมี graphical server** — ติด X.org หรือ Wayland เมื่อไหร่ได้ 0 ทันที" },
      { h: "สิ่งที่ต้องส่งใน git มีแค่ 2 ไฟล์" },
      { table: { head: ["ไฟล์", "ข้างในคืออะไร"], rows: [
        ["`README.md`", "อธิบายโปรเจกต์ + เหตุผลที่เลือก OS + เปรียบเทียบ 4 คู่ (Debian/Rocky, AppArmor/SELinux, UFW/firewalld, VirtualBox/UTM)"],
        ["`signature.txt`", "ค่า sha1 ของไฟล์ดิสก์เสมือน (`.vdi` หรือ `.qcow2`)"]
      ]}},
      { note: "**ห้ามเอา VM ขึ้น git เด็ดขาด** — ที่ส่งคือลายเซ็นของดิสก์ ไม่ใช่ตัวดิสก์" },
      { h: "กับดักลายเซ็น — เอามาไว้ก่อนเพราะมันจบการสอบมาแล้วหลายคน" },
      { p: "**ค่า sha1 เปลี่ยนทันทีที่บูต VM ใหม่** ต้องคำนวณตอนเครื่อง **ปิดสนิท** แล้วอย่าเปิดอีกจนกว่าจะสอบเสร็จ (หรือคำนวณใหม่แล้ว push) ถ้าไม่ตรง = 0. และตอนเริ่ม defense ต้อง **ไม่มี snapshot ค้างอยู่**" },
      { code: String.raw`sha1sum ~/'VirtualBox VMs'/wiaon-in42/wiaon-in42.vdi     # Linux / macOS
certUtil -hashfile wiaon-in42.vdi sha1                   # Windows
shasum rocky.utm/Images/disk-0.qcow2                     # Mac M1 + UTM`,
        cap: "ปิดเครื่องก่อนเสมอ แล้วค่อย hash", lang: "bash" },
      { h: "รายการที่ถูกตรวจ พร้อมคำสั่งที่พิสูจน์ได้" },
      { table: { head: ["ข้อกำหนด", "พิสูจน์ด้วย"], rows: [
        ["ห้ามมี graphical server", "`dpkg -l | grep -iE 'xserver|wayland'` ต้องว่าง"],
        ["Debian stable ล่าสุด หรือ Rocky", "`cat /etc/os-release`"],
        ["hostname = login ตามด้วย `42`", "`hostname` → `wiaon-in42`"],
        ["พาร์ทิชันเข้ารหัสอย่างน้อย 2 อัน บน LVM", "`lsblk` ต้องเห็น `crypt` แล้วตามด้วย `lvm`"],
        ["AppArmor (หรือ SELinux) ทำงานตั้งแต่บูต", "`aa-status` / `sestatus`"],
        ["sshd ที่พอร์ต 4242 และห้าม root login", "`sudo ss -tlnp | grep 4242`"],
        ["UFW เปิดใช้งาน เปิดแค่ 4242", "`sudo ufw status numbered`"],
        ["ผู้ใช้อยู่ในกลุ่ม `sudo` และ `user42`", "`groups wiaon-in`"],
        ["นโยบายรหัสผ่าน", "`chage -l wiaon-in` + `/etc/security/pwquality.conf`"],
        ["sudo เข้มงวด + เก็บ log I/O", "`sudo cat /etc/sudoers.d/*` และ `ls /var/log/sudo/`"],
        ["`monitoring.sh` ทุก 10 นาที ทุก terminal", "เห็นข้อความ `wall` โผล่ + `sudo crontab -l`"]
      ]}},
      { p: "**ความสามารถในการรันคำสั่งพวกนี้สดตอน defense สำคัญพอ ๆ กับการตั้งค่าให้ถูก** — ผู้ตรวจไม่ได้เชื่อสิ่งที่เห็นในไฟล์ แต่เชื่อสิ่งที่พิมพ์ออกมาต่อหน้า" },
      { h: "ทำไมโปรเจกต์นี้ยากกว่าที่เห็น" },
      { ul: [
        "**ไม่มีอะไรให้คอมไพล์** ความยากทั้งหมดอยู่ที่ 'เข้าใจว่าทำไม' ไม่ใช่ 'ทำให้ผ่าน'",
        "**พลาดครั้งเดียวอาจล็อกตัวเองออกจากเครื่อง** — เปิด UFW ผิดจังหวะ หรือแก้ `sshd_config` แล้วรีสตาร์ตโดยไม่ตรวจ",
        "**นโยบายรหัสผ่านไม่ย้อนหลัง** ตั้งค่าเสร็จแล้วบัญชีเก่ายังใช้ค่าเดิมจนกว่าจะเปลี่ยนรหัสใหม่",
        "**ต้องอธิบายสคริปต์ทีละบรรทัด** แล้วหยุดมันโดยห้ามแก้ไฟล์"
      ]},
      { h: "ต่อยอดไปที่ไหน" },
      { p: "บริการชุดเดียวกัน (เว็บเซิร์ฟเวอร์ + PHP + ฐานข้อมูล) จะกลับมาอีกครั้งใน **Inception** แต่คราวนั้นอยู่ในคอนเทนเนอร์แทนที่จะอยู่บนเครื่องเดียว — ทำโปรเจกต์นี้ให้เข้าใจจริงแล้ว Inception จะง่ายขึ้นมาก" }
    ],

    theory: [
      { p: "หมวดนี้คือแนวคิดที่ต้องอธิบายได้ตอน defense — ทุกหัวข้อมีคำถามของมันอยู่" },
      { h: "1) Virtual machine คืออะไร ต่างจาก container ยังไง" },
      { table: { head: ["", "Virtual machine", "Container"], rows: [
        ["จำลองอะไร", "**ฮาร์ดแวร์ทั้งเครื่อง**", "แค่การแยกกระบวนการ"],
        ["kernel", "มี kernel ของตัวเอง", "ใช้ kernel ของโฮสต์ร่วมกัน"],
        ["ขนาด/เวลาบูต", "GB, เป็นนาที", "MB, เป็นวินาที"],
        ["แยกขาดแค่ไหน", "แยกเต็ม", "แยกด้วย namespace + cgroup"],
        ["เหมาะกับ", "รัน OS ที่ต่างจากโฮสต์, ทดลองแบบพังได้", "แพ็กแอปให้รันเหมือนกันทุกที่"]
      ]}},
      { p: "โปรเจกต์นี้ต้องใช้ **VM** เพราะเราต้องตั้งค่า **ระบบปฏิบัติการทั้งตัว** — พาร์ทิชัน, bootloader, kernel module, ตัวจัดการ service — สิ่งเหล่านี้ container ทำไม่ได้เพราะมันไม่มี kernel ของตัวเอง" },
      { h: "2) hypervisor 2 แบบ" },
      { ul: [
        "**Type 1 (bare-metal)** — รันบนฮาร์ดแวร์โดยตรง เช่น ESXi, Proxmox, Hyper-V; ใช้ในศูนย์ข้อมูล",
        "**Type 2 (hosted)** — รันเป็นโปรแกรมบน OS ปกติ เช่น **VirtualBox**, UTM, VMware Workstation; ช้ากว่าแต่ติดตั้งง่าย"
      ]},
      { h: "3) Debian เทียบกับ Rocky" },
      { table: { head: ["", "Debian", "Rocky Linux"], rows: [
        ["สายพันธุ์", "อิสระ ชุมชนดูแล", "โคลนของ RHEL แบบ 1:1"],
        ["ตัวจัดการแพ็กเกจ", "`apt` / `dpkg`", "`dnf` / `rpm`"],
        ["MAC (mandatory access control)", "**AppArmor**", "**SELinux**"],
        ["ไฟร์วอลล์", "**UFW**", "**firewalld**"],
        ["เหมาะกับ", "มือใหม่ด้าน sysadmin, แพ็กเกจเยอะมาก", "องค์กรที่ใช้ RHEL, ค่าเริ่มต้นเข้มกว่า"]
      ]}},
      { p: "subject แนะนำ Debian ตรง ๆ ถ้าเพิ่งเริ่ม เพราะ Rocky ต้องตั้ง SELinux ให้ถูกด้วย ซึ่งเป็นงานอีกก้อนใหญ่" },
      { h: "4) apt เทียบกับ aptitude — คำถามที่ถามแทบทุกครั้ง" },
      { table: { head: ["", "`apt`", "`aptitude`"], rows: [
        ["คืออะไร", "คำสั่งบรรทัดเดียว รวมของที่ใช้บ่อยจาก `apt-get`/`apt-cache`", "ตัวจัดการแพ็กเกจเต็มรูปแบบ มีโหมด TUI ด้วย"],
        ["แก้ปัญหา dependency", "แก้แบบตรงไปตรงมา ล้มก็บอกล้ม", "**เสนอทางเลือกหลายทาง** ให้เลือก"],
        ["ติดมากับ Debian", "ใช่", "ต้องติดตั้งเอง"],
        ["ใช้เมื่อ", "งานประจำวัน", "dependency พันกันจนต้องต่อรอง"]
      ]}},
      { note: "ทั้งคู่คุยกับ `dpkg` ซึ่งเป็นตัวติดตั้งจริงระดับล่าง — `apt` และ `aptitude` เป็นแค่ชั้นที่ฉลาดขึ้นมาหน่อย เช่น ดาวน์โหลดเอง แก้ dependency เอง" },
      { h: "5) AppArmor เทียบกับ SELinux" },
      { p: "ทั้งคู่คือ **Mandatory Access Control** — ต่างจากสิทธิ์ไฟล์ปกติ (DAC) ตรงที่ **เจ้าของไฟล์เปลี่ยนกฎเองไม่ได้** kernel บังคับตามนโยบายที่ผู้ดูแลระบบวางไว้เท่านั้น" },
      { table: { head: ["", "AppArmor", "SELinux"], rows: [
        ["ผูกกฎกับ", "**path ของไฟล์**", "**label (security context)** ที่ติดกับทุก object"],
        ["อ่านง่ายแค่ไหน", "โปรไฟล์เป็นข้อความอ่านออก", "ต้องเข้าใจ type/role/user"],
        ["ค่าเริ่มต้นของ", "Debian / Ubuntu", "RHEL / Rocky / Fedora"],
        ["ความเข้ม", "เข้มพอใช้ ตั้งง่าย", "เข้มกว่ามาก แต่ยากกว่ามาก"]
      ]}},
      { p: "ประโยชน์จริง: ถ้ามีคนเจาะ `sshd` ได้ AppArmor ยังจำกัดว่ากระบวนการนั้นแตะไฟล์ไหนได้บ้าง แม้จะรันในฐานะ root ก็ตาม" },
      { h: "6) UFW เทียบกับ firewalld" },
      { p: "ทั้งคู่เป็น 'หน้าบ้าน' ของ **netfilter** ใน kernel เหมือนกัน (`iptables`/`nftables` คือชั้นกลาง)" },
      { table: { head: ["", "UFW", "firewalld"], rows: [
        ["ปรัชญา", "Uncomplicated — คำสั่งบรรทัดเดียว", "แบ่งเป็น **zone** ตามความน่าเชื่อถือของเครือข่าย"],
        ["กฎชั่วคราว/ถาวร", "เขียนแล้วถาวรเลย", "แยก runtime กับ permanent ชัดเจน"],
        ["เหมาะกับ", "เครื่องเดียว กฎไม่กี่ข้อ", "เครื่องที่มีหลายอินเทอร์เฟซ/หลายบทบาท"]
      ]}},
      { h: "7) SSH คืออะไร ทำไมย้ายพอร์ต" },
      { p: "SSH = ช่องทางเข้าเครื่องระยะไกลแบบเข้ารหัส แทนที่ telnet ที่ส่งรหัสผ่านเป็นข้อความเปล่า. การย้ายจาก 22 ไป **4242** คือ *security through obscurity* — **ไม่ได้ทำให้ปลอดภัยขึ้นจริง** แต่ตัดบอตที่กวาดพอร์ต 22 ทิ้งไปได้เกือบหมด ทำให้ log สะอาดพอที่จะเห็นการโจมตีจริง" },
      { p: "ส่วน **การห้าม root login ต่างหากที่เพิ่มความปลอดภัยจริง** — ผู้โจมตีต้องเดาทั้งชื่อผู้ใช้และรหัสผ่าน แล้วยังต้องผ่าน sudo อีกชั้น และทุกคำสั่งที่ยกสิทธิ์จะถูกบันทึกว่าใครทำ" },
      { h: "8) PAM — จุดที่นโยบายรหัสผ่านทำงานจริง" },
      { p: "**PAM (Pluggable Authentication Modules)** คือชั้นที่โปรแกรมอย่าง `login`, `sshd`, `passwd`, `sudo` เรียกใช้เวลาต้องยืนยันตัวตน แทนที่แต่ละโปรแกรมจะเขียนตรรกะเอง" },
      { ul: [
        "`pam_pwquality` — ตรวจ **ความแข็งแรง** ของรหัสผ่านตอนตั้งใหม่ (ความยาว ตัวพิมพ์ ตัวเลข ซ้ำติดกัน)",
        "`/etc/login.defs` — คุม **อายุ** ของรหัสผ่าน (หมดอายุกี่วัน เปลี่ยนซ้ำได้เมื่อไหร่ เตือนล่วงหน้ากี่วัน)",
        "**สองเรื่องนี้คนละไฟล์คนละกลไก** และถูกตรวจทั้งคู่"
      ]}
    ],

    foundations: [
      { p: "หมวดนี้คือชั้นของดิสก์ ตั้งแต่ฮาร์ดแวร์จนถึงไฟล์ — เป็นส่วนที่ผู้ตรวจขุดลึกที่สุด" },
      { h: "ชั้นของพื้นที่เก็บข้อมูล จากล่างขึ้นบน" },
      { code: String.raw`ดิสก์จริง            /dev/sda
  └─ พาร์ทิชัน       /dev/sda1  (boot)   /dev/sda5  (ที่เหลือ)
       └─ LUKS       sda5_crypt          <- ชั้นเข้ารหัส
            └─ PV    physical volume     <- LVM มองเห็นเป็นวัตถุดิบ
                 └─ VG   volume group    <- เอา PV มารวมเป็นสระเดียว
                      └─ LV  logical volume  <- ตัดแบ่งออกมาใช้งาน
                           └─ filesystem (ext4/swap) -> mount`,
        cap: "เข้ารหัส 'ทั้งก้อน' ครั้งเดียว แล้วค่อยซอย LV ข้างใน = ใส่รหัสผ่านครั้งเดียวตอนบูต", lang: "txt" },
      { h: "หน้าตาจริงของ lsblk ที่ผู้ตรวจอยากเห็น" },
      { code: String.raw`sda                      8:0    0   30G  0 disk
├─sda1                   8:1    0  500M  0 part  /boot
└─sda5                   8:5    0 29.5G  0 part
  └─sda5_crypt         254:0    0 29.5G  0 crypt
    ├─LVMGroup-root    254:1    0   10G  0 lvm   /
    ├─LVMGroup-swap    254:2    0  2.3G  0 lvm   [SWAP]
    ├─LVMGroup-home    254:3    0    5G  0 lvm   /home
    ├─LVMGroup-var     254:4    0    3G  0 lvm   /var
    ├─LVMGroup-srv     254:5    0    3G  0 lvm   /srv
    ├─LVMGroup-tmp     254:6    0    3G  0 lvm   /tmp
    └─LVMGroup-var--log 254:7   0    4G  0 lvm   /var/log`,
        cap: "ต้องเห็นคำว่า crypt แล้วตามด้วย lvm — นั่นคือหลักฐานว่าเข้ารหัส *ใต้* LVM จริง", lang: "txt" },
      { h: "LVM คืออะไร อธิบายในประโยคเดียว" },
      { p: "**LVM แทรกชั้นหนึ่งไว้ระหว่างพาร์ทิชันจริงกับ filesystem** ทำให้ filesystem ไม่ถูกตรึงกับช่วงเนื้อที่ตายตัวบนดิสก์อีกต่อไป — ขยาย ย่อ หรือย้ายได้ขณะระบบยังทำงานอยู่" },
      { table: { head: ["คำ", "ย่อมาจาก", "คืออะไร"], rows: [
        ["**PV**", "Physical Volume", "พาร์ทิชัน (หรือทั้งดิสก์) ที่ถูกทำเครื่องหมายให้ LVM ใช้"],
        ["**VG**", "Volume Group", "สระที่เกิดจากการรวม PV หลายอันเข้าด้วยกัน"],
        ["**LV**", "Logical Volume", "ก้อนที่ตัดออกมาจาก VG แล้วฟอร์แมตเป็น filesystem"],
        ["**PE**", "Physical Extent", "หน่วยย่อยที่สุดที่ LVM จัดสรร (ปกติ 4 MB)"]
      ]}},
      { p: "ประโยชน์ที่ตอบได้ทันที: `/home` **เต็มก็ขยายได้โดยไม่ต้องลงเครื่องใหม่** ตราบใดที่ VG ยังมีที่ว่าง — ทำได้ขณะเครื่องยังรันอยู่ด้วยซ้ำ" },
      { h: "LUKS — การเข้ารหัสระดับบล็อก" },
      { p: "**LUKS (Linux Unified Key Setup)** เข้ารหัส **ทั้งบล็อกอุปกรณ์** ไม่ใช่ทีละไฟล์ ทุกอย่างข้างในจึงถูกเข้ารหัสหมดรวมทั้งชื่อไฟล์และโครงสร้างไดเรกทอรี" },
      { ul: [
        "ข้างในเก็บ **master key** ที่ถูกล็อกด้วย passphrase อีกที — เปลี่ยนรหัสผ่านจึงไม่ต้องเข้ารหัสข้อมูลใหม่ทั้งก้อน",
        "รองรับหลาย **key slot** เพิ่มรหัสผ่านสำรองได้",
        "ป้องกัน 'ดิสก์ถูกขโมย' ได้จริง แต่ **ไม่ป้องกันอะไรเลยเมื่อเครื่องเปิดอยู่และปลดล็อกแล้ว**"
      ]},
      { note: "`/boot` **ต้องไม่เข้ารหัส** เพราะ bootloader ต้องอ่าน kernel กับ initramfs ให้ได้ก่อน จึงจะมีโค้ดไปถามหา passphrase — ไข่กับไก่" },
      { h: "ทำไมต้องแยก mount point หลายอัน" },
      { table: { head: ["Mount point", "แยกออกมาเพราะ"], rows: [
        ["`/var/log`", "log ท่วมจะเต็มแค่ก้อนตัวเอง ไม่ลามไปทำให้ `/` เต็มจนระบบค้าง"],
        ["`/home`", "ข้อมูลผู้ใช้แยกจากระบบ ลง OS ใหม่ได้โดยไม่แตะ"],
        ["`/var`", "แพ็กเกจ แคช ฐานข้อมูล โตไม่แน่นอน"],
        ["`/tmp`", "ไฟล์ชั่วคราวจากทุกคน จำกัดขนาดได้ และตั้ง noexec เพิ่มได้"],
        ["`/srv`", "ข้อมูลที่บริการเสิร์ฟออกไป แยกจากไฟล์ระบบ"],
        ["`swap`", "หน่วยความจำสำรองบนดิสก์ ปกติราว 1-2 เท่าของ RAM"]
      ]}},
      { h: "ไฟล์ตั้งค่าอยู่ที่ไหนบ้าง" },
      { table: { head: ["ไฟล์ / ไดเรกทอรี", "คุมอะไร"], rows: [
        ["`/etc/ssh/sshd_config`", "พอร์ต, `PermitRootLogin`, การยืนยันตัวตนของ SSH"],
        ["`/etc/login.defs`", "อายุรหัสผ่าน: `PASS_MAX_DAYS`, `PASS_MIN_DAYS`, `PASS_WARN_AGE`"],
        ["`/etc/security/pwquality.conf`", "ความแข็งแรงของรหัสผ่าน: `minlen`, `ucredit`, `maxrepeat`, `difok`"],
        ["`/etc/pam.d/common-password`", "จุดที่ `pam_pwquality` ถูกเสียบเข้าไปในสาย PAM"],
        ["`/etc/sudoers.d/born2beroot`", "กฎ sudo ทั้งหมด (แก้ด้วย `visudo` เท่านั้น)"],
        ["`/var/log/sudo/`", "บันทึก input/output ของทุก session ที่ใช้ sudo"],
        ["`/etc/hostname` + `/etc/hosts`", "ชื่อเครื่อง — ต้องแก้ทั้งคู่ให้ตรงกัน"],
        ["`/etc/crontab` หรือ `crontab -e` ของ root", "ตารางเรียก `monitoring.sh` ทุก 10 นาที"]
      ]}}
    ],

    architecture: [
      { p: "หมวดนี้คือลำดับการติดตั้งจริง — ทำสลับลำดับแล้วจะเจอทางตันหลายจุด" },
      { h: "ลำดับที่ทำให้ไม่ต้องรื้อ" },
      { table: { head: ["ขั้น", "ทำอะไร", "ทำไมต้องอยู่ตรงนี้"], rows: [
        ["1", "สร้าง VM + ตั้งค่า NAT port forward 4242", "ต้องมีทางเข้าจากโฮสต์ก่อน ไม่งั้นทดสอบ SSH ไม่ได้"],
        ["2", "ติดตั้ง Debian แบบ **ไม่เลือก desktop environment**", "เผลอติ๊ก GUI แล้วต้องลงใหม่ทั้งเครื่อง"],
        ["3", "แบ่งพาร์ทิชันด้วยตัวเอง: `/boot` + LUKS + LVM", "เปลี่ยนทีหลังยากที่สุดในบรรดาทุกข้อ"],
        ["4", "ตั้ง hostname เป็น `<login>42`", "แก้ 2 ไฟล์ให้ตรงกัน"],
        ["5", "ติดตั้ง `sudo`, `ufw`, `openssh-server`, `libpam-pwquality`", "Debian แบบ minimal ไม่มีติดมาให้"],
        ["6", "สร้างผู้ใช้ + กลุ่ม `user42` + ใส่เข้ากลุ่ม `sudo`", "ต้องมีบัญชีที่ยกสิทธิ์ได้ก่อนจะปิด root login"],
        ["7", "ตั้งค่า SSH 4242 + ห้าม root → `sshd -t` → restart", "ตรวจ syntax ก่อนเสมอ"],
        ["8", "UFW: allow 4242 **ก่อน** แล้วค่อย enable", "สลับลำดับ = ตัดขาตัวเอง"],
        ["9", "นโยบายรหัสผ่าน + `chage` + เปลี่ยนรหัสทุกบัญชี", "นโยบายไม่ย้อนหลัง"],
        ["10", "sudoers + สร้าง `/var/log/sudo`", "ไม่มีไดเรกทอรี = ไม่มี log เงียบ ๆ"],
        ["11", "`monitoring.sh` + cron ทุก 10 นาที", "ทำท้ายสุดเพราะต้องใช้ของทุกอย่างข้างบน"],
        ["12", "ปิดเครื่อง → hash `.vdi` → ใส่ `signature.txt`", "เปิดใหม่เมื่อไหร่ hash เปลี่ยนทันที"]
      ]}},
      { h: "แผนผังบริการบนเครื่อง" },
      { code: String.raw`             โฮสต์ (เครื่องจริง)
                  |  ssh -p 4242 wiaon-in@127.0.0.1
                  v
       VirtualBox NAT: host 4242 -> guest 4242
                  |
   +--------------v-----------------------------------+
   |  VM: wiaon-in42  (Debian, ไม่มี GUI)              |
   |                                                  |
   |  ufw  ---- อนุญาตเฉพาะ 4242 ------> sshd :4242    |
   |                                       |          |
   |  AppArmor คุมทุก process ---------> จำกัดสิทธิ์   |
   |                                       v          |
   |  PAM (pwquality) <---- login/passwd/sudo         |
   |                                       |          |
   |  sudo -> /var/log/sudo/ (log input+output)       |
   |                                                  |
   |  cron (root) --ทุก 10 นาที--> monitoring.sh      |
   |                                    |             |
   |                                    v             |
   |                              wall -> ทุก tty     |
   +--------------------------------------------------+`,
        cap: "ทุกกล่องในภาพนี้คือหนึ่งข้อในเกณฑ์การให้คะแนน", lang: "txt" },
      { h: "ผู้ใช้และกลุ่ม" },
      { code: String.raw`sudo adduser wiaon-in                 # สร้างผู้ใช้ + home + ตั้งรหัส
sudo groupadd user42                  # กลุ่มที่ subject บังคับ
sudo usermod -aG user42,sudo wiaon-in # -a สำคัญมาก: ต่อท้าย ไม่ใช่แทนที่

groups wiaon-in                       # wiaon-in : wiaon-in sudo user42`,
        cap: "ลืม -a แล้ว usermod จะเขี่ยกลุ่มเดิมทิ้งทั้งหมด รวมทั้ง sudo", lang: "bash" },
      { note: "ตอน defense จะถูกสั่งให้ **สร้างผู้ใช้ใหม่และเพิ่มเข้ากลุ่มสด ๆ** — ซ้อม `adduser`, `groupadd`, `usermod -aG` ให้คล่องโดยไม่ต้องเปิดโน้ต" },
      { h: "hostname ต้องแก้สองที่" },
      { code: String.raw`sudo hostnamectl set-hostname wiaon-in42
sudo nano /etc/hosts        # 127.0.1.1   wiaon-in42
hostname                    # ยืนยัน (บาง shell ต้อง login ใหม่ prompt ถึงเปลี่ยน)`,
        cap: "แก้แค่ /etc/hostname แล้วลืม /etc/hosts จะเจอ sudo ช้าเพราะ resolve ชื่อตัวเองไม่ได้", lang: "bash" }
    ],

    dataflow: [
      { p: "หมวดนี้ตามลำดับเหตุการณ์จริง 2 เส้น: ตอนบูต และตอนมีคน ssh เข้ามา" },
      { h: "ลำดับการบูต" },
      { code: String.raw`BIOS/UEFI
   -> GRUB อ่าน kernel + initramfs จาก /boot        (ยังไม่เข้ารหัส)
      -> initramfs ถามหา passphrase ของ LUKS
         -> cryptsetup ปลดล็อก sda5 -> sda5_crypt
            -> LVM สแกนเจอ PV/VG แล้วเปิด LV ทุกตัว
               -> mount / จาก LVMGroup-root
                  -> systemd (PID 1) เริ่มทำงาน
                     -> apparmor.service โหลดโปรไฟล์
                     -> ufw.service ใส่กฎ netfilter
                     -> ssh.service ฟังพอร์ต 4242
                     -> cron.service เริ่มนับเวลา
                        -> ทุก 10 นาที: monitoring.sh -> wall -> ทุก tty`,
        cap: "นี่คือคำตอบของคำถาม 'ทำไม /boot ถึงเข้ารหัสไม่ได้' แบบเห็นภาพ", lang: "txt" },
      { h: "ทำไมต้องถาม passphrase ก่อน LVM" },
      { p: "เพราะ **LUKS อยู่ใต้ LVM** — ตราบใดที่ยังไม่ปลดล็อก ตัว LVM ยังมองไม่เห็น PV ด้วยซ้ำ มันเห็นแค่ข้อมูลที่ดูเหมือนสุ่ม. ถ้าสลับชั้นกัน (LVM ก่อน แล้วเข้ารหัสทีละ LV) จะต้องใส่รหัสผ่านทีละก้อน" },
      { h: "ลำดับตอนมีคน ssh เข้ามา" },
      { code: String.raw`ssh -p 4242 newguy@127.0.0.1
   -> ufw: พอร์ต 4242 อยู่ในรายการอนุญาต -> ผ่าน
      (ถ้าเป็นพอร์ตอื่น: DROP เงียบ ๆ ไม่มีคำตอบกลับเลย)
   -> sshd: ตรวจ PermitRootLogin  ->  ถ้า user = root ปฏิเสธทันที
      -> PAM: pam_unix ตรวจรหัสผ่านกับ /etc/shadow
              pam_pwquality ทำงานเฉพาะตอน "ตั้งรหัสใหม่" ไม่ใช่ตอน login
              บัญชีหมดอายุตาม chage ไหม -> ถ้าใช่ บังคับเปลี่ยนรหัสก่อน
         -> ได้ shell
            -> newguy พิมพ์ sudo ...
               -> sudoers: อยู่ในกลุ่ม sudo ไหม
                  requiretty: มี terminal ไหม
                  secure_path: ทิ้ง PATH ของผู้ใช้ ใช้ของ sudo แทน
                  ผิดรหัสได้ 3 ครั้ง แล้วขึ้นข้อความที่เราตั้งเอง
               -> รันคำสั่ง + บันทึกลง /var/log/sudo/`,
        cap: "หนึ่งการเข้าใช้งานผ่านด่านที่ถูกให้คะแนนถึง 4 ด่าน", lang: "txt" },
      { h: "monitoring.sh ทำงานเมื่อไหร่ และดึงข้อมูลจากไหน" },
      { table: { head: ["ข้อมูล", "มาจาก", "หมายเหตุ"], rows: [
        ["architecture + kernel", "`uname -a`", ""],
        ["CPU จริง", "`grep 'physical id' /proc/cpuinfo | sort -u | wc -l`", "นับ **ซ็อกเก็ต**"],
        ["vCPU", "`grep -c '^processor' /proc/cpuinfo`", "นับ **คอร์เชิงตรรกะ**"],
        ["RAM", "`free -m`", "คิดเปอร์เซ็นต์เอง"],
        ["ดิสก์", "`df -m --total`", "รวมทุก mount ที่ไม่ใช่ tmpfs"],
        ["โหลด CPU", "`top -bn1`", "100 ลบค่า idle"],
        ["บูตล่าสุด", "`who -b`", ""],
        ["LVM ใช้อยู่ไหม", "`lsblk | grep -c lvm`", "> 0 คือ yes"],
        ["TCP ที่เชื่อมอยู่", "`ss -ta | grep -c ESTAB`", ""],
        ["ผู้ใช้ที่ล็อกอิน", "`users`", "ตัดชื่อซ้ำด้วย `sort -u`"],
        ["IP + MAC", "`hostname -I`, `ip link`", ""],
        ["จำนวนคำสั่ง sudo", "`journalctl _COMM=sudo | grep -c COMMAND`", "หรืออ่านจาก `/var/log/sudo/sudo.log`"]
      ]}},
      { note: "`top -bn1` **รายงานค่ารอบแรกเป็นค่าเฉลี่ยตั้งแต่บูต** ตัวเลขจึงมักดูต่ำผิดปกติ — ถ้าถูกถามให้ตอบตรง ๆ และบอกว่า `mpstat 1 1` คือทางที่ซื่อสัตย์กว่า" },
      { h: "wall ไปถึงใครบ้าง" },
      { p: "`wall` เขียนข้อความลง **ทุก terminal ที่เปิดอยู่** ของทุกผู้ใช้ที่ล็อกอินอยู่ (ยกเว้นคนที่สั่ง `mesg n` ปิดรับไว้) — นี่คือเหตุผลที่ต้องรันจาก cron ของ root ไม่ใช่ของผู้ใช้ธรรมดา" }
    ],

    implementation: [
      { p: "คำสั่งจริงทั้งชุด เรียงตามลำดับที่ควรทำ" },
      { h: "1) ตั้ง VM ให้เข้าถึงได้จากโฮสต์" },
      { code: String.raw`VirtualBox -> Settings -> Network -> NAT -> Advanced -> Port Forwarding
    Name: ssh   Protocol: TCP
    Host IP: 127.0.0.1   Host Port: 4242
    Guest IP: (ว่าง)     Guest Port: 4242

# ทดสอบจากโฮสต์หลังตั้ง sshd แล้ว
ssh -p 4242 wiaon-in@127.0.0.1`,
        cap: "ไม่มี port forward = เชื่อมจากโฮสต์ไม่ได้ แม้ทุกอย่างในเครื่องจะถูกหมด", lang: "bash" },
      { h: "2) ติดตั้งของที่ Debian minimal ไม่มีมาให้" },
      { code: String.raw`su -
apt update && apt upgrade -y
apt install -y sudo ufw openssh-server libpam-pwquality
# ตัวช่วยที่คุ้มติด: vim หรือ nano, net-tools (ถ้าอยากใช้ ifconfig)`,
        cap: "ตอนนี้ยังต้อง su เพราะผู้ใช้เรายังไม่อยู่ในกลุ่ม sudo", lang: "bash" },
      { h: "3) ผู้ใช้ กลุ่ม และ hostname" },
      { code: String.raw`groupadd user42
usermod -aG user42,sudo wiaon-in
hostnamectl set-hostname wiaon-in42
sed -i 's/^127.0.1.1.*/127.0.1.1\twiaon-in42/' /etc/hosts

groups wiaon-in       # ต้องเห็น sudo และ user42
exit                  # ออกจาก su แล้ว login ใหม่ให้กลุ่มมีผล`,
        cap: "การเปลี่ยนกลุ่มมีผลตอน login ครั้งถัดไป ไม่ใช่ทันที", lang: "bash" },
      { h: "4) SSH ที่พอร์ต 4242" },
      { code: String.raw`sudo nano /etc/ssh/sshd_config
    Port 4242
    PermitRootLogin no

sudo sshd -t                       # ตรวจ syntax ก่อนเสมอ
sudo systemctl restart ssh
sudo ss -tlnp | grep 4242          # ต้องเห็น sshd ฟังอยู่`,
        cap: "sshd -t คือสิ่งที่กันไม่ให้พิมพ์ผิดแล้วเหลือเครื่องที่ ssh เข้าไม่ได้", lang: "bash" },
      { note: "**Debian รุ่นใหม่สตาร์ต sshd ผ่าน socket activation** ถ้าแก้ `sshd_config` แล้วพอร์ตไม่ขยับ ให้ `sudo systemctl disable --now ssh.socket` แล้ว `sudo systemctl enable --now ssh` เพื่อให้ตัว service อ่าน config ของตัวเอง" },
      { h: "5) UFW — ใส่กฎก่อน เปิดทีหลัง" },
      { code: String.raw`sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 4242            # <- ทำข้อนี้ก่อน enable เสมอ
sudo ufw enable

sudo ufw status numbered       # ต้องเห็น 4242 อันเดียว
systemctl is-enabled ufw       # enabled = รอดหลังรีบูต`,
        cap: "enable ก่อนใส่กฎ = ตัดขาตัวเองทันทีถ้าทำผ่าน ssh", lang: "bash" },
      { h: "6) นโยบายรหัสผ่าน — สองไฟล์" },
      { code: String.raw`# /etc/login.defs  (อายุ)
PASS_MAX_DAYS   30
PASS_MIN_DAYS   2
PASS_WARN_AGE   7`, cap: "มีผลกับบัญชีที่สร้าง 'หลังจากนี้' เท่านั้น", lang: "bash" },
      { code: String.raw`# /etc/security/pwquality.conf  (ความแข็งแรง)
minlen      = 10
ucredit     = -1      # ต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1
lcredit     = -1      # ต้องมีตัวพิมพ์เล็กอย่างน้อย 1
dcredit     = -1      # ต้องมีตัวเลขอย่างน้อย 1
maxrepeat   = 3       # ห้ามตัวเดิมติดกันเกิน 3
usercheck   = 1       # ห้ามมีชื่อผู้ใช้อยู่ในรหัส
difok       = 7       # ต้องต่างจากรหัสเดิมอย่างน้อย 7 ตัว
enforce_for_root`,
        cap: "เครื่องหมายลบชวนงง: -1 แปลว่า 'ต้องมีอย่างน้อย 1' ส่วนค่าบวกแปลว่า 'มีแล้วได้แต้มเพิ่ม'", lang: "bash" },
      { code: String.raw`# บัญชีเดิมไม่ได้รับผลย้อนหลัง ต้องสั่งเอง
sudo chage -M 30 -m 2 -W 7 wiaon-in
sudo chage -M 30 -m 2 -W 7 root
sudo passwd wiaon-in
sudo passwd root

chage -l wiaon-in            # <- นี่คือสิ่งที่ผู้ตรวจอ่าน`,
        cap: "แก้ไฟล์อย่างเดียวไม่พอ ต้อง chage + เปลี่ยนรหัสทุกบัญชีรวม root", lang: "bash" },
      { h: "7) sudoers เข้มงวด" },
      { code: String.raw`sudo mkdir -p /var/log/sudo          # ไม่มีไดเรกทอรี = ไม่มี log
sudo visudo -f /etc/sudoers.d/born2beroot`,
        cap: "แก้ด้วย visudo เท่านั้น มันตรวจ syntax ให้ ถ้า sudoers พังคือ sudo ใช้ไม่ได้ทั้งเครื่อง", lang: "bash" },
      { code: String.raw`Defaults        passwd_tries=3
Defaults        badpass_message="รหัสผ่านไม่ถูกต้อง ลองใหม่อีกครั้งอย่างระมัดระวัง"
Defaults        logfile="/var/log/sudo/sudo.log"
Defaults        log_input, log_output
Defaults        iolog_dir="/var/log/sudo"
Defaults        requiretty
Defaults        secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin"`,
        cap: "ครบทั้ง 5 ข้อที่ subject บังคับในไฟล์เดียว", lang: "bash" },
      { table: { head: ["บรรทัด", "ป้องกันอะไร"], rows: [
        ["`passwd_tries=3`", "จำกัดการเดารหัสผ่านต่อหนึ่งครั้ง"],
        ["`requiretty`", "ปฏิเสธ sudo จากกระบวนการที่ไม่มี terminal — ตัดการยกสิทธิ์แบบสคริปต์อัตโนมัติทิ้งไปทั้งกลุ่ม"],
        ["`secure_path`", "sudo เมิน `PATH` ของผู้เรียก — `ls` ปลอมที่วางไว้ต้นทางจึงไม่มีวันถูกรันเป็น root"],
        ["`log_input, log_output`", "บันทึกทั้ง session เล่นย้อนได้ด้วย `sudoreplay`"]
      ]}},
      { h: "8) monitoring.sh" },
      { code: String.raw`#!/bin/bash
arch=$(uname -a)
pcpu=$(grep "physical id" /proc/cpuinfo | sort -u | wc -l)
vcpu=$(grep -c "^processor" /proc/cpuinfo)
mem=$(free -m | awk '$1 == "Mem:" {printf("%d/%dMB (%.2f%%)", $3, $2, $3*100/$2)}')
disk=$(df -m --output=used,size,pcent --total | awk '$0 ~ /total/ {printf("%d/%dMB (%s)", $1, $2, $3)}')
cpul=$(top -bn1 | awk '/^%Cpu/ {printf("%.1f%%", 100 - $8)}')
boot=$(who -b | awk '{print $3" "$4}')
lvm=$(if [ "$(lsblk | grep -c lvm)" -gt 0 ]; then echo yes; else echo no; fi)
tcp=$(ss -ta | grep -c ESTAB)
ulog=$(users | tr ' ' '\n' | sort -u | wc -l)
ip=$(hostname -I | awk '{print $1}')
mac=$(ip link show | awk '/ether/ {print $2; exit}')
cmds=$(journalctl _COMM=sudo | grep -c COMMAND)

wall "	#Architecture: $arch
	#Physical CPU: $pcpu
	#vCPU: $vcpu
	#Memory Usage: $mem
	#Disk Usage: $disk
	#CPU load: $cpul
	#Last boot: $boot
	#LVM use: $lvm
	#TCP Connections: $tcp ESTABLISHED
	#User log: $ulog
	#Network: IP $ip ($mac)
	#Sudo: $cmds cmd"`,
        cap: "ทุกบรรทัดต้องอธิบายได้ว่าทำไมใช้คำสั่งนั้น — ผู้ตรวจถามทีละบรรทัดจริง ๆ", lang: "bash" },
      { code: String.raw`sudo cp monitoring.sh /usr/local/bin/
sudo chmod +x /usr/local/bin/monitoring.sh
sudo crontab -e
    */10 * * * * /usr/local/bin/monitoring.sh

sudo crontab -l                 # ยืนยันว่าอยู่ใน crontab ของ root`,
        cap: "ต้องเป็น crontab ของ root เพราะ hostname -I, ss และ log ของ sudo ต้องใช้สิทธิ์", lang: "bash" },
      { h: "9) ปิดเครื่องแล้วเก็บลายเซ็น" },
      { code: String.raw`sudo shutdown -h now                    # ต้องปิดสนิทก่อน
sha1sum ~/'VirtualBox VMs'/wiaon-in42/wiaon-in42.vdi > signature.txt
git add README.md signature.txt && git commit -m "born2beroot" && git push`,
        cap: "อย่าเปิด VM อีกหลังจากนี้ ไม่งั้น hash ไม่ตรงแล้วได้ 0", lang: "bash" }
    ],

    tricks: [
      { h: "กับดักที่ทำให้เสียเวลามากที่สุด" },
      { table: { head: ["อาการ", "สาเหตุจริง", "ทางแก้"], rows: [
        ["แก้ `sshd_config` แล้วพอร์ตไม่ขยับ", "Debian ใหม่ใช้ socket activation", "`systemctl disable --now ssh.socket` แล้ว enable `ssh`"],
        ["เปิด ufw แล้ว ssh หลุดทันที", "enable ก่อนใส่กฎ 4242", "ต่อผ่านคอนโซลของ VirtualBox แล้ว `ufw allow 4242`"],
        ["ตั้งรหัสใหม่ไม่ผ่านทุกแบบ", "`difok=7` บวก `usercheck` เข้มกว่าที่คิด", "อ่านข้อความของ pwquality มันบอกตรง ๆ ว่าติดข้อไหน"],
        ["`chage -l` ยังโชว์ 99999", "`login.defs` ไม่ย้อนหลัง", "`sudo chage -M 30 -m 2 -W 7 <user>` ทีละบัญชี"],
        ["ไม่มีอะไรใน `/var/log/sudo/`", "ลืม `mkdir -p /var/log/sudo`", "สร้างไดเรกทอรีแล้วลอง sudo ใหม่"],
        ["cron ไม่ยิงเลย", "ใส่ใน crontab ของผู้ใช้ธรรมดา หรือลืม `chmod +x`", "`sudo crontab -e` และให้ path เป็น absolute"],
        ["`monitoring.sh` มี error โผล่", "รันโดยไม่มีสิทธิ์ หรือคำสั่งไม่มีในเครื่อง", "รันจาก cron ของ root และเช็คว่ามี `ss`, `journalctl`"],
        ["signature ไม่ตรงตอน defense", "เผลอบูต VM หลัง hash", "hash ใหม่ตอนปิดเครื่องแล้ว push ก่อนสอบ"],
        ["`sudo` ช้าไปหลายวินาที", "`/etc/hosts` ไม่มี hostname ใหม่", "ใส่ `127.0.1.1  <hostname>`"]
      ]}},
      { h: "หยุด monitoring.sh โดยห้ามแก้ไฟล์" },
      { p: "คำถามนี้ถูกถามเกือบทุกครั้ง และคำตอบว่า 'ผมจะแก้สคริปต์' คือตกทันทีเพราะโจทย์ห้ามไว้ชัดเจน มี 3 ทางที่ตอบได้:" },
      { table: { head: ["วิธี", "คำสั่ง", "ข้อดี/ข้อเสีย"], rows: [
        ["ปิดบรรทัดใน crontab", "`sudo crontab -e` แล้วใส่ `#` หน้าบรรทัด", "ตรงจุดที่สุด งานอื่นไม่กระทบ"],
        ["หยุดบริการ cron", "`sudo systemctl stop cron`", "ตรงไปตรงมา แต่หยุดงานอื่นทั้งหมดด้วย"],
        ["ถอดสิทธิ์รัน", "`sudo chmod -x /usr/local/bin/monitoring.sh`", "เนื้อไฟล์ไม่ถูกแตะเลย ตรงตามโจทย์เป๊ะ"]
      ]}},
      { h: "คำถามที่ซ่อนอยู่ในสคริปต์" },
      { ul: [
        "**CPU จริงเทียบ vCPU** — `physical id` นับซ็อกเก็ต ส่วน `processor` นับคอร์เชิงตรรกะ บน VM หนึ่งซ็อกเก็ตตัวเลขจะไม่เท่ากันและผู้ตรวจเช็คว่าเรารู้ว่าอันไหนคืออันไหน",
        "`top -bn1` **รอบแรกเป็นค่าเฉลี่ยตั้งแต่บูต** ไม่ใช่ค่า ณ ขณะนั้น",
        "**นับคำสั่ง sudo** จาก `/var/log/sudo/sudo.log` ได้ก็ต่อเมื่อ logging ทำงานแล้ว ส่วน `journalctl _COMM=sudo` ใช้ได้ตั้งแต่บูตแรก",
        "`wall` **ต้องการ tab นำหน้า** ถ้าอยากให้จัดแนวสวยตามตัวอย่างใน subject"
      ]},
      { h: "เตรียม README ให้ตรงเกณฑ์" },
      { ul: [
        "บรรทัดแรกต้องเป็นตัวเอียงเป๊ะตามที่ subject กำหนด: *This project has been created as part of the 42 curriculum by ...*",
        "ต้องมีหัวข้อ **Description**, **Instructions**, **Resources** (รวมทั้งบอกว่าใช้ AI ช่วยตรงไหนบ้าง)",
        "ต้องมี **การเปรียบเทียบ 4 คู่**: Debian/Rocky, AppArmor/SELinux, UFW/firewalld, VirtualBox/UTM",
        "เขียนเป็นข้อดี-ข้อเสียจริง ไม่ใช่คำโฆษณา — ผู้ตรวจอ่านออกเสียงและถามต่อจากสิ่งที่เราเขียน"
      ]},
      { h: "bonus ทำเมื่อ mandatory สมบูรณ์แบบแล้วเท่านั้น" },
      { ul: [
        "แบ่งพาร์ทิชันตามผังเต็มของ subject (`/`, `/home`, `/var`, `/srv`, `/tmp`, `/var/log`, swap)",
        "**lighttpd + MariaDB + PHP** เสิร์ฟ WordPress — ห้ามใช้ NGINX หรือ Apache2",
        "อีกหนึ่งบริการที่เลือกเอง และต้องอธิบายได้ว่าทำไมมีประโยชน์ — `fail2ban` เข้าคู่กับ sshd ที่เปิดอยู่ได้อย่างสมเหตุสมผล",
        "ทุกพอร์ตที่เพิ่มต้องเปิดใน UFW อย่างตั้งใจ ไม่ใช่ปิดไฟร์วอลล์ทิ้ง"
      ]},
      { note: "**bonus ถูกตรวจก็ต่อเมื่อ mandatory ไม่มีที่ติเลย** — ผิดข้อเดียวในส่วนบังคับ bonus จะไม่ถูกดูเลยแม้แต่นิดเดียว" }
    ],

    eval: [
      { p: "คำถามที่ผู้ตรวจถามจริง — Born2beRoot เป็นโปรเจกต์ที่ 'พูดอธิบาย' มากที่สุดในสาย common core" },
      { qa: [
        { q: "virtual machine คืออะไร ทำไมโปรเจกต์นี้ต้องใช้ VM ไม่ใช่ container",
          a: "VM จำลองฮาร์ดแวร์ทั้งเครื่องและรัน kernel ของตัวเอง ส่วน container ใช้ kernel ของโฮสต์ร่วมกัน — ที่นี่เราต้องตั้งค่าพาร์ทิชัน bootloader และ kernel module ซึ่ง container ทำไม่ได้เพราะไม่มี kernel เป็นของตัวเอง" },
        { q: "ทำไมเลือก Debian",
          a: "ชุมชนดูแล แพ็กเกจครบมาก เอกสารเยอะ และ subject แนะนำสำหรับคนที่เพิ่งเริ่ม sysadmin ส่วน Rocky เป็นโคลนของ RHEL ที่องค์กรใช้จริงแต่ต้องตั้ง SELinux ซึ่งซับซ้อนกว่ามาก" },
        { q: "`apt` ต่างจาก `aptitude` ยังไง",
          a: "ทั้งคู่เป็นชั้นบน `dpkg` ซึ่งเป็นตัวติดตั้งจริง `apt` เป็นคำสั่งบรรทัดเดียวสำหรับงานประจำวัน ส่วน `aptitude` เป็นตัวจัดการเต็มรูปแบบมีโหมด TUI และ **เสนอทางเลือกหลายทางเมื่อ dependency ขัดกัน** แทนที่จะล้มไปเฉย ๆ" },
        { q: "AppArmor คืออะไร ตอนนี้มันทำอะไรอยู่",
          a: "เป็น Mandatory Access Control ที่ผูกกฎกับ **path ของไฟล์** kernel จะจำกัดว่าแต่ละโปรแกรมแตะอะไรได้บ้างตามโปรไฟล์ แม้โปรแกรมนั้นจะรันเป็น root — ต่างจากสิทธิ์ไฟล์ปกติที่เจ้าของเปลี่ยนเองได้ ดูสถานะด้วย `aa-status`" },
        { q: "LVM คืออะไร ทำไมถึงใช้",
          a: "LVM แทรกชั้นระหว่างพาร์ทิชันจริงกับ filesystem: PV คือพาร์ทิชันที่ยกให้ LVM, VG คือสระที่รวม PV, LV คือก้อนที่ตัดออกมาใช้ ประโยชน์คือขยาย/ย่อ/ย้าย filesystem ได้ขณะระบบยังรันอยู่ โดยไม่ต้องลงเครื่องใหม่" },
        { q: "ทำไม `/boot` ถึงไม่ถูกเข้ารหัส",
          a: "bootloader ต้องอ่าน kernel กับ initramfs ให้ได้ก่อน จึงจะมีโค้ดไปถามหา passphrase ของ LUKS — ถ้าเข้ารหัส `/boot` ด้วยก็จะไม่มีอะไรอ่านมันได้ตั้งแต่แรก" },
        { q: "LUKS ป้องกันอะไรได้และไม่ได้",
          a: "ป้องกันกรณีดิสก์ถูกขโมยหรือเครื่องถูกยกไป เพราะข้อมูลบนดิสก์เป็นค่าที่อ่านไม่ออกจนกว่าจะปลดล็อก แต่ **ไม่ป้องกันอะไรเลยเมื่อเครื่องเปิดอยู่และปลดล็อกแล้ว** เพราะตอนนั้น filesystem ถูก mount ปกติ" },
        { q: "ทำไม SSH ต้องอยู่พอร์ต 4242",
          a: "เป็น security through obscurity — ไม่ได้ปลอดภัยขึ้นในเชิงเข้ารหัส แต่ตัดบอตที่กวาดพอร์ต 22 ออกไปเกือบหมด ทำให้ log สะอาดพอจะเห็นการโจมตีที่ตั้งใจจริง ส่วนที่ปลอดภัยขึ้นจริงคือการห้าม root login" },
        { q: "ทำไมต้องห้าม root login ผ่าน SSH",
          a: "บังคับให้ผู้โจมตีต้องเดาทั้งชื่อผู้ใช้และรหัสผ่าน แล้วยังต้องผ่าน sudo อีกชั้น และทุกคำสั่งที่ยกสิทธิ์จะถูกบันทึกว่าใครเป็นคนทำ ไม่ใช่เป็น root ลอย ๆ" },
        { q: "UFW คืออะไร ต่างจาก firewalld ยังไง",
          a: "ทั้งคู่เป็นหน้าบ้านของ netfilter ใน kernel UFW เน้นความง่ายคำสั่งบรรทัดเดียว ส่วน firewalld แบ่งเป็น zone ตามความน่าเชื่อถือของเครือข่ายและแยกกฎ runtime กับ permanent ซึ่งยืดหยุ่นกว่าแต่ต้องอธิบายมากกว่า" },
        { q: "ตอนนี้เปิดพอร์ตอะไรไว้บ้าง พิสูจน์ให้ดู",
          a: "`sudo ufw status numbered` แสดง 4242 เท่านั้น และ `sudo ss -tlnp` ยืนยันว่ามี sshd ฟังอยู่ที่พอร์ตนั้นจริง" },
        { q: "นโยบายรหัสผ่านของคุณคืออะไร ตั้งที่ไหน",
          a: "อายุอยู่ใน `/etc/login.defs` (30/2/7 วัน) และความแข็งแรงอยู่ใน `/etc/security/pwquality.conf` (ยาว 10, มีพิมพ์ใหญ่/พิมพ์เล็ก/ตัวเลข, ห้ามซ้ำติดกันเกิน 3, ห้ามมีชื่อผู้ใช้, ต่างจากรหัสเดิม 7 ตัว) ตรวจของบัญชีจริงด้วย `chage -l`" },
        { q: "ทำไมบัญชีที่มีอยู่แล้วไม่ได้รับผลจาก `login.defs`",
          a: "ค่าพวกนั้นถูกคัดลอกเข้า `/etc/shadow` ตอน **สร้างบัญชี** เท่านั้น บัญชีเก่าจึงต้องสั่ง `chage` ให้ทีละบัญชี แล้วเปลี่ยนรหัสผ่านใหม่ทุกบัญชีรวมทั้ง root" },
        { q: "`ucredit = -1` แปลว่าอะไร",
          a: "ค่าลบแปลว่า **ต้องมีอย่างน้อยเท่านั้นตัว** — `-1` คือต้องมีตัวพิมพ์ใหญ่อย่างน้อยหนึ่งตัว ส่วนค่าบวกจะแปลว่าให้แต้มเพิ่มถ้ามี ซึ่งไม่ใช่การบังคับ" },
        { q: "`requiretty` กับ `secure_path` ใน sudoers มีไว้ทำไม",
          a: "`requiretty` ปฏิเสธ sudo จากกระบวนการที่ไม่มี terminal ซึ่งตัดการยกสิทธิ์แบบสคริปต์อัตโนมัติทิ้ง ส่วน `secure_path` ทำให้ sudo เมิน `PATH` ของผู้เรียก จึงไม่มีทางที่คำสั่งปลอมที่วางไว้ต้นทางจะถูกรันเป็น root" },
        { q: "log ของ sudo อยู่ที่ไหน เปิดดูยังไง",
          a: "`/var/log/sudo/` ตามที่ subject บังคับ โดย `log_input, log_output` เก็บทั้ง session ไว้ เล่นย้อนดูได้ด้วย `sudo sudoreplay -l` แล้วเลือก session — ต้อง `mkdir -p /var/log/sudo` ก่อน ไม่งั้นไม่มีอะไรถูกเขียนเลย" },
        { q: "อธิบาย `monitoring.sh` บรรทัดที่นับ CPU",
          a: "`grep 'physical id' /proc/cpuinfo | sort -u | wc -l` นับจำนวน **ซ็อกเก็ต **ส่วน** `grep -c '^processor'` **นับ** คอร์เชิงตรรกะ** ซึ่งรวม hyper-threading บน VM นี้เลยได้ตัวเลขที่ต่างกัน" },
        { q: "หยุด monitoring.sh โดยห้ามแก้ไฟล์ ทำยังไง",
          a: "ทำได้ 3 ทาง: ใส่ `#` หน้าบรรทัดใน `sudo crontab -e`, `sudo systemctl stop cron` (แต่หยุดงานอื่นด้วย), หรือ `sudo chmod -x /usr/local/bin/monitoring.sh` ซึ่งไม่แตะเนื้อไฟล์เลย" },
        { q: "cron คืออะไร รูปแบบ `*/10 * * * *` อ่านว่าอะไร",
          a: "cron คือตัวจับเวลาของระบบที่รันคำสั่งตามตาราง ห้าช่องคือ นาที ชั่วโมง วันที่ เดือน วันในสัปดาห์ — `*/10` ในช่องนาทีแปลว่าทุก ๆ 10 นาที ส่วนที่เหลือเป็น `*` คือไม่จำกัด" },
        { q: "เปลี่ยน hostname ตอนนี้เลยได้ไหม",
          a: "`sudo hostnamectl set-hostname ใหม่` แล้วแก้ `/etc/hosts` บรรทัด `127.0.1.1` ให้ตรงกัน ถ้าไม่แก้ hosts ด้วยจะทำให้ sudo ช้าเพราะ resolve ชื่อตัวเองไม่ได้ ยืนยันด้วย `hostname`" },
        { q: "ทำไม signature ต้องเอาตอนเครื่องปิด",
          a: "ไฟล์ `.vdi` ถูกเขียนทุกครั้งที่ VM ทำงาน sha1 จึงเปลี่ยนทันทีที่บูตใหม่ ต้อง hash ตอนปิดสนิทและอย่าเปิดอีกก่อนสอบ ไม่งั้นค่าที่ส่งไปไม่ตรงกับเครื่องจริงและได้ 0" }
      ]},
      { h: "เช็กลิสต์ก่อน defense" },
      { ul: [
        "`hostname` = login + 42 · `cat /etc/os-release` = Debian stable ล่าสุด",
        "`lsblk` เห็น `crypt` แล้วตามด้วย `lvm` และมีอย่างน้อย 2 พาร์ทิชันเข้ารหัส",
        "`aa-status` บอกว่า AppArmor โหลดโปรไฟล์อยู่ · `systemctl is-enabled apparmor` = enabled",
        "`sudo ufw status` = active และมีแค่ 4242 · `systemctl is-enabled ufw` = enabled",
        "`sudo ss -tlnp | grep 4242` เห็น sshd · `ssh -p 4242 root@...` ถูกปฏิเสธ",
        "`groups <login>` มีทั้ง `sudo` และ `user42`",
        "`chage -l <login>` แสดง 30 / 2 / 7 และ root ก็เหมือนกัน",
        "ตั้งรหัสผ่านที่ไม่ผ่านนโยบายแล้วถูกปฏิเสธจริง (สาธิตให้ดูได้)",
        "`ls /var/log/sudo/` มีไฟล์ · พิมพ์ผิดรหัส 3 ครั้งแล้วเห็นข้อความที่เราตั้งเอง",
        "`sudo crontab -l` มีบรรทัด `*/10` · รอ 10 นาทีแล้วเห็น `wall` โผล่จริง",
        "ซ้อมสร้างผู้ใช้ใหม่ + กลุ่มใหม่ + เปลี่ยน hostname สด ๆ ได้โดยไม่เปิดโน้ต",
        "`signature.txt` ตรงกับ `.vdi` ปัจจุบัน และไม่มี snapshot ค้าง"
      ]},
      { links: [
        { label: "Debian Administrator's Handbook", url: "https://debian-handbook.info/browse/stable/", note: "หนังสือทางการ ครอบคลุม apt, systemd, ผู้ใช้/สิทธิ์ และความปลอดภัย" },
        { label: "Debian Wiki — LVM", url: "https://wiki.debian.org/LVM", note: "PV/VG/LV และคำสั่งขยาย/ย่อจริง" },
        { label: "cryptsetup / LUKS FAQ", url: "https://gitlab.com/cryptsetup/cryptsetup/-/wikis/FrequentlyAskedQuestions", note: "master key, key slot, สิ่งที่ LUKS ป้องกันไม่ได้" },
        { label: "AppArmor wiki (Ubuntu)", url: "https://wiki.ubuntu.com/AppArmor", note: "โปรไฟล์แบบ path-based, aa-status, โหมด enforce/complain" },
        { label: "UFW — Ubuntu community help", url: "https://help.ubuntu.com/community/UFW", note: "default deny, allow, status numbered" },
        { label: "sudoers(5) manual", url: "https://www.sudo.ws/docs/man/sudoers.man/", note: "ทุก Defaults ที่ใช้ในโปรเจกต์นี้อธิบายไว้หมด" },
        { label: "pwquality.conf(5)", url: "https://man.archlinux.org/man/pwquality.conf.5", note: "ความหมายของ credit ที่เป็นค่าลบ, maxrepeat, difok" },
        { label: "crontab(5)", url: "https://man7.org/linux/man-pages/man5/crontab.5.html", note: "รูปแบบห้าช่องและความหมายของ */10" }
      ]}
    ]
  }
});

/* flow visualizer: จากกดปุ่มเปิดเครื่อง จนข้อความ wall โผล่บนทุก terminal */
window.EXTRA_FLOWS = window.EXTRA_FLOWS || {};
window.EXTRA_FLOWS.born2beroot = {
  input: "กดเปิด VM wiaon-in42 แล้วมีคน ssh -p 4242 เข้ามาใช้ sudo",
  steps: [
    { fn: "GRUB อ่าน /boot", file: "bootloader", depth: 0,
      note: { th: "`/boot` เป็นพาร์ทิชันเดียวที่ **ไม่ถูกเข้ารหัส** เพราะ bootloader ต้องอ่าน kernel กับ initramfs ให้ได้ก่อน จึงจะมีโค้ดไปถามหา passphrase",
              en: "`/boot` is the one partition that is **not encrypted**, because the bootloader must read the kernel and initramfs before any code exists to ask for a passphrase." },
      data: "sda1  ext4  /boot   (500M, ไม่เข้ารหัส)",
      vars: [ { n: "vmlinuz + initrd", d: { th: "สองไฟล์นี้ต้องอ่านได้ตั้งแต่ยังไม่ปลดล็อก", en: "both must be readable before anything is unlocked" } } ] },
    { fn: "initramfs ถาม passphrase", file: "cryptsetup", depth: 1,
      note: { th: "LUKS เข้ารหัส **ทั้งบล็อกอุปกรณ์** ข้างในเก็บ master key ที่ถูกล็อกด้วย passphrase อีกที — เปลี่ยนรหัสผ่านจึงไม่ต้องเข้ารหัสข้อมูลใหม่ทั้งก้อน",
              en: "LUKS encrypts the **whole block device**, holding a master key that the passphrase unlocks — so changing the passphrase never re-encrypts the data." },
      data: "Please unlock disk sda5_crypt:",
      vars: [ { n: "sda5_crypt", d: { th: "อุปกรณ์ที่ปลดล็อกแล้ว LVM ถึงจะมองเห็น", en: "the unlocked device LVM can finally see" }, w: true } ] },
    { fn: "LVM เปิด logical volume", file: "lvm2", depth: 1,
      note: { th: "ก่อนปลดล็อก LVM ไม่เห็นอะไรเลยนอกจากข้อมูลที่ดูเหมือนสุ่ม — เพราะ **LUKS อยู่ใต้ LVM** ถ้าสลับชั้นกันจะต้องใส่รหัสผ่านทีละก้อน",
              en: "Before the unlock, LVM sees nothing but noise — because **LUKS sits under LVM**. Reverse the layers and you would type a passphrase per volume." },
      data: "PV: sda5_crypt  ->  VG: LVMGroup  ->  LV: root swap home var srv tmp var-log",
      vars: [ { n: "VG free", d: { th: "ที่เหลือใน VG คือสิ่งที่ทำให้ขยาย /home ได้ทีหลัง", en: "the free space in the VG is what lets you grow /home later" } } ] },
    { fn: "systemd เริ่ม service", file: "PID 1", depth: 0,
      note: { th: "สาม service ที่ถูกให้คะแนนต้อง `enabled` ไม่ใช่แค่ `active` — ผู้ตรวจอาจสั่งรีบูตแล้วดูว่ายังขึ้นเองไหม",
              en: "The three graded services must be `enabled`, not merely `active` — an evaluator may reboot and check they come back by themselves." },
      data: "apparmor.service · ufw.service · ssh.service · cron.service",
      vars: [ { n: "is-enabled", v: "enabled", d: { th: "systemctl is-enabled ufw / ssh / apparmor", en: "systemctl is-enabled ufw / ssh / apparmor" }, w: true } ] },
    { fn: "ufw กรองที่ขอบ", file: "netfilter", depth: 1,
      note: { th: "นโยบายคือ deny ขาเข้าเป็นค่าเริ่มต้น มีรูเดียวคือ 4242 — พอร์ตอื่นถูก **DROP เงียบ ๆ** ไม่มีคำตอบกลับไปเลย ผู้สแกนจึงแยกไม่ออกว่าไม่มีเครื่องหรือมีแต่ปิดพอร์ต",
              en: "The policy is deny-by-default inbound with exactly one hole at 4242 — everything else is **dropped silently**, so a scanner cannot tell a filtered port from a missing host." },
      data: "4242/tcp  ALLOW IN  Anywhere",
      vars: [ { n: "default", v: "deny incoming", d: { th: "ต้องใส่กฎ 4242 ก่อนสั่ง enable เสมอ", en: "always add the 4242 rule before enabling" } } ] },
    { fn: "sshd ปฏิเสธ root", file: "/etc/ssh/sshd_config", depth: 1,
      note: { th: "`PermitRootLogin no` คือสิ่งที่เพิ่มความปลอดภัย **จริง** ส่วนการย้ายพอร์ตเป็นแค่การลดเสียงรบกวนจากบอต",
              en: "`PermitRootLogin no` is the change that **actually** adds security; moving the port only cuts bot noise out of the logs." },
      data: "ssh -p 4242 root@host  ->  Permission denied",
      vars: [ { n: "Port", v: "4242", d: { th: "ตรวจด้วย sshd -t ก่อน restart เสมอ", en: "always validate with sshd -t before restarting" } } ] },
    { fn: "PAM ตรวจตัวตน", file: "/etc/pam.d/", depth: 2,
      note: { th: "`pam_unix` เทียบรหัสกับ `/etc/shadow` ส่วน `pam_pwquality` ทำงาน **เฉพาะตอนตั้งรหัสใหม่** ไม่ใช่ตอน login และถ้าบัญชีหมดอายุตาม `chage` จะถูกบังคับเปลี่ยนรหัสก่อนเข้าใช้งาน",
              en: "`pam_unix` checks the password against `/etc/shadow`, while `pam_pwquality` runs **only when a password is set**, not at login — and an account past its `chage` expiry is forced to change it first." },
      data: "chage -l: Max 30 · Min 2 · Warn 7",
      vars: [ { n: "difok=7", d: { th: "ต้องต่างจากรหัสเดิมอย่างน้อย 7 ตัวอักษร", en: "at least seven characters must differ from the previous password" } } ] },
    { fn: "sudo ตรวจ 4 ด่าน", file: "/etc/sudoers.d/", depth: 2,
      note: { th: "อยู่ในกลุ่ม `sudo` ไหม → มี terminal ไหม (`requiretty`) → ใช้ `secure_path` แทน PATH ของผู้ใช้ → ผิดรหัสได้ 3 ครั้ง แล้วขึ้นข้อความที่เราตั้งเอง",
              en: "In the `sudo` group? Has a terminal (`requiretty`)? Use `secure_path` instead of the caller's PATH? Three password attempts, then the custom message." },
      data: "Defaults passwd_tries=3, requiretty, secure_path=...",
      vars: [ { n: "/var/log/sudo/", d: { th: "log_input+log_output เก็บทั้ง session เล่นย้อนด้วย sudoreplay", en: "log_input and log_output record the whole session; replay with sudoreplay" }, w: true } ] },
    { fn: "cron ยิงทุก 10 นาที", file: "crontab -e (root)", depth: 0,
      note: { th: "ต้องอยู่ใน crontab ของ **root** เพราะ `hostname -I`, `ss` และ log ของ sudo ต้องใช้สิทธิ์ — และ path ต้องเป็น absolute เพราะ cron มี PATH สั้นมาก",
              en: "It belongs in **root's** crontab, because `hostname -I`, `ss` and the sudo log all need privileges — and the path must be absolute, since cron's PATH is very short." },
      data: "*/10 * * * * /usr/local/bin/monitoring.sh",
      vars: [ { n: "*/10", d: { th: "ช่องแรกคือนาที: ทุก ๆ 10 นาที", en: "the first field is minutes: every ten of them" } } ] },
    { fn: "wall กระจายไปทุก tty", file: "monitoring.sh", depth: 1,
      note: { th: "`wall` เขียนลง **ทุก terminal ที่เปิดอยู่ของทุกผู้ใช้ **(ยกเว้นคนที่** `mesg n`**) และคำถามปิดท้ายคือหยุดมันโดย** ห้ามแก้ไฟล์** — ตอบด้วยการคอมเมนต์ crontab, หยุด cron, หรือ `chmod -x`",
              en: "`wall` writes to **every open terminal of every logged-in user **(unless they ran** `mesg n`**), and the closing question is how to stop it** without editing the file** — comment the crontab line, stop cron, or `chmod -x`." },
      data: "#Architecture: ...  #vCPU: 1  #LVM use: yes  #Sudo: 42 cmd",
      vars: [ { n: "chmod -x", d: { th: "ทางที่ตรงโจทย์ที่สุด เพราะเนื้อไฟล์ไม่ถูกแตะเลย", en: "the closest fit to the question, since the file's content is untouched" }, w: true } ] }
  ]
};

Object.assign(window.TEACHING_EN, {
  born2beroot: {
    principle: [
      { h: "What the project asks for" },
      { p: "Born2beRoot is a pure **system administration** project — no norminette, no valgrind, no compiler. What is graded is **a machine that runs**, plus your ability to justify every decision out loud." },
      { p: "Install the **latest stable Debian** (or Rocky) in VirtualBox with **no graphical server at all** — installing X.org or Wayland scores zero on the spot." },
      { h: "Only two files go into git" },
      { table: { head: ["File", "What is inside"], rows: [
        ["`README.md`", "The project, why you chose that OS, and four comparisons (Debian/Rocky, AppArmor/SELinux, UFW/firewalld, VirtualBox/UTM)"],
        ["`signature.txt`", "The sha1 of the virtual disk file (`.vdi` or `.qcow2`)"]
      ]}},
      { note: "**Never commit the VM itself** — you submit the disk's signature, not the disk." },
      { h: "The signature trap, first because it has ended defenses" },
      { p: "**The sha1 changes the moment the VM boots again.** Take it with the machine **fully powered off** and do not start it before the evaluation (or take a fresh hash and push it). A mismatch is a zero. And no snapshot may exist when a defense begins." },
      { code: String.raw`sha1sum ~/'VirtualBox VMs'/wiaon-in42/wiaon-in42.vdi     # Linux / macOS
certUtil -hashfile wiaon-in42.vdi sha1                   # Windows
shasum rocky.utm/Images/disk-0.qcow2                     # Mac M1 with UTM`,
        cap: "Shut the machine down first, then hash", lang: "bash" },
      { h: "The graded list, with the command that proves each one" },
      { table: { head: ["Requirement", "Prove it with"], rows: [
        ["No graphical server", "`dpkg -l | grep -iE 'xserver|wayland'` must be empty"],
        ["Latest stable Debian, or Rocky", "`cat /etc/os-release`"],
        ["Hostname = login plus `42`", "`hostname` → `wiaon-in42`"],
        ["At least two encrypted partitions on LVM", "`lsblk` must show `crypt` and then `lvm`"],
        ["AppArmor (or SELinux) running from boot", "`aa-status` / `sestatus`"],
        ["sshd on 4242 with no root login", "`sudo ss -tlnp | grep 4242`"],
        ["UFW active, only 4242 open", "`sudo ufw status numbered`"],
        ["The user is in `sudo` and `user42`", "`groups wiaon-in`"],
        ["The password policy", "`chage -l wiaon-in` plus `/etc/security/pwquality.conf`"],
        ["Hardened sudo with I/O logging", "`sudo cat /etc/sudoers.d/*` and `ls /var/log/sudo/`"],
        ["`monitoring.sh` every 10 minutes on every terminal", "A `wall` message appears, plus `sudo crontab -l`"]
      ]}},
      { p: "**Running these live at the defense matters as much as having configured them** — the evaluator trusts what is printed in front of them, not what is in a file." },
      { h: "Why it is harder than it looks" },
      { ul: [
        "**There is nothing to compile.** All the difficulty is in understanding why, not in getting something to pass",
        "**One slip can lock you out of your own machine** — enabling UFW at the wrong moment, or restarting sshd after an unchecked edit",
        "**The password policy is not retroactive.** Existing accounts keep their old values until their password changes again",
        "**You must explain the script line by line** and then stop it without editing the file"
      ]},
      { h: "Where this leads" },
      { p: "The same services (a web server, PHP and a database) come back in **Inception**, only containerised instead of living on one machine. Understand this project properly and Inception becomes far easier." }
    ],
    theory: [
      { p: "The concepts you must be able to explain at the defense — every one of them has its question." },
      { h: "1) What a virtual machine is, and how it differs from a container" },
      { table: { head: ["", "Virtual machine", "Container"], rows: [
        ["Emulates", "**A whole machine**", "Only process isolation"],
        ["Kernel", "Runs its own", "Shares the host's"],
        ["Size and boot time", "GB, minutes", "MB, seconds"],
        ["Isolation", "Complete", "Namespaces plus cgroups"],
        ["Good for", "Running a different OS, experiments you can break", "Packaging an app to run identically everywhere"]
      ]}},
      { p: "This project needs a **VM** because we configure **an entire operating system** — partitions, a bootloader, kernel modules, a service manager — none of which a container can do, since it has no kernel of its own." },
      { h: "2) Two kinds of hypervisor" },
      { ul: [
        "**Type 1 (bare metal)** — runs directly on the hardware: ESXi, Proxmox, Hyper-V; what data centres use",
        "**Type 2 (hosted)** — runs as a program on an ordinary OS: **VirtualBox**, UTM, VMware Workstation; slower but trivial to install"
      ]},
      { h: "3) Debian versus Rocky" },
      { table: { head: ["", "Debian", "Rocky Linux"], rows: [
        ["Lineage", "Independent, community-run", "A 1:1 clone of RHEL"],
        ["Package manager", "`apt` / `dpkg`", "`dnf` / `rpm`"],
        ["Mandatory access control", "**AppArmor**", "**SELinux**"],
        ["Firewall", "**UFW**", "**firewalld**"],
        ["Suits", "A first server, an enormous package set", "Shops that run RHEL, stricter defaults"]
      ]}},
      { p: "The subject recommends Debian outright for beginners, because Rocky also demands a correct SELinux configuration, which is a large project of its own." },
      { h: "4) apt versus aptitude — asked almost every time" },
      { table: { head: ["", "`apt`", "`aptitude`"], rows: [
        ["What it is", "One command gathering the common parts of `apt-get` and `apt-cache`", "A full package manager, with a TUI mode"],
        ["Dependency conflicts", "Resolves directly; if it fails, it says so", "**Offers several alternative resolutions** to choose from"],
        ["Ships with Debian", "Yes", "Must be installed"],
        ["Use it for", "Everyday work", "Tangled dependencies that need negotiating"]
      ]}},
      { note: "Both talk to `dpkg`, which is the low-level installer that actually unpacks packages — `apt` and `aptitude` are the smarter layers on top that fetch and resolve for you." },
      { h: "5) AppArmor versus SELinux" },
      { p: "Both are **Mandatory Access Control**: unlike ordinary file permissions (DAC), **the owner of a file cannot change the rule** — the kernel enforces the policy the administrator wrote, and nothing else." },
      { table: { head: ["", "AppArmor", "SELinux"], rows: [
        ["Rules attach to", "**A file path**", "**A label (security context)** on every object"],
        ["Readability", "Profiles are plain readable text", "You must understand types, roles and users"],
        ["Default on", "Debian / Ubuntu", "RHEL / Rocky / Fedora"],
        ["Strictness", "Solid and easy to set up", "Far stricter, and far harder"]
      ]}},
      { p: "The practical payoff: if somebody compromises `sshd`, AppArmor still limits which files that process may touch, even while it runs as root." },
      { h: "6) UFW versus firewalld" },
      { p: "Both are front ends to the kernel's **netfilter** (with `iptables`/`nftables` as the middle layer)." },
      { table: { head: ["", "UFW", "firewalld"], rows: [
        ["Philosophy", "Uncomplicated — one-line commands", "**Zones** by how much a network is trusted"],
        ["Runtime versus permanent", "What you write is permanent", "Explicitly separated"],
        ["Suits", "One machine with a handful of rules", "Machines with several interfaces or roles"]
      ]}},
      { h: "7) What SSH is, and why move the port" },
      { p: "SSH is an encrypted remote shell, the replacement for telnet, which sent passwords in the clear. Moving from 22 to **4242** is *security through obscurity* — **it is not genuinely safer**, but it removes almost all the bots that sweep port 22, leaving logs clean enough to see a real attack." },
      { p: "**Refusing root login is the change that genuinely adds security**: an attacker must now guess a username as well as a password, then still pass sudo, and every privileged command is logged against a person." },
      { h: "8) PAM — where the password policy actually lives" },
      { p: "**PAM (Pluggable Authentication Modules)** is the layer that `login`, `sshd`, `passwd` and `sudo` call when they need to authenticate, instead of each program writing that logic itself." },
      { ul: [
        "`pam_pwquality` checks the **strength** of a password when it is set (length, case, digits, repeats)",
        "`/etc/login.defs` controls password **ageing** (expiry, minimum interval, warning window)",
        "**They are different files and different mechanisms**, and both are graded"
      ]}
    ],
    foundations: [
      { p: "The storage stack from hardware up to files — the part evaluators dig into hardest." },
      { h: "The storage layers, bottom to top" },
      { code: String.raw`physical disk        /dev/sda
  └─ partition       /dev/sda1  (boot)   /dev/sda5  (the rest)
       └─ LUKS       sda5_crypt          <- the encryption layer
            └─ PV    physical volume     <- LVM's raw material
                 └─ VG   volume group    <- PVs pooled together
                      └─ LV  logical volume  <- carved out for use
                           └─ filesystem (ext4/swap) -> mounted`,
        cap: "Encrypt the whole container once, carve logical volumes inside it, and you type one passphrase at boot", lang: "txt" },
      { h: "What the evaluator wants lsblk to look like" },
      { code: String.raw`sda                      8:0    0   30G  0 disk
├─sda1                   8:1    0  500M  0 part  /boot
└─sda5                   8:5    0 29.5G  0 part
  └─sda5_crypt         254:0    0 29.5G  0 crypt
    ├─LVMGroup-root    254:1    0   10G  0 lvm   /
    ├─LVMGroup-swap    254:2    0  2.3G  0 lvm   [SWAP]
    ├─LVMGroup-home    254:3    0    5G  0 lvm   /home
    ├─LVMGroup-var     254:4    0    3G  0 lvm   /var
    ├─LVMGroup-srv     254:5    0    3G  0 lvm   /srv
    ├─LVMGroup-tmp     254:6    0    3G  0 lvm   /tmp
    └─LVMGroup-var--log 254:7   0    4G  0 lvm   /var/log`,
        cap: "The word crypt followed by lvm is the proof that the encryption really sits *under* LVM", lang: "txt" },
      { h: "LVM in one sentence" },
      { p: "**LVM inserts a layer between the physical partitions and the filesystems**, so a filesystem is no longer pinned to a fixed slice of disk — it can be grown, shrunk or moved while the system is running." },
      { table: { head: ["Term", "Stands for", "What it is"], rows: [
        ["**PV**", "Physical Volume", "A partition (or whole disk) handed over to LVM"],
        ["**VG**", "Volume Group", "The pool formed by combining PVs"],
        ["**LV**", "Logical Volume", "A slice carved from the VG and formatted"],
        ["**PE**", "Physical Extent", "LVM's smallest allocation unit, usually 4 MB"]
      ]}},
      { p: "The answer to have ready: `/home` **filling up can be grown without reinstalling**, as long as the VG has free space — and it can be done while the machine is running." },
      { h: "LUKS — block-level encryption" },
      { p: "**LUKS (Linux Unified Key Setup)** encrypts **an entire block device** rather than individual files, so everything inside is covered, filenames and directory structure included." },
      { ul: [
        "It stores a **master key** which the passphrase unlocks, so changing the passphrase never re-encrypts the data",
        "It supports several **key slots**, so you can add a spare passphrase",
        "It genuinely protects a stolen disk, and **protects nothing at all while the machine is running and unlocked**"
      ]},
      { note: "`/boot` **must stay unencrypted**, because the bootloader has to read the kernel and initramfs before any code exists that could ask for a passphrase — a chicken and egg problem." },
      { h: "Why split the mount points" },
      { table: { head: ["Mount point", "Split out because"], rows: [
        ["`/var/log`", "A log flood then fills its own volume instead of filling `/` and wedging the system"],
        ["`/home`", "User data separate from the system; reinstall without touching it"],
        ["`/var`", "Packages, caches and databases grow unpredictably"],
        ["`/tmp`", "Everyone's scratch space: bounded, and you can add noexec"],
        ["`/srv`", "Data the services serve, kept apart from system files"],
        ["`swap`", "Overflow memory on disk, usually one to two times RAM"]
      ]}},
      { h: "Where the configuration lives" },
      { table: { head: ["File or directory", "Controls"], rows: [
        ["`/etc/ssh/sshd_config`", "The port, `PermitRootLogin`, SSH authentication"],
        ["`/etc/login.defs`", "Password ageing: `PASS_MAX_DAYS`, `PASS_MIN_DAYS`, `PASS_WARN_AGE`"],
        ["`/etc/security/pwquality.conf`", "Password strength: `minlen`, `ucredit`, `maxrepeat`, `difok`"],
        ["`/etc/pam.d/common-password`", "Where `pam_pwquality` is wired into the PAM stack"],
        ["`/etc/sudoers.d/born2beroot`", "Every sudo rule (edited only through `visudo`)"],
        ["`/var/log/sudo/`", "Input and output recordings of every sudo session"],
        ["`/etc/hostname` and `/etc/hosts`", "The machine name — both must agree"],
        ["root's `crontab`", "The schedule that runs `monitoring.sh` every ten minutes"]
      ]}}
    ],
    architecture: [
      { p: "The order to actually do it in — several steps become dead ends if you swap them." },
      { h: "An order that avoids rework" },
      { table: { head: ["Step", "Do", "Why here"], rows: [
        ["1", "Create the VM and add a NAT port forward for 4242", "You need a way in from the host before SSH can be tested"],
        ["2", "Install Debian with **no desktop environment ticked**", "Ticking a GUI means reinstalling the whole machine"],
        ["3", "Partition by hand: `/boot` plus LUKS plus LVM", "The hardest thing of all to change later"],
        ["4", "Set the hostname to `<login>42`", "Two files must agree"],
        ["5", "Install `sudo`, `ufw`, `openssh-server`, `libpam-pwquality`", "A minimal Debian ships none of them"],
        ["6", "Create the user, the `user42` group, add to `sudo`", "You need an account that can escalate before you close root off"],
        ["7", "SSH on 4242, root refused, `sshd -t`, restart", "Always validate the syntax first"],
        ["8", "UFW: allow 4242 **first**, then enable", "The other order cuts your own leg off"],
        ["9", "Password policy, `chage`, change every password", "The policy is not retroactive"],
        ["10", "sudoers, and create `/var/log/sudo`", "No directory means no logging, silently"],
        ["11", "`monitoring.sh` plus a cron entry every ten minutes", "Last, because it uses everything above"],
        ["12", "Power off, hash the `.vdi`, write `signature.txt`", "Booting again changes the hash immediately"]
      ]}},
      { h: "The service map" },
      { code: String.raw`             host machine
                  |  ssh -p 4242 wiaon-in@127.0.0.1
                  v
       VirtualBox NAT: host 4242 -> guest 4242
                  |
   +--------------v-----------------------------------+
   |  VM: wiaon-in42  (Debian, headless)              |
   |                                                  |
   |  ufw  ---- only 4242 allowed ------> sshd :4242  |
   |                                       |          |
   |  AppArmor confines every process -> limited      |
   |                                       v          |
   |  PAM (pwquality) <---- login/passwd/sudo         |
   |                                       |          |
   |  sudo -> /var/log/sudo/ (input + output)         |
   |                                                  |
   |  cron (root) --every 10 min--> monitoring.sh     |
   |                                    |             |
   |                                    v             |
   |                              wall -> every tty   |
   +--------------------------------------------------+`,
        cap: "Every box in this picture is one line on the grading sheet", lang: "txt" },
      { h: "Users and groups" },
      { code: String.raw`sudo adduser wiaon-in                 # user, home directory and password
sudo groupadd user42                  # the group the subject demands
sudo usermod -aG user42,sudo wiaon-in # -a matters: append, do not replace

groups wiaon-in                       # wiaon-in : wiaon-in sudo user42`,
        cap: "Forget -a and usermod wipes the existing groups, sudo included", lang: "bash" },
      { note: "At the defense you will be told to **create a user and add it to a group live** — rehearse `adduser`, `groupadd` and `usermod -aG` until you need no notes." },
      { h: "The hostname lives in two files" },
      { code: String.raw`sudo hostnamectl set-hostname wiaon-in42
sudo nano /etc/hosts        # 127.0.1.1   wiaon-in42
hostname                    # confirm (some shells need a fresh login for the prompt)`,
        cap: "Change /etc/hostname but forget /etc/hosts and sudo becomes slow, because the machine cannot resolve its own name", lang: "bash" }
    ],
    dataflow: [
      { p: "Two real sequences: what happens at boot, and what happens when somebody connects." },
      { h: "The boot sequence" },
      { code: String.raw`BIOS/UEFI
   -> GRUB reads the kernel and initramfs from /boot     (not encrypted)
      -> initramfs asks for the LUKS passphrase
         -> cryptsetup unlocks sda5 -> sda5_crypt
            -> LVM finds the PV and VG, activates every LV
               -> / is mounted from LVMGroup-root
                  -> systemd (PID 1) takes over
                     -> apparmor.service loads its profiles
                     -> ufw.service installs the netfilter rules
                     -> ssh.service listens on 4242
                     -> cron.service starts counting
                        -> every 10 min: monitoring.sh -> wall -> every tty`,
        cap: "This is the visual answer to 'why can /boot not be encrypted'", lang: "txt" },
      { h: "Why the passphrase comes before LVM" },
      { p: "Because **LUKS sits under LVM** — until it is unlocked, LVM cannot even see a physical volume, only what looks like random data. Reverse the layers (LVM first, each LV encrypted) and you would type a passphrase per volume." },
      { h: "What happens when somebody connects" },
      { code: String.raw`ssh -p 4242 newguy@127.0.0.1
   -> ufw: 4242 is on the allow list -> through
      (any other port: silently DROPped, no answer at all)
   -> sshd: checks PermitRootLogin -> user root is refused immediately
      -> PAM: pam_unix checks the password against /etc/shadow
              pam_pwquality runs only when a password is SET, not at login
              is the account past its chage expiry? then force a change first
         -> a shell
            -> newguy types sudo ...
               -> sudoers: in the sudo group?
                  requiretty: is there a terminal?
                  secure_path: the caller's PATH is discarded
                  three password attempts, then the custom message
               -> run the command, and record it under /var/log/sudo/`,
        cap: "One login passes through four separately graded gates", lang: "txt" },
      { h: "When monitoring.sh runs, and where each number comes from" },
      { table: { head: ["Value", "Source", "Note"], rows: [
        ["Architecture and kernel", "`uname -a`", ""],
        ["Physical CPUs", "`grep 'physical id' /proc/cpuinfo | sort -u | wc -l`", "Counts **sockets**"],
        ["vCPUs", "`grep -c '^processor' /proc/cpuinfo`", "Counts **logical cores**"],
        ["RAM", "`free -m`", "The percentage is computed by hand"],
        ["Disk", "`df -m --total`", "Every non-tmpfs mount"],
        ["CPU load", "`top -bn1`", "100 minus idle"],
        ["Last boot", "`who -b`", ""],
        ["Is LVM in use", "`lsblk | grep -c lvm`", "Greater than 0 means yes"],
        ["Established TCP", "`ss -ta | grep -c ESTAB`", ""],
        ["Logged-in users", "`users`", "Deduplicated with `sort -u`"],
        ["IP and MAC", "`hostname -I`, `ip link`", ""],
        ["sudo command count", "`journalctl _COMM=sudo | grep -c COMMAND`", "Or read `/var/log/sudo/sudo.log`"]
      ]}},
      { note: "`top -bn1` **reports its first sample as an average since boot**, so the number usually looks suspiciously low — say so if asked, and offer `mpstat 1 1` as the honest alternative." },
      { h: "Who wall reaches" },
      { p: "`wall` writes to **every open terminal of every logged-in user** (except anyone who ran `mesg n`) — which is why it has to run from root's cron rather than an ordinary user's." }
    ],
    implementation: [
      { p: "The real commands, in the order to run them." },
      { h: "1) Make the VM reachable from the host" },
      { code: String.raw`VirtualBox -> Settings -> Network -> NAT -> Advanced -> Port Forwarding
    Name: ssh   Protocol: TCP
    Host IP: 127.0.0.1   Host Port: 4242
    Guest IP: (empty)    Guest Port: 4242

# from the host, once sshd is configured
ssh -p 4242 wiaon-in@127.0.0.1`,
        cap: "Without the forward you cannot connect from the host, no matter how correct the guest is", lang: "bash" },
      { h: "2) Install what a minimal Debian lacks" },
      { code: String.raw`su -
apt update && apt upgrade -y
apt install -y sudo ufw openssh-server libpam-pwquality
# worth having: vim or nano, and net-tools if you want ifconfig`,
        cap: "You still need su here, because your user is not in the sudo group yet", lang: "bash" },
      { h: "3) User, groups and hostname" },
      { code: String.raw`groupadd user42
usermod -aG user42,sudo wiaon-in
hostnamectl set-hostname wiaon-in42
sed -i 's/^127.0.1.1.*/127.0.1.1\twiaon-in42/' /etc/hosts

groups wiaon-in       # must list sudo and user42
exit                  # leave su and log in again for the groups to apply`,
        cap: "A group change takes effect on the next login, not immediately", lang: "bash" },
      { h: "4) SSH on port 4242" },
      { code: String.raw`sudo nano /etc/ssh/sshd_config
    Port 4242
    PermitRootLogin no

sudo sshd -t                       # always validate first
sudo systemctl restart ssh
sudo ss -tlnp | grep 4242          # sshd must be listening`,
        cap: "sshd -t is what stops a typo from leaving you with a machine you cannot ssh into", lang: "bash" },
      { note: "**Newer Debian starts sshd through socket activation.** If the port does not move after editing `sshd_config`, run `sudo systemctl disable --now ssh.socket` and `sudo systemctl enable --now ssh` so the service reads its own config." },
      { h: "5) UFW — rule first, enable second" },
      { code: String.raw`sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 4242            # <- always before enable
sudo ufw enable

sudo ufw status numbered       # 4242 and nothing else
systemctl is-enabled ufw       # enabled means it survives a reboot`,
        cap: "Enabling before adding the rule cuts your own leg off if you are working over ssh", lang: "bash" },
      { h: "6) The password policy — two files" },
      { code: String.raw`# /etc/login.defs  (ageing)
PASS_MAX_DAYS   30
PASS_MIN_DAYS   2
PASS_WARN_AGE   7`, cap: "Applies only to accounts created after this point", lang: "bash" },
      { code: String.raw`# /etc/security/pwquality.conf  (strength)
minlen      = 10
ucredit     = -1      # at least one uppercase
lcredit     = -1      # at least one lowercase
dcredit     = -1      # at least one digit
maxrepeat   = 3       # no more than 3 identical consecutive characters
usercheck   = 1       # must not contain the username
difok       = 7       # at least 7 characters not in the previous password
enforce_for_root`,
        cap: "The minus sign confuses everyone: -1 means 'require at least one', while a positive value would merely give credit for having some", lang: "bash" },
      { code: String.raw`# existing accounts are not updated retroactively
sudo chage -M 30 -m 2 -W 7 wiaon-in
sudo chage -M 30 -m 2 -W 7 root
sudo passwd wiaon-in
sudo passwd root

chage -l wiaon-in            # <- this is what the evaluator reads`,
        cap: "Editing the file is not enough: run chage and change every password, root included", lang: "bash" },
      { h: "7) Hardened sudoers" },
      { code: String.raw`sudo mkdir -p /var/log/sudo          # no directory means no logging
sudo visudo -f /etc/sudoers.d/born2beroot`,
        cap: "Only ever edit through visudo: it validates the syntax, and a broken sudoers locks sudo for everybody", lang: "bash" },
      { code: String.raw`Defaults        passwd_tries=3
Defaults        badpass_message="Wrong password. Try again, carefully."
Defaults        logfile="/var/log/sudo/sudo.log"
Defaults        log_input, log_output
Defaults        iolog_dir="/var/log/sudo"
Defaults        requiretty
Defaults        secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin"`,
        cap: "All five required rules in one file", lang: "bash" },
      { table: { head: ["Line", "What it prevents"], rows: [
        ["`passwd_tries=3`", "Unlimited password guessing in one invocation"],
        ["`requiretty`", "sudo from a process with no terminal — this blocks a whole class of scripted privilege escalation"],
        ["`secure_path`", "sudo ignores the caller's `PATH`, so a planted `ls` earlier in it can never run as root"],
        ["`log_input, log_output`", "Records the whole session; replay it with `sudoreplay`"]
      ]}},
      { h: "8) monitoring.sh" },
      { code: String.raw`#!/bin/bash
arch=$(uname -a)
pcpu=$(grep "physical id" /proc/cpuinfo | sort -u | wc -l)
vcpu=$(grep -c "^processor" /proc/cpuinfo)
mem=$(free -m | awk '$1 == "Mem:" {printf("%d/%dMB (%.2f%%)", $3, $2, $3*100/$2)}')
disk=$(df -m --output=used,size,pcent --total | awk '$0 ~ /total/ {printf("%d/%dMB (%s)", $1, $2, $3)}')
cpul=$(top -bn1 | awk '/^%Cpu/ {printf("%.1f%%", 100 - $8)}')
boot=$(who -b | awk '{print $3" "$4}')
lvm=$(if [ "$(lsblk | grep -c lvm)" -gt 0 ]; then echo yes; else echo no; fi)
tcp=$(ss -ta | grep -c ESTAB)
ulog=$(users | tr ' ' '\n' | sort -u | wc -l)
ip=$(hostname -I | awk '{print $1}')
mac=$(ip link show | awk '/ether/ {print $2; exit}')
cmds=$(journalctl _COMM=sudo | grep -c COMMAND)

wall "	#Architecture: $arch
	#Physical CPU: $pcpu
	#vCPU: $vcpu
	#Memory Usage: $mem
	#Disk Usage: $disk
	#CPU load: $cpul
	#Last boot: $boot
	#LVM use: $lvm
	#TCP Connections: $tcp ESTABLISHED
	#User log: $ulog
	#Network: IP $ip ($mac)
	#Sudo: $cmds cmd"`,
        cap: "Be ready to justify every line — the evaluator really does go through them one at a time", lang: "bash" },
      { code: String.raw`sudo cp monitoring.sh /usr/local/bin/
sudo chmod +x /usr/local/bin/monitoring.sh
sudo crontab -e
    */10 * * * * /usr/local/bin/monitoring.sh

sudo crontab -l                 # confirm it is in root's crontab`,
        cap: "It must be root's crontab, because hostname -I, ss and the sudo log all need privileges", lang: "bash" },
      { h: "9) Power off and take the signature" },
      { code: String.raw`sudo shutdown -h now                    # fully powered off first
sha1sum ~/'VirtualBox VMs'/wiaon-in42/wiaon-in42.vdi > signature.txt
git add README.md signature.txt && git commit -m "born2beroot" && git push`,
        cap: "Do not boot the VM again afterwards, or the hash no longer matches and the grade is zero", lang: "bash" }
    ],
    tricks: [
      { h: "The gotchas that cost the most time" },
      { table: { head: ["Symptom", "Real cause", "Fix"], rows: [
        ["`sshd_config` edited but the port does not move", "Newer Debian uses socket activation", "`systemctl disable --now ssh.socket`, then enable `ssh`"],
        ["ufw enabled and ssh dies instantly", "Enabled before the 4242 rule existed", "Get in through the VirtualBox console and `ufw allow 4242`"],
        ["Every new password is refused", "`difok=7` plus `usercheck` are stricter than they look", "Read pwquality's message: it names the rule you broke"],
        ["`chage -l` still shows 99999", "`login.defs` is not retroactive", "`sudo chage -M 30 -m 2 -W 7 <user>` per account"],
        ["Nothing appears in `/var/log/sudo/`", "`mkdir -p /var/log/sudo` was skipped", "Create the directory and use sudo again"],
        ["cron never fires", "It went into a normal user's crontab, or the script is not executable", "`sudo crontab -e`, and use an absolute path"],
        ["`monitoring.sh` prints errors", "Run without privileges, or a command is missing", "Run from root's cron and check `ss` and `journalctl` exist"],
        ["The signature no longer matches at the defense", "The VM was booted after hashing", "Hash again with the machine off and push before the evaluation"],
        ["`sudo` takes several seconds", "`/etc/hosts` has no entry for the new hostname", "Add `127.0.1.1  <hostname>`"]
      ]}},
      { h: "Stopping monitoring.sh without editing it" },
      { p: "This is asked nearly every time, and answering 'I would edit the script' fails the question as posed. Three answers work:" },
      { table: { head: ["Approach", "Command", "Trade-off"], rows: [
        ["Comment the crontab line", "`sudo crontab -e`, put a `#` in front", "The most surgical; nothing else is affected"],
        ["Stop the cron service", "`sudo systemctl stop cron`", "Honest, but it stops every other job too"],
        ["Remove the execute bit", "`sudo chmod -x /usr/local/bin/monitoring.sh`", "The file's content is untouched, exactly as asked"]
      ]}},
      { h: "The questions hidden inside the script" },
      { ul: [
        "**Physical versus virtual CPU** — `physical id` counts sockets, `processor` counts logical cores; on a one-socket VM they differ and the evaluator checks that you know which is which",
        "`top -bn1`**'s first sample is an average since boot**, not the instantaneous load",
        "**Counting sudo commands** from `/var/log/sudo/sudo.log` only works once your logging does; `journalctl _COMM=sudo` works from the first boot",
        "`wall` **needs a leading tab** on each line to line up like the example in the subject"
      ]},
      { h: "Getting the README right" },
      { ul: [
        "The very first line must be italicised, exactly as the subject dictates: *This project has been created as part of the 42 curriculum by ...*",
        "It needs **Description**, **Instructions** and **Resources** sections, including how AI was used and for what",
        "It needs **all four comparisons**: Debian/Rocky, AppArmor/SELinux, UFW/firewalld, VirtualBox/UTM",
        "Write genuine trade-offs, not marketing lines — the evaluator reads it aloud and asks follow-up questions from it"
      ]},
      { h: "Bonus, only once the mandatory part is perfect" },
      { ul: [
        "Partition to the subject's full layout (`/`, `/home`, `/var`, `/srv`, `/tmp`, `/var/log`, swap)",
        "**lighttpd plus MariaDB plus PHP** serving WordPress — NGINX and Apache2 are excluded",
        "One more service of your own choosing that you can justify — `fail2ban` pairs naturally with an exposed sshd",
        "Every extra port must be opened in UFW deliberately, never by turning the firewall off"
      ]},
      { note: "**The bonus is assessed only if the mandatory part is flawless** — one failed requirement there and the bonus is not looked at at all." }
    ],
    eval: [
      { p: "The questions evaluators really ask — Born2beRoot is the most spoken-answer project in common core." },
      { qa: [
        { q: "What is a virtual machine, and why a VM here rather than a container?",
          a: "A VM emulates a whole machine and runs its own kernel, while a container shares the host's. Here we configure partitions, a bootloader and kernel modules, none of which a container can do, because it has no kernel of its own." },
        { q: "Why Debian?",
          a: "Community-run, an enormous package set, excellent documentation, and the subject recommends it for a first server. Rocky is a RHEL clone that shops actually run, but it also demands a working SELinux configuration, which is far more complex." },
        { q: "How does `apt` differ from `aptitude`?",
          a: "Both sit on `dpkg`, the low-level installer. `apt` is a single command for everyday work; `aptitude` is a full manager with a TUI that **offers several resolutions when dependencies conflict** instead of simply failing." },
        { q: "What is AppArmor, and what is it doing right now?",
          a: "It is Mandatory Access Control with rules attached to **file paths**: the kernel limits what each program may touch according to its profile, even when that program runs as root — unlike normal permissions, which the owner can change. Check it with `aa-status`." },
        { q: "What is LVM and why use it?",
          a: "LVM adds a layer between physical partitions and filesystems: a PV is a partition given to LVM, a VG is the pool of PVs, an LV is a slice carved out. It lets you grow, shrink or move a filesystem while the machine runs, with no reinstall." },
        { q: "Why is `/boot` not encrypted?",
          a: "The bootloader must read the kernel and initramfs before any code exists that could ask for the LUKS passphrase — encrypt `/boot` and nothing can read it in the first place." },
        { q: "What does LUKS protect against, and what does it not?",
          a: "It protects a stolen disk or a stolen machine, because the data is unreadable until unlocked. It protects **nothing while the machine is running and unlocked**, since the filesystems are mounted normally at that point." },
        { q: "Why is SSH on port 4242?",
          a: "Security through obscurity: it is no stronger cryptographically, but it removes nearly all the bots sweeping port 22, leaving logs clean enough to spot a deliberate attack. The genuine hardening is refusing root login." },
        { q: "Why refuse root login over SSH?",
          a: "The attacker must now guess a username as well as a password, then still pass sudo, and every privileged action is recorded against a person rather than being an anonymous root session." },
        { q: "What is UFW, and how does it differ from firewalld?",
          a: "Both are front ends to the kernel's netfilter. UFW aims at simplicity with one-line commands; firewalld adds zones based on how trusted a network is, and separates runtime from permanent rules — more flexible, more to explain." },
        { q: "Which ports are open right now? Show me.",
          a: "`sudo ufw status numbered` lists 4242 and nothing else, and `sudo ss -tlnp` confirms sshd is really listening there." },
        { q: "What is your password policy and where is it configured?",
          a: "Ageing lives in `/etc/login.defs` (30/2/7 days) and strength in `/etc/security/pwquality.conf` (at least 10 characters, upper, lower and a digit, no more than three identical in a row, no username inside, and seven characters different from the last one). Verify a real account with `chage -l`." },
        { q: "Why did existing accounts not pick up `login.defs`?",
          a: "Those values are copied into `/etc/shadow` when an account is **created**, so existing accounts need `chage` applied by hand, followed by a password change on every account including root." },
        { q: "What does `ucredit = -1` mean?",
          a: "A negative value means **require at least that many** — so `-1` requires at least one uppercase letter. A positive value would merely give credit for having some, which is not a requirement." },
        { q: "What are `requiretty` and `secure_path` for in sudoers?",
          a: "`requiretty` refuses sudo from a process with no terminal, blocking a whole class of scripted privilege escalation. `secure_path` makes sudo ignore the caller's `PATH`, so a planted command earlier in it can never be run as root." },
        { q: "Where are the sudo logs and how do you read them?",
          a: "In `/var/log/sudo/`, as the subject requires, with `log_input, log_output` recording whole sessions — replay one with `sudo sudoreplay -l` and pick a session. The directory must exist first, or nothing is written at all." },
        { q: "Explain the CPU counting lines in `monitoring.sh`.",
          a: "`grep 'physical id' /proc/cpuinfo | sort -u | wc -l` counts **sockets**, while** `grep -c '^processor'` **counts** logical cores**, which includes hyper-threading — so on this VM the two numbers differ." },
        { q: "Stop monitoring.sh without editing the file.",
          a: "Three ways: comment the line out with `sudo crontab -e`, `sudo systemctl stop cron` (which also stops every other job), or `sudo chmod -x /usr/local/bin/monitoring.sh`, which leaves the file's content untouched." },
        { q: "What is cron, and how do you read `*/10 * * * *`?",
          a: "cron is the system's scheduler. The five fields are minute, hour, day of month, month and day of week — `*/10` in the minute field means every ten minutes, and the remaining `*` mean unrestricted." },
        { q: "Change the hostname right now.",
          a: "`sudo hostnamectl set-hostname <new>`, then update the `127.0.1.1` line in `/etc/hosts` to match — skip that and sudo becomes slow because the machine cannot resolve its own name. Confirm with `hostname`." },
        { q: "Why must the signature be taken with the machine off?",
          a: "The `.vdi` is written to every time the VM runs, so its sha1 changes on the next boot. Hash it fully powered off and do not start it before the evaluation, or the submitted value no longer matches the machine and the grade is zero." }
      ]},
      { h: "Checklist before the defense" },
      { ul: [
        "`hostname` is login plus 42, and `cat /etc/os-release` is the latest stable Debian",
        "`lsblk` shows `crypt` then `lvm`, with at least two encrypted partitions",
        "`aa-status` shows profiles loaded, and `systemctl is-enabled apparmor` says enabled",
        "`sudo ufw status` is active with only 4242, and `systemctl is-enabled ufw` says enabled",
        "`sudo ss -tlnp | grep 4242` shows sshd, and `ssh -p 4242 root@...` is refused",
        "`groups <login>` lists both `sudo` and `user42`",
        "`chage -l <login>` shows 30 / 2 / 7, and so does root",
        "A password that breaks the policy really is rejected — be ready to demonstrate it",
        "`ls /var/log/sudo/` has files, and three wrong passwords show your custom message",
        "`sudo crontab -l` has the `*/10` line, and a `wall` message really appears after ten minutes",
        "You can create a user, create a group and change the hostname live, without notes",
        "`signature.txt` matches the current `.vdi`, and no snapshot exists"
      ]},
      { links: [
        { label: "Debian Administrator's Handbook", url: "https://debian-handbook.info/browse/stable/", note: "The official book: apt, systemd, users and permissions, security" },
        { label: "Debian Wiki — LVM", url: "https://wiki.debian.org/LVM", note: "PV/VG/LV and the real grow and shrink commands" },
        { label: "cryptsetup / LUKS FAQ", url: "https://gitlab.com/cryptsetup/cryptsetup/-/wikis/FrequentlyAskedQuestions", note: "Master keys, key slots, and what LUKS cannot protect" },
        { label: "AppArmor wiki (Ubuntu)", url: "https://wiki.ubuntu.com/AppArmor", note: "Path-based profiles, aa-status, enforce versus complain" },
        { label: "UFW — Ubuntu community help", url: "https://help.ubuntu.com/community/UFW", note: "default deny, allow, status numbered" },
        { label: "sudoers(5) manual", url: "https://www.sudo.ws/docs/man/sudoers.man/", note: "Every Defaults used in this project is documented here" },
        { label: "pwquality.conf(5)", url: "https://man.archlinux.org/man/pwquality.conf.5", note: "What the negative credits mean, plus maxrepeat and difok" },
        { label: "crontab(5)", url: "https://man7.org/linux/man-pages/man5/crontab.5.html", note: "The five fields and the meaning of */10" }
      ]}
    ]
  }
});

/* ============================================================
   คำสั่งทั้งหมดที่ต้องพิมพ์จริง + วิธีประกอบ monitoring.sh ทีละบรรทัด
   อ้างอิงลำดับและตัวสคริปต์จากคู่มือ noreply.gitbook.io/born2beroot
   ต่อท้ายทั้งฝั่งไทยและอังกฤษพร้อมกัน จำนวนบล็อกจึงยังตรงกัน
   ============================================================ */
(function () {
  var TH = {}, EN = {};

  TH.implementation = [
    { h: "อธิบายทีละคำสั่ง — ทุกตัวที่ต้องพิมพ์จริง" },
    { p: "ตารางนี้คือคำสั่งทั้งหมดของโปรเจกต์ เรียงตามที่ได้ใช้จริง **ธงแต่ละตัวมีเหตุผล** และผู้ตรวจถามได้ทุกตัว — จำคำสั่งอย่างเดียวไม่พอ ต้องรู้ว่าธงนั้นเปลี่ยนอะไร" },
    { table: { head: ["คำสั่ง", "ทำอะไร", "ธงที่ต้องอธิบายได้"], rows: [
      ["`apt update`", "ดึง **รายการแพ็กเกจ** เวอร์ชันล่าสุดจาก repository", "ยังไม่ติดตั้งอะไรเลย แค่รีเฟรชสารบัญ"],
      ["`apt upgrade`", "อัปเกรดแพ็กเกจที่ติดตั้งไว้แล้ว", "`-y` ตอบ yes ล่วงหน้า"],
      ["`apt install <pkg>`", "ติดตั้งแพ็กเกจใหม่", "`--no-install-recommends` ไม่ลากของที่แค่ 'แนะนำ' มาด้วย เครื่องจะเบากว่า"],
      ["`adduser <name>`", "สร้างผู้ใช้ + home + ตั้งรหัสผ่านแบบถาม-ตอบ", "เป็นสคริปต์ห่อ `useradd` ที่ทำงานให้ครบกว่า"],
      ["`groupadd <group>`", "สร้างกลุ่มใหม่", "`user42` ที่ subject บังคับ"],
      ["`usermod -aG <g> <user>`", "เพิ่มผู้ใช้เข้ากลุ่มเสริม", "`-a` **= append** ลืมแล้วกลุ่มเดิมหายหมดรวม `sudo`"],
      ["`groups <user>`", "ดูว่าผู้ใช้อยู่กลุ่มไหนบ้าง", "มีผลหลัง login ใหม่เท่านั้น"],
      ["`hostnamectl set-hostname <name>`", "เปลี่ยนชื่อเครื่องแบบถาวร", "ต้องแก้ `/etc/hosts` ตามด้วย"],
      ["`systemctl restart <svc>`", "รีสตาร์ตบริการ", "อ่านคอนฟิกใหม่"],
      ["`systemctl enable <svc>`", "ให้บริการขึ้นเองตอนบูต", "`--now` = enable แล้วสตาร์ตเลย"],
      ["`systemctl is-enabled <svc>`", "ถามว่าจะขึ้นเองตอนบูตไหม", "**ต่างจาก** `is-active` ที่ถามว่าตอนนี้รันอยู่ไหม"],
      ["`ss -tlnp`", "ดูพอร์ตที่มีโปรแกรมฟังอยู่", "`t` tcp · `l` listening · `n` ไม่แปลงเลขพอร์ตเป็นชื่อ · `p` บอกว่าโปรเซสไหน (ต้อง sudo)"],
      ["`ufw allow <port>`", "เปิดพอร์ตในไฟร์วอลล์", "ทำ **ก่อน** `ufw enable` เสมอ"],
      ["`ufw status numbered`", "ดูกฎพร้อมเลขลำดับ", "เลขนี้เอาไว้ `ufw delete <n>`"],
      ["`chage -l <user>`", "ดูวันหมดอายุรหัสผ่านของบัญชี", "**นี่คือสิ่งที่ผู้ตรวจอ่าน** ไม่ใช่ `/etc/login.defs`"],
      ["`chage -M 30 -m 2 -W 7 <user>`", "ตั้งอายุรหัสผ่านให้บัญชีที่มีอยู่แล้ว", "`-M` สูงสุด · `-m` ต่ำสุด · `-W` เตือนล่วงหน้า"],
      ["`visudo -f /etc/sudoers.d/<file>`", "แก้ไฟล์กฎ sudo", "**ตรวจ syntax ให้ก่อนเซฟ** — sudoers พัง = sudo ใช้ไม่ได้ทั้งเครื่อง"],
      ["`crontab -u root -e`", "แก้ตารางงานของ root", "`-u root` ระบุชัดว่าเป็นของใคร ปลอดภัยกว่าเดาจากผู้ใช้ปัจจุบัน"],
      ["`lsblk`", "ผังบล็อกอุปกรณ์ทั้งเครื่อง", "หลักฐานของ LUKS + LVM ที่ผู้ตรวจดูก่อนอย่างอื่น"],
      ["`aa-status`", "สถานะ AppArmor และโปรไฟล์ที่โหลดอยู่", "คู่กับ `systemctl is-enabled apparmor`"],
      ["`sha1sum <file>`", "คำนวณลายเซ็นของดิสก์เสมือน", "ต้องทำตอนเครื่อง **ปิด** เท่านั้น"]
    ]}},
    { h: "apt — สามคำสั่งที่คนสับสนกันบ่อย" },
    { code: String.raw`sudo apt update                 # รีเฟรช 'สารบัญ' ของ repository เท่านั้น
sudo apt upgrade -y             # อัปเกรดของที่ติดตั้งไว้แล้ว
sudo apt install -y sudo ufw openssh-server libpam-pwquality

apt list --installed | grep ufw # ยืนยันว่าติดตั้งแล้วจริง
dpkg -l | grep -iE 'xserver|wayland'   # ต้องว่าง = ไม่มี GUI`,
      cap: "update ไม่ได้อัปเกรดอะไรเลย มันแค่ทำให้ apt รู้ว่ามีเวอร์ชันใหม่อะไรบ้าง", lang: "bash" },
    { h: "ผู้ใช้และกลุ่ม — กับดักอยู่ที่ธง -a" },
    { code: String.raw`sudo adduser wiaon-in           # ถามรหัสผ่านและข้อมูลทีละอย่าง
sudo groupadd user42
sudo usermod -aG user42,sudo wiaon-in

groups wiaon-in                 # wiaon-in : wiaon-in sudo user42
getent group user42             # ดูสมาชิกของกลุ่มจากอีกทาง
id wiaon-in                     # uid, gid และกลุ่มทั้งหมดในบรรทัดเดียว`,
      cap: "usermod -G (ไม่มี a) จะ *แทนที่* รายชื่อกลุ่มทั้งหมด — เผลอแล้วหลุดจาก sudo ทันที", lang: "bash" },
    { h: "systemctl — active ไม่เท่ากับ enabled" },
    { code: String.raw`sudo systemctl status ssh       # ตอนนี้เป็นยังไง (q ออก)
sudo systemctl restart ssh      # อ่านคอนฟิกใหม่
sudo systemctl enable ssh       # ให้ขึ้นเองตอนบูต
systemctl is-active ssh         # active   <- ตอนนี้รันอยู่
systemctl is-enabled ssh        # enabled  <- บูตใหม่แล้วยังขึ้น`,
      cap: "ผู้ตรวจอาจสั่งรีบูตแล้วดูว่า ufw กับ ssh ยังขึ้นเองไหม — enabled คือคำตอบ", lang: "bash" },
    { h: "monitoring.sh ตามคู่มือ gitbook — ประกอบทีละบรรทัด" },
    { p: "สคริปต์ชุดนี้เป็นรุ่นที่ใช้กันแพร่หลายที่สุด (จาก **noreply.gitbook.io/born2beroot**) ต่างจากรุ่นในหมวดก่อนตรงที่ใช้** `vmstat` **วัด CPU และ** `free --mega` **แทน** `free -m` **—** ทั้งสองรุ่นถูกทั้งคู่** แต่ต้องอธิบายให้ได้ว่าบรรทัดที่เขียนทำอะไร" },
    { code: String.raw`#!/bin/bash

arch=$(uname -a)
cpuf=$(grep "physical id" /proc/cpuinfo | wc -l)
cpuv=$(grep "processor" /proc/cpuinfo | wc -l)`,
      cap: "บล็อกที่ 1: สถาปัตยกรรมและจำนวน CPU", lang: "bash" },
    { table: { head: ["บรรทัด", "อ่านว่าอะไร"], rows: [
      ["`uname -a`", "`-a` = all: ชื่อ kernel, hostname, เวอร์ชัน, สถาปัตยกรรม รวดเดียว"],
      ["`grep \"physical id\" /proc/cpuinfo | wc -l`", "`/proc/cpuinfo` มีหนึ่งบล็อกต่อหนึ่ง core; บรรทัด `physical id` บอกว่าอยู่ซ็อกเก็ตไหน · `wc -l` นับบรรทัด"],
      ["`grep \"processor\" /proc/cpuinfo | wc -l`", "นับ **core เชิงตรรกะ** ซึ่งคือจำนวน vCPU ที่ VM มองเห็น"]
    ]}},
    { note: "**ข้อควรระวัง:** `grep \"physical id\" | wc -l` นับ *ทุกบรรทัด* ไม่ใช่จำนวนซ็อกเก็ตที่ไม่ซ้ำ บน VM ซ็อกเก็ตเดียวหลาย core ตัวเลขจะเท่ากับ vCPU — ถ้าอยากได้จำนวนซ็อกเก็ตจริงต้องเติม `| sort -u` ก่อน `wc -l` เตรียมคำตอบข้อนี้ไว้ เพราะเป็นคำถามที่ถามบ่อย" },
    { code: String.raw`ram_total=$(free --mega | awk '$1 == "Mem:" {print $2}')
ram_use=$(free --mega | awk '$1 == "Mem:" {print $3}')
ram_percent=$(free --mega | awk '$1 == "Mem:" {printf("%.2f"), $3/$2*100}')`,
      cap: "บล็อกที่ 2: หน่วยความจำ", lang: "bash" },
    { table: { head: ["ส่วนประกอบ", "อ่านว่าอะไร"], rows: [
      ["`free --mega`", "รายงานหน่วยความจำเป็นเมกะไบต์ฐานสิบ (10^6) ส่วน `free -m` เป็นเมบิไบต์ (2^20) ตัวเลขจึงต่างกันเล็กน้อย"],
      ["`awk '$1 == \"Mem:\"'`", "เลือกเฉพาะบรรทัดที่คอลัมน์แรกคือ `Mem:` ข้ามหัวตารางและบรรทัด swap"],
      ["`{print $2}` / `{print $3}`", "คอลัมน์ 2 คือ total คอลัมน์ 3 คือ used"],
      ["`printf(\"%.2f\"), $3/$2*100`", "คิดเปอร์เซ็นต์เอง awk ไม่มีให้สำเร็จรูป"]
    ]}},
    { code: String.raw`disk_total=$(df -m | grep "/dev/" | grep -v "/boot" | awk '{disk_t += $2} END {printf ("%.1fGb\n"), disk_t/1024}')
disk_use=$(df -m | grep "/dev/" | grep -v "/boot" | awk '{disk_u += $3} END {print disk_u}')
disk_percent=$(df -m | grep "/dev/" | grep -v "/boot" | awk '{disk_u += $3} {disk_t += $2} END {printf("%d"), disk_u/disk_t*100}')`,
      cap: "บล็อกที่ 3: พื้นที่ดิสก์", lang: "bash" },
    { table: { head: ["ส่วนประกอบ", "อ่านว่าอะไร"], rows: [
      ["`df -m`", "พื้นที่ว่างของทุก filesystem หน่วยเป็น MB"],
      ["`grep \"/dev/\"`", "เอาเฉพาะอุปกรณ์จริง ตัด `tmpfs`, `udev` ที่อยู่ใน RAM ทิ้ง"],
      ["`grep -v \"/boot\"`", "`-v` = กลับเงื่อนไข ตัด `/boot` ออกเพราะไม่ใช่พื้นที่ที่ผู้ใช้ใช้"],
      ["`awk '{disk_t += $2} END {...}'`", "บวกสะสมทุกบรรทัด แล้วพิมพ์ครั้งเดียวใน `END`"],
      ["`disk_t/1024`", "แปลง MB เป็น GB"]
    ]}},
    { code: String.raw`cpul=$(vmstat 1 2 | tail -1 | awk '{printf $15}')
cpu_op=$(expr 100 - $cpul)
cpu_fin=$(printf "%.1f" $cpu_op)`,
      cap: "บล็อกที่ 4: โหลด CPU — จุดที่คนอธิบายไม่ได้บ่อยที่สุด", lang: "bash" },
    { table: { head: ["ส่วนประกอบ", "อ่านว่าอะไร"], rows: [
      ["`vmstat 1 2`", "เก็บตัวอย่าง 2 ครั้ง ห่างกัน 1 วินาที — **รอบแรกเป็นค่าเฉลี่ยตั้งแต่บูต จึงต้องเอารอบที่สอง**"],
      ["`tail -1`", "หยิบบรรทัดสุดท้าย ซึ่งคือตัวอย่างรอบที่สอง"],
      ["`awk '{printf $15}'`", "คอลัมน์ที่ 15 คือ `id` (idle) หน่วยเปอร์เซ็นต์"],
      ["`expr 100 - $cpul`", "โหลด = 100 ลบ idle"],
      ["`printf \"%.1f\"`", "จัดรูปให้เหลือทศนิยมตำแหน่งเดียว"]
    ]}},
    { note: "นี่คือเหตุผลที่ต้องใช้ `vmstat 1 2` ไม่ใช่ `vmstat` เปล่า ๆ — ค่าที่ได้จากการเรียกครั้งเดียวคือค่าเฉลี่ยตั้งแต่บูตเครื่อง ซึ่งแทบไม่ขยับเลยและอธิบายไม่ได้ว่าเป็นโหลด 'ตอนนี้'" },
    { code: String.raw`lb=$(who -b | awk '$1 == "system" {print $3 " " $4}')
lvmu=$(if [ $(lsblk | grep "lvm" | wc -l) -gt 0 ]; then echo yes; else echo no; fi)
tcpc=$(ss -ta | grep ESTAB | wc -l)
ulog=$(users | wc -w)`,
      cap: "บล็อกที่ 5: บูตล่าสุด, LVM, การเชื่อมต่อ, ผู้ใช้", lang: "bash" },
    { table: { head: ["ส่วนประกอบ", "อ่านว่าอะไร"], rows: [
      ["`who -b`", "`-b` = boot time พิมพ์ว่า `system boot  2025-08-10 09:12`"],
      ["`awk '$1 == \"system\" {print $3 \" \" $4}'`", "หยิบเฉพาะวันที่กับเวลา"],
      ["`lsblk | grep \"lvm\" | wc -l`", "มีบรรทัดที่ชนิดเป็น `lvm` ไหม — มากกว่า 0 แปลว่ากำลังใช้ LVM อยู่"],
      ["`ss -ta | grep ESTAB | wc -l`", "`-t` tcp · `-a` ทุกสถานะ แล้วกรองเฉพาะที่เชื่อมต่อสำเร็จ"],
      ["`users | wc -w`", "`users` พิมพ์ชื่อผู้ใช้ที่ล็อกอินอยู่คั่นด้วยช่องว่าง · `-w` นับ **คำ**"]
    ]}},
    { note: "`users | wc -w` นับ **จำนวน session ไม่ใช่จำนวนคน** — เปิด 3 terminal คนเดียวก็ได้ 3 ถ้าอยากได้จำนวนคนที่ไม่ซ้ำต้อง `users | tr ' ' '\\n' | sort -u | wc -l` เลือกทางไหนก็ได้ แต่ต้องรู้ว่าเลือกอะไรอยู่" },
    { code: String.raw`ip=$(hostname -I)
mac=$(ip link | grep "link/ether" | awk '{print $2}')
cmnd=$(journalctl _COMM=sudo | grep COMMAND | wc -l)`,
      cap: "บล็อกที่ 6: เครือข่ายและจำนวนคำสั่ง sudo", lang: "bash" },
    { table: { head: ["ส่วนประกอบ", "อ่านว่าอะไร"], rows: [
      ["`hostname -I`", "`-I` ตัวใหญ่ = พิมพ์ IP ทุกอันของเครื่อง (ไม่รวม loopback)"],
      ["`ip link`", "แสดงอินเทอร์เฟซชั้น link ทุกอัน"],
      ["`grep \"link/ether\"`", "เอาเฉพาะบรรทัดที่มี MAC ของอีเทอร์เน็ต"],
      ["`journalctl _COMM=sudo`", "อ่าน journal เฉพาะรายการที่โปรแกรมชื่อ `sudo` เป็นคนเขียน"],
      ["`grep COMMAND | wc -l`", "หนึ่งบรรทัด `COMMAND=` คือหนึ่งคำสั่งที่ถูกรันด้วย sudo"]
    ]}},
    { code: String.raw`wall "	#Architecture: $arch
	#CPU physical: $cpuf
	#vCPU: $cpuv
	#Memory Usage: $ram_use/` + "$" + String.raw`{ram_total}MB ($ram_percent%)
	#Disk Usage: $disk_use/$disk_total ($disk_percent%)
	#CPU load: $cpu_fin%
	#Last boot: $lb
	#LVM use: $lvmu
	#Connections TCP: $tcpc ESTABLISHED
	#User log: $ulog
	#Network: IP $ip($mac)
	#Sudo: $cmnd cmd"`,
      cap: "บล็อกสุดท้าย: broadcast — แต่ละบรรทัดขึ้นต้นด้วย tab จริง ไม่ใช่ช่องว่าง", lang: "bash" },
    { h: "ติดตั้งสคริปต์แล้วตั้งเวลา" },
    { code: String.raw`sudo cp monitoring.sh /usr/local/bin/monitoring.sh
sudo chmod +x /usr/local/bin/monitoring.sh
sudo bash /usr/local/bin/monitoring.sh        # ลองมือรันก่อน ต้องไม่มี error โผล่

sudo crontab -u root -e
    */10 * * * * sh /usr/local/bin/monitoring.sh

sudo crontab -u root -l                       # ยืนยันว่าบรรทัดอยู่จริง`,
      cap: "รันมือก่อนเสมอ — error ที่โผล่ตอน cron ยิงจะไปกวนทุก terminal ของทุกคน", lang: "bash" },
    { table: { head: ["ช่องของ cron", "ความหมาย", "ในโปรเจกต์นี้"], rows: [
      ["ช่อง 1", "นาที (0-59)", "`*/10` = ทุก ๆ 10 นาที"],
      ["ช่อง 2", "ชั่วโมง (0-23)", "`*` ไม่จำกัด"],
      ["ช่อง 3", "วันที่ (1-31)", "`*`"],
      ["ช่อง 4", "เดือน (1-12)", "`*`"],
      ["ช่อง 5", "วันในสัปดาห์ (0-7)", "`*`"]
    ]}}
  ];

  TH.tricks = [
    { h: "ชุดคำสั่งที่ผู้ตรวจพิมพ์จริงตอน defense" },
    { p: "คู่มือ gitbook แยกหมวด **evaluation commands** ไว้ต่างหาก เพราะการสอบคือการพิมพ์คำสั่งเหล่านี้ทีละอันแล้วดูผล — ซ้อมให้พิมพ์ได้โดยไม่ต้องนึก" },
    { table: { head: ["ต้องพิสูจน์ว่า", "พิมพ์", "ต้องเห็นอะไร"], rows: [
      ["ไม่มี GUI", "`dpkg -l | grep -iE 'xserver|wayland'`", "ว่างเปล่า"],
      ["ระบบปฏิบัติการ", "`cat /etc/os-release`", "Debian stable ล่าสุด"],
      ["ชื่อเครื่อง", "`hostname`", "`<login>42`"],
      ["เปลี่ยนชื่อเครื่องสด ๆ", "`sudo hostnamectl set-hostname test42` แล้วแก้ `/etc/hosts`", "`hostname` เปลี่ยนตาม"],
      ["พาร์ทิชัน", "`lsblk`", "`crypt` แล้วตามด้วย `lvm`"],
      ["AppArmor", "`aa-status` · `systemctl is-enabled apparmor`", "profiles loaded · enabled"],
      ["sudo ติดตั้งแล้ว", "`dpkg -l | grep sudo`", "เจอแพ็กเกจ"],
      ["ผู้ใช้อยู่ในกลุ่ม", "`groups <login>`", "มี `sudo` และ `user42`"],
      ["สร้างผู้ใช้ใหม่สด ๆ", "`sudo adduser test`", "รหัสที่อ่อนถูกปฏิเสธจริง"],
      ["นโยบายรหัสผ่าน", "`chage -l test`", "30 / 2 / 7"],
      ["สร้างกลุ่มและเพิ่มสมาชิก", "`sudo groupadd evaluating` · `sudo usermod -aG evaluating test`", "`groups test` มีกลุ่มใหม่"],
      ["กฎของ sudo", "`sudo cat /etc/sudoers.d/*`", "ครบทั้ง 5 ข้อ"],
      ["log ของ sudo", "`sudo ls /var/log/sudo/` · `sudo cat /var/log/sudo/sudo.log`", "มีไฟล์และมีรายการ"],
      ["ไฟร์วอลล์", "`sudo ufw status numbered`", "active และมีแค่ 4242"],
      ["เพิ่ม/ลบกฎสด ๆ", "`sudo ufw allow 8080` · `sudo ufw delete <n>`", "รายการเปลี่ยนตาม"],
      ["SSH", "`sudo ss -tlnp | grep 4242` · `systemctl status ssh`", "sshd ฟังที่ 4242"],
      ["ห้าม root ผ่าน SSH", "`ssh -p 4242 root@127.0.0.1`", "Permission denied"],
      ["cron ของสคริปต์", "`sudo crontab -u root -l`", "บรรทัด `*/10`"],
      ["หยุดสคริปต์โดยห้ามแก้ไฟล์", "`sudo crontab -u root -e` แล้วใส่ `#`", "wall เงียบไป"]
    ]}},
    { note: "**ซ้อมทั้งชุดนี้ให้ครบหนึ่งรอบก่อนวันสอบ** — เกือบทุกข้อในตารางนี้คือหนึ่งช่องในใบให้คะแนน และการพิมพ์ผิดตอนตื่นเต้นทำให้เสียเวลามากกว่าที่คิด" }
  ];

  TH.eval = [
    { h: "คู่มือฉบับเต็มที่คนใช้กันมากที่สุด" },
    { links: [
      { label: "Born2beRoot guide (noreply.gitbook.io)", url: "https://noreply.gitbook.io/born2beroot",
        note: "คู่มือทีละหน้าจอตั้งแต่ติดตั้ง Debian จนถึง signature.txt — ตัวสคริปต์ในหมวด 'ลงมือทำ' มาจากที่นี่" },
      { label: "gitbook — Script (monitoring.sh)", url: "https://noreply.gitbook.io/born2beroot/virtual-machine-setup/script",
        note: "ต้นฉบับของสคริปต์รุ่น vmstat ที่อธิบายไว้ทีละบรรทัด" },
      { label: "gitbook — sudo policies", url: "https://noreply.gitbook.io/born2beroot/virtual-machine-setup/sudo-policies",
        note: "ทั้ง 5 บรรทัดใน sudoers.d พร้อมคำอธิบาย" },
      { label: "gitbook — password policy", url: "https://noreply.gitbook.io/born2beroot/virtual-machine-setup/password-policy",
        note: "ตั้ง login.defs และต่อพารามิเตอร์ pwquality ท้าย common-password" },
      { label: "gitbook — Evaluation commands", url: "https://noreply.gitbook.io/born2beroot/correction-preparation/evaluation-commands",
        note: "รายการคำสั่งที่ใช้ตอนสอบ แยกเป็นหน้าย่อยทีละหัวข้อ" },
      { label: "gitbook — BONUS: Partition disks", url: "https://noreply.gitbook.io/born2beroot/installing-debian/bonus-partition-disks",
        note: "ไล่ทีละหน้าจอของ installer ตั้งแต่ LUKS จนถึง logical volume ครบทุกก้อน" }
    ]}
  ];

  EN.implementation = [
    { h: "Every command, explained" },
    { p: "This is the complete command set for the project, in the order you actually use it. **Every flag is there for a reason**, and an evaluator may ask about any of them — knowing the command is not enough; you must know what the flag changes." },
    { table: { head: ["Command", "What it does", "The flag you must be able to explain"], rows: [
      ["`apt update`", "Refreshes the **package index** from the repositories", "It installs nothing; it only refreshes the catalogue"],
      ["`apt upgrade`", "Upgrades the packages already installed", "`-y` answers yes in advance"],
      ["`apt install <pkg>`", "Installs a new package", "`--no-install-recommends` skips merely recommended extras, keeping the machine lean"],
      ["`adduser <name>`", "Creates a user, a home directory and a password interactively", "A friendlier wrapper around `useradd` that does the whole job"],
      ["`groupadd <group>`", "Creates a group", "`user42`, which the subject requires"],
      ["`usermod -aG <g> <user>`", "Adds a user to supplementary groups", "`-a` **means append** — without it every existing group, `sudo` included, is wiped"],
      ["`groups <user>`", "Shows which groups a user belongs to", "Only reflects the change after a fresh login"],
      ["`hostnamectl set-hostname <name>`", "Changes the machine name persistently", "`/etc/hosts` must be updated to match"],
      ["`systemctl restart <svc>`", "Restarts a service", "So it re-reads its configuration"],
      ["`systemctl enable <svc>`", "Makes it start at boot", "`--now` enables and starts in one go"],
      ["`systemctl is-enabled <svc>`", "Asks whether it starts at boot", "**Different from** `is-active`, which asks whether it is running now"],
      ["`ss -tlnp`", "Shows which ports something is listening on", "`t` tcp · `l` listening · `n` no name resolution · `p` which process (needs sudo)"],
      ["`ufw allow <port>`", "Opens a port in the firewall", "Always **before** `ufw enable`"],
      ["`ufw status numbered`", "Lists the rules with index numbers", "Those numbers are what `ufw delete <n>` takes"],
      ["`chage -l <user>`", "Shows an account's password ageing", "**This is what the evaluator reads**, not `/etc/login.defs`"],
      ["`chage -M 30 -m 2 -W 7 <user>`", "Applies the ageing policy to an existing account", "`-M` maximum · `-m` minimum · `-W` warning window"],
      ["`visudo -f /etc/sudoers.d/<file>`", "Edits a sudo rules file", "**It validates the syntax before saving** — a broken sudoers locks sudo for everybody"],
      ["`crontab -u root -e`", "Edits root's schedule", "`-u root` states whose crontab explicitly rather than inferring it"],
      ["`lsblk`", "The block device tree", "The proof of LUKS and LVM an evaluator looks at first"],
      ["`aa-status`", "AppArmor's state and loaded profiles", "Pairs with `systemctl is-enabled apparmor`"],
      ["`sha1sum <file>`", "Computes the virtual disk's signature", "Only valid with the machine **powered off**"]
    ]}},
    { h: "apt — the three commands people confuse" },
    { code: String.raw`sudo apt update                 # refresh the repository catalogue only
sudo apt upgrade -y             # upgrade what is already installed
sudo apt install -y sudo ufw openssh-server libpam-pwquality

apt list --installed | grep ufw # confirm it really is installed
dpkg -l | grep -iE 'xserver|wayland'   # must be empty: no GUI`,
      cap: "update upgrades nothing; it only teaches apt which newer versions exist", lang: "bash" },
    { h: "Users and groups — the trap is the -a flag" },
    { code: String.raw`sudo adduser wiaon-in           # asks for the password and the details
sudo groupadd user42
sudo usermod -aG user42,sudo wiaon-in

groups wiaon-in                 # wiaon-in : wiaon-in sudo user42
getent group user42             # the group's members, from the other direction
id wiaon-in                     # uid, gid and every group on one line`,
      cap: "usermod -G without the a *replaces* the whole group list — one slip and you are out of sudo", lang: "bash" },
    { h: "systemctl — active is not the same as enabled" },
    { code: String.raw`sudo systemctl status ssh       # what it is doing right now (q to quit)
sudo systemctl restart ssh      # re-read the configuration
sudo systemctl enable ssh       # bring it up at boot
systemctl is-active ssh         # active   <- running now
systemctl is-enabled ssh        # enabled  <- comes back after a reboot`,
      cap: "An evaluator may reboot and check ufw and ssh return by themselves — enabled is the answer", lang: "bash" },
    { h: "monitoring.sh from the gitbook guide, built line by line" },
    { p: "This is the most widely used version of the script (from **noreply.gitbook.io/born2beroot**). It differs from the one earlier on this page by measuring CPU with** `vmstat` **and memory with** `free --mega` **rather than** `free -m` **—** both are correct**, but you must be able to explain the lines you wrote." },
    { code: String.raw`#!/bin/bash

arch=$(uname -a)
cpuf=$(grep "physical id" /proc/cpuinfo | wc -l)
cpuv=$(grep "processor" /proc/cpuinfo | wc -l)`,
      cap: "Block 1: architecture and CPU counts", lang: "bash" },
    { table: { head: ["Line", "How to read it"], rows: [
      ["`uname -a`", "`-a` is all: kernel name, hostname, version and architecture in one go"],
      ["`grep \"physical id\" /proc/cpuinfo | wc -l`", "`/proc/cpuinfo` holds one block per core; the `physical id` line names its socket, and `wc -l` counts lines"],
      ["`grep \"processor\" /proc/cpuinfo | wc -l`", "Counts **logical cores**, which is the vCPU count the VM sees"]
    ]}},
    { note: "**A caveat:** `grep \"physical id\" | wc -l` counts *every line*, not the number of distinct sockets. On a single-socket VM with several cores the number equals the vCPU count — for the real socket count you need `| sort -u` before `wc -l`. Have that answer ready; it is a favourite question." },
    { code: String.raw`ram_total=$(free --mega | awk '$1 == "Mem:" {print $2}')
ram_use=$(free --mega | awk '$1 == "Mem:" {print $3}')
ram_percent=$(free --mega | awk '$1 == "Mem:" {printf("%.2f"), $3/$2*100}')`,
      cap: "Block 2: memory", lang: "bash" },
    { table: { head: ["Piece", "How to read it"], rows: [
      ["`free --mega`", "Reports in decimal megabytes (10^6), while `free -m` uses mebibytes (2^20), so the numbers differ slightly"],
      ["`awk '$1 == \"Mem:\"'`", "Selects only the line whose first column is `Mem:`, skipping the header and the swap line"],
      ["`{print $2}` / `{print $3}`", "Column 2 is total, column 3 is used"],
      ["`printf(\"%.2f\"), $3/$2*100`", "The percentage is computed by hand; awk offers none ready-made"]
    ]}},
    { code: String.raw`disk_total=$(df -m | grep "/dev/" | grep -v "/boot" | awk '{disk_t += $2} END {printf ("%.1fGb\n"), disk_t/1024}')
disk_use=$(df -m | grep "/dev/" | grep -v "/boot" | awk '{disk_u += $3} END {print disk_u}')
disk_percent=$(df -m | grep "/dev/" | grep -v "/boot" | awk '{disk_u += $3} {disk_t += $2} END {printf("%d"), disk_u/disk_t*100}')`,
      cap: "Block 3: disk space", lang: "bash" },
    { table: { head: ["Piece", "How to read it"], rows: [
      ["`df -m`", "Free space on every filesystem, in megabytes"],
      ["`grep \"/dev/\"`", "Keeps only real devices, dropping `tmpfs` and `udev`, which live in RAM"],
      ["`grep -v \"/boot\"`", "`-v` inverts the match, dropping `/boot`, which is not user space"],
      ["`awk '{disk_t += $2} END {...}'`", "Accumulates across every line and prints once in `END`"],
      ["`disk_t/1024`", "Converts megabytes to gigabytes"]
    ]}},
    { code: String.raw`cpul=$(vmstat 1 2 | tail -1 | awk '{printf $15}')
cpu_op=$(expr 100 - $cpul)
cpu_fin=$(printf "%.1f" $cpu_op)`,
      cap: "Block 4: CPU load — the line people most often cannot explain", lang: "bash" },
    { table: { head: ["Piece", "How to read it"], rows: [
      ["`vmstat 1 2`", "Two samples a second apart — **the first is an average since boot, so you want the second**"],
      ["`tail -1`", "Takes the last line, which is that second sample"],
      ["`awk '{printf $15}'`", "Column 15 is `id`, the idle percentage"],
      ["`expr 100 - $cpul`", "Load is one hundred minus idle"],
      ["`printf \"%.1f\"`", "Formats it to one decimal place"]
    ]}},
    { note: "This is why it must be `vmstat 1 2` rather than a bare `vmstat`: a single call reports the average since boot, which barely moves and cannot honestly be called the load 'right now'." },
    { code: String.raw`lb=$(who -b | awk '$1 == "system" {print $3 " " $4}')
lvmu=$(if [ $(lsblk | grep "lvm" | wc -l) -gt 0 ]; then echo yes; else echo no; fi)
tcpc=$(ss -ta | grep ESTAB | wc -l)
ulog=$(users | wc -w)`,
      cap: "Block 5: last boot, LVM, connections and users", lang: "bash" },
    { table: { head: ["Piece", "How to read it"], rows: [
      ["`who -b`", "`-b` is boot time, printing `system boot  2025-08-10 09:12`"],
      ["`awk '$1 == \"system\" {print $3 \" \" $4}'`", "Takes just the date and the time"],
      ["`lsblk | grep \"lvm\" | wc -l`", "Is any device of type `lvm` present? More than zero means LVM is in use"],
      ["`ss -ta | grep ESTAB | wc -l`", "`-t` tcp, `-a` every state, then keep only the established ones"],
      ["`users | wc -w`", "`users` prints the logged-in names separated by spaces; `-w` counts **words**"]
    ]}},
    { note: "`users | wc -w` counts **sessions, not people** — one person with three terminals reads as three. For distinct people you need `users | tr ' ' '\\n' | sort -u | wc -l`. Either is defensible, as long as you know which one you chose." },
    { code: String.raw`ip=$(hostname -I)
mac=$(ip link | grep "link/ether" | awk '{print $2}')
cmnd=$(journalctl _COMM=sudo | grep COMMAND | wc -l)`,
      cap: "Block 6: networking and the sudo command count", lang: "bash" },
    { table: { head: ["Piece", "How to read it"], rows: [
      ["`hostname -I`", "A capital `-I` prints every address of the machine, excluding loopback"],
      ["`ip link`", "Lists every link-layer interface"],
      ["`grep \"link/ether\"`", "Keeps only the lines carrying an Ethernet MAC"],
      ["`journalctl _COMM=sudo`", "Reads only the journal entries written by the program named `sudo`"],
      ["`grep COMMAND | wc -l`", "One `COMMAND=` line is one command run through sudo"]
    ]}},
    { code: String.raw`wall "	#Architecture: $arch
	#CPU physical: $cpuf
	#vCPU: $cpuv
	#Memory Usage: $ram_use/` + "$" + String.raw`{ram_total}MB ($ram_percent%)
	#Disk Usage: $disk_use/$disk_total ($disk_percent%)
	#CPU load: $cpu_fin%
	#Last boot: $lb
	#LVM use: $lvmu
	#Connections TCP: $tcpc ESTABLISHED
	#User log: $ulog
	#Network: IP $ip($mac)
	#Sudo: $cmnd cmd"`,
      cap: "The last block: the broadcast — each line begins with a real tab, not spaces", lang: "bash" },
    { h: "Install the script and schedule it" },
    { code: String.raw`sudo cp monitoring.sh /usr/local/bin/monitoring.sh
sudo chmod +x /usr/local/bin/monitoring.sh
sudo bash /usr/local/bin/monitoring.sh        # run it by hand first: no errors allowed

sudo crontab -u root -e
    */10 * * * * sh /usr/local/bin/monitoring.sh

sudo crontab -u root -l                       # confirm the line is really there`,
      cap: "Always run it by hand first — an error under cron lands on everybody's terminal", lang: "bash" },
    { table: { head: ["cron field", "Meaning", "In this project"], rows: [
      ["1", "Minute (0-59)", "`*/10`, every ten minutes"],
      ["2", "Hour (0-23)", "`*`, unrestricted"],
      ["3", "Day of month (1-31)", "`*`"],
      ["4", "Month (1-12)", "`*`"],
      ["5", "Day of week (0-7)", "`*`"]
    ]}}
  ];

  EN.tricks = [
    { h: "The commands an evaluator actually types" },
    { p: "The gitbook guide keeps **evaluation commands** in their own chapter, because the defense really is somebody typing these one at a time and reading the output — rehearse until you need no notes." },
    { table: { head: ["To prove", "Type", "You must see"], rows: [
      ["No GUI", "`dpkg -l | grep -iE 'xserver|wayland'`", "Nothing"],
      ["The operating system", "`cat /etc/os-release`", "The latest stable Debian"],
      ["The hostname", "`hostname`", "`<login>42`"],
      ["Changing it live", "`sudo hostnamectl set-hostname test42`, then edit `/etc/hosts`", "`hostname` follows"],
      ["The partitions", "`lsblk`", "`crypt` and then `lvm`"],
      ["AppArmor", "`aa-status` · `systemctl is-enabled apparmor`", "Profiles loaded · enabled"],
      ["sudo is installed", "`dpkg -l | grep sudo`", "The package is there"],
      ["Group membership", "`groups <login>`", "Both `sudo` and `user42`"],
      ["Creating a user live", "`sudo adduser test`", "A weak password really is refused"],
      ["The password policy", "`chage -l test`", "30 / 2 / 7"],
      ["Creating a group and adding to it", "`sudo groupadd evaluating` · `sudo usermod -aG evaluating test`", "`groups test` shows the new group"],
      ["The sudo rules", "`sudo cat /etc/sudoers.d/*`", "All five of them"],
      ["The sudo logs", "`sudo ls /var/log/sudo/` · `sudo cat /var/log/sudo/sudo.log`", "Files, with entries in them"],
      ["The firewall", "`sudo ufw status numbered`", "Active, with only 4242"],
      ["Adding and deleting a rule live", "`sudo ufw allow 8080` · `sudo ufw delete <n>`", "The list changes accordingly"],
      ["SSH", "`sudo ss -tlnp | grep 4242` · `systemctl status ssh`", "sshd listening on 4242"],
      ["Root refused over SSH", "`ssh -p 4242 root@127.0.0.1`", "Permission denied"],
      ["The script's cron entry", "`sudo crontab -u root -l`", "The `*/10` line"],
      ["Stopping it without editing the file", "`sudo crontab -u root -e`, add a `#`", "The wall messages stop"]
    ]}},
    { note: "**Rehearse the whole table once before the day itself** — nearly every row is a box on the grading sheet, and mistyping under pressure costs more time than you would expect." }
  ];

  EN.eval = [
    { h: "The full guide most students use" },
    { links: [
      { label: "Born2beRoot guide (noreply.gitbook.io)", url: "https://noreply.gitbook.io/born2beroot",
        note: "A screen-by-screen walkthrough from the Debian installer to signature.txt; the script in the hands-on tab comes from here" },
      { label: "gitbook — Script (monitoring.sh)", url: "https://noreply.gitbook.io/born2beroot/virtual-machine-setup/script",
        note: "The original of the vmstat version explained line by line above" },
      { label: "gitbook — sudo policies", url: "https://noreply.gitbook.io/born2beroot/virtual-machine-setup/sudo-policies",
        note: "All five sudoers.d lines with their explanations" },
      { label: "gitbook — password policy", url: "https://noreply.gitbook.io/born2beroot/virtual-machine-setup/password-policy",
        note: "Setting login.defs and appending the pwquality parameters to common-password" },
      { label: "gitbook — Evaluation commands", url: "https://noreply.gitbook.io/born2beroot/correction-preparation/evaluation-commands",
        note: "The defense command list, split into one page per topic" },
      { label: "gitbook — BONUS: Partition disks", url: "https://noreply.gitbook.io/born2beroot/installing-debian/bonus-partition-disks",
        note: "Every installer screen from LUKS through each logical volume" }
    ]}
  ];

  var page = null;
  window.TEACHING_DATA.forEach(function (p) { if (p.id === "born2beroot") page = p; });
  if (!page) return;
  var en = window.TEACHING_EN.born2beroot;
  Object.keys(TH).forEach(function (sec) {
    TH[sec].forEach(function (b) { page.sections[sec].push(b); });
    if (en && en[sec]) EN[sec].forEach(function (b) { en[sec].push(b); });
  });
})();

/* ============================================================
   ติดตั้ง VM ตั้งแต่ศูนย์ ทีละหน้าจอ พร้อมค่าที่ต้องใส่จริง
   ต่อท้ายแท็บ "โครงสร้างโค้ด" ทั้งฝั่งไทยและอังกฤษพร้อมกัน
   ============================================================ */
(function () {
  var TH = [
    { h: "ติดตั้ง VM ตั้งแต่ศูนย์ — ทีละหน้าจอ" },
    { p: "ครึ่งแรกของโปรเจกต์คือการกดผ่านหน้าจอให้ถูก **พลาดสองจุดต้องลงใหม่ทั้งเครื่อง**: ติ๊ก desktop environment ตอนเลือกซอฟต์แวร์ และแบ่งพาร์ทิชันผิดตั้งแต่แรก" },
    { h: "1) ตั้งค่า VirtualBox ก่อนบูต" },
    { table: { head: ["ช่อง", "ใส่อะไร", "ทำไม"], rows: [
      ["Type / Version", "Linux · Debian (64-bit)", "ให้ VirtualBox ตั้งค่าเริ่มต้นที่เข้ากับ Debian"],
      ["Memory", "**1024 MB ขั้นต่ำ · 2048 MB ลื่นกว่า**", "ไม่มี GUI จึงใช้น้อย แต่ตอนติดตั้งและตอน build ของ bonus 1 GB จะฝืด"],
      ["Hard disk", "VDI · **Dynamically allocated**", "ไฟล์โตตามที่ใช้จริง ไม่กินที่เต็มก้อนตั้งแต่แรก"],
      ["ขนาดดิสก์", "**12 GB (mandatory) · 30 GB (bonus)**", "bonus ต้องซอยเป็น 7 logical volume จึงต้องใหญ่กว่า"],
      ["Network", "NAT + port forward `4242`", "ให้ ssh จากเครื่องจริงเข้ามาได้"],
      ["ที่เก็บไฟล์ VM", "sgoinfre ของแคมปัส หรือ SSD ภายนอก", "ไฟล์ `.vdi` ใหญ่และ home directory ของ 42 มักเต็ม"]
    ]}},
    { code: String.raw`VirtualBox -> Settings -> Network -> Adapter 1 -> NAT
   -> Advanced -> Port Forwarding -> +
      Name: ssh   Protocol: TCP
      Host IP: 127.0.0.1   Host Port: 4242
      Guest IP: (เว้นว่าง)  Guest Port: 4242

VirtualBox -> Settings -> Storage -> Empty (ไอคอนแผ่น) -> เลือกไฟล์ ISO ของ Debian`,
      cap: "ทำ port forward ตั้งแต่ตอนนี้เลย จะได้ไม่ลืมตอนตั้ง sshd เสร็จ", lang: "txt" },
    { h: "2) หน้าจอของ Debian installer ที่ต้องเลือกให้ถูก" },
    { table: { head: ["หน้าจอ", "เลือก", "หมายเหตุ"], rows: [
      ["Install", "**Install** (ไม่ใช่ Graphical install)", "โหมดข้อความเบากว่าและใช้แป้นพิมพ์อย่างเดียว"],
      ["Language / Location / Keymap", "ตามสะดวก", "แต่ **จำ keymap ที่เลือกไว้** ไม่งั้นพิมพ์รหัสผ่านไม่ตรง"],
      ["Hostname", "`<login>42` เช่น `wiaon-in42`", "ข้อบังคับของ subject"],
      ["Domain name", "เว้นว่าง", "เครื่องเดี่ยว ไม่ต้องมีโดเมน"],
      ["Root password", "ตั้งให้ผ่านนโยบายที่จะตั้งทีหลัง", "จะต้องเปลี่ยนอีกครั้งหลังตั้ง pwquality อยู่ดี"],
      ["ผู้ใช้ใหม่", "username = login ของตัวเอง", "subject บังคับว่าต้องมีผู้ใช้ชื่อ login"],
      ["Clock / timezone", "ตามแคมปัส", "มีผลกับเวลาที่ `monitoring.sh` รายงาน"],
      ["Partition disks", "**Manual**", "อัตโนมัติจะไม่ได้ LUKS + LVM ตามที่ต้องการ"],
      ["Software selection", "**ติ๊กออกให้หมด เหลือแค่** `standard system utilities`", "เผลอติ๊ก GNOME/KDE = ได้ 0 ต้องลงใหม่"],
      ["GRUB", "ติดตั้งลง `/dev/sda`", "ไม่ใช่ลงพาร์ทิชัน แต่ลงที่ตัวดิสก์"]
    ]}},
    { note: "**หน้าจอ Software selection คือจุดที่คนพลาดมากที่สุด** — ค่าเริ่มต้นติ๊ก desktop environment ไว้ให้ ต้องกด space เอาออกทุกอันแล้วเหลือ `standard system utilities` อย่างเดียว มี X.org ติดเครื่องเมื่อไหร่คือ 0" },
    { h: "3) แบ่งพาร์ทิชันแบบ bonus ทีละขั้น" },
    { code: String.raw`Partition disks -> Manual
  -> เลือกดิสก์ทั้งก้อน -> Create new empty partition table -> Yes

  1. FREE SPACE -> Create a new partition
       Size: 500 MB       Type: Primary      Location: Beginning
       Mount point: /boot                    -> Done setting up the partition

  2. FREE SPACE -> Create a new partition
       Size: ที่เหลือทั้งหมด   Type: Logical
       Use as: physical volume for encryption   -> Done

  3. Configure encrypted volumes -> Create encrypted volumes
       เลือกพาร์ทิชันที่เพิ่งทำ -> Done -> Finish -> Yes
       (ล้างข้อมูลด้วยค่าสุ่มใช้เวลานานมาก จะข้ามก็ได้)
       ตั้ง passphrase -> นี่คือรหัสที่ต้องพิมพ์ทุกครั้งที่บูต

  4. Configure the Logical Volume Manager -> Yes
       Create volume group   ชื่อ: LVMGroup   เลือก /dev/sda5_crypt
       Create logical volume x 7 (ตามตารางข้างล่าง)
       Finish

  5. เลือกแต่ละ LV -> Use as: Ext4 (หรือ swap area) -> ตั้ง Mount point
  6. Finish partitioning and write changes to disk -> Yes`,
      cap: "ลำดับสำคัญ: /boot ก่อน แล้วเข้ารหัสที่เหลือ แล้วค่อยสร้าง LVM ข้างใน", lang: "txt" },
    { table: { head: ["Logical volume", "ขนาด (ดิสก์ 30 GB)", "Mount point"], rows: [
      ["`root`", "10 G", "`/`"],
      ["`swap`", "2.3 G", "swap area"],
      ["`home`", "5 G", "`/home`"],
      ["`var`", "3 G", "`/var`"],
      ["`srv`", "3 G", "`/srv`"],
      ["`tmp`", "3 G", "`/tmp`"],
      ["`var-log`", "4 G", "`/var/log`"]
    ]}},
    { p: "ตัวเลขชุดนี้คือของ **bonus** ส่วน mandatory ต้องการแค่ **สองพาร์ทิชันเข้ารหัสบน LVM** — ทำ `root` กับ `home` (หรือ `swap`) ก็พอ และดิสก์ 12 GB ก็เหลือเฟือ" },
    { h: "4) หลังบูตครั้งแรก — ยืนยันว่าติดตั้งถูก" },
    { code: String.raw`su -                                   # ยังไม่มี sudo ต้องเข้าเป็น root ก่อน
apt update && apt upgrade -y

lsblk                                  # ต้องเห็น crypt แล้วตามด้วย lvm
cat /etc/os-release                    # Debian stable ล่าสุด
hostname                               # wiaon-in42
dpkg -l | grep -iE 'xserver|wayland'   # ต้องว่าง ไม่มี GUI ติดมา
df -h                                  # แต่ละ mount point แยกกันจริงตามที่แบ่งไว้
free -m                                # swap ทำงานอยู่`,
      cap: "เช็ก 6 อย่างนี้ก่อนไปต่อ — ถ้าข้อไหนไม่ผ่าน แก้ตอนนี้ถูกกว่าตอนตั้งค่าไปครึ่งทางแล้ว", lang: "bash" }
  ];

  var EN = [
    { h: "Installing the VM from nothing, screen by screen" },
    { p: "The first half of this project is clicking through installer screens correctly. **Two mistakes force a full reinstall**: ticking a desktop environment at software selection, and getting the partitioning wrong at the start." },
    { h: "1) VirtualBox settings, before the first boot" },
    { table: { head: ["Field", "Value", "Why"], rows: [
      ["Type / Version", "Linux · Debian (64-bit)", "So VirtualBox picks defaults that suit Debian"],
      ["Memory", "**1024 MB minimum · 2048 MB is smoother**", "A headless system needs little, but 1 GB drags during installation and the bonus builds"],
      ["Hard disk", "VDI · **dynamically allocated**", "The file grows with actual use instead of claiming everything upfront"],
      ["Disk size", "**12 GB (mandatory) · 30 GB (bonus)**", "The bonus splits into seven logical volumes, so it needs the room"],
      ["Network", "NAT plus a port forward for `4242`", "So you can ssh in from the host"],
      ["Where the VM lives", "The campus sgoinfre share, or an external SSD", "The `.vdi` is large and 42 home directories fill up"]
    ]}},
    { code: String.raw`VirtualBox -> Settings -> Network -> Adapter 1 -> NAT
   -> Advanced -> Port Forwarding -> +
      Name: ssh   Protocol: TCP
      Host IP: 127.0.0.1   Host Port: 4242
      Guest IP: (leave empty)  Guest Port: 4242

VirtualBox -> Settings -> Storage -> Empty (the disc icon) -> pick the Debian ISO`,
      cap: "Do the port forward now, so it is not forgotten once sshd is configured", lang: "txt" },
    { h: "2) The Debian installer screens that matter" },
    { table: { head: ["Screen", "Choose", "Note"], rows: [
      ["Install", "**Install**, not Graphical install", "The text mode is lighter and keyboard-only"],
      ["Language / Location / Keymap", "As you like", "But **remember the keymap you chose**, or your password will not type back the same"],
      ["Hostname", "`<login>42`, e.g. `wiaon-in42`", "Required by the subject"],
      ["Domain name", "Leave it empty", "A standalone machine needs none"],
      ["Root password", "One that will satisfy the policy you set later", "You will change it again after pwquality anyway"],
      ["New user", "username = your own login", "The subject requires a user named after your login"],
      ["Clock / timezone", "Your campus", "It shows up in what `monitoring.sh` reports"],
      ["Partition disks", "**Manual**", "The guided options will not give you LUKS under LVM"],
      ["Software selection", "**Untick everything except** `standard system utilities`", "A ticked GNOME or KDE is a zero and a reinstall"],
      ["GRUB", "Install to `/dev/sda`", "The disk itself, not a partition"]
    ]}},
    { note: "**Software selection is where most people lose the project**: a desktop environment is ticked by default, so press space to clear every box and leave only `standard system utilities`. Any X.org on the machine is a zero." },
    { h: "3) The bonus partitioning, step by step" },
    { code: String.raw`Partition disks -> Manual
  -> select the whole disk -> Create new empty partition table -> Yes

  1. FREE SPACE -> Create a new partition
       Size: 500 MB       Type: Primary      Location: Beginning
       Mount point: /boot                    -> Done setting up the partition

  2. FREE SPACE -> Create a new partition
       Size: all the rest   Type: Logical
       Use as: physical volume for encryption   -> Done

  3. Configure encrypted volumes -> Create encrypted volumes
       pick the partition you just made -> Done -> Finish -> Yes
       (erasing with random data takes a very long time; skipping it is fine)
       set the passphrase -> this is what you type at every boot

  4. Configure the Logical Volume Manager -> Yes
       Create volume group   name: LVMGroup   on /dev/sda5_crypt
       Create logical volume, seven times (see the table below)
       Finish

  5. For each LV -> Use as: Ext4 (or swap area) -> set its mount point
  6. Finish partitioning and write changes to disk -> Yes`,
      cap: "Order matters: /boot first, encrypt the remainder, then build LVM inside it", lang: "txt" },
    { table: { head: ["Logical volume", "Size (on a 30 GB disk)", "Mount point"], rows: [
      ["`root`", "10 G", "`/`"],
      ["`swap`", "2.3 G", "swap area"],
      ["`home`", "5 G", "`/home`"],
      ["`var`", "3 G", "`/var`"],
      ["`srv`", "3 G", "`/srv`"],
      ["`tmp`", "3 G", "`/tmp`"],
      ["`var-log`", "4 G", "`/var/log`"]
    ]}},
    { p: "Those are the **bonus** numbers. The mandatory part only asks for **two encrypted partitions on LVM** — `root` and `home` (or `swap`) is enough, and 12 GB is plenty." },
    { h: "4) After the first boot, confirm the install is right" },
    { code: String.raw`su -                                   # sudo is not installed yet; become root
apt update && apt upgrade -y

lsblk                                  # crypt must appear, then lvm
cat /etc/os-release                    # the latest stable Debian
hostname                               # wiaon-in42
dpkg -l | grep -iE 'xserver|wayland'   # empty: no GUI came along
df -h                                  # each mount point really is separate
free -m                                # swap is active`,
      cap: "Check these six before going further — fixing them now is far cheaper than halfway through the configuration", lang: "bash" }
  ];

  var page = null;
  window.TEACHING_DATA.forEach(function (p) { if (p.id === "born2beroot") page = p; });
  if (!page) return;
  TH.forEach(function (b) { page.sections.architecture.push(b); });
  var en = window.TEACHING_EN.born2beroot;
  if (en && en.architecture) EN.forEach(function (b) { en.architecture.push(b); });
})();
