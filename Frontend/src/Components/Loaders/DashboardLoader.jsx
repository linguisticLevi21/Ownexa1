import "../../Styles/Components/Loaders/DashboardLoader.css";

export default function DashboardPageLoader({ title = "Loading dashboard..." }) {
  return (
    <div className="dpl-wrap">
      {/* Sidebar skeleton */}
      <aside className="dpl-side">
        <div className="dpl-user">
          <div className="dpl-avatar dpl-skel" />
          <div className="dpl-userMeta">
            <div className="dpl-line dpl-skel" style={{ width: "68%" }} />
            <div className="dpl-line dpl-skel" style={{ width: "48%" }} />
          </div>
        </div>

        <div className="dpl-menu">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="dpl-menuItem dpl-skel" />
          ))}
        </div>
      </aside>

      {/* Main skeleton */}
      <main className="dpl-main">
        <div className="dpl-top">
          <div className="dpl-h1">{title}</div>
          <div className="dpl-pill dpl-skel" />
        </div>

        <div className="dpl-cards">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="dpl-card dpl-skel" />
          ))}
        </div>

        <div className="dpl-table dpl-skel" />
      </main>
    </div>
  );
}