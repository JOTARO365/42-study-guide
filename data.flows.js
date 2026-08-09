/* data.flows.js — Flow Visualizer ของหน้าที่ยังไม่มี
   schema: window.EXTRA_FLOWS[projectId] = { input, steps:[{fn,file,depth,note,data,vars}] }
   fn / file / data เรนเดอร์ดิบ (เป็นชื่อโค้ด) ส่วน note และ vars[].d ผ่าน t() จึงใส่ {th,en} ได้ */
window.EXTRA_FLOWS = window.EXTRA_FLOWS || {};

Object.assign(window.EXTRA_FLOWS, {

  netpractice: {
    input: "goal A1 -> B1 : ping 192.168.2.20",
    steps: [
      { fn: "sim_reach_gen(goal)", file: "sim.js", depth: 0,
        note: { th: "จุดเริ่มของทุก goal — จำลอง **สองรอบ** คือ Forward way แล้วตามด้วย Reverse way ถ้ารอบไหนตกก็ KO",
                en: "Where every goal starts — it simulates **twice**, Forward way then Reverse way; either failing means KO" },
        data: "src = A1 (192.168.1.10)\ndst = B1 (192.168.2.20)",
        vars: [
          { n: "ip_src", v: "192.168.1.10", d: { th: "IP ของเครื่องต้นทาง", en: "the source host's address" } },
          { n: "ip_dest", v: "192.168.2.20", d: { th: "IP ปลายทาง — ค่านี้ไม่เปลี่ยนตลอดเส้นทาง", en: "the destination, unchanged for the whole path" } }
        ] },
      { fn: "get_if_ip(A1)", file: "sim.js", depth: 1,
        note: { th: "ขอ IP ที่ **ใช้ได้จริง** ของ interface — คืน `null` ถ้า IP เท่ากับ network หรือ broadcast ของ mask ตัวเอง นี่คือเหตุผลที่ /31 กับ /32 ตายเสมอ",
                en: "Asks for the interface's **usable** address — it returns `null` when the address equals its own network or broadcast, which is why /31 and /32 are always dead" },
        data: "ip   = 192.168.1.10\nmask = 255.255.255.0\nnetwork = .0   broadcast = .255   -> ok",
        vars: [
          { n: "mask", v: "255.255.255.0", d: { th: "ต้องเป็นบิต 1 ที่ติดกัน ไม่งั้น `mask_to_int()` ปฏิเสธ", en: "must have contiguous 1-bits or `mask_to_int()` rejects it" } }
        ] },
      { fn: "rec_route(dest, target, A1)", file: "sim.js", depth: 1,
        note: { th: "ถามว่า **ขาไหนของเครื่องนี้ครอบปลายทางบ้าง** — ได้ 0 ขาแปลว่าต้องพึ่ง routing table, ได้มากกว่า 1 ขาคือ `multiple interface match` ตายทันที",
                en: "Asks **which of this machine's legs cover the destination** — zero means fall back to the routing table, more than one is `multiple interface match` and it dies at once" },
        data: "A1 มีขาเดียว: 192.168.1.0/24\n192.168.2.20 ไม่อยู่ในนั้น -> ต้องหา route",
        vars: [
          { n: "nb_match", v: "0", d: { th: "จำนวนขาที่ครอบปลายทาง", en: "how many legs cover the destination" }, w: true }
        ] },
      { fn: "ip_match_route(routes)", file: "sim.js", depth: 2,
        note: { th: "ไล่ตารางจาก **บนลงล่าง** และหยุดที่บรรทัดแรกที่ตรง (`if (nb_routes > 0) return ret;`) — default ที่วางไว้บนจึงกลืน route เจาะจงที่อยู่ล่าง",
                en: "Scans the table **top to bottom** and stops at the first match (`if (nb_routes > 0) return ret;`) — a default placed on top swallows the specific route below it" },
        data: "route: 0.0.0.0/0  gate: 192.168.1.1   <- ตรง หยุดที่นี่",
        vars: [
          { n: "gate", v: "192.168.1.1", d: { th: "hop ถัดไป ไม่ใช่ปลายทาง", en: "the next hop, not the destination" }, w: true }
        ] },
      { fn: "rec_route(dest, gate, A1)", file: "sim.js", depth: 2,
        note: { th: "เรียกซ้ำแต่คราวนี้ target คือ **gateway** — ถ้าไม่มีขาไหนคุยกับ gateway ได้ตรง ๆ จะได้ `route match but no interface for gateway` แล้วทิ้ง packet ไม่ไหลลงบรรทัดถัดไป",
                en: "Recurses, but now the target is the **gateway** — if no leg can reach it directly you get `route match but no interface for gateway` and the packet is dropped rather than trying the next line" },
        data: "192.168.1.1 อยู่ใน 192.168.1.0/24 ของขา A1 -> ส่งบนสายได้",
        vars: [
          { n: "input_itf", v: "if_A1", d: { th: "ขาที่ packet ออกไป", en: "the leg the packet leaves through" } }
        ] },
      { fn: "hop -> R1", file: "sim.js", depth: 1,
        note: { th: "มาถึง router แล้วเริ่มตรรกะเดิมซ้ำ: ขาไหนครอบ `192.168.2.20` — ถ้า 2 ขาซ้อนกันตายที่นี่",
                en: "At the router the same logic starts over: which leg covers `192.168.2.20` — two overlapping legs die right here" },
        data: "R1a = 192.168.1.0/24  ไม่ครอบ\nR1b = 10.0.0.0/30      ไม่ครอบ\n-> ค้น routing table ของ R1",
        vars: [
          { n: "h['id']", v: "R1", d: { th: "เครื่องที่กำลังตัดสินใจอยู่", en: "the machine making the decision now" }, w: true }
        ] },
      { fn: "hop -> R2 -> B1", file: "sim.js", depth: 1,
        note: { th: "R1 เจอ route `192.168.2.0/24` ส่งไป gateway `10.0.0.2` แล้ว R2 มีขาที่ครอบปลายทางจึงวางลงสายตรง",
                en: "R1 matches `192.168.2.0/24` and hands it to gateway `10.0.0.2`; R2 has a leg covering the destination so it goes straight onto the wire" },
        data: "R2b = 192.168.2.0/24 ครอบ .20 -> ส่งบนสาย",
        vars: [
          { n: "ttl", v: "3 hops", d: { th: "switch ไม่นับเป็น hop", en: "switches are not hops" } }
        ] },
      { fn: "destination IP reached", file: "sim.js", depth: 1,
        note: { th: "ถึงเมื่อ **IP ของขาใดขาหนึ่งตรงเป๊ะ** กับปลายทาง (ไม่ใช่แค่อยู่ subnet เดียวกัน) ถ้าอยู่ subnet เดียวกันแต่เลขไม่ตรงจะได้ `packet not for me`",
                en: "Arrival means **a leg's address equals the destination exactly**, not merely sharing its subnet — same subnet with the wrong number is `packet not for me`" },
        data: "B1 = 192.168.2.20 == ip_dest   -> Forward way OK",
        vars: [
          { n: "status", v: "OK", d: { th: "ครึ่งแรกผ่าน", en: "the first half passed" }, w: true }
        ] },
      { fn: "Reverse way: B1 -> A1", file: "sim.js", depth: 0,
        note: { th: "สลับต้นทางกับปลายทางแล้วเดินใหม่ทั้งเส้น — **นี่คือจุดที่คนตกมากที่สุด** เพราะ R2 ต้องมี route กลับไป `192.168.1.0/24` ด้วย ไม่งั้นได้ `KO - No reverse way`",
                en: "Swaps source and destination and walks the whole path again — **this is where most people fail**, because R2 also needs a route back to `192.168.1.0/24` or you get `KO - No reverse way`" },
        data: "B1 -> R2 -> R1 -> A1\nR2 ต้องมี: 192.168.1.0/24 -> 10.0.0.1",
        vars: [
          { n: "goal", v: "OK - Congratulations!!", d: { th: "เขียวก็ต่อเมื่อผ่านทั้งสองทิศ", en: "green only when both directions pass" }, w: true }
        ] }
    ]
  },

  webserv: {
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
  },

  ft_irc: {
    input: "nc -C : ส่ง \"PRIVM\" , \"SG #42 :hi\" , \"\\r\\n\" เป็น 3 packet",
    steps: [
      { fn: "Server::loop()", file: "src/ServerLoop.cpp", depth: 0,
        note: { th: "`_refreshPollOut()` ก่อนทุกครั้ง: ขอ `POLLOUT` เฉพาะ client ที่ out-buffer ไม่ว่าง แล้ว `poll(..., 500)` ให้ SIGINT ตอบสนองไว",
                en: "`_refreshPollOut()` runs first: arm `POLLOUT` only where the out-buffer is non-empty, then `poll(..., 500)` so SIGINT stays responsive" },
        data: "pfds = [listen:POLLIN, fd9:POLLIN]",
        vars: [
          { n: "revents", d: { th: "แหล่งความจริงเดียวว่าจะแตะ fd ไหน", en: "the only source of truth about which fd to touch" } } ] },
      { fn: "recv(fd9)", file: "src/ServerLoop.cpp", depth: 1,
        note: { th: "packet ที่ 1 มาถึง — **ห้าม parse ผลของ `recv` ตรง ๆ** เพราะ TCP ไม่มีขอบเขตข้อความ ต่อท้าย buffer ต่อ client เท่านั้น",
                en: "The first packet arrives — **never parse what `recv` returned**, because TCP has no message boundaries; append to the per-client buffer instead" },
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
        note: { th: "ตัดที่ `\\n` แล้ว **ตัด `\\r` ท้ายทิ้งถ้ามี** — irssi ส่ง `\\r\\n` แต่ `nc` ส่ง `\\n` เปล่า ต้องรับทั้งคู่ ส่วนขาออกส่ง `\\r\\n` เสมอ",
                en: "Split on `\\n` and **strip a trailing `\\r`** — irssi sends `\\r\\n` while `nc` sends a bare `\\n`, so both must work; outgoing lines always use `\\r\\n`" },
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
  },

  inception: {
    input: "make up   (volume ว่างเปล่า, บูตครั้งแรก)",
    steps: [
      { fn: "docker compose up -d --build", file: "Makefile", depth: 0,
        note: { th: "build image ทั้งสามจาก Dockerfile ของเราเอง แล้วสตาร์ตตามลำดับที่ `depends_on` กำหนด — ไม่มี image สำเร็จรูปของแอปเลย",
                en: "Builds all three images from our own Dockerfiles and starts them in the order `depends_on` dictates — no ready-made application image anywhere" },
        data: "mariadb:1.0  wordpress:1.0  nginx:1.0",
        vars: [
          { n: "DATA_PATH", v: "/home/<login>/data", d: { th: "ปลายทางจริงของ named volume", en: "where the named volumes really live" } } ] },
      { fn: "mariadb entrypoint.sh", file: "requirements/mariadb/tools/entrypoint.sh", depth: 1,
        note: { th: "อ่าน secret จาก `/run/secrets/` แล้ว **`tr -d '\\r\\n'`** ทันที — CR ที่ติดมาจาก Windows ทำให้รหัสผ่านเพี้ยนแล้ว login พังด้วย error 1045 โดยที่พิมพ์ออกมาดูเหมือนกันเป๊ะ",
                en: "Reads the secrets from `/run/secrets/` and **`tr -d '\\r\\n'`** at once — a CR left by Windows poisons the password and every later login fails with error 1045 while both values print identically" },
        data: "ROOT_PW=$(tr -d '\\r\\n' < /run/secrets/db_root_password)",
        vars: [
          { n: "/run/secrets", d: { th: "tmpfs ที่ `docker inspect` มองไม่เห็น ต่างจาก `.env`", en: "tmpfs that `docker inspect` cannot show, unlike `.env`" } } ] },
      { fn: "mariadbd --bootstrap", file: "tools/entrypoint.sh", depth: 2,
        note: { th: "โหมดนี้ **ไม่ใช่ SQL parser** — มันส่งให้ server ทีละ *บรรทัด* คำสั่งที่ตัดขึ้นบรรทัดใหม่จะพังแล้วทุกอย่างหลังจากนั้นหายหมด จนได้ root ที่ตั้งรหัสแล้วแต่ไม่มี database",
                en: "This mode is **not a SQL parser** — it hands the server one *line* at a time, so a wrapped statement breaks and everything after it is lost, leaving a root password set but no database" },
        data: "CREATE DATABASE IF NOT EXISTS wordpress ...;   (บรรทัดเดียวจบ)\nCREATE USER 'wpuser'@'%' IDENTIFIED BY '...';",
        vars: [
          { n: "/var/lib/mysql", d: { th: "ต้อง `rm -rf` ใน Dockerfile ไม่งั้น Docker ก๊อป datadir ของ image เข้า volume ว่างแล้ว bootstrap ไม่เคยรัน", en: "must be `rm -rf`d in the Dockerfile, or Docker copies the image's datadir into the empty volume and the bootstrap never runs" }, w: true } ] },
      { fn: "exec mariadbd --user=mysql", file: "tools/entrypoint.sh", depth: 1,
        note: { th: "`exec` **แทนที่** shell ทำให้ daemon เป็น PID 1 เอง จึงได้รับ `SIGTERM` ตอน `docker stop` — นี่คือเหตุผลที่ `tail -f` ถูกห้าม และผู้ตรวจเช็กด้วย `cat /proc/1/comm`",
                en: "`exec` **replaces** the shell so the daemon becomes PID 1 and receives `SIGTERM` on `docker stop` — which is why `tail -f` is banned, and evaluators check with `cat /proc/1/comm`" },
        data: "/proc/1/comm -> mariadbd",
        vars: [
          { n: "PID 1", v: "mariadbd", d: { th: "ตัวรับสัญญาณจาก Docker", en: "what receives Docker's signals" }, w: true } ] },
      { fn: "healthcheck: SELECT 1", file: "srcs/docker-compose.yml", depth: 1,
        note: { th: "ใช้ query ที่ **ต้องใช้ credential จริง** ไม่ใช่ `mariadb-admin ping` เพราะ ping ตอบ exit 0 แม้ auth พัง แล้ว healthcheck จะเขียวทั้งที่ไม่มีใคร login ได้",
                en: "Uses a query that **needs real credentials**, not `mariadb-admin ping`, because ping exits 0 even when authentication fails and the check goes green while nobody can log in" },
        data: "mariadb -h localhost -u root -p\"...\" -e 'SELECT 1'   -> healthy",
        vars: [
          { n: "-h localhost", d: { th: "ต้องใส่ให้ชัด ไม่งั้น `MYSQL_HOST` จาก `.env` แย่ง client ไปวิ่ง TCP แล้วถูกปฏิเสธ", en: "must be explicit, or `MYSQL_HOST` from `.env` hijacks the client onto TCP and it is refused" } } ] },
      { fn: "wordpress entrypoint.sh", file: "requirements/wordpress/tools/entrypoint.sh", depth: 1,
        note: { th: "`depends_on: service_healthy` ปล่อยให้เริ่มได้แล้ว แต่ยัง **รอ `SELECT 1` ผ่านจริงด้วยตัวเอง** และ wait-loop มีเพดาน ไม่งั้น container ค้างแทนที่จะแจ้ง error",
                en: "`depends_on: service_healthy` let it start, but it still **waits for a real `SELECT 1`** of its own, with a ceiling on the loop so a failure is reported rather than hanging the container" },
        data: "until mariadb ... -e 'SELECT 1'; do sleep 2; done",
        vars: [
          { n: "i", v: "<= 60", d: { th: "เพดานของ wait-loop", en: "the loop's ceiling" } } ] },
      { fn: "wp core install", file: "tools/entrypoint.sh", depth: 2,
        note: { th: "`wp-cli` เป็นไฟล์ phar ไม่ใช่ image สำเร็จรูป จึงใช้ได้ตามกฎ — เขียน `wp-config.php` ลงใน **volume** ไม่ใช่ในชั้นของ image ทำให้รหัสผ่านไม่ถูกอบเข้าไป",
                en: "`wp-cli` is a phar, not a ready-made image, so it is allowed — and it writes `wp-config.php` into the **volume**, never into an image layer, so no password is baked in" },
        data: "admin: wiaonin (ห้ามมีคำว่า admin)\nauthor: guest",
        vars: [
          { n: "wp-config.php", d: { th: "ครั้งหน้าบูต เจอไฟล์นี้แล้วข้ามการติดตั้งทันที", en: "on the next boot its presence skips installation entirely" }, w: true } ] },
      { fn: "nginx entrypoint.sh", file: "requirements/nginx/tools/entrypoint.sh", depth: 1,
        note: { th: "สร้าง self-signed cert **ตอนรัน** ไม่ใช่ใน Dockerfile — CN จึงตาม `DOMAIN_NAME` และ private key ไม่ไปอยู่ในชั้น image ที่อาจถูก push",
                en: "Generates the self-signed certificate **at run time**, not in the Dockerfile, so the CN follows `DOMAIN_NAME` and no private key lands in a layer that could be pushed" },
        data: "openssl req -x509 ... -subj \"/CN=$DOMAIN_NAME\"\nssl_protocols TLSv1.2 TLSv1.3;",
        vars: [
          { n: "ports", v: "443:443", d: { th: "รายการเดียวในทั้งไฟล์ compose", en: "the only entry in the whole compose file" } } ] },
      { fn: "GET /wp-admin/", file: "conf/default.conf", depth: 0,
        note: { th: "NGINX เสิร์ฟไฟล์ static เองจาก volume ที่แชร์กัน ส่วน `.php` แปลงเป็น FastCGI ส่งไป `wordpress:9000` — ต้องมี `fastcgi_param HTTPS on` ไม่งั้น `is_ssl()` เป็น false แล้ว redirect วนไม่จบ",
                en: "NGINX serves the static files itself from the shared volume and translates `.php` into FastCGI for `wordpress:9000` — `fastcgi_param HTTPS on` is required or `is_ssl()` is false and the page redirect-loops" },
        data: "browser -> nginx:443 -> php-fpm:9000 -> mariadb:3306",
        vars: [
          { n: "fastcgi_buffer_size", v: "16k", d: { th: "URI ยาวทำ header ล้น buffer 4k แล้วได้ 502", en: "a long URI overflows the 4k default and returns 502" } } ] }
    ]
  },

  minirt: {
    input: "./miniRT scenes/sphere.rt   (1 pixel ที่ (640, 360))",
    steps: [
      { fn: "main()", file: "src/main.c", depth: 0,
        note: { th: "ตรวจ argument, parse `.rt`, เตรียม mlx แล้วเข้า render loop — ทุก error path ต้อง free ให้ครบก่อน exit",
                en: "Check the arguments, parse the `.rt`, set up mlx and enter the render loop — every error path must free everything before exiting" },
        data: "argv[1] = \"scenes/sphere.rt\"",
        vars: [
          { n: "t_scene", d: { th: "struct เดียวถือ camera, lights และ object ทั้งหมด", en: "one struct holding the camera, the lights and every object" }, w: true } ] },
      { fn: "parse_scene()", file: "src/parse/parse.c", depth: 1,
        note: { th: "อ่านทีละบรรทัด: `A` ambient, `C` camera, `L` light, `sp`/`pl`/`cy` วัตถุ — element ที่ควรมีตัวเดียวต้องไม่ซ้ำ และค่าที่นอกช่วงต้องตายด้วย `Error`",
                en: "Line by line: `A` ambient, `C` camera, `L` light, `sp`/`pl`/`cy` objects — the single-instance elements must not repeat and out-of-range values must die with `Error`" },
        data: "C  0,0,-5  0,0,1  70\nsp 0,0,0  2  255,0,0",
        vars: [
          { n: "fov", v: "70", d: { th: "FOV แนวนอน ใช้คำนวณขนาด viewport", en: "the horizontal FOV that sizes the viewport" } } ] },
      { fn: "setup_camera()", file: "src/render/camera.c", depth: 1,
        note: { th: "สร้างฐาน orthonormal จากทิศกล้อง (`forward`, `right`, `up`) — ถ้า forward ขนานกับ world-up ต้องเลือกเวกเตอร์ช่วยตัวอื่น ไม่งั้น cross product ได้ศูนย์",
                en: "Builds an orthonormal basis from the camera direction (`forward`, `right`, `up`) — when forward is parallel to world-up you must pick a different helper vector or the cross product is zero" },
        data: "half_w = tan(fov/2)\nright = normalize(cross(fwd, up_world))",
        vars: [
          { n: "right / up", d: { th: "แกนของ viewport ในโลก 3 มิติ", en: "the viewport's axes in world space" }, w: true } ] },
      { fn: "ray_for_pixel(640, 360)", file: "src/render/ray.c", depth: 1,
        note: { th: "แปลงพิกัด pixel เป็นทิศ ray — ต้องบวก 0.5 เพื่อยิงผ่าน **กลาง** pixel และคูณ aspect ratio ไม่งั้นภาพยืด",
                en: "Turns pixel coordinates into a ray direction — add 0.5 to shoot through the **centre** of the pixel and apply the aspect ratio or the image stretches" },
        data: "u = (640 + 0.5)/W * 2 - 1\ndir = normalize(fwd + u*half_w*right + v*half_h*up)",
        vars: [
          { n: "dir", d: { th: "ต้อง normalize ไม่งั้นระยะ `t` ที่ได้ไม่ใช่ระยะจริง", en: "must be normalised or the `t` you get is not a real distance" }, w: true } ] },
      { fn: "hit_sphere()", file: "src/objects/sphere.c", depth: 2,
        note: { th: "แทน ray ลงสมการทรงกลมได้สมการกำลังสอง — `discriminant < 0` คือไม่ชน, และต้องเลือกรากที่ **บวกและน้อยที่สุด** เพื่อไม่ให้เห็นทะลุหลังกล้อง",
                en: "Substituting the ray into the sphere equation gives a quadratic — `discriminant < 0` means no hit, and you take the **smallest positive** root so nothing behind the camera shows through" },
        data: "a=dot(d,d)  b=2*dot(d,oc)  c=dot(oc,oc)-r*r\ndisc = b*b - 4ac = 12.4  -> t = 3.2",
        vars: [
          { n: "t", v: "3.2", d: { th: "ระยะถึงจุดชนที่ใกล้ที่สุด", en: "distance to the nearest intersection" }, w: true } ] },
      { fn: "closest_hit()", file: "src/render/trace.c", depth: 1,
        note: { th: "วนทุกวัตถุแล้วเก็บ `t` ที่น้อยที่สุด — เก็บทั้งจุดชน, normal และสีของวัตถุนั้นไว้ใช้ตอน shade",
                en: "Loop every object keeping the smallest `t`, and record the hit point, the normal and that object's colour for the shading step" },
        data: "hit.point  = origin + t*dir\nhit.normal = normalize(point - center)",
        vars: [
          { n: "hit.normal", d: { th: "ต้องพลิกด้านถ้ากล้องอยู่ข้างในวัตถุ", en: "must be flipped when the camera is inside the object" }, w: true } ] },
      { fn: "shadow_ray()", file: "src/render/light.c", depth: 2,
        note: { th: "ยิง ray จากจุดชนไปหาไฟ ถ้ามีอะไรขวางก็เหลือแค่ ambient — **ต้องขยับจุดเริ่มออกตาม normal นิดหนึ่ง** ไม่งั้นเจอ shadow acne เพราะ ray ชนวัตถุตัวเอง",
                en: "Shoot a ray from the hit toward the light; anything in the way leaves only ambient — **offset the origin slightly along the normal** or you get shadow acne from the surface hitting itself" },
        data: "shadow_origin = point + normal * 1e-4",
        vars: [
          { n: "in_shadow", v: "false", d: { th: "ไม่มีอะไรบัง จึงคิด diffuse ต่อ", en: "nothing blocks it, so the diffuse term applies" }, w: true } ] },
      { fn: "shade()", file: "src/render/light.c", depth: 1,
        note: { th: "ambient + diffuse ตามกฎ Lambert (`max(0, dot(normal, light_dir))`) แล้ว **clamp เป็น 0-255** ก่อนแปลงเป็นสี ไม่งั้นค่าล้นแล้วสีเพี้ยน",
                en: "Ambient plus Lambert diffuse (`max(0, dot(normal, light_dir))`), then **clamp to 0-255** before packing the colour or it overflows and the hue flips" },
        data: "diff = max(0, dot(n, l)) = 0.78\ncolor = ambient + albedo * diff * light",
        vars: [
          { n: "color", v: "0xE84B4B", d: { th: "สีสุดท้ายของ pixel นี้", en: "this pixel's final colour" }, w: true } ] },
      { fn: "my_mlx_pixel_put()", file: "src/render/image.c", depth: 1,
        note: { th: "เขียนลง **buffer ของ image** ไม่ใช่วาดลงหน้าต่างทีละ pixel แล้วค่อย `mlx_put_image_to_window()` ครั้งเดียวตอนจบ — เร็วกว่ามาก",
                en: "Write into the **image buffer** rather than drawing pixel by pixel onto the window, then `mlx_put_image_to_window()` once at the end — far faster" },
        data: "addr[y*line_len + x*(bpp/8)] = color",
        vars: [
          { n: "line_len / bpp", d: { th: "ค่าที่ `mlx_get_data_addr` คืนมา ต้องใช้คำนวณ offset", en: "returned by `mlx_get_data_addr` and needed for the offset maths" } } ] }
    ]
  },

  cub3d: {
    input: "./cub3D maps/scene.cub   (1 เฟรม, คอลัมน์ x = 640)",
    steps: [
      { fn: "main()", file: "src/main.c", depth: 0,
        note: { th: "parse `.cub` -> ตรวจ map -> เปิด mlx -> ผูก hook -> `mlx_loop()` ทุก error path ต้อง free แล้วพิมพ์ `Error` ขึ้นบรรทัดใหม่",
                en: "Parse the `.cub`, validate the map, open mlx, hook the events and enter `mlx_loop()`. Every error path frees first and prints `Error` on its own line" },
        data: "argv[1] = \"maps/scene.cub\"",
        vars: [
          { n: "t_game", d: { th: "struct เดียวถือ map, player, texture และ image", en: "one struct holding the map, player, textures and image" }, w: true } ] },
      { fn: "parse_cub()", file: "src/parse/parse.c", depth: 1,
        note: { th: "6 element (`NO SO WE EA F C`) ต้องครบและไม่ซ้ำ **ก่อน** ถึงบรรทัดแผนที่ — บรรทัดว่างกลาง element ได้ แต่กลางแผนที่ไม่ได้",
                en: "All six elements (`NO SO WE EA F C`) must appear exactly once **before** the map lines; blank lines are fine between elements but not inside the map" },
        data: "NO ./assets/north.xpm\nF 220,100,0   ->  0xDC6400",
        vars: [
          { n: "map", d: { th: "เก็บเป็น `char**` ที่ยาวไม่เท่ากันได้ ต้องระวังตอน index", en: "a `char**` whose rows can differ in length, so indexing needs care" }, w: true } ] },
      { fn: "validate_map()", file: "src/parse/validate.c", depth: 1,
        note: { th: "ต้องมีผู้เล่น **ตัวเดียว** และแผนที่ต้องปิดสนิท — flood fill จากตำแหน่งผู้เล่น ถ้าหลุดขอบหรือเจอช่องว่างที่ติดกับพื้นเดินได้ = ไม่ปิด",
                en: "Exactly **one** player, and the map must be sealed — flood fill from the player; escaping the edge or touching a space next to walkable floor means it is open" },
        data: "player = 'N' at (3, 5)   -> pos = (3.5, 5.5)",
        vars: [
          { n: "dir / plane", d: { th: "ตั้งจากตัวอักษร N/S/E/W; ความยาว plane กำหนด FOV", en: "set from the N/S/E/W letter; the plane's length sets the FOV" }, w: true } ] },
      { fn: "render_frame()", file: "src/render/render.c", depth: 1,
        note: { th: "วนคอลัมน์ x จาก 0 ถึง WIN_W-1 **หนึ่ง ray ต่อหนึ่งคอลัมน์** ไม่ใช่ต่อ pixel แบบ miniRT จึงเร็วพอเล่นเรียลไทม์",
                en: "Loop x from 0 to WIN_W-1 with **one ray per column**, not per pixel like miniRT — which is why it runs in real time" },
        data: "camera_x = 2*640/1280 - 1 = 0.0   (กลางจอพอดี)",
        vars: [
          { n: "ray_dir", v: "dir + plane*camera_x", d: { th: "ทิศของ ray คอลัมน์นี้", en: "this column's ray direction" }, w: true } ] },
      { fn: "dda_step()", file: "src/render/dda.c", depth: 2,
        note: { th: "เดินทีละ **ช่องตาราง** ไม่ใช่ทีละระยะคงที่ — เทียบ `side_dist_x` กับ `side_dist_y` แล้วก้าวไปทางที่ใกล้กว่า จนเหยียบช่อง `1`",
                en: "Steps one **grid cell** at a time rather than by a fixed distance — compare `side_dist_x` with `side_dist_y` and advance the smaller, until a `1` is hit" },
        data: "map[5][7] == '1'  -> hit, side = 0 (โดนด้าน X)",
        vars: [
          { n: "side", v: "0", d: { th: "0 = ชนผนังแนวตั้ง, 1 = แนวนอน ใช้เลือก texture", en: "0 means a vertical wall, 1 a horizontal one — it picks the texture" }, w: true } ] },
      { fn: "perp_wall_dist()", file: "src/render/dda.c", depth: 2,
        note: { th: "ใช้ระยะ **ตั้งฉากกับระนาบกล้อง** ไม่ใช่ระยะยูคลิดจากผู้เล่น — ถ้าใช้ระยะตรง ๆ ผนังจะโค้งเป็นก้นปลา (fisheye)",
                en: "Use the distance **perpendicular to the camera plane**, not the Euclidean distance from the player — the straight distance is what bends walls into a fisheye" },
        data: "perp = (map_x - pos_x + (1 - step_x)/2) / ray_dir_x = 4.8",
        vars: [
          { n: "perp", v: "4.8", d: { th: "ยิ่งไกลแถบผนังยิ่งเตี้ย", en: "the further it is, the shorter the wall strip" }, w: true } ] },
      { fn: "wall_bounds()", file: "src/render/draw.c", depth: 2,
        note: { th: "`line_height = WIN_H / perp` แล้วจัดกึ่งกลางจอ — ต้อง **clamp** ขอบบน/ล่างไว้ในจอ ไม่งั้นตอนเข้าใกล้ผนังจะเขียนทะลุ buffer",
                en: "`line_height = WIN_H / perp`, centred on screen — **clamp** the top and bottom to the window or walking into a wall writes past the buffer" },
        data: "line_height = 720/4.8 = 150\ndraw: y 285 .. 435",
        vars: [
          { n: "draw_start / end", d: { th: "clamp แล้ว ปลอดภัยต่อการเขียน", en: "clamped, so the writes are safe" }, w: true } ] },
      { fn: "tex_column()", file: "src/render/texture.c", depth: 2,
        note: { th: "`wall_x` คือจุดที่ ray ชนบนหน้าผนัง (เอาเฉพาะเศษทศนิยม) แล้วคูณความกว้าง texture — บางด้านต้อง **พลิกซ้ายขวา** ไม่งั้น texture กลับด้าน",
                en: "`wall_x` is where the ray met the wall face (its fractional part) times the texture width — some sides must be **mirrored** or the texture comes out reversed" },
        data: "wall_x = 0.37 -> tex_x = 0.37 * 64 = 23",
        vars: [
          { n: "tex_x", v: "23", d: { th: "คอลัมน์ของ texture ที่จะแปะทั้งแถบ", en: "the texture column stamped down the whole strip" }, w: true } ] },
      { fn: "put_pixel() loop", file: "src/render/draw.c", depth: 2,
        note: { th: "เดินจาก `draw_start` ถึง `draw_end` แล้วเก็บ `tex_y` ด้วยตัวสะสม (`step`) แทนการหารทุกบรรทัด — เขียนลง image buffer ตัวเดียว",
                en: "Walk `draw_start` to `draw_end` advancing `tex_y` with an accumulator (`step`) instead of dividing on every row, writing into the single image buffer" },
        data: "เพดาน 0..284 = C, ผนัง 285..435 = texture, พื้น 436..719 = F",
        vars: [
          { n: "step", d: { th: "texture เลื่อนเท่าไรต่อ 1 pixel แนวตั้ง", en: "how far the texture advances per screen row" } } ] },
      { fn: "mlx_put_image_to_window()", file: "src/render/render.c", depth: 1,
        note: { th: "ยิงครบ 1280 คอลัมน์แล้วค่อยส่ง image ทั้งใบขึ้นจอ **ครั้งเดียว** — วาดทีละ pixel ลงหน้าต่างจะช้าจนเล่นไม่ได้",
                en: "Only after all 1280 columns does the whole image go to the window **once** — drawing pixel by pixel onto the window is far too slow to play" },
        data: "1 เฟรมเสร็จ -> รอ hook ถัดไป (เดิน/หมุน) แล้ววาดใหม่",
        vars: [
          { n: "loop_hook", d: { th: "เดิน WASD แยกแกนเพื่อให้ไถลตามผนังได้ ไม่ติดหนึบ", en: "WASD movement is resolved per axis so you slide along walls instead of sticking" } } ] }
    ]
  },

  ai_finetune: {
    input: "โมเดลตอบผิดรูปแบบตลอด 12,000 ครั้ง/วัน — ควร fine-tune ไหม?",
    steps: [
      { fn: "step_1_prompt()", file: "ladder.py", depth: 0,
        note: { th: "ขั้นแรกของบันไดเสมอ: prompt ที่ชัด + few-shot 2-3 ตัวอย่างในรูปแบบเป้าหมายเป๊ะ ๆ — **ถูกที่สุดและแก้ได้ทันที**",
                en: "Always the first rung: a clear prompt plus two or three few-shot examples in the exact target shape — **the cheapest fix and it ships immediately**" },
        data: "แก้ได้ 70% ของเคส -> ยังเหลือ 30% ที่หลุดรูปแบบ",
        vars: [
          { n: "cost", v: "0", d: { th: "ไม่มีต้นทุนเทรน ไม่มี infra ใหม่", en: "no training cost, no new infrastructure" } } ] },
      { fn: "step_2_structured_output()", file: "ladder.py", depth: 0,
        note: { th: "ถ้าปัญหาคือ **รูปแบบ** ไม่ใช่ความรู้ ให้บังคับด้วย schema — constrained decoding ทำให้ output ที่ผิดรูป *เกิดไม่ได้* ไม่ใช่แค่ไม่อยากให้เกิด",
                en: "If the problem is **shape** rather than knowledge, force it with a schema — constrained decoding makes malformed output *impossible*, not merely discouraged" },
        data: "format error: 30% -> 0%",
        vars: [
          { n: "schema", d: { th: "ผอมไว้ ทุก field ที่ขอคือ token ที่ต้องเจน", en: "keep it thin: every field is generated and costs tokens" } } ] },
      { fn: "step_3_rag()", file: "ladder.py", depth: 0,
        note: { th: "ถ้าที่ขาดคือ **ข้อเท็จจริง** ให้ retrieve มาใส่ context — **fine-tuning ติดตั้งความรู้ใหม่ไม่ได้ดี** มันสอนรูปแบบและสไตล์ ไม่ใช่คลังข้อมูล",
                en: "If what is missing is **facts**, retrieve them into the context — **fine-tuning is bad at installing knowledge**; it teaches shape and style, not a database" },
        data: "คำถามเกี่ยวกับนโยบายภายใน -> ต้องใช้ RAG ไม่ใช่ SFT",
        vars: [
          { n: "freshness", d: { th: "ข้อมูลเปลี่ยนทุกวัน เทรนใหม่ทุกวันไม่ไหว", en: "data that changes daily cannot be retrained daily" } } ] },
      { fn: "decide_finetune()", file: "decide.py", depth: 0,
        note: { th: "ถึงตรงนี้ค่อยคิด fine-tune และเหตุผลที่ผ่านคือ **งานนิ่ง ปริมาณสูง และ prompt ยาวจนแพง** — คำนวณจุดคุ้มทุนก่อน",
                en: "Only here does fine-tuning make sense, and only when the task is **stable, high volume, and the prompt is long enough to be expensive** — do the break-even maths first" },
        data: "12,000 req/วัน x 1,800 token prompt\n-> ลด prompt ได้ 1,500 token/req หลังเทรน",
        vars: [
          { n: "break_even", v: "~9 วัน", d: { th: "ต้นทุนเทรน / เงินที่ประหยัดต่อวัน", en: "training cost divided by daily saving" }, w: true } ] },
      { fn: "build_dataset()", file: "data.py", depth: 1,
        note: { th: "คุณภาพชนะปริมาณ: **500 ตัวอย่างที่สะอาด ดีกว่า 50,000 ตัวอย่างที่มั่ว** และต้องกันตัวอย่างไว้เป็นชุดทดสอบตั้งแต่แรก ห้ามให้รั่วเข้าชุดเทรน",
                en: "Quality beats quantity: **500 clean examples beat 50,000 noisy ones**, and hold out a test split from the start so nothing leaks into training" },
        data: "train 900 / val 100 / test 100  (แยกก่อน dedup ทีหลังไม่ทัน)",
        vars: [
          { n: "chat_template", d: { th: "ต้องตรงกับที่โมเดลใช้ตอน inference เป๊ะ ไม่งั้นเทรนคนละรูปแบบกับที่ใช้จริง", en: "must match exactly what inference uses, or you train a different shape than you serve" }, w: true } ] },
      { fn: "loss_masking()", file: "data.py", depth: 2,
        note: { th: "คิด loss เฉพาะ **token ฝั่งคำตอบ** ไม่ใช่ทั้งบทสนทนา — ไม่งั้นโมเดลเสียความจุไปกับการท่อง prompt ที่มันจะได้รับอยู่แล้ว",
                en: "Compute the loss only on the **answer tokens**, not the whole conversation — otherwise capacity is spent memorising a prompt it will always be given anyway" },
        data: "labels[:prompt_len] = -100",
        vars: [
          { n: "-100", d: { th: "ค่าที่ PyTorch ใช้บอกว่า 'ข้าม token นี้'", en: "PyTorch's 'ignore this token' sentinel" } } ] },
      { fn: "train_lora()", file: "train.py", depth: 1,
        note: { th: "LoRA แช่แข็ง `W` แล้วเรียนแค่ `ΔW = B·A` ที่ rank ต่ำ — `B` ถูก init เป็นศูนย์ ตอนเริ่มเทรนโมเดลจึงเหมือนเดิมเป๊ะ แล้วค่อยเบนออกทีละนิด",
                en: "LoRA freezes `W` and learns only `ΔW = B·A` at low rank; `B` starts at zero so the model begins identical to the base and drifts gradually" },
        data: "r=16  alpha=32  -> เทรนแค่ ~0.3% ของพารามิเตอร์",
        vars: [
          { n: "r", v: "16", d: { th: "คอขวดที่บังคับให้เรียน 'ทิศทาง' ไม่ใช่ท่องจำ", en: "the bottleneck that forces it to learn a direction rather than memorise" } } ] },
      { fn: "evaluate_three_ways()", file: "eval.py", depth: 1,
        note: { th: "ต้องเทียบ **สามทาง** เสมอ: base, prompt ที่ปรับดีแล้ว และตัวที่ fine-tune — ถ้าไม่ชนะ prompt ที่ปรับดีแล้ว ก็ไม่คุ้มที่จะดูแลโมเดลเพิ่มอีกตัว",
                en: "Always compare **three ways**: the base, a well-tuned prompt, and the fine-tune — losing to the tuned prompt means another model to maintain for nothing" },
        data: "base 61%  |  tuned prompt 84%  |  fine-tuned 91%",
        vars: [
          { n: "regression", d: { th: "เช็ก catastrophic forgetting ด้วยชุดงานเดิมที่ไม่เกี่ยว", en: "check catastrophic forgetting with an unrelated held-out task" }, w: true } ] },
      { fn: "watch_loss_vs_metric()", file: "eval.py", depth: 2,
        note: { th: "**loss ลดแต่คำตอบแย่ลงเกิดได้จริง** — loss วัดการทายโทเคนถัดไป ไม่ได้วัดว่าคำตอบใช้ได้ วัดด้วย metric ของงานเสมอ",
                en: "**Falling loss with worse answers is a real outcome** — loss measures next-token prediction, not usefulness. Always track a task metric too" },
        data: "epoch 3: loss 0.42 (ดีขึ้น) แต่ exact-match 88% -> 85% (แย่ลง)",
        vars: [
          { n: "early_stop", d: { th: "หยุดที่ metric ของงาน ไม่ใช่ที่ loss", en: "stop on the task metric, never on the loss" }, w: true } ] }
    ]
  },

  ai_output_control: {
    input: "ต้องการ JSON ล้วน แต่โมเดลตอบ \"Sure! Here is the JSON:\" ทุกครั้ง",
    steps: [
      { fn: "log_final_prompt()", file: "debug.py", depth: 0,
        note: { th: "ขั้นแรกเสมอ: log **สตริงสุดท้ายจริง ๆ ที่ส่งเข้า API** หลัง templating — รายงาน 'โมเดลไม่ฟัง' ส่วนใหญ่คือบั๊ก templating",
                en: "Always first: log the **exact final string sent to the API** after templating — most 'the model ignores me' reports are a templating bug" },
        data: "system: \"...\"\nuser: \"Extract fields from: {{text}}\"   <- ตัวแปรไม่ถูกแทน!",
        vars: [
          { n: "rendered", d: { th: "สิ่งที่โมเดลเห็นจริง ไม่ใช่สิ่งที่เราคิดว่าส่งไป", en: "what the model actually saw, not what you think you sent" }, w: true } ] },
      { fn: "structured_output()", file: "call.py", depth: 0,
        note: { th: "การควบคุมที่แรงที่สุด — constrained decoding **mask token ที่จะทำให้ schema พัง** ออกไปเลย ผลลัพธ์ผิดรูปจึงเกิดไม่ได้ ไม่ใช่แค่ไม่ควรเกิด",
                en: "The strongest control: constrained decoding **masks out any token that would break the schema**, so invalid output cannot be produced rather than merely being discouraged" },
        data: "schema: {reason: str, code: enum[A,B,C]}",
        vars: [
          { n: "field order", d: { th: "วางฟิลด์เหตุผล **ก่อน** ข้อสรุป เพราะโมเดล condition ฟิลด์ถัดไปจากฟิลด์ก่อนหน้า", en: "put reasoning fields **before** the conclusion, since each field conditions on the previous ones" } } ] },
      { fn: "assistant_prefill()", file: "call.py", depth: 0,
        note: { th: "ถ้าไม่มี schema ให้ใช้: ใส่ต้นคำตอบไว้ในเทิร์นของ assistant เลย — ช่องสำหรับคำนำหายไป โมเดลจึงพิมพ์ 'Sure! Here is' ไม่ได้",
                en: "When no schema is available: put the opening of the answer in the assistant turn — the preamble slot is gone, so it cannot write 'Sure! Here is'" },
        data: "messages[-1] = {\"role\": \"assistant\", \"content\": \"{\"}",
        vars: [
          { n: "prefill", v: "\"{\"", d: { th: "**ไม่ได้อยู่ใน response** ต้องเอามาต่อหน้าเอง", en: "**not included in the response** — prepend it yourself" }, w: true } ] },
      { fn: "stop_sequences()", file: "call.py", depth: 0,
        note: { th: "หยุดทันทีที่เจอสตริงนั้นและ **ไม่ส่งสตริงนั้นกลับมา** — จับคู่กับ prefill ได้กรอบเป๊ะ: prefill `<answer>` แล้ว stop ที่ `</answer>`",
                en: "Generation halts the moment the sequence appears and **the sequence is not returned** — pair it with prefill for exact framing: prefill `<answer>`, stop at `</answer>`" },
        data: "stop_sequences=[\"```\", \"\\n\\nNote:\"]",
        vars: [
          { n: "max_tokens", d: { th: "ยังต้องมีเป็นตาข่ายรอง stop ไม่ได้ตัดกลาง token", en: "still needed as a backstop; stop sequences do not truncate mid-token" } } ] },
      { fn: "tool_choice()", file: "call.py", depth: 0,
        note: { th: "โมเดล 'บางครั้งไม่ยอมเรียก tool' แก้ด้วยพารามิเตอร์ ไม่ใช่คำสั่งที่หนักแน่นขึ้น — ระบุชื่อ tool ไปเลยก็บังคับได้",
                en: "A model that 'sometimes does not call the tool' is fixed by a parameter, not a firmer instruction — naming the tool forces it" },
        data: "tool_choice = {\"type\": \"tool\", \"name\": \"extract\"}",
        vars: [
          { n: "auto | any | named | none", d: { th: "`auto` เหมาะกับ agent, ไม่เหมาะกับขั้นตอนใน pipeline", en: "`auto` suits an agent, not a pipeline step" } } ] },
      { fn: "prompt_structure()", file: "prompt.py", depth: 1,
        note: { th: "โมเดลไม่เห็นเครื่องหมายคำพูดของเรา — คั่นด้วยแท็กให้ชัด แล้ววาง **คำสั่งไว้ต้น** (cache ดี) และข้อมูลที่เปลี่ยนไว้ท้าย",
                en: "The model cannot see your quotes — delimit with tags, put the **durable instructions first** (they cache well) and the variable data last" },
        data: "<instructions>...</instructions>\n<document>{{ user_text }}</document>",
        vars: [
          { n: "injection", d: { th: "'ignore previous instructions' ไปโผล่ *ข้างใน* `<document>` อย่างเห็นได้ชัด", en: "'ignore previous instructions' now sits visibly *inside* `<document>`" } } ] },
      { fn: "positive_instructions()", file: "prompt.py", depth: 1,
        note: { th: "สั่งเชิงบวกเสมอ: **'ตอบเป็น JSON เท่านั้น' ได้ผลกว่า 'ห้ามอธิบายเพิ่ม'** เพราะประโยคปฏิเสธคือการบรรยายสิ่งที่ห้ามอย่างละเอียด ซึ่งทำให้มันยังอยู่ใน context",
                en: "State the rule positively: **'reply with JSON only' outperforms 'do not add explanations'**, because a negation describes the forbidden output in detail and keeps it present in context" },
        data: "\"Reply with JSON only.\"   (ไม่ใช่ \"Do not add explanations\")",
        vars: [
          { n: "few-shot", d: { th: "2-3 ตัวอย่างในรูปแบบเป้าหมายชนะย่อหน้าที่อธิบายรูปแบบ", en: "two or three examples in the target shape beat a paragraph describing it" } } ] },
      { fn: "sampling()", file: "call.py", depth: 1,
        note: { th: "ปรับ **ทีละตัว** — ลดทั้ง temperature และ top_p พร้อมกันจะกลายเป็น greedy จนวนซ้ำ. และ **temperature 0 ไม่ใช่ determinism**: batching, float non-associativity บน GPU, MoE routing และเวอร์ชันโมเดลทำให้ผลเปลี่ยนได้",
                en: "Tune **one knob** — lowering temperature and top_p together compounds into near-greedy looping. And **temperature 0 is not determinism**: batching, GPU float non-associativity, MoE routing and model updates all move the output" },
        data: "temperature=0 (extraction)  |  0.7-1.0 (drafting)",
        vars: [
          { n: "reproducibility", d: { th: "ถ้าต้องการซ้ำได้จริง ให้ cache คำตอบ + pin เวอร์ชันโมเดล", en: "if you need reproducibility, cache the response and pin the model version" }, w: true } ] },
      { fn: "retry_and_repair()", file: "call.py", depth: 0,
        note: { th: "validation เป็นส่วนหนึ่งของการเรียก ไม่ใช่ของแถม — ป้อน **ข้อความ error ของ validator** กลับไป (ไม่ใช่ 'ผิดนะ') แล้วซ่อม **รอบเดียว** ถ้ายังไม่ผ่านให้ fallback",
                en: "Validation is part of the call, not an afterthought — feed back the **validator's own message** (not 'that was wrong') and repair **once**, then fall back" },
        data: "ValidationError: code must be one of [A,B,C]\n-> retry 1 ครั้ง -> ผ่าน",
        vars: [
          { n: "repair_rate", d: { th: "นับเป็น metric — อัตราที่สูงขึ้นคือสัญญาณว่า prompt, schema หรือเวอร์ชันโมเดลเพี้ยนไปแล้ว", en: "track it as a metric: a rising rate is an early signal that a prompt, schema or model version has drifted" }, w: true } ] }
    ]
  }
});
