import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;
      if (!clerkId)
        return res.status(401).json({ msg: "Unauthorized - invalid token" });

      //find user in db
      const user = await User.findOne({ clerkId });
      if (!user) return res.status(401).json({ msg: "user not found" });
 
      // attach auth to user
      req.user = user;
  
      next();
    } catch (error) {
      console.error("Error in protect Route: ", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  },
];
