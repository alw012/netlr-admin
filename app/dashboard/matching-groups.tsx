"use client";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL + "/api";

const MG_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');
  .mg-wrap { font-family: 'Cairo', sans-serif; direction: rtl; }
  .mg-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
  .mg-title { font-size: 1.4rem; font-weight: 800; color: #0f172a; }
  .mg-sub   { font-size: 0.8rem; color: #94a3b8; margin-top: 2px; }
  .btn-add { display: flex; align-items: center; gap: 8px; padding: 11px 22px; background: linear-gradient(135deg, #1d4ed8, #2563eb); color: white; border: none; border-radius: 12px; font-size: 0.88rem; font-weight: 700; font-family: 'Cairo', sans-serif; cursor: pointer; box-shadow: 0 4px 14px rgba(37,99,235,0.35); transition: all 0.2s; white-space: nowrap; }
  .btn-add:hover { transform: translateY(-1px); }
  .mg-search-bar { background: white; border-radius: 14px; padding: 14px 18px; margin-bottom: 18px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .mg-search-bar input { flex: 1; border: none; outline: none; font-size: 0.88rem; font-family: 'Cairo', sans-serif; color: #334155; background: transparent; direction: rtl; }
  .mg-search-bar input::placeholder { color: #cbd5e1; }
  .mg-search-icon { color: #94a3b8; font-size: 1rem; }
  .mg-search-result { margin-top: -6px; margin-bottom: 18px; padding: 12px 18px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; }
  .mg-search-found { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; display: flex; align-items: center; justify-content: space-between; }
  .mg-search-notfound { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .mg-link-btn { background: none; border: none; color: #1d4ed8; font-weight: 700; cursor: pointer; font-family: 'Cairo', sans-serif; font-size: 0.85rem; text-decoration: underline; }
  .mg-table-card { background: white; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .mg-table-head { padding: 16px 22px; border-bottom: 1px solid #f1f5f9; font-weight: 700; font-size: 0.88rem; color: #0f172a; display: flex; align-items: center; gap: 8px; }
  .mg-table-head::before { content: ''; width: 4px; height: 18px; background: linear-gradient(135deg, #1d4ed8, #06b6d4); border-radius: 2px; }
  .mg-table-scroll { overflow-x: auto; }
  .mg-table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
  .mg-table thead tr { background: #f8fafc; }
  .mg-table th { padding: 11px 18px; text-align: right; color: #64748b; font-weight: 600; font-size: 0.75rem; font-family: 'Cairo', sans-serif; }
  .mg-table td { padding: 13px 18px; color: #334155; border-bottom: 1px solid #f8fafc; font-family: 'Cairo', sans-serif; }
  .mg-table tbody tr:hover { background: #f8fafc; }
  .mg-table tbody tr:last-child td { border-bottom: none; }
  .mg-numbers-preview { color: #64748b; font-size: 0.78rem; direction: ltr; text-align: right; }
  .mg-count-badge { background: #eef2ff; color: #4f46e5; padding: 3px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
  .action-btns { display: flex; gap: 6px; flex-wrap: wrap; }
  .btn-edit { padding: 6px 14px; border-radius: 8px; background: #eff6ff; color: #2563eb; border: none; cursor: pointer; font-size: 0.75rem; font-family: 'Cairo', sans-serif; font-weight: 600; }
  .btn-del  { padding: 6px 14px; border-radius: 8px; background: #fef2f2; color: #dc2626; border: none; cursor: pointer; font-size: 0.75rem; font-family: 'Cairo', sans-serif; font-weight: 600; }
  .empty-state { text-align: center; padding: 60px 20px; color: #94a3b8; font-size: 0.88rem; }
  .empty-icon { font-size: 2.5rem; margin-bottom: 10px; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
  .modal-box { background: white; border-radius: 20px; padding: 32px; width: 560px; max-width: 92vw; box-shadow: 0 24px 80px rgba(0,0,0,0.25); animation: modalIn 0.25s ease; max-height: 88vh; overflow-y: auto; }
  @keyframes modalIn { from { opacity:0; transform: scale(0.95) translateY(10px); } to { opacity:1; transform: scale(1) translateY(0); } }
  .modal-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 22px; display: flex; align-items: center; gap: 8px; }
  .modal-title::before { content: ''; width: 4px; height: 20px; background: linear-gradient(135deg, #1d4ed8, #06b6d4); border-radius: 2px; }
  .modal-field { margin-bottom: 14px; }
  .modal-field label { display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 5px; }
  .modal-field input, .modal-field textarea { width: 100%; padding: 10px 14px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 0.85rem; font-family: 'Cairo', sans-serif; color: #1e293b; outline: none; transition: border-color 0.2s; box-sizing: border-box; direction: rtl; background: white; }
  .modal-field textarea { direction: ltr; text-align: right; font-family: 'Cairo', sans-serif; resize: vertical; min-height: 90px; line-height: 1.6; }
  .modal-field input:focus, .modal-field textarea:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  .modal-hint { font-size: 0.72rem; color: #94a3b8; margin-top: 4px; }
  .modal-section { background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 14px; border: 1px solid #e2e8f0; }
  .modal-section-title { font-size: 0.78rem; font-weight: 700; color: #374151; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
  .modal-actions { display: flex; gap: 10px; margin-top: 6px; }
  .btn-save { flex: 1; padding: 12px; border-radius: 12px; border: none; cursor: pointer; background: linear-gradient(135deg, #1d4ed8, #2563eb); color: white; font-size: 0.9rem; font-weight: 700; font-family: 'Cairo', sans-serif; box-shadow: 0 4px 14px rgba(37,99,235,0.35); transition: all 0.2s; }
  .btn-save:disabled { opacity: 0.7; cursor: not-allowed; }
  .btn-cancel { padding: 12px 20px; border-radius: 12px; border: 1.5px solid #e2e8f0; cursor: pointer; background: #f8fafc; color: #64748b; font-size: 0.9rem; font-family: 'Cairo', sans-serif; }
  .msg { padding: 10px 16px; border-radius: 10px; margin-bottom: 16px; font-size: 0.82rem; font-weight: 600; }
  .msg-error   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .msg-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
  .mg-numlist { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 14px; max-height: 220px; overflow-y: auto; }
  .mg-numrow { display: flex; align-items: center; justify-content: space-between; padding: 9px 14px; border-bottom: 1px solid #f1f5f9; background: white; }
  .mg-numrow:last-child { border-bottom: none; }
  .mg-numrow-text { font-family: 'Cairo', sans-serif; direction: ltr; text-align: right; font-size: 0.85rem; color: #1e293b; }
  .mg-numrow-actions { display: flex; gap: 4px; }
  .mg-icon-btn { border: none; background: none; cursor: pointer; font-size: 0.85rem; padding: 3px 6px; border-radius: 6px; }
  .mg-icon-btn:hover { background: #f1f5f9; }
  .mg-inline-edit { display: flex; gap: 6px; flex: 1; }
  .mg-inline-edit input { flex: 1; padding: 5px 10px; border-radius: 6px; border: 1.5px solid #2563eb; font-size: 0.85rem; direction: ltr; text-align: right; font-family: 'Cairo', sans-serif; }
  .mg-result-box { border-radius: 10px; padding: 10px 14px; margin-bottom: 14px; font-size: 0.78rem; }
  .mg-result-added { color: #16a34a; margin-bottom: 4px; }
  .mg-result-rejected { color: #dc2626; }
  .mg-result-rejected div { margin-top: 2px; }
`;

const REASON_LABELS: Record<string, string> = {
  invalid_length: "طول الرقم غير صالح",
  invalid_characters: "يحتوي على رموز غير مسموحة",
  too_short_after_normalization: "الرقم قصير جداً",
  duplicate_in_request: "مكرر داخل القائمة الملصوقة",
  duplicate_in_group: "موجود مسبقاً بهذه المجموعة",
  already_in_another_group: "ينتمي لمجموعة أخرى بالفعل",
  group_full: "المجموعة وصلت الحد الأقصى (300 رقم)",
};

function parseNumbers(text: string): string[] {
  return text
    .split(/[\n,]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

export default function MatchingGroupsPage() {
  const [groups, setGroups]     = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [msg, setMsg]           = useState<{ type: "error" | "success"; text: string } | null>(null);

  const [searchTerm, setSearchTerm]     = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchNotFound, setSearchNotFound] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editGroup, setEditGroup] = useState<any>(null);   // null = creating new
  const [groupName, setGroupName] = useState("");
  const [numbers, setNumbers]     = useState<any[]>([]);   // numbers of the group being edited
  const [bulkText, setBulkText]   = useState("");
  const [saving, setSaving]       = useState(false);
  const [addResult, setAddResult] = useState<{ added: string[]; rejected: any[] } | null>(null);

  const [editingNumberId, setEditingNumberId]     = useState<number | null>(null);
  const [editingNumberValue, setEditingNumberValue] = useState("");

  const token = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/matchinggroups?pageSize=200`, { headers: token() });
      const data = await res.json();
      setGroups(data.data ?? []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const runSearch = async () => {
    setSearchResult(null);
    setSearchNotFound(false);
    const term = searchTerm.trim();
    if (!term) return;
    try {
      const res = await fetch(`${API}/matchinggroups/search?number=${encodeURIComponent(term)}`, { headers: token() });
      if (res.ok) {
        const data = await res.json();
        setSearchResult(data);
      } else {
        setSearchNotFound(true);
      }
    } catch {
      setSearchNotFound(true);
    }
  };

  const openAdd = () => {
    setEditGroup(null);
    setGroupName("");
    setNumbers([]);
    setBulkText("");
    setAddResult(null);
    setMsg(null);
    setShowModal(true);
  };

  // يعيد تحميل اسم/أرقام المجموعة فقط — بلا لمس addResult/msg، حتى تبقى
  // رسالة نتيجة آخر عملية (إضافة/رفض) ظاهرة بعد التحديث لا تُمسَح فوراً.
  const refreshGroupNumbers = async (id: number) => {
    const res = await fetch(`${API}/matchinggroups/${id}?pageSize=500`, { headers: token() });
    const data = await res.json();
    setEditGroup({ id: data.id });
    setGroupName(data.name ?? "");
    setNumbers(data.numbers ?? []);
  };

  const openEdit = async (id: number) => {
    setMsg(null);
    setAddResult(null);
    setBulkText("");
    try {
      await refreshGroupNumbers(id);
      setShowModal(true);
    } catch {
      setMsg({ type: "error", text: "تعذر تحميل بيانات المجموعة" });
    }
  };

  const saveGroupName = async () => {
    setSaving(true);
    try {
      if (!editGroup) {
        // إنشاء مجموعة جديدة + أرقامها الأولية معاً باستدعاء واحد
        const initial = parseNumbers(bulkText);
        const res = await fetch(`${API}/matchinggroups`, {
          method: "POST",
          headers: { ...token(), "Content-Type": "application/json" },
          body: JSON.stringify({ name: groupName || null, numbers: initial }),
        });
        const data = await res.json();
        if (res.ok) {
          setEditGroup({ id: data.id });
          setAddResult({ added: data.added ?? [], rejected: data.rejected ?? [] });
          setBulkText("");
          await refreshGroupNumbers(data.id);
          setMsg({ type: "success", text: "تم إنشاء المجموعة ✓" });
          load();
        } else {
          setMsg({ type: "error", text: data.message || "حدث خطأ" });
        }
      } else {
        // تعديل الاسم فقط لمجموعة موجودة
        const res = await fetch(`${API}/matchinggroups/${editGroup.id}`, {
          method: "PUT",
          headers: { ...token(), "Content-Type": "application/json" },
          body: JSON.stringify({ name: groupName || null }),
        });
        if (res.ok) {
          setMsg({ type: "success", text: "تم حفظ الاسم ✓" });
          load();
        } else {
          const data = await res.json();
          setMsg({ type: "error", text: data.message || "حدث خطأ" });
        }
      }
    } catch {
      setMsg({ type: "error", text: "تعذر الاتصال بالسيرفر" });
    }
    setSaving(false);
  };

  const addNumbersToGroup = async () => {
    if (!editGroup) return;
    const list = parseNumbers(bulkText);
    if (list.length === 0) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/matchinggroups/${editGroup.id}/numbers`, {
        method: "POST",
        headers: { ...token(), "Content-Type": "application/json" },
        body: JSON.stringify({ numbers: list }),
      });
      const data = await res.json();
      setAddResult({ added: data.added ?? [], rejected: data.rejected ?? [] });
      setBulkText("");
      await refreshGroupNumbers(editGroup.id);
      load();
    } catch {
      setMsg({ type: "error", text: "تعذر الاتصال بالسيرفر" });
    }
    setSaving(false);
  };

  const startEditNumber = (n: any) => {
    setEditingNumberId(n.id);
    setEditingNumberValue(n.partNumber);
  };

  const saveEditedNumber = async () => {
    if (!editGroup || editingNumberId == null) return;
    try {
      const res = await fetch(`${API}/matchinggroups/${editGroup.id}/numbers/${editingNumberId}`, {
        method: "PUT",
        headers: { ...token(), "Content-Type": "application/json" },
        body: JSON.stringify({ partNumber: editingNumberValue }),
      });
      if (res.ok) {
        setEditingNumberId(null);
        await openEdit(editGroup.id);
      } else {
        const data = await res.json();
        alert(data.message || "تعذر التعديل");
      }
    } catch {
      alert("تعذر الاتصال بالسيرفر");
    }
  };

  const deleteNumber = async (numberId: number) => {
    if (!editGroup) return;
    if (!confirm("حذف هذا الرقم من المجموعة؟")) return;
    await fetch(`${API}/matchinggroups/${editGroup.id}/numbers/${numberId}`, { method: "DELETE", headers: token() });
    await openEdit(editGroup.id);
    load();
  };

  const deleteGroup = async (id: number) => {
    if (!confirm("حذف هذه المجموعة بالكامل؟ سيُحذف كل ما بها من أرقام.")) return;
    await fetch(`${API}/matchinggroups/${id}`, { method: "DELETE", headers: token() });
    load();
    if (searchResult?.groupId === id) setSearchResult(null);
  };

  return (
    <>
      <style>{MG_STYLES}</style>
      <div className="mg-wrap">

        <div className="mg-header">
          <div>
            <div className="mg-title">🔗 مطابقة الأرقام</div>
            <div className="mg-sub">إجمالي المجموعات: {groups.length}</div>
          </div>
          <button className="btn-add" onClick={openAdd}>+ مجموعة جديدة</button>
        </div>

        <div className="mg-search-bar">
          <span className="mg-search-icon">🔍</span>
          <input
            placeholder="ابحث عن مجموعة برقم داخلها..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => e.key === "Enter" && runSearch()}
          />
          <button className="btn-add" style={{ padding: "8px 18px" }} onClick={runSearch}>بحث</button>
        </div>

        {searchResult && (
          <div className="mg-search-result mg-search-found">
            <span>الرقم <b style={{ direction: "ltr", display: "inline-block" }}>{searchResult.matchedNumber}</b> موجود ضمن مجموعة{searchResult.groupName ? ` "${searchResult.groupName}"` : ` #${searchResult.groupId}`}</span>
            <button className="mg-link-btn" onClick={() => openEdit(searchResult.groupId)}>فتح المجموعة</button>
          </div>
        )}
        {searchNotFound && (
          <div className="mg-search-result mg-search-notfound">هذا الرقم غير موجود في أي مجموعة مطابقة</div>
        )}

        <div className="mg-table-card">
          <div className="mg-table-head">قائمة المجموعات</div>
          <div className="mg-table-scroll">
            <table className="mg-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>الاسم</th>
                  <th>عدد الأرقام</th>
                  <th>آخر تعديل</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5}><div className="empty-state">جاري التحميل...</div></td></tr>
                ) : groups.length === 0 ? (
                  <tr><td colSpan={5}><div className="empty-state"><div className="empty-icon">🔗</div><div>لا توجد مجموعات مطابقة بعد</div></div></td></tr>
                ) : groups.map((g: any, i: number) => (
                  <tr key={g.id}>
                    <td>{i + 1}</td>
                    <td><strong>{g.name || `مجموعة #${g.id}`}</strong></td>
                    <td><span className="mg-count-badge">{g.numberCount} رقم</span></td>
                    <td>{g.updatedAt ? new Date(g.updatedAt).toLocaleString("ar-SA") : new Date(g.createdAt).toLocaleString("ar-SA")}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => openEdit(g.id)}>فتح</button>
                        <button className="btn-del" onClick={() => deleteGroup(g.id)}>حذف</button>
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
              <div className="modal-title">{editGroup ? "🔗 تعديل مجموعة مطابقة" : "➕ مجموعة مطابقة جديدة"}</div>

              {msg && <div className={`msg msg-${msg.type}`}>{msg.text}</div>}

              <div className="modal-field">
                <label>اسم المجموعة (اختياري)</label>
                <input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="مثال: فلتر زيت تويوتا"/>
              </div>

              {editGroup && numbers.length > 0 && (
                <div className="modal-section">
                  <div className="modal-section-title">الأرقام الحالية ({numbers.length})</div>
                  <div className="mg-numlist">
                    {numbers.map((n: any) => (
                      <div className="mg-numrow" key={n.id}>
                        {editingNumberId === n.id ? (
                          <div className="mg-inline-edit">
                            <input
                              value={editingNumberValue}
                              onChange={e => setEditingNumberValue(e.target.value)}
                              onKeyDown={e => e.key === "Enter" && saveEditedNumber()}
                              autoFocus
                            />
                            <button className="mg-icon-btn" onClick={saveEditedNumber}>✓</button>
                            <button className="mg-icon-btn" onClick={() => setEditingNumberId(null)}>✕</button>
                          </div>
                        ) : (
                          <>
                            <span className="mg-numrow-text">{n.partNumber}</span>
                            <div className="mg-numrow-actions">
                              <button className="mg-icon-btn" title="تعديل" onClick={() => startEditNumber(n)}>✏️</button>
                              <button className="mg-icon-btn" title="حذف" onClick={() => deleteNumber(n.id)}>🗑️</button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-field">
                <label>{editGroup ? "إضافة أرقام جديدة" : "الأرقام (اختياري الآن، يمكن إضافتها لاحقاً)"}</label>
                <textarea
                  value={bulkText}
                  onChange={e => setBulkText(e.target.value)}
                  placeholder={"رقم بكل سطر، مثال:\n16400-17380\n16400-0V180\n16400-17390"}
                />
                <div className="modal-hint">رقم واحد بكل سطر، أو مفصولة بفواصل. لصق دفعة كاملة مدعوم.</div>
              </div>

              {addResult && (
                <div className="mg-result-box">
                  {addResult.added.length > 0 && (
                    <div className="mg-result-added">✓ أُضيف {addResult.added.length}: {addResult.added.join(", ")}</div>
                  )}
                  {addResult.rejected.length > 0 && (
                    <div className="mg-result-rejected">
                      ✕ رُفض {addResult.rejected.length}:
                      {addResult.rejected.map((r: any, i: number) => (
                        <div key={i}>{r.number} — {REASON_LABELS[r.reason] || r.reason}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="modal-actions">
                {editGroup ? (
                  <>
                    <button className="btn-save" onClick={saveGroupName} disabled={saving}>
                      {saving ? "جاري الحفظ..." : "حفظ الاسم"}
                    </button>
                    <button className="btn-save" onClick={addNumbersToGroup} disabled={saving || parseNumbers(bulkText).length === 0}>
                      إضافة الأرقام
                    </button>
                  </>
                ) : (
                  <button className="btn-save" onClick={saveGroupName} disabled={saving}>
                    {saving ? "جاري الإنشاء..." : "إنشاء المجموعة"}
                  </button>
                )}
                <button className="btn-cancel" onClick={() => setShowModal(false)}>إغلاق</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
