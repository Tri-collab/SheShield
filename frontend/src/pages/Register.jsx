import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ReCAPTCHA from "react-google-recaptcha";
import emailjs from "@emailjs/browser";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOTP = async () => {
    if (!form.email) {
      setError("Please enter email first!");
      return;
    }
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOTP);
    try {
      await emailjs.send(
        "service_jwrkvvd",
        "template_l8zk0x8",
        { email: form.email, passcode: generatedOTP, time: new Date().toLocaleTimeString() },
        "3uGzL0nycOJOaLgjS"
      );
      setOtpSent(true);
      setError("");
      alert("OTP sent to " + form.email);
    } catch (err) {
      setError("Failed to send OTP!");
    }
  };

  const verifyOTP = () => {
    if (otpInput === otp) {
      setOtpVerified(true);
      setError("");
    } else {
      setError("Invalid OTP! Try again.");
    }
  };

  const handleSubmit = async () => {
    if (!otpVerified) {
      setError("Please verify OTP first!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("https://sheshield-api.onrender.com/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #c44569 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "450px" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "4rem" }}>🛡️</div>
          <h1 style={{ color: "white", fontSize: "2rem", margin: "10px 0 5px", fontWeight: "900" }}>SheShield</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}>Your Safety Companion</p>
        </div>

        <div style={{ background: "white", borderRadius: "25px", padding: "40px", boxShadow: "0 25px 60px rgba(0,0,0,0.3)" }}>
          <h2 style={{ color: "#333", marginBottom: "5px", fontSize: "1.5rem" }}>Create Account ✨</h2>
          <p style={{ color: "#888", marginBottom: "25px", fontSize: "14px" }}>Join thousands of safe women</p>

          {error && (
            <div style={{ background: "#fff5f5", border: "1px solid #ffb3b3", borderRadius: "10px", padding: "12px 16px", marginBottom: "15px", color: "#e74c3c", fontSize: "14px" }}>
              ❌ {error}
            </div>
          )}

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", color: "#444", fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>FULL NAME</label>
            <input name="name" type="text" placeholder="Enter your full name" onChange={handleChange}
              style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "2px solid #f0f0f0", fontSize: "15px", boxSizing: "border-box", outline: "none", background: "#fafafa" }} />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", color: "#444", fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>EMAIL ADDRESS</label>
            <input name="email" type="email" placeholder="Enter your email" onChange={handleChange}
              style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "2px solid #f0f0f0", fontSize: "15px", boxSizing: "border-box", outline: "none", background: "#fafafa" }} />
            {!otpSent ? (
              <button onClick={sendOTP} style={{ width: "100%", padding: "10px", background: "linear-gradient(135deg, #6c5ce7, #a29bfe)", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", cursor: "pointer", marginTop: "8px" }}>
                📧 Send OTP
              </button>
            ) : !otpVerified ? (
              <div style={{ marginTop: "8px" }}>
                <input placeholder="Enter 6-digit OTP" value={otpInput} onChange={(e) => setOtpInput(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #f0f0f0", fontSize: "15px", boxSizing: "border-box", marginBottom: "8px" }} />
                <button onClick={verifyOTP} style={{ width: "100%", padding: "10px", background: "linear-gradient(135deg, #00b894, #00cec9)", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", cursor: "pointer" }}>
                  ✅ Verify OTP
                </button>
              </div>
            ) : (
              <p style={{ color: "#2ecc71", fontWeight: "bold", textAlign: "center", marginTop: "8px" }}>✅ Email Verified!</p>
            )}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", color: "#444", fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>PHONE NUMBER</label>
            <input name="phone" type="tel" placeholder="Enter your phone number" onChange={handleChange}
              style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "2px solid #f0f0f0", fontSize: "15px", boxSizing: "border-box", outline: "none", background: "#fafafa" }} />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", color: "#444", fontSize: "12px", fontWeight: "700", marginBottom: "8px" }}>PASSWORD</label>
            <input name="password" type="password" placeholder="Create a strong password" onChange={handleChange}
              style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", border: "2px solid #f0f0f0", fontSize: "15px", boxSizing: "border-box", outline: "none", background: "#fafafa" }} />
          </div>

          <ReCAPTCHA
            sitekey="6LdxGfosAAAAAIGcaHFXCqoC_SYIeKR__0iPxZ6f"
            onChange={(value) => setRecaptchaValue(value)}
            style={{ margin: "15px 0" }}
          />

          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", padding: "16px", background: loading ? "#ccc" : "linear-gradient(135deg, #ff6b9d, #c44569)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", cursor: "pointer", fontWeight: "bold", marginTop: "10px" }}>
            {loading ? "Creating Account..." : "Create Account 🚀"}
          </button>

          <p style={{ textAlign: "center", marginTop: "20px", color: "#888", fontSize: "14px" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#c44569", fontWeight: "bold", textDecoration: "none" }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;