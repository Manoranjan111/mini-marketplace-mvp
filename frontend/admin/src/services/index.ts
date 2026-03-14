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
    const response = await axiosInstance.get("/admin/order");
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while fetching orders", errorMessage);
    return error.response?.data || error.message;
  }
};
const getOrderDetails = async (orderId: string) => {
  try {
    const response = await axiosInstance.get(`/admin/order/${orderId}`);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while fetching order details", errorMessage);
    return error.response?.data || error.message;
  }
};

const getProducts = async () => {
  try {
    const response = await axiosInstance.get("/admin/product");
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while fetching products", errorMessage);
    return error.response?.data || error.message;
  }
};

const getDashboardData = async () => {
  try {
    const response = await axiosInstance.get("/admin/dashboard");
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while fetching dashboard", errorMessage);
    return error.response?.data || error.message;
  }
};

const getBuyers = async () => {
  try {
    const response = await axiosInstance.get("/admin/buyer");
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while fetching buyers", errorMessage);
    return error.response?.data || error.message;
  }
};

const getSellers = async () => {
  try {
    const response = await axiosInstance.get("/admin/seller");
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while fetching sellers", errorMessage);
    return error.response?.data || error.message;
  }
};

const addSeller = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post("/admin/seller", payload);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while adding seller", errorMessage);
    return error.response?.data || error.message;
  }
};

const getAdmins = async () => {
  try {
    const response = await axiosInstance.get("/admin");
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while fetching admins", errorMessage);
    return error.response?.data || error.message;
  }
};

const addAdmin = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post("/admin", payload);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while adding admin", errorMessage);
    return error.response?.data || error.message;
  }
};

const changeOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await axiosInstance.patch(`/admin/order/${orderId}`, {
      status,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while changing order status", errorMessage);
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
  getOrders,
  getOrderDetails,
  getDashboardData,
  getBuyers,
  getSellers,
  addSeller,
  getAdmins,
  addAdmin,
  changeOrderStatus,
};
