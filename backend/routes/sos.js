const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/send", async (req, res) => {
  try {
    const { userId, location, city } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.sosHistory.push({ location, city: city || "Unknown", status: "Sent" });
    await user.save();

    res.json({
      message: "SOS Alert Sent!",
      user: user.name,
      contacts: user.emergencyContacts,
      location,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/history/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ history: user.sosHistory });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;