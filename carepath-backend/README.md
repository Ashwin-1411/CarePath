# CarePath AI Backend

<img src="https://img.shields.io/badge/Node.js-18+-green" />
<img src="https://img.shields.io/badge/Gemini-2.0--flash-blue" />
<img src="https://img.shields.io/badge/Express-4.18-black" />

Multi-agent healthcare discharge assistant powered by Google Gemini AI.

## 🏗️ Architecture

CarePath AI uses a **sequential multi-agent system** with 5 specialized agents:

1. **Agent 1**: Medical Document Interpreter - Extracts structured data from discharge summaries
2. **Agent 2**: Risk Stratification - Assesses care plan complexity
3. **Agent 3**: Patient Communication - Translates to plain language (literacy-adapted)
4. **Agent 4**: Adherence Monitoring - Tracks patient check-ins and compliance
5. **Agent 5**: Escalation - Decides when to notify care teams (function calling)

## 📁 Folder Structure

```
carepath-backend/
├── src/
│   ├── agents/
│   │   ├── agent1.medical-doc-interpreter.js
│   │   ├── agent2.risk-stratification.js
│   │   ├── agent3.patient-communication.js
│   │   ├── agent4.adherence-monitoring.js
│   │   └── agent5.escalation.js
│   ├── orchestrator/
│   │   └── index.js                    # Main workflow coordinator
│   ├── routes/
│   │   ├── patient.routes.js
│   │   ├── document.routes.js
│   │   └── adherence.routes.js
│   ├── services/
│   │   ├── gemini.service.js           # Gemini API wrapper
│   │   ├── promptCache.js              # Prompt caching for token reduction
│   │   └── tokenBudget.js              # Free-tier budget management
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── prompts/
│   │   └── agent1.prompts.js           # Agent prompts & schemas
│   ├── utils/
│   │   └── database.js                 # In-memory data store
│   └── server.js                       # Express app entry point
├── .env.example
├── package.json
├── API_DOCUMENTATION.md
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

```bash
# Clone or navigate to the project
cd carepath-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your Gemini API key to .env
# GEMINI_API_KEY=your_api_key_here

# Start the server
npm run dev
```

Server will start on `http://localhost:3000`

## 📡 API Endpoints

### Document Processing
```bash
POST /api/documents/process-text
```
Process discharge summary and generate care plan

### Adherence Monitoring
```bash
POST /api/adherence/check-in
```
Submit daily medication check-in

### Patient Management
```bash
POST /api/patients
GET /api/patients/:patientId/care-plan
```

**Full API documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🧪 Testing

### Example 1: Process Discharge Document

```bash
curl -X POST http://localhost:3000/api/documents/process-text \
  -H "Content-Type: application/json" \
  -d '{
    "discharge_text": "DISCHARGE MEDICATIONS: Aspirin 81mg once daily, Metoprolol 25mg twice daily. FOLLOW-UP: Cardiology in 2 weeks. WARNING SIGNS: Call 911 if chest pain lasting >5 minutes.",
    "patient_context": {
      "patient_id": "TEST-001",
      "age": 65,
      "literacy_level": "medium"
    }
  }'
```

### Example 2: Submit Check-In

```bash
curl -X POST http://localhost:3000/api/adherence/check-in \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "TEST-001",
    "check_in_data": {
      "medications": [
        { "name": "Aspirin", "taken": true },
        { "name": "Metoprolol", "taken": false }
      ],
      "patient_notes": "Forgot evening medication"
    }
  }'
```

## ⚡ Free-Tier Optimizations

This backend is optimized for Gemini's free tier (15 RPM, 1M TPM, 1500 RPD):

- **Context Caching**: 80-90% token reduction by caching system prompts
- **Rate Limiting**: Automatic throttling to stay under 15 RPM
- **Request Batching**: Process check-ins in batches
- **Token Budget Management**: Real-time usage tracking

**Estimated Capacity (Free Tier)**:
- ✅ 250-500 concurrent patients
- ✅ 50-100 discharge documents per day
- ✅ Daily check-ins for all patients
- ✅ $0 cost

## 🛡️ Error Handling

- **Automatic retry** with exponential backoff for transient errors
- **Graceful degradation** with fallback responses
- **Circuit breakers** to prevent cascading failures
- **Confidence thresholds** for human review flagging

## 🔧 Configuration

Edit `.env`:

```env
GEMINI_API_KEY=your_key_here
PORT=3000
MAX_REQUESTS_PER_MINUTE=15
MAX_REQUESTS_PER_DAY=1500
ENABLE_PROMPT_CACHING=true
```

## 📊 Agent Workflows

### Workflow 1: Discharge Processing
```
PDF/Text → Agent 1 (Extract) → Agent 2 (Risk) → Agent 3 (Translate) → Patient Guide
```

### Workflow 2: Adherence Monitoring
```
Check-in → Agent 4 (Analyze) → Agent 5 (Escalate?) → Care Team Alert
```

## 🏥 Healthcare Compliance

This is a **proof-of-concept** and is NOT HIPAA-compliant. For production use:

- [ ] Add authentication (JWT/OAuth)
- [ ] Encrypt data at rest and in transit
- [ ] Replace in-memory DB with encrypted PostgreSQL
- [ ] Add audit logging
- [ ] Implement PHI access controls
- [ ] Get BAA (Business Associate Agreement) with hosting provider

**IMPORTANT**: This system provides care coordination support, NOT medical diagnosis or treatment. Always consult qualified healthcare providers.

## 🤝 Contributing

This is a hackathon project. Contributions welcome!

## 📄 License

MIT License - See LICENSE file

---

**Built for Google Gemini Hackathon 2024** 🚀

For questions or issues, please see the documentation or create an issue.
