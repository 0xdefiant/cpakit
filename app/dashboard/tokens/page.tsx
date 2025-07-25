import TokenDashboardTable from "@/components/TokenDashboardTable";

export const dynamic = "force-dynamic";

export default async function Token() {
  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-4xl mx-auto space-y-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Fund Tokens</h1>
        <TokenDashboardTable />
      </section>
    </main>
  );
}
