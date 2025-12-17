'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Save, Loader2 } from 'lucide-react';
import { getCarePlan, submitCheckIn } from '@/lib/api';

export default function CheckInPage() {
    const [carePlan, setCarePlan] = useState(null);
    const [checkInData, setCheckInData] = useState({
        medications: [],
        restrictions: [],
        patient_notes: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCarePlan = async () => {
            const patientId = localStorage.getItem('patient_id');

            if (!patientId) {
                setError('No patient ID found. Please upload a discharge document first.');
                setLoading(false);
                return;
            }

            try {
                const data = await getCarePlan(patientId);
                const plan = data.care_plan;
                setCarePlan(plan);

                // Initialize check-in data
                setCheckInData({
                    medications: plan.medications?.map(med => ({
                        name: med.name,
                        taken: false,
                    })) || [],
                    restrictions: plan.restrictions?.map(rest => ({
                        description: rest.restriction,
                        followed: true,
                    })) || [],
                    patient_notes: '',
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadCarePlan();
    }, []);

    const handleMedicationToggle = (index) => {
        const updated = [...checkInData.medications];
        updated[index].taken = !updated[index].taken;
        setCheckInData({ ...checkInData, medications: updated });
    };

    const handleRestrictionToggle = (index) => {
        const updated = [...checkInData.restrictions];
        updated[index].followed = !updated[index].followed;
        setCheckInData({ ...checkInData, restrictions: updated });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const patientId = localStorage.getItem('patient_id');
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            await submitCheckIn(patientId, {
                date: new Date().toISOString().split('T')[0],
                medications: checkInData.medications,
                restrictions: checkInData.restrictions,
                patient_notes: checkInData.patient_notes,
            });

            setSuccess(true);

            // Auto-reset success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error && !carePlan) {
        return (
            <div className="card p-6 bg-danger-50 border-danger-200">
                <p className="text-danger-700">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Check-In</h1>
                <p className="text-gray-600">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Medications */}
                {checkInData.medications.length > 0 && (
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Today's Medications
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Check off each medication as you take it
                        </p>

                        <div className="space-y-3">
                            {checkInData.medications.map((med, index) => {
                                const medDetails = carePlan.medications[index];
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleMedicationToggle(index)}
                                        className={`w-full flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${med.taken
                                                ? 'bg-success-50 border-success-300'
                                                : 'bg-white border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {med.taken ? (
                                            <CheckCircle className="h-6 w-6 text-success-600 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <Circle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                                        )}
                                        <div className="text-left flex-1">
                                            <h3 className={`font-medium ${med.taken ? 'text-success-900' : 'text-gray-900'}`}>
                                                {med.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {medDetails.dosage} • {medDetails.frequency}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Activity Restrictions */}
                {checkInData.restrictions.length > 0 && (
                    <div className="card p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Activity Restrictions
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Did you follow these restrictions today?
                        </p>

                        <div className="space-y-3">
                            {checkInData.restrictions.map((restriction, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleRestrictionToggle(index)}
                                    className={`w-full flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${restriction.followed
                                            ? 'bg-success-50 border-success-300'
                                            : 'bg-warning-50 border-warning-300'
                                        }`}
                                >
                                    {restriction.followed ? (
                                        <CheckCircle className="h-6 w-6 text-success-600 flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <Circle className="h-6 w-6 text-warning-600 flex-shrink-0 mt-0.5" />
                                    )}
                                    <div className="text-left flex-1">
                                        <h3 className={`font-medium ${restriction.followed ? 'text-success-900' : 'text-warning-900'}`}>
                                            {restriction.description}
                                        </h3>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Notes */}
                <div className="card p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes (Optional)</h2>
                    <textarea
                        className="input min-h-[100px]"
                        value={checkInData.patient_notes}
                        onChange={(e) => setCheckInData({
                            ...checkInData,
                            patient_notes: e.target.value
                        })}
                        placeholder="How are you feeling today? Any challenges or questions?"
                    />
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>Check-in submitted successfully!</span>
                    </div>
                )}

                {error && (
                    <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-primary disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5" />
                            <span>Submit Check-In</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
