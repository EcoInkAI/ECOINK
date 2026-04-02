"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useBooking } from "@/lib/BookingContext";

const heroServices = [
    {
        title: "Bespoke Kitchen Cabinets",
        description: "Transform your heart of the home with custom-built kitchen cabinetry designed for style and functionality.",
        image: "/kitchen/IMG_3226.jpg",
        link: "/kitchen-cabinets"
    },
    {
        title: "Luxury Bathroom Vanities",
        description: "Stylish, functional and custom-built bathroom vanities designed for modern Melbourne homes.",
        image: "/bathromr.jpg",
        link: "/bathroom-vanities"
    },
    {
        title: "Custom Wardrobes",
        description: "Maximize your storage with elegant walk-in and built-in wardrobes tailored to your needs.",
        image: "/wardrobe/wardrobe-1.png",
        link: "/wardrobes"
    },
    {
        title: "Modern TV Cabinets",
        description: "Sleek entertainment units that perfectly organize your media and enhance your living space.",
        image: "/Tvcabinets/IMG_1347.jpg",
        link: "/tv-cabinets"
    },
    {
        title: "Functional Laundry",
        description: "Efficient and durable laundry storage solutions that make household chores a breeze.",
        image: "/Laundry/laundry1.png",
        link: "/laundry-cabinets"
    },
    {
        title: "Handcrafted Furniture",
        description: "Unique, custom-made furniture pieces that add character and quality to every room.",
        image: "/Furniture/IMG_2073.jpg",
        link: "/furniture"
    }
];

interface HeroProps {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundImage?: string;
    backgroundVideo?: string; // Added prop
    imageAlt?: string;
    services?: any[];
    badge?: string;
}

export default function Hero({ title, subtitle, ctaText, ctaLink = "/contact", backgroundImage, backgroundVideo, imageAlt, services = [], badge }: HeroProps) {
    const [currentService, setCurrentService] = useState(0);
    const { openBookingModal } = useBooking();

    // Map CMS services to component format if provided, otherwise use fallback
    const activeServices = services && services.length > 0 ? services.map(s => ({
        title: s.heading || s.name || s.title || "Quality Joinery",
        description: s.subheading || s.description || "Custom cabinetry solutions",
        image: s.image || s.heroImage || "/kitchen2.jpg",
        link: s.ctaLink || s.href || '/contact',
        ctaText: s.ctaText || "Get a FREE Quote"
    })) : heroServices;

    // Only run auto-rotation if no specific title is provided (Homepage mode)
    useEffect(() => {
        if (title) return;

        const timer = setInterval(() => {
            setCurrentService((prev) => (prev + 1) % activeServices.length);
        }, 5000); // Change every 5 seconds

        return () => clearInterval(timer);
    }, [title, activeServices.length]);

    const service = activeServices[currentService] || activeServices[0];

    // If title is provided, use it (Static Mode). Otherwise use the carousel service.
    const displayTitle = title || service.title;
    const displayDescription = subtitle || service.description;
    const displayCtaText = ctaText || (service as any).ctaText || "Get a FREE Quote";
    const displayCtaLink = ctaLink || service.link;

    // Image Logic: 
    // Handle potential double slashes or missing protocols from CMS
    const sanitizeUrl = (url: string) => {
        if (!url) return "/kitchen2.jpg";
        if (url.startsWith("//")) return `https:${url}`;
        return url;
    };

    const displayImage = sanitizeUrl(title ? (backgroundImage || "/kitchen2.jpg") : (backgroundImage || service.image || "/kitchen2.jpg"));
    const displayBadge = badge || "Premier Cabinet Makers";

    return (
        <section className="relative bg-gradient-to-br from-gray-600 to-gray-700 pt-8 pb-12 lg:pt-36 lg:pb-28 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Mobile-only Badge (Shows above image due to flex-col-reverse) */}
                <div className="lg:hidden flex justify-center mb-4">
                    <div className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm">
                        Top Quality Cabinets in Melbourne
                    </div>
                </div>

                <div className="flex flex-col-reverse lg:flex-row items-center gap-4 lg:gap-20">

                    {/* Left Side: Content */}
                    <div className="flex-1 text-center lg:text-left w-full relative lg:min-h-auto flex flex-col justify-center">
                        <div className="hidden lg:inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm w-fit mx-auto lg:mx-0">
                            {displayBadge}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={title || currentService} // Key changes based on mode
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
                                    {/* For static titles, we might lose the split coloring unless we process it manually. 
                                        For simplicity, we color the first word if it's dynamic, or just keep it simple. */}
                                    {!title ? (
                                        <>
                                            <span className="text-orange-500">{displayTitle.split(" ")[0]} </span>
                                            {displayTitle.split(" ").slice(1).join(" ")}
                                        </>
                                    ) : (
                                        displayTitle
                                    )}
                                </h1>

                                <p className="text-base sm:text-xl text-gray-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                                    {displayDescription}
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                                    <div onClick={openBookingModal} className="w-full sm:w-auto cursor-pointer">
                                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
                                            {displayCtaText}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Progress Indicators - Only show if NO title (Carousel Mode) */}
                        {!title && activeServices.length > 1 && (
                            <div className="flex items-center justify-center lg:justify-start gap-3 pt-8 mt-4 lg:mt-0">
                                {activeServices.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentService(index)}
                                        className={`h-1.5 rounded-full transition-all duration-500 ${index === currentService
                                            ? "w-12 bg-orange-500 shadow-[0_0_10px_rgba(247,148,29,0.5)]"
                                            : "w-2 bg-gray-500 hover:bg-gray-400"
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side: Image or Video */}
                    <div className="flex-1 w-full relative group perspective-1000">
                        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 group-hover:ring-orange-500/50 transition-all duration-500">
                            {/* Orange decorative blob/bg */}
                            <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-500/20 rounded-full blur-[80px] -z-10 animate-pulse"></div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={title || currentService}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.7 }}
                                    className="absolute inset-0"
                                >
                                    {backgroundVideo ? (
                                        <video
                                            className="absolute inset-0 w-full h-full object-cover"
                                            src={backgroundVideo}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                        />
                                    ) : (
                                        <>
                                            <Image
                                                src={displayImage}
                                                alt={imageAlt || displayTitle}
                                                fill
                                                className="object-cover"
                                                priority
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                            {/* Subtle overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                                        </>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
