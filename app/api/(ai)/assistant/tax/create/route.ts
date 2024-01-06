// pages/api/assistant.js
// import apiClient from '@/libs/api'; ** use this when storing to mongoDB
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import { FileInput } from 'lucide-react';

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(body);

  if (!body.instructions || !body.name || !body.tools || !body.model || !body.fileInput ) {
    return NextResponse.json({ error: "Body elements not include:" }, {status: 400 });
  }
  // fileInput is not a valid upload syntax

  try {
    // Put the user input from the request body
    const file = await openai.files.create({
      file: fs.createReadStream("userData.csv"),
      purpose: "assistants"
    })

    const myAssistant = await openai.beta.assistants.create({
          instructions: body.instructions,
          name: body.name,
          tools: body.tools,
          model: body.model,
          file_ids: [file.id],
          metadata: {
            userId: body.userId // Store userId under the key 'userId'
          }
      });
    
      console.log("Assistant Created:", myAssistant);
      
    // Send back the assistant's response
    return NextResponse.json({ message: myAssistant });
  } catch (error) {
    console.error('Assistant API error:', error);
    return NextResponse.json({ message: 'Error creating assistant' });
  }
}