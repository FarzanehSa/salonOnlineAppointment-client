import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import GeneralContext from "../contexts/GeneralContext";
import './Home.scss';

const Home = () => {

  const { storeInfo } = useContext(GeneralContext);

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
          <div className="title">Salon</div>
          <div className="bio">
            <span className='bio-text'>{storeInfo.bio}</span>
          </div>
          <div className="address">
            <span className="text-address">{storeInfo.address}</span>
            <span className="text-tel">{storeInfo.tel}</span>
            <NavLink className="navlink" to="/booking"><button className="btn-booking">Book Online</button></NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;