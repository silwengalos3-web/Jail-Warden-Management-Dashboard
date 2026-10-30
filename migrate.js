import "dotenv/config";
import { sequelize } from "./models/db.js";
import "./models/associations.js";

try {
  await sequelize.authenticate();
  // Creates missing tables and updates compatible columns without dropping existing data.
  await sequelize.sync({ alter: true });
  console.log("JailTrack database tables are ready.");
  await sequelize.close();
} catch (error) {
  console.error("Migration failed:", error.message);
  process.exit(1);
}
