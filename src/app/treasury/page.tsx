import { TreasuryView } from "@/components/treasury/treasury-view";

export default function TreasuryPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">Treasury</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your crypto assets and send transactions
                </p>
            </div>
            <TreasuryView />
        </div>
    );
}
