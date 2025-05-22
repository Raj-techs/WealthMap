import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { getAuth } from "firebase/auth";
import { Clock, Star, MapPin } from "lucide-react";

// Fun, less formal activity names
const funActivityNames = {
  bookmarked: "Saved a cool spot!",
  added: "Dropped a new pin!",
  default: "Did something awesome!"
};

const icons = {
  bookmarked: <Star className="w-5 h-5 text-yellow-500 inline mr-2" />,
  added: <MapPin className="w-5 h-5 text-green-500 inline mr-2" />,
  default: <Clock className="w-5 h-5 text-blue-400 inline mr-2" />
};

// Dummy activities for first-time/empty state
const dummyActivities = [
  {
    actionType: "added",
    action: "Dropped your first pin!",
    timestamp: { toDate: () => new Date(Date.now() - 1000 * 60 * 60) }
  },
  {
    actionType: "bookmarked",
    action: "Saved a place to check out later!",
    timestamp: { toDate: () => new Date(Date.now() - 1000 * 60 * 30) }
  },
  {
    actionType: "default",
    action: "Explored the map like a pro!",
    timestamp: { toDate: () => new Date(Date.now() - 1000 * 60 * 10) }
  }
];

const RecentActivity = ({ role }) => {
  const [logs, setLogs] = useState([]);
  const [hasRealLogs, setHasRealLogs] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchLogs = async () => {
      const q = query(
        collection(db, "activity_logs"),
        where("role", "==", role),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => doc.data());
      if (list.length) {
        setLogs(list);
        setHasRealLogs(true);
      } else {
        setLogs(dummyActivities);
        setHasRealLogs(false);
      }
    };

    fetchLogs();
  }, [user, role]);

  if (!user) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-2xl shadow-lg p-6 mt-6 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold mb-5 text-purple-700 flex items-center gap-2">
        <Clock className="w-6 h-6 text-purple-400" />
        Your Fun Recent Moves
      </h3>
      <ul className="grid gap-4 sm:grid-cols-2">
        {logs.map((log, i) => (
          <li
            key={i}
            className="group bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 transition-all duration-200 border border-transparent hover:border-purple-400 hover:shadow-xl hover:scale-[1.03] cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {icons[log.actionType] || icons.default}
              <span className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                {funActivityNames[log.actionType] || funActivityNames.default}
              </span>
            </div>
            <div className="text-gray-600 text-sm">{log.action}</div>
            <div className="mt-2 text-right text-xs text-gray-400">
              {new Date(log.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </li>
        ))}
      </ul>
      {!hasRealLogs && (
        <div className="mt-6 text-center text-purple-500 text-sm">
          Start exploring to see your own awesome activity here!
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
