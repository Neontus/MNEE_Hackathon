import { BudgetControl } from "@/components/dashboard/BudgetControl";
import { TreasurySummary } from "@/components/dashboard/treasury-summary";

export default function BudgetsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Budgets & Alerts</h2>
            </div>

            <div className="grid gap-6">
                <div>
                    <h3 className="text-lg font-medium mb-4">Current Status</h3>
                    <TreasurySummary />
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-4">Control</h3>
                    <div className="max-w-md">
                        <BudgetControl />
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-md bg-yellow-50/10 border border-yellow-200/20 text-sm text-muted-foreground">
                <p>Note: Alerts are currently managed via the Agent conversation. Contract-level automated alerts are in development.</p>
            </div>
        </div>
    );
}
