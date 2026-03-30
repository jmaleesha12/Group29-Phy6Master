import { useStudentNotifications, useMarkNotificationAsRead } from "@/lib/api/notifications";
import { CheckCircle2, Info, XCircle, Check, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function NotificationsPage() {
    const studentId = Number(localStorage.getItem("authUserId")) || undefined;
    const { data: notifications = [], isLoading, isError } = useStudentNotifications(studentId);
    const markAsReadMutation = useMarkNotificationAsRead();

    const handleMarkAsRead = (id: number) => {
        if (studentId) {
            markAsReadMutation.mutate({ id, studentId });
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "APPROVED":
                return <CheckCircle2 className="h-6 w-6 text-green-500" />;
            case "REJECTED":
                return <XCircle className="h-6 w-6 text-red-500" />;
            default:
                return <Info className="h-6 w-6 text-blue-500" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-display font-bold text-foreground">Notifications</h1>
                <p className="text-muted-foreground mt-2">View updates regarding your payments and enrollments.</p>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading notifications...</div>
                ) : isError ? (
                    <div className="p-8 text-center text-destructive">Failed to load notifications.</div>
                ) : notifications.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium text-foreground">You have no notifications yet.</h3>
                        <p className="text-sm text-muted-foreground mt-1">When an admin reviews your payment, it will appear here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {notifications.map((notif) => (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 p-5 transition-colors ${notif.isRead ? "bg-background opacity-80" : "bg-primary/5"}`}
                            >
                                <div className="shrink-0 mt-1">{getIcon(notif.type)}</div>

                                <div className="flex-1 space-y-1 pr-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`text-base font-semibold ${!notif.isRead ? "text-foreground" : "text-foreground/80"}`}>{notif.title}</h4>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <p className="text-sm text-foreground mb-2 mt-1">{notif.message}</p>

                                    {notif.classReference && (
                                        <div className="inline-block mt-2 px-2.5 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-border">
                                            {notif.classReference}
                                        </div>
                                    )}
                                </div>

                                {!notif.isRead && (
                                    <div className="shrink-0 flex items-center">
                                        <button
                                            onClick={() => handleMarkAsRead(notif.id)}
                                            disabled={markAsReadMutation.isPending}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors"
                                        >
                                            <Check className="h-3.5 w-3.5" />
                                            Mark read
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
