export default function Dashboard() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Creator Dashboard</h1>
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={{ padding: 20, background: "#eee" }}>
          <h3>Total Videos</h3>
          <p>12</p>
        </div>
        <div style={{ padding: 20, background: "#eee" }}>
          <h3>Total Views</h3>
          <p>8,420</p>
        </div>
        <div style={{ padding: 20, background: "#eee" }}>
          <h3>Total Revenue</h3>
          <p>₹4,320</p>
        </div>
      </div>
    </div>
  )
}

