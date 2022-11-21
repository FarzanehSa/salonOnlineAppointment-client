import {useState, useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import GeneralContext from './contexts/GeneralContext';

import Navbar from './components/Navbar';
import Stylists from './components/Stylists';
import Services from './components/Services';
import Stylist from './components/Stylist';
import Booking from './components/Booking';
import './App.scss';

function App() {

  const [stylists, setStylists] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [serviceGroups, setServiceGroups] = useState([]);
  const [services, setServices] = useState([]);
  const [service, setService] = useState();
  const [stylist, setStylist] = useState();
  const [allSpots, setAllSpots] = useState([]);
  const [allBooked, setAllBooked] = useState([]);
  
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
    setService(serviceId);
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

  const onSearch = function(formData) {
    const myDay = new Date(formData[0].date).toLocaleString('en-us', {weekday:'long'})
    axios.post(`http://localhost:7100/api/booking`, {reqApps: formData, day: myDay})
    .then(res => {
      const temp = checkAvailability(res.data.options, res.data.booked)
      setAllSpots(temp);
      setAllBooked(res.data.booked);
    })
    .catch(error => {
      console.log(error.message);
    })
  }

  const timeClicked = function(newTime, stylistId, date, serviceId, duration) {
    axios.post(`http://localhost:7100/api/booking/${newTime}`, {stylistId, date, serviceId, userId: 1, duration })
    .then(res => {
      console.log(res.data);
    })
    .catch(error => {
      console.log(error.message);
    })
  }

  // console.log('👨🏼‍🎨👩‍🎨', stylists, availability);
  // console.log('✂️🪒', serviceGroups, services);
  // console.log('🪒', service);
  console.log('📖', allSpots);
  console.log('📖❌', allBooked);


  return (
    <main className="layout">
      <GeneralContext.Provider value={{ stylists, availability, serviceGroups, services, allSpots, allBooked, setAllBooked, setAllSpots }}>

        <Navbar />
        <div className="app-body">
          <Routes>
            <Route path='/stylists' element={<Stylists />}/>
            <Route path='/stylists/:id' element={<Stylist />}/>
            <Route path='/services' element={<Services reqClicked={reqClicked}/>}/>
            <Route path='/booking' element={<Booking service={service} onSearch={onSearch} timeClicked={timeClicked}/>}/>
          </Routes>
        </div>

      </GeneralContext.Provider>
    </main>
  );
}

export default App;
