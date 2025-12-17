# CarePath AI Backend - API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Not implemented in this version (add JWT/API keys for production)

---

## Endpoints

### 1. Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-17T10:30:00.000Z",
  "uptime": 125.45
}
```

---

### 2. Patient Registration

**POST** `/api/patients`

Register a new patient in the system.

**Request Body:**
```json
{
  "patient_id": "PT-12345",
  "name": "John Doe",
  "age": 65,
  "chronic_conditions": true,
  "literacy_level": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "patient": {
    "patient_id": "PT-12345",
    "name": "John Doe",
    "age": 65,
    "has_chronic_conditions": true,
    "literacy_level": "medium",
    "created_at": "2024-12-17T10:30:00.000Z"
  }
}
```

---

### 3. Process Discharge Document (File Upload)

**POST** `/api/documents/process`

Upload and process a discharge summary PDF or text file.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `document` (file): PDF or TXT file
- `patient_id` (string): Patient identifier
- `age` (number, optional): Patient age
- `has_chronic_conditions` (boolean, optional)
- `literacy_level` (string, optional): "low", "medium", or "high"
- `lives_alone` (boolean, optional)
- `has_caregiver` (boolean, optional)

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/documents/process \
  -F "document=@discharge_summary.pdf" \
  -F "patient_id=PT-12345" \
  -F "age=65" \
  -F "has_chronic_conditions=true" \
  -F "literacy_level=medium"
```

**Response:**
```json
{
  "success": true,
  "session_id": "session_1702819800000_abc123",
  "results": {
    "agent1": {
      "medications": [
        {
          "name": "Aspirin",
          "dosage": "81mg",
          "frequency": "once daily",
          "route": "oral",
          "is_critical": true,
          "confidence": "high"
        },
        {
          "name": "Metoprolol",
          "dosage": "25mg",
          "frequency": "twice daily",
          "route": "oral",
          "is_critical": true,
          "confidence": "high"
        }
      ],
      "follow_up_instructions": [
        {
          "specialty": "Cardiology",
          "timeframe": "2 weeks",
          "purpose": "Post-discharge follow-up",
          "is_critical": true
        }
      ],
      "warning_signs": [
        {
          "symptom": "Chest pain lasting more than 5 minutes",
          "severity": "emergency",
          "action": "Call 911 immediately"
        }
      ],
      "activity_restrictions": [
        {
          "restriction": "No heavy lifting (>10 lbs)",
          "duration": "2 weeks",
          "is_safety_critical": true
        }
      ],
      "overall_confidence": 0.85,
      "requires_human_review": false
    },
    "agent2": {
      "overall_risk_level": "MEDIUM",
      "confidence_score": 0.85,
      "risk_assessment": {
        "risk_reason": "Care plan complexity assessed based on 2 medications and 1 follow-up actions",
        "primary_concerns": [
          "Managing 2 medications",
          "1 follow-up appointments"
        ],
        "trending": "stable"
      },
      "complexity_metrics": {
        "medication_count": 2,
        "medication_complexity_score": 5,
        "follow_up_burden_score": 4
      },
      "support_recommendations": []
    },
    "agent3": {
      "daily_care_checklist": [
        {
          "time_of_day": "morning",
          "action": "Take Aspirin",
          "emoji": "💊"
        },
        {
          "time_of_day": "morning",
          "action": "Take Metoprolol",
          "emoji": "💊"
        }
      ],
      "medications": [
        {
          "medication_name": "Aspirin",
          "what_it_does": "Helps treat your condition",
          "when_to_take": "once daily",
          "how_to_take": "oral"
        }
      ],
      "warning_signs": {
        "emergency_call_911": [],
        "call_doctor_soon": [],
        "mention_at_appointment": []
      },
      "key_message": "Take your medications as prescribed and contact your doctor if you have questions.",
      "literacy_level_used": "medium"
    },
    "requires_human_review": false,
    "errors": []
  },
  "requires_human_review": false,
  "errors": []
}
```

---

### 4. Process Discharge Text (No File Upload)

**POST** `/api/documents/process-text`

Process discharge summary text directly without file upload.

**Request Body:**
```json
{
  "discharge_text": "DISCHARGE SUMMARY\n\nPatient Name: John Doe\nDischarge Medications:\n1. Aspirin 81mg once daily\n2. Metoprolol 25mg twice daily\n\nFollow-up: Cardiology in 2 weeks\n\nWarning Signs: Call 911 if you experience chest pain lasting more than 5 minutes.\n\nActivity Restrictions: No heavy lifting (>10 lbs) for 2 weeks.",
  "patient_context": {
    "patient_id": "PT-12345",
    "age": 65,
    "has_chronic_conditions": true,
    "literacy_level": "medium"
  }
}
```

**Response:** Same as `/api/documents/process`

---

### 5. Submit Daily Check-In

**POST** `/api/adherence/check-in`

Submit daily medication and activity check-in.

**Request Body:**
```json
{
  "patient_id": "PT-12345",
  "check_in_data": {
    "date": "2024-12-17",
    "medications": [
      {
        "name": "Aspirin",
        "taken": true
      },
      {
        "name": "Metoprolol",
        "taken": false
      }
    ],
    "appointments": [],
    "restrictions": [
      {
        "description": "No heavy lifting",
        "followed": true
      }
    ],
    "patient_notes": "Forgot evening medication"
  }
}
```

**Response:**
```json
{
  "success": true,
  "adherence_status": "AT_RISK",
  "escalation_triggered": false,
  "errors": []
}
```

---

### 6. Get Adherence History

**GET** `/api/adherence/history/:patientId?days=7`

Retrieve check-in history for a patient.

**Query Parameters:**
- `days` (optional): Number of days to retrieve (default: 7)

**Response:**
```json
{
  "success": true,
  "patient_id": "PT-12345",
  "check_ins": [
    {
      "date": "2024-12-17",
      "medications": [
        { "name": "Aspirin", "taken": true },
        { "name": "Metoprolol", "taken": false }
      ],
      "timestamp": "2024-12-17T10:30:00.000Z",
      "adherence_assessment": {
        "adherence_status": "AT_RISK",
        "medication_adherence": {
          "overall_percentage": 75.0
        }
      }
    }
  ],
  "total": 1
}
```

---

### 7. Get Current Adherence Status

**GET** `/api/adherence/status/:patientId`

Get the most recent adherence status for a patient.

**Response:**
```json
{
  "success": true,
  "patient_id": "PT-12345",
  "current_status": "AT_RISK",
  "last_check_in": "2024-12-17T10:30:00.000Z",
  "total_check_ins": 7
}
```

---

### 8. Get Patient Care Plan

**GET** `/api/patients/:patientId/care-plan`

Retrieve the active care plan for a patient.

**Response:**
```json
{
  "success": true,
  "care_plan": {
    "medications": [
      {
        "name": "Aspirin",
        "dosage": "81mg",
        "frequency": "once daily",
        "route": "oral",
        "is_critical": true
      }
    ],
    "appointments": [
      {
        "specialty": "Cardiology",
        "timeframe": "2 weeks",
        "purpose": "Post-discharge follow-up",
        "is_critical": true
      }
    ],
    "restrictions": [
      {
        "restriction": "No heavy lifting (>10 lbs)",
        "duration": "2 weeks",
        "is_safety_critical": true
      }
    ],
    "created_at": "2024-12-17T10:00:00.000Z"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "No document file provided"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Patient not found"
}
```

### 429 Rate Limited
```json
{
  "success": false,
  "error": "Too many requests, please try again later",
  "retry_after": 60,
  "type": "RATE_LIMIT",
  "retryable": true
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "type": "GEMINI_ERROR",
  "retryable": true
}
```

---

## Testing with cURL

### Example 1: Process Discharge Text
```bash
curl -X POST http://localhost:3000/api/documents/process-text \
  -H "Content-Type: application/json" \
  -d '{
    "discharge_text": "DISCHARGE MEDICATIONS: Aspirin 81mg daily, Metoprolol 25mg twice daily. FOLLOW-UP: Cardiology in 2 weeks. WARNING: Call 911 for chest pain.",
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
        { "name": "Metoprolol", "taken": true }
      ],
      "patient_notes": "Feeling good today"
    }
  }'
```

---

## Rate Limits

- **Client rate limit**: 100 requests per minute per IP
- **Gemini API limits**:
  - 15 requests per minute
  - 1M tokens per minute
  - 1500 requests per day

The backend automatically manages Gemini rate limits with exponential backoff.
