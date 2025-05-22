import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { geocodeOCA } from "../../services/geocoding";
import { logUserActivity } from "../../firebase/activityLogger";
 // Make sure this path is correct

const INIT = {
  title: "",
  address: "",
  price: "",
  size: "",
  owner: "",
  ownerNetWorth: "",
  approved: false,
  type: "residential",
};

const AddProperty = () => {
  const [form, setForm] = useState(INIT);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const { lat, lng, city } = await geocodeOCA(form.address);
      const query = `${city || "house"},${form.type}`;
      const imageUrl = `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}`;

      const docRef = await addDoc(collection(db, "properties"), {
        ...form,
        price: Number(form.price),
        size: Number(form.size),
        ownerNetWorth: Number(form.ownerNetWorth),
        lat,
        lng,
        imageUrl,
        createdAt: serverTimestamp(),
      });
      const auth = getAuth();
      if (auth.currentUser)
        await logUserActivity(
          auth.currentUser.uid,
          "Added Property",
          `Property ID: ${docRef.id}`
        );
      setMsg("✅ Property added!");
      setForm(INIT);
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to add property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
       {/* Sidebar for desktop */}
      
       
      
      {/* Sidebar toggle for mobile */}
      <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 focus:outline-none"
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-lg text-blue-700">Admin Panel</span>
      </div>
      {/* Sidebar drawer for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white border-r shadow-lg">
            
          </div>
          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}
      {/* Main content */}
      <main className="flex-1 p-2 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white p-4 md:p-10 rounded-2xl shadow-lg mt-4 md:mt-10">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-gray-800">Add New Property</h2>
          <p className="mb-6 text-gray-500">Fill in the details below to add a property to the database.</p>
          {msg && (
            <div
              className={`mb-4 px-4 py-2 rounded ${
                msg.startsWith("✅")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Property Title"
                className={input}
                required
              />
            </div>
            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123 Main St, City, ST"
                className={input}
                required
              />
            </div>
            {/* Price & Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Price (USD)"
                  className={input}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size (sq ft) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  placeholder="Size (sq ft)"
                  className={input}
                  required
                />
              </div>
            </div>
            {/* Owner & Net Worth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Name
                </label>
                <input
                  name="owner"
                  value={form.owner}
                  onChange={handleChange}
                  placeholder="Owner Name"
                  className={input}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Net-Worth
                </label>
                <input
                  type="number"
                  name="ownerNetWorth"
                  value={form.ownerNetWorth}
                  onChange={handleChange}
                  placeholder="Owner Net-Worth"
                  className={input}
                />
              </div>
            </div>
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={input}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="rawland">Raw Land</option>
              </select>
            </div>
            {/* Approved toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="approved"
                checked={form.approved}
                onChange={handleChange}
                id="approved"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="approved" className="text-sm text-gray-700">
                Approved
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-800 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Saving…" : "Submit Property"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddProperty;

const input =
  "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800 bg-gray-50";
