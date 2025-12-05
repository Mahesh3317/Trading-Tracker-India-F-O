"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface OptionData {
    ltp: number
    oi: number
    volume: number
    delta: number
    theta: number
    gamma: number
    vega: number
}

interface StrikeData {
    strike_price: number
    ce: OptionData
    pe: OptionData
}

interface OptionChainTableProps {
    data: StrikeData[]
    spotPrice: number
}

export function OptionChainTable({ data, spotPrice }: OptionChainTableProps) {
    return (
        <div className="rounded-md border overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="text-center" colSpan={4}>CALLS (CE)</TableHead>
                        <TableHead className="text-center w-[100px] bg-muted">STRIKE</TableHead>
                        <TableHead className="text-center" colSpan={4}>PUTS (PE)</TableHead>
                    </TableRow>
                    <TableRow className="text-xs">
                        <TableHead className="text-right">OI</TableHead>
                        <TableHead className="text-right">Vol</TableHead>
                        <TableHead className="text-right">Delta</TableHead>
                        <TableHead className="text-right">LTP</TableHead>

                        <TableHead className="text-center bg-muted"></TableHead>

                        <TableHead className="text-left">LTP</TableHead>
                        <TableHead className="text-left">Delta</TableHead>
                        <TableHead className="text-left">Vol</TableHead>
                        <TableHead className="text-left">OI</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((strike) => {
                        const isITM_CE = strike.strike_price < spotPrice;
                        const isITM_PE = strike.strike_price > spotPrice;

                        return (
                            <TableRow key={strike.strike_price} className="hover:bg-muted/50">
                                {/* CALLS */}
                                <TableCell className={`text-right ${isITM_CE ? "bg-yellow-500/10" : ""}`}>
                                    {strike.ce.oi.toLocaleString()}
                                </TableCell>
                                <TableCell className={`text-right ${isITM_CE ? "bg-yellow-500/10" : ""}`}>
                                    {strike.ce.volume.toLocaleString()}
                                </TableCell>
                                <TableCell className={`text-right ${isITM_CE ? "bg-yellow-500/10" : ""}`}>
                                    {strike.ce.delta.toFixed(2)}
                                </TableCell>
                                <TableCell className={`text-right font-medium ${isITM_CE ? "bg-yellow-500/10" : ""}`}>
                                    {strike.ce.ltp.toFixed(2)}
                                </TableCell>

                                {/* STRIKE */}
                                <TableCell className="text-center font-bold bg-muted">
                                    {strike.strike_price}
                                </TableCell>

                                {/* PUTS */}
                                <TableCell className={`text-left font-medium ${isITM_PE ? "bg-yellow-500/10" : ""}`}>
                                    {strike.pe.ltp.toFixed(2)}
                                </TableCell>
                                <TableCell className={`text-left ${isITM_PE ? "bg-yellow-500/10" : ""}`}>
                                    {strike.pe.delta.toFixed(2)}
                                </TableCell>
                                <TableCell className={`text-left ${isITM_PE ? "bg-yellow-500/10" : ""}`}>
                                    {strike.pe.volume.toLocaleString()}
                                </TableCell>
                                <TableCell className={`text-left ${isITM_PE ? "bg-yellow-500/10" : ""}`}>
                                    {strike.pe.oi.toLocaleString()}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
