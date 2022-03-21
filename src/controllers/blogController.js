const BlogModel = require("../models/blogModel")
const AutherModel = require("../models/autherModel")



const createblog = async function (req, res) {
  try {
    let data = req.body
    let auther = data.autherID
    let autherValid = await AutherModel.find({ _id: auther })

    if (Object.keys(autherValid).length === 0) {
      return res.status(400).send({ status: false, msg: "Enter a valid author" })
    }
    let savedData = await BlogModel.create(data)

    let blogCreated = await BlogModel.create(data);

    if (blogCreated.ispublished == true) {
      let blogUpdated = await BlogModel.findOneAndUpdate({ _id: blogCreated._id }, { publishedAt: Date.now() }, { new: true })
      return res.status(201).send({ status: true, data: blogUpdated })
    }

    return res.status(201).send({status:true,data: savedData })
  }
  catch (err) {
    return res.status(500).send({ statue: false, msg: err.message })
  }
}


let getBlog = async function (req, res) {
  try {
    let query = req.query
    let filter = {
      isdeleted: false,
      ispublished: true,
      ...query
    };
    let filterByquery = await BlogModel.find(filter)
    if (filterByquery.length == 0) {
      return res.status(400).send({status: false, msg: "Blog Not Found" })
    }
    else {
      return res.status(200).send({status: true, msg: filterByquery })
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }


}



const updateblog = async function (req, res) {
  try {
    let updateblog = req.params.blogId
    let body = req.body
    let updateAuth = await BlogModel.findById(updateblog)
    if (Object.keys(body).length === 0) {
      return res.status(400).send({ status: false, msg: "Enter Data to update." })
    }

    let blogValid = await BlogModel.findOne({ $and: [{ _id: updateblog }, { isdeleted: false }] })
    if (!blogValid) {
      return res.status(404).send({ status: false, msg: "given value is deleted" })
    }


    if (req.user != updateAuth.autherID) {
      return res.status(401).send({status: false, msg: "You are not authorised" })
    }
    console.log(updateAuth)
    if (!updateAuth) {
      return res.status(404).send({status: false, msg: "Invalid Blog" })
    }
    let updatedata = req.body;
    let updatedUser = await BlogModel.findOneAndUpdate({ _id: updateblog }, { title: updatedata.title, body: updatedata.body, tags: updatedata.tags, subcategory: updatedata.subcategory, ispublished: true }, { new: true, upsert: true });

    return res.status(200).send({ status: true, data: updatedUser })

  } catch (err) {
    return res.status(500).send({ Error: err.message })
  }

}



const deletebyId = async function (req, res) {
  try {
    let blogId = req.params.blogID
    const validId = await BlogModel.findById(blogId)

    if (req.user != validId.autherID) {
      return res.status(401).send({ status: false, msg: "You are not authoorised" })
    }
    console.log(validId)
    if (!validId) {
      return res.status(404).send({ status: false,msg: "blog ID is Invalid" })
    }

    const deleteData = await BlogModel.findOneAndUpdate({ _id: blogId, isdeleted: false }, { $set: { isdeleted: true, deletedAt: Date.now() } }, { new: true });
    console.log(deleteData)
    if (!deleteData) {
      return res.status(404).send({ status: false, msg: "no such blog exist" })
    }
    return res.status(200).send({ status: true, msg: "blog deleted" })

  } catch (err) {
    return res.status(500).send({ Error: err.message })
  }
}




const deletebyQuery = async function (req, res) {
  try {
    let input = req.query
    if (!input) {
      return res.status(400).send({ status: false, msg: "please provide input data" })
    }
    console.log(input)
  
    let deletedBlog = await BlogModel.updateMany({ $and: [input, { isdeleted: false }] }, { $set: { isdeleted: true, deletedAt: Date.now() } }, { new: true })
    if (deletedBlog.length > 0) {
      return res.status(200).send({ status: true, msg: "blog has been  deleted" })
    } else {
      return res.status(404).send({ status: false, msg: "No  data found" })
    }
  } catch (error) {
    return res.status(500).send({ error: error.message })
  }
}


module.exports.createblog = createblog
module.exports.getBlog = getBlog
module.exports.updateblog = updateblog
module.exports.deletebyId = deletebyId
module.exports.deletebyQuery = deletebyQuery