import { NextResponse, NextRequest } from "next/server";
import storeThread from "@/models/Thread";
import { URL } from "url";
import connectMongo from "@/libs/mongoose";

export async function POST(req: NextRequest) {
    await connectMongo();

    const body = await req.json();
    console.log(" '/store/thread_id/', This is the body: ", body);

    if ( !body.thread_id || !body.userId ) {
        return NextResponse.json({ error: "Needs thread_id or userId"}, { status: 400 });
    }

    try {
        const newStoreThread = await storeThread.create({ thread_id: body.thread_id, userId: body.userId });

        return NextResponse.json(newStoreThread);
    } catch (e) {
        console.log(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    await connectMongo();
  
    const url = new URL(req.url, 'http://localhost');
    const userId = url.searchParams.get('userId');
  
    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
  
    try {
        const retrieveThread = await storeThread.find({ userId: userId }).select('thread_id -_id');
        
        if (storeThread.length === 0) {
            return NextResponse.json({ message: "No threads found for this userId" }, { status: 404 });
        }
  
        return NextResponse.json(retrieveThread);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}