const express = require('express');
const router = express.Router();

const CollegeController=require("../controller/collegeController")
//const InternController=require("../controller/internController")



router.post('/functionup/colleges',CollegeController.createCollege)


module.exports = router;