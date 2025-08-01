"use client"

import React, { useState } from 'react';
import { cn } from '@/libs/utils';
import Link from 'next/link'; // How can I use link and server side rnedering to make moving between navigation items quicker???
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Skeleton } from './ui/skeleton';
import { ModeToggle } from './modeToggle';
import { ProfileSettings } from './ProfileSettings';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Pyramid } from 'lucide-react';
import { WalletInput } from './WalletResources';
import { useSession, signOut } from 'next-auth/react';
import { boolean } from 'zod';
import apiClient from '@/libs/api';
import { ChevronDown, User, Loader, CreditCard, LogOut } from 'lucide-react';

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { href: string }
>(({ className, title, href, children, ...props }, ref) => {
  return (
    <li>
      {/* Wrap the anchor tag with Link */}
      <Link href={href} passHref>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </Link>
    </li>
  )
})
ListItem.displayName = "ListItem"

const NavbarSkeleton = () => (
  <div className="flex justify-between items-start w-full">
    {/* Mimic the structure of the navigation menu */}
    <div className="flex">
      <Skeleton className="w-[40px] h-[40px] rounded-full mr-2"></Skeleton>
      <Skeleton className="w-[200px] h-[20px] rounded-full mt-2"></Skeleton>
    </div>

    <div className="flex align-right">
      <Skeleton className="w-[80px] h-[30px]"></Skeleton>
    </div>
  </div>
);

const AppNavbar = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  if (status === "loading") return <NavbarSkeleton />;
  if (status === "unauthenticated") return null;


  return (
    <div className='flex justify-between items-start w-full'>
    <NavigationMenu>
      <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>
        <button className="flex items-center">
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
          </button>
        </NavigationMenuTrigger>
          <NavigationMenuContent>
          <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
            <li>
            <button
              className="flex items-center hover:bg-base-300 duration-200 py-1.5 px-4 w-full rounded-lg font-medium"
              onClick={handleBilling}
            >
            <CreditCard className="mr-2 h-4 w-4"/>
              <span>Billing</span>
            </button>
            </li>
            <li>
              <button
                className="flex items-center hover:bg-base-300 duration-200 py-1.5 px-4 w-full rounded-lg font-medium"
                onClick={handleSignOut}
              >
              <LogOut className="mr-2 h-4 w-4"></LogOut>
              <span>Logout</span>
              </button>
            </li>
            <li>
              <ProfileSettings />
            </li>
          </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/dashboard"
                  >
                    <Pyramid />
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Dashboard
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Beautifully designed dashboard and financial statement generations.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/dashboard/nfts" title="NFTs">
                Track your nfts.
              </ListItem>
              <ListItem href="/dashboard/tokens" title="Tokens">
                Track your tokens. 
              </ListItem>
              <ListItem href="/dashboard/txs" title="Transactions">
                Tracking for all token and nft transactions.
              </ListItem>
              <ListItem href="/dashboard/advisory" title="Advisory">
                Ask for ChatGPT&lsquo;s advice from all angles.
              </ListItem>
              <ListItem href="/dashboard/consolidation" title="Consolidate">
                Put Together Financials.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
    <div className='flex align-right'>
      <WalletInput />
    </div>
    </div>
  );
};


export default AppNavbar;
