import { SchemaType, FunctionDeclaration } from "@google/generative-ai";
import { treasury } from './treasury';

export const TOOLS: FunctionDeclaration[] = [
  {
    name: "get_treasury_balance",
    description: "Get the current balance of the organization's MNEE treasury wallet. Returns the confirmed, unconfirmed, and total balance in MNEE.",
  },
  {
    name: "send_mnee",
    description: "Send MNEE tokens from the treasury to another address.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        to: {
          type: SchemaType.STRING,
          description: "The recipient's MNEE/BSV address.",
        },
        amount: {
          type: SchemaType.NUMBER,
          description: "The amount of MNEE to send.",
        },
      },
      required: ["to", "amount"],
    },
  },
];

export async function executeTool(name: string, args: any) {
  console.log(`Executing tool: ${name}`, args);
  try {
    switch (name) {
      case "get_treasury_balance": {
        const balance = await treasury.getBalance();
        console.log("SERVER LOG: get_treasury_balance result:", balance);
        return {
          result: {
            confirmed: balance.confirmed,
            unconfirmed: balance.unconfirmed,
            total: balance.total,
            unit: "MNEE",
            summary: `The treasury balance is ${balance.total} MNEE.`
          }
        };
      }
      case "send_mnee": {
        const { to, amount } = args;
        if (!to || !amount) {
            throw new Error("Missing parameters for send_mnee");
        }
        const numericAmount = Number(amount);
        const result = await treasury.send(to, numericAmount);
        
        if (result?.ticketId) {
             return {
                result: {
                    success: true,
                    ticketId: result.ticketId,
                    message: `Successfully sent ${amount} MNEE to ${to}`
                }
             };
        } else {
            return {
                error: "Transaction failed (no ticketId returned)"
            }
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
