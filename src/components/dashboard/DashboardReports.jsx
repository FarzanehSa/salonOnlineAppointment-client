import { useContext, useState } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import GeneralContext from "../../contexts/GeneralContext";
import './DashboardReports.scss';

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

const CssDesktopDatePicker = styled(DesktopDatePicker)({
  '& label.Mui-focused': {
    color: "LightSeaGreen",
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: "LightGray",
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: "LightGray",
    },
    '&:hover fieldset': {
      borderColor: "MediumPurple",
    },
    '&.Mui-focused fieldset': {
      borderColor: "LightSeaGreen",
    },
  },
});

const DashboardReports = () => {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let tomorrow =  new Date();
  tomorrow.setDate(today.getDate() + 1);

  const { services, stylists, url } = useContext(GeneralContext);
  const [searchForm, setSearchForm] = useState({stylist: "all", service: "all", date: null, dateAfter: today});
  const [result, setResult] = useState([]);
  const [sParams, setSParams] = useState({});

  const columns = [
    { id: 'stylist', label: 'Stylist', minWidth: 100, align: 'left' },
    { id: 'start', label: 'Start Time', minWidth: 100, align: 'center' },
    { id: 'end', label: 'End Time', minWidth: 100, align: 'center' },
    { id: 'service', label: 'Service', minWidth: 150, align: 'center' },
    { id: 'customerN', label: 'Customer ', minWidth: 150, align: 'center' },
  ];

  const handleChangeSearch = (event) => {
    const {name, value} = event.target;
    setSearchForm({...searchForm, [name]: value});
  };

  const handleChangeDate = (newDate) => {
    let rDate = new Date(newDate);
    setSearchForm({...searchForm, date: rDate});
  }

  const handleSearch = (event) => {
    event.preventDefault();
    setSParams({...searchForm});
    axios.get(`${url}/api/report`, {
      params: {...searchForm}
    })
    .then(res => {
      const newResult = res.data.result.map(row => {return ({...row, date: row.date.slice(0, 10)})})
      setResult(newResult);
      // setSearchForm({stylist: "all", service: "all", date: null, dateAfter: today});
    })
  }

  const onRest = () => {
    setResult([]);
    setSParams({});
    setSearchForm({stylist: "all", service: "all", date: null, dateAfter: today});
  }

  const dateKeys = result.map(row => row.date)
  .filter((value, index, self) => self.indexOf(value) === index);

  let appointmentsArr = [];
  for (const date of dateKeys) {
    appointmentsArr.push(
      <TableRow key={date} className="date-row">
        <TableCell colSpan={5} align='center' className="date-cell">Date: &nbsp; &nbsp; {date}</TableCell>
      </TableRow>)
    const group = result.filter(data => data.date === date)
    .map((row) => {
      return (
        <TableRow hover tabIndex={-1} key={row.id}>
          <TableCell align='left'>{row.stylist}</TableCell>
          <TableCell align='center'>{row.start}</TableCell>
          <TableCell align='center'>{row.end}</TableCell>
          <TableCell align='center'>{row.service}</TableCell>
          <TableCell align='center'>
            <div>
              <div>{row.firstname} {row.lastname}</div>
              <div><FontAwesomeIcon icon="fa-solid fa-phone" /> {row.tel}</div>
            </div>
          </TableCell>
        </TableRow>
      );
    })
    appointmentsArr.push(group);
  }

  return (
    <div className="dashboard-report-page">
      <div className="search-employee-part">
        <span className="title">Report parameters:</span>
        <form onSubmit={handleSearch} className="search-form">
          <div className="input-group">
            <span className="title-2">Select stylist: </span>
            <CssSelect
              required
              id="stylist"
              name="stylist"
              value={searchForm.stylist}
              onChange={handleChangeSearch}
              variant="outlined"
              // size="small"
              className="search-employee"
              MenuProps={MenuProps}
              defaultValue="all"
            >
              <MenuItem value="all" style={{color:'blue'}}>* All Stylists *</MenuItem>
              {stylists.map(row => {
                return (
                  <MenuItem key={row.id} value={row.id} >{row.name}</MenuItem>
                )})
              }
            </CssSelect>
          </div>
          <div className="input-group">
            <span className="title-2">Select service: </span>
            <CssSelect
              required
              id="service"
              name="service"
              value={searchForm.service}
              onChange={handleChangeSearch}
              variant="outlined"
              // size="small"
              className="search-service"
              MenuProps={MenuProps}
              defaultValue="all"
            >
              <MenuItem value="all" style={{color:'blue'}}>* All Services *</MenuItem>
              {services.map(row => {
                return (
                  <MenuItem key={row.id} value={row.id} >{row.service}</MenuItem>
                )})
              }
            </CssSelect>
          </div>
          <div className="input-group">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <span className="title-2">Select date: </span>
              <CssDesktopDatePicker
                className="date-picker"
                name="date"
                label={searchForm.date && "Only"}
                value={searchForm.date}
                minDate={today}
                // onClose={handleCloseDayPicker}
                onChange={handleChangeDate}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        placeholder: "any date",
                        readOnly: true
                      }}
                    />
                  );
                }}
              />
            </LocalizationProvider>
          </div>
          <div className="buttons">
            <button type="button" className="btn-reset" onClick={onRest}>Reset</button>
            <button type="submit" className="btn-search">Search</button>
          </div>
        </form>
      </div>
      <div className="result-part">
        {sParams.stylist && 
          <div>
            <div className="report-params-part">
              {sParams.date ?
                <div>Appointments on&nbsp;  
                  <span className="report-param">{sParams.date.toDateString()}</span>
                  </div>
                : 
                <div>Appointment after&nbsp; 
                  <span className="report-param">{sParams.dateAfter.toDateString()}</span>
                </div>
              }
              {sParams.stylist === 'all' &&
                <div>&nbsp; , Stylist:&nbsp; 
                  <span className="report-param">{sParams.stylist}</span>
                </div>
              }
              {sParams.service === 'all' &&
                <div>&nbsp; , Service:&nbsp; 
                  <span className="report-param">{sParams.service}</span>
                </div>
              }
            </div>
            {result.length ? 
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointmentsArr}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper> 
              :
              <div className="noting-found">Nothing Found!</div>
            }
          </div>
        }
      </div>
    </div>
  )
}

export default DashboardReports;