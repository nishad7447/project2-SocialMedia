import cloudinary from "../Utils/cloudinary.js";
import Comments from "../model/comment.js";
import Post from "../model/post.js";
import SavedPost from "../model/savedPost.js";
import User from "../model/user.js";
import bcrypt from "bcrypt";
import Razorpay from "razorpay";
import crypto from "crypto";
import Ad from "../model/sponsoredAd.js";
import Notification from "../model/Notification.js";

const userController = {
  createPost: async (req, res) => {
    try {
      if (req.files && req.files.length === 0) {
        console.log("no files Only content");
        const newPost = new Post({
          content: req.body.postText,
          userId: req.body.userId,
        });

        const savedPost = await newPost.save();
        console.log("Post saved to the database:", savedPost);
        res.status(200).json({ message: "Added new post" });
      } else {
        if (req.files[0].mimetype.includes("image")) {
          console.log(JSON.stringify(req.files), "json,req.files");
          const uploadedFile = await cloudinary.uploader.upload(
            req.files[0].path,
            { resource_type: "image" }
          );
          const newPost = new Post({
            content: req.body.postText,
            fileUrl: uploadedFile.url,
            userId: req.body.userId,
          });

          const savedPost = await newPost.save();
          console.log("Post saved to the database:", savedPost);
          res.status(200).json({ message: "Added new post" });
        } else if (req.files[0].mimetype.includes("video")) {
          console.log(JSON.stringify(req.files), "json,req.files");
          const uploadedFile = await cloudinary.uploader.upload(
            req.files[0].path,
            function (result) {
              console.log(result);
            },
            { resource_type: "video" }
          );

          //  const  v1_result_adapter = function (callback) {
          //     if (callback != null) {
          //       return function (result) {
          //         if (result.error != null) {
          //           callback(result.error);
          //           return;
          //         } else {
          //           callback(void 0, result);
          //           return;
          //         }
          //       };
          //     } else {
          //       return null;
          //     }
          //   };

          const newPost = new Post({
            content: req.body.postText,
            fileUrl: uploadedFile.url,
            userId: req.body.userId,
          });

          const savedPost = await newPost.save();
          console.log("Post saved to the database:", savedPost);
          res.status(200).json({ message: "Added new post" });
        } else {
          throw new Error("Unsupported file type");
        }
      }
    } catch (err) {
      console.error("Error handling file upload:", err);
      res.status(500).json({ error: "File upload failed." });
    }
  },
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("userId", "ProfilePic UserName Name Followers Followings")
        .exec();

      const userFields = ["ProfilePic", "UserName", "Followers", "Followings"];
      let users = await User.find().select(userFields.join(" "));
      users = users.filter((users) => users._id.toString() !== req.body.userId);

      const UserFollowersFollowings = await User.findById(
        req.body.userId
      ).populate("ProfilePic UserName Name Followers Followings");

      const NumPosts = await Post.find({ userId: req.body.userId });

      const ads = await Ad.find();
      const randomIndex = Math.floor(Math.random() * ads.length);
      const randomAd = ads[randomIndex];

      res
        .status(200)
        .json({
          UserFollowersFollowings,
          posts,
          users,
          randomAd,
          NumPosts: NumPosts.length,
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: `Server error ${error}` });
    }
  },
  commentPost: async (req, res) => {
    try {
      const { postId, comment, userId } = req.body;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      const newComment = new Comments({
        postId,
        content: comment,
        userId,
      });
      const commentPromise = newComment.save();
      post.comments.push(newComment._id);
      const postPromise = post.save();
      //added promise.allsettled
      const [commentResult, postResult] = await Promise.allSettled([
        commentPromise,
        postPromise,
      ]);
      console.log(commentResult, "cmtRRRRR,,,,,ppostrRRRR", postResult);
      if (commentResult.status === "rejected") {
        console.error(commentResult.reason);
        return res.status(500).json({ error: "Error saving comment" });
      }

      if (postResult.status === "rejected") {
        console.error(postResult.reason);
        return res.status(500).json({ error: "Error saving post" });
      }
      
      //notification
      if (userId !== post.userId) {
        // To avoid notifying the owner if they like their own post
        const newNotification = new Notification({
          userId: post.userId,
          type: "comment",
          postId: postId, 
          senderId:userId

        });
        await newNotification.save();
      }
      return res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
  getAllComments: async (req, res) => {
    try {
      const postId = req.params.id;
      const comments = await Comments.find({ postId })
        .sort({ createdAt: -1 })
        .populate("userId", "ProfilePic UserName")
        .exec();
      if (comments.length === 0) {
        return res
          .status(200)
          .json({ message: "No comments found for this post" });
      }
      return res.status(200).json({ comments });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
  like: async (req, res) => {
    try {
      const postId = req.params.id;
      const { userId } = req.body;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const indexOfUser = post.likes.indexOf(userId);
      if (indexOfUser !== -1) {
        post.likes.splice(indexOfUser, 1);
        await post.save();
        return res.status(200).json({ message: "unliked successfully" });
      } else {
        post.likes.push(userId);
        await post.save();

        // Create a notification for the post owner
        if (userId !== post.userId) {
          // To avoid notifying the owner if they like their own post
          const newNotification = new Notification({
            userId: post.userId,
            type: "like",
            postId: postId, 
            senderId:userId
          });
          await newNotification.save();
        }

        return res.status(200).json({ message: "Post liked" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
  savedpost: async (req, res) => {
    try {
      const postId = req.params.id;
      const { userId } = req.body;

      const existingUser = await SavedPost.findOne({ userId: userId });

      if (existingUser) {
        const existingSavedPost = existingUser.savedPosts.findIndex(
          (savedPost) => savedPost.postId.toString() === postId
        );
        console.log(existingSavedPost, "ex post");
        if (existingSavedPost !== -1) {
          existingUser.savedPosts.splice(existingSavedPost, 1);
          await existingUser.save();
          await Post.findByIdAndUpdate(postId, { $pull: { savedBy: userId } });
          console.log(
            "Post unsaved successfully for existing user:",
            existingUser
          );
          return res.status(200).json({ message: "Post unsaved successfully" });
        } else {
          existingUser.savedPosts.push({ postId: postId });
          await existingUser.save();
          await Post.findByIdAndUpdate(postId, { $push: { savedBy: userId } });
          console.log(
            "Post saved successfully for existing user:",
            existingSavedPost
          );
          return res.status(200).json({ message: "Post saved successfully" });
        }
      } else {
        const newSavedPost = new SavedPost({
          userId: userId,
          savedPosts: [{ postId: postId }],
        });
        const savedPostResult = await newSavedPost.save();
        console.log("Post saved successfully for new user:", savedPostResult);
        return res
          .status(200)
          .json({ message: "Post saved successfully for new user" });
      }
    } catch (error) {
      console.error("Error saving post:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  getAllSavedPosts: async (req, res) => {
    try {
      const { userId } = req.body;

      const savedPosts = await SavedPost.find({ userId }).populate({
        path: "savedPosts.postId",
        populate: {
          path: "userId",
          select: "UserName ProfilePic",
        },
      });
      console.log(JSON.stringify(savedPosts));
      res.status(200).json({ savedPosts });
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  logout: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      user.Online = false;
      console.log(userId, user);
      await user.save();
      res.status(200).json({ message: "Logout success" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deletePost: async (req, res) => {
    try {
      const postId = req.params.id;
      await Post.findByIdAndDelete(postId);
      res.status(200).json({ success: true, message: "Post deleted success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error in deletePost" });
    }
  },
  reportPost: async (req, res) => {
    try {
      const { postId, reason, userId } = req.body;
      // Find the post by postId
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ error: "Post not found." });
      }

      // Check if the user has already reported the post
      let existingReportIndex = -1;

      for (let i = 0; i < post.reports.length; i++) {
        if (post.reports[i].userId.toString() === userId) {
          existingReportIndex = i;
          break;
        }
      }
      console.log(existingReportIndex, "ext reportindx");
      if (existingReportIndex !== -1) {
        // If the user has already reported, update the reason if it's different
        if (post.reports[existingReportIndex].reason !== reason) {
          post.reports[existingReportIndex].reason = reason;
          await post.save();
          return res
            .status(200)
            .json({ success: true, message: "Report updated successfully." });
        } else {
          return res.status(200).json({
            success: true,
            message:
              "You have already reported this post with the same reason.",
          });
        }
      } else {
        // If the user is reporting for the first time, add their report to the reports array
        post.reports.push({ userId, reason });
        await post.save();
        return res
          .status(200)
          .json({ success: true, message: "Report submitted successfully." });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error in reportPost" });
    }
  },
  userProfile: async (req, res) => {
    try {
      const userId = req.params.id;
      const posts = await Post.find({ userId: userId })
        .sort({ createdAt: -1 })
        .populate("userId", "ProfilePic UserName Name")
        .exec();

      // const userFields = ["ProfilePic", "UserName","Followers","Followings"];
      // let users = await User.find().select(userFields.join(" "));
      // users = users.filter((users) => users._id.toString() !== userId);
      const followings = await User.findById(req.body.userId).populate(
        "ProfilePic UserName Name Followers Followings"
      );

      res.status(200).json({ posts, users: followings });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: `Server error ${error}` });
    }
  },
  userDetail: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      user.Password = "";
      res.status(200).json({ user, message: "user fetched successfully" });
    } catch (error) {
      console.log(error, "user fetched failed");
      res.status(400).json({ message: "user fetched failed", error });
    }
  },
  editPost: async (req, res) => {
    try {
      const { userId, postId, content } = req.body;
      await Post.findByIdAndUpdate(postId, { content: content });
      res.status(200).json({ message: "edit post successfully" });
    } catch (error) {
      console.log(error, "edit post failed");
      res.status(400).json({ message: "edit post failed", error });
    }
  },
  deleteComment: async (req, res) => {
    try {
      const commentId = req.params.id;
      await Comments.findByIdAndDelete(commentId);
      res
        .status(200)
        .json({ message: "delete comment successfully", success: true });
    } catch (error) {
      console.log(error, "delete comment failed");
      res.status(400).json({ message: "delete comment failed", error });
    }
  },
  editUser: async (req, res) => {
    try {
      const { Name, Email, Bio, Location, Occupation } = req.body;
      const user = await User.findOne({ Email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user's profile information
      user.Name = Name;
      user.Bio = Bio;
      user.Location = Location;
      user.Occupation = Occupation;

      if (req.files.length > 0) {
        console.log(JSON.stringify(req.files), "json,req.files");
        const uploadedFile = await cloudinary.uploader.upload(
          req.files[0].path,
          { resource_type: "image" }
        );

        user.ProfilePic = uploadedFile.url;
      }

      await user.save();
      user.Password = "";
      res
        .status(200)
        .json({ user, success: true, message: "Profile updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
  editUserPass: async (req, res) => {
    try {
      const { CurrentPass, NewPass, userId } = req.body;
      const user = await User.findById(userId);
      const isMatch = await bcrypt.compare(CurrentPass, user.Password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect Password" });
      } else if (CurrentPass === NewPass) {
        return res.status(400).json({ message: "New password same as old!!" });
      } else {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(NewPass, salt);
        user.Password = passwordHash;
        await user.save();

        res.status(200).json({
          success: true,
          message: "Password updated successfully",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "error Password change " });
    }
  },
  deactivateUserAcc: async (req, res) => {
    try {
      const userId = req.body.userId;
      const user = await User.findById(userId);
      const isBlocked = user.Blocked;
      user.Blocked = !isBlocked;
      await user.save();
      res
        .status(200)
        .json({ message: "user deactivated successfully", success: true });
    } catch (error) {
      console.log(error, " users deactivated failed");
      res.status(400).json({ message: "error deactivated  users", error });
    }
  },
  createOrder: async (req, res) => {
    try {
      const { amount } = req.body;
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_API_SECRET,
      });

      const options = {
        amount: Number(amount) * 100,
        currency: "INR",
        receipt: "receipt_order_74394",
      };

      const order = await instance.orders.create(options);
      console.log(order);
      if (!order) return res.status(500).send("Some error occurred");
      console.log(order, "This is orders");
      res.json(order);
    } catch (err) {
      console.log(err, "error order create");
      res.status(500).send(err);
    }
  },
  createAd: async (req, res) => {
    try {
      const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        Name,
        Link,
        Description,
        Amount,
        ExpiresWithIn,
        userId,
      } = req.body;

      const shasum = crypto.createHmac(
        "sha256",
        process.env.RAZORPAY_API_SECRET
      );
      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
      const digest = shasum.digest("hex");
      if (digest !== razorpaySignature) {
        return res.status(400).json({ message: "Transaction not legit!" });
      }

      const uploadedFile = await cloudinary.uploader.upload(req.files[0].path, {
        resource_type: "image",
      });
      console.log(userId, "userssid", req.body);
      const newAd = Ad({
        UserId: userId,
        Name,
        Link,
        Description,
        Amount,
        ExpiresWithIn,
        AdImage: uploadedFile.url,
        razorpayDetails: {
          orderId: razorpayOrderId,
          paymentId: razorpayPaymentId,
          signature: razorpaySignature,
        },
        timestamp: Date.now(),
      });

      const savedAd = await newAd.save();
      console.log(savedAd);
      res.json({
        success: true,
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      });
    } catch (err) {
      console.log(err, "error in payment confirmation and data adding db");
      res.status(500).send(err);
    }
  },
  follow: async (req, res) => {
    const { userId, oppoId } = req.body;
    try {
      const currentUser = await User.findById(userId);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const userToFollow = await User.findById(oppoId);
      if (!userToFollow) {
        return res.status(404).json({ message: "Opponent user not found" });
      }

      if (currentUser.Followings.includes(oppoId)) {
        return res.status(400).json({ message: "Already following" });
      }

      currentUser.Followings.push(oppoId);
      await currentUser.save();

      userToFollow.Followers.push(userId);
      await userToFollow.save();

      const newNotification = new Notification({
        userId: oppoId,
        type: "follow", 
        senderId:userId
      });

      await newNotification.save()

      return res.status(200).json({ message: "Follow successful" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  unfollow: async (req, res) => {
    const { userId, oppoId } = req.body;
    try {
      const currentUser = await User.findById(userId);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const userToUnfollow = await User.findById(oppoId);
      if (!userToUnfollow) {
        return res.status(404).json({ message: "Opponent user not found" });
      }

      if (!currentUser.Followings.includes(oppoId)) {
        return res.status(400).json({ message: "Not following this user" });
      }

      // Remove the opponent user's ID from the current user's Followings array and save
      currentUser.Followings = currentUser.Followings.filter(
        (id) => id.toString() !== oppoId
      );
      await currentUser.save();

      // Remove the current user's ID from the opponent user's Followers array and save
      userToUnfollow.Followers = userToUnfollow.Followers.filter(
        (id) => id.toString() !== userId
      );
      await userToUnfollow.save();

      return res.status(200).json({ message: "Unfollow successful" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  getFollowers: async (req, res) => {
    try {
      const userId = req.params.id;
      console.log(userId);
      const followers = await User.findById(userId).populate(
        "ProfilePic UserName Name Followers Followings"
      );
      console.log(followers);
      return res
        .status(200)
        .json({ followers, success: true, message: "getFollowers successful" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "getFollowers error" });
    }
  },
  getFollowings: async (req, res) => {
    try {
      const userId = req.params.id;
      const followings = await User.findById(userId).populate(
        "ProfilePic UserName Name Followers Followings"
      );

      return res
        .status(200)
        .json({
          followings,
          success: true,
          message: "getFollowings successful",
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "getFollowings error" });
    }
  },
  notifications:async(req,res)=>{
    try {
      const userId = req.body.userId; 
      const notifications = await Notification.find({ userId })
        .populate({path: 'senderId',select: 'ProfilePic UserName', })
        .populate({path: 'postId',select: 'content fileUrl', })
        .sort({ createdAt: -1 })
      // console.log(notifications)
      res.status(201).json({success: true,notifications,});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "notifications error" });
    }
  },
  removeMsgCount:async(req,res)=>{
    try{
      const notifiId=req.params.id
      console.log(notifiId,"niiifiiicatioin")
      var Notifications = await Notification.findById(notifiId);
      Notifications.msgCount=0
      Notifications.read=true
      await Notifications.save()
      res.status(201).json({success: true,Notifications,});
    }catch(error){
      console.error(error);
      return res.status(500).json({ message: "notifications removeMsgCount error" });
    }
  },
  clearAllNotifi:async(req,res)=>{
    try{
      const userId = req.body.userId; 
      await Notification.updateMany({ userId: userId }, { $set: { read: true } });

      res.status(200).json({ success: true, message: "All notifications marked as read." });

    }catch(error){
        console.log(error, "clearAllNotifi error catch");
        res.status(400).json({ error });
    }
  },
  delAllNotifi:async(req,res)=>{
    try{
      const userId= req.body.userId
      await Notification.deleteMany({userId:userId})

      res.status(200).json({success:true,message:'All notifications deleted'})
    }catch(error){
      console.log(error, "delAllNotifi error catch");
      res.status(400).json({ error });
   }
  }
};

export default userController;
