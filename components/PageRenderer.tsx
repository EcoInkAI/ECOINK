
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Tag, Calendar, MapPin } from 'lucide-react';

// Components
import ServiceContactForm from "./ServiceContactForm";
import ServiceGallery from "./ServiceGallery";
import FAQAccordion from "./FAQAccordion";
import Testimonials from "./Testimonials";
import ServiceCTA from "./ServiceCTA";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

interface SectionProps {
    type: string;
    data: any;
}

const PageRenderer: React.FC<{ content: SectionProps[] }> = ({ content }) => {
    if (!content || !Array.isArray(content)) return null;

    return (
        <div className="flex flex-col">
            {content.map((section, index) => {
                const sectionType = section.type.toLowerCase();

                switch (sectionType) {
                    case 'hero':
                        return (
                            <div key={index} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gray-900 w-full">
                                {section.data.image && (
                                    <Image
                                        src={section.data.image}
                                        alt="Hero"
                                        fill
                                        className="object-cover opacity-60"
                                        priority
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
                                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                                    <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 uppercase tracking-tight drop-shadow-xl font-outfit">
                                        {section.data.heading}
                                    </h1>
                                    <p className="text-lg md:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                                        {section.data.subheading}
                                    </p>
                                    {(section.data.ctaText || section.data.ctaLabel) && (
                                        <Link href={section.data.ctaLink || '#'}>
                                            <Button className="bg-[#7FFF00] hover:bg-[#6ee600] text-black font-bold h-14 px-10 rounded-2xl shadow-2xl shadow-[#7FFF00]/30 transition-all hover:scale-105 active:scale-95 text-lg uppercase tracking-widest">
                                                {section.data.ctaText || section.data.ctaLabel}
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );

                    case 'text':
                        return (
                            <div key={index} className="max-w-4xl mx-auto px-4 py-16 prose prose-lg prose-lime">
                                <div dangerouslySetInnerHTML={{ __html: section.data.html }} />
                            </div>
                        );

                    case 'image-text':
                        return (
                            <div key={index} className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div className={`relative h-[400px] ${section.data.imagePosition === 'right' ? 'order-last' : ''}`}>
                                    {section.data.image && (
                                        <Image
                                            src={section.data.image}
                                            alt="Section Image"
                                            fill
                                            className="object-cover rounded-2xl shadow-xl"
                                        />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold mb-4">{section.data.heading}</h2>
                                    <div className="prose text-gray-600" dangerouslySetInnerHTML={{ __html: section.data.html }} />
                                </div>
                            </div>
                        );

                    case 'content-split':
                        return (
                            <div key={index} className="bg-white py-16 lg:py-24">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                                        {/* Left Content */}
                                        <div className="lg:col-span-7 prose prose-lg prose-lime">
                                            {section.data.heading && <h2 className="text-3xl font-bold mb-6">{section.data.heading}</h2>}
                                            <div dangerouslySetInnerHTML={{ __html: section.data.html }} />
                                        </div>
                                        {/* Right Sidebar */}
                                        <div className="lg:col-span-5 relative">
                                            {section.data.sidebarType === 'form' ? (
                                                <ServiceContactForm defaultService={section.data.serviceName} />
                                            ) : (
                                                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 sticky top-32">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-6">{section.data.sidebarTitle || 'Details'}</h3>
                                                    <div className="space-y-6">
                                                        {(section.data.details || []).map((detail: any, dIdx: number) => (
                                                            <div key={dIdx} className="flex items-start gap-4">
                                                                <div className="p-3 bg-white rounded-xl shadow-sm text-[#7FFF00]">
                                                                    {detail.icon === 'tag' && <Tag size={20} />}
                                                                    {detail.icon === 'calendar' && <Calendar size={20} />}
                                                                    {detail.icon === 'map-pin' && <MapPin size={20} />}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-500 font-medium">{detail.label}</p>
                                                                    <p className="font-bold text-gray-900">{detail.value}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );

                    case 'gallery':
                        return (
                            <div key={index}>
                                <ServiceGallery images={section.data.images || []} />
                            </div>
                        );

                    case 'faq':
                        return (
                            <div key={index}>
                                <FAQAccordion items={section.data.items || []} />
                            </div>
                        );

                    case 'testimonials':
                    case 'testimonial':
                        return (
                            <div key={index}>
                                <Testimonials items={section.data.items || []} />
                            </div>
                        );

                    case 'before-after':
                        return (
                            <section key={index} className="bg-white py-16 lg:py-24 text-center">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">{section.data.title || "Before and After Renovation"}</h2>
                                    <BeforeAfterSlider before={section.data.before} after={section.data.after} />
                                </div>
                            </section>
                        );

                    case 'cta':
                        return (
                            <div key={index}>
                                <ServiceCTA
                                    title={section.data.title}
                                    description={section.data.description}
                                    ctaText={section.data.ctaText}
                                    ctaLink={section.data.ctaLink}
                                    phone={section.data.phone}
                                />
                            </div>
                        );

                    default:
                        return <div key={index} className="text-center py-12 text-gray-400">Unsupported Section Type: {section.type}</div>;
                }
            })}
        </div>
    );
};

export default PageRenderer;
