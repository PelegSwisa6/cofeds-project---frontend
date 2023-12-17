import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import { getBasicCart, getAllProducts } from "../api/api";

function BasicList({ cart, setCart, saleObject, saleArray, setSaleArray }) {
  const [basicList, setBasicList] = useState();
  const [parseCart, setParseCart] = useState();
  const [id, setId] = useState({});
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        const id = storedUser.user_id;
        setId(id);
        const basicCart = await getBasicCart();
        const filteredCart = basicCart.filter((cart) => cart.user_id === id);
        setParseCart(JSON.parse(filteredCart[0].list_products));
        setBasicList(filteredCart);
        const productData = await getAllProducts();
        setProducts(productData);
      }
    }

    fetchData();
  }, []);

  const handleAddToCart = (filteredProducts) => {
    let newCart = [...cart];
    let newSaleArray = [...saleArray];

    filteredProducts.forEach((productss, index) => {
      const item = {
        product: products.find((product) => product.id === productss.id),
        quantity: +productss.quantity,
      };

      const existingIndex = newCart.findIndex(
        (cartItem) => cartItem.product.id === item.product.id
      );
      if (existingIndex === -1) {
        newCart = [...newCart, item];
      } else {
        newCart[existingIndex].quantity += item.quantity;
      }

      const sale = saleObject.find(
        (sale) => sale.sale_code === item.product.sale_id
      );

      if (sale) {
        if (sale.is_active) {
          const saleCode = sale.sale_code;
          const quantity = item.quantity;

          const saleObjects = {
            key: saleCode,
            value: quantity,
          };

          let saleObjectInArrayIndex = newSaleArray.findIndex(
            (object) => object.key === saleCode
          );

          if (saleObjectInArrayIndex === -1) {
            newSaleArray.push(saleObjects);
          } else {
            newSaleArray[saleObjectInArrayIndex].value += quantity;
          }

          saleObjectInArrayIndex = newSaleArray.findIndex(
            (object) => object.key === saleCode
          );

          if (true) {
            const salePrice =
              sale.sale_price - item.product.price * sale.quantity;
            const cartItem = {
              product: {
                id: sale.sale_code,
                name: sale.sale_name,
                price: salePrice,
                sale: true,
                location: 100,
              },
              quantity: Math.floor(
                newSaleArray[saleObjectInArrayIndex].value / sale.quantity
              ),
            };

            const existingIndex = newCart.findIndex(
              (saleItem) => saleItem.product.id === cartItem.product.id
            );

            if (existingIndex === -1) {
              newCart = [...newCart, cartItem];
            } else {
              newCart[existingIndex].quantity = cartItem.quantity;
            }
          }
        }
      }
    });
    newCart.sort((a, b) => {
      if (a.product.location < b.product.location) {
        return -1;
      }
      if (a.product.location > b.product.location) {
        return 1;
      }
      return 0;
    });

    setCart(newCart);
    setSaleArray(newSaleArray);
    setSuccessMessage("הרשימה נוספה לסל הקניות שלך");
  };
  const handleSnackbarClose = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  return (
    <>
      <Grid display={"grid"} justifyItems={"center"}>
        {basicList && basicList.length > 0 ? (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="right">כמות</TableCell>
                    <TableCell align="right">שם פריט</TableCell>
                    <TableCell align="right">קוד פריט</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {JSON.parse(basicList[0].list_products).map(
                    (product, index) => (
                      <TableRow key={`${product.id}-${index}`}>
                        <TableCell align="right">{product.quantity}</TableCell>
                        <TableCell align="right">{product.name}</TableCell>
                        <TableCell align="right">{product.id}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <br></br>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => handleAddToCart(parseCart)}
            >
              הוסף לעגלה
            </Button>
          </>
        ) : (
          <Box sx={{ mt: 20 }} display={"flex"}>
            <Typography
              variant="caption"
              fontSize={"x-large"}
              dir="rtl"
              align="center"
            >
              עדיין אין לך רשימת קניות בסיסית תוכל להוסיף זאת בעמוד עגלת הקניות
            </Typography>
          </Box>
        )}

        <br></br>
      </Grid>
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

export default BasicList;
