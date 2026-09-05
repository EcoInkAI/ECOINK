import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Send, Phone, Mail, User, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import SubmissionStatusModal, { EmailStatus } from "./SubmissionStatusModal";

const StandardContactForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        business: "",
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
            setError("Please fill in all required fields.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: "Standard Contact Enquiry",
                    message: `Business: ${formData.business}\nMessage: ${formData.message}`.trim(),
                }),
            });

            if (!res.ok) throw new Error("Failed to send enquiry.");
            
            const data = await res.json();
            setEmailStatus(data.emailStatus || null);
            setShowModal(true);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 rounded-3xl border border-primary/20 text-center flex flex-col items-center justify-center min-h-[400px] w-full"
                >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                        <CheckCircle size={40} />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Message Sent!</h3>
                    <p className="text-gray-400 mb-8 max-w-lg text-lg">
                        Thanks {formData.name}. We've received your enquiry and will get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setIsSuccess(false)} variant="outline" size="lg">
                        Send another message
                    </Button>
                </motion.div>
                <SubmissionStatusModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    emailStatus={emailStatus}
                    title="Contact Inquiry"
                    description="Thank you! We've received your enquiry."
                />
            </>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit} 
                className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden"
            >
                {/* Decorative Background Blob */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none z-0" />

                <div className="relative z-10 space-y-8">
                    <div className="text-center mb-10">
                        <h3 className="text-3xl font-bold text-white mb-4">Send us a message</h3>
                        <p className="text-gray-400">Tell us about your requirements and we'll get back to you shortly.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <User size={14} className="text-primary" /> Full Name <span className="text-primary">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Mail size={14} className="text-primary" /> Email Address <span className="text-primary">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                                placeholder="you@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Phone size={14} className="text-primary" /> Phone Number <span className="text-primary">*</span>
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                                placeholder="0400 000 000"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Building2 size={14} className="text-primary" /> Business Name
                            </label>
                            <input
                                type="text"
                                value={formData.business}
                                onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                                placeholder="Where do you work?"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Message / Requirements</label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600 resize-none"
                            placeholder="How can we help you?"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm font-medium bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}

                    <div className="pt-4">
                        <Button
                            type="submit"
                            variant="glow"
                            className="w-full h-14 text-lg font-bold transition-all rounded-xl"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={18} className="mr-2" />
                                    Send Enquiry
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.form>
        </div>
    );
};

export default StandardContactForm;
