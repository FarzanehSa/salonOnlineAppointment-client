import { react, useContext, useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import GeneralContext from "../contexts/GeneralContext";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const BookingSearchForm = ({formData, handleChangeService, handleChangeStylists, handleChangeDate, handleAddToForm, handleDelete, handleSearchSubmit, handleCloseDayPicker, qualifiedStylists}) => {

  const { stylists, serviceGroups, services } = useContext(GeneralContext);

  const serviceSelectArray = serviceGroups.map(gRow => {
    const goodServices = services.filter(sRow => gRow.id === sRow.groupid);
    let result = [];
    for(let i = -1; i < goodServices.length; i++) {
      if (i === -1) {
        result.push(<ListSubheader>{gRow.group}</ListSubheader>);
      }
      else {
        result.push(<MenuItem value={goodServices[i]}>{goodServices[i].service}</MenuItem>);
      }
    }
    return result;
  });

  const formDateArray = formData.map((row, index) => {
    
    return (
      <div className="search-form-row" key={index}>
        <FormControl sx={{ m:1, minWidth: 300 }} className="search-form-service">
          <InputLabel htmlFor="service-select">Select Service</InputLabel>
          <Select 
            id="service-select"
            name="service"
            onChange={e => handleChangeService(e, index)}
            value={formData[index].service} 
            label="service-select"
            MenuProps={MenuProps}
            required
          >
            {serviceSelectArray}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, width: 300 }} className="search-form-stylist">
          <InputLabel htmlFor="stylists-select" shrink={true}>Select Stylist</InputLabel>
          <Select
            id="stylists-select"
            multiple
            name="stylists"
            displayEmpty
            value={formData[index].stylists}
            onChange={e => handleChangeStylists(e, index)}
            label="stylists-select"
            notched={true}
            renderValue={(selected) => {
              if (formData[index].stylists.length === 0) return `any stylist`;
              if (formData[index].stylists.length === 1) return formData[index].stylists[0].name;
              return `${formData[index].stylists.length} stylists selected`
            }}
            MenuProps={MenuProps}
          >
            {qualifiedStylists && (qualifiedStylists[index] || stylists).map(sty => {
              return (
              <MenuItem key={sty.id} value={sty}>
                <Checkbox checked={formData[index].stylists.map(stylist => stylist.id).indexOf(sty.id) > -1} />
                <ListItemText primary={`${sty.name} (${sty.level})`} />
              </MenuItem>
            )
            })}
          </Select>
        </FormControl>
        {(index === 0 &&
        <div className="search-form-date">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                name="date"
                label="Pick a Date"
                value={formData[0].date}
                minDate={new Date()}
                onClose={handleCloseDayPicker}
                onChange={handleChangeDate}
                renderInput={(params) => <TextField {...params} />}
              />
          </LocalizationProvider>
          <button className="btn-search">Search</button>
        </div>)}
        {(index !== 0 &&
        <div className="search-form-delete-row">
          <button className="btn-delete" type="button" onClick={() => handleDelete(index)}><FontAwesomeIcon icon="fa-solid fa-square-minus" /></button>
        </div>)}
      </div>
    )
  })

  // console.log('🚨 formData \n',formData);

  return (
    <div className="search-form">
      <form onSubmit={handleSearchSubmit}>
        {formDateArray}
      </form>
      {formData.length < 3 &&
        (<div className="add-service-box">
          <button onClick={() => handleAddToForm()} className="btn-add-service-to-form">+ Add Service</button>
        </div>)
      }
    </div>
  )
}

export default BookingSearchForm;  