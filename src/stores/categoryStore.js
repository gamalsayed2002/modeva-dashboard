// src/stores/categoryStore.js
import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

export const categoryStore = create((set) => ({
  categories: [],
  total: 0,
  totalPages: 0,
  currentPage: 0,
  currentCategory: null,
  loading: false,
  error: null,

  // Get all categories
  getCategories: async (page = 0, limit = 10, pagination = true) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/categories?page=${page}&limit=${limit}&pagination=${pagination}`
      );
      console.log(data);
      set({
        categories: data.data,
        total: data.total,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        loading: false,
      });
      return data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch categories";
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: async (categoryId) => {
    if (!categoryId) return null;

    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/categories/${categoryId}`);
      set({ currentCategory: data.data, loading: false });
      return data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch category";
      set({ error: errorMsg, loading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // Create new category (dialog)
  createCategory: async (formValues) => {
    try {
      // If no formValues provided, show the Swal modal
      if (!formValues) {
        const { value: modalFormValues } = await Swal.fire({
          title: "Create New Category",
          html:
            '<div class="swal2-form">' +
            '  <div class="form-group">' +
            '    <label for="en">English Name</label>' +
            '    <input id="en" class="swal2-input" placeholder="Enter name in English" required>' +
            "  </div>" +
            '  <div class="form-group" style="margin-top: 15px">' +
            '    <label for="ar">Arabic Name</label>' +
            '    <input id="ar" class="swal2-input" dir="rtl" placeholder="أدخل الاسم بالعربية" required>' +
            "  </div>" +
            "</div>",
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: "Create Category",
          cancelButtonText: "Cancel",
          showLoaderOnConfirm: true,
          preConfirm: () => {
            const en = document.getElementById("en").value.trim();
            const ar = document.getElementById("ar").value.trim();
            if (!en || !ar) {
              Swal.showValidationMessage(
                "Please enter names in both languages"
              );
              return false;
            }
            return { name: en, nameAr: ar };
          },
          allowOutsideClick: () => !Swal.isLoading(),
          didOpen: () => {
            const style = document.createElement("style");
            style.textContent = `
              .swal2-form { text-align: left; width: 100%; padding: 0 10px; }
              .form-group { margin-bottom: 1rem; width: 100%; }
              .form-group label { display:block; margin-bottom:.5rem; font-weight:500; color:#555; }
              .swal2-input { width:100%!important; margin:.5rem 0!important; border:1px solid #ddd!important; border-radius:4px!important; padding:8px 12px!important; }
              .swal2-input:focus { border-color: var(--primaryBtnBg)!important; box-shadow:0 0 0 2px rgba(66,153,225,.2)!important; }
            `;
            document.head.appendChild(style);
          },
        });

        // If user cancelled the modal, return
        if (!modalFormValues) return null;

        // Use the values from modal
        formValues = modalFormValues;
      }

      set({ loading: true, error: null });
      const { data } = await axiosInstance.post("/categories", formValues);
      set((state) => ({
        categories: [...state.categories, data.data],
        loading: false,
      }));
      toast.success("Category created successfully");
      return data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to create category";
      set({ error: errorMsg, loading: false });
      if (error.response?.data?.message) {
        Swal.fire({
          title: "Error",
          text: error.response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        toast.error(errorMsg);
      }
      throw error;
    }
  },

  // Update category
  updateCategory: async (categoryId, updateData) => {
    // If no updateData provided, show the Swal modal
    if (!updateData) {
      // First get the current category data to populate the form
      const currentState = categoryStore.getState();
      let category = currentState.categories.find((c) => c._id === categoryId);

      // If not found in current state, fetch it
      if (!category) {
        try {
          const response = await axiosInstance.get(`/categories/${categoryId}`);
          category = response.data.data;
        } catch (error) {
          toast.error("Failed to fetch category data");
          throw error;
        }
      }

      const { value: formValues } = await Swal.fire({
        title: "Edit Category",
        html:
          `<div class="swal2-form">` +
          `<div class="form-group">` +
          `<label for="en">English Name</label>` +
          `<input id="en" class="swal2-input" placeholder="Enter name in English" value="${
            category.name || ""
          }" required>` +
          `</div>` +
          `<div class="form-group" style="margin-top: 15px">` +
          `<label for="ar">Arabic Name</label>` +
          `<input id="ar" class="swal2-input" dir="rtl" placeholder="أدخل الاسم بالعربية" value="${
            category.nameAr || ""
          }" required>` +
          `</div>` +
          `</div>`,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Update Category",
        showLoaderOnConfirm: true,
        preConfirm: () => {
          const en = document.getElementById("en").value.trim();
          const ar = document.getElementById("ar").value.trim();
          if (!en || !ar) {
            Swal.showValidationMessage("Please enter names in both languages");
            return false;
          }
          return { name: en, nameAr: ar };
        },
        allowOutsideClick: () => !Swal.isLoading(),
        didOpen: () => {
          const style = document.createElement("style");
          style.textContent = `
            .swal2-form { text-align: left; width: 100%; padding: 0 10px; }
            .form-group { margin-bottom: 1rem; width: 100%; }
            .form-group label { display:block; margin-bottom:.5rem; font-weight:500; color:#555; }
            .swal2-input { width:100%!important; margin:.5rem 0!important; border:1px solid #ddd!important; border-radius:4px!important; padding:8px 12px!important; }
            .swal2-input:focus { border-color: var(--primaryBtnBg)!important; box-shadow:0 0 0 2px rgba(66,153,225,.2)!important; }
          `;
          document.head.appendChild(style);
        },
      });

      // If user cancelled the modal, return
      if (!formValues) return null;

      // Use the values from modal
      updateData = formValues;
    }

    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.put(
        `/categories/${categoryId}`,
        updateData
      );

      set((state) => ({
        categories: state.categories.map((cat) =>
          cat._id === categoryId ? { ...cat, ...data.data } : cat
        ),
        currentCategory:
          state.currentCategory && state.currentCategory._id === categoryId
            ? { ...state.currentCategory, ...data.data }
            : state.currentCategory,
        loading: false,
      }));

      toast.success("Category updated successfully");
      return data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to update category";
      set({ error: errorMsg, loading: false });
      if (error.response?.data?.message) {
        Swal.fire({
          title: "Error",
          text: error.response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        toast.error(errorMsg);
      }
      throw error;
    }
  },

  // Delete category with confirmation dialog
  deleteCategory: async (categoryId) => {
    const currentState = categoryStore.getState();
    const category = currentState.categories.find((c) => c._id === categoryId);
    if (!category) return false;

    const result = await Swal.fire({
      title: "Delete Category",
      html: `Are you sure you want to delete <strong>${
        category.name || "this category"
      }</strong>?<br>This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        confirmButton: "swal2-confirm",
        cancelButton: "swal2-cancel",
        popup: "swal2-popup-custom",
      },
    });

    if (!result.isConfirmed) return false;

    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/categories/${categoryId}`);
      set((state) => ({
        categories: state.categories.filter((cat) => cat._id !== categoryId),
        loading: false,
        currentCategory:
          state.currentCategory && state.currentCategory._id === categoryId
            ? null
            : state.currentCategory,
      }));
      toast.success("Category deleted successfully");
      return true;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete category";
      set({ error: errorMsg, loading: false });
      await Swal.fire({
        title: "Error",
        text: errorMsg,
        icon: "error",
        confirmButtonText: "OK",
      });
      throw error;
    }
  },

  // Search categories
  searchCategories: async (query) => {
    if (!query.trim()) {
      return categoryStore.getState().getCategories();
    }
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/categories/search?query=${encodeURIComponent(query)}`
      );
      set({
        categories: data.data,
        total: data.count,
        totalPages: 1,
        currentPage: 0,
        loading: false,
      });
      return data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to search categories";
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Clear current category
  clearCurrentCategory: () => set({ currentCategory: null }),
}));
