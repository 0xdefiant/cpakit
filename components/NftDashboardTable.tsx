'use client'

import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Input } from './ui/input';
import { useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import EthereumIcon from 'cryptocurrency-icons/svg/icon/eth.svg';
import Image from 'next/image';
import { getWallets } from '@/libs/getWallets';

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/libs/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface NftItem {
  name: string;
  address: string;
  walletName: string;
  wallet: string;
  floorPrice: number;
  tokenType: string;
  id: string;
  tokenUri: string;
  imageUrl: string;
  timeLastUpdated: string;
}

const NftDashboardTable = () => {
  const { data: session } = useSession();
  const [nftMetadata, setNftMetadata] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInputEmpty, setIsInEmpty] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState(''); 
  const [isSaving, setIsSaving] = useState(false);
  const [wallets, setWallets] = useState<any[]>([]);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [userNfts, setUserNfts] = useState<NftItem[]>([]);

    useEffect(() => {
      const loadWallets = async () => {
        try {
          const result = await getWallets();
          setWallets(result.props.wallets);
        } catch (err) {
          console.error('Failed to load wallets', err);
        }
      };
      loadWallets();
    }, []);

    useEffect(() => {
      const fetchUserNfts = async () => {
        if (session?.user?.id) {
          try {
            const response = await fetch(`/api/NFT?userId=${session.user.id}`);
            if (!response.ok) {
              throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setUserNfts(data);
          } catch (err) {
            console.error("Failed to fetch user's NFTs", err);
          }
        }
      };
      fetchUserNfts();
    }, [session]);
    
    useEffect(() => {
      if (!address) return;
    
      const fetchNftMetadata = async () => {
        setIsLoading(true);
        setError(null);
    
        try {
          const response = await fetch(`/api/nfts?address=${address}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
    
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
    
          const data = await response.json();
          console.log("JSON Response: ", data);
    
          if (data?.metadataList && Array.isArray(data.metadataList)) {
            const metadataList = data.metadataList.map((item: any) => ({
              name: item.name,
              address: item.address,
              floorPrice: item.floorPrice,
              tokenType: item.tokenType,
              id: item.id,
              tokenUri: item.tokenUri,
              imageUrl: item.imageUrl,
              timeLastUpdated: item.timeLastUpdated,
            }));

            console.log("Metadatalist: ", metadataList)
    
            setNftMetadata(metadataList);
            console.log("NFT Metadata Fetched Successfully");
          } else {
            throw new Error('Invalid metadata format');
          }
        } catch (err) {
          setError('Failed to fetch NFT metadata');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchNftMetadata();
    }, [address, wallets]);

    const saveNftData = async () => {
      setIsSaving(true); 

      console.log("userID: ", session.user.id);
      console.log("NFT data: ", nftMetadata) 
      
      if (!session?.user?.id) {
        console.error("User ID not found in session");
        return;
      }
      
      console.log("wallets: ", wallets)
      
      const selectedWallet = wallets.find(wallet => wallet.wallet === address);
      const walletName = selectedWallet ? selectedWallet.name : '';
      console.log('walletName: ', walletName);

      try {
        const response = await fetch('/api/NFT', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session.user.id,
            walletName: walletName,
            wallet: address,
            nftData: nftMetadata,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Result Message: ", result.message);
      toast.success('NFT data saved successfully');
    } catch (err) {
      console.error('Failed to save NFT data', err);
      toast.error('Failed to save NFT data.')
    } finally {
      setIsSaving(false);
    }
  };
    
  // Update the code, currently when the NFT is selected from the dropdown, it renders the loading state
  // with all of the skeletons. Update the code to render the table with the saved data.

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setAddress(inputValue);
    setIsInEmpty( inputValue === '' && !value)
  };

  const handleNftSelection = (nftId: any) => {
      setOpen(false);
      const selectedNft = userNfts.find((nft: NftItem) => nft.id === nftId);
      if (selectedNft) {
        setNftMetadata([selectedNft]);
        setIsInEmpty(false);
        setIsLoading(false); // Set loading to false as we have the selected NFT data
        setError(null);
      }
  };

  const nftTotal = () => {
    return nftMetadata.reduce((total, meta) => total + meta.floorPrice, 0);
  };

  return (
    <div>
      <div className='flex items-center'>
        <Input
            type="text"
            className='mr-2'
            value={address}
            onChange={handleAddressChange}
            placeholder="Enter Ethereum Address"
        />
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
            >
                {value
                    ? userNfts.find(nft => nft.id === value)?.name
                    : "Select NFT..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command>
                <CommandInput placeholder="Search NFT..." />
                <CommandEmpty>No NFT found</CommandEmpty>
                <CommandGroup>
                    {userNfts.map(nft => (
                        <CommandItem
                            key={nft.id}
                            value={nft.id}
                            onSelect={(currentValue) => {
                                setValue(currentValue === value ? "" : currentValue);
                                handleNftSelection(currentValue);
                            }}
                        >
                            <Check
                                className={`mr-2 h-4 w-4 ${value === nft.id ? "opacity-100" : "opacity-0"}`}
                            />
                            {nft.name}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </Command>
        </PopoverContent>
    </Popover>
      </div>

      {isInputEmpty && (
        <div className='mt-4'>Please enter an Ethereum address or select one from the dropdown.</div>
      )}

        {isLoading && !isInputEmpty && (
            <Table>
                <TableCaption>Waiting for address to find NFTs...</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>NFT</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Floor Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(1)].map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><Skeleton className="w-[50px] h-[50px] rounded-full" /></TableCell>
                            <TableCell><Skeleton className="w-[80px] h-[20px] rounded-full" /></TableCell>
                            <TableCell><Skeleton className="w-[60px] h-[20px] rounded-full" /></TableCell>
                            <TableCell className=''>
                                <div className="flex justify-end">
                                    <Skeleton className="w-[80px] h-[20px] rounded-full" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )}

        {error && <div>Error: {error}</div>}

       {!isLoading && !error && !isInputEmpty && (
            <Table>
                <TableCaption>  
                  <div className="flex justify-between">
                    <span>This Addresses NFTs.</span>
                    <div>
                      {isSaving ? (
                        <Button disabled>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Please wait
                        </Button>
                      ) : (
                        <Button variant="secondary" onClick={saveNftData}>
                          Save NFT Data
                        </Button>
                      )}
                    </div>
                  </div>
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>NFT</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Token Id</TableHead>
                        <TableHead className="text-right">Floor Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {nftMetadata.map((metaData) => (
                        <TableRow key={metaData.id}>
                            <TableCell>
                                <img
                                    src={metaData.imageUrl}
                                    height={50}
                                    width={50}
                                    alt="Collection Image"
                                />
                            </TableCell>
                            <TableCell>{metaData.name}</TableCell>
                            <TableCell>{metaData.id}</TableCell>
                            <TableCell className="text-right">
                              <Image
                              src={EthereumIcon}
                              alt='ETH' 
                              className="inline-block h-4 w-4 mr-2" 
                              priority={true}
                              width={50}
                              height={50}
                              />
                              {`${metaData.floorPrice}`}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total Floor Price</TableCell>
                        <TableCell className="text-right">
                            <Image
                              src={EthereumIcon}
                              alt='ETH' 
                              className="inline-block h-4 w-4 mr-2" 
                              priority={true}
                              width={50}
                              height={50}
                            />
                          {`${nftTotal().toFixed(2)}`}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        )}
    </div>
  );
};

export default NftDashboardTable;