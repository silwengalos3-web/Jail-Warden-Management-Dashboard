import { Op } from "sequelize";
import { PDL } from "../models/PDL.js";
import { recordAudit } from "../utils/audit.js";

export const listPDLs = async (req, res) => {
  const q = String(req.query.q || "").trim();
  const where = q ? { [Op.or]: [
    { pdlNumber: { [Op.like]: `%${q}%` } },
    { firstName: { [Op.like]: `%${q}%` } },
    { lastName: { [Op.like]: `%${q}%` } }
  ] } : {};
  const pdls = await PDL.findAll({ where, order: [["lastName", "ASC"]] });
  res.render("pdls", { title: "PDL Records", pdls, q });
};

export const newPDLPage = (req, res) => res.render("pdl-form", { title: "Add PDL Record" });

export const createPDL = async (req, res) => {
  const data = {
    pdlNumber: String(req.body.pdlNumber || "").trim(),
    firstName: String(req.body.firstName || "").trim(),
    middleName: String(req.body.middleName || "").trim() || null,
    lastName: String(req.body.lastName || "").trim(),
    dateOfBirth: req.body.dateOfBirth || null,
    admissionDate: req.body.admissionDate,
    caseNumber: String(req.body.caseNumber || "").trim() || null,
    sentenceDetails: String(req.body.sentenceDetails || "").trim() || null,
    expectedReleaseDate: req.body.expectedReleaseDate || null,
    assignedCell: String(req.body.assignedCell || "").trim() || null
  };
  if (!data.pdlNumber || !data.firstName || !data.lastName || !data.admissionDate) {
    req.flash("error", "Please complete PDL number, first name, last name, and admission date.");
    return res.redirect("/pdls/new");
  }
  const pdl = await PDL.create(data);
  await recordAudit(req, "Created PDL record", "PDL", pdl.id, `Created record ${pdl.pdlNumber}`);
  req.flash("success", "PDL record added.");
  res.redirect("/pdls");
};

export const viewPDL = async (req, res) => {
  const pdl = await PDL.findByPk(req.params.id);
  if (!pdl) return res.status(404).render("error", { title: "Not found", message: "PDL record not found." });
  res.render("pdl-detail", { title: "PDL Details", pdl });
};

export const updatePDLStatus = async (req, res) => {
  const pdl = await PDL.findByPk(req.params.id);
  if (!pdl) return res.status(404).send("PDL record not found.");
  const status = req.body.status;
  if (!["Active", "Transferred", "Released"].includes(status)) return res.status(400).send("Invalid status.");
  pdl.status = status;
  await pdl.save();
  await recordAudit(req, "Updated PDL status", "PDL", pdl.id, `Status changed to ${status}`);
  req.flash("success", "PDL status updated.");
  res.redirect(`/pdls/${pdl.id}`);
};
