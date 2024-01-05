import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import Image from "next/image";
  
  const threads = [
    {
      chain: '/logos/sol.png',
      transactionType: "Paid",
      totalAmount: "$250.00",
      token: "Credit Card",
    },

    {
      chain: '/logos/sol.png',
      transactionType: "Pending",
      totalAmount: "$150.00",
      token: "PayPal",
    },

    {
      chain: '/logos/sol.png',
      transactionType: "Unpaid",
      totalAmount: "$350.00",
      token: "Bank Transfer",
    },

    {
      chain: '/logos/sol.png',
      transactionType: "Paid",
      totalAmount: "$450.00",
      token: "Credit Card",
    },

    {
      chain: '/logos/sol.png',
      transactionType: "Paid",
      totalAmount: "$550.00",
      token: "PayPal",
    },

    {
      chain: '/logos/sol.png',
      transactionType: "Unpaid",
      totalAmount: "$300.00",
      token: "Credit Card",
    },
  ]

  const threadTotal = () => {
    let total = 0;
  
    threads.forEach(thread => {
      // Remove the dollar sign and convert the string to a number
      const amount = parseFloat(thread.totalAmount.replace('$', ''));
      total += amount;
    });
  
    return total;
  }
  
  export function DashboardTable() {
    return (
      <Table>
        <TableCaption>A list of your recent threads.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Chain</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Token</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {threads.map((thread) => (
            <TableRow key={thread.chain}>
              <TableCell className="font-medium">
                <Image
                src={thread.chain}
                alt="Chain Image"
                width={50}
            
                height={50}
                />
              </TableCell>
              <TableCell>{thread.transactionType}</TableCell>
              <TableCell>{thread.token}</TableCell>
              <TableCell className="text-right">{thread.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">{`$${threadTotal().toFixed(2)}`}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )
  }
  