export function requireWarden(req, res, next) {
  if (!req.session.user) {
    req.flash("error", "Please sign in to continue.");
    return res.redirect("/login");
  }
  if (req.session.user.role !== "warden") {
    return res.status(403).render("error", {
      title: "Access denied",
      message: "This account is not authorized to access the Warden portal."
    });
  }
  next();
}
