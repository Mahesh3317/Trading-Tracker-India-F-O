import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Activity, Target, Percent } from "lucide-react";

interface KPIProps {
    data: {
        total_pnl: number;
        win_rate: number;
        profit_factor: number;
        total_trades: number;
        avg_win: number;
        avg_loss: number;
    };
}

export function KPIGrid({ data }: KPIProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${data.total_pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                        ₹{data.total_pnl.toLocaleString()}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.win_rate}%</div>
                    <p className="text-xs text-muted-foreground">{data.total_trades} Total Trades</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.profit_factor}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Win / Loss</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-sm font-medium text-green-500">Win: ₹{data.avg_win.toLocaleString()}</div>
                    <div className="text-sm font-medium text-red-500">Loss: ₹{data.avg_loss.toLocaleString()}</div>
                </CardContent>
            </Card>
        </div>
    );
}
