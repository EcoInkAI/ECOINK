import Head from "next/head";
import { Button } from "@/components/ui/button";
import { AlertCircle, BarChart2, Settings } from "lucide-react";
import StandardContactForm from "@/components/StandardContactForm";
import { motion } from "framer-motion";

export default function Contact() {
    return (
        <div className="min-h-screen bg-black">
            <Head>
                <title>Contact us | EcoInk AI Solutions</title>
                <meta name="description" content="Get in touch with EcoInk to discuss custom AI solutions, automation, and voice tech for your business." />
            </Head>

            {/* SECTION 1: HEADER */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-gray-900">
                    <div className="absolute inset-0 bg-black/60 z-10" />
                </div>

                <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl font-bold mb-6 text-white"
                    >
                        Contact EcoInk
                    </motion.h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Have a question, want to discuss a custom build, or not sure which EcoInk solution fits? Get in touch.
                    </p>
                </div>
            </section>

            {/* SECTION 2: FORMS */}
            <section className="pb-24 relative z-30 -mt-32">
                <div className="max-w-6xl mx-auto px-6">
                    {/* STANDARD ENQUIRY FORM */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <StandardContactForm />
                    </motion.div>
                </div>
            </section>

            {/* SECTION 3: SUPPORT */}
            <section className="py-24 bg-white/[0.02] border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Existing client support</h2>
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
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="p-8 rounded-xl border border-white/5 bg-white/5 flex flex-col items-center text-center group"
                            >
                                <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 ${item.color || 'text-white'}`}>
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-4">{item.title}</h3>
                                <p className="text-gray-400 text-sm mb-8">{item.desc}</p>
                                <Button variant="outline" className="mt-auto w-full text-white border-white/10">{item.cta}</Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
