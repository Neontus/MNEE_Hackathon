import { NextResponse } from "next/server";
import { getInvoices, addInvoice } from "@/lib/invoice-service";

export async function GET() {
    const invoices = await getInvoices();
    return NextResponse.json(invoices);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { client, recipientAddress, amount, dueDate } = body;

        if (!client || !recipientAddress || !amount || !dueDate) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const newInvoice = {
            id: `inv_${Date.now()}`,
            client,
            recipientAddress,
            amount,
            status: "Pending" as const,
            dueDate,
        };

        await addInvoice(newInvoice);
        return NextResponse.json(newInvoice, { status: 201 });
    } catch (error) {
        console.error("Error creating invoice:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
