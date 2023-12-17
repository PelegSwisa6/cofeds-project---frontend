import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getAllSuppliers, getInventoryByDate } from "../api/api";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Dialog,
  TextField,
  Autocomplete,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function OutgoingStock() {
  const [openDialog, setOpenDialog] = useState(false);
  const [supplierNames, setSupplierNames] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [productList, setProductsList] = useState([]);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const handleSupplierChange = (suppId) => {
    setSelectedSupplier(suppId);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  useEffect(() => {
    async function fetchData() {
      const supplierData = await getAllSuppliers();
      setAllSuppliers(supplierData);
      const names = supplierData.map((supplier) => supplier.name);
      setSupplierNames(names);
    }

    fetchData();
  }, []);

  async function Search() {
    try {
      const formattedToDate = moment(toDate.$d).format("MM-DD-YYYY");
      const formattedFromDate = moment(fromDate.$d).format("MM-DD-YYYY");
      const data = {
        supplier_id: selectedSupplier,
        start_date: formattedFromDate,
        end_date: formattedToDate,
      };
      const config = {
        params: {
          start_date: data.start_date,
          end_date: data.end_date,
          supplier_id: data.supplier_id.id,
        },
      };

      const response = getInventoryByDate(config);
      const productsPromise = response;
      productsPromise
        .then((products) => {
          setProductsList(products);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 2,
        }}
      >
        <Button variant="contained" onClick={handleOpenDialog}>
          מלאי יוצא לפי תאריך
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <IconButton sx={{ marginLeft: "auto" }} onClick={handleCloseDialog}>
          <CloseIcon />
        </IconButton>
        <Typography
          variant="caption"
          display="block"
          align="center"
          fontSize={20}
          gutterBottom
        >
          ניהול מלאי יוצא
        </Typography>

        <Box sx={{ p: 2 }}>
          <Autocomplete
            options={allSuppliers}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="שם ספק"
                variant="outlined"
                fullWidth
                dir="rtl"
              />
            )}
            onChange={(event, newValue) => {
              setSelectedSupplier(newValue);
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="עד תאריך"
              value={toDate}
              onChange={handleToDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="מתאריך"
              value={fromDate}
              onChange={handleFromDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Box sx={{ display: "flex", justifyContent: "flex-start", pt: 2 }}>
            <Button variant="contained" dir="rtl" onClick={Search}>
              חיפוש
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pt: 2,
            }}
          >
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow key={productList.id}>
                    <TableCell align="right">כמות</TableCell>
                    <TableCell align="right">שם פריט</TableCell>
                    <TableCell align="right">קוד פריט</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productList.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell align="right">{product.quantity}</TableCell>
                      <TableCell align="right">
                        {product.product_name}
                      </TableCell>
                      <TableCell align="right">{product.product}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

export default OutgoingStock;
