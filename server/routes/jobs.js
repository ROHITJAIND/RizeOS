const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const User = require('../models/User');

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

router.get('/', async (req, res) => {
  try {
    const { skill } = req.query; 

    const queryObject = {}; 

    if (skill) {
      queryObject.skills = { $regex: skill, $options: 'i' };
    }

    
    const jobs = await Job.find(queryObject).sort({ createdAt: -1 }).populate('postedBy', ['name', 'email']);
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;