const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const User = require('../models/User');

// @route   POST /api/jobs/post
// @desc    Create a new job posting
// @access  Private
// This route remains the same
router.post('/post', auth, async (req, res) => {
  const { title, description, skills, budget } = req.body;
  try {
    const newJob = new Job({
      title,
      description,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim()),
      budget,
      postedBy: req.user.id,
    });
    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/jobs
// @desc    Get all job postings (with filtering)
// @access  Public
// --- THIS ROUTE IS UPDATED ---
router.get('/', async (req, res) => {
  try {
    const { skill } = req.query; // Check for a 'skill' query parameter

    const queryObject = {}; // Start with an empty query object

    if (skill) {
      // If a skill is provided, add it to the query.
      // This will find jobs where the 'skills' array contains the provided skill (case-insensitive).
      queryObject.skills = { $regex: skill, $options: 'i' };
    }

    // Pass the queryObject to the find method
    const jobs = await Job.find(queryObject).sort({ createdAt: -1 }).populate('postedBy', ['name', 'email']);
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;