import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Order processing
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: marc@shipfa.st

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
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
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Privacy Policy for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: 2023-11-13

Thank you for visiting CPA Study Kit ("we," "us," or "our"). This Privacy Policy outlines how we collect, use, and protect your personal and non-personal information when you use our website located at https://cpastudy.online (the "Website").

Privacy Policy for CPA Study Kit

Effective Date: November 13, 2023

1. Introduction
This Privacy Policy applies to https://cpastudy.online, owned and operated by CPA Study Kit. This policy describes how we collect, use, protect, and share information gathered about our users.

2. Information Collection
We collect the following personal information:

Name
Email Address
Payment Information
This information is collected for order processing and service provision.

3. Non-Personal Data Collection
We also collect non-personal information through web cookies to enhance user experience on our website.

4. Purpose of Data Collection
The data collected is used exclusively for processing orders and providing our AI CPA exam study tool services to our users.

5. Data Sharing
We respect your privacy and do not share your personal data with any third parties.

6. Children’s Privacy
Our services are not intended for children, and we do not knowingly collect any personal information from children.

7. Security
We take reasonable steps to protect the information provided from loss, misuse, unauthorized access, disclosure, alteration, or destruction.

8. Changes to This Privacy Policy
We may update this Privacy Policy from time to time. Users will be notified of any changes via email.

9. Contact Us
If you have any questions about this Privacy Policy, please contact us at anthony@mail.cpastudy.online.

10. Acknowledgment
By using our website and services, users acknowledge that they have read and agree to this Privacy Policy.

`}
        </pre>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
