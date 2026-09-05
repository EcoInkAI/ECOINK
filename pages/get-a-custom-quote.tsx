import Head from "next/head";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SubmissionStatusModal, { EmailStatus } from "@/components/SubmissionStatusModal";

export default function GetACustomQuote() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: `Custom Quote Request: ${formData.projectType || 'General'}`,
                    message: `Project Type: ${formData.projectType}\nDetails: ${formData.message}`.trim(),
                }),
            });

            if (!res.ok) throw new Error("Failed to send quote request.");

            const data = await res.json();
            setEmailStatus(data.emailStatus || null);
            setShowModal(true);
            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const projectTypes = [
        "Kitchen Cabinets",
        "Bathroom Cabinets",
        "Laundry Cabinets",
        "TV Cabinets",
        "Wardrobe",
        "Custom Furniture",
        "Other",
    ];

    return (
        <>
            <Head>
                <title>Get a Custom Quote | Free Consultation | Magri Cabinets Melbourne</title>
                <meta
                    name="description"
                    content="Request a free quote for your custom cabinet project. Contact Melbourne's trusted cabinet makers for kitchen cabinets, bathroom vanities, wardrobes and more."
                />
                <meta name="keywords" content="custom cabinet quote melbourne, free kitchen quote, cabinet maker consultation, melbourne joinery quote" />
                <link rel="canonical" href="https://magricabinets.com.au/get-a-custom-quote" />
            </Head>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-gray-600 to-gray-700 pt-8 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
                {/* Ambient Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gray-500/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full text-sm font-bold tracking-wide uppercase mb-6 backdrop-blur-sm">
                        Free Consultation
                    </div>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                        Get a <span className="text-orange-500">Custom Quote</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Tell us about your project and we&apos;ll provide a detailed, no-obligation quote.
                        Free consultation included.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                                Request Your <span className="text-orange-500">Free Quote</span>
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Fill out the form below and our team will get back to you within 24 hours
                                with a detailed quote for your project.
                            </p>

                            {isSubmitted ? (
                                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Thank You!
                                    </h3>
                                    <p className="text-gray-600">
                                        We&apos;ve received your quote request. Our team will contact you within 24 hours.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                            placeholder="John Smith"
                                        />
                                    </div>

                                    {/* Email & Phone */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                                placeholder="0400 000 000"
                                            />
                                        </div>
                                    </div>

                                    {/* Project Type */}
                                    <div>
                                        <label htmlFor="projectType" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Project Type *
                                        </label>
                                        <select
                                            id="projectType"
                                            name="projectType"
                                            value={formData.projectType}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
                                        >
                                            <option value="">Select a project type</option>
                                            {projectTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Project Details
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={5}
                                            className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all resize-none"
                                            placeholder="Tell us about your project, dimensions, style preferences, etc."
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 rounded-xl shadow-lg hover:shadow-orange-500/25 hover:shadow-xl transition-all duration-300 text-lg"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center">
                                                Get My Free Quote
                                                <Send className="ml-2 w-5 h-5" />
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                                Contact <span className="text-orange-500">Information</span>
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Prefer to talk? Give us a call or visit our showroom.
                                We&apos;re here to help with your project.
                            </p>

                            <div className="space-y-6">
                                {/* Phone */}
                                <a
                                    href="tel:0481132920"
                                    className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group"
                                >
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                                        <Phone className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Phone</h3>
                                        <p className="text-gray-600">0481 132 920</p>
                                    </div>
                                </a>

                                {/* Email */}
                                <a
                                    href="mailto:info@magricabinets.com.au"
                                    className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group"
                                >
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                                        <Mail className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Email</h3>
                                        <p className="text-gray-600">info@magricabinets.com.au</p>
                                    </div>
                                </a>

                                {/* Address */}
                                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Location</h3>
                                        <p className="text-gray-600">Melbourne, Victoria, Australia</p>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Business Hours</h3>
                                        <p className="text-gray-600">Mon - Fri: 8:00 AM - 5:00 PM</p>
                                        <p className="text-gray-600">Sat: By Appointment</p>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-10 p-6 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl">
                                <h3 className="text-white font-bold text-lg mb-4">Why Choose Us?</h3>
                                <div className="space-y-3">
                                    {[
                                        "30+ Years of Experience",
                                        "10-Year Warranty",
                                        "100% Custom Made",
                                        "Free Consultation",
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-orange-400" />
                                            <span className="text-gray-300">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <SubmissionStatusModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                emailStatus={emailStatus}
                title="Quote Request Received"
                description="We've received your custom quote request."
            />
        </>
    );
}
