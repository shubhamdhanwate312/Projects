const orderModel = require('../models/orderModel')
const userModel = require('../models/Usermodel')
const validator = require('../validator')
const cartModel = require('../models/cartModel')


const createOrder =  async function(req,res){
    try{
      let userIdFromParams= req.params.userId

      const requestBody=req.body
      const {cartId, cancellable,status }=requestBody


const cart=await cartModel.findOne({_id:cartId,userId:userIdFromParams})

   
    let totalQuantity = 0;
  const cartItems = cart.items;

    cartItems.forEach((items) => (totalQuantity += items.quantity));


    const newOrder = {
      userId: userIdFromParams,
      items: cart.items,
      totalPrice: cart.totalPrice,
      totalItems: cart.totalItems,
      totalQuantity: totalQuantity,
      cancellable,status
    };


    const createOrder = await orderModel.create(newOrder)
      console.log("6",createOrder)
    return res.status(201).send({status:true , data:createOrder})

    }catch(err){
      return res.status(500).send({ status: false, msg: err.message })
    }
}

// -----------------------------------------------------------------------------------------------------------------------


const updateOrder = async function (req, res) {
    try {

        const userId = req.params.userId
        const requestBody = req.body

        const { orderId } = requestBody

       if(!validator.isValid(orderId)){
        return res.status(400).send({ status: false, message: "Please enter orderId" })
       }

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "userId is in valid" })
        }
        if (!validator.isValidObjectId(orderId)) {
            return res.status(400).send({ status: false, message: "orderId is in valid" })
        }

        const isUserExists = await userModel.findById(userId)
        if (!isUserExists) {
            return res.status(404).send({ status: false, message: "userData not found" })
        }

        const isOrderExists = await orderModel.findOne({_id:orderId})
        if (!isOrderExists) {
            return res.status(404).send({ status: false, message: "orderData not found" })
        }

        if (isOrderExists.userId != userId) {
            return res.status(400).send({ status: false, message: "order  not belongs to the user" })
        }


        const updatedData = await orderModel.findOneAndUpdate({ _id: orderId, cancellable: true }, { status: "cancled", isDeleted:true , deletedAt:Date.now()}, { new: true })

        if (!updatedData) {
            return res.status(404).send({ status: false, message: "data not found for update" })
        }

        return res.status(200).send({ status: true, message: "order Cancelled successfully", data: updatedData })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}






module.exports = { createOrder, updateOrder }