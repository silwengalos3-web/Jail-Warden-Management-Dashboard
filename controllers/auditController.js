import { AuditLog } from "../models/AuditLog.js";
export const auditPage = async (req, res) => {
  const logs = await AuditLog.findAll({ order: [["createdAt", "DESC"]], limit: 200 });
  res.render("audit", { title: "Audit Trail", logs });
};
