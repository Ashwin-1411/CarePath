import geminiService from '../services/gemini.service.js';
import Agent1 from '../agents/agent1.medical-doc-interpreter.js';
import Agent2 from '../agents/agent2.risk-stratification.js';
import Agent3 from '../agents/agent3.patient-communication.js';
import Agent4 from '../agents/agent4.adherence-monitoring.js';
import Agent5 from '../agents/agent5.escalation.js';
import { db } from '../utils/database.js';

class CarePathOrchestrator {

    /**
     * WORKFLOW 1: Process Discharge Document
     * Agents: 1 → 2 → 3
     */
    async processDischargeDocument(dischargeText, patientContext) {
        console.log('🚀 Starting discharge document processing workflow');

        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const results = {
            session_id: sessionId,
            agent1: null,
            agent2: null,
            agent3: null,
            requires_human_review: false,
            errors: []
        };

        try {
            // ============================================================
            // AGENT 1: Medical Document Interpreter
            // ============================================================

            console.log('🔄 Starting Agent 1: Medical Document Interpreter');

            try {
                const agent1Result = await Agent1.execute(dischargeText, patientContext);
                results.agent1 = agent1Result.data;

                // Confidence check
                if (agent1Result.data.overall_confidence < 0.5) {
                    console.warn('⚠️ Agent 1 low confidence');
                    results.requires_human_review = true;
                    results.errors.push({
                        agent: 'agent1',
                        severity: 'high',
                        message: 'Low extraction confidence - manual review recommended'
                    });

                    // Critical failure if no data extracted
                    if (agent1Result.data.medications.length === 0 &&
                        agent1Result.data.follow_up_instructions.length === 0) {
                        throw new Error('No medications or follow-ups extracted');
                    }
                }

                if (agent1Result.data.requires_human_review) {
                    results.requires_human_review = true;
                }

                console.log('✅ Agent 1 completed', {
                    medications: agent1Result.data.medications.length,
                    followUps: agent1Result.data.follow_up_instructions.length,
                    confidence: agent1Result.data.overall_confidence
                });

            } catch (error) {
                console.error('❌ Agent 1 failed:', error);
                throw {
                    stage: 'agent1',
                    message: error.message,
                    critical: true
                };
            }

            // ============================================================
            // AGENT 2: Risk Stratification
            // ============================================================

            console.log('🔄 Starting Agent 2: Risk Stratification');

            try {
                const agent2Result = await Agent2.execute(results.agent1, patientContext);
                results.agent2 = agent2Result.data;

                // Confidence check
                if (agent2Result.data.confidence_score < 0.6) {
                    console.warn('⚠️ Agent 2 low confidence');
                    results.requires_human_review = true;
                    results.errors.push({
                        agent: 'agent2',
                        severity: 'medium',
                        message: 'Risk assessment has low confidence'
                    });
                }

                console.log('✅ Agent 2 completed', {
                    risk_level: agent2Result.data.overall_risk_level,
                    confidence: agent2Result.data.confidence_score
                });

            } catch (error) {
                console.error('❌ Agent 2 failed, using fallback:', error);

                // Non-critical - use fallback
                results.agent2 = this.createFallbackRiskAssessment(results.agent1);
                results.requires_human_review = true;
                results.errors.push({
                    agent: 'agent2',
                    severity: 'medium',
                    message: 'Risk stratification failed - using fallback'
                });
            }

            // ============================================================
            // AGENT 3: Patient Communication
            // ============================================================

            console.log('🔄 Starting Agent 3: Patient Communication');

            try {
                const literacyLevel = patientContext.literacy_level || 'medium';
                const agent3Result = await Agent3.execute(
                    results.agent1,
                    literacyLevel,
                    patientContext
                );
                results.agent3 = agent3Result.data;

                console.log('✅ Agent 3 completed', {
                    literacy_level: agent3Result.data.literacy_level_used,
                    checklist_items: agent3Result.data.daily_care_checklist.length
                });

            } catch (error) {
                console.error('❌ Agent 3 failed, using fallback:', error);

                // Non-critical - use fallback
                results.agent3 = this.createFallbackPatientGuide(results.agent1);
                results.requires_human_review = true;
                results.errors.push({
                    agent: 'agent3',
                    severity: 'medium',
                    message: 'Patient communication failed - using simplified fallback'
                });
            }

            // ============================================================
            // PERSIST RESULTS
            // ============================================================

            await db.sessions.set(sessionId, results);

            // Cache care plan for Agent 4
            await db.carePlans.set(patientContext.patient_id, {
                medications: results.agent1.medications,
                appointments: results.agent1.follow_up_instructions,
                restrictions: results.agent1.activity_restrictions,
                created_at: new Date().toISOString()
            });

            return {
                success: true,
                session_id: sessionId,
                results,
                requires_human_review: results.requires_human_review,
                errors: results.errors
            };

        } catch (error) {
            console.error('❌ Workflow failed:', error);

            return {
                success: false,
                stage_failed: error.stage || 'unknown',
                error: error.message,
                partial_results: results
            };
        }
    }

    /**
     * WORKFLOW 2: Monitor Adherence & Escalate
     * Agents: 4 → (conditional) 5
     */
    async monitorAdherence(patientId, checkInData) {
        console.log('🚀 Starting adherence monitoring workflow', { patientId });

        const results = {
            agent4: null,
            agent5: null,
            escalation_triggered: false,
            errors: []
        };

        try {
            // Load cached data
            const carePlan = await db.carePlans.get(patientId);
            if (!carePlan) {
                throw new Error('Care plan not found - patient must complete discharge processing first');
            }

            const checkInHistory = await db.checkIns.getRecent(patientId, 7);
            const riskAssessment = await db.riskAssessments.get(patientId);
            const escalationHistory = await db.escalations.getRecent(patientId, 7);

            // ============================================================
            // AGENT 4: Adherence Monitoring
            // ============================================================

            console.log('🔄 Starting Agent 4: Adherence Monitoring');

            try {
                const fullHistory = [...checkInHistory, checkInData];
                const agent4Result = await Agent4.execute(carePlan, fullHistory);
                results.agent4 = agent4Result.data;

                console.log('✅ Agent 4 completed', {
                    adherence_status: agent4Result.data.adherence_status,
                    medication_adherence: agent4Result.data.medication_adherence.overall_percentage,
                    escalation_recommended: agent4Result.data.escalation_recommended
                });

                // Save check-in
                await db.checkIns.add(patientId, {
                    ...checkInData,
                    adherence_assessment: agent4Result.data,
                    timestamp: new Date().toISOString()
                });

                // Early exit if no escalation needed
                if (!agent4Result.data.escalation_recommended) {
                    console.log('✅ No escalation needed - patient on track');
                    return {
                        success: true,
                        adherence_status: agent4Result.data.adherence_status,
                        escalation_triggered: false
                    };
                }

                console.log('⚠️ Agent 4 recommends escalation - proceeding to Agent 5');

            } catch (error) {
                console.error('❌ Agent 4 failed:', error);
                throw {
                    stage: 'agent4',
                    message: error.message,
                    critical: true
                };
            }

            // ============================================================
            // AGENT 5: Escalation Decision
            // ============================================================

            console.log('🔄 Starting Agent 5: Escalation Decision');

            try {
                const agent5Result = await Agent5.execute(
                    riskAssessment,
                    results.agent4,
                    { patient_id: patientId },
                    escalationHistory
                );
                results.agent5 = agent5Result;

                // Check if function was called
                if (agent5Result.function_call) {
                    console.log('🚨 ESCALATION TRIGGERED', {
                        urgency: agent5Result.function_call.parameters.urgency_level,
                        confidence: agent5Result.function_call.parameters.confidence
                    });

                    // Save escalation
                    await db.escalations.add(patientId, {
                        ...agent5Result.function_call.parameters,
                        timestamp: new Date().toISOString(),
                        executed: true
                    });

                    results.escalation_triggered = true;
                } else {
                    console.log('✅ Agent 5 decided escalation not warranted');
                    results.escalation_triggered = false;
                }

            } catch (error) {
                console.error('❌ Agent 5 failed:', error);
                results.errors.push({
                    agent: 'agent5',
                    severity: 'medium',
                    message: 'Escalation decision failed - defaulting to no escalation'
                });
            }

            return {
                success: true,
                adherence_status: results.agent4.adherence_status,
                escalation_triggered: results.escalation_triggered,
                escalation_details: results.agent5?.function_call?.parameters,
                errors: results.errors
            };

        } catch (error) {
            console.error('❌ Adherence monitoring failed:', error);

            return {
                success: false,
                stage_failed: error.stage || 'unknown',
                error: error.message
            };
        }
    }

    // Fallback helpers
    createFallbackRiskAssessment(agent1Data) {
        const medCount = agent1Data.medications.length;
        const followUpCount = agent1Data.follow_up_instructions.length;

        let riskLevel = medCount <= 3 && followUpCount <= 1 ? 'LOW' :
            medCount <= 7 && followUpCount <= 3 ? 'MEDIUM' : 'HIGH';

        return {
            overall_risk_level: riskLevel,
            confidence_score: 0.4,
            risk_assessment: {
                risk_reason: 'Fallback heuristic-based assessment',
                primary_concerns: [`${medCount} medications`, `${followUpCount} follow-ups`],
                trending: 'stable'
            },
            requires_human_review: true,
            fallback_used: true
        };
    }

    createFallbackPatientGuide(agent1Data) {
        return {
            daily_care_checklist: agent1Data.medications.map(med => ({
                time_of_day: 'morning',
                action: `Take ${med.name} ${med.dosage}`,
                details: med.frequency
            })),
            medications: agent1Data.medications.map(med => ({
                medication_name: med.name,
                what_it_does: 'Consult your doctor for details',
                when_to_take: med.frequency,
                how_to_take: med.route
            })),
            warning_signs: {
                emergency_call_911: agent1Data.warning_signs
                    .filter(ws => ws.severity === 'emergency')
                    .map(ws => ({
                        symptom_in_plain_language: ws.symptom,
                        what_to_do: ws.action,
                        urgency_level: 'emergency_911'
                    })),
                call_doctor_soon: [],
                mention_at_appointment: []
            },
            key_message: 'Follow your discharge instructions. Contact your doctor with questions.',
            literacy_level_used: 'medium',
            fallback_used: true
        };
    }
}

export default new CarePathOrchestrator();
