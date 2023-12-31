require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const userRoutes = require('./api/users')
const articlesRoutes = require('./api/articles');
const { uploadImage } = require("./controllers/articleController copy");
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const upload = multer();



// express app
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {

  next();
});
app.use(cors());

//routes
app.post('/api/articles/upload', upload.single('mainimagee'),uploadImage)
app.use('/api/user', userRoutes)
app.use("/api/articles", articlesRoutes);
app.get("/", (req,res) => {
  res.json({msg:"app is running"})
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to DB");
    // listening for requests
    app.listen(process.env.PORT, () => {
      console.log(`server started at port ${process.env.PORT} noooooow`);
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("Not connected to DB");
  });
  module.exports = app;