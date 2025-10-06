import toast from "react-hot-toast";
import { create } from "zustand";
import axiosInstance from "../lib/axios";
import Swal from "sweetalert2";

export const productStore = create((set) => ({
  products: [],
  product: {},
  loading: false,
  error: null,
  totalPages: 0,
  total: 0,
  // Get all products
  getProducts: async (page = 0, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/products?page=${page}&limit=${limit}`
      );
      set({
        products: data.data,
        loading: false,
        totalPages: data.totalPages,
        total: data.total,
      });

      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch products",
        loading: false,
      });
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/products/${id}`);
      set({ product: data.data, loading: false });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch product",
        loading: false,
      });
      toast.error(error.response?.data?.message || "Failed to fetch product");
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/products/${id}`);
        set((state) => ({
          products: state.products.filter((product) => product._id !== id),
          product:
            state.product && state.product._id === id ? null : state.product,
        }));
        toast.success("Product deleted successfully");
      } catch (error) {
        set({
          error: error.response?.data?.message || "Failed to delete product",
          loading: false,
        });
        toast.error(
          error.response?.data?.message || "Failed to delete product"
        );
      }
    }
  },

  // Create product
  createProduct: async (formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        products: [...state.products, data.data],
      }));
      toast.success("Product created successfully");
      set({ loading: false });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create product",
        loading: false,
      });
      toast.error(error.response?.data?.message || "Failed to create product");
      throw error;
    }
  },

  // Search products
  searchProducts: async (query) => {
    try {
      const { data } = await axiosInstance.get(
        `/products/search?query=${query}`
      );
      set({ products: data.data, loading: false });
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to search products",
        loading: false,
      });
      toast.error(error.response?.data?.message || "Failed to search products");
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    set({ loading: true, error: null });
    try {
      let url = `/products/category?category=${categoryId}`;
      const { data } = await axiosInstance.get(url);
      set({ products: data.data, loading: false });
      return data.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch products by category",
        loading: false,
      });
      toast.error(
        error.response?.data?.message || "Failed to fetch products by category"
      );
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({
        products: state.products.map((p) => (p._id === id ? data.data : p)),
        product:
          state.product && state.product._id === id ? data.data : state.product,
      }));
      set({ loading: false });

      toast.success("Product updated successfully");
      return data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update product",
        loading: false,
      });
      toast.error(error.response?.data?.message || "Failed to update product");
      throw error;
    }
  },

  // Toggle product isFeatured
  toggleProductFeatured: async (id) => {
    try {
      const { data } = await axiosInstance.patch(`/products/${id}/toggle-featured`);
      set((state) => ({
        products: state.products.map((p) => (p._id === id ? data.data : p)),
        product:
          state.product && state.product._id === id ? data.data : state.product,
      }));
      toast.success("Product isFeatured toggled");
      
      return data.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error toggling product isFeatured",
      });
      toast.error(
        error.response?.data?.message || "Error toggling product isFeatured"
      );
      throw error;
    }
  },

  // Toggle product customized
  toggleProductCustomized: async (id) => {
    try {
      const { data } = await axiosInstance.patch(`/products/${id}/toggle-customized`);
      set((state) => ({
        products: state.products.map((p) => (p._id === id ? data.data : p)),
        product:
          state.product && state.product._id === id ? data.data : state.product,
      }));
      toast.success("Product customized toggled");
      return data.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error toggling product customized",
      });
      toast.error(
        error.response?.data?.message || "Error toggling product customized"
      );
      throw error;
    }
  },

  // Delete Sub Image
  deleteProductSubImage: async (productId, imageIndex) => {
    console.log(productId, imageIndex);
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.delete(
        `/products/${productId}/subimages/${imageIndex}`
      );

      set({ product: res.data.data });
      window.location.reload();
      toast.success("Sub Image deleted successfully");

      set((state) => {
        // تحديث الـ products list
        const updatedProducts = state.products.map((p) =>
          p._id === productId ? { ...p, subImages: res.data.data.subImages } : p
        );

        // تحديث المنتج الحالي لو مفتوح
        const updatedProduct =
          state.product && state.product._id === productId
            ? { ...state.product, subImages: res.data.data.subImages }
            : state.product;

        return {
          products: updatedProducts,
          product: updatedProduct,
          loading: false,
        };
      });

      return res.data;
    } catch (err) {
      console.error("Error deleting sub image:", err);
      toast.error(err.response?.data?.message || "Error deleting sub image");
      set({
        error: err.response?.data?.message || "Error deleting sub image",
        loading: false,
      });
      throw err;
    }
  },
}));
