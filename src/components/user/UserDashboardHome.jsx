import { useEffect, useState } from "react";
import { FaBookmark, FaFileDownload, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RecentActivity from "../../common/RecentActivity";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const UserDashboardHome = () => {
  const [bookmarkedCount, setBookmarkedCount] = useState(0);
  const [exploredCount, setExploredCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0); // Placeholder, update as needed
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      // Bookmarked Properties
      const bookmarksRef = collection(db, "bookmarks");
      const bookmarksQuery = query(bookmarksRef, where("userId", "==", user.uid));
      const bookmarksSnap = await getDocs(bookmarksQuery);
      setBookmarkedCount(bookmarksSnap.size);

      // Properties Explored
      const exploredRef = collection(db, "Properties");
      const exploredQuery = query(exploredRef, where("exploredBy", "==", user.uid));
      const exploredSnap = await getDocs(exploredQuery);
      setExploredCount(exploredSnap.size);

      // Reports Downloaded (update this logic as per your Firestore structure)
      const reportsRef = collection(db, "reportsDownloaded");
      const reportsQuery = query(reportsRef, where("userId", "==", user.uid));
      const reportsSnap = await getDocs(reportsQuery);
      setReportsCount(reportsSnap.size);
    };

    fetchCounts();
  }, []);

  const cards = [
    {
      title: "Bookmarked Properties",
      count: bookmarkedCount,
      icon: <FaBookmark className="text-cyan-300 text-4xl drop-shadow-lg" />,
      color: "from-cyan-300 to-cyan-400",
      route: "/user-dashboard/bookmarks",
      highlight: "border-cyan-300 shadow-cyan-100",
    },
    {
      title: "Reports Downloaded",
      count: reportsCount,
      icon: <FaFileDownload className="text-purple-300 text-4xl drop-shadow-lg" />,
      color: "from-purple-300 to-purple-400",
      route: "/user-dashboard/export",
      highlight: "border-purple-300 shadow-purple-100",
    },
    {
      title: "Properties Explored",
      count: exploredCount,
      icon: <FaHome className="text-blue-300 text-4xl drop-shadow-lg" />,
      color: "from-blue-300 to-blue-400",
      route: "/user-dashboard/map",
      highlight: "border-blue-300 shadow-blue-100",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-green-50 py-10">
      <div className="w-full max-w-5xl space-y-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 text-center mb-6">
          👋 Welcome Back, Explorer!
        </h2>
        <p className="text-gray-600 mb-6 text-lg text-center">
          Here’s a quick glance at your property journey. Ready to make your next move?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.route)}
              className={`cursor-pointer transition-shadow hover:shadow-xl bg-gradient-to-br ${card.color} rounded-2xl p-8 flex flex-col items-center group`}
              style={{ border: "none" }}
            >
              <div className="mb-3 group-hover:animate-bounce">{card.icon}</div>
              <h3 className="text-xl font-bold text-white drop-shadow mb-1">{card.title}</h3>
              <p className="text-4xl font-extrabold text-white drop-shadow-lg">{card.count}</p>
              <span className="mt-2 text-sm text-white/80">
                {card.title === "Properties Explored"
                  ? `You've explored ${card.count} properties!`
                  : card.title === "Bookmarked Properties"
                  ? `Saved for later`
                  : `Keep track of your downloads`}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-10 bg-white rounded-2xl shadow p-8 border border-gray-100">
          <h2 className="text-2xl md:text-2xl mb-4">
            <span className="font-bold text-gray-800"> RECENT </span>
            <span className="font-thin text-gray-800">Activity</span>
          </h2>
          <RecentActivity role="user" />
        </div>
      </div>
    </div>
  );

};
export default UserDashboardHome;