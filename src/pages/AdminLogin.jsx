import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      navigate("/admin/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text flex items-center justify-center px-6">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-surface border border-border rounded-xl p-8"
      >
        <h1 className="font-display text-2xl font-semibold mb-1">Admin Login</h1>
        <p className="text-textMuted text-sm mb-6">Sign in to manage your portfolio</p>

        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-md px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <label className="text-xs text-textMuted mono">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 mb-4 bg-surfaceAlt border border-border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
        />

        <label className="text-xs text-textMuted mono">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 mb-6 bg-surfaceAlt border border-border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-md bg-primary text-white font-medium hover:bg-primaryAlt transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-sm text-textMuted text-center mt-5">
          Don't have an account?{" "}
          <Link to="/admin/register" className="text-accent hover:underline">
            Create one
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
