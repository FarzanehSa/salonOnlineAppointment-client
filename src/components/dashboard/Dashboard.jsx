import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './Dashboard.scss';

const Dashboard = () => {

  return (
    <div className="dashboard-page">
      <NavLink to="/dashboard/service-group">
        <button className="btn-setting">
          <div className="sign"><FontAwesomeIcon icon="fa-solid fa-gear" /></div>
          <span>Service Groups</span>
        </button>
      </NavLink>
      <NavLink to="/dashboard/service">
        <button className="btn-setting">
          <div className="sign"><FontAwesomeIcon icon="fa-solid fa-gear" /></div>
          <span>Services</span>
        </button>
      </NavLink>
      <NavLink to="/dashboard/employee">
        <button className="btn-setting">
          <div className="sign"><FontAwesomeIcon icon="fa-solid fa-gear" /></div>
          <span>Stylists</span>
        </button>
      </NavLink>
      <NavLink to="/dashboard/availability">
        <button className="btn-setting">
          <div className="sign"><FontAwesomeIcon icon="fa-solid fa-gear" /></div>
          <span>Stylist's Availabilities</span>
        </button>
      </NavLink>
    </div>
  )
}

export default Dashboard;