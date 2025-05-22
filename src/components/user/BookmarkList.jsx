import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { logActivity } from "../../firebase/logActivity";

const BookmarkList = () => {
  const [user, setUser] = useState(undefined);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userRef = doc(db, "users", u.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) setUserInfo(snap.data());
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user || user === undefined) return;

    (async () => {
      setIsLoading(true);
      console.log("Start fetching bookmarks for:", user.uid);

const q = query(collection(db, "bookmarks"), where("userId", "==", user.uid));
const snap = await getDocs(q);

console.log("Total bookmarks fetched:", snap.size);

const rows = [];
for (const bDoc of snap.docs) {
  const data = bDoc.data();
  console.log("Processing bookmark:", bDoc.id, data);

  const propertyId = data.propertyId;
  if (!propertyId) {
    console.warn("Missing propertyId in bookmark:", bDoc.id);
    continue;
  }

  const propRef = doc(db, "properties", propertyId);
  const propSnap = await getDoc(propRef);

  if (!propSnap.exists()) {
    console.warn("Property not found for bookmark:", bDoc.id, "->", propertyId);
    continue;
  }
          const p = propSnap.data();
          rows.push({
            bookmarkId: bDoc.id,
            propertyId,
            address: p.address,
            city: p.city ?? "",
            price: p.price,
            size: p.size,
            owner: p.owner,
            ownerNetWorth: p.ownerNetWorth,
            imageUrl: p.imageUrl,
            lat: p.lat,
            lng: p.lng,
          });
        }
      setItems(rows);
      setIsLoading(false);
    })();
  }, [user]);

  const handleRemove = async (bookmarkId) => {
    try {
      await deleteDoc(doc(db, "bookmarks", bookmarkId));
      setItems((prev) => prev.filter((i) => i.bookmarkId !== bookmarkId));
    } catch (err) {
      console.error("Remove bookmark error:", err);
    }
    await logActivity({
      userId: user.uid,
      role: "user",
      action: `Removed bookmark for property ${bookmarkId}`,
      actionType: "removed_bookmark",
    });
  };

  if (user === undefined) return <p className="mt-10 text-center">Loading…</p>;
  if (!user) return <p className="text-center mt-10">Please log in.</p>;
  if (isLoading) return  (<div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
        <div className="text-lg text-gray-700">Loading your BookMarks...</div>
      </div>);
  if (items.length === 0)
    return (
      <div className="flex flex-col items-center mt-16">
        <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8h24v32l-12-8-12 8V8z" />
        </svg>
        <p className="text-xl text-gray-500 font-semibold">No bookmarks yet.<br />Start exploring and add your favorite properties!</p>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">⭐ Bookmarked Properties</h2>
      {userInfo && (
        <p className="text-sm text-gray-500 mb-6 text-center">
          Logged in as: <span className="font-semibold">{userInfo.name || user.email}</span>
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const hasImage = item.imageUrl && item.imageUrl.length > 10;
          const imageUrl = hasImage
            ? item.imageUrl
            : "";

          return (
            <div
              key={item.bookmarkId}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-200 overflow-hidden flex flex-col group border border-gray-100"
            >
              {hasImage && (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="property"
                    className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <span className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 text-xs rounded shadow font-bold">Bookmarked</span>
                </div>
              )}

              <div className="flex-1 flex flex-col p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">{item.address}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="inline-block mr-2">💰 <span className="font-semibold">${item.price.toLocaleString()}</span></span>
                  <span className="inline-block">📐 {item.size} sq ft</span>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  🏠 Owner: <span className="font-semibold">{item.owner}</span> • 🧾 Net Worth: <span className="font-semibold">${item.ownerNetWorth}</span>
                </p>
                <div className="flex-1"></div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/user-dashboard/map?lat=${item.lat}&lng=${item.lng}`)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-3 py-2 text-sm rounded-lg font-semibold shadow transition"
                  >
                    View on Map
                  </button>
                  <button
                    onClick={() => handleRemove(item.bookmarkId)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-3 py-2 text-sm rounded-lg font-semibold shadow transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookmarkList;