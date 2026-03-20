import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api-client";
import type { Student, Course } from "./types";

export function useAllStudents() {
  return useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: () => get<Student[]>("/api/students/all"),
  });
}

/** Get the Student entity for the currently logged-in user (by User ID). */
export function useStudentByUser(userId: number | undefined) {
  return useQuery<Student>({
    queryKey: ["student-by-user", userId],
    queryFn: () => get<Student>(`/api/students/by-user/${userId}`),
    enabled: !!userId,
  });
}

/** Get enrolled courses for a student identified by their User ID. */
export function useStudentCourses(userId: number | undefined) {
  return useQuery<Course[]>({
    queryKey: ["student-courses", userId],
    queryFn: () => get<Course[]>(`/api/students/by-user/${userId}/courses`),
    enabled: !!userId,
  });
}

/** Get lessons with materials for a specific course */
export function useCourseLessons(userId: number | undefined, courseId: number | undefined) {
  return useQuery<LessonWithMaterials[]>({
    queryKey: ["course-lessons", userId, courseId],
    queryFn: () => get<LessonWithMaterials[]>(`/api/students/by-user/${userId}/courses/${courseId}/lessons`),
    enabled: !!userId && !!courseId,
  });
}

/** Get materials for a specific lesson */
export function useLessonMaterials(userId: number | undefined, lessonId: number | undefined) {
  return useQuery<MaterialResponse[]>({
    queryKey: ["lesson-materials", userId, lessonId],
    queryFn: () => get<MaterialResponse[]>(`/api/students/by-user/${userId}/lessons/${lessonId}/materials`),
    enabled: !!userId && !!lessonId,
  });
}

