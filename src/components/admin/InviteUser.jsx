import React, { useState } from "react";
import { sendInvitationEmail } from "../../firebase/inviteService";
import { logActivity } from "../../firebase/logActivity";

const InviteUser = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [status, setStatus] = useState("");

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await sendInvitationEmail(email, role);
      setStatus("✅ Invitation email sent successfully.");
      setEmail("");
    } catch (error) {
      console.error("Invitation error:", error);
      setStatus("❌ Failed to send invitation.");
    }
    await logActivity({
      userId: admin.uid, // Replace with actual admin ID
      role: "admin",
      action: `Invited ${email} as ${role}`,
      actionType: "invited",
    });
  };

  return (
    <div className="max-w-md bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Invite Employee</h2>
      <form onSubmit={handleInvite} className="space-y-4">
        <input
          type="email"
          placeholder="Employee Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select
          className="w-full border p-2 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Send Invite
        </button>
        {status && <p className="text-sm mt-2">{status}</p>}
      </form>
    </div>
  );
};

export default InviteUser;
