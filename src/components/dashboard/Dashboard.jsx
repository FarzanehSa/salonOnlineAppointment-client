import { useContext, useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './Dashboard.scss';

const Dashboard = () => {

  return (
    <div className="dashboard-page">
      <NavLink to="/dashboard/service-group">
        <button className="btn-setting">
          <div className="sign"><FontAwesomeIcon icon="fa-solid fa-gear" /></div>
          <br/>Service Group
        </button>
      </NavLink>
    </div>
  )
}

export default Dashboard;