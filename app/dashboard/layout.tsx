import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import config from "@/config";
import { ModeToggle } from "@/components/modeToggle";
import ButtonAccount from '@/components/ButtonAccount';
import AppNavbar from "@/components/AppNavbar";

export default async function LayoutPrivate({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(config.auth.loginUrl);
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
      <header className="bg-base-200 relative">
        <div className="container mx-auto px-4 py-4 gradient-navbar-border">
          <nav className="flex items-center justify-between" aria-label="Global">
            <AppNavbar />
          </nav>
        </div>
      </header>
        <div className="max-w-2xl mx-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}