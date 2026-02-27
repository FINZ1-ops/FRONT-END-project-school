import { useEffect, useState } from "react";
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "../api/transactions.api";
import Modal from "../components/Modal";

const EMPTY = { order_id: "", payment_method: "cash", total_amount: "", status: "pending" };
const PAYMENT_METHODS = ["cash", "transfer", "credit_card", "debit_card", "qris"];
const STATUS_OPTIONS = ["pending", "paid", "failed", "refunded"];

export default function Transactions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const res = await getTransactions();
      setItems(res.data.data || []);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setForm(EMPTY); setError(""); setModal({ mode: "add" }); };
  const openEdit = (t) => {
    setForm({ order_id: t.order_id, payment_method: t.payment_method || "cash", total_amount: t.total_amount, status: t.status });
    setError(""); setModal({ mode: "edit", id: t.id });
  };

  const handleSubmit = async () => {
    if (!form.order_id || !form.total_amount) { setError("Order ID dan total wajib diisi"); return; }
    setSaving(true); setError("");
    try {
      const payload = { ...form, order_id: Number(form.order_id), total_amount: Number(form.total_amount) };
      if (modal.mode === "add") await createTransaction(payload);
      else await updateTransaction(modal.id, payload);
      setModal(null); fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus transaksi ini?")) return;
    await deleteTransaction(id); fetchData();
  };

  const badgeClass = (status) => ({ paid: "badge-green", failed: "badge-red", pending: "badge-yellow", refunded: "badge-gray" })[status] || "badge-gray";

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">{items.length} transaksi</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Tambah Transaksi</button>
      </div>

      <div className="table-wrap">
        {loading ? <div className="loading">Memuat...</div> : (
          <table>
            <thead><tr><th>ID</th><th>Order ID</th><th>Metode</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {items.length === 0
                ? <tr><td colSpan={6} className="empty">Belum ada transaksi</td></tr>
                : items.map(t => (
                  <tr key={t.id}>
                    <td style={{ color: "var(--text-muted)" }}>#{t.id}</td>
                    <td>Order #{t.order_id}</td>
                    <td><span className="badge badge-gray">{t.payment_method || "-"}</span></td>
                    <td><strong>Rp {Number(t.total_amount).toLocaleString("id-ID")}</strong></td>
                    <td><span className={`badge ${badgeClass(t.status)}`}>{t.status}</span></td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(t)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={modal.mode === "add" ? "Tambah Transaksi" : "Edit Transaksi"} onClose={() => setModal(null)}>
          {error && <div className="login-error">{error}</div>}
          <div className="form-row">
            <div className="form-group"><label>Order ID</label>
              <input className="form-control" type="number" value={form.order_id} onChange={e => setForm({...form, order_id: e.target.value})} placeholder="ID order" />
            </div>
            <div className="form-group"><label>Total (Rp)</label>
              <input className="form-control" type="number" value={form.total_amount} onChange={e => setForm({...form, total_amount: e.target.value})} placeholder="150000" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Metode Pembayaran</label>
              <select className="form-control" value={form.payment_method} onChange={e => setForm({...form, payment_method: e.target.value})}>
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Status</label>
              <select className="form-control" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
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
