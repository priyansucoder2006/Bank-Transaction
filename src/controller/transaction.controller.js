const transactionModel=require("../models/transaction.model")
const ledgermodel=require("../models/ledger.model")
const accountModel = require("../models/account.model")
const mongoose = require("mongoose")
async function createTransaction(req,res){
    const {fromAccount,toAccount,amount,idempotencyKey}=req.body
}
async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAccount, amount and idempotencyKey are required"
        });
    }

    const toUserAccount = await accountModel.findById(toAccount);

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid Account"
        });
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    });

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "System user not found"
        });
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // 1. Create transaction
        const transaction = new transactionModel({
            fromAccount: fromUserAccount._id,
            toAccount: toAccount,
            amount: amount,
            idempotencyKey: idempotencyKey,
            status: "PENDING"
        });

        // 2. Save transaction FIRST
        await transaction.save({ session });

        // 3. Create debit ledger entry
        await ledgermodel.create(
            [{
                account: fromUserAccount._id,
                amount: amount,
                transaction: transaction._id,
                type: "DEBIT"
            }],
            { session }
        );

        // 4. Create credit ledger entry
        await ledgermodel.create(
            [{
                account: toAccount,
                amount: amount,
                transaction: transaction._id,
                type: "CREDIT"
            }],
            { session }
        );

        // 5. Complete transaction
        transaction.status = "COMPLETED";

        await transaction.save({ session });

        // 6. Commit
        await session.commitTransaction();

        return res.status(201).json({
            message: "Initial funds transaction successfully",
            transaction
        });

    } catch (error) {

        await session.abortTransaction();

        console.error("Initial funds transaction error:", error);

        return res.status(500).json({
            message: error.message
        });

    } finally {
        session.endSession();
    }

    

}
    
module.exports={createTransaction,createInitialFundsTransaction}