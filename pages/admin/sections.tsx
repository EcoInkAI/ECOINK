import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit3, Trash2, ExternalLink, Layout, X, Save, Upload, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ImageUploader from '@/components/admin/ImageUploader';

interface SectionsProps {
    initialSections: any[];
}

export default function SectionsAdmin({ initialSections }: SectionsProps) {
    const [sections, setSections] = useState(initialSections);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [current, setCurrent] = useState<any>({
        internalName: '',
        type: 'HERO',
        content: {
            heading: '',
            subheading: '',
            image: '',
            ctaText: '',
            ctaLink: ''
        }
    });

    const handleOpenModal = (section?: any) => {
        if (section) {
            setCurrent({
                ...section,
                content: section.content || { heading: '', subheading: '', image: '', ctaText: '', ctaLink: '' }
            });
        } else {
            setCurrent({
                internalName: '',
                type: 'HERO',
                content: { heading: '', subheading: '', image: '', ctaText: '', ctaLink: '' }
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const method = current.id ? 'PUT' : 'POST';
        const url = current.id ? `/api/sections/${current.id}` : '/api/sections';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(current),
            });

            if (res.ok) {
                const updated = await res.json();
                if (current.id) {
                    setSections(sections.map(s => s.id === updated.id ? updated : s));
                } else {
                    setSections([updated, ...sections]);
                }
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to save section:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this section?')) return;
        const res = await fetch(`/api/sections/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setSections(sections.filter(s => s.id !== id));
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-outfit uppercase tracking-tight">Sections Management</h1>
                    <p className="text-gray-500 text-sm md:text-base">Manage reusable content sections and blocks</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/" target="_blank" className="hidden sm:block">
                        <Button variant="outline" className="flex items-center gap-2 border-gray-200">
                            <ExternalLink size={16} /> View Website
                        </Button>
                    </Link>
                    <Button
                        onClick={() => handleOpenModal()}
                        className="bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-[#7FFF00]/20 active:scale-95 transition-all w-full sm:w-auto"
                    >
                        <Plus size={18} className="mr-2" /> <span className="sm:hidden">Add Section</span><span className="hidden sm:inline">Add New Section</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {sections.map((section) => (
                    <div key={section.id} className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#6ee600] bg-[#7FFF00]/10 px-2.5 py-1 rounded-lg">
                                {section.type || 'SECTION'}
                            </span>
                            <div className="flex gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleOpenModal(section)}
                                    className="p-2 text-gray-400 hover:text-[#6ee600] hover:bg-[#7FFF00]/10 rounded-xl transition-colors"
                                >
                                    <Edit3 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(section.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="aspect-video bg-gray-100 flex items-center justify-center relative overflow-hidden group-hover:bg-gray-200 transition-colors">
                            {section.content?.image ? (
                                <Image src={section.content.image} alt={section.internalName} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Layout className="text-gray-300" size={48} />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No Preview Image</span>
                                </div>
                            )}
                        </div>

                        <div className="p-5 md:p-6">
                            <h3 className="font-extrabold text-gray-900 mb-1 font-outfit uppercase tracking-tight">{section.internalName}</h3>
                            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                                {section.content?.heading || 'No heading defined for this section.'}
                            </p>
                        </div>
                    </div>
                ))}

                {sections.length === 0 && (
                    <div className="col-span-full py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mb-4">
                            <Layout size={40} className="opacity-20" />
                        </div>
                        <h3 className="text-gray-900 font-bold mb-1">No sections found</h3>
                        <p className="text-sm">Create your first reusable block to start building pages.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                        <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-gray-900 font-outfit uppercase tracking-tight">
                                    {current.id ? 'Edit Section' : 'Add New Section'}
                                </h2>
                                <p className="text-xs md:text-sm text-gray-500">Define your reusable content block</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Internal Name (Admin Only)</label>
                                    <input
                                        className="w-full border-2 border-gray-50 bg-gray-50/50 p-4 rounded-2xl outline-none focus:border-[#7FFF00] focus:bg-white transition-all font-bold text-gray-800"
                                        placeholder="e.g. Services Grid"
                                        value={current.internalName}
                                        onChange={e => setCurrent({ ...current, internalName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Section Type</label>
                                    <select
                                        className="w-full border-2 border-gray-50 bg-gray-50/50 p-4 rounded-2xl outline-none focus:border-[#7FFF00] focus:bg-white transition-all font-bold text-gray-800 appearance-none cursor-pointer"
                                        value={current.type}
                                        onChange={e => setCurrent({ ...current, type: e.target.value })}
                                    >
                                        <option value="HERO">Hero Banner</option>
                                        <option value="FEATURES">Features List</option>
                                        <option value="TEXT">Text Content</option>
                                        <option value="CTA">Call to Action</option>
                                        <option value="GRID">Image Grid</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 space-y-6 pt-4 border-t border-gray-50">
                                    <h3 className="text-xs font-black text-[#7FFF00] uppercase tracking-widest flex items-center gap-2">
                                        <Info size={14} /> Content Configuration
                                    </h3>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1">Heading</label>
                                            <input
                                                className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#7FFF00] transition-all font-bold text-sm bg-gray-50/50"
                                                value={current.content.heading}
                                                onChange={e => setCurrent({ ...current, content: { ...current.content, heading: e.target.value } })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1">Subheading / Description</label>
                                            <textarea
                                                className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#7FFF00] transition-all text-sm h-28 resize-none leading-relaxed bg-gray-50/50"
                                                value={current.content.subheading}
                                                onChange={e => setCurrent({ ...current, content: { ...current.content, subheading: e.target.value } })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="col-span-1">
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1">Section Image</label>
                                                <ImageUploader
                                                    currentImage={current.content.image}
                                                    onImageUploaded={(url) => setCurrent({ ...current, content: { ...current.content, image: url } })}
                                                    folder="sections"
                                                    saveToMedia={true}
                                                    aspectRatio="video"
                                                    onRemove={() => setCurrent({ ...current, content: { ...current.content, image: '' } })}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1">CTA text</label>
                                                <input
                                                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#7FFF00] transition-all text-sm bg-gray-50/50"
                                                    value={current.content.ctaText}
                                                    onChange={e => setCurrent({ ...current, content: { ...current.content, ctaText: e.target.value } })}
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1">CTA Link (URL or Slug)</label>
                                                <input
                                                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:border-[#7FFF00] transition-all text-sm bg-gray-50/50"
                                                    placeholder="/contact or https://..."
                                                    value={current.content.ctaLink}
                                                    onChange={e => setCurrent({ ...current, content: { ...current.content, ctaLink: e.target.value } })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
                            <Button type="button" variant="ghost" className="rounded-2xl px-8 w-full sm:w-auto" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold h-12 px-10 rounded-2xl shadow-lg shadow-[#7FFF00]/20 transition-all active:scale-95 w-full sm:w-auto"
                            >
                                {isSaving ? 'Processing...' : <><Save size={18} className="mr-2" /> Save Section</>}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export const getServerSideProps = async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    try {
        const data = await prisma.contentSection.findMany({ orderBy: { updatedAt: 'desc' } });
        await prisma.$disconnect();
        return { props: { initialSections: JSON.parse(JSON.stringify(data)) } };
    } catch (e) {
        await prisma.$disconnect();
        return { props: { initialSections: [] } };
    }
};

