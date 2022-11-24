import { useContext, useState, useEffect } from "react";

import GeneralContext from "../contexts/GeneralContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {getWeekNum, calDate, getMonthName} from '../helper/dateHelper'
import BookingSearchForm from './BookingSearchForm';
import BookingOptions from './BookingOptions';
import WeeklyCalender from './WeeklyCalender';
import './Booking.scss';



const Booking = ({onSearch, timeClicked, formData, setFormData}) => {

  const { stylists, serviceGroups, setAllBooked, setAllSpots } = useContext(GeneralContext);
  const [weekNum, setWeekNum] = useState(0);
  const [baseDay, setBaseDay] = useState(new Date());
  const [weekInfo, setWeekInfo] = useState([]);
  const [monthName, setMonthName] = useState();
  const [qualifiedStylists, setQualifiedStylists] = useState([]);

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
    setBaseDay(formData[0].date);
    if (formData[0].service) {
      onSearch(formData);
    }
  }, [formData[0].date]); // eslint-disable-line

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

  const handleChangeService = (event, index) => {
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
    setAllSpots([]);
  };

  const handleChangeStylists = (event, index) => {
    const newForm = formData.map((row, i) => {
      if (i === index) return ({...row, stylists: event.target.value})
      return {...row}
    })
    setFormData(newForm);
    setAllSpots([]);
  };
  
  const handleChangeDate = (newDate) => {
    // make sure from-date is always smaller that to-date
    console.log(newDate);
    
    let rDate = new Date(newDate);
    console.log(rDate);
    
    if (rDate >= now){
      const newForm = formData.map((row, i) => {
        if (i === 0) return ({...row, date: rDate})
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

  function handleAddToForm() {
    setFormData([...formData, {service: "", stylists: []}]);
    setQualifiedStylists([...qualifiedStylists, stylists]);
    setAllSpots([]);
  }

  function handleDelete(index) {
    const newForm = [...formData];
    newForm.splice(index, 1);
    setFormData(newForm);
    const newQualified = [...qualifiedStylists];
    newQualified.splice(index, 1);
    setQualifiedStylists(newQualified);
    setAllSpots([]);
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(formData);
  };

  const handleCloseDayPicker = (event) => {
    setWeekNum(getWeekNum(baseDay));
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

  // console.log('👀 formData \n', formData);
   
  return (
    (baseDay &&
      <div className='booking-page'>
        <BookingSearchForm
          formData={formData}
          handleChangeService={handleChangeService}
          handleChangeStylists={handleChangeStylists}
          handleChangeDate={handleChangeDate}
          handleAddToForm={handleAddToForm}
          handleDelete={handleDelete}
          handleSearchSubmit={handleSearchSubmit}
          handleCloseDayPicker={handleCloseDayPicker}
          qualifiedStylists={qualifiedStylists}
          />
        { formData[0].service && (
          <div className="weekly-cal">
            <button className="btn-shift-week" onClick={() => {
              setWeekNum(prev => prev - 1);}} disabled={weekNum === 0}><FontAwesomeIcon icon="fa-solid fa-chevron-left"/></button>
            <WeeklyCalender weekInfo={weekInfo} weekNum={weekNum} dayClicked={dayClicked} monthName={monthName}/>
            <button className="btn-shift-week" onClick={() => {
              setWeekNum(prev => prev + 1);}}><FontAwesomeIcon icon="fa-solid fa-chevron-right"/></button>
          </div>
          )
        }
        {
          baseDay && (
            <BookingOptions 
              formData={formData}
              timeClicked={timeClicked}
              baseDay={baseDay}
              onSearch={onSearch}
              handleDayClicked={handleChangeDate}
            />
          )
        }
      </div>
    )
  )
}

export default Booking;  