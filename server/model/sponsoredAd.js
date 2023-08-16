import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    trim: true,
  },
  Link: {
    type: String,
    required: true,
    trim: true,
  },
  Description: {
    type: String,
    required: true,
    trim: true,
  },
  Amount: {
    type: Number,
    required: true,
  },
  ExpiresWithIn: {
    type: Number,
    required: true,
  },
  AdImage: {
    type: String,
    required: true,
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  razorpayDetails: {
    orderId: {
      type: String,
      required: true,
    },

    paymentId: {
      type: String,
      required: true,
    },

    signature: {
      type: String,
      required: true,
    },
  },
},
{ timestamps: true });

const Ad = mongoose.model('Ad', adSchema);

export default Ad;
