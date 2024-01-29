export const dynamic = "force-dynamic";
import TxDashboardTable from "@/components/TransactionDashboardTable";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  return (
    <main className="min-h-screen p-2">
      <ResizablePanelGroup
        direction="horizontal"
        className="rounded-lg border"
      >
      <ResizablePanel defaultSize={10}>One</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel className='p-4' defaultSize={90}>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-4">Transaction Dashboard</h1>
        <TxDashboardTable />
      </ResizablePanel>
    </ResizablePanelGroup>
    </main>
  );
}
