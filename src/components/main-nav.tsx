"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Receipt, PiggyBank, Bot } from "lucide-react";

const navItems = [
    {
        title: "Treasury",
        href: "/treasury",
        icon: LayoutDashboard,
    },
    {
        title: "Invoices",
        href: "/invoices",
        icon: Receipt,
    },
    {
        title: "Budgets",
        href: "/budgets",
        icon: PiggyBank,
    },
    {
        title: "Agent Chat",
        href: "/chat",
        icon: Bot,
    },
];

export function MainNav() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                        pathname === item.href
                            ? "text-primary"
                            : "text-muted-foreground"
                    )}
                >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                </Link>
            ))}
        </nav>
    );
}
