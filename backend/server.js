import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/admin", adminRoutes);
app.get("/", (req, res) => res.json({ message: "TeraByte API v2 running" }));

// ── SEED ──────────────────────────────────────────────────────────────────────
app.get("/api/seed", async (req, res) => {
  try {
    const { default: Video } = await import("./models/Video.js");
    const { default: User } = await import("./models/User.js");

    await Video.deleteMany();
    await User.deleteOne({ email: "admin@terabyte.com" });

    await User.create({ name: "Admin", email: "admin@terabyte.com", password: "admin123", role: "admin" });

    const videos = [
      { title: "Cosmic Journey", description: "An astronaut ventures beyond the known universe in search of humanity's origin.", category: "Sci-Fi", tags: ["space", "adventure", "epic"], thumbnail: "https://picsum.photos/seed/cosmic/800/450", backdropImage: "https://picsum.photos/seed/cosmic/1920/1080", videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ", trailerURL: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "2:15:00", durationSeconds: 8100, views: 124000, featured: true, trending: true, year: 2024, maturityRating: "PG-13", director: "James Cameron", cast: ["Tom Hanks", "Zoe Saldana"], averageRating: 4.8, totalRatings: 2340 },
      { title: "The Last Stand", description: "A lone warrior defends a crumbling city against an unstoppable army.", category: "Action", tags: ["war", "hero", "battle"], thumbnail: "https://picsum.photos/seed/laststand/800/450", backdropImage: "https://picsum.photos/seed/laststand/1920/1080", videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "1:58:00", durationSeconds: 7080, views: 98000, featured: true, trending: true, year: 2024, maturityRating: "R", director: "Christopher Nolan", cast: ["Chris Hemsworth", "Idris Elba"], averageRating: 4.6, totalRatings: 1890 },
      { title: "Laugh Out Loud", description: "A stand-up comedian accidentally becomes the most wanted man in the country.", category: "Comedy", tags: ["funny", "crime", "chase"], thumbnail: "https://picsum.photos/seed/laugh/800/450", backdropImage: "https://picsum.photos/seed/laugh/1920/1080", videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "1:45:00", durationSeconds: 6300, views: 76000, year: 2023, maturityRating: "PG-13", averageRating: 4.2, totalRatings: 980 },
      { title: "Dark Shadows", description: "Ancient evil awakens in a small town, and only one family knows the truth.", category: "Horror", tags: ["supernatural", "dark", "thriller"], thumbnail: "https://picsum.photos/seed/darkshadow/800/450", backdropImage: "https://picsum.photos/seed/darkshadow/1920/1080", videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "1:52:00", durationSeconds: 6720, views: 62000, featured: true, year: 2024, maturityRating: "R", averageRating: 4.4, totalRatings: 1120 },
      { title: "Human Stories", description: "Five strangers connected by a single moment that changed their lives forever.", category: "Drama", tags: ["emotional", "life", "connections"], thumbnail: "https://picsum.photos/seed/human/800/450", backdropImage: "https://picsum.photos/seed/human/1920/1080", videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "2:05:00", durationSeconds: 7500, views: 54000, year: 2023, maturityRating: "PG", averageRating: 4.7, totalRatings: 2100 },
      { title: "Planet Earth III", description: "The most breathtaking journey through Earth's last wild places.", category: "Documentary", tags: ["nature", "wildlife", "earth"], thumbnail: "https://picsum.photos/seed/planet/800/450", backdropImage: "https://picsum.photos/seed/planet/1920/1080", videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "1:30:00", durationSeconds: 5400, views: 89000, featured: true, trending: true, year: 2024, maturityRating: "G", averageRating: 4.9, totalRatings: 3200 },
      { title: "Neon City", description: "In 2087, a detective hunts a killer through the neon-lit streets of a cyberpunk megacity.", category: "Sci-Fi", tags: ["cyberpunk", "detective", "future"], thumbnail: "https://picsum.photos/seed/neon/800/450", backdropImage: "https://picsum.photos/seed/neon/1920/1080", videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "2:00:00", durationSeconds: 7200, views: 112000, trending: true, year: 2024, maturityRating: "R", averageRating: 4.5, totalRatings: 1560 },
      { title: "Galaxy Wars", description: "The fate of a thousand worlds rests on the shoulders of one unlikely hero.", category: "Sci-Fi", tags: ["space", "war", "epic"], thumbnail: "https://picsum.photos/seed/galaxy/800/450", backdropImage: "https://picsum.photos/seed/galaxy/1920/1080", videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "2:30:00", durationSeconds: 9000, views: 156000, featured: true, trending: true, year: 2024, maturityRating: "PG-13", averageRating: 4.7, totalRatings: 4100 },
      { title: "The Comedian", description: "A washed-up comedian gets one last shot at redemption on the world stage.", category: "Comedy", tags: ["standup", "redemption", "funny"], thumbnail: "https://picsum.photos/seed/comedian/800/450", backdropImage: "https://picsum.photos/seed/comedian/1920/1080", videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "1:20:00", durationSeconds: 4800, views: 43000, year: 2023, maturityRating: "PG-13", averageRating: 4.1, totalRatings: 670 },
      { title: "Midnight Terror", description: "A family moves into their dream home, unaware of the nightmare that awaits.", category: "Horror", tags: ["haunted", "family", "supernatural"], thumbnail: "https://picsum.photos/seed/midnight/800/450", backdropImage: "https://picsum.photos/seed/midnight/1920/1080", videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "1:48:00", durationSeconds: 6480, views: 71000, trending: true, year: 2024, maturityRating: "R", averageRating: 4.3, totalRatings: 890 },
      { title: "Broken Wings", description: "A former pilot rebuilds her life after a devastating crash changes everything.", category: "Drama", tags: ["emotional", "recovery", "inspiring"], thumbnail: "https://picsum.photos/seed/wings/800/450", backdropImage: "https://picsum.photos/seed/wings/1920/1080", videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "2:10:00", durationSeconds: 7800, views: 39000, year: 2023, maturityRating: "PG", averageRating: 4.6, totalRatings: 1230 },
      { title: "Ocean Secrets", description: "Scientists discover an ancient civilization hidden beneath the Pacific Ocean.", category: "Documentary", tags: ["ocean", "discovery", "science"], thumbnail: "https://picsum.photos/seed/ocean/800/450", backdropImage: "https://picsum.photos/seed/ocean/1920/1080", videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "1:25:00", durationSeconds: 5100, views: 67000, year: 2024, maturityRating: "G", averageRating: 4.5, totalRatings: 1450 },
      { title: "Iron Fist Rising", description: "A martial arts prodigy rises from the slums to challenge the world champion.", category: "Action", tags: ["martial arts", "sports", "underdog"], thumbnail: "https://picsum.photos/seed/ironfist/800/450", backdropImage: "https://picsum.photos/seed/ironfist/1920/1080", videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "1:55:00", durationSeconds: 6900, views: 88000, trending: true, year: 2024, maturityRating: "PG-13", averageRating: 4.4, totalRatings: 1780 },
      { title: "Love in Tokyo", description: "Two strangers meet during a typhoon and discover love in the most unexpected way.", category: "Romance", tags: ["love", "japan", "travel"], thumbnail: "https://picsum.photos/seed/tokyo/800/450", backdropImage: "https://picsum.photos/seed/tokyo/1920/1080", videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "1:50:00", durationSeconds: 6600, views: 52000, year: 2023, maturityRating: "PG", averageRating: 4.3, totalRatings: 920 },
      { title: "The Algorithm", description: "A tech billionaire's AI goes rogue and begins rewriting human history.", category: "Thriller", tags: ["AI", "tech", "conspiracy"], thumbnail: "https://picsum.photos/seed/algo/800/450", backdropImage: "https://picsum.photos/seed/algo/1920/1080", videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "2:05:00", durationSeconds: 7500, views: 94000, featured: true, trending: true, year: 2024, maturityRating: "PG-13", averageRating: 4.6, totalRatings: 2010 },
      { title: "Desert Storm", description: "A special ops team must survive 72 hours behind enemy lines with no backup.", category: "Action", tags: ["military", "survival", "war"], thumbnail: "https://picsum.photos/seed/desert/800/450", backdropImage: "https://picsum.photos/seed/desert/1920/1080", videoURL: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "2:00:00", durationSeconds: 7200, views: 103000, year: 2024, maturityRating: "R", averageRating: 4.5, totalRatings: 1670 },
    ];

    await Video.insertMany(videos);
    res.json({ message: "✅ Seeded 16 videos + admin account", admin: "admin@terabyte.com / admin123" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/reset-admin", async (req, res) => {
  try {
    const { default: User } = await import("./models/User.js");
    await User.deleteOne({ email: "admin@terabyte.com" });
    await User.create({ name: "Admin", email: "admin@terabyte.com", password: "admin123", role: "admin" });
    res.json({ message: "Admin reset! admin@terabyte.com / admin123" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`TeraByte v2 running on port ${PORT}`));
