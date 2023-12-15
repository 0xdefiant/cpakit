'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import apiClient from '@/libs/api';
import gfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Input } from './ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useSession } from 'next-auth/react';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ArrowRightCircle } from 'lucide-react';
import { format } from 'path';
import { Send, Loader } from 'lucide-react';
import { Textarea } from './ui/textarea';

interface ApiResponse {
    allMessageContents: string[];
    threadData: {
      thread_id: string;
      assistantId: string;
      runId: string;
      userId: string;
      metadata: unknown;
    };
  }

const schema = z.object({
    prompt: z.string().refine(value => value !== '', { message: "Invalid prompt input." }),
  });


export default function RunThread() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [threadData, setThreadData] = useState(null)
  const form = useForm({
    resolver: zodResolver(schema),
  })

  // thread_id: { thread_id: string }

  const handleSubmit = async (data: { prompt: string }) => {
    setIsLoading(true);
    try {
      if (!session || !session.user?.id) {
        throw new Error("User session is not available");
      }
  
      // Write some logic to find if there is already a thread created...
      // ...
  
      // If a thread already exists, use 'addMessage' instead of creating a new thread
      // const addMessage = await apiClient.post("/assistant/tax/addMessage", { ...data, thread_id, userId: session.user.id }) as ApiResponse;
  
      // Otherwise, create a new thread
      const response = await apiClient.post("/assistant/tax/threadCreate", { ...data, userId: session.user.id }) as ApiResponse;
  
      // Wait for 1 second (if needed for processing)
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      if (!response.threadData || !response.threadData.thread_id || !response.threadData.userId || !response.threadData.assistantId || !response.threadData.runId) {
        throw new Error("Required thread data is missing");
      } 
      console.log("This is the Response: ", response)
      // Store the thread information
      const storeThread = await apiClient.post('/store/thread', {
        thread_id: response.threadData.thread_id,
        userId: response.threadData.userId,
        assistantId: response.threadData.assistantId,
        runId: response.threadData.runId,
        allMessageContents: response.allMessageContents
      });
  
      console.log("this is what was stored RunThread: ", storeThread);
  
      // Processing the response messages
      if (Array.isArray(response.allMessageContents)) {
        const formattedMessages = response.allMessageContents.map((item, index) => ({
          id: index.toString(),
          content: item,
        }));
        setMessages(formattedMessages);
        console.log("Messages Set: ", formattedMessages);
      } else {
        console.log("not array???")
        throw new Error("Invalid response format");
      }
  
      // Set the thread data and reset the form
      const formattedThreadData = response.threadData;
      setThreadData(formattedThreadData);
      form.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error communicating with the assistant.'); //
      setMessages([]); // Reset messages in case of error
    } finally {
      setIsLoading(false);
    }
  };
  

  /* const saveThread = async (thread_id: string, userId: string) => {
    if (!session.data || lastMessageSaved) return;
    try {
      await apiClient.post('/store/thread', {
        thread_id,
        
        userId: session.data.user.id,
      });
      setLastMessageSaved(true);
    } catch (e) {
      console.error("Error saving chat message:", e);
    }
  }; */

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
              name="prompt"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
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
