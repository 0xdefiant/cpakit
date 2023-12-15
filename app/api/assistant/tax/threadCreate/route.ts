// This route, Creates a Thread, and then starts a Run from the prompt given by the User.
// It is tied directly to the tax Assistant (Anthony needs to add files to this assistant)


// import apiClient from '@/libs/api'; ** use this when storing to mongoDB
import apiClient from '@/libs/api';
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
    console.log("ThreadId", thread.id);


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
            metadata: { "userId": body.userId }
            // model: "gpt-4-1106-preview", OVERRIDE
            // instructions: body.newInstructions, // If the user wants to override the Assistant Instructions
            // tools: [{"type": "code_interpreter"}, {"type": "retrieval"}] // able to override
        }
      );

    console.log("Create a Run on the Thread:", run);

    
    const waitForRunCompletion = async (openai: OpenAI, thread_id: string, run_id: string) => {
        let runRetrieve;
        let attempt = 0; // Counter for the number of attempts
    
        while (true) {
            runRetrieve = await openai.beta.threads.runs.retrieve(thread_id, run_id);
    
            // Break the loop if the run is completed, failed, cancelled, or expired
            const finalStatuses = ['completed', 'failed', 'cancelled', 'expired'];
            if (finalStatuses.includes(runRetrieve.status)) {
                break;
            }
    
            // Exponential backoff: increase the wait time on each attempt
            const waitTime = Math.min(1000 * (2 ** attempt), 30000); // Cap the wait time at 30 seconds
            await new Promise(resolve => setTimeout(resolve, waitTime));
            attempt++;
        }
        return runRetrieve;
    }
  
    // Usage
    const runRetrieveDone = await waitForRunCompletion(openai, thread.id, run.id);
    console.log("Run Retrieve Done:", runRetrieveDone); // Need to create slight delay or check for the status to be completed

    /* TODO:
    I want this API to return a dictionary called 'threadCreateAndRun', the first two keys will be 'threadData', and 'messageData'.

    The thread data will include another dictionary with the thread.id, the assistant.id, and the run.id, which will come from the runRetrieve element above.
    The message data will include an array that it stored in 'allMessageContents'.
    */

    const messageList = await openai.beta.threads.messages.list(
        thread.id
    );
    console.log("Full Message List:", messageList);

    // Update the code below to use the same logic as above
    const allMessageContents = messageList.data.map((message, index) => {
      return message.content.map((contentItem) => {
        if (contentItem.type === 'text' && contentItem.text) {
          return `Message ${index}: ${contentItem.text.value}`;
        } else if (contentItem.type === 'image_file') {
          return `Message ${index} contains an image.`;
        } else {
          return `Message ${index} contains an unrecognized content type.`;
        }
      }).join(', '); // Joining the contents of each message with a comma
    });

    console.log("allMessageContents: ", allMessageContents);

    const threadCreateAndRun = {
      threadData: {
            thread_id: thread.id,
            assistantId: runRetrieveDone.assistant_id,
            runId: runRetrieveDone.id,
            userId: body.userId,
            metadata: runRetrieveDone.metadata
      },
      allMessageContents
    };

    console.log("ThreadCreateAndRun", threadCreateAndRun);

    // console.log("Message: data: ", messageList.data);
    // console.log("Message: data[0]: ", messageList.data[0].content); //   { type: 'text', text: { value: 'this is a test', annotations: [] } }
    // console.log("Message: data[1]: ", messageList.data[1].content); //   { type: 'text', text: { value: 'this is a test', annotations: [] } }
    // console.log("Message: data[0].content[0].type[1]:", messageList.data[0].content[0].text.value); // this dispays the message I send.
    
    // const messageContent = messageList?.data[0]?.content[0]?.text?.value;
    // Send back the assistant's response
    return NextResponse.json(threadCreateAndRun); // update with a new element 'threadCreateAndRun
  } catch (error) {
    console.error('Assistant API error:', error);
    return NextResponse.json({ message: 'Error creating assistant' });
  }
}