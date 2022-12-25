import { React, useContext } from 'react';
import { NavLink } from 'react-router-dom';

import GeneralContext from "../../contexts/GeneralContext";
import './NavbarAdmin.scss';

const NavbarAdmin = (props) => {

  const { user, storeInfo } = useContext(GeneralContext);

  return (
    <div className="navbar-admin-page" style={{zIndex:props.zIndex}}>
      <div className='logo-name'>
        <img className='logo-image' src={storeInfo.logo} alt="logo" />
        <div className='logo-name'>
          <NavLink className="navlink" to="/">{storeInfo.name}</NavLink>
        </div>
      </div>
      <div className='main-links'>
        <button className='nav-buttons'><NavLink className="navlink" to="/dashboard">Settings</NavLink></button>
        <button className='nav-buttons'><NavLink className="navlink" to="/dashboard/reports">Reports</NavLink></button>
      </div>
      <div className='login-part'>
        {user.id && !user.access && 
          <div className='user-log'>
            <div className='welcome-text'>
              <span>Welcome, </span>
              <span>{user.firstname}!</span>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default NavbarAdmin;