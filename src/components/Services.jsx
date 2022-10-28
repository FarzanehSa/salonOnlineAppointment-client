import { useContext } from "react";

import GeneralContext from "../contexts/GeneralContext";
import './Services.scss';

const Services = () => {

  const { serviceGroups, services } = useContext(GeneralContext);

  const groupsArray = serviceGroups.map(row => {
    return (
      <div className="service-group">
        <span>{row.group}</span>
      </div>
    )
  })
  return (
    (serviceGroups) && (
      <div className=''>
        {groupsArray}
      </div>
    )
  )
}

export default Services;  