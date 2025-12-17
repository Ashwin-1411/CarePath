# Backend Setup Instructions

## ⚠️ REQUIRED: Gemini API Key

Before starting the backend, you need to create a `.env` file with your Gemini API key.

### Steps:

1. **Get your API key** from: https://aistudio.google.com/app/apikey

2. **Create `.env` file** in this directory with:

```env
GEMINI_API_KEY=AIzaSyClj3PSkitZ_0rMiNiE7ODQNc4z2fmG984
PORT=3000
NODE_ENV=development
MAX_REQUESTS_PER_MINUTE=15
ALLOWED_ORIGINS=http://localhost:3000
```

3. **Replace `your_actual_api_key_here`** with your real key

4. **Start the server**:
```bash
npm run dev
```

The server will run on http://localhost:3000
