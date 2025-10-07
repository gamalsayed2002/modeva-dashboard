import styles from "./order.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { ordersStore } from "../../stores/ordersStore";
import Loading from "./../../components/loadingPage/Loading";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getOrderById, loading, order } = ordersStore();

  useEffect(() => {
    getOrderById(id);
  }, [id, getOrderById]);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className={styles.orderDetails}>
      <div className={styles.header}>
        <h6>
          orders/order/#<span>{order?._id?.substring(0, 8) || ""}</span>
        </h6>
        <h3 className="titleText">Order/#{order?._id || "Loading..."}</h3>
        <p>
          {order?.updatedAt
            ? `Placed on ${new Date(order.updatedAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}`
            : "Loading date..."}
        </p>
      </div>

      {/* Customer Info */}
      <h3
        className="titleText"
        style={{ margin: "25px 0 10px 0", fontSize: "20px" }}
      >
        Customer Information
      </h3>

      <div className={styles.customerGrid}>
        <div>
          <span>Customer Name</span>
          <p>{order?.user?.name || "N/A"}</p>
        </div>
        <div>
          <span>Contact</span>
          <p>{order?.user?.phone || "(N/A)"}</p>
        </div>
        <div>
          <span>Email</span>
          <p>{order?.user?.email || "N/A"}</p>
        </div>
        <div>
          <span>Address</span>
          <p>{order?.user?.address || "N/A"}</p>
        </div>
      </div>
      <h3
        className="titleText"
        style={{ margin: "25px 0 10px 0", fontSize: "20px" }}
      >
        Order Items
      </h3>
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>image</th>
            <th>Total</th>

          </tr>
        </thead>
        <tbody>
          {order?.products?.map((item) => (
            <tr
              key={item._id}
              onClick={() => {
                navigate(`/products/${item.product?._id}`);
              }}
            >
              <td data-label="Product Name">
                <div>
                  <p>{item.product?.name || "N/A"}</p>
                </div>
              </td>
              <td data-label="Price">{item.price || 0} EGP</td>
              <td data-label="Quantity">{item.quantity || 0}</td>
              <td data-label="image">
                {item.product?.mainImage && (
                  <img
                    src={`${import.meta.env.VITE_BASE_IMAGE_URL}${item.product.mainImage}`}
                    alt={item.product.name || "Product"}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "100%",
                    }}
                  />
                )}
              </td>
              <td data-label="Total">{item.price * item.quantity || 0} EGP</td>
    
            </tr>
          ))}
        </tbody>
      </table>
      <div
        className={`secBtn`}
        style={{ borderRadius: "0 0 5px 5px", width: "fit-content" }}
      >
        <div className="total">
          <p>Total: {order.totalAmount || 0} EGP</p>
        </div>
      </div>
    </section>
  );
}