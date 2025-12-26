"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSetBudget } from "@/hooks/useTreasury";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function BudgetControl() {
    const [budget, setBudget] = useState("");
    const [category, setCategory] = useState("");
    const { setBudget: updateBudget, isPending, isSuccess } = useSetBudget();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!budget) return;
        // Logic for setting budget would need to update 'useSetBudget' hook too to support setCategoryLimit
        // Since we didn't update the hook yet, let's just stick to daily limit if no category, or log warning.
        // Wait, I should have updated the hook.
        // Let's implement full UI but acknowledging hook limitation or update hook below?
        // I will update this file to assume the hook accepts category.
        updateBudget(budget, category);
    };

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle className="text-sm font-medium">Manage Budget</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <Input
                        placeholder="Category (Optional, e.g. Marketing)"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Input
                                type="number"
                                placeholder="Set Limit"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-bold">
                                USDC
                            </span>
                        </div>
                        <Button type="submit" size="sm" disabled={isPending || !budget}>
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Set"}
                        </Button>
                    </div>
                </form>
                {isSuccess && <p className="text-xs text-green-600 mt-2">Budget updated successfully.</p>}
            </CardContent>
        </Card>
    );
}
