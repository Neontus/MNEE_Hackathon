import { AlertSettings } from "@/components/budgets/alert-settings";
import { BudgetOverview } from "@/components/budgets/budget-overview";

export default function BudgetsPage() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Budgets & Alerts</h2>
            </div>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-4">Budget Overview</h3>
                    <BudgetOverview />
                </div>
                <div>
                    <AlertSettings />
                </div>
            </div>
        </div>
    );
}
