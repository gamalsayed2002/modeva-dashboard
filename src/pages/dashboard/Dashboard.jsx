import React, { useEffect } from "react";
import analyticsStore from "../../stores/analyticsStore";
import styles from "./dashboard.module.css";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
  const navigate = useNavigate();
  const { analyticsData, dailySalesData, latestOrders, getAnalytics } =
    analyticsStore();

  useEffect(() => {
    getAnalytics();
  }, []);

  return (
    <section className={styles.dashboard}>
      <h2 className={`titleText`}>Dashboard</h2>
      <div>
        <div className={styles.analytics}>
          <div>
            <p>Total Sales</p>
            <h3>{analyticsData.totalSales}</h3>
          </div>
          <div>
            <p>Total Orders</p>
            <h3>{analyticsData.totalOrders}</h3>
          </div>
          <div>
            <p>Total Customers</p>
            <h3>{analyticsData.users}</h3>
          </div>
          <div>
            <p>Total Revenue</p>
            <h3>{analyticsData.totalRevenue}</h3>
          </div>
        </div>
      </div>

      {/* Sales Overview */}
      <div className={styles.salesOverview}>
        <h2>Sales Overview</h2>
        {/* <p>{`$${analyticsData.totalSales.toLocaleString()}`}</p> */}

        <ResponsiveContainer width="90%" height={300}>
          <LineChart data={dailySalesData}>
           
            <XAxis dataKey="date" />
          
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#e5801a"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <h4 style={{color:"white", fontSize:"20px",fontWeight:"400",margin:"50px 0 40px 0"}}>Latest Orders</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {latestOrders.length > 0 ? (
            latestOrders.map((order) => (
              <tr
                key={order._id}
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                <td data-label="Order ID">{order._id}</td>
                <td data-label="User">
                  {order.user ? order.user.name : "Guest"}
                </td>
                <td data-label="Total Amount">{order.totalAmount}</td>
                <td data-label="Status">{order.status}</td>
                <td data-label="Created At">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td data-label="Products">
                  <ul>
                    {order.products?.length > 0 &&
                      order.products.map((item) => (
                        <li key={item._id}>
                          {item.product?.name?.en} (x{item.quantity}) -{" "}
                          {item.price} EGP
                        </li>
                      ))}
                  </ul>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" align="center">
                No recent orders
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
