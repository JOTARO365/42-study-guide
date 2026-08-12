/* Git — จากคีย์แรกถึงการทำงานเป็นทีมระดับองค์กร (สร้างจาก skill: git-keys-to-enterprise) */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.TEACHING_EN = window.TEACHING_EN || {};

window.TEACHING_DATA.push({
  id: "tool_git",
  name: "Git — คีย์ถึงองค์กร",
  nameEn: "Git — Keys to Enterprise",
  titleShort: { th: "Git", en: "Git" },
  tag: {
    th: "ตั้งแต่สร้าง SSH key ครั้งแรก จนถึง branch protection, merge queue, monorepo และการกู้ภัยเมื่อ force push ทับงานคนอื่น — เข้าใจโมเดลข้อมูลก่อน แล้วคำสั่งจะเดาได้เอง",
    en: "From your first SSH key to branch protection, merge queues, monorepos and recovering from a force push that ate someone's work — learn the object model first and the commands stop being magic"
  },
  accent: "#f0883e",
  sections: {

    /* ============================ PRINCIPLE ============================ */
    principle: [
      { p: "เกริ่นก่อน: คนส่วนใหญ่เรียน git เป็น **รายการคำสั่งที่ต้องท่อง** แล้วก็พังทุกครั้งที่เจอสถานการณ์นอกลิสต์. หน้านี้ไปอีกทาง — เริ่มจากโครงสร้างข้อมูลจริงของ git แล้วคำสั่งเกือบทั้งหมดจะกลายเป็นสิ่งที่ **เดาได้** ไม่ใช่สิ่งที่ต้องจำ" },
      { h: "git คืออะไรจริง ๆ (ประโยคเดียว)" },
      { p: "git คือ **ที่เก็บ object ที่อ้างอิงด้วยเนื้อหา (content-addressed object store) บวกกับข้อตกลงเรื่อง pointer ที่วางทับไว้ข้างบน**. แค่นี้ — ที่เหลือคือรายละเอียด" },
      { p: "เก็บ object โดยใช้ hash ของเนื้อหาตัวเองเป็นชื่อ, แล้วมี 'ตัวชี้' (branch, tag, HEAD) เป็นแค่ไฟล์ที่บรรจุ hash. `git branch feat` = เขียนไฟล์ขนาด 41 ไบต์ — **นี่คือเหตุผลเดียวที่ทำให้การแตก branch ใน git ถูกจนเปลี่ยนวิธีทำงานของทั้งวงการ** ในขณะที่ SVN แพงพอที่จะทำให้คนไม่กล้าแตก" },
      { h: "สามที่ที่ไฟล์หนึ่งอยู่ได้" },
      { code: String.raw`working tree  --git add-->  index (staging)  --git commit-->  repository
   ไฟล์จริง                 .git/index                    .git/objects
   ที่แก้อยู่                 tree ของ commit ถัดไป           object ถาวร`, cap: "index เป็นไฟล์จริง ไม่ใช่แนวคิดลอย ๆ — รู้ว่ามันมีอยู่คือสิ่งที่ทำให้ reset สามแบบอ่านออก", lang: "text" },
      { h: "หน้านี้ครอบคลุมอะไร" },
      { ul: [
        "**ตัวตนและกุญแจ** — ssh-keygen, ssh-agent, หลายบัญชีในเครื่องเดียว, deploy key, การเซ็น commit",
        "**โมเดลข้อมูล** — blob/tree/commit/tag, ref, HEAD, index, DAG และทำไม rebase ถึงเปลี่ยน hash",
        "**งานประจำวัน** — add -p, commit message ที่ใช้ได้จริง, .gitignore, .gitattributes",
        "**การแก้ประวัติ** — amend, reset สามแบบ, rebase -i, cherry-pick, revert, reflog",
        "**การทำงานเป็นทีม** — merge vs rebase, PR, CODEOWNERS, protected branch, required check, merge queue",
        "**ระดับองค์กร** — monorepo vs polyrepo, partial/shallow clone, sparse-checkout, LFS, submodule vs subtree",
        "**ความปลอดภัย** — secret หลุด, การเซ็นแบบบังคับ, audit trail ที่แก้ย้อนหลังไม่ได้",
        "**กู้ภัย** — reflog, bisect, filter-repo, กู้จาก force push ที่ทับงานคนอื่น",
      ]},
      { h: "กฎข้อเดียวที่ต้องจำก่อนอย่างอื่น" },
      { note: "**สิ่งที่ commit แล้ว แทบไม่มีทางหายจริง** — reflog เก็บทุกการขยับของ HEAD ไว้ราว 90 วัน. ข้อยกเว้นเดียวคือสิ่งที่ **ยังไม่ commit** แล้วโดน `git reset --hard` ทับ — เพราะมันไม่เคยเป็น object จึงไม่มีอะไรให้กู้. นี่คือเหตุผลที่ควร commit บ่อย ๆ ตั้งแต่ยังไม่สวย: commit คือ save point ส่วนความรกค่อยจัดทีหลังด้วย `rebase -i` ได้" },
      { h: "ทำไมเรื่องนี้สำคัญกับ 42" },
      { p: "intra ให้ remote **vogsphere** มาต่อโปรเจกต์ และ moulinette จะ clone สิ่งที่อยู่บน remote นั้นเป๊ะ ๆ — **อะไรที่ยังไม่ push เท่ากับไม่มีอยู่จริง** ตอนตรวจ. ส่วน push_swap v1.1 ที่กลายเป็นงานกลุ่ม 2 คน ทำให้ branch แยกคน, PR เล็ก ๆ และ `.gitignore` ร่วมกัน กลายเป็นข้อบังคับ ไม่ใช่ของหรูอีกต่อไป" },
    ],

    /* ============================== THEORY ============================== */
    theory: [
      { h: "🔬 เจาะลึก A: object 4 ชนิด" },
      { p: "ทุกอย่างใน git เก็บเป็น object 4 ชนิด แต่ละตัวมีชื่อเป็น hash ของเนื้อหาตัวเอง" },
      { table: { head: ["object", "เก็บอะไร", "ไม่เก็บอะไร"], rows: [
        ["**blob**", "เนื้อไฟล์ล้วน ๆ", "ชื่อไฟล์, permission"],
        ["**tree**", "หนึ่งไดเรกทอรี: ชื่อ → blob/tree + mode", "เนื้อไฟล์"],
        ["**commit**", "tree หนึ่งอัน + parent + author/committer + ข้อความ", "diff"],
        ["**tag** (annotated)", "object ที่ชี้ + ผู้แท็ก + ข้อความ + ลายเซ็น", "-"],
      ]}},
      { h: "🔬 เจาะลึก B: commit คือ snapshot ไม่ใช่ diff" },
      { p: "นี่คือจุดที่คนมาจาก SVN เข้าใจผิดบ่อยที่สุด. commit เก็บ **tree ทั้งต้น** ไม่ได้เก็บ 'สิ่งที่เปลี่ยน'. diff ถูก **คำนวณตอนที่ขอ** โดยเทียบ tree สองอัน" },
      { ul: [
        "เพราะงั้น `git checkout` ถึงเร็ว — แค่กาง tree ออกมา ไม่ต้องไล่ใช้ diff สะสม",
        "เพราะงั้น `git log -p` ถึงช้าเมื่อประวัติยาว — ต้องคำนวณ diff ทีละคู่",
        "เพราะงั้น **ไฟล์ที่เนื้อหาเหมือนกันถูกเก็บครั้งเดียว** — สอง path ที่ byte ตรงกันคือ blob เดียว ไม่ว่าจะอยู่คนละ commit หรือคนละ branch",
      ]},
      { note: "แล้วทำไม repo ถึงไม่บวมทันที? เพราะ git ทำ **packfile** ตอน gc: object ที่คล้ายกันถูกเก็บเป็น delta ต่อกันภายหลัง. การเก็บแบบ snapshot เป็นเรื่องของ **โมเดล** ส่วน delta เป็นเรื่องของ **การบีบอัดบนดิสก์** — สองชั้นนี้แยกกัน และเป็นเหตุผลที่ไฟล์ binary ทำให้ repo บวม (delta กับ binary แทบไม่ได้ผล)" },
      { h: "🔬 เจาะลึก C: hash ครอบ parent ด้วย" },
      { code: String.raw`commit c3  <- hash คำนวณจาก: tree + parent(c2) + author + message
   |
commit c2  <- hash คำนวณจาก: tree + parent(c1) + ...
   |
commit c1`, cap: "เพราะ hash ของ commit รวม hash ของ parent ไว้ด้วย hash หนึ่งตัวจึงครอบประวัติทั้งสาย", lang: "text" },
      { p: "ผลที่ตามมามีสองข้อ และทั้งสองข้อสำคัญ: **(1)** แก้อะไรก็ตามในอดีต hash ของทุก commit หลังจากนั้นเปลี่ยนหมด — นี่คือเหตุผลตรง ๆ ที่ rebase ประวัติที่แชร์ไปแล้วสร้างความปั่นป่วน. **(2)** hash หนึ่งตัวคือ **ใบเสร็จที่ปลอมไม่ได้** ว่าโค้ดชุดนั้นคืออะไร ซึ่งเป็นฐานของทั้ง signed tag, provenance และ SBOM" },
      { h: "🔬 เจาะลึก D: ref, HEAD และ branch ที่แท้จริงคือไฟล์" },
      { code: String.raw`.git/refs/heads/main      -> "a1b2c3d4..."      branch คือไฟล์ที่มี hash
.git/refs/tags/v1.4.0     -> "e5f6a7b8..."      tag ก็เหมือนกัน
.git/HEAD                 -> "ref: refs/heads/main"

detached HEAD:
.git/HEAD                 -> "a1b2c3d4..."      ชี้ commit ตรง ๆ ไม่ผ่าน branch`, cap: "detached HEAD ไม่ใช่ error — เป็นแค่ตำแหน่งที่ยังไม่มีชื่อ", lang: "text" },
      { p: "branch = ตัวชี้ที่ **ขยับตามเมื่อ commit ใหม่**. tag = ตัวชี้ที่ **ไม่ขยับ**. HEAD = 'ตอนนี้ฉันอยู่ตรงไหน'. เท่านี้จริง ๆ — และเป็นเหตุผลที่ `git branch` สร้าง branch ได้ในเวลาเท่ากับเขียนไฟล์" },
      { h: "🔬 เจาะลึก E: index — ตัวกลางที่คนมักข้าม" },
      { p: "หลายคนใช้ `git commit -am` ตลอดชีวิตแล้วไม่เคยรู้ว่า index มีอยู่. แต่ index คือสิ่งที่ทำให้ `reset` สามแบบอ่านออกในตารางเดียว" },
      { table: { head: ["คำสั่ง", "HEAD", "index", "working tree"], rows: [
        ["`reset --soft <c>`", "ขยับ", "ไม่แตะ", "ไม่แตะ"],
        ["`reset --mixed <c>` (ค่าตั้งต้น)", "ขยับ", "รีเซ็ต", "ไม่แตะ"],
        ["`reset --hard <c>`", "ขยับ", "รีเซ็ต", "**ทับทิ้ง — ตัวเดียวที่ทำงานหาย**"],
      ]}},
      { p: "อ่านตารางนี้ออกแล้ว trick ยอดนิยมจะกลายเป็นเรื่องธรรมดา: `git reset --soft HEAD~3` = 'ถอย 3 commit แต่เก็บของทั้งหมดไว้ใน staging' ซึ่งคือวิธียุบ 3 commit เป็นอันเดียวโดยไม่ต้องเปิด rebase" },
      { h: "🔬 เจาะลึก F: DAG และ merge base" },
      { code: String.raw`      A---B---C  feature
     /
D---E---F---G  main

merge base ของ feature กับ main = E
three-way merge เทียบ: E (ฐาน) vs C (ของเรา) vs G (ของเขา)`, cap: "git ไม่ได้เดาจากไฟล์สองเวอร์ชัน แต่เทียบสามทางโดยใช้บรรพบุรุษร่วมเป็นฐาน", lang: "text" },
      { p: "**merge base คือหัวใจของทั้ง merge, rebase, PR diff และ CI**. ถ้า clone แบบ `--depth 1` มา merge base อาจไม่มีอยู่ในเครื่องเลย — นั่นคือเหตุผลที่ shallow clone ทำให้ `git merge-base`, `git blame` และ CI ที่คำนวณ 'ไฟล์ที่เปลี่ยนใน PR นี้' พังแบบงง ๆ" },
      { h: "🔬 เจาะลึก G: conflict คือการที่ git ปฏิเสธจะเดา" },
      { p: "three-way merge จบเองได้เมื่อมีแค่ฝั่งเดียวที่แก้บริเวณนั้น. ถ้าทั้งสองฝั่งแก้บรรทัดเดียวกันเทียบกับฐาน git จะ **ไม่เลือกให้** — เพราะมันไม่มีข้อมูลพอที่จะรู้ว่าเจตนาไหนถูก. conflict marker คือการยื่นหลักฐานทั้งสามชุดมาให้คนตัดสิน" },
      { code: String.raw`<<<<<<< HEAD
timeout = 30
||||||| ฐานร่วม            <-- เห็นได้เมื่อตั้ง merge.conflictstyle = zdiff3
timeout = 10
=======
timeout = 60
>>>>>>> feature/tuning`, cap: "zdiff3 แสดงบรรพบุรุษร่วมด้วย ทำให้เห็นว่า 'ใครเปลี่ยนจากอะไร' ไม่ใช่แค่ 'สองค่านี้ต่างกัน'", lang: "text" },
      { h: "🔬 เจาะลึก H: git ไม่เก็บการเปลี่ยนชื่อไฟล์" },
      { p: "ไม่มี object ชนิด 'rename'. การเปลี่ยนชื่อคือ tree เก่ามีชื่อ A ชี้ blob X, tree ใหม่มีชื่อ B ชี้ blob X เดิม. `git log --follow` และ `git blame -C` **ตรวจจับ** การย้ายด้วยความคล้ายของเนื้อหาตอนที่ขอ ไม่ได้อ่านจากบันทึก — เพราะงั้นการเปลี่ยนชื่อพร้อมแก้เนื้อหาหนัก ๆ ใน commit เดียวจึงทำให้ประวัติขาด. แยกเป็นสอง commit: ย้ายก่อน แก้ทีหลัง" },
      { h: "📖 อ่านเพิ่มเติม" },
      { links: [
        { label: "Pro Git (หนังสือฉบับเต็ม อ่านฟรี)", url: "https://git-scm.com/book/en/v2", note: "บทที่ 10 'Git Internals' คือส่วนที่ทำให้ทุกอย่างข้างบนกลายเป็นของจับต้องได้" },
        { label: "Git reference manual", url: "https://git-scm.com/docs", note: "หน้าอ้างอิงคำสั่งอย่างเป็นทางการ" },
        { label: "Think Like (a) Git", url: "https://think-like-a-git.net/", note: "อธิบาย DAG และ reachability แบบภาพ เหมาะกับคนที่ยังไม่เก็ตว่า reflog กู้ของยังไง" },
        { label: "Conventional Commits", url: "https://www.conventionalcommits.org/", note: "สเปกของรูปแบบข้อความ commit ที่เครื่องอ่านได้" },
        { label: "Semantic Versioning", url: "https://semver.org/", note: "นิยาม MAJOR.MINOR.PATCH ที่ tag ควรอ้างอิง" },
        { label: "git-filter-repo", url: "https://github.com/newren/git-filter-repo", note: "เครื่องมือเขียนประวัติใหม่ที่ git แนะนำแทน filter-branch" },
      ]},
    ],

    /* =========================== FOUNDATIONS =========================== */
    foundations: [
      { h: "1) สร้าง SSH key ครั้งแรก" },
      { code: String.raw`ssh-keygen -t ed25519 -C "you@example.com"   # ได้ ~/.ssh/id_ed25519 และ .pub
ssh-add ~/.ssh/id_ed25519                     # โหลดเข้า agent
ssh -T git@github.com                         # ทดสอบ ควรทักชื่อบัญชีเรากลับมา`, cap: "ใช้ ed25519 ไม่ใช่ RSA — สั้นกว่า เร็วกว่า และไม่มีคำถามเรื่องขนาดคีย์ให้ตอบผิด", lang: "bash" },
      { ul: [
        "`-C` คือ **ข้อความอิสระ** ใช้เป็นป้ายกำกับคีย์ ไม่ใช่ตัวตนที่เซิร์ฟเวอร์ตรวจ — จะใส่อะไรก็ได้ แต่ธรรมเนียมคืออีเมล",
        "**private key ไม่เคยออกจากเครื่อง** สิ่งที่แปะขึ้นเว็บคือไฟล์ `.pub` เท่านั้น",
        "passphrase คือสิ่งที่ทำให้ 'โน้ตบุ๊กหาย' ไม่เท่ากับ 'ตัวตนหาย' ส่วน `ssh-agent` คือสิ่งที่ทำให้ passphrase ไม่กลายเป็นความรำคาญทุกครั้งที่ push",
      ]},
      { h: "2) หลายบัญชีในเครื่องเดียว — จุดที่คนเจ็บที่สุด" },
      { code: String.raw`# ~/.ssh/config
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes

Host github-work              # ชื่อ host ปลอม ใช้เฉพาะกับ git
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
    IdentitiesOnly yes`, cap: "clone ด้วย git@github-work:org/repo.git จะใช้คีย์ที่ทำงาน", lang: "text" },
      { note: "`IdentitiesOnly yes` สำคัญกว่าที่เห็น: ถ้าไม่ใส่ ssh จะเสนอ **ทุกคีย์ที่รู้จัก** เซิร์ฟเวอร์รับตัวแรกที่ตรง แล้วเราก็ล็อกอินเป็นบัญชีผิดโดยไม่รู้ตัว. อาการที่ได้คือ `Repository not found` บน repo ที่เปิดในเบราว์เซอร์เห็นชัด ๆ — เพราะ host ตอบแบบนี้กับ 'มีอยู่ แต่คุณไม่มีสิทธิ์เห็น'" },
      { h: "3) คีย์แต่ละชนิดมีไว้ทำอะไร" },
      { table: { head: ["ชนิด", "ขอบเขต", "ใช้กับ"], rows: [
        ["personal SSH key", "ทุก repo ที่เราเข้าถึงได้", "เครื่องทำงานของเราเอง"],
        ["**deploy key**", "repo เดียว (อ่านอย่างเดียวโดยปริยาย)", "CI runner หรือเซิร์ฟเวอร์ที่ต้องการ repo เดียว"],
        ["machine user", "เท่าที่เราให้สิทธิ์", "ระบบอัตโนมัติที่ต้องใช้หลาย repo"],
        ["fine-grained PAT", "จำกัดสิทธิ์ + มีวันหมดอายุ", "HTTPS และ API — ดีกว่า token แบบเก่า"],
      ]}},
      { note: "**ห้ามเอา personal key ไปใส่ CI**. deploy key หลุด = เสีย repo เดียว. personal key หลุด = เสียทุกอย่างที่คีย์นั้นเข้าถึงได้ รวมถึง repo ของทีมอื่นที่เราบังเอิญมีสิทธิ์" },
      { h: "4) การเซ็น commit — เพราะชื่อผู้เขียนคือข้อความที่พิมพ์เอง" },
      { p: "`git commit --author=\"Linus <torvalds@example.com>\"` ทำได้จริงและเป็นการโกหก. ฟิลด์ author เป็น **ข้อความล้วน** ที่ใครก็พิมพ์ได้. การเซ็นคือสิ่งเดียวที่ทำให้ 'ใครเขียน' ตรวจสอบได้" },
      { code: String.raw`# เซ็นด้วย SSH key ที่มีอยู่แล้ว (git 2.34 ขึ้นไป) — ง่ายที่สุด
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true`, cap: "GPG ก็ใช้ได้และเป็นสิ่งที่องค์กรเก่า ๆ ใช้กัน แต่ SSH signing มีคีย์เดียวให้ดูแล", lang: "bash" },
      { p: "host จะขึ้นป้าย **Verified** ก็ต่อเมื่อเราอัปโหลดคีย์นั้นในช่อง **signing key** — อัปโหลดเป็น authentication key อย่างเดียวไม่พอ และนี่คือสาเหตุอันดับหนึ่งของ 'เซ็นแล้วแต่ไม่ขึ้น Verified'" },
      { note: "การเซ็นจะเป็น **มาตรการควบคุม** ก็ต่อเมื่อมีการ **บังคับ** — คือมี branch protection rule ที่ require signed commits. ถ้าไม่บังคับ มันคือของประดับ: คนที่อยากปลอมตัวก็แค่ไม่เซ็น" },
      { h: "5) ตั้ง identity แยกตามโฟลเดอร์ อย่าใช้ความจำ" },
      { p: "ปัญหาที่คนก่อกับตัวเองบ่อยที่สุดคือ commit เข้า repo ที่ทำงานด้วยอีเมลส่วนตัว. แก้เชิงโครงสร้าง ไม่ใช่แก้ด้วยการพยายามจำ" },
      { code: String.raw`# ~/.gitconfig
[user]
    name = Your Name
    email = personal@example.com
[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig-work

# ~/.gitconfig-work
[user]
    email = you@company.com
[commit]
    gpgsign = true`, cap: "ทุก repo ใต้ ~/work/ ใช้อีเมลบริษัทและเซ็นอัตโนมัติ โดยไม่ต้องตั้งค่ารายโปรเจกต์", lang: "text" },
      { p: "เพิ่ม `git config --global user.useConfigOnly true` เพื่อให้ git **ปฏิเสธที่จะ commit** เมื่อยังไม่ได้ตั้งอีเมล แทนที่จะเดาจากชื่อเครื่องแล้วได้ commit ที่ author เป็น `wiaon-in@DESKTOP-4F2A.(none)`" },
      { h: "6) .gitignore — และกับดักที่ทุกคนเจอครั้งหนึ่ง" },
      { code: String.raw`# 42 C project
*.o
*.a
*.dSYM/
a.out
push_swap
checker
.DS_Store`, cap: "ไฟล์แรกที่ควรมีใน repo 42 — binary ที่ commit ไปคือสิ่งที่กรรมการเห็นก่อนโค้ด", lang: "text" },
      { note: "**`.gitignore` มีผลกับไฟล์ที่ยังไม่ถูก track เท่านั้น**. ถ้าไฟล์ถูก track ไปแล้ว การเพิ่มเข้า .gitignore ไม่ทำอะไรเลย ต้อง `git rm --cached <file>` ก่อน. ส่วน ignore เฉพาะเครื่องตัวเองที่ไม่อยากแชร์ ให้ใส่ `.git/info/exclude`" },
      { h: "7) .gitattributes — ตัวแก้ปัญหา line ending ที่ยั่งยืน" },
      { code: String.raw`* text=auto
*.sh text eol=lf
*.bat text eol=crlf
*.png binary
*.psd filter=lfs diff=lfs merge=lfs -text`, cap: "commit ไฟล์นี้ไว้ แล้วมันมีผลกับทุกคนไม่ว่าเขาตั้ง config ไว้ยังไง", lang: "text" },
      { p: "`core.autocrlf` เป็นคำแนะนำเก่าและมีปัญหาตรงที่เป็น **ค่าตั้งของแต่ละเครื่อง** — คนใหม่ที่ไม่ได้ตั้งจะทำให้ commit แรกของเขาแสดงว่า 'ทุกบรรทัดของทุกไฟล์เปลี่ยน'. `.gitattributes` อยู่ใน repo จึงบังคับได้จริง และยังเป็นที่ตั้ง LFS filter, merge driver รายพาธ และ `linguist-*` ด้วย" },
    ],

    /* ========================== ARCHITECTURE ========================== */
    architecture: [
      { h: "merge หรือ rebase — สามทางเลือก ไม่ใช่สอง" },
      { table: { head: ["วิธี", "ประวัติที่ได้", "hash", "เหมาะกับ"], rows: [
        ["**merge**", "มี commit ที่มี 2 parent, ไม่เป็นเส้นตรง", "ไม่เปลี่ยน", "บันทึกความจริงว่าเคยแยกสายกัน"],
        ["**rebase**", "เส้นตรง อ่านง่าย", "**เปลี่ยนทุกตัวที่ถูก replay**", "จัด branch ของตัวเองให้ทันสมัยก่อนเปิด PR"],
        ["**squash merge**", "PR ทั้งอันเหลือ commit เดียว", "commit ใหม่ตัวเดียว", "main ที่ทุก commit เป็นหน่วยที่ผ่านรีวิวแล้ว"],
      ]}},
      { note: "กฎบ้านที่ใช้ได้จริง: **rebase branch ของตัวเองลงบน main เพื่อให้ทันสมัย แล้ว merge (หรือ squash-merge) เข้า main**. ได้ประวัติ feature ที่อ่านออกและ main ที่ทุก commit เป็นหน่วยที่ผ่านรีวิว" },
      { p: "fast-forward คือกรณีที่ branch เราอยู่ข้างหน้าล้วน ๆ git จึงแค่ขยับตัวชี้ได้เลย. `--no-ff` บังคับให้สร้าง merge commit เพื่อให้เห็นว่าเคยมี branch นี้อยู่, ส่วน `--ff-only` ปฏิเสธทุกอย่างที่ไม่ใช่ fast-forward ซึ่งเป็นวิธีรักษาให้ main เป็นเส้นตรง" },
      { h: "โมเดล branch — เลือกตามสิ่งที่ทีมส่งจริง" },
      { table: { head: ["โมเดล", "รูปร่าง", "เหมาะกับ"], rows: [
        ["**Trunk-based**", "branch อายุสั้น (< 1 วัน) เข้า main; ของที่ยังไม่เสร็จซ่อนด้วย feature flag; release จาก main", "continuous delivery — ทีมส่วนใหญ่"],
        ["**GitHub flow**", "branch → PR → review → merge → deploy", "web service"],
        ["**git-flow**", "`develop`, `release/*`, `hotfix/*`, `feature/*`", "ซอฟต์แวร์ที่มีหลายเวอร์ชันที่ยัง support อยู่"],
        ["**Release branch**", "ตัด `release/1.4` แล้ว cherry-pick fix เข้าไป", "อะไรก็ตามที่ลูกค้า pin เวอร์ชันไว้"],
      ]}},
      { p: "git-flow หนักกว่าที่ทีมส่วนใหญ่ต้องการ และเป็นคำตอบที่ถูกลอกกันมาโดยไม่คิด — ผู้คิดเองก็พูดทำนองนี้. เลือกมันเมื่อเรา **ส่งหลายเวอร์ชันที่ยัง support อยู่จริง ๆ** เท่านั้น" },
      { note: "ตัวแปรที่ทำนายความเจ็บปวดได้จริงไม่ใช่ชื่อโมเดล แต่คือ **อายุของ branch**. branch ที่เปิดค้างสามสัปดาห์แปลว่ามีหนี้การรวมโค้ดสามสัปดาห์ และไม่มีโมเดล branch ไหนแก้เรื่องนี้ได้" },
      { h: "tag และเลขเวอร์ชัน" },
      { code: String.raw`git tag -a v1.4.0 -m "Release 1.4.0"   # annotated: เป็น object จริง แท็กได้ เซ็นได้
git tag -s v1.4.0 -m "Release 1.4.0"   # signed
git push origin v1.4.0                 # tag ไม่ไปกับ git push ธรรมดา`, cap: "lightweight tag เป็นแค่ ref ไม่มีผู้แท็ก ไม่มีวันที่ ไม่มีข้อความ — อย่าใช้กับ release", lang: "bash" },
      { h: "monorepo หรือ polyrepo — เป็นการแลก ไม่ใช่การจัดอันดับ" },
      { table: { head: ["", "ได้", "ต้องจ่าย"], rows: [
        ["**monorepo**", "แก้ข้ามโปรเจกต์ได้ใน commit เดียว, มีความจริงชุดเดียว, refactor ทั้งองค์กรได้", "clone ใหญ่, CI ต้องกรองตามพาธ, ต้องใช้ sparse-checkout + partial clone"],
        ["**polyrepo**", "clone เล็ก, แต่ละทีมปล่อยเวอร์ชันเองได้", "การแก้ที่ตัดขวางกลายเป็น N PR ที่ต้องประสานกัน + การ pin เวอร์ชัน"],
      ]}},
      { h: "submodule หรือ subtree" },
      { p: "**submodule** บันทึกว่า repo อื่นถูก pin ไว้ที่ commit ไหน — มันยังเป็นคนละ repo และทุกคนต้องจำ `git submodule update --init --recursive` (หรือ clone ด้วย `--recurse-submodules`). **subtree** ก๊อปโค้ดเข้ามาเลย — ผู้ใช้ปลายทางไม่ต้องรู้อะไรเพิ่ม แต่การอัปเดตยุ่งกว่า" },
      { note: "submodule เป็นแหล่งกำเนิดของ 'บนเครื่องฉันมันรันได้' ที่พบบ่อย เพราะ submodule ที่ยังไม่ได้ update จะอยู่ในสถานะ detached และ **มองไม่เห็นใน `git status`** ถ้าไม่ตั้งใจดู" },
      { h: "โครงสร้างที่ทำให้ repo อยู่ได้นาน" },
      { ul: [
        "**ห้าม commit build artifact หรือ dependency** — เป็นสาเหตุหลักของ repo ที่ clone ไม่ไหว และ git บีบอัด binary แทบไม่ได้",
        "**track lockfile** (`package-lock.json`, `Cargo.lock`) — มันคือบันทึกว่าจริง ๆ แล้ว build ด้วยอะไร",
        "`.gitattributes` + `.gitignore` + `CODEOWNERS` เป็นไฟล์โครงสร้าง ไม่ใช่ไฟล์เสริม — ใส่ตั้งแต่ commit แรก",
        "`.git-blame-ignore-revs` สำหรับ commit ที่จัดฟอร์แมตทั้ง repo เพื่อไม่ให้มันบัง blame ของจริง",
      ]},
    ],

    /* ============================= DATAFLOW ============================= */
    dataflow: [
      { h: "วงจรงานประจำวัน" },
      { code: String.raw`แก้ไฟล์
  |  git add -p            <- อ่าน diff ตัวเองทีละ hunk
  v
index
  |  git commit            <- ไม่ใส่ -m: เขียนข้อความจริงใน editor
  v
local repo
  |  git push -u origin feat
  v
remote
  |  เปิด PR -> review -> CI -> merge
  v
main -> deploy`, cap: "add -p คือนิสัยเดียวที่ยกระดับคุณภาพ commit ได้มากที่สุด เพราะมันบังคับให้อ่าน diff ของตัวเอง", lang: "text" },
      { h: "fetch กับ pull ต่างกันตรงไหน" },
      { table: { head: ["คำสั่ง", "ทำอะไร", "ปลอดภัยแค่ไหน"], rows: [
        ["`git fetch`", "ดาวน์โหลดอย่างเดียว ไม่แตะอะไรในเครื่อง", "ปลอดภัยเสมอ"],
        ["`git pull`", "fetch **แล้ว merge (หรือ rebase)** — สองปฏิบัติการในคำสั่งเดียว", "สร้าง merge commit ที่ไม่ได้ตั้งใจได้"],
        ["`git pull --ff-only`", "fetch แล้วขยับตัวชี้ ถ้าขยับไม่ได้ก็หยุด", "คาดเดาได้ — ตั้งเป็นค่าตั้งต้น"],
      ]}},
      { code: String.raw`git config --global pull.ff only          # หรือ pull.rebase true
git config --global push.default simple
git config --global push.autoSetupRemote true
git config --global fetch.prune true`, cap: "ตั้งครั้งเดียวแล้ว pull เลิกเซอร์ไพรส์ตลอดชีวิต", lang: "bash" },
      { h: "วงจร PR — จุดที่ 'นโยบาย' กลายเป็นของจริง" },
      { p: "PR ที่ดีคือ **เล็ก มีจุดประสงค์เดียว และอธิบายว่าทำไม**. ผู้รีวิวจับปัญหาเชิงออกแบบได้ใน 200 บรรทัด และกดผ่านแบบไม่ได้อ่านที่ 2000 บรรทัด — นี่ไม่ใช่เรื่องวินัยของผู้รีวิว แต่เป็นข้อจำกัดที่วัดได้" },
      { table: { head: ["การควบคุมฝั่ง host", "ผลจริง"], rows: [
        ["protected branch", "push ตรงเข้า main ไม่ได้ ต้องผ่าน PR"],
        ["required reviews", "ต้องอนุมัติ N คน; ล้างการอนุมัติเมื่อมี commit ใหม่"],
        ["**CODEOWNERS**", "คนที่ควรรีวิวถูกเรียกอัตโนมัติและถูกบังคับ"],
        ["required status checks", "CI ต้องผ่าน; ตัวเลือก 'ต้องทันกับ base' บังคับให้ rebase ก่อน merge"],
        ["linear history required", "บล็อก merge commit — ใช้คู่กับ squash หรือ rebase merge"],
        ["**merge queue**", "ทดสอบ PR แต่ละอันกับ *ผลลัพธ์หลัง merge* โดยเรียงคิว"],
        ["require signed commits", "ปฏิเสธ commit ที่ไม่ได้เซ็น"],
        ["จำกัดคนที่ force-push / ลบ branch ได้", "โดยปกติคือ ไม่มีใครเลย"],
      ]}},
      { note: "merge queue มีอยู่เพราะ 'CI ผ่านบน branch ของ PR' กับ 'CI ผ่านบน main หลัง merge' เป็นคนละประโยค. PR สองอันที่ผ่านแยกกันสามารถทำ main พังพร้อมกันได้. ถ้าไม่มีคิว ทางแก้คือบังคับ 'ต้องทันกับ base' ซึ่งก็คือการเรียงคิวด้วยมือ" },
      { h: "hook ไม่ใช่การบังคับใช้" },
      { p: "`pre-commit` รันบนเครื่องนักพัฒนา และถูกข้ามได้ด้วย `--no-verify` เสมอ. ใช้ hook เพื่อ **ผลตอบกลับเร็ว** ใช้ CI เป็น **ประตู**. `core.hooksPath` ให้ทีมแชร์ hook จากไดเรกทอรีที่ track ไว้ได้ — แต่มันก็ยังเป็นความสะดวก ไม่ใช่การบังคับ" },
      { h: "commit message ที่ทำงานร่วมกับเครื่องมือ" },
      { code: String.raw`feat(parser): support --bench flag on stderr

อธิบายว่าทำไมต้องมีการเปลี่ยนนี้ และมันทำอะไรในระดับที่ diff บอกไม่ได้
ตัดบรรทัดที่ 72 คอลัมน์

Refs: PROJ-1234`, cap: "หัวเรื่อง <= 50 ตัวอักษร, ประโยคคำสั่ง (add ไม่ใช่ added), ไม่ต้องมีจุดท้าย", lang: "text" },
      { p: "ที่ต้องเป็นประโยคคำสั่งเพราะข้อความนี้ไปเติมประโยค 'การใช้ commit นี้จะ…' ซึ่งเป็นสิ่งที่ `merge`, `revert` และ `cherry-pick` สร้างให้อัตโนมัติ. หัวเรื่องคือส่วนที่ทุกคนจะอ่านใน `git log --oneline` ไปตลอดกาล — ใช้เวลากับมัน" },
      { note: "**Conventional Commits** (`feat:` `fix:` `docs:` `refactor:` `test:` `chore:` + `!` หรือ footer `BREAKING CHANGE:`) มีประโยชน์เมื่อมีเครื่องมือกินมันจริง — changelog อัตโนมัติและการขยับ semver ด้วย semantic-release. รับมาโดยไม่มีเครื่องมือ = พิธีกรรม. รับมาพร้อมเครื่องมือ = ตัดการเถียงเรื่อง release ออกไปทั้งชั้น" },
    ],

    /* ========================== IMPLEMENTATION ========================== */
    implementation: [
      { h: "1) ตารางเลิกทำ — เลือกให้ถูกตัว" },
      { table: { head: ["สถานการณ์", "คำสั่ง", "เขียนประวัติใหม่ไหม"], rows: [
        ["แก้ commit ล่าสุด (ข้อความหรือเนื้อหา)", "`git commit --amend`", "ใช่"],
        ["ยุบ 3 commit ล่าสุดเป็นอันเดียว", "`git reset --soft HEAD~3` แล้ว commit ใหม่", "ใช่"],
        ["จัดเรียง/ยุบ/ลบ commit หลายตัว", "`git rebase -i HEAD~5`", "ใช่"],
        ["ก๊อป commit เดียวมาที่ branch นี้", "`git cherry-pick <sha>`", "ไม่ (สร้างใหม่)"],
        ["เลิกทำ commit ที่ push ไปแล้ว", "**`git revert <sha>`**", "**ไม่ — ทางเดียวที่ปลอดภัย**"],
        ["ทิ้งการแก้ในไฟล์ที่ยังไม่ stage", "`git restore <path>`", "ไม่"],
        ["เอาไฟล์ออกจาก staging", "`git restore --staged <path>`", "ไม่"],
        ["เก็บงานค้างไว้ก่อนชั่วคราว", "`git stash push -m \"wip\"`", "ไม่"],
      ]}},
      { note: "**กฎ:** เขียนประวัติใหม่ได้ตามใจบน branch ที่มีเราคนเดียว; **ห้ามเขียนทับสิ่งที่คนอื่น pull ไปแล้ว** ให้ revert แทน. ประวัติที่แชร์แล้วถูกเขียนใหม่จะบังคับให้ทุกคนต้องกู้สถานการณ์ที่เขาไม่ได้ขอ และมักรู้ตัวหลังจากมีคน push commit เก่ากลับขึ้นไปแล้ว" },
      { h: "2) rebase -i กับ autosquash" },
      { code: String.raw`git rebase -i HEAD~5
# pick    = เอาไว้
# reword  = แก้ข้อความ
# squash  = ยุบเข้ากับตัวบน รวมข้อความ
# fixup   = ยุบเข้ากับตัวบน ทิ้งข้อความ
# edit    = หยุดตรงนั้นให้แก้
# drop    = ทิ้ง

# วิธีที่ไม่ต้องเรียงเอง:
git commit --fixup=<sha>          # ทำเครื่องหมายไว้ตอนนี้
git rebase -i --autosquash HEAD~10  # git จัดลำดับให้เอง`, cap: "autosquash ทำให้ 'แก้ทีหลังแล้วค่อยยุบ' เป็นเรื่องอัตโนมัติแทนที่จะเป็นการลากบรรทัดในไฟล์ todo", lang: "bash" },
      { h: "3) conflict — และวิธีไม่แก้ซ้ำ" },
      { code: String.raw`# ระหว่าง merge/rebase
git status                       # ดูว่าไฟล์ไหนค้าง
# แก้ไฟล์ ลบ marker ให้หมด
git add <file>
git rebase --continue            # หรือ git merge --continue

git rebase --abort               # กลับไปจุดก่อนหน้าเสมอ ไม่มีอะไรเสีย

git config --global rerere.enabled true`, cap: "rerere = reuse recorded resolution: จำวิธีแก้แล้วเล่นซ้ำให้", lang: "bash" },
      { p: "บน branch อายุยาวที่ต้อง rebase ซ้ำ ๆ **rerere คือความต่างระหว่างแก้ conflict เดิมครั้งเดียวกับแก้มันสิบสองรอบ**. คู่กับ `merge.conflictstyle = zdiff3` ที่แสดงบรรพบุรุษร่วม ทำให้เห็นทันทีว่าใครเปลี่ยนจากอะไร" },
      { h: "4) push ที่ปลอดภัย" },
      { code: String.raw`git push --force-with-lease --force-if-includes`, cap: "ปฏิเสธถ้า remote ขยับตั้งแต่ fetch ครั้งล่าสุด — คือปฏิเสธพอดีในกรณีที่เรากำลังจะลบงานคนอื่น", lang: "bash" },
      { p: "`git push --force` เฉย ๆ **ไม่ตรวจอะไรเลย** มันแค่ทับ. ตั้ง alias ให้แบบปลอดภัยเป็นแบบที่พิมพ์ง่ายกว่า แล้วเราจะไม่มีวันพิมพ์แบบอันตรายเพราะขี้เกียจ" },
      { code: String.raw`git config --global alias.pushf "push --force-with-lease --force-if-includes"`, cap: "พิมพ์ git pushf สั้นกว่า git push --force ด้วยซ้ำ", lang: "bash" },
      { h: "5) reflog — กู้เกือบทุกอย่าง" },
      { code: String.raw`git reflog                      # ทุกการขยับของ HEAD ราว 90 วัน
git reset --hard HEAD@{3}       # ย้อนไปก่อนพลาด
git branch recovered <sha>      # หรือช่วยมันขึ้นมาในชื่อใหม่

git fsck --lost-found           # เมื่อแม้แต่ reflog ก็ไม่มีแล้ว`, cap: "commit ที่ 'หายไป' ยังอยู่ใน object store จนกว่า gc จะเก็บ — reflog คือแผนที่ไปหามัน", lang: "bash" },
      { h: "6) bisect — หา commit ที่ทำพัง" },
      { code: String.raw`git bisect start
git bisect bad                  # ตอนนี้พัง
git bisect good v1.3            # ตอน v1.3 ยังดี
# git จะ checkout จุดกึ่งกลางให้ ตอบ good หรือ bad ไปเรื่อย ๆ

git bisect run ./test.sh        # อัตโนมัติเต็มรูปแบบ: script ที่ exit != 0 เมื่อพัง
git bisect reset`, cap: "binary search บนประวัติ — 1000 commit ใช้ราว 10 ขั้น", lang: "bash" },
      { h: "7) ค้นประวัติ — pickaxe และ blame" },
      { code: String.raw`git log -S "connectTimeout"     # commit ที่ทำให้ "จำนวนครั้ง" ของข้อความนี้เปลี่ยน
git log -G "regex"              # commit ที่ diff ตรงกับ regex
git log --follow -- path        # ไล่ข้ามการเปลี่ยนชื่อไฟล์
git blame -w -C -L 40,60 file   # -w เมิน whitespace, -C ตามโค้ดที่ถูกย้าย`, cap: "log -S ตอบคำถาม 'บรรทัดนี้ถูกเพิ่มหรือลบตอนไหน' ได้เร็วกว่าการไล่อ่าน log", lang: "bash" },
      { p: "`git blame` ตอบว่า 'commit ไหน' ไม่ได้ตอบว่า 'จะโทษใคร' — ผลลัพธ์ที่มีค่าคือข้อความ commit และ PR ของมัน. commit ที่จัดฟอร์แมตทั้งไฟล์ให้ใส่ `.git-blame-ignore-revs` แล้วตั้ง `blame.ignoreRevsFile` เพื่อไม่ให้มันบังผู้เขียนตัวจริง" },
      { h: "8) secret หลุด — ลำดับสำคัญกว่าคำสั่ง" },
      { ul: [
        "**1. เพิกถอน/หมุนคีย์ก่อน** มันอยู่ในทุก clone ทุก fork ทุก CI cache และน่าจะอยู่ในฐานข้อมูลของ scraper แล้ว — การเขียนประวัติใหม่ไม่ทำให้มัน 'ไม่หลุด'",
        "**2. ค่อยลบออกจากประวัติ** ด้วย `git filter-repo --path config/secrets.yml --invert-paths` (BFG เป็นตัวเลือกเก่ากว่า, `filter-branch` เลิกใช้แล้วและช้ามาก)",
        "**3. force-push แล้วให้ทุกคน clone ใหม่** และขอให้ host เก็บกวาด — commit ที่ถูกเขียนใหม่ยังเข้าถึงได้ผ่าน PR ref และ fork จนกว่าเขาจะ gc",
      ]},
      { note: "การเขียนประวัติใหม่ทำให้ **ทุก hash เปลี่ยน** ซึ่งพังลิงก์ทั้งหมด, signed tag ทั้งหมด และทุกอย่างที่เคยอ้างถึง commit — อีกหนึ่งเหตุผลที่ 'หมุนคีย์' คือทางแก้จริง ส่วนการล้างประวัติเป็นการทำความสะอาดตามหลัง. ป้องกันดีกว่า: `gitleaks` / `trufflehog` ใน CI, push protection ฝั่ง host, และ `.gitignore` สำหรับไฟล์ทรง `.env`" },
      { h: "9) repo ใหญ่ — เครื่องมือตามอาการ" },
      { table: { head: ["อาการ", "เครื่องมือ", "ข้อควรระวัง"], rows: [
        ["clone ใหญ่เพราะประวัติยาว", "`git clone --filter=blob:none`", "ดึง blob ตอนที่ต้องใช้ ต้องต่อเน็ตได้"],
        ["CI ต้องการแค่ยอด", "`git clone --depth 1`", "**พัง `merge-base`, blame และ diff ของ PR**"],
        ["ทำงานแค่บางโฟลเดอร์", "`git sparse-checkout set apps/web`", "-"],
        ["ไฟล์ binary ใหญ่", "**git LFS**", "ต้องตั้งค่าฝั่ง server ด้วย"],
        ["ต้องเปิดหลาย branch พร้อมกัน", "`git worktree add ../hotfix main`", "clone เดียว หลาย checkout"],
        ["repo ช้าลงเรื่อย ๆ", "`git maintenance start`", "ตั้ง gc/commit-graph/prefetch ตามเวลา"],
      ]}},
    ],

    /* ============================== TRICKS ============================== */
    tricks: [
      { h: "ทริค 1: `git add -p` ทุกครั้ง" },
      { p: "มันบังคับให้เราอ่าน diff ของตัวเองก่อนคนอื่นอ่าน และทำให้ 'หนึ่ง commit หนึ่งการเปลี่ยนแปลง' เป็นเรื่องธรรมชาติแทนที่จะเป็นอุดมคติ. บั๊กจำนวนมากถูกจับได้ตรงนี้ก่อนถึง CI ด้วยซ้ำ" },
      { h: "ทริค 2: commit บ่อยแล้วค่อยจัดทีหลัง" },
      { p: "commit คือ save point ที่ reflog กู้ได้ ส่วนงานที่ยังไม่ commit ไม่มีอะไรกู้. commit รก ๆ 8 อันแล้ว `rebase -i` ให้เหลือ 2 อันที่อ่านรู้เรื่อง ปลอดภัยกว่าการเขียนยาว ๆ แล้วค่อย commit ครั้งเดียวเสมอ" },
      { h: "ทริค 3: `--force-with-lease` เป็น alias ให้พิมพ์สั้นกว่า" },
      { p: "ความปลอดภัยที่พิมพ์ยากกว่าจะแพ้ความเร็วเสมอในวันที่รีบ. ทำให้ทางที่ปลอดภัยเป็นทางที่ขี้เกียจกว่า" },
      { h: "ทริค 4: เปิด rerere ตั้งแต่วันแรก" },
      { p: "มันไม่มีข้อเสีย และวันที่เราต้องการมันคือวันที่ rebase branch ยาว ๆ ครั้งที่สาม ซึ่งสายเกินจะเปิดย้อนหลังแล้ว" },
      { h: "ทริค 5: `includeIf` แทนการจำว่าอยู่ repo ไหน" },
      { p: "อีเมลผิดใน commit แก้ย้อนหลังได้แค่ด้วยการเขียนประวัติใหม่ ซึ่งบน branch ที่แชร์แล้วแปลว่าแก้ไม่ได้จริง. ตั้งค่าเชิงโครงสร้างครั้งเดียวจบ" },
      { h: "ทริค 6: `git switch` / `git restore` แทน `git checkout`" },
      { p: "`checkout` ทำได้ทั้งย้าย branch, สร้าง branch, กู้ไฟล์ และทิ้งการแก้ — ความกำกวมนี้คือเหตุผลที่มันทำให้คนสับสนอยู่สิบปี. คำสั่งใหม่แยกหน้าที่ชัด และที่สำคัญกว่าคือ **อ่านออกตอนอยู่ในเอกสารทีม**" },
      { h: "ทริค 7: PR เล็กคือเครื่องมือด้านคุณภาพ ไม่ใช่มารยาท" },
      { p: "ความสามารถในการจับ defect ของผู้รีวิวตกลงตามขนาด diff อย่างชัดเจน. PR 2000 บรรทัดไม่ได้ 'ถูกรีวิวช้า' — มันไม่ได้ถูกรีวิวเลย. แตกงานให้ merge ได้ทีละชิ้นแม้ฟีเจอร์ยังไม่เสร็จ โดยซ่อนหลัง feature flag" },
      { h: "ทริค 8: `git log --oneline --graph --decorate --all` เป็น alias" },
      { p: "การเห็นรูปร่างของ DAG ก่อนตัดสินใจ merge/rebase ทำให้ผิดพลาดน้อยลงมาก. ตั้งเป็น `git lg` แล้วใช้มันแทน `git log` เปล่า ๆ" },
      { h: "ทริค 9: อ่าน error ของ push ให้ออก" },
      { p: "`! [rejected] non-fast-forward` แปลว่า **remote มี commit ที่เราไม่มี** ไม่ได้แปลว่า git งอแง. ทางแก้คือ `git pull --rebase` แล้ว push — ไม่ใช่ `--force` ซึ่งเป็นการตอบว่า 'ลบของที่ฉันไม่มีทิ้งไป'" },
      { h: "ทริค 10: `.gitattributes` ก่อนคนที่สองเข้าโปรเจกต์" },
      { p: "ถ้าใส่หลังจากมีคน Windows commit ไปแล้ว เราจะได้ commit 'แก้ line ending ทั้ง repo' หนึ่งอันที่บัง blame ของทุกไฟล์ — แล้วต้องเอามันไปใส่ `.git-blame-ignore-revs` อีกที" },
    ],

    /* =============================== EVAL =============================== */
    eval: [
      { h: "คำถามทบทวน" },
      { qa: [
        { q: "commit เก็บ diff หรือ snapshot?", a: "snapshot — เก็บ tree ทั้งต้น. diff ถูกคำนวณตอนที่ขอโดยเทียบ tree สองอัน. การบีบอัดแบบ delta เกิดใน packfile ตอน gc ซึ่งเป็นคนละชั้นกับโมเดลข้อมูล" },
        { q: "ทำไมการสร้าง branch ใน git ถึงถูก?", a: "branch คือไฟล์ที่บรรจุ hash ขนาดราว 41 ไบต์ การสร้าง branch = เขียนไฟล์หนึ่งไฟล์ ไม่ได้ก๊อปอะไรเลย" },
        { q: "reset --soft, --mixed, --hard ต่างกันยังไง?", a: "ทั้งสามขยับ HEAD. --soft ไม่แตะ index และ working tree; --mixed (ค่าตั้งต้น) รีเซ็ต index; --hard รีเซ็ตทั้ง index และ working tree ซึ่งเป็นตัวเดียวที่ทำให้งานที่ยังไม่ commit หายถาวร" },
        { q: "merge กับ rebase เลือกยังไง?", a: "rebase branch ของตัวเองเพื่อให้ทันสมัย (hash เปลี่ยน แต่ยังไม่มีใครใช้), merge หรือ squash-merge เข้า main. ห้าม rebase ประวัติที่คนอื่น pull ไปแล้ว — ใช้ revert แทน" },
        { q: "`--force` กับ `--force-with-lease` ต่างกันตรงไหน?", a: "--force ทับโดยไม่ตรวจ. --force-with-lease ปฏิเสธถ้า remote ขยับไปตั้งแต่ fetch ครั้งล่าสุด คือปฏิเสธพอดีในกรณีที่เรากำลังจะลบ commit ของคนอื่น" },
        { q: "commit หายไปหลัง reset --hard กู้ได้ไหม?", a: "ถ้ามันเคยถูก commit — ได้ ด้วย `git reflog` แล้ว `git reset --hard HEAD@{n}` หรือ `git branch ชื่อใหม่ <sha>`. ถ้ายังไม่เคย commit — ไม่ได้ เพราะมันไม่เคยเป็น object" },
        { q: "ทำไม commit ของเราไม่ขึ้น Verified?", a: "ส่วนใหญ่เพราะอัปโหลดคีย์ในช่อง authentication key ไม่ใช่ signing key หรือยังไม่ได้เปิด `commit.gpgsign`" },
        { q: "deploy key ต่างจาก personal SSH key ยังไง ทำไมต้องแยก?", a: "deploy key ผูกกับ repo เดียวและอ่านอย่างเดียวโดยปริยาย ส่วน personal key เข้าถึงทุก repo ที่เรามีสิทธิ์. ถ้า CI ถือ personal key แล้วหลุด ผู้โจมตีได้ทุกอย่างที่เราเข้าถึงได้ ไม่ใช่แค่ repo นั้น" },
        { q: "`IdentitiesOnly yes` มีไว้ทำไม?", a: "ให้ ssh เสนอเฉพาะคีย์ที่ระบุใน config. ถ้าไม่ใส่ ssh จะเสนอทุกคีย์ เซิร์ฟเวอร์รับตัวแรกที่ตรง แล้วเราจะล็อกอินเป็นบัญชีผิด อาการคือ Repository not found บน repo ที่เห็นได้ในเบราว์เซอร์" },
        { q: "`.gitignore` เพิ่มแล้วไฟล์ยังขึ้นใน status เพราะอะไร?", a: "เพราะไฟล์นั้นถูก track ไปแล้ว .gitignore มีผลกับไฟล์ที่ยังไม่ track เท่านั้น ต้อง `git rm --cached <file>` ก่อน" },
        { q: "shallow clone (`--depth 1`) มีข้อเสียอะไร?", a: "ไม่มีบรรพบุรุษให้คำนวณ merge-base จึงพัง `git merge-base`, `git blame` และ CI ที่คำนวณ 'ไฟล์ที่เปลี่ยนใน PR'. ถ้าต้องการแค่ประหยัดพื้นที่แต่ยังต้องการประวัติ ให้ใช้ `--filter=blob:none` แทน" },
        { q: "merge queue แก้ปัญหาอะไรที่ required check แก้ไม่ได้?", a: "required check พิสูจน์ว่า CI ผ่านบน branch ของ PR ไม่ได้พิสูจน์ว่าผ่านบน main หลัง merge. PR สองอันที่ผ่านแยกกันทำ main พังพร้อมกันได้ merge queue ทดสอบผลลัพธ์หลัง merge ทีละคิว" },
        { q: "pre-commit hook ใช้แทน CI ได้ไหม?", a: "ไม่ได้ มันรันบนเครื่องนักพัฒนาและถูกข้ามด้วย `--no-verify` เสมอ ใช้ hook เพื่อผลตอบกลับเร็ว ใช้ CI เป็นประตูจริง" },
        { q: "secret หลุดขึ้น repo ควรทำอะไรก่อน?", a: "หมุน/เพิกถอนคีย์ก่อนเป็นอันดับแรก เพราะมันอยู่ในทุก clone ทุก fork และ CI cache แล้ว. การล้างประวัติด้วย filter-repo เป็นขั้นตอนที่สอง ไม่ใช่ทางแก้" },
        { q: "submodule กับ subtree ต่างกันยังไง?", a: "submodule ชี้ไปยัง repo อื่นที่ pin ไว้ที่ commit หนึ่ง ผู้ใช้ต้อง `git submodule update --init --recursive` เอง. subtree ก๊อปโค้ดเข้ามาใน repo เลย ผู้ใช้ไม่ต้องทำอะไรเพิ่มแต่การอัปเดตยุ่งกว่า" },
        { q: "ทำไม rebase ประวัติที่แชร์แล้วถึงอันตราย?", a: "hash ของ commit ครอบ parent ด้วย การแก้อดีตจึงเปลี่ยน hash ของทุก commit หลังจากนั้น. คนอื่นที่มี commit เดิมอยู่จะได้ประวัติสองสายที่ดูเหมือนกันแต่คนละ hash และมัก push ของเก่ากลับขึ้นไปโดยไม่รู้ตัว" },
        { q: "rerere คืออะไร ใช้ตอนไหน?", a: "reuse recorded resolution — จำวิธีแก้ conflict แล้วเล่นซ้ำ. คุ้มที่สุดบน branch อายุยาวที่ต้อง rebase ซ้ำหลายรอบ ควรเปิดตั้งแต่วันแรกเพราะเปิดย้อนหลังไม่ช่วยรอบที่ผ่านมา" },
        { q: "ในบริบท 42 อะไรที่ต้องระวังที่สุด?", a: "moulinette clone สิ่งที่อยู่บน vogsphere เท่านั้น — อะไรที่ยังไม่ push เท่ากับไม่มี. และห้าม commit binary (`*.o`, `*.a`, ไฟล์โปรแกรม) เพราะบางโจทย์ระบุไฟล์ที่ส่งได้เป๊ะ ๆ และห้ามมีไฟล์เกิน" },
      ]},
    ],
  }
});

Object.assign(window.TEACHING_EN, {
  tool_git: {

    principle: [
      { p: "Heads up: most people learn git as a **list of commands to memorise**, then break every time they hit a situation the list does not cover. This page goes the other way — start from the data structure git actually uses, and almost every command becomes something you can **derive** rather than recall." },
      { h: "What git actually is, in one sentence" },
      { p: "Git is a **content-addressed object store with a pointer convention layered on top**. That is the whole thing — everything else is detail." },
      { p: "Objects are stored under the hash of their own content, and the 'pointers' (branches, tags, HEAD) are just files containing a hash. `git branch feat` writes a 41-byte file — **that alone is why branching in git is cheap enough to have changed how the industry works**, where SVN's was expensive enough to discourage it." },
      { h: "The three places a file can live" },
      { code: String.raw`working tree  --git add-->  index (staging)  --git commit-->  repository
  the real files            .git/index                    .git/objects
  you are editing           the next commit's tree        permanent objects`, cap: "The index is a real file, not a vague concept — knowing it exists is what makes the three resets legible", lang: "text" },
      { h: "What this page covers" },
      { ul: [
        "**Identity and keys** — ssh-keygen, ssh-agent, several accounts on one machine, deploy keys, commit signing",
        "**The object model** — blob/tree/commit/tag, refs, HEAD, the index, the DAG, and why rebase changes hashes",
        "**Everyday work** — add -p, commit messages that earn their keep, .gitignore, .gitattributes",
        "**Rewriting history** — amend, the three resets, rebase -i, cherry-pick, revert, reflog",
        "**Working as a team** — merge vs rebase, PRs, CODEOWNERS, protected branches, required checks, merge queues",
        "**Enterprise scale** — monorepo vs polyrepo, partial/shallow clone, sparse-checkout, LFS, submodule vs subtree",
        "**Security** — leaked secrets, enforced signing, an audit trail that cannot be quietly edited",
        "**Recovery** — reflog, bisect, filter-repo, undoing a force push that ate someone's work",
      ]},
      { h: "The one rule to hold before anything else" },
      { note: "**Almost nothing that has been committed is ever truly lost** — the reflog keeps every move of HEAD for around 90 days. The single exception is work that was **never committed** and got overwritten by `git reset --hard`: it was never an object, so there is nothing to recover. That is the argument for committing early and messily — a commit is a save point, and the mess can be tidied later with `rebase -i`." },
      { h: "Why this matters at 42" },
      { p: "Intra gives you a **vogsphere** remote per project, and the moulinette clones exactly what is on that remote — **anything not pushed does not exist** at correction time. And push_swap v1.1 being a two-person group project makes a branch per person, small PRs and a shared `.gitignore` a requirement rather than a nicety." },
    ],

    theory: [
      { h: "🔬 Deep dive A: the four object types" },
      { p: "Everything in git is one of four objects, each named by the hash of its own content." },
      { table: { head: ["Object", "Holds", "Does not hold"], rows: [
        ["**blob**", "file contents", "the file name, the permissions"],
        ["**tree**", "one directory: names → blobs/trees, plus modes", "file contents"],
        ["**commit**", "one tree + parent(s) + author/committer + message", "a diff"],
        ["**tag** (annotated)", "the object it points at + tagger + message + signature", "-"],
      ]}},
      { h: "🔬 Deep dive B: a commit is a snapshot, not a diff" },
      { p: "This is where people coming from SVN misread git most often. A commit stores the **whole tree**, not 'what changed'. Diffs are **computed on demand** by comparing two trees." },
      { ul: [
        "That is why `git checkout` is fast — it unpacks a tree, it does not replay accumulated diffs",
        "That is why `git log -p` gets slow over long history — it has to compute a diff per pair",
        "That is why **identical content is stored once** — two paths with the same bytes are one blob, whether in the same commit or different branches",
      ]},
      { note: "So why doesn't the repository explode? Because git builds **packfiles** during gc, where similar objects are stored as deltas after the fact. Snapshots are the **model**; deltas are the **on-disk compression**. Those two layers are separate — and it is why binaries bloat a repository, since delta compression barely works on them." },
      { h: "🔬 Deep dive C: the hash covers the parent too" },
      { code: String.raw`commit c3  <- hash computed from: tree + parent(c2) + author + message
   |
commit c2  <- hash computed from: tree + parent(c1) + ...
   |
commit c1`, cap: "Because a commit's hash includes its parent's hash, one hash covers the entire history behind it", lang: "text" },
      { p: "Two consequences, both load-bearing. **(1)** Change anything historical and every later hash changes — that is the direct reason rebasing shared history is disruptive. **(2)** A single hash is a **tamper-evident receipt** for exactly what the code was, which is the foundation of signed tags, provenance and SBOMs." },
      { h: "🔬 Deep dive D: refs, HEAD, and branches as files" },
      { code: String.raw`.git/refs/heads/main      -> "a1b2c3d4..."      a branch is a file with a hash
.git/refs/tags/v1.4.0     -> "e5f6a7b8..."      so is a tag
.git/HEAD                 -> "ref: refs/heads/main"

detached HEAD:
.git/HEAD                 -> "a1b2c3d4..."      points at a commit directly`, cap: "A detached HEAD is not an error — it is just a position with no name", lang: "text" },
      { p: "A branch is a pointer that **moves when you commit**. A tag is a pointer that **does not**. HEAD is 'where am I right now'. That is genuinely all — and it is why `git branch` creates a branch in the time it takes to write a file." },
      { h: "🔬 Deep dive E: the index, the step everyone skips" },
      { p: "Plenty of people use `git commit -am` for years without knowing the index exists. But the index is what collapses the three resets into one readable table." },
      { table: { head: ["Command", "HEAD", "index", "working tree"], rows: [
        ["`reset --soft <c>`", "moves", "untouched", "untouched"],
        ["`reset --mixed <c>` (default)", "moves", "reset", "untouched"],
        ["`reset --hard <c>`", "moves", "reset", "**overwritten — the one that loses work**"],
      ]}},
      { p: "Read that table and the popular trick stops being a trick: `git reset --soft HEAD~3` means 'go back three commits but keep everything staged', which is how you collapse three commits into one without opening a rebase." },
      { h: "🔬 Deep dive F: the DAG and the merge base" },
      { code: String.raw`      A---B---C  feature
     /
D---E---F---G  main

merge base of feature and main = E
three-way merge compares: E (base) vs C (ours) vs G (theirs)`, cap: "Git does not guess from two versions of a file — it compares three, using the common ancestor as the base", lang: "text" },
      { p: "**The merge base is the heart of merge, rebase, PR diffs and CI alike.** Clone with `--depth 1` and it may not exist locally at all — which is why shallow clones break `git merge-base`, `git blame`, and any CI step that computes 'the files this PR changed', in ways that look mysterious." },
      { h: "🔬 Deep dive G: a conflict is git declining to guess" },
      { p: "A three-way merge resolves itself when only one side touched the region. When both sides changed the same lines relative to the base, git **will not choose** — it has no information about which intent is right. The conflict markers hand you all three pieces of evidence and let you decide." },
      { code: String.raw`<<<<<<< HEAD
timeout = 30
||||||| common ancestor    <-- appears when merge.conflictstyle = zdiff3
timeout = 10
=======
timeout = 60
>>>>>>> feature/tuning`, cap: "zdiff3 shows the common ancestor, so you see who changed what from where, not just that two values differ", lang: "text" },
      { h: "🔬 Deep dive H: git does not record renames" },
      { p: "There is no 'rename' object. A rename is: the old tree had name A pointing at blob X, the new tree has name B pointing at the same blob X. `git log --follow` and `git blame -C` **detect** moves by content similarity at query time — they are not reading a record. Which is why renaming and heavily editing a file in one commit breaks history tracking. Split it: move first, edit second." },
      { h: "📖 Further reading" },
      { links: [
        { label: "Pro Git (the full book, free)", url: "https://git-scm.com/book/en/v2", note: "Chapter 10, 'Git Internals', is what turns everything above into something you can poke at" },
        { label: "Git reference manual", url: "https://git-scm.com/docs", note: "The official per-command reference" },
        { label: "Think Like (a) Git", url: "https://think-like-a-git.net/", note: "Explains the DAG and reachability visually — good if reflog recovery still feels like magic" },
        { label: "Conventional Commits", url: "https://www.conventionalcommits.org/", note: "The spec for machine-readable commit messages" },
        { label: "Semantic Versioning", url: "https://semver.org/", note: "What MAJOR.MINOR.PATCH actually promise, which is what your tags reference" },
        { label: "git-filter-repo", url: "https://github.com/newren/git-filter-repo", note: "The history-rewriting tool git itself recommends over filter-branch" },
      ]},
    ],

    foundations: [
      { h: "1) Your first SSH key" },
      { code: String.raw`ssh-keygen -t ed25519 -C "you@example.com"   # writes ~/.ssh/id_ed25519 and .pub
ssh-add ~/.ssh/id_ed25519                     # load it into the agent
ssh -T git@github.com                         # verify; it should greet you by name`, cap: "Use ed25519, not RSA — shorter, faster, and no key-size question to answer wrongly", lang: "bash" },
      { ul: [
        "`-C` is **free text** used as a label on the key, not an identity the server checks — anything works, but the convention is an email",
        "**The private key never leaves the machine.** What you paste into the host is the `.pub` file",
        "A passphrase is what makes 'laptop stolen' different from 'identity stolen'; `ssh-agent` is what stops the passphrase being a per-push annoyance",
      ]},
      { h: "2) Several accounts on one machine — where it hurts most" },
      { code: String.raw`# ~/.ssh/config
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes

Host github-work              # a fake host name, used only by git
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
    IdentitiesOnly yes`, cap: "Then git clone git@github-work:org/repo.git uses the work key", lang: "text" },
      { note: "`IdentitiesOnly yes` matters more than it looks: without it ssh offers **every key it knows**, the server accepts the first that matches, and you authenticate as the wrong account without noticing. The symptom is `Repository not found` on a repo you can plainly see in the browser — because that is what a host returns for 'exists, but you cannot see it'." },
      { h: "3) What each kind of key is for" },
      { table: { head: ["Kind", "Scope", "Use for"], rows: [
        ["personal SSH key", "every repo you can access", "your own workstation"],
        ["**deploy key**", "one repository, read-only by default", "a CI runner or server that needs one repo"],
        ["machine user", "whatever you grant it", "automation that needs several repos"],
        ["fine-grained PAT", "scoped and expiring", "HTTPS and API access — better than classic tokens"],
      ]}},
      { note: "**Never give CI a personal key.** A leaked deploy key costs you one repository. A leaked personal key costs you everything that key can reach, including other teams' repos you happen to have access to." },
      { h: "4) Signing — because the author field is text you typed" },
      { p: "`git commit --author=\"Linus <torvalds@example.com>\"` works, and it is a lie. The author field is **plain text** anyone can write. Signing is the only thing that makes 'who wrote this' checkable." },
      { code: String.raw`# Sign with the SSH key you already have (git 2.34+) — the simplest route
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true`, cap: "GPG works too and is what older enterprises standardise on, but SSH signing leaves you one key to manage", lang: "bash" },
      { p: "The host shows **Verified** only once you have uploaded that key in the **signing key** slot — uploading it as an authentication key is not enough, and that is the number one cause of 'I signed it but there is no badge'." },
      { note: "Signing is a **control** only when it is **enforced** — a branch protection rule requiring signed commits. Unenforced, it is decoration: anyone wanting to impersonate simply does not sign." },
      { h: "5) Per-directory identity, instead of memory" },
      { p: "The most common self-inflicted problem is committing to a work repo under your personal identity. Fix it structurally rather than by trying to remember." },
      { code: String.raw`# ~/.gitconfig
[user]
    name = Your Name
    email = personal@example.com
[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig-work

# ~/.gitconfig-work
[user]
    email = you@company.com
[commit]
    gpgsign = true`, cap: "Every repo under ~/work/ now uses the company email and signs automatically, with no per-project setup", lang: "text" },
      { p: "Add `git config --global user.useConfigOnly true` so git **refuses to commit** when no email is configured, instead of inventing one from the hostname and giving you commits authored by `wiaon-in@DESKTOP-4F2A.(none)`." },
      { h: "6) .gitignore — and the trap everyone hits once" },
      { code: String.raw`# 42 C project
*.o
*.a
*.dSYM/
a.out
push_swap
checker
.DS_Store`, cap: "The first file a 42 repo should have — a committed binary is the first thing an evaluator sees, before your code", lang: "text" },
      { note: "**`.gitignore` only affects files that are not yet tracked.** Once a file is tracked, adding it to .gitignore does nothing — you must `git rm --cached <file>` first. Machine-local ignores you do not want to share go in `.git/info/exclude`." },
      { h: "7) .gitattributes — the durable fix for line endings" },
      { code: String.raw`* text=auto
*.sh text eol=lf
*.bat text eol=crlf
*.png binary
*.psd filter=lfs diff=lfs merge=lfs -text`, cap: "Commit this file and it applies to everyone, whatever their local config says", lang: "text" },
      { p: "`core.autocrlf` is the old advice, and its flaw is being a **per-machine setting** — a new contributor who has not set it makes their first commit show every line of every file as changed. `.gitattributes` lives in the repo, so it actually binds. It is also where LFS filters, per-path merge drivers and `linguist-*` overrides go." },
    ],

    architecture: [
      { h: "Merge or rebase — three options, not two" },
      { table: { head: ["Approach", "Resulting history", "Hashes", "Fits"], rows: [
        ["**merge**", "a commit with two parents, non-linear", "unchanged", "recording the truth that work happened in parallel"],
        ["**rebase**", "linear and readable", "**every replayed commit changes**", "bringing your own branch up to date before a PR"],
        ["**squash merge**", "the whole PR becomes one commit", "one new commit", "a main branch where every commit is a reviewed unit"],
      ]}},
      { note: "A house rule that works: **rebase your own branch onto main to stay current, then merge (or squash-merge) into main.** You get readable feature history and a main branch where every commit is a reviewed unit." },
      { p: "A fast-forward is the case where your branch is strictly ahead, so git can simply move the pointer. `--no-ff` forces a merge commit so the branch's existence stays visible; `--ff-only` refuses anything that is not a fast-forward, which is how you keep main linear." },
      { h: "Branching models — pick by what the team actually ships" },
      { table: { head: ["Model", "Shape", "Fits"], rows: [
        ["**Trunk-based**", "short-lived branches (< 1 day) into main; unfinished work behind feature flags; release from main", "continuous delivery — most teams"],
        ["**GitHub flow**", "branch → PR → review → merge → deploy", "web services"],
        ["**git-flow**", "`develop`, `release/*`, `hotfix/*`, `feature/*`", "software with several supported versions"],
        ["**Release branches**", "cut `release/1.4`, cherry-pick fixes into it", "anything customers pin a version of"],
      ]}},
      { p: "git-flow is heavier than most teams need and is the answer people copy without thinking — its own author has said roughly as much. Choose it when you genuinely ship multiple supported versions." },
      { note: "The variable that actually predicts pain is not the model's name, it is **branch lifetime**. A branch open for three weeks is three weeks of integration debt, and no branching model fixes that." },
      { h: "Tags and version numbers" },
      { code: String.raw`git tag -a v1.4.0 -m "Release 1.4.0"   # annotated: a real object, taggable, signable
git tag -s v1.4.0 -m "Release 1.4.0"   # signed
git push origin v1.4.0                 # tags do NOT go with a plain git push`, cap: "A lightweight tag is only a ref — no tagger, no date, no message. Do not use one for a release", lang: "bash" },
      { h: "Monorepo or polyrepo — a trade, not a ranking" },
      { table: { head: ["", "You get", "You pay"], rows: [
        ["**monorepo**", "atomic cross-project changes, one version of truth, org-wide refactors", "large clones, path-filtered CI, and you will need sparse-checkout + partial clone"],
        ["**polyrepo**", "small clones, independent release cadence per team", "every cross-cutting change becomes N coordinated PRs plus version pinning"],
      ]}},
      { h: "Submodule or subtree" },
      { p: "A **submodule** records another repo pinned at one commit — it stays a separate repo, and everyone must remember `git submodule update --init --recursive` (or clone with `--recurse-submodules`). A **subtree** copies the code in: consumers need no extra commands, but updating is messier." },
      { note: "Submodules are a frequent source of 'it works on my machine', because a submodule that has not been updated sits detached and is **invisible in `git status`** unless you go looking." },
      { h: "The structure that keeps a repository alive" },
      { ul: [
        "**Never commit build artifacts or dependencies** — the main cause of repositories that become unclonably slow, and git can barely delta-compress binaries",
        "**Do track lockfiles** (`package-lock.json`, `Cargo.lock`) — they are the record of what was actually built",
        "`.gitattributes`, `.gitignore` and `CODEOWNERS` are structural files, not extras — add them in the first commit",
        "`.git-blame-ignore-revs` for repo-wide reformat commits, so they stop masking real authorship",
      ]},
    ],

    dataflow: [
      { h: "The everyday loop" },
      { code: String.raw`edit files
  |  git add -p            <- read your own diff, hunk by hunk
  v
index
  |  git commit            <- no -m: write a real message in the editor
  v
local repo
  |  git push -u origin feat
  v
remote
  |  open a PR -> review -> CI -> merge
  v
main -> deploy`, cap: "add -p is the single habit that most improves commit quality, because it forces you to read your own diff", lang: "text" },
      { h: "How fetch differs from pull" },
      { table: { head: ["Command", "What it does", "How safe"], rows: [
        ["`git fetch`", "downloads only; changes nothing locally", "always safe"],
        ["`git pull`", "fetch **then merge (or rebase)** — two operations in one command", "can create a merge commit you did not intend"],
        ["`git pull --ff-only`", "fetch, then move the pointer; stop if it cannot", "predictable — make it the default"],
      ]}},
      { code: String.raw`git config --global pull.ff only          # or pull.rebase true
git config --global push.default simple
git config --global push.autoSetupRemote true
git config --global fetch.prune true`, cap: "Set once and pull stops surprising you for the rest of your life", lang: "bash" },
      { h: "The PR loop — where policy becomes real" },
      { p: "A good PR is **small, single-purpose, and explains why**. Reviewers catch design problems in 200 lines and rubber-stamp 2000 — that is not a discipline failure on their part, it is a measurable limit." },
      { table: { head: ["Host-side control", "What it actually does"], rows: [
        ["protected branch", "no direct push to main; a PR is required"],
        ["required reviews", "N approvals; dismiss stale approvals when new commits land"],
        ["**CODEOWNERS**", "the right reviewers are requested automatically and required"],
        ["required status checks", "CI must pass; 'must be up to date with base' forces a rebase before merge"],
        ["linear history required", "blocks merge commits — pairs with squash or rebase merges"],
        ["**merge queue**", "tests each PR against the *post-merge result*, serialised"],
        ["require signed commits", "rejects unsigned commits"],
        ["restrict force-push / branch deletion", "usually to nobody at all"],
      ]}},
      { note: "The merge queue exists because 'CI passed on the PR branch' and 'CI passes on main after merging' are different statements. Two PRs that each pass alone can break main together. Without a queue, the workaround is required-up-to-date-with-base — which is a manual merge queue." },
      { h: "Hooks are not enforcement" },
      { p: "`pre-commit` runs on the developer's machine and is always skippable with `--no-verify`. Use hooks for **fast feedback**; use CI as the **gate**. `core.hooksPath` lets a team share hooks from a tracked directory — but that is still convenience, not enforcement." },
      { h: "Commit messages that work with tooling" },
      { code: String.raw`feat(parser): support --bench flag on stderr

Explain why the change is needed and what it does at a level the diff
cannot show. Wrapped at 72 columns.

Refs: PROJ-1234`, cap: "Subject <= 50 characters, imperative mood (add, not added), no trailing full stop", lang: "text" },
      { p: "Imperative because the message completes the sentence 'applying this commit will…', which is exactly what `merge`, `revert` and `cherry-pick` generate for you. The subject line is the part everyone reads in `git log --oneline` forever — spend the time there." },
      { note: "**Conventional Commits** (`feat:` `fix:` `docs:` `refactor:` `test:` `chore:`, plus `!` or a `BREAKING CHANGE:` footer) earn their keep when a tool consumes them — automatic changelogs and semver bumps via semantic-release. Adopted without that tooling they are ceremony; adopted with it they remove an entire class of release argument." },
    ],

    implementation: [
      { h: "1) The undo table — pick the right one" },
      { table: { head: ["Situation", "Command", "Rewrites history?"], rows: [
        ["Fix the last commit (message or content)", "`git commit --amend`", "yes"],
        ["Collapse the last 3 commits into one", "`git reset --soft HEAD~3` then commit", "yes"],
        ["Reorder / squash / drop several commits", "`git rebase -i HEAD~5`", "yes"],
        ["Copy one commit onto this branch", "`git cherry-pick <sha>`", "no (creates new)"],
        ["Undo a commit that is already pushed", "**`git revert <sha>`**", "**no — the only safe route**"],
        ["Discard unstaged changes in a file", "`git restore <path>`", "no"],
        ["Take a file back out of staging", "`git restore --staged <path>`", "no"],
        ["Park work in progress", "`git stash push -m \"wip\"`", "no"],
      ]}},
      { note: "**The rule:** rewrite freely on a branch only you have; **never rewrite what others have pulled** — revert instead. Rewritten shared history forces everyone into a recovery they did not ask for, and it is usually noticed only after someone pushes the old commits back." },
      { h: "2) rebase -i and autosquash" },
      { code: String.raw`git rebase -i HEAD~5
# pick    = keep it
# reword  = change the message
# squash  = fold into the one above, merge messages
# fixup   = fold into the one above, discard the message
# edit    = stop there so you can amend
# drop    = delete it

# the version where you do not reorder by hand:
git commit --fixup=<sha>            # mark it now
git rebase -i --autosquash HEAD~10  # git orders the todo list for you`, cap: "autosquash makes 'fix now, fold in later' automatic instead of a manual drag of lines in a todo file", lang: "bash" },
      { h: "3) Conflicts — and how not to solve them twice" },
      { code: String.raw`# during a merge/rebase
git status                       # which files are stuck
# edit the files, remove every marker
git add <file>
git rebase --continue            # or git merge --continue

git rebase --abort               # always returns you to before; nothing is lost

git config --global rerere.enabled true`, cap: "rerere = reuse recorded resolution: it remembers how you resolved and replays it", lang: "bash" },
      { p: "On a long-lived branch rebased repeatedly, **rerere is the difference between resolving a conflict once and resolving it a dozen times**. Pair it with `merge.conflictstyle = zdiff3`, which shows the common ancestor so you can see who changed what from where." },
      { h: "4) Pushing safely" },
      { code: String.raw`git push --force-with-lease --force-if-includes`, cap: "Refuses if the remote moved since your last fetch — that is, it refuses exactly when you would be deleting someone's work", lang: "bash" },
      { p: "Plain `git push --force` **checks nothing**; it just overwrites. Alias the safe form so it is shorter than the dangerous one, and you will never reach for the dangerous one out of laziness." },
      { code: String.raw`git config --global alias.pushf "push --force-with-lease --force-if-includes"`, cap: "git pushf is shorter to type than git push --force", lang: "bash" },
      { h: "5) reflog — recovering almost anything" },
      { code: String.raw`git reflog                      # every move of HEAD, ~90 days
git reset --hard HEAD@{3}       # go back to before the mistake
git branch recovered <sha>      # or rescue it under a new name

git fsck --lost-found           # when even the reflog is gone`, cap: "A 'lost' commit is still in the object store until gc collects it — the reflog is the map to it", lang: "bash" },
      { h: "6) bisect — find the commit that broke it" },
      { code: String.raw`git bisect start
git bisect bad                  # it is broken now
git bisect good v1.3            # it worked at v1.3
# git checks out midpoints; answer good or bad each time

git bisect run ./test.sh        # fully automatic: a script that exits non-zero when broken
git bisect reset`, cap: "Binary search over history — about 10 steps for 1000 commits", lang: "bash" },
      { h: "7) Searching history — the pickaxe and blame" },
      { code: String.raw`git log -S "connectTimeout"     # commits that changed the NUMBER of occurrences
git log -G "regex"              # commits whose diff matches the regex
git log --follow -- path        # history across renames
git blame -w -C -L 40,60 file   # -w ignores whitespace, -C follows moved code`, cap: "log -S answers 'when was this line added or removed' faster than reading the log", lang: "bash" },
      { p: "`git blame` answers 'which commit', never 'who to blame' — the valuable output is the commit message and its PR. Put whole-file reformat commits in `.git-blame-ignore-revs` and set `blame.ignoreRevsFile`, so they stop masking the real author." },
      { h: "8) A leaked secret — the order matters more than the command" },
      { ul: [
        "**1. Rotate or revoke the credential first.** It is in every clone, every fork, every CI cache and probably a scraper's database — rewriting history does not un-leak it",
        "**2. Then purge it from history** with `git filter-repo --path config/secrets.yml --invert-paths` (BFG is the older alternative; `filter-branch` is deprecated and slow)",
        "**3. Force-push and have everyone re-clone**, then ask the host to garbage-collect — rewritten commits stay reachable through PR refs and forks until it does",
      ]},
      { note: "A rewrite changes **every hash**, breaking links, signed tags and anything that referenced a commit — one more reason rotation is the real fix and history cleanup is the follow-up. Better still, prevent it: `gitleaks` / `trufflehog` in CI, host-side push protection, and `.gitignore` entries for `.env`-shaped files." },
      { h: "9) Large repositories — tools by symptom" },
      { table: { head: ["Symptom", "Tool", "Watch out for"], rows: [
        ["Clone is huge because of history", "`git clone --filter=blob:none`", "blobs are fetched on demand, so you need the network"],
        ["CI only needs the tip", "`git clone --depth 1`", "**breaks `merge-base`, blame and PR diffs**"],
        ["You only work in one subtree", "`git sparse-checkout set apps/web`", "-"],
        ["Large binaries", "**git LFS**", "needs server-side setup too"],
        ["Several branches checked out at once", "`git worktree add ../hotfix main`", "one clone, several working trees"],
        ["Repo gets slower over time", "`git maintenance start`", "schedules gc, commit-graph and prefetch"],
      ]}},
    ],

    tricks: [
      { h: "Trick 1: `git add -p`, every time" },
      { p: "It makes you read your own diff before anyone else does, and it makes one-change-per-commit natural rather than aspirational. A surprising number of bugs get caught right here, before CI ever runs." },
      { h: "Trick 2: commit often, tidy later" },
      { p: "A commit is a save point the reflog can recover; uncommitted work is not recoverable at all. Eight messy commits followed by a `rebase -i` down to two readable ones is strictly safer than writing for hours and committing once." },
      { h: "Trick 3: alias `--force-with-lease` shorter than `--force`" },
      { p: "Safety that is harder to type always loses on the day you are in a hurry. Make the safe path the lazy path." },
      { h: "Trick 4: enable rerere on day one" },
      { p: "It has no downside, and the day you want it is the third rebase of a long branch — by which point enabling it retroactively does nothing for the rounds you already suffered through." },
      { h: "Trick 5: `includeIf` instead of remembering which repo you are in" },
      { p: "A wrong email in a commit can only be fixed by rewriting history, which on a shared branch means it cannot really be fixed. Configure it structurally, once." },
      { h: "Trick 6: `git switch` / `git restore` over `git checkout`" },
      { p: "`checkout` switches branches, creates branches, restores files and discards changes — that ambiguity is why it confused people for a decade. The newer commands separate the jobs, and more importantly they are **readable in a team runbook**." },
      { h: "Trick 7: small PRs are a quality tool, not etiquette" },
      { p: "Reviewer defect-detection drops sharply with diff size. A 2000-line PR is not 'reviewed slowly' — it is not reviewed. Split work so it can merge in pieces even when the feature is unfinished, hidden behind a feature flag." },
      { h: "Trick 8: alias `git log --oneline --graph --decorate --all`" },
      { p: "Seeing the shape of the DAG before deciding to merge or rebase prevents most mistakes. Bind it to `git lg` and use it instead of bare `git log`." },
      { h: "Trick 9: read the push error properly" },
      { p: "`! [rejected] non-fast-forward` means **the remote has commits you do not** — it is not git being difficult. The fix is `git pull --rebase` then push. `--force` is answering 'then delete whatever I do not have'." },
      { h: "Trick 10: add `.gitattributes` before the second person joins" },
      { p: "Add it after a Windows contributor has committed and you earn a 'fix line endings repo-wide' commit that masks blame on every file — which then has to go into `.git-blame-ignore-revs`." },
    ],

    eval: [
      { h: "Review questions" },
      { qa: [
        { q: "Does a commit store a diff or a snapshot?", a: "A snapshot — the whole tree. Diffs are computed on demand by comparing two trees. Delta compression happens later, in packfiles during gc, which is a separate layer from the data model." },
        { q: "Why is creating a branch in git cheap?", a: "A branch is a file containing a hash, about 41 bytes. Creating one writes a single small file and copies nothing." },
        { q: "How do reset --soft, --mixed and --hard differ?", a: "All three move HEAD. --soft leaves the index and working tree alone; --mixed (the default) resets the index; --hard resets both, and is the only one that can permanently destroy uncommitted work." },
        { q: "How do you choose between merge and rebase?", a: "Rebase your own branch to stay current (hashes change, but nobody else has them yet); merge or squash-merge into main. Never rebase history others have pulled — revert instead." },
        { q: "What is the difference between `--force` and `--force-with-lease`?", a: "--force overwrites without checking. --force-with-lease refuses if the remote moved since your last fetch, which is precisely the case where you would be deleting someone else's commits." },
        { q: "Can you recover a commit lost to reset --hard?", a: "If it was ever committed, yes: `git reflog`, then `git reset --hard HEAD@{n}` or `git branch newname <sha>`. If it was never committed, no — it was never an object." },
        { q: "Why is my commit not showing as Verified?", a: "Usually because the key was uploaded in the authentication-key slot rather than the signing-key slot, or `commit.gpgsign` is not enabled." },
        { q: "How does a deploy key differ from a personal SSH key, and why separate them?", a: "A deploy key is scoped to one repository and read-only by default; a personal key reaches every repo you have access to. If CI holds a personal key and it leaks, the attacker gets everything you can reach, not just that repo." },
        { q: "What is `IdentitiesOnly yes` for?", a: "It makes ssh offer only the key named in the config. Without it ssh offers every key, the server accepts the first that matches, and you authenticate as the wrong account — the symptom is Repository not found on a repo you can see in the browser." },
        { q: "I added the file to .gitignore but it still shows in status — why?", a: "Because it is already tracked. .gitignore only affects untracked files; run `git rm --cached <file>` first." },
        { q: "What is the downside of a shallow clone (`--depth 1`)?", a: "There are no ancestors to compute a merge base from, so `git merge-base`, `git blame` and any CI step computing 'files changed in this PR' break. If you only want a smaller download but still need history, use `--filter=blob:none` instead." },
        { q: "What does a merge queue solve that required checks cannot?", a: "Required checks prove CI passed on the PR branch, not on main after merging. Two PRs that each pass alone can break main together; a merge queue tests the post-merge result, one at a time." },
        { q: "Can a pre-commit hook replace CI?", a: "No. It runs on the developer's machine and is always skippable with `--no-verify`. Use hooks for fast feedback and CI as the real gate." },
        { q: "A secret was committed — what comes first?", a: "Rotate or revoke the credential. It is already in every clone, fork and CI cache. Purging history with filter-repo is the second step, not the fix." },
        { q: "How do submodules and subtrees differ?", a: "A submodule points at another repo pinned to one commit, and consumers must run `git submodule update --init --recursive` themselves. A subtree copies the code into the repo — nothing extra for consumers, but updating is messier." },
        { q: "Why is rebasing shared history dangerous?", a: "A commit's hash includes its parent's, so editing the past changes every later hash. Anyone holding the old commits ends up with two histories that look identical but differ by hash, and they usually push the old ones back without noticing." },
        { q: "What is rerere and when does it pay off?", a: "Reuse recorded resolution — it remembers how you resolved a conflict and replays it. It pays off most on long-lived branches rebased repeatedly, and should be enabled from day one because enabling it later does nothing for the rounds already done." },
        { q: "What matters most in the 42 context?", a: "The moulinette clones only what is on the vogsphere remote — anything unpushed does not exist. And never commit binaries (`*.o`, `*.a`, the program itself), since several subjects list the exact files to submit and forbid extras." },
      ]},
    ],
  }
});
