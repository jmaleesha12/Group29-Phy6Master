import { motion } from "framer-motion";
import { User, Palette } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useUserProfile } from "@/lib/api";
import { useTheme } from "@/hooks/useTheme";

const card = "rounded-xl border border-border bg-card p-6 shadow-card";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const userId = Number(localStorage.getItem("authUserId")) || undefined;
  const { data: user, isLoading } = useUserProfile(userId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl font-bold text-foreground">Settings</motion.h1>

      {/* Profile */}
      <div className={card}>
        <div className="flex items-center gap-2 mb-6"><User className="h-5 w-5 text-primary" /><h2 className="font-display font-semibold text-foreground">Profile</h2></div>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        ) : user ? (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                {user.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="font-semibold text-foreground">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.role}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 rounded-lg bg-secondary">
                <span className="text-muted-foreground">Username</span>
                <span className="text-foreground font-medium">{user.username}</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-secondary">
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground font-medium">{user.email || "–"}</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-secondary">
                <span className="text-muted-foreground">Phone</span>
                <span className="text-foreground font-medium">{user.phoneNumber || "–"}</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-secondary">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${user.isActive ? "text-green-500" : "text-muted-foreground"}`}>{user.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Unable to load profile.</p>
        )}
      </div>

      {/* Theme */}
      <div className={card}>
        <div className="flex items-center gap-2 mb-6"><Palette className="h-5 w-5 text-primary" /><h2 className="font-display font-semibold text-foreground">Appearance</h2></div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Dark Mode</p>
            <p className="text-xs text-muted-foreground">Toggle between dark and light theme</p>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </div>
      </div>
    </div>
  );
}
