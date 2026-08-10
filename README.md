# สื่อการสอน 42 · 42 Study Guide

สื่อการสอนสำหรับ 42 School Common Core (C/C++, เครือข่าย, system admin), สาย AI Engineer และสื่อติวสอบ Exam Rank 02–06

**เปิดอ่าน → [jotaro365.github.io/42-study-guide](https://jotaro365.github.io/42-study-guide/)**

- **51 หน้า** · **ไทย/อังกฤษครบทุกหน้า** — กดสลับ TH/EN มุมขวาบน
- ไม่มี build step — React 18 แบบ vanilla JS เปิดไฟล์ `index.html` ในเครื่องก็อ่านได้เลย
- เดโมกดเล่นได้ + flow visualizer ไล่โค้ดทีละ step (37 หน้า)
- ค้นหาเต็มข้อความทั้งเว็บจากหน้าแรก — กด `/` เพื่อโฟกัสช่องค้น

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
| [Born2beRoot](https://jotaro365.github.io/42-study-guide/born2beroot.html) | ติดตั้ง VM ทีละหน้าจอ (VirtualBox + Debian installer + แบ่ง LUKS/LVM), อธิบายทุกคำสั่งทีละธง, LUKS ใต้ LVM, SSH 4242 ห้าม root, UFW, PAM/pwquality, sudoers ที่บันทึก I/O, monitoring.sh ประกอบทีละบรรทัด + cron, ชุดคำสั่งที่ผู้ตรวจพิมพ์จริง | 10 |
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

## Machine Learning & Deep Learning

ตั้งแต่คณิตศาสตร์พื้นฐานถึงสถาปัตยกรรมสมัยใหม่ — ทุกสมการอนุมานให้เห็นที่มา ไม่ใช่ยกมาท่อง

| หน้า | เนื้อหา | เจาะลึก |
|------|---------|:------:|
| [คณิตศาสตร์ของ ML](https://jotaro365.github.io/42-study-guide/ml_math.html) | พีชคณิตเชิงเส้น (รูปร่าง, dot product, broadcasting, eigen/SVD), แคลคูลัส (chain rule, อนุมาน backprop ทั้งขาไป-ขากลับด้วยตัวเลขจริง), ความน่าจะเป็น (อนุมาน MSE กับ cross-entropy จาก maximum likelihood), ทฤษฎีสารสนเทศ (entropy, KL) + MLP ใน NumPy ล้วน + gradient check | 10 |
| [พื้นฐาน ML](https://jotaro365.github.io/42-study-guide/ml_basics.html) | แบ่งข้อมูลไม่ให้โกงตัวเอง (time series, จัดกลุ่ม, stratified), bias-variance อ่านจากช่องว่าง train/val, metric ทุกตัวและจุดที่มันโกหก, ROC-AUC เทียบ PR-AUC, calibration, ตาราง leakage 6 รูปแบบ + เดินงาน churn ครบ 8 ขั้น | 9 |
| [Linear & Logistic Regression](https://jotaro365.github.io/42-study-guide/ml_linear.html) | อนุมาน MSE กับ log loss จาก maximum likelihood, normal equation และเหตุผลที่มันพัง, condition number/VIF, ทำไม logistic ไม่มีสูตรปิด, odds ratio, perfect separation, เขียนทั้งสองตัวจากศูนย์ด้วย NumPy | 10 |
| [โมเดลคลาสสิก](https://jotaro365.github.io/42-study-guide/ml_classic.html) | สร้างต้นไม้ด้วยมือจาก gini กับ information gain, bagging เทียบ boosting และเหตุผลที่ป่าใช้ต้นไม้ลึกแต่ boosting ใช้ต้นตื้น, margin กับ kernel trick, PCA และ k-means, feature importance ที่เชื่อได้ | 11 |
| [Neural Network](https://jotaro365.github.io/42-study-guide/ml_nn.html) | ทำไมขาด activation แล้วความลึกหายทั้งหมด, ตารางเทียบ activation กับปัญหาที่แต่ละตัวแก้, backpropagation เดินมือครบทั้ง forward และ backward จนได้น้ำหนักใหม่, He เทียบ Xavier, vanishing gradient เป็นผลคูณ, เขียนเครือข่ายจากศูนย์ด้วย NumPy พร้อม gradient check | 12 |
| [การเทรน Deep Network](https://jotaro365.github.io/42-study-guide/ml_train.html) | optimizer แต่ละตัวแก้ความล้มเหลวของตัวก่อนหน้า, เดินตัวเลขจน learning rate ระเบิดให้เห็น, AdamW ไม่ใช่ Adam ที่ใส่ L2, warmup มีไว้ทำไม, กฎสเกลเชิงเส้น, batch norm เทียบ layer norm, LR range test, AMP กับ gradient accumulation | 13 |
| [CNN](https://jotaro365.github.io/42-study-guide/ml_cnn.html) | สมมติฐานสองข้อที่ทำให้ weight sharing ถูกต้อง, สูตรขนาด output, ทำมือด้วย Sobel จนเห็นขอบทั้งสองด้าน, ทำไม 3×3 สองชั้นชนะ 5×5, residual connection กับ `+1` ในอนุพันธ์, depthwise separable, ลำดับ fine-tune และ normalization ที่ต้องตรงกับ checkpoint | 14 |
| [Sequence & Attention](https://jotaro365.github.io/42-study-guide/ml_seq.html) | ทำไม gradient ของ RNN พังเป็น λᵀ, LSTM แก้ด้วยเส้นทางบวกของ cell state, `∂C_t/∂C_{t−1} = f_t`, คอขวดของ seq2seq, คำนวณ attention ด้วยมือครบทุกขั้น, ทำไมต้องหารด้วย √d_k พร้อมตัวเลข, teacher forcing กับ exposure bias, beam search | 15 |
| [Transformer](https://jotaro365.github.io/42-study-guide/ml_tf.html) | สิ่งที่เพิ่มคือการเอา recurrence ออก, multi-head แบ่งไม่ใช่เพิ่ม, ทำไมสถาปัตยกรรมนี้ไม่รู้จักลำดับ, causal mask พร้อม softmax ทีละแถว, FFN กินสองในสามของพารามิเตอร์, นับ GPT-2 ครบ 124,439,808, KV cache เป็น MB, LoRA | 16 |

> กำลังทยอยเพิ่ม: ML พื้นฐาน · linear/logistic regression · โมเดลคลาสสิก · neural network · การเทรน · CNN · sequence · transformer · การนำไปใช้จริง

---

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
| NetPractice | **เกม 10 ด่าน จับเวลา** — หน้าต่างเกมมีกรอบครบสี่ด้าน กระดานทั้งอันวาดบน canvas คลิกช่องแล้วพิมพ์ได้เลย (`Tab` ไปช่องถัดไป) กด "ตรวจ" แล้วเอนจินเดินเส้นทางขาไป-ขากลับทีละ hop พร้อมข้อความ error ชุดเดียวกับ `sim.js` ตัวจริง · ลากมุมย่อ-ขยายหน้าต่าง หรือกดเต็มจอ · หมดเวลาเปิดเฉลยให้ |

**อ่านเพิ่ม**: ทุกหน้ามีรายการอ้างอิง (man page, cppreference, RFC, เอกสารทางการ) อยู่ท้ายแท็บสุดท้ายของหน้านั้นเสมอ

**Flow visualizer** (ไล่ execution ทีละ step พร้อมค่าตัวแปรทุกจังหวะ) — 37 หน้า:

- **C / เครือข่าย / system:** libft (**หนึ่ง visualizer ต่อหนึ่งฟังก์ชัน ครบ 43 ตัว เลือกจากแถบด้านบน**) · ft_printf · get_next_line · Born2beRoot · push_swap · pipex · so_long · fract-ol · minitalk · fdf · philosophers · minishell · miniRT · cub3D · NetPractice · webserv · ft_irc · Inception
- **C++:** CPP Module 00-09 ครบทุกโมดูล
- **AI:** ทั้ง 9 หน้า (foundations, LLM & API, vector, RAG, agents, harness, loop engineering, fine-tuning, output control)

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
data.ai.js            # สาย AI Engineer 7 หน้าแรก
data.finetune.js      # Fine-tuning         (ไทย + อังกฤษในไฟล์เดียว)
data.outputctl.js     # Output Control      (ไทย + อังกฤษ)
data.born2beroot.js   # Born2beRoot         (ไทย + อังกฤษ + flow)
data.netpractice.js   # NetPractice         (ไทย + อังกฤษ + flow)
data.webserv.js       # webserv             (ไทย + อังกฤษ + flow)
data.ftirc.js         # ft_irc              (ไทย + อังกฤษ + flow)
data.inception.js     # Inception           (ไทย + อังกฤษ + flow)
data.exam.js          # Exam Rank 02–06
data.en.js            # คำแปลอังกฤษของหน้ารุ่นเก่า
data.flows.js         # flow ของ miniRT, cub3D, Fine-tuning, Output Control
data.flows2.js        # flow ของ libft, ft_printf, GNL, CPP 01–09
data.refs.js          # บล็อก "อ่านเพิ่ม" ท้ายแท็บสุดท้ายของหน้า C/C++
```

ลำดับ `<script>` ใน `.html` สำคัญ 2 ข้อ:

- `data.*.js` ต้องโหลดก่อน `app.js` เสมอ
- `data.en.js` ตั้ง `window.TEACHING_EN = { ... }` ทับทั้งก้อน ไฟล์ที่เขียนคำแปลไว้ในตัวเอง (`data.netpractice.js` ฯลฯ) จึงต้องโหลด **หลัง** มัน

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
