import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Contact Info
  phone: { type: String, required: true },
  address: { type: String, default: null },
  district: { type: String, default: null },
  state: { type: String, default: null },
  pincode: { type: String, default: null },

  // For Admin Approval
  isApproved: { type: Boolean, default: null },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("College", collegeSchema);
