import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const hashed = await bcrypt.hash("admin123", 10);

  const result = await mongoose.connection.collection("users").findOneAndUpdate(
    { email: "admin@terabyte.com" },
    {
      $set: {
        name: "Admin",
        email: "admin@terabyte.com",
        password: hashed,
        role: "admin",
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  console.log("✅ Admin password reset successfully");
  console.log("Email   : admin@terabyte.com");
  console.log("Password: admin123");
  console.log("Role    :", result?.role || "admin");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
