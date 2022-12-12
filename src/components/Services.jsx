import { useContext, useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import GeneralContext from "../contexts/GeneralContext";
import './Services.scss';

const Services = ({reqClicked}) => {

  const { serviceGroups, services } = useContext(GeneralContext);
  const [visGroup, setVisGroup] = useState([]);
  
  useEffect(() => {
    setVisGroup(serviceGroups.map(row => {
      return ({...row, vis: false})
    }))
  }, [serviceGroups]);

  // function to change visibilty of service box!
  const groupClicked = function (id) {
    setVisGroup(visGroup.map(row => {
      if (row.id === id) row.vis = !row.vis;
      return row;
    }));
  }

  const groupsArray = visGroup.map(row => {

    const filteredService = services.filter(service => service.groupid === row.id)
      .map(xService => {
        // service-box
        return (
          <div className="service-box" style={{display: row.vis ? 'flex' : 'none' }} key={xService.id}>
            <div className="service-box-name-price">
              <span className="service-name">{xService.service}</span>
              <span className="service-price">Price(min): ${xService.price}</span>
            </div>
            <p className="service-description">{xService.description}</p>
            <div className="service-button">
              <NavLink to="/booking" onClick={() => reqClicked(xService)} ><button className="btn-service-req" >Request</button></NavLink>
            </div>
          </div>
        )
      })

    return (
      <div className="service-group" key={row.id}>
        <div className="service-group-box" onClick={() => groupClicked(row.id)}>
          <span className="arrow">
            {(row.vis) && <FontAwesomeIcon icon="fa-solid fa-chevron-down" />}
            {(!row.vis) && <FontAwesomeIcon icon="fa-solid fa-chevron-right" />}
          </span>
          <span className="service-group-line">{row.group}</span>
        </div>
        <div className="service-box-main">{filteredService}</div>
      </div>
    );
  });

  return (
    (serviceGroups) && (
      <div className='services-page'>
        {groupsArray}
      </div>
    )
  )
}

export default Services;  