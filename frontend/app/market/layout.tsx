import { AppShell } from "@/components/layout/AppShell";

export default function MarketLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AppShell>{children}</AppShell>;
}
