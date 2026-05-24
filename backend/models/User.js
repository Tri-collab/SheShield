const mongoose = require("mongoose");

const SOSSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now },
  location: { lat: Number, lng: Number },
  city: { type: String, default: "Unknown" },
  status: { type: String, default: "Sent" },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  emergencyContacts: [{ name: String, phone: String }],
  sosHistory: [SOSSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);