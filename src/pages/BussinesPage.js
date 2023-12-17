import BussinesCards from "../components/BussinesCards";
import NavbarBusiness from "../components/NavbarBussines";
import { Route, Routes } from "react-router-dom";
import InventoryBox from "../components/InventoryBox";
import OpenOrders from "../components/OpenOrders";
import ReadyOrders from "../components/ReadyOrders";
import OrderHistory from "../components/OrderHistory";
import React from "react";

function BussinesPage() {
  return (
    <>
      <NavbarBusiness />
      <Routes>
        <Route path="/" element={<BussinesCards />} />
        <Route path="/inventory-managment" element={<InventoryBox />} />
        <Route path="/open-orders" element={<OpenOrders />} />
        <Route path="/ready-orders" element={<ReadyOrders />} />
        <Route path="/order-history" element={<OrderHistory />} />
      </Routes>
    </>
  );
}

export default BussinesPage;
