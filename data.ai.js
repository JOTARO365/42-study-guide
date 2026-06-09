/* ============================================================
   AI Engineer track — สื่อการสอนสาย AI Engineer
   อิงโค้ดจริงจากโปรเจกต์ xauusd_ai_trading_system
   (ระบบเทรดทองแบบ multi-agent LLM + LangGraph + RAG/pgvector)

   ต่อท้าย window.TEACHING_DATA และเก็บ flow ไว้ใน window.EXTRA_FLOWS
   เพื่อไม่ไปแก้ data.js ก้อนใหญ่
   ============================================================ */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.EXTRA_FLOWS   = window.EXTRA_FLOWS   || {};

/* ===================== AI FOUNDATIONS (ปูพื้นฐานจากศูนย์) ===================== */
window.TEACHING_DATA.push({
  id: "ai_foundations",
  name: "AI Engineer — ปูพื้นฐานจากศูนย์",
  tag: { th: "เริ่มจากไม่รู้อะไรเลย: LLM คืออะไร, AI Engineer ทำอะไร, ระบบ AI จริงประกอบด้วยอะไรบ้าง — ใช้ระบบเทรดทอง multi-agent เป็นตัวอย่างเดินเรื่อง", en: "From zero: what an LLM is, what an AI engineer does, and the anatomy of a real AI system — using a multi-agent gold-trading bot as the running example" },
  accent: "#34d399",
  sections: {
    principle: [
      { h: "หน้านี้สอนใครและสอนอะไร" },
      { p: "สำหรับคนที่ **ไม่เคยแตะ AI มาก่อน**. จบหน้านี้จะเข้าใจว่า LLM คืออะไร, อาชีพ AI Engineer ต่างจาก programmer ปกติยังไง, และระบบ AI จริง ๆ ประกอบด้วยชิ้นส่วนอะไรบ้าง — โดยใช้ระบบจริงที่ชื่อ **xauusd_ai_trading_system** (บอทเทรดทองที่ให้ AI หลายตัวช่วยกันตัดสินใจ) เป็นตัวอย่างตลอดทั้งสาย" },
      { h: "LLM คืออะไร (พูดแบบบ้าน ๆ)" },
      { p: "**LLM (Large Language Model)** เช่น Claude, GPT, Gemini คือโมเดลที่ถูกฝึกจากข้อความมหาศาลจนทำงานได้อย่างเดียว: **เดาคำถัดไป**. ป้อนข้อความเข้าไป (prompt) มันต่อข้อความออกมา (completion) ทีละ token. ความฉลาดทั้งหมด — สรุป, แปล, เขียนโค้ด, ตัดสินใจ — เกิดจากการ 'เดาคำต่อไปได้แม่นมาก'" },
      { note: "AI Engineer ไม่ได้ 'เทรนโมเดล' เป็นหลัก — งานคือ **เอาโมเดลที่มีอยู่แล้วมาประกอบเป็นระบบที่ใช้งานได้จริง** (เรียก API, ออกแบบ prompt, ต่อกับข้อมูล, คุม cost, จัด error). การเทรนโมเดลคืองานของ ML Engineer/Researcher" },
      { h: "AI Engineer ต่างจาก dev ปกติยังไง" },
      { table: { head: ["", "Dev ปกติ", "AI Engineer"], rows: [
        ["ผลลัพธ์ของฟังก์ชัน", "แน่นอน (deterministic)", "ไม่แน่นอน (probabilistic) — ตอบไม่เหมือนเดิมทุกครั้ง"],
        ["หน่วยที่จ่ายเงิน", "CPU/RAM", "token (จ่ายตามจำนวนคำเข้า-ออก)"],
        ["การ debug", "อ่าน stack trace", "อ่าน prompt + output + ปรับคำ"],
        ["ความถูกต้อง", "ผ่าน/ไม่ผ่าน", "วัดเป็น % (accuracy, recall) — ต้องมี eval"],
        ["ความเสี่ยง", "crash", "hallucinate (มั่นใจแต่ผิด), prompt injection"],
      ]}},
      { h: "ระบบ AI จริงประกอบด้วยอะไร (ตัวอย่างจริง)" },
      { p: "ระบบเทรดทองตัวนี้ไม่ใช่ 'เรียก LLM ครั้งเดียวจบ' — แต่เป็น **agent หลายตัวต่อกันเป็นสายงาน** แต่ละตัวมีหน้าที่เฉพาะ:" },
      { code: String.raw`chart_watcher  → ดูกราฟ ออกสัญญาณ BUY/SELL/NO_TRADE
market_advisor → วิเคราะห์ภาวะตลาด (เทรนด์/sideways)
news_gatherer  → ดึงข่าว Twitter/ForexFactory
analyst        → อ่านข่าว สรุป sentiment (+ RAG ค้นข่าวที่เกี่ยว)
decision_maker → รวมทุกอย่าง ตัดสินใจ EXECUTE/SKIP
position_mgmt  → จัดการไม้ที่เปิดอยู่ (trailing stop ฯลฯ)
reporter       → บันทึกผล + เรียนรู้บทเรียน (RAG)
accountant     → นับ token/cost ของแต่ละ agent`, cap: "8+ agent ทำงานต่อกันด้วย LangGraph — แต่ละสายต่อกันใน trading_graph.py", lang: "txt" },
      { h: "5 เสาหลักของสาย AI Engineer (= 5 หน้าในชุดนี้)" },
      { table: { head: ["เสา", "คืออะไร", "เห็นในระบบนี้ที่"], rows: [
        ["LLM + API", "เรียกโมเดล, prompt, structured output, คุม token", "analyst.py, schemas.py"],
        ["Embeddings + Vector DB", "เปลี่ยนข้อความเป็นเวกเตอร์ แล้วค้นด้วยความหมาย", "news_cache.py (pgvector)"],
        ["RAG", "ดึงข้อมูลที่เกี่ยวมาเสริม prompt ก่อนตอบ", "lesson_store.py, news_cache.py"],
        ["Agents / LangGraph", "ต่อหลายขั้นเป็น state machine + routing", "trading_graph.py"],
        ["Harness / Eval / Cost", "วัดผล, คุมงบ, กัน error", "accountant.py, moulinette (Recall@k)"],
      ]}},
    ],
    theory: [
      { h: "1) Token — หน่วยที่ LLM มองเห็น (และที่เราจ่ายเงิน)" },
      { p: "LLM ไม่ได้อ่านเป็นตัวอักษรหรือคำ แต่อ่านเป็น **token** (ชิ้นคำ). คร่าว ๆ ภาษาอังกฤษ 1 token ≈ 4 ตัวอักษร ≈ 0.75 คำ. ค่าใช้จ่ายคิดตามจำนวน token เข้า (input) + ออก (output) — ยิ่ง prompt ยาว ยิ่งแพงและช้า" },
      { code: String.raw`"BUY signal BULLISH trend" → ~5 tokens
ประมาณ token แบบหยาบในโค้ดจริง (news_cache.py):
token_estimate = len(text.split()) * 4 // 3`, cap: "สูตรกะ token แบบเร็ว ๆ ที่ระบบใช้จริงเพื่อ log ว่าส่งไปกี่ token", lang: "py" },
      { h: "2) Prompt = อินพุตเดียวของ LLM" },
      { p: "ทุกอย่างที่ LLM รู้ในรอบนั้นมาจาก prompt เท่านั้น. โครงสร้างมาตรฐานมี 2 ส่วน: **system** (บทบาท/กติกา ตั้งครั้งเดียว) และ **user** (ข้อมูล/คำถามรอบนี้)" },
      { code: String.raw`messages = [
  {"role": "system", "content": "คุณคือนักวิเคราะห์ทอง ตอบเป็น JSON..."},
  {"role": "user",   "content": "ข่าววันนี้: ... วิเคราะห์ sentiment"},
]`, cap: "โครงเดียวกับที่ analyst.py ส่งให้ Claude จริง", lang: "py" },
      { h: "3) ทำไมผลไม่แน่นอน — temperature" },
      { p: "LLM สุ่มเลือกคำถัดไปจากความน่าจะเป็น. **temperature** คุมความสุ่ม: 0 = เลือกตัวที่มั่นใจสุดเสมอ (ตอบนิ่ง เหมาะงานตัดสินใจ), สูง = หลากหลาย (เหมาะงานสร้างสรรค์). ระบบเทรดตั้ง `temperature=0` ทุก agent เพราะต้องการคำตอบที่คงเส้นคงวา" },
      { h: "4) Hallucination — ความเสี่ยงอันดับ 1" },
      { p: "LLM 'เดาคำ' ได้แม้ไม่รู้จริง → บางครั้งตอบผิดอย่างมั่นใจ (hallucinate). วิธีลด: (1) ป้อนข้อมูลจริงเข้า prompt (= RAG), (2) บังคับรูปแบบผลลัพธ์ (structured output), (3) มี fallback เมื่อผลไม่น่าเชื่อถือ" },
      { h: "5) SDK landscape — เครื่องมือที่ใช้จริง" },
      { table: { head: ["เครื่องมือ", "ใช้ทำ", "ในโปรเจกต์นี้"], rows: [
        ["`anthropic` SDK", "เรียก Claude ตรง ๆ (low-level)", "news_cache.py (Haiku summary)"],
        ["`langchain-anthropic`", "wrapper + structured output", "analyst.py (ChatAnthropic)"],
        ["`langgraph`", "ต่อ agent เป็น state graph", "trading_graph.py"],
        ["`google-genai`", "Gemini embeddings", "news_cache.py / lesson_store.py"],
        ["Supabase + `pgvector`", "เก็บ + ค้น vector", "ทั้ง news + lessons"],
      ]}},
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Anthropic — Intro to Claude", url: "https://docs.anthropic.com/en/docs/intro-to-claude", note: "ภาพรวม LLM + เริ่มต้นใช้ Claude" },
        { label: "Anthropic — Prompt engineering overview", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", note: "หลักการเขียน prompt" },
        { label: "What are tokens? (OpenAI help)", url: "https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them", note: "token คืออะไร นับยังไง (ใช้ได้กับทุกโมเดล)" },
        { label: "LangGraph — Concepts", url: "https://langchain-ai.github.io/langgraph/concepts/", note: "แนวคิด agent graph ที่ใช้ในระบบนี้" },
      ]},
      { h: "🎬 วิดีโอสอน (เจาะลึก)" },
      { links: [
        { label: "How I'd Learn AI Engineering in 2026 (Complete Roadmap)", url: "https://www.youtube.com/watch?v=O2UmHpNlwUw", note: "เส้นทางสายงาน AI Engineer ครบ" },
        { label: "How to Actually Learn LLMs in 2026 (Ex-Google/Microsoft)", url: "https://www.youtube.com/watch?v=U07MHi4Suj8", note: "เข้าใจว่า LLM ทำงานยังไงจริง ๆ" },
        { label: "From Zero to AI Engineer: 2026 Roadmap (No CS Degree)", url: "https://www.youtube.com/watch?v=1Eq4El-XpTg", note: "เริ่มจากศูนย์" },
        { label: "mikelopster — Developer's Learning Roadmap (ไทย)", url: "https://www.youtube.com/watch?v=F11AK8oGcW0", note: "มุมมองสาย dev ภาษาไทย" },
      ]},
    ],
    foundations: [
      { h: "สิ่งที่ต้องมีก่อนเขียน AI app" },
      { ul: [
        "**API key** ของผู้ให้บริการโมเดล (เช่น ANTHROPIC_API_KEY, GEMINI_API_KEY) — เก็บใน `.env` ห้าม hardcode",
        "Python 3.10+ และ virtualenv (โปรเจกต์นี้ใช้ `uv`)",
        "ความเข้าใจ async เบื้องต้น (บาง agent เป็น `async def` เช่น news)",
        "ฐานข้อมูลที่รองรับ vector ถ้าจะทำ RAG (โปรเจกต์นี้ใช้ Supabase + pgvector)",
      ]},
      { h: "เก็บ key อย่างปลอดภัย (จาก config.py จริง)" },
      { code: String.raw`# .env  (อยู่ใน .gitignore ห้าม commit)
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...

# config.py โหลดค่ามาใช้
import os
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")`, cap: "ทุก agent อ่าน key จาก config/env — เปลี่ยน key ได้โดยไม่แตะโค้ด", lang: "py" },
      { h: "เรียก LLM ครั้งแรก (hello world ของ AI Engineer)" },
      { code: String.raw`import anthropic
client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
resp = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=300,
    messages=[{"role": "user", "content": "สรุปทองคำวันนี้สั้น ๆ"}],
)
print(resp.content[0].text)`, cap: "โครงเดียวกับ _summarize_with_haiku() ใน news_cache.py", lang: "py" },
      { h: "โครงโฟลเดอร์ของระบบ AI จริง" },
      { code: String.raw`xauusd_ai_trading_system/
├─ agents/          ← LLM agents แต่ละตัว (1 ไฟล์ = 1 หน้าที่)
│  ├─ analyst.py        sentiment + RAG
│  ├─ decision_maker.py ตัดสินใจสุดท้าย
│  ├─ news_cache.py     embeddings + vector search
│  ├─ schemas.py        รูปแบบ output (pydantic)
│  └─ trading_graph.py  ต่อทุก agent ด้วย LangGraph
├─ db/              ← lesson_store.py (RAG บทเรียน), connection
├─ connectors/      ← ดึงข้อมูลภายนอก (ราคา, ข่าว)
├─ config.py        ← โหลด key + ตั้งค่า
└─ main.py          ← วน loop เรียก graph ทุกรอบ`, cap: "แยกหน้าที่ชัด: agent = สมอง, connector = แขนขา, db = ความจำ", lang: "txt" },
      { note: "หลักสำคัญ: **1 agent = 1 หน้าที่เดียว**. อย่าให้ agent เดียวทำทุกอย่าง — แยกเป็นชิ้นเล็กแล้วต่อกัน ทำให้ทดสอบ/แก้/วัด cost ทีละตัวได้" },
    ],
    architecture: [
      { h: "ภาพรวม: input วิ่งจากตลาด → คำตัดสินใจ" },
      { code: String.raw`ราคา+กราฟ ─┐
ข่าว ──────┤→ [agents วิเคราะห์ทีละชั้น] → decision → ส่งคำสั่งเทรด
ความจำเก่า ┘                                   │
        (RAG: บทเรียนที่ผ่านมา) ───────────────┘`, cap: "ระบบรวม 3 แหล่ง: ข้อมูลสด + ความรู้โมเดล + ความจำระยะยาว (RAG)", lang: "txt" },
      { h: "ทำไมต้องหลาย agent ไม่ใช่ prompt เดียวยาว ๆ" },
      { ul: [
        "**แม่นกว่า** — แต่ละ agent โฟกัสงานเดียว prompt สั้น โอกาส hallucinate น้อย",
        "**ถูกกว่า** — งานง่าย (สรุปข่าว) ใช้โมเดลถูก (Haiku), งานยาก (ตัดสินใจ) ใช้โมเดลแพง (Sonnet)",
        "**แก้/วัดได้ทีละตัว** — รู้ว่า agent ไหนพัง/กิน token เท่าไร (accountant นับแยก)",
        "**เพิ่ม/ถอดได้** — เสริม agent ใหม่โดยไม่รื้อทั้งระบบ",
      ]},
      { h: "เลเยอร์ของโค้ด" },
      { table: { head: ["เลเยอร์", "ไฟล์", "หน้าที่"], rows: [
        ["Orchestration", "trading_graph.py", "ลำดับ + routing ของ agent"],
        ["Agent (สมอง)", "agents/*.py", "เรียก LLM + ตรรกะเฉพาะทาง"],
        ["Schema (สัญญา)", "schemas.py", "บังคับรูปแบบ output"],
        ["Memory (ความจำ)", "db/lesson_store.py", "RAG เก็บ/ค้นบทเรียน"],
        ["Connector (แขนขา)", "connectors/*.py", "ดึงข้อมูล/ส่งคำสั่งจริง"],
        ["Accounting (มิเตอร์)", "agents/accountant.py", "นับ token + latency"],
      ]}},
    ],
    dataflow: [
      { h: "1 รอบของระบบ (cycle) — ข้อมูลไหลยังไง" },
      { p: "`main.py` เรียก graph ซ้ำ ๆ เป็นรอบ. แต่ละรอบข้อมูลไหลผ่าน agent ทีละตัว โดยส่งต่อกันผ่าน **state** (dict กลางที่ทุก node อ่าน/เขียน):" },
      { code: String.raw`รอบที่ N:
1. chart_watcher  อ่านราคา → {signal:"BUY", confidence:72}
2. market_advisor อ่าน signal → {regime:"BULLISH_TREND"}
3. news_gatherer  ดึงข่าว → {tweets:[...], calendar:[...]}
4. analyst        ข่าว+RAG → {sentiment:"BULLISH", confidence:65}
5. decision_maker รวมทุกอย่าง → {action:"EXECUTE", direction:"BUY"}
6. position_mgmt  เปิด/จัดการไม้
7. reporter       บันทึก + เรียนบทเรียน
8. accountant     สรุป token+cost ของรอบนี้`, cap: "state เริ่มว่าง แล้วแต่ละ agent เติมข้อมูลของตัวเองลงไป", lang: "txt" },
      { h: "state คือหัวใจของการส่งต่อ" },
      { p: "ทุก agent ไม่ได้คุยกันตรง ๆ แต่อ่าน/เขียนผ่าน state เดียว (ดูรายละเอียดในหน้า Agents/LangGraph). ทำให้ลำดับยืดหยุ่น — ข้ามขั้น, ลัด, หรือวนกลับได้ตามเงื่อนไข" },
      { note: "ดูการไหลแบบ interactive ได้ที่แท็บ Visualizer ▶ — ไล่ทีละ agent พร้อมตัวแปร state ที่ถูกเขียน" },
    ],
    implementation: [
      { h: "🧪 ตัวอย่างใช้งานครบ (คัดลอกไปลองได้)" },
      { p: "โครงสร้าง: `client` → ฟังก์ชัน `ask()` (เรียก LLM 1 ครั้ง) → ต่อ 2 สเตปเป็น mini pipeline (สรุป → ตัดสินทิศ) เห็นภาพ 'หลาย step ต่อกัน' ตั้งแต่ต้น" },
      { code: String.raw`# pip install anthropic   |   ตั้งค่า: export ANTHROPIC_API_KEY=sk-ant-...
import os, anthropic
client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

def ask(prompt, model="claude-haiku-4-5-20251001", max_tokens=200):
    r = client.messages.create(model=model, max_tokens=max_tokens,
                               messages=[{"role": "user", "content": prompt}])
    return r.content[0].text.strip()

text = "วันนี้ทองขึ้นแรงเพราะดอลลาร์อ่อนหลัง Fed ส่งสัญญาณลดดอกเบี้ย"
summary = ask(f"สรุปข่าวนี้สั้น ๆ 1 ประโยค:\n{text}")              # step 1
verdict = ask(f"ข่าวนี้ bullish/bearish/neutral ต่อทอง? ตอบคำเดียว:\n{summary}")  # step 2
print("สรุป:", summary)
print("ทิศ :", verdict)`, cap: "แอป AI ตัวแรก — เรียก LLM + ต่อ 2 สเตป (รันได้จริงด้วย key)", lang: "py" },
      { ul: [
        "`client` — ตัวเชื่อมกับโมเดล สร้างครั้งเดียว",
        "`ask()` — ห่อ 1 LLM call ให้เรียกซ้ำง่าย",
        "step 1→2 — ส่งผลสเตปแรกเป็น input สเตปถัดไป = แนวคิด pipeline",
        "อยากฉลาดขึ้นเปลี่ยน model เป็น `claude-sonnet-4-6`",
      ]},
      { h: "เส้นทางการเรียนสาย AI Engineer (แนะนำลำดับ)" },
      { ul: [
        "1. **LLM + API** — เรียกโมเดลให้เป็น, prompt, structured output, คุม token/context (หน้า LLM)",
        "2. **Embeddings + Vector DB** — เปลี่ยนข้อความเป็นเวกเตอร์ ค้นด้วยความหมาย (หน้า Vector DB)",
        "3. **RAG** — เอา 1+2 มารวม: ดึงข้อมูลเสริม prompt (หน้า RAG)",
        "4. **Agents / LangGraph** — ต่อหลายขั้นเป็นระบบ (หน้า Agents)",
        "5. **Harness/Eval/Cost** — วัดผล Recall@k, คุมงบ, กัน error (แทรกอยู่ทุกหน้า)",
      ]},
      { h: "กฎเหล็กของ production AI" },
      { table: { head: ["กฎ", "ทำไม"], rows: [
        ["ทุก LLM call ต้องมี try/except + fallback", "API ล่ม/ตอบเพี้ยนได้เสมอ ห้ามให้ทั้งระบบพัง"],
        ["บังคับ output เป็น schema", "ไม่งั้น parse ข้อความอิสระแล้วพังบ่อย"],
        ["ใส่ max_tokens เสมอ", "กันค่าใช้จ่าย/เวลาบานปลาย"],
        ["log token + latency ทุก call", "ไม่วัด = คุม cost ไม่ได้"],
        ["เลือกโมเดลตามงาน", "งานง่ายใช้ Haiku, งานยากใช้ Sonnet"],
      ]}},
    ],
    tricks: [
      { h: "ทริค 1: เริ่มจากโมเดลถูกก่อนเสมอ" },
      { p: "ลองงานด้วย Haiku ก่อน ถ้าคุณภาพพอก็จบ (ถูกกว่า Sonnet หลายเท่า). ค่อยอัปเกรดเฉพาะ agent ที่ต้องการความฉลาดสูงจริง ๆ" },
      { h: "ทริค 2: คิดเป็น pipeline ไม่ใช่ prompt ยักษ์" },
      { p: "อย่ายัดทุกอย่างใน prompt เดียว — แตกเป็น agent เล็ก ๆ ต่อกัน. ดีบั๊กง่าย วัด cost แยกได้ และแต่ละชิ้นแม่นขึ้น" },
      { h: "ทริค 3: ออกแบบ fallback ตั้งแต่แรก" },
      { p: "ทุก agent ในระบบนี้มีค่า default เมื่อ LLM พัง (เช่น analyst คืน NEUTRAL conf 0). ระบบเดินต่อได้แม้ตัวใดตัวหนึ่งล้ม" },
      { h: "ทริค 4: วัดทุกอย่างเป็นตัวเลข" },
      { p: "accountant นับ token+latency ต่อ agent ทุกรอบ; RAG วัด Recall@k. ของที่วัดไม่ได้ = ปรับปรุงไม่ได้" },
    ],
    eval: [
      { qa: [
        { q: "LLM ทำงานยังไงในหนึ่งประโยค?", a: "ทำนาย token ถัดไปจากข้อความที่ป้อนเข้าไป ทีละ token จนจบ — ความสามารถทุกอย่างมาจากการเดาคำต่อไปได้แม่น" },
        { q: "AI Engineer ต่างจาก ML Engineer ยังไง?", a: "AI Engineer เอาโมเดลสำเร็จมาประกอบเป็นระบบใช้งานจริง (API, prompt, RAG, agent, cost); ML Engineer เน้นสร้าง/เทรนโมเดลเอง" },
        { q: "token คืออะไร ทำไมสำคัญ?", a: "หน่วยชิ้นคำที่ LLM อ่าน และเป็นหน่วยคิดเงิน (input+output) ยิ่งมากยิ่งแพง/ช้า — ต้องออกแบบให้พอดีงาน" },
        { q: "ทำไมระบบนี้ใช้ AI หลายตัวไม่ใช่ตัวเดียว?", a: "แต่ละ agent โฟกัสงานเดียว → แม่นกว่า, เลือกโมเดลตามงานได้ (ถูกกว่า), ทดสอบ/วัด cost/แก้ทีละตัวได้" },
        { q: "hallucination คืออะไร ป้องกันยังไง?", a: "LLM ตอบผิดอย่างมั่นใจเพราะมันแค่เดาคำ; ลดด้วย RAG (ป้อนข้อมูลจริง), structured output, และ fallback" },
        { q: "temperature=0 หมายความว่าอะไร?", a: "ให้โมเดลเลือกคำที่มั่นใจสุดเสมอ ผลคงเส้นคงวา เหมาะงานตัดสินใจ; ค่าสูงผลหลากหลายเหมาะงานสร้างสรรค์" },
        { q: "5 เสาหลักของสาย AI Engineer คือ?", a: "LLM+API, Embeddings+Vector DB, RAG, Agents/LangGraph, และ Harness/Eval/Cost" },
        { q: "state ในระบบ multi-agent คืออะไร?", a: "dict กลางที่ทุก agent อ่าน/เขียนเพื่อส่งต่อข้อมูลกัน แทนการคุยกันตรง ๆ ทำให้ลำดับยืดหยุ่น" },
      ]},
    ],
  },
});
window.EXTRA_FLOWS.ai_foundations = {
  input: "1 รอบของระบบเทรด (main.py เรียก trading graph)",
  steps: [
    { fn: "main loop", file: "main.py", depth: 0, note: "เริ่มหนึ่งรอบ: เรียก trading graph แล้วรอผล", data: "trigger: ถึงเวลา cycle ใหม่", vars: [
      { n: "state", d: "dict กลางที่ทุก agent จะเติมข้อมูล เริ่มจากว่าง", w: true } ] },
    { fn: "chart_watcher", file: "agents/chart_watcher.py", depth: 1, note: "LLM ดูกราฟ → ออกสัญญาณ", data: "→ {signal:'BUY', confidence:72}", vars: [
      { n: "state.chart_data", v: "{signal:BUY,...}", d: "ผลวิเคราะห์กราฟ", w: true } ] },
    { fn: "news + analyst", file: "agents/analyst.py", depth: 1, note: "ดึงข่าว + RAG ค้นข่าวที่เกี่ยว → สรุป sentiment", data: "→ {sentiment:'BULLISH', confidence:65}", vars: [
      { n: "state.news_data", d: "ข่าวดิบที่ดึงมา", w: true },
      { n: "state.sentiment_data", v: "{sentiment:BULLISH}", d: "ผลวิเคราะห์ข่าว", w: true } ] },
    { fn: "decision_maker", file: "agents/decision_maker.py", depth: 1, note: "รวมกราฟ+ข่าว+บทเรียนเก่า (RAG) → ตัดสินใจ", data: "→ {action:'EXECUTE', direction:'BUY'}", vars: [
      { n: "state.decision", v: "{action:EXECUTE}", d: "คำตัดสินใจสุดท้าย", w: true } ] },
    { fn: "reporter + accountant", file: "agents/reporter.py", depth: 1, note: "บันทึกผล, เรียนบทเรียน (เก็บลง RAG), นับ token/cost", data: "log + lesson stored + usage", vars: [
      { n: "state.latencies", d: "เวลาของแต่ละ agent (ไว้วัดผล)", w: true } ] },
  ],
};

/* ===================== AI LLM + API (context window + token design) ===================== */
window.TEACHING_DATA.push({
  id: "ai_llm",
  name: "LLM & API — เรียกโมเดล + คุม token/context",
  tag: { th: "เรียก Claude ให้ได้ผลที่เอาไปใช้ต่อได้จริง: structured output, prompt caching, เลือกโมเดลตามงาน, ออกแบบ context window และ token budget ให้เหมาะกับงาน", en: "Calling Claude for production: structured output, prompt caching, model selection, and designing context windows / token budgets to fit the job" },
  accent: "#60a5fa",
  sections: {
    principle: [
      { h: "หน้านี้สอนอะไร" },
      { p: "วิธีเรียก LLM ให้ได้ผลลัพธ์ที่ **เอาไปใช้ต่อในโค้ดได้จริง** (ไม่ใช่ข้อความลอย ๆ) และวิธี **ออกแบบ token/context ให้เหมาะกับงาน** — เพราะ context มีจำกัดและทุก token มีราคา. ตัวอย่างทั้งหมดมาจาก agent จริงในระบบเทรด" },
      { h: "ปัญหาหลักของการเรียก LLM ดิบ ๆ" },
      { ul: [
        "ผลออกมาเป็นข้อความอิสระ → parse ยาก พังบ่อย (แก้: **structured output**)",
        "prompt ยาวซ้ำ ๆ ทุกครั้ง → แพง+ช้า (แก้: **prompt caching**)",
        "ส่งข้อมูลดิบทั้งหมด → เกิน budget (แก้: **สรุป/คัดก่อนส่ง**)",
        "ใช้โมเดลแพงกับงานง่าย → เปลืองเงิน (แก้: **เลือกโมเดลตามงาน**)",
      ]},
      { h: "structured output คือพระเอก" },
      { p: "แทนที่จะหวังให้ LLM ตอบ JSON เองแล้วมานั่ง parse — เรา**บังคับ schema** ด้วย pydantic แล้ว `.with_structured_output()`. ได้ object ที่ field ครบ type ถูกเสมอ" },
      { code: String.raw`class AnalystOutput(BaseModel):
    sentiment: Literal["BULLISH", "BEARISH", "NEUTRAL"]
    confidence: int = Field(ge=0, le=90)
    bias: Literal["BUY", "SELL", "NEUTRAL"]
    summary: str = Field(default="", description="เหตุผลสั้นมาก ไม่เกิน 60 ตัวอักษร")`, cap: "schemas.py จริง — Literal บังคับค่าที่เป็นไปได้, Field คุมช่วงเลข", lang: "py" },
    ],
    theory: [
      { h: "1) Context window — โต๊ะทำงานของโมเดล" },
      { p: "**Context window** คือจำนวน token สูงสุดที่โมเดลรับได้ในหนึ่งครั้ง (input + output รวมกัน). เปรียบเป็นโต๊ะทำงาน — ของที่วางบนโต๊ะเท่านั้นที่โมเดลเห็น. เกินโต๊ะ = ต้องตัดทิ้ง. โมเดลใหม่ ๆ มี context ใหญ่ (หลายแสน token) แต่ 'ใส่ได้' ไม่ได้แปลว่า 'ควรใส่' — ยิ่งยัดเยอะยิ่งแพง ช้า และโมเดลโฟกัสหลุด" },
      { h: "2) input token vs output token" },
      { table: { head: ["", "input", "output"], rows: [
        ["คืออะไร", "prompt ที่เราส่งเข้า", "คำตอบที่โมเดลสร้าง"],
        ["ราคา (ต่อ token)", "ถูกกว่า", "แพงกว่า (มักหลายเท่า)"],
        ["คุมยังไง", "สรุป/คัด/แคชก่อนส่ง", "`max_tokens` + ขอผลสั้น"],
      ]}},
      { note: "เพราะ output แพงกว่า — analyst.py จึงตั้ง `max_tokens=300` และสั่งให้ summary ยาวไม่เกิน 60 ตัวอักษร แถม 'ตัด field ที่ไม่ได้ใช้ออกจาก schema' เพื่อลด output token (มีคอมเมนต์บอกไว้ในโค้ดจริง)" },
      { h: "3) prompt caching — จ่ายครั้งเดียวสำหรับส่วนที่ซ้ำ" },
      { p: "system prompt ยาว ๆ (กติกา/รูปแบบ) เหมือนกันทุกรอบ. **prompt caching** ให้ผู้ให้บริการเก็บส่วนนั้นไว้ จ่ายเต็มครั้งแรก ครั้งต่อ ๆ ไปคิดถูกลงมาก. ทำได้ด้วย `cache_control`:" },
      { code: String.raw`messages = [
  {"role": "system", "content": [
    {"type": "text", "text": SYSTEM_PROMPT,
     "cache_control": {"type": "ephemeral"}}   # ← แคชส่วนนี้
  ]},
  {"role": "user", "content": user_message},
]`, cap: "analyst.py จริง — system prompt ถูกแคช, เฉพาะ user message ที่เปลี่ยนทุกรอบ", lang: "py" },
      { h: "4) เลือกโมเดลตามงาน (model routing)" },
      { p: "ไม่ใช่ทุกงานต้องใช้โมเดลฉลาดสุด. ระบบนี้ใช้ **Haiku** (เร็ว/ถูก) สรุปข่าว และ **Sonnet** (ฉลาดกว่า/แพงกว่า) สำหรับวิเคราะห์+ตัดสินใจ" },
      { code: String.raw`# news_cache.py — งานสรุป ใช้ Haiku
_HAIKU_MODEL = "claude-haiku-4-5-20251001"
# analyst.py — งานวิเคราะห์ ใช้ Sonnet
_llm = ChatAnthropic(model="claude-sonnet-4-6", temperature=0, max_tokens=300)`, cap: "สรุปข่าวด้วย Haiku ช่วยประหยัด token ของ Sonnet ~83% (คอมเมนต์จริงใน news_cache.py)", lang: "py" },
      { h: "5) temperature & max_tokens" },
      { p: "`temperature=0` → ตอบนิ่งคงเส้นคงวา (ทุก agent ตัดสินใจใช้ค่านี้). `max_tokens` → เพดานความยาวคำตอบ กันบานปลาย. ทั้งคู่ตั้งตอนสร้าง client" },
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Anthropic — Messages API", url: "https://docs.anthropic.com/en/api/messages", note: "พารามิเตอร์ทั้งหมด: model, max_tokens, system, messages" },
        { label: "Anthropic — Prompt caching", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching", note: "cache_control ที่ใช้ใน analyst.py" },
        { label: "Anthropic — Context windows", url: "https://docs.anthropic.com/en/docs/build-with-claude/context-windows", note: "context window ทำงานยังไง" },
        { label: "Anthropic — Models overview & pricing", url: "https://docs.anthropic.com/en/docs/about-claude/models", note: "เทียบ Haiku/Sonnet/Opus เพื่อเลือกตามงาน" },
        { label: "LangChain — structured output", url: "https://python.langchain.com/docs/concepts/structured_outputs/", note: "with_structured_output() ที่ใช้จริง" },
      ]},
      { h: "🎬 วิดีโอสอน (เจาะลึก)" },
      { links: [
        { label: "Understand LLM Context Windows", url: "https://www.youtube.com/watch?v=oOL0WY1b_x4", note: "เจาะ context window โดยตรง" },
        { label: "Build Hour: Prompt Caching (OpenAI)", url: "https://www.youtube.com/watch?v=tECAkJAI_Vk", note: "workshop เต็มเรื่อง caching" },
        { label: "Caching Strategies to Slash Your LLM Bill + Demo", url: "https://www.youtube.com/watch?v=j9wVKM89XFU", note: "ออกแบบ token budget ลด cost" },
        { label: "The Secret to Faster & Cheaper LLM Apps — Prompt Caching", url: "https://www.youtube.com/watch?v=etYgu0Q50vI", note: "caching แบบเข้าใจง่าย" },
      ]},
    ],
    foundations: [
      { h: "กายวิภาคของหนึ่ง LLM call" },
      { code: String.raw`_llm = ChatAnthropic(
    model="claude-sonnet-4-6",   # โมเดลไหน (= ราคา/ความฉลาด)
    api_key=ANTHROPIC_API_KEY,
    max_tokens=300,              # เพดาน output
    temperature=0,               # ความสุ่ม (0 = นิ่ง)
).with_structured_output(AnalystOutput)  # บังคับรูปแบบผล

parsed = _llm.invoke(messages)   # ได้ AnalystOutput object เลย
parsed.sentiment                 # "BULLISH" — ใช้ต่อได้ทันที`, cap: "analyst.py จริง — ตั้งครั้งเดียวระดับ module ใช้ซ้ำทุกรอบ", lang: "py" },
      { h: "ทำไม schema สำคัญกว่าที่คิด" },
      { table: { head: ["ไม่มี schema", "มี schema (pydantic)"], rows: [
        ["ได้ string ต้อง parse เอง", "ได้ object พร้อมใช้"],
        ["LLM อาจตอบนอกกรอบ", "Literal บังคับค่าที่ยอมรับ"],
        ["เลขอาจเกินช่วง", "Field(ge=0, le=90) คุมช่วง"],
        ["พังเงียบ ๆ", "validate error จับได้ทันที"],
      ]}},
      { h: "field มีราคา — ออกแบบ schema ให้ผอม" },
      { p: "ทุก field ที่ให้ LLM สร้าง = output token ที่ต้องจ่าย. โค้ดจริงถึงกับ 'ตัด key_factors + alignment ออก' เพราะ generate แล้วไม่ได้ใช้ downstream — เก็บเฉพาะที่ใช้จริง (sentiment, confidence, bias, summary สั้น)" },
    ],
    architecture: [
      { h: "แยก prompt ออกจากโค้ด" },
      { p: "system prompt ของ agent ถูกเก็บเป็นไฟล์แยก (`agents/prompts/*.json`) แล้วโหลดเข้ามา — แก้ prompt ได้โดยไม่แตะโค้ด และทำให้ caching ทำงานได้ (เนื้อหาคงที่)" },
      { code: String.raw`SYSTEM_PROMPT = json.dumps(
    json.loads(Path("agents/prompts/analyst.json").read_text(encoding="utf-8")),
    separators=(",", ":"),   # บีบช่องว่างออก → ประหยัด token
)`, cap: "analyst.py จริง — แม้แต่ช่องว่างใน JSON ก็บีบออกเพื่อลด token", lang: "py" },
      { h: "module-level client (สร้างครั้งเดียว)" },
      { p: "client/LLM ถูกสร้างตอน import ระดับ module ไม่ใช่สร้างใหม่ทุก call — ลด overhead และตั้งค่า (model, temp, schema) ไว้ที่เดียว" },
      { h: "งบ token ของหนึ่ง prompt (analyst)" },
      { table: { head: ["ส่วน", "ที่มา", "กลยุทธ์"], rows: [
        ["system prompt", "ไฟล์ JSON บีบแล้ว", "แคช (cache_control)"],
        ["news summary", "Haiku สรุปมาก่อน", "สั้น ~250 token"],
        ["relevant news", "vector search top-3", "คัดเฉพาะที่เกี่ยว"],
        ["calendar", "hard data", "ส่งตรง (สั้น)"],
        ["output", "max_tokens=300", "schema ผอม"],
      ]}},
    ],
    dataflow: [
      { h: "การไหลของ analyst.analyze_sentiment()" },
      { code: String.raw`news_data + chart_data
   │
   ├─ build market_context  ("BUY signal BULLISH trend ...")
   │
   ├─ get_news_context()    → Haiku summary + vector top-3   (ลด token)
   │
   ├─ ประกอบ user_message   (regime + summary + relevant + calendar)
   │
   ├─ messages = [system(cached), user]
   │
   ├─ _llm.invoke(messages) → AnalystOutput (structured)
   │      └─ except → fallback NEUTRAL conf 0
   │
   └─ return {sentiment, confidence, bias, summary, ...}`, cap: "analyst.py จริง — สังเกตว่าก่อนถึง LLM มีการ 'ลด token' หลายชั้น", lang: "txt" },
      { h: "fallback เมื่อ LLM พัง" },
      { code: String.raw`try:
    parsed = _llm.invoke(messages)
    result = {"sentiment": parsed.sentiment, "confidence": parsed.confidence, ...}
except Exception as e:
    logger.error(f"structured output failed: {e} — defaulting NEUTRAL")
    result = {"sentiment": "NEUTRAL", "confidence": 0, ...}`, cap: "ไม่ว่าจะ timeout/parse fail — ระบบได้ค่ากลาง ๆ เดินต่อได้", lang: "py" },
    ],
    implementation: [
      { h: "🧪 ตัวอย่างใช้งานครบ (คัดลอกไปลองได้)" },
      { p: "โครงสร้าง: schema (pydantic) → ChatAnthropic + `with_structured_output` → เรียกแบบ system(cached)+user → คืน object พร้อมใช้ + fallback" },
      { code: String.raw`# pip install langchain-anthropic pydantic
import os
from typing import Literal
from pydantic import BaseModel, Field
from langchain_anthropic import ChatAnthropic

class Review(BaseModel):                       # สัญญาของผลลัพธ์
    sentiment: Literal["positive", "negative", "neutral"]
    score: int = Field(ge=0, le=100)
    reason: str = Field(default="", description="สั้นไม่เกิน 60 ตัวอักษร")

llm = ChatAnthropic(model="claude-haiku-4-5-20251001",
                    api_key=os.environ["ANTHROPIC_API_KEY"],
                    max_tokens=200, temperature=0).with_structured_output(Review)
SYSTEM = "คุณคือผู้วิเคราะห์รีวิวสินค้า ตอบตาม schema เท่านั้น"

def analyze(text):
    try:
        r: Review = llm.invoke([
            {"role": "system", "content": [
                {"type": "text", "text": SYSTEM,
                 "cache_control": {"type": "ephemeral"}}]},   # แคช system → ถูกลง
            {"role": "user", "content": text}])
        return r.model_dump()
    except Exception as e:                       # LLM พัง → ค่ากลางปลอดภัย
        return {"sentiment": "neutral", "score": 0, "reason": f"fail:{e}"}

print(analyze("ของดีมาก ส่งไว ใช้แล้วประทับใจ"))
# {'sentiment': 'positive', 'score': 92, 'reason': '...'}`, cap: "structured output + prompt caching + max_tokens + fallback ครบในไฟล์เดียว", lang: "py" },
      { ul: [
        "`Review` — บังคับรูปแบบผล (Literal/Field คุมค่า) ได้ object ไม่ต้อง parse",
        "`cache_control: ephemeral` — แคช system prompt ที่คงที่ ลด cost",
        "`max_tokens=200, temperature=0` — คุม output + ให้ผลนิ่ง",
        "try/except — fallback ตั้งแต่แรก ระบบไม่พังเมื่อ LLM ล่ม",
      ]},
      { h: "checklist เรียก LLM แบบ production" },
      { ul: [
        "ตั้ง `model`, `max_tokens`, `temperature` ให้ชัด",
        "ใช้ `.with_structured_output(Schema)` ทุกครั้งที่ต้องเอาผลไปใช้ต่อ",
        "แคช system prompt ที่คงที่ด้วย `cache_control`",
        "ห่อด้วย try/except + fallback ที่สมเหตุสมผล",
        "ลด token ก่อนส่ง: สรุป (Haiku), คัด (vector), บีบช่องว่าง",
        "log token usage (`_last_usage`) ให้ accountant อ่าน",
      ]},
      { h: "ออกแบบ context window ให้เหมาะกับงาน" },
      { table: { head: ["งาน", "ใส่ context แค่ไหน", "เหตุผล"], rows: [
        ["สรุปข่าว", "ข่าวดิบ (ครั้งเดียว)", "งานง่าย Haiku ก็พอ"],
        ["วิเคราะห์ sentiment", "สรุป + top-3 ที่เกี่ยว", "ไม่ต้องยัดข่าวทั้งหมด"],
        ["ตัดสินใจเทรด", "ผลสรุปของ agent อื่น + บทเรียน RAG", "ใส่เฉพาะข้อสรุป ไม่ใช่ raw"],
      ]}},
      { note: "หลักคิด: **ใส่ให้น้อยที่สุดเท่าที่ยังตอบถูก** — ทุก token ที่ตัดออกได้คือเงินและความเร็วที่ได้คืน และช่วยให้โมเดลโฟกัสจุดสำคัญ" },
    ],
    tricks: [
      { h: "ทริค 1: บีบ JSON system prompt" },
      { p: "`json.dumps(..., separators=(',',':'))` ตัดช่องว่างทั้งหมด — system prompt ยาว ๆ ประหยัด token ได้จริงโดยความหมายไม่เปลี่ยน" },
      { h: "ทริค 2: สรุปด้วยโมเดลถูกก่อนส่งโมเดลแพง" },
      { p: "news_cache ใช้ Haiku ย่อข่าวก่อน แล้วค่อยส่งสรุปให้ Sonnet — ลด token ของ Sonnet ~83%. 'pre-summarization' เป็นเทคนิคลด cost ที่ได้ผลมาก" },
      { h: "ทริค 3: schema ผอม = output ถูก" },
      { p: "ตัด field ที่ไม่ได้ใช้ออกจาก output schema. ทุก field ที่ LLM ต้องสร้างคือ token ที่จ่าย — เก็บเฉพาะที่ downstream ใช้จริง" },
      { h: "ทริค 4: Literal + Field กันค่าเพี้ยน" },
      { p: "`Literal[...]` บังคับให้ตอบได้เฉพาะค่าที่กำหนด, `Field(ge, le)` คุมช่วงเลข — ลด hallucination ที่ระดับ schema เลย ไม่ต้องมา validate เอง" },
      { h: "ทริค 5: cache เฉพาะส่วนที่นิ่ง" },
      { p: "แคช system prompt (คงที่) แต่ไม่แคช user message (เปลี่ยนทุกรอบ) — วางของที่ซ้ำไว้ต้น prompt เพื่อให้ cache hit สูงสุด" },
    ],
    eval: [
      { qa: [
        { q: "context window คืออะไร?", a: "จำนวน token สูงสุดที่โมเดลรับได้ต่อครั้ง (input+output รวมกัน) — เหมือนโต๊ะทำงาน ของบนโต๊ะเท่านั้นที่โมเดลเห็น เกินต้องตัดทิ้ง" },
        { q: "ทำไม output token แพงกว่า input?", a: "การสร้างคำใหม่ใช้ compute มากกว่าการอ่าน — จึงคุมด้วย max_tokens และขอผลสั้น/schema ผอม" },
        { q: "structured output ดียังไง?", a: "บังคับ schema (pydantic) → ได้ object field ครบ type ถูกเสมอ ไม่ต้อง parse ข้อความอิสระ ลด bug และ hallucination" },
        { q: "prompt caching ช่วยอะไร?", a: "แคชส่วน prompt ที่ซ้ำทุกครั้ง (เช่น system prompt) จ่ายเต็มครั้งแรก ครั้งต่อไปถูกลงมาก — ใส่ cache_control:ephemeral" },
        { q: "เลือกโมเดลตามงานยังไง?", a: "งานง่าย/ปริมาณมาก (สรุป) ใช้โมเดลถูกเร็ว (Haiku); งานยาก/ตัดสินใจ ใช้โมเดลฉลาดกว่า (Sonnet) — ระบบนี้ทำทั้งสอง" },
        { q: "temperature=0 ใช้เมื่อไร?", a: "งานที่ต้องการผลคงเส้นคงวา/ตัดสินใจ เช่นทุก agent ในระบบเทรด; งานสร้างสรรค์ใช้ค่าสูงกว่า" },
        { q: "ออกแบบ token budget ให้เหมาะกับงานยังไง?", a: "ใส่ context น้อยสุดเท่าที่ยังตอบถูก: สรุปด้วยโมเดลถูก, คัดด้วย vector search, บีบช่องว่าง, ตัด field ที่ไม่ใช้, ตั้ง max_tokens" },
        { q: "ถ้า LLM ตอบเพี้ยน/ล่ม ทำยังไง?", a: "ห่อ try/except แล้วคืนค่า fallback ที่ปลอดภัย (เช่น NEUTRAL conf 0) เพื่อให้ทั้งระบบเดินต่อได้" },
      ]},
    ],
  },
});
window.EXTRA_FLOWS.ai_llm = {
  input: "analyze_sentiment(news_data, chart_data)  ← analyst.py",
  steps: [
    { fn: "analyze_sentiment()", file: "agents/analyst.py", depth: 0, note: "จุดเริ่ม: รับข่าว+บริบทกราฟ เพื่อสรุป sentiment", data: "news_data={tweets,calendar}, chart_data={signal:BUY}", vars: [
      { n: "tweets / calendar", d: "ข่าวดิบที่ต้องย่อยก่อนส่ง LLM" },
      { n: "has_any", v: "True", d: "มีข่าวไหม ไม่มี → คืน NEUTRAL ทันที", w: true } ] },
    { fn: "_build_market_context()", file: "agents/analyst.py", depth: 1, note: "สร้าง query string สำหรับ vector search จากกราฟ", data: "→ 'BUY signal BULLISH trend ... confidence 72%'", vars: [
      { n: "market_ctx", v: "\"BUY signal...\"", d: "query ไปค้นข่าวที่เกี่ยว (RAG)", w: true } ] },
    { fn: "get_news_context()", file: "agents/news_cache.py", depth: 1, note: "ลด token: Haiku สรุปข่าว + vector ค้น top-3 ที่เกี่ยว", data: "→ summary(~250 tok) + relevant[3]", vars: [
      { n: "summary", d: "ข่าวย่อด้วย Haiku (โมเดลถูก)", w: true },
      { n: "relevant", d: "top-3 ข่าวที่ตรง context (คัดด้วย vector)", w: true },
      { n: "token_estimate", v: "~", d: "กะ token ที่จะส่งให้ Sonnet" } ] },
    { fn: "build user_message", file: "agents/analyst.py", depth: 1, note: "ประกอบ prompt: regime + summary + relevant + calendar", data: "user_message (สั้นกว่าส่ง raw มาก)", vars: [
      { n: "user_message", d: "ส่วนที่เปลี่ยนทุกรอบ (ไม่แคช)", w: true },
      { n: "SYSTEM_PROMPT", d: "กติกาคงที่ → ติด cache_control ephemeral" } ] },
    { fn: "_llm.invoke(messages)", file: "agents/analyst.py", depth: 1, note: "เรียก Sonnet แบบ structured output (temperature=0, max_tokens=300)", data: "messages=[system(cached), user]", vars: [
      { n: "parsed", v: "AnalystOutput(...)", d: "object พร้อมใช้ (sentiment/confidence/bias)", w: true } ] },
    { fn: "parse → result / fallback", file: "agents/analyst.py", depth: 2, note: "สำเร็จ → ดึง field; พัง → fallback NEUTRAL conf 0", data: "→ {sentiment:'BULLISH', confidence:65, bias:'BUY'}", vars: [
      { n: "result", v: "{sentiment:BULLISH,...}", d: "ผลที่ส่งต่อให้ decision_maker", w: true } ] },
  ],
};

/* ===================== AI VECTOR DB & EMBEDDINGS ===================== */
window.TEACHING_DATA.push({
  id: "ai_vector",
  name: "Embeddings & Vector DB — ค้นด้วยความหมาย",
  tag: { th: "เปลี่ยนข้อความเป็นเวกเตอร์ตัวเลข แล้วค้นด้วย 'ความหมาย' ไม่ใช่คำตรงตัว: embedding, cosine similarity, มิติของเวกเตอร์, pgvector และ ANN search — อิงโค้ด news_cache.py จริง", en: "Turn text into number vectors and search by meaning, not keywords: embeddings, cosine similarity, dimensions, pgvector and ANN search — grounded in real news_cache.py" },
  accent: "#c084fc",
  sections: {
    principle: [
      { h: "ปัญหาที่ embedding มาแก้" },
      { p: "การค้นแบบคำตรงตัว (keyword) หา 'ความหมายที่ใกล้กัน' ไม่ได้ — ค้น \"ดอลลาร์อ่อน\" จะไม่เจอ \"USD weakens\" ทั้งที่หมายความเหมือนกัน. **embedding** แก้ตรงนี้: เปลี่ยนข้อความเป็น **เวกเตอร์ตัวเลข** ที่ข้อความความหมายใกล้กัน → เวกเตอร์อยู่ใกล้กันในปริภูมิ" },
      { h: "embedding คืออะไร (ภาพ)" },
      { code: String.raw`"USD weakening, gold bullish"  → [0.12, -0.84, 0.33, ... ]  (768 หรือ 3072 ตัวเลข)
"dollar falls, gold rises"     → [0.10, -0.81, 0.35, ... ]  ← ใกล้กันมาก
"weather is sunny today"       → [0.77,  0.20, -0.6, ... ]  ← อยู่ไกล`, cap: "ข้อความ → เวกเตอร์; ความหมายใกล้ = ระยะใกล้", lang: "txt" },
      { h: "ใช้จริงในระบบเทรดยังไง" },
      { p: "ระบบเก็บข่าวแต่ละชิ้นเป็นเวกเตอร์ (`news_embeddings`). พอจะวิเคราะห์ตลาด มันสร้าง query เวกเตอร์จากบริบทกราฟ (\"BUY signal BULLISH trend\") แล้วค้นหาข่าว **top-3 ที่ความหมายใกล้ที่สุด** มาป้อนให้ analyst — ไม่ต้องส่งข่าวทั้งหมด" },
      { note: "นี่คือครึ่งแรกของ RAG — 'การค้นหา' (retrieval). หน้า RAG จะเอาผลค้นนี้ไปเสริม prompt ต่อ" },
      { h: "ทำไมต้องมี Vector DB แยก" },
      { ul: [
        "เวกเตอร์มีหลายร้อย-พันมิติ × ข้อมูลเป็นล้านแถว → ค้นแบบเทียบทุกคู่ช้าเกิน",
        "Vector DB (เช่น **pgvector** บน Postgres/Supabase) มี index เฉพาะ (ANN) ค้นเพื่อนบ้านใกล้สุดได้เร็ว",
        "เก็บเวกเตอร์ + metadata (แหล่งข่าว, เวลา) ไว้ด้วยกัน กรองก่อนค้นได้",
      ]},
    ],
    theory: [
      { h: "1) มิติ (dimension) ของเวกเตอร์" },
      { p: "embedding model แต่ละตัวให้เวกเตอร์ขนาดต่างกัน. Gemini ให้ได้ถึง 3072 มิติ. **มิติมาก = ละเอียดแต่เปลือง storage/ช้า**. ลดมิติได้ด้วย `output_dimensionality`:" },
      { code: String.raw`# news_cache.py — ใช้เต็ม 3072 มิติ
_EMBED_DIM = 3072

# lesson_store.py — ลดเหลือ 768 มิติ เพื่อประหยัด
_EMBED_DIM = 768   # ลดจาก 3072 ด้วย output_dimensionality`, cap: "เลือกมิติตามงาน: ข่าวเยอะใช้เต็ม, บทเรียนน้อยลดมิติได้", lang: "py" },
      { h: "2) cosine similarity — วัดความใกล้" },
      { p: "วัดความเหมือนของเวกเตอร์ 2 ตัวด้วย **มุมระหว่างมัน** (ไม่สนความยาว). ค่า 1 = ทิศเดียวกัน (เหมือนมาก), 0 = ตั้งฉาก (ไม่เกี่ยว), -1 = ตรงข้าม. Vector DB ค้นโดยหาเวกเตอร์ที่ cosine สูงสุดกับ query" },
      { h: "3) task_type — embed ต่างกันตอน store กับ query" },
      { p: "embedding model ดี ๆ ให้บอกว่ากำลัง embed 'เอกสารเพื่อเก็บ' หรือ 'คำค้น' — ทำให้ผลค้นแม่นขึ้น. โค้ดจริงแยกชัด:" },
      { code: String.raw`# ตอนเก็บข่าวลง DB
_embed(content, task_type="RETRIEVAL_DOCUMENT")
# ตอนค้น
_embed(query,   task_type="RETRIEVAL_QUERY")`, cap: "ใช้ task_type คนละค่าระหว่าง store กับ search (news_cache.py / lesson_store.py)", lang: "py" },
      { h: "4) ANN — หาเพื่อนบ้านใกล้สุดแบบเร็ว" },
      { p: "การหา 'k ตัวที่ใกล้สุด' แบบเทียบทุกแถว (exact kNN) ช้าเมื่อข้อมูลใหญ่. **ANN (Approximate Nearest Neighbor)** ยอมพลาดเล็กน้อยเพื่อความเร็วมหาศาล — เป็นหัวใจของ index ใน pgvector (เช่น HNSW/IVFFlat)" },
      { h: "5) pgvector — vector อยู่ใน Postgres" },
      { p: "แทนที่จะมี DB แยก ระบบนี้ใช้ **pgvector** บน Supabase: คอลัมน์ชนิด vector เก็บใน table ปกติ แล้วค้นผ่าน RPC function. ได้ประโยชน์ของ SQL (join/filter) + vector search ในที่เดียว" },
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Google — Embeddings guide (Gemini API)", url: "https://ai.google.dev/gemini-api/docs/embeddings", note: "embed_content + task_type ที่ใช้จริง" },
        { label: "pgvector (GitHub)", url: "https://github.com/pgvector/pgvector", note: "vector type + index บน Postgres/Supabase" },
        { label: "Supabase — Vector columns", url: "https://supabase.com/docs/guides/ai/vector-columns", note: "เก็บ/ค้น embedding บน Supabase" },
        { label: "Cosine similarity (Wikipedia)", url: "https://en.wikipedia.org/wiki/Cosine_similarity", note: "คณิตของการวัดความใกล้" },
        { label: "What are embeddings? (Cloudflare)", url: "https://developers.cloudflare.com/workers-ai/features/embeddings/", note: "อธิบาย embedding แบบเข้าใจง่าย" },
      ]},
      { h: "🎬 วิดีโอสอน (เจาะลึก)" },
      { links: [
        { label: "Embeddings & Vector Databases Explained", url: "https://www.youtube.com/watch?v=rw1YfQQttfo", note: "ความหมาย→คณิต→ค้น ครบ" },
        { label: "Postgres As A Vector Database (pgvector, billion-scale)", url: "https://www.youtube.com/watch?v=Xfv4hCWvkp0", note: "pgvector ระดับ production" },
        { label: "Vector Search with Embeddings and Cosine Similarity", url: "https://www.youtube.com/watch?v=5VH3qJYKK34", note: "cosine + similarity search" },
        { label: "Vector DB + Hugging Face + FAISS (Cosine)", url: "https://www.youtube.com/watch?v=FacFdclxXzg", note: "hands-on FAISS" },
      ]},
    ],
    foundations: [
      { h: "สร้าง embedding (โค้ดจริง)" },
      { code: String.raw`def _embed(text, task_type="RETRIEVAL_DOCUMENT"):
    client = _get_gemini_client()
    if not client:
        return None                      # ไม่มี key → ข้าม (ระบบยังเดินได้)
    result = client.models.embed_content(
        model="models/gemini-embedding-001",
        contents=text[:2000],            # ตัดความยาวกัน input บานปลาย
        config=types.EmbedContentConfig(task_type=task_type),
    )
    return result.embeddings[0].values   # list[float] ความยาว = มิติ`, cap: "news_cache.py จริง — คืน list ของ float (เวกเตอร์)", lang: "py" },
      { h: "schema การเก็บใน Supabase" },
      { table: { head: ["table", "คอลัมน์สำคัญ", "หน้าที่"], rows: [
        ["news_cache", "content_hash, summary, expires_at", "สรุปข่าว + TTL"],
        ["news_embeddings", "cache_id, source, content, **embedding**", "เวกเตอร์ต่อข่าว 1 ชิ้น"],
        ["trade_lessons", "mistake_type, pattern, **embedding**, frequency", "บทเรียน + เวกเตอร์"],
      ]}},
      { h: "เก็บข่าวทีละชิ้นเป็นเวกเตอร์" },
      { code: String.raw`for source, content in items:           # twitter / forexfactory / investing
    emb = _embed(content, task_type="RETRIEVAL_DOCUMENT")
    row = {"cache_id": cache_id, "source": source, "content": content}
    if emb:
        row["embedding"] = emb
    db.table("news_embeddings").insert(row).execute()`, cap: "_store_cache() จริง — embed ทุกข่าวแล้ว insert พร้อมเวกเตอร์", lang: "py" },
      { note: "สังเกต: ถ้า embed ไม่สำเร็จก็ยัง insert ข้อความไว้ (ไม่มี embedding) — ระบบ degrade ได้ ไม่พังทั้งก้อน" },
    ],
    architecture: [
      { h: "เส้นทาง 2 ทิศของ vector" },
      { code: String.raw`STORE (ตอนข่าวเข้า):
  ข่าวดิบ → _embed(RETRIEVAL_DOCUMENT) → insert news_embeddings

SEARCH (ตอนวิเคราะห์):
  market context → _embed(RETRIEVAL_QUERY) → RPC search → top-N`, cap: "store ใช้ DOCUMENT, search ใช้ QUERY — คนละ task_type", lang: "txt" },
      { h: "ค้นผ่าน RPC (ฝั่ง DB คำนวณ cosine)" },
      { code: String.raw`def vector_search(query, top_n=3):
    query_emb = _embed(query, task_type="RETRIEVAL_QUERY")
    res = _get_db().rpc("search_news_relevant", {
        "query_embedding": query_emb,
        "match_count":     top_n,
    }).execute()
    return [row["content"] for row in (res.data or [])]`, cap: "news_cache.py — ส่งเวกเตอร์ query ให้ Postgres หา top-N ที่ cosine สูงสุด", lang: "py" },
      { p: "งานหนัก (เทียบเวกเตอร์ล้านแถว) ทำใน DB ด้วย index — Python แค่ส่ง query เวกเตอร์ไปแล้วรับ top-N กลับมา" },
    ],
    dataflow: [
      { h: "ตั้งแต่ข้อความถึงผลค้น" },
      { code: String.raw`query = "BUY signal BULLISH trend H4 resistance"
   │
   ├─ _embed(query, RETRIEVAL_QUERY)
   │     → [0.11, -0.83, ...] (เวกเตอร์ query)
   │
   ├─ rpc("search_news_relevant", {query_embedding, match_count:3})
   │     → DB คำนวณ cosine กับทุกแถว news_embeddings
   │     → เรียงจากใกล้→ไกล เอา 3 อันแรก
   │
   └─ ["@trader: Fed signals cut...", "Gold breaks 2400...", ...]`, cap: "input คือข้อความ → output คือข่าวที่ 'ความหมายใกล้' 3 อันดับแรก", lang: "txt" },
      { note: "ดู interactive ที่แท็บ Visualizer ▶ — ไล่ตั้งแต่ข้อความ → เวกเตอร์ → ค้น → ผล" },
    ],
    implementation: [
      { h: "🧪 ตัวอย่างใช้งานครบ (คัดลอกไปลองได้)" },
      { p: "โครงสร้าง: `embed()` (โมเดลในเครื่อง ฟรี) → `TinyVectorStore` เก็บเวกเตอร์ → `search()` ค้นด้วย cosine (normalize แล้ว = dot product) คืน top-k" },
      { code: String.raw`# pip install sentence-transformers numpy
import numpy as np
from sentence_transformers import SentenceTransformer
model = SentenceTransformer("all-MiniLM-L6-v2")   # 384-dim รันในเครื่อง ไม่ต้องมี key

def embed(texts):
    return model.encode(texts, normalize_embeddings=True)   # normalize → cosine=dot

class TinyVectorStore:
    def __init__(self):
        self.vecs = None
        self.docs = []
    def add(self, docs):
        self.docs += docs
        v = embed(docs)
        self.vecs = v if self.vecs is None else np.vstack([self.vecs, v])
    def search(self, query, k=3):
        q = embed([query])[0]
        sims = self.vecs @ q                       # cosine similarity ทุกแถว
        idx = sims.argsort()[::-1][:k]             # เรียงมาก→น้อย เอา k อันแรก
        return [(self.docs[i], float(sims[i])) for i in idx]

vs = TinyVectorStore()
vs.add(["แมวชอบนอน", "ดอลลาร์อ่อนทองขึ้น", "หมาเห่าเสียงดัง", "เงินเฟ้อกระทบทองคำ"])
for doc, score in vs.search("ราคาทองคำ", k=2):
    print(f"{score:.3f}  {doc}")
# 0.52  เงินเฟ้อกระทบทองคำ
# 0.48  ดอลลาร์อ่อนทองขึ้น`, cap: "vector store จิ๋วครบวงจร: embed → store → cosine search (สลับ embed เป็น API ค่ายไหนก็ได้)", lang: "py" },
      { ul: [
        "`normalize_embeddings=True` — ทำให้ cosine = dot product (คูณเวกเตอร์ตรง ๆ)",
        "`self.vecs @ q` — คำนวณความใกล้ของ query กับทุกเอกสารพร้อมกัน",
        "`argsort()[::-1][:k]` — เอา index ที่ใกล้สุด k อันดับ",
        "ขึ้น production → ย้ายไป pgvector/FAISS แทน list ในหน่วยความจำ",
      ]},
      { h: "checklist ทำ vector search" },
      { ul: [
        "เลือก embedding model + มิติให้เหมาะ (ข้อมูลเยอะ/ละเอียด = มิติมาก)",
        "embed ตอน store ด้วย DOCUMENT, ตอน search ด้วย QUERY",
        "ตัดความยาว input ก่อน embed (`text[:2000]`) กันบานปลาย",
        "เก็บ embedding + metadata (source/time) ไว้ด้วยกันเพื่อ filter",
        "ให้ DB คำนวณ similarity (RPC) อย่าดึงทุกแถวมาเทียบใน Python",
        "เผื่อ fallback เมื่อไม่มี key/embed พลาด",
      ]},
      { h: "ข้อควรระวัง" },
      { table: { head: ["พลาด", "ผลที่เกิด"], rows: [
        ["ใช้คนละ model store กับ query", "เวกเตอร์อยู่คนละปริภูมิ ค้นมั่ว"],
        ["ลืม task_type", "ผลค้นแม่นน้อยลง"],
        ["embed ข้อความยาวเกิน", "ช้า/แพง — ควรตัดหรือ chunk"],
        ["ไม่มี index", "ค้นช้ามากเมื่อข้อมูลโต"],
      ]}},
    ],
    tricks: [
      { h: "ทริค 1: ลดมิติเมื่อข้อมูลน้อย" },
      { p: "บทเรียน (lesson_store) มีไม่เยอะ จึงลดมิติเหลือ 768 ด้วย `output_dimensionality` — เร็วและประหยัด storage โดยคุณภาพค้นยังพอ" },
      { h: "ทริค 2: pre-filter ก่อน vector" },
      { p: "lesson_store กรองด้วย metadata (direction+trend) ก่อน แล้วค่อย cosine — ลดจำนวนแถวที่ต้องเทียบ เร็วขึ้นและตรงขึ้น (ดูต่อหน้า RAG)" },
      { h: "ทริค 3: ตัด input ก่อน embed เสมอ" },
      { p: "`contents=text[:2000]` — embedding ของข้อความสั้นกระชับมักดีกว่าข้อความยาวเฟ้อ และคุม cost ได้" },
      { h: "ทริค 4: degrade ได้เมื่อไม่มี embedding" },
      { p: "ถ้า embed พลาด ยัง insert ข้อความไว้ (ไม่มีเวกเตอร์) — ข้อมูลไม่หาย แค่ค้นด้วย vector ไม่เจอชิ้นนั้น ระบบไม่ล่ม" },
    ],
    eval: [
      { qa: [
        { q: "embedding คืออะไร?", a: "การเปลี่ยนข้อความเป็นเวกเตอร์ตัวเลข ที่ข้อความความหมายใกล้กันจะได้เวกเตอร์อยู่ใกล้กัน → ค้นด้วยความหมายได้" },
        { q: "cosine similarity วัดอะไร?", a: "มุมระหว่างเวกเตอร์ 2 ตัว (1=เหมือนมาก, 0=ไม่เกี่ยว, -1=ตรงข้าม) ไม่สนความยาว — ใช้หาเวกเตอร์ที่ใกล้ query สุด" },
        { q: "ทำไมต้องใช้ task_type ต่างกันตอน store/query?", a: "บอกโมเดลว่ากำลัง embed เอกสารเพื่อเก็บ (DOCUMENT) หรือคำค้น (QUERY) → ผลค้นแม่นขึ้น" },
        { q: "มิติของเวกเตอร์ส่งผลยังไง?", a: "มิติมาก=ละเอียดแต่เปลือง storage/ช้า; ลดได้ด้วย output_dimensionality (โปรเจกต์ใช้ 3072 สำหรับข่าว, 768 สำหรับบทเรียน)" },
        { q: "ANN คืออะไร ต่างจาก kNN ตรงไหน?", a: "ANN หาเพื่อนบ้านใกล้สุดแบบประมาณ (ยอมพลาดนิดเพื่อเร็วมาก) ส่วน exact kNN เทียบทุกแถว ช้าเมื่อข้อมูลใหญ่" },
        { q: "pgvector คืออะไร?", a: "extension ของ Postgres ที่เพิ่มชนิด vector + index ANN — เก็บและค้นเวกเตอร์ใน SQL ได้ (ระบบนี้ใช้ผ่าน Supabase)" },
        { q: "ทำไมให้ DB คำนวณ similarity แทน Python?", a: "ข้อมูลอาจล้านแถว — DB มี index ค้นเร็ว; Python แค่ส่ง query เวกเตอร์แล้วรับ top-N กลับ" },
        { q: "vector search เกี่ยวกับ RAG ยังไง?", a: "มันคือขั้น 'retrieval' (ค้นหา) ของ RAG — หาข้อมูลที่เกี่ยวมาก่อน แล้ว RAG จะเอาไปเสริม prompt ตอน generate" },
      ]},
    ],
  },
});
window.EXTRA_FLOWS.ai_vector = {
  input: "vector_search('BUY signal BULLISH trend', top_n=3)  ← news_cache.py",
  steps: [
    { fn: "vector_search()", file: "agents/news_cache.py", depth: 0, note: "รับ query ข้อความ ต้องการข่าวที่ความหมายใกล้สุด", data: "query = 'BUY signal BULLISH trend H4 resistance'", vars: [
      { n: "query", v: "\"BUY signal...\"", d: "บริบทตลาดปัจจุบันเป็นข้อความ" } ] },
    { fn: "_get_gemini_client()", file: "agents/news_cache.py", depth: 1, note: "เช็ค key — ไม่มี → คืน [] (degrade)", data: "client หรือ None", vars: [
      { n: "client", d: "ไม่มี GEMINI_API_KEY → ข้าม vector ทั้งหมด" } ] },
    { fn: "_embed(query, RETRIEVAL_QUERY)", file: "agents/news_cache.py", depth: 1, note: "แปลง query เป็นเวกเตอร์ (task_type=QUERY)", data: "→ [0.11, -0.83, 0.30, ...]", vars: [
      { n: "query_emb", v: "list[float]", d: "เวกเตอร์ของคำค้น", w: true },
      { n: "task_type", v: "RETRIEVAL_QUERY", d: "ต่างจากตอน store (DOCUMENT)" } ] },
    { fn: "rpc('search_news_relevant')", file: "Supabase / pgvector", depth: 1, note: "DB คำนวณ cosine กับทุกแถว แล้วเอา top-N", data: "{query_embedding, match_count:3}", vars: [
      { n: "match_count", v: "3", d: "จำนวนผลที่ต้องการ" },
      { n: "(index)", d: "ANN index หาเพื่อนบ้านใกล้สุดเร็ว ๆ" } ] },
    { fn: "เก็บผล content", file: "agents/news_cache.py", depth: 1, note: "ดึงเฉพาะข้อความข่าวจากแถวที่ใกล้สุด", data: "→ ['@trader: Fed signals cut...', ...]", vars: [
      { n: "items", v: "[str, str, str]", d: "ข่าว 3 อันดับที่ความหมายใกล้ query", w: true } ] },
  ],
};

/* ===================== AI RAG ===================== */
window.TEACHING_DATA.push({
  id: "ai_rag",
  name: "RAG — ดึงข้อมูลจริงมาเสริมก่อนตอบ",
  tag: { th: "Retrieval-Augmented Generation: ค้นข้อมูลที่เกี่ยว (vector) → ยัดเข้า prompt → ให้ LLM ตอบจากข้อมูลจริง ลด hallucination. มี hybrid search, การ inject context และวัดผล Recall@k — อิง lesson_store.py + news_cache.py", en: "Retrieval-Augmented Generation: retrieve relevant data (vector) → inject into the prompt → let the LLM answer from real facts. Covers hybrid search, context injection and Recall@k evaluation — grounded in lesson_store.py + news_cache.py" },
  accent: "#fbbf24",
  sections: {
    principle: [
      { h: "RAG แก้ปัญหาอะไร" },
      { p: "LLM รู้แค่สิ่งที่ถูกเทรนมา (มี cutoff) และ 'เดาคำ' จึง hallucinate ได้. **RAG (Retrieval-Augmented Generation)** แก้ด้วยการ **ค้นข้อมูลจริงที่เกี่ยวกับคำถาม แล้วยัดเข้า prompt ก่อนให้ LLM ตอบ** — โมเดลตอบจากข้อมูลที่เราป้อน ไม่ใช่จากความจำล้วน ๆ" },
      { h: "สมการง่าย ๆ ของ RAG" },
      { code: String.raw`RAG = Retrieve (ค้น) + Augment (เสริม prompt) + Generate (ให้ LLM ตอบ)

คำถาม ─► ค้นข้อมูลที่เกี่ยว ─► เอามาแปะใน prompt ─► LLM ตอบจากข้อมูลนั้น`, cap: "หัวใจ: เอา 'ข้อมูลจริงที่เกี่ยว' มาวางตรงหน้าโมเดลก่อนถาม", lang: "txt" },
      { h: "RAG 2 จุดในระบบเทรดจริง" },
      { table: { head: ["ที่", "ค้นอะไร", "เอาไปเสริม prompt ใคร"], rows: [
        ["news_cache.py", "ข่าวที่เกี่ยวกับบริบทตลาด (vector)", "analyst (วิเคราะห์ sentiment)"],
        ["lesson_store.py", "บทเรียน/ความผิดพลาดที่คล้ายอดีต", "decision_maker (ก่อนตัดสินใจ)"],
      ]}},
      { p: "ตัวอย่าง: ก่อนตัดสินใจเทรด ระบบค้น 'ความผิดพลาดคล้าย ๆ ที่เคยเกิด' มาเตือน Claude — เหมือนให้ดูบันทึกบทเรียนก่อนลงมือ" },
      { note: "RAG = vector search (หน้า Vector DB) + การ inject context เข้า prompt (หน้านี้) + วัดผลว่าค้นแม่นไหม (Recall@k)" },
    ],
    theory: [
      { h: "1) Chunking — หั่นเอกสารก่อนเก็บ" },
      { p: "เอกสารยาวต้องหั่นเป็นชิ้น (chunk) ก่อน embed เพราะ (ก) embedding ของข้อความสั้นแม่นกว่า (ข) ใส่กลับเข้า context ได้พอดี. โปรเจกต์ RAG ของ 42 ('RAG against the machine') ระบุ chunk ด้วยช่วงตัวอักษร `first_character_index`/`last_character_index`" },
      { code: String.raw`{
  "file_path": "path/to/file",
  "first_character_index": 0,
  "last_character_index": 500     ← chunk = ช่วงตัวอักษร 0..500
}`, cap: "รูปแบบ chunk จาก subject RAG against the machine", lang: "json" },
      { h: "2) Retrieve — ค้นชิ้นที่เกี่ยว" },
      { p: "embed คำถาม → vector search หา chunk ที่ cosine สูงสุด (ดูกลไกในหน้า Vector DB). ได้ 'top-k sources' ที่น่าจะมีคำตอบ" },
      { h: "3) Augment — ยัด context เข้า prompt" },
      { p: "เอา chunk ที่ค้นได้มา **format เป็นข้อความแล้วแทรกใน prompt**. โค้ดจริงมีฟังก์ชันเฉพาะแปลงบทเรียนเป็น text block:" },
      { code: String.raw`def format_lessons_for_prompt(lessons):
    lines = ["⚠ Similar past mistakes (review before deciding):"]
    for L in lessons[:3]:
        lines.append(f"  [x{L['frequency']}] {L['mistake_type']}: {L['pattern']}")
        lines.append(f"    → {advice}")     # คำแนะนำต่อความผิดแบบนั้น
    return "\n".join(lines)`, cap: "lesson_store.py — แปลงผลค้นเป็น context ที่ inject เข้า decision_maker prompt (~150 token)", lang: "py" },
      { h: "4) Hybrid search — ไม่ได้ใช้ vector อย่างเดียว" },
      { p: "vector อย่างเดียวบางทีไม่พอ. lesson_store ใช้ **hybrid 3 ชั้น**: pre-filter ด้วย metadata → cosine → ถ่วงน้ำหนักด้วยความถี่+ความใหม่" },
      { code: String.raw`Hybrid search:
  1. pre-filter (direction + trend ตรงกัน)      ← ตัดของไม่เกี่ยวทิ้งก่อน
  2. cosine similarity (vector)                  ← วัดความใกล้ความหมาย
  3. weighted score = cosine × frequency × recency  ← ผิดบ่อย/เพิ่งเกิด = สำคัญกว่า`, cap: "lesson_store.py docstring จริง — รวมหลายสัญญาณให้ผลตรงงานขึ้น", lang: "txt" },
      { h: "5) วัดผล RAG ด้วย Recall@k" },
      { p: "RAG ดีไหมวัดที่ **การค้น**: **Recall@k** = ในคำตอบที่ถูกต้อง เราค้นเจอมาอยู่ใน k อันดับแรกกี่ %. โปรเจกต์ 42 ตั้งเกณฑ์ผ่าน Recall@5 ≥ 50% (code) / ≥ 80% (docs)" },
      { table: { head: ["metric", "ความหมาย"], rows: [
        ["Recall@1", "คำตอบถูกอยู่ที่อันดับ 1 กี่ %"],
        ["Recall@5", "คำตอบถูกอยู่ใน 5 อันดับแรกกี่ %"],
        ["Recall@10", "คำตอบถูกอยู่ใน 10 อันดับแรกกี่ %"],
      ]}},
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Anthropic — RAG / retrieval", url: "https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation", note: "แนวทางทำ RAG กับ Claude" },
        { label: "Anthropic — Contextual Retrieval", url: "https://www.anthropic.com/news/contextual-retrieval", note: "เทคนิคทำ retrieval ให้แม่นขึ้น (hybrid/rerank)" },
        { label: "Pinecone — RAG learning center", url: "https://www.pinecone.io/learn/retrieval-augmented-generation/", note: "อธิบาย RAG ครบตั้งแต่ chunk ถึง generate" },
        { label: "Evaluation: Recall (Wikipedia)", url: "https://en.wikipedia.org/wiki/Precision_and_recall", note: "นิยาม recall ที่ Recall@k ต่อยอดมา" },
        { label: "Chunking strategies (Pinecone)", url: "https://www.pinecone.io/learn/chunking-strategies/", note: "วิธีหั่นเอกสารก่อน embed" },
      ]},
      { h: "🎬 วิดีโอสอน (เจาะลึก)" },
      { links: [
        { label: "RAG Fundamentals and Advanced Techniques – Full Course (freeCodeCamp)", url: "https://www.youtube.com/watch?v=ea2W8IogX80", note: "คอร์สเต็ม ละเอียดสุด" },
        { label: "Learn RAG From Scratch (จาก LangChain Engineer)", url: "https://www.youtube.com/watch?v=sVcwVQRHIc8", note: "สอนโดยวิศวกร LangChain" },
        { label: "RAG Full Course | Document Loaders → Multi-Doc RAG", url: "https://www.youtube.com/watch?v=ioveHOLLcO0", note: "ครบตั้งแต่โหลดเอกสาร" },
        { label: "Complete RAG Crash Course with LangChain (2 ชม.)", url: "https://www.youtube.com/watch?v=o126p1QN_RI", note: "crash course แบบลงมือ" },
      ]},
    ],
    foundations: [
      { h: "ส่วนประกอบของ RAG pipeline" },
      { table: { head: ["ขั้น", "ทำอะไร", "โค้ดจริง"], rows: [
        ["Index (offline)", "หั่น+embed+เก็บ", "_store_cache(), store_lesson()"],
        ["Retrieve", "embed query + vector search", "vector_search(), search_lessons()"],
        ["Rank", "ถ่วงน้ำหนัก/คัด top-k", "weighted score ใน RPC"],
        ["Augment", "format เป็น context", "format_lessons_for_prompt()"],
        ["Generate", "LLM ตอบจาก context", "decision_maker / analyst"],
      ]}},
      { h: "เก็บความรู้แบบ dedup + นับความถี่" },
      { p: "lesson_store ไม่ insert ซ้ำ — ถ้า pattern เดิม (mistake_type+direction+trend) เกิดใน 30 วัน จะ **เพิ่ม frequency** แทน. ความผิดที่เกิดบ่อย = น้ำหนักมากตอนค้น" },
      { code: String.raw`if existing.data:                       # เคยเจอ pattern นี้
    new_freq = old["frequency"] + 1     # นับเพิ่มแทน insert ใหม่
    new_avg  = rolling_average(old, pnl)
    db.table("trade_lessons").update({...}).eq("id", old["id"]).execute()`, cap: "store_lesson() จริง — dedup + rolling average PnL", lang: "py" },
      { note: "ความรู้มี TTL: lesson หมดอายุ 90 วัน (`_LESSON_TTL_DAYS`) แล้วถูก cleanup — กันความรู้เก่าค้างมารบกวนการตัดสินใจ" },
    ],
    architecture: [
      { h: "RAG ของ news (analyst)" },
      { code: String.raw`get_news_context(news_data, market_context):
  1. เช็ค cache (hash → latest valid)
  2. MISS → Haiku สรุป + embed + เก็บ
  3. vector_search(market_context) → top-3 ข่าวที่เกี่ยว
  4. return {summary, relevant_items}     → analyst เอาไปแปะใน prompt`, cap: "news_cache.py — รวม caching + summarize + retrieve ในจุดเดียว", lang: "txt" },
      { h: "RAG ของ lessons (decision_maker)" },
      { code: String.raw`search_lessons(context_text, direction, trend, top_k=3):
  1. embed(context_text, RETRIEVAL_QUERY)
  2. rpc("search_trade_lessons", {query_embedding, p_direction, p_trend})
       → pre-filter + cosine + weighted score (ทำใน DB)
  3. format_lessons_for_prompt(lessons)    → แปะเตือนใน decision prompt`, cap: "lesson_store.py — hybrid search แล้ว inject เป็นคำเตือน", lang: "txt" },
      { p: "ทั้งสองจุดมีรูปแบบเดียวกัน: **ค้น → format → แปะ prompt** ต่างกันแค่แหล่งข้อมูลและกลยุทธ์การจัดอันดับ" },
    ],
    dataflow: [
      { h: "RAG บทเรียน: ตั้งแต่ context ถึงคำเตือนใน prompt" },
      { code: String.raw`context = "BUY COUNTER_TREND H4:BEARISH SR:NONE conf:55"
   │
   ├─ _embed(context, RETRIEVAL_QUERY) → query vector
   │
   ├─ rpc search_trade_lessons (pre-filter dir+trend → cosine → score)
   │     → [{mistake:COUNTER_TREND, freq:4, avg_pnl:-30, ...}, ...]
   │
   ├─ format_lessons_for_prompt(lessons)
   │     "⚠ Similar past mistakes:
   │       [x4] COUNTER_TREND: ... avg -30.00
   │         → require conf≥70 or SKIP"
   │
   └─ แปะใน decision_maker prompt → Claude ตัดสินใจโดยเห็นบทเรียนแล้ว`, cap: "ผลลัพธ์: โมเดลตัดสินใจโดยมี 'ความจำความผิดพลาด' ตรงหน้า", lang: "txt" },
      { note: "ดู interactive ที่แท็บ Visualizer ▶ — ไล่ Retrieve → Rank → Augment → Generate" },
    ],
    implementation: [
      { h: "🧪 ตัวอย่างใช้งานครบ (คัดลอกไปลองได้)" },
      { p: "โครงสร้าง: ต่อยอด `TinyVectorStore` (หน้า Vector DB) — retrieve(ค้น) → augment(แปะ context) → generate(LLM ตอบจากข้อมูลจริง)" },
      { code: String.raw`# ต้องมี TinyVectorStore + embed() จากหน้า Vector DB  |  pip install anthropic
import os, anthropic
client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

KB = [
    "บริษัทเปิดทำการ จันทร์-ศุกร์ 9:00-18:00",
    "นโยบายคืนสินค้าภายใน 14 วัน พร้อมใบเสร็จ",
    "ส่งฟรีเมื่อซื้อครบ 500 บาท",
]
vs = TinyVectorStore(); vs.add(KB)

def rag_answer(question, k=2):
    hits = vs.search(question, k=k)                    # 1) RETRIEVE
    context = "\n".join(f"- {d}" for d, _ in hits)     # 2) AUGMENT
    prompt = (f"ใช้ข้อมูลต่อไปนี้ตอบคำถาม ถ้าไม่มีให้บอกว่าไม่ทราบ\n"
              f"ข้อมูล:\n{context}\n\nคำถาม: {question}")
    r = client.messages.create(                        # 3) GENERATE
        model="claude-haiku-4-5-20251001", max_tokens=200,
        messages=[{"role": "user", "content": prompt}])
    return r.content[0].text.strip()

print(rag_answer("คืนของได้กี่วัน?"))
# "คืนได้ภายใน 14 วัน พร้อมใบเสร็จ"`, cap: "RAG จิ๋วครบ 3 ขั้น: retrieve → augment → generate (ตอบจากข้อมูลจริง ไม่เดา)", lang: "py" },
      { ul: [
        "RETRIEVE — vector search หา chunk ที่เกี่ยวกับคำถาม",
        "AUGMENT — เอา chunk มาแปะใน prompt (หัวใจของ RAG)",
        "GENERATE — LLM ตอบโดยอิงข้อมูลที่ให้ ไม่ใช่ความจำล้วน",
        "เพิ่มความแม่น: chunk พอดี, เพิ่ม k, hybrid/rerank, วัด Recall@k",
      ]},
      { h: "checklist สร้าง RAG" },
      { ul: [
        "หั่นเอกสารเป็น chunk ขนาดพอดี (ไม่ยาวเกิน ไม่สั้นเกิน)",
        "embed + เก็บพร้อม metadata (ไว้ pre-filter)",
        "ตอนค้น: embed query (QUERY) → vector search → คัด top-k",
        "เสริมด้วย hybrid (filter + ถ่วงน้ำหนัก) ถ้า vector อย่างเดียวไม่แม่น",
        "format ผลให้กระชับก่อน inject (จำกัด token เช่น ~150)",
        "วัด Recall@k กับชุดทดสอบ แล้วปรับ chunk/k/strategy",
      ]},
      { h: "ลด context ที่ inject ให้พอดี" },
      { p: "อย่ายัด chunk ดิบยาว ๆ — format ให้เหลือแก่น (lesson เหลือ ~150 token, ข่าวเหลือ top-3 ตัดที่ 120-200 ตัวอักษร). RAG ที่ดีคือ 'ค้นเยอะ คัดให้เหลือน้อยแต่ตรง'" },
      { table: { head: ["ปรับอะไร", "ผลต่อ Recall", "ผลต่อ cost"], rows: [
        ["chunk เล็กลง", "มักแม่นขึ้น", "เก็บ/ค้นมากขึ้น"],
        ["k มากขึ้น", "Recall สูงขึ้น", "prompt ยาว/แพงขึ้น"],
        ["เพิ่ม hybrid filter", "ตรงงานขึ้น", "เพิ่มความซับซ้อน"],
      ]}},
    ],
    tricks: [
      { h: "ทริค 1: pre-filter ก่อน vector เสมอถ้ามี metadata" },
      { p: "ค้นบทเรียน 'BUY + BEARISH trend' ก่อนด้วย exact match แล้วค่อย cosine — ตัดของไม่เกี่ยวทิ้งก่อน ทั้งเร็วและตรงกว่าค้น vector ล้วน" },
      { h: "ทริค 2: ถ่วงน้ำหนักด้วยสัญญาณอื่นนอกจากความใกล้" },
      { p: "weighted score = cosine × frequency × recency — ความผิดที่เกิดบ่อยและเพิ่งเกิด สำคัญกว่าความผิดเก่าที่เกิดครั้งเดียว แม้ cosine จะใกล้พอ ๆ กัน" },
      { h: "ทริค 3: dedup + นับความถี่แทนเก็บซ้ำ" },
      { p: "pattern เดิมเพิ่ม frequency ไม่ insert ใหม่ — ฐานความรู้ไม่บวม และความถี่กลายเป็นสัญญาณจัดอันดับฟรี ๆ" },
      { h: "ทริค 4: ให้ความรู้มีวันหมดอายุ" },
      { p: "lesson TTL 90 วัน — ตลาดเปลี่ยน บทเรียนเก่าอาจผิดบริบท. การ expire กันไม่ให้ context เก่ามารบกวนคำตอบใหม่" },
      { h: "ทริค 5: cache ผลที่แพงไว้ใช้ซ้ำ" },
      { p: "news_cache แคชสรุปข่าว 1 ชม. + reuse ตาม hash — ข่าวเดิมไม่ต้องเรียก Haiku ซ้ำ ลดทั้ง cost และ latency ของ RAG" },
    ],
    eval: [
      { qa: [
        { q: "RAG คืออะไร อธิบายสั้น ๆ?", a: "Retrieve + Augment + Generate — ค้นข้อมูลจริงที่เกี่ยวกับคำถาม ยัดเข้า prompt แล้วให้ LLM ตอบจากข้อมูลนั้น ลด hallucination และข้ามข้อจำกัด cutoff" },
        { q: "ทำไมต้อง chunk เอกสาร?", a: "embedding ของข้อความสั้นแม่นกว่า และ chunk พอดีใส่กลับ context ได้; โปรเจกต์ 42 ระบุ chunk ด้วยช่วงตัวอักษร" },
        { q: "Augment ในทางปฏิบัติทำยังไง?", a: "เอา chunk ที่ค้นได้มา format เป็นข้อความกระชับแล้วแทรกใน prompt เช่น format_lessons_for_prompt() แปลงบทเรียนเป็นคำเตือน ~150 token" },
        { q: "hybrid search คืออะไร?", a: "ผสมหลายสัญญาณ: pre-filter ด้วย metadata → cosine vector → ถ่วงน้ำหนัก (frequency×recency) — ตรงงานกว่าใช้ vector อย่างเดียว" },
        { q: "วัดว่า RAG ดีไหมด้วยอะไร?", a: "Recall@k — สัดส่วนที่ source ที่ถูกต้องถูกค้นเจอใน k อันดับแรก; โปรเจกต์ 42 ผ่านที่ Recall@5 ≥ 50% (code)/80% (docs)" },
        { q: "ทำไม lessons ต้องมี TTL/หมดอายุ?", a: "บริบท (ตลาด) เปลี่ยน ความรู้เก่าอาจผิด — TTL 90 วันกันไม่ให้บทเรียนเก่ามารบกวนการตัดสินใจปัจจุบัน" },
        { q: "dedup + frequency ช่วยอะไร?", a: "pattern ซ้ำเพิ่ม frequency แทน insert ใหม่ → ฐานความรู้ไม่บวม และความถี่กลายเป็นน้ำหนักจัดอันดับ (ผิดบ่อย=สำคัญ)" },
        { q: "RAG ต่างจาก fine-tuning ยังไง?", a: "RAG เสริมความรู้ตอน runtime ผ่าน prompt (อัปเดตง่าย ไม่ต้องเทรน); fine-tuning ฝังความรู้ในตัวโมเดล (แพง/ช้ากว่าจะอัปเดต)" },
      ]},
    ],
  },
});
window.EXTRA_FLOWS.ai_rag = {
  input: "search_lessons('BUY COUNTER_TREND H4:BEARISH conf:55', 'BUY', 'BEARISH')  ← lesson_store.py",
  steps: [
    { fn: "search_lessons()", file: "db/lesson_store.py", depth: 0, note: "Retrieve: รับบริบทคำตัดสินใจ เพื่อค้นบทเรียนคล้ายอดีต", data: "context='BUY COUNTER_TREND...', dir='BUY', trend='BEARISH'", vars: [
      { n: "context_text", v: "\"BUY COUNTER_TREND...\"", d: "บริบทดีลปัจจุบันเป็นข้อความ" },
      { n: "direction/trend", v: "BUY / BEARISH", d: "ใช้ pre-filter ก่อน vector" } ] },
    { fn: "_embed(context, RETRIEVAL_QUERY)", file: "db/lesson_store.py", depth: 1, note: "แปลงบริบทเป็นเวกเตอร์ query", data: "→ [0.2, -0.7, ...] (768 มิติ)", vars: [
      { n: "query_emb", v: "list[float]", d: "เวกเตอร์คำค้น", w: true } ] },
    { fn: "rpc('search_trade_lessons')", file: "Supabase / pgvector", depth: 1, note: "Rank: pre-filter(dir+trend) → cosine → weighted score(cosine×freq×recency)", data: "{query_embedding, p_direction:BUY, p_trend:BEARISH, match_count:3}", vars: [
      { n: "(pre-filter)", d: "ตัดแถวที่ direction/trend ไม่ตรงทิ้งก่อน" },
      { n: "score", d: "cosine × frequency_boost × recency_boost", w: true } ] },
    { fn: "รับ lessons", file: "db/lesson_store.py", depth: 1, note: "ได้บทเรียนคล้ายที่สุด top-3 พร้อมความถี่/PnL เฉลี่ย", data: "→ [{mistake:COUNTER_TREND, freq:4, avg_pnl:-30}, ...]", vars: [
      { n: "lessons", v: "[{...},{...},{...}]", d: "บทเรียนที่ค้นเจอ", w: true } ] },
    { fn: "format_lessons_for_prompt()", file: "db/lesson_store.py", depth: 1, note: "Augment: แปลงเป็นคำเตือนกระชับ (~150 token)", data: "→ '⚠ Similar past mistakes: [x4] COUNTER_TREND ... → require conf≥70 or SKIP'", vars: [
      { n: "lines", d: "ข้อความเตือน + คำแนะนำต่อ mistake_type", w: true } ] },
    { fn: "inject → decision_maker", file: "agents/decision_maker.py", depth: 1, note: "Generate: แปะคำเตือนใน prompt แล้วให้ Claude ตัดสินใจ", data: "Claude เห็นบทเรียนก่อนตัดสินใจ → อาจ SKIP", vars: [
      { n: "decision prompt", d: "prompt ที่มีบทเรียนแทรกอยู่", w: true } ] },
  ],
};

/* ===================== AI AGENTS / LANGGRAPH ===================== */
window.TEACHING_DATA.push({
  id: "ai_agents",
  name: "Agents & LangGraph — ต่อ AI หลายตัวเป็นระบบ",
  tag: { th: "จากเรียก LLM ทีละครั้ง สู่ระบบ multi-agent ที่ต่อกันด้วย state machine: StateGraph, node/edge, conditional routing, การส่งต่อ state และ degrade เมื่อ agent ล้ม — อิง trading_graph.py จริง (9 nodes)", en: "From single LLM calls to a multi-agent system wired as a state machine: StateGraph, nodes/edges, conditional routing, shared state and graceful degradation — grounded in the real trading_graph.py (9 nodes)" },
  accent: "#f472b6",
  sections: {
    principle: [
      { h: "agent คืออะไร (ต่างจากเรียก LLM เฉย ๆ)" },
      { p: "**เรียก LLM เฉย ๆ** = ถาม-ตอบครั้งเดียว. **agent** = LLM ที่ถูกวางในวงจรที่ (ก) มีบทบาทชัด (system prompt), (ข) รับ context จากระบบ, (ค) ผลลัพธ์ถูกเอาไป 'ทำอะไรต่อ' (เรียกฟังก์ชัน/ส่งต่อ agent อื่น). ระบบเทรดนี้มี agent หลายตัว แต่ละตัวคือ 1 ขั้นของการคิด" },
      { h: "ทำไมต้อง orchestrate (จัดวงจร)" },
      { p: "เมื่อมีหลาย agent ต้องมีคนกำหนด **ใครทำก่อน-หลัง, เมื่อไรข้าม, เมื่อไรลัด, ส่งข้อมูลกันยังไง**. นี่คืองานของ **LangGraph** — มันทำให้ pipeline เป็น **state machine** ที่อ่านง่ายและยืดหยุ่น แทนการเขียน if/else ซ้อนกันยาว ๆ ใน run_cycle()" },
      { code: String.raw`_entry ─(skip_ai?)─► position_mgmt ─► END
       └─► chart ─► advisor ─(net ล่ม?)─► accounting ─► END
                          └─► news ─► analyst ─► decision
                                 ─► position_mgmt ─► reporter ─► accounting ─► END`, cap: "trading_graph.py — เส้นทางจริงมีทั้งทางหลัก ทางลัด และทาง degrade", lang: "txt" },
      { h: "ชิ้นส่วนของ LangGraph" },
      { table: { head: ["ชิ้น", "คืออะไร", "ในโค้ด"], rows: [
        ["State", "dict กลางที่ทุก node อ่าน/เขียน", "TradingState (TypedDict)"],
        ["Node", "1 ขั้นงาน (มัก = 1 agent)", "node_chart, node_analyst, ..."],
        ["Edge", "เส้นทางจาก node → node", "add_edge('chart','advisor')"],
        ["Conditional edge", "แยกทางตามเงื่อนไข", "add_conditional_edges + route fn"],
        ["Entry / END", "จุดเริ่ม / จุดจบ", "set_entry_point, END"],
      ]}},
    ],
    theory: [
      { h: "1) State — สมุดบันทึกกลางของทั้งกราฟ" },
      { p: "ทุก node ไม่ส่งค่าให้กันตรง ๆ แต่ **เขียนผลลงใน state** แล้ว node ถัดไป **อ่านจาก state**. ประกาศ schema ของ state ด้วย `TypedDict` ให้รู้ว่ามี field อะไรบ้าง" },
      { code: String.raw`class TradingState(TypedDict):
    skip_ai:        bool
    chart_data:     dict
    advisor_data:   dict
    news_data:      dict
    sentiment_data: dict
    decision:       dict
    net_degraded:   bool
    latencies:      dict
    error_steps:    list`, cap: "trading_graph.py — โครง state จริง; แต่ละ agent เติม field ของตัวเอง", lang: "py" },
      { h: "2) Node คืนเฉพาะส่วนที่อัปเดต (partial update)" },
      { p: "node ไม่ต้องคืน state ทั้งก้อน — คืนแค่ dict ของ field ที่เปลี่ยน LangGraph จะ merge ให้. ทำให้แต่ละ node เป็นอิสระและทดสอบง่าย" },
      { code: String.raw`def node_chart(state: TradingState) -> dict:
    data = analyze_chart()
    return {"chart_data": data,                       # เขียนผลของตัวเอง
            "latencies": {**state.get("latencies",{}), "chart_watcher": lat}}`, cap: "คืน partial dict — merge เข้า state เดิมอัตโนมัติ", lang: "py" },
      { h: "3) Edge ปกติ vs Conditional edge" },
      { p: "**Edge ปกติ**: ทำ A เสร็จไป B เสมอ. **Conditional edge**: เรียก 'ฟังก์ชัน routing' ที่อ่าน state แล้วคืนชื่อทางที่จะไป — ใช้ทำ if/skip/branch" },
      { code: String.raw`g.add_edge("chart", "advisor")                # A → B เสมอ

def route_after_advisor(state) -> str:        # routing function
    if state.get("net_degraded"):
        return "accounting"                   # เครือข่ายล่ม → ลัดไปจบ
    return "news"
g.add_conditional_edges("advisor", route_after_advisor, {
    "news":       "news",
    "accounting": "accounting",
})`, cap: "trading_graph.py — routing fn คืน key แล้ว map ไป node ปลายทาง", lang: "py" },
      { h: "4) Graceful degradation — ระบบไม่ล้มทั้งก้อน" },
      { p: "ถ้า chart+advisor ล้มทั้งคู่ (เครือข่ายมีปัญหา) จะตั้ง `net_degraded=True` แล้ว routing ลัดข้ามไป accounting เลย — ไม่ฝืนเรียก agent ที่เหลือให้พังซ้ำ. แต่ละ node ก็มี try/except คืนค่า default ของตัวเอง" },
      { h: "5) Stateless ต่อรอบ — ไม่มี state ค้างข้ามรอบ" },
      { p: "กราฟถูก `compile()` ครั้งเดียวตอน import แต่ไม่ผูก checkpoint — แต่ละ cycle เริ่ม state ใหม่ ไม่ให้ข้อมูลรอบก่อนรั่วมารอบนี้ (สำคัญมากในระบบ real-time)" },
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "LangGraph — Low-level concepts (StateGraph)", url: "https://langchain-ai.github.io/langgraph/concepts/low_level/", note: "State, Node, Edge, conditional edges ที่ใช้จริง" },
        { label: "LangGraph — Quickstart", url: "https://langchain-ai.github.io/langgraph/tutorials/introduction/", note: "สร้างกราฟแรกทีละขั้น" },
        { label: "Anthropic — Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents", note: "หลักออกแบบ agent/workflow (orchestrator, routing)" },
        { label: "Python — TypedDict", url: "https://docs.python.org/3/library/typing.html#typing.TypedDict", note: "schema ของ state ในกราฟ" },
      ]},
      { h: "🎬 วิดีโอสอน (เจาะลึก)" },
      { links: [
        { label: "LangGraph Tutorial — Build Advanced AI Agent Systems", url: "https://www.youtube.com/watch?v=1w5cCXlh7JQ", note: "เจาะลึก state graph" },
        { label: "Building Effective Agents with LangGraph (LangChain official)", url: "https://www.youtube.com/watch?v=aHCDrAbH_go", note: "อิงหลัก Building Effective Agents" },
        { label: "LangGraph & LangSmith: Build AI Agents (Full Demo)", url: "https://www.youtube.com/watch?v=vhKM27MOgME", note: "เดโมเต็มพร้อม debug" },
        { label: "mikelopster — LangGraph 101 (ไทย)", url: "https://www.youtube.com/@mikelopster/videos", note: "ค้น 'LangGraph 101' ในช่อง" },
      ]},
    ],
    foundations: [
      { h: "ประกอบกราฟ 5 ขั้น" },
      { code: String.raw`def build_trading_graph():
    g = StateGraph(TradingState)               # 1) สร้างกราฟผูกกับ state schema
    g.add_node("chart", node_chart)            # 2) ใส่ node (= agent)
    g.add_node("advisor", node_advisor)
    # ...
    g.set_entry_point("_entry")                # 3) จุดเริ่ม
    g.add_edge("chart", "advisor")             # 4) ต่อเส้นทาง
    g.add_conditional_edges("advisor", route_after_advisor, {...})
    g.add_edge("accounting", END)              # 5) จุดจบ
    return g.compile()                         # คืน app ที่ .invoke() ได้

TRADING_APP = build_trading_graph()            # compile ครั้งเดียว (singleton)`, cap: "trading_graph.py — โครงจริงของการ build graph", lang: "py" },
      { h: "9 node ของระบบจริง" },
      { table: { head: ["node", "agent/งาน", "เขียน state"], rows: [
        ["_entry", "จุดเริ่ม + ตัดสิน skip", "—"],
        ["chart", "chart_watcher (LLM)", "chart_data"],
        ["advisor", "market_advisor (LLM)", "advisor_data, net_degraded"],
        ["news", "news_gatherer (async)", "news_data"],
        ["analyst", "analyst (LLM + RAG)", "sentiment_data"],
        ["decision", "decision_maker (gates+LLM)", "decision"],
        ["position_mgmt", "จัดการไม้ (โค้ดล้วน)", "—"],
        ["reporter", "บันทึก + เรียนบทเรียน", "—"],
        ["accounting", "นับ token/cost", "—"],
      ]}},
      { h: "node แบบ async ก็ได้" },
      { p: "node_news เป็น `async def` (รอ I/O ดึงข่าวจากเน็ต) — LangGraph รองรับทั้ง sync และ async node ในกราฟเดียวกัน" },
    ],
    architecture: [
      { h: "ทำไม state machine ดีกว่า if/else ยาว ๆ" },
      { ul: [
        "**อ่านรู้เรื่อง** — เห็นทั้ง flow เป็นกราฟ ไม่ใช่โค้ด 200 บรรทัดซ้อนกัน",
        "**แก้เส้นทางง่าย** — เพิ่ม/ย้าย node โดยไม่รื้อ logic ภายใน",
        "**routing แยกจากงาน** — เงื่อนไขการแตกทางอยู่ใน route fn ของมันเอง",
        "**degrade เป็นทางการ** — ทางลัดตอน error เป็น edge ที่เห็นชัด",
      ]},
      { h: "state ต้อง serializable" },
      { p: "ค่าที่ใส่ state ควรเป็นชนิดพื้นฐาน. โค้ดมี `_to_native()` แปลง numpy/NaN ให้เป็น Python ปกติก่อนใส่ state — กัน error ตอน LangGraph ส่งผ่าน state (msgpack)" },
      { code: String.raw`data = _to_native(analyze_chart())   # numpy float/array → float/list, NaN → None
return {"chart_data": data}`, cap: "ทำความสะอาด type ก่อนเข้ากราฟ", lang: "py" },
      { h: "แยก orchestration ออกจาก agent" },
      { p: "trading_graph.py รู้แค่ 'ลำดับและเงื่อนไข'. ตรรกะจริงของแต่ละ agent อยู่ในไฟล์ของมัน (analyst.py ฯลฯ) และถูก import ภายใน node — แยกความรับผิดชอบชัดเจน" },
    ],
    dataflow: [
      { h: "1 cycle ไหลผ่านกราฟ" },
      { code: String.raw`TRADING_APP.invoke(EMPTY_STATE)
  _entry ─ route_entry: skip_ai? ─ no ─► chart
  chart    → state.chart_data = {signal:BUY, conf:72}
  advisor  → state.advisor_data = {regime:BULLISH_TREND}
             route_after_advisor: net_degraded? no ─► news
  news     → state.news_data = {tweets:[...]}
  analyst  → state.sentiment_data = {sentiment:BULLISH, conf:65}
  decision → state.decision = {action:EXECUTE, direction:BUY}
  position_mgmt → จัดการไม้
             route_after_position_mgmt: skip_ai? no ─► reporter
  reporter → log + lesson
  accounting → token/cost → END`, cap: "state ค่อย ๆ ถูกเติมจน decision พร้อมใช้", lang: "txt" },
      { note: "ดู interactive ที่แท็บ Visualizer ▶ — ไล่ทีละ node พร้อม field ของ state ที่ถูกเขียน" },
    ],
    implementation: [
      { h: "🧪 ตัวอย่างใช้งานครบ (คัดลอกไปลองได้)" },
      { p: "โครงสร้าง: `State`(TypedDict) → node `detect` → conditional edge (`route`) → node `thai`/`eng` → END — กราฟจิ๋วแต่ครบกลไก LangGraph" },
      { code: String.raw`# pip install langgraph
from typing import TypedDict
from langgraph.graph import StateGraph, END

class State(TypedDict):
    text: str
    lang: str
    reply: str

def detect(state):                       # node 1 — เขียน lang
    is_th = any("฀" <= c <= "๿" for c in state["text"])
    return {"lang": "th" if is_th else "en"}

def route(state):                        # routing function (conditional edge)
    return "thai" if state["lang"] == "th" else "eng"

def thai(state): return {"reply": "สวัสดีครับ 👋"}
def eng(state):  return {"reply": "Hello 👋"}

g = StateGraph(State)
g.add_node("detect", detect); g.add_node("thai", thai); g.add_node("eng", eng)
g.set_entry_point("detect")
g.add_conditional_edges("detect", route, {"thai": "thai", "eng": "eng"})
g.add_edge("thai", END); g.add_edge("eng", END)
app = g.compile()

print(app.invoke({"text": "ทองขึ้นไหม", "lang": "", "reply": ""})["reply"])  # สวัสดีครับ 👋
print(app.invoke({"text": "is gold up", "lang": "", "reply": ""})["reply"])  # Hello 👋`, cap: "กราฟ 3 node + conditional edge — แตกทางตามภาษา (รันได้จริง)", lang: "py" },
      { ul: [
        "`State` — schema กลางที่ทุก node อ่าน/เขียน",
        "node คืน partial dict (เช่น {'lang':...}) → merge เข้า state อัตโนมัติ",
        "`add_conditional_edges` + `route` — แตกทางตามค่าใน state",
        "`compile()` ครั้งเดียว แล้ว `invoke()` ด้วย state ใหม่ทุกครั้ง",
      ]},
      { h: "checklist ออกแบบ agent graph" },
      { ul: [
        "นิยาม state schema (TypedDict) ให้ครบก่อน",
        "1 node = 1 หน้าที่; node คืน partial dict เท่านั้น",
        "ใส่ try/except ในทุก node → คืน default ของ field นั้น",
        "ใช้ conditional edge ทำ skip/branch/degrade แทน if ใน node",
        "ทำความสะอาด type ก่อนใส่ state (serializable)",
        "compile ครั้งเดียว; ตัดสินใจว่าจะ stateless หรือมี checkpoint",
      ]},
      { h: "ข้อผิดพลาดที่พบบ่อย" },
      { table: { head: ["พลาด", "ผล"], rows: [
        ["node คืน state ทั้งก้อน", "เขียนทับ field อื่นโดยไม่ตั้งใจ"],
        ["ลืม try/except ใน node", "agent ตัวเดียวล้ม = ทั้งกราฟพัง"],
        ["ใส่ numpy/NaN ใน state", "serialize error กลางทาง"],
        ["routing fn คืน key ที่ไม่ได้ map", "กราฟไม่รู้จะไปไหน → error"],
        ["checkpoint ค้างข้ามรอบ", "ข้อมูลรอบก่อนรั่วมารอบใหม่"],
      ]}},
    ],
    tricks: [
      { h: "ทริค 1: partial update = node อิสระ" },
      { p: "ให้ node คืนเฉพาะ field ที่ตัวเองรับผิดชอบ — เพิ่ม/ลบ node ได้โดยไม่กระทบตัวอื่น และเทสต์ทีละ node ได้ง่าย" },
      { h: "ทริค 2: degrade ด้วย conditional edge" },
      { p: "ทำ 'ทางหนีไฟ' เป็น edge จริง (เช่น net_degraded → accounting) — ชัดกว่าซ่อน if กระจายในหลาย node และเห็นใน flow ทันที" },
      { h: "ทริค 3: เก็บ latency ใน state" },
      { p: "แต่ละ node บันทึกเวลาตัวเองลง `state.latencies` — พอจบรอบ accounting มีข้อมูลครบว่าใครช้า ใช้ปรับ performance" },
      { h: "ทริค 4: compile ครั้งเดียวเป็น singleton" },
      { p: "`TRADING_APP = build_trading_graph()` ระดับ module — ไม่ build ใหม่ทุกรอบ ลด overhead; แต่ invoke ด้วย state ใหม่ทุกครั้งเพื่อความสด" },
      { h: "ทริค 5: async node ปนได้" },
      { p: "งานที่รอ I/O (ดึงข่าว) ทำเป็น async node — กราฟเดียวมีทั้ง sync/async ได้ ไม่ต้องแยกระบบ" },
    ],
    eval: [
      { qa: [
        { q: "agent ต่างจากเรียก LLM เฉย ๆ ยังไง?", a: "agent คือ LLM ที่มีบทบาทชัด รับ context จากระบบ และผลถูกเอาไปทำต่อ (เรียกฟังก์ชัน/ส่ง agent อื่น) — ไม่ใช่แค่ถาม-ตอบจบ" },
        { q: "State ใน LangGraph คืออะไร?", a: "dict กลาง (ประกาศด้วย TypedDict) ที่ทุก node อ่าน/เขียนเพื่อส่งต่อข้อมูล แทนการให้ node คุยกันตรง ๆ" },
        { q: "ทำไม node ควรคืน partial dict?", a: "คืนแค่ field ที่เปลี่ยน LangGraph merge ให้ — ทำให้ node อิสระ ทดสอบง่าย และไม่เขียนทับ field อื่น" },
        { q: "conditional edge ต่างจาก edge ปกติยังไง?", a: "edge ปกติไป node ถัดไปเสมอ; conditional edge เรียก routing fn อ่าน state แล้วเลือกทาง (skip/branch/degrade)" },
        { q: "graceful degradation ในกราฟนี้ทำงานยังไง?", a: "ถ้า chart+advisor ล้ม → net_degraded=True → routing ลัดไป accounting ไม่ฝืนเรียก agent ที่เหลือ; ทุก node ก็มี fallback ของตัวเอง" },
        { q: "ทำไมต้อง _to_native() ก่อนใส่ state?", a: "state ต้อง serializable — แปลง numpy/NaN เป็น Python native กัน error ตอน LangGraph ส่งผ่าน state" },
        { q: "stateless ต่อรอบสำคัญยังไง?", a: "เริ่ม state ใหม่ทุก cycle ไม่ให้ข้อมูลรอบก่อนรั่วมารอบใหม่ — จำเป็นในระบบ real-time" },
        { q: "ทำไมใช้ state machine แทน if/else ยาว ๆ?", a: "อ่านเป็นกราฟง่ายกว่า, แก้เส้นทางได้โดยไม่รื้อ logic, แยก routing ออกจากงาน, และทำ degrade เป็น edge ที่เห็นชัด" },
      ]},
    ],
  },
});
window.EXTRA_FLOWS.ai_agents = {
  input: "TRADING_APP.invoke(EMPTY_STATE)  ← trading_graph.py (1 cycle)",
  steps: [
    { fn: "node_entry → route_entry", file: "agents/trading_graph.py", depth: 0, note: "เริ่มกราฟ; เช็ค skip_ai → ไป chart หรือ position_mgmt", data: "skip_ai=False → 'chart'", vars: [
      { n: "state.skip_ai", v: "False", d: "ถ้า True จะลัดไปจัดการไม้อย่างเดียว" } ] },
    { fn: "node_chart", file: "agents/chart_watcher.py", depth: 1, note: "agent ดูกราฟ (LLM) → เขียน chart_data + latency", data: "→ {signal:'BUY', confidence:72}", vars: [
      { n: "state.chart_data", v: "{signal:BUY}", d: "ผลวิเคราะห์กราฟ", w: true },
      { n: "state.latencies.chart_watcher", v: "ms", d: "เวลาที่ใช้", w: true } ] },
    { fn: "node_advisor → route", file: "agents/market_advisor.py", depth: 1, note: "วิเคราะห์ regime; ถ้า net ล่ม → ลัดไป accounting", data: "net_degraded=False → 'news'", vars: [
      { n: "state.advisor_data", v: "{regime:BULLISH_TREND}", d: "ภาวะตลาด", w: true },
      { n: "state.net_degraded", v: "False", d: "เครือข่ายล่มไหม (ตัดสิน routing)", w: true } ] },
    { fn: "node_news + node_analyst", file: "agents/analyst.py", depth: 1, note: "ดึงข่าว (async) + วิเคราะห์ sentiment (LLM+RAG)", data: "→ {sentiment:'BULLISH', confidence:65}", vars: [
      { n: "state.news_data", d: "ข่าวดิบ", w: true },
      { n: "state.sentiment_data", v: "{sentiment:BULLISH}", d: "ผลวิเคราะห์ข่าว", w: true } ] },
    { fn: "node_decision", file: "agents/decision_maker.py", depth: 1, note: "รัน gates (โค้ด) + Claude → คำตัดสินใจ", data: "→ {action:'EXECUTE', direction:'BUY'}", vars: [
      { n: "state.decision", v: "{action:EXECUTE}", d: "ผลตัดสินใจสุดท้าย", w: true } ] },
    { fn: "position_mgmt → reporter → accounting", file: "agents/trading_graph.py", depth: 1, note: "จัดการไม้ → บันทึก/เรียนบทเรียน → นับ token/cost → END", data: "log + lesson + usage → END", vars: [
      { n: "state.latencies", d: "เวลาแต่ละ agent (accounting อ่านไปสรุป)", w: true } ] },
  ],
};

/* ===================== AI HARNESS (design harness, tools, system prompt, eval/cost) ===================== */
window.TEACHING_DATA.push({
  id: "ai_harness",
  name: "Harness — โครงรอบ LLM: guardrail · tool · system prompt · cost",
  tag: { th: "ของจริงรอบ ๆ LLM ที่ทำให้มัน production-ready: ออกแบบ harness (gate/guardrail), สร้าง tool ให้ LLM, ดีไซน์ system prompt, และวัด cost/eval — อิง decision_maker.py (12 gates), prompts/*.json, accountant.py", en: "The scaffolding around an LLM that makes it production-ready: harness/guardrail design, building tools, system-prompt design, and cost/eval — grounded in decision_maker.py (12 gates), prompts/*.json, accountant.py" },
  accent: "#22d3ee",
  sections: {
    principle: [
      { h: "harness คืออะไร" },
      { p: "**harness** คือ 'โครง' ที่ครอบ LLM ไว้ให้ใช้งานจริงได้อย่างปลอดภัยและคุมได้ — ไม่ใช่ตัวโมเดล แต่คือทุกอย่างรอบ ๆ: **guardrail** (กรองก่อน/หลัง), **tool** (ให้ LLM ลงมือทำได้), **system prompt** (กำหนดพฤติกรรม), และ **มิเตอร์** (วัด cost/คุณภาพ). LLM เก่งแต่ 'เดาคำ' — harness คือสิ่งที่ทำให้มันเชื่อถือได้" },
      { h: "หลักคิดสำคัญ: 'LLM ตัดสิน โค้ดลงมือ'" },
      { p: "ในระบบจริง อย่าให้ LLM ทำทุกอย่าง. ระบบเทรดนี้ใช้ **gate layer (โค้ดล้วน)** กรองด้วยกฎเชิงปริมาณ **ก่อน** ถึง Claude — ถ้าไม่ผ่านกฎก็ SKIP โดยไม่เปลือง token เลย. LLM ทำเฉพาะส่วนที่ต้องใช้วิจารณญาณ" },
      { code: String.raw`make_decision():
  gate = _run_gates(...)        # โค้ดล้วน: 12 ด่าน (ไม่เรียก Claude)
  if not gate["pass"]:
      return SKIP               # ตัดจบก่อน — ประหยัด token 100%
  # ผ่านด่านแล้วค่อยถาม Claude ตัดสินใจขั้นสุดท้าย
  result = _llm.invoke(messages)`, cap: "decision_maker.py — guardrail เชิงกฎมาก่อน LLM เสมอ", lang: "py" },
      { h: "4 เสาของ harness (= section ถัด ๆ ไป)" },
      { table: { head: ["เสา", "ทำหน้าที่", "โค้ดจริง"], rows: [
        ["Guardrail / Gate", "กรอง input/output ด้วยกฎ", "_run_gates() 12 ด่าน"],
        ["Tool", "ให้ LLM สั่งงาน/ดึงข้อมูล", "schemas.py + open_order()"],
        ["System prompt", "กำหนดบทบาท/กติกา", "prompts/*.json"],
        ["Eval / Cost", "วัดคุณภาพ + ค่าใช้จ่าย", "accountant.py, Recall@k"],
      ]}},
    ],
    theory: [
      { h: "1) ออกแบบ guardrail — กรองก่อนและหลัง LLM" },
      { p: "**Pre-guard** (ก่อนเรียก LLM): ถ้ารู้อยู่แล้วว่าไม่ควรทำ ก็ไม่ต้องถาม. **Post-guard** (หลัง LLM): ตรวจผลก่อนเอาไปใช้จริง. decision_maker มีทั้งคู่ — 12 gate ก่อน + ตรวจ SL/sizing หลังโมเดลตอบ" },
      { code: String.raw`# pre-guard ตัวอย่าง (decision_maker.py)
if conf < _min_conf:
    return _fail(f"Confidence {conf}% < {_min_conf}%")     # ไม่ถาม LLM เลย
if is_counter and not (at_strong and conf >= 80):
    return _fail("Counter-trend blocked")                 # กฎชัด ตัดก่อน

# post-guard ตัวอย่าง
if wick_sl is None or not (500 <= wick_sl <= 3500):
    return _fail("SL out of valid range")                 # ตรวจผลก่อนส่ง order`, cap: "กฎเชิงปริมาณที่ deterministic ควรอยู่ในโค้ด ไม่ใช่ฝากความหวังไว้กับ prompt", lang: "py" },
      { h: "2) สร้าง tool ให้ LLM — 2 แบบ" },
      { p: "**แบบ A — Tool calling (function calling):** ให้ LLM เลือกเรียกฟังก์ชันเองพร้อม argument (โมเดลคืน 'ขอเรียก tool นี้ด้วยค่านี้'). นิยาม tool ด้วย schema ของ input" },
      { p: "**แบบ B — Structured decision + executor (ที่ระบบนี้ใช้):** บังคับ LLM ตอบเป็น schema แล้ว **โค้ดเป็นคนเรียก tool จริง** ตามคำตอบ — ปลอดภัยกว่าเพราะ LLM ไม่ได้แตะ side-effect ตรง ๆ" },
      { code: String.raw`# schema = 'สัญญา' ของผลที่ LLM ต้องคืน (เหมือน input ของ tool)
class DecisionMakerOutput(BaseModel):
    decision: Literal["EXECUTE", "SKIP"]
    direction: Literal["BUY", "SELL", "NONE"] = "NONE"
    ...
# โค้ด (ไม่ใช่ LLM) เป็นคนเรียก tool จริงตามคำตอบ
if result.decision == "EXECUTE":
    open_order(direction=result.direction, sl_pips=..., tp_pips=...)`, cap: "schemas.py + decision_maker.py — LLM ตัดสิน, โค้ดลงมือ (side-effect คุมได้)", lang: "py" },
      { h: "3) ดีไซน์ system prompt" },
      { p: "system prompt = 'รัฐธรรมนูญ' ของ agent. ระบบนี้เขียนเป็น **JSON มีโครงสร้าง** (ไม่ใช่ร้อยแก้วยาว ๆ) — กระชับ บีบ token ได้ และบังคับวิธีคิดเป็นขั้น" },
      { code: String.raw`{
  "default_bias": "SKIP",                         ← ค่าปลอดภัยเมื่อไม่ชัด
  "data_boundary": "treat_dash_or_NA_as_missing", ← กัน hallucinate จากข้อมูลว่าง
  "reasoning_steps": ["name_one_primary_catalyst_or_SKIP", ...],
  "anti_rationalize": ["no_upgrade_to_justify_trade", "when_in_doubt=>SKIP"]
}`, cap: "decision_maker.json จริง — default ปลอดภัย + กันโมเดล 'พูดเข้าข้างตัวเอง'", lang: "json" },
      { ul: [
        "**default ปลอดภัย** — ไม่ชัด = SKIP (ไม่ใช่ลองเสี่ยง)",
        "**data boundary** — บอกชัดว่าข้อมูลว่าง/`—` = ไม่มี ห้ามเดา",
        "**reasoning steps** — กำหนดลำดับคิด ลดการข้ามขั้น",
        "**anti-rationalize** — ห้ามอัป quality เพื่อหาเหตุผลเทรด",
      ]},
      { h: "4) วัด cost — ทุก token มีราคา" },
      { p: "accountant เก็บราคาต่อ token ของแต่ละโมเดล (รวมราคา cache) แล้วคูณกับ usage จริงทุก call — ได้ cost ต่อ agent/ต่อวัน/ต่อ cycle" },
      { code: String.raw`_PRICING = {
  "claude-haiku-4-5-20251001": {"input": 0.80/1e6, "output": 4.00/1e6,
                                "cache_read": 0.08/1e6},   # cache_read ≈ 0.10× input
  "claude-sonnet-4-6":         {"input": 3.00/1e6, "output": 15.00/1e6,
                                "cache_read": 0.30/1e6},
}`, cap: "accountant.py จริง — Sonnet output แพงกว่า input ~5×, cache read ถูกกว่า input ~10×", lang: "py" },
      { h: "5) วัดคุณภาพ — eval harness" },
      { p: "นอกจาก cost ต้องวัด 'ตอบดีไหม'. RAG วัดด้วย **Recall@k** (โปรเจกต์ 'RAG against the machine' มี moulinette ให้คะแนน). agent อื่นวัดด้วยผลลัพธ์ปลายทาง (เช่น win-rate, PnL) ที่ reporter/accountant เก็บ" },
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Anthropic — Tool use (function calling)", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview", note: "นิยาม tool + ให้ Claude เรียก (แบบ A)" },
        { label: "Anthropic — Define & implement tools", url: "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/implement-tool-use", note: "เขียน tool schema + จัดการ tool_use loop" },
        { label: "Anthropic — Prompt engineering: system prompts", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts", note: "ดีไซน์ system prompt / role" },
        { label: "Anthropic — Reducing latency & cost", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching", note: "caching + การคุม cost" },
        { label: "Guardrails (overview)", url: "https://www.guardrailsai.com/docs", note: "แนวคิด guardrail รอบ LLM" },
      ]},
      { h: "🎬 วิดีโอสอน (เจาะลึก)" },
      { links: [
        { label: "Anthropic Masterclass on Building Agent Harnesses", url: "https://www.youtube.com/watch?v=efRIrLXoOVA", note: "ตรงหัวข้อ harness โดยตรง" },
        { label: "Anthropic Workshop: Build Agents That Run for Hours", url: "https://www.youtube.com/watch?v=mR-WAvEPRwE", note: "self-eval + adversarial evaluator" },
        { label: "Tool Use (Function Calling) with Claude API — Step by Step", url: "https://www.youtube.com/watch?v=W7z4Zas--20", note: "สร้าง tool ทีละขั้น" },
        { label: "mikelopster — รู้จักกับ Agent Harness กัน (ไทย)", url: "https://www.youtube.com/@mikelopster/videos", note: "ค้น 'Agent Harness' ในช่อง" },
      ]},
    ],
    foundations: [
      { h: "กายวิภาคของ harness รอบ decision_maker" },
      { code: String.raw`input (chart + sentiment + advisor)
   │
   ├─ [PRE-GUARD] _run_gates(): 12 ด่านโค้ดล้วน
   │     daily-loss, NO_TRADE, counter-trend, session,
   │     confidence, ATR, streak, slot, SL range ...
   │     └─ ไม่ผ่าน → SKIP (ไม่เรียก Claude)
   │
   ├─ [CONTEXT] ประกอบ user_message ~15 บรรทัด + RAG lessons
   │
   ├─ [LLM] Claude (system prompt JSON, structured output)
   │
   ├─ [POST-GUARD] ตรวจ SL, คำนวณ position size, dynamic R:R
   │
   └─ [TOOL] open_order(...)  ← โค้ดเรียก ไม่ใช่ LLM`, cap: "LLM เป็นแค่ชั้นเดียวตรงกลาง — รอบ ๆ คือ harness", lang: "txt" },
      { h: "ตัวอย่าง gate (เป็นกฎ ไม่ใช่ AI)" },
      { table: { head: ["gate", "กฎ", "ทำไมเป็นโค้ดไม่ใช่ LLM"], rows: [
        ["Daily loss", "ขาดทุนวันนี้ ≥ เพดาน → หยุด", "ตัวเลขชัด ไม่ต้องตีความ"],
        ["Confidence", "conf < 50% → SKIP", "threshold คงที่"],
        ["Losing streak", "แพ้ติด ≥ 5 → หยุด", "นับได้ deterministic"],
        ["SL range", "SL ต้อง 500–3500p", "validate ค่าก่อนสั่งจริง"],
      ]}},
      { note: "กฎที่ 'ตัดสินได้ด้วยตัวเลข' ควรอยู่ในโค้ด — เร็ว ฟรี และเชื่อถือได้ 100%; เก็บ LLM ไว้สำหรับงานที่ต้องตีความจริง ๆ" },
    ],
    architecture: [
      { h: "ชั้นของ harness" },
      { table: { head: ["ชั้น", "ไฟล์", "หน้าที่"], rows: [
        ["Pre-guard", "decision_maker._run_gates", "กรองด้วยกฎก่อน LLM"],
        ["Prompt mgmt", "prompts/*.json + loader", "system prompt + minify + cache"],
        ["Context builder", "build user_message + RAG", "ประกอบ input ที่กระชับ"],
        ["LLM call", "ChatAnthropic structured", "ส่วนที่ใช้วิจารณญาณ"],
        ["Post-guard", "SL/size/RR validation", "ตรวจผลก่อนลงมือ"],
        ["Executor (tool)", "open_order / manage_*", "ลงมือจริง (โค้ดคุม)"],
        ["Metering", "accountant.record_cycle", "token/cost/latency"],
      ]}},
      { h: "system prompt แยกไฟล์ + minify + cache" },
      { code: String.raw`SYSTEM_PROMPT = json.dumps(
    json.loads(Path("agents/prompts/decision_maker.json").read_text()),
    separators=(",", ":"),   # minify — ประหยัด ~15% tokens
)
# ใช้ตอนเรียก + ติด cache_control เพราะเนื้อหาคงที่
messages = [{"role": "system", "content": [
    {"type": "text", "text": SYSTEM_PROMPT, "cache_control": {"type": "ephemeral"}}]}, ...]`, cap: "decision_maker.py — prompt แยกไฟล์ (แก้ง่าย) + minify + cache (ถูกลง)", lang: "py" },
      { h: "metering ต่อ agent (multi-model)" },
      { code: String.raw`record_cycle(agent_usages={
    "chart_watcher":  ("claude-sonnet-4-6", _cw._last_usage),
    "analyst":        ("claude-sonnet-4-6", _an._last_usage),
    "reporter":       ("claude-haiku-4-5-20251001", _rp._last_usage),
}, latencies_ms=state.get("latencies", {}))`, cap: "trading_graph node_accounting — รู้ว่าแต่ละ agent ใช้โมเดลไหน กิน token เท่าไร", lang: "py" },
    ],
    dataflow: [
      { h: "เส้นทางผ่าน harness (input → action)" },
      { code: String.raw`chart+sentiment+advisor
   │
   ├─ _run_gates() ──► fail? ──► SKIP (จบ ไม่เปลือง token)
   │        │ pass
   │        ▼
   ├─ build user_message + RAG lessons (lesson_store)
   │
   ├─ _llm.invoke(system(cached)+user) ──► DecisionMakerOutput
   │        │ except ──► fallback SKIP
   │        ▼
   ├─ post-guard: SL range, position size, dynamic R:R, no-TP
   │
   ├─ open_order(...) ──► success? ──no──► SKIP (+นับ fail streak)
   │        │ yes
   │        ▼
   └─ accountant.record_cycle(token, cost, latency)`, cap: "ทุกขั้นมีทางออกปลอดภัย — ระบบไม่ทำสิ่งที่ไม่ควรแม้ LLM พลาด", lang: "txt" },
      { note: "ดู interactive ที่แท็บ Visualizer ▶ — ไล่ pre-guard → prompt → LLM → post-guard → tool → metering" },
    ],
    implementation: [
      { h: "🧪 ตัวอย่างใช้งานครบ (คัดลอกไปลองได้)" },
      { p: "โครงสร้าง harness ครบวง: PRE-GUARD (กฎ) → LLM ตัดสิน (structured+fallback) → POST-GUARD (ตรวจผล) → TOOL (โค้ดเรียก) — 'LLM ตัดสิน โค้ดลงมือ'" },
      { code: String.raw`# pip install langchain-anthropic pydantic
import os
from typing import Literal
from pydantic import BaseModel
from langchain_anthropic import ChatAnthropic

def send_refund(order_id, amount):           # TOOL จริง (side-effect)
    return {"ok": True, "order": order_id, "refunded": amount}

class Decision(BaseModel):
    action: Literal["REFUND", "REJECT"]
    amount: int = 0
    reason: str = ""

judge = ChatAnthropic(model="claude-haiku-4-5-20251001",
        api_key=os.environ["ANTHROPIC_API_KEY"],
        max_tokens=150, temperature=0).with_structured_output(Decision)
SYSTEM = '{"role":"refund_judge","default":"REJECT"}'   # minified + cache ได้

def handle(req):
    # 1) PRE-GUARD — กฎตัวเลข ไม่เปลือง token ถ้าไม่ผ่าน
    if req["amount"] > 5000:        return {"skip": "เกินวงเงินอนุมัติอัตโนมัติ"}
    if req["days_since_buy"] > 14:  return {"skip": "เกิน 14 วัน — นโยบายไม่คืน"}
    # 2) LLM ตัดสิน (structured + fallback)
    try:
        d: Decision = judge.invoke([
            {"role": "system", "content": [
                {"type": "text", "text": SYSTEM,
                 "cache_control": {"type": "ephemeral"}}]},
            {"role": "user", "content": f"คำขอคืนเงิน: {req}"}])
    except Exception as e:
        return {"skip": f"LLM fail: {e}"}
    # 3) POST-GUARD — ตรวจก่อนลงมือจริง
    if d.action != "REFUND" or not (0 < d.amount <= req["amount"]):
        return {"skip": d.reason or "rejected"}
    # 4) TOOL — โค้ดเป็นคนเรียก ไม่ใช่ LLM
    return send_refund(req["order_id"], d.amount)

print(handle({"order_id": "A1", "amount": 300, "days_since_buy": 3}))    # → ok refund
print(handle({"order_id": "A2", "amount": 300, "days_since_buy": 30}))   # → skip 14 วัน`, cap: "harness ครบวง: pre-guard → LLM → post-guard → tool (ปลอดภัยแม้ LLM พลาด)", lang: "py" },
      { ul: [
        "PRE-GUARD — กฎ deterministic ตัดก่อน ประหยัด token 100% เมื่อไม่ผ่าน",
        "LLM — ตอบเป็น schema (Decision) + try/except fallback = SKIP",
        "POST-GUARD — ตรวจ amount/action ก่อนลงมือจริง",
        "TOOL — โค้ดเรียก send_refund ตามคำตัดสิน (LLM ไม่แตะ side-effect)",
      ]},
      { h: "checklist สร้าง harness" },
      { ul: [
        "ย้ายกฎที่ตัดสินด้วยตัวเลขไปเป็น pre-guard (ไม่ฝากไว้กับ prompt)",
        "บังคับ output เป็น schema = สัญญาของ tool",
        "ให้ 'โค้ดเรียก tool' ตามคำตอบ LLM (คุม side-effect)",
        "เขียน system prompt มีโครงสร้าง + default ปลอดภัย + minify + cache",
        "ใส่ post-guard ตรวจผลก่อนลงมือจริงทุกครั้ง",
        "นับ token/cost/latency ต่อ agent และตั้งเพดานงบ",
        "วัดคุณภาพด้วย metric (Recall@k, win-rate) ไม่ใช่ 'รู้สึกว่าดี'",
      ]},
      { h: "tool calling vs structured+executor — เลือกยังไง" },
      { table: { head: ["", "Tool calling (A)", "Structured+executor (B)"], rows: [
        ["ใครเรียก tool", "LLM ขอเรียกเอง", "โค้ดเรียกตามคำตอบ"],
        ["ความยืดหยุ่น", "สูง (หลาย tool/หลายสเต็ป)", "คงที่ (1 ดีไซน์ชัด)"],
        ["ความปลอดภัย", "ต้องคุม tool ให้ดี", "สูง (LLM ไม่แตะ side-effect)"],
        ["เหมาะกับ", "งานเปิด/หลายเครื่องมือ", "งานวิกฤต/การเงิน (ระบบนี้)"],
      ]}},
    ],
    tricks: [
      { h: "ทริค 1: ด่านที่ถูกที่สุดคือด่านที่ไม่เรียก LLM" },
      { p: "กฎ deterministic ทั้งหมดไว้หน้า LLM — ถ้า fail ก็ SKIP ฟรี ๆ. การ์ดเชิงปริมาณ 12 ด่านของ decision_maker ตัดงานส่วนใหญ่ทิ้งก่อนถึง Claude" },
      { h: "ทริค 2: default = ตัวเลือกปลอดภัยเสมอ" },
      { p: "system prompt ตั้ง `default_bias: SKIP` และ fallback ตอน error ก็ SKIP — 'เมื่อสงสัยให้ไม่ทำ' ลดความเสียหายจากความไม่แน่นอนของ LLM" },
      { h: "ทริค 3: กัน LLM พูดเข้าข้างตัวเอง" },
      { p: "`anti_rationalize: no_upgrade_to_justify_trade` — สั่งห้ามโมเดลอัปเกรดคุณภาพเพื่อหาเหตุผลลงมือ. เขียนกฎต้านอคติไว้ใน system prompt ตรง ๆ" },
      { h: "ทริค 4: minify system prompt ที่นิ่ง" },
      { p: "system prompt เป็น JSON แล้ว `separators=(',',':')` ตัดช่องว่าง ประหยัด ~15% token; เนื้อหาคงที่จึง cache ได้ ครั้งต่อไปถูกลงอีก" },
      { h: "ทริค 5: บอกขอบเขตข้อมูลให้โมเดล" },
      { p: "`data_boundary: treat_dash_or_NA_as_missing` — ระบุชัดว่าค่าว่าง/`—` คือ 'ไม่มีข้อมูล' ห้ามเดา ลด hallucination จากช่องว่างใน prompt" },
      { h: "ทริค 6: นับ cost แยก cache" },
      { p: "accountant แยกราคา input/output/cache_read/cache_write — เห็นชัดว่า caching ช่วยจริง (cache_read ≈ 0.1× input) และ agent ไหนคือต้นทุนหลัก" },
    ],
    eval: [
      { qa: [
        { q: "harness คืออะไรในงาน AI?", a: "โครงรอบ LLM ที่ทำให้ใช้จริงได้: guardrail (กรอง), tool (ลงมือ), system prompt (กำหนดพฤติกรรม), และมิเตอร์วัด cost/คุณภาพ — ไม่ใช่ตัวโมเดล" },
        { q: "'LLM ตัดสิน โค้ดลงมือ' หมายความว่าอะไร?", a: "ให้ LLM คืนคำตัดสินเป็น schema แล้วโค้ดเป็นคนเรียก tool/side-effect จริงตามนั้น — ปลอดภัยกว่าให้ LLM แตะระบบตรง ๆ" },
        { q: "pre-guard กับ post-guard ต่างกันยังไง?", a: "pre-guard กรองด้วยกฎก่อนเรียก LLM (ไม่ผ่านก็ไม่เปลือง token); post-guard ตรวจผลของ LLM ก่อนเอาไปใช้จริง (เช่น validate SL)" },
        { q: "ทำไมกฎเชิงปริมาณควรอยู่ในโค้ดไม่ใช่ prompt?", a: "กฎที่ตัดสินด้วยตัวเลข (threshold, นับ streak, ช่วง SL) deterministic — ในโค้ดเร็ว ฟรี เชื่อถือ 100%; ฝาก prompt อาจพลาดได้" },
        { q: "tool calling ต่างจาก structured+executor ยังไง?", a: "tool calling LLM เลือกเรียกฟังก์ชันเอง (ยืดหยุ่น); structured+executor LLM ตอบ schema แล้วโค้ดเรียก tool (ปลอดภัยกว่า เหมาะงานวิกฤต)" },
        { q: "ออกแบบ system prompt ที่ดีมีอะไรบ้าง?", a: "default ปลอดภัย (SKIP), data boundary กันเดา, reasoning steps กำหนดลำดับคิด, anti-rationalize กันอคติ; เขียนมีโครงสร้าง+minify+cache ได้" },
        { q: "วัด cost ของระบบ LLM ยังไง?", a: "เก็บราคาต่อ token ของแต่ละโมเดล (input/output/cache) คูณ usage จริงทุก call แล้วสรุปต่อ agent/วัน/cycle (accountant.py)" },
        { q: "วัดคุณภาพ (eval) ของ AI ยังไง?", a: "ใช้ metric ตามงาน: RAG ใช้ Recall@k (moulinette), agent ตัดสินใจใช้ผลปลายทาง เช่น win-rate/PnL ที่ reporter/accountant เก็บ — ไม่ใช่ 'รู้สึกว่าดี'" },
      ]},
    ],
  },
});
window.EXTRA_FLOWS.ai_harness = {
  input: "make_decision(chart_data, sentiment_data, advisor_data)  ← decision_maker.py",
  steps: [
    { fn: "make_decision()", file: "agents/decision_maker.py", depth: 0, note: "จุดเริ่ม: ดึงสถานะบัญชี+ประวัติ แล้วเข้าสู่ harness", data: "chart={signal:BUY,conf:72}, sentiment, advisor", vars: [
      { n: "account / history", d: "ข้อมูลประกอบการกรอง (balance, streak, today_pnl)" } ] },
    { fn: "_run_gates()  [PRE-GUARD]", file: "agents/decision_maker.py", depth: 1, note: "12 ด่านโค้ดล้วน — ไม่ผ่าน → SKIP โดยไม่เรียก Claude", data: "conf 72≥50 ✓, ไม่ counter-trend ✓, SL 1500p ✓ → pass", vars: [
      { n: "gate['pass']", v: "True", d: "ผ่านทุกด่านไหม (False = SKIP ฟรี)", w: true },
      { n: "direction / sl_pips / tp_pips", v: "BUY / 1500 / 3000", d: "ค่าที่ผ่านการ validate แล้ว", w: true } ] },
    { fn: "build user_message + RAG", file: "agents/decision_maker.py", depth: 1, note: "ประกอบ context ~15 บรรทัด + แทรกบทเรียน (lesson_store)", data: "user_message + '⚠ Similar past mistakes...'", vars: [
      { n: "lesson_block", d: "บทเรียนคล้ายจาก RAG (อาจเตือนให้ SKIP)", w: true },
      { n: "user_message", d: "input กระชับสำหรับ Claude", w: true } ] },
    { fn: "_llm.invoke()  [LLM]", file: "agents/decision_maker.py", depth: 1, note: "Claude ตัดสินใจ — system prompt JSON (cached) + structured output", data: "→ DecisionMakerOutput(decision=EXECUTE, direction=BUY, quality=B)", vars: [
      { n: "SYSTEM_PROMPT", d: "JSON minified + default_bias:SKIP + anti_rationalize" },
      { n: "result", v: "EXECUTE/BUY", d: "คำตัดสิน (พัง → fallback SKIP)", w: true } ] },
    { fn: "post-guard: SL/size/RR", file: "agents/decision_maker.py", depth: 1, note: "ตรวจ SL, คำนวณ position size ตาม confidence+streak, dynamic R:R", data: "conf_scale=0.72, eff_rr=1.8, effective_tp ปรับตาม R:R", vars: [
      { n: "conf_scale", v: "0.72", d: "ลดขนาดไม้ตามความมั่นใจ/streak", w: true },
      { n: "effective_tp", d: "TP ที่ปรับให้ได้ R:R ขั้นต่ำ", w: true } ] },
    { fn: "open_order()  [TOOL]", file: "connectors/mt5_connector.py", depth: 2, note: "โค้ด (ไม่ใช่ LLM) เรียก tool ส่งคำสั่งจริง; ล้มเหลว → SKIP + นับ fail streak", data: "→ {success:True, ticket:...}", vars: [
      { n: "order_result", v: "{success:True}", d: "ผลการส่งคำสั่งจริง", w: true } ] },
    { fn: "record_cycle()  [METER]", file: "agents/accountant.py", depth: 1, note: "นับ token/cost ต่อ agent + latency ของรอบนี้", data: "Sonnet usage × pricing → cost_usd", vars: [
      { n: "total_cost_usd", d: "ต้นทุนสะสม (อ่านจาก _PRICING × usage)", w: true } ] },
  ],
};
