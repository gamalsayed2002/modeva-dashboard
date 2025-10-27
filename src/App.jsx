import SideBar from "./components/sidebar/SideBar";
import Login from "./pages/login/Login";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import styles from "./App.module.css";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/dashboard/Dashboard";
import Messages from "./pages/messages/Messages";
import Products from "./pages/products/Products";
import ProductAcions from "./actionsPages/productAcions/ProductAcions";
import Categories from "./pages/categories/Categories";
import Settings from "./pages/settings/Settings";
import { useEffect } from "react";
import { userStore } from "./stores/userStore";
import Loading from "./components/loadingPage/Loading";
import Orders from "./pages/orders/Orders";
import OrderDetails from "./actionsPages/orderDetails/OrderDetails";
import Customers from "./pages/customers/Customers";

function App() {
  const { checkAuth, user, loading } = userStore();
  useEffect(() => {
    checkAuth();
  }, []);
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  if (isLoginPage) {
    return (
      <>
        <div className={styles.background_wrapper}>
          <div className={styles.background_overlay}></div>
          <Login />
          <Toaster />
        </div>
      </>
    );
  }
  if (loading === true) {
    return <Loading />;
  }
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.container}>
      <SideBar />
      <div className={styles.mainContent}>
        <div className={styles.background_wrapper}>
          <div className={styles.background_overlay}></div>
        </div>
        <Routes>
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductAcions />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="customers" element={<Customers />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
