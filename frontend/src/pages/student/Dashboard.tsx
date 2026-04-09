import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BookOpen, CalendarDays, Clock, ExternalLink, X, Trophy, Target, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnnouncementsForStudent, useStudentCourses, useStudentDashboard, useTimetable, dayDisplayName, formatTime } from "@/lib/api";
import type { TimetableSlot, Announcement } from "@/lib/api";



const card = "rounded-xl border border-border bg-card p-5 shadow-card";
const fadeIn = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("authUserId")) || undefined;
  const studentName = localStorage.getItem("authName") || "Student";
  const { data: courses = [], isLoading: loadingCourses } = useStudentCourses(userId);
  const { data: progress, isLoading: loadingProgress } = useStudentDashboard(userId);
  const { data: timetable = [], isLoading: loadingTimetable } = useTimetable();
  const { data: announcements = [], isLoading: loadingAnnouncements } = useAnnouncementsForStudent(userId);

  const [readAnnouncements, setReadAnnouncements] = useState<Set<number>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Today's day of week as backend enum
  const todayEnum = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][new Date().getDay()];

  // Filter timetable to courses the student is enrolled in
  const enrolledCourseIds = new Set(courses.map((c) => c.id));
  const todaySlots = timetable
    .filter((s) => s.dayOfWeek === todayEnum && enrolledCourseIds.has(s.course?.id))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Live-detection: re-render every 10s with real timestamp
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 10_000);
    return () => clearInterval(id);
  }, []);

  /** True only while class is actually running (for LIVE badge) */
  const isLive = (slot: TimetableSlot) => {
    const d = new Date(now);
    const nowMin = d.getHours() * 60 + d.getMinutes();
    const [sh, sm] = slot.startTime.split(":").map(Number);
    const [eh, em] = slot.endTime.split(":").map(Number);
    return nowMin >= sh * 60 + sm && nowMin < eh * 60 + em;
  };

  /** True from 10 minutes before class start until 10 minutes after class end (for Join Now) */
  const isJoinable = (slot: TimetableSlot) => {
    const d = new Date(now);
    const nowMin = d.getHours() * 60 + d.getMinutes();
    const [sh, sm] = slot.startTime.split(":").map(Number);
    const [eh, em] = slot.endTime.split(":").map(Number);
    return nowMin >= sh * 60 + sm - 10 && nowMin < eh * 60 + em + 10;
  };

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

  const openAnnouncement = (announcement: Announcement) => {
    markRead(announcement.id);
    setSelectedAnnouncement(announcement);
  };

  const closeAnnouncement = () => {
    setSelectedAnnouncement(null);
  };

  const displayed = showAll ? announcements : announcements.slice(0, 3);
  const unreadCount = announcements.filter((a) => !readAnnouncements.has(a.id)).length;

  return (
    <div className="space-y-6">
      <motion.h1 {...fadeIn} className="font-display text-2xl font-bold text-foreground">
        Welcome back, {studentName}!
      </motion.h1>

      <motion.div {...fadeIn} transition={{ delay: 0.05 }} className={card}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-foreground">Quiz Progress Overview</h2>
          {progress && progress.totalQuizzes > 0 && (
            <Button variant="outline" size="sm" onClick={() => navigate("/student/quizzes")}>Start New Quiz</Button>
          )}
        </div>

        {loadingProgress ? (
          <p className="text-sm text-muted-foreground">Loading progress...</p>
        ) : !progress || progress.totalQuizzes === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">You haven’t completed any quizzes yet. Start a quiz to see your progress.</p>
            <Button className="mt-3 gradient-cta text-primary-foreground" onClick={() => navigate("/student/quizzes")}>Start Quiz</Button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Total Quizzes</p>
                <p className="text-xl font-semibold text-foreground flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" />{progress.totalQuizzes}</p>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Average Score</p>
                <p className="text-xl font-semibold text-foreground flex items-center gap-2"><Target className="h-4 w-4 text-primary" />{Math.round(progress.averageScore)}%</p>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Highest Score</p>
                <p className="text-xl font-semibold text-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-500" />{Math.round(progress.highestScore)}%</p>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Lowest Score</p>
                <p className="text-xl font-semibold text-foreground flex items-center gap-2"><TrendingDown className="h-4 w-4 text-amber-500" />{Math.round(progress.lowestScore)}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border p-3">
                <h3 className="text-sm font-semibold text-foreground mb-2">Strengths</h3>
                {progress.strengths.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No strength insights yet.</p>
                ) : (
                  <div className="space-y-2">
                    {progress.strengths.slice(0, 5).map((item, index) => (
                      <div key={`${item.label}-${index}`} className="flex items-center justify-between text-xs bg-secondary p-2 rounded">
                        <span className="text-foreground truncate pr-2">{item.label}</span>
                        <span className="text-green-500 font-medium">{Math.round(item.accuracyPercentage)}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-border p-3">
                <h3 className="text-sm font-semibold text-foreground mb-2">Areas for Improvement</h3>
                {progress.weaknesses.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No weakness insights yet.</p>
                ) : (
                  <div className="space-y-2">
                    {progress.weaknesses.slice(0, 5).map((item, index) => (
                      <div key={`${item.label}-${index}`} className="flex items-center justify-between text-xs bg-secondary p-2 rounded">
                        <span className="text-foreground truncate pr-2">{item.label}</span>
                        <span className="text-amber-500 font-medium">{Math.round(item.accuracyPercentage)}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Recent Quiz Attempts</h3>
              <div className="space-y-2">
                {progress.recentAttempts.slice(0, 8).map((attempt, index) => (
                  <div key={`${attempt.quizId}-${attempt.attemptedAt}-${index}`} className="rounded-lg bg-secondary p-3 text-xs flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{attempt.quizTitle}</p>
                      <p className="text-muted-foreground">{new Date(attempt.attemptedAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-foreground font-semibold">{attempt.correctAnswers}/{attempt.totalQuestions} ({Math.round(attempt.scorePercentage)}%)</p>
                      <p className={attempt.status === "PASS" ? "text-green-500" : "text-destructive"}>{attempt.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrolled Courses */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className={`${card} lg:col-span-2`}>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">My Courses</h2>
          </div>
          {loadingCourses ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="text-sm text-muted-foreground">You are not enrolled in any courses yet.</p>
          ) : (
            <div className="space-y-3">
              {courses.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                  <div>
                    <p className="font-medium text-sm text-foreground">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.subject || "Physics"} · {c.batch || "–"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Today's Schedule */}
        <motion.div {...fadeIn} transition={{ delay: 0.15 }} className={card}>
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold text-foreground">Today ({dayDisplayName(todayEnum)})</h2>
          </div>
          {loadingTimetable ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : todaySlots.length === 0 ? (
            <p className="text-sm text-muted-foreground">No classes scheduled for today.</p>
          ) : (
            <div className="space-y-2">
              {todaySlots.map((slot) => (
                <div key={slot.id} className="p-3 rounded-lg bg-secondary">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-foreground">{slot.course?.title}</p>
                    {isLive(slot) && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                  </p>
                  {slot.location && <p className="text-xs text-muted-foreground">{slot.location}</p>}
                  {isJoinable(slot) && slot.meetingLink && (
                    <Button size="sm" className="mt-2 gap-1.5 gradient-cta text-primary-foreground w-full"
                      onClick={() => window.open(slot.meetingLink, "_blank")}>
                      <ExternalLink className="h-3.5 w-3.5" /> Join Now
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Announcements — real API data, read state synced with NotificationBell */}
        <motion.div {...fadeIn} transition={{ delay: 0.2 }} className={card}>
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
                    <button
                      key={a.id}
                      onClick={() => openAnnouncement(a)}
                      className={`w-full p-3 rounded-lg text-sm text-left hover:bg-accent/50 transition-colors ${isRead ? "bg-secondary" : "bg-accent border-l-2 border-primary"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">{a.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(a.createdAt).toLocaleDateString()} · {a.courseName}
                          </p>
                        </div>
                        {!isRead && (
                          <span className="shrink-0 h-2 w-2 rounded-full bg-primary mt-1.5" />
                        )}
                      </div>
                    </button>
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

      {/* Announcement Detail Modal */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeAnnouncement}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                  {selectedAnnouncement.courseName}
                </span>
                <button onClick={closeAnnouncement} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-2">
                {selectedAnnouncement.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <span>By {selectedAnnouncement.teacherName}</span>
                <span>•</span>
                <span>{new Date(selectedAnnouncement.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedAnnouncement.content}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

