import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { getSession } from 'next-auth/react';
import { SendVerificationRequestParams } from 'next-auth/providers';
import { Resend } from "resend";
import config from "@/config";
import nodemailer from 'nodemailer';

const resend = new Resend(process.env.RESEND)
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function withAuth(getServerSidePropsFunc: (context: any, session: any) => any) {
  return async (context: any) => {
    const session = await getSession(context);

    if (!session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return getServerSidePropsFunc ? getServerSidePropsFunc(context, session) : { props: { session } };
  };
}

export const sendVerificationRequest = async (
  params: SendVerificationRequestParams,
) => {
  const { identifier: email, url } = params;

  // Email content
  const subject = 'Sign in to Cpa Kit';
  const text = `Sign in to Cpa Kit: ${url}`;
  const html = `<p>Click <a href="${url}">here</a> to sign in to Cpa Kit.</p>`;
  console.log("URL: ", url)
  console.log("Email: ", email)

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