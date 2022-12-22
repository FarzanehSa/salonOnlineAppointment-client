import { NavLink } from 'react-router-dom';

import './Home.scss';

const Home = () => {

  return (
    <div className="home-page">
      <div className="info">
        <video autoPlay muted loop className='video'>
          <source 
            src="https://res.cloudinary.com/demoshoebox/video/upload/v1671740400/Salon/important/desk_veoo9p.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="info-details">
          <span className="title">Salon</span>
          <p className="address">
            <span className="text-address">234 Robson, Vancouver</span>
            <span>(778)123-456</span>
          </p>
          <NavLink className="navlink" to="/booking"><button className="btn-booking">Book Online</button></NavLink>
        </div>
      </div>
    </div>
  )
}

export default Home;