"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export function AlertSettings() {
    const [alerts, setAlerts] = useState({
        budgetOverrun: true,
        newInvoice: true,
        largeTransaction: true,
        weeklyReport: false,
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications & Alerts</CardTitle>
                <CardDescription>
                    Manage your notification preferences.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="budget-overrun" className="flex flex-col space-y-1">
                        <span>Budget Overrun</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Notify when a budget exceeds 90%.
                        </span>
                    </Label>
                    <Switch
                        id="budget-overrun"
                        checked={alerts.budgetOverrun}
                        onCheckedChange={(c) => setAlerts({ ...alerts, budgetOverrun: c })}
                    />
                </div>
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="new-invoice" className="flex flex-col space-y-1">
                        <span>New Invoice</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Notify when a new invoice is created.
                        </span>
                    </Label>
                    <Switch
                        id="new-invoice"
                        checked={alerts.newInvoice}
                        onCheckedChange={(c) => setAlerts({ ...alerts, newInvoice: c })}
                    />
                </div>
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="large-transaction" className="flex flex-col space-y-1">
                        <span>Large Transaction</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Notify for transactions over $1,000.
                        </span>
                    </Label>
                    <Switch
                        id="large-transaction"
                        checked={alerts.largeTransaction}
                        onCheckedChange={(c) => setAlerts({ ...alerts, largeTransaction: c })}
                    />
                </div>
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="weekly-report" className="flex flex-col space-y-1">
                        <span>Weekly Report</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Receive a weekly summary of financial activity.
                        </span>
                    </Label>
                    <Switch
                        id="weekly-report"
                        checked={alerts.weeklyReport}
                        onCheckedChange={(c) => setAlerts({ ...alerts, weeklyReport: c })}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
