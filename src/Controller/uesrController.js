const userModel = require("../models/Usermodel")
const validator = require("../validator.js")
const jwt = require("jsonwebtoken")
const aws = require("../aws")

const bcrypt = require("bcrypt");



const registerUser = async (req, res) => {
  try {
    const requestBody = req.body;

    const files = req.files;
   

    if (!validator.isValid(requestBody)) {
      return res.status(400).send({ status: false, message: "Invalid request , Body is required" });
    }

    if (!validator.isValidRequestBody(requestBody)) {
      return res.status(400).send({ status: false, msg: "please enter the user details" });

    }
    if (!validator.isValid(files)) {
      return res.status(400).send({ status: false, msg: "please insert the file-data" });
    }

    
    let { firstname, lastname, email, phone, password, address } = requestBody;
    

    if (!validator.isValid(firstname)) {
      return res.status(400).send({ status: false, msg: "please enter the first name" });
    }

    if (!validator.isValid(lastname)) {
      return res.status(400).send({ status: false, msg: "please enter the last name" });
    }

    if (!validator.isValid(email)) {
      return res.status(400).send({ status: false, msg: "please enter an email" });
    }

    if (!validator.validEmail(email)) {
      return res.status(400).send({ status: false, msg: "please enter the valid email" });
    }
    let isEmailAlreadyUsed = await userModel.findOne({ email });

    if (isEmailAlreadyUsed) {
      return res.status(400).send({ status: false, msg: `this ${email} is already registered` });

    }

    if (!validator.isValid(phone)) {
      return res.status(400).send({ status: false, msg: "please enter the phone no." });

    }

    if (!validator.validPhone(phone)) {
      return res.status(400).send({ status: false, msg: "please enter the valid phone no." });

    }

    let isPhoneAlreadyUsed = await userModel.findOne({ phone });

    if (isPhoneAlreadyUsed) {
      return res.status(400).send({ status: false, msg: `this ${phone} is already registered` });
    }

    if (!validator.isValid(password)) {
      return res.status(400).send({ status: false, msg: "please enter the password" });
    }

    if (!validator.isvalidPassword(password)) {
      return res.status(400).send({ status: false, msg: "please enter the valid password" });
    }

    let saltRounds = 10;
    let salt = await bcrypt.genSalt(saltRounds);
    let hash = await bcrypt.hash(password, salt);

    password = hash;


    if (!validator.isValid(address)) {
      return res.status(400).send({ status: false, msg: "please provide a address" });
    }

    if (!validator.isValid(address.shipping)) {
      return res.status(400).send({ status: false, msg: "please provide a shipping address" });
    }

    if (!validator.isValid(address.billing)) {
      return res.status(400).send({ status: false, msg: "please provide a billing address" });
    }

    if (!validator.isValid(address.shipping.street)) {
      return res.status(400).send({ status: false, msg: "please provide a shipping street" });
    }

    if (!validator.isValid(address.shipping.city)) {
      return res.status(400).send({ status: false, msg: "please provide a shipping city" });
    }

    if (!validator.isValid(address.shipping.pincode)) {
      return res.status(400).send({ status: false, msg: "please provide a shipping pincode" });
    }
    if (!validator.validPincode(address.shipping.pincode)) {
      return res.status(400).send({ status: false, msg: "Please provide valid shipping pincode" });
    }

    if (!validator.isValid(address.billing.street)) {
      return res.status(400).send({ status: false, msg: "please provide a billing street" });
    }

    if (!validator.isValid(address.billing.city)) {
      return res.status(400).send({ status: false, msg: "please provide a billing city" });
    }

    if (!validator.isValid(address.billing.pincode)) {
      return res.status(400).send({ status: false, msg: "please provide a billing pincode" });
    }
    if (!validator.validPincode(address.billing.pincode)) {
      return res.status(400).send({ status: false, msg: "Please provide valid billing pincode" });

    }


    let profileImage = await aws.uploadFile(files[0]);

    if (!profileImage) {
      return res.status(400).send({ status: false, msg: "error in uloading the files" });
    }


    const newUser = {
      firstname,
      lastname,
      email,
      profileImage,
      phone,
      password,
      address,
    };

    createdUser = await userModel.create(newUser);

    res.status(201).send({ status: true, msg: "user successfully created", data: createdUser });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};



////.........................................................................
const loginUser = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    if (!email || !password) return res.status(400).send({ status: false, msg: `Email and Password is mandatory field.` });

    if (!validator.isValid(email)) return res.status(400).send({ status: false, msg: "enter the valid email" });

    if (!/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email)) return res.status(400).send({ status: false, msg: "email ID is not valid" });

    if (!validator.isValid(password)) return res.status(400).send({ status: false, msg: "Enter the valid Password" });

    if (password.length < 8 || password.length > 15) return res.status(400).send({ status: false, msg: "Password length should be 8 to 15" });

    let user = await userModel.findOne({ email: email });
    if (!user)return res.status(400).send({ status: false, msg: "emailId is not correct" });

    let rightPwd = bcrypt.compareSync(password, user.password);
    if (!rightPwd) return res.status(400).send({ status: false, msg: "password is incorrect" });

    let token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours expiration time
        userId: user._id.toString(),
      },
      "Group24"
    );
    return res.status(200).send({status: true,msg: "login succesfully",data: { userId: user._id, token: token }});
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

///...............................................................................................

const getProfile = async function (req, res) {
  try {
    let userId = req.params.userId
    if (!validator.isValid(userId.trim())) {
      return res.status(400).send({ status: false, msg: "userId required" })
    }
    let getList = await userModel.findOne({ _id: userId })
    if (!getList) {
      return res.status(404).send({ status: false, msg: "not found " })
    }

    return res.status(200).send({ status: true, msg: "user profile details", data: getList })
  }
  catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}


/////.updateProfile.........................................................................................................

const updateProfile = async function (req, res) {

  try {
    let updateData = req.params.userId
    let updatingdata = req.body
    let filedata = req.files

    let profileImg = await aws.uploadFile(filedata[0]);

    if (!profileImg) {
      return res.status(400).send({ status: false, msg: "error in uloading the files" });
    }

    const { firstname, lastname, email, profileImage, phone, password, address } = updatingdata



    if (validator.validEmail(updatingdata.email)) {

      let isEmailAlreadyUsed = await userModel.findOne({ email });

      if (isEmailAlreadyUsed == email) {
        return res.status(400).send({ status: false, msg: `this ${email} is already registered` });

      }
    }

    if (validator.isValid(phone)) {

      if (!validator.validPhone(phone)) {
        return res.status(400).send({ status: false, msg: "please enter the valid phone no." });

      }

      let isPhoneAlreadyUsed = await userModel.findOne({ phone });

      if (isPhoneAlreadyUsed) {
        return res.status(400).send({ status: false, msg: `this ${phone} is already registered` });
      }
    }

    if (validator.isValid(password)) {


      if (!validator.isvalidPassword(password)) {
        return res.status(400).send({ status: false, msg: "please enter the valid password" });
      }
    

    let saltRounds = 10;
    let salt = await bcrypt.genSalt(saltRounds);
    let hash = await bcrypt.hash(password, salt);

    password = hash;

    }

    if (validator.isValid(address)) {

    if (!validator.isValid(address.shipping)) {
      return res.status(400).send({ status: false, msg: "please provide a shipping address" });
    }

    if (!validator.isValid(address.billing)) {
      return res.status(400).send({ status: false, msg: "please provide a billing address" });
    }

    if (!validator.isValid(address.shipping.street)) {
      return res.status(400).send({ status: false, msg: "please provide a shipping street" });
    }

    if (!validator.isValid(address.shipping.city)) {
      return res.status(400).send({ status: false, msg: "please provide a shipping city" });
    }

    if (!validator.isValid(address.shipping.pincode)) {
      return res.status(400).send({ status: false, msg: "please provide a shipping pincode" });
    }
    if (!validator.validPincode(address.shipping.pincode)) {
      return res.status(400).send({ status: false, msg: "Please provide valid shipping pincode" });
    }

    if (!validator.isValid(address.billing.street)) {
      return res.status(400).send({ status: false, msg: "please provide a billing street" });
    }

    if (!validator.isValid(address.billing.city)) {
      return res.status(400).send({ status: false, msg: "please provide a billing city" });
    }

    if (!validator.isValid(address.billing.pincode)) {
      return res.status(400).send({ status: false, msg: "please provide a billing pincode" });
    }
    if (!validator.validPincode(address.billing.pincode)) {
      return res.status(400).send({ status: false, msg: "Please provide valid billing pincode" });

    }
  }


    let updateone = { firstname, lastname, email, profileImage, phone, password, address }

    let updaterUser = await userModel.findByIdAndUpdate({ _id: updateData }, { updateone, profileImage: profileImg }, { new: true })

    return res.status(200).send({ status: true, message: "User profile details", data: updaterUser })
  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}


module.exports = { updateProfile, loginUser, getProfile, registerUser }