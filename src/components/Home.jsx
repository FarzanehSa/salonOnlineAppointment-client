import { NavLink } from 'react-router-dom';

import './Home.scss';

const Home = () => {

  return (
    <div className="home-page">
      <div className="info">
        <p>
          <span className="title">Salon</span>
        </p>
        <p className="address">
          <span className="text-address">234 Robson, Vancouver</span>
          <span>(778)123-456</span>
        </p>
        <button className="btn-booking"><NavLink className="navlink" to="/booking">Book Online</NavLink></button>
      </div>
    </div>
  )
}

export default Home;