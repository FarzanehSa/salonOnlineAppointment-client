import { useContext, useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';

// import GeneralContext from "../contexts/GeneralContext";

// import './Stylist.scss';

const BookingConfirm = ({info}) => {

  console.log(info);

  return (
    <div>
      {info.time && 
      <div>
        confirm
      </div>}
      {!info.time &&
        <Navigate to="/booking" replace={true} />
      }
      
    </div>
  )
}

export default BookingConfirm;  