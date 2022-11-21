import { react, useContext, useState, useEffect } from "react";
import axios from 'axios';

import GeneralContext from "../contexts/GeneralContext";

import {groupServiceReqs} from '../helper/groupServiceReqs'

import  FirstAvailable from './FirstAvailable';

const BookingOptions = ({formData, timeClicked, baseDay}) => {

  const { allSpots } = useContext(GeneralContext);

  const copyAllSpots = [];
  for (let i = 0; i < allSpots.length; i++) {
    copyAllSpots.push([])
    for (let j = 0; j < allSpots[i].length; j++) {
      // console.log(allSpots[i][j]);
      copyAllSpots[i].push({...allSpots[i][j], timeAv: [...allSpots[i][j].timeAv]})
    }
  }

  let updateAllSpotts =groupServiceReqs(copyAllSpots);
  updateAllSpotts = updateAllSpotts.map((optionGroup, index) => {
    const len = optionGroup.length;
    if (len === 1) return optionGroup 
    // ---------------------------------------------
    else {
      let sumDuration = 0;
      for (let task = 1; task < len; task++) {
        sumDuration += optionGroup[task - 1].duration;
        optionGroup[0].timeAv = optionGroup[0].timeAv.filter(t => { // eslint-disable-line

          let time = new Date(new Date("1970/01/01 " + t).getTime() + sumDuration * 60000).toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', hour12: false });
          return (optionGroup[task].timeAv.indexOf(time) !== -1)
        })
      }
      return optionGroup;
    }
  }).filter((group => group[0].timeAv.length !== 0));
  
  const spotsArray = updateAllSpotts.map((optionGroup, index) => {
    const len = optionGroup.length;
    if (len === 1) {
      const newArr = optionGroup.map((row, index2) => { // eslint-disable-line
        const bTArr = row.timeAv.map(time => {
          return (
            <button className="btn-time" onClick={() => timeClicked(time, row.stylist_id, formData[0].date, formData[index].service.id, row.duration )} key={time}>{time}</button>
          )
        })
        if (row.timeAv.length !== 0) {
          return (
            <div key={index2} className="availabel-time-box-one">
              <span className="availabel-time-box-time">{baseDay.toDateString()}</span>
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
      const bTArr = optionGroup[0].timeAv.map(time => {
        return (
          <button className="btn-time" onClick={() => timeClicked(time, optionGroup, formData[0].date )} key={time}>{time}</button>
        )
      })
      const newArr = optionGroup.map((row, index2) => {
        return (
          <div key={index2} className="availabel-time-box-one-info">
            <div >
              <img src={row.image} alt="stylistImg" className='stylist-image'/>
            </div>
            <div>
              <span className="stylist-name">{row.stylist}</span>
              <span className="stylist-level">({row.level})</span>
               <div>( {row.service} )( {row.duration} minutes)</div>
            </div>
          </div>
        )
      })
      return (
        <div key={index} className="availabel-time-box-one">
          <span className="availabel-time-box-time">{baseDay.toDateString()}</span>
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
  const newAllOptions = allOptions.map((task, index) => {
    const newArr = task.map(row => {
      const minsToAdd = 30;
      const duration = row.duration;
      let t = row.start;
      const tArr = [];
      while (t !== row.end) {
        const estimateEnd = new Date(new Date("1970/01/01 " + t).getTime() + duration * 60000).toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', hour12: false });
        const x = bookedOnes.filter(app => app.stylistid === row.stylist_id && ((t < app.start && app.start < estimateEnd) || (t >= app.start && t < app.end))); // eslint-disable-line
        if (x.length === 0 && estimateEnd <= row.end) {
          tArr.push(t);
        }
        t = new Date(new Date("1970/01/01 " + t).getTime() + minsToAdd * 60000).toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', hour12: false });
      }
      return ({...row, timeAv: tArr});
    })
    return (newArr);
  })
  return newAllOptions;
}

const handelClick = (tempData, setTempData) => {
  const myDate = new Date(tempData.date);
  const day = (myDate.getDate());
  myDate.setDate(day + 1);
  setTempData(tempData => ({...tempData, date: myDate}))

  const myDay = new Date(tempData.date).toLocaleString('en-us', {weekday:'long'})

  let formDataCopy = []
  for (let i = 0; i < formData.length; i++) {
    if (i === 0) {
      const {date, ...row} = formData[i];
      formDataCopy.push(row)
    } else {
      formDataCopy.push({ ...formData[i]})
    }
  }
  
  formDataCopy[0].date = tempData.date;

  axios.post(`http://localhost:7100/api/booking`, {reqApps: formDataCopy, day: myDay})
  .then(res => {
    const temp = checkAvailability(res.data.options, res.data.booked)

    let updateAllSpotts = groupServiceReqs(temp).map((optionGroup, index) => {
      const len = optionGroup.length;
      if (len === 1) return optionGroup 
      // ---------------------------------------------
      else {
        let sumDuration = 0;
        for (let task = 1; task < len; task++) {
          sumDuration += optionGroup[task - 1].duration;
          optionGroup[0].timeAv = optionGroup[0].timeAv.filter(t => { // eslint-disable-line

            let time = new Date(new Date("1970/01/01 " + t).getTime() + sumDuration * 60000).toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', hour12: false });
            return (optionGroup[task].timeAv.indexOf(time) !== -1)
          })
        }
        // console.log('🟢🟢',optionGroup);
        return optionGroup;
      }
    }).filter((group => group[0].timeAv.length !== 0));
    setTempData(tempData => ({
      ...tempData, 
      options: checkAvailability(res.data.options, res.data.booked),
      booked: res.data.booked,
      receivedDate: res.data.date.slice(0, 10),
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
        <FirstAvailable formData={formData} handelClick={handelClick}/>
      )}
      {spotsArray}
    </div>

  )
}

export default BookingOptions;  