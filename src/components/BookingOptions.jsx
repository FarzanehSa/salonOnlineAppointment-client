import { useContext } from "react";
import axios from 'axios';
import { NavLink } from 'react-router-dom';

import GeneralContext from "../contexts/GeneralContext";

import {groupServiceReqs} from '../helper/groupServiceReqs'

import  FirstAvailable from './FirstAvailable';

const BookingOptions = ({formReqBook, selectedDay, timeClicked, handleChangeDate}) => {

  const { allSpots, timeTable } = useContext(GeneralContext);

  const calEndTime = (time, duration) => {
    const estimateEnd = new Date(new Date("1970/01/01 " + time).getTime() + duration * 60000).toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', hour12: false });
    return estimateEnd;
  }

  const copyAllSpots = [];
  for (let i = 0; i < allSpots.length; i++) {
    copyAllSpots.push([])
    for (let j = 0; j < allSpots[i].length; j++) {
      // console.log(allSpots[i][j]);
      copyAllSpots[i].push({...allSpots[i][j], badGap: [...allSpots[i][j].badGap], goodGap: [...allSpots[i][j].goodGap]})
    }
  }

  let updateAllSpotts = groupServiceReqs(copyAllSpots);
  updateAllSpotts = updateAllSpotts.map((optionGroup) => {
    const len = optionGroup.length;
    let times = [];

    for (const el of timeTable) {
      const estimateEnd = calEndTime(el.time, optionGroup[0].duration);
      const foundAv = optionGroup[0].goodGap.filter(app => el.time >= app.start && estimateEnd <= app.end) 
      if (foundAv.length) times.push(el)
    }

    if (len === 0) {
      return [{...optionGroup[0], timesAva: times}]
    } 
    // ---------------------------------------------
    else {
      let ff = optionGroup[0].duration;
      for (let task = 1; task < len; task++) {
        ff += optionGroup[task].duration;
        times = times.filter(t => { // eslint-disable-line
          const estimateEnd = calEndTime(t.time, ff);
          const abc = optionGroup[task].goodGap.filter(app => t.time >= app.start && estimateEnd <= app.end) 
          return (abc.length)
        })
      }
      optionGroup = optionGroup.map((row, index) => {
        if (index === 0) return {...row, timesAva: times}
        else return row;
      })
      return optionGroup
    }
  }).filter((group => group[0].timesAva.length !== 0));
  
  const spotsArray = updateAllSpotts.map((optionGroup, index) => {
    const len = optionGroup.length;
    const bTArr = optionGroup[0].timesAva.map(time => {
      return (  
        <NavLink to="/booking-confirm" onClick={() => timeClicked(time.time, optionGroup, selectedDay )} key={time.id}><button className="btn-time" >{time.name}</button></NavLink>
      )
    })
    if (len === 1) {
      const newArr = optionGroup.map((row, index2) => { // eslint-disable-line
        if (row.timesAva.length !== 0) {
          return (
            <div key={index2} className="availabel-time-box-one">
              <span className="availabel-time-box-time">{selectedDay.toDateString()}</span>
              <div className="availabel-time-box-one-info">
                <div>
                  <img src={row.image} alt="stylistImg" className='stylist-image'/>
                </div>
                <div>
                  <span className="stylist-name">{row.stylist}</span>
                  <span className="stylist-level">({row.level})</span>
                  <div>( {row.service} )( {row.duration} minutes)</div>
                </div>
              </div>
              <div>
                {bTArr}
              </div>
            </div>
          )
        }
      })
      return (
        <div key={index}>
          {newArr}
        </div>
      )
    } 
    // ---------------------------------------------
    else {
      console.log(optionGroup);
      const newArr = optionGroup.map((row, index2) => {
        return (
          <div key={index2} className="availabel-time-box-one-info">
            <div >
              <img src={row.image} alt="stylistImg" className='stylist-image'/>
            </div>
            <div>
              <span className="stylist-name">{row.stylist}</span>
              <span className="stylist-level">({row.level})</span>
              <div className="lev-dur">( {row.service} )( {row.duration} minutes)</div>
            </div>
          </div>
        )
      })
      return (
        <div key={index} className="availabel-time-box-one">
          <span className="availabel-time-box-time">{selectedDay.toDateString()}</span>
          {newArr}
          <div>
            {bTArr}
          </div>
        </div>
      )
    }
  })

// ************************************************
// This Part is for calculating next available chance to book...

const checkAvailability = (allOptions, bookedOnes) => {
  const newAllOptions = allOptions.map(taskOptions => {
    const newTaskOptions = taskOptions.map(option => {
      let goodGap = [];
      let tempStart = option.start;
      // get booked ones for current stylist
      const badGap = bookedOnes.filter(book => book.stylistid === option.stylist_id).map(row => {
        return ({start: row.start, end: row.end});
      });
      // console.log(badGap);
      for (let i = 0; i < badGap.length; i++) {
        if (tempStart < badGap[i].start) {
          goodGap.push({start: tempStart, end: badGap[i].start})
        }
        tempStart = badGap[i].end;  
      }
      if (tempStart < option.end) {
        goodGap.push({start: tempStart, end: option.end})
      }
      // console.log(goodGap);
      return (
        {...option, goodGap, badGap}
      )
    });
    return (newTaskOptions);
  })
  return newAllOptions;
}

const searchFirstAvailability = (tempData, setTempData) => {
  const myDate = new Date(tempData.date);
  const day = (myDate.getDate());
  myDate.setDate(day + 1);
  setTempData(tempData => ({...tempData, date: myDate}));

  const myDay = new Date(tempData.date).toLocaleString('en-us', {weekday:'long'});

  axios.post(`http://localhost:7100/api/booking`, {bookingReqs: formReqBook, day: myDay, date: tempData.date})
  .then(res => {
    const temp = checkAvailability(res.data.options, res.data.booked)

    let updateAllSpotts = groupServiceReqs(temp).map((optionGroup, index) => {
      const len = optionGroup.length;
      let times = [];

      for (const el of timeTable) {
        const estimateEnd = calEndTime(el.time, optionGroup[0].duration);
        const foundAv = optionGroup[0].goodGap.filter(app => el.time >= app.start && estimateEnd <= app.end) 
        if (foundAv.length) times.push(el)
      }
  
      if (len === 0) {
        console.log(optionGroup);
        return [{...optionGroup[0], timesAva: times}]
      } 
      // ---------------------------------------------
      else {
        let sumDuration = optionGroup[0].duration;
        for (let task = 1; task < len; task++) {
          sumDuration += optionGroup[task].duration;
          times = times.filter(t => { // eslint-disable-line
            const estimateEnd = calEndTime(t.time, sumDuration);
            const abc = optionGroup[task].goodGap.filter(app => t.time >= app.start && estimateEnd <= app.end) 
            return (abc.length)
          })
        }
        optionGroup = optionGroup.map((row, index) => {
          if (index === 0) return {...row, timesAva: times}
          else return row;
        })
        return optionGroup
      }
    }).filter((group => group[0].timesAva.length !== 0));

    setTempData(tempData => ({
      ...tempData, 
      options: checkAvailability(res.data.options, res.data.booked),
      booked: res.data.booked,
      receivedDate: res.data.date,
      result: updateAllSpotts,
    }))

    // console.log(tempData.result);
  })
  .catch(error => {
    console.log(error.message);
  })
}
// ************************************************

// console.log('tempData \n', tempData)

  return (
    <div className="availabel-time-box">
      {updateAllSpotts.length === 0  && allSpots.length !== 0 && (
        <FirstAvailable 
          selectedDay={selectedDay}
          searchFirstAvailability={searchFirstAvailability}
          handleChangeDate={handleChangeDate}/>
      )}
      {spotsArray}
    </div>

  )
}

export default BookingOptions;  