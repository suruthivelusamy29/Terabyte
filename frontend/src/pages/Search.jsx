import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import api from "../services/api";
import VideoCard from "../components/VideoCard";
import "./Browse.css";

const Search = () => {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    api.get(`/videos?search=${encodeURIComponent(q)}&limit=40`)
      .then(({ data }) => setVideos(data.videos))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1><FiSearch size={20} /> Search Results for "{q}"</h1>
      </div>
      {loading ? (
        <div className="page-loader" style={{ minHeight: 300 }}><div className="spinner" /></div>
      ) : videos.length === 0 ? (
        <div className="empty-state">
          <h3>No results found</h3>
          <p>Try different keywords or browse all content.</p>
        </div>
      ) : (
        <div className="video-grid">{videos.map((v) => <VideoCard key={v._id} video={v} />)}</div>
      )}
    </div>
  );
};

export default Search;
