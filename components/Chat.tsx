'use client';
 
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button'
import { Input } from './ui/input';
import { useSession,  } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShadowIcon, ClipboardIcon } from '@radix-ui/react-icons';

 
export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const session = useSession();

  const copyToClipboard = (content: string ) => {
    navigator.clipboard.writeText(content).then(() => {
      // Optionally, you can display a message confirming the text was copied
      console.log('Text copied to clipboard');
    });
  };
 
  return (
    <main className="mx-auto w-full h-screen max-w-lg p-24">
      <section className="mb-auto m">
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
                  <ClipboardIcon className="ml-2 cursor-pointer" onClick={() => copyToClipboard(m.content)} />
                </div>
              </>
            ) : (
              <>
                <ShadowIcon className="h-6 w-6 mr-2" />
                <div className="flex-1">
                  <span>{m.content}</span>
                  <ClipboardIcon className="ml-2 cursor-pointer" onClick={() => copyToClipboard(m.content)} />
                </div>
              </>
            )}
          </div>
        ))}
      </section>


      <form className="flex space-x-4" onSubmit={handleSubmit}>
        <Input
          className="rounded-md p-2"
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
    </main>
  );
}