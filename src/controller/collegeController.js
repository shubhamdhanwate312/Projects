const CollegeModel=require('../models/collegeModel')


const isValid = function (value) {
    if (typeof value == undefined || value == null || value.length == 0) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
  
  }

const createCollege= async function(req, res){
 try{
  const data= req.body;

  if (Object.keys(data) != 0) {
    if (!isValid(data.name))
     { return res.status(400).send({ status: false, msg: "name is required" }) }
    if (!isValid(data.fullName)) 
    { return res.status(400).send({ status: false, msg: "full name is required" }) }
    if (!isValid(data.logoLink)) { return res.status(400).send({ status: false, msg: "logo is required " }) }
 
 const Name= await CollegeModel.findOne({name,fullName,logoLink})
 if(Name){
     return res.status(400).send({status:false, message:" college name is already exist"})
 }

const newCollege= await CollegeModel.create(data)
return res.status(201).send({status:true,data:newCollege})

}
else { return res.status(400).send({ ERROR: " Bad request " }) }


 }
 catch(err){
 return res.status(500).send({status:false, message:err.message})
 }
}


module.exports.createCollege = createCollege