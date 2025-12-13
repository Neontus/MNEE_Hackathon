"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Wallet, FileText, PieChart, MessageSquare } from "lucide-react";

const navItems = [
    {
        title: "Treasury",
        href: "/treasury",
        icon: Wallet,
    },
    {
        title: "Invoices",
        href: "/invoices",
        icon: FileText,
    },
    {
        title: "Budgets",
        href: "/budgets",
        icon: PieChart,
    },
    {
        title: "Assistant",
        href: "/chat",
        icon: MessageSquare,
    },
];

export function MainNav() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center gap-1">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all",
                            "hover:bg-accent hover:text-accent-foreground",
                            isActive
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground"
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
