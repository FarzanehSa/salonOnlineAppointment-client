import {useState, useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import GeneralContext from './contexts/GeneralContext';

import Navbar from './components/Navbar';
import Stylists from './components/Stylists';
import Stylist from './components/Stylist';
import './App.scss';

function App() {

  const [stylists, setStylists] = useState([]);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {

    const f1 = axios.get('http://localhost:7100/api/stylists');

    Promise.all([f1])
      .then(([r1]) => {
        console.log(r1.data);
        setStylists(prev => r1.data.stylists);
        setSchedule(prev => r1.data.schedule);
      });
  }, []);

  console.log('👨🏼‍🎨👩‍🎨', stylists);

  return (
    <main className="layout">
      <GeneralContext.Provider value={{ stylists, schedule }}>

        <Navbar />
        <div className="app-body">
          <Routes>
            <Route path='/stylists' element={<Stylists />}/>
            <Route path='/stylists/:id' element={<Stylist />}/>
          </Routes>
        </div>

      </GeneralContext.Provider>
    </main>
  );
}

export default App;
