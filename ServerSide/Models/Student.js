import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  phone:      { type: String, required: true },
  bloodGroup: { type: String, required: true },
  collegeId:  { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
  isApproved: { type: Boolean, default: null },

  // Optional details
  address:    { type: String},
  pincode:    { type: String },
  state:      { type: String},

  createdAt:  { type: Date, default: Date.now }
});

export default mongoose.model("Student", studentSchema);
