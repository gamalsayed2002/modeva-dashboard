import styles from "./mainSearchInput.module.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { categoryStore } from "../../stores/categoryStore";
import { messagesStore } from "../../stores/messagesStore";
import { ordersStore } from "../../stores/ordersStore";
import { productStore } from "../../stores/productStore";
import customersStore from "../../stores/customersStore";
export default function MainSearchInput({ type }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { searchCategories, getCategories } = categoryStore();
  const { searchMessages, getMessages } = messagesStore();
  const { searchOrders, getOrders } = ordersStore();
  const { searchProducts, getProducts } = productStore();
  const { getUsers, searchUsers } = customersStore();
  const handleSearch = (e) => {
    e?.preventDefault();
    if (type === "categories") {
      searchCategories(searchQuery);
    } else if (type === "messages") {
      searchMessages(searchQuery);
    } else if (type === "orders") {
      searchOrders(searchQuery);
    } else if (type === "products") {
      searchProducts(searchQuery);
    } else if (type === "customers") {
      searchUsers(searchQuery);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  useEffect(() => {
    if (searchQuery.length < 1) {
      if (type === "categories") {
        getCategories();
      } else if (type === "messages") {
        getMessages();
      } else if (type === "orders") {
        getOrders();
      } else if (type === "products") {
        getProducts();
      } else if (type === "customers") {
        getUsers();
      }
    }
  }, [searchQuery]);
  return (
    <div
      className={`${styles.searchInputContainer}`}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <div>
        <input
          type="text"
          placeholder="Search"
          className="input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <motion.span
          className={`icon ${styles.icon} center`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSearch}
          style={{ cursor: "pointer" }}
        >
          <FaSearch />
        </motion.span>
      </div>
      <motion.button
        onClick={handleSearch}
        className="btn"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        Search
      </motion.button>
    </div>
  );
}
