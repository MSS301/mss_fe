import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./css/variables.css";
import "./css/global.css";
import "./css/components.css";
import "./css/App.css";
import Homepage from "./pages/Homepage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import Curriculum from "./pages/Curriculum";
import SubjectManagement from "./pages/admin/SubjectManagement";
import ChapterManagement from "./pages/admin/ChapterManagement";
import LessonCommentManagement from "./pages/admin/LessonCommentManagement";
import LessonRatingManagement from "./pages/admin/LessonRatingManagement";
import LessonFileManagement from "./pages/admin/LessonFileManagement";
import TeacherLessonManagement from "./pages/admin/TeacherLessonManagement";
import CurriculumLessonManagement from "./pages/admin/CurriculumLessonManagement";
import MySlides from "./pages/user/MySlides";
import Wallet from "./pages/user/Wallet";
import Statistics from "./pages/user/Statistics";
import Settings from "./pages/user/Settings";
import UserManagement from "./pages/admin/UserManagement";
import SlideManagement from "./pages/admin/SlideManagement";
import PaymentManagement from "./pages/admin/PaymentManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { logout as logoutApi } from "./api/auth";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import UserNotifications from "./pages/user/Notifications";
import AdminNotificationCenter from "./pages/admin/NotificationCenter";

type Page = "homepage" | "login" | "dashboard";

function AppContent(): JSX.Element {
  const { token, isAuthenticated, isAdmin, logout: authLogout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    return isAuthenticated ? "dashboard" : "homepage";
  });

  function handleLogin(newToken: string) {
    // Login xử lý bởi AuthContext
    setCurrentPage("dashboard");
  }

  async function handleLogout() {
    console.log("handleLogout called");
    if (token) {
      try {
        console.log("Calling logout API with token");
        await logoutApi(token);
        console.log("Logout API success");
      } catch (error) {
        console.error("Logout error:", error);
        // Continue with logout even if API call fails
      }
    }
    console.log("Clearing token and navigating to homepage");
    authLogout();
    setCurrentPage("homepage");
  }

  function navigateToLogin() {
    setCurrentPage("login");
  }

  function navigateToHomepage() {
    setCurrentPage("homepage");
  }

  // Show homepage or login when not authenticated
  if (!isAuthenticated) {
    if (currentPage === "login") {
      return <Login onLogin={handleLogin} onBack={navigateToHomepage} />;
    }
    return <Homepage onNavigateToLogin={navigateToLogin} />;
  }

  // Authenticated routes with React Router
  return (
    <Routes>
      {/* User Routes */}
      {!isAdmin && (
        <>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Layout title="Dashboard" onLogout={handleLogout}>
                <Dashboard token={token!} onLogout={handleLogout} />
              </Layout>
            }
          />
          <Route
            path="/curriculum"
            element={
              <Layout title="Chương trình học" onLogout={handleLogout}>
                <Curriculum />
              </Layout>
            }
          />
          <Route
            path="/slides"
            element={
              <Layout title="Slides của tôi" onLogout={handleLogout}>
                <MySlides />
              </Layout>
            }
          />
          <Route
            path="/wallet"
            element={
              <Layout title="Ví tiền" onLogout={handleLogout}>
                <Wallet
                  token={token!}
                  userId={
                    token ? JSON.parse(atob(token.split(".")[1])).sub : ""
                  }
                />
              </Layout>
            }
          />
          <Route
            path="/statistics"
            element={
              <Layout title="Thống kê" onLogout={handleLogout}>
                <Statistics />
              </Layout>
            }
          />
          <Route
            path="/settings"
            element={
              <Layout title="Cài đặt" onLogout={handleLogout}>
                <Settings />
              </Layout>
            }
          />
          <Route
            path="/notifications"
            element={
              <Layout title="Thông báo" onLogout={handleLogout}>
                <UserNotifications />
              </Layout>
            }
          />
        </>
      )}

      {/* Admin Routes */}
      {isAdmin && (
        <>
          <Route
            path="/"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminLayout title="Admin Dashboard">
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminLayout title="Quản lý người dùng">
                <UserManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/slides"
            element={
              <AdminLayout title="Quản lý Slides">
                <SlideManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <AdminLayout title="Quản lý thanh toán">
                <PaymentManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminLayout title="Cài đặt hệ thống">
                <SystemSettings />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/subject"
            element={
              <AdminLayout title="Quản lý môn học">
                <SubjectManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/chapter"
            element={
              <AdminLayout title="Quản lý chương">
                <ChapterManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/lesson-comment"
            element={
              <AdminLayout title="Quản lý bình luận bài học">
                <LessonCommentManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/lesson-rating"
            element={
              <AdminLayout title="Quản lý đánh giá bài học">
                <LessonRatingManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/lesson-file"
            element={
              <AdminLayout title="Quản lý file bài học">
                <LessonFileManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/teacher-lesson"
            element={
              <AdminLayout title="Quản lý bài học của giáo viên">
                <TeacherLessonManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/curriculum-lesson"
            element={
              <AdminLayout title="Quản lý bài học của chương trình">
                <CurriculumLessonManagement />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <AdminLayout title="Trung tâm thông báo">
                <AdminNotificationCenter />
              </AdminLayout>
            }
          />
        </>
      )}

      {/* Catch all */}
      <Route
        path="*"
        element={
          <Navigate to={isAdmin ? "/admin/dashboard" : "/dashboard"} replace />
        }
      />
    </Routes>
  );
}

function App(): JSX.Element {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
