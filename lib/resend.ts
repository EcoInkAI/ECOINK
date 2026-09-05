import { Resend } from 'resend';

const resendSecret = process.env.RESEND_API_KEY || process.env.RESEND_API_Key || process.env.RESEND_KEY;

if (!resendSecret) {
    console.warn("RESEND_API_KEY is not defined in the environment variables.");
}

export const resend = resendSecret ? new Resend(resendSecret) : null;
