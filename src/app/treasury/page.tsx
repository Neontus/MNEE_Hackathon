import { TreasuryView } from "@/components/treasury/treasury-view";

export default function TreasuryPage() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Treasury</h2>
            </div>
            <div className="space-y-4">
                <TreasuryView />
            </div>
        </div>
    );
}
