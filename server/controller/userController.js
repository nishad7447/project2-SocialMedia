import cloudinary from "../Utils/cloudinary.js";
import Comments from "../model/comment.js";
import Post from "../model/post.js";
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
       
        const userFields = ['ProfilePic', 'UserName'];
        let users = await User.find().select(userFields.join(' '))
        users = users.filter((users)=> users._id.toString() !== req.body.userId)
        
      res.status(200).json({posts,users});
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
        content:comment,
        userId,
      });
      await newComment.save();
      post.comments.push(newComment._id);
      await post.save()
      return res.status(201).json({ message: "Comment added successfully" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },
  getAllComments: async (req,res)=>{
    try {
      const postId  = req.params.id;
      const comments = await Comments.find({ postId }) .populate('userId', 'ProfilePic UserName').exec();
      if (comments.length === 0) {
        return res.status(200).json({ message: 'No comments found for this post' });
      }  
      return res.status(200).json({ comments });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }
};

export default userController;
