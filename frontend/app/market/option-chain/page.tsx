"use client"

import { useEffect, useState, useRef } from "react"
import { OptionChainTable } from "@/components/market/OptionChainTable"
import { SpotPriceTicker } from "@/components/market/SpotPriceTicker"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function OptionChainPage() {
    const [data, setData] = useState<any>(null)
    const [isConnected, setIsConnected] = useState(false)
    const wsRef = useRef<WebSocket | null>(null)
    const [symbol, setSymbol] = useState("NIFTY")

    useEffect(() => {
        // Initialize WebSocket connection
        // Initialize WebSocket connection
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
        const wsHost = apiUrl.replace(/^https?:\/\//, '');
        const ws = new WebSocket(`${wsProtocol}://${wsHost}/market/ws/${symbol}`);

        ws.onopen = () => {
            console.log("Connected to Market Data WS")
            setIsConnected(true)
        }

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setData(message)
        }

        ws.onclose = () => {
            console.log("Disconnected from Market Data WS")
            setIsConnected(false)
        }

        wsRef.current = ws

        return () => {
            if (wsRef.current) {
                wsRef.current.close()
            }
        }
    }, [symbol])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Option Chain (Real-time)</h1>
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-sm text-muted-foreground">
                        {isConnected ? "Live" : "Disconnected"}
                    </span>
                </div>
            </div>

            {data && (
                <SpotPriceTicker
                    symbol={data.symbol}
                    price={data.spot_price}
                />
            )}

            {data ? (
                <OptionChainTable
                    data={data.strikes}
                    spotPrice={data.spot_price}
                />
            ) : (
                <div className="flex items-center justify-center h-64 border rounded-lg">
                    <div className="text-center space-y-2">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground">Connecting to market feed...</p>
                    </div>
                </div>
            )}
        </div>
    )
}
