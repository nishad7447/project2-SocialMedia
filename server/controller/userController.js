import cloudinary from "../Utils/cloudinary.js";
import Post from "../model/post.js";

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
      console.log(posts, "poooosts");
      res.status(200).json(posts);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: `Server error ${error}` });
    }
  },
};

export default userController;
