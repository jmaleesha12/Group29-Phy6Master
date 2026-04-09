import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, FileText, Video, Link as LinkIcon, StickyNote, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useCourseLessons } from "@/lib/api";
import { downloadUrl } from "@/lib/api-client";
import type { LessonWithMaterials, MaterialResponse } from "@/lib/api/types";

const card = "rounded-xl border border-border bg-card shadow-card overflow-hidden";
const fadeIn = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

const MaterialIcon = ({ type }: { type: MaterialResponse["type"] }) => {
    const icons = {
        PDF: <FileText className="h-4 w-4 text-red-500" />,
        VIDEO: <Video className="h-4 w-4 text-blue-500" />,
        LINK: <LinkIcon className="h-4 w-4 text-green-500" />,
        NOTE: <StickyNote className="h-4 w-4 text-yellow-500" />,
    };
    return icons[type] || null;
};

function LessonCard({ lesson }: { lesson: LessonWithMaterials }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getMaterialUrl = (material: MaterialResponse) => {
        if (material.type === "LINK") {
            return material.url;
        }
        return downloadUrl(`/api/materials/${material.id}/downloads`);
    };

    return (
        <div className={card}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 text-left hover:bg-secondary/50 transition-colors flex justify-between items-center"
            >
                <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                        <h3 className="font-display font-semibold text-foreground">{lesson.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            {lesson.materials.length} material{lesson.materials.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
            </button>

            {isExpanded && (
                <div className="border-t border-border">
                    {lesson.content && (
                        <div className="p-4 bg-secondary/30">
                            <p className="text-sm text-muted-foreground">{lesson.content}</p>
                        </div>
                    )}

                    {lesson.materials.length > 0 ? (
                        <ul className="divide-y divide-border">
                            {lesson.materials.map((material) => (
                                <li key={material.id} className="hover:bg-secondary/30 transition-colors">
                                    <a
                                        href={getMaterialUrl(material)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 text-foreground hover:text-primary"
                                    >
                                        <MaterialIcon type={material.type} />
                                        <span className="flex-1 text-sm">{material.title}</span>
                                        <span className="text-xs text-muted-foreground uppercase bg-secondary px-2 py-1 rounded">
                      {material.type}
                    </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                            No materials available for this lesson
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function CourseDetail() {
    const { courseId } = useParams<{ courseId: string }>();
    const userId = Number(localStorage.getItem("authUserId")) || undefined;

    const { data: lessons = [], isLoading, error } = useCourseLessons(
        userId,
        courseId ? parseInt(courseId) : undefined
    );

    return (
        <div className="space-y-6">
            <motion.div {...fadeIn}>
                <Link
                    to="/student/courses"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to My Courses
                </Link>
                <h1 className="font-display text-2xl font-bold text-foreground">Course Lessons</h1>
            </motion.div>

            {isLoading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                </div>
            ) : error ? (
                <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                    <p>Failed to load course content. You may not be enrolled in this course.</p>
                </div>
            ) : lessons.length === 0 ? (
                <motion.div {...fadeIn} className="rounded-xl border border-border bg-card p-8 text-center">
                    <p className="text-muted-foreground">No lessons available for this course yet.</p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {lessons.map((lesson, i) => (
                        <motion.div key={lesson.id} {...fadeIn} transition={{ delay: i * 0.05 }}>
                            <LessonCard lesson={lesson} />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}