const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/add", async (req, res) => {
try {
const { userId, name, phone } = req.body;
const user = await User.findById(userId);
if (!user) return res.status(404).json({ message: "User not found" });

if (user.emergencyContacts.length >= 5) {  
  return res.status(400).json({ message: "Maximum 5 contacts allowed!" });  
}  

user.emergencyContacts.push({ name, phone });  
await user.save();  
res.json({ message: "Contact added!", contacts: user.emergencyContacts });

} catch (err) {
res.status(500).json({ message: "Server error" });
}
});

router.get("/:userId", async (req, res) => {
try {
const user = await User.findById(req.params.userId);
if (!user) return res.status(404).json({ message: "User not found" });
res.json({ contacts: user.emergencyContacts });
} catch (err) {
res.status(500).json({ message: "Server error" });
}
});

router.delete("/:userId/:contactId", async (req, res) => {
try {
const user = await User.findById(req.params.userId);
if (!user) return res.status(404).json({ message: "User not found" });

user.emergencyContacts = user.emergencyContacts.filter(  
  (c) => c._id.toString() !== req.params.contactId  
);  
await user.save();  
res.json({ message: "Contact deleted!", contacts: user.emergencyContacts });

} catch (err) {
res.status(500).json({ message: "Server error" });
}
});

module.exports = router;