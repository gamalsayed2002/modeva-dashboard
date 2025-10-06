import styles from "./messages.module.css";
import { useEffect, useState } from "react";
import { messagesStore } from "../../stores/messagesStore";
import { IoEyeOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import MainSearchInput from "../../components/mainSearchInput/MainSearchInput";

export default function Messages() {
  const { getMessages, messages, deleteMessage, totalPages } = messagesStore();
  const [page, setPage] = useState(0);

  useEffect(() => {
    getMessages(page);
  }, [page]);

  return (
    <section>
      <h2 className={`titleText ${styles.title}`}>Messages</h2>
      <MainSearchInput type="messages" />
      <div className={`center table-container ${styles.messagesContainer}`}>
        <table className={`table ${styles.table}`}>
          <thead>
            <tr className={styles.tableHead}>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length > 0 ? (
              messages.map((message) => (
                <tr key={message._id}>
                  <td data-label="Name">{message.name}</td>
                  <td data-label="Email">{message.email}</td>
                  <td data-label="Phone">{message.phone}</td>
                  <td data-label="Message">{message.message}</td>
                  <td data-label="Date">
                    {new Date(message.updatedAt)
                      .toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                      .replace(
                        /(\d+)\/(\d+)\/(\d+), (\d+:\d+)([ap]m)/,
                        "$1/$2/$3 - $4 $5"
                      )}
                  </td>

                  <td
                    data-label="Actions"
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    <span
                      className="editBtn center"
                      style={{
                        padding: "5px 8px",
                        borderRadius: "3px",
                        color: "white",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        const formattedDate = new Date(message.updatedAt)
                          .toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .replace(
                            /(\d+)\s(\w+)\s(\d+),\s(\d+:\d+)\s(\w+)/,
                            "$1 $2 $3, $4 $5"
                          );

                        Swal.fire({
                          title:
                            '<span style="font-size: 24px;">Message Details</span>',
                          html: `
                  <div style="text-align:left; font-size: clamp(0.875rem, 1.5vw, 1rem);">
                    <div style="margin-bottom:15px;">
                      <div style="display:flex;align-items:center;margin-bottom:10px;gap:8px;">
                        <div style="min-width:80px;font-weight:600;color:var(--primaryBtnBg);">Name:</div>
                        <div style="color:white;word-break:break-word;flex:1;">${
                          message.name
                        }</div>
                      </div>
                      <div style="display:flex;align-items:center;margin-bottom:10px;gap:8px;">
                        <div style="min-width:80px;font-weight:600;color:var(--primaryBtnBg);">Email:</div>
                        <div style="flex:1;"><a href="mailto:${
                          message.email
                        }" style="color:white;text-decoration:none;word-break:break-word;">${
                            message.email
                          }</a></div>
                      </div>
                      <div style="display:flex;align-items:center;margin-bottom:10px;gap:8px;">
                        <div style="min-width:80px;font-weight:600;color:var(--primaryBtnBg);">Phone:</div>
                        <div style="flex:1;"><a href="tel:${
                          message.phone
                        }" style="color:white;text-decoration:none;">${
                            message.phone
                          }</a></div>
                      </div>
                      <div style="display:flex;align-items:center;gap:8px;">
                        <div style="min-width:80px;font-weight:600;color:var(--primaryBtnBg);">Date:</div>
                        <div style="color:white;flex:1;">${formattedDate}</div>
                      </div>
                    </div>
                    <div>
                      <div style="font-weight:600;margin-bottom:8px;color:var(--primaryBtnBg);">Message:</div>
                      <div style="border-radius:8px;line-height:1.6;text-align:start;color:white;background:rgba(255,255,255,0.1);padding:12px;max-height:300px;overflow-y:auto;">
                        ${message.message.replace(/\n/g, "<br>")}
                      </div>
                    </div>
                  </div>
                `,
                          width: "min(90vw,700px)",
                          padding: "20px",
                          backdrop: "rgba(0,0,0,0.8)",
                          showConfirmButton: true,
                          confirmButtonText: "Close",
                          confirmButtonColor: "var(--primaryBtnBg)",
                          customClass: {
                            popup: "swal2-border-radius",
                            confirmButton: "swal2-confirm-btn",
                          },
                          showClass: {
                            popup:
                              "animate__animated animate__fadeInDown animate__faster",
                          },
                          hideClass: {
                            popup:
                              "animate__animated animate__fadeOutUp animate__faster",
                          },
                        });
                      }}
                    >
                      <IoEyeOutline />
                    </span>

                    <span
                      onClick={() => deleteMessage(message._id)}
                      className="deleteBtn"
                      style={{
                        padding: "5px 8px",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No messages found
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
