import { TrendingUp, TrendingDown } from "lucide-react"

interface SpotPriceTickerProps {
    symbol: string
    price: number
    prevPrice?: number
}

export function SpotPriceTicker({ symbol, price, prevPrice }: SpotPriceTickerProps) {
    const isUp = prevPrice ? price >= prevPrice : true;

    return (
        <div className="flex items-center gap-4 p-4 bg-card border rounded-lg shadow-sm">
            <div className="flex flex-col">
                <span className="text-sm text-muted-foreground font-medium">{symbol} Spot</span>
                <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${isUp ? "text-green-500" : "text-red-500"}`}>
                        {price.toFixed(2)}
                    </span>
                    {isUp ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                </div>
            </div>
        </div>
    )
}
