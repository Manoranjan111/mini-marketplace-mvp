import axiosInstance from "./api";

const signup = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axiosInstance.post("/buyer/signup", payload);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while signing up", errorMessage);
    return error.response?.data || error.message;
  }
};
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

const placeOrder = async (payload: {
  items: {
    productId: string;
    quantity: number;
  }[];
}) => {
  try {
    const response = await axiosInstance.post("/buyer/order", payload);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while placing order", errorMessage);
    return error.response?.data || error.message;
  }
};

const getOrders = async () => {
  try {
    const response = await axiosInstance.get("/buyer/order");
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while fetching orders", errorMessage);
    return error.response?.data || error.message;
  }
};

const getProducts = async (params: {
  search?: string;
  niche?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  try {
    const response = await axiosInstance.get("/buyer/product", { params });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data || error.message;
    console.error("Error while fetching products", errorMessage);
    return error.response?.data || error.message;
  }
};

export {
  signup,
  login,
  logout,
  placeOrder,
  getCurrentUser,
  removeSession,
  removeAllSessions,
  getOrders,
  getProducts,
};
