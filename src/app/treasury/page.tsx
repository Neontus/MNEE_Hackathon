import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { TreasurySummary } from "@/components/dashboard/treasury-summary";

export default function TreasuryPage() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Treasury</h2>
            </div>
            <div className="space-y-4">
                <TreasurySummary />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className="col-span-4 lg:col-span-7">
                        <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
                        <RecentTransactions />
                    </div>
                </div>
            </div>
        </div>
    );
}
