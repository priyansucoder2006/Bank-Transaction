const transactionModel=require("../models/transaction.model")
const ledgermodel=require("../models/ledger.model")
const accountModel = require("../models/account.model")
async function createTransaction(req,res){
    const {fromAccount,toAccount,amount,idempotencyKey}=req.body
}
async function createInitialFundsTransaction(req,res){
    const {toAccount,amount,idempotencyKey}=req.body
    if(!toAccount||!amount||!idempotencyKey){
        return re.status(400).json({
            message:"toAccount,amount,idempotencykey required"
        })

    }
    const toUserAccount=await accountModel.findOne({
        _id:toAccount,
    })
    if(!toUserAccount){
        return res.status(400).json({
            message:"Invalid Account"
        })
    }
    const fromUserAccount=await accountModel.findOne({
        
        user:req.user._id
    })
    if(!fromUserAccount){
        return res.status(400).json({
            message:"System user Not found"
        })
    }
    const session=await mongoose.startSession()
    session.startTransaction()
    const transaction=await transactionModel.create([{
        fromAccount:fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    }],{session})
    const debitLedgerEntry=await ledgermodel.create([{
        account:fromUserAccount._id,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
        
    }],{session})
    const creditLedgerEntry=await ledgermodel.create([{
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"    
    }],{session})
    transaction.status="COMPLETED"
    await transaction.save({session})
    await session.commitTransaction()
    session.endSession()
    return res.status(201).json({
        message:"Initial funds transaction successfully",
        transaction:transaction
    })
    
}
module.exports={createTransaction,createInitialFundsTransaction}