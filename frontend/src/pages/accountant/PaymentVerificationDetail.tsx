import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { usePaymentDetail, useApprovePayment, useRejectPayment } from "@/lib/api/accountant-payments";
import { ChevronLeft, Check, X, BuildingIcon, CreditCard, Banknote, AlertCircle } from "lucide-react";

export default function PaymentVerificationDetail() {
    const { paymentId } = useParams();
    const navigate = useNavigate();
    const { data: detail, isLoading, isError } = usePaymentDetail(paymentId);
    const approveMutation = useApprovePayment();
    const rejectMutation = useRejectPayment();

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [rejectError, setRejectError] = useState("");

    if (isLoading) return <div className="p-12 text-center text-muted-foreground">Loading payment details...</div>;
    if (isError || !detail) return <div className="p-12 text-center text-destructive">Failed to load payment details or payment not found.</div>;

    const handleApprove = () => {
        approveMutation.mutate(detail.id, {
            onSuccess: () => navigate("/accountant/payments"),
        });
    };

    const submitReject = () => {
        if (!rejectionReason.trim()) {
            setRejectError("Rejection reason is required");
            return;
        }
        rejectMutation.mutate({ paymentId: detail.id, reason: rejectionReason }, {
            onSuccess: () => navigate("/accountant/payments"),
            onError: (err: unknown) => {
                const message = err instanceof Error ? err.message : "Failed to reject payment";
                setRejectError(message);
            },
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
            <div className="flex items-center gap-4">
                <Link to="/accountant/payments" className="p-2 -ml-2 rounded-full hover:bg-accent text-muted-foreground transition-colors">
                    <ChevronLeft className="h-6 w-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">Review Payment</h1>
                    <p className="text-muted-foreground mt-1">Verify proof and action this submission.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-6">
                        <h3 className="font-semibold text-lg border-b border-border pb-2">Student Info</h3>
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium text-foreground">{detail.studentName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium text-foreground">{detail.studentEmail || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Course</p>
                            <p className="font-medium text-foreground">{detail.courseName}</p>
                        </div>

                        <h3 className="font-semibold text-lg border-b border-border pb-2 mt-8">Payment Details</h3>
                        <div>
                            <p className="text-sm text-muted-foreground">Amount</p>
                            <p className="font-medium text-foreground text-xl text-primary">Rs. {detail.amount.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Method</p>
                            <p className="font-medium text-foreground flex items-center gap-2 mt-1">
                                {detail.paymentMethod === "BANK_SLIP" ? <BuildingIcon className="w-4 h-4" /> :
                                    detail.paymentMethod === "ATM_TRANSFER" ? <CreditCard className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                                {detail.paymentMethod.replace("_", " ")}
                            </p>
                        </div>
                        {detail.referenceNumber && (
                            <div>
                                <p className="text-sm text-muted-foreground">Reference Number</p>
                                <p className="font-mono text-foreground">{detail.referenceNumber}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-muted-foreground">Submitted At</p>
                            <p className="font-medium text-foreground">
                                {new Date(detail.submissionDate).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card rounded-xl shadow-sm border border-border p-6 flex flex-col h-full">
                        <h3 className="font-semibold text-lg border-b border-border pb-4 mb-4">Proof of Payment</h3>
                        <div className="flex-1 bg-secondary/30 rounded-lg flex items-center justify-center border border-border overflow-hidden min-h-[400px] relative">
                            {detail.hasProof && detail.proofFilePath ? (
                                <img
                                    // In a real prod environment we'd construct the URL nicely according to the backend configuration.
                                    src={`http://localhost:8080/api/files/${detail.proofFilePath.split('\\').pop()?.split('/').pop()}`}
                                    alt="Payment Proof"
                                    className="max-w-full max-h-[600px] object-contain rounded-md"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Proof+Image+Not+Found' }}
                                />
                            ) : (
                                <div className="text-center p-6">
                                    <AlertCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                                    <p className="text-foreground font-medium">No proof uploaded</p>
                                    <p className="text-sm text-muted-foreground mt-1">This payment was submitted without an attachment.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 mt-6 pt-6 border-t border-border">
                            <button
                                onClick={() => setShowRejectModal(true)}
                                disabled={approveMutation.isPending || rejectMutation.isPending}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-destructive text-destructive font-semibold hover:bg-destructive/10 transition-colors"
                            >
                                <X className="h-5 w-5" /> Reject Submission
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={approveMutation.isPending || rejectMutation.isPending}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 transition-all active:scale-[0.98]"
                            >
                                <Check className="h-5 w-5" /> Approve Payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <h2 className="text-xl font-bold mb-2">Reject Payment</h2>
                            <p className="text-sm text-muted-foreground mb-4">Please provide a reason for rejecting this payment. The student will be notified.</p>

                            <textarea
                                value={rejectionReason}
                                onChange={(e) => { setRejectionReason(e.target.value); setRejectError(""); }}
                                placeholder="e.g. The bank slip is blurry and illegible..."
                                className="w-full h-32 p-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
                            />
                            {rejectError && <p className="text-sm text-destructive mt-2">{rejectError}</p>}

                        </div>
                        <div className="bg-secondary/30 px-6 py-4 flex justify-end gap-3 border-t border-border">
                            <button
                                onClick={() => { setShowRejectModal(false); setRejectError(""); setRejectionReason(""); }}
                                className="px-4 py-2 font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
                                disabled={rejectMutation.isPending}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitReject}
                                disabled={rejectMutation.isPending}
                                className="px-5 py-2 bg-destructive text-destructive-foreground font-semibold rounded-lg hover:bg-destructive/90 transition-all shadow-sm flex items-center gap-2"
                            >
                                {rejectMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
