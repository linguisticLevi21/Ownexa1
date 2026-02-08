import React, { useEffect, useState, useRef } from "react";
import "../../Styles/Admin/AdminViewPage.css";

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState([]);
  const [days, setDays] = useState(90);
  const [chartLoading, setChartLoading] = useState(true);
  const analyticsCache = useRef({});
  const API = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setChartLoading(true);

      if (analyticsCache.current[days]) {
        if (!mounted) return;
        setAnalytics(analyticsCache.current[days]);
        setChartLoading(false);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API}/admin/stats?days=${days}`, { credentials: "include" });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          const arr = Array.isArray(data) ? data : [];
          analyticsCache.current[days] = arr;
          setAnalytics(arr);
        } else {
          analyticsCache.current[days] = [];
          setAnalytics([]);
        }
      } catch (err) {
        console.error(err);
        analyticsCache.current[days] = [];
        setAnalytics([]);
      } finally {
        if (mounted) {
          setChartLoading(false);
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [days, API]);

  if (loading) return <div className="chart-loading">Loading…</div>;

  return (
    <div className="admin-pending-page">
      <div className="admin-freeze-header">
        <h2>Analytics Table</h2>
        <div className="range-switch">
          {[7, 14, 30, 90].map((d) => (
            <button key={d} className={days === d ? "active" : ""} onClick={() => days !== d && setDays(d)}>
              {d}D
            </button>
          ))}
        </div>
      </div>

      {chartLoading ? (
        <div className="chart-loading">Loading analytics…</div>
      ) : analytics.length === 0 ? (
        <div className="chart-empty">No analytics data</div>
      ) : (
        <div className="analytics-list">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Transactions</th>
                <th>Volume (₹)</th>
              </tr>
            </thead>
            <tbody>
              {analytics.map((row) => (
                <tr key={row.day}>
                  <td>{new Date(row.day).toLocaleDateString("en-IN")}</td>
                  <td>{row.tx_count}</td>
                  <td>₹{Number(row.volume_inr).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
