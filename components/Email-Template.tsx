import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    firstName,
  }) => (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
    <h1 className="text-2xl font-semibold text-blue-600">Welcome!</h1>
    <h3>My name is {firstName},</h3>
    <p>I built this app to combine blockchains and accounting. This app is built to make your life easier. </p>
  </div>
);

export default EmailTemplate;