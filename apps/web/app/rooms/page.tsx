"use client";

import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_HTTP_API ?? "http://localhost:3001";

export default function RoomsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(t);
    setMounted(true);
    if (!t) window.location.replace("/");
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: roomName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create room");
      const roomId = data.roomId ?? data.room?.id;
      if (roomId != null) {
        window.location.href = `/draw?room=${roomId}&token=${encodeURIComponent(token)}`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const id = joinRoomId.trim();
    if (!id) return;
    const t = token ?? localStorage.getItem("token");
    if (t) {
      window.location.href = `/draw?room=${id}&token=${encodeURIComponent(t)}`;
    } else {
      window.location.href = `/draw?room=${id}`;
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.replace("/");
  };

  if (!mounted || token === null) return null;

  return (
    <>
      <nav className="nav">
        <a href="/">Excalidraw</a>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a href={process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3002"} target="_blank" rel="noopener noreferrer">
            Metrics &amp; patterns
          </a>
          <button type="button" onClick={handleSignOut}>Sign out</button>
        </div>
      </nav>
      <div className="container">
        <h1 className="page-title">Rooms</h1>
        <p className="page-subtitle">Create a new drawing room or join one with an ID.</p>
        {error && (
          <p style={{ color: "var(--error)", marginBottom: "1rem", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Create room</h2>
          <form onSubmit={handleCreateRoom}>
            <div className="form-group">
              <label>Room name</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="My whiteboard"
                required
              />
            </div>
            <button type="submit" className="primary" disabled={loading || !token} style={{ width: "100%" }}>
              {loading ? "Creating…" : "Create and open"}
            </button>
          </form>
        </div>
        <div className="card">
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>Join room</h2>
          <form onSubmit={handleJoinRoom}>
            <div className="form-group">
              <label>Room ID</label>
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="e.g. 1"
                required
              />
            </div>
            <button type="submit" className="primary" style={{ width: "100%" }}>
              Join
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
