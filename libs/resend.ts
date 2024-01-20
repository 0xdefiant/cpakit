import { Resend } from 'resend';
import { SendVerificationRequestParams } from 'next-auth/providers';
import nodemailer from 'nodemailer';


const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendVerificationRequest = async (
    params: SendVerificationRequestParams,
  ) => {
    const { identifier: email, url, provider } = params;
  
    // Set up Nodemailer transport
    const transporter = nodemailer.createTransport({
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });
  
    // Email content
    const subject = 'Sign in to [Your App Name]';
    const text = `Sign in to [Your App Name]: ${url}`;
    const html = `<p>Click <a href="${url}">here</a> to sign in to [Your App Name].</p>`;
  
    // Send email
    try {
      await resend.emails.send({
        to: email,
        from: process.env.EMAIL_FROM,
        subject,
        text,
        html,
      });
    } catch (error) {
      console.error('sendVerificationRequest error:', error);
    }
  };