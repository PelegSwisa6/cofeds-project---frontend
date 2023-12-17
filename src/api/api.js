import axios from "axios";

const baseURL = "/api";

// Set the CSRF token in the Axios headers
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

// Example of a cross-cutting concern - client api error-handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("got error");
    console.error(error);

    throw error;
  }
);

export async function getAllProducts() {
  const response = await axios.get(`${baseURL}/products/`);
  const allProductsData = response.data;
  return allProductsData;
}

export async function getAllUsers() {
  const response = await axios.get(`${baseURL}/users/`);
  const allUsersData = response.data;
  return allUsersData;
}
export async function getAllCustomizeuser() {
  const response = await axios.get(`${baseURL}/getcustomizeuser/`);
  const allDetailsData = response.data;
  return allDetailsData;
}
export const changeUserDetails = (data) => {
  return axios
    .post(`${baseURL}/changeuserdetails/`, data)
    .then((response) => {
      return response.data;
      ////console.log(response.data);
    })
    .catch((error) => {
      throw error.response.data.message;
    });
};

export async function getAllCategories() {
  const response = await axios.get(`${baseURL}/category/`);
  const allCategoriesData = response.data;
  return allCategoriesData;
}

export async function getAllSuppliers() {
  const response = await axios.get(`${baseURL}/supplier/`);
  const allSuppliersData = response.data;
  return allSuppliersData;
}

export async function updateProductQuantity(productId, quantity) {
  const response = await axios.put(
    `${baseURL}/products/${productId}/update_quantity/`,
    {
      quantity,
    }
  );

  const data = response.data;
  return data;
}

export const getAllOrders = async () => {
  const response = await axios.get(`${baseURL}/orders/`);
  const allOrdersData = response.data;
  return allOrdersData;
};
export const getAllSales = async () => {
  const response = await axios.get(`${baseURL}/sales/`);
  const allOrdersData = response.data;
  return allOrdersData;
};

export const getOpenCart = async () => {
  const response = await axios.get(`${baseURL}/opencartview/`);
  const allOpenCart = response.data;
  return allOpenCart;
};

export const getBasicCart = async () => {
  const response = await axios.get(`${baseURL}/basiccartview/`);
  const allBasicCart = response.data;
  return allBasicCart;
};

export const getInventoryByDate = async (data) => {
  const response = await axios.get(`${baseURL}/outcomingstock/`, data);
  const invetoryByDate = response.data;
  return invetoryByDate;
};

export const getSupplierOrder = async (data) => {
  const response = await axios.get(`${baseURL}/supplierorder/`, data);
  const invetoryByDate = response.data;
  return invetoryByDate;
};

export const SingupData = (user, address, number) => {
  return axios
    .post(`${baseURL}/customizeuser/`, {
      user,
      address,
      phone: number,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data.message;
    });
};
export const addOrUpdateProduct = (data) => {
  return axios
    .post(`${baseURL}/products/${data.productCode}/`, data)
    .then((response) => {
      return response.data;
      ////console.log(response.data);
    })
    .catch((error) => {
      throw error.response.data.message;
    });
};

export const addProduct = (data) => {
  return axios
    .post(`${baseURL}/addproducts/${data.productCode}/`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data.message;
    });
};

export const addOrUpdateCategory = (data) => {
  return axios
    .post(`${baseURL}/addcategory/`, data)
    .then((response) => {
      return response.data;
      ////console.log(response.data);
    })
    .catch((error) => {
      throw error.response.data.message;
    });
};

export const addOrUpdateSupplier = (data) => {
  return axios
    .post(`${baseURL}/addsupplier/`, data)
    .then((response) => {
      return response.data;
      ////console.log(response.data);
    })
    .catch((error) => {
      throw error.response.data.message;
    });
};

const service = {
  updateProductQuantity,
};

export const addOrUpdateSale = (data) => {
  return axios
    .post(`${baseURL}/addsale/`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data.message;
    });
};

export const addProductToSale = (data) => {
  return axios
    .post(`${baseURL}/addproductstosale/`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data.message;
    });
};
export const changeOrderState = (data) => {
  axios
    .post(`${baseURL}/updateorder/`, data)
    .then((response) => {
      //console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const createOrder = (data) => {
  return axios
    .post(`${baseURL}/order/`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data.message;
    });
};

export const saveOpenCart = (data) => {
  return axios
    .post(`${baseURL}/opencart/`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data.message;
    });
};

export const saveBasicCart = (data) => {
  return axios
    .post(`${baseURL}/basiccart/`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data.message;
    });
};

export const login = async (username, password) => {
  const response = await fetch(`${baseURL}/checkuser/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const data = await response.json();
    const group = data.group;
    const id = data.id;

    if (group === "client") {
      return {
        success: true,
        target: "/",
        message: "ClientUser",
        user: username,
        user_id: id,
      };
    } else if (group === "employee") {
      return {
        success: true,
        target: "/businesspage",
        message: "BusinessUser",
        user: username,
        user_id: id,
      };
    }
  } else {
    return {
      success: false,
      target: "/",
      message: "אחד מהפרטים או יותר אינם נכונים",
      username: username,
    };
  }
};

export default service;
