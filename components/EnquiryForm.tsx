import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Phone, Mail, Building2, Sparkles, Zap, Target, Layers, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import SubmissionStatusModal, { EmailStatus } from "./SubmissionStatusModal";

const EnquiryForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        business: "",
        service: "Full System (Ads + Voice + Automations)",
        message: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.name || !formData.email || !formData.phone) {
            setError("Please fill in all required fields (Name, Email, Phone).");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    subject: `New Inquiry: ${formData.service}`,
                    message: `Business: ${formData.business}\nService Interested In: ${formData.service}\n\nProject Requirements:\n${formData.message}`.trim(),
                }),
            });

            if (!res.ok) throw new Error("Failed to send request.");

            const data = await res.json();
            setEmailStatus(data.emailStatus || null);
            setShowModal(true);
            setIsSuccess(true);
            setFormData({
                name: "",
                email: "",
                phone: "",
                business: "",
                service: "Full System (Ads + Voice + Automations)",
                message: ""
            });
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="glass-card rounded-[2.5rem] border border-white/10 bg-black/50 backdrop-blur-xl overflow-hidden flex flex-col lg:flex-row relative shadow-2xl">
                {/* Decorative Background Blob */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none z-0" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none z-0" />

                {/* LEFT: NORMAL CONTACT FORM */}
                <div className="flex-1 p-8 md:p-12 lg:p-16 relative z-10 flex flex-col justify-center border-r border-white/5">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                            <Sparkles size={14} /> Get in Touch
                        </div>
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                            Let's talk <span className="text-gradient">Growth</span>
                        </h3>
                        <p className="text-gray-400 text-sm md:text-base">
                            Ready to scale your service business? Tell us about your goals with AI Voice, Google Ads, or Automations.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                    Full Name <span className="text-primary">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600 text-sm"
                                    placeholder="John Smith"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                    Email Address <span className="text-primary">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600 text-sm"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                    Phone Number <span className="text-primary">*</span>
                                </label>
                                <div className="phone-input-container">
                                    <PhoneInput
                                        international
                                        defaultCountry="AU"
                                        countries={["AU", "US", "GB", "NZ", "CA"]}
                                        value={formData.phone}
                                        onChange={(value) => setFormData({ ...formData, phone: value || "" })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary outline-none transition-all placeholder:text-gray-600 [&_input]:bg-transparent [&_input]:outline-none [&_input]:text-white [&_input]:ml-2 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                    Business Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.business}
                                    onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600 text-sm"
                                    placeholder="Your Company Name"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                What solution are you looking for?
                            </label>
                            <select
                                value={formData.service}
                                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                            >
                                <option value="Full System (Ads + Voice + Automations)">Full System (Ads + Voice + Automations)</option>
                                <option value="EcoInk Voice (AI Call Handling & Qualification)">EcoInk Voice (AI Call Handling & Qualification)</option>
                                <option value="EcoInk Ads (High-Intent Google Ads)">EcoInk Ads (High-Intent Google Ads)</option>
                                <option value="Custom Automations & CRM Integration">Custom Automations & CRM Integration</option>
                                <option value="Other / General Enquiry">Other / General Enquiry</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                Tell us about your project or requirements
                            </label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600 text-sm resize-none"
                                placeholder="Describe what you want to automate or scale..."
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-xs flex items-center gap-2 font-medium bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" /> {error}
                            </p>
                        )}

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full h-13 text-base font-bold bg-primary text-black hover:bg-white hover:text-black transition-all rounded-xl shadow-[0_0_20px_rgba(127,255,0,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={18} />
                                        Submitting...
                                    </>
                                ) : (
                                    "Send Enquiry"
                                )}
                            </Button>
                            <p className="text-center text-[11px] text-gray-500 mt-3">
                                We respect your privacy. No spam — our team will get back to you within 24 hours.
                            </p>
                        </div>
                    </form>
                </div>

                {/* RIGHT: PROFESSIONAL VALUE & SOLUTIONS PANEL */}
                <div className="flex-1 bg-gradient-to-br from-gray-900/90 via-black to-[#080808] relative flex flex-col justify-between p-8 md:p-12 lg:p-16 overflow-hidden">
                    <div className="relative z-10">
                        <h4 className="text-2xl font-bold text-white mb-2">How EcoInk Helps You Scale</h4>
                        <p className="text-gray-400 text-sm mb-8">
                            We build end-to-end growth systems engineered specifically for high-performing service businesses.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <h5 className="text-white font-bold text-sm">EcoInk Voice AI</h5>
                                    <p className="text-gray-400 text-xs leading-relaxed mt-0.5">
                                        24/7 call handling, smart pre-qualification, and instant calendar booking so you never miss high-value jobs.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                                    <Target size={18} />
                                </div>
                                <div>
                                    <h5 className="text-white font-bold text-sm">EcoInk Ads</h5>
                                    <p className="text-gray-400 text-xs leading-relaxed mt-0.5">
                                        Precision Google Ads targeting high-intent searches. Monitored continuously to eliminate wasted budget.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                                    <Zap size={18} />
                                </div>
                                <div>
                                    <h5 className="text-white font-bold text-sm">Smart Automations</h5>
                                    <p className="text-gray-400 text-xs leading-relaxed mt-0.5">
                                        Automate your CRM workflows (ServiceM8, HubSpot, GHL, Zapier) and eliminate manual handoffs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-8 mt-8 border-t border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                                <Mail size={16} />
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-500 uppercase font-semibold">Direct Contact</p>
                                <p className="text-sm font-medium text-white">james@ecoinkdigital.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reusable Clean Status Modal */}
            <SubmissionStatusModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                emailStatus={emailStatus}
                title="Inquiry Received"
                description="Thank you! We've received your request and will get back to you shortly."
            />
        </div>
    );
};

export default EnquiryForm;
