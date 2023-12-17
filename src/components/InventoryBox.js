import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Autocomplete,
  Snackbar,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  addOrUpdateProduct,
  addOrUpdateCategory,
  addOrUpdateSupplier,
  getAllCategories,
  getAllSuppliers,
  getAllProducts,
} from "../api/api";
import OutgoingStock from "./OutgoingStock";
import SalesManagement from "./SalesManagement";
import AddProductQuantity from "./AddProductQuantity";
import MostSoldsAndUnsold from "./MostSoldsAndUnsold";
import MissOnShelf from "./MissOnShelf";
import MuiAlert from "@mui/material/Alert";
import SuppliersOrder from "./SuppliersOrder";

function InventoryBox() {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  //product
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [categoryID, setCategoryID] = useState("");
  const [supplierID, setSupplierID] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [catname, setCategoryname] = useState("");
  const [suppname, setSuppliername] = useState("");

  //cat
  const [updateCatId, setUpdateCatId] = useState("");
  const [updateCatName, setUpdateCatName] = useState("");
  const [allCategory, setAllCategory] = useState([]);

  //sup
  const [updateSupId, setUpdateSupId] = useState("");
  const [updateSupName, setUpdateSupName] = useState("");
  const [updateConName, setUpdateConName] = useState("");
  const [updateConEmail, setUpdateConEmail] = useState("");
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [selectSupplierName, setSelectSupplierName] = useState("");
  const [selectCategoryName, setSelectCategoryName] = useState("");

  useEffect(() => {
    async function fetchData() {
      const categoryData = await getAllCategories();
      setAllCategory(categoryData);
      const suppliersData = await getAllSuppliers();
      setAllSuppliers(suppliersData);
    }

    fetchData();
  }, []);

  //pull data fun
  const advencecat = async (e) => {
    setCategoryID(e);
    const allCategories = await getAllCategories();
    if (null != allCategories.filter((item) => item.category_id == e)[0]) {
      setCategoryname(
        allCategories.filter((item) => item.category_id == e)[0].category_name
      );
      setSelectCategoryName(
        allCategories.filter((item) => item.category_id == e)[0].category_name
      );
    } else {
      setCategoryname("");
      setSelectCategoryName("");
    }
  };
  const advencesup = async (e) => {
    setSupplierID(e);

    if (null != allSuppliers.filter((item) => item.id == e)[0]) {
      setSelectSupplierName(
        allSuppliers.filter((item) => item.id == e)[0].name
      );
      setSuppliername(allSuppliers.filter((item) => item.id == e)[0].name);
    } else {
      setSelectSupplierName("");
      setSuppliername("");
    }
  };
  const setAll = async (e) => {
    setProductCode(e);
    const allProductsData = await getAllProducts();
    if (null != allProductsData.filter((item) => item.id == e)[0]) {
      setProductName(allProductsData.filter((item) => item.id == e)[0].name);
      setPrice(allProductsData.filter((item) => item.id == e)[0].price);
      setQuantity(allProductsData.filter((item) => item.id == e)[0].quantity);
      advencecat(allProductsData.filter((item) => item.id == e)[0].category);

      advencesup(allProductsData.filter((item) => item.id == e)[0].supplier);
      setLocation(allProductsData.filter((item) => item.id == e)[0].location);
      setImage(allProductsData.filter((item) => item.id == e)[0].image);
    }
    if (e === "") {
      setProductName("");
      setPrice("");
      setQuantity("");
      advencecat("");
      advencesup("");
      setLocation("");
      setImage("");
    }
  };

  //add data fun
  const handleAddProduct = () => {
    const data = {
      productCode: productCode,
      product_name: productName,
      category_id: categoryID,
      supplier_id: supplierID,
      quantity: eval(quantity),
      price: eval(price),
      location: location,
      image: image,
    };
    addOrUpdateProduct(data)
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

  const handleAddCategory = () => {
    const data = {
      categoryID: updateCatId,
      categoryName: updateCatName,
    };
    addOrUpdateCategory(data)
      .then((response) => {
        setSuccessMessage(response.message);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
      });
  };
  const handleAddSupplier = () => {
    const data = {
      supplierID: updateSupId,
      supplierName: updateSupName,
      contactName: updateConName,
      contactEmail: updateConEmail,
    };
    addOrUpdateSupplier(data)
      .then((response) => {
        setSuccessMessage(response.message);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
      });
  };

  return (
    <>
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          <div style={{ padding: 0 }}>
            <OutgoingStock />
          </div>
          <div style={{ padding: 0 }}>
            <SalesManagement />
          </div>
          <div style={{ padding: 0 }}>
            <AddProductQuantity />
          </div>
          <div style={{ padding: 0 }}>
            <MostSoldsAndUnsold />
          </div>
          <div style={{ padding: 0 }}>
            <MissOnShelf />
          </div>
          <div style={{ padding: 0 }}>
            <SuppliersOrder />
          </div>
        </div>

        <Box sx={{ display: "contents" }}>
          <Typography
            variant="h5"
            dir="rtl"
            sx={{ p: 1, fontFamily: "Courier New", mt: 0 }}
          >
            עדכון והוספת מוצרים
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              p: 2,
            }}
          >
            <TextField
              placeholder="קוד הפריט"
              dir="rtl"
              value={productCode}
              onChange={(e) => setAll(e.target.value)}
              sx={{ mb: 2, ml: 1, width: 120 }}
            />
            <TextField
              placeholder="שם המוצר"
              dir="rtl"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              sx={{ mb: 2, ml: 1, width: 190 }}
            />
            <Autocomplete
              options={allCategory.map((option) => option.category_name)}
              value={selectCategoryName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="קטגוריה"
                  variant="outlined"
                  fullWidth
                  dir="rtl"
                  sx={{ mb: 2, ml: 1, width: 200 }}
                />
              )}
              onChange={(event, newValue) => {
                if (newValue) {
                  const selectedCategoryId = allCategory.find(
                    (option) => option.category_name === newValue
                  ).category_id;
                  setCategoryID(selectedCategoryId);
                } else {
                  setCategoryID(null);
                }
              }}
            />

            <Autocomplete
              options={allSuppliers.map((option) => option.name)}
              value={selectSupplierName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="ספק"
                  variant="outlined"
                  fullWidth
                  dir="rtl"
                  sx={{ mb: 2, ml: 1, width: 170 }}
                />
              )}
              onChange={(event, newValue) => {
                if (newValue) {
                  const selectedSupplierId = allSuppliers.find(
                    (option) => option.name === newValue
                  ).id;
                  setSupplierID(selectedSupplierId);
                } else {
                  setSupplierID(null);
                }
              }}
            />
            <TextField
              placeholder="כמות"
              dir="rtl"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              sx={{ mb: 2, ml: 1, width: 120 }}
            />
            <TextField
              placeholder="מחיר"
              dir="rtl"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              sx={{ mb: 2, ml: 1, width: 100 }}
            />
            <TextField
              placeholder="מיקום"
              dir="rtl"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              sx={{ mb: 2, ml: 1, width: 70 }}
            />
            <TextField
              placeholder="תמונה"
              dir="rtl"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              sx={{ mb: 2, ml: 1, width: 120 }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleAddProduct}
              sx={{ mr: 2, p: 2, ml: 2, height: 57 }}
            >
              הוסף או עדכן מוצר
            </Button>
          </Box>

          <Typography
            variant="h5"
            dir="rtl"
            sx={{ p: 1, fontFamily: "Courier New", mt: 0 }}
          >
            עדכון והוספת קטגוריות
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "row-reverse", p: 2 }}>
            <TextField
              placeholder="מס קטגוריה"
              dir="rtl"
              value={updateCatId}
              onChange={(e) => setUpdateCatId(e.target.value)}
              sx={{ mb: 2, ml: 1, width: 120 }}
            />
            <TextField
              placeholder="שם קטגוריה"
              dir="rtl"
              value={updateCatName}
              onChange={(e) => setUpdateCatName(e.target.value)}
              sx={{ mb: 2, ml: 1, width: 170 }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleAddCategory}
              sx={{ mr: 2, p: 2, ml: 2, height: 57 }}
            >
              הוסף או שנה קטגוריה
            </Button>
          </Box>

          <Typography
            variant="h5"
            dir="rtl"
            sx={{ p: 1, fontFamily: "Courier New", mt: 0 }}
          >
            עדכון והוספת ספקים
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row-reverse", p: 2 }}>
            <TextField
              placeholder="מס ספק"
              dir="rtl"
              value={updateSupId}
              onChange={(e) => setUpdateSupId(e.target.value)}
              sx={{ mb: 2, ml: 1, width: 120 }}
            />
            <TextField
              placeholder="שם ספק"
              dir="rtl"
              value={updateSupName}
              onChange={(e) => setUpdateSupName(e.target.value)}
              sx={{ mb: 2, ml: 1, width: 120 }}
            />
            <TextField
              placeholder="שם איש קשר"
              dir="rtl"
              value={updateConName}
              onChange={(e) => setUpdateConName(e.target.value)}
              sx={{ mb: 2, ml: 1, width: 120 }}
            />
            <TextField
              placeholder="כתובת אימייל"
              dir="rtl"
              value={updateConEmail}
              onChange={(e) => setUpdateConEmail(e.target.value)}
              sx={{ mb: 2, ml: 1, width: 180 }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleAddSupplier}
              sx={{ mr: 2, p: 2, ml: 2, height: 57 }}
            >
              הוסף או שנה ספק
            </Button>
          </Box>
        </Box>
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
    </>
  );
}
export default InventoryBox;
