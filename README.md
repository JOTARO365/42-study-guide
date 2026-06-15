# สื่อการสอน 42 — Teaching Materials

> สื่อการสอนสำหรับ 42 School C projects + AI Engineer track
> สร้างด้วย React 18 (vanilla JS) เปิดแบบ `file://` ได้เลย

## Live Demo

เปิด `index.html` ในเบราว์เซอร์เพื่อดูหน้ารวมลิงก์ทั้งหมด

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

## AI Engineer Track

| โมดูล | ลิงก์ | เนื้อหา |
|-------|-------|---------|
| **AI Foundations** | [ai_foundations.html](ai_foundations.html) | LLM basics, tokens, temperature, hallucination, multi-step architecture |
| **LLM & API** | [ai_llm.html](ai_llm.html) | Structured output, context window, prompt caching, model routing, streaming, multimodal |
| **Embeddings & Vector DB** | [ai_vector.html](ai_vector.html) | Embeddings, cosine similarity, ANN, pgvector, HNSW indexes |
| **RAG** | [ai_rag.html](ai_rag.html) | Chunking, retrieve-augment-generate, hybrid search, Recall@k, reranking |
| **Agents & LangGraph** | [ai_agents.html](ai_agents.html) | StateGraph, nodes/edges, conditional routing, graceful degradation |
| **Harness** | [ai_harness.html](ai_harness.html) | Guardrails, tool calling, system prompt design, cost metering, eval, MCP |

## Interactive Demos

- **push_swap** — Stack playground (กด ops ได้จริง) + auto-sort (Turkish sort ตัวจริง) + benchmark 100/500 ตัว
- **fractol** — Canvas Mandelbrot/Julia, คลิก zoom, iteration slider
- **so_long** — เกมเล่นได้จริง (WASD/ลูกศร) เก็บเหรียญแล้วไปประตู
- **pipex** — Step-through diagram แสดง flow infile → pipe → outfile

## Flow Visualizers

ทุก project มี execution trace ไล่ input วิ่งผ่านฟังก์ชันไหนบ้าง พร้อม variables + data ทุก step:
push_swap, pipex, so_long, fractol, minitalk, fdf, philosophers

## Deep Dives

| Project | จำนวน | หัวข้อ |
|---------|:-----:|--------|
| push_swap | **7** | Big-O formal def, comparison sort lower bound, two's complement, cost calculation, normalization proof, greedy optimality, scoring thresholds analysis |
| pipex | 4 | fork returns twice, fd table trace, pipe reference counting, exec memory layout |
| so_long | 4 | DFS/BFS O(V+E), recursion & stack overflow, camera formula, formal FSM |
| fractol | 4 | Complex multiplication, escape radius proof, IEEE 754, pixel↔complex mapping |
| minitalk | 4 | Signal non-queuing, bitwise operations proof, async-signal-safety, UTF-8 encoding |
| fdf | 1 | Centering derivation |
| philosophers | 1 | usleep precision |
| cpp_module_00 | 1 | this pointer |
| minishell | 1 | Pipe EOF reference counting |

## Tech Stack

- React 18 (vanilla JS, no JSX/Babel — opens as `file://`)
- Bilingual: Thai / English (toggle มุมขวาบน)
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
  app.js              # React UI + interactive demos + flow visualizer
  data.js             # เนื้อหาหลัก (ภาษาไทย) — 9 โปรเจกต์ 42
  data.en.js          # แปลภาษาอังกฤษ
  data.ai.js          # เนื้อหาสาย AI Engineer — 6 โมดูล
  style.css           # Dark theme
```
