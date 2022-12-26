import {React, useState} from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';

import './AdminLogin.scss';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'black',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'black',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'LightGray',
    },
    '&:hover fieldset': {
      borderColor: 'Goldenrod',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'Plum',
    },
  },
});

const Login = ({setUser}) => {

  const [loginForm, setLoginForm] = useState({email: "", password: ""})
  const [error, setError] = useState(''); 

  const handleChange = (event) => {
    const { name, value } = event.target;
    setError('');
    setLoginForm({ ...loginForm, [name]: value });
  };

  const onLogin = (event) => {
    event.preventDefault();
    axios.post(`${url}/api/login`, {info: {...loginForm}})
    .then(res => {
      if (res.data.errorCode) {
        setError(res.data.errorMsg);
      } else {
        const userX = res.data.user;
        if (userX.access !== 0) {
          setError("No admin access!");
        } else {
          setUser(userX);
          setError("");
        }
      }
    })
    .catch(error => {
      console.log(error.message);
    })
  }


  return (
    <div className='login-modal'>
      <div className='left-section'>
        <img src="https://res.cloudinary.com/demoshoebox/image/upload/v1669945577/Salon/important/1_vtbdyv.jpg" alt="salon" className='register-image'/>
      </div>
      <div className='right-section'>
        <span className='title'>Admin Login</span>
        <form onSubmit={onLogin} className='login-form'>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
            <div className='login-username'>
              <CssTextField
                required 
                id="email"
                // label="Email"
                name="email"
                value={loginForm.email}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                size="small"
                placeholder="Username"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon="fa-solid fa-user-secret" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className='login-username'> 
              <CssTextField
                required 
                id="password"
                // label="Password"
                name="password"
                type="password" 
                value={loginForm.password}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                size="small"
                placeholder="Password"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon="fa-solid fa-lock" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </Box>
          {error && <span className='login-error'>{error}</span>}
          <button type="submit" className="btn-login-button"> Login </button>
        </form>
      </div>
    </div>
  );
};

export default Login;