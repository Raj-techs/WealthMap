import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export const logActivity = async ({ userId, role, action, actionType = "default" }) => {
  const expireAt = new Date(Date.now() + 5 * 60 * 1000); // auto-delete after 5 minutes
  try {
    await addDoc(collection(db, "activity_logs"), {
      userId,
      role,
      action,
      actionType,
      timestamp: serverTimestamp(),
      expireAt,
    });
  } catch (err) {
    console.error("Activity logging failed", err);
  }
};
