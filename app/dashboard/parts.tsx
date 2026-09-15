"use client";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL + "/api";
const PAGE_SIZE = 100;

export default function PartsPage() {
  const [parts, setParts]     = useState<any[]>([]);
  const [stores, setStores]   = useState<any[]>([]);
  const [search, setSearch]   = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage]       = useState(1);
  const [total, setTotal]     = useState(0);
  const [originalCount, setOriginalCount] = useState(0);
  const [commercialCount, setCommercialCount] = useState(0);
  const [audit, setAudit]     = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const loadStores = async () => {
    try {
      const storesRes = await fetch(`${API}/stores`, { headers: token() });
      setStores(await storesRes.json());
    } catch {}
  };

  const loadParts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
      if (debouncedSearch) params.set("search", debouncedSearch);

      const partsRes = await fetch(`${API}/parts?${params.toString()}`, { headers: token() });
      const partsData = await partsRes.json();
      setParts(partsData.data ?? []);
      setTotal(partsData.total ?? 0);
      setOriginalCount(partsData.originalCount ?? 0);
      setCommercialCount(partsData.commercialCount ?? 0);
    } catch {}
    setLoading(false);
  };

  const loadAudit = async () => {
    try {
      const res = await fetch(`${API}/parts/audit`, { headers: token() });
      if (res.ok) setAudit(await res.json());
    } catch {}
  };

  useEffect(() => { loadStores(); loadAudit(); }, []);
  useEffect(() => { loadParts(); }, [page, debouncedSearch]);

  // debounce: بعد توقف الكتابة، نطبّق البحث ونرجع لأول صفحة تلقائياً.
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search.trim());
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

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

  const totalParts      = total;
  const totalOriginal   = originalCount;
  const totalCommercial = commercialCount;

  const totalPages  = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart  = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd    = Math.min(page * PAGE_SIZE, total);

  return (
    <>
      <style>{`
        .parts-wrap { direction: rtl; }
        .parts-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 22px; }
        .parts-title { font-size: 1.28rem; font-weight: 800; color: var(--nl-text); }
        .parts-sub { font-size: 0.82rem; color: var(--nl-muted); margin-top: 3px; max-width: 640px; }
        .readonly-badge { display: flex; align-items: center; gap: 8px; padding: 9px 16px; background: #faf6f0; color: var(--nl-muted); border-radius: 999px; font-size: 0.8rem; font-weight: 700; border: 1px solid var(--nl-line); }
        .parts-stats { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
        .parts-stat { display: flex; align-items: center; gap: 12px; background: var(--nl-card); border-radius: 16px; padding: 14px 16px; flex: 1; min-width: 160px; border: 1px solid var(--nl-line); box-shadow: var(--nl-shadow); }
        .parts-stat-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; }
        .parts-stat-num { font-size: 1.25rem; font-weight: 800; }
        .parts-stat-lbl { font-size: 0.74rem; color: var(--nl-muted); }
        .search-bar { display: flex; align-items: center; gap: 10px; background: var(--nl-card); border-radius: 14px; padding: 12px 16px; margin-bottom: 16px; border: 1px solid var(--nl-line); box-shadow: var(--nl-shadow); }
        .search-bar input { border: none; outline: none; flex: 1; font-family: inherit; font-size: 0.88rem; direction: rtl; background: transparent; }
        .parts-table-card { background: var(--nl-card); border-radius: 18px; overflow: hidden; border: 1px solid var(--nl-line); box-shadow: var(--nl-shadow); }
        .parts-table-head { padding: 16px 20px; font-weight: 800; color: var(--nl-text); border-bottom: 1px solid var(--nl-line); display: flex; justify-content: space-between; align-items: center; }
        .parts-table-wrap { overflow-x: auto; }
        .parts-table { width: 100%; border-collapse: collapse; }
        .parts-table th { padding: 12px 16px; text-align: right; font-size: 0.74rem; color: var(--nl-muted); font-weight: 700; background: #faf6f0; white-space: nowrap; }
        .parts-table td { padding: 13px 16px; border-top: 1px solid #f3eee6; font-size: 0.85rem; white-space: nowrap; }
        .parts-table tbody tr:hover { background: #fbf7f1; }
        .part-number { font-family: ui-monospace, monospace; font-size: 0.88rem; font-weight: 700; color: var(--nl-text); background: #f4ead8; padding: 3px 8px; border-radius: 6px; }
        .badge-original   { background: var(--nl-ok-bg); color: var(--nl-ok); padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .badge-commercial { background: var(--nl-warn-bg); color: var(--nl-warn); padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .qty-pill { font-weight: 700; color: var(--nl-text); }
        .qty-zero { color: var(--nl-bad); }
        .empty-state { text-align: center; padding: 40px; color: var(--nl-muted); }
        .empty-icon { font-size: 2.5rem; margin-bottom: 10px; }
        .last-sync { font-size: 0.78rem; color: var(--nl-muted); }
        .parts-pagination { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 16px 20px; border-top: 1px solid var(--nl-line); }
        .parts-pagination button { font-family: inherit; font-size: 0.85rem; font-weight: 700; padding: 8px 18px; border-radius: 10px; border: 1px solid var(--nl-line); background: #faf6f0; color: var(--nl-text); cursor: pointer; }
        .parts-pagination button:disabled { opacity: 0.4; cursor: not-allowed; }
        .parts-pagination span { font-size: 0.82rem; color: var(--nl-muted); }
      `}</style>

      <div className="parts-wrap">
        <div className="parts-header">
          <div>
            <div className="parts-title">🔧 إدارة القطع</div>
            <div className="parts-sub">إجمالي القطع: {total} — البيانات تُجمع تلقائياً من المحلات. الأرقام أدناه من السيرفر وليست من الصفحة الحالية.</div>
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

        {audit && (
          <div className="parts-stats" style={{ marginBottom: 16 }}>
            {[
              { label: "متوفرة (كمية > 0)", value: audit.inStock ?? 0, icon: "📦" },
              { label: "نافدة (كمية 0)", value: audit.outOfStock ?? 0, icon: "📭" },
              { label: "قابلة للبحث في التطبيق", value: audit.searchableInStoreApp ?? 0, icon: "🔎" },
              { label: "مكررة بنفس المحل", value: audit.duplicateExtraRows ?? 0, icon: "📑" },
              { label: "غير مرتبطة بمحل", value: audit.orphanRecords ?? 0, icon: "⚠" },
              { label: "على محلات متوقفة", value: audit.onInactiveStores ?? 0, icon: "⏸" },
            ].map(s => (
              <div className="parts-stat" key={s.label}>
                <div className="parts-stat-icon" style={{ background: "#f8fafc" }}>{s.icon}</div>
                <div>
                  <div className="parts-stat-num">{s.value}</div>
                  <div className="parts-stat-lbl">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

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
            <span className="last-sync">عرض {rangeStart}-{rangeEnd} من {total}</span>
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
                ) : parts.length === 0 ? (
                  <tr><td colSpan={9}>
                    <div className="empty-state">
                      <div className="empty-icon">🔧</div>
                      <div>لا توجد قطع</div>
                    </div>
                  </td></tr>
                ) : parts.map((p: any) => (
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
          <div className="parts-pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>السابق</button>
            <span>صفحة {page} من {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>التالي</button>
          </div>
        </div>
      </div>
    </>
  );
}
