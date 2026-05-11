import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlay, FiInfo, FiTrendingUp, FiStar, FiZap } from "react-icons/fi";
import api from "../services/api";
import VideoRow from "../components/VideoRow";
import "./Home.css";

const CATEGORIES = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Documentary", "Thriller", "Romance"];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [fRes, vRes] = await Promise.all([
          api.get("/videos/featured"),
          api.get("/videos?limit=40"),
        ]);
        setFeatured(fRes.data);
        setAllVideos(vRes.data.videos || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    if (featured.length < 2) return;
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % featured.length), 6000);
    return () => clearInterval(t);
  }, [featured]);

  const hero = featured[heroIdx];
  const trending = [...allVideos].sort((a, b) => b.views - a.views).slice(0, 10);
  const topRated = [...allVideos].sort((a, b) => b.averageRating - a.averageRating).slice(0, 10);

  if (loading) return (
    <div className="page-loader">
      <div className="spinner" />
    </div>
  );

  return (
    <div className="home">
      {/* ── HERO BANNER ── */}
      {hero ? (
        <div
          className="hero"
          style={{ backgroundImage: hero.thumbnail ? `url(${hero.thumbnail})` : undefined }}
        >
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="badge badge-red" style={{ marginBottom: 12 }}>⭐ Featured</span>
            <h1>{hero.title}</h1>
            <p>{hero.description}</p>
            <div className="hero-meta">
              {hero.year && <span>{hero.year}</span>}
              {hero.maturityRating && <span className="badge badge-gray">{hero.maturityRating}</span>}
              {hero.duration && <span>{hero.duration}</span>}
            </div>
            <div className="hero-btns">
              <Link to={`/watch/${hero._id}`} className="btn btn-primary btn-lg">
                <FiPlay size={16} fill="#fff" /> Play Now
              </Link>
              <Link to={`/watch/${hero._id}`} className="btn btn-ghost btn-lg">
                <FiInfo size={16} /> More Info
              </Link>
            </div>
            {featured.length > 1 && (
              <div className="hero-dots">
                {featured.map((_, i) => (
                  <button
                    key={i}
                    className={`dot ${i === heroIdx ? "active" : ""}`}
                    onClick={() => setHeroIdx(i)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="hero hero-empty">
          <div className="hero-content">
            <h1>Welcome to <span style={{ color: "#e50914" }}>Tera</span><span style={{ color: "#a855f7" }}>Byte</span></h1>
            <p>Your ultimate streaming destination.</p>
            <div className="hero-btns">
              <Link to="/browse" className="btn btn-primary btn-lg"><FiPlay size={16} /> Browse Now</Link>
              <Link to="/register" className="btn btn-ghost btn-lg">Get Started Free</Link>
            </div>
          </div>
        </div>
      )}

      {/* ── CONTENT ROWS ── */}
      <div className="home-rows">
        {trending.length > 0 && (
          <VideoRow
            title="Trending Now"
            icon="🔥"
            videos={trending}
            seeAllLink="/browse?sort=popular"
          />
        )}

        {topRated.length > 0 && (
          <VideoRow
            title="Top Rated"
            icon="⭐"
            videos={topRated}
            seeAllLink="/browse?sort=rating"
          />
        )}

        {CATEGORIES.map((cat) => {
          const vids = allVideos.filter((v) => v.category === cat);
          if (vids.length < 2) return null;
          return (
            <VideoRow
              key={cat}
              title={cat}
              icon="🎬"
              videos={vids}
              seeAllLink={`/browse?category=${cat}`}
            />
          );
        })}

        {allVideos.length === 0 && (
          <div className="empty-state">
            <h3>No content yet</h3>
            <p>Visit <code>/api/seed</code> to load sample data, then refresh.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
