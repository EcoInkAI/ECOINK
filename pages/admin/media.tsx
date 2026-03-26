import { useState, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Search, Image as ImageIcon, Grid, List, ExternalLink, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import FormattedDate from '@/components/admin/FormattedDate';

interface MediaProps {
    initialMedia: any[];
}

export default function MediaAdmin({ initialMedia }: MediaProps) {
    const [media, setMedia] = useState(initialMedia);
    const [search, setSearch] = useState('');
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (file: File) => {
        setUploadProgress(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', 'media');
            formData.append('saveToMedia', 'true');

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await res.json();

            if (!res.ok || !result.success) {
                throw new Error(result.error || 'Upload failed');
            }

            // Add the new media item to the list
            const newMedia = {
                id: result.mediaAssetId,
                filename: file.name,
                url: result.url,
                type: 'image',
                size: file.size,
                createdAt: new Date().toISOString(),
            };

            setMedia([newMedia, ...media]);
            setIsUploading(false);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            setUploadError(errorMessage);
        } finally {
            setUploadProgress(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleFileUpload(file);
        } else {
            setUploadError('Please drop an image file');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently delete this media asset?')) return;
        const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
        if (res.ok) setMedia(media.filter(m => m.id !== id));
    };

    const filtered = media.filter(m => m.filename.toLowerCase().includes(search.toLowerCase()));

    return (
        <AdminLayout>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                className="hidden"
            />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
                    <p className="text-gray-500">Manage images, documents, and other project assets.</p>
                </div>
                <Button onClick={() => setIsUploading(true)} className="bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold h-12 rounded-xl">
                    <Upload size={18} className="mr-2" /> Upload New Media
                </Button>
            </div>

            {isUploading && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Upload Media</h2>
                            <button onClick={() => { setIsUploading(false); setUploadError(null); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div
                            className={`
                                border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
                                ${dragOver ? 'border-[#7FFF00] bg-[#7FFF00]/10' : 'border-gray-200 hover:border-[#7FFF00]/80'}
                                ${uploadProgress ? 'opacity-75 pointer-events-none' : ''}
                            `}
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                        >
                            {uploadProgress ? (
                                <>
                                    <Loader2 size={48} className="text-[#7FFF00] mx-auto mb-4 animate-spin" />
                                    <p className="text-gray-600 font-medium">Uploading to Cloudinary...</p>
                                </>
                            ) : (
                                <>
                                    <Upload size={48} className="text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600 font-medium mb-2">
                                        {dragOver ? 'Drop your image here' : 'Drag & drop an image here'}
                                    </p>
                                    <p className="text-gray-400 text-sm">or click to browse</p>
                                    <p className="text-xs text-gray-300 mt-4">Supports: JPEG, PNG, WebP, GIF, SVG (Max 10MB)</p>
                                </>
                            )}
                        </div>

                        {uploadError && (
                            <p className="mt-4 text-red-500 text-sm font-medium text-center">{uploadError}</p>
                        )}

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                            <Button type="button" variant="ghost" className="rounded-xl px-6" onClick={() => { setIsUploading(false); setUploadError(null); }}>Cancel</Button>
                            <Button
                                type="button"
                                className="bg-[#7FFF00] hover:bg-[#6ee600] text-white font-bold rounded-xl px-8 shadow-lg shadow-[#7FFF00]/20"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadProgress}
                            >
                                {uploadProgress ? 'Uploading...' : 'Browse Files'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search files..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-[#7FFF00]/50 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-sm text-[#6ee600]' : 'text-gray-400'}`}><Grid size={20} /></button>
                    <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm text-[#6ee600]' : 'text-gray-400'}`}><List size={20} /></button>
                </div>
            </div>

            {view === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {filtered.map((m) => (
                        <div key={m.id} className="group relative aspect-square bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                            <Image src={m.url} alt={m.filename} fill className="object-cover transition-transform group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button onClick={() => window.open(m.url, '_blank')} className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg backdrop-blur-md"><ExternalLink size={18} /></button>
                                <button onClick={() => handleDelete(m.id)} className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-md"><Trash2 size={18} /></button>
                            </div>
                            <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-[10px] text-white font-medium truncate">{m.filename}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100">
                                <th className="px-6 py-4">Preview</th>
                                <th className="px-6 py-4">Filename</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Date Added</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 relative rounded-lg overflow-hidden border">
                                            <Image src={m.url} alt={m.filename} fill className="object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900 truncate max-w-[200px]">{m.filename}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-black uppercase px-2 py-1 bg-[#7FFF00]/10 text-[#6ee600] rounded">{m.type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-400 font-medium"><FormattedDate date={m.createdAt} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(m.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {filtered.length === 0 && (
                <div className="py-32 text-center bg-white rounded-3xl border-2 border-dashed border-gray-50 flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon size={64} className="mb-4 opacity-5" />
                    <p>No media files found.</p>
                </div>
            )}
        </AdminLayout>
    );
}

export const getServerSideProps = async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    try {
        const data = await prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } });
        await prisma.$disconnect();
        return { props: { initialMedia: JSON.parse(JSON.stringify(data)) } };
    } catch (e) {
        await prisma.$disconnect();
        return { props: { initialMedia: [] } };
    }
};
