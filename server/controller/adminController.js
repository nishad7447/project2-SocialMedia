import jwt from "jsonwebtoken";
import User from "../model/user.js";
import Post from "../model/post.js";

const adminCredentials = {
  Email: "admin@gmail.com",
  Password: "123",
};

const adminController = {
  verifyAdmin: async (req, res) => {
    try {
      res.status(200).send({
        success: true,
        message: "user fetched success",
        role: req.userRole,
      });
    } catch (err) {
      res.status(400).send({
        success: false,
        message: err.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { Email, Password } = req.body;

      if (Email !== adminCredentials.Email) {
        return res.status(400).json({ message: "Admin does not exist" });
      }

      if (Password !== adminCredentials.Password) {
        return res.status(400).json({ message: "Incorrect credentials" });
      }

      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "1hr",
      });

      res.status(200).json({ token, role: "admin", message: "Login Success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
  allUsers: async (req, res) => {
    try {
      let users = await User.find().select("-Password");
      res.status(200).json({ success: true, users });
    } catch (error) {
      console.log(error, "fetching users failed");
      res.status(400).json({ message: "error fetching users", error });
    }
  },
  userBlockOrUnblock: async (req, res) => {
    try {
      const userId = req.body.userId;
      const user = await User.findById(userId);
      const isBlocked = user.Blocked;
      user.Blocked = !isBlocked;
      await user.save()
      res.status(200).json({message:"user Blocked/Unblocked successfully", success: true})
    } catch (error) {
      console.log(error, " users block or unblock failed");
      res
        .status(400)
        .json({ message: "error users block or unblock users", error });
    }
  },
  allposts:async(req,res)=>{
    try {

      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("userId", "ProfilePic UserName Name")
        .exec();
      res.status(200).json({success:true, posts})
    } catch (error) {
      console.log(error, " fetching all posts failed");
      res
        .status(400)
        .json({ message: "fetching all posts failed", error });
    }
  }
};

export default adminController;
