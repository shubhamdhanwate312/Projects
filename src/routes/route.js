const express = require('express');
const router = express.Router();

const AutherController= require("../controllers/AutherController")

const BlogController= require("../controllers/blogController")

const middleware=require("../middleware/authh")

// Auther routes------------------------------------------------------------------------
router.post("/auther",AutherController.createauther)
router.post("/login",AutherController.loginAuther)

// Blog routes--------------------------------------------------------------------------
router.post("/blog", middleware.authenticate, BlogController.createblog)
router.get("/getblogg", middleware.authenticate, BlogController.getBlog)
router.put("/updateblogg/:blogID", middleware.authenticate, BlogController.updateblog)
router.delete("/deleteblogg/:blogID",middleware.authenticate,BlogController.deletebyId)
router.delete("/deletequery",middleware.authenticate,BlogController.deletebyQuery)


module.exports = router;