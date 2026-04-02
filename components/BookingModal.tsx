"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Script from "next/script";
import { useEffect, useState } from "react";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
    // Handle Esc key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden z-10"
                        style={{ height: '80vh', maxHeight: '800px' }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-[110] p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="w-full h-full pt-12 overflow-y-auto custom-scrollbar">
                            {/* Calendly inline widget begin */}
                            <div 
                                className="calendly-inline-widget" 
                                data-url="https://calendly.com/james-ecoinkaisolutions/business-strategy-call" 
                                style={{ minWidth: '320px', height: '100%', minHeight: '700px' }} 
                            />
                            <Script 
                                type="text/javascript" 
                                src="https://assets.calendly.com/assets/external/widget.js" 
                                strategy="lazyOnload" 
                            />
                            {/* Calendly inline widget end */}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BookingModal;
