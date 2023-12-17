import { useState, useEffect, useRef } from "react";
import {
  InputBase,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  TextField,
  Button,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { getAllProducts } from "../api/api";
import MuiAlert from "@mui/material/Alert";

function Searchbar({
  setCart,
  cart,
  quantities,
  setQuantities,
  saleArray,
  setSaleArray,
  saleObject,
}) {
  const [products, setProducts] = useState([]);
  const [productMatch, setProductMatch] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchbarRef = useRef(null);
  const resultsBoxRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const productData = await getAllProducts();
      setProducts(productData);
    }

    fetchData();
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      if (
        searchbarRef.current.contains(event.target) ||
        resultsBoxRef.current.contains(event.target)
      ) {
        return;
      }
      setShowResults(false);
    };

    if (showResults) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [showResults]);

  useEffect(() => {
    if (showResults) {
      const searchbarHeight = searchbarRef.current.clientHeight;
      const searchbarTop =
        searchbarRef.current.getBoundingClientRect().top + window.pageYOffset;
      const resultBox = document.getElementById("search-results-box");
      const resultBoxHeight = resultBox.clientHeight;
      const screenHeight = window.innerHeight;

      if (screenHeight - searchbarTop - searchbarHeight > resultBoxHeight) {
        resultBox.style.top = `${searchbarTop + searchbarHeight}px`;
      } else {
        resultBox.style.top = `${searchbarTop - resultBoxHeight}px`;
      }
    }
  }, [showResults, productMatch]);

  const handleAddToCart = (id, index) => {
    let newCart = [...cart];
    let newSaleArray = [...saleArray];
    const item = {
      product: products.find((product) => product.id === id),
      quantity: +quantities[index],
    };
    const existingIndex = cart.findIndex(
      (cartItem) => cartItem.product.id === item.product.id
    );

    if (existingIndex === -1) {
      newCart = [...newCart, item];
      setSuccessMessage("המוצר נוסף לעגלה בהצלחה :)");
    } else {
      newCart[existingIndex].quantity += item.quantity;
      setSuccessMessage("המוצר נוסף לעגלה בהצלחה :)");
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

  const searchProduct = (e) => {
    const query = e.target.value;
    const matches = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.id.toString().includes(query)
      );
    });
    setProductMatch(matches);
    setSearchQuery(setSearchQuery(query));
    if (query) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };
  const handleQuantityChange = (event, index) => {
    const newQuantities = [...quantities];
    newQuantities[index] = event.target.value;
    setQuantities(newQuantities);
  };

  const handleSnackbarClose = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  return (
    <>
      <div ref={searchbarRef}>
        <InputBase
          placeholder=" חיפוש לפי שם, קוד או מותג"
          value={searchQuery}
          onChange={searchProduct}
          fullWidth
          sx={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            minWidth: "390px",
            maxWidth: "205px",
            minHeight: "10px",
            maxHeight: "30px",
          }}
          dir="rtl"
        />
      </div>
      {showResults && (
        <>
          <Box
            ref={resultsBoxRef}
            id="search-results-box"
            sx={{
              position: "absolute",
              width: "100%",
              maxHeight: "300px",
              overflowY: "auto",
              bgcolor: "background.paper",
              zIndex: 1,
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: 1,
            }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton onClick={() => setShowResults(false)}>
                <CloseIcon />
              </IconButton>
            </div>

            <List>
              {productMatch.map((product, index) => (
                <ListItem key={product.id}>
                  <Button
                    variant="contained"
                    size="big"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => handleAddToCart(product.id, index)}
                    sx={{}}
                  ></Button>
                  <TextField
                    type=""
                    defaultValue={quantities[index]}
                    label="כמות"
                    variant="outlined"
                    value={1}
                    onChange={(event) => handleQuantityChange(event, index)}
                    sx={{ width: "120px", ml: 2 }}
                    InputProps={{
                      inputProps: { min: 1 },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(
                                { target: { value: +quantities[index] + 1 } },
                                index
                              )
                            }
                          >
                            <AddIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(
                                { target: { value: +quantities[index] - 1 } },
                                index
                              )
                            }
                            disabled={quantities[index] <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <ListItemText
                    primary={product.name}
                    secondary={`קוד: ${product.id}`}
                    sx={{ textAlign: "right" }}
                  />
                </ListItem>
              ))}
              {productMatch.length === 0 && (
                <Typography sx={{ p: 2 }} dir="rtl">
                  לא נמצאו מוצרים התואמים לחיפוש שלך
                </Typography>
              )}
            </List>
          </Box>
          <Snackbar
            open={successMessage !== null || errorMessage !== null}
            autoHideDuration={1500}
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
      )}
    </>
  );
}

export default Searchbar;
