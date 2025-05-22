import React, { useEffect, useState } from "react";
import { fetchUsers, updateUserRole, revokeUserAccess, fetchUserActivity, fetchCurrentUserName } from "../../firebase/userService";
import InviteUser from "../admin/InviteUser"; 
import { getAuth } from "firebase/auth";
import { logUserActivity } from "../../firebase/activityLogger"; // Ensure this path is correct
// Import AdminSidebar if needed

import "firebase/auth"; // Import Firebase Auth

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [activityLog, setActivityLog] = useState(null);
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
  const [currentUserName, setCurrentUserName] = useState("");

  useEffect(() => {
    fetchUsers().then(setUsers).catch(console.error);
    const fetchCurrentUser = async () => {
      try {
        const auth = getAuth();
const user = auth.currentUser;
 // Ensure Firebase Auth is initialized
        if (user) {
          const currentUserId = user.uid;
          const name = await fetchCurrentUserName(currentUserId);
          setCurrentUserName(name);
        } else {
          console.error("No user is currently logged in.");
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleRoleChange = async (uid, newRole) => {
    await updateUserRole(uid, newRole);
    setUsers((prev) => prev.map(user => user.id === uid ? { ...user, role: newRole } : user));
  };

  const handleRevoke = async (uid) => {
    await revokeUserAccess(uid);
    setUsers((prev) => prev.filter(user => user.id !== uid));
  };

  const handleActivityLog = async (uid) => {
    try {
      const activity = await fetchUserActivity(uid);
      setActivityLog(activity);
      setIsActivityLogOpen(true);
    } catch (error) {
      console.error("Failed to fetch activity log:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md relative">
      
      <div className="flex justify-between items-center mb-6">
        
        <h2 className="text-2xl font-bold text-gray-800">
          Manage Employees {currentUserName && `- Welcome, ${currentUserName}`}
        </h2>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Invite Employee
        </button>
      </div>
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Role</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-3 border">{user.username || user.name || "—"}</td>
              <td className="p-3 border">{user.email}</td>
              <td className="p-3 border capitalize">{user.role}</td>
              <td className="p-3 border space-x-2">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="px-2 py-1 border rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={() => handleRevoke(user.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Revoke
                </button>
                <button
                  onClick={() => handleActivityLog(user.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Activity Log
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isInviteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg relative">
            <button
              onClick={() => setIsInviteOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              ✖
            </button>
            <InviteUser />
          </div>
        </div>
      )}

      {isActivityLogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg relative w-96">
            <button
              onClick={() => setIsActivityLogOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-4">Activity Log</h3>
            {activityLog && activityLog.length > 0 ? (
  <ul className="space-y-2">
    {activityLog.map((log, index) => (
      <li key={index} className="text-gray-700 border-b pb-2">
        <p><strong>🕒 Timestamp:</strong> {log.timestamp}</p>
        <p><strong>⚙️ Action:</strong> {log.action}</p>
        {log.details && <p><strong>📌 Details:</strong> {log.details}</p>}
      </li>
    ))}
  </ul>
) : (
  <p className="text-gray-500">No activity found.</p>
)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;