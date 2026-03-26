import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, Globe, Eye, Settings, Search, FileText, Trash2, Grid, Layout, ArrowRight, Plus, X, Info, CheckCircle, Maximize, Minimize, ExternalLink, Brush, Box, Clipboard, Image as ImageIcon, MessageSquare, HelpCircle, Layers } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PageRenderer from '@/components/PageRenderer';
import ImageUploader from '@/components/admin/ImageUploader';
import SeoMetaBox from '@/components/admin/SeoMetaBox';

interface PageFormProps {
    page: any;
    availableSections: any[];
}

const PAGE_TEMPLATES = [
    {
        id: 'standard',
        name: 'Standard Page',
        description: 'Perfect for basic pages like About Us or general info.',
        icon: FileText,
        sections: [
            { type: 'HERO', internalName: 'Standard Hero', content: { heading: 'Our Story', subheading: 'Welcome to Magri Cabinets', image: '/kitchen2.jpg' } },
            { type: 'TEXT', internalName: 'Content Section', content: { html: '<p>Enter your content here...</p>' } }
        ]
    },
    {
        id: 'service',
        name: 'Service Detail',
        description: 'The standard 6-section layout used for cabinet services.',
        icon: Box,
        sections: [
            { type: 'HERO', internalName: 'Service Hero', content: { heading: 'Custom Kitchen Cabinets', subheading: 'Premium quality Melbourne made.', image: '/kitchen1.jpg', ctaText: 'Get Quote', ctaLink: '#form' } },
            {
                type: 'CONTENT-SPLIT',
                internalName: 'Main Content + Form',
                content: {
                    heading: 'Bespoke Kitchen Solutions',
                    html: '<p>We design and manufacture high-quality custom cabinets...</p>',
                    sidebarType: 'form',
                    serviceName: 'Kitchens'
                }
            },
            { type: 'GALLERY', internalName: 'Service Gallery', content: { images: ['/kitchen1.jpg', '/kitchen2.jpg', '/library.jpg'] } },
            { type: 'FAQ', internalName: 'Service FAQ', content: { items: [{ question: 'How long does it take?', answer: 'Usually 4-6 weeks.' }] } },
            { type: 'TESTIMONIALS', internalName: 'Service Testimonials', content: { items: [] } }
        ]
    },
    {
        id: 'project',
        name: 'Project Showcase',
        description: 'Case study layout with before/after and project details.',
        icon: Brush,
        sections: [
            { type: 'HERO', internalName: 'Project Hero', content: { heading: 'Ballan Kitchen Reno', subheading: 'A timeless transformation.', image: '/kitchen1.jpg' } },
            {
                type: 'CONTENT-SPLIT',
                internalName: 'Project Details',
                content: {
                    heading: 'The Transformation',
                    html: '<p>This project involved full custom cabinetry design...</p>',
                    sidebarType: 'details',
                    sidebarTitle: 'Project Details',
                    details: [
                        { icon: 'tag', label: 'Category', value: 'Kitchen' },
                        { icon: 'calendar', label: 'Date', value: 'Nov 2024' },
                        { icon: 'map-pin', label: 'Location', value: 'Ballan' }
                    ]
                }
            },
            { type: 'BEFORE-AFTER', internalName: 'Before/After Slider', content: { before: '/kitchen2.jpg', after: '/kitchen1.jpg', title: 'The Result' } },
            { type: 'GALLERY', internalName: 'Project Gallery', content: { images: ['/kitchen1.jpg', '/kitchen2.jpg'] } }
        ]
    }
];

export default function EditPage({ page: initialPage, availableSections: initialAvailableSections }: PageFormProps) {
    const router = useRouter();
    const isNew = router.query.id === 'new';

    const [page, setPage] = useState(initialPage || {
        title: '',
        slug: '',
        isPublished: false,
        showInNavbar: false,
        navbarLabel: '',
        navbarOrder: 0,
        sections: [],
        seoTitle: initialPage?.seoTitle || '',
        seoDescription: initialPage?.seoDescription || '',
        focusKeyphrase: initialPage?.focusKeyphrase || '',
        metaRobots: initialPage?.metaRobots || 'index,follow',
        ogTitle: initialPage?.ogTitle || '',
        ogDescription: initialPage?.ogDescription || '',
        ogImage: initialPage?.ogImage || '',
        ogType: initialPage?.ogType || 'website',
        twitterCard: initialPage?.twitterCard || 'summary_large_image',
        schemaType: initialPage?.schemaType || 'WebPage',
        schemaJson: initialPage?.schemaJson || null,
        breadcrumbTitle: initialPage?.breadcrumbTitle || '',
        canonicalUrl: initialPage?.canonicalUrl || '',
        seoScore: initialPage?.seoScore || 0,
        readabilityScore: initialPage?.readabilityScore || 0
    });

    const [step, setStep] = useState(initialPage ? 'editor' : 'template-select');
    const [isSaving, setIsSaving] = useState(false);
    const [pageSections, setPageSections] = useState<any[]>(initialPage?.sections || []);
    const [availableSections, setAvailableSections] = useState<any[]>(initialAvailableSections || []);

    // Selection/Modal States
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
    const [currentSection, setCurrentSection] = useState<any>({
        internalName: '',
        type: 'HERO',
        content: {}
    });

    const [showPreview, setShowPreview] = useState(true);
    const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

    const handleSelectTemplate = async (templateId: string) => {
        const template = PAGE_TEMPLATES.find(t => t.id === templateId);
        if (!template) return;

        setStep('editor');
        setPage({ ...page, title: template.name });

        const newSections = template.sections.map((s, idx) => ({
            section: { ...s, id: `temp-${idx}` },
            isNew: true
        }));
        setPageSections(newSections);
    };

    const handleSave = async (publish?: boolean) => {
        setIsSaving(true);

        const newStatus = publish !== undefined ? publish : page.isPublished;

        try {
            const preparedSections = await Promise.all(pageSections.map(async (ps, idx) => {
                if (ps.isNew) {
                    const res = await fetch('/api/sections', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            internalName: ps.section.internalName,
                            type: ps.section.type,
                            content: ps.section.content
                        }),
                    });
                    const created = await res.json();
                    return { sectionId: created.id, order: idx };
                }
                return { sectionId: ps.sectionId || ps.section?.id, order: idx };
            }));

            const method = page.id ? 'PUT' : 'POST';
            const url = page.id ? `/api/pages/${page.id}` : '/api/pages';

            const payload = {
                ...page,
                isPublished: newStatus,
                sections: preparedSections
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) router.push('/admin/pages');
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const removeSection = (index: number) => {
        const newSections = [...pageSections];
        newSections.splice(index, 1);
        setPageSections(newSections);
    };

    const editSection = (index: number) => {
        setEditingSectionIndex(index);
        setCurrentSection(JSON.parse(JSON.stringify(pageSections[index].section)));
        setIsSectionModalOpen(true);
    };

    const handleSaveSectionEdits = () => {
        if (editingSectionIndex === null) return;
        const newSections = [...pageSections];
        newSections[editingSectionIndex].section = currentSection;
        setPageSections(newSections);
        setIsSectionModalOpen(false);
    };

    const addExistingSection = (section: any) => {
        setPageSections([...pageSections, { section, sectionId: section.id }]);
    };

    // Prepare content for Live Preview
    const previewContent = pageSections.map(ps => ({
        type: ps.section?.type || 'text',
        data: ps.section?.content || {}
    }));

    if (step === 'template-select') {
        return (
            <AdminLayout>
                <div className="max-w-6xl mx-auto py-12 px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-extrabold text-gray-900 font-outfit uppercase tracking-tight mb-4">Choose a Page Template</h1>
                        <p className="text-gray-500 text-lg">Select a starting structure for your new page. You can customize everything later.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PAGE_TEMPLATES.map((template) => (
                            <div
                                key={template.id}
                                onClick={() => handleSelectTemplate(template.id)}
                                className="group bg-white rounded-[40px] p-8 border-2 border-transparent hover:border-[#7FFF00] shadow-xl hover:shadow-[#7FFF00]/10 transition-all cursor-pointer flex flex-col items-center text-center relative overflow-hidden h-full"
                            >
                                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-400 group-hover:bg-[#7FFF00]/10 group-hover:text-[#7FFF00] transition-colors mb-8">
                                    <template.icon size={40} />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-4 font-outfit">{template.name}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-8">{template.description}</p>

                                <div className="mt-auto pt-4 border-t border-gray-50 w-full flex items-center justify-center gap-2 text-[#7FFF00] font-bold text-xs uppercase tracking-widest bg-white group-hover:translate-y-[-4px] transition-transform">
                                    Start with this <ArrowRight size={14} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <button
                            onClick={() => setStep('editor')}
                            className="text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-gray-900 transition-colors"
                        >
                            Or start with a blank page
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-[1920px] mx-auto space-y-8 pb-20">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sticky top-0 bg-gray-50/95 backdrop-blur z-20 py-4 border-b border-gray-200 -mx-6 px-6">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => isNew ? setStep('template-select') : router.push('/admin/pages')}
                            className="p-2 md:p-2.5 hover:bg-gray-100 rounded-xl transition-all border border-transparent hover:border-gray-200"
                        >
                            <ArrowLeft size={18} className="text-gray-500" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-outfit uppercase tracking-tight">
                                    {page.id ? 'Edit Page' : 'New Page'}
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${page.isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {page.isPublished ? 'Published' : 'Draft'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowPreview(!showPreview)}
                            className="hidden lg:flex items-center gap-2 h-12 rounded-xl border-gray-300"
                        >
                            {showPreview ? <Eye size={18} className="text-[#7FFF00]" /> : <Eye size={18} className="text-gray-400" />}
                            {showPreview ? 'Hide Preview' : 'Show Preview'}
                        </Button>

                        <div className="h-8 w-px bg-gray-300 mx-2 hidden sm:block" />

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                const url = page.isPublished
                                    ? `/${page.slug}`
                                    : `/api/preview?slug=${page.slug}`;
                                window.open(url, '_blank');
                            }}
                            disabled={!page.slug}
                            className="hidden sm:flex items-center gap-2 h-12 rounded-xl border-gray-300"
                        >
                            <ExternalLink size={18} className="text-gray-400" />
                            {page.isPublished ? 'View Live' : 'Browser Preview'}
                        </Button>

                        <div className="h-8 w-px bg-gray-300 mx-2 hidden sm:block" />


                        {page.isPublished ? (
                            <Button
                                onClick={() => handleSave(false)}
                                disabled={isSaving}
                                variant="outline"
                                className="border-gray-300 text-gray-700 font-bold h-12 px-6 rounded-xl hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
                            >
                                Unpublish (Draft)
                            </Button>
                        ) : (
                            <Button
                                onClick={() => handleSave(false)}
                                disabled={isSaving}
                                variant="outline"
                                className="border-gray-300 text-gray-700 font-bold h-12 px-6 rounded-xl hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
                            >
                                Keep as Draft
                            </Button>
                        )}

                        <Button
                            onClick={() => handleSave(true)}
                            disabled={isSaving}
                            className="bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-[#7FFF00]/20 transition-all active:scale-95 uppercase tracking-widest text-xs"
                        >
                            <Globe size={18} className="mr-2" /> {page.isPublished ? 'Update & Live' : 'Publish Page'}
                        </Button>
                    </div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT: Editor Area */}
                    <div className={`space-y-6 ${showPreview ? 'lg:col-span-5 xl:col-span-4' : 'lg:col-span-8 lg:col-start-3'}`}>

                        {/* Page Settings */}
                        <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b pb-4 font-outfit flex items-center gap-2">
                                <Settings size={16} className="text-[#7FFF00]" /> Settings
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1">Page Title</label>
                                    <input
                                        className="w-full border-2 border-gray-50 bg-gray-50/50 p-3 rounded-xl outline-none focus:border-[#7FFF00] focus:bg-white transition-all font-bold text-gray-800 text-sm"
                                        value={page.title}
                                        onChange={e => setPage({ ...page, title: e.target.value })}
                                        placeholder="e.g. Our Services"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1">Status</label>
                                    <select
                                        className="w-full border-2 border-gray-50 bg-gray-50/50 p-3 rounded-xl outline-none focus:border-[#7FFF00] focus:bg-white transition-all font-bold text-gray-800 text-sm"
                                        value={page.isPublished ? 'true' : 'false'}
                                        onChange={e => setPage({ ...page, isPublished: e.target.value === 'true' })}
                                    >
                                        <option value="false">Draft</option>
                                        <option value="true">Published (Active)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1">URL Slug</label>
                                    <div className="flex items-center gap-2 bg-gray-50/50 border-2 border-gray-50 p-3 rounded-xl focus-within:bg-white focus-within:border-[#7FFF00] transition-all">
                                        <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">/</span>
                                        <input
                                            className="flex-1 bg-transparent border-none outline-none font-bold text-gray-800 placeholder:text-gray-300 text-sm"
                                            value={page.slug}
                                            onChange={(e) => setPage({ ...page, slug: e.target.value })}
                                            placeholder="our-services"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Settings */}
                        <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b pb-4 font-outfit flex items-center gap-2">
                                <Globe size={16} className="text-[#7FFF00]" /> Navigation
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:bg-white hover:border-orange-200 shadow-sm hover:shadow-[#7FFF00]/5">
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">Show in Navbar</p>
                                        <p className="text-[10px] text-gray-500">Will appear in main navigation</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={page.showInNavbar}
                                        onChange={e => setPage({ ...page, showInNavbar: e.target.checked })}
                                        className="w-5 h-5 accent-[#7FFF00] cursor-pointer"
                                    />
                                </div>
                                {page.showInNavbar && (
                                    <>
                                        <div className="animate-in slide-in-from-top-2 duration-300">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1">Navbar Label</label>
                                            <input
                                                className="w-full border-2 border-gray-50 bg-gray-50/50 p-3 rounded-xl outline-none focus:border-[#7FFF00] focus:bg-white transition-all font-bold text-gray-800 text-sm"
                                                value={page.navbarLabel || ''}
                                                onChange={e => setPage({ ...page, navbarLabel: e.target.value })}
                                                placeholder={page.title || "Label"}
                                            />
                                        </div>
                                        <div className="animate-in slide-in-from-top-2 duration-300 delay-75">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1">Display Order</label>
                                            <input
                                                type="number"
                                                className="w-full border-2 border-gray-50 bg-gray-50/50 p-3 rounded-xl outline-none focus:border-[#7FFF00] focus:bg-white transition-all font-bold text-gray-800 text-sm"
                                                value={page.navbarOrder || 0}
                                                onChange={e => setPage({ ...page, navbarOrder: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>


                        {/* Page Structure (THE EDITOR) */}
                        <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 min-h-[500px] flex flex-col">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
                                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest font-outfit flex items-center gap-2">
                                    <Layers size={16} className="text-[#7FFF00]" /> Page Content (Sections)
                                </h2>
                            </div>

                            <div className="flex-1 space-y-3">
                                {pageSections.map((ps, index) => (
                                    <div key={index} className="group relative bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-center justify-between hover:border-orange-200 hover:bg-white hover:shadow-lg hover:shadow-[#7FFF00]/5 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#7FFF00] shrink-0 border border-gray-100">
                                                {ps.section?.type === 'HERO' ? <Layout size={20} /> :
                                                    ps.section?.type === 'GALLERY' ? <ImageIcon size={20} /> :
                                                        ps.section?.type === 'FAQ' ? <HelpCircle size={20} /> :
                                                            ps.section?.type === 'TESTIMONIALS' ? <MessageSquare size={20} /> :
                                                                ps.section?.type === 'CONTENT-SPLIT' ? <Grid size={20} /> :
                                                                    <FileText size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-xs">{ps.section?.internalName}</p>
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{ps.section?.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => editSection(index)}
                                                className="px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-gray-500 hover:text-[#7FFF00] hover:border-[#7FFF00] transition-all shadow-sm flex items-center gap-1.5"
                                            >
                                                Edit Content <ArrowRight size={12} />
                                            </button>
                                            <button
                                                onClick={() => removeSection(index)}
                                                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Add more from library:</p>
                                <div className="flex flex-wrap gap-2">
                                    {(availableSections || []).slice(0, 5).map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => addExistingSection(section)}
                                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:border-[#7FFF00] hover:text-[#7FFF00] transition-all"
                                        >
                                            + {section.internalName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Live Preview Area (Only if visible) */}
                    {showPreview && (
                        <div className={`
                            ${isPreviewExpanded ? 'fixed inset-0 z-[100] bg-white' : 'lg:col-span-7 xl:col-span-8 sticky top-[100px] h-[calc(100vh-140px)]'}
                            transition-all duration-300
                        `}>
                            <div className="bg-gray-100 rounded-[32px] h-full flex flex-col overflow-hidden shadow-inner border border-gray-200">
                                <div className="flex items-center justify-between p-4 bg-gray-100/90 backdrop-blur border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Live Client Preview</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                                            className="px-3 py-1.5 bg-white hover:bg-[#7FFF00]/10 hover:text-[#7FFF00] rounded-xl shadow-sm text-[10px] font-bold text-gray-500 border border-gray-200 transition-all flex items-center gap-2"
                                        >
                                            {isPreviewExpanded ? <Minimize size={14} /> : <Maximize size={14} />}
                                            {isPreviewExpanded ? 'Exit Fullscreen' : 'Full Preview'}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-hidden p-4 md:p-6 lg:p-8">
                                    <div className={`
                                        bg-white shadow-2xl border border-gray-200 overflow-hidden h-full relative flex flex-col
                                        ${isPreviewExpanded ? 'rounded-none' : 'rounded-2xl'}
                                    `}>
                                        <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2 shrink-0">
                                            <div className="flex gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                                            </div>
                                            <div className="flex-1 flex justify-center">
                                                <div className="bg-white border border-gray-200 rounded-full h-5 w-1/2 flex items-center justify-center">
                                                    <span className="text-[8px] text-gray-400 font-medium tracking-tight">ecoisolation.com.au/{page.slug || '...'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto">
                                            <PageRenderer content={previewContent} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* SEO Tools - Full Width (Always at bottom) */}
                <div className="bg-white rounded-[32px] overflow-hidden shadow-md border border-gray-100 mt-8">
                    <SeoMetaBox
                        data={page}
                        onChange={(newData) => setPage({ ...page, ...newData })}
                        content={pageSections.map(ps => JSON.stringify(ps.section?.content || {})).join(' ')}
                    />
                </div>

                {/* Section Editor Modal */}
                {isSectionModalOpen && (
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 font-outfit uppercase tracking-tight">Edit Section Content</h2>
                                    <p className="text-xs text-[#7FFF00] font-black uppercase tracking-widest">{currentSection.type} Template</p>
                                </div>
                                <button onClick={() => setIsSectionModalOpen(false)} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm">
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                {/* Basic Fields */}
                                {currentSection.content.heading !== undefined && (
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Section Heading</label>
                                        <input
                                            className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-[#7FFF00] font-bold text-gray-800 transition-all"
                                            value={currentSection.content.heading}
                                            onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, heading: e.target.value } })}
                                        />
                                    </div>
                                )}

                                {currentSection.type === 'HERO' && (
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Subheading / Description</label>
                                        <textarea
                                            className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-[#7FFF00] font-medium text-gray-600 h-24 resize-none transition-all"
                                            value={currentSection.content.subheading || ''}
                                            onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, subheading: e.target.value } })}
                                        />
                                    </div>
                                )}

                                {currentSection.content.html !== undefined && (
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Body Content (HTML)</label>
                                        <textarea
                                            className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-[#7FFF00] font-mono text-xs h-40 transition-all"
                                            value={currentSection.content.html}
                                            onChange={e => setCurrentSection({ ...currentSection, content: { ...currentSection.content, html: e.target.value } })}
                                        />
                                    </div>
                                )}

                                {currentSection.content.image !== undefined && (
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Image</label>
                                        <ImageUploader
                                            currentImage={currentSection.content.image}
                                            onImageUploaded={(url) => setCurrentSection({ ...currentSection, content: { ...currentSection.content, image: url } })}
                                            folder="pages"
                                        />
                                    </div>
                                )}

                                {/* Complex Fields */}
                                {currentSection.content.images !== undefined && (
                                    <div className="space-y-4">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-1">Gallery Images</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            {(currentSection.content.images || []).map((img: string, i: number) => (
                                                <div key={i} className="relative group aspect-video bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                                                    <Image src={img} alt="Gallery" fill className="object-cover" />
                                                    <button onClick={() => {
                                                        const newImgs = [...currentSection.content.images];
                                                        newImgs.splice(i, 1);
                                                        setCurrentSection({ ...currentSection, content: { ...currentSection.content, images: newImgs } });
                                                    }} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded"><Trash2 size={12} /></button>
                                                </div>
                                            ))}
                                            <ImageUploader onImageUploaded={url => setCurrentSection({ ...currentSection, content: { ...currentSection.content, images: [...currentSection.content.images, url] } })} folder="pages" />
                                        </div>
                                    </div>
                                )}

                                {currentSection.content.items !== undefined && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">FAQ / Testimonial Items</label>
                                            <Button size="sm" variant="ghost" className="text-[#7FFF00] text-[10px]" onClick={() => setCurrentSection({ ...currentSection, content: { ...currentSection.content, items: [...(currentSection.content.items || []), { question: '', answer: '', quote: '', author: '' }] } })}>
                                                + Add Item
                                            </Button>
                                        </div>
                                        {currentSection.content.items.map((item: any, i: number) => (
                                            <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                                                {currentSection.type === 'FAQ' ? (
                                                    <>
                                                        <input className="w-full bg-white p-2 rounded-lg text-sm font-bold outline-none" placeholder="Question" value={item.question} onChange={e => {
                                                            const newItems = [...currentSection.content.items];
                                                            newItems[i].question = e.target.value;
                                                            setCurrentSection({ ...currentSection, content: { ...currentSection.content, items: newItems } });
                                                        }} />
                                                        <textarea className="w-full bg-white p-2 rounded-lg text-xs outline-none h-20" placeholder="Answer" value={item.answer} onChange={e => {
                                                            const newItems = [...currentSection.content.items];
                                                            newItems[i].answer = e.target.value;
                                                            setCurrentSection({ ...currentSection, content: { ...currentSection.content, items: newItems } });
                                                        }} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <textarea className="w-full bg-white p-2 rounded-lg text-xs outline-none h-20" placeholder="Quote" value={item.quote} onChange={e => {
                                                            const newItems = [...currentSection.content.items];
                                                            newItems[i].quote = e.target.value;
                                                            item.quote = e.target.value;
                                                            setCurrentSection({ ...currentSection, content: { ...currentSection.content, items: newItems } });
                                                        }} />
                                                        <input className="w-full bg-white p-2 rounded-lg text-sm font-bold outline-none" placeholder="Author" value={item.author} onChange={e => {
                                                            const newItems = [...currentSection.content.items];
                                                            newItems[i].author = e.target.value;
                                                            setCurrentSection({ ...currentSection, content: { ...currentSection.content, items: newItems } });
                                                        }} />
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {currentSection.type === 'BEFORE-AFTER' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-[10px] font-black text-gray-400 uppercase">Before</label> <ImageUploader currentImage={currentSection.content.before} onImageUploaded={url => setCurrentSection({ ...currentSection, content: { ...currentSection.content, before: url } })} folder="pages" /></div>
                                        <div><label className="text-[10px] font-black text-gray-400 uppercase">After</label> <ImageUploader currentImage={currentSection.content.after} onImageUploaded={url => setCurrentSection({ ...currentSection, content: { ...currentSection.content, after: url } })} folder="pages" /></div>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                                <Button variant="ghost" className="font-bold text-gray-400" onClick={() => setIsSectionModalOpen(false)}>Discard</Button>
                                <Button onClick={handleSaveSectionEdits} className="bg-gray-900 hover:bg-[#7FFF00] text-white font-bold h-12 px-8 rounded-xl shadow-xl transition-all">
                                    Done Editing
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export const getServerSideProps = async (context: any) => {
    const { id } = context.params;
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    try {
        const contentSections = await prisma.contentSection.findMany({
            orderBy: { internalName: 'asc' }
        });

        if (id === 'new') {
            await prisma.$disconnect();
            return { props: { page: null, availableSections: JSON.parse(JSON.stringify(contentSections)) } };
        }

        const data = await prisma.page.findUnique({
            where: { id },
            include: { sections: { include: { section: true }, orderBy: { order: 'asc' } } }
        });
        await prisma.$disconnect();
        return { props: { page: JSON.parse(JSON.stringify(data)), availableSections: JSON.parse(JSON.stringify(contentSections)) } };
    } catch (e) {
        await prisma.$disconnect();
        return { props: { page: null, availableSections: [] } };
    }
};
