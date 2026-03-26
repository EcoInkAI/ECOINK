import { useState, useEffect } from 'react';
import {
    Search,
    Share2,
    Settings,
    Code,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Eye,
    Smartphone,
    Monitor,
    Facebook,
    Twitter,
    Linkedin,
    ChevronDown,
    ChevronUp,
    Info,
    Layout,
    ArrowRight
} from 'lucide-react';
import ImageUploader from './ImageUploader';
import { analyzeSEO, SeoAnalysisResult } from '@/lib/seo/analyzer';

interface SeoMetaBoxProps {
    data: any;
    onChange: (newData: any) => void;
    content?: string;
}

export default function SeoMetaBox({ data, onChange, content = '' }: SeoMetaBoxProps) {
    const [activeTab, setActiveTab] = useState('general');
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [analysis, setAnalysis] = useState<SeoAnalysisResult | null>(null);
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        const result = analyzeSEO(data, content);
        setAnalysis(result);

        // Auto-update scores if they changed significantly to avoid infinite loops
        if (result.score !== data.seoScore || result.readabilityScore !== data.readabilityScore) {
            onChange({
                ...data,
                seoScore: result.score,
                readabilityScore: result.readabilityScore
            });
        }
    }, [data.seoTitle, data.seoDescription, data.focusKeyphrase, content]);

    const handleChange = (field: string, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500 bg-green-50 border-green-200';
        if (score >= 50) return 'text-[#7FFF00] bg-[#7FFF00]/10 border-orange-200';
        return 'text-red-500 bg-red-50 border-red-200';
    };

    const tabs = [
        { id: 'general', label: 'General SEO', icon: Search },
        { id: 'social', label: 'Social Media', icon: Share2 },
        { id: 'advanced', label: 'Advanced', icon: Settings },
        { id: 'schema', label: 'Schema Markup', icon: Code },
    ];

    return (
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden mt-8 transition-all duration-300">
            {/* Header / Accordion Toggle */}
            <div
                className="p-6 md:p-8 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#7FFF00] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#7FFF00]/20">
                        <Search size={22} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight font-outfit">
                            SEO Optimization & Social Media
                        </h2>
                        <p className="text-xs text-gray-500 font-medium">Configure how this page appears in Google and Social Media</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {analysis && (
                        <div className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest flex items-center gap-2 ${getScoreColor(analysis.score)}`}>
                            SEO Score: {analysis.score}/100
                        </div>
                    )}
                    {isExpanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-gray-50 flex flex-col lg:flex-row min-h-[600px]">
                    {/* Sidebar Tabs */}
                    <div className="w-full lg:w-64 bg-gray-50/50 border-r border-gray-50 p-4 space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? 'bg-white text-[#7FFF00] shadow-sm border border-[#7FFF00]/20'
                                    : 'text-gray-500 hover:bg-white hover:text-gray-900 border border-transparent'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}

                        <div className="mt-8 p-4 bg-[#7FFF00]/10 rounded-2xl border border-[#7FFF00]/20 italic text-[10px] text-orange-700 leading-relaxed font-medium">
                            <Info size={14} className="mb-2" />
                            Use these settings to target high-value keywords in Melbourne. A good score improves visibility!
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 p-6 md:p-10">

                        {activeTab === 'general' && (
                            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Focus Keyphrase</label>
                                            <span className="text-xs text-gray-400 italic">Main target keyword</span>
                                        </div>
                                        <input
                                            className="w-full border border-gray-200 bg-white rounded-xl p-4 text-sm font-bold text-gray-900 outline-none focus:border-[#7FFF00] focus:ring-4 focus:ring-[#7FFF00]/10 shadow-sm transition-all placeholder:text-gray-300"
                                            value={data.focusKeyphrase || ''}
                                            onChange={e => handleChange('focusKeyphrase', e.target.value)}
                                            placeholder="e.g. custom kitchen cabinets melbourne"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">SEO Title</label>
                                            <span className={`text-xs font-bold ${(data.seoTitle?.length || 0) > 60 ? 'text-[#7FFF00]' : 'text-gray-400'}`}>
                                                {data.seoTitle?.length || 0} / 60 recommended
                                            </span>
                                        </div>
                                        <input
                                            className="w-full border border-gray-200 bg-white rounded-xl p-4 text-sm font-bold text-gray-900 outline-none focus:border-[#7FFF00] focus:ring-4 focus:ring-[#7FFF00]/10 shadow-sm transition-all font-outfit placeholder:text-gray-300"
                                            value={data.seoTitle || ''}
                                            onChange={e => handleChange('seoTitle', e.target.value)}
                                            placeholder="Bespoke Kitchen Cabinets & Vanities | Magri Cabinets Melbourne"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Meta Description</label>
                                            <span className={`text-xs font-bold ${(data.seoDescription?.length || 0) > 160 ? 'text-[#7FFF00]' : 'text-gray-400'}`}>
                                                {data.seoDescription?.length || 0} / 160 recommended
                                            </span>
                                        </div>
                                        <textarea
                                            className="w-full border border-gray-200 bg-white rounded-xl p-4 text-sm font-medium text-gray-700 outline-none focus:border-[#7FFF00] focus:ring-4 focus:ring-[#7FFF00]/10 shadow-sm transition-all min-h-[120px] resize-none leading-relaxed placeholder:text-gray-300"
                                            value={data.seoDescription || ''}
                                            onChange={e => handleChange('seoDescription', e.target.value)}
                                            placeholder="Transform your Melbourne home with premium custom-built kitchen cabinetry. Over 10 years experience in Ballan and across Melbourne suburbs..."
                                        />
                                    </div>
                                </div>

                                {/* Preview & Analysis Side */}
                                <div className="space-y-8">
                                    {/* Google Browser Preview */}
                                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <Eye size={12} /> Google Search Preview
                                            </span>
                                            <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                                                <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded-md ${previewMode === 'desktop' ? 'bg-[#7FFF00] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Monitor size={14} /></button>
                                                <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded-md ${previewMode === 'mobile' ? 'bg-[#7FFF00] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Smartphone size={14} /></button>
                                            </div>
                                        </div>
                                        <div className="p-8 space-y-3">
                                            <div className="text-[12px] text-gray-500 flex items-center gap-1.5 mb-1">
                                                magricabinets.com.au <ArrowRight size={10} className="text-gray-300" /> {data.slug || 'slug'}
                                            </div>
                                            <h3 className={`text-xl leading-snug cursor-pointer ${previewMode === 'mobile' ? 'text-[18px]' : 'text-[20px]'} font-medium text-[#1a0dab] hover:underline truncate max-w-full`}>
                                                {data.seoTitle || (data.title || 'Page Title') + ' | Magri Cabinets'}
                                            </h3>
                                            <p className={`text-[#4d5156] leading-relaxed line-clamp-2 ${previewMode === 'mobile' ? 'text-[14px]' : 'text-[14px]'}`}>
                                                {data.seoDescription || 'Provide a compelling meta description to increase your click-through rate from search engine results pages...'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Analysis Summary */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Analysis Results</h4>
                                        <div className="space-y-3">
                                            {analysis?.checks.map(check => (
                                                <div key={check.id} className="flex items-start gap-4 group">
                                                    <div className="mt-0.5">
                                                        {check.status === 'good' && <CheckCircle size={16} className="text-green-500" />}
                                                        {check.status === 'warning' && <AlertTriangle size={16} className="text-[#7FFF00]" />}
                                                        {check.status === 'error' && <XCircle size={16} className="text-red-500" />}
                                                    </div>
                                                    <div>
                                                        <h5 className="text-[13px] font-bold text-gray-900 leading-none">{check.title}</h5>
                                                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{check.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'social' && (
                            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest font-outfit border-b pb-4 flex items-center gap-3">
                                        <Facebook size={20} className="text-[#1877F2]" /> Facebook / Open Graph
                                    </h3>

                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Facebook Image</label>
                                            <ImageUploader
                                                currentImage={data.ogImage}
                                                onImageUploaded={(url) => handleChange('ogImage', url)}
                                                folder="seo"
                                                aspectRatio="video"
                                            />
                                            <p className="text-[10px] text-gray-400 italic">Recommended: 1200x630px</p>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Facebook Title</label>
                                            <input
                                                className="w-full border border-gray-200 bg-white rounded-xl p-4 text-sm font-bold text-gray-900 outline-none focus:border-[#7FFF00] focus:ring-4 focus:ring-[#7FFF00]/10 shadow-sm transition-all placeholder:text-gray-300"
                                                value={data.ogTitle || ''}
                                                onChange={e => handleChange('ogTitle', e.target.value)}
                                                placeholder={data.seoTitle || ''}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Facebook Description</label>
                                            <textarea
                                                className="w-full border border-gray-200 bg-white rounded-xl p-4 text-sm font-medium text-gray-600 outline-none focus:border-[#7FFF00] focus:ring-4 focus:ring-[#7FFF00]/10 shadow-sm transition-all min-h-[100px] resize-none placeholder:text-gray-300"
                                                value={data.ogDescription || ''}
                                                onChange={e => handleChange('ogDescription', e.target.value)}
                                                placeholder={data.seoDescription || ''}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest font-outfit border-b pb-4 flex items-center gap-3">
                                        <Twitter size={20} className="text-[#1DA1F2]" /> Twitter Card
                                    </h3>

                                    <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 flex flex-col items-center justify-center text-center space-y-4">
                                        <Share2 size={32} className="text-gray-300" />
                                        <h4 className="font-bold text-gray-400">Social Media Preview Generator</h4>
                                        <p className="text-[11px] text-gray-400 max-w-xs leading-relaxed">
                                            Your content will be automatically optimized for Twitter, LinkedIn, and Instagram based on your Open Graph settings.
                                        </p>
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><Facebook size={14} /></div>
                                            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center"><Twitter size={14} /></div>
                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><Linkedin size={14} /></div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Meta Robots Settings</label>
                                            <select
                                                className="w-full border border-gray-200 bg-white rounded-xl p-4 text-sm font-bold text-gray-900 outline-none focus:border-[#7FFF00] focus:ring-4 focus:ring-[#7FFF00]/10 shadow-sm transition-all appearance-none"
                                                value={data.metaRobots || 'index,follow'}
                                                onChange={e => handleChange('metaRobots', e.target.value)}
                                            >
                                                <option value="index,follow">Index, Follow (Default)</option>
                                                <option value="noindex,follow">No-Index, Follow</option>
                                                <option value="index,nofollow">Index, No-Follow</option>
                                                <option value="noindex,nofollow">No-Index, No-Follow</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'advanced' && (
                            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Canonical URL</label>
                                        <input
                                            className="w-full border border-gray-200 bg-white rounded-xl p-4 text-sm font-bold text-gray-900 outline-none focus:border-[#7FFF00] focus:ring-4 focus:ring-[#7FFF00]/10 shadow-sm transition-all placeholder:text-gray-300"
                                            value={data.canonicalUrl || ''}
                                            onChange={e => handleChange('canonicalUrl', e.target.value)}
                                            placeholder="Leave blank for automatic generation"
                                        />
                                        <p className="text-[10px] text-gray-400 italic">Standardize your URL to prevent duplicate content issues.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Breadcrumb Title</label>
                                        <input
                                            className="w-full border border-gray-200 bg-white rounded-xl p-4 text-sm font-bold text-gray-900 outline-none focus:border-[#7FFF00] focus:ring-4 focus:ring-[#7FFF00]/10 shadow-sm transition-all placeholder:text-gray-300"
                                            value={data.breadcrumbTitle || ''}
                                            onChange={e => handleChange('breadcrumbTitle', e.target.value)}
                                            placeholder={data.title || ''}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="bg-[#7FFF00]/10 rounded-[32px] p-8 border border-[#7FFF00]/20 space-y-4">
                                        <h4 className="text-orange-900 font-black uppercase text-xs flex items-center gap-2">
                                            <CheckCircle size={16} /> Technical Optimization
                                        </h4>
                                        <p className="text-[11px] text-orange-800 leading-relaxed font-medium">
                                            These advanced settings allow you to override default search engine behavior. Typically, leaving them empty or at defaults is recommended unless you are fixing specific indexing issues.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'schema' && (
                            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Special Schema Type</label>
                                        <select
                                            className="w-full border border-gray-200 bg-white rounded-xl p-4 text-sm font-bold text-gray-900 outline-none focus:border-[#7FFF00] focus:ring-4 focus:ring-[#7FFF00]/10 shadow-sm transition-all appearance-none"
                                            value={data.schemaType || 'WebPage'}
                                            onChange={e => handleChange('schemaType', e.target.value)}
                                        >
                                            <option value="WebPage">Standard Web Page</option>
                                            <option value="Article">Blog Post / Article</option>
                                            <option value="Service">Professional Service</option>
                                            <option value="FAQPage">FAQs Page</option>
                                            <option value="ContactPage">Contact Page</option>
                                            <option value="AboutPage">About Us Page</option>
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Custom JSON-LD Schema</label>
                                            <span className="text-[10px] text-gray-400 font-bold decoration-orange-300 underline underline-offset-4 cursor-help">Need Help?</span>
                                        </div>
                                        <textarea
                                            className="w-full border border-gray-200 bg-white rounded-xl p-4 text-xs font-mono text-gray-600 outline-none focus:border-[#7FFF00] focus:ring-4 focus:ring-[#7FFF00]/10 shadow-sm transition-all min-h-[250px] resize-none leading-relaxed placeholder:text-gray-300"
                                            value={typeof data.schemaJson === 'string' ? data.schemaJson : JSON.stringify(data.schemaJson || {}, null, 2)}
                                            onChange={e => handleChange('schemaJson', e.target.value)}
                                            placeholder={`{ "@context": "https://schema.org", "@type": "Service", "name": "..." }`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gray-900 rounded-[32px] p-8 text-white space-y-6 shadow-2xl shadow-gray-200">
                                        <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                                            <Code size={20} className="text-[#7FFF00]" />
                                            <h4 className="text-sm font-black uppercase tracking-widest font-outfit">Visual Schema Builder</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-[11px] font-bold">
                                                <span className="text-gray-400 uppercase tracking-widest">Structural Detection</span>
                                                <span className="text-green-500 px-2 py-0.5 bg-green-500/10 rounded-full">ACTIVE</span>
                                            </div>
                                            <p className="text-xs text-gray-300 leading-relaxed font-light">
                                                Our AI-powered schema engine automatically extracts breadcrumbs, navigation, and service data for Google. Any custom JSON added will be merged with our automated schema.
                                            </p>
                                            <button className="w-full bg-white/10 hover:bg-[#7FFF00] text-white rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all">
                                                Validate Schema on Google
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}
