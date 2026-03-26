import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, HelpCircle } from 'lucide-react';

interface FAQsProps {
    initialFAQs: any[];
}

export default function FAQsAdmin({ initialFAQs }: FAQsProps) {
    const [faqs, setFaqs] = useState(initialFAQs);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState<any>({});

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = current.id ? 'PUT' : 'POST';
        const url = current.id ? `/api/faqs/${current.id}` : '/api/faqs';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(current),
        });

        if (res.ok) window.location.reload();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
        setFaqs(faqs.filter(f => f.id !== id));
    };

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 font-outfit uppercase tracking-tight">FAQs Management</h1>
                    <p className="text-gray-500 text-sm md:text-base">Manage frequently asked questions on your website.</p>
                </div>
                <Button
                    onClick={() => { setCurrent({ order: faqs.length, isVisible: true }); setIsEditing(true); }}
                    className="bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-[#7FFF00]/20 active:scale-95 transition-all w-full sm:w-auto"
                >
                    <Plus size={18} className="mr-2" /> Add FAQ
                </Button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{current.id ? 'Edit' : 'New'} FAQ</h2>
                        <form onSubmit={handleSave} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Question</label>
                                <input className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#7FFF00]/50 transition-all font-medium" placeholder="What is the process?" value={current.question || ''} onChange={e => setCurrent({ ...current, question: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Answer</label>
                                <textarea className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#7FFF00]/50 transition-all h-40 resize-none" placeholder="The process involves..." value={current.answer || ''} onChange={e => setCurrent({ ...current, answer: e.target.value })} required />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Order</label>
                                    <input type="number" className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#7FFF00]/50 transition-all" value={current.order || 0} onChange={e => setCurrent({ ...current, order: parseInt(e.target.value) })} />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <Button type="button" variant="ghost" className="rounded-xl px-6" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button type="submit" className="bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold rounded-xl px-8 shadow-lg shadow-[#7FFF00]/20">Save FAQ</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {faqs.sort((a, b) => a.order - b.order).map((faq) => (
                    <div key={faq.id} className="bg-white p-5 md:p-8 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/40 transition-all group">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#7FFF00] flex items-center justify-center text-white text-sm font-black shrink-0 shadow-lg shadow-[#7FFF00]/20">
                                        Q{faq.order + 1}
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 leading-tight font-outfit uppercase tracking-tight group-hover:text-[#6ee600] transition-colors">{faq.question}</h3>
                                </div>
                                <div className="pl-[52px]">
                                    <p className="text-gray-500 text-sm leading-relaxed">{faq.answer}</p>
                                </div>
                            </div>
                            <div className="flex gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-all shrink-0">
                                <button onClick={() => { setCurrent(faq); setIsEditing(true); }} className="p-2.5 text-gray-400 hover:text-[#6ee600] hover:bg-[#7FFF00]/10 rounded-xl transition-all"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(faq.id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    </div>
                ))}

                {faqs.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-50 flex flex-col items-center justify-center text-gray-400">
                        <HelpCircle size={48} className="mb-4 opacity-10" />
                        <p>No FAQs added yet.</p>
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
        const data = await prisma.fAQ.findMany({ orderBy: { order: 'asc' } });
        await prisma.$disconnect();
        return { props: { initialFAQs: JSON.parse(JSON.stringify(data)) } };
    } catch (e) {
        await prisma.$disconnect();
        return { props: { initialFAQs: [] } };
    }
};
