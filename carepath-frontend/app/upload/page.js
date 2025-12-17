'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { processDischargeDocument } from '@/lib/api';

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [patientContext, setPatientContext] = useState({
        patient_id: '',
        age: '',
        has_chronic_conditions: false,
        literacy_level: 'medium',
        lives_alone: false,
        has_caregiver: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Please select a discharge document');
            return;
        }

        if (!patientContext.patient_id) {
            setError('Please enter a patient ID');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await processDischargeDocument(file, patientContext);

            if (result.success) {
                // Store session ID and redirect to dashboard
                localStorage.setItem('session_id', result.session_id);
                localStorage.setItem('patient_id', patientContext.patient_id);
                router.push('/dashboard');
            } else {
                setError(result.error || 'Processing failed');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Upload Discharge Document
                </h1>
                <p className="text-gray-600">
                    Upload your discharge summary to get started with your personalized care plan
                </p>
            </div>

            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="card p-6 space-y-6">
                {/* Patient Information */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Patient Information
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="label">Patient ID *</label>
                            <input
                                type="text"
                                className="input"
                                value={patientContext.patient_id}
                                onChange={(e) => setPatientContext({
                                    ...patientContext,
                                    patient_id: e.target.value
                                })}
                                placeholder="e.g., PT-12345"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Age</label>
                            <input
                                type="number"
                                className="input"
                                value={patientContext.age}
                                onChange={(e) => setPatientContext({
                                    ...patientContext,
                                    age: e.target.value
                                })}
                                placeholder="Optional"
                            />
                        </div>

                        <div>
                            <label className="label">Reading Level</label>
                            <select
                                className="input"
                                value={patientContext.literacy_level}
                                onChange={(e) => setPatientContext({
                                    ...patientContext,
                                    literacy_level: e.target.value
                                })}
                            >
                                <option value="low">Simple (6th grade level)</option>
                                <option value="medium">Moderate (9th grade level)</option>
                                <option value="high">Advanced (College level)</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="chronic"
                                className="mr-2"
                                checked={patientContext.has_chronic_conditions}
                                onChange={(e) => setPatientContext({
                                    ...patientContext,
                                    has_chronic_conditions: e.target.checked
                                })}
                            />
                            <label htmlFor="chronic" className="text-sm text-gray-700">
                                Has chronic health conditions
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="caregiver"
                                className="mr-2"
                                checked={patientContext.has_caregiver}
                                onChange={(e) => setPatientContext({
                                    ...patientContext,
                                    has_caregiver: e.target.checked
                                })}
                            />
                            <label htmlFor="caregiver" className="text-sm text-gray-700">
                                Has a caregiver at home
                            </label>
                        </div>
                    </div>
                </div>

                {/* File Upload */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Discharge Document
                    </h2>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept=".pdf,.txt"
                            onChange={handleFileChange}
                        />

                        <label htmlFor="file-upload" className="cursor-pointer">
                            {file ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <FileText className="h-10 w-10 text-primary-600" />
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-gray-700">
                                        Click to upload discharge summary
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        PDF or TXT files only
                                    </p>
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !file}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <Upload className="h-5 w-5" />
                            <span>Process Document</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
