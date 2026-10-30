import { Incident } from "../models/Incident.js";
import { Notification } from "../models/Notification.js";
import { recordAudit } from "../utils/audit.js";

export const listIncidents = async (req, res) => {
  const incidents = await Incident.findAll({ order: [["incidentDate", "DESC"]] });
  res.render("incidents", { title: "Incident Reports", incidents });
};

export const newIncidentPage = (req, res) => res.render("incident-form", { title: "Record Incident" });

export const createIncident = async (req, res) => {
  const title = String(req.body.title || "").trim();
  const description = String(req.body.description || "").trim();
  if (!title || !description || !req.body.incidentDate) {
    req.flash("error", "Title, date, and description are required.");
    return res.redirect("/incidents/new");
  }
  const incident = await Incident.create({
    referenceNumber: `INC-${Date.now()}`,
    title, type: req.body.type || "Other", incidentDate: req.body.incidentDate,
    location: String(req.body.location || "").trim(),
    personsInvolved: String(req.body.personsInvolved || "").trim(),
    description
  });
  await recordAudit(req, "Created incident report", "Incident", incident.id, incident.referenceNumber);
  await Notification.create({ title: "New incident report", message: `${incident.referenceNumber}: ${incident.title} requires Warden review.`, category: "Incident" });
  req.flash("success", "Incident report recorded.");
  res.redirect("/incidents");
};

export const reviewIncident = async (req, res) => {
  const incident = await Incident.findByPk(req.params.id);
  if (!incident) return res.status(404).send("Incident not found.");
  const status = req.body.status;
  if (!["Under Review", "Resolved", "Closed"].includes(status)) return res.status(400).send("Invalid status.");
  incident.status = status;
  incident.investigationFindings = String(req.body.investigationFindings || "").trim();
  incident.wardenRemarks = String(req.body.wardenRemarks || "").trim();
  incident.reviewedBy = req.session.user.fullName;
  incident.reviewedAt = new Date();
  await incident.save();
  await recordAudit(req, "Reviewed incident", "Incident", incident.id, `Status: ${status}`);
  await Notification.create({ title: "Incident review updated", message: `${incident.referenceNumber} status changed to ${status}.`, category: "Incident" });
  req.flash("success", "Incident review saved.");
  res.redirect("/incidents");
};
