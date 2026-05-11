import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: { type: String, required: true },
    tags: [String],
    cast: [String],
    director: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    backdropImage: { type: String, default: "" },
    videoURL: { type: String, required: true },
    trailerURL: { type: String, default: "" },
    duration: { type: String, default: "0:00" },
    durationSeconds: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    trendingScore: { type: Number, default: 0 },
    year: { type: Number, default: new Date().getFullYear() },
    language: { type: String, default: "English" },
    maturityRating: { type: String, default: "PG-13" },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Trending score = views * recency factor
videoSchema.methods.calcTrendingScore = function () {
  const daysSince = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);
  const recency = Math.max(1, 30 - daysSince);
  this.trendingScore = this.views * recency;
};

export default mongoose.model("Video", videoSchema);
