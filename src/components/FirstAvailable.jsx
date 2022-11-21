import { useState, useEffect } from "react";

const FirstAvailable = ({formData, handelClick}) => {

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
      console.log('yesssssssss');
      handelClick(tempData, setTempData);
    }
  }, [tempData.options]);
 
  // console.log('tempData \n', tempData)
  
  return (
    <div className="availabel-time-box">
      <div>
        <p>Sorry, they're booked</p>
        { tempData.result.length !== 0 &&
          <p>Check {tempData.receivedDate.slice(0, 10)}</p>
        }
      </div>
    </div>
  )
}

export default FirstAvailable;  