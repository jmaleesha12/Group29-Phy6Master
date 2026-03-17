import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, post, put, del } from "@/lib/api-client";
import type { Announcement } from "./types";

/** Get all announcements for a specific course */
export function useAnnouncementsByCourse(courseId: number | undefined) {
  return useQuery<Announcement[]>({
    queryKey: ["announcements-by-course", courseId],
    queryFn: () => get<Announcement[]>(`/api/announcements/course/${courseId}`),
    enabled: !!courseId,
  });
}

/** Get all announcements created by a teacher */
export function useAnnouncementsByTeacher(teacherId: number | undefined) {
  return useQuery<Announcement[]>({
    queryKey: ["announcements-by-teacher", teacherId],
    queryFn: () => get<Announcement[]>(`/api/announcements/teacher/${teacherId}`),
    enabled: !!teacherId,
  });
}

/** Get all announcements for student's enrolled courses */
export function useAnnouncementsForStudent(userId: number | undefined) {
  return useQuery<Announcement[]>({
    queryKey: ["announcements-for-student", userId],
    queryFn: () => get<Announcement[]>(`/api/announcements/student/${userId}`),
    enabled: !!userId,
  });
}

/** Get a single announcement by ID */
export function useAnnouncements(announcementId: number | undefined) {
  return useQuery<Announcement>({
    queryKey: ["announcement", announcementId],
    queryFn: () => get<Announcement>(`/api/announcements/${announcementId}`),
    enabled: !!announcementId,
  });
}

/** Create a new announcement */
export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      courseId: number;
      teacherId: number;
      title: string;
      content: string;
    }) => {
      return post<Announcement>("/api/announcements", data);
    },
    onSuccess: (data: { courseId: any; teacherId: any; }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["announcements-by-course", data.courseId] });
      queryClient.invalidateQueries({ queryKey: ["announcements-by-teacher", data.teacherId] });
      queryClient.invalidateQueries({ queryKey: ["announcements-for-student"] });
    },
  });
}

/** Update an existing announcement */
export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: number;
      teacherId: number;
      title: string;
      content: string;
    }) => {
      return put<Announcement>(`/api/announcements/${data.id}`, {
        teacherId: data.teacherId,
        title: data.title,
        content: data.content,
      });
    },
    onSuccess: (data: { id: any; courseId: any; teacherId: any; }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["announcement", data.id] });
      queryClient.invalidateQueries({ queryKey: ["announcements-by-course", data.courseId] });
      queryClient.invalidateQueries({ queryKey: ["announcements-by-teacher", data.teacherId] });
      queryClient.invalidateQueries({ queryKey: ["announcements-for-student"] });
    },
  });
}

/** Delete an announcement */
export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; teacherId: number }) => {
      return del<void>(`/api/announcements/${data.id}?teacherId=${data.teacherId}`);
    },
    onSuccess: () => {
      // Invalidate all announcement queries
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcements-by-course"] });
      queryClient.invalidateQueries({ queryKey: ["announcements-by-teacher"] });
      queryClient.invalidateQueries({ queryKey: ["announcements-for-student"] });
    },
  });
}
