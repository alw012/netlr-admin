"use client";

import { useEffect, useState } from "react";
import ShopsPage from "./shops";
import PartsPage from "./parts";
import DevicesPage from "./devices";
import MatchingGroupsPage from "./matching-groups";

const API = process.env.NEXT_PUBLIC_API_URL + "/api";

const NETLR_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  .netlr-root { display: flex; min-height: 100vh; background: #f1f5f9; font-family: "Segoe UI", Tahoma, Arial, sans-serif; direction: rtl; color: #0f172a; }
  .netlr-sidebar { width: 240px; min-width: 240px; background: #0f172a; color: #e2e8f0; display: flex; flex-direction: column; padding: 20px 14px; height: 100vh; position: sticky; top: 0; }
  .netlr-brand { display: flex; align-items: center; gap: 12px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 16px; }
  .netlr-logo { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #3b82f6, #6366f1); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.95rem; color: #fff; letter-spacing: 1px; }
  .netlr-brand-text { display: flex; flex-direction: column; }
  .netlr-brand-name { font-weight: 800; font-size: 1.1rem; color: #fff; letter-spacing: 1px; }
  .netlr-brand-sub  { font-size: 0.7rem; color: #94a3b8; margin-top: 2px; }
  .netlr-nav { display: flex; flex-direction: column; gap: 3px; flex: 1; }
  .netlr-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 13px; border-radius: 10px; color: #94a3b8; cursor: pointer; font-size: 0.9rem; font-weight: 600; border: none; background: transparent; text-align: right; width: 100%; transition: all 0.15s ease; }
  .netlr-nav-item:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; }
  .netlr-nav-item.active { background: linear-gradient(135deg, #3b82f6, #6366f1); color: #fff; box-shadow: 0 4px 12px rgba(59,130,246,0.35); }
  .netlr-nav-icon { font-size: 1.1rem; width: 20px; text-align: center; }
  .netlr-sidebar-footer { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px; margin-top: 8px; }
  .netlr-logout { display: flex; align-items: center; gap: 10px; padding: 10px 13px; border-radius: 10px; color: #fca5a5; cursor: pointer; font-size: 0.9rem; font-weight: 600; border: none; background: transparent; text-align: right; width: 100%; transition: all 0.15s ease; }
  .netlr-logout:hover { background: rgba(239,68,68,0.1); color: #fecaca; }
  .netlr-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .netlr-topbar { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 14px 26px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 10; }
  .netlr-topbar-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; }
  .netlr-breadcrumb { font-size: 0.78rem; color: #94a3b8; margin-top: 2px; }
  .netlr-topbar-right { display: flex; align-items: center; gap: 10px; }
  .netlr-admin-badge { display: flex; align-items: center; gap: 8px; background: #f1f5f9; padding: 6px 14px; border-radius: 999px; font-size: 0.85rem; font-weight: 700; color: #475569; }
  .netlr-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #6366f1); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; }
  .netlr-content { padding: 24px; flex: 1; }
  .netlr-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .netlr-stat-card { background: #fff; border-radius: 14px; padding: 18px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.04); display: flex; align-items: center; gap: 14px; }
  .netlr-stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
  .netlr-stat-num { font-size: 1.6rem; font-weight: 800; color: #0f172a; line-height: 1.1; }
  .netlr-stat-lbl { font-size: 0.8rem; color: #64748b; margin-top: 3px; }
  .netlr-table-card { background: #fff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .netlr-table-header { padding: 14px 20px; border-bottom: 1px solid #f1f5f9; font-weight: 800; font-size: 1rem; color: #0f172a; }
  .netlr-table-card table { width: 100%; border-collapse: collapse; }
  .netlr-table-card th { text-align: right; padding: 12px 20px; font-size: 0.78rem; color: #94a3b8; background: #f8fafc; font-weight: 700; border-bottom: 1px solid #f1f5f9; }
  .netlr-table-card td { padding: 13px 20px; font-size: 0.9rem; border-bottom: 1px solid #f8fafc; color: #334155; }
  .netlr-table-card tr:last-child td { border-bottom: none; }
  .netlr-table-card tbody tr:hover { background: #f8fafc; }
  .badge-active   { background: #dcfce7; color: #16a34a; padding: 3px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 700; }
  .badge-inactive { background: #fee2e2; color: #dc2626; padding: 3px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 700; }
`;

const menu = [
  { id: "dashboard", label: "لوحة التحكم",   icon: "🏠" },
  { id: "shops",     label: "المحلات",        icon: "🏪" },
  { id: "devices",   label: "الأجهزة",        icon: "💻" },
  { id: "parts",     label: "القطع",          icon: "🔩" },
  { id: "matching",  label: "مطابقة الأرقام", icon: "🔗" },
];

const pageTitle: Record<string, string> = {
  dashboard: "لوحة التحكم",
  shops:     "المحلات",
  devices:   "الأجهزة",
  parts:     "القطع",
  matching:  "مطابقة الأرقام",
};

export default function AdminPage() {
  const [page, setPage] = useState("dashboard");
  const [shops, setShops] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalShops: 0, totalDevices: 0, onlineDevices: 0, offlineDevices: 0,
    totalParts: 0,
  });

  const token = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const loadDashboard = async () => {
    try {
      const [statsRes, shopsRes] = await Promise.all([
        fetch(`${API}/stats`, { headers: token() }),
        fetch(`${API}/stores`, { headers: token() }),
      ]);
      const statsData = await statsRes.json();
      const shopsData = await shopsRes.json();
      setStats(statsData);
      setShops(shopsData.slice(0, 5));
    } catch {}
  };

  useEffect(() => { if (page === "dashboard") loadDashboard(); }, [page]);

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  const statCards = [
    { label: "إجمالي المحلات",      value: stats.totalShops,     icon: "🏪", bg: "#eff6ff", color: "#3b82f6" },
    { label: "إجمالي الأجهزة",      value: stats.totalDevices,   icon: "💻", bg: "#f5f3ff", color: "#8b5cf6" },
    { label: "الأجهزة المتصلة",     value: stats.onlineDevices,  icon: "🟢", bg: "#f0fdf4", color: "#22c55e" },
    { label: "الأجهزة غير المتصلة", value: stats.offlineDevices, icon: "🔴", bg: "#fef2f2", color: "#ef4444" },
    { label: "إجمالي القطع",        value: stats.totalParts,     icon: "🔩", bg: "#fff7ed", color: "#f97316" },
  ];

  return (
    <>
      <style>{NETLR_STYLES}</style>
      <div className="netlr-root">
        <aside className="netlr-sidebar">
          <div className="netlr-brand">
            <div className="netlr-logo">NL</div>
            <div className="netlr-brand-text">
              <div className="netlr-brand-name">NetLR</div>
              <div className="netlr-brand-sub">لوحة الإدارة</div>
            </div>
          </div>
          <nav className="netlr-nav">
            {menu.map(m => (
              <button key={m.id} className={`netlr-nav-item ${page === m.id ? "active" : ""}`} onClick={() => setPage(m.id)}>
                <span className="netlr-nav-icon">{m.icon}</span>
                {m.label}
              </button>
            ))}
          </nav>
          <div className="netlr-sidebar-footer">
            <button className="netlr-logout" onClick={logout}>
              <span>🚪</span> تسجيل الخروج
            </button>
          </div>
        </aside>

        <main className="netlr-main">
          <div className="netlr-topbar">
            <div>
              <div className="netlr-topbar-title">{pageTitle[page]}</div>
              <div className="netlr-breadcrumb">NetLR / <span>{pageTitle[page]}</span></div>
            </div>
            <div className="netlr-topbar-right">
              <div className="netlr-admin-badge">
                <div className="netlr-avatar">A</div>
                مدير النظام
              </div>
            </div>
          </div>

          <div className="netlr-content">
            {page === "dashboard" && (
              <>
                <div className="netlr-stats">
                  {statCards.map(s => (
                    <div key={s.label} className="netlr-stat-card">
                      <div className="netlr-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                      <div>
                        <div className="netlr-stat-num">{s.value}</div>
                        <div className="netlr-stat-lbl">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="netlr-table-card">
                  <div className="netlr-table-header">آخر المحلات</div>
                  <table>
                    <thead>
                      <tr>{["اسم المحل", "المدينة", "الهاتف", "الحالة"].map(h => <th key={h}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {shops.length === 0 ? (
                        <tr><td colSpan={4} style={{ textAlign: "center", color: "#94a3b8", padding: "32px" }}>لا توجد محلات بعد</td></tr>
                      ) : shops.map((s: any, i: number) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{s.name}</td>
                          <td>{s.city}</td>
                          <td style={{ direction: "ltr", textAlign: "left" }}>{s.phone}</td>
                          <td><span className={s.isActive ? "badge-active" : "badge-inactive"}>{s.isActive ? "نشط" : "متوقف"}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {page === "shops"    && <ShopsPage />}
            {page === "devices"  && <DevicesPage />}
            {page === "parts"    && <PartsPage />}
            {page === "matching" && <MatchingGroupsPage />}
          </div>
        </main>
      </div>
    </>
  );
}
