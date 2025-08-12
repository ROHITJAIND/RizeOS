import React, { useState, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    linkedInUrl: '',
    skills: [],
  });
  const [resumeFile, setResumeFile] = useState(null);

  
  const loadProfile = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get('http://localhost:5001/api/profile/me');
      setProfile(res.data);
      setFormData({
        name: res.data.name || '',
        bio: res.data.bio || '',
        linkedInUrl: res.data.linkedInUrl || '',
        skills: res.data.skills || [],
      });
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  
  const handleExtractSkills = async () => {
    if (!resumeFile) {
      alert('Please select a resume PDF file first.');
      return;
    }
    const fileFormData = new FormData();
    fileFormData.append('resume', resumeFile);

    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };
      const res = await axios.post(
        'http://localhost:5001/api/ai/upload-resume',
        fileFormData,
        config
      );
      const newSkills = new Set([...formData.skills, ...res.data]);
      setFormData({ ...formData, skills: Array.from(newSkills) });
      alert('Skills extracted successfully from your resume!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Could not extract skills from resume.');
    }
  };

  
  const onSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5001/api/profile/update', formData);
      setEditMode(false);
      loadProfile(); 
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err.response.data);
      alert('Failed to update profile.');
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1>My Profile</h1>
          <button
            onClick={() => setEditMode(!editMode)}
            className="btn btn-secondary"
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        <hr />

        {!editMode ? (
          
          <div>
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Bio:</strong> {profile.bio || 'No bio set.'}
            </p>
            <p>
              <strong>LinkedIn:</strong> {profile.linkedInUrl || 'Not set.'}
            </p>
            <p>
              <strong>Skills:</strong>{' '}
              {profile.skills.join(', ') || 'No skills listed.'}
            </p>
          </div>
        ) : (
          
          <form onSubmit={onSave}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label>Bio:</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={onChange}
                rows="3"
              ></textarea>
            </div>
            <div className="form-group">
              <label>LinkedIn URL:</label>
              <input
                type="text"
                name="linkedInUrl"
                value={formData.linkedInUrl}
                onChange={onChange}
              />
            </div>
            <hr />

            
            <h4>AI Skill Extraction</h4>
            <div className="form-group">
              <label>Upload Resume (PDF):</label>
              <input
                type="file"
                name="resume"
                accept=".pdf"
                onChange={onFileChange}
              />
            </div>
            <button
              type="button"
              onClick={handleExtractSkills}
              className="btn btn-secondary"
            >
              Extract Skills from Resume
            </button>
            <hr />

            <div className="form-group">
              <label>Skills (auto-populated):</label>
              <input
                type="text"
                name="skills"
                value={
                  Array.isArray(formData.skills) ? formData.skills.join(',') : ''
                }
                
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skills: e.target.value
                      .split(',') 
                      .map(skill => skill.trim()) 
                      .filter(skill => skill !== '') 
                  })
                }
              />
            </div>
            <hr />
            <button type="submit" className="btn">
              Save Profile
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;