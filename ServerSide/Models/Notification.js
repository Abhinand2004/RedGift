// models/notificationModel.js

import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  adminId: {type: String,  required: true},
  adminName: { type: String,  required: true},
  announcement: { type: String, required: true},
  startDate: {  type: Date, required: true},
  lastDate: { type: Date, required: true},
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
