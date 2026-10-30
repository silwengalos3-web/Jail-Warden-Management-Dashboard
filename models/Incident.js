import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const Incident = sequelize.define("Incident", {
  referenceNumber: { type: DataTypes.STRING(40), allowNull: false, unique: true },
  title: { type: DataTypes.STRING(160), allowNull: false },
  type: { type: DataTypes.ENUM("Altercation", "Escape Attempt", "Contraband", "Medical Emergency", "Property Damage", "Security Violation", "Other"), defaultValue: "Other" },
  incidentDate: { type: DataTypes.DATE, allowNull: false },
  location: { type: DataTypes.STRING(160) },
  personsInvolved: { type: DataTypes.TEXT },
  description: { type: DataTypes.TEXT, allowNull: false },
  investigationFindings: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM("Reported", "Under Review", "Resolved", "Closed"), defaultValue: "Reported" },
  wardenRemarks: { type: DataTypes.TEXT },
  reviewedBy: { type: DataTypes.STRING(120) },
  reviewedAt: { type: DataTypes.DATE }
});
