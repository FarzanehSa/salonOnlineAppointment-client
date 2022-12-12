import { useContext, useState, useEffect } from "react";
import axios from "axios";
import Modal from 'react-modal';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

import GeneralContext from "../../contexts/GeneralContext";
import './ServiceDashboard.scss';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'black',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'black',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'LightGray',
    },
    '&:hover fieldset': {
      borderColor: 'Goldenrod',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'LightSeaGreen',
    },
  },
});

const ServiceDashboard = ({setServices}) => {

  const { serviceGroups, services } = useContext(GeneralContext);
  
  const [addServiceForm, setAddServiceForm] = useState({groupId:"", service:"", price:"", description:"", duration:""});
  const [errorMsg, setErrorMsg] = useState("");

  const groupsArr = serviceGroups.map(row => {
    return (
      <MenuItem key={row.id} value={row.id} >{row.group}</MenuItem>
    )
  });

  const onAdd = (event) => {
    event.preventDefault();
    const regexPrice = /^\d+(\.\d{1,2})?$/;
    const regexDuration = /^[1-9][0-9]*$/;
    if (!regexPrice.test(addServiceForm.price)) {
      setErrorMsg('invalid price')
    } else if (!regexDuration.test(addServiceForm.duration)) {
      setErrorMsg('invalid duration')
    } else {
      axios.post(`http://localhost:7100/api/services`, {...addServiceForm, service: addServiceForm.service.trim(), description: addServiceForm.description.trim()})
      .then(res => {
        console.log(res.data);
      })
    }
    
  }
  const onCancelAdd = () => {
    setAddServiceForm({groupId:"", service:"", price:"", description:"", duration:""})
    setErrorMsg("")
  }
  const handleChangeAdd = (event) => {
    const {name, value} = event.target;
    setAddServiceForm({...addServiceForm, [name]: value})
  }

  console.log(addServiceForm);
  console.log(errorMsg);

  return (
    <div className="service-dashboard-page">
      <div className="add-service-part">
        <span className="title">Add new service</span>
        {!serviceGroups.length &&
        <div>You have to add service group at first!</div>
        }
        <form onSubmit={onAdd} className="add-form"> 
          <div className="input-group">
            <span>group: </span>    
            <Select
              required
              id="groupId"
              name="groupId"
              value={addServiceForm.groupId}
              onChange={handleChangeAdd}
              variant="outlined"
              size="small"
            >
              {groupsArr}
            </Select>
          </div>
          <div className="input-group">
            <span>name: </span>    
            <CssTextField
              required
              id="service"
              name="service"
              value={addServiceForm.service}
              onChange={handleChangeAdd}
              variant="outlined"
              size="small"
              margin="normal"
              className="input-text"
            />
          </div>
          <div className="input-group">
            <span>price: </span>    
            <CssTextField
              required
              id="price"
              name="price"
              type='number'
              value={addServiceForm.price}
              onChange={handleChangeAdd}
              variant="outlined"
              size="small"
              margin="normal"
              InputProps={{
                startAdornment: (<InputAdornment position="start">$</InputAdornment>)
              }}
              className="input-text"
            />
          </div>
          <div className="input-group">
            <span>duration: </span>    
            <CssTextField
              required
              id="duration"
              name="duration"
              type='number'
              value={addServiceForm.duration}
              onChange={handleChangeAdd}
              variant="outlined"
              size="small"
              margin="normal"
              className="input-text"
            />
          </div>
          <div className="input-group">
            <span>description: </span>    
            <CssTextField
              required
              id="description"
              name="description"
              multiline
              maxRows={10}
              value={addServiceForm.description}
              onChange={handleChangeAdd}
              variant="outlined"
              size="small"
              margin="normal"
              inputProps={{min: 0, style: { textAlign: 'center' }}}
              className="input-text"
            />
          </div>
          <div>{errorMsg}</div>
          <div className="buttons">
            <button type="button" className="btn-cancel" onClick={() => onCancelAdd()}>Cancel</button>
            <button type="submit" className="btn-save">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ServiceDashboard;