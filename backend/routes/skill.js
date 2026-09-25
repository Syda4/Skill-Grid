const express = require("express");
const router = express.Router();
const Skill = require("../models/Skills");

// GET all skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json({ skills });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new skill (Use this in Postman to add your initial skills!)
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const newSkill = new Skill({ name, description });
    await newSkill.save();
    res.status(201).json({ message: "Skill created", skill: newSkill });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;