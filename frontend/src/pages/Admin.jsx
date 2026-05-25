import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchSOS();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://sheshield-api.onrender.com/api/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSOS = async () => {
    try {
      const res = await axios.get("http://sheshield-api.onrender.com/api/admin/sos");
      setSosAlerts(res.data.sos);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e" }}>
      <div style={{ background: "linear-gradient(135deg, #c44569, #6c5ce7)", padding: "20px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "white", margin: 0 }}>👮 Admin Panel</h1>
        <button onClick={() => navigate("/dashboard")} style={{ padding: "8px 16px", background: "white", color: "#c44569", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
          Back
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", padding: "20px" }}>
        <div style={{ background: "#16213e", padding: "25px", borderRadius: "15px", textAlign: "center" }}>
          <div style={{ fontSize: "2rem" }}>👥</div>
          <h3 style={{ color: "#3498db", fontSize: "2rem", margin: "10px 0" }}>{users.length}</h3>
          <p style={{ color: "#aaa", margin: 0 }}>Total Users</p>
        </div>
        <div style={{ background: "#16213e", padding: "25px", borderRadius: "15px", textAlign: "center" }}>
          <div style={{ fontSize: "2rem" }}>🚨</div>
          <h3 style={{ color: "#e74c3c", fontSize: "2rem", margin: "10px 0" }}>{sosAlerts.length}</h3>
          <p style={{ color: "#aaa", margin: 0 }}>Total SOS</p>
        </div>
        <div style={{ background: "#16213e", padding: "25px", borderRadius: "15px", textAlign: "center" }}>
          <div style={{ fontSize: "2rem" }}>✅</div>
          <h3 style={{ color: "#2ecc71", fontSize: "2rem", margin: "10px 0" }}>{users.length}</h3>
          <p style={{ color: "#aaa", margin: 0 }}>Active Users</p>
        </div>
        <div style={{ background: "#16213e", padding: "25px", borderRadius: "15px", textAlign: "center" }}>
          <div style={{ fontSize: "2rem" }}>📅</div>
          <h3 style={{ color: "#f39c12", fontSize: "1rem", margin: "10px 0" }}>{new Date().toLocaleDateString()}</h3>
          <p style={{ color: "#aaa", margin: 0 }}>Today</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", padding: "0 20px 20px" }}>
        <button onClick={() => setActiveTab("users")} style={{ padding: "10px 25px", borderRadius: "25px", border: "none", background: activeTab === "users" ? "linear-gradient(135deg, #c44569, #6c5ce7)" : "#16213e", color: "white", cursor: "pointer", fontWeight: "bold" }}>
          👥 Users
        </button>
        <button onClick={() => setActiveTab("sos")} style={{ padding: "10px 25px", borderRadius: "25px", border: "none", background: activeTab === "sos" ? "linear-gradient(135deg, #c44569, #6c5ce7)" : "#16213e", color: "white", cursor: "pointer", fontWeight: "bold" }}>
          🚨 SOS Alerts
        </button>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        {activeTab === "users" && (
          <div style={{ background: "#16213e", borderRadius: "15px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#c44569" }}>
                  <th style={{ padding: "15px", color: "white", textAlign: "left" }}>#</th>
                  <th style={{ padding: "15px", color: "white", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "15px", color: "white", textAlign: "left" }}>Email</th>
                  <th style={{ padding: "15px", color: "white", textAlign: "left" }}>Phone</th>
                  <th style={{ padding: "15px", color: "white", textAlign: "left" }}>Contacts</th>
                  <th style={{ padding: "15px", color: "white", textAlign: "left" }}>SOS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #1a1a2e" }}>
                    <td style={{ padding: "15px", color: "#aaa" }}>{i + 1}</td>
                    <td style={{ padding: "15px", color: "white", fontWeight: "bold" }}>{user.name}</td>
                    <td style={{ padding: "15px", color: "#aaa" }}>{user.email}</td>
                    <td style={{ padding: "15px", color: "#aaa" }}>{user.phone}</td>
                    <td style={{ padding: "15px", color: "#2ecc71" }}>{user.emergencyContacts?.length || 0}</td>
                    <td style={{ padding: "15px", color: "#e74c3c", fontWeight: "bold" }}>{user.sosHistory?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "sos" && (
          <div style={{ background: "#16213e", borderRadius: "15px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#e74c3c" }}>
                  <th style={{ padding: "15px", color: "white", textAlign: "left" }}>#</th>
                  <th style={{ padding: "15px", color: "white", textAlign: "left" }}>User</th>
                  <th style={{ padding: "15px", color: "white", textAlign: "left" }}>Time</th>
                  <th style={{ padding: "15px", color: "white", textAlign: "left" }}>Location</th>
                  <th style={{ padding: "15px", color: "white", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "15px", color: "white", textAlign: "left" }}>Map</th>
                </tr>
              </thead>
              <tbody>
                {sosAlerts.map((sos, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #1a1a2e" }}>
                    <td style={{ padding: "15px", color: "#aaa" }}>{i + 1}</td>
                    <td style={{ padding: "15px", color: "white", fontWeight: "bold" }}>{sos.userName}</td>
                    <td style={{ padding: "15px", color: "#aaa" }}>{new Date(sos.time).toLocaleString()}</td>
                    <td style={{ padding: "15px", color: "#aaa" }}>{sos.location?.lat?.toFixed(4)}, {sos.location?.lng?.toFixed(4)}</td>
                    <td style={{ padding: "15px" }}><span style={{ background: "#2ecc71", color: "white", padding: "4px 10px", borderRadius: "20px", fontSize: "12px" }}>{sos.status}</span></td>
                    <td style={{ padding: "15px" }}>
                      <a href={"https://www.google.com/maps?q=" + sos.location?.lat + "," + sos.location?.lng} target="_blank" rel="noreferrer" style={{ color: "#3498db", textDecoration: "none", fontWeight: "bold" }}>📍 View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;