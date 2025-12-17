import express from 'express';
import orchestrator from '../orchestrator/index.js';

const router = express.Router();

/**
 * POST /api/adherence/check-in
 * Submit daily patient check-in and monitor adherence
 */
router.post('/check-in', async (req, res, next) => {
    try {
        const { patient_id, check_in_data } = req.body;

        if (!patient_id) {
            return res.status(400).json({
                success: false,
                error: 'patient_id is required'
            });
        }

        if (!check_in_data) {
            return res.status(400).json({
                success: false,
                error: 'check_in_data is required'
            });
        }

        // Validate check-in data structure
        const checkIn = {
            date: check_in_data.date || new Date().toISOString().split('T')[0],
            responded: true,
            medications: check_in_data.medications || [],
            appointments: check_in_data.appointments || [],
            restrictions: check_in_data.restrictions || [],
            patient_notes: check_in_data.patient_notes || ''
        };

        console.log(`✅ Processing check-in for patient ${patient_id}`);

        const result = await orchestrator.monitorAdherence(patient_id, checkIn);

        res.json(result);

    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/adherence/history/:patientId
 * Get adherence history for a patient
 */
router.get('/history/:patientId', async (req, res, next) => {
    try {
        const { patientId } = req.params;
        const days = parseInt(req.query.days) || 7;

        const { db } = await import('../utils/database.js');
        const history = await db.checkIns.getRecent(patientId, days);

        res.json({
            success: true,
            patient_id: patientId,
            check_ins: history,
            total: history.length
        });

    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/adherence/status/:patientId
 * Get current adherence status for a patient
 */
router.get('/status/:patientId', async (req, res, next) => {
    try {
        const { patientId } = req.params;

        const { db } = await import('../utils/database.js');
        const recentCheckIns = await db.checkIns.getRecent(patientId, 7);

        if (recentCheckIns.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'No check-in data found for patient'
            });
        }

        const latestCheckIn = recentCheckIns[recentCheckIns.length - 1];

        res.json({
            success: true,
            patient_id: patientId,
            current_status: latestCheckIn.adherence_assessment?.adherence_status || 'UNKNOWN',
            last_check_in: latestCheckIn.timestamp,
            total_check_ins: recentCheckIns.length
        });

    } catch (error) {
        next(error);
    }
});

export default router;
