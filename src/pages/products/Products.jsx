import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./products.module.css";
import { productStore } from "../../stores/productStore";
import { categoryStore } from "../../stores/categoryStore";
import MainSearchInput from "../../components/mainSearchInput/MainSearchInput";

export default function Products() {
  const {
    products,
    getProducts,
    deleteProduct,
    getProductsByCategory,
    totalPages,
  } = productStore();
  const { categories } = categoryStore();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(0);

  // Load products and categories on mount
  useEffect(() => {
    getProducts(page);
    categoryStore.getState().getCategories();
  }, [page]);

  // Handle search and category filtering
  useEffect(() => {
    if (selectedCategory) {
      getProductsByCategory(selectedCategory);
    } else {
      getProducts();
    }
  }, [selectedCategory, getProducts, getProductsByCategory]);

  return (
    <section>
      <div className={`${styles.header} between`}>
        <h2 className={`titleText ${styles.title}`}>Products</h2>
        <div>
          <Link to="/products/0" className={`secBtn center ${styles.btn}`}>
            Add Product +
          </Link>
        </div>
      </div>
      <div className={styles.searchContainer}>
        <MainSearchInput type="products" />
        <div
          className={styles.categoryFilterContainer}
          style={{ display: "flex", gap: "0px 10px", flexWrap: "wrap" }}
        >
          <select
            className={`input ${styles.filterSelect}`}
            value={selectedCategory}
            onChange={(e) => {
              const categoryId = e.target.value;
              setSelectedCategory(categoryId);
              if (!categoryId) {
                getProducts();
              }
            }}
          >
            <option value="">All Categories</option>
            {categories?.map((category) => (
              <option key={category?._id} value={category?._id}>
                {category?.name || "Unnamed Category"}
              </option>
            ))}
          </select>
        </div>
      </div>
      <table className={`table ${styles.table}`}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                <td data-label="Product">
                  {product.mainImage && (
                    <img
                      src={`${import.meta.env.VITE_BASE_IMAGE_URL}${
                        product.mainImage
                      }`}
                      alt={product.name?.en || "Product"}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </td>
                <td data-label="Name">{product.name?.en || "N/A"}</td>
                <td data-label="Category">
                  {product.category?.name?.en || "N/A"}
                </td>
                <td data-label="Price">
                  {product.price || "0"} <span className="">EGP</span>
                </td>

                <td data-label="Actions" className={styles.actions}>
                  <Link to={`/products/${product._id}`} className={styles.link}>
                    Edit
                  </Link>
                  <button
                    className="deleteBtn"
                    onClick={() => deleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No products found
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
    </section>
  );
}
