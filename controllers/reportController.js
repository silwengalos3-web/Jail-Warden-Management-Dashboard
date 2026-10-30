import { Op } from "sequelize";
import { PDL } from "../models/PDL.js";
import { Transfer } from "../models/Transfer.js";
import { Incident } from "../models/Incident.js";

export const reportsPage = async (req, res) => {
  const [pdlStatus, transferStatus, incidentStatus, recentAdmissions, recentReleases] = await Promise.all([
    PDL.findAll({ attributes: ["status", [PDL.sequelize.fn("COUNT", PDL.sequelize.col("id")), "total"]], group: ["status"], raw: true }),
    Transfer.findAll({ attributes: ["status", [Transfer.sequelize.fn("COUNT", Transfer.sequelize.col("id")), "total"]], group: ["status"], raw: true }),
    Incident.findAll({ attributes: ["status", [Incident.sequelize.fn("COUNT", Incident.sequelize.col("id")), "total"]], group: ["status"], raw: true }),
    PDL.count({ where: { admissionDate: { [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } }),
    PDL.count({ where: { status: "Released", updatedAt: { [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } })
  ]);
  res.render("reports", { title: "Reports & Analytics", pdlStatus, transferStatus, incidentStatus, recentAdmissions, recentReleases, generatedAt: new Date().toLocaleString("en-PH") });
};
