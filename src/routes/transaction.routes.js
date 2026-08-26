const express=require("express")
const authController=require("../controller/auth.controller")
const { authMiddleware, authSystemUsrMiddleware } = require("../Middleware/auth.middleware")
const transactionModel = require("../models/transaction.model")
const { createInitialFundsTransaction, createTransaction } = require("../controller/transaction.controller")
const router=express.Router()
router.post("/",authMiddleware,createTransaction)
router.post("/system/initial-funds",authSystemUsrMiddleware,createInitialFundsTransaction)
module.exports=router
