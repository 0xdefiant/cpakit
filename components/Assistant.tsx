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
    messageUser: z.string().min(1, "Message is required."),
    instruction: z.string().min(1, "Instruction is required."),
    assistantId: z.string().min(1, "Assistant ID is required."),
  });

export default function Assistant() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });
  
    const onSubmit = async (data: { messageUser: string, instruction: string, assistantId: string }) => {
        setIsLoading(true);
        try {
const response = await askAssistant({ messageUser: data.messageUser, instruction: data.instruction, assistantId: data.assistantId });            setMessages([...messages, response]);
        } catch (error) {
            console.error('Error in asking assistant:', error);
        }
        setIsLoading(false);
    };

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
    <form onSubmit={handleSubmit(onSubmit)}>
          <FormItem>
            <FormControl>
              <Textarea {...register("messageUser")} placeholder="Enter your message" />
              {errors.instruction && <FormMessage>{errors.messageUser.message.toString()}</FormMessage>}            </FormControl>
          </FormItem>
          <FormItem>
            <FormControl>
              <Textarea {...register("instruction")} placeholder="Enter instruction" />
              {errors.instruction && <FormMessage>{errors.instruction.message.toString()}</FormMessage>}            </FormControl>
          </FormItem>
          <FormItem>
            <FormControl>
              <Textarea {...register("assistantId")} placeholder="Enter Assistant ID" />
              {errors.instruction && <FormMessage>{errors.assistantId.message.toString()}</FormMessage>}            </FormControl>
          </FormItem>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader /> : <Send />} Send
            </Button>
        </form>
      </section>
    </div>
  );
}
