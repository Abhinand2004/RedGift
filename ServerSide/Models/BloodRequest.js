// models/requestModel.js
import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({

  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true,},
  requesterId: { type: mongoose.Schema.Types.ObjectId, required: true,},
  requesterType: { type: String, enum: ["user", "hospital","admin"], required: true, },
  message: { type: String,},
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending", },
  requestedAt: { type: Date, default: Date.now, },
  requestedUsername:{type:String},
 student: {
  type: [Object], 
  required: false
}


});

const Request = mongoose.model("Request", requestSchema);
export default Request;
