import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from '../components/jobs/JobCard';

const JobFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const url = `http://localhost:5001/api/jobs?skill=${filter}`;
        const res = await axios.get(url);
        setJobs(res.data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    const searchTimeout = setTimeout(() => {
        fetchJobs();
    }, 500);
    return () => clearTimeout(searchTimeout);
  }, [filter]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
      <h1 style={{ textAlign: 'center', color: 'var(--primary-color)' }}>
        Open Positions
      </h1>

      <div className="form-group">
        <input
          type="text"
          placeholder="Filter by skill... (e.g., React, Python)"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading jobs...</p>
      ) : jobs.length > 0 ? (
      
        <div className="jobs-grid-container">
          {jobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>No jobs found matching your criteria.</p>
      )}
    </div>
  );
};

export default JobFeed;