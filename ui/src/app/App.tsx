import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router";

import { AuthProvider } from "./context/AuthContext";

import MainLayout from "./layouts/MainLayout";

import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import PublishPage from "./pages/PublishPage";
import MyPublicationsPage from "./pages/MyPublicationsPage";
import ProfilePage from "./pages/ProfilePage";
import EditPublicationPage from "./pages/EditPublicationPage";
import PublicationDetailPage from "./pages/PublicationDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import PublicUserProfilePage from "./pages/PublicUserProfilePage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>

          <Route
            path="/login"
            element={
              <LoginPage />
            }
          />

          <Route
            path="/register"
            element={
              <RegisterPage />
            }
          />

          <Route
            element={
              <MainLayout />
            }
          >

            <Route
              path="/"
              element={
                <HomePage />
              }
            />

            <Route
              path="/explore"
              element={
                <ExplorePage />
              }
            />

            <Route
              path="/users/:id"
              element={
                <PublicUserProfilePage />
              }
            />

            <Route
              path="/publications/:id"
              element={
                <PublicationDetailPage />
              }
            />

            <Route
              path="/publish"
              element={
                <ProtectedRoute>
                  <PublishPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-publications"
              element={
                <ProtectedRoute>
                  <MyPublicationsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/publications/:id/edit"
              element={
                <ProtectedRoute>
                  <EditPublicationPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />

          </Route>

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}