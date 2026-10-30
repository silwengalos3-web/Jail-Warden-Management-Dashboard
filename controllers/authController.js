import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

export const loginPage = (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
  res.render("login", { title: "Warden Login" });
};

export const login = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const user = await User.findOne({ where: { email, isActive: true } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    req.flash("error", "Invalid email or password.");
    return res.redirect("/login");
  }
  req.session.regenerate((error) => {
    if (error) return res.status(500).send("Unable to create session.");
    req.session.user = { id: user.id, fullName: user.fullName, email: user.email, role: user.role };
    req.session.save(() => res.redirect("/dashboard"));
  });
};

export const logout = (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
};
