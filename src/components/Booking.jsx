import { react, useContext, useState, useEffect } from "react";
import axios from "axios";


import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';

import GeneralContext from "../contexts/GeneralContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import WeeklyCalender from './WeeklyCalender';
import useForm from "../hooks/useForm";
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

const Booking = ({service, onSearch}) => {

  const { stylists, availability, serviceGroups, services } = useContext(GeneralContext);

  const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [weekNum, setWeekNum] = useState(0);
  const [dayNum, setDayNum] = useState();
  const [weekInfo, setWeekInfo] = useState([]);
  const now = new Date();
  const [today, setToday] = useState("");
  const [qualifiedStylists, setQualifiedStylists] = useState();
  const [searchFormBase, setSearchFormBase] = useState({service: (service || ""), stylists: [], date: ""});
  const { formData, handleChange, handleSubmit, handleChangeStylists } = useForm(searchFormBase, onSearch);


  useEffect(() => {
    setDayNum(getDayNum());
    setToday(now.toLocaleDateString());
  
  } ,[]);
  
  useEffect(() => {
  
      const y = serviceGroups.filter(row => row.id === formData.service.groupid)[0]
      
      if (y) {
        const x = y.stylists.map(xId => {
          return stylists.filter(stylist => stylist.id === xId)[0]
        });
        setQualifiedStylists(x);
      }
    
  } ,[formData.service]);



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

  const StylistSelectArray = (qualifiedStylists || stylists).map(row => {

    return (
      <MenuItem key={row.id} value={row}>
        <Checkbox checked={formData.stylists.map(stylist => stylist.id).indexOf(row.id) > -1} />
        <ListItemText primary={row.name} />
      </MenuItem>
    )
  })

  

  console.log(formData);
  console.log(qualifiedStylists);
  // console.log(weekInfo);

  return (
    (dayNum &&
      <div className='booking'>

        <div className="weekly-cal">
          <button className="btn-shift-week" onClick={() => {setWeekNum(prev => prev - 1)}} disabled={weekNum === 0}><FontAwesomeIcon icon="fa-solid fa-chevron-left"/></button>
          <WeeklyCalender weekInfo={weekInfo} weekNum={weekNum} dayClicked={dayClicked} today={today}/>
          <button className="btn-shift-week" onClick={() => {setWeekNum(prev => prev + 1)}}><FontAwesomeIcon icon="fa-solid fa-chevron-right"/></button>
        </div>
        <form onSubmit={handleSubmit}>

          <FormControl sx={{ m:1, minWidth: 300 }} >
            <InputLabel htmlFor="service-select">Select Service</InputLabel>
            <Select 
              id="service-select"
              name="service"
              onChange={handleChange}
              value={formData.service} 
              label="service-select"
              MenuProps={MenuProps}
            >
              {serviceSelectArray}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel htmlFor="stylists-select">Stylists</InputLabel>
            <Select
              // labelId="demo-multiple-checkbox-label"
              id="stylists-select"
              multiple
              name="stylists"
              value={formData.stylists}
              onChange={handleChangeStylists}
              label="service-select"
              renderValue={(selected) => {
                if (formData.stylists.length === 1) return formData.stylists[0].name;
                return `${formData.stylists.length} stylists selected`
              }}
              MenuProps={MenuProps}
            >
              {StylistSelectArray}
            </Select>
          </FormControl>
          <button>submit</button>
        </form>

        
      </div>
    )
  )
}

export default Booking;  