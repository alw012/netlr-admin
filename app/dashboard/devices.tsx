"use client";
import { useEffect, useState } from "react";

const API = "https://orvix-api-production.up.railway.app/api";

const DEVICES_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');
  .devices-wrap { font-family: 'Cairo', sans-serif; direction: rtl; }
  .devices-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
  .devices-title { font-size: 1.4rem; font-weight: 800; color: #0f172a; }
  .devices-sub { font-size: 0.8rem; color: #94a3b8; margin-top: 2px; }
  .search-bar { background: white; border-radius: 14px; padding: 14px 18px; margin-bottom: 18px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .search-bar select { flex: 1; border: none; outline: none; font-size: 0.88rem; font-family: 'Cairo', sans-serif; color: #334155; background: transparent; direction: rtl; }
  .devices-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 24px; }
  .devices-stat { background: white; border-radius: 14px; padding: 18px 20px; display: flex; align-items: center; gap: 14px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .devices-stat-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
  .devices-stat-num { font-size: 1.4rem; font-weight: 800; color: #0f172a; }
  .devices-stat-lbl { font-size: 0.75rem; color: #64748b; }
  .devices-table-card { background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .devices-table-head { padding: 16px 22px; border-bottom: 1px solid #f1f5f9; font-weight: 700; font-size: 0.88rem; color: #0f172a; display: flex; align-items: center; gap: 8px; }
  .devices-table-head::before { content: ''; width: 4px; height: 18px; background: linear-gradient(135deg, #7c3aed, #8b5cf6); border-radius: 2px; }
  .devices-table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
  .devices-table thead tr { background: #f8fafc; }
  .devices-table th { padding: 11px 18px; text-align: right; color: #64748b; font-weight: 600; font-size: 0.75rem; font-family: 'Cairo', sans-serif; }
  .devices-table td { padding: 13px 18px; color: #334155; border-bottom: 1px solid #f8fafc; font-family: 'Cairo', sans-serif; }
  .devices-table tbody tr:hover { background: #f8fafc; }
  .devices-table tbody tr:last-child td { border-bottom: none; }
  .badge-online  { background: #d1fae5; color: #059669; padding: 4px 12px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; }
  .badge-offline { background: #fee2e2; color: #dc2626; padding: 4px 12px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; }
  .device-id { font-family: monospace; font-size: 0.85rem; font-weight: 700; color: #7c3aed; background: #f5f3ff; padding: 3px 8px; border-radius: 6px; }
  .empty-state { text-align: center; padding: 60px 20px; color: #94a3b8; font-size: 0.88rem; }
  .empty-icon { font-size: 2.5rem; margin-bottom: 10px; }
  .btn-del { padding: 6px 14px; border-radius: 8px; background: #fef2f2; color: #dc2626; border: none; cursor: pointer; font-size: 0.75rem; font-family: 'Cairo', sans-serif; font-weight: 600; }
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
    if (!confirm("هل أنت متأكد من حذف هذا الجهاز؟")) return;
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
                <th>اسم الجهاز</th>
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
                  <td><strong>{d.name || "—"}</strong></td>
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
