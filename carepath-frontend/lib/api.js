import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// API Functions

export const processDischargeDocument = async (file, patientContext) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('patient_id', patientContext.patient_id);
    formData.append('age', patientContext.age || '');
    formData.append('has_chronic_conditions', patientContext.has_chronic_conditions || false);
    formData.append('literacy_level', patientContext.literacy_level || 'medium');
    formData.append('lives_alone', patientContext.lives_alone || false);
    formData.append('has_caregiver', patientContext.has_caregiver || false);

    const response = await api.post('/api/documents/process', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const processDischargeText = async (dischargeText, patientContext) => {
    const response = await api.post('/api/documents/process-text', {
        discharge_text: dischargeText,
        patient_context: patientContext,
    });

    return response.data;
};

export const registerPatient = async (patientData) => {
    const response = await api.post('/api/patients', patientData);
    return response.data;
};

export const getPatient = async (patientId) => {
    const response = await api.get(`/api/patients/${patientId}`);
    return response.data;
};

export const getCarePlan = async (patientId) => {
    const response = await api.get(`/api/patients/${patientId}/care-plan`);
    return response.data;
};

export const submitCheckIn = async (patientId, checkInData) => {
    const response = await api.post('/api/adherence/check-in', {
        patient_id: patientId,
        check_in_data: checkInData,
    });

    return response.data;
};

export const getAdherenceHistory = async (patientId, days = 7) => {
    const response = await api.get(`/api/adherence/history/${patientId}?days=${days}`);
    return response.data;
};

export const getAdherenceStatus = async (patientId) => {
    const response = await api.get(`/api/adherence/status/${patientId}`);
    return response.data;
};

export default api;
