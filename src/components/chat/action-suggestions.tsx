"use client";

import { Button } from "@/components/ui/button";

const suggestions = [
    "Show me outstanding invoices",
    "Pay all verified bills",
    "What is my current runway?",
    "Draft an invoice for Client X",
];

export function ActionSuggestions() {
    return (
        <div className="flex flex-wrap gap-2 mt-4">
            {suggestions.map((action) => (
                <Button key={action} variant="outline" size="sm" className="text-xs">
                    {action}
                </Button>
            ))}
        </div>
    );
}
