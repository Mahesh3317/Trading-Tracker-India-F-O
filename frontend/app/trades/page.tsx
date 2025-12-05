"use client"

import { useEffect, useState } from "react"
import { Trade, columns, TradeTable } from "@/components/trades/TradeTable"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import api from "@/lib/api"

export default function TradesPage() {
    const [trades, setTrades] = useState<Trade[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const response = await api.get("/trades/")
                setTrades(response.data)
            } catch (error) {
                console.error("Failed to fetch trades", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchTrades()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Trade Journal</h1>
                <Button asChild>
                    <Link href="/trades/new">
                        <Plus className="mr-2 h-4 w-4" /> Log Trade
                    </Link>
                </Button>
            </div>

            {isLoading ? (
                <div>Loading trades...</div>
            ) : (
                <TradeTable columns={columns} data={trades} />
            )}
        </div>
    )
}
