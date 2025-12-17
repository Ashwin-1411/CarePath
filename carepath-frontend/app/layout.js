import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'CarePath AI - Healthcare Discharge Assistant',
    description: 'AI-powered post-discharge care coordination and monitoring',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen bg-gray-50">
                    <Navigation />
                    <main className="container mx-auto px-4 py-8 max-w-7xl">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    )
}
