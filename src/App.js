import {useState, useEffect} from 'react';
import { Routes, Route, useMatch } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

import GeneralContext from './contexts/GeneralContext';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Stylists from './components/Stylists';
import Services from './components/Services';
import Stylist from './components/Stylist';
import Booking from './components/Booking';
import BookingConfirm from './components/BookingConfirm';
import SuccessfullBook from './components/SuccessfullBook';
import Appointments from './components/Appointments';

import NavbarAdmin from './components/dashboard/NavbarAdmin';
import Dashboard from './components/dashboard/Dashboard';
import ServiceGroupDashboard from './components/dashboard/ServiceGroupDashboard';
import ServiceDashboard from './components/dashboard/ServiceDashboard';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import AvailabilityDashboard from './components/dashboard/AvailabilityDashboard';

import './App.scss';
import es from 'date-fns/esm/locale/es/index.js';

function App() {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let tomorrow =  new Date();
  tomorrow.setDate(today.getDate() + 1);

  const [successfullBook, setSuccessfullBook] = useState(false);
  const [title, setTitle] = useState("Online Book")

  const [timeTable, setTimeTable] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [serviceGroups, setServiceGroups] = useState([]);
  const [services, setServices] = useState([]);

  const [formReqBook, setFormReqBook] = useState([{service: "", stylists: []}]);
  const [selectedDay, setSelectedDay] = useState(tomorrow);
  const [qualifiedStylists, setQualifiedStylists] = useState([[]]);
  const [successBookInfo, setSuccessBookInfo] = useState({});
  const [user, setUser] = useState({});

  const [allSpots, setAllSpots] = useState([]);
  const [allBooked, setAllBooked] = useState([]);
  const [wantToBook, setWantToBook] = useState({});
  const [loginErrormsg, setLoginErrorMsg] = useState('');

  // use this to change the navbar
  const matchDashboard = useMatch('/dashboard/*');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
    }

    const f1 = axios.get('http://localhost:7100/api/stylists');
    const f2 = axios.get('http://localhost:7100/api/service-groups');

    Promise.all([f1, f2])
      .then(([r1, r2]) => {
        // console.log(r2.data);
        setTimeTable(r2.data.timeTable);
        setStylists(prev => r1.data.stylists);
        setAvailability(prev => r1.data.availability);
        setServiceGroups(prev => r2.data.groups);
        setServices(prev => r2.data.services);
      });
    }, []);

  useEffect(() => {
    document.title = title;
  },[title]);
    
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const reqClicked = function(serviceId) {
    setFormReqBook(pre => ([{service: serviceId, stylists: []}]));
  }

  function closeModal() {
    setSuccessfullBook(false);
  }

  const onRegister = (formData) => {
    axios.post(`http://localhost:7100/api/register`, {info: {...formData}})
    .then(res => {
      if (res.data.errorCode) {
        setLoginErrorMsg("This email had sign up before, please login to your account.")
      } else {
        setUser(res.data.user);
      }
    })
    .catch(error => {
      console.log(error.message);
    })
  }

  const onLogin = (formData) => {
    axios.post(`http://localhost:7100/api/login`, {info: {...formData}})
    .then(res => {
      if (res.data.errorCode) {
        setLoginErrorMsg("This email had sign up before, please login to your account.")
      } else {
        setUser(res.data.user);
      }
    })
    .catch(error => {
      console.log(error.message);
    })
  }
  
  const checkAvailability = (allOptions, bookedOnes) => {

    const updateAllOptions = allOptions.map(taskOptions => {
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
    });
     return updateAllOptions;
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
        serviceId:wantedGroup[i].serviceid
      })
      start = end;
    }
   
    setWantToBook({
      date: wantedDate,
      time: wantedTime,
      stylists: bookSummery
    })
  }
  
  const handleSendRequest = function(info) {
    axios.post(`http://localhost:7100/api/booking/save`, {tasks: info, user: user})
    .then(res => {
      setSuccessBookInfo(res.data)
      setFormReqBook([{service: "", stylists: []}]);
      setSelectedDay(tomorrow);
      
      setAllSpots([]);
      setAllBooked([]);
      setWantToBook({});

      setSuccessfullBook(true);
    })
    .catch(error => {
      toast(`Something goes wrong, please try again later!`, {type: 'error'});
      console.log(error.message);
    })

  }

  // console.log('👨🏼‍🎨👩‍🎨', stylists, availability);
  // console.log('✂️🪒', serviceGroups, services);

  // console.log('📖', allSpots);
  // console.log('📖❌', allBooked);
  // console.log('🧤 formReqBook \n', formReqBook);
  // console.log('👀👀 wanted to book \n', wantToBook);
  // console.log('❌❌❌ loginErrorMsg \n', loginErrormsg);
  // console.log('🦋 user \n', user);


  return (
    <main className="layout">
      <GeneralContext.Provider value={{ stylists, availability, serviceGroups, services, allSpots, allBooked, setAllBooked, setAllSpots, user, timeTable }}>

        {matchDashboard && !user.id && <NavbarAdmin setUser={setUser}/>}
        {matchDashboard && user.id && <NavbarAdmin setUser={setUser}/>}
        {!matchDashboard && <Navbar setUser={setUser}/>}

        <Modal
          isOpen={successfullBook}
          onRequestClose={closeModal}
          appElement={document.getElementById('root')}
          className="modal"
        >
          {successfullBook && <SuccessfullBook date={successBookInfo.date} info={successBookInfo.savedData} onClose={closeModal} />}
        </Modal>
        <ToastContainer />

        <div className="app-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/*" element={<Home />} />
            <Route path='/register' element={<Register onRegister={onRegister} error={loginErrormsg} setError={setLoginErrorMsg}/>}/>
            <Route path='/login' element={<Login onLogin={onLogin} error={loginErrormsg} setError={setLoginErrorMsg} wantToBook={wantToBook}/>}/>
            <Route path='/stylists' element={<Stylists />}/>
            <Route path='/stylists/:id' element={<Stylist />}/>
            <Route path='/services' element={<Services reqClicked={reqClicked}/>}/>
            <Route path='/booking' element={
              <Booking
                formReqBook={formReqBook}
                setFormReqBook={setFormReqBook}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                onSearch={onSearch}
                timeClicked={timeClicked}
                qualifiedStylists={qualifiedStylists}
                setQualifiedStylists={setQualifiedStylists}
              />}/>
            <Route path='/booking-confirm' element={<BookingConfirm info={wantToBook} handleSendRequest={handleSendRequest} />}/>
            <Route path='/appointments/:id' element={<Appointments />}/>
            <Route path='/dashboard' element={<Dashboard />}/>
            <Route path='/dashboard/service-group' element={<ServiceGroupDashboard setServiceGroups={setServiceGroups}/>}/>
            <Route path='/dashboard/service' element={<ServiceDashboard setServices={setServices}/>}/>
            <Route path='/dashboard/employee' element={<EmployeeDashboard setStylists={setStylists}/>}/>
            <Route path='/dashboard/availability' element={<AvailabilityDashboard />}/>
          </Routes>
        </div>

      </GeneralContext.Provider>
    </main>
  );
}

export default App;
