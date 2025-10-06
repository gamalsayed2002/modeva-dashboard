import styles from "./settings.module.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { userStore } from "./../../stores/userStore";

export default function Settings() {
  const { user, updateUser } = userStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState({});

  // لما ييجي user يتعمل fill للقيم
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);
  useEffect(() => {
    if (!user) return;
    const data = {};
    if (name && name !== user.name) data.name = name;
    if (email && email !== user.email) data.email = email;
    if (currentPassword) data.currentPassword = currentPassword;
    if (password) data.newPassword = password;
    if (confirmPassword) data.confirmPassword = confirmPassword;

    setFormData(data);
  }, [name, email, currentPassword, password, confirmPassword, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      toast.error("No changes detected");
      return;
    }
    await updateUser(formData);
  };

  return (
    <section className={styles.settings}>
      <h2 className="titleText">Settings</h2>
      <form onSubmit={handleSubmit} className={`${styles.container}`}>
        <div>
          <h4>Account</h4>
          <div>
            <label htmlFor="name">Name</label>
            <input
              className="input"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              className="input"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn">
            Update Account
          </button>
        </div>

        <div>
          <h4>Password</h4>
          <div>
            <label htmlFor="currentPassword">Current password</label>
            <input
              className="input"
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">New password</label>
            <input
              className="input"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              className="input"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn">
            Update Password
          </button>
        </div>
      </form>
    </section>
  );
}
