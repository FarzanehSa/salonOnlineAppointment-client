import { useContext, useState, useEffect } from "react";

import GeneralContext from "../contexts/GeneralContext";

import './WeeklyCalender.scss';

const WeeklyCalender = ({weekInfo, weekNum, dayClicked, monthName}) => {

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const weekArray = weekInfo.map(row => {

    let myClass = "";
    if (row.select) myClass += " weekly-calender-day-box-selected ";
    if (row.firstDay) myClass += " weekly-calender-first-day "

    return (
      <button className={`weekly-calender-day-box ${myClass}`} key={row.name}  onClick={() => dayClicked(row.fullDate)} disabled={row.fullDate < now}>
        <span className="weekly-calender-day-name">{row.name.slice(0, 3)}</span>
        <span className="weekly-calender-day-date">{row.fullDate.getDate().toString()}</span>
      </button>
    )
  })

  return (
    <div className='weekly-calender'>
      <div className="weekly-calender-month-box">
        <span className="weekly-calender-month">{monthName}, </span>
        {(weekNum === 0 ) && <span className="weekly-calender-week-num">This Week</span>}
        {(weekNum === 1 ) && <span className="weekly-calender-week-num">Next Week</span>}
        {(weekNum !== 0 &&  weekNum !== 1) && <span className="weekly-calender-week-num">In {weekNum} weeks.</span>}
      </div>
      <div className="week-calender-box">
        {weekArray}
      </div>
    </div>
  )
}

export default WeeklyCalender;  