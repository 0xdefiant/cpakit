import connectMongo from "@/libs/mongoose";
import Wallet from "@/models/Wallet";

export async function POST(req: Request) {
    await connectMongo();

    const body = await req.json();

    if (!body.wallet || !body.userId) {
        return Response.json({ error: "wallet and userId are required" }, { status: 400 });
      }


    try {
    // Create a new test record with the user _id and the test string
    const newWallet = await Wallet.create({ wallet: body.wallet, userId: body.userId });
    console.log("New Wallet: ", newWallet);

    const response = {
        wallet: newWallet.wallet,
        id: newWallet._id
    }

    return Response.json(response);
    } catch (e) {
    console.error(e);
    return Response.json({ error: e.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    await connectMongo();
    console.log("Req: ", req.url)
    
    const url = new URL(req.url, 'http://localhost');
    const userId = url.searchParams.get('userId');

    try {
        const wallets = await Wallet.find({ userId: userId }).select('wallet');

        if (!wallets || wallets.length === 0) {
            const noWallet = Response.json({ message: "No wallets found for this User"}, { status: 404 });
            console.log("No Wallet: ", noWallet)
            return noWallet;
        }

        console.log("Wallets: ", wallets)

        return Response.json(wallets);
    } catch (e) {
        console.error(e);
        return Response.json({ error: e.message }, { status: 500 });
    }
}