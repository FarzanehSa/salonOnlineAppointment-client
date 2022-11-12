import { react, useContext, useState, useEffect } from "react";
import axios from "axios";


import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import GeneralContext from "../contexts/GeneralContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {getWeekNum, calDate, formatDate, getMonthName} from '../helper/dateHelper'
import WeeklyCalender from './WeeklyCalender';
import './Booking.scss';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Booking = ({service, onSearch, timeClicked }) => {

  const { stylists, availability, serviceGroups, services, allSpots, allBooked, setAllBooked, setAllSpots } = useContext(GeneralContext);
  const [weekNum, setWeekNum] = useState(0);
  const [baseDay, setBaseDay] = useState(new Date());
  const [weekInfo, setWeekInfo] = useState([]);
  const [monthName, setMonthName] = useState();
  const [qualifiedStylists, setQualifiedStylists] = useState([]);
  const searchFormBase = {service: (service || ""), stylists: [], date: (new Date())};

  const [formData, setFormData] = useState([searchFormBase]);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  useEffect(() => {
    setWeekNum(getWeekNum(baseDay));
    setAllSpots([]);
    setAllBooked([]);
  }, []);

  useEffect(() => {
    setQualifiedStylists([[...stylists]]);
  }, [stylists]);

  useEffect(() => {
    setWeekInfo([
      {
        name: "Monday",
        select: baseDay.toString() === calDate(1, baseDay, weekNum).toString(),
        fullDate: calDate(1, baseDay, weekNum),
        firstDay: true
      },
      {
        name: "Tuesday",
        select: baseDay.toString() === calDate(2, baseDay, weekNum).toString(),
        fullDate: calDate(2, baseDay, weekNum),
      },
      {
         name: "Wednesday",
         select: baseDay.toString() === calDate(3, baseDay, weekNum).toString(),
         fullDate: calDate(3, baseDay, weekNum),
       },
       {
         name: "Thursday",
         select: baseDay.toString() === calDate(4, baseDay, weekNum).toString(),
         fullDate: calDate(4, baseDay, weekNum),
       },
       {
         name: "Friday",
         select: baseDay.toString() === calDate(5, baseDay, weekNum).toString(),
         fullDate: calDate(5, baseDay, weekNum),
       },
       {
         name: "Saturday",
         select: baseDay.toString() === calDate(6, baseDay, weekNum).toString(),
         fullDate: calDate(6, baseDay, weekNum),
       },
       {
         name: "Sunday",
         select: baseDay.toString() === calDate(7, baseDay, weekNum).toString(),
         fullDate: calDate(7, baseDay, weekNum),
       }
    ])
  }, [weekNum, baseDay]);

  useEffect(() => {  
    setBaseDay(formData[0].date)
  }, [formData[0].date]);

  useEffect(() => {
    setWeekNum(getWeekNum(baseDay));
  }, [baseDay]);
  
  // show name of day (selected one or monday)
  useEffect(() => {
    if (weekInfo.length) setMonthName(getMonthName(weekInfo[0].fullDate));
    for (let i = 0;  i < weekInfo.length; i++) {
      if (weekInfo[i].select) setMonthName(getMonthName(weekInfo[i].fullDate))
    }
  }, [weekInfo]);

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    let myStylists = [...(formData[index].stylists)];

    // if selected stylist does not have that skill, delete from form
    if (myStylists.length !== 0) {
      const myGroup = value.groupid;
      myStylists = formData[index].stylists.filter(stylist => stylist.skills.indexOf(myGroup) > -1)
    }

    // only show stylists that have that skill
    const y = serviceGroups.filter(row => row.id === value.groupid)[0]
    const x = y.stylists.map(xId => {
      return stylists.filter(stylist => stylist.id === xId)[0]
    });
    setQualifiedStylists(qualifiedStylists.map((row, i) => {
      if (i === index) return x;
      return row;
    }));

    // update formData
    const newForm = formData.map((row, i) => {
      if (i === index) return ({...row, [name]: value, stylists: myStylists})
      return {...row}
    })
    setFormData(newForm);
  };

  const handleChangeStylists = (event, index) => {

    const newForm = formData.map((row, i) => {
      if (i === index) return ({...row, stylists: event.target.value})
      return {...row}
    })
    setFormData(newForm);
  };

  const handleChangeDate = (newDate) => {
    
    // make sure from-date is always smaller that to-date
    if (newDate >= now){
      const newForm = formData.map((row, i) => {
        if (i === 0) return ({...row, date: newDate})
        return {...row}
      })
      setFormData(newForm);
    }
    else {
      const newForm = formData.map((row, i) => {
        if (i === 0) return ({...row, date: now})
        return {...row}
      })
      setFormData(newForm);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(formData);
  };

  function dayClicked(recievedDate) {
    const afterSelect = weekInfo.map(row => {
      if (row.fullDate === recievedDate) {
        return {...row, select: true};
      }
      return {...row, select: false};
    })
    setWeekInfo(prev => afterSelect);
    handleChangeDate(recievedDate);
  }

  const serviceSelectArray = serviceGroups.map(gRow => {
    const goodServices = services.filter(sRow => gRow.id === sRow.groupid);
    let result = [];
    for(let i = -1; i < goodServices.length; i++) {
      if (i === -1) {
        result.push(<ListSubheader>{gRow.group}</ListSubheader>);
      }
      else {
        result.push(<MenuItem value={goodServices[i]}>{goodServices[i].service}</MenuItem>);
      }
    }
    return result;
  })

  // const spotsArray = allSpots.map(row => {
  //   const minsToAdd = 30;
  //   let t = row.start;
  //   const tArr = [];
  //   while (t !== row.end) {
  //     const x = allBooked.filter(app => app.stylistid === row.stylist_id && app.start === t)
  //     if (x.length === 0) {
  //       tArr.push(t);
  //     }
  //     t = new Date(new Date("1970/01/01 " + t).getTime() + minsToAdd * 60000).toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', hour12: false });
  //   }
  //   const bTArr = tArr.map(time => {
  //     return (
  //       <button className="btn-time" onClick={() => timeClicked(time, row.stylist_id, formData.date, formData.service.id )} key={time}>{time}</button>
  //     )
  //   })
  //   return (
  //     <div key={row.stylist_id} className="availabel-time-box-one">
  //       <div className="availabel-time-box-one-info">
  //         <img src={row.image} alt="stylistImg" className='stylist-image'/>
  //         <span className="stylist-name">{row.stylist}</span>
  //         <span className="stylist-level">({row.level})</span>
  //       </div>
  //       <div>
  //         {bTArr}
  //       </div>
  //     </div>
  //   )
  // })

  const spotsArray = allSpots.map((task, index) => {

    const newArr = task.map(row => {
      const minsToAdd = 30;
      const duration = row.duration;
      let t = row.start;
      const tArr = [];
      while (t !== row.end) {
        const estimateEnd = new Date(new Date("1970/01/01 " + t).getTime() + duration * 60000).toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', hour12: false });
        const x = allBooked.filter(app => app.stylistid === row.stylist_id && ((t < app.start && app.start < estimateEnd) || (t >= app.start && t < app.end)));
        if (x.length === 0 && estimateEnd <= row.end) {
          tArr.push(t);
        }
        t = new Date(new Date("1970/01/01 " + t).getTime() + minsToAdd * 60000).toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', hour12: false });
      }
      const bTArr = tArr.map(time => {
        return (
          <button className="btn-time" onClick={() => timeClicked(time, row.stylist_id, formData[0].date, formData[index].service.id, row.duration )} key={time}>{time}</button>
        )
      })
      if (tArr.length !== 0) {
        return (
          <div key={row.stylist_id} className="availabel-time-box-one">
            <span>{baseDay.toDateString()}</span>
            <div className="availabel-time-box-one-info">
              <img src={row.image} alt="stylistImg" className='stylist-image'/>
              <span className="stylist-name">{row.stylist}</span>
              <span className="stylist-level">({row.level})</span>
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
    
  })

  function handleAddToForm() {
    setFormData([...formData, {service: (service || ""), stylists: []}]);
    setQualifiedStylists([...qualifiedStylists, stylists]);
  }

  function handleDelete(index) {
    const newForm = [...formData];
    newForm.splice(index, 1);
    setFormData(newForm);
    const newQualified = [...qualifiedStylists];
    newQualified.splice(index, 1);
    setQualifiedStylists(newQualified);
  }

  const formDateArray = formData.map((row, index) => {
    
    return (
      <div className="search-form-row" key={index}>
        <FormControl sx={{ m:1, minWidth: 300 }} className="search-form-service">
          <InputLabel htmlFor="service-select">Select Service</InputLabel>
          <Select 
            id="service-select"
            name="service"
            onChange={e => handleChange(e, index)}
            value={formData[index].service} 
            label="service-select"
            MenuProps={MenuProps}
            required
          >
            {serviceSelectArray}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, width: 300 }} className="search-form-stylist">
          <InputLabel htmlFor="stylists-select" shrink={true}>Select Stylist</InputLabel>
          <Select
            id="stylists-select"
            multiple
            name="stylists"
            displayEmpty
            value={formData[index].stylists}
            onChange={e => handleChangeStylists(e, index)}
            label="stylists-select"
            notched={true}
            renderValue={(selected) => {
              if (formData[index].stylists.length === 0) return `any stylist`;
              if (formData[index].stylists.length === 1) return formData[index].stylists[0].name;
              return `${formData[index].stylists.length} stylists selected`
            }}
            MenuProps={MenuProps}
            // inputProps={{ 'aria-label': 'Without label' }}
          >
            {qualifiedStylists && (qualifiedStylists[index] || stylists).map(sty => {
              return (
              <MenuItem key={sty.id} value={sty}>
                <Checkbox checked={formData[index].stylists.map(stylist => stylist.id).indexOf(sty.id) > -1} />
                <ListItemText primary={`${sty.name} (${sty.level})`} />
              </MenuItem>
            )
            })}
          </Select>
        </FormControl>
        {(index === 0 &&
        <div className="search-form-date">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                name="date"
                label="Pick a Date"
                value={formData[0].date}
                minDate={new Date()}
                onClose={() => setWeekNum(getWeekNum(baseDay))}
                onChange={handleChangeDate}
                renderInput={(params) => <TextField {...params} />}
              />
          </LocalizationProvider>
          <button className="btn-search">Search</button>
        </div>)}
        {(index !== 0 &&
        <div className="search-form-delete-row">
          <button className="btn-delete" type="button" onClick={() => handleDelete(index)}><FontAwesomeIcon icon="fa-solid fa-square-minus" /></button>
        </div>)}
      </div>
    )
  })

  console.log('🚨👀',formData);
  console.log('🚨🚨🚨🚨',qualifiedStylists);
  // console.log("📅",daySelected);
  // console.log("📅📅",baseDay);
  // console.log(weekInfo);

  return (
    (baseDay &&
      <div className='booking-page'>
        <div className="search-form">
          <form onSubmit={handleSubmit}>
            {formDateArray}
          </form>
          <div className="add-service-box">
            <button onClick={() => handleAddToForm()} className="btn-add-service-to-form">+ Add Service</button>
          </div>
        </div>
        <div className="weekly-cal">
          <button className="btn-shift-week" onClick={() => {
            setWeekNum(prev => prev - 1);}} disabled={weekNum === 0}><FontAwesomeIcon icon="fa-solid fa-chevron-left"/></button>
          <WeeklyCalender weekInfo={weekInfo} weekNum={weekNum} dayClicked={dayClicked} monthName={monthName}/>
          <button className="btn-shift-week" onClick={() => {
            setWeekNum(prev => prev + 1);}}><FontAwesomeIcon icon="fa-solid fa-chevron-right"/></button>
        </div>
        <div className="availabel-time-box">
           {spotsArray}
        </div>
      </div>
    )
  )
}

export default Booking;  