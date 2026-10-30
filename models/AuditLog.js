import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const AuditLog = sequelize.define("AuditLog", {
  actorName: { type: DataTypes.STRING(120), allowNull: false },
  action: { type: DataTypes.STRING(100), allowNull: false },
  entityType: { type: DataTypes.STRING(80) },
  entityId: { type: DataTypes.INTEGER },
  details: { type: DataTypes.TEXT },
  ipAddress: { type: DataTypes.STRING(64) }
});
