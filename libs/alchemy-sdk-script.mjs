// This script demonstrates access to the NFT API via the Alchemy SDK.
import { Network, Alchemy } from "alchemy-sdk";

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

// Print owner's wallet address:
const ownerAddr = "0x0f82438e71ef21e07b6a5871df2a481b2dd92a98";
console.log("fetching NFTs for address:", ownerAddr);
console.log("...");

/* Print total NFT count returned in the response:
const nftsForOwner = await alchemy.nft.getNftsForOwner("0x0f82438e71ef21e07b6a5871df2a481b2dd92a98");
console.log("number of NFTs found:", nftsForOwner.totalCount);
console.log("...");

// Print contract address and tokenId for each NFT:
for (const nft of nftsForOwner.ownedNfts) {
  console.log("===");
  console.log("contract address:", nft.contract.address);
  console.log("token ID:", nft.tokenId);
}
console.log("===");*/

// Fetch metadata for a particular NFT:
console.log("fetching metadata for a BAYC NFT...");
const response = await alchemy.nft.getNftMetadata(
  "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
  "10386"
);

// Uncomment this line to see the full api response:
console.log(response);

// Print some commonly used fields:
console.log("NFT name: ", response.contract.name);
console.log("NFT ID: ", response.tokenId);
console.log("NFT FP: ", response.contract.openSeaMetadata.floorPrice);
console.log("token type: ", response.tokenType);
console.log("tokenUri: ", response.tokenUri);
console.log("image url: ", response.raw.metadata.image);
console.log("time last updated: ", response.timeLastUpdated);
console.log("===");