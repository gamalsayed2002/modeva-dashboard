import { useEffect, useState } from "react";

import styles from "./Orders.module.css";
import { ordersStore } from "../../stores/ordersStore";

import MainSearchInput from "../../components/mainSearchInput/MainSearchInput";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const { orders, getOrders, searchOrders, totalPages } = ordersStore();
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    getOrders(page);
  }, [getOrders, page]);

  useEffect(() => {
    if (statusFilter) {
      searchOrders("", statusFilter);
    } else {
      getOrders();
    }
  }, [statusFilter, getOrders, searchOrders]);

  return (
    <section>
      <h2 className={`titleText ${styles.title}`}>Orders</h2>

      <MainSearchInput type="orders" />

      {/* <div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{ margin: "20px 0" }}
      >
        <select
          className="input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: "200px" }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div> */}

      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Products</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <tr
                key={order._id}
                onClick={() => {
                  navigate(`/orders/${order._id}`);
                }}
              >
                <td data-label="Order ID">{order._id?.substring(0, 8)}...</td>
                <td data-label="User">{order.user?.name || "N/A"}</td>
                <td data-label="Products">
                  {order.products?.length || 0} items
                </td>
                <td data-label="Total Amount">${order.totalAmount || 0}</td>
                <td data-label="Status">
                  <span className={`status ${order.status || "N/A"}`}>
                    {order.status || "N/A"}
                  </span>
                </td>
                <td data-label="Date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No orders found
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
