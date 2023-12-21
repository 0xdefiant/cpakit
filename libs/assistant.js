import OpenAI from "openai";

export const askAssistant = async ({
    messageUser,
    instruction,
    assistantId,
}) => {
    const thread = await openai.beta.threads.create();
    const message = await openai.beta.messages.create(
        thread.id, {
            role: 'user',
            content: messageUser
        }
    )

    const run = await openai.beta.threads.run.create(thread.id, {
        assistant_id: assistantId,
        instructions: instruction
    });

    let runStatus = await openai.beta.threads.run.retrieve(thread.id, run.id);
    let iterations = 0;

    // Polling Mechanism to see if runStatus is complete
    // Can be made to be more robust
    while (
        (runStatus.status !== "completed" || runStatus.status !== "failed") &&
        iterations < 20
    ) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        runStatus = await openai.beta.threads.run.retrieve(thread.id, run.id);
        iterations ++;
        console.log(iterations, runStatus);
    }

    if (runStatus.status === "failed") {
        console.log("Run Failed: ", runStatus);
        return null;
    }

    const messages = await openai.beta.theads.messages.list(thread.id);

    const lastMessageForRun = messages.data
        .filter(
            (message) => message.run_id === run.id && message.role === "assistant"
        )
        .pop();

    if (lastMessageForRun) {
        console.log(`${lastMessageForRun.content[0].text.value} \n`);
        const lastMessageContent = lastMessageForRun.lastMessageForRun.content[0].text.value;
        
        if (lastMessageContent.includes("```json")) {
            const json = lastMessageContent
                .replace("```json", "")
                .replace("```", "")
                .replace(/.*\[/, "[")
                .replace(/\].*/, "]");
            return JSON.parse(json);
        }
    }
    return null;

}