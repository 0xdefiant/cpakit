import Chat from '@/components/Chat'
import ButtonCheckout from '@/components/ButtonCheckout';
import config from '@/config';
import { ChatDisplay } from '@/components/ChatDisplay';
// import ButtonTest from '@/components/TestInput';
// import DisplayTests from '@/components/DisplayTests';

export const dynamic = "force-dynamic";

/*
<ButtonTest />
<DisplayTests />
*/

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Introduction() {
  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-xl mx-auto space-y-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">General Chat</h1>
          <Chat />
          <ChatDisplay />
      </section>
    </main>
  );
}
