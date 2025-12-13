# Components Documentation

This directory contains all the React components for the application.

## Structure

- **ui/**: Reusable UI components from `shadcn-ui`. Do not modify these directly unless customizing the design system.
- **dashboard/**: Components specific to the Treasury Dashboard view (e.g., `TreasurySummary`, `RecentTransactions`).
- **invoices/**: Components for managing bills and invoices (e.g., `InvoiceList`, `CreateInvoiceModal`).
- **budgets/**: Components for budget tracking and alerts (e.g., `BudgetOverview`, `AlertSettings`).
- **chat/**: Components for the Agent Chat interface (e.g., `ChatInterface`).

## Usage

Import components using the `@/components` alias:

```tsx
import { TreasurySummary } from "@/components/dashboard/treasury-summary";
import { Button } from "@/components/ui/button";
```
