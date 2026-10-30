import "dotenv/config";
import "express-async-errors";
import express from "express";
import session from "express-session";
import flash from "connect-flash";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";
import fs from "fs";
import router from "./routes/index.js";
import { sequelize } from "./models/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

// XianFire uses the .xian view extension. This renderer compiles the
// Handlebars-compatible .xian templates and loads shared partials.
Handlebars.registerHelper("eq", (a, b) => a === b);
Handlebars.registerHelper("formatDate", (value) =>
  value ? new Date(value).toLocaleDateString("en-PH") : "—"
);
Handlebars.registerHelper("json", (value) => JSON.stringify(value));
Handlebars.registerHelper("initials", (fullName) => {
  if (!fullName) return "?";
  return fullName.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join("");
});

const partialsDir = path.join(__dirname, "views", "partials");
for (const filename of fs.readdirSync(partialsDir).filter((name) => name.endsWith(".xian"))) {
  const partialName = filename.replace(/\.xian$/, "");
  Handlebars.registerPartial(partialName, fs.readFileSync(path.join(partialsDir, filename), "utf8"));
}
app.engine("xian", (filePath, options, callback) => {
  fs.readFile(filePath, "utf8", (error, source) => {
    if (error) return callback(error);
    try {
      const template = Handlebars.compile(source);
      callback(null, template(options));
    } catch (renderError) {
      callback(renderError);
    }
  });
});
app.set("view engine", "xian");
app.set("views", path.join(__dirname, "views"));

app.use(session({
  name: "jailtrack.sid",
  secret: process.env.SESSION_SECRET || "development-only-change-this-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 4
  }
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", router);

app.use((req, res) => res.status(404).render("error", {
  title: "Page not found",
  message: "The page you requested could not be found."
}));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error", {
    title: "Something went wrong",
    message: process.env.NODE_ENV === "production"
      ? "An unexpected error occurred."
      : err.message
  });
});

const PORT = process.env.PORT || 3000;
try {
  await sequelize.authenticate();
  console.log("JailTrack database connection established.");
  app.listen(PORT, () => console.log(`JailTrack running at http://localhost:${PORT}`));
} catch (error) {
  console.error("Unable to connect to MySQL:", error.message);
  process.exit(1);
}
