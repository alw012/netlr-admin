"use client";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL + "/api";

function formatDeviceName(name?: string | null) {
  const n = (name ?? "").trim();
  if (!n) return "—";
  if (n.toUpperCase().startsWith("PC ")) return "PC" + n.slice(3).trim();
  return n;
}

const SHOPS_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');
  .shops-wrap { font-family: 'Cairo', sans-serif; direction: rtl; }
  .shops-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
  .shops-title { font-size: 1.4rem; font-weight: 800; color: #0f172a; }
  .shops-sub   { font-size: 0.8rem; color: #94a3b8; margin-top: 2px; }
  .btn-add { display: flex; align-items: center; gap: 8px; padding: 11px 22px; background: linear-gradient(135deg, #1d4ed8, #2563eb); color: white; border: none; border-radius: 12px; font-size: 0.88rem; font-weight: 700; font-family: 'Cairo', sans-serif; cursor: pointer; box-shadow: 0 4px 14px rgba(37,99,235,0.35); transition: all 0.2s; white-space: nowrap; }
  .btn-add:hover { transform: translateY(-1px); }
  .shops-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 24px; }
  .shops-stat { background: white; border-radius: 14px; padding: 18px 20px; display: flex; align-items: center; gap: 14px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .shops-stat-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
  .shops-stat-num { font-size: 1.4rem; font-weight: 800; color: #0f172a; }
  .shops-stat-lbl { font-size: 0.75rem; color: #64748b; }
  .search-bar { background: white; border-radius: 14px; padding: 14px 18px; margin-bottom: 18px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .search-bar input { flex: 1; border: none; outline: none; font-size: 0.88rem; font-family: 'Cairo', sans-serif; color: #334155; background: transparent; direction: rtl; }
  .search-bar input::placeholder { color: #cbd5e1; }
  .search-icon { color: #94a3b8; font-size: 1rem; }
  .shops-table-card { background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .shops-table-head { padding: 16px 22px; border-bottom: 1px solid #f1f5f9; font-weight: 700; font-size: 0.88rem; color: #0f172a; display: flex; align-items: center; gap: 8px; }
  .shops-table-head::before { content: ''; width: 4px; height: 18px; background: linear-gradient(135deg, #1d4ed8, #06b6d4); border-radius: 2px; }
  .shops-table-scroll { overflow-x: auto; }
  .shops-table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
  .shops-table thead tr { background: #f8fafc; }
  .shops-table th { padding: 11px 18px; text-align: right; color: #64748b; font-weight: 600; font-size: 0.75rem; font-family: 'Cairo', sans-serif; }
  .shops-table td { padding: 13px 18px; color: #334155; border-bottom: 1px solid #f8fafc; font-family: 'Cairo', sans-serif; }
  .shops-table tbody tr:hover { background: #f8fafc; }
  .shops-table tbody tr:last-child td { border-bottom: none; }
  .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; }
  .badge-active   { background: #d1fae5; color: #059669; }
  .badge-inactive { background: #fee2e2; color: #dc2626; }
  .action-btns { display: flex; gap: 6px; flex-wrap: wrap; }
  .btn-edit { padding: 6px 14px; border-radius: 8px; background: #eff6ff; color: #2563eb; border: none; cursor: pointer; font-size: 0.75rem; font-family: 'Cairo', sans-serif; font-weight: 600; }
  .btn-del  { padding: 6px 14px; border-radius: 8px; background: #fef2f2; color: #dc2626; border: none; cursor: pointer; font-size: 0.75rem; font-family: 'Cairo', sans-serif; font-weight: 600; }
  .btn-toggle { padding: 6px 14px; border-radius: 8px; background: #f0fdf4; color: #16a34a; border: none; cursor: pointer; font-size: 0.75rem; font-family: 'Cairo', sans-serif; font-weight: 600; }
  .btn-toggle-off { background: #fff7ed; color: #ea580c; }
  .empty-state { text-align: center; padding: 60px 20px; color: #94a3b8; font-size: 0.88rem; }
  .empty-icon { font-size: 2.5rem; margin-bottom: 10px; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
  .modal-box { background: white; border-radius: 20px; padding: 32px; width: 520px; max-width: 90vw; box-shadow: 0 24px 80px rgba(0,0,0,0.25); animation: modalIn 0.25s ease; max-height: 90vh; overflow-y: auto; }
  @keyframes modalIn { from { opacity:0; transform: scale(0.95) translateY(10px); } to { opacity:1; transform: scale(1) translateY(0); } }
  .modal-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 22px; display: flex; align-items: center; gap: 8px; }
  .modal-title::before { content: ''; width: 4px; height: 20px; background: linear-gradient(135deg, #1d4ed8, #06b6d4); border-radius: 2px; }
  .modal-field { margin-bottom: 14px; }
  .modal-field label { display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 5px; }
  .modal-field input, .modal-field select { width: 100%; padding: 10px 14px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 0.85rem; font-family: 'Cairo', sans-serif; color: #1e293b; outline: none; transition: border-color 0.2s; box-sizing: border-box; direction: rtl; background: white; }
  .modal-field input:focus, .modal-field select:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  .modal-section { background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 14px; border: 1px solid #e2e8f0; }
  .modal-section-title { font-size: 0.78rem; font-weight: 700; color: #374151; margin-bottom: 12px; }
  .modal-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .modal-actions { display: flex; gap: 10px; margin-top: 6px; }
  .btn-save { flex: 1; padding: 12px; border-radius: 12px; border: none; cursor: pointer; background: linear-gradient(135deg, #1d4ed8, #2563eb); color: white; font-size: 0.9rem; font-weight: 700; font-family: 'Cairo', sans-serif; box-shadow: 0 4px 14px rgba(37,99,235,0.35); transition: all 0.2s; }
  .btn-save:disabled { opacity: 0.7; cursor: not-allowed; }
  .btn-cancel { padding: 12px 20px; border-radius: 12px; border: 1.5px solid #e2e8f0; cursor: pointer; background: #f8fafc; color: #64748b; font-size: 0.9rem; font-family: 'Cairo', sans-serif; }
  .msg { padding: 10px 16px; border-radius: 10px; margin-bottom: 16px; font-size: 0.82rem; font-weight: 600; }
  .msg-error   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .msg-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
  .btn-pairing { padding: 6px 14px; border-radius: 8px; background: #eef2ff; color: #4f46e5; border: none; cursor: pointer; font-size: 0.75rem; font-family: 'Cairo', sans-serif; font-weight: 600; }
  .pairing-loading { text-align: center; padding: 30px 0; color: #64748b; font-size: 0.9rem; }
  .pairing-code { font-size: 2.6rem; font-weight: 800; letter-spacing: 4px; text-align: center; color: #0f172a; background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 14px; padding: 18px 10px; margin: 18px 0 10px; direction: ltr; }
  .pairing-expiry { text-align: center; font-size: 0.85rem; color: #64748b; margin-bottom: 18px; }
  .btn-copy { width: 100%; padding: 12px; border-radius: 12px; border: none; cursor: pointer; background: linear-gradient(135deg, #1d4ed8, #06b6d4); color: white; font-size: 0.9rem; font-weight: 700; font-family: 'Cairo', sans-serif; box-shadow: 0 4px 14px rgba(37,99,235,0.35); transition: all 0.2s; }
`;

const EMPTY_FORM = {
  name: "", city: "", phone: "", phone2: "",
  address: "", email: "", location: "",
  maxDevices: 5, shopCode: ""
};

function silentShopCredentials() {
  const n = Math.floor(Math.random() * 1e9).toString().padStart(9, "0");
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let password = "";
  for (let i = 0; i < 16; i++) password += chars[Math.floor(Math.random() * chars.length)];
  return { username: `shop${n}`, password };
}

export default function ShopsPage() {
  const [shops, setShops]         = useState<any[]>([]);
  const [filtered, setFiltered]   = useState<any[]>([]);
  const [search, setSearch]       = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editShop, setEditShop]   = useState<any>(null);
  const [form, setForm]           = useState<any>({ ...EMPTY_FORM });
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState<{ type: "error"|"success"; text: string } | null>(null);
  const [pairingModal, setPairingModal] = useState<{ shop: any; loading: boolean; code?: string; expiresAt?: string; error?: string; used?: number; max?: number } | null>(null);
  const [copied, setCopied]       = useState(false);
  const [justCreated, setJustCreated] = useState(false);
  const [devicesModal, setDevicesModal] = useState<{ shop: any; devices: any[]; loading: boolean } | null>(null);

  const token = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const load = () => {
    fetch(`${API}/stores`, { headers: token() })
      .then(r => r.json())
      .then(d => { setShops(d); setFiltered(d); })
      .catch(() => {});
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(shops.filter(s =>
      s.name?.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q) || s.shopCode?.toLowerCase().includes(q)
    ));
  }, [search, shops]);

  const openAdd = () => {
    setEditShop(null);
    setJustCreated(false);
    setForm({ ...EMPTY_FORM });
    setMsg(null);
    setShowModal(true);
  };

  const openEdit = async (s: any) => {
    setEditShop(s);
    setJustCreated(false);
    try {
      const res = await fetch(`${API}/stores/${s.id}`, { headers: token() });
      const data = await res.json();
      setForm({
        name: data.name || "",
        city: data.city || "",
        phone: data.phone || "",
        phone2: data.phone2 || "",
        address: data.address || "",
        email: data.email || "",
        location: data.location || "",
        maxDevices: data.maxDevices || 10,
        shopCode: data.shopCode || "",
      });
    } catch {
      setForm({
        name: s.name || "", city: s.city || "", phone: s.phone || "",
        phone2: s.phone2 || "", address: s.address || "",
        email: s.email || "", location: s.location || "",
        maxDevices: s.maxDevices || 10, shopCode: s.shopCode || "",
      });
    }
    setMsg(null);
    setShowModal(true);
  };

  const save = async () => {
    if (!form.name || !form.city || !form.phone) {
      setMsg({ type: "error", text: "يرجى تعبئة الحقول المطلوبة *" });
      return;
    }
    if (!form.maxDevices || form.maxDevices < 1) {
      setMsg({ type: "error", text: "حدد عدد الأجهزة المسموح بها لهذا المحل" });
      return;
    }
    setSaving(true);
    try {
      const method = editShop ? "PUT" : "POST";
      const url    = editShop ? `${API}/stores/${editShop.id}` : `${API}/stores`;
      const creds = editShop ? {} : silentShopCredentials();
      const payload = {
        name: form.name.trim(),
        city: form.city.trim(),
        phone: form.phone.trim(),
        phone2: form.phone2?.trim() || null,
        email: form.email?.trim() || null,
        address: form.address?.trim() || null,
        location: form.location?.trim() || null,
        maxDevices: form.maxDevices,
        ...creds,
      };
      const res    = await fetch(url, {
        method,
        headers: { ...token(), "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const code = data.shopCode || form.shopCode;
        if (!editShop) {
          setForm({ ...form, shopCode: code || "" });
          setJustCreated(true);
          setMsg({ type: "success", text: `تم إضافة المحل ✓  كود التفعيل: ${code || ""} — مربوط بهذا المحل فقط، حتى ${form.maxDevices} أجهزة` });
        } else {
          setMsg({ type: "success", text: "تم تعديل المحل بنجاح ✓" });
          setTimeout(() => setShowModal(false), 800);
        }
        load();
      } else {
        setMsg({ type: "error", text: data.message || "حدث خطأ" });
      }
    } catch {
      setMsg({ type: "error", text: "تعذر الاتصال بالسيرفر" });
    }
    setSaving(false);
  };

  const deleteShop = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المحل؟ سيتم حذف حساب المستخدم أيضاً.")) return;
    await fetch(`${API}/stores/${id}`, { method: "DELETE", headers: token() });
    load();
  };

  const toggleActive = async (s: any) => {
    await fetch(`${API}/stores/${s.id}/toggle-status`, { method: "PUT", headers: token() });
    load();
  };

  const showActivationCode = async (s: any) => {
    setCopied(false);
    setPairingModal({
      shop: s,
      loading: false,
      code: s.shopCode,
      used: s.deviceCount || 0,
      max: s.maxDevices,
    });
  };

  const copyCode = () => {
    const code = pairingModal?.code || form.shopCode;
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const openShopDevices = async (s: any) => {
    setDevicesModal({ shop: s, devices: [], loading: true });
    try {
      const res = await fetch(`${API}/devices?storeId=${s.id}`, { headers: token() });
      const data = await res.json();
      setDevicesModal({ shop: s, devices: Array.isArray(data) ? data : [], loading: false });
    } catch {
      setDevicesModal({ shop: s, devices: [], loading: false });
    }
  };

  const deleteShopDevice = async (id: number) => {
    if (!confirm("حذف هذا الجهاز يحرّر خانة تفعيل جديدة لهذا المحل. متابعة؟")) return;
    await fetch(`${API}/devices/${id}`, { method: "DELETE", headers: token() });
    if (devicesModal?.shop) await openShopDevices(devicesModal.shop);
    load();
  };

  const total    = shops.length;
  const active   = shops.filter(s => s.isActive).length;
  const inactive = shops.filter(s => !s.isActive).length;

  return (
    <>
      <style>{SHOPS_STYLES}</style>
      <div className="shops-wrap">

        <div className="shops-header">
          <div>
            <div className="shops-title">🏪 إدارة المحلات</div>
            <div className="shops-sub">إجمالي المحلات: {total}</div>
          </div>
          <button className="btn-add" onClick={openAdd}>+ إضافة محل</button>
        </div>

        <div className="shops-stats">
          <div className="shops-stat">
            <div className="shops-stat-icon" style={{ background: "#eff6ff" }}>🏪</div>
            <div><div className="shops-stat-num">{total}</div><div className="shops-stat-lbl">إجمالي المحلات</div></div>
          </div>
          <div className="shops-stat">
            <div className="shops-stat-icon" style={{ background: "#f0fdf4" }}>✅</div>
            <div><div className="shops-stat-num">{active}</div><div className="shops-stat-lbl">المحلات النشطة</div></div>
          </div>
          <div className="shops-stat">
            <div className="shops-stat-icon" style={{ background: "#fef2f2" }}>⛔️</div>
            <div><div className="shops-stat-num">{inactive}</div><div className="shops-stat-lbl">المحلات الموقوفة</div></div>
          </div>
        </div>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input placeholder="ابحث باسم المحل أو المدينة..." value={search} onChange={e => setSearch(e.target.value)}/>
        </div>

        <div className="shops-table-card">
          <div className="shops-table-head">قائمة المحلات</div>
          <div className="shops-table-scroll">
          <table className="shops-table">
            <thead>
              <tr>
                <th>#</th>
                <th>اسم المحل</th>
                <th>كود التفعيل</th>
                <th>المدينة</th>
                <th>العنوان</th>
                <th>الهاتف</th>
                <th>الأجهزة</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9}><div className="empty-state"><div className="empty-icon">🏪</div><div>لا توجد محلات</div></div></td></tr>
              ) : filtered.map((s: any, i: number) => (
                <tr key={s.id}>
                  <td>{i + 1}</td>
                  <td><strong>{s.name}</strong></td>
                  <td>
                    <span className="device-id" style={{ direction: "ltr", display: "inline-block", fontFamily: "monospace", fontWeight: 700 }}>
                      {s.shopCode || "—"}
                    </span>
                    {s.shopCode && (
                      <button className="btn-edit" style={{ marginRight: 8 }} onClick={() => navigator.clipboard.writeText(s.shopCode)}>نسخ</button>
                    )}
                  </td>
                  <td>{s.city || "—"}</td>
                  <td>{s.address || "—"}</td>
                  <td>{s.phone}</td>
                  <td style={{ textAlign: "center" }}>
                    <button className="btn-edit" onClick={() => openShopDevices(s)}>
                      {s.deviceCount || 0} / {s.maxDevices}
                    </button>
                  </td>
                  <td><span className={`badge ${s.isActive ? "badge-active" : "badge-inactive"}`}>{s.isActive ? "نشط" : "موقوف"}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => openEdit(s)}>تعديل</button>
                      <button className={`btn-toggle ${s.isActive ? "btn-toggle-off" : ""}`} onClick={() => toggleActive(s)}>{s.isActive ? "إيقاف" : "تفعيل"}</button>
                      <button className="btn-del" onClick={() => deleteShop(s.id)}>حذف</button>
                      <button className="btn-pairing" onClick={() => showActivationCode(s)}>كود التفعيل</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <div className="modal-title">{editShop ? "✏️ تعديل المحل" : justCreated ? "✓ تم إنشاء المحل" : "➕ إضافة محل جديد"}</div>

              {msg && <div className={`msg msg-${msg.type}`}>{msg.text}</div>}

              <div className="modal-section">
                <div className="modal-section-title">🏪 بيانات المحل</div>
                <div className="modal-field">
                    <label>اسم المحل *</label>
                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="جيل القطع" disabled={justCreated}/>
                </div>
                <div className="modal-row">
                  <div className="modal-field">
                    <label>المدينة *</label>
                    <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="" disabled={justCreated}/>
                  </div>
                  <div className="modal-field">
                    <label>الهاتف *</label>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="" disabled={justCreated}/>
                  </div>
                </div>
                <div className="modal-row">
                  <div className="modal-field">
                    <label>هاتف إضافي</label>
                    <input value={form.phone2} onChange={e => setForm({...form, phone2: e.target.value})} placeholder="" disabled={justCreated}/>
                  </div>
                  <div className="modal-field">
                    <label>البريد الإلكتروني</label>
                    <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="" disabled={justCreated}/>
                  </div>
                </div>
                <div className="modal-field">
                  <label>العنوان</label>
                  <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="" disabled={justCreated}/>
                </div>
                <div className="modal-field">
                  <label>الموقع (رابط)</label>
                  <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="" disabled={justCreated}/>
                </div>
              </div>

              <div className="modal-section">
                <div className="modal-section-title">💻 عدد الأجهزة المسموح بها</div>
                <div className="modal-field">
                  <label>حد الأجهزة لهذا المحل *</label>
                  <input type="number" min="1" max="100" value={form.maxDevices} onChange={e => setForm({...form, maxDevices: parseInt(e.target.value) || 0})} placeholder="5" disabled={justCreated}/>
                  <div className="modal-hint" style={{ fontSize: "0.8rem", color: "#64748b", marginTop: 6 }}>
                    كود التفعيل بعد الإنشاء يعمل لهذا المحل فقط، حتى هذا العدد. حذف جهاز من الإدارة يفتح خانة جديدة.
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <div className="modal-section-title">🔑 كود التفعيل — مربوط بهذا المحل فقط</div>
                {(editShop || justCreated) && form.shopCode ? (
                  <div className="modal-field">
                    <label>يُفعَّل به أجهزة هذا المحل حتى حد {form.maxDevices} أجهزة</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input value={form.shopCode} readOnly style={{ direction: "ltr", textAlign: "left", fontFamily: "monospace", fontWeight: 700, letterSpacing: 1 }} />
                      <button type="button" className="btn-copy" onClick={() => navigator.clipboard.writeText(form.shopCode)}>نسخ</button>
                    </div>
                  </div>
                ) : (
                  <div className="modal-hint" style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    يُنشأ كود التفعيل تلقائياً بعد إضافة المحل، ويكون خاصاً بهذا المحل (مثال: BAA-8472).
                  </div>
                )}
              </div>

              <div className="modal-actions">
                {justCreated ? (
                  <button className="btn-save" onClick={() => setShowModal(false)}>تم</button>
                ) : (
                  <>
                    <button className="btn-save" onClick={save} disabled={saving}>
                      {saving ? "جاري الحفظ..." : editShop ? "حفظ التعديلات" : "إضافة المحل"}
                    </button>
                    <button className="btn-cancel" onClick={() => setShowModal(false)}>إلغاء</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {pairingModal && (
          <div className="modal-overlay" onClick={() => setPairingModal(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()} style={{ width: 420 }}>
              <div className="modal-title">🔑 كود التفعيل — {pairingModal.shop.name}</div>
              {pairingModal.code ? (
                <>
                  <div className="pairing-code">{pairingModal.code}</div>
                  <div className="pairing-expiry">
                    مربوط بالمحل «{pairingModal.shop.name}» فقط. لا يعمل لأي محل آخر.
                    <br />
                    الأجهزة: {pairingModal.used ?? pairingModal.shop.deviceCount ?? 0} / {pairingModal.max ?? pairingModal.shop.maxDevices}
                  </div>
                  <button className="btn-copy" onClick={copyCode}>{copied ? "✓ تم النسخ" : "📋 نسخ الكود"}</button>
                </>
              ) : (
                <div className="msg msg-error">لا يوجد كود تفعيل لهذا المحل</div>
              )}
              <div className="modal-actions" style={{ marginTop: 14 }}>
                <button className="btn-cancel" style={{ width: "100%" }} onClick={() => setPairingModal(null)}>إغلاق</button>
              </div>
            </div>
          </div>
        )}

        {devicesModal && (
          <div className="modal-overlay" onClick={() => setDevicesModal(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()} style={{ width: 640 }}>
              <div className="modal-title">💻 أجهزة {devicesModal.shop.name}</div>
              <div className="pairing-expiry" style={{ textAlign: "right" }}>
                المسجّل {devicesModal.devices.length} / الحد {devicesModal.shop.maxDevices}. حذف جهاز يحرّر خانة تفعيل.
              </div>
              {devicesModal.loading ? (
                <div className="pairing-loading">جاري التحميل...</div>
              ) : devicesModal.devices.length === 0 ? (
                <div className="empty-state"><div>لا توجد أجهزة مسجّلة بعد</div></div>
              ) : (
                <table className="shops-table">
                  <thead>
                    <tr>
                      <th>Device ID</th>
                      <th>User Name</th>
                      <th>الحالة</th>
                      <th>آخر ظهور</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {devicesModal.devices.map((d: any) => (
                      <tr key={d.id}>
                        <td><span className="device-id" style={{ fontFamily: "monospace", fontWeight: 700 }}>{d.deviceId}</span></td>
                        <td style={{ direction: "ltr", textAlign: "left", fontFamily: "monospace", fontWeight: 700 }}>{formatDeviceName(d.name)}</td>
                        <td>{d.isOnline ? "متصل" : "غير متصل"}</td>
                        <td>{d.lastSeen ? new Date(d.lastSeen).toLocaleString("ar") : "—"}</td>
                        <td><button className="btn-del" onClick={() => deleteShopDevice(d.id)}>حذف</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="modal-actions" style={{ marginTop: 14 }}>
                <button className="btn-cancel" style={{ width: "100%" }} onClick={() => setDevicesModal(null)}>إغلاق</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
