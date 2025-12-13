"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Invoice {
    client: string;
    amount: string;
    status: string;
    dueDate: string;
}

export interface InvoiceData {
    client: string;
    amount: string;
    status: string;
    dueDate: string;
}

interface CreateInvoiceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (invoice: InvoiceData) => void;
}

export function CreateInvoiceModal({
    open,
    onOpenChange,
    onSubmit,
}: CreateInvoiceModalProps) {
    const [client, setClient] = useState("");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            client,
            amount: `$${amount}`,
            status: "Pending",
            dueDate,
        });
        setClient("");
        setAmount("");
        setDueDate("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Invoice</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new invoice here.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="client" className="text-right">
                                Client
                            </Label>
                            <Input
                                id="client"
                                value={client}
                                onChange={(e) => setClient(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                                Amount
                            </Label>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                                Due Date
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create Invoice</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
