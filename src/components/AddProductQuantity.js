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
} from "@mui/material";
import { getAllProducts, addProduct } from "../api/api";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";

function AddProductQuantity() {
  const [openDialog, setOpenDialog] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setQuantity(0);
  };
  useEffect(() => {
    async function fetchData() {
      const productsData = await getAllProducts();
      setAllProducts(productsData);
    }

    fetchData();
  }, []);

  const handleAddProduct = () => {
    const data = {
      productCode: selectedProduct.id,
      quantity: eval(quantity),
    };
    addProduct(data)
      .then((response) => {
        setSuccessMessage(response.message);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
      });
  };
  const handleSnackbarClose = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <Button variant="contained" onClick={handleOpenDialog}>
          הוספת כמות למוצר קיים
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <Box sx={{ p: 2, display: "flex", flexDirection: "column" }}>
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
            עדכון כמות למוצר
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "row-reverse", gap: 2 }}>
            <Autocomplete
              options={allProducts}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="בחר מוצר"
                  variant="outlined"
                  fullWidth
                  dir="rtl"
                  sx={{ width: "200px" }}
                />
              )}
              onChange={(event, newValue) => {
                setSelectedProduct(newValue);
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            <TextField
              placeholder="כמות"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
              dir="rtl"
              sx={{ width: "80px" }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 3,
              flexDirection: "row-reverse",
            }}
          >
            <Button variant="contained" onClick={handleAddProduct}>
              עדכון הכמות
            </Button>
          </Box>
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

export default AddProductQuantity;
