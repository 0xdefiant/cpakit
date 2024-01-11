import connectMongo from "@/libs/mongoose";
import Wallet from "@/models/Wallet";

export async function POST(req: Request) {
    await connectMongo();

    const body = await req.json();

    if (!body.wallet || !body.name || !body.description || !body.userId) {
        return Response.json({ error: "wallet, name, description or userId is required" }, { status: 400 });
      }


    try {
        // Create a new test record with the user _id and the test string
        const newWallet = await Wallet.create({ 
            wallet: body.wallet,         
            name: body.name, 
            description: body.description, 
            userId: body.userId });
        console.log("New Wallet: ", newWallet);

        const response = {
            wallet: newWallet.wallet,
            name: newWallet.name,
            description: newWallet.description,
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
        const wallets = await Wallet.find({ userId: userId }).select('wallet name description');

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

export async function DELETE(req: Request) {
    await connectMongo();

    const url = new URL(req.url, 'http://localhost');
    const walletId = url.searchParams.get('walletId');

    if (!walletId) {
        return Response.json({ error: "walletId is required" }, { status: 400 });
    }

    try {
        const deletedWallet = await Wallet.findByIdAndDelete(walletId);
        if (!deletedWallet) {
            return Response.json({ error: "Wallet not found" }, { status: 404 });
        }
        console.log("Deleted Wallet: ", deletedWallet);

        return Response.json({ message: "Wallet deleted successfully" });
    } catch (e) {
        console.error(e);
        return Response.json({ error: e.message }, { status: 500 });
    }
}
