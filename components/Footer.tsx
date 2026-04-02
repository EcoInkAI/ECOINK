"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Instagram } from "lucide-react";

import { motion } from "framer-motion";
import { useBooking } from "@/lib/BookingContext";

const Footer = () => {
    const { openBookingModal } = useBooking();

    return (
        <motion.footer
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-black/40 border-t border-white/5 pt-20 pb-10 mt-auto backdrop-blur-lg"
        >
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                {/* Column 1: Brand */}
                <div className="flex flex-col gap-6">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col justify-center mb-2"
                    >
                        <div className="flex items-center leading-none">
                            <span className="text-3xl font-[900] text-[#7FFF00] tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>ECO</span>
                            <span className="text-3xl font-[900] text-white italic tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>INK</span>
                        </div>
                        <span className="text-[10px] font-bold tracking-[0.35em] text-white uppercase mt-1 pl-1">
                            AI SOLUTIONS
                        </span>
                    </motion.div>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                        The AI-powered growth engine for service businesses. Combine Ads + Voice for predictable, automated growth.
                    </p>
                    <div className="flex items-center gap-4">
                        {[
                            { icon: Twitter, href: "#" },
                            { icon: Linkedin, href: "#" },
                            { icon: Instagram, href: "#" }
                        ].map((social, i) => (
                            <Link key={i} href={social.href}>
                                <motion.div
                                    whileHover={{ scale: 1.2, rotate: 10, backgroundColor: "rgba(127, 255, 0, 0.2)", color: "#7FFF00" }}
                                    className="p-2 bg-white/5 rounded-full text-white transition-colors"
                                >
                                    <social.icon size={18} />
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h3 className="text-white font-bold mb-6">Platform</h3>
                    <ul className="flex flex-col gap-4">
                        {[
                            { name: "Home", href: "/" },
                            { name: "EcoInk Ads", href: "/ecoink-ads" },
                            { name: "EcoInk Voice", href: "/ecoink-voice" },
                            { name: "Book a Call", href: "/contact" }
                        ].map((link, i) => (
                            <motion.li key={i} whileHover={{ x: 5 }}>
                                {link.name === "Book a Call" ? (
                                    <button onClick={openBookingModal} className="text-gray-400 hover:text-primary transition-colors text-sm text-left">
                                        {link.name}
                                    </button>
                                ) : (
                                    <Link href={link.href} className="text-gray-400 hover:text-primary transition-colors text-sm">
                                        {link.name}
                                    </Link>
                                )}
                            </motion.li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Contact */}
                <div>
                    <h3 className="text-white font-bold mb-6">Contact</h3>
                    <ul className="flex flex-col gap-4">
                        <li className="text-gray-400 text-sm">
                            <span className="block text-white mb-1">Email</span>
                            hello@ecoink.ai
                        </li>
                        <li className="text-gray-400 text-sm">
                            <span className="block text-white mb-1">Location</span>
                            Melbourne, Australia
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <p className="text-gray-500 text-xs">
                        &copy; 2026 EcoInk. All rights reserved.
                    </p>
                    <span className="hidden md:block w-px h-3 bg-white/10" />
                    <p className="text-gray-500 text-[10px] font-medium tracking-wide">
                        Built and managed by {" "}
                        <Link 
                            href="https://zentecglobal.com.au" 
                            target="_blank"
                            className="text-[#7FFF00] font-black uppercase hover:underline transition-all"
                        >
                            Zentec Global
                        </Link>
                    </p>
                </div>
                <div className="flex gap-6 text-xs text-gray-500">
                    <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
