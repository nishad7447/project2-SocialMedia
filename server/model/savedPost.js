import mongoose from 'mongoose';

const savedPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  savedPosts: [{
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  }],
});

const SavedPost = mongoose.model('SavedPost', savedPostSchema);

export default SavedPost;
