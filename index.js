require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
// const multer = require('multer');
const multer = require('multer');
const upload = multer();
const userRoutes = require('./routes/users')
const articlesRoutes = require('./routes/articles');
// const fileupload = require('express-fileupload'); 

// express app
const app = express();

// middleware
app.use(express.json());
// app.use(fileupload({useTempFiles: true}))
app.use(upload.any());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {

  next();
});
app.use(cors());
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
// app.use(upload.array('images'));
//routes
app.use("/api/articles", articlesRoutes);
app.use('/api/user', userRoutes)
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