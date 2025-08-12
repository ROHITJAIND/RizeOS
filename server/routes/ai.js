const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const User = require('../models/User');
const multer = require('multer');
const pdfParse = require('pdf-parse');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const SKILL_LIST = [ ];



router.post('/upload-resume', upload.single('resume'), async (req, res) => {
    
});


router.get('/match-score/:jobId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const job = await Job.findById(req.params.jobId);

    if (!job || !user) {
      return res.status(404).json({ msg: 'Job or user not found' });
    }

    const userSkills = new Set((user.skills || []).map(s => s.toLowerCase()));
    const jobSkills = new Set((job.skills || []).map(s => s.toLowerCase()));

    if (jobSkills.size === 0) {
      
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
        
        const user = await User.findById(req.user.id);
        if (!user || !user.skills || user.skills.length === 0) {
            
            return res.json([]);
        }

        const userSkills = user.skills;
        const recommendedJobs = await Job.find({
            skills: { $in: userSkills }, 
            postedBy: { $ne: req.user.id }
        })
        .limit(5) 
        .sort({ createdAt: -1 })
        .populate('postedBy', ['name', 'email']); 

        res.json(recommendedJobs);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;