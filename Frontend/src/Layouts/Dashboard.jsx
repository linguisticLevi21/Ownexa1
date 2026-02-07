import Sidebar from "../Components/Dashboard/Sidebar";
import { Outlet } from "react-router-dom";
import "../Styles/Layouts/Dashboard.css";

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}