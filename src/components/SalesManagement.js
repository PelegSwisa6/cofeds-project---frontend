import React, { useState, useEffect } from "react";
import {
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Dialog,
  TextField,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  IconButton,
  Autocomplete,
  Snackbar,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import {
  addOrUpdateSale,
  getAllProducts,
  addProductToSale,
  getAllSales,
} from "../api/api";
import SearchBarBusiness from "./SerachBarBusiness";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";

function SalesManagement() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openChoseDialog, setOpenChoseDialog] = useState(false);
  const [saleName, setSaleName] = useState("");
  const [saleCode, setSaleCode] = useState("");
  const [quantityItems, setQuantityItems] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [activeSale, setActiveSale] = useState(true);
  const [productsSale, setProductsSale] = useState([]);
  const [allProductsData, setAllProductsData] = useState([]);
  const [runHook, setRunHook] = useState(0);
  const [sales, SetSales] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    existSale(null);
  };

  const handleOpenChoseProduct = () => {
    setOpenChoseDialog(true);
  };

  const handleCloseChoseProduct = () => {
    setRunHook(runHook + 1);
    setOpenChoseDialog(false);
    productsSale.forEach((product) => {
      const productData = {
        productID: product.id,
        saleID: saleCode,
      };
      addProductToSale(productData)
        .then((response) => {
          setSuccessMessage(response.message);
        })
        .catch((error) => {
          setErrorMessage(error.response.data.message);
        });
    });
  };

  useEffect(() => {
    async function fetchData() {
      const productData = await getAllProducts();
      setAllProductsData(productData);
      const salesData = await getAllSales();
      SetSales(salesData);
      const productsSale = allProductsData.filter(
        (product) => product.sale_id === parseInt(saleCode)
      );
      setProductsSale(productsSale);
    }

    fetchData();
  }, [runHook, saleCode]);

  const handleDelete = (code) => {
    const updatedProductsSale = productsSale.filter(
      (product) => product.id !== parseInt(code)
    );
    setProductsSale(updatedProductsSale);
    const productDelete = {
      productID: code,
      saleID: 0,
    };
    addProductToSale(productDelete);
  };

  const handleUpdateSale = () => {
    const data = {
      saleName: saleName,
      saleCode: saleCode,
      quantity: quantityItems,
      salePrice: salePrice,
      IsActive: activeSale,
    };

    addOrUpdateSale(data)
      .then((response) => {
        setSuccessMessage(response.message);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
      });
  };
  const handleSaleChange = (event) => {
    setActiveSale(event.target.checked);
  };

  const handleUpdateProducts = () => {
    setRunHook(runHook + 1);
    handleUpdateSale();
    handleOpenChoseProduct();
  };

  const existSale = (sale) => {
    if (sale != null) {
      setSaleName(sale.sale_name);
      setSaleCode(sale.sale_code);
      setQuantityItems(sale.quantity);
      setSalePrice(sale.sale_price);
      setActiveSale(sale.is_active);
    } else {
      setSaleName("");
      setSaleCode("");
      setQuantityItems("");
      setSalePrice("");
      setActiveSale(true);
    }
  };
  const handleSnackbarClose = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

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
          ניהול מבצעים
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <IconButton sx={{ marginLeft: "auto" }} onClick={handleCloseDialog}>
          <CloseIcon />
        </IconButton>
        <Box sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Typography
            variant="caption"
            display="block"
            align="center"
            fontSize={20}
            gutterBottom
          >
            הוספה ועדכון מבצעים
          </Typography>

          <Autocomplete
            options={sales.map((option) => option.sale_name)}
            // value={saleName}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="חיפוש מבצע קיים"
                variant="outlined"
                fullWidth
                align="right"
                dir="rtl"
                sx={{ mb: 2, ml: 1 }}
              />
            )}
            onChange={(event, newValue) => {
              if (newValue != null) {
                const selectedSale = sales.find(
                  (option) => option.sale_name === newValue
                );
                existSale(selectedSale);
              } else {
                existSale(null);
              }
            }}
            MenuProps={{
              sx: { dir: "rtl" },
            }}
            align="right"
            dir="rtl"
            sx={{ width: 222 }}
          />
          <TextField
            placeholder="שם מבצע"
            dir="rtl"
            width="200"
            sx={{ mb: 2 }}
            value={saleName}
            onChange={(event) => setSaleName(event.target.value)}
          />
          <TextField
            placeholder="קוד מבצע"
            dir="rtl"
            width="200"
            sx={{ mb: 2 }}
            value={saleCode}
            onChange={(event) => setSaleCode(event.target.value)}
          />
          <TextField
            placeholder="כמות פריטים במבצע"
            dir="rtl"
            width="200"
            sx={{ mb: 2 }}
            value={quantityItems}
            onChange={(event) => setQuantityItems(event.target.value)}
          />
          <TextField
            placeholder="מחיר מבצע"
            dir="rtl"
            width="200"
            sx={{ mb: 2 }}
            value={salePrice}
            onChange={(event) => setSalePrice(event.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox checked={activeSale} onChange={handleSaleChange} />
            }
            label="מבצע פעיל"
            sx={{ ml: 0 }}
          />
          <Button variant="contained" onClick={handleUpdateProducts}>
            הוספת מוצרים
          </Button>
          <br></br>
          <Button variant="contained" onClick={handleUpdateSale}>
            עדכון מבצע
          </Button>
          <Dialog
            open={openChoseDialog}
            onClose={handleCloseChoseProduct}
            sx={{ width: "100%", height: "100%" }}
          >
            <SearchBarBusiness
              setProductsSale={setProductsSale}
              productsSale={productsSale}
            />
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 400 }} aria-label="caption table">
                <caption>מוצרים שנמצאים במבצע</caption>
                <TableHead>
                  <TableRow>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right">שם מוצר</TableCell>
                    <TableCell align="right">קוד מוצר</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productsSale.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDelete(product.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">{product.name}</TableCell>
                      <TableCell align="right">{product.id}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Button variant="contained" onClick={handleCloseChoseProduct}>
              סגור
            </Button>
          </Dialog>
        </Box>
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

export default SalesManagement;
