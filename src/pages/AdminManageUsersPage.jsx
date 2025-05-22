// src/pages/AdminManageUsersPage.jsx
import React from "react";
import AdminLayout from "../components/admin/AdminLayout";
import ManageUsers from "../components/admin/ManageUsers";

const AdminManageUsersPage = () => {
  return (
    <AdminLayout>
      <ManageUsers />
    </AdminLayout>
  );
};

export default AdminManageUsersPage;
