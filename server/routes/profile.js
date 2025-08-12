const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await User.findById(req.user.id).select('-password');
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/update', auth, async (req, res) => {
  const { name, bio, linkedInUrl, skills, walletAddress } = req.body;

  const profileFields = {};
  if (name) profileFields.name = name;
  if (bio) profileFields.bio = bio;
  if (linkedInUrl) profileFields.linkedInUrl = linkedInUrl;
  if (walletAddress) profileFields.walletAddress = walletAddress;
  if (skills) {
    profileFields.skills = Array.isArray(skills)
      ? skills
      : skills.split(',').map((skill) => skill.trim());
  }

  try {
    let profile = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const profile = await User.findById(req.params.userId).select('-password');
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
