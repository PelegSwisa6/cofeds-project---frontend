import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SingupData } from "../api/api";
import NavbarClients from "./NavbarClients";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

function Singup() {
  const [passalert, setpassalert] = useState("");
  const [repassword, resetPassword] = useState("");
  const [address, setaddress] = useState("");
  const [number, setnumber] = useState("");
  const [alert, setalert] = useState("");
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const con = function () {
    return (
      user.password === repassword &&
      (repassword != null || repassword.length < 5)
    );
  };

  useEffect(() => {
    if (con()) {
      setpassalert("");
    } else {
      setpassalert(
        <Alert variant="outlined" severity="error">
          הסיסמאות אינם תואמות או קצרות מידי{" "}
        </Alert>
      );
    }
  }, [user.password, repassword]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const name = e.target.id;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  function handleSubmitSignup(e) {
    e.preventDefault();
    if (con()) {
      SingupData(user, address, number)
        .then((response) => {
          setalert(
            <Alert variant="outlined" severity="success" dir="rtl">
              {" "}
              ההרשמה התקבלה,אנא הפעל חשבונך דרך הלינק במייל זה{" "}
            </Alert>
          );
        })
        .catch((error) => {
          console.log(error);
          setalert(
            <Alert variant="outlined" severity="error" dir="rtl">
              {" "}
              {error}{" "}
            </Alert>
          );
        });
    }
  }

  return (
    <>
      <NavbarClients></NavbarClients>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            padding: "2rem",
            borderRadius: "0.5rem",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
          {passalert}
          <Typography
            variant="h5"
            sx={{
              marginBottom: "2rem",
              color: "#1976d2",
              display: "flex",
              alignItems: "center",
            }}
          >
            טופס הרשמה
          </Typography>
          <form onSubmit={handleSubmitSignup}>
            <TextField
              id="username"
              placeholder="שם משתמש"
              dir="rtl"
              type="text"
              required
              fullWidth
              margin="normal"
              value={user.username}
              onChange={handleInputChange}
            />
            <TextField
              id="password"
              placeholder="סיסמא"
              dir="rtl"
              type="password"
              required
              fullWidth
              margin="normal"
              value={user.password}
              onChange={handleInputChange}
            />
            <TextField
              id="repassword"
              placeholder="סיסמא חוזרת"
              dir="rtl"
              type="password"
              required
              fullWidth
              margin="normal"
              value={repassword}
              onChange={(event) => {
                resetPassword(event.target.value);
              }}
            />

            <TextField
              id="first_name"
              placeholder="שם פרטי"
              dir="rtl"
              type="text"
              required
              fullWidth
              margin="normal"
              value={user.first_name}
              onChange={handleInputChange}
            />
            <TextField
              id="last_name"
              placeholder="שם משפחה"
              dir="rtl"
              type="text"
              required
              fullWidth
              margin="normal"
              value={user.last_name}
              onChange={handleInputChange}
            />
            <TextField
              id="email"
              placeholder="מייל"
              dir="rtl"
              type="email"
              required
              fullWidth
              margin="normal"
              value={user.email}
              onChange={(event) => {
                handleInputChange(event);
              }}
            />
            <TextField
              id="address"
              placeholder="כתובת"
              dir="rtl"
              type="address"
              required
              fullWidth
              margin="normal"
              value={address}
              onChange={(event) => {
                setaddress(event.target.value);
              }}
            />
            <TextField
              id="number"
              placeholder="טלפון"
              dir="rtl"
              type="tel"
              inputProps={{
                pattern: "[0-9]{3}[0-9]{3}[0-9]{4}",
              }}
              required
              fullWidth
              margin="normal"
              value={number}
              onChange={(event) => {
                setnumber(event.target.value);
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: "1rem", backgroundColor: "#1976d2" }}
            >
              הרשמה
            </Button>
            {alert}
          </form>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default Singup;
