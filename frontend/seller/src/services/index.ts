import axiosInstance from "./api";

const login = async (payload: {
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const response = await axiosInstance.post("/auth", payload);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while logging in", errorMessage);
    return error.response?.data || error.message;
  }
};

const logout = async () => {
  try {
    const response = await axiosInstance.get("/auth/logout");
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while logging out", errorMessage);
    return error.response?.data || error.message;
  }
};
const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/auth");
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while fetching current user", errorMessage);
    return error.response?.data || error.message;
  }
};

const removeSession = async (sessionId: string) => {
  try {
    const response = await axiosInstance.delete(`/auth/session/${sessionId}`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while removing session", errorMessage);
    return error.response?.data || error.message;
  }
};

const removeAllSessions = async () => {
  try {
    const response = await axiosInstance.delete("/auth/session");
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while removing all sessions", errorMessage);
    return error.response?.data || error.message;
  }
};

const getOrders = async () => {
  try {
    const response = await axiosInstance.get("/seller/order");
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while fetching orders", errorMessage);
    return error.response?.data || error.message;
  }
};
const getOrderDetails = async (orderId: string) => {
  try {
    const response = await axiosInstance.get(`/seller/order/${orderId}`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while fetching order details", errorMessage);
    return error.response?.data || error.message;
  }
};

const getProducts = async () => {
  try {
    const response = await axiosInstance.get("/seller/product");
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while fetching products", errorMessage);
    return error.response?.data || error.message;
  }
};
const addProduct = async (data: FormData) => {
  try {
    const response = await axiosInstance.post("/seller/product", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while adding product", errorMessage);
    return error.response?.data || error.message;
  }
};

const deleteProduct = async (productId: string) => {
  try {
    const response = await axiosInstance.delete(`/seller/product/${productId}`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while deleting product", errorMessage);
    return error.response?.data || error.message;
  }
};

const getDashboardData = async () => {
  try {
    const response = await axiosInstance.get("/seller/dashboard");
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while fetching dashboard", errorMessage);
    return error.response?.data || error.message;
  }
};

export {
  login,
  logout,
  getCurrentUser,
  removeSession,
  removeAllSessions,
  getProducts,
  addProduct,
  getOrders,
  getOrderDetails,
  getDashboardData,
  deleteProduct,
};
