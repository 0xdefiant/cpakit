'use client'

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
import Image from "next/image";
import 'dotenv';
import React, { useState, useEffect } from 'react';
import { Alchemy, Network } from 'alchemy-sdk';

type NftMetadata = {
  name: string;
  id: string;
  floorPrice: number;
  tokenType: string;
  tokenUri: string;
  imageUrl: string;
  timeLastUpdated: string;
};

  const settings = {
    apiKey: process.env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
  };

  const alchemy = new Alchemy(settings);

  const NftDashboardTable = () => {
    const [nftMetadata, setNftMetadata] = useState<NftMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchNftMetadata = async () => {
        try {
          // Assume you have a list of token IDs you want to fetch
          const nftContracts = [
            {
              contractAddress: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
              tokenIds: ["10386"]
            },
            {
              contractAddress: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
              tokenIds: ["28478"]
            },
            {
              contractAddress: "0x3bf2922f4520a8BA0c2eFC3D2a1539678DaD5e9D",
              tokenIds: ["4317"]
            }
            // Add more objects with contract addresses and token IDs as needed
          ];
          const metadataList: NftMetadata[] = [];
  
          for (const nftContract of nftContracts) {
            for (const tokenId of nftContract.tokenIds) {
              const data = await alchemy.nft.getNftMetadata(
                nftContract.contractAddress,
                tokenId, {}
              );
          
              // Process and add the fetched data to metadataList
              if (data) {
                metadataList.push({
                  name: data.contract?.name || 'Unknown',
                  id: data.tokenId,
                  floorPrice: data.contract?.openSeaMetadata?.floorPrice || 0,
                  tokenType: data.tokenType,
                  tokenUri: data.tokenUri,
                  imageUrl: data.image.pngUrl,
                  timeLastUpdated: data.timeLastUpdated
                });
              }
            }
          }
  
          setNftMetadata(metadataList);
        } catch (err) {
          setError('Failed to fetch NFT metadata');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchNftMetadata();
      console.log("nft metadata", fetchNftMetadata)
    }, []);
  
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    /* const threads = [
      {
        chain: '/logos/sol.png',
        transactionType: "Paid",
        totalAmount: "$250.00",
        token: "Credit Card",
      },
    ] */

    const nftTotal = () => {
      return nftMetadata.reduce((total, meta) => total + meta.floorPrice, 0);
    };
  
    return (
      <div>
        <Table>
          <TableCaption>A list of your NFTs.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Floor Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nftMetadata.map((metaData) => (
              <TableRow key={metaData.id}>
                <img
                src={metaData.imageUrl}
                height={70}
                width={70}
                alt="Collection Image"
                />
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
      </div>
    );
  };

export default NftDashboardTable;