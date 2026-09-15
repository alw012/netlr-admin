"use client";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL + "/api";

function formatDeviceName(name?: string | null) {
  const n = (name ?? "").trim();
  if (!n) return "—";
  if (n.toUpperCase().startsWith("PC ")) return "PC" + n.slice(3).trim();
  return n;
}

const DEVICES_STYLES = `
  .devices-wrap { direction: rtl; }
  .devices-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 22px; }
  .devices-title { font-size: 1.28rem; font-weight: 800; color: var(--nl-text); }
  .devices-sub { font-size: 0.82rem; color: var(--nl-muted); margin-top: 3px; }
  .search-bar { background: var(--nl-card); border-radius: 14px; padding: 13px 16px; margin-bottom: 16px; border: 1px solid var(--nl-line); display: flex; align-items: center; gap: 10px; box-shadow: var(--nl-shadow); }
  .search-bar select { flex: 1; border: none; outline: none; font-size: 0.88rem; font-family: inherit; color: var(--nl-text); background: transparent; direction: rtl; }
  .devices-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 20px; }
  .devices-stat { background: var(--nl-card); border-radius: 16px; padding: 18px 20px; display: flex; align-items: center; gap: 14px; border: 1px solid var(--nl-line); box-shadow: var(--nl-shadow); }
  .devices-stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
  .devices-stat-num { font-size: 1.4rem; font-weight: 800; color: var(--nl-text); }
  .devices-stat-lbl { font-size: 0.75rem; color: var(--nl-muted); }
  .devices-table-card { background: var(--nl-card); border-radius: 18px; overflow: hidden; border: 1px solid var(--nl-line); box-shadow: var(--nl-shadow); }
  .devices-table-head { padding: 16px 22px; border-bottom: 1px solid var(--nl-line); font-weight: 800; font-size: 0.92rem; color: var(--nl-text); display: flex; align-items: center; gap: 8px; }
  .devices-table-head::before { content: ''; width: 8px; height: 8px; background: var(--nl-brass); border-radius: 50%; }
  .devices-table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
  .devices-table thead tr { background: #faf6f0; }
  .devices-table th { padding: 11px 18px; text-align: right; color: var(--nl-muted); font-weight: 700; font-size: 0.74rem; }
  .devices-table td { padding: 13px 18px; color: #44403c; border-bottom: 1px solid #f3eee6; }
  .devices-table tbody tr:hover { background: #fbf7f1; }
  .devices-table tbody tr:last-child td { border-bottom: none; }
  .badge-online  { background: var(--nl-ok-bg); color: var(--nl-ok); padding: 4px 12px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; }
  .badge-offline { background: var(--nl-bad-bg); color: var(--nl-bad); padding: 4px 12px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; }
  .device-id { font-family: ui-monospace, monospace; font-size: 0.85rem; font-weight: 700; color: #7c3aed; background: #f5f3ff; padding: 3px 8px; border-radius: 6px; }
  .empty-state { text-align: center; padding: 60px 20px; color: var(--nl-muted); font-size: 0.88rem; }
  .empty-icon { font-size: 2.5rem; margin-bottom: 10px; }
  .btn-del { padding: 6px 14px; border-radius: 8px; background: var(--nl-bad-bg); color: var(--nl-bad); border: none; cursor: pointer; font-size: 0.75rem; font-family: inherit; font-weight: 700; }
`;

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [stores, setStores]   = useState<any[]>([]);
  const [storeId, setStoreId] = useState<string>("");

  const token = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const loadStores = async () => {
    try {
      const res = await fetch(`${API}/stores`, { headers: token() });
      const data = await res.json();
      setStores(data);
    } catch {}
  };

  const loadDevices = async (sid?: string) => {
    try {
      const url = sid ? `${API}/devices?storeId=${sid}` : `${API}/devices`;
      const res = await fetch(url, { headers: token() });
      const data = await res.json();
      setDevices(data);
    } catch {}
  };

  useEffect(() => {
    loadStores();
    loadDevices();
  }, []);

  const handleStoreChange = (e: any) => {
    const val = e.target.value;
    setStoreId(val);
    loadDevices(val || undefined);
  };

  const deleteDevice = async (id: number) => {
    if (!confirm("تعطيل هذا الجهاز يمنعه فوراً من استخدام الـ API ويحرّر خانة تفعيل. حذف مرة ثانية يزيله نهائياً. متابعة؟")) return;
    await fetch(`${API}/devices/${id}`, { method: "DELETE", headers: token() });
    loadDevices(storeId || undefined);
  };

  const total   = devices.length;
  const online  = devices.filter(d => d.isOnline).length;
  const offline = devices.filter(d => !d.isOnline).length;

  return (
    <>
      <style>{DEVICES_STYLES}</style>
      <div className="devices-wrap">

        <div className="devices-header">
          <div>
            <div className="devices-title">💻 إدارة الأجهزة</div>
            <div className="devices-sub">إجمالي الأجهزة: {total}</div>
          </div>
        </div>

        <div className="devices-stats">
          <div className="devices-stat">
            <div className="devices-stat-icon" style={{ background: "#f5f3ff" }}>💻</div>
            <div><div className="devices-stat-num">{total}</div><div className="devices-stat-lbl">إجمالي الأجهزة</div></div>
          </div>
          <div className="devices-stat">
            <div className="devices-stat-icon" style={{ background: "#f0fdf4" }}>🟢</div>
            <div><div className="devices-stat-num">{online}</div><div className="devices-stat-lbl">متصل</div></div>
          </div>
          <div className="devices-stat">
            <div className="devices-stat-icon" style={{ background: "#fef2f2" }}>🔴</div>
            <div><div className="devices-stat-num">{offline}</div><div className="devices-stat-lbl">غير متصل</div></div>
          </div>
        </div>

        <div className="search-bar">
          <span>🔍</span>
          <select value={storeId} onChange={handleStoreChange}>
            <option value="">جميع المحلات</option>
            {stores.map((s: any) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="devices-table-card">
          <div className="devices-table-head">قائمة الأجهزة</div>
          <table className="devices-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Device ID</th>
                <th>User Name</th>
                <th>المحل</th>
                <th>الحالة</th>
                <th>تاريخ التسجيل</th>
                <th>آخر اتصال</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {devices.length === 0 ? (
                <tr><td colSpan={8}><div className="empty-state"><div className="empty-icon">💻</div><div>لا توجد أجهزة</div></div></td></tr>
              ) : devices.map((d: any, i: number) => (
                <tr key={d.id}>
                  <td>{i + 1}</td>
                  <td><span className="device-id">{d.deviceId}</span></td>
                  <td style={{ direction: "ltr", textAlign: "left", fontFamily: "monospace", fontWeight: 700 }}>{formatDeviceName(d.name)}</td>
                  <td>{d.storeName}</td>
                  <td><span className={d.isOnline ? "badge-online" : "badge-offline"}>{d.isOnline ? "متصل" : "غير متصل"}</span></td>
                  <td>{new Date(d.createdAt).toLocaleDateString("ar")}</td>
                  <td>{d.lastSeen ? new Date(d.lastSeen).toLocaleString("ar") : "—"}</td>
                  <td><button className="btn-del" onClick={() => deleteDevice(d.id)}>حذف</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}
