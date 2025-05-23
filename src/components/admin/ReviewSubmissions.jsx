import React, { useEffect, useState } from "react";
import {
  approveProperty,
  deletePendingProperty,
  fetchPendingProperties,
} from "../../firebase/propertyService";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { logActivity } from "../../firebase/logActivity";

import { getUserById } from "../../firebase/userService";
import { Timestamp } from "firebase/firestore";


const ReviewSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [approvedMsg, setApprovedMsg] = useState("");


  useEffect(() => {
    fetchPendingProperties()
      .then(async (subs) => {
        setSubmissions(subs);
        // Fetch usernames for all userIds
        const ids = subs.map((s) => s.submittedBy).filter(Boolean);
        const uniqueIds = [...new Set(ids)];
        const names = {};
        await Promise.all(
          uniqueIds.map(async (id) => {
            try {
              const user = await getUserById(id);
              names[id] = user?.username || "guest";
            } catch {
              names[id] = "guest";
            }
          })
        );
        setUsernames(names);
      })
      .catch(console.error);
  }, []);

 const handleApprove = async (submission) => {
  const approvedData = {
    title: submission.title || "",
    address: submission.address || "",
    price: Number(submission.price) || 0,
    size: Number(submission.size) || 0,
    type: submission.type || "",
    city: submission.city || "",
    imageUrl: submission.imageUrl || "",
    owner: submission.owner || "",
    ownerNetWorth: Number(submission.ownernetworth) || 0,
    lat: submission.coordinates?.lat || 0,
    lng: submission.coordinates?.lng || 0,
    approved: true,
    createdAt: Timestamp.now(),
  };

  try {
    await approveProperty(approvedData);
    setSubmissions((prev) => prev.filter((s) => s.id !== submission.id));
    setApprovedMsg("Property approved successfully!");
    setTimeout(() => setApprovedMsg(""), 3000);
    await logActivity({
      userId: "admin",
      role: "admin",
      action: "Approved property ID: " + submission.id,
      actionType: "approved",
    });
  } catch (err) {
    console.error("Approval failed:", err);
    setApprovedMsg("Failed to approve property.");
    setTimeout(() => setApprovedMsg(""), 3000);
  }
};


  const handleReject = async (id) => {
    await deletePendingProperty(id);
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-white relative">
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-64">
       
      </div>
      {/* Sidebar for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-white shadow-lg rounded-full p-2 focus:outline-none"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <svg className="w-6 h-6 text-indigo-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white shadow-xl">
            <div className="flex justify-end p-2">
              <button
                className="text-gray-500 hover:text-indigo-700"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <AdminSidebar />
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-2 sm:p-4 md:p-8 transition-all duration-300">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-indigo-800 text-center drop-shadow-sm">
          Review Property Submissions
        </h2>
        {submissions.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg">No pending submissions.</p>
          </div>
        )}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {submissions.map((item) => (
            <div
  key={item.id}
  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-gray-100 flex flex-col overflow-hidden relative group hover:ring-2 hover:ring-indigo-300"
>
  {/* Ribbon for price - Smaller on mobile */}
  <div className="absolute top-0 right-0 bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-bl-2xl font-bold shadow-md z-10 text-xs sm:text-sm flex items-center gap-1"
    style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.25)" }}>
    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 10v4m8-8h-4m-4 0H4" />
    </svg>
    ${item.price}
  </div>

  {/* Card Content */}
  <div className="p-3 sm:p-4 flex-1 flex flex-col">
    {/* Title + ID (Stacked on mobile) */}
    <div className="mb-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
      <span className="font-semibold text-base sm:text-lg text-indigo-700 truncate" style={{ textShadow: "1px 1px 4px #e0e7ff" }}>
        {item.title}
      </span>
      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded self-start sm:self-center">
        #{item.id.slice(-4)}
      </span>
    </div>

    {/* Address (Icon + Text) */}
    <div className="mb-2 text-gray-600 text-xs sm:text-sm flex items-center gap-1">
      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1011.314-11.314l-4.243 4.243z" />
      </svg>
      <span className="truncate">{item.address}</span>
    </div>

    {/* Submitted By (Hidden on smallest screens) */}
    <div className="mb-2 text-xs text-gray-500 flex items-center gap-1">
      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.847.607 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span className="hidden xs:inline">Submitted by: </span>
      <span className="font-medium text-indigo-600">{usernames[item.submittedBy] || "guest"}</span>
    </div>

    {/* Map Container (Fixed Aspect Ratio) */}
    <div className="mb-3 rounded-xl overflow-hidden border border-indigo-100 shadow-sm aspect-video"> {/* aspect-video for 16:9 ratio */}
      {item.coordinates?.lat && item.coordinates?.lng ? (
        <MapContainer
          center={[item.coordinates.lat, item.coordinates.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false} // Disable on mobile
          dragging={!navigator.userAgent.match(/Mobile/)} // Disable drag on mobile
          doubleClickZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[item.coordinates.lat, item.coordinates.lng]}>
            <Popup className="text-xs"> {/* Smaller popup text */}
              <div>
                <div><strong>City:</strong> {item.city}</div>
                <div><strong>Net Worth:</strong> {item.ownernetworth}</div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-red-500 text-xs sm:text-sm">
          No coordinates available
        </div>
      )}
    </div>

    {/* Buttons (Stack on mobile) */}
    <div className="flex flex-col sm:flex-row justify-between mt-auto gap-2">
      <button
        onClick={() => handleApprove(item)}
        className="flex-1 bg-gradient-to-r from-green-500 to-green-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold shadow hover:from-green-600 hover:to-green-800 transition flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Approve
      </button>
      <button
        onClick={() => handleReject(item.id)}
        className="flex-1 bg-gradient-to-r from-red-500 to-red-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold shadow hover:from-red-600 hover:to-red-800 transition flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Reject
      </button>
    </div>
  </div>

  {/* Subtle hover effect (Desktop only) */}
  <div className="hidden sm:block absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-10 transition pointer-events-none" />
</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmissions;