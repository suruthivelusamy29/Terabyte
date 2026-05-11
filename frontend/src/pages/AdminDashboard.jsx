import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiVideo, FiEye, FiTag, FiUpload, FiTrash2 } from "react-icons/fi";
import api from "../services/api";
import "./Admin.css";

const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-card card">
    <div className="stat-icon" style={{ background: color }}>{icon}</div>
    <div>
      <p className="stat-value">{typeof value === "number" ? value.toLocaleString() : value}</p>
      <p className="stat-label">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats")
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <Link to="/admin/upload" className="btn btn-red"><FiUpload size={14} /> Upload Video</Link>
      </div>

      <div className="stats-grid">
        <StatCard icon={<FiUsers size={20} />} label="Total Users" value={stats?.totalUsers} color="#e50914" />
        <StatCard icon={<FiVideo size={20} />} label="Total Videos" value={stats?.totalVideos} color="#3498db" />
        <StatCard icon={<FiEye size={20} />} label="Total Views" value={stats?.totalViews} color="#2ecc71" />
        <StatCard icon={<FiTag size={20} />} label="Categories" value={stats?.totalCategories} color="#9b59b6" />
      </div>

      <div className="admin-nav-cards">
        {[
          { to: "/admin/videos", icon: <FiVideo size={24} />, label: "Manage Videos", desc: "Upload, edit, delete videos" },
          { to: "/admin/users", icon: <FiUsers size={24} />, label: "Manage Users", desc: "View and manage user accounts" },
          { to: "/admin/upload", icon: <FiUpload size={24} />, label: "Upload Video", desc: "Add new content to the platform" },
        ].map(({ to, icon, label, desc }) => (
          <Link key={to} to={to} className="admin-nav-card card">
            <div className="admin-nav-icon">{icon}</div>
            <div>
              <h3>{label}</h3>
              <p>{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {stats?.recentUsers?.length > 0 && (
        <div className="card" style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Recent Users</h3>
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
            <tbody>
              {stats.recentUsers.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role === "admin" ? "badge-red" : "badge-gray"}`}>{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
