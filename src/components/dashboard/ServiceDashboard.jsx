import { useContext, useState } from "react";
import axios from "axios";
import Modal from 'react-modal';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

import GeneralContext from "../../contexts/GeneralContext";
import ConfirmAddModal from "./ConfirmAddModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ConfirmEditModal from "./ConfirmEditModal";
import './ServiceDashboard.scss';

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
      borderColor: 'MediumPurple',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'LightSeaGreen',
    },
  },
});

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

const ServiceDashboard = ({setServices}) => {

  const { serviceGroups, services } = useContext(GeneralContext);
  
  const [addServiceForm, setAddServiceForm] = useState({groupId:"", service:"", price:"", description:"", duration:""});
  const [editServiceForm, setEditServiceForm] = useState({id:"", groupId:"", service:"", price:"", description:"", duration:""});
  const [searchForm, setSearchForm] = useState({service: ""});
  const [deletedService, setDeletedService] = useState("");

  const [errorMsgAdd, setErrorMsgAdd] = useState("");
  const [errorMsgEdit, setErrorMsgEdit] = useState("");

  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [msg, setMsg] = useState("");

  const durationArray = [
    {val: 10, name: '10 minutes'},
    {val: 15, name: '15 minutes'},
    {val: 30, name: '30 minutes'},
    {val: 45, name: '45 minutes'},
    {val: 60, name: '1 hour'},
    {val: 90, name: '1.5 hour'},
    {val: 120, name: '2 hours'},
    {val: 150, name: '2.5 hours'},
    {val: 180, name: '3 hours'},
    {val: 210, name: '3.5 hours'},
    {val: 240, name: '4 hours'},
  ];

  const groupsArr = serviceGroups.map(row => {
    return (
      <MenuItem key={row.id} value={row.id} >{row.group}</MenuItem>
    )
  });

  const onReqEdit = (id, groupid, service, price, description, duration) => {
    setEditServiceForm({id, groupId: groupid, service, price, description, duration});
    setSearchForm({service: ""});
  }
  
  const onAdd = (event) => {
    event.preventDefault();
    const regexPrice = /^\d+(\.\d{1,2})?$/;
    if (!regexPrice.test(addServiceForm.price)) {
      setErrorMsgAdd('Please insert valid price!');
    } else {
      setMsg(`Are you ready to add new service?`);
      setModalAddIsOpen(true);
    }
  }

  const onEdit = (event) => {
    event.preventDefault();
    const regexPrice = /^\d+(\.\d{1,2})?$/;
    if (!regexPrice.test(editServiceForm.price)) {
      setErrorMsgEdit('Please insert valid price!');
    } else {
      setMsg(`Are you sure you want to save changes?`);
      setModalEditIsOpen(true);
    }
  }

  const onDelete = (rId, rName) => {
    setDeletedService(rId);
    setMsg(`Are you sure you want to delete the ${rName} service?`);
    setModalDeleteIsOpen(true);
  }

  const onCancelAdd = () => {
    setAddServiceForm({groupId:"", service:"", price:"", description:"", duration:""})
    setErrorMsgAdd("");
  }

  const onCancelEdit = () => {
    setSearchForm({service: editServiceForm.id});
    setEditServiceForm({id:"", groupId:"", service:"", price:"", description:"", duration:""});
    setErrorMsgEdit("");
  }

  const handleChangeAdd = (event) => {
    const {name, value} = event.target;
    setAddServiceForm({...addServiceForm, [name]: value});
    setErrorMsgAdd("");
  }

  const handleChangeEdit = (event) => {
    const {name, value} = event.target;
    setEditServiceForm({...editServiceForm, [name]: value});
    setErrorMsgEdit("");
  }

  const handleChangeSearch = (event) => {
    const {name, value} = event.target;
    setEditServiceForm({id:"", groupId:"", service:"", price:"", description:"", duration:""});
    setSearchForm({[name]: value});
  }

  const onConfirmAdd = () => {
    axios.post(`http://localhost:7100/api/services`, {...addServiceForm, service: addServiceForm.service.trim(), description: addServiceForm.description.trim()})
    .then(res => {
      setServices(res.data.newServices);
    })
    setAddServiceForm({groupId:"", service:"", price:"", description:"", duration:""});
  }

  const onConfirmEdit = () => {
    axios.put(`http://localhost:7100/api/services`, {...editServiceForm, service: editServiceForm.service.trim(), description: editServiceForm.description.trim()})
    .then(res => {
      setServices(res.data.newServices);
    })
    setEditServiceForm({id:"", groupId:"", service:"", price:"", description:"", duration:""});
  }

  const onConfirmDelete = () => {
    axios.delete(`http://localhost:7100/api/services/${deletedService}`)
    .then(res => {
      const newServices = services.filter(row => row.id !== res.data.deleted.id);
      setServices(newServices);
    })
    setSearchForm({service: ""})
    setEditServiceForm({id:"", groupId:"", service:"", price:"", description:"", duration:""});
    setDeletedService("");
  }

  const closeModal = () => {
    setModalDeleteIsOpen(false);
    setModalEditIsOpen(false);
    setModalAddIsOpen(false);
  }

  const serviceDetails = services.filter(service => service.id === searchForm.service)
  .map(row => {
    return (
      <div key={row.id} className="show-service">
        <div className="name-price text-name-price">
          <div className="input-group">
            <span className="name-field">Name: </span>    
            <div className="input-name">{row.service}</div>
          </div>
          <div className="input-group">
            <span className="name-field">Price: </span>    
            <div className="input-price">${row.price / 100}</div>
          </div>
        </div>
        <div className="group-duration text-group-duration">
          <div className="input-group">
            <span className="name-field">Group: </span> 
            <div className="select-group">{row.group}</div>   
          </div>
          <div className="input-group">
            <span className="name-field">Duration: </span>    
            <div className="select-duration">{durationArray.filter(dur => dur.val === row.duration)[0].name}</div>
          </div>
        </div>
        <div className="description text-description">
          <span className="name-field">Description: </span> 
          <div className="input-group">
            <div className="input-description">{row.description}</div>   
          </div>
        </div>
        <div>
          <button className="btn-edit" onClick={() => onReqEdit(row.id, row.groupid, row.service, row.price / 100, row.description, row.duration)}><FontAwesomeIcon icon="fa-solid fa-pencil" /></button>
          <button className="btn-delete" onClick={() => onDelete(row.id, row.service)}><FontAwesomeIcon icon="fa-solid fa-trash" /></button>
        </div>
      </div>
    )
  })

  // console.log(addServiceForm);
  // console.log(searchForm);

  return (
    <div className="service-dashboard-page">
      <Modal
        isOpen={modalDeleteIsOpen || modalEditIsOpen || modalAddIsOpen}
        onRequestClose={closeModal}
        appElement={document.getElementById('root')}
        className="modal"
        shouldCloseOnOverlayClick={false}
      >
        {modalAddIsOpen && <ConfirmAddModal onClose={closeModal} msg={msg} onConfirmAdd={onConfirmAdd}/>}
        {modalDeleteIsOpen && <ConfirmDeleteModal onClose={closeModal} msg={msg} onConfirmDelete={onConfirmDelete}/>}
        {modalEditIsOpen && <ConfirmEditModal onClose={closeModal} msg={msg} onConfirmEdit={onConfirmEdit}/>}
      </Modal>
      <div className="add-service-part">
        <span className="title">Add new service</span>
        {!serviceGroups.length &&
        <div>You have to add service group at first!</div>
        }
        <form onSubmit={onAdd} className="add-form">
          <div className="name-price">
            <div className="input-group">
              <span>Name: </span>    
              <CssTextField
                required
                id="service"
                name="service"
                value={addServiceForm.service}
                onChange={handleChangeAdd}
                variant="outlined"
                size="small"
                // margin="normal"
                className="input-name"
              />
            </div>
            <div className="input-group">
              <span>Price: </span>    
              <CssTextField
                required
                id="price"
                name="price"
                type='number'
                value={addServiceForm.price}
                onChange={handleChangeAdd}
                variant="outlined"
                size="small"
                // margin="normal"
                InputProps={{
                  startAdornment: (<InputAdornment position="start">$</InputAdornment>)
                }}
                className="input-price"
              />
            </div>
          </div>
          <div className="group-duration">
            <div className="input-group">
              <span>Group: </span>    
              <CssSelect
                required
                id="groupId"
                name="groupId"
                value={addServiceForm.groupId}
                onChange={handleChangeAdd}
                variant="outlined"
                size="small"
                className="select-group"
                MenuProps={MenuProps}
              >
                {groupsArr}
              </CssSelect>
            </div>
            <div className="input-group">
              <span>Duration: </span>    
              <CssSelect
                required
                id="duration"
                name="duration"
                value={addServiceForm.duration}
                onChange={handleChangeAdd}
                variant="outlined"
                size="small"
                className="select-duration"
                MenuProps={MenuProps}
              >
                {durationArray.map(row => {
                  return (
                    <MenuItem key={row.val} value={row.val} >{row.name}</MenuItem>
                  )})
                }
              </CssSelect>
            </div>
          </div>
          <div className="description">
            <span>Description: </span>
            <div className="input-group">
              <CssTextField
                // required
                id="description"
                name="description"
                multiline
                maxRows={10}
                minRows={3}
                value={addServiceForm.description}
                onChange={handleChangeAdd}
                variant="outlined"
                size="small"
                // margin="normal"
                inputProps={{min: 1, style: { textAlign: 'left' }}}
                className="input-description"
              />
            </div>
          </div>
          <div className="error-msg">{errorMsgAdd}</div>
          <div className="buttons">
            <button type="button" className="btn-cancel" onClick={() => onCancelAdd()}>Cancel</button>
            <button type="submit" className="btn-save">Save</button>
          </div>
        </form>
      </div>
      <div className="search-service-part">
        <span className="title-2">Search service: </span>
        <CssSelect
          required
          id="service"
          name="service"
          value={searchForm.service}
          onChange={handleChangeSearch}
          variant="outlined"
          size="small"
          className="search-service"
          MenuProps={MenuProps}
        >
          <MenuItem value="">
            <em> --- </em>
          </MenuItem>
          {services.map(row => {
            return (
              <MenuItem key={row.id} value={row.id} >{row.service}</MenuItem>
            )})
          }
        </CssSelect>
      </div>
      <div>
        {searchForm.service && 
          <div className="show-service-part">
            {serviceDetails}
          </div>
        }
        {editServiceForm.id &&
          <div className="edit-service-part">
            <span className="title">Edit service</span>
            <form onSubmit={onEdit} className="add-form">
              <div className="name-price">
                <div className="input-group">
                  <span className="name-field">Name: </span>    
                  <CssTextField
                    required
                    id="service"
                    name="service"
                    value={editServiceForm.service}
                    onChange={handleChangeEdit}
                    variant="outlined"
                    size="small"
                    className="input-name"
                  />
                </div>
                <div className="input-group">
                  <span className="name-field">Price: </span>    
                  <CssTextField
                    required
                    id="price"
                    name="price"
                    type='number'
                    value={editServiceForm.price}
                    onChange={handleChangeEdit}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: (<InputAdornment position="start">$</InputAdornment>)
                    }}
                    className="input-price"
                  />
                </div>
              </div>
              <div className="group-duration">
                <div className="input-group">
                  <span className="name-field">Group: </span>    
                  <CssSelect
                    required
                    id="groupId"
                    name="groupId"
                    value={editServiceForm.groupId}
                    onChange={handleChangeEdit}
                    variant="outlined"
                    size="small"
                    className="select-group"
                    MenuProps={MenuProps}
                  >
                    {groupsArr}
                  </CssSelect>
                </div>
                <div className="input-group">
                  <span className="name-field">Duration: </span>    
                  <CssSelect
                    required
                    id="duration"
                    name="duration"
                    value={editServiceForm.duration}
                    onChange={handleChangeEdit}
                    variant="outlined"
                    size="small"
                    className="select-duration"
                    MenuProps={MenuProps}
                  >
                    {durationArray.map(row => {
                      return (
                        <MenuItem key={row.val} value={row.val} >{row.name}</MenuItem>
                      )})
                    }
                  </CssSelect>
                </div>
              </div>
              <div className="description">
                <span className="name-field">Description: </span>
                <div className="input-group">
                  <CssTextField
                    id="description"
                    name="description"
                    multiline
                    maxRows={10}
                    minRows={3}
                    value={editServiceForm.description}
                    onChange={handleChangeEdit}
                    variant="outlined"
                    size="small"
                    inputProps={{min: 1, style: { textAlign: 'left' }}}
                    className="input-description"
                  />
                </div>
              </div>
              <div className="error-msg">{errorMsgEdit}</div>
              <div className="buttons">
                <button type="button" className="btn-cancel" onClick={() => onCancelEdit()}>Cancel</button>
                <button type="submit" className="btn-save">Save</button>
              </div>
            </form>
          </div>
        }
      </div>
    </div>
  )
}

export default ServiceDashboard;