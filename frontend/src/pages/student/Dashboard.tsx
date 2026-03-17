import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, CalendarDays, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudentCourses, useTimetable, dayDisplayName, formatTime } from "@/lib/api";
import type { TimetableSlot } from "@/lib/api";

const card = "rounded-xl border border-border bg-card p-5 shadow-card";
const fadeIn = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const userId = Number(localStorage.getItem("authUserId")) || undefined;
  const studentName = localStorage.getItem("authName") || "Student";
  const { data: courses = [], isLoading: loadingCourses } = useStudentCourses(userId);
  const { data: timetable = [], isLoading: loadingTimetable } = useTimetable();

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

  return (
    <div className="space-y-6">
      <motion.h1 {...fadeIn} className="font-display text-2xl font-bold text-foreground">
        Welcome back, {studentName}! 👋
      </motion.h1>

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
      </div>
    </div>
  );
}
