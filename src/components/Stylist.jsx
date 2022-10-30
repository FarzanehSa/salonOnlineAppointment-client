import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import GeneralContext from "../contexts/GeneralContext";

import './Stylist.scss';

const Stylist = () => {

  const id = Number(useParams().id);
  const { stylists, availability } = useContext(GeneralContext);
  const [stylist, setStylist] = useState({});
  const [stylistAvailability, setStylistAvailability] = useState([]);

  useEffect(() => {

    const myStylist = stylists.filter(sty => sty.id === id)[0];
    const myAvailability = availability.filter(sch => sch.name === myStylist.name);

    setStylist(prev => myStylist);
    setStylistAvailability(prev => myAvailability);

  }, [stylists]); // eslint-disable-line
  
  const availabilityArray = stylistAvailability.map(row => {
    return (
      <tr className='single-stylist-schedule-row' key={row.id}>
        <td className='single-stylist-schedule-day'>{row.day} </td>
        <td className='single-stylist-schedule-time'> {row.start.slice(0,5)} - {row.end.slice(0,5)}</td>
      </tr>
      )
    })

  console.log('👩‍🎨', stylist, stylistAvailability);

  return (
    (stylist) && (
    <div className='stylist-box'>
      <img src={stylist.image} alt="stylistImg" className='stylist-image'/>
      <div className="single-stylist-info">
        <div className="single-stylist-top">
          <div className="single-stylist-name-box">
            <span className='single-stylist-name'>{stylist.name}</span>
            <span className='single-stylist-level'>{stylist.level}</span>
          </div>
          <div className='availability-box'>
            <table>
              <tr className="table-title">
                <th>hours</th>
              </tr>
              {availabilityArray}
            </table>
          </div>
        </div>
        <div className='single-stylist-bio'>
          <span>{stylist.bio}</span>
        </div>
      </div>
    </div>
  )
  )
}

export default Stylist;  