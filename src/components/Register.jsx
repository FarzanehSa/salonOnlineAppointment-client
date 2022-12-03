import {React, useContext} from 'react';
import { NavLink, useNavigate, Navigate} from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';

import GeneralContext from "../contexts/GeneralContext";
import useLoginForm from "../hooks/useLoginForm";
import './Register.scss';

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

const Register = ({onRegister, error, setError}) => {

  const { user } = useContext(GeneralContext);

  const baseFormRegister = { firstname: "", lastname:"", email:"", password: "", tel:"" };
  const { formData, handleChange, handleSubmit } = useLoginForm(baseFormRegister, onRegister, setError);

  // console.log(formData);

  if (user.id) {
    return <Navigate to="/" />;
  }

  return (
    <div className='login-modal'>
      <div className='left-section'>
        <img src="https://res.cloudinary.com/demoshoebox/image/upload/v1669945577/Salon/important/1_vtbdyv.jpg" alt="salon" className='register-image'/>
      </div>
      <div className='right-section'>
        <span className='title'>Sign Up</span>
        <form onSubmit={handleSubmit} className='login-form'>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
            <div className='name-sec'>
              <div className='login-firstname'>
                <CssTextField
                  required 
                  id="firstname"
                  // label="First Name"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  variant="outlined"
                  margin="normal"
                  size="small"
                  placeholder="First Name"
                />
              </div>
              <div className='login-lastname'>
                <CssTextField
                  required 
                  id="lastname"
                  // label="Last Name"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  variant="outlined"
                  margin="normal"
                  size="small"
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div className='login-username'>
              <CssTextField
                required 
                id="tel"
                // label="Mobile Number"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                size="small"
                placeholder="Mobile Number"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon="fa-solid fa-phone" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className='login-username'>
              <CssTextField
                required 
                id="email"
                // label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                size="small"
                placeholder="Email"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon="fa-solid fa-envelope" />
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
                value={formData.password}
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
          <button type="submit" className="btn-login-button"> Create Account </button>
          <div>
            <span className='text'>Already have an account?</span>
            <NavLink className="navlink" to="/login"><button type="button" className="btn-go-to-login">Login</button></NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;