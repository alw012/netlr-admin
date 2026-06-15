"use client";
import { useEffect, useState } from "react";

const API = "https://orvix-api-production.up.railway.app/api";

export default function UsersPage() {
  const [users, setUsers]         = useState<any[]>([]);
  const [filtered, setFiltered]   = useState<any[]>([]);
  const [search, setSearch]       = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser]   = useState<any>(null);
  const [form, setForm]           = useState({ username: "", password: "", role: "User", fullName: "" });
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState<{ type: "error"|"success"; text: string } | null>(null);

  const [showPassModal, setShowPassModal] = useState(false);
  const [passUserId, setPassUserId]       = useState<number | null>(null);
  const [passForm, setPassForm]           = useState({ newPassword: "", confirmPassword: "" });
  const [passMsg, setPassMsg]             = useState<{ type: "error"|"success"; text: string } | null>(null);
  const [passSaving, setPassSaving]       = useState(false);

  const token = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const load = () => {
    fetch(`${API}/users`, { headers: token() })
      .then(r => r.json())
      .then(d => { setUsers(d); setFiltered(d); })
      .catch(() => {});
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter(u =>
      u.username?.toLowerCase().includes(q) || u.fullName?.toLowerCase().includes(q)
    ));
  }, [search, users]);

  const openAdd = () => {
    setEditUser(null);
    setForm({ username: "", password: "", role: "User", fullName: "" });
    setMsg(null);
    setShowModal(true);
  };

  const openEdit = (u: any) => {
    setEditUser(u);
    setForm({ username: u.username || "", password: "", role: u.role || "User", fullName: u.fullName || "" });
    setMsg(null);
    setShowModal(true);
  };

  const save = async () => {
    if (!form.username) {
      setMsg({ type: "error", text: "يرجى إدخال اسم المستخدم *" });
      return;
    }
    setSaving(true);
    try {
      const method = editUser ? "PUT" : "POST";
      const url    = editUser ? `${API}/users/${editUser.id}` : `${API}/users`;
      const body   = editUser
        ? { username: form.username, fullName: form.fullName, role: form.role, isActive: true }
        : { username: form.username, password: form.password, fullName: form.fullName || form.username, role: form.role };

      const res = await fetch(url, {
        method,
        headers: { ...token(), "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMsg({ type: "success", text: editUser ? "تم تعديل المستخدم بنجاح ✓" : "تم إضافة المستخدم بنجاح ✓" });
        load();
        setTimeout(() => setShowModal(false), 800);
      } else {
        const err = await res.json();
        setMsg({ type: "error", text: err.message || "حدث خطأ" });
      }
    } catch {
      setMsg({ type: "error", text: "تعذر الاتصال بالسيرفر" });
    }
    setSaving(false);
  };

  const deleteUser = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    await fetch(`${API}/users/${id}`, { method: "DELETE", headers: token() });
    load();
  };

  const toggleStatus = async (u: any) => {
    await fetch(`${API}/users/${u.id}/toggle-status`, { method: "PUT", headers: token() });
    load();
  };

  const changePassword = async () => {
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassMsg({ type: "error", text: "كلمة المرور غير متطابقة" });
      return;
    }
    if (passForm.newPassword.length < 6) {
      setPassMsg({ type: "error", text: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
      return;
    }
    setPassSaving(true);
    try {
      const res = await fetch(`${API}/users/${passUserId}/change-password`, {
        method: "PUT",
        headers: { ...token(), "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: passForm.newPassword }),
      });
      if (res.ok) {
        setPassMsg({ type: "success", text: "تم تغيير كلمة المرور بنجاح ✓" });
        setTimeout(() => setShowPassModal(false), 800);
      } else {
        const err = await res.json();
        setPassMsg({ type: "error", text: err.message || "حدث خطأ" });
      }
    } catch {
      setPassMsg({ type: "error", text: "تعذر الاتصال بالسيرفر" });
    }
    setPassSaving(false);
  };

  const admins  = users.filter(u => u.role === "Admin").length;
  const regular = users.filter(u => u.role !== "Admin").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');
        .users-wrap { font-family: 'Cairo', sans-serif; direction: rtl; }
        .users-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
        .users-title { font-size: 1.4rem; font-weight: 800; color: #0f172a; }
        .users-sub   { font-size: 0.8rem; color: #94a3b8; margin-top: 2px; }
        .btn-add-user { display: flex; align-items: center; gap: 8px; padding: 11px 22px; background: linear-gradient(135deg, #7c3aed, #8b5cf6); color: white; border: none; border-radius: 12px; font-size: 0.88rem; font-weight: 700; font-family: 'Cairo', sans-serif; cursor: pointer; box-shadow: 0 4px 14px rgba(124,58,237,0.35); transition: all 0.2s; }
        .btn-add-user:hover { transform: translateY(-1px); }
        .users-stats { display: flex; gap: 16px; margin-bottom: 24px; }
        .users-stat { display: flex; align-items: center; gap: 12px; background: white; border-radius: 14px; padding: 16px 20px; flex: 1; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
        .users-stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
        .users-stat-num { font-size: 1.4rem; font-weight: 800; }
        .users-stat-lbl { font-size: 0.75rem; color: #94a3b8; }
        .search-bar { display: flex; align-items: center; gap: 10px; background: white; border-radius: 12px; padding: 10px 16px; margin-bottom: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
        .search-bar input { border: none; outline: none; flex: 1; font-family: 'Cairo', sans-serif; font-size: 0.88rem; direction: rtl; }
        .users-table-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
        .users-table-head { padding: 16px 20px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #f1f5f9; }
        .users-table { width: 100%; border-collapse: collapse; }
        .users-table th { padding: 12px 16px; text-align: right; font-size: 0.78rem; color: #94a3b8; font-weight: 600; background: #f8fafc; }
        .users-table td { padding: 14px 16px; border-top: 1px solid #f1f5f9; font-size: 0.85rem; }
        .user-name-cell { display: flex; align-items: center; gap: 10px; }
        .user-avatar { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #7c3aed, #8b5cf6); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; }
        .badge-admin { background: #fffbeb; color: #d97706; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .badge-shop  { background: #eff6ff; color: #2563eb; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .badge-user  { background: #f0fdf4; color: #16a34a; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .badge-active   { background: #f0fdf4; color: #16a34a; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .badge-inactive { background: #fef2f2; color: #dc2626; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; }
        .action-btns { display: flex; gap: 6px; flex-wrap: wrap; }
        .btn-edit   { padding: 5px 12px; border-radius: 8px; border: none; cursor: pointer; background: #eff6ff; color: #2563eb; font-size: 0.78rem; font-weight: 600; font-family: 'Cairo', sans-serif; }
        .btn-toggle { padding: 5px 12px; border-radius: 8px; border: none; cursor: pointer; background: #f0fdf4; color: #16a34a; font-size: 0.78rem; font-weight: 600; font-family: 'Cairo', sans-serif; }
        .btn-toggle-off { background: #fef2f2; color: #dc2626; }
        .btn-del    { padding: 5px 12px; border-radius: 8px; border: none; cursor: pointer; background: #fef2f2; color: #dc2626; font-size: 0.78rem; font-weight: 600; font-family: 'Cairo', sans-serif; }
        .btn-pass   { padding: 5px 12px; border-radius: 8px; border: none; cursor: pointer; background: #fffbeb; color: #d97706; font-size: 0.78rem; font-weight: 600; font-family: 'Cairo', sans-serif; }
        .empty-state { text-align: center; padding: 40px; color: #94a3b8; }
        .empty-icon  { font-size: 2.5rem; margin-bottom: 10px; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
        .modal-box { background: white; border-radius: 20px; padding: 32px; width: 480px; max-width: 90vw; box-shadow: 0 24px 80px rgba(0,0,0,0.25); animation: modalIn 0.25s ease; }
        @keyframes modalIn { from { opacity:0; transform: scale(0.95) translateY(10px); } to { opacity:1; transform: scale(1) translateY(0); } }
        .modal-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 22px; display: flex; align-items: center; gap: 8px; }
        .modal-title::before { content: ''; width: 4px; height: 20px; background: linear-gradient(135deg, #7c3aed, #8b5cf6); border-radius: 2px; }
        .modal-field { margin-bottom: 14px; }
        .modal-field label { display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 5px; }
        .modal-field input, .modal-field select { width: 100%; padding: 10px 14px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 0.85rem; font-family: 'Cairo', sans-serif; color: #1e293b; outline: none; transition: border-color 0.2s; box-sizing: border-box; direction: rtl; background: white; }
        .modal-field input:focus, .modal-field select:focus { border-color: #7c3aed; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
        .modal-field input::placeholder { color: #cbd5e1; }
        .modal-actions { display: flex; gap: 10px; margin-top: 6px; }
        .btn-save { flex: 1; padding: 12px; border-radius: 12px; border: none; cursor: pointer; background: linear-gradient(135deg, #7c3aed, #8b5cf6); color: white; font-size: 0.9rem; font-weight: 700; font-family: 'Cairo', sans-serif; box-shadow: 0 4px 14px rgba(124,58,237,0.35); transition: all 0.2s; }
        .btn-save:hover { transform: translateY(-1px); }
        .btn-save:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .btn-cancel { padding: 12px 20px; border-radius: 12px; border: 1.5px solid #e2e8f0; cursor: pointer; background: #f8fafc; color: #64748b; font-size: 0.9rem; font-family: 'Cairo', sans-serif; transition: all 0.2s; }
        .btn-cancel:hover { background: #f1f5f9; }
        .msg { padding: 10px 16px; border-radius: 10px; margin-bottom: 16px; font-size: 0.82rem; font-weight: 600; }
        .msg-error   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .msg-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
      `}</style>

      <div className="users-wrap">
        <div className="users-header">
          <div>
            <div className="users-title">👥 إدارة المستخدمين</div>
            <div className="users-sub">إجمالي المستخدمين: {users.length}</div>
          </div>
          <button className="btn-add-user" onClick={openAdd}>+ إضافة مستخدم</button>
        </div>

        <div className="users-stats">
          {[
            { label: "إجمالي المستخدمين", value: users.length, icon: "👥", bg: "#f5f3ff", color: "#7c3aed" },
            { label: "المشرفين",           value: admins,       icon: "👑", bg: "#fffbeb", color: "#d97706" },
            { label: "بقية المستخدمين",    value: regular,      icon: "👤", bg: "#f0fdf4", color: "#16a34a" },
          ].map(s => (
            <div className="users-stat" key={s.label}>
              <div className="users-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div>
                <div className="users-stat-num" style={{ color: s.color }}>{s.value}</div>
                <div className="users-stat-lbl">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="search-bar">
          <span style={{ color: "#94a3b8" }}>🔍</span>
          <input
            placeholder="بحث باسم المستخدم..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="users-table-card">
          <div className="users-table-head">قائمة المستخدمين</div>
          <table className="users-table">
            <thead>
              <tr>
                <th>المستخدم</th>
                <th>الاسم الكامل</th>
                <th>الصلاحية</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5}>
                  <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <div>لا توجد مستخدمين</div>
                  </div>
                </td></tr>
              ) : filtered.map((u: any) => (
                <tr key={u.id}>
                  <td>
                    <div className="user-name-cell">
                      <div className="user-avatar">{u.username?.[0]?.toUpperCase()}</div>
                      <span style={{ fontWeight: 700, color: "#0f172a" }}>{u.username}</span>
                    </div>
                  </td>
                  <td>{u.fullName || "—"}</td>
                  <td>
                    <span className={u.role === "Admin" ? "badge-admin" : u.role === "Shop" ? "badge-shop" : "badge-user"}>
                      {u.role === "Admin" ? "مشرف" : u.role === "Shop" ? "محل" : "مستخدم"}
                    </span>
                  </td>
                  <td>
                    <span className={u.isActive ? "badge-active" : "badge-inactive"}>
                      {u.isActive ? "نشط" : "موقوف"}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => openEdit(u)}>تعديل</button>
                      <button className={`btn-toggle ${u.isActive ? "btn-toggle-off" : ""}`} onClick={() => toggleStatus(u)}>
                        {u.isActive ? "إيقاف" : "تفعيل"}
                      </button>
                      <button className="btn-del" onClick={() => deleteUser(u.id)}>حذف</button>
                      <button className="btn-pass" onClick={() => {
                        setPassUserId(u.id);
                        setPassForm({ newPassword: "", confirmPassword: "" });
                        setPassMsg(null);
                        setShowPassModal(true);
                      }}>🔑 كلمة المرور</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <div className="modal-box">
              <div className="modal-title">
                {editUser ? "✏️ تعديل المستخدم" : "➕ إضافة مستخدم جديد"}
              </div>
              {msg && <div className={`msg msg-${msg.type}`}>{msg.text}</div>}

              <div className="modal-field">
                <label>اسم المستخدم *</label>
                <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="مثال: ahmed123" />
              </div>

              <div className="modal-field">
                <label>الاسم الكامل</label>
                <input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} placeholder="مثال: أحمد محمد" />
              </div>

              {!editUser && (
                <div className="modal-field">
                  <label>كلمة المرور *</label>
                  <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" />
                </div>
              )}

              <div className="modal-field">
                <label>الصلاحية</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="Admin">مشرف</option>
                  <option value="Shop">محل</option>
                  <option value="User">مستخدم عادي</option>
                </select>
              </div>

              <div className="modal-actions">
                <button className="btn-save" onClick={save} disabled={saving}>
                  {saving ? "جاري الحفظ..." : editUser ? "حفظ التعديلات" : "إضافة المستخدم"}
                </button>
                <button className="btn-cancel" onClick={() => setShowModal(false)}>إلغاء</button>
              </div>
            </div>
          </div>
        )}

        {showPassModal && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowPassModal(false)}>
            <div className="modal-box">
              <div className="modal-title">🔑 تغيير كلمة المرور</div>
              {passMsg && <div className={`msg msg-${passMsg.type}`}>{passMsg.text}</div>}
              <div className="modal-field">
                <label>كلمة المرور الجديدة *</label>
                <input type="password" value={passForm.newPassword}
                  onChange={e => setPassForm({...passForm, newPassword: e.target.value})}
                  placeholder="••••••••" />
              </div>
              <div className="modal-field">
                <label>تأكيد كلمة المرور *</label>
                <input type="password" value={passForm.confirmPassword}
                  onChange={e => setPassForm({...passForm, confirmPassword: e.target.value})}
                  placeholder="••••••••" />
              </div>
              <div className="modal-actions">
                <button className="btn-save" onClick={changePassword} disabled={passSaving}>
                  {passSaving ? "جاري الحفظ..." : "تغيير كلمة المرور"}
                </button>
                <button className="btn-cancel" onClick={() => setShowPassModal(false)}>إلغاء</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
