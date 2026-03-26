import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, Image as ImageIcon, CheckCircle, Globe, Hash, Calendar, Layout, Tag, Type, Search, Share2, Eye, ShieldAlert, ArrowUpRight, Activity } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import SeoMetaBox from '@/components/admin/SeoMetaBox';
// CSS moved to _app.tsx


const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const slugify = (text: string) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
    ],
};

interface BlogFormProps {
    post: any;
    categories?: any[];
}

export default function EditBlog({ post: initialPost }: BlogFormProps) {
    const router = useRouter();

    // Safe defaults
    const postData = initialPost || {};

    // Initialize state with all fields
    const [post, setPost] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        coverImage: '',
        isPublished: false,

        // SEO
        metaTitle: '',
        metaDescription: '',
        focusKeyword: '',
        canonicalUrl: '',
        noIndex: false,
        noFollow: false,

        // Social
        ogTitle: '',
        ogDescription: '',
        ogImage: '',

        ...postData,

        // Map relations to flat strings if editing
        categoryName: postData.category?.name || '',
        tagsString: postData.tags?.map((t: any) => t.name).join(', ') || '',
        publishedAt: postData.publishedAt ? new Date(postData.publishedAt).toISOString().slice(0, 16) : '',
        readingTime: postData.readingTime || 0,
        // NEW SEO FIELDS
        seoTitle: postData.seoTitle || '',
        seoDescription: postData.seoDescription || '',
        seoKeywords: postData.seoKeywords || '',
        focusKeyphrase: postData.focusKeyphrase || '',
        metaRobots: postData.metaRobots || 'index,follow',
        ogType: postData.ogType || 'article',
        schemaType: postData.schemaType || 'Article',
        schemaJson: postData.schemaJson || {},
        breadcrumbTitle: postData.breadcrumbTitle || '',
        twitterCard: postData.twitterCard || 'summary_large_image',
        seoScore: postData.seoScore || 0,
        readabilityScore: postData.readabilityScore || 0
    });

    const [isSaving, setIsSaving] = useState(false);
    const [activeSeoTab, setActiveSeoTab] = useState<'general' | 'social' | 'advanced'>('general');

    // Auto-calculate reading time
    useEffect(() => {
        const text = post.content.replace(/<[^>]+>/g, '');
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        setPost((prev: any) => ({ ...prev, readingTime: minutes }));
    }, [post.content]);

    // Handle Save
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const method = post.id ? 'PUT' : 'POST';
        const url = post.id ? `/api/blogs/${post.id}` : '/api/blogs';

        // Transform for API
        const tagsList = post.tagsString.split(',').map((t: string) => t.trim()).filter((t: string) => t);

        const payload = {
            ...post,
            // Clean up temp fields
            categoryName: undefined,
            tagsString: undefined,

            // Handle Dates
            publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,

            // Handle Relations
            category: post.categoryName ? {
                connectOrCreate: {
                    where: { name: post.categoryName },
                    create: { name: post.categoryName, slug: slugify(post.categoryName) }
                }
            } : undefined,

            tags: post.id ? {
                // Update: clear and reconnect? 
                // Since REST API 'update' allows set, we can replace tags.
                set: [], // Disconnect all
                connectOrCreate: tagsList.map((tag: string) => ({
                    where: { name: tag },
                    create: { name: tag, slug: slugify(tag) }
                }))
            } : {
                // Create
                connectOrCreate: tagsList.map((tag: string) => ({
                    where: { name: tag },
                    create: { name: tag, slug: slugify(tag) }
                }))
            }
        };

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (res.ok) router.push('/admin/blogs');
            else alert('Failed to save. Check inputs.');
        } catch (error) {
            console.error(error);
            alert('Error saving blog.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AdminLayout>
            <form onSubmit={handleSave} className="max-w-[1600px] mx-auto pb-20">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0">
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-outfit uppercase tracking-tight">
                                {post.id ? 'Edit' : 'Create'} Article
                            </h1>
                            <p className="text-xs text-gray-400 font-medium">Compose a professional blog post</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className={`h-11 rounded-1xl px-4 font-bold text-[10px] uppercase tracking-widest ${post.isPublished ? 'text-green-600 bg-green-50' : 'text-[#6ee600] bg-[#7FFF00]/10'}`}
                            onClick={() => setPost({ ...post, isPublished: !post.isPublished })}
                        >
                            {post.isPublished ? <CheckCircle size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
                            {post.isPublished ? 'Published' : 'Draft Mode'}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-[#7FFF00] hover:bg-[#6ee600] text-white font-black h-11 px-6 rounded-1xl shadow-lg shadow-[#7FFF00]/20 active:scale-95 transition-all text-[10px] uppercase tracking-widest"
                        >
                            {isSaving ? 'Saving...' : <><Save size={16} className="mr-2" /> Save Changes</>}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: EDITOR (8/12) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Main Content Card */}
                        <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
                            {/* Title */}
                            <div>
                                <input
                                    className="w-full text-3xl md:text-4xl font-black text-gray-900 border-none outline-none focus:ring-0 placeholder:text-gray-200 font-outfit leading-tight"
                                    placeholder="Enter Title Here..."
                                    value={post.title}
                                    onChange={e => setPost({ ...post, title: e.target.value, slug: !post.id ? slugify(e.target.value) : post.slug })}
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-2">Permalink:</span>
                                <span className="text-gray-400 text-sm">/blogs/</span>
                                <input
                                    className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 w-full focus:ring-0"
                                    value={post.slug}
                                    onChange={e => setPost({ ...post, slug: e.target.value })}
                                />
                            </div>

                            {/* Rich Editor */}
                            <div className="min-h-[500px] border-t border-gray-100 pt-4">
                                <ReactQuill
                                    theme="snow"
                                    value={post.content}
                                    onChange={val => {
                                        if (val !== post.content) {
                                            setPost((prev: any) => ({ ...prev, content: val }));
                                        }
                                    }}
                                    modules={modules}
                                    className="h-[400px] mb-12"
                                />
                            </div>
                        </div>

                        {/* SEO Section */}
                        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="border-b border-gray-100 bg-gray-50/50 p-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setActiveSeoTab('general')}
                                    className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors ${activeSeoTab === 'general' ? 'bg-white shadow-sm text-[#6ee600]' : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                    <Search size={14} className="inline mr-2" /> General SEO
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveSeoTab('social')}
                                    className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors ${activeSeoTab === 'social' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                    <Share2 size={14} className="inline mr-2" /> Social Sharing
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveSeoTab('advanced')}
                                    className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors ${activeSeoTab === 'advanced' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                    <ShieldAlert size={14} className="inline mr-2" /> Advanced
                                </button>
                            </div>

                            <div className="p-6 md:p-8 space-y-6">
                                {activeSeoTab === 'general' && (
                                    <>
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <label className="text-xs font-bold text-gray-700 uppercase">Meta Title</label>
                                                <span className={`text-xs ${post.metaTitle?.length > 60 ? 'text-red-500' : 'text-green-500'}`}>{post.metaTitle?.length || 0} / 60</span>
                                            </div>
                                            <input
                                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-[#7FFF00] outline-none"
                                                value={post.metaTitle || ''}
                                                onChange={e => setPost({ ...post, metaTitle: e.target.value })}
                                                placeholder="SEO Title (defaults to Title)"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <label className="text-xs font-bold text-gray-700 uppercase">Meta Description</label>
                                                <span className={`text-xs ${post.metaDescription?.length > 160 ? 'text-red-500' : 'text-green-500'}`}>{post.metaDescription?.length || 0} / 160</span>
                                            </div>
                                            <textarea
                                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-[#7FFF00] outline-none h-24 resize-none"
                                                value={post.metaDescription || ''}
                                                onChange={e => setPost({ ...post, metaDescription: e.target.value })}
                                                placeholder="A short summary for search engines."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">Focus Keyword</label>
                                            <input
                                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-[#7FFF00] outline-none"
                                                value={post.focusKeyword || ''}
                                                onChange={e => setPost({ ...post, focusKeyword: e.target.value })}
                                                placeholder="Main keyword target"
                                            />
                                        </div>
                                    </>
                                )}

                                {activeSeoTab === 'social' && (
                                    <>
                                        <div className="bg-blue-50 p-4 rounded-xl mb-4 border border-blue-100">
                                            <h4 className="text-xs font-bold text-blue-800 uppercase mb-1">Open Graph Preview</h4>
                                            <p className="text-xs text-blue-600">This connects how your post looks on Facebook, Twitter, and LinkedIn.</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">OG Title</label>
                                                    <input
                                                        className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none"
                                                        value={post.ogTitle || ''}
                                                        onChange={e => setPost({ ...post, ogTitle: e.target.value })}
                                                        placeholder="Social Title"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">OG Description</label>
                                                    <textarea
                                                        className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none h-24"
                                                        value={post.ogDescription || ''}
                                                        onChange={e => setPost({ ...post, ogDescription: e.target.value })}
                                                        placeholder="Social Description"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">OG Image</label>
                                                <ImageUploader
                                                    currentImage={post.ogImage}
                                                    onImageUploaded={(url) => setPost({ ...post, ogImage: url })}
                                                    folder="blogs/og"
                                                    saveToMedia={true}
                                                    aspectRatio="video"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeSeoTab === 'advanced' && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">Canonical URL</label>
                                            <input
                                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-purple-500 outline-none"
                                                value={post.canonicalUrl || ''}
                                                onChange={e => setPost({ ...post, canonicalUrl: e.target.value })}
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="flex gap-8">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="noIndex"
                                                    checked={post.noIndex}
                                                    onChange={e => setPost({ ...post, noIndex: e.target.checked })}
                                                    className="w-4 h-4 text-purple-600 rounded"
                                                />
                                                <div>
                                                    <label htmlFor="noIndex" className="font-bold text-sm text-gray-900 block">No Index</label>
                                                    <span className="text-xs text-gray-500">Tell Google NOT to index this page</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="noFollow"
                                                    checked={post.noFollow}
                                                    onChange={e => setPost({ ...post, noFollow: e.target.checked })}
                                                    className="w-4 h-4 text-purple-600 rounded"
                                                />
                                                <div>
                                                    <label htmlFor="noFollow" className="font-bold text-sm text-gray-900 block">No Follow</label>
                                                    <span className="text-xs text-gray-500">Don't follow links on this page</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: SIDEBAR (4/12) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Publish Box */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <Globe size={14} className="text-[#7FFF00]" /> Publishing
                            </h3>

                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Status</label>
                                <select
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium"
                                    value={post.isPublished ? 'published' : 'draft'}
                                    onChange={e => setPost({ ...post, isPublished: e.target.value === 'published' })}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Publish Date</label>
                                <input
                                    type="datetime-local"
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium"
                                    value={post.publishedAt || ''}
                                    onChange={e => setPost({ ...post, publishedAt: e.target.value })}
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Leave empty to publish immediately.</p>
                            </div>
                        </div>

                        {/* Organization */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <Tag size={14} className="text-[#7FFF00]" /> Organization
                            </h3>

                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Category</label>
                                <input
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                                    placeholder="e.g. Renovation"
                                    value={post.categoryName}
                                    onChange={e => setPost({ ...post, categoryName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Tags</label>
                                <input
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                                    placeholder="kitchen, modern, design (comma separated)"
                                    value={post.tagsString}
                                    onChange={e => setPost({ ...post, tagsString: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Featured Image */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <ImageIcon size={14} className="text-[#7FFF00]" /> Featured Image
                            </h3>
                            <ImageUploader
                                currentImage={post.coverImage}
                                onImageUploaded={(url, _, meta) => setPost({ ...post, coverImage: url, coverImageAlt: meta?.altText || post.coverImageAlt })}
                                initialMetadata={{ altText: post.coverImageAlt }}
                                folder="blogs"
                                saveToMedia={true}
                                aspectRatio="video"
                            />
                        </div>

                        {/* Excerpt */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <Type size={14} className="text-[#7FFF00]" /> Excerpt
                            </h3>
                            <textarea
                                className="w-full bg-gray-50 border-0 rounded-xl p-3 text-xs text-gray-600 h-32 resize-none outline-none focus:ring-1 focus:ring-[#7FFF00]/20"
                                placeholder="Short summary for listing cards..."
                                value={post.excerpt}
                                onChange={e => setPost({ ...post, excerpt: e.target.value })}
                            />
                        </div>

                        {/* Stats Helper */}
                        <div className="bg-gray-900 p-6 rounded-[24px] shadow-sm border border-gray-800 space-y-4 text-white">
                            <h3 className="text-xs font-black text-[#7FFF00] uppercase tracking-widest flex items-center gap-2 mb-4">
                                <Activity size={14} /> Content Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-2xl font-bold">{post.readingTime || 0}</span>
                                    <span className="text-[10px] text-gray-400 uppercase">Min Read</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-bold">{post.content.replace(/<[^>]+>/g, '').length}</span>
                                    <span className="text-[10px] text-gray-400 uppercase">Characters</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* PHASE 2: SEO META BOX - FULL WIDTH */}
                <div className="mt-8">
                    <SeoMetaBox
                        data={post}
                        onChange={(newData: any) => setPost(newData)}
                        content={post.content}
                    />
                </div>
            </form>
        </AdminLayout>
    );
}

export const getServerSideProps = async (context: any) => {
    const { id } = context.params;
    if (id === 'new') return { props: { post: null } };

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    try {
        const data = await prisma.blogPost.findUnique({
            where: { id },
            include: { tags: true, category: true }
        });
        await prisma.$disconnect();
        return { props: { post: JSON.parse(JSON.stringify(data)) } };
    } catch (e) {
        await prisma.$disconnect();
        return { props: { post: null } };
    }
};
