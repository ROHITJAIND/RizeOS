const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const User = require('../models/User');
const multer = require('multer');
const pdfParse = require('pdf-parse');

// ... (multer config and SKILL_LIST remain the same) ...
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const SKILL_LIST = [ /* ... your full list of skills ... */ ];


// ... (The '/upload-resume' route remains the same) ...
router.post('/upload-resume', upload.single('resume'), async (req, res) => {
    // ... logic for pdf upload
});

// --- UPDATED & IMPROVED: Job Matching Route ---
router.get('/match-score/:jobId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const job = await Job.findById(req.params.jobId);

    if (!job || !user) {
      return res.status(404).json({ msg: 'Job or user not found' });
    }

    // --- ROBUSTNESS CHECK ---
    // Handle cases where skills might be undefined or empty
    const userSkills = new Set((user.skills || []).map(s => s.toLowerCase()));
    const jobSkills = new Set((job.skills || []).map(s => s.toLowerCase()));

    if (jobSkills.size === 0) {
      // If job has no required skills, any user is a 100% match.
      return res.json({ score: 100, matchedSkills: [], missingSkills: [] });
    }

    const matchedSkills = [];
    const missingSkills = [];

    jobSkills.forEach(skill => {
      if (userSkills.has(skill)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const score = Math.round((matchedSkills.length / jobSkills.size) * 100);

    res.json({ score, matchedSkills, missingSkills });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/recommended-jobs', auth, async (req, res) => {
    try {
        // 1. Find the current user to get their skills
        const user = await User.findById(req.user.id);
        if (!user || !user.skills || user.skills.length === 0) {
            // If user has no skills, we can't recommend anything
            return res.json([]);
        }

        const userSkills = user.skills;

        // 2. Find jobs that have at least one skill in common with the user
        //    and were not posted by the user themselves.
        const recommendedJobs = await Job.find({
            skills: { $in: userSkills }, // Find jobs where the skills array contains any of the user's skills
            postedBy: { $ne: req.user.id } // Exclude jobs posted by the user themselves
        })
        .limit(5) // Limit to the top 5 recommendations
        .sort({ createdAt: -1 })
        .populate('postedBy', ['name', 'email']); // Populate with poster's info

        res.json(recommendedJobs);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;