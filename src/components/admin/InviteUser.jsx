import React, { useState } from 'react';
import { sendInvitationEmail } from '../../firebase/inviteService';

const InviteUser = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInvite = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await sendInvitationEmail(email, role);
      setSuccess('Invitation sent successfully!');
      setEmail(''); // Clear form
      setRole('user');
    } catch (error) {
      console.error('Invitation error:', error);
      setError(error.message || 'Failed to send invitation');
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h3 className="text-xl font-bold mb-4">Invite Employee</h3>
      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleInvite}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send Invite
          </button>
        </div>
      </form>
    </div>
  );
};

export default InviteUser;