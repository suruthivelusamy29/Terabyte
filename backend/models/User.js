import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const progressSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
  timestamp: { type: Number, default: 0 },
  progress: { type: Number, default: 0 }, // 0-100%
  completed: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: { type: String, default: "" },
    watchHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    progress: [progressSchema],
    preferences: {
      categories: [String],
      language: { type: String, default: "en" },
    },
    notifications: [
      {
        message: String,
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model("User", userSchema);
