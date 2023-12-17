import React, { useState, useContext, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import BussinesPage from "./pages/BussinesPage";
import ClientsPage from "./pages/ClientsPage";
import Login from "./components/Login";
import Singup from "./components/Singup";
import LoginEmployee from "./components/LoginEmployee";

import UserContext from "./components/UserContext";

function App() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId, user, setUser }}>
      <Routes>
        <Route path="/" element={<Navigate to="/clientpage/products" />} />
        {user && user.is_employee && (
          <Route path="/businesspage/*" element={<BussinesPage />} />
        )}
        <Route path="/loginpage" element={<Login setUser={setUser} />} />
        <Route
          path="/loginbusiness"
          element={<LoginEmployee setUser={setUser} />}
        />
        <Route path="/Singup/*" element={<Singup />} />
        <Route path="/clientpage/*" element={<ClientsPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
