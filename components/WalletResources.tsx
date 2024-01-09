import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import apiClient from "@/libs/api";
import { getSession, useSession } from "next-auth/react";

import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Wallet, ArrowRightCircle as ArrowRightCircle } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getWallets } from "@/libs/getWallets";

const schema = z.object({
    wallet: z.string().refine((value) => value !== "", {
      message: "Invalid wallet input.",
    }),
  });

const WalletInput =  () => {
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();
    const [wallets, setWallets] = useState([]);
    const form = useForm({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const walletData = await getWallets();
                setWallets(walletData.props.wallets);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log("No wallets found for this user");
                    setWallets([]); // Clear the wallets array
                } else {
                    console.error("Error fetching wallets:", error);
                }
            }
        };
        if (session?.user?.id) {
            fetchWallets();
        }
    }, [session?.user?.id]);

    const handleAddWallet = async (data: any) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post("/wallet", { ...data, userId: session.user.id });
            console.log("API response: ", response);

            setWallets((prevWallets) => [...(prevWallets || []), response])
            
            form.reset();
            toast.success('Wallet added successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to add wallet');
        } finally {
            setIsLoading(false);

        }
    };

      return (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    className="flex items-center hover:bg-base-300 duration-200 py-1.5 px-4 w-full rounded-lg font-medium"
                >
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>Wallets</span>
                </button>
            </SheetTrigger>
            <SheetContent typeof="form">
                <SheetHeader>
                    <SheetTitle>Add or Copy Wallet Address</SheetTitle>
                    <SheetDescription>
                        Keep your Wallet Addresses in one place.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form
                        onSubmit={form.handleSubmit(handleAddWallet)}
                        className="flex flex-col space-y-3" 
                        >
                            <span className="font-semibold">wallet submit </span>
                            <div className="flex items-center space-x-2">
                                <FormField
                                    control={form.control}
                                    name="wallet"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="try and break me"
                                                    autoComplete="text"
                                                    className="input input-bordered w-full placeholder:opacity-60"
                                                    {...field}
                                                />
                                            </FormControl>
                                            {fieldState.error && (
                                                <FormMessage>{fieldState.error.message}</FormMessage>
                                            )}
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="btn btn-primary btn-block"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                        <>
                                            Add <Wallet className="inline-block ml-2" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <div>
                        {wallets.length > 0 ? (
                            wallets.map((walletObj, index) => (
                                <div key={index}>{walletObj.wallet}</div>
                            ))
                        ) : (
                            <div>No wallets found</div> // Display a message if no wallets are present
                        )}
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        Footer
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

    export { WalletInput }