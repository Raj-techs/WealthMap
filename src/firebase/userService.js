import { db } from "./config";
import {
  collection,
  getDocs,
  getDoc,        // ✅ This fixes the error
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy
} from "firebase/firestore";


// Fetch all users
export const fetchUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
export const fetchCurrentUserName = async (currentUserId) => {
  const userRef = doc(db, "users", currentUserId);
  const user = await getDoc(userRef);
  const data = user.data();
  return data && data.username ? data.username : "Unknown User";
}; // Update role
export const updateUserRole = async (uid, newRole) => {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { role: newRole });
};
export const updateUserDetails = async (uid, details) => {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, details);
};
// Revoke access (delete account from Firestore only)
export const revokeUserAccess = async (uid) => {
  await deleteDoc(doc(db, "users", uid));
};

// Fetch user activity log
export const fetchUserActivity = async (uid) => {
  try {
    const q = query(
      collection(db, "activityLogs"),
      where("uid", "==", uid),
      orderBy("timestamp", "desc")
    );

    const snapshot = await getDocs(q);
    const logs = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        timestamp: data.timestamp?.toDate().toLocaleString() ?? "Unknown",
      };
    });

    return logs;
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }
};
// Add this function to userService.js
export const getUserById = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return { id: userRef.id, ...userSnap.data() };
  } else {
    return null;
  }
};
