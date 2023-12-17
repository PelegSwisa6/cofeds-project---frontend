import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Searchbar from "./Searchbar";
import { getAllProducts, getAllCategories } from "../api/api";
import MuiAlert from "@mui/material/Alert";

function ProductList({ setCart, cart, saleObject, saleArray, setSaleArray }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cartSale, setCartSale] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleAddToCart = (id, INDEX) => {
    let newCart = [...cart];
    let newSaleArray = [...saleArray];

    const item = {
      product: products.find((product) => product.id === id),
      quantity: +quantities[INDEX],
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

  useEffect(() => {
    async function fetchData() {
      const productData = await getAllProducts();
      const categoryData = await getAllCategories();
      setProducts(productData);
      setCategories(categoryData);
      setQuantities(new Array(productData.length).fill(1));
    }

    fetchData();
  }, []);

  const handleQuantityChange = (event, index) => {
    const newQuantities = [...quantities];
    newQuantities[index] = event.target.value;
    setQuantities(newQuantities);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSortByPrice = (sortType) => {
    setSortByPrice(sortType);
  };
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortByPrice === "highest") {
      return b.price - a.price;
    } else if (sortByPrice === "lowest") {
      return a.price - b.price;
    }
    return 0;
  });

  const handleSnackbarClose = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Searchbar
          setCart={setCart}
          cart={cart}
          quantities={quantities}
          setQuantities={setQuantities}
          saleArray={saleArray}
          setSaleArray={setSaleArray}
          saleObject={saleObject}
        />

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Select
            value={sortByPrice}
            onChange={(event) => handleSortByPrice(event.target.value)}
            variant="outlined"
            sx={{
              minWidth: "195px",
              maxWidth: "205px",
              minHeight: "10px",
              maxHeight: "30px",
            }}
            displayEmpty
            renderValue={() => "מיון לפי מחיר"}
            MenuProps={{
              anchorOrigin: { vertical: "bottom", horizontal: "center" },
            }}
            dir="rtl"
          >
            <MenuItem value="" dir="rtl">
              ללא מיון
            </MenuItem>
            <MenuItem value="lowest" dir="rtl">
              מחיר: מהנמוך לגבוה
            </MenuItem>
            <MenuItem value="highest" dir="rtl">
              מחיר: מהגבוה לנמוך
            </MenuItem>
          </Select>
          <Select
            value={selectedCategory || ""}
            onChange={(event) => handleCategorySelect(event.target.value)}
            variant="outlined"
            sx={{
              minWidth: "195px",
              maxWidth: "205px",
              minHeight: "10px",
              maxHeight: "30px",
            }}
            displayEmpty
            renderValue={() => "סינון לפי קטגוריה"}
            MenuProps={{
              anchorOrigin: { vertical: "bottom", horizontal: "center" },
            }}
            dir="rtl"
          >
            <MenuItem value="" dir="rtl">
              כל המוצרים
            </MenuItem>

            {categories.map((category) => (
              <MenuItem
                key={category.category_id}
                value={category.category_id}
                dir="rtl"
              >
                {category.category_name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
      <Grid container spacing={2}>
        {sortedProducts.map((product, index) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3} xl={2}>
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                height={150}
                image={product.image}
                alt={product.name}
                sx={{ objectFit: "contain" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom dir="rtl">
                  {product.name}
                </Typography>
                <Typography variant="h9">
                  {"קוד: " + product.id} <br></br>
                  {saleObject[product.sale_id] ? (
                    <Typography variant="h9">
                      {"מבצע: " + saleObject[product.sale_id].sale_name}
                    </Typography>
                  ) : (
                    <br></br>
                  )}
                </Typography>

                <Typography variant="h6" gutterBottom dir="rtl" sx={{ mr: 1 }}>
                  ₪{product.price}{" "}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleAddToCart(product.id, index)}
                    sx={{ ml: 1 }}
                  >
                    הוסף לסל
                  </Button>
                  <TextField
                    type=""
                    label="כמות"
                    variant="outlined"
                    value={quantities[index]}
                    onChange={(event) => handleQuantityChange(event, index)}
                    sx={{ width: "130px" }}
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
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
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
  );
}

export default ProductList;
