import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Mail, Trash2, Eye, Calendar, User, Phone, CheckCircle } from 'lucide-react';
import FormattedDate from '@/components/admin/FormattedDate';

interface MessagesProps {
    initialMessages: any[];
}

export default function MessagesAdmin({ initialMessages }: MessagesProps) {
    const [messages, setMessages] = useState(initialMessages);
    const [selected, setSelected] = useState<any>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
        if (res.ok) setMessages(messages.filter(m => m.id !== id));
    };

    const markAsRead = async (msg: any) => {
        if (msg.status === 'READ') return;
        const res = await fetch(`/api/messages/${msg.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'READ' }),
        });
        if (res.ok) {
            setMessages(messages.map(m => m.id === msg.id ? { ...m, status: 'READ' } : m));
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 font-outfit">Contact Messages</h1>
                <p className="text-gray-500">Respond to customer inquiries and quote requests.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Messages List */}
                <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Inbox ({messages.filter(m => m.status === 'UNREAD').length} Unread)</span>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => { setSelected(msg); markAsRead(msg); }}
                                className={`p-4 cursor-pointer hover:bg-[#7FFF00]/10/50 transition-colors relative ${selected?.id === msg.id ? 'bg-[#7FFF00]/10 border-l-4 border-[#7FFF00]' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-sm font-bold ${msg.status === 'UNREAD' ? 'text-gray-900' : 'text-gray-500'}`}>{msg.name}</span>
                                    <span className="text-[10px] text-gray-400 font-medium"><FormattedDate date={msg.createdAt} /></span>
                                </div>
                                <p className={`text-xs truncate ${msg.status === 'UNREAD' ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>{msg.subject || 'No Subject'}</p>
                                {msg.status === 'UNREAD' && <div className="absolute right-4 bottom-4 w-2 h-2 bg-blue-500 rounded-full shadow-sm"></div>}
                            </div>
                        ))}

                        {messages.length === 0 && (
                            <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                                <Mail className="opacity-10 mb-2" size={48} />
                                <p className="text-sm">Inbox is empty.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-7">
                    {selected ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full p-8 flex flex-col">
                            <div className="flex justify-between items-start mb-8 pb-8 border-b border-gray-50">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-[#7FFF00]/20 text-orange-700 rounded-full flex items-center justify-center font-bold text-lg">
                                            {selected.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{selected.name}</h3>
                                            <p className="text-sm text-gray-500">{selected.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" className="text-red-500 hover:bg-red-50 rounded-xl" onClick={() => handleDelete(selected.id)}>
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-6 flex-1">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Subject</label>
                                    <p className="text-lg font-bold text-gray-800">{selected.subject || '(No Subject)'}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Message</label>
                                    <div className="bg-gray-50 p-6 rounded-2xl text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {selected.message}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white border p-4 rounded-xl flex items-center gap-3">
                                        <Phone size={18} className="text-[#6ee600]" />
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Phone</p>
                                            <p className="text-sm font-medium text-gray-900">{selected.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white border p-4 rounded-xl flex items-center gap-3">
                                        <Calendar size={18} className="text-[#6ee600]" />
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Received</p>
                                            <p className="text-sm font-medium text-gray-900"><FormattedDate date={selected.createdAt} showTime /></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-50 flex justify-end gap-3">
                                <Button variant="outline" className="rounded-xl px-6" onClick={() => window.open(`mailto:${selected.email}`)}>
                                    <Mail size={16} className="mr-2" /> Reply via Email
                                </Button>
                                <Button className="bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold rounded-xl px-6">
                                    <CheckCircle size={16} className="mr-2" /> Mark as Resolved
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400 min-h-[400px]">
                            <Mail size={48} className="mb-4 opacity-10" />
                            <p>Select a message to view details</p>
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
        const data = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        await prisma.$disconnect();
        return { props: { initialMessages: JSON.parse(JSON.stringify(data)) } };
    } catch (e) {
        await prisma.$disconnect();
        return { props: { initialMessages: [] } };
    }
};
