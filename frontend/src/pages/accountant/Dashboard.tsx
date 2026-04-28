import { useQuery } from "@tanstack/react-query";
import { DollarSign, FileWarning, CheckCircle, Activity, FileText } from "lucide-react";
import { get } from "@/lib/api-client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function AccountantDashboard() {
    const accountantName = localStorage.getItem("authName") || "Accountant";

    const { data: pending = [] } = useQuery<{id: number}[]>({
        queryKey: ["accountant-pending-count"],
        queryFn: () => get("/api/accountant/payments/pending")
    });

    const { data: report } = useQuery<any>({
        queryKey: ["accountant-monthly-latest"],
        queryFn: () => get(`/api/accountant/reports/financial?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`),
    });

    const cards = [
        { title: "Pending Verifications", value: pending.length, icon: FileWarning, color: "text-amber-500", bg: "bg-amber-500/10", route: "/accountant/payments" },
        { title: "Monthly Approvals", value: report?.approvedPaymentsCount || 0, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", route: "/accountant/reports/monthly" },
        { title: "Revenue (MTD)", value: new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(report?.totalFeesCollected || 0), icon: DollarSign, color: "text-blue-500", bg: "bg-blue-500/10", route: "/accountant/reports/monthly" }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-display font-bold text-foreground">Welcome back, {accountantName}!</h1>
                <p className="text-muted-foreground mt-1">Here is your financial overview for {new Date().toLocaleString('default', { month: 'long' })}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cards.map((s, i) => (
                <Link key={s.title} to={s.route}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="rounded-xl bg-card border border-border p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.bg}`}>
                                <s.icon className={`h-5 w-5 ${s.color}`} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{s.value}</p>
                        <p className="text-sm font-medium text-muted-foreground">{s.title}</p>
                    </motion.div>
                </Link>
                ))}
            </div>

            <div className="bg-card rounded-xl border border-border shadow-sm p-6 flex flex-col justify-center items-center text-center mt-6">
                <Activity className="w-12 h-12 text-primary/20 mb-4" />
                <h2 className="text-xl font-bold font-display text-foreground">Financial Reports & History</h2>
                <p className="text-muted-foreground text-sm max-w-md mt-2 mb-6">
                    Drill down into specific operational metrics or verify incoming payments utilizing your dedicated modules.
                </p>
                <div className="flex gap-4">
                    <Link to="/accountant/reports/monthly" className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Financial Reports
                    </Link>
                    <Link to="/accountant/payments/history" className="px-5 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded shadow-sm hover:bg-secondary/80 transition-all">
                        View Audit Log
                    </Link>
                </div>
            </div>
        </div>
    );
}
