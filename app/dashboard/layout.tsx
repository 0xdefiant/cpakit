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
        <div className="flex justify-between w-full px-4 py-2">
          <div className="flex justify-start">
          <AppNavbar />
          </div>
        </div>
        <div className="max-w-2xl mx-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}