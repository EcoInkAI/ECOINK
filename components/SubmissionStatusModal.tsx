import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, X, Mail, Server } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EmailStatus {
    delivered: boolean;
    recipient?: string;
    error?: string | null;
}

interface SubmissionStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    emailStatus: EmailStatus | null;
    title?: string;
    description?: string;
}

export default function SubmissionStatusModal({
    isOpen,
    onClose,
    emailStatus,
    title = "Submission Received",
    description = "Thank you! We've received your request."
}: SubmissionStatusModalProps) {
    if (!isOpen) return null;

    const isDelivered = emailStatus?.delivered === true;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                    className="relative w-full max-w-lg bg-[#0d0d0d] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden text-left"
                >
                    {/* Ambient glow accent */}
                    <div
                        className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[70px] pointer-events-none opacity-40 ${
                            isDelivered ? "bg-[#7FFF00]" : "bg-amber-500"
                        }`}
                    />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>

                    {/* Icon & Title */}
                    <div className="flex items-center gap-4 mb-5">
                        <div
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                                isDelivered
                                    ? "bg-[#7FFF00]/15 text-[#7FFF00] border border-[#7FFF00]/30 shadow-[0_0_20px_rgba(127,255,0,0.2)]"
                                    : "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                            }`}
                        >
                            {isDelivered ? <CheckCircle2 size={30} /> : <AlertTriangle size={30} />}
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h3>
                            <p className="text-xs sm:text-sm text-gray-400">{description}</p>
                        </div>
                    </div>

                    {/* Database & Email Status Cards */}
                    <div className="space-y-3 my-6">
                        {/* Database Status Card */}
                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
                                <Server size={16} />
                            </div>
                            <div className="text-xs sm:text-sm">
                                <span className="font-semibold text-white">Database Record: </span>
                                <span className="text-green-400 font-medium">Saved Successfully</span>
                            </div>
                        </div>

                        {/* Email Delivery Card */}
                        <div
                            className={`p-4 rounded-xl border ${
                                isDelivered
                                    ? "bg-emerald-950/20 border-emerald-500/30"
                                    : "bg-amber-950/20 border-amber-500/30"
                            }`}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <Mail
                                        size={16}
                                        className={isDelivered ? "text-emerald-400" : "text-amber-400"}
                                    />
                                    <span
                                        className={`text-xs sm:text-sm font-bold ${
                                            isDelivered ? "text-emerald-300" : "text-amber-300"
                                        }`}
                                    >
                                        {isDelivered ? "Email Delivered Successfully" : "Email Notification Failed"}
                                    </span>
                                </div>
                                <span
                                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                        isDelivered
                                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                    }`}
                                >
                                    {isDelivered ? "Delivered" : "Error"}
                                </span>
                            </div>

                            {isDelivered ? (
                                <p className="text-xs text-gray-300 mt-1">
                                    Notification dispatched to{" "}
                                    <span className="text-white font-mono font-medium">
                                        {emailStatus?.recipient || "james@ecoinkdigital.com"}
                                    </span>
                                </p>
                            ) : (
                                <div className="mt-2 space-y-1.5">
                                    <p className="text-xs text-gray-300">
                                        Recipient:{" "}
                                        <span className="text-white font-mono">
                                            {emailStatus?.recipient || "james@ecoinkdigital.com"}
                                        </span>
                                    </p>
                                    <div className="bg-black/60 border border-amber-500/20 rounded-lg p-2.5 mt-2">
                                        <p className="text-[11px] font-mono text-amber-300/90 break-words">
                                            <span className="font-bold text-amber-400">Error Detail: </span>
                                            {emailStatus?.error || "Unknown delivery error."}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer / Action */}
                    <div className="pt-2">
                        <Button
                            onClick={onClose}
                            className={`w-full h-12 font-bold text-sm rounded-xl transition-all ${
                                isDelivered
                                    ? "bg-[#7FFF00] hover:bg-[#6ee600] text-black shadow-[0_0_20px_rgba(127,255,0,0.25)]"
                                    : "bg-white/10 hover:bg-white/20 text-white"
                            }`}
                        >
                            Got It
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
