import jwt from "jsonwebtoken";
import User from "../models/User.js";

const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const userPayload = (user) => ({
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  token: genToken(user._id),
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already registered" });
    const user = await User.create({ name, email, password });
    res.status(201).json(userPayload(user));
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });
    res.json(userPayload(user));
  } catch (err) { next(err); }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("watchHistory", "title thumbnail duration category averageRating")
      .populate("watchlist", "title thumbnail duration category averageRating");
    res.json(user);
  } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, preferences } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, { name, avatar, preferences }, { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) { next(err); }
};

export const toggleWatchlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { videoId } = req.body;
    const idx = user.watchlist.indexOf(videoId);
    if (idx > -1) user.watchlist.splice(idx, 1);
    else user.watchlist.push(videoId);
    await user.save();
    res.json({ watchlist: user.watchlist, added: idx === -1 });
  } catch (err) { next(err); }
};

export const saveProgress = async (req, res, next) => {
  try {
    const { videoId, timestamp, progress, completed } = req.body;
    const user = await User.findById(req.user._id);
    const existing = user.progress.find((p) => p.videoId?.toString() === videoId);
    if (existing) {
      existing.timestamp = timestamp;
      existing.progress = progress;
      existing.completed = completed || false;
      existing.updatedAt = new Date();
    } else {
      user.progress.push({ videoId, timestamp, progress, completed: completed || false });
    }
    // Add to watch history
    if (!user.watchHistory.includes(videoId)) user.watchHistory.push(videoId);
    await user.save();
    res.json({ message: "Progress saved" });
  } catch (err) { next(err); }
};

export const getProgress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("progress.videoId", "title thumbnail duration category");
    res.json(user.progress);
  } catch (err) { next(err); }
};

export const getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("notifications");
    res.json(user.notifications.slice(-20).reverse());
  } catch (err) { next(err); }
};

export const markNotificationsRead = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $set: { "notifications.$[].read": true },
    });
    res.json({ message: "Marked as read" });
  } catch (err) { next(err); }
};
