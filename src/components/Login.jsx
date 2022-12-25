import {React, useContext, useEffect} from 'react';
import { NavLink, useNavigate} from 'react-router-dom';

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

const Login = ({onLogin, error, setError, wantToBook}) => {

  const { user } = useContext(GeneralContext);

  const baseFormLogin = { email: "", password: "" };
  const { formData, handleChange, handleSubmit } = useLoginForm(baseFormLogin, onLogin, setError);
  const navigate = useNavigate();

  useEffect(() => {
    setError('');
  }, []); // eslint-disable-line

  useEffect(() => {
    if (user.id) {
      navigate(-1);
    }
  }, [user]); // eslint-disable-line

  return (
    <div className='login-page'>
      <div className='left-section'>
        <img src="https://res.cloudinary.com/demoshoebox/image/upload/v1669945577/Salon/important/1_vtbdyv.jpg" alt="salon" className='register-image'/>
      </div>
      <div className='right-section'>
        <span className='title'>Welcome</span>
        <form onSubmit={handleSubmit} className='login-form'>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
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
          <button type="submit" className="btn-login-button"> Login </button>
          <div>
            <span className='text'>Don't have an account?</span>
            <NavLink className="navlink" to="/register"><button type="button" className="btn-go-to-login">Sign Up Now</button></NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;