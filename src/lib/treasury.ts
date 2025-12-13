import Mnee from '@mnee/ts-sdk';
import { mnee } from './mnee';
import type { TransferResponse } from '@mnee/ts-sdk';

const MNEMONIC = process.env.TREASURY_MNEMONIC;

class TreasuryService {
  private wallet: any | null = null; // Typing 'any' for now as HDWallet type might be dynamic from SDK
  private mneeInstance: Mnee;
  private readonly DERIVATION_PATH = "m/44'/236'/0'";

  constructor(mneeInstance: Mnee, mnemonic?: string) {
    this.mneeInstance = mneeInstance;
    if (mnemonic) {
      try {
        this.wallet = this.mneeInstance.HDWallet(mnemonic, {
          derivationPath: this.DERIVATION_PATH,
        });
      } catch (error) {
        console.error("Failed to initialize Treasury Wallet:", error);
      }
    } else {
        console.warn("TREASURY_MNEMONIC is missing");
    }
  }

  async getAddress(index = 0): Promise<string | null> {
    if (!this.wallet) return null;
    const addressInfo = await this.wallet.deriveAddress(index, false);
    return addressInfo.address;
  }

  async getBalance(): Promise<{ confirmed: number, unconfirmed: number, total: number }> {
    const address = await this.getAddress();
    if (!address) return { confirmed: 0, unconfirmed: 0, total: 0 };
    
    // SDK balance returns { address, amount, decimalAmount }
    // amount is in atomic units? Documentation says:
    // "amount: number" (atomic?), "decimalAmount: number" (MNEE?)
    // "1 MNEE = 100,000 atomic units"
    // "SDK methods expecting amounts use MNEE values (not atomic)"
    // Let's return total MNEE for simplicity
    try {
        const balance = await this.mneeInstance.balance(address);
        // Assuming balance.amount is atomic based on docs: "amount: number; // Atomic units" ?
        // Wait, doc says: "Returns: { address: string, amount: number, decimalAmount: number }"
        // And under Unit System: "User-facing amounts should be in MNEE (decimal)"
        // Let's assume decimalAmount is the one strictly for display if available, but docs are slightly ambiguous.
        // Re-reading docs: "amount: number (atomic units)" in FeeTier section, but for Balance it just says "amount, decimalAmount".
        // Usually 'amount' is sats/atomic. 'decimalAmount' is float.
        return { confirmed: 0, unconfirmed: 0, total: balance.decimalAmount || 0 };
    } catch (e) {
        console.error("Failed to fetch balance", e);
        return { confirmed: 0, unconfirmed: 0, total: 0 };
    }
  }

  async send(toAddress: string, amountMnee: number): Promise<TransferResponse | null> {
    const fromAddressInfo = await this.wallet?.deriveAddress(0, false);
    if (!fromAddressInfo) throw new Error("Treasury wallet not initialized");

    const privateKeyWif = fromAddressInfo.privateKey;
    
    // SDK transfer takes recipients and sender private key
    // recipients: [{ address, amount }]
    // "amount" in recipients checks: "amount: 10.5". So it takes MNEE units.
    
    try {
        const recipients = [{ address: toAddress, amount: amountMnee }];
        const response = await this.mneeInstance.transfer(
            recipients,
            privateKeyWif,
            { broadcast: true }
        );
        return response;
    } catch (e) {
        console.error("Transfer failed", e);
        throw e;
    }
  }
}

export const treasury = new TreasuryService(mnee, MNEMONIC);
