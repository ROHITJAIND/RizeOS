const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema(
  {
    
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    skills: {
      type: [String], 
      required: true,
    },
    budget: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('Job', JobSchema);