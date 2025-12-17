import geminiService from '../services/gemini.service.js';
import { AGENT1_SYSTEM_PROMPT, AGENT1_SCHEMA } from '../prompts/agent1.prompts.js';

class Agent1MedicalDocInterpreter {

    async execute(dischargeText, patientContext) {
        const userPrompt = this.buildUserPrompt(dischargeText, patientContext);

        const result = await geminiService.generateContentWithRetry({
            systemPrompt: AGENT1_SYSTEM_PROMPT,
            userPrompt,
            temperature: 0.1,
            responseSchema: AGENT1_SCHEMA,
            agentName: 'agent1'
        });

        return result;
    }

    buildUserPrompt(dischargeText, patientContext) {
        return `## TASK
Extract actionable post-discharge instructions from the following medical discharge summary.

## DISCHARGE SUMMARY TEXT
\`\`\`
${dischargeText}
\`\`\`

## PATIENT CONTEXT (optional)
${patientContext.name ? `Patient Name: ${patientContext.name}` : 'Not provided'}
${patientContext.age ? `Patient Age: ${patientContext.age}` : 'Not provided'}

## EXTRACTION INSTRUCTIONS
1. Focus ONLY on "Discharge Medications", "Follow-up Instructions", "Warning Signs", "Activity Restrictions", and "Diet" sections
2. Ignore all historical medical information
3. Extract medications exactly as written
4. For each warning sign, extract the exact symptom description
5. Assign confidence scores based on clarity

## OUTPUT
Return valid JSON matching the provided output schema.`;
    }
}

export default new Agent1MedicalDocInterpreter();
