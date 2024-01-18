const apikey = process.env.ALCHEMY_API_KEY;

export async function GET(request: Request) {
  console.log("API Route Called");

  const url = new URL(request.url);
  const walletAddress = url.searchParams.get('address');
  console.log("Address received in API route: ", walletAddress);

  if (!walletAddress) {
    return new Response(JSON.stringify({ error: 'Address is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    const NFTsForOwner = await fetch(`https://eth-mainnet.g.alchemy.com/nft/v3/${apikey}/getNFTsForOwner?owner=${walletAddress}&withMetadata=true&excludeFilters[]=SPAM&excludeFilters[]=AIRDROPS&spamConfidenceLevel=LOW&pageSize=100`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!NFTsForOwner.ok) {
      throw new Error(`Error fetching NFT data: ${NFTsForOwner.status}`);
    }

    const NFTsForOwnerResponse = await NFTsForOwner.json();

    const nftDataArray = NFTsForOwnerResponse.ownedNfts.map((nft: any) => {
      return {
        ...nft,
      };
    });

    console.log("NFT Data Array: ", nftDataArray);

    let metadataList = NFTsForOwnerResponse.ownedNfts
      .filter((item: any ) => item.contract.openSeaMetadata.floorPrice != null && item.contract.openSeaMetadata.floorPrice > 0)
      .map((item: any) => ({
        name: item.contract.name,
        address: item.contract.address,
        tokenId: item.tokenId,
        floorPrice: item.contract.openSeaMetadata.floorPrice,
        tokenType: item.contract.tokenType,
        tokenUri: item.tokenUri,
        imageUrl: item.image.cachedUrl,
        timeLastUpdated: item.timeLastUpdated,
    }));

    for (let nft of metadataList) {
      try {
        console.log("NFT Address, ", nft.address)
        const floorPriceResponse = await fetch(`https://eth-mainnet.g.alchemy.com/nft/v3/${apikey}/getFloorPrice?contractAddress=${nft.address}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json'
          }
        });

        if (!floorPriceResponse.ok) {
          throw new Error(`Error fetching floor price data: ${floorPriceResponse.status}`);
        }

        const floorPriceData = await floorPriceResponse.json();
        console.log("FloorPriceData: ", floorPriceData)
        nft.floorPrice = floorPriceData.openSea.floorPrice;
      } catch (error) {
        console.error(`Error fetching floor price for NFT ${nft.id}:`, error);
        nft.floorPrice = null; // Set to null if there was an error
      }
    }
    // Write logic to update the floorPrice Variaqble.
    console.log("metadataList: ", metadataList)
    return Response.json({ metadataList })

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
