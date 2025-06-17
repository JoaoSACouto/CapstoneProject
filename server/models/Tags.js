const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Tag', tagSchema)
