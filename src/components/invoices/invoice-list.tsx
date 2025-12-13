"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { CreateInvoiceModal } from "./create-invoice-modal";
import { useState } from "react";

const initialInvoices = [
    {
        id: "inv_001",
        client: "Acme Corp",
        amount: "$1,200.00",
        status: "Paid",
        dueDate: "2023-12-01",
    },
    {
        id: "inv_002",
        client: "Globex Inc",
        amount: "$3,450.00",
        status: "Pending",
        dueDate: "2023-12-15",
    },
    {
        id: "inv_003",
        client: "Soylent Corp",
        amount: "$800.00",
        status: "Overdue",
        dueDate: "2023-11-20",
    },
];

export function InvoiceList() {
    const [invoices, setInvoices] = useState(initialInvoices);
    const [filter, setFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredInvoices = invoices.filter((inv) =>
        inv.client.toLowerCase().includes(filter.toLowerCase())
    );

    const handleCreateMetadata = (newInvoice: any) => {
        setInvoices([...invoices, { ...newInvoice, id: `inv_${Date.now()}` }]);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Input
                    placeholder="Filter client..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="max-w-sm"
                />
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Invoice
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInvoices.map((inv) => (
                            <TableRow key={inv.id}>
                                <TableCell className="font-medium">{inv.id}</TableCell>
                                <TableCell>{inv.client}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            inv.status === "Paid"
                                                ? "secondary"
                                                : inv.status === "Overdue"
                                                    ? "destructive"
                                                    : "outline"
                                        }
                                    >
                                        {inv.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{inv.dueDate}</TableCell>
                                <TableCell className="text-right">{inv.amount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <CreateInvoiceModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSubmit={handleCreateMetadata}
            />
        </div>
    );
}
