import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, Image as ImageIcon, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageMetadata {
    altText?: string;
    title?: string;
    caption?: string;
}

interface ImageUploaderProps {
    currentImage?: string;
    onImageUploaded: (url: string, publicId?: string, metadata?: ImageMetadata) => void;
    folder?: string;
    saveToMedia?: boolean;
    aspectRatio?: 'square' | 'video' | 'banner' | 'free';
    className?: string;
    showRemoveButton?: boolean;
    onRemove?: () => void;
    initialMetadata?: ImageMetadata;
}

export default function ImageUploader({
    currentImage,
    onImageUploaded,
    folder = 'general',
    saveToMedia = false,
    aspectRatio = 'video',
    className = '',
    showRemoveButton = true,
    onRemove,
    initialMetadata
}: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [showSeo, setShowSeo] = useState(false);
    const [metadata, setMetadata] = useState<ImageMetadata>(initialMetadata || {
        altText: '',
        title: '',
        caption: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const getAspectClass = () => {
        switch (aspectRatio) {
            case 'square': return 'aspect-square';
            case 'video': return 'aspect-video';
            case 'banner': return 'aspect-[21/9]';
            case 'free': return 'h-auto min-h-[200px]';
            default: return 'aspect-video';
        }
    };

    const handleUpload = useCallback(async (file: File) => {
        setIsUploading(true);
        setError(null);

        try {
            // Client-side compression to speed up upload
            let fileToUpload: File | Blob = file;

            // Only compress if it's an image and not a tiny file
            if (file.type.startsWith('image/') && file.size > 500 * 1024) {
                try {
                    fileToUpload = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = (e) => {
                            const img = document.createElement('img');
                            img.src = e.target?.result as string;
                            img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const MAX_WIDTH = 1920;
                                const MAX_HEIGHT = 1080;
                                let width = img.width;
                                let height = img.height;

                                if (width > height) {
                                    if (width > MAX_WIDTH) {
                                        height *= MAX_WIDTH / width;
                                        width = MAX_WIDTH;
                                    }
                                } else {
                                    if (height > MAX_HEIGHT) {
                                        width *= MAX_HEIGHT / height;
                                        height = MAX_HEIGHT;
                                    }
                                }

                                canvas.width = width;
                                canvas.height = height;
                                const ctx = canvas.getContext('2d');
                                ctx?.drawImage(img, 0, 0, width, height);
                                canvas.toBlob((blob) => {
                                    if (blob) resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                                    else resolve(file);
                                }, 'image/jpeg', 0.8);
                            };
                            img.onerror = reject;
                        };
                        reader.onerror = reject;
                    });
                } catch (compressionError) {
                    console.warn('Compression failed, uploading original:', compressionError);
                    fileToUpload = file;
                }
            }

            const formData = new FormData();
            formData.append('file', fileToUpload);
            formData.append('folder', folder);
            formData.append('saveToMedia', saveToMedia.toString());
            if (metadata.altText) formData.append('altText', metadata.altText);
            if (metadata.title) formData.append('title', metadata.title);
            if (metadata.caption) formData.append('caption', metadata.caption);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Upload failed');
            }

            onImageUploaded(result.url, result.publicId, metadata);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Upload failed';
            setError(errorMessage);
            console.error('Upload error:', err);
        } finally {
            setIsUploading(false);
        }
    }, [folder, saveToMedia, onImageUploaded, metadata]);

    const handleMetadataChange = (field: keyof ImageMetadata, value: string) => {
        const newMetadata = { ...metadata, [field]: value };
        setMetadata(newMetadata);
        if (currentImage) {
            // If image already exists, notify parent of metadata change
            // This might need a separate callback in a real app, but for now we follow the pattern
            // onImageUploaded(currentImage, undefined, newMetadata);
        }
    };

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleUpload(file);
        }
    }, [handleUpload]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleUpload(file);
        } else {
            setError('Please drop an image file');
        }
    }, [handleUpload]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleRemove = useCallback(() => {
        if (onRemove) {
            onRemove();
        } else {
            onImageUploaded('', '', { altText: '', title: '', caption: '' });
        }
    }, [onRemove, onImageUploaded]);

    return (
        <div className={className}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                className="hidden"
            />

            <div
                className={`
                    ${getAspectClass()} 
                    bg-gray-50 rounded-2xl border-2 border-dashed 
                    ${dragOver ? 'border-[#7FFF00] bg-[#7FFF00]/10' : 'border-gray-200'} 
                    ${isUploading ? 'opacity-75' : ''} 
                    flex items-center justify-center cursor-pointer relative overflow-hidden group 
                    transition-all duration-200 hover:border-[#7FFF00]/80
                `}
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {currentImage ? (
                    <>
                        <Image
                            src={currentImage}
                            alt={metadata.altText || "Uploaded image"}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-[#7FFF00]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <span className="text-white text-[10px] font-black uppercase tracking-widest">
                                {isUploading ? 'Uploading...' : 'Change Image'}
                            </span>
                        </div>
                        {/* Remove button */}
                        {showRemoveButton && !isUploading && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10 opacity-0 group-hover:opacity-100"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </>
                ) : isUploading ? (
                    <div className="text-center">
                        <Loader2 size={40} className="text-[#7FFF00] mx-auto mb-2 animate-spin" />
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Uploading...</p>
                    </div>
                ) : (
                    <div className="text-center p-4">
                        <ImageIcon size={40} className="text-gray-200 mx-auto mb-2" />
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                            {dragOver ? 'Drop Image Here' : 'Upload Image'}
                        </p>
                        <p className="text-[9px] text-gray-300">
                            Drag & drop or click to browse
                        </p>
                    </div>
                )}

                {/* Loading overlay */}
                {isUploading && currentImage && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                        <Loader2 size={32} className="text-white animate-spin" />
                    </div>
                )}
            </div>

            {currentImage && (
                <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setShowSeo(!showSeo)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                            <Settings size={12} className="text-[#7FFF00]" /> Image SEO & Metadata
                        </span>
                        {showSeo ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                    </button>

                    {showSeo && (
                        <div className="p-4 space-y-4 bg-white animate-in slide-in-from-top-2 duration-300">
                            <div>
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Alt Text (Best for SEO)</label>
                                <input
                                    className="w-full border border-gray-100 bg-gray-50/30 p-2 rounded-lg text-xs font-medium focus:border-[#7FFF00] outline-none transition-all"
                                    value={metadata.altText}
                                    onChange={(e) => handleMetadataChange('altText', e.target.value)}
                                    placeholder="e.g. Custom white kitchen cabinets in Melbourne"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Title</label>
                                    <input
                                        className="w-full border border-gray-100 bg-gray-50/30 p-2 rounded-lg text-xs font-medium focus:border-[#7FFF00] outline-none transition-all"
                                        value={metadata.title}
                                        onChange={(e) => handleMetadataChange('title', e.target.value)}
                                        placeholder="Image Title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Caption</label>
                                    <input
                                        className="w-full border border-gray-100 bg-gray-50/30 p-2 rounded-lg text-xs font-medium focus:border-[#7FFF00] outline-none transition-all"
                                        value={metadata.caption}
                                        onChange={(e) => handleMetadataChange('caption', e.target.value)}
                                        placeholder="Image Caption"
                                    />
                                </div>
                            </div>
                            <p className="text-[8px] text-gray-400 italic">Metadata is saved automatically when you save the page.</p>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>
            )}

            {!currentImage && !isUploading && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleClick}
                    className="w-full mt-2 rounded-xl border-gray-200 hover:border-[#7FFF00]/80 hover:bg-[#7FFF00]/10 transition-all font-bold text-xs uppercase tracking-widest"
                >
                    <Upload size={16} className="mr-2" /> Browse Files
                </Button>
            )}
        </div>
    );
}
