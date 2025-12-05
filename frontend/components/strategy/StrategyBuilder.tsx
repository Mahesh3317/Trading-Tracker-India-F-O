"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save, RefreshCw } from "lucide-react"
import { PayoffDiagram } from "./PayoffDiagram"
import api from "@/lib/api"

interface Leg {
    id: string
    type: "CE" | "PE" | "FUT"
    strike?: string
    side: "BUY" | "SELL"
    quantity: string
    entry_price: string
}

export function StrategyBuilder() {
    const [legs, setLegs] = useState<Leg[]>([
        { id: "1", type: "CE", strike: "21500", side: "BUY", quantity: "50", entry_price: "100" }
    ])
    const [payoffData, setPayoffData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [strategyName, setStrategyName] = useState("")

    const addLeg = () => {
        setLegs([
            ...legs,
            { id: Math.random().toString(), type: "CE", strike: "", side: "BUY", quantity: "50", entry_price: "" }
        ])
    }

    const removeLeg = (id: string) => {
        setLegs(legs.filter(l => l.id !== id))
    }

    const updateLeg = (id: string, field: keyof Leg, value: string) => {
        setLegs(legs.map(l => l.id === id ? { ...l, [field]: value } : l))
    }

    const calculatePayoff = async () => {
        setIsLoading(true)
        try {
            // Convert strings to numbers for API
            const apiLegs = legs.map(l => ({
                type: l.type,
                strike: l.strike ? parseFloat(l.strike) : undefined,
                side: l.side,
                quantity: parseInt(l.quantity),
                entry_price: parseFloat(l.entry_price)
            }))

            const res = await api.post("/strategies/payoff", apiLegs)
            setPayoffData(res.data)
        } catch (error) {
            console.error("Failed to calculate payoff", error)
        } finally {
            setIsLoading(false)
        }
    }

    const saveStrategy = async () => {
        if (!strategyName) return
        try {
            const payload = {
                name: strategyName,
                description: "Custom Strategy",
                legs: JSON.stringify(legs)
            }
            await api.post("/strategies/", payload)
            // Show success toast (placeholder)
            alert("Strategy saved!")
        } catch (error) {
            console.error("Failed to save strategy", error)
        }
    }

    useEffect(() => {
        calculatePayoff()
    }, []) // Initial calculation

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Strategy Legs</CardTitle>
                        <Button size="sm" onClick={addLeg} variant="outline">
                            <Plus className="h-4 w-4 mr-2" /> Add Leg
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {legs.map((leg) => (
                            <div key={leg.id} className="flex gap-2 items-end p-3 border rounded-lg bg-slate-50 dark:bg-slate-900">
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 w-full">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium">Type</label>
                                        <Select value={leg.type} onValueChange={(v) => updateLeg(leg.id, "type", v)}>
                                            <SelectTrigger className="h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="CE">Call</SelectItem>
                                                <SelectItem value="PE">Put</SelectItem>
                                                <SelectItem value="FUT">Fut</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium">Side</label>
                                        <Select value={leg.side} onValueChange={(v) => updateLeg(leg.id, "side", v)}>
                                            <SelectTrigger className="h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="BUY">Buy</SelectItem>
                                                <SelectItem value="SELL">Sell</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {leg.type !== "FUT" && (
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium">Strike</label>
                                            <Input
                                                className="h-8"
                                                placeholder="21500"
                                                value={leg.strike}
                                                onChange={(e) => updateLeg(leg.id, "strike", e.target.value)}
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium">Qty</label>
                                        <Input
                                            className="h-8"
                                            placeholder="50"
                                            value={leg.quantity}
                                            onChange={(e) => updateLeg(leg.id, "quantity", e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium">Price</label>
                                        <Input
                                            className="h-8"
                                            placeholder="100"
                                            value={leg.entry_price}
                                            onChange={(e) => updateLeg(leg.id, "entry_price", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-600"
                                    onClick={() => removeLeg(leg.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Save Strategy</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <Input
                            placeholder="Strategy Name (e.g. Iron Condor)"
                            value={strategyName}
                            onChange={(e) => setStrategyName(e.target.value)}
                        />
                        <Button onClick={saveStrategy}>
                            <Save className="h-4 w-4 mr-2" /> Save
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Payoff Diagram</CardTitle>
                        <Button size="sm" variant="ghost" onClick={calculatePayoff} disabled={isLoading}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Recalculate
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <PayoffDiagram data={payoffData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
