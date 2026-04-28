import { Link } from "react-router-dom";
import { usePendingPayments } from "@/lib/api/accountant-payments";
import { CheckCircle2, ChevronRight } from "lucide-react";

export default function PendingPaymentsList() {
    const { data: payments = [], isLoading, isError } = usePendingPayments();

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">Pending Verifications</h1>
                    <p className="text-muted-foreground mt-1">Review student payment submissions awaiting your approval.</p>
                </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-muted-foreground">Loading pending payments...</div>
                ) : isError ? (
                    <div className="p-12 text-center text-destructive">Failed to load payments.</div>
                ) : payments.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center">
                        <CheckCircle2 className="h-16 w-16 text-muted-foreground/30 mb-4" />
                        <h3 className="text-xl font-medium text-foreground">All caught up!</h3>
                        <p className="text-muted-foreground mt-2">No payments are currently awaiting accountant verification.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-secondary/50 text-muted-foreground uppercase text-xs font-semibold tracking-wider border-b border-border">
                                <tr>
                                    <th className="px-6 py-4">Submission Date</th>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Course</th>
                                    <th className="px-6 py-4">Method</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-accent/50 transition-colors">
                                        <td className="px-6 py-4">
                                            {new Date(payment.submissionDate).toLocaleDateString()}
                                            <span className="text-xs text-muted-foreground block">
                                                {new Date(payment.submissionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-foreground">{payment.studentName}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{payment.courseName}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                                                {payment.paymentMethod.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/accountant/payments/${payment.id}`}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-medium transition-colors border border-primary/20"
                                            >
                                                Review
                                                <ChevronRight className="h-4 w-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
