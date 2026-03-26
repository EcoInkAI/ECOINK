import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import {
    Save,
    Globe,
    MapPin,
    Share2,
    BarChart3,
    FileText,
    AlertTriangle,
    Clock,
    CheckCircle,
    Info,
    Facebook,
    Instagram,
    Linkedin,
    Youtube
} from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';

interface SeoSettingsProps {
    seo: any;
}

export default function SeoSettingsAdmin({ seo: initialSeo }: SeoSettingsProps) {
    const [seo, setSeo] = useState(initialSeo || {
        siteName: 'Magri Cabinets',
        businessType: 'LocalBusiness',
        addressLocality: 'Melbourne',
        addressRegion: 'VIC',
        priceRange: '$$',
        sitemapEnabled: true,
        sitemapFrequency: 'weekly'
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings/seo', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(seo),
            });
            if (res.ok) alert('SEO Settings saved successfully!');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AdminLayout>
            <form onSubmit={handleSave} className="max-w-[1200px] mx-auto pb-20">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-outfit uppercase tracking-tight">Global SEO & Schema</h1>
                        <p className="text-gray-500 text-sm md:text-base">Configure sitewide SEO defaults, business schema, and tracking codes.</p>
                    </div>
                    <Button type="submit" disabled={isSaving} className="bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-[#7FFF00]/20 active:scale-95 transition-all">
                        {isSaving ? 'Saving...' : <><Save size={18} className="mr-2" /> Save SEO Config</>}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Section 1: Site-Wide Defaults */}
                        <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                            <h2 className="text-lg font-black text-gray-900 font-outfit uppercase tracking-widest flex items-center gap-3">
                                <Globe size={20} className="text-[#7FFF00]" /> Site-Wide SEO Defaults
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Site Name</label>
                                    <input
                                        className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl p-4 text-sm font-bold text-gray-800 outline-none focus:border-[#7FFF00] transition-all"
                                        value={seo.siteName || ''}
                                        onChange={e => setSeo({ ...seo, siteName: e.target.value })}
                                        placeholder="Magri Cabinets"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Site Title Template</label>
                                    <input
                                        className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl p-4 text-sm font-bold text-gray-800 outline-none focus:border-[#7FFF00] transition-all"
                                        value={seo.siteTitle || ''}
                                        onChange={e => setSeo({ ...seo, siteTitle: e.target.value })}
                                        placeholder="{Page Title} | Magri Cabinets Melbourne"
                                    />
                                </div>
                                <div className="col-span-2 space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Meta Description</label>
                                    <textarea
                                        className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl p-4 text-sm font-medium text-gray-600 outline-none focus:border-[#7FFF00] transition-all min-h-[100px] resize-none"
                                        value={seo.siteDescription || ''}
                                        onChange={e => setSeo({ ...seo, siteDescription: e.target.value })}
                                        placeholder="Premier cabinet makers in Melbourne specializing in custom kitchens, wardrobes, and vanities..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: LocalBusiness Schema */}
                        <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                            <h2 className="text-lg font-black text-gray-900 font-outfit uppercase tracking-widest flex items-center gap-3">
                                <MapPin size={20} className="text-blue-500" /> Business Details (Schema.org)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Legal Business Name</label>
                                    <input className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl p-4 text-sm font-bold text-gray-800" value={seo.businessName || ''} onChange={e => setSeo({ ...seo, businessName: e.target.value })} />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Business Type</label>
                                    <select className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl p-4 text-sm font-bold text-gray-800 appearance-none" value={seo.businessType || ''} onChange={e => setSeo({ ...seo, businessType: e.target.value })}>
                                        <option value="LocalBusiness">Local Business</option>
                                        <option value="HomeAndConstructionBusiness">Home & Construction</option>
                                        <option value="GeneralContractor">General Contractor</option>
                                        <option value="FurnitureStore">Furniture Store</option>
                                    </select>
                                </div>
                                <div className="col-span-2 space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Street Address</label>
                                    <input className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl p-4 text-sm font-bold text-gray-800" value={seo.streetAddress || ''} onChange={e => setSeo({ ...seo, streetAddress: e.target.value })} />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Locality (Suburb)</label>
                                    <input className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl p-4 text-sm font-bold text-gray-800" value={seo.addressLocality || ''} onChange={e => setSeo({ ...seo, addressLocality: e.target.value })} />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Postcode</label>
                                    <input className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl p-4 text-sm font-bold text-gray-800" value={seo.postalCode || ''} onChange={e => setSeo({ ...seo, postalCode: e.target.value })} />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                                    <input className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl p-4 text-sm font-bold text-gray-800" value={seo.telephone || ''} onChange={e => setSeo({ ...seo, telephone: e.target.value })} />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price Range (e.g. $$, $$$)</label>
                                    <input className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl p-4 text-sm font-bold text-gray-800" value={seo.priceRange || ''} onChange={e => setSeo({ ...seo, priceRange: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Analytics & Tracking */}
                        <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
                            <h2 className="text-lg font-black text-gray-900 font-outfit uppercase tracking-widest flex items-center gap-3">
                                <BarChart3 size={20} className="text-purple-500" /> Analytics & Tracking
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Google Analytics ID (G-XXXX)</label>
                                    <input className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl p-4 text-sm font-mono text-gray-800" value={seo.googleAnalyticsId || ''} onChange={e => setSeo({ ...seo, googleAnalyticsId: e.target.value })} />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Google Tag Manager ID</label>
                                    <input className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl p-4 text-sm font-mono text-gray-800" value={seo.googleTagManager || ''} onChange={e => setSeo({ ...seo, googleTagManager: e.target.value })} />
                                </div>
                                <div className="col-span-2 space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Google Search Console Verification</label>
                                    <input className="w-full border-2 border-gray-50 bg-gray-50/50 rounded-2xl p-4 text-sm font-mono text-gray-800" value={seo.googleSearchConsole || ''} onChange={e => setSeo({ ...seo, googleSearchConsole: e.target.value })} />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* OG Default Image */}
                        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <Share2 size={14} className="text-[#7FFF00]" /> Default OG Image
                            </h3>
                            <ImageUploader
                                currentImage={seo.defaultOgImage}
                                onImageUploaded={(url) => setSeo({ ...seo, defaultOgImage: url })}
                                folder="seo"
                                aspectRatio="video"
                            />
                            <p className="text-[10px] text-gray-400 text-center italic">Fallback image for all social sharing.</p>
                        </div>

                        {/* Sitemap Status */}
                        <div className="bg-gray-900 p-8 rounded-[32px] shadow-lg shadow-gray-200 text-white space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={16} className="text-blue-400" /> Sitemap XML
                                </h3>
                                <div className={`w-3 h-3 rounded-full ${seo.sitemapEnabled ? 'bg-green-500' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Status</span>
                                    <span className="text-xs font-black text-green-400">ACTIVE & DYNAMIC</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Frequency</span>
                                    <select
                                        className="bg-transparent border-b border-gray-700 text-xs font-bold outline-none"
                                        value={seo.sitemapFrequency || 'weekly'}
                                        onChange={e => setSeo({ ...seo, sitemapFrequency: e.target.value })}
                                    >
                                        <option value="daily" className="bg-gray-900">Daily</option>
                                        <option value="weekly" className="bg-gray-900">Weekly</option>
                                        <option value="monthly" className="bg-gray-900">Monthly</option>
                                    </select>
                                </div>
                            </div>

                            <button type="button" className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                Regenerate Sitemap
                            </button>
                        </div>

                        {/* Social Links Quick Access */}
                        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b pb-4">Brand Connections</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Facebook size={18} /></div>
                                    <input className="flex-1 text-xs font-medium border-b py-2 focus:border-[#7FFF00] outline-none" placeholder="Facebook URL" value={seo.facebookUrl || ''} onChange={e => setSeo({ ...seo, facebookUrl: e.target.value })} />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center"><Instagram size={18} /></div>
                                    <input className="flex-1 text-xs font-medium border-b py-2 focus:border-[#7FFF00] outline-none" placeholder="Instagram URL" value={seo.instagramUrl || ''} onChange={e => setSeo({ ...seo, instagramUrl: e.target.value })} />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center"><Linkedin size={18} /></div>
                                    <input className="flex-1 text-xs font-medium border-b py-2 focus:border-[#7FFF00] outline-none" placeholder="LinkedIn URL" value={seo.linkedinUrl || ''} onChange={e => setSeo({ ...seo, linkedinUrl: e.target.value })} />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"><Youtube size={18} /></div>
                                    <input className="flex-1 text-xs font-medium border-b py-2 focus:border-[#7FFF00] outline-none" placeholder="YouTube URL" value={seo.youtubeUrl || ''} onChange={e => setSeo({ ...seo, youtubeUrl: e.target.value })} />
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </form>
        </AdminLayout>
    );
}

export const getServerSideProps = async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    try {
        const data = await prisma.seoSettings.findFirst({ where: { id: 1 } });
        await prisma.$disconnect();
        return { props: { seo: JSON.parse(JSON.stringify(data)) } };
    } catch (e) {
        await prisma.$disconnect();
        return { props: { seo: null } };
    }
};
