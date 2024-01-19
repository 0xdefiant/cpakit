import connectMongo from "@/libs/mongoose";
import NFT from "@/models/NFT";

export async function POST(req: Request) {
    await connectMongo();
    console.log("Req: ", req);
    
    const body = await req.json();
    console.log("Body: ", body);

    // Validate required fields
    if (!body.userId || !body.walletName || !body.wallet || !body.nftData ) {
        return new Response(JSON.stringify({ error: "userId, nftData, walletName, and wallet are required" }), { status: 400 });
    }
    console.log("NFT DATA: ", body.nftData)

    try {
        // Assuming nftData is an array of NFT metadata
        const processedNFTs = await Promise.all(
          body.nftData.map(async (nftItem: any) => {
              // Check if NFT with this address and tokenId exists
              let existingNFT = await NFT.findOne({ address: nftItem.address, tokenId: nftItem.tokenId });
              if (existingNFT) {
                  // If exists, update the existing NFT
                  Object.assign(existingNFT, nftItem);
                  await existingNFT.save();
                  return existingNFT;
              } else {
                  // If not exists, create new NFT
                  return NFT.create({ 
                      userId: body.userId,
                      walletName: body.walletName,
                      wallet: body.wallet,
                      ...nftItem
                  });
              }
          })
        );
        console.log("Processed NFTs: ", processedNFTs)

        return new Response(JSON.stringify({ message: "NFT data processed successfully", data: processedNFTs }), { status: 200 });
    } catch (e) {
        console.error(e);
        return Response.json({ error: e.message }, { status: 500 });
    }
}


export async function GET(req: Request) {
    await connectMongo();

    const url = new URL(req.url, 'http://localhost');
    const userId = url.searchParams.get('userId');
    console.log("userId: ", userId)

    try {
        const NFTs = await NFT.find({ userId: userId }).select('walletName wallet name address floorPrice tokenType tokenId tokeUri imageUrl timeLastUpdated')

        if (!NFTs || NFTs.length === 0) {
            const noNFTs = Response.json({ message: "No NFTs found for this user"}, { status: 404 });
            console.log("No NFTs: ", noNFTs)
            return noNFTs
        }
        console.log("NFTs: ", NFTs)

        return Response.json(NFTs)
    } catch (e) {
        console.error(e);
        return Response.json({ error: e.message }, { status: 500 });
    }
}