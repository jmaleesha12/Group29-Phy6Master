import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard, CreditCard, LogOut, Calculator
} from "lucide-react";

export default function AccountantLayout() {
    const [sidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authRole");
        localStorage.removeItem("authName");
        localStorage.removeItem("authUsername");
        localStorage.removeItem("authUserId");
        navigate("/");
    };

    const navLinks = [
        { label: "Pending Payments", path: "/accountant/payments", icon: CreditCard },
    ];

    return (
        <div className="min-h-screen bg-background flex">
            <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-sidebar transition-all duration-300 ${sidebarOpen ? "w-60" : "w-16"}`}>
                <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
                    <Calculator className="h-6 w-6 text-sidebar-primary shrink-0" />
                    {sidebarOpen && <span className="font-display text-lg font-bold text-sidebar-foreground">Phy6 Master</span>}
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                    {navLinks.map((link) => {
                        const active = location.pathname.startsWith(link.path);
                        return (
                            <Link key={link.path} to={link.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"}`}>
                                <link.icon className={`h-5 w-5 shrink-0 ${active ? "text-sidebar-primary" : ""}`} />
                                {sidebarOpen && <span>{link.label}</span>}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-3 border-t border-sidebar-border">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 w-full">
                        <LogOut className="h-5 w-5 shrink-0" />
                        {sidebarOpen && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-16"}`}>
                <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-background/80 backdrop-blur-md px-6 py-3">
                    <div className="flex items-center gap-3"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium px-4 py-1.5 rounded-full bg-primary/10 text-primary uppercase tracking-wide">Accountant Portal</span>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
