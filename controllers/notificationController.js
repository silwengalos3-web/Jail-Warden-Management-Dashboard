import { Notification } from "../models/Notification.js";
export const notificationsPage = async (req, res) => {
  const notifications = await Notification.findAll({ order: [["createdAt", "DESC"]], limit: 100 });
  res.render("notifications", { title: "Notifications", notifications });
};
