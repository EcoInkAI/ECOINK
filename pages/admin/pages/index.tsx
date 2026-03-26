import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Search, FileText, Globe, Eye, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import FormattedDate from '@/components/admin/FormattedDate';

interface PagesProps {
    initialPages: any[];
}

export default function PagesAdmin({ initialPages }: PagesProps) {
    const [pages, setPages] = useState(initialPages);
    const [search, setSearch] = useState('');

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this page?')) return;
        const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
        if (res.ok) setPages(pages.filter(p => p.id !== id));
    };

    const filtered = pages.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase()));

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-outfit uppercase tracking-tight">Custom Pages</h1>
                    <p className="text-gray-500 text-sm md:text-base">Manage static and dynamic pages of your website.</p>
                </div>
                <Link href="/admin/pages/new">
                    <Button className="w-full sm:w-auto bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold h-12 rounded-xl shadow-lg shadow-[#7FFF00]/20 active:scale-95 transition-all">
                        <Plus size={18} className="mr-2" /> Create New Page
                    </Button>
                </Link>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by page title or slug..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-[#7FFF00]/50 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Mobile View: Cards */}
            <div className="lg:hidden space-y-4 mb-8">
                {filtered.map((page) => (
                    <div key={page.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#7FFF00]/10 text-[#6ee600] rounded-xl flex items-center justify-center shrink-0">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 line-clamp-1">{page.title}</h3>
                                    <p className="text-xs font-mono text-gray-400">/{page.slug}</p>
                                </div>
                            </div>
                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full shrink-0 ${page.isPublished ? 'bg-green-100 text-green-600' : 'bg-[#7FFF00]/20 text-[#6ee600]'}`}>
                                {page.isPublished ? 'Live' : 'Draft'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                            <span className="text-[10px] text-gray-400 font-medium">Updated <FormattedDate date={page.updatedAt} /></span>
                            <div className="flex gap-1">
                                <Link href={`/${page.slug}`} target="_blank">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg"><Eye size={18} /></button>
                                </Link>
                                <Link href={`/admin/pages/${page.id}`}>
                                    <button className="p-2 text-gray-400 hover:text-[#6ee600] rounded-lg"><Edit size={18} /></button>
                                </Link>
                                <button onClick={() => handleDelete(page.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center text-gray-400">
                        <FileText size={48} className="mx-auto mb-4 opacity-10" />
                        <p>No pages found.</p>
                    </div>
                )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                                <th className="px-6 py-4">Page Title</th>
                                <th className="px-6 py-4">Route Slug</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Last Modified</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((page) => (
                                <tr key={page.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#7FFF00]/10 text-[#6ee600] rounded-xl flex items-center justify-center shrink-0">
                                                <FileText size={20} />
                                            </div>
                                            <span className="font-bold text-gray-900 group-hover:text-[#6ee600] transition-colors truncate max-w-[200px]">{page.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">/{page.slug}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${page.isPublished ? 'bg-green-100 text-green-600' : 'bg-[#7FFF00]/20 text-[#6ee600]'}`}>
                                            {page.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-400 font-medium">
                                        <FormattedDate date={page.updatedAt} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                            <Link href={`/${page.slug}`} target="_blank">
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye size={18} /></button>
                                            </Link>
                                            <Link href={`/admin/pages/${page.id}`}>
                                                <button className="p-2 text-gray-400 hover:text-[#6ee600] hover:bg-[#7FFF00]/10 rounded-lg transition-all"><Edit size={18} /></button>
                                            </Link>
                                            <button onClick={() => handleDelete(page.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

export const getServerSideProps = async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    try {
        const data = await prisma.page.findMany({ orderBy: { updatedAt: 'desc' } });
        await prisma.$disconnect();
        return { props: { initialPages: JSON.parse(JSON.stringify(data)) } };
    } catch (e) {
        await prisma.$disconnect();
        return { props: { initialPages: [] } };
    }
};
