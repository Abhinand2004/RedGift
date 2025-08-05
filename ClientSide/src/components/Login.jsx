import React, { useEffect, useState } from 'react';
import './Login.css';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import logo from './logo.png';
import { BASE_URL } from './api'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [usertype, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate()
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
    // console.log(usertype);
  
    
  }, [usertype]);

  const handleLogin = async () => {
    try {
        console.log(usertype,email);
        
      const payload = { usertype, email };
      if (usertype !== 'student') payload.password = password;

      const response = await axios.post(`${BASE_URL}/login`, payload);
        console.log(response);
        
      const { token} = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userType', usertype);
      alert("Login successful!");
      navigate("/")
      // Redirect if needed
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-outer">
      <div className={`login-container ${isLoaded ? 'fade-in' : ''}`}>
        <div className="login-main">
          <div className="login-left">
            <div className="login-box">
              {/* Logo and Title */}
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
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="college">College</MenuItem>
                  <MenuItem value="hospital">Hospital</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                </Select>
              </FormControl>

              {/* Email Field */}
              <TextField
                label="Email ID"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Password Field: show only if NOT student */}
              {usertype !== 'student' && (
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}

              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={handleLogin}
              >
                Login
              </Button>

              <p className="register-link">
                Don't have an account? <a href="/register">Register</a>
              </p>
            </div>
          </div>
          <div className="login-right" />
        </div>
      </div>
    </div>
  );
};
