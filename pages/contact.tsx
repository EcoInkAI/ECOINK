import Head from "next/head";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, AlertCircle, BarChart2, Settings } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm"; // Reusing form component logic or similar
import { motion } from "framer-motion";
import CalendlyWidget from "@/components/CalendlyWidget";

export default function Contact() {
    return (
        <>
            <Head>
                <title>Book a Call | EcoInk AI Solutions</title>
                <meta name="description" content="Schedule a strategy call with EcoInk to discuss custom AI solutions, automation, and voice tech for your business." />
            </Head>

            {/* SECTION 1: HEADER - INTEGRATED */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/images/hero-background.jpg')" }}
                    />
                    <div className="absolute inset-0 bg-black/40 z-10" /> {/* Re-added dark overlay */}
                    <div className="absolute inset-0 bg-blue-500/10 z-10 mix-blend-overlay" /> {/* Blue Overlay Tint */}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-20 max-w-4xl mx-auto px-6 text-center"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-5xl font-bold mb-6 text-white text-shadow-lg"
                    >
                        Book a Strategy Call
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-xl text-gray-200 max-w-2xl mx-auto text-shadow-sm"
                    >
                        Have a question, want to discuss a custom build, or not sure which EcoInk solution fits? Get in touch.
                    </motion.p>
                </motion.div>
            </section>

            <section className="pb-24 relative z-30 -mt-32">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="glass-card p-0 md:p-4 rounded-2xl border border-white/10 shadow-2xl bg-black/80 backdrop-blur-xl overflow-hidden">
                        <CalendlyWidget />
                    </div>
                </div>
            </section>

            {/* EXISTING CLIENT SUPPORT */}
            <section className="py-24 bg-white/[0.02] border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Existing client support</h2>
                        <p className="text-gray-400">Already working with EcoInk and need help, changes, or support?</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Settings, title: "Ongoing support & changes", desc: "For updates, tweaks, integrations, or questions about your existing EcoInk system.", cta: "Contact support" },
                            { icon: BarChart2, title: "Performance & reporting", desc: "Questions about results, tracking, call logs, or system behaviour.", cta: "Request a review" },
                            { icon: AlertCircle, title: "Urgent issues", desc: "If something isn't working as expected and needs attention during business hours.", cta: "Flag an issue", color: "text-red-400" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, duration: 0.5 }}
                                whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.2)" }}
                                className="glass-card p-8 rounded-xl border-white/5 transition-all flex flex-col items-center text-center group"
                            >
                                <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 ${item.color || 'text-white'}`}>
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-4">{item.title}</h3>
                                <p className="text-gray-400 text-sm mb-8">{item.desc}</p>
                                <Button variant="outline" className="mt-auto w-full">{item.cta}</Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
