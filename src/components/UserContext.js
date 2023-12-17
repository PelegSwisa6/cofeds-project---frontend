import React from "react";

const UserContext = React.createContext({
  user_id: 0,
  user: null,
  username: null,
  password: null,
  firstName: null,
  lastName: null,
  email: null,
  phone: null,
  address: null,
  is_employee: null,
  setUser: () => {},
});
export default UserContext;
