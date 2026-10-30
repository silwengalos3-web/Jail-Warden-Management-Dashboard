import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const Notification = sequelize.define("Notification", {
  title: { type: DataTypes.STRING(160), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.STRING(60), defaultValue: "General" },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
});
