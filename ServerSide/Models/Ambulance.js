// models/ambulanceModel.js

import mongoose from 'mongoose';

const ambulanceSchema = new mongoose.Schema({
  vehicleName: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  driverName: {
    type: String,
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    unique: true
  },
  driverPhone: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Ambulance = mongoose.model('Ambulance', ambulanceSchema);
export default Ambulance;
