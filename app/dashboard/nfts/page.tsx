import NftDashboardTable from '@/components/NftDashboardTable';


export const dynamic = "force-dynamic";

export default async function NFT() {
  return (
    <main className="min-h-screen p-8 pb-24">
      <section className="max-w-xl mx-auto space-y-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Fund NFTs</h1>
          <NftDashboardTable />
      </section>
    </main>
  );
}
