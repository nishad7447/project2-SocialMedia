import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
      },
      fileUrl: {
        type: String,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      likes: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Likes',
      },
      comments: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comments'
      }]
    },{timestamps:true});

    const Post = mongoose.model('Post', postSchema);

export default Post;