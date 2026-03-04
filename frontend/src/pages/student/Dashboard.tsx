import { motion } from "framer-motion";
import { BookOpen, CalendarDays, Clock } from "lucide-react";
import { useStudentCourses, useTimetable, dayDisplayName, formatTime } from "@/lib/api";

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
                    <p className="text-xs text-muted-foreground">{c.subject || "Physics"} · {c.grade || "–"}</p>
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
                  <p className="font-medium text-sm text-foreground">{slot.course?.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" /> {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                  </p>
                  {slot.location && <p className="text-xs text-muted-foreground">{slot.location}</p>}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
