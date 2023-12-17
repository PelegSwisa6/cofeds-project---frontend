import { Link, Navigate, Route, Routes } from "react-router-dom";
import NavbarClients from "../components/NavbarClients";
import ProductList from "../components/ProductList";
import ShoppingCart from "../components/ShoppingCart";
import React, { useEffect, useState } from "react";
import {
  getAllProducts,
  saveOpenCart,
  getAllSales,
  getOpenCart,
} from "../api/api";
import UserProfilePage from "../components/UserProfilePage";
import BasicList from "../components/BasicList";
import OrderHistoryClient from "../components/OrderHistoryClient";

function ClientsPage() {
  const [cart, setCart] = useState([]);
  const [saleArray, setSaleArray] = useState([{ key: 0, value: 0 }]);
  const [saleObject, setSaleObject] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const salesData = await getAllSales();
      setSaleObject(salesData);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchOpenOrdersData() {
      const salesData = await getAllSales();
      const opencart = await getOpenCart();

      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const user_id = user ? user.user_id : 0;
        const openCartData = opencart.find((open) => open.user_id === user_id);
        const productsInOrder = JSON.parse(openCartData.list_products);
        const openCarts = productsInOrder;
        const products = await getAllProducts();

        //add open Cart To Cart
        const filteredProducts = openCarts.filter((product) => !product.sale);
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

          const sale = salesData.find(
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
      }
    }
    fetchOpenOrdersData();
  }, []);

  function getTotalPrice() {
    return cart.reduce((total, item) => {
      return total + item.product.price * item.quantity.toFixed(2);
    }, 0);
  }
  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    if (updatedCart.length === 0) {
      const user = JSON.parse(localStorage.getItem("user"));

      const user_id = user ? user.user_id : 0;
      const data = {
        user_id: user_id,
        products: [],
        total_price: 0,
      };
      saveOpenCart(data);
    }
    setCart(updatedCart);
  };

  useEffect(() => {
    if (cart.length === 0) {
      return;
    }
    const products = cart.map((item) => {
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

    saveOpenCart(data);
  }, [cart]);

  return (
    <>
      <NavbarClients />
      <Routes>
        <Route
          path="/products"
          element={
            <ProductList
              setCart={setCart}
              cart={cart}
              saleObject={saleObject}
              saleArray={saleArray}
              setSaleArray={setSaleArray}
            />
          }
        />
        <Route
          path="cart"
          element={
            <ShoppingCart
              cart={cart}
              removeFromCart={removeFromCart}
              setCart={setCart}
              saleObject={saleObject}
              saleArray={saleArray}
              setSaleArray={setSaleArray}
            />
          }
        />
        <Route
          path="/basiclist/"
          element={
            <BasicList
              cart={cart}
              setCart={setCart}
              saleObject={saleObject}
              saleArray={saleArray}
              setSaleArray={setSaleArray}
            />
          }
        />
        <Route path="/userdetails/" element={<UserProfilePage />} />
        <Route
          path="/historyorders/"
          element={
            <OrderHistoryClient
              cart={cart}
              setCart={setCart}
              saleObject={saleObject}
              saleArray={saleArray}
              setSaleArray={setSaleArray}
            />
          }
        />
      </Routes>
    </>
  );
}

export default ClientsPage;
