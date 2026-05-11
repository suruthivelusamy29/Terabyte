import Video from "../models/Video.js";
import User from "../models/User.js";
import Review from "../models/Review.js";

export const getVideos = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 24, sort = "newest" } = req.query;
    const query = {};
    if (category && category !== "All") query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };
    const sortMap = {
      newest: { createdAt: -1 },
      popular: { views: -1 },
      rating: { averageRating: -1 },
      trending: { trendingScore: -1 },
    };
    const videos = await Video.find(query)
      .sort(sortMap[sort] || sortMap.newest)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("uploadedBy", "name");
    const total = await Video.countDocuments(query);
    res.json({ videos, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

export const getVideoById = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id, { $inc: { views: 1 } }, { new: true }
    ).populate("uploadedBy", "name");
    if (!video) return res.status(404).json({ message: "Video not found" });
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { watchHistory: video._id },
      });
    }
    res.json(video);
  } catch (err) { next(err); }
};

export const getFeatured = async (req, res, next) => {
  try {
    const videos = await Video.find({ featured: true }).limit(6);
    res.json(videos);
  } catch (err) { next(err); }
};

export const getTrending = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1, createdAt: -1 }).limit(12);
    res.json(videos);
  } catch (err) { next(err); }
};

export const getRecommendations = async (req, res, next) => {
  try {
    let categories = [];
    if (req.user) {
      const user = await User.findById(req.user._id).populate("watchHistory", "category");
      const catCount = {};
      user.watchHistory.forEach((v) => { catCount[v.category] = (catCount[v.category] || 0) + 1; });
      categories = Object.entries(catCount).sort((a, b) => b[1] - a[1]).map(([c]) => c).slice(0, 3);
    }
    const query = categories.length ? { category: { $in: categories } } : {};
    const videos = await Video.find(query).sort({ averageRating: -1, views: -1 }).limit(12);
    res.json(videos);
  } catch (err) { next(err); }
};

export const getByCategory = async (req, res, next) => {
  try {
    const videos = await Video.find({ category: req.params.category })
      .sort({ views: -1 }).limit(12);
    res.json(videos);
  } catch (err) { next(err); }
};

export const searchSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);
    const videos = await Video.find({ title: { $regex: q, $options: "i" } })
      .select("title thumbnail category").limit(6);
    res.json(videos);
  } catch (err) { next(err); }
};

export const toggleLike = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Not found" });
    const uid = req.user._id;
    const liked = video.likes.includes(uid);
    if (liked) video.likes.pull(uid);
    else { video.likes.addToSet(uid); video.dislikes.pull(uid); }
    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length, liked: !liked });
  } catch (err) { next(err); }
};

export const toggleDislike = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Not found" });
    const uid = req.user._id;
    const disliked = video.dislikes.includes(uid);
    if (disliked) video.dislikes.pull(uid);
    else { video.dislikes.addToSet(uid); video.likes.pull(uid); }
    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length, disliked: !disliked });
  } catch (err) { next(err); }
};

export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const existing = await Review.findOne({ userId: req.user._id, videoId: req.params.id });
    if (existing) {
      existing.rating = rating; existing.comment = comment;
      await existing.save();
    } else {
      await Review.create({ userId: req.user._id, videoId: req.params.id, rating, comment });
    }
    // Recalculate average
    const reviews = await Review.find({ videoId: req.params.id });
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await Video.findByIdAndUpdate(req.params.id, { averageRating: avg.toFixed(1), totalRatings: reviews.length });
    res.json({ message: "Review saved", averageRating: avg.toFixed(1) });
  } catch (err) { next(err); }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ videoId: req.params.id })
      .populate("userId", "name avatar").sort({ createdAt: -1 }).limit(20);
    res.json(reviews);
  } catch (err) { next(err); }
};

export const createVideo = async (req, res, next) => {
  try {
    const video = await Video.create({ ...req.body, uploadedBy: req.user._id });
    res.status(201).json(video);
  } catch (err) { next(err); }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!video) return res.status(404).json({ message: "Not found" });
    res.json(video);
  } catch (err) { next(err); }
};

export const deleteVideo = async (req, res, next) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};
