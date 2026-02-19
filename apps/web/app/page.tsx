"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_HTTP_API ?? "http://localhost:3001";

export default function HomePage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sign in failed");
      if (typeof window !== "undefined" && data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/rooms";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name: name || username }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Sign up failed");
      const signInRes = await fetch(`${API}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const signInData = await signInRes.json();
      if (signInRes.ok && signInData.token && typeof window !== "undefined") {
        localStorage.setItem("token", signInData.token);
        window.location.href = "/rooms";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Excalidraw</h1>
      <p className="page-subtitle">
        Sign in or create an account to start drawing with pattern detection.
      </p>
      <div className="card">
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
          <button
            type="button"
            className={tab === "signin" ? "primary" : ""}
            onClick={() => { setTab("signin"); setError(""); }}
          >
            Sign in
          </button>
          <button
            type="button"
            className={tab === "signup" ? "primary" : ""}
            onClick={() => { setTab("signup"); setError(""); }}
          >
            Sign up
          </button>
        </div>
        {error && (
          <p style={{ color: "var(--error)", marginBottom: "1rem", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}
        {tab === "signin" ? (
          <form onSubmit={handleSignIn}>
            <div className="form-group">
              <label>Username (email)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="primary" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <label>Username (email)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="form-group">
              <label>Display name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <button type="submit" className="primary" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Creating account…" : "Sign up"}
            </button>
          </form>
        )}
      </div>
      <p style={{ textAlign: "center", marginTop: "1rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
        <a href="/rooms">Go to rooms</a> (join with room ID)
      </p>
    </div>
  );
}
