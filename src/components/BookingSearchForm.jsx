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
import { styled } from '@mui/material/styles';

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

const CssDesktopDatePicker = styled(DesktopDatePicker)({
  '& label.Mui-focused': {
    color: 'Indigo',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'black',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'LightGray',
    },
    '&:hover fieldset': {
      borderColor: 'Indigo',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'MediumPurple',
    },
  },
});

const CssSelect = styled(Select)({
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "LightGray"
    },
    "&:hover fieldset": {
      borderColor: "Indigo"
    },
    "&.Mui-focused fieldset": {
      borderColor: "MediumPurple"
    },
  }
});

const BookingSearchForm = ({formReqBook, selectedDay, handleChangeService, handleChangeStylists, handleChangeDate, handleAddToForm, handleDelete, handleSearchSubmit, handleCloseDayPicker, qualifiedStylists}) => {

  const { stylists, serviceGroups, services } = useContext(GeneralContext);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let tomorrow =  new Date();
  tomorrow.setDate(today.getDate() + 1);

  //✅✅✅ showing select service field, with group name and services related to that!
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

  const formReqBookArray = formReqBook.map((row, index) => {
    const stylistCss = index === 0 ? "search-form-stylist-first" : "search-form-stylist";
  
    return (
      <div className="search-form-row" key={index}>
        {/* <FormControl sx={{ m:1, minWidth: 280 }} className="search-form-service"> */}
        <FormControl className="search-form-service">
          <InputLabel htmlFor="service-select" className="label">Select Service</InputLabel>
          <CssSelect
            id="service-select"
            name="service"
            onChange={e => handleChangeService(e, index)}
            value={formReqBook[index].service} 
            label="service-select"
            MenuProps={MenuProps}
            required
            className="service-select"
          >
            {serviceSelectArray}
          </CssSelect>
        </FormControl>

        <div className="stylist-delete">
          <FormControl className={stylistCss}>
            <InputLabel htmlFor="stylists-select" shrink={true} className="label">Select Stylist</InputLabel>
            <CssSelect
              id="stylists-select"
              multiple
              name="stylists"
              displayEmpty
              value={formReqBook[index].stylists}
              onChange={e => handleChangeStylists(e, index)}
              label="stylists-select"
              notched={true}
              renderValue={(selected) => {
                if (formReqBook[index].stylists.length === 0) return `any stylist`;
                if (formReqBook[index].stylists.length === 1) return formReqBook[index].stylists[0].name;
                return `${formReqBook[index].stylists.length} stylists selected`
              }}
              MenuProps={MenuProps}
            >
              {((qualifiedStylists[index].length && qualifiedStylists[index]) || stylists).map(sty => {
              return (
                <MenuItem key={sty.id} value={sty}>
                  <Checkbox checked={formReqBook[index].stylists.map(stylist => stylist.id).indexOf(sty.id) > -1} />
                  <ListItemText primary={`${sty.name} (${sty.level})`} />
                </MenuItem>
              )
              })}
            </CssSelect>
          </FormControl>
          {(index !== 0 &&
            <div className="search-form-delete-row">
              <button className="btn-delete" type="button" onClick={() => handleDelete(index)}><FontAwesomeIcon icon="fa-solid fa-square-minus" /></button>
            </div>)}
        </div>
      </div>
    )
  })

  // console.log('🚨 formReqBook \n',formReqBook);
  // console.log('🚨🚨🚨 qualifiedStylists \n',qualifiedStylists);

  return (
    <div className="search-form-main">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <div className="service-stylist">
          {formReqBookArray}
        </div>
        <div className="search-form-date">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CssDesktopDatePicker
                className="date-picker"
                name="date"
                label="Pick a Date"
                value={selectedDay}
                minDate={tomorrow}
                onClose={handleCloseDayPicker}
                onChange={handleChangeDate}
                renderInput={(params) => <TextField {...params} />}
              />
          </LocalizationProvider>
          <button className="btn-search">Search</button>
        </div>
      </form>
      {formReqBook.length < 3 &&
        (<div className="add-service-box">
          <button onClick={() => handleAddToForm()} className="btn-add-service-to-form">+ Add Service</button>
        </div>)
      }
    </div>
  )
}

export default BookingSearchForm;  