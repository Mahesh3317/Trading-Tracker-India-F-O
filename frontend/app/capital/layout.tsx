import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Capital Management | Trading Tracker",
    description: "Track your trading capital and ROI",
}

export default function CapitalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
}
