import { createPublicClient, createWalletClient, http, formatUnits, parseUnits } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { TOKENS, ERC20_ABI } from './constants/tokens';
import { TREASURY_ABI } from './contracts/abi';

// Default to Sepolia
const client = createPublicClient({
  chain: sepolia,
  transport: http()
});

const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS as `0x${string}`;
const AGENT_KEY = process.env.AGENT_PRIVATE_KEY as `0x${string}`;

class TreasuryService {
  async getAddress(): Promise<string | null> {
    return TREASURY_ADDRESS || null;
  }

  async getBalance(): Promise<{ confirmed: string, unconfirmed: number, total: string }> {
    if (!TREASURY_ADDRESS) return { confirmed: '0', unconfirmed: 0, total: '0' };
    
    try {
        const balance = await client.readContract({
            address: TOKENS.sepolia.USDC,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [TREASURY_ADDRESS]
        });
        
        const formatted = formatUnits(balance, 6); // USDC has 6 decimals
        return { confirmed: formatted, unconfirmed: 0, total: formatted };
    } catch (e) {
        console.error("Failed to fetch balance", e);
        return { confirmed: '0', unconfirmed: 0, total: '0' };
    }
  }

  async getBudget(category?: string): Promise<{ dailyLimit: string, spentToday: string }> {
      if (!TREASURY_ADDRESS) return { dailyLimit: '0', spentToday: '0' };

      try {
          if (category) {
              const [limit, spent] = await Promise.all([
                  client.readContract({
                      address: TREASURY_ADDRESS,
                      abi: TREASURY_ABI,
                      functionName: 'categoryLimits',
                      args: [category]
                  }),
                  client.readContract({
                      address: TREASURY_ADDRESS,
                      abi: TREASURY_ABI,
                      functionName: 'categorySpent',
                      args: [category]
                  })
              ]);
              return {
                  dailyLimit: formatUnits(limit, 6),
                  spentToday: formatUnits(spent, 6)
              };
          } else {
              const [limit, spent] = await Promise.all([
                  client.readContract({
                      address: TREASURY_ADDRESS,
                      abi: TREASURY_ABI,
                      functionName: 'dailyLimit'
                  }),
                  client.readContract({
                      address: TREASURY_ADDRESS,
                      abi: TREASURY_ABI,
                      functionName: 'spentToday'
                  })
              ]);
              return {
                  dailyLimit: formatUnits(limit, 6),
                  spentToday: formatUnits(spent, 6)
              };
          }
      } catch (e) {
          console.error("Failed to fetch budget", e);
          return { dailyLimit: '0', spentToday: '0' };
      }
  }

  async pay(to: string, amount: number, reason: string, category?: string): Promise<{ success: boolean; txHash?: string; message?: string }> {
      if (!AGENT_KEY) {
          return { 
              success: false, 
              message: "Agent private key not configured. I can only propose transactions." 
          };
      }

      try {
          const account = privateKeyToAccount(AGENT_KEY);
          
          // Verify authorization
          const agentAddress = await client.readContract({
              address: TREASURY_ADDRESS,
              abi: TREASURY_ABI,
              functionName: 'agent',
          });
          
          if (agentAddress.toLowerCase() !== account.address.toLowerCase()) {
              return {
                  success: false,
                  message: `Agent Wallet (${account.address}) is not authorized on Treasury Contract. Expected Agent: (${agentAddress}). Please update the contract owner to set this agent or change the valid agent key.`
              };
          }

          const wallet = createWalletClient({
              account,
              chain: sepolia,
              transport: http()
          });

          const amountUnits = parseUnits(amount.toString(), 6);
          
          if (category) {
              const { request } = await client.simulateContract({
                  account,
                  address: TREASURY_ADDRESS,
                  abi: TREASURY_ABI,
                  functionName: 'payCategory',
                  args: [TOKENS.sepolia.USDC, to as `0x${string}`, amountUnits, reason, category]
              });
              const hash = await wallet.writeContract(request);
              return { success: true, txHash: hash, message: `Payment sent! Tx: ${hash}` };
          } else {
              const { request } = await client.simulateContract({
                  account,
                  address: TREASURY_ADDRESS,
                  abi: TREASURY_ABI,
                  functionName: 'pay',
                  args: [TOKENS.sepolia.USDC, to as `0x${string}`, amountUnits, reason]
              });
              const hash = await wallet.writeContract(request);
              return { success: true, txHash: hash, message: `Payment sent! Tx: ${hash}` };
          }

      } catch (e: any) {
          console.error("Payment failed", e);
          return { success: false, message: e.message || "Payment execution failed." };
      }
  }

  // Legacy send (proposal)
  async send(toAddress: string, amount: number): Promise<{ ticketId?: string }> {
      console.warn("Using proposal mechanism.");
      // In a real app, strict proposal logic here.
      return { ticketId: `prop_${Date.now()}` }; 
  }

  async setBudget(amount: number, category?: string): Promise<{ success: boolean; txHash?: string; message?: string }> {
      if (!AGENT_KEY) return { success: false, message: "No Agent Key" };

      try {
          const account = privateKeyToAccount(AGENT_KEY);
          const wallet = createWalletClient({
              account,
              chain: sepolia,
              transport: http()
          });
          
          const amountUnits = parseUnits(amount.toString(), 6);

          if (category) {
              const { request } = await client.simulateContract({
                  account,
                  address: TREASURY_ADDRESS,
                  abi: TREASURY_ABI,
                  functionName: 'setCategoryLimit',
                  args: [category, amountUnits]
              });
              const hash = await wallet.writeContract(request);
              return { success: true, txHash: hash, message: `Category Budget Set. Tx: ${hash}` };
          } else {
              const { request } = await client.simulateContract({
                  account,
                  address: TREASURY_ADDRESS,
                  abi: TREASURY_ABI,
                  functionName: 'setDailyLimit',
                  args: [amountUnits]
              });
              const hash = await wallet.writeContract(request);
              return { success: true, txHash: hash, message: `Daily Budget Set. Tx: ${hash}` };
          }

      } catch (e: any) {
         console.error("Set Budget Failed", e);
         return { success: false, message: e.message || "Set Budget failed" };
      }
  }
}

export const treasury = new TreasuryService();
