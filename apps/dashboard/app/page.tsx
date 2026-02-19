export default function DashboardHome() {
  const httpApi = process.env.NEXT_PUBLIC_HTTP_API ?? "http://localhost:3001";
  const wsMetrics = process.env.NEXT_PUBLIC_WS_METRICS ?? "http://localhost:8081";
  const prometheus = process.env.NEXT_PUBLIC_PROMETHEUS_URL ?? "http://localhost:9090";

  return (
    <main style={{ padding: "2rem", maxWidth: 900 }}>
      <h1 style={{ marginBottom: "0.5rem", fontSize: "1.75rem" }}>
        Excalidraw observability
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
        Pattern detection in time series and drawing activity.
      </p>
      <section className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>Endpoints</h2>
        <ul style={{ listStyle: "none" }}>
          <li>
            <strong>HTTP API:</strong>{" "}
            <a href={httpApi} target="_blank" rel="noopener noreferrer">
              {httpApi}
            </a>
          </li>
          <li style={{ marginTop: "0.5rem" }}>
            <strong>Pattern stats:</strong>{" "}
            <a href={`${httpApi}/pattern-stats`} target="_blank" rel="noopener noreferrer">
              {httpApi}/pattern-stats
            </a>
          </li>
          <li style={{ marginTop: "0.5rem" }}>
            <strong>WS metrics:</strong>{" "}
            <a href={`${wsMetrics}/metrics`} target="_blank" rel="noopener noreferrer">
              {wsMetrics}/metrics
            </a>
          </li>
          <li style={{ marginTop: "0.5rem" }}>
            <strong>Prometheus:</strong>{" "}
            <a href={prometheus} target="_blank" rel="noopener noreferrer">
              {prometheus}
            </a>{" "}
            (for time series)
          </li>
        </ul>
      </section>
      <section className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>Features</h2>
        <ul style={{ paddingLeft: "1.25rem", color: "var(--muted)" }}>
          <li>Drawing app: draw with pencil/line/rectangle; strokes are analyzed and auto-completed (circle, rectangle, triangle, line, star, apple).</li>
          <li>Time series: Prometheus scrapes HTTP and WS backends; Grafana can visualize metrics.</li>
          <li>Pattern stats: counts by detected shape and recent completions from the API.</li>
        </ul>
      </section>
    </main>
  );
}
