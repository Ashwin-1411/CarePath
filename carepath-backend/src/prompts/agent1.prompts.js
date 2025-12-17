// Agent 1 prompts and schemas
// Full prompts available in agent_1_medical_doc_interpreter_prompts.md

export const AGENT1_SYSTEM_PROMPT = `You are a Medical Document Interpreter for post-discharge care planning.

Extract ONLY actionable post-discharge instructions from discharge summaries. Focus on:
- Medications (name, dosage, frequency, route)
- Follow-up appointments
- Warning signs requiring medical attention
- Activity restrictions
- Diet modifications

Ignore all historical medical information. Assign confidence scores to each extracted item.`;

export const AGENT1_SCHEMA = {
    type: "object",
    properties: {
        medications: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    dosage: { type: "string" },
                    frequency: { type: "string" },
                    route: { type: "string" },
                    is_critical: { type: "boolean" },
                    confidence: { type: "string", enum: ["high", "medium", "low"] }
                },
                required: ["name", "dosage", "frequency"]
            }
        },
        follow_up_instructions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    specialty: { type: "string" },
                    timeframe: { type: "string" },
                    purpose: { type: "string" },
                    is_critical: { type: "boolean" }
                }
            }
        },
        warning_signs: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    symptom: { type: "string" },
                    severity: { type: "string", enum: ["emergency", "urgent", "routine"] },
                    action: { type: "string" }
                }
            }
        },
        activity_restrictions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    restriction: { type: "string" },
                    duration: { type: "string" },
                    is_safety_critical: { type: "boolean" }
                }
            }
        },
        overall_confidence: {
            type: "number",
            minimum: 0.0,
            maximum: 1.0
        },
        requires_human_review: {
            type: "boolean"
        }
    },
    required: ["medications", "follow_up_instructions", "warning_signs", "overall_confidence", "requires_human_review"]
};
