const mongoose=require("mongoose")
const lederSchema=new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Ledger must be associated with an account"],
        index:true,
        immutable:true
    },
     amount:{
        type:Number,
        required:[true,"Amount is required for creating a transaction"],
        min:[0,"Transaction amount can not be negative"],
        immuable:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true,"Ledger must be associated with a transaction"],
        index:true,
        immutable:true
    },
type:{
    type:String,
    enum:{
        values:["CREDIT",'DEBIT']
    },
    required:[true,"ledger type is requied"],
    immutable:true

}
})
function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted")

}
lederSchema.pre('findOneAndUpdate',preventLedgerModification)
lederSchema.pre("updateOne",preventLedgerModification)
lederSchema.pre("deleteOne",preventLedgerModification)
lederSchema.pre("remove",preventLedgerModification)
lederSchema.pre("deleteMany",preventLedgerModification)
lederSchema.pre("updateMany",preventLedgerModification)
lederSchema.pre("findOneAndDelete",preventLedgerModification)
lederSchema.pre("findOneAndReplace",preventLedgerModification)
const ledgerModel=mongoose.model('ledger',lederSchema)
module.exports=ledgerModel