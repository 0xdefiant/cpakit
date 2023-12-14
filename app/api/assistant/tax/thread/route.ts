// pages/api/assistant.js
// import apiClient from '@/libs/api'; ** use this when storing to mongoDB
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
// import fsPromises from 'fs'; this was in the demo runAssistant.js

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("This is the body", body);

  if (!body.prompt || !body.userId ) {
    return NextResponse.json({ error: "More Thread Elements needed:" }, {status: 400 });
  }

  try {
    // Put the user input from the request body
    const thread = await openai.beta.threads.create();

    console.log("Create Thread:", thread);

    /*
    const thread = await openai.beta.threads.create({
        message: [
            {
                "role": "user",
                "content": body.prompt,
                "file_ids": [file.id]
            }
        ] // Messages can contain text, images, or files. At the moment, user-created 
        Messages cannot contain image files but we plan to add support for this in the future.
        Messages also have the same file size and token limits as Assistants 
        (512 MB file size limit and 2,000,000 token limit).
    })

    */

    const message = await openai.beta.threads.messages.create(
        thread.id, {
            role: 'user',
            content: body.prompt,
            metadata: { "userID": body.userId }
        }
    );

    console.log("Create Message on Thread:", thread.id, message);

    const run = await openai.beta.threads.runs.create(
        thread.id, 
        {
            assistant_id: 'asst_S1dfgmEKogEJlp7mNf9TUHkp', // Tax Accounting Agent
            metadata: { "userID": body.userId }
            // model: "gpt-4-1106-preview", OVERRIDE
            // instructions: body.newInstructions, // If the user wants to override the Assistant Instructions
            // tools: [{"type": "code_interpreter"}, {"type": "retrieval"}] // able to override
        }
      );

    console.log("Create a Run on the Thread:", run);

    //const runRetrieve = await openai.beta.threads.runs.retrieve(
      //  thread.id,
      //  run.id
    //);
    
    const waitForRunCompletion = async (openai: OpenAI, threadId: string, runId: string) => {
      let runRetrieve;
      let isCompleted = false; // Added a flag to control the loop
  
      while (!isCompleted) {
          runRetrieve = await openai.beta.threads.runs.retrieve(threadId, runId);
          if (runRetrieve.status === 'completed') {
              isCompleted = true; // Set the flag to true to break the loop
          } else {
              // Wait for 1 second before the next check
              await new Promise(resolve => setTimeout(resolve, 1000));
          }
      }
      return runRetrieve;
    }
  
    // Usage
    const runRetrieveDone = await waitForRunCompletion(openai, thread.id, run.id);
    console.log("Run Retrieve Done:", runRetrieveDone); // Need to create slight delay or check for the status to be completed

    const messageList = await openai.beta.threads.messages.list(
        thread.id
    );

    messageList.data.forEach((message, index) => {
      console.log(`Message ${index}:`, message.content[0]?.text?.value);
    });

    const allMessageContents = messageList.data.map((message) => {
      return message.content[0]?.text?.value;
    });

    // console.log("Full Message List:", messageList);
    // console.log("Message: data: ", messageList.data);
    // console.log("Message: data[0]: ", messageList.data[0].content); //   { type: 'text', text: { value: 'this is a test', annotations: [] } }
    // console.log("Message: data[1]: ", messageList.data[1].content); //   { type: 'text', text: { value: 'this is a test', annotations: [] } }
    // console.log("Message: data[0].content[0].type[1]:", messageList.data[0].content[0].text.value); // this dispays the message I send.
    
    // const messageContent = messageList?.data[0]?.content[0]?.text?.value;
    // Send back the assistant's response
    return NextResponse.json(allMessageContents);
  } catch (error) {
    console.error('Assistant API error:', error);
    return NextResponse.json({ message: 'Error creating assistant' });
  }
}