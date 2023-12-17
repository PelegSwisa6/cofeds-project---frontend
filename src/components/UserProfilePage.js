import React, { useState, useContext, useEffect } from "react";
import { TextField, Typography, Button, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  getAllUsers,
  getAllCustomizeuser,
  changeUserDetails,
} from "../api/api";

function UserProfilePage() {
  const [currentUser, setCurrentUser] = useState();
  const [detailsUser, setDetailsUser] = useState({});
  const [id, setId] = useState({});

  const [user, setUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
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

        setUser({
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phone: userDetails.phone,
          address: userDetails.address,
        });
      }
    }

    fetchData();
  }, []);
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

  const [editMode, setEditMode] = useState(false);

  const saveDetails = (editState) => {
    setEditMode(editState);
    const data = {
      UserId: id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
    };
    changeUserDetails(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditMode(false);
  };
  return (
    <>
      <div dir="rtl">
        <ThemeProvider theme={theme}>
          <Box
            sx={{ paddingTop: 3 }}
            display={"grid"}
            justifyContent={"center"}
          >
            <Typography
              variant="h5"
              align="center"
              sx={{
                color: "#1976d2",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              פרטים אישיים
            </Typography>
            <form onSubmit={handleSubmit}>
              <div>
                <TextField
                  label="שם משתמש"
                  name="username"
                  value={user.username}
                  size="small"
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />
              </div>
              <div>
                <TextField
                  label="שם פרטי"
                  name="firstName"
                  value={user.firstName}
                  size="small"
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />
              </div>
              <div>
                <TextField
                  label="שם משפחה"
                  name="lastName"
                  value={user.lastName}
                  size="small"
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />
              </div>
              <div>
                <TextField
                  label="כתובת אימייל"
                  name="email"
                  value={user.email}
                  size="small"
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />
              </div>
              <div>
                <TextField
                  label="טלפון"
                  name="phone"
                  value={user.phone}
                  size="small"
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />
              </div>
              <div>
                <TextField
                  label="כתובת מגורים"
                  name="address"
                  value={user.address}
                  size="small"
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: !editMode,
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <Button
                  variant="contained"
                  color={"primary"}
                  size="small"
                  onClick={() => saveDetails(!editMode)}
                >
                  {editMode ? "שמור" : "ערוך"}
                </Button>
              </div>
            </form>
          </Box>
        </ThemeProvider>
      </div>
    </>
  );
}

export default UserProfilePage;
