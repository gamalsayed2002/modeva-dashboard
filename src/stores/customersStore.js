import { create } from "zustand";
import axiosInstance from "../lib/axios";

const useUsersStore = create((set) => ({
  users: [],
  total: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  selectedUser: null,

  // Get all users
  getUsers: async (page = 0, limit = 10) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get(
        `/auth/users?page=${page}&limit=${limit}`
      );
      set({
        users: res.data.users,
        total: res.data.total,
        totalPages: res.data.totalPages,
        currentPage: res.data.currentPage,
        loading: false,
      });
    } catch (err) {
      console.error("Error fetching users:", err);
      set({ loading: false });
    }
  },

  // Search users
  searchUsers: async (query) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get(`/auth/users/search?query=${query}`);
      set({
        users: res.data.users,
        total: res.data.count,
        totalPages: 1,
        currentPage: 0,
        loading: false,
      });
    } catch (err) {
      console.error("Error searching users:", err);
      set({ loading: false });
    }
  },

  // Get user with orders
  fetchUserWithOrders: async (id) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get(`/auth/users/${id}/orders`);
      set({
        selectedUser: res.data.data,
        loading: false,
      });
    } catch (err) {
      console.error("Error fetching user with orders:", err);
      set({ loading: false });
    }
  },

  // Reset selected user
  clearSelectedUser: () => set({ selectedUser: null }),
}));

export default useUsersStore;
