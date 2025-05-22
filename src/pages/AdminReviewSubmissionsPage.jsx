import React from "react";
import AdminLayout from "../components/admin/AdminLayout";
import ReviewSubmissions from "../components/admin/ReviewSubmissions";

const AdminReviewSubmissionsPage = () => {
  return (
    <AdminLayout>
      <ReviewSubmissions />
    </AdminLayout>
  );
};

export default AdminReviewSubmissionsPage;