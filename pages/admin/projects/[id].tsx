import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, Image as ImageIcon, Plus, Trash2, CheckCircle, Eye, Globe, Type, Activity, Briefcase, MapPin, User, Search, Tag, LayoutGrid } from 'lucide-react';
import Image from 'next/image';
import ImageUploader from '@/components/admin/ImageUploader';
import SeoMetaBox from '@/components/admin/SeoMetaBox';
// CSS moved to _app.tsx


const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const quillStyles = `
  .ql-container {
    font-family: inherit;
    font-size: 16px;
    border-bottom-left-radius: 16px;
    border-bottom-right-radius: 16px;
    background: white;
  }
  .ql-toolbar {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    background: #f8fafc;
    border-color: #f1f5f9 !important;
  }
  .ql-container.ql-snow {
    border-color: #f1f5f9 !important;
  }
  .ql-editor {
    min-height: 300px;
    color: #1e293b !important;
  }
  .ql-editor.ql-blank::before {
    color: #cbd5e1 !important;
    font-style: normal;
  }
`;

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

interface ProjectFormProps {
    project: any;
}

export default function EditProject({ project: initialProject }: ProjectFormProps) {
    const router = useRouter();
    const [newTag, setNewTag] = useState('');

    const [project, setProject] = useState({
        title: '',
        slug: '',
        description: '',
        content: '',
        heroImage: '',
        location: '',
        client: '',
        category: '',
        galleryTitle: '',
        gallerySubtitle: '',
        isVisible: true,
        metaTitle: '',
        metaDescription: '',
        ...initialProject,
        tags: initialProject?.tags || [],
        images: initialProject?.images || [],
        thumbnailImage: initialProject?.thumbnailImage || '',
        thumbnailImageAlt: initialProject?.thumbnailImageAlt || '',
        // NEW SEO FIELDS
        seoTitle: initialProject?.seoTitle || '',
        seoDescription: initialProject?.seoDescription || '',
        seoKeywords: initialProject?.seoKeywords || '',
        focusKeyphrase: initialProject?.focusKeyphrase || '',
        metaRobots: initialProject?.metaRobots || 'index,follow',
        ogType: initialProject?.ogType || 'website',
        schemaType: initialProject?.schemaType || 'WebPage',
        schemaJson: initialProject?.schemaJson || {},
        breadcrumbTitle: initialProject?.breadcrumbTitle || '',
        twitterCard: initialProject?.twitterCard || 'summary_large_image',
        seoScore: initialProject?.seoScore || 0,
        readabilityScore: initialProject?.readabilityScore || 0
    });


    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const method = project.id ? 'PUT' : 'POST';
        const url = project.id ? `/api/projects/${project.id}` : '/api/projects';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(project),
            });

            if (res.ok) router.push('/admin/projects');
            else alert('Failed to save. Check inputs.');
        } catch (error) {
            console.error(error);
            alert('Error saving project.');
        } finally {
            setIsSaving(false);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...project.images];
        newImages.splice(index, 1);
        setProject({ ...project, images: newImages });
    };

    const addTag = () => {
        if (newTag.trim() && !project.tags.includes(newTag.trim())) {
            setProject({ ...project, tags: [...project.tags, newTag.trim()] });
            setNewTag('');
        }
    };

    const removeTag = (index: number) => {
        const newTags = [...project.tags];
        newTags.splice(index, 1);
        setProject({ ...project, tags: newTags });
    };

    return (
        <AdminLayout>
            <style dangerouslySetInnerHTML={{ __html: quillStyles }} />
            <form onSubmit={handleSave} className="max-w-[1600px] mx-auto pb-20">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0">
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-outfit uppercase tracking-tight">
                                {project.id ? 'Edit' : 'Create'} Project
                            </h1>
                            <p className="text-xs text-gray-400 font-medium">Document and showcase your craftsmanship</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className={`h-11 rounded-1xl px-4 font-bold text-[10px] uppercase tracking-widest ${project.isVisible ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}
                            onClick={() => setProject({ ...project, isVisible: !project.isVisible })}
                        >
                            {project.isVisible ? <CheckCircle size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
                            {project.isVisible ? 'Visible' : 'Hidden'}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-[#7FFF00] hover:bg-[#6ee600] text-white font-black h-11 px-6 rounded-1xl shadow-lg shadow-[#7FFF00]/20 active:scale-95 transition-all text-[10px] uppercase tracking-widest"
                        >
                            {isSaving ? 'Saving...' : <><Save size={16} className="mr-2" /> Save Project</>}
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
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block pl-1">Project Title</label>
                                <input
                                    className="w-full text-3xl md:text-4xl font-black text-gray-900 border-none outline-none focus:ring-0 placeholder:text-gray-200 font-outfit leading-tight"
                                    placeholder="Enter Project Title..."
                                    value={project.title}
                                    onChange={e => setProject({ ...project, title: e.target.value, slug: !project.id ? slugify(e.target.value) : project.slug })}
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-2">Permalink:</span>
                                <span className="text-gray-400 text-sm">/projects/</span>
                                <input
                                    className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 w-full focus:ring-0"
                                    value={project.slug}
                                    onChange={e => setProject({ ...project, slug: e.target.value })}
                                />
                            </div>

                            {/* Rich Editor */}
                            <div className="min-h-[500px] border-t border-gray-100 pt-4">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block pl-1">Project Detail Content</label>
                                <ReactQuill
                                    theme="snow"
                                    value={project.content || ''}
                                    onChange={val => {
                                        if (val !== project.content) {
                                            setProject((prev: any) => ({ ...prev, content: val }));
                                        }
                                    }}
                                    modules={modules}
                                    className="h-[400px] mb-12"
                                />
                            </div>
                        </div>

                        {/* Before & After Section */}
                        <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <Activity size={14} className="text-[#7FFF00]" /> Transformation (Before & After)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Before Image</label>
                                    <ImageUploader
                                        currentImage={project.beforeImage}
                                        onImageUploaded={(url, _, meta) => setProject({ ...project, beforeImage: url, beforeImageAlt: meta?.altText || project.beforeImageAlt })}
                                        initialMetadata={{ altText: project.beforeImageAlt }}
                                        folder="projects"
                                        saveToMedia={true}
                                        aspectRatio="video"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">After Image</label>
                                    <ImageUploader
                                        currentImage={project.afterImage}
                                        onImageUploaded={(url, _, meta) => setProject({ ...project, afterImage: url, afterImageAlt: meta?.altText || project.afterImageAlt })}
                                        initialMetadata={{ altText: project.afterImageAlt }}
                                        folder="projects"
                                        saveToMedia={true}
                                        aspectRatio="video"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Testimonials */}
                        <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <User size={14} className="text-[#7FFF00]" /> Client Testimonial
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Testimonial Text</label>
                                    <textarea
                                        className="w-full border border-gray-200 rounded-xl p-3 text-sm h-24 resize-none"
                                        value={project.testimonialText || ''}
                                        onChange={e => setProject({ ...project, testimonialText: e.target.value })}
                                        placeholder="Enter client testimonial..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Client Name</label>
                                    <input
                                        className="w-full border border-gray-200 rounded-xl p-3 text-sm"
                                        value={project.testimonialClient || ''}
                                        onChange={e => setProject({ ...project, testimonialClient: e.target.value })}
                                        placeholder="e.g. John Doe, Homeowner"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* FAQs */}
                        <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                    <Search size={14} className="text-[#7FFF00]" /> Project FAQs
                                </h3>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setProject({ ...project, faqs: [...(project.faqs || []), { question: '', answer: '' }] })}
                                >
                                    <Plus size={14} className="mr-1" /> Add FAQ
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {(project.faqs || []).map((faq: any, idx: number) => (
                                    <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative group">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newFaqs = [...(project.faqs || [])];
                                                newFaqs.splice(idx, 1);
                                                setProject({ ...project, faqs: newFaqs });
                                            }}
                                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <div className="space-y-3">
                                            <input
                                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm font-bold"
                                                placeholder="Question"
                                                value={faq.question}
                                                onChange={e => {
                                                    const newFaqs = [...(project.faqs || [])];
                                                    newFaqs[idx].question = e.target.value;
                                                    setProject({ ...project, faqs: newFaqs });
                                                }}
                                            />
                                            <textarea
                                                className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm h-20 resize-none"
                                                placeholder="Answer"
                                                value={faq.answer}
                                                onChange={e => {
                                                    const newFaqs = [...(project.faqs || [])];
                                                    newFaqs[idx].answer = e.target.value;
                                                    setProject({ ...project, faqs: newFaqs });
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(!project.faqs || project.faqs.length === 0) && (
                                    <p className="text-center text-gray-400 text-sm py-4">No FAQs added yet.</p>
                                )}
                            </div>
                        </div>


                        {/* Tags Editor */}
                        <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <Tag size={14} className="text-[#7FFF00]" /> Project Tags
                            </h3>
                            <p className="text-xs text-gray-400 mb-4">Tags displayed as pills on the project detail page (e.g., "Custom Design", "Premium Materials")</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {(project.tags || []).map((tag: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-1 px-3 py-1.5 bg-[#7FFF00]/20 text-orange-700 rounded-full text-sm font-medium">
                                        <span>{tag}</span>
                                        <button type="button" onClick={() => removeTag(idx)} className="ml-1 hover:text-red-600">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 border border-gray-200 rounded-lg p-2.5 text-sm"
                                    placeholder="Add a tag..."
                                    value={newTag}
                                    onChange={e => setNewTag(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                />
                                <Button type="button" onClick={addTag} className="bg-[#7FFF00] hover:bg-[#6ee600] text-white px-4">
                                    <Plus size={16} />
                                </Button>
                            </div>
                        </div>

                        {/* Gallery Section */}
                        <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-6">
                                <LayoutGrid size={14} className="text-[#7FFF00]" /> Project Gallery
                            </h3>

                            <div className="mb-8">
                                <ImageUploader
                                    onImageUploaded={(url) => setProject({ ...project, images: [...(project.images || []), url] })}
                                    folder="projects"
                                    saveToMedia={true}
                                    aspectRatio="video"
                                    className="w-full"
                                    showRemoveButton={false}
                                />
                                <p className="text-[10px] text-gray-400 mt-2 text-center uppercase tracking-widest">Upload photos to add them to this project's gallery</p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {(project.images || []).map((img: string, idx: number) => (
                                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100 bg-gray-50">
                                        <Image src={img} alt="Project" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setProject({ ...project, heroImage: img })}
                                                className="p-2 bg-[#7FFF00] text-white rounded-xl shadow-lg transform scale-75 group-hover:scale-100 transition-transform text-[10px] font-bold"
                                                title="Set as Hero"
                                            >
                                                Hero
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="p-2 bg-red-500 text-white rounded-xl shadow-lg transform scale-75 group-hover:scale-100 transition-transform"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                    </div>

                    {/* RIGHT COLUMN: SIDEBAR (4/12) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Hero Image */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <ImageIcon size={14} className="text-[#7FFF00]" /> Hero Image
                            </h3>
                            <ImageUploader
                                currentImage={project.heroImage}
                                onImageUploaded={(url, _, meta) => setProject({ ...project, heroImage: url, heroImageAlt: meta?.altText || project.heroImageAlt })}
                                initialMetadata={{ altText: project.heroImageAlt }}
                                folder="projects"
                                saveToMedia={true}
                                aspectRatio="video"
                            />
                            <p className="text-[10px] text-gray-400">Main image shown in the hero section (or click "Hero" on any gallery image)</p>
                        </div>

                        {/* Thumbnail/Card Image */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <LayoutGrid size={14} className="text-[#7FFF00]" /> Card Thumbnail Image
                            </h3>
                            <ImageUploader
                                currentImage={project.thumbnailImage}
                                onImageUploaded={(url, _, meta) => setProject({ ...project, thumbnailImage: url, thumbnailImageAlt: meta?.altText || project.thumbnailImageAlt })}
                                initialMetadata={{ altText: project.thumbnailImageAlt }}
                                folder="projects"
                                saveToMedia={true}
                                aspectRatio="square"
                            />
                            <p className="text-[10px] text-gray-400">Image used specifically for project cards in the portfolio grid.</p>
                        </div>

                        {/* Project Details Box */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <Globe size={14} className="text-[#7FFF00]" /> Project Details
                            </h3>

                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Category</label>
                                <select
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium"
                                    value={project.category || ''}
                                    onChange={e => setProject({ ...project, category: e.target.value })}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Kitchen">Kitchen</option>
                                    <option value="Bathroom">Bathroom</option>
                                    <option value="Wardrobe">Wardrobe</option>
                                    <option value="TV Cabinet">TV Cabinet</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Laundry">Laundry</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Location</label>
                                <div className="relative">
                                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        className="w-full border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm font-medium"
                                        placeholder="e.g. Toorak, VIC"
                                        value={project.location || ''}
                                        onChange={e => setProject({ ...project, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Client Name</label>
                                <div className="relative">
                                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        className="w-full border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm font-medium"
                                        placeholder="e.g. Private Residence"
                                        value={project.client || ''}
                                        onChange={e => setProject({ ...project, client: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Homepage/Thumbnail Info */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <Type size={14} className="text-[#7FFF00]" /> Thumbnail Summary
                            </h3>
                            <textarea
                                className="w-full bg-gray-50 border-0 rounded-xl p-3 text-xs text-gray-600 h-32 resize-none outline-none focus:ring-1 focus:ring-[#7FFF00]/20"
                                placeholder="Short summary for project cards..."
                                value={project.description}
                                onChange={e => setProject({ ...project, description: e.target.value })}
                            />
                        </div>

                        {/* Project Stats */}
                        <div className="bg-gray-900 p-6 rounded-[24px] shadow-sm border border-gray-800 space-y-4 text-white">
                            <h3 className="text-xs font-black text-[#7FFF00] uppercase tracking-widest flex items-center gap-2 mb-4">
                                <Activity size={14} /> Project Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-2xl font-bold">{project.images?.length || 0}</span>
                                    <span className="text-[10px] text-gray-400 uppercase">Gallery Photos</span>
                                </div>
                                <div>
                                    <span className="block text-2xl font-bold">{project.tags?.length || 0}</span>
                                    <span className="text-[10px] text-gray-400 uppercase">Tags</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* PHASE 2: SEO META BOX - FULL WIDTH */}
                <div className="mt-8">
                    <SeoMetaBox
                        data={project}
                        onChange={(newData: any) => setProject(newData)}
                        content={project.content || project.description}
                    />
                </div>
            </form>
        </AdminLayout>
    );
}

export const getServerSideProps = async (context: any) => {
    const { id } = context.params;
    if (id === 'new') return { props: { project: null } };

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    try {
        const data = await prisma.project.findUnique({ where: { id } });
        await prisma.$disconnect();
        return { props: { project: JSON.parse(JSON.stringify(data)) } };
    } catch (e) {
        await prisma.$disconnect();
        return { props: { project: null } };
    }
};

