import { useContext, useState, useEffect } from "react";

import GeneralContext from "../contexts/GeneralContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import WeeklyCalender from './WeeklyCalender'
import './Booking.scss';

const Booking = (props) => {

  // const { stylists, availability } = useContext(GeneralContext);

  const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [weekNum, setWeekNum] = useState(0);
  const [dayNum, setDayNum] = useState();
  const [weekInfo, setWeekInfo] = useState([]);
  const now = new Date();
  const [today, setToday] = useState("");
  
  useEffect(() => {
    setDayNum(getDayNum());
    setToday(now.toLocaleDateString())
  } ,[]);

  useEffect(() => {
    setWeekInfo([
      {
        name: "Monday",
        select: false,
        fullDate: calDate(1, dayNum, weekNum),
        date: calDate(1, dayNum, weekNum).toLocaleDateString(),
        month: months[Number(calDate(1, dayNum, weekNum).toLocaleDateString().split('/')[0]) - 1]
      },
      {
        name: "Tuesday",
        select: false,
        fullDate: calDate(2, dayNum, weekNum),
        date: calDate(2, dayNum, weekNum).toLocaleDateString(),
        month: months[Number(calDate(1, dayNum, weekNum).toLocaleDateString().split('/')[0]) - 1]
      },
      {
         name: "Wednesday",
         select: false,
         fullDate: calDate(3, dayNum, weekNum),
         date: calDate(3, dayNum, weekNum).toLocaleDateString(),
         month: months[Number(calDate(1, dayNum, weekNum).toLocaleDateString().split('/')[0]) - 1]
       },
       {
         name: "Thursday",
         select: false,
         fullDate: calDate(4, dayNum, weekNum),
         date: calDate(4, dayNum, weekNum).toLocaleDateString(),
         month: months[Number(calDate(1, dayNum, weekNum).toLocaleDateString().split('/')[0]) - 1]
       },
       {
         name: "Friday",
         select: false,
         fullDate: calDate(5, dayNum, weekNum),
         date: calDate(5, dayNum, weekNum).toLocaleDateString(),
         month: months[Number(calDate(1, dayNum, weekNum).toLocaleDateString().split('/')[0]) - 1]
       },
       {
         name: "Saturday",
         select: false,
         fullDate: calDate(6, dayNum, weekNum),
         date: calDate(6, dayNum, weekNum).toLocaleDateString(),
         month: months[Number(calDate(1, dayNum, weekNum).toLocaleDateString().split('/')[0]) - 1]
       },
       {
         name: "Sunday",
         select: false,
         fullDate: calDate(7, dayNum, weekNum),
         date: calDate(7, dayNum, weekNum).toLocaleDateString(),
         month: months[Number(calDate(1, dayNum, weekNum).toLocaleDateString().split('/')[0]) - 1]
       }
    ])
  } ,[dayNum, weekNum]);

  function calDate(dayNum, todayNum, weekNum) {
    const today = new Date();
    const myDate = new Date(today);
    myDate.setDate(myDate.getDate() + (dayNum - todayNum) + (7 * weekNum));
    return myDate;
  }

  function getDayNum() {
    const today = new Date();
    const dayName = today.toString().split(' ')[0];
    return (week.indexOf(dayName) + 1)
  }

  function dayClicked(date) {
    const afterSelect = weekInfo.map(row => {
      if (row.date === date) return {...row, select: true};
      return {...row, select: false};
    })
    setWeekInfo(prev => afterSelect);
  }

  console.log(weekInfo);

  return (
    (dayNum &&
      <div className='booking'>

        <div className="weekly-cal">
          <button className="btn-shift-week" onClick={() => {setWeekNum(prev => prev - 1)}} disabled={weekNum === 0}><FontAwesomeIcon icon="fa-solid fa-chevron-left"/></button>
          <WeeklyCalender weekInfo={weekInfo} weekNum={weekNum} dayClicked={dayClicked} today={today}/>
          <button className="btn-shift-week" onClick={() => {setWeekNum(prev => prev + 1)}}><FontAwesomeIcon icon="fa-solid fa-chevron-right"/></button>
        </div>

        {/* {props.service} */}
      </div>
    )
  )
}

export default Booking;  