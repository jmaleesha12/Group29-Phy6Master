import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Video, Bell, CreditCard, Brain, TrendingUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnnouncementsForStudent } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const card = "rounded-xl border border-border bg-card p-5 shadow-card";
const fadeIn = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const userId = Number(localStorage.getItem("authUserId")) || undefined;
  const { data: announcements = [], isLoading: loadingAnnouncements } = useAnnouncementsForStudent(userId);

  const [readAnnouncements, setReadAnnouncements] = useState<Set<number>>(new Set());
  const [showAll, setShowAll] = useState(false);

  // Hydrate read state from localStorage (same source of truth as NotificationBell)
  useEffect(() => {
    const stored = localStorage.getItem("readAnnouncements");
    if (stored) {
      setReadAnnouncements(new Set(JSON.parse(stored)));
    }
  }, []);

  const markRead = (id: number) => {
    const updated = new Set(readAnnouncements);
    updated.add(id);
    setReadAnnouncements(updated);
    localStorage.setItem("readAnnouncements", JSON.stringify(Array.from(updated)));
  };

  const markAllRead = () => {
    const updated = new Set(announcements.map((a) => a.id));
    setReadAnnouncements(updated);
    localStorage.setItem("readAnnouncements", JSON.stringify(Array.from(updated)));
  };

  const displayed = showAll ? announcements : announcements.slice(0, 3);
  const unreadCount = announcements.filter((a) => !readAnnouncements.has(a.id)).length;

  const avgScore = quizPerformance.averageScore;
  const motivational =
      avgScore >= 80 ? "🔥 Outstanding! Keep up the great work!" :
          avgScore >= 60 ? "💪 Good progress! Push a little harder!" :
              "📚 Keep studying, you'll get there!";

  return (
      <div className="space-y-6">
        <motion.h1 {...fadeIn} className="font-display text-2xl font-bold text-foreground">
          Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Upcoming Classes */}
          <motion.div {...fadeIn} transition={{ delay: 0.1 }} className={`${card} lg:col-span-2`}>
            <div className="flex items-center gap-2 mb-4">
              <Video className="h-5 w-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground">Upcoming Classes</h2>
            </div>
            <div className="space-y-3">
              {upcomingClasses.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div>
                      <p className="font-medium text-sm text-foreground">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.day} | {c.time}</p>
                    </div>
                    <Button
                        size="sm"
                        className={
                          c.status === "live"
                              ? "gradient-cta text-primary-foreground animate-pulse-glow"
                              : "bg-accent text-accent-foreground"
                        }
                    >
                      {c.status === "live" ? "Join Now" : "View"}
                    </Button>
                  </div>
              ))}
            </div>
          </motion.div>

          {/* Announcements — real API data, read state synced with NotificationBell */}
          <motion.div {...fadeIn} transition={{ delay: 0.15 }} className={card}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="font-display font-semibold text-foreground">Announcements</h2>
              </div>
              {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                    Mark all read
                  </button>
              )}
            </div>

            {loadingAnnouncements ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
            ) : announcements.length === 0 ? (
                <p className="text-sm text-muted-foreground">No announcements yet.</p>
            ) : (
                <>
                  <div className="space-y-2">
                    {displayed.map((a) => {
                      const isRead = readAnnouncements.has(a.id);
                      return (
                          <div
                              key={a.id}
                              className={`p-3 rounded-lg text-sm flex items-start justify-between gap-2 ${
                                  isRead ? "bg-secondary" : "bg-accent border-l-2 border-primary"
                              }`}
                          >
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">{a.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {new Date(a.createdAt).toLocaleDateString()} · {a.courseName}
                              </p>
                            </div>
                            {!isRead && (
                                <button
                                    onClick={() => markRead(a.id)}
                                    className="shrink-0 p-1 rounded hover:bg-secondary"
                                >
                                  <Check className="h-3 w-3 text-primary" />
                                </button>
                            )}
                          </div>
                      );
                    })}
                  </div>

                  {announcements.length > 3 && (
                      <button
                          onClick={() => setShowAll(!showAll)}
                          className="mt-3 text-xs text-primary hover:underline w-full text-center"
                      >
                        {showAll ? "Show less" : `View all (${announcements.length})`}
                      </button>
                  )}
                </>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Payment Status */}
          <motion.div {...fadeIn} transition={{ delay: 0.2 }} className={card}>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground">Payment Status</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="text-foreground font-medium">{paymentStatus.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next Due</span>
                <span className="text-foreground font-medium">{paymentStatus.nextDue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="text-foreground font-medium">
                {paymentStatus.currency} {paymentStatus.amount.toLocaleString()}
              </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="text-warning font-semibold capitalize">{paymentStatus.status}</span>
              </div>
            </div>
            <Button size="sm" className="mt-4 w-full gradient-cta text-primary-foreground font-semibold">
              View Details
            </Button>
          </motion.div>

          {/* Quiz Performance */}
          <motion.div {...fadeIn} transition={{ delay: 0.25 }} className={card}>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground">Quiz Performance</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed</span>
                <span className="text-foreground font-medium">
                {quizPerformance.completed}/{quizPerformance.totalQuizzes}
              </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average</span>
                <span className="text-foreground font-medium">{quizPerformance.averageScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best Score</span>
                <span className="text-foreground font-medium">{quizPerformance.bestScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trend</span>
                <span
                    className={`font-semibold flex items-center gap-1 ${
                        quizPerformance.trend === "up" ? "text-success" : "text-destructive"
                    }`}
                >
                <TrendingUp className="h-3 w-3" />
                  {quizPerformance.trend === "up" ? "Improving" : "Declining"}
              </span>
              </div>
            </div>
          </motion.div>

          {/* Progress Chart */}
          <motion.div {...fadeIn} transition={{ delay: 0.3 }} className={card}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground">Progress</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{motivational}</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 22%)" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(215 20% 65%)" }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(215 20% 65%)" }} axisLine={false} domain={[50, 100]} />
                <Tooltip
                    contentStyle={{
                      background: "hsl(222 47% 14%)",
                      border: "1px solid hsl(222 30% 22%)",
                      borderRadius: 8,
                      color: "hsl(210 40% 98%)",
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(45 93% 47%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(45 93% 47%)", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
  );
}