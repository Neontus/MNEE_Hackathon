import { SchemaType, FunctionDeclaration } from "@google/generative-ai";
import { treasury } from './treasury';
import { addInvoice, getInvoices, updateInvoiceStatus } from './invoice-service';

export const TOOLS: FunctionDeclaration[] = [
  {
    name: "get_treasury_balance",
    description: "Get the current balance of the organization's Treasury wallet in USDC.",
  },
  {
      name: "get_budget",
      description: "Get the current daily spending limit and amount spent today from the Treasury contract. Optionally specify a category.",
      parameters: {
          type: SchemaType.OBJECT,
          properties: {
              category: { type: SchemaType.STRING, description: "Optional category name (e.g. 'Marketing')." }
          },
          required: []
      }
  },
  {
      name: "set_budget",
      description: "Set the daily spending limit for the treasury. Can be global or category-specific.",
      parameters: {
          type: SchemaType.OBJECT,
          properties: {
              amount: { type: SchemaType.NUMBER, description: "The new daily limit in USDC." },
              category: { type: SchemaType.STRING, description: "Optional category name." }
          },
          required: ["amount"]
      }
  },
  {
    name: "send_payment",
    description: "Execute a payment from the Treasury to a recipient. Requires Agent authorization.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        to: { type: SchemaType.STRING, description: "The recipient's address." },
        amount: { type: SchemaType.NUMBER, description: "The amount of USDC to send." },
        reason: { type: SchemaType.STRING, description: "Reason for payment." },
        category: { type: SchemaType.STRING, description: "Optional budget category." }
      },
      required: ["to", "amount", "reason"],
    },
  },
  {
      name: "create_invoice",
      description: "Create a new invoice in the system.",
      parameters: {
          type: SchemaType.OBJECT,
          properties: {
              client: { type: SchemaType.STRING },
              recipientAddress: { type: SchemaType.STRING, description: "Address to receive payment." },
              amount: { type: SchemaType.STRING, description: "Amount with currency e.g. '$100.00' or '100 USDC'" },
              dueDate: { type: SchemaType.STRING, description: "YYYY-MM-DD" }
          },
          required: ["client", "recipientAddress", "amount", "dueDate"]
      }
  },
  {
      name: "get_invoices",
      description: "List all invoices and their status.",
  },
  {
      name: "settle_invoice",
      description: "Pay an invoice and mark it as paid. This executes a blockchain transaction.",
      parameters: {
          type: SchemaType.OBJECT,
          properties: {
              invoiceId: { type: SchemaType.STRING },
              amount: { type: SchemaType.NUMBER, description: "Numeric amount of USDC to pay." },
              to: { type: SchemaType.STRING, description: "Recipient address for the invoice payment." }
          },
          required: ["invoiceId", "amount", "to"]
      }
  }
];

export async function executeTool(name: string, args: any) {
  console.log(`Executing tool: ${name}`, args);
  try {
    switch (name) {
      case "get_treasury_balance": {
        const balance = await treasury.getBalance();
        return {
          result: {
            confirmed: balance.confirmed,
            total: balance.total,
            unit: "USDC",
            summary: `The treasury balance is ${balance.total} USDC.`
          }
        };
      }
      case "get_budget": {
          const { category } = args;
          const budget = await treasury.getBudget(category);
          return {
              result: {
                  ...budget,
                  unit: "USDC",
                  summary: `Limit: ${budget.dailyLimit} USDC. Spent: ${budget.spentToday} USDC.${category ? ` (Category: ${category})` : ' (Global)'}`
              }
          };
      }
      case "set_budget": {
          const { amount, category } = args;
          // Note: Agents generally cannot sign write transactions directly unless they have the owner key or specific permission.
          // For the Treasury contract, 'setDailyLimit' is usually onlyOwner.
          // However, we can TRY to propose it or execute if the agent key has permission.
          // The current contract likely restricts this to Owner. 
          // If Agent is NOT owner, this will fail.
          // Let's assume for this project the Agent might be the owner or has permission.
          // If not, we return a message explaining why.
          
          try {
             // We need a setBudget function in treasury service
             const result = await treasury.setBudget(amount, category);
             return { result };
          } catch (e: any) {
              return { error: `Failed to set budget: ${e.message}. Ensure Agent wallet is Owner.` };
          }
      }
      case "send_payment": {
        const { to, amount, reason, category } = args;
        const result = await treasury.pay(to, amount, reason, category);
        return { result };
      }
      case "create_invoice": {
          const { client, recipientAddress, amount, dueDate } = args;
          await addInvoice({
              id: `inv_${Date.now()}`,
              client,
              recipientAddress,
              amount,
              status: "Pending",
              dueDate
          });
          return { result: { success: true, message: "Invoice created." } };
      }
      case "get_invoices": {
          const invoices = await getInvoices();
          return { result: { invoices } };
      }
      case "settle_invoice": {
          const { invoiceId, amount, to } = args;
          // 1. Pay (In real settlement, we might check invoice category? For now usage global or infer?)
          // Let's assume general payment for settlement.
          const payResult = await treasury.pay(to, amount, `Settling invoice ${invoiceId}`);
          
          if (payResult.success) {
              // 2. Update status
              await updateInvoiceStatus(invoiceId, "Paid");
              return { result: { success: true, message: `Invoice ${invoiceId} settled. Tx: ${payResult.txHash}` } };
          } else {
              return { result: { success: false, message: `Payment failed: ${payResult.message}` } };
          }
      }
      default:
        return { error: `Tool ${name} not found` };
    }
  } catch (error: any) {
    console.error(`Error executing tool ${name}:`, error);
    return { error: error.message || 'Unknown execution error' };
  }
}
