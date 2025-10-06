import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

export const messagesStore = create((set) => ({
  messages: [],
  total: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  error: null,
  getMessages: async (page = 0, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/messages?page=${page}&limit=${limit}`);
      set({ 
        messages: res.data.messages,
        total: res.data.total,
        totalPages: res.data.totalPages,
        currentPage: res.data.currentPage,
        loading: false
      });
      return res.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch messages",
        loading: false,
      });
      toast.error(error.response?.data?.message || "Failed to fetch messages");
      throw error;
    }
  },
  deleteMessage: async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to delete this message!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        await axiosInstance.delete(`/messages/${id}`);
        set((state) => ({
          messages: state.messages.filter((message) => message._id !== id),
        }));
        toast.success("Message deleted successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  },
  searchMessages: async (query) => {
    try {
      const res = await axiosInstance.get(`/messages/search?query=${query}`);
      // toast.success(res.data.total + " results found");
      set({ 
        messages: res.data.messages,
        total: res.data.count,
        totalPages: 1,
        currentPage: 0,
        loading: false
      });
      return res.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to search messages");
    }
  },
}));