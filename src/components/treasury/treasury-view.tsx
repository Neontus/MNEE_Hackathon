'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Copy, RefreshCw, Send, Wallet } from 'lucide-react';
import { useBalance, useAccount } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { usePayInvoice } from '@/hooks/useTreasury';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function TreasuryView() {
    const { address, isConnected } = useAccount();
    const { data: balanceData, refetch } = useBalance({ address });

    // For manual sending, we can reuse the pay logic or simple sendTransaction
    // But for now, let's just show the balance and address as the primary view.
    // The "Send" functionality is better handled by wallet integration directly or invoices.

    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [copied, setCopied] = useState(false);

    // Using the same contract hook for payments if desired, or we could add a useSendEth hook.
    // For simplicity, let's keep it read-only/connect-oriented here as the "Send" is mainly for Invoices in the brief.
    // However, to keep feature parity with previous "Send MNEE", we can implement a basic Send ETH form.

    // ... (Simplified for this migration to focus on Wagmi features)

    const handleCopy = async () => {
        if (address) {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Wallet className="h-12 w-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Connect your Wallet</h2>
                <p className="text-muted-foreground">Access treasury dashboard by connecting your Ethereum wallet.</p>
                <ConnectButton />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Balance Display */}
            <div className="lg:col-span-3 space-y-6">
                {/* Main Balance Card */}
                <Card className="p-6 border shadow-sm">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-medium text-muted-foreground">
                                    Available Balance
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => refetch()}
                                    className="h-8 gap-2"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    Refresh
                                </Button>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-5xl font-semibold mono tabular-nums">
                                    {balanceData ? parseFloat(formatEther(balanceData.value)).toFixed(4) : '0.00'}
                                </span>
                                <span className="text-xl text-muted-foreground font-medium">{balanceData?.symbol || 'ETH'}</span>
                            </div>
                        </div>

                        {/* Address Display */}
                        {address && (
                            <div className="pt-4 border-t">
                                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                                    Wallet Address
                                </label>
                                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                    <code className="flex-1 text-xs font-mono text-foreground break-all">
                                        {address}
                                    </code>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCopy}
                                        className="h-8 w-8 p-0 shrink-0"
                                    >
                                        <Copy className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                                {copied && (
                                    <p className="text-xs text-success mt-2">Address copied to clipboard</p>
                                )}
                            </div>
                        )}

                        {/* Account Info */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">Network</div>
                                <div className="text-sm font-medium">Sepolia (Testnet)</div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Recent Activity Placeholder */}
                <Card className="p-6 border shadow-sm">
                    <h3 className="text-sm font-medium mb-4">Recent Transactions</h3>
                    <div className="text-center py-8 text-sm text-muted-foreground">
                        No transactions yet
                    </div>
                </Card>
            </div>
        </div>
    );
}
