"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Wallet, CreditCard, Coins } from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { useTreasuryBudget, useTreasuryTokenBalance } from "@/hooks/useTreasury";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function TreasurySummary() {
    const { address, isConnected } = useAccount();
    const { data: balanceData } = useBalance({
        address: address,
    });
    const usdcBalance = useTreasuryTokenBalance();
    const { dailyLimit, spentToday } = useTreasuryBudget();

    if (!isConnected) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Connect Wallet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-muted-foreground">Please connect your wallet to view treasury details.</p>
                        <ConnectButton />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ETH Balance</CardTitle>
                    <DollarSign className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {balanceData ? parseFloat(formatEther(balanceData.value)).toFixed(4) : "0.00"} {balanceData?.symbol}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">USDC Balance</CardTitle>
                    <Coins className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {usdcBalance} USDC
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Budget (Daily)</CardTitle>
                    <Wallet className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{dailyLimit} USDC</div>
                    <p className="text-muted-foreground text-xs">Reset every 24h</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Spent Today</CardTitle>
                    <CreditCard className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{spentToday} USDC</div>
                    <p className="text-muted-foreground text-xs">
                        {Number(dailyLimit) > 0 ? ((Number(spentToday) / Number(dailyLimit)) * 100).toFixed(1) : 0}% of limit
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
