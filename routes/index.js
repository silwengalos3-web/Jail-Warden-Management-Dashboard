import express from "express";
import { loginPage, login, logout } from "../controllers/authController.js";
import { dashboard } from "../controllers/dashboardController.js";
import { listPDLs, newPDLPage, createPDL, viewPDL, updatePDLStatus } from "../controllers/pdlController.js";
import { listTransfers, newTransferPage, createTransfer, reviewTransfer } from "../controllers/transferController.js";
import { listIncidents, newIncidentPage, createIncident, reviewIncident } from "../controllers/incidentController.js";
import { reportsPage } from "../controllers/reportController.js";
import { staffPage } from "../controllers/staffController.js";
import { notificationsPage } from "../controllers/notificationController.js";
import { auditPage } from "../controllers/auditController.js";
import { requireWarden } from "../middleware/auth.js";

const router = express.Router();

router.get("/", (req, res) => res.redirect(req.session.user ? "/dashboard" : "/login"));
router.get("/login", loginPage);
router.post("/login", login);
router.post("/logout", requireWarden, logout);

router.use(requireWarden);
router.get("/dashboard", dashboard);

router.get("/pdls", listPDLs);
router.get("/pdls/new", newPDLPage);
router.post("/pdls", createPDL);
router.get("/pdls/:id", viewPDL);
router.post("/pdls/:id/status", updatePDLStatus);

router.get("/transfers", listTransfers);
router.get("/transfers/new", newTransferPage);
router.post("/transfers", createTransfer);
router.post("/transfers/:id/review", reviewTransfer);

router.get("/incidents", listIncidents);
router.get("/incidents/new", newIncidentPage);
router.post("/incidents", createIncident);
router.post("/incidents/:id/review", reviewIncident);

router.get("/reports", reportsPage);
router.get("/staff", staffPage);
router.get("/notifications", notificationsPage);
router.get("/audit", auditPage);

export default router;
