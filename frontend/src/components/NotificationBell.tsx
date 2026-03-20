import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCircle2 } from "lucide-react";
import { useAnnouncementsForStudent } from "@/lib/api";

export default function NotificationBell({ userId }: { userId: number | undefined }) {
  const { data: announcements = [] } = useAnnouncementsForStudent(userId);
  const [isOpen, setIsOpen] = useState(false);
  const [readAnnouncements, setReadAnnouncements] = useState<Set<number>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem("readAnnouncements");
    if (stored) {
      setReadAnnouncements(new Set(JSON.parse(stored)));
    }
  }, []);

  const unreadCount = announcements.filter((a) => !readAnnouncements.has(a.id)).length;

  const handleMarkAsRead = (announcementId: number) => {
    const newRead = new Set(readAnnouncements);
    newRead.add(announcementId);
    setReadAnnouncements(newRead);
    localStorage.setItem("readAnnouncements", JSON.stringify(Array.from(newRead)));
  };

  const handleMarkAllAsRead = () => {
    const newRead = new Set(announcements.map((a) => a.id));
    setReadAnnouncements(newRead);
    localStorage.setItem("readAnnouncements", JSON.stringify(Array.from(newRead)));
  };

  const getGroupedAnnouncements = () => {
    return announcements.reduce(
      (acc, announcement) => {
        const courseId = announcement.courseId;
        if (!acc[courseId]) {
          acc[courseId] = { courseName: announcement.courseName, items: [] };
        }
        acc[courseId].items.push(announcement);
        return acc;
      },
      {} as Record<number, { courseName: string; items: typeof announcements }>
    );
  };

  const groupedAnnouncements = getGroupedAnnouncements();
  const totalAnnouncements = announcements.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        title="Announcements"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-96 max-h-[600px] overflow-hidden rounded-xl border border-border bg-card shadow-card z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/50">
              <h3 className="font-display font-semibold text-foreground">Announcements</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Mark all as read
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {totalAnnouncements === 0 ? (
                <div className="p-6 text-center">
                  <CheckCircle2 className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No announcements yet</p>
                </div>
              ) : (
                <div className="space-y-0 divide-y divide-border">
                  {Object.entries(groupedAnnouncements).map(([_, courseData]) => (
                    <div key={courseData.courseName}>
                      <div className="px-4 py-3 bg-secondary/30 sticky top-0">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {courseData.courseName}
                        </p>
                      </div>
                      {courseData.items.map((announcement) => {
                        const isRead = readAnnouncements.has(announcement.id);
                        return (
                          <button
                            key={announcement.id}
                            onClick={() => handleMarkAsRead(announcement.id)}
                            className={`w-full p-4 text-left hover:bg-accent transition-colors border-b border-border last:border-b-0 ${
                              !isRead ? "bg-primary/5" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {!isRead && (
                                <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className={`font-medium text-sm ${!isRead ? "text-foreground" : "text-muted-foreground"}`}>
                                  {announcement.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {announcement.content}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-muted-foreground">{announcement.teacherName}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(announcement.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {totalAnnouncements > 0 && (
              <div className="p-3 border-t border-border bg-secondary/30 text-center">
                <p className="text-xs text-muted-foreground">
                  {unreadCount === 0 ? "All caught up!" : `${unreadCount} unread announcement${unreadCount !== 1 ? "s" : ""}`}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
