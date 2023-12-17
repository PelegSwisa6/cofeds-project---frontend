import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import { ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";

function NavbarClients(props) {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  return (
    <AppBar position="static" sx={{ backgroundColor: "light black" }}>
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        {!user ? (
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            <Link
              to="/loginbusiness"
              style={{
                color: "white",
                background: "light black",
                padding: "5px 10px",
                textDecoration: "none",
              }}
            >
              כניסה לעובדים
            </Link>
          </Typography>
        ) : (
          <h1></h1>
        )}
        <Typography variant="body1">
          <Link
            to="/clientpage/products"
            style={{
              color: "white",
              background: "light black",
              padding: "5px 10px",
              textDecoration: "none",
            }}
          >
            מוצרים
          </Link>
        </Typography>
        {user ? (
          <div>
            <Typography variant="body1" onClick={handleClick}>
              אזור אישי
            </Typography>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                component={Link}
                to="/clientpage/userdetails"
                dir="rtl"
                onClick={handleClose}
              >
                פרטים אישיים
              </MenuItem>
              <MenuItem
                component={Link}
                to="/clientpage/historyorders"
                dir="rtl"
                onClick={handleClose}
              >
                הסטוריית הזמנות
              </MenuItem>
              <MenuItem
                component={Link}
                to="/clientpage/basiclist"
                dir="rtl"
                onClick={handleClose}
              >
                הרשימה שלי
              </MenuItem>
              <MenuItem dir="rtl" onClick={logOut}>
                התנתקות
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <Typography variant="body1">
            <Link
              to="/loginpage"
              style={{
                color: "white",
                background: "light black",
                padding: "5px 10px",
                fontSize: "medium",
                textDecoration: "none",
              }}
            >
              התחברות/הרשמה
            </Link>
          </Typography>
        )}
        <Typography variant="body1" sx={{ ml: 2 }}>
          <Link to="/clientpage/cart">
            <Badge badgeContent={props.cartCount} color="secondary">
              <ShoppingCartIcon sx={{ fontSize: "30px", color: "white" }} />
            </Badge>
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default NavbarClients;
