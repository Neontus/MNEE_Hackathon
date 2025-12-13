import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function BudgetOverview() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Marketing Budget</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$12,000 / $20,000</div>
                    <Progress value={60} className="mt-4" />
                    <p className="text-muted-foreground text-xs mt-2">60% used</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Development Budget</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$45,000 / $50,000</div>
                    <Progress value={90} className="mt-4" />
                    <p className="text-muted-foreground text-xs mt-2">90% used</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Operations Budget</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$5,000 / $10,000</div>
                    <Progress value={50} className="mt-4" />
                    <p className="text-muted-foreground text-xs mt-2">50% used</p>
                </CardContent>
            </Card>
        </div>
    );
}
