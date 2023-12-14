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

const schema = z.object({
    prompt: z.string().refine(value => value !== '', { message: "Invalid prompt input." }),
  });

export default function RunThread() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm({
    resolver: zodResolver(schema),
  })

  const handleSubmit = async (data: { prompt: string}) => {
    setIsLoading(true);
    try {
      if (!session || !session.user?.id) {
        throw new Error("User session is not available");
      }
  
      const response = await apiClient.post("/assistant/tax/thread", { ...data , userId: session.user.id });
      console.log("RUN THREAD response:", response);
      toast.success("Message sent successfully!");
  
      // Ensure the response is an array before mapping
      if (Array.isArray(response)) {
        setMessages(response.map((content, index) => ({ id: index.toString(), content })));
      } else {
        console.log("not array???")
        throw new Error("Invalid response format");
      }
      form.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error communicating with the assistant.');
      setMessages([]); // Reset messages in case of error
    }
  
    setIsLoading(false);
  };

  // UPDATE THE CODE TO DISPLAY 'RENDERMESSAGE DID NOT WORK' IF THIS CONST DOES NOT WORK
  const renderMessage = (message) => {
    try {
      if (message && message.content) {
        return (
          <div key={message.id} className="message">
            <ReactMarkdown remarkPlugins={[gfm]}>{message.content}</ReactMarkdown>
          </div>
        );
      } else {
        throw new Error("Invalid message content");
      }
    } catch (error) {
      console.error('Error rendering message:', error);
      return (
        <div className="error">
          <p>Something Went Wrong, Please try again or Reach out to anthony@cpakit.org</p>
        </div>
      );
    }
  };
  

  return (
    <div>
      <div className="messages">
        {messages.map(renderMessage)}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className={`flex flex-col space-y-3`}>
          <span className="font-semibold">test submit </span>
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
