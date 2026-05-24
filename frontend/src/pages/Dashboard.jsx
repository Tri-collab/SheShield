import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("sos");
  const [sosStatus, setSosStatus] = useState("");
  const [location, setLocation] = useState(null);
  const [sosHistory, setSosHistory] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState({ name: "", phone: "" });
  const [contactStatus, setContactStatus] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [fakeCallActive, setFakeCallActive] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [sosAlert, setSosAlert] = useState(false);
  const [sosLocation, setSosLocation] = useState(null);
  const [sosTimer, setSosTimer] = useState(10);
  const [isRecording, setIsRecording] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    fetchContacts();
    fetchHistory();
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    let interval;
    if (sosAlert && sosTimer > 0) {
      interval = setInterval(() => {
        setSosTimer((prev) => prev - 1);
      }, 1000);
    }
    if (sosTimer === 0) {
      setSosAlert(false);
      setSosTimer(10);
    }
    return () => clearInterval(interval);
  }, [sosAlert, sosTimer]);

  const addNotification = (msg) => {
    setNotifications((prev) => [{ msg, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
  };

  const sendBrowserNotification = (title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.svg" });
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contacts/" + user.id);
      setContacts(res.data.contacts);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sos/history/" + user.id);
      setSosHistory(res.data.history);
    } catch (err) {
      console.log(err);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sos_evidence_" + new Date().toISOString() + ".webm";
        a.click();
        addNotification("🎙️ Evidence recorded & saved!");
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setTimeout(() => {
        recorder.stop();
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
      }, 10000);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSOS = async () => {
    if (silentMode) {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    await axios.post("http://localhost:5000/api/sos/send", { userId: user.id, location: loc });
    fetchHistory();
  });
  return;
};
    if (!navigator.geolocation) {
      setSosStatus("Location not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);
        setSosLocation(loc);
        setSosStatus("SOS Sent! Location captured!");
        setSosAlert(true);
        setSosTimer(10);
        addNotification("SOS Activated!");
        sendBrowserNotification("SOS ALERT!", "Emergency SOS triggered! Location shared.");
        startRecording();
        try {
          await axios.post("http://localhost:5000/api/sos/send", { userId: user.id, location: loc });
          fetchHistory();
        } catch (err) {
          console.log(err);
        }
      },
      () => setSosStatus("Please allow location access!")
    );
  };

  const handleAddContact = async () => {
    if (!contact.name || !contact.phone) {
      setContactStatus("Please fill all fields!");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/contacts/add", {
        userId: user.id,
        name: contact.name,
        phone: contact.phone,
      });
      setContacts(res.data.contacts);
      setContactStatus("Contact added!");
      setContact({ name: "", phone: "" });
      addNotification("Contact Added!");
      sendBrowserNotification("Contact Added!", "New emergency contact added.");
    } catch (err) {
      setContactStatus(err.response?.data?.message || "Failed!");
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      const res = await axios.delete("http://localhost:5000/api/contacts/" + user.id + "/" + contactId);
      setContacts(res.data.contacts);
      addNotification("Contact Deleted!");
    } catch (err) {
      console.log(err);
    }
  };

  const handleFakeCall = () => {
    setFakeCallActive(true);
    addNotification("Fake Call Activated!");
    sendBrowserNotification("Incoming Call!", "Mom is calling you...");
    setTimeout(() => setFakeCallActive(false), 8000);
  };

  const handleVoiceSOS = () => {
    setVoiceActive(true);
    addNotification("Voice SOS Activated!");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice not supported!");
      setVoiceActive(false);
      return;
    }
    const r = new SpeechRecognition();
    r.onresult = (e) => {
      const transcript = e.results[0][0].transcript.toLowerCase();
      if (transcript.includes("help")) {
        handleSOS();
        setVoiceActive(false);
      }
    };
    r.onerror = () => setVoiceActive(false);
    r.start();
  };

  const bg = darkMode ? "#1a1a2e" : "#fff0f5";
  const cardBg = darkMode ? "#16213e" : "white";
  const textColor = darkMode ? "#eee" : "#333";

  return (
    <div style={{ minHeight: "100vh", background: bg, transition: "0.3s", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* SOS Alert Screen */}
      {sosAlert && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(220,20,60,0.97)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ textAlign: "center", color: "white" }}>
            <div style={{ fontSize: "6rem", animation: "pulse 1s infinite" }}>🚨</div>
            <h1 style={{ fontSize: "3rem", fontWeight: "900", margin: "10px 0" }}>SOS ACTIVATED!</h1>
            <p style={{ fontSize: "1.2rem", opacity: 0.9, marginBottom: "30px" }}>Emergency services being alerted...</p>

            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "20px", padding: "25px", marginBottom: "25px", maxWidth: "400px" }}>
              <p style={{ margin: "8px 0", fontSize: "16px" }}>📍 Location: {sosLocation?.lat?.toFixed(4)}, {sosLocation?.lng?.toFixed(4)}</p>
              <p style={{ margin: "8px 0", fontSize: "16px" }}>👤 User: {user?.name}</p>
              <p style={{ margin: "8px 0", fontSize: "16px" }}>📞 Contacts Notified: {contacts.length}</p>
              <p style={{ margin: "8px 0", fontSize: "16px" }}>🎙️ Recording: {isRecording ? "Active" : "Saved"}</p>
              <p style={{ margin: "8px 0", fontSize: "16px" }}>⏰ Time: {new Date().toLocaleTimeString()}</p>
            </div>

            <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap", marginBottom: "25px" }}>
              {contacts.slice(0, 3).map((c, i) => (
                <a key={i} href={"tel:" + c.phone} style={{ padding: "12px 20px", background: "rgba(255,255,255,0.2)", color: "white", borderRadius: "12px", textDecoration: "none", fontWeight: "bold" }}>
                  📞 Call {c.name}
                </a>
              ))}
              <a href="tel:112" style={{ padding: "12px 20px", background: "white", color: "#dc143c", borderRadius: "12px", textDecoration: "none", fontWeight: "bold" }}>
                🚔 Call 112
              </a>
            </div>

            {sosLocation && (
              <a href={"https://www.google.com/maps?q=" + sosLocation.lat + "," + sosLocation.lng} target="_blank" rel="noreferrer" style={{ display: "inline-block", padding: "12px 25px", background: "white", color: "#dc143c", borderRadius: "12px", textDecoration: "none", fontWeight: "bold", marginBottom: "20px" }}>
                📍 Open My Location
              </a>
            )}

            <div style={{ fontSize: "1rem", opacity: 0.8, marginBottom: "20px" }}>
              Auto closing in {sosTimer} seconds...
            </div>

            <button onClick={() => { setSosAlert(false); setSosTimer(10); }} style={{ padding: "12px 30px", background: "rgba(255,255,255,0.2)", color: "white", border: "2px solid white", borderRadius: "12px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>
              ✅ I am Safe Now
            </button>
          </div>
        </div>
      )}

      {/* Fake Call Popup */}
      {fakeCallActive && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#1a1a2e", padding: "40px", borderRadius: "20px", textAlign: "center", color: "white", minWidth: "300px" }}>
            <div style={{ fontSize: "4rem" }}>📱</div>
            <h2>Incoming Call...</h2>
            <p style={{ color: "#aaa" }}>Mom</p>
            <p style={{ color: "#aaa", fontSize: "12px" }}>Ringing...</p>
            <div style={{ display: "flex", gap: "20px", marginTop: "20px", justifyContent: "center" }}>
              <button onClick={() => setFakeCallActive(false)} style={{ padding: "15px 30px", background: "#e74c3c", borderRadius: "50px", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}>📵</button>
              <button onClick={() => setFakeCallActive(false)} style={{ padding: "15px 30px", background: "#2ecc71", borderRadius: "50px", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}>📞</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #ff6b9d, #c44569)", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.5rem", fontWeight: "900" }}>🛡️ SheShield</h1>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {isRecording && <span style={{ color: "white", fontSize: "12px", background: "rgba(255,0,0,0.5)", padding: "4px 10px", borderRadius: "20px" }}>🔴 Recording</span>}
          <span style={{ color: "white", fontSize: "14px" }}>👋 {user?.name}</span>
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: "6px 12px", borderRadius: "8px", border: "none", background: "white", cursor: "pointer", fontSize: "16px" }}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button onClick={() => setSilentMode(!silentMode)} style={{ padding: "6px 12px", borderRadius: "8px", border: "none", background: silentMode ? "#e74c3c" : "white", color: silentMode ? "white" : "#333", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>
  {silentMode ? "🔕 Silent ON" : "🔔 Silent OFF"}
</button>
<button onClick={() => navigate("/admin")} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid white", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>
  👮 Admin
</button>
          <button onClick={() => { logout(); navigate("/login"); }} style={{ padding: "8px 16px", background: "white", color: "#c44569", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", overflowX: "auto", padding: "15px 20px", gap: "10px", background: cardBg, borderBottom: "1px solid #f0f0f0" }}>
        {["sos", "location", "contacts", "history", "nearby", "notifications","safeRoute", "dangerZone", "analytics"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "10px 20px", borderRadius: "25px", border: "none", background: activeTab === tab ? "linear-gradient(135deg, #ff6b9d, #c44569)" : "#f8f0f5", color: activeTab === tab ? "white" : "#666", cursor: "pointer", whiteSpace: "nowrap", fontWeight: "bold", fontSize: "13px" }}>
            {tab === "sos" && "🚨 SOS"}
            {tab === "location" && "📍 Location"}
            {tab === "contacts" && "📞 Contacts"}
            {tab === "history" && "📜 History"}
            {tab === "nearby" && "🧭 Nearby"}
            {tab === "notifications" && "🔔 Alerts"}
            {tab === "safeRoute" && "🧭 Safe Route"}
            {tab === "dangerZone" && "🗺️ Danger Zone"}
            {tab === "analytics" && "📊 Stats"}

          </button>
        ))}
      </div>

      <div style={{ padding: "20px" }}>

        {/* SOS Tab */}
        {activeTab === "sos" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            <div style={{ background: cardBg, padding: "30px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)", textAlign: "center" }}>
              <h2 style={{ color: "#c44569" }}>🚨 Emergency SOS</h2>
              <p style={{ color: textColor, fontSize: "14px" }}>Press in case of emergency — location + recording auto starts</p>
              <button onClick={handleSOS} style={{ width: "170px", height: "170px", borderRadius: "50%", background: "linear-gradient(135deg, #ff4757, #c0392b)", color: "white", fontSize: "2.2rem", fontWeight: "bold", border: "none", cursor: "pointer", boxShadow: "0 15px 40px rgba(255,71,87,0.6)", margin: "20px auto", display: "block", transition: "transform 0.1s" }}
                onMouseDown={(e) => e.target.style.transform = "scale(0.95)"}
                onMouseUp={(e) => e.target.style.transform = "scale(1)"}
              >
                SOS
              </button>
              {sosStatus && <p style={{ color: "#c44569", fontWeight: "bold", fontSize: "13px" }}>{sosStatus}</p>}
              {location && (
                <a href={"https://www.google.com/maps?q=" + location.lat + "," + location.lng} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "10px", padding: "10px 20px", background: "#c44569", color: "white", borderRadius: "10px", textDecoration: "none", fontSize: "14px" }}>
                  📍 Open in Google Maps
                </a>
              )}
            </div>

            <div style={{ background: cardBg, padding: "30px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)", textAlign: "center" }}>
              <h2 style={{ color: "#c44569" }}>📱 Fake Call</h2>
              <p style={{ color: textColor, fontSize: "14px" }}>Simulate an incoming call to escape danger</p>
              <button onClick={handleFakeCall} style={{ padding: "15px 30px", background: "linear-gradient(135deg, #6c5ce7, #a29bfe)", color: "white", border: "none", borderRadius: "15px", fontSize: "16px", cursor: "pointer", marginTop: "20px" }}>
                📞 Activate Fake Call
              </button>
            </div>

            <div style={{ background: cardBg, padding: "30px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)", textAlign: "center" }}>
              <h2 style={{ color: "#c44569" }}>🎙️ Voice SOS</h2>
              <p style={{ color: textColor, fontSize: "14px" }}>Say "HELP" to trigger SOS automatically</p>
              <button onClick={handleVoiceSOS} style={{ padding: "15px 30px", background: voiceActive ? "#e74c3c" : "linear-gradient(135deg, #00b894, #00cec9)", color: "white", border: "none", borderRadius: "15px", fontSize: "16px", cursor: "pointer", marginTop: "20px" }}>
                {voiceActive ? "🎙️ Listening..." : "🎙️ Activate Voice SOS"}
              </button>
            </div>

            <div style={{ background: cardBg, padding: "30px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)" }}>
              <h2 style={{ color: "#c44569", textAlign: "center" }}>🆘 Emergency Numbers</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
                {[["100", "🚔 Police"], ["108", "🚑 Ambulance"], ["1091", "👩 Women Helpline"], ["101", "🔥 Fire Brigade"], ["112", "📞 National Emergency"]].map(([num, label]) => (
                  <a key={num} href={"tel:" + num} style={{ padding: "12px", background: "linear-gradient(135deg, #ff6b9d, #c44569)", color: "white", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", textAlign: "center" }}>
                    {label}: {num}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Location Tab */}
        {activeTab === "location" && (
          <div style={{ background: cardBg, padding: "30px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)" }}>
            <h2 style={{ color: "#c44569" }}>📍 Live Location</h2>
            {location ? (
              <div>
                <p style={{ color: "#2ecc71", fontWeight: "bold" }}>✅ Location captured!</p>
                <p style={{ color: textColor }}>📌 Latitude: <strong>{location.lat}</strong></p>
                <p style={{ color: textColor }}>📌 Longitude: <strong>{location.lng}</strong></p>
                <p style={{ color: textColor }}>🕐 Captured at: <strong>{new Date().toLocaleTimeString()}</strong></p>
                <a href={"https://www.google.com/maps?q=" + location.lat + "," + location.lng} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "10px", padding: "12px 24px", background: "#c44569", color: "white", borderRadius: "10px", textDecoration: "none", fontWeight: "bold" }}>
                  🗺️ Open Google Maps
                </a>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{ color: textColor }}>No location captured yet.</p>
                <button onClick={handleSOS} style={{ padding: "12px 24px", background: "#c44569", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", marginTop: "10px" }}>
                  📍 Capture My Location
                </button>
              </div>
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === "contacts" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            <div style={{ background: cardBg, padding: "30px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)" }}>
              <h2 style={{ color: "#c44569" }}>➕ Add Contact</h2>
              <p style={{ color: "#888", fontSize: "13px" }}>Maximum 5 contacts allowed</p>
              <input style={{ width: "100%", padding: "12px", margin: "8px 0", borderRadius: "10px", border: "2px solid #f8a5c2", fontSize: "14px", boxSizing: "border-box" }} placeholder="Contact Name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
              <input style={{ width: "100%", padding: "12px", margin: "8px 0", borderRadius: "10px", border: "2px solid #f8a5c2", fontSize: "14px", boxSizing: "border-box" }} placeholder="Phone Number" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
              <button onClick={handleAddContact} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #ff6b9d, #c44569)", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", cursor: "pointer", marginTop: "10px" }}>
                Add Contact
              </button>
              {contactStatus && <p style={{ color: "#c44569", fontWeight: "bold", marginTop: "10px" }}>{contactStatus}</p>}
            </div>

            <div style={{ background: cardBg, padding: "30px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)" }}>
              <h2 style={{ color: "c44569" }}>👥 My Contacts ({contacts.length}/5)</h2>
              {contacts.length === 0 ? (
                <p style={{ color: "#888" }}>No contacts added yet.</p>
              ) : (
                contacts.map((c, i) => (
                  <div key={c._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#fff0f5", borderRadius: "10px", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "35px", height: "35px", background: "linear-gradient(135deg, #ff6b9d, #c44569)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "14px" }}>
                        {i + 1}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: "bold", color: "#c44569" }}>{c.name}</p>
                        <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>{c.phone}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <a href={"tel:" + c.phone} style={{ padding: "6px 12px", background: "#2ecc71", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "12px", fontWeight: "bold" }}>📞 Call</a>
                      <button onClick={() => handleDeleteContact(c._id)} style={{ padding: "6px 12px", background: "#e74c3c", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div style={{ background: cardBg, padding: "30px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)" }}>
            <h2 style={{ color: "#c44569" }}>📜 SOS History</h2>
            {sosHistory.length === 0 ? (
              <p style={{ color: "#888" }}>No SOS alerts triggered yet.</p>
            ) : (
              sosHistory.map((s, i) => (
                <div key={i} style={{ padding: "15px", background: "#fff0f5", borderRadius: "10px", marginBottom: "10px", borderLeft: "4px solid #c44569" }}>
                  <p style={{ margin: 0, fontWeight: "bold", color: "#c44569" }}>🚨 SOS #{sosHistory.length - i}</p>
                  <p style={{ margin: "5px 0 0", fontSize: "13px", color: "#888" }}>⏰ {new Date(s.time).toLocaleString()}</p>
                  <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#888" }}>📍 Lat: {s.location?.lat?.toFixed(6)}, Lng: {s.location?.lng?.toFixed(6)}</p>
                  <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#2ecc71", fontWeight: "bold" }}>✅ Status: {s.status}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Nearby Tab */}
        {activeTab === "nearby" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            {[
              { icon: "🚔", title: "Police Station", desc: "Call 100 for immediate help", color: "#3498db", num: "100" },
              { icon: "🏥", title: "Hospital", desc: "Call 108 for ambulance", color: "#2ecc71", num: "108" },
              { icon: "👩", title: "Women Helpline", desc: "24/7 women safety helpline", color: "#e91e63", num: "1091" },
              { icon: "🚑", title: "Ambulance", desc: "Medical emergency support", color: "#e74c3c", num: "108" },
              { icon: "🔥", title: "Fire Brigade", desc: "Fire emergency services", color: "#f39c12", num: "101" },
              { icon: "📞", title: "National Emergency", desc: "Single emergency number", color: "#9b59b6", num: "112" },
            ].map((item, i) => (
              <div key={i} style={{ background: cardBg, padding: "25px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)", textAlign: "center" }}>
                <div style={{ fontSize: "3rem" }}>{item.icon}</div>
                <h3 style={{ color: item.color, margin: "10px 0 5px" }}>{item.title}</h3>
                <p style={{ color: textColor, fontSize: "13px", marginBottom: "15px" }}>{item.desc}</p>
                <a href={"tel:" + item.num} style={{ display: "inline-block", padding: "10px 25px", background: item.color, color: "white", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>
                  📞 Call {item.num}
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div style={{ background: cardBg, padding: "30px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)" }}>
            <h2 style={{ color: "#c44569" }}>🔔 Alert History</h2>
            {notifications.length === 0 ? (
              <p style={{ color: "#888" }}>No alerts yet.</p>
            ) : (
              notifications.map((n, i) => (
                <div key={i} style={{ padding: "15px", background: "#fff0f5", borderRadius: "10px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#c44569", fontWeight: "bold" }}>{n.msg}</span>
                  <span style={{ color: "#888", fontSize: "12px", background: "#f0f0f0", padding: "4px 10px", borderRadius: "20px" }}>{n.time}</span>
                </div>
              ))
            )}
          </div>
        )}
{/* Safe Route Tab */}
{activeTab === "safeRoute" && (
  <div style={{ background: cardBg, padding: "30px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)" }}>
    <h2 style={{ color: "#c44569" }}>🧭 Safe Route</h2>
    <p style={{ color: textColor }}>Find the safest route to your destination</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px", marginTop: "20px" }}>
      {[
        { icon: "🏠", place: "Home", address: "Your saved home location" },
        { icon: "🏥", place: "Nearest Hospital", address: "Apollo Hospital, Kolkata" },
        { icon: "🚔", place: "Police Station", address: "Dumdum Police Station" },
        { icon: "🚇", place: "Metro Station", address: "Dumdum Metro Station" },
      ].map((item, i) => (
        <div key={i} style={{ background: "#fff0f5", padding: "20px", borderRadius: "15px", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem" }}>{item.icon}</div>
          <h3 style={{ color: "#c44569", margin: "10px 0 5px" }}>{item.place}</h3>
          <p style={{ color: "#888", fontSize: "13px", marginBottom: "15px" }}>{item.address}</p>
          {location && (
            <a href={"https://www.google.com/maps/dir/" + location.lat + "," + location.lng + "/" + item.place} target="_blank" rel="noreferrer" style={{ display: "inline-block", padding: "10px 20px", background: "linear-gradient(135deg, #ff6b9d, #c44569)", color: "white", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", fontSize: "13px" }}>
              Get Safe Route
            </a>
          )}
          {!location && (
            <button onClick={handleSOS} style={{ padding: "10px 20px", background: "#c44569", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px" }}>
              Enable Location First
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
)}

{activeTab === "dangerZone" && (
  <div style={{ background: cardBg, padding: "30px", borderRadius: "20px" }}>
    <h2 style={{ color: "#c44569" }}>🗺️ Danger Zone Map</h2>
    <p style={{ color: textColor, marginBottom: "20px" }}>Community reported unsafe areas</p>
    <LoadScript googleMapsApiKey="AIzaSyB1zU3udqqJgCAUzBBIT9xM8KGufUUxYK4">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "500px", borderRadius: "15px" }}
        center={{ lat: 22.5726, lng: 88.3639 }}
        zoom={12}
      >
        {[
          { lat: 22.5958, lng: 88.3699, name: "Shyambazar", risk: "medium" },
          { lat: 22.5553, lng: 88.3512, name: "Park Street", risk: "high" },
          { lat: 22.6013, lng: 88.4000, name: "Dumdum", risk: "safe" },
          { lat: 22.5827, lng: 88.4141, name: "Salt Lake", risk: "safe" },
          { lat: 22.5010, lng: 88.3100, name: "Behala", risk: "medium" },
          { lat: 22.6200, lng: 88.3900, name: "Dum Dum Park", risk: "high" },
        ].map((zone, i) => (
          <div key={i}>
            <Marker position={{ lat: zone.lat, lng: zone.lng }} />
            <Circle
              center={{ lat: zone.lat, lng: zone.lng }}
              radius={500}
              options={{
                fillColor: zone.risk === "high" ? "#e74c3c" : zone.risk === "medium" ? "#f39c12" : "#2ecc71",
                fillOpacity: 0.3,
                strokeColor: zone.risk === "high" ? "#e74c3c" : zone.risk === "medium" ? "#f39c12" : "#2ecc71",
                strokeOpacity: 0.8,
              }}
            />
          </div>
        ))}
        {location && <Marker position={{ lat: location.lat, lng: location.lng }} label="You" />}
      </GoogleMap>
    </LoadScript>
  </div>
)}
        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            {[
              { icon: "🚨", label: "SOS Triggered", value: sosHistory.length, color: "#e74c3c" },
              { icon: "👥", label: "Emergency Contacts", value: contacts.length, color: "#3498db" },
              { icon: "🔔", label: "Total Alerts", value: notifications.length, color: "#f39c12" },
              { icon: "📅", label: "Last Active", value: "Today", color: "#2ecc71" },
              { icon: "🛡️", label: "Safety Score", value: "95%", color: "#9b59b6" },
              { icon: "📍", label: "Location Status", value: location ? "Active" : "Inactive", color: location ? "#2ecc71" : "#e74c3c" },
            ].map((item, i) => (
              <div key={i} style={{ background: cardBg, padding: "25px", borderRadius: "20px", boxShadow: "0 5px 20px rgba(0,0,0,0.08)", textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem" }}>{item.icon}</div>
                <h3 style={{ color: item.color, fontSize: "2rem", margin: "10px 0 5px", fontWeight: "900" }}>{item.value}</h3>
                <p style={{ color: textColor, fontSize: "13px", margin: 0 }}>{item.label}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;