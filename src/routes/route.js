const { Route } = require('express');
const express = require('express');
const router = express.Router();

const CollegeController=require("../controller/collegeController")

const InternController=require("../controller/internController")


// College Route...

router.post('/functionup/colleges',CollegeController.createCollege)

router.get('/functionup/collegeDetails',CollegeController.getcollegeDetails)

//Intern Route...

router.post('/functionup/intership',InternController.createIntern)



module.exports = router;
