import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useStudentCourses } from "@/lib/api";
import type { Course } from "@/lib/api/types";

const card = "rounded-xl border border-border bg-card shadow-card overflow-hidden hover:shadow-lg transition-shadow";
const fadeIn = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

function CourseCard({ course }: { course: Course }) {
    return (
        <Link to={`/student/courses/${course.id}`} className={card}>
            <motion.div {...fadeIn} className="flex flex-col h-full">
                {course.imageUrl && (
                    <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-40 object-cover"
                    />
                )}
                <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-display font-semibold text-foreground mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
                        {course.description || "No description available"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {course.subject && (
                            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                {course.subject}
              </span>
                        )}
                        {course.batch && (
                            <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded">
                {course.batch}
              </span>
                        )}
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

export default function MyCourses() {
    const userId = Number(localStorage.getItem("authUserId")) || undefined;
    const { data: courses = [], isLoading, error } = useStudentCourses(userId);

    return (
        <div className="space-y-6">
            <motion.div {...fadeIn} className="flex items-center gap-3">
                <BookOpen className="h-7 w-7 text-primary" />
                <h1 className="font-display text-2xl font-bold text-foreground">My Enrolled Courses</h1>
            </motion.div>

            {isLoading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                </div>
            ) : error ? (
                <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                    <p>Failed to load courses. Please try again later.</p>
                </div>
            ) : courses.length === 0 ? (
                <motion.div {...fadeIn} className="rounded-xl border border-border bg-card p-8 text-center">
                    <p className="text-muted-foreground">You are not enrolled in any courses yet.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, i) => (
                        <motion.div key={course.id} {...fadeIn} transition={{ delay: i * 0.05 }}>
                            <CourseCard course={course} />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}