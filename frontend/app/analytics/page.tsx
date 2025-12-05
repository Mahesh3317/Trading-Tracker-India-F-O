"use client"

import { useEffect, useState } from "react"
import { KPIGrid } from "@/components/analytics/KPIGrid"
import { EquityChart } from "@/components/analytics/EquityChart"
import api from "@/lib/api"

export default function AnalyticsPage() {
    const [kpiData, setKpiData] = useState<any>(null)
    const [equityData, setEquityData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [kpiRes, equityRes] = await Promise.all([
                    api.get("/analytics/kpis"),
                    api.get("/analytics/equity-curve")
                ])
                setKpiData(kpiRes.data)
                setEquityData(equityRes.data)
            } catch (error) {
                console.error("Failed to fetch analytics", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    if (isLoading) {
        return <div>Loading analytics...</div>
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>

            {kpiData && <KPIGrid data={kpiData} />}

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                <div className="col-span-7">
                    {equityData.length > 0 ? (
                        <EquityChart data={equityData} />
                    ) : (
                        <div className="p-8 text-center border rounded-lg text-muted-foreground">
                            Not enough data to generate equity curve.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
