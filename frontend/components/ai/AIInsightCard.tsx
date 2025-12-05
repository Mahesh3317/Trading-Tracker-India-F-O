"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useState } from "react"
import api from "@/lib/api"

export function AIInsightCard() {
    const [summary, setSummary] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const generateSummary = async () => {
        setIsLoading(true)
        try {
            const res = await api.post("/ai/generate-summary")
            setSummary(res.data.summary)
        } catch (error) {
            console.error("Failed to generate summary", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="col-span-4 lg:col-span-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 border-indigo-100 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    AI Daily Insight
                </CardTitle>
                {!summary && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={generateSummary}
                        disabled={isLoading}
                        className="h-8"
                    >
                        {isLoading ? "Analyzing..." : "Generate"}
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {summary ? (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {summary}
                        </p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={generateSummary}
                            disabled={isLoading}
                            className="h-6 text-xs text-indigo-500 hover:text-indigo-600 p-0"
                        >
                            Refresh Analysis
                        </Button>
                    </div>
                ) : (
                    <p className="text-xs text-muted-foreground">
                        Get an AI-powered summary of your trading performance and psychology for the day.
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
