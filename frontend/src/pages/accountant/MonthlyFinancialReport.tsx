import { useState } from "react";
import { useMonthlyFinancialReport } from "@/lib/api/accountant-reports";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api-client";
import { BarChart3, Calendar, DollarSign, FileWarning, CheckCircle, Users, Activity, FileText, Filter, RotateCcw } from "lucide-react";
import { format } from "date-fns";

export default function MonthlyFinancialReport() {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedCourse, setSelectedCourse] = useState<number | undefined>();
    const [selectedMethod, setSelectedMethod] = useState<string | undefined>();
    
    // To trigger load vs input state
    const [generateConfig, setGenerateConfig] = useState({ 
        month: currentMonth, 
        year: currentYear, 
        courseId: undefined as number | undefined,
        paymentMethod: undefined as string | undefined,
        ready: true 
    });

    const { data: courses = [] } = useQuery<{id: number, title: string}[]>({
        queryKey: ["all-courses-for-filters"],
        queryFn: () => get<{id: number, title: string}[]>("/api/student/courses")
    });

    const { data: report, isLoading, isError, isFetching } = useMonthlyFinancialReport(
        generateConfig.month, 
        generateConfig.year, 
        generateConfig.courseId,
        generateConfig.paymentMethod,
        generateConfig.ready
    );

    const handleGenerate = () => {
        setGenerateConfig({ 
            month: selectedMonth, 
            year: selectedYear, 
            courseId: selectedCourse,
            paymentMethod: selectedMethod,
            ready: true 
        });
    };

    const handleReset = () => {
        setSelectedMonth(currentMonth);
        setSelectedYear(currentYear);
        setSelectedCourse(undefined);
        setSelectedMethod(undefined);
        setGenerateConfig({
            month: currentMonth,
            year: currentYear,
            courseId: undefined,
            paymentMethod: undefined,
            ready: true
        });
    };

    const months = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">Financial Reports</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Analyze revenue dynamically using filters.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-card p-2 rounded-xl shadow-sm border border-border">
                    <div className="flex items-center space-x-2 border-r border-border pr-3">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <select 
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="bg-background border-border text-sm font-medium focus:ring-1 focus:ring-primary rounded p-1.5"
                        >
                            {months.map((m, i) => (
                                <option key={i} value={i + 1}>{m}</option>
                            ))}
                        </select>

                        <input 
                            type="number" 
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="bg-background border-border text-sm font-medium focus:ring-1 focus:ring-primary rounded p-1.5 w-20"
                            min="2020"
                            max="2100"
                        />
                    </div>

                    <div className="flex items-center space-x-2 border-r border-border pr-3">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <select 
                            value={selectedCourse || ""}
                            onChange={(e) => setSelectedCourse(e.target.value ? Number(e.target.value) : undefined)}
                            className="bg-background border-border text-sm font-medium focus:ring-1 focus:ring-primary rounded p-1.5 max-w-[140px]"
                        >
                            <option value="">All Courses</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>

                        <select 
                            value={selectedMethod || ""}
                            onChange={(e) => setSelectedMethod(e.target.value || undefined)}
                            className="bg-background border-border text-sm font-medium focus:ring-1 focus:ring-primary rounded p-1.5"
                        >
                            <option value="">All Methods</option>
                            <option value="ONLINE_PAYMENT">Online (Stripe)</option>
                            <option value="ATM_TRANSFER">ATM Transfer</option>
                            <option value="BANK_SLIP_UPLOAD">Bank Slip</option>
                        </select>
                    </div>

                    <button 
                        onClick={handleReset}
                        title="Reset Filters"
                        className="p-2 bg-secondary text-secondary-foreground font-semibold rounded shadow-sm hover:bg-secondary/80 transition-all"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </button>

                    <button 
                        onClick={handleGenerate}
                        disabled={isFetching}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded shadow-sm hover:bg-primary/90 transition-all"
                    >
                        <Activity className="h-4 w-4" /> 
                        {isFetching ? "..." : "Apply Filters"}
                    </button>
                </div>
            </div>

            {isLoading || isFetching ? (
                <div className="py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Compiling financial data securely...</p>
                </div>
            ) : isError ? (
                <div className="p-8 bg-destructive/10 border border-destructive/20 rounded-xl text-center">
                    <FileWarning className="w-10 h-10 text-destructive mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-destructive">Failed to generate report</h3>
                    <p className="text-sm text-destructive/80 mt-1">There was an issue communicating with the aggregation service.</p>
                </div>
            ) : report ? (
                <div className="space-y-6">
                    {report.totalPaymentsCount === 0 && report.enrollmentCount === 0 ? (
                        <div className="bg-secondary/30 border border-border rounded-xl p-12 text-center flex flex-col items-center">
                            <Calendar className="w-16 h-16 text-muted-foreground/30 mb-4" />
                            <h3 className="text-xl font-semibold text-foreground">No financial data matches the selected filters.</h3>
                            <p className="text-muted-foreground max-w-md mt-2">Zero records were matched for {months[report.month - 1]} {report.year} {report.courseName ? `in ${report.courseName}` : ""} {report.paymentMethod ? `using ${report.paymentMethod.replace(/_/g, " ")}` : ""}. Adjust your filters above.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            
                            <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                                <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                                    <DollarSign className="w-48 h-48" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-emerald-100 font-medium tracking-wide uppercase text-xs mb-1">Total Fees Collected</p>
                                    <h3 className="text-4xl font-display font-bold">{formatCurrency(report.totalFeesCollected)}</h3>
                                    <p className="text-sm text-emerald-200 mt-2 font-medium">For {months[report.month - 1]} {report.year}</p>
                                </div>
                            </div>
                            
                            <div className="bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col justify-center">
                                <div className="flex items-center gap-3 text-muted-foreground mb-2">
                                    <Users className="w-5 h-5 text-blue-500" />
                                    <p className="font-semibold text-sm uppercase">Total Enrollments</p>
                                </div>
                                <h3 className="text-3xl font-display font-bold text-foreground">{report.enrollmentCount}</h3>
                                <p className="text-xs text-muted-foreground mt-1">Active platform signups.</p>
                            </div>
                            
                            <div className="bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col justify-center">
                                <div className="flex items-center gap-3 text-muted-foreground mb-2">
                                    <BarChart3 className="w-5 h-5 text-indigo-500" />
                                    <p className="font-semibold text-sm uppercase">Total Payments</p>
                                </div>
                                <h3 className="text-3xl font-display font-bold text-foreground">{report.totalPaymentsCount}</h3>
                                <p className="text-xs text-muted-foreground mt-1">All payment attempts.</p>
                            </div>

                            <div className="bg-card border border-border rounded-xl shadow-sm p-5 border-l-4 border-l-emerald-500">
                                <div className="flex items-center gap-3 text-muted-foreground mb-4">
                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                    <p className="font-semibold text-sm">Approved Payments</p>
                                </div>
                                <h3 className="text-2xl font-bold text-emerald-600">{report.approvedPaymentsCount}</h3>
                            </div>

                            <div className="bg-card border border-border rounded-xl shadow-sm p-5 border-l-4 border-l-yellow-500">
                                <div className="flex items-center gap-3 text-muted-foreground mb-4">
                                    <FileText className="w-5 h-5 text-yellow-500" />
                                    <p className="font-semibold text-sm">Pending Verification</p>
                                </div>
                                <h3 className="text-2xl font-bold text-yellow-600">{report.pendingPaymentsCount}</h3>
                            </div>

                            <div className="bg-card border border-border rounded-xl shadow-sm p-5 border-l-4 border-l-destructive">
                                <div className="flex items-center gap-3 text-muted-foreground mb-4">
                                    <FileWarning className="w-5 h-5 text-destructive" />
                                    <p className="font-semibold text-sm">Rejected Payments</p>
                                </div>
                                <h3 className="text-2xl font-bold text-destructive">{report.rejectedPaymentsCount}</h3>
                            </div>

                        </div>
                    )}
                    
                    <div className="text-right text-xs text-muted-foreground">
                        Report generated at {format(new Date(report.reportGeneratedAt), "MMMM d, yyyy 'at' h:mm a")}
                    </div>
                </div>
            ) : null}
        </div>
    )
}
