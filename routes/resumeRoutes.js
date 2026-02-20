const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume");

console.log("LOADED resumeRoutes.js from:", __filename);

// ✅ TEST ROUTE (ADD THIS)
router.get("/test", (req, res) => {
  res.json({ message: "Resume API working" });
});

// POST /api/resume/save
router.post("/save", async (req, res) => {
  console.log("SAVE ROUTE HIT"); 
  try {
    const resume = new Resume(req.body);
    await resume.save();
    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/resume/:userId
router.get("/:userId", async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.params.userId });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;