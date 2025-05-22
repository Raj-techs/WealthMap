import React from "react";
import AdminLayout from "../components/admin/AdminLayout";
import DashboardHome from "../components/admin/DashboardHome";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <DashboardHome />
    </AdminLayout>
  );
};

export default AdminDashboard;