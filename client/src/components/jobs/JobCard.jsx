import React, { useState } from 'react';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';

const JobCard = ({ job }) => {
  const [match, setMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = !!localStorage.getItem('token');

  const getMatchScore = async () => {
    if (!isAuthenticated) {
      alert('Please log in to see your match score.');
      return;
    }
    
    setIsLoading(true);
    
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get(`/api/ai/match-score/${job._id}`);
      setMatch(res.data);
    } catch (err) {
      console.error(err);
      alert('Could not calculate match score.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>{job.title}</h3>
      <p><strong>Posted by:</strong> {job.postedBy.name} | <strong>Budget:</strong> {job.budget}</p>
      <p>{job.description}</p>
      <div className="skills-list">
        {job.skills.map(skill => (
          <span key={skill} className="skill-tag">{skill}</span>
        ))}
      </div>

      
      {isAuthenticated && (
        <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          {!match ? (
            <button onClick={getMatchScore} disabled={isLoading} className="btn btn-secondary" style={{width: 'auto'}}>
              {isLoading ? 'Calculating...' : 'See Your Match Score'}
            </button>
          ) : (
            <div>
              <h4>Your Match: <span style={{color: 'var(--primary-color)'}}>{match.score}%</span></h4>
              {match.matchedSkills.length > 0 && <p>✅ You have: {match.matchedSkills.join(', ')}</p>}
              {match.missingSkills.length > 0 && <p>❌ You're missing: {match.missingSkills.join(', ')}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;