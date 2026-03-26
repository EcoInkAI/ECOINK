import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Search, Eye, ExternalLink, Calendar, User, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import FormattedDate from '@/components/admin/FormattedDate';

interface BlogsProps {
    initialPosts: any[];
}

export default function BlogsAdmin({ initialPosts }: BlogsProps) {
    const [posts, setPosts] = useState(initialPosts);
    const [search, setSearch] = useState('');

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;
        const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setPosts(posts.filter(p => p.id !== id));
        }
    };

    const filtered = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 bg-green-100';
        if (score >= 50) return 'text-[#6ee600] bg-[#7FFF00]/20';
        return 'text-red-600 bg-red-100';
    };

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-outfit uppercase tracking-tight">Blogs Management</h1>
                    <p className="text-gray-500 text-sm md:text-base">Create and manage blog posts for your website</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/" target="_blank" className="hidden sm:block">
                        <Button variant="outline" className="flex items-center gap-2 border-gray-200">
                            <ExternalLink size={16} /> View Website
                        </Button>
                    </Link>
                    <Link href="/admin/blogs/new" className="w-full sm:w-auto">
                        <Button className="w-full bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-[#7FFF00]/20 active:scale-95 transition-all">
                            <Plus size={18} className="mr-2" /> Create Blog Post
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-[#7FFF00]/50 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filtered.map((post) => (
                    <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
                        {/* SEO Badge */}
                        <div className={`absolute top-4 left-4 z-10 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${getScoreColor(post.seoScore || 0)}`}>
                            SEO: {post.seoScore || 0}
                        </div>

                        <div className="relative h-56 w-full">
                            {post.coverImage ? (
                                <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                                    <ImageIcon size={48} />
                                </div>
                            )}
                            {post.isPublished && (
                                <span className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg">
                                    Published
                                </span>
                            )}
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-[#6ee600] transition-colors font-outfit uppercase tracking-tight">
                                {post.title}
                            </h3>
                            <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1 leading-relaxed">
                                {post.excerpt || 'No excerpt provided for this post.'}
                            </p>

                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 pb-6 border-b border-gray-100">
                                <div className="flex items-center gap-1.5">
                                    <User size={14} className="text-gray-300" />
                                    Admin
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} className="text-gray-300" />
                                    <FormattedDate date={post.createdAt} />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 h-10 rounded-xl border-gray-100 hover:bg-gray-50 text-xs transition-all active:scale-95">
                                    <Eye size={14} className="mr-1.5" /> View
                                </Button>
                                <Link href={`/admin/blogs/${post.id}`} className="flex-1">
                                    <Button className="w-full h-10 bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold rounded-xl text-xs transition-all active:scale-95">
                                        <Edit size={14} className="mr-1.5" /> Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    className="bg-red-500 hover:bg-red-600 rounded-xl h-10 px-3 transition-all active:scale-95"
                                    onClick={() => handleDelete(post.id)}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full py-20 bg-white rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-gray-400">
                        <Search size={48} className="mb-4 opacity-20" />
                        <p className="font-bold">No blog posts found matching your search.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export const getServerSideProps = async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    try {
        const data = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
        await prisma.$disconnect();
        return { props: { initialPosts: JSON.parse(JSON.stringify(data)) } };
    } catch (e) {
        await prisma.$disconnect();
        return { props: { initialPosts: [] } };
    }
};
