import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

// Simulated invitation: store invite in Firestore
export const sendInvitationEmail = async (email, role) => {
  const response = await fetch("http://localhost:5000/send-invite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, role }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to send invitation");
  }

  return await response.json();
};

