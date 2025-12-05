"use client"

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts"

interface PayoffPoint {
    x: number
    y: number
}

interface PayoffDiagramProps {
    data: PayoffPoint[]
}

export function PayoffDiagram({ data }: PayoffDiagramProps) {
    if (!data || data.length === 0) {
        return (
            <div className="h-[400px] flex items-center justify-center border rounded-lg bg-slate-50 dark:bg-slate-900 text-muted-foreground">
                Add legs to see payoff diagram
            </div>
        )
    }

    // Find min/max for domain
    const minPnl = Math.min(...data.map(d => d.y))
    const maxPnl = Math.max(...data.map(d => d.y))
    const padding = (maxPnl - minPnl) * 0.1

    return (
        <div className="h-[400px] w-full border rounded-lg p-4 bg-white dark:bg-slate-950">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis
                        dataKey="x"
                        type="number"
                        domain={['auto', 'auto']}
                        tickFormatter={(val) => val.toFixed(0)}
                        className="text-xs"
                    />
                    <YAxis
                        domain={[minPnl - padding, maxPnl + padding]}
                        className="text-xs"
                    />
                    <Tooltip
                        formatter={(value: number) => [`₹${value.toFixed(2)}`, "P&L"]}
                        labelFormatter={(label: number) => `Price: ${label.toFixed(2)}`}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />
                    <Line
                        type="monotone"
                        dataKey="y"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
