"use client";

import { useEffect, useState } from "react";
import ShopsPage from "./shops";
import PartsPage from "./parts";
import DevicesPage from "./devices";
import MatchingGroupsPage from "./matching-groups";

const API = process.env.NEXT_PUBLIC_API_URL + "/api";

const NETLR_STYLES = `
  .netlr-root { display: flex; min-height: 100vh; background:
    radial-gradient(1200px 500px at 100% -10%, rgba(201,132,42,0.12), transparent 55%),
    linear-gradient(180deg, #f4efe7 0%, var(--nl-paper) 180px);
    color: var(--nl-text); }
  .netlr-sidebar { width: 268px; min-width: 268px; background: linear-gradient(180deg, #171411 0%, #0f0d0b 100%); color: #efe7dc; display: flex; flex-direction: column; padding: 22px 16px; height: 100vh; position: sticky; top: 0; border-left: 1px solid rgba(224,177,90,0.12); }
  .netlr-brand { display: flex; align-items: center; gap: 12px; padding: 4px 6px 22px; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .netlr-logo { width: 46px; height: 46px; border-radius: 14px; background: linear-gradient(145deg, #e0b15a, #c9842a 55%, #8a5a16); display: grid; place-items: center; color: #1a1308; font-weight: 800; font-size: 0.92rem; letter-spacing: 0.5px; box-shadow: 0 8px 20px rgba(201,132,42,0.35); }
  .netlr-brand-name { font-weight: 800; font-size: 1.2rem; color: #fff8ee; letter-spacing: 1.5px; }
  .netlr-brand-sub { font-size: 0.72rem; color: #b7aa98; margin-top: 2px; }
  .netlr-nav-label { font-size: 0.68rem; color: #8d8274; letter-spacing: 0.12em; padding: 14px 12px 8px; }
  .netlr-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
  .netlr-nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 13px; border-radius: 12px; color: #c9bfb2; cursor: pointer; font-size: 0.92rem; font-weight: 600; border: none; background: transparent; text-align: right; width: 100%; transition: 0.18s ease; }
  .netlr-nav-item:hover { background: rgba(255,255,255,0.05); color: #fff8ee; }
  .netlr-nav-item.active { background: linear-gradient(90deg, rgba(201,132,42,0.22), rgba(201,132,42,0.05)); color: #ffe6b0; box-shadow: inset -3px 0 0 #c9842a; }
  .netlr-nav-icon { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: rgba(255,255,255,0.04); flex-shrink: 0; }
  .netlr-nav-item.active .netlr-nav-icon { background: rgba(201,132,42,0.22); }
  .netlr-sidebar-footer { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 14px; margin-top: 8px; }
  .netlr-today { direction: ltr; text-align: center; color: #8d8274; font-size: 0.75rem; font-weight: 600; margin-bottom: 10px; }
  .netlr-logout { display: flex; align-items: center; gap: 10px; padding: 11px 13px; border-radius: 12px; color: #f0b4b4; cursor: pointer; font-size: 0.9rem; font-weight: 600; border: 1px solid rgba(248,113,113,0.15); background: rgba(185,28,28,0.08); text-align: right; width: 100%; }
  .netlr-logout:hover { background: rgba(185,28,28,0.16); }
  .netlr-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .netlr-topbar { background: rgba(255,252,248,0.82); backdrop-filter: blur(16px); border-bottom: 1px solid var(--nl-line); padding: 16px 28px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 10; }
  .netlr-topbar-title { font-size: 1.35rem; font-weight: 800; color: var(--nl-text); }
  .netlr-breadcrumb { font-size: 0.78rem; color: var(--nl-muted); margin-top: 3px; }
  .netlr-admin-badge { display: flex; align-items: center; gap: 10px; background: #fff; padding: 6px 8px 6px 14px; border-radius: 999px; font-size: 0.85rem; font-weight: 700; color: #44403c; border: 1px solid var(--nl-line); box-shadow: var(--nl-shadow); }
  .netlr-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(145deg, #e0b15a, #c9842a); color: #1a1308; display: grid; place-items: center; font-weight: 800; font-size: 0.85rem; }
  .netlr-content { padding: 26px 28px 12px; flex: 1; }
  .netlr-hero { background: linear-gradient(120deg, #1c1916 0%, #2a231c 58%, #3a2c18 100%); color: #fff8ee; border-radius: 22px; padding: 26px 28px; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: center; gap: 18px; box-shadow: var(--nl-shadow-lg); position: relative; overflow: hidden; }
  .netlr-hero::after { content: ""; position: absolute; width: 280px; height: 280px; border-radius: 50%; background: radial-gradient(circle, rgba(224,177,90,0.28), transparent 70%); left: -60px; top: -90px; }
  .netlr-hero h2 { font-size: 1.45rem; font-weight: 800; position: relative; }
  .netlr-hero p { color: #d6cbb8; margin-top: 6px; font-size: 0.9rem; position: relative; }
  .netlr-hero-chip { background: rgba(255,255,255,0.08); border: 1px solid rgba(224,177,90,0.28); color: #ffe6b0; padding: 8px 14px; border-radius: 999px; font-size: 0.8rem; font-weight: 700; position: relative; }
  .netlr-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-bottom: 22px; }
  @media (max-width: 1200px) { .netlr-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  .netlr-stat-card { background: var(--nl-card); border-radius: 18px; padding: 20px 20px 18px; border: 1px solid var(--nl-line); box-shadow: var(--nl-shadow); position: relative; overflow: hidden; }
  .netlr-stat-card::before { content: ""; position: absolute; top: 0; right: 0; left: 0; height: 3px; background: var(--stat-accent, linear-gradient(90deg, var(--nl-brass), var(--nl-brass-2))); }
  .netlr-stat-num { font-size: 1.75rem; font-weight: 800; color: var(--nl-text); line-height: 1; letter-spacing: -0.03em; }
  .netlr-stat-lbl { font-size: 0.82rem; color: var(--nl-muted); margin-top: 8px; font-weight: 600; }
  .netlr-table-card { background: var(--nl-card); border-radius: 18px; overflow: hidden; border: 1px solid var(--nl-line); box-shadow: var(--nl-shadow); }
  .netlr-table-header { padding: 16px 22px; border-bottom: 1px solid var(--nl-line); font-weight: 800; font-size: 1rem; display: flex; align-items: center; gap: 10px; }
  .netlr-table-header::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--nl-brass); }
  .netlr-table-card table { width: 100%; border-collapse: collapse; }
  .netlr-table-card th { text-align: right; padding: 12px 20px; font-size: 0.74rem; color: var(--nl-muted); background: #faf6f0; font-weight: 700; border-bottom: 1px solid var(--nl-line); }
  .netlr-table-card td { padding: 14px 20px; font-size: 0.9rem; border-bottom: 1px solid #f3eee6; color: #44403c; }
  .netlr-table-card tbody tr:hover { background: #fbf7f1; }
  .badge-active { background: var(--nl-ok-bg); color: var(--nl-ok); padding: 4px 11px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; }
  .badge-inactive { background: var(--nl-bad-bg); color: var(--nl-bad); padding: 4px 11px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; }
  .netlr-page-footer { text-align: center; padding: 8px 16px 18px; color: var(--nl-muted); font-size: 0.78rem; font-weight: 600; }
  @media (max-width: 900px) {
    .netlr-root { flex-direction: column; }
    .netlr-sidebar { width: 100%; min-width: 0; height: auto; position: relative; }
    .netlr-nav { flex-direction: row; overflow-x: auto; }
    .netlr-hero { flex-direction: column; align-items: flex-start; }
  }
`;

const menu = [
  { id: "dashboard", label: "لوحة التحكم", icon: "home" },
  { id: "shops",     label: "المحلات", icon: "shop" },
  { id: "devices",   label: "الأجهزة", icon: "pc" },
  { id: "parts",     label: "القطع", icon: "part" },
  { id: "matching",  label: "مطابقة الأرقام", icon: "link" },
];

const pageTitle: Record<string, string> = {
  dashboard: "لوحة التحكم",
  shops: "المحلات",
  devices: "الأجهزة",
  parts: "القطع",
  matching: "مطابقة الأرقام",
};

function formatToday() {
  return new Date().toLocaleDateString("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function fmt(n: number) {
  return (n ?? 0).toLocaleString("en-US");
}

function NavIcon({ name }: { name: string }) {
  const common = { width: 18, height: 18, fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "home") return <svg {...common} viewBox="0 0 24 24"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"/></svg>;
  if (name === "shop") return <svg {...common} viewBox="0 0 24 24"><path d="M4 9h16l-1.2-4.5A2 2 0 0 0 16.9 3H7.1a2 2 0 0 0-1.9 1.5L4 9z"/><path d="M4 9v10a1 1 0 0 0 1 1h5v-6h4v6h5a1 1 0 0 0 1-1V9"/></svg>;
  if (name === "pc") return <svg {...common} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>;
  if (name === "part") return <svg {...common} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/></svg>;
  return <svg {...common} viewBox="0 0 24 24"><path d="M9 7H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4"/><path d="M14 4h6v6"/><path d="M10 14 20 4"/></svg>;
}

export default function AdminPage() {
  const [page, setPage] = useState("dashboard");
  const [today, setToday] = useState(formatToday);
  const [shops, setShops] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalShops: 0, totalDevices: 0, onlineDevices: 0, offlineDevices: 0,
    totalParts: 0, inStockParts: 0, outOfStockParts: 0, searchableParts: 0,
  });

  const token = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const loadDashboard = async () => {
    try {
      const [statsRes, shopsRes] = await Promise.all([
        fetch(`${API}/stats`, { headers: token() }),
        fetch(`${API}/stores`, { headers: token() }),
      ]);
      if (statsRes.status === 401 || shopsRes.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }
      const statsData = await statsRes.json();
      const shopsData = await shopsRes.json();
      setStats(statsData);
      setShops(Array.isArray(shopsData) ? shopsData.slice(0, 5) : []);
    } catch {}
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      window.location.href = "/login";
      return;
    }
    if (page === "dashboard") loadDashboard();
  }, [page]);
  useEffect(() => {
    const id = setInterval(() => setToday(formatToday()), 60_000);
    return () => clearInterval(id);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  const statCards = [
    { label: "إجمالي المحلات", value: stats.totalShops, accent: "#c9842a" },
    { label: "إجمالي الأجهزة", value: stats.totalDevices, accent: "#7c3aed" },
    { label: "الأجهزة المتصلة", value: stats.onlineDevices, accent: "#15803d" },
    { label: "الأجهزة غير المتصلة", value: stats.offlineDevices, accent: "#b91c1c" },
    { label: "إجمالي القطع", value: stats.totalParts, accent: "#c2410c" },
    { label: "قطع متوفرة", value: stats.inStockParts, accent: "#0f766e" },
    { label: "قابلة للبحث بالتطبيق", value: stats.searchableParts, accent: "#1d4ed8" },
  ];

  return (
    <>
      <style>{NETLR_STYLES}</style>
      <div className="netlr-root">
        <aside className="netlr-sidebar">
          <div className="netlr-brand">
            <div className="netlr-logo">NL</div>
            <div>
              <div className="netlr-brand-name">NetLR</div>
              <div className="netlr-brand-sub">شبكة قطع الغيار</div>
            </div>
          </div>
          <div className="netlr-nav-label">القائمة</div>
          <nav className="netlr-nav">
            {menu.map(m => (
              <button key={m.id} className={`netlr-nav-item ${page === m.id ? "active" : ""}`} onClick={() => setPage(m.id)}>
                <span className="netlr-nav-icon"><NavIcon name={m.icon} /></span>
                {m.label}
              </button>
            ))}
          </nav>
          <div className="netlr-sidebar-footer">
            <div className="netlr-today">{today}</div>
            <button className="netlr-logout" onClick={logout}>تسجيل الخروج</button>
          </div>
        </aside>

        <main className="netlr-main">
          <div className="netlr-topbar">
            <div>
              <div className="netlr-topbar-title">{pageTitle[page]}</div>
              <div className="netlr-breadcrumb">NetLR / {pageTitle[page]}</div>
            </div>
            <div className="netlr-admin-badge">
              <div className="netlr-avatar">م</div>
              مدير النظام
            </div>
          </div>

          <div className="netlr-content">
            <div key={page} className="nl-page-enter">
            {page === "dashboard" && (
              <>
                <div className="netlr-hero">
                  <div>
                    <h2>مرحباً بك في لوحة الإدارة</h2>
                    <p>نظرة سريعة على المحلات، الأجهزة، والقطع المرتبطة بالشبكة.</p>
                  </div>
                  <div className="netlr-hero-chip">{today}</div>
                </div>
                <div className="netlr-stats">
                  {statCards.map(s => (
                    <div key={s.label} className="netlr-stat-card" style={{ ["--stat-accent" as any]: s.accent }}>
                      <div className="netlr-stat-num">{fmt(s.value)}</div>
                      <div className="netlr-stat-lbl">{s.label}</div>
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
                        <tr><td colSpan={4} style={{ textAlign: "center", color: "#7a7268", padding: "36px" }}>لا توجد محلات بعد</td></tr>
                      ) : shops.map((s: any, i: number) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 700 }}>{s.name}</td>
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
          </div>
          <div className="netlr-page-footer">NetLR · {today}</div>
        </main>
      </div>
    </>
  );
}
