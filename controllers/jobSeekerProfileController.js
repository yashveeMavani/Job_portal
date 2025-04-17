const { JobSeekerProfile } = require('../models');

exports.createOrUpdateProfile = async (req, res) => {
  try {
    const {  fullName, dob, gender, phone, address, skills, education, experience, certifications} = req.body;
    const userId = req.user.id;
    const resume = req.file?.filename;

    const [profile, created] = await JobSeekerProfile.upsert({
        userId,
        fullName,
        dob,
        gender,
        phone,
        address,
        resume,
        skills,
        education,
        experience,
        certifications
    }, { returning: true });

    res.status(200).json({ message: 'Profile saved', profile });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Profile save failed' });
  }
};
exports.updateJobSeekerProfile = async (req, res) => {
    try {
      const userId = req.user.id; 
      const existingProfile = await JobSeekerProfile.findOne({ where: { userId } });
  
      if (!existingProfile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
  
      if (req.file) {
        existingProfile.resume = req.file.filename;
      }
  
      const { skills, education, experience, certifications, fullName, dob, gender, phone, address } = req.body;
  
      await existingProfile.update({
        skills,
        education,
        experience,
        certifications,
        fullName,
        dob,
        gender,
        phone,
        address,
        resume: existingProfile.resume
      });
  
      res.json({ message: 'Profile updated successfully', profile: existingProfile });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  };
  