'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Button } from '@/components/ui/button'
import { Input } from './ui/input';
import { useSession,  } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShadowIcon, ClipboardIcon, CheckIcon } from '@radix-ui/react-icons';
import { useToast } from './ui/use-toast';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const session = useSession();
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const { toast } = useToast();

  const copyToClipboard = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 3000);
    });
  };

  const copyMarkdown = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 3000);
      toast({
        description: "Content copied to clipboard.",
      });
    });
  };

  const renderers = {
    code({ node, inline, className, children, ...props }: { node: any, inline: any, className: any, children: any, props: any }) {
      const copyCode = () => copyMarkdown(children as string, node.position?.start.line.toString());
      return !inline ? (
        <div onClick={copyCode} className="cursor-pointer">
          <pre className={className ?? ''}>
            <code {...props}>{children}</code>
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
                    <ReactMarkdown className="prose block max-w-none overflow-ellipsis">{m.content}</ReactMarkdown>
                  </div>
                </>
              ) : (
                <>
                  <ShadowIcon className="h-6 w-6 mr-2 flex-shrink-0" />
                  <div className="relative flex-1 min-w-0">
                    <ReactMarkdown 
                      className="prose block max-w-none overflow-ellipsis" 
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
                <ClipboardIcon className="ml-2 cursor-pointer" onClick={() => copyToClipboard(m.content, m.id)} />
              )}
            </div>
          </div>
        ))}
      </section>



        <form className="flex mb-8 space-x-4" onSubmit={handleSubmit}>
        <Input
          className="rounded-md p-2 flex-1"
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
        />
        <Button
          className="border-solid border-2 border-white p-2 rounded-md"
          type="submit"
        >
          Send
        </Button>
      </form>
    </div>
  );
}