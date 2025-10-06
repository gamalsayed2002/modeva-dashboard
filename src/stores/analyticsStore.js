// store/useAnalyticsStore.js
import { create } from "zustand";
import axiosInstance from "./../lib/axios";

const analyticsStore = create((set) => ({
  analyticsData: {
    totalSales: 0,
    totalOrders: 0,
    users: 0,
    totalRevenue: 0,
  },
  dailySalesData: [],
  latestOrders: [],
  isLoading: false,

  getAnalytics: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/analytics");
      console.log("Analytics Response:", res.data);

      set({
        analyticsData: {
          ...res.data.analyticsData,
        },
        dailySalesData: res.data.dailySalesData || [],
        latestOrders: res.data.analyticsData.latestOrders || [], // ✅ هنا
      });
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default analyticsStore;
