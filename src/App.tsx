import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./css/variables.css";
import "./css/global.css";
import "./css/components.css";
import "./css/App.css";
import Homepage from "./pages/Homepage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import Curriculum from "./pages/Curriculum";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import SubjectManagement from "./pages/admin/SubjectManagement";
import ChapterManagement from "./pages/admin/ChapterManagement";
import LessonCommentManagement from "./pages/admin/LessonCommentManagement";
import LessonRatingManagement from "./pages/admin/LessonRatingManagement";
import LessonFileManagement from "./pages/admin/LessonFileManagement";
import TeacherLessonManagement from "./pages/admin/TeacherLessonManagement";
import CurriculumLessonManagement from "./pages/admin/CurriculumLessonManagement";
import MySlides from "./pages/user/MySlides";
import MyClasses from "./pages/user/MyClasses";
import ClassLessons from "./pages/user/ClassLessons";
import Wallet from "./pages/user/Wallet";
import ManageMindmaps from "./pages/user/ManageMindmaps";
import Packages from "./pages/user/Packages";
import PaymentResult from "./pages/payment/PaymentResult";
import Statistics from "./pages/user/Statistics";
import Settings from "./pages/user/Settings";
import UserManagement from "./pages/admin/UserManagement";
import SlideManagement from "./pages/admin/SlideManagement";
import PaymentManagement from "./pages/admin/PaymentManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import OAuth2Callback from "./pages/OAuth2Callback";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { logout as logoutApi } from "./api/auth";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import UserNotifications from "./pages/user/Notifications";
import AdminNotificationCenter from "./pages/admin/NotificationCenter";
import TeacherVerification from "./pages/admin/TeacherVerification";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import CreateLesson from "./pages/teacher/CreateLesson";
import Classrooms from "./pages/teacher/Classrooms";
import ClassroomDetail from "./pages/teacher/ClassroomDetail";
import LessonDetail from "./pages/LessonDetail";

function AppContent(): JSX.Element {
  const {
    token,
    isAuthenticated,
    isAdmin,
    isTeacher,
    isStudent,
    logout: authLogout,
  } = useAuth();
  const navigate = useNavigate();
  const currentUserId =
    token && token.split(".")[1]
      ? JSON.parse(atob(token.split(".")[1])).sub
      : "";

  function handleLogin(newToken: string) {
    // Login handled by AuthContext, just navigate to dashboard
    // Route will be determined by role in useEffect
    navigate("/");
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
    navigate("/");
  }

  function navigateToLogin() {
    navigate("/login");
  }

  function navigateToHomepage() {
    navigate("/");
  }

  // Using React Router for all routes
  return (
    <Routes>
      {/* Public OAuth2 Callback Route */}
      <Route path="/oauth2/callback" element={<OAuth2Callback />} />

      {/* Unauthenticated routes */}
      {!isAuthenticated && (
        <>
          <Route
            path="/"
            element={<Homepage onNavigateToLogin={navigateToLogin} />}
          />
          <Route
            path="/login"
            element={
              <Login onLogin={handleLogin} onBack={navigateToHomepage} />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}

      {/* Authenticated User Routes */}
      {isAuthenticated && !isAdmin && (
        <>
          <Route
            path="/"
            element={
              <Navigate
                to={isTeacher ? "/teacher/dashboard" : "/dashboard"}
                replace
              />
            }
          />
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
              <Layout
                title="Chương trình học"
                breadcrumb={[
                  { label: "Trang chủ", href: "/dashboard" },
                  { label: "Khám phá chương trình" },
                ]}
                onLogout={handleLogout}
              >
                <Curriculum />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout title="Hồ sơ" onLogout={handleLogout}>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <Layout title="Chỉnh sửa hồ sơ" onLogout={handleLogout}>
                <EditProfile />
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
            path="/user/classes"
            element={
              <Layout title="Lớp học của tôi" onLogout={handleLogout}>
                <MyClasses />
              </Layout>
            }
          />
          <Route
            path="/user/classes/:classId/lessons"
            element={
              <Layout title="Bài học" onLogout={handleLogout}>
                <ClassLessons />
              </Layout>
            }
          />
          <Route
            path="/wallet"
            element={
              <Layout title="Ví tiền" onLogout={handleLogout}>
                <Wallet token={token!} userId={currentUserId} />
              </Layout>
            }
          />
          <Route
            path="/mindmaps"
            element={
              <Layout title="Quản lý mindmap" onLogout={handleLogout}>
                <ManageMindmaps token={token!} userId={currentUserId} />
              </Layout>
            }
          />
          <Route
            path="/packages"
            element={
              <Layout title="Nạp Credits" onLogout={handleLogout}>
                <Packages />
              </Layout>
            }
          />
          <Route path="/payment/result" element={<PaymentResult />} />
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
          <Route
            path="/admin/teacher-verification"
            element={
              <AdminLayout title="Phê duyệt giáo viên">
                <TeacherVerification />
              </AdminLayout>
            }
          />
        </>
      )}

      {/* Teacher Routes */}
      {isAuthenticated && (
        <>
          <Route
            path="/teacher/dashboard"
            element={
              <Layout title="Dashboard Giáo viên" onLogout={handleLogout}>
                <TeacherDashboard />
              </Layout>
            }
          />
          <Route
            path="/teacher/classrooms"
            element={
              <Layout title="Lớp học của tôi" onLogout={handleLogout}>
                <Classrooms />
              </Layout>
            }
          />
          <Route
            path="/teacher/classrooms/:id"
            element={
              <Layout title="Chi tiết lớp học" onLogout={handleLogout}>
                <ClassroomDetail />
              </Layout>
            }
          />
          <Route
            path="/teacher/create-lesson"
            element={
              <Layout title="Tạo bài học" onLogout={handleLogout}>
                <CreateLesson />
              </Layout>
            }
          />
          <Route
            path="/lesson/:id"
            element={
              <Layout title="Chi tiết bài học" onLogout={handleLogout}>
                <LessonDetail />
              </Layout>
            }
          />
        </>
      )}

      {/* Catch all - redirect based on auth state */}
      {isAuthenticated && (
        <Route
          path="*"
          element={
            <Navigate
              to={
                isAdmin
                  ? "/admin/dashboard"
                  : isTeacher
                  ? "/teacher/dashboard"
                  : "/dashboard"
              }
              replace
            />
          }
        />
      )}
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
