import express from 'express';
import { db } from '../utils/database.js';

const router = express.Router();

/**
 * POST /api/patients
 * Register a new patient
 */
router.post('/', async (req, res, next) => {
    try {
        const { patient_id, name, age, chronic_conditions, literacy_level } = req.body;

        const patientData = {
            patient_id: patient_id || `patient_${Date.now()}`,
            name: name || 'Anonymous',
            age: age || null,
            has_chronic_conditions: chronic_conditions === true || chronic_conditions === 'true',
            literacy_level: literacy_level || 'medium',
            created_at: new Date().toISOString()
        };

        await db.patients.set(patientData.patient_id, patientData);

        res.status(201).json({
            success: true,
            patient: patientData
        });

    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/patients/:patientId
 * Get patient information
 */
router.get('/:patientId', async (req, res, next) => {
    try {
        const { patientId } = req.params;

        const patient = await db.patients.get(patientId);

        if (!patient) {
            return res.status(404).json({
                success: false,
                error: 'Patient not found'
            });
        }

        res.json({
            success: true,
            patient
        });

    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/patients/:patientId/care-plan
 * Get patient's current care plan
 */
router.get('/:patientId/care-plan', async (req, res, next) => {
    try {
        const { patientId } = req.params;

        const carePlan = await db.carePlans.get(patientId);

        if (!carePlan) {
            return res.status(404).json({
                success: false,
                error: 'Care plan not found - patient may not have processed discharge document yet'
            });
        }

        res.json({
            success: true,
            care_plan: carePlan
        });

    } catch (error) {
        next(error);
    }
});

export default router;
