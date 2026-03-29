import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, BookOpen, Award, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const performanceData = [
  { month: "Sep", avg: 62, highest: 88, lowest: 35 },
  { month: "Oct", avg: 68, highest: 92, lowest: 40 },
  { month: "Nov", avg: 71, highest: 90, lowest: 42 },
  { month: "Dec", avg: 75, highest: 95, lowest: 45 },
  { month: "Jan", avg: 78, highest: 96, lowest: 48 },
  { month: "Feb", avg: 82, highest: 98, lowest: 52 },
];

const attendanceData = [
  { week: "W1", rate: 88 }, { week: "W2", rate: 92 }, { week: "W3", rate: 85 },
  { week: "W4", rate: 94 }, { week: "W5", rate: 90 }, { week: "W6", rate: 93 },
];

const batchDistribution = [
  { name: "2027 A/L", value: 98 },
  { name: "2026 A/L", value: 58 },
];
const COLORS = ["hsl(45, 93%, 47%)", "hsl(217, 91%, 60%)"];

const topStudents = [
  { name: "Hashini Dissanayake", score: 91, trend: "up" },
  { name: "Tharindu Fernando", score: 89, trend: "up" },
  { name: "Amal Wickramasinghe", score: 84, trend: "up" },
  { name: "Kasun Perera", score: 81, trend: "down" },
  { name: "Nimali Silva", score: 75, trend: "up" },
];

const revenueData = [
  { month: "Sep", revenue: 180000 }, { month: "Oct", revenue: 195000 },
  { month: "Nov", revenue: 210000 }, { month: "Dec", revenue: 200000 },
  { month: "Jan", revenue: 225000 }, { month: "Feb", revenue: 234000 },
];

export default function TeacherAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Analytics & Reports</h1>
        <p className="text-muted-foreground mt-1">Track student performance and class metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: "156", icon: Users, change: "+8%", up: true },
          { label: "Avg Score", value: "78%", icon: Award, change: "+3%", up: true },
          { label: "Attendance Rate", value: "91%", icon: BookOpen, change: "+2%", up: true },
          { label: "Monthly Revenue", value: "LKR 234K", icon: DollarSign, change: "+12%", up: true },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-xl bg-card border border-border p-5 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <s.icon className="h-5 w-5 text-primary" />
              <span className={`text-xs flex items-center gap-1 ${s.up ? "text-green-500" : "text-red-500"}`}>
                {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{s.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="rounded-xl bg-card border border-border p-6 shadow-card">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Performance Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 22%)" />
              <XAxis dataKey="month" stroke="hsl(215, 20%, 65%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(222, 47%, 14%)", border: "1px solid hsl(222, 30%, 22%)", borderRadius: "8px", color: "hsl(210, 40%, 98%)" }} />
              <Bar dataKey="avg" fill="hsl(45, 93%, 47%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance */}
        <div className="rounded-xl bg-card border border-border p-6 shadow-card">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Weekly Attendance</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 22%)" />
              <XAxis dataKey="week" stroke="hsl(215, 20%, 65%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} domain={[70, 100]} />
              <Tooltip contentStyle={{ background: "hsl(222, 47%, 14%)", border: "1px solid hsl(222, 30%, 22%)", borderRadius: "8px", color: "hsl(210, 40%, 98%)" }} />
              <Line type="monotone" dataKey="rate" stroke="hsl(45, 93%, 47%)" strokeWidth={2} dot={{ fill: "hsl(45, 93%, 47%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Students */}
        <div className="rounded-xl bg-card border border-border p-6 shadow-card">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Top Performing Students</h2>
          <div className="space-y-3">
            {topStudents.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-primary w-6">#{i + 1}</span>
                  <span className="text-sm font-medium text-foreground">{s.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{s.score}%</span>
                  {s.trend === "up" ? <TrendingUp className="h-3 w-3 text-green-500" /> : <TrendingDown className="h-3 w-3 text-red-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue */}
        <div className="rounded-xl bg-card border border-border p-6 shadow-card">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Revenue Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 22%)" />
              <XAxis dataKey="month" stroke="hsl(215, 20%, 65%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} tickFormatter={(v) => `${v / 1000}K`} />
              <Tooltip contentStyle={{ background: "hsl(222, 47%, 14%)", border: "1px solid hsl(222, 30%, 22%)", borderRadius: "8px", color: "hsl(210, 40%, 98%)" }}
                formatter={(v: number) => [`LKR ${v.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
