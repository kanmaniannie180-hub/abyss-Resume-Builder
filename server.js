
require("dns").setDefaultResultOrder("ipv4first");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const resumeRoutes = require("./routes/resumeRoutes"); // ← added
console.log("Resume routes loaded");

const app = express();

// middleware

app.use(cors())
app.use(express.json())
app.use("/api/resume", resumeRoutes); // ← added

// test route
app.get("/", (req, res) => {
  res.send("Abyss backend running");
});

console.log("URI:", process.env.MONGO_URI);

// Mongo connect
mongoose.connect(process.env.MONGO_URI, {
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  serverSelectionTimeoutMS: 15000,
  family: 4
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
