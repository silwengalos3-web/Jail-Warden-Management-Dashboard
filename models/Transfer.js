import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";
import { PDL } from "./PDL.js";

export const Transfer = sequelize.define("Transfer", {
  destinationFacility: { type: DataTypes.STRING(180), allowNull: false },
  transferReason: { type: DataTypes.TEXT, allowNull: false },
  requestDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.ENUM("Pending", "Approved", "Rejected"), defaultValue: "Pending" },
  wardenRemarks: { type: DataTypes.TEXT },
  reviewedBy: { type: DataTypes.STRING(120) },
  reviewedAt: { type: DataTypes.DATE }
});
PDL.hasMany(Transfer, { foreignKey: { allowNull: false }, onDelete: "RESTRICT" });
Transfer.belongsTo(PDL);
