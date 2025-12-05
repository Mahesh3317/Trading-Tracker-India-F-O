"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Bell, Menu, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "./Sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
    const { theme, setTheme } = useTheme();
    const { user, logout } = useAuth();
    const pathname = usePathname();

    return (
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0 bg-gray-900 border-r border-gray-800 text-white">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                TradingTracker
                            </h1>
                        </div>
                        <nav className="flex-1 px-4 space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                            isActive
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="p-4 border-t border-gray-800 mt-auto">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                onClick={logout}
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                Logout
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Welcome back, {user?.email?.split('@')[0] || 'Trader'}
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Bell className="w-5 h-5 text-gray-500" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {user?.email?.[0].toUpperCase() || 'U'}
                </div>
            </div>
        </header>
    );
}
