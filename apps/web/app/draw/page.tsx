"use client";

import { useState, useEffect } from "react";
import DrawingBoard from "../../components/DrawingBoard";

function DrawContent() {
  const [roomParam, setRoomParam] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRoomParam(params.get("room"));
    setToken(params.get("token") || localStorage.getItem("token"));
    setReady(true);
  }, []);

  if (!ready) return <div className="container">Loading…</div>;
  if (!roomParam) {
    return (
      <div className="container">
        <p className="page-subtitle">Missing room ID.</p>
        <a href="/rooms">← Back to rooms</a>
      </div>
    );
  }

  if (!token) {
    return (
      <>
        <nav className="nav">
          <a href="/">Excalidraw</a>
          <a href="/">Sign in</a>
        </nav>
        <div className="container">
          <p className="page-subtitle">Sign in to draw in this room.</p>
          <a href="/">← Sign in</a>
        </div>
      </>
    );
  }

  return (
    <>
      <nav className="nav">
        <a href="/rooms">← Rooms</a>
        <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Room {roomParam}
        </span>
        <a
          href={process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3002"}
          target="_blank"
          rel="noopener noreferrer"
        >
          Metrics &amp; patterns
        </a>
      </nav>
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", minHeight: "calc(100vh - 52px)" }}>
        <DrawingBoard roomId={roomParam} token={token} />
      </div>
    </>
  );
}

export default function DrawPage() {
  return <DrawContent />;
}
