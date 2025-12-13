import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Wallet } from "lucide-react";

export function TreasurySummary() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                    <DollarSign className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-muted-foreground text-xs">+20.1% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ETH Holdings</CardTitle>
                    <Wallet className="text-muted-foreground h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12.5 ETH</div>
                    <p className="text-muted-foreground text-xs">~$32,000.00</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">USDC Holdings</CardTitle>
                    <div className="text-muted-foreground font-bold text-xs">USDC</div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">13,231.89</div>
                    <p className="text-muted-foreground text-xs">Stablecoin</p>
                </CardContent>
            </Card>
        </div>
    );
}
