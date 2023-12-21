'use client'

import { askAssistant } from "@/libs/assistant";
import { Form, FormField, FormControl, FormMessage, FormItem } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { Button } from "./ui/button";
import { Loader, Send } from "lucide-react";

const schema = z.object({
    messageUser: z.string().refine(value => value !== '', { message: "Invalid prompt input." }),
    instruction: z.string().refine(value => value !== '', { message: "Invalid prompt input." }),
    assistantId: z.string().refine(value => value !== '', { message: "Invalid prompt input." }),
  });

export default function Assistant() {
const [messages, setMessages] = useState([]);
const [isLoading, setIsLoading] = useState<boolean>(false);
const form = useForm({
    resolver: zodResolver(schema),
  })

const handleSubmit = (messageUser: string, instruction: string, assitantId: string) => {
    let messages = askAssistant();

    return messages;
}

const renderMessage = (message: any) => {
    try {
      if (message && typeof message.content === 'string') {
        return <div key={message.id} className="message">{message.content}</div>;
      } else {
        console.error('Invalid message object:', message);
        return <div className="error-message">RENDERMESSAGE DID NOT WORK</div>;
      }
    } catch (error) {
      console.error('Error rendering message:', error);
      return <div className="error-message">Error in renderMessage</div>;
    }
  };

return (
    <div className="mx-auto w-full max-w-lg">
    <div className="messages">
        {messages.map(message => renderMessage(message))}
    </div>
    <h1 className="font-semibold my-2">Test Run Thread</h1>
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="messageUser"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Type your message here"
                      {...field}
                    />
                    <Textarea
                      placeholder="Type your message here"
                      {...field}
                    />
                    <Textarea
                      placeholder="Type your message here"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <Button className="flex w-full space-x-2" type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader />
              ) : (
                <Send />
              )}
            </Button>
        </form>
      </Form>
      </section>
    </div>
  );
}
