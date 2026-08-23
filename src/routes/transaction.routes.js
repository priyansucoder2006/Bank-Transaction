const express=require("express")
const authController=require("../controller/auth.controller")
const { authMiddleware, authSystemUsrMiddleware } = require("../Middleware/auth.middleware")
const transactionModel = require("../models/transaction.model")
const router=express.Router()
router.post("/",authMiddleware,transactionModel)
router.post("/system/initial-funds",authSystemUsrMiddleware)
module.exports=router
