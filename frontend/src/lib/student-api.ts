import { get, post, put } from "@/lib/api-client";

export type StudentProfile = {
  userId: number;
  studentId: number;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  school: string;
  grade: string;
  address: string;
  parentName: string;
  parentPhoneNumber: string;
  role: string;
  message: string;
};

export type StudentProfileRequest = {
  school: string;
  grade?: string;
  address?: string;
  parentName?: string;
  parentPhoneNumber?: string;
  batch?: string;
  enrollmentNumber?: string;
};

export function getStudentProfile(studentId: string) {
  return get<StudentProfile>(`/api/student/${studentId}/profile`);
}

export function createStudentProfile(userId: number, profile: StudentProfileRequest) {
  return post<StudentProfile>(`/api/student/${userId}/profile`, profile);
}

export function updateStudentProfile(studentId: string, profile: StudentProfileRequest) {
  return put<StudentProfile>(`/api/student/${studentId}/profile`, profile);
}
