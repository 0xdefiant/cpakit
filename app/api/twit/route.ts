import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import { URL } from "url";
import Test from "@/models/Test";

export async function GET(req: NextRequest) {
  await connectMongo();

  const url = new URL(req.url, 'http://localhost');
  const userId = url.searchParams.get('userId');
  console.log("Received userID:", userId);

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    // Only select the 'test' field
    const tests = await Test.find({ userId: userId }).select('test');
    console.log("Fetched tests:", tests); // Debug log

    if (!tests || tests.length === 0) {
      return NextResponse.json({ message: "No tests found for this userId" }, { status: 404 });
    }

    return NextResponse.json(tests);
    console.log(tests);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
