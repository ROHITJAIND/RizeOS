const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the auth middleware
const User = require('../models/User');

// @route   GET /api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // req.user.id is available from the auth middleware
    const profile = await User.findById(req.user.id).select('-password');
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/profile/update
// @desc    Update user profile
// @access  Private
router.put('/update', auth, async (req, res) => {
  const { name, bio, linkedInUrl, skills, walletAddress } = req.body;

  // Build profile object
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
      { new: true } // Return the new document
    ).select('-password');

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/profile/:userId
// @desc    Get profile by user ID
// @access  Public
router.get('/:userId', async (req, res) => {
    try {
      const profile = await User.findById(req.params.userId).select('-password');
      if(!profile) return res.status(404).json({ msg: 'Profile not found' });

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      if(err.kind == 'ObjectId') {
        return res.status(404).json({ msg: 'Profile not found' });
      }
      res.status(500).send('Server Error');
    }
});


module.exports = router;