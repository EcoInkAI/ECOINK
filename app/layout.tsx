import type { Metadata } from 'next';
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: {
        default: 'EcoInk | AI-Powered Growth Engine',
        template: '%s | EcoInk',
    },
    description: "The AI-powered growth engine for service businesses. Combine Ads + Voice for predictable, automated growth.",
    icons: {
        icon: '/Logo/logo.png',
        apple: '/Logo/logo.png',
    },
    verification: {
        google: 'IYY41q_TNuCvYtr-NF3llV0zHLjAO0Wsq3caqbgy5W8',
    },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookingProvider } from "@/lib/BookingContext";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <BookingProvider>
                    <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1 pt-20 lg:pt-28">{children}</main>
                        <Footer />
                    </div>
                </BookingProvider>
            </body>
        </html>
    );
}
