'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, TrendingUp, Pill, Calendar, AlertTriangle } from 'lucide-react';
import { getCarePlan, getAdherenceStatus } from '@/lib/api';

export default function DashboardPage() {
    const [carePlan, setCarePlan] = useState(null);
    const [adherenceStatus, setAdherenceStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const patientId = localStorage.getItem('patient_id');

            if (!patientId) {
                setError('No patient ID found. Please upload a discharge document first.');
                setLoading(false);
                return;
            }

            try {
                const [carePlanData, adherenceData] = await Promise.all([
                    getCarePlan(patientId).catch(() => null),
                    getAdherenceStatus(patientId).catch(() => null),
                ]);

                setCarePlan(carePlanData?.care_plan || null);
                setAdherenceStatus(adherenceData || null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card p-6 bg-danger-50 border-danger-200">
                <p className="text-danger-700">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Your Care Dashboard</h1>
                <p className="text-gray-600 mt-1">Track your recovery and stay on top of your care plan</p>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Adherence Status */}
                <StatusCard
                    title="Adherence Status"
                    status={adherenceStatus?.current_status || 'UNKNOWN'}
                    icon={TrendingUp}
                />

                {/* Medications */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Medications</h3>
                        <Pill className="h-5 w-5 text-primary-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {carePlan?.medications?.length || 0}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Active prescriptions</p>
                </div>

                {/* Appointments */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Follow-ups</h3>
                        <Calendar className="h-5 w-5 text-primary-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {carePlan?.appointments?.length || 0}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Scheduled appointments</p>
                </div>
            </div>

            {/* Medications List */}
            {carePlan?.medications && carePlan.medications.length > 0 && (
                <div className="card p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Medications</h2>
                    <div className="space-y-3">
                        {carePlan.medications.map((med, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <Pill className={`h-5 w-5 mt-0.5 ${med.is_critical ? 'text-danger-600' : 'text-primary-600'}`} />
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-medium text-gray-900">{med.name}</h3>
                                        {med.is_critical && (
                                            <span className="px-2 py-0.5 text-xs font-medium bg-danger-100 text-danger-700 rounded">
                                                Critical
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <span className="font-medium">{med.dosage}</span> • {med.frequency} • {med.route}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Appointments */}
            {carePlan?.appointments && carePlan.appointments.length > 0 && (
                <div className="card p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
                    <div className="space-y-3">
                        {carePlan.appointments.map((appt, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <Calendar className={`h-5 w-5 mt-0.5 ${appt.is_critical ? 'text-danger-600' : 'text-primary-600'}`} />
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-medium text-gray-900">{appt.specialty}</h3>
                                        {appt.is_critical && (
                                            <span className="px-2 py-0.5 text-xs font-medium bg-danger-100 text-danger-700 rounded">
                                                Important
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Within {appt.timeframe} • {appt.purpose}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Activity Restrictions */}
            {carePlan?.restrictions && carePlan.restrictions.length > 0 && (
                <div className="card p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Restrictions</h2>
                    <div className="space-y-3">
                        {carePlan.restrictions.map((restriction, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-warning-50 rounded-lg">
                                <AlertTriangle className="h-5 w-5 mt-0.5 text-warning-600" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{restriction.restriction}</h3>
                                    <p className="text-sm text-gray-600 mt-1">Duration: {restriction.duration}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusCard({ title, status, icon: Icon }) {
    const statusConfig = {
        ON_TRACK: {
            bg: 'bg-success-50',
            border: 'border-success-200',
            text: 'text-success-700',
            icon: CheckCircle2,
            label: 'On Track',
        },
        AT_RISK: {
            bg: 'bg-warning-50',
            border: 'border-warning-200',
            text: 'text-warning-700',
            icon: AlertCircle,
            label: 'Needs Attention',
        },
        OFF_TRACK: {
            bg: 'bg-danger-50',
            border: 'border-danger-200',
            text: 'text-danger-700',
            icon: AlertCircle,
            label: 'Off Track',
        },
        UNKNOWN: {
            bg: 'bg-gray-50',
            border: 'border-gray-200',
            text: 'text-gray-700',
            icon: Clock,
            label: 'No Data',
        },
    };

    const config = statusConfig[status] || statusConfig.UNKNOWN;
    const StatusIcon = config.icon;

    return (
        <div className={`card p-6 ${config.bg} ${config.border}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <Icon className={`h-5 w-5 ${config.text}`} />
            </div>
            <div className="flex items-center space-x-2">
                <StatusIcon className={`h-6 w-6 ${config.text}`} />
                <p className={`text-xl font-bold ${config.text}`}>{config.label}</p>
            </div>
        </div>
    );
}
