import { TradeForm } from "@/components/trades/TradeForm"

export default function NewTradePage() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Log New Trade</h1>
                <p className="text-muted-foreground">
                    Enter the details of your trade execution.
                </p>
            </div>
            <TradeForm />
        </div>
    )
}
