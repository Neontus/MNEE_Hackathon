import fs from 'fs';
import path from 'path';

// Define the Invoice interface matching the one used in the app
export interface Invoice {
    id: string;
    client: string;
    recipientAddress: string;
    amount: string;
    status: "Paid" | "Pending" | "Overdue";
    dueDate: string;
}

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'invoices.json');

// Ensure directory exists
function ensureDataDir() {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    }
}

export async function getInvoices(): Promise<Invoice[]> {
    ensureDataDir();
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data) as Invoice[];
    } catch (error) {
        console.error("Error reading invoices:", error);
        return [];
    }
}

export async function addInvoice(invoice: Invoice): Promise<void> {
    ensureDataDir();
    const invoices = await getInvoices();
    invoices.push(invoice);
    fs.writeFileSync(DATA_FILE, JSON.stringify(invoices, null, 2));
}

export async function updateInvoiceStatus(id: string, status: "Paid" | "Pending" | "Overdue"): Promise<void> {
    ensureDataDir();
    const invoices = await getInvoices();
    const index = invoices.findIndex(inv => inv.id === id);
    if (index !== -1) {
        invoices[index].status = status;
        fs.writeFileSync(DATA_FILE, JSON.stringify(invoices, null, 2));
    }
}
