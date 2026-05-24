import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!recaptchaValue) {
      setError("Please complete the CAPTCHA!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ff6b9d 0%, #c44569 40%, #6c5ce7 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: "flex", maxWidth: "900px", width: "100%", borderRadius: "30px", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.3)" }}>
        <div style={{ flex: 1, background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)", padding: "50px 40px", display: "flex", flexDirection: "column", justifyContent: "center", backdropFilter: "blur(10px)", borderRight: "1px solid rgba(255,255,255,0.2)" }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🛡️</div>
          <h1 style={{ color: "white", fontSize: "2.5rem", margin: "0 0 10px", fontWeight: "900", lineHeight: 1.2 }}>SheShield</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "15px", lineHeight: 1.7, marginBottom: "40px" }}>
            Empowering women with smart safety technology.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {[
              { icon: "🚨", text: "One Tap SOS Alert" },
              { icon: "📍", text: "Live Location Sharing" },
              { icon: "📱", text: "Fake Call Feature" },
              { icon: "🎙️", text: "Voice Activated SOS" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                  {item.icon}
                </div>
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px", fontWeight: "500" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, background: "white", padding: "50px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h2 style={{ color: "#1a1a2e", margin: "0 0 8px", fontSize: "1.8rem", fontWeight: "800" }}>Welcome Back 👋</h2>
          <p style={{ color: "#888", marginBottom: "30px", fontSize: "14px" }}>Sign in to your SheShield account</p>

          {error && (
            <div style={{ background: "#fff5f5", border: "1px solid #ffb3b3", borderRadius: "12px", padding: "12px 16px", marginBottom: "20px", color: "#e74c3c", fontSize: "14px" }}>
              ❌ {error}
            </div>
          )}

          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", color: "#444", fontSize: "12px", fontWeight: "700", marginBottom: "8px", letterSpacing: "1px" }}>EMAIL ADDRESS</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>📧</span>
              <input name="email" type="email" placeholder="your@email.com" onChange={handleChange}
                style={{ width: "100%", padding: "14px 16px 14px 44px", borderRadius: "14px", border: "2px solid #f0f0f0", fontSize: "15px", boxSizing: "border-box", outline: "none", background: "#fafafa" }}
                onFocus={(e) => e.target.style.border = "2px solid #ff6b9d"}
                onBlur={(e) => e.target.style.border = "2px solid #f0f0f0"}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#444", fontSize: "12px", fontWeight: "700", marginBottom: "8px", letterSpacing: "1px" }}>PASSWORD</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔒</span>
              <input name="password" type="password" placeholder="Enter your password" onChange={handleChange}
                style={{ width: "100%", padding: "14px 16px 14px 44px", borderRadius: "14px", border: "2px solid #f0f0f0", fontSize: "15px", boxSizing: "border-box", outline: "none", background: "#fafafa" }}
                onFocus={(e) => e.target.style.border = "2px solid #ff6b9d"}
                onBlur={(e) => e.target.style.border = "2px solid #f0f0f0"}
              />
            </div>
          </div>

          <ReCAPTCHA
            sitekey="6LdxGfosAAAAAIGcaHFXCqoC_SYIeKR__0iPxZ6f"
            onChange={(value) => setRecaptchaValue(value)}
            style={{ margin: "10px 0" }}
          />

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", padding: "16px", background: loading ? "#ccc" : "linear-gradient(135deg, #ff6b9d, #c44569)", color: "white", border: "none", borderRadius: "14px", fontSize: "16px", cursor: "pointer", fontWeight: "800", boxShadow: "0 8px 25px rgba(196,69,105,0.4)", marginTop: "10px" }}
          >
            {loading ? "⏳ Signing in..." : "Sign In →"}
          </button>

          <p style={{ textAlign: "center", marginTop: "25px", color: "#888", fontSize: "14px" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#c44569", fontWeight: "800", textDecoration: "none" }}>Create one free →</Link>
          </p>
          <p style={{ textAlign: "center", marginTop: "10px", color: "#ccc", fontSize: "12px" }}>
            🔒 100% Secure and Encrypted
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;