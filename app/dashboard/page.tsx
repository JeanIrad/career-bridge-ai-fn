export default function Dashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h1
        style={{ fontSize: "2.5rem", marginBottom: "0.5em", fontWeight: 700 }}
      >
        Welcome to Your Dashboard
      </h1>
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "2em 3em",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.18)",
          minWidth: "320px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "1.2rem", marginBottom: "1.5em" }}>
          Here you can track your progress, view analytics, and manage your
          career goals.
        </p>
        <div style={{ display: "flex", gap: "2em", justifyContent: "center" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "2rem" }}>5</h2>
            <span>Active Goals</span>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "2rem" }}>12</h2>
            <span>Completed Tasks</span>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "2rem" }}>3</h2>
            <span>Upcoming Events</span>
          </div>
        </div>
      </div>
    </div>
  );
}
