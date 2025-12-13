'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Copy, RefreshCw, Send } from 'lucide-react';

export function TreasuryView() {
    const { treasury, user } = useAuth();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        const amt = parseFloat(amount);
        if (isNaN(amt) || amt <= 0) {
            setMsg({ type: 'error', text: 'Please enter a valid amount' });
            setLoading(false);
            return;
        }

        try {
            const result = await treasury.send(recipient, amt);
            if (result.success) {
                setMsg({ type: 'success', text: `Transaction successful! ID: ${result.ticketId}` });
                setAmount('');
                setRecipient('');
            } else {
                setMsg({ type: 'error', text: result.error || 'Transaction failed. Please try again.' });
            }
        } catch (err: any) {
            setMsg({ type: 'error', text: err.message || 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (treasury.address) {
            await navigator.clipboard.writeText(treasury.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const isSandbox = process.env.NEXT_PUBLIC_MNEE_ENV === 'sandbox';

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
                                    onClick={() => treasury.refresh()}
                                    className="h-8 gap-2"
                                >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    Refresh
                                </Button>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-5xl font-semibold mono tabular-nums">
                                    {treasury.balance.total.toFixed(2)}
                                </span>
                                <span className="text-xl text-muted-foreground font-medium">MNEE</span>
                            </div>
                        </div>

                        {/* Address Display */}
                        {treasury.address && (
                            <div className="pt-4 border-t">
                                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                                    Wallet Address
                                </label>
                                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                    <code className="flex-1 text-xs font-mono text-foreground break-all">
                                        {treasury.address}
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
                                <div className="text-xs text-muted-foreground mb-1">Organization</div>
                                <div className="text-sm font-medium">{user.organizationId}</div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">Network</div>
                                <div className="text-sm font-medium">BSV</div>
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

            {/* Send Transaction Panel */}
            <Card className="lg:col-span-2 p-6 border shadow-sm h-fit">
                <h2 className="text-base font-semibold mb-6">Send MNEE</h2>

                <form onSubmit={handleSend} className="space-y-4">
                    {/* Recipient Input */}
                    <div className="space-y-2">
                        <label htmlFor="recipient" className="text-sm font-medium">
                            Recipient Address
                        </label>
                        <Input
                            id="recipient"
                            placeholder="Enter wallet address"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="font-mono text-sm"
                        />
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                        <label htmlFor="amount" className="text-sm font-medium">
                            Amount
                        </label>
                        <div className="relative">
                            <Input
                                id="amount"
                                type="number"
                                step="0.000001"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pr-16 text-lg font-semibold mono"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                                MNEE
                            </span>
                        </div>
                    </div>

                    {/* Status Message */}
                    {msg && (
                        <div className={`p-3 rounded-lg text-sm ${
                            msg.type === 'success'
                                ? 'bg-success/10 text-success border border-success/20'
                                : 'bg-destructive/10 text-destructive border border-destructive/20'
                        }`}>
                            {msg.text}
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading || !treasury.address || !recipient || !amount}
                        className="w-full gap-2"
                        size="lg"
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Send Transaction
                            </>
                        )}
                    </Button>

                    {/* Info */}
                    <p className="text-xs text-muted-foreground pt-2">
                        Transactions are final and cannot be reversed. Please verify the recipient address carefully.
                    </p>
                </form>
            </Card>
        </div>
    );
}
