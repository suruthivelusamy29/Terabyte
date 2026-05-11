import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiUpload, FiEye } from "react-icons/fi";
import api from "../services/api";
import "./Admin.css";

const AdminVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    api.get("/videos?limit=100")
      .then(({ data }) => setVideos(data.videos))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this video?")) return;
    setDeleting(id);
    try {
      await api.delete(`/videos/${id}`);
      setVideos((v) => v.filter((x) => x._id !== id));
    } catch (err) { alert(err.response?.data?.message || "Delete failed"); }
    finally { setDeleting(null); }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Videos ({videos.length})</h1>
        <Link to="/admin/upload" className="btn btn-red"><FiUpload size={14} /> Upload New</Link>
      </div>
      <div className="card">
        <table className="admin-table">
          <thead>
            <tr><th>Thumbnail</th><th>Title</th><th>Category</th><th>Views</th><th>Duration</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {videos.map((v) => (
              <tr key={v._id}>
                <td>
                  {v.thumbnail
                    ? <img src={v.thumbnail} alt={v.title} className="table-thumb" />
                    : <div className="table-thumb-placeholder" />}
                </td>
                <td className="table-title">{v.title}</td>
                <td><span className="badge badge-gray">{v.category}</span></td>
                <td><FiEye size={12} style={{ marginRight: 4 }} />{v.views?.toLocaleString()}</td>
                <td>{v.duration}</td>
                <td>
                  <div className="table-actions">
                    <Link to={`/admin/edit/${v._id}`} className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 12 }}>
                      <FiEdit2 size={12} /> Edit
                    </Link>
                    <button
                      className="btn btn-red"
                      style={{ padding: "6px 12px", fontSize: 12 }}
                      onClick={() => handleDelete(v._id)}
                      disabled={deleting === v._id}
                    >
                      <FiTrash2 size={12} /> {deleting === v._id ? "..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {videos.length === 0 && <p style={{ textAlign: "center", color: "#555", padding: 40 }}>No videos yet.</p>}
      </div>
    </div>
  );
};

export default AdminVideos;
