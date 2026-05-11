import { useEffect, useState } from "react";
import { FiTrash2, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Admin.css";

const AdminUsers = () => {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/users")
      .then(({ data }) => setUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (id === me?._id) return alert("Cannot delete your own account");
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((u) => u.filter((x) => x._id !== id));
    } catch (err) { alert(err.response?.data?.message || "Delete failed"); }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><FiUser size={20} /> Manage Users ({users.length})</h1>
      </div>
      <div className="card">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="mini-avatar">{u.name?.[0]?.toUpperCase()}</div>
                    {u.name}
                  </div>
                </td>
                <td style={{ color: "#888" }}>{u.email}</td>
                <td><span className={`badge ${u.role === "admin" ? "badge-red" : "badge-gray"}`}>{u.role}</span></td>
                <td style={{ color: "#666", fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-red"
                    style={{ padding: "6px 12px", fontSize: 12 }}
                    onClick={() => handleDelete(u._id)}
                    disabled={u._id === me?._id}
                  >
                    <FiTrash2 size={12} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
