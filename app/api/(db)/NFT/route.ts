import connectMongo from "@/libs/mongoose";
import NFT from "@/models/NFT";

export async function POST(req: Request) {
    await connectMongo();
    console.log("Req: ", req)
    
    const body = await req.json();
    console.log("Body: ", body);

    // Validate required fields
    if (!body.userId || !body.walletName || !body.wallet) {
        return new Response(JSON.stringify({ error: "userId, nftData, walletName, and wallet are required" }), { status: 400 });
    }

    try {
        // Assuming nftData is an array of NFT metadata
        const savedNFTs = await Promise.all(
          body.nftData.map((nftItem: any) => 
            NFT.create({ 
                userId: body.userId,
                walletName: body.walletName,
                wallet: body.wallet,
                ...nftItem
            })
          )
        );
        console.log("Saved NFTs: ", savedNFTs)

        return new Response(JSON.stringify({ message: "NFT data saved successfully", data: savedNFTs }), { status: 200 });
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
        const NFTs = await NFT.find({ userId: userId }).select('walletName wallet name address floorPrice tokenType id tokeUri imageUrl timeLastUpdated')

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