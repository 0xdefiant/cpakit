import { any } from "zod";

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
        'accept': 'application/json'
      },
    });

    if (!NFTsForOwner.ok) {
      throw new Error(`Error fetching NFT data: ${NFTsForOwner.status}`);
    }

    const NFTsForOwnerResponse = await NFTsForOwner.json();

    // Assuming NFTsForOwnerResponse contains an array of NFTs, each with its metadata
    const nftDataArray = NFTsForOwnerResponse.ownedNfts.map((nft: any) => {
      return {
        ...nft, // spread operator to include all properties of the NFT
        // Additional properties can be added here if needed
      };
    });

    console.log("NFT Data Array: ", nftDataArray);

    return Response.json({ NFTsForOwnerResponse })

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
