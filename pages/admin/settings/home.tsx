import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Save, Home, Globe, Activity, Eye, ExternalLink } from 'lucide-react';
import SeoMetaBox from '@/components/admin/SeoMetaBox';

export default function HomeSettings({ initialPage }: { initialPage: any }) {
    const [page, setPage] = useState(initialPage || {
        title: 'Home',
        slug: 'home',
        seoTitle: '',
        seoDescription: '',
        focusKeyphrase: '',
        metaRobots: 'index,follow',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        ogType: 'website',
        metaKeywords: '',
        seoScore: 0,
        readabilityScore: 0
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Find the ID if we don't have it (should have it from initialPage)
            const url = page.id ? `/api/pages/${page.id}` : '/api/pages';
            const method = page.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...page, isPublished: true })
            });

            if (res.ok) {
                alert('Home SEO settings saved successfully!');
            } else {
                alert('Failed to save.');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-[1000px] mx-auto space-y-8 pb-20">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 font-outfit uppercase tracking-tight flex items-center gap-3">
                            <Home className="text-[#7FFF00]" /> Home SEO Settings
                        </h1>
                        <p className="text-sm text-gray-500">Manage how your homepage appears in search results and social media.</p>
                    </div>
                    <div className="flex gap-3">
                        <a href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold uppercase hover:bg-gray-200 transition-colors">
                            <Eye size={16} /> View Live
                        </a>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-[#7FFF00]/20"
                        >
                            {isSaving ? 'Saving...' : <><Save size={18} className="mr-2" /> Save Settings</>}
                        </Button>
                    </div>
                </div>

                {/* Top Section: Stats & Tips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Quick Stats */}
                    <div className="bg-gray-900 p-6 rounded-[24px] shadow-sm border border-gray-800 space-y-4 text-white">
                        <h3 className="text-xs font-black text-[#7FFF00] uppercase tracking-widest flex items-center gap-2 mb-4">
                            <Activity size={14} /> SEO Health
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] uppercase font-bold mb-1">
                                    <span>SEO Score</span>
                                    <span className={page.seoScore > 70 ? 'text-green-400' : 'text-[#7FFF00]/80'}>{page.seoScore}%</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-500 ${page.seoScore > 70 ? 'bg-green-500' : 'bg-[#7FFF00]'}`} style={{ width: `${page.seoScore}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] uppercase font-bold mb-1">
                                    <span>Readability</span>
                                    <span className={page.readabilityScore > 70 ? 'text-green-400' : 'text-[#7FFF00]/80'}>{page.readabilityScore}%</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-500 ${page.readabilityScore > 70 ? 'bg-green-500' : 'bg-[#7FFF00]'}`} style={{ width: `${page.readabilityScore}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                            <Globe size={14} className="text-[#7FFF00]" /> Best Practices
                        </h3>
                        <ul className="text-xs text-gray-500 space-y-3 list-disc pl-4">
                            <li>Ensure the **SEO Title** contains "Cabinet Makers Melbourne".</li>
                            <li>Keep the **Meta Description** between 120-155 characters.</li>
                            <li>Set a high-quality **OG Image** for social shares.</li>
                            <li>The Home page should target broad, high-volume keywords.</li>
                        </ul>
                    </div>
                </div>

                {/* Main SEO Editor - Full Width */}
                <div className="mt-8">
                    <SeoMetaBox
                        data={page}
                        onChange={(newData) => setPage(newData)}
                        content="Magri Cabinets provides custom kitchen cabinets, bathroom vanities, and bespoke furniture in Melbourne. Quality craftsmanship since 1989."
                    />
                </div>
            </div>
        </AdminLayout>
    );
}

export const getServerSideProps = async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    try {
        let homePage = await prisma.page.findUnique({ where: { slug: 'home' } });

        if (!homePage) {
            // Create it if it doesn't exist
            homePage = await prisma.page.create({
                data: {
                    title: 'Home',
                    slug: 'home',
                    isPublished: true,
                    description: 'Homepage of Magri Cabinets'
                }
            });
        }

        await prisma.$disconnect();
        return { props: { initialPage: JSON.parse(JSON.stringify(homePage)) } };
    } catch (e) {
        await prisma.$disconnect();
        return { props: { initialPage: null } };
    }
};
