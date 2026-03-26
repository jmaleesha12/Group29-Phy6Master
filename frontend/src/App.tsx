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
import ResetPassword from "./pages/ResetPassword";
import StudentLayout from "./components/StudentLayout";
import Dashboard from "./pages/student/Dashboard";
import StudentClasses from "./pages/student/Classes";
import Schedule from "./pages/student/Schedule";
import SettingsPage from "./pages/student/Settings";
import StudentProfile from "./pages/student/Profile";
import TeacherDashboard from "./pages/teacher/Dashboard";
import ClassManagement from "./pages/teacher/ClassManagement";
import ContentUpload from "./pages/teacher/ContentUpload";
import Timetable from "./pages/teacher/Timetable";
import TeacherLayout from "./components/TeacherLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/teacher" element={<TeacherLayout />}>
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="classes" element={<ClassManagement />} />
              <Route path="content" element={<ContentUpload />} />
              <Route path="timetable" element={<Timetable />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
            <Route path="/student" element={<StudentLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="classes" element={<StudentClasses />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
