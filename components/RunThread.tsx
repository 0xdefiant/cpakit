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

  const handleSubmit = async (data: { prompt: string}) => {
    setIsLoading(true);
    try {
      if (!session || !session.user?.id) {
        throw new Error("User session is not available");
      }
      
      // Write some logic to find if there is already a thread created...
      // 

      
      // const addMessage = await apiClient.post("/assistant/tax/addMessage", { ...data, thread_id, userId: session.user.id }) as ApiResponse;

      const response = await apiClient.post("/assistant/tax/threadCreate", { ...data, userId: session.user.id }) as ApiResponse;
      // console.log("RUN THREAD response:", response);
      // console.log("response.allMessageContents", response.allMessageContents);
      const storeThread = await apiClient.post('/store/thread_id', {
        thread_id: response.threadData.thread_id,
        userId: response.threadData.userId
      });


      if (Array.isArray(response.allMessageContents)) {
        const formattedMessages = response.allMessageContents.map((item: string, index: number) => ({
            id: index.toString(),
            content: item,
        }));
        setMessages(formattedMessages);
        console.log("Messages Set: ", formattedMessages);
      } else {
        console.log("not array???")
        throw new Error("Invalid response format");
      }
      const formattedThreadData = response.threadData;
      setThreadData(formattedThreadData);
      form.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error communicating with the assistant.');
      setMessages([]); // Reset messages in case of error
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
    <div>
        <div className="messages">
            {messages.map(message => renderMessage(message))}
        </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className={`flex flex-col space-y-3`}>
          <span className="font-semibold">Test Run Thread</span>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="try and break me"
                      autoComplete="text"
                      className="input input-bordered w-full placeholder:opacity-60"
                      {...field}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <Button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
              {isLoading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <ArrowRightCircle className="inline-block" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
