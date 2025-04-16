import React, { useState } from "react";
import '../styles/shared.css';

const Login = ({ setPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email === "staff@hospital.com" && password === "admin123") {
      alert("User logged in successfully!");
      setPage("patientForm");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="gradient-background flex items-center justify-center p-6">
      <div className="glass-card w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <img src="/hospital-logo.png" alt="Hospital Logo" className="h-20 w-auto" />
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-8 text-gradient">
          Hospital Staff Login
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium
                     hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     transform transition hover:scale-105"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
