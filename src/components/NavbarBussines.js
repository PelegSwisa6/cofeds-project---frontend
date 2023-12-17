import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@mui/material";

function NavbarBusiness(props) {
  return (
    <AppBar position="static" sx={{ backgroundColor: "light black" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link
            to="/businesspage"
            style={{
              color: "white",
              background: "light black",
              padding: "5px 10px",
            }}
          >
            עמוד הבית
          </Link>
        </Typography>
        <Typography variant="h6">
          <Link
            to="/businesspage/inventory-managment"
            style={{
              color: "white",
              background: "light black",
              padding: "5px 10px",
            }}
          >
            ניהול מלאי
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default NavbarBusiness;
