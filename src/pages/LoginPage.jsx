import React, { useState } from "react"; // React is required for JSX
import { useNavigate, useParams } from "react-router-dom";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { registerUser, loginUser } from "../firebase/authService";
import { logUserActivity } from "../firebase/activityLogger";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
  const { role } = useParams(); // admin or user

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (isLogin) {
      const { user, role: userRole } = await loginUser(email, password);
      await logUserActivity(user.uid, "Logged in");

      if (userRole === "admin") navigate("/admin-dashboard");
      else navigate("/user-dashboard");
    } else {
      // Register first
      const user = await registerUser(email, password, role, username);
      await logUserActivity(user.uid, "Signed up");

      alert(`${role === "admin" ? "Admin" : "User"} account created. You can now log in.`);
      setIsLogin(true); // switch to login form
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
};

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-white flex items-center justify-center p-6">
  {/* Combined Header and Form Card */}
  <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transition-all duration-500">
    {/* Header Section */}
    <div className="flex items-center justify-between py-4 px-6 border-b">
      <span className="inline-block border border-blue-900 rounded p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="32" width="32" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 9.5L12 4l9 5.5v9A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5v-9Z" />
              <path d="M9 21V12h6v9" />
            </svg>
          </span>
      <h1 className="text-xl font-bold text-blue-700">WealthMap</h1>
    </div>

    {/* Portal Title */}
    <h2 className="text-center text-xl font-bold text-gray-700 pt-4">
      {role === "admin" ? "Admin Portal" : "User Portal"}
    </h2>

    {/* Toggle Buttons */}
    <div className="flex justify-around py-6 bg-blue-100">
      <button
        onClick={() => setIsLogin(false)}
        className={`flex items-center gap-2 text-lg font-bold transition ${
          !isLogin ? "text-blue-700" : "text-gray-400"
        }`}
      >
        <FaUserPlus />
        Sign up
      </button>
      <button
        onClick={() => setIsLogin(true)}
        className={`flex items-center gap-2 text-lg font-bold transition ${
          isLogin ? "text-blue-700" : "text-gray-400"
        }`}
      >
        <FaSignInAlt />
        Login
      </button>
    </div>

    {/* Form Section */}
    <form onSubmit={handleSubmit} className="px-10 py-8 space-y-6">
      {!isLogin && (
        <input
          type="text"
          placeholder="User name"
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      )}
      <input
        type="email"
        placeholder="Email"
        className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-700 text-white py-4 rounded-lg font-semibold hover:bg-blue-800 transition"
      >
        {isLogin ? "Login" : "Sign up"}
      </button>
    </form>
  </div>
</div>

  );
};

export default AuthPage;