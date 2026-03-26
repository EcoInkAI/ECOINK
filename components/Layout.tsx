import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useRouter } from "next/router";
import Head from "next/head";

interface LayoutProps {
    children: ReactNode;
    pageProps?: any;
}

export default function Layout({ children, pageProps }: LayoutProps) {
    const router = useRouter();
    const isAdmin = router.pathname.startsWith('/admin');

    if (isAdmin) {
        return (
            <div className="min-h-screen flex flex-col bg-background text-foreground">
                <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Head>
                <title>EcoInk | AI-Powered Growth Engine</title>
                <meta name="description" content="Turn demand into booked jobs automatically." />
            </Head>
            <Navbar />
            <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
                {children}
            </main>
            <Footer />
        </div>
    );
}
