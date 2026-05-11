import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiEye, FiClock, FiTag, FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import VideoCard from "../components/VideoCard";
import "./Watch.css";

const toEmbed = (url = "") => {
  if (!url?.trim()) return null;
  if (url.includes("youtube.com/embed/")) return url;
  const short = url.match(/youtu\.be\/([^?&\s]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const watch = url.match(/youtube\.com\/watch\?v=([^&\s]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  return url;
};
const isDirect = (url = "") => /\.(mp4|webm|ogg)(\?|$)/i.test(url);

const Watch = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || id === "undefined") return;
    window.scrollTo(0, 0);
    setLoading(true);

    api.get(`/videos/${id}`)
      .then(({ data }) => {
        setVideo(data);
        return api.get(`/videos/recommended?category=${data.category}`);
      })
      .then(({ data }) => setRecommended(data.filter((v) => v._id !== id)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!video) return (
    <div className="watch-page">
      <div className="empty-state"><h3>Video not found</h3><Link to="/" className="btn btn-red" style={{ marginTop: 16 }}>Go Home</Link></div>
    </div>
  );

  const embedUrl = toEmbed(video.videoURL);
  const direct = isDirect(video.videoURL);
  const thumb = video.thumbnail || null;

  return (
    <div className="watch-page">
      <div className="watch-main">
        <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft size={16} /> Back</button>

        {/* Player */}
        <div className="player-wrap">
          {direct ? (
            <video src={video.videoURL} controls className="player-video" {...(thumb ? { poster: thumb } : {})} />
          ) : embedUrl ? (
            <iframe key={embedUrl} src={embedUrl} title={video.title} className="player-iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
          ) : (
            <div className="player-error">Invalid video URL</div>
          )}
        </div>

        {/* Info */}
        <div className="watch-info">
          <h1>{video.title}</h1>
          <div className="watch-meta">
            <span><FiEye size={13} /> {video.views?.toLocaleString()} views</span>
            <span><FiClock size={13} /> {video.duration}</span>
            <span className="badge badge-red"><FiTag size={10} /> {video.category}</span>
          </div>
          <p className="watch-desc">{video.description || "No description available."}</p>
        </div>
      </div>

      {/* Recommended */}
      {recommended.length > 0 && (
        <aside className="watch-sidebar">
          <h3>More Like This</h3>
          <div className="sidebar-list">
            {recommended.slice(0, 8).map((v) => <VideoCard key={v._id} video={v} />)}
          </div>
        </aside>
      )}
    </div>
  );
};

export default Watch;
