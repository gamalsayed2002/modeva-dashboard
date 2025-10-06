import styles from "./login.module.css";
import logo from "../../assets/logo2.png";
import { userStore } from "../../stores/userStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = userStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result?.success) {
      navigate('/dashboard');
    }
  };
  return (
    <div className={`center ${styles.login}`}>
      <img src={logo} alt="img not found" />
      <h3>Welcome back</h3>
      <form className="center">
        <input
          type="text"
          placeholder="Username"
          className={`input`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className={`input`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={`btn`} onClick={handleSubmit}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
