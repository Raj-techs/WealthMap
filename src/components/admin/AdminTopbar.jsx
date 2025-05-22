import React, { useEffect, useState, useRef } from "react";
import { getAuth, signOut, onAuthStateChanged, updateEmail } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const UserTopbar = () => {
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAvatar, setEditAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserName(data.username || "User");
          setUserEmail(data.email || user.email || "");
          setAvatarUrl(data.avatarUrl || "");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const handleUserIconClick = () => {
    setEditName(userName);
    setEditEmail(userEmail);
    setEditAvatar(null);
    setShowModal(true);
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setEditAvatar(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getFirestore();
    const storage = getStorage();
    let newAvatarUrl = avatarUrl;

    try {
      // Upload avatar if changed
      if (editAvatar) {
        const avatarRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(avatarRef, editAvatar);
        newAvatarUrl = await getDownloadURL(avatarRef);
      }

      // Update Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        username: editName,
        email: editEmail,
        avatarUrl: newAvatarUrl,
      });

      // Update Auth email if changed
      if (editEmail !== user.email) {
        await updateEmail(user, editEmail);
      }

      setUserName(editName);
      setUserEmail(editEmail);
      setAvatarUrl(newAvatarUrl);
      setShowModal(false);
    } catch (err) {
      alert("Error updating profile: " + err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <header className="fixed top-0 left-60 right-0 h-24 bg-white border-b shadow-md z-50 flex items-center justify-between px-6">
        
        <h1 className="text-3xl font-extrabold text-gray-800 font-sans flex items-baseline items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-14 h-14 rounded-full border-2 border-blue-400 shadow"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold border-2 border-blue-200 shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path stroke="currentColor" strokeWidth="2" d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none"/>
              </svg>
            </span>
          )}
          Welcome,&nbsp;
          <span className="text-blue-600 flex items-baseline">
            <span className="text-5xl font-extrabold">
              {userName.charAt(0)}
            </span>
            <span className="text-3xl font-thin">
              {userName.slice(1)}
            </span>
            !
          </span>
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleUserIconClick}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-200 to-blue-300 hover:from-blue-300 hover:to-blue-400 text-blue-900 px-3 py-1.5 rounded-full shadow text-sm font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-200"
            title="Edit Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path stroke="currentColor" strokeWidth="2" d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none"/>
            </svg>
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-200 to-red-300 hover:from-red-300 hover:to-red-400 text-red-900 px-3 py-1.5 rounded-full shadow text-sm font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Edit Profile</h2>
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {editAvatar ? (
                  <img
                    src={URL.createObjectURL(editAvatar)}
                    alt="avatar"
                    className="w-20 h-20 rounded-full border-2 border-blue-400 shadow"
                  />
                ) : avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-20 h-20 rounded-full border-2 border-blue-400 shadow"
                  />
                ) : (
                  <span className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold border-2 border-blue-200 shadow">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path stroke="currentColor" strokeWidth="2" d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none"/>
                    </svg>
                  </span>
                )}
                <button
                  className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 shadow hover:bg-blue-600 transition"
                  onClick={() => fileInputRef.current.click()}
                  title="Change Avatar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
              </div>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 mt-2 focus:ring-2 focus:ring-blue-200"
                placeholder="Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <input
                type="email"
                className="w-full border rounded px-3 py-2 mt-2 focus:ring-2 focus:ring-blue-200"
                placeholder="Email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
              <button
                onClick={handleSave}
                disabled={loading}
                className="mt-4 w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 rounded-full font-bold shadow hover:from-blue-500 hover:to-blue-700 transition-all duration-200"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95);}
          to { opacity: 1; transform: scale(1);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
    </>
  );
};

export default UserTopbar;
