'use server'

import { treasury } from './treasury';

export async function getTreasuryBalance() {
  const balance = await treasury.getBalance();
  // Return simple object (server actions must return serializable data)
  return {
    confirmed: balance.confirmed,
    unconfirmed: balance.unconfirmed,
    total: balance.total,
  };
}

export async function getTreasuryAddress() {
    return await treasury.getAddress();
}

export async function sendTreasuryTransaction(to: string, amount: number) {
  try {
    const result = await treasury.send(to, amount);
    return { success: true, ticketId: result?.ticketId, error: null };
  } catch (error: any) {
    return { success: false, ticketId: null, error: error.message || 'Transaction failed' };
  }
}
