import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 

const Register = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const newUser = { name, email, password };

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const body = JSON.stringify(newUser);
      const res = await axios.post(
        'http://localhost:5001/api/auth/register',
        body,
        config
      );

      console.log('Server Response:', res.data);
      alert('Registration successful! Redirecting to login...');
      
      navigate('/login'); 

    } catch (err) {
      console.error('Error from server:', err.response.data);
      alert('Error: ' + err.response.data.msg);
    }
  };

   return (
    <div className="form-container">
      <h1>Create Your Account</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" name="name" value={name} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input id="email" type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" value={password} onChange={onChange} minLength="6" required />
        </div>
        <button type="submit" className="btn">Register</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default Register;