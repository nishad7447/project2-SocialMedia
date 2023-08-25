import jwt from "jsonwebtoken";
import User from "../model/user.js";
import Post from "../model/post.js";
import Ad from "../model/sponsoredAd.js";

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
  },
  allAds: async(req,res)=>{
    try {
      const ads = await Ad.find()
        .sort({ createdAt: -1 })
        .populate("UserId", "ProfilePic UserName Name")
        .exec();
      res.status(200).json({success:true, ads})
    } catch (error) {
      console.log(error, " fetching all ads failed");
      res
        .status(400)
        .json({ message: "fetching all ads failed", error });
    }
  },
  deleteAd: async (req, res) => {
    try {
      const adId = req.params.id;
      await Ad.findByIdAndDelete(adId)
      res.status(200).json({ success: true, message: "Ad deleted success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error in deleteAd" });
    }
  },
  dashboard:async(req,res)=>{
    try{

      const allUsers=await User.find()
      const allPosts=await Post.find()
      const allAds= await Ad.find()
      res.status(201).json({allUsers,allPosts,allAds,success:true})
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error in dashboard" });    }
  },
  calculate: async (req, res) => {
    try {
      const allAds = await Ad.find();
      
      const monthlyTotals = {
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0
      };
  
      allAds.forEach(ad => {
        const adDate = new Date(ad.createdAt);
        const monthName = adDate.toLocaleDateString('en-US', { month: 'long' });
  
        if (Object.keys(monthlyTotals).includes(monthName)) {
          monthlyTotals[monthName] += ad.Amount;
        }
      });
  
      res.status(200).json({monthlyTotals,success:true});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred calculate' });
    }
  },
  UserJoinTraffic:async(req,res)=>{
    try{
      const allUsers=await User.find()
      const JoinMonthlyTotals = {
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October:0
      };
  
      allUsers.forEach(user => {
        const userDate = new Date(user.createdAt);
        const monthName = userDate.toLocaleDateString('en-US', { month: 'long' });
  
        if (Object.keys(JoinMonthlyTotals).includes(monthName)) {
          JoinMonthlyTotals[monthName] += 1;
        }
      });
  
      const numberOfMonths = Object.keys(JoinMonthlyTotals).length;
      const totalJoins = Object.values(JoinMonthlyTotals).reduce((total, count) => total + count, 0);
      const monthlyAverage = totalJoins / numberOfMonths;

      res.status(200).json({JoinMonthlyTotals,monthlyAverage,success:true});
    }catch(error){
      console.log(error)
      res.status(500).json({success:false,message:"Error fetching UserJoinTraffic"})
    }
  }
  
};

export default adminController;
