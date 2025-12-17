import Link from 'next/link';
import { ArrowRight, Heart, Shield, Activity, Bell } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center py-12">
                <div className="flex justify-center mb-6">
                    <Heart className="h-20 w-20 text-primary-600" />
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                    CarePath AI
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Your intelligent post-discharge care assistant powered by Google Gemini AI.
                    Get personalized care plans, daily reminders, and proactive support for a smooth recovery.
                </p>
                <div className="flex justify-center space-x-4">
                    <Link href="/upload" className="btn-primary flex items-center space-x-2">
                        <span>Get Started</span>
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link href="/dashboard" className="btn-secondary">
                        View Dashboard
                    </Link>
                </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                <FeatureCard
                    icon={Shield}
                    title="Smart Document Processing"
                    description="AI extracts and structures your discharge instructions automatically"
                />
                <FeatureCard
                    icon={Activity}
                    title="Daily Check-Ins"
                    description="Track medications and activities with simple yes/no questions"
                />
                <FeatureCard
                    icon={Bell}
                    title="Proactive Alerts"
                    description="Get notified when you need extra support or attention"
                />
                <FeatureCard
                    icon={Heart}
                    title="Personalized Care"
                    description="Instructions adapted to your reading level and health needs"
                />
            </div>

            {/* How It Works */}
            <div className="mt-20">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                    How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Step
                        number="1"
                        title="Upload Document"
                        description="Upload your discharge summary (PDF or text) and fill in basic information"
                    />
                    <Step
                        number="2"
                        title="Get Your Plan"
                        description="AI creates a personalized care dashboard with medications, appointments, and warnings"
                    />
                    <Step
                        number="3"
                        title="Daily Check-Ins"
                        description="Track your progress daily and get alerts if you need support"
                    />
                </div>
            </div>

            {/* CTA */}
            <div className="mt-20 text-center card p-12 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Ready to start your recovery journey?
                </h2>
                <p className="text-gray-700 mb-6">
                    Upload your discharge document and get started in less than 2 minutes
                </p>
                <Link href="/upload" className="btn-primary inline-flex items-center space-x-2">
                    <span>Upload Discharge Document</span>
                    <ArrowRight className="h-5 w-5" />
                </Link>
            </div>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description }) {
    return (
        <div className="card p-6 text-center">
            <div className="flex justify-center mb-4">
                <Icon className="h-10 w-10 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
}

function Step({ number, title, description }) {
    return (
        <div className="text-center">
            <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {number}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
}
