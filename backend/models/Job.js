const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  salary: { type: Number, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  logo: { type: String },
  isBookMarked: { type: Boolean, default: false },
  location: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  currency: { type: String, default: 'USD' }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
