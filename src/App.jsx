
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage"; // or AuthPage if you're using signup-toggle
import AdminDashboard from "./pages/AdminDashboard";
import AdminManageUsersPage from "./pages/AdminManageUsersPage";
import AdminAddPropertyPage from "./pages/AdminAddPropertyPage";
import AdminReviewSubmissionsPage from "./pages/AdminReviewSubmissionsPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import GuestExplore from "./pages/GuestExplore"; // Assuming this is the guest explore page
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";



// Admin subpages

// User subpages

import UserLayout from "./components/user/UserLayout";
import PropertyMap from "./components/user/PropertyMap";
import BookmarkList from "./components/user/BookmarkList";
import GenerateReport from "./components/user/GenerateReport";
import Boarding from "./components/user/Boarding"
import TermsAndService from "./components/user/TermsAndServices";
import Notifications from "./components/user/Notifications";
import UserDashboardHome from "./components/user/UserDashboardHome";







const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login/:role" element={<LoginPage />} />
      <Route path="/guest-explore" element={<GuestExplore />} />
      <Route path="/about" element={<About />} />
      <Route path="/features" element={<Features />} />
      <Route path="/contact" element={<Contact />} />
      {/* Admin Dashboard & Features */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
     <Route path="/admin-dashboard/add-property" element={<AdminAddPropertyPage />} />
<Route path="/admin-dashboard/review" element={<AdminReviewSubmissionsPage />} />
<Route path="/admin-dashboard/reports" element={<AdminReportsPage />} />
      <Route path="/admin-dashboard/users" element={<AdminManageUsersPage />} />
      

      {/* User Dashboard */}
       <Route path="/user-dashboard" element={<UserLayout />}>
        <Route index element={<UserDashboardHome />} /> {/* default route */}
        <Route path="map" element={<PropertyMap />} />
        <Route path="bookmarks" element={<BookmarkList />} />
        <Route path="export" element={<GenerateReport />} />
        <Route path="onboarding" element={<Boarding/>} />
        <Route path="terms" element={<TermsAndService />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

export default App;
