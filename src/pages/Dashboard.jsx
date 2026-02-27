import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/products.api";
import { getUsers } from "../api/users.api";
import { getOrders } from "../api/orders.api";
import { getTransactions } from "../api/transactions.api";
import { useAuth } from "../context/AuthContext";
import { Shirt, Tag, Package, ShoppingCart, CreditCard, Users } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0, transactions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [p, u, o, t] = await Promise.allSettled([
          getProducts(), getUsers(), getOrders(), getTransactions()
        ]);
        setStats({
          products: p.value?.data?.count ?? 0,
          users: u.value?.data?.count ?? 0,
          orders: o.value?.data?.data?.length ?? 0,
          transactions: t.value?.data?.count ?? 0,
        });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { icon: <Shirt size={22} />, label: "Total Produk", value: stats.products, to: "/products" },
    { icon: <ShoppingCart size={22} />, label: "Orders", value: stats.orders, to: "/orders" },
    { icon: <CreditCard size={22} />, label: "Transaksi", value: stats.transactions, to: "/transactions" },
    { icon: <Users size={22} />, label: "Users", value: stats.users, to: "/users" },
  ];

  const quickLinks = [
    { to: "/products",     icon: <Shirt size={20} />,        label: "Products",     desc: "Kelola data produk" },
    { to: "/categories",   icon: <Tag size={20} />,           label: "Categories",   desc: "Kelola kategori" },
    { to: "/stocks",       icon: <Package size={20} />,       label: "Stocks",       desc: "Riwayat stok masuk/keluar" },
    { to: "/orders",       icon: <ShoppingCart size={20} />,  label: "Orders",       desc: "Kelola pesanan" },
    { to: "/transactions", icon: <CreditCard size={20} />,    label: "Transactions", desc: "Riwayat transaksi" },
    { to: "/users",        icon: <Users size={20} />,         label: "Users",        desc: "Manajemen pengguna" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Selamat datang, {user?.fullname || "Admin"} —{" "}
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Memuat data...</div>
      ) : (
        <div className="stats-grid">
          {statCards.map((s) => (
            <Link key={s.to} to={s.to} style={{ textDecoration: "none", color: "inherit" }}>
              <div
                className="stat-card"
                style={{ cursor: "pointer", transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div className="stat-icon" style={{ color: "var(--accent)" }}>{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, color: "var(--text-muted)" }}>
        Menu Cepat
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
        {quickLinks.map((l) => (
          <Link key={l.to} to={l.to} style={{ textDecoration: "none" }}>
            <div
              className="stat-card"
              style={{ display: "flex", flexDirection: "column", gap: 6, cursor: "pointer", transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <span style={{ color: "var(--accent)" }}>{l.icon}</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{l.label}</span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{l.desc}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}