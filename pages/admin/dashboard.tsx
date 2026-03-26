import { AdminLayout } from '@/components/admin/AdminLayout';
import { GetServerSideProps } from 'next';
import {
    FileText,
    BookOpen,
    Briefcase,
    Wrench,
    Mail,
    MessageSquare,
    Activity,
    Plus,
    Image as ImageIcon,
    Settings
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface DashboardProps {
    stats: {
        pages: number;
        blogs: number;
        projects: number;
        services: number;
        messages: number;
        testimonials: number;
    }
}

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-outfit uppercase tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-500 text-sm md:text-base">CMS management and site activity tracking.</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/pages/new" className="w-full">
                        <Button className="w-full sm:w-auto bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold h-12 rounded-xl shadow-lg shadow-[#7FFF00]/20 active:scale-95 transition-all">
                            <Plus size={18} className="mr-2" /> Quick Page
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">

                {/* Total Pages */}
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Pages</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 font-outfit">{stats.pages}</h3>
                        </div>
                        <div className="p-3 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/30">
                            <FileText size={20} />
                        </div>
                    </div>
                </div>

                {/* Blog Posts */}
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Blog Posts</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 font-outfit">{stats.blogs}</h3>
                        </div>
                        <div className="p-3 bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-500/30">
                            <BookOpen size={20} />
                        </div>
                    </div>
                </div>

                {/* Projects */}
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Projects</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 font-outfit">{stats.projects}</h3>
                        </div>
                        <div className="p-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/30">
                            <Briefcase size={20} />
                        </div>
                    </div>
                </div>

                {/* Services */}
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Services</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 font-outfit">{stats.services}</h3>
                        </div>
                        <div className="p-3 bg-[#7FFF00] text-white rounded-xl shadow-lg shadow-[#7FFF00]/30">
                            <Wrench size={20} />
                        </div>
                    </div>
                </div>

                {/* Contact Messages */}
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Inquiries</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 font-outfit">{stats.messages}</h3>
                            <Link href="/admin/messages" className="text-xs text-[#6ee600] font-bold mt-2 inline-block hover:underline">View Messages →</Link>
                        </div>
                        <div className="p-3 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/30 relative">
                            <Mail size={20} />
                            {stats.messages > 0 && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span></span>}
                        </div>
                    </div>
                </div>

                {/* Testimonials */}
                <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Reviews</p>
                            <h3 className="text-3xl font-extrabold text-gray-900 font-outfit">{stats.testimonials}</h3>
                        </div>
                        <div className="p-3 bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/30">
                            <MessageSquare size={20} />
                        </div>
                    </div>
                </div>

                {/* Site Activity */}
                <div className="col-span-1 sm:col-span-2 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-outfit">Active</h3>
                    </div>
                    <div className="p-3 bg-teal-500 text-white rounded-xl shadow-lg shadow-teal-500/30">
                        <Activity size={20} />
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Link href="/admin/blogs/new" className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">New Blog Post</h4>
                                <p className="text-xs text-gray-500">Create article</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/projects" className="bg-white p-6 rounded-xl border border-gray-100 hover:border-green-500 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">New Project</h4>
                                <p className="text-xs text-gray-500">Add case study</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/media" className="bg-white p-6 rounded-xl border border-gray-100 hover:border-purple-500 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <ImageIcon size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Upload Media</h4>
                                <p className="text-xs text-gray-500">Add images</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/settings" className="bg-white p-6 rounded-xl border border-gray-100 hover:border-[#7FFF00] hover:shadow-md transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-[#7FFF00]/10 text-[#6ee600] rounded-lg group-hover:bg-[#6ee600] group-hover:text-white transition-colors">
                                <Settings size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Site Settings</h4>
                                <p className="text-xs text-gray-500">Configure</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="bg-white p-8 rounded-xl border border-gray-100">
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div> System is running smoothly
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-gray-400"></div> {stats.blogs} blog posts published
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div> {stats.messages} unread contact messages
                        </li>
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;
    const token = req.cookies['admin_token'];

    if (!token) {
        return {
            redirect: {
                destination: '/admin/login',
                permanent: false,
            },
        };
    }

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    try {
        const [pages, projects, blogs, services, messages, testimonials] = await Promise.all([
            prisma.page.count(),
            prisma.project.count(),
            prisma.blogPost.count(),
            prisma.service.count(),
            prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
            prisma.testimonial.count(),
        ]);

        await prisma.$disconnect();

        return {
            props: {
                stats: { pages, projects, blogs, services, messages, testimonials }
            }
        };
    } catch (e) {
        await prisma.$disconnect();
        return {
            props: {
                stats: { pages: 0, projects: 0, blogs: 0, services: 0, messages: 0, testimonials: 0 }
            }
        };
    }
};
