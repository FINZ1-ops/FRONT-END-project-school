import { useEffect, useState } from "react";
import { getOrders, createOrder, updateOrder, deleteOrder } from "../api/orders.api";
import Modal from "../components/Modal";

const STATUS_OPTIONS = ["pending", "processing", "completed", "cancelled"];
const EMPTY = { customer_id: "", status: "pending" };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const res = await getOrders();
      setOrders(res.data.data || []);
    } catch { setOrders([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setForm(EMPTY); setError(""); setModal({ mode: "add" }); };
  const openEdit = (o) => { setForm({ customer_id: o.customer_id, status: o.status }); setError(""); setModal({ mode: "edit", id: o.id }); };

  const handleSubmit = async () => {
    if (!form.customer_id) { setError("Customer ID wajib diisi"); return; }
    setSaving(true); setError("");
    try {
      if (modal.mode === "add") await createOrder({ ...form, customer_id: Number(form.customer_id) });
      else await updateOrder(modal.id, { ...form, customer_id: Number(form.customer_id) });
      setModal(null); fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus order ini?")) return;
    await deleteOrder(id); fetchData();
  };

  const badgeClass = (status) => ({
    pending: "badge-yellow", processing: "badge-gray", completed: "badge-green", cancelled: "badge-red"
  })[status] || "badge-gray";

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">{orders.length} pesanan</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Tambah Order</button>
      </div>

      <div className="table-wrap">
        {loading ? <div className="loading">Memuat...</div> : (
          <table>
            <thead><tr><th>ID</th><th>Customer ID</th><th>Status</th><th>Tanggal</th><th>Aksi</th></tr></thead>
            <tbody>
              {orders.length === 0
                ? <tr><td colSpan={5} className="empty">Belum ada order</td></tr>
                : orders.map(o => (
                  <tr key={o.id}>
                    <td style={{ color: "var(--text-muted)" }}>#{o.id}</td>
                    <td>Customer #{o.customer_id}</td>
                    <td><span className={`badge ${badgeClass(o.status)}`}>{o.status}</span></td>
                    <td style={{ color: "var(--text-muted)" }}>{o.order_date ? new Date(o.order_date).toLocaleString("id-ID") : "-"}</td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(o)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(o.id)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Tambah Order" : "Edit Order"} onClose={() => setModal(null)}>
          {error && <div className="login-error">{error}</div>}
          <div className="form-group"><label>Customer ID</label>
            <input className="form-control" type="number" value={form.customer_id} onChange={e => setForm({...form, customer_id: e.target.value})} placeholder="ID customer" />
          </div>
          <div className="form-group"><label>Status</label>
            <select className="form-control" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Batal</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
