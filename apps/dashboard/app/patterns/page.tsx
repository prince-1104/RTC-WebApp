"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const HTTP_API =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_HTTP_API ?? "http://localhost:3001")
    : "";

interface PatternStats {
  byLabel: Record<string, number>;
  recent: {
    id: number;
    roomId: number;
    detectedLabel: string;
    confidence: number;
    createdAt: string;
  }[];
}

export default function PatternsPage() {
  const [stats, setStats] = useState<PatternStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${HTTP_API}/pattern-stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch((err) => setError(String(err.message)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1 style={{ marginBottom: "1rem" }}>Pattern detection</h1>
        <p style={{ color: "var(--muted)" }}>Loading…</p>
      </main>
    );
  }
  if (error || !stats) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1 style={{ marginBottom: "1rem" }}>Pattern detection</h1>
        <div className="card" style={{ color: "#f87171" }}>
          {error ?? "No data"}
        </div>
      </main>
    );
  }

  const barData = Object.entries(stats.byLabel).map(([label, count]) => ({ label, count }));

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Pattern detection</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Detected shapes from pencil strokes (circle, rectangle, triangle, line, star, apple).
      </p>
      <div className="card" style={{ marginBottom: "1.5rem", height: 320 }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1rem" }}>Count by shape</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="label" stroke="var(--muted)" fontSize={11} />
            <YAxis stroke="var(--muted)" fontSize={11} />
            <Tooltip
              contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            />
            <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1rem" }}>Recent completions</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                <th style={{ padding: "0.5rem" }}>ID</th>
                <th style={{ padding: "0.5rem" }}>Room</th>
                <th style={{ padding: "0.5rem" }}>Detected</th>
                <th style={{ padding: "0.5rem" }}>Confidence</th>
                <th style={{ padding: "0.5rem" }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.5rem" }}>{r.id}</td>
                  <td style={{ padding: "0.5rem" }}>{r.roomId}</td>
                  <td style={{ padding: "0.5rem" }}>{r.detectedLabel}</td>
                  <td style={{ padding: "0.5rem" }}>{(r.confidence * 100).toFixed(0)}%</td>
                  <td style={{ padding: "0.5rem", color: "var(--muted)" }}>{r.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
