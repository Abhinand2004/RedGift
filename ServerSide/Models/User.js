import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:    { type: String, required: true },

  address:  { type: String, default: null },
  dob:      { type: String, default: null },
  gender:   { type: String, enum: ['Male', 'Female', 'Other'], default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
