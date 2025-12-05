"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Wallet, ArrowDownUp } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/lib/api"

interface CapitalSummaryData {
    total_deposits: number
    total_withdrawals: number
    net_capital: number
    realized_pnl: number
    current_balance: number
    roi: number
}

export function CapitalSummary() {
    const [data, setData] = useState<CapitalSummaryData | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/capital/summary")
                setData(res.data)
            } catch (error) {
                console.error("Failed to fetch capital summary", error)
            }
        }
        fetchData()
    }, [])

    if (!data) return <div>Loading summary...</div>

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Capital</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{data.net_capital.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Deposits - Withdrawals</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${data.current_balance >= data.net_capital ? 'text-green-500' : 'text-red-500'}`}>
                        ₹{data.current_balance.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Including Realized P&L</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Realized P&L</CardTitle>
                    <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${data.realized_pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {data.realized_pnl >= 0 ? '+' : ''}₹{data.realized_pnl.toLocaleString()}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ROI</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${data.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {data.roi}%
                    </div>
                    <p className="text-xs text-muted-foreground">Return on Capital</p>
                </CardContent>
            </Card>
        </div>
    )
}
