import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle, Calendar, Clock, RotateCcw, Zap, Database, Globe, ArrowRight, Loader2 } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";
import VoiceWaveBackground from "@/components/VoiceWaveBackground";
import SeamlessIntegrationDiagram from "@/components/SeamlessIntegrationDiagram";
import { motion } from "framer-motion";

import SubmissionStatusModal, { EmailStatus } from "@/components/SubmissionStatusModal";

export default function EcoInkVoice() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        requirements: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: "EcoInk Voice Consultation Request",
                    message: formData.requirements,
                }),
            });

            if (!res.ok) throw new Error("Failed to send consultation request.");

            const data = await res.json();
            setEmailStatus(data.emailStatus || null);
            setShowStatusModal(true);
            setIsSuccess(true);
            setFormData({ name: "", email: "", phone: "", requirements: "" });
        } catch (err: any) {
            setError(err.message || "Failed to submit. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            <Head>
                <title>EcoInk Voice | Custom AI Voice Agents for Business</title>
                <meta name="description" content="AI call handling, pre-qualification, and job management built specifically for your business. 24/7 intelligent automation." />
            </Head>

            {/* SECTION 1: HEADER - INTEGRATED */}
            <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
                {/* ADVANCED AI VOICE WAVE BACKGROUND */}
                <VoiceWaveBackground />

                <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute inset-0 bg-black/30" /> {/* Subtle dimming for text focus */}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-20 max-w-4xl mx-auto px-6 text-center pt-32 md:pt-20"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-3xl md:text-6xl font-bold mb-6 text-white text-shadow-lg leading-tight md:leading-normal"
                    >
                        AI voice systems, <span className="text-accent">custom-built</span> for your business
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto text-shadow-sm"
                    >
                        EcoInk Voice is a fully custom AI call handling, pre-qualification, and job management system — designed to integrate seamlessly with your existing tools and workflows.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <Link href="#how-it-works">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="glow" size="lg" className="shadow-[0_0_15px_rgba(0,255,204,0.3)] hover:shadow-[0_0_25px_rgba(0,255,204,0.6)] border-accent bg-accent text-black hover:bg-accent/90">
                                    See how EcoInk Voice works
                                </Button>
                            </motion.div>
                        </Link>
                        <Link href="#contact">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">Request a demo</Button>
                            </motion.div>
                        </Link>
                    </motion.div>
                    <p className="text-xs text-gray-400 mt-6 italic">No templates. Fully custom. Built for any industry.</p>
                </motion.div>
            </section>

            {/* SECTION 2: WHAT ECOINK VOICE HANDLES */}
            <section id="how-it-works" className="py-24 bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">EcoInk Voice handles inbound <span className="text-gradient">Demand</span> — end to end</h2>
                        <p className="text-gray-400 text-lg">Designed to manage real customer interactions, not just answer phones.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Phone, title: "Answers calls instantly — 24/7", desc: "No missed calls, no voicemail reliance, no after-hours drop-off." },
                            { icon: CheckCircle, title: "Pre-qualifies enquiries intelligently", desc: "Asks the right questions, filters low-quality enquiries, and identifies real jobs before they reach your team." },
                            { icon: Calendar, title: "Books jobs or routes leads cleanly", desc: "Schedules appointments, escalates urgent cases, or hands off qualified leads with full context." },
                            { icon: Clock, title: "Handles after-hours demand", desc: "Captures enquiries, provides accurate information, and queues follow-ups for business hours." },
                            { icon: RotateCcw, title: "Manages follow-ups", desc: "Triggers calls, SMS, or internal actions based on what actually happened in the conversation." },
                            { icon: Database, title: "Custom-trained knowledge", desc: "Trained on your services, pricing rules, service areas, and internal workflows — so every response is accurate and on-brand." }
                        ].map((item, i) => (
                            <div key={i} className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-colors group">
                                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12 text-sm text-gray-500 italic">
                        "Built to scale with demand — not break under it."
                    </div>
                </div>
            </section>

            {/* SECTION 3: REAL-TIME LOGIC */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Real-time logic, powered by your systems</h2>
                        <p className="text-gray-400 text-lg mb-8">
                            EcoInk Voice doesn't operate in isolation. It connects directly to your tools and updates live — so every conversation reflects the current state of your business.
                        </p>
                        <div className="space-y-6">
                            {[
                                { title: "Custom tools triggered during calls", desc: "Check availability, create records, send messages instantly." },
                                { title: "Existing client recognition", desc: "Respond differently to existing clients versus new enquiries." },
                                { title: "Live context awareness", desc: "Answers stay accurate, relevant, and current." },
                                { title: "CRM & system sync", desc: "Calls automatically create or update records inside your CRM." },
                                { title: "Continuous updates", desc: "When your data changes, your agent changes with it." }
                            ].map((feat, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0 mt-1">
                                        <Zap size={14} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-base">{feat.title}</h4>
                                        <p className="text-gray-400 text-sm">{feat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Abstract Visual */}
                    <div className="relative h-[500px] w-full glass-card rounded-2xl border-accent/10 p-8 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-accent/5" />
                        <div className="grid grid-cols-2 gap-4 w-full h-full opacity-20">
                            {Array.from({ length: 16 }).map((_, i) => (
                                <div key={i} className="border border-accent/30 rounded-lg animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                            ))}
                        </div>
                        <div className="absolute bg-black p-6 rounded-xl border border-accent text-center shadow-[0_0_30px_rgba(0,255,204,0.2)] z-10 max-w-xs">
                            <Database className="mx-auto text-accent mb-4" size={32} />
                            <p className="text-white font-bold">Real-time Sync</p>
                            <div className="flex justify-center gap-2 mt-4">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                                <span className="text-xs text-green-500">Live Connection</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: INTEGRATIONS (Dual Marquee) */}
            <section className="py-24 bg-white/[0.02] border-y border-white/5 overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-white">Deep integrations. <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Real-time sync.</span></h2>
                    <p className="text-gray-400">EcoInk Voice connects directly to your existing systems.</p>
                </div>

                <div className="flex flex-col gap-8">
                    {/* Marquee Line 1 */}
                    <div className="relative w-full overflow-hidden">
                        <motion.div
                            className="flex gap-12 w-max px-4"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                        >
                            {[...[
                                "ServiceM8", "GoHighLevel", "HubSpot", "Salesforce", "Zoho CRM", "Pipedrive", "Monday CRM",
                                "Freshsales", "Google Workspace", "Google Calendar"
                            ], ...[
                                "ServiceM8", "GoHighLevel", "HubSpot", "Salesforce", "Zoho CRM", "Pipedrive", "Monday CRM",
                                "Freshsales", "Google Workspace", "Google Calendar"
                            ]].map((name, i) => (
                                <span key={i} className="text-xl font-bold text-gray-500 whitespace-nowrap hover:text-white transition-colors cursor-default">
                                    {name}
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    {/* Marquee Line 2 (Different systems, reverse or offset) */}
                    <div className="relative w-full overflow-hidden">
                        <motion.div
                            className="flex gap-12 w-max px-4"
                            animate={{ x: ["-20%", "-70%"] }} // Different start/end to simulate offset/different flow
                            transition={{ duration: 45, ease: "linear", repeat: Infinity }}
                        >
                            {[...[
                                "Gmail", "Outlook", "Vonage", "Twilio", "Stripe", "Xero", "Zapier", "OpenAI",
                                "Slack", "Microsoft Teams", "Jobber", "Housecall Pro"
                            ], ...[
                                "Gmail", "Outlook", "Vonage", "Twilio", "Stripe", "Xero", "Zapier", "OpenAI",
                                "Slack", "Microsoft Teams", "Jobber", "Housecall Pro"
                            ]].map((name, i) => (
                                <span key={i} className="text-xl font-bold text-gray-500 whitespace-nowrap hover:text-white transition-colors cursor-default">
                                    {name}
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Link href="#contact">
                        <Button variant="outline" className="border-accent/50 text-accent hover:bg-accent hover:text-black transition-all">
                            Request Custom Integration
                        </Button>
                    </Link>
                </div>
            </section>

            {/* SECTION 5: FORM */}
            <section id="contact" className="py-24">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div>
                        <h2 className="text-4xl font-bold mb-6">Talk to us about a custom EcoInk Voice build</h2>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            We'll review your requirements, systems, and workflows — then map how EcoInk Voice would be built specifically for your business.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {["Fully custom builds", "Integrates with your existing systems", "No templates or off-the-shelf bots"].map((txt, i) => (
                                <li key={i} className="flex items-center gap-3 text-white">
                                    <CheckCircle className="text-accent w-5 h-5" /> {txt}
                                </li>
                            ))}
                        </ul>
                        <p className="text-sm text-gray-500 italic">"If we're not the right fit, we'll tell you."</p>
                    </div>

                    <div className="glass-card p-8 rounded-2xl border border-accent/20">
                        {isSuccess ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-8 flex flex-col items-center justify-center min-h-[300px]"
                            >
                                <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Request Received</h3>
                                <p className="text-gray-300 mb-6">Thank you. We'll review your requirements and reach out to map your custom voice system.</p>
                                <Button onClick={() => setIsSuccess(false)} variant="outline" className="border-accent/50 text-accent hover:bg-accent hover:text-black">
                                    Send Another Request
                                </Button>
                            </motion.div>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-white mb-6">Request a Consultation</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Full Name *"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-accent transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Email Address *"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-accent transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="Phone Number (Optional)"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-accent transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            placeholder="What are you looking to automate? *"
                                            value={formData.requirements}
                                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-accent h-32 transition-colors resize-none"
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                                            {error}
                                        </p>
                                    )}

                                    <Button
                                        type="submit"
                                        variant="glow"
                                        disabled={isLoading}
                                        className="w-full border-accent bg-accent text-black hover:bg-accent/90 shadow-[0_0_15px_rgba(0,255,204,0.3)]"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2" size={18} />
                                                Submitting Request...
                                            </>
                                        ) : (
                                            "Request Consultation"
                                        )}
                                    </Button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* SECTION 6: BUNDLE MENTION */}
            <section className="py-24 bg-white/5 border-t border-white/5 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-6">Works on its own. <span className="text-gradient">Even stronger together.</span></h2>

                    <div className="relative w-full h-[750px] md:h-[850px] flex items-center justify-center mb-24 mt-20 pt-10">
                        <SeamlessIntegrationDiagram />
                    </div>

                    <p className="text-gray-400 text-lg mb-10">
                        EcoInk Voice can operate independently, or act as the conversion layer that captures every opportunity generated through EcoInk Ads.
                    </p>
                    <Link href="/#enquiry">
                        <div className="inline-block relative group">
                            <motion.div
                                animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-200"
                            />
                            <Button variant="outline" className="relative border-white/20 hover:bg-black bg-black text-white px-8 py-6 text-lg">Explore the full system</Button>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Status Modal */}
            <SubmissionStatusModal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                emailStatus={emailStatus}
                title="Voice Consultation Request"
                description="We've received your consultation inquiry."
            />
        </>
    );
}
