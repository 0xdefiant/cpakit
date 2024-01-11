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
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

interface NftItem {
  name: string;
  address: string;
  floorPrice: number;
  tokenType: string;
  tokenId: string;
  tokenUri: string;
  imageUrl: string;
  timeLastUpdated: string;
}

const NftDashboardTable = () => {
  const [nftMetadata, setNftMetadata] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInputEmpty, setIsInEmpty] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState(''); // Added state to store the user-entered address

    useEffect(() => {
      // Early return if address is not available
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
    
          // Check if the response is not ok and throw an error
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
    
          const data = await response.json();
          console.log("JSON Response: ", data);
    
          // Ensure data.metadataList exists and is an array
          if (data?.metadataList && Array.isArray(data.metadataList)) {
            const metadataList = data.metadataList.map((item: any) => ({
              name: item.name,
              id: item.tokenId,
              floorPrice: item.floorPrice,
              tokenType: item.tokenType,
              tokenUri: item.tokenUri,
              imageUrl: item.imageUrl,
              timeLastUpdated: item.timeLastUpdated,
            }));
    
            setNftMetadata(metadataList);
            console.log("NFT Metadata Fetched Successfully");
          } else {
            // Handle the case where data.metadataList is not as expected
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
    }, [address]);
    
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setAddress(inputValue);
    setIsInEmpty( inputValue === '')
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
        <Button onClick={() => setAddress(address)}>Fetch NFTs</Button>
      </div>

      {isInputEmpty && (
        <div className='mt-4'>Please enter an Ethereum address to fetch NFTs.</div>
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
                <TableCaption>A list of your NFTs.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
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
                            <TableCell>{metaData.tokenType}</TableCell>
                            <TableCell className="text-right">{`$${metaData.floorPrice}`}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3}>Total Floor Price</TableCell>
                        <TableCell className="text-right">{`$${nftTotal().toFixed(2)}`}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        )}
    </div>
  );
};

export default NftDashboardTable;