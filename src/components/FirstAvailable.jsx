import { useState, useEffect } from "react";

const FirstAvailable = ({formData, searchFirstAvailability, handleDayClicked}) => {

  let c = formData[0].date;
  let cop = new Date(c.getTime())
  const [tempData, setTempData] = useState({
    options: [],
    booked: [],
    result: [],
    receivedDate: {},
    date: cop});

  useEffect (() => {
    if (tempData.result.length === 0) {
      searchFirstAvailability(tempData, setTempData);
    }
  }, [tempData.options]);
 
  // console.log('tempData \n', tempData)
  
  return (
    <div>
      { tempData.result.length !== 0 &&
        <div className="unavailabel-time-box">
          <span className="title-1">Sorry, they're booked</span>
          <span className="title-2">They don't have any appointments available.</span>
          <span className="title-3">Next available date:</span>
          <span className="title-4">{tempData.receivedDate.slice(0, 10)}</span>
          <button className="btn-go-to-date" onClick={() => handleDayClicked(tempData.receivedDate)}>Go to: {tempData.receivedDate.slice(0, 10)}</button>
        </div>
      }
    </div>
  )
}

export default FirstAvailable;  