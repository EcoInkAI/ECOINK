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

        let emailStatus = {
            delivered: false,
            recipient: "james@ecoinkdigital.com",
            error: null as string | null
        };

        // Send Email via Resend if configured
        if (resend) {
            try {
                // Fetch admin contact email from settings or environment
                const settings = await prisma.globalSettings.findFirst({ where: { id: 1 } });
                const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || settings?.contactEmail || "james@ecoinkdigital.com";
                const fromEmail = process.env.RESEND_FROM_EMAIL || 'EcoInk <onboarding@resend.dev>';
                emailStatus.recipient = adminEmail;

                console.log("📨 Attempting to send email notification...");
                console.log(`📍 From: ${fromEmail}`);
                console.log(`📍 Recipient: ${adminEmail}`);

                const emailSubject = subject ? `New Contact Form: ${subject}` : `New Lead from ${name}`;
                
                const response = await resend.emails.send({
                    from: fromEmail,
                    to: adminEmail,
                    subject: emailSubject,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
                            <h2 style="color: #10b981; margin-top: 0;">New EcoInk Lead Received</h2>
                            <p><strong>Name:</strong> ${name || 'N/A'}</p>
                            <p><strong>Email:</strong> ${email || 'N/A'}</p>
                            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                            ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                            <p><strong>Message / Details:</strong></p>
                            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; white-space: pre-wrap; font-family: monospace;">
${message || 'No additional message provided.'}
                            </div>
                            <p style="font-size: 11px; color: #888; margin-top: 25px;">Sent from EcoInk Web Portal</p>
                        </div>
                    `,
                });

                if (response.error) {
                    console.error("❌ Resend API returned error:", response.error);
                    emailStatus.delivered = false;
                    emailStatus.error = response.error.message || JSON.stringify(response.error);
                } else {
                    console.log("✅ Email sent successfully:", response);
                    emailStatus.delivered = true;
                }
            } catch (err: any) {
                console.error("❌ Failed to send email notification:", err);
                emailStatus.delivered = false;
                emailStatus.error = err.message || "Unknown error occurred while sending email via Resend.";
            }
        } else {
            console.warn("⚠️ Resend is not configured (missing API key). Skipping email notification.");
            emailStatus.delivered = false;
            emailStatus.error = "Resend API key is not configured in server environment (RESEND_API_KEY).";
        }

        return res.status(201).json({
            ...data,
            emailStatus
        });
    }

    return res.status(405).end();
}
