/* ============================================================
   AI Engineer track — สื่อการสอนสาย AI Engineer
   โค้ดอ้างอิงทั้งหมดเป็น "ตัวอย่าง generic" ที่อิงแนวทางจาก
   เอกสารผู้ให้บริการ (OpenAI / Anthropic / Google) และวิดีโอสอน
   — คัดลอกไปลองได้เอง ไม่ผูกกับโปรเจกต์ส่วนตัวของผู้เรียน

   ต่อท้าย window.TEACHING_DATA และเก็บ flow ใน window.EXTRA_FLOWS
   ============================================================ */
window.TEACHING_DATA = window.TEACHING_DATA || [];
window.EXTRA_FLOWS   = window.EXTRA_FLOWS   || {};

/* ===================== AI FOUNDATIONS (ปูพื้นฐานจากศูนย์) ===================== */
window.TEACHING_DATA.push({
  id: "ai_foundations",
  name: "AI Engineer — ปูพื้นฐานจากศูนย์",
  tag: { th: "เริ่มจากไม่รู้อะไรเลย: LLM คืออะไร, AI Engineer ทำอะไร, ระบบ AI จริงประกอบด้วยอะไรบ้าง — พร้อมตัวอย่างโค้ดที่คัดลอกไปรันได้", en: "From zero: what an LLM is, what an AI engineer does, the anatomy of a real AI system — with copy-paste runnable examples" },
  accent: "#34d399",
  sections: {
    principle: [
      { h: "หน้านี้สอนใครและสอนอะไร" },
      { p: "สำหรับคนที่ **ไม่เคยแตะ AI มาก่อน**. จบหน้านี้จะเข้าใจว่า LLM คืออะไร, อาชีพ AI Engineer ต่างจาก programmer ปกติยังไง, และระบบ AI จริง ๆ ประกอบด้วยชิ้นส่วนอะไรบ้าง — พร้อมโค้ดตัวอย่างที่ลองรันเองได้" },
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
      { h: "ระบบ AI จริงประกอบด้วยอะไร" },
      { p: "ระบบ AI ที่ใช้งานจริงมัก **ไม่ใช่ 'เรียก LLM ครั้งเดียวจบ'** แต่เป็น **หลายขั้นต่อกัน** แต่ละขั้นมีหน้าที่เฉพาะ — เหมือนสายการผลิต. ตัวอย่างผู้ช่วยตอบลูกค้า:" },
      { code: String.raw`รับคำถามลูกค้า
   → ค้นข้อมูลที่เกี่ยว (RAG)
   → LLM ร่างคำตอบ
   → ตรวจ/กรองคำตอบ (guardrail)
   → ส่งคำตอบ + บันทึก log/cost`, cap: "ระบบจริงคือ 'หลายขั้น' ต่อกัน ไม่ใช่ prompt เดียว", lang: "txt" },
      { h: "5 เสาหลักของสาย AI Engineer (= หน้าถัด ๆ ไป)" },
      { table: { head: ["เสา", "คืออะไร"], rows: [
        ["LLM + API", "เรียกโมเดล, prompt, structured output, คุม token"],
        ["Embeddings + Vector DB", "เปลี่ยนข้อความเป็นเวกเตอร์ แล้วค้นด้วยความหมาย"],
        ["RAG", "ดึงข้อมูลที่เกี่ยวมาเสริม prompt ก่อนตอบ"],
        ["Agents / LangGraph", "ต่อหลายขั้นเป็น state machine + routing"],
        ["Harness / Tool / Eval / Cost", "กรอง, ให้ LLM ลงมือ, วัดผล, คุมงบ"],
      ]}},
    ],
    theory: [
      { h: "1) Token — หน่วยที่ LLM มองเห็น (และที่เราจ่ายเงิน)" },
      { p: "LLM ไม่ได้อ่านเป็นตัวอักษรหรือคำ แต่อ่านเป็น **token** (ชิ้นคำ). คร่าว ๆ ภาษาอังกฤษ 1 token ≈ 4 ตัวอักษร ≈ 0.75 คำ. ค่าใช้จ่ายคิดตามจำนวน token เข้า (input) + ออก (output) — ยิ่ง prompt ยาว ยิ่งแพงและช้า" },
      { h: "2) Prompt = อินพุตเดียวของ LLM" },
      { p: "ทุกอย่างที่ LLM รู้ในรอบนั้นมาจาก prompt เท่านั้น. โครงสร้างมาตรฐานมี 2 ส่วน: **system** (บทบาท/กติกา ตั้งครั้งเดียว) และ **user** (ข้อมูล/คำถามรอบนี้)" },
      { code: String.raw`messages = [
  {"role": "system", "content": "คุณคือผู้ช่วยตอบลูกค้า ตอบสุภาพ กระชับ"},
  {"role": "user",   "content": "สินค้าคืนได้กี่วัน?"},
]`, cap: "โครงมาตรฐานที่ทุกผู้ให้บริการใช้เหมือนกัน", lang: "py" },
      { h: "3) ทำไมผลไม่แน่นอน — temperature" },
      { p: "LLM สุ่มเลือกคำถัดไปจากความน่าจะเป็น. **temperature** คุมความสุ่ม: 0 = เลือกตัวที่มั่นใจสุดเสมอ (ตอบนิ่ง เหมาะงานตัดสินใจ/ดึงข้อมูล), สูง = หลากหลาย (เหมาะงานสร้างสรรค์)" },
      { h: "4) Hallucination — ความเสี่ยงอันดับ 1" },
      { p: "LLM 'เดาคำ' ได้แม้ไม่รู้จริง → บางครั้งตอบผิดอย่างมั่นใจ (hallucinate). วิธีลด: (1) ป้อนข้อมูลจริงเข้า prompt (= RAG), (2) บังคับรูปแบบผลลัพธ์ (structured output), (3) มี fallback เมื่อผลไม่น่าเชื่อถือ" },
      { h: "5) SDK landscape — เครื่องมือที่ใช้บ่อย" },
      { table: { head: ["เครื่องมือ", "ใช้ทำ"], rows: [
        ["`openai` / `anthropic` / `google-genai`", "เรียกโมเดลของแต่ละค่ายตรง ๆ"],
        ["`langchain`", "ห่อ LLM + structured output + ต่อ chain"],
        ["`langgraph`", "ต่อหลายขั้นเป็น state graph (agent)"],
        ["Vector DB (pgvector / FAISS / Pinecone)", "เก็บ + ค้น embedding"],
      ]}},
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Anthropic — Intro to Claude", url: "https://docs.anthropic.com/en/docs/intro-to-claude", note: "ภาพรวม LLM + เริ่มต้นใช้ Claude" },
        { label: "What are tokens? (OpenAI help)", url: "https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them", note: "token คืออะไร นับยังไง (ใช้ได้ทุกโมเดล)" },
        { label: "Prompt engineering overview (Anthropic)", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", note: "หลักการเขียน prompt" },
      ]},
      { h: "📚 เอกสารผู้ให้บริการ (อ่านของจริงจากค่าย)" },
      { links: [
        { label: "OpenAI — A Practical Guide to Building Agents (PDF)", url: "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf", note: "เล่มทางการ ปูตั้งแต่ agent คืออะไร" },
        { label: "OpenAI Cookbook (หน้าหลัก)", url: "https://cookbook.openai.com/", note: "ตัวอย่างโค้ดจริงเยอะมาก" },
        { label: "Anthropic Academy — Build with Claude", url: "https://www.anthropic.com/learn/build-with-claude", note: "คอร์สทางการของ Anthropic" },
        { label: "Google — Gemini API quickstart", url: "https://ai.google.dev/gemini-api/docs/quickstart", note: "เริ่มต้นกับ Gemini" },
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
        "**API key** ของผู้ให้บริการโมเดล (เช่น OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY) — เก็บใน `.env` ห้าม hardcode",
        "Python 3.10+ และ virtualenv",
        "ความเข้าใจ JSON + async เบื้องต้น",
        "ฐานข้อมูลที่รองรับ vector ถ้าจะทำ RAG (เช่น Postgres + pgvector)",
      ]},
      { h: "เก็บ key อย่างปลอดภัย" },
      { code: String.raw`# .env  (อยู่ใน .gitignore ห้าม commit)
ANTHROPIC_API_KEY=sk-ant-...

# โค้ดอ่านค่าจาก env ไม่ hardcode
import os
API_KEY = os.environ["ANTHROPIC_API_KEY"]`, cap: "เปลี่ยน key ได้โดยไม่แตะโค้ด และไม่หลุดขึ้น git", lang: "py" },
      { h: "เรียก LLM ครั้งแรก (hello world ของ AI Engineer)" },
      { code: String.raw`# pip install anthropic
import os, anthropic
client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
resp = client.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=200,
    messages=[{"role": "user", "content": "อธิบาย AI Engineer ใน 1 ประโยค"}],
)
print(resp.content[0].text)`, cap: "โครงเดียวกันทุกค่าย: เลือก model + max_tokens + messages", lang: "py" },
      { h: "หลักการแบ่งโค้ดของระบบ AI" },
      { code: String.raw`my_ai_app/
├─ llm.py        ← ห่อการเรียกโมเดล (client + helper)
├─ vectordb.py   ← embed + ค้น (สำหรับ RAG)
├─ agents/       ← แต่ละขั้น 1 ไฟล์ (1 หน้าที่)
├─ schemas.py    ← รูปแบบ output (pydantic)
└─ config.py     ← โหลด key + ตั้งค่า`, cap: "แยกหน้าที่ให้ชัด ทดสอบ/แก้ทีละชิ้นได้", lang: "txt" },
      { note: "หลักสำคัญ: **1 ขั้น = 1 หน้าที่เดียว**. อย่าให้ prompt เดียวทำทุกอย่าง — แตกเป็นชิ้นเล็กแล้วต่อกัน ทำให้ทดสอบ/แก้/วัด cost ทีละตัวได้" },
    ],
    architecture: [
      { h: "ภาพรวม: input → คำตอบ/การลงมือ" },
      { code: String.raw`ข้อมูลผู้ใช้ ─┐
ข้อมูลภายนอก ┤→ [ขั้นวิเคราะห์ทีละชั้น] → ตัดสินใจ → ลงมือ/ตอบ
ความจำเก่า ──┘        (RAG: ข้อมูลที่เกี่ยว)`, cap: "ระบบรวม 3 แหล่ง: input สด + ความรู้โมเดล + ข้อมูลที่ค้นมา (RAG)", lang: "txt" },
      { h: "ทำไมต้องหลายขั้น ไม่ใช่ prompt เดียวยาว ๆ" },
      { ul: [
        "**แม่นกว่า** — แต่ละขั้นโฟกัสงานเดียว prompt สั้น โอกาส hallucinate น้อย",
        "**ถูกกว่า** — งานง่ายใช้โมเดลถูก (Haiku/mini), งานยากใช้โมเดลแพง (Sonnet/GPT)",
        "**แก้/วัดได้ทีละตัว** — รู้ว่าขั้นไหนพัง/กิน token เท่าไร",
        "**เพิ่ม/ถอดได้** — เสริมขั้นใหม่โดยไม่รื้อทั้งระบบ",
      ]},
      { h: "เลเยอร์ของโค้ด" },
      { table: { head: ["เลเยอร์", "หน้าที่"], rows: [
        ["Orchestration", "ลำดับ + routing ของแต่ละขั้น (LangGraph)"],
        ["Agent/Step (สมอง)", "เรียก LLM + ตรรกะเฉพาะทาง"],
        ["Schema (สัญญา)", "บังคับรูปแบบ output"],
        ["Memory (ความจำ)", "RAG เก็บ/ค้นข้อมูล"],
        ["Tool (แขนขา)", "ดึงข้อมูล/ลงมือทำจริง"],
        ["Metering (มิเตอร์)", "นับ token + latency + cost"],
      ]}},
    ],
    dataflow: [
      { h: "1 รอบของระบบ — ข้อมูลไหลผ่าน state กลาง" },
      { p: "ระบบหลายขั้นมัก **ส่งต่อกันผ่าน state** (dict กลางที่ทุกขั้นอ่าน/เขียน) แทนการคุยกันตรง ๆ — ทำให้ลำดับยืดหยุ่น ข้าม/ลัด/วนได้" },
      { code: String.raw`state = {}                  # เริ่มว่าง
state["docs"]    = retrieve(question)      # ขั้น 1 เติม docs
state["draft"]   = llm_answer(state)       # ขั้น 2 เติม draft
state["checked"] = guard(state["draft"])   # ขั้น 3 เติมผลตรวจ
return state["checked"]`, cap: "แต่ละขั้นเติมข้อมูลของตัวเองลง state เดียว", lang: "py" },
      { note: "ดูการไหลแบบ interactive ได้ที่แท็บ Visualizer ▶ — ไล่ทีละขั้นพร้อมตัวแปรที่ถูกเขียน" },
    ],
    implementation: [
      { h: "🧪 ตัวอย่างใช้งานครบ (คัดลอกไปลองได้)" },
      { p: "โครงสร้าง: `client` → ฟังก์ชัน `ask()` (เรียก LLM 1 ครั้ง) → ต่อ 2 สเตปเป็น mini pipeline (สรุป → ตัดสินทิศ) เห็นภาพ 'หลาย step ต่อกัน' ตั้งแต่ต้น" },
      { code: String.raw`# pip install anthropic   |   export ANTHROPIC_API_KEY=sk-ant-...
import os, anthropic
client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

def ask(prompt, model="claude-haiku-4-5-20251001", max_tokens=200):
    r = client.messages.create(model=model, max_tokens=max_tokens,
                               messages=[{"role": "user", "content": prompt}])
    return r.content[0].text.strip()

review = "ของดีมาก ส่งไว แต่กล่องบุบนิดหน่อย"
summary = ask(f"สรุปรีวิวนี้สั้น ๆ 1 ประโยค:\n{review}")            # step 1
verdict = ask(f"รีวิวนี้ positive/negative/neutral? ตอบคำเดียว:\n{summary}")  # step 2
print("สรุป:", summary)
print("ผล :", verdict)`, cap: "แอป AI ตัวแรก — เรียก LLM + ต่อ 2 สเตป (รันได้จริงด้วย key)", lang: "py" },
      { ul: [
        "`client` — ตัวเชื่อมกับโมเดล สร้างครั้งเดียว",
        "`ask()` — ห่อ 1 LLM call ให้เรียกซ้ำง่าย",
        "step 1→2 — ส่งผลสเตปแรกเป็น input สเตปถัดไป = แนวคิด pipeline",
        "อยากฉลาดขึ้นเปลี่ยน model เป็น `claude-sonnet-4-6`",
      ]},
      { h: "เส้นทางการเรียนสาย AI Engineer (แนะนำลำดับ)" },
      { ul: [
        "1. **LLM + API** — เรียกโมเดล, prompt, structured output, คุม token/context",
        "2. **Embeddings + Vector DB** — ค้นด้วยความหมาย",
        "3. **RAG** — เอา 1+2 มารวม: ดึงข้อมูลเสริม prompt",
        "4. **Agents / LangGraph** — ต่อหลายขั้นเป็นระบบ",
        "5. **Harness/Tool/Eval/Cost** — กรอง, ลงมือ, วัดผล, คุมงบ",
      ]},
      { h: "กฎเหล็กของ production AI" },
      { table: { head: ["กฎ", "ทำไม"], rows: [
        ["ทุก LLM call มี try/except + fallback", "API ล่ม/ตอบเพี้ยนได้เสมอ"],
        ["บังคับ output เป็น schema", "ไม่งั้น parse ข้อความอิสระแล้วพังบ่อย"],
        ["ใส่ max_tokens เสมอ", "กันค่าใช้จ่าย/เวลาบานปลาย"],
        ["log token + latency ทุก call", "ไม่วัด = คุม cost ไม่ได้"],
        ["เลือกโมเดลตามงาน", "งานง่ายใช้ตัวถูก งานยากใช้ตัวฉลาด"],
      ]}},
    ],
    tricks: [
      { h: "ทริค 1: เริ่มจากโมเดลถูกก่อนเสมอ" },
      { p: "ลองงานด้วยโมเดลถูก (Haiku / GPT-mini) ก่อน ถ้าคุณภาพพอก็จบ. ค่อยอัปเกรดเฉพาะขั้นที่ต้องการความฉลาดสูงจริง ๆ" },
      { h: "ทริค 2: คิดเป็น pipeline ไม่ใช่ prompt ยักษ์" },
      { p: "อย่ายัดทุกอย่างใน prompt เดียว — แตกเป็นขั้นเล็ก ๆ ต่อกัน. ดีบั๊กง่าย วัด cost แยกได้ และแต่ละชิ้นแม่นขึ้น" },
      { h: "ทริค 3: ออกแบบ fallback ตั้งแต่แรก" },
      { p: "ทุกขั้นควรมีค่า default เมื่อ LLM พัง เพื่อให้ระบบเดินต่อได้แม้ตัวใดตัวหนึ่งล้ม" },
      { h: "ทริค 4: วัดทุกอย่างเป็นตัวเลข" },
      { p: "นับ token+latency ต่อขั้น; RAG วัด Recall@k. ของที่วัดไม่ได้ = ปรับปรุงไม่ได้" },
    ],
    eval: [
      { qa: [
        { q: "LLM ทำงานยังไงในหนึ่งประโยค?", a: "ทำนาย token ถัดไปจากข้อความที่ป้อนเข้าไป ทีละ token จนจบ — ความสามารถทุกอย่างมาจากการเดาคำต่อไปได้แม่น" },
        { q: "AI Engineer ต่างจาก ML Engineer ยังไง?", a: "AI Engineer เอาโมเดลสำเร็จมาประกอบเป็นระบบใช้งานจริง (API, prompt, RAG, agent, cost); ML Engineer เน้นสร้าง/เทรนโมเดลเอง" },
        { q: "token คืออะไร ทำไมสำคัญ?", a: "หน่วยชิ้นคำที่ LLM อ่าน และเป็นหน่วยคิดเงิน (input+output) ยิ่งมากยิ่งแพง/ช้า — ต้องออกแบบให้พอดีงาน" },
        { q: "ทำไมระบบจริงใช้หลายขั้น ไม่ใช่ prompt เดียว?", a: "แต่ละขั้นโฟกัสงานเดียว → แม่นกว่า, เลือกโมเดลตามงานได้ (ถูกกว่า), ทดสอบ/วัด cost/แก้ทีละตัวได้" },
        { q: "hallucination คืออะไร ป้องกันยังไง?", a: "LLM ตอบผิดอย่างมั่นใจเพราะมันแค่เดาคำ; ลดด้วย RAG (ป้อนข้อมูลจริง), structured output, และ fallback" },
        { q: "temperature=0 หมายความว่าอะไร?", a: "ให้โมเดลเลือกคำที่มั่นใจสุดเสมอ ผลคงเส้นคงวา เหมาะงานตัดสินใจ; ค่าสูงผลหลากหลายเหมาะงานสร้างสรรค์" },
        { q: "5 เสาหลักของสาย AI Engineer คือ?", a: "LLM+API, Embeddings+Vector DB, RAG, Agents/LangGraph, และ Harness/Tool/Eval/Cost" },
        { q: "state ในระบบหลายขั้นคืออะไร?", a: "dict กลางที่ทุกขั้นอ่าน/เขียนเพื่อส่งต่อข้อมูลกัน แทนการคุยกันตรง ๆ ทำให้ลำดับยืดหยุ่น" },
      ]},
    ],
  },
});
window.EXTRA_FLOWS.ai_foundations = {
  input: "mini pipeline: รีวิวสินค้า → สรุป → ตัดสิน sentiment",
  steps: [
    { fn: "script", file: "app.py", depth: 0, note: "รับข้อความเข้า เตรียมเรียก LLM", data: "review = 'ของดีมาก ส่งไว...'", vars: [
      { n: "review", v: "\"ของดีมาก...\"", d: "ข้อความ input ดิบ" } ] },
    { fn: "ask() — step 1 สรุป", file: "app.py", depth: 1, note: "เรียก LLM ครั้งที่ 1: ย่อรีวิว", data: "→ summary 1 ประโยค", vars: [
      { n: "prompt", d: "คำสั่งสรุป + review" },
      { n: "summary", v: "\"ดี ส่งไว กล่องบุบ\"", d: "ผลสเตป 1", w: true } ] },
    { fn: "ask() — step 2 ตัดสิน", file: "app.py", depth: 1, note: "เรียก LLM ครั้งที่ 2: ใช้ summary หา sentiment", data: "→ 'positive'", vars: [
      { n: "summary", d: "อินพุตของสเตป 2 (ผลจากสเตป 1)" },
      { n: "verdict", v: "\"positive\"", d: "ผลสุดท้าย", w: true } ] },
    { fn: "print", file: "app.py", depth: 1, note: "แสดงผลทั้ง 2 สเตป", data: "สรุป + ผล", vars: [] },
  ],
};

/* ===================== AI LLM + API (context window + token design) ===================== */
window.TEACHING_DATA.push({
  id: "ai_llm",
  name: "LLM & API — เรียกโมเดล + คุม token/context",
  tag: { th: "เรียกโมเดลให้ได้ผลที่เอาไปใช้ต่อได้จริง: structured output, prompt caching, เลือกโมเดลตามงาน, ออกแบบ context window และ token budget ให้เหมาะกับงาน", en: "Calling LLMs for production: structured output, prompt caching, model selection, and designing context windows / token budgets" },
  accent: "#60a5fa",
  sections: {
    principle: [
      { h: "หน้านี้สอนอะไร" },
      { p: "วิธีเรียก LLM ให้ได้ผลลัพธ์ที่ **เอาไปใช้ต่อในโค้ดได้จริง** (ไม่ใช่ข้อความลอย ๆ) และวิธี **ออกแบบ token/context ให้เหมาะกับงาน** — เพราะ context มีจำกัดและทุก token มีราคา" },
      { h: "ปัญหาหลักของการเรียก LLM ดิบ ๆ" },
      { ul: [
        "ผลออกมาเป็นข้อความอิสระ → parse ยาก พังบ่อย (แก้: **structured output**)",
        "prompt ยาวซ้ำ ๆ ทุกครั้ง → แพง+ช้า (แก้: **prompt caching**)",
        "ส่งข้อมูลดิบทั้งหมด → เกิน budget (แก้: **สรุป/คัดก่อนส่ง**)",
        "ใช้โมเดลแพงกับงานง่าย → เปลืองเงิน (แก้: **เลือกโมเดลตามงาน**)",
      ]},
      { h: "structured output คือพระเอก" },
      { p: "แทนที่จะหวังให้ LLM ตอบ JSON เองแล้วมานั่ง parse — เรา**บังคับ schema** ด้วย pydantic. ได้ object ที่ field ครบ type ถูกเสมอ" },
      { code: String.raw`from pydantic import BaseModel, Field
from typing import Literal

class Review(BaseModel):
    sentiment: Literal["positive", "negative", "neutral"]  # บังคับค่าที่ยอมรับ
    score: int = Field(ge=0, le=100)                        # คุมช่วงเลข
    reason: str = Field(default="", description="สั้นไม่เกิน 60 ตัวอักษร")`, cap: "schema = สัญญาของผลลัพธ์ (รูปแบบนี้ทุกค่ายรองรับ)", lang: "py" },
    ],
    theory: [
      { h: "1) Context window — โต๊ะทำงานของโมเดล" },
      { p: "**Context window** คือจำนวน token สูงสุดที่โมเดลรับได้ในหนึ่งครั้ง (input + output รวมกัน). เปรียบเป็นโต๊ะทำงาน — ของที่วางบนโต๊ะเท่านั้นที่โมเดลเห็น. เกินโต๊ะ = ต้องตัดทิ้ง. โมเดลใหม่มี context ใหญ่ แต่ 'ใส่ได้' ไม่ได้แปลว่า 'ควรใส่' — ยิ่งยัดเยอะยิ่งแพง ช้า และโฟกัสหลุด" },
      { h: "2) input token vs output token" },
      { table: { head: ["", "input", "output"], rows: [
        ["คืออะไร", "prompt ที่เราส่งเข้า", "คำตอบที่โมเดลสร้าง"],
        ["ราคา (ต่อ token)", "ถูกกว่า", "แพงกว่า (มักหลายเท่า)"],
        ["คุมยังไง", "สรุป/คัด/แคชก่อนส่ง", "`max_tokens` + ขอผลสั้น"],
      ]}},
      { note: "เพราะ output แพงกว่า — จึงควรตั้ง `max_tokens` พอดี, ขอผลสั้น, และตัด field ที่ไม่ได้ใช้ออกจาก schema เพื่อลด output token" },
      { h: "3) prompt caching — จ่ายครั้งเดียวสำหรับส่วนที่ซ้ำ" },
      { p: "system prompt ยาว ๆ (กติกา/รูปแบบ) เหมือนกันทุกรอบ. **prompt caching** ให้ผู้ให้บริการเก็บส่วนนั้นไว้ จ่ายเต็มครั้งแรก ครั้งต่อ ๆ ไปคิดถูกลงมาก (Anthropic เคลมลด cost ได้ถึง ~90% / latency ~85%)" },
      { code: String.raw`messages = [
  {"role": "system", "content": [
    {"type": "text", "text": SYSTEM_PROMPT,
     "cache_control": {"type": "ephemeral"}}   # ← แคชส่วนนี้ (Anthropic)
  ]},
  {"role": "user", "content": user_message},     # ส่วนที่เปลี่ยนทุกรอบ
]`, cap: "วางของที่ซ้ำ/คงที่ไว้ต้น prompt เพื่อให้ cache hit สูงสุด", lang: "py" },
      { h: "4) เลือกโมเดลตามงาน (model routing)" },
      { p: "ไม่ใช่ทุกงานต้องใช้โมเดลฉลาดสุด. ใช้ **โมเดลถูก/เร็ว** (Haiku, GPT-mini, Gemini Flash) สำหรับงานง่าย/ปริมาณมาก เช่นสรุป/จัดหมวด และ **โมเดลฉลาดกว่า** (Sonnet, GPT, Gemini Pro) สำหรับงานตัดสินใจ/วิเคราะห์ซับซ้อน" },
      { h: "5) temperature & max_tokens" },
      { p: "`temperature=0` → ตอบนิ่งคงเส้นคงวา (เหมาะงานดึงข้อมูล/ตัดสินใจ). `max_tokens` → เพดานความยาวคำตอบ กันบานปลาย. ทั้งคู่ตั้งตอนสร้าง client" },
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Anthropic — Messages API", url: "https://docs.anthropic.com/en/api/messages", note: "พารามิเตอร์ทั้งหมด" },
        { label: "Anthropic — Context windows", url: "https://docs.anthropic.com/en/docs/build-with-claude/context-windows", note: "context window ทำงานยังไง" },
        { label: "LangChain — structured output", url: "https://python.langchain.com/docs/concepts/structured_outputs/", note: "with_structured_output()" },
      ]},
      { h: "📚 เอกสารผู้ให้บริการ (อ่านของจริงจากค่าย)" },
      { links: [
        { label: "Anthropic — Prompt caching", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching", note: "cache_control + ราคา cache" },
        { label: "OpenAI — Structured Outputs", url: "https://platform.openai.com/docs/guides/structured-outputs", note: "บังคับ schema ฝั่ง OpenAI" },
        { label: "OpenAI — Prompt caching", url: "https://platform.openai.com/docs/guides/prompt-caching", note: "caching ฝั่ง OpenAI" },
        { label: "Google — Gemini context caching", url: "https://ai.google.dev/gemini-api/docs/caching", note: "caching ฝั่ง Gemini" },
        { label: "Anthropic — Models & pricing", url: "https://docs.anthropic.com/en/docs/about-claude/models", note: "เทียบ Haiku/Sonnet/Opus เลือกตามงาน" },
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
      { h: "กายวิภาคของหนึ่ง LLM call (structured)" },
      { code: String.raw`# pip install langchain-anthropic pydantic
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(
    model="claude-haiku-4-5-20251001",
    max_tokens=200,              # เพดาน output
    temperature=0,              # ความสุ่ม (0 = นิ่ง)
).with_structured_output(Review)  # บังคับรูปแบบผล

parsed = llm.invoke(messages)   # ได้ Review object เลย
parsed.sentiment                 # "positive" — ใช้ต่อได้ทันที`, cap: "ตั้งครั้งเดียวระดับ module ใช้ซ้ำทุกรอบ", lang: "py" },
      { h: "ทำไม schema สำคัญกว่าที่คิด" },
      { table: { head: ["ไม่มี schema", "มี schema (pydantic)"], rows: [
        ["ได้ string ต้อง parse เอง", "ได้ object พร้อมใช้"],
        ["LLM อาจตอบนอกกรอบ", "Literal บังคับค่าที่ยอมรับ"],
        ["เลขอาจเกินช่วง", "Field(ge=0, le=100) คุมช่วง"],
        ["พังเงียบ ๆ", "validate error จับได้ทันที"],
      ]}},
      { h: "field มีราคา — ออกแบบ schema ให้ผอม" },
      { p: "ทุก field ที่ให้ LLM สร้าง = output token ที่ต้องจ่าย. เก็บเฉพาะ field ที่ downstream ใช้จริง ตัดที่ generate แล้วทิ้งออก เพื่อลด output token" },
    ],
    architecture: [
      { h: "แยก prompt ออกจากโค้ด" },
      { p: "เก็บ system prompt เป็นไฟล์แยก (เช่น `prompts/*.json` หรือ `.txt`) แล้วโหลดเข้ามา — แก้ prompt ได้โดยไม่แตะโค้ด และทำให้ caching ทำงานได้ (เนื้อหาคงที่)" },
      { code: String.raw`import json
from pathlib import Path
SYSTEM_PROMPT = json.dumps(
    json.loads(Path("prompts/review.json").read_text(encoding="utf-8")),
    separators=(",", ":"),   # บีบช่องว่างออก → ประหยัด token
)`, cap: "แม้แต่ช่องว่างใน JSON ก็บีบออกเพื่อลด token", lang: "py" },
      { h: "module-level client (สร้างครั้งเดียว)" },
      { p: "สร้าง client/LLM ตอน import ระดับ module ไม่ใช่สร้างใหม่ทุก call — ลด overhead และตั้งค่า (model, temp, schema) ไว้ที่เดียว" },
      { h: "งบ token ของหนึ่ง prompt" },
      { table: { head: ["ส่วน", "กลยุทธ์"], rows: [
        ["system prompt", "ไฟล์ JSON บีบแล้ว + แคช (cache_control)"],
        ["ข้อมูลยาว", "สรุปด้วยโมเดลถูกก่อนส่ง"],
        ["ข้อมูลที่เกี่ยว", "คัดด้วย vector search (top-k)"],
        ["output", "max_tokens พอดี + schema ผอม"],
      ]}},
    ],
    dataflow: [
      { h: "การไหลของ analyze(text)" },
      { code: String.raw`text
   │
   ├─ ประกอบ messages = [system(cached), user(text)]
   │
   ├─ llm.invoke(messages) → Review (structured)
   │      └─ except → fallback {neutral, 0}
   │
   └─ return {sentiment, score, reason}`, cap: "ก่อนถึง LLM แคช system; หลัง LLM มี fallback", lang: "txt" },
      { h: "fallback เมื่อ LLM พัง" },
      { code: String.raw`try:
    r = llm.invoke(messages)
    result = r.model_dump()
except Exception as e:
    result = {"sentiment": "neutral", "score": 0, "reason": f"fail:{e}"}`, cap: "ไม่ว่าจะ timeout/parse fail — ได้ค่ากลาง เดินต่อได้", lang: "py" },
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
        "ใช้ structured output ทุกครั้งที่ต้องเอาผลไปใช้ต่อ",
        "แคช system prompt ที่คงที่",
        "ห่อด้วย try/except + fallback ที่สมเหตุสมผล",
        "ลด token ก่อนส่ง: สรุป, คัด, บีบช่องว่าง",
        "log token usage ให้มิเตอร์อ่าน",
      ]},
      { h: "ออกแบบ context window ให้เหมาะกับงาน" },
      { table: { head: ["งาน", "ใส่ context แค่ไหน", "เหตุผล"], rows: [
        ["สรุปข้อความ", "ข้อความดิบ (ครั้งเดียว)", "งานง่าย โมเดลถูกพอ"],
        ["ตอบจากเอกสาร", "เฉพาะ chunk ที่เกี่ยว (top-k)", "ไม่ต้องยัดทั้งเอกสาร"],
        ["ตัดสินใจ", "ผลสรุปของขั้นก่อน", "ใส่ข้อสรุป ไม่ใช่ raw"],
      ]}},
      { note: "หลักคิด: **ใส่ให้น้อยที่สุดเท่าที่ยังตอบถูก** — ทุก token ที่ตัดออกได้คือเงินและความเร็วที่ได้คืน และช่วยให้โมเดลโฟกัส" },
    ],
    tricks: [
      { h: "ทริค 1: บีบ JSON system prompt" },
      { p: "`json.dumps(..., separators=(',',':'))` ตัดช่องว่างทั้งหมด — system prompt ยาว ๆ ประหยัด token ได้จริงโดยความหมายไม่เปลี่ยน" },
      { h: "ทริค 2: สรุปด้วยโมเดลถูกก่อนส่งโมเดลแพง" },
      { p: "ใช้โมเดลถูก (Haiku/mini) ย่อข้อมูลก่อน แล้วค่อยส่งสรุปให้โมเดลแพง — 'pre-summarization' ลด cost ของโมเดลแพงได้มาก" },
      { h: "ทริค 3: schema ผอม = output ถูก" },
      { p: "ตัด field ที่ไม่ได้ใช้ออกจาก output schema. ทุก field ที่ LLM ต้องสร้างคือ token ที่จ่าย" },
      { h: "ทริค 4: Literal + Field กันค่าเพี้ยน" },
      { p: "`Literal[...]` บังคับตอบเฉพาะค่าที่กำหนด, `Field(ge, le)` คุมช่วงเลข — ลด hallucination ที่ระดับ schema" },
      { h: "ทริค 5: cache เฉพาะส่วนที่นิ่ง" },
      { p: "แคช system prompt (คงที่) ไม่แคช user message (เปลี่ยนทุกรอบ) — วางของซ้ำไว้ต้น prompt เพื่อ cache hit สูงสุด" },
    ],
    eval: [
      { qa: [
        { q: "context window คืออะไร?", a: "จำนวน token สูงสุดที่โมเดลรับได้ต่อครั้ง (input+output รวมกัน) — เหมือนโต๊ะทำงาน ของบนโต๊ะเท่านั้นที่โมเดลเห็น เกินต้องตัดทิ้ง" },
        { q: "ทำไม output token แพงกว่า input?", a: "การสร้างคำใหม่ใช้ compute มากกว่าการอ่าน — จึงคุมด้วย max_tokens และขอผลสั้น/schema ผอม" },
        { q: "structured output ดียังไง?", a: "บังคับ schema (pydantic) → ได้ object field ครบ type ถูกเสมอ ไม่ต้อง parse ข้อความอิสระ ลด bug และ hallucination" },
        { q: "prompt caching ช่วยอะไร?", a: "แคชส่วน prompt ที่ซ้ำทุกครั้ง (เช่น system prompt) จ่ายเต็มครั้งแรก ครั้งต่อไปถูกลงมาก" },
        { q: "เลือกโมเดลตามงานยังไง?", a: "งานง่าย/ปริมาณมากใช้โมเดลถูกเร็ว (Haiku/mini/Flash); งานยาก/ตัดสินใจใช้โมเดลฉลาดกว่า (Sonnet/GPT/Pro)" },
        { q: "temperature=0 ใช้เมื่อไร?", a: "งานที่ต้องการผลคงเส้นคงวา/ตัดสินใจ/ดึงข้อมูล; งานสร้างสรรค์ใช้ค่าสูงกว่า" },
        { q: "ออกแบบ token budget ให้เหมาะกับงานยังไง?", a: "ใส่ context น้อยสุดเท่าที่ยังตอบถูก: สรุปด้วยโมเดลถูก, คัดด้วย vector search, บีบช่องว่าง, ตัด field ที่ไม่ใช้, ตั้ง max_tokens" },
        { q: "ถ้า LLM ตอบเพี้ยน/ล่ม ทำยังไง?", a: "ห่อ try/except แล้วคืนค่า fallback ที่ปลอดภัยเพื่อให้ทั้งระบบเดินต่อได้" },
      ]},
    ],
  },
});
window.EXTRA_FLOWS.ai_llm = {
  input: "analyze('ของดีมาก ส่งไว ใช้แล้วประทับใจ')",
  steps: [
    { fn: "analyze(text)", file: "app.py", depth: 0, note: "จุดเริ่ม: รับข้อความ ต้องการผลแบบ structured", data: "text = 'ของดีมาก ส่งไว...'", vars: [
      { n: "text", v: "\"ของดีมาก...\"", d: "ข้อความที่จะวิเคราะห์" } ] },
    { fn: "build messages", file: "app.py", depth: 1, note: "ประกอบ system(cached) + user", data: "messages=[system, user]", vars: [
      { n: "SYSTEM", d: "กติกาคงที่ → ติด cache_control ephemeral" },
      { n: "messages", d: "system(แคช) + user(เปลี่ยนทุกรอบ)", w: true } ] },
    { fn: "llm.invoke(messages)", file: "langchain-anthropic", depth: 1, note: "เรียกโมเดลแบบ structured output (temperature=0)", data: "→ Review(sentiment=positive, score=92)", vars: [
      { n: "parsed", v: "Review(...)", d: "object พร้อมใช้ (ไม่ต้อง parse)", w: true } ] },
    { fn: "parse → result / fallback", file: "app.py", depth: 2, note: "สำเร็จ → model_dump(); พัง → fallback neutral 0", data: "→ {sentiment:'positive', score:92}", vars: [
      { n: "result", v: "{sentiment:positive,...}", d: "ผลที่ส่งต่อไปใช้งาน", w: true } ] },
  ],
};

/* ===================== AI VECTOR DB & EMBEDDINGS ===================== */
window.TEACHING_DATA.push({
  id: "ai_vector",
  name: "Embeddings & Vector DB — ค้นด้วยความหมาย",
  tag: { th: "เปลี่ยนข้อความเป็นเวกเตอร์ตัวเลข แล้วค้นด้วย 'ความหมาย' ไม่ใช่คำตรงตัว: embedding, cosine similarity, มิติของเวกเตอร์, pgvector และ ANN search", en: "Turn text into number vectors and search by meaning, not keywords: embeddings, cosine similarity, dimensions, pgvector and ANN search" },
  accent: "#c084fc",
  sections: {
    principle: [
      { h: "ปัญหาที่ embedding มาแก้" },
      { p: "การค้นแบบคำตรงตัว (keyword) หา 'ความหมายที่ใกล้กัน' ไม่ได้ — ค้น \"คืนสินค้า\" จะไม่เจอ \"ขอเงินคืน\" ทั้งที่หมายความใกล้กัน. **embedding** แก้ตรงนี้: เปลี่ยนข้อความเป็น **เวกเตอร์ตัวเลข** ที่ข้อความความหมายใกล้กัน → เวกเตอร์อยู่ใกล้กันในปริภูมิ" },
      { h: "embedding คืออะไร (ภาพ)" },
      { code: String.raw`"ขอเงินคืนได้ไหม"   → [0.12, -0.84, 0.33, ...]  (384 / 768 / 3072 ตัวเลข)
"นโยบายการคืนสินค้า" → [0.10, -0.81, 0.35, ...]  ← ใกล้กันมาก
"วันนี้อากาศดี"      → [0.77,  0.20, -0.6, ...]  ← อยู่ไกล`, cap: "ข้อความ → เวกเตอร์; ความหมายใกล้ = ระยะใกล้", lang: "txt" },
      { h: "ใช้ทำอะไร" },
      { p: "เก็บเอกสารแต่ละชิ้นเป็นเวกเตอร์ไว้ก่อน. พอมีคำถาม ก็เปลี่ยนคำถามเป็นเวกเตอร์ แล้วค้นหาเอกสาร **top-k ที่ความหมายใกล้ที่สุด** — นี่คือครึ่งแรกของ RAG (การค้น)" },
      { note: "หน้า RAG จะเอาผลค้นนี้ไปเสริม prompt ก่อนให้ LLM ตอบต่อ" },
      { h: "ทำไมต้องมี Vector DB แยก" },
      { ul: [
        "เวกเตอร์มีหลายร้อย-พันมิติ × ข้อมูลเป็นล้านแถว → ค้นแบบเทียบทุกคู่ช้าเกิน",
        "Vector DB (เช่น **pgvector**, FAISS, Pinecone) มี index เฉพาะ (ANN) ค้นเพื่อนบ้านใกล้สุดได้เร็ว",
        "เก็บ embedding + metadata (แหล่ง, เวลา) ไว้ด้วยกัน กรองก่อนค้นได้",
      ]},
    ],
    theory: [
      { h: "1) มิติ (dimension) ของเวกเตอร์" },
      { p: "embedding model แต่ละตัวให้เวกเตอร์ขนาดต่างกัน (เช่น 384, 768, 1536, 3072). **มิติมาก = ละเอียดแต่เปลือง storage/ช้า**. บางโมเดลลดมิติได้ด้วยพารามิเตอร์ (เช่น `output_dimensionality` / `dimensions`)" },
      { h: "2) cosine similarity — วัดความใกล้" },
      { p: "วัดความเหมือนของเวกเตอร์ 2 ตัวด้วย **มุมระหว่างมัน** (ไม่สนความยาว). ค่า 1 = ทิศเดียวกัน (เหมือนมาก), 0 = ตั้งฉาก (ไม่เกี่ยว), -1 = ตรงข้าม. ถ้า normalize เวกเตอร์แล้ว cosine = dot product" },
      { h: "3) task_type — embed ต่างกันตอน store กับ query" },
      { p: "embedding model ดี ๆ ให้บอกว่ากำลัง embed 'เอกสารเพื่อเก็บ' หรือ 'คำค้น' — ทำให้ผลค้นแม่นขึ้น (เช่น Gemini ใช้ `RETRIEVAL_DOCUMENT` ตอนเก็บ, `RETRIEVAL_QUERY` ตอนค้น)" },
      { h: "4) ANN — หาเพื่อนบ้านใกล้สุดแบบเร็ว" },
      { p: "การหา 'k ตัวที่ใกล้สุด' แบบเทียบทุกแถว (exact kNN) ช้าเมื่อข้อมูลใหญ่. **ANN (Approximate Nearest Neighbor)** ยอมพลาดเล็กน้อยเพื่อความเร็วมหาศาล — เป็นหัวใจของ index ใน vector DB (เช่น HNSW/IVFFlat)" },
      { h: "5) pgvector — vector อยู่ใน Postgres" },
      { p: "ไม่ต้องมี DB แยกก็ได้: **pgvector** เพิ่มชนิด vector ใน Postgres — เก็บใน table ปกติแล้วค้นด้วย SQL ได้ประโยชน์ของ filter/join + vector search ในที่เดียว" },
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Cosine similarity (Wikipedia)", url: "https://en.wikipedia.org/wiki/Cosine_similarity", note: "คณิตของการวัดความใกล้" },
        { label: "What are embeddings? (Cloudflare)", url: "https://developers.cloudflare.com/workers-ai/features/embeddings/", note: "อธิบาย embedding แบบเข้าใจง่าย" },
        { label: "pgvector (GitHub)", url: "https://github.com/pgvector/pgvector", note: "vector type + index บน Postgres" },
      ]},
      { h: "📚 เอกสารผู้ให้บริการ (อ่านของจริงจากค่าย)" },
      { links: [
        { label: "OpenAI — Embeddings guide", url: "https://platform.openai.com/docs/guides/embeddings", note: "สร้าง embedding ฝั่ง OpenAI" },
        { label: "Google — Gemini Embeddings", url: "https://ai.google.dev/gemini-api/docs/embeddings", note: "embed_content + task_type" },
        { label: "OpenAI Cookbook — RAG Q&A with Pinecone", url: "https://cookbook.openai.com/examples/vector_databases/pinecone/gen_qa", note: "embed → เก็บ → ค้น แบบ end-to-end" },
        { label: "Pinecone — Learn (vector DB)", url: "https://www.pinecone.io/learn/", note: "ศูนย์เรียนรู้ vector DB" },
        { label: "Supabase — Vector columns (pgvector)", url: "https://supabase.com/docs/guides/ai/vector-columns", note: "ใช้ pgvector บน Supabase" },
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
      { h: "สร้าง embedding (ตัวอย่าง รันในเครื่อง ฟรี)" },
      { code: String.raw`# pip install sentence-transformers
from sentence_transformers import SentenceTransformer
model = SentenceTransformer("all-MiniLM-L6-v2")     # 384-dim ไม่ต้องมี key

def embed(texts):
    return model.encode(texts, normalize_embeddings=True)  # normalize → cosine=dot`, cap: "สลับเป็น embedding ของ OpenAI/Gemini เมื่อขึ้น production ได้", lang: "py" },
      { h: "schema การเก็บ (ตัวอย่าง pgvector)" },
      { code: String.raw`CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE docs (
    id        bigserial PRIMARY KEY,
    content   text,
    source    text,            -- metadata ไว้ pre-filter
    embedding vector(384)       -- มิติต้องตรงกับ embedding model
);
-- index ANN ให้ค้นเร็ว
CREATE INDEX ON docs USING hnsw (embedding vector_cosine_ops);`, cap: "เก็บ embedding + metadata ใน table เดียว", lang: "sql" },
      { h: "ค้นด้วย SQL (ฝั่ง DB คำนวณ cosine)" },
      { code: String.raw`-- <=> คือ cosine distance ใน pgvector (ยิ่งน้อยยิ่งใกล้)
SELECT content, 1 - (embedding <=> :query_vec) AS similarity
FROM docs
ORDER BY embedding <=> :query_vec
LIMIT 3;`, cap: "งานหนัก (เทียบล้านแถว) ทำใน DB ด้วย index", lang: "sql" },
      { note: "ระวัง: ต้องใช้ embedding model **ตัวเดียวกัน** ทั้งตอน store และ query ไม่งั้นเวกเตอร์อยู่คนละปริภูมิ ค้นมั่ว" },
    ],
    architecture: [
      { h: "เส้นทาง 2 ทิศของ vector" },
      { code: String.raw`STORE (ตอนข้อมูลเข้า):
  เอกสารดิบ → embed(DOCUMENT) → insert (เก็บ vector + metadata)

SEARCH (ตอนมีคำถาม):
  คำถาม → embed(QUERY) → ค้น top-N ที่ cosine สูงสุด`, cap: "store ใช้ DOCUMENT, search ใช้ QUERY", lang: "txt" },
      { h: "ให้ DB ทำงานหนัก ไม่ใช่ Python" },
      { p: "อย่าดึงเวกเตอร์ทุกแถวมาเทียบใน Python — ส่งเวกเตอร์ query ให้ DB (หรือ FAISS) ที่มี index แล้วรับ top-N กลับมา" },
      { h: "เลือก store ตามขนาดงาน" },
      { table: { head: ["store", "เหมาะกับ"], rows: [
        ["list/numpy ในหน่วยความจำ", "ต้นแบบ/ข้อมูลน้อย"],
        ["FAISS", "เร็วในเครื่อง ข้อมูลกลาง-ใหญ่"],
        ["pgvector (Postgres)", "มี SQL/filter อยู่แล้ว"],
        ["Pinecone/Weaviate", "managed ขนาดใหญ่"],
      ]}},
    ],
    dataflow: [
      { h: "ตั้งแต่ข้อความถึงผลค้น" },
      { code: String.raw`query = "ขอเงินคืนได้ไหม"
   │
   ├─ embed(query)  → [0.11, -0.83, ...] (เวกเตอร์ query)
   │
   ├─ ค้น top-3 ที่ cosine สูงสุด (DB/FAISS ทำด้วย index)
   │
   └─ ["นโยบายคืนสินค้าภายใน 14 วัน...", "ขั้นตอนขอคืนเงิน...", ...]`, cap: "input คือข้อความ → output คือเอกสารที่ 'ความหมายใกล้' 3 อันดับแรก", lang: "txt" },
      { note: "ดู interactive ที่แท็บ Visualizer ▶ — ไล่ตั้งแต่ข้อความ → เวกเตอร์ → ค้น → ผล" },
    ],
    implementation: [
      { h: "🧪 ตัวอย่างใช้งานครบ (คัดลอกไปลองได้)" },
      { p: "โครงสร้าง: `embed()` (โมเดลในเครื่อง ฟรี) → `TinyVectorStore` เก็บเวกเตอร์ → `search()` ค้นด้วย cosine (normalize แล้ว = dot) คืน top-k" },
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
vs.add(["นโยบายคืนสินค้าภายใน 14 วัน", "ส่งฟรีเมื่อซื้อครบ 500 บาท",
        "เปิดทำการ จันทร์-ศุกร์", "วิธีขอเงินคืนผ่านแอป"])
for doc, score in vs.search("ขอเงินคืนได้ไหม", k=2):
    print(f"{score:.3f}  {doc}")
# 0.6x  วิธีขอเงินคืนผ่านแอป
# 0.5x  นโยบายคืนสินค้าภายใน 14 วัน`, cap: "vector store จิ๋วครบวงจร: embed → store → cosine search (สลับ embed เป็น API ค่ายไหนก็ได้)", lang: "py" },
      { ul: [
        "`normalize_embeddings=True` — ทำให้ cosine = dot product (คูณเวกเตอร์ตรง ๆ)",
        "`self.vecs @ q` — คำนวณความใกล้ของ query กับทุกเอกสารพร้อมกัน",
        "`argsort()[::-1][:k]` — เอา index ที่ใกล้สุด k อันดับ",
        "ขึ้น production → ย้ายไป pgvector/FAISS/Pinecone แทน list ในหน่วยความจำ",
      ]},
      { h: "checklist ทำ vector search" },
      { ul: [
        "เลือก embedding model + มิติให้เหมาะ (ข้อมูลเยอะ/ละเอียด = มิติมาก)",
        "ใช้ model เดียวกันทั้ง store และ query",
        "ตัดความยาว input ก่อน embed กันบานปลาย",
        "เก็บ embedding + metadata (source/time) ไว้ filter",
        "ให้ DB/FAISS คำนวณ similarity อย่าดึงทุกแถวมาเทียบใน Python",
        "เผื่อ fallback เมื่อ embed พลาด/ไม่มี key",
      ]},
    ],
    tricks: [
      { h: "ทริค 1: normalize แล้ว cosine = dot" },
      { p: "`normalize_embeddings=True` ทำให้ความยาวเวกเตอร์ = 1 → cosine กลายเป็น dot product (คูณตรง ๆ ด้วย numpy `@`) เร็วและง่าย" },
      { h: "ทริค 2: pre-filter ก่อน vector" },
      { p: "ถ้ามี metadata (เช่น หมวด/ภาษา) กรองด้วย SQL ก่อน แล้วค่อย cosine — ลดจำนวนแถวที่ต้องเทียบ เร็วขึ้นและตรงขึ้น" },
      { h: "ทริค 3: ตัด input ก่อน embed เสมอ" },
      { p: "embed ของข้อความสั้นกระชับมักดีกว่าข้อความยาวเฟ้อ และคุม cost ได้ — เอกสารยาวให้ chunk ก่อน (ดูหน้า RAG)" },
      { h: "ทริค 4: ใช้ task_type ถ้าโมเดลรองรับ" },
      { p: "บอกโมเดลว่า embed เอกสาร (DOCUMENT) หรือคำค้น (QUERY) ช่วยให้ผลค้นแม่นขึ้นโดยไม่ต้องทำอะไรเพิ่ม" },
    ],
    eval: [
      { qa: [
        { q: "embedding คืออะไร?", a: "การเปลี่ยนข้อความเป็นเวกเตอร์ตัวเลข ที่ข้อความความหมายใกล้กันจะได้เวกเตอร์อยู่ใกล้กัน → ค้นด้วยความหมายได้" },
        { q: "cosine similarity วัดอะไร?", a: "มุมระหว่างเวกเตอร์ 2 ตัว (1=เหมือนมาก, 0=ไม่เกี่ยว, -1=ตรงข้าม) ไม่สนความยาว; normalize แล้ว = dot product" },
        { q: "ทำไมต้องใช้ model เดียวกันตอน store/query?", a: "เวกเตอร์จากคนละโมเดลอยู่คนละปริภูมิ เทียบกันไม่ได้ ค้นจะมั่ว" },
        { q: "มิติของเวกเตอร์ส่งผลยังไง?", a: "มิติมาก=ละเอียดแต่เปลือง storage/ช้า; บางโมเดลลดมิติได้ (output_dimensionality/dimensions)" },
        { q: "ANN คืออะไร ต่างจาก kNN ตรงไหน?", a: "ANN หาเพื่อนบ้านใกล้สุดแบบประมาณ (ยอมพลาดนิดเพื่อเร็วมาก) ส่วน exact kNN เทียบทุกแถว ช้าเมื่อข้อมูลใหญ่" },
        { q: "pgvector คืออะไร?", a: "extension ของ Postgres ที่เพิ่มชนิด vector + index ANN — เก็บและค้นเวกเตอร์ใน SQL ได้" },
        { q: "ทำไมให้ DB คำนวณ similarity แทน Python?", a: "ข้อมูลอาจล้านแถว — DB/FAISS มี index ค้นเร็ว; Python แค่ส่ง query เวกเตอร์แล้วรับ top-N กลับ" },
        { q: "vector search เกี่ยวกับ RAG ยังไง?", a: "มันคือขั้น 'retrieval' ของ RAG — หาข้อมูลที่เกี่ยวมาก่อน แล้ว RAG เอาไปเสริม prompt ตอน generate" },
      ]},
    ],
  },
});
window.EXTRA_FLOWS.ai_vector = {
  input: "TinyVectorStore.search('ขอเงินคืนได้ไหม', k=3)",
  steps: [
    { fn: "search(query, k)", file: "vectordb.py", depth: 0, note: "รับ query ข้อความ ต้องการเอกสารที่ความหมายใกล้สุด", data: "query = 'ขอเงินคืนได้ไหม'", vars: [
      { n: "query", v: "\"ขอเงินคืนได้ไหม\"", d: "คำค้นเป็นข้อความ" } ] },
    { fn: "embed(query)", file: "vectordb.py", depth: 1, note: "แปลง query เป็นเวกเตอร์ (normalize)", data: "→ [0.11, -0.83, ...] (384 มิติ)", vars: [
      { n: "q", v: "vector(384)", d: "เวกเตอร์ของคำค้น", w: true } ] },
    { fn: "vecs @ q", file: "numpy", depth: 1, note: "คูณเวกเตอร์ query กับทุกเอกสาร = cosine ทุกแถว", data: "sims = [0.6, 0.2, 0.5, 0.1]", vars: [
      { n: "sims", v: "[0.6, 0.2, 0.5, 0.1]", d: "คะแนนความใกล้ของทุกเอกสาร", w: true } ] },
    { fn: "argsort top-k", file: "vectordb.py", depth: 1, note: "เรียงมาก→น้อย เอา index k อันแรก", data: "idx = [0, 2]", vars: [
      { n: "idx", v: "[0, 2]", d: "ตำแหน่งเอกสารที่ใกล้สุด", w: true },
      { n: "results", d: "(เอกสาร, คะแนน) top-k", w: true } ] },
  ],
};

/* ===================== AI RAG ===================== */
window.TEACHING_DATA.push({
  id: "ai_rag",
  name: "RAG — ดึงข้อมูลจริงมาเสริมก่อนตอบ",
  tag: { th: "Retrieval-Augmented Generation: ค้นข้อมูลที่เกี่ยว (vector) → ยัดเข้า prompt → ให้ LLM ตอบจากข้อมูลจริง ลด hallucination. มี chunking, การ inject context และวัดผล Recall@k", en: "Retrieval-Augmented Generation: retrieve relevant data (vector) → inject into the prompt → answer from real facts. Covers chunking, context injection and Recall@k" },
  accent: "#fbbf24",
  sections: {
    principle: [
      { h: "RAG แก้ปัญหาอะไร" },
      { p: "LLM รู้แค่สิ่งที่ถูกเทรนมา (มี cutoff) และ 'เดาคำ' จึง hallucinate ได้. **RAG** แก้ด้วยการ **ค้นข้อมูลจริงที่เกี่ยวกับคำถาม แล้วยัดเข้า prompt ก่อนให้ LLM ตอบ** — โมเดลตอบจากข้อมูลที่เราป้อน ไม่ใช่จากความจำล้วน ๆ" },
      { h: "สมการง่าย ๆ ของ RAG" },
      { code: String.raw`RAG = Retrieve (ค้น) + Augment (เสริม prompt) + Generate (ให้ LLM ตอบ)

คำถาม ─► ค้นข้อมูลที่เกี่ยว ─► เอามาแปะใน prompt ─► LLM ตอบจากข้อมูลนั้น`, cap: "หัวใจ: เอา 'ข้อมูลจริงที่เกี่ยว' มาวางตรงหน้าโมเดลก่อนถาม", lang: "txt" },
      { h: "ใช้ทำอะไรได้บ้าง" },
      { ul: [
        "ผู้ช่วยตอบจากคู่มือ/นโยบายบริษัท (ตอบตรงเอกสาร ไม่มั่ว)",
        "ค้นโค้ด/เอกสารทางเทคนิคแล้วสรุป",
        "แชตบอตที่ต้องอ้างอิงแหล่งได้",
      ]},
      { note: "RAG = vector search (หน้า Vector DB) + การ inject context เข้า prompt (หน้านี้) + วัดผลว่าค้นแม่นไหม (Recall@k)" },
    ],
    theory: [
      { h: "1) Chunking — หั่นเอกสารก่อนเก็บ" },
      { p: "เอกสารยาวต้องหั่นเป็นชิ้น (chunk) ก่อน embed เพราะ (ก) embedding ของข้อความสั้นแม่นกว่า (ข) ใส่กลับเข้า context ได้พอดี. นิยม chunk ขนาด ~200–800 token พร้อม overlap เล็กน้อยกันความหมายขาดตรงรอยต่อ" },
      { h: "2) Retrieve — ค้นชิ้นที่เกี่ยว" },
      { p: "embed คำถาม → vector search หา chunk ที่ cosine สูงสุด (กลไกในหน้า Vector DB). ได้ 'top-k sources' ที่น่าจะมีคำตอบ" },
      { h: "3) Augment — ยัด context เข้า prompt" },
      { p: "เอา chunk ที่ค้นได้มา **ประกอบเป็นข้อความแล้วแทรกใน prompt** พร้อมสั่งให้ตอบจากข้อมูลนี้เท่านั้น" },
      { code: String.raw`context = "\n".join(f"- {c}" for c in chunks)
prompt = (f"ใช้ข้อมูลต่อไปนี้ตอบคำถาม ถ้าไม่มีให้บอกว่าไม่ทราบ\n"
          f"ข้อมูล:\n{context}\n\nคำถาม: {question}")`, cap: "นี่คือหัวใจ 'augment' — เอา chunk มาวางใน prompt", lang: "py" },
      { h: "4) Hybrid search — ไม่ต้องใช้ vector อย่างเดียว" },
      { p: "vector จับความหมาย แต่บางทีพลาดคำเฉพาะ (ชื่อ/รหัส). **hybrid** ผสม keyword (BM25) + vector แล้วรวมคะแนน หรือ **rerank** ผลด้วยโมเดลจัดอันดับ — แม่นขึ้นในงานจริง" },
      { h: "5) วัดผล RAG ด้วย Recall@k" },
      { p: "RAG ดีไหมวัดที่ **การค้น**: **Recall@k** = ในคำตอบที่ถูกต้อง เราค้นเจอมาอยู่ใน k อันดับแรกกี่ %. ตั้งชุดทดสอบ (คำถาม→source ที่ถูก) แล้ววัด" },
      { table: { head: ["metric", "ความหมาย"], rows: [
        ["Recall@1", "source ถูกอยู่ที่อันดับ 1 กี่ %"],
        ["Recall@5", "source ถูกอยู่ใน 5 อันดับแรกกี่ %"],
        ["Recall@10", "source ถูกอยู่ใน 10 อันดับแรกกี่ %"],
      ]}},
      { h: "6) จากของจริง: Agent Memory (สรุปจากวิดีโอสอน)" },
      { p: "**ความจำของ agent = workspace ที่ agent อ่าน/เขียนได้** ไม่ใช่แค่ context ใน prompt. แบ่ง 2 ชั้น: **short-term** (บันทึกรายวันแยกตาม timestamp) และ **long-term** (ตัวตน/กฎถาวร เก็บคนละไฟล์)" },
      { table: { head: ["ชั้นเก็บ", "เหมาะกับ"], rows: [
        ["Markdown / ไฟล์ข้อความ", "โน้ตสั้น ๆ จำง่าย แก้มือได้"],
        ["ไฟล์ดิบ (PDF/CSV/Excel)", "ต้อง extract เป็น text ก่อน (OCR/pandas)"],
        ["SQL / Postgres", "ข้อมูลมีโครงสร้าง ค้นแบบ exact"],
        ["Vector DB", "ค้นเชิงความหมาย (semantic)"],
      ]}},
      { ul: [
        "อ่านไฟล์ที่ไม่ใช่ text ต้อง **แกะเป็น text ก่อน** แล้วค่อยยัดเข้า context = ingestion pipeline ของ RAG",
        "**write vs read**: เขียน memory เมื่อสั่งให้จำ, อ่านเมื่อ query ย้อนถาม; แก้ไฟล์ memory ตรง ๆ ได้ก็ทำ (ประหยัด token อย่าเรียก LLM ทุกครั้ง)",
        "pitfalls: เก็บผิด collection → ค้นไม่เจอ, PDF เป็นก้อนเดียวต้อง chunk ให้มี identity, แก้ config ต้อง reload",
        "secret (DB user/pass) ไว้ใน **env** ไม่ใช่ workspace; ระวัง exec ดึง env เข้า context ของ LLM",
      ]},
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Evaluation: Precision & Recall (Wikipedia)", url: "https://en.wikipedia.org/wiki/Precision_and_recall", note: "นิยาม recall ที่ Recall@k ต่อยอด" },
        { label: "Pinecone — RAG learning center", url: "https://www.pinecone.io/learn/retrieval-augmented-generation/", note: "RAG ครบตั้งแต่ chunk ถึง generate" },
        { label: "Pinecone — Chunking strategies", url: "https://www.pinecone.io/learn/chunking-strategies/", note: "วิธีหั่นเอกสาร" },
      ]},
      { h: "📚 เอกสารผู้ให้บริการ (อ่านของจริงจากค่าย)" },
      { links: [
        { label: "Anthropic — Contextual Retrieval", url: "https://www.anthropic.com/news/contextual-retrieval", note: "ทำ retrieval ให้แม่นขึ้น (hybrid/cache)" },
        { label: "OpenAI Cookbook — RAG Q&A (Pinecone)", url: "https://cookbook.openai.com/examples/vector_databases/pinecone/gen_qa", note: "RAG end-to-end พร้อมโค้ด" },
        { label: "OpenAI Cookbook — Evaluate RAG", url: "https://cookbook.openai.com/examples/evaluation/evaluate_rag_with_llamaindex", note: "วัดผล RAG" },
        { label: "Google — Gemini File Search (RAG)", url: "https://ai.google.dev/gemini-api/docs/file-search", note: "RAG สำเร็จรูปฝั่ง Gemini" },
        { label: "LangChain — Build a RAG agent", url: "https://docs.langchain.com/oss/python/langchain/rag", note: "RAG ทางการของ LangChain" },
        { label: "Hugging Face — Advanced RAG", url: "https://huggingface.co/learn/cookbook/en/advanced_rag", note: "RAG ขั้นสูง + rerank" },
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
      { table: { head: ["ขั้น", "ทำอะไร"], rows: [
        ["Index (offline)", "หั่น chunk + embed + เก็บลง vector DB"],
        ["Retrieve", "embed query + vector search → top-k"],
        ["Rank", "(option) rerank/hybrid คัดให้ตรงขึ้น"],
        ["Augment", "format chunk เป็น context แทรก prompt"],
        ["Generate", "LLM ตอบจาก context"],
      ]}},
      { h: "ขั้น Index (ทำครั้งเดียวตอนเตรียมข้อมูล)" },
      { code: String.raw`def index_docs(raw_text, store):
    chunks = chunk(raw_text, size=500, overlap=50)   # 1) หั่น
    store.add(chunks)                                # 2) embed + เก็บ (ดูหน้า Vector DB)`, cap: "เตรียมข้อมูลก่อนใช้งานจริง", lang: "py" },
      { note: "ถ้าฐานความรู้เล็ก (< ~200k token) Anthropic แนะนำว่า **ยัดทั้งหมดเข้า prompt ได้เลย** ไม่ต้องทำ RAG — ใช้ prompt caching แทน" },
    ],
    architecture: [
      { h: "รูปแบบซ้ำ: ค้น → format → แปะ prompt" },
      { code: String.raw`def rag(question, store, k=3):
    hits    = store.search(question, k=k)        # Retrieve
    context = format_context(hits)               # Augment
    return llm_answer(question, context)         # Generate`, cap: "ทุกระบบ RAG มีโครงเดียวกัน ต่างกันที่กลยุทธ์ค้น/จัดอันดับ", lang: "py" },
      { h: "จุดที่ปรับได้ (มีผลต่อคุณภาพ)" },
      { table: { head: ["ปรับอะไร", "ผลต่อ Recall", "ผลต่อ cost"], rows: [
        ["chunk เล็กลง", "มักแม่นขึ้น", "เก็บ/ค้นมากขึ้น"],
        ["k มากขึ้น", "Recall สูงขึ้น", "prompt ยาว/แพงขึ้น"],
        ["เพิ่ม hybrid/rerank", "ตรงงานขึ้น", "เพิ่มความซับซ้อน"],
      ]}},
    ],
    dataflow: [
      { h: "RAG: ตั้งแต่คำถามถึงคำตอบ" },
      { code: String.raw`question = "คืนของได้กี่วัน?"
   │
   ├─ store.search(question)           → top-k chunks
   │     ["คืนสินค้าภายใน 14 วัน...", "ขั้นตอนขอคืน...", ...]
   │
   ├─ format → context แล้วแทรกใน prompt
   │
   └─ LLM ตอบ → "คืนได้ภายใน 14 วัน พร้อมใบเสร็จ"`, cap: "ผลลัพธ์: โมเดลตอบโดยอิงข้อมูลจริง ไม่เดา", lang: "txt" },
      { note: "ดู interactive ที่แท็บ Visualizer ▶ — ไล่ Retrieve → Augment → Generate" },
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
        "หั่นเอกสารเป็น chunk ขนาดพอดี (มี overlap)",
        "embed + เก็บพร้อม metadata (ไว้ pre-filter)",
        "ตอนค้น: embed query → vector search → คัด top-k",
        "เสริม hybrid/rerank ถ้า vector อย่างเดียวไม่แม่น",
        "format ผลให้กระชับก่อน inject (จำกัด token)",
        "วัด Recall@k กับชุดทดสอบ แล้วปรับ chunk/k/strategy",
      ]},
    ],
    tricks: [
      { h: "ทริค 1: สั่งให้ตอบ 'ไม่ทราบ' ถ้าไม่มีในข้อมูล" },
      { p: "ใส่ในคำสั่งว่า 'ถ้าข้อมูลไม่มีให้บอกว่าไม่ทราบ' — ลด hallucination เวลา retrieve ไม่เจอของที่ตรง" },
      { h: "ทริค 2: chunk เล็กแต่มี overlap" },
      { p: "chunk เล็กทำให้ embedding แม่น แต่ overlap เล็กน้อยกันความหมายขาดตรงรอยต่อประโยค" },
      { h: "ทริค 3: format ผลให้กระชับก่อน inject" },
      { p: "อย่ายัด chunk ดิบยาว ๆ — ตัด/สรุปให้เหลือแก่น. RAG ที่ดีคือ 'ค้นเยอะ คัดให้เหลือน้อยแต่ตรง'" },
      { h: "ทริค 4: cache ผลที่แพงไว้ใช้ซ้ำ" },
      { p: "แคชสรุป/ผลค้นของคำถามที่ซ้ำ ลดทั้ง cost และ latency; ฐานความรู้เล็กใช้ prompt caching ยัดทั้งก้อนแทน RAG ได้" },
      { h: "ทริค 5: ให้ความรู้มีวันหมดอายุ" },
      { p: "ถ้าข้อมูลเปลี่ยนตามเวลา ใส่ TTL/วันหมดอายุให้ chunk เก่า กันข้อมูลล้าสมัยมารบกวนคำตอบใหม่" },
    ],
    eval: [
      { qa: [
        { q: "RAG คืออะไร อธิบายสั้น ๆ?", a: "Retrieve + Augment + Generate — ค้นข้อมูลจริงที่เกี่ยวกับคำถาม ยัดเข้า prompt แล้วให้ LLM ตอบจากข้อมูลนั้น ลด hallucination และข้ามข้อจำกัด cutoff" },
        { q: "ทำไมต้อง chunk เอกสาร?", a: "embedding ของข้อความสั้นแม่นกว่า และ chunk พอดีใส่กลับ context ได้; นิยมมี overlap กันความหมายขาด" },
        { q: "Augment ในทางปฏิบัติทำยังไง?", a: "เอา chunk ที่ค้นได้มา format เป็นข้อความกระชับแล้วแทรกใน prompt พร้อมสั่งให้ตอบจากข้อมูลนี้เท่านั้น" },
        { q: "hybrid search คืออะไร?", a: "ผสม keyword (BM25) + vector แล้วรวมคะแนน หรือ rerank ผล — ตรงงานกว่าใช้ vector อย่างเดียว โดยเฉพาะคำเฉพาะ/รหัส" },
        { q: "วัดว่า RAG ดีไหมด้วยอะไร?", a: "Recall@k — สัดส่วนที่ source ที่ถูกต้องถูกค้นเจอใน k อันดับแรก; ตั้งชุดทดสอบคำถาม→source แล้ววัด" },
        { q: "เมื่อไรไม่ต้องทำ RAG?", a: "ถ้าฐานความรู้เล็ก (< ~200k token) ยัดทั้งหมดเข้า prompt + ใช้ prompt caching ได้เลย ไม่ต้อง RAG" },
        { q: "จะลด hallucination ใน RAG ยังไง?", a: "สั่งให้ตอบ 'ไม่ทราบ' เมื่อข้อมูลไม่มี, ใส่เฉพาะ chunk ที่เกี่ยว, และอ้างแหล่งได้" },
        { q: "RAG ต่างจาก fine-tuning ยังไง?", a: "RAG เสริมความรู้ตอน runtime ผ่าน prompt (อัปเดตง่าย ไม่ต้องเทรน); fine-tuning ฝังความรู้ในตัวโมเดล (แพง/ช้ากว่าจะอัปเดต)" },
      ]},
    ],
  },
});
window.EXTRA_FLOWS.ai_rag = {
  input: "rag_answer('คืนของได้กี่วัน?')",
  steps: [
    { fn: "rag_answer(question)", file: "rag.py", depth: 0, note: "รับคำถาม ต้องการคำตอบที่อิงข้อมูลจริง", data: "question = 'คืนของได้กี่วัน?'", vars: [
      { n: "question", v: "\"คืนของได้กี่วัน?\"", d: "คำถามจากผู้ใช้" } ] },
    { fn: "vs.search(question)  [RETRIEVE]", file: "vectordb.py", depth: 1, note: "vector search หา chunk ที่เกี่ยว", data: "→ ['นโยบายคืนสินค้าภายใน 14 วัน...', ...]", vars: [
      { n: "hits", v: "[(doc, score), ...]", d: "เอกสารที่ใกล้สุด top-k", w: true } ] },
    { fn: "format context  [AUGMENT]", file: "rag.py", depth: 1, note: "เอา chunk มาประกอบเป็น context + prompt", data: "prompt = 'ใช้ข้อมูล...\\n- คืนภายใน 14 วัน...\\nคำถาม:...'", vars: [
      { n: "context", d: "chunk ที่ค้นได้ ต่อกันเป็นข้อความ", w: true },
      { n: "prompt", d: "prompt ที่มีข้อมูลจริงแทรกอยู่", w: true } ] },
    { fn: "client.messages.create  [GENERATE]", file: "anthropic", depth: 1, note: "LLM ตอบโดยอิง context (ไม่เดา)", data: "→ 'คืนได้ภายใน 14 วัน พร้อมใบเสร็จ'", vars: [
      { n: "answer", v: "\"คืนได้ภายใน 14 วัน...\"", d: "คำตอบที่อิงข้อมูลจริง", w: true } ] },
  ],
};

/* ===================== AI AGENTS / LANGGRAPH ===================== */
window.TEACHING_DATA.push({
  id: "ai_agents",
  name: "Agents & LangGraph — ต่อ AI หลายขั้นเป็นระบบ",
  tag: { th: "จากเรียก LLM ทีละครั้ง สู่ระบบ multi-step ที่ต่อกันด้วย state machine: StateGraph, node/edge, conditional routing, การส่งต่อ state และ degrade เมื่อขั้นใดล้ม", en: "From single LLM calls to a multi-step system wired as a state machine: StateGraph, nodes/edges, conditional routing, shared state and graceful degradation" },
  accent: "#f472b6",
  sections: {
    principle: [
      { h: "agent คืออะไร (ต่างจากเรียก LLM เฉย ๆ)" },
      { p: "**เรียก LLM เฉย ๆ** = ถาม-ตอบครั้งเดียว. **agent** = LLM ที่ถูกวางในวงจรที่ (ก) มีบทบาทชัด (system prompt), (ข) รับ context จากระบบ, (ค) ผลถูกเอาไป 'ทำอะไรต่อ' (เรียกฟังก์ชัน/ส่งต่อขั้นอื่น)" },
      { h: "ทำไมต้อง orchestrate (จัดวงจร)" },
      { p: "เมื่อมีหลายขั้นต้องมีคนกำหนด **ใครทำก่อน-หลัง, เมื่อไรข้าม, เมื่อไรลัด, ส่งข้อมูลกันยังไง**. **LangGraph** ทำให้ pipeline เป็น **state machine** ที่อ่านง่ายและยืดหยุ่น แทนการเขียน if/else ซ้อนกันยาว ๆ" },
      { code: String.raw`ตัวอย่าง: ผู้ช่วยตอบลูกค้า
รับคำถาม → classify ประเภท ─(เทคนิค?)─► ค้น KB → ตอบ
                          └(บิล?)──► ดึงข้อมูลบิล → ตอบ`, cap: "หลายเส้นทาง: classify แล้วแตกไปตามประเภท", lang: "txt" },
      { h: "ชิ้นส่วนของ LangGraph" },
      { table: { head: ["ชิ้น", "คืออะไร", "ในโค้ด"], rows: [
        ["State", "dict กลางที่ทุก node อ่าน/เขียน", "TypedDict"],
        ["Node", "1 ขั้นงาน (มัก = 1 agent)", "ฟังก์ชันรับ state คืน dict"],
        ["Edge", "เส้นทางจาก node → node", "add_edge(a, b)"],
        ["Conditional edge", "แยกทางตามเงื่อนไข", "add_conditional_edges + route fn"],
        ["Entry / END", "จุดเริ่ม / จุดจบ", "set_entry_point, END"],
      ]}},
    ],
    theory: [
      { h: "1) State — สมุดบันทึกกลางของทั้งกราฟ" },
      { p: "ทุก node ไม่ส่งค่าให้กันตรง ๆ แต่ **เขียนผลลงใน state** แล้ว node ถัดไป **อ่านจาก state**. ประกาศ schema ด้วย `TypedDict`" },
      { code: String.raw`from typing import TypedDict
class State(TypedDict):
    question: str
    category: str
    answer: str`, cap: "schema ของ state — รู้ว่ามี field อะไรบ้าง", lang: "py" },
      { h: "2) Node คืนเฉพาะส่วนที่อัปเดต (partial update)" },
      { p: "node ไม่ต้องคืน state ทั้งก้อน — คืนแค่ dict ของ field ที่เปลี่ยน LangGraph จะ merge ให้ ทำให้แต่ละ node อิสระและทดสอบง่าย" },
      { code: String.raw`def classify(state):
    cat = "tech" if "error" in state["question"] else "general"
    return {"category": cat}   # คืนเฉพาะ field ที่เปลี่ยน`, cap: "partial dict → merge เข้า state เดิม", lang: "py" },
      { h: "3) Edge ปกติ vs Conditional edge" },
      { p: "**Edge ปกติ**: ทำ A เสร็จไป B เสมอ. **Conditional edge**: เรียก 'ฟังก์ชัน routing' ที่อ่าน state แล้วคืนชื่อทางที่จะไป — ใช้ทำ if/skip/branch" },
      { code: String.raw`def route(state) -> str:
    return "tech" if state["category"] == "tech" else "general"

g.add_conditional_edges("classify", route,
    {"tech": "answer_tech", "general": "answer_general"})`, cap: "routing fn คืน key แล้ว map ไป node ปลายทาง", lang: "py" },
      { h: "4) Graceful degradation — ระบบไม่ล้มทั้งก้อน" },
      { p: "ใส่ทางหนีไฟเป็น edge: ถ้าขั้นสำคัญล้ม ให้ routing ลัดไป node สรุป/ตอบ fallback แทนการฝืนทำต่อจนพังทั้งกราฟ. แต่ละ node ก็มี try/except คืนค่า default ของตัวเอง" },
      { h: "5) Stateless ต่อรอบ" },
      { p: "compile กราฟครั้งเดียว แต่ invoke ด้วย state ใหม่ทุกครั้ง — ไม่ให้ข้อมูลรอบก่อนรั่วมารอบนี้ (สำคัญในระบบ real-time/หลายผู้ใช้)" },
      { h: "6) จากของจริง: LangChain v1 + LangGraph (สรุปจากวิดีโอสอน)" },
      { p: "ในทางปฏิบัติ LangChain v1 ย่อการสร้าง agent ให้สั้นมาก ส่วน LangGraph คือ runtime ที่คุม flow:" },
      { code: String.raw`from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain.tools import tool

@tool
def search_docs(q: str) -> str:
    "ค้นเอกสารภายใน — docstring จำเป็น! เป็นคำอธิบายให้ LLM รู้ว่า tool ทำอะไร"
    return run_search(q)

model = init_chat_model("claude-haiku-4-5-20251001")   # สลับ provider แค่เปลี่ยนชื่อ
agent = create_agent(model, tools=[search_docs], system_prompt="...")
out   = agent.invoke({"messages": [{"role": "user", "content": "..."}]})
print(out["messages"][-1].content)`, cap: "create_agent + @tool — agent loop: คิด→เรียก tool→อ่านผล→ตอบ", lang: "py" },
      { ul: [
        "`@tool` ต้องมี **docstring** เสมอ — มันคือคำอธิบายให้โมเดลตัดสินใจว่าจะเรียก tool นี้ไหม",
        "ถ้า agent หยุดหลังเรียก tool แล้วตอบว่าง → system prompt ต้องสั่งให้ 'เอาผล tool มาเรียบเรียงตอบ'",
        "LangGraph เสริม: `Annotated[list, operator.add]` = reducer ต่อ list อัตโนมัติ, `checkpointer`+`thread_id` = จำข้ามรอบ, `interrupt()/Command(resume=)` = human-in-the-loop, `Command(goto=)` = routing ภายใน node",
        "**LangSmith** = เครื่องมือ debug/trace/eval ของ flow — ใช้ดูว่า agent เรียก tool อะไร พลาดตรงไหน",
      ]},
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "LangGraph — Low-level concepts", url: "https://langchain-ai.github.io/langgraph/concepts/low_level/", note: "State, Node, Edge, conditional edges" },
        { label: "LangGraph — Quickstart", url: "https://langchain-ai.github.io/langgraph/tutorials/introduction/", note: "สร้างกราฟแรกทีละขั้น" },
        { label: "Python — TypedDict", url: "https://docs.python.org/3/library/typing.html#typing.TypedDict", note: "schema ของ state" },
      ]},
      { h: "📚 เอกสารผู้ให้บริการ (อ่านของจริงจากค่าย)" },
      { links: [
        { label: "Anthropic — Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents", note: "หลักออกแบบ agent/workflow (orchestrator, routing)" },
        { label: "OpenAI — A Practical Guide to Building Agents (PDF)", url: "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf", note: "agent + multi-agent + guardrails" },
        { label: "OpenAI Cookbook — Multi-Tool Orchestration + RAG", url: "https://cookbook.openai.com/examples/responses_api/responses_api_tool_orchestration", note: "routing ไปหลาย tool" },
        { label: "LangGraph — Docs (หน้าหลัก)", url: "https://langchain-ai.github.io/langgraph/", note: "เอกสารทางการ LangGraph" },
      ]},
      { h: "🎬 วิดีโอสอน (เจาะลึก)" },
      { links: [
        { label: "LangGraph Tutorial — Build Advanced AI Agent Systems", url: "https://www.youtube.com/watch?v=1w5cCXlh7JQ", note: "เจาะลึก state graph" },
        { label: "Building Effective Agents with LangGraph (LangChain official)", url: "https://www.youtube.com/watch?v=aHCDrAbH_go", note: "อิงหลัก Building Effective Agents" },
        { label: "LangGraph & LangSmith: Build AI Agents (Full Demo)", url: "https://www.youtube.com/watch?v=vhKM27MOgME", note: "เดโมเต็มพร้อม debug" },
        { label: "mikelopster — LangGraph 101 (ไทย)", url: "https://www.youtube.com/watch?v=DJ2ZrbIkkO8", note: "StateGraph/node/edge/routing/checkpoint" },
        { label: "mikelopster — LangChain 101 (ไทย)", url: "https://www.youtube.com/watch?v=mH36GOYeJmw", note: "create_agent + @tool + structured output" },
      ]},
    ],
    foundations: [
      { h: "ประกอบกราฟ 5 ขั้น" },
      { code: String.raw`from langgraph.graph import StateGraph, END

g = StateGraph(State)                       # 1) ผูกกับ state schema
g.add_node("classify", classify)            # 2) ใส่ node (= ขั้น/agent)
g.add_node("answer_tech", answer_tech)
g.add_node("answer_general", answer_general)
g.set_entry_point("classify")               # 3) จุดเริ่ม
g.add_conditional_edges("classify", route,  # 4) ต่อเส้นทาง (แตกตามประเภท)
    {"tech": "answer_tech", "general": "answer_general"})
g.add_edge("answer_tech", END); g.add_edge("answer_general", END)  # 5) จุดจบ
app = g.compile()                           # คืน app ที่ .invoke() ได้`, cap: "โครงมาตรฐานของการ build graph", lang: "py" },
      { h: "node แบบ async ก็ได้" },
      { p: "ขั้นที่รอ I/O (เรียก API/ดึงข้อมูลเน็ต) ทำเป็น `async def` ได้ — LangGraph รองรับทั้ง sync และ async node ในกราฟเดียวกัน" },
      { h: "state ต้อง serializable" },
      { p: "ค่าที่ใส่ state ควรเป็นชนิดพื้นฐาน (str/int/list/dict). ถ้ามี numpy/ออบเจ็กต์พิเศษ ให้แปลงเป็น native ก่อน กัน error ตอนส่งผ่าน state" },
    ],
    architecture: [
      { h: "ทำไม state machine ดีกว่า if/else ยาว ๆ" },
      { ul: [
        "**อ่านรู้เรื่อง** — เห็นทั้ง flow เป็นกราฟ ไม่ใช่โค้ดซ้อนกัน",
        "**แก้เส้นทางง่าย** — เพิ่ม/ย้าย node โดยไม่รื้อ logic ภายใน",
        "**routing แยกจากงาน** — เงื่อนไขแตกทางอยู่ใน route fn ของมันเอง",
        "**degrade เป็นทางการ** — ทางลัดตอน error เป็น edge ที่เห็นชัด",
      ]},
      { h: "แยก orchestration ออกจาก agent" },
      { p: "ไฟล์กราฟรู้แค่ 'ลำดับและเงื่อนไข'. ตรรกะจริงของแต่ละขั้นอยู่ในฟังก์ชัน/ไฟล์ของมัน — แยกความรับผิดชอบชัดเจน" },
      { h: "patterns ที่พบบ่อย (จาก Building Effective Agents)" },
      { table: { head: ["pattern", "ใช้เมื่อ"], rows: [
        ["Prompt chaining", "งานแตกเป็นสเตปตายตัว"],
        ["Routing", "input หลายชนิด แยกทางจัดการ"],
        ["Parallelization", "ทำหลายงานพร้อมกันแล้วรวม"],
        ["Orchestrator-workers", "งานย่อยไม่รู้ล่วงหน้า"],
      ]}},
    ],
    dataflow: [
      { h: "1 คำถามไหลผ่านกราฟ" },
      { code: String.raw`app.invoke({"question": "app error 500", "category": "", "answer": ""})
  classify  → state.category = "tech"
  route: category=="tech" → "answer_tech"
  answer_tech → state.answer = "ลอง restart แล้วเช็ค log..."
  END`, cap: "state ค่อย ๆ ถูกเติมจน answer พร้อม", lang: "txt" },
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

print(app.invoke({"text": "สวัสดี", "lang": "", "reply": ""})["reply"])   # สวัสดีครับ 👋
print(app.invoke({"text": "hello", "lang": "", "reply": ""})["reply"])   # Hello 👋`, cap: "กราฟ 3 node + conditional edge — แตกทางตามภาษา (รันได้จริง)", lang: "py" },
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
    ],
    tricks: [
      { h: "ทริค 1: partial update = node อิสระ" },
      { p: "ให้ node คืนเฉพาะ field ที่ตัวเองรับผิดชอบ — เพิ่ม/ลบ node ได้โดยไม่กระทบตัวอื่น และเทสต์ทีละ node ได้ง่าย" },
      { h: "ทริค 2: degrade ด้วย conditional edge" },
      { p: "ทำ 'ทางหนีไฟ' เป็น edge จริง — ชัดกว่าซ่อน if กระจายในหลาย node และเห็นใน flow ทันที" },
      { h: "ทริค 3: เก็บ metadata ใน state" },
      { p: "บันทึก latency/ขั้นที่ error ลง state — พอจบรอบมีข้อมูลครบไว้ debug/วัด performance" },
      { h: "ทริค 4: compile ครั้งเดียวเป็น singleton" },
      { p: "build กราฟระดับ module ไม่ build ใหม่ทุกรอบ ลด overhead; แต่ invoke ด้วย state ใหม่ทุกครั้งเพื่อความสด" },
      { h: "ทริค 5: เริ่มจาก pattern ง่ายก่อน" },
      { p: "ส่วนใหญ่ใช้แค่ chaining/routing ก็พอ — อย่าเพิ่งกระโดดไป multi-agent ซับซ้อนถ้ายังไม่จำเป็น (คำแนะนำจาก Building Effective Agents)" },
    ],
    eval: [
      { qa: [
        { q: "agent ต่างจากเรียก LLM เฉย ๆ ยังไง?", a: "agent คือ LLM ที่มีบทบาทชัด รับ context จากระบบ และผลถูกเอาไปทำต่อ (เรียกฟังก์ชัน/ส่งขั้นอื่น) — ไม่ใช่แค่ถาม-ตอบจบ" },
        { q: "State ใน LangGraph คืออะไร?", a: "dict กลาง (ประกาศด้วย TypedDict) ที่ทุก node อ่าน/เขียนเพื่อส่งต่อข้อมูล แทนการให้ node คุยกันตรง ๆ" },
        { q: "ทำไม node ควรคืน partial dict?", a: "คืนแค่ field ที่เปลี่ยน LangGraph merge ให้ — ทำให้ node อิสระ ทดสอบง่าย และไม่เขียนทับ field อื่น" },
        { q: "conditional edge ต่างจาก edge ปกติยังไง?", a: "edge ปกติไป node ถัดไปเสมอ; conditional edge เรียก routing fn อ่าน state แล้วเลือกทาง (skip/branch/degrade)" },
        { q: "graceful degradation ทำยังไง?", a: "ใส่ทางหนีไฟเป็น edge (ขั้นสำคัญล้ม → ลัดไป node สรุป/fallback) + ทุก node มี try/except คืน default" },
        { q: "ทำไม state ต้อง serializable?", a: "LangGraph ส่งผ่าน/บันทึก state — ค่าควรเป็นชนิดพื้นฐาน ถ้ามี object พิเศษให้แปลงเป็น native ก่อน" },
        { q: "stateless ต่อรอบสำคัญยังไง?", a: "เริ่ม state ใหม่ทุก invoke ไม่ให้ข้อมูลรอบก่อน/ผู้ใช้คนก่อนรั่วมา — จำเป็นในระบบ real-time/หลายผู้ใช้" },
        { q: "ทำไมใช้ state machine แทน if/else ยาว ๆ?", a: "อ่านเป็นกราฟง่ายกว่า, แก้เส้นทางได้โดยไม่รื้อ logic, แยก routing ออกจากงาน, ทำ degrade เป็น edge ที่เห็นชัด" },
      ]},
    ],
  },
});
window.EXTRA_FLOWS.ai_agents = {
  input: "app.invoke({text:'สวัสดี'})  — กราฟ detect→route→reply",
  steps: [
    { fn: "app.invoke(state)", file: "graph.py", depth: 0, note: "เริ่มกราฟด้วย state เริ่มต้น", data: "{text:'สวัสดี', lang:'', reply:''}", vars: [
      { n: "state", d: "dict กลางที่ทุก node จะเติม", w: true } ] },
    { fn: "node detect", file: "graph.py", depth: 1, note: "ตรวจภาษา เขียนลง state.lang (partial update)", data: "→ {lang:'th'}", vars: [
      { n: "state.lang", v: "\"th\"", d: "ผลตรวจภาษา", w: true } ] },
    { fn: "route (conditional)", file: "graph.py", depth: 1, note: "อ่าน state.lang เลือกเส้นทาง", data: "lang=='th' → 'thai'", vars: [
      { n: "(เส้นทาง)", v: "thai", d: "ปลายทางที่เลือกตาม state" } ] },
    { fn: "node thai", file: "graph.py", depth: 1, note: "สร้างคำตอบภาษาไทย เขียน state.reply", data: "→ {reply:'สวัสดีครับ 👋'}", vars: [
      { n: "state.reply", v: "\"สวัสดีครับ 👋\"", d: "คำตอบสุดท้าย", w: true } ] },
    { fn: "END", file: "langgraph", depth: 1, note: "จบกราฟ คืน state ที่สมบูรณ์", data: "return state", vars: [] },
  ],
};

/* ===================== AI HARNESS (design harness, tools, system prompt, eval/cost) ===================== */
window.TEACHING_DATA.push({
  id: "ai_harness",
  name: "Harness — โครงรอบ LLM: guardrail · tool · system prompt · cost",
  tag: { th: "ของจริงรอบ ๆ LLM ที่ทำให้ production-ready: ออกแบบ harness (gate/guardrail), สร้าง tool ให้ LLM, ดีไซน์ system prompt, และวัด cost/eval", en: "The scaffolding around an LLM that makes it production-ready: harness/guardrail design, building tools, system-prompt design, and cost/eval" },
  accent: "#22d3ee",
  sections: {
    principle: [
      { h: "harness คืออะไร" },
      { p: "**harness** คือ 'โครง' ที่ครอบ LLM ไว้ให้ใช้งานจริงได้อย่างปลอดภัยและคุมได้ — ไม่ใช่ตัวโมเดล แต่คือทุกอย่างรอบ ๆ: **guardrail** (กรองก่อน/หลัง), **tool** (ให้ LLM ลงมือทำได้), **system prompt** (กำหนดพฤติกรรม), และ **มิเตอร์** (วัด cost/คุณภาพ). LLM เก่งแต่ 'เดาคำ' — harness คือสิ่งที่ทำให้มันเชื่อถือได้" },
      { h: "หลักคิดสำคัญ: 'LLM ตัดสิน โค้ดลงมือ'" },
      { p: "ในระบบจริงอย่าให้ LLM ทำทุกอย่าง. ใช้ **gate layer (โค้ดล้วน)** กรองด้วยกฎเชิงปริมาณ **ก่อน** เรียก LLM — ถ้าไม่ผ่านกฎก็จบโดยไม่เปลือง token. LLM ทำเฉพาะส่วนที่ต้องใช้วิจารณญาณ และ **โค้ดเป็นคนเรียก tool จริง** ตามคำตอบ" },
      { code: String.raw`def handle(req):
    if not pre_guard(req):       # โค้ดล้วน: ไม่ผ่าน → จบ (ประหยัด token 100%)
        return reject(req)
    decision = llm_decide(req)   # LLM ตัดสิน (เฉพาะที่ต้องคิด)
    if not post_guard(decision): # ตรวจผลก่อนลงมือ
        return reject(req)
    return do_action(decision)   # โค้ดเรียก tool จริง`, cap: "LLM เป็นแค่ชั้นเดียวตรงกลาง — รอบ ๆ คือ harness", lang: "py" },
      { h: "4 เสาของ harness (= section ถัด ๆ ไป)" },
      { table: { head: ["เสา", "ทำหน้าที่"], rows: [
        ["Guardrail / Gate", "กรอง input/output ด้วยกฎ"],
        ["Tool", "ให้ LLM สั่งงาน/ดึงข้อมูล"],
        ["System prompt", "กำหนดบทบาท/กติกา/ค่า default"],
        ["Eval / Cost", "วัดคุณภาพ + ค่าใช้จ่าย"],
      ]}},
    ],
    theory: [
      { h: "1) ออกแบบ guardrail — กรองก่อนและหลัง LLM" },
      { p: "**Pre-guard** (ก่อนเรียก LLM): ถ้ารู้อยู่แล้วว่าไม่ควรทำ ก็ไม่ต้องถาม. **Post-guard** (หลัง LLM): ตรวจผลก่อนเอาไปใช้จริง. กฎที่ตัดสินด้วยตัวเลขควรอยู่ในโค้ด ไม่ใช่ฝากไว้กับ prompt" },
      { code: String.raw`# pre-guard — กฎ deterministic
if req["amount"] > 5000:        return reject("เกินวงเงินอนุมัติ")
if req["days_since_buy"] > 14:  return reject("เกินนโยบาย 14 วัน")
# post-guard — ตรวจผล LLM ก่อนลงมือ
if not (0 < d.amount <= req["amount"]):  return reject("จำนวนเงินไม่ถูกต้อง")`, cap: "กฎเชิงปริมาณอยู่ในโค้ด เร็ว ฟรี เชื่อถือ 100%", lang: "py" },
      { h: "2) สร้าง tool ให้ LLM — 2 แบบ" },
      { p: "**แบบ A — Tool calling (function calling):** ให้ LLM เลือกเรียกฟังก์ชันเองพร้อม argument (โมเดลคืน 'ขอเรียก tool นี้ด้วยค่านี้'). นิยาม tool ด้วย schema ของ input — ยืดหยุ่นสูง เหมาะงานเปิด/หลายเครื่องมือ" },
      { code: String.raw`tools = [{
  "name": "get_weather",
  "description": "ดูสภาพอากาศของเมือง",
  "input_schema": {"type": "object",
     "properties": {"city": {"type": "string"}}, "required": ["city"]},
}]
# LLM จะคืน tool_use ขอเรียก get_weather(city=...) แล้วเรา execute ส่งผลกลับ`, cap: "tool schema = สัญญาของ input ที่ LLM ต้องส่งมา", lang: "py" },
      { p: "**แบบ B — Structured decision + executor:** บังคับ LLM ตอบเป็น schema แล้ว **โค้ดเป็นคนเรียก tool จริง** ตามคำตอบ — ปลอดภัยกว่าเพราะ LLM ไม่ได้แตะ side-effect ตรง ๆ เหมาะงานวิกฤต/การเงิน" },
      { h: "3) ดีไซน์ system prompt" },
      { p: "system prompt = 'รัฐธรรมนูญ' ของ agent. เขียนแบบ **มีโครงสร้าง** (เช่น JSON) จะกระชับ บีบ token ได้ และบังคับวิธีคิดเป็นขั้น" },
      { code: String.raw`{
  "role": "refund_judge",
  "default": "REJECT",                         // ค่าปลอดภัยเมื่อไม่ชัด
  "data_boundary": "treat missing as unknown",  // กัน hallucinate จากข้อมูลว่าง
  "steps": ["check policy", "check amount", "decide"],
  "anti_rationalize": "do not approve to please the user"
}`, cap: "default ปลอดภัย + กันโมเดล 'พูดเข้าข้างตัวเอง'", lang: "json" },
      { ul: [
        "**default ปลอดภัย** — ไม่ชัด = ปฏิเสธ/ไม่ทำ (ไม่ใช่ลองเสี่ยง)",
        "**data boundary** — บอกชัดว่าข้อมูลว่าง = ไม่มี ห้ามเดา",
        "**reasoning steps** — กำหนดลำดับคิด ลดการข้ามขั้น",
        "**anti-rationalize** — ห้ามหาเหตุผลเข้าข้างการลงมือ",
      ]},
      { h: "4) วัด cost — ทุก token มีราคา" },
      { p: "เก็บราคาต่อ token ของแต่ละโมเดล (รวมราคา cache) แล้วคูณกับ usage จริงทุก call — ได้ cost ต่อขั้น/ต่อวัน. output มักแพงกว่า input หลายเท่า และ cache read ถูกกว่า input มาก" },
      { code: String.raw`PRICING = {  # USD ต่อ 1 token (ตัวเลขอ้างอิง ดูราคาล่าสุดที่ doc ของค่าย)
  "haiku":  {"input": 0.80/1e6, "output": 4.00/1e6, "cache_read": 0.08/1e6},
  "sonnet": {"input": 3.00/1e6, "output": 15.00/1e6, "cache_read": 0.30/1e6},
}
cost = usage.input * P["input"] + usage.output * P["output"]`, cap: "นับ cost จาก usage จริง × ราคาต่อ token", lang: "py" },
      { h: "5) วัดคุณภาพ — eval harness" },
      { p: "นอกจาก cost ต้องวัด 'ตอบดีไหม'. RAG วัดด้วย **Recall@k**; งานจัดหมวด/ตัดสินใจวัดด้วย accuracy เทียบชุดเฉลย; ใช้ **LLM-as-judge** ให้คะแนนคำตอบปลายเปิดได้" },
      { h: "6) จากของจริง: นิยาม Agent Harness (สรุปจากวิดีโอสอน)" },
      { p: "**Agent Harness = Infrastructure (เครื่องมือ/sandbox ที่เตรียมให้ agent) + Rules (กฎคุมว่าจะใช้ tool เมื่อไร, จัดการ loop/context/security)** เป็นชั้น deterministic ที่เขียนด้วยโค้ด ไม่ใช่ระดับ prompt — โมเดลเดียวกันบน Claude Code / Cursor / Copilot ให้ผลต่างกันเพราะ harness ต่างกัน" },
      { ul: [
        "แกนคือ **ReAct loop**: reasoning (โมเดลเลือก tool) + action (harness รัน tool → เช็คผล/เงื่อนไขหยุด → วน) — ยุค AutoGPT ล้มเพราะ loop ไม่มีจุดหยุด + ไม่มี context/security management",
        "องค์ประกอบ harness: loop/retry condition, context compression (auto-compact), tool/skill registry, permission gating, sub-agent splitting, session persist/resume, system prompt + caching, lifecycle hooks (pre/post tool-use)",
        "**Harness ≠ MCP ≠ Skill**: MCP = protocol/ท่อต่อ tool · Skill = คู่มือระดับ prompt · Harness = runtime ที่ครอบ ตรวจผลก่อน execute และ deterministic (สั่งเขียนไฟล์ต้องเขียนเสมอ, ทำงานใน workspace จนกว่าจะขอสิทธิ์)",
      ]},
      { h: "Agent Skill — คู่มือที่ agent โหลดตามต้องการ" },
      { p: "**Skill = procedure/runbook แยกไฟล์** สำหรับงาน pattern ซ้ำ ๆ. โครง: 1 โฟลเดอร์ = `SKILL.md` (front-matter: name + description + instruction) + (ทางเลือก) `scripts/`, `references/`" },
      { code: String.raw`my-skill/
├─ SKILL.md        # front-matter: name + description (≤~1024 ตัวอักษร) + instruction
├─ scripts/        # โค้ดรันคู่ (เช่น run/clean) — ทางเลือก
└─ references/     # เอกสารอ้างอิง โหลดแบบ lazy เมื่อต้องใช้`, cap: "1 โฟลเดอร์ = 1 skill", lang: "txt" },
      { ul: [
        "**Progressive loading**: ตอน startup โหลดแค่ front-matter (name+description) ของทุก skill; เมื่อ agent ตัดสินใจใช้ค่อยโหลด instruction เต็ม → **description คือ trigger** เขียนให้ชัดว่า 'ใช้เมื่อไร'",
        "instruction สั้น (~≤500 บรรทัด); อะไรยาวลิงก์ไป references แบบ lazy; อย่าใส่สิ่งที่โมเดลรู้อยู่แล้ว ใส่เฉพาะ project-specific เพื่อประหยัด token",
        "เมื่อไรควรทำ skill: งาน pattern ซ้ำ (code/security review checklist, sync requirement/design-token, รันสคริปต์ประจำ)",
      ]},
      { h: "7) จากของจริง: เสิร์ฟ agent เป็น API + spec-driven (สรุปจากวิดีโอสอน)" },
      { p: "เอา agent (LangChain/LangGraph) มา expose เป็น API (เช่น FastAPI) ให้ frontend เรียก — เป็นส่วน serving ของ harness:" },
      { ul: [
        "**invoke vs stream**: invoke คืนทีเดียว (blocking); stream/astream ทยอยส่ง token (SSE) ให้เห็นคำตอบไหล real-time",
        "**session/state** ผูกด้วย `thread_id` ให้ agent จำ context ข้าม request (ใช้ checkpointer ของ LangGraph)",
        "**auth + rate-limit** ที่ endpoint เสมอ เพราะทุก call กิน token/cost จริง; ห่อ error ให้ตอบ client เหมาะสม",
      ]},
      { h: "Spec-driven: ให้ agent มีพิมพ์เขียวก่อนลงมือ (DESIGN.md)" },
      { p: "ป้อน **สเปก/พิมพ์เขียว** (เช่น DESIGN.md = design token + เหตุผลการออกแบบ) ให้ agent ก่อนเขียนโค้ด → ลดงานหลุดกรอบ/rework:" },
      { ul: [
        "ใส่ **acceptance criteria** ที่ตรวจได้ลงคำสั่ง (เช่น 'lint ต้องผ่านไม่มี error') → agent วนแก้เองจนผ่านสเปก",
        "เขียนกฎลง **AGENTS.md** หรือทำเป็น **skill** ('ก่อนสร้างหน้าใหม่ เช็ค DESIGN.md ก่อน') = guardrail ที่ติดทุกรอบ ประหยัด context",
        "สเปกควรอ้าง 'ชื่อ token เดียวกัน' ทั้งไฟล์ ลด ambiguity ที่ทำให้โมเดลเดา",
      ]},
      { h: "📖 อ่านเพิ่มเติม (อยากเจาะทฤษฎีต่อ)" },
      { links: [
        { label: "Guardrails AI (overview)", url: "https://www.guardrailsai.com/docs", note: "แนวคิด guardrail รอบ LLM" },
        { label: "Anthropic — Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents", note: "guardrail + เมื่อไรควรใช้ agent" },
      ]},
      { h: "📚 เอกสารผู้ให้บริการ (อ่านของจริงจากค่าย)" },
      { links: [
        { label: "Anthropic — Tool use overview", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview", note: "นิยาม tool + ให้ Claude เรียก (แบบ A)" },
        { label: "Anthropic — Advanced tool use", url: "https://www.anthropic.com/engineering/advanced-tool-use", note: "tool ขั้นสูง + harness" },
        { label: "OpenAI — Function calling", url: "https://platform.openai.com/docs/guides/function-calling", note: "tool/function calling ฝั่ง OpenAI" },
        { label: "Google — Gemini function calling", url: "https://ai.google.dev/gemini-api/docs/live-api/tools", note: "function calling ฝั่ง Gemini" },
        { label: "OpenAI — Practical Guide to Building Agents (PDF)", url: "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf", note: "มีบท guardrails โดยเฉพาะ" },
      ]},
      { h: "🎬 วิดีโอสอน (เจาะลึก)" },
      { links: [
        { label: "Anthropic Masterclass on Building Agent Harnesses", url: "https://www.youtube.com/watch?v=efRIrLXoOVA", note: "ตรงหัวข้อ harness โดยตรง" },
        { label: "Anthropic Workshop: Build Agents That Run for Hours", url: "https://www.youtube.com/watch?v=mR-WAvEPRwE", note: "self-eval + adversarial evaluator" },
        { label: "Tool Use (Function Calling) with Claude API — Step by Step", url: "https://www.youtube.com/watch?v=W7z4Zas--20", note: "สร้าง tool ทีละขั้น" },
        { label: "mikelopster — รู้จักกับ Agent Harness กัน (ไทย)", url: "https://www.youtube.com/watch?v=xIVl5X9yUWM", note: "นิยาม harness + ReAct + 9 องค์ประกอบ" },
        { label: "mikelopster — มารู้จักกับ Agent Skill กัน (ไทย)", url: "https://www.youtube.com/watch?v=4hLCFUJV1sM", note: "SKILL.md + progressive loading" },
      ]},
    ],
    foundations: [
      { h: "กายวิภาคของ harness รอบงานตัดสินใจ" },
      { code: String.raw`input (คำขอ)
   │
   ├─ [PRE-GUARD] กฎโค้ดล้วน (วงเงิน, นโยบาย, rate-limit)
   │     └─ ไม่ผ่าน → ปฏิเสธ (ไม่เรียก LLM)
   │
   ├─ [CONTEXT] ประกอบ prompt + (option) RAG ข้อมูลที่เกี่ยว
   │
   ├─ [LLM] ตัดสิน (system prompt + structured output)
   │
   ├─ [POST-GUARD] ตรวจผล (ช่วงค่า, ความสอดคล้อง)
   │
   └─ [TOOL] โค้ดเรียก action จริง + log cost`, cap: "LLM เป็นแค่ชั้นเดียว — รอบ ๆ คือ harness", lang: "txt" },
      { h: "กฎที่ควรเป็นโค้ด ไม่ใช่ LLM" },
      { table: { head: ["gate", "กฎ", "ทำไมเป็นโค้ด"], rows: [
        ["วงเงิน", "เกินเพดาน → ปฏิเสธ", "ตัวเลขชัด ไม่ต้องตีความ"],
        ["นโยบายเวลา", "เกิน N วัน → ปฏิเสธ", "เทียบวันที่ deterministic"],
        ["rate limit", "เกินโควตา → หยุด", "นับได้แน่นอน"],
        ["ช่วงค่า output", "นอกช่วง → ปฏิเสธ", "validate ก่อนลงมือ"],
      ]}},
      { note: "กฎที่ 'ตัดสินได้ด้วยตัวเลข' ควรอยู่ในโค้ด — เร็ว ฟรี เชื่อถือ 100%; เก็บ LLM ไว้สำหรับงานที่ต้องตีความจริง ๆ" },
    ],
    architecture: [
      { h: "ชั้นของ harness" },
      { table: { head: ["ชั้น", "หน้าที่"], rows: [
        ["Pre-guard", "กรองด้วยกฎก่อน LLM"],
        ["Prompt mgmt", "system prompt + minify + cache"],
        ["Context builder", "ประกอบ input ที่กระชับ (+RAG)"],
        ["LLM call", "ส่วนที่ใช้วิจารณญาณ (structured)"],
        ["Post-guard", "ตรวจผลก่อนลงมือ"],
        ["Executor (tool)", "ลงมือจริง (โค้ดคุม)"],
        ["Metering", "token/cost/latency"],
      ]}},
      { h: "system prompt แยกไฟล์ + minify + cache" },
      { code: String.raw`import json
from pathlib import Path
SYSTEM = json.dumps(
    json.loads(Path("prompts/judge.json").read_text()),
    separators=(",", ":"),   # minify — ประหยัด token
)
# ใช้ตอนเรียก + ติด cache_control เพราะเนื้อหาคงที่`, cap: "prompt แยกไฟล์ (แก้ง่าย) + minify + cache (ถูกลง)", lang: "py" },
      { h: "เลือกแบบ tool ตามงาน" },
      { table: { head: ["", "Tool calling (A)", "Structured+executor (B)"], rows: [
        ["ใครเรียก tool", "LLM ขอเรียกเอง", "โค้ดเรียกตามคำตอบ"],
        ["ความยืดหยุ่น", "สูง (หลาย tool/สเต็ป)", "คงที่ (ดีไซน์ชัด)"],
        ["ความปลอดภัย", "ต้องคุม tool ให้ดี", "สูง (LLM ไม่แตะ side-effect)"],
        ["เหมาะกับ", "งานเปิด/หลายเครื่องมือ", "งานวิกฤต/การเงิน"],
      ]}},
    ],
    dataflow: [
      { h: "เส้นทางผ่าน harness (input → action)" },
      { code: String.raw`req
   │
   ├─ pre_guard(req) ──► fail? ──► REJECT (จบ ไม่เปลือง token)
   │        │ pass
   │        ▼
   ├─ build prompt (+RAG)
   │
   ├─ llm.invoke(system(cached)+user) ──► Decision (structured)
   │        │ except ──► fallback REJECT
   │        ▼
   ├─ post_guard(decision) ──► fail? ──► REJECT
   │        │ pass
   │        ▼
   ├─ do_action(decision)   ← โค้ดเรียก tool จริง
   │
   └─ record cost/latency`, cap: "ทุกขั้นมีทางออกปลอดภัย — ระบบไม่ทำสิ่งที่ไม่ควรแม้ LLM พลาด", lang: "txt" },
      { note: "ดู interactive ที่แท็บ Visualizer ▶ — ไล่ pre-guard → LLM → post-guard → tool → metering" },
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
        "นับ token/cost/latency และตั้งเพดานงบ",
        "วัดคุณภาพด้วย metric (Recall@k, accuracy, LLM-as-judge)",
      ]},
    ],
    tricks: [
      { h: "ทริค 1: ด่านที่ถูกที่สุดคือด่านที่ไม่เรียก LLM" },
      { p: "กฎ deterministic ทั้งหมดไว้หน้า LLM — ถ้า fail ก็จบฟรี ๆ ตัดงานส่วนใหญ่ทิ้งก่อนถึงโมเดล" },
      { h: "ทริค 2: default = ตัวเลือกปลอดภัยเสมอ" },
      { p: "system prompt ตั้ง default ปลอดภัย และ fallback ตอน error ก็เลือกตัวปลอดภัย — 'เมื่อสงสัยให้ไม่ทำ'" },
      { h: "ทริค 3: กัน LLM พูดเข้าข้างตัวเอง" },
      { p: "ใส่กฎ anti-rationalize ใน system prompt ตรง ๆ ห้ามหาเหตุผลเข้าข้างการลงมือ" },
      { h: "ทริค 4: minify system prompt ที่นิ่ง" },
      { p: "system prompt เป็น JSON แล้ว `separators=(',',':')` ตัดช่องว่าง ประหยัด token; เนื้อหาคงที่จึง cache ได้ ครั้งต่อไปถูกลงอีก" },
      { h: "ทริค 5: นับ cost แยก cache" },
      { p: "แยกราคา input/output/cache_read — เห็นชัดว่า caching ช่วยจริง (cache read ถูกกว่า input มาก) และขั้นไหนคือต้นทุนหลัก" },
      { h: "ทริค 6: LLM-as-judge สำหรับงานปลายเปิด" },
      { p: "คำตอบที่ไม่มีเฉลยตายตัว ใช้ LLM อีกตัวให้คะแนนตาม rubric — วัดคุณภาพเป็นตัวเลขได้แม้ไม่มี ground truth" },
    ],
    eval: [
      { qa: [
        { q: "harness คืออะไรในงาน AI?", a: "โครงรอบ LLM ที่ทำให้ใช้จริงได้: guardrail (กรอง), tool (ลงมือ), system prompt (กำหนดพฤติกรรม), และมิเตอร์วัด cost/คุณภาพ — ไม่ใช่ตัวโมเดล" },
        { q: "'LLM ตัดสิน โค้ดลงมือ' หมายความว่าอะไร?", a: "ให้ LLM คืนคำตัดสินเป็น schema แล้วโค้ดเป็นคนเรียก tool/side-effect จริงตามนั้น — ปลอดภัยกว่าให้ LLM แตะระบบตรง ๆ" },
        { q: "pre-guard กับ post-guard ต่างกันยังไง?", a: "pre-guard กรองด้วยกฎก่อนเรียก LLM (ไม่ผ่านก็ไม่เปลือง token); post-guard ตรวจผลของ LLM ก่อนเอาไปใช้จริง" },
        { q: "ทำไมกฎเชิงปริมาณควรอยู่ในโค้ดไม่ใช่ prompt?", a: "กฎที่ตัดสินด้วยตัวเลข (threshold, นับ, ช่วงค่า) deterministic — ในโค้ดเร็ว ฟรี เชื่อถือ 100%; ฝาก prompt อาจพลาด" },
        { q: "tool calling ต่างจาก structured+executor ยังไง?", a: "tool calling LLM เลือกเรียกฟังก์ชันเอง (ยืดหยุ่น); structured+executor LLM ตอบ schema แล้วโค้ดเรียก tool (ปลอดภัยกว่า เหมาะงานวิกฤต)" },
        { q: "ออกแบบ system prompt ที่ดีมีอะไรบ้าง?", a: "default ปลอดภัย, data boundary กันเดา, reasoning steps กำหนดลำดับคิด, anti-rationalize กันอคติ; เขียนมีโครงสร้าง+minify+cache ได้" },
        { q: "วัด cost ของระบบ LLM ยังไง?", a: "เก็บราคาต่อ token ของแต่ละโมเดล (input/output/cache) คูณ usage จริงทุก call แล้วสรุปต่อขั้น/ต่อวัน" },
        { q: "วัดคุณภาพ (eval) ของ AI ยังไง?", a: "ใช้ metric ตามงาน: RAG ใช้ Recall@k, งานจัดหมวดใช้ accuracy เทียบเฉลย, งานปลายเปิดใช้ LLM-as-judge — ไม่ใช่ 'รู้สึกว่าดี'" },
      ]},
    ],
  },
});
window.EXTRA_FLOWS.ai_harness = {
  input: "handle({order_id:'A1', amount:300, days_since_buy:3})  — refund judge",
  steps: [
    { fn: "handle(req)", file: "harness.py", depth: 0, note: "รับคำขอ เข้าสู่ harness", data: "req = {amount:300, days_since_buy:3}", vars: [
      { n: "req", d: "คำขอคืนเงินจากผู้ใช้" } ] },
    { fn: "PRE-GUARD (กฎ)", file: "harness.py", depth: 1, note: "เช็คกฎตัวเลข — ไม่ผ่าน → จบโดยไม่เรียก LLM", data: "amount 300≤5000 ✓, 3≤14 วัน ✓ → ผ่าน", vars: [
      { n: "checks", v: "pass", d: "ผ่านกฎ pre-guard ไหม (ไม่ผ่าน = ฟรี)", w: true } ] },
    { fn: "judge.invoke (LLM)", file: "harness.py", depth: 1, note: "LLM ตัดสินแบบ structured (system minified+cached)", data: "→ Decision(action=REFUND, amount=300)", vars: [
      { n: "SYSTEM", d: "JSON minified + default:REJECT" },
      { n: "d", v: "Decision(REFUND, 300)", d: "คำตัดสิน (พัง → fallback skip)", w: true } ] },
    { fn: "POST-GUARD (ตรวจผล)", file: "harness.py", depth: 1, note: "ตรวจ action + ช่วง amount ก่อนลงมือ", data: "REFUND ✓ และ 0<300≤300 ✓ → ผ่าน", vars: [
      { n: "(ตรวจ)", v: "ok", d: "ผ่าน post-guard ไหม", w: true } ] },
    { fn: "send_refund (TOOL)", file: "tools.py", depth: 2, note: "โค้ด (ไม่ใช่ LLM) เรียก action จริง", data: "→ {ok:True, refunded:300}", vars: [
      { n: "result", v: "{ok:True, refunded:300}", d: "ผลการลงมือจริง", w: true } ] },
  ],
};
