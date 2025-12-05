"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Badge } from "@/components/ui/badge"

interface Transaction {
    id: number
    date: string
    type: "DEPOSIT" | "WITHDRAWAL"
    amount: number
    notes?: string
}

export function TransactionHistoryTable() {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await api.get("/capital/")
                setTransactions(res.data)
            } catch (error) {
                console.error("Failed to fetch transactions", error)
            }
        }
        fetchTransactions()
    }, [])

    return (
        <div className="rounded-md border bg-white dark:bg-slate-950">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Notes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                No transactions found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        transactions.map((t) => (
                            <TableRow key={t.id}>
                                <TableCell>{format(new Date(t.date), "dd MMM yyyy")}</TableCell>
                                <TableCell>
                                    <Badge variant={t.type === "DEPOSIT" ? "default" : "secondary"}>
                                        {t.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className={`text-right font-medium ${t.type === "DEPOSIT" ? "text-green-600" : "text-red-600"}`}>
                                    {t.type === "DEPOSIT" ? "+" : "-"}₹{t.amount.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">{t.notes || "-"}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
