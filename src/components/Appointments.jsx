import { useContext, useState } from "react";
import axios from "axios";
import Modal from 'react-modal';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import GeneralContext from "../contexts/GeneralContext";
import AppointmentDeleteModal from "../components/AppointmentDeleteModal"
import './Appointments.scss';

const Appointments = () => {

  const { user } = useContext(GeneralContext);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [comingAppointments, setComingAppointments] = useState([]);
  const [showApps, setShowApps] = useState({past: false, coming: false});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteApp, setDeleteApp] = useState({});

  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', hour12: false });

  const getPastApps = () => {
    axios.get(`${url}/api/appointments/${user.id}`, {
      params: {date, time, status: "past"}
    })
    .then(res => {
      setPastAppointments(res.data.apps);
      setShowApps({...showApps, past: true});
    })
  }

  const getComingApps = () => {
    axios.get(`${url}/api/appointments/${user.id}`, {
      params: { date, time, status: "coming"}
    })
    .then(res => {
      setComingAppointments(res.data.apps);
      setShowApps({...showApps, coming: true});
    })
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  const onDelete = (app) => {
    setDeleteApp(app);
    setModalIsOpen(true);
  }

  const onConfirm = (id) => {
    axios.delete(`${url}/api/appointments/${id}`)
    .then(res => {
      console.log(res.data);
      setDeleteApp({});
      const newApps = comingAppointments.filter(row => row.id !== res.data.deletedApp.id)
      setComingAppointments(newApps);

    })
  }


  const comingAppsArray = comingAppointments.map(row => {
    return (
      <TableRow hover tabIndex={-1} key={row.id}>
        <TableCell align='center'>
          <span className='date'>{row.date.slice(0, 10)}</span>
        </TableCell>
        <TableCell align='center'>
          <span className='time'>{row.time}</span>
        </TableCell>
        <TableCell align='left'>
          <span className='service'>{row.service}</span>
        </TableCell>
        <TableCell align='left'>
          <span className='stylist'>{row.stylist}</span>
        </TableCell>
        <TableCell align='center'>
          <button className="btn-delete" onClick={() => onDelete(row)}>
            <FontAwesomeIcon icon="fa-solid fa-rectangle-xmark" />
          </button>
        </TableCell>
      </TableRow>
    );
  })

  const pastAppsArray = pastAppointments.map(row => {
    return (
      <TableRow hover tabIndex={-1} key={row.id}>
        <TableCell align='center'>
          <span className='date'>{row.date.slice(0, 10)}</span>
        </TableCell>
        <TableCell align='center'>
          <span className='time'>{row.time}</span>
        </TableCell>
        <TableCell align='left'>
          <span className='service'>{row.service}</span>
        </TableCell>
        <TableCell align='left'>
          <span className='stylist'>{row.stylist}</span>
        </TableCell>
      </TableRow>
    );
  })

  return (
    <div className="appointments-page">
      {user.id &&
        <div className="appointments">
          <div className="buttons">
            <button className="btn-call-apps" onClick={() => {getComingApps()}}>Upcoming Appointments</button>
            <button className="btn-call-apps" onClick={() => {getPastApps()}}>Past Appointments</button>
          </div>
          {showApps.coming &&
          <div className="apps-list">
            <span className="title">Upcoming Appointments</span>
            {comingAppointments.length ?
              <Paper className="apps-table" sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" style={{minWidth: 70}}>Date</TableCell>
                        <TableCell align="center" style={{minWidth: 100}}>Time</TableCell>
                        <TableCell align="left" style={{minWidth: 150}}>Service</TableCell>
                        <TableCell align="left" style={{minWidth: 70}}>Stylist</TableCell>
                        <TableCell align="center" style={{minWidth: 70}}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {comingAppsArray}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            :
              <div className="no-result">
                <span>You don't have any upcoming appointments.</span>
              </div>
            }
          </div>
          }
          {showApps.past &&
          <div className="apps-list">
            <span className="title">Past Appointments</span>
            {pastAppointments.length ?
              <Paper className="apps-table" sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" style={{minWidth: 70}}>Date</TableCell>
                        <TableCell align="center" style={{minWidth: 100}}>Time</TableCell>
                        <TableCell align="left" style={{minWidth: 150}}>Service</TableCell>
                        <TableCell align="left" style={{minWidth: 70}}>Stylist</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pastAppsArray}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            :
              <div className="no-result">
                <span>You don't have any past appointments.</span>
              </div>
            }
          </div>
          }
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            appElement={document.getElementById('root')}
            className="modal"
            shouldCloseOnOverlayClick={false}
          >
            {/* <AppointmentDeleteModal onClose={closeModal} onSubmit={deleteApp}/> */}
            <AppointmentDeleteModal onClose={closeModal} deleteApp={deleteApp} onConfirm={onConfirm}/>
          </Modal>
        </div>
      }
      {!user.id &&
        <div>Please, login to your account to check the history of your appointments.</div>
      }
    </div>
  )
}

export default Appointments;