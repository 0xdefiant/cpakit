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
