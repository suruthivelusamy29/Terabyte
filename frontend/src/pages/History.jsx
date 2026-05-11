import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import api from "../services/api";
import VideoCard from "../components/VideoCard";
import "./Browse.css";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/profile")
      .then(({ data }) => setHistory(data.watchHistory || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1><FiClock size={20} /> Watch History</h1>
      </div>
      {history.length === 0 ? (
        <div className="empty-state">
          <h3>No watch history yet</h3>
          <p>Start watching videos and they'll appear here.</p>
          <Link to="/browse" className="btn btn-red" style={{ marginTop: 16, display: "inline-flex" }}>Browse Videos</Link>
        </div>
      ) : (
        <div className="video-grid">
          {history.map((v) => <VideoCard key={v._id} video={v} />)}
        </div>
      )}
    </div>
  );
};

export default History;
