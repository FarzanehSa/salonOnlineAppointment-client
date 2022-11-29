import { useContext, useState, useEffect } from "react";

import GeneralContext from "../contexts/GeneralContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {getWeekNum, calDate, getMonthName} from '../helper/dateHelper'
import BookingSearchForm from './BookingSearchForm';
import BookingOptions from './BookingOptions';
import WeeklyCalender from './WeeklyCalender';
import './Booking.scss';



const Booking = ({onSearch, timeClicked, formReqBook, setFormReqBook, selectedDay, setSelectedDay, qualifiedStylists, setQualifiedStylists}) => {

  const { stylists, setAllBooked, setAllSpots } = useContext(GeneralContext);

  const [weekNum, setWeekNum] = useState(0);
  const [weekInfo, setWeekInfo] = useState([]);
  const [monthName, setMonthName] = useState();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let tomorrow =  new Date();
  tomorrow.setDate(today.getDate() + 1);

  useEffect(() => {
    setWeekNum(getWeekNum(today));
    setAllSpots([]);
    setAllBooked([]);
  }, []);

  // ✅✅✅
  useEffect(() => {
    setWeekInfo([
      {
        name: "Monday",
        select: selectedDay.toString() === calDate(1, today, weekNum).toString(),
        fullDate: calDate(1, today, weekNum),
        firstDay: true
      },
      {
        name: "Tuesday",
        select: selectedDay.toString() === calDate(2, today, weekNum).toString(),
        fullDate: calDate(2, selectedDay, weekNum),
      },
      {
         name: "Wednesday",
         select: selectedDay.toString() === calDate(3, today, weekNum).toString(),
         fullDate: calDate(3, selectedDay, weekNum),
       },
       {
         name: "Thursday",
         select: selectedDay.toString() === calDate(4, today, weekNum).toString(),
         fullDate: calDate(4, selectedDay, weekNum),
       },
       {
         name: "Friday",
         select: selectedDay.toString() === calDate(5, today, weekNum).toString(),
         fullDate: calDate(5, selectedDay, weekNum),
       },
       {
         name: "Saturday",
         select: selectedDay.toString() === calDate(6, today, weekNum).toString(),
         fullDate: calDate(6, selectedDay, weekNum),
       },
       {
         name: "Sunday",
         select: selectedDay.toString() === calDate(7, today, weekNum).toString(),
         fullDate: calDate(7, selectedDay, weekNum),
       }
    ])
  }, [weekNum, selectedDay]);

  // ✅✅✅
  useEffect(() => {
    setWeekNum(getWeekNum(selectedDay));
  }, [selectedDay]);

  // ✅✅✅ change qualified stylists list base on service selected (if any)
  useEffect(() => {
    const newQualified = formReqBook.map(row => {
      let myStylist = stylists;
      if (row.service) {
        myStylist = myStylist.filter(stylist => stylist.skills.indexOf(row.service.groupid) > -1)
      }
      return myStylist;
    })
    setQualifiedStylists(newQualified);
  }, [formReqBook]);

  // ✅✅✅ it do search if there is service, and day clicked
  useEffect(() => {  
    if (formReqBook[0].service) {
      onSearch(formReqBook, selectedDay);
    }
  }, [selectedDay]);

  // ✅✅✅ show name of day (selected one or monday)
  useEffect(() => {
    if (weekInfo.length) setMonthName(getMonthName(weekInfo[0].fullDate));
    for (let i = 0;  i < weekInfo.length; i++) {
      if (weekInfo[i].select) setMonthName(getMonthName(weekInfo[i].fullDate))
    }
  }, [weekInfo]);

  // ✅✅✅
  const handleChangeService = (event, index) => {
    const value = event.target.value;
    let myStylists = [...(formReqBook[index].stylists)];

    // if selected stylist does not have that skill, delete from form
    if (myStylists.length !== 0) {
      const myGroup = value.groupid;
      myStylists = formReqBook[index].stylists.filter(stylist => stylist.skills.indexOf(myGroup) > -1)
    }

    // update formReqBook
    const newForm = formReqBook.map((row, i) => {
      if (i === index) return ({service: value, stylists: myStylists})
      return {...row}
    })

    setFormReqBook(newForm);
    setAllSpots([]);
  };

  // ✅✅✅
  const handleChangeStylists = (event, index) => {
    const newForm = formReqBook.map((row, i) => {
      if (i === index) return ({...row, stylists: event.target.value})
      return {...row}
    })
    setFormReqBook(newForm);
    setAllSpots([]);
  };
  
  // ✅✅✅
  const handleChangeDate = (newDate) => {
    // make sure from-date is always smaller that to-date
    let rDate = new Date(newDate);
    if (rDate > today){
      setSelectedDay(rDate);
    }
    else {
      setSelectedDay(tomorrow);
    }
  }

  // ✅✅✅
  function handleAddToForm() {
    setFormReqBook([...formReqBook, {service: "", stylists: []}]);
    setQualifiedStylists([...qualifiedStylists, stylists]);
    setAllSpots([]);
  }

  // ✅✅✅
  function handleDelete(index) {
    const newForm = [...formReqBook];
    newForm.splice(index, 1);
    setFormReqBook(newForm);
    const newQualified = [...qualifiedStylists];
    newQualified.splice(index, 1);
    setQualifiedStylists(newQualified);
    setAllSpots([]);
  }

  // ✅✅✅
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(formReqBook, selectedDay);
  };

  // ✅✅✅ for when you move calender but not select any!
  const handleCloseDayPicker = (event) => {
    setWeekNum(getWeekNum(selectedDay));
  };

  // ✅✅✅
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

  // console.log('👀 formReqBook \n', formReqBook);
  // console.log('👀 qualifiedStylists \n', qualifiedStylists);
   
  return (
    (today &&
      <div className='booking-page'>
        <BookingSearchForm
          formReqBook={formReqBook}
          selectedDay={selectedDay}
          handleChangeService={handleChangeService}
          handleChangeStylists={handleChangeStylists}
          handleChangeDate={handleChangeDate}
          handleAddToForm={handleAddToForm}
          handleDelete={handleDelete}
          handleSearchSubmit={handleSearchSubmit}
          handleCloseDayPicker={handleCloseDayPicker}
          qualifiedStylists={qualifiedStylists}
          />
        { formReqBook[0].service && (
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
          // baseDay && (
            <BookingOptions 
              formReqBook={formReqBook}
              selectedDay={selectedDay}
              timeClicked={timeClicked}
              handleChangeDate={handleChangeDate}
            />
          // )
        }
      </div>
    )
  )
}

export default Booking;  