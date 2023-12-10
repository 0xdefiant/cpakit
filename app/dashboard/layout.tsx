import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import config from "@/config";
import { ModeToggle } from "@/components/modeToggle";
import SideNavbar from "@/components/SideNavbar";

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
      <SideNavbar />
      <div className="flex-1">
        <div className="flex justify-center w-full px-4 py-2">
          <ModeToggle />
        </div>
        <div className="max-w-2xl mx-auto p-4 md:pl-64">
          {children}
        </div>
      </div>
    </div>
  );
}