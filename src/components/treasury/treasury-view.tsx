'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function TreasuryView() {
    const { treasury, user } = useAuth();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        const amt = parseFloat(amount);
        if (isNaN(amt) || amt <= 0) {
            setMsg({ type: 'error', text: 'Invalid amount' });
            setLoading(false);
            return;
        }

        try {
            const result = await treasury.send(recipient, amt);
            if (result.success) {
                setMsg({ type: 'success', text: `Sent! Ticket: ${result.ticketId}` });
                setAmount('');
                setRecipient('');
            } else {
                setMsg({ type: 'error', text: result.error || 'Failed to send' });
            }
        } catch (err: any) {
            setMsg({ type: 'error', text: err.message || 'Error sending' });
        } finally {
            setLoading(false);
        }
    };

    const isSandbox = process.env.NEXT_PUBLIC_MNEE_ENV === 'sandbox';
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Card className="w-full max-w-md mx-auto mt-6">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Treasury: {user.organizationId}</span>
                    {mounted && isSandbox && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Sandbox</span>}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                        <h2 className="text-3xl font-bold">{treasury.balance.total} MNEE</h2>
                        {treasury.address && (
                            <div className="mt-2 flex items-center space-x-2">
                                <code className="text-xs text-muted-foreground bg-background p-1 rounded border flex-1 truncate">
                                    {treasury.address}
                                </code>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => navigator.clipboard.writeText(treasury.address || '')}
                                >
                                    📋
                                </Button>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                            Send Sandbox MNEE to this address to top up.
                        </p>
                    </div>

                    <form onSubmit={handleSend} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="recipient">Recipient Address</Label>
                            <Input
                                id="recipient"
                                placeholder="Enter MNEE address"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (MNEE)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.000001"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        {msg && (
                            <div className={`text-sm ${msg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {msg.text}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={loading || !treasury.address}>
                            {loading ? 'Sending...' : 'Send Funds'}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => treasury.refresh()}
                        >
                            Refresh Balance
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
