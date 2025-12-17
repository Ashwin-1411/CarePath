# CarePath AI
## Multi-Agent Clinical Continuity & Risk Monitoring System

CarePath AI is a **multi-agent healthcare application** that ensures patients safely follow post-treatment care pathways after hospital discharge.  
It leverages **Google Gemini’s reasoning capabilities** to interpret clinical documents, assess post-care risk, personalize patient communication, monitor adherence, and escalate concerns when necessary — while remaining **ethical, non-diagnostic, and free-tier optimized**.

Built for **GenAI Frontiers: App Development using the Gemini API**.

---

## 🚨 Problem Statement

Hospitals face a critical gap after discharge:

- Patients misunderstand discharge instructions
- No intelligent follow-up reasoning exists
- High readmission rates due to poor adherence
- Manual monitoring is costly and not scalable

CarePath AI acts as an **AI-powered care continuity layer** between hospitals, patients, and caregivers.

---

## 💡 Solution Overview

CarePath AI uses a **coordinated multi-agent architecture**, where each agent has a single, well-defined responsibility.  
Agents communicate through structured JSON outputs and are orchestrated by a central controller.

The system:
- Interprets discharge summaries
- Identifies post-treatment risk
- Explains care steps in simple language
- Tracks adherence over time
- Escalates only when genuinely required

---

## 🧠 Multi-Agent Architecture

### Agent 1 — Medical Document Interpreter
- Reads discharge summaries
- Extracts critical post-care actions
- Filters irrelevant clinical history

### Agent 2 — Risk Stratification Agent
- Analyzes extracted actions and patient profile
- Classifies risk as **LOW / MEDIUM / HIGH**
- Provides transparent, non-diagnostic reasoning

### Agent 3 — Patient Communication Agent
- Converts clinical actions into plain-language guidance
- Adapts explanations based on literacy level
- Maintains calm, reassuring tone

### Agent 4 — Adherence Monitoring Agent
- Tracks patient check-ins
- Detects deviations from expected care
- Flags emerging risk patterns

### Agent 5 — Escalation Agent (Function Calling)
- Decides when to notify caregivers or hospitals
- Uses strict confidence thresholds
- Prevents over-escalation and alert fatigue

---

## 🔄 System Flow

1. Patient uploads discharge summary
2. Agent 1 extracts structured care actions
3. Agent 2 evaluates post-care risk
4. Agent 3 generates patient-friendly guidance
5. Agent 4 monitors adherence over time
6. Agent 5 escalates only if risk is high

All agent outputs are **deterministic JSON** for reliability and auditability.

---

## 🤖 Gemini API Integration (Core Requirement)

CarePath AI **cannot function without Gemini**.

- **Model Used:** `gemini-2.5-flash`
- One API call per agent
- Structured JSON outputs enforced
- Function calling used for escalation decisions
- Optimized for free-tier usage

Gemini powers:
- Clinical document reasoning
- Context-aware risk assessment
- Personalized patient communication
- Safe, explainable decision-making

---

## 🛡️ Ethical & Safety Constraints

- ❌ No diagnosis
- ❌ No treatment modification
- ❌ No medical predictions

CarePath AI only:
- Explains existing instructions
- Highlights potential risks
- Encourages timely human intervention

Designed strictly as a **clinical support system**, not a replacement for healthcare professionals.

---

## ⚡ Free-Tier Optimization

- Uses `gemini-2.5-flash` for higher RPD limits
- Single-call-per-agent strategy
- In-memory caching for repeated inputs
- Deterministic outputs reduce retries

Fully usable within free-tier constraints during development and demos.

---

## 🧰 Tech Stack

- **Frontend:** Next.js
- **Backend:** Node.js + Express
- **AI Engine:** Google Gemini API
- **Architecture:** Multi-agent orchestration
- **Storage:** In-memory / mocked database

---

## 🧪 Demo Capabilities

- Upload discharge summary
- View extracted care actions
- See risk classification
- Receive patient-friendly instructions
- Simulate daily adherence check-ins
- Observe escalation logic in action

---

## 🔐 API Key Usage

This project uses the **Google Gemini API**.

**Never commit API keys to the repository.**  
Store keys using environment variables only.

```bash
export GEMINI_API_KEY=your_api_key_here
