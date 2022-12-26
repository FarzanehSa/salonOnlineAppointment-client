import { useContext, useState } from "react";
import axios from "axios";
import Modal from 'react-modal';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

import GeneralContext from "../../contexts/GeneralContext";
import ConfirmAddModal from "./ConfirmAddModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ConfirmEditModal from "./ConfirmEditModal";
import './ServiceGroupDashboard.scss';

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

const ServiceGroupDashboard = ({setServiceGroups}) => {

  const { serviceGroups } = useContext(GeneralContext);

  const [addGroupForm, setAddGroupForm] = useState({serviceGroup: ""});
  const [editGroupForm, setEditGroupForm] = useState({id:"", serviceGroup: ""});
  const [deletedGroup, setDeletedGroup] = useState("");

  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [msg, setMsg] = useState("");

  const [showEdit, setShowEdit] = useState(false);

  const onReqEdit = (rId, rName) => {
    setEditGroupForm({id: rId, serviceGroup: rName });
    setShowEdit(true);
  }

  const onAdd = (event) => {
    event.preventDefault();
    setMsg(`Are you ready to add new service group?`);
    setModalAddIsOpen(true);
  }
  
  const onEdit = (event) => {
    event.preventDefault();
    setMsg(`Are you sure you want to save changes?`);
    setModalEditIsOpen(true);
  }

  const onDelete = (rId, rName) => {
    setDeletedGroup(rId);
    setMsg(`Are you sure you want to delete the ${rName} service group?`);
    setModalDeleteIsOpen(true);
  }

  const onCancelAdd = () => {
    setAddGroupForm({serviceGroup: "" });
  }

  const onCancelEdit = () => {
    setEditGroupForm({id: "", serviceGroup: "" });
    setShowEdit(false);
  }

  const handleChangeAdd = (event) => {
    const value = event.target.value;
    setAddGroupForm({serviceGroup: value})
  }

  const handleChangeEdit = (event) => {
    const value = event.target.value;
    setEditGroupForm({...editGroupForm, serviceGroup: value})
  }

  const onConfirmAdd = () => {
    axios.post(`${url}/api/service-groups`, {group: addGroupForm})
    .then(res => {
      setServiceGroups(res.data.updateGroups);
    })
    setAddGroupForm({serviceGroup: ""});
  }

  const onConfirmEdit = () => {
    axios.put(`${url}/api/service-groups`, {group: editGroupForm})
    .then(res => {
      const newGroup = serviceGroups.map(row => {
        return (row.id === res.data.updated.id ? {...row, group: res.data.updated.name} : row)
      });
      setServiceGroups(newGroup)
    })
    setEditGroupForm({id: "", serviceGroup: ""});
    // setShowStatus({add: false, edit: false});
  }

  const onConfirmDelete = () => {
    axios.delete(`${url}/api/service-groups/${deletedGroup}`)
    .then(res => {
      const newGroup = serviceGroups.filter(row => row.id !== res.data.deleted.id);
      setServiceGroups(newGroup);
    })
    setDeletedGroup("");
  }

  const closeModal = () => {
    setModalDeleteIsOpen(false);
    setModalEditIsOpen(false);
    setModalAddIsOpen(false);
  }

  const groupNameArr = serviceGroups.map(row => {
    const cssServiceGroup = showEdit && editGroupForm.id === row.id ? "service-group service-group-select" : "service-group";
    const cssEditGroupMenu = showEdit && editGroupForm.id === row.id ? "edit-group-menu edit-group-menu-select" : "edit-group-menu";
    return (
      <div key={row.id}>
        <div className={cssServiceGroup}>
          <div className="group-name">
            <span>{row.group}</span>
          </div>
          <div className="buttons">
            <button className="btn-edit" onClick={() => onReqEdit(row.id, row.group)}><FontAwesomeIcon icon="fa-solid fa-pencil" /></button>
            <button className="btn-delete" onClick={() => onDelete(row.id, row.group)}><FontAwesomeIcon icon="fa-solid fa-trash" /></button>
          </div>
        </div>

        <div className={cssEditGroupMenu}>
          <form onSubmit={onEdit} className='edit-form'>      
            <CssTextField
              required
              id="serviceGroup"
              name="serviceGroup"
              value={editGroupForm.serviceGroup}
              onChange={handleChangeEdit}
              variant="outlined"
              size="small"
              margin="normal"
              className="input-text"
            />
            <div className="buttons">
              <button type="button" className="btn-edit-cancel" onClick={() => onCancelEdit()}><FontAwesomeIcon icon="fa-solid fa-ban" /></button>
              <button type="submit" className="btn-edit-save"><FontAwesomeIcon icon="fa-solid fa-floppy-disk" /></button>
            </div>
          </form>
        </div>

      </div>
    )
  })

  return (
    <div className="service-group-dashboard-page">
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
      <div className="add-group-part">
        <span className="title">Add new service group</span>
        <form onSubmit={onAdd} className="add-form"> 
          <div className="input-group">
            <span>Name: </span>    
            <CssTextField
              required
              id="serviceGroup"
              name="serviceGroup"
              value={addGroupForm.serviceGroup}
              onChange={handleChangeAdd}
              variant="outlined"
              size="small"
              margin="normal"
              className="input-text"
            />
          </div>
          <div className="buttons">
            <button type="button" className="btn-cancel" onClick={() => onCancelAdd()}>Cancel</button>
            <button type="submit" className="btn-save">Save</button>
          </div>
        </form>
      </div>
      <div className="title-2">Service Groups</div>
      {groupNameArr}      
    </div>
  )
}

export default ServiceGroupDashboard;