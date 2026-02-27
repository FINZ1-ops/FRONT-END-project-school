import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../api/auth.api";
import { Shirt, Tag, Package, ShoppingCart, CreditCard, Users } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: <Shirt size={16} /> },
  { to: "/products", label: "Products", icon: <Shirt size={16} /> },
  { to: "/categories", label: "Categories", icon: <Tag size={16} /> },
  { to: "/stocks", label: "Stocks", icon: <Package size={16} /> },
  { to: "/orders", label: "Orders", icon: <ShoppingCart size={16} /> },
  { to: "/transactions", label: "Transactions", icon: <CreditCard size={16} /> },
  { to: "/users", label: "Users", icon: <Users size={16} /> },
];

export default function Layout({ children }) {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore error, tetap logout
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="logo-icon">✦</span>
          <span className="logo-text">FashionStore</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.fullname?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="user-name">{user?.fullname || "User"}</div>
              <div className="user-role">{user?.role || "-"}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
