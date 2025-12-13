import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const transactions = [
    {
        id: "tx_1",
        type: "Payment",
        amount: "-$250.00",
        status: "Confirmed",
        date: "2023-11-23",
        to: "Vendor A",
    },
    {
        id: "tx_2",
        type: "Deposit",
        amount: "+$5,000.00",
        status: "Confirmed",
        date: "2023-11-22",
        to: "Client B",
    },
    {
        id: "tx_3",
        type: "Payment",
        amount: "-$120.50",
        status: "Pending",
        date: "2023-11-22",
        to: "Service C",
    },
    {
        id: "tx_4",
        type: "Withdrawal",
        amount: "-$1,000.00",
        status: "Confirmed",
        date: "2023-11-20",
        to: "Exchange",
    },
    {
        id: "tx_5",
        type: "Payment",
        amount: "-$45.00",
        status: "Confirmed",
        date: "2023-11-19",
        to: "SaaS Tool",
    },
];

export function RecentTransactions() {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>To/From</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((tx) => (
                        <TableRow key={tx.id}>
                            <TableCell className="font-medium">{tx.type}</TableCell>
                            <TableCell>{tx.to}</TableCell>
                            <TableCell>
                                <Badge variant={tx.status === "Confirmed" ? "secondary" : "outline"}>
                                    {tx.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{tx.date}</TableCell>
                            <TableCell className="text-right">{tx.amount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
