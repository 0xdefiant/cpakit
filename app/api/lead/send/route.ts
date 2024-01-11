import { EmailTemplate } from '@/components/Email-Template';
import { Resend } from 'resend';
import * as React from 'react';
import connectMongo from '@/libs/mongoose';
import Lead from '@/models/Lead';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const data = await resend.emails.send({
      from: 'CPA KIT Team <anthony@cpakit.org>',
      to: [body.email],
      subject: 'Lowering the Cost to Consensus',
      react: EmailTemplate({ firstName: "Anthony" }) as React.ReactElement,
    });

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error });
  }
}
