import { Transfer } from "../models/Transfer.js";
import { PDL } from "../models/PDL.js";
import { Notification } from "../models/Notification.js";
import { recordAudit } from "../utils/audit.js";

export const listTransfers = async (req, res) => {
  const transfers = await Transfer.findAll({ include: PDL, order: [["createdAt", "DESC"]] });
  res.render("transfers", { title: "Transfer Requests", transfers });
};

export const newTransferPage = async (req, res) => {
  const pdls = await PDL.findAll({ where: { status: "Active" }, order: [["lastName", "ASC"]] });
  res.render("transfer-form", { title: "New Transfer Request", pdls });
};

export const createTransfer = async (req, res) => {
  const pdl = await PDL.findByPk(req.body.PDLId);
  if (!pdl || pdl.status !== "Active") {
    req.flash("error", "Select a valid active PDL.");
    return res.redirect("/transfers/new");
  }
  const destinationFacility = String(req.body.destinationFacility || "").trim();
  const transferReason = String(req.body.transferReason || "").trim();
  if (!destinationFacility || !transferReason) {
    req.flash("error", "Destination and reason are required.");
    return res.redirect("/transfers/new");
  }
  const transfer = await Transfer.create({ PDLId: pdl.id, destinationFacility, transferReason });
  await recordAudit(req, "Created transfer request", "Transfer", transfer.id, `PDL ${pdl.pdlNumber}`);
  await Notification.create({ title: "New transfer request", message: `A transfer request for PDL ${pdl.pdlNumber} is awaiting review.`, category: "Transfer" });
  req.flash("success", "Transfer request created.");
  res.redirect("/transfers");
};

export const reviewTransfer = async (req, res) => {
  const transfer = await Transfer.findByPk(req.params.id, { include: PDL });
  if (!transfer) return res.status(404).send("Transfer request not found.");
  if (transfer.status !== "Pending") {
    req.flash("error", "This transfer request has already been reviewed.");
    return res.redirect("/transfers");
  }
  const decision = req.body.decision;
  if (!["Approved", "Rejected"].includes(decision)) return res.status(400).send("Invalid decision.");
  const remarks = String(req.body.wardenRemarks || "").trim();
  if (!remarks) {
    req.flash("error", "Please provide remarks before submitting a decision.");
    return res.redirect("/transfers");
  }
  await transfer.update({
    status: decision, wardenRemarks: remarks,
    reviewedBy: req.session.user.fullName, reviewedAt: new Date()
  });
  if (decision === "Approved") await transfer.PDL.update({ status: "Transferred" });
  await recordAudit(req, `${decision} transfer request`, "Transfer", transfer.id, remarks);
  await Notification.create({ title: `Transfer ${decision.toLowerCase()}`, message: `Transfer request #${transfer.id} for PDL ${transfer.PDL.pdlNumber} was ${decision.toLowerCase()}.`, category: "Transfer" });
  req.flash("success", `Transfer request ${decision.toLowerCase()}.`);
  res.redirect("/transfers");
};
