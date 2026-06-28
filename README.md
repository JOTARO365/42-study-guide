# สื่อการสอน 42 — Teaching Materials

> สื่อการสอนสำหรับ 42 School C projects + AI Engineer track + สื่อติวสอบ Exam Rank 02–06
> สร้างด้วย React 18 (vanilla JS) เปิดแบบ `file://` ได้เลย
> **20 หน้าเนื้อหา · bilingual ไทย/อังกฤษ ครบทุกหน้า · กดสลับ TH/EN มุมขวาบน**

ทุก deep dive ใช้โครง **intuition → กลไก → บทพิสูจน์ → ลองทำเอง → กับดักที่พบบ่อย → เช็กความเข้าใจ (Q&A)**

## Live Demo

**[https://jotaro365.github.io/42-study-guide/](https://jotaro365.github.io/42-study-guide/)**

หรือเปิด `index.html` ในเครื่อง (ไม่ต้อง build)

---

## 42 School Projects (C)

| โปรเจกต์ | ลิงก์ | เนื้อหา |
|----------|-------|---------|
| **push_swap** | [push_swap.html](push_swap.html) | Turkish sort, Big-O proof, decision tree lower bound, two's complement, cost calculation |
| **pipex** | [pipex.html](pipex.html) | fork/pipe/dup2/execve, fd table trace, pipe reference counting, exec memory layout |
| **so_long** | [so_long.html](so_long.html) | Flood fill, DFS/BFS complexity, camera formula derivation, formal FSM |
| **fractol** | [fractol.html](fractol.html) | Complex multiplication proof, escape radius theorem, IEEE 754, pixel mapping |
| **minitalk** | [minitalk.html](minitalk.html) | Signal handling, bitwise operations proof, async-signal-safety, UTF-8 encoding |
| **fdf** | [fdf.html](fdf.html) | Isometric projection, Bresenham's line, centering derivation, color lerp |
| **philosophers** | [philosophers.html](philosophers.html) | Dining philosophers, deadlock (Coffman conditions), mutex, precise_sleep |
| **CPP Module 00** | [cpp_module_00.html](cpp_module_00.html) | C→C++ transition, class/object, encapsulation, static members, this pointer |
| **minishell** | [minishell.html](minishell.html) | Shell architecture, lexer/parser pipeline, pipe EOF, signal handling |
| **miniRT** | [minirt.html](minirt.html) | Ray tracer: ray-sphere quadratic, Phong lighting, shadows (acne), camera basis, .rt parsing |

## AI Engineer Track

| โมดูล | ลิงก์ | เนื้อหา |
|-------|-------|---------|
| **AI Foundations** | [ai_foundations.html](ai_foundations.html) | LLM basics, tokens, temperature, hallucination, multi-step architecture |
| **LLM & API** | [ai_llm.html](ai_llm.html) | Structured output, context window, prompt caching, model routing, streaming, multimodal |
| **Embeddings & Vector DB** | [ai_vector.html](ai_vector.html) | Embeddings, cosine similarity, ANN, pgvector, HNSW indexes |
| **RAG** | [ai_rag.html](ai_rag.html) | Chunking, retrieve-augment-generate, hybrid search, Recall@k, reranking |
| **Agents & LangGraph** | [ai_agents.html](ai_agents.html) | StateGraph, nodes/edges, conditional routing, graceful degradation |
| **Harness** | [ai_harness.html](ai_harness.html) | Guardrails, tool calling, system prompt design, cost metering, eval, MCP |

## Exam Prep (Exam Rank 02–06)

สื่อติวสอบ on-site ของ Common Core — อิงจาก [42_examshell](https://github.com/terminal-42s/42_examshell) (pool โจทย์จริง + เฉลย). แต่ละ rank: กติกาสอบ → pool โจทย์ทั้งหมด → pattern ที่ใช้ซ้ำ → เจาะลึกข้อสำคัญ → กลยุทธ์ → เช็กความพร้อม

| Rank | ลิงก์ | เนื้อหา |
|------|-------|---------|
| **Exam Rank 02** | [exam_rank02.html](exam_rank02.html) | string/list/recursion/bitwise — ft_split, ft_itoa (INT_MIN), flood_fill, sort_list, atoi_base |
| **Exam Rank 03** | [exam_rank03.html](exam_rank03.html) | get_next_line repair + backtracking (n_queens, permutations, powerset, rip) |
| **Exam Rank 04** | [exam_rank04.html](exam_rank04.html) | fork/pipe (ft_popen, picoshell, sandbox) + recursive-descent parser (vbc, argo) |
| **Exam Rank 05** | [exam_rank05.html](exam_rank05.html) | C++ OCF/operators (vect2, bigint, polyset) + DP/sim (bsq, life) |
| **Exam Rank 06** | [exam_rank06.html](exam_rank06.html) | select() servers — mini_serv (chat), mini_db (key-value) |

> ตรวจ norm? **ไม่** — exam ตรวจแค่ compile (-Wall -Wextra -Werror) + output ตรง เท่านั้น

## Interactive Demos

- **push_swap** — Stack playground (กด ops ได้จริง) + auto-sort (Turkish sort ตัวจริง) + benchmark 100/500 ตัว
- **fractol** — Canvas Mandelbrot/Julia, คลิก zoom, iteration slider
- **so_long** — เกมเล่นได้จริง (WASD/ลูกศร) เก็บเหรียญแล้วไปประตู
- **pipex** — Step-through diagram แสดง flow infile → pipe → outfile

## Flow Visualizers

ทุก project มี execution trace ไล่ input วิ่งผ่านฟังก์ชันไหนบ้าง พร้อม variables + data ทุก step:
push_swap, pipex, so_long, fractol, minitalk, fdf, philosophers

## Deep Dives (C projects)

| Project | จำนวน | หัวข้อ |
|---------|:-----:|--------|
| push_swap | **7** | Big-O formal def, comparison sort lower bound, two's complement, cost calculation, normalization proof, greedy optimality, scoring thresholds analysis |
| pipex | 4 | fork returns twice, fd table trace, pipe reference counting, exec memory layout |
| so_long | 4 | DFS/BFS O(V+E), recursion & stack overflow, camera formula, formal FSM |
| fractol | 4 | Complex multiplication, escape radius proof, IEEE 754, pixel↔complex mapping |
| minitalk | 4 | Signal non-queuing, bitwise operations proof, async-signal-safety, UTF-8 encoding |
| fdf | **4** | Isometric formula derivation, Bresenham proof + trace, color lerp (channel split), auto-fit (centering+zoom+z_scale) |
| philosophers | **4** | Deadlock & Coffman + RAG-graph proof, data race & atomicity, mutex vs semaphore (mandatory/bonus), usleep precision & detection latency |
| cpp_module_00 | **4** | Static members & lifecycle, constructor/destructor order, const-correctness, this pointer |
| minishell | **4** | Lexer as a state machine + quotes, fd inheritance + dup2/close pipeline, pipe EOF reference counting, signals (interactive/heredoc) + $? propagation |
| miniRT | **4** | Ray-sphere intersection (quadratic + discriminant), Phong lighting + normal flip, shadows & shadow acne (epsilon), camera & ray generation (basis + FOV/aspect) |

## AI Engineer Deep Dives

| Module | จำนวน | หัวข้อ |
|--------|:-----:|--------|
| **ai_foundations** | **3** | Autoregressive decoding, BPE tokenizer internals, Context window + lost-in-the-middle |
| **ai_llm** | **3** | Structured output (constrained decoding), Prompt caching mechanics & cost math, Tool/function calling (the tool_use/tool_result cycle) |
| **ai_vector** | **3** | Cosine similarity proof, HNSW walkthrough, Dimensions & quantization (Matryoshka, int8/binary + rescoring) |
| **ai_rag** | **3** | Chunking strategies, BM25 vs Vector vs Hybrid, RAG evaluation (retrieval vs generation metrics + golden set) |
| **ai_agents** | **3** | ReAct loop, Graph topology (DAG/Cyclic/Network), Loop termination & error recovery (the 4-layer brakes) |
| **ai_harness** | **3** | Prompt injection taxonomy & defense, Cost optimization math (cache break-even), LLM-as-judge (pairwise vs pointwise, biases, calibration) |

## Tech Stack

- React 18 (vanilla JS, no JSX/Babel — opens as `file://`)
- **Bilingual ไทย/อังกฤษ ครบทั้ง 15 หน้าเนื้อหา** (9 C + 6 AI · ครบ 8 section/หน้า) — toggle มุมขวาบน
- Dark theme สไตล์ 42 (ดำสนิท, teal accent)
- Responsive (mobile-friendly)
- No build step required

## File Structure

```
_teaching/
  index.html          # หน้ารวมลิงก์
  push_swap.html      # หน้าโปรเจกต์ (set window.PROJECT_ID)
  pipex.html
  so_long.html
  fractol.html
  minitalk.html
  fdf.html
  philosophers.html
  cpp_module_00.html
  minishell.html
  ai_foundations.html
  ai_llm.html
  ai_vector.html
  ai_rag.html
  ai_agents.html
  ai_harness.html
  exam_rank02.html … exam_rank06.html   # สื่อติวสอบ Exam Rank
  app.js              # React UI + interactive demos + flow visualizer
  data.js             # เนื้อหาหลัก (ภาษาไทย) — 9 โปรเจกต์ 42
  data.en.js          # แปลภาษาอังกฤษ — ครบทั้ง 15 หน้า
  data.ai.js          # เนื้อหาสาย AI Engineer — 6 โมดูล
  data.exam.js        # สื่อติวสอบ Exam Rank 02–06
  style.css           # Dark theme
```
 
 