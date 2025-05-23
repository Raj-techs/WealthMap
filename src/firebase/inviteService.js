import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export const sendInvitationEmail = async (email, role) => {
  try {
    if (!email || !role) {
      throw new Error("Email and role are required");
    }

    const response = await fetch("https://wealthmap-backend-czt7.onrender.com/send-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to send invitation");
    }

    const result = await response.json();

    await addDoc(collection(db, "invitations"), {
      email,
      role,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    console.log("Invitation sent and stored successfully:", result);
    return result;
  } catch (error) {
    console.error("Error in sendInvitationEmail:", error.message);
    throw error;
  }
};