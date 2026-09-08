"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!username || !password) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة");
      }
    } catch {
      setError("تعذر الاتصال بالسيرفر");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Cairo', sans-serif;
          direction: rtl;
          overflow: hidden;
          position: relative;
          background: #0a1628;
        }

        .bg-layer {
          position: fixed; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 80% 60% at 15% 50%, rgba(26,58,110,0.55) 0%, transparent 65%),
            radial-gradient(ellipse 60% 50% at 85% 20%, rgba(6,182,212,0.08) 0%, transparent 55%),
            linear-gradient(160deg, #0a1628 0%, #0d1f3c 50%, #091525 100%);
        }
        .bg-grid {
          position: fixed; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 70% 80% at 15% 50%, black 30%, transparent 80%);
        }
        .orb {
          position: fixed; border-radius: 50%;
          filter: blur(80px); opacity: 0.18;
          animation: floatOrb 8s ease-in-out infinite;
        }
        .orb-1 { width:420px;height:420px;background:#1d4ed8;top:-80px;left:-100px;animation-delay:0s; }
        .orb-2 { width:280px;height:280px;background:#0891b2;top:55%;left:5%;animation-delay:-3s; }
        .orb-3 { width:180px;height:180px;background:#2563eb;top:30%;left:22%;animation-delay:-5s; }
        @keyframes floatOrb {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-24px) scale(1.04); }
        }

        .left-side {
          flex: 1;
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 3rem 3rem 3rem 4rem;
          position: relative; z-index: 1;
        }
        .brand {
          display: flex; align-items: center; gap: 14px;
          margin-bottom: 2rem;
          animation: fadeUp 0.7s ease both;
        }
        .brand-logo {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, #1d4ed8, #06b6d4);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; font-weight: 800; color: white;
          box-shadow: 0 8px 32px rgba(37,99,235,0.4);
          letter-spacing: -1px;
        }
        .brand-name { font-size: 1.9rem; font-weight: 800; letter-spacing: 2px;
          background: linear-gradient(90deg,#fff,#93c5fd);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .brand-sub { font-size: 0.78rem; color: #94a3b8; margin-top: 2px; }

        .tagline { text-align: center; margin-bottom: 2.5rem; animation: fadeUp 0.7s 0.1s ease both; }
        .tagline h2 { font-size: 1.45rem; font-weight: 700; color: #fff; line-height: 1.6; margin-bottom: 6px; }
        .tagline p  { font-size: 0.82rem; color: #94a3b8; line-height: 1.7; }

        .dash-card {
          width: 100%; max-width: 490px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; overflow: hidden;
          backdrop-filter: blur(12px);
          box-shadow: 0 24px 80px rgba(0,0,0,0.4);
          animation: fadeUp 0.7s 0.2s ease both;
        }
        .dash-topbar {
          background: rgba(255,255,255,0.05);
          padding: 11px 18px;
          display: flex; align-items: center; gap: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-size: 0.78rem;
        }
        .dash-topbar .title { color: #fff; font-weight: 600; }
        .dash-topbar .sub   { color: #94a3b8; margin-right: auto; }
        .dots { display: flex; gap: 5px; }
        .dot  { width: 8px; height: 8px; border-radius: 50%; }

        .stats-row {
          display: grid; grid-template-columns: repeat(4,1fr);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .stat {
          padding: 14px 8px; text-align: center;
          border-left: 1px solid rgba(255,255,255,0.08);
        }
        .stat:last-child { border-left: none; }
        .stat-n { font-size: 1.05rem; font-weight: 700; color: #fff; }
        .stat-l { font-size: 0.6rem; color: #94a3b8; margin-top: 2px; }
        .stat-u { font-size: 0.6rem; color: #22c55e; margin-top: 1px; }

        .chart-row { display: flex; gap: 14px; padding: 14px 18px 18px; }
        .chart-left { flex: 1; }
        .chart-lbl  { font-size: 0.68rem; color: #94a3b8; margin-bottom: 8px; }
        .sparkline  { height: 58px; }
        .sparkline svg { width: 100%; height: 100%; }

        .status-list { width: 145px; }
        .s-item {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 10px; border-radius: 8px;
          background: rgba(255,255,255,0.03);
          margin-bottom: 5px; font-size: 0.63rem; color: #94a3b8;
        }
        .s-dot { width: 7px; height: 7px; border-radius: 50%;
          background: #22c55e; box-shadow: 0 0 6px #22c55e; flex-shrink:0; }

        .right-side {
          width: 46%; min-width: 380px;
          display: flex; align-items: center; justify-content: center;
          padding: 2rem; position: relative; z-index: 2;
        }

        .login-card {
          width: 100%; max-width: 420px;
          background: rgba(255,255,255,0.97);
          border-radius: 24px;
          padding: 2.8rem 2.5rem;
          color: #1e293b;
          box-shadow: 0 32px 100px rgba(0,0,0,0.5);
          animation: slideIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes slideIn {
          from { opacity:0; transform: translateX(30px); }
          to   { opacity:1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform: translateY(20px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .card-head { text-align: center; margin-bottom: 2rem; }
        .card-head h2 { font-size: 1.55rem; font-weight: 800; color: #0f172a; }
        .card-head p  { font-size: 0.8rem; color: #64748b; margin-top: 4px; }

        .field { margin-bottom: 1rem; }
        .field label { display: block; font-size: 0.8rem; font-weight: 600; color: #374151; margin-bottom: 6px; }
        .input-wrap {
          display: flex; align-items: center;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          padding: 0 14px; background: #f8fafc; transition: border 0.2s;
        }
        .input-wrap:focus-within { border-color: #3b82f6; background: #fff; }
        .input-wrap .icon { font-size: 1rem; margin-left: 8px; }
        .input-wrap input {
          flex: 1; border: none; outline: none; background: transparent;
          padding: 12px 0; font-family: 'Cairo', sans-serif;
          font-size: 0.88rem; color: #0f172a; direction: rtl;
        }
        .eye-btn { background: none; border: none; cursor: pointer; font-size: 1rem; padding: 0 4px; }

        .row-opts {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.2rem; font-size: 0.78rem;
        }
        .remember { display: flex; align-items: center; gap: 6px; cursor: pointer; color: #374151; }
        .remember input { accent-color: #3b82f6; }
        .forgot { color: #3b82f6; text-decoration: none; font-weight: 600; }

        .btn-login {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #1d4ed8, #06b6d4);
          color: white; border: none; border-radius: 12px;
          font-size: 0.95rem; font-weight: 700;
          font-family: 'Cairo', sans-serif;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(37,99,235,0.35);
          display: flex; align-items: center; justify-content: center;
        }
        .btn-login:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.45); }
        .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 20px; height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .card-footer { text-align: center; margin-top: 1.5rem; font-size: 0.72rem; color: #94a3b8; }
      `}</style>

      <div className="login-root">
        <div className="bg-layer" />
        <div className="bg-grid" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Left Side */}
        <div className="left-side">
          <div className="brand">
            <div className="brand-logo">NL</div>
            <div>
              <div className="brand-name">NetLR</div>
              <div className="brand-sub">نظام إدارة قطع الغيار</div>
            </div>
          </div>

          <div className="tagline">
            <h2>منصة متكاملة لإدارة<br/>قطع الغيار</h2>
            <p>تحكم كامل في المخزون، المحلات، والمستخدمين</p>
          </div>

          <div className="dash-card">
            <div className="dash-topbar">
              <div className="dots">
                <div className="dot" style={{background:"#ef4444"}} />
                <div className="dot" style={{background:"#f59e0b"}} />
                <div className="dot" style={{background:"#22c55e"}} />
              </div>
              <span className="title">لوحة التحكم</span>
              <span className="sub">المدير العام</span>
            </div>

            <div className="stats-row">
              {[
                {n:"542",    l:"إجمالي المحلات",    u:"↑ 4% هذا الشهر"},
                {n:"1,256",  l:"إجمالي المستخدمين", u:"↑ 8% هذا الشهر"},
                {n:"2.4M",   l:"إجمالي القطع",      u:"↑ 21%"},
                {n:"18,985", l:"إجمالي الطلبات",    u:"↑ 30%"},
              ].map((s,i) => (
                <div className="stat" key={i}>
                  <div className="stat-n">{s.n}</div>
                  <div className="stat-l">{s.l}</div>
                  <div className="stat-u">{s.u}</div>
                </div>
              ))}
            </div>

            <div className="chart-row">
              <div className="chart-left">
                <div className="chart-lbl">إحصائيات النظام — آخر 7 أيام</div>
                <div className="sparkline">
                  <svg viewBox="0 0 260 60" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                      </linearGradient>
                      <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M0,45 C20,40 40,20 70,25 C100,30 120,15 150,18 C180,21 200,35 230,28 L260,22 L260,60 L0,60 Z" fill="url(#g1)"/>
                    <path d="M0,50 C20,48 40,38 70,42 C100,46 120,30 150,35 C180,40 200,48 230,42 L260,38 L260,60 L0,60 Z" fill="url(#g2)"/>
                    <polyline points="0,45 70,25 150,18 230,28 260,22" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                    <polyline points="0,50 70,42 150,35 230,42 260,38" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4,3"/>
                  </svg>
                </div>
              </div>
              <div className="status-list">
                <div className="chart-lbl">حالة النظام</div>
                {["حالة السيرفرات","قاعدة البيانات","خدمات البحث","مراقبة المخزون"].map((t,i)=>(
                  <div className="s-item" key={i}>
                    <div className="s-dot" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="right-side">
          <div className="login-card">
            <div className="card-head">
              <h2>تسجيل الدخول</h2>
              <p>أدخل بياناتك للوصول إلى لوحة التحكم</p>
            </div>

            <div className="field">
              <label>اسم المستخدم</label>
              <div className="input-wrap">
                <span className="icon">👤</span>
                <input
                  type="text"
                  placeholder="admin"
                  autoComplete="off"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                />
              </div>
            </div>

            <div className="field">
              <label>كلمة المرور</label>
              <div className="input-wrap">
                <span className="icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                />
                <button className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {error && (
              <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"8px",padding:"10px 14px",marginBottom:"12px",fontSize:"0.8rem",color:"#dc2626",textAlign:"center"}}>
                ⚠️ {error}
              </div>
            )}

            <div className="row-opts">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                تذكرني
              </label>
              <a href="#" className="forgot">نسيت كلمة المرور؟</a>
            </div>

            <button
              className="btn-login"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <div className="spinner" />
              ) : (
                "تسجيل الدخول"
              )}
            </button>

            <div className="card-footer">
              <p>© 2024 NetLR. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
