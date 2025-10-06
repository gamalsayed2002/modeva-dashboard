import { useEffect } from "react";
import { Link } from "react-router-dom";
import { categoryStore } from "../../stores/categoryStore";
import styles from "./categories.module.css";
import MainSearchInput from "../../components/mainSearchInput/MainSearchInput";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Categories() {
  const {
    categories,
    getCategories,
    deleteCategory,
    createCategory,
    updateCategory,
    totalPages,
  } = categoryStore();
  const [page, setPage] = useState(0);

  useEffect(() => {
    getCategories(page);
  }, [page]);



  const handleEditCategory = async (category) => {
    try {
      await updateCategory(category._id);
      // Refresh the categories list
      getCategories(page);
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleCreateCategory = async () => {
    try {
      await createCategory();
      // Refresh the categories list
      getCategories(page);
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  return (
    <section>
      <div className={`between ${styles.header}`}>
        <h2 className={`titleText ${styles.title}`}>Categories</h2>
        <span
          className={`secBtn ${styles.createBtn}`}
          onClick={handleCreateCategory}
        >
          Create Category +
        </span>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <MainSearchInput type="categories" />
        </div>
      </div>

      <div>
        <table className={`table ${styles.table}`}>
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Arabic Name</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.length > 0 ? (
              categories.map((category) => (
                <tr key={category._id}>
                  <td data-label="Category Name">
                    <div className={styles.categoryName}>
                      {category?.name?.en || category?.name || "No name"}
                    </div>
                  </td>
                  <td data-label="Arabic Name">
                    <div className={styles.categoryName}>
                      {category?.nameAr || "No name"}
                    </div>
                  </td>             
                  <td data-label="Created">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td data-label="Actions" className={`actions `}>
                    <span>
                      <button
                        className={`editBtn`}
                        style={{ padding: "5px 8px", borderRadius: "3px", border: "none", cursor: "pointer" }}
                        onClick={() => handleEditCategory(category)}
                      >
                        Edit
                      </button>
                    </span>

                    <button
                      className="deleteBtn"
                      onClick={() => deleteCategory(category._id)}
                      style={{
                        padding: "5px 8px",
                        borderRadius: "3px",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {" "}
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination center">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className={`secBtn ${styles.prevBtn}`}
          >
            Previous
          </button>
          <span>
            {page + 1}
            <span> / </span>
            {totalPages && totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages - 1}
            className={`secBtn ${styles.nextBtn}`}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
