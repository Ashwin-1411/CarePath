'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Upload, Activity, LayoutDashboard } from 'lucide-react';

export default function Navigation() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Upload Document', href: '/upload', icon: Upload },
        { name: 'Daily Check-In', href: '/check-in', icon: Activity },
    ];

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Heart className="h-8 w-8 text-primary-600" />
                        <span className="text-xl font-bold text-gray-900">CarePath AI</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
