const CollegeModel = require('../models/collegeModel')
const InternModel = require('../models/internModel')

const isValid = function (value) {
  if (typeof value == undefined || value == null || value.length == 0) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true

}

/// CREATE COLLEGE............................................................................................

const createCollege = async function (req, res) {
  try {
    const data = req.body;

    if (Object.keys(data).length > 0){

      const { name, fullName, logoLink } = data
      if (!isValid(data.name)) { return res.status(400).send({ status: false, msg: "name is required" }) }

      if (!isValid(data.fullName)) { return res.status(400).send({ status: false, msg: "full name is required" }) }

      const collegeFullName = await CollegeModel.findOne({
        fullName: { "$regex": fullName, "$options": "i" }
      })
      if (collegeFullName) {
        return res.status(400).send({ status: false, message: "college already exist" })
      }

      if (!isValid(data.logoLink)) { return res.status(400).send({ status: false, msg: "logo is required " }) }

      if (!(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(logoLink))) {
        return res.status(400).send({ status: false, message: "please enter a valid logo link" })
      }
            const sentnce = data.fullName
            let FirstCaptal = convertFirstLetterToUpperCase(sentnce)
            function convertFirstLetterToUpperCase(sentnce) {
                var splitStr = sentnce.toLowerCase().split(' ');
                for (var i = 0; i < splitStr.length; i++) {
                    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
                }
                return splitStr.join(' ');
            }

      const Name = await CollegeModel.findOne({ name, fullName, logoLink });
      if (Name) {
        return res.status(400).send({ status: false, message: " college name is already exist" })
      }


      const newCollege = await CollegeModel.create(data)
      return res.status(201).send({ status: true, data: newCollege })
    }
    else { return res.status(400).send({ ERROR: " Invalid request " }) }

  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}

////....... GET COLLEGE DETAILS...................................................

const getcollegeDetails = async function (req, res) {
  try {
    {
      let collogename = req.query.collegeName

      if (!collogename)
        return res.status(400).send({ status: false, message: "please enter collageName" })

      let data = await CollegeModel.findOne({ name: collogename, isDeleted: false })

      if (!data)
        return res.status(400).send({ status: false, message: "NO such college " });

      const College_id = data._id
      let internDetails = await InternModel.find({ collegeId: College_id, isDeleted: false })
        .select({ _id: 1, name: 1, email: 1, mobile: 1 })

      let collegeDetails = {
        name: data.name,
        fullName: data.fullName,
        logoLink: data.logoLink,
        intersts: internDetails
      }
      return res.status(200).send({ status: true, data: collegeDetails })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).send({ status: false, message: err.message })
  }
}

module.exports.createCollege = createCollege
module.exports.getcollegeDetails = getcollegeDetails
