import { Button } from "@/components/ui/button";
import { usePayInvoice } from "@/hooks/useTreasury";
import { Loader2 } from "lucide-react";

interface SettleButtonProps {
    to: `0x${string}`;
    amount: string; // USDC amount string e.g. "100.50"
    reason: string;
}

export function SettleButton({ to, amount, reason }: SettleButtonProps) {
    const { pay, isPending, isSuccess, error } = usePayInvoice();

    const handlePay = () => {
        pay(to, amount, reason);
    };

    if (isSuccess) {
        // Ideally show success state visually
    }

    return (
        <Button
            onClick={handlePay}
            disabled={isPending || isSuccess}
            variant={isSuccess ? "outline" : "default"}
            size="sm"
        >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSuccess ? "Sent" : "Pay in USDC"}
        </Button>
    );
}
