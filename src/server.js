require("dotenv").config()
const connecttoDB=require("./config/db")
connecttoDB()






const app=require("./app")
app.listen(3000,()=>{
    console.log('Server is Running on port 3000')
})