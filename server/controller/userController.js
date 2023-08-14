import cloudinary from "../Utils/cloudinary.js";
import Comments from "../model/comment.js";
import Post from "../model/post.js";
import SavedPost from "../model/savedPost.js";
import User from "../model/user.js";

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
        .populate("userId", "ProfilePic UserName Name")
        .exec();

      const userFields = ["ProfilePic", "UserName"];
      let users = await User.find().select(userFields.join(" "));
      users = users.filter((users) => users._id.toString() !== req.body.userId);

      res.status(200).json({ posts, users });
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
      const commentPromise= newComment.save();
      post.comments.push(newComment._id);
      const postPromise = post.save();
      //added promise.allsettled
      const [commentResult,postResult]=await Promise.allSettled([commentPromise,postPromise])
      console.log(commentResult,"cmtRRRRR,,,,,ppostrRRRR",postResult)
      if (commentResult.status === 'rejected') {
        console.error(commentResult.reason);
        return res.status(500).json({ error: "Error saving comment" });
      }
  
      if (postResult.status === 'rejected') {
        console.error(postResult.reason);
        return res.status(500).json({ error: "Error saving post" });
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
      const comments = await Comments.find({ postId }).sort({ createdAt: -1 })
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
      res.status(200).json({success:true, message: "Post deleted success" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error in deletePost" });
    }
  },
  reportPost: async (req,res)=>{
    try {
      const { postId, reason, userId } = req.body;
      // Find the post by postId
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found.' });
      }
  
      // Check if the user has already reported the post
      let existingReportIndex = -1;

      for (let i = 0; i < post.reports.length; i++) {
        if (post.reports[i].userId.toString() === userId) {
          existingReportIndex = i;
          break;
        }
      }      
      console.log(existingReportIndex,'ext reportindx')
      if (existingReportIndex !== -1) {
        // If the user has already reported, update the reason if it's different
        if (post.reports[existingReportIndex].reason !== reason) {
          post.reports[existingReportIndex].reason = reason;
          await post.save();
          return res.status(200).json({success: true, message: 'Report updated successfully.' });
        } else {
          return res.status(200).json({success: true, message: 'You have already reported this post with the same reason.' });
        }
      } else {
        // If the user is reporting for the first time, add their report to the reports array
        post.reports.push({ userId, reason });
        await post.save();
        return res.status(200).json({success: true, message: 'Report submitted successfully.' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error in reportPost" });
    }
  },
  userProfile: async (req, res) => {
    try {
      const userId=req.params.id
      const posts = await Post.find({ userId: userId })
        .sort({ createdAt: -1 })
        .populate("userId", "ProfilePic UserName Name")
        .exec();

      const userFields = ["ProfilePic", "UserName"];
      let users = await User.find().select(userFields.join(" "));
      users = users.filter((users) => users._id.toString() !== userId);

      res.status(200).json({ posts, users });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: `Server error ${error}` });
    }
  },
  userDetail:async(req,res)=>{
    try{
      const userId=req.params.id
      const user=await User.findById(userId)
      user.Password=""
      res.status(200).json({user,message:"user fetched successfully"})
    }catch (error){
      console.log(error,'user fetched failed')
      res.status(400).json({message:"user fetched failed",error})
    }
  },
  editPost: async(req,res)=>{
    try{
      const {userId,postId,content}=req.body
      await Post.findByIdAndUpdate(postId, { content: content})
      res.status(200).json({message:"edit post successfully"})
    }catch(error){
      console.log(error,'edit post failed')
      res.status(400).json({message:"edit post failed",error})
    }
  }
};

export default userController;
