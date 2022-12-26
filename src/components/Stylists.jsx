import { useContext } from "react";
import { NavLink } from 'react-router-dom';

import GeneralContext from "../contexts/GeneralContext";
import './StylistsN.scss';

const Stylists = () => {

  const { stylists } = useContext(GeneralContext);

  const stylistImagesArray = stylists.map( stylist => {
    return(
      <div className='img__wrap' key={stylist.id} >
        <NavLink  to={`${stylist.id}`}>
          <img src={stylist.image} alt="stylistImg" className='stylist-large-image'/>
          <div className="img__description">
            <p className='name-on-image'>{stylist.name}</p>
            <p>bio</p>
          </div>
        </NavLink>
      </div>
    )
  })

  return (
    <div className='all-stylists-images'>
      {stylistImagesArray}
    </div>
  )
}

export default Stylists;  