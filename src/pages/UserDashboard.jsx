import React from "react";
import UserLayout from "../components/user/UserLayout";
import UserDashboardHome from "../components/user/UserDashboardHome";

const UserDashboard = () => {
  return (
    <UserLayout>
      <UserDashboardHome />
    </UserLayout>
  );
};

export default UserDashboard;
