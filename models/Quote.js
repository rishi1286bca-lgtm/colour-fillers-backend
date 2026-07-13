import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Can be: Pending, Contacted, Completed
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Quote", quoteSchema);