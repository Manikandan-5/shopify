import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Clear previous error
    setError(''); 

    try {
      const response = await axios.post(
        'http://beta.hrmetrics.mv/interview/api/Auth/GetAccess',
        { userName, password },
        {
            headers: {
                'Content-Type': 'multipart/form-data',
       
              },
        }
      );

      if (response.data && response.data.Data && response.data.Data.Token) {
        const token = response.data.Data.Token;
        // console.log('Token:', token);
        // Store the token in localStorage
        localStorage.setItem('authToken', token); 
        alert('Login successful!');
        // Redirect to the home page
        navigate('/home'); 
      } else {
        setError('Invalid credentials Please Check It!!');
      }
    } catch (err) {
      if (err.response) {
        setError(`Error: ${err.response.statusText || 'Something went wrong'}`);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      console.error(err);
      
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center fw-bold">
              <i className="bi bi-buildings"></i> 
                 &nbsp; BSS Pvt Ltd</h2>
                <h5 className="text-center">Hii, Welcome back <i className="bi bi-person-raised-hand"></i></h5>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="userName" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {/* show the error message */}
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
