import { NavLink } from 'react-router-dom';

import './Navbar.scss';
const Navbar = () => {
  return (
    <div className="navbar">
      <div className='logo-name'>
        <img className='logo-image' src='https://res.cloudinary.com/demoshoebox/image/upload/v1666570065/Salon/logo-salon_ih1z7f.png' alt="logo" />
        <div className='logo-name' >Salon</div>
      </div>
      <div className='main-links'>
        <button className='nav-buttons'><NavLink className="navlink" to="/services">Services</NavLink></button>
        <button className='nav-buttons'><NavLink className="navlink" to="/stylists">Stylists</NavLink></button>
        <button className='nav-buttons'><NavLink className="navlink" to="/booking">Book Now</NavLink></button>
      </div>
      <div>
        <button className='nav-buttons'><NavLink className="navlink" to="/login">Login</NavLink></button>
      </div>
    </div>
  )
}

export default Navbar;