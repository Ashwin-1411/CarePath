/**
 * In-memory database for development
 * In production, replace with PostgreSQL, MongoDB, etc.
 */

class InMemoryDatabase {
    constructor() {
        this.patients = new Map();
        this.sessions = new Map();
        this.carePlans = new Map();
        this.riskAssessments = new Map();
        this.checkIns = new Map(); // patientId -> array of check-ins
        this.escalations = new Map(); // patientId -> array of escalations
    }

    // Patients
    async getPatient(patientId) {
        return this.patients.get(patientId);
    }

    async setPatient(patientId, data) {
        this.patients.set(patientId, data);
    }

    // Sessions
    async getSession(sessionId) {
        return this.sessions.get(sessionId);
    }

    async setSession(sessionId, data) {
        this.sessions.set(sessionId, data);
    }

    // Care Plans
    async getCarePlan(patientId) {
        return this.carePlans.get(patientId);
    }

    async setCarePlan(patientId, data) {
        this.carePlans.set(patientId, data);

        // Also cache risk assessment if present
        if (data.risk_assessment) {
            this.riskAssessments.set(patientId, data.risk_assessment);
        }
    }

    async getRiskAssessment(patientId) {
        return this.riskAssessments.get(patientId);
    }

    // Check-ins
    async addCheckIn(patientId, checkInData) {
        if (!this.checkIns.has(patientId)) {
            this.checkIns.set(patientId, []);
        }
        this.checkIns.get(patientId).push(checkInData);
    }

    async getRecentCheckIns(patientId, days = 7) {
        const checkIns = this.checkIns.get(patientId) || [];
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return checkIns.filter(checkIn => {
            const checkInDate = new Date(checkIn.timestamp || checkIn.date);
            return checkInDate >= cutoffDate;
        });
    }

    // Escalations
    async addEscalation(patientId, escalationData) {
        if (!this.escalations.has(patientId)) {
            this.escalations.set(patientId, []);
        }
        this.escalations.get(patientId).push(escalationData);
    }

    async getRecentEscalations(patientId, days = 7) {
        const escalations = this.escalations.get(patientId) || [];
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return escalations.filter(esc => {
            const escDate = new Date(esc.timestamp);
            return escDate >= cutoffDate;
        });
    }
}

const dbInstance = new InMemoryDatabase();

export const db = {
    patients: {
        get: (id) => dbInstance.getPatient(id),
        set: (id, data) => dbInstance.setPatient(id, data)
    },
    sessions: {
        get: (id) => dbInstance.getSession(id),
        set: (id, data) => dbInstance.setSession(id, data)
    },
    carePlans: {
        get: (id) => dbInstance.getCarePlan(id),
        set: (id, data) => dbInstance.setCarePlan(id, data)
    },
    riskAssessments: {
        get: (id) => dbInstance.getRiskAssessment(id)
    },
    checkIns: {
        add: (patientId, data) => dbInstance.addCheckIn(patientId, data),
        getRecent: (patientId, days) => dbInstance.getRecentCheckIns(patientId, days)
    },
    escalations: {
        add: (patientId, data) => dbInstance.addEscalation(patientId, data),
        getRecent: (patientId, days) => dbInstance.getRecentEscalations(patientId, days)
    }
};
