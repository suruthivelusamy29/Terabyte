import { useState } from "react";
import { Link } from "react-router-dom";
import { FiPlay, FiPlus, FiCheck, FiStar, FiEye } from "react-icons/fi";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./VideoCard.css";

const VideoCard = ({ video, progress = 0, showProgress = false }) => {
  const { user } = useAuth();
  const [inList, setInList] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleWatchlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    try {
      await api.post("/auth/watchlist", { videoId: video._id });
      setInList(!inList);
    } catch {}
  };

  const thumb = video.thumbnail || null;

  return (
    <Link
      to={`/watch/${video._id}`}
      className="vcard"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className="vcard-thumb">
        {thumb ? (
          <img src={thumb} alt={video.title} loading="lazy" />
        ) : (
          <div className="vcard-placeholder">
            <FiPlay size={24} />
          </div>
        )}

        {/* Overlay */}
        <div className={`vcard-overlay ${hovered ? "visible" : ""}`}>
          <div className="vcard-play">
            <FiPlay size={18} fill="#fff" />
          </div>
        </div>

        {/* Badges */}
        <div className="vcard-badges">
          {video.featured && <span className="badge badge-gold" style={{ fontSize: 9 }}>Featured</span>}
          {video.trending && <span className="badge badge-red" style={{ fontSize: 9 }}>🔥 Hot</span>}
        </div>

        {/* Category */}
        <span className="vcard-cat">{video.category}</span>

        {/* Duration */}
        <span className="vcard-dur">{video.duration}</span>

        {/* Watchlist btn */}
        {user && (
          <button className={`vcard-list-btn ${inList ? "added" : ""}`} onClick={handleWatchlist}>
            {inList ? <FiCheck size={12} /> : <FiPlus size={12} />}
          </button>
        )}

        {/* Progress bar */}
        {showProgress && progress > 0 && (
          <div className="vcard-progress">
            <div className="vcard-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="vcard-info">
        <p className="vcard-title">{video.title}</p>
        <div className="vcard-meta">
          {video.averageRating > 0 && (
            <span className="vcard-rating">
              <FiStar size={10} fill="#f59e0b" color="#f59e0b" />
              {Number(video.averageRating).toFixed(1)}
            </span>
          )}
          <span className="vcard-views">
            <FiEye size={10} />
            {video.views >= 1000 ? `${(video.views / 1000).toFixed(0)}K` : video.views}
          </span>
          {video.year && <span className="vcard-year">{video.year}</span>}
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
