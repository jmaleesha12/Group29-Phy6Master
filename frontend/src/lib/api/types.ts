// Shared types matching backend entities

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  role: "STUDENT" | "TEACHER" | "TUTOR" | "ACCOUNTANT" | "ADMIN";
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  teacher?: User;
  batch?: string;
  subject?: string;
  type?: string;
  imageUrl?: string;
}

export interface TimetableSlot {
  id: number;
  course: Course;
  dayOfWeek: string; // "MONDAY", "TUESDAY", etc.
  startTime: string; // "HH:mm:ss"
  endTime: string;   // "HH:mm:ss"
  location?: string;
  notes?: string;
  meetingLink?: string;
}

export interface TimetableSlotDTO {
  courseId: number;
  dayOfWeek: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  location?: string;
  notes?: string;
  meetingLink?: string;
}

export interface Lesson {
  id: number;
  title: string;
  content?: string;
  month?: string;   // "YYYY-MM" e.g. "2026-03"
  courseId?: number; // exposed from backend @JsonProperty
}

export interface LearningMaterial {
  id: number;
  title: string;
  type: "PDF" | "VIDEO" | "LINK" | "NOTE";
  url: string;
  lesson?: Lesson;
}

export interface Student {
  id: number;
  user: User;
  studentId: string;
  enrollmentNumber?: string;
  school?: string;
  batch?: string;
  address?: string;
  parentName?: string;
  parentPhoneNumber?: string;
  enrollmentDate?: string;
}

export interface Teacher {
  id: number;
  user: User;
  employeeId: string;
  email?: string;
  qualification?: string;
  specialization?: string;
  department?: string;
  experience?: string;
  office?: string;
  officePhoneNumber?: string;
  joiningDate?: string;
}
