import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  updateProductQuantity,
  createOrder,
  saveOpenCart,
  saveBasicCart,
} from "../api/api";
import UserDetailsBox from "./UserDetailsBox";
import PrepareYourSelf from "./PrepareYourSelf";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MuiAlert from "@mui/material/Alert";

function ShoppingCart({
  cart,
  removeFromCart,
  setCart,
  saleObject,
  saleArray,
  setSaleArray,
}) {
  const [user, setUser] = useState(null);
  const [total, setTotal] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const saveBasicCART = () => {
    if (cart.length === 0) {
      return;
    }
    const filteredProducts = cart.filter((product) => !product.product.sale);
    const products = filteredProducts.map((item) => {
      const id = item.product.id;
      const name = item.product.name;
      const quantity = item.quantity;
      const location = item.product.location;
      const sale = item.product.sale;

      return { id, name, quantity, location, sale };
    });
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return;
    }
    const user_id = user ? user.user_id : 0;
    const data = {
      user_id: user_id,
      products: products,
      total_price: getTotalPrice(),
    };

    saveBasicCart(data);
    setSuccessMessage("הרשימה הבסיסית התעדכנה");
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleUserDetailsSubmit = (userDetails) => {
    setUserDetails(userDetails);
    handleFinishOrder(userDetails);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function getTotalPrice() {
    return cart.reduce((total, item) => {
      return total + item.product.price * item.quantity.toFixed(2);
    }, 0);
  }

  async function handleFinishOrder(userDetails) {
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user ? user.user_id : 57;
    const products = cart.map((item) => {
      const id = item.product.id;
      const name = item.product.name;
      const quantity = item.quantity;
      const location = item.product.location;
      const sale = item.product.sale;

      return { id, name, quantity, location, sale };
    });
    products.sort((a, b) => a.location - b.location);
    const data = {
      user_id: user_id,
      products: products,
      total_price: getTotalPrice(),
      userDetails: userDetails,
      prepartionTime: userDetails.prepartionTToOrder,
      collectionTime: userDetails.collectionTime,
    };
    setUserDetails(null);

    createOrder(data)
      .then((response) => {
        setSuccessMessage(response.message);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
      });

    cart.forEach((product) => {
      if (!product.sale) {
        updateProductQuantity(product.product.id, product.quantity);
      }
    });

    setCart([]);
    setTotal(0);
  }

  const updateQuantity = (index, quantity, operation) => {
    let updatedQuantity = +quantity;

    if (operation === "increase") {
      updatedQuantity++;
      const product = cart[index];
      const saleCode = product.product.sale_id;
      const quantity = 1;
      const sale = saleObject.find((sale) => sale.sale_code === saleCode);
      if (sale) {
        if (sale.is_active) {
          changeQuantitySaleInCart(saleCode, quantity, updatedQuantity);
        }
      }
    } else if (operation === "decrease" && updatedQuantity > 1) {
      updatedQuantity--;
      const product = cart[index];
      const saleCode = product.product.sale_id;
      const quantity = -1;
      const sale = saleObject.find((sale) => sale.sale_code === saleCode);
      if (sale) {
        if (sale.is_active) {
          changeQuantitySaleInCart(saleCode, quantity, updatedQuantity);
        }
      }
    }
    const updatedCart = [...cart];
    const updatedItem = { ...updatedCart[index], quantity: updatedQuantity };
    updatedCart.splice(index, 1, updatedItem);
    setCart(updatedCart);
  };

  function changeQuantitySaleInCart(saleCode, quantity, updatedQuantity) {
    const newSaleArray = [...saleArray];
    const sale = saleObject.find((sale) => sale.sale_code === saleCode);
    const saleObjectInArrayIndex = newSaleArray.findIndex(
      (object) => object.key === saleCode
    );
    const index = cart.findIndex((item) => item.product.id === saleCode);
    if (quantity === 1) {
      newSaleArray[saleObjectInArrayIndex].value += 1;
    }
    if (
      newSaleArray[saleObjectInArrayIndex].value % sale.quantity == 0 &&
      quantity === 1
    ) {
      cart[index].quantity += 1;
    }
    if (quantity === -1) {
      newSaleArray[saleObjectInArrayIndex].value -= 1;
    }
    if (
      newSaleArray[saleObjectInArrayIndex].value % sale.quantity == 2 &&
      quantity === -1
    ) {
      cart[index].quantity -= 1;
    }
    setSaleArray(newSaleArray);
  }

  function saleUpdate(saleCode, quantity, productId) {
    const sale = saleObject.find((sale) => sale.sale_code === saleCode);
    const saleObjectInArrayIndex = saleArray.findIndex(
      (object) => object.key === saleCode
    );

    let numToRemove = Math.floor(
      (saleArray[saleObjectInArrayIndex].value - quantity) / sale.quantity
    );
    if (numToRemove < 0) {
      numToRemove = 0;
    }
    const updatedCart = [...cart];

    if (saleObjectInArrayIndex !== -1) {
      const index = updatedCart.findIndex(
        (item) => item.product.id === saleCode
      );
      if (updatedCart[index]) {
        if (numToRemove === 0) {
          const user = JSON.parse(localStorage.getItem("user"));

          const user_id = user ? user.user_id : 0;
          const data = {
            user_id: user_id,
            products: [],
            total_price: 0,
          };
          saveOpenCart(data);

          updatedCart.splice(index, 1);
          saleArray[saleObjectInArrayIndex].value -= quantity;
        } else {
          saleArray[saleObjectInArrayIndex].value -= quantity;
          updatedCart[index].quantity = numToRemove;
        }
      }
    }

    const indexs = updatedCart.findIndex(
      (product) => product.product.id === parseInt(productId)
    );
    updatedCart.splice(indexs, 1);

    setCart(updatedCart);
  }

  function removeFromCartAndUpdate(index, productId) {
    const product = cart[index];
    const saleCode = product.product.sale_id;
    const quantity = product.quantity;
    const sale = saleObject.find((sale) => sale.sale_code === saleCode);
    productId = product.product.id;
    if (sale) {
      if (sale.is_active) {
        saleUpdate(saleCode, quantity, productId);
      } else {
        removeFromCart(index);
      }
    } else {
      removeFromCart(index);
    }
  }
  const handleSnackbarClose = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  return (
    <>
      <Grid container spacing={2} sx={{ padding: "2rem" }}>
        <Grid item xs={12}>
          {cart.length === 0 ? (
            <Box sx={{ mt: 20 }} display={"flex"} justifyContent={"center"}>
              <Typography
                variant="caption"
                fontSize={"x-large"}
                dir="rtl"
                align="center"
              >
                סל הקניות שלך ריק
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" dir="rtl">
                סל הקניות שלך
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="right"></TableCell>
                      <TableCell align="right">
                        מחיר
                        <br /> סה"כ
                      </TableCell>

                      <TableCell align="right">כמות</TableCell>
                      <TableCell align="right">שם המוצר</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">
                          {item.product.sale ? (
                            <Typography variant="subtitle2"></Typography>
                          ) : (
                            <IconButton
                              aria-label="delete"
                              onClick={() =>
                                removeFromCartAndUpdate(index, item.product_id)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </TableCell>

                        <TableCell align="right">
                          <Typography variant="subtitle2">
                            {item.product.price.toFixed(2)}₪
                            <br />
                            {(item.product.price * item.quantity).toFixed(2)}₪
                          </Typography>
                        </TableCell>
                        <TableCell align="right" dir="rtl">
                          {item.product.sale ? (
                            <Typography variant="subtitle2">
                              {item.quantity}
                            </Typography>
                          ) : (
                            <>
                              <IconButton
                                size="extra-small"
                                onClick={() =>
                                  updateQuantity(
                                    index,
                                    item.quantity,
                                    "increase"
                                  )
                                }
                              >
                                <AddIcon />
                              </IconButton>

                              <TextField
                                size="small"
                                type=""
                                variant="outlined"
                                inputProps={{ min: 1 }}
                                value={item.quantity}
                                sx={{ width: "45px", height: "45px" }}
                                onChange={(e) =>
                                  updateQuantity(index, e.target.value)
                                }
                              />
                              <IconButton
                                size="extra-small"
                                onClick={() =>
                                  updateQuantity(
                                    index,
                                    item.quantity,
                                    "decrease"
                                  )
                                }
                              >
                                <RemoveIcon />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" align="right">
                            {item.product.name}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell align="center">
                        <Typography variant="subtitle2">
                          ₪{getTotalPrice().toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          :סה"כ לתשלום
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={cart.length === 0}
                  onClick={() => setUserDetails(true)}
                  sx={{ mr: 2 }}
                >
                  שלח/י הזמנה להכנה
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  disabled={cart.length === 0}
                  onClick={() => handleDialogOpen()}
                >
                  הכן בעצמך
                </Button>
                {user !== null && (
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={cart.length === 0}
                    onClick={() => saveBasicCART()}
                    sx={{ ml: 2 }}
                  >
                    עדכן רשימה בסיסית
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle dir="rtl" align="center">
          רשימת קניות ממוינת
        </DialogTitle>
        <DialogContent>
          <PrepareYourSelf cart={cart} />
        </DialogContent>
        <DialogActions style={{ justifyContent: "flex-start" }}>
          <Button
            onClick={() => handleDialogClose()}
            color="primary"
            variant="contained"
            align="right"
          >
            סגור
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={Boolean(userDetails)} onClose={() => setUserDetails(null)}>
        <DialogTitle dir="rtl">פרטים אישיים</DialogTitle>
        <DialogContent>
          <UserDetailsBox onSubmit={handleUserDetailsSubmit} cart={cart} />
        </DialogContent>
        <DialogActions style={{ justifyContent: "flex-start" }}>
          <Button
            onClick={() => setUserDetails(null)}
            color="primary"
            variant="contained"
            align="center"
          >
            ביטול
          </Button>
        </DialogActions>
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

export default ShoppingCart;
