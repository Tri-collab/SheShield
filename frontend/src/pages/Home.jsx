import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Navbar */}
      <nav style={{ background: "white", padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 20px rgba(0,0,0,0.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "2rem" }}>🛡️</span>
          <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#c44569" }}>SheShield</span>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <button onClick={() => navigate("/login")} style={{ padding: "10px 25px", background: "transparent", color: "#c44569", border: "2px solid #c44569", borderRadius: "25px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>
            Login
          </button>
          <button onClick={() => navigate("/register")} style={{ padding: "10px 25px", background: "linear-gradient(135deg, #ff6b9d, #c44569)", color: "white", border: "none", borderRadius: "25px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ background: "linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #6c5ce7 100%)", minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"20\" cy=\"20\" r=\"2\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"80\" cy=\"80\" r=\"3\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"60\" cy=\"20\" r=\"1.5\" fill=\"rgba(255,255,255,0.1)\"/></svg>')" }}></div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "50px", padding: "8px 20px", display: "inline-block", marginBottom: "20px" }}>
            <span style={{ color: "white", fontSize: "14px", fontWeight: "bold" }}>🌟 India's #1 Women Safety App</span>
          </div>
          <h1 style={{ fontSize: "3.5rem", color: "white", margin: "0 0 20px", fontWeight: "900", lineHeight: 1.2 }}>
            Your Safety,<br />Our Priority 🛡️
          </h1>
          <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.9)", maxWidth: "600px", margin: "0 auto 40px", lineHeight: 1.7 }}>
            SheShield empowers women with cutting-edge technology. One tap SOS, live location sharing, emergency contacts, and much more.
          </p>
          <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/register")} style={{ padding: "16px 40px", background: "white", color: "#c44569", border: "none", borderRadius: "50px", fontSize: "18px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
              🚀 Get Started Free
            </button>
            <button onClick={() => navigate("/login")} style={{ padding: "16px 40px", background: "transparent", color: "white", border: "2px solid white", borderRadius: "50px", fontSize: "18px", cursor: "pointer", fontWeight: "bold" }}>
              Login →
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ background: "white", padding: "60px 40px", textAlign: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "30px", maxWidth: "800px", margin: "0 auto" }}>
          {[
            { number: "10K+", label: "Women Protected", icon: "👩" },
            { number: "99.9%", label: "Uptime", icon: "⚡" },
            { number: "< 1sec", label: "SOS Response", icon: "🚨" },
            { number: "Free", label: "Forever", icon: "💝" },
          ].map((stat, i) => (
            <div key={i} style={{ padding: "30px", borderRadius: "20px", background: "linear-gradient(135deg, #fff0f5, #fce4ec)" }}>
              <div style={{ fontSize: "2.5rem" }}>{stat.icon}</div>
              <h2 style={{ color: "#c44569", fontSize: "2rem", margin: "10px 0 5px" }}>{stat.number}</h2>
              <p style={{ color: "#888", margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div style={{ background: "#fff0f5", padding: "80px 40px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", color: "#c44569", marginBottom: "10px" }}>Everything You Need</h2>
        <p style={{ color: "#888", fontSize: "1.1rem", marginBottom: "50px" }}>Comprehensive safety features at your fingertips</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px", maxWidth: "1100px", margin: "0 auto" }}>
          {[
            { icon: "🚨", title: "One Tap SOS", desc: "Instantly alert your emergency contacts with your live location in just one tap.", color: "#ff4757" },
            { icon: "📍", title: "Live Location", desc: "Share your real-time location with trusted contacts via Google Maps.", color: "#2ed573" },
            { icon: "📱", title: "Fake Call", desc: "Simulate an incoming call to escape dangerous or uncomfortable situations.", color: "#6c5ce7" },
            { icon: "🎙️", title: "Voice SOS", desc: "Say 'HELP' to automatically trigger emergency SOS without touching your phone.", color: "#ff6b81" },
            { icon: "📞", title: "Emergency Contacts", desc: "Store up to 5 trusted emergency contacts for quick access.", color: "#ffa502" },
            { icon: "🧭", title: "Nearby Help", desc: "Find nearest police stations, hospitals, and helplines instantly.", color: "#1e90ff" },
            { icon: "📜", title: "SOS History", desc: "Track all your past SOS alerts with location and timestamp.", color: "#ff6348" },
            { icon: "📊", title: "Analytics", desc: "Monitor your safety activity with detailed dashboard analytics.", color: "#2ed573" },
          ].map((feature, i) => (
            <div key={i} style={{ background: "white", padding: "35px 25px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)", textAlign: "left", transition: "transform 0.2s", cursor: "pointer" }}>
              <div style={{ width: "60px", height: "60px", background: feature.color + "20", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", marginBottom: "20px" }}>
                {feature.icon}
              </div>
              <h3 style={{ color: "#333", marginBottom: "10px", fontSize: "1.1rem" }}>{feature.title}</h3>
              <p style={{ color: "#888", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div style={{ background: "white", padding: "80px 40px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", color: "#c44569", marginBottom: "10px" }}>How It Works</h2>
        <p style={{ color: "#888", fontSize: "1.1rem", marginBottom: "50px" }}>Simple, fast, and effective</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "30px", maxWidth: "900px", margin: "0 auto" }}>
          {[
            { step: "1", icon: "📝", title: "Register", desc: "Create your free account in seconds" },
            { step: "2", icon: "👥", title: "Add Contacts", desc: "Add up to 5 emergency contacts" },
            { step: "3", icon: "🚨", title: "Press SOS", desc: "One tap sends alert with location" },
            { step: "4", icon: "🛡️", title: "Stay Safe", desc: "Help is on the way immediately" },
          ].map((step, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #ff6b9d, #c44569)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "2rem" }}>
                {step.icon}
              </div>
              <div style={{ background: "#c44569", color: "white", borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", margin: "-50px auto 30px 60px", fontWeight: "bold", fontSize: "14px" }}>
                {step.step}
              </div>
              <h3 style={{ color: "#333", marginBottom: "10px" }}>{step.title}</h3>
              <p style={{ color: "#888", fontSize: "14px" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ background: "linear-gradient(135deg, #ff6b9d, #c44569)", padding: "80px 40px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", color: "white", marginBottom: "15px" }}>Ready to Stay Safe?</h2>
        <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem", marginBottom: "30px" }}>Join thousands of women who trust SheShield</p>
        <button onClick={() => navigate("/register")} style={{ padding: "18px 50px", background: "white", color: "#c44569", border: "none", borderRadius: "50px", fontSize: "20px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
          Get Started Free 🚀
        </button>
      </div>

      {/* Footer */}
      <div style={{ background: "#1a1a2e", padding: "40px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "15px" }}>
          <span style={{ fontSize: "1.5rem" }}>🛡️</span>
          <span style={{ color: "white", fontSize: "1.2rem", fontWeight: "bold" }}>SheShield</span>
        </div>
        <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>© 2026 SheShield. Made with ❤️ for Women Safety.</p>
      </div>
    </div>
  );
};

export default Home;