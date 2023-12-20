import { ReactNode } from "react";
import { Inter as FontSans } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { Viewport } from "next";
import PlausibleProvider from "next-plausible";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "next-themes";
import "./globals.css";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

import { cn } from "@/libs/utils";

interface RootLayoutProps {
  children: ReactNode;
}

export const viewport: Viewport = {
  // Will use the primary color of your theme to show a nice theme color in the URL bar of supported browsers
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

// This adds default SEO tags to all pages in our app.
// You can override them in each page passing params to getSOTags() function.
export const metadata = getSEOTags();


export default function RootLayout({ children }: RootLayoutProps ) {
  return (
    <html lang="en" suppressHydrationWarning>
      {config.domainName && (
        <head>
          <script
            defer
            data-domain="cpakit.org"
            data-api="/plausible/api/event"
            src="/plausible/js/script.js"
          ></script>
        </head>
      )}
      <body
        className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        {/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
        <ClientLayout>{children}</ClientLayout>
      </ThemeProvider>
      </body>
    </html>
  );
}
