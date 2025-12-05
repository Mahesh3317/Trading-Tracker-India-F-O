"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

// Define the Trade type matching the API response
export type Trade = {
    id: number
    symbol: string
    instrument_type: "FUT" | "OPT" | "EQ"
    side: "BUY" | "SELL"
    quantity: number
    entry_price: number
    entry_date: string
    exit_price?: number
    exit_date?: string
    pnl?: number
    strike_price?: number
    option_type?: "CE" | "PE"
    expiry_date?: string
}

export const columns: ColumnDef<Trade>[] = [
    {
        accessorKey: "entry_date",
        header: "Date",
        cell: ({ row }) => format(new Date(row.getValue("entry_date")), "dd MMM"),
    },
    {
        accessorKey: "symbol",
        header: "Symbol",
        cell: ({ row }) => {
            const trade = row.original;
            return (
                <div className="flex flex-col">
                    <span className="font-bold">{trade.symbol}</span>
                    {trade.instrument_type === "OPT" && (
                        <span className="text-xs text-muted-foreground">
                            {format(new Date(trade.expiry_date!), "dd MMM")} {trade.strike_price} {trade.option_type}
                        </span>
                    )}
                </div>
            )
        }
    },
    {
        accessorKey: "side",
        header: "Side",
        cell: ({ row }) => {
            const side = row.getValue("side") as string;
            return (
                <Badge variant={side === "BUY" ? "default" : "destructive"}>
                    {side}
                </Badge>
            )
        }
    },
    {
        accessorKey: "quantity",
        header: "Qty",
    },
    {
        accessorKey: "entry_price",
        header: "Entry",
    },
    {
        accessorKey: "exit_price",
        header: "Exit",
        cell: ({ row }) => row.getValue("exit_price") || "-",
    },
    {
        accessorKey: "pnl",
        header: "P&L",
        cell: ({ row }) => {
            const pnl = row.getValue("pnl") as number | undefined;
            if (pnl === undefined || pnl === null) return "-";
            return (
                <span className={pnl >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    {pnl.toFixed(2)}
                </span>
            )
        }
    },
]

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function TradeTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="rounded-md border overflow-x-auto">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
