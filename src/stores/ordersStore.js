import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../lib/axios";

export const ordersStore = create((set) => ({
  orders: [],
  total: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
  order: {},
  // Get all orders
  getOrders: async (page = 0, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/orders?page=${page}&limit=${limit}`);
      set({ 
        orders: data.data,
        total: data.total,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        loading: false
      });
      return data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch orders";
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    if (!orderId) return null;

    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/orders/${orderId}`);
      set({ loading: false });
      set({ order: data.data });
      return data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to fetch order";
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Search orders
  searchOrders: async (query, status) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/orders/search?query=${encodeURIComponent(query)}${
          status ? `&status=${status}` : ""
        }`
      );
      set({ 
        orders: data.data,
        total: data.count,
        totalPages: 1,
        currentPage: 0,
        loading: false
      });
      return data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to search orders";
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Create order
  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.post("/orders", orderData);
      set((state) => ({
        orders: [data.data, ...state.orders],
        loading: false,
      }));
      toast.success("Order created successfully");
      return data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to create order";
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));