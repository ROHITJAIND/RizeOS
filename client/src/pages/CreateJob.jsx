import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import setAuthToken from '../utils/setAuthToken';
import { ethers } from 'ethers'; 

const CreateJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    budget: '',
  });
  
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { title, description, skills, budget } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  
   const handlePayment = async () => {
    setIsProcessing(true);
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not detected. Please install it.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const network = await provider.getNetwork();
      
      const tx = await signer.sendTransaction({
        to: import.meta.env.VITE_ADMIN_WALLET_ADDRESS,
        value: ethers.parseEther("0.001") 
      });
      
      await tx.wait();

      
      alert("Payment of 0.001 POL successful!"); 
      setPaymentSuccess(true);

    } catch (error) {
      console.error(error);
      if (error.code !== 'ACTION_REJECTED') {
          alert(error.message || "Payment failed. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!paymentSuccess) {
      alert("Please complete the payment before posting the job.");
      return;
    }

    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      await axios.post('/api/jobs/post', formData);
      alert('Job posted successfully!');
      navigate('/jobs');
    } catch (err) {
      console.error(err.response.data);
      alert('Failed to post job.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Post a New Job</h1>
      <form onSubmit={onSubmit}>
        <input name="title" value={title} onChange={onChange} placeholder="Job Title" required /><br />
        <textarea name="description" value={description} onChange={onChange} placeholder="Job Description" required></textarea><br />
        <input name="skills" value={skills} onChange={onChange} placeholder="Skills (comma-separated)" required /><br />
        <input name="budget" value={budget} onChange={onChange} placeholder="Budget / Salary" required /><br />
        
        <hr style={{margin: '20px 0'}} />

        <h2>Payment</h2>
        {!paymentSuccess ? (
          <div>
            <h3>Step 2: Pay Platform Fee</h3>
            <p>A one-time fee of 0.001 POL is required to post a job.</p>
            <button type="button" onClick={handlePayment} disabled={isProcessing}>
              {isProcessing ? 'Processing Payment...' : 'Pay with MetaMask'}
            </button>
          </div>
        ) : (
          <p style={{ color: 'green' }}>✔ Payment Successful!</p>
        )}

        <hr style={{margin: '20px 0'}}/>

        
        <button type="submit" disabled={!paymentSuccess || isProcessing}>
          Post Job
        </button>
      </form>
    </div>
  );
};

export default CreateJob;