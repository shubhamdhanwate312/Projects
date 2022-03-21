const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId


const internSchema=new mongoose.Schema({

    name: { type:String,
        reqiured:true,
        trim:true},

    email: {type:String, 
        unique:true, 
        trim: true,
         reqiured:true },
                
    mobile: {type:Number,
        reqiured:true,
        unique:true,
        trim:true, },
 
    collegeId: {type:ObjectId,
         ref:"collegeDB" ,
         reqiured:true,
         trim:true},
 
   isDeleted: {type:Boolean, default:false}



},{ timestamps: true})



  
module.exports = mongoose.model('internDB', internSchema)
