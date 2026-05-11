import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSave } from "react-icons/fi";
import api from "../services/api";
import "./Admin.css";

const CATS = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Documentary", "Other"];

const EditVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/videos/${id}`)
      .then(({ data }) => setForm({
        title: data.title, description: data.description, category: data.category,
        thumbnail: data.thumbnail, videoURL: data.videoURL, duration: data.duration,
        featured: data.featured,
      }))
      .catch(console.error);
  }, [id]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api.put(`/videos/${id}`, form);
      navigate("/admin/videos");
    } catch (err) { setError(err.response?.data?.message || "Update failed"); }
    finally { setLoading(false); }
  };

  if (!form) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="admin-page">
      <div className="admin-header"><h1>Edit Video</h1></div>
      <div className="card upload-form">
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Title</label>
              <input value={form.title} onChange={set("title")} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={set("category")}>
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group full">
              <label>Description</label>
              <textarea value={form.description} onChange={set("description")} rows={3} />
            </div>
            <div className="form-group full">
              <label>Video URL</label>
              <input value={form.videoURL} onChange={set("videoURL")} required />
            </div>
            <div className="form-group">
              <label>Thumbnail URL</label>
              <input value={form.thumbnail} onChange={set("thumbnail")} />
              {form.thumbnail && <img src={form.thumbnail} alt="preview" className="thumb-preview" onError={(e) => { e.target.style.display = "none"; }} />}
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input value={form.duration} onChange={set("duration")} />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={form.featured} onChange={set("featured")} style={{ width: "auto" }} />
                Featured on homepage
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-red" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "Saving..." : <><FiSave size={14} /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditVideo;
