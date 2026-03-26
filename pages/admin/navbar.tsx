import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, GripVertical, Eye, EyeOff, Save } from 'lucide-react';

interface NavbarProps {
    initialItems: any[];
}

export default function NavbarAdmin({ initialItems }: NavbarProps) {
    const [items, setItems] = useState(initialItems);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState<any>({});

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = current.id ? 'PUT' : 'POST';
        const url = current.id ? `/api/navbar/${current.id}` : '/api/navbar';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(current),
        });

        if (res.ok) window.location.reload();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        await fetch(`/api/navbar/${id}`, { method: 'DELETE' });
        setItems(items.filter(i => i.id !== id));
    };

    const toggleVisibility = async (item: any) => {
        const res = await fetch(`/api/navbar/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isVisible: !item.isVisible })
        });
        if (res.ok) {
            setItems(items.map(i => i.id === item.id ? { ...i, isVisible: !item.isVisible } : i));
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-outfit uppercase tracking-tight">Navigation Menu</h1>
                    <p className="text-gray-500 text-sm md:text-base">Manage your website's header navigation and links.</p>
                </div>
                <Button onClick={() => { setCurrent({ isVisible: true, order: items.length }); setIsEditing(true); }} className="w-full sm:w-auto bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold h-12 rounded-xl shadow-lg shadow-[#7FFF00]/20 active:scale-95 transition-all">
                    <Plus size={18} className="mr-2" /> Add Item
                </Button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{current.id ? 'Edit' : 'New'} Menu Item</h2>
                        <form onSubmit={handleSave} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Label</label>
                                <input className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all font-medium" placeholder="e.g. Services" value={current.label || ''} onChange={e => setCurrent({ ...current, label: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Link (URL)</label>
                                <input className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all" placeholder="e.g. /services" value={current.link || ''} onChange={e => setCurrent({ ...current, link: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Order</label>
                                <input type="number" className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all" value={current.order || 0} onChange={e => setCurrent({ ...current, order: parseInt(e.target.value) })} />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <Button type="button" variant="ghost" className="rounded-xl px-6" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl px-8 shadow-lg shadow-yellow-500/20">Save Item</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Structure</span>
                    <span className="text-xs text-gray-400">Drag & Drop order soon</span>
                </div>
                <div className="divide-y divide-gray-50">
                    {items.sort((a, b) => a.order - b.order).map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 group transition-colors gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <GripVertical size={20} className="text-gray-300 cursor-move shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-900 truncate">{item.label}</h3>
                                        {!item.isVisible && <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded shrink-0">Hidden</span>}
                                    </div>
                                    <p className="text-xs text-gray-400 font-mono truncate">{item.link}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                                <button onClick={() => toggleVisibility(item)} className={`p-2 rounded-lg transition-colors ${item.isVisible ? 'text-blue-500 hover:bg-blue-50' : 'text-gray-300 hover:bg-gray-100'}`}>
                                    {item.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                                <button onClick={() => { setCurrent(item); setIsEditing(true); }} className="p-2 text-gray-400 hover:text-[#6ee600] hover:bg-[#7FFF00]/10 rounded-lg transition-colors">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {items.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            No menu items found.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

export const getServerSideProps = async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    try {
        const data = await prisma.menuItem.findMany({ where: { parentId: null }, orderBy: { order: 'asc' } });
        await prisma.$disconnect();
        return { props: { initialItems: JSON.parse(JSON.stringify(data)) } };
    } catch (e) {
        await prisma.$disconnect();
        return { props: { initialItems: [] } };
    }
};
