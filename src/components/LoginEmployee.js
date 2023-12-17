import React, { useState, useContext } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";
import UserContext from "./UserContext";
import NavbarClients from "./NavbarClients";

function LoginEmployee() {
  const [username, setUsername] = useState("cofeds");
  const [password, setPassword] = useState("123456!");
  const { setUser } = useContext(UserContext) ?? {};
  const navigate = useNavigate();

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

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { success, target, message } = await login(username, password);
    if (message === "BusinessUser") {
      setUser({ username, password, is_employee: true });
    }
    if (success) {
      // localStorage.setItem("user", JSON.stringify({ username, user_id }));
      navigate(target);
    } else {
    }
  };

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
          <Typography
            variant="h5"
            sx={{
              marginBottom: "2rem",
              color: "#1976d2",
              display: "flex",
              alignItems: "center",
            }}
          >
            Co-fed's
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              id="username"
              placeholder="שם משתמש"
              dir="rtl"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              id="password"
              placeholder="סיסמה"
              dir="rtl"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: "1rem", backgroundColor: "#1976d2" }}
            >
              התחבר
            </Button>
          </form>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default LoginEmployee;
