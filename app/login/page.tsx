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
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user?.role !== "Admin") {
          setError("هذا الحساب ليس حساب إدارة");
        } else {
          localStorage.setItem("token", data.token);
          router.push("/dashboard");
          return;
        }
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
        .login-root {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 32px 16px;
          direction: rtl;
          position: relative;
          overflow: hidden;
          background: #120f0c;
        }
        .bg-layer {
          position: fixed; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 70% 55% at 50% 0%, rgba(201,132,42,0.28) 0%, transparent 58%),
            radial-gradient(ellipse 50% 40% at 90% 80%, rgba(15,118,110,0.18) 0%, transparent 55%),
            linear-gradient(165deg, #1a1510 0%, #120f0c 55%, #0c0a08 100%);
        }
        .bg-grid {
          position: fixed; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(224,177,90,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(224,177,90,0.07) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 40%, black 20%, transparent 75%);
        }
        .login-wrap { position: relative; z-index: 1; width: 100%; max-width: 440px; }
        .brand {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          margin-bottom: 22px; text-align: center;
        }
        .brand-logo {
          width: 58px; height: 58px;
          background: linear-gradient(145deg, #e0b15a, #c9842a 55%, #8a5a16);
          border-radius: 16px; display: grid; place-items: center;
          font-size: 1.2rem; font-weight: 800; color: #1a1308;
          box-shadow: 0 10px 28px rgba(201,132,42,0.4);
        }
        .brand-name { font-size: 1.8rem; font-weight: 800; letter-spacing: 2px; color: #fff8ee; }
        .brand-sub { font-size: 0.88rem; color: #d6cbb8; }
        .login-card {
          background: #fffcf8;
          border-radius: 26px;
          padding: 2.2rem 2rem 1.7rem;
          color: #1c1917;
          box-shadow: 0 28px 80px rgba(0,0,0,0.45);
          border: 1px solid rgba(224,177,90,0.18);
        }
        .card-head { text-align: center; margin-bottom: 1.6rem; }
        .card-head h2 { font-size: 1.4rem; font-weight: 800; color: #1c1917; }
        .card-head p  { font-size: 0.84rem; color: #7a7268; margin-top: 4px; }
        .field { margin-bottom: 1rem; }
        .field label { display: block; font-size: 0.8rem; font-weight: 700; color: #44403c; margin-bottom: 6px; }
        .input-wrap {
          display: flex; align-items: center;
          border: 1.5px solid #e4dcd0; border-radius: 12px;
          padding: 0 14px; background: #faf6f0;
        }
        .input-wrap:focus-within { border-color: #c9842a; background: #fff; }
        .input-wrap .icon { font-size: 1rem; margin-left: 8px; }
        .input-wrap input {
          flex: 1; border: none; outline: none; background: transparent;
          padding: 12px 0; font-family: inherit;
          font-size: 0.88rem; color: #1c1917; direction: rtl;
        }
        .eye-btn { background: none; border: none; cursor: pointer; font-size: 1rem; padding: 0 4px; }
        .row-opts { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.2rem; font-size: 0.78rem; }
        .remember { display: flex; align-items: center; gap: 6px; cursor: pointer; color: #44403c; }
        .remember input { accent-color: #c9842a; }
        .forgot { color: #c9842a; text-decoration: none; font-weight: 700; }
        .btn-login {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #c9842a, #a56b1e);
          color: #fff8ee; border: none; border-radius: 12px;
          font-size: 0.95rem; font-weight: 800; font-family: inherit;
          cursor: pointer; box-shadow: 0 8px 18px rgba(201,132,42,0.32);
          display: flex; align-items: center; justify-content: center;
        }
        .btn-login:hover:not(:disabled) { filter: brightness(1.05); }
        .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }
        .spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .card-footer { text-align: center; margin-top: 1.3rem; font-size: 0.72rem; color: #b8aea0; }
      `}</style>

      <div className="login-root">
        <div className="bg-layer" />
        <div className="bg-grid" />
        <div className="login-wrap">
          <div className="brand">
            <div className="brand-logo">NL</div>
            <div className="brand-name">NetLR</div>
            <div className="brand-sub">لوحة إدارة شبكة قطع الغيار</div>
          </div>

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
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", marginBottom: "12px", fontSize: "0.8rem", color: "#dc2626", textAlign: "center" }}>
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

            <button className="btn-login" onClick={handleLogin} disabled={loading}>
              {loading ? <div className="spinner" /> : "تسجيل الدخول"}
            </button>

            <div className="card-footer">
              <p>© 2026 NetLR. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
