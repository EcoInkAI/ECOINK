import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
    LayoutDashboard,
    CreditCard,
    FileText,
    Layers,
    BookOpen,
    Briefcase,
    Wrench,
    Users,
    Navigation,
    PanelBottom,
    Image as ImageIcon,
    Mail,
    MessageSquare,
    HelpCircle,
    ArrowRightLeft,
    Globe,
    Home,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Close sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [router.pathname]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
        { label: 'Hero Section', icon: CreditCard, href: '/admin/hero' },
        { label: 'Pages', icon: FileText, href: '/admin/pages' },
        { label: 'Sections', icon: Layers, href: '/admin/sections' },
        { label: 'Blogs', icon: BookOpen, href: '/admin/blogs' },
        { label: 'Projects', icon: Briefcase, href: '/admin/projects' },
        { label: 'Services', icon: Wrench, href: '/admin/services' },
        { label: 'Partners', icon: Users, href: '/admin/partners' },
        { label: 'Navbar', icon: Navigation, href: '/admin/navbar' },
        { label: 'Footer', icon: PanelBottom, href: '/admin/footer' },
        { label: 'Media', icon: ImageIcon, href: '/admin/media' },
        { label: 'Contact Messages', icon: Mail, href: '/admin/messages' },
        { label: 'Testimonials', icon: MessageSquare, href: '/admin/testimonials' },
        { label: 'FAQs', icon: HelpCircle, href: '/admin/faqs' },
        { label: 'Redirects', icon: ArrowRightLeft, href: '/admin/redirects' },
        { label: 'Home SEO', icon: Home, href: '/admin/settings/home' },
        { label: 'SEO Settings', icon: Globe, href: '/admin/settings/seo' },
        { label: 'Site Settings', icon: Settings, href: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <div className="lg:hidden bg-[#0a0a0a] text-white p-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 flex items-center justify-center bg-transparent rounded-lg p-0">
                        <Image
                            src="/Logo/logo.png"
                            alt="Ecoink Logo"
                            width={24}
                            height={24}
                            className="object-contain"
                        />
                    </div>
                    <h1 className="font-bold text-base text-white">Ecoink <span className="text-[#7FFF00]">Admin</span></h1>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 h-full lg:h-screen w-64 bg-[#0a0a0a] text-white z-50 
                flex flex-col border-r border-white/5 transition-transform duration-300 lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-white/5 hidden lg:flex items-center gap-3">
                    <div className="relative w-10 h-10 flex items-center justify-center bg-transparent rounded-xl p-0">
                        <Image
                            src="/Logo/logo.png"
                            alt="Ecoink Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl text-white leading-tight">Ecoink <span className="text-[#7FFF00]">Admin</span></h1>
                        <p className="text-[10px] uppercase font-black tracking-widest text-[#7FFF00]/50">Media Agency</p>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {navItems.map((item) => {
                            const isActive = router.pathname.startsWith(item.href);
                            return (
                                <li key={item.href}>
                                    <Link href={item.href}>
                                        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? 'bg-[#7FFF00]/10 text-[#7FFF00] ring-1 ring-[#7FFF00]/20 shadow-[0_0_15px_rgba(127,255,0,0.1)]'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                            }`}>
                                            <item.icon size={18} />
                                            {item.label}
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-4 border-t border-white/5 bg-[#0a1010]">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-[#7FFF00] flex items-center justify-center text-black font-bold shrink-0">
                            A
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">admin@ecoink.com.au</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                    </div>

                    <Button
                        variant="destructive"
                        className="w-full flex items-center gap-2 justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-0"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} /> Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                <div className="max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
