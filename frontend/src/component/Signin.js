import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Signin.css'; // Include this CSS file

const Signin = () => {
  const [credentials, setCrendentials] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`https://mappin-pzu8.onrender.com/api/auth/createuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password
      })
    });

    const json = await response.json();
    console.log(json);

    if (json.success) {
      localStorage.setItem('token', json.authtoken);
      navigate('/');
    } else {
      alert("Invalid credentials");
    }
  };

  const onChange = (e) => {
    setCrendentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2 className="signin-title">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id='name' name='name' onChange={onChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id='email' name='email' onChange={onChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id='password' name='password' onChange={onChange} required />
          </div>
          <div className="form-group text-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
          <div className="form-group">
            <button className="signin-btn" type="submit">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;



