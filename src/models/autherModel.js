const mongoose = require('mongoose');
// const validator = require('validator');
const autherSchema = new mongoose.Schema({

        firstName: { type: String, required: true, trim: true },

        lastName: { type: String, required: true, trim: true },

        title: { type: String, required: true, enum: ["Mr", "Mrs", "Miss"], trim:true },

        email:{
                type:String,
                unique:true,
                trim: true,
                // validate:{
                //       validator: validator.isEmail,
                //       message: '{VALUE} is not a valid email',
                //       isAsync: false
                //     }
                },

        password: { type: String, required: true, trim: true }

}, { timestamps: true });


module.exports = mongoose.model('Auther', autherSchema) 
