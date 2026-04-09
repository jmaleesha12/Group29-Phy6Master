import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api-client";
import type { Student, Course, LessonWithMaterials, MaterialResponse } from "./types";

export type EnrollmentSummary = {
  id: number;
  courseId: number;
  courseName: string;
  status: string;
  message?: string;
  enrollmentDate?: string;
};

export function useAllStudents() {
  return useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: () => get<Student[]>("/api/students/all"),
  });
}

export function useStudentByUser(userId: number | undefined) {
  return useQuery<Student>({
    queryKey: ["student-by-user", userId],
    queryFn: () => get<Student>(`/api/students/by-user/${userId}`),
    enabled: !!userId,
  });
}

export function useStudentCourses(userId: number | undefined) {
  return useQuery<Course[]>({
    queryKey: ["student-courses", userId],
    queryFn: () => get<Course[]>(`/api/students/by-user/${userId}/courses`),
    enabled: !!userId,
  });
}

export function usePendingEnrollments(userId?: number) {
  return useQuery<EnrollmentSummary[]>({
    queryKey: ["pending-enrollments", userId],
    queryFn: () => get<EnrollmentSummary[]>(`/api/student/enrollments/pending/${userId}`),
    enabled: !!userId,
  });
}

export function useClassAccess(userId?: number, courseId?: number) {
  return useQuery({
    queryKey: ["class-access", userId, courseId],
    queryFn: () => get<{ canAccess: boolean; status: string; message: string }>(`/api/student/enrollments/access/${userId}/${courseId}`),
    enabled: !!userId && !!courseId,
  });
}

export function useAllEnrollments(userId?: number) {
  return useQuery<EnrollmentSummary[]>({
    queryKey: ["all-enrollments", userId],
    queryFn: () => get<EnrollmentSummary[]>(`/api/student/enrollments/status/${userId}`),
    enabled: !!userId,
  });
}

export type PaymentHistoryResponseDTO = {
  id: number;
  courseId: number;
  courseName: string;
  amount: number;
  paymentMethod: string;
  status: string;
  submittedAt: string;
  verifiedAt: string;
  rejectionReason: string;
};

export function usePaymentHistory(studentId?: number) {
  return useQuery<PaymentHistoryResponseDTO[]>({
    queryKey: ["student-payment-history", studentId],
    queryFn: () => get<PaymentHistoryResponseDTO[]>(`/api/student/payments/history/${studentId}`),
    enabled: !!studentId,
  });
}

export function useCourseLessons(userId: number | undefined, courseId: number | undefined) {
  return useQuery<LessonWithMaterials[]>({
    queryKey: ["course-lessons", userId, courseId],
    queryFn: () => get<LessonWithMaterials[]>(`/api/students/by-user/${userId}/courses/${courseId}/lessons`),
    enabled: !!userId && !!courseId,
  });
}

export function useLessonMaterials(userId: number | undefined, lessonId: number | undefined) {
  return useQuery<MaterialResponse[]>({
    queryKey: ["lesson-materials", userId, lessonId],
    queryFn: () => get<MaterialResponse[]>(`/api/students/by-user/${userId}/lessons/${lessonId}/materials`),
    enabled: !!userId && !!lessonId,
  });
}
