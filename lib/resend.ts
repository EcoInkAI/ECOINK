import { Resend } from 'resend';

const resendSecret = process.env.RESEND_API_Key;

if (!resendSecret) {
    console.warn("RESEND_API_Key is not defined in the environment variables.");
}

export const resend = resendSecret ? new Resend(resendSecret) : null;
