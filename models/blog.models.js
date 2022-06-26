const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    authorId: {
      type: ObjectId,
      ref: "Author",
    },

    tags: {
      type: [String],
      required: true,
      lowercase: true
    },
    category: {
      type: [String],
      required: true,
      lowercase: true
    },
    subcategory: {
      type: [String],
      lowercase: true
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: String,
    },
    deletedAt: {
      type: String,
    },

    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
