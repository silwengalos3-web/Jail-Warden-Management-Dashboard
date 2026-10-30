import { Op } from "sequelize";
import { PDL } from "../models/PDL.js";
import { Transfer } from "../models/Transfer.js";
import { Incident } from "../models/Incident.js";
import { AuditLog } from "../models/AuditLog.js";

export const dashboard = async (req, res) => {
  const [totalPDLs, activePDLs, releasedPDLs, pendingTransfers, openIncidents, recentTransfers, recentIncidents, recentActivities] =
    await Promise.all([
      PDL.count(),
      PDL.count({ where: { status: "Active" } }),
      PDL.count({ where: { status: "Released" } }),
      Transfer.count({ where: { status: "Pending" } }),
      Incident.count({ where: { status: { [Op.in]: ["Reported", "Under Review"] } } }),
      Transfer.findAll({ where: { status: "Pending" }, include: PDL, order: [["createdAt", "DESC"]], limit: 5 }),
      Incident.findAll({ order: [["incidentDate", "DESC"]], limit: 5 }),
      AuditLog.findAll({ order: [["createdAt", "DESC"]], limit: 8 })
    ]);
  const capacity = Number(process.env.FACILITY_CAPACITY || 500);
  const occupancy = capacity ? Math.min(100, Math.round(activePDLs / capacity * 100)) : 0;
  res.render("dashboard", {
    title: "Dashboard", totalPDLs, activePDLs, releasedPDLs, pendingTransfers, openIncidents,
    capacity, occupancy, recentTransfers, recentIncidents, recentActivities
  });
};
