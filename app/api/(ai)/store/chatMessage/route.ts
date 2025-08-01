// /app/api/store/chatMessage/route.ts

import { NextResponse, NextRequest } from "next/server";
import ChatMessage from '@/models/ChatMessage';
import { URL } from "url";
import connectMongo from "@/libs/mongoose";

export async function POST(req: NextRequest, res: NextResponse) {
  await connectMongo();

  const body = await req.json();
  console.log("this is the Tax body:", body);

  if (!body.prompt || !body.response || !body.userId) {
    return NextResponse.json({ error: "Prompt, response, and userId are required" }, { status: 400 });
  }

  try {
    // Create a new test record with the user _id and the test string
    const newChat = await ChatMessage.create({ prompt: body.prompt, response: body.response, userId: body.userId });

    return NextResponse.json(newChat);
  } catch (e) {
    console.error(e);
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
      const chatMessages = await ChatMessage.find({ userId: userId }).select('prompt response -_id');
      
      if (chatMessages.length === 0) {
          return NextResponse.json({ message: "No chat messages found for this userId" }, { status: 404 });
      }

      return NextResponse.json(chatMessages);
  } catch (e) {
      console.error(e);
      return NextResponse.json({ error: e.message }, { status: 500 });
  }
}