"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useBooking } from "@/lib/BookingContext";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "EcoInk Ads", href: "/ecoink-ads" },
        { name: "EcoInk Voice", href: "/ecoink-voice" },
        { name: "Contact", href: "/contact" },
    ];

    const { openBookingModal } = useBooking();

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/80 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent py-6"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo (Left) */}
                    <Link href="/" className="flex items-center gap-2 z-50">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex flex-col justify-center"
                        >
                            <div className="flex items-center leading-none">
                                <span className="text-4xl md:text-5xl font-[900] text-[#7FFF00] tracking-tighter" style={{ fontFamily: 'Inter, sans-serif' }}>ECO</span>
                                <span className="text-4xl md:text-5xl font-[900] text-white italic tracking-tighter" style={{ fontFamily: 'Inter, sans-serif' }}>INK</span>
                            </div>
                            <span className="text-[12px] md:text-[13px] font-bold tracking-[0.4em] text-white uppercase mt-1 pl-1">
                                AI SOLUTIONS
                            </span>
                        </motion.div>
                    </Link>

                    {/* Right Side Group (Nav + CTA) */}
                    <div className="hidden md:flex items-center gap-6">

                        {/* Navigation Pill */}
                        <nav className="flex items-center gap-8 px-8 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                const isVoicePage = pathname === "/ecoink-voice";
                                const themeColor = isVoicePage ? "#00ffcc" : "#7FFF00";

                                return (
                                    <Link key={link.name} href={link.href}>
                                        <span
                                            className="text-sm font-medium transition-colors"
                                            style={{
                                                color: isActive ? themeColor : "rgb(209 213 219)", // gray-300
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
                                            onMouseLeave={(e) => e.currentTarget.style.color = isActive ? themeColor : "rgb(209 213 219)"}
                                        >
                                            {link.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* CTA Button - Dynamic Color */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openBookingModal} className="cursor-pointer">
                            {(() => {
                                const isVoicePage = pathname === "/ecoink-voice";
                                const themeColor = isVoicePage ? "#00ffcc" : "#7FFF00";
                                const shadowColor = isVoicePage ? "rgba(0, 255, 204, 0.5)" : "rgba(127, 255, 0, 0.5)";

                                return (
                                    <Button
                                        variant="glow"
                                        size="lg"
                                        className="rounded-xl px-8 tracking-wide font-bold border-white"
                                        style={{
                                            backgroundColor: themeColor,
                                            borderColor: themeColor,
                                            boxShadow: `0 0 20px ${shadowColor}`,
                                            color: 'black'
                                        }}
                                    >
                                        BOOK A CALL
                                    </Button>
                                );
                            })()}
                        </motion.div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white z-50"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu - Outside header to avoid Safari stacking context issues */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 bg-black/98 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center gap-8 md:hidden h-screen w-screen"
                    >
                        {/* Close button inside full screen menu */}
                        <button
                            className="absolute top-6 right-6 text-white p-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X size={32} />
                        </button>

                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-2xl font-bold transition-colors ${pathname === link.href ? "text-primary" : "text-white hover:text-primary"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div onClick={openBookingModal} className="w-[80%] max-w-[300px] cursor-pointer">
                            <Button variant="glow" size="lg" className="w-full h-14 text-lg">
                                Book a Call
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
