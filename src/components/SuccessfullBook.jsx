import { intlFormat } from "date-fns";
import { useContext, useState, useEffect } from "react";
import GeneralContext from "../contexts/GeneralContext";

import './SuccessfullBook.scss';

const SuccessfullBook = ({info, date}) => {
  // console.log(info);

  const { user, services, stylists } = useContext(GeneralContext);

  function findServiceName(id) {
    const serviceObj = services.filter(service => service.id === id)[0];
    return serviceObj.service;
  }

  function finsStylistName(id) {
    const stylistObj = stylists.filter(stylist => stylist.id === id)[0];
    return stylistObj.name;
  }

  const infoArray = info.map(row => {
    return(
      <div key={row.start_time} className="book-info-row">
        <div>
          <span className="time">@{(row.start_time).split(':')[0]}:{(row.start_time).split(':')[1]} </span>
          <span> by {finsStylistName(row.stylist_id)}</span>
        </div>
        <span>&nbsp;&nbsp; {findServiceName(row.service_id)} </span>
      </div>
    )
  })

  return (
    <div className="inside-modal-success-book">
      <div className="thank-par">
        <span className="thank">Thank you {user.firstname} !</span>
        <div className="date-all">
          <span>We booked you for </span>
          <span className="date">{date.slice(0, 10)}</span>
        </div>
        
        <span className="summary">Booking Summary</span>
      </div>
      {
        infoArray
      }
    </div>
  )
}

export default SuccessfullBook;