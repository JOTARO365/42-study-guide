/* ft_irc — IRC server ใน C++98 บน poll() ตัวเดียว */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

window.TEACHING_DATA.push({
  id: "ft_irc",
  name: "ft_irc",
  tag: {
    th: "IRC server โปรเซสเดียวใน C++98 — poll() ตัวเดียว ห้าม fork, fd non-blocking ทั้งหมด; PASS/NICK/USER, ช่อง, operator, KICK INVITE TOPIC MODE i/t/k/o/l และต้องต่อด้วย irssi ได้จริง",
    en: "A single-process IRC server in C++98 — one poll(), no fork, every fd non-blocking; PASS/NICK/USER, channels, operators, KICK INVITE TOPIC and MODE i/t/k/o/l, and a real client like irssi must connect"
  },
  accent: "#a78bfa",
  sections: {
    principle: [
      { h: "โจทย์คืออะไร" },
      { p: "เขียน **IRC server **ด้วย C++98 รันเป็น** `./ircserv <port> <password>` **แล้วให้** client จริง** (irssi, HexChat) ต่อเข้ามาคุยกันได้: สมัครตัวด้วย PASS/NICK/USER, เข้าช่อง, ส่งข้อความ, และมี operator ที่สั่ง KICK / INVITE / TOPIC / MODE ได้" },
      { p: "**ไม่มี norminette** — โปรเจกต์ C++ คอมไพล์ด้วย `-Wall -Wextra -Werror -std=c++98` ห้าม Boost ห้าม library ภายนอก" },
      { h: "3 กฎเชิงโครงสร้างที่ถูกตรวจก่อนฟีเจอร์ใด ๆ" },
      { table: { head: ["กฎ", "ทำให้ผ่านยังไง"], rows: [
        ["**ห้าม** `fork()`", "โปรเซสเดียวตลอด ไม่มีข้อยกเว้น"],
        ["`poll()` **ตัวเดียว** (หรือเทียบเท่า) คุมทั้ง listen/read/write", "การเรียก `recv`/`send` บน fd ที่ poll ไม่ได้บอกว่าพร้อม = **0 คะแนน** ตามตัวบท subject"],
        ["**fd ทุกตัวต้อง non-blocking**", "รวม listening socket ด้วย"]
      ]}},
      { p: "ทำให้ตรวจได้ด้วยเครื่อง: **ขัง syscall ของ socket ไว้ในไฟล์เดียว** (เช่น `src/ServerLoop.cpp`) แล้ว grep หาในชุดเทสต์" },
      { code: String.raw`grep -rn 'fork(' src inc                       # ต้องว่าง
grep -rnE '(^|[^._>:a-zA-Z])poll[[:space:]]*\(' src inc   # ต้องเจอที่เดียว
grep -rln 'recv(\|send(\|accept(' src            # ควรเจอไฟล์เดียว`,
        cap: "กฎที่พิสูจน์ด้วย grep ได้ = กฎที่ไม่หลุด", lang: "bash" },
      { h: "หน้าตาการใช้งาน" },
      { code: String.raw`$ ./ircserv 6667 secret
[ircserv] listening on port 6667

$ irssi -c 127.0.0.1 -p 6667 -w secret
/join #42
/msg #42 hello
/mode #42 +o bob
/kick #42 charlie :spamming`,
        cap: "เป้าหมายสุดท้ายคือ client จริงต่อได้ ไม่ใช่แค่ nc ผ่าน", lang: "bash" },
      { h: "IRC คือโปรโตคอลข้อความบรรทัดเดียว" },
      { code: String.raw`[":" prefix SP] command *( SP middle ) [SP ":" trailing]

:alice!user@host PRIVMSG #42 :hello everyone
 \_____prefix____/ \_cmd_/ \_/  \__trailing (กินยาวถึงท้ายบรรทัด)__/

- ปิดท้ายด้วย CRLF เสมอ (ตอนส่งออก)
- ทั้งบรรทัดยาวได้ไม่เกิน 512 byte รวม CRLF
- พารามิเตอร์ได้สูงสุด 15 ตัว`,
        cap: "trailing เริ่มด้วย : และกินทุกอย่างรวมช่องว่างจนจบบรรทัด", lang: "txt" },
      { h: "ทำไมยากกว่าที่เห็น" },
      { ul: [
        "**TCP เป็นสายของ byte ไม่ใช่ข้อความ** — คำสั่งเดียวอาจมาแยก 3 packet และ 3 คำสั่งอาจมารวมกันเป็น packet เดียว",
        "**client จริงเรื่องมากกว่าที่คิด** — irssi รอ `CAP LS`, รอ `PING` ตอบ, และต้องการ `005` ไม่งั้น join ไม่ติด",
        "**การลบ client กลาง broadcast** ทำให้ pointer ค้างและ crash — ต้องมีวินัยเรื่องอายุของอ็อบเจกต์",
        "**bonus ต้องไม่เขียน IRC client** — bot ต้องเป็น 'nick เสมือน' ที่ server ตอบแทน"
      ]},
      { h: "สิ่งที่ต้องส่ง" },
      { table: { head: ["ไฟล์", "หน้าที่"], rows: [
        ["`Makefile`", "`all clean fclean re` + `bonus` และห้าม relink"],
        ["`src/` `inc/`", "โค้ด C++98"],
        ["ไม่มีไฟล์อื่นบังคับ", "แต่ชุดเทสต์ของตัวเองช่วยชีวิตตอน defense มาก"]
      ]}}
    ],

    theory: [
      { p: "หมวดนี้คือโปรโตคอลและ semantics ที่ต้องแม่น — IRC เก่าและมีรายละเอียดแปลก ๆ ที่เดาไม่ได้" },
      { h: "1) ลำดับการสมัครตัว (registration)" },
      { code: String.raw`CONNECTED --PASS ถูก--> +pass --NICK--> +nick --USER--> REGISTERED -> 001..004`,
        cap: "NICK กับ USER มาสลับลำดับกันได้ — เช็กเงื่อนไขครบหลังจากรับแต่ละตัว", lang: "txt" },
      { ul: [
        "เงื่อนไขสำเร็จคือ `passOk && hasNick && hasUser` **ตรวจหลังรับทั้งสามอย่าง ไม่ใช่ตรวจแค่ตอน USER**",
        "คำสั่งอื่นก่อนสมัครเสร็จ → `451 ERR_NOTREGISTERED`",
        "`PASS` หลังสมัครเสร็จแล้ว → `462 ERR_ALREADYREGISTRED`",
        "`PASS` ผิด → `464 ERR_PASSWDMISMATCH` แล้ว **ปิด link**"
      ]},
      { h: "2) numeric ต้อนรับ 001-004 (และ 005 ที่ subject ไม่ได้บอก)" },
      { code: String.raw`:ircserv 001 alice :Welcome to the ft_irc Network alice!user@host
:ircserv 002 alice :Your host is ircserv, running version 1.0
:ircserv 003 alice :This server was created ...
:ircserv 004 alice ircserv 1.0 io itkol
:ircserv 005 alice CHANTYPES=#& CHANMODES=,k,l,it PREFIX=(o)@ NICKLEN=9
 CHANNELLEN=50 TOPICLEN=390 CASEMAPPING=rfc1459 NETWORK=ft_irc :are supported by this server`,
        cap: "005 RPL_ISUPPORT คือบรรทัดที่ทำให้ irssi join ช่องได้จริง", lang: "txt" },
      { note: "**ขาด 005 = บั๊กที่ผ่านทุกเทสต์ระดับ socket แล้วไปพังกับ client จริง** — irssi จะส่ง `JOIN :` เปล่า ๆ ตอนต่อ แล้วหลังจากนั้นจะ join ไม่ติดอีกเลย" },
      { h: "3) casemapping ของ IRC ไม่ใช่ tolower" },
      { p: "RFC 1459 ถือว่า `[]\\~` กับ `{}|^` คือ **ตัวอักษรเดียวกัน** (มันคืออักษรสแกนดิเนเวียในยุคที่ IRC ถูกออกแบบ) การเทียบชื่อ nick และชื่อช่องต้องผ่านการ fold แบบนี้ ไม่งั้น `Nick[]` กับ `nick{}` จะกลายเป็นคนละคน" },
      { code: String.raw`char ircLower(char c) {
    if (c >= 'A' && c <= 'Z') return c - 'A' + 'a';
    if (c == '[')  return '{';
    if (c == ']')  return '}';
    if (c == '\\') return '|';
    if (c == '~')  return '^';
    return c;
}`, cap: "ใช้ตัวนี้ทุกที่ที่เทียบ nick หรือชื่อช่อง", lang: "cpp" },
      { h: "4) ไวยากรณ์ของ nick" },
      { ul: [
        "ตัวแรก: ตัวอักษร หรือหนึ่งใน `[` `]` `\\` `_` `^` `{` `|` `}` และ backquote",
        "ตัวถัดไป: ตัวอักษร ตัวเลข อักขระพิเศษข้างต้น หรือ `-`",
        "ยาวไม่เกิน 9 ตัว",
        "`NICK ab cd` **ไม่ใช่ error** — ช่องว่างแยกพารามิเตอร์ ดังนั้น nick คือ `ab` เฉย ๆ"
      ]},
      { h: "5) PRIVMSG กับ NOTICE" },
      { p: "ส่งต่อโดยใช้ **prefix ของผู้ส่ง**:** `:nick!user@host PRIVMSG #chan :text`**. ข้อความในช่องส่งให้สมาชิกทุกคน** ยกเว้นผู้ส่งเอง**" },
      { p: "`NOTICE` ส่งเหมือนกันทุกประการ แต่ **ห้ามตอบ error กลับไปเด็ดขาด** (RFC 2812 §3.3.2) — เพราะ NOTICE ถูกออกแบบมาให้บอตใช้โดยไม่เกิดลูปตอบโต้กันไม่รู้จบ" },
      { h: "6) MODE ของช่อง" },
      { table: { head: ["Mode", "ตอน + ต้องมี arg", "ตอน - ต้องมี arg", "ผลลัพธ์"], rows: [
        ["`i`", "ไม่", "ไม่", "invite-only"],
        ["`t`", "ไม่", "ไม่", "TOPIC จำกัดเฉพาะ operator"],
        ["`k`", "**ใช่**", "ไม่", "รหัสเข้าช่อง; ตั้งทับของเดิม → `467`"],
        ["`o`", "**ใช่**", "**ใช่**", "ให้/ถอนสถานะ operator; ไม่ใช่สมาชิก → `441`"],
        ["`l`", "**ใช่**", "ไม่", "จำกัดจำนวนคน; ไม่ใช่ตัวเลขหรือ <= 0 ให้เมินเงียบ ๆ"]
      ]}},
      { p: "ประมวลผลตัวอักษร **จากซ้ายไปขวา** กิน argument ตามลำดับที่เจอ แล้ว broadcast **บรรทัดเดียว **ที่สรุปเฉพาะสิ่งที่เปลี่ยนจริง (ดังนั้น** `+i-i+i` **ออกมาเป็นบรรทัดเดียว) ตัวอักษรที่ไม่รู้จัก →** `472` **แต่** ไม่ยกเลิกตัวที่เหลือ**. `MODE #chan` เปล่า ๆ → `324`" },
      { h: "7) ชุด numeric ขั้นต่ำที่ต้องมี" },
      { code: String.raw`001 002 003 004      welcome
331 332              ไม่มี topic / มี topic
341                  INVITE ส่งแล้ว
353 366              รายชื่อในช่อง / จบรายชื่อ
324                  MODE ปัจจุบันของช่อง
401 403 404          ไม่มี nick นั้น / ไม่มีช่องนั้น / ส่งเข้าช่องไม่ได้
411 412              ไม่ระบุผู้รับ / ไม่มีข้อความ
421 431 432 433      คำสั่งไม่รู้จัก / ไม่ให้ nick / nick ผิดรูป / nick ซ้ำ
441 442 443          ไม่ใช่สมาชิก / คุณไม่ได้อยู่ในช่อง / เขาอยู่ในช่องแล้ว
451 461 462          ยังไม่สมัคร / พารามิเตอร์ไม่พอ / สมัครไปแล้ว
464 467              รหัสผิด / มี key อยู่แล้ว
471 472 473 475      ช่องเต็ม / mode ไม่รู้จัก / invite-only / key ผิด
482                  ต้องเป็น operator ของช่อง`,
        cap: "จำเป็นทั้งหมด — client จริงตีความ numeric พวกนี้เพื่อแสดงผล", lang: "txt" },
      { h: "8) การตัดสินใจที่ subject เปิดไว้ ต้องเขียนไว้เองแล้วเทสต์" },
      { ul: [
        "nick ซ้ำ → `433` และ **คนเดิมได้ nick ไป** (ห้ามบังคับเปลี่ยนชื่อ)",
        "ช่องที่ไม่มีสมาชิกเหลือ → ทำลายทิ้ง เพื่อไม่ให้ topic/mode/operator ฟื้นคืนชีพ",
        "คนสร้างช่องได้ `+o` อัตโนมัติ",
        "invite ใช้ได้ครั้งเดียว ถูก kick แล้วต้องขอ invite ใหม่",
        "รหัสผ่านว่างถือว่าถูกกฎหมาย client ต้องส่ง `PASS :`",
        "บรรทัดที่ไม่มีตัวจบ รอไปเรื่อย ๆ แต่พอเกินเพดาน buffer ให้ตัดทิ้งด้วย `ERROR :Input line too long`"
      ]}
    ],

    foundations: [
      { p: "หมวดนี้คือกลไก socket/buffer/อายุอ็อบเจกต์ ที่ตัดสินว่า server จะนิ่งหรือ crash" },
      { h: "รูปร่างของลูป" },
      { code: String.raw`_refreshPollOut()      // ขอ POLLOUT เฉพาะที่ out-buffer ไม่ว่าง
poll(&_pfds[0], n, 500)
for แต่ละ fd ที่มี revents:
      listen fd + POLLIN      -> accept (วนจน accept ล้มเหลว)
      POLLHUP|POLLERR|POLLNVAL-> ตัด client ทิ้ง
      POLLIN                  -> recv -> appendIn -> while(extractLine) dispatch
      POLLOUT                 -> send -> ลบเฉพาะจำนวน byte ที่ส่งไปจริง
_sweepDisconnected()   // ลบ client ที่ระบาย output หมดแล้ว`,
        cap: "timeout 500 ms ทำให้ SIGINT ตอบสนองไว; poll คืน -1 พร้อม EINTR ถือเป็นเรื่องปกติ ห้ามตาย", lang: "txt" },
      { note: "**เดินบน snapshot ของ vector** `pollfd` — `accept` เพิ่มสมาชิกและการตัด client ลบสมาชิก ทั้งสองอย่างทำให้ iterator ที่ถืออยู่กลางรอบเสียหาย" },
      { h: "5 บั๊กที่ตัดสินคะแนน" },
      { h: "บั๊ก 1: partial read — TCP ไม่มีขอบเขตข้อความ" },
      { p: "**ห้าม parse สิ่งที่** `recv()` **คืนมาโดยตรง** ให้ต่อท้าย buffer ต่อ client แล้วดึงออกมาเป็นบรรทัดก็ต่อเมื่อเจอ `\\n` เท่านั้น" },
      { code: String.raw`subject เทสต์ตรง ๆ ด้วย  nc -C  ส่งเป็น 3 packet:
    "com"   ->  buffer = "com"          ยังไม่มี \n : ไม่ทำอะไร
    "man"   ->  buffer = "comman"       ยังไม่มี \n : ไม่ทำอะไร
    "d\n"   ->  buffer = "command\n"    เจอ \n : dispatch "command" ครั้งเดียว`,
        cap: "server ที่ตอบ 3 ครั้งคือ server ที่ตกข้อนี้", lang: "txt" },
      { h: "บั๊ก 2: ตัวจบบรรทัดมี 2 แบบ" },
      { p: "irssi ส่ง `\\r\\n` แต่ `nc` ส่ง `\\n` เปล่า ๆ. **แยกด้วย** `\\n` **แล้วตัด** `\\r` **ท้ายทิ้งถ้ามี** และ **ส่งออกด้วย** `\\r\\n` **เสมอ**. `\\r` เดี่ยว ๆ ไม่ถือเป็นตัวจบบรรทัด" },
      { h: "บั๊ก 3: partial send" },
      { p: "`send()` บน socket non-blocking เขียนได้น้อยกว่าที่ขอเป็นเรื่องปกติ — **ลบออกจากคิวเท่าจำนวนที่คืนมาจริง** แล้วเก็บส่วนที่เหลือไว้ การถือว่า short write คือเขียนครบ = ข้อความถูกตัดหายเงียบ ๆ ตอนโหลดหนัก" },
      { code: String.raw`void Client::flush() {
    if (_out.empty()) return;
    ssize_t n = send(_fd, _out.data(), _out.size(), 0);
    if (n < 0) { _dead = true; return; }     // poll บอกว่าพร้อมแล้ว ค่าลบ = ตายจริง
    _out.erase(0, static_cast<size_t>(n));   // เท่าที่ส่งไปจริงเท่านั้น
}`, cap: "จุดนี้พังแล้วอาการคือ 'ข้อความหายเป็นบางครั้ง' ซึ่งหาสาเหตุยากมาก", lang: "cpp" },
      { h: "บั๊ก 4: POLLOUT ขอค้างไว้ = CPU 100%" },
      { p: "ขอ `POLLOUT` เฉพาะตอนที่ client นั้นมี byte ค้างอยู่จริง — เป็นกฎเดียวกับที่ตัวอย่าง `bircd` เขียนไว้ว่า `if (strlen(buf_write) > 0) FD_SET(i, &fd_write)`" },
      { h: "บั๊ก 5: ลบ client กลาง broadcast" },
      { p: "**handler ห้าม** `delete` **เด็ดขาด** ให้ทำเป็น 3 จังหวะแทน:" },
      { code: String.raw`1. mark: ตั้งธง _dead
      ตอน mark ให้ถอด client ออกจากทุกช่องทันที (ไม่ให้ container ไหนถือ pointer ค้าง)
      แล้ว broadcast QUIT ของมันออกไป
2. drain: ปล่อยให้ socket ระบาย out-buffer ที่เหลือ
3. sweep: ลบจริงตอนท้าย tick ใน _sweepDisconnected()`,
        cap: "อายุของอ็อบเจกต์ต้องยาวกว่าลูปที่กำลังวนอยู่เสมอ", lang: "txt" },
      { p: "และทำให้ `Client` **คัดลอกไม่ได้** (private copy ctor / assignment ใน C++98) เพราะมันเป็นเจ้าของ fd — สำเนาหนึ่งตัวหมายถึง `close()` ซ้ำสองครั้ง" },
      { h: "บั๊กโบนัส: SIGPIPE" },
      { p: "การเขียนลง socket ที่ปลายทางเพิ่งหายไปจะ **ฆ่าโปรเซสทิ้ง** เป็นค่าเริ่มต้น ใส่ `signal(SIGPIPE, SIG_IGN)` ใน `main` ไม่งั้น disconnect แบบกระทันหันครั้งแรกจบการ defense ทันที" },
      { h: "buffer ต่อ client" },
      { code: String.raw`class Client {
    int         _fd;
    std::string _in;        // byte ดิบที่ยังประกอบไม่ครบบรรทัด
    std::string _out;       // byte ที่รอส่ง
    bool        _passOk, _hasNick, _hasUser, _registered, _dead;
    std::string _nick, _user, _real, _host;
    std::set<std::string> _channels;   // เก็บเป็นชื่อ ไม่ใช่ pointer
};`, cap: "เก็บ 'ชื่อช่อง' แทน pointer ไปยัง Channel ทำให้ dangling pointer หายไปทั้งตระกูล", lang: "cpp" },
      { p: "**จำกัดขนาด** `_in` (เช่น 8 KiB): peer ที่ไม่เคยส่ง `\\n` เลยต้องไม่ทำให้ buffer โตไม่จำกัด — เกินแล้วตัดทิ้งพร้อม `ERROR :Input line too long`" }
    ],

    architecture: [
      { p: "แบ่งไฟล์ตามความรับผิดชอบ และขังทุก syscall ของ socket ไว้ที่เดียวเพื่อให้พิสูจน์กฎได้" },
      { h: "โครงไฟล์" },
      { code: String.raw`inc/                       src/
  Server.hpp                 main.cpp
  Client.hpp                 Server.cpp        ตั้งค่า/lifecycle
  Channel.hpp                ServerLoop.cpp    <- poll + recv/send ทั้งหมดอยู่ที่นี่
  Message.hpp                Dispatch.cpp      map ชื่อคำสั่ง -> handler
  Replies.hpp                Client.cpp
  Bot.hpp                    Channel.cpp
  Utils.hpp                  Message.cpp       parser ของไวยากรณ์ IRC
                             Replies.cpp       ผู้ผลิต numeric
                             Bot.cpp           bonus
                             Utils.cpp         casemapping, split, ...
                             commands/CmdRegister.cpp  PASS NICK USER QUIT
                                      CmdChannel.cpp   JOIN PART KICK INVITE TOPIC
                                      CmdMessage.cpp   PRIVMSG NOTICE PING PONG
                                      CmdMode.cpp      MODE`,
        cap: "แยก command ออกเป็นไฟล์ตามหมวด — ไฟล์เดียวยาว 800 บรรทัดคืออุปสรรคตอน debug", lang: "txt" },
      { h: "ความรับผิดชอบต่อคลาส" },
      { table: { head: ["คลาส/ไฟล์", "รับผิดชอบ", "ห้ามทำ"], rows: [
        ["`ServerLoop.cpp`", "**poll ตัวเดียว** + accept/recv/send ทั้งหมด", "ตีความคำสั่ง IRC"],
        ["`Dispatch.cpp`", "แมปชื่อคำสั่ง → ฟังก์ชัน + ตรวจว่าสมัครตัวหรือยัง", "แตะ socket"],
        ["`Message`", "แปลงบรรทัดดิบเป็น prefix/command/params", "รู้จัก Channel"],
        ["`Client`", "สถานะของผู้ใช้หนึ่งราย + buffer เข้า/ออก", "`delete` ตัวเอง"],
        ["`Channel`", "สมาชิก, operator, mode, topic, invite list", "ส่ง byte เอง"],
        ["`Replies`", "ผลิตสตริง numeric ให้ถูกรูปแบบ", "ตัดสินใจเชิงตรรกะ"],
        ["`Bot`", "nick เสมือนของ bonus", "เปิด socket ของตัวเอง"]
      ]}},
      { h: "ตาราง dispatch" },
      { code: String.raw`typedef void (Server::*Handler)(Client&, const Message&);
struct Entry { const char* name; Handler fn; bool needsRegistration; };

static const Entry TABLE[] = {
    { "PASS",    &Server::cmdPass,    false },
    { "NICK",    &Server::cmdNick,    false },
    { "USER",    &Server::cmdUser,    false },
    { "CAP",     &Server::cmdCap,     false },   // irssi ส่งมาก่อนทุกอย่าง
    { "PING",    &Server::cmdPing,    false },
    { "QUIT",    &Server::cmdQuit,    false },
    { "JOIN",    &Server::cmdJoin,    true  },
    { "PART",    &Server::cmdPart,    true  },
    { "PRIVMSG", &Server::cmdPrivmsg, true  },
    { "NOTICE",  &Server::cmdNotice,  true  },
    { "KICK",    &Server::cmdKick,    true  },
    { "INVITE",  &Server::cmdInvite,  true  },
    { "TOPIC",   &Server::cmdTopic,   true  },
    { "MODE",    &Server::cmdMode,    true  },
};`, cap: "ธง needsRegistration ทำให้ 451 เกิดที่เดียวแทนที่จะกระจายในทุก handler", lang: "cpp" },
      { p: "ชื่อคำสั่ง **ไม่สนตัวพิมพ์** — upper-case ก่อนค้นตาราง; ไม่เจอในตาราง → `421 ERR_UNKNOWNCOMMAND`" },
      { h: "โครงข้อมูลของ Channel" },
      { code: String.raw`class Channel {
    std::string           _name;      // เทียบด้วย ircLower เสมอ
    std::string           _topic;
    std::string           _key;       // mode k
    size_t                _limit;     // mode l (0 = ไม่จำกัด)
    bool                  _inviteOnly;  // mode i
    bool                  _topicLocked; // mode t
    std::set<std::string> _members;   // nick (fold แล้ว)
    std::set<std::string> _operators;
    std::set<std::string> _invited;   // ใช้แล้วลบทิ้ง
};`, cap: "เก็บ nick ไม่เก็บ pointer — client ที่หายไปจึงไม่ทิ้งขยะไว้", lang: "cpp" },
      { h: "ทะเบียนกลางที่ Server ถือ" },
      { table: { head: ["ทะเบียน", "คีย์", "ใช้ทำอะไร"], rows: [
        ["`_clients`", "fd", "หา client จาก event ของ poll"],
        ["`_nickIndex`", "nick ที่ fold แล้ว", "ตรวจ nick ซ้ำและหาเป้าของ PRIVMSG ในเวลา O(log n)"],
        ["`_channels`", "ชื่อช่องที่ fold แล้ว", "หาช่องและลบทิ้งเมื่อว่าง"],
        ["`_pfds`", "—", "array ที่ประกอบใหม่ก่อน poll ทุกรอบ"]
      ]}},
      { note: "**ทุกครั้งที่ nick เปลี่ยน ต้องอัปเดต** `_nickIndex` **เป็นอะตอม** (ลบคีย์เก่า ใส่คีย์ใหม่) ลืมข้อนี้แล้วจะเกิด nick ผีที่จองชื่อไว้แต่ไม่มีตัวตน" }
    ],

    dataflow: [
      { p: "ตาม byte หนึ่งชุดตั้งแต่เข้ามาถึงตอนถูก broadcast ออกไป" },
      { h: "หนึ่ง tick" },
      { code: String.raw`1. refreshPollOut()   ต่อ client: events = POLLIN | (out ว่าง ? 0 : POLLOUT)
2. poll(..., 500ms)   -1 + EINTR = ปกติ, วนใหม่
3. เดิน snapshot ของ pfds:
     listener POLLIN -> accept วนจนล้มเหลว -> O_NONBLOCK -> ลงทะเบียน
     POLLHUP/ERR     -> markDead(fd)
     POLLIN          -> recv -> _in += ... -> while (extractLine) dispatch
     POLLOUT         -> flush() (ลบเท่าที่ส่งจริง)
4. sweepDisconnected(): client ที่ _dead และ _out ว่าง -> ลบจริง`,
        cap: "ลบจริงเกิดที่เดียวเสมอ ทำให้ pointer ไม่ค้างกลางลูป", lang: "txt" },
      { h: "จาก byte ดิบเป็นคำสั่ง" },
      { code: String.raw`recv ได้ "NICK alice\r\nUSER a 0 * :Alice\r\nJOIN #4"

_in = "NICK alice\r\nUSER a 0 * :Alice\r\nJOIN #4"

extractLine -> "NICK alice"          (ตัด \r ท้าย)   -> dispatch
extractLine -> "USER a 0 * :Alice"                   -> dispatch
extractLine -> ไม่มี \n แล้ว          -> _in = "JOIN #4"  เก็บรอ byte ถัดไป`,
        cap: "หนึ่ง recv อาจได้ 0, 1 หรือหลายคำสั่ง — ลูป while จึงจำเป็น", lang: "txt" },
      { h: "เส้นทางของ JOIN" },
      { code: String.raw`JOIN #42 secret
 -> ตรวจสมัครตัวแล้วหรือยัง          ไม่ -> 451
 -> พารามิเตอร์ครบไหม                ไม่ -> 461
 -> ชื่อช่องขึ้นต้นด้วย # หรือ & ไหม  ไม่ -> 403
 -> ช่องมีอยู่แล้วหรือเปล่า
      ไม่มี -> สร้างใหม่ + ผู้สร้างได้ +o
      มี    -> ตรวจตามลำดับ:  invite-only(+i) ไม่ได้ถูกเชิญ -> 473
                              key(+k) ไม่ตรง                -> 475
                              limit(+l) เต็ม                -> 471
 -> เพิ่มเข้า _members, ลบออกจาก _invited (invite ใช้ครั้งเดียว)
 -> broadcast ":alice!user@host JOIN #42" ให้สมาชิกทุกคน (รวมตัวเอง)
 -> ส่งให้คนเข้าใหม่:  332 หรือ 331 (topic)
                       353 (รายชื่อ พร้อม @ นำหน้า operator)
                       366 (จบรายชื่อ)`,
        cap: "JOIN ต้องส่งกลับให้ตัวผู้ join ด้วย ไม่งั้น client จะไม่รู้ว่าเข้าห้องสำเร็จ", lang: "txt" },
      { h: "เส้นทางของ PRIVMSG" },
      { code: String.raw`PRIVMSG #42 :hello everyone
 -> ไม่มีผู้รับ -> 411 ;  ไม่มีข้อความ -> 412
 -> ผู้รับขึ้นต้นด้วย # หรือ & ?
      ใช่ -> ช่องมีอยู่ไหม           ไม่ -> 403
             ผู้ส่งอยู่ในช่องไหม      ไม่ -> 404
             ส่งให้สมาชิกทุกคน ยกเว้นผู้ส่ง
      ไม่  -> หา nick ใน _nickIndex  ไม่เจอ -> 401
             ส่งให้คนเดียว
 -> รูปแบบที่ส่งออก:
      :alice!user@host PRIVMSG #42 :hello everyone

NOTICE เดินเส้นทางเดียวกันทุกประการ แต่ทุกจุดที่ PRIVMSG ตอบ error
ให้ NOTICE เงียบแทน`,
        cap: "การใส่ prefix ของผู้ส่งคือสิ่งที่ทำให้ client แสดงชื่อคนพูดได้ถูก", lang: "txt" },
      { h: "เส้นทางของ QUIT และการตัดการเชื่อมต่อ" },
      { code: String.raw`QUIT :bye   (หรือ socket ตาย / POLLHUP)
 -> markDead(client)
      สำหรับทุกช่องที่ client อยู่:
          ลบออกจาก _members และ _operators
          broadcast ":alice!user@host QUIT :bye" ให้สมาชิกที่เหลือ
          ถ้าช่องว่างแล้ว -> ทำลายช่องทิ้ง
      ลบ nick ออกจาก _nickIndex
 -> ปล่อยให้ _out ระบายจนหมด
 -> sweepDisconnected() ปิด fd และ delete จริง`,
        cap: "ลำดับนี้ทำให้ไม่มี container ไหนถือ pointer ที่ถูกลบไปแล้ว", lang: "txt" },
      { h: "เส้นทางของ MODE ที่มีหลายตัวอักษร" },
      { code: String.raw`MODE #42 +itk-o secret bob

sign = '+'
  i -> ตั้ง inviteOnly = true        (ไม่กิน arg)   changed += "i"
  t -> ตั้ง topicLocked = true       (ไม่กิน arg)   changed += "t"
  k -> กิน arg "secret"; มี key อยู่แล้ว? -> 467 แล้วข้าม
sign = '-'
  o -> กิน arg "bob"; bob เป็นสมาชิกไหม? ไม่ -> 441
       ถอด operator                              changed += "o", args += "bob"

broadcast บรรทัดเดียว:  :alice!user@host MODE #42 +it-o bob`,
        cap: "สะสม 'สิ่งที่เปลี่ยนจริง' ไว้แล้วค่อยประกาศครั้งเดียว ไม่ประกาศทีละตัวอักษร", lang: "txt" },
      { h: "ทำไม irssi ถึงต่อแล้วค้าง" },
      { table: { head: ["อาการ", "สาเหตุ"], rows: [
        ["ค้างตั้งแต่ต่อ ไม่มีอะไรเกิดขึ้น", "ไม่ตอบ `CAP LS` — irssi ส่งแล้ว **รอ**"],
        ["ต่อได้แล้วหลุดเองใน ~1 นาที", "ไม่ตอบ `PING` client ถือว่าสายตาย"],
        ["ต่อได้แต่ join ช่องไม่ได้เลย", "ไม่ส่ง `005 RPL_ISUPPORT`"],
        ["ทุก join มี error เรื่อง ban list", "ไม่ตอบ `MODE #chan b` — ให้ตอบ `368` แบบว่างเปล่า"]
      ]}},
      { p: "ตอบ `:<server> CAP * LS :` (รายการว่าง) และ `NAK` ทุก `CAP REQ` ก็พอสำหรับ subject นี้ ส่วน ban list อยู่นอกขอบเขต ให้ตอบ `368 RPL_ENDOFBANLIST` แบบว่าง **แทนที่จะตอบ** `482` ไม่งั้น client จะขึ้น error ทุกครั้งที่ join" }
    ],

    implementation: [
      { p: "โครงโค้ด C++98 ที่เอาไปต่อได้ทันที" },
      { h: "1) ตั้ง listener" },
      { code: String.raw`int Server::setupListener(int port) {
    int fd = socket(AF_INET, SOCK_STREAM, 0);
    int yes = 1;
    setsockopt(fd, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(yes));
    fcntl(fd, F_SETFL, O_NONBLOCK);              // non-blocking รวม listener ด้วย

    struct sockaddr_in a;
    std::memset(&a, 0, sizeof(a));
    a.sin_family      = AF_INET;
    a.sin_addr.s_addr = htonl(INADDR_ANY);
    a.sin_port        = htons(static_cast<uint16_t>(port));
    if (bind(fd, (struct sockaddr*)&a, sizeof(a)) < 0) throw std::runtime_error("bind");
    if (listen(fd, SOMAXCONN) < 0)                     throw std::runtime_error("listen");
    return fd;
}`, cap: "SO_REUSEADDR ต้องมาก่อน bind ไม่งั้นรีสตาร์ตเร็ว ๆ จะ bind ไม่ติด", lang: "cpp" },
      { h: "2) ดึงบรรทัดออกจาก buffer" },
      { code: String.raw`bool Client::extractLine(std::string& out) {
    std::string::size_type nl = _in.find('\n');
    if (nl == std::string::npos) {
        if (_in.size() > MAX_IN)                   // peer ที่ไม่เคยส่ง \n
            { send_(":ircserv ERROR :Input line too long\r\n"); _dead = true; }
        return false;
    }
    out = _in.substr(0, nl);
    _in.erase(0, nl + 1);
    if (!out.empty() && out[out.size() - 1] == '\r')   // irssi ส่ง \r\n, nc ส่ง \n
        out.erase(out.size() - 1);
    return true;
}`, cap: "ทั้งหมดของ 'บั๊ก com/man/d' อยู่ในฟังก์ชันนี้ฟังก์ชันเดียว", lang: "cpp" },
      { h: "3) parse ไวยากรณ์ IRC" },
      { code: String.raw`Message Message::parse(const std::string& line) {
    Message m;
    size_t i = 0;
    if (i < line.size() && line[i] == ':') {          // prefix (client มักไม่ส่ง)
        size_t sp = line.find(' ', i);
        m.prefix = line.substr(1, sp - 1);
        i = (sp == std::string::npos) ? line.size() : sp + 1;
    }
    while (i < line.size() && line[i] == ' ') ++i;
    size_t sp = line.find(' ', i);
    m.command = line.substr(i, sp - i);
    toUpperInPlace(m.command);

    i = (sp == std::string::npos) ? line.size() : sp + 1;
    while (i < line.size() && m.params.size() < 15) {
        while (i < line.size() && line[i] == ' ') ++i;
        if (i >= line.size()) break;
        if (line[i] == ':') { m.params.push_back(line.substr(i + 1)); break; }
        sp = line.find(' ', i);
        m.params.push_back(line.substr(i, sp - i));
        i = (sp == std::string::npos) ? line.size() : sp;
    }
    return m;
}`, cap: "trailing ที่ขึ้นต้นด้วย : กินทุกอย่างจนจบบรรทัด รวมช่องว่าง", lang: "cpp" },
      { h: "4) เงื่อนไขสมัครตัวสำเร็จ" },
      { code: String.raw`void Server::tryRegister(Client& c) {
    if (c.registered() || !c.passOk() || !c.hasNick() || !c.hasUser()) return;
    c.setRegistered(true);
    c.send_(rpl001(c)); c.send_(rpl002(c)); c.send_(rpl003(c)); c.send_(rpl004(c));
    c.send_(rpl005(c));                       // ขาดไม่ได้ ไม่งั้น irssi join ไม่ได้
}`, cap: "เรียกฟังก์ชันนี้ท้าย cmdPass, cmdNick และ cmdUser ทั้งสามตัว", lang: "cpp" },
      { h: "5) NICK พร้อมตรวจซ้ำและอัปเดตดัชนี" },
      { code: String.raw`void Server::cmdNick(Client& c, const Message& m) {
    if (m.params.empty())            return c.send_(err431(c));
    const std::string& want = m.params[0];
    if (!validNick(want))            return c.send_(err432(c, want));

    std::string key = ircFold(want);
    std::map<std::string, Client*>::iterator it = _nickIndex.find(key);
    if (it != _nickIndex.end() && it->second != &c)
        return c.send_(err433(c, want));            // คนเดิมเก็บชื่อไว้ ไม่บังคับเปลี่ยน

    if (c.registered()) {                            // เปลี่ยนชื่อกลางคัน
        std::string line = ":" + c.mask() + " NICK :" + want + "\r\n";
        broadcastToPeers(c, line);                   // แจ้งทุกช่องที่อยู่ร่วมกัน
    }
    if (!c.nick().empty()) _nickIndex.erase(ircFold(c.nick()));   // อะตอม: ลบเก่า
    _nickIndex[key] = &c;                                          //        ใส่ใหม่
    c.setNick(want);
    c.setHasNick(true);
    tryRegister(c);
}`, cap: "ลืมลบคีย์เก่าออกจากดัชนีคือที่มาของ 'nick ผี' ที่จองชื่อค้างไว้", lang: "cpp" },
      { h: "6) MODE ที่ประมวลผลทีละตัวอักษร" },
      { code: String.raw`char sign = '+';
size_t argi = 2;                       // param[0]=ช่อง, param[1]=สตริง mode
std::string changed, changedArgs;
const std::string& str = m.params[1];

for (size_t i = 0; i < str.size(); ++i) {
    char ch = str[i];
    if (ch == '+' || ch == '-') { sign = ch; appendSign(changed, sign); continue; }
    switch_on(ch):
        case 'i': ch_.setInviteOnly(sign == '+');   changed += 'i'; break;
        case 't': ch_.setTopicLocked(sign == '+');  changed += 't'; break;
        case 'k': if (sign == '+') {
                      if (argi >= m.params.size()) break;        // ไม่มี arg -> ข้าม
                      if (ch_.hasKey()) { c.send_(err467(c, ch_)); break; }
                      ch_.setKey(m.params[argi]);
                      changed += 'k'; changedArgs += " " + m.params[argi++];
                  } else { ch_.clearKey(); changed += 'k'; }
                  break;
        case 'o': ... ถ้าเป้าไม่ใช่สมาชิก -> err441 แล้ว break ...
        case 'l': ...
        default:  c.send_(err472(c, ch)); break;    // ไม่รู้จัก แต่ทำตัวถัดไปต่อ
}
if (!changed.empty())
    ch_.broadcast(":" + c.mask() + " MODE " + ch_.name() + " " + changed + changedArgs + "\r\n");`,
        cap: "C++98 ไม่มี switch บน string — ใช้ switch บน char ตรง ๆ ได้เลย", lang: "cpp" },
      { h: "7) broadcast ที่ปลอดภัยต่อการตัดการเชื่อมต่อ" },
      { code: String.raw`void Channel::broadcast(const std::string& line, const Client* except) {
    // เดินสำเนาของรายชื่อ เพราะ handler อาจ mark ใครสักคนว่าตายระหว่างทาง
    std::set<std::string> snapshot = _members;
    for (std::set<std::string>::const_iterator it = snapshot.begin();
         it != snapshot.end(); ++it) {
        Client* cl = _server.findByNick(*it);
        if (cl && cl != except) cl->send_(line);     // send_ แค่ต่อท้าย _out
    }
}`, cap: "send_ ไม่เรียก syscall — มันแค่คิวไว้ให้ POLLOUT ส่งทีหลัง", lang: "cpp" },
      { h: "8) Makefile ที่มี bonus" },
      { code: String.raw`NAME    = ircserv
CXX     = c++
CXXFLAGS= -Wall -Wextra -Werror -std=c++98 -MMD -MP -Iinc
SRCS    = $(shell find src -name '*.cpp' ! -name 'Bot.cpp')
BSRCS   = $(shell find src -name '*.cpp')
OBJS    = $(SRCS:src/%.cpp=obj/%.o)
BOBJS   = $(BSRCS:src/%.cpp=obj_b/%.o)

all: $(NAME)
$(NAME): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $(OBJS)
bonus: CXXFLAGS += -DWITH_BOT
bonus: $(BOBJS)
	$(CXX) $(CXXFLAGS) -o $(NAME) $(BOBJS)
obj/%.o obj_b/%.o: src/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -c $< -o $@
-include $(OBJS:.o=.d) $(BOBJS:.o=.d)
clean:  ; rm -rf obj obj_b
fclean: clean ; rm -f $(NAME)
re: fclean all
.PHONY: all bonus clean fclean re`,
        cap: "แยก obj ของ mandatory กับ bonus ไม่งั้น make bonus แล้ว make จะ relink ทุกครั้ง", lang: "make" },
      { h: "9) เทสต์ด้วยมือที่คุ้มที่สุด" },
      { code: String.raw`# เทสต์ partial read ตามที่ subject บอกไว้ตรง ๆ
nc -C 127.0.0.1 6667
PASS secret
NICK bob
USER b 0 * :Bob
JOIN #42
PRIVMSG #42 :hi

# แยก packet จริง ๆ (ต้องได้คำตอบครั้งเดียว)
printf 'PRIVM' | nc -q1 127.0.0.1 6667 &
# หรือใช้สคริปต์ python ส่งทีละไบต์พร้อม sleep

# client จริง
irssi -c 127.0.0.1 -p 6667 -w secret`,
        cap: "ผ่าน nc อย่างเดียวไม่พอ — irssi คือด่านที่จับบั๊ก CAP/PING/005 ได้", lang: "bash" }
    ],

    tricks: [
      { h: "ทริค 1 — ทำ 3 กฎโครงสร้างให้ grep เจอได้" },
      { p: "ขังทุก syscall ของ socket ไว้ใน `ServerLoop.cpp` ไฟล์เดียว แล้วใส่ gate นี้ในสคริปต์เทสต์ **ระดับ L0**: เจอ `fork(` = ตก, เจอ `poll(` มากกว่า 1 = ตก, เจอ `recv(`/`send(` นอกไฟล์นั้น = ตก. ผู้ตรวจจะ grep แบบนี้แหละ ทำเองก่อนดีกว่า" },
      { h: "ทริค 2 — bonus bot ต้องไม่ใช่ client" },
      { p: "subject **ห้ามเขียน IRC client** ดังนั้น bot ต้องเป็น **nick เสมือน** ที่ server ตอบแทน:" },
      { ul: [
        "จองชื่อไว้ — ใครพยายาม `NICK ircbot` ได้ `433`",
        "ตอบกลับด้วย prefix `ircbot!bot@<server>` **ผ่านเส้นทางส่งเดียวกับ PRIVMSG ปกติ**",
        "trigger จาก query ส่วนตัวถึง nick นั้น หรือจากข้อความในช่องที่ขึ้นต้นด้วย `!`",
        "**และยังต้อง relay ข้อความต้นฉบับเข้าช่องตามปกติ** — bot สังเกตการณ์ ไม่ใช่กลืนข้อความ"
      ]},
      { h: "ทริค 3 — file transfer คือ DCC และ DCC เป็น peer-to-peer" },
      { p: "ข้อเสนอเดินทางเป็น CTCP ที่ซ่อนอยู่ใน `PRIVMSG` ธรรมดา — **หน้าที่จริงของ server คือ relay ให้ครบทุก byte รวมเครื่องหมาย** `\\x01` ผิดไปตัวเดียวการโอนพัง" },
      { code: String.raw`\x01DCC SEND <filename> <ip-as-uint32> <port> <size>\x01`,
        cap: "server ไม่ได้ส่งไฟล์เอง — ไฟล์วิ่งตรงระหว่าง client สองเครื่อง", lang: "txt" },
      { note: "**กับดักการ parse:** ชื่อไฟล์มีช่องว่างได้ (จะใส่เครื่องหมายคำพูดหรือไม่ก็ได้) ให้อ่าน address, port และ size จาก **3 ฟิลด์สุดท้าย** แล้วถือว่าทุกอย่างระหว่าง `SEND` กับสามตัวนั้นคือชื่อไฟล์ ตัดเครื่องหมายคำพูดออก — ถ้าใช้ index ตายตัว port จะกลายเป็น size เงียบ ๆ" },
      { p: "การบันทึกข้อเสนอไว้ (เพื่อให้คำสั่ง `!dcc` ลิสต์ได้ และเพื่อลบทิ้งเมื่อฝ่ายใดฝ่ายหนึ่งหลุด) คือสิ่งที่ทำให้ฟีเจอร์นี้ 'มองเห็นได้' จากฝั่ง server" },
      { h: "ทริค 4 — bircd ที่แถมมากับ subject" },
      { p: "`bircd.tar.gz` เป็น server ภาษา C บน `select()` ขนาดเล็ก **ใช้เป็นแบบอ้างอิงรูปร่างเท่านั้น** — event loop และกฎ 'arm write เฉพาะตอน buffer ไม่ว่าง' ของมันถูกต้อง" },
      { p: "**อย่าลอก**: มันเป็น C, ใช้ `select()`, broadcast ผลของ `recv()` ดิบ ๆ โดยไม่ประกอบ packet ใหม่ (ซึ่งตกเทสต์ IV.3 ของ subject เอง) และเมิน return value ของ `send()`" },
      { p: "ถ้า `gzip`/`tar` บนเครื่องหนึ่งรายงาน CRC ผิดพลาด ลอง `gzip -dc` ใน WSL — archive นี้เป็น multi-member gzip ที่ตัวอ่านบางตัวจัดการไม่ถูก" },
      { h: "ทริค 5 — กับดักที่ทำให้เสียเวลามากที่สุด" },
      { table: { head: ["อาการ", "สาเหตุจริง"], rows: [
        ["CPU 100% ทั้งที่ไม่มีใครพิมพ์", "POLLOUT ขอค้างไว้ตลอด"],
        ["ข้อความหายเป็นครั้งคราวตอนคนเยอะ", "ไม่จัดการ partial send"],
        ["ตอบซ้ำ 3 ครั้งเมื่อทดสอบด้วย nc แยก packet", "parse ผลของ recv โดยตรง ไม่ได้สะสม buffer"],
        ["crash หลังมีคน QUIT ระหว่างคนอื่นคุยกัน", "`delete` ใน handler / container ถือ pointer ค้าง"],
        ["โปรเซสตายเงียบตอน client ปิดกระทันหัน", "ไม่ได้ ignore SIGPIPE"],
        ["irssi ต่อแล้วนิ่ง", "ไม่ตอบ CAP LS"],
        ["irssi ต่อได้แต่ join ไม่ติด", "ไม่ส่ง 005"],
        ["`Nick[]` กับ `nick{}` อยู่ร่วมกันได้", "ใช้ tolower แทน casemapping ของ RFC 1459"],
        ["`nc` พิมพ์แล้วไม่มีอะไรเกิดขึ้น", "รับเฉพาะ `\\r\\n` แต่ nc ส่ง `\\n` เปล่า"]
      ]}},
      { h: "ทริค 6 — เขียนกฎที่ subject เปิดไว้ลงไฟล์" },
      { p: "การตัดสินใจที่ subject ไม่ได้ระบุ (nick ซ้ำทำยังไง, ช่องว่างแล้วทำยังไง, invite ใช้ได้กี่ครั้ง) **ถ้าไม่เขียนไว้ มันจะเลื่อนไปเรื่อย ๆ ระหว่างแก้โค้ด** เขียนเป็น `docs/DECISIONS.md` แล้วทำเทสต์ครอบไว้หนึ่งเคสต่อหนึ่งข้อ ตอน defense ก็เปิดให้ดูได้เลย" },
      { h: "ทริค 7 — เทสต์ที่ควรมีก่อน defense" },
      { ul: [
        "**partial read**: ส่ง `com` / `man` / `d\\n` แยก 3 packet แล้วต้องตอบครั้งเดียว",
        "**partial send**: ยัด client ที่ไม่ยอมอ่าน (หยุด process ด้วย SIGSTOP) แล้วยิงข้อความเยอะ ๆ server ต้องไม่ค้างและไม่ทำข้อความหาย",
        "**flood**: 100 connection พร้อมกัน + ข้อความรัว ๆ วัดว่า RAM นิ่ง",
        "**abrupt disconnect**: ฆ่า client กลาง broadcast แล้ว server ต้องรอด",
        "**valgrind**: ปิดด้วย SIGINT แล้วต้องไม่ leak และไม่มี invalid read/write",
        "**irssi จริง**: join, msg, mode +o, kick, invite, topic ครบวง"
      ]}
    ],

    eval: [
      { p: "คำถามที่ผู้ตรวจถามจริง — สามข้อแรกถามแน่นอนทุกครั้ง" },
      { qa: [
        { q: "ทำไมต้อง poll() ตัวเดียว และมันทำงานยังไง",
          a: "server เป็นโปรเซสเดียวไม่มี thread แต่ต้องดูแล fd จำนวนมาก poll คือจุดเดียวที่บอกว่าตัวไหนพร้อมอ่าน/เขียน แล้วเราค่อยแตะเฉพาะตัวนั้น — subject ระบุตรง ๆ ว่าการเรียก recv/send บน fd ที่ poll ไม่ได้บอกว่าพร้อม คือ 0 คะแนน" },
        { q: "ทำไม fd ต้อง non-blocking ทั้งที่มี poll แล้ว",
          a: "poll บอกแค่ว่า 'น่าจะพร้อม' ไม่ได้รับประกันจำนวน byte ถ้า `send` เขียนได้ไม่ครบบน fd แบบ blocking มันจะค้างรอ และทั้ง server หยุดให้บริการทุกคน" },
        { q: "มี fork() ในโปรเจกต์ไหม",
          a: "ไม่มีเลย — subject ห้าม และ grep พิสูจน์ได้ ทุกอย่างทำในโปรเซสเดียวผ่าน event loop" },
        { q: "จัดการกรณีคำสั่งเดียวมาแยกหลาย packet ยังไง",
          a: "ต่อ byte ที่ได้เข้า buffer ต่อ client แล้วดึงบรรทัดออกเฉพาะเมื่อเจอ `\\n` — เทสต์ตรง ๆ ของ subject คือส่ง `com`, `man`, `d\\n` เป็น 3 packet แล้ว server ต้องประมวลผล `command` ครั้งเดียว" },
        { q: "แล้วกรณีตรงข้าม — หลายคำสั่งมาใน packet เดียว",
          a: "ใช้ลูป `while (extractLine(...))` ดึงออกจนกว่าจะไม่มี `\\n` เหลือ ส่วนที่เหลือค้างไว้ใน buffer รอ byte ถัดไป" },
        { q: "partial send คืออะไร จัดการยังไง",
          a: "`send()` บน socket non-blocking เขียนได้น้อยกว่าที่ขอเป็นเรื่องปกติ ต้องลบออกจากคิวเท่าค่าที่คืนมาจริงและเก็บส่วนที่เหลือไว้ส่งรอบหน้า ไม่งั้นข้อความจะถูกตัดหายเงียบ ๆ ตอนโหลดหนัก" },
        { q: "ทำไม POLLOUT ถึงห้ามขอค้างไว้",
          a: "socket ที่ว่างจะรายงานว่าเขียนได้ตลอดเวลา poll จึงคืนทันทีทุกรอบและ CPU วิ่ง 100% ต้องขอเฉพาะตอนที่ client นั้นมี byte ค้างจริง" },
        { q: "ลบ client ตอนไหน ทำไมไม่ลบทันที",
          a: "ห้าม delete ใน handler เพราะเราอาจกำลังวน broadcast อยู่ ให้ mark ว่าตาย ถอดออกจากทุกช่อง broadcast QUIT แล้วปล่อยให้ระบาย output จนหมด ค่อยลบจริงใน sweep ท้าย tick" },
        { q: "ทำไม Client ต้องคัดลอกไม่ได้",
          a: "มันเป็นเจ้าของ fd — สำเนาหนึ่งตัวหมายถึงมี destructor สองตัวที่ `close()` fd เดียวกัน ซึ่งอาจไปปิด fd ของ client อื่นที่เพิ่งได้เลขเดิมมา" },
        { q: "SIGPIPE เกี่ยวอะไร",
          a: "การเขียนลง socket ที่ปลายทางเพิ่งหายไปทำให้ระบบส่ง SIGPIPE ซึ่งค่าเริ่มต้นคือฆ่าโปรเซส ต้อง `signal(SIGPIPE, SIG_IGN)` ใน main แล้วอาศัยค่า return ของ send แทน" },
        { q: "อธิบายลำดับการสมัครตัว",
          a: "PASS ถูกต้อง แล้ว NICK กับ USER (มาสลับลำดับกันได้) ครบเมื่อ passOk && hasNick && hasUser จึงส่ง 001-004 ก่อนหน้านั้นคำสั่งอื่นได้ 451, PASS ผิดได้ 464 แล้วปิด link" },
        { q: "ทำไม irssi ต่อแล้วค้าง",
          a: "irssi เปิดด้วย `CAP LS` แล้วรอคำตอบ ต้องตอบ `:<server> CAP * LS :` เป็นรายการว่าง และ NAK ทุก CAP REQ นอกจากนี้มันคาดว่าจะได้คำตอบ PING ไม่งั้นถือว่าสายตาย" },
        { q: "005 RPL_ISUPPORT จำเป็นไหม",
          a: "subject ไม่ได้บอก แต่จำเป็นจริง — ถ้าไม่มี irssi จะส่ง `JOIN :` เปล่าตอนต่อ แล้วจะ join ช่องไม่ได้อีกเลย เป็นบั๊กที่ผ่านทุกเทสต์ระดับ socket แล้วไปพังกับ client จริง" },
        { q: "casemapping ของ IRC ต่างจาก tolower ยังไง",
          a: "RFC 1459 ถือว่า `[]\\~` เท่ากับ `{}|^` เพราะเป็นอักษรสแกนดิเนเวีย การเทียบ nick และชื่อช่องต้อง fold แบบนี้ ไม่งั้น `Nick[]` กับ `nick{}` จะเป็นคนละคน" },
        { q: "PRIVMSG กับ NOTICE ต่างกันตรงไหน",
          a: "เดินเส้นทางเดียวกันและส่งถึงผู้รับเหมือนกัน แต่ NOTICE ห้ามตอบ error กลับไปเด็ดขาด เพื่อไม่ให้บอตสองตัวตอบ error ใส่กันเป็นลูปไม่รู้จบ" },
        { q: "อธิบาย MODE +o และการเก็บ argument",
          a: "อ่านตัวอักษรจากซ้ายไปขวา ตัวที่ต้องการ argument (k, o, l ตอน +) กิน argument ถัดไปตามลำดับ; `o` ให้/ถอน operator และถ้าเป้าไม่ได้อยู่ในช่องตอบ 441 สุดท้าย broadcast บรรทัดเดียวที่สรุปเฉพาะสิ่งที่เปลี่ยนจริง" },
        { q: "ช่องถูกทำลายเมื่อไร",
          a: "เมื่อสมาชิกคนสุดท้ายออก — เพื่อไม่ให้ topic, mode และรายชื่อ operator เก่าฟื้นคืนชีพเมื่อมีคนสร้างชื่อเดิมใหม่" },
        { q: "invite ใช้ได้กี่ครั้ง",
          a: "ครั้งเดียว ถูกใช้ตอน join แล้วลบทิ้ง ถ้าถูก kick ออกมาต้องขอ invite ใหม่ — เป็นการตัดสินใจที่ subject เปิดไว้ เราจึงเขียนไว้ใน DECISIONS และมีเทสต์ครอบ" },
        { q: "จำกัดขนาดข้อความยังไง",
          a: "หนึ่งบรรทัดไม่เกิน 512 byte รวม CRLF ตาม RFC และ buffer สะสมมีเพดาน (เช่น 8 KiB) — peer ที่ไม่เคยส่ง `\\n` จะถูกตัดด้วย `ERROR :Input line too long` ไม่ให้ memory โตไม่จำกัด" },
        { q: "bot ของ bonus เป็น client ใช่ไหม",
          a: "ไม่ใช่ — subject ห้ามเขียน IRC client มันเป็น nick เสมือนที่ server จองไว้และตอบแทน โดยส่งผ่านเส้นทางเดียวกับ PRIVMSG ปกติ และยัง relay ข้อความต้นฉบับเข้าช่องตามเดิม" },
        { q: "DCC ทำงานยังไง server ทำอะไรบ้าง",
          a: "ข้อเสนอเป็น CTCP อยู่ใน PRIVMSG ปกติ ไฟล์จริงวิ่งตรงระหว่าง client สองเครื่อง หน้าที่ server คือ relay ให้ครบทุก byte รวม `\\x01` และอ่าน ip/port/size จาก 3 ฟิลด์สุดท้ายเพราะชื่อไฟล์มีช่องว่างได้" }
      ]},
      { h: "เช็กลิสต์ก่อน defense" },
      { ul: [
        "`grep` ไม่เจอ `fork(`, เจอ `poll(` ที่เดียว, socket syscall อยู่ไฟล์เดียว",
        "`irssi` ต่อได้ครบวง: join, privmsg, mode +o/+i/+t/+k/+l, kick, invite, topic",
        "เทสต์ `com`/`man`/`d\\n` แยก 3 packet ผ่าน",
        "ปิด client กระทันหันกลาง broadcast แล้ว server รอด",
        "2 client ชื่อซ้ำได้ 433 และคนเดิมยังใช้ชื่อได้",
        "`nc` ที่ส่ง `\\n` เปล่าใช้งานได้เหมือน irssi ที่ส่ง `\\r\\n`",
        "valgrind สะอาดหลัง SIGINT",
        "CPU ~0% ตอนไม่มีใครพิมพ์"
      ]},
      { links: [
        { label: "RFC 1459 — Internet Relay Chat Protocol", url: "https://datatracker.ietf.org/doc/html/rfc1459", note: "ไวยากรณ์ข้อความ, casemapping, numeric ดั้งเดิม" },
        { label: "RFC 2812 — IRC Client Protocol", url: "https://datatracker.ietf.org/doc/html/rfc2812", note: "รายละเอียดคำสั่งฝั่ง client และกฎของ NOTICE" },
        { label: "modern IRC client protocol (ircdocs)", url: "https://modern.ircdocs.horse/", note: "สรุปที่อ่านง่ายกว่า RFC มาก + RPL_ISUPPORT" },
        { label: "IRC numerics list (ircdocs)", url: "https://defs.ircdocs.horse/defs/numerics.html", note: "เปิดค้างไว้ตอนเขียน Replies.cpp" },
        { label: "Beej's Guide to Network Programming", url: "https://beej.us/guide/bgnet/", note: "socket, poll, non-blocking แบบปูพื้น" }
      ]}
    ]
  }
});

Object.assign(window.TEACHING_EN, {
  ft_irc: {
    principle: [
      { h: "What the project asks for" },
      { p: "Write an **IRC server **in C++98, run as** `./ircserv <port> <password>`**, that** a real client** (irssi, HexChat) can connect to and chat through: register with PASS/NICK/USER, join channels, send messages, and give operators KICK / INVITE / TOPIC / MODE." },
      { p: "**No norminette** — a C++ project built with `-Wall -Wextra -Werror -std=c++98`, no Boost, no external libraries." },
      { h: "The three structural rules graded before any feature" },
      { table: { head: ["Rule", "How to satisfy it"], rows: [
        ["**No** `fork()`", "One process, always, no exceptions"],
        ["**One** `poll()` (or equivalent) for listening, reading and writing", "Calling `recv`/`send` on a descriptor poll did not report ready is **an explicit zero** in the subject text"],
        ["**Every descriptor non-blocking**", "Including the listening socket"]
      ]}},
      { p: "Make them auditable: **confine every socket syscall to a single file** (e.g. `src/ServerLoop.cpp`) and grep for it in your test suite" },
      { code: String.raw`grep -rn 'fork(' src inc                       # must be empty
grep -rnE '(^|[^._>:a-zA-Z])poll[[:space:]]*\(' src inc   # must find exactly one
grep -rln 'recv(\|send(\|accept(' src            # should list one file`,
        cap: "A rule you can prove with grep is a rule that does not slip", lang: "bash" },
      { h: "What using it looks like" },
      { code: String.raw`$ ./ircserv 6667 secret
[ircserv] listening on port 6667

$ irssi -c 127.0.0.1 -p 6667 -w secret
/join #42
/msg #42 hello
/mode #42 +o bob
/kick #42 charlie :spamming`,
        cap: "The real goal is a real client connecting, not nc passing", lang: "bash" },
      { h: "IRC is a one-line-per-message protocol" },
      { code: String.raw`[":" prefix SP] command *( SP middle ) [SP ":" trailing]

:alice!user@host PRIVMSG #42 :hello everyone
 \_____prefix____/ \_cmd_/ \_/  \____trailing (runs to end of line)____/

- always terminated with CRLF when you send
- a whole line is at most 512 bytes including CRLF
- at most 15 parameters`,
        cap: "The trailing parameter starts with : and swallows everything, spaces included", lang: "txt" },
      { h: "Why it is harder than it looks" },
      { ul: [
        "**TCP is a byte stream, not messages** — one command can arrive in three packets, and three commands can arrive in one",
        "**Real clients are fussier than you expect** — irssi waits on `CAP LS`, expects `PING` answered, and needs `005` or it never joins",
        "**Deleting a client mid-broadcast** leaves stale pointers and crashes — object lifetime needs discipline",
        "**The bonus must not be an IRC client** — the bot has to be a virtual nick the server answers for"
      ]},
      { h: "What you hand in" },
      { table: { head: ["File", "Role"], rows: [
        ["`Makefile`", "`all clean fclean re` plus `bonus`, and no relinking"],
        ["`src/` `inc/`", "The C++98 code"],
        ["Nothing else is required", "But your own test suite is what saves the defense"]
      ]}}
    ],
    theory: [
      { p: "The protocol and semantics you have to get right — IRC is old and full of details you cannot guess." },
      { h: "1) The registration sequence" },
      { code: String.raw`CONNECTED --PASS ok--> +pass --NICK--> +nick --USER--> REGISTERED -> 001..004`,
        cap: "NICK and USER arrive in either order — check the condition after each of the three", lang: "txt" },
      { ul: [
        "Completion is `passOk && hasNick && hasUser`, **checked after all three, not only after USER**",
        "Anything else before that gets `451 ERR_NOTREGISTERED`",
        "`PASS` after registration gets `462 ERR_ALREADYREGISTRED`",
        "A wrong `PASS` gets `464 ERR_PASSWDMISMATCH` and then **closes the link**"
      ]},
      { h: "2) The welcome numerics 001-004 (and the 005 the subject never mentions)" },
      { code: String.raw`:ircserv 001 alice :Welcome to the ft_irc Network alice!user@host
:ircserv 002 alice :Your host is ircserv, running version 1.0
:ircserv 003 alice :This server was created ...
:ircserv 004 alice ircserv 1.0 io itkol
:ircserv 005 alice CHANTYPES=#& CHANMODES=,k,l,it PREFIX=(o)@ NICKLEN=9
 CHANNELLEN=50 TOPICLEN=390 CASEMAPPING=rfc1459 NETWORK=ft_irc :are supported by this server`,
        cap: "005 RPL_ISUPPORT is the line that makes irssi able to join at all", lang: "txt" },
      { note: "**Omitting 005 is the bug that survives every socket-level test and then breaks the real client** — irssi emits an empty `JOIN :` at connect and never joins a channel afterwards." },
      { h: "3) IRC casemapping is not tolower" },
      { p: "RFC 1459 folds `[]\\~` onto `{}|^` — they are the same letters in the Scandinavian alphabet IRC was designed around. Nick and channel comparisons must go through that mapping, or `Nick[]` and `nick{}` coexist as two different users." },
      { code: String.raw`char ircLower(char c) {
    if (c >= 'A' && c <= 'Z') return c - 'A' + 'a';
    if (c == '[')  return '{';
    if (c == ']')  return '}';
    if (c == '\\') return '|';
    if (c == '~')  return '^';
    return c;
}`, cap: "Use this everywhere a nick or channel name is compared", lang: "cpp" },
      { h: "4) Nick grammar" },
      { ul: [
        "First character: a letter or one of `[` `]` `\\` `_` `^` `{` `|` `}` and the backquote",
        "Then: letters, digits, those specials, or `-`",
        "At most 9 characters",
        "`NICK ab cd` **is not an error** — a space separates parameters, so the nick is simply `ab`"
      ]},
      { h: "5) PRIVMSG and NOTICE" },
      { p: "Relay with the **sender's **prefix:** `:nick!user@host PRIVMSG #chan :text`**. Channel messages go to every member** except the sender**." },
      { p: "`NOTICE` is delivered identically but **must never produce an error reply** (RFC 2812 §3.3.2) — it exists precisely so bots can talk without triggering infinite error loops." },
      { h: "6) Channel MODE" },
      { table: { head: ["Mode", "arg on +", "arg on -", "Effect"], rows: [
        ["`i`", "no", "no", "invite-only"],
        ["`t`", "no", "no", "TOPIC restricted to operators"],
        ["`k`", "**yes**", "no", "channel key; re-setting an existing key → `467`"],
        ["`o`", "**yes**", "**yes**", "grant/revoke operator; a non-member → `441`"],
        ["`l`", "**yes**", "no", "user limit; non-numeric or `<= 0` ignored silently"]
      ]}},
      { p: "Process letters **left to right**, consuming arguments in order, then broadcast **one **consolidated line listing only what actually changed (so** `+i-i+i` **produces a single line). An unknown letter is** `472` **and** does not abort the rest**. `MODE #chan` with no mode string is `324`." },
      { h: "7) The minimum numeric set" },
      { code: String.raw`001 002 003 004      welcome
331 332              no topic / topic
341                  INVITE sent
353 366              names list / end of names
324                  current channel modes
401 403 404          no such nick / no such channel / cannot send to channel
411 412              no recipient / no text
421 431 432 433      unknown command / no nick given / bad nick / nick in use
441 442 443          not on that channel / you are not on the channel / already there
451 461 462          not registered / not enough params / already registered
464 467              wrong password / key already set
471 472 473 475      channel full / unknown mode / invite-only / bad key
482                  you are not a channel operator`,
        cap: "All of them are needed — real clients interpret these to render anything", lang: "txt" },
      { h: "8) Decisions the subject leaves open — write them down and test them" },
      { ul: [
        "Duplicate nick → `433` and **the existing user keeps it** (never force-rename)",
        "A channel with no members is destroyed, so topic/modes/ops cannot resurrect",
        "The channel creator gets `+o`",
        "An invite is consumed on join; a kicked user needs a fresh one",
        "An empty password is legal; the client must send `PASS :`",
        "A line with no terminator waits forever, but past the buffer cap the client is dropped with `ERROR :Input line too long`"
      ]}
    ],
    foundations: [
      { p: "The socket, buffer and object-lifetime machinery that decides whether the server is calm or crashes." },
      { h: "The shape of the loop" },
      { code: String.raw`_refreshPollOut()      // POLLOUT armed only where the out-buffer is non-empty
poll(&_pfds[0], n, 500)
for each fd with revents:
      listen fd + POLLIN      -> accept (loop until accept fails)
      POLLHUP|POLLERR|POLLNVAL-> drop the client
      POLLIN                  -> recv -> appendIn -> while(extractLine) dispatch
      POLLOUT                 -> send -> consume exactly the bytes sent
_sweepDisconnected()   // delete clients whose output has drained`,
        cap: "A 500 ms timeout keeps SIGINT responsive; poll returning -1 with EINTR is normal and must not be fatal", lang: "txt" },
      { note: "**Iterate a snapshot of the pollfd vector** — `accept` pushes new entries and a disconnect erases entries, and both invalidate iterators mid-tick." },
      { h: "Five bugs that decide the grade" },
      { h: "Bug 1: partial reads — TCP has no message boundaries" },
      { p: "**Never parse what** `recv()` **returned.** Append to a per-client buffer and only hand out a line once `\\n` is present." },
      { code: String.raw`the subject tests this directly with  nc -C  sending three packets:
    "com"   ->  buffer = "com"          no \n yet: do nothing
    "man"   ->  buffer = "comman"       no \n yet: do nothing
    "d\n"   ->  buffer = "command\n"    \n found: dispatch "command" once`,
        cap: "A server that answers three times is a server that failed this test", lang: "txt" },
      { h: "Bug 2: two line terminators" },
      { p: "irssi sends `\\r\\n`, `nc` sends a bare `\\n`. **Split on** `\\n` **and strip a trailing** `\\r`, and **always send** `\\r\\n`. A lone `\\r` is not a terminator." },
      { h: "Bug 3: partial sends" },
      { p: "`send()` on a non-blocking socket routinely writes less than asked. **Erase exactly the returned count** and keep the tail queued. Treating a short write as complete silently truncates messages under load." },
      { code: String.raw`void Client::flush() {
    if (_out.empty()) return;
    ssize_t n = send(_fd, _out.data(), _out.size(), 0);
    if (n < 0) { _dead = true; return; }     // poll said ready, so <0 is a real failure
    _out.erase(0, static_cast<size_t>(n));   // only what actually went out
}`, cap: "When this is wrong the symptom is 'messages go missing sometimes', which is brutal to trace", lang: "cpp" },
      { h: "Bug 4: POLLOUT always armed = 100% CPU" },
      { p: "Request `POLLOUT` only while that client has queued bytes — the same rule the `bircd` example encodes as `if (strlen(buf_write) > 0) FD_SET(i, &fd_write)`." },
      { h: "Bug 5: deleting a client mid-broadcast" },
      { p: "**Handlers must never** `delete`**.** Use three beats instead:" },
      { code: String.raw`1. mark: set the _dead flag
      at mark time remove the client from every channel
      (so no container holds a stale pointer), then broadcast its QUIT
2. drain: let the socket flush whatever is left in _out
3. sweep: actually delete at the end of the tick, in _sweepDisconnected()`,
        cap: "An object must always outlive the loop currently walking over it", lang: "txt" },
      { p: "Also make `Client` **non-copyable** (private copy ctor and assignment in C++98) — it owns an fd, and a copy double-closes it." },
      { h: "The bonus killer: SIGPIPE" },
      { p: "Writing to a socket whose peer just vanished **kills the process** by default. Put `signal(SIGPIPE, SIG_IGN)` in `main`, or the first abrupt disconnect ends the defense." },
      { h: "Per-client buffers" },
      { code: String.raw`class Client {
    int         _fd;
    std::string _in;        // raw bytes not yet a complete line
    std::string _out;       // bytes waiting to be sent
    bool        _passOk, _hasNick, _hasUser, _registered, _dead;
    std::string _nick, _user, _real, _host;
    std::set<std::string> _channels;   // names, not pointers
};`, cap: "Storing channel names rather than Channel pointers removes a whole family of dangling-pointer bugs", lang: "cpp" },
      { p: "**Cap** `_in` (8 KiB is fine): a peer that never sends `\\n` must not grow it without bound — past the cap, drop them with `ERROR :Input line too long`." }
    ],
    architecture: [
      { p: "Split by responsibility, and confine every socket syscall to one place so the rules stay provable." },
      { h: "File layout" },
      { code: String.raw`inc/                       src/
  Server.hpp                 main.cpp
  Client.hpp                 Server.cpp        setup / lifecycle
  Channel.hpp                ServerLoop.cpp    <- poll + every recv/send lives here
  Message.hpp                Dispatch.cpp      command name -> handler
  Replies.hpp                Client.cpp
  Bot.hpp                    Channel.cpp
  Utils.hpp                  Message.cpp       the IRC grammar parser
                             Replies.cpp       numeric producers
                             Bot.cpp           bonus
                             Utils.cpp         casemapping, split, ...
                             commands/CmdRegister.cpp  PASS NICK USER QUIT
                                      CmdChannel.cpp   JOIN PART KICK INVITE TOPIC
                                      CmdMessage.cpp   PRIVMSG NOTICE PING PONG
                                      CmdMode.cpp      MODE`,
        cap: "Group the commands into files — one 800-line file is a debugging obstacle", lang: "txt" },
      { h: "Responsibilities per class" },
      { table: { head: ["Class / file", "Owns", "Must not"], rows: [
        ["`ServerLoop.cpp`", "**The one poll** plus all accept/recv/send", "Interpret IRC commands"],
        ["`Dispatch.cpp`", "Command name → function, and the registration gate", "Touch sockets"],
        ["`Message`", "Turning a raw line into prefix/command/params", "Know about Channel"],
        ["`Client`", "One user's state and its in/out buffers", "`delete` itself"],
        ["`Channel`", "Members, operators, modes, topic, invite list", "Send bytes itself"],
        ["`Replies`", "Producing correctly formatted numerics", "Make logic decisions"],
        ["`Bot`", "The bonus virtual nick", "Open a socket of its own"]
      ]}},
      { h: "The dispatch table" },
      { code: String.raw`typedef void (Server::*Handler)(Client&, const Message&);
struct Entry { const char* name; Handler fn; bool needsRegistration; };

static const Entry TABLE[] = {
    { "PASS",    &Server::cmdPass,    false },
    { "NICK",    &Server::cmdNick,    false },
    { "USER",    &Server::cmdUser,    false },
    { "CAP",     &Server::cmdCap,     false },   // irssi sends this first of all
    { "PING",    &Server::cmdPing,    false },
    { "QUIT",    &Server::cmdQuit,    false },
    { "JOIN",    &Server::cmdJoin,    true  },
    { "PART",    &Server::cmdPart,    true  },
    { "PRIVMSG", &Server::cmdPrivmsg, true  },
    { "NOTICE",  &Server::cmdNotice,  true  },
    { "KICK",    &Server::cmdKick,    true  },
    { "INVITE",  &Server::cmdInvite,  true  },
    { "TOPIC",   &Server::cmdTopic,   true  },
    { "MODE",    &Server::cmdMode,    true  },
};`, cap: "The needsRegistration flag makes 451 happen in one place instead of in every handler", lang: "cpp" },
      { p: "Command names are **case-insensitive** — upper-case before the lookup; nothing found → `421 ERR_UNKNOWNCOMMAND`." },
      { h: "The Channel data structure" },
      { code: String.raw`class Channel {
    std::string           _name;      // always compared through ircLower
    std::string           _topic;
    std::string           _key;       // mode k
    size_t                _limit;     // mode l (0 = unlimited)
    bool                  _inviteOnly;  // mode i
    bool                  _topicLocked; // mode t
    std::set<std::string> _members;   // folded nicks
    std::set<std::string> _operators;
    std::set<std::string> _invited;   // consumed on use
};`, cap: "Nicks, not pointers — a client that disappears leaves no debris", lang: "cpp" },
      { h: "The registries the Server owns" },
      { table: { head: ["Registry", "Key", "Purpose"], rows: [
        ["`_clients`", "fd", "Find the client for a poll event"],
        ["`_nickIndex`", "folded nick", "Duplicate detection and O(log n) PRIVMSG targeting"],
        ["`_channels`", "folded channel name", "Find channels and destroy empty ones"],
        ["`_pfds`", "—", "The array rebuilt before every poll"]
      ]}},
      { note: "**Update** `_nickIndex` **atomically on every nick change** (erase the old key, insert the new one). Forgetting this creates ghost nicks that reserve a name with nobody behind it." }
    ],
    dataflow: [
      { p: "One batch of bytes from arrival to broadcast." },
      { h: "One tick" },
      { code: String.raw`1. refreshPollOut()   per client: events = POLLIN | (out empty ? 0 : POLLOUT)
2. poll(..., 500ms)   -1 with EINTR is normal, loop again
3. walk a snapshot of pfds:
     listener POLLIN -> accept until it fails -> O_NONBLOCK -> register
     POLLHUP/ERR     -> markDead(fd)
     POLLIN          -> recv -> _in += ... -> while (extractLine) dispatch
     POLLOUT         -> flush() (erase exactly what was sent)
4. sweepDisconnected(): clients that are _dead with an empty _out are deleted`,
        cap: "Deletion happens in exactly one place, so no pointer goes stale mid-loop", lang: "txt" },
      { h: "From raw bytes to commands" },
      { code: String.raw`recv returns "NICK alice\r\nUSER a 0 * :Alice\r\nJOIN #4"

_in = "NICK alice\r\nUSER a 0 * :Alice\r\nJOIN #4"

extractLine -> "NICK alice"          (trailing \r stripped)  -> dispatch
extractLine -> "USER a 0 * :Alice"                           -> dispatch
extractLine -> no \n left            -> _in = "JOIN #4"  kept for the next bytes`,
        cap: "One recv can be zero, one, or several commands — hence the while loop", lang: "txt" },
      { h: "The JOIN path" },
      { code: String.raw`JOIN #42 secret
 -> registered?                        no -> 451
 -> enough parameters?                 no -> 461
 -> does the name start with # or &?   no -> 403
 -> does the channel exist?
      no  -> create it, the creator gets +o
      yes -> check in order:  invite-only (+i) and not invited -> 473
                              key (+k) mismatch                -> 475
                              limit (+l) reached               -> 471
 -> add to _members, erase from _invited (an invite is single use)
 -> broadcast ":alice!user@host JOIN #42" to every member (including the joiner)
 -> send the joiner:  332 or 331 (topic)
                      353 (names, operators prefixed with @)
                      366 (end of names)`,
        cap: "The JOIN must echo back to the joiner or the client never learns it succeeded", lang: "txt" },
      { h: "The PRIVMSG path" },
      { code: String.raw`PRIVMSG #42 :hello everyone
 -> no recipient -> 411 ;  no text -> 412
 -> does the target start with # or &?
      yes -> channel exists?         no -> 403
             sender is a member?     no -> 404
             send to every member except the sender
      no  -> look the nick up in _nickIndex   not found -> 401
             send to that one client
 -> what goes on the wire:
      :alice!user@host PRIVMSG #42 :hello everyone

NOTICE takes exactly the same path, but everywhere PRIVMSG would answer
with an error, NOTICE stays silent`,
        cap: "The sender's prefix is what lets the client show who spoke", lang: "txt" },
      { h: "The QUIT and disconnect path" },
      { code: String.raw`QUIT :bye   (or a dead socket / POLLHUP)
 -> markDead(client)
      for every channel the client is in:
          remove it from _members and _operators
          broadcast ":alice!user@host QUIT :bye" to the remaining members
          if the channel is now empty -> destroy it
      erase the nick from _nickIndex
 -> let _out drain completely
 -> sweepDisconnected() closes the fd and deletes for real`,
        cap: "This order guarantees no container holds a pointer that has been deleted", lang: "txt" },
      { h: "A multi-letter MODE" },
      { code: String.raw`MODE #42 +itk-o secret bob

sign = '+'
  i -> inviteOnly = true            (no arg)     changed += "i"
  t -> topicLocked = true           (no arg)     changed += "t"
  k -> consume "secret"; a key already set? -> 467 and skip
sign = '-'
  o -> consume "bob"; is bob a member? no -> 441
       revoke operator                            changed += "o", args += "bob"

one broadcast line:  :alice!user@host MODE #42 +it-o bob`,
        cap: "Accumulate what actually changed and announce it once, never letter by letter", lang: "txt" },
      { h: "Why irssi connects and then hangs" },
      { table: { head: ["Symptom", "Cause"], rows: [
        ["Hangs from the start, nothing happens", "`CAP LS` unanswered — irssi sent it and **waits**"],
        ["Connects, then drops after about a minute", "`PING` unanswered; the client thinks the link is dead"],
        ["Connects but can never join a channel", "No `005 RPL_ISUPPORT`"],
        ["Every join logs a ban-list error", "`MODE #chan b` unanswered — reply with an empty `368`"]
      ]}},
      { p: "Replying `:<server> CAP * LS :` (an empty list) and `NAK` to any `CAP REQ` is enough for this subject. Ban lists are out of scope, so answer `368 RPL_ENDOFBANLIST` with an empty list **rather than** `482` — otherwise every join logs an error in the client." }
    ],
    implementation: [
      { p: "C++98 skeletons you can build on directly." },
      { h: "1) Setting up the listener" },
      { code: String.raw`int Server::setupListener(int port) {
    int fd = socket(AF_INET, SOCK_STREAM, 0);
    int yes = 1;
    setsockopt(fd, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(yes));
    fcntl(fd, F_SETFL, O_NONBLOCK);              // non-blocking, listener included

    struct sockaddr_in a;
    std::memset(&a, 0, sizeof(a));
    a.sin_family      = AF_INET;
    a.sin_addr.s_addr = htonl(INADDR_ANY);
    a.sin_port        = htons(static_cast<uint16_t>(port));
    if (bind(fd, (struct sockaddr*)&a, sizeof(a)) < 0) throw std::runtime_error("bind");
    if (listen(fd, SOMAXCONN) < 0)                     throw std::runtime_error("listen");
    return fd;
}`, cap: "SO_REUSEADDR must precede bind, or a quick restart cannot bind", lang: "cpp" },
      { h: "2) Extracting a line from the buffer" },
      { code: String.raw`bool Client::extractLine(std::string& out) {
    std::string::size_type nl = _in.find('\n');
    if (nl == std::string::npos) {
        if (_in.size() > MAX_IN)                   // a peer that never sends \n
            { send_(":ircserv ERROR :Input line too long\r\n"); _dead = true; }
        return false;
    }
    out = _in.substr(0, nl);
    _in.erase(0, nl + 1);
    if (!out.empty() && out[out.size() - 1] == '\r')   // irssi sends \r\n, nc sends \n
        out.erase(out.size() - 1);
    return true;
}`, cap: "The whole 'com/man/d' test lives or dies in this one function", lang: "cpp" },
      { h: "3) Parsing the IRC grammar" },
      { code: String.raw`Message Message::parse(const std::string& line) {
    Message m;
    size_t i = 0;
    if (i < line.size() && line[i] == ':') {          // prefix (clients rarely send one)
        size_t sp = line.find(' ', i);
        m.prefix = line.substr(1, sp - 1);
        i = (sp == std::string::npos) ? line.size() : sp + 1;
    }
    while (i < line.size() && line[i] == ' ') ++i;
    size_t sp = line.find(' ', i);
    m.command = line.substr(i, sp - i);
    toUpperInPlace(m.command);

    i = (sp == std::string::npos) ? line.size() : sp + 1;
    while (i < line.size() && m.params.size() < 15) {
        while (i < line.size() && line[i] == ' ') ++i;
        if (i >= line.size()) break;
        if (line[i] == ':') { m.params.push_back(line.substr(i + 1)); break; }
        sp = line.find(' ', i);
        m.params.push_back(line.substr(i, sp - i));
        i = (sp == std::string::npos) ? line.size() : sp;
    }
    return m;
}`, cap: "A trailing parameter starting with : swallows the rest of the line, spaces included", lang: "cpp" },
      { h: "4) The registration condition" },
      { code: String.raw`void Server::tryRegister(Client& c) {
    if (c.registered() || !c.passOk() || !c.hasNick() || !c.hasUser()) return;
    c.setRegistered(true);
    c.send_(rpl001(c)); c.send_(rpl002(c)); c.send_(rpl003(c)); c.send_(rpl004(c));
    c.send_(rpl005(c));                       // not optional; without it irssi cannot join
}`, cap: "Call it at the end of cmdPass, cmdNick and cmdUser, all three", lang: "cpp" },
      { h: "5) NICK with duplicate detection and index maintenance" },
      { code: String.raw`void Server::cmdNick(Client& c, const Message& m) {
    if (m.params.empty())            return c.send_(err431(c));
    const std::string& want = m.params[0];
    if (!validNick(want))            return c.send_(err432(c, want));

    std::string key = ircFold(want);
    std::map<std::string, Client*>::iterator it = _nickIndex.find(key);
    if (it != _nickIndex.end() && it->second != &c)
        return c.send_(err433(c, want));            // the existing user keeps it

    if (c.registered()) {                            // renaming mid-session
        std::string line = ":" + c.mask() + " NICK :" + want + "\r\n";
        broadcastToPeers(c, line);                   // tell every shared channel
    }
    if (!c.nick().empty()) _nickIndex.erase(ircFold(c.nick()));   // atomic: erase old
    _nickIndex[key] = &c;                                          //         insert new
    c.setNick(want);
    c.setHasNick(true);
    tryRegister(c);
}`, cap: "Forgetting to erase the old key is where ghost nicks come from", lang: "cpp" },
      { h: "6) MODE processed letter by letter" },
      { code: String.raw`char sign = '+';
size_t argi = 2;                       // param[0]=channel, param[1]=the mode string
std::string changed, changedArgs;
const std::string& str = m.params[1];

for (size_t i = 0; i < str.size(); ++i) {
    char ch = str[i];
    if (ch == '+' || ch == '-') { sign = ch; appendSign(changed, sign); continue; }
    switch_on(ch):
        case 'i': ch_.setInviteOnly(sign == '+');   changed += 'i'; break;
        case 't': ch_.setTopicLocked(sign == '+');  changed += 't'; break;
        case 'k': if (sign == '+') {
                      if (argi >= m.params.size()) break;        // no arg -> skip
                      if (ch_.hasKey()) { c.send_(err467(c, ch_)); break; }
                      ch_.setKey(m.params[argi]);
                      changed += 'k'; changedArgs += " " + m.params[argi++];
                  } else { ch_.clearKey(); changed += 'k'; }
                  break;
        case 'o': ... if the target is not a member -> err441 then break ...
        case 'l': ...
        default:  c.send_(err472(c, ch)); break;    // unknown, but keep going
}
if (!changed.empty())
    ch_.broadcast(":" + c.mask() + " MODE " + ch_.name() + " " + changed + changedArgs + "\r\n");`,
        cap: "C++98 has no switch on strings, but a switch on a char is exactly right here", lang: "cpp" },
      { h: "7) A broadcast that survives disconnects" },
      { code: String.raw`void Channel::broadcast(const std::string& line, const Client* except) {
    // walk a copy: a handler may mark somebody dead while we are iterating
    std::set<std::string> snapshot = _members;
    for (std::set<std::string>::const_iterator it = snapshot.begin();
         it != snapshot.end(); ++it) {
        Client* cl = _server.findByNick(*it);
        if (cl && cl != except) cl->send_(line);     // send_ only appends to _out
    }
}`, cap: "send_ makes no syscall — it queues bytes for POLLOUT to deliver later", lang: "cpp" },
      { h: "8) A Makefile with a bonus rule" },
      { code: String.raw`NAME    = ircserv
CXX     = c++
CXXFLAGS= -Wall -Wextra -Werror -std=c++98 -MMD -MP -Iinc
SRCS    = $(shell find src -name '*.cpp' ! -name 'Bot.cpp')
BSRCS   = $(shell find src -name '*.cpp')
OBJS    = $(SRCS:src/%.cpp=obj/%.o)
BOBJS   = $(BSRCS:src/%.cpp=obj_b/%.o)

all: $(NAME)
$(NAME): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $(OBJS)
bonus: CXXFLAGS += -DWITH_BOT
bonus: $(BOBJS)
	$(CXX) $(CXXFLAGS) -o $(NAME) $(BOBJS)
obj/%.o obj_b/%.o: src/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -c $< -o $@
-include $(OBJS:.o=.d) $(BOBJS:.o=.d)
clean:  ; rm -rf obj obj_b
fclean: clean ; rm -f $(NAME)
re: fclean all
.PHONY: all bonus clean fclean re`,
        cap: "Separate object directories, or `make bonus` then `make` relinks every time", lang: "make" },
      { h: "9) The manual tests worth the most" },
      { code: String.raw`# the partial-read test the subject spells out
nc -C 127.0.0.1 6667
PASS secret
NICK bob
USER b 0 * :Bob
JOIN #42
PRIVMSG #42 :hi

# genuinely split packets (must produce exactly one reply)
printf 'PRIVM' | nc -q1 127.0.0.1 6667 &
# or a python script sending one byte at a time with sleeps

# a real client
irssi -c 127.0.0.1 -p 6667 -w secret`,
        cap: "nc alone is not enough — irssi is what catches the CAP/PING/005 bugs", lang: "bash" }
    ],
    tricks: [
      { h: "Trick 1 — make the three structural rules greppable" },
      { p: "Confine every socket syscall to `ServerLoop.cpp` and put this gate in your **L0** test script: any `fork(` fails, more than one `poll(` fails, any `recv(`/`send(` outside that file fails. The evaluator will grep exactly like this — better to do it first." },
      { h: "Trick 2 — the bonus bot must not be a client" },
      { p: "The subject **forbids writing an IRC client**, so the bot must be a **virtual nick** the server answers for:" },
      { ul: [
        "Reserve the nick — anyone attempting `NICK ircbot` gets `433`",
        "Reply with the prefix `ircbot!bot@<server>` **through the same delivery path as any other PRIVMSG**",
        "Trigger on a private query to that nick, or on a channel message starting with `!`",
        "**And keep relaying the original message to the channel** — the bot observes, it does not swallow"
      ]},
      { h: "Trick 3 — file transfer is DCC, and DCC is peer-to-peer" },
      { p: "The offer travels as CTCP inside a normal `PRIVMSG` — **the server's real job is to relay it byte for byte,** `\\x01` **markers included.** One mangled character kills the transfer." },
      { code: String.raw`\x01DCC SEND <filename> <ip-as-uint32> <port> <size>\x01`,
        cap: "The server never carries the file — it flows directly between the two clients", lang: "txt" },
      { note: "**Parsing trap:** a filename may contain spaces, quoted or not. Read the address, port and size from the **last three fields** and treat everything between `SEND` and them as the name, stripping quotes. Fixed indices silently turn the port into the size." },
      { p: "Recording the offers — so a `!dcc` command can list them, and so they are dropped when either peer disconnects — is what makes the feature visible server-side." },
      { h: "Trick 4 — the bircd example shipped with the subject" },
      { p: "`bircd.tar.gz` is a small `select()`-based C server. It is **useful only as a shape reference** — its event loop and its 'arm write only when the buffer is non-empty' rule are right." },
      { p: "**Do not copy it**: it is C, uses `select()`, broadcasts raw `recv()` output without reassembling packets (which fails the subject's own IV.3 test), and ignores the `send()` return value." },
      { p: "If `gzip`/`tar` on one toolchain reports a CRC failure, try `gzip -dc` under WSL — the archive is a multi-member gzip that some readers mishandle." },
      { h: "Trick 5 — the gotchas that cost the most time" },
      { table: { head: ["Symptom", "Real cause"], rows: [
        ["100% CPU with nobody typing", "POLLOUT left permanently armed"],
        ["Messages occasionally missing under load", "Partial sends not handled"],
        ["Three replies when nc splits the packets", "Parsing recv's output directly instead of buffering"],
        ["Crash after someone QUITs while others chat", "`delete` inside a handler / a container holding a stale pointer"],
        ["The process dies silently when a client vanishes", "SIGPIPE not ignored"],
        ["irssi connects and freezes", "`CAP LS` unanswered"],
        ["irssi connects but cannot join", "No `005`"],
        ["`Nick[]` and `nick{}` coexist", "tolower used instead of RFC 1459 casemapping"],
        ["Typing in `nc` does nothing", "Only `\\r\\n` accepted while nc sends a bare `\\n`"]
      ]}},
      { h: "Trick 6 — write the open decisions down" },
      { p: "The choices the subject leaves open (duplicate nicks, empty channels, invite lifetime) **drift while you edit code unless they are written down**. Put them in `docs/DECISIONS.md`, cover each with one test, and show the file at defense." },
      { h: "Trick 7 — the tests to have before defense" },
      { ul: [
        "**Partial read**: send `com` / `man` / `d\\n` as three packets and get exactly one reply",
        "**Partial send**: freeze a client that refuses to read (SIGSTOP it) and flood messages — the server must neither stall nor lose text",
        "**Flood**: 100 simultaneous connections plus rapid messages, with flat memory",
        "**Abrupt disconnect**: kill a client mid-broadcast and survive",
        "**valgrind**: no leaks and no invalid reads/writes after a SIGINT shutdown",
        "**Real irssi**: join, msg, mode +o, kick, invite, topic, end to end"
      ]}
    ],
    eval: [
      { p: "The questions evaluators really ask — the first three come up every time." },
      { qa: [
        { q: "Why one poll(), and how does it work?",
          a: "The server is one process with no threads but many descriptors; poll is the single place that reports which are readable or writable, and only those get touched. The subject states outright that calling recv/send on a descriptor poll did not report ready is a zero." },
        { q: "Why must descriptors be non-blocking if poll already told you?",
          a: "poll only says 'probably ready', not how many bytes. If `send` cannot write everything on a blocking fd it waits, and the whole server stops serving everyone." },
        { q: "Is there a fork() anywhere?",
          a: "None — the subject forbids it and grep proves it. Everything happens in one process through the event loop." },
        { q: "How do you handle one command split across packets?",
          a: "Append received bytes to a per-client buffer and only extract a line once `\\n` appears. The subject's own test sends `com`, `man`, `d\\n` in three packets and the server must process `command` exactly once." },
        { q: "And the opposite — several commands in one packet?",
          a: "A `while (extractLine(...))` loop pulls them out until no `\\n` remains; whatever is left stays buffered for the next bytes." },
        { q: "What is a partial send and how do you handle it?",
          a: "`send()` on a non-blocking socket routinely writes less than asked, so you erase exactly the returned count and keep the tail queued for the next round — otherwise messages are silently truncated under load." },
        { q: "Why must POLLOUT not stay armed?",
          a: "An idle socket is always writable, so poll returns immediately every round and the CPU spins at 100%. Ask for it only while that client actually has queued bytes." },
        { q: "When do you delete a client, and why not immediately?",
          a: "Never inside a handler, because you may be iterating a broadcast. Mark it dead, remove it from every channel, broadcast its QUIT, let the output drain, and delete for real in the sweep at the end of the tick." },
        { q: "Why is Client non-copyable?",
          a: "It owns a file descriptor — a copy means two destructors closing the same fd, potentially closing a descriptor another client has since been given." },
        { q: "What does SIGPIPE have to do with it?",
          a: "Writing to a socket whose peer just vanished raises SIGPIPE, which by default kills the process. `signal(SIGPIPE, SIG_IGN)` in main, and rely on send's return value instead." },
        { q: "Explain the registration sequence.",
          a: "A correct PASS, then NICK and USER in either order; completion is passOk && hasNick && hasUser, at which point 001-004 are sent. Anything before that gets 451; a wrong PASS gets 464 and closes the link." },
        { q: "Why does irssi connect and then hang?",
          a: "It opens with `CAP LS` and waits. Reply `:<server> CAP * LS :` with an empty list and NAK any CAP REQ. It also expects PING to be answered, or it drops the connection as dead." },
        { q: "Is 005 RPL_ISUPPORT necessary?",
          a: "The subject never mentions it, but yes — without it irssi emits an empty `JOIN :` at connect and can never join afterwards. It is the bug that survives every socket-level test and breaks the real client." },
        { q: "How does IRC casemapping differ from tolower?",
          a: "RFC 1459 folds `[]\\~` onto `{}|^` because they are Scandinavian letters. Nick and channel comparison must use that mapping, or `Nick[]` and `nick{}` become two different users." },
        { q: "How do PRIVMSG and NOTICE differ?",
          a: "They take the same path and are delivered identically, but NOTICE must never produce an error reply — so two bots cannot bounce errors off each other forever." },
        { q: "Explain MODE +o and argument consumption.",
          a: "Letters are processed left to right; those requiring an argument (k, o, and l on +) consume the next parameter in order. `o` grants or revokes operator, and a target who is not in the channel gets 441. Finally one broadcast line lists only what actually changed." },
        { q: "When is a channel destroyed?",
          a: "When the last member leaves — so an old topic, modes and operator list cannot resurrect when somebody recreates the same name." },
        { q: "How many times can an invite be used?",
          a: "Once: it is consumed on join and erased. A kicked user needs a fresh one. The subject leaves this open, so it is written in DECISIONS and covered by a test." },
        { q: "How do you bound message size?",
          a: "A line is at most 512 bytes including CRLF per the RFC, and the accumulation buffer has a cap (8 KiB) — a peer that never sends `\\n` is dropped with `ERROR :Input line too long` so memory cannot grow without bound." },
        { q: "Is the bonus bot a client?",
          a: "No — the subject forbids writing an IRC client. It is a virtual nick the server reserves and answers for, delivered through the same path as any PRIVMSG, and the original message still reaches the channel." },
        { q: "How does DCC work and what does the server do?",
          a: "The offer is CTCP inside a normal PRIVMSG; the file itself flows directly between the two clients. The server relays every byte including the `\\x01` markers, and reads ip/port/size from the last three fields because filenames may contain spaces." }
      ]},
      { h: "Checklist before defense" },
      { ul: [
        "grep finds no `fork(`, exactly one `poll(`, and socket syscalls in one file",
        "irssi works end to end: join, privmsg, mode +o/+i/+t/+k/+l, kick, invite, topic",
        "The `com`/`man`/`d\\n` three-packet test passes",
        "Killing a client mid-broadcast leaves the server alive",
        "A duplicate nick gets 433 and the original user keeps the name",
        "`nc` sending bare `\\n` works exactly like irssi sending `\\r\\n`",
        "valgrind is clean after SIGINT",
        "CPU near 0% while nobody is typing"
      ]},
      { links: [
        { label: "RFC 1459 — Internet Relay Chat Protocol", url: "https://datatracker.ietf.org/doc/html/rfc1459", note: "Message grammar, casemapping and the original numerics" },
        { label: "RFC 2812 — IRC Client Protocol", url: "https://datatracker.ietf.org/doc/html/rfc2812", note: "Command details and the NOTICE rule" },
        { label: "Modern IRC client protocol (ircdocs)", url: "https://modern.ircdocs.horse/", note: "Far more readable than the RFCs, and covers RPL_ISUPPORT" },
        { label: "IRC numerics list (ircdocs)", url: "https://defs.ircdocs.horse/defs/numerics.html", note: "Keep it open while writing Replies.cpp" },
        { label: "Beej's Guide to Network Programming", url: "https://beej.us/guide/bgnet/", note: "Sockets, poll and non-blocking I/O from the ground up" }
      ]}
    ]
  }
});

/* flow visualizer: byte จาก irssi กลายเป็น JOIN ที่ broadcast ออกทั้งช่อง */
window.EXTRA_FLOWS = window.EXTRA_FLOWS || {};
window.EXTRA_FLOWS.ft_irc = {
  input: "irssi ส่ง \"JOIN #4\" แล้วอีก packet ส่ง \"2\r\n\"",
  steps: [
    { fn: "Server::loop()", file: "src/ServerLoop.cpp", depth: 0,
      note: { th: "ก่อน `poll()` ทุกครั้งต้อง `_refreshPollOut()` — ขอ `POLLOUT` **เฉพาะ client ที่มี byte ค้างจริง** ไม่งั้น socket ว่างจะรายงานว่าเขียนได้ตลอดแล้ว CPU วิ่ง 100%",
              en: "Before every `poll()` comes `_refreshPollOut()` — arm `POLLOUT` **only for clients with queued bytes**, or an idle socket reports writable forever and the CPU spins at 100%." },
      data: "poll(pfds, n, 500)   timeout 500ms ให้ SIGINT ตอบสนองไว",
      vars: [ { n: "_pfds", d: { th: "เดินบน snapshot เพราะ accept/disconnect แก้ vector กลางรอบ", en: "iterated as a snapshot: accept and disconnect mutate the vector mid-tick" }, w: true } ] },
    { fn: "recv() -> Client::appendIn()", file: "src/ServerLoop.cpp", depth: 1,
      note: { th: "**ห้าม parse สิ่งที่** `recv()` **คืนมาโดยตรง** TCP เป็นสายของ byte ไม่มีขอบเขตข้อความ ต่อท้าย buffer ต่อ client ไว้ก่อนเสมอ",
              en: "**Never parse what** `recv()` **returned.** TCP is a byte stream with no message boundaries: always append to the per-client buffer first." },
      data: "packet 1: \"JOIN #4\"      _in = \"JOIN #4\"   (ยังไม่มี \n)",
      vars: [ { n: "_in", v: "\"JOIN #4\"", d: { th: "ยังไม่ครบบรรทัด จึงยังไม่ทำอะไร", en: "not a whole line yet, so nothing happens" }, w: true } ] },
    { fn: "Client::extractLine()", file: "src/Client.cpp", depth: 2,
      note: { th: "ดึงออกมาก็ต่อเมื่อเจอ `\n` แล้วตัด `\r` ท้ายทิ้งถ้ามี — irssi ส่ง `\r\n` แต่ `nc` ส่ง `\n` เปล่า ต้องรับได้ทั้งคู่ และ **ส่งออกด้วย** `\r\n` **เสมอ**",
              en: "A line comes out only once `\n` appears, with a trailing `\r` stripped — irssi sends `\r\n` while `nc` sends a bare `\n`, both must work, and you **always send** `\r\n`." },
      data: "packet 2: \"2\r\n\"   _in = \"JOIN #42\r\n\"  ->  line = \"JOIN #42\"",
      vars: [ { n: "line", v: "\"JOIN #42\"", d: { th: "dispatch ครั้งเดียว ไม่ใช่สองครั้ง", en: "dispatched once, not twice" }, w: true } ] },
    { fn: "Message::parse()", file: "src/Message.cpp", depth: 2,
      note: { th: "ไวยากรณ์ IRC: prefix (ถ้ามี) แล้ว command แล้ว params ไม่เกิน 15 ตัว โดย param ที่ขึ้นต้นด้วย `:` จะกินยาวถึงท้ายบรรทัดรวมช่องว่าง ชื่อคำสั่งไม่สนตัวพิมพ์",
              en: "The IRC grammar: an optional prefix, a command, then at most 15 parameters, where a parameter starting with `:` swallows the rest of the line including spaces. Command names are case-insensitive." },
      data: "command = \"JOIN\"   params = [\"#42\"]",
      vars: [ { n: "m.command", v: "\"JOIN\"", d: { th: "upper-case ก่อนค้นตาราง dispatch", en: "upper-cased before the dispatch lookup" }, w: true } ] },
    { fn: "Dispatch::run()", file: "src/Dispatch.cpp", depth: 1,
      note: { th: "ตารางเดียวคุมทั้งชื่อคำสั่งและธง `needsRegistration` ทำให้ `451 ERR_NOTREGISTERED` เกิดที่เดียว ไม่กระจายไปทุก handler; ไม่เจอในตาราง = `421`",
              en: "One table holds both the command name and the `needsRegistration` flag, so `451 ERR_NOTREGISTERED` happens in one place instead of in every handler; nothing found is `421`." },
      data: "JOIN -> cmdJoin   needsRegistration = true   client ผ่าน PASS/NICK/USER แล้ว ✓",
      vars: [ { n: "c.registered()", v: "true", d: { th: "passOk && hasNick && hasUser", en: "passOk && hasNick && hasUser" } } ] },
    { fn: "Server::cmdJoin()", file: "src/commands/CmdChannel.cpp", depth: 2,
      note: { th: "ตรวจตามลำดับ: invite-only (`+i`) ไม่ถูกเชิญ `473`, key (`+k`) ไม่ตรง `475`, limit (`+l`) เต็ม `471` — ถ้าช่องยังไม่มี ผู้สร้างจะได้ `+o` อัตโนมัติ",
              en: "Checked in order: invite-only (`+i`) without an invite is `473`, a wrong key (`+k`) is `475`, a full channel (`+l`) is `471` — and if the channel does not exist yet, its creator gets `+o`." },
      data: "#42 ยังไม่มี  ->  สร้างใหม่, alice ได้ +o, ลบออกจาก _invited",
      vars: [ { n: "_members", v: "{alice}", d: { th: "เก็บเป็น nick ที่ fold แล้ว ไม่ใช่ pointer", en: "folded nicks, never pointers" }, w: true } ] },
    { fn: "Channel::broadcast()", file: "src/Channel.cpp", depth: 3,
      note: { th: "เดินบน **สำเนา** ของรายชื่อ เพราะ handler อาจ mark ใครสักคนว่าตายระหว่างทาง และ `send_` แค่ต่อท้าย `_out` ไม่ได้เรียก syscall — ปล่อยให้ `POLLOUT` ส่งทีหลัง",
              en: "Walk a **copy** of the member list, because a handler may mark somebody dead mid-loop, and `send_` only appends to `_out` — no syscall here; `POLLOUT` delivers it later." },
      data: ":alice!user@host JOIN #42\r\n   ส่งให้สมาชิกทุกคน รวมตัว alice เอง",
      vars: [ { n: "_out", v: "queued", d: { th: "รอ POLLOUT รอบถัดไป", en: "waiting for the next POLLOUT" }, w: true } ] },
    { fn: "ส่ง 332/331 + 353 + 366", file: "src/Replies.cpp", depth: 3,
      note: { th: "คนที่เพิ่งเข้าต้องได้ topic แล้วรายชื่อ (operator นำหน้าด้วย `@`) แล้วปิดด้วย `366` — **ถ้าไม่ส่งกลับให้ตัวผู้ join เอง client จะไม่รู้ว่าเข้าห้องสำเร็จ**",
              en: "The joiner needs the topic, then the names list (operators prefixed with `@`), then `366` to close it — **without echoing back to the joiner the client never learns it succeeded.**" },
      data: "331 (ยังไม่มี topic) · 353 = \"@alice\" · 366 end of names",
      vars: [ { n: "numerics", v: "331, 353, 366", d: { th: "client จริงใช้ตัวเลขพวกนี้ในการวาดหน้าจอ", en: "a real client renders its window from these numbers" } } ] },
    { fn: "_sweepDisconnected()", file: "src/ServerLoop.cpp", depth: 0,
      note: { th: "การลบจริงเกิด **ที่เดียว ท้าย tick** เท่านั้น: handler แค่ mark ว่าตาย ถอดออกจากทุกช่อง broadcast `QUIT` แล้วปล่อยให้ output ระบายจนหมดก่อน `delete`",
              en: "Real deletion happens **in exactly one place, at the end of the tick**: handlers only mark dead, remove the client from every channel, broadcast its `QUIT`, and let the output drain before the `delete`." },
      data: "ไม่มีใครตายรอบนี้  ->  วนกลับไป poll() ใหม่",
      vars: [ { n: "_dead", v: "[]", d: { th: "ว่าง = ไม่มี pointer ค้างให้ใคร", en: "empty means nobody holds a stale pointer" } } ] }
  ]
};

/* Flow Visualizer ของหน้านี้ — เก็บไว้กับข้อมูลของหน้าเองจะได้ไม่ต้องโหลดไฟล์เพิ่ม */
window.EXTRA_FLOWS = window.EXTRA_FLOWS || {};
window.EXTRA_FLOWS.ft_irc = {
    input: "nc -C : ส่ง \"PRIVM\" , \"SG #42 :hi\" , \"\\r\\n\" เป็น 3 packet",
    steps: [
      { fn: "Server::loop()", file: "src/ServerLoop.cpp", depth: 0,
        note: { th: "`_refreshPollOut()` ก่อนทุกครั้ง: ขอ `POLLOUT` เฉพาะ client ที่ out-buffer ไม่ว่าง แล้ว `poll(..., 500)` ให้ SIGINT ตอบสนองไว",
                en: "`_refreshPollOut()` runs first: arm `POLLOUT` only where the out-buffer is non-empty, then `poll(..., 500)` so SIGINT stays responsive" },
        data: "pfds = [listen:POLLIN, fd9:POLLIN]",
        vars: [
          { n: "revents", d: { th: "แหล่งความจริงเดียวว่าจะแตะ fd ไหน", en: "the only source of truth about which fd to touch" } } ] },
      { fn: "recv(fd9)", file: "src/ServerLoop.cpp", depth: 1,
        note: { th: "packet ที่ 1 มาถึง — **ห้าม parse ผลของ** `recv` **ตรง ๆ** เพราะ TCP ไม่มีขอบเขตข้อความ ต่อท้าย buffer ต่อ client เท่านั้น",
                en: "The first packet arrives — **never parse what** `recv` **returned**, because TCP has no message boundaries; append to the per-client buffer instead" },
        data: "_in = \"PRIVM\"",
        vars: [
          { n: "_in", v: "\"PRIVM\"", d: { th: "ยังไม่มี `\\n` จึงยังไม่ทำอะไร", en: "no `\\n` yet, so nothing happens" }, w: true } ] },
      { fn: "Client::extractLine()", file: "src/Client.cpp", depth: 2,
        note: { th: "หา `\\n` ไม่เจอก็คืน false แล้วรอ byte ถัดไป — ถ้า buffer โตเกินเพดาน (8 KiB) ตัด client ด้วย `ERROR :Input line too long`",
                en: "No `\\n` found, so it returns false and waits for more bytes — past the 8 KiB cap the client is dropped with `ERROR :Input line too long`" },
        data: "find('\\n') == npos -> return false",
        vars: [
          { n: "MAX_IN", v: "8192", d: { th: "กัน peer ที่ไม่เคยส่ง `\\n` ทำ memory โตไม่จำกัด", en: "stops a peer that never sends `\\n` growing memory without bound" } } ] },
      { fn: "recv(fd9) x2", file: "src/ServerLoop.cpp", depth: 1,
        note: { th: "packet ที่ 2 และ 3 ต่อท้ายเข้า buffer เดิม — พอครบ `\\r\\n` ถึงจะได้ 1 บรรทัด นี่คือเทสต์ที่ subject ระบุไว้ตรง ๆ",
                en: "Packets two and three append to the same buffer; only once `\\r\\n` is there does a line exist. This is the test the subject spells out" },
        data: "_in = \"PRIVMSG #42 :hi\\r\\n\"",
        vars: [
          { n: "_in", d: { th: "ครบบรรทัดแล้ว", en: "a complete line at last" }, w: true } ] },
      { fn: "extractLine() -> true", file: "src/Client.cpp", depth: 2,
        note: { th: "ตัดที่ `\\n` แล้ว **ตัด** `\\r` **ท้ายทิ้งถ้ามี** — irssi ส่ง `\\r\\n` แต่ `nc` ส่ง `\\n` เปล่า ต้องรับทั้งคู่ ส่วนขาออกส่ง `\\r\\n` เสมอ",
                en: "Split on `\\n` and **strip a trailing** `\\r` — irssi sends `\\r\\n` while `nc` sends a bare `\\n`, so both must work; outgoing lines always use `\\r\\n`" },
        data: "line = \"PRIVMSG #42 :hi\"   (ตอบครั้งเดียว ไม่ใช่ 3 ครั้ง)",
        vars: [
          { n: "line", v: "\"PRIVMSG #42 :hi\"", d: { th: "หนึ่งคำสั่งจากสาม packet", en: "one command out of three packets" }, w: true } ] },
      { fn: "Message::parse()", file: "src/Message.cpp", depth: 2,
        note: { th: "ไวยากรณ์ `[:prefix] command *(SP middle) [SP :trailing]` — trailing ที่ขึ้นต้นด้วย `:` **กินทุกอย่างรวมช่องว่างจนจบบรรทัด** และพารามิเตอร์ได้ไม่เกิน 15 ตัว",
                en: "Grammar is `[:prefix] command *(SP middle) [SP :trailing]` — a trailing starting with `:` **swallows everything including spaces**, and there are at most 15 parameters" },
        data: "command = \"PRIVMSG\"\nparams  = [\"#42\", \"hi\"]",
        vars: [
          { n: "m.command", v: "\"PRIVMSG\"", d: { th: "upper-case ก่อนค้นตาราง dispatch", en: "upper-cased before the dispatch lookup" }, w: true } ] },
      { fn: "dispatch()", file: "src/Dispatch.cpp", depth: 1,
        note: { th: "ตารางเดียวแมปชื่อคำสั่งไปหา handler พร้อมธง `needsRegistration` ทำให้ `451 ERR_NOTREGISTERED` เกิดที่เดียว ไม่กระจายในทุก handler",
                en: "One table maps the command to its handler with a `needsRegistration` flag, so `451 ERR_NOTREGISTERED` happens in one place instead of in every handler" },
        data: "PRIVMSG -> cmdPrivmsg (needsRegistration = true)",
        vars: [
          { n: "registered", v: "true", d: { th: "ผ่าน PASS + NICK + USER มาแล้ว", en: "PASS, NICK and USER are all done" } } ] },
      { fn: "Channel::broadcast()", file: "src/Channel.cpp", depth: 2,
        note: { th: "เดินบน **สำเนา** ของรายชื่อสมาชิก เพราะ handler อาจ mark ใครสักคนว่าตายระหว่างวน และส่งให้ทุกคน **ยกเว้นผู้ส่ง** โดยใช้ prefix ของผู้ส่ง",
                en: "Walks a **copy** of the member list because a handler may mark somebody dead mid-loop, and delivers to everyone **except the sender**, using the sender's prefix" },
        data: ":bob!b@host PRIVMSG #42 :hi   -> สมาชิกอื่นทุกคน",
        vars: [
          { n: "_out", d: { th: "`send_()` แค่ต่อท้ายคิว ไม่เรียก syscall — POLLOUT เป็นคนส่งจริง", en: "`send_()` only queues; POLLOUT does the actual sending" }, w: true } ] },
      { fn: "_sweepDisconnected()", file: "src/ServerLoop.cpp", depth: 0,
        note: { th: "ลบ client จริง **ที่เดียวคือท้าย tick** และเฉพาะตัวที่ระบาย out-buffer หมดแล้ว — handler ห้าม `delete` เด็ดขาด ไม่งั้น pointer ค้างกลาง broadcast",
                en: "Clients are deleted **in exactly one place, at the end of the tick**, and only once their out-buffer has drained. A handler must never `delete`, or a pointer goes stale mid-broadcast" },
        data: "ไม่มีใครตาย -> ไม่ลบอะไร",
        vars: [
          { n: "_dead", v: "false", d: { th: "ธงแทนการลบทันที", en: "a flag instead of an immediate delete" } } ] }
    ]
  };
