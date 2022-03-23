const mongoose = require('mongoose');

const collegeSchema=new mongoose.Schema({
name : { type: String,
        lowercase:true,
         unique:true,
         trim:true,
         required:true,
},

fullName:{
    type: String,
         unique:true,
         trim:true,
         required:true,
},
logoLink:{
    type:String,
    required:true
},
isDeleted:{type:Boolean,default:false}



},{ timestamps: true})

module.exports = mongoose.model('collegeDB', collegeSchema)




