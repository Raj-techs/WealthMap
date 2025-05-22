import React, { useState } from "react";

// Dummy notifications data
const dummyNotifications = [
  {
    id: 1,
    type: "property",
    title: "New Property Added",
    message: "A new property has been listed in your area.",
    time: "2 mins ago",
    seen: false,
  },
  {
    id: 2,
    type: "bookmark",
    title: "Property Bookmarked",
    message: "You bookmarked 'Sunset Villa'.",
    time: "10 mins ago",
    seen: true,
  },
  {
    id: 3,
    type: "update",
    title: "Feature Update",
    message: "Check out our new mortgage calculator!",
    time: "1 hour ago",
    seen: true,
  },
];

const typeIcons = {
  property: "🏠",
  bookmark: "🔖",
  update: "✨",
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(dummyNotifications);

  const markAsSeen = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, seen: true } : n))
    );
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        🔔 Notifications
      </h2>
      <div className="flex flex-col gap-4">
        {notifications.length === 0 && (
          <div className="text-center text-gray-500 py-8">No notifications yet.</div>
        )}
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 rounded-lg shadow transition
              ${n.seen ? "bg-gray-50" : "bg-blue-50 border-l-4 border-blue-400"}
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{typeIcons[n.type] || "🔔"}</span>
              <div>
                <div className="font-semibold text-gray-800">{n.title}</div>
                <div className="text-gray-600 text-sm">{n.message}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              <span className="text-xs text-gray-400">{n.time}</span>
              {!n.seen && (
                <button
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
                  onClick={() => markAsSeen(n.id)}
                >
                  Mark as seen
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;