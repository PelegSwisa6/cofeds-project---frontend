import React, { useState, useEffect } from "react";
import { getAllProducts } from "../api/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Dialog,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function MissOnShelf() {
  const [openDialog, setOpenDialog] = useState(false);
  const [productList, setProductsList] = useState([]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  useEffect(() => {
    async function fetchData() {
      const productsData = await getAllProducts();
      const missedProducts = productsData.filter(
        (product) => product.quantity <= 5
      );
      setProductsList(missedProducts);
    }

    fetchData();
  }, []);

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
          מוצרים שחסרים במדף
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
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
          כדאי להזמין
        </Typography>

        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pt: 2,
            }}
          >
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow key={productList.id}>
                    <TableCell align="right">כמות</TableCell>
                    <TableCell align="right">שם פריט</TableCell>
                    <TableCell align="right">קוד פריט</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productList.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell align="right">{product.quantity}</TableCell>
                      <TableCell align="right">{product.name}</TableCell>
                      <TableCell align="right">{product.id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

export default MissOnShelf;
