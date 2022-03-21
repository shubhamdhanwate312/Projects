const mongoose = require('mongoose');

const autherSchema = new mongoose.Schema({

        firstName: { type: String, required: true, trim: true },

        lastName: { type: String, required: true, trim: true },

        title: { type: String, required: true, enum: ["Mr", "Mrs", "Miss"], trim:true },

        email:{
                type:String,
                unique:true,
                trim: true,
                },

        password: { type: String, required: true, trim: true }

}, { timestamps: true });


module.exports = mongoose.model('Auther', autherSchema) 
