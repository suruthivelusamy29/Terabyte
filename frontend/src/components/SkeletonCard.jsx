const SkeletonCard = () => (
  <div style={{ borderRadius: 6, overflow: "hidden", background: "#12121f" }}>
    <div className="skeleton" style={{ aspectRatio: "16/9", width: "100%" }} />
    <div style={{ padding: "7px 7px 9px" }}>
      <div className="skeleton" style={{ height: 11, borderRadius: 3, marginBottom: 5 }} />
      <div className="skeleton" style={{ height: 10, borderRadius: 3, width: "55%" }} />
    </div>
  </div>
);

export const SkeletonRow = ({ count = 7 }) => (
  <div style={{ display: "flex", gap: 10, overflow: "hidden" }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ flexShrink: 0, width: 180 }}>
        <SkeletonCard />
      </div>
    ))}
  </div>
);

export default SkeletonCard;
