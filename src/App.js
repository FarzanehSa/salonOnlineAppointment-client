import {useState, useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';


import GeneralContext from './contexts/GeneralContext';

import Navbar from './components/Navbar';
import Stylists from './components/Stylists';
import Services from './components/Services';
import Stylist from './components/Stylist';
import Booking from './components/Booking';
import BookingConfirm from './components/BookingConfirm';
import './App.scss';

function App() {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let tomorrow =  new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [stylists, setStylists] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [serviceGroups, setServiceGroups] = useState([]);
  const [services, setServices] = useState([]);

  const [formData, setFormData] = useState([{service: "", stylists: []}]);
  const [selectedDay, setSelectedDay] = useState(tomorrow);

  const [allSpots, setAllSpots] = useState([]);
  const [allBooked, setAllBooked] = useState([]);
  const [wantToBook, setWantToBook] = useState({})
  
  useEffect(() => {

    const f1 = axios.get('http://localhost:7100/api/stylists');
    const f2 = axios.get('http://localhost:7100/api/services');

    Promise.all([f1, f2])
      .then(([r1, r2]) => {
        // console.log(r2.data);
        setStylists(prev => r1.data.stylists);
        setAvailability(prev => r1.data.availability);
        setServiceGroups(prev => r2.data.groups);
        setServices(prev => r2.data.services);
      });
  }, []);

  const reqClicked = function(serviceId) {
    setFormData(pre => ([{service: serviceId, stylists: []}]));
  }

  const checkAvailability = (allOptions, bookedOnes) => {
    const newAllOptions = allOptions.map((task, index) => {
      const newArr = task.map(row => {
        const minsToAdd = 30;
        const duration = row.duration;
        let t = row.start;
        const tArr = [];
        while (t !== row.end) {
          const estimateEnd = new Date(new Date("1970/01/01 " + t).getTime() + duration * 60000).toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', hour12: false });
          const x = bookedOnes.filter(app => app.stylistid === row.stylist_id && ((t < app.start && app.start < estimateEnd) || (t >= app.start && t < app.end)));
          if (x.length === 0 && estimateEnd <= row.end) {
            tArr.push(t);
          }
          t = new Date(new Date("1970/01/01 " + t).getTime() + minsToAdd * 60000).toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', hour12: false });
        }
        return ({...row, timeAv: tArr});
        // return ([]);
      })
      return (newArr);
    })
    return newAllOptions;
  }

  const onSearch = function(bookingReqs, receivedDate) {
    const day = new Date(receivedDate).toLocaleString('en-us', {weekday:'long'})
    axios.post(`http://localhost:7100/api/booking`, {bookingReqs, day, date: receivedDate})
    .then(res => {
      const temp = checkAvailability(res.data.options, res.data.booked)
      setAllSpots(temp);
      setAllBooked(res.data.booked);
    })
    .catch(error => {
      console.log(error.message);
    })
  }

  function timeClicked(wantedTime, wantedGroup, wantedDate) {

    let bookSummery = [];
    let start = wantedTime;
    
    for (let i = 0; i < wantedGroup.length; i++) {
      let dur = wantedGroup[i].duration;
      let end = new Date(new Date("1970/01/01 " + start).getTime() + dur * 60000).toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', hour12: false });
      bookSummery.push({
        stylistId: wantedGroup[i].stylist_id,
        stylistName: wantedGroup[i].stylist,
        stylistImage: wantedGroup[i].image,
        stylistLevel: wantedGroup[i].level,
        service: wantedGroup[i].service,
        startTime: start,
        endTime: end,
        date: wantedDate,
        userId: 1
      })
      start = end;
    }
   
    setWantToBook({
      date: wantedDate,
      time: wantedTime,
      stylists: bookSummery
    })

    // axios.post(`http://localhost:7100/api/booking/${newTime}`, {stylistId, date, serviceId, userId: 1, duration })
    // .then(res => {
    //   console.log(res.data);
    // })
    // .catch(error => {
    //   console.log(error.message);
    // })
  }

  // console.log('👨🏼‍🎨👩‍🎨', stylists, availability);
  // console.log('✂️🪒', serviceGroups, services);
  // console.log('🪒', service);
  console.log('📖', allSpots);
  console.log('📖❌', allBooked);

  console.log('👀👀 wanted to book \n', wantToBook);


  return (
    <main className="layout">
      <GeneralContext.Provider value={{ stylists, availability, serviceGroups, services, allSpots, allBooked, setAllBooked, setAllSpots }}>

        <Navbar />
        <div className="app-body">
          <Routes>
            <Route path='/stylists' element={<Stylists />}/>
            <Route path='/stylists/:id' element={<Stylist />}/>
            <Route path='/services' element={<Services reqClicked={reqClicked}/>}/>
            <Route path='/booking' element={
              <Booking
                formData={formData}
                setFormData={setFormData}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                onSearch={onSearch}
                timeClicked={timeClicked}
              />}/>
            <Route path='/booking-confirm' element={<BookingConfirm info={wantToBook}/>}/>
          </Routes>
        </div>

      </GeneralContext.Provider>
    </main>
  );
}

export default App;
