import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const AdsAuditForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        business: "",
        email: "",
        phone: "",
        spend: "Not running ads yet"
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: "Ads Audit Request",
                    message: `Business: ${formData.business}\nAd Spend: ${formData.spend}`.trim(),
                }),
            });

            if (!res.ok) throw new Error("Failed to send audit request.");
            
            setIsSuccess(true);
        } catch (err: any) {
            console.error("Audit request error:", err);
            // Optional local error handling
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass-card p-8 rounded-2xl flex flex-col items-center text-center justify-center min-h-[500px]"
            >
                <h3 className="text-2xl font-bold text-white mb-4">Request Received</h3>
                <p className="text-gray-400">We'll be in touch shortly to review your ad setup.</p>
                <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-8">Close</Button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">Request My Free Audit</h3>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition-colors"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Business Name"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition-colors"
                    value={formData.business}
                    onChange={e => setFormData({ ...formData, business: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition-colors"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary transition-colors"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    required
                />

                <div>
                    <label className="block text-sm text-gray-400 mb-2">Monthly Ad Spend</label>
                    <select
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-primary"
                        value={formData.spend}
                        onChange={e => setFormData({ ...formData, spend: e.target.value })}
                    >
                        <option value="Not running ads yet" className="bg-black">Not running ads yet</option>
                        <option value="<$1k" className="bg-black">&lt;$1k</option>
                        <option value="$1k–$3k" className="bg-black">$1k–$3k</option>
                        <option value="$3k+" className="bg-black">$3k+</option>
                    </select>
                </div>

                <Button type="submit" className="w-full" variant="glow" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : "Request Audit"}
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4">
                    No lock-ins. No spam. We'll only reach out to review your setup.
                </p>
            </div>
        </form>
    );
};

export default AdsAuditForm;
