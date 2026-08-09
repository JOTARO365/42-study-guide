/* webserv — HTTP/1.1 server ใน C++98 บน poll() ตัวเดียว */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

window.TEACHING_DATA.push({
  id: "webserv",
  name: "webserv",
  tag: {
    th: "เขียน HTTP/1.1 server เองด้วย C++98 — poll() ตัวเดียวคุมทั้ง listener, client และ pipe ของ CGI; parse config แบบ NGINX, เสิร์ฟไฟล์, upload, DELETE, autoindex, virtual host, CGI",
    en: "A hand-written HTTP/1.1 server in C++98 — one poll() multiplexing listeners, clients and CGI pipes; an NGINX-style config, static files, uploads, DELETE, autoindex, virtual hosts and CGI"
  },
  accent: "#4ade80",
  sections: {
    principle: [
      { h: "โจทย์คืออะไร" },
      { p: "เขียน **web server ที่พูด HTTP/1.1 ได้จริง** ด้วย C++98 แล้วเปิดด้วยเบราว์เซอร์ได้: `./webserv [config]`. ต้องเสิร์ฟไฟล์นิ่ง, รับ upload, ลบไฟล์ด้วย DELETE, ทำ redirect, autoindex, ฟังหลายพอร์ต, virtual host และรัน **CGI** ตามนามสกุลไฟล์" },
      { p: "**ไม่มี norminette** — เป็นโปรเจกต์ C++ คอมไพล์ด้วย `-Wall -Wextra -Werror -std=c++98`. สิ่งที่ถูกตรวจแทนคือ **กฎเชิงโครงสร้าง 4 ข้อ ที่ผิดข้อเดียวได้ 0**" },
      { h: "4 กฎที่ผิดแล้วได้ 0" },
      { table: { head: ["กฎ", "ทำให้ผ่านยังไง (แบบเป็นรูปธรรม)"], rows: [
        ["**`poll()` ตัวเดียว** คุม I/O ทั้งหมด รวม listener", "ให้ `Server::run()` เป็นเจ้าของตัวเดียว ที่อื่นในโปรเจกต์ห้ามมี `poll/select/epoll` อีก"],
        ["**ห้าม read/write โดยไม่ผ่าน poll**", "ทุก `recv/send/read/write` บน socket หรือ pipe ต้องอยู่ใน handler ที่ถูกเรียกจาก dispatch ของ poll เท่านั้น (**ไฟล์บนดิสก์ยกเว้น** — `open/read` ตรง ๆ ได้และควรทำ)"],
        ["**ห้ามดู `errno` หลัง read/write**", "ใช้นโยบาย 'ตัดสินจากค่า return อย่างเดียว' (ดูข้างล่าง)"],
        ["**`fork()` ได้เฉพาะ CGI**", "มี `fork()` แค่จุดเดียวในทั้งโปรเจกต์ อยู่ในไฟล์ CGI"]
      ]}},
      { p: "อย่าปล่อยให้กฎพวกนี้เป็น 'ความตั้งใจ' — ทำให้มัน **ตรวจได้ด้วยเครื่อง** แล้วใส่ในชุดเทสต์" },
      { code: String.raw`SYSCALL='(^|[^._>:a-zA-Z])'          # ข้าม c.send(, p->send(, Class::send
grep -rnE "$SYSCALL"'poll[[:space:]]*\(' src inc | grep -vE ':[[:space:]]*(//|\*|/\*)'
grep -rnE '\berrno\b|EAGAIN|EWOULDBLOCK' src inc     # ต้องว่างเปล่า`,
        cap: "ตัวกรอง comment สำคัญ: header ที่เขียนว่า 'the single poll()' จะทำให้ gate ของตัวเองพัง", lang: "bash" },
      { h: "นโยบาย errno เขียนครั้งเดียวจบ" },
      { code: String.raw`recv/read == 0   -> ปลายทางปิดแล้ว   -> ตัดการเชื่อมต่อ
recv/read <  0   -> fd ตายแล้ว        -> ตัดการเชื่อมต่อ
send/write < 0   -> ปลายทางหายไปแล้ว  -> ตัดการเชื่อมต่อ`,
        cap: "poll() บอกแล้วว่า fd พร้อม ค่าลบจึงเป็นความล้มเหลวจริง ไม่ใช่ EAGAIN ที่ต้องแยกแยะ", lang: "txt" },
      { note: "เขียนเหตุผลนี้เป็น comment ไว้ข้างการเรียกจริง — **ผู้ตรวจถามข้อนี้แน่นอน** ว่า 'ถ้าไม่ดู errno แล้วรู้ได้ไงว่าต่างกัน'" },
      { h: "ทำไมโปรเจกต์นี้ยาก" },
      { ul: [
        "**ไม่ใช่โจทย์อัลกอริทึม แต่เป็นโจทย์ state machine** — ทุกอย่างต้อง 'หยุดกลางคันแล้วทำต่อได้' เพราะ byte มาทีละนิด",
        "**ผิดเรื่อง event ของ fd = server ค้างหรือหมุน 100% CPU** และหาสาเหตุยากมาก",
        "**CGI คือกระบวนการที่สอง** ที่ต้องคุยผ่าน pipe 2 ทาง โดยไม่ block loop หลัก",
        "**tester ของ subject ยิง 100 MB และ 20 workers × 5000 GET** — โค้ดที่ 'ทำงานได้' กับโค้ดที่ 'รอดจาก tester' คนละเรื่อง"
      ]},
      { h: "สิ่งที่ต้องส่ง" },
      { table: { head: ["ไฟล์", "หน้าที่"], rows: [
        ["`Makefile`", "`all clean fclean re` + ห้าม relink เกินจำเป็น"],
        ["`src/` `inc/`", "โค้ด C++98 ทั้งหมด"],
        ["`config/*.conf`", "ตัวอย่าง config อย่างน้อย 1 ไฟล์ที่ demo ได้ครบ"],
        ["`www/`", "document root สำหรับ demo"]
      ]}}
    ],

    theory: [
      { p: "หมวดนี้คือโปรโตคอลที่ต้องรู้ก่อนเขียนโค้ดบรรทัดแรก — HTTP ไม่ยาก แต่รายละเอียดเยอะและ tester ตรวจรายละเอียด" },
      { h: "1) หน้าตาของ HTTP request" },
      { code: String.raw`POST /upload/file.txt HTTP/1.1\r\n      <- request line: method SP target SP version
Host: localhost:8080\r\n                <- header
Content-Type: text/plain\r\n
Content-Length: 11\r\n
\r\n                                    <- บรรทัดว่าง = จบ header
hello world                             <- body (ยาวตาม Content-Length)`,
        cap: "ตัวคั่นคือ CRLF เสมอ และ header จบด้วย CRLF ว่างหนึ่งบรรทัด", lang: "http" },
      { h: "2) หน้าตาของ response" },
      { code: String.raw`HTTP/1.1 200 OK\r\n                     <- status line
Content-Type: text/html\r\n
Content-Length: 152\r\n
Date: Sat, 09 Aug 2025 12:00:00 GMT\r\n
Connection: keep-alive\r\n
\r\n
<html>...</html>`,
        cap: "client ต้องรู้ว่า body ยาวเท่าไร — จาก Content-Length, จาก chunked, หรือจากการปิด connection", lang: "http" },
      { h: "3) การบอกความยาว body มี 3 แบบ (framing)" },
      { table: { head: ["วิธี", "ใช้เมื่อ", "หมายเหตุ"], rows: [
        ["`Content-Length: n`", "รู้ขนาดล่วงหน้า", "ง่ายและดีที่สุด"],
        ["`Transfer-Encoding: chunked`", "ไม่รู้ขนาด (เช่น output ของ CGI ที่ยังไหลอยู่)", "ส่งเป็นก้อน ๆ นำหน้าด้วยขนาดฐาน 16"],
        ["ปิด connection", "ไม่มีทั้งสองอย่าง", "ต้องส่ง `Connection: close` และ keep-alive ใช้ไม่ได้"]
      ]}},
      { code: String.raw`Transfer-Encoding: chunked

7\r\n          <- ขนาดเป็นเลขฐาน 16
Mozilla\r\n
9\r\n
Developer\r\n
0\r\n          <- chunk ขนาด 0 = จบ
\r\n`, cap: "ทั้งขาเข้าและขาออกใช้รูปแบบเดียวกัน — subject บังคับว่า server ต้อง un-chunk ขาเข้าให้ได้", lang: "http" },
      { note: "**Content-Length มาพร้อม Transfer-Encoding = 400** และ Content-Length ซ้ำสองบรรทัด = 400 เช่นกัน สองอย่างนี้คือช่องทาง request smuggling ที่ผู้ตรวจชอบลอง" },
      { h: "4) keep-alive กับ pipelining" },
      { p: "HTTP/1.1 **ต่อเนื่องเป็นค่าเริ่มต้น** — ส่ง response แล้วไม่ปิด connection รอ request ถัดไปบน socket เดิม. ต้องรีเซ็ต state ของ parser ให้สะอาดทุกครั้ง และ **ห้ามทิ้ง byte ที่อ่านเกินมา** เพราะนั่นคือจุดเริ่มของ request ถัดไป" },
      { h: "5) Host header กับ virtual host" },
      { p: "หลาย `server` block บน `host:port` เดียวกัน = **name-based virtual host** เลือกด้วย header `Host:`. ถ้าไม่มีชื่อไหนตรงเลย ใช้ block **แรก** ของคู่นั้นเป็น default" },
      { ul: [
        "HTTP/1.1 **ไม่มี `Host:` = 400** (บังคับโดย RFC 7230)",
        "HTTP/1.0 ไม่มี Host ได้ ถือว่าปกติ"
      ]},
      { h: "6) status code ที่ต้องใช้จริง" },
      { table: { head: ["Code", "ใช้เมื่อ"], rows: [
        ["200 / 201 / 204", "สำเร็จ / สร้างแล้ว (upload) / สำเร็จแบบไม่มี body (DELETE)"],
        ["301 / 302", "redirect ถาวร / ชั่วคราว (`return 301 https://...;`)"],
        ["400", "request ผิดรูป, ไม่มี Host บน 1.1, framing ขัดกัน"],
        ["403", "ไม่มีสิทธิ์อ่านไฟล์"],
        ["404", "ไม่เจอไฟล์ **และ** ไดเรกทอรีที่ไม่มี index ตอน autoindex off"],
        ["405", "method ไม่อยู่ใน `allow_methods` ของ location นั้น (ต้องมี header `Allow:`)"],
        ["408 / 504", "client เงียบนานเกิน / CGI เงียบนานเกิน"],
        ["413", "body เกิน `client_max_body_size`"],
        ["500 / 502", "server พังเอง / CGI ตอบมาไม่เป็นรูป CGI"],
        ["501", "method ที่ไม่รู้จักเลย"]
      ]}},
      { h: "7) CGI คืออะไร (RFC 3875)" },
      { p: "CGI คือข้อตกลงว่า **web server จะคุยกับโปรแกรมภายนอกยังไง**: server `fork` + `execve` โปรแกรมนั้น, ส่ง metadata ผ่าน **environment variable**, ส่ง body ผ่าน **stdin**, แล้วอ่านผลจาก **stdout**" },
      { code: String.raw`REQUEST_METHOD=POST          SCRIPT_FILENAME=/abs/path/script.php
QUERY_STRING=a=1&b=2         PATH_INFO=/extra/path
CONTENT_LENGTH=11            SERVER_PROTOCOL=HTTP/1.1
CONTENT_TYPE=text/plain      SERVER_NAME / SERVER_PORT / REMOTE_ADDR
REDIRECT_STATUS=200          HTTP_<HEADER> ทุกตัวจาก request`,
        cap: "REDIRECT_STATUS=200 ขาดไม่ได้ ไม่งั้น php-cgi ปฏิเสธที่จะรันเลย", lang: "txt" },
      { p: "**output ของ CGI ขึ้นต้นด้วย header ของมันเอง** แล้วตามด้วยบรรทัดว่างและ body: `Status: 418 ...` มีสิทธิ์เปลี่ยน status code, `Location:` เดี่ยว ๆ แปลว่า 302, และถ้าไม่มีบล็อก header เลย = **502**" },
      { h: "8) ทำไมต้อง poll() และทำไมต้อง non-blocking" },
      { p: "server ต้องดูแล fd หลายร้อยตัวพร้อมกันด้วย **thread เดียว**. `poll()` คือ 'บอกฉันทีว่าตัวไหนพร้อม' แล้วเราค่อยแตะเฉพาะตัวนั้น — ไม่ต้องมี thread ต่อ client และไม่ต้อง busy-wait" },
      { table: { head: ["", "`select()`", "`poll()`"], rows: [
        ["ขีดจำกัด fd", "`FD_SETSIZE` (มัก 1024)", "ไม่มีขีดตายตัว"],
        ["ต้องสร้าง set ใหม่ทุกรอบ", "ใช่ (โดนแก้ทับ)", "ใช่ แต่เป็น array ที่จัดการง่ายกว่า"],
        ["บอก event แยกละเอียด", "read/write/except", "`POLLIN/POLLOUT/POLLHUP/POLLERR/POLLNVAL`"]
      ]}},
      { p: "**non-blocking จำเป็นเพราะ poll บอกได้แค่ 'น่าจะพร้อม'** ไม่ใช่ 'พร้อมแน่ ๆ กี่ไบต์' — ถ้าเผลอ block ที่ `send()` ตัวเดียว ทั้ง server หยุดหมด" }
    ],

    foundations: [
      { p: "หมวดนี้คือกลไกระดับ fd และ buffer ที่ตัดสินว่า server จะนิ่งหรือจะพัง" },
      { h: "fd แต่ละชนิดต้องขอ event อะไร" },
      { table: { head: ["fd", "POLLIN", "POLLOUT"], rows: [
        ["listener", "**เสมอ**", "ไม่เคย"],
        ["client", "ระหว่างกำลังอ่าน request", "เมื่อ out-buffer ไม่ว่าง"],
        ["cgi stdin (ฝั่งเขียน)", "ไม่เคย", "ระหว่างยังมี body เหลือ"],
        ["cgi stdout (ฝั่งอ่าน)", "จนกว่าจะ EOF", "ไม่เคย"]
      ]}},
      { note: "**ขอ POLLOUT ทิ้งไว้ตลอด = CPU 100%** เพราะ socket ว่างเสมอ poll จึงคืนทันทีทุกรอบ. ขอเฉพาะตอนมีของค้างจริงเท่านั้น — นี่คือบั๊กที่พบบ่อยที่สุดข้อหนึ่ง" },
      { h: "สร้าง pollfd ใหม่ทุกรอบ อย่าเก็บ index" },
      { p: "**build vector ของ `pollfd` ขึ้นใหม่ทุก tick** จาก registry ของ fd ที่ยังมีชีวิต. ต้นทุนคือ O(fds) ซึ่งถูกกว่า syscall ที่ตามมา และมันฆ่าบั๊กทั้งตระกูล 'ปิด fd ระหว่าง dispatch แล้ว index ที่เก็บไว้เพี้ยน' ทิ้งไปเลย" },
      { code: String.raw`// ผิด: เก็บ index ไว้ข้ามรอบ แล้ว client กลางแถวถูกลบ
for (size_t i = 0; i < _pfds.size(); ++i) { ... _pfds.erase(_pfds.begin()+i); ... }

// ถูก: ประกอบใหม่จากความจริงปัจจุบัน
_pfds.clear();
for (it = _listeners.begin(); it != _listeners.end(); ++it) push(it->fd, POLLIN);
for (it = _conns.begin();     it != _conns.end();     ++it) push(it->fd, it->wantEvents());`,
        cap: "แหล่งความจริงคือ registry ไม่ใช่ array ของ poll", lang: "cpp" },
      { h: "buffer ต่อ connection: อ่านและเขียนต้องแยกกัน" },
      { code: String.raw`struct Connection {
    int          fd;
    std::string  _inBuf;    // byte ดิบที่ยังไม่ถูก parse
    size_t       _pos;      // อ่านถึงไหนแล้วใน _inBuf
    std::string  _outBuf;   // byte ที่รอส่งออก
    HttpRequest  _req;      // state machine ที่กินจาก _inBuf
    time_t       _lastIo;   // ไว้ตัดสิน timeout
};`, cap: "อ่านสะสมเข้า _inBuf, เขียนดูดออกจาก _outBuf — ไม่มีที่ไหนที่ block", lang: "cpp" },
      { p: "**บีบ buffer เป็นระยะ** (`_buf.erase(0, _pos)`) ไม่งั้น connection ที่อยู่ยาวจะโตขึ้นเรื่อย ๆ ทั้งที่ข้อมูลเก่าถูกใช้ไปแล้ว" },
      { h: "state machine ของ request ต้อง 'พัก' ตรงที่ header จบ" },
      { p: "ขนาด body สูงสุดขึ้นกับ `client_max_body_size` **ของ location ที่ตรงกัน** ซึ่งรู้ได้หลัง parse path เสร็จเท่านั้น — parser จึงต้องมีสถานะที่แปลว่า *'header ครบแล้ว รอผู้เรียกบอกลิมิต'*" },
      { code: String.raw`ST_REQUEST_LINE -> ST_HEADERS -> ST_HEADERS_DONE
                                     |  ผู้เรียกหา vhost + location
                                     |  แล้วสั่ง applyBodyLimit(n)
                                     v
                    ST_BODY_LENGTH | ST_BODY_CHUNK_* -> ST_DONE`,
        cap: "ทุกสถานะต้อง resumable — ในเทสต์ byte มาทีละตัวจริง ๆ", lang: "txt" },
      { p: "**un-chunk ใน parser** ไม่ใช่ใน handler — เพื่อให้ handler และ CGI เห็นแต่ body ธรรมดาเสมอ นี่คือสิ่งที่ subject หมายถึงตอนบอกว่า 'your server needs to un-chunk them'" },
      { h: "หน่วยความจำ: อย่าเก็บ body ใหญ่ไว้ใน RAM" },
      { p: "การถือ body ทั้งก้อนใน memory คือสาเหตุที่ tester เฟสสุดท้าย (POST 100 MB พร้อมกัน 20 ตัว) ทำให้ server โดน OOM kill. วัดจากโค้ดเดียวกัน เทสต์เดียวกัน: **buffering 2020 MB peak / spooling 22 MB peak**" },
      { code: String.raw`body <= client_body_buffer_size (เช่น 1 MiB)  -> เก็บใน std::string
body >  client_body_buffer_size               -> เปิดไฟล์ใต้ client_body_temp_path
                                                 แล้วเขียนทุก byte ถัดไปลงไฟล์
   (un-chunk ก่อนเขียน เพื่อให้ไฟล์เก็บ body ที่ decode แล้ว)`,
        cap: "ไฟล์บนดิสก์ได้รับการยกเว้นจากกฎ poll — open/read/write ตรง ๆ ถูกต้องแล้ว", lang: "txt" },
      { table: { head: ["ผู้ใช้ body", "เมื่อ body อยู่บนดิสก์"], rows: [
        ["CGI", "อ่านไฟล์ทีละก้อน แล้วเขียนก้อนนั้นลง stdin ของลูก"],
        ["upload แบบดิบ", "copy ไฟล์→ไฟล์ทีละก้อน ไม่เข้า memory เลย"],
        ["upload แบบ multipart", "ต้องอ่านกลับทั้งก้อน (boundary แยกทีละส่วนไม่ได้) จำกัดด้วย `client_max_body_size`"],
        ["POST ธรรมดา", "ต้องการแค่จำนวน byte"]
      ]}},
      { note: "**ระบุเจ้าของไฟล์ชั่วคราวให้ชัด ไม่งั้นไฟล์ค้าง**: request ลบ spool ของตัวเองตอน reset, ตอน drop body และใน destructor — **ยกเว้น** เมื่อมันส่งไฟล์ให้ CGI ไปแล้ว ซึ่ง CGI จะเป็นคนลบตอนปิด stdin ของลูก" },
      { h: "socket ต้องตั้งค่าอะไรบ้าง" },
      { ul: [
        "`SO_REUSEADDR` **ก่อน** `bind` ไม่งั้นรีสตาร์ตระหว่าง TIME_WAIT จะ bind ไม่ติด",
        "`O_NONBLOCK` ทั้ง listener **และ socket ที่ได้จาก accept**",
        "`accept()` วนจนกว่าจะคืนค่าลบ — 1 event ของ poll อาจหมายถึงหลาย connection ที่รออยู่",
        "`signal(SIGPIPE, SIG_IGN)` ใน `main` ไม่งั้น peer ตัวแรกที่หายไปจะฆ่าโปรเซส",
        "`fcntl` ใช้ได้เฉพาะ `F_SETFL`, `O_NONBLOCK`, `FD_CLOEXEC` เท่านั้น"
      ]}
    ],

    architecture: [
      { p: "หมวดนี้คือการแบ่งไฟล์และความรับผิดชอบ — โครงนี้รอดจาก tester ของ subject จริง" },
      { h: "โครงไฟล์" },
      { code: String.raw`inc/                          src/
  Webserv.hpp                   main.cpp
  ConfigTypes.hpp               config/ConfigParser.cpp   ConfigTypes.cpp
  ConfigParser.hpp              core/   Server.cpp  Listener.cpp  Connection.cpp
  Server.hpp Listener.hpp       http/   HttpRequest.cpp   HttpResponse.cpp
  Connection.hpp                        RequestHandler.cpp  Mime.cpp
  HttpRequest.hpp               cgi/    CgiProcess.cpp  Session.cpp
  HttpResponse.hpp              utils/  Utils.cpp
  RequestHandler.hpp
  CgiProcess.hpp Session.hpp    config/default.conf  config/tester.conf
  Mime.hpp Utils.hpp            www/  YoupiBanane/`,
        cap: "แยกตามชั้น: config → core (event loop) → http (โปรโตคอล) → cgi", lang: "txt" },
      { h: "ความรับผิดชอบต่อคลาส" },
      { table: { head: ["คลาส", "รับผิดชอบ", "ห้ามทำ"], rows: [
        ["`ConfigParser`", "อ่านไฟล์ .conf → โครงสร้าง `Config`", "แตะ socket"],
        ["`Listener`", "socket/bind/listen ต่อ 1 คู่ host:port", "จัดการ request"],
        ["`Server`", "**เจ้าของ `poll()` ตัวเดียว** + registry ของ fd", "parse HTTP"],
        ["`Connection`", "buffer เข้า/ออกของ client 1 ราย + สถานะ keep-alive", "เรียก poll เอง"],
        ["`HttpRequest`", "state machine ที่ย่อย byte เป็น request (รวม un-chunk)", "แตะไฟล์"],
        ["`RequestHandler`", "ตัดสินใจว่า request นี้ตอบอะไร (ไฟล์/CGI/redirect/error)", "แตะ poll"],
        ["`CgiProcess`", "fork+execve, pipe 2 ทาง, timeout, parse header ของ CGI", "แตะ client โดยตรง"],
        ["`HttpResponse`", "ประกอบ status line + header + body", "ตัดสินใจเชิงนโยบาย"]
      ]}},
      { h: "การไหลระดับบนสุด" },
      { code: String.raw`main -> ConfigParser::parseFile -> Config
     -> Server::setup    1 Listener ต่อ host:port ที่ไม่ซ้ำ
     |                   (หลาย server block บนคู่เดียวกัน = virtual host)
     -> Server::run      poll()
          listener readable  -> accept() วนจนคืนค่าลบ
          client readable    -> HttpRequest::feed (resumable)
          request ครบ        -> RequestHandler::handle
                                  -> response ทันที หรือ CgiParams -> fork
          cgi stdin writable -> ดัน body เข้าไปในลูก
          cgi stdout readable-> เก็บ output; EOF -> ประกอบ response
          client writable    -> ระบายออก; keep-alive ก็รีเซ็ต ไม่งั้นปิด`,
        cap: "ทุกลูกศรคือ callback จาก dispatch เดียว — ไม่มี I/O นอกเส้นนี้", lang: "txt" },
      { h: "config แบบ NGINX ที่ควรลอก" },
      { code: String.raw`server {
    listen 127.0.0.1:8080;
    server_name localhost webserv.local;
    root ./www/html;
    index index.html;
    autoindex off;
    client_max_body_size 5m;
    error_page 404 /errors/404.html;
    error_page 500 502 503 504 /errors/50x.html;

    location / {
        allow_methods GET HEAD;
    }
    location /uploads {
        root ./www/uploads;
        allow_methods GET HEAD DELETE;
        autoindex on;
    }
    location /upload {
        allow_methods POST;
        upload_store ./www/uploads;
    }
    location *.php {
        root ./www;
        cgi_pass /usr/bin/php-cgi;
    }
    location /old {
        return 301 /new;
    }
}`, cap: "1 server block = 1 virtual host; location คือกฎย่อยตาม path หรือส่วนขยาย", lang: "nginx" },
      { h: "การเลือก location — เลียนแบบ NGINX โดยไม่ใช้ regex" },
      { table: { head: ["ลำดับ", "ชนิด", "ตัวอย่าง"], rows: [
        ["1", "**exact**", "`location = /health`"],
        ["2", "**extension**", "`location *.bla`"],
        ["3", "**longest prefix**", "`location /uploads`"]
      ]}},
      { code: String.raw`// กันไม่ให้ /foo ไปแมตช์ /foobar
if (loc.path.size() > 1 && uri.size() > loc.path.size()
    && uri[loc.path.size()] != '/') continue;`,
        cap: "ขาดบรรทัดนี้แล้ว /uploads จะกลืน /uploadsomething", lang: "cpp" },
      { note: "**prefix location ที่มี `root` ของตัวเองจะ 'แทนที่' ส่วน prefix** (`/kapouet` + `root /tmp/www` → `/tmp/www/pouic/toto/pouet`) แต่ **extension location เก็บ URI ทั้งเส้นไว้ใต้ root** ดังนั้น `location *.sh { root ./www; }` จะเสิร์ฟ `/cgi-bin/info.sh` จาก `./www/cgi-bin/info.sh` — สับสนสองอันนี้คือสาเหตุยอดฮิตของ 'CGI ของฉัน 404'" },
      { h: "ค่าที่ต้องเป็น directive ไม่ใช่ค่าคงที่" },
      { p: "`client_timeout` และ `cgi_timeout` ต้องตั้งได้จาก config: ชุดเทสต์ต้องการ deadline 2-3 วินาที ส่วนตอน demo ต้องการ 60 วินาที ถ้า hard-code ไว้จะเทสต์ไม่ได้เลย" }
    ],

    dataflow: [
      { p: "ตาม request หนึ่งใบตั้งแต่ byte แรกถึง byte สุดท้าย แล้วตามด้วยเส้นทางของ CGI" },
      { h: "หนึ่ง tick ของ event loop" },
      { code: String.raw`1. ประกอบ pollfd ใหม่จาก registry (listener + client + cgi pipe)
2. poll(&pfds[0], n, timeout_ms)
3. เดินทุก fd ที่มี revents:
      listener POLLIN      -> accept วนจนคืนค่าลบ, ตั้ง O_NONBLOCK, ลงทะเบียน
      POLLHUP/ERR/NVAL     -> ตัดทิ้ง
      client POLLIN        -> recv -> _inBuf -> req.feed()
      client POLLOUT       -> send -> ลบ byte ที่ส่งไปจริงออกจาก _outBuf
      cgi out POLLIN       -> read -> header/body ของ CGI
      cgi in  POLLOUT      -> write body ลงลูก; หมดแล้ว -> close(EOF)
4. สแกน timeout (client เงียบ / CGI เงียบ) ด้วย waitpid(WNOHANG)
5. เก็บกวาด connection ที่ปิดแล้วและระบาย out-buffer หมดแล้ว`,
        cap: "หนึ่งรอบ = อ่านสถานะ → ทำงานตามที่พร้อม → เก็บกวาด", lang: "txt" },
      { h: "เส้นทางของ static GET" },
      { code: String.raw`recv 74 bytes  "GET /index.html HTTP/1.1\r\nHost: localhost\r\n\r\n"
 -> HttpRequest::feed  ST_REQUEST_LINE -> ST_HEADERS -> ST_HEADERS_DONE
 -> Server หา vhost จาก Host: -> หา location ที่ตรงกับ /index.html
 -> applyBodyLimit(5m)  -> ไม่มี body -> ST_DONE
 -> RequestHandler::handle
      method อยู่ใน allow_methods ไหม? ไม่อยู่ -> 405 + Allow:
      normalize URI (percent-decode, ยุบ . และ ..)
      map -> ./www/html/index.html
      stat: เป็นไฟล์ -> open/read (ไฟล์ปกติ ไม่ต้องผ่าน poll)
      เดา Content-Type จากนามสกุล (Mime)
 -> HttpResponse -> เขียนลง _outBuf -> ขอ POLLOUT
 -> client POLLOUT -> send -> ระบายหมด
 -> Connection: keep-alive? รีเซ็ต parser รอ request ถัดไป : close`,
        cap: "สังเกตว่าไฟล์บนดิสก์ถูก read ตรง ๆ — นั่นถูกต้องและ subject ยกเว้นให้", lang: "txt" },
      { h: "เส้นทางของไดเรกทอรี" },
      { table: { head: ["สภาพ", "ผลลัพธ์"], rows: [
        ["มีไฟล์ `index` ตามที่ตั้งไว้", "เสิร์ฟไฟล์นั้น"],
        ["ไม่มี index แต่ `autoindex on`", "สร้าง HTML รายการไฟล์"],
        ["ไม่มี index และ `autoindex off`", "**404** (ไม่ใช่ 403 แบบ NGINX — tester ตรวจข้อนี้)"],
        ["URI ไม่ลงท้ายด้วย `/` แต่เป็นไดเรกทอรี", "301 ไปยัง URI + `/`"]
      ]}},
      { h: "เส้นทางของ CGI (จุดที่ยากที่สุด)" },
      { code: String.raw`RequestHandler ตัดสินว่าเป็น CGI (นามสกุลตรงกับ location)
 -> สร้าง pipe 2 ตัว: in[2] (server->child), out[2] (child->server)
 -> ตั้ง O_NONBLOCK ทั้ง 2 ปลายที่ server ถือ
 -> fork()
      ลูก:  dup2(in[0], STDIN);  dup2(out[1], STDOUT)
            ปิด fd ที่ไม่ใช้ทั้งหมด
            chdir(ไดเรกทอรีของสคริปต์)        <- subject บังคับ
            execve(interpreter, argv, envp)
      แม่: ปิด in[0], out[1]; ลงทะเบียน in[1] (POLLOUT) และ out[0] (POLLIN)
 -> POLLOUT บน in[1]: เขียน body ทีละก้อน
        เขียนครบ -> close(in[1])   <- EOF นี้คือสัญญาณ 'จบ body' เดียวที่ลูกได้
 -> POLLIN บน out[0]: อ่าน -> สะสมเฉพาะ 'บล็อก header' จนถึงบรรทัดว่าง
        header จบแล้ว -> ตัดสิน status/framing -> byte ที่เหลือ stream ตรงเข้า _outBuf
 -> EOF บน out[0] -> waitpid(WNOHANG) -> ปิด process`,
        cap: "2 pipe อยู่ใน poll เดียวกับ client — ไม่มีการรอแบบ block ที่ไหนเลย", lang: "txt" },
      { h: "การตัดสิน framing ของ response จาก CGI" },
      { table: { head: ["CGI ให้อะไรมา", "server ตอบยังไง"], rows: [
        ["`Content-Length` มา", "ส่ง body ผ่านตรง ๆ"],
        ["ไม่มี length แต่ keep-alive", "ห่อใหม่เป็น `Transfer-Encoding: chunked`"],
        ["ไม่มี length และไม่ keep-alive", "ปิดเป็นตัวจบ + `Connection: close`"],
        ["`Status: 418 ...`", "ใช้ code นั้นแทน 200"],
        ["`Location:` เดี่ยว ๆ", "302"],
        ["ไม่มีบล็อก header เลย", "**502**"]
      ]}},
      { note: "**stream อย่าบัฟเฟอร์**: server ที่บัฟเฟอร์จะถือ body ไว้ 3 ชุด (ตัวสะสมของ CGI, body ของ response, byte ที่ประกอบแล้ว) — นี่คือความต่างระหว่าง 'รอดจาก 20 concurrent 100 MB CGI POST' กับ 'โดน OOM kill'" },
      { h: "back-pressure — เบรกเมื่อ client ช้ากว่า CGI" },
      { p: "ถ้ายังมีของค้างใน `_outBuf` ของ client เกิน ~256 KB ให้ **เอาปลายอ่านของ CGI ออกจาก poll set ชั่วคราว**. pipe จะเต็ม ลูกจะ block เอง หน่วยความจำหยุดโต แล้วค่อยเอากลับเข้า set เมื่อระบายได้" },
      { h: "timeout ของ CGI ต้องนับ 'ความเงียบ' และต้องหยุดนับตอน back-pressure" },
      { ul: [
        "**บั๊กที่ 1:** ใช้ budget เวลารวม → upload 100 MB ที่กำลังไหลผ่านลูกอยู่ดี ๆ กลายเป็น 504. แก้ด้วยการประทับเวลาทุกครั้งที่ pipe อ่าน/เขียนสำเร็จ แล้ววัดจาก 'เงียบมานานเท่าไร'",
        "**บั๊กที่ 2:** พอมี back-pressure ลูกก็ไม่มี I/O เพราะ *เราหยุดอ่านมันเอง* — deadline แบบเงียบจะไปฆ่า CGI ที่สุขภาพดี แล้ว client เห็นเป็น EOF กลาง body. ให้บังคับ deadline **เฉพาะตอนที่ connection ยินดีรับข้อมูลอยู่**"
      ]},
      { p: "และจำไว้ว่า **เมื่อ header ของ response ออกไปแล้ว จะเปลี่ยน status ไม่ได้อีก** — CGI ที่ timeout ทีหลังทำได้แค่ตัด connection ไม่สามารถตอบ 504 ได้" }
    ],

    implementation: [
      { p: "โครงโค้ดที่เอาไปต่อยอดได้ทันที — C++98 ล้วน ไม่มี auto ไม่มี lambda" },
      { h: "1) event loop ที่ถูกต้อง" },
      { code: String.raw`void Server::run() {
    while (_running) {
        buildPollSet();                         // ประกอบใหม่ทุกรอบ
        int n = poll(&_pfds[0], _pfds.size(), POLL_TIMEOUT_MS);
        if (n < 0) {                            // EINTR ก็มาทางนี้ ห้ามตาย
            if (!_running) break;
            continue;
        }
        for (size_t i = 0; i < _pfds.size(); ++i) {
            short re = _pfds[i].revents;
            if (!re) continue;
            int fd = _pfds[i].fd;
            if (re & (POLLHUP | POLLERR | POLLNVAL)) { dropFd(fd); continue; }
            if (re & POLLIN)  onReadable(fd);
            if (re & POLLOUT) onWritable(fd);
        }
        sweepTimeouts();
        sweepClosed();
    }
}`, cap: "ลูปเดียว ตัดสินใจจาก revents เท่านั้น ไม่มีการเดา", lang: "cpp" },
      { h: "2) accept ให้ครบในหนึ่ง event" },
      { code: String.raw`void Server::onListenerReadable(int lfd) {
    for (;;) {
        int cfd = accept(lfd, NULL, NULL);
        if (cfd < 0) break;                 // ไม่มีที่รออยู่แล้ว (ห้ามดู errno)
        fcntl(cfd, F_SETFL, O_NONBLOCK);
        _conns.insert(std::make_pair(cfd, new Connection(cfd, lfd)));
    }
}`, cap: "1 event ของ poll อาจหมายถึงหลาย connection — ไม่วนแล้วจะค้างค้างหาย", lang: "cpp" },
      { h: "3) อ่านและป้อน parser" },
      { code: String.raw`void Connection::onReadable() {
    char buf[16 * 1024];
    ssize_t n = recv(_fd, buf, sizeof(buf), 0);
    if (n <= 0) { _dead = true; return; }        // 0 = ปิด, <0 = ตาย
    _lastIo = std::time(NULL);
    _req.feed(buf, static_cast<size_t>(n));

    if (_req.state() == HttpRequest::ST_HEADERS_DONE) {
        const Server_& vh  = _cfg.pickVirtualHost(_listenerId, _req.header("host"));
        const Location& lo = vh.pickLocation(_req.target());
        _req.applyBodyLimit(lo.clientMaxBodySize);   // ปลดล็อกให้อ่าน body ต่อ
    }
    if (_req.state() == HttpRequest::ST_DONE) handleRequest();
}`, cap: "จุดพักตรง HEADERS_DONE คือหัวใจของการรู้ลิมิตให้ทันก่อนอ่าน body", lang: "cpp" },
      { h: "4) de-chunk ที่ resumable จริง" },
      { code: String.raw`// สถานะแยกเป็น 3 ช่วง: อ่านบรรทัดขนาด, อ่านข้อมูล, อ่าน CRLF ปิดท้าย
bool HttpRequest::feedChunked(const char* p, size_t n, size_t& used) {
    while (used < n) {
        if (_st == ST_BODY_CHUNK_SIZE) {
            if (!takeLine(p, n, used, _line)) return true;   // ยังไม่ครบบรรทัด รอต่อ
            _chunkLeft = hexToSize(_line);
            if (_chunkLeft == 0) { _st = ST_BODY_CHUNK_TRAILER; continue; }
            _st = ST_BODY_CHUNK_DATA;
        } else if (_st == ST_BODY_CHUNK_DATA) {
            size_t take = std::min(_chunkLeft, n - used);
            appendBody(p + used, take);        // ไปที่ string หรือไฟล์ spool
            used += take; _chunkLeft -= take;
            if (_chunkLeft == 0) _st = ST_BODY_CHUNK_CRLF;
        } else if (_st == ST_BODY_CHUNK_CRLF) {
            if (!takeCrlf(p, n, used)) return true;
            _st = ST_BODY_CHUNK_SIZE;
        } else break;
    }
    return true;
}`, cap: "ทุก return true คือ 'ยังไม่พอ กลับมาใหม่รอบหน้า' — ไม่มีการ block", lang: "cpp" },
      { h: "5) fork CGI แบบไม่ block" },
      { code: String.raw`bool CgiProcess::start(const CgiParams& prm) {
    int in[2], out[2];
    if (pipe(in) < 0) return false;
    if (pipe(out) < 0) { close(in[0]); close(in[1]); return false; }

    _pid = fork();
    if (_pid == 0) {                                   // ลูก
        dup2(in[0], STDIN_FILENO);
        dup2(out[1], STDOUT_FILENO);
        close(in[0]); close(in[1]); close(out[0]); close(out[1]);
        chdir(prm.scriptDir.c_str());                  // subject บังคับ
        execve(_exe.c_str(), _argv, _envp);
        std::exit(1);                                  // execve คืนค่า = ล้มเหลว
    }
    close(in[0]); close(out[1]);
    _inFd = in[1]; _outFd = out[0];
    fcntl(_inFd, F_SETFL, O_NONBLOCK);
    fcntl(_outFd, F_SETFL, O_NONBLOCK);
    _lastIo = std::time(NULL);
    return true;
}`, cap: "fork เดียวในโปรเจกต์ทั้งหมด และอยู่ในไฟล์นี้ไฟล์เดียว", lang: "cpp" },
      { h: "6) interpreter ที่เป็น path สัมพัทธ์หลัง chdir" },
      { p: "`chdir` ทำให้ `./cgi_tester` หาไม่เจอ และ **`getcwd()` ไม่อยู่ในรายการฟังก์ชันที่อนุญาต** วิธีแก้คือกลับทิศของ path สัมพัทธ์เอง" },
      { code: String.raw`// "./YoupiBanane" ลึก 1 ชั้น -> "../";  "./www/cgi" -> "../../"
static std::string relativeBackPath(const std::string& dir);  // "" ถ้าเป็น absolute หรือมี ".."
exe = (interp[0] == '/') ? interp : relativeBackPath(dir) + interp;`,
        cap: "และตั้ง SCRIPT_FILENAME / PATH_TRANSLATED เป็น basename หลัง chdir ไม่งั้น php-cgi เปิดไฟล์ไม่ได้", lang: "cpp" },
      { h: "7) parse header ที่ CGI ตอบกลับ" },
      { code: String.raw`size_t sep = _cgiHead.find("\r\n\r\n");
if (sep == std::string::npos) sep = _cgiHead.find("\n\n");
if (sep == std::string::npos && eofReached) return respondError(502);

int code = 200;
for (แต่ละบรรทัดใน header ของ CGI) {
    if (name == "status")   code = atoi(value.c_str());
    else if (name == "location" && code == 200) code = 302;
    else if (name == "content-length") hasLength = true;
    else out.addHeader(name, value);
}`, cap: "ไม่มีบล็อก header = 502 เสมอ นี่คือเคสที่ tester ตรวจ", lang: "cpp" },
      { h: "8) เขียน error page ให้ถูกที่" },
      { code: String.raw`// error_page ของ location > ของ server > หน้าที่ generate เอง
std::string body;
if (!loc.errorPage(code).empty() && readFile(root + loc.errorPage(code), body))
    return send(code, body, "text/html");
return send(code, defaultErrorHtml(code), "text/html");`,
        cap: "หน้า error ที่ตั้งเองต้องอ่านล้มเหลวได้โดยไม่ทำให้เกิด recursion", lang: "cpp" },
      { h: "9) Makefile ที่ไม่ relink" },
      { code: String.raw`CXX      = c++
CXXFLAGS = -Wall -Wextra -Werror -std=c++98 -MMD -MP
SRCS     = $(shell find src -name '*.cpp')
OBJS     = $(SRCS:src/%.cpp=obj/%.o)
DEPS     = $(OBJS:.o=.d)

all: webserv
webserv: $(OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $(OBJS)
obj/%.o: src/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -Iinc -c $< -o $@
-include $(DEPS)
clean:  ; rm -rf obj
fclean: clean ; rm -f webserv
re: fclean all
.PHONY: all clean fclean re`,
        cap: "-MMD -MP สร้างไฟล์ .d ให้ make รู้ว่า .cpp ไหนขึ้นกับ header ไหน", lang: "make" }
    ],

    tricks: [
      { h: "tester ของ subject ต้องการอะไรที่เดาไม่ได้" },
      { p: "สร้างโครงไฟล์นี้ให้ตรงเป๊ะก่อนรัน:" },
      { code: String.raw`YoupiBanane/youpi.bad_extension          config: "/" ตอบเฉพาะ GET
YoupiBanane/youpi.bla                            *.bla ตอบ POST ผ่าน ./cgi_tester
YoupiBanane/nop/youpi.bad_extension              /post_body ตอบ POST, maxBody 100
YoupiBanane/nop/other.pouic                      /directory/ root ที่ YoupiBanane,
YoupiBanane/Yeah/not_happy.bad_extension         index = youpi.bad_extension`,
        cap: "ไฟล์ที่ขาดไปหนึ่งไฟล์ = เทสต์ล้มโดยที่โค้ดไม่ผิดเลย", lang: "txt" },
      { table: { head: ["สิ่งที่ tester คาด", "ทำไมถึงเดาไม่ถูก"], rows: [
        ["`HEAD /` ต้องได้ **405**", "route ที่เขียนว่า 'GET only' ต้องไม่ให้ HEAD ขี่สิทธิ์ของ GET — HEAD ต้องมีรายการของตัวเองใน `allow_methods`"],
        ["ไดเรกทอรีไม่มี index + autoindex off ต้อง **404**", "NGINX ตอบ 403 แต่ที่นี่ต้อง 404 (`/directory/Yeah`)"],
        ["`POST /directory/youpla.bla` ที่ไฟล์ **ไม่มีอยู่จริง** ต้องถึง CGI ไม่ใช่ 404", "`cgi_tester` เป็น gateway ไม่ใช่ interpreter — ทำเป็น switch ต่อ route (`cgi_require_file on|off`) จะได้ไม่กระทบ interpreter จริงที่ควร 404"],
        ["POST body **100 MB** ไปที่ `.bla`", "`client_max_body_size` ต้องผ่าน และ CGI timeout ต้องไม่เด้ง"]
      ]}},
      { code: String.raw`printf '\n\n\n\n\n\n\n\n\n\n' | ./tester http://localhost:8080`,
        cap: "tester หยุดรอ Enter หลายจุด — ต้องป้อนแบบ non-interactive", lang: "bash" },
      { p: "เฟสท้ายหนักมาก: 20 workers × 5000 GET, 128 workers × 50 GET แล้วตามด้วย 20 workers × POST 100 MB ห้าครั้ง **เผื่อเวลา ~10 นาที**" },
      { h: "วัดก่อนโทษ server (สำคัญมากบน WSL)" },
      { p: "document root ที่อยู่ใต้ `/mnt/c` หรือ `/mnt/d` เสียเวลา ~5 ms ต่อการอ่านไฟล์หนึ่งครั้ง. **binary เดียวกัน โค้ดเดียวกัน: 206 req/s บน drvfs เทียบกับ 8011 req/s บน ext4**" },
      { ul: [
        "ถ้า throughput ดูต่ำผิดปกติ ให้ `cp -r` โปรเจกต์เข้า `~` ก่อนแล้ววัดใหม่",
        "**อาการบ่งชี้:** route ที่ไม่อ่านไฟล์ (`return 200 OK;`) ยังเร็วอยู่ แต่ไฟล์นิ่งช้า = ปัญหาที่ filesystem ไม่ใช่โค้ด",
        "เช็ก RAM ด้วย: WSL ให้แค่เศษหนึ่งของเครื่อง และเฟสสุดท้ายต้องการ ~2 GB. OOM จะเห็นเป็นคำว่า `Killed` และ tester เห็นเป็น EOF เปล่า ๆ — ยืนยันด้วย `dmesg | grep -i oom-kill` ก่อนไล่หาบั๊กตรรกะ"
      ]},
      { h: "กับดักรายการฟังก์ชันที่อนุญาต" },
      { table: { head: ["อยากใช้", "ใช้อะไรแทน"], rows: [
        ["`inet_ntop` สำหรับ `REMOTE_ADDR`", "`ntohl(addr.sin_addr.s_addr)` แล้วประกอบเลข 4 ท่อนเอง"],
        ["`unlink` สำหรับ DELETE", "`std::remove` จาก `<cstdio>`"],
        ["`getcwd` สำหรับ interpreter สัมพัทธ์", "กลับทิศของ chdir เอง (ดูหมวด implement)"],
        ["`gettimeofday`", "`std::time` จาก `<ctime>`; `std::gmtime` + `std::strftime` สำหรับ header `Date`"],
        ["`mkstemp` / `getpid` ตั้งชื่อไฟล์ชั่วคราว", "counter + เวลา เปิดด้วย `O_CREAT|O_EXCL` แล้ว retry ถ้าชน"]
      ]}},
      { note: "ในรายการไม่มี `select` (ถ้าเลือก poll แล้ว), ไม่มี `usleep`. และ `fcntl` ใช้ได้เฉพาะ `F_SETFL`, `O_NONBLOCK`, `FD_CLOEXEC`" },
      { h: "ของถูกที่ควรมีติดตัวไว้" },
      { ul: [
        "`_inBuf.swap(params.body)` แทนการ assign — ประหยัดการ copy ทั้งก้อน",
        "ปล่อย input buffer ของลูกทันทีที่ปิด pipe ของมัน",
        "ทิ้ง body ของ request ทันทีที่ส่งต่อไปแล้ว",
        "บีบ read buffer (`_buf.erase(0, _pos)`) ตามการบริโภค",
        "ประกอบ head + body ลง out-buffer ตรง ๆ แทนการสร้าง response string ทั้งก้อนก่อน"
      ]},
      { h: "เช็กลิสต์ความทนทาน" },
      { ul: [
        "`signal(SIGPIPE, SIG_IGN)` ใน `main`",
        "`SO_REUSEADDR` ก่อน `bind`",
        "`O_NONBLOCK` บน socket ที่ได้จาก accept ด้วย ไม่ใช่แค่ listener",
        "`accept()` วนจนคืนค่าลบ",
        "**normalize URI** (percent-decode แล้วยุบ `.` / `..` โดยทิ้ง `..` ที่จะหลุดออกนอก root) **ก่อน** แตะ filesystem",
        "ปฏิเสธ `Content-Length` คู่กับ `Transfer-Encoding` และ `Content-Length` ซ้ำ ด้วย 400",
        "HTTP/1.1 ไม่มี `Host` = 400; HTTP/1.0 ไม่มีได้"
      ]},
      { h: "วิธี debug ที่ได้ผลจริง" },
      { table: { head: ["อาการ", "ดูที่ไหนก่อน"], rows: [
        ["CPU 100% ทั้งที่ไม่มีใครต่อ", "POLLOUT ที่ขอค้างไว้ทั้งที่ out-buffer ว่าง"],
        ["server ค้างไม่ตอบ", "fd ที่ขอ event ผิดชนิด (เช่น รอ POLLIN บน cgi stdin)"],
        ["CGI 502", "ไม่มีบล็อก header จาก CGI / execve ล้มเหลวเงียบ ๆ"],
        ["CGI 504 ทั้งที่ทำงานอยู่", "timeout วัดเวลารวมแทนที่จะวัดความเงียบ"],
        ["ข้อความหายกลางทาง", "`send()` คืนค่าน้อยกว่าที่ขอ แล้วเราลบเกิน"],
        ["RAM พุ่ง", "buffer body ทั้งก้อน / ไม่ทำ back-pressure"],
        ["`Address already in use`", "ลืม `SO_REUSEADDR`"]
      ]}}
    ],

    eval: [
      { p: "คำถามที่ผู้ตรวจถามจริง เรียงจากที่ถามแน่นอนไปหาที่ถามเมื่ออยากลึก" },
      { qa: [
        { q: "ทำไมต้องใช้ poll() แค่ตัวเดียว",
          a: "เพราะ server มี thread เดียวแต่ต้องดูแล fd หลายร้อยตัว — poll เป็นจุดเดียวที่บอกว่า fd ไหนพร้อม ถ้ามีหลายจุดหรือมี I/O นอกเส้นทางนี้ จะเกิดการ block ที่ทำให้ทั้ง server หยุด และ subject ให้ 0 ทันที" },
        { q: "ทำไมต้องตั้ง non-blocking ทั้งที่ poll บอกแล้วว่าพร้อม",
          a: "poll บอกแค่ว่า 'น่าจะอ่าน/เขียนได้' ไม่ได้รับประกันจำนวน byte — เช่น `send()` อาจเขียนได้แค่บางส่วน ถ้า fd เป็น blocking มันจะค้างรอจนครบและหยุดทั้ง loop" },
        { q: "ถ้าไม่ดู errno แล้วแยก EAGAIN กับ error จริงยังไง",
          a: "ไม่ต้องแยก — เพราะเราแตะ fd เฉพาะตอน poll บอกว่าพร้อมเท่านั้น ค่าลบจึงถือเป็นความล้มเหลวจริงและตัด connection ทิ้งได้เลย ส่วน `recv` คืน 0 แปลว่าปลายทางปิด" },
        { q: "`accept()` ทำไมต้องวนลูป",
          a: "poll หนึ่ง event อาจหมายถึงหลาย connection ที่รออยู่ใน backlog ถ้า accept แค่ครั้งเดียวต่อ tick connection ที่เหลือจะค้างจนกว่าจะมี event ใหม่" },
        { q: "อธิบายการ un-chunk",
          a: "อ่านบรรทัดขนาดเป็นเลขฐาน 16 → อ่านข้อมูลเท่านั้น → อ่าน CRLF ปิดท้าย → วนใหม่ จนเจอ chunk ขนาด 0 ทุกสถานะต้อง resumable เพราะ byte มาไม่ครบก้อน และต้อง un-chunk ใน parser เพื่อให้ handler กับ CGI เห็นแต่ body ธรรมดา" },
        { q: "ทำไม parser ต้องหยุดตรงที่ header จบ",
          a: "เพราะ `client_max_body_size` ขึ้นกับ location ที่ตรงกัน ซึ่งรู้ได้หลัง parse path เสร็จ — ถ้าไม่หยุดจะอ่าน body เกินลิมิตไปแล้วก่อนที่จะรู้ว่าลิมิตคือเท่าไร" },
        { q: "จัดการ POST 100 MB ยังไงไม่ให้ RAM ระเบิด",
          a: "เก็บใน memory เฉพาะเมื่อเล็กกว่า `client_body_buffer_size` เกินกว่านั้น spool ลงไฟล์ชั่วคราว (ไฟล์ปกติได้รับการยกเว้นจากกฎ poll) แล้วให้ CGI หรือ upload อ่านจากไฟล์ทีละก้อน — วัดได้จริงว่า 2020 MB เหลือ 22 MB" },
        { q: "back-pressure คืออะไร ทำไมต้องมี",
          a: "เมื่อ client ระบายช้ากว่า CGI ผลิต ให้เอาปลายอ่านของ CGI ออกจาก poll set ชั่วคราว pipe จะเต็มและลูกจะ block เอง หน่วยความจำจึงหยุดโต" },
        { q: "CGI timeout ควรวัดอะไร",
          a: "วัด **ความเงียบ** ไม่ใช่เวลารวม เพราะ upload ใหญ่ที่กำลังไหลอยู่คืองานปกติ และต้องหยุดนับระหว่างที่เราเองหยุดอ่านลูกเพราะ back-pressure ไม่งั้นจะฆ่า CGI ที่สุขภาพดี" },
        { q: "ทำไมต้องปิด pipe ฝั่ง stdin ของ CGI",
          a: "EOF บน stdin คือสัญญาณเดียวที่บอกลูกว่า body หมดแล้ว ถ้าไม่ปิด ลูกจะรออ่านต่อไปเรื่อย ๆ และไม่มีวันตอบ" },
        { q: "CGI ตอบมาแล้วรู้ได้ยังไงว่า status เท่าไร",
          a: "อ่านบล็อก header ของ CGI จนถึงบรรทัดว่าง: `Status:` เปลี่ยน code, `Location:` เดี่ยว ๆ แปลว่า 302, ถ้าไม่มีบล็อก header เลยตอบ 502" },
        { q: "virtual host ทำงานยังไง",
          a: "หลาย server block บน host:port เดียวกันใช้ listener ตัวเดียว แล้วเลือก block จาก header `Host:` ถ้าไม่ตรงชื่อไหนเลยใช้ block แรกของคู่นั้นเป็น default" },
        { q: "เลือก location ยังไงเมื่อมีหลายอันตรงกัน",
          a: "exact ก่อน แล้ว extension แล้วค่อย longest prefix — และต้องกันไม่ให้ `/foo` แมตช์ `/foobar` โดยเช็กว่าอักขระถัดจาก prefix เป็น `/`" },
        { q: "`root` ของ prefix location กับของ extension location ต่างกันยังไง",
          a: "prefix location **แทนที่** ส่วน prefix (`/kapouet` + root `/tmp/www` → `/tmp/www/pouic/toto/pouet`) ส่วน extension location เก็บ URI ทั้งเส้นไว้ใต้ root — สับสนสองอันนี้คือสาเหตุยอดฮิตของ CGI 404" },
        { q: "ทำไม `HEAD /` ถึงต้อง 405 บน route ที่เป็น GET only",
          a: "เพราะสิทธิ์ method ตรวจตามรายการที่เขียนไว้จริง HEAD ไม่ได้ขี่สิทธิ์ของ GET อัตโนมัติ ถ้าอยากรับ HEAD ต้องใส่ลงใน `allow_methods` เอง" },
        { q: "ไดเรกทอรีที่ไม่มี index ตอน autoindex off ควรตอบอะไร",
          a: "404 ตามที่ tester คาด (ไม่ใช่ 403 อย่างที่ NGINX ตอบ)" },
        { q: "ป้องกัน path traversal ยังไง",
          a: "normalize URI ก่อนแตะ filesystem: percent-decode แล้วยุบ `.` และ `..` โดยทิ้ง `..` ที่จะพาออกนอก root — ห้าม concat path ดิบ ๆ เข้ากับ root" },
        { q: "ทำไมต้อง `SO_REUSEADDR` และ `signal(SIGPIPE, SIG_IGN)`",
          a: "อันแรกทำให้รีสตาร์ตระหว่าง TIME_WAIT แล้ว bind ติด อันหลังกันไม่ให้การเขียนลง socket ที่ปลายทางเพิ่งหายไปฆ่าโปรเซสทั้งตัว" },
        { q: "`fork()` มีกี่ที่ในโปรเจกต์",
          a: "หนึ่งที่ อยู่ใน `CgiProcess::start()` เท่านั้น — เป็นข้อบังคับของ subject และ grep พิสูจน์ได้" },
        { q: "จัดการ keep-alive ยังไง",
          a: "หลังระบาย response หมด ถ้า `Connection` ไม่ใช่ `close` ให้รีเซ็ต parser และเก็บ byte ที่อ่านเกินมาไว้เป็นจุดเริ่มของ request ถัดไป ไม่ใช่ทิ้ง" }
      ]},
      { h: "เช็กลิสต์ก่อนขึ้น defense" },
      { ul: [
        "`grep` แล้วเจอ `poll(` แค่ที่เดียว, ไม่เจอ `errno`/`EAGAIN` เลย, เจอ `fork(` แค่ในไฟล์ CGI",
        "`./tester` ผ่านครบทุกเฟส (รันจาก ext4 ไม่ใช่ /mnt)",
        "เปิดเบราว์เซอร์ดูได้จริง: หน้าเว็บ, autoindex, upload, DELETE, redirect, error page ที่ตั้งเอง",
        "หลายพอร์ตพร้อมกัน + virtual host แยกกันด้วย `Host:`",
        "CGI อย่างน้อย 1 ชนิด (php-cgi หรือ python) และเคส `.bla` ที่ไฟล์ไม่มีอยู่จริง",
        "`siege` / `ab` แล้ว availability สูง และ **RAM ไม่โต** ระหว่างยิงยาว",
        "ตัด client กลางคัน / ปิดเบราว์เซอร์ระหว่าง upload แล้ว server ไม่ตายและไม่ทิ้งไฟล์ค้าง",
        "valgrind ไม่พบ leak หลังปิดด้วย SIGINT"
      ]},
      { links: [
        { label: "RFC 7230 — HTTP/1.1 Message Syntax and Routing", url: "https://datatracker.ietf.org/doc/html/rfc7230", note: "framing, chunked, Host, keep-alive — ตัวจริงที่ควรเปิดค้างไว้" },
        { label: "RFC 7231 — HTTP/1.1 Semantics and Content", url: "https://datatracker.ietf.org/doc/html/rfc7231", note: "ความหมายของ method และ status code" },
        { label: "RFC 3875 — The Common Gateway Interface (CGI) Version 1.1", url: "https://datatracker.ietf.org/doc/html/rfc3875", note: "รายการ environment variable และรูปแบบ output ของ CGI" },
        { label: "NGINX docs — ngx_http_core_module", url: "https://nginx.org/en/docs/http/ngx_http_core_module.html", note: "ความหมายของ location, root, index, client_max_body_size ที่เราลอกมา" },
        { label: "Beej's Guide to Network Programming", url: "https://beej.us/guide/bgnet/", note: "socket, bind, listen, accept, poll แบบปูพื้น" }
      ]}
    ]
  }
});

Object.assign(window.TEACHING_EN, {
  webserv: {
    principle: [
      { h: "What the project asks for" },
      { p: "Write **a web server that really speaks HTTP/1.1** in C++98 and open it in a browser: `./webserv [config]`. It must serve static files, accept uploads, delete files with DELETE, do redirections, autoindex, listen on several ports, host virtual hosts, and run **CGI** by file extension." },
      { p: "**No norminette** — this is a C++ project built with `-Wall -Wextra -Werror -std=c++98`. What is graded instead is a short list of **four structural rules, each of which scores zero when broken**." },
      { h: "The four rules that score zero" },
      { table: { head: ["Rule", "How to satisfy it, concretely"], rows: [
        ["**One `poll()`** for all I/O, listeners included", "`Server::run()` owns the only one; nothing else in the tree calls `poll/select/epoll`"],
        ["**Never read/write without readiness**", "Every `recv/send/read/write` on a socket or pipe sits in a handler reached from that poll dispatch (**regular disk files are exempt** — plain `open/read` is fine and expected)"],
        ["**`errno` must not be consulted after read/write**", "A return-value-only policy (below)"],
        ["**`fork()` only for CGI**", "Exactly one `fork()` in the tree, inside the CGI file"]
      ]}},
      { p: "Do not leave these aspirational — make them **mechanically checkable** and put the check in your test suite" },
      { code: String.raw`SYSCALL='(^|[^._>:a-zA-Z])'          # skip c.send(, p->send(, Class::send
grep -rnE "$SYSCALL"'poll[[:space:]]*\(' src inc | grep -vE ':[[:space:]]*(//|\*|/\*)'
grep -rnE '\berrno\b|EAGAIN|EWOULDBLOCK' src inc     # must be empty`,
        cap: "The comment filter matters: a header saying 'the single poll()' inflates the count and fails your own gate", lang: "bash" },
      { h: "The errno policy, stated once" },
      { code: String.raw`recv/read == 0   -> peer closed        -> drop the connection
recv/read <  0   -> descriptor is dead -> drop the connection
send/write < 0   -> peer is gone       -> drop the connection`,
        cap: "poll() already said the fd was ready, so a negative return is a real failure, not an EAGAIN you must distinguish", lang: "txt" },
      { note: "Write that reasoning as a comment next to the call — **evaluators ask this one**: 'without errno, how do you tell them apart?'" },
      { h: "Why the project is hard" },
      { ul: [
        "**It is not an algorithms problem, it is a state-machine problem** — everything must pause mid-way and resume, because bytes arrive a few at a time",
        "**Getting one fd's events wrong stalls the server or spins it at 100% CPU**, and it is painful to diagnose",
        "**CGI is a second process** you must talk to over two pipes without ever blocking the main loop",
        "**The subject's tester throws 100 MB bodies and 20 workers × 5000 GETs** — 'it works' and 'it survives the tester' are different programs"
      ]},
      { h: "What you hand in" },
      { table: { head: ["File", "Role"], rows: [
        ["`Makefile`", "`all clean fclean re`, and no unnecessary relinking"],
        ["`src/` `inc/`", "All the C++98 code"],
        ["`config/*.conf`", "At least one config that demos every feature"],
        ["`www/`", "The document root for the demo"]
      ]}}
    ],
    theory: [
      { p: "The protocol you need before the first line of code — HTTP is not hard, but it is detailed, and the tester checks details." },
      { h: "1) What an HTTP request looks like" },
      { code: String.raw`POST /upload/file.txt HTTP/1.1\r\n      <- request line: method SP target SP version
Host: localhost:8080\r\n                <- header
Content-Type: text/plain\r\n
Content-Length: 11\r\n
\r\n                                    <- blank line ends the headers
hello world                             <- body, Content-Length bytes long`,
        cap: "The separator is always CRLF, and the header block ends with one empty CRLF line", lang: "http" },
      { h: "2) What a response looks like" },
      { code: String.raw`HTTP/1.1 200 OK\r\n                     <- status line
Content-Type: text/html\r\n
Content-Length: 152\r\n
Date: Sat, 09 Aug 2025 12:00:00 GMT\r\n
Connection: keep-alive\r\n
\r\n
<html>...</html>`,
        cap: "The client must learn the body length — from Content-Length, from chunking, or from the connection closing", lang: "http" },
      { h: "3) Three ways to frame a body" },
      { table: { head: ["Method", "Used when", "Note"], rows: [
        ["`Content-Length: n`", "The size is known upfront", "Simplest and best"],
        ["`Transfer-Encoding: chunked`", "The size is unknown (a CGI still producing output)", "Sent in pieces, each preceded by a hex size"],
        ["Closing the connection", "Neither of the above", "Requires `Connection: close`; keep-alive is impossible"]
      ]}},
      { code: String.raw`Transfer-Encoding: chunked

7\r\n          <- size in hexadecimal
Mozilla\r\n
9\r\n
Developer\r\n
0\r\n          <- a zero-sized chunk ends it
\r\n`, cap: "Same format in both directions — the subject requires your server to un-chunk incoming bodies", lang: "http" },
      { note: "**Content-Length together with Transfer-Encoding is a 400**, and so is a duplicated Content-Length. Both are request-smuggling vectors that evaluators try." },
      { h: "4) keep-alive and pipelining" },
      { p: "HTTP/1.1 is **persistent by default** — after a response you keep the socket and wait for the next request on it. Reset the parser state cleanly every time, and **never throw away bytes you over-read**: they are the beginning of the next request." },
      { h: "5) The Host header and virtual hosts" },
      { p: "Several `server` blocks on one `host:port` pair are **name-based virtual hosts**, selected by the `Host:` header. If no name matches, the **first** block for that pair is the default." },
      { ul: [
        "HTTP/1.1 with **no `Host:` is a 400** (required by RFC 7230)",
        "HTTP/1.0 without one is perfectly fine"
      ]},
      { h: "6) The status codes you actually need" },
      { table: { head: ["Code", "When"], rows: [
        ["200 / 201 / 204", "Success / created (upload) / success with no body (DELETE)"],
        ["301 / 302", "Permanent / temporary redirect (`return 301 https://...;`)"],
        ["400", "Malformed request, no Host on 1.1, contradictory framing"],
        ["403", "No permission to read the file"],
        ["404", "Not found **and** a directory with no index when autoindex is off"],
        ["405", "Method not in that location's `allow_methods` (needs an `Allow:` header)"],
        ["408 / 504", "The client went quiet too long / the CGI went quiet too long"],
        ["413", "Body exceeds `client_max_body_size`"],
        ["500 / 502", "The server itself failed / the CGI answered with nothing CGI-shaped"],
        ["501", "A method you do not implement at all"]
      ]}},
      { h: "7) What CGI actually is (RFC 3875)" },
      { p: "CGI is the contract for **how a web server talks to an external program**: the server `fork`s and `execve`s it, passes metadata as **environment variables**, the body on **stdin**, and reads the result from **stdout**." },
      { code: String.raw`REQUEST_METHOD=POST          SCRIPT_FILENAME=/abs/path/script.php
QUERY_STRING=a=1&b=2         PATH_INFO=/extra/path
CONTENT_LENGTH=11            SERVER_PROTOCOL=HTTP/1.1
CONTENT_TYPE=text/plain      SERVER_NAME / SERVER_PORT / REMOTE_ADDR
REDIRECT_STATUS=200          HTTP_<HEADER> for every request header`,
        cap: "REDIRECT_STATUS=200 is not optional — without it php-cgi refuses to run at all", lang: "txt" },
      { p: "**A CGI's output starts with its own headers**, then a blank line, then the body: `Status: 418 ...` overrides the code, a bare `Location:` means 302, and no header block at all is a **502**." },
      { h: "8) Why poll(), and why non-blocking" },
      { p: "The server watches hundreds of descriptors from **one thread**. `poll()` is 'tell me which ones are ready' so you only touch those — no thread per client, no busy-waiting." },
      { table: { head: ["", "`select()`", "`poll()`"], rows: [
        ["fd limit", "`FD_SETSIZE`, usually 1024", "No fixed ceiling"],
        ["Rebuild the set each round", "Yes, it is overwritten", "Yes, but as an array that is easier to manage"],
        ["Event granularity", "read/write/except", "`POLLIN/POLLOUT/POLLHUP/POLLERR/POLLNVAL`"]
      ]}},
      { p: "**Non-blocking is required because poll only says 'probably ready'**, not 'ready for exactly n bytes'. One accidental block in `send()` freezes the whole server." }
    ],
    foundations: [
      { p: "The descriptor- and buffer-level machinery that decides whether the server is calm or broken." },
      { h: "Which events each kind of fd should ask for" },
      { table: { head: ["fd", "POLLIN", "POLLOUT"], rows: [
        ["listener", "**always**", "never"],
        ["client", "while reading the request", "while the out-buffer is non-empty"],
        ["cgi stdin (write end)", "never", "while body remains"],
        ["cgi stdout (read end)", "until EOF", "never"]
      ]}},
      { note: "**Leaving POLLOUT armed is 100% CPU** — the socket is always writable, so poll returns instantly every round. Ask for it only while bytes are actually queued; this is one of the most common bugs in the project." },
      { h: "Rebuild the pollfd set each tick; never keep indices" },
      { p: "**Rebuild the `pollfd` vector every tick** from the live fd registries. It costs O(fds) against a syscall that costs more, and it deletes the whole class of bugs where closing an fd during dispatch invalidates a stored index." },
      { code: String.raw`// wrong: an index kept across the tick while a middle client is erased
for (size_t i = 0; i < _pfds.size(); ++i) { ... _pfds.erase(_pfds.begin()+i); ... }

// right: rebuild from present truth
_pfds.clear();
for (it = _listeners.begin(); it != _listeners.end(); ++it) push(it->fd, POLLIN);
for (it = _conns.begin();     it != _conns.end();     ++it) push(it->fd, it->wantEvents());`,
        cap: "The registry is the source of truth, not the poll array", lang: "cpp" },
      { h: "Per-connection buffers: reading and writing stay separate" },
      { code: String.raw`struct Connection {
    int          fd;
    std::string  _inBuf;    // raw bytes not yet parsed
    size_t       _pos;      // how far into _inBuf we have consumed
    std::string  _outBuf;   // bytes waiting to go out
    HttpRequest  _req;      // the state machine eating from _inBuf
    time_t       _lastIo;   // for timeout decisions
};`, cap: "Reads accumulate into _inBuf, writes drain _outBuf — nothing anywhere blocks", lang: "cpp" },
      { p: "**Compact the buffer as it is consumed** (`_buf.erase(0, _pos)`) or a long-lived connection grows forever holding bytes it already used." },
      { h: "The request state machine must pause at 'headers done'" },
      { p: "The body limit depends on `client_max_body_size` of the **matched location**, which is only known once the path is parsed. So the parser needs a state meaning *headers complete, waiting for the caller's limit*." },
      { code: String.raw`ST_REQUEST_LINE -> ST_HEADERS -> ST_HEADERS_DONE
                                     |  caller resolves vhost + location,
                                     |  then applyBodyLimit(n)
                                     v
                    ST_BODY_LENGTH | ST_BODY_CHUNK_* -> ST_DONE`,
        cap: "Every state must be resumable — the tests really do deliver one byte at a time", lang: "txt" },
      { p: "**De-chunk in the parser**, not in the handler, so the handler and the CGI only ever see a plain body. That is what the subject means by 'your server needs to un-chunk them'." },
      { h: "Memory: never hold a large body in RAM" },
      { p: "Buffering bodies is what makes the tester's final phase (twenty concurrent 100 MB POSTs) OOM-kill a server. Measured on the same code and the same test: **2020 MB peak buffering, 22 MB peak spooling**." },
      { code: String.raw`body <= client_body_buffer_size (1 MiB is a good default) -> keep in std::string
body >  client_body_buffer_size  -> open a file under client_body_temp_path
                                    and write every further byte there
   (de-chunk on the way in, so the spool holds the decoded body)`,
        cap: "Regular files are exempt from the poll() rule, so plain open/read/write on the spool is correct", lang: "txt" },
      { table: { head: ["Consumer", "With a spooled body"], rows: [
        ["CGI", "Read the file a chunk at a time and write those chunks into the child's stdin"],
        ["Raw upload", "Copy file → file in chunks; it never enters memory"],
        ["Multipart upload", "Must be read back whole (boundaries are not parseable piecewise), bounded by `client_max_body_size`"],
        ["Plain POST", "Only the byte count is needed"]
      ]}},
      { note: "**Make ownership explicit or you will strand files.** The request removes its spool on reset, on drop-body and in its destructor — *unless* it handed the file to the CGI, which then removes it when the child's stdin closes." },
      { h: "What every socket needs" },
      { ul: [
        "`SO_REUSEADDR` **before** `bind`, or a restart inside TIME_WAIT fails",
        "`O_NONBLOCK` on the listener **and on the accepted socket**",
        "`accept()` in a loop until it returns negative — one poll event can mean several pending connections",
        "`signal(SIGPIPE, SIG_IGN)` in `main`, or the first vanished peer kills the process",
        "`fcntl` is allowed only with `F_SETFL`, `O_NONBLOCK`, `FD_CLOEXEC`"
      ]}
    ],
    architecture: [
      { p: "How to split the files and the responsibilities — this layout survives the subject's own tester." },
      { h: "File layout" },
      { code: String.raw`inc/                          src/
  Webserv.hpp                   main.cpp
  ConfigTypes.hpp               config/ConfigParser.cpp   ConfigTypes.cpp
  ConfigParser.hpp              core/   Server.cpp  Listener.cpp  Connection.cpp
  Server.hpp Listener.hpp       http/   HttpRequest.cpp   HttpResponse.cpp
  Connection.hpp                        RequestHandler.cpp  Mime.cpp
  HttpRequest.hpp               cgi/    CgiProcess.cpp  Session.cpp
  HttpResponse.hpp              utils/  Utils.cpp
  RequestHandler.hpp
  CgiProcess.hpp Session.hpp    config/default.conf  config/tester.conf
  Mime.hpp Utils.hpp            www/  YoupiBanane/`,
        cap: "Layered: config → core (the event loop) → http (the protocol) → cgi", lang: "txt" },
      { h: "Responsibilities per class" },
      { table: { head: ["Class", "Owns", "Must not"], rows: [
        ["`ConfigParser`", "Reading .conf into a `Config` structure", "Touch sockets"],
        ["`Listener`", "socket/bind/listen for one host:port pair", "Handle requests"],
        ["`Server`", "**The one `poll()`** plus the fd registries", "Parse HTTP"],
        ["`Connection`", "One client's in/out buffers and keep-alive state", "Call poll itself"],
        ["`HttpRequest`", "The state machine turning bytes into a request (including de-chunking)", "Touch files"],
        ["`RequestHandler`", "Deciding what this request gets (file / CGI / redirect / error)", "Touch poll"],
        ["`CgiProcess`", "fork+execve, two pipes, timeouts, parsing the CGI's headers", "Touch the client directly"],
        ["`HttpResponse`", "Assembling status line, headers and body", "Make policy decisions"]
      ]}},
      { h: "The top-level flow" },
      { code: String.raw`main -> ConfigParser::parseFile -> Config
     -> Server::setup   one Listener per unique host:port
     |                  (several server blocks on one pair = virtual hosts)
     -> Server::run     poll()
          listener readable  -> accept() until it returns < 0
          client readable    -> HttpRequest::feed (resumable state machine)
          request complete   -> RequestHandler::handle
                                  -> a response, or CgiParams -> fork
          cgi stdin writable -> push body into the child
          cgi stdout readable-> collect output; EOF -> build the response
          client writable    -> drain; keep-alive resets, else close`,
        cap: "Every arrow is a callback from one dispatch — there is no I/O off this path", lang: "txt" },
      { h: "The NGINX-style config worth copying" },
      { code: String.raw`server {
    listen 127.0.0.1:8080;
    server_name localhost webserv.local;
    root ./www/html;
    index index.html;
    autoindex off;
    client_max_body_size 5m;
    error_page 404 /errors/404.html;
    error_page 500 502 503 504 /errors/50x.html;

    location / {
        allow_methods GET HEAD;
    }
    location /uploads {
        root ./www/uploads;
        allow_methods GET HEAD DELETE;
        autoindex on;
    }
    location /upload {
        allow_methods POST;
        upload_store ./www/uploads;
    }
    location *.php {
        root ./www;
        cgi_pass /usr/bin/php-cgi;
    }
    location /old {
        return 301 /new;
    }
}`, cap: "One server block is one virtual host; a location is a rule for a path or an extension", lang: "nginx" },
      { h: "Location matching — nginx-like and regex-free" },
      { table: { head: ["Order", "Kind", "Example"], rows: [
        ["1", "**exact**", "`location = /health`"],
        ["2", "**extension**", "`location *.bla`"],
        ["3", "**longest prefix**", "`location /uploads`"]
      ]}},
      { code: String.raw`// stop /foo from matching /foobar
if (loc.path.size() > 1 && uri.size() > loc.path.size()
    && uri[loc.path.size()] != '/') continue;`,
        cap: "Without this line, /uploads swallows /uploadsomething", lang: "cpp" },
      { note: "**A prefix location with its own `root` replaces the prefix** (`/kapouet` + `root /tmp/www` → `/tmp/www/pouic/toto/pouet`), while **an extension location keeps the whole URI under its root** — so `location *.sh { root ./www; }` serves `/cgi-bin/info.sh` from `./www/cgi-bin/info.sh`. Mixing these up is the usual cause of 'my CGI is 404'." },
      { h: "Values that must be directives, not constants" },
      { p: "`client_timeout` and `cgi_timeout` have to come from the config: the test suite needs 2-3 second deadlines while the demo needs 60. Hard-code them and you cannot test them at all." }
    ],
    dataflow: [
      { p: "One request from the first byte to the last, then the CGI path." },
      { h: "One tick of the event loop" },
      { code: String.raw`1. rebuild the pollfd set from the registries (listeners + clients + cgi pipes)
2. poll(&pfds[0], n, timeout_ms)
3. walk every fd with revents:
      listener POLLIN      -> accept in a loop, set O_NONBLOCK, register
      POLLHUP/ERR/NVAL     -> drop it
      client POLLIN        -> recv -> _inBuf -> req.feed()
      client POLLOUT       -> send -> erase exactly the bytes sent
      cgi out POLLIN       -> read -> CGI headers/body
      cgi in  POLLOUT      -> write body to the child; when done -> close (EOF)
4. sweep timeouts (silent client / silent CGI) with waitpid(WNOHANG)
5. reap connections that are closed and fully drained`,
        cap: "One round = read state, act on what is ready, clean up", lang: "txt" },
      { h: "The static GET path" },
      { code: String.raw`recv 74 bytes  "GET /index.html HTTP/1.1\r\nHost: localhost\r\n\r\n"
 -> HttpRequest::feed  ST_REQUEST_LINE -> ST_HEADERS -> ST_HEADERS_DONE
 -> Server picks the vhost from Host: -> picks the location for /index.html
 -> applyBodyLimit(5m)  -> no body -> ST_DONE
 -> RequestHandler::handle
      is the method in allow_methods? no -> 405 with Allow:
      normalise the URI (percent-decode, resolve . and ..)
      map -> ./www/html/index.html
      stat: a regular file -> open/read (files need no poll)
      guess Content-Type from the extension (Mime)
 -> HttpResponse -> append to _outBuf -> ask for POLLOUT
 -> client POLLOUT -> send -> fully drained
 -> Connection: keep-alive? reset the parser for the next request : close`,
        cap: "Note the disk file is read directly — that is correct and explicitly exempted", lang: "txt" },
      { h: "The directory path" },
      { table: { head: ["Situation", "Result"], rows: [
        ["An `index` file exists as configured", "Serve that file"],
        ["No index but `autoindex on`", "Generate an HTML listing"],
        ["No index and `autoindex off`", "**404** (not NGINX's 403 — the tester checks this)"],
        ["The URI is a directory but has no trailing `/`", "301 to the URI plus `/`"]
      ]}},
      { h: "The CGI path, the hardest part" },
      { code: String.raw`RequestHandler decides this is CGI (the extension matches a location)
 -> create two pipes: in[2] (server->child), out[2] (child->server)
 -> set O_NONBLOCK on both ends the server keeps
 -> fork()
      child:  dup2(in[0], STDIN);  dup2(out[1], STDOUT)
              close every unused descriptor
              chdir(the script's directory)        <- required by the subject
              execve(interpreter, argv, envp)
      parent: close in[0], out[1]; register in[1] (POLLOUT) and out[0] (POLLIN)
 -> POLLOUT on in[1]: write the body in chunks
        all written -> close(in[1])   <- that EOF is the child's only end-of-body signal
 -> POLLIN on out[0]: read -> accumulate ONLY the header block, up to the blank line
        headers done -> decide status/framing -> stream the rest straight to _outBuf
 -> EOF on out[0] -> waitpid(WNOHANG) -> reap`,
        cap: "Both pipes live in the same poll as the clients — nothing blocks anywhere", lang: "txt" },
      { h: "Deciding the response framing from a CGI" },
      { table: { head: ["What the CGI gave", "What the server does"], rows: [
        ["`Content-Length` present", "Pass the body through"],
        ["No length, keep-alive", "Re-frame as `Transfer-Encoding: chunked`"],
        ["No length, no keep-alive", "Close-delimited plus `Connection: close`"],
        ["`Status: 418 ...`", "Use that code instead of 200"],
        ["A bare `Location:`", "302"],
        ["No header block at all", "**502**"]
      ]}},
      { note: "**Stream it, do not buffer it.** A buffering server keeps three copies of the body (the CGI accumulator, the response body, the assembled bytes) — that is the difference between surviving twenty concurrent 100 MB CGI POSTs and being OOM-killed." },
      { h: "Back-pressure — braking when the client is slower than the CGI" },
      { p: "While more than ~256 KB is still queued in that client's `_outBuf`, **leave the CGI's read end out of the poll set**. The pipe fills, the child blocks by itself, memory stops growing, and you re-arm it once the queue drains." },
      { h: "The CGI timeout measures silence — and pauses during back-pressure" },
      { ul: [
        "**Bug one:** a total-runtime budget turns a legitimate 100 MB upload streaming through the child into a 504. Stamp activity on every successful pipe read/write and measure how long it has been quiet instead.",
        "**Bug two:** once back-pressure exists the child produces no I/O *because you stopped reading it*, and an inactivity deadline then kills a healthy CGI, which the client sees as an unexplained EOF mid-body. Enforce the deadline only while the connection is actually willing to read."
      ]},
      { p: "And remember that **once the response head is on the wire the status cannot be taken back** — a late CGI timeout can only cut the connection, never answer 504." }
    ],
    implementation: [
      { p: "Skeletons you can build on directly — plain C++98, no auto, no lambdas." },
      { h: "1) A correct event loop" },
      { code: String.raw`void Server::run() {
    while (_running) {
        buildPollSet();                         // rebuilt every round
        int n = poll(&_pfds[0], _pfds.size(), POLL_TIMEOUT_MS);
        if (n < 0) {                            // EINTR arrives here too; not fatal
            if (!_running) break;
            continue;
        }
        for (size_t i = 0; i < _pfds.size(); ++i) {
            short re = _pfds[i].revents;
            if (!re) continue;
            int fd = _pfds[i].fd;
            if (re & (POLLHUP | POLLERR | POLLNVAL)) { dropFd(fd); continue; }
            if (re & POLLIN)  onReadable(fd);
            if (re & POLLOUT) onWritable(fd);
        }
        sweepTimeouts();
        sweepClosed();
    }
}`, cap: "One loop, decisions taken only from revents, nothing guessed", lang: "cpp" },
      { h: "2) Accept everything one event means" },
      { code: String.raw`void Server::onListenerReadable(int lfd) {
    for (;;) {
        int cfd = accept(lfd, NULL, NULL);
        if (cfd < 0) break;                 // nothing left pending (no errno allowed)
        fcntl(cfd, F_SETFL, O_NONBLOCK);
        _conns.insert(std::make_pair(cfd, new Connection(cfd, lfd)));
    }
}`, cap: "One poll event can mean several connections — without the loop they stall", lang: "cpp" },
      { h: "3) Read and feed the parser" },
      { code: String.raw`void Connection::onReadable() {
    char buf[16 * 1024];
    ssize_t n = recv(_fd, buf, sizeof(buf), 0);
    if (n <= 0) { _dead = true; return; }        // 0 = closed, <0 = dead
    _lastIo = std::time(NULL);
    _req.feed(buf, static_cast<size_t>(n));

    if (_req.state() == HttpRequest::ST_HEADERS_DONE) {
        const Server_& vh  = _cfg.pickVirtualHost(_listenerId, _req.header("host"));
        const Location& lo = vh.pickLocation(_req.target());
        _req.applyBodyLimit(lo.clientMaxBodySize);   // unblocks body reading
    }
    if (_req.state() == HttpRequest::ST_DONE) handleRequest();
}`, cap: "The pause at HEADERS_DONE is what lets you know the limit before reading the body", lang: "cpp" },
      { h: "4) De-chunking that is genuinely resumable" },
      { code: String.raw`// three phases: read the size line, read the data, read the closing CRLF
bool HttpRequest::feedChunked(const char* p, size_t n, size_t& used) {
    while (used < n) {
        if (_st == ST_BODY_CHUNK_SIZE) {
            if (!takeLine(p, n, used, _line)) return true;   // line incomplete, wait
            _chunkLeft = hexToSize(_line);
            if (_chunkLeft == 0) { _st = ST_BODY_CHUNK_TRAILER; continue; }
            _st = ST_BODY_CHUNK_DATA;
        } else if (_st == ST_BODY_CHUNK_DATA) {
            size_t take = std::min(_chunkLeft, n - used);
            appendBody(p + used, take);        // to the string or to the spool file
            used += take; _chunkLeft -= take;
            if (_chunkLeft == 0) _st = ST_BODY_CHUNK_CRLF;
        } else if (_st == ST_BODY_CHUNK_CRLF) {
            if (!takeCrlf(p, n, used)) return true;
            _st = ST_BODY_CHUNK_SIZE;
        } else break;
    }
    return true;
}`, cap: "Every 'return true' means 'not enough yet, come back next round' — nothing blocks", lang: "cpp" },
      { h: "5) Forking the CGI without blocking" },
      { code: String.raw`bool CgiProcess::start(const CgiParams& prm) {
    int in[2], out[2];
    if (pipe(in) < 0) return false;
    if (pipe(out) < 0) { close(in[0]); close(in[1]); return false; }

    _pid = fork();
    if (_pid == 0) {                                   // child
        dup2(in[0], STDIN_FILENO);
        dup2(out[1], STDOUT_FILENO);
        close(in[0]); close(in[1]); close(out[0]); close(out[1]);
        chdir(prm.scriptDir.c_str());                  // required by the subject
        execve(_exe.c_str(), _argv, _envp);
        std::exit(1);                                  // execve returning = failure
    }
    close(in[0]); close(out[1]);
    _inFd = in[1]; _outFd = out[0];
    fcntl(_inFd, F_SETFL, O_NONBLOCK);
    fcntl(_outFd, F_SETFL, O_NONBLOCK);
    _lastIo = std::time(NULL);
    return true;
}`, cap: "The only fork in the whole project, and it lives in this one file", lang: "cpp" },
      { h: "6) A relative interpreter after chdir" },
      { p: "`chdir` breaks `./cgi_tester`, and **`getcwd()` is not in the allowed function list**. Invert the relative directory yourself instead." },
      { code: String.raw`// "./YoupiBanane" is one level deep -> "../";  "./www/cgi" -> "../../"
static std::string relativeBackPath(const std::string& dir);  // "" if absolute or has ".."
exe = (interp[0] == '/') ? interp : relativeBackPath(dir) + interp;`,
        cap: "Also set SCRIPT_FILENAME / PATH_TRANSLATED to the basename after the chdir, or php-cgi cannot open the script", lang: "cpp" },
      { h: "7) Parsing the CGI's own headers" },
      { code: String.raw`size_t sep = _cgiHead.find("\r\n\r\n");
if (sep == std::string::npos) sep = _cgiHead.find("\n\n");
if (sep == std::string::npos && eofReached) return respondError(502);

int code = 200;
for (each line in the CGI header block) {
    if (name == "status")   code = atoi(value.c_str());
    else if (name == "location" && code == 200) code = 302;
    else if (name == "content-length") hasLength = true;
    else out.addHeader(name, value);
}`, cap: "No header block always means 502 — the tester checks this case", lang: "cpp" },
      { h: "8) Putting error pages in the right place" },
      { code: String.raw`// a location's error_page beats the server's, which beats the generated one
std::string body;
if (!loc.errorPage(code).empty() && readFile(root + loc.errorPage(code), body))
    return send(code, body, "text/html");
return send(code, defaultErrorHtml(code), "text/html");`,
        cap: "A custom error page must be allowed to fail to load without recursing", lang: "cpp" },
      { h: "9) A Makefile that does not relink" },
      { code: String.raw`CXX      = c++
CXXFLAGS = -Wall -Wextra -Werror -std=c++98 -MMD -MP
SRCS     = $(shell find src -name '*.cpp')
OBJS     = $(SRCS:src/%.cpp=obj/%.o)
DEPS     = $(OBJS:.o=.d)

all: webserv
webserv: $(OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $(OBJS)
obj/%.o: src/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -Iinc -c $< -o $@
-include $(DEPS)
clean:  ; rm -rf obj
fclean: clean ; rm -f webserv
re: fclean all
.PHONY: all clean fclean re`,
        cap: "-MMD -MP generate the .d files that tell make which .cpp depends on which header", lang: "make" }
    ],
    tricks: [
      { h: "What the subject's tester expects that you would not guess" },
      { p: "Create this layout exactly before you run it:" },
      { code: String.raw`YoupiBanane/youpi.bad_extension          config: "/" answers GET ONLY
YoupiBanane/youpi.bla                            *.bla answers POST via ./cgi_tester
YoupiBanane/nop/youpi.bad_extension              /post_body answers POST, maxBody 100
YoupiBanane/nop/other.pouic                      /directory/ rooted on YoupiBanane,
YoupiBanane/Yeah/not_happy.bad_extension         index youpi.bad_extension`,
        cap: "One missing file fails the test with nothing wrong in your code", lang: "txt" },
      { table: { head: ["What it expects", "Why you would not guess it"], rows: [
        ["`HEAD /` must be **405**", "A route documented as 'GET only' must not let HEAD ride on the GET permission — HEAD needs its own `allow_methods` entry"],
        ["A directory with no index and autoindex off must be **404**", "NGINX would return 403; here it must be 404 (`/directory/Yeah`)"],
        ["`POST /directory/youpla.bla` on a file that **does not exist** must still reach the CGI", "`cgi_tester` is a gateway, not a script interpreter. Make it a per-route switch (`cgi_require_file on|off`) so real interpreters still 404 on a missing script"],
        ["It POSTs a **100 MB** body to `.bla`", "Your `client_max_body_size` must clear it and your CGI timeout must not fire"]
      ]}},
      { code: String.raw`printf '\n\n\n\n\n\n\n\n\n\n' | ./tester http://localhost:8080`,
        cap: "The tester pauses for Enter several times — run it non-interactively", lang: "bash" },
      { p: "Its last phases are heavy: 20 workers × 5000 GETs, 128 workers × 50 GETs, then 20 workers × five 100 MB POSTs. **Budget about ten minutes.**" },
      { h: "Measure before blaming the server (this matters hugely on WSL)" },
      { p: "A document root under `/mnt/c` or `/mnt/d` costs about 5 ms per file read. **Same binary, same code: 206 req/s serving from drvfs versus 8011 req/s from ext4.**" },
      { ul: [
        "If throughput looks absurd, `cp -r` the project into `~` and measure again",
        "**The tell:** a route that reads no file (`return 200 OK;`) stays fast while a static file is slow — that is the filesystem, not your code",
        "Check RAM too: WSL defaults to a fraction of the host and the final phase needs about 2 GB. An OOM kill shows up as `Killed` in the shell and a bare EOF in the tester — confirm with `dmesg | grep -i oom-kill` before hunting a logic bug"
      ]},
      { h: "Allowed-function traps" },
      { table: { head: ["You want", "Use instead"], rows: [
        ["`inet_ntop` for `REMOTE_ADDR`", "`ntohl(addr.sin_addr.s_addr)` and format the quad by hand"],
        ["`unlink` for DELETE", "`std::remove` from `<cstdio>`"],
        ["`getcwd` for a relative interpreter", "Invert the relative chdir yourself (see Implementation)"],
        ["`gettimeofday`", "`std::time` from `<ctime>`; `std::gmtime` + `std::strftime` for the `Date` header"],
        ["`mkstemp` / `getpid` for temp names", "A counter plus the clock, opened `O_CREAT|O_EXCL` with a retry"]
      ]}},
      { note: "The list also has no `select` (once you chose poll) and no `usleep`. And `fcntl` is allowed only with `F_SETFL`, `O_NONBLOCK`, `FD_CLOEXEC`." },
      { h: "Cheap wins worth having regardless" },
      { ul: [
        "`_inBuf.swap(params.body)` instead of assigning — it skips a whole copy",
        "Release the child's input buffer the moment its pipe is closed",
        "Drop the request body once it has been handed on",
        "Compact the read buffer (`_buf.erase(0, _pos)`) as it is consumed",
        "Build the response head and body into the out-buffer directly rather than serialising a whole response string first"
      ]},
      { h: "Robustness checklist" },
      { ul: [
        "`signal(SIGPIPE, SIG_IGN)` in `main`",
        "`SO_REUSEADDR` before `bind`",
        "`O_NONBLOCK` on the accepted socket too, not just the listener",
        "`accept()` in a loop until it returns negative",
        "**Normalise the URI** (percent-decode, then resolve `.`/`..`, dropping a `..` that would escape the root) **before** touching the filesystem",
        "Refuse `Content-Length` together with `Transfer-Encoding`, and duplicate `Content-Length`, with 400",
        "HTTP/1.1 without a `Host` header is 400; HTTP/1.0 without one is fine"
      ]},
      { h: "Debugging that actually works" },
      { table: { head: ["Symptom", "Look here first"], rows: [
        ["100% CPU with nobody connected", "POLLOUT left armed while the out-buffer is empty"],
        ["The server stalls", "An fd asking for the wrong event (waiting POLLIN on the CGI's stdin)"],
        ["CGI returns 502", "No header block from the CGI / execve failed silently"],
        ["CGI returns 504 while it is working", "The timeout measures total runtime instead of silence"],
        ["Messages truncated under load", "`send()` returned short and you erased too much"],
        ["RAM climbing", "Buffering whole bodies / no back-pressure"],
        ["`Address already in use`", "Missing `SO_REUSEADDR`"]
      ]}}
    ],
    eval: [
      { p: "The questions evaluators really ask, from certain to deep." },
      { qa: [
        { q: "Why exactly one poll()?",
          a: "The server is single-threaded but watches hundreds of descriptors — poll is the one place that says which are ready. Several polls, or I/O off that path, means a block that freezes everything, and the subject scores it zero." },
        { q: "Why non-blocking if poll already said it was ready?",
          a: "poll says 'probably readable/writable', not how many bytes. A `send()` can write only part of the buffer; on a blocking fd it would wait for the rest and stall the whole loop." },
        { q: "Without errno, how do you tell EAGAIN from a real error?",
          a: "You do not have to — you only touch an fd when poll reported it ready, so a negative return is a real failure and the connection is dropped. `recv` returning 0 means the peer closed." },
        { q: "Why must accept() loop?",
          a: "One poll event can represent several connections waiting in the backlog; accepting once per tick leaves the rest stuck until another event arrives." },
        { q: "Explain de-chunking.",
          a: "Read the hex size line, read exactly that many data bytes, read the closing CRLF, repeat until a zero-sized chunk. Every phase must be resumable because chunks arrive split, and it belongs in the parser so the handler and CGI only ever see a plain body." },
        { q: "Why does the parser stop at 'headers done'?",
          a: "Because `client_max_body_size` depends on the matched location, which is only known after the path is parsed — without the pause you would already have read past a limit you had not learned yet." },
        { q: "How do you handle a 100 MB POST without exploding RAM?",
          a: "Keep it in memory only below `client_body_buffer_size`; past that, spool to a temp file (regular files are exempt from the poll rule) and let the CGI or the upload read it back a chunk at a time. Measured: 2020 MB becomes 22 MB." },
        { q: "What is back-pressure and why do you need it?",
          a: "When the client drains slower than the CGI produces, drop the CGI's read end from the poll set; the pipe fills, the child blocks on its own, and memory stops growing." },
        { q: "What should a CGI timeout measure?",
          a: "**Silence**, not total runtime — a large upload streaming through the child is normal work. And it must pause while back-pressure means you stopped reading the child, or it kills a healthy CGI." },
        { q: "Why close the CGI's stdin pipe?",
          a: "That EOF is the only signal the child gets that the body is finished; without it the child keeps waiting to read and never answers." },
        { q: "How do you learn the status code from a CGI?",
          a: "Parse its header block up to the blank line: `Status:` overrides the code, a bare `Location:` means 302, and no header block at all is a 502." },
        { q: "How do virtual hosts work?",
          a: "Several server blocks on one host:port share one listener; the block is chosen by the `Host:` header, and if no name matches, the first block for that pair is the default." },
        { q: "How do you choose between matching locations?",
          a: "Exact first, then extension, then longest prefix — plus a guard that stops `/foo` matching `/foobar` by checking that the character after the prefix is `/`." },
        { q: "How does `root` differ between a prefix and an extension location?",
          a: "A prefix location **replaces** the prefix (`/kapouet` + root `/tmp/www` → `/tmp/www/pouic/toto/pouet`); an extension location keeps the whole URI under its root. Confusing them is the usual cause of a 404 CGI." },
        { q: "Why must `HEAD /` be 405 on a GET-only route?",
          a: "Method permission follows the list you actually wrote; HEAD does not inherit GET's permission. To accept it, put it in `allow_methods`." },
        { q: "What should a directory with no index return when autoindex is off?",
          a: "404, as the tester expects — not the 403 NGINX would return." },
        { q: "How do you prevent path traversal?",
          a: "Normalise the URI before touching the filesystem: percent-decode, then resolve `.` and `..`, dropping any `..` that would escape the root. Never concatenate a raw path onto the root." },
        { q: "Why `SO_REUSEADDR` and `signal(SIGPIPE, SIG_IGN)`?",
          a: "The first lets a restart bind while the old socket is in TIME_WAIT; the second stops a write to a just-vanished peer from killing the whole process." },
        { q: "How many forks are in the project?",
          a: "One, in `CgiProcess::start()` — a subject requirement, and grep proves it." },
        { q: "How is keep-alive handled?",
          a: "After the response drains, if `Connection` is not `close`, reset the parser and keep any over-read bytes as the start of the next request rather than discarding them." }
      ]},
      { h: "Checklist before defense" },
      { ul: [
        "`grep` finds exactly one `poll(`, no `errno`/`EAGAIN` at all, and `fork(` only in the CGI file",
        "`./tester` passes every phase (run from ext4, not /mnt)",
        "It works in a real browser: pages, autoindex, upload, DELETE, redirect, custom error pages",
        "Several ports at once, plus virtual hosts separated by `Host:`",
        "At least one CGI type (php-cgi or python) and the `.bla` case where the file does not exist",
        "`siege` / `ab` show high availability and **flat memory** during a long run",
        "Cutting a client mid-upload leaves the server alive and no stranded temp files",
        "valgrind reports no leaks after a SIGINT shutdown"
      ]},
      { links: [
        { label: "RFC 7230 — HTTP/1.1 Message Syntax and Routing", url: "https://datatracker.ietf.org/doc/html/rfc7230", note: "Framing, chunking, Host, keep-alive — keep this one open" },
        { label: "RFC 7231 — HTTP/1.1 Semantics and Content", url: "https://datatracker.ietf.org/doc/html/rfc7231", note: "What each method and status code means" },
        { label: "RFC 3875 — The Common Gateway Interface (CGI) Version 1.1", url: "https://datatracker.ietf.org/doc/html/rfc3875", note: "The environment variables and the output format" },
        { label: "NGINX docs — ngx_http_core_module", url: "https://nginx.org/en/docs/http/ngx_http_core_module.html", note: "The semantics of location, root, index and client_max_body_size you are copying" },
        { label: "Beej's Guide to Network Programming", url: "https://beej.us/guide/bgnet/", note: "Sockets, bind, listen, accept and poll from the ground up" }
      ]}
    ]
  }
});

/* flow visualizer: GET หนึ่งใบ ตั้งแต่ poll บอกว่าพร้อม จนถึง byte สุดท้ายออกสาย */
window.EXTRA_FLOWS = window.EXTRA_FLOWS || {};
window.EXTRA_FLOWS.webserv = {
  input: "curl -X POST --data-binary @big.txt http://localhost:8080/upload",
  steps: [
    { fn: "Server::run()", file: "src/core/Server.cpp", depth: 0,
      note: { th: "ลูปเดียวของทั้งโปรแกรม: ประกอบ pollfd ใหม่ทุกรอบจาก registry แล้วเรียก `poll()` ตัวเดียวที่มีในโปรเจกต์ — ไม่มี I/O ที่ไหนอยู่นอกเส้นทางนี้",
              en: "The only loop in the program: rebuild the pollfd set from the registries each tick and call the single `poll()` in the project. No I/O exists off this path." },
      data: "pfds = [listener:POLLIN, client7:POLLIN, cgi_out9:POLLIN]",
      vars: [ { n: "_pfds", d: { th: "ประกอบใหม่ทุก tick จึงไม่มี index ค้าง", en: "rebuilt every tick, so no stale index can survive" }, w: true } ] },
    { fn: "onListenerReadable()", file: "src/core/Server.cpp", depth: 1,
      note: { th: "`accept()` **วนจนกว่าจะคืนค่าลบ** เพราะ 1 event ของ poll อาจหมายถึงหลาย connection ที่รออยู่ใน backlog แล้วตั้ง `O_NONBLOCK` ให้ socket ที่รับมาด้วย",
              en: "`accept()` **loops until it returns negative** — one poll event can mean several connections waiting in the backlog — and the accepted socket gets `O_NONBLOCK` too." },
      data: "accept() -> fd 7   fcntl(7, F_SETFL, O_NONBLOCK)",
      vars: [ { n: "_conns[7]", v: "new Connection(7)", d: { th: "buffer เข้า/ออกของ client รายนี้", en: "this client's in and out buffers" }, w: true } ] },
    { fn: "Connection::onReadable()", file: "src/core/Connection.cpp", depth: 1,
      note: { th: "`recv` คืน 0 = ปลายทางปิด, < 0 = fd ตาย ทั้งสองกรณีตัดทิ้ง — **ไม่แตะ `errno` เลย** เพราะ poll บอกแล้วว่าพร้อม",
              en: "`recv` returning 0 means the peer closed and < 0 means the descriptor is dead; both drop the connection. **`errno` is never consulted** because poll already said it was ready." },
      data: "recv(7, buf, 16384) -> 1400  (มาไม่ครบก้อน)",
      vars: [ { n: "_inBuf", v: "\"POST /upload HTTP/1.1\r\nHost: ...\"", d: { th: "สะสม byte ดิบไว้ก่อน", en: "raw bytes accumulate here first" }, w: true } ] },
    { fn: "HttpRequest::feed()", file: "src/http/HttpRequest.cpp", depth: 2,
      note: { th: "state machine ที่ **หยุดตรง `ST_HEADERS_DONE`** เพราะขนาด body สูงสุดขึ้นกับ location ที่ตรงกัน ซึ่งยังไม่รู้จนกว่าจะ parse path เสร็จ",
              en: "The state machine **pauses at `ST_HEADERS_DONE`**, because the body limit depends on the matched location, which is unknown until the path is parsed." },
      data: "ST_REQUEST_LINE -> ST_HEADERS -> ST_HEADERS_DONE",
      vars: [ { n: "_st", v: "ST_HEADERS_DONE", d: { th: "จุดพักที่รอผู้เรียกบอกลิมิต", en: "the pause where the caller supplies the limit" }, w: true } ] },
    { fn: "pickVirtualHost() + pickLocation()", file: "src/config/ConfigTypes.cpp", depth: 2,
      note: { th: "เลือก server block จาก header `Host:` แล้วเลือก location: **exact ก่อน แล้ว extension แล้วค่อย longest prefix** พร้อมกันไม่ให้ `/foo` ไปแมตช์ `/foobar`",
              en: "Pick the server block from the `Host:` header, then the location: **exact first, then extension, then longest prefix**, with the guard that stops `/foo` matching `/foobar`." },
      data: "Host: localhost -> server{8080}   /upload -> location /upload",
      vars: [ { n: "loc.clientMaxBodySize", v: "5242880", d: { th: "ลิมิตที่เพิ่งรู้ ส่งกลับให้ parser", en: "the limit just learned, handed back to the parser" }, w: true } ] },
    { fn: "applyBodyLimit() -> อ่าน body", file: "src/http/HttpRequest.cpp", depth: 2,
      note: { th: "de-chunk **ในตัว parser** เพื่อให้ handler กับ CGI เห็นแต่ body ธรรมดา และเมื่อเกิน `client_body_buffer_size` จะ spool ลงไฟล์แทนที่จะกองใน RAM",
              en: "De-chunking happens **in the parser** so the handler and CGI only ever see a plain body, and past `client_body_buffer_size` it spools to a file instead of piling up in RAM." },
      data: "body 4.2 MB > 1 MiB  ->  เขียนลง /tmp/webserv_body_00017",
      vars: [ { n: "_spoolPath", v: "/tmp/webserv_body_00017", d: { th: "เจ้าของไฟล์นี้ต้องชัด ไม่งั้นไฟล์ค้าง", en: "ownership must be explicit or the file is stranded" }, w: true } ] },
    { fn: "RequestHandler::handle()", file: "src/http/RequestHandler.cpp", depth: 1,
      note: { th: "ตรวจ method กับ `allow_methods` (HEAD ไม่ขี่สิทธิ์ของ GET), normalize URI ก่อนแตะ filesystem แล้วค่อยตัดสินว่าเป็นไฟล์ / upload / CGI / redirect",
              en: "Check the method against `allow_methods` (HEAD does not inherit GET's permission), normalise the URI before touching the filesystem, then decide file / upload / CGI / redirect." },
      data: "POST อยู่ใน allow_methods ✓   upload_store ./www/uploads",
      vars: [ { n: "status", v: "201", d: { th: "สร้างไฟล์ใหม่สำเร็จ", en: "a new file was created" }, w: true } ] },
    { fn: "Connection::onWritable()", file: "src/core/Connection.cpp", depth: 1,
      note: { th: "`send()` เขียนได้น้อยกว่าที่ขอเป็นเรื่องปกติ — ลบออกจากคิว **เท่าที่ส่งไปจริง** และขอ `POLLOUT` เฉพาะตอน out-buffer ไม่ว่าง ไม่งั้น CPU วิ่ง 100%",
              en: "A short `send()` is normal: erase **exactly what went out** and ask for `POLLOUT` only while the out-buffer is non-empty, or the CPU spins at 100%." },
      data: "send() -> 8192 / 8600   เหลือค้าง 408 byte",
      vars: [ { n: "_outBuf", v: "408 bytes left", d: { th: "ยังขอ POLLOUT ต่อจนกว่าจะว่าง", en: "POLLOUT stays armed until this is empty" }, w: true } ] },
    { fn: "keep-alive หรือปิด", file: "src/core/Connection.cpp", depth: 1,
      note: { th: "ระบายหมดแล้วถ้า `Connection` ไม่ใช่ `close` ให้รีเซ็ต parser และ **เก็บ byte ที่อ่านเกินมาไว้** เพราะนั่นคือจุดเริ่มของ request ถัดไป",
              en: "Once drained, if `Connection` is not `close`, reset the parser and **keep any over-read bytes** — they are the start of the next request." },
      data: "_inBuf ยังเหลือ \"GET /style.css HTTP/1.1\r\n...\"",
      vars: [ { n: "_req", v: "reset()", d: { th: "พร้อมรับ request ถัดไปบน socket เดิม", en: "ready for the next request on the same socket" }, w: true } ] }
  ]
};

/* Flow Visualizer ของหน้านี้ — เก็บไว้กับข้อมูลของหน้าเองจะได้ไม่ต้องโหลดไฟล์เพิ่ม */
window.EXTRA_FLOWS = window.EXTRA_FLOWS || {};
window.EXTRA_FLOWS.webserv = {
    input: "POST /upload/big.bin HTTP/1.1  (chunked, 100 MB)",
    steps: [
      { fn: "Server::run()", file: "core/Server.cpp", depth: 0,
        note: { th: "ลูปเดียวของทั้งโปรแกรม: ประกอบ `pollfd` ใหม่ทุกรอบจาก registry แล้ว `poll()` — ไม่มี I/O ที่ไหนนอกเส้นทางนี้",
                en: "The program's only loop: rebuild the `pollfd` set from the registries each tick, then `poll()` — no I/O happens off this path" },
        data: "pfds = [listener:POLLIN, client7:POLLIN]",
        vars: [
          { n: "_pfds", d: { th: "ประกอบใหม่ทุก tick ทำให้ index ที่ค้างไว้ไม่มีวันเพี้ยน", en: "rebuilt every tick, so a stale index can never go wrong" }, w: true } ] },
      { fn: "onListenerReadable()", file: "core/Server.cpp", depth: 1,
        note: { th: "`accept()` **วนจนคืนค่าลบ** เพราะ 1 event ของ poll อาจหมายถึงหลาย connection ที่รออยู่ แล้วตั้ง `O_NONBLOCK` ให้ socket ที่รับมาด้วย",
                en: "`accept()` **loops until it returns negative** because one poll event can mean several pending connections, and the accepted socket also gets `O_NONBLOCK`" },
        data: "cfd = 7   -> new Connection(7)",
        vars: [
          { n: "cfd", v: "7", d: { th: "fd ของ client ใหม่", en: "the new client's descriptor" }, w: true } ] },
      { fn: "Connection::onReadable()", file: "core/Connection.cpp", depth: 1,
        note: { th: "`recv` ครั้งเดียวแล้วป้อน parser — `n == 0` คือปลายทางปิด, `n < 0` คือ fd ตาย **ไม่มีการดู `errno`** เพราะ poll บอกแล้วว่าพร้อม",
                en: "One `recv`, then feed the parser — `n == 0` means the peer closed and `n < 0` means the descriptor is dead. **`errno` is never consulted**, because poll already said it was ready" },
        data: "recv() -> 8192 bytes -> _inBuf",
        vars: [
          { n: "_inBuf", d: { th: "byte ดิบที่ยังไม่ถูก parse สะสมไว้ที่นี่", en: "raw bytes accumulate here until the parser consumes them" }, w: true },
          { n: "_lastIo", d: { th: "ประทับเวลาไว้ใช้ตัดสิน timeout", en: "stamped for the timeout sweep" }, w: true } ] },
      { fn: "HttpRequest::feed()", file: "http/HttpRequest.cpp", depth: 2,
        note: { th: "state machine ที่ **หยุดตรง `ST_HEADERS_DONE`** เพราะยังไม่รู้ `client_max_body_size` จนกว่าจะ resolve location ได้",
                en: "The state machine **pauses at `ST_HEADERS_DONE`** because `client_max_body_size` is unknown until the location has been resolved" },
        data: "ST_REQUEST_LINE -> ST_HEADERS -> ST_HEADERS_DONE",
        vars: [
          { n: "_st", v: "ST_HEADERS_DONE", d: { th: "รอผู้เรียกบอกลิมิต", en: "waiting for the caller's limit" }, w: true } ] },
      { fn: "pickVirtualHost() + pickLocation()", file: "config/ConfigParser.cpp", depth: 2,
        note: { th: "เลือก server block จาก header `Host:` แล้วเลือก location ตามลำดับ exact -> extension -> longest prefix จากนั้นค่อย `applyBodyLimit()`",
                en: "Pick the server block from the `Host:` header, then the location by exact, extension and finally longest prefix — only then `applyBodyLimit()`" },
        data: "Host: localhost -> server[0]\n/upload/big.bin -> location /upload  (maxBody 5m)",
        vars: [
          { n: "clientMaxBodySize", v: "5m", d: { th: "ค่าที่ทำให้ parser เดินต่อได้", en: "the value that unblocks the parser" }, w: true } ] },
      { fn: "feedChunked()", file: "http/HttpRequest.cpp", depth: 2,
        note: { th: "de-chunk **ในตัว parser** เพื่อให้ handler กับ CGI เห็นแต่ body ธรรมดา ทุกสถานะ resumable เพราะ chunk มาไม่ครบก้อน",
                en: "De-chunking happens **inside the parser** so the handler and CGI only ever see a plain body; every state is resumable because chunks arrive split" },
        data: "size line 2000 (hex) -> data -> CRLF -> วนใหม่",
        vars: [
          { n: "_chunkLeft", v: "8192", d: { th: "เหลืออีกกี่ byte ใน chunk ปัจจุบัน", en: "bytes still owed by the current chunk" }, w: true } ] },
      { fn: "appendBody() -> spool file", file: "http/HttpRequest.cpp", depth: 3,
        note: { th: "เกิน `client_body_buffer_size` แล้ว body ไหลลงไฟล์ชั่วคราวแทน RAM — วัดจริงบนเทสต์เดียวกัน **2020 MB เหลือ 22 MB**. ไฟล์บนดิสก์ได้รับการยกเว้นจากกฎ poll",
                en: "Past `client_body_buffer_size` the body goes to a temp file instead of RAM — measured on the same test, **2020 MB becomes 22 MB**. Regular files are exempt from the poll rule" },
        data: "open(client_body_temp_path/…, O_CREAT|O_EXCL)\nwrite(fd, decoded, n)",
        vars: [
          { n: "_spoolFd", d: { th: "เจ้าของไฟล์ต้องชัด ไม่งั้นไฟล์ค้างเต็มดิสก์", en: "ownership must be explicit or temp files pile up" }, w: true } ] },
      { fn: "RequestHandler::handle()", file: "http/RequestHandler.cpp", depth: 1,
        note: { th: "ตัดสินใจว่าจะตอบอะไร: method อยู่ใน `allow_methods` ไหม (ไม่งั้น 405 + `Allow:`), normalize URI ก่อนแตะ filesystem, เป็น CGI หรือไฟล์นิ่ง",
                en: "Decides the answer: is the method in `allow_methods` (else 405 with `Allow:`), normalise the URI before touching the filesystem, CGI or static file" },
        data: "POST + upload_store -> เขียนไฟล์จาก spool แบบ copy ทีละก้อน",
        vars: [
          { n: "status", v: "201", d: { th: "สร้างไฟล์สำเร็จ", en: "the upload was created" }, w: true } ] },
      { fn: "Connection::onWritable()", file: "core/Connection.cpp", depth: 1,
        note: { th: "`send()` เขียนได้น้อยกว่าที่ขอเป็นเรื่องปกติ — **ลบออกจากคิวเท่าที่คืนมาจริง** และขอ `POLLOUT` เฉพาะตอนมี byte ค้าง ไม่งั้น CPU วิ่ง 100%",
                en: "`send()` routinely writes less than asked — **erase exactly what it returned**, and only arm `POLLOUT` while bytes are queued or the CPU spins at 100%" },
        data: "_outBuf: 512 -> send 512 -> ว่าง -> ปลด POLLOUT",
        vars: [
          { n: "_outBuf", v: "\"\"", d: { th: "ระบายหมดแล้ว keep-alive จึงรีเซ็ต parser รอ request ถัดไป", en: "drained, so keep-alive resets the parser for the next request" }, w: true } ] }
    ]
  };
