import { useEffect, useState } from "react";
import MainSearchInput from "../../components/mainSearchInput/MainSearchInput";
import styles from "./customers.module.css";

import { useNavigate } from "react-router-dom";
import customersStore from "../../stores/customersStore";


export default function Customers() {
  const { getUsers, users, totalPages } = customersStore();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  useEffect(() => {
    getUsers(page);
  }, [page]);

 
  const handleRowClick = (id) => {
    navigate(`/customers/${id}`);
  };

  return (
    <section className={styles.customers}>
      <h3 className="titleText">Customers</h3>
      <MainSearchInput type="customers" />

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr
                key={user._id}
                onClick={() => handleRowClick(user._id)}
                style={{ cursor: "pointer" }}
              >
                <td data-label="Name">{user.name}</td>
                <td data-label="Email">{user.email}</td>
                <td data-label="Phone">{user.phone}</td>
                <td data-label="Role">{user.role}</td>
                <td data-label="Created At">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No customers found
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