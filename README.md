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
| **libft** | [libft.html](libft.html) | The 46-function C toolbox: pointer ownership, memmove overlap, strlcpy/strlcat return values, calloc overflow, ft_split, t_list, how libft.a links |
| **ft_printf** | [ft_printf.html](ft_printf.html) | Variadic functions: va_list mechanics, default argument promotion, passing va_list by pointer, recursive base conversion, exact return count |
| **get_next_line** | [get_next_line.html](get_next_line.html) | static storage, the leftover stash, read's three return cases, per-fd node list, compile-time BUFFER_SIZE |
| **push_swap** | [push_swap.html](push_swap.html) | Turkish sort, Big-O proof, decision tree lower bound, two's complement, cost calculation |
| **pipex** | [pipex.html](pipex.html) | fork/pipe/dup2/execve, fd table trace, pipe reference counting, exec memory layout |
| **so_long** | [so_long.html](so_long.html) | Flood fill, DFS/BFS complexity, camera formula derivation, formal FSM |
| **fractol** | [fractol.html](fractol.html) | Complex multiplication proof, escape radius theorem, IEEE 754, pixel mapping |
| **minitalk** | [minitalk.html](minitalk.html) | Signal handling, bitwise operations proof, async-signal-safety, UTF-8 encoding |
| **fdf** | [fdf.html](fdf.html) | Isometric projection, Bresenham's line, centering derivation, color lerp |
| **philosophers** | [philosophers.html](philosophers.html) | Dining philosophers, deadlock (Coffman conditions), mutex, precise_sleep |
| **CPP Module 00** | [cpp_module_00.html](cpp_module_00.html) | C→C++ transition, class/object, encapsulation, static members, this pointer |
| **CPP Module 01** | [cpp_module_01.html](cpp_module_01.html) | Stack vs heap, new/delete, references vs pointers, pointer-to-member, C++ file streams |
| **CPP Module 02** | [cpp_module_02.html](cpp_module_02.html) | Orthodox Canonical Form, operator overloading, fixed-point arithmetic, BSP cross-product |
| **CPP Module 03** | [cpp_module_03.html](cpp_module_03.html) | Inheritance chaining, ctor/dtor order, unsigned underflow, diamond problem, virtual inheritance |
| **CPP Module 04** | [cpp_module_04.html](cpp_module_04.html) | Polymorphism, virtual destructor, deep copy, abstract classes, interfaces + pointer ownership |
| **CPP Module 05** | [cpp_module_05.html](cpp_module_05.html) | Exceptions from constructors, const members vs OCF, template method, table dispatch |
| **CPP Module 06** | [cpp_module_06.html](cpp_module_06.html) | static_cast / reinterpret_cast / dynamic_cast, literal detection, RTTI, IEEE 754 NaN |
| **CPP Module 07** | [cpp_module_07.html](cpp_module_07.html) | Function & class templates, header-only linkage, Array<T> with deep copy + bounds exception |
| **CPP Module 08** | [cpp_module_08.html](cpp_module_08.html) | STL containers/iterators/algorithms, dependent names (typename, this->), O(n log n) span |
| **CPP Module 09** | [cpp_module_09.html](cpp_module_09.html) | std::map + lower_bound, RPN with std::stack, Ford-Johnson merge-insert + timing |
| **minishell** | [minishell.html](minishell.html) | Shell architecture, lexer/parser pipeline, pipe EOF, signal handling |
| **miniRT** | [minirt.html](minirt.html) | Ray tracer: ray-sphere quadratic, Phong lighting, shadows (acne), camera basis, .rt parsing |
| **cub3D** | [cub3d.html](cub3d.html) | Raycasting FPS: camera plane, DDA grid traversal, fisheye correction, texture mapping, .cub parsing + closed-map validation |

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
| libft | **9** | memcpy vs memmove, strlcpy/strlcat return semantics, calloc overflow, itoa & INT_MIN, atoi parsing rules, ft_split count-then-fill, t_list del vs free, function-pointer parameters, how libft.a is linked |
| ft_printf | **6** | How va_list works, default argument promotion, why va_list is passed by pointer, recursive base conversion, return-count discipline, write() without buffering |
| get_next_line | **6** | static storage duration, read's three return cases, the stash cycle, per-fd node list, cleanup without a close function, BUFFER_SIZE extremes |
| pipex | 4 | fork returns twice, fd table trace, pipe reference counting, exec memory layout |
| so_long | 4 | DFS/BFS O(V+E), recursion & stack overflow, camera formula, formal FSM |
| fractol | 4 | Complex multiplication, escape radius proof, IEEE 754, pixel↔complex mapping |
| minitalk | 4 | Signal non-queuing, bitwise operations proof, async-signal-safety, UTF-8 encoding |
| fdf | **4** | Isometric formula derivation, Bresenham proof + trace, color lerp (channel split), auto-fit (centering+zoom+z_scale) |
| philosophers | **4** | Deadlock & Coffman + RAG-graph proof, data race & atomicity, mutex vs semaphore (mandatory/bonus), usleep precision & detection latency |
| cpp_module_00 | **4** | Static members & lifecycle, constructor/destructor order, const-correctness, this pointer |
| cpp_module_01 | **4** | Stack vs heap lifetime, new[]/delete[] pairing, reference vs pointer, pointer-to-member functions |
| cpp_module_02 | **4** | Fixed-point representation, OCF & why the compiler's version breaks, operator<< without friend, const/non-const overload pairs |
| cpp_module_03 | **4** | Constructor/destructor chaining order, unsigned underflow in takeDamage, the diamond problem, name shadowing & scope resolution |
| cpp_module_04 | **4** | Virtual destructor & the Brain leak, deep vs shallow copy, pointer ownership rules, circular include & forward declaration |
| cpp_module_05 | **4** | const members vs OCF, throwing from a constructor, check-in-base/act-in-child, table dispatch instead of if/else |
| cpp_module_06 | **5** | dynamic_cast NULL vs throw, polymorphic-class requirement, float formatting, impossible vs Non displayable, C++98 isnan/isinf |
| cpp_module_07 | **5** | Why templates live in headers, the tie-goes-to-second rule, templating the function parameter, Array deep copy, signed→unsigned index wrap |
| cpp_module_08 | **5** | typename for dependent types, O(n log n) shortestSpan, this->c in dependent bases, why std::stack has no iterators, addRange as an STL idiom |
| cpp_module_09 | **4** | map::lower_bound for the closest earlier date, RPN operand order, Ford-Johnson + Jacobsthal, gettimeofday vs clock() |
| minishell | **4** | Lexer as a state machine + quotes, fd inheritance + dup2/close pipeline, pipe EOF reference counting, signals (interactive/heredoc) + $? propagation |
| miniRT | **4** | Ray-sphere intersection (quadratic + discriminant), Phong lighting + normal flip, shadows & shadow acne (epsilon), camera & ray generation (basis + FOV/aspect) |
| cub3D | **4** | Camera plane & ray direction (FOV), DDA grid traversal, fisheye correction (perpendicular distance), texture mapping (side select + wall_x + flip) |

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
  libft.html          # หน้าโปรเจกต์ (set window.PROJECT_ID)
  ft_printf.html
  get_next_line.html
  push_swap.html
  pipex.html
  so_long.html
  fractol.html
  minitalk.html
  fdf.html
  philosophers.html
  cpp_module_00.html … cpp_module_09.html   # CPP Modules 00–09
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