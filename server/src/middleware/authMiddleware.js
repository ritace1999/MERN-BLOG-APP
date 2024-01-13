import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authCheck = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      const token = authHeader.split(" ")[1];

      const { userId } = jwt.verify(token, process.env.JWT_KEY);

      const user = await User.findById(userId).select("-password");

      if (user) {
        req.user = user;
        next();
      } else {
        next({
          msg: "User not found",
          status: 404,
        });
      }
    } catch (e) {
      next({
        msg: "Token Invalid",
        status: 403,
      });
    }
  } else {
    next({
      msg: "Not authorized",
      status: 401,
    });
  }
};

export const adminCheck = async (req, res, next) => {
  try {
    // Assuming your User model has an 'isAdmin' field that denotes admin privileges
    const user = req.user;

    if (user && user.admin) {
      next(); // User is an admin, continue with the next middleware
    } else {
      next({
        msg: "Access Denied",
        status: 403,
      });
    }
  } catch (error) {
    next({
      msg: "Error checking admin privileges",
      status: 500,
    });
  }
};
