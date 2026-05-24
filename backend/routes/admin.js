const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all SOS alerts
router.get("/sos", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    const allSOS = [];
    users.forEach((user) => {
      user.sosHistory.forEach((sos) => {
        allSOS.push({
          userName: user.name,
          userEmail: user.email,
          userPhone: user.phone,
          time: sos.time,
          location: sos.location,
          status: sos.status,
        });
      });
    });
    allSOS.sort((a, b) => new Date(b.time) - new Date(a.time));
    res.json({ sos: allSOS });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;