import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { X, Save, Plus, Trash2, Wand2 } from 'lucide-react';
import Image from 'next/image';
import ImageUploader from '@/components/admin/ImageUploader';

const RECOMMENDED_COUNT = 6;

const DEFAULT_HERO_CONTENT = [
    { heading: "EcoInk Ads", subheading: "Predictable lead generation for service businesses through Meta and Google Ads.", image: "/Hero/ads-bg.jpg", ctaLink: "/ecoink-ads" },
    { heading: "EcoInk Voice", subheading: "AI Voice automation that calls your leads in seconds and books appointments.", image: "/Hero/voice-bg.jpg", ctaLink: "/ecoink-voice" },
    { heading: "AI Lead Automation", subheading: "Seamless lead-to-CMS workflows that ensure zero manual follow-up is needed.", image: "/Hero/auto-bg.jpg", ctaLink: "/contact" },
    { heading: "Predictable Growth", subheading: "Turn your demand into a booked job engine with our all-in-one AI solutions.", image: "/Hero/growth-bg.jpg", ctaLink: "/contact" },
    { heading: "24/7 Virtual Salesman", subheading: "Our AI Voice solution never sleeps, ensuring every lead is contacted instantly.", image: "/Hero/sales-bg.jpg", ctaLink: "/ecoink-voice" },
    { heading: "Automated Workflows", subheading: "Connect your ads directly to your CRM with automated scheduling and tracking.", image: "/Hero/workflow-bg.jpg", ctaLink: "/contact" }
];

interface HeroAdminProps {
    initialHeroes: any[];
    initialSettings: any;
}

export default function HeroAdmin({ initialHeroes, initialSettings }: HeroAdminProps) {
    const [heroes, setHeroes] = useState(initialHeroes);
    const [heroImage, setHeroImage] = useState(initialSettings?.heroBgImage || '/kitchen1.jpg');
    const [customHeroEnabled, setCustomHeroEnabled] = useState(initialSettings?.enableCustomHero ?? false);
    const [isAutoFilling, setIsAutoFilling] = useState(false);

    // Separate update handler for individual hero slides
    const handleUpdateSlide = async (hero: any) => {
        // In a real app, you'd open a modal. For this UI match, we'll assume inline editing or a simple prompt for now
        // to match the specific "Update Service" button visual.
        const newTitle = prompt("Enter new title:", hero.heading);
        if (newTitle) {
            // Optimistic update
            const updated = { ...hero, heading: newTitle };
            setHeroes(heroes.map(h => h.id === hero.id ? updated : h));

            // API Call
            await fetch(`/api/hero/${hero.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });
        }
    };

    // Handler for updating hero slide image
    const handleUpdateSlideImage = async (heroId: string, imageUrl: string) => {
        // Find and update the hero in state
        const hero = heroes.find(h => h.id === heroId);
        if (!hero) return;

        const updated = { ...hero, image: imageUrl };
        setHeroes(heroes.map(h => h.id === heroId ? updated : h));

        // API Call to update the image
        await fetch(`/api/hero/${heroId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        });
    };

    const handleAddSlide = async () => {
        const title = prompt("Enter title for new service slide:");
        if (!title) return;

        try {
            const res = await fetch('/api/hero', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    heading: title,
                    subheading: 'Description...',
                    image: '/kitchen1.jpg',
                    ctaText: 'Learn More',
                    ctaLink: '/services'
                })
            });
            if (res.ok) {
                const newHero = await res.json();
                setHeroes([...heroes, newHero]);
            }
        } catch (error) {
            alert('Failed to add slide');
        }
    };

    const handleDeleteSlide = async (id: string) => {
        if (!confirm('Are you sure you want to remove this slide?')) return;
        try {
            const res = await fetch(`/api/hero/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setHeroes(heroes.filter(h => h.id !== id));
            }
        } catch (error) {
            alert('Failed to delete slide');
        }
    };

    const handlePopulateDefaults = async () => {
        if (!confirm('Auto-fill missing slots with default content?')) return;

        setIsAutoFilling(true);
        const currentCount = heroes.length;
        const needed = RECOMMENDED_COUNT - currentCount;

        if (needed <= 0) {
            setIsAutoFilling(false);
            return;
        }

        // Simple strategy: take first N defaults
        // Better strategy: filter out existing titles
        const existingTitles = heroes.map(h => h.heading.toLowerCase());
        const available = DEFAULT_HERO_CONTENT.filter(d => !existingTitles.includes(d.heading.toLowerCase()));

        // Take needed amount, wrapping around if necessary (though duplicates shouldn't happen with 6/6)
        const toAdd = available.slice(0, needed);

        // If we ran out of unique defaults (unlikely), fill with generic
        while (toAdd.length < needed) {
            toAdd.push({
                heading: `New Service ${heroes.length + toAdd.length + 1}`,
                subheading: "Description...",
                image: "/kitchen1.jpg",
                ctaLink: "/services"
            });
        }

        let newHeroes = [...heroes];
        let addedCount = 0;

        for (const item of toAdd) {
            try {
                const res = await fetch('/api/hero', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        heading: item.heading,
                        subheading: item.subheading,
                        image: item.image,
                        ctaText: 'Learn More',
                        ctaLink: item.ctaLink
                    })
                });
                if (res.ok) {
                    const created = await res.json();
                    newHeroes.push(created);
                    addedCount++;
                }
            } catch (e) { console.error(e); }
        }
        setHeroes(newHeroes);
        setIsAutoFilling(false);
        alert(`Successfully added ${addedCount} slots.`);
    };

    const handleSaveGlobal = async () => {
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enableCustomHero: customHeroEnabled,
                    heroBgImage: heroImage
                })
            });
            if (res.ok) alert('Hero settings saved successfully!');
        } catch (error) {
            alert('Failed to save settings.');
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-outfit uppercase tracking-tight">Hero Section</h1>
                    <p className="text-gray-500 text-sm md:text-base">Customize the main banner and services slider.</p>
                </div>
                <Button
                    onClick={handleSaveGlobal}
                    className="w-full sm:w-auto bg-[#7FFF00] text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-[#7FFF00]/20 active:scale-95 transition-all"
                >
                    <Save size={18} className="mr-2" /> Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Left Col: Hero Services Slider */}
                <div className="xl:col-span-2 bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                        <div>
                            <h2 className="text-xl font-extrabold text-gray-900 mb-2 font-outfit uppercase">Services Slider Content</h2>
                            <p className="text-sm text-gray-400">Manage your homepage slider services. We recommend {RECOMMENDED_COUNT} service cards.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex-1 md:flex-none text-center ${heroes.length < RECOMMENDED_COUNT ? 'bg-[#7FFF00]/20 text-[#6ee600]' : 'bg-green-100 text-green-600'}`}>
                                {heroes.length} / {RECOMMENDED_COUNT} Slots
                            </div>
                            {heroes.length < RECOMMENDED_COUNT && (
                                <button
                                    onClick={handlePopulateDefaults}
                                    disabled={isAutoFilling}
                                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-colors shadow-sm ${isAutoFilling ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                >
                                    {isAutoFilling ? 'Filling...' : <><Wand2 size={14} /> Auto-Fill Slots</>}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {heroes.map((hero) => (
                            <div key={hero.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col gap-3 relative group">
                                <button
                                    onClick={() => handleDeleteSlide(hero.id)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={14} />
                                </button>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Heading</label>
                                    <input className="w-full text-sm border-gray-300 rounded-md p-2 bg-white border text-gray-900" value={hero.heading} readOnly />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                                    <textarea className="w-full text-xs border-gray-300 rounded-md p-2 bg-white border h-20 resize-none text-gray-900" value={hero.subheading || ''} readOnly />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Slide Image</label>
                                    <ImageUploader
                                        currentImage={hero.image}
                                        onImageUploaded={(url) => handleUpdateSlideImage(hero.id, url)}
                                        folder="hero"
                                        saveToMedia={true}
                                        aspectRatio="video"
                                        showRemoveButton={false}
                                    />
                                </div>

                                <Button className="w-full bg-[#7FFF00] hover:bg-[#6ee600] text-white text-xs" onClick={() => handleUpdateSlide(hero)}>
                                    Update Service
                                </Button>
                            </div>
                        ))}

                        {/* Limit Placeholders */}
                        {heroes.length < RECOMMENDED_COUNT ? (
                            Array.from({ length: RECOMMENDED_COUNT - heroes.length }).map((_, i) => (
                                <button
                                    key={`placeholder-${i}`}
                                    onClick={handleAddSlide}
                                    className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-3 text-gray-300 hover:border-[#7FFF00] hover:text-[#7FFF00] hover:bg-[#7FFF00]/10 transition-all min-h-[300px] group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-[#7FFF00]/20 flex items-center justify-center transition-colors">
                                        <Plus size={24} />
                                    </div>
                                    <div className="text-center">
                                        <span className="font-bold text-sm block">Add Service</span>
                                        <span className="text-xs text-gray-400 group-hover:text-[#7FFF00]/80">Slot {heroes.length + i + 1}</span>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <button
                                onClick={handleAddSlide}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#7FFF00] hover:text-[#7FFF00] hover:bg-[#7FFF00]/10 transition-all min-h-[300px]"
                            >
                                <Plus size={32} />
                                <span className="font-bold text-sm">Add New Service</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Col: Settings */}
                <div className="space-y-6">

                    {/* Hero Image */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">Hero Background Image</h3>
                        <p className="text-xs text-gray-500 mb-2">Background Image</p>
                        <ImageUploader
                            currentImage={heroImage}
                            onImageUploaded={(url) => setHeroImage(url)}
                            folder="hero"
                            saveToMedia={true}
                            aspectRatio="video"
                            onRemove={() => setHeroImage('')}
                        />
                        <p className="text-xs text-[#7FFF00] mt-2">Note: Custom Hero overrides slider background.</p>
                    </div>

                    {/* Visibility */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">Visibility</h3>
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="customHero"
                                checked={customHeroEnabled}
                                onChange={(e) => setCustomHeroEnabled(e.target.checked)}
                                className="mt-1 w-4 h-4 text-[#6ee600] rounded"
                            />
                            <div>
                                <label htmlFor="customHero" className="font-medium text-gray-900 text-sm">Enable Custom Hero</label>
                                <p className="text-xs text-gray-500 mt-1">Checked: Shows manual title/image.<br />Unchecked: Shows automatic service slider.</p>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Overriding Text (Optional)</h3>
                <p className="text-sm text-gray-500 mb-4">If "Enable Custom Hero" is checked, this text will override the slider content.</p>

                <div className="space-y-4 max-w-2xl">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                        <input className="w-full border p-2 rounded-lg" placeholder="e.g. Magri Cabinets Melbourne" />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export const getServerSideProps = async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const heroes = await prisma.heroBanner.findMany({
        orderBy: { order: 'asc' },
        // removed limit
    });
    const settings = await prisma.globalSettings.findFirst({ where: { id: 1 } });
    await prisma.$disconnect();
    return {
        props: {
            initialHeroes: JSON.parse(JSON.stringify(heroes)),
            initialSettings: JSON.parse(JSON.stringify(settings || {}))
        }
    };
};
