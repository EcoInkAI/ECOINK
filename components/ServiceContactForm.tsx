"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, CheckCircle, Upload } from "lucide-react";

import SubmissionStatusModal, { EmailStatus } from "./SubmissionStatusModal";

export default function ServiceContactForm({ defaultService = "General Enquiry" }: { defaultService?: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        postcode: "",
        installationType: defaultService,
        message: "",
        attachment: null as File | null
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: `Service Enquiry: ${formData.installationType}`,
                    message: `Postcode: ${formData.postcode}\nInstallation Type: ${formData.installationType}\nDetails: ${formData.message}`.trim(),
                }),
            });

            if (!res.ok) throw new Error("Failed to send enquiry.");

            const data = await res.json();
            setEmailStatus(data.emailStatus || null);
            setShowModal(true);
            setIsSubmitted(true);
        } catch (err: any) {
            console.error("Submission error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <>
                <Card className="border-0 shadow-lg bg-orange-50/50">
                    <CardContent className="pt-6 flex flex-col items-center text-center py-12">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Enquiry Sent!</h3>
                        <p className="text-gray-600 mb-6">We'll be in touch shortly to discuss your custom project.</p>
                        <Button
                            variant="outline"
                            onClick={() => setIsSubmitted(false)}
                            className="border-orange-200 text-orange-600 hover:bg-orange-50"
                        >
                            Send Another Enquiry
                        </Button>
                    </CardContent>
                </Card>
                <SubmissionStatusModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    emailStatus={emailStatus}
                    title="Service Enquiry Received"
                    description="Your request has been submitted successfully."
                />
            </>
        );
    }

    return (
        <Card className="border border-orange-100 shadow-xl overflow-hidden sticky top-32 p-0 gap-0">
            <CardHeader className="bg-orange-500 text-white p-6">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    Get A Free Quote
                </CardTitle>
                <p className="text-orange-100 text-sm mt-1">
                    Expert design & installation across Melbourne
                </p>
            </CardHeader>
            <CardContent className="p-6 bg-white space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Your Name</label>
                        <Input
                            placeholder="Full Name"
                            required
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                        <Input
                            type="email"
                            placeholder="email@example.com"
                            required
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                            <Input
                                type="tel"
                                placeholder="0400..."
                                required
                                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Postcode</label>
                            <Input
                                placeholder="3000"
                                required
                                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                value={formData.postcode}
                                onChange={e => setFormData({ ...formData, postcode: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Service Type</label>
                        <select
                            className="w-full h-10 px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-colors"
                            value={formData.installationType}
                            onChange={e => setFormData({ ...formData, installationType: e.target.value })}
                        >
                            <option value="Cut & Edge Service">Cut & Edge Service</option>
                            <option value="TV Cabinets">TV Cabinets & Entertainment</option>
                            <option value="Kitchen Cabinets">Kitchen Renovations</option>
                            <option value="Bathroom Vanities">Bathroom Vanities</option>
                            <option value="Laundry Cabinets">Laundry Renovations</option>
                            <option value="Wardrobes">Custom Wardrobes</option>
                            <option value="Custom Furniture">Custom Furniture</option>
                            <option value="Other">Other Joinery</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Project Details</label>
                        <Textarea
                            placeholder="Tell us about your project requirements..."
                            className="bg-gray-50 border-gray-200 min-h-[100px] focus:bg-white transition-colors"
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Attachment (Optional)</label>
                        <div className="relative">
                            <Input
                                type="file"
                                accept="image/*,.pdf"
                                className="pl-10 cursor-pointer bg-gray-50 border-gray-200 file:text-orange-600 file:font-semibold file:border-0 file:bg-transparent file:mr-4 file:py-1"
                                onChange={e => setFormData({ ...formData, attachment: e.target.files ? e.target.files[0] : null })}
                            />
                            <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <p className="text-[10px] text-gray-400">Supported: Images, PDF. Max 5MB.</p>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 text-sm uppercase tracking-widest shadow-lg shadow-orange-500/20"
                    >
                        {isSubmitting ? "Sending..." : "Enquire Now"}
                    </Button>

                    <p className="text-[10px] text-gray-400 text-center pt-2">
                        We typically respond within 24 hours.
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
