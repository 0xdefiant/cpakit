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
  
  const threads = [
    {
      thread: "INV001",
      completionStatus: "Paid",
      totalAmount: "$250.00",
      transactionType: "Credit Card",
    },
    {
      thread: "INV002",
      completionStatus: "Pending",
      totalAmount: "$150.00",
      transactionType: "PayPal",
    },
    {
      thread: "INV003",
      completionStatus: "Unpaid",
      totalAmount: "$350.00",
      transactionType: "Bank Transfer",
    },
    {
      thread: "INV004",
      completionStatus: "Paid",
      totalAmount: "$450.00",
      transactionType: "Credit Card",
    },
    {
      thread: "INV005",
      completionStatus: "Paid",
      totalAmount: "$550.00",
      transactionType: "PayPal",
    },
    {
      thread: "INV006",
      completionStatus: "Pending",
      totalAmount: "$200.00",
      transactionType: "Bank Transfer",
    },
    {
      thread: "INV007",
      completionStatus: "Unpaid",
      totalAmount: "$300.00",
      transactionType: "Credit Card",
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
  }// update this javascript react code to add the totalAmount elements from each thread to the total variable.
  
  export function DashboardTable() {
    return (
      <Table>
        <TableCaption>A list of your recent threads.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Thread</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {threads.map((thread) => (
            <TableRow key={thread.thread}>
              <TableCell className="font-medium">{thread.thread}</TableCell>
              <TableCell>{thread.completionStatus}</TableCell>
              <TableCell>{thread.transactionType}</TableCell>
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
  