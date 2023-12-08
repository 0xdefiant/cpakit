import { NextResponse, NextRequest } from "next/server";
import connectMongo from "@/libs/mongoose";
import { URL } from "url";
import Test from "@/models/Test";

export async function POST(req: NextRequest) {
  await connectMongo();

  const body = await req.json();
  console.log(body)

  if (!body.test || !body.userId) {
    return NextResponse.json({ error: "Test and userId are required" }, { status: 400 });
  }

  try {
    // Create a new test record with the user _id and the test string
    const newTest = await Test.create({ test: body.test, userId: body.userId });

    return NextResponse.json(newTest);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

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
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
