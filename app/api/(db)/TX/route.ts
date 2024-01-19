import connectMongo from "@/libs/mongoose";
import TX from '@/models/TXS';

export async function POST(req: Request) {
    await connectMongo();
    console.log("Req: ", req)
    
    const body = await req.json();
    console.log("Body: ", body);

    // Corrected field name from 'TxMetaData' to 'TxMetadata'
    if (!body.userId || !body.wallet || !body.TxMetadata ) {
        return new Response(JSON.stringify({ error: "userId, TxMetadata, and wallet are required" }), { status: 400 });
    }

    console.log("ROUTE -- Meta TX DATA: ", body.TxMetadata)
    console.log("ROUTE -- TX DATA: ", body.TxData)

    try {
        const savedTxs = await Promise.all(
          body.TxMetadata.map((TxItem: any) =>
            TX.create({ 
                userId: body.userId,
                wallet: body.wallet,
                ...TxItem
            })
          )
        );
        console.log("Saved TX: ", savedTxs)

        return new Response(JSON.stringify({ message: "TX data saved successfully", data: savedTxs }), { status: 200 });
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
        // Define the fields to be selected from the TX model
        const fields = 'wallet address tokenName tokenSymbol fromAddress toAddress tx_hash block_timestamp value_decimal usdPrice';
        
        // Fetch transactions for the given userId
        const TXs = await TX.find({ userId: userId }).select(fields);

        if (!TXs || TXs.length === 0) {
            return new Response(JSON.stringify({ message: "No transactions found for this user" }), { status: 404 });
        }
        console.log("Transactions: ", TXs);

        return new Response(JSON.stringify(TXs), { status: 200 });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}

