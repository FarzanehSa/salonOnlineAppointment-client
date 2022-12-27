import { useContext, useEffect, useState } from "react";
import axios from "axios";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';

import GeneralContext from "../../contexts/GeneralContext";
import './DashboardCustomersReport.scss';

const DashboardCustomersReport = () => {

  const { url } = useContext(GeneralContext);
  const [result, setResult] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    { id: 'code', label: 'Code', minWidth: 100, align: 'center' },
    { id: 'name', label: 'Name', minWidth: 170, align: 'center' },
    { id: 'tel', label: 'Phone', minWidth: 100, align: 'center' },
    { id: 'email', label: 'e-mail', minWidth: 170, align: 'center' },
    { id: 'access', label: 'Admin Access', minWidth: 100, align: 'center' },
  ];

  useEffect(() => {
    axios.get(`${url}/api/reports/customers`)
    .then(res => {
      setResult(res.data.result);
    })
  }, []); // eslint-disable-line

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="customer-report-page">
      <div className="title">Customers List</div>
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
              {result
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell align="center">{row.id}</TableCell>
                      <TableCell align="center">{row.firstname} {row.lastname}</TableCell>
                      <TableCell align="center">{row.tel}</TableCell>
                      <TableCell align="center">{row.email}</TableCell>
                      <TableCell align="center">{row.access ? "No" : "Yes"}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={result.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  )
}

export default DashboardCustomersReport;