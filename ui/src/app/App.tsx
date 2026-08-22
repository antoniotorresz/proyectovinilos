import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import PublishPage from "./pages/PublishPage";
import MyPublicationsPage from "./pages/MyPublicationsPage";
import ProfilePage from "./pages/ProfilePage";
import EditPublicationPage from "./pages/EditPublicationPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/publish" element={<PublishPage />} />
          <Route path="/my-publications" element={<MyPublicationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />  
          <Route path="/publications/:id/edit" element={<EditPublicationPage />} />    
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}