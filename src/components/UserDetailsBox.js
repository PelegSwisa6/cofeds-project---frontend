import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { getAllOrders, getAllCustomizeuser, getAllUsers } from "../api/api";

function UserDetailsBox({ onSubmit, cart }) {
  const [currentUser, setCurrentUser] = useState();
  const [detailsUser, setDetailsUser] = useState({});
  const [id, setId] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [collectionTime, setCollectionTime] = useState("");
  const numOfProducts = cart.length;
  const prepartionTToOrder = Math.ceil((numOfProducts * 30) / 60);
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const [totalPreparationTime, setTotalPreparationTime] = useState(0);
  const finePreparationTToOrder =
    prepartionTToOrder + 10 + totalPreparationTime;

  useEffect(() => {
    async function fetchOpenOrdersData() {
      const orders = await getAllOrders();
      const openOrdersData = orders.filter((order) => order.order_state === 0);
      const sumTime = openOrdersData.reduce((sum, order) => {
        return sum + order.preparation_time;
      }, 0);
      setTotalPreparationTime(sumTime);
    }
    fetchOpenOrdersData();
    async function fetchData() {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        const id = storedUser.user_id;
        setId(id);
        const usersData = await getAllUsers();
        const usersDetails = await getAllCustomizeuser();

        const user = usersData.find((user) => user.id === id);
        const userDetails = usersDetails.find(
          (detail) => detail.user_id === id
        );

        setCurrentUser(user);
        setDetailsUser(userDetails);
        setName(user.first_name);
        setEmail(user.email);
        setPhoneNumber(userDetails.phone);
      }
    }
    fetchData();
  }, []);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleCollectionTimeChange = (event) => {
    setCollectionTime(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const userDetails = {
      name,
      email,
      phoneNumber,
      collectionTime,
      prepartionTToOrder,
    };
    onSubmit(userDetails);
  };

  const timeOptions = [];
  for (let i = currentHour; i <= 22; i++) {
    let startMinute = 0;
    if (i === currentHour) {
      startMinute = Math.ceil(currentMinute / 15) * 15;
    }

    for (let j = startMinute; j < 60; j += 15) {
      const totalMinutes = (i - currentHour) * 60 + (j - currentMinute);
      if (totalMinutes >= finePreparationTToOrder) {
        const timeString = `${i < 10 ? "0" + i : i}:${j < 10 ? "0" + j : j}`;
        const key = `${i}-${j}`;
        timeOptions.push(
          <MenuItem key={key} value={timeString}>
            {timeString}
          </MenuItem>
        );
      }
    }
  }

  return (

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, dir: "rtl" }}>
          <form onSubmit={handleSubmit}  style={{ display: "flex", flexDirection: "column", gap: 2, direction: "rtl" }}>
          <TextField
              required
              placeholder="שם מלא"
              value={name}
              onChange={handleNameChange}
              InputLabelProps={{ dir: "rtl" }}
              dir="rtl"
          />

          <TextField
              required
              placeholder="אימייל"
              dir="rtl"
              type="email"
              value={email}
              onChange={handleEmailChange}
          />
          <TextField
              required
              inputProps={{
                pattern: '[0-9]{3}[0-9]{3}[0-9]{4}',
              }}
              placeholder="טלפון"
              dir="rtl"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
          />
          <InputLabel required dir="rtl"> אנא בחר שעת איסוף</InputLabel>
          <Select
              required
              value={collectionTime}
              onChange={handleCollectionTimeChange}
              dir="rtl"
          >
            {timeOptions}
          </Select>
          <Button type="submit" variant="contained" >
            שלח פרטים
          </Button>
        </form>
        </Box>

  );
}

export default UserDetailsBox;
