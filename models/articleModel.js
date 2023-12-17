const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
    required: false,
  }],
}, { timestamps: true });

const ArticleModel = mongoose.model("Article", articleSchema);

module.exports = ArticleModel;
