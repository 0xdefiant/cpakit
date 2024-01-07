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

  useEffect(() => {
    const fetchNftMetadata = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Assuming address is a parameter that should be included in the request
        const address = "0x0f82438E71EF21e07b6A5871Df2a481B2Dd92A98";
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
  }, []);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
              height={50}
              width={50}
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