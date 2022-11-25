import { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom';

import './BookingConfirm.scss';

// import GeneralContext from "../contexts/GeneralContext";

// import './Stylist.scss';

const BookingConfirm = ({info}) => {

  const navigate = useNavigate();

  return (
    <div>
      {info.time && 
      <div className="confirmation-page">
        <div className="right-cul">
          <span className="title">Cancellation Policy</span>
          <span className="text-body">
            Sometimes life happens… We respectfully request 48 hours notice to cancel or change your appointment. Without ample notice, we miss the opportunity to accept other clients.
          </span>
          <div className="buttons">
            <button className="btn-in-confirm-page" onClick={() => navigate(-1)}>Go Back</button>
            <button className="btn-in-confirm-page">Request</button>
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
      
    </div>
  )
}

export default BookingConfirm;