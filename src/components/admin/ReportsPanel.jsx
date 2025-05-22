import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line
} from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { logActivity } from "../../firebase/logActivity";

const COLORS = ["#4CAF50", "#2196F3", "#FFC107", "#F44336"];

const ReportsPanel = () => {
  const [userStats, setUserStats] = useState({ total: 0, roles: {} });
  const [propertyStats, setPropertyStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [invitesSent, setInvitesSent] = useState(0);
  const [userActivity, setUserActivity] = useState([]);
  const [filter, setFilter] = useState("30");

  useEffect(() => {
    const fetchData = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const roles = {};
      usersSnap.forEach(doc => {
        const role = doc.data().role || "user";
        roles[role] = (roles[role] || 0) + 1;
      });
      setUserStats({ total: usersSnap.size, roles });

      const propsSnap = await getDocs(collection(db, "properties"));
      let approved = 0, pending = 0, rejected = 0;
      propsSnap.forEach(doc => {
        const status = doc.data().status;
        if (status === "approved") approved++;
        else if (status === "pending") pending++;
        else if (status === "rejected") rejected++;
      });
      setPropertyStats({ total: propsSnap.size, approved, pending, rejected });

      const invitesSnap = await getDocs(collection(db, "invitations"));
      setInvitesSent(invitesSnap.size);

      const activitySnap = await getDocs(collection(db, "activity_logs"));
      const filtered = activitySnap.docs
        .map(doc => doc.data())
        .filter(log => {
          const daysAgo = Timestamp.now().seconds - log.timestamp.seconds;
          return daysAgo <= parseInt(filter) * 24 * 3600;
        });
      setUserActivity(filtered);
    };

    fetchData();
  }, [filter]);

  const roleData = Object.entries(userStats.roles).map(([role, count]) => ({ name: role, value: count }));
  const propertyData = [
    { name: "Approved", count: propertyStats.approved },
    { name: "Pending", count: propertyStats.pending },
    { name: "Rejected", count: propertyStats.rejected }
  ];

  const activityChart = userActivity.reduce((acc, item) => {
    const date = new Date(item.timestamp.seconds * 1000).toLocaleDateString();
    const existing = acc.find(i => i.date === date);
    if (existing) existing.count++;
    else acc.push({ date, count: 1 });
    return acc;
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("WealthMap Analytics Report", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [["Metric", "Value"]],
      body: [
        ["Total Users", userStats.total],
        ["Total Properties", propertyStats.total],
        ["Invitations Sent", invitesSent],
        ...Object.entries(userStats.roles).map(([k, v]) => [`Users (${k})`, v]),
      ],
    });
    doc.save("wealthmap-report.pdf");
    logActivity({
      userId: admin.uid, // Replace with actual admin ID
      role: "admin",
      action: "Generated PDF report",
      actionType: "report_generated"
    });
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <button onClick={exportPDF} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Download PDF
        </button>
      </div>

      <div className="mb-4">
        <label className="mr-2 font-medium">Show Activity (Last):</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border px-2 py-1 rounded">
          <option value="7">7 Days</option>
          <option value="30">30 Days</option>
          <option value="90">90 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">User Role Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={roleData} cx="50%" cy="50%" outerRadius={80} label dataKey="value">
                {roleData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Property Status Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={propertyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-50 mt-6 p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">User Activity Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={activityChart}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportsPanel;