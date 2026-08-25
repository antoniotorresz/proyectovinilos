import { Outlet } from "react-router";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function MainLayout() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "#0f1117",
        color: "#e8eaf0",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <Header />

      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}
