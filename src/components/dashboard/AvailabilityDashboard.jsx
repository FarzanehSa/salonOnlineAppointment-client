import { useContext, useState, useEffect } from "react";
import axios from "axios";
import Modal from 'react-modal';

import moment from 'moment';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

import GeneralContext from "../../contexts/GeneralContext";
import ConfirmAddModal from "./ConfirmAddModal";
import './AvailabilityDashboard.scss';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
      // width: 250,
    },
  },
};

const CssSelect = styled(Select)({
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "LightGray"
    },
    "&:hover fieldset": {
      borderColor: "MediumPurple"
    },
    "&.Mui-focused fieldset": {
      borderColor: "LightSeaGreen"
    },
  }
});

const AvailabilityDashboard = () => {

  const { serviceGroups, services, stylists } = useContext(GeneralContext);

  const [openHours, setOpenHours] = useState([]);
  const [searchForm, setSearchForm] = useState({stylist: ""});
  const [availability, setAvailability] = useState([]);

  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [msg, setMsg] = useState("");

  const [value, setValue] = useState([null, null, null, null, null, null, null]);
  const [availabilityForm, setAvailabilityForm] = useState([
    {id: 1, start: '', end: '', dayid: 1, day: 'Monday'},
    {id: 2, start: '', end: '', dayid: 2, day: 'Tuesday'},
    {id: 3, start: '', end: '', dayid: 3, day: 'Wednesday'},
    {id: 4, start: '', end: '', dayid: 4, day: 'Thursday'},
    {id: 5, start: '', end: '', dayid: 5, day: 'Friday'},
    {id: 6, start: '', end: '', dayid: 6, day: 'Saturday'},
    {id: 7, start: '', end: '', dayid: 7, day: 'Sunday'}
  ]);

  const format = 'HH:mm';

  useEffect(() => {
    axios.get('http://localhost:7100/api/spec/open-hours')
    .then(res => {
      setOpenHours(res.data.openHours);
    })
  }, []);

  useEffect(() => {
    axios.get(`http://localhost:7100/api/availability/${searchForm.stylist}`, {
    })
    .then(res => {
      // console.log(res.data);
      setAvailability(res.data.availability)
    })
  }, [searchForm]);

  const handleChangeSearch = (event) => {
    const {name, value} = event.target;
    setSearchForm({[name]: value});
  };

  const onChange0 = (valueT, timeString) => {
    setValue(value.map((row, index) => {
      if (index === 0 && valueT) {
        const oH = dayjs(openHours[0].open, format);
        const cH = dayjs(openHours[0].close, format);
        const start = (valueT[0] > oH && valueT[0] < cH) ? valueT[0] : oH;
        const end = (valueT[1] < cH && valueT[1] > oH) ? valueT[1] : cH;
        return [start, end];
      } else if (index === 0) {
        return null;
      } else return row;
    }));
    
    setAvailabilityForm(availabilityForm.map((row, index) => {
      if (index === 0 && valueT) {
        const oH = openHours[0].open;
        const cH = openHours[0].close;
        const start = (timeString[0] > oH && timeString[0] < cH) ? timeString[0] : oH;
        const end = (timeString[1] < cH && timeString[1] > oH) ? timeString[1] : cH;
        return {...availabilityForm[0], start, end};
      } else if (index === 0) {
        return {...availabilityForm[0], start: '', end: ''};
      } else return row;
    }));
  };

  const onChange1 = (valueT, timeString) => {
    setValue(value.map((row, index) => {
      if (index === 1 && valueT) {
        const oH = dayjs(openHours[1].open, format);
        const cH = dayjs(openHours[1].close, format);
        const start = (valueT[0] > oH && valueT[0] < cH) ? valueT[0] : oH;
        const end = (valueT[1] < cH && valueT[1] > oH) ? valueT[1] : cH;
        return [start, end];
      } else if (index === 1) {
        return null;
      } else return row;
    }));
    
    setAvailabilityForm(availabilityForm.map((row, index) => {
      if (index === 1 && valueT) {
        const oH = openHours[1].open;
        const cH = openHours[1].close;
        const start = (timeString[0] > oH && timeString[0] < cH) ? timeString[0] : oH;
        const end = (timeString[1] < cH && timeString[1] > oH) ? timeString[1] : cH;
        return {...availabilityForm[1], start, end};
      } else if (index === 1) {
        return {...availabilityForm[1], start: '', end: ''};
      } else return row;
    }));
  };

  const onChange2 = (valueT, timeString) => {
    setValue(value.map((row, index) => {
      if (index === 2 && valueT) {
        const oH = dayjs(openHours[2].open, format);
        const cH = dayjs(openHours[2].close, format);
        const start = (valueT[0] > oH && valueT[0] < cH) ? valueT[0] : oH;
        const end = (valueT[1] < cH && valueT[1] > oH) ? valueT[1] : cH;
        return [start, end];
      } else if (index === 2) {
        return null;
      } else return row;
    }));
    
    setAvailabilityForm(availabilityForm.map((row, index) => {
      if (index === 2 && valueT) {
        const oH = openHours[2].open;
        const cH = openHours[2].close;
        const start = (timeString[0] > oH && timeString[0] < cH) ? timeString[0] : oH;
        const end = (timeString[1] < cH && timeString[1] > oH) ? timeString[1] : cH;
        return {...availabilityForm[2], start, end};
      } else if (index === 2) {
        return {...availabilityForm[2], start: '', end: ''};
      } else return row;
    }));
  };

  const onChange3 = (valueT, timeString) => {
    setValue(value.map((row, index) => {
      if (index === 3 && valueT) {
        const oH = dayjs(openHours[3].open, format);
        const cH = dayjs(openHours[3].close, format);
        const start = (valueT[0] > oH && valueT[0] < cH) ? valueT[0] : oH;
        const end = (valueT[1] < cH && valueT[1] > oH) ? valueT[1] : cH;
        return [start, end];
      } else if (index === 3) {
        return null;
      } else return row;
    }));
    
    setAvailabilityForm(availabilityForm.map((row, index) => {
      if (index === 3 && valueT) {
        const oH = openHours[3].open;
        const cH = openHours[3].close;
        const start = (timeString[0] > oH && timeString[0] < cH) ? timeString[0] : oH;
        const end = (timeString[1] < cH && timeString[1] > oH) ? timeString[1] : cH;
        return {...availabilityForm[3], start, end};
      } else if (index === 3) {
        return {...availabilityForm[3], start: '', end: ''};
      } else return row;
    }));
  };

  const onChange4 = (valueT, timeString) => {
    setValue(value.map((row, index) => {
      if (index === 4 && valueT) {
        const oH = dayjs(openHours[4].open, format);
        const cH = dayjs(openHours[4].close, format);
        const start = (valueT[0] > oH && valueT[0] < cH) ? valueT[0] : oH;
        const end = (valueT[1] < cH && valueT[1] > oH) ? valueT[1] : cH;
        return [start, end];
      } else if (index === 4) {
        return null;
      } else return row;
    }));
    
    setAvailabilityForm(availabilityForm.map((row, index) => {
      if (index === 4 && valueT) {
        const oH = openHours[4].open;
        const cH = openHours[4].close;
        const start = (timeString[0] > oH && timeString[0] < cH) ? timeString[0] : oH;
        const end = (timeString[1] < cH && timeString[1] > oH) ? timeString[1] : cH;
        return {...availabilityForm[4], start, end};
      } else if (index === 4) {
        return {...availabilityForm[4], start: '', end: ''};
      } else return row;
    }));
  };

  const onChange5 = (valueT, timeString) => {
    setValue(value.map((row, index) => {
      if (index === 5 && valueT) {
        const oH = dayjs(openHours[5].open, format);
        const cH = dayjs(openHours[5].close, format);
        const start = (valueT[0] > oH && valueT[0] < cH) ? valueT[0] : oH;
        const end = (valueT[1] < cH && valueT[1] > oH) ? valueT[1] : cH;
        return [start, end];
      } else if (index === 5) {
        return null;
      } else return row;
    }));
    
    setAvailabilityForm(availabilityForm.map((row, index) => {
      if (index === 5 && valueT) {
        const oH = openHours[5].open;
        const cH = openHours[5].close;
        const start = (timeString[0] > oH && timeString[0] < cH) ? timeString[0] : oH;
        const end = (timeString[1] < cH && timeString[1] > oH) ? timeString[1] : cH;
        return {...availabilityForm[5], start, end};
      } else if (index === 5) {
        return {...availabilityForm[5], start: '', end: ''};
      } else return row;
    }));
  };

  const onChange6 = (valueT, timeString) => {
    setValue(value.map((row, index) => {
      if (index === 6 && valueT) {
        const oH = dayjs(openHours[6].open, format);
        const cH = dayjs(openHours[6].close, format);
        const start = (valueT[0] > oH && valueT[0] < cH) ? valueT[0] : oH;
        const end = (valueT[1] < cH && valueT[1] > oH) ? valueT[1] : cH;
        return [start, end];
      } else if (index === 6) {
        return null;
      } else return row;
    }));
    
    setAvailabilityForm(availabilityForm.map((row, index) => {
      if (index === 6 && valueT) {
        const oH = openHours[6].open;
        const cH = openHours[6].close;
        const start = (timeString[0] > oH && timeString[0] < cH) ? timeString[0] : oH;
        const end = (timeString[1] < cH && timeString[1] > oH) ? timeString[1] : cH;
        return {...availabilityForm[6], start, end};
      } else if (index === 6) {
        return {...availabilityForm[6], start: '', end: ''};
      } else return row;
    }));
  };

  const onUpdate = (event) => {
    event.preventDefault();
    setMsg(`Are you ready to update availability?`);
    setModalUpdateIsOpen(true);
  }

  const onCancelAdd = () => {
    const clearForm = availabilityForm.map(row => {
      return ({...row, start:'', end: ''});
    });
    const clearValue = value.map(row => {
      return null;
    })
    setAvailabilityForm(clearForm);
    setValue(clearValue);
  }

  const onConfirmAdd = () => {
    axios.post(`http://localhost:7100/api/availability/${searchForm.stylist}`, {ava: availabilityForm})
    .then(res => {
      setAvailability(res.data.availability);
      onCancelAdd();
    })
  }

  const closeModal = () => {
    setModalUpdateIsOpen(false);
  }

  console.log('openHours', openHours);
  console.log('availabilityForm', availabilityForm);
  console.log('availability', availability);

  return (
    <div className="availability-dashboard-page">
      <Modal
        isOpen={modalUpdateIsOpen}
        onRequestClose={closeModal}
        appElement={document.getElementById('root')}
        className="modal"
        shouldCloseOnOverlayClick={false}
      >
        {modalUpdateIsOpen && <ConfirmAddModal onClose={closeModal} msg={msg} onConfirmAdd={onConfirmAdd}/>}
      </Modal>
      <div className="search-employee-part">
        <span className="title-2">Find Stylist: </span>
        <CssSelect
          required
          id="stylist"
          name="stylist"
          value={searchForm.stylist}
          onChange={handleChangeSearch}
          variant="outlined"
          size="small"
          className="search-employee"
          MenuProps={MenuProps}
        >
          <MenuItem value="">
            <em> --- </em>
          </MenuItem>
          {stylists.map(row => {
            return (
              <MenuItem key={row.id} value={row.id} >{row.name}</MenuItem>
            )})
          }
        </CssSelect>
      </div>
      {searchForm.stylist &&
        <div className="availability-part">
          <div className="old-data">
            <span className="title">Last saved availability</span>
            {availability.length ? 
              <div>
                {availability.map(row => {
                  return (
                    <div key={row.id} className="row-av-data">
                      <div className="d-day">{row.day}</div>
                      <div className="">{row.start}</div>
                      <span className="d-to">to</span>
                      <div className="">{row.end}</div>
                    </div>
                  )}
                )}
              </div>  
              : 
              <div>Noting found!</div>  
            }
          </div>
          <div>

          </div>
          <form onSubmit={onUpdate} className="update-availability-form">
            <div className="title">Edit availability</div>
            <div className="timerange-picker">
              <div className="day-text">Mondays</div>
              <TimePicker.RangePicker
                format={format}
                value={value[0]}
                onChange={onChange0}
                minuteStep={15}
                size="large"
                style={{
                  borderColor:"LightSeaGreen",
                  borderRadius: "10px",
                  cursor: "pointer",
                  margin: "0.3em",
                  padding: "0.6em"
                }}
              />
            </div>
            <div className="timerange-picker">
              <div className="day-text">Tuesdays</div>
              <TimePicker.RangePicker
                format={format}
                value={value[1]}
                onChange={onChange1}
                minuteStep={15}
                size="large"
                style={{
                  borderColor:"LightSeaGreen",
                  borderRadius: "10px",
                  cursor: "pointer",
                  margin: "0.3em",
                  padding: "0.6em"
                }}
              />
            </div>
            <div className="timerange-picker">
              <div className="day-text">Wednesdays</div>
              <TimePicker.RangePicker
                format={format}
                value={value[2]}
                onChange={onChange2}
                minuteStep={15}
                size="large"
                style={{
                  borderColor:"LightSeaGreen",
                  borderRadius: "10px",
                  cursor: "pointer",
                  margin: "0.3em",
                  padding: "0.6em"
                }}
              />
            </div>
            <div className="timerange-picker">
              <div className="day-text">Thursdays</div>
              <TimePicker.RangePicker
                format={format}
                value={value[3]}
                onChange={onChange3}
                minuteStep={15}
                size="large"
                style={{
                  borderColor:"LightSeaGreen",
                  borderRadius: "10px",
                  cursor: "pointer",
                  margin: "0.3em",
                  padding: "0.6em"
                }}
              />
            </div>
            <div className="timerange-picker">
              <div className="day-text">Fridays</div>
              <TimePicker.RangePicker
                format={format}
                value={value[4]}
                onChange={onChange4}
                minuteStep={15}
                size="large"
                style={{
                  borderColor:"LightSeaGreen",
                  borderRadius: "10px",
                  cursor: "pointer",
                  margin: "0.3em",
                  padding: "0.6em"
                }}
              />
            </div>
            <div className="timerange-picker">
              <div className="day-text">Saturdays</div>
              <TimePicker.RangePicker
                format={format}
                value={value[5]}
                onChange={onChange5}
                minuteStep={15}
                size="large"
                style={{
                  borderColor:"LightSeaGreen",
                  borderRadius: "10px",
                  cursor: "pointer",
                  margin: "0.3em",
                  padding: "0.6em"
                }}
              />
            </div>
            <div className="timerange-picker">
              <div className="day-text">Sundays</div>
              <TimePicker.RangePicker
                format={format}
                value={value[6]}
                onChange={onChange6}
                minuteStep={15}
                size="large"
                style={{
                  borderColor:"LightSeaGreen",
                  borderRadius: "10px",
                  cursor: "pointer",
                  margin: "0.3em",
                  padding: "0.6em"
                }}
              />
            </div>
            <div className="buttons">
              <button type="button" className="btn-cancel" onClick={() => onCancelAdd()}>Cancel</button>
              <button type="submit" className="btn-update">Update</button>
            </div>
          </form>
        </div>
      }
      
      

    </div>
  )
}

export default AvailabilityDashboard  ;