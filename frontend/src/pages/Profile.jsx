import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { FiUser, FiMail, FiEdit2, FiSave } from "react-icons/fi";
import "./Profile.css";

const Profile = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", avatar: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/profile")
      .then(({ data }) => { setProfile(data); setForm({ name: data.name, avatar: data.avatar || "" }); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/auth/profile", form);
      setProfile(data);
      login({ ...user, name: data.name, avatar: data.avatar });
      setEditing(false);
      setMsg("Profile updated!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) { setMsg(err.response?.data?.message || "Update failed"); }
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="profile-page">
      <div className="profile-card card">
        <div className="profile-avatar">
          {profile?.avatar ? <img src={profile.avatar} alt={profile.name} /> : <span>{profile?.name?.[0]?.toUpperCase()}</span>}
        </div>
        <div className="profile-info">
          <h2>{profile?.name}</h2>
          <p><FiMail size={13} /> {profile?.email}</p>
          <span className={`badge ${profile?.role === "admin" ? "badge-red" : "badge-gray"}`}>{profile?.role}</span>
        </div>
        <button className="btn btn-outline" onClick={() => setEditing(!editing)}>
          <FiEdit2 size={14} /> {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {msg && <div className="success-msg">{msg}</div>}

      {editing && (
        <form onSubmit={handleSave} className="card profile-form">
          <h3>Edit Profile</h3>
          <div className="form-group">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Avatar URL</label>
            <input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="https://..." />
          </div>
          <button type="submit" className="btn btn-red"><FiSave size={14} /> Save Changes</button>
        </form>
      )}

      {/* Watch History */}
      {profile?.watchHistory?.length > 0 && (
        <div className="profile-history">
          <h3>Watch History ({profile.watchHistory.length})</h3>
          <div className="video-grid">
            {profile.watchHistory.map((v) => (
              <div key={v._id} className="history-item">
                {v.thumbnail ? <img src={v.thumbnail} alt={v.title} /> : <div className="thumb-placeholder" />}
                <p>{v.title}</p>
                <span className="badge badge-gray">{v.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
