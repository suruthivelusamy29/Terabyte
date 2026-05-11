import User from "../models/User.js";
import Video from "../models/Video.js";
import Review from "../models/Review.js";

export const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalVideos, totalReviews] = await Promise.all([
      User.countDocuments(),
      Video.countDocuments(),
      Review.countDocuments(),
    ]);
    const viewsAgg = await Video.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]);
    const topVideos = await Video.find().sort({ views: -1 }).limit(5).select("title views averageRating category thumbnail");
    const categoryAgg = await Video.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 }, totalViews: { $sum: "$views" } } },
      { $sort: { totalViews: -1 } },
    ]);
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("-password");
    const monthlyViews = await Video.aggregate([
      { $group: { _id: { $month: "$createdAt" }, views: { $sum: "$views" }, count: { $sum: 1 } } },
      { $sort: { "_id": 1 } },
    ]);
    res.json({
      totalUsers, totalVideos, totalReviews,
      totalViews: viewsAgg[0]?.total || 0,
      topVideos, categoryAgg, recentUsers, monthlyViews,
    });
  } catch (err) { next(err); }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { next(err); }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) { next(err); }
};

export const getAllVideos = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 }).populate("uploadedBy", "name");
    res.json(videos);
  } catch (err) { next(err); }
};
