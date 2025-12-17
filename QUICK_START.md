# CarePath AI - Quick Start Guide

## 🚀 Running the Application

### Prerequisites
- Node.js 18+ installed
- Gemini API key (get from https://aistudio.google.com/app/apikey)

---

## Backend Setup (5 minutes)

### Step 1: Navigate to Backend
```bash
cd "C:\Users\Ashwin\Documents\gemini hackathon\carepath-backend"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create .env File
Create a file named `.env` in the `carepath-backend` folder with this content:

```env
GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY_HERE
PORT=3000
NODE_ENV=development
MAX_REQUESTS_PER_MINUTE=15
MAX_REQUESTS_PER_DAY=1500
MAX_TOKENS_PER_MINUTE=1000000
CACHE_TTL_SECONDS=3600
ENABLE_PROMPT_CACHING=true
ALLOWED_ORIGINS=http://localhost:3001
```

**⚠️ IMPORTANT**: Replace `YOUR_ACTUAL_GEMINI_API_KEY_HERE` with your real API key!

### Step 4: Start Backend Server
```bash
npm run dev
```

You should see:
```
🚀 CarePath AI Backend running on port 3000
⚡ Gemini API: Configured
```

**Leave this terminal running!**

---

## Frontend Setup (3 minutes)

### Step 1: Open New Terminal

### Step 2: Navigate to Frontend
```bash
cd "C:\Users\Ashwin\Documents\gemini hackathon\carepath-frontend"
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Create .env.local File
Create a file named `.env.local` in the `carepath-frontend` folder with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 5: Start Frontend Server
```bash
npm run dev
```

You should see:
```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:3001
```

---

## Testing the Application

### 1. Open Browser
Navigate to: **http://localhost:3001**

### 2. Upload a Discharge Document
- Click "Get Started" or navigate to "/upload"
- Fill in patient information:
  - Patient ID: PT-TEST-001  
  - Age: 65
  - Literacy Level: Medium
- Upload a PDF or paste text (see sample below)
- Click "Process Document"

### 3. View Dashboard
- After processing, you'll be redirected to /dashboard
- See medications, appointments, and warnings

### 4. Daily Check-In
- Navigate to /check-in
- Check off medications as taken
- Submit check-in

---

## Sample Discharge Text

Use this if you don't have a real discharge summary:

```
DISCHARGE SUMMARY

Patient: John Doe, 65 years old
Discharge Date: 12/15/2024

DISCHARGE MEDICATIONS:
1. Aspirin 81mg - Take one tablet by mouth once daily
2. Metoprolol 25mg - Take one tablet by mouth twice daily (morning and evening)
3. Atorvastatin 40mg - Take one tablet by mouth once daily at bedtime

FOLLOW-UP APPOINTMENTS:
- Cardiology follow-up in 2 weeks (IMPORTANT)
- Primary care physician within 1 week

WARNING SIGNS - CALL 911 IMMEDIATELY IF:
- Chest pain lasting more than 5 minutes
- Severe shortness of breath
- Loss of consciousness or fainting

ACTIVITY RESTRICTIONS:
- No heavy lifting (more than 10 pounds) for 2 weeks
- No driving for 1 week
- Walk 10-15 minutes daily, gradually increasing

DIET INSTRUCTIONS:
- Low sodium diet (less than 2000mg per day)
- Limit saturated fats
```

---

## Troubleshooting

### Backend won't start
- ✅ Check that Node.js is installed: `node --version`
- ✅ Check that `.env` file exists in backend folder
- ✅ Check that GEMINI_API_KEY is set correctly
- ✅ Run `npm install` again

### Frontend won't start
- ✅ Check that backend is running first
- ✅ Run `npm install` again
- ✅ Check port 3001 isn't already in use

### "Gemini API: NOT CONFIGURED"
- ✅ Make sure `.env` file exists in backend folder
- ✅ Make sure it contains `GEMINI_API_KEY=your_key`
- ✅ Restart backend server after creating .env

### API errors during processing
- ✅ Verify your Gemini API key is valid
- ✅ Check you haven't exceeded free tier limits
- ✅ Check network connection

### CORS errors
- ✅ Make sure backend is running on port 3000
- ✅ Make sure frontend is running on port 3001
- ✅ Check ALLOWED_ORIGINS in backend .env

---

## File Structure

```
gemini hackathon/
├── carepath-backend/
│   ├── src/
│   │   ├── agents/          ← AI agents
│   │   ├── routes/          ← API endpoints
│   │   ├── services/        ← Gemini integration
│   │   └── server.js        ← Main server
│   ├── package.json
│   └── .env                 ← YOU MUST CREATE THIS!
│
└── carepath-frontend/
    ├── app/
    │   ├── upload/          ← Upload page
    │   ├── dashboard/       ← Care dashboard
    │   └── check-in/        ← Daily check-in
    ├── package.json
    └── .env.local           ← YOU MUST CREATE THIS!
```

---

## API Endpoints

Once running, you can test the API:

### Health Check
```bash
curl http://localhost:3000/health
```

### Process Discharge (Direct Text)
```bash
curl -X POST http://localhost:3000/api/documents/process-text \
  -H "Content-Type: application/json" \
  -d '{
    "discharge_text": "DISCHARGE MEDICATIONS: Aspirin 81mg daily...",
    "patient_context": {
      "patient_id": "TEST-001",
      "age": 65
    }
  }'
```

---

## Stopping the Application

### To stop backend:
1. Go to backend terminal
2. Press `Ctrl+C`

### To stop frontend:
1. Go to frontend terminal
2. Press `Ctrl+C`

---

## Next Steps

After confirming it works:

1. **Test with Real Data**: Upload an actual discharge summary
2. **Try Different Literacy Levels**: See how Agent 3 adapts language
3. **Submit Check-Ins**: Test the adherence monitoring workflow
4. **Review Code**: Explore agent implementations in `/src/agents`
5. **Prepare Demo**: Practice the user flow for judges

---

## Quick Reference

| Component | URL | Port |
|-----------|-----|------|
| Backend API | http://localhost:3000 | 3000 |
| Frontend UI | http://localhost:3001 | 3001 |
| Health Check | http://localhost:3000/health | - |

---

## Need Help?

Check the detailed documentation:
- Backend README: `carepath-backend/README.md`
- Frontend README: `carepath-frontend/README.md`
- API Docs: `carepath-backend/API_DOCUMENTATION.md`
- System Guide: `COMPLETE_SYSTEM_GUIDE.md`

**You're ready to run CarePath AI!** 🎉
