import { InvoiceList } from "@/components/invoices/invoice-list";

export default function InvoicesPage() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Bills & Invoices</h2>
            </div>
            <div className="space-y-4">
                <InvoiceList />
            </div>
        </div>
    );
}
