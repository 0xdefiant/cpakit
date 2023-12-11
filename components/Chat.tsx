'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import apiClient from '@/libs/api';
import gfm from 'remark-gfm';
import { Button } from '@/components/ui/button'
import { Input } from './ui/input';
import { Textarea } from "@/components/ui/textarea";
import { Label } from './ui/label';
import { useSession,  } from 'next-auth/react';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShadowIcon, ClipboardIcon, CheckIcon } from '@radix-ui/react-icons';
import { Message } from 'ai';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const session = useSession();
  const responseEndTimer = useRef<number | null>(null);
  const lastAssistantMessageRef = useRef<Message | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  const saveChatMessage = async (prompt: string, response: string) => {
    if (!session.data) return;
    try {
      await apiClient.post('/store/chatMessage', {
        prompt,
        response,
        userId: session.data.user.id, // Assuming session.data.user.id is the correct path
      });
    } catch (e) {
      console.error("Error saving chat message:", e);
    }
  };

  const copyMarkdown = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 3000);
    });
  };

  const renderers = {
    code({ node, inline, className, children, ...props }: { node: any, inline: any, className: any, children: any, props: any }) {
      const copyCode = () => copyMarkdown(children as string, node.position?.start.line.toString());
      return !inline ? (
        <div onClick={copyCode} className="cursor-pointer">
          <pre className={className ?? ''}>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold" {...props}>{children}</code>
          </pre>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    // ... other custom renderers if needed ...
  };


  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
  
      if (lastMessage.role === 'assistant') {
        lastAssistantMessageRef.current = lastMessage;
  
        // Clear existing timer
        if (responseEndTimer.current) {
          clearTimeout(responseEndTimer.current);
        }
  
        // Start a new timer
        responseEndTimer.current = setTimeout(() => {
          if (lastAssistantMessageRef.current) {
            const promptIndex = messages.slice(0, -1).reverse().findIndex(m => m.role === 'user');
            if (promptIndex !== -1) {
              const prompt = messages[messages.length - 2 - promptIndex]?.content;
              const response = lastAssistantMessageRef.current.content;
              console.log("Detected complete prompt and response", { prompt, response });
              saveChatMessage(prompt, response);
            }
          }
        }, 5000) as unknown as number; // Cast to number
      }
    }

    // Cleanup timer on component unmount
    return () => {
      if (responseEndTimer.current) {
        clearTimeout(responseEndTimer.current);
      }
    };
  }, [messages, session.data]);
 
  return (
    <div className="mx-auto w-full max-w-lg">
      <section className="mb-auto">
        {messages.map(m => (
          <div className="flex items-start mb-4 justify-between" key={m.id}>
            <div className="flex flex-1 items-start min-w-0">
              {m.role === 'user' ? (
                <>
                  {session.data?.user?.image ? (
                    <Avatar className="mr-2 flex-shrink-0">
                      <AvatarImage
                        src={session.data?.user?.image}
                        alt={session.data?.user?.name || "Account"}
                      />
                      <AvatarFallback>{session.data?.user?.name || "Account"}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <AvatarFallback className="mr-2">{session.data?.user?.name || "Account"}</AvatarFallback>
                  )}
                  <div className="flex-1 min-w-0">
                    <ReactMarkdown className="leading-7 [&:not(:first-child)]:mt-6">{m.content}</ReactMarkdown>
                  </div>
                </>
              ) : (
                <>
                  <ShadowIcon className="h-6 w-6 mr-2 flex-shrink-0" />
                  <div className="relative flex-1 min-w-0">
                    <ReactMarkdown 
                      className="leading-7 [&:not(:first-child)]:mt-6" 
                      remarkPlugins={[gfm]}
                      components={renderers}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </>
              )}
            </div>
            <div>
              {copiedMessageId === m.id ? (
                <CheckIcon className="ml-2" />
              ) : (
                <ClipboardIcon className="ml-2 cursor-pointer" onClick={() => copyMarkdown(m.content, m.id)} />
              )}
            </div>
          </div>
        ))}
      </section>

        <div className="grid w-full max-w-sm items-center gap-1.5 my-2">
          <Label htmlFor="picture">File Upload</Label>
          <Input id="picture" type="file" />
        </div>
        <form className="flex w-full max-w-sm items-center space-x-2" onSubmit={handleSubmit}>
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Say something..."
          />
          <Button type='submit'>
            <Send />
          </Button>
        </form>
    </div>
  );
}