import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true,  trim: true, },
  email: { type: String, required: true,unique: true, lowercase: true,  trim: true,},
  password: { type: String, required: true,},
  phone: { type: String, required: true,},
  address: { type: String, default: null,},
  district: { type: String, default: null, },
  state: { type: String, default: null,},
  pincode: { type: String,  default: null, },

  // Single uploaded certificate file path or URL
  certificateUrl: {
    type: String,
    default: null,
  },

  // Status set by admin
  isApproved: { type: Boolean, default: false,},

  bloodRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      default: [],
    },
  ],

  createdAt: { type: Date, default: Date.now,},
});

export default mongoose.model("Hospital", hospitalSchema);
