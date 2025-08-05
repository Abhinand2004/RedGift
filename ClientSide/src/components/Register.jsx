import React, { useEffect, useState } from 'react';
import './Login.css';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import logo from './logo.png';
import { BASE_URL } from './api.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [usertype, setUsertype] = useState('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
    const navigates=useNavigate()
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleRegister = async () => {
    console.log(name,email,password,phone);
    
    try {
      let endpoint = '';

      switch (usertype) {
        case 'user':
          endpoint = `${BASE_URL}/adduser`;
          break;
        case 'hospital':
          endpoint = `${BASE_URL}/addhospital`;
          break;
        case 'college':
          endpoint = `${BASE_URL}/addcollege`;
          break;
        default:
          throw new Error('Invalid user type');
      }

      const payload = { name, email, password, phone };
      const response = await axios.post(endpoint, payload);

      alert("Registered successfully!");
      navigates("/login")
      // Optional: Redirect to login
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="login-outer">
      <div className={`login-container ${isLoaded ? 'fade-in' : ''}`}>
        <div className="login-main">
          {/* Left: Image */}
          <div className="login-right" />

          {/* Right: Form */}
          <div className="login-left">
            <div className="login-box">
              {/* Branding */}
              <div className="branding">
                <img src={logo} alt="RedGift Logo" className="logo-img" />
                <h1 className="project-title">RedGift</h1>
              </div>

              {/* Role Dropdown */}
              <FormControl fullWidth margin="normal">
                <InputLabel id="usertype-label">Select Role</InputLabel>
                <Select
                  labelId="usertype-label"
                  value={usertype}
                  label="Select Role"
                  onChange={(e) => setUsertype(e.target.value)}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="hospital">Hospital</MenuItem>
                  <MenuItem value="college">College</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Name"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
                   <TextField
                label="Phone Number"
                type="tel"
                fullWidth
                margin="normal"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <TextField
                label="Email ID"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
         

              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={handleRegister}
              >
                Register
              </Button>

              <p className="register-link">
                Already have an account? <a href="/login">Login</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
