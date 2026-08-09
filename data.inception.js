/* Inception — docker-compose stack: NGINX(TLS) + WordPress/php-fpm + MariaDB */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

window.TEACHING_DATA.push({
  id: "inception",
  name: "Inception",
  tag: {
    th: "ประกอบ stack ด้วย docker-compose จาก image ที่เขียน Dockerfile เอง 3 ตัว — NGINX เป็นทางเข้าเดียวบน 443 (TLS 1.2/1.3), WordPress + php-fpm ที่ไม่มี web server, MariaDB; volume ผูกกับ /home/<login>/data และรหัสผ่านทุกตัวอยู่ใน Docker secrets",
    en: "A docker-compose stack of three hand-written images — NGINX as the only entrypoint on 443 (TLS 1.2/1.3), WordPress with php-fpm and no web server, and MariaDB; named volumes pinned to /home/<login>/data and every password in Docker secrets"
  },
  accent: "#38bdf8",
  sections: {
    principle: [
      { h: "โจทย์คืออะไร" },
      { p: "Inception เป็น **โปรเจกต์ system administration** ไม่ใช่โปรเจกต์เขียนโปรแกรม — ไม่มี norminette ไม่มี valgrind ไม่มีรายการฟังก์ชันที่อนุญาต. สิ่งที่ต้องทำคือประกอบ **stack เว็บที่ทำงานได้จริง** ด้วย `docker-compose` โดย **เขียน Dockerfile เองทุกใบ**" },
      { code: String.raw`                 https://login.42.fr  (พอร์ต 443 พอร์ตเดียวที่เปิด)
                          |
                    +-----v------+   TLS 1.2/1.3 เท่านั้น
                    |   NGINX    |   ไม่มี PHP ในตัว
                    +-----+------+
                          | fastcgi_pass wordpress:9000
                    +-----v------+
                    | WordPress  |   php-fpm อย่างเดียว ไม่มี web server
                    |  php-fpm   |   volume: wp_data -> /var/www/html
                    +-----+------+
                          | TCP 3306 บน network ภายใน
                    +-----v------+
                    |  MariaDB   |   volume: db_data -> /var/lib/mysql
                    +------------+`,
        cap: "3 container 3 หน้าที่ — คุยกันผ่าน bridge network ที่สร้างเอง ไม่มีใครเปิดพอร์ตออกนอกนอกจาก NGINX", lang: "txt" },
      { h: "กฎที่ถูกตรวจจริง" },
      { table: { head: ["กฎ", "ทำให้ผ่านยังไง"], rows: [
        ["1 service ต่อ 1 container สร้างจาก Dockerfile ของตัวเอง", "`FROM debian:bookworm` (penultimate stable — ปัจจุบัน stable คือ trixie/13) หรือ Alpine รุ่นรองสุดท้าย"],
        ["ห้ามใช้ image สำเร็จรูปของแอป", "ติดตั้ง `mariadb-server`, `php8.2-fpm`, `nginx` เองด้วย `apt`; ดึง WordPress ด้วย `wp-cli`"],
        ["ห้ามใช้ tag `latest`", "ตั้ง tag เป็น `service:1.0` และชื่อ image ต้องเท่ากับชื่อ service"],
        ["ห้ามใช้ hack เลี้ยง container ให้ไม่ตาย", "entrypoint จบด้วย `exec \"$@\"`; ห้าม `tail -f`, `sleep infinity`, `while true`, ห้าม daemonize"],
        ["NGINX เป็นทางเข้าเดียว", "ทั้งไฟล์ compose มี `ports:` แค่รายการเดียวคือ `\"443:443\"` และ TLS 1.2/1.3 เท่านั้น"],
        ["ใช้ named volume ไม่ใช่ bind mount ใต้ `/home/<login>/data`", "driver `local` พร้อม `type: none, o: bind, device: ...` — ยังเป็น `Type: volume` ใน `docker inspect`"],
        ["ต้องมีส่วน `networks:` ห้าม `network_mode: host` หรือ `links:`", "bridge ที่ผู้ใช้สร้างเองหนึ่งอัน"],
        ["`restart: always` ทุก service", ""],
        ["ห้ามมีรหัสผ่านใน Dockerfile, ใน compose, ใน `.env` หรือใน git", "`.env` เก็บเฉพาะค่าที่ไม่ลับ; รหัสผ่านอยู่ใน `secrets/*.txt` → `/run/secrets/<name>`"],
        ["ผู้ใช้ WordPress 2 คน และชื่อ admin ห้ามมีคำว่า admin/administrator", "เช่น `wiaonin` (administrator) + `guest` (author)"],
        ["`login.42.fr` ต้อง resolve ได้ในเครื่อง", "แก้ `/etc/hosts`"]
      ]}},
      { h: "โครงไฟล์ที่ผู้ตรวจคาดว่าจะเห็น" },
      { code: String.raw`Makefile  README.md  USER_DOC.md  DEV_DOC.md  .gitignore
secrets/{credentials,db_password,db_root_password}.txt
srcs/{.env,docker-compose.yml}
srcs/requirements/{mariadb,nginx,wordpress}/{Dockerfile,.dockerignore,conf/,tools/entrypoint.sh}
srcs/requirements/bonus/<service>/...`,
        cap: "secrets/ อยู่นอก srcs/ และต้องอยู่ใน .gitignore", lang: "txt" },
      { h: "ทำไมโปรเจกต์นี้หลอก" },
      { ul: [
        "**มันดูเหมือนทำงานได้ทั้งที่พังอยู่** — WordPress ขึ้นหน้าเว็บได้แต่ต่อ DB ไม่ติด, healthcheck เขียวทั้งที่ login ไม่ผ่าน",
        "**กับดักส่วนใหญ่ไม่มีอยู่ใน subject** — 7 ข้อในหมวดถัดไปแต่ละข้อกินเวลาเป็นชั่วโมง",
        "**ข้อความ error ชี้ผิดทาง** — 'Error establishing a database connection' เกิดได้จาก 5 สาเหตุที่ต่างกันสิ้นเชิง",
        "**การเทสต์ที่ 'ชัดเจน' บางอย่างผิด** — `docker kill` ไม่ trigger `restart: always`"
      ]}
    ],

    theory: [
      { p: "หมวดนี้คือแนวคิด Docker ที่ต้องเข้าใจจริง ไม่ใช่แค่ copy คำสั่งมาวาง — ผู้ตรวจถามทุกข้อ" },
      { h: "1) Image ≠ Container" },
      { table: { head: ["", "Image", "Container"], rows: [
        ["คืออะไร", "แม่แบบแบบอ่านอย่างเดียว (ชั้น ๆ ซ้อนกัน)", "อินสแตนซ์ที่กำลังรัน + ชั้นเขียนได้ 1 ชั้น"],
        ["เกิดจาก", "`docker build` จาก Dockerfile", "`docker run` จาก image"],
        ["ข้อมูลอยู่ได้นานแค่ไหน", "ถาวรจนกว่าจะลบ image", "หายเมื่อลบ container **เว้นแต่อยู่ใน volume**"],
        ["จำนวน", "1 image สร้างได้หลาย container", "1 container มาจาก 1 image"]
      ]}},
      { h: "2) Layer และ cache" },
      { p: "ทุกคำสั่ง `RUN`/`COPY`/`ADD` สร้าง **ชั้น** ใหม่. Docker cache ชั้นไว้ ถ้าชั้นบนไม่เปลี่ยน ชั้นล่างก็ไม่ต้อง build ใหม่ — จึงควรใส่สิ่งที่เปลี่ยนบ่อย (เช่น `COPY conf/`) **ไว้ท้าย ๆ** และสิ่งที่เปลี่ยนน้อย (เช่น `apt-get install`) ไว้ต้น" },
      { code: String.raw`RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx \
    && rm -rf /var/lib/apt/lists/*`,
        cap: "รวมเป็น RUN เดียวและลบ apt list ในชั้นเดียวกัน — ถ้าแยกชั้น ไฟล์ที่ลบยังกินพื้นที่อยู่ในชั้นก่อนหน้า", lang: "dockerfile" },
      { h: "3) ENTRYPOINT กับ CMD ต่างกันยังไง" },
      { code: String.raw`ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["mariadbd", "--user=mysql"]

# ตอนรัน docker จะทำ:  entrypoint.sh  mariadbd --user=mysql
# ในสคริปต์ปิดท้ายด้วย:  exec "$@"     -> mariadbd แทนที่ shell กลายเป็น PID 1`,
        cap: "ENTRYPOINT = โปรแกรมที่รันแน่ ๆ, CMD = argument เริ่มต้นที่ override ได้", lang: "dockerfile" },
      { h: "4) ทำไม PID 1 ถึงสำคัญ" },
      { p: "process แรกใน container คือ PID 1 ซึ่งเป็นตัวรับสัญญาณจาก Docker (`SIGTERM` ตอน `docker stop`). ถ้า PID 1 เป็น shell ที่ `sleep` อยู่ daemon จริงจะไม่ได้รับสัญญาณ → ปิดไม่สวย ข้อมูลอาจเสียหาย และ `docker stop` จะรอครบ 10 วินาทีทุกครั้งก่อน SIGKILL" },
      { p: "`exec \"$@\"` **แทนที่** โปรเซส shell ด้วย daemon ทำให้ daemon เป็น PID 1 เอง — ผู้ตรวจตรวจข้อนี้ด้วย `cat /proc/1/comm`" },
      { note: "และนี่คือเหตุผลที่ `tail -f /dev/null`, `sleep infinity`, `while true` ถูกห้าม — มันคือการเลี้ยง container ให้ไม่ตายโดยที่ daemon จริงไม่ได้เป็นเจ้าของ process" },
      { h: "5) Volume เทียบกับ bind mount" },
      { table: { head: ["", "named volume", "bind mount"], rows: [
        ["Docker จัดการให้", "ใช่", "ไม่ (ชี้ path ในเครื่องตรง ๆ)"],
        ["`docker inspect` แสดง Type", "`volume`", "`bind`"],
        ["subject บังคับ", "**ใช่**", "ห้าม"],
        ["แต่ต้องอยู่ที่", "`/home/<login>/data/...`", ""]
      ]}},
      { code: String.raw`volumes:
  db_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: ` + "${" + String.raw`DATA_PATH}/mariadb`,
        cap: "ทริค: named volume ที่ใช้ driver_opts แบบนี้ยังเป็น Type: volume แต่ข้อมูลไปโผล่ที่ path ที่กำหนด", lang: "yaml" },
      { h: "6) Network ของ Docker" },
      { p: "`networks:` สร้าง **bridge ของผู้ใช้เอง** ซึ่งให้ **DNS ภายในตามชื่อ service** — `wordpress` ต่อไปยัง `mariadb:3306` ได้โดยไม่ต้องรู้ IP. ต่างจาก `links:` (เลิกใช้แล้ว) และจาก `network_mode: host` (ไม่มีการแยก network เลย ซึ่ง subject ห้าม)" },
      { h: "7) Secrets เทียบกับ environment variable" },
      { table: { head: ["", "`.env` / `environment:`", "`secrets:`"], rows: [
        ["ไปโผล่ที่", "ตัวแปรสภาพแวดล้อมของ process", "ไฟล์ใน `/run/secrets/<name>` (tmpfs)"],
        ["เห็นได้จาก", "`docker inspect`, `/proc/1/environ`, `docker history`", "ต้องเข้าไปอ่านไฟล์ในคอนเทนเนอร์"],
        ["ใช้เก็บ", "ค่าคอนฟิกที่ไม่ลับ (ชื่อ DB, ชื่อโดเมน)", "**รหัสผ่านทุกตัว**"]
      ]}},
      { h: "8) php-fpm กับ FastCGI" },
      { p: "WordPress เป็น PHP — แต่ container ของมัน **ห้ามมี web server**. `php-fpm` คือ process manager ที่ฟัง **FastCGI** บนพอร์ต 9000 แล้ว NGINX เป็นคนรับ HTTP แล้วแปลงเป็น FastCGI ส่งต่อ" },
      { code: String.raw`location ~ \.php$ {
    include        fastcgi_params;
    fastcgi_pass   wordpress:9000;
    fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_param  HTTPS on;
}`, cap: "NGINX พูด HTTP กับเบราว์เซอร์ และพูด FastCGI กับ php-fpm", lang: "nginx" },
      { h: "9) TLS และ certificate ที่เซ็นเอง" },
      { p: "subject บังคับ **TLS 1.2 หรือ 1.3 เท่านั้น** และให้ใช้ certificate ที่เซ็นเอง (self-signed) เบราว์เซอร์จะเตือน — นั่นถูกต้องแล้ว เพราะไม่มี CA รับรอง" },
      { code: String.raw`ssl_protocols TLSv1.2 TLSv1.3;
ssl_certificate     /etc/nginx/ssl/inception.crt;
ssl_certificate_key /etc/nginx/ssl/inception.key;`,
        cap: "สร้าง cert ใน entrypoint ไม่ใช่ใน Dockerfile — CN จะได้ตามค่า DOMAIN_NAME และ private key ไม่ถูกอบเข้าไปในชั้น image", lang: "nginx" }
    ],

    foundations: [
      { p: "**7 กับดัก** ที่กินเวลาข้อละหลายชั่วโมงและ **ไม่มีอยู่ใน subject เลย** ทุกข้อสร้าง stack ที่ 'ดูเหมือนถูก' แต่พังเงียบ ๆ" },
      { h: "กับดัก 1 — `mariadbd --bootstrap` อ่านทีละ 'บรรทัด'" },
      { p: "โหมด bootstrap **ไม่ใช่ SQL parser** — มันส่งข้อความ **ทีละบรรทัด** ให้ server เป็นคำสั่ง. คำสั่งที่ตัดขึ้นบรรทัดใหม่จะกลายเป็น 2 query ที่พัง และ error แรกทำให้ที่เหลือถูกยกเลิกหมด สุดท้ายได้รหัส root ที่ตั้งแล้วแต่ **ไม่มีฐานข้อมูลและไม่มี user ของแอป**" },
      { code: String.raw`# ผิด - กลายเป็น 2 query, ตัวที่สอง syntax error, ทุกอย่างหลังจากนั้นหายหมด
CREATE DATABASE IF NOT EXISTS ` + "`wordpress`" + String.raw`
    CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

# ถูก - หนึ่งบรรทัดจบในตัวเอง
CREATE DATABASE IF NOT EXISTS ` + "`wordpress`" + String.raw` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`,
        cap: "อาการ: WordPress ขึ้น Host '172.x.x.x' is not allowed to connect (error 1130) — เพราะ user นั้นไม่เคยถูกสร้าง", lang: "sh" },
      { h: "กับดัก 2 — แพ็กเกจ Debian เตรียม `/var/lib/mysql` ไว้แล้ว และ Docker ก๊อปมันเข้า volume ว่างของเรา" },
      { p: "`apt-get install mariadb-server` รัน `mysql_install_db` ตั้งแต่ตอน **build**. พอ Docker เอา volume **ว่าง** ไป mount ทับไดเรกทอรีใน image ที่ **ไม่ว่าง** มันจะ **ก๊อปเนื้อหาของ image เข้าไปใน volume**. volume จึงมี `mysql/` datadir มาตั้งแต่แรก แล้วเงื่อนไข `if [ ! -d /var/lib/mysql/mysql ]` ในเราก็เห็นว่ามีแล้ว → **bootstrap ไม่เคยรันเลยตั้งแต่บูตแรก ตลอดไป**" },
      { code: String.raw`RUN rm -rf /var/lib/mysql/* \
    && mkdir -p /run/mysqld /var/lib/mysql \
    && chown -R mysql:mysql /run/mysqld /var/lib/mysql`,
        cap: "แยกจากกับดัก 1 ด้วย log: บอกว่า 'existing datadir found' บน volume ที่เพิ่งสร้าง = image ปนเปื้อน", lang: "dockerfile" },
      { h: "กับดัก 3 — `mariadb-admin ping` คืน success แม้ authentication พัง" },
      { p: "`ping` พิสูจน์แค่ว่า server ตอบ socket — คำตอบแบบ access denied ก็ยัง exit 0 ในหลายเวอร์ชัน. healthcheck ที่สร้างบนมันจึง **เขียวทั้งที่ไม่มีใคร login ได้** แล้ว `depends_on: service_healthy` ก็ปล่อย WordPress ออกวิ่งไปหาฐานข้อมูลที่ใช้ไม่ได้" },
      { code: String.raw`test: ["CMD-SHELL", "mariadb -h localhost -u root -p\"$$(tr -d '\\r\\n' < /run/secrets/db_root_password)\" -e 'SELECT 1' >/dev/null 2>&1"]`,
        cap: "ใช้ query ที่ต้องใช้ credential จริง — และ wait-loop ใน entrypoint ของ WordPress ก็ต้องใช้ SELECT 1 เหมือนกัน ไม่ใช่ ping", lang: "yaml" },
      { h: "กับดัก 4 — CR ท้ายไฟล์ secret ทำให้รหัสผ่านเพี้ยน" },
      { p: "สาเหตุประจำคือสร้าง secret บน Windows (Git Bash, MSYS): `openssl` ออก CRLF แล้ว `tr -d '\\n'` ทิ้งไว้แต่ `\\r`. MariaDB จึงเก็บ `hunter2\\r` ขณะที่ `wp-config.php` ได้ `hunter2\\n` แล้ว login พังทุกครั้งด้วย error 1045 — **โดยที่พิมพ์ออกมาดูเหมือนกันเป๊ะ**" },
      { code: String.raw`# ตอนสร้าง
openssl rand -base64 24 | tr -d '\r\n' > secrets/db_password.txt
# ตอนอ่าน ในทุก entrypoint
DB_PASSWORD="$(tr -d '\r\n' < /run/secrets/db_password)"`,
        cap: "ตัดทั้งขาเข้าและขาออก เผื่อไฟล์ที่แก้ด้วยมือ; วินิจฉัยด้วย od -c ไม่ใช่ cat", lang: "sh" },
      { h: "กับดัก 5 — WordPress ไม่รู้ว่าตัวเองอยู่หลัง TLS และ NGINX ต้องเพิ่ม buffer" },
      { code: String.raw`# ถ้าไม่มีบรรทัดนี้ is_ssl() เป็น false แล้ว /wp-admin/ จะ redirect วนไม่จบ
fastcgi_param HTTPS on;

# WordPress สะท้อน request URI กลับมาใน header ของ redirect
# URI ยาว ๆ จึงล้น buffer 4k -> "upstream sent too big header" -> 502
fastcgi_buffer_size       16k;
fastcgi_buffers         8 16k;
fastcgi_busy_buffers_size 32k;`,
        cap: "สองบั๊กคนละเรื่อง แต่แก้ที่ location ~ \\.php$ เดียวกัน", lang: "nginx" },
      { h: "กับดัก 6 — `docker kill` **ไม่** trigger `restart: always`" },
      { p: "daemon ถือว่าการ stop **หรือ kill ด้วยมือ** คือความตั้งใจ จึงเมิน restart policy จนกว่าจะสั่ง start เอง. เทสต์ที่ดู 'ชัดเจน' อย่าง 'kill แล้วดูมันฟื้น' จึงล้มบน stack ที่ถูกต้องสมบูรณ์ — แล้วนักศึกษาก็ไป 'แก้' policy ที่ไม่เคยพัง" },
      { p: "`kill -9 1` จากข้างในก็ไม่ได้ เพราะ kernel ไม่ยอมส่ง SIGKILL ให้ PID 1 ของ namespace. ให้ส่งสัญญาณที่มันจัดการเองได้ ซึ่งพิสูจน์ไปพร้อมกันว่า daemon เป็น PID 1 จริง:" },
      { code: String.raw`before=$(docker inspect -f '{{.RestartCount}}' nginx)
docker exec nginx sh -c 'kill -TERM 1'
sleep 10
[ "$(docker inspect -f '{{.RestartCount}}' nginx)" -gt "$before" ]`,
        cap: "RestartCount เพิ่มขึ้น = policy ทำงานจริง และ PID 1 คือ daemon จริง", lang: "bash" },
      { h: "กับดัก 7 — ภายใน container ตัวแปร `MYSQL_HOST` แย่ง client ของ MariaDB ไป" },
      { p: "`env_file: .env` แจก `MYSQL_HOST=mariadb` ให้ทุก container และ CLI ชื่อ `mariadb` **อ่านตัวแปรนี้เป็น host เริ่มต้น**. คำสั่งที่เราคิดว่าจะวิ่งผ่าน unix socket ในฐานะ `root@localhost` จึงวิ่งผ่าน TCP แทนแล้วถูกปฏิเสธ" },
      { p: "**ใส่ `-h localhost` ให้ชัดทุกครั้งที่รัน client อยู่ ข้างใน container ของ mariadb** (healthcheck, เทสต์, debug ด้วยมือ)" },
      { h: "ตารางแปลอาการ → สาเหตุ" },
      { table: { head: ["อาการ", "สาเหตุที่พบบ่อยที่สุด"], rows: [
        ["`Host '172.x' is not allowed to connect` (1130)", "user ไม่ถูกสร้าง — กับดัก 1 หรือ 2"],
        ["`Access denied for user` (1045)", "รหัสผ่านมี CR ปน — กับดัก 4"],
        ["`Error establishing a database connection`", "DB ยังไม่พร้อม / healthcheck โกหก — กับดัก 3"],
        ["WordPress วนลูป 'waiting for mariadb'", "wait-loop ใช้ ping แทน SELECT 1 — กับดัก 3"],
        ["`/wp-admin/` redirect วนไม่จบ", "ขาด `fastcgi_param HTTPS on` — กับดัก 5"],
        ["URL ยาวแล้วได้ 502", "fastcgi buffer เล็กเกิน — กับดัก 5"],
        ["`existing datadir found` บน volume ใหม่เอี่ยม", "image ปนเปื้อน — กับดัก 2"],
        ["`docker kill` แล้วไม่ฟื้น", "ไม่ใช่บั๊ก — กับดัก 6"],
        ["`mariadb -u root` ข้างใน container ถูกปฏิเสธ", "`MYSQL_HOST` แย่งไป — กับดัก 7"]
      ]}}
    ],

    architecture: [
      { p: "หน้าตาของไฟล์จริงที่ประกอบกันเป็น stack — ทุกไฟล์มีเหตุผลว่าทำไมต้องเขียนแบบนั้น" },
      { h: "docker-compose.yml — โครงหลัก" },
      { code: String.raw`services:
  mariadb:
    build: { context: ./requirements/mariadb, dockerfile: Dockerfile }
    image: mariadb:1.0             # ชื่อ image = ชื่อ service, ไม่ใช้ latest
    container_name: mariadb
    env_file: .env
    secrets: [db_root_password, db_password]
    volumes: [db_data:/var/lib/mysql]
    networks: [inception]
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "mariadb -h localhost -u root -p\"$$(tr -d '\\r\\n' < /run/secrets/db_root_password)\" -e 'SELECT 1' >/dev/null 2>&1"]
      interval: 5s
      timeout: 5s
      retries: 12
      start_period: 20s

  wordpress:
    build: { context: ./requirements/wordpress, dockerfile: Dockerfile }
    image: wordpress:1.0
    env_file: .env
    secrets: [db_password, credentials]
    volumes: [wp_data:/var/www/html]
    networks: [inception]
    depends_on:
      mariadb: { condition: service_healthy }
    restart: always

  nginx:
    build: { context: ./requirements/nginx, dockerfile: Dockerfile }
    image: nginx:1.0
    env_file: .env
    ports: ["443:443"]             # <- รายการ ports เดียวในทั้งไฟล์
    volumes: [wp_data:/var/www/html]
    networks: [inception]
    depends_on: [wordpress]
    restart: always`,
        cap: "nginx แชร์ volume wp_data กับ wordpress เพราะมันต้องเสิร์ฟไฟล์ static ของ WordPress เอง", lang: "yaml" },
      { h: "ส่วนท้ายของ compose: volumes, networks, secrets" },
      { code: String.raw`volumes:
  db_data:
    driver: local
    driver_opts: { type: none, o: bind, device: ` + "${" + String.raw`DATA_PATH}/mariadb` + String.raw` }
  wp_data:
    driver: local
    driver_opts: { type: none, o: bind, device: ` + "${" + String.raw`DATA_PATH}/wordpress` + String.raw` }

networks:
  inception:
    driver: bridge

secrets:
  db_root_password: { file: ../secrets/db_root_password.txt }
  db_password:      { file: ../secrets/db_password.txt }
  credentials:      { file: ../secrets/credentials.txt }`,
        cap: "DATA_PATH มาจาก .env และควรชี้ไปที่ /home/<login>/data", lang: "yaml" },
      { h: "แบ่งงานว่าอะไรอยู่ที่ไหน" },
      { table: { head: ["ที่อยู่", "เก็บอะไร", "ห้ามเก็บอะไร"], rows: [
        ["`.env`", "ชื่อโดเมน, ชื่อ DB, ชื่อ user, DATA_PATH, ชื่อเว็บ", "**รหัสผ่านทุกชนิด**"],
        ["`secrets/*.txt`", "รหัสผ่านล้วน ๆ บรรทัดเดียว ไม่มี CR", "อะไรก็ตามที่ commit ลง git"],
        ["`Dockerfile`", "ติดตั้งซอฟต์แวร์, คัดลอก conf, ตั้ง ENTRYPOINT/CMD", "รหัสผ่าน, cert, `latest`"],
        ["`conf/`", "ไฟล์คอนฟิกของ daemon", "ค่าที่ต้องเปลี่ยนตามสภาพแวดล้อม"],
        ["`tools/entrypoint.sh`", "การตั้งค่าครั้งแรก, อ่าน secret, สร้าง cert แล้ว `exec \"$@\"`", "การรอแบบวนลูปไม่รู้จบโดยไม่มี timeout"]
      ]}},
      { h: "รูปแบบมาตรฐานของ entrypoint" },
      { code: String.raw`#!/bin/sh
set -eu
SECRET="$(tr -d '\r\n' < /run/secrets/db_password)"

if [ ! -d /var/lib/mysql/mysql ]; then      # หรือ: [ ! -f wp-config.php ]
	... การตั้งค่าครั้งเดียวตอนบูตแรก ...
else
	echo "[service] existing state found, skipping initialisation"
fi

exec "$@"                                    # CMD กลายเป็น PID 1`,
        cap: "3 จังหวะเหมือนกันทุก service: อ่าน secret → init ถ้า volume ว่าง → ส่งไม้ต่อให้ daemon", lang: "sh" },
      { h: "CMD ของแต่ละ service" },
      { table: { head: ["Service", "CMD", "ทำไมต้องแบบนี้"], rows: [
        ["mariadb", "`[\"mariadbd\", \"--user=mysql\"]`", "รัน foreground ในฐานะ PID 1"],
        ["wordpress", "`[\"php-fpm8.2\", \"-F\"]`", "`-F` = อยู่เบื้องหน้า ไม่ daemonize"],
        ["nginx", "`[\"nginx\", \"-g\", \"daemon off;\"]`", "`daemon off` = ไม่แยกตัวไปเบื้องหลัง"]
      ]}},
      { note: "ทั้งสามตัวคือคำตอบของกฎ 'ห้ามใช้ hack เลี้ยง container' — daemon เป็นเจ้าของ process เอง เราไม่ได้หลอกให้มันไม่ตาย" },
      { h: "certificate ควรสร้างที่ entrypoint ไม่ใช่ Dockerfile" },
      { p: "**เหตุผล 2 ข้อ**: (1) CN จะได้ตาม `DOMAIN_NAME` ใน `.env` ทำให้เปลี่ยนโดเมนได้โดยไม่ต้อง build ใหม่ (2) **private key จะไม่ถูกอบเข้าไปในชั้นของ image** ที่อาจถูก push ขึ้นไปที่ไหนสักแห่ง" }
    ],

    dataflow: [
      { p: "ตามการเดินทางของ request หนึ่งใบ แล้วตามด้วยลำดับการบูตครั้งแรก" },
      { h: "request หนึ่งใบเดินทางยังไง" },
      { code: String.raw`เบราว์เซอร์  https://login.42.fr/wp-admin/
   |  TLS handshake (1.2/1.3 เท่านั้น) กับ cert ที่เซ็นเอง
   v
NGINX  :443
   |  ไฟล์ static (.css .js .png)  -> อ่านจาก /var/www/html โดยตรง (volume ร่วม)
   |  ไฟล์ .php                     -> แปลงเป็น FastCGI
   v  fastcgi_pass wordpress:9000        (DNS ของ bridge แปลงชื่อให้)
php-fpm  :9000
   |  รัน PHP ของ WordPress
   |  อ่าน wp-config.php ที่มี DB_HOST=mariadb และรหัสผ่าน
   v  TCP 3306
MariaDB
   |  ตอบผลลัพธ์ query
   v
php-fpm ประกอบ HTML  ->  NGINX  ->  เบราว์เซอร์`,
        cap: "สังเกตว่า NGINX เสิร์ฟ static เองได้เพราะ mount volume เดียวกับ WordPress", lang: "txt" },
      { h: "ลำดับการบูตครั้งแรก (volume ว่างเปล่า)" },
      { code: String.raw`docker compose up -d
 |
 +-> mariadb ขึ้นก่อน
 |     entrypoint: อ่าน secret (ตัด \r\n)
 |     /var/lib/mysql/mysql ไม่มี -> รัน bootstrap
 |         SET PASSWORD FOR 'root'@'localhost' = PASSWORD('...');
 |         CREATE DATABASE IF NOT EXISTS `+"`wordpress`"+String.raw` ...;      <- ทุกคำสั่ง 1 บรรทัด
 |         CREATE USER IF NOT EXISTS 'wpuser'@'%' IDENTIFIED BY '...';
 |         GRANT ALL ON `+"`wordpress`"+String.raw`.* TO 'wpuser'@'%';
 |         FLUSH PRIVILEGES;
 |     exec mariadbd --user=mysql
 |     healthcheck: SELECT 1 ด้วย credential จริง -> healthy
 |
 +-> wordpress รอจนกว่า mariadb จะ healthy (depends_on)
 |     entrypoint: ไม่มี wp-config.php -> ติดตั้งครั้งแรก
 |         wp core download
 |         wp config create --dbhost=mariadb ...
 |         รอ SELECT 1 ผ่านจริง (ไม่ใช่ ping)
 |         wp core install --admin_user=<ไม่มีคำว่า admin>
 |         wp user create guest ... --role=author
 |     exec php-fpm8.2 -F
 |
 +-> nginx ขึ้นท้ายสุด
       entrypoint: ไม่มี cert -> openssl req สร้าง self-signed ตาม DOMAIN_NAME
       exec nginx -g 'daemon off;'`,
        cap: "บูตครั้งที่สองทุกอย่างเจอ state เดิม พิมพ์ 'existing ... found' แล้วข้ามไป exec ทันที", lang: "txt" },
      { h: "ทำไมต้อง `depends_on: service_healthy` ไม่ใช่แค่ `depends_on`" },
      { p: "`depends_on` เปล่า ๆ รอแค่ **container เริ่มทำงาน** ไม่ได้รอให้ **บริการพร้อมใช้** — MariaDB ใช้เวลาอีกหลายวินาทีกว่าจะรับ connection ได้จริง. `condition: service_healthy` ผูกกับ healthcheck ทำให้ WordPress ไม่วิ่งไปชนฐานข้อมูลที่ยังไม่ตื่น" },
      { note: "แต่ **healthcheck ที่โกหกอันตรายกว่าไม่มี healthcheck** — ถ้าใช้ `ping` มันจะเขียวทั้งที่ auth พัง แล้ว WordPress ก็ยังพังเหมือนเดิมแต่หาสาเหตุยากขึ้น (กับดัก 3)" },
      { h: "ข้อมูลอยู่รอดได้ยังไงเมื่อ down แล้ว up" },
      { code: String.raw`docker compose down          # ลบ container ทิ้ง ไม่แตะ volume
docker compose up -d         # container ใหม่ mount volume เดิม
                             # entrypoint เห็น state เดิม -> ข้าม init
                             # โพสต์ที่เขียนไว้ยังอยู่ครบ

docker compose down -v       # <- อันนี้ลบ volume ด้วย ข้อมูลหายหมด`,
        cap: "เทสต์ persistence ที่ผู้ตรวจชอบ: สร้างโพสต์ -> down -> up -> โพสต์ยังอยู่และ log บอกว่า 'existing ... found'", lang: "bash" },
      { h: "การไหลของ secret" },
      { code: String.raw`secrets/db_password.txt   (บนเครื่อง โดน .gitignore)
      |  compose ประกาศเป็น secret
      v
/run/secrets/db_password   (tmpfs ในคอนเทนเนอร์ อ่านอย่างเดียว)
      |  entrypoint:  tr -d '\r\n' < /run/secrets/db_password
      v
ตัวแปรในสคริปต์ -> ส่งให้ wp config create / คำสั่ง SQL
      |
      x  ห้ามไปโผล่ใน  docker inspect / docker history / /proc/1/environ`,
        cap: "นี่คือเหตุผลที่ password ต้องไม่อยู่ใน .env — .env ไปโผล่ใน environment ของ process", lang: "txt" }
    ],

    implementation: [
      { p: "ไฟล์จริงทั้งชุด เขียนแบบที่หลบกับดักทั้ง 7 ข้อไว้แล้ว" },
      { h: "1) Dockerfile ของ MariaDB" },
      { code: String.raw`# Debian รุ่นรองสุดท้าย (stable ปัจจุบันคือ trixie/13 -> ใช้ bookworm/12)
FROM debian:bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends mariadb-server mariadb-client \
    && rm -rf /var/lib/apt/lists/*

COPY conf/50-server.cnf /etc/mysql/mariadb.conf.d/50-server.cnf
COPY tools/entrypoint.sh /usr/local/bin/entrypoint.sh

# แพ็กเกจ Debian init /var/lib/mysql ไว้แล้วตอน build ถ้าไม่ลบ Docker จะก๊อป
# ทั้งหมดเข้า volume ว่าง แล้ว entrypoint จะคิดว่ามี state เดิมและข้าม bootstrap
RUN chmod +x /usr/local/bin/entrypoint.sh \
    && rm -rf /var/lib/mysql/* \
    && mkdir -p /run/mysqld /var/lib/mysql \
    && chown -R mysql:mysql /run/mysqld /var/lib/mysql

EXPOSE 3306
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["mariadbd", "--user=mysql"]`,
        cap: "comment ที่อธิบาย 'ทำไม' คือสิ่งที่ผู้ตรวจอยากเห็น ไม่ใช่แค่คำสั่งที่ถูก", lang: "dockerfile" },
      { h: "2) entrypoint ของ MariaDB" },
      { code: String.raw`#!/bin/sh
set -eu
ROOT_PW="$(tr -d '\r\n' < /run/secrets/db_root_password)"
USER_PW="$(tr -d '\r\n' < /run/secrets/db_password)"

if [ ! -d /var/lib/mysql/mysql ]; then
	echo "[mariadb] empty datadir, bootstrapping"
	mysql_install_db --user=mysql --datadir=/var/lib/mysql --skip-test-db >/dev/null

	# --bootstrap ส่งทีละบรรทัดให้ server: ทุกคำสั่งต้องจบในบรรทัดเดียว
	mariadbd --user=mysql --bootstrap <<-EOSQL
		USE mysql;
		FLUSH PRIVILEGES;
		ALTER USER 'root'@'localhost' IDENTIFIED BY '$ROOT_PW';
		CREATE DATABASE IF NOT EXISTS ` + "`" + String.raw`$MYSQL_DATABASE` + "`" + String.raw` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
		CREATE USER IF NOT EXISTS '$MYSQL_USER'@'%' IDENTIFIED BY '$USER_PW';
		GRANT ALL PRIVILEGES ON ` + "`" + String.raw`$MYSQL_DATABASE` + "`" + String.raw`.* TO '$MYSQL_USER'@'%';
		FLUSH PRIVILEGES;
	EOSQL
else
	echo "[mariadb] existing datadir found, skipping bootstrap"
fi

exec "$@"`,
        cap: "heredoc ใช้ <<- เพื่อให้ย่อหน้าด้วย tab ได้ แต่ทุก statement ยังต้องอยู่บรรทัดเดียว", lang: "sh" },
      { h: "3) entrypoint ของ WordPress" },
      { code: String.raw`#!/bin/sh
set -eu
DB_PASSWORD="$(tr -d '\r\n' < /run/secrets/db_password)"
. /run/secrets/credentials              # WP_ADMIN_PASSWORD, WP_USER_PASSWORD

cd "$WP_PATH"
if [ ! -f wp-config.php ]; then
	echo "[wordpress] first boot, installing"

	# รอ DB ด้วย query จริง ไม่ใช่ ping (ping ตอบ ok แม้ auth พัง)
	i=0
	until mariadb -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$DB_PASSWORD" \
	              "$MYSQL_DATABASE" -e 'SELECT 1' >/dev/null 2>&1; do
		i=$((i + 1)); [ "$i" -gt 60 ] && { echo "[wordpress] db never came up"; exit 1; }
		sleep 2
	done

	wp core download  --path="$WP_PATH" --allow-root
	wp config create  --path="$WP_PATH" --allow-root --dbname="$MYSQL_DATABASE" \
		--dbuser="$MYSQL_USER" --dbpass="$DB_PASSWORD" --dbhost="$MYSQL_HOST"
	wp core install   --path="$WP_PATH" --allow-root --url="$WP_URL" --title="$WP_TITLE" \
		--admin_user="$WP_ADMIN_USER" --admin_password="$WP_ADMIN_PASSWORD" \
		--admin_email="$WP_ADMIN_EMAIL" --skip-email
	wp user create "$WP_USER" "$WP_USER_EMAIL" --role=author \
		--user_pass="$WP_USER_PASSWORD" --path="$WP_PATH" --allow-root
else
	echo "[wordpress] existing installation found, skipping"
fi

exec "$@"`,
        cap: "wait-loop ต้องมีเพดาน — วนไม่รู้จบทำให้ container ค้างแทนที่จะแจ้ง error", lang: "sh" },
      { note: "**`wp-cli` เป็นไฟล์ phar ไม่ใช่ image สำเร็จรูป** จึงใช้ได้ตามกฎ — ดาวน์โหลดมันใน Dockerfile ด้วย `curl` แล้ว `chmod +x`" },
      { h: "4) NGINX server block" },
      { code: String.raw`server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ` + "${" + String.raw`DOMAIN_NAME}` + String.raw`;

    ssl_protocols       TLSv1.2 TLSv1.3;       # เท่านั้น ไม่มี 1.0/1.1
    ssl_certificate     /etc/nginx/ssl/inception.crt;
    ssl_certificate_key /etc/nginx/ssl/inception.key;

    root  /var/www/html;
    index index.php index.html;

    client_max_body_size 20m;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        include        fastcgi_params;
        fastcgi_pass   wordpress:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param  HTTPS on;                 # ไม่งั้น /wp-admin/ redirect วน

        fastcgi_buffer_size       16k;           # ไม่งั้น URI ยาว -> 502
        fastcgi_buffers         8 16k;
        fastcgi_busy_buffers_size 32k;
    }

    include /etc/nginx/bonus/*.conf;             # glob ที่ไม่แมตช์อะไรเลยไม่เป็นไร
}`, cap: "ไม่มี listen 80 เลย — พอร์ตเดียวที่เปิดคือ 443", lang: "nginx" },
      { h: "5) entrypoint ของ NGINX (สร้าง cert)" },
      { code: String.raw`#!/bin/sh
set -eu
CRT=/etc/nginx/ssl/inception.crt
KEY=/etc/nginx/ssl/inception.key

if [ ! -f "$CRT" ]; then
	mkdir -p /etc/nginx/ssl
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout "$KEY" -out "$CRT" \
		-subj "/C=TH/ST=Bangkok/L=Bangkok/O=42/OU=42/CN=$DOMAIN_NAME"
	chmod 600 "$KEY"
fi

# แทนค่าตัวแปรลง template แล้วค่อยวางเป็นคอนฟิกจริง
envsubst '$DOMAIN_NAME' < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf

if [ "` + "${" + String.raw`BONUS_ENABLED:-0}" = "1" ]; then
	cp /etc/nginx/templates/bonus.conf /etc/nginx/bonus/bonus.conf
fi

exec "$@"`,
        cap: "cert เกิดตอนรัน จึงไม่มี private key อยู่ในชั้นของ image", lang: "sh" },
      { h: "6) Makefile" },
      { code: String.raw`COMPOSE = docker compose -f srcs/docker-compose.yml
DATA    = $(HOME)/data

all: up

$(DATA):
	mkdir -p $(DATA)/mariadb $(DATA)/wordpress

up: $(DATA)
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

clean: down
	$(COMPOSE) down --rmi local

fclean: clean
	$(COMPOSE) down -v
	sudo rm -rf $(DATA)

re: fclean all

bonus: $(DATA)
	BONUS_ENABLED=1 $(COMPOSE) -f srcs/docker-compose.bonus.yml up -d --build

.PHONY: all up down logs clean fclean re bonus`,
        cap: "fclean ต้องลบทั้ง volume และไดเรกทอรีข้อมูล ไม่งั้นเทสต์ 'บูตครั้งแรก' จะไม่เคยรันจริง", lang: "make" },
      { h: "7) `.env` ที่ปลอดภัย" },
      { code: String.raw`DOMAIN_NAME=wiaon-in.42.fr
DATA_PATH=/home/wiaon-in/data

MYSQL_HOST=mariadb
MYSQL_DATABASE=wordpress
MYSQL_USER=wpuser

WP_PATH=/var/www/html
WP_URL=https://wiaon-in.42.fr
WP_TITLE=Inception
WP_ADMIN_USER=wiaonin            # ห้ามมีคำว่า admin / administrator
WP_ADMIN_EMAIL=wiaonin@student.42.fr
WP_USER=guest
WP_USER_EMAIL=guest@student.42.fr

# ไม่มีบรรทัดไหนขึ้นต้นด้วย ...PASSWORD= ในไฟล์นี้`,
        cap: "grep หา PASSWORD ใน .env และ compose ต้องไม่เจออะไรเลย", lang: "bash" },
      { h: "8) สร้าง secret ให้สะอาด" },
      { code: String.raw`mkdir -p secrets
openssl rand -base64 24 | tr -d '\r\n' > secrets/db_root_password.txt
openssl rand -base64 24 | tr -d '\r\n' > secrets/db_password.txt
cat > secrets/credentials.txt <<'EOF'
WP_ADMIN_PASSWORD=<สุ่มมา>
WP_USER_PASSWORD=<สุ่มมา>
EOF

od -c secrets/db_password.txt | tail -2      # ต้องไม่มี \r ให้เห็น
echo "secrets/" >> .gitignore`,
        cap: "ตรวจด้วย od -c เสมอ — cat มองไม่เห็น CR", lang: "bash" }
    ],

    tricks: [
      { h: "เทสต์ควรแบ่งเป็น 4 ชั้น" },
      { table: { head: ["ชั้น", "ตรวจอะไร"], rows: [
        ["**Static**", "คำต้องห้าม (`latest`, `tail -f`, `sleep infinity`, `while true`, `network_mode`, `links:`), มี `ports:` แค่รายการเดียว, `restart: always` ครบ 3, ไม่มี `PASSWORD=` นอก `secrets/`, secret ไม่ว่างและไม่มี CR, `docker compose config -q` parse ผ่าน"],
        ["**Behaviour**", "HTTPS ได้ 200, `wp core is-installed`, มีผู้ใช้ 2 คนและมี administrator 1 คน, ตารางถูกสร้าง, login ผ่านฟอร์มจริงแล้วได้ cookie `wordpress_logged_in`"],
        ["**Negative**", "TLS 1.0/1.1 ถูกปฏิเสธและ 1.2/1.3 ผ่าน (`openssl s_client -tls1_1`), พอร์ต 80/3306/9000 ต่อจากโฮสต์ไม่ได้, body ใหญ่เกินได้ 413"],
        ["**Persistence**", "สร้างโพสต์ → `down` → `up` → โพสต์ยังอยู่ และ log บอกว่า 'existing … found' ไม่ใช่ติดตั้งใหม่"]
      ]}},
      { h: "เทสต์เฉพาะสำหรับตอน defense" },
      { code: String.raw`docker exec mariadb   cat /proc/1/comm      # ต้องได้ mariadbd
docker exec wordpress cat /proc/1/comm      # ต้องได้ php-fpm8.2
docker exec nginx     cat /proc/1/comm      # ต้องได้ nginx

docker inspect -f '{{.Mounts}}' mariadb     # Type ต้องเป็น volume
docker volume inspect srcs_db_data          # Options.device ต้องชี้ /home/<login>/data

docker inspect mariadb | grep -i pass       # ต้องไม่เจอรหัสผ่าน
docker history mariadb:1.0 | grep -i pass   # ต้องไม่เจอเช่นกัน`,
        cap: "ทั้ง 4 อย่างนี้คือสิ่งที่ผู้ตรวจพิมพ์เองแน่นอน — ซ้อมให้ขึ้นใจ", lang: "bash" },
      { h: "2 เรื่องที่กัดตัวชุดเทสต์เอง ไม่ใช่ตัวโปรเจกต์" },
      { ul: [
        "**การ grep หาคำต้องห้ามจะไปโดน comment ของตัวเอง** ที่อธิบายว่าทำไมคำนั้นถึงต้องห้าม — ให้ข้ามบรรทัด comment",
        "**เทสต์ที่สร้าง stack ขึ้นใหม่ต้องใช้ชุดไฟล์ compose เดิม** ที่กำลังรันอยู่ ไม่งั้น stack แบบ bonus จะกลับมาเป็น mandatory เงียบ ๆ และ `BONUS_ENABLED` หายไป"
      ]},
      { h: "bonus ที่ไม่ทำลาย mandatory" },
      { p: "bonus ถูกตรวจก็ต่อเมื่อ mandatory สมบูรณ์แบบแล้ว จึงควรแยกเป็น **overlay** — `srcs/docker-compose.bonus.yml` + เป้า `make bonus` และให้ `make` เปล่า ๆ ขึ้นเฉพาะ 3 service ที่บังคับ" },
      { p: "service เพิ่มเติมก็ยัง **ห้ามเปิดพอร์ต** ต้อง proxy ผ่าน NGINX ตัวเดียว — ซึ่งสร้างปัญหาไก่กับไข่ เพราะ `proxy_pass http://adminer:8080/` ทำให้ NGINX ตายตั้งแต่ตอนสตาร์ตถ้าไม่มี container ชื่อ `adminer`. วิธีกั้น:" },
      { ul: [
        "ใส่ template `bonus.conf` ไว้ใน image แล้ว `include /etc/nginx/bonus/*.conf;` ใน server block — **glob ที่ไม่แมตช์อะไรเลยไม่เป็นไร**",
        "entrypoint คัดลอก template เข้าไปเฉพาะเมื่อ `BONUS_ENABLED=1`",
        "ฝั่ง WordPress ก็ตั้ง Redis object cache เฉพาะเมื่อมี `REDIS_HOST` — image เดียวจึงใช้ได้ทั้งสองโหมด"
      ]},
      { table: { head: ["Bonus", "ข้อควรรู้"], rows: [
        ["Redis cache", "ตั้ง `maxmemory` + `allkeys-lru` และปิด persistence"],
        ["Adminer", "ไฟล์ PHP ไฟล์เดียวหลัง `php -S 0.0.0.0:8080` — ยัง 1 process 1 container"],
        ["FTP", "ชี้ไปที่ volume ของ WordPress"],
        ["Static site", "HTML ล้วนหลัง NGINX ของตัวเอง — subject ห้ามใช้ PHP กับข้อนี้"]
      ]}},
      { h: "รันบน Windows" },
      { p: "Docker Desktop รัน engine อยู่ใน VM ของตัวเอง ดังนั้น `DATA_PATH` จะถูก resolve **ข้างใน VM นั้น** และ `mkdir` ฝั่ง Windows จะไปสร้างผิดที่. เก็บ path แบบ Linux ไว้ตามเดิม (เพราะนั่นคือสิ่งที่ผู้ตรวจเห็น) แล้วแตกสาขาด้วย `uname`" },
      { code: String.raw`ifneq (,$(findstring MINGW,$(shell uname -s)))
IN_VM := 1
endif
VM_SH := MSYS_NO_PATHCONV=1 docker run --rm -v /:/host debian:bookworm sh -c`,
        cap: "MSYS_NO_PATHCONV=1 จำเป็น ไม่งั้น Git Bash จะเขียน / เป็น C:\\...", lang: "make" },
      { p: "แต่ตัวแปรเดียวกันนี้จะไปทำลาย path แบบ absolute ที่ 'ดูเหมือน relative' เวลาส่งให้ `curl.exe` และ `docker.exe` ที่เป็นโปรแกรม native — ในสคริปต์ให้แปลงอย่างตั้งใจด้วย `cygpath -w` และเก็บไฟล์ชั่วคราวไว้แบบ relative กับ repo" },
      { h: "คำสั่ง debug ที่ใช้บ่อยที่สุด" },
      { code: String.raw`docker compose logs -f mariadb          # ดูว่า bootstrap รันจริงไหม
docker exec -it mariadb sh              # เข้าไปข้างใน
mariadb -h localhost -u root -p         # -h localhost สำคัญ (กับดัก 7)
SHOW DATABASES; SELECT user,host FROM mysql.user;

docker exec wordpress wp core is-installed --allow-root --path=/var/www/html
docker exec wordpress wp user list --allow-root --path=/var/www/html

openssl s_client -connect localhost:443 -tls1_1   # ต้องถูกปฏิเสธ
openssl s_client -connect localhost:443 -tls1_2   # ต้องผ่าน`,
        cap: "ไล่จาก log ไปหา shell ไปหา query — อย่าเดาจากหน้าเว็บอย่างเดียว", lang: "bash" }
    ],

    eval: [
      { p: "คำถามที่ผู้ตรวจถามจริง — Inception ถูกถามเชิงแนวคิดมากกว่าโปรเจกต์อื่น" },
      { qa: [
        { q: "Docker คืออะไร ต่างจาก VM ยังไง",
          a: "VM จำลองฮาร์ดแวร์แล้วรัน kernel ของตัวเอง ส่วน container ใช้ kernel ของโฮสต์ร่วมกันแล้วแยกกันด้วย namespace และ cgroup จึงเบากว่ามาก บูตเป็นวินาที และ image ก็คือชั้นของ filesystem ไม่ใช่ดิสก์ทั้งลูก" },
        { q: "image กับ container ต่างกันยังไง",
          a: "image คือแม่แบบอ่านอย่างเดียวที่ประกอบจากชั้น ส่วน container คืออินสแตนซ์ที่กำลังรันซึ่งมีชั้นเขียนได้เพิ่มมาหนึ่งชั้น — image เดียวสร้าง container ได้หลายตัว และข้อมูลในชั้นเขียนได้จะหายไปเมื่อลบ container" },
        { q: "ทำไมต้องใช้ Debian รุ่นรองสุดท้าย",
          a: "subject บังคับ 'penultimate stable' เพื่อให้ได้ระบบที่เสถียรและมีแพ็กเกจครบ ตอนนี้ stable คือ trixie (13) จึงใช้ bookworm (12)" },
        { q: "ทำไมห้ามใช้ tag latest",
          a: "`latest` ไม่ได้ระบุเวอร์ชันอะไรเลย build วันนี้กับพรุ่งนี้อาจได้คนละระบบ ซึ่งทำให้ผลลัพธ์ทำซ้ำไม่ได้ — เราจึง tag เป็น `service:1.0` และให้ชื่อ image ตรงกับชื่อ service" },
        { q: "PID 1 คืออะไร ทำไมสำคัญ",
          a: "process แรกใน container เป็นตัวรับสัญญาณจาก Docker เช่น SIGTERM ตอน `docker stop` ถ้า PID 1 เป็น shell ที่นั่ง sleep อยู่ daemon จริงจะไม่ได้รับสัญญาณและปิดไม่สวย เราจึงจบ entrypoint ด้วย `exec \"$@\"` ให้ daemon แทนที่ shell — ตรวจได้ด้วย `cat /proc/1/comm`" },
        { q: "ทำไม `tail -f` ถึงถูกห้าม",
          a: "เพราะมันคือการเลี้ยง container ให้ไม่ตายโดยที่ daemon จริงไม่ได้เป็นเจ้าของ process — container จะดูเหมือนมีชีวิตแม้บริการจริงจะตายไปแล้ว และสัญญาณจะไปไม่ถึงบริการนั้น" },
        { q: "ENTRYPOINT กับ CMD ต่างกันยังไง",
          a: "ENTRYPOINT คือโปรแกรมที่รันแน่นอน ส่วน CMD คือ argument เริ่มต้นที่ override ได้ตอน `docker run` — ในโปรเจกต์นี้ ENTRYPOINT คือสคริปต์ตั้งค่า และ CMD คือ daemon ที่สคริปต์จะ `exec` ต่อไป" },
        { q: "named volume ต่างจาก bind mount ยังไง แล้วของเราเป็นแบบไหน",
          a: "bind mount ชี้ path บนโฮสต์ตรง ๆ ส่วน named volume ให้ Docker จัดการ subject บังคับ named volume แต่ต้องเก็บที่ `/home/<login>/data` เราจึงใช้ driver `local` กับ `driver_opts` แบบ bind ซึ่ง `docker inspect` ยังรายงานเป็น `Type: volume`" },
        { q: "container คุยกันได้ยังไงโดยไม่รู้ IP",
          a: "ผ่าน bridge network ที่เราสร้างเอง ซึ่งมี DNS ภายในที่แปลง **ชื่อ service** เป็น IP ให้ — WordPress จึงต่อไปที่ `mariadb:3306` ได้ตรง ๆ นี่คือเหตุผลที่ไม่ต้องใช้ `links:` ที่เลิกใช้ไปแล้ว" },
        { q: "ทำไมห้าม `network_mode: host`",
          a: "มันยกเลิกการแยก network ของ container ทิ้ง ทุก service ไปอยู่บน network stack เดียวกับโฮสต์ ซึ่งขัดกับข้อกำหนดที่ว่า NGINX ต้องเป็นทางเข้าเดียวและพอร์ตอื่นต้องไม่โผล่" },
        { q: "ทำไมรหัสผ่านต้องอยู่ใน secrets ไม่ใช่ .env",
          a: "ค่าใน `.env` กลายเป็น environment variable ของ process ซึ่งเห็นได้จาก `docker inspect`, `docker history` และ `/proc/1/environ` ส่วน secret มาเป็นไฟล์ใน tmpfs ที่ `/run/secrets/` ต้องเข้าไปอ่านถึงจะเห็น" },
        { q: "wp-config.php ได้รหัสผ่านมายังไงโดยไม่มีใน image",
          a: "entrypoint อ่านไฟล์จาก `/run/secrets/` ตอนบูตครั้งแรก แล้วส่งให้ `wp config create` ซึ่งเขียน `wp-config.php` ลงใน **volume** ไม่ใช่ในชั้นของ image" },
        { q: "อธิบายเส้นทางของ request ตั้งแต่เบราว์เซอร์",
          a: "เบราว์เซอร์ต่อ TLS มาที่ NGINX พอร์ต 443 ไฟล์ static NGINX เสิร์ฟเองจาก volume ที่แชร์กัน ส่วนไฟล์ .php แปลงเป็น FastCGI ส่งไป `wordpress:9000` ให้ php-fpm รัน ซึ่งจะต่อ TCP 3306 ไปหา MariaDB แล้วส่ง HTML กลับผ่าน NGINX" },
        { q: "ทำไม container ของ WordPress ถึงไม่มี web server",
          a: "subject บังคับ 1 service ต่อ 1 container — php-fpm ทำหน้าที่รัน PHP อย่างเดียวและพูด FastCGI ส่วนงาน HTTP เป็นของ NGINX ทั้งหมด" },
        { q: "`depends_on` เพียว ๆ กับ `service_healthy` ต่างกันยังไง",
          a: "แบบเพียวรอแค่ container เริ่มทำงาน ส่วน `condition: service_healthy` รอจนกว่า healthcheck จะผ่าน — MariaDB ใช้เวลาอีกหลายวินาทีกว่าจะรับ connection ได้จริง" },
        { q: "ทำไม healthcheck ห้ามใช้ `mariadb-admin ping`",
          a: "ping พิสูจน์แค่ว่า server ตอบ socket คำตอบแบบ access denied ก็ยัง exit 0 healthcheck จะเขียวทั้งที่ไม่มีใคร login ได้ ต้องใช้ query ที่ต้องใช้ credential จริงอย่าง `SELECT 1`" },
        { q: "`docker kill` แล้วทำไม container ไม่ฟื้นทั้งที่ตั้ง restart: always",
          a: "daemon ถือว่า stop หรือ kill ด้วยมือคือความตั้งใจ จึงเมิน restart policy จนกว่าจะสั่ง start เอง วิธีทดสอบที่ถูกคือ `docker exec <c> kill -TERM 1` แล้วดู `RestartCount` เพิ่มขึ้น ซึ่งพิสูจน์ไปพร้อมกันว่า daemon เป็น PID 1 จริง" },
        { q: "ทำไมต้องสร้าง cert ใน entrypoint ไม่ใช่ Dockerfile",
          a: "เพื่อให้ CN ตามค่า `DOMAIN_NAME` ใน `.env` เปลี่ยนโดเมนได้โดยไม่ต้อง build ใหม่ และเพื่อไม่ให้ private key ถูกอบเข้าไปในชั้นของ image" },
        { q: "ข้อมูลอยู่รอดตอน `docker compose down` ได้ยังไง",
          a: "`down` ลบเฉพาะ container ส่วน volume ยังอยู่ พอ `up` ใหม่ container ใหม่ mount volume เดิม entrypoint เห็น state เดิมจึงข้ามการติดตั้ง — ยกเว้น `down -v` ที่ลบ volume ด้วย" },
        { q: "ทำไมชื่อ admin ห้ามมีคำว่า admin",
          a: "เป็นข้อกำหนดของ subject และตรงกับแนวปฏิบัติจริง — ชื่อ `admin` เป็นเป้าหมายแรกของการเดารหัสผ่านแบบ brute force" },
        { q: "เจอ `Error establishing a database connection` จะไล่ยังไง",
          a: "ดู log ของ mariadb ก่อนว่า bootstrap รันจริงไหม แล้วเข้า container ลอง `mariadb -h localhost -u root -p` ถ้า 1130 คือ user ไม่ถูกสร้าง ถ้า 1045 ให้สงสัย CR ท้ายไฟล์ secret แล้วยืนยันด้วย `od -c`" }
      ]},
      { h: "เช็กลิสต์ก่อน defense" },
      { ul: [
        "`docker compose config -q` ผ่าน และมี `ports:` แค่รายการเดียวคือ 443",
        "`grep -rn 'latest\\|tail -f\\|sleep infinity\\|while true\\|network_mode\\|links:' srcs` ว่างเปล่า (ข้าม comment)",
        "`grep -rn 'PASSWORD=' srcs .env` ไม่เจอรหัสผ่าน และ `secrets/` อยู่ใน `.gitignore`",
        "`cat /proc/1/comm` ทั้ง 3 container ได้ชื่อ daemon จริง",
        "`docker inspect` volume แสดง `Type: volume` และ `Options.device` ชี้ `/home/<login>/data`",
        "TLS 1.1 ถูกปฏิเสธ, 1.2/1.3 ผ่าน, พอร์ต 80/3306/9000 จากโฮสต์ต่อไม่ได้",
        "`wp user list` ได้ 2 คน มี administrator 1 คน และชื่อไม่มีคำว่า admin",
        "สร้างโพสต์ → `make down` → `make up` → โพสต์ยังอยู่ และ log บอก 'existing … found'",
        "`docker exec nginx kill -TERM 1` แล้ว `RestartCount` เพิ่ม"
      ]},
      { links: [
        { label: "Dockerfile reference", url: "https://docs.docker.com/reference/dockerfile/", note: "ENTRYPOINT/CMD, layer, cache — อ่านหัวข้อ ENTRYPOINT ให้จบ" },
        { label: "Compose file reference", url: "https://docs.docker.com/reference/compose-file/", note: "services, volumes, networks, secrets, healthcheck, depends_on" },
        { label: "Docker secrets in Compose", url: "https://docs.docker.com/compose/how-tos/use-secrets/", note: "ที่มาของ /run/secrets/<name>" },
        { label: "NGINX FastCGI module", url: "https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html", note: "fastcgi_pass, fastcgi_param, buffer ทั้งหมด" },
        { label: "WP-CLI commands", url: "https://developer.wordpress.org/cli/commands/", note: "core download / config create / core install / user create" },
        { label: "MariaDB bootstrap & mysql_install_db", url: "https://mariadb.com/kb/en/mysql_install_db/", note: "ทำไม --bootstrap ถึงอ่านทีละบรรทัด" }
      ]}
    ]
  }
});

Object.assign(window.TEACHING_EN, {
  inception: {
    principle: [
      { h: "What the project asks for" },
      { p: "Inception is a **system administration** project, not a programming one — no norminette, no valgrind, no allowed-functions list. The task is to assemble **a web stack that really works** with `docker-compose`, writing **every Dockerfile yourself**." },
      { code: String.raw`                 https://login.42.fr  (443 is the only published port)
                          |
                    +-----v------+   TLS 1.2/1.3 only
                    |   NGINX    |   no PHP inside
                    +-----+------+
                          | fastcgi_pass wordpress:9000
                    +-----v------+
                    | WordPress  |   php-fpm only, no web server
                    |  php-fpm   |   volume: wp_data -> /var/www/html
                    +-----+------+
                          | TCP 3306 on the internal network
                    +-----v------+
                    |  MariaDB   |   volume: db_data -> /var/lib/mysql
                    +------------+`,
        cap: "Three containers, three jobs, talking over a user-defined bridge; nobody publishes a port except NGINX", lang: "txt" },
      { h: "The rules that are actually graded" },
      { table: { head: ["Rule", "How to satisfy it"], rows: [
        ["One service per container, built from your own Dockerfile", "`FROM debian:bookworm` (penultimate stable — Debian 13 trixie is current) or the penultimate Alpine"],
        ["No ready-made application image", "Install `mariadb-server`, `php8.2-fpm`, `nginx` with `apt`; fetch WordPress with `wp-cli`"],
        ["No `latest` tag", "Tag your images `service:1.0`; the image name must equal the service name"],
        ["The container must not be kept alive by a hack", "The entrypoint ends with `exec \"$@\"`; no `tail -f`, `sleep infinity`, `while true`, no daemonising"],
        ["NGINX is the only entrypoint", "Exactly one `ports:` entry in the whole compose file: `\"443:443\"`, TLS 1.2/1.3 only"],
        ["Named volumes, not bind mounts, under `/home/<login>/data`", "`local` driver with `type: none, o: bind, device: ...` — still `Type: volume` in `docker inspect`"],
        ["A `networks:` section, never `network_mode: host` or `links:`", "One user-defined bridge"],
        ["`restart: always` on every service", ""],
        ["No password in a Dockerfile, in compose, in `.env`, or in git", "`.env` holds non-secret config only; passwords live in `secrets/*.txt` → `/run/secrets/<name>`"],
        ["Two WordPress users, and the admin login free of admin/administrator", "e.g. `wiaonin` (administrator) plus `guest` (author)"],
        ["`login.42.fr` resolves locally", "Via `/etc/hosts`"]
      ]}},
      { h: "The layout the evaluator expects" },
      { code: String.raw`Makefile  README.md  USER_DOC.md  DEV_DOC.md  .gitignore
secrets/{credentials,db_password,db_root_password}.txt
srcs/{.env,docker-compose.yml}
srcs/requirements/{mariadb,nginx,wordpress}/{Dockerfile,.dockerignore,conf/,tools/entrypoint.sh}
srcs/requirements/bonus/<service>/...`,
        cap: "secrets/ sits outside srcs/ and must be in .gitignore", lang: "txt" },
      { h: "Why this project deceives you" },
      { ul: [
        "**It looks like it works while it is broken** — WordPress renders a page but cannot reach the DB; a healthcheck goes green while login is refused",
        "**Most traps are not in the subject** — the seven in the next section each cost hours",
        "**The error messages point the wrong way** — 'Error establishing a database connection' has five completely different causes",
        "**Some 'obvious' tests are wrong** — `docker kill` does not trigger `restart: always`"
      ]}
    ],
    theory: [
      { p: "The Docker concepts you have to understand rather than copy — evaluators ask about every one of them." },
      { h: "1) An image is not a container" },
      { table: { head: ["", "Image", "Container"], rows: [
        ["What it is", "A read-only template (stacked layers)", "A running instance plus one writable layer"],
        ["Comes from", "`docker build` on a Dockerfile", "`docker run` on an image"],
        ["How long data lives", "Until the image is deleted", "Gone when the container is deleted, **unless it is in a volume**"],
        ["Cardinality", "One image, many containers", "One container, one image"]
      ]}},
      { h: "2) Layers and the cache" },
      { p: "Every `RUN`/`COPY`/`ADD` creates a **layer**. Docker caches them, so if the layers above are unchanged the ones below are not rebuilt — put what changes often (`COPY conf/`) **late** and what changes rarely (`apt-get install`) early." },
      { code: String.raw`RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx \
    && rm -rf /var/lib/apt/lists/*`,
        cap: "One RUN, and delete the apt lists in the same layer — split across layers, the deleted files still occupy the earlier one", lang: "dockerfile" },
      { h: "3) ENTRYPOINT versus CMD" },
      { code: String.raw`ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["mariadbd", "--user=mysql"]

# Docker actually runs:  entrypoint.sh  mariadbd --user=mysql
# and the script ends with:  exec "$@"   -> mariadbd replaces the shell as PID 1`,
        cap: "ENTRYPOINT is the program that always runs; CMD is the default arguments, overridable", lang: "dockerfile" },
      { h: "4) Why PID 1 matters" },
      { p: "The first process in a container is PID 1 and receives Docker's signals (`SIGTERM` on `docker stop`). If PID 1 is a shell sitting in a sleep, the real daemon never gets the signal — it shuts down uncleanly, data can be damaged, and `docker stop` waits the full ten seconds before SIGKILL every time." },
      { p: "`exec \"$@\"` **replaces** the shell process with the daemon, so the daemon becomes PID 1 itself — evaluators verify this with `cat /proc/1/comm`." },
      { note: "That is exactly why `tail -f /dev/null`, `sleep infinity` and `while true` are forbidden — they keep the container alive without the real daemon owning the process." },
      { h: "5) Named volumes versus bind mounts" },
      { table: { head: ["", "Named volume", "Bind mount"], rows: [
        ["Managed by Docker", "Yes", "No (a host path directly)"],
        ["`docker inspect` Type", "`volume`", "`bind`"],
        ["Required by the subject", "**Yes**", "Forbidden"],
        ["But it must live at", "`/home/<login>/data/...`", ""]
      ]}},
      { code: String.raw`volumes:
  db_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: ` + "${" + String.raw`DATA_PATH}/mariadb`,
        cap: "The trick: a named volume with these driver_opts is still Type: volume, but the data lands at the path you chose", lang: "yaml" },
      { h: "6) Docker networking" },
      { p: "A `networks:` section creates a **user-defined bridge**, which provides **internal DNS by service name** — `wordpress` reaches `mariadb:3306` without knowing an IP. That replaces `links:` (deprecated) and is why `network_mode: host` (no network isolation at all) is forbidden." },
      { h: "7) Secrets versus environment variables" },
      { table: { head: ["", "`.env` / `environment:`", "`secrets:`"], rows: [
        ["Where it ends up", "The process environment", "A file at `/run/secrets/<name>` (tmpfs)"],
        ["Visible from", "`docker inspect`, `/proc/1/environ`, `docker history`", "Only by reading the file inside the container"],
        ["Holds", "Non-secret config (DB name, domain name)", "**Every password**"]
      ]}},
      { h: "8) php-fpm and FastCGI" },
      { p: "WordPress is PHP — but its container **may not contain a web server**. `php-fpm` is a process manager speaking **FastCGI** on port 9000, and NGINX is what accepts HTTP and translates it." },
      { code: String.raw`location ~ \.php$ {
    include        fastcgi_params;
    fastcgi_pass   wordpress:9000;
    fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_param  HTTPS on;
}`, cap: "NGINX speaks HTTP to the browser and FastCGI to php-fpm", lang: "nginx" },
      { h: "9) TLS and the self-signed certificate" },
      { p: "The subject requires **TLS 1.2 or 1.3 only** and a self-signed certificate. The browser warning is correct behaviour — no CA vouches for it." },
      { code: String.raw`ssl_protocols TLSv1.2 TLSv1.3;
ssl_certificate     /etc/nginx/ssl/inception.crt;
ssl_certificate_key /etc/nginx/ssl/inception.key;`,
        cap: "Generate the cert in the entrypoint, not the Dockerfile — the CN then follows DOMAIN_NAME and no private key is baked into a layer", lang: "nginx" }
    ],
    foundations: [
      { p: "**Seven traps**, each costing hours, and **none of them are in the subject**. Every one produces a plausible-looking stack that is quietly broken." },
      { h: "Trap 1 — `mariadbd --bootstrap` reads one statement per LINE" },
      { p: "Bootstrap mode is **not a SQL parser** — it hands each input **line** to the server as a query. A statement wrapped across two lines becomes two broken queries, the first error aborts the rest, and you end up with a root password set but **no database and no application user**." },
      { code: String.raw`# WRONG - two queries, the second a syntax error, everything after it lost
CREATE DATABASE IF NOT EXISTS ` + "`wordpress`" + String.raw`
    CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

# RIGHT - one self-contained line
CREATE DATABASE IF NOT EXISTS ` + "`wordpress`" + String.raw` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`,
        cap: "Symptom: WordPress logs Host '172.x.x.x' is not allowed to connect (error 1130) — the user simply does not exist", lang: "sh" },
      { h: "Trap 2 — the Debian package pre-initialises `/var/lib/mysql`, and Docker copies it into your empty volume" },
      { p: "`apt-get install mariadb-server` runs `mysql_install_db` at **build** time. When Docker mounts an **empty** volume over a **non-empty** image directory it copies the image contents in. The volume therefore arrives already containing a `mysql/` datadir, your `if [ ! -d /var/lib/mysql/mysql ]` guard sees it, and **the bootstrap never runs — on the very first boot, forever**." },
      { code: String.raw`RUN rm -rf /var/lib/mysql/* \
    && mkdir -p /run/mysqld /var/lib/mysql \
    && chown -R mysql:mysql /run/mysqld /var/lib/mysql`,
        cap: "Tell it apart from trap 1 by the log line: 'existing datadir found' on a brand-new volume means the image polluted it", lang: "dockerfile" },
      { h: "Trap 3 — `mariadb-admin ping` returns success when authentication fails" },
      { p: "`ping` only proves the server answered the socket; an access-denied reply still exits 0 in common versions. A healthcheck built on it **goes green while nothing can log in**, and `depends_on: service_healthy` then starts WordPress against a database it cannot use." },
      { code: String.raw`test: ["CMD-SHELL", "mariadb -h localhost -u root -p\"$$(tr -d '\\r\\n' < /run/secrets/db_root_password)\" -e 'SELECT 1' >/dev/null 2>&1"]`,
        cap: "Use a query that needs credentials — and the WordPress wait-loop must probe with SELECT 1 too, not ping", lang: "yaml" },
      { h: "Trap 4 — a CR at the end of a secret file poisons the password" },
      { p: "Generating secrets on Windows (Git Bash, MSYS) is the usual cause: `openssl` emits CRLF and `tr -d '\\n'` leaves the `\\r` behind. MariaDB then stores `hunter2\\r` while `wp-config.php` gets `hunter2\\n`, and every later login fails with error 1045 — **with both values looking identical when printed**." },
      { code: String.raw`# generating
openssl rand -base64 24 | tr -d '\r\n' > secrets/db_password.txt
# reading, in every entrypoint
DB_PASSWORD="$(tr -d '\r\n' < /run/secrets/db_password)"`,
        cap: "Strip both characters on the way in and on the way out; diagnose with od -c, never with cat", lang: "sh" },
      { h: "Trap 5 — WordPress must be told it is behind TLS, and NGINX needs bigger FastCGI buffers" },
      { code: String.raw`# without this is_ssl() is false and /wp-admin/ redirect-loops
fastcgi_param HTTPS on;

# WordPress echoes the request URI back in redirect headers, so a long URI
# overflows the default 4k buffer: "upstream sent too big header" -> 502
fastcgi_buffer_size       16k;
fastcgi_buffers         8 16k;
fastcgi_busy_buffers_size 32k;`,
        cap: "Two unrelated bugs fixed in the same location ~ \\.php$ block", lang: "nginx" },
      { h: "Trap 6 — `docker kill` does **not** trigger `restart: always`" },
      { p: "The daemon treats a manual stop **or kill** as intentional and ignores the restart policy until the container is started by hand. So the obvious test 'kill it and watch it come back' fails on a perfectly correct stack — and worse, a student then 'fixes' a policy that was never broken." },
      { p: "`kill -9 1` from inside is no good either: the kernel refuses SIGKILL to PID 1 of a namespace. Signal PID 1 with something it handles, which also proves the daemon really is PID 1:" },
      { code: String.raw`before=$(docker inspect -f '{{.RestartCount}}' nginx)
docker exec nginx sh -c 'kill -TERM 1'
sleep 10
[ "$(docker inspect -f '{{.RestartCount}}' nginx)" -gt "$before" ]`,
        cap: "RestartCount going up proves both the policy and that the daemon is PID 1", lang: "bash" },
      { h: "Trap 7 — inside the containers, `MYSQL_HOST` hijacks the MariaDB client" },
      { p: "`env_file: .env` gives every container `MYSQL_HOST=mariadb`, and the `mariadb` CLI reads that variable as its **default host**. A command you expect to go over the unix socket as `root@localhost` goes over TCP instead and is refused." },
      { p: "**Pass `-h localhost` explicitly whenever you run a client inside the mariadb container** (healthchecks, tests, manual debugging)." },
      { h: "Symptom to cause" },
      { table: { head: ["Symptom", "Most likely cause"], rows: [
        ["`Host '172.x' is not allowed to connect` (1130)", "The user was never created — trap 1 or 2"],
        ["`Access denied for user` (1045)", "A CR inside the password — trap 4"],
        ["`Error establishing a database connection`", "DB not ready / a lying healthcheck — trap 3"],
        ["WordPress loops on 'waiting for mariadb'", "The wait-loop probes with ping instead of SELECT 1 — trap 3"],
        ["`/wp-admin/` redirect-loops", "Missing `fastcgi_param HTTPS on` — trap 5"],
        ["A long URL returns 502", "FastCGI buffers too small — trap 5"],
        ["`existing datadir found` on a brand-new volume", "The image polluted it — trap 2"],
        ["`docker kill` and it does not come back", "Not a bug — trap 6"],
        ["`mariadb -u root` refused inside the container", "`MYSQL_HOST` hijacked it — trap 7"]
      ]}}
    ],
    architecture: [
      { p: "The actual files that make up the stack, with the reason each is written that way." },
      { h: "docker-compose.yml — the core" },
      { code: String.raw`services:
  mariadb:
    build: { context: ./requirements/mariadb, dockerfile: Dockerfile }
    image: mariadb:1.0             # image name = service name, never latest
    container_name: mariadb
    env_file: .env
    secrets: [db_root_password, db_password]
    volumes: [db_data:/var/lib/mysql]
    networks: [inception]
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "mariadb -h localhost -u root -p\"$$(tr -d '\\r\\n' < /run/secrets/db_root_password)\" -e 'SELECT 1' >/dev/null 2>&1"]
      interval: 5s
      timeout: 5s
      retries: 12
      start_period: 20s

  wordpress:
    build: { context: ./requirements/wordpress, dockerfile: Dockerfile }
    image: wordpress:1.0
    env_file: .env
    secrets: [db_password, credentials]
    volumes: [wp_data:/var/www/html]
    networks: [inception]
    depends_on:
      mariadb: { condition: service_healthy }
    restart: always

  nginx:
    build: { context: ./requirements/nginx, dockerfile: Dockerfile }
    image: nginx:1.0
    env_file: .env
    ports: ["443:443"]             # <- the only ports entry in the file
    volumes: [wp_data:/var/www/html]
    networks: [inception]
    depends_on: [wordpress]
    restart: always`,
        cap: "nginx shares wp_data with wordpress because it serves WordPress's static files itself", lang: "yaml" },
      { h: "The tail of the compose file: volumes, networks, secrets" },
      { code: String.raw`volumes:
  db_data:
    driver: local
    driver_opts: { type: none, o: bind, device: ` + "${" + String.raw`DATA_PATH}/mariadb` + String.raw` }
  wp_data:
    driver: local
    driver_opts: { type: none, o: bind, device: ` + "${" + String.raw`DATA_PATH}/wordpress` + String.raw` }

networks:
  inception:
    driver: bridge

secrets:
  db_root_password: { file: ../secrets/db_root_password.txt }
  db_password:      { file: ../secrets/db_password.txt }
  credentials:      { file: ../secrets/credentials.txt }`,
        cap: "DATA_PATH comes from .env and should point at /home/<login>/data", lang: "yaml" },
      { h: "What belongs where" },
      { table: { head: ["Location", "Holds", "Must never hold"], rows: [
        ["`.env`", "Domain, DB name, user names, DATA_PATH, site title", "**Any password**"],
        ["`secrets/*.txt`", "One password per file, one line, no CR", "Anything committed to git"],
        ["`Dockerfile`", "Software installation, config copying, ENTRYPOINT/CMD", "Passwords, certificates, `latest`"],
        ["`conf/`", "Daemon configuration files", "Values that change per environment"],
        ["`tools/entrypoint.sh`", "First-boot setup, reading secrets, generating the cert, then `exec \"$@\"`", "An unbounded wait loop with no timeout"]
      ]}},
      { h: "The standard entrypoint shape" },
      { code: String.raw`#!/bin/sh
set -eu
SECRET="$(tr -d '\r\n' < /run/secrets/db_password)"

if [ ! -d /var/lib/mysql/mysql ]; then      # or: [ ! -f wp-config.php ]
	... one-time initialisation ...
else
	echo "[service] existing state found, skipping initialisation"
fi

exec "$@"                                    # CMD becomes PID 1`,
        cap: "The same three beats in every service: read secrets, initialise only if the volume is empty, hand over to the daemon", lang: "sh" },
      { h: "The CMD of each service" },
      { table: { head: ["Service", "CMD", "Why"], rows: [
        ["mariadb", "`[\"mariadbd\", \"--user=mysql\"]`", "Runs in the foreground as PID 1"],
        ["wordpress", "`[\"php-fpm8.2\", \"-F\"]`", "`-F` keeps it in the foreground, no daemonising"],
        ["nginx", "`[\"nginx\", \"-g\", \"daemon off;\"]`", "`daemon off` stops it forking into the background"]
      ]}},
      { note: "Those three lines are the answer to the 'no keep-alive hack' rule — the daemon owns the process; you are not tricking the container into staying up." },
      { h: "The certificate belongs in the entrypoint, not the Dockerfile" },
      { p: "**Two reasons**: (1) the CN then follows `DOMAIN_NAME` from `.env`, so changing domain needs no rebuild; (2) **no private key ever lands in an image layer** that could be pushed somewhere." }
    ],
    dataflow: [
      { p: "One request's journey, then the first-boot sequence." },
      { h: "How one request travels" },
      { code: String.raw`browser  https://login.42.fr/wp-admin/
   |  TLS handshake (1.2/1.3 only) against the self-signed cert
   v
NGINX  :443
   |  static files (.css .js .png)  -> read straight from /var/www/html (shared volume)
   |  .php files                    -> translated into FastCGI
   v  fastcgi_pass wordpress:9000        (the bridge's DNS resolves the name)
php-fpm  :9000
   |  runs WordPress's PHP
   |  reads wp-config.php holding DB_HOST=mariadb and the password
   v  TCP 3306
MariaDB
   |  answers the query
   v
php-fpm builds the HTML  ->  NGINX  ->  browser`,
        cap: "Note NGINX serves the static files itself because it mounts the same volume as WordPress", lang: "txt" },
      { h: "The first boot, on empty volumes" },
      { code: String.raw`docker compose up -d
 |
 +-> mariadb starts first
 |     entrypoint: read the secrets (stripping \r\n)
 |     /var/lib/mysql/mysql missing -> run the bootstrap
 |         SET PASSWORD FOR 'root'@'localhost' = PASSWORD('...');
 |         CREATE DATABASE IF NOT EXISTS `+"`wordpress`"+String.raw` ...;      <- one line each
 |         CREATE USER IF NOT EXISTS 'wpuser'@'%' IDENTIFIED BY '...';
 |         GRANT ALL ON `+"`wordpress`"+String.raw`.* TO 'wpuser'@'%';
 |         FLUSH PRIVILEGES;
 |     exec mariadbd --user=mysql
 |     healthcheck: SELECT 1 with real credentials -> healthy
 |
 +-> wordpress waits for mariadb to be healthy (depends_on)
 |     entrypoint: no wp-config.php -> first install
 |         wp core download
 |         wp config create --dbhost=mariadb ...
 |         wait until SELECT 1 really succeeds (not a ping)
 |         wp core install --admin_user=<contains no 'admin'>
 |         wp user create guest ... --role=author
 |     exec php-fpm8.2 -F
 |
 +-> nginx starts last
       entrypoint: no cert -> openssl req generates a self-signed one from DOMAIN_NAME
       exec nginx -g 'daemon off;'`,
        cap: "On the second boot everything finds existing state, prints 'existing ... found' and goes straight to exec", lang: "txt" },
      { h: "Why `depends_on: service_healthy` rather than plain `depends_on`" },
      { p: "Plain `depends_on` only waits for the container to **start**, not for the service to be **usable** — MariaDB needs several more seconds before it accepts connections. `condition: service_healthy` ties the wait to the healthcheck so WordPress never races a sleeping database." },
      { note: "But **a lying healthcheck is worse than none** — with `ping` it goes green while auth is broken, so WordPress still fails and the cause is now harder to find (trap 3)." },
      { h: "How data survives a down and up" },
      { code: String.raw`docker compose down          # deletes containers, leaves volumes alone
docker compose up -d         # new containers mount the same volumes
                             # the entrypoints see existing state -> skip init
                             # the posts you wrote are still there

docker compose down -v       # <- this one deletes the volumes too; data is gone`,
        cap: "The persistence test evaluators love: create a post, down, up, the post is still there and the log says 'existing ... found'", lang: "bash" },
      { h: "The path a secret takes" },
      { code: String.raw`secrets/db_password.txt   (on the host, gitignored)
      |  declared as a secret in compose
      v
/run/secrets/db_password   (tmpfs inside the container, read-only)
      |  entrypoint:  tr -d '\r\n' < /run/secrets/db_password
      v
a shell variable -> passed to wp config create / the SQL statements
      |
      x  never appears in  docker inspect / docker history / /proc/1/environ`,
        cap: "This is precisely why passwords must not live in .env — .env lands in the process environment", lang: "txt" }
    ],
    implementation: [
      { p: "The real files, written to dodge all seven traps." },
      { h: "1) The MariaDB Dockerfile" },
      { code: String.raw`# Penultimate stable Debian (current stable is trixie/13, so bookworm/12)
FROM debian:bookworm

RUN apt-get update \
    && apt-get install -y --no-install-recommends mariadb-server mariadb-client \
    && rm -rf /var/lib/apt/lists/*

COPY conf/50-server.cnf /etc/mysql/mariadb.conf.d/50-server.cnf
COPY tools/entrypoint.sh /usr/local/bin/entrypoint.sh

# The Debian package already initialises /var/lib/mysql at build time. Without
# this, Docker copies it into an empty volume and the entrypoint believes state
# already exists, so the bootstrap never runs.
RUN chmod +x /usr/local/bin/entrypoint.sh \
    && rm -rf /var/lib/mysql/* \
    && mkdir -p /run/mysqld /var/lib/mysql \
    && chown -R mysql:mysql /run/mysqld /var/lib/mysql

EXPOSE 3306
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["mariadbd", "--user=mysql"]`,
        cap: "The comment explaining WHY is what evaluators want to see, not just a correct command", lang: "dockerfile" },
      { h: "2) The MariaDB entrypoint" },
      { code: String.raw`#!/bin/sh
set -eu
ROOT_PW="$(tr -d '\r\n' < /run/secrets/db_root_password)"
USER_PW="$(tr -d '\r\n' < /run/secrets/db_password)"

if [ ! -d /var/lib/mysql/mysql ]; then
	echo "[mariadb] empty datadir, bootstrapping"
	mysql_install_db --user=mysql --datadir=/var/lib/mysql --skip-test-db >/dev/null

	# --bootstrap feeds the server one LINE at a time: every statement must fit on one
	mariadbd --user=mysql --bootstrap <<-EOSQL
		USE mysql;
		FLUSH PRIVILEGES;
		ALTER USER 'root'@'localhost' IDENTIFIED BY '$ROOT_PW';
		CREATE DATABASE IF NOT EXISTS ` + "`" + String.raw`$MYSQL_DATABASE` + "`" + String.raw` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
		CREATE USER IF NOT EXISTS '$MYSQL_USER'@'%' IDENTIFIED BY '$USER_PW';
		GRANT ALL PRIVILEGES ON ` + "`" + String.raw`$MYSQL_DATABASE` + "`" + String.raw`.* TO '$MYSQL_USER'@'%';
		FLUSH PRIVILEGES;
	EOSQL
else
	echo "[mariadb] existing datadir found, skipping bootstrap"
fi

exec "$@"`,
        cap: "The <<- heredoc allows tab indentation, but each statement still has to be one line", lang: "sh" },
      { h: "3) The WordPress entrypoint" },
      { code: String.raw`#!/bin/sh
set -eu
DB_PASSWORD="$(tr -d '\r\n' < /run/secrets/db_password)"
. /run/secrets/credentials              # WP_ADMIN_PASSWORD, WP_USER_PASSWORD

cd "$WP_PATH"
if [ ! -f wp-config.php ]; then
	echo "[wordpress] first boot, installing"

	# wait with a real query, not a ping (ping answers ok even when auth fails)
	i=0
	until mariadb -h "$MYSQL_HOST" -u "$MYSQL_USER" -p"$DB_PASSWORD" \
	              "$MYSQL_DATABASE" -e 'SELECT 1' >/dev/null 2>&1; do
		i=$((i + 1)); [ "$i" -gt 60 ] && { echo "[wordpress] db never came up"; exit 1; }
		sleep 2
	done

	wp core download  --path="$WP_PATH" --allow-root
	wp config create  --path="$WP_PATH" --allow-root --dbname="$MYSQL_DATABASE" \
		--dbuser="$MYSQL_USER" --dbpass="$DB_PASSWORD" --dbhost="$MYSQL_HOST"
	wp core install   --path="$WP_PATH" --allow-root --url="$WP_URL" --title="$WP_TITLE" \
		--admin_user="$WP_ADMIN_USER" --admin_password="$WP_ADMIN_PASSWORD" \
		--admin_email="$WP_ADMIN_EMAIL" --skip-email
	wp user create "$WP_USER" "$WP_USER_EMAIL" --role=author \
		--user_pass="$WP_USER_PASSWORD" --path="$WP_PATH" --allow-root
else
	echo "[wordpress] existing installation found, skipping"
fi

exec "$@"`,
        cap: "The wait loop needs a ceiling — an unbounded one hangs the container instead of reporting the failure", lang: "sh" },
      { note: "**`wp-cli` is a phar, not a ready-made image**, so it is allowed — download it in the Dockerfile with `curl` and `chmod +x` it." },
      { h: "4) The NGINX server block" },
      { code: String.raw`server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name ` + "${" + String.raw`DOMAIN_NAME}` + String.raw`;

    ssl_protocols       TLSv1.2 TLSv1.3;       # only these, no 1.0/1.1
    ssl_certificate     /etc/nginx/ssl/inception.crt;
    ssl_certificate_key /etc/nginx/ssl/inception.key;

    root  /var/www/html;
    index index.php index.html;

    client_max_body_size 20m;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        include        fastcgi_params;
        fastcgi_pass   wordpress:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param  HTTPS on;                 # or /wp-admin/ redirect-loops

        fastcgi_buffer_size       16k;           # or a long URI gives 502
        fastcgi_buffers         8 16k;
        fastcgi_busy_buffers_size 32k;
    }

    include /etc/nginx/bonus/*.conf;             # a glob matching nothing is fine
}`, cap: "There is no listen 80 at all — 443 is the only open port", lang: "nginx" },
      { h: "5) The NGINX entrypoint (certificate generation)" },
      { code: String.raw`#!/bin/sh
set -eu
CRT=/etc/nginx/ssl/inception.crt
KEY=/etc/nginx/ssl/inception.key

if [ ! -f "$CRT" ]; then
	mkdir -p /etc/nginx/ssl
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout "$KEY" -out "$CRT" \
		-subj "/C=TH/ST=Bangkok/L=Bangkok/O=42/OU=42/CN=$DOMAIN_NAME"
	chmod 600 "$KEY"
fi

# substitute variables into the template, then drop it in as the real config
envsubst '$DOMAIN_NAME' < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf

if [ "` + "${" + String.raw`BONUS_ENABLED:-0}" = "1" ]; then
	cp /etc/nginx/templates/bonus.conf /etc/nginx/bonus/bonus.conf
fi

exec "$@"`,
        cap: "The cert is created at run time, so no private key sits in an image layer", lang: "sh" },
      { h: "6) The Makefile" },
      { code: String.raw`COMPOSE = docker compose -f srcs/docker-compose.yml
DATA    = $(HOME)/data

all: up

$(DATA):
	mkdir -p $(DATA)/mariadb $(DATA)/wordpress

up: $(DATA)
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

clean: down
	$(COMPOSE) down --rmi local

fclean: clean
	$(COMPOSE) down -v
	sudo rm -rf $(DATA)

re: fclean all

bonus: $(DATA)
	BONUS_ENABLED=1 $(COMPOSE) -f srcs/docker-compose.bonus.yml up -d --build

.PHONY: all up down logs clean fclean re bonus`,
        cap: "fclean must remove both the volumes and the data directory, or the first-boot test never really runs", lang: "make" },
      { h: "7) A safe `.env`" },
      { code: String.raw`DOMAIN_NAME=wiaon-in.42.fr
DATA_PATH=/home/wiaon-in/data

MYSQL_HOST=mariadb
MYSQL_DATABASE=wordpress
MYSQL_USER=wpuser

WP_PATH=/var/www/html
WP_URL=https://wiaon-in.42.fr
WP_TITLE=Inception
WP_ADMIN_USER=wiaonin            # must not contain admin / administrator
WP_ADMIN_EMAIL=wiaonin@student.42.fr
WP_USER=guest
WP_USER_EMAIL=guest@student.42.fr

# not a single line here starts with ...PASSWORD=`,
        cap: "Grepping .env and compose for PASSWORD must return nothing", lang: "bash" },
      { h: "8) Generating clean secrets" },
      { code: String.raw`mkdir -p secrets
openssl rand -base64 24 | tr -d '\r\n' > secrets/db_root_password.txt
openssl rand -base64 24 | tr -d '\r\n' > secrets/db_password.txt
cat > secrets/credentials.txt <<'EOF'
WP_ADMIN_PASSWORD=<generated>
WP_USER_PASSWORD=<generated>
EOF

od -c secrets/db_password.txt | tail -2      # there must be no \r in sight
echo "secrets/" >> .gitignore`,
        cap: "Always verify with od -c — cat cannot show you a CR", lang: "bash" }
    ],
    tricks: [
      { h: "Test in four tiers" },
      { table: { head: ["Tier", "What it checks"], rows: [
        ["**Static**", "Forbidden strings (`latest`, `tail -f`, `sleep infinity`, `while true`, `network_mode`, `links:`), exactly one published port, three `restart: always`, no `PASSWORD=` outside `secrets/`, secrets non-empty and free of CR bytes, `docker compose config -q` parses"],
        ["**Behaviour**", "HTTPS 200, `wp core is-installed`, two users with one administrator, tables present, a real form login yielding a `wordpress_logged_in` cookie"],
        ["**Negative**", "TLS 1.0/1.1 refused and 1.2/1.3 accepted (`openssl s_client -tls1_1`), ports 80/3306/9000 refused from the host, an oversized body giving 413"],
        ["**Persistence**", "Create a post, `down` then `up`, the post is still there, and the logs say 'existing … found' rather than reinstalling"]
      ]}},
      { h: "The defense-specific checks" },
      { code: String.raw`docker exec mariadb   cat /proc/1/comm      # must print mariadbd
docker exec wordpress cat /proc/1/comm      # must print php-fpm8.2
docker exec nginx     cat /proc/1/comm      # must print nginx

docker inspect -f '{{.Mounts}}' mariadb     # Type must be volume
docker volume inspect srcs_db_data          # Options.device must point at /home/<login>/data

docker inspect mariadb | grep -i pass       # must find no password
docker history mariadb:1.0 | grep -i pass   # likewise`,
        cap: "The evaluator will type all four of these — rehearse them", lang: "bash" },
      { h: "Two things that bite the harness rather than the project" },
      { ul: [
        "**Grepping for forbidden strings hits your own comments** explaining why they are forbidden — skip comment lines",
        "**A test that recreates the stack must reuse the same set of compose files** it is currently running with, or a bonus stack silently comes back as mandatory-only and loses `BONUS_ENABLED`"
      ]},
      { h: "Bonus without breaking the mandatory part" },
      { p: "The bonus is graded only once the mandatory part is flawless, so keep it in an **overlay** — `srcs/docker-compose.bonus.yml` plus a `make bonus` target — and let plain `make` start exactly the three required services." },
      { p: "Extra services still must not publish ports; proxy them through the one NGINX. That creates a chicken-and-egg problem, because `proxy_pass http://adminer:8080/` aborts NGINX at startup when `adminer` does not exist. Gate it:" },
      { ul: [
        "Ship a `bonus.conf` template in the image and `include /etc/nginx/bonus/*.conf;` inside the server block — **a glob matching nothing is fine**",
        "The entrypoint copies the template in only when `BONUS_ENABLED=1`",
        "Likewise WordPress configures the Redis object cache only when `REDIS_HOST` is set, so one image serves both modes"
      ]},
      { table: { head: ["Bonus", "What to know"], rows: [
        ["Redis cache", "Wants `maxmemory` plus `allkeys-lru` and no persistence"],
        ["Adminer", "A single PHP file behind `php -S 0.0.0.0:8080` — still one foreground process per container"],
        ["FTP", "Points at the WordPress volume"],
        ["Static site", "Plain HTML behind its own NGINX — the subject excludes PHP here"]
      ]}},
      { h: "Running it on Windows" },
      { p: "Docker Desktop runs the engine in its own VM, so `DATA_PATH` resolves **inside that VM** and a Windows-side `mkdir` creates the wrong directory. Keep the plain Linux path (that is what the evaluator sees) and branch on `uname`." },
      { code: String.raw`ifneq (,$(findstring MINGW,$(shell uname -s)))
IN_VM := 1
endif
VM_SH := MSYS_NO_PATHCONV=1 docker run --rm -v /:/host debian:bookworm sh -c`,
        cap: "MSYS_NO_PATHCONV=1 is required, or Git Bash rewrites / into C:\\...", lang: "make" },
      { p: "The same variable then breaks *relative-looking* absolute paths handed to native `curl.exe` and `docker.exe`, so in scripts convert deliberately with `cygpath -w` and keep temp files relative to the repository." },
      { h: "The debugging commands you will use most" },
      { code: String.raw`docker compose logs -f mariadb          # did the bootstrap actually run?
docker exec -it mariadb sh              # get inside
mariadb -h localhost -u root -p         # -h localhost matters (trap 7)
SHOW DATABASES; SELECT user,host FROM mysql.user;

docker exec wordpress wp core is-installed --allow-root --path=/var/www/html
docker exec wordpress wp user list --allow-root --path=/var/www/html

openssl s_client -connect localhost:443 -tls1_1   # must be refused
openssl s_client -connect localhost:443 -tls1_2   # must succeed`,
        cap: "Go log → shell → query; never diagnose from the rendered page alone", lang: "bash" }
    ],
    eval: [
      { p: "The questions evaluators really ask — Inception is quizzed more conceptually than most projects." },
      { qa: [
        { q: "What is Docker, and how does it differ from a VM?",
          a: "A VM emulates hardware and runs its own kernel; a container shares the host kernel and is isolated with namespaces and cgroups. That makes it far lighter, boots in seconds, and its image is a stack of filesystem layers rather than a whole disk." },
        { q: "What is the difference between an image and a container?",
          a: "An image is a read-only template built from layers; a container is a running instance with one extra writable layer. One image can back many containers, and anything written to that layer disappears when the container is removed." },
        { q: "Why the penultimate stable Debian?",
          a: "The subject requires it, so you get a settled system with complete packages. Current stable is trixie (13), so we use bookworm (12)." },
        { q: "Why is the `latest` tag forbidden?",
          a: "`latest` pins nothing — a build today and one tomorrow can produce different systems, so the result is not reproducible. We tag `service:1.0` and keep the image name equal to the service name." },
        { q: "What is PID 1 and why does it matter?",
          a: "The first process in the container receives Docker's signals, such as SIGTERM on `docker stop`. If PID 1 is a shell sitting in a sleep, the real daemon never sees the signal and shuts down uncleanly, so the entrypoint ends with `exec \"$@\"` and the daemon replaces the shell — verifiable with `cat /proc/1/comm`." },
        { q: "Why is `tail -f` forbidden?",
          a: "It keeps the container alive without the real daemon owning the process, so the container looks healthy even after the service has died, and signals never reach that service." },
        { q: "ENTRYPOINT versus CMD?",
          a: "ENTRYPOINT is the program that always runs; CMD is the default arguments, overridable at `docker run`. Here ENTRYPOINT is the setup script and CMD is the daemon the script `exec`s into." },
        { q: "Named volume versus bind mount, and which do you use?",
          a: "A bind mount points at a host path directly; a named volume is managed by Docker. The subject requires named volumes but insists they live at `/home/<login>/data`, so we use the `local` driver with bind-style `driver_opts` — `docker inspect` still reports `Type: volume`." },
        { q: "How do the containers reach each other without IPs?",
          a: "Through the user-defined bridge network, which provides internal DNS by **service name** — WordPress connects to `mariadb:3306` directly. That is why the deprecated `links:` is unnecessary." },
        { q: "Why is `network_mode: host` forbidden?",
          a: "It removes network isolation entirely and puts every service on the host's network stack, which contradicts the requirement that NGINX be the only entrypoint and that no other port be reachable." },
        { q: "Why must passwords live in secrets rather than .env?",
          a: "`.env` values become process environment variables, visible through `docker inspect`, `docker history` and `/proc/1/environ`. A secret arrives as a file on tmpfs at `/run/secrets/`, which you have to read deliberately." },
        { q: "How does wp-config.php get the password if it is not in the image?",
          a: "The entrypoint reads `/run/secrets/` on the first boot and passes the value to `wp config create`, which writes `wp-config.php` into **the volume**, not into an image layer." },
        { q: "Walk through a request from the browser.",
          a: "The browser completes TLS with NGINX on 443; static files NGINX serves itself from the shared volume, while `.php` is translated into FastCGI and sent to `wordpress:9000`, where php-fpm runs it and connects to MariaDB over TCP 3306, returning HTML back through NGINX." },
        { q: "Why does the WordPress container have no web server?",
          a: "The subject demands one service per container — php-fpm only executes PHP and speaks FastCGI, and all HTTP work belongs to NGINX." },
        { q: "How does plain `depends_on` differ from `service_healthy`?",
          a: "The plain form waits only for the container to start; `condition: service_healthy` waits for the healthcheck to pass, which matters because MariaDB needs several more seconds before it accepts connections." },
        { q: "Why must the healthcheck not use `mariadb-admin ping`?",
          a: "ping only proves the server answered the socket — an access-denied reply still exits 0, so the check goes green while nobody can log in. Use a query that needs credentials, like `SELECT 1`." },
        { q: "Why does `docker kill` not bring the container back despite restart: always?",
          a: "The daemon treats a manual stop or kill as intentional and ignores the policy until you start it by hand. The correct test is `docker exec <c> kill -TERM 1` and watching `RestartCount` rise, which also proves the daemon is PID 1." },
        { q: "Why generate the certificate in the entrypoint rather than the Dockerfile?",
          a: "So the CN follows `DOMAIN_NAME` from `.env` and the domain can change without a rebuild, and so no private key is baked into an image layer." },
        { q: "How does data survive `docker compose down`?",
          a: "`down` removes only the containers; the volumes remain, so the new containers mount the same data and the entrypoints skip initialisation. `down -v` is the one that deletes the volumes." },
        { q: "Why must the admin login not contain 'admin'?",
          a: "The subject requires it, and it matches real practice — `admin` is the first name any brute-force attempt tries." },
        { q: "How would you debug 'Error establishing a database connection'?",
          a: "Start from the mariadb logs to see whether the bootstrap really ran, then get inside and try `mariadb -h localhost -u root -p`. Error 1130 means the user was never created; 1045 points at a CR in the secret file, which `od -c` confirms." }
      ]},
      { h: "Checklist before defense" },
      { ul: [
        "`docker compose config -q` passes and there is exactly one `ports:` entry, 443",
        "`grep -rn 'latest\\|tail -f\\|sleep infinity\\|while true\\|network_mode\\|links:' srcs` is empty (comments skipped)",
        "`grep -rn 'PASSWORD=' srcs .env` finds no password, and `secrets/` is in `.gitignore`",
        "`cat /proc/1/comm` in all three containers prints the real daemon",
        "`docker inspect` shows `Type: volume` and `Options.device` under `/home/<login>/data`",
        "TLS 1.1 refused, 1.2/1.3 accepted, ports 80/3306/9000 unreachable from the host",
        "`wp user list` shows two users, one administrator, and no name containing 'admin'",
        "Create a post → `make down` → `make up` → the post is still there and the log says 'existing … found'",
        "`docker exec nginx kill -TERM 1` raises `RestartCount`"
      ]},
      { links: [
        { label: "Dockerfile reference", url: "https://docs.docker.com/reference/dockerfile/", note: "ENTRYPOINT/CMD, layers, caching — read the ENTRYPOINT section fully" },
        { label: "Compose file reference", url: "https://docs.docker.com/reference/compose-file/", note: "services, volumes, networks, secrets, healthcheck, depends_on" },
        { label: "Docker secrets in Compose", url: "https://docs.docker.com/compose/how-tos/use-secrets/", note: "Where /run/secrets/<name> comes from" },
        { label: "NGINX FastCGI module", url: "https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html", note: "fastcgi_pass, fastcgi_param and every buffer setting" },
        { label: "WP-CLI commands", url: "https://developer.wordpress.org/cli/commands/", note: "core download / config create / core install / user create" },
        { label: "MariaDB bootstrap and mysql_install_db", url: "https://mariadb.com/kb/en/mysql_install_db/", note: "Why --bootstrap reads one statement per line" }
      ]}
    ]
  }
});

/* flow visualizer: make up บน volume ว่าง จนเบราว์เซอร์เห็นหน้า WordPress */
window.EXTRA_FLOWS = window.EXTRA_FLOWS || {};
window.EXTRA_FLOWS.inception = {
  input: "make up   (volume ว่างเปล่า = บูตครั้งแรก)",
  steps: [
    { fn: "docker compose up -d --build", file: "Makefile", depth: 0,
      note: { th: "compose อ่าน `.env` (ค่าไม่ลับ) และผูก `secrets/*.txt` เข้ากับ `/run/secrets/` แล้ว build image จาก Dockerfile ของเราเอง — ไม่มี image สำเร็จรูปของแอปเลย",
              en: "Compose reads `.env` (non-secret config), maps `secrets/*.txt` onto `/run/secrets/`, and builds every image from our own Dockerfile — no ready-made application image anywhere." },
      data: "mariadb:1.0  wordpress:1.0  nginx:1.0   (ไม่มี tag latest)",
      vars: [ { n: "DATA_PATH", v: "/home/wiaon-in/data", d: { th: "named volume ชี้ลงที่นี่ผ่าน driver_opts", en: "the named volumes bind here through driver_opts" } } ] },
    { fn: "mariadb: entrypoint.sh", file: "requirements/mariadb/tools/", depth: 1,
      note: { th: "อ่าน secret ด้วย `tr -d '\r\n'` **ทั้งขาเข้าและขาออก** เพราะ CR ตัวเดียวที่ติดมาจาก Windows ทำให้ DB เก็บ `hunter2\r` แล้ว login พังด้วย error 1045 โดยที่พิมพ์ออกมาดูเหมือนกันเป๊ะ",
              en: "Secrets are read through `tr -d '\r\n'` on both ends, because one CR from Windows makes the database store `hunter2\r` and every later login fails with 1045 while both values print identically." },
      data: "/var/lib/mysql/mysql ไม่มี  ->  ต้อง bootstrap",
      vars: [ { n: "ROOT_PW", v: "(จาก /run/secrets)", d: { th: "ไม่เคยอยู่ใน .env จึงไม่โผล่ใน docker inspect", en: "never in .env, so it never shows up in docker inspect" }, w: true } ] },
    { fn: "mariadbd --bootstrap", file: "requirements/mariadb/tools/", depth: 2,
      note: { th: "โหมดนี้ **ไม่ใช่ SQL parser** มันส่งให้ server ทีละ *บรรทัด* คำสั่งที่ตัดขึ้นบรรทัดใหม่จะกลายเป็น 2 query ที่พัง และ error แรกยกเลิกที่เหลือทั้งหมด",
              en: "This mode is **not a SQL parser** — it hands the server one *line* at a time, so a statement wrapped across two lines becomes two broken queries and the first error aborts the rest." },
      data: "CREATE DATABASE ... ;   CREATE USER ... ;   GRANT ... ;   (บรรทัดละคำสั่ง)",
      vars: [ { n: "wpuser@'%'", d: { th: "ถ้าบรรทัดนี้หาย WordPress จะได้ error 1130", en: "lose this line and WordPress gets error 1130" }, w: true } ] },
    { fn: "healthcheck: SELECT 1", file: "srcs/docker-compose.yml", depth: 2,
      note: { th: "ห้ามใช้ `mariadb-admin ping` เด็ดขาด — มันคืน success แม้ authentication พัง healthcheck จะเขียวทั้งที่ไม่มีใคร login ได้ ต้องใช้ query ที่ต้องใช้ credential จริง",
              en: "Never use `mariadb-admin ping`: it exits 0 even when authentication is refused, so the check goes green while nobody can log in. Use a query that needs real credentials." },
      data: "mariadb -h localhost -u root -p\"...\" -e 'SELECT 1'   ->  healthy",
      vars: [ { n: "-h localhost", d: { th: "ต้องระบุ ไม่งั้น MYSQL_HOST จาก .env แย่ง client ไปวิ่ง TCP", en: "required, or MYSQL_HOST from .env hijacks the client onto TCP" } } ] },
    { fn: "wordpress: รอ DB จริง แล้วติดตั้ง", file: "requirements/wordpress/tools/", depth: 1,
      note: { th: "`depends_on: service_healthy` รอให้บริการพร้อมจริง ไม่ใช่แค่ container สตาร์ต จากนั้น wait-loop ยังตรวจซ้ำด้วย `SELECT 1` และต้อง **มีเพดาน** ไม่งั้น container ค้างแทนที่จะแจ้ง error",
              en: "`depends_on: service_healthy` waits for the service, not just the container, and the wait-loop still re-probes with `SELECT 1` — with a ceiling, or the container hangs instead of reporting the failure." },
      data: "wp core download -> wp config create -> wp core install -> wp user create",
      vars: [ { n: "wp-config.php", d: { th: "เขียนลง volume ไม่ใช่ชั้นของ image", en: "written into the volume, not an image layer" }, w: true } ] },
    { fn: "nginx: สร้าง cert แล้ว exec", file: "requirements/nginx/tools/", depth: 1,
      note: { th: "certificate เกิดตอน **รัน** ไม่ใช่ตอน build: CN จะได้ตาม `DOMAIN_NAME` เปลี่ยนโดเมนได้โดยไม่ต้อง build ใหม่ และ private key ไม่ถูกอบเข้าไปในชั้นของ image",
              en: "The certificate is generated at **run** time, not build time: the CN follows `DOMAIN_NAME` so the domain can change without a rebuild, and no private key is baked into a layer." },
      data: "openssl req -x509 ... -subj \"/CN=$DOMAIN_NAME\"   ->  exec nginx -g 'daemon off;'",
      vars: [ { n: "PID 1", v: "nginx", d: { th: "`exec \"$@\"` แทนที่ shell — ตรวจได้ด้วย cat /proc/1/comm", en: "`exec \"$@\"` replaces the shell — verify with cat /proc/1/comm" }, w: true } ] },
    { fn: "เบราว์เซอร์: TLS handshake", file: "conf/default.conf", depth: 0,
      note: { th: "พอร์ตเดียวที่เปิดในทั้ง stack คือ 443 และรับเฉพาะ TLSv1.2/1.3 — ไม่มี `listen 80` เลย ส่วน cert ที่เซ็นเองทำให้เบราว์เซอร์เตือน ซึ่งถูกต้องแล้ว",
              en: "The only published port in the whole stack is 443, accepting TLSv1.2/1.3 only — there is no `listen 80` at all, and the self-signed certificate warning is correct behaviour." },
      data: "GET /wp-admin/  ->  nginx:443",
      vars: [ { n: "ssl_protocols", v: "TLSv1.2 TLSv1.3", d: { th: "1.0/1.1 ต้องถูกปฏิเสธ", en: "1.0 and 1.1 must be refused" } } ] },
    { fn: "nginx -> php-fpm ผ่าน FastCGI", file: "conf/default.conf", depth: 1,
      note: { th: "ไฟล์ static nginx เสิร์ฟเองจาก volume ที่แชร์กัน ส่วน `.php` แปลงเป็น FastCGI ส่งไป `wordpress:9000` ผ่าน DNS ของ bridge — และต้องมี `fastcgi_param HTTPS on` ไม่งั้น `/wp-admin/` redirect วนไม่จบ",
              en: "Static files nginx serves itself from the shared volume, while `.php` becomes FastCGI to `wordpress:9000` over the bridge's DNS — and `fastcgi_param HTTPS on` is required or `/wp-admin/` redirect-loops." },
      data: "fastcgi_pass wordpress:9000   fastcgi_buffer_size 16k",
      vars: [ { n: "buffers 16k", d: { th: "ค่าเริ่มต้น 4k ล้นเมื่อ URI ยาว แล้วได้ 502", en: "the 4k default overflows on a long URI and gives 502" } } ] },
    { fn: "php-fpm -> mariadb:3306", file: "wp-config.php", depth: 2,
      note: { th: "container คุยกันด้วย **ชื่อ service** ผ่าน bridge ที่เราสร้างเอง ไม่ต้องรู้ IP และไม่ต้องใช้ `links:` ที่เลิกใช้แล้ว — พอร์ต 3306 กับ 9000 ไม่เคยโผล่ออกโฮสต์",
              en: "Containers reach each other by **service name** over our own bridge — no IPs, and no deprecated `links:`. Ports 3306 and 9000 are never published to the host." },
      data: "SELECT ... FROM wp_posts   ->  HTML กลับผ่าน nginx",
      vars: [ { n: "network", v: "inception (bridge)", d: { th: "ห้าม network_mode: host", en: "network_mode: host is forbidden" } } ] },
    { fn: "บูตครั้งที่สอง: ข้าม init", file: "tools/entrypoint.sh", depth: 0,
      note: { th: "`docker compose down` ลบแค่ container ส่วน volume ยังอยู่ พอ `up` ใหม่ entrypoint เห็น state เดิมจึงพิมพ์ 'existing … found' แล้ว exec ทันที — โพสต์ที่เขียนไว้ยังอยู่ครบ",
              en: "`docker compose down` removes only containers; the volumes remain, so on `up` the entrypoints find existing state, print 'existing … found' and exec straight away — the posts are still there." },
      data: "[mariadb] existing datadir found, skipping bootstrap",
      vars: [ { n: "down -v", d: { th: "อันนี้ต่างหากที่ลบ volume และข้อมูลหายจริง", en: "this is the one that deletes the volumes and really loses the data" } } ] }
  ]
};

/* Flow Visualizer ของหน้านี้ — เก็บไว้กับข้อมูลของหน้าเองจะได้ไม่ต้องโหลดไฟล์เพิ่ม */
window.EXTRA_FLOWS = window.EXTRA_FLOWS || {};
window.EXTRA_FLOWS.inception = {
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
  };
