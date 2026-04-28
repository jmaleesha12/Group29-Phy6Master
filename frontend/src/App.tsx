import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useTheme } from "@/hooks/useTheme";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Classes from "./pages/Classes";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import StudentLayout from "./components/StudentLayout";
import Dashboard from "./pages/student/Dashboard";
import StudentClasses from "./pages/student/Classes";
import Schedule from "./pages/student/Schedule";
import SettingsPage from "./pages/student/Settings";
import QuizGame from "./pages/student/QuizGame";
import QuizSelection from "./pages/student/QuizSelection";
import QuizDetails from "./pages/student/QuizDetails";
import TeacherDashboard from "./pages/teacher/Dashboard";
import Students from "./pages/teacher/Students";
import ClassManagement from "./pages/teacher/ClassManagement";
import TeacherQuizzes from "./pages/teacher/Quizzes";
import ContentUpload from "./pages/teacher/ContentUpload";
import Timetable from "./pages/teacher/Timetable";
import Announcements from "./pages/teacher/Announcements";
import TeacherLayout from "./components/TeacherLayout";
import NotFound from "./pages/NotFound";
import PaymentPage from "./pages/student/PaymentPage";
import NotificationsPage from "./pages/student/NotificationsPage";
import Chatbot from "./pages/student/Chatbot";
import AccountantLayout from "./components/AccountantLayout";
import PendingPaymentsList from "./pages/accountant/PendingPaymentsList";
import PaymentVerificationDetail from "./pages/accountant/PaymentVerificationDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,                // data is immediately stale → refetch on every mount
      gcTime: 0,                   // don't keep stale cache entries after unmount
      refetchOnMount: "always",    // always refetch when component mounts (even if data exists)
      refetchOnWindowFocus: true,  // refetch when user tabs back / focuses window
      retry: 2,                    // retry failed requests twice before giving up
    },
  },
});

const App = () => {
  useTheme();
  return (

    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/teacher" element={<TeacherLayout />}>
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="classes" element={<ClassManagement />} />
              <Route path="content" element={<ContentUpload />} />
              <Route path="timetable" element={<Timetable />} />
              <Route path="announcements" element={<Announcements />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="resources" element={<Resources />} />
              <Route path="classes" element={<StudentClasses />} />
              <Route path="classes/:classId/payment" element={<PaymentPage />} />
              <Route path="courses" element={<MyCourses />} />
              <Route path="courses/:courseId" element={<CourseDetails />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="/accountant" element={<AccountantLayout />}>
              <Route index element={<Navigate to="payments" replace />} />
              <Route path="payments" element={<PendingPaymentsList />} />
              <Route path="payments/:paymentId" element={<PaymentVerificationDetail />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>

      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/teacher" element={<TeacherLayout />}>
                <Route path="dashboard" element={<TeacherDashboard />} />
                <Route path="students" element={<Students />} />
                <Route path="classes" element={<ClassManagement />} />
                <Route path="quizzes" element={<TeacherQuizzes />} />
                <Route path="content" element={<ContentUpload />} />
                <Route path="timetable" element={<Timetable />} />
                <Route path="announcements" element={<Announcements />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
              <Route path="/student" element={<StudentLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="classes" element={<StudentClasses />} />
                <Route path="classes/:classId/payment" element={<PaymentPage />} />
                <Route path="quizzes" element={<QuizSelection />} />
                <Route path="quizzes/:quizId" element={<QuizDetails />} />
                <Route path="quizzes/:quizId/play" element={<QuizGame />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="chatbot" element={<Chatbot />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>

  );
};

export default App;

