import { useContext, useState, useEffect, useReducer } from "react";
import { Navigate, NavLink } from 'react-router-dom';

import GeneralContext from "../contexts/GeneralContext";
import './BookingConfirm.scss';

// import GeneralContext from "../contexts/GeneralContext";

const BookingConfirm = ({info, handleSendRequest}) => {

  const { user } = useContext(GeneralContext);
  
  return (
    <div>
      {info.time && user.id &&
      <div className="confirmation-page">
        <div className="right-cul">
          <span className="title">Cancellation Policy</span>
          <span className="text-body">
            Sometimes life happens… We respectfully request 48 hours notice to cancel or change your appointment. Without ample notice, we miss the opportunity to accept other clients.
          </span>
          <div className="buttons">
            <NavLink className="navlink" to="/booking"><button className="btn-in-confirm-page">Go Back</button></NavLink>
            <button className="btn-in-confirm-page" onClick={() => handleSendRequest(info)}>Request</button>
          </div>
        </div>
        <div className="left-cul">
          <span className="date">
            {new Date(info.date).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) }
          </span>
          { info.stylists.map(stylist => {
            return (
              <div key={stylist.startTime}>
                <div className="stylist-info">
                  <div>
                    <img src={stylist.stylistImage} alt="stylistImg" className='stylist-image'/>
                  </div>
                  <div className="stylist-info-text">
                    <span className="time">@ {stylist.startTime}</span>
                    <span className="text">{stylist.service}</span>
                    <span className="text">{stylist.stylistName} ({stylist.stylistLevel})</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>}
      {!info.time &&
        <Navigate to="/booking" replace={true} />
      }
      {info.time && !user.id &&
        <Navigate to="/login" replace={false} />
      }
      
    </div>
  )
}

export default BookingConfirm;