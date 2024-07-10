// models/Notification.js
import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: string;
  redirectionalId: mongoose.Types.ObjectId | string;
  message: string;
  read: boolean;
  action?: string;
  createdAt: Date;
}

const notificationSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  redirectionalId: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  action: { type: String},
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
