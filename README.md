# สื่อการสอน 42 · 42 Study Guide

สื่อการสอนสำหรับ 42 School Common Core (C/C++, เครือข่าย, system admin), สาย AI Engineer และสื่อติวสอบ Exam Rank 02–06

**เปิดอ่าน → [jotaro365.github.io/42-study-guide](https://jotaro365.github.io/42-study-guide/)**

- **41 หน้า** · **ไทย/อังกฤษครบทุกหน้า** — กดสลับ TH/EN มุมขวาบน
- ไม่มี build step — React 18 แบบ vanilla JS เปิดไฟล์ `index.html` ในเครื่องก็อ่านได้เลย
- เดโมกดเล่นได้ + flow visualizer ไล่โค้ดทีละ step

> ลิงก์ในตารางข้างล่างชี้ไปที่เว็บที่ deploy แล้ว กดจากหน้านี้ได้เลย
> (ลิงก์แบบ relative ใช้ไม่ได้บน GitHub เพราะ GitHub จะเปิดเป็น source ไม่ใช่หน้าเว็บ)

---

## แต่ละหน้ามีอะไร

8 แท็บเรียงจากทฤษฎีไปหาการลงมือทำ:

**หลักการ** → **ทฤษฎีที่ต้องรู้** → **Struct · Pointer · Memory** → **โครงสร้างโค้ด** → **ทุกฟังก์ชัน · การไหล** → **การ implement** → **ทริคเด็ด** → **คำถาม Evaluation**

ส่วน "เจาะลึก" (🔬) ในแต่ละหน้าใช้โครงเดียวกันทุกหัวข้อ:

> intuition → กลไก → บทพิสูจน์ → ลองทำเอง → กับดักที่พบบ่อย → เช็กความเข้าใจ (Q&A)

---

## 42 Common Core — C

| หน้า | เนื้อหา | เจาะลึก |
|------|---------|:------:|
| [libft](https://jotaro365.github.io/42-study-guide/libft.html) | กล่องเครื่องมือ 46 ฟังก์ชัน: ความเป็นเจ้าของ pointer, memmove ซ้อนทับ, ค่าคืนของ strlcpy/strlcat, calloc overflow, ft_split, t_list, libft.a ลิงก์ยังไง | 9 |
| [ft_printf](https://jotaro365.github.io/42-study-guide/ft_printf.html) | variadic: กลไก va_list, default argument promotion, ทำไมต้องส่ง va_list เป็น pointer, แปลงฐานแบบ recursive, นับค่าคืนให้เป๊ะ | 6 |
| [get_next_line](https://jotaro365.github.io/42-study-guide/get_next_line.html) | static storage, stash ที่เหลือค้าง, read คืนได้ 3 แบบ, node ต่อ fd, BUFFER_SIZE จากภายนอก | 6 |
| [push_swap](https://jotaro365.github.io/42-study-guide/push_swap.html) | Turkish sort, พิสูจน์ Big-O, ขอบล่างของ decision tree, two's complement, การคิด cost | 7 |
| [pipex](https://jotaro365.github.io/42-study-guide/pipex.html) | fork/pipe/dup2/execve, ไล่ตาราง fd, pipe reference counting, exec เปลี่ยน memory ยังไง | 4 |
| [so_long](https://jotaro365.github.io/42-study-guide/so_long.html) | flood fill, ความซับซ้อน DFS/BFS, ที่มาสูตร camera, FSM แบบเป็นทางการ | 4 |
| [fract-ol](https://jotaro365.github.io/42-study-guide/fractol.html) | พิสูจน์การคูณจำนวนเชิงซ้อน, ทฤษฎีบทรัศมีหนี, IEEE 754, แมพพิกเซล ↔ ระนาบเชิงซ้อน | 4 |
| [minitalk](https://jotaro365.github.io/42-study-guide/minitalk.html) | signal handling, พิสูจน์ bitwise, async-signal-safety, UTF-8 | 4 |
| [FdF](https://jotaro365.github.io/42-study-guide/fdf.html) | isometric projection, Bresenham, ที่มาของการจัดกึ่งกลาง, color lerp | 4 |
| [philosophers](https://jotaro365.github.io/42-study-guide/philosophers.html) | dining philosophers, deadlock (เงื่อนไข Coffman), mutex, precise_sleep | 4 |
| [minishell](https://jotaro365.github.io/42-study-guide/minishell.html) | สถาปัตยกรรม shell, lexer/parser, pipe EOF, signal | 4 |
| [miniRT](https://jotaro365.github.io/42-study-guide/minirt.html) | ray tracer: สมการกำลังสอง ray-sphere, Phong, shadow acne, camera basis, parse .rt | 4 |
| [cub3D](https://jotaro365.github.io/42-study-guide/cub3d.html) | raycasting FPS: camera plane, DDA, แก้ fisheye, texture mapping, ตรวจแผนที่ปิด | 4 |
| [NetPractice](https://jotaro365.github.io/42-study-guide/netpractice.html) | subnetting + routing: netmask/CIDR, network vs broadcast, ขาของ router ห้ามซ้อน, first-match-wins, ขาไป-ขากลับ, กฎของ Internet node | 6 |
| [webserv](https://jotaro365.github.io/42-study-guide/webserv.html) | HTTP/1.1 บน poll() ตัวเดียว: framing กับ chunked, state machine ที่หยุดตรง header, CGI สองท่อ, back-pressure, spool body ลงดิสก์ | 6 |
| [ft_irc](https://jotaro365.github.io/42-study-guide/ft_irc.html) | IRC server C++98: partial read/send, POLLOUT ที่ต้องไม่ค้าง, ลบ client กลาง broadcast, casemapping RFC 1459, CAP/PING/005 ที่ทำให้ irssi ใช้ได้ | 6 |
| [Inception](https://jotaro365.github.io/42-study-guide/inception.html) | docker-compose 3 image เขียนเอง: PID 1 กับ exec, named volume, secrets, php-fpm/FastCGI, TLS — และ 7 กับดักที่ไม่มีใน subject | 7 |

## CPP Modules

| หน้า | เนื้อหา | เจาะลึก |
|------|---------|:------:|
| [Module 00](https://jotaro365.github.io/42-study-guide/cpp_module_00.html) | ข้ามจาก C มา C++, class/object, encapsulation, static member, this | 4 |
| [Module 01](https://jotaro365.github.io/42-study-guide/cpp_module_01.html) | stack vs heap, new/delete, reference vs pointer, pointer-to-member, file stream | 4 |
| [Module 02](https://jotaro365.github.io/42-study-guide/cpp_module_02.html) | Orthodox Canonical Form, operator overloading, fixed-point, BSP cross-product | 4 |
| [Module 03](https://jotaro365.github.io/42-study-guide/cpp_module_03.html) | inheritance chaining, ลำดับ ctor/dtor, unsigned underflow, diamond problem | 3 |
| [Module 04](https://jotaro365.github.io/42-study-guide/cpp_module_04.html) | polymorphism, virtual destructor, deep copy, abstract class, interface | 4 |
| [Module 05](https://jotaro365.github.io/42-study-guide/cpp_module_05.html) | throw จาก constructor, const member ปะทะ OCF, template method, table dispatch | 4 |
| [Module 06](https://jotaro365.github.io/42-study-guide/cpp_module_06.html) | static_cast / reinterpret_cast / dynamic_cast, ตรวจชนิด literal, RTTI, NaN | 5 |
| [Module 07](https://jotaro365.github.io/42-study-guide/cpp_module_07.html) | function & class template, ทำไมต้องอยู่ใน header, Array&lt;T&gt; + bounds exception | 5 |
| [Module 08](https://jotaro365.github.io/42-study-guide/cpp_module_08.html) | STL container/iterator/algorithm, dependent name (typename, this->), span O(n log n) | 5 |
| [Module 09](https://jotaro365.github.io/42-study-guide/cpp_module_09.html) | std::map + lower_bound, RPN ด้วย std::stack, Ford-Johnson + จับเวลา | 4 |

## AI Engineer

| หน้า | เนื้อหา | เจาะลึก |
|------|---------|:------:|
| [AI Foundations](https://jotaro365.github.io/42-study-guide/ai_foundations.html) | LLM คืออะไร, token, temperature, hallucination, autoregressive decoding, BPE | 3 |
| [LLM & API](https://jotaro365.github.io/42-study-guide/ai_llm.html) | structured output, context window, prompt caching, เลือกโมเดล, streaming, multimodal | 3 |
| [Embeddings & Vector DB](https://jotaro365.github.io/42-study-guide/ai_vector.html) | embedding, cosine similarity, ANN, pgvector, HNSW, quantization | 3 |
| [RAG](https://jotaro365.github.io/42-study-guide/ai_rag.html) | chunking, retrieve-augment-generate, hybrid search, Recall@k, reranking | 3 |
| [Agents & LangGraph](https://jotaro365.github.io/42-study-guide/ai_agents.html) | StateGraph, node/edge, conditional routing, ReAct, graceful degradation | 3 |
| [Harness](https://jotaro365.github.io/42-study-guide/ai_harness.html) | guardrail, tool calling, ออกแบบ system prompt, คุมต้นทุน, eval, MCP | 3 |
| [Loop Engineering](https://jotaro365.github.io/42-study-guide/ai_loop_engineering.html) | agent ที่วน reason → act → ตรวจเอง: goal+gate, เพดานรอบ, false-pass, no-progress detector | 4 |
| [Fine-tuning](https://jotaro365.github.io/42-study-guide/ai_finetune.html) | บันได prompt → RAG → SFT/LoRA → DPO, LoRA ทำงานยังไง, เตรียมข้อมูล, catastrophic forgetting, จุดคุ้มทุน | 4 |
| [Output Control](https://jotaro365.github.io/42-study-guide/ai_output_control.html) | บังคับรูปแบบผลลัพธ์: structured output, prefill, stop sequence, tool_choice, temperature เทียบ top_p, retry-and-repair | 4 |

## Exam Rank 02–06

สื่อติวสอบ on-site ของ Common Core อิงจาก [42_examshell](https://github.com/terminal-42s/42_examshell) (pool โจทย์จริง + เฉลย)
แต่ละ rank เรียง: กติกาสอบ → pool โจทย์ทั้งหมด → pattern ที่ใช้ซ้ำ → เจาะลึกข้อสำคัญ → กลยุทธ์ & เวลา → เช็กความพร้อม

| Rank | เนื้อหา | เจาะลึก |
|------|---------|:------:|
| [Rank 02](https://jotaro365.github.io/42-study-guide/exam_rank02.html) | string/list/recursion/bitwise — ft_split, ft_itoa (INT_MIN), flood_fill, sort_list, atoi_base | 7 |
| [Rank 03](https://jotaro365.github.io/42-study-guide/exam_rank03.html) | ซ่อม get_next_line + backtracking (n_queens, permutations, powerset, rip) | 5 |
| [Rank 04](https://jotaro365.github.io/42-study-guide/exam_rank04.html) | fork/pipe (ft_popen, picoshell, sandbox) + recursive-descent parser (vbc, argo) | 5 |
| [Rank 05](https://jotaro365.github.io/42-study-guide/exam_rank05.html) | C++ OCF/operator (vect2, bigint, polyset) + DP/simulation (bsq, life) | 5 |
| [Rank 06](https://jotaro365.github.io/42-study-guide/exam_rank06.html) | select() server — mini_serv (แชท), mini_db (key-value) | 3 |

กฎ 2 ข้อที่คนพลาดบ่อย:

- **ไม่ตรวจ norm** — ตรวจแค่คอมไพล์ผ่าน (`-Wall -Wextra -Werror`) + output ตรงเท่านั้น
- **ตกคือจบ ไม่มี retry** — กด `grademe` แล้วไม่ผ่าน = จบทันที ได้คะแนนเท่าระดับที่ผ่านมาแล้ว

---

## เดโมกดเล่นได้

| หน้า | เล่นอะไรได้ |
|------|-------------|
| push_swap | stack playground กด op เองได้ + auto-sort ด้วย Turkish sort ตัวจริง + benchmark 100/500 ตัว |
| fract-ol | Mandelbrot/Julia บน canvas, คลิกเพื่อซูม, สไลเดอร์ iteration |
| so_long | เกมเล่นได้จริง (WASD/ลูกศร) เก็บเหรียญครบแล้วไปประตู |
| pipex | ไดอะแกรมไล่ทีละ step: infile → pipe → outfile |
| NetPractice | **simulator 10 ด่าน จับเวลา** — กระดานวาดสายด้วย canvas เติม IP/mask/route แล้วกดตรวจ ระบบเดินเส้นทางขาไปและขากลับให้ดูทีละ hop พร้อมข้อความ error แบบเดียวกับ `sim.js` หมดเวลาแล้วเปิดเฉลยให้ |

**Flow visualizer** (ไล่ execution ทีละ step พร้อมค่าตัวแปรทุกจังหวะ): push_swap, pipex, so_long, fract-ol, minitalk, fdf, philosophers

---

## เปิดในเครื่อง

```sh
git clone https://github.com/JOTARO365/42-study-guide.git
cd 42-study-guide
# เปิด index.html ด้วยเบราว์เซอร์ได้เลย ไม่ต้อง build ไม่ต้องลง dependency
```

<details>
<summary><b>โครงสร้างไฟล์</b></summary>

```
index.html            # หน้ารวมลิงก์
<project>.html        # 1 หน้า = 1 ไฟล์ ทำหน้าที่แค่ตั้ง window.PROJECT_ID
app.js                # React UI + เดโม + flow visualizer
style.css             # dark theme สไตล์ 42

data.js               # 42 Common Core (ไทย)
data.libft.js         # libft
data.printf.js        # ft_printf
data.gnl.js           # get_next_line
data.cpp.js           # CPP Module 00–09
data.ai.js            # สาย AI Engineer
data.exam.js          # Exam Rank 02–06
data.en.js            # คำแปลอังกฤษของทุกหน้า
```

ลำดับ `<script>` ใน `.html` สำคัญ: ไฟล์ `data.*.js` ต้องโหลดก่อน `app.js` เสมอ

</details>

<details>
<summary><b>เพิ่มหน้าใหม่</b></summary>

1. `push` (หรือ `unshift` ถ้าอยากให้อยู่ต้นหน้าแรก) object เข้า `window.TEACHING_DATA`:

```js
window.TEACHING_DATA.push({
  id: "my_project",
  name: "ชื่อไทย",
  nameEn: "English name",          // ถ้าชื่อไทย ต้องมีอันนี้ ไม่งั้นกด EN แล้วค้างไทย
  tag: { th: "คำโปรย", en: "tagline" },
  accent: "#34d399",
  sections: { principle: [ /* blocks */ ], /* ... */ }
});
```

2. ก๊อป `.html` หน้าไหนก็ได้ แก้ `window.PROJECT_ID` กับ `<script src="data.*.js">` ให้ตรง
3. คำแปลอังกฤษใส่ที่ `window.TEACHING_EN["my_project"]` แยกราย section — section ไหนไม่ใส่ จะ fallback เป็นไทยเอง

**บล็อกที่ใช้ได้:** `{h}` หัวข้อ · `{p}` ย่อหน้า · `{ul:[]}` bullet · `{code, cap, lang}` โค้ด · `{table:{head,rows}}` · `{qa:[{q,a}]}` · `{note}` กล่องเน้น · `{links:[{label,url,note}]}`

ในข้อความใช้ `**ตัวหนา**` กับ `` `โค้ด` `` ได้ ข้อควรระวัง 2 ข้อ: `{note}` ห้ามใส่ `lang` และห้ามมี backtick ในโค้ดบล็อกที่เขียนด้วย `String.raw`

</details>

---

## Tech stack

React 18 (vanilla JS ไม่มี JSX/Babel เลยเปิดแบบ `file://` ได้) · ไม่มี build step · ไม่มี dependency · dark theme · รองรับมือถือ
