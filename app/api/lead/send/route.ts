import { EmailTemplate } from '@/components/Email-Template';
import { Resend } from 'resend';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const data = await resend.emails.send({
      from: 'Cpa Kit Team <anthony@cpakit.org>',
      to: [body.email],
      subject: 'Welcome to CPA Kit, we are glad that you are able to ',
      react: EmailTemplate({ firstName: "Anthony" }) as React.ReactElement,
    });

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error });
  }
}
