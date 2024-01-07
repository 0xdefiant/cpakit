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
  contract: {
    name: string;
    openSeaMetadata: {
      floorprice: number;
    };
    tokenType: string;
  };
  tokenId: string;
  tokenUri: string;
  image: {
    cachedUrl: string;
  };
  timeLastUpdated: string;
}

const NftDashboardTable = () => {
  const [nftMetadata, setNftMetadata] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState(''); // Added state to store the user-entered address

  useEffect(() => {
    if (!address) return;

    const fetchNftMetadata = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/nfts?address=${address}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("json Response: ", data)
        console.log("json Response, nft owner, ownerd nfts: ", data.NFTsForOwnerResponse.ownedNfts)
        console.log("json Response, block timestamp: ", data.NFTsForOwnerResponse.validAt.blockTimestamp)
        console.log("json Response, opensea: ", data.NFTsForOwnerResponse.validAt.openSeaMetadata);

        const nftArray = await data.NFTsForOwnerResponse.ownedNfts;

        const metadataList = nftArray
        .filter((item: any ) => item.contract.openSeaMetadata.floorPrice != null && item.contract.openSeaMetadata.floorPrice > 0)
        .map((item: any) => ({
          name: item.contract.name,
          id: item.tokenId,
          floorPrice: item.contract.openSeaMetadata.floorPrice,
          tokenType: item.contract.tokenType,
          tokenUri: item.tokenUri,
          imageUrl: item.image.cachedUrl,
          timeLastUpdated: item.timeLastUpdated,
        }));
        setNftMetadata(metadataList);
        console.log("NFT Metadata Fetched Successfully");
      } catch (err) {
        setError('Failed to fetch NFT metadata');
        console.error(err);
      }
      setIsLoading(false);
    };

    fetchNftMetadata();
  }, [address]);
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const nftTotal = () => {
    return nftMetadata.reduce((total, meta) => total + meta.floorPrice, 0);
  };
  
  return (
    <div>
        <Input
            type="text"
            className='my-2'
            value={address}
            onChange={handleAddressChange}
            placeholder="Enter Ethereum Address"
        />
        <Button onClick={() => setAddress(address)}>Fetch NFTs</Button>

        {isLoading && (
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
                    {[...Array(2)].map((_, index) => (
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

        {!isLoading && !error && (
            <Table>
                <TableCaption>A list of your NFTs.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>NFT</TableHead>
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