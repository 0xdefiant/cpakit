import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR TERMS & SERVICES — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple Terms & Services for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Contact information: marc@shipfa.st
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - Ownership: when buying a package, users can download code to create apps. They own the code but they do not have the right to resell it. They can ask for a full refund within 7 day after the purchase.
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Link to privacy-policy: https://shipfa.st/privacy-policy
// - Governing Law: France
// - Updates to the Terms: users will be updated by email

// Please write a simple Terms & Services for my site. Add the current date. Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: "/tos",
});

const TOS = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: September 26, 2023

Terms of Service for CPA Study Kit

Effective Date: November 13, 2023

1. Introduction
Welcome to CPA Study Kit, accessible at https://cpastudy.online. These Terms of Service govern your use of our online AI CPA Study Toolkit and are legally binding. By using our website and services, you agree to these Terms.

2. Services Description
CPA Study Kit provides users with course plans and self-guided software designed to assist with CPA studies. Our services are subject to the terms and conditions stated herein.

3. Purchase and Refund Policy
Upon purchasing a package, users gain access to our course materials and software. A full refund can be requested within 7 days of purchase if not satisfied.

4. User Data Collection
We collect personal information such as names, email addresses, and payment information for service provision and communication.

5. Non-Personal Data Collection
Our website uses cookies to improve user experience. Details about cookie usage are available in our Privacy Policy at https://cpastudy.online/privacy-policy.

6. User Obligations
Users agree to provide accurate, current, and complete information as prompted by our service's registration forms. Misuse or unauthorized use of our services is strictly prohibited.

7. Intellectual Property
All content and services provided on CPA Study Kit are the property of CPA Study Kit and are protected by copyright and other intellectual property laws. Users are granted a license to use our services as per these Terms.

8. Governing Law
These Terms are governed by the laws of the United States.

9. Changes to Terms
CPA Study Kit reserves the right to modify these Terms at any time. Users will be notified of any changes via email. Continued use of the service after such changes constitutes acceptance of the new Terms.

10. Contact Information
For any questions or inquiries regarding these Terms, please contact us at anthony@mail.cpastudy.online.

11. Acknowledgment
By using CPA Study Kit, users acknowledge that they have read, understood, and agree to be bound by these Terms.`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
