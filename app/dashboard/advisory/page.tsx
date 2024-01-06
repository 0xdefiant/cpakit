import TaxChat from "@/components/TaxChat";
import RunThread from "@/components/RunThread";
import { DisplayThread } from "@/components/DisplayThread";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Advisory() {
  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-xl mx-auto space-y-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Advisory</h1>
        <p>Believe it or not, there is a correct way</p>
        <TaxChat />
        <RunThread />
        <DisplayThread />
      </section>
    </main>
  );
}
