# CarePath AI Frontend

Professional Next.js frontend for the CarePath AI multi-agent healthcare discharge assistant.

## 🚀 Features

- **Document Upload**: Upload discharge summaries (PDF/TXT) with patient profile
- **Care Dashboard**: View medications, appointments, and activity restrictions
- **Daily Check-In**: Track medication adherence and activity compliance
- **Risk Indicators**: Visual status indicators for adherence and escalation
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **API Integration**: Full integration with CarePath AI backend

## 📁 Project Structure

```
carepath-frontend/
├── app/
│   ├── page.js                 # Home page
│   ├── layout.js               # Root layout with navigation
│   ├── globals.css             # Global styles
│   ├── upload/
│   │   └── page.js             # Document upload page
│   ├── dashboard/
│   │   └── page.js             # Care plan dashboard
│   └── check-in/
│       └── page.js             # Daily adherence check-in
├── components/
│   └── Navigation.js           # Main navigation bar
├── lib/
│   └── api.js                  # API client functions
├── package.json
├── tailwind.config.js
└── next.config.js
```

## 🏃 Quick Start

### Prerequisites
- Node.js 18+
- CarePath AI backend running on `http://localhost:3000`

### Installation

```bash
# Navigate to frontend directory
cd carepath-frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

Application will be available at `http://localhost:3000/` (or `:3001` if port 3000 is taken)

## 📱 Pages

### Home Page (`/`)
- Hero section with feature overview
- How-it-works guide
- Call-to-action to get started

### Upload Page (`/upload`)
- Patient information form
- File upload for discharge documents
- Literacy level selection
- Processes document and redirects to dashboard

### Dashboard Page (`/dashboard`)
- Adherence status indicator
- Medications list with critical flags
- Upcoming appointments
- Activity restrictions
- Real-time data from backend API

### Check-In Page (`/check-in`)
- Daily medication checklist
- Activity restriction compliance
- Optional patient notes
- Submits to backend for adherence tracking

## 🔌 API Integration

All API calls are in `/lib/api.js`:

```javascript
import { processDischargeDocument, submitCheckIn } from '@/lib/api';

// Upload document
const result = await processDischargeDocument(file, patientContext);

// Submit check-in
const response = await submitCheckIn(patientId, checkInData);
```

### Backend Endpoints Used
- `POST /api/documents/process` - Upload & process discharge PDF
- `POST /api/documents/process-text` - Process text directly
- `GET /api/patients/:id/care-plan` - Get care plan
- `POST /api/adherence/check-in` - Submit daily check-in
- `GET /api/adherence/status/:id` - Get adherence status

## 🎨 UI Components

### Reusable Components
- `Navigation` - Main nav bar with active state
- Status cards with color coding (ON_TRACK, AT_RISK, OFF_TRACK)
- Interactive checkboxes for medications
- Form inputs with validation

### Styling
- Tailwind CSS for utility-first styling
- Custom color palette (primary, success, warning, danger)
- Responsive grid layouts
- Lucide React icons

## 🔧 Configuration

### Environment Variables
Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Tailwind Colors
Customize in `tailwind.config.js`:
```javascript
colors: {
  primary: { 50: '#f0f9ff', 600: '#0284c7' },
  success: { 50: '#f0fdf4', 600: '#16a34a' },
  warning: { 50: '#fffbeb', 600: '#d97706' },
  danger: { 50: '#fef2f2', 600: '#dc2626' },
}
```

## 🔨 Build for Production

```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

## 📊 Example Usage Flow

1. **Patient visits home page** → Clicks "Get Started"
2. **Upload page** → Uploads discharge PDF, fills patient info
3. **Backend processes** → Agents 1→2→3 extract and structure data
4. **Dashboard loads** → Shows medications, appointments, restrictions
5. **Daily check-in** → Patient tracks adherence each day
6. **Backend monitors** → Agent 4 analyzes patterns, Agent 5 escalates if needed

## 🎯 Key Features

### Document Upload
- Drag-and-drop file upload
- Patient profile form with literacy level
- Real-time processing with loading states
- Error handling and validation

### Dashboard
- Color-coded status indicators
- Critical medication highlighting
- Upcoming appointment tracking
- Activity restriction warnings

### Check-In
- Interactive medication checklist
- Visual feedback (green when completed)
- Restriction compliance tracking
- Optional patient notes
- Success confirmation

## 🛠️ Development

### Component Development
```javascript
'use client';  // For client-side components

import { useState } from 'react';
import { YourIcon } from 'lucide-react';

export default function YourComponent() {
  // Component logic
}
```

### API Integration Pattern
```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const loadData = async () => {
    try {
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, []);
```

## 📱 Mobile Responsive

All pages are mobile-responsive:
- Responsive grid layouts (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Mobile-friendly navigation
- Touch-friendly button sizes
- Readable font sizes on small screens

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel
Add `NEXT_PUBLIC_API_URL` to your Vercel project settings

## 📚 Documentation

- **Next.js**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev

## 🤝 Integration with Backend

Ensure backend is running on same domain or configure CORS:

```javascript
// Backend server.js
app.use(cors({
  origin: 'http://localhost:3001',  // Frontend URL
  credentials: true
}));
```

## ✨ Future Enhancements

- [ ] User authentication (JWT)
- [ ] Push notifications for reminders
- [ ] Medication history charts (Recharts)
- [ ] Caregiver dashboard
- [ ] Multi-language support
- [ ] Progressive Web App (PWA)
- [ ] Offline mode

---

**Built for Google Gemini Hackathon 2024** 🚀

For questions or issues, refer to the main project documentation.
