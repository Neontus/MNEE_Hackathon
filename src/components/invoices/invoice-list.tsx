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
import { CreateInvoiceModal, InvoiceData } from "./create-invoice-modal";
import { SettleButton } from "./SettleButton";
import { useState } from "react";



export function InvoiceList() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [filter, setFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchInvoices = async () => {
        try {
            const res = await fetch('/api/invoices');
            const data = await res.json();
            setInvoices(data);
        } catch (error) {
            console.error("Failed to fetch invoices", error);
        } finally {
            setIsLoading(false);
        }
    };

    useState(() => {
        fetchInvoices();
    });

    const filteredInvoices = invoices.filter((inv) =>
        inv.client.toLowerCase().includes(filter.toLowerCase())
    );

    const handleCreateMetadata = async (newInvoice: InvoiceData) => {
        try {
            const res = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newInvoice),
            });
            if (res.ok) {
                fetchInvoices();
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Failed to create invoice", error);
        }
    };

    if (isLoading) return <div>Loading invoices...</div>;

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
                        {filteredInvoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No invoices found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInvoices.map((inv) => (
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
                                    <TableCell className="text-right">
                                        <div className="flex flex-col items-end gap-2">
                                            <span>{inv.amount}</span>
                                            {inv.status === "Pending" && (
                                                <SettleButton
                                                    to="0x0000000000000000000000000000000000000001" // Mock Client
                                                    amount={inv.amount.replace('$', '').replace(',', '')}
                                                    reason={`Invoice ${inv.id}`}
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
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
