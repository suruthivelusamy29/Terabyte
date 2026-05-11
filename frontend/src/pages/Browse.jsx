import { useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import api from "../services/api";
import VideoCard from "../components/VideoCard";
import "./Browse.css";

const CATS = ["All", "Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Documentary"];

const Browse = () => {
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (category !== "All") params.set("category", category);
    api.get(`/videos?${params}`)
      .then(({ data }) => { setVideos(data.videos); setTotalPages(data.pages); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, page]);

  const handleCat = (cat) => { setCategory(cat); setPage(1); };

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1><FiFilter size={20} /> Browse All</h1>
        <div className="cat-filters">
          {CATS.map((c) => (
            <button key={c} className={`cat-btn ${category === c ? "active" : ""}`} onClick={() => handleCat(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="page-loader" style={{ minHeight: 300 }}><div className="spinner" /></div>
      ) : videos.length === 0 ? (
        <div className="empty-state"><h3>No videos found</h3><p>Try a different category.</p></div>
      ) : (
        <>
          <div className="video-grid">{videos.map((v) => <VideoCard key={v._id} video={v} />)}</div>
          {totalPages > 1 && (
            <div className="pagination">
              <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
              <span>{page} / {totalPages}</span>
              <button className="btn btn-outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Browse;
