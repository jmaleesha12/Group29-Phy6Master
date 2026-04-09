import { motion } from "framer-motion";
import { Inbox, CheckCircle, FileText, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    usePendingRequests,
    useActiveRequests,
    useDeliveryRecords,
} from "@/lib/api/tutorial-requests";

export default function TuteManagementDashboard() {
    const { data: pendingRequests = [], isLoading: loadingPending } = usePendingRequests();
    const { data: activeRequests = [], isLoading: loadingActive } = useActiveRequests();
    const { data: deliveryRecords = [], isLoading: loadingDelivery } = useDeliveryRecords();

    const tuteName = localStorage.getItem("authName") || "Tute Manager";

    const stats = [
        {
            label: "Incoming Requests",
            value: pendingRequests.length,
            icon: Inbox,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
            link: "/tute-management/incoming",
        },
        {
            label: "Active Requests",
            value: activeRequests.length,
            icon: CheckCircle,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
            link: "/tute-management/active",
        },
        {
            label: "Delivered",
            value: deliveryRecords.length,
            icon: FileText,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            link: "/tute-management/delivery-records",
        },
    ];

    const loading = loadingPending || loadingActive || loadingDelivery;
    const recentPending = pendingRequests.slice(0, 5);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                    Welcome back, {tuteName}!
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage tutorial requests and track deliveries
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Link to={stat.link} className="block">
                            <div className="rounded-xl bg-card border border-border p-5 shadow-card hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-2xl font-bold text-foreground">
                                    {loading ? "–" : stat.value}
                                </p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="rounded-xl bg-card border border-border p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
                        <Inbox className="h-5 w-5 text-amber-500" /> Recent Incoming Requests
                    </h2>
                    <Link to="/tute-management/incoming">
                        <Button variant="outline" size="sm">View All</Button>
                    </Link>
                </div>

                {loadingPending ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                ) : recentPending.length === 0 ? (
                    <div className="text-center py-8">
                        <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No incoming requests at the moment</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            New tutorial requests will appear here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentPending.map((request) => (
                            <div key={request.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {request.studentName?.charAt(0).toUpperCase() || "S"}
                    </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{request.studentName}</p>
                                        <p className="text-xs text-muted-foreground">{request.subject} • {request.course}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.paymentStatus === "PAID"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {request.paymentStatus === "PAID" ? "Paid" : "Not Paid"}
                  </span>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {new Date(request.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/tute-management/incoming">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-5 hover:border-amber-500/40 transition-colors cursor-pointer"
                    >
                        <Inbox className="h-8 w-8 text-amber-500 mb-3" />
                        <h3 className="font-semibold text-foreground">Process Requests</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Review and accept/decline incoming tutorial requests
                        </p>
                    </motion.div>
                </Link>
                <Link to="/tute-management/active">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-5 hover:border-emerald-500/40 transition-colors cursor-pointer"
                    >
                        <CheckCircle className="h-8 w-8 text-emerald-500 mb-3" />
                        <h3 className="font-semibold text-foreground">Manage Active</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Track active tutorials and mark as delivered
                        </p>
                    </motion.div>
                </Link>
            </div>
        </div>
    );
}
