import { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import Modal from 'react-modal';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import { cyan } from '@mui/material/colors';

import GeneralContext from "../../contexts/GeneralContext";
import ConfirmAddModal from "./ConfirmAddModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ConfirmEditModal from "./ConfirmEditModal";
import './EmployeeDashboard.scss';

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

const EmployeeDashboard = ({setStylists}) => {

  const { serviceGroups, stylists } = useContext(GeneralContext);

  const [levels, setLevels] = useState([])
  const [addEmployeeForm, setAddEmployeeForm] = useState({name:"", image:"", bio:"", level:""});
  const [addSkillsForm, setAddSkillsForm] = useState([]);
  const [searchForm, setSearchForm] = useState({stylist: ""});
  const [editEmployeeForm, setEditEmployeeForm] = useState({id:"", name:"", image:"", bio:"", level:""});
  const [editSkillsForm, setEditSkillsForm] = useState([]);
  const [deletedEmployee, setDeletedEmployee] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errorMsgEdit, setErrorMsgEdit] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingInEdit, setLoadingInEdit] = useState(false);
  const inputRef = useRef(null);

  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios.get('http://localhost:7100/api/spec/levels')
    .then(res => {
      setLevels(res.data.levels);
    })
  }, []);

  useEffect(() => {
    const groups = serviceGroups.map(row => {
      return ({id:row.id, group:row.group, select: false})
    })
    setAddSkillsForm([...groups])
  }, [serviceGroups]);

  const onReqEdit = (id, name, image, bio, level, skills) => {
    setEditEmployeeForm({id, name, image, bio, level});
    const mySkills = serviceGroups.map(row => {
      return (
        {id:row.id, group:row.group, select: (skills.indexOf(row.id) !== -1)}
      )
    })
    setEditSkillsForm([...mySkills]);
    setSearchForm({stylist: ""});
  }

  const onAdd = (event) => {
    event.preventDefault();
    if (addEmployeeForm.image === "") {
      setErrorMsg("Upload Image!");
    } else {
      setMsg(`Are you ready to add new stylist?`);
      setModalAddIsOpen(true);
    }
  }

  const onEdit = (event) => {
    event.preventDefault();
    if (editEmployeeForm.image === "") {
      setErrorMsgEdit("Upload Image!");
    } else {
      setMsg(`Are you sure you want to save changes?`);
      setModalEditIsOpen(true);
    }
  }

  const onDelete = (rId, rName) => {
    setDeletedEmployee(rId);
    setMsg(`Are you sure you want to delete ${rName}?`);
    setModalDeleteIsOpen(true);
    setErrorMsgEdit("");
  }

  const onCancelAdd = () => {
    setAddEmployeeForm({name:"", image:"", bio:"", level:""});
    setAddSkillsForm(addSkillsForm.map(row => {return ({...row, select: false})}));
    setErrorMsg("");
  }

  const onCancelEdit = () => {
    setSearchForm({stylist: editEmployeeForm.id});
    setEditEmployeeForm({id:"", name:"", image:"", bio:"", level:""});
    setEditSkillsForm([]);
    setErrorMsgEdit("");
  }

  const handleChangeAdd = (event) => {
    const {name, value} = event.target;
    setAddEmployeeForm({...addEmployeeForm, [name]: value});
    setErrorMsg("");
  };

  const handleChangeAddSkill = (event) => {
    const id = Number(event.target.value);
    const checked = event.target.checked;
    setAddSkillsForm(addSkillsForm.map(row => {
      if (row.id === id ) return {...row, select: checked}
      else return {...row}
    }));
  };

  const handleChangeEdit = (event) => {
    const {name, value} = event.target;
    setEditEmployeeForm({...editEmployeeForm, [name]: value});
    setErrorMsgEdit("");
  }

  const handleChangeEditSkill = (event) => {
    const id = Number(event.target.value);
    const checked = event.target.checked;
    setEditSkillsForm(editSkillsForm.map(row => {
      if (row.id === id ) return {...row, select: checked}
      else return {...row}
    }));
  }

  const handleChangeSearch = (event) => {
    const {name, value} = event.target;
    setEditEmployeeForm({id:"", name:"", image:"", bio:"", level:""});
    setEditSkillsForm([]);
    setSearchForm({[name]: value});
  };

  const onConfirmAdd = () => {
    axios.post(`http://localhost:7100/api/stylists`, {stylist:{...addEmployeeForm}, skills:[...addSkillsForm]})
    .then(res => {
      // console.log(res.data);
      setStylists(res.data.stylists);
    })
    setAddEmployeeForm({name:"", image:"", bio:"", level:""})
    setAddSkillsForm(addSkillsForm.map(row => {return({...row, select: false})}));
  }

  const onConfirmEdit = () => {
    axios.put(`http://localhost:7100/api/stylists`, {stylist:{...editEmployeeForm}, skills:[...editSkillsForm]})
    .then(res => {
      setStylists(res.data.stylists);
    })
    setEditEmployeeForm({id:"", name:"", image:"", bio:"", level:""});
    setEditSkillsForm([]);
  }

  const onConfirmDelete = () => {
    axios.delete(`http://localhost:7100/api/stylists/${deletedEmployee}`)
    .then(res => {
      const newStylists = stylists.filter(row => row.id !== res.data.deleted.id);
      setStylists(newStylists);
    })
    setSearchForm({stylist: ""});
    setEditEmployeeForm({id:"", name:"", image:"", bio:"", level:""});
    setEditSkillsForm([]);
    setDeletedEmployee("");
  }

  const uploadImage = async e => {
    const name = e.target.name;
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0])
    data.append('upload_preset', 'demoSalon')

    setLoading(true);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'post',
      body: data
    })

    const file = await res.json()
    if (file.secure_url) {
      setAddEmployeeForm({ ...addEmployeeForm, [name]: `${file.secure_url}` })
    } else {
      setAddEmployeeForm({ ...addEmployeeForm})
    }
    setLoading(false);
    setErrorMsg("");
  }

  const deleteImage = (e) => {
    const name = e.currentTarget.id;
    setAddEmployeeForm({ ...addEmployeeForm, [name]: "" });
    inputRef.current.value = null;
  }

  const changeImage = async e => {
    const name = e.target.name;
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0])
    data.append('upload_preset', 'demoSalon')

    setLoadingInEdit(true);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'post',
      body: data
    })

    const file = await res.json()
    if (file.secure_url) {
      setEditEmployeeForm({ ...editEmployeeForm, [name]: `${file.secure_url}` })
    } else {
      setEditEmployeeForm({ ...editEmployeeForm})
    }
    setLoadingInEdit(false);
    setErrorMsgEdit("");
  }

  const closeModal = () => {
    setModalDeleteIsOpen(false);
    setModalEditIsOpen(false);
    setModalAddIsOpen(false);
  }

  const skillsArray = addSkillsForm.map(row => {
    return (
      <FormControlLabel key={row.id}
      control={
        <Checkbox 
          onChange={handleChangeAddSkill} 
          name={row.group} 
          checked={row.select} 
          value={row.id}
          sx={{
            color: cyan[800],
            '&.Mui-checked': {
              color: cyan[600],
            },
          }}
        />
      }
      label={row.group}
      />
    )
  });

  const stylistDetails = stylists.filter(stylist => stylist.id === searchForm.stylist)
  .map(row => {
    const levelId = levels.filter(levelX => levelX.name === row.level)[0].id;
    return (
      <div key={row.id} className="show-employee">
        <div className="name-level text-name-level">
          <div className="input-group">
            <span className="name-field">Name: </span>    
            <div className="input-name">{row.name}</div>
          </div>
          <div className="input-group">
            <span className="level-field">Level: </span>    
            <div className="select-level">{row.level}</div>   
          </div>
        </div>
        <div className='show-img'>
          <span className="image-field">Image: </span> 
          <img
            src={row.image}
            alt="image1"
            width="80"
            height="80"
          />
        </div>
        <div className="bio text-bio">
          <span className="bio-field">Bio: </span>
          <div className="input-bio">{row.bio}</div>   
        </div>
        <div className="select-skills">
          <span className="title-2">Skills: </span>
          {row.skills.map((id, index) => {
            const group = serviceGroups.filter(row => row.id === id)[0];
            return group ? 
              <div key={id} className="skills-list">{group.group}</div>
            :
              <div key={index}>---</div>
          })} 
        </div>
        <div>
          <button className="btn-edit" onClick={() => onReqEdit(row.id, row.name, row.image, row.bio, levelId, row.skills)}><FontAwesomeIcon icon="fa-solid fa-pencil" /></button>
          <button className="btn-delete" onClick={() => onDelete(row.id, row.name)}><FontAwesomeIcon icon="fa-solid fa-trash" /></button>
        </div>
      </div>
    )
  });

  // console.log('+E\n',addEmployeeForm);
  // console.log('+S\n',addSkillsForm);
  // console.log('!E\n',editEmployeeForm);
  // console.log('!S\n',editSkillsForm);
  // console.log('Find\n',searchForm);

  return (
    <div className="employee-dashboard-page">
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
      <div className="add-employee-part">
        <span className="title">Add new stylist:</span>
        {!levels.length &&
        <div>You have to define levels first!</div>
        }
        <form onSubmit={onAdd} className="add-form">
          <div className="name-level">
            <div className="input-group">
              <span>Name: </span>    
              <CssTextField
                required
                id="name"
                name="name"
                value={addEmployeeForm.name}
                onChange={handleChangeAdd}
                variant="outlined"
                size="small"
                className="input-name"
              />
            </div>
            <div className="input-level">
              <span>Level: </span>    
              <CssSelect
                required
                id="level"
                name="level"
                value={addEmployeeForm.level}
                onChange={handleChangeAdd}
                variant="outlined"
                size="small"
                className="select-level"
                MenuProps={MenuProps}
              >
                {levels.map(row => {
                  return (
                    <MenuItem key={row.id} value={row.id} >{row.name}</MenuItem>
                  )})
                }
              </CssSelect>
            </div>
          </div>
          <div className='image-select'>
            <label htmlFor="file-upload-image" className="custom-file-upload">
              Choose Image
            </label>
            <input
              id="file-upload-image" 
              type="file"
              name="image"
              accept={'image/*'} 
              onChange={uploadImage}
              ref={inputRef}
            />
            <div className='loading-image-sign'>
              {loading && <CircularProgress style={{'color': 'LightSeaGreen'}}/>}
            </div>
            {addEmployeeForm.image &&
              <div className='img-preview-part'>
                <div className='img-preview'>
                  <img
                    src={addEmployeeForm.image}
                    alt="image1"
                    width="80"
                    height="80"
                  />
                </div>
                <div id='image' onClick={deleteImage}>
                  <FontAwesomeIcon icon="fa-solid fa-trash-can" className='erase-image'/>
                </div>
              </div>
            }
            {errorMsg && 
              <FormHelperText style={{'color': 'red'}}>{errorMsg}</FormHelperText>
            }
          </div> 
          <div className="bio">
            <span>Bio: </span>
            <div className="input-group">
              <CssTextField
                // required
                id="bio"
                name="bio"
                multiline
                maxRows={10}
                minRows={3}
                value={addEmployeeForm.bio}
                onChange={handleChangeAdd}
                variant="outlined"
                size="small"
                inputProps={{min: 1, style: { textAlign: 'left' }}}
                className="input-bio"
              />
            </div>
          </div>
          {serviceGroups.length && 
            <div className="select-skills">
              <div className="title-2">Select skills:</div>
              <div className="skills-form">
                {skillsArray}
              </div>
            </div>
          }
          <div className="buttons">
            <button type="button" className="btn-cancel" onClick={() => onCancelAdd()}>Cancel</button>
            <button type="submit" className="btn-save">Save</button>
          </div>
        </form>
      </div>
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
      <div>
        {searchForm.stylist && 
          <div className="show-employee-part">
            {stylistDetails}
          </div>
        }
        {editEmployeeForm.id && editSkillsForm.length &&
          <div className="edit-employee-part">
            <span className="title">Edit stylist info:</span>
            <form onSubmit={onEdit} className="edit-form">
              <div className="name-level">
                <div className="input-group">
                  <span>Name: </span>    
                  <CssTextField
                    required
                    id="name"
                    name="name"
                    value={editEmployeeForm.name}
                    onChange={handleChangeEdit}
                    variant="outlined"
                    size="small"
                    className="input-name"
                  />
                </div>
                <div className="input-level">
                  <span>Level: </span>    
                  <CssSelect
                    required
                    id="level"
                    name="level"
                    value={editEmployeeForm.level}
                    onChange={handleChangeEdit}
                    variant="outlined"
                    size="small"
                    className="select-level"
                    MenuProps={MenuProps}
                  >
                    {levels.map(row => {
                      return (
                        <MenuItem key={row.id} value={row.id} >{row.name}</MenuItem>
                      )})
                    }
                  </CssSelect>
                </div>
              </div>
              <div className='image-select'>
                <label htmlFor="file-change-image" className="custom-file-upload">
                  Change Image
                </label>
                <input 
                  id="file-change-image" 
                  type="file"
                  name="image"
                  accept={'image/*'} 
                  onChange={changeImage}
                />
                <div className='loading-image-sign'>
                  {loadingInEdit && <CircularProgress style={{'color': 'LightSeaGreen'}}/>}
                </div>
                {editEmployeeForm.image &&
                  <div className='img-preview-part'>
                    <div className='img-preview'>
                      <img
                        src={editEmployeeForm.image}
                        alt="image1"
                        width="80"
                        height="80"
                      />
                    </div>
                  </div>
                }
                {errorMsgEdit && 
                  <FormHelperText style={{'color': 'red'}}>{errorMsg}</FormHelperText>
                }
              </div> 
              <div className="bio">
                <span>Bio: </span>
                <div className="input-group">
                  <CssTextField
                    id="bio"
                    name="bio"
                    multiline
                    maxRows={10}
                    minRows={3}
                    value={editEmployeeForm.bio}
                    onChange={handleChangeEdit}
                    variant="outlined"
                    size="small"
                    inputProps={{min: 1, style: { textAlign: 'left' }}}
                    className="input-bio"
                  />
                </div>
              </div>
              <div className="select-skills">
                <div className="title-2">Edit skills:</div>
                <div className="skills-form">
                  {
                    editSkillsForm.map(row => {
                      return (
                        <FormControlLabel key={row.id}
                        control={
                          <Checkbox 
                            onChange={handleChangeEditSkill} 
                            name={row.group} 
                            checked={row.select} 
                            value={row.id}
                            sx={{
                              color: cyan[800],
                              '&.Mui-checked': {
                                color: cyan[600],
                              },
                            }}
                          />
                        }
                        label={row.group}
                        />
                      )
                    })
                  }
                </div>
              </div>
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

export default EmployeeDashboard;