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
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { getAllOrders } from "../api/api";

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOpenOrdersData() {
      const orders = await getAllOrders();
      const openOrdersData = orders.filter((order) => order.order_state === 2);
      const initialExpandedState = openOrdersData.map(() => false);
      setOrders(
        openOrdersData.map((order, index) => ({
          ...order,
          expanded: initialExpandedState[index],
        }))
      );
    }
    fetchOpenOrdersData();
  }, []);

  const handleExpandClick = (index) => () => {
    setOrders((prevOrders) =>
      prevOrders.map((order, i) =>
        i === index ? { ...order, expanded: !order.expanded } : order
      )
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="right">מחיר כולל</TableCell>
            <TableCell align="right">רשימת מוצרים</TableCell>
            <TableCell align="right">פרטי לקוח</TableCell>
            <TableCell align="right">מס הזמנה</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={order.order_id}>
              <TableCell align="right">{order.price}</TableCell>
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
                    <table>
                      <thead>
                        <tr>
                          <th>כמות</th>
                          <th>שם</th>
                        </tr>
                      </thead>
                      <tbody>
                        {JSON.parse(order.product_list).map((product) => (
                          <tr key={product.id}>
                            <td>{product.quantity}</td>
                            <td>{product.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </AccordionDetails>
                </Accordion>
              </TableCell>
              <TableCell align="right">
                <Accordion expanded={order.expanded}>
                  <AccordionSummary
                    expandIcon={<KeyboardArrowDownIcon />}
                    onClick={handleExpandClick(index)}
                    dir="rtl"
                  >
                    <Typography>הצג פרטי לקוח</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {order.user_details !== null && (
                      <TableContainer component={Paper} dir="rtl">
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell align="right">מס'</TableCell>
                              <TableCell align="right">שם</TableCell>
                              <TableCell align="right">אימייל</TableCell>
                              <TableCell align="right">טלפון</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell align="right">
                                {order.user_id}
                              </TableCell>
                              <TableCell dir="rtl">
                                {JSON.parse(order.user_details).name}
                              </TableCell>
                              <TableCell>
                                {JSON.parse(order.user_details).email}
                              </TableCell>
                              <TableCell>
                                {JSON.parse(order.user_details).phoneNumber}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </AccordionDetails>
                </Accordion>
              </TableCell>
              <TableCell align="right">{order.id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default OrderHistory;
