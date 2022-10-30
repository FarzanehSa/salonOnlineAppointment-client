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

  console.log('👨🏼‍🎨👩‍🎨', stylists, availability);
  console.log('✂️🪒', serviceGroups, services);
  console.log('🪒', service);

  return (
    <main className="layout">
      <GeneralContext.Provider value={{ stylists, availability, serviceGroups, services }}>

        <Navbar />
        <div className="app-body">
          <Routes>
            <Route path='/stylists' element={<Stylists />}/>
            <Route path='/stylists/:id' element={<Stylist />}/>
            <Route path='/services' element={<Services reqClicked={reqClicked}/>}/>
            <Route path='/booking' element={<Booking service={service} />}/>
          </Routes>
        </div>

      </GeneralContext.Provider>
    </main>
  );
}

export default App;
