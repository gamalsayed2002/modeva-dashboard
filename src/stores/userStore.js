import toast from "react-hot-toast";
import { create } from "zustand";
import axiosInstance from "./../lib/axios";

export const userStore = create((set, get) => ({
  user: null,
  loading: true,
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      set({ user: res.data.user, loading: false });
      toast.success("Login successful");
      // Return success status to handle navigation in the component
      return { success: true };
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      set({ loading: false });
      return { success: false, error: errorMessage };
    }
  },
  checkAuth: async () => {
    set({ loading: true });
    try {
      const { data } = await axiosInstance.get("/auth/profile", {
        withCredentials: true,
      });
      set({ user: data.user, loading: false });
     
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // حاول تعمل refresh
        try {
          await axiosInstance.get("/auth/refresh", { withCredentials: true });
          // بعد ما نجح، جرب تجيب البروفايل تاني
          const { data } = await axiosInstance.get("/auth/profile", {
            withCredentials: true,
          });
          set({ user: data.user, loading: false });
        } catch (refreshErr) {
          console.error("Refresh failed:", refreshErr);
          toast.error("Session expired. Please log in again.");
          set({ user: null, loading: false });
        }
      } else {
        set({ user: null, loading: false });
        toast.error("Session expired. Please log in again.");
      }
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });
      toast.success("Logout successful");
      get().redirect("/");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  },
  resetPassword: async (formData) => {
    try {
      const res = await axiosInstance.post("/auth/change-password", formData);
      if (!res.ok) throw new Error(res.data.message);
      toast.success("Password updated successfully ✅");
    } catch (err) {
      toast.error(err.message);
    }
  },

  updateUser: async (formData) => {
    try {
      set({ loading: true, error: null, successMessage: null });
      const res = await axiosInstance.put("/auth/profile", formData);

      set({
        user: res.data.user,
        successMessage: res.data.message,
        loading: false,
      });
      toast.success(res.data.message);
      return true;
    } catch (err) {
      console.error("updateUser error:", err);

      set({
        error: err.response?.data?.message || "Update failed",
        loading: false,
      });
      toast.error(err.response?.data?.message || "Update failed");
      return false;
    }
  },
}));
