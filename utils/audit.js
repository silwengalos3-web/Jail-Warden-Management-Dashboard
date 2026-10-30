import { AuditLog } from "../models/AuditLog.js";

export async function recordAudit(req, action, entityType = null, entityId = null, details = "") {
  const actorName = req.session.user?.fullName || "Unknown user";
  await AuditLog.create({
    actorName, action, entityType, entityId, details,
    ipAddress: req.ip?.slice(0, 64) || null
  });
}
