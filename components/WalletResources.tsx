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
import { Wallet, Check, Clipboard, Trash, ArrowRightCircle as ArrowRightCircle, Settings } from "lucide-react";
import { Textarea } from "./ui/textarea";
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"  
import { getWallets } from "@/libs/getWallets";
import { Skeleton } from "./ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const schema = z.object({
    wallet: z.string().min(1, "Invalid wallet input."),
    name: z.string().min(1, "Invalid name input."),
    description: z.string().min(1, "Invalid description input."),
  });

const WalletInput =  () => {
    const [isLoading, setIsLoading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const { data: session } = useSession();
    const [wallets, setWallets] = useState([]);
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
    })

    useEffect(() => {
        const fetchWallets = async () => {
            try {
                const walletData = await getWallets();
                setWallets(walletData.props.wallets);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log("No wallets found for this user");
                    setWallets([]); 
                } else {
                    console.error("Error fetching wallets:", error);
                }
            }
        };
        if (session?.user?.id) {
            fetchWallets();
        }
    }, [session?.user?.id]);

    const handleAddWallet = async (data: { wallet?: string; name?: string; description?: string }) => {
        setIsLoading(true);
        console.log("Data: ", data)
        try {
            const response = await apiClient.post("/wallet", { ...data, userId: session.user.id });
            console.log("API response: ", response);

            setWallets(prevWallets => Array.isArray(prevWallets) ? [...prevWallets, response] : [response]);
            
            form.reset();
            toast.success('Wallet added successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to add wallet');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteWallet = async (walletId: string) => {
        setIsLoading(true);
        try {
            const response = await apiClient.delete(`/wallet?walletId=${walletId}`);
            console.log("Delete API response: ", response);
            setWallets(wallets.filter(w => w.id !== walletId));
            toast.success('Wallet deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete wallet');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (wallet: string, id: string) => {
        navigator.clipboard.writeText(wallet).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 3000);
        });
    };

      return (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    className="flex items-center hover:bg-base-300 duration-200 w-full rounded-lg font-medium"
                >
                    <Wallet className="h-5 w-5" />
                    <span className='font-medium px-4 py-2 text-sm'>Wallets</span>
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

                        <div className="flex items-center space-x-2">
                            
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                    variant="outline"
                                    className="btn btn-primary btn-block w-full"
                                    >
                                        Add <Wallet className="inline-block ml-2" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Add Wallet</DialogTitle>
                                        <DialogDescription>
                                            Name the Wallet, and give a brief description.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(handleAddWallet)} className="flex flex-col space-y-3">
                                            <span className="font-semibold">Submit Here</span>
                                            <FormField
                                                control={form.control}
                                                name="wallet"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                placeholder="Enter Address"
                                                                autoComplete="text"
                                                                className="input input-bordered w-full placeholder:opacity-60"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        <div className="grid items-center gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            placeholder="Enter Name"
                                                            autoComplete="text"
                                                            className="input input-bordered w-full placeholder:opacity-60"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        </div>
                                        <div className="grid items-center gap-4">
                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Enter Description"
                                                            className="textarea textarea-bordered w-full placeholder:opacity-60"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        </div>
                                        <Button type="submit"> Add <Wallet className="inline-block ml-2" /></Button> 
                                        </form>
                                    </Form>
                                    </div>
                                    <DialogFooter>
                
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div>
                            {wallets.length > 0 ? (
                                wallets.map((walletObj, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                        <span 
                                            onClick={() => copyToClipboard(walletObj.wallet, walletObj.id)} 
                                        >
                                            {copiedId === walletObj.id ? <Check /> : <Clipboard />}
                                        </span>
                                        <div className="ml-2" style={{ flexGrow: 1 }}>
                                            {walletObj.name}
                                        </div>
                                        <span 
                                            onClick={() => handleDeleteWallet(walletObj.id)} 
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                        >
                                            <Trash />
                                        </span>
                                        <Popover>
                                            <PopoverTrigger>
                                                <Settings className="ml-2" />
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <div className="grid gap-4">
                                                <div className="space-y-2">
                                                    <h4 className="font-medium leading-none">Wallet</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                    Update your wallet details.
                                                    </p>
                                                </div>
                                                <div className="grid gap-2">
                                                    <div className="grid grid-cols-3 items-center gap-4">
                                                    <Label htmlFor="name">Name</Label>
                                                    <Input
                                                        id="name"
                                                        defaultValue={walletObj.name}
                                                        className="col-span-2 h-8"
                                                    />
                                                    </div>
                                                    <div className="grid grid-cols-3 items-center gap-4">
                                                    <Label htmlFor="wallet">Wallet</Label>
                                                    <Input
                                                        id="wallet"
                                                        defaultValue={walletObj.wallet}
                                                        className="col-span-2 h-8"
                                                    />
                                                    </div>
                                                    <div className="grid grid-cols-3 items-center gap-4">
                                                    <Label htmlFor="description">Description</Label>
                                                    <Textarea
                                                        id="description"
                                                        defaultValue={walletObj.description}
                                                        className="col-span-2 h-8"
                                                    />
                                                    </div>
                                                    <Button>
                                                        Update
                                                    </Button>
                                                </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                ))
                        ) : (
                            <div>
                                <Skeleton className="w-[300px] h-[25px] rounded-full my-2"></Skeleton>
                                <Skeleton className="w-[300px] h-[25px] rounded-full my-2"></Skeleton>
                                <Skeleton className="w-[300px] h-[25px] rounded-full my-2"></Skeleton>
                            </div>
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