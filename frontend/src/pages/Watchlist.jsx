import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBookmark, FiTrash2 } from "react-icons/fi";
import api from "../services/api";
import VideoCard from "../components/VideoCard";
import { SkeletonRow } from "../components/SkeletonCard";

const Watchlist = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/profile")
      .then(({ data }) => setVideos(data.watchlist || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (videoId) => {
    try {
      await api.post("/auth/watchlist", { videoId });
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="page" style={{ background: "#080810", minHeight: "100vh" }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 26, fontWeight: 800 }}>
            <FiBookmark size={24} color="#a855f7" /> My List
          </h1>
          <p style={{ color: "#555", fontSize: 14, marginTop: 6 }}>
            {videos.length} title{videos.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {loading ? (
          <SkeletonRow count={6} />
        ) : videos.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
            <h3>Your list is empty</h3>
            <p>Add movies and shows to watch later</p>
            <Link to="/browse" className="btn btn-purple" style={{ marginTop: 8 }}>
              Browse Content
            </Link>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 20,
          }}>
            {videos.map((v) => (
              <div key={v._id} style={{ position: "relative" }}>
                <VideoCard video={v} />
                <button
                  onClick={() => handleRemove(v._id)}
                  style={{
                    position: "absolute",
                    top: 8, right: 8,
                    width: 28, height: 28,
                    borderRadius: "50%",
                    background: "rgba(229,9,20,0.85)",
                    border: "none",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 5,
                    transition: "transform 0.2s",
                  }}
                  title="Remove from list"
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
