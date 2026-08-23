import { BrowserRouter, Navigate, Route, Routes } from "react-router";

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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/publish" element={<PublishPage />} />
            <Route
              path="/my-publications"
              element={<MyPublicationsPage />}
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/publications/:id/edit"
              element={<EditPublicationPage />}
            />
            <Route
              path="/publications/:id"
              element={<PublicationDetailPage />}
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}