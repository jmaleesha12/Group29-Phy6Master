import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api-client";

// Types matching backend DTOs
export type PaymentStatus = "PAID" | "NOT_PAID";
export type RequestStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "DELIVERED";
export type FinalStatus = "COMPLETED" | "CANCELLED";

export interface TutorialRequest {
    id: number;
    studentId: number;
    studentName: string;
    studentIdNumber: string;
    subject: string;
    course: string;
    requiredTutorial: string;
    paymentStatus: PaymentStatus;
    requestStatus: RequestStatus;
    studentNotified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface DeliveryRecord {
    id: number;
    tutorialRequestId: number;
    studentName: string;
    studentIdNumber: string;
    subject: string;
    course: string;
    deliveryDate: string;
    finalStatus: FinalStatus;
    createdAt: string;
}

export interface CreateTutorialRequest {
    studentId: number;
    subject: string;
    course: string;
    requiredTutorial: string;
    paymentStatus?: PaymentStatus;
}

// Query keys
const KEYS = {
    pending: ["tutorial-requests", "pending"],
    active: ["tutorial-requests", "active"],
    all: ["tutorial-requests"],
    byId: (id: number) => ["tutorial-requests", id],
    byStudent: (studentId: number) => ["tutorial-requests", "student", studentId],
    notifications: (studentId: number) => ["tutorial-requests", "notifications", studentId],
    deliveryRecords: ["delivery-records"],
};

// Get pending requests (for incoming queue)
export function usePendingRequests() {
    return useQuery<TutorialRequest[]>({
        queryKey: KEYS.pending,
        queryFn: () => get<TutorialRequest[]>("/api/tutorial-requests/pending"),
    });
}

// Get active (accepted) requests
export function useActiveRequests() {
    return useQuery<TutorialRequest[]>({
        queryKey: KEYS.active,
        queryFn: () => get<TutorialRequest[]>("/api/tutorial-requests/active"),
    });
}

// Get all requests
export function useAllTutorialRequests() {
    return useQuery<TutorialRequest[]>({
        queryKey: KEYS.all,
        queryFn: () => get<TutorialRequest[]>("/api/tutorial-requests"),
    });
}

// Get a single request by ID
export function useTutorialRequest(id: number | undefined) {
    return useQuery<TutorialRequest>({
        queryKey: KEYS.byId(id!),
        queryFn: () => get<TutorialRequest>(`/api/tutorial-requests/${id}`),
        enabled: !!id,
    });
}

// Get requests by student ID
export function useStudentTutorialRequests(studentId: number | undefined) {
    return useQuery<TutorialRequest[]>({
        queryKey: KEYS.byStudent(studentId!),
        queryFn: () => get<TutorialRequest[]>(`/api/tutorial-requests/student/${studentId}`),
        enabled: !!studentId,
    });
}

// Get unread notifications for a student
export function useStudentNotifications(studentId: number | undefined) {
    return useQuery<TutorialRequest[]>({
        queryKey: KEYS.notifications(studentId!),
        queryFn: () => get<TutorialRequest[]>(`/api/tutorial-requests/student/${studentId}/notifications`),
        enabled: !!studentId,
    });
}

// Get all delivery records
export function useDeliveryRecords() {
    return useQuery<DeliveryRecord[]>({
        queryKey: KEYS.deliveryRecords,
        queryFn: () => get<DeliveryRecord[]>("/api/delivery-records"),
    });
}

// Create a new tutorial request
export function useCreateTutorialRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateTutorialRequest) =>
            post<TutorialRequest>("/api/tutorial-requests", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYS.pending });
            queryClient.invalidateQueries({ queryKey: KEYS.all });
        },
    });
}

// Accept a tutorial request
export function useAcceptRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) =>
            post<TutorialRequest>(`/api/tutorial-requests/${id}/accept`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYS.pending });
            queryClient.invalidateQueries({ queryKey: KEYS.active });
            queryClient.invalidateQueries({ queryKey: KEYS.all });
        },
    });
}

// Decline a tutorial request
export function useDeclineRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) =>
            post<TutorialRequest>(`/api/tutorial-requests/${id}/decline`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYS.pending });
            queryClient.invalidateQueries({ queryKey: KEYS.all });
        },
    });
}

// Mark a request as delivered
export function useMarkAsDelivered() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) =>
            post<DeliveryRecord>(`/api/tutorial-requests/${id}/deliver`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYS.active });
            queryClient.invalidateQueries({ queryKey: KEYS.all });
            queryClient.invalidateQueries({ queryKey: KEYS.deliveryRecords });
        },
    });
}

// Mark notifications as read
export function useMarkNotificationsAsRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (studentId: number) =>
            post<void>(`/api/tutorial-requests/student/${studentId}/notifications/read`),
        onSuccess: (_, studentId) => {
            queryClient.invalidateQueries({ queryKey: KEYS.notifications(studentId) });
        },
    });
}

// Update payment status
export function useUpdatePaymentStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, paymentStatus }: { id: number; paymentStatus: PaymentStatus }) =>
            fetch(`/api/tutorial-requests/${id}/payment-status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentStatus }),
            }).then(res => res.json()),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEYS.pending });
            queryClient.invalidateQueries({ queryKey: KEYS.active });
            queryClient.invalidateQueries({ queryKey: KEYS.all });
        },
    });
}

// Dashboard statistics
export interface TuteDashboardStats {
    pendingCount: number;
    activeCount: number;
    deliveredCount: number;
}

export function useTuteDashboardStats() {
    const { data: pending = [] } = usePendingRequests();
    const { data: active = [] } = useActiveRequests();
    const { data: delivered = [] } = useDeliveryRecords();

    return {
        pendingCount: pending.length,
        activeCount: active.length,
        deliveredCount: delivered.length,
    };
}
