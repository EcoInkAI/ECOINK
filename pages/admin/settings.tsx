import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Save, Upload, Info, Facebook, Instagram, Linkedin, Globe, Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';
import ImageUploader from '@/components/admin/ImageUploader';

interface SettingsProps {
    settings: any;
}

export default function SettingsAdmin({ settings: initialSettings }: SettingsProps) {
    const [settings, setSettings] = useState(initialSettings || {});
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (res.ok) alert('Settings saved successfully!');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AdminLayout>
            <form onSubmit={handleSave}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-outfit uppercase tracking-tight">Site Settings</h1>
                        <p className="text-gray-500 text-sm md:text-base">Manage global configurations, contact info, and SEO.</p>
                    </div>
                    <Button type="submit" disabled={isSaving} className="bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-[#7FFF00]/20 active:scale-95 transition-all">
                        {isSaving ? 'Saving...' : <><Save size={18} className="mr-2" /> Save Global Changes</>}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

                    {/* General Settings */}
                    <div className="lg:col-span-2 space-y-8">

                        <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 font-outfit uppercase tracking-wider">
                                <Info size={20} className="text-blue-500" /> General Configuration
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Site Name</label>
                                    <input
                                        className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#7FFF00]/50"
                                        value={settings.siteName || ''}
                                        onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Footer Attribution Content</label>
                                    <textarea
                                        className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#7FFF00]/50 h-32 resize-none"
                                        placeholder="Brief description about the company for the footer..."
                                        value={settings.footerContent || ''}
                                        onChange={e => setSettings({ ...settings, footerContent: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Copyright Text</label>
                                    <input
                                        className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#7FFF00]/50 font-mono text-sm"
                                        placeholder="© 2026 Magri Cabinets. All rights reserved."
                                        value={settings.copyrightText || ''}
                                        onChange={e => setSettings({ ...settings, copyrightText: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 font-outfit uppercase tracking-wider">
                                <Mail size={20} className="text-green-500" /> Contact Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2"><Mail size={12} /> Contact Email</label>
                                    <input className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#7FFF00]/50" value={settings.contactEmail || ''} onChange={e => setSettings({ ...settings, contactEmail: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2"><Phone size={12} /> Contact Phone</label>
                                    <input className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#7FFF00]/50" value={settings.contactPhone || ''} onChange={e => setSettings({ ...settings, contactPhone: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2"><MapPin size={12} /> Business Address</label>
                                    <input className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#7FFF00]/50" value={settings.address || ''} onChange={e => setSettings({ ...settings, address: e.target.value })} />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Branding & Socials */}
                    <div className="space-y-8">

                        {/* Logo Upload */}
                        <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 font-outfit uppercase tracking-wider">Site Branding</h3>
                            <ImageUploader
                                currentImage={settings.siteLogo}
                                onImageUploaded={(url) => setSettings({ ...settings, siteLogo: url })}
                                folder="settings"
                                saveToMedia={true}
                                aspectRatio="square"
                                onRemove={() => setSettings({ ...settings, siteLogo: '' })}
                            />
                            <p className="text-[10px] text-gray-400 text-center uppercase font-bold">Recommended: PNG 512x512px</p>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-6 font-outfit uppercase tracking-wider">Social Networks</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Facebook size={20} />
                                    </div>
                                    <input className="flex-1 border-b border-gray-100 py-2 outline-none text-sm" placeholder="Facebook URL" value={settings.socialLinks?.facebook || ''} onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })} />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                                        <Instagram size={20} />
                                    </div>
                                    <input className="flex-1 border-b border-gray-100 py-2 outline-none text-sm" placeholder="Instagram URL" value={settings.socialLinks?.instagram || ''} onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })} />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                                        <Linkedin size={20} />
                                    </div>
                                    <input className="flex-1 border-b border-gray-100 py-2 outline-none text-sm" placeholder="LinkedIn URL" value={settings.socialLinks?.linkedin || ''} onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: e.target.value } })} />
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
        const data = await prisma.globalSettings.findFirst({ where: { id: 1 } });
        await prisma.$disconnect();
        return { props: { settings: JSON.parse(JSON.stringify(data)) } };
    } catch (e) {
        await prisma.$disconnect();
        return { props: { settings: {} } };
    }
};
