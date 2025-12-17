import express from 'express';
import multer from 'multer';
import pdf from 'pdf-parse';
import orchestrator from '../orchestrator/index.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and text files are allowed'));
        }
    }
});

/**
 * POST /api/documents/process
 * Process a discharge document and generate patient care plan
 */
router.post('/process', upload.single('document'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No document file provided'
            });
        }

        // Extract patient context from request body
        const patientContext = {
            patient_id: req.body.patient_id || `patient_${Date.now()}`,
            age: req.body.age ? parseInt(req.body.age) : null,
            has_chronic_conditions: req.body.has_chronic_conditions === 'true',
            literacy_level: req.body.literacy_level || 'medium',
            lives_alone: req.body.lives_alone === 'true',
            has_caregiver: req.body.has_caregiver === 'true'
        };

        // Extract text from PDF or use plain text
        let dischargeText;

        if (req.file.mimetype === 'application/pdf') {
            console.log('📄 Extracting text from PDF...');
            const pdfData = await pdf(req.file.buffer);
            dischargeText = pdfData.text;
        } else {
            dischargeText = req.file.buffer.toString('utf-8');
        }

        if (!dischargeText || dischargeText.trim().length < 100) {
            return res.status(400).json({
                success: false,
                error: 'Document text too short or empty - possible OCR failure'
            });
        }

        console.log(`📋 Processing discharge document (${dischargeText.length} chars)`);

        // Process through orchestrator
        const result = await orchestrator.processDischargeDocument(
            dischargeText,
            patientContext
        );

        res.json(result);

    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/documents/process-text
 * Process discharge text directly (without file upload)
 */
router.post('/process-text', async (req, res, next) => {
    try {
        const { discharge_text, patient_context } = req.body;

        if (!discharge_text) {
            return res.status(400).json({
                success: false,
                error: 'discharge_text is required'
            });
        }

        const patientContext = {
            patient_id: patient_context?.patient_id || `patient_${Date.now()}`,
            age: patient_context?.age || null,
            has_chronic_conditions: patient_context?.has_chronic_conditions || false,
            literacy_level: patient_context?.literacy_level || 'medium',
            lives_alone: patient_context?.lives_alone || false,
            has_caregiver: patient_context?.has_caregiver || false
        };

        console.log(`📋 Processing discharge text (${discharge_text.length} chars)`);

        const result = await orchestrator.processDischargeDocument(
            discharge_text,
            patientContext
        );

        res.json(result);

    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/documents/session/:sessionId
 * Retrieve processed document results by session ID
 */
router.get('/session/:sessionId', async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        const { db } = await import('../utils/database.js');
        const session = await db.sessions.get(sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found'
            });
        }

        res.json({
            success: true,
            data: session
        });

    } catch (error) {
        next(error);
    }
});

export default router;
