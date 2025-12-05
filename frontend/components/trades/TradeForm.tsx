"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { useState } from "react"

const formSchema = z.object({
    symbol: z.string().min(1, "Symbol is required"),
    instrument_type: z.enum(["FUT", "OPT", "EQ"]),
    expiry_date: z.date().optional(),
    strike_price: z.string().optional(), // Input as string, convert to float
    option_type: z.enum(["CE", "PE"]).optional(),
    side: z.enum(["BUY", "SELL"]),
    quantity: z.string().min(1, "Quantity is required"), // Input as string, convert to int
    entry_price: z.string().min(1, "Price is required"), // Input as string, convert to float
    entry_date: z.date(),
    notes: z.string().optional(),
    emotions: z.string().optional(),
    confidence: z.string().optional(), // Input as string, convert to int
})

export function TradeForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            symbol: "",
            instrument_type: "OPT",
            side: "BUY",
            quantity: "",
            entry_price: "",
            entry_date: new Date(),
            notes: "",
            emotions: "",
            confidence: "5",
        },
    })

    const instrumentType = form.watch("instrument_type")

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const payload = {
                ...values,
                quantity: parseInt(values.quantity),
                entry_price: parseFloat(values.entry_price),
                strike_price: values.strike_price ? parseFloat(values.strike_price) : undefined,
                expiry_date: values.expiry_date ? values.expiry_date.toISOString() : undefined,
                entry_date: values.entry_date.toISOString(),
                emotions: values.emotions,
                confidence: values.confidence ? parseInt(values.confidence) : undefined,
            }

            await api.post("/trades/", payload)
            router.push("/trades")
            router.refresh()
        } catch (error) {
            console.error("Failed to create trade", error)
            // You could add a toast notification here
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="symbol"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Symbol</FormLabel>
                                <FormControl>
                                    <Input placeholder="NIFTY" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="instrument_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Instrument Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="EQ">Equity (Cash)</SelectItem>
                                        <SelectItem value="FUT">Futures</SelectItem>
                                        <SelectItem value="OPT">Options</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="side"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Side</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select side" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="BUY">Buy (Long)</SelectItem>
                                        <SelectItem value="SELL">Sell (Short)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="entry_date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Entry Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* F&O Specific Fields */}
                {(instrumentType === "FUT" || instrumentType === "OPT") && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
                        <FormField
                            control={form.control}
                            name="expiry_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Expiry Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick expiry</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {instrumentType === "OPT" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="strike_price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Strike Price</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="21500" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="option_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Option Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="CE/PE" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="CE">Call (CE)</SelectItem>
                                                    <SelectItem value="PE">Put (PE)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="50" {...field} />
                                </FormControl>
                                <FormDescription>Total units (Lots * Lot Size)</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="entry_price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Entry Price</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.05" placeholder="100.00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="emotions"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Emotions</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="How did you feel?" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Neutral">Neutral</SelectItem>
                                        <SelectItem value="Confident">Confident</SelectItem>
                                        <SelectItem value="Anxious">Anxious</SelectItem>
                                        <SelectItem value="Greedy">Greedy</SelectItem>
                                        <SelectItem value="Fearful">Fearful</SelectItem>
                                        <SelectItem value="FOMO">FOMO</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confidence"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confidence (1-10)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Rate confidence" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                            <SelectItem key={num} value={num.toString()}>
                                                {num}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Why did you take this trade?"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Log Trade"}
                </Button>
            </form>
        </Form>
    )
}
