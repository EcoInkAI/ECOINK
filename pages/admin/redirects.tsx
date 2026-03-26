import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ArrowRightLeft, CheckCircle2, XCircle, Search, ExternalLink } from 'lucide-react';

interface Redirect {
    id: string;
    fromPath: string;
    toPath: string;
    statusCode: number;
    isActive: boolean;
    createdAt: string;
}

export default function RedirectManager() {
    const [redirects, setRedirects] = useState<Redirect[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newRedirect, setNewRedirect] = useState({ source: '', destination: '', type: '301' });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchRedirects();
    }, []);

    const fetchRedirects = async () => {
        try {
            const res = await fetch('/api/redirects');
            const data = await res.json();
            setRedirects(data);
        } catch (error) {
            console.error('Failed to fetch redirects');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/redirects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRedirect)
            });
            if (res.ok) {
                setNewRedirect({ source: '', destination: '', type: '301' });
                setIsAdding(false);
                fetchRedirects();
            }
        } catch (error) {
            alert('Failed to add redirect');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this redirect?')) return;
        try {
            const res = await fetch(`/api/redirects/${id}`, { method: 'DELETE' });
            if (res.ok) fetchRedirects();
        } catch (error) {
            alert('Failed to delete');
        }
    };

    const toggleActive = async (redirect: Redirect) => {
        try {
            const res = await fetch(`/api/redirects/${redirect.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...redirect, isActive: !redirect.isActive })
            });
            if (res.ok) fetchRedirects();
        } catch (error) {
            alert('Failed to update');
        }
    };

    const filteredRedirects = redirects.filter(r =>
        r.fromPath.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.toPath.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto space-y-8 pb-20">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 font-outfit uppercase tracking-tight">Redirect Manager</h1>
                        <p className="text-sm text-gray-500">Manage 301 and 302 URL redirects for SEO maintenance.</p>
                    </div>
                    <Button
                        onClick={() => setIsAdding(true)}
                        className="bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold rounded-xl shadow-lg shadow-[#7FFF00]/20"
                    >
                        <Plus size={18} className="mr-2" /> Add Redirect
                    </Button>
                </div>

                {isAdding && (
                    <div className="bg-white p-6 rounded-[24px] shadow-xl border border-[#7FFF00]/20 animate-in fade-in slide-in-from-top-4 duration-300">
                        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div className="md:col-span-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Source Path</label>
                                <input
                                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#7FFF00]/20 outline-none"
                                    placeholder="/old-page"
                                    value={newRedirect.source}
                                    onChange={e => setNewRedirect({ ...newRedirect, source: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="md:col-span-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Target Path/URL</label>
                                <input
                                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#7FFF00]/20 outline-none"
                                    placeholder="/new-page"
                                    value={newRedirect.destination}
                                    onChange={e => setNewRedirect({ ...newRedirect, destination: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Type</label>
                                <select
                                    className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none"
                                    value={newRedirect.type}
                                    onChange={e => setNewRedirect({ ...newRedirect, type: e.target.value })}
                                >
                                    <option value="301">301 (Permanent)</option>
                                    <option value="302">302 (Found)</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1 bg-black text-white font-bold rounded-xl">Save</Button>
                                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="rounded-xl">Cancel</Button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search redirects..."
                            className="bg-transparent border-none outline-none text-sm w-full focus:ring-0"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Source</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center"><ArrowRightLeft size={14} className="mx-auto" /></th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Destination</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading redirects...</td></tr>
                                ) : filteredRedirects.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">No redirects found.</td></tr>
                                ) : filteredRedirects.map((r) => (
                                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-[#6ee600]">{r.fromPath}</td>
                                        <td className="px-6 py-4 text-center text-gray-300">→</td>
                                        <td className="px-6 py-4 text-xs text-gray-600 flex items-center gap-2">
                                            {r.toPath}
                                            <a href={r.toPath} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-[#7FFF00]"><ExternalLink size={12} /></a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${r.statusCode === 301 ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                {r.statusCode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleActive(r)}
                                                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${r.isActive ? 'text-green-500' : 'text-gray-300'}`}
                                            >
                                                {r.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                                {r.isActive ? 'Active' : 'Disabled'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(r.id)}
                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
