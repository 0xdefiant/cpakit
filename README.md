# CPA Kit 🧮

> **AI-Powered Web3 Financial Reporting & Tax Assistant**

CPA Kit is a comprehensive financial reporting platform designed specifically for Web3 transactions, cryptocurrency accounting, and tax preparation. Built with modern web technologies and AI integration, it helps users generate professional financial statements, manage crypto transactions, and navigate complex tax requirements.

![CPA Kit Dashboard](https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

## ✨ Features

### 🤖 AI-Powered Tools
- **Tax AI Assistant** - Get instant answers to tax-related questions
- **CPA Exam AI Model** - Study assistance for accounting professionals
- **AI Auditor** - Automated financial statement review
- **Smart Document Generation** - AI-powered financial statement creation

### 📊 Financial Dashboard
- **Transaction Tracking** - Monitor crypto transactions across multiple wallets
- **NFT Portfolio Management** - Track and value NFT collections
- **Token Analytics** - Real-time price tracking and portfolio analysis
- **Financial Statement Templates** - Professional reporting formats

### 🧾 Tax & Compliance
- **Form 8949 Generation** - Automated crypto tax form creation
- **Form 1040 Schedule D** - Capital gains and losses reporting
- **Tax Question Templates** - Pre-built queries for common scenarios
- **Compliance Monitoring** - Stay updated with tax regulations

### 💼 Professional Features
- **Multi-Wallet Support** - Connect and manage multiple blockchain wallets
- **Real-time Price Data** - Live cryptocurrency pricing via CoinGecko API
- **Export Capabilities** - PDF generation for professional reports
- **User Authentication** - Secure account management with NextAuth

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **DaisyUI** - Component library for Tailwind

### Backend & APIs
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database with Mongoose ODM
- **NextAuth.js** - Authentication system
- **OpenAI API** - AI-powered features
- **Stripe** - Payment processing

### Blockchain & Crypto
- **Alchemy SDK** - Ethereum blockchain integration
- **Ethers.js** - Ethereum library
- **CoinGecko API** - Cryptocurrency price data
- **BigNumber.js** - Precise number handling

### Additional Tools
- **Chart.js** - Data visualization
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **SWR** - Data fetching
- **Vercel** - Deployment platform

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- MongoDB database
- OpenAI API key
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cpakit.git
   cd cpakit
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   OPENAI_API_KEY=your_openai_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Dashboard Overview
- **Transactions** - View and manage crypto transactions
- **Tokens** - Track token holdings and performance
- **NFTs** - Monitor NFT portfolio and valuations
- **Advisory** - Access AI-powered financial advice

### AI Assistant
1. Navigate to the Tax Assistant section
2. Ask questions about crypto taxes, accounting, or compliance
3. Receive instant AI-powered responses
4. Save conversations for future reference

### Financial Reports
1. Connect your wallet or import transaction data
2. Select report type (Form 8949, Schedule D, etc.)
3. Generate professional PDF reports
4. Download and share with stakeholders

## 🔧 Configuration

The application uses a centralized configuration system in `config.ts`:

- **App Settings** - Name, description, domain
- **Stripe Plans** - Subscription tiers and pricing
- **Email Configuration** - Mailgun/Resend settings
- **Theme Customization** - DaisyUI theme options
- **Authentication** - NextAuth configuration

## 📦 Project Structure

```
cpakit/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard pages
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── *.tsx             # Feature components
├── libs/                  # Utility libraries
├── models/                # MongoDB schemas
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email**: anthony@cpakit.org
- **Documentation**: [cpakit.org](https://cpakit.org)
- **Issues**: [GitHub Issues](https://github.com/yourusername/cpakit/issues)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- AI powered by [OpenAI](https://openai.com/)
- Cryptocurrency data from [CoinGecko](https://coingecko.com/)

---

**Made with ❤️ for the Web3 community**


