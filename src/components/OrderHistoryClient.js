import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Snackbar,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MuiAlert from "@mui/material/Alert";

import { getAllOrders, getAllProducts } from "../api/api";

function OrderHistoryClient({
  cart,
  setCart,
  saleObject,
  saleArray,
  setSaleArray,
}) {
  const [products, setProducts] = useState([]);
  const [privateOrders, setPrivateOrders] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const id = storedUser.user_id;
      const orders = await getAllOrders();
      const readyOrdersData = orders
        .filter((order) => order.user_id === id)
        .slice()
        .reverse()
        .map((order) => ({
          ...order,
          expanded: false,
        }));
      setPrivateOrders(readyOrdersData);
      const productData = await getAllProducts();
      setProducts(productData);
    }

    fetchData();
  }, []);

  const handleExpandClick = (index) => () => {
    setPrivateOrders((prevOrders) =>
      prevOrders.map((order, i) =>
        i === index ? { ...order, expanded: !order.expanded } : order
      )
    );
  };

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
  };

  const handleReturnOrder = (orderId) => {
    const order = privateOrders.find((order) => order.id === orderId);
    if (order) {
      const productsInOrder = JSON.parse(order.product_list);
      const filteredProducts = productsInOrder.filter(
        (product) => !product.sale
      );
      handleAddToCart(filteredProducts);
      setSuccessMessage("הרשימה נוספה לסל הקניות שלך");
    }
  };
  const handleSnackbarClose = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right"></TableCell>
              <TableCell align="right">רשימת מוצרים</TableCell>
              <TableCell align="right">מס הזמנה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {privateOrders.map((order, index) => (
              <TableRow key={order.id}>
                <TableCell align="right">
                  {" "}
                  <Button
                    onClick={() => handleReturnOrder(order.id, index)}
                    variant="contained"
                  >
                    הוסף לרשימה
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Accordion expanded={order.expanded}>
                    <AccordionSummary
                      expandIcon={<KeyboardArrowDownIcon />}
                      dir="rtl"
                      onClick={handleExpandClick(index)}
                    >
                      <Typography>הצג רשימת מוצרים</Typography>
                    </AccordionSummary>
                    <AccordionDetails dir="rtl">
                      <ul>
                        {JSON.parse(order.product_list).map(
                          (product, index) => (
                            <li key={`${product.id}-${index}`}>
                              {product.quantity} - {product.name}
                            </li>
                          )
                        )}
                      </ul>
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
                <TableCell align="right">{order.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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

export default OrderHistoryClient;
