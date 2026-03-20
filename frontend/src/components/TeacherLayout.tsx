import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, BookOpen, Upload, CalendarDays,
  Menu, GraduationCap, LogOut, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/teacher/dashboard" },
  { label: "Students", icon: Users, path: "/teacher/students" },
  { label: "Classes", icon: BookOpen, path: "/teacher/classes" },
  { label: "Content", icon: Upload, path: "/teacher/content" },
  { label: "Timetable", icon: CalendarDays, path: "/teacher/timetable" },
];

export default function TeacherLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check the shared auth role set by the SignIn flow. SignIn sets `authRole` to "TEACHER" for teachers.
    if (localStorage.getItem("authRole") !== "TEACHER") {
      // Not signed in as teacher — redirect to sign in page.
      navigate("/signin");
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear all auth-related keys so sign out is consistent across roles.
    localStorage.removeItem("authRole");
    localStorage.removeItem("authName");
    localStorage.removeItem("authUsername");
    localStorage.removeItem("authUserId");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-sidebar transition-all duration-300 ${sidebarOpen ? "w-60" : "w-16"}`}>
        <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
          <GraduationCap className="h-6 w-6 text-sidebar-primary shrink-0" />
          {sidebarOpen && <span className="font-display text-lg font-bold text-sidebar-foreground">Teacher</span>}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {sidebarLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${active ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"}`}>
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
          <div className="flex items-center gap-3">
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-accent transition-colors">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{(localStorage.getItem("authName") || "T")[0].toUpperCase()}</div>
                <span className="text-sm font-medium text-foreground hidden sm:block">{localStorage.getItem("authName") || "Teacher"}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card shadow-card p-2 z-50">
                    <hr className="my-1 border-border" />
                    <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-accent w-full">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
