import {React, useContext, useState} from 'react';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import GeneralContext from "../contexts/GeneralContext";
import './Navbar.scss';

const Navbar = ({setUser}) => {

  const { user, storeInfo } = useContext(GeneralContext);
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => {
    setSidebar(!sidebar);
  };


  return (
    <div className="navbar">
      <div className='logo-name'>
        <img className='logo-image' src={storeInfo.logo} alt="logo" />
        <div className='logo-name' >{storeInfo.name}</div>
      </div>
      <div className='main-links'>
        <button className='nav-buttons'><NavLink className="navlink" to="/services">Services</NavLink></button>
        <button className='nav-buttons'><NavLink className="navlink" to="/stylists">Stylists</NavLink></button>
        <button className='nav-buttons'><NavLink className="navlink" to="/booking">Book Now</NavLink></button>
      </div>
      <div className='login-part'>
        {!user.id &&
          <button className='nav-buttons'><NavLink className="navlink" to="/login">Login</NavLink></button>
        }

        {user.id &&
          <div className='user-log'>
            <div className='welcome-text'>
              <span>Welcome, </span>
              <span>{user.firstname}!</span>
            </div>
            <NavLink to="#" className='menu-bars'>
              <FontAwesomeIcon className='bar' icon="fa-solid fa-grip-lines" onClick={() => showSidebar()} />
            </NavLink>
          </div>
        }
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <div 
            className='nav-menu-items'
            onClick={() => showSidebar()}
            onMouseLeave={() => setSidebar(false)}
          >
            <button className='btn-logout' onClick={() => {setUser({})}}>Logout</button>
            <button className='btn-logout'><NavLink className="navlink" to={`/appointments/${user.id}`}>Appointments</NavLink></button>
            {user.access === 0 &&
              <button className='btn-logout'><NavLink className="navlink" to={`/dashboard`}>Admin Dashboard</NavLink></button>
            }
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Navbar;