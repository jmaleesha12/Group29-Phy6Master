import { useState } from "react";
import { motion } from "framer-motion";
import { Inbox, Clock, User, BookOpen, GraduationCap, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    usePendingRequests,
    useAcceptRequest,
    useDeclineRequest,
    type TutorialRequest,
} from "@/lib/api/tutorial-requests";

export default function IncomingRequests() {
    const { data: pendingRequests = [], isLoading } = usePendingRequests();
    const acceptMutation = useAcceptRequest();
    const declineMutation = useDeclineRequest();
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const handleAccept = async (id: number) => {
        try {
            await acceptMutation.mutateAsync(id);
            toast.success("Request accepted! Student has been notified.");
        } catch (error) {
            toast.error("Failed to accept request");
        }
    };

    const handleDecline = async (id: number) => {
        try {
            await declineMutation.mutateAsync(id);
            toast.success("Request declined. Student has been notified.");
        } catch (error) {
            toast.error("Failed to decline request");
        }
    };

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                    <Inbox className="h-7 w-7 text-amber-500" /> Incoming Requests
                </h1>
                <p className="text-muted-foreground mt-1">
                    Review and process tutorial requests (oldest first)
                </p>
            </div>

            {pendingRequests.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-card border border-border p-12 text-center"
                >
                    <Inbox className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Incoming Requests</h3>
                    <p className="text-muted-foreground">
                        There are no pending tutorial requests at the moment.
                        <br />
                        New requests will appear here when students submit them.
                    </p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {pendingRequests.map((request, index) => (
                        <RequestCard
                            key={request.id}
                            request={request}
                            index={index}
                            isExpanded={expandedId === request.id}
                            onToggleExpand={() => toggleExpand(request.id)}
                            onAccept={() => handleAccept(request.id)}
                            onDecline={() => handleDecline(request.id)}
                            isAccepting={acceptMutation.isPending}
                            isDeclining={declineMutation.isPending}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface RequestCardProps {
    request: TutorialRequest;
    index: number;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onAccept: () => void;
    onDecline: () => void;
    isAccepting: boolean;
    isDeclining: boolean;
}

function RequestCard({
                         request,
                         index,
                         isExpanded,
                         onToggleExpand,
                         onAccept,
                         onDecline,
                         isAccepting,
                         isDeclining,
                     }: RequestCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-xl bg-card border border-border shadow-card overflow-hidden"
        >
            <div
                className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                onClick={onToggleExpand}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-semibold text-primary">
                {request.studentName?.charAt(0).toUpperCase() || "S"}
              </span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-foreground">{request.studentName}</p>
                                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                  {request.studentIdNumber}
                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {request.subject} • {request.course}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
            <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                    request.paymentStatus === "PAID"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
            >
              {request.paymentStatus === "PAID" ? "Paid" : "Not Paid"}
            </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                        {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border"
                >
                    <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                                <User className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Student ID</p>
                                    <p className="text-sm font-medium text-foreground">{request.studentIdNumber}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                                <BookOpen className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Subject</p>
                                    <p className="text-sm font-medium text-foreground">{request.subject}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                                <GraduationCap className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Course</p>
                                    <p className="text-sm font-medium text-foreground">{request.course}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 rounded-lg bg-secondary">
                            <p className="text-xs text-muted-foreground mb-1">Required Tutorial</p>
                            <p className="text-sm text-foreground">{request.requiredTutorial}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="text-xs text-muted-foreground">
                                Submitted: {new Date(request.createdAt).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDecline();
                                    }}
                                    disabled={isDeclining || isAccepting}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    {isDeclining ? "Declining..." : "Decline"}
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAccept();
                                    }}
                                    disabled={isAccepting || isDeclining}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    <Check className="h-4 w-4 mr-1" />
                                    {isAccepting ? "Accepting..." : "Accept"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
