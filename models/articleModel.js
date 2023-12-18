const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title_ar: {
    type: String,
    required: true,
  },
  title_fr: {
    type: String,
    required: true,
  },
  body_ar: {
    type: String,
    required: true,
  },
  body_fr: {
    type: String,
    required: true,
  },
  mainImage:{
    type: String,
    required:true
  },
  all_images: [{
    type: String,
    required: false,
  }],
}, { timestamps: true });

const ArticleModel = mongoose.model("Article", articleSchema);

module.exports = ArticleModel;
