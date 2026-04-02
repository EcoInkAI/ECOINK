import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Phone, Mic, Video, Volume2, ArrowRight, X, PhoneForwarded, MicOff } from "lucide-react";
import { motion } from "framer-motion";
import { useBooking } from "@/lib/BookingContext";
import Image from "next/image";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import AnimatedOrb from "./AnimatedOrb";

const EnquiryForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        business: "",
        industry: "",
    });
    const { openBookingModal } = useBooking();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.firstName || !formData.email || !formData.phone) {
            setError("Please fill in all required fields.");
            return;
        }

        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsSuccess(true);
    };

    if (isSuccess) {
        return (
            <div className="glass-card p-12 rounded-3xl border border-primary/20 text-center flex flex-col items-center justify-center min-h-[500px] w-full max-w-5xl mx-auto">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                    <CheckCircle size={40} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">You're on the list!</h3>
                <p className="text-gray-400 mb-8 max-w-lg text-lg">
                    Thanks {formData.firstName}. Ivy from EcoInk will check your details and give you a call at {formData.phone} shortly.
                    <br /><span className="text-sm opacity-60 mt-2 block">(Yes, she's an AI, but she's very polite.)</span>
                </p>
                <Button onClick={openBookingModal} variant="outline" size="lg">
                    Book another call
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="glass-card rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden flex flex-col lg:flex-row relative shadow-2xl">
                {/* Decorative Background Blob */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none z-0" />

                {/* LEFT: FORM SECTION */}
                <div className="flex-1 p-8 md:p-12 lg:p-16 relative z-10 flex flex-col justify-center border-r border-white/5">
                    <div className="mb-10">
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Receive a phone call from <span className="text-primary text-gradient">Ivy</span>
                        </h3>
                        <p className="text-gray-400 text-lg">
                            Experience the speed of EcoInk Voice firsthand. Enter your details and our AI agent will call you within 60 seconds.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">First Name <span className="text-primary">*</span></label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                                    placeholder="Enter your first name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Last Name</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                                    placeholder="Enter your last name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Email <span className="text-primary">*</span></label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                                    placeholder="you@company.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Phone Number <span className="text-primary">*</span></label>
                                <div className="phone-input-container">
                                    <PhoneInput
                                        international
                                        defaultCountry="AU"
                                        countries={["AU", "US", "GB"]}
                                        value={formData.phone}
                                        onChange={(value) => setFormData({ ...formData, phone: value || "" })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary outline-none transition-all placeholder:text-gray-600 [&_input]:bg-transparent [&_input]:outline-none [&_input]:text-white [&_input]:ml-2"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Business Name</label>
                            <input
                                type="text"
                                value={formData.business}
                                onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                                placeholder="Where do you work?"
                            />
                        </div>

                        {error && <p className="text-red-400 text-sm flex items-center gap-2 font-medium bg-red-400/10 p-3 rounded-lg"><div className="w-1.5 h-1.5 bg-red-400 rounded-full" /> {error}</p>}

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full h-14 text-lg font-bold bg-primary text-black hover:bg-white hover:text-black transition-all rounded-xl shadow-[0_0_20px_rgba(127,255,0,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" />
                                        Connecting to Ivy...
                                    </>
                                ) : (
                                    "Get Ivy to Call Me"
                                )}
                            </Button>
                            <p className="text-center text-xs text-gray-500 mt-4">
                                Experience 24/7 AI availability in under 60 seconds.
                            </p>
                        </div>
                    </form>
                </div>

                {/* RIGHT: PREMIUM CALL INTERFACE SECTION */}
                <div className="flex-1 bg-gradient-to-br from-gray-900 to-black relative flex items-center justify-center min-h-[600px] lg:min-h-auto p-12 overflow-hidden">
                    {/* Background Texture/Accents */}
                    <div className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: "radial-gradient(circle at 50% 50%, #7FFF00 0.5px, transparent 1px)",
                            backgroundSize: "24px 24px"
                        }}
                    />

                    {/* Premium Mobile Phone Mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative z-10 w-[320px] h-[640px] bg-[#050505] rounded-[3rem] border-[8px] border-[#151515] shadow-[0_0_80px_rgba(0,0,0,1),inset_0_0_20px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col"
                    >
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#151515] rounded-b-2xl z-30" />

                        {/* Top Content */}
                        <div className="pt-12 text-center relative z-20">
                            <p className="text-accent text-[10px] font-bold tracking-[4px] uppercase mb-1">EcoInk Voice AI</p>
                            <div className="flex items-center justify-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-white/60 text-[9px] font-medium tracking-wider">SECURE CONNECTION LIVE</span>
                            </div>
                        </div>

                        {/* Middle: The Animated Orb (Replacing the Girl) */}
                        <div className="flex-1 relative flex items-center justify-center mt-[-20px]">
                            <div className="w-full h-[300px] scale-75">
                                <AnimatedOrb />
                            </div>
                        </div>

                        {/* Bottom: Information & Controls */}
                        <div className="px-8 pb-10 relative z-20 text-center">
                            <h4 className="text-2xl font-bold text-white mb-1">Ivy</h4>
                            <p className="text-white/40 text-xs font-medium mb-10 tracking-widest uppercase">EcoInk Senior Agent</p>

                            {/* Control Grid (Mute, Transfer, etc) */}
                            <div className="grid grid-cols-2 gap-4 mb-10">
                                {[
                                    { icon: Volume2, label: "Audio" },
                                    { icon: Video, label: "Video" },
                                    { icon: MicOff, label: "Mute" },
                                    { icon: PhoneForwarded, label: "Transfer" }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-1.5">
                                        <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:bg-white/10 transition-colors cursor-pointer ring-1 ring-white/5">
                                            <item.icon size={20} />
                                        </div>
                                        <span className="text-[10px] text-white/40 font-medium">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Call Buttons */}
                            <div className="flex justify-between items-center px-4">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/20 active:scale-90 transition-transform cursor-pointer">
                                        <X size={28} />
                                    </div>
                                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Decline</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20 active:scale-90 transition-transform cursor-pointer">
                                        <Phone size={28} />
                                    </div>
                                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Accept</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Ambient Light Refraction */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export default EnquiryForm;
