import { DataTypes } from "sequelize";
import { sequelize } from "./db.js";

export const PDL = sequelize.define("PDL", {
  pdlNumber: { type: DataTypes.STRING(40), allowNull: false, unique: true },
  firstName: { type: DataTypes.STRING(80), allowNull: false },
  middleName: { type: DataTypes.STRING(80) },
  lastName: { type: DataTypes.STRING(80), allowNull: false },
  dateOfBirth: { type: DataTypes.DATEONLY },
  admissionDate: { type: DataTypes.DATEONLY, allowNull: false },
  caseNumber: { type: DataTypes.STRING(80) },
  sentenceDetails: { type: DataTypes.STRING(255) },
  expectedReleaseDate: { type: DataTypes.DATEONLY },
  assignedCell: { type: DataTypes.STRING(60) },
  status: { type: DataTypes.ENUM("Active", "Transferred", "Released"), defaultValue: "Active" }
});
