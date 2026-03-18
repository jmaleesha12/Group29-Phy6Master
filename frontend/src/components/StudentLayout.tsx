import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Calendar, BookOpen, User,
  LogOut, Zap, Menu, X, Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

const sidebarLinks = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
  { label: "Resources", icon: BookOpen, path: "/student/resources" },
  { label: "Classes", icon: BookOpen, path: "/student/classes" },
  { label: "Schedule", icon: Calendar, path: "/student/schedule" },
  { label: "Profile", icon: User, path: "/student/settings" },
];

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const userName = localStorage.getItem("authName") || "Student";

  useEffect(() => {
    if (localStorage.getItem("authRole") !== "STUDENT") {
      navigate("/signin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authRole");
    localStorage.removeItem("authName");
    localStorage.removeItem("authUsername");
    localStorage.removeItem("authUserId");
    navigate("/");
  };

  return (
      <div className="min-h-screen bg-background flex">

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-sidebar transition-all duration-300 ${sidebarOpen ? "w-60" : "w-16"}`}>

          <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
            <Zap className="h-6 w-6 text-sidebar-primary shrink-0" />
            {sidebarOpen && (
                <span className="font-display text-lg font-bold text-sidebar-foreground">
              Phy6 Master
            </span>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
            {sidebarLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                  <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${active
                          ? "bg-sidebar-accent text-sidebar-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      }`}
                  >
                    <link.icon className={`h-5 w-5 shrink-0 ${active ? "text-sidebar-primary" : ""}`} />
                    {sidebarOpen && <span>{link.label}</span>}
                  </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-sidebar-border">
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 w-full"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-16"}`}>

          {/* Header */}
          <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-background/80 backdrop-blur-md px-6 py-3">

            <div className="flex items-center gap-3">
              <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                {sidebarOpen
                    ? <X className="h-5 w-5 text-foreground" />
                    : <Menu className="h-5 w-5 text-foreground" />}
              </button>

              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-64 pl-10 bg-secondary border-border text-sm"
                />
              </div>
            </div>

          </header>

          {/* Content */}
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>

        </div>
      </div>
  );
}
