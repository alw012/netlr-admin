"use client";
import { useEffect, useState } from "react";

const API = "https://orvix-api-production.up.railway.app/api";

export default function PartsPage() {
  const [parts, setParts]       = useState<any[]>([]);
  const [stores, setStores]     = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);

  const token = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const load = async () => {
    try {
      const [partsRes, storesRes] = await Promise.all([
        fetch(`${API}/parts`, { headers: token() }),
        fetch(`${API}/stores`, { headers: token() }),
      ]);
      const partsData  = await partsRes.json();
      const storesData = await storesRes.json();
      setParts(partsData);
      setFiltered(partsData);
      setStores(storesData);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(parts.filter(p =>
      p.partNumber?.toLowerCase().includes(q) ||
      p.type?.toLowerCase().includes(q) ||
      getStoreName(p.storeId)?.toLowerCase().includes(q)
    ));
  }, [search, parts]);

  const getStore        = (storeId: number) => stores.find(s => s.id == storeId);
  const getStoreName    = (storeId: number) => getStore(storeId)?.name    || "—";
  const getStoreCity    = (storeId: number) => getStore(storeId)?.city    || "—";
  const getStoreAddress = (storeId: number) => getStore(storeId)?.address || "—";

  const fmtDate = (d: any) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleString("ar-SA", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit",
      });
    } catch { return "—"; }
  };

  const totalParts      = parts.length;
  const totalOriginal   = parts.filter(p => p.type === "أصلي").length;
  const totalCommercial = parts.filter(p => p.type === "تجاري").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');
        .parts-wrap { font-family: 'Cairo', sans-serif; direction: rtl; }
        .parts-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
        .parts-title { font-size: 1.4rem; font-weight: 800; color: #0f172a; }
        .parts-sub { font-size: 0.8rem; color: #94a3b8; margin-top: 2px; }
        .readonly-badge { display: flex; align-items: center; gap: 8px; padding: 9px 18px; background: #f1f5f9; color: #64748b; border-radius: 12px; font-size: 0.82rem; font-weight: 700; }
        .parts-stats { display: flex; gap: 16px; margin-bottom: 24px; }
        .parts-stat { display: flex; align-items: center; gap: 12px; background: white; border-radius: 14px; padding: 16px 20px; flex: 1; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
        .parts-stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
        .parts-stat-num { font-size: 1.4rem; font-weight: 800; }
        .parts-stat-lbl { font-size: 0.75rem; color: #94a3b8; }
        .search-bar { display: flex; align-items: center; gap: 10px; background: white; border-radius: 12px; padding: 10px 16px; margin-bottom: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
        .search-bar input { border: none; outline: none; flex: 1; font-family: 'Cairo', sans-serif; font-size: 0.88rem; direction: rtl; }
        .parts-table-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
        .parts-table-head { padding: 16px 20px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .parts-table-wrap { overflow-x: auto; }
        .parts-table { width: 100%; border-collapse: collapse; }
        .parts-table th { padding: 12px 16px; text-align: right; font-size: 0.78rem; color: #94a3b8; font-weight: 600; background: #f8fafc; white-space: nowrap; }
        .parts-table td { padding: 14px 16px; border-top: 1px solid #f1f5f9; font-size: 0.85rem; white-space: nowrap; }
        .part-number { font-family: monospace; font-size: 0.9rem; font-weight: 700; color: #0f172a; background: #f1f5f9; padding: 3px 8px; border-radius: 6px; }
        .badge-original   { background: #f0fdf4; color: #16a34a; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .badge-commercial { background: #fffbeb; color: #d97706; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .qty-pill { font-weight: 700; color: #0f172a; }
        .qty-zero { color: #dc2626; }
        .empty-state { text-align: center; padding: 40px; color: #94a3b8; }
        .empty-icon { font-size: 2.5rem; margin-bottom: 10px; }
        .last-sync { font-size: 0.78rem; color: #94a3b8; }
      `}</style>

      <div className="parts-wrap">
        <div className="parts-header">
          <div>
            <div className="parts-title">🔧 إدارة القطع</div>
            <div className="parts-sub">إجمالي القطع: {parts.length} — البيانات تُجمع تلقائياً من المحلات</div>
          </div>
          <div className="readonly-badge">🔒 عرض فقط</div>
        </div>

        <div className="parts-stats">
          {[
            { label: "إجمالي القطع",  value: totalParts,      icon: "🔧", bg: "#f0f9ff", color: "#0891b2" },
            { label: "قطع أصلية",     value: totalOriginal,   icon: "✅", bg: "#f0fdf4", color: "#16a34a" },
            { label: "قطع تجارية",    value: totalCommercial, icon: "🏷", bg: "#fffbeb", color: "#d97706" },
          ].map(s => (
            <div className="parts-stat" key={s.label}>
              <div className="parts-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div>
                <div className="parts-stat-num" style={{ color: s.color }}>{s.value}</div>
                <div className="parts-stat-lbl">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="search-bar">
          <span style={{ color: "#94a3b8" }}>🔍</span>
          <input
            placeholder="بحث برقم القطعة أو المحل..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="parts-table-card">
          <div className="parts-table-head">
            <span>قائمة القطع</span>
            <span className="last-sync">عرض {filtered.length} من {parts.length}</span>
          </div>
          <div className="parts-table-wrap">
            <table className="parts-table">
              <thead>
                <tr>
                  <th>رقم القطعة</th>
                  <th>النوع</th>
                  <th>الكمية</th>
                  <th>السعر</th>
                  <th>سعر الشركة</th>
                  <th>المحل</th>
                  <th>المدينة</th>
                  <th>العنوان</th>
                  <th>آخر تحديث</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9}>
                    <div className="empty-state">جاري التحميل...</div>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={9}>
                    <div className="empty-state">
                      <div className="empty-icon">🔧</div>
                      <div>لا توجد قطع</div>
                    </div>
                  </td></tr>
                ) : filtered.map((p: any) => (
                  <tr key={p.id}>
                    <td><span className="part-number">{p.partNumber}</span></td>
                    <td>
                      <span className={p.type === "أصلي" ? "badge-original" : "badge-commercial"}>
                        {p.type}
                      </span>
                    </td>
                    <td>
                      <span className={`qty-pill ${Number(p.quantity) === 0 ? "qty-zero" : ""}`}>
                        {p.quantity}
                      </span>
                    </td>
                    <td>{p.price} ر.س</td>
                    <td>{p.companyPrice} ر.س</td>
                    <td>{p.storeName || getStoreName(p.storeId) || "—"}</td>
                    <td>{getStoreCity(p.storeId)}</td>
                    <td>{getStoreAddress(p.storeId)}</td>
                    <td>{fmtDate(p.updatedAt || p.lastSync || p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
