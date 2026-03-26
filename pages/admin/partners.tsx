import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Globe, ExternalLink, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ImageUploader from '@/components/admin/ImageUploader';

interface PartnersProps {
    initialPartners: any[];
}

export default function PartnersAdmin({ initialPartners }: PartnersProps) {
    const [partners, setPartners] = useState(initialPartners);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState<any>({});

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = current.id ? 'PUT' : 'POST';
        const url = current.id ? `/api/partners/${current.id}` : '/api/partners';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(current),
        });

        if (res.ok) window.location.reload();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete partner?')) return;
        await fetch(`/api/partners/${id}`, { method: 'DELETE' });
        setPartners(partners.filter((p: any) => p.id !== id));
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Partners & Suppliers</h1>
                    <p className="text-gray-500">Manage brand logos and website links for your partners.</p>
                </div>
                <Button onClick={() => { setCurrent({}); setIsEditing(true); }} className="bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold h-12 rounded-xl">
                    <Plus size={18} className="mr-2" /> Add Partner
                </Button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{current.id ? 'Edit' : 'New'} Partner</h2>
                        <form onSubmit={handleSave} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Partner Name</label>
                                <input className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#7FFF00]/50 transition-all font-medium" placeholder="e.g. Blum Australia" value={current.name || ''} onChange={e => setCurrent({ ...current, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Partner Logo</label>
                                <ImageUploader
                                    currentImage={current.logoUrl}
                                    onImageUploaded={(url) => setCurrent({ ...current, logoUrl: url })}
                                    folder="partners"
                                    saveToMedia={true}
                                    aspectRatio="video" // Logos vary, but video container works well
                                    onRemove={() => setCurrent({ ...current, logoUrl: '' })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Website Link (Optional)</label>
                                <input className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#7FFF00]/50 transition-all" placeholder="https://..." value={current.websiteUrl || ''} onChange={e => setCurrent({ ...current, websiteUrl: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <Button type="button" variant="ghost" className="rounded-xl px-6" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button type="submit" className="bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold rounded-xl px-8 shadow-lg shadow-[#7FFF00]/20">Save Partner</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {partners.map((item: any) => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center group relative hover:shadow-lg transition-all">
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setCurrent(item); setIsEditing(true); }} className="p-2 text-gray-400 hover:text-[#6ee600] hover:bg-[#7FFF00]/10 rounded-lg"><Edit size={14} /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                        </div>

                        <div className="w-full aspect-[3/2] relative mb-4 grayscale group-hover:grayscale-0 transition-all">
                            {item.logoUrl ? (
                                <Image src={item.logoUrl} alt={item.name} fill className="object-contain" />
                            ) : (
                                <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center text-gray-300">
                                    <ImageIcon size={32} />
                                </div>
                            )}
                        </div>

                        <h3 className="font-bold text-gray-800 text-center mb-4">{item.name}</h3>

                        {item.websiteUrl && (
                            <Link href={item.websiteUrl} target="_blank">
                                <Button variant="outline" size="sm" className="w-full rounded-xl text-[10px] uppercase font-black tracking-widest border-gray-100 hover:bg-gray-50 flex items-center gap-2">
                                    <Globe size={12} /> Visit Site <ExternalLink size={10} />
                                </Button>
                            </Link>
                        )}
                    </div>
                ))}

                {partners.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-50 flex flex-col items-center text-gray-400">
                        <ImageIcon size={48} className="mb-4 opacity-10" />
                        <p>No partners added yet.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

export const getServerSideProps = async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    try {
        const data = await prisma.partner.findMany({ orderBy: { order: 'asc' } });
        await prisma.$disconnect();
        return { props: { initialPartners: JSON.parse(JSON.stringify(data)) } };
    } catch (e) {
        await prisma.$disconnect();
        return { props: { initialPartners: [] } };
    }
};
