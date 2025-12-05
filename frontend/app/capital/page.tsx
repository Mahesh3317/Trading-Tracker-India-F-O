import { CapitalSummary } from "@/components/capital/CapitalSummary"
import { TransactionForm } from "@/components/capital/TransactionForm"
import { TransactionHistoryTable } from "@/components/capital/TransactionHistoryTable"

export default function CapitalPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Capital Management</h1>
                <p className="text-muted-foreground">
                    Track your deposits, withdrawals, and monitor your Return on Investment (ROI).
                </p>
            </div>

            <CapitalSummary />

            <div className="grid gap-6 md:grid-cols-2">
                <TransactionForm />

                <TransactionHistoryTable />
            </div>
        </div>
    )
}
