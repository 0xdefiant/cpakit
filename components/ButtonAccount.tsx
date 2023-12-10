"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import apiClient from "@/libs/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  Loader,
  ChevronDown,
  UserPlus,
  Users,
} from "lucide-react"


const ButtonAccount = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false); // Define the open variable


  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleBilling = async () => {
    setIsLoading(true);
    try {
      const { url }: { url: string } = await apiClient.post(
        "/stripe/create-portal",
        {
          returnUrl: window.location.href,
        }
      );
      window.location.href = url;
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  if (status === "unauthenticated") return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="flex items-center">
            {session?.user?.image ? (
              <Avatar className="mr-2">
                <AvatarImage
                  src={session?.user?.image}
                  alt={session?.user?.name || "Account"}
                />
                <AvatarFallback>{session.user?.name || "Account"}</AvatarFallback>
              </Avatar>
            ) : (
              <User className="text-xl font-semibold tracking-tight" />
            )}

            {session?.user?.name || "Account"}

            {isLoading ? (
              <Loader className="loading-xs" />
            ) : (
              <ChevronDown className={`w-5 h-5 duration-200 opacity-50 ${open ? "rotate-180" : ""}`} />
            )}
          </Button>
          </PopoverTrigger>
            <PopoverContent className="w-60">
              <div className="overflow-hidden rounded-xl shadow-xl p-1">
                <div className="space-y-0.5 text-sm">
                  <button
                    className="flex items-center hover:bg-base-300 duration-200 py-1.5 px-4 w-full rounded-lg font-medium"
                    onClick={handleBilling}
                  >
                  <CreditCard className="mr-2 h-4 w-4"/>
                    <span>Billing</span>
                  </button>
                  <button
                    className="flex items-center hover:bg-base-300 duration-200 py-1.5 px-4 w-full rounded-lg font-medium"
                    onClick={handleSignOut}
                  >
                  <LogOut className="mr-2 h-4 w-4"></LogOut>
                  <span>Logout</span>
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
    );
};

export default ButtonAccount;
