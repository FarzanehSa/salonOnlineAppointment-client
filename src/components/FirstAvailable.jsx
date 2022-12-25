import { useState, useEffect } from "react";

import LinearProgress from "@mui/material/LinearProgress";

const FirstAvailable = ({selectedDay, searchFirstAvailability, handleChangeDate}) => {

  let newDate = new Date(selectedDay.getTime())
  const [tempData, setTempData] = useState({
    options: [],
    booked: [],
    result: [],
    receivedDate: selectedDay,
    date: newDate});

  const [maxSearch, setMaxSearch] = useState(false);

  useEffect (() => {

    const maxDate = new Date(selectedDay);
    // console.log(maxDate);
    // search in next 30 days
    maxDate.setDate(maxDate.getDate() + 30);
    const dateObj = new Date(tempData.receivedDate)
    if (dateObj.getTime() < maxDate.getTime()) {
      if (tempData.result.length === 0 ) {
        searchFirstAvailability(tempData, setTempData);
        // console.log('tempData \n', tempData);
      }
    } else {
      setMaxSearch(true);
    }
  }, [tempData.options]); // eslint-disable-line
 
  
  return (
    <div>
      { !maxSearch && tempData.result.length !== 0 &&
        <div className="unavailabel-time-box">
          <span className="title-1">Sorry, they're booked</span>
          <span className="title-2">They don't have any appointments available.</span>
          <span className="title-3">Next available date:</span>
          <span className="title-4">{(new Date(tempData.receivedDate)).toDateString()}</span>
          <button className="btn-go-to-date" onClick={() => handleChangeDate(tempData.receivedDate)}>Go to: {tempData.receivedDate.slice(0, 10)}</button>
        </div>
      }
      {(!maxSearch && tempData.result.length === 0) &&  (
        <div className="page-loading">
          <LinearProgress color="secondary" />
        </div>
      )}
      {(maxSearch) &&  (
        <div className="unavailabel-time-box">
          <span className="title-1">Sorry, There is no possible option in next 30 days!</span>
        </div>
      )}
    </div>
  )
}

export default FirstAvailable;  