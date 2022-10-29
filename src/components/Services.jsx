import { useContext, useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import GeneralContext from "../contexts/GeneralContext";
import './Services.scss';

const Services = () => {

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
          <div className="service-box" style={{display: row.vis ? 'flex' : 'none' }}>
            <span>{xService.service}</span>
          </div>
        )
      })

    return (
      <div className="service-group" key={row.id}>
        <div className="service-group-box" onClick={() => groupClicked(row.id)}>
          <span className="arrow"><FontAwesomeIcon icon="fa-solid fa-chevron-down" /></span>
          <span className="service-group-line">{row.group}</span>
        </div>
        <div className="service-box-main">{filteredService}</div>
      </div>
    );
  });

  console.log(visGroup);

  return (
    (serviceGroups) && (
      <div className=''>
        {groupsArray}
      </div>
    )
  )
}

export default Services;  