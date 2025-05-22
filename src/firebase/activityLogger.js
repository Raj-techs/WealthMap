import { db } from "./config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Logs a user action to Firestore.
 *
 * @param {string} uid - The user ID.
 * @param {string} action - What the user did (e.g., "Login", "Add Property")
 * @param {string} [details] - Optional message (e.g., "Property ID: abc123")
 */
export const logUserActivity = async (uid, action, details = "") => {
  try {
    await addDoc(collection(db, "activityLogs"), {
      uid,
      action,
      details,
      timestamp: serverTimestamp(),
    });
    console.log("✅ Activity logged:", action);
  } catch (error) {
    console.error("❌ Error logging activity:", error);
  }
};
