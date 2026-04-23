import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { resend } from '../../../lib/resend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const data = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
        return res.status(200).json(data);
    }

    if (req.method === 'POST') {
        const { name, email, phone, subject, message } = req.body;
        console.log("📥 New form submission received:", { name, email, phone, subject });
        
        // Save to Database
        const data = await prisma.contactMessage.create({
            data: { name, email, phone, subject, message }
        });

        // Send Email via Resend if configured
        if (resend) {
            try {
                // Fetch admin contact email from settings
                const settings = await prisma.globalSettings.findFirst({ where: { id: 1 } });
                const adminEmail = settings?.contactEmail || "james@ecoinkdigital.com"; // Updated fallback address

                console.log("📨 Attempting to send email notification...");
                console.log(`📍 Recipient: ${adminEmail}`);

                const emailSubject = subject ? `New Contact Form: ${subject}` : `New Lead from ${name}`;
                
                const response = await resend.emails.send({
                    from: 'EcoInk <onboarding@resend.dev>', // Resend standard sender
                    to: adminEmail,
                    subject: emailSubject,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #6366f1;">New Lead Received</h2>
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                            ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                            <p><strong>Message:</strong></p>
                            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px;">
                                ${message}
                            </div>
                        </div>
                    `,
                });

                console.log("✅ Email sent successfully:", response);
            } catch (err) {
                console.error("❌ Failed to send email notification:", err);
            }
        } else {
            console.warn("⚠️ Resend is not configured (missing API key). Skipping email notification.");
        }

        return res.status(201).json(data);
    }

    return res.status(405).end();
}
