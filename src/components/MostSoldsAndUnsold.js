import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Dialog,
  IconButton,
  TextField,
  Autocomplete,
  Typography,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { getAllProducts, getInventoryByDate } from "../api/api";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";
import moment from "moment";
import { Height } from "@mui/icons-material";

function MostSoldsAndUnsold() {
  const [openDialog, setOpenDialog] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [bestSellingProducts, SetBestSellingProducts] = useState([]);
  const [leastSellingProducts, SetLeastSellingProducts] = useState([]);
  const [selectedDays, setSelectedDays] = useState(1);

  useEffect(() => {
    Search();
  }, [selectedDays]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  useEffect(() => {
    async function fetchData() {
      const productsData = await getAllProducts();
      setAllProducts(productsData);
    }

    fetchData();
  }, []);

  const handleSnackbarClose = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  async function Search() {
    const days = selectedDays;
    const formattedToDate = moment().format("MM-DD-YYYY");
    const formattedFromDate = moment()
      .subtract(days, "days")
      .format("MM-DD-YYYY");
    const data = {
      supplier_id: 9999,
      start_date: formattedFromDate,
      end_date: formattedToDate,
    };
    const config = {
      params: {
        start_date: data.start_date,
        end_date: data.end_date,
        supplier_id: 9999,
      },
    };

    const response = getInventoryByDate(config);
    const productsPromise = response;
    productsPromise
      .then((products) => {
        setProductsList(products);
        const sortedProductsList = [...products].sort(
          (a, b) => b.quantity - a.quantity
        );
        SetBestSellingProducts(sortedProductsList.slice(0, 5));
        SetLeastSellingProducts(sortedProductsList.slice(-5).reverse());
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <Button variant="contained" onClick={handleOpenDialog}>
          המוצרים הכי נמכרים{" "}
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <IconButton sx={{ marginLeft: "auto" }} onClick={handleCloseDialog}>
          <CloseIcon />
        </IconButton>

        <Box display={"flex"} justifyContent={"space-between"} dir={"rtl"}>
          <Typography
            variant="caption"
            display="flex"
            align="center"
            fontSize={20}
            gutterBottom
            sx={{ paddingTop: 0, mr: 10 }}
          >
            בחר מספר ימים
          </Typography>
          <Autocomplete
            options={[
              { label: "1", value: 1 },
              { label: "7", value: 7 },
              { label: "14", value: 14 },
              { label: "21", value: 21 },
              { label: "28", value: 28 },
            ]}
            defaultValue={"1"}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="בחר מספר ימים"
                variant="outlined"
                dir="rtl"
                size="small"
              />
            )}
            onChange={(event, newValue) => {
              setSelectedDays(newValue?.value);
            }}
            sx={{ ml: 10 }}
          />
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 400 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right" dir="rtl">
                  כמות
                </TableCell>
                <TableCell align="right" dir="rtl">
                  הכי פחות נמכרו
                </TableCell>
                <TableCell align="right" dir="rtl">
                  כמות
                </TableCell>
                <TableCell align="right" dir="rtl">
                  הנמכרים ביותר
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bestSellingProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell align="center" dir="rtl">
                    {leastSellingProducts[index].quantity}
                  </TableCell>
                  <TableCell align="right" dir="rtl">
                    {index + 1}) {leastSellingProducts[index].product_name}
                  </TableCell>

                  <TableCell align="center" dir="rtl">
                    {product.quantity}
                  </TableCell>
                  <TableCell align="right" dir="rtl">
                    {index + 1}) {product.product_name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Dialog>
      <Snackbar
        open={successMessage !== null || errorMessage !== null}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <div>
          {successMessage !== null && (
            <MuiAlert onClose={handleSnackbarClose} severity="success">
              {successMessage}
            </MuiAlert>
          )}
          {errorMessage !== null && (
            <MuiAlert onClose={handleSnackbarClose} severity="error">
              {errorMessage}
            </MuiAlert>
          )}
        </div>
      </Snackbar>
    </>
  );
}

export default MostSoldsAndUnsold;
