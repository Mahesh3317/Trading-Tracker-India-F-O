import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Strategy Builder | Trading Tracker",
    description: "Build and analyze F&O strategies",
}

export default function StrategyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
}
