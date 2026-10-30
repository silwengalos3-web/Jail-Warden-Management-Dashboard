import "dotenv/config";
import bcrypt from "bcryptjs";
import { sequelize } from "./models/db.js";
import { User } from "./models/User.js";

try {
  await sequelize.authenticate();
  const email = (process.env.WARDEN_EMAIL || "warden@jailtrack.local").toLowerCase();
  const password = process.env.WARDEN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 12);
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      fullName: process.env.WARDEN_NAME || "Jail Warden",
      email, passwordHash, role: "warden", isActive: true
    }
  });
  if (!created) console.log(`Warden account already exists: ${user.email}. Password was not changed.`);
  else console.log(`Warden account created: ${email}`);
  console.log("For security, change the initial password after first login.");
  await sequelize.close();
} catch (error) {
  console.error("Unable to create Warden account:", error.message);
  process.exit(1);
}
