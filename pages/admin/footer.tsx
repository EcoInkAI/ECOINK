import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Save, PanelBottom, MapPin, Phone, Mail, Link as LinkIcon, Facebook, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
    settings: any;
}

export default function FooterAdmin({ settings: initialSettings }: FooterProps) {
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
            if (res.ok) alert('Footer settings saved successfully!');
        } finally {
            setIsSaving(false);
        }
    };

    const updateSocial = (key: string, value: string) => {
        setSettings({
            ...settings,
            socialLinks: {
                ...(settings.socialLinks || {}),
                [key]: value
            }
        });
    };

    return (
        <AdminLayout>
            <form onSubmit={handleSave}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-outfit uppercase tracking-tight">Footer Management</h1>
                        <p className="text-gray-500 text-sm md:text-base">Configure global footer content and social media links.</p>
                    </div>
                    <Button type="submit" disabled={isSaving} className="w-full sm:w-auto bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-[#7FFF00]/20 active:scale-95 transition-all">
                        {isSaving ? 'Saving...' : <><Save size={18} className="mr-2" /> Save Changes</>}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Branding & Bio */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 font-outfit uppercase">
                            <PanelBottom size={20} className="text-blue-500" /> Branding & Attribution
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Footer Bio Content</label>
                                <textarea
                                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#7FFF00]/50 h-32 resize-none bg-gray-50 font-medium"
                                    placeholder="Brief company bio for footer..."
                                    value={settings.footerContent || ''}
                                    onChange={e => setSettings({ ...settings, footerContent: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Copyright Text</label>
                                <input
                                    className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#7FFF00]/50 font-mono text-sm bg-gray-50"
                                    placeholder="© 2026 Magri Cabinets. All rights reserved."
                                    value={settings.copyrightText || ''}
                                    onChange={e => setSettings({ ...settings, copyrightText: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 font-outfit uppercase">
                            <LinkIcon size={20} className="text-[#7FFF00]" /> Social Networks
                        </h2>
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
                                    <Facebook size={22} />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Facebook URL</label>
                                    <input className="w-full border-b border-gray-100 py-1 outline-none focus:border-[#7FFF00] transition-colors bg-transparent" value={settings.socialLinks?.facebook || ''} onChange={e => updateSocial('facebook', e.target.value)} placeholder="https://facebook.com/..." />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center border border-pink-100 shrink-0">
                                    <Instagram size={22} />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Instagram URL</label>
                                    <input className="w-full border-b border-gray-100 py-1 outline-none focus:border-[#7FFF00] transition-colors bg-transparent" value={settings.socialLinks?.instagram || ''} onChange={e => updateSocial('instagram', e.target.value)} placeholder="https://instagram.com/..." />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center border border-blue-700 shrink-0">
                                    <Linkedin size={22} />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">LinkedIn URL</label>
                                    <input className="w-full border-b border-gray-100 py-1 outline-none focus:border-[#7FFF00] transition-colors bg-transparent" value={settings.socialLinks?.linkedin || ''} onChange={e => updateSocial('linkedin', e.target.value)} placeholder="https://linkedin.com/..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Contact (Part of footer often) */}
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 font-outfit uppercase">
                            <Mail size={20} className="text-green-500" /> Footer Contact Info
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-2"><Mail size={12} /> Email Address</label>
                                <input className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#7FFF00]/50 bg-gray-50" value={settings.contactEmail || ''} onChange={e => setSettings({ ...settings, contactEmail: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-2"><Phone size={12} /> Phone Number</label>
                                <input className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#7FFF00]/50 bg-gray-50" value={settings.contactPhone || ''} onChange={e => setSettings({ ...settings, contactPhone: e.target.value })} />
                            </div>
                            <div className="md:col-span-2 lg:col-span-1">
                                <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-2"><MapPin size={12} /> Physical Address</label>
                                <input className="w-full border border-gray-100 p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#7FFF00]/50 bg-gray-50" value={settings.address || ''} onChange={e => setSettings({ ...settings, address: e.target.value })} />
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
