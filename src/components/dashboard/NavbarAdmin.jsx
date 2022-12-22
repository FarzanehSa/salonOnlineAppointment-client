import {React, useContext, useState} from 'react';
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import GeneralContext from "../../contexts/GeneralContext";
import './NavbarAdmin.scss';

const NavbarAdmin = ({setUser}) => {

  const { user } = useContext(GeneralContext);
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => {
    setSidebar(!sidebar);
  };


  return (
    <div className="navbar">
      <div className='logo-name'>
        <img className='logo-image' src='https://res.cloudinary.com/demoshoebox/image/upload/v1666570065/Salon/logo-salon_ih1z7f.png' alt="logo" />
        <div className='logo-name'>
          <NavLink className="navlink" to="/">Salon</NavLink>
        </div>
      </div>
      <div className='main-links'>
        <button className='nav-buttons'><NavLink className="navlink" to="/dashboard">Settings</NavLink></button>
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
          </div>
        </nav>
      </div>
    </div>
  )
}

export default NavbarAdmin;