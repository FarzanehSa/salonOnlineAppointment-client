import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './Dashboard.scss';

const Dashboard = () => {

  return (
    <div className="dashboard-page">
      <NavLink to="/dashboard/reports/appointments">
        <button className="btn-setting">
          <div className="sign"><FontAwesomeIcon icon="fa-solid fa-scroll" /></div>
          <span>Appointments Report</span>
        </button>
      </NavLink>
      <NavLink to="/dashboard/reports/customers">
        <button className="btn-setting">
          <div className="sign"><FontAwesomeIcon icon="fa-solid fa-scroll" /></div>
          <span>Customers Report</span>
        </button>
      </NavLink>
    </div>
  )
}

export default Dashboard;