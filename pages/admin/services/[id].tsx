import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, Image as ImageIcon, CheckCircle, Globe, LayoutGrid, Type, Search, Eye, Activity, Wrench, Plus, Trash2, GripVertical } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import SeoMetaBox from '@/components/admin/SeoMetaBox';
// CSS moved to _app.tsx

import {
    kitchenFeatures,
    bathroomFeatures,
    laundryFeatures,
    tvFeatures,
    wardrobeFeatures,
    furnitureFeatures
} from '@/data';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const getStaticFeatures = (slug: string) => {
    switch (slug) {
        case 'kitchen-cabinets': return kitchenFeatures;
        case 'bathroom-vanities': return bathroomFeatures;
        case 'laundry-cabinets': return laundryFeatures;
        case 'tv-cabinets': return tvFeatures;
        case 'wardrobes': return wardrobeFeatures;
        case 'furniture': return furnitureFeatures;
        default: return [];
    }
};

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

// Available icons for features
const availableIcons = [
    'Droplets', 'Gem', 'Volume2', 'Ruler', 'Shield', 'Package', 'Pencil', 'Cog',
    'LayoutGrid', 'ArrowUp', 'Inbox', 'Shirt', 'Cable', 'Layers', 'HardDrive',
    'BookOpen', 'DoorOpen', 'Home', 'PanelLeft', 'Star', 'Lightbulb', 'Utensils',
    'Monitor', 'Maximize'
];

interface Feature {
    id: string;
    title: string;
    description: string;
    image: string;
    iconName: string;
}

interface ServiceFormProps {
    service: any;
}

export default function EditService({ service: initialService }: ServiceFormProps) {
    const router = useRouter();

    // Safe defaults
    const serviceData = initialService || {};

    // Initialize state with all CMS fields
    const [service, setService] = useState({
        name: '',
        slug: '',
        description: '',
        content: '',
        image: '',
        heroImage: '',
        heroSubtitle: '',
        heroBadge: '',
        ctaText: '',
        ctaLink: '',
        ctaTitle: '',
        ctaDescription: '',
        ctaBadge: '',
        ctaPhone: '',
        featureTitle: '',
        featureSubtitle: '',
        featureBadge: '',
        metaKeywords: '',
        isVisible: true,
        order: 0,
        ...serviceData,
        features: (serviceData.features && serviceData.features.length > 0)
            ? serviceData.features
            : (getStaticFeatures(serviceData.slug || '') || []).map((f: any) => ({
                id: f.id,
                title: f.title,
                description: f.description,
                image: f.image || '',
                iconName: f.iconName
            })),
        trustBadges: serviceData.trustBadges || ([] as { text: string }[]),
        galleryImages: serviceData.galleryImages || [],
        faqs: serviceData.faqs || [],
        additionalContent: serviceData.additionalContent || '',
        // NEW SEO FIELDS
        seoTitle: serviceData.seoTitle || '',
        seoDescription: serviceData.seoDescription || '',
        seoKeywords: serviceData.seoKeywords || '',
        focusKeyphrase: serviceData.focusKeyphrase || '',
        canonicalUrl: serviceData.canonicalUrl || '',
        metaRobots: serviceData.metaRobots || 'index,follow',
        ogTitle: serviceData.ogTitle || '',
        ogDescription: serviceData.ogDescription || '',
        ogImage: serviceData.ogImage || '',
        ogType: serviceData.ogType || 'website',
        twitterCard: serviceData.twitterCard || 'summary_large_image',
        schemaType: serviceData.schemaType || 'Service',
        schemaJson: serviceData.schemaJson || {},
        breadcrumbTitle: serviceData.breadcrumbTitle || '',
        seoScore: serviceData.seoScore || 0,
        readabilityScore: serviceData.readabilityScore || 0
    });


    const [isSaving, setIsSaving] = useState(false);

    // Add new feature
    const addFeature = () => {
        const newFeature: Feature = {
            id: `feature-${Date.now()}`,
            title: '',
            description: '',
            image: '',
            iconName: 'Shield'
        };
        setService({ ...service, features: [...service.features, newFeature] });
    };

    // Update feature
    const updateFeature = (index: number, field: keyof Feature, value: string) => {
        const updatedFeatures = [...service.features];
        updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
        setService({ ...service, features: updatedFeatures });
    };

    // Remove feature
    const removeFeature = (index: number) => {
        const updatedFeatures = service.features.filter((_: Feature, i: number) => i !== index);
        setService({ ...service, features: updatedFeatures });
    };

    // Handle Save
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const method = service.id ? 'PUT' : 'POST';
        const url = service.id ? `/api/services/${service.id}` : '/api/services';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(service),
            });
            if (res.ok) router.push('/admin/services');
            else alert('Failed to save. Check inputs.');
        } catch (error) {
            console.error(error);
            alert('Error saving service.');
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
                                {service.id ? 'Edit' : 'Create'} Service
                            </h1>
                            <p className="text-xs text-gray-400 font-medium">Manage the service detail page content</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className={`h-11 rounded-1xl px-4 font-bold text-[10px] uppercase tracking-widest ${service.isVisible ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}
                            onClick={() => setService({ ...service, isVisible: !service.isVisible })}
                        >
                            {service.isVisible ? <CheckCircle size={16} className="mr-2" /> : <Eye size={16} className="mr-2" />}
                            {service.isVisible ? 'Visible' : 'Hidden'}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-[#7FFF00] hover:bg-[#6ee600] text-white font-black h-11 px-6 rounded-1xl shadow-lg shadow-[#7FFF00]/20 active:scale-95 transition-all text-[10px] uppercase tracking-widest"
                        >
                            {isSaving ? 'Saving...' : <><Save size={16} className="mr-2" /> Save Service</>}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: EDITOR (8/12) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Main Content Card */}
                        <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
                            {/* Name */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block pl-1">Service Name</label>
                                <input
                                    className="w-full text-3xl md:text-4xl font-black text-gray-900 border-none outline-none focus:ring-0 placeholder:text-gray-200 font-outfit leading-tight"
                                    placeholder="Enter Service Name..."
                                    value={service.name}
                                    onChange={e => setService({ ...service, name: e.target.value, slug: !service.id ? slugify(e.target.value) : service.slug })}
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-2">URL Slug:</span>
                                <span className="text-gray-400 text-sm">/</span>
                                <input
                                    className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 w-full focus:ring-0"
                                    value={service.slug}
                                    onChange={e => setService({ ...service, slug: e.target.value })}
                                />
                            </div>

                            {/* Rich Editor */}
                            <div className="min-h-[500px] border-t border-gray-100 pt-4">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block pl-1">Detail Page Content</label>
                                <ReactQuill
                                    theme="snow"
                                    value={service.content || ''}
                                    onChange={val => {
                                        if (val !== service.content) {
                                            setService((prev: any) => ({ ...prev, content: val }));
                                        }
                                    }}
                                    modules={modules}
                                    className="h-[400px] mb-12"
                                />
                            </div>

                            {/* Gallery Images Editor */}
                            <div className="pt-8 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block pl-1">Gallery Images</label>
                                    <Button
                                        type="button"
                                        onClick={() => setService({ ...service, galleryImages: [...(service.galleryImages || []), ''] })}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold h-8 px-3 rounded-lg text-[10px] uppercase tracking-wider"
                                    >
                                        <Plus size={14} className="mr-1" /> Add Image
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {(service.galleryImages || []).map((img: string, i: number) => (
                                        <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                                            <ImageUploader
                                                currentImage={img}
                                                onImageUploaded={(url) => {
                                                    const newImages = [...(service.galleryImages || [])];
                                                    newImages[i] = url;
                                                    setService({ ...service, galleryImages: newImages });
                                                }}
                                                folder="services/gallery"
                                                saveToMedia={true}
                                                aspectRatio="square"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newImages = (service.galleryImages || []).filter((_: any, idx: number) => idx !== i);
                                                    setService({ ...service, galleryImages: newImages });
                                                }}
                                                className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {(service.galleryImages || []).length === 0 && (
                                        <div className="col-span-4 text-center py-8 text-gray-300 text-xs italic">
                                            No gallery images added
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Content Editor */}
                        <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
                            <div className="min-h-[300px]">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block pl-1">Additional Content (Bottom Section)</label>
                                <ReactQuill
                                    theme="snow"
                                    value={service.additionalContent || ''}
                                    onChange={val => {
                                        if (val !== service.additionalContent) {
                                            setService((prev: any) => ({ ...prev, additionalContent: val }));
                                        }
                                    }}
                                    modules={modules}
                                    className="h-[250px] mb-12"
                                />
                            </div>
                        </div>

                        {/* Service FAQs Editor */}
                        <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-gray-100 space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block pl-1">Page Specific FAQs</label>
                                    <p className="text-xs text-gray-400 mt-1">Overrides global FAQs if added</p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => setService({ ...service, faqs: [...(service.faqs || []), { question: '', answer: '' }] })}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold h-8 px-3 rounded-lg text-[10px] uppercase tracking-wider"
                                >
                                    <Plus size={14} className="mr-1" /> Add FAQ
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {(service.faqs || []).map((faq: any, i: number) => (
                                    <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative group">
                                        <div className="space-y-3 pr-8">
                                            <input
                                                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm font-bold placeholder:font-normal focus:ring-1 focus:ring-[#7FFF00]/20 outline-none"
                                                placeholder="Question"
                                                value={faq.question}
                                                onChange={e => {
                                                    const newFaqs = [...(service.faqs || [])];
                                                    newFaqs[i] = { ...newFaqs[i], question: e.target.value };
                                                    setService({ ...service, faqs: newFaqs });
                                                }}
                                            />
                                            <textarea
                                                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm h-20 resize-none focus:ring-1 focus:ring-[#7FFF00]/20 outline-none"
                                                placeholder="Answer"
                                                value={faq.answer}
                                                onChange={e => {
                                                    const newFaqs = [...(service.faqs || [])];
                                                    newFaqs[i] = { ...newFaqs[i], answer: e.target.value };
                                                    setService({ ...service, faqs: newFaqs });
                                                }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newFaqs = (service.faqs || []).filter((_: any, idx: number) => idx !== i);
                                                setService({ ...service, faqs: newFaqs });
                                            }}
                                            className="absolute top-2 right-2 p-2 text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {(service.faqs || []).length === 0 && (
                                    <div className="text-center py-6 text-gray-300 text-xs italic border-2 border-dashed border-gray-100 rounded-xl">
                                        No specific FAQs added. Global FAQs will be used.
                                    </div>
                                )}
                            </div>
                        </div>



                    </div>

                    {/* RIGHT COLUMN: SIDEBAR (4/12) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Status/Order Box */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <Globe size={14} className="text-[#7FFF00]" /> Settings
                            </h3>

                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Display Order</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium"
                                    value={service.order}
                                    onChange={e => setService({ ...service, order: parseInt(e.target.value) })}
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Lower numbers appear first.</p>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Visibility</label>
                                <select
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium"
                                    value={service.isVisible ? 'visible' : 'hidden'}
                                    onChange={e => setService({ ...service, isVisible: e.target.value === 'visible' })}
                                >
                                    <option value="visible">Visible on Website</option>
                                    <option value="hidden">Hidden</option>
                                </select>
                            </div>
                        </div>

                        {/* Hero Section Images */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <ImageIcon size={14} className="text-[#7FFF00]" /> Hero Image
                            </h3>
                            <ImageUploader
                                currentImage={service.heroImage || service.image}
                                onImageUploaded={(url, _, meta) => setService({ ...service, heroImage: url, heroImageAlt: meta?.altText || service.heroImageAlt })}
                                initialMetadata={{ altText: service.heroImageAlt }}
                                folder="services"
                                saveToMedia={true}
                                aspectRatio="video"
                            />
                            <p className="text-[10px] text-gray-400">Main image for the hero section on detail page</p>

                            <div className="pt-2 border-t border-gray-100">
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Hero Subtitle (optional)</label>
                                <textarea
                                    className="w-full bg-gray-50 border-0 rounded-xl p-3 text-xs text-gray-600 h-20 resize-none outline-none focus:ring-1 focus:ring-[#7FFF00]/20"
                                    placeholder="Custom subtitle for hero section..."
                                    value={service.heroSubtitle || ''}
                                    onChange={e => setService({ ...service, heroSubtitle: e.target.value })}
                                />
                            </div>

                            <div className="pt-2 border-t border-gray-100">
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Hero Badge Text (optional)</label>
                                <input
                                    className="w-full bg-gray-50 border-0 rounded-xl p-3 text-xs text-gray-600 outline-none focus:ring-1 focus:ring-[#7FFF00]/20"
                                    placeholder="e.g., Premier Cabinet Makers"
                                    value={service.heroBadge || ''}
                                    onChange={e => setService({ ...service, heroBadge: e.target.value })}
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Small badge text above the title</p>
                            </div>
                        </div>

                        {/* Card/Thumbnail Image */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <ImageIcon size={14} className="text-[#7FFF00]" /> Card Image
                            </h3>
                            <ImageUploader
                                currentImage={service.image}
                                onImageUploaded={(url, _, meta) => setService({ ...service, image: url, imageAlt: meta?.altText || service.imageAlt })}
                                initialMetadata={{ altText: service.imageAlt }}
                                folder="services"
                                saveToMedia={true}
                                aspectRatio="video"
                            />
                            <p className="text-[10px] text-gray-400">Thumbnail for homepage/navigation cards</p>
                        </div>

                        {/* Summary/Description */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <Type size={14} className="text-[#7FFF00]" /> Homepage Summary
                            </h3>
                            <textarea
                                className="w-full bg-gray-50 border-0 rounded-xl p-3 text-xs text-gray-600 h-32 resize-none outline-none focus:ring-1 focus:ring-[#7FFF00]/20"
                                placeholder="Short summary for homepage cards..."
                                value={service.description}
                                onChange={e => setService({ ...service, description: e.target.value })}
                            />
                        </div>

                        {/* CTA Section Settings */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                                <Wrench size={14} className="text-[#7FFF00]" /> CTA Section
                            </h3>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">CTA Title</label>
                                <input
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium"
                                    placeholder="e.g., Start Your Kitchen Transformation"
                                    value={service.ctaTitle || ''}
                                    onChange={e => setService({ ...service, ctaTitle: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">CTA Description</label>
                                <textarea
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm h-20 resize-none"
                                    placeholder="Description for CTA section..."
                                    value={service.ctaDescription || ''}
                                    onChange={e => setService({ ...service, ctaDescription: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Button Text</label>
                                <input
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium"
                                    placeholder="e.g., Get FREE Quote"
                                    value={service.ctaText || ''}
                                    onChange={e => setService({ ...service, ctaText: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Button Link</label>
                                <input
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium"
                                    placeholder="/contact or /get-a-custom-quote"
                                    value={service.ctaLink || ''}
                                    onChange={e => setService({ ...service, ctaLink: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">CTA Badge Text (optional)</label>
                                <input
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium"
                                    placeholder="e.g., Free Quote Available"
                                    value={service.ctaBadge || ''}
                                    onChange={e => setService({ ...service, ctaBadge: e.target.value })}
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Small badge text above the CTA title</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Phone Number</label>
                                <input
                                    className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium"
                                    placeholder="e.g., 0412 345 678"
                                    value={service.ctaPhone || ''}
                                    onChange={e => setService({ ...service, ctaPhone: e.target.value })}
                                />
                                <p className="text-[10px] text-gray-400 mt-1">Phone number shown next to CTA button</p>
                            </div>
                        </div>





                        {/* Trust Badges Section */}
                        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle size={14} className="text-[#7FFF00]" /> Trust Badges
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setService({ ...service, trustBadges: [...(service.trustBadges || []), { text: '' }] })}
                                    className="text-xs text-[#7FFF00] hover:text-[#6ee600] font-bold"
                                >
                                    + Add Badge
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400 mb-2">Trust indicators shown at bottom of CTA section</p>
                            {(service.trustBadges || []).map((badge: { text: string }, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        className="flex-1 border border-gray-200 rounded-lg p-2 text-sm font-medium"
                                        placeholder="e.g., Free Quotes, 10-Year Warranty, Melbourne Made"
                                        value={badge.text}
                                        onChange={e => {
                                            const newBadges = [...(service.trustBadges || [])];
                                            newBadges[index] = { text: e.target.value };
                                            setService({ ...service, trustBadges: newBadges });
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newBadges = (service.trustBadges || []).filter((_: any, i: number) => i !== index);
                                            setService({ ...service, trustBadges: newBadges });
                                        }}
                                        className="p-2 text-red-400 hover:text-red-600 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Content Stats */}
                        <div className="bg-gray-900 p-6 rounded-[24px] shadow-sm border border-gray-800 space-y-4 text-white">
                            <h3 className="text-xs font-black text-[#7FFF00] uppercase tracking-widest flex items-center gap-2 mb-4">
                                <Activity size={14} /> Page Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-2xl font-bold">{(service.content || '').replace(/<[^>]+>/g, '').split(/\s+/).length}</span>
                                    <span className="text-[10px] text-gray-400 uppercase">Words</span>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                {/* PHASE 2: SEO META BOX - FULL WIDTH */}
                <div className="mt-8">
                    <SeoMetaBox
                        data={service}
                        onChange={(newData) => setService(newData)}
                        content={service.content + ' ' + service.additionalContent}
                    />
                </div>
            </form>
        </AdminLayout>
    );
}

export const getServerSideProps = async (context: any) => {
    const { id } = context.params;
    if (id === 'new') return { props: { service: null } };

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    try {
        const data = await prisma.service.findUnique({
            where: { id }
        });
        await prisma.$disconnect();
        return { props: { service: JSON.parse(JSON.stringify(data)) } };
    } catch (e) {
        await prisma.$disconnect();
        return { props: { service: null } };
    }
};

