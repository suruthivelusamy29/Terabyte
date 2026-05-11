import { useRef } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import VideoCard from "./VideoCard";
import { SkeletonRow } from "./SkeletonCard";
import "./VideoRow.css";

const VideoRow = ({ title, icon, videos = [], loading = false, seeAllLink, progressMap = {} }) => {
  const rowRef = useRef();

  const scroll = (dir) => {
    rowRef.current?.scrollBy({ left: dir * 700, behavior: "smooth" });
  };

  return (
    <section className="vrow">
      <div className="section-header">
        <h2 className="section-title">
          {icon && <span>{icon}</span>} {title}
        </h2>
        {seeAllLink && (
          <Link to={seeAllLink} className="see-all">
            See all <FiChevronRight size={12} />
          </Link>
        )}
      </div>

      <div className="vrow-wrap">
        <button className="vrow-arrow left" onClick={() => scroll(-1)}>
          <FiChevronLeft size={20} />
        </button>

        {loading ? (
          <SkeletonRow count={6} />
        ) : (
          <div className="scroll-row" ref={rowRef}>
            {videos.map((v) => (
              <div key={v._id} className="vrow-item">
                <VideoCard
                  video={v}
                  progress={progressMap[v._id] || 0}
                  showProgress={!!progressMap[v._id]}
                />
              </div>
            ))}
          </div>
        )}

        <button className="vrow-arrow right" onClick={() => scroll(1)}>
          <FiChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default VideoRow;
