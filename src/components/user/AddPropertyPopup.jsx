import React, { useState } from "react";
import { db } from "../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { logActivity } from "../../firebase/logActivity";
import { geocodeOCA } from "../../services/geocoding";
const AddPropertyPopup = ({ onClose }) => {
    const [form, setForm] = useState({
        address: "",
        city: "",
        price: "",
        size: "",
        type: "residential",
        owner: "",
        ownernetworth: "",
    });
    const auth = getAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return alert("Please log in.");

  try {
    const coordinates = await geocodeOCA(form.address); // 🧭 get lat/lng

    await addDoc(collection(db, "pending_properties"), {
      ...form,
      approved: false,
      userId: user.uid,
      createdAt: serverTimestamp(),
      price: parseFloat(form.price),
      size: parseFloat(form.size),
      ownernetworth: parseFloat(form.ownernetworth),
      coordinates, // 🧭 add this field
    });

    alert("✅ Submitted for admin review.");
    onClose();
  } catch (err) {
    console.error(err);
    alert("❌ Failed to submit.");
  }

  await logActivity({
    userId: user.uid,
    role: "user",
    action: `Added property ${form.address}`,
    actionType: "added_property",
  });
};
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/80 via-blue-700/70 to-blue-400/60 z-50 flex items-center justify-center transition-all duration-300">
            <div className="relative bg-white rounded-2xl shadow-2xl border border-blue-100 w-full max-w-2xl mx-4 sm:mx-8 px-8 py-6 flex flex-col items-center animate-fadeIn scale-95 sm:scale-100 transition-all duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold transition"
                    aria-label="Close"
                    type="button"
                >
                    ✖
                </button>
                <div className="flex flex-col items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-3 mb-2 shadow">
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                            <path d="M3 10.5L12 4l9 6.5M5 10.5V19a1 1 0 001 1h3m8-9.5V19a1 1 0 01-1 1h-3m-4 0h4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-blue-800">Add New Property</h2>
                    <p className="text-gray-500 text-sm mt-1">Fill in the details below to submit a property for review.</p>
                </div>
                <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <div className="col-span-1">
                        <label className="block mb-1 font-medium text-gray-700">Address</label>
                        <input
                            name="address"
                            onChange={handleChange}
                            placeholder="Enter address"
                            required
                            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block mb-1 font-medium text-gray-700">City</label>
                        <input
                            name="city"
                            onChange={handleChange}
                            placeholder="Enter city"
                            required
                            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Price</label>
                        <input
                            name="price"
                            onChange={handleChange}
                            type="number"
                            placeholder="Price"
                            required
                            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Size (sq ft)</label>
                        <input
                            name="size"
                            onChange={handleChange}
                            type="number"
                            placeholder="Size"
                            required
                            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Owner</label>
                        <input
                            name="owner"
                            onChange={handleChange}
                            placeholder="Owner name"
                            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Owner Net Worth</label>
                        <input
                            name="ownernetworth"
                            onChange={handleChange}
                            type="number"
                            placeholder="Owner net worth"
                            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                        <label className="block mb-1 font-medium text-gray-700">Type</label>
                        <select
                            name="type"
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <option value="residential">Residential</option>
                            <option value="commercial">Commercial</option>
                            <option value="industrial">Industrial</option>
                            <option value="rawland">Raw Land</option>
                        </select>
                    </div>
                    <div className="col-span-1 sm:col-span-2 flex justify-center mt-2">
                        <button
                            type="submit"
                            className="w-full sm:w-1/2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-2 rounded-lg font-semibold shadow-lg transition-all duration-200"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95);}
                    to { opacity: 1; transform: scale(1);}
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s cubic-bezier(.4,0,.2,1);
                }
            `}</style>
        </div>
    );
};

export default AddPropertyPopup;
