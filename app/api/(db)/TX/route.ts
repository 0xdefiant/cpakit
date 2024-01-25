import connectMongo from "@/libs/mongoose";
import TX from "@/models/TXS"; // Assuming you have a model for transactions

export async function POST(req: Request) {
    await connectMongo();
    console.log("Req: ", req);
    
    const body = await req.json();
    console.log("Body: ", body);

    if (!body.userId || !body.TxMetadata ) {
        return new Response(JSON.stringify({ error: "userId and TxMetadata are required" }), { status: 400 });
    }

    console.log("ROUTE -- Meta TX DATA: ", body.TxMetadata);

    try {
        // Counter for saved transactions
        let savedTxsCount = 0;

        const savedTxs = await Promise.all(
            body.TxMetadata.map(async (TxItem: any) => {
                let existingTx = await TX.findOne({ 
                    tx_hash: TxItem.tx_hash,
                    log_index: TxItem.log_index,
                    wallet: TxItem.wallet
                });

                if (existingTx) {
                    console.log("Preexisting TX found: ", existingTx); // Log the preexisting transaction
                    Object.assign(existingTx, TxItem);
                    await existingTx.save();
                    savedTxsCount++;
                    return existingTx;
                } else {
                    const wallet = TxItem.wallet || body.wallet;
                    await TX.create({ 
                        userId: body.userId,
                        wallet: wallet,
                        tokenLogo: body.TxMetadata.tokenLogo,
                        ...TxItem
                    });
                    savedTxsCount++;
                    return TxItem; // Return the item as it was saved
                }
            })
        );

        console.log("Saved TX: ", savedTxs[0]);
        console.log("Number of transactions saved: ", savedTxsCount);

        return new Response(JSON.stringify({ message: "TX data saved successfully", data: savedTxs }), { status: 200 });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}



export async function GET(req: Request) {
    await connectMongo();

    const url = new URL(req.url, 'http://localhost');
    const userId = url.searchParams.get('userId');
    console.log("userId: ", userId)

    try {
        // Define the fields to be selected from the TX model
        const fields = 'wallet address tokenName tokenSymbol tokenLogo fromAddress toAddress log_index tx_hash block_timestamp value_decimal historicalTokenPrice';
        
        // Fetch transactions for the given userId and sort them by block_timestamp in descending order
        const TXs = await TX.find({ userId: userId }).select(fields).sort({ block_timestamp: -1 });

        if (!TXs || TXs.length === 0) {
            return new Response(JSON.stringify({ message: "No transactions found for this user" }), { status: 404 });
        }
        console.log("GET Transactions: ", TXs[0]);

        return new Response(JSON.stringify(TXs), { status: 200 });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}