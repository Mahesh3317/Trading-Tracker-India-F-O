import { StrategyBuilder } from "@/components/strategy/StrategyBuilder"

export default function StrategyPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Strategy Builder</h1>
                <p className="text-muted-foreground">
                    Construct multi-leg strategies and visualize payoff diagrams.
                </p>
            </div>
            <StrategyBuilder />
        </div>
    )
}
