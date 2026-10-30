import { User } from "../models/User.js";
export const staffPage = async (req, res) => {
  const staff = await User.findAll({ attributes: ["id", "fullName", "email", "role", "isActive", "createdAt"], order: [["fullName", "ASC"]] });
  res.render("staff", { title: "Account Management", staff });
};
