import { useState, FormEvent } from "react";
import { Loader2, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ContactFormData, ContactFormErrors } from "@/types";

import SubmissionStatusModal, { EmailStatus } from "./SubmissionStatusModal";

export default function ContactForm() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [errors, setErrors] = useState<ContactFormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
    const [showModal, setShowModal] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: ContactFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[\d\s\-+()]{8,}$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "Message must be at least 10 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: "General Contact Inquiry",
                    message: formData.message,
                }),
            });

            if (!res.ok) throw new Error("Failed to send message.");

            const data = await res.json();
            setEmailStatus(data.emailStatus || null);
            setShowModal(true);
            setIsSuccess(true);
            setFormData({ name: "", email: "", phone: "", message: "" });
        } catch (err: any) {
            setErrors({ message: err.message || "Failed to send message. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof ContactFormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    if (isSuccess) {
        return (
            <>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-12 text-center shadow-lg border border-green-200">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 mb-4">
                        Message Sent Successfully!
                    </h3>
                    <p className="text-green-700 mb-6">
                        Thank you for contacting EcoInk. We'll get back to you within 24 hours.
                    </p>
                    <Button
                        onClick={() => setIsSuccess(false)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        Send Another Message
                    </Button>
                </div>
                <SubmissionStatusModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    emailStatus={emailStatus}
                    title="Message Sent"
                    description="Thank you for reaching out to EcoInk."
                />
            </>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
                    Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={handleChange}
                    className={`h-12 bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                />
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                    Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`h-12 bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-900">
                    Phone Number <span className="text-red-500">*</span>
                </label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="0412 345 678"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`h-12 bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl ${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                />
                {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
            </div>

            {/* Message Field */}
            <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-900">
                    Your Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your project..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl resize-none ${errors.message ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        }`}
                />
                {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                    </>
                ) : (
                    <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                    </>
                )}
            </Button>

            {/* Privacy Note */}
            <p className="text-sm text-gray-500 text-center">
                By submitting this form, you agree to our privacy policy. We'll never share your information.
            </p>
        </form>
    );
}
