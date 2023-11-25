'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button'
import { Input } from './ui/input';
import { useSession,  } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShadowIcon, ClipboardIcon, CheckIcon } from '@radix-ui/react-icons';

 
export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const session = useSession();
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  const copyToClipboard = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 3000);
    });
  };
 
  return (
    <div className="mx-auto w-full max-w-lg">
      <section className="mb-auto">
        {messages.map(m => (
          <div className="flex items-start mb-4" key={m.id}>
            {m.role === 'user' ? (
              <>
                {session.data?.user?.image ? (
                  <Avatar className="mr-2">
                    <AvatarImage
                      src={session.data?.user?.image}
                      alt={session.data?.user?.name || "Account"}
                    />
                    <AvatarFallback>{session.data?.user?.name || "Account"}</AvatarFallback>
                  </Avatar>
                ) : (
                  <AvatarFallback className="mr-2">{session.data?.user?.name || "Account"}</AvatarFallback>
                )}
                <div className="flex-1">
                  <span>{m.content}</span>
                </div>
                <div className="flex-1"> 
                  {copiedMessageId === m.id ? (
                    <CheckIcon className="ml-2" />
                  ) : (
                    <ClipboardIcon className="ml-2 cursor-pointer" onClick={() => copyToClipboard(m.content, m.id)} />
                  )}
                </div>
                </>
              ) : (
                <>
                  <ShadowIcon className="h-6 w-6 mr-2" />
                  <div className="flex-1">
                    <span>{m.content}</span>
                  </div>  
                  <div className="flex-1">
                    {copiedMessageId === m.id ? (
                      <CheckIcon className="ml-2" />
                    ) : (
                      <ClipboardIcon className="ml-2 cursor-pointer" onClick={() => copyToClipboard(m.content, m.id)} />
                    )}
                  </div>
                </>
              )}
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