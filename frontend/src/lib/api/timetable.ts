import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api-client";

export type TimetableSlot = {
  id: number;
  course: any;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location?: string;
};

export function useTimetable() {
  return useQuery({
    queryKey: ["timetable"],
    queryFn: () => get<TimetableSlot[]>("/api/timetable"),
  });
}

export function useTimetableForCourse(courseId: number) {
  return useQuery({
    queryKey: ["timetable", courseId],
    queryFn: () => get<TimetableSlot[]>(`/api/timetable/course/${courseId}`),
  });
}

export function useCreateTimetableSlot() {
  return null;
}

export function useUpdateTimetableSlot() {
  return null;
}

export function useDeleteTimetableSlot() {
  return null;
}

export function dayDisplayName(day: string): string {
  const days: Record<string, string> = {
    SUNDAY: "Sunday",
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
    SATURDAY: "Saturday",
  };
  return days[day] || day;
}

export function dayIndex(day: string): number {
  const days: Record<string, number> = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  };
  return days[day] || 0;
}

export function formatTime(time: string): string {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function dayToGridIndex(day: string): number {
  return dayIndex(day);
}
