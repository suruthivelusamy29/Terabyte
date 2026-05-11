import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUploadCloud } from "react-icons/fi";
import api from "../services/api";
import "./Admin.css";

const CATS = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Documentary", "Other"];

const UploadVideo = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", category: "Action",
    thumbnail: "", videoURL: "", duration: "", featured: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await api.post("/videos", form);
      navigate(`/watch/${data._id}`);
    } catch (err) { setError(err.response?.data?.message || "Upload failed"); }
    finally { setLoading(false); }
  };

  const inputClass = "admin-input";

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><FiUploadCloud size={20} /> Upload Video</h1>
      </div>
      <div className="card upload-form">
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Title *</label>
              <input value={form.title} onChange={set("title")} placeholder="Video title" required />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select value={form.category} onChange={set("category")}>
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group full">
              <label>Description</label>
              <textarea value={form.description} onChange={set("description")} rows={3} placeholder="Video description..." />
            </div>
            <div className="form-group full">
              <label>Video URL * (YouTube link or direct .mp4)</label>
              <input value={form.videoURL} onChange={set("videoURL")} placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4" required />
            </div>
            <div className="form-group">
              <label>Thumbnail URL</label>
              <input value={form.thumbnail} onChange={set("thumbnail")} placeholder="https://example.com/thumb.jpg" />
              {form.thumbnail && (
                <img src={form.thumbnail} alt="preview" className="thumb-preview"
                  onError={(e) => { e.target.style.display = "none"; }} />
              )}
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input value={form.duration} onChange={set("duration")} placeholder="e.g. 1:45:00" />
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={form.featured} onChange={set("featured")} style={{ width: "auto" }} />
                Feature on homepage banner
              </label>
            </div>
          </div>
          <button type="submit" className="btn btn-red" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><FiUploadCloud size={15} /> Upload Video</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;
