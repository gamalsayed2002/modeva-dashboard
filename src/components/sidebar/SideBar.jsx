import styles from "./sidebar.module.css";
import logo from "../../assets/logo.png";
import { LuLayoutDashboard } from "react-icons/lu";
import { CiBoxes } from "react-icons/ci";
import { BsBox } from "react-icons/bs";
import { FiMessageSquare } from "react-icons/fi";
import { SlFolderAlt } from "react-icons/sl";
import { AiOutlineSetting } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { userStore } from "../../stores/userStore";
import { IoLogOutOutline } from "react-icons/io5";

export default function SideBar() {
  const navigate = useNavigate();
  const { logout, user } = userStore();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const links = [
    {
      icon: <LuLayoutDashboard />,
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <CiBoxes />,
      name: "Orders",
      path: "/orders",
    },
    {
      icon: <BsBox />,
      name: "Products",
      path: "/products",
    },
    {
      icon: <FiUsers />,
      name: "Customers",
      path: "/customers",
    },
    {
      icon: <FiMessageSquare />,
      name: "Messages",
      path: "/messages",
    },
    {
      icon: <SlFolderAlt />,
      name: "categories",
      path: "/categories",
    },
    {
      icon: <AiOutlineSetting />,
      name: "Settings",
      path: "/settings",
    },
  ];
  return (
    <aside className={`${styles.sidebar} center `}>
      {/* <div className={`${styles.toggle} center`}>
        <IoIosArrowForward className={`${styles.icon}`} />
      </div> */}
      <img src={logo} alt="img not found" />
      <ul>
        {links.map((link, index) => (
          <li key={index}>
            <NavLink
              to={link.path}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          </li>
        ))}
        {user && (
          <li>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <IoLogOutOutline />
              <span> Logout</span>
            </button>
          </li>
        )}
      </ul>
    </aside>
  );
}
