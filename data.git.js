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
      { p: "หน้านี้พาไต่จาก **ยังไม่เคยพิมพ์ git สักครั้ง** ไปจนถึง **ทำงานเป็นทีมในองค์กรที่มี branch protection และ merge queue**. อ่านเรียงลงมาได้เลย แต่ถ้าอยากข้าม ให้ดูตาราง 'บันไดการเรียนรู้' ข้างล่างว่าตอนนี้อยู่ขั้นไหนแล้วเริ่มตรงนั้น" },
      { h: "ก่อนอื่น: git แก้ปัญหาอะไร" },
      { code: String.raw`ก่อนมี git                        มี git แล้ว
------------------------------    ------------------------------
report.doc                        ประวัติทุกจุดอยู่ในโฟลเดอร์เดียว
report_v2.doc                     ย้อนกลับไปวันไหนก็ได้
report_v2_final.doc               รู้ว่าใครแก้บรรทัดไหน ตอนไหน ทำไม
report_v2_final_ใช้อันนี้.doc      สองคนแก้คนละส่วนพร้อมกันได้
report_final_แก้แล้ว(2).doc        แล้วรวมกันได้โดยไม่ทับกัน`, cap: "git คือปุ่ม save ที่ย้อนได้ทุกจุด + ระบบรวมงานหลายคนที่ไม่ทับกัน", lang: "text" },
      { p: "สองความสามารถนี้แยกกันไม่ออก: การที่ git **จำทุกสถานะได้** คือสิ่งที่ทำให้มันกล้าปล่อยให้สองคนแก้ไฟล์เดียวกัน แล้วค่อยมาเทียบทีหลังว่าใครเปลี่ยนอะไรจากจุดร่วมจุดไหน" },
      { h: "เทคนิคเบื้องหลังคืออะไร (ประโยคเดียว)" },
      { p: "git คือ **ที่เก็บ object ที่อ้างอิงด้วยเนื้อหา (content-addressed object store) บวกกับข้อตกลงเรื่อง pointer ที่วางทับไว้ข้างบน**. ยังไม่ต้องเข้าใจตอนนี้ก็ได้ — แต่พออ่านแท็บ 'โมเดลข้อมูล' จบแล้วกลับมาอ่านประโยคนี้ คำสั่งเกือบทั้งหมดจะกลายเป็นสิ่งที่ **เดาได้** ไม่ใช่สิ่งที่ต้องท่อง" },
      { p: "ตัวอย่างที่เห็นผลทันที: 'ตัวชี้' (branch, tag, HEAD) เป็นแค่ไฟล์ที่บรรจุ hash. `git branch feat` = เขียนไฟล์ขนาด 41 ไบต์ ไม่ได้ก๊อปโค้ดเลยสักบรรทัด — **นี่คือเหตุผลเดียวที่ทำให้การแตก branch ถูกจนเปลี่ยนวิธีทำงานของทั้งวงการ** ในขณะที่ SVN แพงพอที่จะทำให้คนไม่กล้าแตก" },
      { h: "บันไดการเรียนรู้ — ตอนนี้อยู่ขั้นไหน" },
      { table: { head: ["ขั้น", "ทำอะไรได้", "ต้องรู้แค่", "อ่านแท็บ"], rows: [
        ["**0 · คนเดียว เครื่องเดียว**", "save ประวัติงานตัวเอง ย้อนกลับได้", "`init` `status` `add` `commit` `log`", "ตัวตน & กุญแจ ข้อ 0"],
        ["**1 · มี remote**", "push ขึ้น GitHub / vogsphere, clone ลงเครื่องใหม่", "SSH key, `clone` `push` `pull`", "ตัวตน & กุญแจ ข้อ 0.5-3"],
        ["**2 · หลาย branch**", "ทำหลายเรื่องพร้อมกันโดยไม่ปนกัน", "`switch` `merge`, conflict คืออะไร", "โมเดลข้อมูล + โครงสร้างทีม"],
        ["**3 · ทำงานเป็นทีม**", "PR, review, แก้ conflict, เลิกทำอย่างปลอดภัย", "`rebase` `revert` `reflog` `force-with-lease`", "workflow & PR + คำสั่งตามสถานการณ์"],
        ["**4 · ระดับองค์กร**", "วางนโยบาย branch, CI gate, repo ขนาดใหญ่, audit", "protected branch, merge queue, signing, LFS", "โครงสร้างทีม + workflow & PR"],
      ]}},
      { note: "ขั้น 0-1 ใช้เวลาหนึ่งชั่วโมงก็พอ. **ขั้น 2 คือจุดที่คนส่วนใหญ่ติด** เพราะเริ่มต้องมีแบบจำลองในหัวว่า commit เชื่อมกันยังไง — นั่นคือเหตุผลที่แท็บ 'โมเดลข้อมูล' อยู่ก่อนคำสั่งทั้งหมด. ถ้าอ่านแล้วงง ให้ข้ามไปเล่น **Visualizer** ก่อน มันไล่ให้ดูทีละคำสั่งว่าไฟล์ย้ายจากช่องไหนไปช่องไหน" },
      { h: "10 คำสั่งที่กินเวลา 95%" },
      { table: { head: ["คำสั่ง", "แปลว่า"], rows: [
        ["`git status`", "ตอนนี้อะไรเปลี่ยนบ้าง อยู่ขั้นไหน — พิมพ์บ่อยที่สุด ไม่มีผลข้างเคียง"],
        ["`git add <file>`", "เอาการแก้นี้ใส่ตะกร้าที่จะ commit"],
        ["`git commit`", "บันทึกตะกร้าเป็นจุด save ถาวร"],
        ["`git log --oneline`", "ดูประวัติย่อ"],
        ["`git diff`", "ยังไม่ได้ add มีอะไรเปลี่ยน"],
        ["`git switch <branch>`", "ย้ายไป branch อื่น"],
        ["`git switch -c <ใหม่>`", "สร้าง branch ใหม่แล้วย้ายไปเลย"],
        ["`git pull`", "ดึงของใหม่จาก remote มารวม"],
        ["`git push`", "ส่งของเราขึ้น remote"],
        ["`git restore <file>`", "ทิ้งการแก้ในไฟล์นั้น กลับไปเหมือนตอน commit ล่าสุด"],
      ]}},
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
      { h: "0) ศูนย์ถึง commit แรก — ยังไม่ต้องมีคีย์เลย" },
      { p: "ขั้นนี้ทำงานได้ **โดยไม่ต้องมีอินเทอร์เน็ต ไม่ต้องมี GitHub ไม่ต้องมีคีย์**. git ทำงานในเครื่องเราล้วน ๆ — remote เป็นของเสริมที่ค่อยเพิ่มทีหลัง" },
      { code: String.raw`$ git config --global user.name "Wisanu"
$ git config --global user.email "you@example.com"
$ git config --global init.defaultBranch main

$ mkdir myproject && cd myproject
$ git init
Initialized empty Git repository in /home/me/myproject/.git/

$ echo "hello" > main.c
$ git status
Untracked files:
        main.c                      <- git เห็นไฟล์ แต่ยังไม่ได้ดูแลให้

$ git add main.c
$ git status
Changes to be committed:
        new file:   main.c          <- อยู่ในตะกร้าแล้ว (index)

$ git commit -m "add main.c"
[main (root-commit) a1b2c3d] add main.c

$ git log --oneline
a1b2c3d add main.c`, cap: "หกคำสั่งนี้คือขั้น 0 ทั้งขั้น — ทำซ้ำจนคล่องก่อนไปต่อ", lang: "bash" },
      { p: "สิ่งที่เพิ่งเกิดขึ้น: `git init` สร้างโฟลเดอร์ซ่อน `.git/` ซึ่งเก็บประวัติทั้งหมด (ลบโฟลเดอร์นี้ = ลบประวัติ แต่ไฟล์งานยังอยู่). `git add` ย้ายการแก้เข้า **ตะกร้า** ส่วน `git commit` ผูกตะกร้านั้นเป็นจุด save ถาวรที่ย้อนกลับมาได้เสมอ" },
      { note: "**ทำไมต้องมีตะกร้า ทำไมไม่ commit ตรง ๆ?** เพราะบ่อยครั้งเราแก้ไปสามเรื่องพร้อมกันแล้วอยากแยกเป็นสาม commit. ตะกร้าให้เราเลือกได้ว่ารอบนี้จะเอาอะไรเข้าไป — และ `git add -p` ให้เลือกได้ละเอียดถึงระดับ hunk. ถ้ายังไม่ต้องการความละเอียดนั้น `git commit -am \"...\"` ข้ามตะกร้าไปได้เลย" },
      { h: "0.5) จาก commit แรกถึง push แรก" },
      { code: String.raw`# แบบที่ 1: มีของในเครื่องแล้ว อยากส่งขึ้น remote
$ git remote add origin git@github.com:me/myproject.git
$ git push -u origin main        # -u จำไว้ว่า branch นี้คู่กับ origin/main

# แบบที่ 2: ของอยู่บน remote แล้ว อยากดึงลงเครื่อง
$ git clone git@github.com:me/myproject.git
# clone ทำ init + remote add + fetch + switch ให้ในคำสั่งเดียว

# หลังจากนั้นวงจรก็แค่
$ git pull        # เอาของใหม่ลงมา
... แก้งาน ...
$ git add -p && git commit
$ git push`, cap: "clone กับ init+remote add ให้ผลเหมือนกัน ต่างแค่ของตั้งต้นอยู่ฝั่งไหน", lang: "bash" },
      { note: "`git@github.com:...` คือรูปแบบ **SSH** ซึ่งต้องมีคีย์ (ข้อ 1 ข้างล่าง) ส่วน `https://github.com/...` ใช้ token แทน. SSH ตั้งครั้งเดียวจบ ไม่ต้องกรอกอะไรอีก — เพราะงั้นถึงคุ้มที่จะตั้งตั้งแต่วันแรก" },
      { h: "0.75) สร้าง branch แรก — วงจรเต็มตั้งแต่สร้างจนลบทิ้ง" },
      { p: "branch คือ **ตัวชี้ไปยัง commit หนึ่งตัว** ที่ขยับตามเมื่อเรา commit. สร้าง branch จึงไม่ได้ก๊อปไฟล์อะไรเลย — มันแค่เขียนไฟล์ 41 ไบต์ที่บรรจุ hash. ทำให้ต้นทุนของการ 'ลองอะไรสักอย่างแยกไว้ก่อน' แทบเป็นศูนย์" },
      { code: String.raw`# 1. เริ่มจาก main ที่ทันสมัย — ขั้นนี้คนข้ามบ่อยที่สุด
$ git switch main
$ git pull

# 2. สร้าง branch แล้วย้ายไปเลยด้วยคำสั่งเดียว
$ git switch -c feat/login
Switched to a new branch 'feat/login'

# 3. ทำงานตามปกติ — commit กี่ครั้งก็ได้ ยังไม่มีใครเห็น
$ git add -p
$ git commit -m "add login handler"

# 4. push ครั้งแรกพร้อมผูก branch เข้ากับ remote
$ git push -u origin feat/login
   ครั้งต่อไปพิมพ์ git push เปล่า ๆ ได้เลย

# 5. เปิด PR -> review -> merge (ทำบนเว็บ)

# 6. เก็บกวาด
$ git switch main
$ git pull                      # ดึงงานที่เพิ่ง merge ลงมา
$ git branch -d feat/login      # ลบในเครื่อง (-d ปฏิเสธถ้ายังไม่ merge)
$ git fetch --prune             # ล้าง origin/feat/login ที่ตายแล้วออก`, cap: "วงจรเต็มหนึ่งรอบ — ขั้น 1 กับ 6 คือสองขั้นที่คนลืมและทำให้ repo รก", lang: "bash" },
      { note: "**ขั้นที่ 1 สำคัญกว่าที่คิด**: `git switch -c` แตกจาก **ตำแหน่งที่เรายืนอยู่ตอนนั้น**. ถ้าลืม `git pull` ก่อน branch ใหม่จะแตกจาก main เวอร์ชันเก่า แล้วตอนเปิด PR จะเจอ conflict ที่ไม่ควรมี. อยากแตกจากที่อื่นโดยไม่ต้องย้ายตัวเองไปก่อน ใช้ `git switch -c feat/x origin/main` ได้เลย" },
      { h: "ตั้งชื่อ branch ยังไงให้ทีมอ่านออก" },
      { table: { head: ["รูปแบบ", "ตัวอย่าง", "ใช้เมื่อ"], rows: [
        ["`feat/<เรื่อง>`", "`feat/login`, `feat/bench-flag`", "ฟีเจอร์ใหม่"],
        ["`fix/<เรื่อง>`", "`fix/leak-on-error-path`", "แก้บั๊ก"],
        ["`refactor/` `docs/` `test/` `chore/`", "`refactor/split-parse`", "งานที่ไม่เปลี่ยนพฤติกรรม"],
        ["`hotfix/<เรื่อง>`", "`hotfix/null-deref`", "แก้ด่วนที่ต้องขึ้น production ทันที"],
        ["`<login>/<เรื่อง>`", "`wiaon-in/disorder-metric`", "repo ที่มีคนเยอะ อยากรู้ว่าของใคร"],
        ["`<ticket>-<เรื่อง>`", "`PROJ-1234-login`", "ทีมที่ผูกกับ issue tracker"],
      ]}},
      { note: "หลักเดียวที่สำคัญจริง: **ชื่อต้องบอกได้ว่ากำลังทำอะไร โดยไม่ต้องเปิดดู**. `feat/login` ดีกว่า `wiaon-branch-2` เสมอ. เลี่ยงช่องว่างและอักขระพิเศษ ใช้ `-` คั่นคำ ส่วน `/` ใช้แบ่งหมวด (git แสดงเป็นโฟลเดอร์ให้ในเครื่องมือหลายตัว)" },
      { h: "แตก branch ผิดที่ / commit ผิด branch — แก้ยังไง" },
      { table: { head: ["สถานการณ์", "ทางแก้"], rows: [
        ["เผลอ commit ลง main ทั้งที่ยังไม่ push", "`git switch -c feat/x` (พา commit ติดมาด้วย) แล้ว `git switch main` และ `git reset --hard origin/main`"],
        ["commit ผิด branch และ push ไปแล้ว", "`git switch <ถูก>`, `git cherry-pick <sha>`, แล้วบน branch เดิม `git revert <sha>`"],
        ["แตก branch จาก main เวอร์ชันเก่า", "`git fetch` แล้ว `git rebase origin/main`"],
        ["แตกจาก branch อื่นโดยไม่ตั้งใจ", "`git rebase --onto main <ฐานเก่า> <branch ของเรา>`"],
        ["อยากดูว่าตัวเองแตกมาจากไหน", "`git merge-base --fork-point main HEAD` หรือดูรูปจาก `git log --graph --oneline --all`"],
        ["ตั้งชื่อ branch ผิด", "`git branch -m <ชื่อใหม่>` แล้ว `git push -u origin <ชื่อใหม่>` และ `git push origin --delete <ชื่อเก่า>`"],
      ]}},
      { note: "`git rebase --onto main old-base my-branch` อ่านว่า 'เอา commit ที่อยู่ระหว่าง old-base กับ my-branch ไปวางบน main'. เป็นคำสั่งเดียวที่แก้ปัญหา 'แตก branch ซ้อน branch' ได้ตรง ๆ และเป็นเหตุผลที่มันมีอาร์กิวเมนต์สามตัว" },
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
      { note: "`.gitignore` **มีผลกับไฟล์ที่ยังไม่ถูก track เท่านั้น**. ถ้าไฟล์ถูก track ไปแล้ว การเพิ่มเข้า .gitignore ไม่ทำอะไรเลย ต้อง `git rm --cached <file>` ก่อน. ส่วน ignore เฉพาะเครื่องตัวเองที่ไม่อยากแชร์ ให้ใส่ `.git/info/exclude`" },
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
      { note: "submodule เป็นแหล่งกำเนิดของ 'บนเครื่องฉันมันรันได้' ที่พบบ่อย เพราะ submodule ที่ยังไม่ได้ update จะอยู่ในสถานะ detached และ **มองไม่เห็นใน git status** ถ้าไม่ตั้งใจดู" },
      { h: "ดูแลหลาย repo พร้อมกัน" },
      { p: "พอมีโปรเจกต์หลายตัว ปัญหาจะเปลี่ยนจาก 'ใช้ git ยังไง' เป็น **'จะไม่หลงว่าตอนนี้อยู่ repo ไหน ด้วยตัวตนอะไร และตัวไหนยังไม่ push'**. สามอย่างนี้แก้ด้วยโครงสร้าง ไม่ใช่ด้วยความจำ" },
      { h: "1) วางโฟลเดอร์ให้เดาที่อยู่ได้" },
      { code: String.raw`~/code/
├── 42/            <- ทุก repo ของโรงเรียน (vogsphere remote)
│   ├── libft/
│   ├── ft_printf/
│   └── push_swap/
├── work/          <- repo บริษัท (อีเมลบริษัท + เซ็น commit)
│   └── api/
└── personal/      <- ของตัวเอง (อีเมลส่วนตัว)
    └── dotfiles/`, cap: "โครงนี้ไม่ได้มีไว้สวย — มันคือสิ่งที่ทำให้ includeIf ตั้งตัวตนอัตโนมัติได้ตามโฟลเดอร์", lang: "text" },
      { code: String.raw`# ~/.gitconfig — ตัวตนตามที่อยู่ ไม่ต้องจำเอง
[user]
    name = Wisanu
    email = personal@example.com

[includeIf "gitdir:~/code/42/"]
    path = ~/.gitconfig-42
[includeIf "gitdir:~/code/work/"]
    path = ~/.gitconfig-work`, cap: "ตกลง path ไว้ครั้งเดียว แล้วทุก repo ใหม่ที่ clone ลงไปได้ตัวตนถูกทันที", lang: "text" },
      { note: "เขียน `gitdir:` ให้ลงท้ายด้วย `/` เสมอ — ถ้าลืมจะแมตช์แค่โฟลเดอร์นั้นตัวเดียว ไม่รวมของข้างใน. ตรวจว่าได้ผลจริงด้วย `git config user.email` ในแต่ละที่ หรือ `git config --list --show-origin` ถ้าจะดูว่าค่ามาจากไฟล์ไหน" },
      { h: "2) git -C — สั่งข้าม repo โดยไม่ต้อง cd" },
      { table: { head: ["คำสั่ง", "ทำอะไร"], rows: [
        ["`git -C ~/code/42/libft status`", "สั่ง git ใน repo นั้นโดยไม่ย้ายตัวเอง — พื้นฐานของทุกสคริปต์ข้างล่าง"],
        ["`git -C <dir> rev-parse --is-inside-work-tree`", "เช็กว่าโฟลเดอร์นั้นเป็น repo จริงไหม ก่อนจะสั่งอะไรต่อ"],
        ["`git -C <dir> log -1 --format=%cr`", "commit ล่าสุดเมื่อไร — ใช้หา repo ที่ทิ้งร้าง"],
      ]}},
      { code: String.raw`# repo ไหนยังมีของค้างหรือยังไม่ push บ้าง
for d in ~/code/*/*/; do
    git -C "$d" rev-parse --is-inside-work-tree >/dev/null 2>&1 || continue
    dirty=$(git -C "$d" status --porcelain)
    ahead=$(git -C "$d" log --oneline @{u}.. 2>/dev/null | wc -l)
    if [ -n "$dirty" ] || [ "$ahead" -gt 0 ]; then
        printf "%-28s %s ค้าง, %s ยังไม่ push\n" \
            "$(basename "$d")" "$(echo "$dirty" | grep -c .)" "$ahead"
    fi
done`, cap: "รันก่อนเลิกงานทุกวัน — จับ 'ลืม push' ซึ่งใน 42 แปลว่างานไม่มีอยู่จริงตอนตรวจ", lang: "bash" },
      { code: String.raw`# ดึงของใหม่ทุก repo รวดเดียว โดยไม่ยุ่งกับงานที่ค้างอยู่
for d in ~/code/*/*/; do
    git -C "$d" fetch --all --prune --quiet 2>/dev/null &&
        echo "fetched $(basename "$d")"
done`, cap: "ใช้ fetch ไม่ใช่ pull — fetch ไม่แตะ branch ที่กำลังทำงานอยู่ จึงรันทิ้งไว้ได้อย่างปลอดภัย", lang: "bash" },
      { note: "**อย่ารัน git pull วนทุก repo** เด็ดขาด. pull = fetch + merge/rebase ซึ่งจะขยับ branch ที่เราค้างงานไว้และอาจสร้าง conflict ใน repo ที่เราไม่ได้เปิดดูอยู่. fetch อย่างเดียวปลอดภัยเสมอ แล้วค่อยไป merge ทีละตัวตอนเข้าไปทำงานจริง" },
      { h: "3) หลาย branch ของ repo เดียว — worktree แทนการ stash" },
      { p: "ต้องรีบแก้บั๊กด่วนแต่งานปัจจุบันยังไม่พร้อม commit? ทางเลือกมีสาม และ **worktree มักเป็นตัวที่ถูกลืม** ทั้งที่เหมาะที่สุด" },
      { table: { head: ["วิธี", "ได้", "เสีย"], rows: [
        ["`git stash`", "เร็ว ไม่กินพื้นที่", "งานหายไปจากสายตา ลืมง่าย และ pop ทีหลังอาจ conflict"],
        ["clone ใหม่อีกชุด", "แยกขาดจากกัน", "โหลดใหม่ทั้ง repo, remote/config ต้องตั้งซ้ำ"],
        ["`git worktree`", "อีกโฟลเดอร์ อีก branch **แต่ใช้ .git เดียวกัน** — ของเดิมยังอยู่ครบไม่ต้องแตะ", "ต้องจำลบทิ้งเมื่อเสร็จ"],
      ]}},
      { code: String.raw`$ git worktree add ../myproject-hotfix -b hotfix/crash origin/main
# ได้โฟลเดอร์ใหม่ที่ ../myproject-hotfix อยู่บน branch hotfix/crash
# โฟลเดอร์เดิมยังค้างงานไว้เหมือนเดิม ไม่ต้อง stash อะไรเลย

$ cd ../myproject-hotfix && ...แก้... && git push -u origin hotfix/crash

$ git worktree list                       # ดูว่ามีอะไรเปิดค้างอยู่บ้าง
$ git worktree remove ../myproject-hotfix # เก็บกวาดเมื่อเสร็จ`, cap: "object เก็บที่เดียว จึงไม่เปลืองพื้นที่เท่าการ clone ใหม่ และ branch/tag/remote ใช้ร่วมกันหมด", lang: "bash" },
      { note: "ข้อจำกัดเดียวที่ต้องรู้: **branch เดียวเปิดได้ที่เดียว** — เปิด `main` ไว้ใน worktree หนึ่งแล้ว อีกอันจะ switch ไป `main` ไม่ได้ git จะเตือนให้เอง. เป็นฟีเจอร์ ไม่ใช่บั๊ก เพราะสอง checkout ของ branch เดียวกันจะทำให้ index ตีกัน" },
      { h: "4) fork ที่ต้องตามต้นทาง" },
      { code: String.raw`$ git remote add upstream git@github.com:original/repo.git
$ git remote -v
origin    git@github.com:me/repo.git       (fetch/push)   <- ของเรา
upstream  git@github.com:original/repo.git (fetch/push)   <- ต้นทาง

$ git fetch upstream
$ git switch main
$ git rebase upstream/main      # หรือ merge ถ้า main ของเราแชร์กับคนอื่น
$ git push`, cap: "origin คือ fork ของเรา upstream คือของจริง — ตั้งครั้งเดียวแล้วตามต้นทางได้ตลอด", lang: "bash" },
      { h: "5) ตั้งค่าให้เหมือนกันทุก repo โดยไม่ต้องไล่ตั้งทีละอัน" },
      { table: { head: ["สิ่งที่อยากให้เหมือนกัน", "ตั้งยังไง"], rows: [
        ["ตัวตน (ชื่อ/อีเมล/การเซ็น)", "`includeIf` ตามโฟลเดอร์ (ข้อ 1)"],
        ["ไฟล์ที่ไม่อยากเห็นทุก repo (`.DS_Store`, `.idea/`)", "`git config --global core.excludesfile ~/.gitignore_global` — ไม่ต้องยัดลง .gitignore ของทุกโปรเจกต์"],
        ["hook ชุดเดียวกัน", "`git config --global core.hooksPath ~/.githooks`"],
        ["alias และพฤติกรรม pull/push", "`git config --global ...` ครั้งเดียวใช้ทุกที่"],
        ["การเก็บกวาดอัตโนมัติ", "`git maintenance start` ในแต่ละ repo ใหญ่ (ตั้ง schedule ให้เอง)"],
      ]}},
      { note: "`core.excludesfile` เป็นของที่คนรู้ช้าที่สุด: ไฟล์ขยะของ **เครื่องเรา** (ระบบปฏิบัติการ, editor) ไม่ควรไปอยู่ใน `.gitignore` ที่ commit ร่วมกับทีม เพราะมันเป็นเรื่องของเราคนเดียว. ใส่ไว้ที่ global แล้วทุก repo สะอาดพร้อมกันหมด" },
      { h: "6) เครื่องมือเสริมเมื่อ repo เยอะจริง" },
      { table: { head: ["เครื่องมือ", "แก้ปัญหา"], rows: [
        ["`gh repo list <org> --limit 100`", "รู้ว่ามี repo อะไรบ้าง และ clone เป็นชุดได้ด้วย `gh repo clone`"],
        ["`gh pr list --search \"is:open author:@me\"`", "PR ของเราที่ยังค้างอยู่ทุก repo ในที่เดียว"],
        ["`git submodule`", "repo ที่ต้อง pin เวอร์ชันของกันและกันจริง ๆ — ไม่ใช่แค่ 'อยากเปิดพร้อมกัน'"],
        ["สคริปต์ `for` ในข้อ 2", "พอสำหรับ repo หลักสิบ และไม่ต้องติดตั้งอะไรเพิ่ม"],
      ]}},
      { note: "ก่อนจะไปหาเครื่องมือ ให้ถามก่อนว่าปัญหาคืออะไรจริง ๆ. ถ้าคือ 'แก้ทีเดียวหลาย repo แล้วต้องปล่อยพร้อมกัน' นั่นคือสัญญาณว่าควรเป็น **monorepo** ไม่ใช่การหาเครื่องมือมาประสาน N repo — ดูตารางเปรียบเทียบด้านบน" },
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
      { h: "เรื่องเล่า: สองคน หนึ่ง repo หนึ่ง conflict" },
      { p: "ทุกอย่างในแท็บนี้มาบรรจบกันในสถานการณ์เดียวนี้ — อ่านไล่บรรทัดแล้วจะเห็นว่าทำไมแต่ละกฎถึงมีอยู่" },
      { code: String.raw`วันจันทร์ 09:00  A และ B ต่าง clone repo เดียวกัน ทั้งคู่อยู่ที่ commit E

A: git switch -c feat/login        B: git switch -c feat/logout
   แก้ auth.c บรรทัด 40               แก้ auth.c บรรทัด 42
   git add -p; git commit            git add -p; git commit

วันจันทร์ 11:00  B เสร็จก่อน
B: git push -u origin feat/logout
   เปิด PR -> reviewer อนุมัติ -> squash merge เข้า main
   main ตอนนี้ = E + logout

วันจันทร์ 14:00  A เสร็จ
A: git push -u origin feat/login   -> ผ่าน (คนละ branch ไม่ชนกัน)
   เปิด PR
   CI ขึ้น: "This branch is out-of-date with the base branch"

A: git switch feat/login
   git fetch origin
   git rebase origin/main          <- เอางานตัวเองไปวางบน main ใหม่

   CONFLICT (content): Merge conflict in auth.c
   <<<<<<< ours (main = ของ B)
   int logout(void) { ... }
   =======
   int login(void) { ... }
   >>>>>>> theirs (commit ของ A)

   แก้ไฟล์ให้เก็บทั้งสองฟังก์ชัน
   git add auth.c
   git rebase --continue

A: git push --force-with-lease     <- ต้อง force เพราะ rebase เปลี่ยน hash
                                      แต่ with-lease ปฏิเสธถ้ามีคนอื่นแตะ branch นี้
   CI เขียว -> squash merge -> เสร็จ`, cap: "conflict ไม่ใช่ความผิดพลาด — คือจุดที่ git บอกว่า 'ตรงนี้ฉันเดาแทนไม่ได้'", lang: "text" },
      { p: "จุดที่ควรสังเกตสามจุด. **(1)** A กับ B ไม่เคยขัดกันเลยจนกระทั่ง A ต้องเอางานไปวางบน main ใหม่ — branch แยกกันจริง ๆ จนถึงตอนรวม. **(2)** ตอน rebase คำว่า *ours* คือ **main** ไม่ใช่ของ A เพราะ rebase กำลังเอา commit ของ A ไปวางทับบน main ทีละตัว ฝั่ง 'ที่มีอยู่แล้ว' จึงเป็น main — สลับกับตอน merge และเป็นจุดที่คนสับสนมากที่สุด. **(3)** `--force-with-lease` ที่ท้ายไม่ใช่การทำอะไรอันตราย มันคือรูปแบบปกติของ 'rebase branch ตัวเองแล้ว push'" },
      { note: "ถ้า A ทำงานบน branch นี้ค้างไว้สามสัปดาห์แทนที่จะเป็นห้าชั่วโมง conflict จะไม่ใช่หนึ่งจุดแต่เป็นหลายสิบจุด — และนี่คือเหตุผลทั้งหมดที่ trunk-based development ยืนยันเรื่อง branch อายุสั้น. ไม่ใช่เรื่องรสนิยม แต่เป็นเรื่องปริมาณงานที่ต้องมานั่งรวมทีหลัง" },
    ],

    /* ========================== IMPLEMENTATION ========================== */
    implementation: [
      { h: "0) ตารางฉุกเฉิน — \"ทำพังแล้ว ทำไงดี\"" },
      { p: "อ่านตารางนี้ก่อนตอนตกใจ. เกือบทุกช่องปลอดภัยและย้อนได้ — ยกเว้นช่องที่เขียนกำกับไว้" },
      { table: { head: ["เกิดอะไรขึ้น", "พิมพ์อะไร", "อันตรายไหม"], rows: [
        ["แก้ไฟล์มั่วไปหมด อยากได้ของเดิม", "`git restore <file>`", "**ทิ้งการแก้ถาวร** — ของที่ยังไม่ commit กู้ไม่ได้"],
        ["`git add` ผิดไฟล์", "`git restore --staged <file>`", "ปลอดภัย ไฟล์ไม่ถูกแตะ"],
        ["ข้อความ commit ล่าสุดผิด", "`git commit --amend`", "ปลอดภัยถ้ายังไม่ push"],
        ["ลืมใส่ไฟล์ใน commit ล่าสุด", "`git add <file>` แล้ว `git commit --amend --no-edit`", "ปลอดภัยถ้ายังไม่ push"],
        ["commit ผิด branch", "`git switch <ถูก>` แล้ว `git cherry-pick <sha>` แล้วลบของเก่า", "ปลอดภัย"],
        ["อยากเลิกทำ commit ที่ push ไปแล้ว", "`git revert <sha>`", "ปลอดภัยที่สุด — สร้าง commit ใหม่ที่ย้อนของเก่า"],
        ["ติดกลาง merge/rebase แล้วอยากถอย", "`git merge --abort` / `git rebase --abort`", "ปลอดภัย กลับจุดเดิมเป๊ะ"],
        ["งานค้างอยู่ แต่ต้องรีบไปแก้อย่างอื่น", "`git stash push -m \"wip\"` แล้ว `git stash pop`", "ปลอดภัย"],
        ["\"commit หายไปแล้ว\"", "`git reflog` แล้ว `git branch กู้มา <sha>`", "ปลอดภัย — แทบไม่มีอะไรหายจริง"],
        ["push ไม่ได้ ขึ้น non-fast-forward", "`git pull --rebase` แล้ว push ใหม่", "ปลอดภัย — **อย่าใช้ --force**"],
        ["อยาก push ทับจริง ๆ (branch ตัวเอง)", "`git push --force-with-lease`", "ปฏิเสธเองถ้าจะไปทับงานคนอื่น"],
      ]}},
      { note: "สังเกตว่ามีแค่ **สองแถวแรก** ที่ทำงานหายถาวรได้ และทั้งคู่คือของที่ **ยังไม่เคย commit**. นี่คือกฎเดียวกันกับที่บอกไว้ตั้งแต่หน้าแรก: commit บ่อย ๆ แล้วแทบทุกความผิดพลาดจะกู้ได้" },
      { h: "1) ตารางเลิกทำ — เลือกให้ถูกตัว" },
      { table: { head: ["สถานการณ์", "คำสั่ง", "เขียนประวัติใหม่ไหม"], rows: [
        ["แก้ commit ล่าสุด (ข้อความหรือเนื้อหา)", "`git commit --amend`", "ใช่"],
        ["ยุบ 3 commit ล่าสุดเป็นอันเดียว", "`git reset --soft HEAD~3` แล้ว commit ใหม่", "ใช่"],
        ["จัดเรียง/ยุบ/ลบ commit หลายตัว", "`git rebase -i HEAD~5`", "ใช่"],
        ["ก๊อป commit เดียวมาที่ branch นี้", "`git cherry-pick <sha>`", "ไม่ (สร้างใหม่)"],
        ["เลิกทำ commit ที่ push ไปแล้ว", "`git revert <sha>`", "**ไม่ — ทางเดียวที่ปลอดภัย**"],
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
        ["CI ต้องการแค่ยอด", "`git clone --depth 1`", "**พัง merge-base, blame และ diff ของ PR**"],
        ["ทำงานแค่บางโฟลเดอร์", "`git sparse-checkout set apps/web`", "-"],
        ["ไฟล์ binary ใหญ่", "**git LFS**", "ต้องตั้งค่าฝั่ง server ด้วย"],
        ["ต้องเปิดหลาย branch พร้อมกัน", "`git worktree add ../hotfix main`", "clone เดียว หลาย checkout"],
        ["repo ช้าลงเรื่อย ๆ", "`git maintenance start`", "ตั้ง gc/commit-graph/prefetch ตามเวลา"],
      ]}},
      { h: "📖 อ้างอิงคำสั่ง — flag ที่ใช้จริงของแต่ละตัว" },
      { p: "ส่วนนี้ไว้เปิดหา ไม่ได้ไว้อ่านรวด. สามข้อตกลงที่ใช้กับเกือบทุกคำสั่ง: `--` คั่นระหว่างชื่อ branch กับชื่อไฟล์ (`git restore -- main.c` เมื่อมีไฟล์ชื่อซ้ำกับ branch), `-n` หรือ `--dry-run` บอกว่าจะทำอะไรโดยยังไม่ทำจริง, และ `HEAD~2` = ถอย 2 รุ่นตามสายพ่อแม่หลัก ส่วน `HEAD^2` = parent ตัวที่ 2 ของ merge commit (คนละความหมาย)" },

      { h: "git add — จุดที่ . กับ -A ต่างกันจริง" },
      { table: { head: ["คำสั่ง", "ทำอะไร", "ระวัง"], rows: [
        ["`git add <file>`", "เอาไฟล์นั้นเข้าตะกร้า", "-"],
        ["`git add .`", "ทุกอย่างใน **โฟลเดอร์ปัจจุบันลงไป** (ใหม่ + แก้ + ลบ)", "อยู่ในโฟลเดอร์ย่อยแล้วพิมพ์ = ได้ไม่ครบ repo"],
        ["`git add -A`", "ทุกอย่างใน **ทั้ง repo** ไม่ว่ายืนอยู่ตรงไหน", "ตัวที่คนมักตั้งใจจะใช้ตอนพิมพ์ `git add .`"],
        ["`git add -u`", "เฉพาะไฟล์ที่ **track แล้ว** (แก้ + ลบ) ไม่เอาไฟล์ใหม่", "ดีเวลาไม่อยากเผลอ add ไฟล์ขยะ"],
        ["`git add -p`", "เลือกทีละ hunk — `y` เอา, `n` ไม่เอา, `s` ซอยย่อย, `e` แก้มือ, `q` ออก", "นิสัยที่ควรใช้เป็นค่าตั้งต้น"],
        ["`git add -n .`", "บอกว่าจะ add อะไรบ้างโดยยังไม่ add", "-"],
        ["`git add -f <file>`", "ฝืน add ไฟล์ที่ติด .gitignore", "ใช้เมื่อรู้ว่าทำอะไรอยู่เท่านั้น"],
      ]}},
      { note: "สรุปที่จำง่าย: `.` **= ตำแหน่งที่ยืน**, `-A` **= ทั้ง repo**, `-u` **= เฉพาะที่ track แล้ว**. ตั้งแต่ git 2.0 `git add .` รวมไฟล์ที่ถูกลบด้วยแล้ว (เมื่อก่อนไม่รวม) — ถ้าเคยอ่านคำแนะนำเก่าที่บอกว่าต้องใช้ `git add -A` เพราะ `.` ไม่จับไฟล์ที่ลบ อันนั้นล้าสมัยแล้ว" },

      { h: "git commit" },
      { table: { head: ["คำสั่ง", "ทำอะไร"], rows: [
        ["`git commit`", "เปิด editor ให้เขียนข้อความเต็ม — แบบที่ควรใช้เมื่อข้อความยาวกว่าหนึ่งบรรทัด"],
        ["`git commit -m \"ข้อความ\"`", "ข้อความบรรทัดเดียวจบ"],
        ["`git commit -m \"หัวเรื่อง\" -m \"เนื้อความ\"`", "ใส่ -m สองครั้ง = หัวเรื่อง + ย่อหน้าเนื้อความ โดยไม่ต้องเปิด editor"],
        ["`git commit -a` / `-am \"...\"`", "add ไฟล์ที่ track แล้วให้อัตโนมัติแล้ว commit — **ไม่รวมไฟล์ใหม่**"],
        ["`git commit --amend`", "แก้ commit ล่าสุด (ทั้งข้อความและเนื้อหาที่ stage ไว้)"],
        ["`git commit --amend --no-edit`", "ยัดของเพิ่มเข้า commit ล่าสุดโดยไม่แตะข้อความ"],
        ["`git commit --amend --reset-author`", "แก้ชื่อ/อีเมลผู้เขียนของ commit ล่าสุดให้เป็นค่า config ปัจจุบัน"],
        ["`git commit --fixup=<sha>`", "สร้าง commit ที่ทำเครื่องหมายไว้ว่าจะยุบเข้ากับ sha นั้น ใช้คู่ `rebase --autosquash`"],
        ["`git commit --allow-empty`", "commit เปล่า — ใช้กระตุ้น CI หรือทำเครื่องหมายจุดหนึ่งในประวัติ"],
        ["`git commit -S`", "เซ็น commit นี้ (ถ้าไม่ได้เปิด commit.gpgsign ไว้)"],
        ["`git commit --no-verify`", "ข้าม pre-commit hook — เหตุผลที่ hook ไม่ใช่การบังคับใช้"],
      ]}},

      { h: "git status · git diff · git show" },
      { table: { head: ["คำสั่ง", "ทำอะไร"], rows: [
        ["`git status -s`", "แบบสั้น: `??` ยังไม่ track, `M` แก้แล้ว, `A` เพิ่งเพิ่ม — คอลัมน์ซ้าย = index, ขวา = working tree"],
        ["`git status -sb`", "แบบสั้น + บรรทัด branch บอกว่านำหน้า/ตามหลัง remote กี่ commit"],
        ["`git status --ignored`", "แสดงไฟล์ที่ .gitignore กันไว้ด้วย — ใช้ตรวจว่ากฎ ignore ทำงานถูกไหม"],
        ["`git diff`", "working tree เทียบ index — คือของที่ยังไม่ได้ add"],
        ["`git diff --staged`", "index เทียบ HEAD — คือของที่กำลังจะ commit (`--cached` เหมือนกัน)"],
        ["`git diff HEAD`", "รวมทั้งสองอย่าง — ทั้งหมดที่เปลี่ยนจาก commit ล่าสุด"],
        ["`git diff main..feat`", "ปลาย main เทียบปลาย feat"],
        ["`git diff main...feat`", "**merge base** ของทั้งคู่ เทียบปลาย feat — คือสิ่งที่ PR แสดง"],
        ["`git diff --name-only` / `--stat`", "เอาแค่รายชื่อไฟล์ / สรุปจำนวนบรรทัด"],
        ["`git diff -w`", "เมินการเปลี่ยนแปลงเรื่องช่องว่างล้วน ๆ"],
        ["`git diff -- <path>`", "จำกัดเฉพาะพาธนั้น"],
        ["`git show <sha>`", "ดู commit นั้นพร้อม diff"],
        ["`git show <sha>:<path>`", "ดูเนื้อไฟล์ ณ commit นั้น โดยไม่ต้อง checkout"],
      ]}},
      { note: "`..` กับ `...` เป็นจุดที่สับสนบ่อยและสลับความหมายกันระหว่าง `diff` กับ `log`. จำอย่างนี้: ใน **diff** สามจุดคือ 'เทียบจาก merge base' (ตรงกับที่ PR โชว์); ใน **log** สามจุดคือ 'commit ที่มีในฝั่งใดฝั่งหนึ่งแต่ไม่มีทั้งคู่'" },

      { h: "git log" },
      { table: { head: ["คำสั่ง", "ทำอะไร"], rows: [
        ["`git log --oneline`", "บรรทัดละ commit"],
        ["`git log --oneline --graph --decorate --all`", "เห็นรูปร่าง DAG จริง — ตั้งเป็น alias `git lg` ไปเลย"],
        ["`git log -5`", "แค่ 5 ตัวล่าสุด"],
        ["`git log -p`", "แนบ diff ของแต่ละ commit"],
        ["`git log --stat`", "แนบสรุปว่าไฟล์ไหนเปลี่ยนกี่บรรทัด"],
        ["`git log --author=\"wiaon\"`", "กรองตามผู้เขียน"],
        ["`git log --since=\"2 weeks ago\"`", "กรองตามเวลา (`--until` ก็มี)"],
        ["`git log --no-merges`", "ตัด merge commit ออก อ่านง่ายขึ้นมาก"],
        ["`git log -S \"ข้อความ\"`", "commit ที่ทำให้จำนวนครั้งของข้อความนี้เปลี่ยน (pickaxe)"],
        ["`git log -G \"regex\"`", "commit ที่ diff ตรงกับ regex"],
        ["`git log --follow -- <path>`", "ไล่ประวัติข้ามการเปลี่ยนชื่อไฟล์"],
        ["`git log main..feat`", "commit ที่มีใน feat แต่ไม่มีใน main — คือ 'PR นี้เพิ่มอะไรมาบ้าง'"],
        ["`git log --left-right main...feat`", "commit ที่แตกต่างกันทั้งสองฝั่ง พร้อมสัญลักษณ์บอกว่าของใคร"],
      ]}},

      { h: "git branch · git switch · git restore" },
      { table: { head: ["คำสั่ง", "ทำอะไร"], rows: [
        ["`git branch`", "รายชื่อ branch ในเครื่อง (`-a` รวม remote, `-r` เฉพาะ remote)"],
        ["`git branch -vv`", "แต่ละ branch ผูกกับ remote ตัวไหน และนำหน้า/ตามหลังกี่ commit"],
        ["`git branch -d <ชื่อ>`", "ลบ branch ที่ merge แล้ว — **ปฏิเสธถ้ายังไม่ merge** (นี่คือฟีเจอร์)"],
        ["`git branch -D <ชื่อ>`", "ลบทิ้งเลยไม่ว่าจะ merge หรือยัง (กู้ได้ด้วย reflog)"],
        ["`git branch -m <ใหม่>`", "เปลี่ยนชื่อ branch ปัจจุบัน"],
        ["`git branch --merged` / `--no-merged`", "หา branch ที่เก็บกวาดได้ / ที่ยังมีงานค้าง"],
        ["`git switch <ชื่อ>`", "ย้ายไป branch นั้น"],
        ["`git switch -c <ใหม่>`", "สร้างแล้วย้ายไปเลย (`-c` = create)"],
        ["`git switch -c <ใหม่> <sha|branch>`", "สร้างจากจุดอื่นที่ไม่ใช่ตำแหน่งปัจจุบัน"],
        ["`git switch -`", "กลับไป branch ก่อนหน้า — เหมือน `cd -`"],
        ["`git switch --detach <sha>`", "ไปยืนที่ commit หนึ่งโดยไม่ผูก branch"],
        ["`git restore <file>`", "ทิ้งการแก้ในไฟล์นั้น — **ของที่ยังไม่ commit หายถาวร**"],
        ["`git restore --staged <file>`", "เอาออกจากตะกร้า แต่ไม่แตะเนื้อไฟล์"],
        ["`git restore --source=<sha> <file>`", "ดึงไฟล์เวอร์ชันจาก commit นั้นมาวาง"],
      ]}},

      { h: "git stash — เก็บงานค้างไว้ชั่วคราว" },
      { table: { head: ["คำสั่ง", "ทำอะไร"], rows: [
        ["`git stash push -m \"ข้อความ\"`", "เก็บงานค้างแล้วคืน working tree ให้สะอาด (ตั้งชื่อไว้เสมอ)"],
        ["`git stash push -u`", "เก็บไฟล์ที่ยังไม่ track ไปด้วย — **ไม่ใส่ -u แล้วไฟล์ใหม่จะถูกทิ้งไว้**"],
        ["`git stash push -- <path>`", "เก็บเฉพาะบางพาธ"],
        ["`git stash list`", "ดูรายการ `stash@{0}` `stash@{1}` ..."],
        ["`git stash show -p stash@{1}`", "ดู diff ของ stash ตัวนั้น"],
        ["`git stash pop`", "เอากลับมาแล้วลบออกจากรายการ"],
        ["`git stash apply stash@{1}`", "เอากลับมาแต่ยังเก็บไว้ในรายการ"],
        ["`git stash drop stash@{0}`", "ทิ้งตัวนั้น (`clear` = ทิ้งทั้งหมด)"],
        ["`git stash branch <ชื่อ>`", "สร้าง branch จากจุดที่ stash ไว้แล้วเอา stash ลง — ทางออกเมื่อ pop แล้ว conflict"],
      ]}},

      { h: "git merge · git rebase · git cherry-pick · git revert" },
      { table: { head: ["คำสั่ง", "ทำอะไร"], rows: [
        ["`git merge <branch>`", "รวมเข้ามา — fast-forward ถ้าทำได้"],
        ["`git merge --no-ff <branch>`", "บังคับให้มี merge commit เพื่อคง 'เคยมี branch นี้' ไว้ในประวัติ"],
        ["`git merge --squash <branch>`", "เอาการเปลี่ยนแปลงมาไว้ในตะกร้า **โดยไม่ commit** ให้เรา commit เอง"],
        ["`git merge --abort` / `--continue`", "ถอยกลับจุดเดิม / ไปต่อหลังแก้ conflict"],
        ["`git merge -X ours` / `-X theirs`", "เจอ conflict ให้เลือกฝั่งไหนอัตโนมัติ — ใช้เมื่อรู้แน่ว่าอีกฝั่งไม่สำคัญ"],
        ["`git rebase <base>`", "ย้ายฐานของ commit เรามาไว้บน base"],
        ["`git rebase -i HEAD~5`", "โหมดโต้ตอบ: pick / reword / squash / fixup / edit / drop"],
        ["`git rebase -i --autosquash`", "จัดลำดับ commit ที่ทำ --fixup ไว้ให้อัตโนมัติ"],
        ["`git rebase --onto <ใหม่> <เก่า> <branch>`", "ย้าย branch ข้ามฐาน เช่นตัดออกจาก branch ที่ผิด"],
        ["`git rebase --abort` / `--continue` / `--skip`", "ถอย / ไปต่อ / ข้าม commit นี้"],
        ["`git cherry-pick <sha>`", "ก๊อป commit นั้นมาที่ branch ปัจจุบัน"],
        ["`git cherry-pick -n <sha>`", "ก๊อปมาไว้ในตะกร้าแต่ยังไม่ commit"],
        ["`git cherry-pick -x <sha>`", "ใส่บรรทัดอ้างอิงว่ามาจาก commit ไหน — ควรใช้เสมอตอน backport"],
        ["`git cherry-pick A..B`", "ก๊อปเป็นช่วง"],
        ["`git revert <sha>`", "สร้าง commit ใหม่ที่ย้อนของเก่า — ปลอดภัยกับประวัติที่ push แล้ว"],
        ["`git revert -n <sha>`", "ย้อนแต่ยังไม่ commit (รวมหลายตัวเป็น commit เดียว)"],
        ["`git revert -m 1 <merge sha>`", "ย้อน merge commit — `-m 1` บอกว่าให้ยึด parent ตัวไหนเป็นสายหลัก"],
      ]}},
      { note: "`-m 1` ตอน revert merge จำเป็นเพราะ merge commit มีสอง parent git จึงไม่รู้ว่า 'ก่อนหน้า' หมายถึงฝั่งไหน. `-m 1` = สายที่ merge เข้าไป (ปกติคือ main) ซึ่งเป็นสิ่งที่ต้องการเกือบทุกครั้ง" },

      { h: "git reset · git clean" },
      { table: { head: ["คำสั่ง", "ทำอะไร", "อันตราย"], rows: [
        ["`git reset --soft HEAD~1`", "ถอย 1 commit เก็บทุกอย่างไว้ในตะกร้า", "ไม่"],
        ["`git reset HEAD~1`", "(`--mixed` ค่าตั้งต้น) ถอย commit + ล้างตะกร้า ไฟล์ยังอยู่", "ไม่"],
        ["`git reset --hard HEAD~1`", "ถอยแล้ว **ทับไฟล์ในเครื่องด้วย**", "**ใช่ — ของที่ยังไม่ commit หาย**"],
        ["`git reset <sha> -- <path>`", "เอาไฟล์นั้นออกจากตะกร้าโดยอิงกับ commit นั้น", "ไม่"],
        ["`git reset --hard origin/main`", "ทำให้ branch ในเครื่องเหมือน remote เป๊ะ", "**ใช่ — งานในเครื่องหายหมด**"],
        ["`git clean -n`", "บอกว่าจะลบไฟล์ที่ยังไม่ track อะไรบ้าง โดยยังไม่ลบ", "ไม่ — **รันอันนี้ก่อนเสมอ**"],
        ["`git clean -fd`", "ลบไฟล์และโฟลเดอร์ที่ยังไม่ track", "**ใช่ — ไม่มีอยู่ใน git จึงกู้ไม่ได้เลย**"],
        ["`git clean -fdx`", "ลบของที่ .gitignore กันไว้ด้วย (build artifact, .env)", "**ใช่ที่สุด — ไฟล์ .env ก็หายด้วย**"],
      ]}},
      { note: "`git clean` เป็นคำสั่งที่อันตรายที่สุดในหน้านี้ เพราะของที่มันลบ **ไม่เคยอยู่ใน git** จึงไม่มีทั้ง reflog และ object ให้กู้. ทำเป็นนิสัย: `git clean -n` ก่อน `git clean -f` ทุกครั้ง" },

      { h: "git remote · git fetch · git pull · git push" },
      { table: { head: ["คำสั่ง", "ทำอะไร"], rows: [
        ["`git remote -v`", "ดูว่า remote ชื่ออะไรชี้ไปไหน"],
        ["`git remote add <ชื่อ> <url>`", "เพิ่ม remote (`set-url` เปลี่ยน, `rename` เปลี่ยนชื่อ, `remove` ลบ)"],
        ["`git remote show origin`", "รายละเอียด: branch ไหนคู่กับอะไร ตัวไหนตายไปแล้ว"],
        ["`git fetch`", "ดึงของใหม่มาเก็บ ไม่แตะ branch ที่เราทำงานอยู่"],
        ["`git fetch --all --prune`", "ดึงทุก remote + ลบ remote-tracking branch ที่ถูกลบไปแล้ว"],
        ["`git fetch origin <branch>`", "ดึงเฉพาะ branch เดียว"],
        ["`git pull --rebase`", "fetch แล้วเอา commit เราไปวางต่อท้ายของเขา (ไม่เกิด merge commit)"],
        ["`git pull --ff-only`", "fetch แล้วขยับตัวชี้ ถ้าขยับไม่ได้ก็หยุด — ตัวเลือกที่คาดเดาได้ที่สุด"],
        ["`git pull --autostash`", "stash งานค้างให้อัตโนมัติแล้วคืนหลังเสร็จ"],
        ["`git push`", "ส่งขึ้น remote ที่ผูกไว้"],
        ["`git push -u origin <branch>`", "ส่งครั้งแรกพร้อมผูก branch กับ remote"],
        ["`git push --tags` / `--follow-tags`", "ส่ง tag ด้วย — **tag ไม่ไปกับ push ธรรมดา**"],
        ["`git push origin --delete <branch>`", "ลบ branch บน remote"],
        ["`git push --dry-run`", "บอกว่าจะส่งอะไรโดยยังไม่ส่ง"],
        ["`git push --force-with-lease`", "ทับได้ แต่ปฏิเสธถ้า remote ขยับตั้งแต่เรา fetch ครั้งล่าสุด"],
      ]}},

      { h: "git tag" },
      { table: { head: ["คำสั่ง", "ทำอะไร"], rows: [
        ["`git tag`", "รายชื่อ tag (`-l \"v1.*\"` กรองด้วยแพตเทิร์น)"],
        ["`git tag -a v1.4.0 -m \"...\"`", "annotated tag — เป็น object จริง มีผู้แท็ก วันที่ ข้อความ"],
        ["`git tag -s v1.4.0 -m \"...\"`", "annotated + เซ็น"],
        ["`git tag v1.4.0`", "lightweight — แค่ ref ไม่มีข้อมูลอะไรเลย **อย่าใช้กับ release**"],
        ["`git tag -a v1.4.0 <sha>`", "แท็กย้อนหลังที่ commit เก่า"],
        ["`git tag -d v1.4.0`", "ลบในเครื่อง (บน remote ต้อง `git push origin --delete v1.4.0`)"],
        ["`git describe --tags`", "ชื่อเวอร์ชันที่อ่านออกของ commit ปัจจุบัน เช่น `v1.4.0-12-gab34cd`"],
      ]}},

      { h: "คำสั่งไว้สืบหา" },
      { table: { head: ["คำสั่ง", "ทำอะไร"], rows: [
        ["`git reflog`", "ทุกการขยับของ HEAD ราว 90 วัน — จุดเริ่มของการกู้ทุกกรณี"],
        ["`git reflog show <branch>`", "ประวัติการขยับของ branch นั้นโดยเฉพาะ"],
        ["`git blame -w -C -L 40,60 <file>`", "ใครแตะบรรทัดไหน (`-w` เมิน whitespace, `-C` ตามโค้ดที่ถูกย้าย)"],
        ["`git bisect start` / `bad` / `good <sha>`", "binary search หา commit ที่ทำพัง"],
        ["`git bisect run ./test.sh`", "ให้ script ตัดสินเอง จบใน ~10 ขั้นสำหรับ 1000 commit"],
        ["`git grep \"ข้อความ\"`", "ค้นในไฟล์ที่ track อยู่ — เร็วกว่า grep ทั้งโฟลเดอร์เพราะข้าม build artifact"],
        ["`git grep \"ข้อความ\" <sha>`", "ค้นในเนื้อหา ณ commit นั้น"],
        ["`git shortlog -sn`", "นับ commit ต่อคน"],
        ["`git fsck --lost-found`", "หา object ที่ยังอยู่แต่ไม่มีอะไรชี้ถึง — ใช้เมื่อแม้แต่ reflog ก็หมดแล้ว"],
      ]}},

      { h: "clone · worktree · submodule" },
      { table: { head: ["คำสั่ง", "ทำอะไร"], rows: [
        ["`git clone <url> <โฟลเดอร์>`", "ตั้งชื่อโฟลเดอร์ปลายทางเอง"],
        ["`git clone -b <branch> <url>`", "clone แล้วไปอยู่ที่ branch นั้นเลย"],
        ["`git clone --depth 1 <url>`", "เอาแค่ commit ล่าสุด — **พัง merge-base, blame และ diff ของ PR**"],
        ["`git clone --filter=blob:none <url>`", "ได้ประวัติครบแต่ดึงเนื้อไฟล์ตอนต้องใช้ — ทางเลือกที่ดีกว่า --depth"],
        ["`git clone --recurse-submodules <url>`", "clone พร้อมดึง submodule ให้เลย"],
        ["`git worktree add ../hotfix main`", "เปิด branch ที่สองในอีกโฟลเดอร์ โดยใช้ clone เดียวกัน"],
        ["`git worktree list` / `remove <path>`", "ดูรายการ / ถอดออก"],
        ["`git submodule update --init --recursive`", "ดึงเนื้อ submodule มาให้ครบ — คำสั่งที่ทุกคนลืม"],
        ["`git submodule update --remote`", "อัปเดต submodule ไปยังปลายทางล่าสุดของมัน"],
      ]}},

      { h: "config ที่ใช้บ่อย" },
      { table: { head: ["คำสั่ง", "ทำอะไร"], rows: [
        ["`git config --list --show-origin`", "ค่าทั้งหมดพร้อมบอกว่ามาจากไฟล์ไหน — ตัวแก้ปัญหา 'ทำไมค่าเป็นแบบนี้'"],
        ["`git config --global <key> <value>`", "ตั้งระดับผู้ใช้ (`--local` เฉพาะ repo, `--system` ทั้งเครื่อง)"],
        ["`git config --global --unset <key>`", "ลบค่าที่ตั้งไว้"],
        ["`git config --global alias.lg \"log --oneline --graph --decorate --all\"`", "สร้าง `git lg`"],
        ["`git config --global alias.pushf \"push --force-with-lease --force-if-includes\"`", "ทำให้ทางที่ปลอดภัยพิมพ์สั้นกว่าทางที่อันตราย"],
        ["`git config --global core.editor \"code --wait\"`", "ใช้ VS Code เขียนข้อความ commit"],
        ["`git config --global rerere.enabled true`", "จำวิธีแก้ conflict แล้วเล่นซ้ำ"],
        ["`git config --global fetch.prune true`", "ลบ remote branch ที่ตายแล้วออกทุกครั้งที่ fetch"],
      ]}},
      { note: "อยากรู้ flag ของคำสั่งไหนแบบครบจริง ๆ: `git help <คำสั่ง>` (เปิดเอกสารเต็ม) หรือ `git <คำสั่ง> -h` (สรุปสั้นในเทอร์มินัล). สองอันนี้ตอบได้ทุกอย่างที่ตารางข้างบนตัดออกไป" },
    ],

    /* ============================== TRICKS ============================== */
    tricks: [
      { h: "ทริค 1: git add -p ทุกครั้ง" },
      { p: "มันบังคับให้เราอ่าน diff ของตัวเองก่อนคนอื่นอ่าน และทำให้ 'หนึ่ง commit หนึ่งการเปลี่ยนแปลง' เป็นเรื่องธรรมชาติแทนที่จะเป็นอุดมคติ. บั๊กจำนวนมากถูกจับได้ตรงนี้ก่อนถึง CI ด้วยซ้ำ" },
      { h: "ทริค 2: commit บ่อยแล้วค่อยจัดทีหลัง" },
      { p: "commit คือ save point ที่ reflog กู้ได้ ส่วนงานที่ยังไม่ commit ไม่มีอะไรกู้. commit รก ๆ 8 อันแล้ว `rebase -i` ให้เหลือ 2 อันที่อ่านรู้เรื่อง ปลอดภัยกว่าการเขียนยาว ๆ แล้วค่อย commit ครั้งเดียวเสมอ" },
      { h: "ทริค 3: --force-with-lease เป็น alias ให้พิมพ์สั้นกว่า" },
      { p: "ความปลอดภัยที่พิมพ์ยากกว่าจะแพ้ความเร็วเสมอในวันที่รีบ. ทำให้ทางที่ปลอดภัยเป็นทางที่ขี้เกียจกว่า" },
      { h: "ทริค 4: เปิด rerere ตั้งแต่วันแรก" },
      { p: "มันไม่มีข้อเสีย และวันที่เราต้องการมันคือวันที่ rebase branch ยาว ๆ ครั้งที่สาม ซึ่งสายเกินจะเปิดย้อนหลังแล้ว" },
      { h: "ทริค 5: includeIf แทนการจำว่าอยู่ repo ไหน" },
      { p: "อีเมลผิดใน commit แก้ย้อนหลังได้แค่ด้วยการเขียนประวัติใหม่ ซึ่งบน branch ที่แชร์แล้วแปลว่าแก้ไม่ได้จริง. ตั้งค่าเชิงโครงสร้างครั้งเดียวจบ" },
      { h: "ทริค 6: git switch / git restore แทน git checkout" },
      { p: "`checkout` ทำได้ทั้งย้าย branch, สร้าง branch, กู้ไฟล์ และทิ้งการแก้ — ความกำกวมนี้คือเหตุผลที่มันทำให้คนสับสนอยู่สิบปี. คำสั่งใหม่แยกหน้าที่ชัด และที่สำคัญกว่าคือ **อ่านออกตอนอยู่ในเอกสารทีม**" },
      { h: "ทริค 7: PR เล็กคือเครื่องมือด้านคุณภาพ ไม่ใช่มารยาท" },
      { p: "ความสามารถในการจับ defect ของผู้รีวิวตกลงตามขนาด diff อย่างชัดเจน. PR 2000 บรรทัดไม่ได้ 'ถูกรีวิวช้า' — มันไม่ได้ถูกรีวิวเลย. แตกงานให้ merge ได้ทีละชิ้นแม้ฟีเจอร์ยังไม่เสร็จ โดยซ่อนหลัง feature flag" },
      { h: "ทริค 8: git log --oneline --graph --decorate --all เป็น alias" },
      { p: "การเห็นรูปร่างของ DAG ก่อนตัดสินใจ merge/rebase ทำให้ผิดพลาดน้อยลงมาก. ตั้งเป็น `git lg` แล้วใช้มันแทน `git log` เปล่า ๆ" },
      { h: "ทริค 9: อ่าน error ของ push ให้ออก" },
      { p: "`! [rejected] non-fast-forward` แปลว่า **remote มี commit ที่เราไม่มี** ไม่ได้แปลว่า git งอแง. ทางแก้คือ `git pull --rebase` แล้ว push — ไม่ใช่ `--force` ซึ่งเป็นการตอบว่า 'ลบของที่ฉันไม่มีทิ้งไป'" },
      { h: "ทริค 10: .gitattributes ก่อนคนที่สองเข้าโปรเจกต์" },
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
      { p: "This page climbs from **never having typed git once** to **working on a team with branch protection and a merge queue**. Read it straight through, or use the learning-ladder table below to find the rung you are on and start there." },
      { h: "First: what problem does git solve?" },
      { code: String.raw`before git                        with git
------------------------------    ------------------------------
report.doc                        every version lives in one folder
report_v2.doc                     go back to any day you like
report_v2_final.doc               see who changed which line, when, and why
report_v2_final_USE_THIS.doc      two people edit different parts at once
report_final_fixed(2).doc         and their work merges without clobbering`, cap: "Git is a save button you can rewind to any point, plus a way to combine several people's work without overwriting", lang: "text" },
      { p: "Those two abilities are the same ability. Because git **remembers every state**, it can afford to let two people edit the same file and work out afterwards who changed what, relative to which shared starting point." },
      { h: "What is the technique underneath? (one sentence)" },
      { p: "Git is a **content-addressed object store with a pointer convention layered on top**. You do not have to understand that yet — but come back to this sentence after the 'Data Model' tab and almost every command becomes something you can **derive** rather than memorise." },
      { p: "One payoff you can see immediately: the 'pointers' (branches, tags, HEAD) are just files containing a hash. `git branch feat` writes a 41-byte file and copies not one line of code — **that alone is why branching is cheap enough to have changed how the industry works**, where SVN's was expensive enough to discourage it." },
      { h: "The learning ladder — which rung are you on?" },
      { table: { head: ["Rung", "What you can do", "All you need to know", "Which tab"], rows: [
        ["**0 · alone, one machine**", "save your own history and rewind it", "`init` `status` `add` `commit` `log`", "Identity & Keys, step 0"],
        ["**1 · with a remote**", "push to GitHub / vogsphere, clone onto a new machine", "SSH keys, `clone` `push` `pull`", "Identity & Keys, steps 0.5-3"],
        ["**2 · several branches**", "work on several things at once without mixing them", "`switch` `merge`, and what a conflict is", "Data Model + Team & Repo Structure"],
        ["**3 · on a team**", "PRs, review, resolving conflicts, undoing safely", "`rebase` `revert` `reflog` `force-with-lease`", "Daily Workflow & PRs + Recipes"],
        ["**4 · enterprise**", "set branch policy, CI gates, large repos, audit trails", "protected branches, merge queues, signing, LFS", "Team & Repo Structure + Workflow & PRs"],
      ]}},
      { note: "Rungs 0-1 take about an hour. **Rung 2 is where most people stall**, because it is the first that needs a mental model of how commits connect — which is why the 'Data Model' tab comes before any of the commands. If it does not land in text, go play with the **Visualizer** first: it steps through a real session showing which box each file moves between." },
      { h: "The ten commands that cover 95% of the time" },
      { table: { head: ["Command", "Means"], rows: [
        ["`git status`", "what has changed and what stage it is at — the one you type most, and it changes nothing"],
        ["`git add <file>`", "put this change in the basket for the next commit"],
        ["`git commit`", "save the basket as a permanent point in history"],
        ["`git log --oneline`", "see the history in brief"],
        ["`git diff`", "what changed that is not staged yet"],
        ["`git switch <branch>`", "move to another branch"],
        ["`git switch -c <new>`", "create a branch and move onto it"],
        ["`git pull`", "fetch what is new on the remote and merge it in"],
        ["`git push`", "send your work to the remote"],
        ["`git restore <file>`", "throw away your edits to that file, back to the last commit"],
      ]}},
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
      { h: "0) Zero to your first commit — no keys needed yet" },
      { p: "This step works **with no internet, no GitHub and no keys at all**. Git runs entirely on your machine; a remote is an optional extra you add later." },
      { code: String.raw`$ git config --global user.name "Wisanu"
$ git config --global user.email "you@example.com"
$ git config --global init.defaultBranch main

$ mkdir myproject && cd myproject
$ git init
Initialized empty Git repository in /home/me/myproject/.git/

$ echo "hello" > main.c
$ git status
Untracked files:
        main.c                      <- git can see it but is not looking after it

$ git add main.c
$ git status
Changes to be committed:
        new file:   main.c          <- now it is in the basket (the index)

$ git commit -m "add main.c"
[main (root-commit) a1b2c3d] add main.c

$ git log --oneline
a1b2c3d add main.c`, cap: "These six commands are the whole of rung 0 — repeat them until they are automatic before moving on", lang: "bash" },
      { p: "What just happened: `git init` created a hidden `.git/` folder holding all the history (delete it and the history goes, though your files stay). `git add` moved the change into the **basket**, and `git commit` sealed that basket as a permanent point you can always come back to." },
      { note: "**Why a basket at all — why not commit directly?** Because you often change three things at once and want three separate commits. The basket lets you choose what goes in this round, and `git add -p` lets you choose down to individual hunks. When you do not need that precision, `git commit -am \"...\"` skips the basket entirely." },
      { h: "0.5) From your first commit to your first push" },
      { code: String.raw`# Case 1: you already have work locally and want to send it up
$ git remote add origin git@github.com:me/myproject.git
$ git push -u origin main        # -u remembers this branch pairs with origin/main

# Case 2: the work is already on a remote and you want it locally
$ git clone git@github.com:me/myproject.git
# clone does init + remote add + fetch + switch in one command

# after that the loop is just
$ git pull        # bring down what is new
... do the work ...
$ git add -p && git commit
$ git push`, cap: "clone and init+remote add end in the same place; they differ only in which side already has the work", lang: "bash" },
      { note: "`git@github.com:...` is the **SSH** form and needs a key (step 1 below); `https://github.com/...` uses a token instead. SSH is set up once and then never asks you for anything again — which is why it is worth doing on day one." },
      { h: "0.75) Your first branch — the full cycle, creation to deletion" },
      { p: "A branch is **a pointer to one commit** that moves along as you commit. Creating one copies no files at all — it writes a 41-byte file containing a hash. That is what makes 'let me try something on the side' cost essentially nothing." },
      { code: String.raw`# 1. start from an up-to-date main — the step people skip most
$ git switch main
$ git pull

# 2. create the branch and move onto it in one command
$ git switch -c feat/login
Switched to a new branch 'feat/login'

# 3. work normally — commit as often as you like, nobody sees it yet
$ git add -p
$ git commit -m "add login handler"

# 4. first push, pairing the branch with the remote
$ git push -u origin feat/login
   after this, a bare git push works

# 5. open a PR -> review -> merge (done in the web UI)

# 6. clean up
$ git switch main
$ git pull                      # bring down the work you just merged
$ git branch -d feat/login      # delete locally (-d refuses if unmerged)
$ git fetch --prune             # drop the now-dead origin/feat/login`, cap: "One full cycle — steps 1 and 6 are the two everyone forgets, and they are why repos get cluttered", lang: "bash" },
      { note: "**Step 1 matters more than it looks**: `git switch -c` branches from **wherever you are standing at that moment**. Forget the `git pull` and your branch starts from a stale main, and the PR shows conflicts that should never have existed. To branch from elsewhere without moving first, `git switch -c feat/x origin/main` does it in one go." },
      { h: "Naming branches so your team can read them" },
      { table: { head: ["Pattern", "Example", "Use for"], rows: [
        ["`feat/<topic>`", "`feat/login`, `feat/bench-flag`", "new features"],
        ["`fix/<topic>`", "`fix/leak-on-error-path`", "bug fixes"],
        ["`refactor/` `docs/` `test/` `chore/`", "`refactor/split-parse`", "work that does not change behaviour"],
        ["`hotfix/<topic>`", "`hotfix/null-deref`", "urgent fixes going straight to production"],
        ["`<login>/<topic>`", "`wiaon-in/disorder-metric`", "busy repos where whose-branch-is-this matters"],
        ["`<ticket>-<topic>`", "`PROJ-1234-login`", "teams tied to an issue tracker"],
      ]}},
      { note: "The only rule that really matters: **the name should say what the work is without opening it.** `feat/login` beats `wiaon-branch-2` every time. Avoid spaces and special characters, separate words with `-`, and use `/` for grouping — many tools display those as folders." },
      { h: "Branched from the wrong place, or committed to the wrong branch" },
      { table: { head: ["Situation", "Fix"], rows: [
        ["Committed to main by accident, not pushed yet", "`git switch -c feat/x` (the commits come with you), then `git switch main` and `git reset --hard origin/main`"],
        ["Committed to the wrong branch and pushed", "`git switch <right>`, `git cherry-pick <sha>`, then on the old branch `git revert <sha>`"],
        ["Branched from a stale main", "`git fetch` then `git rebase origin/main`"],
        ["Accidentally branched off another branch", "`git rebase --onto main <old-base> <your-branch>`"],
        ["Want to see where you branched from", "`git merge-base --fork-point main HEAD`, or read the picture from `git log --graph --oneline --all`"],
        ["Named the branch wrong", "`git branch -m <new>`, then `git push -u origin <new>` and `git push origin --delete <old>`"],
      ]}},
      { note: "Read `git rebase --onto main old-base my-branch` as 'take the commits between old-base and my-branch and put them on main'. It is the one command that directly fixes 'I branched off a branch', and it is why it takes three arguments." },
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
      { note: "`.gitignore` **only affects files that are not yet tracked.** Once a file is tracked, adding it to .gitignore does nothing — you must `git rm --cached <file>` first. Machine-local ignores you do not want to share go in `.git/info/exclude`." },
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
      { note: "Submodules are a frequent source of 'it works on my machine', because a submodule that has not been updated sits detached and is **invisible in git status** unless you go looking." },
      { h: "Running several repositories at once" },
      { p: "Once you have several projects, the problem stops being 'how do I use git' and becomes **'how do I never lose track of which repo I am in, under which identity, and which ones are unpushed'**. All three are solved structurally, not by memory." },
      { h: "1) A folder layout you can predict" },
      { code: String.raw`~/code/
├── 42/            <- every school repo (vogsphere remotes)
│   ├── libft/
│   ├── ft_printf/
│   └── push_swap/
├── work/          <- company repos (work email + signed commits)
│   └── api/
└── personal/      <- your own (personal email)
    └── dotfiles/`, cap: "This layout is not for tidiness — it is what lets includeIf set your identity automatically by folder", lang: "text" },
      { code: String.raw`# ~/.gitconfig — identity follows location, so you never have to remember
[user]
    name = Wisanu
    email = personal@example.com

[includeIf "gitdir:~/code/42/"]
    path = ~/.gitconfig-42
[includeIf "gitdir:~/code/work/"]
    path = ~/.gitconfig-work`, cap: "Agree the paths once and every repo you clone into them gets the right identity immediately", lang: "text" },
      { note: "Always end a `gitdir:` with `/` — without it the rule matches only that one directory, not what is inside it. Verify with `git config user.email` in each place, or `git config --list --show-origin` when you need to know which file a value came from." },
      { h: "2) git -C — act on another repo without cd" },
      { table: { head: ["Command", "What it does"], rows: [
        ["`git -C ~/code/42/libft status`", "run git in that repo without moving yourself — the basis of every script below"],
        ["`git -C <dir> rev-parse --is-inside-work-tree`", "check the folder really is a repo before doing anything to it"],
        ["`git -C <dir> log -1 --format=%cr`", "how long since the last commit — how you find abandoned repos"],
      ]}},
      { code: String.raw`# which repos have uncommitted work or unpushed commits
for d in ~/code/*/*/; do
    git -C "$d" rev-parse --is-inside-work-tree >/dev/null 2>&1 || continue
    dirty=$(git -C "$d" status --porcelain)
    ahead=$(git -C "$d" log --oneline @{u}.. 2>/dev/null | wc -l)
    if [ -n "$dirty" ] || [ "$ahead" -gt 0 ]; then
        printf "%-28s %s dirty, %s unpushed\n" \
            "$(basename "$d")" "$(echo "$dirty" | grep -c .)" "$ahead"
    fi
done`, cap: "Run it before you stop for the day — it catches 'forgot to push', which at 42 means the work does not exist at correction time", lang: "bash" },
      { code: String.raw`# refresh every repo in one go without disturbing work in progress
for d in ~/code/*/*/; do
    git -C "$d" fetch --all --prune --quiet 2>/dev/null &&
        echo "fetched $(basename "$d")"
done`, cap: "fetch, not pull — fetch never touches the branch you are working on, so it is safe to run unattended", lang: "bash" },
      { note: "**Never loop git pull over every repo.** Pull is fetch plus merge/rebase, so it moves branches you have unfinished work on and can create conflicts in repos you are not even looking at. Fetching alone is always safe; merge each one when you actually sit down to work on it." },
      { h: "3) Several branches of one repo — worktree instead of stash" },
      { p: "Urgent bug to fix while your current work is not ready to commit? There are three options, and **worktree is the one people forget** even though it usually fits best." },
      { table: { head: ["Approach", "You get", "You pay"], rows: [
        ["`git stash`", "fast, no disk cost", "the work vanishes from sight, is easy to forget, and popping it later can conflict"],
        ["a second clone", "fully independent", "downloads the repo again; remotes and config must be set up twice"],
        ["`git worktree`", "another folder on another branch **sharing one .git** — your existing work stays exactly as it is", "you have to remember to remove it afterwards"],
      ]}},
      { code: String.raw`$ git worktree add ../myproject-hotfix -b hotfix/crash origin/main
# a new folder at ../myproject-hotfix, sitting on hotfix/crash
# the original folder keeps its work in progress; nothing was stashed

$ cd ../myproject-hotfix && ...fix... && git push -u origin hotfix/crash

$ git worktree list                       # what is currently checked out where
$ git worktree remove ../myproject-hotfix # clean up when done`, cap: "Objects are stored once, so it costs far less disk than another clone, and branches, tags and remotes are all shared", lang: "bash" },
      { note: "The one limitation worth knowing: **a branch can be checked out in only one worktree at a time.** With `main` open in one, another cannot switch to `main` — git says so plainly. That is a feature, not a bug: two checkouts of the same branch would fight over the index." },
      { h: "4) Forks that have to track upstream" },
      { code: String.raw`$ git remote add upstream git@github.com:original/repo.git
$ git remote -v
origin    git@github.com:me/repo.git       (fetch/push)   <- yours
upstream  git@github.com:original/repo.git (fetch/push)   <- the original

$ git fetch upstream
$ git switch main
$ git rebase upstream/main      # or merge, if others share your main
$ git push`, cap: "origin is your fork, upstream is the real thing — set it once and you can follow along forever", lang: "bash" },
      { h: "5) Making settings consistent without visiting every repo" },
      { table: { head: ["What you want everywhere", "How"], rows: [
        ["Identity (name/email/signing)", "`includeIf` by folder (point 1)"],
        ["Files you never want to see (`.DS_Store`, `.idea/`)", "`git config --global core.excludesfile ~/.gitignore_global` — no need to push them into every project's .gitignore"],
        ["The same hooks", "`git config --global core.hooksPath ~/.githooks`"],
        ["Aliases and pull/push behaviour", "`git config --global ...` once, applies everywhere"],
        ["Automatic housekeeping", "`git maintenance start` in each large repo (it schedules itself)"],
      ]}},
      { note: "`core.excludesfile` is the setting people learn last: junk from **your machine** (the OS, your editor) does not belong in a `.gitignore` you commit for the team, because it is your problem alone. Put it in the global file and every repo is clean at once." },
      { h: "6) Tooling for when there really are a lot" },
      { table: { head: ["Tool", "Problem it solves"], rows: [
        ["`gh repo list <org> --limit 100`", "find out what exists, and clone in bulk with `gh repo clone`"],
        ["`gh pr list --search \"is:open author:@me\"`", "all of your open PRs across every repo in one place"],
        ["`git submodule`", "repos that genuinely must pin each other's versions — not merely 'I want both open'"],
        ["The `for` loop in point 2", "enough for dozens of repos, and installs nothing"],
      ]}},
      { note: "Before reaching for a tool, ask what the problem actually is. If it is 'one change spans several repos and they must ship together', that is a signal for a **monorepo**, not for tooling to coordinate N repos — see the comparison table above." },
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
      { h: "A story: two people, one repo, one conflict" },
      { p: "Everything in this tab converges on this one situation — follow it line by line and you can see why each rule exists." },
      { code: String.raw`Monday 09:00  A and B both clone the same repo. Both sit at commit E.

A: git switch -c feat/login        B: git switch -c feat/logout
   edits auth.c line 40               edits auth.c line 42
   git add -p; git commit            git add -p; git commit

Monday 11:00  B finishes first
B: git push -u origin feat/logout
   opens a PR -> reviewer approves -> squash merge into main
   main is now = E + logout

Monday 14:00  A finishes
A: git push -u origin feat/login   -> fine (different branch, no clash)
   opens a PR
   CI says: "This branch is out-of-date with the base branch"

A: git switch feat/login
   git fetch origin
   git rebase origin/main          <- replay my work on top of the new main

   CONFLICT (content): Merge conflict in auth.c
   <<<<<<< ours (main = B's work)
   int logout(void) { ... }
   =======
   int login(void) { ... }
   >>>>>>> theirs (A's commit)

   edit the file to keep both functions
   git add auth.c
   git rebase --continue

A: git push --force-with-lease     <- force is required: rebase changed the hashes
                                      but with-lease refuses if anyone else touched it
   CI green -> squash merge -> done`, cap: "A conflict is not a failure — it is git saying 'I cannot guess this one for you'", lang: "text" },
      { p: "Three things worth noticing. **(1)** A and B never clash at all until A has to replay onto the new main — the branches really are independent right up to integration. **(2)** During a rebase, *ours* is **main**, not A's work, because rebase is replaying A's commits one at a time on top of main, so the side that 'already exists' is main. That is the reverse of a merge, and it is the single most confusing thing about rebase. **(3)** The `--force-with-lease` at the end is not a dangerous act — it is the normal shape of 'I rebased my own branch, now push it'." },
      { note: "Had A sat on that branch for three weeks instead of five hours, the conflict would not be one spot but dozens. That is the entire reason trunk-based development insists on short-lived branches — not taste, but the volume of integration work you defer." },
    ],

    implementation: [
      { h: "0) The panic table — \"I broke something, now what\"" },
      { p: "Read this one while you are panicking. Almost every row is safe and reversible — except the ones marked otherwise." },
      { table: { head: ["What happened", "What to type", "Is it dangerous?"], rows: [
        ["Edited a file into a mess, want the old one", "`git restore <file>`", "**discards the edits permanently** — uncommitted work is not recoverable"],
        ["`git add`ed the wrong file", "`git restore --staged <file>`", "safe; the file is untouched"],
        ["Wrong message on the last commit", "`git commit --amend`", "safe if you have not pushed"],
        ["Forgot a file in the last commit", "`git add <file>` then `git commit --amend --no-edit`", "safe if you have not pushed"],
        ["Committed on the wrong branch", "`git switch <right>`, `git cherry-pick <sha>`, then drop the old one", "safe"],
        ["Want to undo a commit that is already pushed", "`git revert <sha>`", "the safest option — it makes a new commit that undoes the old"],
        ["Stuck mid merge/rebase and want out", "`git merge --abort` / `git rebase --abort`", "safe; returns you exactly where you started"],
        ["Work in progress but you must fix something urgent", "`git stash push -m \"wip\"` then `git stash pop`", "safe"],
        ["\"My commit disappeared\"", "`git reflog`, then `git branch rescued <sha>`", "safe — almost nothing is really gone"],
        ["Push rejected as non-fast-forward", "`git pull --rebase`, then push again", "safe — **do not use --force**"],
        ["You really do need to overwrite (your own branch)", "`git push --force-with-lease`", "refuses by itself if it would clobber someone else"],
      ]}},
      { note: "Notice that only the **first two rows** can destroy work permanently, and both involve changes that were **never committed**. That is the same rule as on the overview page: commit often and nearly every mistake becomes recoverable." },
      { h: "1) The undo table — pick the right one" },
      { table: { head: ["Situation", "Command", "Rewrites history?"], rows: [
        ["Fix the last commit (message or content)", "`git commit --amend`", "yes"],
        ["Collapse the last 3 commits into one", "`git reset --soft HEAD~3` then commit", "yes"],
        ["Reorder / squash / drop several commits", "`git rebase -i HEAD~5`", "yes"],
        ["Copy one commit onto this branch", "`git cherry-pick <sha>`", "no (creates new)"],
        ["Undo a commit that is already pushed", "`git revert <sha>`", "**no — the only safe route**"],
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
        ["CI only needs the tip", "`git clone --depth 1`", "**breaks merge-base, blame and PR diffs**"],
        ["You only work in one subtree", "`git sparse-checkout set apps/web`", "-"],
        ["Large binaries", "**git LFS**", "needs server-side setup too"],
        ["Several branches checked out at once", "`git worktree add ../hotfix main`", "one clone, several working trees"],
        ["Repo gets slower over time", "`git maintenance start`", "schedules gc, commit-graph and prefetch"],
      ]}},
      { h: "📖 Command reference — the flags you actually use" },
      { p: "This part is for looking things up, not reading straight through. Three conventions that apply almost everywhere: `--` separates branch names from file names (`git restore -- main.c` when a file shares a name with a branch), `-n` or `--dry-run` shows what would happen without doing it, and `HEAD~2` means two generations back along first parents while `HEAD^2` means the second parent of a merge commit — different things." },

      { h: "git add — where . and -A genuinely differ" },
      { table: { head: ["Command", "What it does", "Watch out"], rows: [
        ["`git add <file>`", "stage that file", "-"],
        ["`git add .`", "everything **from the current directory down** (new + modified + deleted)", "run it from a subfolder and you stage less than you think"],
        ["`git add -A`", "everything in the **whole repo**, wherever you are standing", "usually what people mean when they type `git add .`"],
        ["`git add -u`", "only files already **tracked** (modified + deleted), no new files", "good when you do not want to sweep up junk"],
        ["`git add -p`", "hunk by hunk — `y` yes, `n` no, `s` split further, `e` edit, `q` quit", "the habit worth making default"],
        ["`git add -n .`", "list what would be staged without staging", "-"],
        ["`git add -f <file>`", "force-add a file that .gitignore excludes", "only when you know exactly why"],
      ]}},
      { note: "The short version: `.` **is where you stand**, `-A` **is the whole repo**, `-u` **is tracked files only**. Since git 2.0 `git add .` does include deletions (it did not before) — so older advice telling you to use `git add -A` because `.` misses deleted files is out of date." },

      { h: "git commit" },
      { table: { head: ["Command", "What it does"], rows: [
        ["`git commit`", "opens the editor for a full message — what you want whenever it is longer than one line"],
        ["`git commit -m \"message\"`", "single-line message"],
        ["`git commit -m \"subject\" -m \"body\"`", "two -m flags give you subject + body paragraph without opening the editor"],
        ["`git commit -a` / `-am \"...\"`", "auto-stage tracked files and commit — **does not include new files**"],
        ["`git commit --amend`", "rewrite the last commit (message and whatever is staged)"],
        ["`git commit --amend --no-edit`", "fold extra changes into the last commit, leaving the message alone"],
        ["`git commit --amend --reset-author`", "fix the author name/email on the last commit to your current config"],
        ["`git commit --fixup=<sha>`", "make a commit marked to fold into that sha; pair with `rebase --autosquash`"],
        ["`git commit --allow-empty`", "an empty commit — useful to trigger CI or mark a point in history"],
        ["`git commit -S`", "sign this commit (if commit.gpgsign is not already on)"],
        ["`git commit --no-verify`", "skip pre-commit hooks — the reason hooks are not enforcement"],
      ]}},

      { h: "git status · git diff · git show" },
      { table: { head: ["Command", "What it does"], rows: [
        ["`git status -s`", "short form: `??` untracked, `M` modified, `A` added — left column is the index, right is the working tree"],
        ["`git status -sb`", "short form plus a branch line showing how far ahead/behind the remote you are"],
        ["`git status --ignored`", "also list files .gitignore is excluding — how you check your ignore rules work"],
        ["`git diff`", "working tree vs index — what you have not staged"],
        ["`git diff --staged`", "index vs HEAD — what you are about to commit (`--cached` is the same)"],
        ["`git diff HEAD`", "both at once — everything changed since the last commit"],
        ["`git diff main..feat`", "tip of main vs tip of feat"],
        ["`git diff main...feat`", "their **merge base** vs the tip of feat — this is what a PR shows"],
        ["`git diff --name-only` / `--stat`", "just the file list / a per-file line summary"],
        ["`git diff -w`", "ignore whitespace-only changes"],
        ["`git diff -- <path>`", "restrict to that path"],
        ["`git show <sha>`", "that commit plus its diff"],
        ["`git show <sha>:<path>`", "the file's contents at that commit, without checking anything out"],
      ]}},
      { note: "`..` and `...` are a classic confusion, and they swap meaning between `diff` and `log`. Remember it this way: in **diff**, three dots means 'compare from the merge base' (what a PR shows); in **log**, three dots means 'commits on either side but not both'." },

      { h: "git log" },
      { table: { head: ["Command", "What it does"], rows: [
        ["`git log --oneline`", "one line per commit"],
        ["`git log --oneline --graph --decorate --all`", "see the actual DAG shape — alias this to `git lg`"],
        ["`git log -5`", "just the last five"],
        ["`git log -p`", "attach each commit's diff"],
        ["`git log --stat`", "attach a per-file line-count summary"],
        ["`git log --author=\"wiaon\"`", "filter by author"],
        ["`git log --since=\"2 weeks ago\"`", "filter by time (`--until` too)"],
        ["`git log --no-merges`", "drop merge commits; much easier to read"],
        ["`git log -S \"text\"`", "commits that changed the number of occurrences of that text (the pickaxe)"],
        ["`git log -G \"regex\"`", "commits whose diff matches the regex"],
        ["`git log --follow -- <path>`", "history across renames"],
        ["`git log main..feat`", "commits in feat but not main — 'what does this PR add'"],
        ["`git log --left-right main...feat`", "commits unique to each side, marked by which side"],
      ]}},

      { h: "git branch · git switch · git restore" },
      { table: { head: ["Command", "What it does"], rows: [
        ["`git branch`", "list local branches (`-a` includes remotes, `-r` only remotes)"],
        ["`git branch -vv`", "which remote each branch tracks and how far ahead/behind it is"],
        ["`git branch -d <name>`", "delete a merged branch — **refuses if it is not merged**, which is the feature"],
        ["`git branch -D <name>`", "delete regardless (recoverable via reflog)"],
        ["`git branch -m <new>`", "rename the current branch"],
        ["`git branch --merged` / `--no-merged`", "find branches safe to clean up / branches with work still on them"],
        ["`git switch <name>`", "move to that branch"],
        ["`git switch -c <new>`", "create it and move onto it (`-c` = create)"],
        ["`git switch -c <new> <sha|branch>`", "create from somewhere other than where you are"],
        ["`git switch -`", "back to the previous branch — like `cd -`"],
        ["`git switch --detach <sha>`", "stand on a commit without attaching to a branch"],
        ["`git restore <file>`", "discard your edits to that file — **uncommitted work is gone for good**"],
        ["`git restore --staged <file>`", "unstage it without touching the file"],
        ["`git restore --source=<sha> <file>`", "pull that file's version from a given commit"],
      ]}},

      { h: "git stash — parking work in progress" },
      { table: { head: ["Command", "What it does"], rows: [
        ["`git stash push -m \"message\"`", "park the work and leave a clean working tree (always name it)"],
        ["`git stash push -u`", "include untracked files — **without -u your new files are left behind**"],
        ["`git stash push -- <path>`", "stash only certain paths"],
        ["`git stash list`", "see `stash@{0}`, `stash@{1}`, ..."],
        ["`git stash show -p stash@{1}`", "the diff of that stash"],
        ["`git stash pop`", "bring it back and drop it from the list"],
        ["`git stash apply stash@{1}`", "bring it back but keep it in the list"],
        ["`git stash drop stash@{0}`", "discard that one (`clear` discards all)"],
        ["`git stash branch <name>`", "create a branch from where the stash was taken and apply it — the way out when pop conflicts"],
      ]}},

      { h: "git merge · git rebase · git cherry-pick · git revert" },
      { table: { head: ["Command", "What it does"], rows: [
        ["`git merge <branch>`", "merge it in, fast-forwarding when possible"],
        ["`git merge --no-ff <branch>`", "force a merge commit so 'this branch existed' stays in the history"],
        ["`git merge --squash <branch>`", "bring the changes into the index **without committing**, so you commit them yourself"],
        ["`git merge --abort` / `--continue`", "back out / carry on after resolving"],
        ["`git merge -X ours` / `-X theirs`", "auto-pick a side on conflict — only when you know the other side does not matter"],
        ["`git rebase <base>`", "replay your commits on top of base"],
        ["`git rebase -i HEAD~5`", "interactive: pick / reword / squash / fixup / edit / drop"],
        ["`git rebase -i --autosquash`", "order the --fixup commits for you"],
        ["`git rebase --onto <new> <old> <branch>`", "move a branch to a different base — e.g. cut it off the wrong parent"],
        ["`git rebase --abort` / `--continue` / `--skip`", "back out / carry on / drop this commit"],
        ["`git cherry-pick <sha>`", "copy that commit onto the current branch"],
        ["`git cherry-pick -n <sha>`", "copy it into the index without committing"],
        ["`git cherry-pick -x <sha>`", "record which commit it came from — always use this when backporting"],
        ["`git cherry-pick A..B`", "copy a range"],
        ["`git revert <sha>`", "a new commit that undoes an old one — safe on pushed history"],
        ["`git revert -n <sha>`", "undo without committing (to combine several into one)"],
        ["`git revert -m 1 <merge sha>`", "revert a merge — `-m 1` says which parent counts as the mainline"],
      ]}},
      { note: "`-m 1` is required when reverting a merge because a merge commit has two parents, so git cannot know which one 'before' refers to. `-m 1` means the branch you merged into — normally main, and normally what you want." },

      { h: "git reset · git clean" },
      { table: { head: ["Command", "What it does", "Dangerous?"], rows: [
        ["`git reset --soft HEAD~1`", "drop the last commit, keep everything staged", "no"],
        ["`git reset HEAD~1`", "(`--mixed`, the default) drop the commit and unstage; files untouched", "no"],
        ["`git reset --hard HEAD~1`", "drop it and **overwrite your files too**", "**yes — uncommitted work is lost**"],
        ["`git reset <sha> -- <path>`", "unstage that path relative to that commit", "no"],
        ["`git reset --hard origin/main`", "make the local branch exactly match the remote", "**yes — local work is lost**"],
        ["`git clean -n`", "list which untracked files would be deleted, deleting nothing", "no — **always run this first**"],
        ["`git clean -fd`", "delete untracked files and directories", "**yes — never in git, so nothing to recover from**"],
        ["`git clean -fdx`", "also delete .gitignored things (build output, .env)", "**the most dangerous — your .env file goes too**"],
      ]}},
      { note: "`git clean` is the most dangerous command on this page, because what it deletes **was never in git** — there is no reflog and no object to recover from. Make it a habit: `git clean -n` before every `git clean -f`." },

      { h: "git remote · git fetch · git pull · git push" },
      { table: { head: ["Command", "What it does"], rows: [
        ["`git remote -v`", "which remote names point where"],
        ["`git remote add <name> <url>`", "add one (`set-url` to change, `rename`, `remove`)"],
        ["`git remote show origin`", "details: which branch tracks what, and which are already gone"],
        ["`git fetch`", "download new work without touching the branch you are on"],
        ["`git fetch --all --prune`", "every remote, and drop remote-tracking branches that were deleted"],
        ["`git fetch origin <branch>`", "just one branch"],
        ["`git pull --rebase`", "fetch, then replay your commits on top (no merge commit)"],
        ["`git pull --ff-only`", "fetch, then move the pointer; stop if it cannot — the most predictable option"],
        ["`git pull --autostash`", "stash your work in progress and restore it afterwards"],
        ["`git push`", "send to the tracked remote"],
        ["`git push -u origin <branch>`", "first push, and remember the pairing"],
        ["`git push --tags` / `--follow-tags`", "send tags too — **a plain push does not**"],
        ["`git push origin --delete <branch>`", "delete a branch on the remote"],
        ["`git push --dry-run`", "say what would be sent, send nothing"],
        ["`git push --force-with-lease`", "overwrite, but refuse if the remote moved since your last fetch"],
      ]}},

      { h: "git tag" },
      { table: { head: ["Command", "What it does"], rows: [
        ["`git tag`", "list tags (`-l \"v1.*\"` filters by pattern)"],
        ["`git tag -a v1.4.0 -m \"...\"`", "annotated — a real object with a tagger, date and message"],
        ["`git tag -s v1.4.0 -m \"...\"`", "annotated and signed"],
        ["`git tag v1.4.0`", "lightweight — just a ref, no metadata at all. **Not for releases**"],
        ["`git tag -a v1.4.0 <sha>`", "tag an older commit retroactively"],
        ["`git tag -d v1.4.0`", "delete locally (on the remote: `git push origin --delete v1.4.0`)"],
        ["`git describe --tags`", "a readable version name for the current commit, e.g. `v1.4.0-12-gab34cd`"],
      ]}},

      { h: "Investigation commands" },
      { table: { head: ["Command", "What it does"], rows: [
        ["`git reflog`", "every move of HEAD for ~90 days — the starting point of every recovery"],
        ["`git reflog show <branch>`", "the movement history of that branch specifically"],
        ["`git blame -w -C -L 40,60 <file>`", "who touched which line (`-w` ignores whitespace, `-C` follows moved code)"],
        ["`git bisect start` / `bad` / `good <sha>`", "binary search for the commit that broke it"],
        ["`git bisect run ./test.sh`", "let a script decide; ~10 steps for 1000 commits"],
        ["`git grep \"text\"`", "search tracked files — faster than grepping the folder because it skips build output"],
        ["`git grep \"text\" <sha>`", "search the contents as of that commit"],
        ["`git shortlog -sn`", "commit counts per person"],
        ["`git fsck --lost-found`", "find objects nothing points at — for when even the reflog is exhausted"],
      ]}},

      { h: "clone · worktree · submodule" },
      { table: { head: ["Command", "What it does"], rows: [
        ["`git clone <url> <dir>`", "choose the destination folder name"],
        ["`git clone -b <branch> <url>`", "clone and land on that branch"],
        ["`git clone --depth 1 <url>`", "only the latest commit — **breaks merge-base, blame and PR diffs**"],
        ["`git clone --filter=blob:none <url>`", "full history, contents fetched on demand — usually better than --depth"],
        ["`git clone --recurse-submodules <url>`", "clone and populate submodules in one go"],
        ["`git worktree add ../hotfix main`", "a second branch checked out in another folder, sharing one clone"],
        ["`git worktree list` / `remove <path>`", "list them / detach one"],
        ["`git submodule update --init --recursive`", "populate submodules — the command everyone forgets"],
        ["`git submodule update --remote`", "advance submodules to their own latest tip"],
      ]}},

      { h: "Config you will actually set" },
      { table: { head: ["Command", "What it does"], rows: [
        ["`git config --list --show-origin`", "every value and which file it came from — the fix for 'why is this set like that'"],
        ["`git config --global <key> <value>`", "user level (`--local` for one repo, `--system` for the machine)"],
        ["`git config --global --unset <key>`", "remove a setting"],
        ["`git config --global alias.lg \"log --oneline --graph --decorate --all\"`", "gives you `git lg`"],
        ["`git config --global alias.pushf \"push --force-with-lease --force-if-includes\"`", "makes the safe path shorter to type than the dangerous one"],
        ["`git config --global core.editor \"code --wait\"`", "write commit messages in VS Code"],
        ["`git config --global rerere.enabled true`", "remember conflict resolutions and replay them"],
        ["`git config --global fetch.prune true`", "clear out dead remote branches on every fetch"],
      ]}},
      { note: "For the genuinely complete flag list of any command: `git help <command>` opens the full documentation, and `git <command> -h` prints a short summary in the terminal. Between them they answer everything the tables above left out." },
    ],

    tricks: [
      { h: "Trick 1: git add -p, every time" },
      { p: "It makes you read your own diff before anyone else does, and it makes one-change-per-commit natural rather than aspirational. A surprising number of bugs get caught right here, before CI ever runs." },
      { h: "Trick 2: commit often, tidy later" },
      { p: "A commit is a save point the reflog can recover; uncommitted work is not recoverable at all. Eight messy commits followed by a `rebase -i` down to two readable ones is strictly safer than writing for hours and committing once." },
      { h: "Trick 3: alias --force-with-lease shorter than --force" },
      { p: "Safety that is harder to type always loses on the day you are in a hurry. Make the safe path the lazy path." },
      { h: "Trick 4: enable rerere on day one" },
      { p: "It has no downside, and the day you want it is the third rebase of a long branch — by which point enabling it retroactively does nothing for the rounds you already suffered through." },
      { h: "Trick 5: includeIf instead of remembering which repo you are in" },
      { p: "A wrong email in a commit can only be fixed by rewriting history, which on a shared branch means it cannot really be fixed. Configure it structurally, once." },
      { h: "Trick 6: git switch / git restore over git checkout" },
      { p: "`checkout` switches branches, creates branches, restores files and discards changes — that ambiguity is why it confused people for a decade. The newer commands separate the jobs, and more importantly they are **readable in a team runbook**." },
      { h: "Trick 7: small PRs are a quality tool, not etiquette" },
      { p: "Reviewer defect-detection drops sharply with diff size. A 2000-line PR is not 'reviewed slowly' — it is not reviewed. Split work so it can merge in pieces even when the feature is unfinished, hidden behind a feature flag." },
      { h: "Trick 8: alias git log --oneline --graph --decorate --all" },
      { p: "Seeing the shape of the DAG before deciding to merge or rebase prevents most mistakes. Bind it to `git lg` and use it instead of bare `git log`." },
      { h: "Trick 9: read the push error properly" },
      { p: "`! [rejected] non-fast-forward` means **the remote has commits you do not** — it is not git being difficult. The fix is `git pull --rebase` then push. `--force` is answering 'then delete whatever I do not have'." },
      { h: "Trick 10: add .gitattributes before the second person joins" },
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

/* ---- Flow Visualizer: ไล่ session จริงทีละคำสั่ง ว่าไฟล์ย้ายช่องไหน ---- */
window.EXTRA_FLOWS = window.EXTRA_FLOWS || {};
window.EXTRA_FLOWS.tool_git = {
  input: "แก้ไฟล์ 1 ไฟล์ แล้วส่งขึ้น remote — ไล่ทีละคำสั่งว่าของอยู่ช่องไหน",
  steps: [
    { fn: "git init", file: "สร้าง repo", depth: 0,
      note: { th: "สร้างโฟลเดอร์ซ่อน `.git/` ขึ้นมา — **ประวัติทั้งหมดอยู่ในนั้น** ลบโฟลเดอร์นี้คือลบประวัติ (ไฟล์งานยังอยู่ครบ). ยังไม่มี commit สักอัน HEAD จึงชี้ไปที่ branch ที่ยังไม่มีอยู่จริง",
              en: "Creates the hidden `.git/` folder — **all history lives in there.** Delete it and the history goes while your files stay. There are no commits yet, so HEAD points at a branch that does not exist." },
      data: "working tree   index          local repo     remote\n-------------  -------------  -------------  -------------\n(ว่าง)         (ว่าง)         (ว่าง)         (ยังไม่มี)",
      vars: [ { n: "HEAD", v: "ref: refs/heads/main", d: { th: "ชี้ไป branch ที่ยังไม่มี commit", en: "points at a branch with no commits yet" }, w: true } ] },

    { fn: "แก้ main.c", file: "working tree", depth: 0,
      note: { th: "ตอนนี้ไฟล์เปลี่ยนแล้วแต่ git **ยังไม่ได้บันทึกอะไรเลย** — `git status` จะขึ้นเป็น untracked หรือ modified. ขั้นนี้คือขั้นเดียวที่การแก้ยังหายถาวรได้",
              en: "The file has changed but git **has recorded nothing yet** — `git status` shows it as untracked or modified. This is the only stage where an edit can still be lost for good." },
      data: "working tree   index          local repo     remote\n-------------  -------------  -------------  -------------\nmain.c (แก้)   (ว่าง)         (ว่าง)         (ยังไม่มี)",
      vars: [ { n: "main.c", v: "modified", d: { th: "ยังไม่ถูกติดตาม กู้ไม่ได้ถ้าลบทิ้ง", en: "not yet recorded anywhere; unrecoverable if discarded" } } ] },

    { fn: "git add main.c", file: "working tree -> index", depth: 0,
      note: { th: "ย้ายสถานะไฟล์เข้า **ตะกร้า (index)** ซึ่งเป็นไฟล์จริงชื่อ `.git/index`. ตะกร้ามีไว้ให้เลือกว่ารอบนี้จะ commit อะไร — แก้สามเรื่องแต่ commit ทีละเรื่องได้. `git add -p` เลือกได้ละเอียดถึงระดับ hunk",
              en: "Moves the file's state into the **basket (the index)**, a real file at `.git/index`. The basket exists so you can choose what goes into this commit — three changes, three commits. `git add -p` picks hunk by hunk." },
      data: "working tree   index          local repo     remote\n-------------  -------------  -------------  -------------\nmain.c         main.c ✓       (ว่าง)         (ยังไม่มี)",
      vars: [ { n: ".git/index", v: "main.c staged", d: { th: "tree ของ commit ถัดไปกำลังถูกประกอบ", en: "the next commit's tree is being assembled" }, w: true } ] },

    { fn: "git commit -m \"...\"", file: "index -> local repo", depth: 0,
      note: { th: "สร้าง **object 3 ชนิดพร้อมกัน**: blob (เนื้อไฟล์), tree (ไดเรกทอรี), commit (tree + parent + ผู้เขียน + ข้อความ). ตั้งแต่วินาทีนี้เป็นต้นไป **งานชิ้นนี้กู้ได้เสมอ** ผ่าน reflog แม้จะ reset --hard ทับ",
              en: "Creates **three objects at once**: a blob (contents), a tree (the directory), and a commit (tree + parent + author + message). From this second on, **this work is always recoverable** through the reflog, even after a reset --hard." },
      data: "working tree   index          local repo     remote\n-------------  -------------  -------------  -------------\nmain.c         main.c         a1b2c3d ✓      (ยังไม่มี)\n\nobject ที่เพิ่ง สร้าง: blob(hello) -> tree -> commit a1b2c3d",
      vars: [ { n: "HEAD", v: "a1b2c3d", d: { th: "branch main ขยับมาชี้ commit ใหม่", en: "branch main moves to the new commit" }, w: true } ] },

    { fn: "git remote add origin ...", file: "ตั้งค่า", depth: 0,
      note: { th: "แค่จดที่อยู่ไว้ใน `.git/config` — **ยังไม่มีอะไรถูกส่งไปไหน**. `git clone` ทำขั้นนี้ให้อัตโนมัติพร้อมกับ init และ fetch",
              en: "Just records an address in `.git/config` — **nothing is sent anywhere yet.** `git clone` does this step for you along with init and fetch." },
      data: "working tree   index          local repo     remote\n-------------  -------------  -------------  -------------\nmain.c         main.c         a1b2c3d        (รู้จักที่อยู่แล้ว)",
      vars: [ { n: "origin", v: "git@github.com:me/p.git", d: { th: "ชื่อเล่นของ remote — 'origin' เป็นแค่ธรรมเนียม", en: "a nickname for the remote; 'origin' is only a convention" }, w: true } ] },

    { fn: "git push -u origin main", file: "local repo -> remote", depth: 0,
      note: { th: "ส่ง object ที่ remote ยังไม่มี แล้วขอให้ remote ขยับ branch ตาม. `-u` จำคู่ไว้ว่า `main` ผูกกับ `origin/main` ครั้งต่อไปพิมพ์ `git push` เปล่า ๆ ได้เลย. **ถ้า remote มี commit ที่เราไม่มี push จะถูกปฏิเสธ** ว่า non-fast-forward",
              en: "Sends the objects the remote lacks and asks it to move its branch. `-u` remembers that `main` pairs with `origin/main`, so a bare `git push` works next time. **If the remote has commits you do not, the push is rejected** as non-fast-forward." },
      data: "working tree   index          local repo     remote\n-------------  -------------  -------------  -------------\nmain.c         main.c         a1b2c3d        a1b2c3d ✓",
      vars: [ { n: "origin/main", v: "a1b2c3d", d: { th: "remote-tracking ref — สำเนาความรู้ว่า remote อยู่ตรงไหน", en: "a remote-tracking ref: our record of where the remote is" }, w: true } ] },

    { fn: "เพื่อนร่วมทีม push งานของเขา", file: "remote", depth: 0,
      note: { th: "remote ขยับไปข้างหน้าโดยที่เครื่องเราไม่รู้ — `origin/main` ในเครื่องเรายัง **ค้างอยู่ที่ค่าเก่า** จนกว่าจะ fetch. นี่คือสาเหตุที่ push ครั้งถัดไปของเราจะโดนปฏิเสธ",
              en: "The remote moves ahead without our machine knowing — our local `origin/main` **stays at the old value** until we fetch. This is why our next push gets rejected." },
      data: "working tree   index          local repo     remote\n-------------  -------------  -------------  -------------\nmain.c         main.c         a1b2c3d        a1b2c3d + f9e8d7c",
      vars: [ { n: "origin/main (ในเครื่อง)", v: "a1b2c3d", d: { th: "ล้าสมัยแล้ว — git ยังไม่รู้", en: "stale; git does not know yet" } } ] },

    { fn: "git pull --rebase", file: "remote -> local repo", depth: 0,
      note: { th: "`fetch` ดึง commit ใหม่ลงมาก่อน แล้ว `rebase` เอา commit ของเราไปวางต่อท้ายของเขา **hash ของเราจึงเปลี่ยน**. ถ้าใช้ `pull` เฉย ๆ จะได้ merge commit แทน ซึ่งบางทีก็ไม่ได้อยากได้ — ตั้ง `pull.ff only` หรือ `pull.rebase true` ครั้งเดียวแล้วจบ",
              en: "`fetch` brings the new commits down, then `rebase` replays ours on top of theirs — **so our hashes change.** A plain `pull` would create a merge commit instead, which is often not what you wanted; set `pull.ff only` or `pull.rebase true` once and be done." },
      data: "working tree   index          local repo               remote\n-------------  -------------  -----------------------  -------------\nmain.c         main.c         f9e8d7c + a1b2c3d'       a1b2c3d + f9e8d7c\n                              ^ commit ของเราถูกสร้างใหม่ (hash เปลี่ยน)",
      vars: [ { n: "a1b2c3d -> a1b2c3d'", d: { th: "commit เดิมยังอยู่ใน object store จนกว่า gc จะเก็บ — reflog พาไปหาได้", en: "the old commit stays in the object store until gc; the reflog can find it" }, w: true } ] },

    { fn: "git push", file: "local repo -> remote", depth: 0,
      note: { th: "คราวนี้ผ่าน เพราะประวัติของเรามี commit ของเขาอยู่ข้างล่างแล้ว (fast-forward ได้). **ไม่ต้องใช้ --force** — ถ้าต้องใช้ แปลว่าเราเขียนประวัติที่ push ไปแล้วทับ ซึ่งต้องใช้ `--force-with-lease` เท่านั้น",
              en: "This time it works, because our history now contains their commit underneath (a fast-forward). **No --force needed** — if you do need it, you are rewriting already-pushed history, and then only `--force-with-lease` is acceptable." },
      data: "working tree   index          local repo               remote\n-------------  -------------  -----------------------  -----------------------\nmain.c         main.c         f9e8d7c + a1b2c3d'       f9e8d7c + a1b2c3d' ✓",
      vars: [ { n: "origin/main", v: "a1b2c3d'", d: { th: "ทุกช่องตรงกันหมดแล้ว", en: "every column now agrees" }, w: true } ] }
  ]
};
