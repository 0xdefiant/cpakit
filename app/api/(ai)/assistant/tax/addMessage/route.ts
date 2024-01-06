import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { resolve } from "path";

const openai = new OpenAI();

export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log("This is the body: ", body);

    if (!body.thread_id || !body.userId || !body.prompt || !body.metadata || !body.assistant_id ) {
        return NextResponse.json({ error: "More addMessage elements needed: " }, { status: 400 })
    }

    // MAYBE. some logic to connect the thread ID to the userId,
    // List the threads

    try {
        const threadMessages = await openai.beta.threads.messages.create(
            body.thread_id,
            { 
                role: 'user', 
                content: body.prompt
            }
        );
        
        const run = await openai.beta.threads.runs.create(
            body.thread_id,
            {
                assistant_id: body.assistant_id,
                metadata: { "userId": body.userId }
            }
        );

        const waitForRunCompletion = async (openai: OpenAI, thread_id: string, run_id: string) => {
            let runRetrieve;
            let isCompleted = false;

            while (!isCompleted) {
                runRetrieve = await openai.beta.threads.runs.retrieve(thread_id, run_id);
                if (runRetrieve.status === 'completed') {
                    isCompleted = true;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            return runRetrieve;
        }

        const runRetrieveDone = await waitForRunCompletion(openai, threadMessages.thread_id, run.id);
        console.log("Run Retrieve Done:", runRetrieveDone);

        const messageList = await openai.beta.threads.messages.list(
            threadMessages.thread_id
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

        const threadAddAndRun = {
            threadData: {

            },
            allMessageContents
        };
        console.log("threadAddAndRun: ", threadAddAndRun);

        return NextResponse.json(threadAddAndRun);
    } catch (error) {
        console.error('Thread Add Message error: ', error);
        return NextResponse.json({ message: 'Error creating assistant' });
    }
}