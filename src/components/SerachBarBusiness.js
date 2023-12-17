import { useState, useEffect, useRef } from "react";
import {
  InputBase,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { getAllProducts } from "../api/api";

function SearchBarBusiness({ setProductsSale, productsSale }) {
  const [products, setProducts] = useState([]);
  const [productMatch, setProductMatch] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const searchbarRef = useRef(null);
  const resultsBoxRef = useRef(null);

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

  useEffect(() => {
    if (selectedProduct) {
      const alreadyAdded = productsSale.some(
        (p) => p.id === selectedProduct.id
      );

      if (alreadyAdded) {
        setSelectedProduct(null);
        return;
      }
      const newProductsSale = [...productsSale];
      newProductsSale.push(selectedProduct);
      setProductsSale(newProductsSale);
      setSelectedProduct(null);
    }
  }, [selectedProduct, productsSale, setProductsSale]);

  useEffect(() => {
    setSelectedProduct(null);
  }, [productsSale, setProductsSale]);

  const searchProduct = (e) => {
    const query = e.target.value;
    const matches = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.id.toString().includes(query)
      );
    });
    setProductMatch(matches);
    setSearchQuery(query);

    if (query) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleAddToSale = (product) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <div ref={searchbarRef}>
        <InputBase
          placeholder=" חיפוש לפי שם, קוד או מותג"
          value={searchQuery}
          onChange={searchProduct}
          fullWidth
          sx={{ mr: 1, border: "1px solid #ccc", borderRadius: "4px" }}
          dir="rtl"
        />
      </div>
      {showResults && (
        <Box
          ref={resultsBoxRef}
          id="search-results-box"
          sx={{
            position: "unset",
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
                  sx={{ p: 1 }}
                  variant="contained"
                  onClick={() => {
                    handleAddToSale(product);
                  }}
                >
                  {" "}
                  הוסף למבצע
                </Button>
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
      )}
    </>
  );
}

export default SearchBarBusiness;
